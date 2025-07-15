# Tech Aggregator

매일 한국 테크 뉴스를 수집하고 중복을 제거하여 Slack으로 전송하는 서비스입니다.

## 설정

1. **저장소 클론**
```bash
git clone https://github.com/YOUR_USERNAME/tech-aggregator.git
cd tech-aggregator
```

2. **패키지 설치**
```bash
npm install
```

3. **설정 파일 생성**
```bash
cp config.example.json config.json
```

4. **Slack Webhook URL 설정**
   - Slack에서 Incoming Webhooks 앱 설치
   - Webhook URL을 복사하여 `config.json`에 설정
```json
{
  "slack": {
    "webhookUrl": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
  }
}
```

5. **실행**
```bash
npm start
```

## 수집 소스
- GeekNews (news.hada.io) - RSS
- 요즘IT (yozm.wishket.com) - RSS
- 카카오 기술 블로그 (tech.kakao.com) - 웹 스크래핑
- 네이버 D2 (d2.naver.com) - RSS
- Velog (velog.io) - RSS

## 스케줄
매일 오전 9시에 자동 실행됩니다.

## 테스트 실행
즉시 테스트해보려면 `src/index.js`의 마지막 줄 주석을 해제하세요:
```javascript
// 테스트용 즉시 실행
dailyAggregation();
```

## 프로젝트 구조
```
tech-aggregator/
├── src/
│   ├── scrapers/
│   │   ├── index.js          # 스크래퍼 통합 모듈
│   │   ├── rss-scraper.js    # RSS 피드 스크래핑
│   │   └── web-scraper.js    # 웹 스크래핑
│   ├── deduplicator.js       # 중복 제거 로직
│   ├── slack.js              # Slack 메시지 전송
│   └── index.js              # 메인 실행 파일
├── config.example.json       # 설정 파일 예시
└── README.md
```

## 기능
- 🔄 **자동 수집**: 매일 정해진 시간에 자동 실행
- 🎯 **중복 제거**: 유사도 기반 중복 아티클 제거
- 📱 **Slack 연동**: 깔끔한 포맷으로 Slack 전송
- 📊 **소스별 분류**: 각 소스별로 그룹화하여 표시

## 라이센스
MIT License