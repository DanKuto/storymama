"use client";

import { useEffect, useState } from "react";

export default function Home() {
  // 範例故事文字，之後會用 API 或範本動態替換
  const [story, setStory] = useState(
    "從前有個勇敢的小朋友，他最喜歡車車和恐龍，還有飛機和娃娃……\n\n(點擊下方按鈕開始朗讀)"
  );
  const [voices, setVoices] = useState([]);

  // 載入並更新語音列表
  useEffect(() => {
    const synth = window.speechSynthesis;
    const updateVoices = () => setVoices(synth.getVoices());
    synth.onvoiceschanged = updateVoices;
    updateVoices();
  }, []);

  // 語音朗讀函式
  const handleSpeak = (langPrefix, nameHint) => {
    if (!voices.length) return alert("語音尚未載入，請稍後再試");
    // 找出對應語系且名稱包含提示字串的女性聲音
    const voice = voices.find(
      (v) =>
        v.lang.startsWith(langPrefix) &&
        nameHint.some((hint) => v.name.includes(hint))
    );
    const utter = new SpeechSynthesisUtterance(story);
    if (voice) utter.voice = voice;
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">親子說故事</h1>

      {/* 故事情節 */}
      <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded mb-4">
        {story}
      </pre>

      {/* 三種語言的朗讀按鈕 */}
      <div className="flex space-x-2">
        <button
          className="flex-1 bg-blue-500 text-white py-2 rounded"
          onClick={() =>
            handleSpeak("zh", ["Mei", "Ting", "Yun", "Liang"])
          }
        >
          國語朗讀
        </button>
        <button
          className="flex-1 bg-green-500 text-white py-2 rounded"
          onClick={() =>
            handleSpeak("zh", ["Heami", "Sin-Ji", "Sin-ji"]) // 常見粵語女聲關鍵字
          }
        >
          粵語朗讀
        </button>
        <button
          className="flex-1 bg-purple-500 text-white py-2 rounded"
          onClick={() =>
            handleSpeak("en", ["Female", "Samantha", "Victoria"])
          }
        >
          English Read
        </button>
      </div>
    </main>
  );
}
