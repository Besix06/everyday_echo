import { NextRequest, NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

const API_KEY = process.env.LASTFM_API_KEY;
const API_SECRET = process.env.LASTFM_API_SECRET;

if (!API_KEY || !API_SECRET) {
  throw new Error("Missing LASTFM_API_KEY or LASTFM_API_SECRET");
}

function getSignature(params: Record<string, string>, secret: string) {
  const keys = Object.keys(params).sort();
  let base = '';
  for (const key of keys) {
    base += key + params[key];
  }
  return CryptoJS.MD5(base + secret).toString();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const params: Record<string, string> = {
    api_key: API_KEY,
    method: 'auth.getSession',
    token,
  };

  const api_sig = getSignature(params, API_SECRET);
  const url = `https://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=${API_KEY}&token=${token}&api_sig=${api_sig}&format=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const username = data?.session?.name;

    if (!username) {
      return NextResponse.json({ error: 'Username not found' }, { status: 404 });
    }

    return NextResponse.json({ username });
  } catch (err) {
    console.error('Session fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}