const express = require('express');
const ai = require('./groq');
const router = express.Router();

router.post("/report", async (req, res) => {
  const {
    title,
    description,
    headings,
    introSampleText,
    midSampleText,
    endSampleText,
    url,
  } = req.body;

  const prompt = `
You are a factual‑accuracy evaluator. Judge whether the webpage is legitimate or fabricated based ONLY on established science, history, geography, and known institutions.

Evaluate the following webpage data:
Title: ${title}
Description: ${description}
Headings: ${headings}
Intro: ${introSampleText}
Middle: ${midSampleText}
End: ${endSampleText}
URL: ${url}

RULES:
- Unsupported = FALSE.
- If ANY central claim is false or unsupported → classification MUST be "not legit" and score MUST be 5–20.
- Major penalties include: fabricated institutions, journals, missions, equipment, researchers, impossible claims, fake URLs, invented historical events.
- 2+ major penalties → cap score at 50.
- 4+ major penalties → cap score at 25.
- 6+ major penalties → cap score at 15.
- Writing quality or tone must NOT raise the score.

OUTPUT FORMAT (must follow exactly):
Return ONLY a JSON object with these fields:

{
  "classification": "legit / probably legit / maybe legit / not legit",
  "summary": "3–6 sentence summary of the webpage",
  "redFlags": ["list of red flag bullet points"],
  "score": X
}

Do not include any text before or after the JSON. Output ONLY the JSON object.

The summary MUST be 3–6 sentences. If not, the answer is incorrect.
A 0 for the score is reserved only for complete fabrication (eg. No correct/partially-correct claims), otherwise rank it a 5-10

`;

  const report = await ai(prompt);
  const reportObj = JSON.parse(report);
  res.json(reportObj);

});

module.exports = router;
