# 🕵️ News Credibility Risk Engine (Chrome Extension)

A **Hackathon Project** that analyzes news articles in real-time using a **local LLM** to assesses information risk, speculative framing, and decision-making risk.

> **Privacy First**: No data leaves your computer. Everything is analyzed locally using Llama 3.

---

## 🚀 Prerequisites: Setting up Ollama

This extension relies on a local AI model running on your machine.

1. **Download Ollama**:
   - Go to [ollama.com](https://ollama.com) and download the installer for your OS (Mac/Windows/Linux). Minimum version needed is 0.1.32.

2. **Run Ollama with Connection Permissions**:
   - The extension needs permission to talk to the local server. Open your terminal and run:
     ```bash
     OLLAMA_ORIGINS="*" ollama serve
     ```
   - Keep this terminal window **OPEN** in the background.

3. **Pull the Model**:
   - In a *new* terminal window, download a local LLM model:
     ```bash
     ollama pull llama3
     ```

---

## 🛠️ Installation

1. **Clone/Download this Repository**:
   - Download the code to a folder on your computer.

2. **Load into Chrome**:
   - Open Chrome and navigate to `chrome://extensions`.
   - Toggle **Developer mode** (top right switch).
   - Click **Load unpacked**.
   - Select the folder where you downloaded this project.

---

## 🎮 How to Use

1. **Navigate to a News Article**:
   - Open any news site, blogs, or opinion articles.
   - *Tip: Use the included `crypto.html` file to test high-risk scenarios!*

2. **Trigger Analysis**:
   - Click the **Extension Icon** ( 🧩 ) in your Chrome toolbar.
   - The analysis overlay will appear instantly.

3. **View Results**:
   - **Score (0-100)**: Lower is riskier.
   - **Risk Level**: Low, Medium, or High.
   - **Risk Factors**: Specific issues like "Speculative language" or "Scarcity tactics".

---

## 📸 Screenshots

### ✅ Low Risk (Trusted Source)
> *[Place Screenshot of Low Risk Analysis Here]*
> *Shows high credibility based on factual reporting.*

### ⚠️ Medium Risk (Opinion/Blog)
> *[Place Screenshot of Medium Risk Analysis Here]*
> *Shows mixed credibility due to opinionated framing.*

### 🚨 High Risk (Crypto/Scam)
> *[Place Screenshot of High Risk Analysis Here]*
> *Shows high risk due to urgency, scarcity tactics, and financial persuasion.*

---

## 🧠 How It Works

- **Extraction**: A custom algorithm (`extractor.js`) identifies the main article text, stripping away ads and navigation.
- **Analysis**: The text is sent locally to **Llama 3** via the Ollama API.
- **Prompt Engineering**: The model strictly ignores "truth" (which is subjective) and focuses on **Information Risk** (speculation, sourcing, decision-making risk).
- **Privacy**: The API call stays on `localhost`. No external servers are pinged.

### ⚠️ Risk Level Definitions (Ground Truth)

| Risk Level | Definition & Criteria |
|:---|:---|
| **LOW_RISK** | **Factual Reporting**: Neutral tone, verifiable sources, official data (e.g., SEBI/RBI reports). No persuasive intent. |
| **MEDIUM_RISK** | **Speculative/Opinionated**: Uses language like "might," "could," "rumoured." Lacks concrete evidence but isn't explicitly false. |
| **HIGH_RISK** | **Manipulation/Scam**: Urgency ("Act Now"), scarcity ("Only 2 left"), unverified claims, or financial advice promising guaranteed returns. |

---

## 📊 Evaluation & Benchmarking

To ensure technical rigor, we evaluate the system using a specific methodology rather than relying on qualitative "vibes."

### Methodology
1. **Dataset**: We created a labeled dataset of **100+ news articles** (`scripts/evaluation/dataset.csv`) focusing on:
   - **Indian Financial News** (Stock market, Crypto, Banking)
   - **General News** (Elections, Weather)
   - **Scams/Clickbait** (Phishing, Ponzi schemes)
2. **Deterministic Classification**: The LLM is used as a specific classifier with `temperature=0` to ensure reproducibility.
3. **Metrics**: We measure **Accuracy** (overall correctness) and **High-Risk Precision** (minimizing false alarms for credible news).

### How to Run Evaluation
```bash
# Requires Node.js and Ollama running
node scripts/evaluation/evaluate.js
```

### Actual Benchmark Results (Llama 3 Local)
| Metric | Value | Notes |
|:---|:---|:---|
| **Accuracy** | **71.1%** | Measured on 83 successful samples. |
| **High Risk Precision** | **86.4%** | **Key Metric**: The system rarely mislabels safe news as "High Risk." |
| **High Risk Recall** | **79.2%** | Successfully identifies ~4 out of 5 high-risk articles. |

> *Note: ~20% of requests may timeout on lower-end hardware due to local inference load.*

---

## 🚧 Limitations

1. **Linguistic Analysis Only**: The model analyzes *language patterns* (speculation, urgency), not *factual truth*. It cannot verify if a specific event actually happened, only if the reporting *sounds* risky.
2. **Context Blindness**: Satire or complex sarcasm might be misclassified as High Risk.
3. **Extraction Limits**: Use of heuristic text extraction means highly dynamic JavaScript-heavy sites might not parse correctly every time.

---

## 👨‍💻 Tech Stack

- **Frontend**: Vanilla JavaScript, Glassmorphism CSS (No frameworks!)
- **Backend/AI**: Ollama (Llama 3) - **Deterministic Execution** (`temp=0`)
- **Architecture**: Chrome Extension V3 (Service Workers)

## Disclosure

This project was developed specifically for the hackathon.
It uses open-source tools (Ollama and Llama 3) as runtime dependencies.
All application logic, prompts, and UI components were implemented during the build period.


---

*Built for the GenAI Hackathon 2026.*
