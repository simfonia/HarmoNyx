/**
 * HarmoNyx IDE - 前端主程式 (主進入點)
 */
import './preinit.js'; 
import './style.css';
import './lang/zh-hant.js';

import { UIUtils } from './modules/ui_utils.js';
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

UIUtils.injectNaNShield();
const stageUI = UIUtils.initStagePanel();
const invoke = HarmoNyxAPI.getInvoke();

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
        this.borderRect_.style.cssText = `fill: ${color} !important; fill-opacity: 1 !important; stroke: #fff !important; stroke-width: 1px;`;
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
    renderer: 'geras'
});

// --- 3. 核心功能與狀態管理 ---
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

async function checkUnsavedChanges() {
    if (!isDirty) return true;
    const { ask } = window.__TAURI__.dialog;
    return await ask('專案尚未儲存，確定要離開嗎？', { title: '警告', kind: 'warning' });
}

function createDefaultBlocks() {
    workspace.isClearing = true; workspace.clear();
    setTimeout(() => {
        const setup = workspace.newBlock('processing_setup'); setup.initSvg(); setup.render(); setup.moveBy(20, 20);
        const draw = workspace.newBlock('processing_draw'); draw.initSvg(); draw.render(); draw.moveBy(20, 120);
        setTimeout(() => { workspace.isClearing = false; setDirty(false); }, 100);
    }, 50);
}

const xmlUtils = {
    textToDom: (t) => Blockly.utils.xml.textToDom(t),
    workspaceToDom: (w) => Blockly.Xml.workspaceToDom(w),
    domToPrettyText: (d) => Blockly.Xml.domToPrettyText(d)
};

if (window.__TAURI__ && window.__TAURI__.event) {
    window.__TAURI__.event.listen('processing-log', (e) => stageUI.appendLog(e.payload, 'info'));
    window.__TAURI__.event.listen('processing-error', (e) => stageUI.appendLog(e.payload, 'error'));
}

function initI18n() {
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (Blockly.Msg[key]) el.title = Blockly.Msg[key];
    });
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (Blockly.Msg[key]) el.textContent = Blockly.Msg[key];
    });
}
initI18n();

// --- 4. 系統設定與範例選單 ---
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
    <div class="dropdown-item" id="restart-audio-item"><img src="/icons/rocket_launch_24dp_FE2F89.png" class="nyx-icon-neon"><span>重啟音訊</span></div>
    <div class="dropdown-item has-submenu"><img src="/icons/language_24dp_FE2F89.png" class="nyx-icon-neon"><span>語言設定</span><span class="arrow">▶</span></div>
    <div class="submenu">
        <div class="dropdown-item lang-item" data-lang="zh-hant"><span class="lang-check" style="width:20px;"></span><span>正體中文</span></div>
        <div class="dropdown-item lang-item" data-lang="en"><span class="lang-check" style="width:20px;"></span><span>English</span></div>
    </div>
`;

settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    updateLangCheck(currentLang);
    const rect = settingsBtn.getBoundingClientRect();
    settingsMenu.style.top = `${rect.bottom + 5}px`;
    settingsMenu.style.left = `${rect.left - 120}px`;
    settingsMenu.classList.toggle('show');
    examplesMenu.classList.remove('show');
});

settingsMenu.querySelectorAll('.lang-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const lang = item.getAttribute('data-lang');
        currentLang = lang; updateLangCheck(lang); e.stopPropagation();
        alert("語系切換功能開發中，目前設定將於下次啟動時生效。");
    });
});

examplesBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
        const examples = await invoke('list_examples');
        let html = '';
        examples.forEach(ex => {
            if (ex.category) {
                html += `<div class="dropdown-item has-submenu"><img src="/icons/folder_special_24dp_75FB4C.png" class="nyx-icon-purple" style="width:20px;"><span>${ex.category}</span><span class="arrow">▶</span></div>
                         <div class="submenu">${ex.items.map(i => `<div class="dropdown-item example-item" data-path="${i.path}"><img src="/icons/lyrics_24dp_75FB4C.png" class="nyx-icon-blue" style="width:20px;"><span>${i.name}</span></div>`).join('')}</div>`;
            } else {
                html += `<div class="dropdown-item example-item" data-path="${ex.path}"><img src="/icons/lyrics_24dp_75FB4C.png" class="nyx-icon-blue" style="width:20px;"><span>${ex.name}</span></div>`;
            }
        });
        examplesMenu.innerHTML = html || '<div class="dropdown-item">無範例</div>';
        examplesMenu.querySelectorAll('.example-item').forEach(item => {
            item.onclick = async () => {
                if (await checkUnsavedChanges()) {
                    const content = await invoke('load_project', { path: item.getAttribute('data-path') });
                    workspace.isClearing = true; workspace.clear();
                    Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(content), workspace);
                    currentFilename = item.getAttribute('data-path').split(/[\\/]/).pop();
                    setTimeout(() => { workspace.isClearing = false; setDirty(false); }, 100);
                }
            };
        });
        const rect = examplesBtn.getBoundingClientRect();
        examplesMenu.style.top = `${rect.bottom + 5}px`;
        examplesMenu.style.left = `${rect.left}px`;
        examplesMenu.classList.toggle('show');
        settingsMenu.classList.remove('show');
    } catch (err) { console.error(err); }
});

document.addEventListener('click', () => { settingsMenu.classList.remove('show'); examplesMenu.classList.remove('show'); });

// --- 5. 檔案操作與執行控制 ---
document.getElementById('new-btn').onclick = async () => { if (await checkUnsavedChanges()) { currentFilename = ''; createDefaultBlocks(); } };

document.getElementById('open-btn').onclick = async () => {
    if (await checkUnsavedChanges()) {
        const path = await window.__TAURI__.dialog.open({ filters: [{ name: 'HarmoNyx', extensions: ['nyx', 'xml'] }] });
        if (path) {
            const content = await invoke('load_project', { path });
            workspace.isClearing = true; workspace.clear();
            Blockly.Xml.domToWorkspace(xmlUtils.textToDom(content), workspace);
            currentFilename = path.split(/[\\/]/).pop();
            setTimeout(() => { workspace.isClearing = false; setDirty(false); }, 100);
        }
    }
};

document.getElementById('save-btn').onclick = async () => {
    const path = await window.__TAURI__.dialog.save({ filters: [{ name: 'HarmoNyx', extensions: ['nyx', 'xml'] }] });
    if (path) {
        await invoke('save_project', { xmlContent: xmlUtils.domToPrettyText(xmlUtils.workspaceToDom(workspace)), path });
        currentFilename = path.split(/[\\/]/).pop(); setDirty(false);
    }
};

document.getElementById('run-btn').onclick = async () => {
    document.getElementById('run-btn').classList.add('is-running');
    const code = Blockly.Processing.workspaceToCode(workspace);
    await invoke('run_processing', { code });
    document.getElementById('run-btn').classList.remove('is-running');
};

document.getElementById('stop-btn').onclick = () => invoke('stop_processing');

// --- 8. 啟動與初始化 ---
setTimeout(() => { 
    Blockly.svgResize(workspace); 
    UIUtils.initMinimap(workspace); 
    UIUtils.initSearch(workspace); 
    setTimeout(createDefaultBlocks, 200);
}, 300);

workspace.addChangeListener((e) => {
    if (workspace.isClearing || e.isUiEvent) return;
    const isBlockChange = [Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CREATE, Blockly.Events.BLOCK_CHANGE, Blockly.Events.BLOCK_DELETE, Blockly.Events.VAR_CREATE, Blockly.Events.VAR_RENAME, Blockly.Events.VAR_DELETE].includes(e.type);
    if (isBlockChange) setDirty(true);
});
