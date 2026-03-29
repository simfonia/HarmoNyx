# HarmoNyx 專案結構 (FILE_STRUCTURE.md)

## 專案根目錄
C:\Workspace\HarmoNyx\
├───build.bat (一鍵打包腳本：自動建置前端與後端)
├───.gitignore
├───FILE_STRUCTURE.md
├───GEMINI.md (技術架構與關鍵規範)
├───LICENSE (MIT License)
├───README.md (GitHub Project Intro)
├───log\ (專案日誌與進度追蹤)
│   ├───details.md (技術細節紀錄)
│   ├───handover.md (任務交接)
│   ├───todo.md (任務清單)
│   ├───screen.png (樣式參考截圖)
│   └───work\ (每日工作日誌)
├───src-tauri\ (Tauri 後端 - Rust)
│   ├───resources\ (靜態資產與資源 - 移入此處以解決打包路徑問題)
│   │   ├───examples\ (內建 NYX 範例專案)
│   │   ├───modules\ (Blockly 模組定義)
│   │   └───samples\ (Minim 音訊樣本庫)
│   ├───src\
│   │   ├───lib.rs (主邏輯：進程管理、CMD黑窗隱藏、IO指令)
│   │   ├───main.rs (進入點)
│   │   └───utils.rs (路徑處理、資源搜尋優化)
│   ├───Cargo.toml (依賴管理)
│   ├───tauri.conf.json (Tauri 設定檔 - 資源路徑已簡化)
│   └───.gitignore (忽略資源副本)
├───ui\ (前端介面 - Vite + Vanilla JS)
│   ├───src\
│   │   ├───blocks\ (Blockly 積木定義)
│   │   ├───generators\ (Java/PDE 產生器)
│   │   ├───lang\ (語系檔 - zh-hant.js)
│   │   ├───modules\
│   │   │   ├───api.js (Tauri Invoke 封裝)
│   │   │   ├───mdi_manager.js (MDI 多分頁管理：獨立工作區、分頁切換)
│   │   │   ├───toolbar_manager.js (工具列邏輯：選單、IO、執行控制)
│   │   │   ├───minimap.js (模組化視覺型小地圖 - 自研組件)
│   │   │   ├───toolbox.js (工具箱 XML 結構定義)
│   │   │   └───ui_utils.js (搜尋引擎、日誌面板、Orphan 偵測)
│   │   ├───main.js (前端主程式：進入點、組件初始化、全域協調)
│   │   ├───preinit.js (ESM 全局變數初始化、Mutators、Utils)
│   │   ├───style.css (Nyx 風格全域樣式、佈局)
│   │   ├───toolbar.css (工具列與 Header 專屬樣式)
│   │   └───mdi.css (MDI 分頁標籤與佈局樣式)
│   ├───public\ (靜態檔案)
│   │   ├───icons\ (介面圖示)
│   │   └───lib\ (Blockly 核心庫與插件)
│   ├───index.html (HTML 骨架：分頁列、工作區容器與複合面板)
│   ├───package.json (依賴管理)
│   └───vite.config.ts (Vite 設定檔)
└───processing-3.5.4\ (影音引擎執行環境)

---
*最後更新日期：2026-03-29 (MDI 分頁系統與 Toolbar 模組化重構)*

- [2026-03-26] Updated documentation (sound_sources_*) and UI localization (main.js, en.js, zh-hant.js).
- [2026-03-27] Minimap modularization, self-injecting styles, and intuitive navigation logic.
- [2026-03-29] MDI implementation with independent workspaces (Undo/Redo support), Toolbar logic extraction, and UI/UX polishing.
