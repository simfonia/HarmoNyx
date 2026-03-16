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

/// 跨平台目錄連結 (Windows 使用 Junction, Unix 使用 Symlink)
pub fn create_platform_link(target: &Path, link: &Path) -> std::io::Result<()> {
    if link.exists() {
        if link.is_dir() {
            fs::remove_dir_all(link)?;
        } else {
            fs::remove_file(link)?;
        }
    }
    
    // 確保父目錄存在
    if let Some(parent) = link.parent() {
        fs::create_dir_all(parent)?;
    }

    symlink_directory(target, link)
}

/// 智能搜尋 processing-java 執行檔路徑
pub fn get_processing_cmd() -> String {
    let cmd_name = if cfg!(target_os = "windows") {
        "processing-java.exe"
    } else {
        "processing-java"
    };

    // 1. 優先檢查 HarmoNyx 本地目錄 (專案根目錄下)
    // 注意: 這裡假設啟動路徑是專案根目錄，之後打包生產環境時需要再調整
    let local_path = Path::new("processing-3.5.4").join(cmd_name);
    if local_path.exists() {
        return local_path.to_str().unwrap().to_string();
    }

    // 2. 檢查系統 PATH
    if let Ok(_path) = which::which(cmd_name) {
        return cmd_name.to_string();
    }

    // 3. 針對此環境的硬編碼 Fallback (SynthBlocklyStage 遷移路徑)
    #[cfg(windows)]
    {
        let fallback = Path::new("C:/Workspace/SynthBlocklyStage/processing-3.5.4/processing-java.exe");
        if fallback.exists() {
            return fallback.to_str().unwrap().to_string();
        }
    }

    // 如果都找不到，回傳預設名稱
    cmd_name.to_string()
}
