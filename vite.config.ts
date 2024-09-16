import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: './index.html',  // ชี้ไปยังไฟล์ index.html
    },
    outDir: 'dist',  // โฟลเดอร์บันเดิล
    assetsDir: 'assets',  // โฟลเดอร์สำหรับ asset ที่ถูกสร้างขึ้น
    chunkSizeWarningLimit: 3000,  // หากต้องการแสดงคำเตือนเมื่อขนาด chunk เกิน 3MB
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // การใช้ alias '@' เพื่อชี้ไปยังโฟลเดอร์ src
    },
  },
  server: {
    https: {
      key: fs.readFileSync('./certs/localhost-key.pem'),  // ใส่คีย์สำหรับ HTTPS
      cert: fs.readFileSync('./certs/localhost.pem'),     // ใส่ใบรับรองสำหรับ HTTPS
    },
    // https: false
  }
});