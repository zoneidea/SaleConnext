import styles from '@/styles/style.module.css'
import { FC } from 'react'
import { useAuth } from '../../../../app/modules/auth'
import { toAbsoluteUrl } from '../../../helpers'
import CryptoJS from 'crypto-js'

type AuthData = {
  data?: Array<{ EmpId?: string; EmpName?: string; PositionName?: string;[k: string]: any }>
  [k: string]: any
}

const getEmpIdFromLocalAuth = (secretKey: string) => {
  const raw = localStorage.getItem('authData')
  if (!raw) return ''

  try {
    const parsed = JSON.parse(raw) as AuthData
    return parsed?.data?.[0]?.EmpId ?? ''
  } catch { }

  try {
    const bytes = CryptoJS.AES.decrypt(raw, secretKey)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    const parsed = JSON.parse(decrypted) as AuthData
    return parsed?.data?.[0]?.EmpId ?? ''
  } catch {
    return ''
  }
}

const openDeepLink = (url: string) => {
  window.location.assign(url)

  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = url
  document.body.appendChild(iframe)
  setTimeout(() => {
    try {
      document.body.removeChild(iframe)
    } catch { }
  }, 800)
}

const HeaderUserMenu: FC = () => {
  const { logout, auth } = useAuth()

  const handleLogout = () => {
    const project = 'SalesCommerce'
    const secretKey = import.meta.env.VITE_APP_SECRET_KEY as string

    const empIdFromAuth = auth?.data?.[0]?.EmpId ?? ''

    const empId = empIdFromAuth || getEmpIdFromLocalAuth(secretKey)

    if (empId) {
      const deeplink =
        `tsr-tracker://track?action=stop` +
        `&projectname=${encodeURIComponent(project)}` +
        `&userid=${encodeURIComponent(empId)}`

      openDeepLink(deeplink)
    }

    setTimeout(() => {
      logout()
    }, 600)
  }

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            <img alt='Logo' src={toAbsoluteUrl('media/avatars/300-16.jpg')} />
          </div>

          <div className='d-flex flex-column'>
            <div className={`fw-bolder d-flex align-items-center ${styles.fontSize}`}>
              {auth.data[0].EmpId}
            </div>
            <p className={`fw-bold text-muted text-hover-primary ${styles.fontSize}`}>
              {auth.data[0].EmpName}
            </p>
          </div>
        </div>
        <span className={`badge badge-light-success fw-bolder px-2 py-1 ms-2 ${styles.fontSize}`}>
          {auth.data[0].PositionName}
        </span>
      </div>

      <div className='separator my-2'></div>

      <div className='menu-item px-5'>
        <a onClick={handleLogout} className={`menu-link px-5 ${styles.fontSize}`}>
          ออกจากระบบ
        </a>
      </div>
    </div>
  )
}

export { HeaderUserMenu }
