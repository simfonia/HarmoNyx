# HarmoNyx 專案指南 (GEMINI.md)

## 專案概述
HarmoNyx 是一個獨立的創意編程 IDE，由 **WaveCode** 架構遷移而來。它結合了 Blockly 的視覺化邏輯與 **Processing (Java)** 的影音引擎。

## 關鍵規範 (Critical)

### 1. 全局變數初始化 (Pre-init)
由於 Vite 的 ESM 模組提升 (Hoisting) 特性，積木定義檔案會早於 `main.js` 中的賦值語句執行。
- **規範**: 所有全局變數、Mutators 與輔助函式必須定義在 `ui/src/preinit.js` 中。
- **規範**: `ui/src/main.js` 的**第一行**必須是 `import './preinit.js';`。

### 2. 後端通訊
- **指令**: `run_processing(code)`。
- **實作**: 位於 `src-tauri/src/lib.rs`。它會將程式碼寫入臨時目錄並執行 `processing-java`。
- **注意**: 應避免在 Java 代碼中使用硬編碼路徑，資源存取應透過 `data/` 資料夾。

### 3. 積木與產生器
- **來源**: 積木定義與產生器邏輯主要遷移自 `SynthBlocklyStage` (#stage)。
- **命名**: 使用 `Blockly.Processing` 作為產生器名稱。
- **風格**: 採用 zelos 渲染器，配色應對齊音訊 (Purple) 與視覺 (Blue) 分類。

### 4. Git 規範
- **排除**: `processing-3.5.4/` 與 `node_modules/` 嚴禁進入 Git 版本控制。
- **同步**: 任何架構異動需同步更新 `FILE_STRUCTURE.md`。

---
*最後更新日期：2026-03-16*
