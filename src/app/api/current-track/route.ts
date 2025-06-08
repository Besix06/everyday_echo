import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.LASTFM_API_KEY;

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username');

  if (!username || !API_KEY) {
    return NextResponse.json({ error: 'Missing username or API key' }, { status: 400 });
  }

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${API_KEY}&format=json&limit=1`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    const recentTrack = json?.recenttracks?.track?.[0];

    if (!recentTrack) {
      return NextResponse.json({ error: 'No recent tracks found' }, { status: 404 });
    }

    const isPlaying = recentTrack['@attr']?.nowplaying === 'true';

    return NextResponse.json({
      title: recentTrack.name,
      artist: recentTrack.artist['#text'],
      album: recentTrack.album['#text'],
      image: recentTrack.image?.[2]?.['#text'] ?? null,
      nowPlaying: isPlaying,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch current track' }, { status: 500 });
  }
}
