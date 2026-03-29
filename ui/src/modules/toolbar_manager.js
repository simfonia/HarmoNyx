/**
 * HarmoNyx Toolbar Manager - 負責工具列的視覺與邏輯
 */
import { HarmoNyxAPI } from './api.js';
import '../toolbar.css';

export class ToolbarManager {
    constructor(workspace, stageUI) {
        this.workspace = workspace;
        this.stageUI = stageUI;
        this.invoke = HarmoNyxAPI.getInvoke();
        
        this.isDirty = false;
        this.currentFilename = '';
        this.isProcessing = false;
        this.currentLang = 'zh-hant';

        // DOM Elements
        this.elements = {
            openBtn: document.getElementById('open-btn'),
            saveBtn: document.getElementById('save-btn'),
            runBtn: document.getElementById('run-btn'),
            stopBtn: document.getElementById('stop-btn'),
            settingsBtn: document.getElementById('settings-btn'),
            examplesBtn: document.getElementById('examples-btn'),
            updateBtn: document.getElementById('update-btn')
        };

        this.menus = {
            settings: this.createMenu('dropdown-menu'),
            examples: this.createMenu('dropdown-menu')
        };

        this.DEFAULT_XML = `
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

        this.init();
    }

    createMenu(className) {
        const menu = document.createElement('div');
        menu.className = className;
        document.body.appendChild(menu);
        return menu;
    }

    init() {
        this.initI18n();
        this.bindEvents();
        this.setupSettingsMenu();
        this.setupGlobalClick();
    }

    initI18n() {
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (Blockly.Msg[key]) el.title = Blockly.Msg[key];
        });
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (Blockly.Msg[key]) el.textContent = Blockly.Msg[key];
        });
    }

    bindEvents() {
        this.elements.openBtn.onclick = async () => {
            if (await this.checkUnsavedChanges()) {
                const path = await window.__TAURI__.dialog.open({
                    filters: [{ name: 'HarmoNyx', extensions: ['nyx', 'xml'] }]
                });
                if (path) {
                    const content = await this.invoke('load_project', { path });
                    this.loadXMLToWorkspace(content);
                    this.currentFilename = path.split(/[\\/]/).pop();
                    if (this.mdiManager) this.mdiManager.updateActiveTabTitle(this.currentFilename);
                    setTimeout(() => {
                        this.workspace.isClearing = false;
                        this.setDirty(false);
                    }, 100);
                }
            }
        };

        this.elements.saveBtn.onclick = async () => {
            const path = await window.__TAURI__.dialog.save({
                filters: [{ name: 'HarmoNyx', extensions: ['nyx', 'xml'] }]
            });
            if (path) {
                const xmlContent = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(this.workspace));
                await this.invoke('save_project', { xmlContent, path });
                this.currentFilename = path.split(/[\\/]/).pop();
                if (this.mdiManager) this.mdiManager.updateActiveTabTitle(this.currentFilename);
                this.setDirty(false);
            }
        };

        this.elements.runBtn.onclick = async () => {
            this.elements.runBtn.classList.add('is-running');
            if (this.stageUI.clearLog) this.stageUI.clearLog();
            this.isProcessing = true;
            const code = Blockly.Processing.workspaceToCode(this.workspace);
            try {
                await this.invoke('run_processing', { code });
            } catch (err) {
                if (err === "ERR_NO_PROCESSING") {
                    const { message, open } = window.__TAURI__.dialog;
                    await message('找不到 Processing 執行環境...', { title: '執行環境缺失', kind: 'warning' });
                    const selectedPath = await open({
                        multiple: false,
                        directory: false,
                        filters: [{ name: 'Processing Java', extensions: ['exe', ''] }]
                    });
                    if (selectedPath) {
                        await this.invoke('set_processing_path', { path: selectedPath });
                        try {
                            await this.invoke('run_processing', { code });
                        } catch (retryErr) {
                            alert('執行失敗：' + retryErr);
                        }
                    } else {
                        this.isProcessing = false;
                    }
                } else {
                    alert('執行失敗：' + err);
                    this.isProcessing = false;
                }
            } finally {
                this.elements.runBtn.classList.remove('is-running');
            }
        };

        this.elements.stopBtn.onclick = () => {
            this.isProcessing = false;
            this.invoke('stop_processing');
        };

        this.elements.settingsBtn.onclick = (e) => {
            e.stopPropagation();
            this.updateLangCheck(this.currentLang);
            const rect = this.elements.settingsBtn.getBoundingClientRect();
            this.menus.settings.style.top = `${rect.bottom + 5}px`;
            this.menus.settings.style.left = `${rect.left - 120}px`;
            this.menus.settings.classList.toggle('show');
            this.menus.examples.classList.remove('show');
        };

        this.elements.examplesBtn.onclick = async (e) => {
            e.stopPropagation();
            try {
                const examples = await this.invoke('list_examples');
                let html = '';
                examples.forEach(ex => {
                    if (ex.category) {
                        html += `<div class="dropdown-item has-submenu"><img src="/icons/folder_special_24dp_75FB4C.png" class="nyx-icon-purple" style="width:20px;"><span>${ex.category}</span><span class="arrow">▶</span></div><div class="submenu">${ex.items.map(i => `<div class="dropdown-item example-item" data-path="${i.path}"><img src="/icons/lyrics_24dp_75FB4C.png" class="nyx-icon-blue" style="width:20px;"><span>${i.name}</span></div>`).join('')}</div>`;
                    } else {
                        html += `<div class="dropdown-item example-item" data-path="${ex.path}"><img src="/icons/lyrics_24dp_75FB4C.png" class="nyx-icon-blue" style="width:20px;"><span>${ex.name}</span></div>`;
                    }
                });
                this.menus.examples.innerHTML = html || '<div class="dropdown-item">無範例</div>';
                
                this.menus.examples.querySelectorAll('.example-item').forEach(item => {
                    item.onclick = async (e) => {
                        e.stopPropagation();
                        const path = item.getAttribute('data-path');
                        const filename = path.split(/[\\/]/).pop();
                        const content = await this.invoke('load_project', { path });
                        
                        if (this.mdiManager) {
                            // 使用 MDI 內建的新增並載入邏輯
                            this.mdiManager.addNewTab(filename, true, content);
                            this.menus.examples.classList.remove('show');
                        }
                    };
                });

                // 防止點擊選單內部（如分類資料夾）導致選單關閉
                this.menus.examples.onclick = (e) => e.stopPropagation();

                const rect = this.elements.examplesBtn.getBoundingClientRect();
                this.menus.examples.style.top = `${rect.bottom + 5}px`;
                this.menus.examples.style.left = `${rect.left}px`;
                this.menus.examples.classList.toggle('show');
                this.menus.settings.classList.remove('show');
            } catch (err) {
                console.error(err);
            }
        };
    }

    setupSettingsMenu() {
        this.menus.settings.innerHTML = `
            <div class="dropdown-item" id="restart-audio-item"><img src="/icons/rocket_launch_24dp_FE2F89.png" class="nyx-icon-neon"><span>${Blockly.Msg['HARMONYX_RESTART_AUDIO'] || '重啟音訊'}</span></div>
            <div class="dropdown-item" id="set-path-item"><img src="/icons/explore_24dp_FE2F89.png" class="nyx-icon-neon"><span>${Blockly.Msg['HARMONYX_SET_PATH'] || '設定路徑'}</span></div>
            <div class="dropdown-item" id="open-samples-item"><img src="/icons/load_project_24dp_FE2F89.png" class="nyx-icon-neon"><span>${Blockly.Msg['HARMONYX_OPEN_SAMPLES'] || '開啟聲音取樣檔資料夾'}</span></div>
            <div class="dropdown-item has-submenu"><img src="/icons/language_24dp_FE2F89.png" class="nyx-icon-neon"><span>${Blockly.Msg['HARMONYX_LANG_SETTING'] || '語言設定'}</span><span class="arrow">▶</span></div>
            <div class="submenu">
                <div class="dropdown-item lang-item" data-lang="zh-hant"><span class="lang-check" style="width:20px;"></span><span>正體中文</span></div>
                <div class="dropdown-item lang-item" data-lang="en"><span class="lang-check" style="width:20px;"></span><span>English</span></div>
            </div>
        `;

        this.menus.settings.addEventListener('click', async (e) => {
            if (e.target.closest('#open-samples-item')) {
                await this.invoke('open_samples_dir');
            }
            if (e.target.closest('#set-path-item')) {
                const { open } = window.__TAURI__.dialog;
                const selectedPath = await open({
                    multiple: false,
                    directory: false,
                    filters: [{ name: 'Processing Java', extensions: ['exe', ''] }]
                });
                if (selectedPath) {
                    await this.invoke('set_processing_path', { path: selectedPath });
                    alert("路徑已更新！");
                }
            }
            if (e.target.closest('.lang-item')) {
                const item = e.target.closest('.lang-item');
                const lang = item.getAttribute('data-lang');
                this.currentLang = lang;
                this.updateLangCheck(lang);
                e.stopPropagation();
                alert("語系切換功能開發中，目前設定將於下次啟動時生效。");
            }
        });
    }

    setupGlobalClick() {
        document.addEventListener('click', () => {
            this.menus.settings.classList.remove('show');
            this.menus.examples.classList.remove('show');
        });
    }

    updateLangCheck(lang) {
        this.menus.settings.querySelectorAll('.lang-check').forEach(el => el.innerHTML = '');
        const selectedEl = this.menus.settings.querySelector(`.lang-item[data-lang="${lang}"] .lang-check`);
        if (selectedEl) {
            selectedEl.innerHTML = `<img src="/icons/done_24dp_FE2F89.png" class="nyx-icon-neon" style="width: 16px;">`;
        }
    }

    setDirty(dirty) {
        if (this.workspace.isClearing && dirty) return;
        this.isDirty = dirty;
        const displayFilename = this.currentFilename || '未命名專案';
        document.title = `${dirty ? '*' : ''}${displayFilename} - HarmoNyx`;
        
        // 同步到 MDI
        if (this.mdiManager) {
            this.mdiManager.updateActiveTabDirty(dirty);
        }
    }

    async checkUnsavedChanges() {
        if (this.isDirty) {
            const { ask } = window.__TAURI__.dialog;
            return await ask('分頁內容尚未儲存，確定要切換或建立嗎？', { title: '警告', kind: 'warning' });
        }
        return true;
    }

    createDefaultBlocks() {
        this.workspace.isClearing = true;
        this.workspace.clear();
        setTimeout(() => {
            try {
                const dom = Blockly.utils.xml.textToDom(this.DEFAULT_XML);
                Blockly.Xml.domToWorkspace(dom, this.workspace);
            } catch (e) {
                const setup = this.workspace.newBlock('processing_setup');
                setup.initSvg(); setup.render(); setup.moveBy(20, 20);
                const draw = this.workspace.newBlock('processing_draw');
                draw.initSvg(); draw.render(); draw.moveBy(20, 350);
            }
            setTimeout(() => {
                this.workspace.isClearing = false;
                this.setDirty(false);
                // 這裡需要通知外部更新 LiveCode，暫時透過事件或回調
                if (this.onWorkspaceChanged) this.onWorkspaceChanged();
            }, 100);
        }, 50);
    }

    loadXMLToWorkspace(xmlText) {
        this.workspace.isClearing = true;
        this.workspace.clear();
        const dom = Blockly.utils.xml.textToDom(xmlText);
        Blockly.Xml.domToWorkspace(dom, this.workspace);
    }
}
