import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Content } from '../../../_metronic/layout/components/content';
import { FirstBillItemNumber } from './components/firstBillItemNumber/FirstBillItemNumber';
import { useUUIDStore } from '../../modules/stores/stepsStore';
import { useAuth } from '../../modules/auth/core/Auth';

//useStore
import { useFetchCategoryStore } from '../../modules/stores/sales/packageStore/packageStore';

const FirstBillOverview: React.FC = () => {
  const navigate = useNavigate();
  const { SETREFNO } = useUUIDStore();

  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || '';
  const TeamSale = auth?.data?.[0]?.TeamSale || '';
  const SaleCode = auth?.data?.[0]?.SaleCode || '';

  const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO;
  const FINISH_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=FINISH&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;

  const { fetchCategory } = useFetchCategoryStore();
  // console.log(`fetchCategory: `, fetchCategory);

  const [finish, setFinish] = useState<any[]>([]); // กำหนดให้ state เป็น array เพื่อรองรับ map()
  // console.log(`finish`, finish);

  useEffect(() => {
    const getDataFinish = async () => {
      try {
        const response = await axios.get(FINISH_ALLCONTRACT_URL, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = Array.isArray(response.data.data) ? response.data.data : []
        setFinish(data); // บันทึกข้อมูล finish
      } catch (error) {
        console.error('Error fetching FINISH_ALLCONTRACT_URL:', error);
      }
    };
    getDataFinish()
  }, [])

  return (
    <>
      <Content>
        <div className='d-flex justify-content-between align-items-center mb-7 mt-7 mt-lg-0'>
          <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
            data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
            className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
            <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
              ภาพรวม
            </h1>
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
              <li className="breadcrumb-item text-muted">
                <span className="text-muted text-hover-primary">
                  ระบบเก็บเงินงวดแรก
                </span></li>
              <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
              <li className="breadcrumb-item text-gray-900">ภาพรวม</li>
            </ul>
          </div>
        </div>

        {/* Card Body */}
        <div className='card mb-10'>
          <div className='card-body d-flex align-items-center'>
            <div className='col-12'>
              {finish.length > 0 && (
                finish.map((item, index) => (
                  <FirstBillItemNumber key={index} item={item} />

                ))
              )}
            </div>
          </div>
        </div>
        {/* End Card Body */}
      </Content>
    </>
  )
}

export { FirstBillOverview };