//  import clsx from 'clsx'
// import {Link} from 'react-router-dom'
// import {KTIcon, toAbsoluteUrl} from '../../../helpers'
// import {LayoutSetup, useLayout} from '../../core'
// import {Header} from './Header'
// import {Navbar} from './Navbar'

// export function HeaderWrapper() {
//   const {config, classes} = useLayout()
//   if (config.app?.header?.default?.container === 'fluid') {
//     LayoutSetup.classes.headerContainer.push("container-fluid");
//   } else {
//     LayoutSetup.classes.headerContainer.push("container-xxl");
//   }
//   if (!config.app?.header?.display) {
//     return null
//   }

//   return (
//     <div
//       id='kt_app_header'
//       className='app-header'
//       data-kt-sticky='true'
//       data-kt-sticky-activate='{default: true, lg: true}'
//       data-kt-sticky-name='app-header-minimize'
//       data-kt-sticky-offset='{default: "200px", lg: "0"}'
//       data-kt-sticky-animation='false'
//     >
//       <div
//         id='kt_app_header_container'
//         className={clsx(
//           'app-container',
//           classes.headerContainer.join(' '),
//           config.app?.header?.default?.containerClass
//         )}
//       >
//         {config.app.sidebar?.display && (
//           <>
//             {config.layoutType !== 'dark-header' && config.layoutType !== 'light-header' ? (
//               <div
//                 className='d-flex align-items-center d-lg-none ms-n2 me-2'
//                 title='Show sidebar menu'
//               >
//                 <div
//                   className='btn btn-icon btn-active-color-primary w-35px h-35px'
//                   id='kt_app_sidebar_mobile_toggle'
//                 >
//                   <KTIcon iconName='abstract-14' className=' fs-1' />
//                 </div>
//                 <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0'>
//                   <Link to='/dashboard' className='d-lg-none'>
//                       <img
//                         alt='Logo'
//                         src={toAbsoluteUrl('media/logos/logo-sabuyconnext.svg')}
//                         className='h-30px'
//                       />
//                   </Link>
//                 </div>
//               </div>
//             ) : null}
//           </>
//         )}

//         {!(config.layoutType === 'dark-sidebar' || config.layoutType === 'light-sidebar') && (
//           <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15'>
//             <Link to='/dashboard'>
//               {config.layoutType === 'dark-header' ? (
//                 <img
//                   alt='Logo'
//                   src={toAbsoluteUrl('media/logos/logo-sabuyconnext.svg')}
//                   className='h-15px h-lg-30px app-sidebar-logo-default'
//                 />
//               ) : (
//                 <>
//                   <img
//                     alt='Logo'
//                     src={toAbsoluteUrl('media/logos/logo-sabuyconnext.svg')}
//                     className='h-15px h-lg-30px app-sidebar-logo-default theme-light-show'
//                   />
//                   <img
//                     alt='Logo'
//                     src={toAbsoluteUrl('media/logos/logo-sabuyconnext.svg')}
//                     className='h-15px h-lg-30px app-sidebar-logo-default theme-dark-show'
//                   />
//                 </>
//               )}
//             </Link>
//           </div>
//         )}

//         <div
//           id='kt_app_header_wrapper'
//           className='d-flex align-items-stretch justify-content-between flex-lg-grow-1'
//         >
//           {config.app.header.default?.content === 'menu' &&
//             config.app.header.default.menu?.display && (
//               <div
//                 className='app-header-menu app-header-mobile-drawer align-items-stretch'
//                 data-kt-drawer='true'
//                 data-kt-drawer-name='app-header-menu'
//                 data-kt-drawer-activate='{default: true, lg: false}'
//                 data-kt-drawer-overlay='true'
//                 data-kt-drawer-width='225px'
//                 data-kt-drawer-direction='end'
//                 data-kt-drawer-toggle='#kt_app_header_menu_toggle'
//                 data-kt-swapper='true'
//                 data-kt-swapper-mode="{default: 'append', lg: 'prepend'}"
//                 data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}"
//               >
//                 <Header />
//               </div>
//             )}
//           <Navbar />
//         </div>
//       </div>
//     </div>
//   )
// }

import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { KTIcon, toAbsoluteUrl } from '../../../helpers'
import { LayoutSetup, useLayout } from '../../core'
import { Header } from './Header'
import { Navbar } from './Navbar'
import { useState } from 'react'

export function HeaderWrapper() {
  const { config, classes } = useLayout()
  const [isSidebarActive, setSidebarActive] = useState(false) // สร้าง state เพื่อจัดการสถานะ active

  if (config.app?.header?.default?.container === 'fluid') {
    LayoutSetup.classes.headerContainer.push('container-fluid')
  } else {
    LayoutSetup.classes.headerContainer.push('container-xxl')
  }
  if (!config.app?.header?.display) {
    return null
  }

  // ฟังก์ชันสำหรับเปิด/ปิด Sidebar
  const handleSidebarToggle = () => {
    setSidebarActive(!isSidebarActive) // สลับสถานะเปิด/ปิด sidebar
    document.body.classList.toggle('sidebar-opened') // เพิ่ม/ลบ class ให้กับ body สำหรับการเปิด/ปิด sidebar
  }

  return (
    <div
      id='kt_app_header'
      className='app-header'
      data-kt-sticky='true'
      data-kt-sticky-activate='{default: true, lg: true}'
      data-kt-sticky-name='app-header-minimize'
      data-kt-sticky-offset='{default: "200px", lg: "0"}'
      data-kt-sticky-animation='false'
    >
      <div
        id='kt_app_header_container'
        className={clsx(
          'app-container',
          classes.headerContainer.join(' '),
          config.app?.header?.default?.containerClass
        )}
      >
        {config.app.sidebar?.display && (
          <>
            {config.layoutType !== 'dark-header' && config.layoutType !== 'light-header' ? (
              <div className='d-flex align-items-center d-lg-none ms-n2 me-2' title='Show sidebar menu'>
                <div
                  className={clsx(
                    'btn btn-icon btn-active-color-primary w-35px h-35px',
                    { active: isSidebarActive } // เพิ่ม class 'active' เมื่อ isSidebarActive เป็น true
                  )}
                  id='kt_app_sidebar_mobile_toggle'
                  onClick={handleSidebarToggle} // จัดการการเปิด/ปิด Sidebar
                >
                  <KTIcon iconName='abstract-14' className='fs-1' />
                </div>
                <div
                  className='d-flex align-items-center flex-grow-1 flex-lg-grow-0'>
                  <Link to='/dashboard' className='d-lg-none'>
                    <img
                      alt='Logo'
                      src={toAbsoluteUrl('media/logos/logo-tsr-old.png')}
                      className='h-55px'
                    />
                  </Link>
                </div>
              </div>
            ) : null}
          </>
        )}

        {!(config.layoutType === 'dark-sidebar' || config.layoutType === 'light-sidebar') && (
          <div
            className='d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15'>
            <Link to='/dashboard'>
              {config.layoutType === 'dark-header' ? (
                <img
                  alt='Logo'
                  src={toAbsoluteUrl('media/logos/logo-tsr-old.png')}
                  className='h-15px h-lg-30px app-sidebar-logo-default'
                />
              ) : (
                <>
                  <img
                    alt='Logo'
                    src={toAbsoluteUrl('media/logos/logo-tsr-old.png')}
                    className='h-15px h-lg-30px app-sidebar-logo-default theme-light-show'
                  />
                  <img
                    alt='Logo'
                    src={toAbsoluteUrl('media/logos/logo-tsr-old.png')}
                    className='h-15px h-lg-30px app-sidebar-logo-default theme-dark-show'
                  />
                </>
              )}
            </Link>
          </div>
        )}

        <div
          id='kt_app_header_wrapper'
          className='d-flex align-items-stretch justify-content-between flex-lg-grow-1'
        >
          {config.app.header.default?.content === 'menu' &&
            config.app.header.default.menu?.display && (
              <div
                className='app-header-menu app-header-mobile-drawer align-items-stretch'
                data-kt-drawer='true'
                data-kt-drawer-name='app-header-menu'
                data-kt-drawer-activate='{default: true, lg: false}'
                data-kt-drawer-overlay='true'
                data-kt-drawer-width='225px'
                data-kt-drawer-direction='end'
                data-kt-drawer-toggle='#kt_app_header_menu_toggle'
                data-kt-swapper='true'
                data-kt-swapper-mode="{default: 'append', lg: 'prepend'}"
                data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}"
              >
                <Header />
              </div>
            )}
          <Navbar />
        </div>
      </div>
    </div>
  )
}
