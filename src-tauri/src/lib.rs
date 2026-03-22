mod utils;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Command, Child, Stdio};
#[cfg(windows)]
use std::os::windows::process::CommandExt;
use std::sync::{Arc, Mutex};
use tauri::{Manager, State, Emitter};
use std::io::{BufRead, BufReader};

// --- 輔助函式 (Top Level) ---

/// 遞迴複製目錄
fn copy_dir_all(src: impl AsRef<Path>, dst: impl AsRef<Path>) -> std::io::Result<()> {
    fs::create_dir_all(&dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let ty = entry.file_type()?;
        if ty.is_dir() {
            copy_dir_all(entry.path(), dst.as_ref().join(entry.file_name()))?;
        } else {
            fs::copy(entry.path(), dst.as_ref().join(entry.file_name()))?;
        }
    }
    Ok(())
}

/// 確保 samples 快取在 AppData 中是最新的 (由 setup 呼叫)
fn ensure_samples_cache(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    let app_data = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let cache_dir = app_data.join("samples_cache");
    
    // 取得安裝目錄下的來源路徑
    let resource_dir = app_handle.path().resource_dir().map_err(|e| e.to_string())?;
    let samples_src = resource_dir.join("resources").join("samples");

    // 如果來源路徑不存在 (可能在開發環境且沒放好 resources)，直接回傳快取路徑讓後續判斷
    if !samples_src.exists() {
        return Ok(cache_dir);
    }

    let src_meta = fs::metadata(&samples_src).map_err(|e| e.to_string())?;    let src_mtime = src_meta.modified().map_err(|e| e.to_string())?;

    let need_copy = if cache_dir.exists() {
        let cache_meta = fs::metadata(&cache_dir).map_err(|e| e.to_string())?;
        let cache_mtime = cache_meta.modified().map_err(|e| e.to_string())?;
        src_mtime > cache_mtime
    } else {
        true
    };

    if need_copy {
        println!("Updating samples cache...");
        if cache_dir.exists() { let _ = fs::remove_dir_all(&cache_dir); }
        copy_dir_all(&samples_src, &cache_dir).map_err(|e| e.to_string())?;
    }
    
    Ok(cache_dir)
}

// --- Tauri Commands ---

#[tauri::command]
async fn open_url(app_handle: tauri::AppHandle, url: String) -> Result<(), String> {
    let resource_dir = app_handle.path().resource_dir().map_err(|e| e.to_string())?;
    
    let paths_to_try = [
        resource_dir.join(&url),
        resource_dir.join("resources").join(&url),
        resource_dir.join("resources").join("docs").join(&url),
    ];

    for full_path in &paths_to_try {
        if full_path.exists() {
            let path_str = full_path.to_str().ok_or("Path to string failed")?;
            return webbrowser::open(path_str).map_err(|e| format!("{:?}", e));
        }
    }

    Err(format!("Help file not found: {}", url))
}

/// 進程管理器
struct ProcessState {
    child: Arc<Mutex<Option<Child>>>,
}

#[tauri::command]
async fn set_processing_path(app_handle: tauri::AppHandle, path: String) -> Result<(), String> {
    let config_dir = app_handle.path().app_data_dir().unwrap();
    if !config_dir.exists() {
        fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
    }
    let config_path = config_dir.join("processing_path.txt");
    fs::write(config_path, path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn run_processing(
    app_handle: tauri::AppHandle,
    state: State<'_, ProcessState>,
    code: String
) -> Result<String, String> {
    let cmd = utils::get_processing_cmd(&app_handle).ok_or("ERR_NO_PROCESSING".to_string())?;

    let temp_dir = app_handle.path().app_data_dir().unwrap().join("temp_sketch");
    let sketch_name = "HarmoNyxSketch";
    let sketch_dir = temp_dir.join(sketch_name);
    let pde_path = sketch_dir.join(format!("{}.pde", sketch_name));

    if !sketch_dir.exists() { fs::create_dir_all(&sketch_dir).map_err(|e| e.to_string())?; }
    fs::write(&pde_path, code).map_err(|e| e.to_string())?;
    
    let sketch_dir_str = sketch_dir.to_str().ok_or("Path error")?.replace(r"\\?\", "");

    // 資源掛載：連結 AppData 中的快取到 Sketch 目錄
    let app_data = app_handle.path().app_data_dir().unwrap();
    let samples_src = app_data.join("samples_cache");
    let samples_dest = sketch_dir.join("data");
    
    if samples_dest.exists() { let _ = fs::remove_dir_all(&samples_dest); }
    let _ = utils::create_platform_link(&samples_src, &samples_dest);
    
    stop_internal(&state).await;

    let mut command = Command::new(cmd);
    command.arg(format!("--sketch={}", sketch_dir_str))
        .arg("--run")
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    #[cfg(windows)]
    command.creation_flags(0x08000000);

    let mut child = command.spawn().map_err(|e| e.to_string())?;
    let stdout = child.stdout.take().ok_or("STDOUT error")?;
    let stderr = child.stderr.take().ok_or("STDERR error")?;
    
    let handle_out = app_handle.clone();
    std::thread::spawn(move || {
        let reader = BufReader::new(stdout);
        for line in reader.lines() { if let Ok(l) = line { let _ = handle_out.emit("processing-log", l); } }
    });

    let handle_err = app_handle.clone();
    std::thread::spawn(move || {
        let reader = BufReader::new(stderr);
        for line in reader.lines() { if let Ok(l) = line { let _ = handle_err.emit("processing-error", l); } }
    });

    *state.child.lock().unwrap() = Some(child);
    Ok("Started".to_string())
}

async fn stop_internal(state: &ProcessState) {
    let mut lock = state.child.lock().unwrap();
    if let Some(mut child) = lock.take() {
        let pid = child.id();
        #[cfg(windows)]
        {
            let mut kill_cmd = Command::new("taskkill");
            kill_cmd.args(&["/F", "/T", "/PID", &pid.to_string()]);
            kill_cmd.creation_flags(0x08000000);
            let _ = kill_cmd.output();
        }
        let _ = child.kill();
    }
}

#[tauri::command]
async fn stop_processing(state: State<'_, ProcessState>) -> Result<String, String> {
    stop_internal(&state).await;
    Ok("Stopped".to_string())
}

#[tauri::command]
async fn save_project(xml_content: String, path: String) -> Result<String, String> {
    fs::write(&path, xml_content).map_err(|e| e.to_string())?;
    Ok("Saved".to_string())
}

#[tauri::command]
async fn load_project(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn list_examples(app_handle: tauri::AppHandle) -> Result<serde_json::Value, String> {
    let samples_path = utils::get_samples_path(&app_handle);
    let examples_path = samples_path.parent().ok_or("Path error")?.join("examples");
    
    if !examples_path.exists() { return Err("Examples not found".to_string()); }

    let mut result = Vec::new();
    if let Ok(entries) = fs::read_dir(examples_path) {
        for entry in entries.filter_map(|e| e.ok()) {
            let path = entry.path();
            if path.is_dir() {
                let category = path.file_name().unwrap().to_str().unwrap().to_string();
                let mut items = Vec::new();
                if let Ok(sub_entries) = fs::read_dir(&path) {
                    for sub_entry in sub_entries.filter_map(|e| e.ok()) {
                        let sub_path = sub_entry.path();
                        let ext = sub_path.extension().and_then(|s| s.to_str()).unwrap_or("");
                        if ext == "nyx" || ext == "xml" {
                            items.push(serde_json::json!({
                                "name": sub_path.file_stem().unwrap().to_str().unwrap(),
                                "path": sub_path.to_str().unwrap()
                            }));
                        }
                    }
                }
                if !items.is_empty() {
                    result.push(serde_json::json!({ "category": category, "items": items }));
                }
            } else {
                let ext = path.extension().and_then(|s| s.to_str()).unwrap_or("");
                if ext == "nyx" || ext == "xml" {
                    result.push(serde_json::json!({
                        "name": path.file_stem().unwrap().to_str().unwrap(),
                        "path": path.to_str().unwrap()
                    }));
                }
            }
        }
    }
    Ok(serde_json::json!(result))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .manage(ProcessState {
            child: Arc::new(Mutex::new(None)),
        })
        .invoke_handler(tauri::generate_handler![
            run_processing, stop_processing, save_project, load_project, list_examples, set_processing_path, open_url
        ])
        .setup(|app| {
            // --- 啟動時檢查快取 ---
            let handle = app.handle().clone();
            std::thread::spawn(move || {
                if let Err(e) = ensure_samples_cache(&handle) {
                    eprintln!("Failed to ensure samples cache: {}", e);
                }
            });

            if cfg!(debug_assertions) {
                app.handle().plugin(tauri_plugin_log::Builder::default().level(log::LevelFilter::Info).build())?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
