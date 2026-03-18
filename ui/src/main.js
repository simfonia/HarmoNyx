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
if (window.FieldMultilineInput) {
    Blockly.fieldRegistry.register('field_multilinetext', window.FieldMultilineInput);
    Blockly.fieldRegistry.register('field_multilineinput', window.FieldMultilineInput);
}

// 自定義顏色選擇欄位 (Polyfill)，解決不相容問題並提供原生選色體驗
class CustomFieldColour extends Blockly.FieldTextInput {
    constructor(value) { 
        super(value || '#ffffff'); 
    }
    static fromJson(options) { return new CustomFieldColour(options.colour || options.value); }
    
    doClassValidation_(newValue) {
        if (typeof newValue !== 'string') return null;
        let cleaned = newValue.replace('#', '');
        if (cleaned.length === 3) cleaned = cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2];
        if (cleaned.match(/^[0-9a-fA-F]{6}$/)) return '#' + cleaned.toLowerCase();
        return null;
    }

    initView() {
        super.initView();
        // 初始化時就強制設定樣式
        this.updateColorView();
    }

    // 當積木重新渲染時 (例如變更輸入)，Blockly 會呼叫 render_
    render_() {
        super.render_();
        this.updateColorView();
    }

    updateColorView() {
        const color = this.getValue();
        if (!color || !this.borderRect_) return;

        // 強力覆寫樣式
        this.borderRect_.style.cssText = `fill: ${color} !important; fill-opacity: 1 !important; stroke: #fff !important; stroke-width: 1px;`;
        this.borderRect_.setAttribute('fill', color);
        this.borderRect_.setAttribute('fill-opacity', '1');

        // 處理文字對比
        if (this.textElement_) {
            const r = parseInt(color.substring(1, 3), 16);
            const g = parseInt(color.substring(3, 5), 16);
            const b = parseInt(color.substring(5, 7), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            const textColor = brightness > 128 ? '#000000' : '#ffffff';
            
            this.textElement_.style.cssText = `fill: ${textColor} !important; font-weight: bold;`;
            this.textElement_.setAttribute('fill', textColor);
        }
    }

    showEditor_() {
        const input = document.createElement('input');
        input.type = 'color';
        input.value = this.getValue();
        input.oninput = (e) => {
            this.setValue(e.target.value);
            this.updateColorView(); // 編輯時即時更新
        };
        input.click();
    }
}
Blockly.fieldRegistry.register('field_colour', CustomFieldColour);

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
    media: 'media/',
    theme: harmoNyxTheme,
    plugins: { 'blockDragger': scrollDragger, 'metricsManager': scrollMetrics },
    renderer: 'geras'
});

// --- 3. 核心功能實作 ---

/**
 * 初始化介面語言與 Tooltip
 */
function initI18n() {
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (Blockly.Msg[key]) {
            el.title = Blockly.Msg[key];
        }
    });
    // 更新選單內的文字
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (Blockly.Msg[key]) {
            el.textContent = Blockly.Msg[key];
        }
    });
}

// --- 4. 系統設定選單 (參考 WaveCode) ---
let currentLang = 'zh-hant';
const settingsBtn = document.getElementById('settings-btn');
const settingsMenu = document.createElement('div');
settingsMenu.className = 'dropdown-menu';
settingsMenu.id = 'settings-menu';
settingsMenu.innerHTML = `
    <div class="dropdown-item" id="restart-audio-item">
        <img src="/icons/rocket_launch_24dp_FE2F89.png">
        <span data-i18n="HARMONYX_RESTART_AUDIO">重啟音訊</span>
    </div>
    <div class="dropdown-item has-submenu">
        <div style="display: flex; align-items: center; gap: 10px;">
            <img src="/icons/language_24dp_FE2F89.png">
            <span data-i18n="HARMONYX_LANG_SETTING">語言設定</span>
        </div>
        <span>▸</span>
        <div class="submenu">
            <div class="dropdown-item lang-item" data-lang="zh-hant" style="justify-content: flex-start;">
                <span class="lang-check" style="width: 24px;"></span>
                <span>正體中文</span>
            </div>
            <div class="dropdown-item lang-item" data-lang="en" style="justify-content: flex-start;">
                <span class="lang-check" style="width: 24px;"></span>
                <span>English</span>
            </div>
        </div>
    </div>
`;
document.body.appendChild(settingsMenu);

function updateLangCheck(lang) {
    document.querySelectorAll('.lang-check').forEach(el => { el.innerHTML = ''; });
    const selectedEl = document.querySelector(`.lang-item[data-lang="${lang}"] .lang-check`);
    if (selectedEl) {
        selectedEl.innerHTML = `<img src="/icons/done_24dp_FE2F89.png" style="width: 16px; height: 16px;">`;
    }
}

settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const rect = settingsBtn.getBoundingClientRect();
    settingsMenu.style.top = `${rect.bottom + 5}px`;
    settingsMenu.style.left = `${rect.left - 120}px`;
    settingsMenu.classList.toggle('show');
});

document.addEventListener('click', () => {
    settingsMenu.classList.remove('show');
});

// 語系切換監聽
document.querySelectorAll('.lang-item').forEach(item => {
    item.addEventListener('click', async (e) => {
        const lang = item.getAttribute('data-lang');
        if (lang !== currentLang) {
            console.log(`Switching language to: ${lang}`);
            currentLang = lang;
            updateLangCheck(lang);
            // 此處未來可實作動態換語言，目前先提示需重啟
            alert("語系切換功能開發中，目前預設為正體中文。");
        }
    });
});

document.getElementById('restart-audio-item').addEventListener('click', () => {
    alert("正在重啟音訊引擎...");
    // 未來可呼叫 Rust 重置音訊狀態
});

updateLangCheck(currentLang);

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
    // 注意：不阻擋 is-running，因為後端會自動替換進程
    try {
        runBtn.classList.add('is-running');
        runBtn.title = Blockly.Msg['HARMONYX_RUN'] + '...';

        // 1. 產生 Processing (Java) 代碼
        Blockly.Processing.init(workspace);
        const code = Blockly.Processing.workspaceToCode(workspace);
        console.log("Generated Code:\n", code);

        // 2. 呼叫 Rust 後端執行 (異步)
        const result = await invoke('run_processing', { code });
        console.log("Execution Result:", result);

    } catch (error) {
        console.error("執行失敗:", error);
        alert("執行失敗: " + error);
    } finally {
        runBtn.classList.remove('is-running');
        runBtn.title = Blockly.Msg['HARMONYX_RUN'];
    }
});

document.getElementById('stop-btn').addEventListener('click', async () => {
    try {
        const result = await invoke('stop_processing');
        console.log("Stop Result:", result);
    } catch (error) {
        console.error("停止失敗:", error);
    }
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
    initI18n(); // 加入此行
    setTimeout(createDefaultBlocks, 200);
}, 300);

workspace.addChangeListener((e) => {
    if (workspace.isClearing || e.isUiEvent) return;
    const isBlockChange = [Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CREATE, Blockly.Events.BLOCK_CHANGE, Blockly.Events.BLOCK_DELETE, Blockly.Events.VAR_CREATE, Blockly.Events.VAR_RENAME, Blockly.Events.VAR_DELETE].includes(e.type);
    if (isBlockChange) { setDirty(true); }
});
