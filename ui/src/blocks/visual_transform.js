/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */

/**
 * Visual Transform Blocks: Translate, Rotate, Scale, Push/Pop.
 */

Blockly.defineBlocksWithJsonArray([
  {
    "type": "visual_translate",
    "message0": "%{BKY_VISUAL_TRANSLATE}",
    "args0": [
      { "type": "input_value", "name": "X", "check": "Number" },
      { "type": "input_value", "name": "Y", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}",
    "tooltip": "%{BKY_VISUAL_TRANSLATE_TOOLTIP}"
  },
  {
    "type": "visual_rotate",
    "message0": "%{BKY_VISUAL_ROTATE}",
    "args0": [
      { "type": "input_value", "name": "ANGLE", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}",
    "tooltip": "%{BKY_VISUAL_ROTATE_TOOLTIP}"
  },
  {
    "type": "visual_scale",
    "message0": "%{BKY_VISUAL_SCALE}",
    "args0": [
      { "type": "input_value", "name": "S", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}",
    "tooltip": "%{BKY_VISUAL_SCALE_TOOLTIP}"
  },
  {
    "type": "visual_push_pop",
    "message0": "%{BKY_VISUAL_PUSH_POP}",
    "args0": [
      { "type": "input_statement", "name": "DO" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}",
    "tooltip": "%{BKY_VISUAL_PUSH_POP_TOOLTIP}"
  }
]);
