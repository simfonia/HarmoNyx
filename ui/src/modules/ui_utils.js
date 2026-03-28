/**
 * HarmoNyx UI 輔助工具
 */

export const UIUtils = {
    /**
     * 初始化積木搜尋功能
     */
    initSearch: (workspace) => {
        const BlockSearcher = {
            _cache: new Map(),
            _searchTimeout: null,
            buildIndex: function() {
                this._cache.clear();
                const types = Object.keys(Blockly.Blocks);
                types.forEach(type => {
                    let blob = type.toLowerCase();
                    const def = Blockly.Blocks[type];
                    if (def) { for(let i=0; i<10; i++) { const m = def['message'+i]; if(typeof m === 'string') blob += ' ' + m.replace(/%\d+/g,'').toLowerCase(); } }
                    this._cache.set(type, blob);
                });
            },
            inject: function(ws) {
                const blocklyDiv = document.getElementById('blocklyDiv');
                const toolboxDiv = document.querySelector('.blocklyToolboxDiv');
                if (!blocklyDiv || !toolboxDiv || document.getElementById('block-search-container')) return;
                const searchDiv = document.createElement('div');
                searchDiv.id = 'block-search-container';
                searchDiv.innerHTML = `<input type="text" id="block-search" placeholder="搜尋積木..." autocomplete="off"><img src="/icons/cancel_24dp_FE2F89.png" id="search-clear-btn" class="nyx-icon-neon" style="display:none">`;
                blocklyDiv.appendChild(searchDiv);
                const searchInput = document.getElementById('block-search');
                const updateWidth = () => { const rect = toolboxDiv.getBoundingClientRect(); if (rect.width > 0) searchDiv.style.width = rect.width + 'px'; };
                new ResizeObserver(updateWidth).observe(toolboxDiv);
                searchInput.oninput = (e) => {
                    clearTimeout(this._searchTimeout);
                    this._searchTimeout = setTimeout(() => {
                        const query = e.target.value.toLowerCase().trim();
                        const toolbox = ws.getToolbox();
                        const flyout = toolbox ? toolbox.getFlyout() : null;
                        if (!flyout) return;
                        if (!query) { flyout.hide(); return; }
                        const matched = []; this._cache.forEach((b, t) => { if(b.includes(query)) matched.push(t); });
                        const xmlList = matched.slice(0, 20).map(t => { const x = Blockly.utils.xml.createElement('block'); x.setAttribute('type', t); return x; });
                        flyout.show(xmlList);
                    }, 200);
                };
            }
        };
        setTimeout(() => { BlockSearcher.buildIndex(); BlockSearcher.inject(workspace); }, 1000);
    },

    /**
     * 初始化側邊面板
     */
    initStagePanel: () => {
        const panel = document.getElementById('stage-panel');
        const toggle = document.getElementById('stage-toggle');
        const logContainer = document.getElementById('log-container');
        if (toggle) toggle.onclick = () => { panel.classList.toggle('collapsed'); setTimeout(() => window.dispatchEvent(new Event('resize')), 310); };
        const tabs = document.querySelectorAll('.tab-btn');
        const panes = document.querySelectorAll('.tab-pane');
        tabs.forEach(tab => {
            tab.onclick = () => {
                tabs.forEach(t => t.classList.remove('active')); panes.forEach(p => p.classList.remove('active'));
                tab.classList.add('active'); const target = document.getElementById(tab.getAttribute('data-tab'));
                if (target) target.classList.add('active');
            };
        });
        return { appendLog: (msg, type='info') => { if(!logContainer) return; const d = document.createElement('div'); d.className = `log-line log-${type}`; d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; } };
    },

    /**
     * 注入 NaN 防護盾
     */
    injectNaNShield: () => {
        const originalSetAttribute = Element.prototype.setAttribute;
        Element.prototype.setAttribute = function(name, value) {
            if (typeof value === 'string' && (value.includes('NaN') || value.includes('undefined'))) {
                if (name === 'transform') return;
                if (name === 'x' || name === 'y' || name === 'width' || name === 'height' || name === 'd') return;
            }
            if ((name === 'x' || name === 'y' || name === 'width' || name === 'height' || name === 'd') && 
                (Number.isNaN(value) || typeof value === 'undefined')) return;
            originalSetAttribute.apply(this, arguments);
        };
    },

    /**
     * --- Orphan Block System ---
     */
    VALID_ROOTS: ['processing_setup', 'processing_draw', 'processing_exit', 'ui_key_event', 'sb_perform', 'sb_tone_loop', 'sb_instrument_container', 'sb_define_chord', 'sb_serial_data_received', 'midi_on_note', 'midi_off_note', 'midi_on_controller_change', 'procedures_defnoreturn', 'procedures_defreturn', 'sb_comment'],
    updateOrphanBlocks: (ws) => {
        if (!ws || ws.isDragging()) return;
        const topBlocks = ws.getTopBlocks(false);
        topBlocks.forEach(topBlock => {
            const isOrphan = !UIUtils.VALID_ROOTS.includes(topBlock.type);
            topBlock.getDescendants(false).forEach(block => {
                if (block.setDisabledReason) {
                    const hasOrphanReason = block.hasDisabledReason('orphan');
                    if (hasOrphanReason !== isOrphan) block.setDisabledReason(isOrphan, 'orphan');
                } else if (block.setDisabled) block.setDisabled(isOrphan);
            });
        });
    }
};
