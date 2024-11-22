import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Content } from '../../../_metronic/layout/components/content';
import { FirstBillItemNumber } from './components/firstBillItemNumber/FirstBillItemNumber';
import { useUUIDStore } from '../../modules/stores/stepsStore';
import { useAuth } from '../../modules/auth/core/Auth';

import { EntriesDropdown, PaginationTable } from '../../modules/entriesAndPagination/Pagination';
import { ThreeDot } from 'react-loading-indicators';

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

  const [isLoadingFinish, setIsLoadingFinish] = useState<boolean>(false);
  const [searchRefNo, setSearchRefNo] = useState<string>(''); // State สำหรับค้นหา

  // Pagination states
  const [entries, setEntries] = useState<number>(10); // Default entries per page
  const [currentPageFinish, setCurrentPageFinish] = useState<number>(1);

  useEffect(() => {
    getDataFinish();
  }, []);

  const getDataFinish = async () => {
    setIsLoadingFinish(true);
    try {
      const response = await axios.get(FINISH_ALLCONTRACT_URL);
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setFinish(data);
    } catch (error) {
      console.error('Error fetching FINISH_ALLCONTRACT_URL:', error);
    } finally {
      setIsLoadingFinish(false);
    }
  };

  // กรองข้อมูลตาม REFNO
  const filteredFinish = finish.filter((item) =>
    item.REFNO?.toLowerCase().includes(searchRefNo.toLowerCase())
  );

  // Pagination logic for Finish
  const finishStartIndex = (currentPageFinish - 1) * entries;
  const finishDisplayedData = filteredFinish.slice(finishStartIndex, finishStartIndex + entries);

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

              {/* ช่องค้นหา */}
              <div className="mb-5 col-xl-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="ค้นหาจาก REFNO"
                  value={searchRefNo}
                  onChange={(e) => setSearchRefNo(e.target.value)}
                />
              </div>

              {isLoadingFinish ? (
                <div className="text-center my-10">
                  <ThreeDot />
                </div>
              ) : finishDisplayedData.length > 0 ? (
                <>
                  {finishDisplayedData.map((item, index) => (
                    <FirstBillItemNumber key={index} item={item} />
                  ))}

                  <div className='d-none d-xl-flex justify-content-end align-items-center mt-5'>
                    <PaginationTable
                      totalData={filteredFinish.length}
                      entries={entries}
                      currentPage={currentPageFinish}
                      onPageChange={setCurrentPageFinish}
                    />
                  </div>

                  {/* PaginationTable หน้าจอเล็ก */}
                  <div
                    className="d-flex d-xl-none justify-content-end align-items-center bg-light p-3 border-top"
                    style={{
                      position: "fixed",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      zIndex: 1050,
                    }}
                  >
                    <PaginationTable
                      totalData={filteredFinish.length}
                      entries={entries}
                      currentPage={currentPageFinish}
                      onPageChange={setCurrentPageFinish}
                    />
                  </div>

                </>
              ) : (
                <p className="text-gray-600 text-center mt-3">ไม่มีรายการที่เสร็จสมบูรณ์</p>
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