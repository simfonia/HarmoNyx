/**
 * HarmoNyx UI 輔助工具
 */

export const UIUtils = {
    /**
     * 初始化積木搜尋功能 (ResizeObserver 強化版)
     */
    initSearch: (workspace) => {
        const BlockSearcher = {
            _cache: new Map(),
            _searchTimeout: null,

            buildIndex: function() {
                this._cache.clear();
                const types = Object.keys(Blockly.Blocks);
                const msgCache = new Map();
                Object.keys(Blockly.Msg).forEach(key => { 
                    msgCache.set(key.toUpperCase(), String(Blockly.Msg[key]).toLowerCase()); 
                });

                types.forEach(type => {
                    let searchBlob = type.toLowerCase();
                    const blockDef = Blockly.Blocks[type];
                    if (!blockDef) return;
                    const typeUpper = type.toUpperCase();
                    msgCache.forEach((val, key) => { 
                        if (key.includes(typeUpper) || typeUpper.includes(key)) searchBlob += ' ' + val; 
                    });
                    for (let i = 0; i < 10; i++) {
                        const msg = blockDef['message' + i];
                        if (msg && typeof msg === 'string') searchBlob += ' ' + msg.replace(/%\d+/g, '').toLowerCase();
                    }
                    if (type.includes('set_')) searchBlob += ' 設定 set change';
                    if (type.includes('get_')) searchBlob += ' 取得 get read';
                    if (type.includes('play')) searchBlob += ' 演奏 播放 play music';
                    this._cache.set(type, searchBlob);
                });
            },

            inject: function(ws) {
                const blocklyDiv = document.getElementById('blocklyDiv');
                const toolboxDiv = document.querySelector('.blocklyToolboxDiv');
                if (!blocklyDiv || !toolboxDiv || document.getElementById('block-search-container')) return;

                const searchDiv = document.createElement('div');
                searchDiv.id = 'block-search-container';
                searchDiv.innerHTML = `
                    <input type="text" id="block-search" placeholder="搜尋積木..." autocomplete="off">
                    <img src="/icons/cancel_24dp_FE2F89.png" id="search-clear-btn" class="nyx-icon-neon" title="清除搜尋 (Esc)">
                `;
                blocklyDiv.appendChild(searchDiv);

                const searchInput = document.getElementById('block-search');
                const clearBtn = document.getElementById('search-clear-btn');

                // --- 強化同步邏輯：直接觀察工具箱 DOM ---
                const updateWidth = () => {
                    const rect = toolboxDiv.getBoundingClientRect();
                    if (rect.width > 0) {
                        searchDiv.style.width = rect.width + 'px';
                    }
                };

                try {
                    const ro = new ResizeObserver(() => updateWidth());
                    ro.observe(toolboxDiv);
                    // 針對類別樹也進行觀察，因為寬度變化通常來自內容文字
                    const treeRoot = document.querySelector('.blocklyTreeRoot');
                    if (treeRoot) ro.observe(treeRoot);
                } catch (e) {
                    console.error("ResizeObserver failed:", e);
                    window.addEventListener('resize', updateWidth);
                }

                const performSearch = (query) => {
                    const toolbox = ws.getToolbox();
                    const flyout = toolbox ? toolbox.getFlyout() : null;
                    if (!flyout) return;

                    if (!query) {
                        if (toolbox) toolbox.clearSelection();
                        flyout.hide();
                        if (clearBtn) clearBtn.style.display = 'none';
                        return;
                    }

                    if (clearBtn) clearBtn.style.display = 'block';
                    const matchedTypes = [];
                    query = query.toLowerCase();
                    this._cache.forEach((blob, type) => { if (blob.includes(query)) matchedTypes.push(type); });

                    matchedTypes.sort((a, b) => (a.startsWith(query) ? 0 : 1) - (b.startsWith(query) ? 0 : 1));
                    const limitedResults = matchedTypes.slice(0, 30);

                    if (limitedResults.length > 0) {
                        const xmlList = limitedResults.map(type => {
                            const blockXml = Blockly.utils.xml.createElement('block');
                            blockXml.setAttribute('type', type);
                            return blockXml;
                        });
                        try {
                            flyout.show(xmlList);
                            if (flyout.scrollToTop) flyout.scrollToTop();
                        } catch (err) {}
                    } else {
                        flyout.hide();
                    }
                };

                searchInput.addEventListener('input', (e) => {
                    clearTimeout(this._searchTimeout);
                    const val = e.target.value.trim();
                    this._searchTimeout = setTimeout(() => performSearch(val), 200);
                });

                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        searchInput.value = ''; performSearch(''); searchInput.blur();
                    }
                    e.stopPropagation();
                });

                if (clearBtn) {
                    clearBtn.onclick = () => {
                        searchInput.value = ''; performSearch(''); searchInput.focus();
                    };
                }
                
                // 初始執行一次
                updateWidth();
            }
        };

        setTimeout(() => {
            BlockSearcher.buildIndex();
            BlockSearcher.inject(workspace);
        }, 1500); 
        return BlockSearcher;
    },

    /**
     * 初始化側邊面板 (Stage Panel) 邏輯
     */
    initStagePanel: () => {
        const panel = document.getElementById('stage-panel');
        const toggle = document.getElementById('stage-toggle');
        const logContainer = document.getElementById('log-container');
        const clearBtn = document.getElementById('clear-log-btn');

        if (toggle) {
            toggle.onclick = () => {
                panel.classList.toggle('collapsed');
                setTimeout(() => window.dispatchEvent(new Event('resize')), 310);
            };
        }

        if (clearBtn) {
            clearBtn.onclick = () => { if (logContainer) logContainer.innerHTML = ''; };
        }

        // --- Smart Panel Tabs Logic ---
        const tabs = document.querySelectorAll('.tab-btn');
        const panes = document.querySelectorAll('.tab-pane');

        tabs.forEach(tab => {
            tab.onclick = () => {
                // Remove active from all
                tabs.forEach(t => {
                    t.classList.remove('active');
                    const img = t.querySelector('img');
                    if(img) img.style.filter = ''; // Reset filter if any
                });
                panes.forEach(p => p.classList.remove('active')); // CSS handles display:none

                // Activate clicked
                tab.classList.add('active');
                const targetId = tab.getAttribute('data-tab');
                const targetPane = document.getElementById(targetId);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            };
        });

        return {
            clearLog: () => { if (logContainer) logContainer.innerHTML = ''; },
            appendLog: (msg, type = 'info') => {
                if (!logContainer) return;
                const div = document.createElement('div');
                div.className = `log-line log-${type}`;
                div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
                logContainer.appendChild(div);
                logContainer.scrollTop = logContainer.scrollHeight;
                if (logContainer.childNodes.length > 200) logContainer.removeChild(logContainer.firstChild);
            }
        };
    },

    /**
     * 初始化 Minimap
     */
    initMinimap: (workspace) => {
        const MinimapClass = window.PositionedMinimap || window.Minimap;
        if (!MinimapClass) return;

        try {
            const minimap = new MinimapClass(workspace);
            minimap.init();
            
            let toggleBtn = document.getElementById('minimap-toggle');
            if (!toggleBtn) {
                toggleBtn = document.createElement('div');
                toggleBtn.id = 'minimap-toggle';
                toggleBtn.innerHTML = '<img src="/icons/cancel_24dp_FE2F89.png" class="nyx-icon-purple">';
                toggleBtn.title = "切換小地圖 (Ctrl+M)";
                const blocklyDiv = document.getElementById('blocklyDiv');
                if (blocklyDiv) blocklyDiv.appendChild(toggleBtn);
            }

            const toggleIcon = toggleBtn.querySelector('img');

            const updateToggleState = (isCollapsed) => {
                const mDiv = document.querySelector('.blockly-minimap');
                if (mDiv) {
                    if (isCollapsed) {
                        mDiv.style.setProperty('display', 'none', 'important');
                        mDiv.classList.add('collapsed');
                        if (toggleIcon) toggleIcon.src = "/icons/public_24dp_FE2F89.png";
                    } else {
                        mDiv.style.setProperty('display', 'block', 'important');
                        mDiv.classList.remove('collapsed');
                        if (toggleIcon) toggleIcon.src = "/icons/cancel_24dp_FE2F89.png";
                    }
                }
            };

            if (toggleBtn) {
                toggleBtn.onclick = () => {
                    const mDiv = document.querySelector('.blockly-minimap');
                    const currentlyCollapsed = mDiv ? (mDiv.style.display === 'none' || mDiv.classList.contains('collapsed')) : false;
                    updateToggleState(!currentlyCollapsed);
                };
            }

            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && (e.key === 'm' || e.key === 'M')) {
                    const mDiv = document.querySelector('.blockly-minimap');
                    const currentlyCollapsed = mDiv ? (mDiv.style.display === 'none' || mDiv.classList.contains('collapsed')) : false;
                    updateToggleState(!currentlyCollapsed);
                }
            });
        } catch (e) { console.error("Minimap fail:", e); }
    },

    /**
     * 注入 NaN 防護盾
     */
    injectNaNShield: () => {
        const originalSetAttribute = Element.prototype.setAttribute;
        Element.prototype.setAttribute = function(name, value) {
            if ((name === 'x' || name === 'y' || name === 'width' || name === 'height' || name === 'd') && 
                (value === 'NaN' || typeof value === 'undefined')) {
                return;
            }
            originalSetAttribute.apply(this, arguments);
        };
    }
};
