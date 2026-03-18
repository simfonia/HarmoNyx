# HarmoNyx 專案結構 (FILE_STRUCTURE.md)

## 專案根目錄
C:\Workspace\HarmoNyx\
├───.gitignore
├───FILE_STRUCTURE.md
├───GEMINI.md
├───LICENSE (MIT License)
├───README.md (GitHub Project Intro)
├───log\ (專案日誌與進度追蹤)
│   ├───details.md (技術細節紀錄)
│   ├───handover.md (任務交接)
│   ├───todo.md (任務清單)
│   └───work\ (每日工作日誌)
├───resources\ (靜態資產與資源)
│   ├───examples\ (內建範例專案)
│   ├───modules\ (Blockly 模組定義)
│   └───samples\ (音訊樣本庫)
├───src-tauri\ (Tauri 後端 - Rust)
│   ├───src\
│   │   ├───lib.rs (主邏輯、Tauri Commands)
│   │   ├───main.rs (進入點)
│   │   └───utils.rs (路徑處理、資源掛載工具)
│   ├───Cargo.toml (依賴管理)
│   └───tauri.conf.json (Tauri 設定檔)
├───ui\ (前端介面 - Vite + Vanilla JS)
│   ├───src\
│   │   ├───blocks\ (Blockly 積木定義)
│   │   ├───generators\ (Java/PDE 程式碼產生器)
│   │   ├───lang\ (語系檔)
│   │   ├───modules\ (UI 工具、API 介面、工具箱)
│   │   ├───main.js (前端進入點)
│   │   ├───preinit.js (ESM 全局變數初始化)
│   │   └───style.css (IDE 樣式設定)
│   ├───public\ (靜態檔案)
│   ├───index.html (HTML 骨架)
│   ├───package.json (依賴管理)
│   └───vite.config.ts (Vite 設定檔)
└───processing-3.5.4\ (影音引擎執行環境 - 建議手動放入)

---
*最後更新日期：2026-03-18*
