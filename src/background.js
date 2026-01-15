import CredibilityPrompts from './utils/prompts.js';

// Trigger analysis when user clicks the extension icon
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: 'trigger_analysis' });
});

// Handle analysis request from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyze_text') {
        analyzeText(request.text).then(sendResponse);
        return true;
    }
});

async function analyzeText(text) {
    const prompt = CredibilityPrompts.analyze(text);

    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3',
                prompt: prompt,
                stream: false,
                format: 'json'
            })
        });

        if (!response.ok) throw new Error('Ollama connection failed');

        const data = await response.json();
        const parsed = JSON.parse(data.response);
        return { success: true, data: parsed };

    } catch (error) {
        console.error('LLM Analysis Error:', error);
        return { success: false, error: error.message };
    }
}
