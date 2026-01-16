
const fs = require('fs');
const path = require('path');
const http = require('http');

// Configuration
const DATASET_PATH = path.join(__dirname, 'dataset.csv');
const OLLAMA_HOST = 'localhost';
const OLLAMA_PORT = 11434;
const MODEL_NAME = 'llama3';

// Colors for console output
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    bold: "\x1b[1m"
};

// Simple CSV Parser (handles quoted strings)
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Regex to match CSV fields with quotes
        const regex = /(?:^|,)(?:"([^"]*)"|([^",]*))/g;
        let match;
        const row = [];
        while ((match = regex.exec(line))) {
            // match[1] is quoted value, match[2] is unquoted value
            let val = match[1] !== undefined ? match[1] : match[2];
            row.push(val);
        }

        // Simple mapping based on known structure: id, text, ground_truth
        // The regex might produce empty strings at start/end, so we filtered carefully or just map by index
        // For this specific simple CSV structure (id, "text", label), the regex approach can be simplified:
        // We know structure is: id, "text", label OR id, text, label

        // Robust manual parse for this specific 3-column format
        const firstComma = line.indexOf(',');
        const lastComma = line.lastIndexOf(',');

        let id, text, ground_truth;

        if (firstComma !== -1 && lastComma !== -1 && lastComma > firstComma) {
            id = line.substring(0, firstComma);
            ground_truth = line.substring(lastComma + 1).replace(/"/g, '').trim(); // Remove potential quotes from label

            // Text is in between. Remove surrounding quotes if present.
            let rawText = line.substring(firstComma + 1, lastComma);
            if (rawText.startsWith('"') && rawText.endsWith('"')) {
                text = rawText.slice(1, -1);
            } else {
                text = rawText;
            }

            // Unescape double quotes if any (standard CSV)
            text = text.replace(/""/g, '"');

            data.push({ id, text, ground_truth });
        }
    }
    return data;
}

// Function to call Ollama
function classifyArticle(text) {
    return new Promise((resolve, reject) => {
        const prompt = `You are a news credibility risk classifier.

Task:
Given a news article, classify it strictly into one of the following labels:
- LOW_RISK
- MEDIUM_RISK
- HIGH_RISK

Rules:
- Output ONLY the label.
- Do NOT explain.
- Do NOT add extra text.
- Be consistent across similar articles.

Article:
"${text}"
`;

        const requestData = JSON.stringify({
            model: MODEL_NAME,
            prompt: prompt,
            stream: false,
            temperature: 0, // Deterministic
            top_p: 1
        });

        const options = {
            hostname: OLLAMA_HOST,
            port: OLLAMA_PORT,
            path: '/api/generate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': requestData.length
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Ollama API Error: ${res.statusCode} - ${data}`));
                    return;
                }
                try {
                    const responseJson = JSON.parse(data);
                    const responseText = responseJson.response.trim();
                    // Clean up response to ensure only label
                    let label = "UNKNOWN";
                    if (responseText.includes("LOW_RISK")) label = "LOW_RISK";
                    else if (responseText.includes("MEDIUM_RISK")) label = "MEDIUM_RISK";
                    else if (responseText.includes("HIGH_RISK")) label = "HIGH_RISK";

                    resolve(label);
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (e) => {
            reject(new Error(`Connection failed: ${e.message}. Is Ollama running?`));
        });

        req.write(requestData);
        req.end();
    });
}

async function runEvaluation() {
    console.log(`${colors.cyan}${colors.bold}🕵️  Starting News Credibility Evaluation...${colors.reset}\n`);

    if (!fs.existsSync(DATASET_PATH)) {
        console.error(`${colors.red}Dataset not found at ${DATASET_PATH}${colors.reset}`);
        process.exit(1);
    }

    const csvContent = fs.readFileSync(DATASET_PATH, 'utf8');
    const dataset = parseCSV(csvContent);

    console.log(`Loaded dataset with ${colors.bold}${dataset.length}${colors.reset} examples.`);
    console.log(`Model: ${colors.yellow}${MODEL_NAME}${colors.reset}, Temperature: ${colors.yellow}0${colors.reset} (Deterministic)\n`);

    const results = {
        total: 0,
        correct: 0,
        matrix: {
            LOW_RISK: { total: 0, correct: 0, predicted_as: { LOW_RISK: 0, MEDIUM_RISK: 0, HIGH_RISK: 0, UNKNOWN: 0 } },
            MEDIUM_RISK: { total: 0, correct: 0, predicted_as: { LOW_RISK: 0, MEDIUM_RISK: 0, HIGH_RISK: 0, UNKNOWN: 0 } },
            HIGH_RISK: { total: 0, correct: 0, predicted_as: { LOW_RISK: 0, MEDIUM_RISK: 0, HIGH_RISK: 0, UNKNOWN: 0 } }
        }
    };

    const predictions = [];
    const startTime = Date.now();

    for (let i = 0; i < dataset.length; i++) {
        const item = dataset[i];
        process.stdout.write(`Processing ${i + 1}/${dataset.length}: ID ${item.id}... `);

        try {
            const prediction = await classifyArticle(item.text);
            const isCorrect = prediction === item.ground_truth;

            if (isCorrect) {
                process.stdout.write(`${colors.green}✓${colors.reset}\n`);
                results.correct++;
            } else {
                process.stdout.write(`${colors.red}✗ (Pred: ${prediction} | True: ${item.ground_truth})${colors.reset}\n`);
            }

            results.total++;
            results.matrix[item.ground_truth].total++;
            if (results.matrix[item.ground_truth].correct !== undefined && isCorrect) {
                results.matrix[item.ground_truth].correct++;
            }
            if (results.matrix[item.ground_truth].predicted_as[prediction] !== undefined) {
                results.matrix[item.ground_truth].predicted_as[prediction]++;
            }

        } catch (error) {
            console.log(`\n${colors.red}Error processing ID ${item.id}: ${error.message}${colors.reset}`);
            if (error.message.includes("Connection failed")) {
                console.log(`${colors.yellow}Make sure Ollama is running: 'ollama serve'${colors.reset}`);
                process.exit(1);
            }
        }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // Calculate Metrics
    const accuracy = ((results.correct / results.total) * 100).toFixed(2);

    // Precision & Recall for HIGH_RISK (Critical for credibility)
    const highRiskTrue = results.matrix.HIGH_RISK.correct;
    const highRiskPredicted =
        results.matrix.LOW_RISK.predicted_as.HIGH_RISK +
        results.matrix.MEDIUM_RISK.predicted_as.HIGH_RISK +
        results.matrix.HIGH_RISK.predicted_as.HIGH_RISK;

    const highRiskPrecision = highRiskPredicted > 0 ? ((highRiskTrue / highRiskPredicted) * 100).toFixed(2) : "0.00";
    const highRiskRecall = results.matrix.HIGH_RISK.total > 0 ? ((highRiskTrue / results.matrix.HIGH_RISK.total) * 100).toFixed(2) : "0.00";


    console.log(`\n${colors.bold}--- EVALUATION RESULTS ---${colors.reset}`);
    console.log(`Time taken: ${duration}s`);
    console.log(`Total Articles: ${results.total}`);
    console.log(`Accuracy: ${colors.green}${accuracy}%${colors.reset}`);
    console.log(`High Risk Precision: ${highRiskPrecision}%`);
    console.log(`High Risk Recall: ${highRiskRecall}%`);

    console.log(`\n${colors.bold}Confusion Matrix:${colors.reset}`);
    console.table({
        'Actual LOW': results.matrix.LOW_RISK.predicted_as,
        'Actual MEDIUM': results.matrix.MEDIUM_RISK.predicted_as,
        'Actual HIGH': results.matrix.HIGH_RISK.predicted_as
    });
}

runEvaluation();
