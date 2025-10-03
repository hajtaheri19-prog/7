// npm run tgju:fetch
// Requires: axios, cheerio (already in package.json)

import axios from 'axios';
import * as cheerio from 'cheerio';

async function fetchTGJUPrices() {
  try {
    const { data } = await axios.get('https://www.tgju.org/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (VIP Fetcher) TabdilaBot',
        'Accept-Language': 'fa-IR,fa;q=0.9,en-US;q=0.6'
      },
      timeout: 15000
    });
    const $ = cheerio.load(data);
    const prices = [];
    $('ul.info-bar li').each((i, el) => {
      const title = $(el).find('h3').text().trim();
      const price = $(el).find('.info-price').text().trim();
      const change = $(el).find('.info-change').text().trim();
      const id = $(el).attr('id');
      if (title && price) {
        prices.push({ id, title, price, change });
      }
    });
    return {
      source: 'tgju.org',
      updated: new Date().toISOString(),
      count: prices.length,
      data: prices
    };
  } catch (error) {
    return { error: 'Failed to fetch TGJU data', details: error?.message };
  }
}

fetchTGJUPrices().then((result) => {
  console.log(JSON.stringify(result, null, 2));
});


