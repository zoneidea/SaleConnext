import { Link } from 'react-router-dom'
import { Content } from '../../../_metronic/layout/components/content'
import { SalesItemNumber } from './components/salesItemNumber/SalesItemNumber'

const SalesOverview: React.FC = () => {
  return (
    <>
      <Content>
        <div className='d-flex justify-content-between align-items-center mb-7 mt-1 mt-lg-0'>
          <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
            data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
            className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
            <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
              ภาพรวม
            </h1>
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
              <li className="breadcrumb-item text-muted">
                <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
                  ระบบขาย
                </a></li>
              <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
              <li className="breadcrumb-item text-gray-900">ภาพรวม</li>
            </ul>
          </div>

          <div className='d-flex justify-content-end mb-5 mt-10'>
            <Link to='/sale/package' className='btn btn-primary w-100 w-md-100 w-lg-auto'>
              เพิ่มรายการ
            </Link>
          </div>

        </div>

        {/* Card Body */}
        <div className='card mb-10'>
          <div className='card-body d-flex align-items-center py-5'>
            <div className='col-12'>
              <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    data-bs-toggle="tab"
                    href="#kt_tab_pane_1"
                  >
                    รายการขายคงค้าง
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#kt_tab_pane_2"
                  >
                    รายการขายเสร็จสมบูรณ์
                  </a>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade active show"
                  id="kt_tab_pane_1"
                  role="tabpanel"
                >
                  <SalesItemNumber status />
                  <SalesItemNumber status />
                </div>
                <div className="tab-pane fade" id="kt_tab_pane_2" role="tabpanel">
                  <SalesItemNumber status />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Card Body */}

      </Content>
    </>
  )
}

export { SalesOverview }
