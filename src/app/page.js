"use client";

import { useEffect, useState } from "react";

export default function Home() {
  // …（前面 state、useEffect 與邏輯維持不變）…

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">

      {/* Hero 區塊 */}
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
              /* 滾動到表單區 */
              document
                .getElementById("story-form")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            生成故事
          </button>
        </div>
      </section>

      {/* 主要內容區 */}
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

        {/* 表單：名字 + 主題 */}
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
              {story}
            </div>
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold shadow"
              onClick={handleSpeak}
            >
              朗讀故事
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
