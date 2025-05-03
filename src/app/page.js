"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [lang, setLang] = useState("zh");
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("");
  const [story, setStory] = useState("");
  const [voices, setVoices] = useState([]);

  const PRESETS = [
    "森林探險",
    "太空冒險",
    "海底世界",
    "魔法學院",
    "恐龍時代",
  ];

  useEffect(() => {
    const synth = window.speechSynthesis;
    const update = () => setVoices(synth.getVoices());
    synth.onvoiceschanged = update;
    update();
  }, []);

  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  const generateStory = () => {
    if (!name || !theme) return alert("請先輸入名字與主題");

    const zhIntros = [
      `今天，我們要來認識一個關於「${theme}」的奇幻故事…`,
      `在「${theme}」的世界裡，住著一位名叫 ${name} 的小朋友…`,
      `有一天，${name} 跟著我踏入了「${theme}」的秘密之門…`,
    ];
    const zhOutros = [
      `在「${theme}」的旅程結束後，${name} 帶著滿滿回憶回家了。`,
      `${name} 在「${theme}」中找到了新的朋友與勇氣。`,
      `這就是「${theme}」的奇妙故事，期待下一次冒險。`,
    ];

    const enIntros = [
      `Today, we embark on a wondrous tale about "${theme}".`,
      `In the world of "${theme}", there lived a curious child named ${name}.`,
      `One day, ${name} stepped through the secret door to the "${theme}" land…`,
    ];
    const enOutros = [
      `After the "${theme}" adventure, ${name} returned home with a heart full of memories.`,
      `${name} found new friends and courage in the world of "${theme}".`,
      `That’s the end of our "${theme}" story. Until the next adventure!`,
    ];

    const text = lang === "zh"
      ? `${pick(zhIntros)}

在冒險過程中，${name} 遇見了許多驚喜，也學會了分享與勇敢。

${pick(zhOutros)}`
      : `${pick(enIntros)}

Along the way, ${name} encountered many surprises and learned about sharing and courage.

${pick(enOutros)}`;

    setStory(text);
  };

  const handleSpeak = () => {
    if (!story) return alert("請先生成故事內容");
    const prefix = lang === "zh" ? "zh" : "en";
    const voice = voices.find(v =>
      v.lang.startsWith(prefix) &&
      /Female|Mei|Ting|Samantha|Victoria/.test(v.name)
    );
    const ut = new SpeechSynthesisUtterance(story);
    if (voice) ut.voice = voice;
    ut.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(ut);
  };

  return (
    <main className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">親子說故事</h1>

      {/* 1. 主題預設 & 隨機 */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(t => (
          <button
            key={t}
            className="px-3 py-1 bg-gray-200 rounded"
            onClick={() => setTheme(t)}
          >
            {t}
          </button>
        ))}
        <button
          className="px-3 py-1 bg-green-300 rounded"
          onClick={() => setTheme(pick(PRESETS))}
        >
          隨機主題
        </button>
      </div>

      {/* 2. 語言切換 */}
      <div className="flex space-x-2">
        <button
          className={`flex-1 py-2 rounded ${lang === "zh" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setLang("zh")}
        >
          中文
        </button>
        <button
          className={`flex-1 py-2 rounded ${lang === "en" ? "bg-purple-500 text-white" : "bg-gray-200"}`}
          onClick={() => setLang("en")}
        >
          English
        </button>
      </div>

      {/* 3. 表單：名字 + 主題 */}
      <div className="space-y-2">
        <input
          className="w-full p-2 border rounded"
          placeholder={lang === "zh" ? "小朋友名字" : "Child's Name"}
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder={lang === "zh" ? "主題" : "Theme"}
          value={theme}
          onChange={e => setTheme(e.target.value)}
        />
        <button
          className="w-full bg-indigo-500 text-white p-2 rounded"
          onClick={generateStory}
        >
          {lang === "zh" ? "產生故事" : "Generate Story"}
        </button>
      </div>

      {/* 4. 故事情節 */}
      {story && (
        <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
          {story}
        </pre>
      )}

      {/* 5. 朗讀 */}
      {story && (
        <button
          className="w-full bg-green-500 text-white p-2 rounded"
          onClick={handleSpeak}
        >
          {lang === "zh" ? "朗讀故事" : "Read Aloud"}
        </button>
      )}
    </main>
  );
}
