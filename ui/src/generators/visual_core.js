/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */

/**
 * Visual Core Generators: Canvas setup, Shapes, and Colors.
 */

Blockly.Processing.registerGenerator("visual_size", function (block) {
  const w = Blockly.Processing.valueToCode(block, "WIDTH", Blockly.Processing.ORDER_ATOMIC) || "800";
  const h = Blockly.Processing.valueToCode(block, "HEIGHT", Blockly.Processing.ORDER_ATOMIC) || "600";
  Blockly.Processing.provideSetup("size(int(floatVal(" + w + ")), int(floatVal(" + h + ")));", "stage_init_size");
  return "";
});

Blockly.Processing.registerGenerator("visual_background", function (block) {
  const color = Blockly.Processing.valueToCode(block, "COLOR", Blockly.Processing.ORDER_ATOMIC) || "0";
  return "background(" + color + ");\n";
});

Blockly.Processing.registerGenerator("visual_background_rgb", function (block) {
  const r = Blockly.Processing.valueToCode(block, "R", Blockly.Processing.ORDER_ATOMIC) || "0";
  const g = Blockly.Processing.valueToCode(block, "G", Blockly.Processing.ORDER_ATOMIC) || "0";
  const b = Blockly.Processing.valueToCode(block, "B", Blockly.Processing.ORDER_ATOMIC) || "0";
  return "background(floatVal(" + r + "), floatVal(" + g + "), floatVal(" + b + "));\n";
});

Blockly.Processing.registerGenerator("visual_fill", function (block) {
  const color = Blockly.Processing.valueToCode(block, "COLOR", Blockly.Processing.ORDER_ATOMIC) || "255";
  return "fill(" + color + ");\n";
});

Blockly.Processing.registerGenerator("visual_fill_rgb", function (block) {
  const r = Blockly.Processing.valueToCode(block, "R", Blockly.Processing.ORDER_ATOMIC) || "255";
  const g = Blockly.Processing.valueToCode(block, "G", Blockly.Processing.ORDER_ATOMIC) || "255";
  const b = Blockly.Processing.valueToCode(block, "B", Blockly.Processing.ORDER_ATOMIC) || "255";
  return "fill(floatVal(" + r + "), floatVal(" + g + "), floatVal(" + b + "));\n";
});

Blockly.Processing.registerGenerator("visual_no_fill", function (block) {
  return "noFill();\n";
});

Blockly.Processing.registerGenerator("visual_stroke", function (block) {
  const color = Blockly.Processing.valueToCode(block, "COLOR", Blockly.Processing.ORDER_ATOMIC) || "0";
  return "stroke(" + color + ");\n";
});

Blockly.Processing.registerGenerator("visual_stroke_rgb", function (block) {
  const r = Blockly.Processing.valueToCode(block, "R", Blockly.Processing.ORDER_ATOMIC) || "0";
  const g = Blockly.Processing.valueToCode(block, "G", Blockly.Processing.ORDER_ATOMIC) || "0";
  const b = Blockly.Processing.valueToCode(block, "B", Blockly.Processing.ORDER_ATOMIC) || "0";
  return "stroke(floatVal(" + r + "), floatVal(" + g + "), floatVal(" + b + "));\n";
});

Blockly.Processing.registerGenerator("visual_no_stroke", function (block) {
  return "noStroke();\n";
});

Blockly.Processing.registerGenerator("visual_stroke_weight", function (block) {
  const weight = Blockly.Processing.valueToCode(block, "WEIGHT", Blockly.Processing.ORDER_ATOMIC) || "1";
  return "strokeWeight(floatVal(" + weight + "));\n";
});

Blockly.Processing.registerGenerator("visual_rect", function (block) {
  const x = Blockly.Processing.valueToCode(block, "X", Blockly.Processing.ORDER_ATOMIC) || "0";
  const y = Blockly.Processing.valueToCode(block, "Y", Blockly.Processing.ORDER_ATOMIC) || "0";
  const w = Blockly.Processing.valueToCode(block, "W", Blockly.Processing.ORDER_ATOMIC) || "50";
  const h = Blockly.Processing.valueToCode(block, "H", Blockly.Processing.ORDER_ATOMIC) || "50";
  return "rect(floatVal(" + x + "), floatVal(" + y + "), floatVal(" + w + "), floatVal(" + h + "));\n";
});

Blockly.Processing.registerGenerator("visual_ellipse", function (block) {
  const x = Blockly.Processing.valueToCode(block, "X", Blockly.Processing.ORDER_ATOMIC) || "0";
  const y = Blockly.Processing.valueToCode(block, "Y", Blockly.Processing.ORDER_ATOMIC) || "0";
  const w = Blockly.Processing.valueToCode(block, "W", Blockly.Processing.ORDER_ATOMIC) || "50";
  const h = Blockly.Processing.valueToCode(block, "H", Blockly.Processing.ORDER_ATOMIC) || "50";
  return "ellipse(floatVal(" + x + "), floatVal(" + y + "), floatVal(" + w + "), floatVal(" + h + "));\n";
});

Blockly.Processing.registerGenerator("visual_line", function (block) {
  const x1 = Blockly.Processing.valueToCode(block, "X1", Blockly.Processing.ORDER_ATOMIC) || "0";
  const y1 = Blockly.Processing.valueToCode(block, "Y1", Blockly.Processing.ORDER_ATOMIC) || "0";
  const x2 = Blockly.Processing.valueToCode(block, "X2", Blockly.Processing.ORDER_ATOMIC) || "50";
  const y2 = Blockly.Processing.valueToCode(block, "Y2", Blockly.Processing.ORDER_ATOMIC) || "50";
  return "line(floatVal(" + x1 + "), floatVal(" + y1 + "), floatVal(" + x2 + "), floatVal(" + y2 + "));\n";
});

Blockly.Processing.registerGenerator("visual_constant", function (block) {
  return [block.getFieldValue("CONSTANT"), Blockly.Processing.ORDER_ATOMIC];
});

Blockly.Processing.registerGenerator('visual_color_picker', function (block) {
  var hex = block.getFieldValue('COLOR');
  return [window.SB_Utils.hexToJavaColor ? window.SB_Utils.hexToJavaColor(hex) : "color('" + hex + "')", Blockly.Processing.ORDER_ATOMIC];
});

Blockly.Processing.registerGenerator("visual_pixel_density", function (block) {
  return "pixelDensity(displayDensity());\n";
});

Blockly.Processing.registerGenerator("visual_frame_rate", function (block) {
  const fps = Blockly.Processing.valueToCode(block, "FPS", Blockly.Processing.ORDER_ATOMIC) || "60";
  return "frameRate(floatVal(" + fps + "));\n";
});

Blockly.Processing.registerGenerator('visual_stage_setup', function (block) {
  const w = block.getFieldValue("W");
  const h = block.getFieldValue("H");
  const bgColorHex = block.getFieldValue("BG_COLOR");
  const fgColorHex = block.getFieldValue("FG_COLOR");

  Blockly.Processing.provideSetup("size(" + w + ", " + h + ");", "stage_init_size");
  
  const setupCode = `
  background(${window.SB_Utils.hexToJavaColor(bgColorHex)});
  stroke(${window.SB_Utils.hexToJavaColor(fgColorHex)});
  fill(${window.SB_Utils.hexToJavaColor(fgColorHex)});
  surface.setTitle("HarmoNyx Stage");
  `;
  
  Blockly.Processing.provideSetup(setupCode, "stage_main_setup");
  return "";
});
