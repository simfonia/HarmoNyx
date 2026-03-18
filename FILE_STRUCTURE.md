# HarmoNyx 專案結構 (FILE_STRUCTURE.md)

C:\Workspace\HarmoNyx\
├───log\                    # 專案日誌與進度紀錄
│   ├───work\               # 每日工作細節
│   ├───todo.md             # 任務清單
│   ├───handover.md         # 跨對話任務交接
│   └───details.md          # 技術細節
├───src-tauri\              # Tauri (Rust) 後端邏輯
│   ├───src\
│   │   ├───lib.rs          # 指令註冊 (run_processing)
│   │   ├───main.rs         # 程式進入點
│   │   └───utils.rs        # 路徑解析與跨平台輔助
│   ├───Cargo.toml          # Rust 依賴配置
│   └───tauri.conf.json     # Tauri 應用配置
├───ui\                     # 前端 UI (Vite + Blockly)
│   ├───public\
│   │   ├───icons\          # UI 圖示
│   │   └───lib\            # 外部壓縮程式庫 (Blockly, Minimap)
│   ├───src\
│   │   ├───blocks\         # 積木定義 (遷移自 #stage)
│   │   ├───generators\     # Processing 產生器 (遷移自 #stage)
│   │   ├───modules\        # 核心模組 (api, toolbox, ui_utils)
│   │   ├───main.js         # 前端主進入點
│   │   ├───preinit.js      # 全局變數預初始化 (解決 ESM 提升問題)
│   │   └───style.css       # 介面樣式
│   ├───package.json        # 前端依賴配置
│   └───vite.config.js      # Vite 配置
├───processing-3.5.4\       # 內建 Processing 執行環境 (不進 Git)
├───GEMINI.md               # 專案開發規範 (Agent 必讀)
└───README.md               # 專案簡介
