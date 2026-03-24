// import { Suspense } from 'react'
// import { Outlet } from 'react-router-dom'
// import { I18nProvider } from '../_metronic/i18n/i18nProvider'
// import { LayoutProvider, LayoutSplashScreen } from '../_metronic/layout/core'
// import { MasterInit } from '../_metronic/layout/MasterInit'
// import { AuthInit } from './modules/auth'
// import { ThemeModeProvider } from '../_metronic/partials'

// import { Commet, ThreeDot } from 'react-loading-indicators'

// const App = () => {
//   return (
//     <Suspense fallback={<LayoutSplashScreen />}>
//       <I18nProvider>
//         <LayoutProvider>
//           <ThemeModeProvider>
//             {/* <AuthInit> */}
//             <Outlet />
//             <MasterInit />
//             {/* </AuthInit> */}
//           </ThemeModeProvider>
//         </LayoutProvider>
//       </I18nProvider>
//     </Suspense>
//   )
// }

// export { App }

import { Suspense, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { I18nProvider } from '../_metronic/i18n/i18nProvider'
import { LayoutProvider, LayoutSplashScreen } from '../_metronic/layout/core'
import { MasterInit } from '../_metronic/layout/MasterInit'
import { ThemeModeProvider } from '../_metronic/partials'
import { Maintenance } from './modules/errors/components/Maintenance'
import axios from 'axios'

const App = () => {
  const [loading, setLoading] = useState(true)
  const [isMaintenance, setIsMaintenance] = useState(false)

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_APP_API_MAINTENANCE)

        if (res.data?.status === true) {
          setIsMaintenance(true)
        }
      } catch (err) {
        console.error('Maintenance check failed:', err)
        // fail-safe → เข้าใช้งานปกติ
      } finally {
        setLoading(false)
      }
    }

    checkMaintenance()
  }, [])

  // 🔵 loading ระหว่างเช็ค API
  if (loading) {
    return <LayoutSplashScreen />
  }

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        <LayoutProvider>
          <ThemeModeProvider>

            {/* 🔴 Maintenance Mode */}
            {isMaintenance ? (
              <Maintenance />
            ) : (
              <>
                <Outlet />
                <MasterInit />
              </>
            )}

          </ThemeModeProvider>
        </LayoutProvider>
      </I18nProvider>
    </Suspense>
  )
}

export { App }