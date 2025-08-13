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
















import axios from 'axios';
import { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { toAbsoluteUrl } from '../../../_metronic/helpers'
import { PageTitle } from '../../../_metronic/layout/core'
import { useAuth } from '../../modules/auth/core/Auth';
import {
  ListsWidget2,
  ListsWidget3,
  ListsWidget4,
  ListsWidget6,
  TablesWidget5,
  TablesWidget10,
  MixedWidget8,
  CardsWidget7,
  CardsWidget17,
  CardsWidget20,
  ListsWidget26,
  EngageWidget10,
} from '../../../_metronic/partials/widgets'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'
import { log } from 'node:console';

// export const DashboardPage: FC = () => (
//   <>
//     <ToolbarWrapper />
//     <Content>
//       <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
//         <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
//           <div
//             className={`card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-md-50 mb-5 mb-xl-10`}
//             style={{
//               backgroundColor: '#F1416C',
//             }}
//           >
//             <div className='card-header pt-5'>
//               <div className='card-title d-flex flex-column'>
//                 <span className='fs-2hx fw-bold text-white me-2 lh-1 ls-n2'>10</span>

//                 <span className='text-white opacity-75 pt-1 fw-semibold fs-6'>{`สัญญาทั้งหมด`}</span>
//               </div>
//             </div>
//             <div className='card-body d-flex align-items-end pt-0'>
//               <div className='d-flex align-items-center flex-column mt-3 w-100'>
//                 <div className='d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2'>
//                   <span>43 สถานะร่าง</span>
//                   <span>72%</span>
//                 </div>

//                 <div className='h-8px mx-3 w-100 bg-white bg-opacity-50 rounded'>
//                   <div
//                     className='bg-white rounded h-8px'
//                     role='progressbar'
//                     style={{ width: '72%' }}
//                     aria-valuenow={50}
//                     aria-valuemin={0}
//                     aria-valuemax={100}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//             <div className='card-body d-flex align-items-end pt-0'>
//               <div className='d-flex align-items-center flex-column mt-3 w-100'>
//                 <div className='d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2'>
//                   <span>43 รอตรวจสอบ</span>
//                   <span>72%</span>
//                 </div>

//                 <div className='h-8px mx-3 w-100 bg-white bg-opacity-50 rounded'>
//                   <div
//                     className='bg-white rounded h-8px'
//                     role='progressbar'
//                     style={{ width: '72%' }}
//                     aria-valuenow={50}
//                     aria-valuemin={0}
//                     aria-valuemax={100}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//             <div className='card-body d-flex align-items-end pt-0'>
//               <div className='d-flex align-items-center flex-column mt-3 w-100'>
//                 <div className='d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2'>
//                   <span>43 เสร็จสมบูรณ์</span>
//                   <span>72%</span>
//                 </div>

//                 <div className='h-8px mx-3 w-100 bg-white bg-opacity-50 rounded'>
//                   <div
//                     className='bg-white rounded h-8px'
//                     role='progressbar'
//                     style={{ width: '72%' }}
//                     aria-valuenow={50}
//                     aria-valuemin={0}
//                     aria-valuemax={100}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <CardsWidget7
//             className='h-md-50 mb-5 mb-xl-10'
//             description='Professionals'
//             icon={false}
//             stats={357}
//             labelColor='dark'
//             textColor='gray-300'
//           />
//         </div>
//         <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
//           <CardsWidget17 className='h-md-50 mb-5 mb-xl-10' />
//           <ListsWidget26 className='h-lg-50' />
//         </div>
//         <div className='col-xxl-6'>
//           <EngageWidget10 className='h-md-100' />
//         </div>
//       </div>
//       <div className='row gx-5 gx-xl-10'>
//         <div className='col-xxl-6 mb-5 mb-xl-10'>
//         </div>
//         <div className='col-xxl-6 mb-5 mb-xl-10'>
//         </div>
//       </div>
//       <div className='row gy-5 gx-xl-8'>
//         <div className='col-xxl-4'>
//           <ListsWidget3 className='card-xxl-stretch mb-xl-3' />
//         </div>
//         <div className='col-xl-8'>
//           <TablesWidget10 className='card-xxl-stretch mb-5 mb-xl-8' />
//         </div>
//       </div>
//       <div className='row gy-5 g-xl-8'>
//         <div className='col-xl-4'>
//           <ListsWidget2 className='card-xl-stretch mb-xl-8' />
//         </div>
//         <div className='col-xl-4'>
//           <ListsWidget6 className='card-xl-stretch mb-xl-8' />
//         </div>
//         <div className='col-xl-4'>
//           <ListsWidget4 className='card-xl-stretch mb-5 mb-xl-8' items={5} />
//         </div>
//       </div>

//       <div className='row g-5 gx-xxl-8'>
//         <div className='col-xxl-4'>
//           <MixedWidget8
//             className='card-xxl-stretch mb-xl-3'
//             chartColor='success'
//             chartHeight='150px'
//           />
//         </div>
//         <div className='col-xxl-8'>
//           <TablesWidget5 className='card-xxl-stretch mb-5 mb-xxl-8' />
//         </div>
//       </div>
//     </Content>
//   </>
// )

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || '';
  const TeamSale = auth?.data?.[0]?.TeamSale || '';
  const SaleCode = auth?.data?.[0]?.SaleCode || '';
  const SupEmpId = auth?.data?.[0]?.SupEmp || '';
  const SecEmpId = auth?.data?.[0]?.SecEmp || '';

  const [total, setTotal] = useState(0)

  const [draftP, setDraftP] = useState(0)
  const [finishP, setFinishP] = useState(0)
  const [pendingP, setPendingP] = useState(0)
  const [editP, setEditP] = useState(0)

  // console.log(`draftP`, draftP)
  // console.log(`finishP`, finishP)
  // console.log(`pendingP`, pendingP)
  // console.log(`editP`, editP)

  const [draft, setDraft] = useState<any[]>([]);
  const [finish, setFinish] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [edit, setEdit] = useState<any[]>([]);

  console.log(`draft`, draft.length)
  console.log(`finish`, finish.length)
  console.log(`pending`, pending.length)
  console.log(`edit`, edit.length)

  const success = finish.length - pending.length
  const allContract = success + pending.length

  const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO;
  const DRAFT_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;
  const FINISH_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=FINISH&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;
  const PENDING_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=PENDING&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;
  const EDIT_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=EDIT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;

  const getDataDraft = async () => {
    try {
      const response = await axios.get(DRAFT_ALLCONTRACT_URL, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setDraft(data); // บันทึกข้อมูล draft
      getDataFinish()
      // console.log('Draft: ', data)
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
      getDataPending()
      // console.log('Finish: ', data)
    } catch (error) {
      console.error('Error fetching FINISH_ALLCONTRACT_URL:', error);
    }
  };

  const getDataPending = async () => {
    try {
      const response = await axios.get(PENDING_ALLCONTRACT_URL, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setPending(data); // บันทึกข้อมูล finish
      // console.log('Finish: ', data)
    } catch (error) {
      console.error('Error fetching FINISH_ALLCONTRACT_URL:', error);
    }
  };

  const getDataEdit = async () => {
    try {
      const response = await axios.get(EDIT_ALLCONTRACT_URL, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setEdit(data); // บันทึกข้อมูล finish
      getDataEdit()
      // console.log('Finish: ', data)
    } catch (error) {
      console.error('Error fetching FINISH_ALLCONTRACT_URL:', error);
    }
  };

  useEffect(() => {
    getDataDraft()
  }, [])

  useEffect(() => {
    let toTal = draft.length + finish.length + pending.length + edit.length
    setTotal(toTal)

    // ป้องกันการหารด้วย 0
    setDraftP(toTal === 0 ? 0 : Math.round((draft.length / toTal) * 100))
    setPendingP(toTal === 0 ? 0 : Math.round((pending.length / toTal) * 100))
    setEditP(toTal === 0 ? 0 : Math.round((edit.length / toTal) * 100))
    setFinishP(toTal === 0 ? 0 : Math.round((finish.length / toTal) * 100))
  }, [draft, pending, edit, finish])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'หน้าแรก' })}</PageTitle>
      {/* <DashboardPage contractTotal={total} /> */}
      <>
        <ToolbarWrapper />
        <Content>
          <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
            <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
              <div
                className={`card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-md-60 mb-5 mb-xl-10`}
                style={{
                  backgroundColor: '#F1416C',
                }}
              >
                <div className='card-header pt-5'>
                  <div className='card-title d-flex flex-column'>
                    <span className='fs-2hx fw-bold text-white me-2 lh-1 ls-n2'>{allContract}</span>

                    <span className='text-white opacity-75 pt-1 fw-semibold fs-6'>{`สัญญาทั้งหมด`}</span>
                  </div>
                </div>
                <div className='card-body d-flex align-items-end pt-0'>
                  <div className='d-flex align-items-center flex-column mt-3 w-100'>
                    <div className='d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2'>
                      <span>{`${draft.length} สถานะร่าง`}</span>
                      <span>{`${draftP}%`}</span>
                    </div>

                    <div className='h-8px mx-3 w-100 bg-white bg-opacity-50 rounded'>
                      <div
                        className='bg-white rounded h-8px'
                        role='progressbar'
                        style={{ width: `${draftP}%` }}
                        aria-valuenow={50}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className='card-body d-flex align-items-end pt-0'>
                  <div className='d-flex align-items-center flex-column mt-3 w-100'>
                    <div className='d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2'>
                      <span>{`${pending.length} รอตรวจสอบ`}</span>
                      <span>{`${pendingP}%`}</span>
                    </div>

                    <div className='h-8px mx-3 w-100 bg-white bg-opacity-50 rounded'>
                      <div
                        className='bg-white rounded h-8px'
                        role='progressbar'
                        style={{ width: `${pendingP}%` }}
                        aria-valuenow={50}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className='card-body d-flex align-items-end pt-0'>
                  <div className='d-flex align-items-center flex-column mt-3 w-100'>
                    <div className='d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2'>
                      <span>{`${edit.length} รอแก้ไข`}</span>
                      <span>{`${editP}%`}</span>
                    </div>

                    <div className='h-8px mx-3 w-100 bg-white bg-opacity-50 rounded'>
                      <div
                        className='bg-white rounded h-8px'
                        role='progressbar'
                        style={{ width: `${editP}%` }}
                        aria-valuenow={50}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className='card-body d-flex align-items-end pt-0'>
                  <div className='d-flex align-items-center flex-column mt-3 w-100'>
                    <div className='d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2'>
                      <span>{`${success} เสร็จสมบูรณ์`}</span>
                      <span>{`${finishP}%`}</span>
                    </div>

                    <div className='h-8px mx-3 w-100 bg-white bg-opacity-50 rounded'>
                      <div
                        className='bg-white rounded h-8px'
                        role='progressbar'
                        style={{ width: `${finishP}%` }}
                        aria-valuenow={50}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <CardsWidget7
                className='h-md-50 mb-5 mb-xl-10'
                description='Professionals'
                icon={false}
                stats={357}
                labelColor='dark'
                textColor='gray-300'
              /> */}
            </div>
            {/* end::Col */}

            {/* begin::Col */}
            <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
              {/* <CardsWidget17 className='h-md-50 mb-5 mb-xl-10' /> */}
              {/* <ListsWidget26 className='h-lg-50' /> */}
            </div>
            {/* end::Col */}

            {/* begin::Col */}
            <div className='col-xxl-6'>
              {/* <EngageWidget10 className='h-md-100' /> */}
            </div>
            {/* end::Col */}
          </div>
          {/* end::Row */}

          {/* begin::Row */}
          <div className='row gx-5 gx-xl-10'>
            {/* begin::Col */}
            <div className='col-xxl-6 mb-5 mb-xl-10'>
              {/* <app-new-charts-widget8 cssclassName="h-xl-100" chartHeight="275px" [chartHeightNumber]="275"></app-new-charts-widget8> */}
            </div>
            {/* end::Col */}

            {/* begin::Col */}
            <div className='col-xxl-6 mb-5 mb-xl-10'>
              {/* <app-cards-widget18 cssclassName="h-xl-100" image="./assetsmedia/stock/600x600/img-65.jpg"></app-cards-widget18> */}
            </div>
            {/* end::Col */}
          </div>
          {/* end::Row */}

          {/* begin::Row */}
          <div className='row gy-5 gx-xl-8'>
            <div className='col-xxl-4'>
              {/* <ListsWidget3 className='card-xxl-stretch mb-xl-3' /> */}
            </div>
            <div className='col-xl-8'>
              {/* <TablesWidget10 className='card-xxl-stretch mb-5 mb-xl-8' /> */}
            </div>
          </div>
          {/* end::Row */}

          {/* begin::Row */}
          <div className='row gy-5 g-xl-8'>
            <div className='col-xl-4'>
              {/* <ListsWidget2 className='card-xl-stretch mb-xl-8' /> */}
            </div>
            <div className='col-xl-4'>
              {/* <ListsWidget6 className='card-xl-stretch mb-xl-8' /> */}
            </div>
            <div className='col-xl-4'>
              {/* <ListsWidget4 className='card-xl-stretch mb-5 mb-xl-8' items={5} /> */}
              {/* partials/widgets/lists/_widget-4', 'class' => 'card-xl-stretch mb-5 mb-xl-8', 'items' => '5' */}
            </div>
          </div>
          {/* end::Row */}

          <div className='row g-5 gx-xxl-8'>
            <div className='col-xxl-4'>
              {/* <MixedWidget8
                className='card-xxl-stretch mb-xl-3'
                chartColor='success'
                chartHeight='150px'
              /> */}
            </div>
            <div className='col-xxl-8'>
              {/* <TablesWidget5 className='card-xxl-stretch mb-5 mb-xxl-8' /> */}
            </div>
          </div>
        </Content>
      </>
    </>
  )
}

export { DashboardWrapper }
