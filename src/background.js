import CredibilityPrompts from './utils/prompts.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyze_text') {
        analyzeText(request.text).then(sendResponse);
        return true; // Keep the message channel open for async response
    }
});

async function analyzeText(text) {
    const prompt = CredibilityPrompts.analyze(text);

    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3', // User can change this to their preferred model
                prompt: prompt,
                stream: false,
                format: 'json'
            })
        });

        if (!response.ok) throw new Error('Ollama connection failed');

        const data = await response.json();
        return { success: true, data: JSON.parse(data.response) };

    } catch (error) {
        console.error('LLM Analysis Error:', error);
        return { success: false, error: error.message };
    }
}
