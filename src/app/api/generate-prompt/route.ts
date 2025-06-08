import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { title, artist, style } = await req.json();

  if (!title || !artist || !style) {
    return NextResponse.json({ error: 'Missing title, artist, or style' }, { status: 400 });
  }

  const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, '');
  const cleanArtist = artist.replace(/[^a-zA-Z0-9\s]/g, '');
  const cleanStyle = style.replace(/[^a-zA-Z0-9\s]/g, '');

  const prompt = `An illustrated poster in ${cleanStyle} style, inspired by the song "${cleanTitle}" by ${cleanArtist}. Include visual metaphors, emotional tone, and a fitting background. 
  Consider the lyrics as inspiration, focusing on the themes of the song. The poster should evoke the mood and essence of the music, using colors and imagery that reflect the song's atmosphere.`;

  return NextResponse.json({ prompt });
}