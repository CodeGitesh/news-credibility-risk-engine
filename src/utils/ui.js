class ResultsOverlay {
    constructor() {
        this.overlayId = 'ncre-overlay';
        this.element = null;
    }

    create() {
        // Singleton check: If exists, remove it first to ensure fresh state
        if (document.getElementById(this.overlayId)) {
            this.remove();
        }

        const overlay = document.createElement('div');
        overlay.id = this.overlayId;
        overlay.innerHTML = `
            <button class="ncre-close-btn">&times;</button>
            <div class="ncre-header">
                <span class="ncre-title">Risk Analysis</span>
            </div>
            <div id="ncre-content"></div>
        `;

        document.body.appendChild(overlay);
        this.element = overlay;

        // Bind close button
        overlay.querySelector('.ncre-close-btn').onclick = () => this.remove();

        // Simple fade in
        requestAnimationFrame(() => overlay.classList.add('ncre-visible'));
    }

    showLoading() {
        this.create();
        const content = document.getElementById('ncre-content');
        if (content) {
            content.innerHTML = `
                <div class="ncre-loading">
                    <div class="ncre-spinner"></div>
                    <span>Analyzing...</span>
                </div>
            `;
        }
    }

    update(data) {
        const content = document.getElementById('ncre-content');
        if (!content) return;

        const { score, risk, risk_factors, explanation } = data;
        const riskLower = risk.toLowerCase();

        // Render risk factors as list items if they exist
        const factorsHtml = risk_factors && risk_factors.length
            ? `<ul class="ncre-factors">${risk_factors.map(f => `<li>${f}</li>`).join('')}</ul>`
            : '';

        content.innerHTML = `
            <div class="ncre-score-row">
                <span class="ncre-score">${score}</span>
                <span class="ncre-badge ncre-${riskLower}">${risk} Risk</span>
            </div>
            <p class="ncre-text">${explanation}</p>
            ${factorsHtml}
        `;
    }

    remove() {
        const overlay = document.getElementById(this.overlayId);
        if (overlay) {
            overlay.remove();
            this.element = null;
        }
    }
}

window.ResultsOverlay = ResultsOverlay;
