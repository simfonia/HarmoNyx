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

// --- 2. 初始化 Blockly 工作區 ---
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

const blocklyDiv = document.getElementById('blocklyDiv');
const workspace = Blockly.inject(blocklyDiv, {
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
});

// --- 【關鍵修復】右鍵說明選單 ---
setTimeout(() => {
    const registry = Blockly.ContextMenuRegistry.registry;
    
    // 1. 強制移除所有可能的內建說明 ID
    ['blockHelp', 'help', 'block_help'].forEach(id => {
        try { registry.unregister(id); } catch (e) {}
    });

    // 2. 註冊唯一的一個 NYX 說明項目
    registry.register({
        displayText: () => '說明',
        preconditionFn: (scope) => (scope.block && scope.block.helpUrl) ? 'enabled' : 'hidden',
        callback: (scope) => {
            const block = scope.block;
            const url = (typeof block.helpUrl === 'function') ? block.helpUrl() : block.helpUrl;
            const lang = currentLang;
            const filename = `resources/docs/${url}_${lang}.html`;
            
            invoke('open_url', { url: filename }).catch(err => {
                // 備援：嘗試不帶 resources 前綴的路徑 (針對某些環境)
                invoke('open_url', { url: `${url}_${lang}.html` });
            });
        },
        scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
        id: 'nyx_unique_help',
        weight: 100,
    });
}, 1000);

if (ScrollOptionsPlugin) {
    try {
        const scrollOptions = new ScrollOptionsPlugin(workspace);
        scrollOptions.init({
            enableWheelScroll: true, enableEdgeScroll: true,
            edgeScrollOptions: { slowBlockSpeed: 0.15, fastBlockSpeed: 0.5, slowMouseSpeed: 0.25, fastMouseSpeed: 1.0, fastBlockStartDistance: 80, fastMouseStartDistance: 60 }
        });
    } catch (e) { console.error('ScrollOptions init failed:', e); }
}

// --- 3. 核心功能與狀態管理 ---
let isDirty = false;
let currentFilename = '';
let isProcessing = true; // 預設開啟，以接收啟動時的後端路徑訊息

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

async function checkUnsavedChanges() {
    if (!isDirty) return true;
    const { ask } = window.__TAURI__.dialog;
    return await ask('專案尚未儲存，確定要離開嗎？', { title: '警告', kind: 'warning' });
}

const DEFAULT_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="processing_setup" id="cc!|M-@Vrq8_yvb2E$Hr" x="30" y="30">
    <statement name="DO">
      <block type="sb_minim_init" id="V|?S!Uck7cLNH-}pS[nJ">
        <next>
          <block type="visual_stage_setup" id="init_stage">
            <field name="W">1200</field>
            <field name="H">400</field>
            <field name="BG_COLOR">#000000</field>
            <field name="FG_COLOR">#fe2f89</field>
            <next>
              <block type="serial_init" id="init_ser">
                <field name="INDEX">0</field>
                <field name="BAUD">115200</field>
                <next>
                  <block type="sb_select_current_instrument" id="Ewrs?L@}424Xd-6Pi.9%">
                    <field name="NAME">MySynth</field>
                    <next>
                      <block type="sb_transport_set_bpm" id="2itX?tZ4g\`%KzHEbEK[-">
                        <value name="BPM">
                          <shadow type="math_number" id="4#Qw]2/~!jj!]1Q~P.A.">
                            <field name="NUM">120</field>
                          </shadow>
                        </value>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
  <block type="sb_instrument_container" id="?IrjDlT{CuGc-;}sQao9" x="490" y="30">
    <field name="NAME">MySynth</field>
    <statement name="STACK">
      <block type="sb_set_wave" id="+8e5SwS[#A1-933L~D^4">
        <field name="TYPE">TRIANGLE</field>
      </block>
    </statement>
  </block>
  <block type="processing_draw" id="default_draw" x="30" y="350"></block>
</xml>`.trim();

function createDefaultBlocks() {
    workspace.isClearing = true; workspace.clear();
    setTimeout(() => {
        try {
            const dom = Blockly.utils.xml.textToDom(DEFAULT_XML);
            Blockly.Xml.domToWorkspace(dom, workspace);
        } catch (e) {
            const setup = workspace.newBlock('processing_setup'); setup.initSvg(); setup.render(); setup.moveBy(20, 20);
            const draw = workspace.newBlock('processing_draw'); draw.initSvg(); draw.render(); draw.moveBy(20, 350);
        }
        setTimeout(() => { workspace.isClearing = false; setDirty(false); debouncedUpdateLiveCode(); }, 100);
    }, 50);
}

const xmlUtils = { textToDom: (t) => Blockly.utils.xml.textToDom(t), workspaceToDom: (w) => Blockly.Xml.workspaceToDom(w), domToPrettyText: (d) => Blockly.Xml.domToPrettyText(d) };

if (window.__TAURI__ && window.__TAURI__.event) {
    let recentHeader = false;
    window.__TAURI__.event.listen('processing-log', (e) => {
        if (!isProcessing) return;
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
    window.__TAURI__.event.listen('processing-error', (e) => { if (isProcessing) stageUI.appendLog(e.payload, 'error'); });
}

function initI18n() {
    document.querySelectorAll('[data-i18n-title]').forEach(el => { const key = el.getAttribute('data-i18n-title'); if (Blockly.Msg[key]) el.title = Blockly.Msg[key]; });
    document.querySelectorAll('[data-i18n]').forEach(el => { const key = el.getAttribute('data-i18n'); if (Blockly.Msg[key]) el.textContent = Blockly.Msg[key]; });
}
initI18n();

let currentLang = 'zh-hant';
const settingsBtn = document.getElementById('settings-btn');
const examplesBtn = document.getElementById('examples-btn');
const settingsMenu = document.createElement('div');
const examplesMenu = document.createElement('div');
settingsMenu.className = examplesMenu.className = 'dropdown-menu';
document.body.appendChild(settingsMenu);
document.body.appendChild(examplesMenu);

function updateLangCheck(lang) {
    settingsMenu.querySelectorAll('.lang-check').forEach(el => el.innerHTML = '');
    const selectedEl = settingsMenu.querySelector(`.lang-item[data-lang="${lang}"] .lang-check`);
    if (selectedEl) selectedEl.innerHTML = `<img src="/icons/done_24dp_FE2F89.png" class="nyx-icon-neon" style="width: 16px;">`;
}

settingsMenu.innerHTML = `
    <div class="dropdown-item" id="restart-audio-item"><img src="/icons/rocket_launch_24dp_FE2F89.png" class="nyx-icon-neon"><span>${Blockly.Msg['HARMONYX_RESTART_AUDIO'] || '重啟音訊'}</span></div>
    <div class="dropdown-item" id="set-path-item"><img src="/icons/explore_24dp_FE2F89.png" class="nyx-icon-neon"><span>${Blockly.Msg['HARMONYX_SET_PATH'] || '設定路徑'}</span></div>
    <div class="dropdown-item" id="open-samples-item"><img src="/icons/load_project_24dp_FE2F89.png" class="nyx-icon-neon"><span>${Blockly.Msg['HARMONYX_OPEN_SAMPLES'] || '開啟聲音取樣檔資料夾'}</span></div>
    <div class="dropdown-item has-submenu"><img src="/icons/language_24dp_FE2F89.png" class="nyx-icon-neon"><span>${Blockly.Msg['HARMONYX_LANG_SETTING'] || '語言設定'}</span><span class="arrow">▶</span></div>
    <div class="submenu">
        <div class="dropdown-item lang-item" data-lang="zh-hant"><span class="lang-check" style="width:20px;"></span><span>正體中文</span></div>
        <div class="dropdown-item lang-item" data-lang="en"><span class="lang-check" style="width:20px;"></span><span>English</span></div>
    </div>
`;

document.body.addEventListener('click', async (e) => {
    if (e.target.closest('#open-samples-item')) {
        await invoke('open_samples_dir');
    }
    if (e.target.closest('#set-path-item')) {
        const { open } = window.__TAURI__.dialog;
        const selectedPath = await open({ multiple: false, directory: false, filters: [{ name: 'Processing Java', extensions: ['exe', ''] }] });
        if (selectedPath) { await invoke('set_processing_path', { path: selectedPath }); alert("路徑已更新！"); }
    }
});

settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation(); updateLangCheck(currentLang);
    const rect = settingsBtn.getBoundingClientRect();
    settingsMenu.style.top = `${rect.bottom + 5}px`; settingsMenu.style.left = `${rect.left - 120}px`;
    settingsMenu.classList.toggle('show'); examplesMenu.classList.remove('show');
});

settingsMenu.querySelectorAll('.lang-item').forEach(item => {
    item.addEventListener('click', (e) => { const lang = item.getAttribute('data-lang'); currentLang = lang; updateLangCheck(lang); e.stopPropagation(); alert("語系切換功能開發中，目前設定將於下次啟動時生效。"); });
});

examplesBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
        const examples = await invoke('list_examples');
        let html = '';
        examples.forEach(ex => {
            if (ex.category) { html += `<div class="dropdown-item has-submenu"><img src="/icons/folder_special_24dp_75FB4C.png" class="nyx-icon-purple" style="width:20px;"><span>${ex.category}</span><span class="arrow">▶</span></div><div class="submenu">${ex.items.map(i => `<div class="dropdown-item example-item" data-path="${i.path}"><img src="/icons/lyrics_24dp_75FB4C.png" class="nyx-icon-blue" style="width:20px;"><span>${i.name}</span></div>`).join('')}</div>`; }
            else { html += `<div class="dropdown-item example-item" data-path="${ex.path}"><img src="/icons/lyrics_24dp_75FB4C.png" class="nyx-icon-blue" style="width:20px;"><span>${ex.name}</span></div>`; }
        });
        examplesMenu.innerHTML = html || '<div class="dropdown-item">無範例</div>';
        examplesMenu.querySelectorAll('.example-item').forEach(item => {
            item.onclick = async () => { if (await checkUnsavedChanges()) { const content = await invoke('load_project', { path: item.getAttribute('data-path') }); workspace.isClearing = true; workspace.clear(); Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(content), workspace); currentFilename = item.getAttribute('data-path').split(/[\\/]/).pop(); setTimeout(() => { workspace.isClearing = false; setDirty(false); }, 100); } };
        });
        const rect = examplesBtn.getBoundingClientRect();
        examplesMenu.style.top = `${rect.bottom + 5}px`; examplesMenu.style.left = `${rect.left}px`;
        examplesMenu.classList.toggle('show'); settingsMenu.classList.remove('show');
    } catch (err) { console.error(err); }
});

document.addEventListener('click', () => { settingsMenu.classList.remove('show'); examplesMenu.classList.remove('show'); });

document.getElementById('new-btn').onclick = async () => { if (await checkUnsavedChanges()) { currentFilename = ''; createDefaultBlocks(); } };
document.getElementById('open-btn').onclick = async () => {
    if (await checkUnsavedChanges()) {
        const path = await window.__TAURI__.dialog.open({ filters: [{ name: 'HarmoNyx', extensions: ['nyx', 'xml'] }] });
        if (path) { const content = await invoke('load_project', { path }); workspace.isClearing = true; workspace.clear(); Blockly.Xml.domToWorkspace(xmlUtils.textToDom(content), workspace); currentFilename = path.split(/[\\/]/).pop(); setTimeout(() => { workspace.isClearing = false; setDirty(false); }, 100); }
    }
};
document.getElementById('save-btn').onclick = async () => {
    const path = await window.__TAURI__.dialog.save({ filters: [{ name: 'HarmoNyx', extensions: ['nyx', 'xml'] }] });
    if (path) { await invoke('save_project', { xmlContent: xmlUtils.domToPrettyText(xmlUtils.workspaceToDom(workspace)), path }); currentFilename = path.split(/[\\/]/).pop(); setDirty(false); }
};

document.getElementById('run-btn').onclick = async () => {
    document.getElementById('run-btn').classList.add('is-running');
    if (stageUI.clearLog) stageUI.clearLog(); isProcessing = true;
    const code = Blockly.Processing.workspaceToCode(workspace);
    try { await invoke('run_processing', { code }); }
    catch (err) {
        if (err === "ERR_NO_PROCESSING") {
            const { message, open } = window.__TAURI__.dialog;
            await message('找不到 Processing 執行環境...', { title: '執行環境缺失', kind: 'warning' });
            const selectedPath = await open({ multiple: false, directory: false, filters: [{ name: 'Processing Java', extensions: ['exe', ''] }] });
            if (selectedPath) { await invoke('set_processing_path', { path: selectedPath }); try { await invoke('run_processing', { code }); } catch (retryErr) { alert('執行失敗：' + retryErr); } }
            else { isProcessing = false; }
        } else { alert('執行失敗：' + err); isProcessing = false; }
    } finally { document.getElementById('run-btn').classList.remove('is-running'); }
};

document.getElementById('stop-btn').onclick = () => { isProcessing = false; invoke('stop_processing'); };

setTimeout(async () => { 
    Blockly.svgResize(workspace); new VisualMinimap(workspace); UIUtils.initSearch(workspace); 
    setTimeout(createDefaultBlocks, 200);
    try { await invoke('run_processing', { code: "exit();" }); } catch (err) {}
}, 300);

workspace.addChangeListener((e) => {
    if (workspace.isClearing) return;
    if (!e.isUiEvent) {
        if ([Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CREATE, Blockly.Events.BLOCK_CHANGE, Blockly.Events.BLOCK_DELETE, Blockly.Events.VAR_CREATE, Blockly.Events.VAR_RENAME, Blockly.Events.VAR_DELETE].includes(e.type)) {
            setDirty(true); 
            debouncedUpdateLiveCode();
            debouncedOrphanUpdate();
        }
    }
    let targetBlockId = null;
    if (e.type === Blockly.Events.UI && (e.element === 'click' || e.element === 'selected')) targetBlockId = e.blockId || e.newValue;
    else if (e.type === 'selected' || e.type === 'click') targetBlockId = e.blockId || e.newValue;
    else if ([Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CREATE, Blockly.Events.BLOCK_CHANGE].includes(e.type)) targetBlockId = e.blockId;
    if (targetBlockId) { const block = workspace.getBlockById(targetBlockId); if (block) updateVisualHelp(block); }
});

let liveCodeTimeout;
function debouncedUpdateLiveCode() {
    clearTimeout(liveCodeTimeout);
    liveCodeTimeout = setTimeout(() => {
        const code = Blockly.Processing.workspaceToCode(workspace);
        const codeEl = document.getElementById('generated-code');
        if (codeEl) codeEl.textContent = code;
    }, 500);
}

let orphanTimeout;
function debouncedOrphanUpdate() {
    clearTimeout(orphanTimeout);
    orphanTimeout = setTimeout(() => {
        UIUtils.updateOrphanBlocks(workspace);
    }, 100);
}

async function updateVisualHelp(block) {
    const placeholder = document.getElementById('help-placeholder');
    const content = document.getElementById('block-help-content');
    const titleEl = document.getElementById('help-title');
    const descEl = document.getElementById('help-desc');
    const previewEl = document.getElementById('help-preview');
    if (!placeholder || !content) return;

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
            const targetUrl = isExternal ? url : `${url}_${currentLang}.html`;
            invoke('open_url', { url: targetUrl }).catch(() => {
                invoke('open_url', { url: targetUrl });
            });
        };
        titleEl.appendChild(linkIcon);

        // 內嵌說明文件
        if (!isExternal) {
            try {
                const docFilename = `${url}_${currentLang}.html`;
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
    } else {        previewEl.style.display = 'none';
    }

    // 3. 處理 Tooltip (作為底部的快速摘要)
    let tooltip = block.getTooltip();
    if (typeof tooltip === 'function') tooltip = tooltip();
    descEl.style.fontSize = '13px';
    descEl.style.lineHeight = '1.6';
    descEl.style.color = 'var(--nyx-text)';
    descEl.innerHTML = tooltip ? tooltip.replace(/\n/g, '<br>') : '<i>(此積木暫無詳細說明)</i>';
}
