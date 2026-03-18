/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */

/**
 * @fileoverview Generators for Processing structure.
 */

Blockly.Processing.registerGenerator('processing_setup', function(block) {
  const branch = Blockly.Processing.statementToCode(block, 'DO');
  Blockly.Processing.provideSetup(branch, 'processing_setup');
  return '';
});

Blockly.Processing.registerGenerator('processing_draw', function(block) {
  const branch = Blockly.Processing.statementToCode(block, 'DO');
  Blockly.Processing.provideDraw(branch, 'processing_draw');
  return '';
});

Blockly.Processing.registerGenerator('processing_on_key_pressed', function(block) {
  const branch = Blockly.Processing.statementToCode(block, 'DO');
  const code = `void keyPressed() {\n  ${branch.trim().replace(/\n/g, '\n  ')}\n}`;
  Blockly.Processing.definitions_['processing_on_key_pressed'] = code;
  return '';
});

Blockly.Processing.registerGenerator('processing_exit', function(block) {
  return 'exit();\n';
});

Blockly.Processing.registerGenerator('processing_frame_count', function(block) {
  return ['frameCount', Blockly.Processing.ORDER_ATOMIC];
});
