# HarmoNyx IDE

HarmoNyx 是一個獨立的創意編程 IDE，結合了 **Blockly** 的視覺化邏輯與 **Processing (Java) + Minim** 的影音渲染引擎。本專案由 **WaveCode** 的穩定架構移植而來，繼承了其優異的 UI 佈局與 Minimap 實作。

## 技術架構
- **Frontend**: Vite + Vanilla JS + Blockly。
- **Desktop**: Tauri 2.0 (Rust)。
- **Core Engine**: Processing (Java) 3.5.4。
- **Communication**: 前端透過 Tauri `invoke` 呼叫 Rust 後端，再由 Rust 執行 `processing-java` 命令並管理進程。

## 快速開始
1.  進入 `ui/` 目錄：`cd ui`
2.  安裝套件：`npm install`
3.  啟動開發環境：`npm run tauri dev` (在根目錄執行)

## 核心功能
- **積木即程式碼**: 拖曳積木產生 PDE 程式碼。
- **即時預覽**: 點擊 Run 立即彈出 Processing 視窗執行。
- **現代化 UI**: 包含 Minimap 導航、深色主題與 zelos 渲染器。
