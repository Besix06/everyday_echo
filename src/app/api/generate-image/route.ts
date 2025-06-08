import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
  }

  console.log('Generating image with prompt:', prompt); // ✅ Add this line

  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: '1024x1024',
        model: 'dall-e-3',
      }),
    });

    const data = await res.json();
    console.log('OpenAI image API response:', data); // ✅ Add this line

    const imageUrl = data?.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image returned' }, { status: 500 });
    }

    return NextResponse.json({ imageUrl });
  } catch (err) {
    console.error('OpenAI image generation error:', err); // ✅ Add this line
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
