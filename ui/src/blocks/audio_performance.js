/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */

/**
 * Audio Performance Blocks: Play Note, Melody, Rhythm.
 */

Blockly.defineBlocksWithJsonArray([
  {
    "type": "sb_transport_set_bpm",
    "message0": "%{BKY_AUDIO_SET_BPM}",
    "args0": [
      { "type": "input_value", "name": "BPM", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_PERFORMANCE_HUE}",
    "tooltip": "%{BKY_AUDIO_SET_BPM_TOOLTIP}"
  },
  {
    "type": "sb_transport_count_in",
    "message0": "%{BKY_AUDIO_COUNT_IN}",
    "args0": [
      { "type": "input_value", "name": "MEASURES", "check": "Number" },
      { "type": "input_value", "name": "BEATS", "check": "Number" },
      { "type": "input_value", "name": "BEAT_UNIT", "check": "Number" },
      { "type": "input_value", "name": "VELOCITY", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_PERFORMANCE_HUE}",
    "tooltip": "%{BKY_AUDIO_COUNT_IN_TOOLTIP}"
  },
  {
    "type": "sb_select_current_instrument",
    "message0": "%{BKY_AUDIO_SELECT_INSTRUMENT}",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "NAME",
        "options": function () {
          return window.SB_Utils.getInstrumentOptions();
        }
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_PERFORMANCE_HUE}",
    "tooltip": "%{BKY_AUDIO_SELECT_INSTRUMENT_TOOLTIP}"
  },
  {
    "type": "sb_define_chord",
    "message0": "%{BKY_AUDIO_DEFINE_CHORD}",
    "args0": [
      { "type": "field_input", "name": "NAME", "text": "Cmaj7" },
      { "type": "input_value", "name": "NOTES", "check": "Array" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_PERFORMANCE_HUE}",
    "tooltip": "%{BKY_AUDIO_DEFINE_CHORD_TOOLTIP}"
  },
  {
    "type": "sb_play_note",
    "message0": "%{BKY_AUDIO_PLAY_NOTE}",
    "args0": [
      {
        "type": "field_input",
        "name": "INST",
        "text": "%{BKY_SB_CURRENT_INSTRUMENT_OPTION}"
      },
      { "type": "input_value", "name": "PITCH", "check": ["Number", "String"] },
      { "type": "input_value", "name": "VELOCITY", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_PERFORMANCE_HUE}",
    "tooltip": "%{BKY_AUDIO_PLAY_NOTE_TOOLTIP}"
  },
  {
    "type": "sb_stop_note",
    "message0": "%{BKY_AUDIO_STOP_NOTE}",
    "args0": [
      {
        "type": "field_input",
        "name": "INST",
        "text": "%{BKY_SB_CURRENT_INSTRUMENT_OPTION}"
      },
      { "type": "input_value", "name": "PITCH", "check": ["Number", "String"] }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_PERFORMANCE_HUE}",
    "tooltip": "%{BKY_AUDIO_STOP_NOTE_TOOLTIP}"
  },
  {
    "type": "sb_play_chord_by_name",
    "message0": "%{BKY_AUDIO_PLAY_CHORD_BY_NAME}",
    "args0": [
      {
        "type": "field_input",
        "name": "INST",
        "text": "%{BKY_SB_CURRENT_INSTRUMENT_OPTION}"
      },
      { "type": "field_input", "name": "CHORD_NAME", "text": "Cmaj7" },
      { "type": "input_value", "name": "DUR", "check": ["Number", "String"] },
      { "type": "input_value", "name": "VELOCITY", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_PERFORMANCE_HUE}",
    "tooltip": ""
  },
  {
    "type": "sb_trigger_sample",
    "message0": "%{BKY_AUDIO_TRIGGER_SAMPLE}",
    "args0": [
      {
        "type": "field_input",
        "name": "INST",
        "text": "%{BKY_SB_CURRENT_INSTRUMENT_OPTION}"
      },
      {
        "type": "field_input",
        "name": "NOTE",
        "text": "C4"
      },
      { "type": "input_value", "name": "VELOCITY", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_PERFORMANCE_HUE}",
    "tooltip": "%{BKY_AUDIO_TRIGGER_SAMPLE_TOOLTIP}"
  },
  {
    "type": "sb_play_drum",
    "message0": "%{BKY_SB_PLAY_DRUM_MESSAGE}",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DRUM",
        "options": [
          ["Kick", "Kick"], ["Snare", "Snare"], ["HiHat", "HiHat"], ["Clap", "Clap"]
        ]
      },
      { "type": "input_value", "name": "VELOCITY", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_PERFORMANCE_HUE}",
    "tooltip": "%{BKY_SB_PLAY_DRUM_TOOLTIP}"
  },
  {
    "type": "sb_audio_is_playing",
    "message0": "%{BKY_AUDIO_IS_PLAYING}",
    "output": "Boolean",
    "colour": "%{BKY_PERFORMANCE_HUE}",
    "tooltip": "%{BKY_AUDIO_IS_PLAYING_TOOLTIP}"
  },
  {
    "type": "sb_wait_until_finished",
    "message0": "%{BKY_AUDIO_WAIT_UNTIL_FINISHED}",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_PERFORMANCE_HUE}",
    "tooltip": "%{BKY_AUDIO_WAIT_UNTIL_FINISHED_TOOLTIP}"
  },
  {
    "type": "sb_wait_musical",
    "message0": "%{BKY_SB_WAIT_MUSICAL}",
    "args0": [
      { "type": "input_value", "name": "VALUE", "check": "Number" },
      {
        "type": "field_dropdown",
        "name": "UNIT",
        "options": [
          ["%{BKY_SB_WAIT_UNIT_MS}", "MS"],
          ["%{BKY_SB_WAIT_UNIT_S}", "S"],
          ["%{BKY_SB_WAIT_UNIT_BEATS}", "BEATS"],
          ["%{BKY_SB_WAIT_UNIT_MEASURES}", "MEASURES"],
          ["%{BKY_SB_WAIT_UNIT_MICROS}", "MICROS"]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_PERFORMANCE_HUE}",
    "tooltip": "%{BKY_SB_WAIT_MUSICAL_TOOLTIP}"
  },
  {
    "type": "sb_rhythm_sequencer_v2",
    "message0": "%{BKY_AUDIO_RHYTHM_V2_HEADER}",
    "args0": [
      { "type": "field_number", "name": "MEASURE", "value": 1, "min": 1 },
      { "type": "field_number", "name": "BEATS", "value": 4, "min": 1 },
      { "type": "field_number", "name": "BEAT_UNIT", "value": 4, "min": 1 },
      { "type": "field_number", "name": "STEPS", "value": 4, "min": 1 }
    ],
    "message1": "%{BKY_SB_RHYTHM_V2_CONTAINER} %1",
    "args1": [
      { "type": "input_statement", "name": "STACK" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_PERFORMANCE_HUE}",
    "tooltip": ""
  },
  {
    "type": "sb_rhythm_sequencer_v2_track",
    "message0": "%{BKY_AUDIO_RHYTHM_V2_TRACK}",
    "args0": [
      { "type": "field_input", "name": "INST", "text": "default" },
      { "type": "field_number", "name": "VELOCITY", "value": 100, "min": 0, "max": 127 },
      { "type": "field_dropdown", "name": "MODE", "options": [["%{BKY_AUDIO_RHYTHM_MODE_MONO}", "MONO"], ["%{BKY_AUDIO_RHYTHM_MODE_CHORD}", "CHORD"]] },
      { "type": "field_multilinetext", "name": "PATTERN", "text": "x . . . | . . . . | . . . . | . . . ." }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_PERFORMANCE_HUE}",
    "tooltip": ""
  }
]);

// Dynamic Field Update for Play Note
Blockly.Blocks['sb_play_note'].init = function () {
  this.appendDummyInput()
    .appendField(Blockly.Msg['AUDIO_PLAY_NOTE']);
  this.appendDummyInput()
    .appendField(Blockly.Msg['AUDIO_PLAY_NOTE_INST'])
    .appendField(window.SB_Utils.createInstrumentField(Blockly.Msg['SB_CURRENT_INSTRUMENT_OPTION']), "INST");
  this.appendValueInput("PITCH")
    .setCheck(["Number", "String"])
    .appendField(Blockly.Msg['AUDIO_PLAY_NOTE_PITCH']);
  this.appendValueInput("VELOCITY")
    .setCheck("Number")
    .appendField(Blockly.Msg['AUDIO_PLAY_NOTE_VEL']);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setInputsInline(true); this.setColour("%{BKY_PERFORMANCE_HUE}");
  this.setTooltip(Blockly.Msg['AUDIO_PLAY_NOTE_TOOLTIP']);
};

Blockly.Blocks['sb_stop_note'].init = function () {
  this.appendDummyInput()
    .appendField(Blockly.Msg['AUDIO_STOP_NOTE']);
  this.appendDummyInput()
    .appendField(Blockly.Msg['AUDIO_STOP_NOTE_INST'])
    .appendField(window.SB_Utils.createInstrumentField(Blockly.Msg['SB_CURRENT_INSTRUMENT_OPTION']), "INST");
  this.appendValueInput("PITCH")
    .setCheck(["Number", "String"])
    .appendField(Blockly.Msg['AUDIO_STOP_NOTE_PITCH']);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setInputsInline(true); this.setColour("%{BKY_PERFORMANCE_HUE}");
  this.setTooltip(Blockly.Msg['AUDIO_STOP_NOTE_TOOLTIP']);
};

Blockly.Blocks['sb_play_melody'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg['AUDIO_PLAY_MELODY']);
    this.appendDummyInput()
      .appendField(Blockly.Msg['AUDIO_PLAY_MELODY_INST'])
      .appendField(window.SB_Utils.createInstrumentField(Blockly.Msg['SB_CURRENT_INSTRUMENT_OPTION']), "INST");
    this.appendValueInput("SCORE")
      .setCheck("Array")
      .appendField(Blockly.Msg['AUDIO_PLAY_MELODY_SCORE']);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("%{BKY_PERFORMANCE_HUE}");
    this.setTooltip(Blockly.Msg['AUDIO_PLAY_MELODY_TOOLTIP']);
  }
};

Blockly.Blocks['sb_tone_loop'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg['AUDIO_TONE_LOOP'].split('%1')[0])
      .appendField(new Blockly.FieldTextInput("4n"), "INTERVAL")
      .appendField(Blockly.Msg['AUDIO_TONE_LOOP'].split('%2')[0].split('%1')[1] || "");
    this.appendStatementInput("DO")
      .appendField(Blockly.Msg['AUDIO_TONE_LOOP'].split('%2')[1] || "");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true); this.setColour("%{BKY_PERFORMANCE_HUE}");
    this.setTooltip(Blockly.Msg['AUDIO_TONE_LOOP_TOOLTIP']);
  }
};

Blockly.Blocks['sb_perform'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg['AUDIO_PERFORM_ONCE'].replace('%1', ''));
    this.appendStatementInput("DO");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true); this.setColour("%{BKY_PERFORMANCE_HUE}");
    this.setTooltip(Blockly.Msg['AUDIO_PERFORM_ONCE_TOOLTIP']);
  }
};

Blockly.Blocks['sb_rhythm_sequence'] = {
  init: function () {
    this.appendDummyInput().appendField(Blockly.Msg['AUDIO_RHYTHM_SEQUENCE']);
    this.appendDummyInput()
      .appendField(Blockly.Msg['AUDIO_RHYTHM_SEQUENCE_INST'])
      .appendField(window.SB_Utils.createInstrumentField(Blockly.Msg['SB_CURRENT_INSTRUMENT_OPTION']), "INST");
    this.appendDummyInput()
      .appendField(Blockly.Msg['AUDIO_RHYTHM_SEQUENCE_MODE'])
      .appendField(new Blockly.FieldDropdown([[Blockly.Msg['AUDIO_RHYTHM_MODE_MONO'], "MONO"], [Blockly.Msg['AUDIO_RHYTHM_MODE_CHORD'], "CHORD"]]), "MODE");
    this.appendValueInput("MEASURE").setCheck("Number").appendField(Blockly.Msg['AUDIO_RHYTHM_SEQUENCE_MEASURE'].replace('%1', ''));
    this.appendValueInput("VELOCITY").setCheck("Number").appendField(Blockly.Msg['AUDIO_RHYTHM_SEQUENCE_VELOCITY']);
    this.appendDummyInput().appendField(Blockly.Msg['AUDIO_RHYTHM_SEQUENCE_PATTERN']);
    
    // 16 steps
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0 && i !== 0) {
        this.appendDummyInput().appendField("|");
      }
      this.appendDummyInput().appendField(new Blockly.FieldTextInput(i % 4 === 0 ? "x" : ""), "STEP" + i);
    }

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("%{BKY_PERFORMANCE_HUE}");
    this.setTooltip(Blockly.Msg['AUDIO_RHYTHM_SEQUENCE_TOOLTIP']);
  }
};

Blockly.Blocks['sb_musical_section'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg['SB_MUSICAL_SECTION'].split('%1')[0]);
    this.appendValueInput("DURATION")
      .setCheck("Number");
    this.appendDummyInput()
      .appendField(Blockly.Msg['SB_MUSICAL_SECTION'].split('%2')[0].split('%1')[1] || "小節");
    this.appendStatementInput("DO")
      .appendField(Blockly.Msg['SB_MUSICAL_SECTION'].split('%3')[0].split('%2')[1] || "");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true); this.setColour("%{BKY_PERFORMANCE_HUE}");
    this.setTooltip(Blockly.Msg['SB_MUSICAL_SECTION_TOOLTIP']);
  }
};
