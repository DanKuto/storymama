"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [items, setItems] = useState("");
  const [story, setStory] = useState("");
  const [voices, setVoices] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const synthRef = useRef(null);

  // 载入浏览器语音列表
  useEffect(() => {
    const synth = window.speechSynthesis;
    synthRef.current = synth;
    const update = () => setVoices(synth.getVoices());
    synth.onvoiceschanged = update;
    update();
  }, []);

  // 生成本地随机故事
  const generateStory = () => {
    if (!name.trim()) return alert("请输入小朋友名字");
    const favs = items
      .split(/[\s,，]+/)
      .filter((s) => s)
      .slice(0, 5); // 最多 5 个喜好
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const intros = [
      `从前有个勇敢的孩子，名字叫 ${name}…`,
      `${name} 最喜欢的事，就是和好朋友一起冒险…`,
      `在一个阳光明媚的早晨，${name} 发现了一本神奇的地图…`,
    ];
    const middles = favs.length
      ? favs.map((item) => `途中，${name} 还遇见了一只巨大的${item}…`)
      : [];
    middles.push(
      `接着，${name} 来到了一个神秘的森林，听到了奇怪的声音…`,
      `突然，一道闪电划过天空，带来了一阵微风…`
    );
    const outros = [
      `最后，${name} 满载而归，把冒险故事告诉了家人。`,
      `从此以后，${name} 的勇气和想象力更加丰富。`,
      `这就是 ${name} 和${favs.join("、")} 的奇妙冒险，晚安。`,
    ];

    const text =
      pick(intros) +
      "\n\n" +
      middles
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .join("\n\n") +
      "\n\n" +
      pick(outros);

    setStory(text);
  };

  // 流畅朗读
  const speak = () => {
    if (!story) return alert("请先生成故事");
    const synth = synthRef.current;
    const list = voices.length ? voices : synth.getVoices();
    const voice =
      list.find((v) => v.lang.startsWith("zh") && /female|Mei|Ting/i.test(v.name)) ||
      list.find((v) => v.lang.startsWith("zh")) ||
      list[0];

    const segments = story
      .split(/([。！？\?])/)
      .map((s) => s.trim())
      .filter((s) => s);

    const readSeg = (i) => {
      if (i >= segments.length) return;
      const u = new SpeechSynthesisUtterance(segments[i]);
      u.voice = voice;
      u.rate = 0.9;
      u.pitch = 1.0;
      u.onend = () => {
        if (!synth.paused) readSeg(i + 1);
      };
      synth.speak(u);
    };

    synth.cancel();
    setIsPaused(false);
    readSeg(0);
  };

  // 暂停/继续
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
    <main className="min-h-screen bg-gradient-to-b from-purple-100 to-white p-6">
      <h1 className="text-4xl text-center font-bold mb-8">美好故事多</h1>
      <div className="max-w-lg mx-auto space-y-4">
        <input
          className="w-full p-3 border rounded-lg"
          placeholder="小朋友名字"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full p-3 border rounded-lg"
          placeholder="喜歡的事物 (以逗號或空格分隔)"
          value={items}
          onChange={(e) => setItems(e.target.value)}
        />
        <button
          className="w-full bg-purple-600 text-white py-3 rounded-lg"
          onClick={generateStory}
        >
          生成故事
        </button>

        {story && (
          <>
            <div className="bg-white p-4 rounded-lg shadow whitespace-pre-wrap">
              {story}
            </div>
            <div className="flex gap-4">
              <button
                className="flex-1 bg-green-500 text-white py-2 rounded-lg"
                onClick={speak}
              >
                播放
              </button>
              <button
                className="flex-1 bg-yellow-500 text-white py-2 rounded-lg"
                onClick={togglePause}
              >
                {isPaused ? "继续" : "暂停"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
