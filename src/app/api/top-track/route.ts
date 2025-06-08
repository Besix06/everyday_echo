import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.LASTFM_API_KEY;

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username');
  const timeframe = req.nextUrl.searchParams.get('timeframe') || '7day';

  if (!username || !API_KEY) {
    return NextResponse.json({ error: 'Missing username or API key' }, { status: 400 });
  }

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${API_KEY}&period=${timeframe}&format=json&limit=1`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    const top = json?.toptracks?.track?.[0];
    if (!top) {
      return NextResponse.json({ error: 'No track data found' }, { status: 404 });
    }

    return NextResponse.json({
      track: {
        title: top.name,
        artist: top.artist?.name,
        playcount: top.playcount,
        url: top.url,
        image: top.image?.[2]?.['#text'] || null,
      },
    });
  } catch {
  return NextResponse.json({ error: 'Failed to fetch current track' }, { status: 500 });
}
}
