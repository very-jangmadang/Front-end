import { ModalContextProvider } from './components/Modal/context/ModalContext';
import Router from './routes/router';
import { AuthProvider } from './context/AuthProvider';
import GlobalStyle from './styles/globalStyle';
import { useEffect } from 'react';

function App() {
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
