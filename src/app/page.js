// src/app/page.js
"use client";

import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [link, setLink] = useState("");
  const [story, setStory] = useState("");
  const [voices, setVoices] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const synthRef = useRef(window.speechSynthesis);

  // 載入語音列表
  useEffect(() => {
    const synth = window.speechSynthesis;
    const update = () => setVoices(synth.getVoices());
    synth.onvoiceschanged = update;
    update();
  }, []);

  // 產生故事
  const fetchYTStory = async () => {
    if (!link.trim()) {
      alert("請輸入 YouTube 連結");
      return;
    }
    setStory("");
    const url = new URL(window.location.href);
    url.pathname = "/api/yt-generate";
    url.searchParams.set("videoId", link.trim());

    try {
      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.story) setStory(data.story);
      else alert("生成失敗");
    } catch {
      alert("呼叫 API 失敗");
    }
  };

  // 流暢朗讀：拆句、依序播放
  const handleSpeak = () => {
    if (!story) {
      alert("請先生成故事");
      return;
    }

    const synth = synthRef.current;
    const available = voices.length ? voices : synth.getVoices();

    // 優先選輕柔女性中文聲
    const preferred = available.find((v) =>
      v.lang.startsWith("zh") &&
      /Mei|Ting|Liang|Yating|Yue|Sin-ji|female/i.test(v.name)
    );
    const fallback = available.find((v) => v.lang.startsWith("zh")) || available[0];

    // 拆分句子，保留標點
    const segments = story
      .split(/([。！？\?])/)
      .map((s) => s.trim())
      .filter((s) => s);

    const speakSegment = (idx) => {
      if (idx >= segments.length) return;
      const u = new SpeechSynthesisUtterance(segments[idx]);
      u.voice = preferred || fallback;
      u.rate = 0.9;
      u.pitch = 1.0;
      u.onend = () => {
        if (!synth.paused) speakSegment(idx + 1);
      };
      synth.speak(u);
    };

    synth.cancel();
    setIsPaused(false);
    speakSegment(0);
  };

  // 暫停/繼續
  const togglePause = () => {
    const synth = synthRef.current;
    if (synth.speaking) {
      if (isPaused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      <h1 className="text-3xl font-bold text-center mb-6">YouTube 隨機故事</h1>
      <div className="max-w-xl mx-auto space-y-4">
        <input
          className="w-full p-3 border rounded-lg"
          placeholder="貼上 YouTube 影片連結"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button
          className="w-full bg-indigo-600 text-white py-2 rounded-lg"
          onClick={fetchYTStory}
        >
          生成故事
        </button>

        {story && (
          <>
            <pre className="bg-white p-4 rounded-lg shadow whitespace-pre-wrap">
              {story}
            </pre>
            <div className="flex gap-4">
              <button
                className="flex-1 bg-green-500 text-white py-2 rounded-lg"
                onClick={handleSpeak}
              >
                播放
              </button>
              <button
                className="flex-1 bg-yellow-500 text-white py-2 rounded-lg"
                onClick={togglePause}
              >
                {isPaused ? "繼續" : "暫停"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
