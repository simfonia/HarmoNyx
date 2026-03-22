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
- [ ] **右側智慧面板 (Smart Panel)**: 
    - 將目前的「視覺舞台」區域重構為雙頁籤結構。
    - **Tab 1: 積木輔助 (Visual Help)**: 點擊積木時顯示動態圖解（如 ADSR 曲線、波形預覽）。
    - **Tab 2: 即時程式碼 (Live Code)**: 顯示當前 Workspace 生成的 Java 代碼，支援語法高亮。
- [ ] **主題適配微調**: 持續微調 Blockly Theme 與背景色的對比，確保在深色模式下所有文字皆清晰。
