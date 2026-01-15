class ArticleExtractor {
    constructor() {
        // Common selectors for main article content
        this.selectors = ['article', '[role="main"]', '.article-body', '.story-body', '#main-content'];
        this.noiseTags = ['NAV', 'HEADER', 'FOOTER', 'SCRIPT', 'STYLE', 'BUTTON', 'ASIDE'];
    }

    extract() {
        // First try to find a specific article container
        const node = this.findArticleNode();
        if (node) return this.cleanAndGetText(node);

        // Fallback to scanning paragraphs in body
        return this.scanBodyText();
    }

    findArticleNode() {
        for (const selector of this.selectors) {
            const el = document.querySelector(selector);
            if (el && el.innerText.length > 200) return el;
        }
        return null;
    }

    cleanAndGetText(node) {
        const clone = node.cloneNode(true);
        this.removeNoise(clone);
        return clone.innerText.replace(/\s+/g, ' ').trim();
    }

    removeNoise(node) {
        node.querySelectorAll(this.noiseTags.join(',')).forEach(el => el.remove());
    }

    scanBodyText() {
        const paragraphs = Array.from(document.querySelectorAll('p'));
        // Filter for meaningful content > 50 chars
        const valid = paragraphs.filter(p => p.innerText.trim().length > 50);
        return valid.length ? valid.map(p => p.innerText.trim()).join('\n\n') : '';
    }
}

window.ArticleExtractor = ArticleExtractor;
