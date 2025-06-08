"use client";

import { useEffect, useRef, useState } from "react";

const styleOptions = [
  "Studio Ghibli",
  "Andy Warhol",
  "1930s Vintage",
  "Modern Contemporary",
  "Minimalist Danish",
];

type Track = {
  title: string;
  artist: string;
  album?: string;
  image?: string;
  nowPlaying?: boolean;
};

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [posterPrompt, setPosterPrompt] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [mode, setMode] = useState<"top" | "current">("top");
  const [timeframe, setTimeframe] = useState("7day");
  const [style, setStyle] = useState(styleOptions[0]);
  const [theme, setTheme] = useState("light");

  const timeframeOptions = [
    { label: "7 days", value: "7day" },
    { label: "30 days", value: "1month" },
    { label: "90 days", value: "3month" },
    { label: "180 days", value: "6month" },
    { label: "365 days", value: "12month" },
    { label: "All time", value: "overall" },
  ];

  useEffect(() => {
    const storedUsername = localStorage.getItem("lastfm_username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const logout = () => {
    localStorage.removeItem("lastfm_username");
    setUsername(null);
    setTrack(null);
    setPosterPrompt(null);
    setImageUrl(null);
  };

  const fetchTrack = async () => {
    if (!username) return;
    const endpoint =
      mode === "top"
        ? `/api/top-track?timeframe=${timeframe}&username=${username}`
        : `/api/current-track?username=${username}`;

    const res = await fetch(endpoint);
    const data = await res.json();
    console.log("Fetched track:", data);
    if (!data.error) setTrack(data.track || data);
    else setTrack(null);
  };

  const generatePosterPrompt = async () => {
    if (!track) return;
    const res = await fetch("/api/generate-prompt", {
      method: "POST",
      body: JSON.stringify({
        title: track.title,
        artist: track.artist,
        style,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setPosterPrompt(data.prompt);
  };

  const generateImage = async () => {
    if (!posterPrompt) return;
    setLoadingImage(true);
    const res = await fetch("/api/generate-image", {
      method: "POST",
      body: JSON.stringify({ prompt: posterPrompt }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setImageUrl(data.imageUrl);
    setLoadingImage(false);
  };

  const Dropdown = ({
    
    options,
    selected,
    onSelect,
  }: {
    label: string;
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
  }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="relative inline-block text-left" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
        >
          {selected}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.586l3.71-3.354a.75.75 0 111.02 1.096l-4 3.615a.75.75 0 01-1.02 0l-4-3.615a.75.75 0 01.02-1.096z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {open && (
          <div className="origin-top-right absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onSelect(opt);
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center p-6 transition-all duration-300 ${
        theme === "dark" ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="w-full flex justify-between items-center mb-6 max-w-4xl">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            🎧 <span>Everyday Echo</span>
          </h1>
          {username && (
            <div className="text-sm mt-1 text-gray-600 dark:text-gray-300">
              Signed in as <strong>{username}</strong>
              <button
                onClick={logout}
                className="ml-3 text-xs text-red-500 hover:underline"
              >
                Log out
              </button>
            </div>
          )}
        </div>
        <div className="flex gap-3 items-center">
          <Dropdown
            label="Mode"
            options={["Top Track", "Currently Playing"]}
            selected={mode === "top" ? "Top Track" : "Currently Playing"}
            onSelect={(val) => setMode(val === "Top Track" ? "top" : "current")}
          />
          <Dropdown
            label="Style"
            options={styleOptions}
            selected={style}
            onSelect={(val) => setStyle(val)}
          />
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="text-lg rounded bg-gray-200 dark:bg-gray-700 px-3 py-1"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>

      {!username && (
        <button
          onClick={() => {
            const apiKey = process.env.NEXT_PUBLIC_LASTFM_API_KEY || 'fallback_key';
            window.location.href = `https://www.last.fm/api/auth/?api_key=${apiKey}&cb=http://localhost:3000/callback`;
          }}
          className="bg-black text-white px-4 py-2 rounded mb-6"
        >
          Connect to Last.fm
        </button>
      )}

      {mode === "top" && username && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Select timeframe</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border rounded bg-white text-black dark:bg-gray-900 dark:text-white"
          >
            {timeframeOptions.map((tf) => (
              <option key={tf.value} value={tf.value}>
                {tf.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {username && (
        <button
          onClick={fetchTrack}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6"
        >
          Fetch {mode === "top" ? "Top Track" : "Current Track"}
        </button>
      )}

      {track?.title && track?.artist ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            🎵 {track.title} – {track.artist}
            {track.nowPlaying && (
              <span className="ml-2 text-green-500">(Now Playing)</span>
            )}
          </h2>
          {track.album && <p className="italic">Album: {track.album}</p>}
          {track.image && (
            <img
              src={track.image}
              alt="cover"
              className="w-32 h-32 mt-2 mx-auto rounded shadow"
            />
          )}
          <button
            onClick={generatePosterPrompt}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
          >
            Generate Poster Prompt
          </button>
        </div>
      ) : (
        username && (
          <div className="text-center text-gray-500 italic mt-4">
            No track data available.
          </div>
        )
      )}

      {posterPrompt && (
        <div className="mt-4 text-center max-w-xl">
          <p className="mb-2 italic text-sm">Prompt: {posterPrompt}</p>
          <button
            onClick={generateImage}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Generate Poster
          </button>
        </div>
      )}

      {loadingImage && <p className="mt-4">Generating image...</p>}
      {imageUrl && (
        <div className="mt-6">
          <img
            src={imageUrl}
            alt="Generated poster"
            className="rounded-lg w-full max-w-xl mx-auto"
          />
        </div>
      )}
    </main>
  );
}