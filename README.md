# 🎧 Everyday Echo

Everyday Echo is a **Next.js** + **Tailwind** web app that connects to your **Last.fm** account and uses **OpenAI’s DALL·E** to turn your music listening—your top or currently playing track—into a styled poster. 

Choose from styles like *Studio Ghibli*, *Minimalist Danish*, and more. It's like music meets art in a daily visual diary.

## 🚀 Features
- Login via Last.fm & choose between **Top Track** (by timeframe) or **Current Track**
- Select a visual **style** like Ghibli, Warhol, Vintage
- Generate a custom **poster prompt** and **DALL·E image**
- Switch between light/dark **themes**
- Responsive UI with clean Tailwind-based dropdowns


## 🧰 Tech Stack
- Frontend & server-side: **Next.js 14**
- Styling: **Tailwind CSS**
- Auth & data from **Last.fm API**
- Image generation via **OpenAI DALL·E**

## ⚙️ Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/Besix06/everyday_echo.git
   cd everyday_echo

2. Install dependencies:
   npm install

3. Create a .env.local file with:

    LASTFM_API_KEY=your_lastfm_key
    LASTFM_API_SECRET=your_lastfm_secret
    OPENAI_API_KEY=your_openai_key

## 🧩 Usage

- Click **Connect to Last.fm**.
- Choose between **Top Track** or **Currently Playing**.
- Select timeframe (if “Top Track” mode).
- Choose your desired poster style.
- Click **Fetch**, then generate prompt and image.
- Download your custom poster.