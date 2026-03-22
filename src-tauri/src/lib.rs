mod utils;
use std::fs;
use std::path::Path;
use std::process::{Command, Child, Stdio};
#[cfg(windows)]
use std::os::windows::process::CommandExt;
use std::sync::{Arc, Mutex};
use tauri::{Manager, State};

/// 進程管理器，用於追蹤當前執行的 Processing 實例
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
    // 1. 搜尋執行檔
    let cmd = match utils::get_processing_cmd(&app_handle) {
        Some(c) => c,
        None => return Err("ERR_NO_PROCESSING".to_string()),
    };

    // 2. 取得絕對目錄路徑 (回歸系統臨時目錄)
    let temp_dir = app_handle.path().app_data_dir().unwrap().join("temp_sketch");
    let sketch_name = "HarmoNyxSketch";
    let sketch_dir = temp_dir.join(sketch_name);
    let pde_path = sketch_dir.join(format!("{}.pde", sketch_name));

    // 3. 準備目錄
    if !sketch_dir.exists() {
        fs::create_dir_all(&sketch_dir).map_err(|e| e.to_string())?;
    }

    // 4. 寫入代碼
    fs::write(&pde_path, code).map_err(|e| e.to_string())?;
    
    // 取得絕對路徑字串並正規化
    let sketch_dir_str = sketch_dir.to_str().ok_or("Failed to convert sketch path")?
        .replace(r"\\?\", "");

    // 5. 資源掛載 (Junctions)
    let samples_src = utils::get_samples_path(&app_handle);
    let samples_dest = sketch_dir.join("data");
    let samples_src_norm = Path::new(samples_src.to_str().unwrap().replace(r"\\?\", "").as_str()).to_path_buf();
    
    if let Err(e) = utils::create_platform_link(&samples_src_norm, &samples_dest) {
        println!("Warning: Failed to create junction for samples: {}", e);
    }
    
    // 6. 終止舊進程 (如果存在)
    stop_internal(&state).await;

    // 7. 執行 processing-java
    println!("Executing: {} --sketch={} --run", cmd, sketch_dir_str);

    let mut command = Command::new(cmd);
    command.arg(format!("--sketch={}", sketch_dir_str))
        .arg("--run")
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    #[cfg(windows)]
    command.creation_flags(0x08000000); // CREATE_NO_WINDOW

    let mut child = command.spawn()
        .map_err(|e| e.to_string())?;

    let stdout = child.stdout.take().ok_or("Failed to open stdout")?;
    let stderr = child.stderr.take().ok_or("Failed to open stderr")?;
    
    use std::io::{BufRead, BufReader};
    use tauri::Emitter;

    let handle_out = app_handle.clone();
    std::thread::spawn(move || {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            if let Ok(l) = line {
                let _ = handle_out.emit("processing-log", l);
            }
        }
    });

    let handle_err = app_handle.clone();
    std::thread::spawn(move || {
        let reader = BufReader::new(stderr);
        for line in reader.lines() {
            if let Ok(l) = line {
                let _ = handle_err.emit("processing-error", l);
            }
        }
    });

    *state.child.lock().unwrap() = Some(child);
    Ok("Started".to_string())
}

/// 內部停止邏輯，支援強制終止進程樹
async fn stop_internal(state: &ProcessState) {
    let mut child_lock = state.child.lock().unwrap();
    if let Some(mut child) = child_lock.take() {
        let pid = child.id();
        println!("Stopping process PID: {}", pid);
        
        #[cfg(windows)]
        {
            let mut kill_cmd = Command::new("taskkill");
            kill_cmd.args(&["/F", "/T", "/PID", &pid.to_string()]);
            kill_cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW
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
    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    Ok(content)
}

#[tauri::command]
async fn list_examples(app_handle: tauri::AppHandle) -> Result<serde_json::Value, String> {
    let examples_path = utils::get_samples_path(&app_handle).parent().unwrap().join("examples");
    
    if !examples_path.exists() {
        return Err("Examples directory not found".to_string());
    }

    let mut result = Vec::new();
    if let Ok(entries) = fs::read_dir(examples_path) {
        for entry in entries.filter_map(|e| e.ok()) {
            let path = entry.path();
            if path.is_dir() {
                let dir_name = entry.file_name().into_string().unwrap();
                let mut files = Vec::new();
                if let Ok(sub_entries) = fs::read_dir(&path) {
                    for sub_entry in sub_entries.filter_map(|e| e.ok()) {
                        let sub_path = sub_entry.path();
                        if sub_path.extension().map_or(false, |ext| ext == "nyx" || ext == "xml") {
                            files.push(serde_json::json!({
                                "name": sub_entry.file_name().into_string().unwrap(),
                                "path": sub_path.to_str().unwrap().to_string()
                            }));
                        }
                    }
                }
                if !files.is_empty() {
                    result.push(serde_json::json!({
                        "category": dir_name,
                        "items": files
                    }));
                }
            } else if path.extension().map_or(false, |ext| ext == "nyx" || ext == "xml") {
                 result.push(serde_json::json!({
                    "name": entry.file_name().into_string().unwrap(),
                    "path": path.to_str().unwrap().to_string()
                }));
            }
        }
    }
    Ok(serde_json::json!(result))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_dialog::init())
    .manage(ProcessState {
        child: Arc::new(Mutex::new(None)),
    })
    .invoke_handler(tauri::generate_handler![
        run_processing, 
        stop_processing,
        save_project,
        load_project,
        list_examples,
        set_processing_path
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
