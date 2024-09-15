import { Link } from 'react-router-dom'
import { Content } from '../../../../../_metronic/layout/components/content'

const Step: React.FC = () => {
  return (
    <>
      <Content>
        <div className='d-flex justify-content-between align-items-center mb-7 mt-1 mt-lg-0'>
          <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
            data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
            className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
            <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
              Step
            </h1>
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
              <li className="breadcrumb-item text-muted">
                <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
                  Sales
                </a></li>
              <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
              <li className="breadcrumb-item text-gray-900">Step</li>
            </ul>
          </div>
        </div>

        {/* Card Body */}
        <div className='card mb-10'>
          <div className='card-body d-flex align-items-center py-5 pt-12'>
            <div className='col-12'>

              {/* begin::Item */}
              <Link to=''>
                <div className='d-flex align-items-center pb-8'>
                  {/* begin::Bullet */}
                  <span className='bullet bullet-vertical h-40px bg-success'></span>
                  {/* end::Bullet */}
                  {/* begin::Checkbox */}
                  <div className='form-check form-check-custom form-check-solid mx-5'>
                    <input className='form-check-input' type='checkbox' value='' />
                  </div>
                  {/* end::Checkbox */}
                  {/* begin::Description */}
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-6'>
                      Step 1
                    </div>
                    <span className='text-muted fw-semibold d-block'>ชื่อ step</span>
                  </div>
                  {/* end::Description */}
                  {/* <span className='badge badge-light-success fs-8 fw-bold'>New</span> */}
                </div>
              </Link>
              {/* end:Item */}

              {/* begin::Item */}
              <Link to=''>
                <div className='d-flex align-items-center pb-8'>
                  {/* begin::Bullet */}
                  <span className='bullet bullet-vertical h-40px bg-success'></span>
                  {/* end::Bullet */}
                  {/* begin::Checkbox */}
                  <div className='form-check form-check-custom form-check-solid mx-5'>
                    <input className='form-check-input' type='checkbox' value='' />
                  </div>
                  {/* end::Checkbox */}
                  {/* begin::Description */}
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-6'>
                      Step 2
                    </div>
                    <span className='text-muted fw-semibold d-block'>ชื่อ step</span>
                  </div>
                  {/* end::Description */}
                  {/* <span className='badge badge-light-success fs-8 fw-bold'>New</span> */}
                </div>
              </Link>
              {/* end:Item */}

            </div>
          </div>
        </div>
        {/* End Card Body */}

      </Content>
    </>
  )
}

export default Step
