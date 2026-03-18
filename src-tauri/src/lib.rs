mod utils;
use std::fs;
use std::process::{Command, Child, Stdio};
use std::sync::{Arc, Mutex};
use tauri::{Manager, State};

/// 進程管理器，用於追蹤當前執行的 Processing 實例
struct ProcessState {
    child: Arc<Mutex<Option<Child>>>,
}

#[tauri::command]
async fn run_processing(
    app_handle: tauri::AppHandle,
    state: State<'_, ProcessState>,
    code: String
) -> Result<String, String> {
    // 1. 取得絕對目錄路徑
    let temp_dir = app_handle.path().app_data_dir().unwrap().join("temp_sketch");
    let sketch_name = "HarmoNyxSketch";
    let sketch_dir = temp_dir.join(sketch_name);
    let pde_path = sketch_dir.join(format!("{}.pde", sketch_name));

    // 2. 準備目錄
    if !sketch_dir.exists() {
        fs::create_dir_all(&sketch_dir).map_err(|e| e.to_string())?;
    }

    // 3. 寫入代碼
    fs::write(&pde_path, code).map_err(|e| e.to_string())?;
    
    // 取得絕對路徑字串
    let sketch_dir_str = sketch_dir.to_str().ok_or("Failed to convert path to string")?;

    // 4. 資源掛載 (Junctions)
    let samples_src = utils::get_samples_path(&app_handle);
    let samples_dest = sketch_dir.join("data"); // Processing 預期資源在 data/ 下
    if let Err(e) = utils::create_platform_link(&samples_src, &samples_dest) {
        println!("Warning: Failed to create junction for samples: {}", e);
    }
    
    // 5. 終止舊進程 (如果存在) - 呼叫共用的停止邏輯
    stop_internal(&state).await;

    // 6. 執行 processing-java
    let cmd = utils::get_processing_cmd();
    println!("Executing: {} --sketch={} --run", cmd, sketch_dir_str);

    let child = Command::new(cmd)
        .arg(format!("--sketch={}", sketch_dir_str))
        .arg("--run")
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .spawn();

    match child {
        Ok(c) => {
            *state.child.lock().unwrap() = Some(c);
            Ok("Started".to_string())
        }
        Err(e) => Err(format!("Failed to execute processing-java: {}. Path: {}", e, utils::get_processing_cmd())),
    }
}

/// 內部停止邏輯，支援強制終止進程樹
async fn stop_internal(state: &ProcessState) {
    let mut child_lock = state.child.lock().unwrap();
    if let Some(mut child) = child_lock.take() {
        let pid = child.id();
        println!("Stopping process PID: {}", pid);
        
        #[cfg(windows)]
        {
            // 在 Windows 上，使用 taskkill 強制殺掉進程樹 (/T)
            let _ = Command::new("taskkill")
                .args(&["/F", "/T", "/PID", &pid.to_string()])
                .output();
        }
        
        // 通用終止 (如果 taskkill 失敗或在非 Windows 平台)
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
        load_project
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
