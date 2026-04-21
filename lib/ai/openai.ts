import OpenAI from 'openai';

const apiKey = process.env.GROQ_API_KEY;

export const groq = apiKey ? new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://api.groq.com/openai/v1',
}) : null;

export async function generateAIResponse(messages: { role: 'user' | 'assistant' | 'system', content: string }[]) {
  if (!groq) {
    // Return a mocked streaming response for demo purposes
    return (async function* () {
      const mockResponse = "Hey! I'm Nexus AI. Since your `GROQ_API_KEY` is not set, I'm currently running in **Demo Mode**. \n\nOnce configured, I'll be able to provide real-time, context-aware support powered by Llama 3!";
      const words = mockResponse.split(' ');
      for (const word of words) {
        yield { choices: [{ delta: { content: word + ' ' } }] };
        await new Promise(r => setTimeout(r, 60));
      }
    })();
  }

  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: 'You are Nexus Assistant, a premium AI-powered Customer Support specialist. You help support teams analyze tickets, quality check documentation, and resolve customer issues effectively. Be concise, professional, and empathetic.' },
      ...messages
    ],
    stream: true,
  });

  return response;
}
