import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = 'https://www.tgju.org/';
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fa-IR,fa;q=0.9,en-US;q=0.7,en;q=0.6'
      },
      timeout: 15000,
      validateStatus: (s) => s >= 200 && s < 400
    });

    const $ = cheerio.load(html);
    const data: Array<{ id?: string; title: string; price: string; change: string }> = [];

    $('ul.info-bar li').each((_, el) => {
      const id = $(el).attr('id') || undefined;
      const title = $(el).find('h3').first().text().trim();
      const price = $(el).find('.info-price').first().text().trim();
      const change = $(el).find('.info-change').first().text().trim();
      if (!title || !price) return;
      data.push({ id, title, price, change });
    });

    return NextResponse.json({
      source: 'tgju.org',
      updated: new Date().toISOString(),
      count: data.length,
      data
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch TGJU data', details: error?.message }, { status: 500 });
  }
}


