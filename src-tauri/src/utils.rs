use std::path::{Path, PathBuf};
use std::fs;
use tauri::Manager;

#[cfg(windows)]
use std::os::windows::fs::symlink_dir as symlink_directory;

#[cfg(unix)]
use std::os::unix::fs::symlink as symlink_directory;

/// 獲取專案資源路徑，自動適應開發與生產環境
pub fn get_resource_path(app_handle: &tauri::AppHandle, sub_path: &str) -> PathBuf {
    let base_path = app_handle.path().app_data_dir().expect("Failed to get app data dir");
    base_path.join(sub_path)
}

/// 獲取 samples 資料夾的路徑，自動適應開發與生產環境
pub fn get_samples_path(app_handle: &tauri::AppHandle) -> PathBuf {
    // 1. 檢查開發環境下的專案根目錄 (相對於 src-tauri 往上找)
    let search_paths = [
        PathBuf::from("resources/samples"),
        PathBuf::from("..").join("resources/samples"),
        PathBuf::from("..").join("..").join("resources/samples"),
    ];

    for path in &search_paths {
        if path.exists() {
            return fs::canonicalize(path).unwrap();
        }
    }

    // 2. 檢查生產環境 (Tauri Resource Path)
    app_handle.path().resource_dir().expect("Failed to get resource dir")
        .join("resources")
        .join("samples")
}

/// 跨平台目錄連結 (Windows 使用 Junction, Unix 使用 Symlink)
pub fn create_platform_link(target: &Path, link: &Path) -> std::io::Result<()> {
    if link.exists() {
        if link.is_dir() {
            let _ = fs::remove_dir_all(link);
        } else {
            let _ = fs::remove_file(link);
        }
    }
    
    if let Some(parent) = link.parent() {
        let _ = fs::create_dir_all(parent);
    }

    #[cfg(windows)]
    {
        let target_str = target.to_str().ok_or(std::io::Error::new(std::io::ErrorKind::Other, "Invalid target path"))?;
        let link_str = link.to_str().ok_or(std::io::Error::new(std::io::ErrorKind::Other, "Invalid link path"))?;
        
        let status = std::process::Command::new("cmd")
            .args(&["/C", "mklink", "/J", link_str, target_str])
            .status()?;
        
        if status.success() {
            Ok(())
        } else {
            Err(std::io::Error::new(std::io::ErrorKind::Other, "mklink failed"))
        }
    }

    #[cfg(unix)]
    {
        symlink_directory(target, link)
    }
}

/// 智能搜尋 processing-java 執行檔路徑
pub fn get_processing_cmd(app_handle: &tauri::AppHandle) -> Option<String> {
    let cmd_name = if cfg!(target_os = "windows") {
        "processing-java.exe"
    } else {
        "processing-java"
    };

    // 1. 檢查使用者自訂路徑 (儲存在 app_data 下的 config.txt)
    let config_path = app_handle.path().app_data_dir().unwrap().join("processing_path.txt");
    if config_path.exists() {
        if let Ok(saved_path) = fs::read_to_string(&config_path) {
            let p = Path::new(saved_path.trim());
            if p.exists() {
                return Some(p.to_str().unwrap().to_string());
            }
        }
    }

    // 2. 檢查 C:\processing-3.5.4 (Windows 優先)
    #[cfg(windows)]
    {
        let p_c = Path::new(r"C:\processing-3.5.4").join(cmd_name);
        if p_c.exists() { return Some(p_c.to_str().unwrap().to_string()); }
    }

    // 3. 檢查專案根目錄下的 processing-3.5.4 (相對於執行檔或開發目錄)
    let search_paths = [
        Path::new("processing-3.5.4").join(cmd_name),
        Path::new("..").join("processing-3.5.4").join(cmd_name),
        Path::new("..").join("..").join("processing-3.5.4").join(cmd_name),
    ];

    for path in &search_paths {
        if path.exists() {
            return Some(fs::canonicalize(path).unwrap().to_str().unwrap().replace(r"\\?\", "").to_string());
        }
    }

    // 4. 檢查系統 PATH
    if let Ok(path) = which::which(cmd_name) {
        return Some(path.to_str().unwrap().to_string());
    }

    None
}
