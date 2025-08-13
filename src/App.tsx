import { ModalContextProvider } from './components/Modal/context/ModalContext';
import Router from './routes/router';
import { AuthProvider } from './context/AuthProvider';
import GlobalStyle from './styles/globalStyle';
import WepinInitializer from './components/Wepin/WepinInitializer';
import { WepinProvider } from './context/WepinContext';

function App() {
  return (
    <>
      <GlobalStyle />
      <AuthProvider>
        <WepinProvider>
          <WepinInitializer />
          <ModalContextProvider>
            <Router />
          </ModalContextProvider>
        </WepinProvider>
      </AuthProvider>
    </>
  );
}

export default App;
