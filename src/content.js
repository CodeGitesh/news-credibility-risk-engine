(function () {
    // Only initialize the overlay class once
    const ui = new ResultsOverlay();
    const extractor = new ArticleExtractor();

    // Listen for the button click from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'trigger_analysis') {
            runAnalysis();
        }
    });

    function runAnalysis() {
        // 1. Extract
        const text = extractor.extract();

        if (!text) {
            alert("No article text found on this page.");
            return;
        }

        // 2. Show UI Loading
        ui.showLoading();

        // 3. Request Analysis
        chrome.runtime.sendMessage({ action: 'analyze_text', text: text }, (response) => {
            if (response && response.success) {
                ui.update(response.data);
            } else {
                console.error('Analysis failed:', response);
                ui.update({
                    score: '?',
                    risk: 'Error',
                    explanation: 'Could not connect to local LLM. Is Ollama running?',
                    risk_factors: []
                });
            }
        });
    }

})();
