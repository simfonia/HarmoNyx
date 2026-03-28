/**
 * HarmoNyx Visual Minimap Module
 * A lightweight, canvas-based visual navigation tool for Blockly.
 * Modular version: Includes self-injecting styles.
 */

export class VisualMinimap {
    constructor(workspace, options = {}) {
        this.workspace = workspace;
        this.options = Object.assign({
            containerId: 'nyx-minimap',
            width: 200,
            height: 150,
            padding: 100,
            accentColor: '#00f2ff',
            backgroundColor: 'rgba(10, 10, 15, 0.85)',
            glowColor: 'rgba(142, 68, 173, 0.3)',
            blockOpacity: 0.6,
            toggleId: 'minimap-toggle',
            top: 50,
            right: 10
        }, options);

        this.isCollapsed = false;
        this.renderBounds = null;
        this.renderScale = 1;
        this.isNavigating = false;

        this.injectStyles();
        this.initDOM();
        this.initEvents();
        this.updateBounds();
        this.render();
    }

    /**
     * 自動注入模組所需的 CSS 樣式
     */
    injectStyles() {
        const styleId = 'visual-minimap-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .nyx-minimap-container {
                position: absolute;
                top: ${this.options.top}px;
                right: ${this.options.right}px;
                width: ${this.options.width}px;
                height: ${this.options.height}px;
                background: ${this.options.backgroundColor};
                border: 1px solid #e056fd;
                box-shadow: 0 0 15px ${this.options.glowColor};
                border-radius: 8px;
                overflow: hidden;
                z-index: 90;
                pointer-events: auto;
                cursor: crosshair;
            }
            #nyx-minimap-canvas {
                width: 100%;
                height: 100%;
                display: block;
            }
            #nyx-minimap-viewport {
                position: absolute;
                border: 1px solid ${this.options.accentColor};
                background: rgba(0, 242, 255, 0.12);
                box-shadow: 0 0 8px rgba(0, 242, 255, 0.3);
                pointer-events: none;
                z-index: 100;
            }
            #${this.options.toggleId} {
                position: absolute;
                top: 10px;
                right: ${this.options.right}px;
                width: 32px;
                height: 32px;
                background: #141417;
                border: 1px solid #e056fd;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 101;
                transition: all 0.2s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            }
            #${this.options.toggleId}:hover {
                box-shadow: 0 0 10px #e056fd;
                transform: scale(1.1);
            }
            .blockly-minimap { display: none !important; }
        `;
        document.head.appendChild(style);
    }

    initDOM() {
        const blocklyDiv = this.workspace.getParentSvg().parentNode;
        
        this.container = document.createElement('div');
        this.container.id = this.options.containerId;
        this.container.className = 'nyx-minimap-container';
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.canvas.id = 'nyx-minimap-canvas';
        
        this.viewport = document.createElement('div');
        this.viewport.id = 'nyx-minimap-viewport';
        
        this.container.appendChild(this.canvas);
        this.container.appendChild(this.viewport);
        blocklyDiv.appendChild(this.container);
        this.ctx = this.canvas.getContext('2d');

        this.toggleBtn = document.getElementById(this.options.toggleId);
        if (!this.toggleBtn) {
            this.toggleBtn = document.createElement('div');
            this.toggleBtn.id = this.options.toggleId;
            this.toggleBtn.innerHTML = '<img src="/icons/cancel_24dp_FE2F89.png" style="width:20px; filter: invert(47%) sepia(34%) saturate(1516%) hue-rotate(243deg) brightness(88%) contrast(85%);">';
            blocklyDiv.appendChild(this.toggleBtn);
        }
    }

    initEvents() {
        this.toggleBtn.onclick = () => this.setCollapsed(!this.isCollapsed);
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && (e.key === 'm' || e.key === 'M')) this.setCollapsed(!this.isCollapsed);
        });

        this.container.onmousedown = (e) => {
            this.isNavigating = true;
            this.navigate(e);
            e.preventDefault();
        };

        window.addEventListener('mousemove', (e) => {
            if (this.isNavigating) this.navigate(e);
        });

        window.addEventListener('mouseup', () => {
            this.isNavigating = false;
        });

        this.workspace.addChangeListener((e) => {
            if ([Blockly.Events.BLOCK_CREATE, Blockly.Events.BLOCK_DELETE, Blockly.Events.BLOCK_MOVE].includes(e.type)) {
                this.updateBounds();
            }
            requestAnimationFrame(() => this.render());
        });

        window.addEventListener('resize', () => {
            this.updateBounds();
            this.render();
        });
    }

    setCollapsed(state) {
        this.isCollapsed = state;
        this.container.style.display = this.isCollapsed ? 'none' : 'block';
        const img = this.toggleBtn.querySelector('img');
        if (img) {
            img.src = this.isCollapsed ? "/icons/public_24dp_FE2F89.png" : "/icons/cancel_24dp_FE2F89.png";
        }
        if (!this.isCollapsed) {
            this.updateBounds();
            this.render();
        }
    }

    updateBounds() {
        const m = this.workspace.getMetrics();
        if (!m) return;

        const left = Math.min(m.contentLeft, m.viewLeft) - this.options.padding;
        const top = Math.min(m.contentTop, m.viewTop) - this.options.padding;
        const right = Math.max(m.contentLeft + m.contentWidth, m.viewLeft + m.viewWidth) + this.options.padding;
        const bottom = Math.max(m.contentTop + m.contentHeight, m.viewTop + m.viewHeight) + this.options.padding;
        
        this.renderBounds = { left, top, right, bottom, w: right - left, h: bottom - top };
        this.renderScale = Math.min(this.options.width / this.renderBounds.w, this.options.height / this.renderBounds.h);
    }

    render() {
        if (this.isCollapsed || !this.renderBounds) return;
        const m = this.workspace.getMetrics();
        if (!m) return;

        const toMapX = (x) => Math.round((x - this.renderBounds.left) * this.renderScale);
        const toMapY = (y) => Math.round((y - this.renderBounds.top) * this.renderScale);

        this.ctx.clearRect(0, 0, this.options.width, this.options.height);
        this.ctx.fillStyle = '#0a0a0f';
        this.ctx.fillRect(0, 0, this.options.width, this.options.height);

        const blocks = this.workspace.getAllBlocks(false);
        this.ctx.globalAlpha = this.options.blockOpacity;
        blocks.forEach(b => {
            if (b.isShadow()) return;
            const xy = b.getRelativeToSurfaceXY();
            const size = b.getHeightWidth();
            this.ctx.fillStyle = b.getColour() || '#9b59b6';
            this.ctx.fillRect(toMapX(xy.x), toMapY(xy.y), Math.max(3, Math.round(size.width * this.renderScale)), Math.max(3, Math.round(size.height * this.renderScale)));
        });

        const vx = toMapX(m.viewLeft);
        const vy = toMapY(m.viewTop);
        const vw = Math.round(m.viewWidth * this.renderScale);
        const vh = Math.round(m.viewHeight * this.renderScale);

        this.viewport.style.left = vx + 'px';
        this.viewport.style.top = vy + 'px';
        this.viewport.style.width = vw + 'px';
        this.viewport.style.height = vh + 'px';
    }

    navigate(e) {
        if (!this.renderBounds) return;
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const wsX = this.renderBounds.left + (mx / this.renderScale);
        const wsY = this.renderBounds.top + (my / this.renderScale);

        const m = this.workspace.getMetrics();
        this.workspace.scroll(-(wsX - m.viewWidth / 2), -(wsY - m.viewHeight / 2));
    }
}
