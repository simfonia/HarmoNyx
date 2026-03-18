/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */

/**
 * MIDI Communication Blocks.
 */

Blockly.defineBlocksWithJsonArray([
  {
    "type": "midi_on_note",
    "message0": "%{BKY_MIDI_ON_NOTE}",
    "args0": [
      { "type": "input_dummy" },
      { "type": "input_statement", "name": "DO" },
      { "type": "field_variable", "name": "CHANNEL", "variable": "channel" },
      { "type": "field_variable", "name": "PITCH", "variable": "pitch" },
      { "type": "field_variable", "name": "VELOCITY", "variable": "velocity" },
      { "type": "input_dummy" },
      { "type": "input_dummy" }
    ],
    "colour": "%{BKY_MIDI_HUE}",
    "tooltip": "%{BKY_MIDI_ON_NOTE_TOOLTIP}"
  },
  {
    "type": "midi_off_note",
    "message0": "%{BKY_MIDI_OFF_NOTE}",
    "args0": [
      { "type": "input_dummy" },
      { "type": "input_statement", "name": "DO" },
      { "type": "field_variable", "name": "CHANNEL", "variable": "channel" },
      { "type": "field_variable", "name": "PITCH", "variable": "pitch" },
      { "type": "field_variable", "name": "VELOCITY", "variable": "velocity" },
      { "type": "input_dummy" },
      { "type": "input_dummy" }
    ],
    "colour": "%{BKY_MIDI_HUE}",
    "tooltip": "%{BKY_MIDI_OFF_NOTE_TOOLTIP}"
  },
  {
    "type": "midi_on_controller_change",
    "message0": "%{BKY_MIDI_ON_CONTROLLER_CHANGE}",
    "args0": [
      { "type": "input_dummy" },
      { "type": "input_statement", "name": "DO" },
      { "type": "field_variable", "name": "CHANNEL", "variable": "channel" },
      { "type": "field_variable", "name": "NUMBER", "variable": "number" },
      { "type": "field_variable", "name": "VALUE", "variable": "value" },
      { "type": "input_dummy" },
      { "type": "input_dummy" }
    ],
    "colour": "%{BKY_MIDI_HUE}",
    "tooltip": "%{BKY_MIDI_ON_CONTROLLER_CHANGE_TOOLTIP}"
  },
  {
    "type": "midi_init",
    "message0": "%{BKY_MIDI_INIT}",
    "args0": [
      { "type": "input_dummy" },
      { "type": "field_number", "name": "INPUT", "value": -1 },
      { "type": "field_number", "name": "OUTPUT", "value": -1 }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_MIDI_HUE}",
    "tooltip": "%{BKY_MIDI_INIT_TOOLTIP}"
  },
  {
    "type": "midi_send_note",
    "message0": "%{BKY_MIDI_SEND_NOTE}",
    "args0": [
      { "type": "field_dropdown", "name": "TYPE", "options": [["ON", "noteOn"], ["OFF", "noteOff"]] },
      { "type": "input_dummy" },
      { "type": "input_value", "name": "CHANNEL", "check": "Number" },
      { "type": "input_value", "name": "PITCH", "check": "Number" },
      { "type": "input_value", "name": "VELOCITY", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_MIDI_HUE}",
    "tooltip": "%{BKY_MIDI_SEND_NOTE_TOOLTIP}"
  },
  {
    "type": "midi_send_cc",
    "message0": "%{BKY_MIDI_SEND_CC}",
    "args0": [
      { "type": "input_dummy" },
      { "type": "input_value", "name": "CHANNEL", "check": "Number" },
      { "type": "input_value", "name": "NUMBER", "check": "Number" },
      { "type": "input_value", "name": "VALUE", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_MIDI_HUE}",
    "tooltip": "%{BKY_MIDI_SEND_CC_TOOLTIP}"
  },
  {
    "type": "midi_lp_xy_to_note",
    "message0": "%{BKY_MIDI_LP_XY_TO_NOTE}",
    "args0": [
      { "type": "input_value", "name": "X", "check": "Number" },
      { "type": "input_value", "name": "Y", "check": "Number" }
    ],
    "output": "Number",
    "colour": "%{BKY_MIDI_HUE}",
    "tooltip": "%{BKY_MIDI_LP_XY_TO_NOTE_TOOLTIP}"
  }
]);
