import styles from '@/styles/style.module.css'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Content } from '../../../_metronic/layout/components/content'
import { SalesItemNumber } from './components/salesItemNumber/SalesItemNumber'
import { useUUIDStore } from '../../modules/stores/stepsStore'
import { useAuth } from '../../modules/auth/core/Auth'
import { EntriesDropdown, PaginationTable } from '../../modules/entriesAndPagination/Pagination'
import { ThreeDot } from 'react-loading-indicators'

const SalesOverview: React.FC = () => {
  // Loading states
  const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false)
  const [isLoadingPending, setIsLoadingPending] = useState<boolean>(false)
  const [isLoadingFinish, setIsLoadingFinish] = useState<boolean>(false)
  const [isLoadingCancel, setIsLoadingCancel] = useState<boolean>(false)

  // Data states
  const [draft, setDraft] = useState<any[]>([])
  const [pending, setPending] = useState<any[]>([])
  const [finish, setFinish] = useState<any[]>([])
  const [cancel, setCancel] = useState<any[]>([])
  // Search state
  const [search, setSearch] = useState<string>('')

  // Pagination states
  const [entries, setEntries] = useState<number>(10)
  const [currentPageDraft, setCurrentPageDraft] = useState<number>(1)
  const [currentPagePending, setCurrentPagePending] = useState<number>(1)
  const [currentPageFinish, setCurrentPageFinish] = useState<number>(1)
  const [currentPageCancel, setCurrentPageCancel] = useState<number>(1)

  const navigate = useNavigate()
  const { SETREFNO } = useUUIDStore()
  const { auth } = useAuth()
  const EmpId = auth?.data?.[0]?.EmpId || ''
  const TeamSale = auth?.data?.[0]?.TeamSale || ''
  const SaleCode = auth?.data?.[0]?.SaleCode || ''

  // API URL
  const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO
  const DRAFT_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}&ProcessType=${auth.processtype}`
  const PENDING_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=PENDING&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}&ProcessType=${auth.processtype}`
  const FINISH_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=FINISH&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}&ProcessType=${auth.processtype}`
  const CANCEL_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=CANCEL&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}&ProcessType=${auth.processtype}`
  // ถ้าคุณมี URL ของ EDIT โดยเฉพาะ ก็สามารถประกาศเพิ่มได้

  useEffect(() => {
    getDataDraft()
    getDataPending()
    getDataFinish()
    getDataCancel()
  }, [])

  // ฟังก์ชันดึงข้อมูลสำหรับแท็บ "คงค้าง" (Draft & Edit)
  const getDataDraft = async () => {
    setIsLoadingDraft(true)
    try {
      const response = await axios.get(DRAFT_ALLCONTRACT_URL)
      let data = Array.isArray(response.data.data) ? response.data.data : []

      // กรองเอาเฉพาะ STATUS === 'DRAFT' หรือ 'EDIT'
      data = data.filter((item: any) => item.STATUS === 'DRAFT' || item.STATUS === 'EDIT')

      setDraft(data)
    } catch (error) {
      console.error('Error fetching DRAFT_ALLCONTRACT_URL:', error)
    } finally {
      setIsLoadingDraft(false)
    }
  }

  // ฟังก์ชันดึงข้อมูลสำหรับแท็บ "รอตรวจสอบ" (Pending)
  const getDataPending = async () => {
    setIsLoadingPending(true)
    try {
      const response = await axios.get(PENDING_ALLCONTRACT_URL)
      let data = Array.isArray(response.data.data) ? response.data.data : []

      // กรองเอาเฉพาะ STATUS === 'PENDING'
      data = data.filter((item: any) => item.STATUS === 'PENDING')

      setPending(data)
    } catch (error) {
      console.error('Error fetching PENDING_ALLCONTRACT_URL:', error)
    } finally {
      setIsLoadingPending(false)
    }
  }

  // ฟังก์ชันดึงข้อมูลสำหรับแท็บ "เสร็จสมบูรณ์" (Finish)
  const getDataFinish = async () => {
    setIsLoadingFinish(true)
    try {
      const response = await axios.get(FINISH_ALLCONTRACT_URL)
      let data = Array.isArray(response.data.data) ? response.data.data : []

      // กรองเอาเฉพาะ STATUS === 'FINISH'
      data = data.filter((item: any) => item.STATUS === 'FINISH')

      setFinish(data)
    } catch (error) {
      console.error('Error fetching FINISH_ALLCONTRACT_URL:', error)
    } finally {
      setIsLoadingFinish(false)
    }
  }

  // ฟังก์ชันดึงข้อมูลสำหรับแท็บ "ยกเลิกไม่อนุมัติ" (Cancel Not Approved)
  const getDataCancel = async () => {
    setIsLoadingCancel(true)
    try {
      const response = await axios.get(CANCEL_ALLCONTRACT_URL)
      let data = Array.isArray(response.data.data) ? response.data.data : []

      // กรองเอาเฉพาะ STATUS === 'CANCEL' และ APPROVED === false (ไม่อนุมัติ)
      data = data.filter((item: any) => item.STATUS === 'CANCEL' && item.APPROVED === false)

      setCancel(data)
    } catch (error) {
      console.error('Error fetching CANCEL_ALLCONTRACT_URL:', error)
    } finally {
      setIsLoadingCancel(false)
    }
  }

  // เพิ่มรายการใหม่
  const handleAddItemClick = () => {
    SETREFNO()
    navigate('/sale/statuscust')
  }

  // ฟิลเตอร์ข้อมูลตาม search
  const searchLower = search.toLowerCase()

  const filteredDraft = draft.filter((item) =>
    (item.NEWREFNO || '').includes(searchLower) ||
    (item.CUSTOMERDETAIL?.[0]?.CUSTOMERNAME || '').toLowerCase().includes(searchLower) ||
    (item.PRODUCT?.[0]?.Package?.[0]?.PACKAGETITLE || '').toLowerCase().includes(searchLower) ||
    (item.PRODUCT?.[0]?.ItemDescription || '').toLowerCase().includes(searchLower) ||
    (item.PRODUCT?.[0]?.SerialNo || '').toLowerCase().includes(searchLower)
  )

  const filteredPending = pending.filter((item) =>
    (item.NEWREFNO || '').includes(searchLower) ||
    (item.CUSTOMERDETAIL?.[0]?.CUSTOMERNAME || '').toLowerCase().includes(searchLower) ||
    (item.PRODUCT?.[0]?.Package?.[0]?.PACKAGETITLE || '').toLowerCase().includes(searchLower) ||
    (item.PRODUCT?.[0]?.ItemDescription || '').toLowerCase().includes(searchLower) ||
    (item.PRODUCT?.[0]?.SerialNo || '').toLowerCase().includes(searchLower)
  )

  const filteredFinish = finish.filter((item) =>
    (item.NEWREFNO || '').includes(searchLower) ||
    (item.CUSTOMERDETAIL?.[0]?.CUSTOMERNAME || '').toLowerCase().includes(searchLower) ||
    (item.PRODUCT?.[0]?.Package?.[0]?.PACKAGETITLE || '').toLowerCase().includes(searchLower) ||
    (item.PRODUCT?.[0]?.ItemDescription || '').toLowerCase().includes(searchLower) ||
    (item.PRODUCT?.[0]?.SerialNo || '').toLowerCase().includes(searchLower)
  )

  const filteredCancel = cancel.filter((item) =>
    (item.NEWREFNO || '').includes(searchLower) ||
    (item.CUSTOMERDETAIL?.[0]?.CUSTOMERNAME || '').toLowerCase().includes(searchLower) ||
    (item.PRODUCT?.[0]?.Package?.[0]?.PACKAGETITLE || '').toLowerCase().includes(searchLower) ||
    (item.PRODUCT?.[0]?.ItemDescription || '').toLowerCase().includes(searchLower) ||
    (item.PRODUCT?.[0]?.SerialNo || '').toLowerCase().includes(searchLower)
  )

  // Pagination logic
  const draftStartIndex = (currentPageDraft - 1) * entries
  const draftDisplayedData = filteredDraft.slice(draftStartIndex, draftStartIndex + entries)

  const pendingStartIndex = (currentPagePending - 1) * entries
  const pendingDisplayedData = filteredPending.slice(pendingStartIndex, pendingStartIndex + entries)

  const finishStartIndex = (currentPageFinish - 1) * entries
  const finishDisplayedData = filteredFinish.slice(finishStartIndex, finishStartIndex + entries)

  const cancelStartIndex = (currentPageCancel - 1) * entries
  const cancelDisplayedData = filteredCancel.slice(cancelStartIndex, cancelStartIndex + entries)

  return (
    <Content>
      <div className='d-flex justify-content-between align-items-center my-5'>
        <div id='kt_page_title' className='page-title d-flex flex-wrap me-3 flex-column'>
        </div>

        <button onClick={handleAddItemClick} className={styles.btnPrimary}>
          เพิ่มรายการ
        </button>
      </div>

      <div className='card mb-10'>
        <div className='card-body px-4'>
          <ul className='nav nav-tabs nav-line-tabs mb-5'>
            <li className='nav-item'>
              <a
                className={`nav-link active ${styles.fontSize}`}
                data-bs-toggle='tab'
                href='#kt_tab_pane_1'
                onClick={getDataDraft}
              >
                คงค้าง
              </a>
            </li>
            <li className='nav-item'>
              <a
                className={`nav-link ${styles.fontSize}`}
                data-bs-toggle='tab'
                href='#kt_tab_pane_2'
                onClick={getDataFinish}
              >
                เสร็จสมบูรณ์
              </a>
            </li>
          </ul>

          <div className='tab-content'>
            {/* ช่องค้นหา */}
            <div className='mb-5 col-xl-6'>
              <input
                type='text'
                className={`form-control ${styles.placeholder}`}
                placeholder='เลขที่สัญญา, S/N, ชื่อลูกค้า'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Tab Draft & Edit */}
            <div className='tab-pane fade active show' id='kt_tab_pane_1'>
              {isLoadingDraft ? (
                <div className='text-center my-10'>
                  <ThreeDot />
                </div>
              ) : draftDisplayedData.length > 0 ? (
                <>
                  {draftDisplayedData.map((item, index) => (
                    <SalesItemNumber
                      key={index}
                      status={item.STATUS} // จะเป็น 'DRAFT' หรือ 'EDIT'
                      item={item}
                      onDelete={getDataDraft} // รีเฟรชข้อมูลหลังจากลบสำเร็จ
                    />
                  ))}

                  <div className='d-none d-xl-flex justify-content-end align-items-center mt-5'>
                    <PaginationTable
                      totalData={filteredDraft.length}
                      entries={entries}
                      currentPage={currentPageDraft}
                      onPageChange={setCurrentPageDraft}
                    />
                  </div>

                  {/* PaginationTable สำหรับหน้าจอเล็ก */}
                  <div
                    className='d-flex d-xl-none justify-content-end align-items-center bg-light p-3 border-top'
                    style={{
                      position: 'fixed',
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
                <p className={`text-gray-600 text-center mt-3 ${styles.fontSize}`}>ไม่มีรายการคงค้าง</p>
              )}
            </div>

            {/* Tab Pending */}
            <div className='tab-pane fade' id='kt_tab_pane_3'>
              {isLoadingPending ? (
                <div className='text-center my-10'>
                  <ThreeDot />
                </div>
              ) : pendingDisplayedData.length > 0 ? (
                <>
                  {pendingDisplayedData.map((item, index) => (
                    <SalesItemNumber
                      key={index}
                      status={item.STATUS} // จะเป็น 'PENDING'
                      item={item}
                      onDelete={getDataPending}
                    />
                  ))}
                  <div className='d-none d-xl-flex justify-content-end align-items-center mt-5'>
                    <PaginationTable
                      totalData={filteredPending.length}
                      entries={entries}
                      currentPage={currentPagePending}
                      onPageChange={setCurrentPagePending}
                    />
                  </div>

                  {/* PaginationTable สำหรับหน้าจอเล็ก */}
                  <div
                    className='d-flex d-xl-none justify-content-end align-items-center bg-light p-3 border-top'
                    style={{
                      position: 'fixed',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      zIndex: 1050,
                    }}
                  >
                    <PaginationTable
                      totalData={filteredPending.length}
                      entries={entries}
                      currentPage={currentPagePending}
                      onPageChange={setCurrentPagePending}
                    />
                  </div>
                </>
              ) : (
                <p className={`text-gray-600 text-center mt-3 ${styles.fontSize}`}>ไม่มีรายการรอตรวจสอบ</p>
              )}
            </div>

            {/* Tab Finish */}
            <div className='tab-pane fade' id='kt_tab_pane_2'>
              {isLoadingFinish ? (
                <div className='text-center my-10'>
                  <ThreeDot />
                </div>
              ) : finishDisplayedData.length > 0 ? (
                <>
                  {finishDisplayedData.map((item, index) => (
                    <SalesItemNumber
                      key={index}
                      status={item.STATUS} // จะเป็น 'FINISH'
                      item={item}
                      onDelete={getDataFinish}
                    />
                  ))}
                  <div className='d-none d-xl-flex justify-content-end align-items-center mt-5'>
                    <PaginationTable
                      totalData={filteredFinish.length}
                      entries={entries}
                      currentPage={currentPageFinish}
                      onPageChange={setCurrentPageFinish}
                    />
                  </div>

                  {/* PaginationTable สำหรับหน้าจอเล็ก */}
                  <div
                    className='d-flex d-xl-none justify-content-end align-items-center bg-light p-3 border-top'
                    style={{
                      position: 'fixed',
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
                <p className={`text-gray-600 text-center mt-3 ${styles.fontSize}`}>ไม่มีรายการที่เสร็จสมบูรณ์</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
}

export { SalesOverview }