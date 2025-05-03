"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [lang, setLang] = useState("zh");        // 語言：zh / en
  const [name, setName] = useState("");          // 小朋友名字
  const [likes, setLikes] = useState("");        // 喜好物件（逗號分隔）
  const [story, setStory] = useState("");        // 生成的故事
  const [voices, setVoices] = useState([]);

  // 載入可用語音列表
  useEffect(() => {
    const synth = window.speechSynthesis;
    const update = () => setVoices(synth.getVoices());
    synth.onvoiceschanged = update;
    update();
  }, []);

  // 隨機故事模板組合
  const generateStory = () => {
    if (!name) return alert("請先輸入小朋友的名字");

    // 處理喜好物件
    const items = likes
      .split(",")
      .map(s => s.trim())
      .filter(s => s);
    // 保證至少三個元素
    while (items.length < 3) items.push(items[items.length % items.length] || "玩具");
    const [a, b, c] = items;

    // 一些隨機開頭或結尾
    const zhIntros = [
      `從前有位名叫「${name}」的小朋友，他最喜歡的東西有：${items.join("、")}。`,
      `在一個陽光明媚的早晨，${name}帶著他的${a}、${b}和${c}出門探險。`,
      `${name}是一位充滿好奇心的小朋友，最愛的三樣東西是：${items.join("、")}。`
    ];
    const zhOutros = [
      `最終，${name}與新朋友們歡樂地結伴回家，滿懷期待地等待下一次冒險。`,
      `故事到此結束，祝${name}每天都能和${a}、${b}、${c}一起開心玩耍！`,
      `他們在星空下道了再見，期待下次更奇妙的旅程。`
    ];

    const enIntros = [
      `Once upon a time, there was a child named ${name} who loved ${items.join(", ")}.`,
      `${name} woke up one morning, excited to play with their ${a}, ${b}, and ${c}.`,
      `${name} was a curious child, always carrying their favorite ${a}, ${b}, and ${c}.`
    ];
    const enOutros = [
      `In the end, ${name} and friends happily returned home, dreaming of the next adventure.`,
      `And so the story ends. May ${name} and their ${a}, ${b}, and ${c} always have fun together!`,
      `They waved goodbye under the stars, eagerly awaiting their next journey.`
    ];

    const pick = arr => arr[Math.floor(Math.random() * arr.length)];

    // 組出最終故事
    const text =
      lang === "zh"
        ? `${pick(zhIntros)}
        
    一路上，${name}遇見了奇妙的事物，也學會了分享與勇氣。
    
    ${pick(zhOutros)}`
        : `${pick(enIntros)}
        
    Along the way, ${name} discovered wondrous things and learned about sharing and courage.
    
    ${pick(enOutros)}`;

    setStory(text);
  };

  // 朗讀
  const handleSpeak = () => {
    if (!story) return alert("請先生成故事內容");
    const prefix = lang === "zh" ? "zh" : "en";
    // 選第一支對應女性聲音
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

      {/* 語言切換 */}
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

      {/* 表單：名字 + 喜好物件 */}
      <div className="space-y-2">
        <input
          className="w-full p-2 border rounded"
          placeholder={lang === "zh" ? "小朋友名字" : "Child's Name"}
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder={
            lang === "zh"
              ? "喜好物件（逗號分隔，如：車車,恐龍,飛機）"
              : "Favorite items (comma separated, e.g. car, dinosaur, plane)"
          }
          value={likes}
          onChange={e => setLikes(e.target.value)}
        />
        <button
          className="w-full bg-indigo-500 text-white p-2 rounded"
          onClick={generateStory}
        >
          {lang === "zh" ? "產生故事" : "Generate Story"}
        </button>
      </div>

      {/* 故事情節 */}
      {story && (
        <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
          {story}
        </pre>
      )}

      {/* 朗讀按鈕 */}
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
