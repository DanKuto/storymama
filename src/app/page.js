// src/app/page.js
"use client";

import { useEffect, useState } from "react";

// 1. 模块顶层：预设主题与随机函数
const PRESETS = [
  "森林探險",
  "太空冒險",
  "海底世界",
  "魔法學院",
  "恐龍時代",
];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function Home() {
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("");
  const [story, setStory] = useState("");
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const update = () => setVoices(synth.getVoices());
    synth.onvoiceschanged = update;
    update();
  }, []);

  const generateStory = () => {
    if (!name.trim() || !theme.trim()) {
      return alert("請先輸入小朋友名字與主題");
    }

    const zhIntros = [
      `今天，我們要來認識一個關於「${theme}」的奇幻故事…`,
      `在「${theme}」的世界裡，住著一位名叫 ${name} 的小朋友…`,
      `有一天，${name} 跟著我踏入了「${theme}」的秘密之門…`,
    ];
    const zhOutros = [
      `結束了「${theme}」的冒險後，${name} 帶著滿滿回憶回家了。`,
      `${name} 在「${theme}」中找到了勇氣與新朋友。`,
      `這就是「${theme}」的奇妙故事，下次再一起前往新冒險！`,
    ];

    const text = `${pick(zhIntros)}

在冒險途中，${name} 遇見了許多驚喜，也學會了分享與勇氣。

${pick(zhOutros)}`;

    setStory(text);
  };

  const handleSpeak = () => {
    if (!story) return alert("請先生成故事內容");
    const voice = voices.find((v) =>
      v.lang.startsWith("zh") && /Female|Mei|Ting/.test(v.name)
    );
    const ut = new SpeechSynthesisUtterance(story);
    if (voice) ut.voice = voice;
    ut.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(ut);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero */}
      <section
        className="relative h-64 md:h-80 lg:h-96 flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `url(/images/hero.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
            美好故事多
          </h1>
          <p className="mb-4 text-lg md:text-xl">
            每天一篇，讓親子時光更溫柔
          </p>
          <button
            className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-full text-white font-semibold shadow-lg"
            onClick={() => {
              document
                .getElementById("story-form")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            生成故事
          </button>
        </div>
      </section>

      {/* Form & Story */}
      <section id="story-form" className="max-w-xl mx-auto p-6 space-y-6">
        {/* 主題預設 & 隨機 */}
        <div className="flex flex-wrap gap-2 justify-center">
          {PRESETS.map((t) => (
            <button
              key={t}
              className="px-3 py-1 bg-purple-200 hover:bg-purple-300 rounded-full text-sm"
              onClick={() => setTheme(t)}
            >
              {t}
            </button>
          ))}
          <button
            className="px-3 py-1 bg-green-300 hover:bg-green-400 rounded-full text-sm"
            onClick={() => setTheme(pick(PRESETS))}
          >
            隨機主題
          </button>
        </div>

        {/* 輸入表單 */}
        <div className="space-y-4">
          <input
            className="w-full p-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-200"
            placeholder="小朋友名字"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full p-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-200"
            placeholder="主題"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
          <button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold shadow"
            onClick={generateStory}
          >
            產生故事
          </button>
        </div>

        {/* 故事情節 */}
        {story && (
          <div className="mb-6">
            <div className="text-gray-800 bg-white p-6 rounded-lg shadow-lg whitespace-pre-wrap leading-relaxed">
              {sto
