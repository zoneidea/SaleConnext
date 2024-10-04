import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { KTIcon } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/content'
import { CardStatusCustomer } from './components/cards/CardStatusCustomer'

const SalesSatusCust: FC = () => {
  const [showModal, setShowModal] = useState(false); // เริ่มต้นโมดาลปิดอยู่
  const navigate = useNavigate();

  const handleNextClick = () => {
    // แสดงโมดาลเมื่อคลิกปุ่มถัดไป
    setShowModal(true);
  };

  const handleConfirmClick = () => {
    // ซ่อนโมดาล
    setShowModal(false);

    // หน่วงเวลา 1 วินาทีก่อนนำทาง
    setTimeout(() => {
      navigate('/sale/discount');
    }, 1000);
  };

  return (
    <>
      <Content>
        <div className='d-flex justify-content-between align-items-center mb-7 mt-10 mt-lg-0'>
          <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
            data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
            className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
            <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
              ตรวจสอบลูกค้า
            </h1>
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
              <li className="breadcrumb-item text-muted">
                <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
                  ระบบขาย
                </a></li>
              <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
              <li className="breadcrumb-item text-gray-900">ตรวจสอบลูกค้า</li>
            </ul>
          </div>
        </div>

        {/* Card Body */}
        <div className='card mb-10'>
          <div className='card-body py-5'>

            {/* begin::Header */}
            <div className='d-flex justify-content-between align-items-center mb-7 mt-5'>
              <h3 className='card-title'>ตรวจสอบสถานะลูกค้า</h3>
              <button
                type='button'
                className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
              >
                <KTIcon iconName='category' className='fs-2' />
              </button>
            </div>
            {/* end::Header */}

            <div className="input-group gap-2 mb-10 col">
              <input type="text" className="form-control col-lg-6" placeholder="ชื่อ นามสกุล บัตรประชาชน เบอร์โทร" />
              <div className="w-100 d-lg-none"></div>
              <button className="btn btn-primary w-100 w-lg-auto" type="button">ค้นหา</button>
              <button className="btn btn-secondary w-100 w-lg-auto" type="button">บัตร</button>
            </div>

            {/* CardStatusCustomer Component */}
            <div className='row'>
              <div className='col-12 col-md-4'>
                <CardStatusCustomer
                  icon='media/svg/files/folder-document.svg'
                  title='Finance'
                  description='7 files'
                />
              </div>
              <div className='col-12 col-md-4'>
                <CardStatusCustomer
                  icon='media/svg/files/folder-document.svg'
                  title='Finance'
                  description='7 files'
                />
              </div>
              <div className='col-12 col-md-4'>
                <CardStatusCustomer
                  icon='media/svg/files/folder-document.svg'
                  title='Finance'
                  description='7 files'
                />
              </div>
              <div className='col-12 col-md-4'>
                <CardStatusCustomer
                  icon='media/svg/files/folder-document.svg'
                  title='Finance'
                  description='7 files'
                />
              </div>
            </div>
            {/* End CardStatusCustomer Component */}
          </div>
        </div>

        <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
          <Link to='/sale/package' className='btn btn-secondary w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px'>
            ย้อนกลับ
          </Link>
          <button className='btn btn-primary w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px'
            onClick={handleNextClick}
          >
            ถัดไป
          </button>
        </div>

        {/* Modal Component */}
        {showModal && (
          <>
            <div className="modal-backdrop fade show"></div> {/* พื้นหลังจาง */}
            <div
              className="modal show"
              style={{ display: 'block' }}
              tabIndex={-1}
              id="kt_modal_1"
              aria-labelledby="kt_modal_1_label"
              aria-hidden={!showModal}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="kt_modal_1_label">
                      แจ้งเตือน
                    </h5>
                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                      onClick={() => setShowModal(false)}
                      aria-label="Close"
                    >
                      X
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>ลูกค้าต้องชำระเป็นเงินสดเท่านั้น</p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary w-100 w-md-auto px-9"
                      onClick={() => setShowModal(false)}
                    >
                      ปิด
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary w-100 w-md-auto"
                      onClick={handleConfirmClick}
                    >
                      ตกลง
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* End Modal Component */}

        {/* End Card Body */}

      </Content>
    </>
  )
}

export default SalesSatusCust
