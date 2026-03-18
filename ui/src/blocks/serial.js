/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */

/**
 * Serial Communication Blocks.
 */

Blockly.defineBlocksWithJsonArray([
  {
    "type": "sb_serial_data_received",
    "message0": "%{BKY_SERIAL_DATA_RECEIVED_TITLE} %1 %2",
    "args0": [
      { "type": "input_dummy" },
      { "type": "input_statement", "name": "DO" }
    ],
    "colour": "%{BKY_SERIAL_HUE}",
    "tooltip": ""
  },
  {
    "type": "serial_init",
    "message0": "%{BKY_SERIAL_INIT}",
    "args0": [
      { "type": "field_number", "name": "INDEX", "value": 0 },
      { "type": "field_dropdown", "name": "BAUD", "options": [["9600", "9600"], ["115200", "115200"]] }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_SERIAL_HUE}",
    "tooltip": ""
  },
  {
    "type": "serial_available",
    "message0": "%{BKY_SERIAL_AVAILABLE}",
    "output": "Boolean",
    "colour": "%{BKY_SERIAL_HUE}",
    "tooltip": ""
  },
  {
    "type": "serial_read_string",
    "message0": "%{BKY_SERIAL_READ_STRING}",
    "output": "String",
    "colour": "%{BKY_SERIAL_HUE}",
    "tooltip": ""
  },
  {
    "type": "sb_serial_write",
    "message0": "%{BKY_SERIAL_WRITE}",
    "args0": [
      { "type": "input_value", "name": "CONTENT" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_SERIAL_HUE}",
    "tooltip": ""
  },
  {
    "type": "serial_check_mask",
    "message0": "%{BKY_SERIAL_CHECK_MASK}",
    "args0": [
      { "type": "input_value", "name": "MASK", "check": "Number" },
      { "type": "field_number", "name": "KEY", "value": 1 }
    ],
    "output": "Boolean",
    "colour": "%{BKY_SERIAL_HUE}",
    "tooltip": ""
  },
  {
    "type": "sb_serial_check_key_mask",
    "message0": "%{BKY_SB_SERIAL_CHECK_KEY_MASK_MESSAGE}",
    "args0": [
      { "type": "input_value", "name": "DATA", "check": "Number" },
      { "type": "field_number", "name": "KEY_BIT", "value": 1, "min": 0, "max": 31 }
    ],
    "output": "Boolean",
    "colour": "%{BKY_SERIAL_HUE}",
    "tooltip": "%{BKY_SB_SERIAL_CHECK_KEY_MASK_TOOLTIP}"
  }
]);
