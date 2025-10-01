import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = "https://www.tgju.org/crypto";
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:117.0) Gecko/20100101 Firefox/117.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "fa-IR,fa;q=0.9,en-US;q=0.7,en;q=0.6",
      },
      timeout: 15000,
      validateStatus: (s) => s >= 200 && s < 400,
    });

    const $ = cheerio.load(html);
    const rows = $("tbody tr[data-market-nameslug]");
    const rates: Array<{
      name_fa: string;
      name_en: string;
      symbol: string;
      icon_url: string | null;
      price_usdt: string;
      price_irr: string;
      change_usdt: string;
      change_percent: string;
      volume_24h: string;
      market_cap: string;
      update_time: string;
    }> = [];

    rows.slice(0, 10).each((_, el) => {
      const name_fa = $(el)
        .find("td:nth-of-type(2) .tgcss-font-semibold")
        .first()
        .text()
        .trim();
      const name_en = $(el).find(".original-title-en").text().trim();
      const symbol = $(el).find("td:nth-of-type(3)").text().trim();
      let icon_url: string | null = null;
      const img = $(el).find("img").first();
      const rawSrc = img.attr("data-src") || img.attr("src") || '';
      if (rawSrc) {
        if (rawSrc.startsWith("http")) icon_url = rawSrc;
        else if (rawSrc.startsWith("//")) icon_url = `https:${rawSrc}`;
        else if (rawSrc.startsWith("/")) icon_url = `https://www.tgju.org${rawSrc}`;
        else icon_url = `https://www.tgju.org/${rawSrc}`;
      }
      const price_usdt = $(el).find("[data-market-name='p']").text().trim();
      // Some pages expose IRR in different data attributes; try multiple fallbacks
      const price_irr =
        $(el).find("[data-market-p]").text().trim() ||
        $(el).find("[data-market-name='pr']").text().trim() ||
        $(el).find("td[data-label*='ریال']").text().trim();
      const change_usdt = $(el).find("[data-market-name='dv']").text().trim();
      const change_percent = $(el).find("[data-market-name='dp']").text().trim();
      const volume_24h = $(el).find("[data-label*='معاملات 24']").text().trim();
      const market_cap = $(el).find("[data-label*='ارزش بازار']").text().trim();
      const update_time = $(el).find("td[data-label='زمان بروزرسانی']").text().trim();

      rates.push({
        name_fa,
        name_en,
        symbol,
        icon_url,
        price_usdt,
        price_irr,
        change_usdt,
        change_percent,
        volume_24h,
        market_cap,
        update_time,
      });
    });

    return NextResponse.json({
      success: true,
      source: url,
      limit: 10,
      timestamp: new Date().toISOString(),
      data: rates,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}


