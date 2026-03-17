const Groq=require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function ai(prompt) {
  const chatCompletion = await getGroqChatCompletion(prompt);
  // Print the completion returned by the LLM.
  return chatCompletion.choices[0]?.message?.content || ""
}

async function getGroqChatCompletion(prompt) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.1-8b-instant",
  });
}
module.exports=ai