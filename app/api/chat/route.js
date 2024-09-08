import { NextResponse } from 'next/server';
import openai from '@/app/lib/openai';

export async function POST(req) {
  const { messages } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const aiResponse = completion.choices[0].message.content;
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Failed to generate AI response' }, { status: 500 });
  }
}