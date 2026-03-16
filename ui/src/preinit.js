/**
 * HarmoNyx Pre-initialization Script
 */

window.SB_Utils = window.SB_Utils || {};

// --- 1. Field Helpers ---
window.SB_Utils.FIELD_HELPER = {
    onchange: function (e) {
        if (!this.workspace || this.isInFlyout) return;
        if (e.type === 10 && e.blockId === this.id && 
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

// --- 2. Mutators ---

window.SB_Utils.HARMONIC_PARTIALS_MUTATOR = {
    itemCount_: 3,
    mutationToDom: function () {
        const container = document.createElement('mutation');
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
        while (this.getInput('PARTIAL' + i)) { this.removeInput('PARTIAL' + i); i++; }
        for (let j = 1; j <= this.itemCount_; j++) {
            this.appendValueInput('PARTIAL' + j).setCheck('Number').appendField("泛音 " + j);
        }
    }
};

window.SB_Utils.ADDITIVE_SYNTH_MUTATOR = {
    itemCount_: 2,
    mutationToDom: function () {
        const container = document.createElement('mutation');
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
                .appendField("倍率").appendField(new Blockly.FieldTextInput("1.0"), "RATIO" + j)
                .appendField("振幅").appendField(new Blockly.FieldTextInput("0.5"), "AMP" + j);
        }
    }
};

window.SB_Utils.DRUM_SAMPLER_MUTATOR = {
    mutationToDom: function () {
        const container = document.createElement('mutation');
        container.setAttribute('type', this.getFieldValue('PATH') || 'Kick');
        return container;
    },
    domToMutation: function (xmlElement) { this.updateShape_(xmlElement.getAttribute('type') || 'Kick'); },
    updateShape_: function (type) {
        const inputExists = this.getInput('CUSTOM_PATH');
        if (type === 'CUSTOM') {
            if (!inputExists) this.appendDummyInput('CUSTOM_PATH').appendField("路徑").appendField(new Blockly.FieldTextInput("drum/kick.wav"), "CUSTOM_PATH_VALUE");
        } else { if (inputExists) this.removeInput('CUSTOM_PATH'); }
    }
};

window.SB_Utils.MELODIC_SAMPLER_MUTATOR = {
    mutationToDom: function () {
        const container = document.createElement('mutation');
        container.setAttribute('type', this.getFieldValue('TYPE') || 'PIANO');
        return container;
    },
    domToMutation: function (xmlElement) { this.updateShape_(xmlElement.getAttribute('type') || 'PIANO'); },
    updateShape_: function (type) {
        const inputExists = this.getInput('CUSTOM_PATH');
        if (type === 'CUSTOM') {
            if (!inputExists) this.appendDummyInput('CUSTOM_PATH').appendField("路徑").appendField(new Blockly.FieldTextInput("piano"), "CUSTOM_PATH_VALUE");
        } else { if (inputExists) this.removeInput('CUSTOM_PATH'); }
    }
};

window.SB_Utils.RHYTHM_V2_MUTATOR = {
    itemCount_: 1,
    mutationToDom: function () {
        const container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },
    domToMutation: function (xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },
    decompose: function (workspace) {
        const containerBlock = workspace.newBlock('sb_rhythm_v2_container');
        containerBlock.initSvg();
        let connection = containerBlock.nextConnection;
        for (let i = 0; i < this.itemCount_; i++) {
            const itemBlock = workspace.newBlock('sb_rhythm_v2_item');
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
        let i = 0;
        while (this.getInput('TRACK' + i)) { this.removeInput('TRACK' + i); i++; }
        for (let j = 0; j < this.itemCount_; j++) {
            this.appendDummyInput('TRACK' + j)
                .appendField("樂器")
                .appendField(window.SB_Utils.createInstrumentField(''), 'INST' + j)
                .appendField("力度").appendField(new Blockly.FieldTextInput("100"), 'VEL' + j)
                .appendField("模式").appendField(new Blockly.FieldDropdown([["單音", "FALSE"], ["和弦", "TRUE"]]), 'MODE' + j)
                .appendField("節奏").appendField(new Blockly.FieldTextInput("x--- x--- x--- x---"), 'PATTERN' + j);
        }
    }
};

window.SB_Utils.SETUP_EFFECT_MUTATOR = {
    mutationToDom: function () {
        const container = document.createElement('mutation');
        const type = this.getFieldValue('EFFECT_TYPE') || 'filter';
        container.setAttribute('effect_type', type);
        if (type === 'filter') {
            container.setAttribute('filter_type_value', this.getFieldValue('FILTER_TYPE_VALUE') || 'lowpass');
            container.setAttribute('filter_rolloff_value', this.getFieldValue('FILTER_ROLLOFF_VALUE') || '-12');
        }
        return container;
    },
    domToMutation: function (xmlElement) {
        this.updateShape_(xmlElement.getAttribute('effect_type') || 'filter', xmlElement);
    },
    updateShape_: function (type, xmlElement) {
        const params = [
            'FILTER_TYPE', 'FILTER_FREQ', 'FILTER_Q', 'FILTER_ROLLOFF',
            'DELAY_TIME', 'FEEDBACK', 'BITDEPTH', 'THRESHOLD', 'RATIO', 
            'ATTACK', 'RELEASE', 'MAKEUP', 'WET', 'DISTORTION_AMOUNT', 
            'DECAY', 'PREDELAY', 'RATE', 'DEPTH', 'MOD_TYPE', 
            'SWEEP_INPUT', 'SWEEP_DEPTH_INPUT', 'JITTER_INPUT',
            'ROOMSIZE', 'DAMPING'
        ];
        params.forEach(p => { if (this.getInput(p)) this.removeInput(p); });

        if (type === 'filter') {
            this.appendDummyInput('FILTER_TYPE').appendField("類型").appendField(new Blockly.FieldDropdown([["lowpass", "lowpass"], ["highpass", "highpass"], ["bandpass", "bandpass"]]), "FILTER_TYPE_VALUE");
            this.appendValueInput('FILTER_FREQ').setCheck("Number").appendField("頻率");
            this.appendValueInput('FILTER_Q').setCheck("Number").appendField("Q值");
            this.appendDummyInput('FILTER_ROLLOFF').appendField("衰減").appendField(new Blockly.FieldDropdown([["-12dB", "-12"], ["-24dB", "-24"], ["-48dB", "-48"]]), "FILTER_ROLLOFF_VALUE");
        } else if (type === 'delay') {
            this.appendValueInput('DELAY_TIME').setCheck("Number").appendField("延遲時間");
            this.appendValueInput('FEEDBACK').setCheck("Number").appendField("回授");
        } else if (type === 'bitcrush') {
            this.appendValueInput('BITDEPTH').setCheck("Number").appendField("位元深度");
        } else if (type === 'reverb') {
            this.appendValueInput('ROOMSIZE').setCheck("Number").appendField("空間大小");
            this.appendValueInput('DAMPING').setCheck("Number").appendField("阻尼");
            this.appendValueInput('WET').setCheck("Number").appendField("乾濕比");
        }
    }
};

console.log("HarmoNyx Pre-init finished.");
