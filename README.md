# 🕵️ News Credibility Risk Engine (Chrome Extension)

A **Hackathon Project** that analyzes news articles in real-time using a **local LLM** to assesses information risk, speculative framing, and decision-making risk.

> **Privacy First**: No data leaves your computer. Everything is analyzed locally using Llama 3.

---

## 🚀 Prerequisites: Setting up Ollama

This extension relies on a local AI model running on your machine.

1. **Download Ollama**:
   - Go to [ollama.com](https://ollama.com) and download the installer for your OS (Mac/Windows/Linux).

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

---

## 👨‍💻 Tech Stack

- **Frontend**: Vanilla JavaScript, Glassmorphism CSS (No frameworks!)
- **Backend/AI**: Ollama (Llama 3)
- **Architecture**: Chrome Extension V3 (Service Workers)

---

*Built for the GenAI Hackathon 2026.*
