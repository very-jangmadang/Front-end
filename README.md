# Front-end (장마당 프론트엔드)

이 레포지토리는 장마당 서비스의 프론트엔드입니다.

## 실행 방법

### 1. 의존성 설치

프로젝트에 필요한 패키지들을 설치합니다.

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트 디렉터리에 `.env` 파일을 생성하고, API 서버 주소 등 필요한 환경 변수를 입력합니다.

```properties
VITE_API_BASE_URL
VITE_WEPIN_APP_ID
VITE_WEPIN_APP_KEY
```

### 3. 개발 서버 실행

개발 서버를 시작합니다.

```bash
npm run dev
```

서버가 실행되면 터미널에 나오는 주소(예: `http://localhost:5173`)로 접속하여 확인할 수 있습니다.

