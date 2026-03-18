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
      "message0": "%{BKY_SB_SETUP_EFFECT_MESSAGE}",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "EFFECT_TYPE",
          "options": [
            ["%{BKY_SB_EFFECT_FILTER_TYPE_FIELD}", "filter"],
            ["%{BKY_SB_EFFECT_REVERB_TYPE_FIELD}", "reverb"],
            ["%{BKY_SB_EFFECT_DELAY_TYPE_FIELD}", "delay"],
            ["%{BKY_SB_EFFECT_DISTORTION_AMOUNT_FIELD}", "distortion"], // Simple distortion
            ["%{BKY_SB_EFFECT_BITCRUSH_TYPE_FIELD}", "bitCrush"],
            ["%{BKY_SB_EFFECT_WAVESHAPER_TYPE_FIELD}", "waveshaper"],
            ["%{BKY_SB_EFFECT_COMPRESSOR_TYPE_FIELD}", "compressor"],
            ["%{BKY_SB_EFFECT_LIMITER_TYPE_FIELD}", "limiter"],
            ["%{BKY_SB_EFFECT_FLANGER_TYPE_FIELD}", "flanger"],
            ["%{BKY_SB_EFFECT_AUTOFILTER_TYPE_FIELD}", "autoFilter"], // MoogFilter/Auto
            ["%{BKY_SB_EFFECT_PITCHMOD_TYPE_FIELD}", "pitchMod"] // Generic Pitch Modulator
          ]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "%{BKY_EFFECTS_HUE}",
      "tooltip": "%{BKY_SB_SETUP_EFFECT_TOOLTIP}%{BKY_HELP_HINT}",
      "helpUrl": "effects",
      "mutator": "setup_effect_mutator"
    });
  }
};
Object.assign(Blockly.Blocks['sb_setup_effect'], window.SB_Utils.FIELD_HELPER);

Blockly.Blocks['sb_set_panning'] = {
  init: function () {
    this.appendDummyInput().appendField(Blockly.Msg['SB_SET_PANNING_MESSAGE']);
    this.appendValueInput("VALUE").setCheck("Number").appendField(Blockly.Msg['SB_SET_PANNING_VAL']);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true); this.setColour("%{BKY_INSTRUMENT_CONTROL_HUE}");
    this.setTooltip(Blockly.Msg['SB_SET_PANNING_TOOLTIP']);
  }
};

Blockly.Blocks['sb_set_instrument_volume'] = {
  init: function () {
    this.appendDummyInput().appendField(Blockly.Msg['AUDIO_SET_INSTRUMENT_VOLUME']);
    this.appendValueInput("VOLUME").setCheck("Number").appendField(Blockly.Msg['AUDIO_SET_INSTRUMENT_VOLUME_VAL']);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true); this.setColour("%{BKY_INSTRUMENT_CONTROL_HUE}");
    this.setTooltip(Blockly.Msg['AUDIO_SET_INSTRUMENT_VOLUME_TOOLTIP']);
  }
};

Blockly.Blocks['sb_set_effect_param'] = {
  init: function () {
    this.jsonInit({
      "message0": "%{BKY_SB_SET_EFFECT_PARAM_TITLE}",
      "args0": [
        {
          "type": "field_input",
          "name": "INST",
          "text": "%{BKY_SB_CURRENT_INSTRUMENT_OPTION}"
        },
        {
          "type": "field_dropdown",
          "name": "EFFECT_TYPE",
          "options": [
            ["%{BKY_SB_SET_PANNING_MESSAGE}", "panning"], // Special case
            ["%{BKY_SB_EFFECT_FILTER_TYPE_FIELD}", "filter"],
            ["%{BKY_SB_EFFECT_DELAY_TYPE_FIELD}", "delay"],
            ["%{BKY_SB_EFFECT_REVERB_TYPE_FIELD}", "reverb"],
            ["%{BKY_SB_EFFECT_BITCRUSH_TYPE_FIELD}", "bitCrush"],
            ["Moog Filter", "moog"]
          ]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "%{BKY_EFFECTS_HUE}",
      "tooltip": "%{BKY_SB_SET_EFFECT_PARAM_TOOLTIP}",
      "mutator": "set_effect_param_mutator"
    });
  }
};
// Add dynamic instrument field
Blockly.Blocks['sb_set_effect_param'].init = function () {
    this.appendDummyInput()
        .appendField(Blockly.Msg['SB_SET_EFFECT_PARAM_TITLE'].split('%1')[0])
        .appendField(window.SB_Utils.createInstrumentField(Blockly.Msg['SB_CURRENT_INSTRUMENT_OPTION']), "INST")
        .appendField(Blockly.Msg['SB_SET_EFFECT_PARAM_TITLE'].split('%2')[0].split('%1')[1] || "")
        .appendField(new Blockly.FieldDropdown([
            ["%{BKY_SB_SET_PANNING_MESSAGE}", "panning"],
            ["%{BKY_SB_EFFECT_FILTER_TYPE_FIELD}", "filter"],
            ["%{BKY_SB_EFFECT_DELAY_TYPE_FIELD}", "delay"],
            ["%{BKY_SB_EFFECT_REVERB_TYPE_FIELD}", "reverb"],
            ["%{BKY_SB_EFFECT_BITCRUSH_TYPE_FIELD}", "bitCrush"],
            ["Moog Filter", "moog"]
        ], function(option) { this.sourceBlock_.updateShape_(option); }), "EFFECT_TYPE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("%{BKY_EFFECTS_HUE}");
    this.setTooltip(Blockly.Msg['SB_SET_EFFECT_PARAM_TOOLTIP']);
    this.updateShape_('panning');
};
Object.assign(Blockly.Blocks['sb_set_effect_param'], window.SB_Utils.FIELD_HELPER);
Blockly.Blocks['sb_set_effect_param'].updateShape_ = function(effectType) {
    // Remove all value inputs first
    const inputs = this.inputList.filter(i => i.type === Blockly.INPUT_VALUE);
    inputs.forEach(i => this.removeInput(i.name));
    
    if (effectType === 'panning') {
        this.appendValueInput("VALUE").setCheck("Number").appendField(Blockly.Msg['SB_SET_EFFECT_PARAM_PAN_LABEL']);
    } else if (effectType === 'filter') {
        this.appendValueInput("FREQ").setCheck("Number").appendField(Blockly.Msg['SB_EFFECT_FILTER_FREQ_FIELD']);
        this.appendValueInput("Q").setCheck("Number").appendField(Blockly.Msg['SB_EFFECT_FILTER_Q_FIELD']);
    } else if (effectType === 'delay') {
        this.appendValueInput("TIME").setCheck("Number").appendField(Blockly.Msg['SB_EFFECT_DELAY_TIME_FIELD']);
        this.appendValueInput("FEEDBACK").setCheck("Number").appendField(Blockly.Msg['SB_EFFECT_FEEDBACK_FIELD']);
    } else if (effectType === 'bitCrush') {
        this.appendValueInput("BITS").setCheck("Number").appendField(Blockly.Msg['SB_EFFECT_BITDEPTH_FIELD']);
    }
    // ... others
};


Blockly.Blocks['sb_update_adsr'] = {
  init: function () {
    this.appendDummyInput()
        .appendField(Blockly.Msg['SB_UPDATE_ADSR_TITLE'].split('%1')[0])
        .appendField(window.SB_Utils.createInstrumentField(Blockly.Msg['SB_CURRENT_INSTRUMENT_OPTION']), "INST");
    this.appendValueInput("A").setCheck("Number").appendField("A");
    this.appendValueInput("D").setCheck("Number").appendField("D");
    this.appendValueInput("S").setCheck("Number").appendField("S");
    this.appendValueInput("R").setCheck("Number").appendField("R");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true); this.setColour("%{BKY_INSTRUMENT_CONTROL_HUE}");
    this.setTooltip(Blockly.Msg['SB_UPDATE_ADSR_TOOLTIP']);
  }
};

// Register Mutators
Blockly.Extensions.registerMutator('setup_effect_mutator', window.SB_Utils.SETUP_EFFECT_MUTATOR, undefined);
