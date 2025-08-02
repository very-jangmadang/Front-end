# JMD-FE

## 도메인 변경 후 설정 가이드

도메인이 `jangmadang.site`에서 `jmd-fe.vercel.app`으로 변경된 후 필요한 설정:

### 1. Vercel 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수를 설정해야 합니다:

```bash
VITE_API_BASE_URL=https://api.jangmadang.site  # 또는 새로운 API 서버 주소
VITE_API_ACCESS_TOKEN=your_access_token
```

**중요**: 환경 변수 설정 후 Vercel 프로젝트를 다시 배포해야 합니다.

### 2. 백엔드 CORS 설정 확인
백엔드에서 다음 도메인을 허용하도록 CORS 설정을 확인하세요:

```javascript
// 백엔드 CORS 설정 예시
const allowedOrigins = [
  'https://jmd-fe.vercel.app',
  'https://www.jmd-fe.vercel.app',
  'http://localhost:5173' // 개발 환경
];
```

### 3. 카카오 로그인 리다이렉트 URL 변경
카카오 개발자 콘솔에서 리다이렉트 URL을 변경하세요:
- 기존: `https://jangmadang.site/kakao`
- 변경: `https://jmd-fe.vercel.app/kakao`

### 4. 백엔드 API 변경사항 (필수)

#### 4.1 카카오 로그인 후 토큰 전달 방식 변경
**기존**: 302 응답으로 쿠키 설정
```javascript
// 기존 방식 (크로스 도메인에서 문제 발생)
res.redirect('https://jangmadang.site/kakao?session=token');
```

**변경**: URL 파라미터로 토큰 전달 + 별도 API 호출
```javascript
// 새로운 방식
res.redirect('https://jmd-fe.vercel.app/kakao?token=JWT_TOKEN&email=user@example.com&isNewUser=true');
```

#### 4.2 새로운 API 엔드포인트 추가
```javascript
// POST /api/permit/set-cookie
// 토큰을 받아서 쿠키로 설정 (200 응답)
app.post('/api/permit/set-cookie', (req, res) => {
  const { token } = req.body;
  // 토큰을 쿠키로 설정
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    domain: '.jangmadang.site' // 또는 적절한 도메인
  });
  res.json({ success: true });
});
```

#### 4.3 신규 사용자 닉네임 설정 API 수정
**기존**: 세션에서 이메일 추출
```javascript
// 기존 방식
app.post('/api/permit/nickname', (req, res) => {
  const email = req.session.oauthemail; // 세션에서 이메일 추출
  const { nickname } = req.body;
  // 사용자 저장
});
```

**변경**: Request body에서 이메일 받기
```javascript
// 새로운 방식
app.post('/api/permit/nickname', (req, res) => {
  const { nickname, email } = req.body; // Request body에서 이메일 받기
  // 사용자 저장
});
```

### 5. 회원가입 문제 디버깅
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

### 6. 쿠키 도메인 설정
- 쿠키 도메인이 동적으로 설정되도록 수정 완료
- `window.location.hostname`을 사용하여 현재 도메인에 맞게 자동 설정

### 7. 로그아웃 문제 해결
- 클라이언트 측 쿠키 삭제 로직 추가
- 로그아웃 후 자동 로그인 방지
- 5분간 서버 응답 무시 로직 추가

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
