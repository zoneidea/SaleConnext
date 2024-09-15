import { Link } from 'react-router-dom'
import { FC } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../helpers'

type Props = {
  className: string
}

const TablesWidget5: FC<Props> = ({ className }) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <span className='text-muted mt-1 fw-semibold fs-6'>ตรวจสอบความถูกต้องของสินค้าที่ต้องการขาย</span>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        <div className='tab-content'>
          {/* begin::Tap pane */}
          <div className='tab-pane fade show active' id='kt_table_widget_5_tab_1'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4'>
                {/* begin::Table head */}
                <thead>
                  <tr className='border-0'>
                    <th className='p-0 w-50px'></th>
                    <th className='p-0 min-w-150px'></th>
                    <th className='p-0 min-w-140px'></th>
                    <th className='p-0 min-w-110px'></th>
                    <th className='p-0 min-w-50px'></th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                  <tr>
                    <td>
                      <div className='symbol symbol-45px me-2'>
                        <span className='symbol-label'>
                          <img
                            src={toAbsoluteUrl('media/svg/brand-logos/plurk.svg')}
                            className='h-50 align-self-center'
                            alt=''
                          />
                        </span>
                      </div>
                    </td>
                    <td>
                      <a href='#' className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'>
                        รหัสสินค้า
                      </a>
                    </td>
                    <td className='text-end text-muted fw-semibold'>React, HTML</td>
                  </tr>
                  <tr>
                    <td>
                      <div className='symbol symbol-45px me-2'>
                        <span className='symbol-label'>
                          <img
                            src={toAbsoluteUrl('media/svg/brand-logos/plurk.svg')}
                            className='h-50 align-self-center'
                            alt=''
                          />
                        </span>
                      </div>
                    </td>
                    <td>
                      <a href='#' className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'>
                        ชื่อสินค้า
                      </a>
                    </td>
                    <td className='text-end text-muted fw-semibold'>React, HTML</td>
                  </tr>
                </tbody>
                {/* end::Table body */}
              </table>
            </div>
            {/* end::Table */}
          </div>
          {/* end::Tap pane */}
        </div>
      </div>
      {/* end::Body */}
      <Link to='#' className='btn btn-primary align-self-center'>
        ถัดไป
      </Link>
    </div>
  )
}

export { TablesWidget5 }
