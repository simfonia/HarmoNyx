/**
 * HarmoNyx Toolbox Definition - 遷移自 SynthBlockly Stage
 */

export const WaveCodeToolbox = {
    'kind': 'categoryToolbox',
    'contents': [
        // 1. Processing Structure
        {
            'kind': 'category',
            'name': '程式結構',
            'colour': '#5C81A6',
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
            'name': '邏輯判斷',
            'colour': '#5C81A6',
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
            'name': '迴圈控制',
            'colour': '#5C81A6',
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
            'name': '數學運算',
            'colour': '#5C81A6',
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
                { 'kind': 'block', 'type': 'math_modulo' }
            ]
        },

        { 'kind': 'sep' },

        // 7. Variables & Functions
        {
            'kind': 'category',
            'name': '變數管理',
            'custom': 'VARIABLE',
            'colour': '#A65C81'
        },
        {
            'kind': 'category',
            'name': '自訂函式',
            'custom': 'PROCEDURE',
            'colour': '#9A5CA6'
        },
        {
            'kind': 'category',
            'name': '工具',
            'colour': '#5CA699',
            'contents': [
                { 'kind': 'block', 'type': 'sb_comment' }
            ]
        },

        { 'kind': 'sep' },

        // 8. Live Show (Management)
        {
            'kind': 'category',
            'name': '表演舞台',
            'colour': '#2E86C1',
            'contents': [
                { 'kind': 'block', 'type': 'visual_stage_setup' },
                { 'kind': 'block', 'type': 'visual_background' },
                {
                    'kind': 'block',
                    'type': 'sb_log_to_screen',
                    'inputs': { 'MSG': { 'shadow': { 'type': 'text', 'fields': { 'TEXT': 'Hello HarmoNyx' } } } }
                }
            ]
        },

        // 9. Sound Sources
        {
            'kind': 'category',
            'name': '音訊引擎',
            'colour': '#8E44AD',
            'contents': [
                { 'kind': 'block', 'type': 'sb_minim_init' },
                { 'kind': 'block', 'type': 'sb_instrument_container' },
                { 'kind': 'block', 'type': 'sb_play_note' },
                { 'kind': 'block', 'type': 'sb_play_melody' }
            ]
        },

        // 12. Visuals (Drawing)
        {
            'kind': 'category',
            'name': '幾何繪圖',
            'colour': '#2E86C1',
            'contents': [
                { 'kind': 'block', 'type': 'visual_rect' },
                { 'kind': 'block', 'type': 'visual_ellipse' },
                { 'kind': 'block', 'type': 'visual_line' }
            ]
        }
    ]
};
