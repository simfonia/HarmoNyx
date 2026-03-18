/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */

/**
 * Utility blocks for note-taking and PBL support.
 */

Blockly.defineBlocksWithJsonArray([
  {
    "type": "sb_comment",
    "message0": "%{BKY_TOOLS_COMMENT}",
    "args0": [
      {
        "type": "field_multilinetext",
        "name": "TEXT",
        "text": ""
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_TOOLS_HUE}",
    "tooltip": "%{BKY_TOOLS_COMMENT_TOOLTIP}"
  }
]);
