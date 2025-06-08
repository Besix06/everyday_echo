const API_KEY = 'YOUR_LASTFM_API_KEY';
const API_BASE = 'https://ws.audioscrobbler.com/2.0/';

export async function getTopTrack(timeframe: string, username: string) {
  const url = `${API_BASE}?method=user.gettoptracks&user=${username}&period=${timeframe}&limit=1&api_key=${API_KEY}&format=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data?.toptracks?.track?.length > 0) {
      const top = data.toptracks.track[0];
      return {
        title: top.name,
        artist: top.artist.name,
        playcount: top.playcount,
        url: top.url,
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error('Error fetching top track:', err);
    return null;
  }
}