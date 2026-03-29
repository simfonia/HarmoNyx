/**
 * HarmoNyx MDI Manager - 負責多文件分頁管理 (獨立工作區版本)
 */
import '../mdi.css';
import { VisualMinimap } from './minimap.js';
import { UIUtils } from './ui_utils.js';

export class MDIManager {
    constructor(toolbarManager, blocklyOptions) {
        this.toolbarManager = toolbarManager;
        this.blocklyOptions = blocklyOptions; // 儲存 Blockly 注入配置
        
        this.tabs = [];
        this.activeTabId = null;

        this.elements = {
            tabBar: document.getElementById('mdi-tab-bar'),
            tabsContainer: document.getElementById('tabs-container'),
            addTabBtn: document.getElementById('add-tab-btn'),
            workspaceContainer: document.getElementById('workspace-container')
        };

        this.init();
    }

    init() {
        this.elements.addTabBtn.onclick = () => this.addNewTab();
    }

    /**
     * 新增分頁與獨立工作區
     * @param {string} title 標題
     * @param {boolean} isActive 是否設為活動
     * @param {string} initialXml 選用的初始 XML
     */
    addNewTab(title = "未命名專案", isActive = true, initialXml = null) {
        const tabId = 'tab-' + Date.now();
        
        // 1. 建立工作區容器
        const wrapper = document.createElement('div');
        wrapper.id = 'wrapper-' + tabId;
        wrapper.className = 'blockly-wrapper';
        this.elements.workspaceContainer.appendChild(wrapper);

        // 2. 注入獨立的工作區
        const workspace = Blockly.inject(wrapper, this.blocklyOptions);
        
        // 3. 初始化輔助工具
        new VisualMinimap(workspace);
        UIUtils.initSearch(workspace);

        const tab = {
            id: tabId,
            title: title,
            isDirty: false,
            workspace: workspace,
            wrapper: wrapper
        };

        this.tabs.push(tab);
        this.renderTab(tab);

        // 輔助說明延遲重置計時器
        let helpResetTimeout = null;

        // 綁定變動監聽 (同步 Dirty 狀態與點擊偵測)
        workspace.addChangeListener((e) => {
            if (workspace.isClearing) return;

            if (!e.isUiEvent) {
                if ([Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CREATE, Blockly.Events.BLOCK_CHANGE, Blockly.Events.BLOCK_DELETE, Blockly.Events.VAR_CREATE, Blockly.Events.VAR_RENAME, Blockly.Events.VAR_DELETE].includes(e.type)) {
                    this.updateTabDirty(tabId, true);
                    if (this.activeTabId === tabId && this.toolbarManager.onWorkspaceChanged) {
                        this.toolbarManager.onWorkspaceChanged();
                    }
                }
            }
            
            // 點擊積木更新輔助說明
            let targetBlockId = null;
            if (e.type === Blockly.Events.UI && (e.element === 'click' || e.element === 'selected')) {
                targetBlockId = e.blockId || e.newValue;
            } else if (e.type === 'selected' || e.type === 'click') {
                targetBlockId = e.blockId || e.newValue;
            } else if ([Blockly.Events.BLOCK_MOVE, Blockly.Events.BLOCK_CREATE, Blockly.Events.BLOCK_CHANGE].includes(e.type)) {
                targetBlockId = e.blockId;
            }

            if (targetBlockId && this.activeTabId === tabId) {
                // 如果收到了新的選取事件，取消延遲重置
                if (helpResetTimeout) {
                    clearTimeout(helpResetTimeout);
                    helpResetTimeout = null;
                }
                const block = workspace.getBlockById(targetBlockId);
                if (block && window.updateVisualHelp) {
                    window.updateVisualHelp(block, this.toolbarManager.currentLang);
                }
            } else if (this.activeTabId === tabId && (e.type === 'selected' || e.type === 'click' || (e.type === Blockly.Events.UI && e.element === 'selected'))) {
                // 只有在明確的 UI 選取/取消選取事件發生且沒有 targetBlockId 時，才啟動延遲重置
                if (helpResetTimeout) clearTimeout(helpResetTimeout);
                helpResetTimeout = setTimeout(() => {
                    if (window.updateVisualHelp) window.updateVisualHelp(null);
                    helpResetTimeout = null;
                }, 200); // 200ms 足夠跳過事件間隙
            }
        });

        if (isActive) {
            this.switchTab(tabId);
            
            // 重要：確保在 switchTab (容器顯示) 後再載入內容
            setTimeout(() => {
                workspace.isClearing = true;
                workspace.clear();
                
                if (initialXml) {
                    const dom = Blockly.utils.xml.textToDom(initialXml);
                    Blockly.Xml.domToWorkspace(dom, workspace);
                } else if (this.toolbarManager) {
                    // 只有在完全沒有 initialXml 時才載入預設 blocks
                    this.toolbarManager.createDefaultBlocks();
                }

                setTimeout(() => {
                    workspace.isClearing = false;
                    Blockly.svgResize(workspace);
                    if (this.toolbarManager.onWorkspaceChanged) this.toolbarManager.onWorkspaceChanged();
                }, 100);
            }, 100);
        }
        
        return tab;
    }

    renderTab(tab) {
        const tabEl = document.createElement('div');
        tabEl.className = 'mdi-tab';
        tabEl.id = tab.id;
        tabEl.innerHTML = `
            <img src="/icons/music_note_24dp_FE2F89.png" class="tab-icon nyx-icon-purple">
            <span class="tab-title">${tab.title}</span>
            <div class="dirty-indicator"></div>
            <div class="tab-close" title="關閉分頁">×</div>
        `;

        tabEl.onclick = (e) => {
            if (e.target.classList.contains('tab-close')) {
                this.closeTab(tab.id);
            } else {
                this.switchTab(tab.id);
            }
        };

        // 將新增按鈕始終保持在最後
        this.elements.tabsContainer.insertBefore(tabEl, this.elements.addTabBtn);
    }

    /**
     * 切換活動分頁
     */
    switchTab(tabId) {
        if (this.activeTabId === tabId) return;

        // 1. 隱藏舊分頁
        if (this.activeTabId) {
            const oldTab = this.tabs.find(t => t.id === this.activeTabId);
            if (oldTab) {
                oldTab.wrapper.classList.remove('active');
                document.getElementById(this.activeTabId).classList.remove('active');
            }
        }

        // 2. 顯示新分頁
        this.activeTabId = tabId;
        const newTab = this.tabs.find(t => t.id === tabId);
        const newTabEl = document.getElementById(tabId);
        
        if (newTab && newTabEl) {
            newTab.wrapper.classList.add('active');
            newTabEl.classList.add('active');
            
            // 重要：更換 ToolbarManager 操控的 workspace
            this.toolbarManager.workspace = newTab.workspace;
            
            // 同步 Toolbar 狀態
            this.toolbarManager.currentFilename = newTab.title === "未命名專案" ? "" : newTab.title;
            this.toolbarManager.isDirty = newTab.isDirty;
            this.toolbarManager.setDirty(newTab.isDirty);

            // 強制重繪與同步內容
            setTimeout(() => {
                Blockly.svgResize(newTab.workspace);
                
                // 讓 Blockly 標記此工作區為活動狀態 (多工作區環境關鍵)
                if (Blockly.common && Blockly.common.setMainWorkspace) {
                    Blockly.common.setMainWorkspace(newTab.workspace);
                }
                newTab.workspace.markFocused(); 
                
                // 主動將焦點移至 Blockly 內部的隱藏輸入框，這是捕獲快捷鍵的關鍵
                const focusable = newTab.workspace.getParentSvg().parentNode;
                if (focusable) {
                    focusable.setAttribute('tabindex', '0');
                    focusable.focus({ preventScroll: true });
                }

                if (this.toolbarManager.onWorkspaceChanged) this.toolbarManager.onWorkspaceChanged();
            }, 50);
        }
    }

    updateActiveTabTitle(title) {
        const tab = this.tabs.find(t => t.id === this.activeTabId);
        if (tab) {
            tab.title = title;
            const tabEl = document.getElementById(this.activeTabId);
            if (tabEl) tabEl.querySelector('.tab-title').textContent = title;
        }
    }

    updateTabDirty(tabId, isDirty) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (tab) {
            tab.isDirty = isDirty;
            const tabEl = document.getElementById(tabId);
            if (tabEl) {
                isDirty ? tabEl.classList.add('is-dirty') : tabEl.classList.remove('is-dirty');
            }
            // 如果是當前分頁，同步給 ToolbarManager 內部狀態 (不觸發 setDirty 以免循環)
            if (this.activeTabId === tabId) {
                this.toolbarManager.isDirty = isDirty;
            }
        }
    }

    updateActiveTabDirty(isDirty) {
        this.updateTabDirty(this.activeTabId, isDirty);
    }

    async closeTab(tabId) {
        const tabIndex = this.tabs.findIndex(t => t.id === tabId);
        if (tabIndex === -1) return;

        const tab = this.tabs[tabIndex];
        if (tab.isDirty) {
            const { ask } = window.__TAURI__.dialog;
            const ok = await ask(`分頁 [${tab.title}] 尚未儲存，確定要關閉嗎？`, { title: '警告', kind: 'warning' });
            if (!ok) return;
        }

        this.tabs.splice(tabIndex, 1);
        tab.wrapper.remove(); // 銷毀工作區 DOM
        const tabEl = document.getElementById(tabId);
        if (tabEl) tabEl.remove();

        if (this.activeTabId === tabId) {
            if (this.tabs.length > 0) {
                const nextTab = this.tabs[Math.max(0, tabIndex - 1)];
                this.activeTabId = null;
                this.switchTab(nextTab.id);
            } else {
                this.activeTabId = null;
                this.addNewTab();
            }
        }
    }
}
