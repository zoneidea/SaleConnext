import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: './index.html',  // ชี้ไปยังไฟล์ index.html
    },
    outDir: 'dist',  // กำหนดโฟลเดอร์ที่ไฟล์บันเดิลจะถูกสร้าง
    assetsDir: 'assets',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // base: "/tsr",
  // build: {
  //   chunkSizeWarningLimit: 3000,
  // },
  server: {
    https: {
      key: fs.readFileSync('./certs/localhost-key.pem'),  // เส้นทางไปยังคีย์ไฟล์
      cert: fs.readFileSync('./certs/localhost.pem'),     // เส้นทางไปยังใบรับรอง
    }
    // https: false
  }
})