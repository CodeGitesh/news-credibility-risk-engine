const CredibilityPrompts = {
    analyze: (articleText) => {
        return `
You are an expert news analyst. Analyze the following article for misinformation risk.
Return a valid JSON object with:
- "score": A credibility score between 0 (fake/misleading) and 100 (highly credible).
- "risk": One of "Low", "Medium", "High".
- "explanation": A concise 1-2 sentence explanation of why.

Article Text:
"${articleText.substring(0, 4000).replace(/"/g, '\\"')}"
        `.trim();
    }
};

export default CredibilityPrompts;
