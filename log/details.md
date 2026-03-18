# HarmoNyx 技術細節 (Details)

## Blockly 顏色欄位修復 (CustomFieldColour)
由於 `field-colour.js` (第三方插件) 在下拉選單中使用 DOM 元素作為標籤，導致新版 Blockly 崩潰。我們在 `main.js` 中實作了 `CustomFieldColour` 類別：
1.  **繼承**: 繼承自 `Blockly.FieldTextInput`。
2.  **渲染**: 使用 `style.setProperty('fill', color, 'important')` 強制覆寫 `geras` 渲染器的 CSS，直接操作 SVG `rect` 元素的屬性。
3.  **互動**: 攔截點擊事件，動態建立 `<input type="color">` 並模擬點擊，以呼叫系統原生選色器。
4.  **對比**: 實作亮度計算公式，自動調整文字顏色 (黑/白) 以確保可讀性。

## Minimap Z-Index 同步
Minimap 預設不會監聽單純的點擊事件。我們在 `ui_utils.js` 的 `initMinimap` 中加入了 `Blockly.Events.CLICK` 監聽器。當積木被點擊時，我們會搜尋 Minimap SVG 中對應 ID 的元素，並將其 `appendChild` 到父節點末尾，從而強制將其移至最上層。

## Processing 執行路徑
- **搜尋策略**: `src-tauri/src/utils.rs` 會依序搜尋：
    1.  CWD (`src-tauri` 或發布目錄)
    2.  `../processing-3.5.4` (專案根目錄)
    3.  `../../processing-3.5.4`
    4.  系統 PATH
- **重要**: 開發時必須確保 `processing-3.5.4` 位於專案根目錄，且包含 `processing-java.exe`。

## i18n 初始化流程
1.  **HTML**: 使用 `data-i18n` 或 `data-i18n-title` 標記元素。
2.  **JS**: `main.js` 中的 `initI18n()` 函式會遍歷這些元素，並從 `Blockly.Msg` 查找對應字串填入 `innerText` 或 `title`。
3.  **時機**: 必須在 `Blockly.inject` 之後且 `zh-hant.js` 載入完成後呼叫。

## 啟動順序 (Boot Sequence)
由於 Vite 使用 ESM 並會將 `import` 提升，導致積木檔案在全局變數初始化前就執行。我們使用了 `preinit.js` 並在 `main.js` 第一行導入，確保 `window.SB_Utils` (包含 Mutators) 優先就緒。

## Minimap Toggle
- 按鈕掛載在 `#blocklyDiv`。
- 使用透明背景與 PNG 圖示。
- 支援 `Ctrl+M` 快捷鍵。

## Processing 呼叫邏輯
- 位於 `src-tauri/src/lib.rs` 的 `run_processing` 指令。
- 程式碼會寫入 `app_data_dir/temp_sketch/HarmoNyxSketch/HarmoNyxSketch.pde`。
- 呼叫 `processing-java --sketch=... --run`。
