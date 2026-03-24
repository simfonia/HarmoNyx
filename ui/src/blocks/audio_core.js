/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */

/**
 * Audio Core Blocks: Initialization and Instrument Setup.
 */

Blockly.defineBlocksWithJsonArray([
  // Mutator Helper Blocks
  {
    "type": "sb_harmonic_partial_container",
    "message0": "%{BKY_SB_HARMONIC_PARTIAL_CONTAINER}",
    "nextStatement": null,
    "enableContextMenu": false,
    "colour": "#E74C3C"
  },
  {
    "type": "sb_harmonic_partial_item",
    "message0": "%{BKY_SB_HARMONIC_PARTIAL_ITEM}",
    "previousStatement": null,
    "nextStatement": null,
    "enableContextMenu": false,
    "colour": "#E74C3C"
  },
  {
    "type": "sb_additive_synth_container",
    "message0": "%{BKY_SB_ADDITIVE_SYNTH_CONTAINER}",
    "nextStatement": null,
    "enableContextMenu": false,
    "colour": "#E74C3C"
  },
  {
    "type": "sb_additive_synth_item",
    "message0": "%{BKY_SB_ADDITIVE_SYNTH_ITEM}",
    "previousStatement": null,
    "nextStatement": null,
    "enableContextMenu": false,
    "colour": "#E74C3C"
  },

  // Standard Audio Initialization
  {
    "type": "sb_minim_init",
    "message0": "%{BKY_SB_MINIM_INIT}",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_SOUND_SOURCES_HUE}",
    "tooltip": "%{BKY_SB_MINIM_INIT_TOOLTIP}%{BKY_HELP_HINT}",
    "helpUrl": "sound_sources"
  },
  
  // Wave & Noise Sources
  {
    "type": "sb_set_wave",
    "message0": "%{BKY_SB_SET_WAVE_MESSAGE}",
    "args0": [
        {
            "type": "field_dropdown",
            "name": "TYPE",
            "options": [
                ["Sine", "SINE"],
                ["Square", "SQUARE"],
                ["Triangle", "TRIANGLE"],
                ["Sawtooth", "SAW"]
            ]
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_SOUND_SOURCES_HUE}",
    "tooltip": "%{BKY_SB_SET_WAVE_TOOLTIP}"
  },
  {
    "type": "sb_set_noise",
    "message0": "%{BKY_SB_SET_NOISE_MESSAGE}",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "TYPE",
        "options": [
          ["White", "WHITE"],
          ["Pink", "PINK"],
          ["Brown", "BROWN"]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_SOUND_SOURCES_HUE}",
    "tooltip": "%{BKY_SB_SET_NOISE_TOOLTIP}"
  },
  {
    "type": "sb_mixed_source",
    "message0": "%{BKY_SB_MIXED_SOURCE_MESSAGE}",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "WAVE",
        "options": [["Sine", "SINE"], ["Square", "SQUARE"], ["Triangle", "TRIANGLE"], ["Saw", "SAW"]]
      },
      {
        "type": "field_dropdown",
        "name": "NOISE",
        "options": [["White", "WHITE"], ["Pink", "PINK"], ["Brown", "BROWN"]]
      },
      { "type": "input_value", "name": "LEVEL", "check": "Number" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_SOUND_SOURCES_HUE}",
    "tooltip": "%{BKY_SB_MIXED_SOURCE_TOOLTIP}" + Blockly.Msg['HELP_HINT'],
    "helpUrl": "mixed_source"
  },

  // Custom Synths
  {
    "type": "sb_create_harmonic_synth",
    "message0": "%{BKY_AUDIO_CREATE_HARMONIC_SYNTH}",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_SOUND_SOURCES_HUE}",
    "tooltip": "%{BKY_AUDIO_CREATE_HARMONIC_SYNTH_TOOLTIP}%{BKY_HELP_HINT}",
    "mutator": "harmonic_mutator",
    "helpUrl": "custom_synth"
  },
  {
    "type": "sb_create_additive_synth",
    "message0": "%{BKY_AUDIO_CREATE_ADDITIVE_SYNTH}",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "%{BKY_SOUND_SOURCES_HUE}",
    "tooltip": "%{BKY_AUDIO_CREATE_ADDITIVE_SYNTH_TOOLTIP}%{BKY_HELP_HINT}",
    "mutator": "additive_mutator",
    "helpUrl": "custom_synth"
  }
]);

// Samplers
Blockly.Blocks['sb_drum_sampler'] = {
  init: function () {
    this.jsonInit({
      "type": "sb_drum_sampler",
      "message0": "%{BKY_AUDIO_CREATE_DRUM_SAMPLER}",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "PATH",
          "options": [
            ["Kick", "drum/kick.wav"],
            ["Snare", "drum/snare.wav"],
            ["Rimshot", "drum/rim.wav"],
            ["Hi-Hat (Closed)", "drum/ch.wav"],
            ["Hi-Hat (Open)", "drum/oh.wav"],
            ["Tom (High)", "drum/tom_hi.wav"],
            ["Tom (Mid)", "drum/tom_mid.wav"],
            ["Tom (Low)", "drum/tom_low.wav"],
            ["Crash", "drum/crash.wav"],
            ["Ride", "drum/ride.wav"],
            ["Clap", "drum/clap.wav"],
            ["%{BKY_AUDIO_SAMPLER_CUSTOM}", "CUSTOM"]
          ]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "%{BKY_SOUND_SOURCES_HUE}",
      "tooltip": "%{BKY_AUDIO_DRUM_SAMPLER_TOOLTIP}%{BKY_HELP_HINT}",
      "helpUrl": "sound_sources",
      "mutator": "drum_sampler_mutator"
    });
  }
};
Object.assign(Blockly.Blocks['sb_drum_sampler'], window.SB_Utils.FIELD_HELPER);

Blockly.Blocks['sb_melodic_sampler'] = {
  init: function () {
    this.jsonInit({
      "type": "sb_melodic_sampler",
      "message0": "%{BKY_AUDIO_CREATE_MELODIC_SAMPLER}",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "TYPE",
          "options": [
            ["%{BKY_AUDIO_MELODIC_SAMPLER_PIANO}", "PIANO"],
            ["%{BKY_AUDIO_MELODIC_SAMPLER_VIOLIN_PIZZ}", "VIOLIN_PIZZ"],
            ["%{BKY_AUDIO_MELODIC_SAMPLER_VIOLIN_ARCO}", "VIOLIN_ARCO"],
            ["%{BKY_AUDIO_SAMPLER_CUSTOM}", "CUSTOM"]
          ]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "%{BKY_SOUND_SOURCES_HUE}",
      "tooltip": "%{BKY_AUDIO_MELODIC_SAMPLER_TOOLTIP}%{BKY_HELP_HINT}",
      "helpUrl": "sound_sources",
      "mutator": "melodic_sampler_mutator"
    });
  }
};
Object.assign(Blockly.Blocks['sb_melodic_sampler'], window.SB_Utils.FIELD_HELPER);

// Instrument Container
Blockly.Blocks['sb_instrument_container'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg['SB_INSTRUMENT_CONTAINER_MESSAGE'].replace('%1', '').replace('%2', '').trim())
      .appendField(new Blockly.FieldTextInput("MySynth"), "NAME");
    this.appendStatementInput("STACK")
      .setCheck(null);
    this.setColour(Blockly.Msg['SOUND_SOURCES_HUE'] || "#E74C3C");
    this.setTooltip(Blockly.Msg['SB_INSTRUMENT_CONTAINER_TOOLTIP']);
  },
  onchange: function () {
    if (!this.workspace || this.isInFlyout) return;
    const sourceTypes = ['sb_set_wave', 'sb_set_noise', 'sb_mixed_source', 'sb_melodic_sampler', 'sb_drum_sampler', 'sb_create_harmonic_synth', 'sb_create_additive_synth'];
    const descendants = this.getDescendants(false);
    const sources = descendants.filter(b => sourceTypes.includes(b.type) && b.isEnabled());
    const svg = this.getSvgRoot();
    if (sources.length > 1) {
      this.setWarningText(Blockly.Msg['SB_INSTRUMENT_CONTAINER_MULTI_SOURCE_WARN']);
      if (svg) svg.classList.add('blockly-conflict-glow');
    } else {
      this.setWarningText(null);
      if (svg) svg.classList.remove('blockly-conflict-glow');
    }
  }
};

// ADSR
Blockly.Blocks['sb_set_adsr'] = {
  init: function () {
    this.jsonInit({
      "type": "sb_set_adsr",
      "message0": "%{BKY_SB_SET_ADSR_MESSAGE} A %1 D %2 S %3 R %4",
      "args0": [
        { "type": "field_number", "name": "A", "value": 0.05, "min": 0, "max": 10, "precision": 0.01 },
        { "type": "field_number", "name": "D", "value": 0.2, "min": 0, "max": 10, "precision": 0.01 },
        { "type": "field_number", "name": "S", "value": 0.5, "min": 0, "max": 1, "precision": 0.01 },
        { "type": "field_number", "name": "R", "value": 0.5, "min": 0, "max": 10, "precision": 0.01 }
      ],
      "message1": "%1",
      "args1": [
        { "type": "field_adsr", "name": "VISUAL", "a": 0.05, "d": 0.2, "s": 0.5, "r": 0.5 }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "%{BKY_INSTRUMENT_CONTROL_HUE}",
      "tooltip": "%{BKY_SB_SET_ADSR_TOOLTIP}",
      "extensions": ["audio_adsr_visual_sync"]
    });
  }
};

// Register Mutators
Blockly.Extensions.register('audio_adsr_visual_sync', function() {
  const block = this;
  const updateVisual = () => {
    if (block.disposed) return;
    const a = parseFloat(block.getFieldValue('A')) || 0;
    const d = parseFloat(block.getFieldValue('D')) || 0;
    const s = parseFloat(block.getFieldValue('S')) || 0;
    const r = parseFloat(block.getFieldValue('R')) || 0;
    const visualField = block.getField('VISUAL');
    if (visualField && visualField.updateParams) {
      visualField.updateParams(a, d, s, r);
    }
  };
  
  // 初始同步
  setTimeout(() => {
    if (!block.disposed) updateVisual();
  }, 100);

  block.setOnChange(function(e) {
    if (e.type === Blockly.Events.BLOCK_CHANGE && e.blockId === block.id) {
      updateVisual();
    }
    
    // Original Warning Logic
    if (!this.workspace || this.isInFlyout) return;
    let parent = this.getParent();
    while (parent && parent.type !== 'sb_instrument_container') { parent = parent.getParent(); }
    if (parent) {
      const hasEnabledSampler = parent.getDescendants(false).some(b => b.type === 'sb_melodic_sampler' && b.isEnabled());
      if (hasEnabledSampler) this.setWarningText(Blockly.Msg['SB_SET_ADSR_SAMPLER_WARN']);
      else this.setWarningText(null);
    } else {
      this.setWarningText(null);
    }
  });
});

Blockly.Extensions.registerMutator('harmonic_mutator', window.SB_Utils.HARMONIC_PARTIALS_MUTATOR, undefined, ['sb_harmonic_partial_item']);
Blockly.Extensions.registerMutator('additive_mutator', window.SB_Utils.ADDITIVE_SYNTH_MUTATOR, undefined, ['sb_additive_synth_item']);
Blockly.Extensions.registerMutator('melodic_sampler_mutator', window.SB_Utils.MELODIC_SAMPLER_MUTATOR, undefined);
Blockly.Extensions.registerMutator('drum_sampler_mutator', window.SB_Utils.DRUM_SAMPLER_MUTATOR, undefined);
