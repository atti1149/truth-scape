import express from 'express';
import ai from './groq.js'
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
- A claim is  ONLY FALSE only if it contradicts known facts.
- You are given a sample, if the sample misses facts or information, do NOT penalize.
- 2+ major penalties → cap score at 50.
- 4+ major penalties → cap score at 25.
- 6+ major penalties → cap score at 15.
- Writing quality or tone must NOT raise the score.
- Example of not getting penalized : "The Rubik's cube was invented in 1974", just because it does not mention main method to solve it, it does not get penalized.
- Example of getting penalized : "The Rubik's cube was invented in 2004", the Rubik's cube was invented in 1974, since this center claim is wrong, it gets penalized.

OUTPUT FORMAT (must follow exactly):
Return ONLY a JSON object with these fields:

{
  "classification": "legit / probably legit / maybe legit / not legit",
  "summary": "3–6 sentence summary of the webpage",
  "redFlags": Red flags MUST be formatted as a JSON-safe bullet list using "\\n- " before each item. You MUST NOT use real line breaks. Only use the literal characters \\n inside the JSON string. Example: "- issue one\\n- issue two\\n- issue three",
  "score": X
}

Do not include any text before or after the JSON. Output ONLY the JSON object.

If there are no red flags, simply say None.

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

export default router
