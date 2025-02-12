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
/**
 * TIP: Replace this style import with rtl styles to enable rtl mode
 *
 * import './_metronic/assets/css/style.rtl.css'
 **/
import './_metronic/assets/sass/style.scss'
import { AppRoutes } from './app/routing/AppRoutes'
import { AuthProvider, setupAxios } from './app/modules/auth'

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 * basic Metronic mocks and returns it.
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */
/**
 * Inject Metronic interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
// setupAxios(axios)
Chart.register(...registerables)

const currentVersion = import.meta.env.VITE_APP_VERSION // กำหนดเวอร์ชั่นปัจจุบันจาก environment
const storedVersion = localStorage.getItem('appVersion');

if (storedVersion && storedVersion !== currentVersion) {
  localStorage.clear();

  Swal.fire({
    title: 'อัพเดทระบบ',
    text: 'ระบบมีการอัพเดท กรุณาเข้าสู่ระบบใหม่',
    icon: 'warning',
    confirmButtonText: 'ตกลง'
  }).then((result: any) => {
    if (result.isConfirmed) {
      window.location.href = '/auth';
    }
  });
}

localStorage.setItem('appVersion', currentVersion);

// ตรวจสอบเวลา login (session) หากเกิน 24 ชั่วโมง ให้บังคับล็อกอินใหม่
const loginTimestamp = localStorage.getItem('loginTimestamp');
if (loginTimestamp && Date.now() - parseInt(loginTimestamp, 10) > 24 * 60 * 60 * 1000) {
  // Session หมดอายุแล้ว: ล้าง localStorage และแจ้งเตือนผู้ใช้
  localStorage.clear();
  Swal.fire({
    title: 'เซสชันหมดอายุ',
    text: 'การเข้าสู่ระบบของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่',
    icon: 'warning',
    confirmButtonText: 'ตกลง'
  }).then((result: any) => {
    if (result.isConfirmed) {
      window.location.href = '/auth';
    }
  });
} else {
  // หากยังไม่หมดอายุ ให้ render แอปตามปกติ
  const queryClient = new QueryClient()
  const container = document.getElementById('root')
  if (container) {
    createRoot(container).render(
      <QueryClientProvider client={queryClient}>
        <MetronicI18nProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </MetronicI18nProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    )
  }
}