# JMD-FE

## 도메인 변경 후 설정 가이드

도메인이 `jangmadang.site`에서 `jmd-fe.vercel.app`으로 변경된 후 필요한 설정:

### 1. Vercel 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수를 설정해야 합니다:

```bash
VITE_API_BASE_URL=https://api.jangmadang.site  # 또는 새로운 API 서버 주소
VITE_API_ACCESS_TOKEN=your_access_token
```

### 2. 쿠키 도메인 설정
- 쿠키 도메인이 동적으로 설정되도록 수정 완료
- `window.location.hostname`을 사용하여 현재 도메인에 맞게 자동 설정

### 3. 로그아웃 문제 해결
- 클라이언트 측 쿠키 삭제 로직 추가
- 로그아웃 후 자동 로그인 방지

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
