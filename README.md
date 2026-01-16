# 🕵️ News Credibility Risk Engine (Chrome Extension)

A **Hackathon Project** that analyzes news articles in real-time using a **local LLM** to assesses information risk, speculative framing, and decision-making risk.

> **Privacy First**: No data leaves your computer. Everything is analyzed locally using Llama 3.
The local setup prioritizes privacy and rapid iteration during the hackathon and represents a development-first deployment tier.

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
   - **Risk Factors**: Specific issues like "Speculative language" or "Scarcity tactics". Directly shows the words within the article that exhibit high-risk linguistic patterns (e.g., scarcity, urgency, or speculative hedging), providing instant explainability

**⚠️ Critical**: If the extension says "Server not found," ensure you started Ollama with OLLAMA_ORIGINS="*"

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

## 🚀 Future Scope (Build Model Phase)

The current system is intentionally scoped as a lightweight, local prototype to
ensure zero infrastructure cost and fast experimentation during the hackathon.

In a build model phase, the system can be extended in a controlled and incremental
manner without changing the core architecture:

### 1. Human-in-the-Loop Feedback
A user feedback mechanism can be added to allow readers to flag incorrect or
misleading risk classifications. This feedback will be stored locally during
the hackathon phase and used only for offline analysis.

### 2. Supervised Calibration Layer
Instead of retraining the LLM, labeled data collected from manual annotation and
user feedback can be used to train a lightweight supervised calibration model
on top of LLM outputs. The LLM remains unchanged and acts as a feature extractor,
while the supervised model improves classification consistency over time. We deliberately separate learning from inference and improve the system through controlled, offline calibration rather than retraining the LLM.

### 3. Scalable Inference Infrastructure (Optional) - To be done in deployment phase
For the purposes of the hackathon and budget constraints, the system avoids any
cloud-based inference. In a future build phase, inference can be migrated to a
managed cloud environment (e.g., AWS) only if required to support feedback
aggregation and controlled updates at scale.

### 4. Regional Language Support
The risk analysis pipeline can be extended to support regional languages using
language-aware prompts or multilingual models, enabling broader accessibility
across diverse news sources.


---

## 🏗 Production Roadmap: From Development to Scale

The current prototype uses a local Ollama-based setup with Llama 3 to prioritize
privacy, rapid experimentation, and zero infrastructure cost during the hackathon.
This enables fast iteration on complex linguistic prompts without relying on
external APIs or sending user data outside the device.

However, this local setup is intentionally positioned as a **development and
privacy-first tier**, not a requirement for mainstream adoption.

### Addressing the Ollama Installation Requirement

Installing Ollama is acceptable for a hackathon prototype and power users, but a
production-ready system must offer a zero-install experience. To address this,
the system is designed to transition to a hybrid inference architecture.

### Hybrid Inference Architecture (Production Vision)

**Tier 1: Client-Side Lightweight Analysis**  
The browser extension performs fast, lightweight checks such as article extraction,
keyword heuristics, and basic linguistic signals to ensure immediate responsiveness.

Optionally, a small on-device language model (e.g., a ~100M parameter model such as
TinyLlama running via WebAssembly) can be used for coarse pre-filtering. This allows
the system to identify potentially risky content early and selectively escalate
only suspicious cases for deeper analysis.

**Tier 2: Server-Side LLM Inference**  
When deeper reasoning is required, the extracted article text is securely sent to a
managed backend where a centralized LLM (e.g., Llama 3 running via high-throughput
engines such as vLLM or containerized Ollama) performs risk analysis.

This architecture enables:
- Zero-install user experience for end users
- Low-latency inference through hardware acceleration
- High concurrency using token batching
- Controlled and consistent model updates

### Latency, Privacy, and Enterprise Considerations

Future iterations can leverage streaming inference, allowing risk indicators to
appear progressively as the page loads instead of waiting for full completion.

The system supports both local-only and cloud-assisted deployments. For enterprise
or financial use cases, local inference remains a privacy-first option, while
consumer deployments can leverage cloud inference for ease of use and scalability.


---

### Deployment and Cost Sustainability

While the prototype is designed to operate locally to minimize cost during the
hackathon phase, a production deployment requires a sustainable operating model.

For high-impact domains such as financial news, trading platforms, and brokerage
ecosystems, organizations (e.g., media houses or investment platforms) may choose
to integrate the risk analysis engine as a value-added feature for premium users.
This enables centralized inference, consistent risk signaling, and controlled
operational costs.

Such integrations help platforms proactively reduce exposure to misleading or
manipulative content without positioning the system as a source of financial
advice or factual authority.


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
