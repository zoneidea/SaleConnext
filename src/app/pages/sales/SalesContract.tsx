// import styles from '@/styles/style.module.css'
// import { Link, useNavigate, useLocation } from 'react-router-dom'
// import axios from 'axios';
// import clsx from 'clsx'
// import { useState, useEffect, useRef } from 'react'
// import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
// import { getLayoutFromLocalStorage, ILayout, LayoutSetup } from '../../../_metronic/layout/core'
// import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
// import { Content } from '../../../_metronic/layout/components/content'
// import { TablesWidget5 } from '../../../_metronic/partials/widgets'
// import { useAuth } from '../../modules/auth/core/Auth';
// import SignaturePad from 'react-signature-pad-wrapper';
// import {
//   useUUIDStore,
//   useSaveProductStore,
//   useSaveDiscountStore,
//   useSaveCustomerStore,
//   useSaveAddressStore
// } from '../../modules/stores/stepsStore';

// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// interface ContractState {
//   contNo: string;
// }

// interface ItemProps {
//   REFNO: String,
//   CONTNO: String,
//   EMPID: String,
//   TEAMSALE: String,
//   SALECODE: String,
//   SUPEMPID: String,
//   SECEMPID: String,
//   STATUS: String,
//   PRODUCT: [any],
//   CUSTOMERSTATUS: [any],
//   DISCOUNT: [any],
//   CUSTOMERDETAIL: [any],
//   ADDRESS: [any],
//   PDPA: [any],
//   CONTRACT: [any],
//   IMAGE: [any],
//   CHECKERCOMMENT: [any]
// }

// const SalesContract: React.FC = () => {
//   const navigate = useNavigate()

//   // const location = useLocation();
//   // const contNo = (location.state as ContractState)?.contNo;
//   // console.log(`contNo`, contNo);

//   const { auth } = useAuth();
//   const EmpId = auth?.data?.[0]?.EmpId || '';
//   const TeamSale = auth?.data?.[0]?.TeamSale || '';
//   const SaleCode = auth?.data?.[0]?.SaleCode || '';
//   const SupEmpId = auth?.data?.[0]?.SupEmp || '';
//   const SecEmpId = auth?.data?.[0]?.SecEmp || '';

//   const { REFNO } = useUUIDStore();

//   const [draft, setDraft] = useState<any[]>([])
//   const [isLoading, setIsLoading] = useState<boolean>(false)

//   const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//   const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
//   const GET_ALL_CONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true)
//       try {
//         const response = await axios.get(GET_ALL_CONTRACT_URL)
//         // ตรวจสอบว่า response.data.data เป็น array หรือไม่
//         if (response.data?.data && Array.isArray(response.data.data)) {
//           setDraft(response.data.data)
//         }
//       } catch (error) {
//         console.error('Error fetching GetAllContract:', error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     fetchData()
//   }, [GET_ALL_CONTRACT_URL])

//   // ===== (5) หารายการที่มี REFNO ตรงกับ store =====
//   const matchedItem = draft.find((item) => item.REFNO === REFNO)
//   console.log('matchedItem =>', matchedItem)

//   const contNoNew = matchedItem?.CUSTOMERSTATUS?.[0]?.CONTNO;
//   // console.log('contNoNew', contNoNew); 

//   const currentDate = new Date();
//   const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

//   const { PRODUCT } = useSaveProductStore()
//   console.log(`PRODUCT`, PRODUCT[0]?.Package[0]?.PACKAGETYPEID);

//   const { DISCOUNT } = useSaveDiscountStore()
//   console.log(`DISCOUNT`, DISCOUNT);

//   const { saveCustomerTypes } = useSaveCustomerStore()
//   // console.log(`saveCustomerTypes`, saveCustomerTypes);

//   const { addressCard, addressInstallation, addressPayment, addressTax } = useSaveAddressStore()
//   // console.log(`addressCard`, addressCard)
//   // console.log(`addressInstallation`, addressInstallation)
//   // console.log(`addressPayment`, addressPayment)

//   const totalPrice = PRODUCT[0]?.Package[0]?.TOTALPRICE || 0;
//   const discountAmount = DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
//   const netPrice = totalPrice - discountAmount;

//   const signaturePadRef = useRef<any>(null);
//   const [signatureDataURL, setSignatureDataURL] = useState<string | null>(null);

//   const clearSignature = () => {
//     signaturePadRef.current?.clear();
//     setSignatureDataURL(null);
//   };

//   const saveSignature = () => {
//     if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
//       const dataUrl = signaturePadRef.current.toDataURL('image/png');
//       setSignatureDataURL(dataUrl.replace(/^data:image\/png;base64,/, ''));
//       signaturePadRef.current.clear();
//     } else {
//       Swal.fire('กรุณาลงชื่อก่อนบันทึก');
//     }
//   };

//   const handleNextClick = async () => {
//     try {
//       const updateContract = await axios.post(UPDATECONTACT, {
//         REFNO,
//         EMPID: EmpId,
//         TEAMSALE: TeamSale,
//         SALECODE: SaleCode,
//         SUPEMPID: SupEmpId,
//         SECEMPID: SecEmpId,
//         FIELD: "CONTRACT",
//         DATA: {
//           createdAt: formattedDate,
//           signature: signatureDataURL
//         }
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       // console.log(`updateContract CONTRACT: `, updateContract.data);

//       // แสดง SweetAlert2 หลังจากบันทึกสำเร็จ
//       Swal.fire({
//         icon: 'success',
//         title: 'สำเร็จ!',
//         text: 'บันทึกสัญญาเรียบร้อยแล้ว',
//         timer: 2000, // แสดงผล 3 วินาที
//         showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
//       }).then(() => {
//         navigate('/sale/photo'); // นำทางไปยังหน้าอื่นถ้าต้องการ
//       });

//     } catch (error) {
//       console.error('Error fetching CONTRACT:', error);

//       // แสดง SweetAlert2 เมื่อเกิดข้อผิดพลาด
//       Swal.fire({
//         icon: 'error',
//         title: 'เกิดข้อผิดพลาด!',
//         text: 'ไม่สามารถบันทึกสัญญาได้ กรุณาลองใหม่อีกครั้ง',
//         confirmButtonText: 'ตกลง'
//       });
//     }
//   };

//   return (
//     <>
//       <Content>
//         <div className='d-flex justify-content-between align-items-center my-5'>
//           <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
//             data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//             className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
//             <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
//               {PRODUCT[0]?.Package[0]?.PACKAGETYPEID === 1 ? (
//                 <span>ใบสัญญา</span>
//               ) : (
//                 <span>ใบสัญญาเช่าซื้อ</span>
//               )}

//             </h1>
//             <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//               <li className="breadcrumb-item text-muted">
//                 <span className="text-muted text-hover-primary">
//                   ระบบขาย
//                 </span></li>
//               <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
//               {PRODUCT[0]?.Package[0]?.PACKAGETYPEID === 1 ? (
//                 <li className="breadcrumb-item text-gray-900">ใบสัญญา</li>
//               ) : (
//                 <li className="breadcrumb-item text-gray-900">ใบสัญญาเช่าซื้อ</li>
//               )}
//             </ul>
//           </div>
//         </div>
//         <p className={`${styles.fontSize}`}>เลขที่ขาย:</p><p className={`${styles.titlePage}`}>{REFNO}</p>

//         {/* Card Body */}
//         <div className='card mb-10'>
//           <div className='card-body py-5'>

//             {/* begin::Header */}
//             <div className='d-flex justify-content-between align-items-center mb-7 mt-5'>
//               {PRODUCT[0]?.Package[0]?.PACKAGETYPEID == 1 ? (
//                 <h3 className='card-title'>ใบสัญญา</h3>
//               ) : (
//                 <h3 className='card-title'>ใบสัญญาเช่าซื้อ</h3>
//               )}
//               <button
//                 type='button'
//                 className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
//               >
//                 <KTIcon iconName='category' className='fs-2' />
//               </button>
//             </div>
//             {/* end::Header */}

//             <div className='row mb-7'>
//               <label className='col-lg-4 fw-bold text-muted'>วันที่ทำสัญญา</label>
//               <div className='col-lg-8'>
//                 <span className='fw-bolder fs-6 text-gray-900'>{formattedDate}</span>
//               </div>
//             </div>

//             <div className='row mb-7'>
//               <label className='col-lg-4 fw-bold text-muted'>เลขที่สัญญา</label>
//               <div className='col-lg-8 fv-row'>
//                 <span className='fw-bold fs-6'>{contNoNew}</span>
//               </div>
//             </div>

//             <div className='row mb-7'>
//               <label className='col-lg-4 fw-bold text-muted'>REFNO</label>
//               <div className='col-lg-8 fv-row'>
//                 <span className='fw-bold fs-6'>{REFNO}</span>
//               </div>
//             </div>

//             <div className='row mb-7'>
//               <label className='col-lg-4 fw-bold text-muted'>ชื่อ</label>
//               <div className='col-lg-8'>
//                 <a href='#' className='fw-bold fs-6 text-gray-900 text-hover-primary'>
//                   {saveCustomerTypes[0]?.PREFIX[0]?.PREFIXNAME} {saveCustomerTypes[0]?.CUSTOMERNAME}
//                 </a>
//               </div>
//             </div>

//             {saveCustomerTypes[0]?.CUSTOMERLASTNAME && (
//               <div className='row mb-7'>
//                 <label className='col-lg-4 fw-bold text-muted'>นามสกุล</label>
//                 <div className='col-lg-8'>
//                   <a href='#' className='fw-bold fs-6 text-gray-900 text-hover-primary'>
//                     {saveCustomerTypes[0]?.CUSTOMERLASTNAME}
//                   </a>
//                 </div>
//               </div>
//             )}

//             <div className='row mb-7'>
//               {saveCustomerTypes[0]?.CUSTOMERTYPE === "1" ? (
//                 <label className='col-lg-4 fw-bold text-muted'>เลขประจำตัวผู้เสียภาษี</label>
//               ) : (
//                 <label className='col-lg-4 fw-bold text-muted'>เลขที่บัตรประชาชน</label>
//               )}
//               <div className='col-lg-8'>
//                 <span className='fw-bolder fs-6 text-gray-900'>{saveCustomerTypes[0]?.CUSTOMERID}</span>
//               </div>
//             </div>

//             <div className='row mb-7'>
//               <label className='col-lg-4 fw-bold text-muted'>ที่อยู่บัตรประชาชน</label>
//               <div className='col-lg-8'>
//                 <span className='fw-bolder fs-6 text-gray-900'>
//                   {addressCard.ADDRESSNUMBER && `${addressCard.ADDRESSNUMBER}`}&nbsp;
//                   {addressCard.ADDRESSMOO && `หมู่ที่ ${addressCard.ADDRESSMOO}`}&nbsp;
//                   {addressCard.ADDRESSSOI && `ซอย ${addressCard.ADDRESSSOI}`}&nbsp;
//                   {addressCard.ADDRESSROAD && `ถนน ${addressCard.ADDRESSROAD}`}&nbsp;
//                   {addressCard.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${addressCard.ADDRESSSUBDISTRICTNAME}`}&nbsp;
//                   {addressCard.ADDRESSDISTRICTNAME && `อำเภอ ${addressCard.ADDRESSDISTRICTNAME}`}&nbsp;
//                   {addressCard.ADDRESSPROVINCENAME && `จังหวัด ${addressCard.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
//                   {addressCard.ADDRESSZIPCODE && `${addressCard.ADDRESSZIPCODE}`}&nbsp;
//                 </span>
//               </div>
//             </div>

//             <div className='row mb-10'>
//               <label className='col-lg-4 fw-bold text-muted'>ที่อยู่ติดตั้ง</label>
//               <div className='col-lg-8'>
//                 <span className='fw-bolder fs-6 text-gray-900'>
//                   {addressInstallation.ADDRESSNUMBER}&nbsp;
//                   {addressInstallation.ADDRESSMOO && `หมู่ที่ ${addressInstallation.ADDRESSMOO}`}&nbsp;
//                   {addressInstallation.ADDRESSSOI && `ซอย ${addressInstallation.ADDRESSSOI}`}&nbsp;
//                   {addressInstallation.ADDRESSROAD && `ถนน ${addressInstallation.ADDRESSROAD}`}&nbsp;
//                   {addressInstallation.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${addressInstallation.ADDRESSSUBDISTRICTNAME}`}&nbsp;
//                   {addressInstallation.ADDRESSDISTRICTNAME && `อำเภอ ${addressInstallation.ADDRESSDISTRICTNAME}`}&nbsp;
//                   {addressInstallation.ADDRESSPROVINCENAME && `จังหวัด ${addressInstallation.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
//                   {addressInstallation.ADDRESSZIPCODE && `${addressInstallation.ADDRESSZIPCODE}`}&nbsp;
//                 </span>
//               </div>
//             </div>

//             <div className='row mb-10'>
//               <label className='col-lg-4 fw-bold text-muted'>ที่อยู่เก็บเงิน</label>
//               <div className='col-lg-8'>
//                 <span className='fw-bolder fs-6 text-gray-900'>
//                   {addressPayment.ADDRESSNUMBER}&nbsp;
//                   {addressPayment.ADDRESSMOO && `หมู่ที่ ${addressPayment.ADDRESSMOO}`}&nbsp;
//                   {addressPayment.ADDRESSSOI && `ซอย ${addressPayment.ADDRESSSOI}`}&nbsp;
//                   {addressPayment.ADDRESSROAD && `ถนน ${addressPayment.ADDRESSROAD}`}&nbsp;
//                   {addressPayment.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${addressPayment.ADDRESSSUBDISTRICTNAME}`}&nbsp;
//                   {addressPayment.ADDRESSDISTRICTNAME && `อำเภอ ${addressPayment.ADDRESSDISTRICTNAME}`}&nbsp;
//                   {addressPayment.ADDRESSPROVINCENAME && `จังหวัด ${addressPayment.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
//                   {addressPayment.ADDRESSZIPCODE && `${addressPayment.ADDRESSZIPCODE}`}&nbsp;
//                 </span>
//               </div>
//             </div>

//             {addressTax.ADDRESSPROVINCENAME && (
//               <div className='row mb-10'>
//                 <label className='col-lg-4 fw-bold text-muted'>ที่อยู่เสึยภาษี</label>
//                 <div className='col-lg-8'>
//                   <span className='fw-bolder fs-6 text-gray-900'>
//                     {addressTax.ADDRESSNUMBER}&nbsp;
//                     {addressTax.ADDRESSMOO && `หมู่ที่ ${addressTax.ADDRESSMOO}`}&nbsp;
//                     {addressTax.ADDRESSSOI && `ซอย ${addressTax.ADDRESSSOI}`}&nbsp;
//                     {addressTax.ADDRESSROAD && `ถนน ${addressTax.ADDRESSROAD}`}&nbsp;
//                     {addressTax.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${addressTax.ADDRESSSUBDISTRICTNAME}`}&nbsp;
//                     {addressTax.ADDRESSDISTRICTNAME && `อำเภอ ${addressTax.ADDRESSDISTRICTNAME}`}&nbsp;
//                     {addressTax.ADDRESSPROVINCENAME && `จังหวัด ${addressTax.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
//                     {addressTax.ADDRESSZIPCODE && `${addressTax.ADDRESSZIPCODE}`}&nbsp;
//                   </span>
//                 </div>
//               </div>
//             )}

//             <div className='row mb-10'>
//               <label className='col-lg-4 fw-bold text-muted'>เบอร์โทรติดต่อ</label>
//               <div className='col-lg-8'>
//                 <span className='fw-bold fs-6'>{saveCustomerTypes[0]?.CUSTOMERMOBILE}</span>
//               </div>
//             </div>

//             <div className='row mb-10'>
//               <label className='col-lg-4 fw-bold text-muted'>สินค้า</label>
//               <div className='col-lg-8'>
//                 <span className='fw-bold fs-6'>{PRODUCT[0]?.ItemDescription}</span>
//               </div>
//             </div>

//             {PRODUCT[0]?.Package?.[0]?.PACKAGETITLE && (
//               <div className='row mb-10'>
//                 <label className='col-lg-4 fw-bold text-muted'>แพ็คเกจ</label>
//                 <div className='col-lg-8'>
//                   <span className='fw-bold fs-6'>{PRODUCT[0]?.Package[0]?.PACKAGETITLE}</span>
//                 </div>
//               </div>
//             )}

//             {DISCOUNT[0]?.GIFT?.GIFTNAME && (
//               <div className='row align-items-center mb-10'>
//                 <label className='col-lg-4 fw-bold text-muted mb-0'>ของแถม</label>
//                 <div className='col-lg-8 d-flex justify-content-between'>
//                   <span className='fw-bold fs-6'>
//                     {DISCOUNT[0]?.GIFT?.GIFTNAME ? DISCOUNT[0]?.GIFT?.GIFTNAME : "ไม่มี"}
//                   </span>
//                 </div>
//               </div>
//             )}

//             {PRODUCT[0]?.Package?.[0]?.TOTALPRICE && (
//               <div className='row align-items-center mb-10'>
//                 <label className='col-lg-4 fw-bold text-muted mb-0'>ราคาสินค้า</label>
//                 <div className='col-lg-8 d-flex justify-content-between'>
//                   <span className='fw-bold fs-6'>{(PRODUCT[0]?.Package[0]?.TOTALPRICE).toLocaleString()}</span>
//                   <span className='badge badge-light-success'>บาท</span>
//                 </div>
//               </div>
//             )}

//             {DISCOUNT[0] && DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME && (
//               <div className='row align-items-center mb-10'>
//                 <label className='col-lg-4 fw-bold text-muted mb-0'>เครื่องเทิร์น</label>
//                 <div className='col-lg-8 d-flex justify-content-between'>
//                   <span className='fw-bold fs-6'>
//                     {DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME ? DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME : "ไม่มี"}
//                   </span>
//                 </div>
//               </div>
//             )}

//             {DISCOUNT[0]?.DISCOUNTAMOUNT && (
//               <div className='row align-items-center mb-10'>
//                 <label className='col-lg-4 fw-bold text-muted mb-0'>ส่วนลด</label>
//                 <div className='col-lg-8 d-flex justify-content-between'>
//                   <span className='fw-bold fs-6'>
//                     {DISCOUNT[0]?.DISCOUNTAMOUNT ? (DISCOUNT[0]?.DISCOUNTAMOUNT).toLocaleString() : "ไม่มี"}
//                   </span>
//                   <span className='badge badge-light-success'>บาท</span>
//                 </div>
//               </div>
//             )}

//             <div className='row align-items-center mb-10'>
//               <label className='col-lg-4 fw-bold text-muted mb-0'>ราคาสุทธิ</label>
//               <div className='col-lg-8 d-flex justify-content-between'>
//                 <span className='fw-bold fs-6'>{(netPrice).toLocaleString()}</span>
//                 <span className='badge badge-light-success'>บาท</span>
//               </div>
//             </div>

//             {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
//             {PRODUCT[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
//               <>
//                 <div className='row align-items-center mb-10'>
//                   <label className='col-lg-4 fw-bold text-muted mb-0'>งวดที่ 1 ที่ต้องชำระ</label>
//                   <div className='col-lg-8 d-flex justify-content-between'>
//                     <span className='fw-bold fs-6'>{(PRODUCT[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT - discountAmount).toLocaleString()}</span>
//                     <span className='badge badge-light-success'>บาท</span>
//                   </div>
//                 </div>

//                 {PRODUCT[0]?.Package[0]?.PERIODDETAILS.length > 1 && (
//                   <div className='row align-items-center mb-10'>
//                     <label className='col-lg-4 fw-bold text-muted mb-0'>งวดที่ 2 ถึง {PRODUCT[0]?.Package[0]?.PERIODDETAILS.length} ต้องชำระงวดละ</label>
//                     <div className='col-lg-8 d-flex justify-content-between'>
//                       <span className='fw-bold fs-6'>{(PRODUCT[0]?.Package[0]?.PERIODDETAILS[1]?.PAYMENTAMOUNT).toLocaleString()}</span>
//                       <span className='badge badge-light-success'>บาท</span>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}

//             {/* --------------------- ลายเซ็น --------------------- */}
//             <div
//               className="mb-5"
//               style={{ maxWidth: 600, margin: '0 auto' /* จับกลาง และไม่ให้กว้างเกิน 600px */ }}
//             >
//               {/* กล่องใส่ SignaturePad */}
//               <div
//                 style={{
//                   border: '1px solid #d7dbde',
//                   borderRadius: 4,
//                   width: '100%',
//                   height: 200,
//                   overflow: 'hidden',
//                 }}
//               >
//                 <SignaturePad
//                   ref={signaturePadRef}
//                   options={{ minWidth: 1, maxWidth: 3, penColor: 'black' }}
//                   canvasProps={{
//                     style: { width: '100%', height: '100%' },
//                   }}
//                 />
//               </div>

//               {/* ปุ่มลบ/บันทึกลายเซ็น */}
//               <div className="mt-2">
//                 <button
//                   type="button"
//                   className="btn btn-danger me-2"
//                   onClick={clearSignature}
//                 >
//                   ลบลายเซ็น
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={saveSignature}
//                 >
//                   บันทึกลายเซ็น
//                 </button>
//               </div>

//               {/* แสดงภาพลายเซ็นที่บันทึกไว้ (จำกัดขนาดด้วย Bootstrap .img-fluid) */}
//               {signatureDataURL && (
//                 <div className="mt-3">
//                   <img
//                     src={`data:image/png;base64,${signatureDataURL}`}
//                     alt="signature"
//                     className="img-fluid"
//                   />
//                 </div>
//               )}
//             </div>
//             {/* ------------------- จบลายเซ็น --------------------- */}

//           </div>
//         </div>
//         {/* End Card Body */}

//         <div className='d-none d-xl-flex justify-content-end align-items-center mt-5 mb-10'>
//           <button
//             className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'
//             type='button'
//             onClick={handleNextClick}
//           >
//             บันทึกสัญญา
//           </button>
//         </div>

//         {/* ปุ่มในหน้าจอเล็ก */}
//         <div
//           className="d-flex d-xl-none justify-content-end align-items-center bg-light p-3 border-top"
//           style={{
//             position: "fixed",
//             bottom: 0,
//             left: 0,
//             right: 0,
//             zIndex: 1050,
//           }}
//         >
//           <button
//             className="btn btn-primary w-auto me-2"
//             onClick={handleNextClick}
//           >
//             บันทึกสัญญา
//           </button>
//         </div>

//       </Content>
//     </>
//   )
// }

// export default SalesContract



import styles from '@/styles/style.module.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios';
import clsx from 'clsx'
import { useState, useEffect, useRef } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { getLayoutFromLocalStorage, ILayout, LayoutSetup } from '../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'
import { TablesWidget5 } from '../../../_metronic/partials/widgets'
import { useAuth } from '../../modules/auth/core/Auth';
import SignaturePad from 'react-signature-pad-wrapper';
import {
  useUUIDStore,
  useSaveProductStore,
  useSaveDiscountStore,
  useSaveCustomerStore,
  useSaveAddressStore
} from '../../modules/stores/stepsStore';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface ContractState {
  contNo: string;
}

interface ItemProps {
  REFNO: String,
  CONTNO: String,
  EMPID: String,
  TEAMSALE: String,
  SALECODE: String,
  SUPEMPID: String,
  SECEMPID: String,
  STATUS: String,
  PRODUCT: [any],
  CUSTOMERSTATUS: [any],
  DISCOUNT: [any],
  CUSTOMERDETAIL: [any],
  ADDRESS: [any],
  PDPA: [any],
  CONTRACT: [any],
  IMAGE: [any],
  CHECKERCOMMENT: [any]
}

const SalesContract: React.FC = () => {
  const navigate = useNavigate()

  // const location = useLocation();
  // const contNo = (location.state as ContractState)?.contNo;
  // console.log(`contNo`, contNo);

  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || '';
  const TeamSale = auth?.data?.[0]?.TeamSale || '';
  const SaleCode = auth?.data?.[0]?.SaleCode || '';
  const SupEmpId = auth?.data?.[0]?.SupEmp || '';
  const SecEmpId = auth?.data?.[0]?.SecEmp || '';

  const { REFNO } = useUUIDStore();

  const [draft, setDraft] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
  const GET_ALL_CONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(GET_ALL_CONTRACT_URL)
        // ตรวจสอบว่า response.data.data เป็น array หรือไม่
        if (response.data?.data && Array.isArray(response.data.data)) {
          setDraft(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching GetAllContract:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [GET_ALL_CONTRACT_URL])

  // ===== (5) หารายการที่มี REFNO ตรงกับ store =====
  const matchedItem = draft.find((item) => item.REFNO === REFNO)
  console.log('matchedItem =>', matchedItem)

  const contNoNew = matchedItem?.CUSTOMERSTATUS?.[0]?.CONTNO;
  // console.log('contNoNew', contNoNew); 

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

  const { PRODUCT } = useSaveProductStore()
  console.log(`PRODUCT`, PRODUCT[0]?.Package[0]?.PACKAGETYPEID);

  const { DISCOUNT } = useSaveDiscountStore()
  console.log(`DISCOUNT`, DISCOUNT);

  const { saveCustomerTypes } = useSaveCustomerStore()
  // console.log(`saveCustomerTypes`, saveCustomerTypes);

  const { addressCard, addressInstallation, addressPayment, addressTax } = useSaveAddressStore()
  // console.log(`addressCard`, addressCard)
  // console.log(`addressInstallation`, addressInstallation)
  // console.log(`addressPayment`, addressPayment)

  const totalPrice = PRODUCT[0]?.Package[0]?.TOTALPRICE || 0;
  const discountAmount = DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
  const netPrice = totalPrice - discountAmount;

  const signaturePadRef = useRef<any>(null);
  const [signatureDataURL, setSignatureDataURL] = useState<string | null>(null);

  const clearSignature = () => {
    signaturePadRef.current?.clear();
    setSignatureDataURL(null);
  };

  const saveSignature = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const dataUrl = signaturePadRef.current.toDataURL('image/png');
      setSignatureDataURL(dataUrl.replace(/^data:image\/png;base64,/, ''));
      signaturePadRef.current.clear();
    } else {
      Swal.fire('กรุณาลงชื่อก่อนบันทึก');
    }
  };

  const handleNextClick = async () => {
    try {
      const updateContract = await axios.post(UPDATECONTACT, {
        REFNO,
        EMPID: EmpId,
        TEAMSALE: TeamSale,
        SALECODE: SaleCode,
        SUPEMPID: SupEmpId,
        SECEMPID: SecEmpId,
        FIELD: "CONTRACT",
        DATA: {
          createdAt: formattedDate,
          signature: signatureDataURL
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // console.log(`updateContract CONTRACT: `, updateContract.data);

      // แสดง SweetAlert2 หลังจากบันทึกสำเร็จ
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'บันทึกสัญญาเรียบร้อยแล้ว',
        timer: 2000, // แสดงผล 3 วินาที
        showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
      }).then(() => {
        navigate('/sale/photo'); // นำทางไปยังหน้าอื่นถ้าต้องการ
      });

    } catch (error) {
      console.error('Error fetching CONTRACT:', error);

      // แสดง SweetAlert2 เมื่อเกิดข้อผิดพลาด
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถบันทึกสัญญาได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  return (
    <>
      <Content>
        <div className='d-flex justify-content-between align-items-center my-5'>
          <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
            data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
            className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
            <div className={`breadcrumb-item ${styles.titlePage}`}>
              <span>ใบสัญญาเช่าซื้อ</span>
            </div>
          </div>
        </div>
        <p className={`${styles.fontSize}`}>เลขที่ขาย:</p><p className={`${styles.titlePage}`}>{REFNO}</p>

        {/* Card Body */}
        <div className='card mb-10'>
          <div className='card-body py-5'>

            <div className='row mb-7'>
              <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>วันที่ทำสัญญา</label>
              <div className='col-lg-8'>
                <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>{formattedDate}</span>
              </div>
            </div>

            {/* <div className='row mb-7'>
              <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>เลขที่สัญญา</label>
              <div className='col-lg-8 fv-row'>
                <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>{contNoNew}</span>
              </div>
            </div> */}

            <div className='row mb-7'>
              <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>REFNO</label>
              <div className='col-lg-8 fv-row'>
                <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>{REFNO}</span>
              </div>
            </div>

            <div className='row mb-7'>
              <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>ชื่อ</label>
              <div className='col-lg-8'>
                <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                  {saveCustomerTypes[0]?.PREFIX[0]?.PREFIXNAME} {saveCustomerTypes[0]?.CUSTOMERNAME}
                </span>
              </div>
            </div>

            {saveCustomerTypes[0]?.CUSTOMERLASTNAME && (
              <div className='row mb-7'>
                <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>นามสกุล</label>
                <div className='col-lg-8'>
                  <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                    {saveCustomerTypes[0]?.CUSTOMERLASTNAME}
                  </span>
                </div>
              </div>
            )}

            <div className='row mb-7'>
              {saveCustomerTypes[0]?.CUSTOMERTYPE === "1" ? (
                <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>เลขประจำตัวผู้เสียภาษี</label>
              ) : (
                <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>เลขที่บัตรประชาชน</label>
              )}
              <div className='col-lg-8'>
                <span className='fw-bolder fs-6 text-gray-900'>{saveCustomerTypes[0]?.CUSTOMERID}</span>
              </div>
            </div>

            <div className='row mb-7'>
              <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>ที่อยู่บัตรประชาชน</label>
              <div className='col-lg-8'>
                <span className='fw-bolder fs-6 text-gray-900'>
                  {addressCard.ADDRESSNUMBER && `${addressCard.ADDRESSNUMBER}`}&nbsp;
                  {addressCard.ADDRESSMOO && `หมู่ที่ ${addressCard.ADDRESSMOO}`}&nbsp;
                  {addressCard.ADDRESSSOI && `ซอย ${addressCard.ADDRESSSOI}`}&nbsp;
                  {addressCard.ADDRESSROAD && `ถนน ${addressCard.ADDRESSROAD}`}&nbsp;
                  {addressCard.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${addressCard.ADDRESSSUBDISTRICTNAME}`}&nbsp;
                  {addressCard.ADDRESSDISTRICTNAME && `อำเภอ ${addressCard.ADDRESSDISTRICTNAME}`}&nbsp;
                  {addressCard.ADDRESSPROVINCENAME && `จังหวัด ${addressCard.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
                  {addressCard.ADDRESSZIPCODE && `${addressCard.ADDRESSZIPCODE}`}&nbsp;
                </span>
              </div>
            </div>

            <div className='row mb-10'>
              <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>ที่อยู่ติดตั้ง</label>
              <div className='col-lg-8'>
                <span className='fw-bolder fs-6 text-gray-900'>
                  {addressInstallation.ADDRESSNUMBER}&nbsp;
                  {addressInstallation.ADDRESSMOO && `หมู่ที่ ${addressInstallation.ADDRESSMOO}`}&nbsp;
                  {addressInstallation.ADDRESSSOI && `ซอย ${addressInstallation.ADDRESSSOI}`}&nbsp;
                  {addressInstallation.ADDRESSROAD && `ถนน ${addressInstallation.ADDRESSROAD}`}&nbsp;
                  {addressInstallation.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${addressInstallation.ADDRESSSUBDISTRICTNAME}`}&nbsp;
                  {addressInstallation.ADDRESSDISTRICTNAME && `อำเภอ ${addressInstallation.ADDRESSDISTRICTNAME}`}&nbsp;
                  {addressInstallation.ADDRESSPROVINCENAME && `จังหวัด ${addressInstallation.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
                  {addressInstallation.ADDRESSZIPCODE && `${addressInstallation.ADDRESSZIPCODE}`}&nbsp;
                </span>
              </div>
            </div>

            <div className='row mb-10'>
              <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>ที่อยู่เก็บเงิน</label>
              <div className='col-lg-8'>
                <span className='fw-bolder fs-6 text-gray-900'>
                  {addressPayment.ADDRESSNUMBER}&nbsp;
                  {addressPayment.ADDRESSMOO && `หมู่ที่ ${addressPayment.ADDRESSMOO}`}&nbsp;
                  {addressPayment.ADDRESSSOI && `ซอย ${addressPayment.ADDRESSSOI}`}&nbsp;
                  {addressPayment.ADDRESSROAD && `ถนน ${addressPayment.ADDRESSROAD}`}&nbsp;
                  {addressPayment.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${addressPayment.ADDRESSSUBDISTRICTNAME}`}&nbsp;
                  {addressPayment.ADDRESSDISTRICTNAME && `อำเภอ ${addressPayment.ADDRESSDISTRICTNAME}`}&nbsp;
                  {addressPayment.ADDRESSPROVINCENAME && `จังหวัด ${addressPayment.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
                  {addressPayment.ADDRESSZIPCODE && `${addressPayment.ADDRESSZIPCODE}`}&nbsp;
                </span>
              </div>
            </div>

            {addressTax.ADDRESSPROVINCENAME && (
              <div className='row mb-10'>
                <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>ที่อยู่เสึยภาษี</label>
                <div className='col-lg-8'>
                  <span className='fw-bolder fs-6 text-gray-900'>
                    {addressTax.ADDRESSNUMBER}&nbsp;
                    {addressTax.ADDRESSMOO && `หมู่ที่ ${addressTax.ADDRESSMOO}`}&nbsp;
                    {addressTax.ADDRESSSOI && `ซอย ${addressTax.ADDRESSSOI}`}&nbsp;
                    {addressTax.ADDRESSROAD && `ถนน ${addressTax.ADDRESSROAD}`}&nbsp;
                    {addressTax.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${addressTax.ADDRESSSUBDISTRICTNAME}`}&nbsp;
                    {addressTax.ADDRESSDISTRICTNAME && `อำเภอ ${addressTax.ADDRESSDISTRICTNAME}`}&nbsp;
                    {addressTax.ADDRESSPROVINCENAME && `จังหวัด ${addressTax.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
                    {addressTax.ADDRESSZIPCODE && `${addressTax.ADDRESSZIPCODE}`}&nbsp;
                  </span>
                </div>
              </div>
            )}

            <div className='row mb-10'>
              <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>เบอร์โทรติดต่อ</label>
              <div className='col-lg-8'>
                <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>{saveCustomerTypes[0]?.CUSTOMERMOBILE}</span>
              </div>
            </div>

            <div className='row mb-10'>
              <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>สินค้า</label>
              <div className='col-lg-8'>
                <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>{PRODUCT[0]?.ItemDescription}</span>
              </div>
            </div>

            {PRODUCT[0]?.Package?.[0]?.PACKAGETITLE && (
              <div className='row mb-10'>
                <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>แพ็คเกจ</label>
                <div className='col-lg-8'>
                  <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>{PRODUCT[0]?.Package[0]?.PACKAGETITLE}</span>
                </div>
              </div>
            )}

            {DISCOUNT[0]?.GIFT?.GIFTNAME && (
              <div className='row align-items-center mb-10'>
                <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>ของแถม</label>
                <div className='col-lg-8 d-flex justify-content-between'>
                  <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                    {DISCOUNT[0]?.GIFT?.GIFTNAME ? DISCOUNT[0]?.GIFT?.GIFTNAME : "ไม่มี"}
                  </span>
                </div>
              </div>
            )}

            {PRODUCT[0]?.Package?.[0]?.TOTALPRICE && (
              <div className='row align-items-center mb-10'>
                <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>ราคาสินค้า</label>
                <div className='col-lg-8 d-flex justify-content-between'>
                  <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                    {(PRODUCT[0]?.Package[0]?.TOTALPRICE).toLocaleString()}
                  </span>
                  <span className='badge badge-light-success'>บาท</span>
                </div>
              </div>
            )}

            {DISCOUNT[0] && DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME && (
              <div className='row align-items-center mb-10'>
                <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>เครื่องเทิร์น</label>
                <div className='col-lg-8 d-flex justify-content-between'>
                  <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                    {DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME ? DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME : "ไม่มี"}
                  </span>
                </div>
              </div>
            )}

            {DISCOUNT[0]?.DISCOUNTAMOUNT && (
              <div className='row align-items-center mb-10'>
                <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>ส่วนลด</label>
                <div className='col-lg-8 d-flex justify-content-between'>
                  <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                    {DISCOUNT[0]?.DISCOUNTAMOUNT ? (DISCOUNT[0]?.DISCOUNTAMOUNT).toLocaleString() : "ไม่มี"}
                  </span>
                  <span className='badge badge-light-success'>บาท</span>
                </div>
              </div>
            )}

            <div className='row align-items-center mb-10'>
              <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>ราคาสุทธิ</label>
              <div className='col-lg-8 d-flex justify-content-between'>
                <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>{(netPrice).toLocaleString()}</span>
                <span className='badge badge-light-success'>บาท</span>
              </div>
            </div>

            {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
            {PRODUCT[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
              <>
                <div className='row align-items-center mb-10'>
                  <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>งวดที่ 1 ที่ต้องชำระ</label>
                  <div className='col-lg-8 d-flex justify-content-between'>
                    <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                      {(PRODUCT[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT - discountAmount).toLocaleString()}
                    </span>
                    <span className='badge badge-light-success'>บาท</span>
                  </div>
                </div>

                {PRODUCT[0]?.Package[0]?.PERIODDETAILS.length > 1 && (
                  <div className='row align-items-center mb-10'>
                    <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                      งวดที่ 2 ถึง {PRODUCT[0]?.Package[0]?.PERIODDETAILS.length} ต้องชำระงวดละ
                    </label>
                    <div className='col-lg-8 d-flex justify-content-between'>
                      <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                        {(PRODUCT[0]?.Package[0]?.PERIODDETAILS[1]?.PAYMENTAMOUNT).toLocaleString()}
                      </span>
                      <span className='badge badge-light-success'>บาท</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* --------------------- ลายเซ็น --------------------- */}
            <div
              className="mb-5"
              style={{ maxWidth: 600, margin: '0 auto' /* จับกลาง และไม่ให้กว้างเกิน 600px */ }}
            >
              {/* กล่องใส่ SignaturePad */}
              <div
                style={{
                  border: '1px solid #d7dbde',
                  borderRadius: 4,
                  width: '100%',
                  height: 200,
                  overflow: 'hidden',
                }}
              >
                <SignaturePad
                  ref={signaturePadRef}
                  options={{ minWidth: 1, maxWidth: 3, penColor: 'black' }}
                  canvasProps={{
                    style: { width: '100%', height: '100%' },
                  }}
                />
              </div>

              {/* ปุ่มลบ/บันทึกลายเซ็น */}
              <div className="mt-2">
                <button
                  type="button"
                  className="btn btn-danger me-2"
                  onClick={clearSignature}
                >
                  ลบลายเซ็น
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={saveSignature}
                >
                  บันทึกลายเซ็น
                </button>
              </div>

              {/* แสดงภาพลายเซ็นที่บันทึกไว้ (จำกัดขนาดด้วย Bootstrap .img-fluid) */}
              {signatureDataURL && (
                <div className="mt-3">
                  <img
                    src={`data:image/png;base64,${signatureDataURL}`}
                    alt="signature"
                    className="img-fluid"
                  />
                </div>
              )}
            </div>
            {/* ------------------- จบลายเซ็น --------------------- */}

          </div>
        </div>
        {/* End Card Body */}

        <div className='d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10'>
          {/* <button
            className={`${styles.btnSecondary}`}
            onClick={handleNextClick}
          >
            ย้อนกลับ
          </button> */}
          <button
            className={`${styles.btnPrimary}`}
            type='button'
            onClick={handleNextClick}
          >
            บันทึกสัญญา
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
          {/* <button
            className={`${styles.btnSecondary}`}
            onClick={handleNextClick}
          >
            ย้อนกลับ
          </button> */}
          <button
            className={`${styles.btnPrimary}`}
            onClick={handleNextClick}
          >
            บันทึกสัญญา
          </button>
        </div>

      </Content>
    </>
  )
}

export default SalesContract