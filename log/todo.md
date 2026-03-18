# HarmoNyx 任務清單 (TODO)

## [進行中] 核心功能開發
- [x] **進程管理**: 實作 `stop_processing`，支援 Windows 進程樹強制終止。
- [x] **積木修復**: 解決 `field-colour` 不相容、重複定義與渲染器尺寸問題。
- [x] **介面優化**: 實作設定選單、Tooltip 顯示、i18n 命名空間遷移。
- [x] **資源掛載**: 自動將 `samples/` 連結至 Sketch 的 `data/` 資料夾 (Junctions)。
- [x] **專案 IO**: 實作 `save_project` 與 `load_project` 指令。

## [待辦事項] - 移植驗證與功能完善
- [ ] **產生器驗證**: 確保音訊、視覺與聯動變數（如 stage_setup）能產生正確的 Java 代碼。
- [ ] **Mutator 測試**: 驗證樂器容器、合成器與效果器的 Mutator 邏輯（包含 UI 與代碼產出）。
- [ ] **標準積木遷移**: 實作文字與列表積木的 Java (Processing) 產生器（目前僅有外殼）。
- [x] **資產遷移**: 將 `#stage` 的 `samples/` 音訊資源移入 `HarmoNyx/resources/`。
- [ ] **全功能測試**: 執行 Minim 啟動 + 樂器定義 + 聲音演奏的完整流程測試。
- [ ] **範例遷移**: 移入 SynthBlockly Stage 的經典範例。
- [ ] **日誌整合**: 讓 Processing 的 stdout/stderr 輸出顯示在 IDE 的 Log 區塊中。
- [ ] **主題適配**: 微調 Blockly Theme 以更完美契合深色介面。
