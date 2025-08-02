# JMD-FE

## 도메인 변경 후 설정 가이드

### 1. Vercel 환경 변수 설정 (중요!)
Vercel 대시보드에서 다음 환경 변수를 반드시 설정해야 합니다:

1. **Vercel 대시보드 접속**: https://vercel.com/dashboard
2. **프로젝트 선택**: `jmd-fe` 프로젝트
3. **Settings → Environment Variables** 클릭
4. **다음 변수들 추가**:

```bash
# 필수 환경 변수
VITE_API_BASE_URL=https://api.jangmadang.site
VITE_API_ACCESS_TOKEN=your_access_token_here
```

5. **Environment 선택**: Production, Preview, Development 모두 체크
6. **Save** 클릭
7. **Redeploy** 실행

**중요**: 환경 변수 설정 후 반드시 재배포해야 합니다!

#### 환경 변수 확인 방법
브라우저 콘솔에서 다음을 확인하세요:
```javascript
console.log('API 설정 정보:', {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  hasAccessToken: !!import.meta.env.VITE_API_ACCESS_TOKEN
});
```

`hasAccessToken: false`가 나오면 환경 변수가 설정되지 않은 것입니다.

#### 문제 해결
- 환경 변수 설정 후 **Redeploy** 필수
- Production 환경에서만 설정하면 Preview/Development에서 작동하지 않음
- 모든 환경(Production, Preview, Development)에 설정 필요

### 2. 백엔드 CORS 설정 (중요!)
백엔드에서 `jmd-fe.vercel.app` 도메인을 허용하도록 CORS 설정을 업데이트해야 합니다.

#### Express.js CORS 설정 예시
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://jmd-fe.vercel.app',
    'https://www.jmd-fe.vercel.app',
    'http://localhost:5173' // 개발 환경
  ],
  credentials: true, // 쿠키 전송 허용
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

#### 세션 설정 (중요!)
```javascript
const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true, // HTTPS에서만
    sameSite: 'none', // 크로스 도메인 허용
    domain: '.jangmadang.site', // 서브도메인 포함
    maxAge: 24 * 60 * 60 * 1000 // 24시간
  }
}));
```

### 3. 카카오 로그인 리다이렉트 URL 변경
카카오 개발자 콘솔에서 리다이렉트 URL을 `https://jmd-fe.vercel.app/kakao`로 변경해야 합니다.

### 4. 백엔드 API 변경사항 (세션 방식 유지)

#### 카카오 로그인 리다이렉트 변경
```javascript
// 기존
res.redirect('https://jangmadang.site/kakao');

// 변경
res.redirect('https://jmd-fe.vercel.app/kakao');
```

#### 세션 방식 유지
- 기존 세션 기반 인증 방식 그대로 유지
- 쿠키를 통한 세션 관리 계속 사용
- 크로스 도메인 쿠키 설정 확인 필요

### 5. 프론트엔드 변경사항
- 쿠키 도메인을 `window.location.hostname`으로 동적 설정
- 세션 기반 인증 방식 유지

### 6. 환경 변수 확인 방법
브라우저 콘솔에서 다음을 확인하세요:
```javascript
console.log('API 설정 정보:', {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  hasAccessToken: !!import.meta.env.VITE_API_ACCESS_TOKEN
});
```

`hasAccessToken: false`가 나오면 환경 변수가 설정되지 않은 것입니다.

### 7. 크로스 도메인 쿠키 설정
백엔드에서 다음 설정을 확인하세요:
```javascript
// 쿠키 설정
res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  domain: '.jangmadang.site' // 또는 적절한 도메인
});
```

### 8. 로그아웃 문제 해결
로그아웃 후 다시 로그인이 되는 문제가 발생하는 경우:

#### 백엔드 로그아웃 API 확인
```javascript
// POST /api/permit/logout
app.post('/api/permit/logout', (req, res) => {
  // 세션 완전 삭제
  req.session.destroy((err) => {
    if (err) {
      console.error('세션 삭제 실패:', err);
      return res.status(500).json({
        isSuccess: false,
        code: 'SERVER_ERROR',
        message: '로그아웃 처리 중 오류가 발생했습니다.'
      });
    }
    
    // 쿠키도 삭제
    res.clearCookie('connect.sid'); // 세션 쿠키
    res.clearCookie('accessToken'); // 액세스 토큰 쿠키
    
    res.json({
      isSuccess: true,
      code: 'USER_2004',
      message: '성공적으로 로그아웃하였습니다.',
      result: {}
    });
  });
});
```

#### 프론트엔드 로그아웃 처리
- 로그아웃 후 `window.location.reload()`로 강제 새로고침
- 서버 세션을 완전히 삭제하기 위함

### 6. 회원가입 문제 디버깅
회원가입이 안 되는 경우 브라우저 개발자 도구 콘솔에서 다음을 확인하세요:

1. **환경 변수 확인**
   ```
   API 설정 정보: { baseURL: "...", hasAccessToken: true/false, currentDomain: "..." }
   ```

2. **API 요청 확인**
   ```
   API 요청: { method: "POST", url: "/api/permit/nickname", ... }
   ```

3. **에러 메시지 확인**
   - 401: 인증 실패 (토큰 문제)
   - 403: 권한 없음 (CORS 문제)
   - 500: 서버 오류

### 7. 쿠키 도메인 설정
- 쿠키 도메인이 동적으로 설정되도록 수정 완료
- `window.location.hostname`을 사용하여 현재 도메인에 맞게 자동 설정

### 8. 로그아웃 문제 해결
- 클라이언트 측 쿠키 삭제 로직 추가
- 로그아웃 후 자동 로그인 방지
- 간단한 로그아웃 상태 관리

#### 7.1 로그아웃 상태 수동 초기화
로그아웃 후 로그인이 안 되는 경우, 브라우저 개발자 도구 콘솔에서 다음 명령어를 실행하세요:

```javascript
// 방법 1: 페이지 새로고침
window.location.reload();

// 방법 2: AuthContext 함수 사용 (컴포넌트 내에서)
// const { clearLogoutState } = useAuth();
// clearLogoutState();
```

## SVG 파일 최적화 권장사항

큰 SVG 파일들(`promotion1.svg`, `promotion2.svg`, `promotion3.svg`)이 Babel 경고를 발생시킬 수 있습니다. 
다음 방법으로 최적화를 권장합니다:

### 1. SVG 파일 압축
- [SVGO](https://github.com/svg/svgo) 도구를 사용하여 SVG 파일 압축
- 불필요한 메타데이터, 주석, 공백 제거
- 목표: 각 파일을 500KB 이하로 압축

### 2. 이미지 포맷 변경 고려
- 큰 SVG 파일의 경우 PNG/JPG로 변환 고려
- WebP 포맷 사용으로 더 나은 압축률 달성

### 3. 현재 적용된 최적화
- Vite 설정에서 큰 SVG 파일들을 별도 청크로 분리
- 동적 import를 통한 지연 로딩
- Babel 설정 최적화

### 4. SVG 최적화 명령어 예시
```bash
# SVGO 설치
npm install -g svgo

# SVG 파일 압축
svgo src/assets/homePage/promotion1.svg -o src/assets/homePage/promotion1-optimized.svg
svgo src/assets/homePage/promotion2.svg -o src/assets/homePage/promotion2-optimized.svg
svgo src/assets/homePage/promotion3.svg -o src/assets/homePage/promotion3-optimized.svg
```
