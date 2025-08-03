import { ModalContextProvider } from './components/Modal/context/ModalContext';
import Router from './routes/router';
import { AuthProvider } from './context/AuthProvider';
import GlobalStyle from './styles/globalStyle';
import { checkDomainAndCookies } from './utils/cookieUtils';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // 앱 시작 시 도메인과 쿠키 상태 확인
    checkDomainAndCookies();
  }, []);

  return (
    <>
      <GlobalStyle />
      <AuthProvider>
        <ModalContextProvider>
          <Router />
        </ModalContextProvider>
      </AuthProvider>
    </>
  );
}

export default App;
