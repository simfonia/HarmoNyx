## AppData 快取機制 (Self-Healing Cache)
為了解決 Windows `Program Files` 權限限制與 Junction 鎖定問題，HarmoNyx 採用「初始化快取」策略：
1.  **啟動檢查**: `lib.rs` 的 `ensure_samples_cache` 在 `setup` 階段執行。
2.  **時間戳比對**: 檢查 `resource_dir/resources/samples` 與 `app_data_dir/samples_cache` 的修改時間。若來源較新，則執行全量複製。
3.  **掛載**: 執行 Processing 時，直接將 `samples_cache` 連結至 Sketch 的 `data/`。

## WiX 打包注意事項
- **中文檔名**: WiX 3.x 對非 ASCII 檔名支援極差 (LGHT0311)。解決方案是將 `docs/` 下的 HTML 檔名全部改為英文 (如 `effects_zh.html`)。
- **語言設定**: `tauri.conf.json` 需設定 `wix.language = "zh-TW"` 以支援安裝介面中文。
- **首次啟動**: 安裝程式啟動的 Process 可能繼承錯誤的環境變數，建議手動重啟。

## Blockly 右鍵選單攔截
為了防止 Blockly 自動生成無效的 "Help" 選項，我們在 `main.js` 中攔截了 `Blockly.ContextMenu.populate_`：
1.  過濾掉所有 `text` 為 "Help" 或 "說明" 的項目。
2.  手動插入一個新的 "說明" 項目，並綁定 `block.showHelp()`。
3.  `showHelp` 覆寫為呼叫 Tauri 的 `open_url` 指令。

## Tauri 資源打包與路徑映射
- **問題**: 當使用 `resources: ["../resources/**/*"]` 進行打包時，WiX/Tauri 預設會保留相對路徑結構，導致安裝後出現 `_up_` 資料夾，破壞程式的路徑查找邏輯。
- **解法**: 使用物件語法進行明確映射：`{ "src": "../resources", "target": "resources" }`。這會將外部資源直接平鋪到安裝目錄下的 `resources/`，確保開發與生產環境的路徑結構一致。

## Windows 子進程黑窗隱藏 (CREATE_NO_WINDOW)
- **問題**: 在 Windows GUI 應用程式中透過 `std::process::Command` 執行 Console 程式 (如 `processing-java` 或 `cmd /c taskkill`) 時，會短暫跳出黑色的命令提示字元視窗，影響使用者體驗。
- **解法**: 必須使用 Windows 特有的擴充 trait `std::os::windows::process::CommandExt`。
- **實作**: 在建立 `Command` 物件後，呼叫 `.creation_flags(0x08000000)`。這個 flag 對應 Win32 API 的 `CREATE_NO_WINDOW`，能確保子進程在無窗模式下執行。

## Processing 3.5.4 指令限制
\processing-java.exe\ 不支援 \--settings-path\ 參數。若要自定義 settings，需透過變更使用者目錄或環境變數，但考慮到穩定性，目前已棄用此方案。

## 佔位符替換 (Regex)
產生器中的 \definitions_\ 內容可能被多次注入，使用 \.replace('string', ...)\ 僅會替換第一個匹配項。現已改用 \.replace(/regex/g, ...)\ 確保 PDE 中不殘留任何 \{{...}}\。

## Java 重複定義錯誤
\Blockly.Processing.definitions_\ 中的 Key 必須唯一。若 \_core.js\ 與 \isual_core.js\ 同時定義 \Helpers\，後者會覆寫前者。目前已將核心工具與視覺工具的 Key 分離，並移除 \java_libs.js\ 中重複的基礎函式。

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

## 日誌串流架構 (Log Streaming)
- **Rust Backend**: 使用 `Command::spawn()` 啟動 Processing 進程，並透過 `Stdio::piped()` 攔截 stdout 與 stderr。
- **異步監聽**: 開啟獨立的 Rust 執行緒 (`std::thread::spawn`) 持續讀取管線輸出，並透過 `app_handle.emit("processing-log", line)` 將每一行日誌即時推送到前端。
- **前端顯示**: `main.js` 監聽 Tauri 事件，並將日誌以彩色格式 (`%c`) 輸出至瀏覽器 Console，方便開發者除錯。

## UI/UX 優化細節
- **暗色主題對比度**: 
    - 針對 `Shadow Block` (影子積木) 強制設定文字顏色為 `#1a1a1a` (深灰)，解決亮背景導致白字無法辨識的問題。
    - 針對所有 `EditableText` (包含多行輸入) 實作「白底深色字」樣式。
- **摺疊式選單 (Accordion)**:
    - 為了同時支援垂直捲動與子選單顯示，棄用了側邊彈出 (Nested Hover) 樣式，改為內嵌摺疊。
    - CSS 結構：子選單 `.submenu` 與父項目 `.has-submenu` 為兄弟元素 (Sibling)，透過 `+` 選擇器控制顯示。
