import styles from "@/styles/style.module.css";
import { createRoot } from "react-dom/client";
// Axios
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { QueryClient, QueryClientProvider } from "react-query";
// import {ReactQueryDevtools} from 'react-query/devtools'
// Apps
import { MetronicI18nProvider } from "./_metronic/i18n/Metronici18n";
import "./_metronic/assets/sass/style.react.scss";
import "./_metronic/assets/fonticon/fonticon.css";
import "./_metronic/assets/keenicons/duotone/style.css";
import "./_metronic/assets/keenicons/outline/style.css";
import "./_metronic/assets/keenicons/solid/style.css";
import "./_metronic/assets/sass/style.scss";
import { AppRoutes } from "./app/routing/AppRoutes";
import { AuthProvider, setupAxios } from "./app/modules/auth";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

Chart.register(...registerables);

const currentVersion = import.meta.env.VITE_APP_VERSION;
const storedVersion = localStorage.getItem("appVersion");

if (storedVersion && storedVersion !== currentVersion) {
  localStorage.clear();

  Swal.fire({
    title: "อัพเดทระบบ",
    text: "ระบบมีการอัพเดท กรุณาเข้าสู่ระบบใหม่",
    icon: "warning",
    confirmButtonText: "ตกลง",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/auth";
    }
  });
}

localStorage.setItem("appVersion", currentVersion);

// ฟังก์ชันสำหรับล็อกเอาต์และเปลี่ยนเส้นทาง
const logoutAndRedirect = () => {
  localStorage.clear();
  window.location.href = "/auth";
};

// คำนวณเวลาถึงเที่ยงคืน ตามเวลาประเทศไทย (UTC+7)
const getNextLogoutTime = () => {
  const now = new Date();
  const nextLogout = new Date(now);

  // ตั้งเวลา 17:00 UTC = เที่ยงคืนไทย
  nextLogout.setUTCHours(17, 0, 0, 0);
  // ถ้าเวลาปัจจุบันเลยช่วงนี้ไปแล้ว ก็เลื่อนไปอีกวัน
  if (now >= nextLogout) {
    nextLogout.setUTCDate(nextLogout.getUTCDate() + 1);
  }

  return nextLogout.getTime() - now.getTime();
};

// ตั้ง timeout สำหรับล็อกเอาต์อัตโนมัติเมื่อถึงเที่ยงคืนไทย
setTimeout(() => {
  logoutAndRedirect();

  // ตั้ง interval เพื่อล็อกเอาต์ทุกวันตอนเที่ยงคืนไทย
  setInterval(logoutAndRedirect, 24 * 60 * 60 * 1000);
}, getNextLogoutTime());

// Render แอปตามปกติ
const queryClient = new QueryClient();
const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <QueryClientProvider client={queryClient}>
      <MetronicI18nProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </MetronicI18nProvider>
    </QueryClientProvider>
  );
}