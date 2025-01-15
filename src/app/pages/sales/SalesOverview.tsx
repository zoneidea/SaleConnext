import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Content } from '../../../_metronic/layout/components/content';
import { SalesItemNumber } from './components/salesItemNumber/SalesItemNumber';
import { useUUIDStore } from '../../modules/stores/stepsStore';
import { useAuth } from '../../modules/auth/core/Auth';

import { EntriesDropdown, PaginationTable } from '../../modules/entriesAndPagination/Pagination';
import { ThreeDot } from 'react-loading-indicators';

const SalesOverview: React.FC = () => {
  const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false);
  const [isLoadingFinish, setIsLoadingFinish] = useState<boolean>(false);
  const [draft, setDraft] = useState<any[]>([]);
  // console.log(`draft`, draft);
  
  const [finish, setFinish] = useState<any[]>([]);
  const [search, setSearch] = useState<string>(''); // State สำหรับค้นหา

  // Pagination states
  const [entries, setEntries] = useState<number>(10); // Default entries per page
  const [currentPageDraft, setCurrentPageDraft] = useState<number>(1);
  const [currentPageFinish, setCurrentPageFinish] = useState<number>(1);

  const navigate = useNavigate();
  const { SETREFNO } = useUUIDStore();
  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || '';
  const TeamSale = auth?.data?.[0]?.TeamSale || '';
  const SaleCode = auth?.data?.[0]?.SaleCode || '';

  const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO;
  const DRAFT_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;
  const FINISH_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=FINISH&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;

  useEffect(() => {
    getDataDraft();
    getDataFinish();
  }, []);

  const getDataDraft = async () => {
    setIsLoadingDraft(true);
    try {
      const response = await axios.get(DRAFT_ALLCONTRACT_URL);
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setDraft(data);
    } catch (error) {
      console.error('Error fetching DRAFT_ALLCONTRACT_URL:', error);
    } finally {
      setIsLoadingDraft(false);
    }
  };

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

  const handleAddItemClick = () => {
    SETREFNO();
    navigate('/sale/package');
  };

  // กรองข้อมูลตาม search
  const searchLower = search.toLowerCase();

  const filteredDraft = search
    ? draft.filter((item) =>
      (item.CUSTOMERDETAIL?.[0]?.CUSTOMERNAME || "").toLowerCase().includes(searchLower) ||
      (item.PRODUCT?.[0]?.Package?.[0]?.PACKAGETITLE || "").toLowerCase().includes(searchLower) ||
      (item.PRODUCT?.[0]?.ItemDescription || "").toLowerCase().includes(searchLower) ||
      (item.PRODUCT?.[0]?.SerialNo || "").toLowerCase().includes(searchLower)
    )
    : draft;

  const filteredFinish = search
    ? finish.filter((item) =>
      (item.CUSTOMERDETAIL?.[0]?.CUSTOMERNAME || "").toLowerCase().includes(searchLower) ||
      (item.PRODUCT?.[0]?.Package?.[0]?.PACKAGETITLE || "").toLowerCase().includes(searchLower) ||
      (item.PRODUCT?.[0]?.ItemDescription || "").toLowerCase().includes(searchLower) ||
      (item.PRODUCT?.[0]?.SerialNo || "").toLowerCase().includes(searchLower)
    )
    : finish;

  // Pagination logic for Draft
  const draftStartIndex = (currentPageDraft - 1) * entries;
  const draftDisplayedData = filteredDraft.slice(draftStartIndex, draftStartIndex + entries);

  // Pagination logic for Finish
  const finishStartIndex = (currentPageFinish - 1) * entries;
  const finishDisplayedData = filteredFinish.slice(finishStartIndex, finishStartIndex + entries);

  return (
    <Content>
      <div className='d-flex justify-content-between align-items-center mb-5'>
        <div id="kt_page_title" className="page-title d-flex flex-wrap me-3 flex-column">
          <h1 className="page-heading text-gray-900 fw-bold fs-3 my-0">ภาพรวม</h1>
          <ul className="breadcrumb fw-semibold fs-7 my-0">
            <li className="breadcrumb-item text-muted">
              <span className="text-muted text-hover-primary">ระบบขาย</span>
            </li>
            <li className="breadcrumb-item text-gray-900">ภาพรวม</li>
          </ul>
        </div>

        <button onClick={handleAddItemClick} className='btn btn-primary'>
          เพิ่มรายการ
        </button>
      </div>

      <div className='card mb-10'>
        <div className='card-body'>
          <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
            <li className="nav-item">
              <a
                className="nav-link active"
                data-bs-toggle="tab"
                href="#kt_tab_pane_1"
                onClick={getDataDraft}
              >
                รายการขายคงค้าง
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                data-bs-toggle="tab"
                href="#kt_tab_pane_2"
                onClick={getDataFinish}
              >
                รายการขายเสร็จสมบูรณ์
              </a>
            </li>
          </ul>

          <div className="tab-content">
            {/* ช่องค้นหา */}
            <div className="mb-5 col-xl-6">
              <input
                type="text"
                className="form-control"
                placeholder="ค้นหาจาก ชื่อสินค้า, แพ็คเกจ, Serial Number, ชื่อลูกค้า"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Tab Draft */}
            <div className="tab-pane fade active show" id="kt_tab_pane_1">
              {isLoadingDraft ? (
                <div className="text-center my-10">
                  <ThreeDot />
                </div>
              ) : draftDisplayedData.length > 0 ? (
                <>
                  {draftDisplayedData.map((item, index) => (
                    <SalesItemNumber key={index} status="DRAFT" item={item} />
                  ))}

                  <div className='d-none d-xl-flex justify-content-end align-items-center mt-5'>
                    <PaginationTable
                      totalData={filteredDraft.length}
                      entries={entries}
                      currentPage={currentPageDraft}
                      onPageChange={setCurrentPageDraft}
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
                      totalData={filteredDraft.length}
                      entries={entries}
                      currentPage={currentPageDraft}
                      onPageChange={setCurrentPageDraft}
                    />
                  </div>

                </>
              ) : (
                <p className="text-gray-600 text-center mt-3">ไม่มีรายการคงค้าง</p>
              )}
            </div>

            {/* Tab Finish */}
            <div className="tab-pane fade" id="kt_tab_pane_2">
              {isLoadingFinish ? (
                <div className="text-center my-10">
                  <ThreeDot />
                </div>
              ) : finishDisplayedData.length > 0 ? (
                <>
                  {finishDisplayedData.map((item, index) => (
                    <SalesItemNumber key={index} status="FINISH" item={item} />
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
      </div>
    </Content>
  );
};

export { SalesOverview };