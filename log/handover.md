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

## 待解問題
- 雖然目前能執行基礎繪圖，但複雜的音訊功能 (Minim) 仍依賴使用者的 `Documents/Processing/libraries`。後續需實作自動資源掛載。
- 專案存檔/讀檔功能尚未實作。

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
