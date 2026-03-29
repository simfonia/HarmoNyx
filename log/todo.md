# HarmoNyx 任務清單 (TODO)

## [已完成] 核心功能與遷移
- [x] **進程管理**: 實作 `stop_processing`，支援 Windows 進程樹強制終止 (taskkill /F /T)。
- [x] **積木修復**: 解決 `field-colour` 不相容問題、重複定義與渲染器尺寸問題。
- [x] **介面優化**: 實作設定選單、Tooltip 顯示、i18n 命名空間遷移。
- [x] **資源掛載**: 自動將 `samples/` 連結至 Sketch 的 `data/` 資料夾 (Junctions)。
- [x] **專案 IO**: 實作 `save_project` 與 `load_project` 指令。
- [x] **資產遷移**: 已完成 `#stage` 的 `samples/` 音訊資源移入 `HarmoNyx/resources/`。
- [x] **範例遷移**: 已完成 SynthBlockly Stage 的經典範例移入，並通過測試。
- [x] **全功能測試**: 驗證 Minim 啟動 + 樂器定義 + 聲音演奏的完整流程測試通過。
- [x] **日誌整合**: Processing 的 stdout/stderr 輸出已即時串流至前端 Console。
- [x] **搜尋功能**: 實作工具箱搜尋框，支援中英文關鍵字與 ID 搜尋，並優化了防抖與對齊。
- [x] **Nyx 主題**: 完成 IDE 的深色主題配色、Toolbar 動態效果與圖示染色。

## [進行中] 產生器完善
- [ ] **標準積木補全**: 補足 `lists.js` 與 `text.js` 中缺失的標準積木（如 `getSublist`、`sort`、`getSubstring` 等）。
- [ ] **Mutator 測試**: 驗證樂器容器、合成器與效果器的 Mutator 邏輯（包含 UI 與代碼產出）。

## [待辦事項] - UI/UX 強化
- [x] **右側智慧面板 (Smart Panel)**: 
    - 將目前的「視覺舞台」區域重構為雙頁籤結構。
    - **Tab 1: 積木輔助 (Visual Help)**: 點擊積木時顯示動態圖解（如 ADSR 曲線、波形預覽）。
    - **Tab 2: 即時程式碼 (Live Code)**: 顯示當前 Workspace 生成的 Java 代碼，支援語法高亮。
- [x] **說明文件內嵌**: 
    - 實作了 iframe + srcdoc 載入機制，支援跨平台在 IDE 內顯示 HTML 說明文件。
    - 標題優化為顯示積木 ID，減少重複。
- [x] **Melody 文件更新**: 新增「音名與八度表示」章節，同步中英文版。
- [ ] **說明文件資源優化**: 
    - 如果 HTML 中有圖片，需要確保路徑在 srcdoc 模式下能正確對應到資源路徑。
- [ ] **ADSR 光點動畫訊號串接**：將 Processing 的 noteOn 事件透過 Tauri 傳回前端，並呼叫 EnvelopeManager.trigger() 以驅動 ADSR 積木上的光點動畫 (參考 WaveCode 架構)。
- [x] **Mutator 穩定性**: 修復了 sb_setup_effect 切換時的崩潰問題。
- [x] **舞台參數同步**: 修復了 isual_stage_setup ADSR 滑桿失效的問題。
- [x] **移調卡音修復**: 解決了 Transpose 操作導致的卡音問題。
- [x] **孤兒積木樣式**: 實作了紅色邊框警示效果。
- [x] **Toolbar 模組化**: 將工具列邏輯與樣式從 `main.js` 抽離至 `toolbar_manager.js` 與 `toolbar.css`。
- [x] **MDI 多分頁系統**:
    - 實作了獨立的工作區（Independent Workspaces），支援各分頁獨立的 Undo/Redo。
    - 實作了分頁新增、切換、關閉與 Dirty 狀態同步。
    - 優化了範例載入流程，改為開啟新分頁以保護原始範例。
    - 修復了 MDI 架構下的積木搜尋、焦點轉移與快捷鍵失效問題。

