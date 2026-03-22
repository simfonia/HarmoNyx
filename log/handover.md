## 2026-03-22 (Release v0.1.0 穩定版發布準備)
- **架構重構 (Self-Healing Cache)**:
    - **問題**: 解決了 Windows `Program Files` 權限導致的 `ArrayIndexOutOfBoundsException` 與 Junction 鎖定問題。
    - **解法**: 
        1. 在 Rust 後端 (`lib.rs`) 實作了 **AppData 快取機制**。
        2. 程式啟動時 (Setup 階段) 自動檢查並將 `resources/samples` 複製到 `AppData/Roaming/HarmoNyx/samples_cache`。
        3. 執行時，Processing 直接掛載這個位於 AppData 的安全路徑。
        4. 具備**時間戳偵測**：安裝新版時會自動更新快取。
- **打包修復**:
    - **WiX 編碼**: 強制將說明文件 (`docs/`) 下的中文檔名改為英文，並設定 `zh-TW` 語言代碼，解決 `LGHT0311` 錯誤。
    - **路徑偵測**: `open_url` 指令現在能智能搜尋安裝目錄與開發目錄，確保說明文件可開啟。
- **UI 優化**:
    - **版本檢查**: 修正了 GitHub Release 版本比較邏輯，並改用 Tauri API 獲取版本號。
    - **右鍵選單**: 使用 `populate_` 攔截器，徹底解決了「重複說明選項」的問題。
    - **下拉選單**: 修復了 `panning` 選項初始化警告。

## 已知特性 (Known Behaviors)
- **安裝後首次啟動**: 
    - 若在安裝完成畫面勾選「執行 HarmoNyx」，程式會由 `msiexec` 啟動，環境變數可能不完整，導致找不到資源。
    - **SOP**: 建議使用者**關閉安裝視窗後，手動雙擊桌面捷徑啟動**。若第一次啟動失敗，重開即可自動修復。

## 2026-03-22 (專案結構重整)
- **結構異動**: 為了解決 Tauri 打包與路徑問題，已將 `HarmoNyx/resources` **移入** `HarmoNyx/src-tauri/resources`。
- **打包配置**: `tauri.conf.json` 現可直接引用 `resources/**/*`，無需使用複雜的映射或相對路徑。
- **打包狀態**: 建議使用者重新執行完整打包流程。

## 2026-03-22 (第一次打包程序)
- **Release Build**: 啟動了第一次全系統打包 (v0.1.0)。
- **建置策略**: 由於 `beforeBuildCommand` 的相對路徑解析問題，決定採用「手動前端建置 + 忽略腳本」的策略。
  1. 手動執行 `npm run build` 於 `ui/`。
  2. 暫時將 `tauri.conf.json` 的 `beforeBuildCommand` 設為空。
  3. 執行 `cargo tauri build`。
- **資源整合**: 在 `tauri.conf.json` 中配置了 `resources` 打包路徑，確保 `samples/` 與 `examples/` 能正確發布。
- **建置狀態**: 目前背景執行 `cargo tauri build` (PID: 14464)。
