// src/app/api/yt-generate/route.js
import { NextResponse } from "next/server";
import { getSubtitles } from "youtube-captions-scraper";

// 若未輸入連結，隨機選用這些影片 ID
const FALLBACK_IDS = ["Ks-_Mh1QhMc", "lTTvZqVvA0I"];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  let videoId = searchParams.get("videoId");

  // 若使用者貼了 YouTube 連結，解析 videoId
  if (videoId) {
    const m = videoId.match(/(?:v=|youtu\.be\/|\/embed\/)([A-Za-z0-9_-]{11})/);
    videoId = m ? m[1] : videoId;
  } else {
    videoId = pick(FALLBACK_IDS);
  }

  let captions;
  try {
    // 先嘗試繁中字幕
    captions = await getSubtitles({ videoID: videoId, lang: "zh-TW" });
  } catch {
    // 繁中失敗就抓英文
    captions = await getSubtitles({ videoID: videoId, lang: "en" });
  }

  if (!captions.length) {
    return NextResponse.json({ error: "無法取得字幕" }, { status: 500 });
  }

  // 隨機拼接約 600 字
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
