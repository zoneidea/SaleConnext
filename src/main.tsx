// import {createRoot} from 'react-dom/client'
// // Axios
// import axios from 'axios'
// import {Chart, registerables} from 'chart.js'
// import {QueryClient, QueryClientProvider} from 'react-query'
// // import {ReactQueryDevtools} from 'react-query/devtools'
// // Apps
// import {MetronicI18nProvider} from './_metronic/i18n/Metronici18n'
// import './_metronic/assets/sass/style.react.scss'
// import './_metronic/assets/fonticon/fonticon.css'
// import './_metronic/assets/keenicons/duotone/style.css'
// import './_metronic/assets/keenicons/outline/style.css'
// import './_metronic/assets/keenicons/solid/style.css'
// /**
//  * TIP: Replace this style import with rtl styles to enable rtl mode
//  *
//  * import './_metronic/assets/css/style.rtl.css'
//  **/
// import './_metronic/assets/sass/style.scss'
// import {AppRoutes} from './app/routing/AppRoutes'
// import {AuthProvider, setupAxios} from './app/modules/auth'
// /**
//  * Creates `axios-mock-adapter` instance for provided `axios` instance, add
//  * basic Metronic mocks and returns it.
//  *
//  * @see https://github.com/ctimmerm/axios-mock-adapter
//  */
// /**
//  * Inject Metronic interceptors for axios.
//  *
//  * @see https://github.com/axios/axios#interceptors
//  */
// // setupAxios(axios)
// Chart.register(...registerables)

// const queryClient = new QueryClient()
// const container = document.getElementById('root')
// if (container) {
//   createRoot(container).render(
//     <QueryClientProvider client={queryClient}>
//       <MetronicI18nProvider>
//         <AuthProvider>
//           <AppRoutes />
//         </AuthProvider>
//       </MetronicI18nProvider>
//       {/* <ReactQueryDevtools initialIsOpen={false} /> */}
//     </QueryClientProvider>
//   )
// }


import styles from '@/styles/style.module.css'
import { createRoot } from 'react-dom/client'
// Axios
import axios from 'axios'
import { Chart, registerables } from 'chart.js'
import { QueryClient, QueryClientProvider } from 'react-query'
// import {ReactQueryDevtools} from 'react-query/devtools'
// Apps
import { MetronicI18nProvider } from './_metronic/i18n/Metronici18n'
import './_metronic/assets/sass/style.react.scss'
import './_metronic/assets/fonticon/fonticon.css'
import './_metronic/assets/keenicons/duotone/style.css'
import './_metronic/assets/keenicons/outline/style.css'
import './_metronic/assets/keenicons/solid/style.css'
import './_metronic/assets/sass/style.scss'
import { AppRoutes } from './app/routing/AppRoutes'
import { AuthProvider, setupAxios } from './app/modules/auth'

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

Chart.register(...registerables)

const currentVersion = import.meta.env.VITE_APP_VERSION
const storedVersion = localStorage.getItem('appVersion');

if (storedVersion && storedVersion !== currentVersion) {
  localStorage.clear();

  Swal.fire({
    title: 'อัพเดทระบบ',
    text: 'ระบบมีการอัพเดท กรุณาเข้าสู่ระบบใหม่',
    icon: 'warning',
    confirmButtonText: 'ตกลง'
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = '/auth';
    }
  });
}

localStorage.setItem('appVersion', currentVersion);

// ฟังก์ชันสำหรับล็อกเอาต์และเปลี่ยนเส้นทาง
const logoutAndRedirect = () => {
  localStorage.clear();
  window.location.href = '/auth';
};

// คำนวณเวลาถึงตี 3 ตามเวลาประเทศไทย
const getNextLogoutTime = () => {
  const now = new Date();
  const nextLogout = new Date(now);

  // ตั้งเวลาตี 3 ตามโซนเวลาไทย (UTC+7)
  nextLogout.setUTCHours(20, 0, 0, 0); // ตี 3 ไทย = 20:00 UTC
  if (now >= nextLogout) {
    nextLogout.setUTCDate(nextLogout.getUTCDate() + 1);
  }

  return nextLogout.getTime() - now.getTime();
};

// ตั้ง timeout สำหรับล็อกเอาต์อัตโนมัติเมื่อตี 3
setTimeout(() => {
  logoutAndRedirect();

  // ตั้ง interval เพื่อล็อกเอาต์ทุกวันตอนตี 3
  setInterval(logoutAndRedirect, 24 * 60 * 60 * 1000);
}, getNextLogoutTime());

// Render แอปตามปกติ
const queryClient = new QueryClient();
const container = document.getElementById('root');
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