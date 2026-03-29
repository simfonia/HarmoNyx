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

## Windows 子進程黑窗隱裝 (CREATE_NO_WINDOW)
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

## 2026-03-26 輔助面板 (Smart Panel) 優化與跨平台內嵌說明
### 1. 顯示邏輯重構
- **標題簡化**: 標題改為顯示 `ID: <block_type>` (例如 `ID: <visual_stage_setup>`)。這避免了與積木本身文字敘述的重複，並提供開發者所需的技術 ID。樣式採用 `Fira Code` 等寬字體與紫色霓虹光暈。
- **Tooltip 整合**: 積木的 `getTooltip()` 內容被移至說明文件的下方，作為快速功能摘要。

### 2. 跨平台內嵌說明 (srcdoc 方案)
- **核心挑戰**: Vite 開發伺服器無法存取 `ui/public` 以外的外部目錄 (如 `src-tauri/resources/docs`)，導致 `iframe` 直接請求路徑時會失敗或回退到首頁。
- **解決方案**: 
    1.  **Rust 指令**: 新增 `get_doc_content` 指令，由後端負責讀取實體檔案內容。
    2.  **前端注入**: 前端調用指令獲取 HTML 字串後，透過 `iframe.srcdoc` 進行注入。
- **優點**: 
    - **完全跨平台**: 擺脫了 Windows Junction 或 Unix Symlink 的作業系統依賴。
    - **穩定路徑**: 由 Rust 後端處理搜尋優先順序 (Resource Dir -> Dev Dir)，保證在開發與生產環境都能正確找到說明文件。
    - **無權限問題**: 避免了開啟 `asset` 協定的安全與配置複雜度。

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

## Blockly Mutator 競態條件與事件抑制 (sb_setup_effect 案例)
在實作具備動態插槽 (Dynamic Inputs) 的變連積木 (Mutator) 時，若同時使用 Validator 與 onchange 監聽器觸發 updateShape_，會導致重複調用，進而引發「找不到積木 ID (non-existent block)」錯誤。

### 關鍵陷阱 (The Pitfall)
1.  **影子積木銷毀**: emoveInput 會自動銷毀連接在上面的 Shadow Block。這會觸發 Blockly 的 Delete 事件。
2.  **事件衝突**: 如果此時使用者正在進行拖曳或其他操作，Blockly 的事件系統可能會嘗試引用那個「剛被標記為銷毀」的 Shadow Block ID。
3.  **非同步風險**: 若產生器 (Generator) 在插槽重建完成前執行，會讀取到空插槽，導致 ReferenceError。

### 解決方案 (The Fix)
1.  **Validator 唯一觸發**: 棄用 FIELD_HELPER.onchange，僅使用 Validator (或反之)，避免重複觸發。
2.  **安全銷毀**: 在 updateShape_ 中移除 Input 前，必須先手動斷開 (unplug) 並銷毀 (dispose) 連接的積木，確保 ID 從索引中徹底移除。
3.  **非同步變連 (Async Mutation)**: 使用 setTimeout(..., 0) 將結構變更推遲到事件循環之後。
4.  **防禦性產生器**: 產生器必須使用 lock.getInput() 檢查插槽是否存在，若不存在則回傳預設值，以容忍非同步更新的時間差。

## 視覺型小地圖導航邏輯 (Visual Minimap v10)
- **核心公式**: workspace.scroll(-(wsX - viewWidth / 2), -(wsY - viewHeight / 2))。
- **穩定性**: 僅在 BLOCK_MOVE 結束或增減積木時重算 Scale，捲動視窗時比例保持固定，消除閃爍。

## MDI 積木拼接失效分析
- **現象**: 新分頁建立後積木散亂、影子積木 (BPM) 脫離。
- **主因**: Blockly.inject 發生在隱藏容器中，Connection 資料庫無法測量寬高，導致座標避讓 (Bump) 機制誤觸。
- **對策**: v2 計畫改用 isibility: hidden 或 	ranslateX(-9999px) 保持 Layout 活性。
