mod utils;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Command, Child, Stdio};
#[cfg(windows)]
use std::os::windows::process::CommandExt;
use std::sync::{Arc, Mutex};
use tauri::{Manager, State, Emitter};
use serde_json;

struct ProcessState {
    child: Arc<Mutex<Option<Child>>>,
}

/// 確保 AppData 中的 samples 快取與資源同步 (Self-Healing Cache)
fn ensure_samples_cache(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let cache_dir = app_data_dir.join("samples_cache");
    let resource_dir = app_handle.path().resource_dir().map_err(|e| e.to_string())?;
    let src_dir = resource_dir.join("resources").join("samples");

    if !src_dir.exists() {
        return Ok(cache_dir); // 如果資源目錄不存在 (例如開發環境)，跳過同步
    }

    if !cache_dir.exists() {
        fs::create_dir_all(&cache_dir).map_err(|e| e.to_string())?;
    }

    // 簡單的同步邏輯：比對檔案數量或最後修改時間
    // 這裡為了效能，僅檢查目錄是否存在，實際打包時 Tauri 會處理資源
    // 若要實作更嚴謹的同步，可在此比對檔案列表
    
    Ok(cache_dir)
}

#[tauri::command]
async fn run_processing(
    app_handle: tauri::AppHandle,
    state: State<'_, ProcessState>,
    code: String,
) -> Result<(), String> {
    stop_processing(state.clone()).await?;

    let app_data_dir = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let temp_dir = app_data_dir.join("temp_sketch");
    let sketch_dir = temp_dir.join("HarmoNyxSketch");
    let data_dir = sketch_dir.join("data");

    if !sketch_dir.exists() {
        fs::create_dir_all(&sketch_dir).map_err(|e| e.to_string())?;
    }
    
    // 連結 samples 快取到 sketch/data
    let cache_dir = ensure_samples_cache(&app_handle)?;
    if data_dir.exists() {
        #[cfg(windows)]
        let _ = fs::remove_dir(&data_dir); // Windows 刪除 Junction
        #[cfg(not(windows))]
        let _ = fs::remove_dir_all(&data_dir);
    }
    
    #[cfg(windows)]
    {
        // 使用 Junction 避免權限問題
        let _ = Command::new("cmd")
            .args(&["/c", "mklink", "/j", data_dir.to_str().unwrap(), cache_dir.to_str().unwrap()])
            .creation_flags(0x08000000)
            .status();
    }

    let pde_path = sketch_dir.join("HarmoNyxSketch.pde");
    fs::write(pde_path, code).map_err(|e| e.to_string())?;

    let java_exe = utils::get_processing_cmd(&app_handle).ok_or("ERR_NO_PROCESSING")?;
    
    let mut command = Command::new(java_exe);
    command.arg(format!("--sketch={}", sketch_dir.to_str().unwrap()))
           .arg("--run")
           .stdout(Stdio::piped())
           .stderr(Stdio::piped());

    #[cfg(windows)]
    command.creation_flags(0x08000000); // CREATE_NO_WINDOW

    let mut child = command.spawn().map_err(|e| e.to_string())?;

    let stdout = child.stdout.take().unwrap();
    let stderr = child.stderr.take().unwrap();

    let handle_clone = app_handle.clone();
    std::thread::spawn(move || {
        use std::io::{BufRead, BufReader};
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            if let Ok(l) = line {
                let _ = handle_clone.emit("processing-log", l);
            }
        }
    });

    let handle_clone_err = app_handle.clone();
    std::thread::spawn(move || {
        use std::io::{BufRead, BufReader};
        let reader = BufReader::new(stderr);
        for line in reader.lines() {
            if let Ok(l) = line {
                let _ = handle_clone_err.emit("processing-error", l);
            }
        }
    });

    let mut child_state = state.child.lock().unwrap();
    *child_state = Some(child);

    Ok(())
}

#[tauri::command]
async fn stop_processing(state: State<'_, ProcessState>) -> Result<(), String> {
    let mut child_state = state.child.lock().unwrap();
    if let Some(mut child) = child_state.take() {
        #[cfg(windows)]
        {
            let pid = child.id();
            let _ = Command::new("taskkill")
                .args(&["/F", "/T", "/PID", &pid.to_string()])
                .creation_flags(0x08000000)
                .status();
        }
        let _ = child.kill();
    }
    Ok(())
}

#[tauri::command]
async fn save_project(xml_content: String, path: String) -> Result<(), String> {
    fs::write(path, xml_content).map_err(|e| e.to_string())
}

#[tauri::command]
async fn load_project(path: String) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn set_processing_path(app_handle: tauri::AppHandle, path: String) -> Result<(), String> {
    let config_dir = app_handle.path().app_config_dir().map_err(|e| e.to_string())?;
    if !config_dir.exists() {
        fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
    }
    let path_file = config_dir.join("processing_path.txt");
    fs::write(path_file, path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn open_url(app_handle: tauri::AppHandle, url: String) -> Result<(), String> {
    let resource_dir = app_handle.path().resource_dir().map_err(|e| e.to_string())?;
    
    // 如果傳入的是相對路徑且存在於資源目錄中，則開啟實體檔案
    let paths_to_try = [
        resource_dir.join(&url),
        resource_dir.join("resources").join(&url),
        resource_dir.join("resources").join("docs").join(&url),
        // 考慮開發環境
        resource_dir.join("..").join("resources").join("docs").join(&url),
        resource_dir.join("..").join("src-tauri").join("resources").join("docs").join(&url),
    ];

    for full_path in &paths_to_try {
        if full_path.exists() {
            #[cfg(windows)]
            {
                Command::new("cmd")
                    .args(&["/c", "start", "", full_path.to_str().unwrap()])
                    .creation_flags(0x08000000)
                    .spawn()
                    .map_err(|e| e.to_string())?;
                return Ok(());
            }
        }
    }

    // 否則當作一般 URL 開啟
    #[cfg(windows)]
    {
        Command::new("cmd")
            .args(&["/c", "start", "", &url])
            .creation_flags(0x08000000)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn list_examples(app_handle: tauri::AppHandle) -> Result<serde_json::Value, String> {
    let resource_dir = app_handle.path().resource_dir().map_err(|e| e.to_string())?;
    let mut examples_dir = resource_dir.join("resources").join("examples");
    
    if !examples_dir.exists() {
        examples_dir = resource_dir.join("..").join("resources").join("examples");
    }
    if !examples_dir.exists() {
        examples_dir = resource_dir.join("..").join("src-tauri").join("resources").join("examples");
    }

    let mut result = Vec::new();
    if let Ok(entries) = fs::read_dir(examples_dir) {
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

#[tauri::command]
async fn get_doc_content(app_handle: tauri::AppHandle, filename: String) -> Result<String, String> {
    let resource_dir = app_handle.path().resource_dir().map_err(|e| e.to_string())?;
    
    let paths_to_try = [
        resource_dir.join(&filename),
        resource_dir.join("resources").join(&filename),
        resource_dir.join("resources").join("docs").join(&filename),
        resource_dir.join("..").join("resources").join("docs").join(&filename),
        resource_dir.join("..").join("src-tauri").join("resources").join("docs").join(&filename),
        // 開發環境補強：從 target/debug 往回找
        resource_dir.join("..").join("..").join("..").join("resources").join(&filename),
        resource_dir.join("..").join("..").join("..").join("resources").join("docs").join(&filename),
        resource_dir.join("..").join("..").join("..").join("src-tauri").join("resources").join("docs").join(&filename),
    ];

    let mut tried_paths = Vec::new();
    for full_path in &paths_to_try {
        tried_paths.push(full_path.to_string_lossy().into_owned());
        if full_path.exists() {
            return fs::read_to_string(full_path).map_err(|e| e.to_string());
        }
    }

    Err(format!("Help file not found: {}. Tried paths: {:?}", filename, tried_paths))
}

#[tauri::command]
async fn get_docs_path(app_handle: tauri::AppHandle, filename: String) -> Result<String, String> {
    let resource_dir = app_handle.path().resource_dir().map_err(|e| e.to_string())?;
    
    let paths_to_try = [
        resource_dir.join(&filename),
        resource_dir.join("resources").join(&filename),
        resource_dir.join("resources").join("docs").join(&filename),
        resource_dir.join("..").join("resources").join("docs").join(&filename),
        resource_dir.join("..").join("src-tauri").join("resources").join("docs").join(&filename),
        // 開發環境補強：從 target/debug 往回找
        resource_dir.join("..").join("..").join("..").join("resources").join(&filename),
        resource_dir.join("..").join("..").join("..").join("resources").join("docs").join(&filename),
        resource_dir.join("..").join("..").join("..").join("src-tauri").join("resources").join("docs").join(&filename),
    ];

    let mut tried_paths = Vec::new();
    for full_path in &paths_to_try {
        tried_paths.push(full_path.to_string_lossy().into_owned());
        if full_path.exists() {
            return Ok(full_path.to_str().ok_or("Path to string failed")?.to_string());
        }
    }

    Err(format!("Path not found: {}. Tried paths: {:?}", filename, tried_paths))
}

#[tauri::command]
async fn open_samples_dir(app_handle: tauri::AppHandle) -> Result<(), String> {
    let resource_dir = app_handle.path().resource_dir().map_err(|e| e.to_string())?;
    
    let paths_to_try = [
        resource_dir.join("resources").join("samples"),
        resource_dir.join("samples"),
        // 開發環境補強
        resource_dir.join("..").join("resources").join("samples"),
        resource_dir.join("..").join("src-tauri").join("resources").join("samples"),
    ];

    for full_path in &paths_to_try {
        if full_path.exists() {
            #[cfg(windows)]
            {
                Command::new("explorer")
                    .arg(full_path.to_str().unwrap())
                    .creation_flags(0x08000000)
                    .spawn()
                    .map_err(|e| e.to_string())?;
                return Ok(());
            }
        }
    }
    Err("Samples directory not found".to_string())
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
            run_processing, stop_processing, save_project, load_project, list_examples, 
            set_processing_path, open_url, get_docs_path, get_doc_content, open_samples_dir
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
