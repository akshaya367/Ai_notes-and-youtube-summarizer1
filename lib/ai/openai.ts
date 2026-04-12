import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

export const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
}) : null;

export async function generateAIResponse(messages: { role: 'user' | 'assistant' | 'system', content: string }[]) {
  if (!openai) {
    // Return a mocked streaming response for demo purposes
    return (async function* () {
      const mockResponse = "Hey! I'm Nexus AI. Since your `OPENAI_API_KEY` is not set, I'm currently running in **Demo Mode**. \n\nOnce configured, I'll be able to provide real-time, context-aware support based on your documentation!";
      const words = mockResponse.split(' ');
      for (const word of words) {
        yield { choices: [{ delta: { content: word + ' ' } }] };
        await new Promise(r => setTimeout(r, 60));
      }
    })();
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: 'You are a helpful, professional customer support AI for Nexus. Use the provided knowledge base to answer questions.' },
      ...messages
    ],
    stream: true,
  });

  return response;
}
