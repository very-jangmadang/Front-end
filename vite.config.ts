import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from '@svgr/rollup';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 큰 SVG 파일들을 별도 청크로 분리하여 Babel 경고 방지
          svgAssets: [
            './src/assets/homePage/promotion1.svg',
            './src/assets/homePage/promotion2.svg',
            './src/assets/homePage/promotion3.svg'
          ]
        }
      }
    },
    // 빌드 최적화 설정
    chunkSizeWarningLimit: 1000, // 청크 크기 경고 임계값 증가
  },
  // SVG 최적화 설정
  optimizeDeps: {
    exclude: [
      './src/assets/homePage/promotion1.svg',
      './src/assets/homePage/promotion2.svg',
      './src/assets/homePage/promotion3.svg'
    ]
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: import.meta.env.VITE_API_BASE_URL, // 백엔드 서버 주소
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
});
