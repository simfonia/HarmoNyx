# HarmoNyx IDE 🎵🎨

HarmoNyx 是一個獨立的創意編程 IDE，專為藝術家與教育者設計。它結合了 **Blockly** 的視覺化積木邏輯與 **Processing (Java) + Minim** 強大的影音渲染引擎。

本專案由 [SynthBlockly Stage](https://github.com/simfonia/SynthBlocklyStage) 遷移而來，從 VS Code 擴充功能轉化為獨立的桌面應用程式，提供更穩定的執行環境與效能。

## ✨ 核心特色

- **視覺化積木程式設計**：基於 Google Blockly，提供直觀的音訊、視覺與邏輯積木。
- **Processing 強大整合**：生成的 Java (PDE) 程式碼可直接在 Processing 引擎執行，支援高品質的影音輸出。
- **Minim 音訊支援**：內建完整的 Minim 音訊庫支援，可輕鬆創作合成器、取樣器與效果器。
- **跨平台與權限優化**：在 Windows 上自動建立 Junction 資源連結，無需管理員權限即可存取音訊資源。
- **進程樹管理**：精確控制 Processing 執行視窗，支援一鍵重啟與強制終止。
- **現代化介面**：深色模式支援、Minimap 導航、多語系支援 (正體中文/English)。

## 🛠️ 技術架構

- **前端 (UI)**: [Vite](https://vitejs.dev/) + Vanilla JS + [Blockly](https://developers.google.com/blockly)。
- **桌面端 (Desktop)**: [Tauri 2.0](https://tauri.app/) (Rust)。
- **核心引擎 (Core Engine)**: [Processing (Java) 3.5.4](https://processing.org/)。
- **資源管理**: 透過 Rust 與 PowerShell/CMD 進行自動資源掛載。

## 🚀 快速開始

### 環境需求
- [Rust](https://www.rust-lang.org/tools/install) (用於編譯 Tauri 後端)。
- [Node.js](https://nodejs.org/) (用於前端開發)。
- [Processing 3.5.4](https://processing.org/download/) (需放置於專案根目錄的 `processing-3.5.4` 資料夾內)。

### 安裝與執行
1.  **複製專案**:
    ```bash
    git clone https://github.com/simfonia/HarmoNyx.git
    cd HarmoNyx
    ```
2.  **前端設定**:
    ```bash
    cd ui
    npm install
    cd ..
    ```
3.  **啟動開發模式**:
    ```bash
    npm run tauri dev
    ```
4.  **編譯正式版本**:
    ```bash
    npm run tauri build
    ```

## 📂 專案結構

- `src-tauri/`: Tauri (Rust) 後端邏輯，包含進程管理、路徑處理與 IO 指令。
- `ui/`: 前端程式碼，包含 Blockly 積木定義、產生器與 UI 介面。
- `resources/`: 內建音訊樣本 (`samples/`) 與範例專案。
- `log/`: 開發日誌、待辦事項與技術細節紀錄。

## 📜 授權 (License)

本專案採用 **MIT License** 授權。詳見 [LICENSE](LICENSE) 檔案。

---
*Developed with ❤️ by [simfonia](https://github.com/simfonia)*
