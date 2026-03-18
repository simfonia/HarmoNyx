/**
 * HarmoNyx Toolbox Definition - Aligned with SynthBlockly Stage
 */

export const WaveCodeToolbox = {
    'kind': 'categoryToolbox',
    'contents': [
        // 1. Processing Structure
        {
            'kind': 'category',
            'name': '%{BKY_CAT_STRUCTURE}',
            'colour': '%{BKY_STRUCTURE_HUE}',
            'contents': [
                { 'kind': 'block', 'type': 'processing_setup' },
                { 'kind': 'block', 'type': 'processing_draw' },
                { 'kind': 'block', 'type': 'processing_exit' }
            ]
        },

        { 'kind': 'sep' },

        // 2. Logic
        {
            'kind': 'category',
            'name': '%{BKY_CAT_LOGIC}',
            'colour': '%{BKY_LOGIC_HUE}',
            'contents': [
                { 'kind': 'block', 'type': 'controls_if' },
                { 'kind': 'block', 'type': 'logic_compare' },
                { 'kind': 'block', 'type': 'logic_operation' },
                { 'kind': 'block', 'type': 'logic_negate' },
                { 'kind': 'block', 'type': 'logic_boolean' },
                { 'kind': 'block', 'type': 'logic_null' },
                { 'kind': 'block', 'type': 'logic_ternary' }
            ]
        },

        // 3. Loops
        {
            'kind': 'category',
            'name': '%{BKY_CAT_LOOPS}',
            'colour': '%{BKY_LOOPS_HUE}',
            'contents': [
                {
                    'kind': 'block',
                    'type': 'controls_repeat_ext',
                    'inputs': { 'TIMES': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 10 } } } }
                },
                { 'kind': 'block', 'type': 'controls_whileUntil' },
                {
                    'kind': 'block',
                    'type': 'controls_for',
                    'inputs': {
                        'FROM': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 1 } } },
                        'TO': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 10 } } },
                        'BY': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 1 } } }
                    }
                },
                { 'kind': 'block', 'type': 'controls_forEach' },
                { 'kind': 'block', 'type': 'controls_flow_statements' }
            ]
        },

        // 4. Math
        {
            'kind': 'category',
            'name': '%{BKY_CAT_MATH}',
            'colour': '%{BKY_MATH_HUE}',
            'contents': [
                { 'kind': 'block', 'type': 'math_number' },
                {
                    'kind': 'block',
                    'type': 'math_arithmetic',
                    'inputs': {
                        'A': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 1 } } },
                        'B': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 1 } } }
                    }
                },
                { 'kind': 'block', 'type': 'math_single' },
                { 'kind': 'block', 'type': 'math_trig' },
                { 'kind': 'block', 'type': 'math_constant' },
                { 'kind': 'block', 'type': 'math_number_property' },
                { 'kind': 'block', 'type': 'math_round' },
                { 'kind': 'block', 'type': 'math_modulo' },
                {
                    'kind': 'block',
                    'type': 'math_map',
                    'inputs': {
                        'FROM_LOW': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } },
                        'FROM_HIGH': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 127 } } },
                        'TO_LOW': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } },
                        'TO_HIGH': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 100 } } }
                    }
                },
                {
                    'kind': 'block',
                    'type': 'math_constrain',
                    'inputs': {
                        'LOW': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } },
                        'HIGH': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 100 } } }
                    }
                }
            ]
        },

        // 5. Text
        {
            'kind': 'category',
            'name': '%{BKY_CAT_TEXT}',
            'colour': '%{BKY_TEXT_HUE}',
            'contents': [
                { 'kind': 'block', 'type': 'text' },
                { 'kind': 'block', 'type': 'text_join' },
                {
                    'kind': 'block',
                    'type': 'text_append',
                    'inputs': { 'TEXT': { 'shadow': { 'type': 'text' } } }
                },
                { 'kind': 'block', 'type': 'text_length' },
                { 'kind': 'block', 'type': 'text_isEmpty' },
                { 'kind': 'block', 'type': 'text_charAt' },
                { 'kind': 'block', 'type': 'text_print' }
            ]
        },

        // 6. Lists
        {
            'kind': 'category',
            'name': '%{BKY_CAT_LISTS}',
            'colour': '%{BKY_LISTS_HUE}',
            'contents': [
                { 'kind': 'block', 'type': 'lists_create_empty' },
                { 'kind': 'block', 'type': 'lists_create_with' },
                { 'kind': 'block', 'type': 'lists_length' },
                { 'kind': 'block', 'type': 'lists_isEmpty' },
                { 'kind': 'block', 'type': 'lists_getIndex' },
                { 'kind': 'block', 'type': 'lists_setIndex' },
                {
                    'kind': 'block',
                    'type': 'lists_split',
                    'inputs': { 'DELIM': { 'shadow': { 'type': 'text', 'fields': { 'TEXT': ',' } } } }
                }
            ]
        },

        { 'kind': 'sep' },

        // 7. Variables & Functions & Tools
        {
            'kind': 'category',
            'name': '%{BKY_CAT_VARIABLES}',
            'colour': '%{BKY_VARIABLES_HUE}',
            'custom': 'VARIABLE'
        },
        {
            'kind': 'category',
            'name': '%{BKY_CAT_FUNCTIONS}',
            'colour': '%{BKY_FUNCTIONS_HUE}',
            'custom': 'PROCEDURE'
        },
        {
            'kind': 'category',
            'name': '%{BKY_CAT_TOOLS}',
            'colour': '%{BKY_TOOLS_HUE}',
            'contents': [
                { 'kind': 'block', 'type': 'sb_comment' }
            ]
        },

        { 'kind': 'sep' },

        // 8. Live Show (Management)
        {
            'kind': 'category',
            'name': '%{BKY_CAT_LIVE_SHOW}',
            'colour': '%{BKY_LIVE_SHOW_HUE}',
            'contents': [
                { 'kind': 'block', 'type': 'visual_stage_setup' },
                {
                    'kind': 'block',
                    'type': 'visual_stage_set_color',
                    'inputs': { 'COLOR': { 'shadow': { 'type': 'visual_color_picker' } } }
                },
                {
                    'kind': 'block',
                    'type': 'live_set_param',
                    'inputs': { 'VALUE': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 1 } } } }
                },
                { 'kind': 'block', 'type': 'live_get_param' },
                {
                    'kind': 'block',
                    'type': 'sb_log_to_screen',
                    'inputs': { 'MSG': { 'shadow': { 'type': 'text', 'fields': { 'TEXT': 'Hello' } } } }
                }
            ]
        },

        // 9. Sound Sources
        {
            'kind': 'category',
            'name': '%{BKY_CAT_SOUND_SOURCES}',
            'colour': '%{BKY_SOUND_SOURCES_HUE}',
            'contents': [
                { 'kind': 'block', 'type': 'sb_minim_init' },
                { 'kind': 'block', 'type': 'sb_instrument_container' },
                { 'kind': 'block', 'type': 'sb_set_wave' },
                { 'kind': 'block', 'type': 'sb_set_noise' },
                {
                    'kind': 'block',
                    'type': 'sb_mixed_source',
                    'inputs': { 'LEVEL': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 30 } } } }
                },
                { 'kind': 'block', 'type': 'sb_create_harmonic_synth' },
                { 'kind': 'block', 'type': 'sb_create_additive_synth' },
                { 'kind': 'block', 'type': 'sb_melodic_sampler' },
                { 'kind': 'block', 'type': 'sb_drum_sampler' }
            ]
        },

        // 10. Instrument Control
        {
            'kind': 'category',
            'name': '%{BKY_CAT_INSTRUMENT_CONTROL}',
            'colour': '%{BKY_INSTRUMENT_CONTROL_HUE}',
            'contents': [
                {
                    'kind': 'block',
                    'type': 'sb_set_panning',
                    'inputs': { 'VALUE': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } } }
                },
                {
                    'kind': 'block',
                    'type': 'sb_set_instrument_volume',
                    'inputs': { 'VOLUME': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 100 } } } }
                },
                {
                    'kind': 'block',
                    'type': 'sb_set_adsr',
                    'inputs': {
                        'A': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0.01 } } },
                        'D': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0.1 } } },
                        'S': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0.5 } } },
                        'R': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0.5 } } }
                    }
                },
                {
                    'kind': 'block',
                    'type': 'sb_update_adsr',
                    'inputs': {
                        'A': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0.01 } } },
                        'D': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0.1 } } },
                        'S': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0.5 } } },
                        'R': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0.5 } } }
                    }
                }
            ]
        },

        // 11. Audio Effects
        {
            'kind': 'category',
            'name': '%{BKY_CAT_EFFECTS}',
            'colour': '%{BKY_EFFECTS_HUE}',
            'contents': [
                {
                    'kind': 'block',
                    'type': 'sb_setup_effect',
                    'extraState': '<mutation effect_type="filter"></mutation>',
                    'fields': { 'EFFECT_TYPE': 'filter' },
                    'inputs': {
                        'FILTER_FREQ': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 1000 } } },
                        'FILTER_Q': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 1 } } }
                    }
                },
                {
                    'kind': 'block',
                    'type': 'sb_set_effect_param',
                    'extraState': '<mutation effect_type="panning"></mutation>',
                    'fields': { 'EFFECT_TYPE': 'panning' },
                    'inputs': { 'VALUE': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } } }
                }
            ]
        },

        // 12. Performance
        {
            'kind': 'category',
            'name': '%{BKY_CAT_PERFORMANCE}',
            'colour': '%{BKY_PERFORMANCE_HUE}',
            'contents': [
                { 'kind': 'block', 'type': 'sb_select_current_instrument' },
                {
                    'kind': 'block',
                    'type': 'sb_transport_set_bpm',
                    'inputs': { 'BPM': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 120 } } } }
                },
                {
                    'kind': 'block',
                    'type': 'sb_transport_count_in',
                    'inputs': {
                        'MEASURES': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 1 } } },
                        'BEATS': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 4 } } },
                        'BEAT_UNIT': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 4 } } },
                        'VELOCITY': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 100 } } }
                    }
                },
                { 'kind': 'block', 'type': 'sb_define_chord' },
                {
                    'kind': 'block',
                    'type': 'sb_play_note',
                    'inputs': {
                        'PITCH': { 'shadow': { 'type': 'text', 'fields': { 'TEXT': '60' } } },
                        'VELOCITY': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 100 } } }
                    }
                },
                {
                    'kind': 'block',
                    'type': 'sb_stop_note',
                    'inputs': { 'PITCH': { 'shadow': { 'type': 'text', 'fields': { 'TEXT': '60' } } } }
                },
                {
                    'kind': 'block',
                    'type': 'sb_trigger_sample',
                    'inputs': { 'VELOCITY': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 100 } } } }
                },
                {
                    'kind': 'block',
                    'type': 'sb_play_drum',
                    'inputs': { 'VELOCITY': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 100 } } } }
                },
                { 'kind': 'block', 'type': 'sb_play_melody' },
                {
                    'kind': 'block',
                    'type': 'sb_play_chord_by_name',
                    'inputs': {
                        'DUR': { 'shadow': { 'type': 'text', 'fields': { 'TEXT': '4n' } } },
                        'VELOCITY': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 100 } } }
                    }
                },
                { 'kind': 'block', 'type': 'sb_audio_is_playing' },
                { 'kind': 'block', 'type': 'sb_wait_until_finished' },
                {
                    'kind': 'block',
                    'type': 'sb_wait_musical',
                    'inputs': { 'VALUE': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 1 } } } }
                },
                { 'kind': 'block', 'type': 'sb_tone_loop' },
                { 'kind': 'block', 'type': 'sb_perform' },
                {
                    'kind': 'block',
                    'type': 'sb_rhythm_sequence',
                    'inputs': {
                        'MEASURE': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 1 } } },
                        'VELOCITY': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 100 } } }
                    }
                },
                {
                    'kind': 'block',
                    'type': 'sb_musical_section',
                    'inputs': { 'DURATION': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 4 } } } }
                },
                { 'kind': 'block', 'type': 'sb_rhythm_sequencer_v2' }
            ]
        },

        { 'kind': 'sep' },

        // 13. Visuals (Drawing)
        {
            'kind': 'category',
            'name': '%{BKY_CAT_VISUAL}',
            'colour': '%{BKY_VISUAL_HUE}',
            'contents': [
                { 'kind': 'block', 'type': 'visual_color_picker' },
                { 'kind': 'block', 'type': 'processing_frame_count' },
                {
                    'kind': 'block',
                    'type': 'visual_frame_rate',
                    'inputs': { 'FPS': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 60 } } } }
                },
                { 'kind': 'block', 'type': 'visual_size' },
                { 'kind': 'block', 'type': 'visual_pixel_density' },
                { 'kind': 'block', 'type': 'visual_constant' },

                { 'kind': 'sep', 'gap': 32 },

                {
                    'kind': 'block',
                    'type': 'visual_background',
                    'inputs': { 'COLOR': { 'shadow': { 'type': 'visual_color_picker' } } }
                },
                {
                    'kind': 'block',
                    'type': 'visual_fill',
                    'inputs': { 'COLOR': { 'shadow': { 'type': 'visual_color_picker' } } }
                },
                { 'kind': 'block', 'type': 'visual_no_fill' },
                {
                    'kind': 'block',
                    'type': 'visual_stroke',
                    'inputs': { 'COLOR': { 'shadow': { 'type': 'visual_color_picker' } } }
                },
                {
                    'kind': 'block',
                    'type': 'visual_stroke_weight',
                    'inputs': { 'WEIGHT': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 1 } } } }
                },
                { 'kind': 'block', 'type': 'visual_no_stroke' },

                { 'kind': 'sep', 'gap': 32 },

                {
                    'kind': 'block',
                    'type': 'visual_rect',
                    'inputs': {
                        'X': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } },
                        'Y': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } },
                        'W': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 100 } } },
                        'H': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 100 } } }
                    }
                },
                {
                    'kind': 'block',
                    'type': 'visual_ellipse',
                    'inputs': {
                        'X': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 50 } } },
                        'Y': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 50 } } },
                        'W': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 80 } } },
                        'H': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 80 } } }
                    }
                },
                {
                    'kind': 'block',
                    'type': 'visual_line',
                    'inputs': {
                        'X1': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } },
                        'Y1': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } },
                        'X2': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 100 } } },
                        'Y2': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 100 } } }
                    }
                },
                {
                    'kind': 'block',
                    'type': 'visual_triangle',
                    'inputs': {
                        'X1': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 50 } } },
                        'Y1': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } },
                        'X2': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } },
                        'Y2': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 100 } } },
                        'X3': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 100 } } },
                        'Y3': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 100 } } }
                    }
                },

                { 'kind': 'sep', 'gap': 32 },

                {
                    'kind': 'block',
                    'type': 'visual_translate',
                    'inputs': {
                        'X': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } },
                        'Y': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } }
                    }
                },
                {
                    'kind': 'block',
                    'type': 'visual_rotate',
                    'inputs': { 'ANGLE': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 45 } } } }
                },
                {
                    'kind': 'block',
                    'type': 'visual_scale',
                    'inputs': { 'S': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 1.0 } } } }
                },
                { 'kind': 'block', 'type': 'visual_push_pop' }
            ]
        },

        // 14. Serial (Arduino)
        {
            'kind': 'category',
            'name': '%{BKY_CAT_SERIAL}',
            'colour': '%{BKY_SERIAL_HUE}',
            'contents': [
                { 'kind': 'block', 'type': 'sb_serial_data_received' },
                { 'kind': 'block', 'type': 'serial_init' },
                { 'kind': 'block', 'type': 'serial_available' },
                { 'kind': 'block', 'type': 'serial_read_string' },
                {
                    'kind': 'block',
                    'type': 'sb_serial_write',
                    'inputs': { 'CONTENT': { 'shadow': { 'type': 'text', 'fields': { 'TEXT': 'A' } } } }
                },
                {
                    'kind': 'block',
                    'type': 'serial_check_mask',
                    'inputs': { 'MASK': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } } }
                },
                {
                    'kind': 'block',
                    'type': 'sb_serial_check_key_mask',
                    'inputs': { 'DATA': { 'shadow': { 'type': 'variables_get', 'fields': { 'VAR': 'serial_data' } } } }
                }
            ]
        },

        // 15. MIDI & PC Key
        {
            'kind': 'category',
            'name': '%{BKY_CAT_PC_KEY}',
            'colour': '%{BKY_PC_KEY_HUE}',
            'contents': [
                { 'kind': 'block', 'type': 'ui_key_event' }
            ]
        },
        {
            'kind': 'category',
            'name': '%{BKY_CAT_MIDI}',
            'colour': '%{BKY_MIDI_HUE}',
            'contents': [
                { 'kind': 'block', 'type': 'midi_init' },
                { 'kind': 'block', 'type': 'midi_on_note' },
                { 'kind': 'block', 'type': 'midi_off_note' },
                { 'kind': 'block', 'type': 'midi_on_controller_change' },
                { 'kind': 'sep', 'gap': 32 },
                {
                    'kind': 'block',
                    'type': 'midi_send_note',
                    'inputs': {
                        'CHANNEL': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } },
                        'PITCH': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 60 } } },
                        'VELOCITY': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 100 } } }
                    }
                },
                {
                    'kind': 'block',
                    'type': 'midi_send_cc',
                    'inputs': {
                        'CHANNEL': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } },
                        'NUMBER': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } },
                        'VALUE': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 127 } } }
                    }
                },
                {
                    'kind': 'block',
                    'type': 'midi_lp_xy_to_note',
                    'inputs': {
                        'X': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } },
                        'Y': { 'shadow': { 'type': 'math_number', 'fields': { 'NUM': 0 } } }
                    }
                }
            ]
        },

        // 16. UI Control
        {
            'kind': 'category',
            'name': '%{BKY_CAT_UI}',
            'colour': '%{BKY_UI_HUE}',
            'contents': [
                { 'kind': 'block', 'type': 'ui_init' },
                { 'kind': 'block', 'type': 'ui_add_slider' },
                { 'kind': 'block', 'type': 'ui_add_toggle' }
            ]
        }
    ]
};
