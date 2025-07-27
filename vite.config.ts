import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from '@svgr/rollup';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
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
