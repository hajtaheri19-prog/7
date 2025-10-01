// CommonJS CLI to fetch TGJU prices with golden-styled output
const axios = require('axios');
const cheerio = require('cheerio');

const COLOR = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  yellow: '\x1b[33m',
  brightYellow: '\x1b[93m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function padRight(str, len) {
  const s = String(str || '');
  return s + ' '.repeat(Math.max(0, len - s.length));
}

async function fetchTGJU() {
  try {
    const { data } = await axios.get('https://www.tgju.org/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (VIP Fetcher)',
        'Accept-Language': 'fa-IR,fa;q=0.9,en-US;q=0.6'
      },
      timeout: 15000
    });

    const $ = cheerio.load(data);
    const rows = [];
    $('ul.info-bar li').each((_, el) => {
      const title = $(el).find('h3').text().trim();
      const price = $(el).find('.info-price').text().trim();
      const change = $(el).find('.info-change').text().trim();
      const id = $(el).attr('id');
      const status = $(el).hasClass('high') ? 'up' : $(el).hasClass('low') ? 'down' : 'stable';
      rows.push({ id, title, price, change, status });
    });

    printGoldenBoard(rows);
  } catch (err) {
    console.error(`${COLOR.red}❌ خطا در دریافت اطلاعات: ${err.message}${COLOR.reset}`);
    process.exitCode = 1;
  }
}

function printGoldenBoard(rows) {
  const title = `${COLOR.brightYellow}━ تبدیلا | قیمت‌های لحظه‌ای از TGJU ━${COLOR.reset}`;
  console.log('\n' + title);
  console.log(`${COLOR.dim}منبع: https://www.tgju.org/ | ${new Date().toLocaleString('fa-IR')}${COLOR.reset}`);
  console.log(`${COLOR.yellow}${'━'.repeat(64)}${COLOR.reset}`);

  const header = `${padRight('عنوان', 24)}  ${padRight('قیمت', 18)}  تغییر`;
  console.log(`${COLOR.brightYellow}${header}${COLOR.reset}`);
  console.log(`${COLOR.yellow}${'─'.repeat(64)}${COLOR.reset}`);

  rows.forEach(r => {
    const statusColor = r.status === 'up' ? COLOR.green : r.status === 'down' ? COLOR.red : COLOR.cyan;
    const line = `${padRight(r.title, 24)}  ${padRight(r.price, 18)}  ${statusColor}${r.change || '-'}${COLOR.reset}`;
    console.log(line);
  });

  console.log(`${COLOR.yellow}${'━'.repeat(64)}${COLOR.reset}\n`);
}

fetchTGJU();


