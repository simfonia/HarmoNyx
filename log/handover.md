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

## 2026-03-19 (產生器強化與環境回歸)
- **環境隔離實驗**: 
    - 嘗試透過 \--settings-path\ 實現可攜式模式，但因 Processing 3.5.4 指令限制與 BOM 編碼衝突失敗。
    - **最終決策**: 回歸與 #stage 一致的模式，由使用者自行安裝 Processing 環境。已清理所有專案內建庫。
- **產生器深度修復**:
    - **Logic/Lists**: 解決了 Java 強型別問題，確保 \String.valueOf\ 與 \ArrayList\ 引用正確。
    - **Placeholder**: 修正了 \{{KEY_...}}\ 佔位符未替換導致的編譯錯誤。
    - **衝突消除**: 移除了 \_core.js\ 與 \java_libs.js\ 之間重複的 \mtof\ 與 \
oteToMidi\ 定義。
- **UI 修復**: 成功修復了 Toolbar Tooltip 消失的問題，補齊了 \HARMONYX_\ 命名空間的翻譯。
- **路徑穩定性**: 將臨時 Sketch 目錄遷回 AppData 以確保多平台相容性，並強化了 Rust 端對 UNC 路徑的清理。

# HarmoNyx 任務交接 (Handover)

## 2026-03-18 (重大功能推進)
- **進程管理**: 
    - Rust 端已實作異步執行與強制停止。
    - 在 Windows 上使用 `taskkill /F /T` 確保 Processing 視窗能被正確關閉。
- **路徑處理**: `utils.rs` 現可自動向上層搜尋 `processing-3.5.4`，開發者無需手動複製執行檔至 `src-tauri`。
- **Blockly 深度修復**:
    - **CustomFieldColour**: 實作了完美的顏色選擇欄位 Polyfill，支援系統選色器與 SVG 強制渲染 (`!important`)。這解決了舊版插件與新版 Blockly 的衝突。
    - **Minimap**: 修復了點擊積木時 Minimap 圖層未同步更新的問題 (Z-Index Sync)。
    - **i18n**: 命名空間已統一為 `HARMONYX_`，且 Tooltip 與設定選單皆已正常運作。
    - **Generators**: 修復了 MIDI 輔助函式缺失導致的編譯錯誤。
- **UI 調整**:
    - 渲染器改回 `geras` 以獲得更緊湊的佈局。
    - 新增設定選單 (Settings Menu)。

## 2026-03-18 (全面遷移與 UI 強化)
- **核心遷移 (Migration)**: 
    - 已從 SynthBlockly Stage (#stage) 完整同步所有積木定義 (Blocks)、產生器 (Generators)、工具箱 (Toolbox) 與語系資源。
    - HarmoNyx 現已具備與 #stage 完全一致的邏輯與功能，並針對 Tauri 環境進行了 IO 與路徑優化。
- **介面優化 (UI Polishing)**: 
    - **下拉選單**: 實作「摺疊式 (Accordion)」選單，解決了長清單無法捲動與子選單被裁剪的衝突。
    - **暗色模式**: 針對影子積木與輸入欄位實作了高對比樣式 (白底深色字)，大幅提升可讀性。
    - **檔案 IO**: 支援 `.xml` 與 `.nyx` 格式，並加入自動檔案過濾器。
- **除錯支援**: 實作了 Processing 日誌串流，現在可以在瀏覽器 Console 中即時看到 Java 的輸出與錯誤訊息。

## 待解問題
- 產生器驗證：雖然已同步邏輯，仍建議持續測試複雜範例 (如 Launchpad 連動) 以確保 100% 行為一致。
- 效能監控：日誌串流在大量輸出時對前端效能的影響待觀察。


## 2026-03-16 (專案重生)
- **重大異動**: 專案已完全捨棄舊有的 React 原生結構，改以 **WaveCode** 的架構 (Tauri + Vite + Blockly) 為基底重啟。
- **技術架構**:
    - 前端: Vite + Vanilla JS (位於 `ui/`)。
    - 後端: Tauri 2.0 (Rust) + Processing 3.5.4。
    - 積木: 來自 SynthBlockly Stage (#stage)。
- **已解決問題**: 
    - 解決了 Minimap 圖示無法顯示的問題 (繼承 WaveCode 修復)。
    - 解決了積木載入時 `window.SB_Utils` 未定義的錯誤 (透過 `preinit.js` 第一行加載)。
- **當前狀態**: UI 已能正常開啟，待驗證 Processing 執行功能。
