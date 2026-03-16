/**
 * HarmoNyx IDE - 前端主程式 (主進入點)
 */
import './preinit.js'; // 必須是第一行，確保全局變數在 import 提升時已就緒
import './style.css';
import './lang/zh-hant.js';

import { UIUtils } from './modules/ui_utils.js';

// --- 1. 載入積木定義 (Blocks) ---
import './blocks/structure.js';
import './blocks/audio_core.js';
import './blocks/audio_effects.js';
import './blocks/audio_performance.js';
import './blocks/visual_core.js';
import './blocks/visual_geometry.js';
import './blocks/visual_transform.js';
import './blocks/live_show.js';
import './blocks/midi.js';
import './blocks/serial.js';
import './blocks/math.js';
import './blocks/ui.js';
import './blocks/tools.js';
import './blocks/text.js';

// --- 2. 載入產生器核心與 PDE 類別庫 (Generators Core) ---
import './generators/java_libs.js';
import './generators/_core.js';

// --- 3. 載入各模組產生器實作 ---
import './generators/structure.js';
import './generators/audio_core.js';
import './generators/audio_effects.js';
import './generators/audio_performance.js';
import './generators/visual_core.js';
import './generators/visual_geometry.js';
import './generators/visual_transform.js';
import './generators/live_show.js';
import './generators/midi.js';
import './generators/serial.js';
import './generators/math.js';
import './generators/ui.js';
import './generators/tools.js';
import './generators/variables.js';
import './generators/logic.js';
import './generators/loops.js';
import './generators/text.js';
import './generators/lists.js';
import './generators/functions.js';

import { HarmoNyxAPI } from './modules/api.js';
import { WaveCodeToolbox } from './modules/toolbox.js';

// 注入 NaN 防護盾 (確保 SVG 不會報錯)
UIUtils.injectNaNShield();

const invoke = HarmoNyxAPI.getInvoke();

// --- 1. 註冊 Blockly 插件 ---
if (window.FieldMultilineInput) Blockly.fieldRegistry.register('field_multilinetext', window.FieldMultilineInput);
if (window.FieldColour) Blockly.fieldRegistry.register('field_colour', window.FieldColour);

const ScrollOptionsPlugin = window.ScrollOptions || (window.ScrollOptionsPlugin && window.ScrollOptionsPlugin.ScrollOptions);
const scrollDragger = window.ScrollBlockDragger || (ScrollOptionsPlugin ? ScrollOptionsPlugin.ScrollBlockDragger : undefined);
const scrollMetrics = window.ScrollMetricsManager || (ScrollOptionsPlugin ? ScrollOptionsPlugin.ScrollMetricsManager : undefined);

// --- 2. 初始化 Blockly 工作區 ---
const harmoNyxTheme = Blockly.Theme.defineTheme('harmonyx_theme', {
    'base': Blockly.Themes.Classic,
    'blockStyles': { 
        'audio_blocks': { 'colourPrimary': '#8E44AD', 'colourSecondary': '#7D3C98', 'colourTertiary': '#5B2C6F' },
        'visual_blocks': { 'colourPrimary': '#2E86C1', 'colourSecondary': '#2874A6', 'colourTertiary': '#1B4F72' }
    },
    'componentStyles': { 
        'workspaceBackgroundColour': '#1e1e1e', 
        'toolboxBackgroundColour': '#252526', 
        'scrollbarColour': '#555555' 
    }
});

const blocklyDiv = document.getElementById('blocklyDiv');
const workspace = Blockly.inject(blocklyDiv, {
    toolbox: WaveCodeToolbox,
    grid: { spacing: 25, length: 3, colour: '#333', snap: true },
    zoom: { controls: true, wheel: true, startScale: 1.0 },
    move: { scrollbars: true, drag: true, wheel: true },
    theme: harmoNyxTheme,
    plugins: { 'blockDragger': scrollDragger, 'metricsManager': scrollMetrics },
    renderer: 'zelos'
});

// --- 3. 核心功能實作 ---

let isDirty = false;
let currentFilename = '';

function setDirty(dirty) {
    if (workspace.isClearing && dirty) return;
    isDirty = dirty;
    const displayFilename = currentFilename || '未命名專案';
    document.title = `${dirty ? '*' : ''}${displayFilename} - HarmoNyx`;
    const statusContainer = document.getElementById('file-status');
    if (statusContainer) {
        document.getElementById('display-filename').textContent = displayFilename;
        dirty ? statusContainer.classList.add('is-dirty') : statusContainer.classList.remove('is-dirty');
    }
}

function createDefaultBlocks() {
    workspace.isClearing = true;
    workspace.clear();
    setTimeout(() => {
        const setup = workspace.newBlock('processing_setup');
        setup.initSvg(); setup.render(); setup.moveBy(50, 50);
        
        const draw = workspace.newBlock('processing_draw');
        draw.initSvg(); draw.render();
        draw.moveBy(50, 150);

        setTimeout(() => {
            workspace.isClearing = false;
            setDirty(false);
        }, 100);
    }, 50);
}

const xmlUtils = {
    textToDom: (text) => (Blockly.utils.xml.textToDom ? Blockly.utils.xml.textToDom(text) : Blockly.Xml.textToDom(text)),
    workspaceToDom: (workspace) => Blockly.Xml.workspaceToDom(workspace),
    domToPrettyText: (dom) => Blockly.Xml.domToPrettyText(dom)
};

async function checkUnsavedChanges() {
    if (!isDirty) return true;
    const { ask } = window.__TAURI__.dialog;
    return await ask('專案尚未儲存，確定要離開嗎？', { title: '警告', kind: 'warning' });
}

// --- 5. 執行按鈕監聽器 ---

document.getElementById('run-btn').addEventListener('click', async () => {
    const runBtn = document.getElementById('run-btn');
    if (runBtn.classList.contains('is-running')) {
        return;
    }

    try {
        runBtn.classList.add('is-running');
        runBtn.title = '正在執行...';

        // 1. 產生 Processing (Java) 代碼
        Blockly.Processing.init(workspace);
        const code = Blockly.Processing.workspaceToCode(workspace);
        console.log("Generated Code:\n", code);

        // 2. 呼叫 Rust 後端執行
        const result = await invoke('run_processing', { code });
        console.log("Execution Result:", result);

    } catch (error) {
        console.error("執行失敗:", error);
        alert("執行失敗: " + error);
    } finally {
        runBtn.classList.remove('is-running');
        runBtn.title = '執行 (Run)';
    }
});

document.getElementById('stop-btn').addEventListener('click', async () => {
    console.log("Stopping... (Process termination to be implemented)");
});

document.getElementById('new-btn').addEventListener('click', async () => {
    if (await checkUnsavedChanges()) { currentFilename = ''; createDefaultBlocks(); }
});

document.getElementById('save-btn').addEventListener('click', async () => {
    try {
        const path = await window.__TAURI__.dialog.save({ filters: [{ name: 'HarmoNyx Project', extensions: ['nyx'] }] });
        if (path) {
            await invoke('save_project', { xmlContent: xmlUtils.domToPrettyText(xmlUtils.workspaceToDom(workspace)), path: path });
            currentFilename = path.split(/[\\/]/).pop(); setDirty(false);
        }
    } catch (e) {}
});

document.getElementById('open-btn').addEventListener('click', async () => {
    if (await checkUnsavedChanges()) {
        try {
            const { open } = window.__TAURI__.dialog;
            const path = await open({ filters: [{ name: 'HarmoNyx Project', extensions: ['nyx'] }], multiple: false });
            if (path) {
                const content = await invoke('load_project', { path: path });
                workspace.isClearing = true; workspace.clear();
                Blockly.Xml.domToWorkspace(xmlUtils.textToDom(content), workspace);
                currentFilename = path.split(/[\\/]/).pop(); 
                setTimeout(() => { workspace.isClearing = false; setDirty(false); }, 100);
            }
        } catch (e) {}
    }
});

// --- 8. 啟動與初始化 ---
const resizeObserver = new ResizeObserver(() => Blockly.svgResize(workspace));
resizeObserver.observe(blocklyDiv);
setTimeout(() => { 
    Blockly.svgResize(workspace); 
    UIUtils.initMinimap(workspace); 
    setTimeout(createDefaultBlocks, 200);
}, 300);

workspace.addChangeListener((e) => {
    if (workspace.isClearing || e.isUiEvent) return;
    const isBlockChange = [Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CREATE, Blockly.Events.BLOCK_CHANGE, Blockly.Events.BLOCK_DELETE, Blockly.Events.VAR_CREATE, Blockly.Events.VAR_RENAME, Blockly.Events.VAR_DELETE].includes(e.type);
    if (isBlockChange) { setDirty(true); }
});
