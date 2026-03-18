# HarmoNyx 任務清單 (TODO)

## [進行中] 核心功能開發
- [x] **進程管理**: 實作 `stop_processing`，支援 Windows 進程樹強制終止。
- [x] **積木修復**: 解決 `field-colour` 不相容、重複定義與渲染器尺寸問題。
- [x] **介面優化**: 實作設定選單、Tooltip 顯示、i18n 命名空間遷移。
- [ ] **資源掛載**: 自動將 `samples/` 連結至 Sketch 的 `data/` 資料夾 (Junctions)。
- [ ] **專案 IO**: 實作 `save_project` 與 `load_project` 指令。

## [待辦事項] - 功能完善
- [ ] **範例遷移**: 移入 SynthBlockly Stage 的經典範例。
- [ ] **日誌整合**: 讓 Processing 的 stdout/stderr 輸出顯示在 IDE 的 Log 區塊中。
- [ ] **主題適配**: 微調 Blockly Theme 以更完美契合深色介面。
