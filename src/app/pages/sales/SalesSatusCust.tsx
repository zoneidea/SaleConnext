import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { KTIcon } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/content'
import { CardStatusCustomer } from './components/cards/CardStatusCustomer'
import { useUUIDStore, useSaveProductStore } from '../../modules/stores/stepsStore';
import { useAuth } from '../../modules/auth/core/Auth';
import axios from 'axios';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const SalesSatusCust: React.FC = () => {
  const [showModal, setShowModal] = useState(false); // เริ่มต้นโมดาลปิดอยู่
  const navigate = useNavigate();
  const { REFNO } = useUUIDStore();
  const { auth } = useAuth();

  const EmpId = auth?.data?.[0]?.EmpId || '';
  const TeamSale = auth?.data?.[0]?.TeamSale || '';
  const SaleCode = auth?.data?.[0]?.SaleCode || '';
  const SupEmpId = auth?.data?.[0]?.SupEmp || '';
  const SecEmpId = auth?.data?.[0]?.SecEmp || '';

  const API_URL_POST_CHECKCUSTOMER = import.meta.env.VITE_APP_API_THIENSURAT;
  const CHECK_CUST_NEW_URL = `${API_URL_POST_CHECKCUSTOMER}/CheckCustomer/Check_New`;

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const GET_CONTRACT = `${API_URL_MONGO}/Contract/GetContractSummary?refno=${REFNO}`;

  const [getContract, setGetContract] = useState<any[]>([]);
  // console.log(`getContract`, getContract);
  const ItemCode = getContract[0]?.PRODUCT[0]?.ItemCode
  const Model = getContract[0]?.PRODUCT[0]?.Package[0]?.MODEL
  const [idCard, setIdCard] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [customerStatus, setCustomerStatus] = useState<any>(null);

  const searchData = {
    RefNo: REFNO,
    Search: idCard,
    EmpId,
    ItemCode: ItemCode,
    Model: Model,
  }

  useEffect(() => {
    const getContract = async () => {
      try {
        const response = await axios.get(GET_CONTRACT, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'multipart/form-data',
          },
        });
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        setGetContract(data);
      } catch (error) {
        console.error('Error fetching EMP_IN_TEAM_URL:', error);
      }
    };
    getContract();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // จำกัดให้กรอกเฉพาะตัวเลข และไม่เกิน 13 หลัก
    if (/^\d{0,13}$/.test(value)) {
      setIdCard(value);
      setError(''); // ล้าง error เมื่อกรอกถูกต้อง
    }
  };

  const checkCustomer = async () => {
    if (idCard.length !== 13) {
      setError('กรุณากรอกเลขบัตรประชาชน 13 หลัก');
      return;
    }

    try {
      const response = await axios.post(CHECK_CUST_NEW_URL, searchData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'multipart/form-data',
        }
      });
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setCustomerStatus(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // const handleNextClick = () => {
  //   // แสดงโมดาลเมื่อคลิกปุ่มถัดไป
  //   setShowModal(true);
  // };

  const handleNextClick = () => {
    if (!customerStatus) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'กรุณาตรวจสอบสถานะลูกค้าก่อน',
      });
      return;
    }

    const statusSale = customerStatus?.[0]?.StatusSale;

    if (statusSale === "0") {
      //กรณีไม่ผ่านการตรวจสอบ
      Swal.fire({
        icon: 'error',
        title: 'ไม่ผ่านการตรวจสอบ',
        text: 'ลูกค้าไม่ผ่านเงื่อนไขในการดำเนินการต่อ',
      });
    } else if (statusSale === "1") {
      // กรณีผ่านการตรวจสอบ
      navigate('/sale/discount');
    } else if (statusSale === "2") {
      // ℹ️ กรณีต้องแสดง Iframe
      const refNo = REFNO;
      const bookingNo = REFNO;
      const createBy = EmpId;
      const saleEmployeeCode = EmpId;
      const saleCode = SaleCode;
      const teamName = TeamSale;
      const processType = 'CT';
      const customerType = customerStatus?.[0]?.CustomerType || '0';
      const fName = encodeURIComponent(customerStatus?.[0]?.FirstName || '');
      const lName = encodeURIComponent(customerStatus?.[0]?.LastName || '');
      const idCard = customerStatus?.[0]?.IDCard || '';
      const birthDay = customerStatus?.[0]?.BirthDay || '';
      const address = encodeURIComponent(customerStatus?.[0]?.Address || '');

      const iframeURL =
        `https://app.tsrplc.com/love_connext/issue_systems_page_2.php??RefNo=${refNo}&BookingNo=${bookingNo}&CreateBy=${createBy}&SaleEmployeeCode=${saleEmployeeCode}&SaleCode=${saleCode}&TeamName=${teamName}&ProcessType=${processType}&CustomerType=${customerType}&FName=${fName}&LName=${lName}&IDCard=${idCard}&BirthDay=${birthDay}&Address=${address}`;

      Swal.fire({
        title: 'แสดงรายละเอียดเพิ่มเติม',
        html: `
            <div style="width: 100%; height: 80vh; overflow: hidden;">
              <iframe 
                src="${iframeURL}" 
                width="100%" 
                height="100%" 
                style="border: none;"
                onerror="this.parentNode.innerHTML = '<p style=\'color:red;\'>ไม่สามารถโหลดเนื้อหาได้ กรุณาตรวจสอบ URL หรือการตั้งค่า CORS</p>';">
              </iframe>
            </div>
          `,
        width: '90vw',    // กำหนดความกว้าง 90% ของ viewport
        heightAuto: false, // ปิดการปรับความสูงอัตโนมัติ
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
        customClass: {
          popup: 'custom-swal-popup' // เพิ่ม class สำหรับปรับแต่งเพิ่มเติม
        }
      });
    }
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
        <div className='d-flex justify-content-between align-items-center mb-7 mt-lg-5'>
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
        <p>เลขที่ขาย: {REFNO}</p>

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

            <div className="input-group gap-2 mb-10 d-flex align-items-center">
              <input
                type="text"
                className={`form-control flex-grow-1 ${error ? 'is-invalid' : ''}`}
                placeholder="กรอกเลขบัตรประชาชน"
                onChange={handleInputChange}
                value={idCard}
              />

              <button
                className="btn btn-primary ms-2" // เพิ่มระยะห่างด้านซ้าย
                type="button"
                onClick={checkCustomer}
                disabled={idCard.length !== 13} // ตรวจสอบว่าครบ 13 หลักหรือไม่
              >
                ค้นหา
              </button>
              {error && <div className="invalid-feedback d-block">{error}</div>}
            </div>

            {/* CardStatusCustomer Component */}
            <div className='row'>
              <div className='col-12 col-md-6 col-xl-4'>
                {customerStatus && customerStatus.length > 0 && (
                  <CardStatusCustomer customerStatus={customerStatus} />
                )}
              </div>
            </div>
            {/* End CardStatusCustomer Component */}
          </div>
        </div>

        <div className='d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10'>
          <button
            className="btn btn-secondary w-auto me-2"
            onClick={() => navigate('/sale/overview')}
          >
            กลับหน้าแรก
          </button>
          <button
            className='btn btn-primary w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px'
            onClick={handleNextClick}
          >
            ถัดไป
          </button>
        </div>

        {/* ปุ่มในหน้าจอเล็ก */}
        <div
          className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1050,
          }}
        >
          <button
            className="btn btn-secondary w-auto me-2"
            onClick={() => navigate('/sale/overview')}
          >
            กลับหน้าแรก
          </button>
          <button
            className={`btn btn-primary w-auto`}
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
