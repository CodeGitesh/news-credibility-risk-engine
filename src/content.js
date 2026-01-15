(function () {
    console.log('News Credibility Engine loaded.');

    const extractor = new ArticleExtractor();
    const text = extractor.extract();

    if (text) {
        console.log('Sending text to LLM...');
        chrome.runtime.sendMessage({ action: 'analyze_text', text: text }, (response) => {
            console.log('Analysis Result:', response);
        });
    } else {
        console.log('No article text found.');
    }
})();
