/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */

/**
 * Extended Math Blocks: Map, Constrain, etc.
 */

Blockly.defineBlocksWithJsonArray([
  {
    "type": "math_map",
    "message0": "%{BKY_MATH_MAP_MESSAGE}",
    "args0": [
      { "type": "input_value", "name": "VALUE", "check": "Number" },
      { "type": "input_value", "name": "FROM_LOW", "check": "Number" },
      { "type": "input_value", "name": "FROM_HIGH", "check": "Number" },
      { "type": "input_value", "name": "TO_LOW", "check": "Number" },
      { "type": "input_value", "name": "TO_HIGH", "check": "Number" }
    ],
    "inputsInline": true,
    "output": "Number",
    "colour": "%{BKY_MATH_HUE}",
    "tooltip": "%{BKY_MATH_MAP_TOOLTIP}"
  }
]);
