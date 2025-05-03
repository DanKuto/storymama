// src/app/api/yt-generate/route.js
import { NextResponse } from "next/server";
import { getSubtitles } from "youtube-captions-scraper";

// 你測試可用的影片 ID，之後換成你選的親子故事影片
const VIDEO_IDS = ["6SGpCNF9cxQ"];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export async function GET() {
  const videoId = pick(VIDEO_IDS);

  let captions;
  try {
    captions = await getSubtitles({ videoID: videoId, lang: "zh-TW" });
  } catch {
    // 繁中沒字幕就改抓英文
    captions = await getSubtitles({ videoID: videoId, lang: "en" });
  }

  if (!captions?.length) {
    console.error("完全找不到字幕 for", videoId);
    return NextResponse.json({ error: "無法生成故事" }, { status: 500 });
  }

  // 隨機拼接大約 600 字
  let story = "";
  const segs = [...captions];
  while (story.length < 600 && segs.length) {
    const i = Math.floor(Math.random() * segs.length);
    story += segs[i].text + " ";
    segs.splice(i, 1);
  }
  story = story.trim();

  return NextResponse.json({ story });
}
