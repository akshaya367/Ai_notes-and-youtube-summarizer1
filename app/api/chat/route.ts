import { generateAIResponse } from '@/lib/ai/openai';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log('Chat API Request received - Message count:', messages.length);

    const response = await generateAIResponse(messages);
    console.log('AI completion stream initialized');

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = (chunk as any).choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          console.log('Streaming successfully finished');
        } catch (streamError) {
          console.error('Error during streaming:', streamError);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('Chat API Fatal Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
