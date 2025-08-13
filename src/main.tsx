import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Buffer } from 'buffer';

// Wepin SDK가 Node.js의 'Buffer'에 의존하므로, 브라우저 환경을 위해 폴리필을 추가합니다.
window.Buffer = Buffer;

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
