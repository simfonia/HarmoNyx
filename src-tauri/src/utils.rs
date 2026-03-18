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
    // 如果連結已存在，先刪除
    if link.exists() {
        if link.is_dir() {
            // Windows 下若是 Junction/Symlink，remove_dir_all 可能會刪除內容，
            // 建議使用 fs::remove_dir 或特定指令，但對於開發用途先這樣
            let _ = fs::remove_dir_all(link);
        } else {
            let _ = fs::remove_file(link);
        }
    }
    
    // 確保父目錄存在
    if let Some(parent) = link.parent() {
        let _ = fs::create_dir_all(parent);
    }

    #[cfg(windows)]
    {
        // Windows 使用 mklink /J 建立 Junction (不需管理員權限)
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
pub fn get_processing_cmd() -> String {
    let cmd_name = if cfg!(target_os = "windows") {
        "processing-java.exe"
    } else {
        "processing-java"
    };

    // 1. 檢查目前目錄
    let p1 = Path::new(cmd_name);
    if p1.exists() { return p1.to_str().unwrap().to_string(); }

    // 2. 檢查專案根目錄下的 processing-3.5.4 (往上找兩層，適應 src-tauri 開發環境)
    let search_paths = [
        Path::new("processing-3.5.4").join(cmd_name),
        Path::new("..").join("processing-3.5.4").join(cmd_name),
        Path::new("..").join("..").join("processing-3.5.4").join(cmd_name),
    ];

    for path in &search_paths {
        if path.exists() {
            return fs::canonicalize(path).unwrap().to_str().unwrap().replace("\\\\?\\", "").to_string();
        }
    }

    // 3. 檢查系統 PATH
    if let Ok(_path) = which::which(cmd_name) {
        return cmd_name.to_string();
    }

    // 4. 針對此環境的硬編碼 Fallback
    #[cfg(windows)]
    {
        let fallback = Path::new("C:/Workspace/SynthBlocklyStage/processing-3.5.4/processing-java.exe");
        if fallback.exists() {
            return fallback.to_str().unwrap().to_string();
        }
    }

    cmd_name.to_string()
}
