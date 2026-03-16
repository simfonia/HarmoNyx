mod utils;
use std::fs;
use std::process::Command;
use tauri::Manager;

#[tauri::command]
async fn run_processing(app_handle: tauri::AppHandle, code: String) -> Result<String, String> {
    let temp_dir = app_handle.path().app_data_dir().unwrap().join("temp_sketch");
    let sketch_name = "HarmoNyxSketch";
    let sketch_dir = temp_dir.join(sketch_name);
    let pde_path = sketch_dir.join(format!("{}.pde", sketch_name));

    // 1. 準備目錄
    if !sketch_dir.exists() {
        fs::create_dir_all(&sketch_dir).map_err(|e| e.to_string())?;
    }

    // 2. 寫入代碼
    fs::write(&pde_path, code).map_err(|e| e.to_string())?;

    // 3. 處理資源掛載 (例如 samples)
    // TODO: 將真正的 samples 目錄連結到 sketch_dir/data
    
    // 4. 執行 processing-java
    let output = Command::new(utils::get_processing_cmd())
        .arg(format!("--sketch={}", sketch_dir.to_str().unwrap()))
        .arg("--run")
        .output();

    match output {
        Ok(out) => {
            if out.status.success() {
                Ok("Success".to_string())
            } else {
                Err(String::from_utf8_lossy(&out.stderr).to_string())
            }
        }
        Err(e) => Err(format!("Failed to execute processing-java: {}. Make sure it is in your PATH.", e)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_dialog::init())
    .invoke_handler(tauri::generate_handler![run_processing])
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
