# HarmoNyx 專案指南 (GEMINI.md)

## 專案概述
HarmoNyx 是一個獨立的創意編程 IDE，結合了 Blockly 的視覺化邏輯與 **Processing (Java)** 的影音引擎。

## 關鍵規範 (Critical)

### 1. 全局變數初始化 (Pre-init)
由於 Vite 的 ESM 模組提升 (Hoisting) 特性，積木定義檔案會早於 `main.js` 中的賦值語句執行。
- **規範**: 所有全局變數、Mutators 與輔助函式必須定義在 `ui/src/preinit.js` 中。
- **規範**: `ui/src/main.js` 的**第一行**必須是 `import './preinit.js';`。

### 2. 後端通訊與執行機制 (Run/Stop)
- **指令**: `run_processing(code)` / `stop_processing()`。
- **後端實作**: `src-tauri/src/lib.rs`。
- **流程**:
  1. 將 Java 代碼寫入 AppData 中的 `temp_sketch/HarmoNyxSketch/HarmoNyxSketch.pde`。
  2. 自動將 `resources/samples` 透過 Junctions 掛載至 Sketch 的 `data/` 目錄。
  3. 智慧搜尋 `processing-java` 執行檔路徑並啟動子進程。
  4. 透過 `taskkill /F /T` 確保在停止時能徹底關閉 Process Tree。

### 3. 日誌串流 (Log Streaming)
- **實作**: 攔截進程的 `stdout` 與 `stderr`，並透過 Tauri Emitter 即時推送到前端。
- **前端監聽**: `main.js` 監聽 `processing-log` 與 `processing-error` 事件，並以彩色字體輸出至 Browser Console。

### 4. 資產與路徑 (Assets & Paths)
- **資源存放**: 所有的音訊樣本、內建模組與範例專案皆存放於 `resources/` 下。
- **智慧路徑**: `utils.rs` 的 `get_samples_path()` 會自動適應開發（根目錄）與生產（Resource Path）環境。

### 5. 積木與產生器 (Blocks & Generators)
- **遷移來源**: 完整對齊 SynthBlockly Stage (#stage)。
- **Java 強型別處理**: 產生器中使用 `floatVal()` 與 `getMidi()` (定義於 `_core.js`) 進行 Object 到 Primitive 的安全轉換。
- **顏色積木 Polyfill**: `CustomFieldColour` 實作了解決舊版插件不相容問題，並提供原生選色體驗。

---
*最後更新日期：2026-03-20*
