/**
 * HarmoNyx Visualizer Module
 * Ported from WaveCode (FieldADSR & EnvelopeManager)
 */

export class FieldADSR extends Blockly.Field {
    static SERIALIZABLE = false;

    constructor(a = 0.1, d = 0.2, s = 0.5, r = 0.4) {
        super();
        this.A = a; this.D = d; this.S = s; this.R = r;
        this.width_ = 160;
        this.height_ = 60;
        this.svgGroup_ = null;
        this.bgPath_ = null;
        this.dot_ = null;
        this._animationId = null;
        this._startTime = 0;
        this._isPlaying = false;
        this._duration = 0;
    }

    isSerializable() { return false; }
    getSize() { return new Blockly.utils.Size(this.width_, this.height_ + 10); }
    updateSize_() {}

    initView() {
        this.svgGroup_ = Blockly.utils.dom.createSvgElement('g', {
            'class': 'field-adsr-group',
            'transform': 'translate(0, 5)'
        }, this.fieldGroup_);

        // 1. 定義光暈濾鏡 (Glow Filter)
        const defs = Blockly.utils.dom.createSvgElement('defs', {}, this.svgGroup_);
        const filter = Blockly.utils.dom.createSvgElement('filter', {
            'id': 'glow-filter',
            'x': '-50%', 'y': '-50%', 'width': '200%', 'height': '200%'
        }, defs);
        Blockly.utils.dom.createSvgElement('feGaussianBlur', {
            'stdDeviation': '2.5',
            'result': 'blur'
        }, filter);
        const feMerge = Blockly.utils.dom.createSvgElement('feMerge', {}, filter);
        Blockly.utils.dom.createSvgElement('feMergeNode', { 'in': 'blur' }, feMerge);
        Blockly.utils.dom.createSvgElement('feMergeNode', { 'in': 'SourceGraphic' }, feMerge);

        // 背景
        Blockly.utils.dom.createSvgElement('rect', {
            'width': this.width_, 'height': this.height_,
            'rx': 4, 'ry': 4, 'fill': '#1a252f'
        }, this.svgGroup_);

        // 網格線
        for (let i = 1; i < 4; i++) {
            Blockly.utils.dom.createSvgElement('line', {
                'x1': 0, 'y1': (this.height_ * i / 4),
                'x2': this.width_, 'y2': (this.height_ * i / 4),
                'stroke': '#2c3e50', 'stroke-width': 1
            }, this.svgGroup_);
        }

        // ADSR 曲線
        this.bgPath_ = Blockly.utils.dom.createSvgElement('path', {
            'fill': 'none', 'stroke': '#3498db', 'stroke-width': 3, 'stroke-linejoin': 'round'
        }, this.svgGroup_);

        // 2. 移動光點 (加上 filter)
        this.dot_ = Blockly.utils.dom.createSvgElement('circle', {
            'r': 4, 'fill': '#f1c40f', 'opacity': 0, 
            'filter': 'url(#glow-filter)'
        }, this.svgGroup_);

        this.render_();
    }

    updateParams(a, d, s, r) {
        this.A = parseFloat(a) || 0;
        this.D = parseFloat(d) || 0;
        this.S = parseFloat(s) || 0;
        this.R = parseFloat(r) || 0;
        this.render_();
    }

    playAnimation(noteDuration) {
        this._duration = noteDuration / 1000;
        this._startTime = performance.now();
        this._isPlaying = true;
        if (this.dot_) this.dot_.setAttribute('opacity', 1);
        if (!this._animationId) this.animate_();
    }

    stopAnimation() {
        this._isPlaying = false;
        if (this.dot_) this.dot_.setAttribute('opacity', 0);
        if (this._animationId) {
            cancelAnimationFrame(this._animationId);
            this._animationId = null;
        }
    }

    animate_() {
        if (!this._isPlaying) {
            this._animationId = null;
            if (this.dot_) this.dot_.setAttribute('opacity', 0);
            return;
        }
        this.render_();
        const elapsed = (performance.now() - this._startTime) / 1000;
        if (elapsed > (this.A + this.D + this._duration + this.R + 0.2)) {
            this._isPlaying = false;
        }
        this._animationId = requestAnimationFrame(() => this.animate_());
    }

    render_() {
        if (!this.bgPath_) return;
        const w = this.width_, h = this.height_, padding = 8;
        const innerW = w - padding * 2, innerH = h - padding * 2;
        const totalT = Math.max(0.5, this.A + this.D + 0.5 + this.R);
        const scaleX = innerW / totalT;

        let points = [], curX = padding;
        points.push(`M ${curX},${h - padding}`);
        curX += this.A * scaleX; points.push(`L ${curX},${padding}`);
        curX += this.D * scaleX; points.push(`L ${curX},${h - padding - (this.S * innerH)}`);
        curX += 0.5 * scaleX; points.push(`L ${curX},${h - padding - (this.S * innerH)}`);
        curX += this.R * scaleX; points.push(`L ${curX},${h - padding}`);
        this.bgPath_.setAttribute('d', points.join(' '));

        if (this._isPlaying && this.dot_) {
            const elapsed = (performance.now() - this._startTime) / 1000;
            let dotX = padding, dotY = h - padding;
            if (elapsed < this.A) {
                const p = this.A > 0 ? elapsed / this.A : 1;
                dotX += elapsed * scaleX; dotY -= p * innerH;
            } else if (elapsed < this.A + this.D) {
                const p = this.D > 0 ? (elapsed - this.A) / this.D : 1;
                dotX += elapsed * scaleX; dotY = padding + (p * (1 - this.S) * innerH);
            } else if (elapsed < this.A + this.D + this._duration) {
                // 3. Sustain 階段：在 0.5 的寬度內來回移動 (正弦波擺動)
                const osc = Math.sin(elapsed * 12) * 0.15; // 擺動幅度 0.15
                dotX += (this.A + this.D + 0.25 + osc) * scaleX; 
                dotY = h - padding - (this.S * innerH);
            } else if (elapsed < this.A + this.D + this._duration + this.R) {
                const p = (elapsed - (this.A + this.D + this._duration)) / this.R;
                dotX += (this.A + this.D + 0.5 + (p * this.R)) * scaleX;
                dotY = (h - padding - (this.S * innerH)) + (p * this.S * innerH);
            }
            this.dot_.setAttribute('cx', dotX); this.dot_.setAttribute('cy', dotY);
        }
    }

    static fromJson(options) { return new FieldADSR(options.a, options.d, options.s, options.r); }
}

Blockly.fieldRegistry.register('field_adsr', FieldADSR);
Blockly.FieldADSR = FieldADSR;
window.FieldADSR = FieldADSR;

/**
 * 全域包絡線管理員
 */
export const EnvelopeManager = {
    _registry: new Map(),

    register(id, field) {
        if (!this._registry.has(id)) this._registry.set(id, []);
        const list = this._registry.get(id);
        if (!list.includes(field)) list.push(field);
    },

    trigger(id, duration) {
        if (this._registry.has(id)) {
            this._registry.get(id).forEach(f => f.playAnimation(duration));
        } else {
            this._registry.forEach(list => {
                list.forEach(f => f.playAnimation(duration));
            });
        }
    },

    stopAll() {
        this._registry.forEach(list => {
            list.forEach(f => f.stopAnimation());
        });
    }
};

window.EnvelopeManager = EnvelopeManager;
