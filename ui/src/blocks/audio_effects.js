/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */

/**
 * Audio Effects Blocks: Filters, Reverbs, Delays and Param Control.
 */

Blockly.Blocks['sb_setup_effect'] = {
  init: function () {
    this.jsonInit({
      "type": "sb_setup_effect",
      "message0": (Blockly.Msg['SB_SETUP_EFFECT_MESSAGE'] || "配置 %1").replace('%1', '%1').trim(),
      "args0": [
        {
          "type": "field_dropdown",
          "name": "EFFECT_TYPE",
          "options": [
            [Blockly.Msg['SB_EFFECT_FILTER_TYPE_FIELD'] || "Filter", "filter"],
            [Blockly.Msg['SB_EFFECT_DELAY_TYPE_FIELD'] || "Delay", "delay"],
            [Blockly.Msg['SB_EFFECT_BITCRUSH_TYPE_FIELD'] || "BitCrush", "bitcrush"],
            [Blockly.Msg['SB_EFFECT_WAVESHAPER_TYPE_FIELD'] || "Waveshaper", "waveshaper"],
            [Blockly.Msg['SB_EFFECT_REVERB_TYPE_FIELD'] || "Reverb", "reverb"],
            [Blockly.Msg['SB_EFFECT_FLANGER_TYPE_FIELD'] || "Flanger", "flanger"],
            [Blockly.Msg['SB_EFFECT_AUTOFILTER_TYPE_FIELD'] || "Auto-Filter", "autofilter"],
            [Blockly.Msg['SB_EFFECT_PITCHMOD_TYPE_FIELD'] || "Pitch-Mod", "pitchmod"],
            [Blockly.Msg['SB_EFFECT_COMPRESSOR_TYPE_FIELD'] || "Compressor", "compressor"],
            [Blockly.Msg['SB_EFFECT_LIMITER_TYPE_FIELD'] || "Limiter", "limiter"]
          ]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Msg['EFFECTS_HUE'] || "#8E44AD",
      "tooltip": (Blockly.Msg['SB_SETUP_EFFECT_TOOLTIP'] || "") + (Blockly.Msg['BKY_HELP_HINT'] || ""),
      "helpUrl": "effects",
      "mutator": "setup_effect_mutator"
    });
    this.setInputsInline(false);
    
    // 初始化外觀
    if (this.updateShape_) {
        this.updateShape_('filter');
    }
  }
};
// 註冊輔助器以監聽切換
Object.assign(Blockly.Blocks['sb_setup_effect'], window.SB_Utils.FIELD_HELPER);

Blockly.Blocks['sb_set_instrument_volume'] = {
  init: function () {
    this.appendDummyInput().appendField(Blockly.Msg['AUDIO_SET_INSTRUMENT_VOLUME']).appendField(window.SB_Utils.createInstrumentField(Blockly.Msg['SB_SELECT_INSTRUMENT_PROMPT']), "NAME");
    this.appendValueInput("VOLUME").setCheck("Number").appendField((Blockly.Msg['AUDIO_SET_INSTRUMENT_VOLUME_VAL'] || "音量 %1").split('%')[0].trim());
    this.setPreviousStatement(true, null); this.setNextStatement(true, null);
    this.setInputsInline(true); this.setColour(Blockly.Msg['INSTRUMENT_CONTROL_HUE'] || "#D22F73");
    this.setTooltip(Blockly.Msg['AUDIO_SET_INSTRUMENT_VOLUME_TOOLTIP']);
  }
};

Blockly.Blocks['sb_set_panning'] = {
  init: function () {
    this.appendDummyInput().appendField(Blockly.Msg['SB_SET_PANNING_MESSAGE']).appendField(window.SB_Utils.createInstrumentField(Blockly.Msg['SB_SELECT_INSTRUMENT_PROMPT']), "NAME");
    this.appendValueInput("VALUE").setCheck("Number").appendField(Blockly.Msg['SB_SET_PANNING_VAL'] || "相位");
    this.setPreviousStatement(true, null); this.setNextStatement(true, null);
    this.setInputsInline(true); this.setColour(Blockly.Msg['INSTRUMENT_CONTROL_HUE'] || "#D22F73");
    this.setTooltip(Blockly.Msg['SB_SET_PANNING_TOOLTIP']);
  }
};

Blockly.Blocks['sb_set_effect_param'] = {
  init: function () {
    var instance = this;
    var getEffectOptions = function () {
      var panningLabel = Blockly.Msg['SB_SET_PANNING_MESSAGE'] || "Panning";
      var options = [["ADSR", "adsr"], [panningLabel, "panning"]];
      var target = instance.getFieldValue('TARGET');
      if (!target || target === Blockly.Msg['SB_SELECT_INSTRUMENT_PROMPT']) return options;
      var workspace = instance.workspace;
      if (!workspace) return options;
      var blocks = workspace.getAllBlocks(false);
      var container = blocks.find(b => b.type === 'sb_instrument_container' && b.getFieldValue('NAME') === target);
      if (container) {
        var child = container.getInputTargetBlock('STACK');
        while (child) {
          if (child.type === 'sb_setup_effect') {
            var type = child.getFieldValue('EFFECT_TYPE');
            var label = child.getField('EFFECT_TYPE').getText();
            if (!options.find(o => o[1] === type)) options.push([label, type]);
          }
          child = child.getNextBlock();
        }
      }
      return options;
    };

    this.appendDummyInput().appendField((Blockly.Msg['SB_SET_EFFECT_PARAM_TITLE'] || "更新 %1 的 %2").split('%1')[0])
      .appendField(window.SB_Utils.createInstrumentField(Blockly.Msg['SB_SELECT_INSTRUMENT_PROMPT']), "TARGET")
      .appendField((Blockly.Msg['SB_SET_EFFECT_PARAM_TITLE'] || "更新 %1 的 %2").split('%2')[0].split('%1')[1] || "類型")
      .appendField(new Blockly.FieldDropdown(getEffectOptions, function (val) { 
          if (!instance.disposed && instance.updateShape_) {
              instance.updateShape_(val);
          }
          return val; 
      }), "EFFECT_TYPE");

    this.setPreviousStatement(true, null); this.setNextStatement(true, null);
    this.setColour(Blockly.Msg['EFFECTS_HUE'] || "#8E44AD");
    this.setTooltip(Blockly.Msg['SB_SET_EFFECT_PARAM_TOOLTIP']);
    this.updateShape_('adsr');
  },
  mutationToDom: function () {
    var container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('effect_type', this.getFieldValue('EFFECT_TYPE') || 'adsr');
    return container;
  },
  domToMutation: function (xmlElement) {
    this.updateShape_(xmlElement.getAttribute('effect_type') || 'adsr', true);
  },
  updateShape_: function (type, isLoading) {
    if (this.disposed) return;
    if (this.workspace && this.workspace.isClearing) return;

    const group = Blockly.Events.getGroup();
    if (!group) Blockly.Events.setGroup(true);

    try {
        if (this.getInput('PARAMS')) this.removeInput('PARAMS');
        if (this.getInput('VALUE')) this.removeInput('VALUE');

        var input = this.appendDummyInput('PARAMS');
        if (type === 'filter') {
          input.appendField((Blockly.Msg['SB_SET_EFFECT_PARAM_PARAM'] || "參數 %1").split('%1')[0])
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg['SB_EFFECT_FILTER_FREQ_FIELD'] || "頻率", "frequency"], [Blockly.Msg['SB_EFFECT_FILTER_Q_FIELD'] || "共振 (Q)", "resonance"]]), "PARAM_NAME");
        } else if (type === 'adsr') {
          input.appendField((Blockly.Msg['SB_SET_EFFECT_PARAM_PARAM'] || "參數 %1").split('%1')[0])
            .appendField(new Blockly.FieldDropdown([["Attack (A)", "adsrA"], ["Decay (D)", "adsrD"], ["Sustain (S)", "adsrS"], ["Release (R)", "adsrR"]]), "PARAM_NAME");
        } else if (type === 'reverb') {
          input.appendField((Blockly.Msg['SB_SET_EFFECT_PARAM_PARAM'] || "參數 %1").split('%1')[0])
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg['SB_EFFECT_ROOMSIZE_FIELD'] || "空間大小", "roomSize"], [Blockly.Msg['SB_EFFECT_DAMPING_FIELD'] || "高頻吸收", "damping"], [Blockly.Msg['SB_EFFECT_WET_FIELD'] || "濕度 (Wet)", "wet"]]), "PARAM_NAME");
        } else if (type === 'delay') {
          input.appendField((Blockly.Msg['SB_SET_EFFECT_PARAM_PARAM'] || "參數 %1").split('%1')[0])
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg['SB_EFFECT_DELAY_TIME_FIELD'] || "延遲時間", "delTime"], [Blockly.Msg['SB_EFFECT_FEEDBACK_FIELD'] || "回饋 (Feedback)", "delAmp"]]), "PARAM_NAME");
        } else if (type === 'bitcrush') {
          input.appendField((Blockly.Msg['SB_SET_EFFECT_PARAM_PARAM'] || "參數 %1").split('%1')[0])
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg['SB_EFFECT_BITDEPTH_FIELD'] || "位元深度", "bitRes"]]), "PARAM_NAME");
        } else if (type === 'waveshaper') {
          input.appendField((Blockly.Msg['SB_SET_EFFECT_PARAM_PARAM'] || "參數 %1").split('%1')[0])
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg['SB_EFFECT_DISTORTION_AMOUNT_FIELD'] || "失真量", "amount"]]), "PARAM_NAME");
        } else if (type === 'compressor') {
          input.appendField((Blockly.Msg['SB_SET_EFFECT_PARAM_PARAM'] || "參數 %1").split('%1')[0])
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg['SB_EFFECT_THRESHOLD_FIELD'] || "門檻", "threshold"], [Blockly.Msg['SB_EFFECT_RATIO_FIELD'] || "比率", "ratio"], [Blockly.Msg['SB_EFFECT_ATTACK_FIELD'] || "啟動時間", "attack"], [Blockly.Msg['SB_EFFECT_RELEASE_FIELD'] || "釋放時間", "release"], [Blockly.Msg['SB_EFFECT_MAKEUP_FIELD'] || "增益補償", "makeup"]]), "PARAM_NAME");
        } else if (type === 'limiter') {
          input.appendField((Blockly.Msg['SB_SET_EFFECT_PARAM_PARAM'] || "參數 %1").split('%1')[0])
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg['SB_EFFECT_THRESHOLD_FIELD'] || "限制門檻", "threshold"], [Blockly.Msg['SB_EFFECT_ATTACK_FIELD'] || "啟動時間", "attack"], [Blockly.Msg['SB_EFFECT_RELEASE_FIELD'] || "釋放時間", "release"]]), "PARAM_NAME");
        } else if (type === 'flanger') {
          input.appendField((Blockly.Msg['SB_SET_EFFECT_PARAM_PARAM'] || "參數 %1").split('%1')[0])
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg['SB_EFFECT_DELAY_TIME_FIELD'] || "延遲", "delay"], [Blockly.Msg['SB_EFFECT_RATE_FIELD'] || "速率", "rate"], [Blockly.Msg['SB_EFFECT_DEPTH_FIELD'] || "深度", "depth"], [Blockly.Msg['SB_EFFECT_FEEDBACK_FIELD'] || "回饋", "feedback"]]), "PARAM_NAME");
        } else if (type === 'autofilter') {
          input.appendField((Blockly.Msg['SB_SET_EFFECT_PARAM_PARAM'] || "參數 %1").split('%1')[0])
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg['SB_EFFECT_RATE_FIELD'] || "速率", "rate"], [Blockly.Msg['SB_EFFECT_DEPTH_FIELD'] || "深度", "depth"], [Blockly.Msg['SB_EFFECT_FILTER_Q_FIELD'] || "共振 (Q)", "resonance"]]), "PARAM_NAME");
        } else if (type === 'pitchmod') {
          input.appendField((Blockly.Msg['SB_SET_EFFECT_PARAM_PARAM'] || "參數 %1").split('%1')[0])
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg['SB_EFFECT_RATE_FIELD'] || "速率", "rate"], [Blockly.Msg['SB_EFFECT_DEPTH_FIELD'] || "深度", "depth"]]), "PARAM_NAME");
        } else if (type === 'panning') {
          input.appendField(Blockly.Msg['SB_SET_EFFECT_PARAM_PAN_LABEL'] || "相位 (Panning)");
        }
        
        const valueInput = this.appendValueInput("VALUE").setCheck("Number").appendField(Blockly.Msg['SB_SET_EFFECT_PARAM_VALUE'] || "數值");
        
        if (!isLoading) {
            try {
                const s = Blockly.utils.xml.textToDom('<shadow type="math_number"><field name="NUM">0</field></shadow>'); 
                valueInput.connection.setShadowDom(s); 
            } catch(e) {}
        }
        if (this.rendered && this.render) this.render();
    } finally {
        if (!group) Blockly.Events.setGroup(false);
    }
  }
};

Blockly.Blocks['sb_update_adsr'] = {
  init: function () {
    this.appendDummyInput()
      .appendField((Blockly.Msg['SB_UPDATE_ADSR_TITLE'] || "更新 %1 的 ADSR").split('%1')[0])
      .appendField(window.SB_Utils.createInstrumentField(Blockly.Msg['SB_SELECT_INSTRUMENT_PROMPT']), "TARGET");
    this.appendValueInput("A").setCheck("Number").appendField(" A");
    this.appendValueInput("D").setCheck("Number").appendField(" D");
    this.appendValueInput("S").setCheck("Number").appendField(" S");
    this.appendValueInput("R").setCheck("Number").appendField(" R");
    this.setPreviousStatement(true, null); 
    this.setNextStatement(true, null);
    this.setInputsInline(true);
    this.setColour(Blockly.Msg['INSTRUMENT_CONTROL_HUE'] || "#D22F73");
    this.setTooltip(Blockly.Msg['SB_UPDATE_ADSR_TOOLTIP']);
  }
};

// Register Extensions
Blockly.Extensions.registerMutator('setup_effect_mutator', window.SB_Utils.SETUP_EFFECT_MUTATOR, undefined);
