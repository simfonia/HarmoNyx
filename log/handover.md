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

## 2026-03-25 (穩定性修復與 UI 強化)
- **核心穩定性 (Mutator & Generator)**:
    - **問題 (sb_setup_effect)**: 切換效果類型時出現 Can't move non-existent block 與 ReferenceError。
    - **解法**:
        1. 解決競態條件：改為單一事件源 (onchange + setTimeout)，並在銷毀 Input 前手動斷開/銷毀影子積木。
        2. 防禦性產生器：實作 safeValue 輔助函式，容許非同步更新期間插槽暫時缺失的情況。
- **舞台即時同步 (Visual Stage)**:
    - **問題**: 「超級表演舞台」的 ADSR 滑桿無法改變當前樂器的聲音。
    - **解法**: 在 java_libs.js 的 updateInstrumentUISync 中加入即時寫入邏輯，確保滑桿變動能立即更新到 instrumentADSR Map。
- **演奏邏輯 (Transpose)**:
    - **問題**: 按住琴鍵同時改變移調 (Transpose) 會導致 Note Off 發送錯誤的 MIDI 鍵號，產生卡音。
    - **解法**: 在 pcKeysHeld 中改為記錄完整的 Instrument:MidiNote 字串，Note Off 時直接使用原始鍵號，不再受當前移調值影響。
- **UI/UX 優化**:
    - **孤兒積木樣式**: 將未連接積木的樣式由單純變淡改為 **紅色邊框 (stroke)** 加 **高透明度 (0.9)**，大幅提升辨識度。
    - **翻譯補全**: 補上了 sb_create_harmonic_synth 與 sb_create_additive_synth 變連選單中的缺漏字串。

## 2026-03-26 (輔助面板重構與跨平台說明文件內嵌)
- **Smart Panel 優化**:
    - **標題**: 改為顯示 `ID: <type>`，提供純粹的技術索引。
    - **內嵌說明**: 實作 `iframe + srcdoc` 功能，支援直接在 IDE 內顯示 HTML 說明。
- **跨平台解決方案**:
    - **後端指令**: 新增 `get_doc_content` 與 `get_docs_path` 指令，解決 Vite 無法讀取外部 Resources 的問題。
    - **穩定性**: 捨棄了 Windows Junction 方案，現在開發環境不需要額外 OS 設置。
- **Melody 文件更新**: 新增「音名與八度表示 (Note Names & Octaves)」章節，並完成中英文同步。
