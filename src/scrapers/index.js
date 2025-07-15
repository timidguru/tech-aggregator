const config = require('../../config.json');
const { scrapeRSS } = require('./rss-scraper');
const { scrapeWeb } = require('./web-scraper');

async function collectAllArticles() {
  const allArticles = [];
  
  for (const source of config.sources) {
    try {
      console.log(`📡 Scraping ${source.name}...`);
      
      let articles = [];
      if (source.type === 'rss') {
        articles = await scrapeRSS(source);
      } else if (source.type === 'web') {
        articles = await scrapeWeb(source);
      }
      
      console.log(`✅ Found ${articles.length} articles from ${source.name}`);
      allArticles.push(...articles);
      
    } catch (error) {
      console.error(`❌ Error scraping ${source.name}:`, error.message);
    }
  }
  
  return allArticles;
}

module.exports = {
  collectAllArticles
};