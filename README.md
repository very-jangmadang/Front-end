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

### 6. 강화된 로그아웃 시스템 (2024년 업데이트)

#### 문제 상황
- 두 도메인(`jangmadang.site`, `jmd-fe.vercel.app`)에서 쿠키가 완전히 삭제되지 않음
- 로그아웃 후 새로고침 시 자동으로 다시 로그인되는 문제

#### 해결책
1. **강력한 서버 로그아웃**: 백엔드 세션을 완전히 삭제
2. **초강력 쿠키 삭제**: 모든 가능한 도메인과 경로에서 쿠키 삭제
3. **iframe을 사용한 크로스도메인 쿠키 삭제**: 다른 도메인의 쿠키도 삭제
4. **완전한 브라우저 스토리지 정리**: localStorage, sessionStorage, IndexedDB, 캐시, 서비스워커 모두 정리
5. **자동 로그인 방지**: 로그아웃 후 10초간 로그인 체크 방지

#### 새로운 유틸리티 함수들
```typescript
// 강력한 서버 로그아웃 (백엔드 세션 삭제)
await forceServerLogout();

// 초강력 쿠키 삭제
await ultraClearAllCookies();

// iframe을 사용한 크로스도메인 쿠키 삭제
await clearCookiesViaIframe();

// 완전한 브라우저 스토리지 정리
await clearAllBrowserStorage();

// 완전한 로그아웃 (모든 정리 작업 포함)
await performCompleteLogout();

// 궁극의 다중 도메인 로그아웃 (최종 버전)
await performUltimateLogout();
```

#### 디버깅 도구
- `/debug` 페이지에서 쿠키 상태 확인 및 수동 정리 가능
- 콘솔에서 상세한 로그 확인 가능
- 각 단계별 진행 상황 모니터링

### 7. 크로스도메인 쿠키 문제 해결 가이드

#### 문제 상황
- `jangmadang.site`에서는 정상적으로 쿠키가 설정됨
- `jmd-fe.vercel.app`에서는 쿠키가 설정되지 않음
- 크로스도메인 요청에서 쿠키 전송이 안됨

#### 해결 방법

##### 1. 백엔드 CORS 설정 확인
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://jmd-fe.vercel.app',
    'https://www.jmd-fe.vercel.app',
    'https://jangmadang.site',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'X-Client-Domain',
    'X-Client-Origin'
  ]
}));
```

##### 2. 쿠키 설정 확인
```javascript
// 로그인 성공 시 쿠키 설정
res.cookie('access', accessToken, {
  httpOnly: false, // 클라이언트에서 접근 가능
  secure: true, // HTTPS에서만
  sameSite: 'none', // 크로스도메인 허용
  domain: '.jangmadang.site', // 서브도메인 포함
  maxAge: 24 * 60 * 60 * 1000 // 24시간
});

res.cookie('refresh', refreshToken, {
  httpOnly: false,
  secure: true,
  sameSite: 'none',
  domain: '.jangmadang.site',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
});
```

##### 3. 프론트엔드 axios 설정
```javascript
const axiosInstance = axios.create({
  baseURL: 'https://jangmadang.site',
  withCredentials: true, // 쿠키 전송 허용
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});
```

##### 4. 디버깅 방법
1. 브라우저 개발자 도구 열기 (F12)
2. Application 탭 → Cookies 확인
3. Network 탭에서 요청/응답 헤더 확인
4. 콘솔에서 CORS 에러 메시지 확인

##### 5. 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수 설정:
```bash
VITE_API_BASE_URL=https://jangmadang.site
```

#### 문제 해결 체크리스트
- [ ] 백엔드 CORS 설정에서 `jmd-fe.vercel.app` 도메인 허용
- [ ] 쿠키 설정에서 `sameSite: 'none'` 설정
- [ ] 쿠키 설정에서 `secure: true` 설정 (HTTPS 환경)
- [ ] 프론트엔드에서 `withCredentials: true` 설정
- [ ] 환경 변수 `VITE_API_BASE_URL` 올바르게 설정
- [ ] Vercel 재배포 완료

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

### 8. 로그아웃 문제 해결 (2024년 업데이트)

#### 8.1 백엔드 세션 무효화 문제
**핵심 문제**: 백엔드의 `/api/permit/logout` 엔드포인트가 `HttpSession`을 무효화하지 않아서 `jmd-fe.vercel.app`에서 로그아웃 후 새로고침 시 다시 로그인 상태가 되는 문제

**해결 방법**: 백엔드 `UserController.java` 수정 필요

```java
@PostMapping("api/permit/logout")
public ApiResponse<?> logout(HttpServletRequest request, HttpServletResponse response) {
    // 1. 세션 무효화 (가장 중요!)
    HttpSession session = request.getSession(false);
    if (session != null) {
        session.invalidate(); // 세션 완전 삭제
        log.info("세션 무효화 완료: {}", session.getId());
    }
    
    // 2. JWT 쿠키 삭제
    Cookie accessCookie = jwtUtil.createCookie("access", null, 0);
    Cookie refreshCookie = jwtUtil.createCookie("refresh", null, 0);
    response.addCookie(accessCookie);
    response.addCookie(refreshCookie);
    
    // 3. 세션 쿠키 삭제 (JSESSIONID)
    Cookie sessionCookie = new Cookie("JSESSIONID", null);
    sessionCookie.setMaxAge(0);
    sessionCookie.setPath("/");
    sessionCookie.setHttpOnly(true);
    sessionCookie.setSecure(true);
    
    // 여러 도메인에서 세션 쿠키 삭제
    sessionCookie.setDomain(".jangmadang.site");
    response.addCookie(sessionCookie);
    sessionCookie.setDomain(".vercel.app");
    response.addCookie(sessionCookie);
    sessionCookie.setDomain(request.getServerName());
    response.addCookie(sessionCookie);
    
    return ApiResponse.of(SuccessStatus.USER_LOGOUT_SUCCESS, null);
}
```

#### 8.2 프론트엔드 로그아웃 개선
- 백엔드 세션 무효화 확인을 위한 로깅 추가
- 로그아웃 후 세션 상태 자동 확인
- 도메인별 로그아웃 상태 추적

#### 8.3 테스트 방법
1. 백엔드 코드 수정 후 재배포
2. `jangmadang.site`에서 로그인
3. `jmd-fe.vercel.app`에서 로그아웃
4. 새로고침 후 로그인 상태 확인
5. `jangmadang.site`에서도 로그아웃 상태인지 확인

#### 8.4 로그아웃 상태 수동 초기화
로그아웃 후 로그인이 안 되는 경우, 브라우저 개발자 도구 콘솔에서 다음 명령어를 실행하세요:

```javascript
// 방법 1: 페이지 새로고침
window.location.reload();

// 방법 2: 쿠키 수동 삭제
document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
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
