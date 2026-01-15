(function () {
    console.log('News Credibility Engine loaded.');

    const extractor = new ArticleExtractor();
    const text = extractor.extract();

    if (text) {
        // We will send this text to the LLM in the next step
        console.log('Extracted text length:', text.length);
        console.log('Preview:', text.substring(0, 100) + '...');
    } else {
        console.log('No article text found.');
    }
})();
