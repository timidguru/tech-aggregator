const stringSimilarity = require('string-similarity');

async function removeDuplicates(articles) {
  if (articles.length === 0) return [];
  
  const uniqueArticles = [];
  const SIMILARITY_THRESHOLD = 0.7; // 70% 유사도 이상이면 중복으로 판단
  
  for (const article of articles) {
    let isDuplicate = false;
    
    for (const uniqueArticle of uniqueArticles) {
      // 제목 유사도 검사
      const titleSimilarity = stringSimilarity.compareTwoStrings(
        article.title.toLowerCase(),
        uniqueArticle.title.toLowerCase()
      );
      
      // 내용 유사도 검사 (내용이 있는 경우)
      let contentSimilarity = 0;
      if (article.content && uniqueArticle.content) {
        contentSimilarity = stringSimilarity.compareTwoStrings(
          article.content.toLowerCase(),
          uniqueArticle.content.toLowerCase()
        );
      }
      
      // 제목이나 내용이 유사하면 중복으로 판단
      if (titleSimilarity > SIMILARITY_THRESHOLD || contentSimilarity > SIMILARITY_THRESHOLD) {
        isDuplicate = true;
        console.log(`🔄 Duplicate found: "${article.title}" (${Math.round(titleSimilarity * 100)}% similar)`);
        break;
      }
    }
    
    if (!isDuplicate) {
      uniqueArticles.push(article);
    }
  }
  
  return uniqueArticles;
}

module.exports = {
  removeDuplicates
};