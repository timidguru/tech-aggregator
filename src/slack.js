const axios = require('axios');
const config = require('../config.json');

async function sendToSlack(articles) {
  if (articles.length === 0) {
    console.log('📭 No articles to send to Slack');
    return;
  }
  
  try {
    // 헤더 메시지
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const headerMessage = `📰 *어제의 테크 뉴스* (${yesterday.toLocaleDateString('ko-KR')})`;
    
    await axios.post(config.slack.webhookUrl, {
      text: headerMessage,
      mrkdwn: true
    });
    
    // 소스별로 그룹화
    const groupedArticles = groupArticlesBySource(articles);
    
    for (const [source, sourceArticles] of Object.entries(groupedArticles)) {
      const blocks = createSlackBlocks(source, sourceArticles);
      
      await axios.post(config.slack.webhookUrl, {
        blocks: blocks,
        text: `${source} 뉴스`
      });
    }
    
    console.log(`📤 Sent ${articles.length} articles to Slack`);
    
  } catch (error) {
    console.error('Slack sending error:', error.message);
  }
}

function groupArticlesBySource(articles) {
  const grouped = {};
  
  articles.forEach(article => {
    if (!grouped[article.source]) {
      grouped[article.source] = [];
    }
    grouped[article.source].push(article);
  });
  
  return grouped;
}

function createSlackBlocks(source, articles) {
  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `📡 ${source} (${articles.length}개)`
      }
    },
    {
      type: 'divider'
    }
  ];
  
  articles.forEach(article => {
    const description = article.description ? article.description.substring(0, 200) + '...' : '';
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*<${article.link}|${article.title}>*\n${description}`
      }
    });
  });
  
  blocks.push({
    type: 'divider'
  });
  
  return blocks;
}

module.exports = {
  sendToSlack
};