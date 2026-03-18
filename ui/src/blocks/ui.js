/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */

/**
 * UI Control Blocks: ControlP5 wrapper.
 */

Blockly.Blocks['ui_key_event'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg['UI_KEY_EVENT'].replace('%1', '').replace('%2', ''))
        .appendField(new Blockly.FieldDropdown(() => window.SB_Utils.getAvailableKeys(this)), "KEY")
        .appendField(new Blockly.FieldDropdown([
          [Blockly.Msg['UI_KEY_PRESSED'], "PRESSED"],
          [Blockly.Msg['UI_KEY_RELEASED'], "RELEASED"]
        ]), "TYPE");
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setColour(Blockly.Msg['PC_KEY_HUE'] || '#2c3e50');
    this.setTooltip(Blockly.Msg['UI_KEY_EVENT_TOOLTIP']);
    this.setHelpUrl('');
  }
};

Blockly.defineBlocksWithJsonArray([
  {
    "type": "ui_init",
    "message0": "%{BKY_UI_INIT}",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_UI_HUE}",
    "tooltip": "%{BKY_UI_INIT_TOOLTIP}"
  },
  {
    "type": "ui_add_slider",
    "message0": "%{BKY_UI_ADD_SLIDER}",
    "args0": [
      { "type": "field_input", "name": "NAME", "text": "slider1" },
      { "type": "input_value", "name": "X", "check": "Number" },
      { "type": "input_value", "name": "Y", "check": "Number" },
      { "type": "input_value", "name": "W", "check": "Number" },
      { "type": "input_value", "name": "H", "check": "Number" },
      { "type": "input_dummy" },
      { "type": "input_value", "name": "MIN", "check": "Number" },
      { "type": "input_value", "name": "MAX", "check": "Number" },
      { "type": "input_value", "name": "DEFAULT", "check": "Number" },
      { "type": "input_value", "name": "LABEL", "check": "String" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_UI_HUE}",
    "tooltip": ""
  },
  {
    "type": "ui_add_toggle",
    "message0": "%{BKY_UI_ADD_TOGGLE}",
    "args0": [
      { "type": "field_input", "name": "NAME", "text": "toggle1" },
      { "type": "input_value", "name": "X", "check": "Number" },
      { "type": "input_value", "name": "Y", "check": "Number" },
      { "type": "field_checkbox", "name": "DEFAULT", "checked": false },
      { "type": "input_value", "name": "LABEL", "check": "String" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_UI_HUE}",
    "tooltip": ""
  },
  {
    "type": "ui_set_font_size",
    "message0": "%{BKY_UI_SET_FONT_SIZE}",
    "args0": [
      { "type": "input_value", "name": "SIZE", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_UI_HUE}",
    "tooltip": ""
  }
]);
