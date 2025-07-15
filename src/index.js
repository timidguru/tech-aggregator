const cron = require('node-cron');
const config = require('../config.json');
const { collectAllArticles } = require('./scrapers');
const { removeDuplicates } = require('./deduplicator');
const { sendToSlack } = require('./slack');

// Config validation
function validateConfig() {
  if (!config.slack || !config.slack.webhookUrl) {
    throw new Error('Slack webhook URL is required in config.json');
  }
  
  if (!config.schedule) {
    throw new Error('Schedule configuration is required in config.json');
  }
  
  if (!config.schedule.timezone) {
    throw new Error('Schedule timezone is required in config.json');
  }
  
  if (!config.sources || !Array.isArray(config.sources) || config.sources.length === 0) {
    throw new Error('At least one source must be configured in config.json');
  }
  
  for (const source of config.sources) {
    if (!source.name || !source.url || !source.type) {
      throw new Error(`Invalid source configuration: ${JSON.stringify(source)}`);
    }
    
    if (!['rss', 'web'].includes(source.type)) {
      throw new Error(`Invalid source type: ${source.type}. Must be 'rss' or 'web'`);
    }
  }
}

// Validate config at startup
try {
  validateConfig();
  console.log('✅ Configuration validated successfully');
} catch (error) {
  console.error('❌ Configuration validation failed:', error.message);
  process.exit(1);
}

async function dailyAggregation() {
  try {
    console.log('🚀 Starting daily tech news aggregation...');
    
    // 1. 모든 소스에서 기사 수집
    const articles = await collectAllArticles();
    console.log(`📄 Collected ${articles.length} articles`);
    
    // 2. 중복 제거
    const uniqueArticles = await removeDuplicates(articles);
    console.log(`✨ ${uniqueArticles.length} unique articles after deduplication`);
    
    // 3. Slack으로 전송
    await sendToSlack(uniqueArticles);
    console.log('✅ Daily aggregation completed');
    
  } catch (error) {
    console.error('❌ Error during aggregation:', error);
  }
}

// 매일 오전 9시에 실행
cron.schedule('0 9 * * *', dailyAggregation, {
  timezone: config.schedule.timezone
});

console.log(`⏰ Scheduler set for ${config.schedule.time} KST`);
console.log('🎯 Tech aggregator is running...');

// 테스트용 즉시 실행
// dailyAggregation();
