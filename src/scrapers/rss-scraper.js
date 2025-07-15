const Parser = require('rss-parser');
const parser = new Parser();

async function scrapeRSS(source) {
  try {
    const feed = await parser.parseURL(source.url);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const articles = feed.items
      .filter(item => {
        if (!item.pubDate) return false;
        const itemDate = new Date(item.pubDate);
        return itemDate >= twoDaysAgo;
      })
      .map(item => ({
        title: item.title || '',
        link: item.link || '',
        description: (item.contentSnippet || item.description || '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        source: source.name,
        content: (item.content || item.contentSnippet || '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
      }));
    
    return articles;
  } catch (error) {
    console.error(`RSS scraping error for ${source.name}:`, error.message);
    return [];
  }
}

module.exports = {
  scrapeRSS
};