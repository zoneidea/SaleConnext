import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Content } from '../../../_metronic/layout/components/content';
// import { SalesItemNumber } from './components/salesItemNumber/SalesItemNumber';
import { useUUIDStore } from '../../modules/stores/stepsStore';
import { useAuth } from '../../modules/auth/core/Auth';

import { EntriesDropdown, PaginationTable } from '../../modules/entriesAndPagination/Pagination'
import { Commet, ThreeDot } from 'react-loading-indicators'

const OrderOverview: React.FC = () => {
  const navigate = useNavigate();
  const { SETREFNO } = useUUIDStore();

  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || '';
  const TeamSale = auth?.data?.[0]?.TeamSale || '';
  const SaleCode = auth?.data?.[0]?.SaleCode || '';
  const SupEmpId = auth?.data?.[0]?.SupEmp || '';
  const SecEmpId = auth?.data?.[0]?.SecEmp || '';

  const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
  const GETBOOKINGLIST_URL = `${API_SALECONNEXT}/GetBookinglist`;

  const [allBookingList, setAllBookingList] = useState<any[]>([]); // กำหนดให้ state เป็น array เพื่อรองรับ map()
  // console.log(`allBookingList`, allBookingList);

  // แสดง Show entries
  const [entries, setEntries] = useState<number>(10); // ค่าเริ่มต้นของจำนวนรายการ

  // แสดง Pagination
  const [currentPage, setCurrentPage] = useState<number>(1); // หน้าปัจจุบัน

  // คำนวณข้อมูลที่แสดงในหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * entries;
  const displayedData = allBookingList.slice(startIndex, startIndex + entries);

  const [isLoading, setIsLoading] = useState<boolean>(false); // สถานะการโหลด

  // พนักงานขาย
  useEffect(() => {
    setIsLoading(true); // เริ่มสถานะการโหลด
    setTimeout(async () => {
      try {
        const response = await axios.post(GETBOOKINGLIST_URL,
          {
            EmpId: EmpId,
            TeamSale: TeamSale,
          }, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        setAllBookingList(data);
      } catch (error) {
        console.error('Error fetching GETBOOKINGLIST_URL:', error);
        setAllBookingList([]); // กำหนดค่าเป็น array ว่าง หากเกิดข้อผิดพลาด
      } finally {
        setIsLoading(false); // ปิดสถานะการโหลดหลังจากเสร็จสิ้น
      }
    }, 1000)
  }, [auth]);

  const handleAddItemClick = () => {
    navigate('/order/OrderCreateBooking'); // Navigate to the package page
  };

  return (
    <>
      <Content>
        <div className='d-flex justify-content-between align-items-center'>
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

          <div className='d-flex justify-content-end mb-5'>
            <button onClick={handleAddItemClick} className='btn btn-primary w-100 w-md-100 w-lg-auto'>
              เพิ่มรายการ
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className='card mb-10'>
          <div className='card-body d-flex align-items-center py-5'>
            <div className='col-12'>

              {/* Progress Loader */}
              {isLoading && (
                <div className="text-center my-10">
                  <ThreeDot />
                </div>
              )}

              {!isLoading && allBookingList.length > 0 && (
                <>
                  {/* Dropdown สำหรับเลือกจำนวนรายการ */}
                  <EntriesDropdown onEntriesChange={(value) => setEntries(value)} />

                  {!isLoading && allBookingList.length > 0 && (
                    <>
                      {/* Start Table */}
                      <table className="table table-rounded table-row-bordered border table-striped gs-7 mt-3">
                        <thead>
                          <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
                            <th>#</th>
                            <th>เลขใบจอง</th>
                            <th>ชื่อลูกค้า</th>
                            <th>เบอร์โทร</th>
                            <th>ผลิตภัณฑ์</th>
                            <th>วันที่ติดตั้ง</th>
                            <th>สถานะ</th>
                            <th>แก้ไข</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(displayedData) && displayedData.length > 0 ? (
                            displayedData.map((booking: any, index: number) => (
                              <tr key={index}>
                                <td>{startIndex + index + 1}</td>
                                <td>{booking?.BOOKINGNO}</td>
                                <td>{booking?.CUSTOMER?.PREFIXNAME} {booking?.CUSTOMER?.CUSTOMERNAME}</td>
                                <td>{booking?.ADDRESS[0]?.AddressInstall?.TELMOBILE}</td>
                                <td>{booking?.PRODUCT?.PRODUCTNAME}</td>
                                <td>{booking?.APPOINTMENT?.APPOINT_DATE}</td>
                                <td>{booking.from_data}</td>
                                <td>
                                  <button
                                    className="btn btn-success btn-sm"
                                  // onClick={() => handleUseDataClick(customer)}
                                  >
                                    แก้ไข
                                  </button>
                                </td>
                              </tr>
                            ))) :
                            ("")}
                        </tbody>
                      </table>
                      {/* End Table */}

                      {/* Pagination */}
                      <PaginationTable
                        totalData={allBookingList.length}
                        entries={entries}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                      />
                    </>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
        {/* End Card Body */}
      </Content>
    </>
  )
}

export { OrderOverview };