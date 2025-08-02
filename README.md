# JMD-FE

## 도메인 변경 후 설정 가이드

### 1. Vercel 환경 변수 설정
- `VITE_API_BASE_URL`: `https://api.jangmadang.site`
- `VITE_API_ACCESS_TOKEN`: 백엔드에서 제공하는 액세스 토큰

### 2. 백엔드 CORS 설정
백엔드에서 `jmd-fe.vercel.app` 도메인을 허용하도록 CORS 설정을 업데이트해야 합니다.

### 3. 카카오 로그인 리다이렉트 URL 변경
카카오 개발자 콘솔에서 리다이렉트 URL을 `https://jmd-fe.vercel.app/kakao`로 변경해야 합니다.

### 4. 백엔드 API 변경사항

#### 카카오 로그인 리다이렉트 변경
```javascript
// 기존
res.redirect('https://jangmadang.site/kakao');

// 변경
res.redirect('https://jmd-fe.vercel.app/kakao?token=JWT_TOKEN&email=USER_EMAIL&isNewUser=true/false');
```

#### 새로운 API 추가
```javascript
// POST /api/permit/set-cookie
// 토큰을 받아서 쿠키로 설정 (200 응답)
app.post('/api/permit/set-cookie', (req, res) => {
  const { token } = req.body;
  // 토큰을 쿠키로 설정
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    domain: '.jangmadang.site'
  });
  res.json({ isSuccess: true, code: 'COMMON_200', message: '쿠키 설정 완료' });
});
```

#### 닉네임 설정 API 수정
```javascript
// 기존: 세션에서 이메일 추출
const email = req.session.oauthemail;

// 변경: request body에서 이메일 받기
const { nickname, email } = req.body;
```

### 5. 프론트엔드 변경사항
- `KakaoRedirect.tsx`: URL 파라미터에서 token, email 추출 후 `/api/permit/set-cookie` 호출
- `SignupModal.tsx`: 이메일을 request body에 포함하여 전송
- 쿠키 도메인을 `window.location.hostname`으로 동적 설정

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
