/**
 * @fileoverview Utility functions for HarmoNyx IDE.
 * Shared between main UI and generators.
 */

window.SB_Utils = window.SB_Utils || {};

/**
 * --- NaNShield: 防止 SVG 屬性寫入 NaN 導致渲染崩潰 ---
 */
window.SB_Utils.injectNaNShield = function() {
    const originalSetAttribute = SVGElement.prototype.setAttribute;
    SVGElement.prototype.setAttribute = function(name, value) {
        if (typeof value === 'number' && isNaN(value)) {
            return originalSetAttribute.call(this, name, "0");
        }
        if (typeof value === 'string' && value.includes('NaN')) {
            return originalSetAttribute.call(this, name, value.replace(/NaN/g, "0"));
        }
        return originalSetAttribute.call(this, name, value);
    };
    console.log("NaNShield injected.");
};

/**
 * --- Blockly API Polyfills (v12 to v13 compatibility) ---
 */
window.SB_Utils.initPolyfills = function() {
    if (Blockly.Workspace.prototype.getAllVariables === undefined) {
        Blockly.Workspace.prototype.getAllVariables = function() {
            return this.getVariableMap().getAllVariables();
        };
    }
    if (Blockly.Workspace.prototype.getVariable === undefined) {
        Blockly.Workspace.prototype.getVariable = function(name, opt_type) {
            return this.getVariableMap().getVariable(name, opt_type);
        };
    }
    if (Blockly.Workspace.prototype.getVariableById === undefined) {
        Blockly.Workspace.prototype.getVariableById = function(id) {
            return this.getVariableMap().getVariableById(id);
        };
    }
};

/**
 * --- Key Management System ---
 */
window.SB_Utils.KEYS = {
    SYSTEM: ['up', 'down', 'left', 'right', '+', '-', 'backspace'],
    PIANO: ['q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u', 'i', '9', 'o', '0', 'p'],
    ALL: 'abcdefghijklmnopqrstuvwxyz1234567890[]\;,./'.split('')
};

window.SB_Utils.getAvailableKeys = function(currentBlock) {
    const workspace = currentBlock.workspace;
    const hasStage = workspace.getAllBlocks(false).some(b => b.type === 'visual_stage_setup');
    const occupiedKeys = new Set();
    workspace.getAllBlocks(false).forEach(b => {
        if (b !== currentBlock && (b.type === 'ui_key_event' || b.type === 'ui_key_pressed')) {
            const val = b.getFieldValue('KEY');
            if (val) occupiedKeys.add(val.toLowerCase());
        }
    });

    const options = [];
    window.SB_Utils.KEYS.ALL.forEach(k => {
        const isPiano = window.SB_Utils.KEYS.PIANO.includes(k);
        const isOccupied = occupiedKeys.has(k);
        const isSystem = window.SB_Utils.KEYS.SYSTEM.includes(k);
        if (isSystem) return;
        let label = k.toUpperCase();
        if (hasStage && isPiano) return;
        if (isOccupied) return;
        options.push([label, k]);
    });
    return options.length > 0 ? options : [['(無可用按鍵)', 'NONE']];
};

/**
 * --- Generator Helpers ---
 */

window.SB_Utils.getInstrumentJavaName = function(name) {
    const currentLabel = '當前選用的樂器';
    const promptLabel = '(請選擇樂器)';
    if (!name || name === currentLabel || name === promptLabel) {
        return 'currentInstrument';
    }
    return '"' + name + '"';
};

window.SB_Utils.getRelativeIndex = function(atCode) {
    if (!atCode) atCode = '1';
    if (!isNaN(parseFloat(atCode)) && isFinite(atCode)) {
        return String(Number(atCode) - 1);
    }
    return atCode + ' - 1';
};

/**
 * --- Color Utilities ---
 */

window.SB_Utils.hexToJavaColor = function(hex) {
    if (!hex) return "color(0)";
    // 移除 # 號
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `color(${r}, ${g}, ${b})`;
};

window.SB_Utils.hexToHue = function(hex) {
    if (!hex) return 0;
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h;
    if (max === min) h = 0;
    else if (max === r) h = (60 * ((g - b) / (max - min)) + 360) % 360;
    else if (max === g) h = (60 * ((b - r) / (max - min)) + 120);
    else h = (60 * ((r - g) / (max - min)) + 240);
    return Math.round(h * 255 / 360); // 縮放至 Processing 的 0-255 HSB 範圍
};

/**
 * --- Audio Block Shared Helpers ---
 */

window.SB_Utils.FIELD_HELPER = {
    onchange: function (e) {
        if (!this.workspace || this.isInFlyout) return;
        if (e.type === Blockly.Events.BLOCK_CHANGE && e.blockId === this.id && 
           (e.name === 'PATH' || e.name === 'TYPE' || e.name === 'EFFECT_TYPE')) {
            this.updateShape_(e.newValue);
        }
    }
};

window.SB_Utils.getInstrumentOptions = function () {
    const options = [];
    const currentLabel = '當前選用的樂器';
    options.push([currentLabel, currentLabel]);
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
        const blocks = workspace.getBlocksByType('sb_instrument_container');
        for (let block of blocks) {
            const name = block.getFieldValue('NAME');
            if (name) options.push([name, name]);
        }
    }
    return options;
};

window.SB_Utils.createInstrumentField = function (defaultVal) {
    const field = new Blockly.FieldTextInput(defaultVal || '');
    field.showEditor_ = function (opt_e) {
        setTimeout(() => {
            const options = window.SB_Utils.getInstrumentOptions();
            const menu = options.map(opt => ({
                text: opt[0],
                enabled: true,
                callback: () => { field.setValue(opt[1]); }
            }));
            menu.push({
                text: "--- 手動輸入 ---",
                enabled: true,
                callback: () => { Blockly.FieldTextInput.prototype.showEditor_.call(field); }
            });
            Blockly.ContextMenu.show(opt_e || {}, menu, this.sourceBlock_.RTL);
        }, 10);
    };
    return field;
};

/**
 * --- Audio Mutators ---
 */

window.SB_Utils.HARMONIC_PARTIALS_MUTATOR = {
    itemCount_: 3,
    mutationToDom: function () {
        const container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },
    domToMutation: function (xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },
    decompose: function (workspace) {
        const containerBlock = workspace.newBlock('sb_harmonic_partial_container');
        containerBlock.initSvg();
        let connection = containerBlock.nextConnection;
        for (let i = 0; i < this.itemCount_; i++) {
            const itemBlock = workspace.newBlock('sb_harmonic_partial_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    compose: function (containerBlock) {
        let itemBlock = containerBlock.getNextBlock();
        this.itemCount_ = 0;
        while (itemBlock) {
            this.itemCount_++;
            itemBlock = itemBlock.getNextBlock();
        }
        this.updateShape_();
    },
    updateShape_: function () {
        let i = 1;
        while (this.getInput('PARTIAL' + i)) {
            this.removeInput('PARTIAL' + i);
            i++;
        }
        for (let j = 1; j <= this.itemCount_; j++) {
            this.appendValueInput('PARTIAL' + j)
                .setCheck('Number')
                .appendField("泛音 " + j);
        }
    }
};

window.SB_Utils.ADDITIVE_SYNTH_MUTATOR = {
    itemCount_: 2,
    mutationToDom: function () {
        const container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },
    domToMutation: function (xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },
    decompose: function (workspace) {
        const containerBlock = workspace.newBlock('sb_additive_synth_container');
        containerBlock.initSvg();
        let connection = containerBlock.nextConnection;
        for (let i = 0; i < this.itemCount_; i++) {
            const itemBlock = workspace.newBlock('sb_additive_synth_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    compose: function (containerBlock) {
        let itemBlock = containerBlock.getNextBlock();
        this.itemCount_ = 0;
        while (itemBlock) {
            this.itemCount_++;
            itemBlock = itemBlock.getNextBlock();
        }
        this.updateShape_();
    },
    updateShape_: function () {
        let i = 1;
        while (this.getInput('COMP' + i)) { this.removeInput('COMP' + i); i++; }
        for (let j = 1; j <= this.itemCount_; j++) {
            this.appendDummyInput('COMP' + j)
                .appendField("波形")
                .appendField(new Blockly.FieldDropdown([["Triangle", "TRIANGLE"], ["Sine", "SINE"], ["Square", "SQUARE"], ["Saw", "SAW"]]), "WAVE" + j)
                .appendField("倍率")
                .appendField(new Blockly.FieldTextInput("1.0"), "RATIO" + j)
                .appendField("振幅")
                .appendField(new Blockly.FieldTextInput("0.5"), "AMP" + j);
        }
    }
};

window.SB_Utils.DRUM_SAMPLER_MUTATOR = {
    mutationToDom: function () {
        const container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('type', this.getFieldValue('PATH') || 'Kick');
        return container;
    },
    domToMutation: function (xmlElement) {
        this.updateShape_(xmlElement.getAttribute('type') || 'Kick');
    },
    updateShape_: function (type) {
        const inputExists = this.getInput('CUSTOM_PATH');
        if (type === 'CUSTOM') {
            if (!inputExists) {
                this.appendDummyInput('CUSTOM_PATH')
                    .appendField("路徑")
                    .appendField(new Blockly.FieldTextInput("drum/kick.wav"), "CUSTOM_PATH_VALUE");
            }
        } else {
            if (inputExists) {
                this.removeInput('CUSTOM_PATH');
            }
        }
    }
};

window.SB_Utils.MELODIC_SAMPLER_MUTATOR = {
    mutationToDom: function () {
        const container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('type', this.getFieldValue('TYPE') || 'PIANO');
        return container;
    },
    domToMutation: function (xmlElement) {
        this.updateShape_(xmlElement.getAttribute('type') || 'PIANO');
    },
    updateShape_: function (type) {
        const inputExists = this.getInput('CUSTOM_PATH');
        if (type === 'CUSTOM') {
            if (!inputExists) {
                this.appendDummyInput('CUSTOM_PATH')
                    .appendField("路徑")
                    .appendField(new Blockly.FieldTextInput("piano"), "CUSTOM_PATH_VALUE");
            }
        } else {
            if (inputExists) {
                this.removeInput('CUSTOM_PATH');
            }
        }
    }
};

window.SB_Utils.initMinimap = function(workspace) {
    if (window.PositionedMinimap) {
        const MinimapClass = window.PositionedMinimap;
        const minimap = new MinimapClass(workspace);
        minimap.init();
        
        // Z-Index 同步修復：監聽點擊事件，強制更新 Minimap 圖層順序
        workspace.addChangeListener((e) => {
            if (e.type === Blockly.Events.CLICK && e.blockId) {
                // 延遲執行以確保 Blockly 主畫面已完成重繪
                setTimeout(() => {
                    const minimapSvg = document.querySelector('.blockly-minimap svg');
                    if (!minimapSvg) return;
                    
                    // Minimap 通常會複製 Block ID 作為 SVG ID 或 class
                    // 嘗試尋找對應的 Minimap 元素
                    // 注意：Blockly Minimap 實作可能有所不同，通常它會鏡像主 Workspace 的結構
                    
                    // 方法 A: 透過 ID 尋找 (假設 Minimap 複製了 ID)
                    let miniBlock = minimapSvg.getElementById(e.blockId);
                    
                    // 方法 B: 如果 ID 沒複製，Minimap 可能是一個全域重繪，這種情況下我們需要呼叫 Minimap 的更新方法
                    // 但大多數 Minimap 插件是增量更新的
                    
                    if (miniBlock) {
                        // SVG Z-Index 駭客：移到父節點的最後面
                        const parent = miniBlock.parentNode;
                        if (parent) {
                            parent.appendChild(miniBlock);
                        }
                    } else {
                        // 如果找不到 ID，嘗試尋找帶有 data-id 的元素
                        miniBlock = minimapSvg.querySelector(`[data-id="${e.blockId}"]`);
                        if (miniBlock) {
                            const parent = miniBlock.parentNode;
                            if (parent) parent.appendChild(miniBlock);
                        }
                    }
                }, 0);
            }
        });

        const mWrapper = document.querySelector('.blockly-minimap');
        if (mWrapper && !document.getElementById('minimap-toggle')) {
            const toggleBtn = document.createElement('div');
            toggleBtn.id = 'minimap-toggle';
            toggleBtn.title = '切換 Minimap (Ctrl+M)';
            
            const ICON_CLOSE = '/icons/cancel_24dp_FE2F89.png';
            const ICON_OPEN = '/icons/public_24dp_FE2F89.png';
            
            toggleBtn.style.backgroundImage = `url(${ICON_CLOSE})`;
            toggleBtn.style.backgroundColor = 'transparent';
            toggleBtn.style.border = 'none';
            
            const toggle = () => {
                const isCollapsed = mWrapper.classList.toggle('collapsed');
                toggleBtn.classList.toggle('collapsed');
                toggleBtn.style.backgroundImage = `url(${isCollapsed ? ICON_OPEN : ICON_CLOSE})`;
                Blockly.svgResize(workspace);
            };

            toggleBtn.addEventListener('click', toggle);
            // 修正：掛載到 blocklyDiv，使其跟隨 workspace 佈局
            const container = document.getElementById('blocklyDiv');
            if (container) container.appendChild(toggleBtn);

            // 快捷鍵支援
            window.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
                    e.preventDefault();
                    toggle();
                }
            });
        }
    }
};

// Export as UIUtils for WaveCode compatibility
export const UIUtils = window.SB_Utils;
