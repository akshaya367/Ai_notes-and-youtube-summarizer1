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

    const prompt = `Act as an expert career consultant in India. Based on these skills: "${skills}", return a list of 5 premium job roles. 
    For each role, provide:
    1. Job Title
    2. Salary Range (in INR Lakhs per annum)
    3. Essential Skills
    4. 3-4 Top Companies hiring for this in India.
    
    Format the response MUST be a valid JSON array of objects with keys: "title", "salary", "skills" (array), "companies" (array).
    Do not include any other text or markdown like \`\`\`json.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      temperature: 0.7,
    });

    const content = chatCompletion.choices[0].message.content || '[]';
    const jobs = JSON.parse(content.trim());

    return NextResponse.json({ jobs });
  } catch (error: any) {
    console.error('Groq Search Error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
