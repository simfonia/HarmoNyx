/**
 * @license
 * Copyright 2026 SynthBlockly Stage
 */

/**
 * Audio Effects Generators: Filters, Reverbs, Delays and Param Control.
 */

Blockly.Processing.registerGenerator('sb_setup_effect', function(block) {
  Blockly.Processing.injectAudioCore();
  let name = Blockly.Processing.currentGenInstrumentName || "Master";
  const type = block.getFieldValue('EFFECT_TYPE');
  let finalTarget = (name === "Master") ? "masterGainUGen" : '((UGen)instrumentPans.getOrDefault("' + name + '", getInstrumentMixer("' + name + '")))';
  let endVar = (name === "Master") ? "masterEffectEnd" : '(UGen)instrumentEffectEnds.getOrDefault("' + name + '", getInstrumentMixer("' + name + '"))';
  
  // 安全讀取數值輔助函式 (加入類型轉換)
  const safeValue = (name, def) => {
    if (!block.getInput(name)) return def;
    let code = Blockly.Processing.valueToCode(block, name, Blockly.Processing.ORDER_ATOMIC) || def;
    return `(float)${code}`;
  };

  let code = `{\n`;

  if (type === 'filter') {
    const freq = safeValue('FILTER_FREQ', '1000');
    const q = safeValue('FILTER_Q', '1');
    code += `  float fv = constrain(${freq}, 20.0f, 20000.0f); float qv = constrain(${q}, 0.0f, 0.9f);\n`;
    code += `  if (instrumentFilters.containsKey("${name}")) { updateFilter("${name}", fv, qv); }\n`;
    code += `  else { UGen prev = ${endVar}; prev.unpatch(${finalTarget}); UGen f = new MoogFilter(fv, qv); instrumentFilters.put("${name}", f); prev.patch(f).patch(${finalTarget}); `;
    code += (name === "Master") ? `masterEffectEnd = f; }\n` : `instrumentEffectEnds.put("${name}", f); }\n`;
  } else if (type === 'autofilter') {
    const rate = safeValue('RATE', '0.5');
    const depth = safeValue('DEPTH', '20');
    const q = safeValue('FILTER_Q', '0.4');
    code += `  float rv = constrain(${rate}, 0.01f, 20.0f); float dv = constrain(${depth}, 0.0f, 100.0f); float qv = constrain(${q}, 0.0f, 0.9f);\n`;
    code += `  if (instrumentAutoFilters.containsKey("${name}")) { ddf.minim.ugens.Oscil lfo = (ddf.minim.ugens.Oscil)instrumentAutoFilterLFOs.get("${name}"); if (lfo != null) { lfo.setFrequency(rv); lfo.setAmplitude(1000.0f * dv/100.0f); } ddf.minim.ugens.MoogFilter f = (ddf.minim.ugens.MoogFilter)instrumentAutoFilters.get("${name}"); if (f != null) { f.resonance.setLastValue(qv); } }\n`;
    code += `  else { UGen prev = ${endVar}; prev.unpatch(${finalTarget}); ddf.minim.ugens.MoogFilter f = new ddf.minim.ugens.MoogFilter(1000, qv); ddf.minim.ugens.Oscil lfo = new ddf.minim.ugens.Oscil(rv, 1000.0f * dv/100.0f, Waves.SINE); ddf.minim.ugens.Summer s = new SBSummer(); new ddf.minim.ugens.Constant(1000).patch(s); lfo.patch(s).patch(f.frequency); instrumentAutoFilters.put("${name}", f); instrumentAutoFilterLFOs.put("${name}", lfo); prev.patch(f).patch(${finalTarget}); `;
    code += (name === "Master") ? `masterEffectEnd = f; }\n` : `instrumentEffectEnds.put("${name}", f); }\n`;
  } else if (type === 'pitchmod') {
    const mType = block.getFieldValue('TYPE') || 'NOISE';
    const rate = safeValue('RATE', '5');
    const depth = safeValue('DEPTH', '10');
    code += `  float rv = constrain(${rate}, 0.1f, 50.0f); float dv = constrain(${depth}, 0.0f, 1200.0f);\n`;
    code += `  if (instrumentPitchMods.containsKey("${name}")) { UGen lfo = (UGen)instrumentPitchModLFOs.get("${name}"); if (lfo instanceof ddf.minim.ugens.Oscil) { ((ddf.minim.ugens.Oscil)lfo).setFrequency(rv); ((ddf.minim.ugens.Oscil)lfo).setAmplitude(dv/1200.0f); } else if (lfo instanceof ddf.minim.ugens.Noise) { ((ddf.minim.ugens.Noise)lfo).amplitude.setLastValue(dv/240.0f); } }\n`;
    code += `  else { UGen prev = ${endVar}; prev.unpatch(${finalTarget}); ddf.minim.ugens.TickRate tr = new ddf.minim.ugens.TickRate(1.0f); UGen lfo; if ("${mType}".equals("NOISE")) lfo = new ddf.minim.ugens.Noise(dv/240.0f, ddf.minim.ugens.Noise.Tint.WHITE); else lfo = new ddf.minim.ugens.Oscil(rv, dv/1200.0f, Waves.SINE); ddf.minim.ugens.Summer s = new SBSummer(); new ddf.minim.ugens.Constant(1.0f).patch(s); lfo.patch(s).patch(tr.value); instrumentPitchMods.put("${name}", tr); instrumentPitchModLFOs.put("${name}", lfo); prev.patch(tr).patch(${finalTarget}); `;
    code += (name === "Master") ? `masterEffectEnd = tr; }\n` : `instrumentEffectEnds.put("${name}", tr); }\n`;
  } else if (type === 'delay') {
    const time = safeValue('DELAY_TIME', '0.5');
    const feedback = safeValue('FEEDBACK', '0.5');
    code += `  float tv = constrain(${time}, 0.001f, 5.0f); float fv = constrain(${feedback}, 0.0f, 0.95f);\n`;
    code += `  if (instrumentDelays.containsKey("${name}")) { try { Object dObj = instrumentDelays.get("${name}"); java.lang.reflect.Field f = dObj.getClass().getField("delTime"); Object input = f.get(dObj); input.getClass().getMethod("setLastValue", float.class).invoke(input, tv); } catch (Exception e) {} }\n`;
    code += `  else { UGen prev = ${endVar}; prev.unpatch(${finalTarget}); Delay d = new Delay(tv, fv, true, true); instrumentDelays.put("${name}", d); prev.patch(d).patch(${finalTarget}); `;
    code += (name === "Master") ? `masterEffectEnd = d; }\n` : `instrumentEffectEnds.put("${name}", d); }\n`;
  } else if (type === 'bitcrush') {
    const bits = safeValue('BITDEPTH', '8');
    code += `  float bv = constrain(${bits}, 1.0f, 16.0f);\n`;
    code += `  if (instrumentBitCrushers.containsKey("${name}")) { try { Object bObj = instrumentBitCrushers.get("${name}"); java.lang.reflect.Field f = bObj.getClass().getField("bitRes"); Object input = f.get(bObj); input.getClass().getMethod("setLastValue", float.class).invoke(input, bv); } catch (Exception e) {} }\n`;
    code += `  else { UGen prev = ${endVar}; prev.unpatch(${finalTarget}); BitCrush bc = new BitCrush(bv, out.sampleRate()); instrumentBitCrushers.put("${name}", bc); prev.patch(bc).patch(${finalTarget}); `;
    code += (name === "Master") ? `masterEffectEnd = bc; }\n` : `instrumentEffectEnds.put("${name}", bc); }\n`;
  } else if (type === 'waveshaper') {
    const amount = safeValue('DISTORTION_AMOUNT', '2');
    code += `  float av = constrain(${amount}, 0.1f, 100.0f);\n`;
    code += `  if (instrumentWaveshapers.containsKey("${name}")) { ((SBWaveshaper)instrumentWaveshapers.get("${name}")).setAmount(av); }\n`;
    code += `  else { UGen prev = ${endVar}; prev.unpatch(${finalTarget}); SBWaveshaper ws = new SBWaveshaper(); ws.setAmount(av); instrumentWaveshapers.put("${name}", ws); prev.patch(ws).patch(${finalTarget}); `;
    code += (name === "Master") ? `masterEffectEnd = ws; }\n` : `instrumentEffectEnds.put("${name}", ws); }\n`;
  } else if (type === 'reverb') {
    const rs = safeValue('ROOMSIZE', '0.5');
    const damp = safeValue('DAMPING', '0.5');
    const wet = safeValue('WET', '0.3');
    code += `  float rsv = constrain(${rs}, 0.0f, 1.0f); float dv = constrain(${damp}, 0.0f, 1.0f); float wv = constrain(${wet}, 0.0f, 1.0f);\n`;
    code += `  if (instrumentReverbs.containsKey("${name}")) { ((SBReverb)instrumentReverbs.get("${name}")).setParams(rsv, dv, wv); }\n`;
    code += `  else { UGen prev = ${endVar}; prev.unpatch(${finalTarget}); SBReverb rv = new SBReverb(); rv.setParams(rsv, dv, wv); instrumentReverbs.put("${name}", rv); prev.patch(rv).patch(${finalTarget}); `;
    code += (name === "Master") ? `masterEffectEnd = rv; }\n` : `instrumentEffectEnds.put("${name}", rv); }\n`;
  } else if (type === 'compressor') {
    const threshold = safeValue('THRESHOLD', '-20');
    const ratio = safeValue('RATIO', '4');
    const attack = safeValue('ATTACK', '0.01');
    const release = safeValue('RELEASE', '0.25');
    const makeup = safeValue('MAKEUP', '0');
    code += `  float tv = constrain(${threshold}, -80.0f, 0.0f); float rv = constrain(${ratio}, 1.0f, 100.0f); float av = constrain(${attack}, 0.001f, 2.0f); float rev = constrain(${release}, 0.001f, 2.0f); float mv = constrain(${makeup}, 0.0f, 24.0f);\n`;
    code += `  if (instrumentCompressors.containsKey("${name}")) { ((SBCompressor)instrumentCompressors.get("${name}")).setParams(tv, rv, av, rev, mv); }\n`;
    code += `  else { UGen prev = ${endVar}; prev.unpatch(${finalTarget}); SBCompressor c = new SBCompressor(); c.setParams(tv, rv, av, rev, mv); instrumentCompressors.put("${name}", c); prev.patch(c).patch(${finalTarget}); `;
    code += (name === "Master") ? `masterEffectEnd = c; }\n` : `instrumentEffectEnds.put("${name}", c); }\n`;
  } else if (type === 'limiter') {
    const threshold = safeValue('THRESHOLD', '-3');
    const attack = safeValue('ATTACK', '0.001');
    const release = safeValue('RELEASE', '0.1');
    code += `  float tv = constrain(${threshold}, -40.0f, 0.0f); float av = constrain(${attack}, 0.001f, 1.0f); float rev = constrain(${release}, 0.001f, 1.0f);\n`;
    code += `  if (instrumentLimiters.containsKey("${name}")) { ((SBCompressor)instrumentLimiters.get("${name}")).setParams(tv, 20.0f, av, rev, 0.0f); }\n`;
    code += `  else { UGen prev = ${endVar}; prev.unpatch(${finalTarget}); SBCompressor c = new SBCompressor(); c.setParams(tv, 20.0f, av, rev, 0.0f); instrumentLimiters.put("${name}", c); prev.patch(c).patch(${finalTarget}); `;
    code += (name === "Master") ? `masterEffectEnd = c; }\n` : `instrumentEffectEnds.put("${name}", c); }\n`;
  }
  code += `}\n`; return code;
});

Blockly.Processing.registerGenerator('sb_set_instrument_volume', function(block) {
  const name = block.getFieldValue('NAME');
  const javaName = window.SB_Utils.getInstrumentJavaName(name);
  const volume = Blockly.Processing.valueToCode(block, 'VOLUME', Blockly.Processing.ORDER_ATOMIC) || '100';
  return `instrumentVolumes.put(${javaName}, constrain(floatVal(${volume}), 0.0f, 500.0f) / 100.0f);
`;
});

Blockly.Processing.registerGenerator('sb_set_panning', function(block) {
  const name = block.getFieldValue('NAME');
  const val = Blockly.Processing.valueToCode(block, 'VALUE', Blockly.Processing.ORDER_ATOMIC) || '0';
  return `updatePanning("${name}", constrain(floatVal(${val}), -1.0f, 1.0f));
`;
});

Blockly.Processing.registerGenerator('sb_set_effect_param', function(block) {
  const target = block.getFieldValue('TARGET');
  const type = block.getFieldValue('EFFECT_TYPE');
  const param = (type === 'panning') ? 'pan' : block.getFieldValue('PARAM_NAME');
  const val = Blockly.Processing.valueToCode(block, 'VALUE', Blockly.Processing.ORDER_ATOMIC) || "0";
  Blockly.Processing.definitions_['SB_Param_Helper'] = `
  void setEffectParam(String instName, String effectType, String paramName, float value) {
    float v = value;
    if (effectType.equals("adsr")) {
      float[] adsr = instrumentADSR.get(instName); if (adsr == null) adsr = new float[]{defAdsrA, defAdsrD, defAdsrS, defAdsrR};
      v = constrain(v, 0.0f, (paramName.equals("adsrS") ? 1.0f : 5.0f));
      if (paramName.equals("adsrA")) adsr[0] = v; else if (paramName.equals("adsrD")) adsr[1] = v; else if (paramName.equals("adsrS")) adsr[2] = v; else if (paramName.equals("adsrR")) adsr[3] = v;
      instrumentADSR.put(instName, adsr);
      if (currentInstrument.equals(instName)) {
        if (paramName.equals("adsrA")) adsrA = v; else if (paramName.equals("adsrD")) adsrD = v; else if (paramName.equals("adsrS")) adsrS = v; else if (paramName.equals("adsrR")) adsrR = v;
        if (cp5 != null && cp5.getController(paramName) != null) cp5.getController(paramName).setValue(v);
      } return;
    }
    
    // 參數範圍限制
    if (effectType.equals("filter") || effectType.equals("autofilter")) {
      if (paramName.equals("frequency")) v = constrain(v, 20, 20000);
      else if (paramName.equals("resonance")) v = constrain(v, 0, 0.9f);
    } else if (effectType.equals("reverb")) {
      v = constrain(v, 0, 1.0f);
    } else if (effectType.equals("delay")) {
      if (paramName.equals("delTime")) v = constrain(v, 0.001f, 5.0f);
      else if (paramName.equals("delAmp")) v = constrain(v, 0, 0.95f);
    } else if (effectType.equals("bitcrush")) {
      v = constrain(v, 1, 16);
    } else if (effectType.equals("waveshaper")) {
      v = constrain(v, 0.1f, 100.0f);
    } else if (effectType.equals("compressor") || effectType.equals("limiter")) {
      if (paramName.equals("threshold")) v = constrain(v, -80, 0);
      else if (paramName.equals("ratio")) v = constrain(v, 1, 100);
      else if (paramName.equals("attack") || paramName.equals("release")) v = constrain(v, 0.001f, 2.0f);
      else if (paramName.equals("makeup")) v = constrain(v, 0, 24);
    } else if (effectType.equals("autofilter") || effectType.equals("pitchmod") || effectType.equals("flanger")) {
       if (paramName.equals("rate")) v = constrain(v, 0.01f, 50.0f);
       else if (paramName.equals("depth")) {
         if (effectType.equals("pitchmod")) v = constrain(v, 0, 1200);
         else v = constrain(v, 0, 100);
       }
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
    else if (effectType.equals("panning")) { updatePanning(instName, constrain(v, -1.0f, 1.0f)); return; }
    
    if (effect != null) { try { java.lang.reflect.Field f = effect.getClass().getField(paramName); Object control = f.get(effect); java.lang.reflect.Method m = control.getClass().getMethod("setLastValue", float.class); m.invoke(control, v); }
      catch (Exception e) { try { String methodName = "set" + paramName.substring(0,1).toUpperCase() + paramName.substring(1); java.lang.reflect.Method m = effect.getClass().getMethod(methodName, float.class); m.invoke(effect, v); } catch(Exception ex) {} }
    }
  }`;
  return `setEffectParam("${target}", "${type}", "${param}", floatVal(${val}));
`;
});

Blockly.Processing.registerGenerator('sb_update_adsr', function(block) {
  const targetName = block.getFieldValue('TARGET');
  const target = window.SB_Utils.getInstrumentJavaName(targetName);
  const a = Blockly.Processing.valueToCode(block, 'A', Blockly.Processing.ORDER_ATOMIC) || "0.01";
  const d = Blockly.Processing.valueToCode(block, 'D', Blockly.Processing.ORDER_ATOMIC) || "0.1";
  const s = Blockly.Processing.valueToCode(block, 'S', Blockly.Processing.ORDER_ATOMIC) || "0.5";
  const r = Blockly.Processing.valueToCode(block, 'R', Blockly.Processing.ORDER_ATOMIC) || "0.5";
  let code = `instrumentADSR.put(${target}, new float[]{floatVal(${a}), floatVal(${d}), floatVal(${s}), floatVal(${r})});\n`;
  code += `if (currentInstrument.equals(${target})) { adsrA = floatVal(${a}); adsrD = floatVal(${d}); adsrS = floatVal(${s}); adsrR = floatVal(${r}); if (cp5 != null) { try { cp5.getController("adsrA").setValue(adsrA); cp5.getController("adsrD").setValue(adsrD); cp5.getController("adsrS").setValue(adsrS); cp5.getController("adsrR").setValue(adsrR); } catch(Exception e){} } }\n`;
  return code;
});
