// import axios from 'axios';
// import { FC, useEffect, useState } from 'react'
// import { useIntl } from 'react-intl'
// import { toAbsoluteUrl } from '../../../_metronic/helpers'
// import { PageTitle } from '../../../_metronic/layout/core'
// import { useAuth } from '../../modules/auth/core/Auth';
// import {
//   ListsWidget2,
//   ListsWidget3,
//   ListsWidget4,
//   ListsWidget6,
//   TablesWidget5,
//   TablesWidget10,
//   MixedWidget8,
//   CardsWidget7,
//   CardsWidget17,
//   CardsWidget20,
//   ListsWidget26,
//   EngageWidget10,
// } from '../../../_metronic/partials/widgets'
// import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
// import { Content } from '../../../_metronic/layout/components/content'

// // export const DashboardPage: FC = () => (
// //   <>
// //     <ToolbarWrapper />
// //     <Content>
// //       <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
// //         <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
// //           <div
// //             className={`card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-md-50 mb-5 mb-xl-10`}
// //             style={{
// //               backgroundColor: '#F1416C',
// //             }}
// //           >
// //             <div className='card-header pt-5'>
// //               <div className='card-title d-flex flex-column'>
// //                 <span className='fs-2hx fw-bold text-white me-2 lh-1 ls-n2'>10</span>

// //                 <span className='text-white opacity-75 pt-1 fw-semibold fs-6'>{`สัญญาทั้งหมด`}</span>
// //               </div>
// //             </div>
// //             <div className='card-body d-flex align-items-end pt-0'>
// //               <div className='d-flex align-items-center flex-column mt-3 w-100'>
// //                 <div className='d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2'>
// //                   <span>43 สถานะร่าง</span>
// //                   <span>72%</span>
// //                 </div>

// //                 <div className='h-8px mx-3 w-100 bg-white bg-opacity-50 rounded'>
// //                   <div
// //                     className='bg-white rounded h-8px'
// //                     role='progressbar'
// //                     style={{ width: '72%' }}
// //                     aria-valuenow={50}
// //                     aria-valuemin={0}
// //                     aria-valuemax={100}
// //                   ></div>
// //                 </div>
// //               </div>
// //             </div>
// //             <div className='card-body d-flex align-items-end pt-0'>
// //               <div className='d-flex align-items-center flex-column mt-3 w-100'>
// //                 <div className='d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2'>
// //                   <span>43 รอตรวจสอบ</span>
// //                   <span>72%</span>
// //                 </div>

// //                 <div className='h-8px mx-3 w-100 bg-white bg-opacity-50 rounded'>
// //                   <div
// //                     className='bg-white rounded h-8px'
// //                     role='progressbar'
// //                     style={{ width: '72%' }}
// //                     aria-valuenow={50}
// //                     aria-valuemin={0}
// //                     aria-valuemax={100}
// //                   ></div>
// //                 </div>
// //               </div>
// //             </div>
// //             <div className='card-body d-flex align-items-end pt-0'>
// //               <div className='d-flex align-items-center flex-column mt-3 w-100'>
// //                 <div className='d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2'>
// //                   <span>43 เสร็จสมบูรณ์</span>
// //                   <span>72%</span>
// //                 </div>

// //                 <div className='h-8px mx-3 w-100 bg-white bg-opacity-50 rounded'>
// //                   <div
// //                     className='bg-white rounded h-8px'
// //                     role='progressbar'
// //                     style={{ width: '72%' }}
// //                     aria-valuenow={50}
// //                     aria-valuemin={0}
// //                     aria-valuemax={100}
// //                   ></div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //           <CardsWidget7
// //             className='h-md-50 mb-5 mb-xl-10'
// //             description='Professionals'
// //             icon={false}
// //             stats={357}
// //             labelColor='dark'
// //             textColor='gray-300'
// //           />
// //         </div>
// //         <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
// //           <CardsWidget17 className='h-md-50 mb-5 mb-xl-10' />
// //           <ListsWidget26 className='h-lg-50' />
// //         </div>
// //         <div className='col-xxl-6'>
// //           <EngageWidget10 className='h-md-100' />
// //         </div>
// //       </div>
// //       <div className='row gx-5 gx-xl-10'>
// //         <div className='col-xxl-6 mb-5 mb-xl-10'>
// //         </div>
// //         <div className='col-xxl-6 mb-5 mb-xl-10'>
// //         </div>
// //       </div>
// //       <div className='row gy-5 gx-xl-8'>
// //         <div className='col-xxl-4'>
// //           <ListsWidget3 className='card-xxl-stretch mb-xl-3' />
// //         </div>
// //         <div className='col-xl-8'>
// //           <TablesWidget10 className='card-xxl-stretch mb-5 mb-xl-8' />
// //         </div>
// //       </div>
// //       <div className='row gy-5 g-xl-8'>
// //         <div className='col-xl-4'>
// //           <ListsWidget2 className='card-xl-stretch mb-xl-8' />
// //         </div>
// //         <div className='col-xl-4'>
// //           <ListsWidget6 className='card-xl-stretch mb-xl-8' />
// //         </div>
// //         <div className='col-xl-4'>
// //           <ListsWidget4 className='card-xl-stretch mb-5 mb-xl-8' items={5} />
// //         </div>
// //       </div>

// //       <div className='row g-5 gx-xxl-8'>
// //         <div className='col-xxl-4'>
// //           <MixedWidget8
// //             className='card-xxl-stretch mb-xl-3'
// //             chartColor='success'
// //             chartHeight='150px'
// //           />
// //         </div>
// //         <div className='col-xxl-8'>
// //           <TablesWidget5 className='card-xxl-stretch mb-5 mb-xxl-8' />
// //         </div>
// //       </div>
// //     </Content>
// //   </>
// // )

// const DashboardWrapper: FC = () => {
//   const intl = useIntl()
//   const { auth } = useAuth();
//   const EmpId = auth?.data?.[0]?.EmpId || '';
//   const TeamSale = auth?.data?.[0]?.TeamSale || '';
//   const SaleCode = auth?.data?.[0]?.SaleCode || '';
//   const SupEmpId = auth?.data?.[0]?.SupEmp || '';
//   const SecEmpId = auth?.data?.[0]?.SecEmp || '';

//   const [total, setTotal] = useState(0)

//   const [draftP, setDraftP] = useState(0)
//   const [finishP, setFinishP] = useState(0)
//   const [pendingP, setPendingP] = useState(0)
//   const [editP, setEditP] = useState(0)

//   const [draft, setDraft] = useState<any[]>([]);
//   const [finish, setFinish] = useState<any[]>([]);
//   const [pending, setPending] = useState<any[]>([]);
//   const [edit, setEdit] = useState<any[]>([]);

//   const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO;
//   const DRAFT_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;
//   const FINISH_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=FINISH&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;
//   const PENDING_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=PENDING&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;
//   const EDIT_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=EDIT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;

//   const getDataDraft = async () => {
//     try {
//       const response = await axios.get(DRAFT_ALLCONTRACT_URL, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       const data = Array.isArray(response.data.data) ? response.data.data : [];
//       setDraft(data); // บันทึกข้อมูล draft
//       getDataFinish()
//       // console.log('Draft: ', data)
//     } catch (error) {
//       console.error('Error fetching DRAFT_ALLCONTRACT_URL:', error);
//     }
//   };

//   const getDataFinish = async () => {
//     try {
//       const response = await axios.get(FINISH_ALLCONTRACT_URL, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       const data = Array.isArray(response.data.data) ? response.data.data : [];
//       setFinish(data); // บันทึกข้อมูล finish
//       getDataPending()
//       // console.log('Finish: ', data)
//     } catch (error) {
//       console.error('Error fetching FINISH_ALLCONTRACT_URL:', error);
//     }
//   };

//   const getDataPending = async () => {
//     try {
//       const response = await axios.get(PENDING_ALLCONTRACT_URL, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       const data = Array.isArray(response.data.data) ? response.data.data : [];
//       setPending(data); // บันทึกข้อมูล finish
//       // console.log('Finish: ', data)
//     } catch (error) {
//       console.error('Error fetching FINISH_ALLCONTRACT_URL:', error);
//     }
//   };

//   const getDataEdit = async () => {
//     try {
//       const response = await axios.get(EDIT_ALLCONTRACT_URL, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       const data = Array.isArray(response.data.data) ? response.data.data : [];
//       setEdit(data); // บันทึกข้อมูล finish
//       getDataEdit()
//       // console.log('Finish: ', data)
//     } catch (error) {
//       console.error('Error fetching FINISH_ALLCONTRACT_URL:', error);
//     }
//   };

//   useEffect(() => {
//     getDataDraft()
//   }, [])

//   useEffect(() => {
//     let toTal = draft.length + finish.length + pending.length + edit.length
//     setTotal(toTal)

//     setDraftP(Math.round((draft.length / toTal) * 100))
//     setPendingP(Math.round((pending.length / toTal) * 100))
//     setEditP(Math.round((edit.length / toTal) * 100))
//     setFinishP(Math.round((finish.length / toTal) * 100))
//   }, [draft, pending, edit, finish])

//   return (
//     <>
//       <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
//       {/* <DashboardPage contractTotal={total} /> */}
//       <>
//         <ToolbarWrapper />
//         <Content>
//           <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
//             <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
//               <div
//                 className={`card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-md-60 mb-5 mb-xl-10`}
//                 style={{
//                   backgroundColor: '#F1416C',
//                 }}
//               >
//                 <div className='card-header pt-5'>
//                   <div className='card-title d-flex flex-column'>
//                     <span className='fs-2hx fw-bold text-white me-2 lh-1 ls-n2'>{total}</span>

//                     <span className='text-white opacity-75 pt-1 fw-semibold fs-6'>{`สัญญาทั้งหมด`}</span>
//                   </div>
//                 </div>
//                 <div className='card-body d-flex align-items-end pt-0'>
//                   <div className='d-flex align-items-center flex-column mt-3 w-100'>
//                     <div className='d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2'>
//                       <span>{`${draft.length} สถานะร่าง`}</span>
//                       <span>{`${draftP}%`}</span>
//                     </div>

//                     <div className='h-8px mx-3 w-100 bg-white bg-opacity-50 rounded'>
//                       <div
//                         className='bg-white rounded h-8px'
//                         role='progressbar'
//                         style={{ width: `${draftP}%` }}
//                         aria-valuenow={50}
//                         aria-valuemin={0}
//                         aria-valuemax={100}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className='card-body d-flex align-items-end pt-0'>
//                   <div className='d-flex align-items-center flex-column mt-3 w-100'>
//                     <div className='d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2'>
//                       <span>{`${pending.length} รอตรวจสอบ`}</span>
//                       <span>{`${pendingP}%`}</span>
//                     </div>

//                     <div className='h-8px mx-3 w-100 bg-white bg-opacity-50 rounded'>
//                       <div
//                         className='bg-white rounded h-8px'
//                         role='progressbar'
//                         style={{ width: `${pendingP}%` }}
//                         aria-valuenow={50}
//                         aria-valuemin={0}
//                         aria-valuemax={100}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className='card-body d-flex align-items-end pt-0'>
//                   <div className='d-flex align-items-center flex-column mt-3 w-100'>
//                     <div className='d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2'>
//                       <span>{`${edit.length} รอแก้ไข`}</span>
//                       <span>{`${editP}%`}</span>
//                     </div>

//                     <div className='h-8px mx-3 w-100 bg-white bg-opacity-50 rounded'>
//                       <div
//                         className='bg-white rounded h-8px'
//                         role='progressbar'
//                         style={{ width: `${editP}%` }}
//                         aria-valuenow={50}
//                         aria-valuemin={0}
//                         aria-valuemax={100}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className='card-body d-flex align-items-end pt-0'>
//                   <div className='d-flex align-items-center flex-column mt-3 w-100'>
//                     <div className='d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2'>
//                       <span>{`${finish.length} เสร็จสมบูรณ์`}</span>
//                       <span>{`${finishP}%`}</span>
//                     </div>

//                     <div className='h-8px mx-3 w-100 bg-white bg-opacity-50 rounded'>
//                       <div
//                         className='bg-white rounded h-8px'
//                         role='progressbar'
//                         style={{ width: `${finishP}%` }}
//                         aria-valuenow={50}
//                         aria-valuemin={0}
//                         aria-valuemax={100}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <CardsWidget7
//                 className='h-md-50 mb-5 mb-xl-10'
//                 description='Professionals'
//                 icon={false}
//                 stats={357}
//                 labelColor='dark'
//                 textColor='gray-300'
//               />
//             </div>
//             {/* end::Col */}

//             {/* begin::Col */}
//             <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
//               <CardsWidget17 className='h-md-50 mb-5 mb-xl-10' />
//               <ListsWidget26 className='h-lg-50' />
//             </div>
//             {/* end::Col */}

//             {/* begin::Col */}
//             <div className='col-xxl-6'>
//               <EngageWidget10 className='h-md-100' />
//             </div>
//             {/* end::Col */}
//           </div>
//           {/* end::Row */}

//           {/* begin::Row */}
//           <div className='row gx-5 gx-xl-10'>
//             {/* begin::Col */}
//             <div className='col-xxl-6 mb-5 mb-xl-10'>
//               {/* <app-new-charts-widget8 cssclassName="h-xl-100" chartHeight="275px" [chartHeightNumber]="275"></app-new-charts-widget8> */}
//             </div>
//             {/* end::Col */}

//             {/* begin::Col */}
//             <div className='col-xxl-6 mb-5 mb-xl-10'>
//               {/* <app-cards-widget18 cssclassName="h-xl-100" image="./assetsmedia/stock/600x600/img-65.jpg"></app-cards-widget18> */}
//             </div>
//             {/* end::Col */}
//           </div>
//           {/* end::Row */}

//           {/* begin::Row */}
//           <div className='row gy-5 gx-xl-8'>
//             <div className='col-xxl-4'>
//               <ListsWidget3 className='card-xxl-stretch mb-xl-3' />
//             </div>
//             <div className='col-xl-8'>
//               <TablesWidget10 className='card-xxl-stretch mb-5 mb-xl-8' />
//             </div>
//           </div>
//           {/* end::Row */}

//           {/* begin::Row */}
//           <div className='row gy-5 g-xl-8'>
//             <div className='col-xl-4'>
//               <ListsWidget2 className='card-xl-stretch mb-xl-8' />
//             </div>
//             <div className='col-xl-4'>
//               <ListsWidget6 className='card-xl-stretch mb-xl-8' />
//             </div>
//             <div className='col-xl-4'>
//               <ListsWidget4 className='card-xl-stretch mb-5 mb-xl-8' items={5} />
//               {/* partials/widgets/lists/_widget-4', 'class' => 'card-xl-stretch mb-5 mb-xl-8', 'items' => '5' */}
//             </div>
//           </div>
//           {/* end::Row */}

//           <div className='row g-5 gx-xxl-8'>
//             <div className='col-xxl-4'>
//               <MixedWidget8
//                 className='card-xxl-stretch mb-xl-3'
//                 chartColor='success'
//                 chartHeight='150px'
//               />
//             </div>
//             <div className='col-xxl-8'>
//               <TablesWidget5 className='card-xxl-stretch mb-5 mb-xxl-8' />
//             </div>
//           </div>
//         </Content>
//       </>
//     </>
//   )
// }

// export { DashboardWrapper }

import styles from "@/styles/style.module.css";
import axios from 'axios'
import { FC, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../modules/auth/core/Auth'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'

import ReportDailyTable from './components/ReportDailyTable'
import ReportDailyPaymentTable from './components/ReportDailyPaymentTable'

const DashboardWrapper: FC = () => {
  const { auth } = useAuth()

  const EmpId = auth?.data?.[0]?.EmpId || ''
  const TeamSale = auth?.data?.[0]?.TeamSale || ''
  const SaleCode = auth?.data?.[0]?.SaleCode || ''

  const [draft, setDraft] = useState<any[]>([])
  const [finish, setFinish] = useState<any[]>([])
  const [pending, setPending] = useState<any[]>([])
  const [edit, setEdit] = useState<any[]>([])

  const [draftP, setDraftP] = useState(0)
  const [finishP, setFinishP] = useState(0)
  const [pendingP, setPendingP] = useState(0)
  const [editP, setEditP] = useState(0)

  const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO
  const headers = { 'Content-Type': 'application/json' as const }
  const GET_PAYMENT_URL = `${API_URL_GET_ALLCONTRACT}/Payment/GetPaymentPeriod`

  const DRAFT_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`
  const FINISH_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=FINISH&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`
  const PENDING_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=PENDING&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`
  const EDIT_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=EDIT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`

  const fetchAllContracts = async () => {
    try {
      const [draftRes, finishRes, pendingRes, editRes] = await Promise.all([
        axios.get(DRAFT_ALLCONTRACT_URL, { headers }),
        axios.get(FINISH_ALLCONTRACT_URL, { headers }),
        axios.get(PENDING_ALLCONTRACT_URL, { headers }),
        axios.get(EDIT_ALLCONTRACT_URL, { headers }),
      ])

      setDraft(Array.isArray(draftRes?.data?.data) ? draftRes.data.data : [])
      setFinish(Array.isArray(finishRes?.data?.data) ? finishRes.data.data : [])
      setPending(Array.isArray(pendingRes?.data?.data) ? pendingRes.data.data : [])
      setEdit(Array.isArray(editRes?.data?.data) ? editRes.data.data : [])
    } catch (err) {
      console.error('Error fetching contracts:', err)
      setDraft([]); setFinish([]); setPending([]); setEdit([])
    }
  }

  useEffect(() => {
    if (!EmpId && !TeamSale && !SaleCode) return
    fetchAllContracts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EmpId, TeamSale, SaleCode])

  useEffect(() => {
    const total = draft.length + finish.length + pending.length + edit.length
    setDraftP(total === 0 ? 0 : Math.round((draft.length / total) * 100))
    setPendingP(total === 0 ? 0 : Math.round((pending.length / total) * 100))
    setEditP(total === 0 ? 0 : Math.round((edit.length / total) * 100))
    setFinishP(total === 0 ? 0 : Math.round((finish.length / total) * 100))
  }, [draft, finish, pending, edit])

  const allContract = draft.length + finish.length
  // console.log(`draft`, draft);
  // console.log(`finish`, finish);
  // console.log(`pending`, pending);
  // console.log(`edit`, edit);

  ////////////// Payments ///////////////
  const [rows, setRows] = useState<any[]>([])
  // console.log(`rows`, rows);
  const [loading, setLoading] = useState(false)

  const fetchPayments = async () => {
    // ยิงเมื่อมีทั้ง EMPID และ TEAMSALE (ใช้ OR ไม่ใช่ AND)
    if (!EmpId || !TeamSale) return
    setLoading(true)
    try {
      const res = await axios.get(GET_PAYMENT_URL, {
        params: {
          EMPID: EmpId,      // <-- ต้องเป็นตัวใหญ่ให้ตรงกับ API
          TEAMSALE: TeamSale // <-- ต้องเป็นตัวใหญ่ให้ตรงกับ API
        },
        // GET ไม่จำเป็นต้องตั้ง Content-Type ก็ได้
      })
      const data = Array.isArray(res?.data?.data) ? res.data.data : []
      setRows(data)
    } catch (err) {
      console.error('Error fetching payment periods:', err)
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EmpId, TeamSale])

  // เงินสด On Hand (รวม CASHONHAND เฉพาะของพนักงานคนนี้)
  const cashOnHandTotal = useMemo(() => {
    if (!EmpId) return 0
    return rows.reduce((sum: number, r: any) => {
      const isThisEmp = String(r?.EMPID ?? '') === String(EmpId)
      const val = Number(r?.CASHONHAND ?? 0)
      return isThisEmp ? sum + (isNaN(val) ? 0 : val) : sum
    }, 0)
  }, [rows, EmpId])

  // console.log(`cashOnHandTotal`, cashOnHandTotal);

  return (
    <>
      <ToolbarWrapper />
      <Content>
        {/* แถวเดียวกัน: การ์ด #1 และ #2 */}
        <div className='row g-5 g-xl-10 align-items-stretch mb-5 mb-xl-10'>
          {/* การ์ด #1 */}
          <div className='col-12 col-md-6 col-xl-6 col-xxl-3 align-self-start'>
            <div
              className='card card-flush w-100 h-auto'
              style={{ backgroundColor: '#4682B4', height: 140 }}
            >
              <div className='card-body d-flex flex-column align-items-center justify-content-center text-center p-4'>
                <span className='fs-1 fw-bold me-2 lh-1 ls-n2 mt-2' style={{ color: '#002B49' }}>สัญญาทั้งหมด</span>
                <div className='fw-bold text-white lh-1 mt-5' style={{ fontSize: 50 }}>{allContract}</div>
              </div>
            </div>
          </div>

          <div className='col-12 col-md-6 col-xl-6 col-xxl-3 align-self-start'>
            <div
              className='card card-flush w-100 h-auto'
              style={{ backgroundColor: '#FADA5E', height: 140 }}
            >
              <div className='card-body d-flex flex-column align-items-center justify-content-center text-center p-4'>
                <span className='fs-1 fw-bold me-2 lh-1 ls-n2 mt-2' style={{ color: '#002B49' }}>สัญญาคงค้าง</span>
                <div className='fw-bold text-white lh-1 mt-5' style={{ fontSize: 50 }}>{draft.length}</div>
              </div>
            </div>
          </div>

          <div className='col-12 col-md-6 col-xl-6 col-xxl-3 align-self-start'>
            <div
              className='card card-flush w-100 h-auto'
              style={{ backgroundColor: '#50C878', height: 140 }}
            >
              <div className='card-body d-flex flex-column align-items-center justify-content-center text-center p-4'>
                <span className='fs-1 fw-bold me-2 lh-1 ls-n2 mt-2' style={{ color: '#002B49' }}>รายการเก็บเงิน</span>
                <div className='fw-bold text-white lh-1 mt-5' style={{ fontSize: 50 }}>{rows.length}</div>
              </div>
            </div>
          </div>

          <div className='col-12 col-md-6 col-xl-6 col-xxl-3 align-self-start'>
            <div
              className='card card-flush w-100 h-auto'
              style={{ backgroundColor: '#F88379', height: 140 }}
            >
              {/* <div className='card-body d-flex flex-column align-items-center justify-content-center text-center p-4'>
                <span className='fs-1 fw-bold me-2 lh-1 ls-n2 mt-2' style={{ color: '#002B49' }}>เงินสด On Hand</span>
                <div className='fw-bold text-white lh-1 mt-5' style={{ fontSize: 50 }}>
                  {cashOnHandTotal.toLocaleString()}
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* ตารางรายงาน */}
        <div className='row gy-5 g-xl-8'>
          <div className='col-12'>
            <ReportDailyTable className='mb-5 mb-xl-10' />
          </div>
        </div>
        <div className='row gy-5 g-xl-8'>
          <div className='col-12'>
            <ReportDailyPaymentTable className='mb-5 mb-xl-10' />
          </div>
        </div>
      </Content >
    </>
  )
}

export { DashboardWrapper }