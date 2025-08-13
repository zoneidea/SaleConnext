import { SidebarMenuMain } from './SidebarMenuMain'

const APP_VERSION = import.meta.env.VITE_APP_VERSION;

const SidebarMenu = () => {
  return (
    <div className='app-sidebar-menu overflow-hidden flex-column-fluid'>
      <div
        id='kt_app_sidebar_menu_wrapper'
        className='app-sidebar-wrapper hover-scroll-overlay-y my-5 d-flex flex-column'
        data-kt-scroll='true'
        data-kt-scroll-activate='true'
        data-kt-scroll-height='auto'
        data-kt-scroll-dependencies='#kt_app_sidebar_logo, #kt_app_sidebar_footer'
        data-kt-scroll-wrappers='#kt_app_sidebar_menu'
        data-kt-scroll-offset='5px'
        data-kt-scroll-save-state='true'
      >
        <div className="flex-grow-1">
          <div
            className='menu menu-column menu-rounded menu-sub-indention px-3'
            id='#kt_app_sidebar_menu'
            data-kt-menu='true'
            data-kt-menu-expand='false'
          >
            <SidebarMenuMain />
          </div>
        </div>
        <div style={{ color: '#9A9CAE' }} className="mt-auto text-center">
          v {APP_VERSION}
        </div>
      </div>
    </div>
  )
}

export { SidebarMenu }
