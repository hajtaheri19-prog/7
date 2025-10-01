import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

type PriceEntry = { price: string; change: string | null };

export async function GET() {
  try {
    const url = "https://www.tgju.org/";
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
    const result: Record<string, PriceEntry> = {};

    const mapIdToKey: Record<string, string> = {
      "l-ons": "GoldOunce",
      "l-mesghal": "MesghalGold",
      "l-geram18": "Gold18K",
      "l-sekee": "EmamiCoin",
      "l-price_dollar_rl": "Dollar",
      // Tether could appear under different ids; we will also try matching by title later
      "l-crypto-tether": "USDT",
    };

    $(".info-bar li").each((_, el) => {
      const id = $(el).attr("id") || "";
      const price = $(el).find(".info-price").first().text().trim();
      const change = $(el).find(".info-change").first().text().trim() || null;
      const title = $(el).find("h3").first().text().trim();

      let key = mapIdToKey[id];
      if (!key) {
        if (/تتر/i.test(title) || /tether/i.test(title) || /usdt/i.test(title)) key = "USDT";
      }
      if (!key) return;

      result[key] = { price, change };
    });

    return NextResponse.json({ success: true, source: url, data: result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}


