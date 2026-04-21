import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(req: Request) {
  try {
    const { skills } = await req.json();

    if (!skills) {
      return NextResponse.json({ error: 'Skills are required' }, { status: 400 });
    }

    const prompt = `Act as a Senior Support Architect. Based on this input: "${skills}", return a list of 5 categorized support insights. 
    For each insight, provide:
    1. Insight Title (e.g., "Critical: Billing Gateway Timeout")
    2. Priority Level (Low, Medium, or High)
    3. Metrics: 3-4 data points to check
    4. Resolution Plan: A detailed step-by-step technical guide (at least 4 steps) to solve this specific problem.
    
    Format the response MUST be a valid JSON array of objects with keys: "title", "salary" (put priority here), "skills" (put metrics here), "companies" (put resolution plan array here).
    Do not include any other text or markdown like \`\`\`json.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    });

    const content = chatCompletion.choices[0].message.content || '[]';
    
    // Robust JSON extraction
    let jobs = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      jobs = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Content:', content);
      // Fallback data if AI fails to return valid JSON
      jobs = [
        { 
          title: `Analysis for: ${skills}`, 
          salary: "HIGH", 
          skills: ["Automatic Ticket Routing", "Sentiment Flagging"], 
          companies: ["Enable AI auto-replies", "Route to senior tech"] 
        }
      ];
    }

    return NextResponse.json({ jobs });
  } catch (error: any) {
    console.error('Groq Search Error:', error);
    return NextResponse.json({ 
      jobs: [
        { 
          title: "Intelligent Ticket Analysis", 
          salary: "MEDIUM", 
          skills: ["Service Level Check", "Customer Context"], 
          companies: ["Review account history", "Check active subscriptions"] 
        }
      ] 
    }, { status: 200 }); // Return success with fallback even on error for UX
  }
}
