(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))l(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&l(i)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function l(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();window.SB_Utils=window.SB_Utils||{};window.SB_Utils.initPolyfills=function(){Blockly.Workspace.prototype.getAllVariables===void 0&&(Blockly.Workspace.prototype.getAllVariables=function(){return this.getVariableMap().getAllVariables()}),Blockly.Workspace.prototype.getVariable===void 0&&(Blockly.Workspace.prototype.getVariable=function(e,t){return this.getVariableMap().getVariable(e,t)}),Blockly.Workspace.prototype.getVariableById===void 0&&(Blockly.Workspace.prototype.getVariableById=function(e){return this.getVariableMap().getVariableById(e)})};window.SB_Utils.KEYS={SYSTEM:["up","down","left","right","+","-","backspace"],PIANO:["q","2","w","3","e","r","5","t","6","y","7","u","i","9","o","0","p"],ALL:"abcdefghijklmnopqrstuvwxyz1234567890[];,./".split("")};window.SB_Utils.getAvailableKeys=function(e){const t=e.workspace,n=t.getAllBlocks(!1).some(o=>o.type==="visual_stage_setup"),l=new Set;t.getAllBlocks(!1).forEach(o=>{if(o!==e&&(o.type==="ui_key_event"||o.type==="ui_key_pressed")){const i=o.getFieldValue("KEY");i&&l.add(i.toLowerCase())}});const s=[];return window.SB_Utils.KEYS.ALL.forEach(o=>{window.SB_Utils.KEYS.SYSTEM.includes(o)||n&&window.SB_Utils.KEYS.PIANO.includes(o)||l.has(o)||s.push([o.toUpperCase(),o])}),s.length>0?s:[["(無可用按鍵)","NONE"]]};window.SB_Utils.checkKeyConflicts=function(e){const t=e.getAllBlocks(!1).some(l=>l.type==="visual_stage_setup"),n=new Map;e.getAllBlocks(!1).forEach(l=>{if(l.type==="ui_key_event"||l.type==="ui_key_pressed"){const s=l.getFieldValue("KEY");if(!s)return;const o=window.SB_Utils.KEYS.PIANO.includes(s.toLowerCase());t&&o?(l.setWarningText(Blockly.Msg.SB_KEY_CONFLICT_STAGE||"此按鍵已分配給「舞台鋼琴」功能，此積木將失效。"),typeof l.setDisabled=="function"&&l.setDisabled(!0)):n.has(s.toLowerCase())?(l.setWarningText(Blockly.Msg.SB_KEY_CONFLICT_DUP||"此按鍵已被另一個積木重複定義。"),typeof l.setDisabled=="function"&&l.setDisabled(!0)):(l.setWarningText(null),typeof l.setDisabled=="function"&&l.setDisabled(!1),n.set(s.toLowerCase(),l))}})};window.SB_Utils.getInstrumentJavaName=function(e){const t=Blockly.Msg.SB_CURRENT_INSTRUMENT_OPTION||"當前選用的樂器",n=Blockly.Msg.SB_SELECT_INSTRUMENT_PROMPT||"(請選擇樂器)";return!e||e===t||e===n?"currentInstrument":'"'+e+'"'};window.SB_Utils.getRelativeIndex=function(e){return e||(e="1"),!isNaN(parseFloat(e))&&isFinite(e)?String(Number(e)-1):e+" - 1"};window.SB_Utils.getInstrumentOptions=function(){const e=[[Blockly.Msg.SB_CURRENT_INSTRUMENT_OPTION||"當前選用的樂器","當前選用的樂器"]],t=Blockly.getMainWorkspace();return t&&t.getBlocksByType("sb_instrument_container").forEach(n=>{const l=n.getFieldValue("NAME");l&&e.push([l,l])}),e};window.SB_Utils.createInstrumentField=function(e){const t=new Blockly.FieldTextInput(e||Blockly.Msg.SB_CURRENT_INSTRUMENT_OPTION||"當前選用的樂器");return t.showEditor_=function(n){setTimeout(()=>{const l=window.SB_Utils.getInstrumentOptions().map(s=>({text:s[0],enabled:!0,callback:()=>{t.setValue(s[1])}}));l.push({text:"--- "+(Blockly.Msg.AUDIO_SAMPLER_CUSTOM||"手動輸入")+" ---",enabled:!0,callback:()=>{Blockly.FieldTextInput.prototype.showEditor_.call(t)}}),Blockly.ContextMenu.show(n||{},l,this.sourceBlock_.RTL)},10)},t};window.SB_Utils.getChordDropdown=function(){const t=Blockly.getMainWorkspace().getBlocksByType("sb_define_chord").map(n=>[n.getFieldValue("NAME"),n.getFieldValue("NAME")]);return t.length>0?t:[[Blockly.Msg.AUDIO_SELECT_CHORD_DROPDOWN||"(選取和弦)","none"]]};window.SB_Utils.hexToJavaColor=function(e){if(!e||e.charAt(0)!=="#")return"color(0)";const t=parseInt(e.substring(1,3),16),n=parseInt(e.substring(3,5),16),l=parseInt(e.substring(5,7),16);return`color(${t}, ${n}, ${l})`};window.SB_Utils.hexToHue=function(e){if(!e||e.charAt(0)!=="#")return 0;const t=parseInt(e.substring(1,3),16)/255,n=parseInt(e.substring(3,5),16)/255,l=parseInt(e.substring(5,7),16)/255,s=Math.max(t,n,l),o=Math.min(t,n,l),i=s-o;let a=0;return s!==o&&(s===t?a=(n-l)/i+(n<l?6:0):s===n?a=(l-t)/i+2:a=(t-n)/i+4,a/=6),(a*255).toFixed(1)};window.SB_Utils.HARMONIC_PARTIALS_MUTATOR={itemCount_:3,mutationToDom:function(){const e=Blockly.utils.xml.createElement("mutation");return e.setAttribute("items",this.itemCount_),e},domToMutation:function(e){this.itemCount_=parseInt(e.getAttribute("items"),10),this.updateShape_()},decompose:function(e){const t=e.newBlock("sb_harmonic_partial_container");t.initSvg();let n=t.nextConnection;for(let l=0;l<this.itemCount_;l++){const s=e.newBlock("sb_harmonic_partial_item");s.initSvg(),n.connect(s.previousConnection),n=s.nextConnection}return t},compose:function(e){let t=e.getNextBlock();for(this.itemCount_=0;t;)this.itemCount_++,t=t.getNextBlock();this.updateShape_()},updateShape_:function(){const e=[];for(let n=1;n<=100;n++){const l=this.getInput("PARTIAL"+n);if(!l)break;e.push(l.connection.targetConnection)}let t=1;for(;this.getInput("PARTIAL"+t);)this.removeInput("PARTIAL"+t),t++;for(let n=1;n<=this.itemCount_;n++){const l=this.appendValueInput("PARTIAL"+n).setCheck("Number").appendField("分音 "+n);e[n-1]&&l.connection.connect(e[n-1])}}};window.SB_Utils.ADDITIVE_SYNTH_MUTATOR={itemCount_:2,mutationToDom:function(){const e=Blockly.utils.xml.createElement("mutation");return e.setAttribute("items",this.itemCount_),e},domToMutation:function(e){this.itemCount_=parseInt(e.getAttribute("items"),10),this.updateShape_()},decompose:function(e){const t=e.newBlock("sb_additive_synth_container");t.initSvg();let n=t.nextConnection;for(let l=0;l<this.itemCount_;l++){const s=e.newBlock("sb_additive_synth_item");s.initSvg(),n.connect(s.previousConnection),n=s.nextConnection}return t},compose:function(e){let t=e.getNextBlock();for(this.itemCount_=0;t;)this.itemCount_++,t=t.getNextBlock();this.updateShape_()},updateShape_:function(){const e=[];for(let n=1;n<=100&&this.getField("WAVE"+n);n++)e.push({wave:this.getFieldValue("WAVE"+n),ratio:this.getFieldValue("RATIO"+n),amp:this.getFieldValue("AMP"+n)});let t=1;for(;this.getInput("COMP"+t);)this.removeInput("COMP"+t),t++;for(let n=1;n<=this.itemCount_;n++)this.appendDummyInput("COMP"+n).appendField("波形").appendField(new Blockly.FieldDropdown([["Triangle","TRIANGLE"],["Sine","SINE"],["Square","SQUARE"],["Saw","SAW"]]),"WAVE"+n).appendField("倍率").appendField(new Blockly.FieldTextInput("1.0"),"RATIO"+n).appendField("振幅").appendField(new Blockly.FieldTextInput("0.5"),"AMP"+n),e[n-1]&&(this.setFieldValue(e[n-1].wave,"WAVE"+n),this.setFieldValue(e[n-1].ratio,"RATIO"+n),this.setFieldValue(e[n-1].amp,"AMP"+n))}};window.SB_Utils.DRUM_SAMPLER_MUTATOR={mutationToDom:function(){const e=Blockly.utils.xml.createElement("mutation");return e.setAttribute("type",this.getFieldValue("PATH")||"Kick"),e},domToMutation:function(e){this.updateShape_(e.getAttribute("type")||"Kick")},updateShape_:function(e){e==="CUSTOM"?this.getInput("CUSTOM_PATH")||this.appendDummyInput("CUSTOM_PATH").appendField("路徑").appendField(new Blockly.FieldTextInput("drum/kick.wav"),"CUSTOM_PATH_VALUE"):this.getInput("CUSTOM_PATH")&&this.removeInput("CUSTOM_PATH")}};window.SB_Utils.MELODIC_SAMPLER_MUTATOR={mutationToDom:function(){const e=Blockly.utils.xml.createElement("mutation");return e.setAttribute("type",this.getFieldValue("TYPE")||"PIANO"),e},domToMutation:function(e){this.updateShape_(e.getAttribute("type")||"PIANO")},updateShape_:function(e){e==="CUSTOM"?this.getInput("CUSTOM_PATH")||this.appendDummyInput("CUSTOM_PATH").appendField("路徑").appendField(new Blockly.FieldTextInput("piano"),"CUSTOM_PATH_VALUE"):this.getInput("CUSTOM_PATH")&&this.removeInput("CUSTOM_PATH")}};window.SB_Utils.RHYTHM_V2_MUTATOR={itemCount_:1,mutationToDom:function(){const e=Blockly.utils.xml.createElement("mutation");return e.setAttribute("items",this.itemCount_),e},domToMutation:function(e){this.itemCount_=parseInt(e.getAttribute("items"),10),this.updateShape_()},decompose:function(e){const t=e.newBlock("sb_rhythm_v2_container");t.initSvg();let n=t.nextConnection;for(let l=0;l<this.itemCount_;l++){const s=e.newBlock("sb_rhythm_v2_item");s.initSvg(),n.connect(s.previousConnection),n=s.nextConnection}return t},compose:function(e){let t=e.getNextBlock();for(this.itemCount_=0;t;)this.itemCount_++,t=t.getNextBlock();this.updateShape_()},updateShape_:function(){const e=[];for(let n=0;n<50&&this.getField("INST"+n);n++)e.push({inst:this.getFieldValue("INST"+n),vel:this.getFieldValue("VEL"+n),mode:this.getFieldValue("MODE"+n),pattern:this.getFieldValue("PATTERN"+n)});let t=0;for(;this.getInput("TRACK"+t);)this.removeInput("TRACK"+t),t++;for(let n=0;n<this.itemCount_;n++)this.appendDummyInput("TRACK"+n).appendField("樂器").appendField(window.SB_Utils.createInstrumentField(),"INST"+n).appendField("力度").appendField(new Blockly.FieldTextInput("100"),"VEL"+n).appendField("模式").appendField(new Blockly.FieldDropdown([["單音","FALSE"],["和弦","TRUE"]]),"MODE"+n).appendField("節奏").appendField(new Blockly.FieldTextInput("x--- x--- x--- x---"),"PATTERN"+n),e[n]&&(this.setFieldValue(e[n].inst,"INST"+n),this.setFieldValue(e[n].vel,"VEL"+n),this.setFieldValue(e[n].mode,"MODE"+n),this.setFieldValue(e[n].pattern,"PATTERN"+n))}};window.SB_Utils.SETUP_EFFECT_MUTATOR={mutationToDom:function(){const e=Blockly.utils.xml.createElement("mutation");return e.setAttribute("effect_type",this.getFieldValue("EFFECT_TYPE")||"filter"),this.getFieldValue("EFFECT_TYPE")==="filter"&&(e.setAttribute("filter_type_value",this.getFieldValue("FILTER_TYPE_VALUE")||"lowpass"),e.setAttribute("filter_rolloff_value",this.getFieldValue("FILTER_ROLLOFF_VALUE")||"-12")),e},domToMutation:function(e){this.updateShape_(e.getAttribute("effect_type")||"filter",e)},updateShape_:function(e,t){["FILTER_TYPE","FILTER_FREQ","FILTER_Q","FILTER_ROLLOFF","DELAY_TIME","FEEDBACK","BITDEPTH","THRESHOLD","RATIO","ATTACK","RELEASE","MAKEUP","WET","DISTORTION_AMOUNT","DECAY","PREDELAY","RATE","DEPTH","MOD_TYPE","SWEEP_INPUT","SWEEP_DEPTH_INPUT","JITTER_INPUT","ROOMSIZE","DAMPING"].forEach(s=>{this.getInput(s)&&this.removeInput(s)});const l=(s,o)=>{const i=this.getInput(s);if(i&&i.connection&&!t){const a=Blockly.utils.xml.textToDom('<shadow type="math_number"><field name="NUM">'+o+"</field></shadow>");i.connection.setShadowDom(a)}};e==="filter"?(this.appendDummyInput("FILTER_TYPE").setAlign(Blockly.ALIGN_RIGHT).appendField("類型").appendField(new Blockly.FieldDropdown([["lowpass","lowpass"],["highpass","highpass"],["bandpass","bandpass"]]),"FILTER_TYPE_VALUE"),this.appendValueInput("FILTER_FREQ").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("頻率"),this.appendValueInput("FILTER_Q").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("Q值"),this.appendDummyInput("FILTER_ROLLOFF").setAlign(Blockly.ALIGN_RIGHT).appendField("斜率").appendField(new Blockly.FieldDropdown([["-12dB","-12"],["-24dB","-24"],["-48dB","-48"]]),"FILTER_ROLLOFF_VALUE"),l("FILTER_FREQ",1e3),l("FILTER_Q",.5),t&&(this.setFieldValue(t.getAttribute("filter_type_value")||"lowpass","FILTER_TYPE_VALUE"),this.setFieldValue(t.getAttribute("filter_rolloff_value")||"-12","FILTER_ROLLOFF_VALUE"))):e==="delay"?(this.appendValueInput("DELAY_TIME").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("延遲時間"),this.appendValueInput("FEEDBACK").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("回饋量"),l("DELAY_TIME",.5),l("FEEDBACK",.5)):e==="bitcrush"?(this.appendValueInput("BITDEPTH").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("位元深度"),l("BITDEPTH",8)):e==="waveshaper"?(this.appendValueInput("DISTORTION_AMOUNT").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("失真程度"),l("DISTORTION_AMOUNT",2)):e==="reverb"?(this.appendValueInput("ROOMSIZE").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("空間大小"),this.appendValueInput("DAMPING").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("高頻衰減"),this.appendValueInput("WET").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("乾濕比"),l("ROOMSIZE",.5),l("DAMPING",.5),l("WET",.3)):e==="flanger"?(this.appendValueInput("DELAY_TIME").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("中心延遲"),this.appendValueInput("RATE").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("速率"),this.appendValueInput("DEPTH").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("深度"),this.appendValueInput("FEEDBACK").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("回饋量"),l("DELAY_TIME",1),l("RATE",.5),l("DEPTH",1),l("FEEDBACK",.5)):e==="compressor"?(this.appendValueInput("THRESHOLD").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("閾值(dB)"),this.appendValueInput("RATIO").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("壓縮比"),this.appendValueInput("ATTACK").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("啟動(s)"),this.appendValueInput("RELEASE").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("釋放(s)"),this.appendValueInput("MAKEUP").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("補償(dB)"),l("THRESHOLD",-20),l("RATIO",4),l("ATTACK",.01),l("RELEASE",.25),l("MAKEUP",0)):e==="limiter"?(this.appendValueInput("THRESHOLD").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("限制閾值"),this.appendValueInput("ATTACK").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("啟動(s)"),this.appendValueInput("RELEASE").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("釋放(s)"),l("THRESHOLD",-3),l("ATTACK",.001),l("RELEASE",.1)):e==="autofilter"?(this.appendValueInput("RATE").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("掃描速率"),this.appendValueInput("DEPTH").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("掃描範圍"),this.appendValueInput("FILTER_Q").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("Q值"),l("RATE",.5),l("DEPTH",20),l("FILTER_Q",.4)):e==="pitchmod"&&(this.appendDummyInput("MOD_TYPE").setAlign(Blockly.ALIGN_RIGHT).appendField("調變類型").appendField(new Blockly.FieldDropdown([["Jitter","NOISE"],["Vibrato","SINE"]]),"TYPE"),this.appendValueInput("RATE").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("速率"),this.appendValueInput("DEPTH").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT).appendField("深度"),l("RATE",5),l("DEPTH",10))}};window.SB_KEYS=window.SB_Utils.KEYS;window.getAvailableKeys=window.SB_Utils.getAvailableKeys;window.checkKeyConflicts=window.SB_Utils.checkKeyConflicts;window.createInstrumentField=window.SB_Utils.createInstrumentField;window.getChordDropdown=window.SB_Utils.getChordDropdown;(function(e){e.Msg=e.Msg||{},Object.assign(e.Msg,{HARMONYX_NEW:"建立新專案",HARMONYX_OPEN:"開啟專案",HARMONYX_SAVE:"儲存專案",HARMONYX_EXAMPLES:"範例專案",HARMONYX_RUN:"執行積木",HARMONYX_STOP:"停止執行",HARMONYX_SETTINGS:"系統設定",HARMONYX_UPDATE_CHECK:"檢查更新",HARMONYX_RESTART_AUDIO:"重啟音訊引擎",HARMONYX_LANG_SETTING:"語言 (Language)",BKY_TOOLBAR_SAVE_TOOLTIP:"儲存專案 (XML)",BKY_TOOLBAR_SAVE_AS_TOOLTIP:"另存專案",BKY_TOOLBAR_CLOSE_TOOLTIP:"關閉工作區",BKY_TOOLBAR_NEW_TOOLTIP:"建立新專案",BKY_TOOLBAR_OPEN_TOOLTIP:"開啟專案",CAT_STRUCTURE:"程式結構",CAT_LOGIC:"邏輯判斷",CAT_LOOPS:"迴圈控制",CAT_MATH:"數學運算",CAT_TEXT:"文字處理",CAT_LISTS:"列表處理",CAT_VARIABLES:"變數管理",CAT_FUNCTIONS:"自訂函式",CAT_TOOLS:"工具",CAT_LIVE_SHOW:"表演舞台",CAT_SOUND_SOURCES:"建立樂器",CAT_INSTRUMENT_CONTROL:"樂器控制",CAT_PERFORMANCE:"音樂演奏",CAT_MIDI:"MIDI 通訊",CAT_PC_KEY:"電腦鍵盤",CAT_SERIAL:"序列埠通訊",CAT_EFFECTS:"音訊效果器",CAT_UI:"介面控制",CAT_VISUAL:"視覺繪圖",CAT_SEARCH:"搜尋積木",SB_SETUP_EFFECT_MESSAGE:"設定效果器 類型 %1",SB_EFFECT_FILTER_TYPE_FIELD:"濾波器 (Filter)",SB_EFFECT_DELAY_TYPE_FIELD:"延遲 (Delay)",SB_EFFECT_BITCRUSH_TYPE_FIELD:"位元破壞 (BitCrush)",SB_EFFECT_WAVESHAPER_TYPE_FIELD:"波形塑形 (Waveshaper)",SB_EFFECT_COMPRESSOR_TYPE_FIELD:"壓縮器 (Compressor)",SB_EFFECT_LIMITER_TYPE_FIELD:"限制器 (Limiter)",SB_EFFECT_REVERB_TYPE_FIELD:"混響 (Reverb)",SB_EFFECT_FLANGER_TYPE_FIELD:"飛機音 (Flanger)",SB_EFFECT_AUTOFILTER_TYPE_FIELD:"自動濾波 (Auto-Filter)",SB_EFFECT_PITCHMOD_TYPE_FIELD:"音高調變 (Pitch-Mod)",SB_EFFECT_FILTER_INTERNAL_TYPE_FIELD:"模式",SB_EFFECT_MOD_TYPE_FIELD:"調變類型",SB_EFFECT_MOD_TYPE_JITTER:"抖動 (Jitter)",SB_EFFECT_MOD_TYPE_VIBRATO:"顫音 (Vibrato)",SB_EFFECT_FILTER_FREQ_FIELD:"頻率",SB_EFFECT_FILTER_Q_FIELD:"共振 (Q)",SB_EFFECT_DELAY_TIME_FIELD:"延遲時間 (秒)",SB_EFFECT_FEEDBACK_FIELD:"回饋 (Feedback)",SB_EFFECT_RATE_FIELD:"速率 (Hz)",SB_EFFECT_DEPTH_FIELD:"深度",SB_EFFECT_BITDEPTH_FIELD:"位元深度 (Bits)",SB_EFFECT_DISTORTION_AMOUNT_FIELD:"失真量",SB_EFFECT_ROOMSIZE_FIELD:"房間大小",SB_EFFECT_DAMPING_FIELD:"高頻吸收",SB_EFFECT_WET_FIELD:"濕度 (Wet)",SB_EFFECT_ROLLOFF_FIELD:"衰減",SB_EFFECT_THRESHOLD_FIELD:"門檻 (Threshold dB)",SB_EFFECT_RATIO_FIELD:"比率 (Ratio)",SB_EFFECT_ATTACK_FIELD:"啟動時間 (Attack s)",SB_EFFECT_RELEASE_FIELD:"釋放時間 (Release s)",SB_EFFECT_MAKEUP_FIELD:"增益補償 (Makeup dB)",SB_SETUP_EFFECT_TOOLTIP:"設定並套用音訊效果器。放在樂器容器內可設定該樂器效果；放在外面（如 setup 中）則作用於全域 Master 混音。支援多個效果器串接。",SB_SET_EFFECT_PARAM_TITLE:"更新效果器參數 樂器 %1 類型 %2",SB_SET_EFFECT_PARAM_PARAM:"參數 %1",SB_SET_EFFECT_PARAM_VALUE:"數值",SB_SET_EFFECT_PARAM_PAN_LABEL:"位置 (-1~1)",SB_UPDATE_ADSR_TITLE:"更新 ADSR 樂器 %1",SB_SET_EFFECT_PARAM_TOOLTIP:"即時更新指定樂器的效果器參數。",SB_UPDATE_ADSR_TOOLTIP:"即時更新指定樂器的 ADSR 包絡線設定。",SB_SELECT_INSTRUMENT_PROMPT:"(請選擇樂器)",SB_CURRENT_INSTRUMENT_OPTION:"當前選用的樂器",SB_NO_EFFECTS_AVAILABLE:"(無可用效果器)",SB_NO_INSTRUMENT_SELECTED:"(尚未選取樂器)",SB_ERROR_INSTRUMENT_NOT_FOUND:"找不到指定的樂器容器：%1",SB_ERROR_EFFECT_NOT_FOUND:"該樂器目前的設定中沒有此效果器：%1",SB_MINIM_INIT:"啟動 Minim 音訊引擎",SB_MINIM_INIT_TOOLTIP:"初始化 Minim 音訊引擎（應放於 setup 最上方）。",LIVE_SET_PARAM:"設定舞台參數 %1 為 %2",LIVE_GET_PARAM:"舞台參數 %1",SB_LOG_TO_SCREEN:"寫入舞台日誌 %1 類型 %2",SB_LOG_TYPE_INFO:"外接裝置資訊",SB_LOG_TYPE_MSG:"系統訊息",SB_LOG_TYPE_WARN:"警告",SB_LOG_TYPE_ERR:"錯誤",SB_LOG_TO_SCREEN_TOOLTIP:"將訊息輸出到舞台的控制台或警告區域。",LIVE_PARAM_WAVE_SCALE:"波形縮放 (waveScale)",LIVE_PARAM_TRAIL_ALPHA:"殘影透明度 (trailAlpha)",LIVE_PARAM_FG_HUE:"前景顏色 (fgHue)",LIVE_PARAM_MASTER_GAIN:"主音量 (masterGain)",LIVE_PARAM_TRANSPOSE:"移調 (pitchTranspose)",LIVE_PARAM_ADSR_A:"包絡線 A (adsrA)",LIVE_PARAM_ADSR_D:"包絡線 D (adsrD)",LIVE_PARAM_ADSR_S:"包絡線 S (adsrS)",LIVE_PARAM_ADSR_R:"包絡線 R (adsrR)",MATH_MAP_MESSAGE:"重新對應數值 %1 從 [ %2, %3 ] 到 [ %4, %5 ]",MATH_MAP_TOOLTIP:"將數值從一個範圍線性映射到另一個範圍。",SERIAL_INIT:"初始化序列埠 索引 %1 波特率 %2",SERIAL_AVAILABLE:"序列埠有新資料？",SERIAL_READ_STRING:"讀取字串直到換行",SERIAL_WRITE:"寫入序列埠 內容 %1",SERIAL_DATA_RECEIVED_TITLE:"當收到序列埠資料時",SERIAL_DATA_RECEIVED_VAR:"存入變數 %1",SERIAL_CHECK_MASK:"檢查位元遮罩 %1 是否包含鍵碼 %2",SB_SERIAL_CHECK_KEY_MASK_MESSAGE:"檢查資料 %1 中按鍵 %2 是否按下？",SB_SERIAL_CHECK_KEY_MASK_TOOLTIP:"解析序列埠按鍵資料。支援 'KEY:n' (單鍵編號，如 KEY:3) 或 'KEYS:n' (位元遮罩，如 KEYS:5 代表 1 與 3 鍵) 兩種格式。",TOOLS_COMMENT:"註解 %1",TOOLS_COMMENT_TOOLTIP:"在程式中加入多行文字註解，不會產生任何程式碼。",VISUAL_STAGE_SETUP_TITLE:"建立表演舞台",VISUAL_STAGE_SETUP_DIMENSIONS:"尺寸： 寬 %1 高 %2",VISUAL_STAGE_SETUP_APPEARANCE:"外觀： 背景 %1   前景 %2",VISUAL_STAGE_SETUP_SETTINGS:"設定： 波形 %1   |   頻譜 %2   |   日誌 %3   |   MIDI %4",VISUAL_STAGE_SET_COLOR:"設定舞台 %1 顏色為 %2",VISUAL_STAGE_SET_COLOR_TOOLTIP:"在 draw 迴圈或事件中動態改變舞台顏色。",VISUAL_SIZE:"設定畫布大小 寬 %1 高 %2",VISUAL_SIZE_TOOLTIP:"設定 Processing 執行視窗的大小。應放在 setup 中。",VISUAL_BACKGROUND:"設定背景顏色 %1",VISUAL_BACKGROUND_TOOLTIP:"清除畫面並填充背景顏色。",VISUAL_COLOR_PICKER_TOOLTIP:"選取一個顏色數值。",VISUAL_CONSTANT_WIDTH:"寬度 (width)",VISUAL_CONSTANT_HEIGHT:"高度 (height)",VISUAL_CONSTANT_MOUSE_X:"滑鼠 X (mouseX)",VISUAL_CONSTANT_MOUSE_Y:"滑鼠 Y (mouseY)",VISUAL_CONSTANT_TOOLTIP:"取得畫布的大小或滑鼠位置。",VISUAL_RECT:"繪製矩形 x %1 y %2 寬 %3 高 %4",VISUAL_RECT_TOOLTIP:"在指定座標繪製一個矩形。",VISUAL_ELLIPSE:"繪製圓形/橢圓 x %1 y %2 寬 %3 高 %4",VISUAL_ELLIPSE_TOOLTIP:"繪製一個圓形或橢圓形。",VISUAL_TRIANGLE:"繪製三角形 x1 %1 y1 %2 x2 %3 y2 %4 x3 %5 y3 %6",VISUAL_TRIANGLE_TOOLTIP:"在三個頂點之間繪製三角形。",VISUAL_LINE:"繪製直線 x1 %1 y1 %2 到 x2 %3 y2 %4",VISUAL_LINE_TOOLTIP:"在兩點之間繪製一條直線。",VISUAL_FILL:"設定填充顏色 %1",VISUAL_FILL_TOOLTIP:"設定填充顏色。",VISUAL_STROKE:"設定邊框顏色 %1",VISUAL_STROKE_TOOLTIP:"設定後續繪圖形狀的邊框顏色。",VISUAL_STROKE_WEIGHT:"設定邊框粗細 %1",VISUAL_STROKE_WEIGHT_TOOLTIP:"設定邊框的寬度（像素）。",VISUAL_ROTATE:"旋轉角度 %1 度",VISUAL_ROTATE_TOOLTIP:"旋轉座標系統（角度單位：度）。",VISUAL_TRANSLATE:"移動座標至 x %1 y %2",VISUAL_TRANSLATE_TOOLTIP:"平移原點位置。",VISUAL_PUSH_POP:"隔離座標與樣式變換 %1",VISUAL_PUSH_POP_TOOLTIP:"使用 pushMatrix/popMatrix 與 pushStyle/popStyle 隔離內部的變換與顏色設定。",VISUAL_SCALE:"縮放畫布 %1 倍",VISUAL_SCALE_TOOLTIP:"縮放後續繪圖的大小。",AUDIO_CREATE_SYNTH_INSTRUMENT:"建立合成器樂器 名稱 %1 類型 %2",AUDIO_CREATE_HARMONIC_SYNTH:"設定為諧波合成器",AUDIO_CREATE_ADDITIVE_SYNTH:"設定為加法合成器",SB_INSTRUMENT_CONTAINER_MESSAGE:"定義樂器 名稱 %1 %2",SB_INSTRUMENT_CONTAINER_TOOLTIP:"樂器定義容器。請在內部放置波形、ADSR 等設定積木。",SB_INSTRUMENT_CONTAINER_MULTI_SOURCE_WARN:"警告：一個樂器容器內只能有一個音源積木（波形、噪音、混合音源、取樣器、或合成器）。後方的積木將會覆寫前方的類型。",SB_SET_ADSR_MESSAGE:"設定 ADSR",SB_SET_ADSR_TOOLTIP:"設定此樂器的 ADSR 包絡線 (0.0 ~ 1.0+)。",SB_SET_ADSR_SAMPLER_WARN:"提示：旋律取樣器目前僅支援 Release (R) 餘韻設定，A/D/S 將被忽略以維持原音品質。",SB_SET_WAVE_MESSAGE:"設定波形 %1",SB_SET_WAVE_TOOLTIP:"設定此樂器的基本波形。",SB_SET_NOISE_MESSAGE:"設定噪聲 類型 %1",SB_SET_NOISE_TOOLTIP:"設定此樂器為噪聲產生器（常用於製作擊奏音效或背景氛圍）。",SB_MIXED_SOURCE_MESSAGE:"設定混合音源 波形 %1 + 噪音 %2 比例(噪音) %3",SB_MIXED_SOURCE_TOOLTIP:"同時混合基礎波形與隨機噪音，創造具備空氣感或質感的複雜音色。",SB_MIXED_SOURCE_JITTER:"抖動 (Jitter)",SB_MIXED_SOURCE_SWEEP_RATE:"掃頻速率",SB_MIXED_SOURCE_SWEEP_DEPTH:"掃頻深度",SB_SET_PANNING_MESSAGE:"設定樂器相位",SB_SET_PANNING_INST:"樂器",SB_SET_PANNING_VAL:"位置 (-1~1)",SB_SET_PANNING_TOOLTIP:"調整樂器在立體聲場中的位置。-1 為最左，1 為最右，0 為中間。",AUDIO_HARMONIC_FIELD:"%1 倍頻 振幅 (0-1)",AUDIO_ADDITIVE_FIELD:"波形 %1 頻率倍率 %2 振幅 %3",AUDIO_CREATE_MELODIC_SAMPLER:"設定取樣器(旋律) 聲音來源 %1",AUDIO_CREATE_DRUM_SAMPLER:"設定取樣器(打擊) 聲音來源 %1",AUDIO_SAMPLER_CUSTOM:"自訂路徑...",AUDIO_SAMPLER_PATH_FIELD:"路徑",AUDIO_MELODIC_SAMPLER_PIANO:"鋼琴",AUDIO_MELODIC_SAMPLER_VIOLIN_PIZZ:"小提琴 (撥奏)",AUDIO_MELODIC_SAMPLER_VIOLIN_ARCO:"小提琴 (拉奏)",AUDIO_MELODIC_SAMPLER_CUSTOM:"自訂路徑...",AUDIO_MELODIC_SAMPLER_TOOLTIP:"建立一個可變音高的取樣音源。會自動載入指定資料夾內的取樣並進行智慧變調演奏。",AUDIO_DRUM_SAMPLER_TOOLTIP:"載入打擊樂器樣本檔案 (WAV/MP3/AIFF)。",AUDIO_SELECT_INSTRUMENT:"選取目前樂器為 %1",AUDIO_SELECT_INSTRUMENT_TOOLTIP:"從目前工作區已定義的樂器清單中，選取一個作為目前演奏的樂器。",AUDIO_SET_INSTRUMENT_VOLUME:"設定樂器音量",AUDIO_SET_INSTRUMENT_VOLUME_INST:"樂器",AUDIO_SET_INSTRUMENT_VOLUME_VAL:"音量 %",AUDIO_SET_INSTRUMENT_VOLUME_TOOLTIP:"調整指定樂器的音量比例 (0-100)。",AUDIO_SELECT_INSTRUMENT_DROPDOWN:"(選取樂器)",AUDIO_SELECT_CHORD_DROPDOWN:"(選取和弦)",AUDIO_TRIGGER_SAMPLE:"演奏單音",AUDIO_TRIGGER_SAMPLE_INST:"樂器",AUDIO_TRIGGER_SAMPLE_NOTE:"音符",AUDIO_TRIGGER_SAMPLE_VEL:"力度",AUDIO_TRIGGER_SAMPLE_TOOLTIP:"演奏單一音符或擊奏。範例：'C4' (預設四分), 'X' (擊奏), 'C4H' (二分音符)。時值後綴：W(全), H(二分), Q(四分), E(八分), S(十六分)。",HELP_LANG_SUFFIX:"_zh-hant.html",HELP_HINT:`
按右鍵選擇「說明」了解更多用法。`,AUDIO_PLAY_NOTE:"演奏持續音高",AUDIO_PLAY_NOTE_INST:"樂器",AUDIO_PLAY_NOTE_PITCH:"音高",AUDIO_PLAY_NOTE_VEL:"力度",AUDIO_STOP_NOTE:"停止演奏音高",AUDIO_STOP_NOTE_INST:"樂器",AUDIO_STOP_NOTE_PITCH:"音高",AUDIO_PLAY_NOTE_TOOLTIP:"讓指定樂器開始播放一個持續音。音高支援 MIDI 編號 (如 60) 或音名 (如 'C4')。通常配合鍵盤或 MIDI 按下事件使用。",AUDIO_STOP_NOTE_TOOLTIP:"讓指定樂器停止播放特定音高。音高支援 MIDI 編號 (如 60) 或音名 (如 'C4')。通常配合鍵盤或 MIDI 放開事件使用。",AUDIO_PLAY_MELODY:"播放旋律",AUDIO_PLAY_MELODY_INST:"使用樂器",AUDIO_PLAY_MELODY_SCORE:"樂譜",AUDIO_PLAY_MELODY_TOOLTIP:"按照清單順序演奏。支援多行、音符 (C4, D4) 與和弦 (CM7, G7)。",AUDIO_TONE_LOOP:"每隔 %1 無限反覆演奏 %2",AUDIO_RHYTHM_SEQUENCE:"步進音序器",AUDIO_RHYTHM_SEQUENCE_INST:"樂器",AUDIO_RHYTHM_SEQUENCE_MODE:"模式",AUDIO_RHYTHM_SEQUENCE_MEASURE:"第 %1 小節",AUDIO_RHYTHM_SEQUENCE_PATTERN:"節奏",AUDIO_RHYTHM_SEQUENCE_VELOCITY:"力度",AUDIO_RHYTHM_V2_HEADER:"配置樂句 第 %1 小節 | 拍號 %2/%3 | 每拍切 %4 步",AUDIO_RHYTHM_V2_TRACK:"樂器 %1 力度 %2 模式 %3 節奏 %4",SB_RHYTHM_V2_CONTAINER:"音軌清單",SB_RHYTHM_V2_ITEM:"音軌",AUDIO_RHYTHM_MODE_MONO:"單音/打擊",AUDIO_RHYTHM_MODE_CHORD:"和弦",AUDIO_RHYTHM_SEQUENCE_TOOLTIP:"在指定小節演奏 16 格節奏。單音模式支援 x(觸發) 或 C4(音高)；和弦模式支援 Dm7 等自訂和弦名稱。",AUDIO_COUNT_IN:"演奏預備拍 %1 小節 拍號 %2 / %3 力度 %4",AUDIO_COUNT_IN_TOOLTIP:"在正式演奏前播放預備拍（節拍器聲音）。",AUDIO_SET_BPM:"設定演奏速度 (BPM) %1",AUDIO_SET_BPM_TOOLTIP:"設定全域演奏速度（每分鐘拍數）。",AUDIO_DEFINE_CHORD:"定義和弦 名稱 %1 音符列表 %2",AUDIO_DEFINE_CHORD_TOOLTIP:"定義一個自訂和弦名稱，可在旋律中使用。",AUDIO_PLAY_CHORD_BY_NAME:"播放和弦",AUDIO_PLAY_CHORD_BY_NAME_INST:"使用樂器",AUDIO_PLAY_CHORD_BY_NAME_DUR:"時值",AUDIO_PLAY_CHORD_BY_NAME_VEL:"力度",SB_PLAY_DRUM_MESSAGE:"演奏電子鼓 %1 力度 %2",SB_PLAY_DRUM_TOOLTIP:"播放電子鼓取樣音效 (Kick/Snare/HiHat/Clap)。",MIDI_ON_NOTE:"當收到 %1 MIDI 音符 ON %2 頻道 %3 鍵號 %4 力度 %5 %6 %7",MIDI_OFF_NOTE:"當收到 %1 MIDI 音符 OFF %2 頻道 %3 鍵號 %4 力度 %5 %6 %7",MIDI_ON_CONTROLLER_CHANGE:"當收到 %1 MIDI CC 訊號 %2 頻道 %3 號碼 %4 數值 %5 %6 %7",MIDI_ON_CONTROLLER_CHANGE_TOOLTIP:"監聽 MIDI 控制器變更 (Control Change, CC)。",MIDI_INIT:"啟動 MIDI %1 輸入 %2 輸出 %3",MIDI_INIT_TOOLTIP:"初始化 MidiBus 函式庫。輸入/輸出索引可從控制台列表查詢。",MIDI_SEND_NOTE:"向 %1 %2 傳送 MIDI 音符 %3 頻道 %4 鍵號 %5 力度 %6",MIDI_SEND_NOTE_TOOLTIP:"向 MIDI 輸出裝置傳送 Note On 或 Note Off 訊號。",MIDI_SEND_CC:"向 %1 傳送 MIDI CC 頻道 %2 號碼 %3 數值 %4",MIDI_SEND_CC_TOOLTIP:"向 MIDI 輸出裝置傳送控制器變更 (CC) 訊號。",MIDI_TYPE_ON:"開啟 (ON)",MIDI_TYPE_OFF:"關閉 (OFF)",MIDI_LP_XY_TO_NOTE:"Launchpad 座標轉鍵號 x %1 y %2",MIDI_LP_XY_TO_NOTE_TOOLTIP:"將 Launchpad S 的 X-Y 座標 (0-7) 轉換為對應的 MIDI 鍵號。座標 (0,0) 為左上角。",UI_KEY_EVENT:"當鍵盤 %1 鍵被 %2",UI_KEY_PRESSED:"按下",UI_KEY_RELEASED:"放開",UI_KEY_EVENT_TOOLTIP:"當偵測到特定按鍵被按下或放開時執行動作。鋼琴音階鍵在舞台啟動時無法自訂。",UI_INIT:"啟動 UI 系統 (ControlP5)",UI_INIT_TOOLTIP:"初始化 ControlP5 介面庫，以便建立滑桿與切換開關。",UI_ADD_SLIDER:"新增滑桿 %1 位置 x %2 y %3 寬 %4 高 %5 %6 範圍 %7 到 %8 初始值 %9 標籤 %10",UI_ADD_TOGGLE:"新增切換開關 名稱 %1 位置 x %2 y %3 初始狀態 %4 標籤 %5",UI_SET_FONT_SIZE:"設定 UI 字體大小 %1",VISUAL_NO_STROKE:"不繪製邊框",VISUAL_NO_FILL:"不填充顏色",VISUAL_PIXEL_DENSITY:"優化高解析度螢幕顯示 (pixelDensity)",VISUAL_PIXEL_DENSITY_TOOLTIP:"在高解析度螢幕（如 Retina）上開啟 2 倍渲染，讓線條更平滑。",VISUAL_FRAME_RATE:"設定每秒幀數 (frameRate) %1",VISUAL_FRAME_RATE_TOOLTIP:"設定 draw() 每秒執行的次數。預設為 60。",VISUAL_STAGE_SETUP_TOOLTIP:"初始化超級表演舞台（包含自動波形與 FFT）。",MIDI_ON_NOTE_TOOLTIP:"當外部 MIDI 裝置按下琴鍵時執行的動作。",MIDI_OFF_NOTE_TOOLTIP:"當外部 MIDI 裝置放開琴鍵時執行的動作。",AUDIO_TONE_LOOP_TOOLTIP:"持續循環執行內部的積木。反覆間隔 支援 1m, 2n, 4n 等符號。",AUDIO_PERFORM_ONCE:"演奏 %1",AUDIO_PERFORM_ONCE_TOOLTIP:"在背景執行緒執行一次內部的演奏積木，適合用於單次表演。多個演奏積木可同時進行多聲部合奏。",AUDIO_CREATE_HARMONIC_SYNTH_TOOLTIP:"設定此樂器為諧波合成器。",AUDIO_CREATE_ADDITIVE_SYNTH_TOOLTIP:"設定此樂器為加法合成器。",VISUAL_STAGE_BG:"背景",VISUAL_STAGE_WAVE:"波形",STRUCTURE_HUE:"#585858",LOGIC_HUE:"#b198de",LOOPS_HUE:"#7fcd81",MATH_HUE:"#5C68A6",LISTS_HUE:"#d1972b",TEXT_HUE:"#6a8871",VARIABLES_HUE:"#ef9a9a",FUNCTIONS_HUE:"#d22f73",TOOLS_HUE:"#585858",LIVE_SHOW_HUE:"#2C3E50",SOUND_SOURCES_HUE:"#016c8d",INSTRUMENT_CONTROL_HUE:"#FF5722",EFFECTS_HUE:"#8E44AD",PERFORMANCE_HUE:"#E67E22",MIDI_HUE:"#5B67E7",PC_KEY_HUE:"#2c3e50",SERIAL_HUE:"#2c3e50",UI_HUE:"#FFB300",VISUAL_HUE:"#3498DB",BKY_PROCESSING_SETUP_MSG_ANGEL:"當程式啟動時 (setup)",BKY_PROCESSING_DRAW_MSG_ANGEL:"重複執行 (draw)",STRUCTURE_FRAME_COUNT:"偵測幀數 (frameCount)",STRUCTURE_FRAME_COUNT_TOOLTIP:"取得自程式啟動後經過的畫面總數。",PROCESSING_SETUP_TOOLTIP:"setup() 在程式開始時執行一次。用於設定視窗大小、初始化樂器與變數。",PROCESSING_DRAW_TOOLTIP:"draw() 會不斷重複執行（預設每秒 60 次）。用於更新視覺動畫與處理即時互動。",MATH_IS_EVEN:"是偶數",MATH_IS_ODD:"是奇數",MATH_IS_WHOLE:"是整數",MATH_IS_POSITIVE:"是正數",MATH_IS_NEGATIVE:"是負數",MATH_IS_DIVISIBLE_BY:"可被整除",VISUAL_EXIT:"結束程式",VISUAL_EXIT_TOOLTIP:"立即關閉表演舞台並結束程式執行。",SB_WAIT_MUSICAL:"程式等待 %1 %2",SB_WAIT_UNIT_MS:"毫秒 (ms)",SB_WAIT_UNIT_S:"秒 (s)",SB_WAIT_UNIT_BEATS:"拍 (beats)",SB_WAIT_UNIT_MEASURES:"小節 (measures)",SB_WAIT_UNIT_MICROS:"微秒 (µs)",SB_WAIT_MUSICAL_TOOLTIP:"暫停程式執行一段時間。可以選擇以音樂節拍（拍、小節）或標準時間（秒、毫秒）為單位。",SB_MUSICAL_SECTION:"配置樂句 長度 %1 小節 %2 %3",SB_MUSICAL_SECTION_TOOLTIP:"用於配置一段樂句的容器。它會同時啟動內部的所有演奏，並等待指定的小節數結束後才繼續執行下一個積木。這能確保多個音軌同步開始，且樂句銜接精準。",AUDIO_IS_PLAYING:"是否有旋律在播放？",AUDIO_IS_PLAYING_TOOLTIP:"檢查背景旋律播放器是否仍在運作中。",AUDIO_WAIT_UNTIL_FINISHED:"等到所有演奏結束",AUDIO_WAIT_UNTIL_FINISHED_TOOLTIP:"暫停目前執行緒，直到背景所有旋律或循環演奏完畢。",BKY_CONTROLS_DO:"執行"})})(Blockly);const C={initSearch:e=>{const t={_cache:new Map,_searchTimeout:null,buildIndex:function(){this._cache.clear();const n=Object.keys(Blockly.Blocks),l=new Map;Object.keys(Blockly.Msg).forEach(s=>{l.set(s.toUpperCase(),String(Blockly.Msg[s]).toLowerCase())}),n.forEach(s=>{let o=s.toLowerCase();const i=Blockly.Blocks[s];if(!i)return;const a=s.toUpperCase();l.forEach((r,_)=>{(_.includes(a)||a.includes(_))&&(o+=" "+r)});for(let r=0;r<10;r++){const _=i["message"+r];_&&typeof _=="string"&&(o+=" "+_.replace(/%\d+/g,"").toLowerCase())}s.includes("set_")&&(o+=" 設定 set change"),s.includes("get_")&&(o+=" 取得 get read"),s.includes("play")&&(o+=" 演奏 播放 play music"),this._cache.set(s,o)})},inject:function(n){const l=document.getElementById("blocklyDiv"),s=document.querySelector(".blocklyToolboxDiv");if(!l||!s||document.getElementById("block-search-container"))return;const o=document.createElement("div");o.id="block-search-container",o.innerHTML=`
                    <input type="text" id="block-search" placeholder="搜尋積木..." autocomplete="off">
                    <img src="/icons/cancel_24dp_FE2F89.png" id="search-clear-btn" class="nyx-icon-neon" title="清除搜尋 (Esc)">
                `,l.appendChild(o);const i=document.getElementById("block-search"),a=document.getElementById("search-clear-btn"),r=()=>{const c=s.getBoundingClientRect();c.width>0&&(o.style.width=c.width+"px")};try{const c=new ResizeObserver(()=>r());c.observe(s);const u=document.querySelector(".blocklyTreeRoot");u&&c.observe(u)}catch(c){console.error("ResizeObserver failed:",c),window.addEventListener("resize",r)}const _=c=>{const u=n.getToolbox(),E=u?u.getFlyout():null;if(!E)return;if(!c){u&&u.clearSelection(),E.hide(),a&&(a.style.display="none");return}a&&(a.style.display="block");const p=[];c=c.toLowerCase(),this._cache.forEach((B,g)=>{B.includes(c)&&p.push(g)}),p.sort((B,g)=>(B.startsWith(c)?0:1)-(g.startsWith(c)?0:1));const f=p.slice(0,30);if(f.length>0){const B=f.map(g=>{const y=Blockly.utils.xml.createElement("block");return y.setAttribute("type",g),y});try{E.show(B),E.scrollToTop&&E.scrollToTop()}catch{}}else E.hide()};i.addEventListener("input",c=>{clearTimeout(this._searchTimeout);const u=c.target.value.trim();this._searchTimeout=setTimeout(()=>_(u),200)}),i.addEventListener("keydown",c=>{c.key==="Escape"&&(i.value="",_(""),i.blur()),c.stopPropagation()}),a&&(a.onclick=()=>{i.value="",_(""),i.focus()}),r()}};return setTimeout(()=>{t.buildIndex(),t.inject(e)},1500),t},initStagePanel:()=>{const e=document.getElementById("stage-panel"),t=document.getElementById("stage-toggle"),n=document.getElementById("log-container"),l=document.getElementById("clear-log-btn");t&&(t.onclick=()=>{e.classList.toggle("collapsed"),setTimeout(()=>window.dispatchEvent(new Event("resize")),310)}),l&&(l.onclick=()=>{n&&(n.innerHTML="")});const s=document.querySelectorAll(".tab-btn"),o=document.querySelectorAll(".tab-pane");return s.forEach(i=>{i.onclick=()=>{s.forEach(_=>{_.classList.remove("active");const c=_.querySelector("img");c&&(c.style.filter="")}),o.forEach(_=>_.classList.remove("active")),i.classList.add("active");const a=i.getAttribute("data-tab"),r=document.getElementById(a);r&&r.classList.add("active")}}),{clearLog:()=>{n&&(n.innerHTML="")},appendLog:(i,a="info")=>{if(!n)return;const r=document.createElement("div");r.className=`log-line log-${a}`,r.textContent=`[${new Date().toLocaleTimeString()}] ${i}`,n.appendChild(r),n.scrollTop=n.scrollHeight,n.childNodes.length>200&&n.removeChild(n.firstChild)}}},initMinimap:e=>{const t=window.PositionedMinimap||window.Minimap;if(t)try{new t(e).init();let l=document.getElementById("minimap-toggle");if(!l){l=document.createElement("div"),l.id="minimap-toggle",l.innerHTML='<img src="/icons/cancel_24dp_FE2F89.png" class="nyx-icon-purple">',l.title="切換小地圖 (Ctrl+M)";const i=document.getElementById("blocklyDiv");i&&i.appendChild(l)}const s=l.querySelector("img"),o=i=>{const a=document.querySelector(".blockly-minimap");a&&(i?(a.style.setProperty("display","none","important"),a.classList.add("collapsed"),s&&(s.src="/icons/public_24dp_FE2F89.png")):(a.style.setProperty("display","block","important"),a.classList.remove("collapsed"),s&&(s.src="/icons/cancel_24dp_FE2F89.png")))};l&&(l.onclick=()=>{const i=document.querySelector(".blockly-minimap"),a=i?i.style.display==="none"||i.classList.contains("collapsed"):!1;o(!a)}),document.addEventListener("keydown",i=>{if(i.ctrlKey&&(i.key==="m"||i.key==="M")){const a=document.querySelector(".blockly-minimap"),r=a?a.style.display==="none"||a.classList.contains("collapsed"):!1;o(!r)}})}catch(n){console.error("Minimap fail:",n)}},injectNaNShield:()=>{const e=Element.prototype.setAttribute;Element.prototype.setAttribute=function(t,n){(t==="x"||t==="y"||t==="width"||t==="height"||t==="d")&&(n==="NaN"||typeof n>"u")||e.apply(this,arguments)}}};/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Blocks.processing_setup={init:function(){this.appendDummyInput().appendField(Blockly.Msg.BKY_PROCESSING_SETUP_MSG_ANGEL||"當程式啟動時 (setup)"),this.appendStatementInput("DO").appendField(Blockly.Msg.BKY_CONTROLS_DO),this.setColour(Blockly.Msg.STRUCTURE_HUE||"#16A085"),this.setTooltip(Blockly.Msg.PROCESSING_SETUP_TOOLTIP),this.setHelpUrl("")}};Blockly.Blocks.processing_draw={init:function(){this.appendDummyInput().appendField(Blockly.Msg.BKY_PROCESSING_DRAW_MSG_ANGEL||"重複執行 (draw)"),this.appendStatementInput("DO").appendField(Blockly.Msg.BKY_CONTROLS_DO),this.setColour(Blockly.Msg.STRUCTURE_HUE||"#16A085"),this.setTooltip(Blockly.Msg.PROCESSING_DRAW_TOOLTIP),this.setHelpUrl("")}};Blockly.Blocks.processing_on_key_pressed={init:function(){this.appendDummyInput().appendField("當鍵盤按下時 (keyPressed)"),this.appendStatementInput("DO").appendField(Blockly.Msg.BKY_CONTROLS_DO),this.setColour(Blockly.Msg.STRUCTURE_HUE||"#16A085"),this.setTooltip("當使用者按下鍵盤時執行。可用 key 變數判斷按鍵。"),this.setHelpUrl("")}};Blockly.Blocks.processing_exit={init:function(){this.appendDummyInput().appendField(Blockly.Msg.VISUAL_EXIT||"結束程式"),this.setPreviousStatement(!0,null),this.setNextStatement(!0,null),this.setColour(Blockly.Msg.STRUCTURE_HUE||"#16A085"),this.setTooltip(Blockly.Msg.VISUAL_EXIT_TOOLTIP),this.setHelpUrl("")}};Blockly.defineBlocksWithJsonArray([{type:"processing_frame_count",message0:"%{BKY_STRUCTURE_FRAME_COUNT}",output:"Number",colour:"%{BKY_VISUAL_HUE}",tooltip:"%{BKY_STRUCTURE_FRAME_COUNT_TOOLTIP}"}]);/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.defineBlocksWithJsonArray([{type:"sb_harmonic_partial_container",message0:"%{BKY_SB_HARMONIC_PARTIAL_CONTAINER}",nextStatement:null,enableContextMenu:!1,colour:"#E74C3C"},{type:"sb_harmonic_partial_item",message0:"%{BKY_SB_HARMONIC_PARTIAL_ITEM}",previousStatement:null,nextStatement:null,enableContextMenu:!1,colour:"#E74C3C"},{type:"sb_additive_synth_container",message0:"%{BKY_SB_ADDITIVE_SYNTH_CONTAINER}",nextStatement:null,enableContextMenu:!1,colour:"#E74C3C"},{type:"sb_additive_synth_item",message0:"%{BKY_SB_ADDITIVE_SYNTH_ITEM}",previousStatement:null,nextStatement:null,enableContextMenu:!1,colour:"#E74C3C"},{type:"sb_minim_init",message0:"%{BKY_SB_MINIM_INIT}",previousStatement:null,nextStatement:null,colour:"%{BKY_SOUND_SOURCES_HUE}",tooltip:"%{BKY_SB_MINIM_INIT_TOOLTIP}%{BKY_HELP_HINT}",helpUrl:"sound_sources"},{type:"sb_set_wave",message0:"%{BKY_SB_SET_WAVE_MESSAGE}",args0:[{type:"field_dropdown",name:"TYPE",options:[["Sine","SINE"],["Square","SQUARE"],["Triangle","TRIANGLE"],["Sawtooth","SAW"]]}],previousStatement:null,nextStatement:null,colour:"%{BKY_SOUND_SOURCES_HUE}",tooltip:"%{BKY_SB_SET_WAVE_TOOLTIP}"},{type:"sb_set_noise",message0:"%{BKY_SB_SET_NOISE_MESSAGE}",args0:[{type:"field_dropdown",name:"TYPE",options:[["White","WHITE"],["Pink","PINK"],["Brown","BROWN"]]}],previousStatement:null,nextStatement:null,colour:"%{BKY_SOUND_SOURCES_HUE}",tooltip:"%{BKY_SB_SET_NOISE_TOOLTIP}"},{type:"sb_mixed_source",message0:"%{BKY_SB_MIXED_SOURCE_MESSAGE}",args0:[{type:"field_dropdown",name:"WAVE",options:[["Sine","SINE"],["Square","SQUARE"],["Triangle","TRIANGLE"],["Saw","SAW"]]},{type:"field_dropdown",name:"NOISE",options:[["White","WHITE"],["Pink","PINK"],["Brown","BROWN"]]},{type:"input_value",name:"LEVEL",check:"Number"}],previousStatement:null,nextStatement:null,colour:"%{BKY_SOUND_SOURCES_HUE}",tooltip:"%{BKY_SB_MIXED_SOURCE_TOOLTIP}"+Blockly.Msg.HELP_HINT,helpUrl:"mixed_source"},{type:"sb_create_harmonic_synth",message0:"%{BKY_AUDIO_CREATE_HARMONIC_SYNTH}",previousStatement:null,nextStatement:null,colour:"%{BKY_SOUND_SOURCES_HUE}",tooltip:"%{BKY_AUDIO_CREATE_HARMONIC_SYNTH_TOOLTIP}%{BKY_HELP_HINT}",mutator:"harmonic_mutator",helpUrl:"custom_synth"},{type:"sb_create_additive_synth",message0:"%{BKY_AUDIO_CREATE_ADDITIVE_SYNTH}",previousStatement:null,nextStatement:null,colour:"%{BKY_SOUND_SOURCES_HUE}",tooltip:"%{BKY_AUDIO_CREATE_ADDITIVE_SYNTH_TOOLTIP}%{BKY_HELP_HINT}",mutator:"additive_mutator",helpUrl:"custom_synth"}]);Blockly.Blocks.sb_drum_sampler={init:function(){this.jsonInit({type:"sb_drum_sampler",message0:"%{BKY_AUDIO_CREATE_DRUM_SAMPLER}",args0:[{type:"field_dropdown",name:"PATH",options:[["Kick","drum/kick.wav"],["Snare","drum/snare.wav"],["Rimshot","drum/rim.wav"],["Hi-Hat (Closed)","drum/ch.wav"],["Hi-Hat (Open)","drum/oh.wav"],["Tom (High)","drum/tom_hi.wav"],["Tom (Mid)","drum/tom_mid.wav"],["Tom (Low)","drum/tom_low.wav"],["Crash","drum/crash.wav"],["Ride","drum/ride.wav"],["Clap","drum/clap.wav"],["%{BKY_AUDIO_SAMPLER_CUSTOM}","CUSTOM"]]}],previousStatement:null,nextStatement:null,colour:"%{BKY_SOUND_SOURCES_HUE}",tooltip:"%{BKY_AUDIO_DRUM_SAMPLER_TOOLTIP}%{BKY_HELP_HINT}",helpUrl:"sound_sources",mutator:"drum_sampler_mutator"})}};Object.assign(Blockly.Blocks.sb_drum_sampler,window.SB_Utils.FIELD_HELPER);Blockly.Blocks.sb_melodic_sampler={init:function(){this.jsonInit({type:"sb_melodic_sampler",message0:"%{BKY_AUDIO_CREATE_MELODIC_SAMPLER}",args0:[{type:"field_dropdown",name:"TYPE",options:[["%{BKY_AUDIO_MELODIC_SAMPLER_PIANO}","PIANO"],["%{BKY_AUDIO_MELODIC_SAMPLER_VIOLIN_PIZZ}","VIOLIN_PIZZ"],["%{BKY_AUDIO_MELODIC_SAMPLER_VIOLIN_ARCO}","VIOLIN_ARCO"],["%{BKY_AUDIO_SAMPLER_CUSTOM}","CUSTOM"]]}],previousStatement:null,nextStatement:null,colour:"%{BKY_SOUND_SOURCES_HUE}",tooltip:"%{BKY_AUDIO_MELODIC_SAMPLER_TOOLTIP}%{BKY_HELP_HINT}",helpUrl:"sound_sources",mutator:"melodic_sampler_mutator"})}};Object.assign(Blockly.Blocks.sb_melodic_sampler,window.SB_Utils.FIELD_HELPER);Blockly.Blocks.sb_instrument_container={init:function(){this.appendDummyInput().appendField(Blockly.Msg.SB_INSTRUMENT_CONTAINER_MESSAGE.replace("%1","").replace("%2","").trim()).appendField(new Blockly.FieldTextInput("MySynth"),"NAME"),this.appendStatementInput("STACK").setCheck(null),this.setColour(Blockly.Msg.SOUND_SOURCES_HUE||"#E74C3C"),this.setTooltip(Blockly.Msg.SB_INSTRUMENT_CONTAINER_TOOLTIP)},onchange:function(){if(!this.workspace||this.isInFlyout)return;const e=["sb_set_wave","sb_set_noise","sb_mixed_source","sb_melodic_sampler","sb_drum_sampler","sb_create_harmonic_synth","sb_create_additive_synth"],n=this.getDescendants(!1).filter(s=>e.includes(s.type)&&s.isEnabled()),l=this.getSvgRoot();n.length>1?(this.setWarningText(Blockly.Msg.SB_INSTRUMENT_CONTAINER_MULTI_SOURCE_WARN),l&&l.classList.add("blockly-conflict-glow")):(this.setWarningText(null),l&&l.classList.remove("blockly-conflict-glow"))}};Blockly.Blocks.sb_set_adsr={init:function(){this.appendDummyInput().appendField(Blockly.Msg.SB_SET_ADSR_MESSAGE),this.appendValueInput("A").setCheck("Number").appendField("A (Attack)"),this.appendValueInput("D").setCheck("Number").appendField("D (Decay)"),this.appendValueInput("S").setCheck("Number").appendField("S (Sustain)"),this.appendValueInput("R").setCheck("Number").appendField("R (Release)"),this.setPreviousStatement(!0,null),this.setNextStatement(!0,null),this.setColour(Blockly.Msg.INSTRUMENT_CONTROL_HUE||"#E74C3C"),this.setTooltip(Blockly.Msg.SB_SET_ADSR_TOOLTIP)},onchange:function(){if(!this.workspace||this.isInFlyout)return;let e=this.getParent();for(;e&&e.type!=="sb_instrument_container";)e=e.getParent();e?e.getDescendants(!1).some(n=>n.type==="sb_melodic_sampler"&&n.isEnabled())?this.setWarningText(Blockly.Msg.SB_SET_ADSR_SAMPLER_WARN):this.setWarningText(null):this.setWarningText(null)}};Blockly.Extensions.registerMutator("harmonic_mutator",window.SB_Utils.HARMONIC_PARTIALS_MUTATOR,void 0,["sb_harmonic_partial_item"]);Blockly.Extensions.registerMutator("additive_mutator",window.SB_Utils.ADDITIVE_SYNTH_MUTATOR,void 0,["sb_additive_synth_item"]);Blockly.Extensions.registerMutator("melodic_sampler_mutator",window.SB_Utils.MELODIC_SAMPLER_MUTATOR,void 0);Blockly.Extensions.registerMutator("drum_sampler_mutator",window.SB_Utils.DRUM_SAMPLER_MUTATOR,void 0);/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Blocks.sb_setup_effect={init:function(){this.jsonInit({type:"sb_setup_effect",message0:(Blockly.Msg.SB_SETUP_EFFECT_MESSAGE||"配置 %1").replace("%1","%1").trim(),args0:[{type:"field_dropdown",name:"EFFECT_TYPE",options:[[Blockly.Msg.SB_EFFECT_FILTER_TYPE_FIELD||"Filter","filter"],[Blockly.Msg.SB_EFFECT_DELAY_TYPE_FIELD||"Delay","delay"],[Blockly.Msg.SB_EFFECT_BITCRUSH_TYPE_FIELD||"BitCrush","bitcrush"],[Blockly.Msg.SB_EFFECT_WAVESHAPER_TYPE_FIELD||"Waveshaper","waveshaper"],[Blockly.Msg.SB_EFFECT_REVERB_TYPE_FIELD||"Reverb","reverb"],[Blockly.Msg.SB_EFFECT_FLANGER_TYPE_FIELD||"Flanger","flanger"],[Blockly.Msg.SB_EFFECT_AUTOFILTER_TYPE_FIELD||"Auto-Filter","autofilter"],[Blockly.Msg.SB_EFFECT_PITCHMOD_TYPE_FIELD||"Pitch-Mod","pitchmod"],[Blockly.Msg.SB_EFFECT_COMPRESSOR_TYPE_FIELD||"Compressor","compressor"],[Blockly.Msg.SB_EFFECT_LIMITER_TYPE_FIELD||"Limiter","limiter"]]}],previousStatement:null,nextStatement:null,colour:Blockly.Msg.EFFECTS_HUE||"#8E44AD",tooltip:(Blockly.Msg.SB_SETUP_EFFECT_TOOLTIP||"")+Blockly.Msg.HELP_HINT,helpUrl:"effects",mutator:"setup_effect_mutator"}),this.setInputsInline(!1),this.updateShape_("filter")}};Object.assign(Blockly.Blocks.sb_setup_effect,window.SB_Utils.FIELD_HELPER);Blockly.Blocks.sb_set_instrument_volume={init:function(){this.appendDummyInput().appendField(Blockly.Msg.AUDIO_SET_INSTRUMENT_VOLUME).appendField(window.SB_Utils.createInstrumentField(Blockly.Msg.SB_SELECT_INSTRUMENT_PROMPT),"NAME"),this.appendValueInput("VOLUME").setCheck("Number").appendField((Blockly.Msg.AUDIO_SET_INSTRUMENT_VOLUME_VAL||"音量 %1").split("%")[0].trim()),this.setPreviousStatement(!0,null),this.setNextStatement(!0,null),this.setInputsInline(!0),this.setColour(Blockly.Msg.INSTRUMENT_CONTROL_HUE||"#D22F73"),this.setTooltip(Blockly.Msg.AUDIO_SET_INSTRUMENT_VOLUME_TOOLTIP)}};Blockly.Blocks.sb_set_panning={init:function(){this.appendDummyInput().appendField(Blockly.Msg.SB_SET_PANNING_MESSAGE).appendField(window.SB_Utils.createInstrumentField(Blockly.Msg.SB_SELECT_INSTRUMENT_PROMPT),"NAME"),this.appendValueInput("VALUE").setCheck("Number").appendField(Blockly.Msg.SB_SET_PANNING_VAL),this.setPreviousStatement(!0,null),this.setNextStatement(!0,null),this.setInputsInline(!0),this.setColour(Blockly.Msg.INSTRUMENT_CONTROL_HUE||"#D22F73"),this.setTooltip(Blockly.Msg.SB_SET_PANNING_TOOLTIP)}};Blockly.Blocks.sb_set_effect_param={init:function(){var e=this,t=function(){var n=[["ADSR","adsr"],[Blockly.Msg.SB_SET_PANNING_MESSAGE||"Panning","panning"]],l=e.getFieldValue("TARGET");if(!l||l===Blockly.Msg.SB_SELECT_INSTRUMENT_PROMPT)return[[Blockly.Msg.SB_NO_INSTRUMENT_SELECTED||"(No Instrument)","none"]];var s=e.workspace,o=s.getAllBlocks(!1),i=o.find(c=>c.type==="sb_instrument_container"&&c.getFieldValue("NAME")===l);if(i)for(var a=i.getInputTargetBlock("STACK");a;){if(a.type==="sb_setup_effect"){var r=a.getFieldValue("EFFECT_TYPE"),_=a.getField("EFFECT_TYPE").getText();n.find(c=>c[1]===r)||n.push([_,r])}a=a.getNextBlock()}return n};this.appendDummyInput().appendField((Blockly.Msg.SB_SET_EFFECT_PARAM_TITLE||"更新 %1 的 %2").split("%1")[0]).appendField(window.SB_Utils.createInstrumentField(Blockly.Msg.SB_SELECT_INSTRUMENT_PROMPT),"TARGET").appendField((Blockly.Msg.SB_SET_EFFECT_PARAM_TITLE||"更新 %1 的 %2").split("%2")[0].split("%1")[1]||"類型").appendField(new Blockly.FieldDropdown(t,function(n){this.sourceBlock_.updateShape_(n)}),"EFFECT_TYPE"),this.setPreviousStatement(!0,null),this.setNextStatement(!0,null),this.setColour(Blockly.Msg.EFFECTS_HUE||"#8E44AD"),this.setTooltip(Blockly.Msg.SB_SET_EFFECT_PARAM_TOOLTIP),this.updateShape_("panning")},mutationToDom:function(){var e=Blockly.utils.xml.createElement("mutation");return e.setAttribute("effect_type",this.getFieldValue("EFFECT_TYPE")),e},domToMutation:function(e){this.updateShape_(e.getAttribute("effect_type"))},updateShape_:function(e){this.getInput("PARAMS")&&this.removeInput("PARAMS"),this.getInput("VALUE")&&this.removeInput("VALUE");var t=this.appendDummyInput("PARAMS");e==="filter"?t.appendField((Blockly.Msg.SB_SET_EFFECT_PARAM_PARAM||"參數 %1").split("%1")[0]).appendField(new Blockly.FieldDropdown([[Blockly.Msg.SB_EFFECT_FILTER_FREQ_FIELD,"frequency"],[Blockly.Msg.SB_EFFECT_FILTER_Q_FIELD,"resonance"]]),"PARAM_NAME"):e==="adsr"?t.appendField((Blockly.Msg.SB_SET_EFFECT_PARAM_PARAM||"參數 %1").split("%1")[0]).appendField(new Blockly.FieldDropdown([["Attack (A)","adsrA"],["Decay (D)","adsrD"],["Sustain (S)","adsrS"],["Release (R)","adsrR"]]),"PARAM_NAME"):e==="reverb"?t.appendField((Blockly.Msg.SB_SET_EFFECT_PARAM_PARAM||"參數 %1").split("%1")[0]).appendField(new Blockly.FieldDropdown([[Blockly.Msg.SB_EFFECT_ROOMSIZE_FIELD,"roomSize"],[Blockly.Msg.SB_EFFECT_DAMPING_FIELD,"damping"],[Blockly.Msg.SB_EFFECT_WET_FIELD,"wet"]]),"PARAM_NAME"):e==="delay"?t.appendField((Blockly.Msg.SB_SET_EFFECT_PARAM_PARAM||"參數 %1").split("%1")[0]).appendField(new Blockly.FieldDropdown([[Blockly.Msg.SB_EFFECT_DELAY_TIME_FIELD,"delTime"],[Blockly.Msg.SB_EFFECT_FEEDBACK_FIELD,"delAmp"]]),"PARAM_NAME"):e==="bitcrush"?t.appendField((Blockly.Msg.SB_SET_EFFECT_PARAM_PARAM||"參數 %1").split("%1")[0]).appendField(new Blockly.FieldDropdown([[Blockly.Msg.SB_EFFECT_BITDEPTH_FIELD,"bitRes"]]),"PARAM_NAME"):e==="waveshaper"?t.appendField((Blockly.Msg.SB_SET_EFFECT_PARAM_PARAM||"參數 %1").split("%1")[0]).appendField(new Blockly.FieldDropdown([[Blockly.Msg.SB_EFFECT_DISTORTION_AMOUNT_FIELD,"amount"]]),"PARAM_NAME"):e==="compressor"?t.appendField((Blockly.Msg.SB_SET_EFFECT_PARAM_PARAM||"參數 %1").split("%1")[0]).appendField(new Blockly.FieldDropdown([[Blockly.Msg.SB_EFFECT_THRESHOLD_FIELD,"threshold"],[Blockly.Msg.SB_EFFECT_RATIO_FIELD,"ratio"],[Blockly.Msg.SB_EFFECT_ATTACK_FIELD,"attack"],[Blockly.Msg.SB_EFFECT_RELEASE_FIELD,"release"],[Blockly.Msg.SB_EFFECT_MAKEUP_FIELD,"makeup"]]),"PARAM_NAME"):e==="limiter"?t.appendField((Blockly.Msg.SB_SET_EFFECT_PARAM_PARAM||"參數 %1").split("%1")[0]).appendField(new Blockly.FieldDropdown([[Blockly.Msg.SB_EFFECT_THRESHOLD_FIELD,"threshold"],[Blockly.Msg.SB_EFFECT_ATTACK_FIELD,"attack"],[Blockly.Msg.SB_EFFECT_RELEASE_FIELD,"release"]]),"PARAM_NAME"):e==="flanger"?t.appendField((Blockly.Msg.SB_SET_EFFECT_PARAM_PARAM||"參數 %1").split("%1")[0]).appendField(new Blockly.FieldDropdown([[Blockly.Msg.SB_EFFECT_DELAY_TIME_FIELD,"delay"],[Blockly.Msg.SB_EFFECT_RATE_FIELD,"rate"],[Blockly.Msg.SB_EFFECT_DEPTH_FIELD,"depth"],[Blockly.Msg.SB_EFFECT_FEEDBACK_FIELD,"feedback"]]),"PARAM_NAME"):e==="autofilter"?t.appendField((Blockly.Msg.SB_SET_EFFECT_PARAM_PARAM||"參數 %1").split("%1")[0]).appendField(new Blockly.FieldDropdown([[Blockly.Msg.SB_EFFECT_RATE_FIELD,"rate"],[Blockly.Msg.SB_EFFECT_DEPTH_FIELD,"depth"],[Blockly.Msg.SB_EFFECT_FILTER_Q_FIELD,"resonance"]]),"PARAM_NAME"):e==="pitchmod"?t.appendField((Blockly.Msg.SB_SET_EFFECT_PARAM_PARAM||"參數 %1").split("%1")[0]).appendField(new Blockly.FieldDropdown([[Blockly.Msg.SB_EFFECT_RATE_FIELD,"rate"],[Blockly.Msg.SB_EFFECT_DEPTH_FIELD,"depth"]]),"PARAM_NAME"):e==="panning"&&t.appendField(Blockly.Msg.SB_SET_EFFECT_PARAM_PAN_LABEL||"相位 (Panning)"),this.appendValueInput("VALUE").setCheck("Number").appendField(Blockly.Msg.SB_SET_EFFECT_PARAM_VALUE||"數值")}};Blockly.Blocks.sb_update_adsr={init:function(){this.appendDummyInput().appendField((Blockly.Msg.SB_UPDATE_ADSR_TITLE||"更新 %1 的 ADSR").split("%1")[0]).appendField(window.SB_Utils.createInstrumentField(Blockly.Msg.SB_SELECT_INSTRUMENT_PROMPT),"TARGET"),this.appendValueInput("A").setCheck("Number").appendField("A"),this.appendValueInput("D").setCheck("Number").appendField("D"),this.appendValueInput("S").setCheck("Number").appendField("S"),this.appendValueInput("R").setCheck("Number").appendField("R"),this.setPreviousStatement(!0,null),this.setNextStatement(!0,null),this.setColour(Blockly.Msg.INSTRUMENT_CONTROL_HUE||"#D22F73"),this.setTooltip(Blockly.Msg.SB_UPDATE_ADSR_TOOLTIP)}};Blockly.Extensions.registerMutator("setup_effect_mutator",window.SB_Utils.SETUP_EFFECT_MUTATOR,void 0);/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.defineBlocksWithJsonArray([{type:"sb_rhythm_v2_container",message0:"%{BKY_SB_RHYTHM_V2_CONTAINER}",nextStatement:null,enableContextMenu:!1,colour:"#E67E22"},{type:"sb_rhythm_v2_item",message0:"%{BKY_SB_RHYTHM_V2_ITEM}",previousStatement:null,nextStatement:null,enableContextMenu:!1,colour:"#E67E22"},{type:"sb_play_drum",message0:"%{BKY_SB_PLAY_DRUM_MESSAGE}",args0:[{type:"field_dropdown",name:"TYPE",options:[["Kick","KICK"],["Snare","SNARE"],["Hi-Hat (Closed)","CH"],["Hi-Hat (Open)","OH"],["Clap","CLAP"]]},{type:"input_value",name:"VELOCITY",check:"Number"}],previousStatement:null,nextStatement:null,inputsInline:!0,colour:"%{BKY_PERFORMANCE_HUE}",tooltip:"%{BKY_SB_PLAY_DRUM_TOOLTIP}"},{type:"sb_transport_count_in",message0:"%{BKY_AUDIO_COUNT_IN}",args0:[{type:"input_value",name:"MEASURES",check:"Number"},{type:"input_value",name:"BEATS",check:"Number"},{type:"input_value",name:"BEAT_UNIT",check:"Number"},{type:"input_value",name:"VELOCITY",check:"Number"}],previousStatement:null,nextStatement:null,inputsInline:!0,colour:"%{BKY_PERFORMANCE_HUE}",tooltip:"%{BKY_AUDIO_COUNT_IN_TOOLTIP}"},{type:"sb_transport_set_bpm",message0:"%{BKY_AUDIO_SET_BPM}",args0:[{type:"input_value",name:"BPM",check:"Number"}],previousStatement:null,nextStatement:null,colour:"%{BKY_PERFORMANCE_HUE}",tooltip:"%{BKY_AUDIO_SET_BPM_TOOLTIP}"},{type:"sb_tone_loop",message0:"%{BKY_AUDIO_TONE_LOOP}",args0:[{type:"field_input",name:"INTERVAL",text:"1m"},{type:"input_statement",name:"DO"}],colour:"%{BKY_PERFORMANCE_HUE}",tooltip:"%{BKY_AUDIO_TONE_LOOP_TOOLTIP}",hat:!0},{type:"sb_perform",message0:"%{BKY_AUDIO_PERFORM_ONCE}",args0:[{type:"input_statement",name:"DO"}],colour:"%{BKY_PERFORMANCE_HUE}",tooltip:"%{BKY_AUDIO_PERFORM_ONCE_TOOLTIP}",hat:!0},{type:"sb_define_chord",message0:"%{BKY_AUDIO_DEFINE_CHORD}",args0:[{type:"field_input",name:"NAME",text:"CM7"},{type:"field_input",name:"NOTES",text:"C4,E4,G4,B4"}],previousStatement:null,nextStatement:null,colour:"%{BKY_PERFORMANCE_HUE}",tooltip:"%{BKY_AUDIO_DEFINE_CHORD_TOOLTIP}",helpUrl:"melody"},{type:"sb_audio_is_playing",message0:"%{BKY_AUDIO_IS_PLAYING}",output:"Boolean",colour:"%{BKY_PERFORMANCE_HUE}",tooltip:"%{BKY_AUDIO_IS_PLAYING_TOOLTIP}"},{type:"sb_wait_until_finished",message0:"%{BKY_AUDIO_WAIT_UNTIL_FINISHED}",previousStatement:null,nextStatement:null,colour:"%{BKY_PERFORMANCE_HUE}",tooltip:"%{BKY_AUDIO_WAIT_UNTIL_FINISHED_TOOLTIP}"},{type:"sb_wait_musical",message0:"%{BKY_SB_WAIT_MUSICAL}",args0:[{type:"input_value",name:"VALUE",check:"Number"},{type:"field_dropdown",name:"UNIT",options:[["%{BKY_SB_WAIT_UNIT_BEATS}","BEATS"],["%{BKY_SB_WAIT_UNIT_MEASURES}","MEASURES"],["%{BKY_SB_WAIT_UNIT_S}","SECONDS"],["%{BKY_SB_WAIT_UNIT_MS}","MS"],["%{BKY_SB_WAIT_UNIT_MICROS}","MICROS"]]}],previousStatement:null,nextStatement:null,colour:"%{BKY_PERFORMANCE_HUE}",tooltip:"%{BKY_SB_WAIT_MUSICAL_TOOLTIP}"},{type:"sb_musical_section",message0:"%{BKY_SB_MUSICAL_SECTION}",args0:[{type:"input_value",name:"DURATION",check:"Number"},{type:"input_dummy"},{type:"input_statement",name:"STACK"}],previousStatement:null,nextStatement:null,colour:"%{BKY_PERFORMANCE_HUE}",tooltip:"%{BKY_SB_MUSICAL_SECTION_TOOLTIP}"}]);Blockly.Blocks.sb_rhythm_sequencer_v2={init:function(){this.jsonInit({type:"sb_rhythm_sequencer_v2",message0:"%{BKY_AUDIO_RHYTHM_V2_HEADER}",args0:[{type:"field_input",name:"MEASURE",text:"1"},{type:"field_input",name:"BEATS",text:"4"},{type:"field_input",name:"DENOMINATOR",text:"4"},{type:"field_input",name:"RESOLUTION",text:"4"}],previousStatement:null,nextStatement:null,colour:"%{BKY_PERFORMANCE_HUE}",mutator:"rhythm_v2_mutator"})}};Blockly.Blocks.sb_play_note={init:function(){this.appendDummyInput().appendField(Blockly.Msg.AUDIO_PLAY_NOTE).appendField(window.SB_Utils.createInstrumentField(Blockly.Msg.SB_SELECT_INSTRUMENT_PROMPT),"NAME"),this.appendValueInput("PITCH").setCheck(["Number","String"]).appendField(Blockly.Msg.AUDIO_PLAY_NOTE_PITCH),this.appendValueInput("VELOCITY").setCheck("Number").appendField(Blockly.Msg.AUDIO_PLAY_NOTE_VEL),this.setPreviousStatement(!0,null),this.setNextStatement(!0,null),this.setInputsInline(!0),this.setColour("#D35400"),this.setTooltip(Blockly.Msg.AUDIO_PLAY_NOTE_TOOLTIP)}};Blockly.Blocks.sb_stop_note={init:function(){this.appendDummyInput().appendField(Blockly.Msg.AUDIO_STOP_NOTE).appendField(window.SB_Utils.createInstrumentField(Blockly.Msg.SB_SELECT_INSTRUMENT_PROMPT),"NAME"),this.appendValueInput("PITCH").setCheck(["Number","String"]).appendField(Blockly.Msg.AUDIO_STOP_NOTE_PITCH),this.setPreviousStatement(!0,null),this.setNextStatement(!0,null),this.setInputsInline(!0),this.setColour("#D35400"),this.setTooltip(Blockly.Msg.AUDIO_STOP_NOTE_TOOLTIP)}};Blockly.Blocks.sb_select_current_instrument={init:function(){this.appendDummyInput().appendField(Blockly.Msg.AUDIO_SELECT_INSTRUMENT.replace("%1","").trim()).appendField(window.SB_Utils.createInstrumentField(Blockly.Msg.SB_SELECT_INSTRUMENT_PROMPT),"NAME"),this.setPreviousStatement(!0,null),this.setNextStatement(!0,null),this.setColour(Blockly.Msg.PERFORMANCE_HUE||"#D22F73"),this.setTooltip(Blockly.Msg.AUDIO_SELECT_INSTRUMENT_TOOLTIP)}};Blockly.Blocks.sb_trigger_sample={init:function(){this.appendDummyInput().appendField(Blockly.Msg.AUDIO_TRIGGER_SAMPLE).appendField(window.SB_Utils.createInstrumentField(Blockly.Msg.SB_SELECT_INSTRUMENT_PROMPT),"NAME"),this.appendDummyInput().appendField(Blockly.Msg.AUDIO_TRIGGER_SAMPLE_NOTE).appendField(new Blockly.FieldTextInput("C4Q"),"NOTE"),this.appendValueInput("VELOCITY").setCheck("Number").appendField(Blockly.Msg.AUDIO_TRIGGER_SAMPLE_VEL),this.setPreviousStatement(!0,null),this.setNextStatement(!0,null),this.setInputsInline(!0),this.setColour(Blockly.Msg.PERFORMANCE_HUE||"#E67E22"),this.setTooltip(Blockly.Msg.AUDIO_TRIGGER_SAMPLE_TOOLTIP)}};Blockly.Blocks.sb_play_chord_by_name={init:function(){this.appendDummyInput().appendField(Blockly.Msg.AUDIO_PLAY_CHORD_BY_NAME).appendField(window.SB_Utils.createInstrumentField(Blockly.Msg.SB_SELECT_INSTRUMENT_PROMPT),"INST_NAME").appendField(new Blockly.FieldTextInput("CM7"),"NAME"),this.appendValueInput("DUR").setCheck(["Number","String"]).appendField(Blockly.Msg.AUDIO_PLAY_CHORD_BY_NAME_DUR),this.appendValueInput("VELOCITY").setCheck("Number").appendField(Blockly.Msg.AUDIO_PLAY_CHORD_BY_NAME_VEL),this.setPreviousStatement(!0,null),this.setNextStatement(!0,null),this.setInputsInline(!0),this.setColour(Blockly.Msg.PERFORMANCE_HUE||"#E67E22"),this.setTooltip(Blockly.Msg.AUDIO_PLAY_CHORD_BY_NAME_TOOLTIP)}};Blockly.Blocks.sb_play_melody={init:function(){this.appendDummyInput().appendField(Blockly.Msg.AUDIO_PLAY_MELODY).appendField(window.SB_Utils.createInstrumentField(Blockly.Msg.SB_SELECT_INSTRUMENT_PROMPT),"INSTRUMENT"),this.appendDummyInput().appendField(Blockly.Msg.AUDIO_PLAY_MELODY_SCORE).appendField(new window.FieldMultilineInput("C4Q, E4Q, G4H"),"MELODY"),this.setPreviousStatement(!0,null),this.setNextStatement(!0,null),this.setColour(Blockly.Msg.PERFORMANCE_HUE||"#E67E22"),this.setTooltip(Blockly.Msg.AUDIO_PLAY_MELODY_TOOLTIP)}};Blockly.Blocks.sb_rhythm_sequence={init:function(){var e=(Blockly.Msg.AUDIO_RHYTHM_SEQUENCE_MEASURE||"第 %1 小節").split("%1");this.appendDummyInput().appendField(Blockly.Msg.AUDIO_RHYTHM_SEQUENCE).appendField(window.SB_Utils.createInstrumentField(Blockly.Msg.SB_SELECT_INSTRUMENT_PROMPT),"SOURCE").appendField(Blockly.Msg.AUDIO_RHYTHM_SEQUENCE_MODE||"Mode").appendField(new Blockly.FieldDropdown([[Blockly.Msg.AUDIO_RHYTHM_MODE_MONO,"FALSE"],[Blockly.Msg.AUDIO_RHYTHM_MODE_CHORD,"TRUE"]]),"CHORD_MODE"),this.appendValueInput("MEASURE").setCheck("Number").appendField(e[0]||""),this.appendDummyInput().appendField(e[1]||"").appendField(Blockly.Msg.AUDIO_RHYTHM_SEQUENCE_PATTERN).appendField(new Blockly.FieldTextInput("x--- x--- x--- x---"),"PATTERN"),this.appendValueInput("VELOCITY").setCheck("Number").appendField(Blockly.Msg.AUDIO_RHYTHM_SEQUENCE_VELOCITY),this.setPreviousStatement(!0,null),this.setNextStatement(!0,null),this.setInputsInline(!0),this.setColour(Blockly.Msg.PERFORMANCE_HUE||"#E67E22"),this.setTooltip(Blockly.Msg.AUDIO_RHYTHM_SEQUENCE_TOOLTIP)}};Blockly.Extensions.registerMutator("rhythm_v2_mutator",window.SB_Utils.RHYTHM_V2_MUTATOR,void 0,["sb_rhythm_v2_item"]);/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.defineBlocksWithJsonArray([{type:"visual_size",message0:"%{BKY_VISUAL_SIZE}",args0:[{type:"field_number",name:"WIDTH",value:800,min:100},{type:"field_number",name:"HEIGHT",value:600,min:100}],previousStatement:null,nextStatement:null,colour:"#3498DB",tooltip:"%{BKY_VISUAL_SIZE_TOOLTIP}"},{type:"visual_background",message0:"%{BKY_VISUAL_BACKGROUND}",args0:[{type:"input_value",name:"COLOR"}],inputsInline:!0,previousStatement:null,nextStatement:null,colour:"#3498DB",tooltip:"%{BKY_VISUAL_BACKGROUND_TOOLTIP}"},{type:"visual_color_picker",message0:"%1",args0:[{type:"field_colour",name:"COLOR",colour:"#ff0000"}],output:null,colour:"#3498DB",tooltip:"%{BKY_VISUAL_COLOR_PICKER_TOOLTIP}"},{type:"visual_constant",message0:"%1",args0:[{type:"field_dropdown",name:"CONSTANT",options:[["%{BKY_VISUAL_CONSTANT_WIDTH}","width"],["%{BKY_VISUAL_CONSTANT_HEIGHT}","height"],["%{BKY_VISUAL_CONSTANT_MOUSE_X}","mouseX"],["%{BKY_VISUAL_CONSTANT_MOUSE_Y}","mouseY"]]}],output:"Number",colour:"#3498DB",tooltip:"%{BKY_VISUAL_CONSTANT_TOOLTIP}"},{type:"visual_pixel_density",message0:"%{BKY_VISUAL_PIXEL_DENSITY}",previousStatement:null,nextStatement:null,colour:"#3498DB",tooltip:"%{BKY_VISUAL_PIXEL_DENSITY_TOOLTIP}"},{type:"visual_frame_rate",message0:"%{BKY_VISUAL_FRAME_RATE}",args0:[{type:"input_value",name:"FPS",check:"Number"}],previousStatement:null,nextStatement:null,colour:"#3498DB",tooltip:"%{BKY_VISUAL_FRAME_RATE_TOOLTIP}"},{type:"visual_stage_set_color",message0:"%{BKY_VISUAL_STAGE_SET_COLOR}",args0:[{type:"field_dropdown",name:"TARGET",options:[["%{BKY_VISUAL_STAGE_BG}","BG"],["%{BKY_VISUAL_STAGE_WAVE}","WAVE"]]},{type:"input_value",name:"COLOR"}],previousStatement:null,nextStatement:null,colour:"#2C3E50",tooltip:"%{BKY_VISUAL_STAGE_SET_COLOR_TOOLTIP}"}]);Blockly.Blocks.visual_stage_setup={init:function(){this.jsonInit({message0:"%{BKY_VISUAL_STAGE_SETUP_TITLE}",args0:[],message1:"%{BKY_VISUAL_STAGE_SETUP_DIMENSIONS}",args1:[{type:"field_number",name:"W",value:1200},{type:"field_number",name:"H",value:400}],message2:"%{BKY_VISUAL_STAGE_SETUP_APPEARANCE}",args2:[{type:"field_colour",name:"BG_COLOR",colour:"#000000"},{type:"field_colour",name:"FG_COLOR",colour:"#FF0096"}],previousStatement:null,nextStatement:null,colour:"#2C3E50",tooltip:"%{BKY_VISUAL_STAGE_SETUP_TOOLTIP}%{BKY_HELP_HINT}",helpUrl:window.docsBaseUri+"visual_stage"+(Blockly.Msg.HELP_LANG_SUFFIX||"_zh-hant.html")}),this.setInputsInline(!1)}};/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.defineBlocksWithJsonArray([{type:"visual_rect",message0:"%{BKY_VISUAL_RECT}",args0:[{type:"input_value",name:"X"},{type:"input_value",name:"Y"},{type:"input_value",name:"W"},{type:"input_value",name:"H"}],previousStatement:null,nextStatement:null,colour:"#3498DB",tooltip:"%{BKY_VISUAL_RECT_TOOLTIP}"},{type:"visual_ellipse",message0:"%{BKY_VISUAL_ELLIPSE}",args0:[{type:"input_value",name:"X"},{type:"input_value",name:"Y"},{type:"input_value",name:"W"},{type:"input_value",name:"H"}],previousStatement:null,nextStatement:null,colour:"#3498DB",tooltip:"%{BKY_VISUAL_ELLIPSE_TOOLTIP}"},{type:"visual_triangle",message0:"%{BKY_VISUAL_TRIANGLE}",args0:[{type:"input_value",name:"X1"},{type:"input_value",name:"Y1"},{type:"input_value",name:"X2"},{type:"input_value",name:"Y2"},{type:"input_value",name:"X3"},{type:"input_value",name:"Y3"}],previousStatement:null,nextStatement:null,colour:"#3498DB",tooltip:"%{BKY_VISUAL_TRIANGLE_TOOLTIP}"},{type:"visual_line",message0:"%{BKY_VISUAL_LINE}",args0:[{type:"input_value",name:"X1"},{type:"input_value",name:"Y1"},{type:"input_value",name:"X2"},{type:"input_value",name:"Y2"}],previousStatement:null,nextStatement:null,colour:"#3498DB",tooltip:"%{BKY_VISUAL_LINE_TOOLTIP}"},{type:"visual_fill",message0:"%{BKY_VISUAL_FILL}",args0:[{type:"input_value",name:"COLOR"}],inputsInline:!0,previousStatement:null,nextStatement:null,colour:"#3498DB",tooltip:"%{BKY_VISUAL_FILL_TOOLTIP}"},{type:"visual_stroke",message0:"%{BKY_VISUAL_STROKE}",args0:[{type:"input_value",name:"COLOR"}],inputsInline:!0,previousStatement:null,nextStatement:null,colour:"#3498DB",tooltip:"%{BKY_VISUAL_STROKE_TOOLTIP}"},{type:"visual_stroke_weight",message0:"%{BKY_VISUAL_STROKE_WEIGHT}",args0:[{type:"input_value",name:"WEIGHT"}],previousStatement:null,nextStatement:null,colour:"#3498DB",tooltip:"%{BKY_VISUAL_STROKE_WEIGHT_TOOLTIP}"},{type:"visual_no_stroke",message0:"%{BKY_VISUAL_NO_STROKE}",previousStatement:null,nextStatement:null,colour:"#3498DB"},{type:"visual_no_fill",message0:"%{BKY_VISUAL_NO_FILL}",previousStatement:null,nextStatement:null,colour:"#3498DB"}]);/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.defineBlocksWithJsonArray([{type:"visual_rotate",message0:"%{BKY_VISUAL_ROTATE}",args0:[{type:"input_value",name:"ANGLE",check:"Number"}],previousStatement:null,nextStatement:null,colour:"#3498DB",tooltip:"%{BKY_VISUAL_ROTATE_TOOLTIP}"},{type:"visual_translate",message0:"%{BKY_VISUAL_TRANSLATE}",args0:[{type:"input_value",name:"X"},{type:"input_value",name:"Y"}],previousStatement:null,nextStatement:null,colour:"#3498DB",tooltip:"%{BKY_VISUAL_TRANSLATE_TOOLTIP}"},{type:"visual_push_pop",message0:"%{BKY_VISUAL_PUSH_POP}",args0:[{type:"input_statement",name:"STACK"}],previousStatement:null,nextStatement:null,colour:"#3498DB",tooltip:"%{BKY_VISUAL_PUSH_POP_TOOLTIP}"},{type:"visual_scale",message0:"%{BKY_VISUAL_SCALE}",args0:[{type:"input_value",name:"S",check:"Number"}],previousStatement:null,nextStatement:null,colour:"#3498DB",tooltip:"%{BKY_VISUAL_SCALE_TOOLTIP}"}]);/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.defineBlocksWithJsonArray([{type:"live_set_param",message0:"%{BKY_LIVE_SET_PARAM}",args0:[{type:"field_dropdown",name:"PARAM",options:[["%{BKY_LIVE_PARAM_WAVE_SCALE}","waveScale"],["%{BKY_LIVE_PARAM_TRAIL_ALPHA}","trailAlpha"],["%{BKY_LIVE_PARAM_FG_HUE}","fgHue"],["%{BKY_LIVE_PARAM_MASTER_GAIN}","masterGain"],["%{BKY_LIVE_PARAM_TRANSPOSE}","pitchTranspose"],["%{BKY_LIVE_PARAM_ADSR_A}","adsrA"],["%{BKY_LIVE_PARAM_ADSR_D}","adsrD"],["%{BKY_LIVE_PARAM_ADSR_S}","adsrS"],["%{BKY_LIVE_PARAM_ADSR_R}","adsrR"]]},{type:"input_value",name:"VALUE",check:"Number"}],previousStatement:null,nextStatement:null,colour:"#2C3E50",tooltip:"即時改變舞台視覺或音訊參數。按右鍵選擇「說明」查看數值範圍。"},{type:"live_get_param",message0:"%{BKY_LIVE_GET_PARAM}",args0:[{type:"field_dropdown",name:"PARAM",options:[["%{BKY_LIVE_PARAM_WAVE_SCALE}","waveScale"],["%{BKY_LIVE_PARAM_TRAIL_ALPHA}","trailAlpha"],["%{BKY_LIVE_PARAM_FG_HUE}","fgHue"],["%{BKY_LIVE_PARAM_MASTER_GAIN}","masterGain"],["%{BKY_LIVE_PARAM_TRANSPOSE}","pitchTranspose"]]}],output:"Number",colour:"#2C3E50",tooltip:"讀取目前的舞台參數數值。"},{type:"sb_log_to_screen",message0:"%{BKY_SB_LOG_TO_SCREEN}",args0:[{type:"input_value",name:"MSG"},{type:"field_dropdown",name:"TYPE",options:[["%{BKY_SB_LOG_TYPE_INFO}","INFO"],["%{BKY_SB_LOG_TYPE_MSG}","MSG"],["%{BKY_SB_LOG_TYPE_WARN}","WARN"],["%{BKY_SB_LOG_TYPE_ERR}","ERR"]]}],previousStatement:null,nextStatement:null,colour:"#2C3E50",tooltip:"%{BKY_SB_LOG_TO_SCREEN_TOOLTIP}"}]);/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.defineBlocksWithJsonArray([{type:"midi_init",message0:"%{BKY_MIDI_INIT}",args0:[{type:"field_input",name:"NAME",text:"MIDI_1"},{type:"field_input",name:"INPUT",text:"0"},{type:"field_input",name:"OUTPUT",text:"0"}],previousStatement:null,nextStatement:null,colour:"#5B67E7",tooltip:"%{BKY_MIDI_INIT_TOOLTIP}",helpUrl:window.docsBaseUri+"launchpad"+(Blockly.Msg.HELP_LANG_SUFFIX||"_zh-hant.html")},{type:"midi_on_note",message0:"%{BKY_MIDI_ON_NOTE}",args0:[{type:"field_input",name:"BUS_NAME",text:"MIDI_1"},{type:"input_dummy"},{type:"field_variable",name:"CHANNEL",variable:"channel"},{type:"field_variable",name:"PITCH",variable:"pitch"},{type:"field_variable",name:"VELOCITY",variable:"velocity"},{type:"input_dummy"},{type:"input_statement",name:"DO"}],colour:"#5B67E7",tooltip:"%{BKY_MIDI_ON_NOTE_TOOLTIP}",helpUrl:window.docsBaseUri+"launchpad"+(Blockly.Msg.HELP_LANG_SUFFIX||"_zh-hant.html"),hat:!0},{type:"midi_off_note",message0:"%{BKY_MIDI_OFF_NOTE}",args0:[{type:"field_input",name:"BUS_NAME",text:"MIDI_1"},{type:"input_dummy"},{type:"field_variable",name:"CHANNEL",variable:"channel"},{type:"field_variable",name:"PITCH",variable:"pitch"},{type:"field_variable",name:"VELOCITY",variable:"velocity"},{type:"input_dummy"},{type:"input_statement",name:"DO"}],colour:"#5B67E7",tooltip:"%{BKY_MIDI_OFF_NOTE_TOOLTIP}",helpUrl:window.docsBaseUri+"launchpad"+(Blockly.Msg.HELP_LANG_SUFFIX||"_zh-hant.html"),hat:!0},{type:"midi_on_controller_change",message0:"%{BKY_MIDI_ON_CONTROLLER_CHANGE}",args0:[{type:"field_input",name:"BUS_NAME",text:"MIDI_1"},{type:"input_dummy"},{type:"field_variable",name:"CHANNEL",variable:"channel"},{type:"field_variable",name:"NUMBER",variable:"number"},{type:"field_variable",name:"VALUE",variable:"value"},{type:"input_dummy"},{type:"input_statement",name:"DO"}],colour:"#5B67E7",tooltip:"%{BKY_MIDI_ON_CONTROLLER_CHANGE_TOOLTIP}",helpUrl:window.docsBaseUri+"launchpad"+(Blockly.Msg.HELP_LANG_SUFFIX||"_zh-hant.html"),hat:!0},{type:"midi_send_note",message0:"%{BKY_MIDI_SEND_NOTE}",args0:[{type:"field_input",name:"BUS_NAME",text:"MIDI_1"},{type:"input_dummy"},{type:"field_dropdown",name:"TYPE",options:[["%{BKY_MIDI_TYPE_ON}","ON"],["%{BKY_MIDI_TYPE_OFF}","OFF"]]},{type:"input_value",name:"CHANNEL",check:"Number"},{type:"input_value",name:"PITCH",check:"Number"},{type:"input_value",name:"VELOCITY",check:"Number"}],inputsInline:!0,previousStatement:null,nextStatement:null,colour:"#5B67E7",tooltip:"%{BKY_MIDI_SEND_NOTE_TOOLTIP}",helpUrl:window.docsBaseUri+"launchpad"+(Blockly.Msg.HELP_LANG_SUFFIX||"_zh-hant.html")},{type:"midi_send_cc",message0:"%{BKY_MIDI_SEND_CC}",args0:[{type:"field_input",name:"BUS_NAME",text:"MIDI_1"},{type:"input_value",name:"CHANNEL",check:"Number"},{type:"input_value",name:"NUMBER",check:"Number"},{type:"input_value",name:"VALUE",check:"Number"}],inputsInline:!0,previousStatement:null,nextStatement:null,colour:"#5B67E7",tooltip:"%{BKY_MIDI_SEND_CC_TOOLTIP}",helpUrl:window.docsBaseUri+"launchpad"+(Blockly.Msg.HELP_LANG_SUFFIX||"_zh-hant.html")},{type:"midi_lp_xy_to_note",message0:"%{BKY_MIDI_LP_XY_TO_NOTE}",args0:[{type:"input_value",name:"X",check:"Number"},{type:"input_value",name:"Y",check:"Number"}],output:"Number",inputsInline:!0,colour:"#5B67E7",tooltip:"%{BKY_MIDI_LP_XY_TO_NOTE_TOOLTIP}",helpUrl:"launchpad"}]);/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.defineBlocksWithJsonArray([{type:"serial_init",message0:"%{BKY_SERIAL_INIT}",args0:[{type:"field_number",name:"INDEX",value:0,min:0},{type:"field_dropdown",name:"BAUD",options:[["9600","9600"],["19200","19200"],["38400","38400"],["57600","57600"],["115200","115200"]]}],previousStatement:null,nextStatement:null,colour:"#2c3e50",tooltip:"啟動與 Arduino 的通訊。索引 0 通常是第一個接上的裝置。"},{type:"serial_available",message0:"%{BKY_SERIAL_AVAILABLE}",output:"Boolean",colour:"#2c3e50",tooltip:"檢查序列埠緩衝區是否有新資料。"},{type:"serial_read_string",message0:"%{BKY_SERIAL_READ_STRING}",output:"String",colour:"#2c3e50",tooltip:"從序列埠讀取文字直到遇到換行符號。"},{type:"sb_serial_write",message0:"%{BKY_SERIAL_WRITE}",args0:[{type:"input_value",name:"CONTENT"}],previousStatement:null,nextStatement:null,colour:"#2c3e50",tooltip:"寫入資料到序列埠 (Send)"},{type:"sb_serial_data_received",message0:"%{BKY_SERIAL_DATA_RECEIVED_TITLE}",message1:"%{BKY_SERIAL_DATA_RECEIVED_VAR}",args1:[{type:"field_variable",name:"DATA",variable:"serial_data"}],message2:"%1",args2:[{type:"input_statement",name:"DO"}],colour:"#2c3e50",tooltip:"當序列埠收到以換行符號結尾的資料時，自動執行內部的程式碼。"},{type:"serial_check_mask",message0:"%{BKY_SERIAL_CHECK_MASK}",args0:[{type:"input_value",name:"MASK",check:"Number"},{type:"field_number",name:"KEY",value:1,min:1}],output:"Boolean",inputsInline:!0,colour:"#2c3e50",tooltip:"用於判斷位元遮罩中特定的按鍵是否被按下。"},{type:"sb_serial_check_key_mask",message0:"%{BKY_SB_SERIAL_CHECK_KEY_MASK_MESSAGE}",args0:[{type:"input_value",name:"DATA",check:"String"},{type:"field_number",name:"KEY",value:1,min:1}],output:"Boolean",inputsInline:!0,colour:"#2c3e50",tooltip:"%{BKY_SB_SERIAL_CHECK_KEY_MASK_TOOLTIP}"}]);/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */delete Blockly.Blocks.math_number_property;Blockly.defineBlocksWithJsonArray([{type:"math_number_property",message0:"%1 %2",args0:[{type:"input_value",name:"NUMBER_TO_CHECK",check:"Number"},{type:"field_dropdown",name:"PROPERTY",options:[["%{BKY_MATH_IS_EVEN}","EVEN"],["%{BKY_MATH_IS_ODD}","ODD"],["%{BKY_MATH_IS_WHOLE}","WHOLE"],["%{BKY_MATH_IS_POSITIVE}","POSITIVE"],["%{BKY_MATH_IS_NEGATIVE}","NEGATIVE"],["%{BKY_MATH_IS_DIVISIBLE_BY}","DIVISIBLE_BY"]]}],inputsInline:!0,output:"Boolean",style:"math_blocks",tooltip:"%{BKY_MATH_IS_TOOLTIP}",mutator:"math_is_divisibleby_mutator"},{type:"math_map",message0:"%{BKY_MATH_MAP_MESSAGE}",args0:[{type:"input_value",name:"VALUE"},{type:"input_value",name:"FROM_LOW"},{type:"input_value",name:"FROM_HIGH"},{type:"input_value",name:"TO_LOW"},{type:"input_value",name:"TO_HIGH"}],output:"Number",colour:"#5C68A6",tooltip:"%{BKY_MATH_MAP_TOOLTIP}"}]);/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Blocks.ui_key_event={init:function(){this.appendDummyInput().appendField(Blockly.Msg.UI_KEY_EVENT.split("%1")[0]).appendField(new Blockly.FieldDropdown(()=>window.getAvailableKeys(this)),"KEY").appendField(Blockly.Msg.UI_KEY_EVENT.split("%1")[1].split("%2")[0]).appendField(new Blockly.FieldDropdown([[Blockly.Msg.UI_KEY_PRESSED,"PRESSED"],[Blockly.Msg.UI_KEY_RELEASED,"RELEASED"]]),"MODE").appendField(Blockly.Msg.UI_KEY_EVENT.split("%2")[1]||"").appendField(new Blockly.FieldLabel(""),"CONFLICT_LABEL"),this.appendStatementInput("DO").setCheck(null).appendField(Blockly.Msg.BKY_CONTROLS_DO),this.setColour("#2c3e50"),this.setTooltip(Blockly.Msg.UI_KEY_EVENT_TOOLTIP)}};Blockly.defineBlocksWithJsonArray([{type:"ui_init",message0:"%{BKY_UI_INIT}",previousStatement:null,nextStatement:null,colour:"#FFB300",tooltip:"%{BKY_UI_INIT_TOOLTIP}"},{type:"ui_add_slider",message0:"%{BKY_UI_ADD_SLIDER}",args0:[{type:"field_input",name:"VAR",text:"masterGain"},{type:"field_number",name:"X",value:820},{type:"field_number",name:"Y",value:130},{type:"field_number",name:"W",value:150},{type:"field_number",name:"H",value:20},{type:"input_dummy"},{type:"field_number",name:"MIN",value:-40},{type:"field_number",name:"MAX",value:6},{type:"field_number",name:"VAL",value:-10},{type:"field_input",name:"LABEL",text:"GAIN"}],previousStatement:null,nextStatement:null,colour:"#FFB300"},{type:"ui_add_toggle",message0:"%{BKY_UI_ADD_TOGGLE}",args0:[{type:"field_input",name:"VAR",text:"isMidiMode"},{type:"field_number",name:"X",value:820},{type:"field_number",name:"Y",value:30},{type:"field_checkbox",name:"STATE",checked:!0},{type:"field_input",name:"LABEL",text:"MODE"}],previousStatement:null,nextStatement:null,colour:"#FFB300"},{type:"ui_set_font_size",message0:"%{BKY_UI_SET_FONT_SIZE}",args0:[{type:"field_number",name:"SIZE",value:20,min:8,max:60}],previousStatement:null,nextStatement:null,colour:"#FFB300"}]);/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.defineBlocksWithJsonArray([{type:"sb_comment",message0:"%{BKY_TOOLS_COMMENT}",args0:[{type:"field_multilinetext",name:"TEXT",text:""}],previousStatement:null,nextStatement:null,colour:"#6a8871",tooltip:"%{BKY_TOOLS_COMMENT_TOOLTIP}"}]);Blockly.defineBlocksWithJsonArray([{type:"wc_text_print",message0:"%{BKY_WC_TEXT_PRINT}",args0:[{type:"input_value",name:"TEXT"}],previousStatement:null,nextStatement:null,colour:"%{BKY_TEXT_HUE}",tooltip:"%{BKY_WC_TEXT_PRINT_TOOLTIP}"}]);window.SB_JavaLibs=window.SB_JavaLibs||{};window.SB_JavaLibs.AUDIO_CLASSES=`
  class SBSummer extends ddf.minim.ugens.Summer {
    protected void uGenerate(float[] channels) { super.uGenerate(channels); }
  }

  class SBPan extends ddf.minim.ugens.Summer {
    float panPos = 0; // -1.0 to 1.0
    SBPan(float p) { super(); panPos = p; }
    void setLastValue(float val) { panPos = val; }
    protected void uGenerate(float[] channels) {
      super.uGenerate(channels);
      if (channels.length == 2) {
        float v = (channels[0] + channels[1]) * 0.5f; 
        channels[0] = v * Math.max(0, Math.min(1, 1.0f - panPos));
        channels[1] = v * Math.max(0, Math.min(1, 1.0f + panPos));
      }
    }
  }

  class SBWaveshaper extends SBSummer {
    float amount = 1.0f;
    SBWaveshaper() { super(); }
    void setAmount(float a) { amount = a; }
    protected void uGenerate(float[] channels) {
      super.uGenerate(channels);
      for(int i=0; i<channels.length; i++) {
        channels[i] = (float)Math.tanh(channels[i] * amount);
      }
    }
  }

  class SBReverb extends SBSummer {
    float roomSize = 0.5f; float damping = 0.5f; float wet = 0.3f;
    float[] c1, c2, c3, c4; int p1, p2, p3, p4;
    float[] a1, a2; int ap1, ap2;
    SBReverb() { 
      super(); 
      c1 = new float[1116]; c2 = new float[1188]; c3 = new float[1277]; c4 = new float[1356];
      a1 = new float[556]; a2 = new float[441];
    }
    void setParams(float rs, float d, float w) { roomSize = rs * 0.9f; damping = d * 0.4f; wet = w; }
    protected void uGenerate(float[] channels) {
      super.uGenerate(channels);
      for(int i=0; i<channels.length; i++) {
        float in = channels[i]; float out = 0;
        float o1 = c1[p1]; c1[p1] = in + o1 * roomSize; p1 = (p1+1)%c1.length;
        float o2 = c2[p2]; c2[p2] = in + o2 * roomSize; p2 = (p2+1)%c2.length;
        float o3 = c3[p3]; c3[p3] = in + o3 * roomSize; p3 = (p3+1)%c3.length;
        float o4 = c4[p4]; c4[p4] = in + o4 * roomSize; p4 = (p4+1)%c4.length;
        out = (o1 + o2 + o3 + o4) * 0.25f;
        float v1 = a1[ap1]; float tr1 = -0.5f * out + v1; a1[ap1] = out + 0.5f * v1; ap1 = (ap1+1)%a1.length; out = tr1;
        float v2 = a2[ap2]; float tr2 = -0.5f * out + v2; a2[ap2] = out + 0.5f * v2; ap2 = (ap2+1)%a2.length; out = tr2;
        channels[i] = channels[i] * (1.0f - wet) + out * wet;
      }
    }
  }

  class SBCompressor extends SBSummer {
    float threshold = 1.0f; float ratio = 1.0f; float attack = 0.01f; float release = 0.1f; float makeup = 1.0f; float env = 0.0f;
    private float attackCoef, releaseCoef;
    SBCompressor() { super(); setParams(-20, 1, 0.01f, 0.1f, 0); }
    void setParams(float tDB, float r, float a, float re, float mDB) {
      threshold = (float)Math.pow(10, tDB/20.0f); ratio = r; attack = a; release = re; makeup = (float)Math.pow(10, mDB/20.0f);
      attackCoef = (float)Math.exp(-1.0/(44100.0*attack));
      releaseCoef = (float)Math.exp(-1.0/(44100.0*release));
    }
    protected void uGenerate(float[] channels) {
      super.uGenerate(channels); 
      for(int i=0; i<channels.length; i++) {
        float absIn = Math.abs(channels[i]);
        env = (absIn > env) ? attackCoef * env + (1.0f - attackCoef) * absIn : releaseCoef * env + (1.0f - releaseCoef) * absIn;
        float gain = 1.0f;
        if (env > threshold) { gain = (threshold + (env - threshold) / ratio) / (env + 0.00001f); }
        channels[i] *= gain * makeup;
      }
    }
  }

  class MelodicSampler {
    TreeMap<Integer, Sampler> samples = new TreeMap<Integer, Sampler>();
    TreeMap<Integer, TickRate> rates = new TreeMap<Integer, TickRate>();
    TreeMap<Integer, ADSR> adsrs = new TreeMap<Integer, ADSR>();
    SBSummer localMixer = new SBSummer();
    Minim m; String instName;
    MelodicSampler(Minim minim, String name) { this.m = minim; this.instName = name; checkMainMixer(); localMixer.patch(getInstrumentMixer(instName)); }
    void loadSamples(String folder) {
      File dir = new File(dataPath(folder)); if (!dir.exists()) return;
      File[] files = dir.listFiles(); if (files == null) return;
      for (File f : files) {
        String fullName = f.getName(); String upperName = fullName.toUpperCase();
        if (upperName.endsWith(".MP3") || upperName.endsWith(".WAV")) {
          String noteName = fullName.substring(0, fullName.lastIndexOf('.'));
          int midi = noteToMidi(noteName);
          if (midi >= 0) {
            Sampler s = new Sampler(folder + "/" + fullName, 10, m); TickRate tr = new TickRate(1.f);
            ADSR a = new ADSR(1.0, 0.001f, 0.001f, 1.0f, 0.5f); tr.setInterpolation(true);
            s.patch(tr).patch(a).patch(localMixer); samples.put(midi, s); rates.put(midi, tr); adsrs.put(midi, a);
          }
        }
      }
    }
    ADSR trigger(int midi, float amp, float r) {
      if (samples.isEmpty()) return null;
      Integer closest = samples.floorKey(midi); if (closest == null) closest = samples.ceilingKey(midi);
      Sampler src = samples.get(closest); TickRate tr = rates.get(closest); ADSR a = adsrs.get(closest);
      if (src != null && tr != null && a != null) {
        float rate = (float)Math.pow(2.0, (midi - closest) / 12.0); tr.value.setLastValue(rate);
        a.setParameters(amp, 0.001f, 0.001f, 1.0f, r, 0, 0); a.noteOn(); src.trigger(); return a;
      }
      return null;
    }
  }
`;window.SB_JavaLibs.AUDIO_HELPERS=`
  void checkMainMixer() {
    if (minim == null) minim = new Minim(this);
    if (out == null) out = minim.getLineOut(Minim.STEREO); 
    if (mainMixer == null) {
      mainMixer = new SBSummer(); masterEffectEnd = mainMixer; masterGainUGen = new Gain(0.f);
      masterEffectEnd.patch(masterGainUGen).patch(out); getInstrumentMixer("default");
    }
  }

  ddf.minim.ugens.Summer getInstrumentMixer(String name) {
    checkMainMixer();
    if (instrumentMixers.containsKey(name)) return (ddf.minim.ugens.Summer)instrumentMixers.get(name);
    SBSummer s = new SBSummer(); SBPan p = new SBPan(0.f); s.patch(p); p.patch(mainMixer);
    instrumentMixers.put(name, s); instrumentPans.put(name, p); instrumentEffectEnds.put(name, s);
    return s;
  }

  void playBuiltinDrum(String type, float vel) {
    checkMainMixer(); String instName = "_builtin_" + type;
    if (!samplerMap.containsKey(instName)) {
      String path = "drum/";
      if (type.equals("KICK")) path += "kick.wav"; else if (type.equals("SNARE")) path += "snare.wav";
      else if (type.equals("CH")) path += "ch.wav"; else if (type.equals("OH")) path += "oh.wav";
      else if (type.equals("CLAP")) path += "clap.wav"; else return;
      Sampler s = new Sampler(path, 20, minim); Gain g = new Gain(0.f);
      s.patch(g).patch(getInstrumentMixer(instName));
      samplerMap.put(instName, s); samplerGainMap.put(instName, g); instrumentMap.put(instName, "DRUM");
    }
    Sampler s = samplerMap.get(instName); Gain g = samplerGainMap.get(instName);
    if (s != null && g != null) { g.setValue(map(vel, 0, 127, -40, 0)); s.trigger(); }
  }

  void updateFilter(String name, float freq, float q) {
    Object obj = instrumentFilters.get(name);
    if (obj != null) {
      try {
        java.lang.reflect.Field fField = obj.getClass().getField("frequency");
        Object freqControl = fField.get(obj); java.lang.reflect.Field valField = freqControl.getClass().getField("value");
        valField.setFloat(freqControl, freq);
        java.lang.reflect.Field rField = obj.getClass().getField("resonance");
        Object resControl = rField.get(obj); java.lang.reflect.Field rValField = resControl.getClass().getField("value");
        rValField.setFloat(resControl, constrain(q, 0.0f, 0.9f));
      } catch (Exception e) { try { obj.getClass().getMethod("setFreq", float.class).invoke(obj, freq); } catch(Exception ex) {} }
    }
  }

  void updatePanning(String name, float p) {
    Object obj = instrumentPans.get(name);
    if (obj != null) {
      try {
        java.lang.reflect.Field f = obj.getClass().getField("pan");
        Object control = f.get(obj); java.lang.reflect.Method m = control.getClass().getMethod("setLastValue", float.class);
        m.invoke(control, constrain(p, -1.0f, 1.0f));
      } catch (Exception e) {}
    }
  }

  void playNoteInternal(String instName, int p, float vel) {
    if (instName == null || instName.length() == 0) instName = currentInstrument;
    if (p < 0) return; String key = instName + "_" + p;
    if (activeNotes.containsKey(key)) stopNoteInternal(instName, p);
    float masterAmp = map(vel, 0, 127, 0, 0.5f); masterAmp *= instrumentVolumes.getOrDefault(instName, 1.0f);
    float[] adsr = instrumentADSR.get(instName);
    if (adsr == null) adsr = new float[]{defAdsrA, defAdsrD, defAdsrS, defAdsrR};
    String type = instrumentMap.getOrDefault(instName, "TRIANGLE");
    if (type.equals("MELODIC_SAMPLER")) {
      MelodicSampler ms = melodicSamplers.get(instName);
      if (ms != null) {
        ADSR env = ms.trigger(p, masterAmp, adsr[3]);
        if (env != null) { activeNotes.put(key, env); if (instName.equals(currentInstrument) && !instName.equals("")) { adsrTimer = millis(); adsrState = 1; } }
      } return;
    }
    if (type.equals("DRUM")) {
      if (samplerMap.containsKey(instName)) {
        float volScale = instrumentVolumes.getOrDefault(instName, 1.0f);
        ((ddf.minim.ugens.Gain)samplerGainMap.get(instName)).setValue(map(vel * volScale, 0, 127, -40, 0));
        ((ddf.minim.ugens.Sampler)samplerMap.get(instName)).trigger();
      } return;
    }
    float baseFreq = mtof((float)p); ADSR env = new ADSR(1.0, adsr[0], adsr[1], adsr[2], adsr[3]);
    SBSummer noteMixer = new SBSummer(); 
    if (type.equals("HARMONIC")) {
      float[] partials = harmonicPartials.get(instName);
      if (partials != null) { for (int i = 0; i < partials.length; i++) { if (partials[i] > 0) { Oscil osc = new Oscil(baseFreq * (i + 1), partials[i] * masterAmp, Waves.SINE); osc.patch(noteMixer); } } }
      noteMixer.patch(env);
    } else if (type.equals("ADDITIVE")) {
      List<SynthComponent> configs = additiveConfigs.get(instName);
      if (configs != null) { for (SynthComponent comp : configs) { Oscil osc = new Oscil(baseFreq * comp.ratio, comp.amp * masterAmp, getWaveform(comp.waveType)); osc.patch(noteMixer); } }
      noteMixer.patch(env);
    } else if (type.equals("MIXED")) {
      String cfg = (String)instrumentMixConfigs.getOrDefault(instName, "SINE,WHITE,30,0,0,0");
      String[] parts = split(cfg, ",");
      if (parts.length >= 6) {
        String wType = parts[0]; String nType = parts[1]; float nRatio = float(parts[2]) / 100.0f; float jitter = float(parts[3]);
        float sRate = float(parts[4]); float sDepth = float(parts[5]) / 100.0f;
        Oscil wave = new Oscil(0, masterAmp * (1.0f - nRatio), getWaveform(wType));
        Summer freqSum = new SBSummer(); new Constant(baseFreq).patch(freqSum);
        if (jitter > 0) { new Noise(jitter * 2.0f, Noise.Tint.WHITE).patch(freqSum); }
        freqSum.patch(wave.frequency);
        Noise.Tint tint = nType.equals("PINK") ? Noise.Tint.PINK : nType.equals("BROWN") ? Noise.Tint.BROWN : Noise.Tint.WHITE;
        Noise n = new Noise(masterAmp * nRatio, tint); wave.patch(noteMixer); n.patch(noteMixer);
        if (sDepth > 0) {
          MoogFilter sweepF = new MoogFilter(0, 0.3f); Summer sweepSum = new SBSummer(); new Constant(baseFreq * 4.0f).patch(sweepSum);
          Oscil lfo = new Oscil(sRate, baseFreq * sDepth * 3.0f, Waves.SINE); lfo.patch(sweepSum).patch(sweepF.frequency);
          noteMixer.patch(sweepF).patch(env);
        } else noteMixer.patch(env);
      } else noteMixer.patch(env);
    } else { Oscil wave = new Oscil(baseFreq, masterAmp, getWaveform(type)); wave.patch(env); }
    env.patch(getInstrumentMixer(instName)); env.noteOn(); activeNotes.put(key, env);
    if (instName.equals(currentInstrument) && !instName.equals("")) { adsrTimer = millis(); adsrState = 1; }
  }

  void stopNoteInternal(String instName, int p) {
    if (instName == null || instName.length() == 0) instName = currentInstrument;
    String key = instName + "_" + p; ADSR adsr = activeNotes.get(key);
    if (adsr != null) {
      adsr.unpatchAfterRelease(getInstrumentMixer(instName)); adsr.noteOff(); activeNotes.remove(key);
      if (instName.equals(currentInstrument) && !instName.equals("")) { adsrTimer = millis(); adsrState = 2; }
    }
  }

  void updateInstrumentUISync() {
    if (!currentInstrument.equals(lastInstrument)) {
      if (!lastInstrument.equals("")) instrumentADSR.put(lastInstrument, new float[]{adsrA, adsrD, adsrS, adsrR});
      float[] params = instrumentADSR.get(currentInstrument);
      if (params == null) params = new float[]{defAdsrA, defAdsrD, defAdsrS, defAdsrR};
      adsrA = params[0]; adsrD = params[1]; adsrS = params[2]; adsrR = params[3];
      if (cp5 != null) {
        if (cp5.getController("adsrA") != null) cp5.getController("adsrA").setValue(adsrA);
        if (cp5.getController("adsrD") != null) cp5.getController("adsrD").setValue(adsrD);
        if (cp5.getController("adsrS") != null) cp5.getController("adsrS").setValue(adsrS);
        if (cp5.getController("adsrR") != null) cp5.getController("adsrR").setValue(adsrR);
      }
      adsrState = 0; logToScreen("Instrument Switched: " + currentInstrument, 1); lastInstrument = currentInstrument;
    }
  }

  void playNoteForDuration(final String instName, int p, float vel, final float durationMs) {
    if (p < 0) return; playNoteInternal(instName, p, vel); final int pitch = p;
    new Thread(new Runnable() { public void run() { try { Thread.sleep((long)durationMs); } catch (Exception e) {} stopNoteInternal(instName, pitch); } }).start();
  }

  void playChordByNameInternal(String instName, String name, float durationMs, float vel) {
    if (instName == null || instName.length() == 0 || instName.equals("(請選擇樂器)")) instName = currentInstrument;
    String[] notes = chords.get(name);
    if (notes != null) { for (String n : notes) { int midi = noteToMidi(n); if (midi >= 0) playNoteForDuration(instName, midi, vel, durationMs); } }
    else logToScreen("Chord not found: " + name, 2);
  }

  void playMelodyInternal(String m, String i) { String[] tokens = splitTokens(m, ", \\t\\n\\r"); for (String t : tokens) parseAndPlayNote(i, t, 100); }

  void parseAndPlayNote(String name, String token, float vel) {
    token = token.trim(); if (token.length() < 1) return; activeMelodyCount++; float totalMs = 0; String noteName = "";
    String[] parts = token.split("\\\\+");
    for (int j = 0; j < parts.length; j++) {
      String p = parts[j].trim(); if (p.length() == 0) continue; float multiplier = 1.0f;
      if (p.endsWith(".")) { multiplier = 1.5f; p = p.substring(0, p.length() - 1); }
      else if (p.endsWith("_T")) { multiplier = 2.0f / 3.0f; p = p.substring(0, p.length() - 2); }
      if (p.length() == 0) continue; char durChar = p.charAt(p.length() - 1); String prefix = p.substring(0, p.length() - 1);
      if (durChar != 'W' && durChar != 'H' && durChar != 'Q' && durChar != 'E' && durChar != 'S') { prefix = p; durChar = 'Q'; }
      if (j == 0) noteName = prefix; float baseMs = 0;
      if (durChar == 'W') baseMs = (60000.0f / bpm) * 4.0f; else if (durChar == 'H') baseMs = (60000.0f / bpm) * 2.0f;
      else if (durChar == 'Q') baseMs = (60000.0f / bpm); else if (durChar == 'E') baseMs = (60000.0f / bpm) / 2.0f;
      else if (durChar == 'S') baseMs = (60000.0f / bpm) / 4.0f; totalMs += (baseMs * multiplier);
    }
    if (noteName.length() > 0) {
      String type = instrumentMap.getOrDefault(name, "DRUM"); float volScale = instrumentVolumes.getOrDefault(name, 1.0f);
      if (type.equals("DRUM")) {
        if (!noteName.equalsIgnoreCase("R") && samplerMap.containsKey(name)) {
          ((ddf.minim.ugens.Gain)samplerGainMap.get(name)).setValue(map(vel * volScale, 0, 127, -40, 0));
          ((ddf.minim.ugens.Sampler)samplerMap.get(name)).trigger();
        }
      } else {
        if (!noteName.equalsIgnoreCase("R")) {
          if (chords.containsKey(noteName)) playChordByNameInternal(name, noteName, totalMs * 0.95f, vel);
          else { int midi = noteToMidi(noteName); if (midi >= 0) playNoteForDuration(name, midi, vel, totalMs * 0.95f); }
        }
      }
      try { Thread.sleep((long)totalMs); } catch(Exception e) {}
    }
    activeMelodyCount--;
  }

  float durationToMs(String iv) {
    float ms = 500; try {
      if (iv.endsWith("m")) { float count = iv.length() > 1 ? Float.parseFloat(iv.substring(0, iv.length()-1)) : 1.0f; ms = (60000/bpm) * 4 * count; }
      else if (iv.endsWith("n")) { float den = Float.parseFloat(iv.substring(0, iv.length()-1)); ms = (60000/bpm) * (4.0f / den); }
    } catch(Exception e) {} return ms;
  }

  void playClick(float freq, float v) {
    checkMainMixer(); if (out == null) return; float amp = map(v, 0, 127, 0, 1.0f);
    Oscil wave = new Oscil(freq, amp, Waves.TRIANGLE); ADSR adsr = new ADSR(1.0, 0.01f, 0.05f, 0.0f, 0.05f);
    wave.patch(adsr).patch(mainMixer); adsr.noteOn(); try { Thread.sleep(80); } catch(Exception e) {} 
    adsr.noteOff(); adsr.unpatchAfterRelease(mainMixer);
  }
`;window.SB_JavaLibs.GENERAL_HELPERS=`
  void logToScreen(String msg, int type) {
    if (cp5 == null) { println("[Early Log] " + msg); return; }
    Textarea target = (type >= 1) ? cp5.get(Textarea.class, "alertsArea") : cp5.get(Textarea.class, "consoleArea");
    if (target != null) {
      String prefix = (type == 3) ? "[ERR] " : (type == 2) ? "[WARN] " : (type == 1) ? "[MSG] " : "[INFO] ";
      target.append(prefix + msg + "\\n"); target.scroll(1.0);
    }
    println((type==3?"[ERR] ":type==2?"[WARN] ":type==1?"[MSG] ":"[INFO] ") + msg);
  }

  void midiInputDevice(int n) {
    if (myBus == null) return; String[] inputs = MidiBus.availableInputs();
    if (n >= 0 && n < inputs.length) { myBus.clearInputs(); myBus.addInput(n); logToScreen("MIDI Connected: " + inputs[n], 0); }
  }

  void serialInputDevice(int n) {
    String[] ports = Serial.list();
    if (n >= 0 && n < ports.length) {
      if (myPort != null) { myPort.stop(); }
      try { myPort = new Serial(this, ports[n], serialBaud); myPort.bufferUntil('\\n'); logToScreen("Serial Connected: " + ports[n], 0); }
      catch (Exception e) { logToScreen("Serial Error: Port Busy or Unavailable", 3); }
    }
  }

  void scanMidi() {
    String[] inputs = MidiBus.availableInputs(); ScrollableList sl = cp5.get(ScrollableList.class, "midiInputDevice");
    if (sl != null) { sl.clear(); for (int i = 0; i < inputs.length; i++) { sl.addItem(inputs[i], i); } logToScreen("MIDI Scanned: " + inputs.length + " devices found.", 0); }
  }

  void copyLogs() {
    Textarea console = cp5.get(Textarea.class, "consoleArea"); Textarea alerts = cp5.get(Textarea.class, "alertsArea");
    String content = "--- ALERTS ---\\n" + (alerts != null ? alerts.getText() : "") + "\\n\\n--- CONSOLE ---\\n" + (console != null ? console.getText() : "");
    StringSelection selection = new StringSelection(content); Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
    clipboard.setContents(selection, selection); logToScreen("Logs copied to clipboard.", 1);
  }

  void clearLogs() {
    Textarea console = cp5.get(Textarea.class, "consoleArea"); Textarea alerts = cp5.get(Textarea.class, "alertsArea");
    if (console != null) console.clear(); if (alerts != null) alerts.clear(); logToScreen("Logs cleared.", 1);
  }

  void keyPressed() {
    if (key == CODED) {
      if (keyCode == UP) { pitchTranspose += 12; logToScreen("Octave UP (Trans: " + (pitchTranspose > 0 ? "+" : "") + pitchTranspose + ")", 1); }
      else if (keyCode == DOWN) { pitchTranspose -= 12; logToScreen("Octave DOWN (Trans: " + (pitchTranspose > 0 ? "+" : "") + pitchTranspose + ")", 1); }
      else if (keyCode == LEFT || keyCode == RIGHT) {
        Object[] names = instrumentMap.keySet().toArray();
        if (names.length > 0) {
          int idx = -1; for(int i=0; i<names.length; i++) { if(names[i].toString().equals(currentInstrument)) { idx = i; break; } }
          if (idx == -1) idx = 0; else if (keyCode == RIGHT) idx = (idx + 1) % names.length; else idx = (idx - 1 + names.length) % names.length;
          currentInstrument = names[idx].toString();
        }
      }
    } else if (key == '=' || key == '+') { pitchTranspose += 1; logToScreen("Transpose: " + (pitchTranspose > 0 ? "+" : "") + pitchTranspose, 1); }
    else if (key == '-' || key == '_') { pitchTranspose -= 1; logToScreen("Transpose: " + (pitchTranspose > 0 ? "+" : "") + pitchTranspose, 1); }
    else if (key == BACKSPACE) { pitchTranspose = 0; logToScreen("Transpose Reset", 1); }
    int p = -1; char k = Character.toLowerCase(key);
    if (k == 'q') p = 60; else if (k == '2') p = 61; else if (k == 'w') p = 62; else if (k == '3') p = 63; else if (k == 'e') p = 64; else if (k == 'r') p = 65;
    else if (k == '5') p = 66; else if (k == 't') p = 67; else if (k == '6') p = 68; else if (k == 'y') p = 69; else if (k == '7') p = 70; else if (k == 'u') p = 71;
    else if (k == 'i') p = 72; else if (k == '9') p = 73; else if (k == 'o') p = 74; else if (k == '0') p = 75; else if (k == 'p') p = 76;
    if (p != -1) { 
      int transP = p + pitchTranspose;
      if (!pcKeysHeld.containsKey(p)) { 
        playNoteInternal(currentInstrument, transP, 100); 
        pcKeysHeld.put(p, currentInstrument); 
        logToScreen("Keyboard ON: MIDI " + transP, 0); 
      } 
    }
    {{KEY_PRESSED_EVENT_PLACEHOLDER}}
  }

  void keyReleased() {
    int p = -1; char k = Character.toLowerCase(key);
    if (k == 'q') p = 60; else if (k == '2') p = 61; else if (k == 'w') p = 62; else if (k == '3') p = 63; else if (k == 'e') p = 64; else if (k == 'r') p = 65;
    else if (k == '5') p = 66; else if (k == 't') p = 67; else if (k == '6') p = 68; else if (k == 'y') p = 69; else if (k == '7') p = 70; else if (k == 'u') p = 71;
    else if (k == 'i') p = 72; else if (k == '9') p = 73; else if (k == 'o') p = 74; else if (k == '0') p = 75; else if (k == 'p') p = 76;
    if (p != -1) { 
      if (pcKeysHeld.containsKey(p)) { 
        String inst = pcKeysHeld.get(p); 
        stopNoteInternal(inst, p + pitchTranspose); 
        pcKeysHeld.remove(p); 
        logToScreen("Keyboard OFF: MIDI " + (p + pitchTranspose), 0); 
      } 
    }
    {{KEY_RELEASED_EVENT_PLACEHOLDER}}
  }

  class SynthComponent { String waveType; float ratio; float amp; SynthComponent(String w, float r, float a) { waveType = w; ratio = r; amp = a; } }
  
  Wavetable getWaveform(String type) {
    if (type.equals("SINE")) return Waves.SINE; if (type.equals("SQUARE")) return Waves.SQUARE; if (type.equals("SAW")) return Waves.SAW; return Waves.TRIANGLE;
  }
`;/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 * @fileoverview Helper functions for generating Processing (Java) for blocks.
 */Blockly.Processing=new Blockly.Generator("Processing");Blockly.Processing.forBlock={};const K=Blockly.Processing.blockToCode;Blockly.Processing.blockToCode=function(e){return e?(!this.forBlock[e.type]&&this[e.type]&&(this.forBlock[e.type]=this[e.type]),this.forBlock[e.type]?K.call(this,e):(console.warn("Missing generator for block type: "+e.type),"/* Missing generator for "+e.type+` */
`)):""};Blockly.Processing.addReservedWords("setup,draw,if,else,for,switch,case,while,do,break,continue,return,void,boolean,char,byte,int,long,float,double,String,Array,color,PImage,PFont,PShape,size,background,fill,noFill,stroke,noStroke,strokeWeight,rect,ellipse,line,point,triangle,quad,arc,curve,bezier,map,constrain,abs,min,max,sin,cos,tan,random,println,millis,width,height,mouseX,mouseY,mousePressed,keyPressed,key,keyCode");Blockly.Processing.ORDER_ATOMIC=0;Blockly.Processing.ORDER_NEW=1.1;Blockly.Processing.ORDER_MEMBER=1.2;Blockly.Processing.ORDER_FUNCTION_CALL=2;Blockly.Processing.ORDER_MULTIPLICATION=5.1;Blockly.Processing.ORDER_DIVISION=5.2;Blockly.Processing.ORDER_ADDITION=6.2;Blockly.Processing.ORDER_SUBTRACTION=6.1;Blockly.Processing.ORDER_RELATIONAL=8;Blockly.Processing.ORDER_EQUALITY=9;Blockly.Processing.ORDER_LOGICAL_AND=13;Blockly.Processing.ORDER_LOGICAL_OR=14;Blockly.Processing.ORDER_ASSIGNMENT=16;Blockly.Processing.ORDER_NONE=99;Blockly.Processing.init=function(e){Blockly.Processing.imports_=Object.create(null),Blockly.Processing.global_vars_=Object.create(null),Blockly.Processing.definitions_=Object.create(null),Blockly.Processing.setups_=Object.create(null),Blockly.Processing.draws_=Object.create(null),Blockly.Processing.keyEvents_=[],Blockly.Processing.definitions_.Helper_Utils=`
float floatVal(Object o) {
  if (o == null) return 0.0f;
  if (o instanceof Number) return ((Number)o).floatValue();
  try { return Float.parseFloat(o.toString()); }
  catch (Exception e) { return 0.0f; }
}

int getMidi(Object o) {
  if (o == null) return -1;
  if (o instanceof Number) return ((Number)o).intValue();
  String s = o.toString().trim();
  try { return (int)Float.parseFloat(s); } catch (Exception e) { return noteToMidi(s); }
}
`,Blockly.Processing.definitions_.Helpers_Core=`
int noteToMidi(String note) {
  String n = note.toUpperCase(); if (n.equals("R")) return -1; if (n.equals("X")) return 69;
  int octave = 4; if (n.length() > 1 && Character.isDigit(n.charAt(n.length()-1))) { 
    octave = Character.getNumericValue(n.charAt(n.length()-1)); n = n.substring(0, n.length()-1); 
  }
  int pc = 0; if (n.startsWith("C")) pc = 0; else if (n.startsWith("D")) pc = 2; else if (n.startsWith("E")) pc = 4; 
  else if (n.startsWith("F")) pc = 5; else if (n.startsWith("G")) pc = 7; else if (n.startsWith("A")) pc = 9; else if (n.startsWith("B")) pc = 11;
  if (n.contains("#") || n.contains("S")) pc++; if (n.contains("B") && n.length() > 1 && !n.equals("B")) pc--;
  return (octave + 1) * 12 + pc;
}

float mtof(float note) { 
  return 440.0f * (float)Math.pow(2.0, (double)((note - 69.0f) / 12.0f)); 
}
`,Blockly.Processing.nameDB_?Blockly.Processing.nameDB_.reset():Blockly.Processing.nameDB_=new Blockly.Names(Blockly.Processing.RESERVED_WORDS_),Blockly.Processing.nameDB_.setVariableMap(e.getVariableMap())};Blockly.Processing.getRelativeIndex=function(e,t){const n=Blockly.Processing.valueToCode(e,t,Blockly.Processing.ORDER_ADDITION)||"1";return window.SB_Utils.getRelativeIndex(n)};Blockly.Processing.addImport=function(e){Blockly.Processing.imports_&&(Blockly.Processing.imports_[e]=e)};Blockly.Processing.provideSetup=function(e,t){if(Blockly.Processing.setups_){var n=t||"setup_"+Object.keys(Blockly.Processing.setups_).length;Blockly.Processing.setups_[n]=e}};Blockly.Processing.provideDraw=function(e,t){if(Blockly.Processing.draws_){var n=t||"draw_"+Object.keys(Blockly.Processing.draws_).length;Blockly.Processing.draws_[n]=e}};Blockly.Processing.finish=function(e){const t=(Blockly.Processing.definitions_.midi_events_note_on||[]).join(`
`),n=(Blockly.Processing.definitions_.midi_events_note_off||[]).join(`
`),l=(Blockly.Processing.definitions_.midi_events_cc||[]).join(`
`);if(t||n||l){let d=`
void noteOn(int channel, int pitch, int velocity) {
  if (midiBusses.size() == 1) { for (String name : midiBusses.keySet()) { noteOn(channel, pitch, velocity, name); } }
  else { noteOn(channel, pitch, velocity, "MIDI_1"); }
}
void noteOff(int channel, int pitch, int velocity) {
  if (midiBusses.size() == 1) { for (String name : midiBusses.keySet()) { noteOff(channel, pitch, velocity, name); } }
  else { noteOff(channel, pitch, velocity, "MIDI_1"); }
}
void controllerChange(int channel, int number, int value) {
  if (midiBusses.size() == 1) { for (String name : midiBusses.keySet()) { controllerChange(channel, number, value, name); } }
  else { controllerChange(channel, number, value, "MIDI_1"); }
}
void noteOn(int channel, int pitch, int velocity, String bus_name) {
  logToScreen("[" + bus_name + "] Note ON - P: " + pitch + " V: " + velocity, 0);
  midiKeysHeld.put(pitch, currentInstrument);
${t}
}
void noteOff(int channel, int pitch, int velocity, String bus_name) {
  logToScreen("[" + bus_name + "] Note OFF - P: " + pitch, 0);
  String memorizedInst = midiKeysHeld.get(pitch);
  if (memorizedInst != null) {
    String backup = currentInstrument; currentInstrument = memorizedInst;
${n}
    currentInstrument = backup; midiKeysHeld.remove(pitch);
  } else { ${n} }
}
void controllerChange(int channel, int number, int value, String bus_name) { ${l} }
`;Blockly.Processing.definitions_.midi_callbacks=d}delete Blockly.Processing.definitions_.midi_events_note_on,delete Blockly.Processing.definitions_.midi_events_note_off,delete Blockly.Processing.definitions_.midi_events_cc;const s=new Set;Blockly.Processing.imports_&&Object.values(Blockly.Processing.imports_).forEach(d=>{if(d){let T=d.trim();T&&!T.endsWith(";")&&(T+=";"),s.add(T)}});const o=Array.from(s).sort().join(`
`),i=Object.values(Blockly.Processing.global_vars_||{}).map(d=>d.trim()).filter(d=>d!=="").sort().join(`
`);let a=Object.values(Blockly.Processing.definitions_||{}).filter(d=>typeof d=="string").map(d=>d.trim()).filter(d=>d!=="").join(`

`),r="",_="";Blockly.Processing.keyEvents_&&Blockly.Processing.keyEvents_.forEach(d=>{let T=`if (k == '${d.key}') {
      ${d.code.replace(/\n/g,`
      `)}
    }
    `;d.mode==="RELEASED"?_+=T:r+=T}),a=a.replace(/\{\{KEY_PRESSED_EVENT_PLACEHOLDER\}\}/g,r).replace(/\{\{KEY_RELEASED_EVENT_PLACEHOLDER\}\}/g,_);const c=Blockly.Processing.setups_||{};let u=[];c.stage_init_size&&(u.push(c.stage_init_size),delete c.stage_init_size),c.stage_init_density&&(u.push(c.stage_init_density),delete c.stage_init_density),c.sb_audio_init&&(u.push(c.sb_audio_init),delete c.sb_audio_init),Object.values(c).forEach(d=>{let T=d.trim();T&&u.push(T)});const E=`void setup() {
  `+u.join(`
  `).replace(/\n/g,`
  `)+`
}
`,f=(Object.values(Blockly.Processing.draws_||[]).map(d=>d.trim()).filter(d=>d!=="").join(`
`)+`
`+e).trim(),B=`void draw() {
  `+(f?f.replace(/\n/g,`
  `):"")+`
}
`;let g=[];o&&g.push(o),i&&g.push(i),a&&g.push(a),g.push(E),g.push(B);const y=g.join(`

`).trim();return delete Blockly.Processing.imports_,delete Blockly.Processing.global_vars_,delete Blockly.Processing.definitions_,delete Blockly.Processing.setups_,delete Blockly.Processing.draws_,y};Blockly.Processing.scrubNakedValue=function(e){return e+`;
`};Blockly.Processing.quote_=function(e){return'"'+e.replace(/\\/g,"\\\\").replace(/"/g,'\\"')+'"'};Blockly.Processing.scrub_=function(e,t){var n=e.nextConnection&&e.nextConnection.targetBlock(),l=Blockly.Processing.blockToCode(n);return t+l};Blockly.Processing.registerGenerator=function(e,t){Blockly.Processing.forBlock[e]=t,Blockly.Processing[e]=t};Blockly.Processing.injectAudioCore=function(){if(!Blockly.Processing.definitions_.AudioCore){Blockly.Processing.addImport("import ddf.minim.*;"),Blockly.Processing.addImport("import ddf.minim.ugens.*;"),Blockly.Processing.addImport("import java.util.*;"),Blockly.Processing.addImport("import java.util.concurrent.*;");var e=Blockly.Processing.global_vars_;e.minim="Minim minim;",e.out="AudioOutput out;",e.instrumentMap="LinkedHashMap<String, String> instrumentMap = new LinkedHashMap<String, String>();",e.instrumentADSR="LinkedHashMap<String, float[]> instrumentADSR = new LinkedHashMap<String, float[]>();",e.instrumentVolumes="HashMap<String, Float> instrumentVolumes = new HashMap<String, Float>();",e.chords="HashMap<String, String[]> chords = new HashMap<String, String[]>();",e.currentInstrument='String currentInstrument = "default";',e.lastInstrument='String lastInstrument = "";',e.mainMixer="SBSummer mainMixer;",e.masterEffectEnd="UGen masterEffectEnd;",e.masterGainUGen="Gain masterGainUGen;",e.harmonicPartials="HashMap<String, float[]> harmonicPartials = new HashMap<String, float[]>();",e.additiveConfigs="HashMap<String, List<SynthComponent>> additiveConfigs = new HashMap<String, List<SynthComponent>>();",e.samplerMap="HashMap<String, Sampler> samplerMap = new HashMap<String, Sampler>();",e.samplerGainMap="HashMap<String, Gain> samplerGainMap = new HashMap<String, Gain>();",e.melodicSamplers="HashMap<String, MelodicSampler> melodicSamplers = new HashMap<String, MelodicSampler>();",e.activeMelodyCount="int activeMelodyCount = 0;",e.melodyLock="final Object melodyLock = new Object();",e.isCountingIn="volatile boolean isCountingIn = false;",e.activeNotes="ConcurrentHashMap<String, ADSR> activeNotes = new ConcurrentHashMap<String, ADSR>();",e.midiKeysHeld="ConcurrentHashMap<Integer, String> midiKeysHeld = new ConcurrentHashMap<Integer, String>();",e.pcKeysHeld="HashMap<Integer, String> pcKeysHeld = new HashMap<Integer, String>();",e.midiBusses="HashMap<String, MidiBus> midiBusses = new HashMap<String, MidiBus>();",e.instrumentMixConfigs="HashMap instrumentMixConfigs = new HashMap();",e.isMasterClipping="volatile boolean isMasterClipping = false;",e.clippingTimer="long clippingTimer = 0;",e.pitchTranspose="int pitchTranspose = 0;",e.instrumentMixers="HashMap instrumentMixers = new HashMap();",e.instrumentEffectEnds="HashMap instrumentEffectEnds = new HashMap();",e.instrumentFilters="HashMap instrumentFilters = new HashMap();",e.instrumentDelays="HashMap instrumentDelays = new HashMap();",e.instrumentBitCrushers="HashMap instrumentBitCrushers = new HashMap();",e.instrumentCompressors="HashMap instrumentCompressors = new HashMap();",e.instrumentLimiters="HashMap instrumentLimiters = new HashMap();",e.instrumentWaveshapers="HashMap instrumentWaveshapers = new HashMap();",e.instrumentReverbs="HashMap instrumentReverbs = new HashMap();",e.instrumentFlangers="HashMap instrumentFlangers = new HashMap();",e.instrumentAutoFilters="HashMap instrumentAutoFilters = new HashMap();",e.instrumentAutoFilterLFOs="HashMap instrumentAutoFilterLFOs = new HashMap();",e.instrumentPitchMods="HashMap instrumentPitchMods = new HashMap();",e.instrumentPitchModLFOs="HashMap instrumentPitchModLFOs = new HashMap();",e.instrumentPans="HashMap instrumentPans = new HashMap();",e.bpm="float bpm = 120.0;",e.masterGain="float masterGain = -5.0;",e.defAdsrA="float defAdsrA = 0.01;",e.defAdsrD="float defAdsrD = 0.1;",e.defAdsrS="float defAdsrS = 0.5;",e.defAdsrR="float defAdsrR = 0.5;",Blockly.Processing.definitions_.AudioCore=window.SB_JavaLibs.AUDIO_CLASSES+window.SB_JavaLibs.AUDIO_HELPERS}};/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Processing.forBlock.processing_setup=function(e){const t=Blockly.Processing.statementToCode(e,"DO");return Blockly.Processing.setups_.processing_setup=t,""};Blockly.Processing.forBlock.processing_draw=function(e){return Blockly.Processing.statementToCode(e,"DO")};Blockly.Processing.forBlock.processing_on_key_pressed=function(e){const n=`
void keyPressed() {
  ${Blockly.Processing.statementToCode(e,"DO")}
}
  `;return Blockly.Processing.definitions_.processing_on_key_pressed=n,""};Blockly.Processing.forBlock.processing_exit=function(e){return`exit();
`};Blockly.Processing.forBlock.processing_frame_count=function(e){return["frameCount",Blockly.Processing.ORDER_ATOMIC]};/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Processing.registerGenerator("sb_minim_init",function(e){return Blockly.Processing.injectAudioCore(),Blockly.Processing.addImport("import ddf.minim.*;"),Blockly.Processing.addImport("import ddf.minim.ugens.*;"),Blockly.Processing.provideSetup(`
  checkMainMixer();
  `,"sb_audio_init"),""});Blockly.Processing.registerGenerator("sb_instrument_container",function(e){const t=e.getFieldValue("NAME");Blockly.Processing.currentGenInstrumentName=t;const n=Blockly.Processing.statementToCode(e,"STACK");let l='if (!instrumentMap.containsKey("'+t+'")) instrumentMap.put("'+t+`", "TRIANGLE");
`;return l+='if (!instrumentADSR.containsKey("'+t+'")) instrumentADSR.put("'+t+`", new float[]{defAdsrA, defAdsrD, defAdsrS, defAdsrR});
`,l+=n,Blockly.Processing.currentGenInstrumentName=null,Blockly.Processing.provideSetup(l,"inst_setup_"+t),""});Blockly.Processing.registerGenerator("sb_set_wave",function(e){if(!Blockly.Processing.currentGenInstrumentName)return`// sb_set_wave must be inside sb_instrument_container
`;const t=e.getFieldValue("TYPE"),n=Blockly.Processing.currentGenInstrumentName;return`if (instrumentMap.containsKey("${n}") && !instrumentMap.get("${n}").equals("${t}")) println("[WARN] Instrument '${n}' source overwritten by '${t}'");
instrumentMap.put("${n}", "${t}");
`});Blockly.Processing.registerGenerator("sb_set_noise",function(e){if(!Blockly.Processing.currentGenInstrumentName)return`// sb_set_noise must be inside sb_instrument_container
`;const t=e.getFieldValue("TYPE"),n=Blockly.Processing.currentGenInstrumentName,l="NOISE_"+t;return`if (instrumentMap.containsKey("${n}") && !instrumentMap.get("${n}").equals("${l}")) println("[WARN] Instrument '${n}' source overwritten by '${l}'");
instrumentMap.put("${n}", "${l}");
`});Blockly.Processing.registerGenerator("sb_mixed_source",function(e){if(!Blockly.Processing.currentGenInstrumentName)return`// sb_mixed_source must be inside sb_instrument_container
`;const t=e.getFieldValue("WAVE"),n=e.getFieldValue("NOISE"),l=Blockly.Processing.valueToCode(e,"LEVEL",Blockly.Processing.ORDER_ATOMIC)||"30",s=e.hasJitter_?Blockly.Processing.valueToCode(e,"JITTER_INPUT",Blockly.Processing.ORDER_ATOMIC)||"5":"0",o=e.hasSweep_?Blockly.Processing.valueToCode(e,"SWEEP_INPUT",Blockly.Processing.ORDER_ATOMIC)||"0.5":"0",i=e.hasSweep_?Blockly.Processing.valueToCode(e,"SWEEP_DEPTH_INPUT",Blockly.Processing.ORDER_ATOMIC)||"20":"0",a=Blockly.Processing.currentGenInstrumentName;let r=`if (instrumentMap.containsKey("${a}") && !instrumentMap.get("${a}").equals("MIXED")) println("[WARN] Instrument '${a}' source overwritten by 'MIXED'");
instrumentMap.put("${a}", "MIXED");
`;return r+=`instrumentMixConfigs.put("${a}", "${t},${n}," + floatVal(${l}) + "," + floatVal(${s}) + "," + floatVal(${o}) + "," + floatVal(${i}));
`,r});Blockly.Processing.registerGenerator("sb_drum_sampler",function(e){const t=Blockly.Processing.currentGenInstrumentName;if(!t)return`// sb_drum_sampler must be inside sb_instrument_container
`;const n=e.getFieldValue("PATH"),l=n==="CUSTOM"?e.getFieldValue("CUSTOM_PATH_VALUE"):n;let s=`if (instrumentMap.containsKey("${t}") && !instrumentMap.get("${t}").equals("DRUM")) println("[WARN] Instrument '${t}' source overwritten by 'DRUM'");
`;return s+='samplerMap.put("'+t+'", new ddf.minim.ugens.Sampler("'+l+`", 20, minim));
`,s+='samplerGainMap.put("'+t+`", new Gain(0.f));
`,s+='((ddf.minim.ugens.Sampler)samplerMap.get("'+t+'")).patch((Gain)samplerGainMap.get("'+t+'")).patch(getInstrumentMixer("'+t+`"));
`,s+='instrumentMap.put("'+t+`", "DRUM");
`,s+='instrumentADSR.put("'+t+`", new float[]{defAdsrA, defAdsrD, defAdsrS, defAdsrR});
`,s});Blockly.Processing.registerGenerator("sb_melodic_sampler",function(e){const t=Blockly.Processing.currentGenInstrumentName;if(!t)return`// sb_melodic_sampler must be inside sb_instrument_container
`;const n=e.getFieldValue("TYPE");let l="";n==="PIANO"?l="piano":n==="VIOLIN_PIZZ"?l="violin/violin-section-pizzicato":n==="VIOLIN_ARCO"?l="violin/violin-section-vibrato-sustain":l=e.getFieldValue("CUSTOM_PATH_VALUE");let s=`if (instrumentMap.containsKey("${t}") && !instrumentMap.get("${t}").equals("MELODIC_SAMPLER")) println("[WARN] Instrument '${t}' source overwritten by 'MELODIC_SAMPLER'");
`;return s+='if (!melodicSamplers.containsKey("'+t+'")) melodicSamplers.put("'+t+'", new MelodicSampler(minim, "'+t+`"));
`,s+='melodicSamplers.get("'+t+'").loadSamples("'+l+`");
`,s+='instrumentMap.put("'+t+`", "MELODIC_SAMPLER");
`,s+='instrumentADSR.put("'+t+`", new float[]{defAdsrA, defAdsrD, defAdsrS, defAdsrR});
`,s});Blockly.Processing.registerGenerator("sb_set_adsr",function(e){if(!Blockly.Processing.currentGenInstrumentName)return`// sb_set_adsr must be inside sb_instrument_container
`;const t=Blockly.Processing.valueToCode(e,"A",Blockly.Processing.ORDER_ATOMIC)||"0.01",n=Blockly.Processing.valueToCode(e,"D",Blockly.Processing.ORDER_ATOMIC)||"0.1",l=Blockly.Processing.valueToCode(e,"S",Blockly.Processing.ORDER_ATOMIC)||"0.5",s=Blockly.Processing.valueToCode(e,"R",Blockly.Processing.ORDER_ATOMIC)||"0.5";return`instrumentADSR.put("${Blockly.Processing.currentGenInstrumentName}", new float[]{(float)${t}, (float)${n}, (float)${l}, (float)${s}});
`});Blockly.Processing.registerGenerator("sb_create_harmonic_synth",function(e){const t=Blockly.Processing.currentGenInstrumentName;if(!t)return`// sb_create_harmonic_synth must be inside sb_instrument_container
`;const n=[];for(let l=1;l<=(e.itemCount_||0);l++){const s=Blockly.Processing.valueToCode(e,"PARTIAL"+l,Blockly.Processing.ORDER_ATOMIC)||"0";n.push(`${s}f`)}return`instrumentMap.put("${t}", "HARMONIC");
harmonicPartials.put("${t}", new float[]{${n.length>0?n.join(", "):"1.0f"}});
`});Blockly.Processing.registerGenerator("sb_create_additive_synth",function(e){const t=Blockly.Processing.currentGenInstrumentName;if(!t)return`// sb_create_additive_synth must be inside sb_instrument_container
`;const n=[],l=e.itemCount_||0;for(let s=1;s<=l;s++){const o=e.getFieldValue("WAVE"+s)||"SINE",i=e.getFieldValue("RATIO"+s)||"1.0",a=e.getFieldValue("AMP"+s)||"0.5";n.push(`new SynthComponent("${o}", ${i}f, ${a}f)`)}return`instrumentMap.put("${t}", "ADDITIVE");
additiveConfigs.put("${t}", Arrays.asList(new SynthComponent[]{${n.join(", ")}}));
`});/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Processing.registerGenerator("sb_setup_effect",function(e){Blockly.Processing.injectAudioCore();let t=Blockly.Processing.currentGenInstrumentName||"Master";const n=e.getFieldValue("EFFECT_TYPE");let l=t==="Master"?"masterGainUGen":'((UGen)instrumentPans.getOrDefault("'+t+'", getInstrumentMixer("'+t+'")))',s=t==="Master"?"masterEffectEnd":'(UGen)instrumentEffectEnds.getOrDefault("'+t+'", getInstrumentMixer("'+t+'"))',o=`{
`;if(n==="filter"){const i=Blockly.Processing.valueToCode(e,"FILTER_FREQ",Blockly.Processing.ORDER_ATOMIC)||"1000",a=Blockly.Processing.valueToCode(e,"FILTER_Q",Blockly.Processing.ORDER_ATOMIC)||"1";o+=`  if (instrumentFilters.containsKey("${t}")) { updateFilter("${t}", (float)${i}, (float)${a}); }
`,o+=`  else { UGen prev = ${s}; prev.unpatch(${l}); UGen f = new MoogFilter((float)${i}, constrain((float)${a}, 0.0f, 0.9f)); instrumentFilters.put("${t}", f); prev.patch(f).patch(${l}); `,o+=t==="Master"?`masterEffectEnd = f; }
`:`instrumentEffectEnds.put("${t}", f); }
`}else if(n==="autofilter"){const i=Blockly.Processing.valueToCode(e,"RATE",Blockly.Processing.ORDER_ATOMIC)||"0.5",a=Blockly.Processing.valueToCode(e,"DEPTH",Blockly.Processing.ORDER_ATOMIC)||"20",r=Blockly.Processing.valueToCode(e,"FILTER_Q",Blockly.Processing.ORDER_ATOMIC)||"0.4";o+=`  if (instrumentAutoFilters.containsKey("${t}")) { ddf.minim.ugens.Oscil lfo = (ddf.minim.ugens.Oscil)instrumentAutoFilterLFOs.get("${t}"); if (lfo != null) { lfo.setFrequency((float)${i}); lfo.setAmplitude(1000.0f * (float)${a}/100.0f); } ddf.minim.ugens.MoogFilter f = (ddf.minim.ugens.MoogFilter)instrumentAutoFilters.get("${t}"); if (f != null) { f.resonance.setLastValue(constrain((float)${r}, 0.0f, 0.9f)); } }
`,o+=`  else { UGen prev = ${s}; prev.unpatch(${l}); ddf.minim.ugens.MoogFilter f = new ddf.minim.ugens.MoogFilter(1000, (float)${r}); ddf.minim.ugens.Oscil lfo = new ddf.minim.ugens.Oscil((float)${i}, 1000.0f * (float)${a}/100.0f, Waves.SINE); ddf.minim.ugens.Summer s = new SBSummer(); new ddf.minim.ugens.Constant(1000).patch(s); lfo.patch(s).patch(f.frequency); instrumentAutoFilters.put("${t}", f); instrumentAutoFilterLFOs.put("${t}", lfo); prev.patch(f).patch(${l}); `,o+=t==="Master"?`masterEffectEnd = f; }
`:`instrumentEffectEnds.put("${t}", f); }
`}else if(n==="pitchmod"){const i=e.getFieldValue("TYPE")||"NOISE",a=Blockly.Processing.valueToCode(e,"RATE",Blockly.Processing.ORDER_ATOMIC)||"5",r=Blockly.Processing.valueToCode(e,"DEPTH",Blockly.Processing.ORDER_ATOMIC)||"10";o+=`  if (instrumentPitchMods.containsKey("${t}")) { UGen lfo = (UGen)instrumentPitchModLFOs.get("${t}"); if (lfo instanceof ddf.minim.ugens.Oscil) { ((ddf.minim.ugens.Oscil)lfo).setFrequency((float)${a}); ((ddf.minim.ugens.Oscil)lfo).setAmplitude((float)${r}/1200.0f); } else if (lfo instanceof ddf.minim.ugens.Noise) { ((ddf.minim.ugens.Noise)lfo).amplitude.setLastValue((float)${r}/240.0f); } }
`,o+=`  else { UGen prev = ${s}; prev.unpatch(${l}); ddf.minim.ugens.TickRate tr = new ddf.minim.ugens.TickRate(1.0f); UGen lfo; if ("${i}".equals("NOISE")) lfo = new ddf.minim.ugens.Noise((float)${r}/240.0f, ddf.minim.ugens.Noise.Tint.WHITE); else lfo = new ddf.minim.ugens.Oscil((float)${a}, (float)${r}/1200.0f, Waves.SINE); ddf.minim.ugens.Summer s = new SBSummer(); new ddf.minim.ugens.Constant(1.0f).patch(s); lfo.patch(s).patch(tr.value); instrumentPitchMods.put("${t}", tr); instrumentPitchModLFOs.put("${t}", lfo); prev.patch(tr).patch(${l}); `,o+=t==="Master"?`masterEffectEnd = tr; }
`:`instrumentEffectEnds.put("${t}", tr); }
`}else if(n==="delay"){const i=Blockly.Processing.valueToCode(e,"DELAY_TIME",Blockly.Processing.ORDER_ATOMIC)||"0.5",a=Blockly.Processing.valueToCode(e,"FEEDBACK",Blockly.Processing.ORDER_ATOMIC)||"0.5";o+=`  if (instrumentDelays.containsKey("${t}")) { try { Object dObj = instrumentDelays.get("${t}"); java.lang.reflect.Field f = dObj.getClass().getField("delTime"); Object input = f.get(dObj); input.getClass().getMethod("setLastValue", float.class).invoke(input, (float)${i}); } catch (Exception e) {} }
`,o+=`  else { UGen prev = ${s}; prev.unpatch(${l}); Delay d = new Delay(${i}, ${a}, true, true); instrumentDelays.put("${t}", d); prev.patch(d).patch(${l}); `,o+=t==="Master"?`masterEffectEnd = d; }
`:`instrumentEffectEnds.put("${t}", d); }
`}else if(n==="bitcrush"){const i=Blockly.Processing.valueToCode(e,"BITDEPTH",Blockly.Processing.ORDER_ATOMIC)||"8";o+=`  if (instrumentBitCrushers.containsKey("${t}")) { try { Object bObj = instrumentBitCrushers.get("${t}"); java.lang.reflect.Field f = bObj.getClass().getField("bitRes"); Object input = f.get(bObj); input.getClass().getMethod("setLastValue", float.class).invoke(input, (float)${i}); } catch (Exception e) {} }
`,o+=`  else { UGen prev = ${s}; prev.unpatch(${l}); BitCrush bc = new BitCrush((float)${i}, out.sampleRate()); instrumentBitCrushers.put("${t}", bc); prev.patch(bc).patch(${l}); `,o+=t==="Master"?`masterEffectEnd = bc; }
`:`instrumentEffectEnds.put("${t}", bc); }
`}else if(n==="waveshaper"){const i=Blockly.Processing.valueToCode(e,"DISTORTION_AMOUNT",Blockly.Processing.ORDER_ATOMIC)||"2";o+=`  if (instrumentWaveshapers.containsKey("${t}")) { ((SBWaveshaper)instrumentWaveshapers.get("${t}")).setAmount((float)${i}); }
`,o+=`  else { UGen prev = ${s}; prev.unpatch(${l}); SBWaveshaper ws = new SBWaveshaper(); ws.setAmount((float)${i}); instrumentWaveshapers.put("${t}", ws); prev.patch(ws).patch(${l}); `,o+=t==="Master"?`masterEffectEnd = ws; }
`:`instrumentEffectEnds.put("${t}", ws); }
`}else if(n==="reverb"){const i=Blockly.Processing.valueToCode(e,"ROOMSIZE",Blockly.Processing.ORDER_ATOMIC)||"0.5",a=Blockly.Processing.valueToCode(e,"DAMPING",Blockly.Processing.ORDER_ATOMIC)||"0.5",r=Blockly.Processing.valueToCode(e,"WET",Blockly.Processing.ORDER_ATOMIC)||"0.3";o+=`  if (instrumentReverbs.containsKey("${t}")) { ((SBReverb)instrumentReverbs.get("${t}")).setParams((float)${i}, (float)${a}, (float)${r}); }
`,o+=`  else { UGen prev = ${s}; prev.unpatch(${l}); SBReverb rv = new SBReverb(); rv.setParams((float)${i}, (float)${a}, (float)${r}); instrumentReverbs.put("${t}", rv); prev.patch(rv).patch(${l}); `,o+=t==="Master"?`masterEffectEnd = rv; }
`:`instrumentEffectEnds.put("${t}", rv); }
`}else if(n==="compressor"){const i=Blockly.Processing.valueToCode(e,"THRESHOLD",Blockly.Processing.ORDER_ATOMIC)||"-20",a=Blockly.Processing.valueToCode(e,"RATIO",Blockly.Processing.ORDER_ATOMIC)||"4",r=Blockly.Processing.valueToCode(e,"ATTACK",Blockly.Processing.ORDER_ATOMIC)||"0.01",_=Blockly.Processing.valueToCode(e,"RELEASE",Blockly.Processing.ORDER_ATOMIC)||"0.25",c=Blockly.Processing.valueToCode(e,"MAKEUP",Blockly.Processing.ORDER_ATOMIC)||"0";o+=`  if (instrumentCompressors.containsKey("${t}")) { ((SBCompressor)instrumentCompressors.get("${t}")).setParams((float)${i}, (float)${a}, (float)${r}, (float)${_}, (float)${c}); }
`,o+=`  else { UGen prev = ${s}; prev.unpatch(${l}); SBCompressor c = new SBCompressor(); c.setParams((float)${i}, (float)${a}, (float)${r}, (float)${_}, (float)${c}); instrumentCompressors.put("${t}", c); prev.patch(c).patch(${l}); `,o+=t==="Master"?`masterEffectEnd = c; }
`:`instrumentEffectEnds.put("${t}", c); }
`}else if(n==="limiter"){const i=Blockly.Processing.valueToCode(e,"THRESHOLD",Blockly.Processing.ORDER_ATOMIC)||"-3",a=Blockly.Processing.valueToCode(e,"ATTACK",Blockly.Processing.ORDER_ATOMIC)||"0.001",r=Blockly.Processing.valueToCode(e,"RELEASE",Blockly.Processing.ORDER_ATOMIC)||"0.1";o+=`  if (instrumentLimiters.containsKey("${t}")) { ((SBCompressor)instrumentLimiters.get("${t}")).setParams((float)${i}, 20.0f, (float)${a}, (float)${r}, 0.0f); }
`,o+=`  else { UGen prev = ${s}; prev.unpatch(${l}); SBCompressor c = new SBCompressor(); c.setParams((float)${i}, 20.0f, (float)${a}, (float)${r}, 0.0f); instrumentLimiters.put("${t}", c); prev.patch(c).patch(${l}); `,o+=t==="Master"?`masterEffectEnd = c; }
`:`instrumentEffectEnds.put("${t}", c); }
`}return o+=`}
`,o});Blockly.Processing.registerGenerator("sb_set_instrument_volume",function(e){const t=e.getFieldValue("NAME"),n=window.SB_Utils.getInstrumentJavaName(t),l=Blockly.Processing.valueToCode(e,"VOLUME",Blockly.Processing.ORDER_ATOMIC)||"100";return`instrumentVolumes.put(${n}, floatVal(${l}) / 100.0f);
`});Blockly.Processing.registerGenerator("sb_set_panning",function(e){const t=e.getFieldValue("NAME"),n=Blockly.Processing.valueToCode(e,"VALUE",Blockly.Processing.ORDER_ATOMIC)||"0";return`updatePanning("${t}", floatVal(${n}));
`});Blockly.Processing.registerGenerator("sb_set_effect_param",function(e){const t=e.getFieldValue("TARGET"),n=e.getFieldValue("EFFECT_TYPE"),l=n==="panning"?"pan":e.getFieldValue("PARAM_NAME"),s=Blockly.Processing.valueToCode(e,"VALUE",Blockly.Processing.ORDER_ATOMIC)||"0";return Blockly.Processing.definitions_.SB_Param_Helper=`
  void setEffectParam(String instName, String effectType, String paramName, float value) {
    if (effectType.equals("adsr")) {
      float[] adsr = instrumentADSR.get(instName); if (adsr == null) adsr = new float[]{defAdsrA, defAdsrD, defAdsrS, defAdsrR};
      if (paramName.equals("adsrA")) adsr[0] = value; else if (paramName.equals("adsrD")) adsr[1] = value; else if (paramName.equals("adsrS")) adsr[2] = value; else if (paramName.equals("adsrR")) adsr[3] = value;
      instrumentADSR.put(instName, adsr);
      if (currentInstrument.equals(instName)) {
        if (paramName.equals("adsrA")) adsrA = value; else if (paramName.equals("adsrD")) adsrD = value; else if (paramName.equals("adsrS")) adsrS = value; else if (paramName.equals("adsrR")) adsrR = value;
        if (cp5 != null && cp5.getController(paramName) != null) cp5.getController(paramName).setValue(value);
      } return;
    }
    Object effect = null;
    if (effectType.equals("filter")) effect = instrumentFilters.get(instName);
    else if (effectType.equals("reverb")) effect = instrumentReverbs.get(instName);
    else if (effectType.equals("delay")) effect = instrumentDelays.get(instName);
    else if (effectType.equals("bitcrush")) effect = instrumentBitCrushers.get(instName);
    else if (effectType.equals("compressor")) effect = instrumentCompressors.get(instName);
    else if (effectType.equals("limiter")) effect = instrumentLimiters.get(instName);
    else if (effectType.equals("flanger")) effect = instrumentFlangers.get(instName);
    else if (effectType.equals("autofilter")) effect = instrumentAutoFilters.get(instName);
    else if (effectType.equals("pitchmod")) effect = instrumentPitchMods.get(instName);
    else if (effectType.equals("waveshaper")) effect = instrumentWaveshapers.get(instName);
    else if (effectType.equals("panning")) { updatePanning(instName, value); return; }
    if (effect != null) { try { java.lang.reflect.Field f = effect.getClass().getField(paramName); Object control = f.get(effect); java.lang.reflect.Method m = control.getClass().getMethod("setLastValue", float.class); m.invoke(control, value); }
      catch (Exception e) { try { String methodName = "set" + paramName.substring(0,1).toUpperCase() + paramName.substring(1); java.lang.reflect.Method m = effect.getClass().getMethod(methodName, float.class); m.invoke(effect, value); } catch(Exception ex) {} }
    }
  }`,`setEffectParam("${t}", "${n}", "${l}", floatVal(${s}));
`});Blockly.Processing.registerGenerator("sb_update_adsr",function(e){const t=e.getFieldValue("TARGET"),n=Blockly.Processing.valueToCode(e,"A",Blockly.Processing.ORDER_ATOMIC)||"0.01",l=Blockly.Processing.valueToCode(e,"D",Blockly.Processing.ORDER_ATOMIC)||"0.1",s=Blockly.Processing.valueToCode(e,"S",Blockly.Processing.ORDER_ATOMIC)||"0.5",o=Blockly.Processing.valueToCode(e,"R",Blockly.Processing.ORDER_ATOMIC)||"0.5";let i=`instrumentADSR.put("${t}", new float[]{floatVal(${n}), floatVal(${l}), floatVal(${s}), floatVal(${o})});
`;return i+=`if (currentInstrument.equals("${t}")) { adsrA = floatVal(${n}); adsrD = floatVal(${l}); adsrS = floatVal(${s}); adsrR = floatVal(${o}); if (cp5 != null) { cp5.getController("adsrA").setValue(adsrA); cp5.getController("adsrD").setValue(adsrD); cp5.getController("adsrS").setValue(adsrS); cp5.getController("adsrR").setValue(adsrR); } }
`,i});/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Processing.registerGenerator("sb_play_note",function(e){Blockly.Processing.injectAudioCore();const t=e.getFieldValue("NAME"),n=window.SB_Utils.getInstrumentJavaName(t),l=Blockly.Processing.valueToCode(e,"PITCH",Blockly.Processing.ORDER_ATOMIC)||"60",s=Blockly.Processing.valueToCode(e,"VELOCITY",Blockly.Processing.ORDER_ATOMIC)||"100";return`playNoteInternal(${n}, getMidi(${l}), floatVal(${s}));
`});Blockly.Processing.registerGenerator("sb_play_drum",function(e){Blockly.Processing.injectAudioCore();const t=e.getFieldValue("TYPE"),n=Blockly.Processing.valueToCode(e,"VELOCITY",Blockly.Processing.ORDER_ATOMIC)||"100";return`playBuiltinDrum("${t}", floatVal(${n}));
`});Blockly.Processing.registerGenerator("sb_stop_note",function(e){Blockly.Processing.injectAudioCore();const t=e.getFieldValue("NAME"),n=window.SB_Utils.getInstrumentJavaName(t),l=Blockly.Processing.valueToCode(e,"PITCH",Blockly.Processing.ORDER_ATOMIC)||"60";return`stopNoteInternal(${n}, getMidi(${l}));
`});Blockly.Processing.registerGenerator("sb_trigger_sample",function(e){Blockly.Processing.injectAudioCore();const t=e.getFieldValue("NAME"),n=Blockly.Processing.valueToCode(e,"VELOCITY",Blockly.Processing.ORDER_ATOMIC)||"100",l=e.getFieldValue("NOTE")||"C4Q";return`new Thread(new Runnable() { public void run() { parseAndPlayNote("${t}", "${l}", floatVal(${n})); } }).start();
`});Blockly.Processing.registerGenerator("sb_play_melody",function(e){Blockly.Processing.injectAudioCore();const t=e.getFieldValue("MELODY")||"",n=e.getFieldValue("INSTRUMENT"),l=window.SB_Utils.getInstrumentJavaName(n);return`playMelodyInternal("${t.replace(/\n/g," ").replace(/"/g,'\\"')}", ${l});
`});Blockly.Processing.registerGenerator("sb_play_chord_by_name",function(e){Blockly.Processing.injectAudioCore();const t=e.getFieldValue("INST_NAME"),n=window.SB_Utils.getInstrumentJavaName(t),l=e.getFieldValue("NAME"),s=Blockly.Processing.valueToCode(e,"DUR",Blockly.Processing.ORDER_ATOMIC)||'"4n"',o=Blockly.Processing.valueToCode(e,"VELOCITY",Blockly.Processing.ORDER_ATOMIC)||"100";return`{ 
  Object dVal = ${s};
  float ms = (dVal instanceof Number) ? ((Number)dVal).floatValue() : durationToMs(dVal.toString());
  playChordByNameInternal(${n}, "${l}", ms, floatVal(${o}));
}
`});Blockly.Processing.registerGenerator("sb_transport_count_in",function(e){Blockly.Processing.injectAudioCore();const t=Blockly.Processing.valueToCode(e,"MEASURES",Blockly.Processing.ORDER_ATOMIC)||"1",n=Blockly.Processing.valueToCode(e,"BEATS",Blockly.Processing.ORDER_ATOMIC)||"4",l=Blockly.Processing.valueToCode(e,"BEAT_UNIT",Blockly.Processing.ORDER_ATOMIC)||"4",s=Blockly.Processing.valueToCode(e,"VELOCITY",Blockly.Processing.ORDER_ATOMIC)||"100",o=`isCountingIn = true;
  new Thread(new Runnable() {
    public void run() {
      try {
        Thread.sleep(1000); 
        logToScreen("--- COUNT IN START (" + floatVal(${n}) + "/" + floatVal(${l}) + ") ---", 1);
        float beatDelay = (60000.0f / bpm) * (4.0f / floatVal(${l}));
        for (int m=0; m<(int)floatVal(${t}); m++) {
          for (int b=0; b<(int)floatVal(${n}); b++) {
            playClick((b==0 ? 880.0f : 440.0f), floatVal(${s}));
            Thread.sleep((long)beatDelay);
          }
        }
      } catch (Exception e) {
      } finally {
        isCountingIn = false;
        logToScreen("--- PLAY ---", 1);
      }
    }
  }).start();`;return Blockly.Processing.provideSetup(o),""});Blockly.Processing.registerGenerator("sb_transport_set_bpm",function(e){return Blockly.Processing.injectAudioCore(),`bpm = floatVal(${Blockly.Processing.valueToCode(e,"BPM",Blockly.Processing.ORDER_ATOMIC)||"120"});
`});Blockly.Processing.registerGenerator("sb_tone_loop",function(e){Blockly.Processing.injectAudioCore();const t=e.getFieldValue("INTERVAL")||"1m",n=Blockly.Processing.statementToCode(e,"DO"),l=`new Thread(new Runnable() {
    public void run() {
      activeMelodyCount++;
      try { Thread.sleep(200); } catch(Exception e) {}
      int timeout = 0;
      while(isCountingIn && timeout < 500) { try { Thread.sleep(10); timeout++; } catch(Exception e) {} }
      while (true) {
        float ms = 2000;
        String iv = "${t}";
        try {
          if (iv.endsWith("m")) { ms = (60000/bpm) * 4 * (iv.length() > 1 ? Float.parseFloat(iv.substring(0, iv.length()-1)) : 1.0f); }
          else if (iv.endsWith("n")) { ms = (60000/bpm) * (4.0f / Float.parseFloat(iv.substring(0, iv.length()-1))); }
        } catch(Exception e) { ms = (60000/bpm) * 4; }
        
        ${n.replace(/\n/g,`
        `)}
        try { Thread.sleep((long)ms); } catch (Exception e) {}
      }
    }
  }).start();
`;return Blockly.Processing.provideSetup(l),""});Blockly.Processing.registerGenerator("sb_perform",function(e){Blockly.Processing.injectAudioCore();const n=`new Thread(new Runnable() {
    public void run() {
      activeMelodyCount++;
      try { Thread.sleep(200); } catch(Exception e) {}
      int timeout = 0;
      while(isCountingIn && timeout < 500) { try { Thread.sleep(10); timeout++; } catch(Exception e) {} }
      ${Blockly.Processing.statementToCode(e,"DO").replace(/\n/g,`
      `)}
      activeMelodyCount--;
    }
  }).start();
`;return Blockly.Processing.provideSetup(n),""});Blockly.Processing.registerGenerator("sb_rhythm_sequence",function(e){Blockly.Processing.injectAudioCore();const t=e.getFieldValue("SOURCE"),n=e.getFieldValue("PATTERN"),l=Blockly.Processing.valueToCode(e,"MEASURE",Blockly.Processing.ORDER_ATOMIC)||"1",s=Blockly.Processing.valueToCode(e,"VELOCITY",Blockly.Processing.ORDER_ATOMIC)||"100",o=e.getFieldValue("CHORD_MODE")==="TRUE";let i=`new Thread(new Runnable() {
  public void run() {
    int timeout = 0;
`;return i+=`    while(isCountingIn && timeout < 500) { try { Thread.sleep(10); timeout++; } catch(Exception e) {} }
`,i+="    try { Thread.sleep((long)(((floatVal("+l+`)-1) * 4 * 60000) / bpm)); } catch(Exception e) {}
`,i+='    String rawPattern = "'+n+`";
    ArrayList<String> parsed = new ArrayList<String>();
`,i+=`    if (rawPattern.contains(",")) { String[] parts = rawPattern.split(","); for(String p : parts) parsed.add(p.trim()); }
`,i+=`    else { String raw = rawPattern.replace("|", " "); StringBuilder buf = new StringBuilder(); for (int i=0; i<raw.length(); i++) { char c = raw.charAt(i); if (c == ' ') { if (buf.length() > 0) { parsed.add(buf.toString()); buf.setLength(0); } } else if (c == '.' || c == '-') { if (buf.length() > 0) { parsed.add(buf.toString()); buf.setLength(0); } parsed.add(String.valueOf(c)); } else { buf.append(c); } } if (buf.length() > 0) parsed.add(buf.toString()); }
`,i+=`    String[] steps = parsed.toArray(new String[0]); float stepMs = (60000 / bpm) / 4;
`,i+=`    for (int i=0; i<Math.min(steps.length, 16); i++) {
      String token = steps[i].trim(); if (token.equals(".")) { try { Thread.sleep((long)stepMs); } catch (Exception e) {} continue; }
`,i+=`      int sustainSteps = 1; for (int j=i+1; j<Math.min(steps.length, 16); j++) { if (steps[j].trim().equals("-")) sustainSteps++; else break; }
`,i+=`      float noteDur = stepMs * sustainSteps;
      if (!token.equals("-")) {
`,i+='        if (instrumentMap.getOrDefault("'+t+'", "").equals("DRUM")) { if (token.equalsIgnoreCase("x")) { float volScale = instrumentVolumes.getOrDefault("'+t+'", 1.0f); samplerGainMap.get("'+t+'").setValue(map(floatVal('+s+') * volScale, 0, 127, -40, 0)); samplerMap.get("'+t+`").trigger(); } }
`,i+="        else { if ("+o+') { if (token.equals("x")) token = "C"; if (chords.containsKey(token)) playChordByNameInternal("'+t+'", token, noteDur * 0.9f, floatVal('+s+')); else { int midi = noteToMidi(token); if (midi >= 0) playNoteForDuration("'+t+'", midi, floatVal('+s+`), noteDur * 0.9f); } }
`,i+='        else { if (token.equalsIgnoreCase("x")) playNoteForDuration("'+t+'", 60, floatVal('+s+'), noteDur * 0.8f); else { int midi = noteToMidi(token); if (midi >= 0) playNoteForDuration("'+t+'", midi, floatVal('+s+`), noteDur * 0.9f); } } }
      }
`,i+=`      try { Thread.sleep((long)stepMs); } catch (Exception e) {}
    }
  }
}).start();
`,i});Blockly.Processing.registerGenerator("sb_rhythm_sequencer_v2",function(e){const t=e.getFieldValue("MEASURE")||"1",n=e.getFieldValue("BEATS")||"4",l=e.getFieldValue("RESOLUTION")||"4";let s="";for(let o=0;o<e.itemCount_;o++){const i=e.getFieldValue("INST"+o)||"default",a=e.getFieldValue("VEL"+o)||"100",r=e.getFieldValue("MODE"+o)==="TRUE",_=e.getFieldValue("PATTERN"+o)||"";s+=`new Thread(new Runnable() {
  public void run() {
    int timeout = 0; while(isCountingIn && timeout < 500) { try { Thread.sleep(10); timeout++; } catch(Exception e) {} }
`,s+="    try { float beatMs = 60000.0f / bpm; float measureMs = beatMs * "+n+".0f; Thread.sleep((long)((("+t+`-1) * measureMs))); } catch (Exception e) {}
`,s+='    String rawPattern = "'+_+`"; ArrayList<String> parsed = new ArrayList<String>(); StringBuilder buf = new StringBuilder();
`,s+=`    for (int j=0; j<rawPattern.length(); j++) { char c = rawPattern.charAt(j); if (c == ' ') { if (buf.length() > 0) { parsed.add(buf.toString()); buf.setLength(0); } } else if (c == '.' || c == '-' || c == '|') { if (buf.length() > 0) { parsed.add(buf.toString()); buf.setLength(0); } if (c != '|') parsed.add(String.valueOf(c)); } else { buf.append(c); } } if (buf.length() > 0) parsed.add(buf.toString());
`,s+="    String[] steps = parsed.toArray(new String[0]); float stepMs = (60000.0f / bpm) / "+l+`.0f;
`,s+=`    for (int k=0; k<steps.length; k++) { String token = steps[k].trim(); if (token.equals(".") || token.equals("-")) { try { Thread.sleep((long)stepMs); } catch (Exception e) {} continue; }
`,s+=`      int sustainSteps = 1; for (int next=k+1; next<steps.length; next++) { if (steps[next].trim().equals("-")) sustainSteps++; else break; }
`,s+=`      float noteDur = stepMs * sustainSteps; if (token.length() > 0) {
`,s+='        if (instrumentMap.getOrDefault("'+i+'", "").equals("DRUM")) { if (token.equalsIgnoreCase("x")) { float volScale = instrumentVolumes.getOrDefault("'+i+'", 1.0f); samplerGainMap.get("'+i+'").setValue(map('+a+' * volScale, 0, 127, -40, 0)); samplerMap.get("'+i+`").trigger(); } }
`,s+="        else { if ("+r+') { if (token.equals("x")) token = "C"; if (chords.containsKey(token)) playChordByNameInternal("'+i+'", token, noteDur * 0.9f, (float)'+a+'); else { int midi = noteToMidi(token); if (midi >= 0) playNoteForDuration("'+i+'", midi, (float)'+a+`, noteDur * 0.9f); } }
`,s+='        else { if (token.equalsIgnoreCase("x")) playNoteForDuration("'+i+'", 60, (float)'+a+', noteDur * 0.8f); else { int midi = noteToMidi(token); if (midi >= 0) playNoteForDuration("'+i+'", midi, (float)'+a+`, noteDur * 0.9f); } } }
      }
`,s+=`      try { Thread.sleep((long)stepMs); } catch (Exception e) {}
    }
  }
}).start();
`}return s});Blockly.Processing.registerGenerator("sb_musical_section",function(e){const t=Blockly.Processing.valueToCode(e,"DURATION",Blockly.Processing.ORDER_ATOMIC)||"1";return Blockly.Processing.statementToCode(e,"STACK")+`delay((int)((float)(${t}) * 4.0f * 60000.0f / bpm));
`});Blockly.Processing.registerGenerator("sb_wait_musical",function(e){const t=Blockly.Processing.valueToCode(e,"VALUE",Blockly.Processing.ORDER_ATOMIC)||"1",n=e.getFieldValue("UNIT");return n==="BEATS"?`delay((int)((float)(${t}) * 60000.0f / bpm));
`:n==="MEASURES"?`delay((int)((float)(${t}) * 4.0f * 60000.0f / bpm));
`:n==="SECONDS"?`delay((int)((float)(${t}) * 1000.0f));
`:n==="MICROS"?`try { long totalMicros = (long)(${t}); Thread.sleep(totalMicros / 1000, (int)((totalMicros % 1000) * 1000)); } catch(Exception e) {}
`:`delay((int)(${t}));
`});Blockly.Processing.registerGenerator("sb_define_chord",function(e){Blockly.Processing.injectAudioCore();const t=e.getFieldValue("NAME"),n=(e.getFieldValue("NOTES")||"").split(",").map(l=>`"${l.trim()}"`);return`chords.put("${t}", new String[]{${n.join(", ")}});
`});Blockly.Processing.registerGenerator("sb_audio_is_playing",function(e){return["(activeMelodyCount > 0)",Blockly.Processing.ORDER_RELATIONAL]});Blockly.Processing.registerGenerator("sb_wait_until_finished",function(e){return`while(activeMelodyCount > 0) { try { Thread.sleep(50); } catch(Exception e) {} }
`});Blockly.Processing.registerGenerator("sb_select_current_instrument",function(e){return`currentInstrument = "${e.getFieldValue("NAME")}";
`});/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Processing.registerGenerator("visual_size",function(e){return"size("+e.getFieldValue("WIDTH")+", "+e.getFieldValue("HEIGHT")+`);
`});Blockly.Processing.registerGenerator("visual_background",function(e){return"background("+(Blockly.Processing.valueToCode(e,"COLOR",Blockly.Processing.ORDER_ATOMIC)||"color(0)")+`);
`});Blockly.Processing.registerGenerator("visual_constant",function(e){return[e.getFieldValue("CONSTANT"),Blockly.Processing.ORDER_ATOMIC]});Blockly.Processing.registerGenerator("visual_pixel_density",function(e){return`pixelDensity(displayDensity());
`});Blockly.Processing.registerGenerator("visual_frame_rate",function(e){return"frameRate("+(Blockly.Processing.valueToCode(e,"FPS",Blockly.Processing.ORDER_ATOMIC)||"60")+`);
`});Blockly.Processing.registerGenerator("visual_stage_set_color",function(e){var t=e.getFieldValue("TARGET"),n=Blockly.Processing.valueToCode(e,"COLOR",Blockly.Processing.ORDER_ASSIGNMENT)||"color(255)",l=t==="BG"?"stageBgColor":"stageFgColor";return l+" = "+n+`;
`});Blockly.Processing.registerGenerator("visual_color_picker",function(e){var t=e.getFieldValue("COLOR");return[window.SB_Utils.hexToJavaColor(t),Blockly.Processing.ORDER_ATOMIC]});Blockly.Processing.registerGenerator("visual_stage_setup",function(e){Blockly.Processing.injectAudioCore&&Blockly.Processing.injectAudioCore();var t=e.getFieldValue("W"),n=e.getFieldValue("H"),l=e.getFieldValue("BG_COLOR"),s=e.getFieldValue("FG_COLOR");Blockly.Processing.addImport("import ddf.minim.*;"),Blockly.Processing.addImport("import ddf.minim.ugens.*;"),Blockly.Processing.addImport("import ddf.minim.analysis.*;"),Blockly.Processing.addImport("import controlP5.*;"),Blockly.Processing.addImport("import themidibus.*;"),Blockly.Processing.addImport("import processing.serial.*;"),Blockly.Processing.addImport("import java.util.Collections;"),Blockly.Processing.addImport("import java.util.List;"),Blockly.Processing.addImport("import java.util.Arrays;"),Blockly.Processing.addImport("import java.util.HashMap;"),Blockly.Processing.addImport("import java.util.HashSet;"),Blockly.Processing.addImport("import java.awt.Toolkit;"),Blockly.Processing.addImport("import java.awt.datatransfer.*;");var o=Blockly.Processing.global_vars_;o.minim="Minim minim;",o.out="AudioOutput out;",o.fft="FFT fft;",o.cp5="ControlP5 cp5;",o.myBus="MidiBus myBus;",o.serialBaud="int serialBaud = 115200;",o.serialPortVar="Serial myPort;",o.pcKeysHeld="java.util.concurrent.ConcurrentHashMap<Integer, String> pcKeysHeld = new java.util.concurrent.ConcurrentHashMap<Integer, String>();",o.stageBgColor="int stageBgColor;",o.stageFgColor="int stageFgColor;",o.currentSample="Sampler currentSample;",o.waveScale="float waveScale = 2.5;",o.masterGain="float masterGain = -5.0;",o.trailAlpha="float trailAlpha = 100.0;",o.adsrA="float adsrA = 0.01;",o.adsrD="float adsrD = 0.1;",o.adsrS="float adsrS = 0.5;",o.adsrR="float adsrR = 0.5;";var i=window.SB_Utils.hexToHue(s);o.fgHue="float fgHue = "+i+";",o.showWave="boolean showWave = true;",o.showSpec="boolean showSpec = true;",o.showADSR="boolean showADSR = true;",o.showLog="boolean showLog = true;",o.isMidiMode="boolean isMidiMode = false;",o.adsrTimer="int adsrTimer = 0;",o.adsrState="int adsrState = 0;",Blockly.Processing.definitions_.Helpers_Visual=window.SB_JavaLibs.GENERAL_HELPERS;var a=200,r=400,_=parseInt(t)+r,c=parseInt(n)+a;Blockly.Processing.provideSetup("size("+_+", "+c+");","stage_init_size"),Blockly.Processing.provideSetup("pixelDensity(displayDensity());","stage_init_density");var u="stageBgColor = "+window.SB_Utils.hexToJavaColor(l)+`;
stageFgColor = `+window.SB_Utils.hexToJavaColor(s)+`;
adsrState = 0;
fft = new FFT(out.bufferSize(), out.sampleRate());
cp5 = new ControlP5(this);
cp5.setFont(createFont("Arial", 16));
`;u+=`
  // --- Log Textareas --- 
cp5.addTextarea("alertsArea").setPosition(`+t+", 35).setSize("+r+", "+(c/2-35)+`)
   .setFont(createFont("Arial", 18)).setLineHeight(22).setColor(color(255, 100, 100))
   .setColorBackground(color(40, 0, 0));
cp5.addTextarea("consoleArea").setPosition(`+t+", "+(c/2+35)+`)
   .setSize(`+r+", "+(c/2-35)+`).setFont(createFont("Arial", 18))
   .setLineHeight(22).setColor(color(200)).setColorBackground(color(20));
`;var E=parseInt(n)+30,p=20;u+=`
  // --- Control Panel UI ---
`,u+='cp5.addToggle("showWave").setPosition('+p+", "+E+`).setSize(40, 20).setCaptionLabel("WAVE");
`,p+=70,u+='cp5.addToggle("showADSR").setPosition('+p+", "+E+`).setSize(40, 20).setCaptionLabel("ADSR");
`,p+=70,u+='cp5.addToggle("showSpec").setPosition('+p+", "+E+`).setSize(40, 20).setCaptionLabel("SPEC");
`,p+=70,u+='cp5.addToggle("showLog").setPosition('+p+", "+E+`).setSize(40, 20).setCaptionLabel("LOG");
`,p=20;var f=E+65;u+='cp5.addSlider("trailAlpha").setPosition('+p+", "+f+`).setSize(150, 15).setRange(0, 255).setCaptionLabel("TRAIL");
`,f+=30,u+='cp5.addSlider("waveScale").setPosition('+p+", "+f+`).setSize(150, 15).setRange(0.1, 10).setCaptionLabel("SCALE");
`,f+=30,u+='cp5.addSlider("fgHue").setPosition('+p+", "+f+").setSize(150, 15).setRange(0, 255).setValue("+i+`).setCaptionLabel("FG COLOR");
`,p=320;var B=parseInt(n)+85,g=function(d,T,G){return'cp5.addSlider("'+d+'").setPosition('+p+", "+B+").setSize(15, 80).setRange(0, "+G+').setDecimalPrecision(2).setCaptionLabel("'+T+`");
`};u+=g("adsrA","A",2),p+=60,u+=g("adsrD","D",1),p+=60,u+=g("adsrS","S",1),p+=60,u+=g("adsrR","R",2),p+=60,u+='cp5.addSlider("masterGain").setPosition('+p+", "+B+`).setSize(15, 80).setRange(-40, 15).setCaptionLabel("GAIN");
`,p+=100,u+=`String[] serialPorts = Serial.list();
ScrollableList ssl = cp5.addScrollableList("serialInputDevice").setPosition(`+p+", "+(E+40)+`).setSize(300, 150).setBarHeight(30).setItemHeight(25).setCaptionLabel("SERIAL PORT");
for (int i = 0; i < serialPorts.length; i++) { ssl.addItem(serialPorts[i], i); }
ssl.close();
String[] startInputs = MidiBus.availableInputs();
println("--- MIDI Devices ---");
for(String s : startInputs) println("  > " + s);
ScrollableList sl = cp5.addScrollableList("midiInputDevice").setPosition(`+p+", "+E+`).setSize(300, 150).setBarHeight(30).setItemHeight(25).setCaptionLabel("MIDI DEVICE");
for (int i = 0; i < startInputs.length; i++) { sl.addItem(startInputs[i], i); }
if (startInputs.length > 0) sl.setValue(0);
sl.close();
`,u+='cp5.addButton("scanMidi").setPosition('+(p+310)+", "+E+`).setSize(50, 30).setCaptionLabel("SCAN");
`,u+='cp5.addButton("copyLogs").setPosition('+(_-195)+`, 5).setSize(90, 25).setCaptionLabel("COPY LOG");
`,u+='cp5.addButton("clearLogs").setPosition('+(_-100)+`, 5).setSize(90, 25).setCaptionLabel("CLEAR LOG");
`,u+=`logToScreen("System Initialized.", 0);
`,u+=`surface.setTitle("Super Stage");
`,u+=`surface.setVisible(true);
`,u+=`if (surface.getNative() instanceof java.awt.Canvas) { ((java.awt.Canvas)surface.getNative()).requestFocus(); }
`,Blockly.Processing.provideSetup(u,"stage_main_setup");var y=`pushStyle(); colorMode(HSB, 255); stageFgColor = color(fgHue, 255, 255); popStyle();
masterGainUGen.setValue(masterGain); noStroke(); fill(30); rect(0, `+n+", width, "+a+`);
// Peak detection sync with CLIP flag from audio thread
if (out != null) {
  for(int i = 0; i < out.bufferSize(); i++) {
    if (Math.abs(out.mix.get(i)) > 0.99f) { isMasterClipping = true; clippingTimer = millis(); break; }
  }
}
if (isMasterClipping && millis() - clippingTimer > 500) { isMasterClipping = false; }
// Draw rainbow bar behind fgHue slider
pushStyle(); for (int i = 0; i < 150; i++) { colorMode(HSB, 150); stroke(i, 150, 150); line(20 + i, `+(E+125+15+2)+", 20 + i, "+(E+125+15+5)+`); } popStyle();
colorMode(RGB, 255); float currentVisualW = showLog ? `+t+`.0 : width;
noStroke(); fill(stageBgColor, 255 - trailAlpha); rect(0, 0, currentVisualW, `+n+`);
int activeViews = int(showWave) + int(showADSR) + int(showSpec);
if (activeViews > 0) {
  float viewW = currentVisualW / float(activeViews); float currentX = 0;
  stroke(stageFgColor); strokeWeight(2); noFill();
`;return y+=`  if (showWave) {
    pushMatrix(); translate(currentX, 0); stroke(stageFgColor);
    for(int i = 0; i < out.bufferSize() - 1; i++) {
      float x1 = map(i, 0, out.bufferSize(), 0, viewW);
      float x2 = map(i+1, 0, out.bufferSize(), 0, viewW);
      line(x1, `+n+"/2 + out.mix.get(i) * waveScale * 100, x2, "+n+`/2 + out.mix.get(i+1) * waveScale * 100);
    }
    stroke(50); line(viewW, 0, viewW, `+n+`);
    popMatrix(); currentX += viewW;
  }
`,y+=`  if (showADSR) {
    pushMatrix(); translate(currentX, 0); pushStyle(); colorMode(HSB, 255); stroke(color((fgHue + 40)%255, 200, 255));
    float visT = 4.0; float xA = map(adsrA, 0, visT, 0, viewW); float xD = map(adsrA+adsrD, 0, visT, 0, viewW);
    float xS = map(adsrA+adsrD+1.0, 0, visT, 0, viewW); float xR = map(adsrA+adsrD+1.0+adsrR, 0, visT, 0, viewW);
    float yB = `+n+" * 0.9; float yS = yB - (adsrS * "+n+` * 0.7);
    float yP = (adsrD > 0 || adsrS < 1.0) ? `+n+` * 0.2 : yS;
    beginShape(); vertex(0, yB); vertex(xA, yP); vertex(xD, yS); vertex(xS, yS); vertex(xR, yB); endShape();
    float dX = 0; float dY = yB;
    if (adsrState == 1) {
      float e = (millis()-adsrTimer)/1000.0;
      if (e < adsrA) { dX = map(e, 0, adsrA, 0, xA); dY = map(e, 0, adsrA, yB, yP); }
      else if (e < adsrA+adsrD) { dX = map(e, adsrA, adsrA+adsrD, xA, xD); dY = map(e, adsrA, adsrA+adsrD, yP, yS); }
      else { dX = lerp(xD, xS, (sin(millis()*0.005)+1)/2.0); dY = yS; }
    } else if (adsrState == 2) {
      float re = (millis()-adsrTimer)/1000.0;
      if (re < adsrR) { dX = map(re, 0, adsrR, xS, xR); dY = map(re, 0, adsrR, yS, yB); }
      else { adsrState = 0; dX = xR; dY = yB; }
    }
    if (adsrState > 0) { fill(255); ellipse(dX, dY, 8, 8); }
    popStyle(); stroke(50); line(viewW, 0, viewW, `+n+`); popMatrix(); currentX += viewW;
  }
`,y+=`  if (showSpec) {
    pushMatrix(); translate(currentX, 0); pushStyle(); colorMode(HSB, 255); fft.forward(out.mix);
    for(int i = 0; i < fft.specSize(); i++) {
      float x = map(i, 0, fft.specSize(), 0, viewW);
      float y = map(fft.getBand(i), 0, 50, `+n+", "+n+`*0.2);
      stroke((fgHue + map(i, 0, fft.specSize(), 0, 80)) % 255, 200, 255);
      line(x, `+n+`, x, y);
    }
    popStyle(); popMatrix();
  }
}
`,y+=`if (cp5.get(Textarea.class, "alertsArea") != null) {
  if (showLog) {
    cp5.get(Textarea.class, "alertsArea").show(); cp5.get(Textarea.class, "consoleArea").show();
    pushMatrix(); translate(`+t+`, 0); float spH = height / 2.0;
    fill(40, 0, 0); rect(0, 0, `+r+`, spH); fill(255, 100, 100); text("ALERTS", 10, 25);
    translate(0, spH); fill(20); rect(0, 0, `+r+`, height-spH); fill(200); text("CONSOLE", 10, 25);
    popMatrix();
  } else {
    cp5.get(Textarea.class, "alertsArea").hide(); cp5.get(Textarea.class, "consoleArea").hide();
  }
}
`,y+=`if (isMasterClipping) {
  pushStyle(); fill(255, 0, 0, (sin(millis()*0.02)+1)*127); noStroke();
  rect(currentVisualW/2 - 40, 10, 80, 25, 5);
  fill(255); textSize(16); textAlign(CENTER, CENTER);
  text("CLIP", currentVisualW/2, 22);
  popStyle();
}
`,Blockly.Processing.provideDraw(y),Blockly.Processing.definitions_.AudioCore&&Blockly.Processing.provideDraw(`updateInstrumentUISync();
`),""});/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Processing.registerGenerator("visual_rect",function(e){const t=Blockly.Processing.valueToCode(e,"X",Blockly.Processing.ORDER_ATOMIC)||"0",n=Blockly.Processing.valueToCode(e,"Y",Blockly.Processing.ORDER_ATOMIC)||"0",l=Blockly.Processing.valueToCode(e,"W",Blockly.Processing.ORDER_ATOMIC)||"100",s=Blockly.Processing.valueToCode(e,"H",Blockly.Processing.ORDER_ATOMIC)||"100";return`rect(floatVal(${t}), floatVal(${n}), floatVal(${l}), floatVal(${s}));
`});Blockly.Processing.registerGenerator("visual_ellipse",function(e){const t=Blockly.Processing.valueToCode(e,"X",Blockly.Processing.ORDER_ATOMIC)||"0",n=Blockly.Processing.valueToCode(e,"Y",Blockly.Processing.ORDER_ATOMIC)||"0",l=Blockly.Processing.valueToCode(e,"W",Blockly.Processing.ORDER_ATOMIC)||"100",s=Blockly.Processing.valueToCode(e,"H",Blockly.Processing.ORDER_ATOMIC)||"100";return`ellipse(floatVal(${t}), floatVal(${n}), floatVal(${l}), floatVal(${s}));
`});Blockly.Processing.registerGenerator("visual_triangle",function(e){const t=Blockly.Processing.valueToCode(e,"X1",Blockly.Processing.ORDER_ATOMIC)||"0",n=Blockly.Processing.valueToCode(e,"Y1",Blockly.Processing.ORDER_ATOMIC)||"0",l=Blockly.Processing.valueToCode(e,"X2",Blockly.Processing.ORDER_ATOMIC)||"50",s=Blockly.Processing.valueToCode(e,"Y2",Blockly.Processing.ORDER_ATOMIC)||"0",o=Blockly.Processing.valueToCode(e,"X3",Blockly.Processing.ORDER_ATOMIC)||"25",i=Blockly.Processing.valueToCode(e,"Y3",Blockly.Processing.ORDER_ATOMIC)||"50";return`triangle(floatVal(${t}), floatVal(${n}), floatVal(${l}), floatVal(${s}), floatVal(${o}), floatVal(${i}));
`});Blockly.Processing.registerGenerator("visual_line",function(e){const t=Blockly.Processing.valueToCode(e,"X1",Blockly.Processing.ORDER_ATOMIC)||"0",n=Blockly.Processing.valueToCode(e,"Y1",Blockly.Processing.ORDER_ATOMIC)||"0",l=Blockly.Processing.valueToCode(e,"X2",Blockly.Processing.ORDER_ATOMIC)||"100",s=Blockly.Processing.valueToCode(e,"Y2",Blockly.Processing.ORDER_ATOMIC)||"100";return`line(floatVal(${t}), floatVal(${n}), floatVal(${l}), floatVal(${s}));
`});Blockly.Processing.registerGenerator("visual_fill",function(e){return`fill(${Blockly.Processing.valueToCode(e,"COLOR",Blockly.Processing.ORDER_ATOMIC)||"color(255)"});
`});Blockly.Processing.registerGenerator("visual_stroke",function(e){return`stroke(${Blockly.Processing.valueToCode(e,"COLOR",Blockly.Processing.ORDER_ATOMIC)||"color(0)"});
`});Blockly.Processing.registerGenerator("visual_stroke_weight",function(e){return`strokeWeight(floatVal(${Blockly.Processing.valueToCode(e,"WEIGHT",Blockly.Processing.ORDER_ATOMIC)||"1"}));
`});Blockly.Processing.registerGenerator("visual_no_stroke",function(e){return`noStroke();
`});Blockly.Processing.registerGenerator("visual_no_fill",function(e){return`noFill();
`});/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Processing.registerGenerator("visual_rotate",function(e){return`rotate(radians(floatVal(${Blockly.Processing.valueToCode(e,"ANGLE",Blockly.Processing.ORDER_ATOMIC)||"0"})));
`});Blockly.Processing.registerGenerator("visual_translate",function(e){const t=Blockly.Processing.valueToCode(e,"X",Blockly.Processing.ORDER_ATOMIC)||"0",n=Blockly.Processing.valueToCode(e,"Y",Blockly.Processing.ORDER_ATOMIC)||"0";return`translate(floatVal(${t}), floatVal(${n}));
`});Blockly.Processing.registerGenerator("visual_scale",function(e){return`scale(floatVal(${Blockly.Processing.valueToCode(e,"S",Blockly.Processing.ORDER_ATOMIC)||"1.0"}));
`});Blockly.Processing.registerGenerator("visual_push_pop",function(e){return`pushMatrix();
pushStyle();
${Blockly.Processing.statementToCode(e,"STACK")}popStyle();
popMatrix();
`});/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Processing.forBlock.live_set_param=function(e){const t=e.getFieldValue("PARAM"),n=Blockly.Processing.valueToCode(e,"VALUE",Blockly.Processing.ORDER_ASSIGNMENT)||"0";return t.startsWith("adsr")&&!Blockly.Processing.global_vars_[t]&&(Blockly.Processing.global_vars_[t]="float "+t+";"),t+" = (float)("+n+`);
`};Blockly.Processing.forBlock.live_get_param=function(e){return[e.getFieldValue("PARAM"),Blockly.Processing.ORDER_ATOMIC]};Blockly.Processing.forBlock.sb_log_to_screen=function(e){const t=Blockly.Processing.valueToCode(e,"MSG",Blockly.Processing.ORDER_ATOMIC)||'""',n=e.getFieldValue("TYPE");let l="0";return n==="MSG"||n==="1"?l="1":n==="WARN"||n==="2"?l="2":(n==="ERR"||n==="3")&&(l="3"),"logToScreen(String.valueOf("+t+"), "+l+`);
`};/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Processing.forBlock.midi_init=function(e){const t=e.getFieldValue("NAME")||"LP1",n=e.getFieldValue("INPUT"),l=e.getFieldValue("OUTPUT");return Blockly.Processing.imports_.midibus="import themidibus.*;",`println("[DEV] --- Available MIDI Devices ---");
MidiBus.list();
midiBusses.put("${t}", new MidiBus(this, ${n}, ${l}, "${t}"));
`};Blockly.Processing.forBlock.midi_on_note=function(e){const t=e.getFieldValue("BUS_NAME")||"LP1",n=Blockly.Processing.statementToCode(e,"DO");Blockly.Processing.definitions_.midi_events_note_on||(Blockly.Processing.definitions_.midi_events_note_on=[]);const l=`  if (bus_name.equals("${t}")) {
${n}
  }`;return Blockly.Processing.definitions_.midi_events_note_on.push(l),""};Blockly.Processing.forBlock.midi_off_note=function(e){const t=e.getFieldValue("BUS_NAME")||"LP1",n=Blockly.Processing.statementToCode(e,"DO");Blockly.Processing.definitions_.midi_events_note_off||(Blockly.Processing.definitions_.midi_events_note_off=[]);const l=`  if (bus_name.equals("${t}")) {
${n}
  }`;return Blockly.Processing.definitions_.midi_events_note_off.push(l),""};Blockly.Processing.forBlock.midi_on_controller_change=function(e){const t=e.getFieldValue("BUS_NAME")||"LP1",n=Blockly.Processing.statementToCode(e,"DO");Blockly.Processing.definitions_.midi_events_cc||(Blockly.Processing.definitions_.midi_events_cc=[]);const l=`  if (bus_name.equals("${t}")) {
${n}
  }`;return Blockly.Processing.definitions_.midi_events_cc.push(l),""};Blockly.Processing.forBlock.midi_send_note=function(e){const t=e.getFieldValue("BUS_NAME")||"LP1",n=e.getFieldValue("TYPE"),l=Blockly.Processing.valueToCode(e,"CHANNEL",Blockly.Processing.ORDER_ATOMIC)||"0",s=Blockly.Processing.valueToCode(e,"PITCH",Blockly.Processing.ORDER_ATOMIC)||"60",o=Blockly.Processing.valueToCode(e,"VELOCITY",Blockly.Processing.ORDER_ATOMIC)||"100";return`if (midiBusses.containsKey("${t}")) midiBusses.get("${t}").${n==="ON"?"sendNoteOn":"sendNoteOff"}((int)floatVal(${l}), (int)floatVal(${s}), (int)floatVal(${o}));
`};Blockly.Processing.forBlock.midi_send_cc=function(e){const t=e.getFieldValue("BUS_NAME")||"LP1",n=Blockly.Processing.valueToCode(e,"CHANNEL",Blockly.Processing.ORDER_ATOMIC)||"0",l=Blockly.Processing.valueToCode(e,"NUMBER",Blockly.Processing.ORDER_ATOMIC)||"0",s=Blockly.Processing.valueToCode(e,"VALUE",Blockly.Processing.ORDER_ATOMIC)||"0";return`if (midiBusses.containsKey("${t}")) midiBusses.get("${t}").sendControllerChange((int)floatVal(${n}), (int)floatVal(${l}), (int)floatVal(${s}));
`};Blockly.Processing.forBlock.midi_lp_xy_to_note=function(e){const t=Blockly.Processing.valueToCode(e,"X",Blockly.Processing.ORDER_ATOMIC)||"0";return[`((int)floatVal(${Blockly.Processing.valueToCode(e,"Y",Blockly.Processing.ORDER_ATOMIC)||"0"}) * 16 + (int)floatVal(${t}))`,Blockly.Processing.ORDER_MULTIPLICATIVE]};/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Processing.forBlock.serial_init=function(e){const t=e.getFieldValue("INDEX"),n=e.getFieldValue("BAUD");return Blockly.Processing.addImport("import processing.serial.*;"),`println("[DEV] --- Available Serial Ports ---");
println(Serial.list());
serialBaud = ${n};
try {
  myPort = new Serial(this, Serial.list()[${t}], serialBaud);
  myPort.bufferUntil('\\n');
} catch (Exception e) {
  println("Serial Init Failed: " + e.getMessage());
}
`};Blockly.Processing.forBlock.serial_available=function(e){return["(myPort != null && myPort.available() > 0)",Blockly.Processing.ORDER_ATOMIC]};Blockly.Processing.forBlock.serial_read_string=function(e){return[`myPort.readStringUntil('
').trim()`,Blockly.Processing.ORDER_FUNCTION_CALL]};Blockly.Processing.forBlock.sb_serial_write=function(e){return`if (myPort != null) myPort.write(${Blockly.Processing.valueToCode(e,"CONTENT",Blockly.Processing.ORDER_ATOMIC)||'""'});
`};Blockly.Processing.forBlock.sb_serial_data_received=function(e){const t=e.getFieldValue("DATA"),n=Blockly.Processing.nameDB_.getName(t,Blockly.Variables.NAME_TYPE),l=Blockly.Processing.statementToCode(e,"DO");Blockly.Processing.global_vars_[n]="String "+n+' = "";';const s=`
void serialEvent(Serial p) {
  try {
    ${n} = p.readString();
    if (${n} != null) {
      ${n} = ${n}.toString().trim();
      if (${n}.toString().length() > 0) {
        println("[Serial] Received: " + ${n});
        logToScreen("Serial In: " + ${n}, 0);
        ${l}
      }
    }
  } catch (Exception e) {
    println("[Serial Error] " + e.getMessage());
    e.printStackTrace();
  }
}
`;return Blockly.Processing.definitions_.serial_event=s,null};Blockly.Processing.forBlock.serial_check_mask=function(e){const t=Blockly.Processing.valueToCode(e,"MASK",Blockly.Processing.ORDER_BITWISE_AND)||"0",n=e.getFieldValue("KEY")||"1";return["(("+t+" & (1 << ("+n+" - 1))) != 0)",Blockly.Processing.ORDER_RELATIONAL]};Blockly.Processing.forBlock.sb_serial_check_key_mask=function(e){const t=Blockly.Processing.valueToCode(e,"DATA",Blockly.Processing.ORDER_ATOMIC)||'""',n=e.getFieldValue("KEY")||"1";return[Blockly.Processing.provideFunction_("checkKeyMask",`
boolean checkKeyMask(Object dataObj, int key) {
  if (dataObj == null) return false;
  String data = String.valueOf(dataObj).trim();
  int splitIdx = data.indexOf(":");
  if (splitIdx == -1) return false;
  
  String prefix = data.substring(0, splitIdx).toUpperCase();
  String valStr = data.substring(splitIdx + 1).trim();
  
  try {
    int val = Integer.parseInt(valStr);
    if (prefix.equals("KEYS")) {
      // Bitmask mode: check if Nth bit is set
      return (val & (1 << (key - 1))) != 0;
    } else if (prefix.equals("KEY")) {
      // Single key mode: check if index matches
      return val == key;
    }
  } catch(Exception e) {}
  return false;
}
`)+"("+t+", "+n+")",Blockly.Processing.ORDER_FUNCTION_CALL]};/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Processing.forBlock.math_number=function(e){const t=parseFloat(e.getFieldValue("NUM")),n=t>=0?Blockly.Processing.ORDER_ATOMIC:Blockly.Processing.ORDER_SUBTRACTION;return[String(t),n]};Blockly.Processing.forBlock.math_arithmetic=function(e){const n={ADD:[" + ",Blockly.Processing.ORDER_ADDITION],MINUS:[" - ",Blockly.Processing.ORDER_SUBTRACTION],MULTIPLY:[" * ",Blockly.Processing.ORDER_MULTIPLICATION],DIVIDE:[" / ",Blockly.Processing.ORDER_DIVISION],POWER:["pow",Blockly.Processing.ORDER_FUNCTION_CALL]}[e.getFieldValue("OP")],l=n[0],s=n[1],o=Blockly.Processing.valueToCode(e,"A",s)||"0",i=Blockly.Processing.valueToCode(e,"B",s)||"0";let a;return e.getFieldValue("OP")==="POWER"?a="pow(floatVal("+o+"), floatVal("+i+"))":a="floatVal("+o+")"+l+"floatVal("+i+")",[a,s]};Blockly.Processing.forBlock.math_single=function(e){const t=e.getFieldValue("OP");let n,l;if(t==="NEG")return l=Blockly.Processing.valueToCode(e,"NUM",Blockly.Processing.ORDER_SUBTRACTION)||"0",["-floatVal("+l+")",Blockly.Processing.ORDER_SUBTRACTION];l=Blockly.Processing.valueToCode(e,"NUM",Blockly.Processing.ORDER_NONE)||"0";const s="floatVal("+l+")";return t==="ABS"?n="abs("+s+")":t==="ROOT"?n="sqrt("+s+")":t==="SIN"?n="sin("+s+")":t==="COS"?n="cos("+s+")":t==="TAN"&&(n="tan("+s+")"),[n,Blockly.Processing.ORDER_FUNCTION_CALL]};Blockly.Processing.forBlock.math_number_property=function(e){const n="floatVal("+(Blockly.Processing.valueToCode(e,"NUMBER_TO_CHECK",Blockly.Processing.ORDER_RELATIONAL)||"0")+")",l=e.getFieldValue("PROPERTY");let s;if(l==="EVEN")s=n+" % 2 == 0";else if(l==="ODD")s=n+" % 2 != 0";else if(l==="WHOLE")s=n+" % 1 == 0";else if(l==="POSITIVE")s=n+" > 0";else if(l==="NEGATIVE")s=n+" < 0";else if(l==="DIVISIBLE_BY"){const o=Blockly.Processing.valueToCode(e,"DIVISOR",Blockly.Processing.ORDER_RELATIONAL)||"1";s=n+" % floatVal("+o+") == 0"}return[s,Blockly.Processing.ORDER_RELATIONAL]};Blockly.Processing.forBlock.math_round=function(e){const t=e.getFieldValue("OP"),l="floatVal("+(Blockly.Processing.valueToCode(e,"NUM",Blockly.Processing.ORDER_NONE)||"0")+")";let s;return t==="ROUND"?s="round("+l+")":t==="ROUNDUP"?s="ceil("+l+")":t==="ROUNDDOWN"&&(s="floor("+l+")"),[s,Blockly.Processing.ORDER_FUNCTION_CALL]};Blockly.Processing.forBlock.math_constrain=function(e){const t=Blockly.Processing.valueToCode(e,"VALUE",Blockly.Processing.ORDER_NONE)||"0",n=Blockly.Processing.valueToCode(e,"LOW",Blockly.Processing.ORDER_NONE)||"0",l=Blockly.Processing.valueToCode(e,"HIGH",Blockly.Processing.ORDER_NONE)||"100";return["constrain(floatVal("+t+"), floatVal("+n+"), floatVal("+l+"))",Blockly.Processing.ORDER_FUNCTION_CALL]};Blockly.Processing.forBlock.math_modulo=function(e){const t=Blockly.Processing.valueToCode(e,"DIVIDEND",Blockly.Processing.ORDER_DIVISION)||"0",n=Blockly.Processing.valueToCode(e,"DIVISOR",Blockly.Processing.ORDER_DIVISION)||"0";return["floatVal("+t+") % floatVal("+n+")",Blockly.Processing.ORDER_DIVISION]};Blockly.Processing.forBlock.math_map=function(e){const t=Blockly.Processing.valueToCode(e,"VALUE",Blockly.Processing.ORDER_NONE)||"0",n=Blockly.Processing.valueToCode(e,"FROM_LOW",Blockly.Processing.ORDER_NONE)||"0",l=Blockly.Processing.valueToCode(e,"FROM_HIGH",Blockly.Processing.ORDER_NONE)||"1023",s=Blockly.Processing.valueToCode(e,"TO_LOW",Blockly.Processing.ORDER_NONE)||"0",o=Blockly.Processing.valueToCode(e,"TO_HIGH",Blockly.Processing.ORDER_NONE)||"255";return["map(floatVal("+t+"), floatVal("+n+"), floatVal("+l+"), floatVal("+s+"), floatVal("+o+"))",Blockly.Processing.ORDER_FUNCTION_CALL]};Blockly.Processing.forBlock.math_random_int=function(e){const t=Blockly.Processing.valueToCode(e,"FROM",Blockly.Processing.ORDER_NONE)||"0",n=Blockly.Processing.valueToCode(e,"TO",Blockly.Processing.ORDER_NONE)||"0";return["int(random(floatVal("+t+"), floatVal("+n+")))",Blockly.Processing.ORDER_FUNCTION_CALL]};/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Processing.forBlock.ui_init=function(e){return Blockly.Processing.imports_.controlp5="import controlP5.*;",Blockly.Processing.global_vars_.cp5="ControlP5 cp5;",`cp5 = new ControlP5(this);
`};Blockly.Processing.forBlock.ui_add_slider=function(e){const t=e.getFieldValue("VAR"),n=e.getFieldValue("LABEL"),l=e.getFieldValue("X"),s=e.getFieldValue("Y"),o=e.getFieldValue("W"),i=e.getFieldValue("H"),a=e.getFieldValue("MIN"),r=e.getFieldValue("MAX"),_=e.getFieldValue("VAL");return Blockly.Processing.global_vars_[t]=`float ${t} = ${_};`,`cp5.addSlider("${t}")
     .setPosition(${l}, ${s})
     .setSize(${o}, ${i})
     .setRange(${a}, ${r})
     .setValue(${_})
     .setCaptionLabel("${n}");
`};Blockly.Processing.forBlock.ui_add_toggle=function(e){const t=e.getFieldValue("VAR"),n=e.getFieldValue("LABEL"),l=e.getFieldValue("X"),s=e.getFieldValue("Y"),o=e.getFieldValue("STATE")==="TRUE";return Blockly.Processing.global_vars_["var_"+t]=`boolean ${t} = ${o};`,`cp5.addToggle("${t}")
     .setPosition(${l}, ${s})
     .setSize(50, 20)
     .setState(${o})
     .setCaptionLabel("${n}");
`};Blockly.Processing.forBlock.ui_set_font_size=function(e){return`cp5.setFont(createFont("Arial", ${e.getFieldValue("SIZE")}));
`};Blockly.Processing.forBlock.ui_key_event=function(e){const t=e.getFieldValue("KEY"),n=e.getFieldValue("MODE")||"PRESSED",l=Blockly.Processing.statementToCode(e,"DO");return Blockly.Processing.keyEvents_||(Blockly.Processing.keyEvents_=[]),Blockly.Processing.keyEvents_.push({key:t.toLowerCase(),mode:n,code:l}),Blockly.Processing.definitions_.Helpers||(Blockly.Processing.definitions_.Helpers=`
void keyPressed() {
  char k = Character.toLowerCase(key);
  {{KEY_PRESSED_EVENT_PLACEHOLDER}}
}

void keyReleased() {
  char k = Character.toLowerCase(key);
  {{KEY_RELEASED_EVENT_PLACEHOLDER}}
}
    `),""};/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Processing.forBlock.sb_comment=function(e){return""};/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Processing.forBlock.variables_get=function(e){var i;const t=e.getFieldValue("VAR");let n=Blockly.Processing.nameDB_.getName(t,Blockly.Variables.NAME_TYPE);const l=["waveScale","masterGain","pitch","velocity","channel","isMidiMode","trailAlpha","stageBgColor","stageFgColor","adsrA","adsrD","adsrS","adsrR"],s=["stageBgColor","stageFgColor","pitch","velocity","channel"],o=(i=e.workspace.getVariableMap().getVariableById(t))==null?void 0:i.name;if(o&&l.includes(o)&&(n=o),!Blockly.Processing.global_vars_[n]){let a="Object",r='"0"';s.includes(n)?(a="int",r="0"):l.includes(n)&&(a="float",r="0.0f"),Blockly.Processing.global_vars_[n]=a+" "+n+" = "+r+";"}return[n,Blockly.Processing.ORDER_ATOMIC]};Blockly.Processing.forBlock.variables_set=function(e){var a;const t=Blockly.Processing.valueToCode(e,"VALUE",Blockly.Processing.ORDER_ASSIGNMENT)||"0",n=e.getFieldValue("VAR");let l=Blockly.Processing.nameDB_.getName(n,Blockly.Variables.NAME_TYPE);const s=["waveScale","masterGain","pitch","velocity","channel","isMidiMode","trailAlpha","stageBgColor","stageFgColor","adsrA","adsrD","adsrS","adsrR"],o=["stageBgColor","stageFgColor","pitch","velocity","channel"],i=(a=e.workspace.getVariableMap().getVariableById(n))==null?void 0:a.name;if(i&&s.includes(i)&&(l=i),!Blockly.Processing.global_vars_[l]){let r="Object",_='"0"';o.includes(l)?(r="int",_="0"):s.includes(l)&&(r="float",_="0.0f"),Blockly.Processing.global_vars_[l]=r+" "+l+" = "+_+";"}return l+" = "+t+`;
`};/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */const $=e=>{const t=Blockly.getMainWorkspace();if(!t)return!1;const n=e.replace(/^String\.valueOf\((.*)\)$/,"$1").trim(),l=t.getVariable(n);return l&&l.type==="String"||n.toLowerCase().includes("text")||n.toLowerCase().includes("msg")||e.includes("String.valueOf")||e.includes('"')};Blockly.Processing.forBlock.controls_if=function(e){let t=0,n="";do{const l=Blockly.Processing.valueToCode(e,"IF"+t,Blockly.Processing.ORDER_NONE)||"false",s=Blockly.Processing.statementToCode(e,"DO"+t);n+=(t>0?" else ":"")+"if ("+l+`) {
`+s+"}",t++}while(e.getInput("IF"+t));return e.getInput("ELSE")&&(n+=` else {
`+Blockly.Processing.statementToCode(e,"ELSE")+"}"),n+`
`};Blockly.Processing.forBlock.logic_compare=function(e){const t=e.getFieldValue("OP"),n=Blockly.Processing.ORDER_RELATIONAL,l=Blockly.Processing.valueToCode(e,"A",n)||"0",s=Blockly.Processing.valueToCode(e,"B",n)||"0",o=['"',"serial_data","last_state","received",".substring",".trim","String.valueOf"],i=o.some(u=>l.includes(u))&&!l.includes(".length()"),a=o.some(u=>s.includes(u))&&!s.includes(".length()"),r=/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(l);if((l.includes('"')||s.includes('"')||(i||a)&&(!r||$(l)))&&(t==="EQ"||t==="NEQ"))return t==="EQ"?[l+".equals("+s+")",Blockly.Processing.ORDER_FUNCTION_CALL]:["!"+l+".equals("+s+")",Blockly.Processing.ORDER_FUNCTION_CALL];const c={EQ:"==",NEQ:"!=",LT:"<",LTE:"<=",GT:">",GTE:">="}[t];return["floatVal("+l+") "+c+" floatVal("+s+")",n]};Blockly.Processing.forBlock.logic_operation=function(e){const t=e.getFieldValue("OP")==="AND"?"&&":"||",n=t==="&&"?Blockly.Processing.ORDER_LOGICAL_AND:Blockly.Processing.ORDER_LOGICAL_OR,l=Blockly.Processing.valueToCode(e,"A",n)||"false",s=Blockly.Processing.valueToCode(e,"B",n)||"false";return[l+" "+t+" "+s,n]};Blockly.Processing.forBlock.logic_negate=function(e){return["!"+(Blockly.Processing.valueToCode(e,"BOOL",4)||"true"),4]};Blockly.Processing.forBlock.logic_boolean=function(e){return[e.getFieldValue("BOOL")==="TRUE"?"true":"false",Blockly.Processing.ORDER_ATOMIC]};Blockly.Processing.forBlock.logic_null=function(e){return["null",Blockly.Processing.ORDER_ATOMIC]};Blockly.Processing.forBlock.logic_ternary=function(e){const t=Blockly.Processing.valueToCode(e,"IF",Blockly.Processing.ORDER_RELATIONAL)||"false",n=Blockly.Processing.valueToCode(e,"THEN",Blockly.Processing.ORDER_RELATIONAL)||"null",l=Blockly.Processing.valueToCode(e,"ELSE",Blockly.Processing.ORDER_RELATIONAL)||"null";return[t+" ? "+n+" : "+l,Blockly.Processing.ORDER_RELATIONAL]};/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Processing.forBlock.controls_repeat_ext=function(e){let t;e.getField("TIMES")?t=String(Number(e.getFieldValue("TIMES"))):t=Blockly.Processing.valueToCode(e,"TIMES",Blockly.Processing.ORDER_ASSIGNMENT)||"0";let n=Blockly.Processing.statementToCode(e,"DO");const l=Blockly.Processing.nameDB_.getDistinctName("count",Blockly.Variables.NAME_TYPE);return"for (int "+l+" = 0; "+l+" < "+t+"; "+l+`++) {
`+n+`}
`};Blockly.Processing.forBlock.controls_whileUntil=function(e){const t=e.getFieldValue("MODE")==="UNTIL";let n=Blockly.Processing.valueToCode(e,"BOOL",t?Blockly.Processing.ORDER_LOGICAL_NOT:Blockly.Processing.ORDER_NONE)||"false",l=Blockly.Processing.statementToCode(e,"DO");return t&&(n="!"+n),"while ("+n+`) {
`+l+`}
`};Blockly.Processing.forBlock.controls_for=function(e){const t=e.getFieldValue("VAR"),n=Blockly.Processing.nameDB_.getName(t,Blockly.Variables.NAME_TYPE),l=Blockly.Processing.valueToCode(e,"FROM",Blockly.Processing.ORDER_ASSIGNMENT)||"0",s=Blockly.Processing.valueToCode(e,"TO",Blockly.Processing.ORDER_ASSIGNMENT)||"0",o=Blockly.Processing.valueToCode(e,"BY",Blockly.Processing.ORDER_ASSIGNMENT)||"1";let i=Blockly.Processing.statementToCode(e,"DO");Blockly.Processing.global_vars_[n]="float "+n+" = 0.0f;";let a;const r=_=>!isNaN(parseFloat(_))&&isFinite(_);if(r(l)&&r(s)&&r(o)){const _=Number(l)<=Number(s);a="for ("+n+" = "+l+"; "+n+(_?" <= ":" >= ")+s+"; "+n;const c=Math.abs(Number(o));c===1?a+=_?"++":"--":a+=(_?" += ":" -= ")+c,a+=`) {
`+i+`}
`}else a="for ("+n+" = floatVal("+l+"); "+n+" <= floatVal("+s+"); "+n+" += floatVal("+o+`)) {
`+i+`}
`;return a};Blockly.Processing.forBlock.controls_forEach=function(e){const t=Blockly.Processing.nameDB_.getName(e.getFieldValue("VAR"),Blockly.Variables.NAME_TYPE),n=Blockly.Processing.valueToCode(e,"LIST",Blockly.Processing.ORDER_ASSIGNMENT)||"new ArrayList()";let l=Blockly.Processing.statementToCode(e,"DO");return"for (Object "+t+" : "+n+`) {
`+l+`}
`};Blockly.Processing.forBlock.controls_flow_statements=function(e){switch(e.getFieldValue("FLOW")){case"BREAK":return`break;
`;case"CONTINUE":return`continue;
`}throw Error("Unknown flow statement.")};/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Processing.forBlock.text=function(e){return[Blockly.Processing.quote_(e.getFieldValue("TEXT")),Blockly.Processing.ORDER_ATOMIC]};Blockly.Processing.forBlock.text_join=function(e){if(e.itemCount_===0)return['""',Blockly.Processing.ORDER_ATOMIC];{const t=new Array(e.itemCount_);for(let l=0;l<e.itemCount_;l++){const s=Blockly.Processing.valueToCode(e,"ADD"+l,Blockly.Processing.ORDER_NONE)||'""';t[l]="String.valueOf("+s+")"}return[t.join(" + "),Blockly.Processing.ORDER_ADDITION]}};Blockly.Processing.forBlock.text_append=function(e){const t=e.getFieldValue("VAR"),n=Blockly.Processing.nameDB_.getName(t,Blockly.Variables.NAME_TYPE),l=Blockly.Processing.valueToCode(e,"TEXT",Blockly.Processing.ORDER_NONE)||'""';return n+" = "+n+" + String.valueOf("+l+`);
`};Blockly.Processing.forBlock.text_length=function(e){return["String.valueOf("+(Blockly.Processing.valueToCode(e,"VALUE",Blockly.Processing.ORDER_MEMBER)||'""')+").length()",Blockly.Processing.ORDER_FUNCTION_CALL]};Blockly.Processing.forBlock.text_isEmpty=function(e){return["String.valueOf("+(Blockly.Processing.valueToCode(e,"VALUE",Blockly.Processing.ORDER_MEMBER)||'""')+").isEmpty()",Blockly.Processing.ORDER_FUNCTION_CALL]};Blockly.Processing.forBlock.text_indexOf=function(e){const t=e.getFieldValue("END")==="FIRST"?"indexOf":"lastIndexOf",n=Blockly.Processing.valueToCode(e,"FIND",Blockly.Processing.ORDER_NONE)||'""';return["String.valueOf("+(Blockly.Processing.valueToCode(e,"VALUE",Blockly.Processing.ORDER_MEMBER)||'""')+")"+"."+t+"(String.valueOf("+n+")) + 1",Blockly.Processing.ORDER_ADDITION]};Blockly.Processing.forBlock.text_charAt=function(e){const t=e.getFieldValue("WHERE"),l="String.valueOf("+(Blockly.Processing.valueToCode(e,"VALUE",Blockly.Processing.ORDER_MEMBER)||'""')+")";switch(t){case"FROM_START":const s=Blockly.Processing.getRelativeIndex(e,"AT");return[l+".substring((int)("+s+"), (int)("+s+") + 1)",Blockly.Processing.ORDER_FUNCTION_CALL];case"FIRST":return[l+".substring(0, 1)",Blockly.Processing.ORDER_FUNCTION_CALL];case"LAST":return[l+".substring("+l+".length() - 1)",Blockly.Processing.ORDER_FUNCTION_CALL];case"RANDOM":const o="int(random("+l+".length()))";return[l+".substring("+o+", "+o+" + 1)",Blockly.Processing.ORDER_FUNCTION_CALL]}return[l+".substring(0, 1)",Blockly.Processing.ORDER_FUNCTION_CALL]};Blockly.Processing.forBlock.text_trim=function(e){return["String.valueOf("+(Blockly.Processing.valueToCode(e,"TEXT",Blockly.Processing.ORDER_MEMBER)||'""')+").trim()",Blockly.Processing.ORDER_FUNCTION_CALL]};Blockly.Processing.forBlock.text_print=function(e){return'println("[USER] " + '+(Blockly.Processing.valueToCode(e,"TEXT",Blockly.Processing.ORDER_NONE)||'""')+`);
`};/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */const h=()=>{Blockly.Processing.addImport("import java.util.*;")};Blockly.Processing.forBlock.lists_create_empty=function(e){return h(),["new ArrayList<Object>()",Blockly.Processing.ORDER_ATOMIC]};Blockly.Processing.forBlock.lists_create_with=function(e){h();const t=new Array(e.itemCount_);for(let l=0;l<e.itemCount_;l++)t[l]=Blockly.Processing.valueToCode(e,"ADD"+l,Blockly.Processing.ORDER_NONE)||"null";return["new ArrayList<Object>(Arrays.asList("+t.join(", ")+"))",Blockly.Processing.ORDER_ATOMIC]};Blockly.Processing.forBlock.lists_length=function(e){return h(),[(Blockly.Processing.valueToCode(e,"VALUE",Blockly.Processing.ORDER_MEMBER)||"new ArrayList()")+".size()",Blockly.Processing.ORDER_FUNCTION_CALL]};Blockly.Processing.forBlock.lists_isEmpty=function(e){return h(),[(Blockly.Processing.valueToCode(e,"VALUE",Blockly.Processing.ORDER_MEMBER)||"new ArrayList()")+".isEmpty()",Blockly.Processing.ORDER_FUNCTION_CALL]};Blockly.Processing.forBlock.lists_getIndex=function(e){h();const t=Blockly.Processing.valueToCode(e,"VALUE",Blockly.Processing.ORDER_MEMBER)||"new ArrayList()",n=Blockly.Processing.getRelativeIndex(e,"AT");return[t+".get((int)("+n+"))",Blockly.Processing.ORDER_FUNCTION_CALL]};Blockly.Processing.forBlock.lists_setIndex=function(e){h();const t=Blockly.Processing.valueToCode(e,"LIST",Blockly.Processing.ORDER_MEMBER)||"new ArrayList()",n=e.getFieldValue("MODE")||"SET",l=Blockly.Processing.valueToCode(e,"TO",Blockly.Processing.ORDER_ASSIGNMENT)||"null",s=Blockly.Processing.getRelativeIndex(e,"AT");return n==="SET"?t+".set((int)("+s+"), "+l+`);
`:n==="INSERT"?t+".add((int)("+s+"), "+l+`);
`:""};Blockly.Processing.forBlock.lists_split=function(e){h();const t=Blockly.Processing.valueToCode(e,"INPUT",Blockly.Processing.ORDER_MEMBER)||'""',n=Blockly.Processing.valueToCode(e,"DELIM",Blockly.Processing.ORDER_NONE)||'""',l=e.getFieldValue("MODE"),s="String.valueOf("+t+")";return l==="SPLIT"?["new ArrayList<Object>(Arrays.asList("+s+".split("+n+")))",Blockly.Processing.ORDER_ATOMIC]:["String.join("+n+", "+t+")",Blockly.Processing.ORDER_ATOMIC]};/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */Blockly.Processing.forBlock.procedures_defnoreturn=function(e){const t=Blockly.Processing.nameDB_.getName(e.getFieldValue("NAME"),Blockly.PROCEDURE_CATEGORY_NAME);let n=Blockly.Processing.statementToCode(e,"STACK");const l=[],s=e.getVars();for(let i=0;i<s.length;i++)l.push("float "+Blockly.Processing.nameDB_.getName(s[i],Blockly.Variables.NAME_TYPE));let o="void "+t+"("+l.join(", ")+`) {
`+n+`}
`;return Blockly.Processing.definitions_["%"+t]=o,null};Blockly.Processing.forBlock.procedures_defreturn=function(e){const t=Blockly.Processing.nameDB_.getName(e.getFieldValue("NAME"),Blockly.PROCEDURE_CATEGORY_NAME);let n=Blockly.Processing.statementToCode(e,"STACK"),l=Blockly.Processing.valueToCode(e,"RETURN",Blockly.Processing.ORDER_NONE)||"";l&&(l="  return "+l+`;
`);const s=[],o=e.getVars();for(let a=0;a<o.length;a++)s.push("float "+Blockly.Processing.nameDB_.getName(o[a],Blockly.Variables.NAME_TYPE));let i="float "+t+"("+s.join(", ")+`) {
`+n+l+`}
`;return Blockly.Processing.definitions_["%"+t]=i,null};Blockly.Processing.forBlock.procedures_callnoreturn=function(e){const t=Blockly.Processing.nameDB_.getName(e.getFieldValue("NAME"),Blockly.PROCEDURE_CATEGORY_NAME),n=[],l=e.getVars();for(let s=0;s<l.length;s++)n.push(Blockly.Processing.valueToCode(e,"ARG"+s,Blockly.Processing.ORDER_NONE)||"0");return t+"("+n.join(", ")+`);
`};Blockly.Processing.forBlock.procedures_callreturn=function(e){const t=Blockly.Processing.nameDB_.getName(e.getFieldValue("NAME"),Blockly.PROCEDURE_CATEGORY_NAME),n=[],l=e.getVars();for(let o=0;o<l.length;o++)n.push(Blockly.Processing.valueToCode(e,"ARG"+o,Blockly.Processing.ORDER_NONE)||"0");return[t+"("+n.join(", ")+")",Blockly.Processing.ORDER_FUNCTION_CALL]};Blockly.Processing.forBlock.procedures_ifreturn=function(e){let n="if ("+(Blockly.Processing.valueToCode(e,"CONDITION",Blockly.Processing.ORDER_NONE)||"false")+`) {
`;if(e.hasReturnValue_){const l=Blockly.Processing.valueToCode(e,"VALUE",Blockly.Processing.ORDER_NONE)||"0";n+="  return "+l+`;
`}else n+=`  return;
`;return n+=`}
`,n};const W=window.__TAURI__?window.__TAURI__.core?window.__TAURI__.core.invoke:window.__TAURI__.invoke:null,O={_execId:0,isAlive:e=>{if(e!==O._execId)throw"Script cancelled";return!0},getCurrentId:()=>O._execId,reset:async()=>{O._execId++},sleep:e=>{const t=O._execId;return new Promise((n,l)=>{setTimeout(()=>{t===O._execId?n():l("Script cancelled")},e)})},stop:async()=>{await O.reset()},getInvoke:()=>W};window.HarmoNyx=O;const j=`
<xml>
    <sep></sep>
    <!-- 1. Processing Structure -->
    <category name="%{BKY_CAT_STRUCTURE}" colour="%{BKY_STRUCTURE_HUE}">
        <block type="processing_setup"></block>
        <block type="processing_draw"></block>
        <block type="processing_exit"></block>
    </category>

    <sep></sep>

    <!-- 2. Logic -->
    <category name="%{BKY_CAT_LOGIC}" colour="%{BKY_LOGIC_HUE}">
        <block type="controls_if"></block>
        <block type="logic_compare"></block>
        <block type="logic_operation"></block>
        <block type="logic_negate"></block>
        <block type="logic_boolean"></block>
        <block type="logic_null"></block>
        <block type="logic_ternary"></block>
    </category>

    <!-- 3. Loops -->
    <category name="%{BKY_CAT_LOOPS}" colour="%{BKY_LOOPS_HUE}">
        <block type="controls_repeat_ext">
            <value name="TIMES">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="controls_whileUntil"></block>
        <block type="controls_for">
            <value name="FROM">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TO">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
            <value name="BY">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="controls_forEach"></block>
        <block type="controls_flow_statements"></block>
    </category>

    <!-- 4. Math -->
    <category name="%{BKY_CAT_MATH}" colour="%{BKY_MATH_HUE}">
        <block type="math_number"></block>
        <block type="math_arithmetic">
            <value name="A">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="B">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="math_single"></block>
        <block type="math_trig"></block>
        <block type="math_constant"></block>
        <block type="math_number_property"></block>
        <block type="math_round"></block>
        <block type="math_modulo"></block>
        <block type="math_map">
            <value name="FROM_LOW">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="FROM_HIGH">
                <shadow type="math_number">
                    <field name="NUM">127</field>
                </shadow>
            </value>
            <value name="TO_LOW">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="TO_HIGH">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="math_constrain">
            <value name="LOW">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="HIGH">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
    </category>

    <!-- 5. Text -->
    <category name="%{BKY_CAT_TEXT}" colour="%{BKY_TEXT_HUE}">
        <block type="text"></block>
        <block type="text_join"></block>
        <block type="text_append">
            <value name="TEXT">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="text_length"></block>
        <block type="text_isEmpty"></block>
        <block type="text_charAt"></block>
        <block type="text_print"></block>
    </category>

    <!-- 6. Lists -->
    <category name="%{BKY_CAT_LISTS}" colour="%{BKY_LISTS_HUE}">
        <block type="lists_create_empty"></block>
        <block type="lists_create_with"></block>
        <block type="lists_length"></block>
        <block type="lists_isEmpty"></block>
        <block type="lists_getIndex"></block>
        <block type="lists_setIndex"></block>
        <block type="lists_split">
            <value name="DELIM">
                <shadow type="text">
                    <field name="TEXT">,</field>
                </shadow>
            </value>
        </block>
    </category>

    <sep></sep>

    <!-- 7. Variables , Functions & Tools-->
    <category name="%{BKY_CAT_VARIABLES}" colour="%{BKY_VARIABLES_HUE}" custom="VARIABLE"></category>
    <category name="%{BKY_CAT_FUNCTIONS}" colour="%{BKY_FUNCTIONS_HUE}" custom="PROCEDURE"></category>
    <category name="%{BKY_CAT_TOOLS}" colour="%{BKY_TOOLS_HUE}">
        <block type="sb_comment"></block>
    </category>

    <sep></sep>

    <!-- 8. Live Show (Management) -->
    <category name="%{BKY_CAT_LIVE_SHOW}" colour="%{BKY_LIVE_SHOW_HUE}">
        <block type="visual_stage_setup"></block>
        <block type="visual_stage_set_color">
            <value name="COLOR">
                <shadow type="visual_color_picker"></shadow>
            </value>
        </block>
        <block type="live_set_param">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="live_get_param"></block>
        <block type="sb_log_to_screen">
            <value name="MSG">
                <shadow type="text">
                    <field name="TEXT">Hello</field>
                </shadow>
            </value>
        </block>
    </category>

    <!-- 9. Sound Sources -->
    <category name="%{BKY_CAT_SOUND_SOURCES}" colour="%{BKY_SOUND_SOURCES_HUE}">
        <block type="sb_minim_init"></block>
        <block type="sb_instrument_container"></block>
        <block type="sb_set_wave"></block>
        <block type="sb_set_noise"></block>
        <block type="sb_mixed_source">
            <value name="LEVEL">
                <shadow type="math_number">
                    <field name="NUM">30</field>
                </shadow>
            </value>
        </block>
        <block type="sb_create_harmonic_synth"></block>
        <block type="sb_create_additive_synth"></block>
        <block type="sb_melodic_sampler"></block>
        <block type="sb_drum_sampler"></block>
    </category>

    <!-- 10. Instrument Control -->
    <category name="%{BKY_CAT_INSTRUMENT_CONTROL}" colour="%{BKY_INSTRUMENT_CONTROL_HUE}">
        <block type="sb_set_panning">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="sb_set_instrument_volume">
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="sb_set_adsr">
            <value name="A">
                <shadow type="math_number">
                    <field name="NUM">0.01</field>
                </shadow>
            </value>
            <value name="D">
                <shadow type="math_number">
                    <field name="NUM">0.1</field>
                </shadow>
            </value>
            <value name="S">
                <shadow type="math_number">
                    <field name="NUM">0.5</field>
                </shadow>
            </value>
            <value name="R">
                <shadow type="math_number">
                    <field name="NUM">0.5</field>
                </shadow>
            </value>
        </block>
        <block type="sb_update_adsr">
            <value name="A">
                <shadow type="math_number">
                    <field name="NUM">0.01</field>
                </shadow>
            </value>
            <value name="D">
                <shadow type="math_number">
                    <field name="NUM">0.1</field>
                </shadow>
            </value>
            <value name="S">
                <shadow type="math_number">
                    <field name="NUM">0.5</field>
                </shadow>
            </value>
            <value name="R">
                <shadow type="math_number">
                    <field name="NUM">0.5</field>
                </shadow>
            </value>
        </block>
    </category>

    <!-- 11. Audio Effects -->
    <category name="%{BKY_CAT_EFFECTS}" colour="%{BKY_EFFECTS_HUE}">
        <block type="sb_setup_effect">
            <mutation effect_type="filter"></mutation>
            <field name="EFFECT_TYPE">filter</field>
            <value name="FILTER_FREQ">
                <shadow type="math_number">
                    <field name="NUM">1000</field>
                </shadow>
            </value>
            <value name="FILTER_Q">
                <shadow type="math_number">
                    <field name="NUM">0.5</field>
                </shadow>
            </value>
        </block>
        <block type="sb_set_effect_param">
            <mutation effect_type="panning"></mutation>
            <field name="EFFECT_TYPE">panning</field>
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
    </category>

    <!-- 12. Performance -->
    <category name="%{BKY_CAT_PERFORMANCE}" colour="%{BKY_PERFORMANCE_HUE}">
        <!-- 選擇樂器 -->
        <block type="sb_select_current_instrument"></block>
        <!-- 設定速度 -->
        <block type="sb_transport_set_bpm">
            <value name="BPM">
                <shadow type="math_number">
                    <field name="NUM">120</field>
                </shadow>
            </value>
        </block>
        <!-- 預備拍 -->
        <block type="sb_transport_count_in">
            <value name="MEASURES">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="BEATS">
                <shadow type="math_number">
                    <field name="NUM">4</field>
                </shadow>
            </value>
            <value name="BEAT_UNIT">
                <shadow type="math_number">
                    <field name="NUM">4</field>
                </shadow>
            </value>
            <value name="VELOCITY">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <!-- 定義和弦 -->
        <block type="sb_define_chord"></block>
        <!-- 演奏持續音 (MIDI) -->
        <block type="sb_play_note">
            <value name="PITCH">
                <shadow type="text">
                    <field name="TEXT">60</field>
                </shadow>
            </value>
            <value name="VELOCITY">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <!-- 停止持續音 (MIDI) -->
        <block type="sb_stop_note">
            <value name="PITCH">
                <shadow type="text">
                    <field name="TEXT">60</field>
                </shadow>
            </value>
        </block>
        <!-- 演奏單音 -->
        <block type="sb_trigger_sample">
            <value name="VELOCITY">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <!-- 演奏電子鼓 -->
        <block type="sb_play_drum">
            <value name="VELOCITY">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <!-- 播放旋律 -->
        <block type="sb_play_melody"></block>
        <!-- 演奏和弦 -->
        <block type="sb_play_chord_by_name">
            <value name="DUR">
                <shadow type="text">
                    <field name="TEXT">4n</field>
                </shadow>
            </value>
            <value name="VELOCITY">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="sb_audio_is_playing"></block>
        <block type="sb_wait_until_finished"></block>
        <block type="sb_wait_musical">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="sb_tone_loop"></block>
        <block type="sb_perform"></block>
        <block type="sb_rhythm_sequence">
            <value name="MEASURE">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="VELOCITY">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="sb_musical_section">
            <value name="DURATION">
                <shadow type="math_number">
                    <field name="NUM">4</field>
                </shadow>
            </value>
        </block>
        <block type="sb_rhythm_sequencer_v2"></block>
    </category>

    <sep></sep>

    <!-- 12. Visuals (Drawing) -->
    <category name="%{BKY_CAT_VISUAL}" colour="%{BKY_VISUAL_HUE}">
        <block type="visual_color_picker"></block>
        <block type="processing_frame_count"></block>
        <block type="visual_frame_rate">
            <value name="FPS">
                <shadow type="math_number">
                    <field name="NUM">60</field>
                </shadow>
            </value>
        </block>
        <block type="visual_size"></block>
        <block type="visual_pixel_density"></block>
        <block type="visual_constant"></block>

        <sep gap="32"></sep>

        <block type="visual_background">
            <value name="COLOR">
                <shadow type="visual_color_picker"></shadow>
            </value>
        </block>
        <block type="visual_fill">
            <value name="COLOR">
                <shadow type="visual_color_picker"></shadow>
            </value>
        </block>
        <block type="visual_no_fill"></block>
        <block type="visual_stroke">
            <value name="COLOR">
                <shadow type="visual_color_picker"></shadow>
            </value>
        </block>
        <block type="visual_stroke_weight">
            <value name="WEIGHT">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="visual_no_stroke"></block>

        <sep gap="32"></sep>

        <block type="visual_rect">
            <value name="X">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="W">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
            <value name="H">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="visual_ellipse">
            <value name="X">
                <shadow type="math_number">
                    <field name="NUM">50</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow type="math_number">
                    <field name="NUM">50</field>
                </shadow>
            </value>
            <value name="W">
                <shadow type="math_number">
                    <field name="NUM">80</field>
                </shadow>
            </value>
            <value name="H">
                <shadow type="math_number">
                    <field name="NUM">80</field>
                </shadow>
            </value>
        </block>
        <block type="visual_line">
            <value name="X1">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y1">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="X2">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
            <value name="Y2">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="visual_triangle">
            <value name="X1">
                <shadow type="math_number">
                    <field name="NUM">50</field>
                </shadow>
            </value>
            <value name="Y1">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="X2">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y2">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
            <value name="X3">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
            <value name="Y3">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>

        <sep gap="32"></sep>

        <block type="visual_translate">
            <value name="X">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="visual_rotate">
            <value name="ANGLE">
                <shadow type="math_number">
                    <field name="NUM">45</field>
                </shadow>
            </value>
        </block>
        <block type="visual_scale">
            <value name="S">
                <shadow type="math_number">
                    <field name="NUM">1.0</field>
                </shadow>
            </value>
        </block>
        <block type="visual_push_pop"></block>
    </category>

    <!-- 13. Serial (Arduino) -->
    <category name="%{BKY_CAT_SERIAL}" colour="%{BKY_SERIAL_HUE}">
        <block type="sb_serial_data_received"></block>
        <block type="serial_init"></block>
        <block type="serial_available"></block>
        <block type="serial_read_string"></block>
        <block type="sb_serial_write">
            <value name="CONTENT">
                <shadow type="text">
                    <field name="TEXT">A</field>
                </shadow>
            </value>
        </block>
        <block type="serial_check_mask">
            <value name="MASK">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="sb_serial_check_key_mask">
            <value name="DATA">
                <shadow type="variables_get">
                    <field name="VAR">serial_data</field>
                </shadow>
            </value>
        </block>
    </category>

    <!-- 14. MIDI -->
    <category name="%{BKY_CAT_PC_KEY}" colour="%{BKY_PC_KEY_HUE}">
        <block type="ui_key_event"></block>
    </category>

    <category name="%{BKY_CAT_MIDI}" colour="%{BKY_MIDI_HUE}">
        <block type="midi_init"></block>
        <block type="midi_on_note"></block>
        <block type="midi_off_note"></block>
        <block type="midi_on_controller_change"></block>
        <sep gap="32"></sep>
        <block type="midi_send_note">
            <value name="CHANNEL">
                <shadow type="math_number"><field name="NUM">0</field></shadow>
            </value>
            <value name="PITCH">
                <shadow type="math_number"><field name="NUM">60</field></shadow>
            </value>
            <value name="VELOCITY">
                <shadow type="math_number"><field name="NUM">100</field></shadow>
            </value>
        </block>
        <block type="midi_send_cc">
            <value name="CHANNEL">
                <shadow type="math_number"><field name="NUM">0</field></shadow>
            </value>
            <value name="NUMBER">
                <shadow type="math_number"><field name="NUM">0</field></shadow>
            </value>
            <value name="VALUE">
                <shadow type="math_number"><field name="NUM">127</field></shadow>
            </value>
        </block>
        <block type="midi_lp_xy_to_note">
            <value name="X">
                <shadow type="math_number"><field name="NUM">0</field></shadow>
            </value>
            <value name="Y">
                <shadow type="math_number"><field name="NUM">0</field></shadow>
            </value>
        </block>
    </category>

    <!-- 15. UI Control -->
    <category name="%{BKY_CAT_UI}" colour="%{BKY_UI_HUE}">
        <block type="ui_init"></block>
        <block type="ui_add_slider"></block>
        <block type="ui_add_toggle"></block>
    </category>
    <category name="　" colour="#050505" disabled="true"></category>
    <category name="　" colour="#050505" disabled="true"></category>
    <category name="　" colour="#050505" disabled="true"></category>
</xml>
`;C.injectNaNShield();const N=C.initStagePanel(),I=O.getInvoke();window.FieldMultilineInput&&(Blockly.fieldRegistry.register("field_multilinetext",window.FieldMultilineInput),Blockly.fieldRegistry.register("field_multilineinput",window.FieldMultilineInput));class L extends Blockly.FieldTextInput{constructor(t){super(t||"#ffffff")}static fromJson(t){return new L(t.colour||t.value)}initView(){super.initView(),this.updateColorView()}render_(){super.render_(),this.updateColorView()}updateColorView(){const t=this.getValue();if(!(!t||!this.borderRect_)&&(this.borderRect_.style.cssText=`fill: ${t} !important; fill-opacity: 1 !important; stroke: #fff !important; stroke-width: 1px;`,this.textElement_)){const n=parseInt(t.substring(1,3),16),l=parseInt(t.substring(3,5),16),s=parseInt(t.substring(5,7),16),o=(n*299+l*587+s*114)/1e3;this.textElement_.style.cssText=`fill: ${o>128?"#000":"#fff"} !important; font-weight: bold;`}}showEditor_(){const t=document.createElement("input");t.type="color",t.value=this.getValue(),t.oninput=n=>{this.setValue(n.target.value),this.updateColorView()},t.click()}}Blockly.fieldRegistry.register("field_colour",L);const R=window.ScrollOptions||window.ScrollOptionsPlugin&&window.ScrollOptionsPlugin.ScrollOptions,q=window.ScrollBlockDragger||(R?R.ScrollBlockDragger:void 0),X=window.ScrollMetricsManager||(R?R.ScrollMetricsManager:void 0),z=Blockly.Theme.defineTheme("harmonyx_theme",{base:Blockly.Themes.Classic,blockStyles:{audio_blocks:{colourPrimary:"#8E44AD"},visual_blocks:{colourPrimary:"#2E86C1"}},componentStyles:{workspaceBackgroundColour:"#050505",toolboxBackgroundColour:"#1a1a20"}}),Q=document.getElementById("blocklyDiv"),m=Blockly.inject(Q,{toolbox:j,grid:{spacing:25,length:3,colour:"#222",snap:!0},zoom:{controls:!0,wheel:!0,startScale:1},move:{scrollbars:!0,drag:!0,wheel:!0},theme:z,renderer:"geras",plugins:{blockDragger:q,metricsManager:X}});if(R)try{new R(m).init({enableWheelScroll:!0,enableEdgeScroll:!0,edgeScrollOptions:{slowBlockSpeed:.15,fastBlockSpeed:.5,slowMouseSpeed:.25,fastMouseSpeed:1,fastBlockStartDistance:80,fastMouseStartDistance:60}})}catch(e){console.error("ScrollOptions init failed:",e)}let w=!1,P="",k=!1;function M(e){if(m.isClearing&&e)return;w=e;const t=P||"未命名專案";document.title=`${e?"*":""}${t} - HarmoNyx`;const n=document.getElementById("file-status");n&&(document.getElementById("display-filename").textContent=t,e?n.classList.add("is-dirty"):n.classList.remove("is-dirty"))}async function D(){if(!w)return!0;const{ask:e}=window.__TAURI__.dialog;return await e("專案尚未儲存，確定要離開嗎？",{title:"警告",kind:"warning"})}const J=`
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="processing_setup" id="cc!|M-@Vrq8_yvb2E$Hr" x="30" y="30">
    <statement name="DO">
      <block type="sb_minim_init" id="V|?S!Uck7cLNH-}pS[nJ">
        <next>
          <block type="visual_stage_setup" id="init_stage">
            <field name="W">1200</field>
            <field name="H">400</field>
            <field name="BG_COLOR">#000000</field>
            <field name="FG_COLOR">#fe2f89</field>
            <next>
              <block type="serial_init" id="init_ser">
                <field name="INDEX">0</field>
                <field name="BAUD">115200</field>
                <next>
                  <block type="sb_select_current_instrument" id="Ewrs?L@}424Xd-6Pi.9%">
                    <field name="NAME">MySynth</field>
                    <next>
                      <block type="sb_transport_set_bpm" id="2itX?tZ4g\`%KzHEbEK[-">
                        <value name="BPM">
                          <shadow type="math_number" id="4#Qw]2/~!jj!]1Q~P.A.">
                            <field name="NUM">120</field>
                          </shadow>
                        </value>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
  <block type="sb_instrument_container" id="?IrjDlT{CuGc-;}sQao9" x="490" y="30">
    <field name="NAME">MySynth</field>
    <statement name="STACK">
      <block type="sb_set_wave" id="+8e5SwS[#A1-933L~D^4">
        <field name="TYPE">TRIANGLE</field>
      </block>
    </statement>
  </block>
  <block type="processing_draw" id="default_draw" x="30" y="350"></block>
</xml>`.trim();function V(){m.isClearing=!0,m.clear(),setTimeout(()=>{try{const e=Blockly.utils.xml.textToDom(J);Blockly.Xml.domToWorkspace(e,m)}catch(e){console.error("Failed to load default blocks:",e);const t=m.newBlock("processing_setup");t.initSvg(),t.render(),t.moveBy(20,20);const n=m.newBlock("processing_draw");n.initSvg(),n.render(),n.moveBy(20,350)}setTimeout(()=>{m.isClearing=!1,M(!1),x()},100)},50)}const v={textToDom:e=>Blockly.utils.xml.textToDom(e),workspaceToDom:e=>Blockly.Xml.workspaceToDom(e),domToPrettyText:e=>Blockly.Xml.domToPrettyText(e)};if(window.__TAURI__&&window.__TAURI__.event){let e=!1;window.__TAURI__.event.listen("processing-log",t=>{if(!k)return;const n=t.payload.trim();if(!n){e=!1;return}const l=n.startsWith("[USER]")||n.startsWith("[DEV]")||n.startsWith("[MSG]")||n.startsWith("[WARN]")||n.startsWith("[ERR]")||n.startsWith("[!]"),s=n.startsWith("---")||n.includes("Available")||n.includes("Devices:"),o=/^\s*\[\d+\]/.test(n);if(s&&(e=!0),!l&&!s&&!o){e=!1;return}if(l||s||e&&o){let i="info";(n.startsWith("[ERR]")||n.startsWith("[!]"))&&(i="error"),N.appendLog(n,i)}}),window.__TAURI__.event.listen("processing-error",t=>{k&&N.appendLog(t.payload,"error")})}function Z(){document.querySelectorAll("[data-i18n-title]").forEach(e=>{const t=e.getAttribute("data-i18n-title");Blockly.Msg[t]&&(e.title=Blockly.Msg[t])}),document.querySelectorAll("[data-i18n]").forEach(e=>{const t=e.getAttribute("data-i18n");Blockly.Msg[t]&&(e.textContent=Blockly.Msg[t])})}Z();let H="zh-hant";const F=document.getElementById("settings-btn"),U=document.getElementById("examples-btn"),S=document.createElement("div"),A=document.createElement("div");S.className=A.className="dropdown-menu";document.body.appendChild(S);document.body.appendChild(A);function Y(e){S.querySelectorAll(".lang-check").forEach(n=>n.innerHTML="");const t=S.querySelector(`.lang-item[data-lang="${e}"] .lang-check`);t&&(t.innerHTML='<img src="/icons/done_24dp_FE2F89.png" class="nyx-icon-neon" style="width: 16px;">')}S.innerHTML=`
    <div class="dropdown-item" id="restart-audio-item"><img src="/icons/rocket_launch_24dp_FE2F89.png" class="nyx-icon-neon"><span>重啟音訊</span></div>
    <div class="dropdown-item" id="set-path-item"><img src="/icons/explore_24dp_FE2F89.png" class="nyx-icon-neon"><span>設定processing-java路徑</span></div>
    <div class="dropdown-item has-submenu"><img src="/icons/language_24dp_FE2F89.png" class="nyx-icon-neon"><span>語言設定</span><span class="arrow">▶</span></div>
    <div class="submenu">
        <div class="dropdown-item lang-item" data-lang="zh-hant"><span class="lang-check" style="width:20px;"></span><span>正體中文</span></div>
        <div class="dropdown-item lang-item" data-lang="en"><span class="lang-check" style="width:20px;"></span><span>English</span></div>
    </div>
`;document.body.addEventListener("click",async e=>{if(e.target.closest("#set-path-item")){const{open:t}=window.__TAURI__.dialog,n=await t({multiple:!1,directory:!1,filters:[{name:"Processing Java",extensions:["exe",""]}]});n&&(await I("set_processing_path",{path:n}),alert("路徑已更新！"))}});F.addEventListener("click",e=>{e.stopPropagation(),Y(H);const t=F.getBoundingClientRect();S.style.top=`${t.bottom+5}px`,S.style.left=`${t.left-120}px`,S.classList.toggle("show"),A.classList.remove("show")});S.querySelectorAll(".lang-item").forEach(e=>{e.addEventListener("click",t=>{const n=e.getAttribute("data-lang");H=n,Y(n),t.stopPropagation(),alert("語系切換功能開發中，目前設定將於下次啟動時生效。")})});U.addEventListener("click",async e=>{e.stopPropagation();try{const t=await I("list_examples");let n="";t.forEach(s=>{s.category?n+=`<div class="dropdown-item has-submenu"><img src="/icons/folder_special_24dp_75FB4C.png" class="nyx-icon-purple" style="width:20px;"><span>${s.category}</span><span class="arrow">▶</span></div>
                         <div class="submenu">${s.items.map(o=>`<div class="dropdown-item example-item" data-path="${o.path}"><img src="/icons/lyrics_24dp_75FB4C.png" class="nyx-icon-blue" style="width:20px;"><span>${o.name}</span></div>`).join("")}</div>`:n+=`<div class="dropdown-item example-item" data-path="${s.path}"><img src="/icons/lyrics_24dp_75FB4C.png" class="nyx-icon-blue" style="width:20px;"><span>${s.name}</span></div>`}),A.innerHTML=n||'<div class="dropdown-item">無範例</div>',A.querySelectorAll(".example-item").forEach(s=>{s.onclick=async()=>{if(await D()){const o=await I("load_project",{path:s.getAttribute("data-path")});m.isClearing=!0,m.clear(),Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(o),m),P=s.getAttribute("data-path").split(/[\\/]/).pop(),setTimeout(()=>{m.isClearing=!1,M(!1)},100)}}});const l=U.getBoundingClientRect();A.style.top=`${l.bottom+5}px`,A.style.left=`${l.left}px`,A.classList.toggle("show"),S.classList.remove("show")}catch(t){console.error(t)}});document.addEventListener("click",()=>{S.classList.remove("show"),A.classList.remove("show")});document.getElementById("new-btn").onclick=async()=>{await D()&&(P="",V())};document.getElementById("open-btn").onclick=async()=>{if(await D()){const e=await window.__TAURI__.dialog.open({filters:[{name:"HarmoNyx",extensions:["nyx","xml"]}]});if(e){const t=await I("load_project",{path:e});m.isClearing=!0,m.clear(),Blockly.Xml.domToWorkspace(v.textToDom(t),m),P=e.split(/[\\/]/).pop(),setTimeout(()=>{m.isClearing=!1,M(!1)},100)}}};document.getElementById("save-btn").onclick=async()=>{const e=await window.__TAURI__.dialog.save({filters:[{name:"HarmoNyx",extensions:["nyx","xml"]}]});e&&(await I("save_project",{xmlContent:v.domToPrettyText(v.workspaceToDom(m)),path:e}),P=e.split(/[\\/]/).pop(),M(!1))};document.getElementById("run-btn").onclick=async()=>{document.getElementById("run-btn").classList.add("is-running"),N.clearLog&&N.clearLog(),k=!0;const e=Blockly.Processing.workspaceToCode(m);try{await I("run_processing",{code:e})}catch(t){if(t==="ERR_NO_PROCESSING"){const{message:n,ask:l,open:s}=window.__TAURI__.dialog;await n(`找不到 Processing 執行環境 (processing-java)。

系統搜尋了：
1. C:\\processing-3.5.4
2. HarmoNyx 內建目錄
3. 系統 PATH

請手動選取 processing-java.exe 的位置, 它通常位於 Processing 安裝目錄。`,{title:"執行環境缺失",kind:"warning"});const o=await s({multiple:!1,directory:!1,filters:[{name:"Processing Java",extensions:["exe",""]}]});if(o){await I("set_processing_path",{path:o});try{await I("run_processing",{code:e})}catch(i){alert("執行失敗："+i)}}else k=!1}else alert("執行失敗："+t),k=!1}finally{document.getElementById("run-btn").classList.remove("is-running")}};document.getElementById("stop-btn").onclick=()=>{k=!1,I("stop_processing")};setTimeout(async()=>{Blockly.svgResize(m),C.initMinimap(m),C.initSearch(m),setTimeout(V,200);try{const e=await I("run_processing",{code:"exit();"})}catch(e){if(e==="ERR_NO_PROCESSING"){const{message:t,open:n}=window.__TAURI__.dialog;await t(`找不到 Processing 執行環境 (processing-java)。

系統搜尋了：
1. C:\\processing-3.5.4
2. HarmoNyx 內建目錄
3. 系統 PATH

請選取 processing-java.exe 的位置, 它通常位於 Processing 安裝目錄。`,{title:"執行環境缺失",kind:"warning"});const l=await n({multiple:!1,directory:!1,filters:[{name:"Processing Java",extensions:["exe",""]}]});l&&await I("set_processing_path",{path:l})}}},300);m.addChangeListener(e=>{if(m.isClearing)return;e.isUiEvent||[Blockly.Events.BLOCK_MOVE,Blockly.Events.BLOCK_CREATE,Blockly.Events.BLOCK_CHANGE,Blockly.Events.BLOCK_DELETE,Blockly.Events.VAR_CREATE,Blockly.Events.VAR_RENAME,Blockly.Events.VAR_DELETE].includes(e.type)&&(M(!0),x());let t=null;if(e.type===Blockly.Events.UI&&(e.element==="click"||e.element==="selected")||e.type==="selected"||e.type==="click"?t=e.blockId||e.newValue:[Blockly.Events.BLOCK_MOVE,Blockly.Events.BLOCK_CREATE,Blockly.Events.BLOCK_CHANGE].includes(e.type)&&(t=e.blockId),t){const n=m.getBlockById(t);n&&ee(n)}});let b;function x(){clearTimeout(b),b=setTimeout(()=>{const e=Blockly.Processing.workspaceToCode(m),t=document.getElementById("generated-code");t&&(t.textContent=e)},500)}function ee(e){const t=document.getElementById("help-placeholder"),n=document.getElementById("block-help-content"),l=document.getElementById("help-title"),s=document.getElementById("help-desc"),o=document.getElementById("help-preview");if(!t||!n)return;t.style.display="none",n.style.display="block";let i=e.type;for(const r in Blockly.Msg)if(e.type.toUpperCase()===r){i=Blockly.Msg[r];break}(e.type==="variables_get"||e.type==="variables_set")&&(i=`${Blockly.Msg[e.type.toUpperCase()]||e.type} (${e.getField("VAR").getText()})`),l.textContent=i;let a=e.getTooltip();typeof a=="function"&&(a=a()),s.innerHTML=a?a.replace(/\n/g,"<br>"):"無說明文件",o.innerHTML="";try{const r=document.createElement("span");r.style.color="#aaa",r.style.fontFamily="monospace",r.textContent=`<${e.type}>`,o.appendChild(r)}catch(r){console.error("Preview render error:",r)}}
