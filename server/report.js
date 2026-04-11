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
- A claim is FALSE only if it contradicts known facts. A claim is NOT false just because it is unsupported or not mentioned in the sample. Missing evidence does NOT count as evidence against the claim. Only penalize claims that are factually incorrect.
- Red flags must ONLY refer to factual inaccuracies, fabricated entities, impossible claims, or invented events. Missing explanations, unclear writing, or lack of detail are NOT red flags.
- "Unsupported" means the sample does not provide enough information to determine whether the claim is central or not. Unsupported DOES NOT mean the claim is false.
- A central claim is only disqualifying if it is factually false. Unsupported central claims must NOT be penalized.
- 2+ major penalties → cap score at 50.
- 4+ major penalties → cap score at 25.
- 6+ major penalties → cap score at 15.
- Writing quality or tone must NOT raise the score.

OUTPUT FORMAT (must follow exactly):
Return ONLY a JSON object with these fields:

{
  "classification": "legit / probably legit / maybe legit / not legit",
  "summary": "3–6 sentence summary of the webpage",
  "redFlags": Red flags MUST be formatted as a JSON-safe bullet list using "\\n- " before each item. You MUST NOT use real line breaks. Only use the literal characters \\n inside the JSON string. Example: "- issue one\\n- issue two\\n- issue three",
  "score": X
}

Do not include any text before or after the JSON. Output ONLY the JSON object.

The summary MUST be 3–6 sentences. If not, the answer is incorrect.
A 0 for the score is reserved only for complete fabrication (eg. No correct/partially-correct claims), otherwise rank it a 5-10.
0-20 is not legit
21-50 is probably not legit
51-79 is probably legit
80-100 is legit
score must not be more than 100

Your summary must influence the score,not the other way around
`;

  const report = await ai(prompt);
  const reportObj = JSON.parse(report);
  res.json(reportObj);

});

module.exports = router;
