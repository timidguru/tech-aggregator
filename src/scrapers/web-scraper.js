const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeWeb(source) {
  try {
    if (source.name === '카카오 기술 블로그') {
      return await scrapeKakaoTech(source);
    } else {
      console.log(`No scraper implemented for ${source.name}`);
      return [];
    }
  } catch (error) {
    console.error(`Web scraping error for ${source.name}:`, error.message);
    return [];
  }
}

async function scrapeKakaoTech(source) {
  try {
    const response = await axios.get(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const articles = [];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    $('article, .post-item').each((index, element) => {
      const $element = $(element);
      const title = $element.find('h2 a, h3 a, .title a').text().trim();
      const link = $element.find('h2 a, h3 a, .title a').attr('href');
      const description = $element.find('.excerpt, .summary, p').first().text().trim();
      
      if (title && link) {
        articles.push({
          title,
          link: link.startsWith('http') ? link : `https://tech.kakao.com${link}`,
          description: description.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
          pubDate: new Date(),
          source: source.name,
          content: description.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
        });
      }
    });
    
    return articles;
  } catch (error) {
    console.error('KakaoTech scraping error:', error.message);
    return [];
  }
}


module.exports = {
  scrapeWeb
};