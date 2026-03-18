/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */

/**
 * Visual Core Blocks: Canvas setup, Stage, Shapes, and Colors.
 */

Blockly.defineBlocksWithJsonArray([
  {
    "type": "visual_size",
    "message0": "%{BKY_VISUAL_SIZE}",
    "args0": [
      { "type": "input_value", "name": "WIDTH", "check": "Number" },
      { "type": "input_value", "name": "HEIGHT", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_background",
    "message0": "%{BKY_VISUAL_BACKGROUND}",
    "args0": [
      { "type": "input_value", "name": "COLOR" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_background_rgb",
    "message0": "%{BKY_VISUAL_BACKGROUND_RGB}",
    "args0": [
      { "type": "input_value", "name": "R", "check": "Number" },
      { "type": "input_value", "name": "G", "check": "Number" },
      { "type": "input_value", "name": "B", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_fill",
    "message0": "%{BKY_VISUAL_FILL}",
    "args0": [
      { "type": "input_value", "name": "COLOR" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_fill_rgb",
    "message0": "%{BKY_VISUAL_FILL_RGB}",
    "args0": [
      { "type": "input_value", "name": "R", "check": "Number" },
      { "type": "input_value", "name": "G", "check": "Number" },
      { "type": "input_value", "name": "B", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_no_fill",
    "message0": "%{BKY_VISUAL_NO_FILL}",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_stroke",
    "message0": "%{BKY_VISUAL_STROKE}",
    "args0": [
      { "type": "input_value", "name": "COLOR" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_stroke_rgb",
    "message0": "%{BKY_VISUAL_STROKE_RGB}",
    "args0": [
      { "type": "input_value", "name": "R", "check": "Number" },
      { "type": "input_value", "name": "G", "check": "Number" },
      { "type": "input_value", "name": "B", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_no_stroke",
    "message0": "%{BKY_VISUAL_NO_STROKE}",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_stroke_weight",
    "message0": "%{BKY_VISUAL_STROKE_WEIGHT}",
    "args0": [
      { "type": "input_value", "name": "WEIGHT", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_rect",
    "message0": "%{BKY_VISUAL_RECT}",
    "args0": [
      { "type": "input_value", "name": "X", "check": "Number" },
      { "type": "input_value", "name": "Y", "check": "Number" },
      { "type": "input_value", "name": "W", "check": "Number" },
      { "type": "input_value", "name": "H", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_ellipse",
    "message0": "%{BKY_VISUAL_ELLIPSE}",
    "args0": [
      { "type": "input_value", "name": "X", "check": "Number" },
      { "type": "input_value", "name": "Y", "check": "Number" },
      { "type": "input_value", "name": "W", "check": "Number" },
      { "type": "input_value", "name": "H", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_line",
    "message0": "%{BKY_VISUAL_LINE}",
    "args0": [
      { "type": "input_value", "name": "X1", "check": "Number" },
      { "type": "input_value", "name": "Y1", "check": "Number" },
      { "type": "input_value", "name": "X2", "check": "Number" },
      { "type": "input_value", "name": "Y2", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_triangle",
    "message0": "%{BKY_VISUAL_TRIANGLE}",
    "args0": [
      { "type": "input_value", "name": "X1", "check": "Number" },
      { "type": "input_value", "name": "Y1", "check": "Number" },
      { "type": "input_value", "name": "X2", "check": "Number" },
      { "type": "input_value", "name": "Y2", "check": "Number" },
      { "type": "input_value", "name": "X3", "check": "Number" },
      { "type": "input_value", "name": "Y3", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_color_picker",
    "message0": "%1",
    "args0": [
      { "type": "field_colour", "name": "COLOR", "colour": "#ff0000" }
    ],
    "output": null,
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_constant",
    "message0": "%1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "CONSTANT",
        "options": [
          ["寬度 (width)", "width"],
          ["高度 (height)", "height"],
          ["滑鼠 X (mouseX)", "mouseX"],
          ["滑鼠 Y (mouseY)", "mouseY"]
        ]
      }
    ],
    "output": "Number",
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_pixel_density",
    "message0": "自動像素密度 (pixelDensity)",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_frame_rate",
    "message0": "影格率 (frameRate) %1",
    "args0": [
      { "type": "input_value", "name": "FPS", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_VISUAL_HUE}"
  },
  {
    "type": "visual_stage_set_color",
    "message0": "%{BKY_VISUAL_STAGE_SET_COLOR}",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "TARGET",
        "options": [
          ["%{BKY_VISUAL_STAGE_BG}", "BG"],
          ["%{BKY_VISUAL_STAGE_WAVE}", "WAVE"]
        ]
      },
      { "type": "input_value", "name": "COLOR" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_LIVE_SHOW_HUE}",
    "tooltip": "%{BKY_VISUAL_STAGE_SET_COLOR_TOOLTIP}"
  }
]);

Blockly.Blocks['visual_stage_setup'] = {
  init: function() {
    this.jsonInit({
      "message0": "初始化表演舞台",
      "args0": [],
      "message1": "視覺區寬度 %1 高度 %2",
      "args1": [
        { "type": "field_number", "name": "W", "value": 1200 },
        { "type": "field_number", "name": "H", "value": 400 }
      ],
      "message2": "配色 背景 %1 前景 %2",
      "args2": [
        { "type": "field_colour", "name": "BG_COLOR", "colour": "#000000" },
        { "type": "field_colour", "name": "FG_COLOR", "colour": "#FF0096" }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "%{BKY_LIVE_SHOW_HUE}",
      "tooltip": "快速建立包含音軌與視覺面板的表演舞台。"
    });
    this.setInputsInline(false);
  }
};
