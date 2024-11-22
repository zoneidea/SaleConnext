import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Content } from '../../../_metronic/layout/components/content';
// import { SalesItemNumber } from './components/salesItemNumber/SalesItemNumber';
import { useUUIDStore } from '../../modules/stores/stepsStore';
import { useAuth } from '../../modules/auth/core/Auth';

//useStore
import { useFetchCategoryStore } from '../../modules/stores/sales/packageStore/packageStore';

const OrderOverview: React.FC = () => {
  const navigate = useNavigate();
  const { SETREFNO } = useUUIDStore();

  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || '';
  const TeamSale = auth?.data?.[0]?.TeamSale || '';
  const SaleCode = auth?.data?.[0]?.SaleCode || '';
  const SupEmpId = auth?.data?.[0]?.SupEmp || '';
  const SecEmpId = auth?.data?.[0]?.SecEmp || '';

  const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO;
  const DRAFT_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;
  const FINISH_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=FINISH&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;

  const { fetchCategory } = useFetchCategoryStore();
  // console.log(`fetchCategory: `, fetchCategory);

  const [draft, setDraft] = useState<any[]>([]); // กำหนดให้ state เป็น array เพื่อรองรับ map()
  const [finish, setFinish] = useState<any[]>([]); // กำหนดให้ state เป็น array เพื่อรองรับ map()

  useEffect(() => {
    getDataDraft();
  }, []);

  const getDataDraft = async () => {
    try {
      const response = await axios.get(DRAFT_ALLCONTRACT_URL, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setDraft(data); // บันทึกข้อมูล draft
      console.log('Draft: ', data)
    } catch (error) {
      console.error('Error fetching DRAFT_ALLCONTRACT_URL:', error);
    }
  };

  const getDataFinish = async () => {
    try {
      const response = await axios.get(FINISH_ALLCONTRACT_URL, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setFinish(data); // บันทึกข้อมูล finish
      console.log('Finish: ', data)
    } catch (error) {
      console.error('Error fetching FINISH_ALLCONTRACT_URL:', error);
    }
  };

  const handleDragtTab = () => {
    getDataDraft()
  }

  const handleFinishTab = () => {
    getDataFinish()
  }

  const handleAddItemClick = () => {
    SETREFNO(); // Generate a new REFNO before navigating
    navigate('/order/OrderCreateBooking'); // Navigate to the package page
  };

  return (
    <>
      <Content>
        <div className='d-flex justify-content-between align-items-center my-5'>
          <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
            data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
            className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
            <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
              ภาพรวม
            </h1>
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
              <li className="breadcrumb-item text-muted">
                <span className="text-muted text-hover-primary">
                  ระบบจอง
                </span></li>
              <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
              <li className="breadcrumb-item text-gray-900">ภาพรวม</li>
            </ul>
          </div>

          <div className='d-flex justify-content-end mb-5 mt-10'>
            <button onClick={handleAddItemClick} className='btn btn-primary w-100 w-md-100 w-lg-auto'>
              เพิ่มรายการ
            </button>
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
                    onClick={handleDragtTab}
                  >
                    รายการจองคงค้าง
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#kt_tab_pane_2"
                    onClick={handleFinishTab}
                  >
                    รายการจองเสร็จสมบูรณ์
                  </a>
                </li>
              </ul>

              <div className="tab-content" id="myTabContent">
                {/* แท็บรายการจองคงค้าง */}
                <div
                  className="tab-pane fade active show"
                  id="kt_tab_pane_1"
                  role="tabpanel"
                >
                  {/* {draft.length > 0 && (
                    draft.map((item, index) => (
                      <SalesItemNumber key={index} status="DRAFT" item={item} />
                    ))
                  )} */}
                  {
                    draft.length === 0 && (
                      <span className='text-gray-800 fw-bold d-block'>{`ไม่มีรายการคงค้าง`}</span>
                    )
                  }
                </div>

                {/* แท็บรายการจองเสร็จสมบูรณ์ */}
                <div className="tab-pane fade" id="kt_tab_pane_2" role="tabpanel">
                  {/* {finish.length > 0 && (
                    finish.map((item, index) => (
                      <SalesItemNumber key={index} status="FINISH" item={item} />
                    ))
                  )} */}
                  {
                    finish.length === 0 && (
                      <span className='text-gray-800 fw-bold d-block'>{`ไม่มีรายการที่เสร็จสมบูรณ์`}</span>
                    )
                  }
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

export { OrderOverview };