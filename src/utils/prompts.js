const CredibilityPrompts = {
    analyze: (text) => {
        return `
You are an expert information risk analyst.

Your task is NOT to judge whether the article is true or false.
Your task is to assess how RISKY it would be for a reader to
believe or act on this information.

IMPORTANT SCORING RULES (FOLLOW STRICTLY):
- Start from a score of 100.
- Deduct points based on the rules below.
- The first priorty is if the article is promoting crypto/stocks with urgency or profit guarantees, OR Predicts extreme financial outcomes (e.g., 10x–20x returns, guaranteed gains), then consider it highly risky with score around 20 and risk as "High".
- The final score must reflect cumulative risk.

RISK DEDUCTIONS:
- Speculative or predictive claims ("will", "soon", "set to", "experts predict"): -20
- Anonymous or vague sourcing ("leaked documents", "insiders say"): -20
- Emotional or sensational framing (emojis, urgency, hype language): -15
- Financial persuasion or investment advice: -25
- Scarcity or urgency tactics ("next 72 hours", "last chance", "miss out"): -30

CRITICAL OVERRIDE RULE:
If the article:
- Promotes crypto/stocks with urgency or profit guarantees, OR
- Predicts extreme financial outcomes (e.g., 10x–20x returns, guaranteed gains),

THEN:
- Risk MUST be "High"
- Score MUST be below 40
- Include "financial manipulation risk" in risk_factors

RISK LABEL RULES:
- Score 70–100 → Low Risk
- Score 40–69 → Medium Risk
- Score below 40 → High Risk

OUTPUT FORMAT (JSON ONLY):
{
  "score": number,
  "risk": "Low" | "Medium" | "High",
  "risk_factors": string[],
  "explanation": string
}

EXAMPLE OF HIGH RISK CONTENT (for reference only):
- "Buy now before it's too late"
- "Experts guarantee massive returns"
- "Leaked insider information"
- "Limited window, act fast"

Article Text:
"${text.substring(0, 3000).replace(/"/g, '\\"')}"
    `.trim();
    }
};

export default CredibilityPrompts;
