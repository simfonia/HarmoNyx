/**
 * HarmoNyx IDE - 前端主程式 (主進入點)
 */
import './preinit.js'; 
import './style.css';
import './lang/zh-hant.js';

import { UIUtils } from './modules/ui_utils.js';
import { VisualMinimap } from './modules/minimap.js';
import { FieldADSR, EnvelopeManager } from './modules/visualizer.js';
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

import './generators/java_libs.js';
import './generators/_core.js';
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
import { Updater } from './modules/updater.js';
import { ToolbarManager } from './modules/toolbar_manager.js';
import { MDIManager } from './modules/mdi_manager.js';

UIUtils.injectNaNShield();
const stageUI = UIUtils.initStagePanel();
const invoke = HarmoNyxAPI.getInvoke();

// --- 0. 執行更新檢查 ---
setTimeout(async () => {
    try {
        const appApi = window.__TAURI__?.app || (window.__TAURI__?.core?.app);
        if (appApi) {
            const version = await appApi.getVersion();
            Updater.check(version);
        } else {
            Updater.check('0.8.0'); 
        }
    } catch (e) {
        console.error('Failed to get version:', e);
    }
}, 1500);

// --- 1. 註冊 Blockly 插件與 Polyfill ---
if (window.FieldMultilineInput) {
    Blockly.fieldRegistry.register('field_multilinetext', window.FieldMultilineInput);
    Blockly.fieldRegistry.register('field_multilineinput', window.FieldMultilineInput);
}

class CustomFieldColour extends Blockly.FieldTextInput {
    constructor(value) { super(value || '#ffffff'); }
    static fromJson(options) { return new CustomFieldColour(options.colour || options.value); }
    initView() { super.initView(); this.updateColorView(); }
    render_() { super.render_(); this.updateColorView(); }
    updateColorView() {
        const color = this.getValue();
        if (!color || !this.borderRect_) return;
        this.borderRect_.style.cssText = `fill: ${color} !important; stroke: #fff !important; stroke-width: 1px;`;
        if (this.textElement_) {
            const r = parseInt(color.substring(1, 3), 16), g = parseInt(color.substring(3, 5), 16), b = parseInt(color.substring(5, 7), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            this.textElement_.style.cssText = `fill: ${brightness > 128 ? '#000' : '#fff'} !important; font-weight: bold;`;
        }
    }
    showEditor_() {
        const input = document.createElement('input');
        input.type = 'color'; input.value = this.getValue();
        input.oninput = (e) => { this.setValue(e.target.value); this.updateColorView(); };
        input.click();
    }
}
Blockly.fieldRegistry.register('field_colour', CustomFieldColour);

// --- 2. 初始化 Blockly 工作區配置 ---
const ScrollOptionsPlugin = window.ScrollOptions || (window.ScrollOptionsPlugin && window.ScrollOptionsPlugin.ScrollOptions);
const scrollDragger = window.ScrollBlockDragger || (ScrollOptionsPlugin ? ScrollOptionsPlugin.ScrollBlockDragger : undefined);
const scrollMetrics = window.ScrollMetricsManager || (ScrollOptionsPlugin ? ScrollOptionsPlugin.ScrollMetricsManager : undefined);

const harmoNyxTheme = Blockly.Theme.defineTheme('harmonyx_theme', {
    'base': Blockly.Themes.Classic,
    'blockStyles': { 
        'audio_blocks': { 'colourPrimary': '#8E44AD' },
        'visual_blocks': { 'colourPrimary': '#2E86C1' }
    },
    'componentStyles': { 
        'workspaceBackgroundColour': '#050505', 
        'toolboxBackgroundColour': '#1a1a20'
    }
});

const blocklyOptions = {
    toolbox: WaveCodeToolbox,
    grid: { spacing: 25, length: 3, colour: '#222', snap: true },
    zoom: { controls: true, wheel: true, startScale: 1.0 },
    move: { scrollbars: true, drag: true, wheel: true },
    theme: harmoNyxTheme,
    renderer: 'geras',
    plugins: {
        'blockDragger': scrollDragger,
        'metricsManager': scrollMetrics
    }
};

// --- 3. 核心功能與狀態管理 (由 MDIManager 接管工作區建立) ---
const toolbarManager = new ToolbarManager(null, stageUI); // 先傳 null，稍後在 mdiManager 中同步
const mdiManager = new MDIManager(toolbarManager, blocklyOptions);
toolbarManager.mdiManager = mdiManager;

// 將 updateVisualHelp 曝露到全域供 MDIManager 使用
window.updateVisualHelp = updateVisualHelp;

toolbarManager.onWorkspaceChanged = () => {
    debouncedUpdateLiveCode();
    debouncedOrphanUpdate();
};

const xmlUtils = { textToDom: (t) => Blockly.utils.xml.textToDom(t), workspaceToDom: (w) => Blockly.Xml.workspaceToDom(w), domToPrettyText: (d) => Blockly.Xml.domToPrettyText(d) };

if (window.__TAURI__ && window.__TAURI__.event) {
    let recentHeader = false;
    window.__TAURI__.event.listen('processing-log', (e) => {
        if (!toolbarManager.isProcessing) return;
        const msg = e.payload.trim();
        if (!msg) { recentHeader = false; return; }
        const isTagged = msg.startsWith('[USER]') || msg.startsWith('[DEV]') || msg.startsWith('[MSG]') || msg.startsWith('[WARN]') || msg.startsWith('[ERR]') || msg.startsWith('[!]');
        const isHeader = msg.startsWith('---') || msg.includes('Available') || msg.includes('Devices:');
        const isListItem = /^\s*\[\d+\]/.test(msg);
        if (isHeader) recentHeader = true;
        if (!isTagged && !isHeader && !isListItem) { recentHeader = false; return; }
        if (isTagged || isHeader || (recentHeader && isListItem)) {
            let logType = 'info';
            if (msg.startsWith('[ERR]') || msg.startsWith('[!]')) logType = 'error';
            stageUI.appendLog(msg, logType);
        }
    });
    window.__TAURI__.event.listen('processing-error', (e) => { if (toolbarManager.isProcessing) stageUI.appendLog(e.payload, 'error'); });
}

// --- 【關鍵修復】右鍵說明選單 ---
setTimeout(() => {
    const registry = Blockly.ContextMenuRegistry.registry;
    ['blockHelp', 'help', 'block_help'].forEach(id => { try { registry.unregister(id); } catch (e) {} });
    registry.register({
        displayText: () => '說明',
        preconditionFn: (scope) => (scope.block && scope.block.helpUrl) ? 'enabled' : 'hidden',
        callback: (scope) => {
            const block = scope.block;
            const url = (typeof block.helpUrl === 'function') ? block.helpUrl() : block.helpUrl;
            const lang = toolbarManager.currentLang;
            const filename = `resources/docs/${url}_${lang}.html`;
            invoke('open_url', { url: filename }).catch(err => { invoke('open_url', { url: `${url}_${lang}.html` }); });
        },
        scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
        id: 'nyx_unique_help',
        weight: 100,
    });
}, 1000);

setTimeout(async () => { 
    // 初始化第一個分頁
    mdiManager.addNewTab("未命名專案", true);
    try { await invoke('run_processing', { code: "exit();" }); } catch (err) {}
}, 300);

// --- 4. 輔助監聽與動畫 ---
let liveCodeTimeout;
function debouncedUpdateLiveCode() {
    clearTimeout(liveCodeTimeout);
    liveCodeTimeout = setTimeout(() => {
        const workspace = toolbarManager.workspace; // 從 toolbarManager 取得當前活動工作區
        if (!workspace) return;
        const code = Blockly.Processing.workspaceToCode(workspace);
        const codeEl = document.getElementById('generated-code');
        if (codeEl) codeEl.textContent = code;
    }, 500);
}

let orphanTimeout;
function debouncedOrphanUpdate() {
    clearTimeout(orphanTimeout);
    orphanTimeout = setTimeout(() => {
        const workspace = toolbarManager.workspace;
        if (workspace) UIUtils.updateOrphanBlocks(workspace);
    }, 100);
}

function resetVisualHelp() {
    const placeholder = document.getElementById('help-placeholder');
    const content = document.getElementById('block-help-content');
    if (placeholder && content) {
        placeholder.style.display = 'flex';
        content.style.display = 'none';
        // 清除當前追蹤的積木 ID
        window._currentHelpBlockId = null;
    }
}

async function updateVisualHelp(block, lang) {
    const placeholder = document.getElementById('help-placeholder');
    const content = document.getElementById('block-help-content');
    const titleEl = document.getElementById('help-title');
    const descEl = document.getElementById('help-desc');
    const previewEl = document.getElementById('help-preview');
    if (!placeholder || !content) return;

    if (!block) {
        resetVisualHelp();
        return;
    }

    // --- 效能優化：積木實例檢查 ---
    // 如果點擊的是同一個積木實例，則不做任何更新，徹底防止閃爍
    if (window._currentHelpBlockId === block.id) {
        return;
    }
    window._currentHelpBlockId = block.id;

    placeholder.style.display = 'none';
    content.style.display = 'block';

    // 1. 標題：僅顯示技術 ID
    titleEl.style.display = 'flex';
    titleEl.style.alignItems = 'center';
    titleEl.style.justifyContent = 'space-between';
    titleEl.style.fontFamily = "'Fira Code', monospace";
    titleEl.style.fontSize = '13px';
    titleEl.innerHTML = `<span style="color: var(--nyx-purple-glow); opacity: 0.8;">ID: &lt;${block.type}&gt;</span>`;

    // 2. 處理 Help URL 與內嵌說明
    const url = (typeof block.helpUrl === 'function') ? block.helpUrl() : block.helpUrl;
    previewEl.innerHTML = ''; 
    previewEl.style.padding = '0';
    previewEl.style.overflow = 'hidden';

    if (url && url !== '') {
        const isExternal = url.startsWith('http');

        // 右側保留一個外部開啟按鈕
        const linkIcon = document.createElement('img');
        linkIcon.src = '/icons/explore_24dp_FE2F89.png';
        linkIcon.className = 'nyx-icon-neon';
        linkIcon.style.width = '16px';
        linkIcon.style.cursor = 'pointer';
        linkIcon.title = '開啟外部說明';
        linkIcon.onclick = () => {
            const targetUrl = isExternal ? url : `${url}_${lang}.html`;
            invoke('open_url', { url: targetUrl }).catch(() => {
                invoke('open_url', { url: targetUrl });
            });
        };
        titleEl.appendChild(linkIcon);

        // 內嵌說明文件
        if (!isExternal) {
            try {
                const docFilename = `${url}_${lang}.html`;
                const docContent = await invoke('get_doc_content', { filename: docFilename });

                const iframe = document.createElement('iframe');
                iframe.style.width = '100%';
                iframe.style.height = '280px';
                iframe.style.border = 'none';
                iframe.style.backgroundColor = '#fff';
                iframe.style.borderRadius = '4px';
                iframe.srcdoc = docContent;

                previewEl.appendChild(iframe);
                previewEl.style.display = 'block';
                previewEl.style.marginBottom = '15px';
            } catch (err) {
                console.warn('Failed to load internal doc content:', err);
                previewEl.style.display = 'none';
            }
        } else {
            // 外部連結：目前不支援在 iframe 內嵌 (因 CSP)，僅提供按鈕與 Tooltip
            previewEl.style.display = 'none';
        }
    } else {
        previewEl.style.display = 'none';
    }

    // 3. 處理 Tooltip (作為底部的快速摘要)
    let tooltip = block.getTooltip();
    if (typeof tooltip === 'function') tooltip = tooltip();
    descEl.style.fontSize = '13px';
    descEl.style.lineHeight = '1.6';
    descEl.style.color = 'var(--nyx-text)';
    descEl.innerHTML = tooltip ? tooltip.replace(/\n/g, '<br>') : '<i>(此積木暫無詳細說明)</i>';
}
