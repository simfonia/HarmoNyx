/**
 * HarmoNyx Pre-init Utility
 */

window.SB_Utils = window.SB_Utils || {};

/**
 * --- Blockly API Polyfills ---
 */
window.SB_Utils.initPolyfills = function() {
    if (Blockly.Workspace.prototype.getAllVariables === undefined) {
        Blockly.Workspace.prototype.getAllVariables = function() { return this.getVariableMap().getAllVariables(); };
    }
    if (Blockly.Workspace.prototype.getVariable === undefined) {
        Blockly.Workspace.prototype.getVariable = function(name, opt_type) { return this.getVariableMap().getVariable(name, opt_type); };
    }
    if (Blockly.Workspace.prototype.getVariableById === undefined) {
        Blockly.Workspace.prototype.getVariableById = function(id) { return this.getVariableMap().getVariableById(id); };
    }
};

/**
 * --- Audio Block Shared Helpers ---
 */
window.SB_Utils.getInstrumentOptions = function () {
    const options = [[Blockly.Msg['SB_CURRENT_INSTRUMENT_OPTION'] || '當前選用的樂器', '當前選用的樂器']];
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
        workspace.getBlocksByType('sb_instrument_container').forEach(b => {
            const name = b.getFieldValue('NAME');
            if (name) options.push([name, name]);
        });
    }
    return options;
};

window.SB_Utils.createInstrumentField = function (defaultVal) {
    const field = new Blockly.FieldTextInput(defaultVal || (Blockly.Msg['SB_CURRENT_INSTRUMENT_OPTION'] || '當前選用的樂器'));
    field.showEditor_ = function (opt_e) {
        setTimeout(() => {
            const menu = window.SB_Utils.getInstrumentOptions().map(opt => ({
                text: opt[0], enabled: true, callback: () => { field.setValue(opt[1]); }
            }));
            menu.push({
                text: "--- " + (Blockly.Msg['AUDIO_SAMPLER_CUSTOM'] || "手動輸入") + " ---",
                enabled: true, callback: () => { Blockly.FieldTextInput.prototype.showEditor_.call(field); }
            });
            Blockly.ContextMenu.show(opt_e || {}, menu, this.sourceBlock_.RTL);
        }, 10);
    };
    return field;
};

window.SB_Utils.getChordDropdown = function () {
    const chordBlocks = Blockly.getMainWorkspace().getBlocksByType('sb_define_chord');
    const options = chordBlocks.map(b => [b.getFieldValue('NAME'), b.getFieldValue('NAME')]);
    return options.length > 0 ? options : [[Blockly.Msg['AUDIO_SELECT_CHORD_DROPDOWN'] || '(選取和弦)', 'none']];
};

/**
 * --- Visual Color Helpers ---
 */
window.SB_Utils.hexToJavaColor = function (hex) {
    if (!hex || hex.charAt(0) !== '#') return "color(0)";
    const r = parseInt(hex.substring(1, 3), 16), g = parseInt(hex.substring(3, 5), 16), b = parseInt(hex.substring(5, 7), 16);
    return `color(${r}, ${g}, ${b})`;
};

window.SB_Utils.hexToHue = function (hex) {
    if (!hex || hex.charAt(0) !== '#') return 0;
    const r = parseInt(hex.substring(1, 3), 16) / 255, g = parseInt(hex.substring(3, 5), 16) / 255, b = parseInt(hex.substring(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let h = 0;
    if (max !== min) {
        if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h /= 6;
    }
    return (h * 255).toFixed(1);
};

/**
 * --- Mutators ---
 */
window.SB_Utils.FIELD_HELPER = {
    onchange: function (e) {
        if (this.disposed || e.type !== Blockly.Events.BLOCK_CHANGE || e.blockId !== this.id) return;
        if (this.workspace && this.workspace.isClearing) return;
        if (e.name === 'EFFECT_TYPE') {
            const newValue = e.newValue;
            if (this.lastType_ !== newValue) {
                this.updateShape_(newValue);
                this.lastType_ = newValue;
            }
        }
    }
};

window.SB_Utils.HARMONIC_PARTIALS_MUTATOR = {
    itemCount_: 3,
    mutationToDom: function () { const c = Blockly.utils.xml.createElement('mutation'); c.setAttribute('items', this.itemCount_); return c; },
    domToMutation: function (xml) { this.itemCount_ = parseInt(xml.getAttribute('items'), 10); this.updateShape_(); },
    decompose: function (ws) {
        const c = ws.newBlock('sb_harmonic_partial_container'); c.initSvg();
        let conn = c.nextConnection;
        for (let i = 0; i < this.itemCount_; i++) { const it = ws.newBlock('sb_harmonic_partial_item'); it.initSvg(); conn.connect(it.previousConnection); conn = it.nextConnection; }
        return c;
    },
    compose: function (c) { let it = c.getNextBlock(); this.itemCount_ = 0; while (it) { this.itemCount_++; it = it.getNextBlock(); } this.updateShape_(); },
    updateShape_: function () {
        const conns = []; for (let i = 1; i <= 100; i++) { const inp = this.getInput('PARTIAL' + i); if (!inp) break; conns.push(inp.connection.targetConnection); }
        let i = 1; while (this.getInput('PARTIAL' + i)) { this.removeInput('PARTIAL' + i); i++; }
        for (let i = 1; i <= this.itemCount_; i++) {
            const inp = this.appendValueInput('PARTIAL' + i).setCheck('Number').appendField("分音 " + i);
            if (conns[i - 1]) inp.connection.connect(conns[i - 1]);
        }
    }
};

window.SB_Utils.ADDITIVE_SYNTH_MUTATOR = {
    itemCount_: 2,
    mutationToDom: function () { const c = Blockly.utils.xml.createElement('mutation'); c.setAttribute('items', this.itemCount_); return c; },
    domToMutation: function (xml) { this.itemCount_ = parseInt(xml.getAttribute('items'), 10); this.updateShape_(); },
    decompose: function (ws) {
        const c = ws.newBlock('sb_additive_synth_container'); c.initSvg();
        let conn = c.nextConnection;
        for (let i = 0; i < this.itemCount_; i++) { const it = ws.newBlock('sb_additive_synth_item'); it.initSvg(); conn.connect(it.previousConnection); conn = it.nextConnection; }
        return c;
    },
    compose: function (c) { let it = c.getNextBlock(); this.itemCount_ = 0; while (it) { this.itemCount_++; it = it.getNextBlock(); } this.updateShape_(); },
    updateShape_: function () {
        const vals = []; for (let i = 1; i <= 100; i++) { if (!this.getField('WAVE' + i)) break; vals.push({ wave: this.getFieldValue('WAVE' + i), ratio: this.getFieldValue('RATIO' + i), amp: this.getFieldValue('AMP' + i) }); }
        let i = 1; while (this.getInput('COMP' + i)) { this.removeInput('COMP' + i); i++; }
        for (let i = 1; i <= this.itemCount_; i++) {
            this.appendDummyInput('COMP' + i).appendField("波形").appendField(new Blockly.FieldDropdown([["Triangle", "TRIANGLE"], ["Sine", "SINE"], ["Square", "SQUARE"], ["Saw", "SAW"]]), "WAVE" + i)
                .appendField("倍率").appendField(new Blockly.FieldTextInput("1.0"), "RATIO" + i).appendField("振幅").appendField(new Blockly.FieldTextInput("0.5"), "AMP" + i);
            if (vals[i - 1]) { this.setFieldValue(vals[i - 1].wave, 'WAVE' + i); this.setFieldValue(vals[i - 1].ratio, 'RATIO' + i); this.setFieldValue(vals[i - 1].amp, 'AMP' + i); }
        }
    }
};

window.SB_Utils.DRUM_SAMPLER_MUTATOR = {
    mutationToDom: function () { const c = Blockly.utils.xml.createElement('mutation'); c.setAttribute('type', this.getFieldValue('PATH') || 'Kick'); return c; },
    domToMutation: function (xml) { this.updateShape_(xml.getAttribute('type') || 'Kick'); },
    updateShape_: function (type) {
        if (type === 'CUSTOM') { if (!this.getInput('CUSTOM_PATH')) this.appendDummyInput('CUSTOM_PATH').appendField("路徑").appendField(new Blockly.FieldTextInput("drum/kick.wav"), "CUSTOM_PATH_VALUE"); }
        else if (this.getInput('CUSTOM_PATH')) this.removeInput('CUSTOM_PATH');
    }
};

window.SB_Utils.MELODIC_SAMPLER_MUTATOR = {
    mutationToDom: function () { const c = Blockly.utils.xml.createElement('mutation'); c.setAttribute('type', this.getFieldValue('TYPE') || 'PIANO'); return c; },
    domToMutation: function (xml) { this.updateShape_(xml.getAttribute('type') || 'PIANO'); },
    updateShape_: function (type) {
        if (type === 'CUSTOM') { if (!this.getInput('CUSTOM_PATH')) this.appendDummyInput('CUSTOM_PATH').appendField("路徑").appendField(new Blockly.FieldTextInput("piano"), "CUSTOM_PATH_VALUE"); }
        else if (this.getInput('CUSTOM_PATH')) this.removeInput('CUSTOM_PATH');
    }
};

window.SB_Utils.RHYTHM_V2_MUTATOR = {
    itemCount_: 1,
    mutationToDom: function () { const c = Blockly.utils.xml.createElement('mutation'); c.setAttribute('items', this.itemCount_); return c; },
    domToMutation: function (xml) { this.itemCount_ = parseInt(xml.getAttribute('items'), 10); this.updateShape_(); },
    decompose: function (ws) {
        const c = ws.newBlock('sb_rhythm_v2_container'); c.initSvg();
        let conn = c.nextConnection;
        for (let i = 0; i < this.itemCount_; i++) { const it = ws.newBlock('sb_rhythm_v2_item'); it.initSvg(); conn.connect(it.previousConnection); conn = it.nextConnection; }
        return c;
    },
    compose: function (c) { let it = c.getNextBlock(); this.itemCount_ = 0; while (it) { this.itemCount_++; it = it.getNextBlock(); } this.updateShape_(); },
    updateShape_: function () {
        const data = []; for (let i = 0; i < 50; i++) { if (!this.getField('INST' + i)) break; data.push({ inst: this.getFieldValue('INST' + i), vel: this.getFieldValue('VEL' + i), mode: this.getFieldValue('MODE' + i), pattern: this.getFieldValue('PATTERN' + i) }); }
        let i = 0; while (this.getInput('TRACK' + i)) { this.removeInput('TRACK' + i); i++; }
        for (let i = 0; i < this.itemCount_; i++) {
            this.appendDummyInput('TRACK' + i).appendField("樂器").appendField(window.SB_Utils.createInstrumentField(), 'INST' + i)
                .appendField("力度").appendField(new Blockly.FieldTextInput("100"), 'VEL' + i).appendField("模式").appendField(new Blockly.FieldDropdown([["單音", "FALSE"], ["和弦", "TRUE"]]), 'MODE' + i)
                .appendField("節奏").appendField(new Blockly.FieldTextInput("x--- x--- x--- x---"), 'PATTERN' + i);
            if (data[i]) { this.setFieldValue(data[i].inst, 'INST' + i); this.setFieldValue(data[i].vel, 'VEL' + i); this.setFieldValue(data[i].mode, 'MODE' + i); this.setFieldValue(data[i].pattern, 'PATTERN' + i); }
        }
    }
};

window.SB_Utils.SETUP_EFFECT_MUTATOR = {
    mutationToDom: function () {
        const container = Blockly.utils.xml.createElement('mutation');
        const type = this.getFieldValue('EFFECT_TYPE') || 'filter';
        container.setAttribute('effect_type', type);
        if (type === 'filter') {
            container.setAttribute('filter_type_value', this.getFieldValue('FILTER_TYPE_VALUE') || 'lowpass');
            container.setAttribute('filter_rolloff_value', this.getFieldValue('FILTER_ROLLOFF_VALUE') || '-12');
        }
        return container;
    },
    domToMutation: function (xml) { if (xml) this.updateShape_(xml.getAttribute('effect_type') || 'filter', xml); },
    updateShape_: function (type, xml) {
        if (this.disposed) return;
        if (this.workspace && this.workspace.isClearing) return;

        // 恢復純粹的同步連動
        const params = ['FILTER_TYPE', 'FILTER_FREQ', 'FILTER_Q', 'FILTER_ROLLOFF', 'DELAY_TIME', 'FEEDBACK', 'BITDEPTH', 'THRESHOLD', 'RATIO', 'ATTACK', 'RELEASE', 'MAKEUP', 'WET', 'DISTORTION_AMOUNT', 'DECAY', 'PREDELAY', 'RATE', 'DEPTH', 'MOD_TYPE', 'SWEEP_INPUT', 'SWEEP_DEPTH_INPUT', 'JITTER_INPUT', 'ROOMSIZE', 'DAMPING'];
        params.forEach(p => { if (this.getInput(p)) this.removeInput(p); });

        const addShadow = (name, num) => { 
            const inp = this.getInput(name); if (!inp || !inp.connection) return;
            try {
                const s = Blockly.utils.xml.textToDom('<shadow type="math_number"><field name="NUM">' + num + '</field></shadow>'); 
                inp.connection.setShadowDom(s); 
            } catch(e) {}
        };

        if (type === 'filter') {
            this.appendDummyInput('FILTER_TYPE').setAlign(Blockly.ALIGN_RIGHT).appendField("類型").appendField(new Blockly.FieldDropdown([["lowpass", "lowpass"], ["highpass", "highpass"], ["bandpass", "bandpass"]]), "FILTER_TYPE_VALUE");
            this.appendValueInput('FILTER_FREQ').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("頻率");
            this.appendValueInput('FILTER_Q').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("Q值");
            this.appendDummyInput('FILTER_ROLLOFF').setAlign(Blockly.ALIGN_RIGHT).appendField("斜率").appendField(new Blockly.FieldDropdown([["-12dB", "-12"], ["-24dB", "-24"], ["-48dB", "-48"]]), "FILTER_ROLLOFF_VALUE");
            addShadow('FILTER_FREQ', 1000); addShadow('FILTER_Q', 0.5);
            if (xml) { this.setFieldValue(xml.getAttribute('filter_type_value') || 'lowpass', 'FILTER_TYPE_VALUE'); this.setFieldValue(xml.getAttribute('filter_rolloff_value') || '-12', 'FILTER_ROLLOFF_VALUE'); }
        } else if (type === 'delay') {
            this.appendValueInput('DELAY_TIME').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("延遲時間");
            this.appendValueInput('FEEDBACK').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("回饋量");
            addShadow('DELAY_TIME', 0.5); addShadow('FEEDBACK', 0.5);
        } else if (type === 'bitcrush') {
            this.appendValueInput('BITDEPTH').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("位元深度");
            addShadow('BITDEPTH', 8);
        } else if (type === 'waveshaper') {
            this.appendValueInput('DISTORTION_AMOUNT').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("失真程度");
            addShadow('DISTORTION_AMOUNT', 2);
        } else if (type === 'reverb') {
            this.appendValueInput('ROOMSIZE').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("空間大小");
            this.appendValueInput('DAMPING').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("高頻衰減");
            this.appendValueInput('WET').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("乾濕比");
            addShadow('ROOMSIZE', 0.5); addShadow('DAMPING', 0.5); addShadow('WET', 0.3);
        } else if (type === 'compressor') {
            this.appendValueInput('THRESHOLD').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("閾值(dB)");
            this.appendValueInput('RATIO').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("壓縮比");
            this.appendValueInput('ATTACK').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("啟動(s)");
            this.appendValueInput('RELEASE').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("釋放(s)");
            this.appendValueInput('MAKEUP').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("補償(dB)");
            addShadow('THRESHOLD', -20); addShadow('RATIO', 4); addShadow('ATTACK', 0.01); addShadow('RELEASE', 0.25); addShadow('MAKEUP', 0);
        } else if (type === 'limiter') {
            this.appendValueInput('THRESHOLD').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("限制閾值");
            this.appendValueInput('ATTACK').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("啟動(s)");
            this.appendValueInput('RELEASE').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("釋放(s)");
            addShadow('THRESHOLD', -3); addShadow('ATTACK', 0.001); addShadow('RELEASE', 0.1);
        } else if (type === 'autofilter') {
            this.appendValueInput('RATE').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("掃描速率");
            this.appendValueInput('DEPTH').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("掃描範圍");
            this.appendValueInput('FILTER_Q').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("Q值");
            addShadow('RATE', 0.5); addShadow('DEPTH', 20); addShadow('FILTER_Q', 0.4);
        } else if (type === 'pitchmod') {
            this.appendDummyInput('MOD_TYPE').setAlign(Blockly.ALIGN_RIGHT).appendField("調變類型").appendField(new Blockly.FieldDropdown([["Jitter", "NOISE"], ["Vibrato", "SINE"]]), "TYPE");
            this.appendValueInput('RATE').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("速率");
            this.appendValueInput('DEPTH').setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("深度");
            addShadow('RATE', 5); addShadow('DEPTH', 10);
        }
        if (this.rendered && this.render) this.render();
    }
};

/**
 * --- Key Management ---
 */
window.SB_Utils.KEYS = {
    SYSTEM: ['up', 'down', 'left', 'right', '+', '-', 'backspace'],
    PIANO: ['q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u', 'i', '9', 'o', '0', 'p', '[', ']', '\\'],
    ALL: 'abcdefghijklmnopqrstuvwxyz1234567890[]\\\\;,./'.split('')
};

window.SB_KEYS = window.SB_Utils.KEYS;
window.getAvailableKeys = window.SB_Utils.getAvailableKeys;
window.checkKeyConflicts = window.SB_Utils.checkKeyConflicts;
window.createInstrumentField = window.SB_Utils.createInstrumentField;
