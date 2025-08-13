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
//   const location = useLocation();
//   // const contNo = (location.state as ContractState)?.contNo;
//   // console.log(`contNo`, contNo);
//   const matchedItem = location.state as ItemProps
//   console.log(`matchedItem`, matchedItem);

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
//   // const matchedItem = draft.find((item) => item.REFNO === REFNO)
//   // console.log('matchedItem =>', matchedItem)

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

//   const totalPrice = matchedItem?.PRODUCT[0]?.Package[0]?.TOTALPRICE || 0;
//   const discountAmount = matchedItem?.DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
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

//   // const handleNextClick = async () => {
//   //   try {
//   //     const updateContract = await axios.post(UPDATECONTACT, {
//   //       REFNO,
//   //       EMPID: EmpId,
//   //       TEAMSALE: TeamSale,
//   //       SALECODE: SaleCode,
//   //       SUPEMPID: SupEmpId,
//   //       SECEMPID: SecEmpId,
//   //       FIELD: "CONTRACT",
//   //       DATA: {
//   //         createdAt: formattedDate,
//   //         signature: signatureDataURL
//   //       }
//   //     }, {
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //     });

//   //     // console.log(`updateContract CONTRACT: `, updateContract.data);

//   //     // แสดง SweetAlert2 หลังจากบันทึกสำเร็จ
//   //     Swal.fire({
//   //       icon: 'success',
//   //       title: 'สำเร็จ!',
//   //       text: 'บันทึกสัญญาเรียบร้อยแล้ว',
//   //       timer: 2000, // แสดงผล 3 วินาที
//   //       showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
//   //     }).then(() => {
//   //       // navigate('/sale/photo'); // นำทางไปยังหน้าอื่นถ้าต้องการ
//   //       navigate('/firstBill/CreateFirstBill', {
//   //         state: {
//   //           item: matchedItem,
//   //           from: location.pathname
//   //         }
//   //       });
//   //     });

//   //   } catch (error) {
//   //     console.error('Error fetching CONTRACT:', error);

//   //     // แสดง SweetAlert2 เมื่อเกิดข้อผิดพลาด
//   //     Swal.fire({
//   //       icon: 'error',
//   //       title: 'เกิดข้อผิดพลาด!',
//   //       text: 'ไม่สามารถบันทึกสัญญาได้ กรุณาลองใหม่อีกครั้ง',
//   //       confirmButtonText: 'ตกลง'
//   //     });
//   //   }
//   // };

//   const handleNextClick = async () => {
//     try {
//       // 1) อัปเดต FIELD = "CONTRACT"
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
//         headers: { 'Content-Type': 'application/json' },
//       });

//       // 2) ถ้าอัปเดตสัญญาสำเร็จ ให้เรียกอัปเดต STATUS → "FINISH"
//       if (updateContract.status === 200) {
//         const finishResponse = await axios.post(UPDATECONTACT, {
//           REFNO,
//           EMPID: EmpId,
//           TEAMSALE: TeamSale,
//           SALECODE: SaleCode,
//           SUPEMPID: SupEmpId,
//           SECEMPID: SecEmpId,
//           // FIELD: "STATUS",
//           // DATA: "FINISH"
//           FIELD: "PAYMENT",
//           DATA: "DRAFT"
//         }, {
//           headers: { 'Content-Type': 'application/json' },
//         });
//         console.log(`finishResponse`, finishResponse);

//         // 3) ถ้าอัปเดต STATUS สำเร็จ ถึงจะแสดง SweetAlert และ Navigate ต่อ
//         if (finishResponse.status === 200) {
//           Swal.fire({
//             icon: 'success',
//             title: 'สำเร็จ!',
//             text: 'บันทึกสัญญาเรียบร้อยแล้ว',
//             timer: 2000,
//             showConfirmButton: false,
//           }).then(() => {
//             // นำทางไปยัง CreateFirstBill (หรือเปลี่ยนเป็น '/sale/photo' ตามเงื่อนไข)
//             navigate('/firstBill/CreateFirstBill', {
//               state: {
//                 item: matchedItem,
//                 from: location.pathname
//               }
//             });
//           });
//         } else {
//           throw new Error('ไม่สามารถอัปเดตสถานะให้เป็น FINISH ได้');
//         }
//       } else {
//         throw new Error('ไม่สามารถอัปเดตสัญญาได้');
//       }

//     } catch (error) {
//       console.error('Error updating contract or status:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'เกิดข้อผิดพลาด!',
//         text: 'ไม่สามารถบันทึกสัญญาหรืออัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง',
//         confirmButtonText: 'ตกลง'
//       });
//     }
//   };

//   // ด้านบนของ component
//   const formatToBE = (isoDate?: string) => {
//     if (!isoDate) return '';
//     const d = new Date(isoDate);
//     const dd = String(d.getDate()).padStart(2, '0');
//     const mm = String(d.getMonth() + 1).padStart(2, '0');
//     const yyyy = d.getFullYear() + 543;
//     return `${dd}/${mm}/${yyyy}`;
//   };

//   return (
//     <>
//       <Content>
//         <div className='d-flex justify-content-between align-items-center my-5'>
//           <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
//             data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//             className="page-title d-flex flex-wrap me-3 flex-column justify-content-ceดnter">
//             <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//               {matchedItem?.PRODUCT[0]?.Package[0]?.PACKAGETYPEID == 1 ? (
//                 <li className={`breadcrumb-item ${styles.titlePage}`}>ใบสัญญา</li>
//               ) : (
//                 <li className={`breadcrumb-item ${styles.titlePage}`}>ใบสัญญาเช่าซื้อ</li>
//               )}
//             </ul>
//           </div>
//         </div>
//         <p className={`${styles.fontSize}`}>เลขที่ขาย:</p><p className={`${styles.titlePage}`}>{matchedItem?.REFNO}</p>

//         {/* Card Body */}
//         <div className='card mb-10'>
//           <div className='card-body py-5'>

//             <div className='row mb-7'>
//               <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>วันที่ทำสัญญา</label>
//               <div className='col-lg-8'>
//                 <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>{formatToBE(formattedDate)}</span>
//               </div>
//             </div>

//             {/* <div className='row mb-7'>
//               <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>เลขที่สัญญา</label>
//               <div className='col-lg-8 fv-row'>
//                 <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>{contNoNew}</span>
//               </div>
//             </div> */}

//             <div className='row mb-7'>
//               <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>REFNO</label>
//               <div className='col-lg-8 fv-row'>
//                 <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>{matchedItem?.REFNO}</span>
//               </div>
//             </div>

//             <div className='row mb-7'>
//               <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>ชื่อลูกค้า</label>
//               <div className='col-lg-8'>
//                 <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                   {/* {saveCustomerTypes[0]?.PREFIX[0]?.PREFIXNAME} {saveCustomerTypes[0]?.CUSTOMERNAME} */}
//                   {matchedItem?.CUSTOMERDETAIL[0]?.CUSTOMERNAME} {matchedItem?.CUSTOMERDETAIL[0]?.CUSTOMERLASTNAME}
//                 </span>
//               </div>
//             </div>

//             {matchedItem?.CUSTOMERDETAIL?.[0]?.CUSTOMERID?.length > 0 && (
//               <div className="row mb-7">
//                 <label className={`col-lg-4 text-muted ${styles.label}`}>
//                   {matchedItem.CUSTOMERDETAIL[0].CUSTOMERTYPE === "1"
//                     ? "เลขประจำตัวผู้เสียภาษี"
//                     : "เลขที่บัตรประชาชน"}
//                 </label>
//                 <div className="col-lg-8">
//                   <span className={styles.label}>
//                     {matchedItem.CUSTOMERDETAIL[0].CUSTOMERID}
//                   </span>
//                 </div>
//               </div>
//             )}

//             {matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER && (
//               <div className='row mb-10'>
//                 <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่ติดตั้ง</label>
//                 <div className='col-lg-8'>
//                   <span className={`${styles.label}`}>
//                     {matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER && `${matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSMOO && `หมู่ที่ ${matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSMOO}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSSOI && `ซอย ${matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSSOI}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSROAD && `ถนน ${matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSROAD}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME && `อำเภอ ${matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME && `จังหวัด ${matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE && `${matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE}`}&nbsp;
//                   </span>
//                 </div>
//               </div>
//             )}

//             {matchedItem?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSNUMBER && (
//               <div className='row mb-7'>
//                 <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่บัตรประชาชน</label>
//                 <div className='col-lg-8'>
//                   <span className={`${styles.label}`}>
//                     {matchedItem?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSNUMBER && `${matchedItem?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSNUMBER}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSMOO && `หมู่ที่ ${matchedItem?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSMOO}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSSOI && `ซอย ${matchedItem?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSSOI}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSROAD && `ถนน ${matchedItem?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSROAD}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${matchedItem?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSSUBDISTRICTNAME}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSDISTRICTNAME && `อำเภอ ${matchedItem?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSDISTRICTNAME}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME && `จังหวัด ${matchedItem?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSZIPCODE && `${matchedItem?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSZIPCODE}`}&nbsp;
//                   </span>
//                 </div>
//               </div>
//             )}

//             {matchedItem?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER && (
//               <div className='row mb-10'>
//                 <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่เก็บเงิน</label>
//                 <div className='col-lg-8'>
//                   <span className={`${styles.label}`}>
//                     {matchedItem?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER && `${matchedItem?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSMOO && `หมู่ที่ ${matchedItem?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSMOO}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSSOI && `ซอย ${matchedItem?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSSOI}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSROAD && `ถนน ${matchedItem?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSROAD}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${matchedItem?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSDISTRICTNAME && `อำเภอ ${matchedItem?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSDISTRICTNAME}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME && `จังหวัด ${matchedItem?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE && `${matchedItem?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE}`}&nbsp;
//                   </span>
//                 </div>
//               </div>
//             )}

//             {matchedItem?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME && (
//               <div className='row mb-10'>
//                 <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่เสึยภาษี</label>
//                 <div className='col-lg-8'>
//                   <span className={`${styles.label}`}>
//                     {matchedItem?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSNUMBER && `${matchedItem?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSNUMBER}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSMOO && `หมู่ที่ ${matchedItem?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSMOO}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSSOI && `ซอย ${matchedItem?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSSOI}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSROAD && `ถนน ${matchedItem?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSROAD}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${matchedItem?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSSUBDISTRICTNAME}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSDISTRICTNAME && `อำเภอ ${matchedItem?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSDISTRICTNAME}`}&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME && `จังหวัด ${matchedItem?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
//                     {matchedItem?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSZIPCODE && `${matchedItem?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSZIPCODE}`}&nbsp;
//                   </span>
//                 </div>
//               </div>
//             )}

//             < div className='row mb-10'>
//               <label className={`col-lg-4 text-muted ${styles.label}`}>เบอร์โทรติดต่อ</label>
//               <div className='col-lg-8'>
//                 <span className={`${styles.label}`}>
//                   {matchedItem?.CUSTOMERDETAIL[0]?.CUSTOMERMOBILE ?
//                     matchedItem?.CUSTOMERDETAIL[0]?.CUSTOMERMOBILE :
//                     matchedItem?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSPHONE}
//                 </span>
//               </div>
//             </div>

//             <div className='row mb-10'>
//               <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>สินค้า</label>
//               <div className='col-lg-8'>
//                 <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>{matchedItem?.PRODUCT[0]?.ItemDescription}</span>
//               </div>
//             </div>

//             {matchedItem?.PRODUCT[0]?.Package?.[0]?.PACKAGETITLE && (
//               <div className='row mb-10'>
//                 <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>แพ็คเกจ</label>
//                 <div className='col-lg-8'>
//                   <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>{matchedItem?.PRODUCT[0]?.Package[0]?.PACKAGETITLE}</span>
//                 </div>
//               </div>
//             )}

//             {matchedItem?.DISCOUNT[0]?.GIFT?.GIFTNAME && (
//               <div className='row align-items-center mb-10'>
//                 <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>ของแถม</label>
//                 <div className='col-lg-8 d-flex justify-content-between'>
//                   <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                     {matchedItem?.DISCOUNT[0]?.GIFT?.GIFTNAME ? matchedItem?.DISCOUNT[0]?.GIFT?.GIFTNAME : "ไม่มี"}
//                   </span>
//                 </div>
//               </div>
//             )}

//             {matchedItem?.PRODUCT[0]?.Package?.[0]?.TOTALPRICE && (
//               <div className='row align-items-center mb-10'>
//                 <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>ราคาสินค้า</label>
//                 <div className='col-lg-8 d-flex justify-content-between'>
//                   <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                     {(matchedItem?.PRODUCT[0]?.Package[0]?.TOTALPRICE).toLocaleString()}
//                   </span>
//                   <span className='badge badge-light-success'>บาท</span>
//                 </div>
//               </div>
//             )}

//             {matchedItem?.DISCOUNT[0] && matchedItem?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME && (
//               <div className='row align-items-center mb-10'>
//                 <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>เครื่องเทิร์น</label>
//                 <div className='col-lg-8 d-flex justify-content-between'>
//                   <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                     {matchedItem?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME ? matchedItem?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME : "ไม่มี"}
//                   </span>
//                 </div>
//               </div>
//             )}

//             {matchedItem?.DISCOUNT[0]?.DISCOUNTAMOUNT && (
//               <div className='row align-items-center mb-10'>
//                 <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>ส่วนลด</label>
//                 <div className='col-lg-8 d-flex justify-content-between'>
//                   <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                     {matchedItem?.DISCOUNT[0]?.DISCOUNTAMOUNT ? (matchedItem?.DISCOUNT[0]?.DISCOUNTAMOUNT).toLocaleString() : "ไม่มี"}
//                   </span>
//                   <span className='badge badge-light-success'>บาท</span>
//                 </div>
//               </div>
//             )}

//             <div className='row align-items-center mb-10'>
//               <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>ราคาสุทธิ</label>
//               <div className='col-lg-8 d-flex justify-content-between'>
//                 <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>{(netPrice).toLocaleString()}</span>
//                 <span className='badge badge-light-success'>บาท</span>
//               </div>
//             </div>

//             {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
//             {matchedItem?.PRODUCT[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
//               <>
//                 <div className='row align-items-center mb-10'>
//                   <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>งวดที่ 1 ที่ต้องชำระ</label>
//                   <div className='col-lg-8 d-flex justify-content-between'>
//                     <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                       {(matchedItem?.PRODUCT[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT - discountAmount).toLocaleString()}
//                     </span>
//                     <span className='badge badge-light-success'>บาท</span>
//                   </div>
//                 </div>

//                 {matchedItem?.PRODUCT[0]?.Package[0]?.PERIODDETAILS.length > 1 && (
//                   <div className='row align-items-center mb-10'>
//                     <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
//                       งวดที่ 2 ถึง {matchedItem?.PRODUCT[0]?.Package[0]?.PERIODDETAILS.length} ต้องชำระงวดละ
//                     </label>
//                     <div className='col-lg-8 d-flex justify-content-between'>
//                       <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                         {(matchedItem?.PRODUCT[0]?.Package[0]?.PERIODDETAILS[1]?.PAYMENTAMOUNT).toLocaleString()}
//                       </span>
//                       <span className='badge badge-light-success'>บาท</span>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}

//           </div>
//         </div>
//         {/* End Card Body */}

//         <div className='d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10'>
//           <button
//             className={`${styles.btnSecondary}`}
//             onClick={() =>
//               navigate('/sale/step', { state: matchedItem })
//             }
//           >
//             ย้อนกลับ
//           </button>
//           <button
//             className={`${styles.btnPrimary}`}
//             type='button'
//             onClick={handleNextClick}
//           >
//             บันทึกสัญญา
//           </button>
//         </div>

//         {/* ปุ่มในหน้าจอเล็ก */}
//         <div
//           className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
//           style={{
//             position: "fixed",
//             bottom: 0,
//             left: 0,
//             right: 0,
//             zIndex: 1050,
//           }}
//         >
//           <button
//             className={`${styles.btnSecondary}`}
//             onClick={() =>
//               navigate('/sale/step', { state: matchedItem })
//             }
//           >
//             ย้อนกลับ
//           </button>
//           <button
//             className={`${styles.btnPrimary}`}
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

// import styles from "@/styles/style.module.css";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import clsx from "clsx";
// import { useState, useEffect, useRef } from "react";
// import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers";
// import {
//   getLayoutFromLocalStorage,
//   ILayout,
//   LayoutSetup,
// } from "../../../_metronic/layout/core";
// import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
// import { Content } from "../../../_metronic/layout/components/content";
// import { TablesWidget5 } from "../../../_metronic/partials/widgets";
// import { useAuth } from "../../modules/auth/core/Auth";
// import SignaturePad from "react-signature-pad-wrapper";
// import {
//   useUUIDStore,
//   useSaveProductStore,
//   useSaveDiscountStore,
//   useSaveCustomerStore,
//   useSaveAddressStore,
// } from "../../modules/stores/stepsStore";

// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";

// interface ContractState {
//   contNo: string;
// }

// interface ItemProps {
//   REFNO: String;
//   CONTNO: String;
//   EMPID: String;
//   TEAMSALE: String;
//   SALECODE: String;
//   SUPEMPID: String;
//   SECEMPID: String;
//   STATUS: String;
//   PRODUCT: any[];
//   CUSTOMERSTATUS: any[];
//   DISCOUNT: any[];
//   CUSTOMERDETAIL: any[];
//   ADDRESS: any[];
//   PDPA: any[];
//   CONTRACT: any[];
//   IMAGE: any[];
//   CHECKERCOMMENT: any[];
//   SALEEMPLOYEE: any[];
//   NEWREFNO: String;
// }

// const SalesContract: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // รับ object ที่เราส่งมาจาก Step
//   const stepItem = location.state as ItemProps | undefined;
//   console.log(`stepItem`, stepItem);

//   const { auth } = useAuth();
//   const EmpId = auth?.data?.[0]?.EmpId || "";
//   const TeamSale = auth?.data?.[0]?.TeamSale || "";
//   const SaleCode = auth?.data?.[0]?.SaleCode || "";
//   const SupEmpId = auth?.data?.[0]?.SupEmp || "";
//   const SecEmpId = auth?.data?.[0]?.SecEmp || "";

//   const { REFNO } = useUUIDStore();

//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//   const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
//   const GET_ALL_CONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;

//   // fetch draft ถ้าไม่มี stepItem
//   const [draft, setDraft] = useState<ItemProps[]>([]);
//   useEffect(() => {
//     if (stepItem) return;
//     axios.get(GET_ALL_CONTRACT_URL).then((res) => {
//       if (Array.isArray(res.data.data)) setDraft(res.data.data);
//     });
//   }, [GET_ALL_CONTRACT_URL, stepItem]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axios.get(GET_ALL_CONTRACT_URL);
//         // ตรวจสอบว่า response.data.data เป็น array หรือไม่
//         if (response.data?.data && Array.isArray(response.data.data)) {
//           setDraft(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching GetAllContract:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, [GET_ALL_CONTRACT_URL]);

//   // ===== (5) หารายการที่มี REFNO ตรงกับ store =====
//   const matchedItem = draft.find((item) => item.REFNO === REFNO);
//   console.log("matchedItem =>", matchedItem);

//   // ถ้ามี stepItem เอา stepItem ก่อน ถ้าไม่มีเอา matchedItem
//   const data = stepItem || matchedItem || ({} as ItemProps);
//   console.log("data =>", data);

//   const contNoNew = matchedItem?.CUSTOMERSTATUS?.[0]?.CONTNO;
//   // console.log('contNoNew', contNoNew);

//   const currentDate = new Date();
//   const formattedDate = `${currentDate.getFullYear()}-${
//     currentDate.getMonth() + 1
//   }-${currentDate.getDate()}`;

//   const { PRODUCT } = useSaveProductStore();
//   // console.log(`PRODUCT`, PRODUCT[0]?.Package[0]?.PACKAGETYPEID);

//   const { DISCOUNT } = useSaveDiscountStore();
//   // console.log(`DISCOUNT`, DISCOUNT);

//   const { saveCustomerTypes } = useSaveCustomerStore();
//   // console.log(`saveCustomerTypes`, saveCustomerTypes);

//   const { addressCard, addressInstallation, addressPayment, addressTax } =
//     useSaveAddressStore();
//   // console.log(`addressCard`, addressCard)
//   // console.log(`addressInstallation`, addressInstallation)
//   // console.log(`addressPayment`, addressPayment)

//   const totalPrice = data?.PRODUCT[0]?.Package[0]?.TOTALPRICE || 0;
//   const discountAmount = data?.DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
//   const netPrice = totalPrice - discountAmount;

//   const signaturePadRef = useRef<any>(null);
//   const [signatureDataURL, setSignatureDataURL] = useState<string | null>(null);
//   const signatureSectionRef = useRef<HTMLDivElement>(null);
//   const scrollContainerRef = useRef<HTMLDivElement>(null);

//   // scroll หน้าจอลงมา หากมี signatureDataURL แล้ว
//   useEffect(() => {
//     if (signatureDataURL && signatureSectionRef.current) {
//       // หา position ของ element บน viewport
//       const rect = signatureSectionRef.current.getBoundingClientRect();
//       // คำนวณตำแหน่งบนหน้าทั้งหน้า (page)
//       const scrollY = rect.top + window.pageYOffset - 100; // -100 เพื่อเผื่อ header
//       window.scrollTo({ top: scrollY, behavior: "smooth" });
//     }
//   }, [signatureDataURL]);

//   // ปุ่มลบลายเซ็น
//   const clearSignature = () => {
//     signaturePadRef.current?.clear();
//     setSignatureDataURL(null);
//   };

//   const saveSignature = () => {
//     if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
//       const dataUrl = signaturePadRef.current.toDataURL("image/png");
//       setSignatureDataURL(dataUrl.replace(/^data:image\/png;base64,/, ""));
//       signaturePadRef.current.clear();
//     } else {
//       Swal.fire("กรุณาลงชื่อก่อนบันทึก");
//     }
//   };

//   const handleNextClick = async () => {
//     try {
//       //1) อัปเดต FIELD = "CONTRACT"
//       const updateContract = await axios.post(
//         UPDATECONTACT,
//         {
//           REFNO: data?.REFNO,
//           EMPID: EmpId,
//           TEAMSALE: TeamSale,
//           SALECODE: SaleCode,
//           SUPEMPID: SupEmpId,
//           SECEMPID: SecEmpId,
//           FIELD: "CONTRACT",
//           DATA: {
//             createdAt: formattedDate,
//             signature: signatureDataURL,
//           },
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       if (updateContract.status === 200) {
//         const finishResponse = await axios.post(
//           UPDATECONTACT,
//           {
//             REFNO: data?.REFNO,
//             EMPID: EmpId,
//             TEAMSALE: TeamSale,
//             SALECODE: SaleCode,
//             SUPEMPID: SupEmpId,
//             SECEMPID: SecEmpId,
//             FIELD: "PAYMENT",
//             DATA: "DRAFT",
//           },
//           {
//             headers: { "Content-Type": "application/json" },
//           }
//         );
//         // console.log(`finishResponse`, finishResponse);

//         //3) ถ้าอัปเดต STATUS สำเร็จ ถึงจะแสดง SweetAlert และ Navigate ต่อ
//         if (finishResponse.status === 200) {
//           Swal.fire({
//             icon: "success",
//             title: "สำเร็จ!",
//             text: "บันทึกสัญญาเรียบร้อยแล้ว",
//             timer: 2000,
//             showConfirmButton: false,
//           }).then(() => {
//             //นำทางไปยัง CreateFirstBill (หรือเปลี่ยนเป็น '/sale/photo' ตามเงื่อนไข)
//             navigate("/firstBill/CreateFirstBill", {
//               state: {
//                 item: data,
//                 from: location.pathname,
//               },
//             });
//           });
//         } else {
//           throw new Error("ไม่สามารถอัปเดตสถานะให้เป็น FINISH ได้");
//         }
//       } else {
//         throw new Error("ไม่สามารถอัปเดตสัญญาได้");
//       }
//     } catch (error) {
//       console.error("Error updating contract or status:", error);
//       Swal.fire({
//         icon: "error",
//         title: "เกิดข้อผิดพลาด!",
//         text: "ไม่สามารถบันทึกสัญญาหรืออัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง",
//         confirmButtonText: "ตกลง",
//       });
//     }
//   };

//   const formatToBE = (isoDate?: string) => {
//     if (!isoDate) return "";
//     const d = new Date(isoDate);
//     const dd = String(d.getDate()).padStart(2, "0");
//     const mm = String(d.getMonth() + 1).padStart(2, "0");
//     const yyyy = d.getFullYear() + 543;
//     return `${dd}/${mm}/${yyyy}`;
//   };

//   // ถ้ามีลายเซ็นแล้วจากการบันทึกสัญญาแล้ว
//   const hasSigned = !!data?.CONTRACT?.[0]?.signature;

//   // มีลายเซ็นใหม่ที่เพิ่งกด "บันทึกลายเซ็น" แล้วหรือยัง (ป้องกันค่าว่างเผื่อไว้)
//   const hasNewSignature = !!(
//     signatureDataURL && signatureDataURL.trim().length > 0
//   );

//   // แสดงปุ่ม "บันทึกสัญญา" เฉพาะเมื่อยังไม่มีลายเซ็นเดิม และเพิ่งบันทึกลายเซ็นใหม่สำเร็จ
//   const canShowSaveContractBtn = !hasSigned && hasNewSignature;

//   return (
//     <>
//       <Content>
//         <div ref={scrollContainerRef} style={{ position: "relative" }}>
//           <div className="d-flex justify-content-between align-items-center my-5">
//             <div
//               id="kt_page_title"
//               data-kt-swapper="true"
//               data-kt-swapper-mode="prepend"
//               data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//               className="page-title d-flex flex-wrap me-3 flex-column justify-content-ceดnter"
//             >
//               <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//                 {data?.PRODUCT[0]?.Package[0]?.PACKAGETYPEID == 1 ? (
//                   <li className={`breadcrumb-item ${styles.titlePage}`}>
//                     ใบสัญญา
//                   </li>
//                 ) : (
//                   <li className={`breadcrumb-item ${styles.titlePage}`}>
//                     ใบสัญญาเช่าซื้อ
//                   </li>
//                 )}
//               </ul>
//             </div>
//           </div>
//           <p className={`${styles.label}`}>เลขที่ขาย:</p>
//           <p className={`${styles.titlePage}`}>{data?.REFNO}</p>

//           {/* Card Body */}
//           <div className="card mb-10">
//             <div className="card-body py-5">
//               <div className="row mb-7">
//                 <label
//                   className={`col-lg-4 fw-bold text-muted ${styles.label}`}
//                 >
//                   วันที่ทำสัญญา
//                 </label>
//                 <div className="col-lg-8">
//                   <span className={`fw-bolder text-gray-900 ${styles.label}`}>
//                     {formatToBE(formattedDate)}
//                   </span>
//                 </div>
//               </div>

//               {data?.NEWREFNO && (
//                 <div className="row mb-10">
//                   <label
//                     className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
//                   >
//                     เลขที่สัญญา
//                   </label>
//                   <div className="col-lg-8">
//                     <span
//                       className={`fw-bolder text-gray-900 ${styles.fontSize}`}
//                     >
//                       {data?.NEWREFNO}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               <div className="row align-items-center mb-10">
//                 <label
//                   className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
//                 >
//                   พนักงานขาย
//                 </label>
//                 <div className="col-lg-8 d-flex justify-content-between">
//                   <span
//                     className={`fw-bolder text-gray-900 ${styles.fontSize}`}
//                   >
//                     {data?.SALEEMPLOYEE[0]?.SALEEMPLOYEE.FName}{" "}
//                     {data?.SALEEMPLOYEE[0]?.SALEEMPLOYEE.LName} -{" "}
//                     {data?.SALEEMPLOYEE[0]?.SALEEMPLOYEE.SaleEmp}
//                   </span>
//                 </div>
//               </div>

//               <div className="row mb-7">
//                 <label
//                   className={`col-lg-4 fw-bold text-muted ${styles.label}`}
//                 >
//                   ชื่อลูกค้า
//                 </label>
//                 <div className="col-lg-8">
//                   <span className={`fw-bolder text-gray-900 ${styles.label}`}>
//                     {data?.CUSTOMERDETAIL[0]?.PREFIX[0]?.PREFIXNAME &&
//                       data?.CUSTOMERDETAIL[0]?.PREFIX[0]?.PREFIXNAME}{" "}
//                     {data?.CUSTOMERDETAIL[0]?.CUSTOMERNAME}{" "}
//                     {data?.CUSTOMERDETAIL[0]?.CUSTOMERLASTNAME &&
//                       data?.CUSTOMERDETAIL[0]?.CUSTOMERLASTNAME}
//                   </span>
//                 </div>
//               </div>

//               {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERID?.length > 0 && (
//                 <div className="row mb-7">
//                   <label className={`col-lg-4 text-muted ${styles.label}`}>
//                     {data.CUSTOMERDETAIL[0].CUSTOMERTYPE === "1"
//                       ? "เลขประจำตัวผู้เสียภาษี"
//                       : "เลขที่บัตรประชาชน"}
//                   </label>
//                   <div className="col-lg-8">
//                     <span className={styles.label}>
//                       {data.CUSTOMERDETAIL[0].CUSTOMERID}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {data?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSNUMBER && (
//                 <div className="row mb-7">
//                   <label className={`col-lg-4 text-muted ${styles.label}`}>
//                     ที่อยู่บัตรประชาชน
//                   </label>
//                   <div className="col-lg-8">
//                     <span className={`${styles.label}`}>
//                       {data?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSNUMBER &&
//                         `${data?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSNUMBER}`}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSMOO &&
//                         `หมู่ที่ ${data?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSMOO}`}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSSOI &&
//                         `ซอย ${data?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSSOI}`}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSROAD &&
//                         `ถนน ${data?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSROAD}`}
//                       &nbsp;
//                       {/* {data?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSSUBDISTRICTNAME &&
//                         `ตำบล / แขวง ${data?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSSUBDISTRICTNAME}`} */}
//                       {data?.ADDRESS?.[0]?.ADDRESSCARD
//                         ?.ADDRESSSUBDISTRICTNAME && (
//                         <>
//                           {data.ADDRESS[0].ADDRESSCARD.ADDRESSPROVINCENAME ===
//                           "กรุงเทพมหานคร"
//                             ? "แขวง / เขต"
//                             : "ตำบล / แขวง"}{" "}
//                           {data.ADDRESS[0].ADDRESSCARD.ADDRESSSUBDISTRICTNAME}
//                         </>
//                       )}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSDISTRICTNAME &&
//                         `อำเภอ ${data?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSDISTRICTNAME}`}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME &&
//                         `จังหวัด ${data?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME}`}
//                       &nbsp;&nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSZIPCODE &&
//                         `${data?.ADDRESS[0]?.ADDRESSCARD?.ADDRESSZIPCODE}`}
//                       &nbsp;
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {data?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER && (
//                 <div className="row mb-10">
//                   <label className={`col-lg-4 text-muted ${styles.label}`}>
//                     ที่อยู่ติดตั้ง
//                   </label>
//                   <div className="col-lg-8">
//                     <span className={`${styles.label}`}>
//                       {data?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER &&
//                         `${data?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER}`}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSMOO &&
//                         `หมู่ที่ ${data?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSMOO}`}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSSOI &&
//                         `ซอย ${data?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSSOI}`}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSROAD &&
//                         `ถนน ${data?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSROAD}`}
//                       &nbsp;
//                       {/* {data?.ADDRESS[0]?.ADDRESSINSTALLATION
//                         ?.ADDRESSSUBDISTRICTNAME &&
//                         `ตำบล / แขวง ${data?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME}`} */}
//                       {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION
//                         ?.ADDRESSSUBDISTRICTNAME && (
//                         <>
//                           {data.ADDRESS[0].ADDRESSINSTALLATION
//                             .ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
//                             ? "แขวง / เขต"
//                             : "ตำบล / แขวง"}{" "}
//                           {
//                             data.ADDRESS[0].ADDRESSINSTALLATION
//                               .ADDRESSSUBDISTRICTNAME
//                           }
//                         </>
//                       )}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSINSTALLATION
//                         ?.ADDRESSDISTRICTNAME &&
//                         `อำเภอ ${data?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME}`}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSINSTALLATION
//                         ?.ADDRESSPROVINCENAME &&
//                         `จังหวัด ${data?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME}`}
//                       &nbsp;&nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE &&
//                         `${data?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE}`}
//                       &nbsp;
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {data?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER && (
//                 <div className="row mb-10">
//                   <label className={`col-lg-4 text-muted ${styles.label}`}>
//                     ที่อยู่เก็บเงิน
//                   </label>
//                   <div className="col-lg-8">
//                     <span className={`${styles.label}`}>
//                       {data?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER &&
//                         `${data?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER}`}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSMOO &&
//                         `หมู่ที่ ${data?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSMOO}`}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSSOI &&
//                         `ซอย ${data?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSSOI}`}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSROAD &&
//                         `ถนน ${data?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSROAD}`}
//                       &nbsp;
//                       {/* {data?.ADDRESS[0]?.ADDRESSPAYMENT
//                         ?.ADDRESSSUBDISTRICTNAME &&
//                         `ตำบล / แขวง ${data?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME}`} */}
//                       {data?.ADDRESS?.[0]?.ADDRESSPAYMENT
//                         ?.ADDRESSSUBDISTRICTNAME && (
//                         <>
//                           {data.ADDRESS[0].ADDRESSPAYMENT
//                             .ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
//                             ? "แขวง / เขต"
//                             : "ตำบล / แขวง"}{" "}
//                           {
//                             data.ADDRESS[0].ADDRESSPAYMENT
//                               .ADDRESSSUBDISTRICTNAME
//                           }
//                         </>
//                       )}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSDISTRICTNAME &&
//                         `อำเภอ ${data?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSDISTRICTNAME}`}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME &&
//                         `จังหวัด ${data?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME}`}
//                       &nbsp;&nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE &&
//                         `${data?.ADDRESS[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE}`}
//                       &nbsp;
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {data?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME && (
//                 <div className="row mb-10">
//                   <label className={`col-lg-4 text-muted ${styles.label}`}>
//                     ที่อยู่เสึยภาษี
//                   </label>
//                   <div className="col-lg-8">
//                     <span className={`${styles.label}`}>
//                       {data?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSNUMBER &&
//                         `${data?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSNUMBER}`}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSMOO &&
//                         `หมู่ที่ ${data?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSMOO}`}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSSOI &&
//                         `ซอย ${data?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSSOI}`}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSROAD &&
//                         `ถนน ${data?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSROAD}`}
//                       &nbsp;
//                       {/* {data?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSSUBDISTRICTNAME &&
//                         `ตำบล / แขวง ${data?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSSUBDISTRICTNAME}`} */}
//                       {data?.ADDRESS?.[0]?.ADDRESSTAX
//                         ?.ADDRESSSUBDISTRICTNAME && (
//                         <>
//                           {data.ADDRESS[0].ADDRESSTAX.ADDRESSPROVINCENAME ===
//                           "กรุงเทพมหานคร"
//                             ? "แขวง / เขต"
//                             : "ตำบล / แขวง"}{" "}
//                           {data.ADDRESS[0].ADDRESSTAX.ADDRESSSUBDISTRICTNAME}
//                         </>
//                       )}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSDISTRICTNAME &&
//                         `อำเภอ ${data?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSDISTRICTNAME}`}
//                       &nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME &&
//                         `จังหวัด ${data?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME}`}
//                       &nbsp;&nbsp;
//                       {data?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSZIPCODE &&
//                         `${data?.ADDRESS[0]?.ADDRESSTAX?.ADDRESSZIPCODE}`}
//                       &nbsp;
//                     </span>
//                   </div>
//                 </div>
//               )}

//               <div className="row mb-10">
//                 <label className={`col-lg-4 text-muted ${styles.label}`}>
//                   เบอร์ที่ติดต่อได้
//                 </label>
//                 <div className="col-lg-8">
//                   <span className={`${styles.label}`}>
//                     {data?.CUSTOMERDETAIL[0]?.CUSTOMERMOBILE
//                       ? data?.CUSTOMERDETAIL[0]?.CUSTOMERMOBILE
//                       : data?.ADDRESS[0]?.ADDRESSINSTALLATION?.ADDRESSPHONE}
//                   </span>
//                 </div>
//               </div>

//               {data?.CUSTOMERDETAIL[0]?.CUSTOMERPHONE && (
//                 <div className="row mb-10">
//                   <label
//                     className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
//                   >
//                     เบอร์ที่ติดต่อได้ 2
//                   </label>
//                   <div className="col-lg-8">
//                     <span
//                       className={`fw-bolder text-gray-900 ${styles.fontSize}`}
//                     >
//                       {data?.CUSTOMERDETAIL[0]?.CUSTOMERPHONE}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               <div className="row mb-10">
//                 <label
//                   className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
//                 >
//                   สินค้า
//                 </label>
//                 <div className="col-lg-8">
//                   <span
//                     className={`fw-bolder text-gray-900 ${styles.fontSize}`}
//                   >
//                     {data?.PRODUCT[0]?.ItemDescription}
//                   </span>
//                 </div>
//               </div>

//               {data?.PRODUCT[1]?.ItemDescription && (
//                 <div className="row mb-10">
//                   <label
//                     className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
//                   >
//                     สินค้าบันเดิล
//                   </label>
//                   <div className="col-lg-8">
//                     <span
//                       className={`fw-bolder text-gray-900 ${styles.fontSize}`}
//                     >
//                       {data?.PRODUCT[1]?.ItemDescription}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {data?.PRODUCT[0]?.Package?.[0]?.PACKAGETITLE && (
//                 <div className="row mb-10">
//                   <label
//                     className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
//                   >
//                     แพ็คเกจ
//                   </label>
//                   <div className="col-lg-8">
//                     <span
//                       className={`fw-bolder text-gray-900 ${styles.fontSize}`}
//                     >
//                       {data?.PRODUCT[0]?.Package[0]?.PACKAGETITLE}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {data?.PRODUCT[0]?.Package?.[0]?.TOTALPRICE && (
//                 <div className="row align-items-center mb-10">
//                   <label
//                     className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
//                   >
//                     ราคาสินค้า
//                   </label>
//                   <div className="col-lg-8 d-flex justify-content-between">
//                     <span
//                       className={`fw-bolder text-gray-900 ${styles.fontSize}`}
//                     >
//                       {(data?.PRODUCT[0]?.Package[0]?.TOTALPRICE).toLocaleString()}
//                     </span>
//                     <span className="badge badge-light-success">บาท</span>
//                   </div>
//                 </div>
//               )}

//               {data?.DISCOUNT[0] &&
//                 data?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME && (
//                   <div className="row align-items-center mb-10">
//                     <label
//                       className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
//                     >
//                       เครื่องเทิร์น
//                     </label>
//                     <div className="col-lg-8 d-flex justify-content-between">
//                       <span
//                         className={`fw-bolder text-gray-900 ${styles.fontSize}`}
//                       >
//                         {data?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME
//                           ? data?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME
//                           : "ไม่มี"}
//                       </span>
//                     </div>
//                   </div>
//                 )}

//               {data?.DISCOUNT[0]?.DISCOUNTAMOUNT && (
//                 <div className="row align-items-center mb-10">
//                   <label
//                     className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
//                   >
//                     ส่วนลด
//                   </label>
//                   <div className="col-lg-8 d-flex justify-content-between">
//                     <span
//                       className={`fw-bolder text-gray-900 ${styles.fontSize}`}
//                     >
//                       {data?.DISCOUNT[0]?.DISCOUNTAMOUNT
//                         ? (data?.DISCOUNT[0]?.DISCOUNTAMOUNT).toLocaleString()
//                         : "ไม่มี"}
//                     </span>
//                     <span className="badge badge-light-success">บาท</span>
//                   </div>
//                 </div>
//               )}

//               {data?.DISCOUNT[0]?.GIFT?.GIFTNAME && (
//                 <div className="row align-items-center mb-10">
//                   <label
//                     className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
//                   >
//                     ของแถม
//                   </label>
//                   <div className="col-lg-8 d-flex justify-content-between">
//                     <span
//                       className={`fw-bolder text-gray-900 ${styles.fontSize}`}
//                     >
//                       {data?.DISCOUNT[0]?.GIFT?.GIFTNAME
//                         ? data?.DISCOUNT[0]?.GIFT?.GIFTNAME
//                         : "ไม่มี"}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               <div className="row align-items-center mb-10">
//                 <label
//                   className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
//                 >
//                   ราคาสุทธิ
//                 </label>
//                 <div className="col-lg-8 d-flex justify-content-between">
//                   <span
//                     className={`fw-bolder text-gray-900 ${styles.fontSize}`}
//                   >
//                     {netPrice.toLocaleString()}
//                   </span>
//                   <span className="badge badge-light-success">บาท</span>
//                 </div>
//               </div>

//               {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
//               {data?.PRODUCT[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
//                 <>
//                   <div className="row align-items-center mb-10">
//                     <label
//                       className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
//                     >
//                       งวดที่ 1 ที่ต้องชำระ
//                     </label>
//                     <div className="col-lg-8 d-flex justify-content-between">
//                       <span
//                         className={`fw-bolder text-gray-900 ${styles.fontSize}`}
//                       >
//                         {(
//                           data?.PRODUCT[0]?.Package[0]?.PERIODDETAILS[0]
//                             ?.PAYMENTAMOUNT - discountAmount
//                         ).toLocaleString()}
//                       </span>
//                       <span className="badge badge-light-success">บาท</span>
//                     </div>
//                   </div>

//                   {data?.PRODUCT[0]?.Package[0]?.PERIODDETAILS.length > 1 && (
//                     <div className="row align-items-center mb-10">
//                       <label
//                         className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
//                       >
//                         งวดที่ 2 ถึง{" "}
//                         {data?.PRODUCT[0]?.Package[0]?.PERIODDETAILS.length}{" "}
//                         ต้องชำระงวดละ
//                       </label>
//                       <div className="col-lg-8 d-flex justify-content-between">
//                         <span
//                           className={`fw-bolder text-gray-900 ${styles.fontSize}`}
//                         >
//                           {(data?.PRODUCT[0]?.Package[0]?.PERIODDETAILS[1]?.PAYMENTAMOUNT).toLocaleString()}
//                         </span>
//                         <span className="badge badge-light-success">บาท</span>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}

//               {/* --------------------- ลายเซ็น --------------------- */}
//               <div
//                 className="mb-5"
//                 style={{
//                   maxWidth: 600,
//                   margin: "0 auto",
//                 }}
//               >
//                 {/* ✅ ถ้าลงชื่อแล้วให้แสดงภาพ */}
//                 {hasSigned ? (
//                   <div className="text-center">
//                     <p className={`${styles.label} mb-3`}>ลายเซ็นลูกค้า</p>
//                     <img
//                       src={`data:image/png;base64,${data.CONTRACT[0].signature}`}
//                       alt="signature"
//                       className="img-fluid"
//                       style={{ border: "1px solid #ccc", borderRadius: 4 }}
//                     />
//                   </div>
//                 ) : (
//                   <>
//                     {/* กล่องเซ็น */}
//                     <div
//                       style={{
//                         border: "1px solid #d7dbde",
//                         borderRadius: 4,
//                         width: "100%",
//                         height: 200,
//                         overflow: "hidden",
//                       }}
//                     >
//                       <SignaturePad
//                         ref={signaturePadRef}
//                         options={{
//                           minWidth: 1,
//                           maxWidth: 3,
//                           penColor: "black",
//                         }}
//                         canvasProps={{
//                           style: { width: "100%", height: "100%" },
//                         }}
//                       />
//                     </div>

//                     {/* ปุ่มลบ/บันทึกลายเซ็น */}
//                     <div className="my-5">
//                       <button
//                         type="button"
//                         className={`${styles.btnDanger} mx-5`}
//                         onClick={clearSignature}
//                       >
//                         ลบลายเซ็น
//                       </button>
//                       <button
//                         type="button"
//                         className={`${styles.btnPrimary}`}
//                         onClick={saveSignature}
//                       >
//                         บันทึกลายเซ็น
//                       </button>
//                     </div>

//                     {/* แสดง preview ถ้ามีการเซ็น */}
//                     {signatureDataURL && (
//                       <div className="mt-3">
//                         <img
//                           src={`data:image/png;base64,${signatureDataURL}`}
//                           alt="signature"
//                           className="img-fluid"
//                         />
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//           {/* End Card Body */}

//           {canShowSaveContractBtn && (
//             <>
//               <div className="d-none d-xl-flex justify-content-end align-items-center mt-5 mb-10">
//                 <button
//                   className={`${styles.btnPrimary}`}
//                   type="button"
//                   onClick={handleNextClick}
//                 >
//                   บันทึกสัญญา
//                 </button>
//               </div>

//               {/* ปุ่มในหน้าจอเล็ก */}
//               <div
//                 className="d-flex d-xl-none justify-content-end align-items-center bg-light p-3 border-top"
//                 style={{
//                   position: "fixed",
//                   bottom: 0,
//                   left: 0,
//                   right: 0,
//                   zIndex: 1050,
//                 }}
//               >
//                 <button
//                   className={`${styles.btnPrimary}`}
//                   onClick={handleNextClick}
//                 >
//                   บันทึกสัญญา
//                 </button>
//               </div>
//             </>
//           )}

//           {hasSigned && (
//             <>
//               <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
//                 <button
//                   className={`${styles.btnSecondary}`}
//                   onClick={() => navigate("/sale/overview")}
//                 >
//                   กลับหน้าแรก
//                 </button>
//               </div>

//               {/* ปุ่มในหน้าจอเล็ก */}
//               <div
//                 className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
//                 style={{
//                   position: "fixed",
//                   bottom: 0,
//                   left: 0,
//                   right: 0,
//                   zIndex: 1050,
//                 }}
//               >
//                 <button
//                   className={`${styles.btnSecondary}`}
//                   onClick={() => navigate("/sale/overview")}
//                 >
//                   กลับหน้าแรก
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </Content>
//     </>
//   );
// };

// export default SalesContract;



// import styles from "@/styles/style.module.css";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { useState, useEffect, useRef } from "react";
// import { Content } from "../../../_metronic/layout/components/content";
// import { useAuth } from "../../modules/auth/core/Auth";
// import SignaturePad from "react-signature-pad-wrapper";
// import {
//   useUUIDStore,
//   useSaveProductStore,
//   useSaveDiscountStore,
//   useSaveCustomerStore,
//   useSaveAddressStore,
// } from "../../modules/stores/stepsStore";
// import Swal from "sweetalert2";

// interface ItemProps {
//   REFNO: string;
//   CONTNO: string;
//   EMPID: string;
//   TEAMSALE: string;
//   SALECODE: string;
//   SUPEMPID: string;
//   SECEMPID: string;
//   STATUS: string;
//   PRODUCT: any[];
//   CUSTOMERSTATUS: any[];
//   DISCOUNT: any[];
//   CUSTOMERDETAIL: any[];
//   ADDRESS: any[];
//   PDPA: any[];
//   CONTRACT: any[];
//   IMAGE: any[];
//   CHECKERCOMMENT: any[];
//   SALEEMPLOYEE?: any[];
//   NEWREFNO?: string;
// }

// // state ที่อาจได้รับ (รองรับทั้งแบบแบน และ { item, from })
// type IncomingState =
//   | (ItemProps & { from?: string })
//   | { item: ItemProps; from?: string }
//   | undefined;

// const SalesContract: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // --- อ่าน state ให้ทนทาน ---
//   const raw = location.state as IncomingState;
//   const from = raw && "from" in raw ? raw.from : undefined;
//   const stateItem: ItemProps | undefined =
//     raw && "item" in raw ? raw.item : (raw as ItemProps | undefined);

//   const cameFromPdpa = from === "/sale/pdpa";

//   const { auth } = useAuth();
//   const EmpId = auth?.data?.[0]?.EmpId || "";
//   const TeamSale = auth?.data?.[0]?.TeamSale || "";
//   const SaleCode = auth?.data?.[0]?.SaleCode || "";
//   const SupEmpId = auth?.data?.[0]?.SupEmp || "";
//   const SecEmpId = auth?.data?.[0]?.SecEmp || "";

//   const { REFNO } = useUUIDStore();

//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//   const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
//   const GET_ALL_CONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;

//   // --- draft / matchedItem ---
//   const [draft, setDraft] = useState<ItemProps[]>([]);

//   useEffect(() => {
//     // ถ้ามี stateItem อยู่แล้ว ก็ไม่ต้องยิงครั้งนี้ (แต่เราจะยิงอีกรอบใน fetchData อยู่ดีเพื่อ refresh)
//     if (stateItem) return;
//     axios.get(GET_ALL_CONTRACT_URL).then((res) => {
//       if (Array.isArray(res.data.data)) setDraft(res.data.data);
//     });
//   }, [GET_ALL_CONTRACT_URL, stateItem]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axios.get(GET_ALL_CONTRACT_URL);
//         if (response.data?.data && Array.isArray(response.data.data)) {
//           setDraft(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching GetAllContract:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, [GET_ALL_CONTRACT_URL]);

//   const matchedItem = draft.find((it) => it.REFNO === REFNO);
//   console.log("matchedItem =>", matchedItem);

//   // data หลักสำหรับแสดงข้อมูลต่าง ๆ
//   const data: ItemProps = (stateItem || matchedItem || ({} as ItemProps)) as ItemProps;

//   // ถ้ามาจาก PDPA ให้ "ล็อก" REFNO ที่ stateItem ส่งมา
//   const refNoToUse: string =
//     (cameFromPdpa && stateItem?.REFNO) ||
//     data?.REFNO ||
//     matchedItem?.REFNO ||
//     REFNO ||
//     "";

//   console.log("from:", from, "cameFromPdpa:", cameFromPdpa, "refNoToUse:", refNoToUse);

//   const currentDate = new Date();
//   const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

//   const { PRODUCT } = useSaveProductStore();
//   const { DISCOUNT } = useSaveDiscountStore();
//   const { saveCustomerTypes } = useSaveCustomerStore();
//   const { addressCard, addressInstallation, addressPayment, addressTax } =
//     useSaveAddressStore();

//   const totalPrice = data?.PRODUCT?.[0]?.Package?.[0]?.TOTALPRICE || 0;
//   const discountAmount = data?.DISCOUNT?.[0]?.DISCOUNTAMOUNT || 0;
//   const netPrice = totalPrice - discountAmount;

//   const signaturePadRef = useRef<any>(null);
//   const [signatureDataURL, setSignatureDataURL] = useState<string | null>(null);

//   // ปุ่มลบลายเซ็น
//   const clearSignature = () => {
//     signaturePadRef.current?.clear();
//     setSignatureDataURL(null);
//   };

//   const saveSignature = () => {
//     if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
//       const dataUrl = signaturePadRef.current.toDataURL("image/png");
//       setSignatureDataURL(dataUrl.replace(/^data:image\/png;base64,/, ""));
//       signaturePadRef.current.clear();
//     } else {
//       Swal.fire("กรุณาลงชื่อก่อนบันทึก");
//     }
//   };

//   const handleNextClick = async () => {
//     try {
//       // 1) อัปเดต FIELD = "CONTRACT"
//       const updateContract = await axios.post(
//         UPDATECONTACT,
//         {
//           REFNO: refNoToUse, // << ใช้ตัวที่ล็อกจาก PDPA เมื่อมาจาก PDPA
//           EMPID: EmpId,
//           TEAMSALE: TeamSale,
//           SALECODE: SaleCode,
//           SUPEMPID: SupEmpId,
//           SECEMPID: SecEmpId,
//           FIELD: "CONTRACT",
//           DATA: {
//             createdAt: formattedDate,
//             signature: signatureDataURL,
//           },
//         },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       if (updateContract.status === 200) {
//         // 2) อัปเดต FIELD = "PAYMENT"
//         const finishResponse = await axios.post(
//           UPDATECONTACT,
//           {
//             REFNO: refNoToUse, // << เช่นกัน
//             EMPID: EmpId,
//             TEAMSALE: TeamSale,
//             SALECODE: SaleCode,
//             SUPEMPID: SupEmpId,
//             SECEMPID: SecEmpId,
//             FIELD: "PAYMENT",
//             DATA: "DRAFT",
//           },
//           { headers: { "Content-Type": "application/json" } }
//         );

//         if (finishResponse.status === 200) {
//           Swal.fire({
//             icon: "success",
//             title: "สำเร็จ!",
//             text: "บันทึกสัญญาเรียบร้อยแล้ว",
//             timer: 2000,
//             showConfirmButton: false,
//           }).then(() => {
//             navigate("/firstBill/CreateFirstBill", {
//               state: { item: data, from: location.pathname },
//             });
//           });
//         } else {
//           throw new Error("ไม่สามารถอัปเดตสถานะ PAYMENT ได้");
//         }
//       } else {
//         throw new Error("ไม่สามารถอัปเดตสัญญาได้");
//       }
//     } catch (error) {
//       console.error("Error updating contract or status:", error);
//       Swal.fire({
//         icon: "error",
//         title: "เกิดข้อผิดพลาด!",
//         text: "ไม่สามารถบันทึกสัญญาหรืออัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง",
//         confirmButtonText: "ตกลง",
//       });
//     }
//   };

//   const formatToBE = (isoDate?: string) => {
//     if (!isoDate) return "";
//     const d = new Date(isoDate);
//     const dd = String(d.getDate()).padStart(2, "0");
//     const mm = String(d.getMonth() + 1).padStart(2, "0");
//     const yyyy = d.getFullYear() + 543;
//     return `${dd}/${mm}/${yyyy}`;
//   };

//   const hasSigned = !!data?.CONTRACT?.[0]?.signature;
//   const hasNewSignature = !!(signatureDataURL && signatureDataURL.trim().length > 0);
//   const canShowSaveContractBtn = !hasSigned && hasNewSignature;

//   return (
//     <>
//       <Content>
//         <div style={{ position: "relative" }}>
//           <div className="d-flex justify-content-between align-items-center my-5">
//             <div
//               id="kt_page_title"
//               data-kt-swapper="true"
//               data-kt-swapper-mode="prepend"
//               data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//               className="page-title d-flex flex-wrap me-3 flex-column justify-content-center"
//             >
//               <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//                 {data?.PRODUCT?.[0]?.Package?.[0]?.PACKAGETYPEID === 1 ? (
//                   <li className={`breadcrumb-item ${styles.titlePage}`}>ใบสัญญา</li>
//                 ) : (
//                   <li className={`breadcrumb-item ${styles.titlePage}`}>ใบสัญญาเช่าซื้อ</li>
//                 )}
//               </ul>
//             </div>
//           </div>

//           <p className={`${styles.label}`}>เลขที่ขาย:</p>
//           <p className={`${styles.titlePage}`}>{refNoToUse}</p>

//           {/* Card Body */}
//           <div className="card mb-10">
//             <div className="card-body py-5">
//               <div className="row mb-7">
//                 <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>
//                   วันที่ทำสัญญา
//                 </label>
//                 <div className="col-lg-8">
//                   <span className={`fw-bolder text-gray-900 ${styles.label}`}>
//                     {formatToBE(formattedDate)}
//                   </span>
//                 </div>
//               </div>

//               {data?.NEWREFNO && (
//                 <div className="row mb-10">
//                   <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
//                     เลขที่สัญญา
//                   </label>
//                   <div className="col-lg-8">
//                     <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                       {data?.NEWREFNO}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               <div className="row align-items-center mb-10">
//                 <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
//                   พนักงานขาย
//                 </label>
//                 <div className="col-lg-8 d-flex justify-content-between">
//                   <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                     {data?.SALEEMPLOYEE?.[0]?.SALEEMPLOYEE?.FName}{" "}
//                     {data?.SALEEMPLOYEE?.[0]?.SALEEMPLOYEE?.LName} -{" "}
//                     {data?.SALEEMPLOYEE?.[0]?.SALEEMPLOYEE?.SaleEmp}
//                   </span>
//                 </div>
//               </div>

//               <div className="row mb-7">
//                 <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>
//                   ชื่อลูกค้า
//                 </label>
//                 <div className="col-lg-8">
//                   <span className={`fw-bolder text-gray-900 ${styles.label}`}>
//                     {data?.CUSTOMERDETAIL?.[0]?.PREFIX?.[0]?.PREFIXNAME || ""}{" "}
//                     {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERNAME || ""}{" "}
//                     {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERLASTNAME || ""}
//                   </span>
//                 </div>
//               </div>

//               {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERID?.length > 0 && (
//                 <div className="row mb-7">
//                   <label className={`col-lg-4 text-muted ${styles.label}`}>
//                     {data.CUSTOMERDETAIL?.[0]?.CUSTOMERTYPE === "1"
//                       ? "เลขประจำตัวผู้เสียภาษี"
//                       : "เลขที่บัตรประชาชน"}
//                   </label>
//                   <div className="col-lg-8">
//                     <span className={styles.label}>
//                       {data.CUSTOMERDETAIL?.[0]?.CUSTOMERID}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {/* ที่อยู่ต่าง ๆ (ตัด logic เดิมมาวางเหมือนเดิม) */}
//               {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSNUMBER && (
//                 <div className="row mb-7">
//                   <label className={`col-lg-4 text-muted ${styles.label}`}>
//                     ที่อยู่บัตรประชาชน
//                   </label>
//                   <div className="col-lg-8">
//                     <span className={`${styles.label}`}>
//                       {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSNUMBER || ""}&nbsp;
//                       {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSMOO
//                         ? `หมู่ที่ ${data.ADDRESS[0].ADDRESSCARD.ADDRESSMOO} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSSOI
//                         ? `ซอย ${data.ADDRESS[0].ADDRESSCARD.ADDRESSSOI} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSROAD
//                         ? `ถนน ${data.ADDRESS[0].ADDRESSCARD.ADDRESSROAD} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSSUBDISTRICTNAME && (
//                         <>
//                           {data.ADDRESS[0].ADDRESSCARD.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
//                             ? "แขวง / เขต"
//                             : "ตำบล / แขวง"}{" "}
//                           {data.ADDRESS[0].ADDRESSCARD.ADDRESSSUBDISTRICTNAME}
//                         </>
//                       )}{" "}
//                       {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSDISTRICTNAME
//                         ? `อำเภอ ${data.ADDRESS[0].ADDRESSCARD.ADDRESSDISTRICTNAME} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME
//                         ? `จังหวัด ${data.ADDRESS[0].ADDRESSCARD.ADDRESSPROVINCENAME} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSZIPCODE ||
//                         ""}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER && (
//                 <div className="row mb-10">
//                   <label className={`col-lg-4 text-muted ${styles.label}`}>
//                     ที่อยู่ติดตั้ง
//                   </label>
//                   <div className="col-lg-8">
//                     <span className={`${styles.label}`}>
//                       {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER || ""}&nbsp;
//                       {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSMOO
//                         ? `หมู่ที่ ${data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSMOO} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSSOI
//                         ? `ซอย ${data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSSOI} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSROAD
//                         ? `ถนน ${data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSROAD} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME && (
//                         <>
//                           {data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSPROVINCENAME ===
//                             "กรุงเทพมหานคร"
//                             ? "แขวง / เขต"
//                             : "ตำบล / แขวง"}{" "}
//                           {data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME}
//                         </>
//                       )}{" "}
//                       {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME
//                         ? `อำเภอ ${data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSDISTRICTNAME} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME
//                         ? `จังหวัด ${data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSPROVINCENAME} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE || ""}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER && (
//                 <div className="row mb-10">
//                   <label className={`col-lg-4 text-muted ${styles.label}`}>
//                     ที่อยู่เก็บเงิน
//                   </label>
//                   <div className="col-lg-8">
//                     <span className={`${styles.label}`}>
//                       {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER || ""}&nbsp;
//                       {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSMOO
//                         ? `หมู่ที่ ${data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSMOO} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSSOI
//                         ? `ซอย ${data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSSOI} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSROAD
//                         ? `ถนน ${data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSROAD} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME && (
//                         <>
//                           {data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSPROVINCENAME ===
//                             "กรุงเทพมหานคร"
//                             ? "แขวง / เขต"
//                             : "ตำบล / แขวง"}{" "}
//                           {data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME}
//                         </>
//                       )}{" "}
//                       {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSDISTRICTNAME
//                         ? `อำเภอ ${data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSDISTRICTNAME} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME
//                         ? `จังหวัด ${data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSPROVINCENAME} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE || ""}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME && (
//                 <div className="row mb-10">
//                   <label className={`col-lg-4 text-muted ${styles.label}`}>
//                     ที่อยู่เสึยภาษี
//                   </label>
//                   <div className="col-lg-8">
//                     <span className={`${styles.label}`}>
//                       {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSNUMBER || ""}&nbsp;
//                       {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSMOO
//                         ? `หมู่ที่ ${data.ADDRESS[0].ADDRESSTAX.ADDRESSMOO} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSSOI
//                         ? `ซอย ${data.ADDRESS[0].ADDRESSTAX.ADDRESSSOI} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSROAD
//                         ? `ถนน ${data.ADDRESS[0].ADDRESSTAX.ADDRESSROAD} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSSUBDISTRICTNAME && (
//                         <>
//                           {data.ADDRESS[0].ADDRESSTAX.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
//                             ? "แขวง / เขต"
//                             : "ตำบล / แขวง"}{" "}
//                           {data.ADDRESS[0].ADDRESSTAX.ADDRESSSUBDISTRICTNAME}
//                         </>
//                       )}{" "}
//                       {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSDISTRICTNAME
//                         ? `อำเภอ ${data.ADDRESS[0].ADDRESSTAX.ADDRESSDISTRICTNAME} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME
//                         ? `จังหวัด ${data.ADDRESS[0].ADDRESSTAX.ADDRESSPROVINCENAME} `
//                         : ""}
//                       {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSZIPCODE || ""}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               <div className="row mb-10">
//                 <label className={`col-lg-4 text-muted ${styles.label}`}>
//                   เบอร์ที่ติดต่อได้
//                 </label>
//                 <div className="col-lg-8">
//                   <span className={`${styles.label}`}>
//                     {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERMOBILE ||
//                       data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSPHONE ||
//                       ""}
//                   </span>
//                 </div>
//               </div>

//               {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERPHONE && (
//                 <div className="row mb-10">
//                   <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
//                     เบอร์ที่ติดต่อได้ 2
//                   </label>
//                   <div className="col-lg-8">
//                     <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                       {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERPHONE}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               <div className="row mb-10">
//                 <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
//                   สินค้า
//                 </label>
//                 <div className="col-lg-8">
//                   <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                     {data?.PRODUCT?.[0]?.ItemDescription}
//                   </span>
//                 </div>
//               </div>

//               {data?.PRODUCT?.[1]?.ItemDescription && (
//                 <div className="row mb-10">
//                   <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
//                     สินค้าบันเดิล
//                   </label>
//                   <div className="col-lg-8">
//                     <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                       {data?.PRODUCT?.[1]?.ItemDescription}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {data?.PRODUCT?.[0]?.Package?.[0]?.PACKAGETITLE && (
//                 <div className="row mb-10">
//                   <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
//                     แพ็คเกจ
//                   </label>
//                   <div className="col-lg-8">
//                     <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                       {data?.PRODUCT?.[0]?.Package?.[0]?.PACKAGETITLE}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {data?.PRODUCT?.[0]?.Package?.[0]?.TOTALPRICE && (
//                 <div className="row align-items-center mb-10">
//                   <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
//                     ราคาสินค้า
//                   </label>
//                   <div className="col-lg-8 d-flex justify-content-between">
//                     <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                       {Number(data?.PRODUCT?.[0]?.Package?.[0]?.TOTALPRICE).toLocaleString()}
//                     </span>
//                     <span className="badge badge-light-success">บาท</span>
//                   </div>
//                 </div>
//               )}

//               {data?.DISCOUNT?.[0]?.TRADEIN?.TRADEINBRANDNAME && (
//                 <div className="row align-items-center mb-10">
//                   <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
//                     เครื่องเทิร์น
//                   </label>
//                   <div className="col-lg-8 d-flex justify-content-between">
//                     <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                       {data?.DISCOUNT?.[0]?.TRADEIN?.TRADEINBRANDNAME || "ไม่มี"}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {data?.DISCOUNT?.[0]?.DISCOUNTAMOUNT && (
//                 <div className="row align-items-center mb-10">
//                   <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
//                     ส่วนลด
//                   </label>
//                   <div className="col-lg-8 d-flex justify-content-between">
//                     <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                       {Number(data?.DISCOUNT?.[0]?.DISCOUNTAMOUNT).toLocaleString()}
//                     </span>
//                     <span className="badge badge-light-success">บาท</span>
//                   </div>
//                 </div>
//               )}

//               {data?.DISCOUNT?.[0]?.GIFT?.GIFTNAME && (
//                 <div className="row align-items-center mb-10">
//                   <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
//                     ของแถม
//                   </label>
//                   <div className="col-lg-8 d-flex justify-content-between">
//                     <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                       {data?.DISCOUNT?.[0]?.GIFT?.GIFTNAME || "ไม่มี"}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               <div className="row align-items-center mb-10">
//                 <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
//                   ราคาสุทธิ
//                 </label>
//                 <div className="col-lg-8 d-flex justify-content-between">
//                   <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                     {Number(netPrice).toLocaleString()}
//                   </span>
//                   <span className="badge badge-light-success">บาท</span>
//                 </div>
//               </div>

//               {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
//               {data?.PRODUCT?.[0]?.Package?.[0]?.PACKAGETYPEID !== 1 && (
//                 <>
//                   <div className="row align-items-center mb-10">
//                     <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
//                       งวดที่ 1 ที่ต้องชำระ
//                     </label>
//                     <div className="col-lg-8 d-flex justify-content-between">
//                       <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                         {Number(
//                           (data?.PRODUCT?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT || 0) -
//                           (discountAmount || 0)
//                         ).toLocaleString()}
//                       </span>
//                       <span className="badge badge-light-success">บาท</span>
//                     </div>
//                   </div>

//                   {data?.PRODUCT?.[0]?.Package?.[0]?.PERIODDETAILS?.length > 1 && (
//                     <div className="row align-items-center mb-10">
//                       <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
//                         งวดที่ 2 ถึง{" "}
//                         {data?.PRODUCT?.[0]?.Package?.[0]?.PERIODDETAILS?.length} ต้องชำระงวดละ
//                       </label>
//                       <div className="col-lg-8 d-flex justify-content-between">
//                         <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
//                           {Number(
//                             data?.PRODUCT?.[0]?.Package?.[0]?.PERIODDETAILS?.[1]?.PAYMENTAMOUNT || 0
//                           ).toLocaleString()}
//                         </span>
//                         <span className="badge badge-light-success">บาท</span>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}

//               {/* --------------------- ลายเซ็น --------------------- */}
//               <div className="mb-5" style={{ maxWidth: 600, margin: "0 auto" }}>
//                 {hasSigned ? (
//                   <div className="text-center">
//                     <p className={`${styles.label} mb-3`}>ลายเซ็นลูกค้า</p>
//                     <img
//                       src={`data:image/png;base64,${data.CONTRACT[0].signature}`}
//                       alt="signature"
//                       className="img-fluid"
//                       style={{ border: "1px solid #ccc", borderRadius: 4 }}
//                     />
//                   </div>
//                 ) : (
//                   <>
//                     <div
//                       style={{
//                         border: "1px solid #d7dbde",
//                         borderRadius: 4,
//                         width: "100%",
//                         height: 200,
//                         overflow: "hidden",
//                       }}
//                     >
//                       <SignaturePad
//                         ref={signaturePadRef}
//                         options={{ minWidth: 1, maxWidth: 3, penColor: "black" }}
//                         canvasProps={{ style: { width: "100%", height: "100%" } }}
//                       />
//                     </div>

//                     <div className="my-5">
//                       <button type="button" className={`${styles.btnDanger} mx-5`} onClick={clearSignature}>
//                         ลบลายเซ็น
//                       </button>
//                       <button type="button" className={`${styles.btnPrimary}`} onClick={saveSignature}>
//                         บันทึกลายเซ็น
//                       </button>
//                     </div>

//                     {signatureDataURL && (
//                       <div className="mt-3">
//                         <img
//                           src={`data:image/png;base64,${signatureDataURL}`}
//                           alt="signature"
//                           className="img-fluid"
//                         />
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           {canShowSaveContractBtn && (
//             <>
//               <div className="d-none d-xl-flex justify-content-end align-items-center mt-5 mb-10">
//                 <button className={`${styles.btnPrimary}`} type="button" onClick={handleNextClick}>
//                   บันทึกสัญญา
//                 </button>
//               </div>

//               <div
//                 className="d-flex d-xl-none justify-content-end align-items-center bg-light p-3 border-top"
//                 style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1050 }}
//               >
//                 <button className={`${styles.btnPrimary}`} onClick={handleNextClick}>
//                   บันทึกสัญญา
//                 </button>
//               </div>
//             </>
//           )}

//           {hasSigned && (
//             <>
//               <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
//                 <button className={`${styles.btnSecondary}`} onClick={() => navigate("/sale/overview")}>
//                   กลับหน้าแรก
//                 </button>
//               </div>

//               <div
//                 className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
//                 style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1050 }}
//               >
//                 <button className={`${styles.btnSecondary}`} onClick={() => navigate("/sale/overview")}>
//                   กลับหน้าแรก
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </Content>
//     </>
//   );
// };

// export default SalesContract;




import styles from "@/styles/style.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useRef, useMemo } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from "../../modules/auth/core/Auth";
import SignaturePad from "react-signature-pad-wrapper";
import {
  useUUIDStore,
  useSaveProductStore,
  useSaveDiscountStore,
  useSaveCustomerStore,
  useSaveAddressStore,
} from "../../modules/stores/stepsStore";
import Swal from "sweetalert2";

interface ItemProps {
  REFNO: string;
  CONTNO: string;
  EMPID: string;
  TEAMSALE: string;
  SALECODE: string;
  SUPEMPID: string;
  SECEMPID: string;
  STATUS: string;
  PRODUCT: any[];
  CUSTOMERSTATUS: any[];
  DISCOUNT: any[];
  CUSTOMERDETAIL: any[];
  ADDRESS: any[];
  PDPA: any[];
  CONTRACT: any[];
  IMAGE: any[];
  CHECKERCOMMENT: any[];
  SALEEMPLOYEE?: any[];
  NEWREFNO?: string;
}

// state ที่ PDPA ส่งมาเป็นแบบแบน { ...item, from: '/sale/pdpa' }
type IncomingState = (ItemProps & { from?: string }) | undefined;

const SalesContract: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ⬇️ state จาก PDPA (หรือหน้าอื่น)
  const state = location.state as IncomingState;

  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || "";
  const TeamSale = auth?.data?.[0]?.TeamSale || "";
  const SaleCode = auth?.data?.[0]?.SaleCode || "";
  const SupEmpId = auth?.data?.[0]?.SupEmp || "";
  const SecEmpId = auth?.data?.[0]?.SecEmp || "";

  const { REFNO: storeRefNo } = useUUIDStore();

  const [draft, setDraft] = useState<ItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
  const GET_ALL_CONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;

  // โหลด draft เสมอ (เพื่อให้ sync กับ DB)
  useEffect(() => {
    let ignore = false;
    (async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(GET_ALL_CONTRACT_URL);
        if (!ignore && Array.isArray(res.data?.data)) {
          setDraft(res.data.data);
        }
      } catch (e) {
        console.error("Error fetching GetAllContract:", e);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [GET_ALL_CONTRACT_URL]);

  // ✅ “REFNO กลาง” ที่จะใช้ทั้งไฟล์ (ให้ state มาก่อน ถ้าไม่มีค่อย fallback เป็น store)
  const refNoToUse = state?.REFNO || storeRefNo || "";

  // ✅ หา record จาก draft ด้วย REFNO ตัวเดียวกัน
  const recordFromDraft = useMemo(
    () => draft.find(d => d.REFNO === refNoToUse) || null,
    [draft, refNoToUse]
  );

  // ✅ ข้อมูลที่ใช้เรนเดอร์ทั้งหมด
  // ถ้ามีใน draft (อัปเดตสุด) ใช้ draft ก่อน, ถ้ายังไม่เจอใช้ state
  const data: ItemProps = (recordFromDraft || state || ({} as ItemProps)) as ItemProps;

  console.log("refNoToUse:", refNoToUse);
  console.log("recordFromDraft:", recordFromDraft);
  console.log("data:", data);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

  const { PRODUCT } = useSaveProductStore();
  const { DISCOUNT } = useSaveDiscountStore();
  const { saveCustomerTypes } = useSaveCustomerStore();
  const { addressCard, addressInstallation, addressPayment, addressTax } = useSaveAddressStore();

  const totalPrice = data?.PRODUCT?.[0]?.Package?.[0]?.TOTALPRICE || 0;
  const discountAmount = data?.DISCOUNT?.[0]?.DISCOUNTAMOUNT || 0;
  const netPrice = totalPrice - discountAmount;

  const signaturePadRef = useRef<any>(null);
  const [signatureDataURL, setSignatureDataURL] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearSignature = () => {
    signaturePadRef.current?.clear();
    setSignatureDataURL(null);
  };

  const saveSignature = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const dataUrl = signaturePadRef.current.toDataURL("image/png");
      setSignatureDataURL(dataUrl.replace(/^data:image\/png;base64,/, ""));
      signaturePadRef.current.clear();
    } else {
      Swal.fire("กรุณาลงชื่อก่อนบันทึก");
    }
  };

  // const handleNextClick = async () => {
  //   try {
  //     // ใช้ REFNO ตัวเดียวกับที่แสดงผล
  //     const payloadBase = {
  //       REFNO: refNoToUse,
  //       EMPID: EmpId,
  //       TEAMSALE: TeamSale,
  //       SALECODE: SaleCode,
  //       SUPEMPID: SupEmpId,
  //       SECEMPID: SecEmpId,
  //     };

  //     const updateContract = await axios.post(
  //       UPDATECONTACT,
  //       {
  //         ...payloadBase,
  //         FIELD: "CONTRACT",
  //         DATA: { createdAt: formattedDate, signature: signatureDataURL },
  //       },
  //       { headers: { "Content-Type": "application/json" } }
  //     );

  //     if (updateContract.status === 200) {
  //       const finishResponse = await axios.post(
  //         UPDATECONTACT,
  //         { ...payloadBase, FIELD: "PAYMENT", DATA: "DRAFT" },
  //         { headers: { "Content-Type": "application/json" } }
  //       );

  //       if (finishResponse.status === 200) {
  //         Swal.fire({
  //           icon: "success",
  //           title: "สำเร็จ!",
  //           text: "บันทึกสัญญาเรียบร้อยแล้ว",
  //           timer: 2000,
  //           showConfirmButton: false,
  //         }).then(() => {
  //           // ส่ง item ที่เรนเดอร์อยู่ (ผูก REFNO เดียวกัน)
  //           navigate("/firstBill/CreateFirstBill", { state: { item: data, from: location.pathname } });
  //         });
  //       } else {
  //         throw new Error("ไม่สามารถอัปเดตสถานะ PAYMENT ได้");
  //       }
  //     } else {
  //       throw new Error("ไม่สามารถอัปเดตสัญญาได้");
  //     }
  //   } catch (error) {
  //     console.error("Error updating contract or status:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "เกิดข้อผิดพลาด!",
  //       text: "ไม่สามารถบันทึกสัญญาหรืออัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง",
  //       confirmButtonText: "ตกลง",
  //     });
  //   }
  // };

  const handleNextClick = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    let succeeded = false;

    try {
      const payloadBase = {
        REFNO: refNoToUse,
        EMPID: EmpId,
        TEAMSALE: TeamSale,
        SALECODE: SaleCode,
        SUPEMPID: SupEmpId,
        SECEMPID: SecEmpId,
      };

      const updateContract = await axios.post(
        UPDATECONTACT,
        { ...payloadBase, FIELD: "CONTRACT", DATA: { createdAt: formattedDate, signature: signatureDataURL } },
        { headers: { "Content-Type": "application/json" } }
      );
      if (updateContract.status !== 200) throw new Error("ไม่สามารถอัปเดตสัญญาได้");

      const finishResponse = await axios.post(
        UPDATECONTACT,
        { ...payloadBase, FIELD: "PAYMENT", DATA: "DRAFT" },
        { headers: { "Content-Type": "application/json" } }
      );
      if (finishResponse.status !== 200) throw new Error("ไม่สามารถอัปเดตสถานะ PAYMENT ได้");

      succeeded = true;
      await Swal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: "บันทึกสัญญาเรียบร้อยแล้ว",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/firstBill/CreateFirstBill", { state: { item: data, from: location.pathname } });
    } catch (error) {
      console.error("Error updating contract or status:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถบันทึกสัญญาหรืออัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
      });
    } finally {
      if (!succeeded) setIsSubmitting(false); // สำเร็จแล้วจะ navigate ออก ไม่ต้องปลดล็อก
    }
  };

  const formatToBE = (isoDate?: string) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear() + 543;
    return `${dd}/${mm}/${yyyy}`;
  };

  const hasSigned = !!data?.CONTRACT?.[0]?.signature;
  const hasNewSignature = !!(signatureDataURL && signatureDataURL.trim().length > 0);
  const canShowSaveContractBtn = !hasSigned && hasNewSignature;

  return (
    <>
      <Content>
        <div style={{ position: "relative" }}>
          <div className="d-flex justify-content-between align-items-center my-5">
            <div className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
              <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                {data?.PRODUCT?.[0]?.Package?.[0]?.PACKAGETYPEID === 1 ? (
                  <li className={`breadcrumb-item ${styles.titlePage}`}>ใบสัญญา</li>
                ) : (
                  <li className={`breadcrumb-item ${styles.titlePage}`}>ใบสัญญาเช่าซื้อ</li>
                )}
              </ul>
            </div>
          </div>

          <p className={`${styles.label}`}>เลขที่ขาย:</p>
          <p className={`${styles.titlePage}`}>{refNoToUse}</p>

          {/* Card Body */}
          <div className="card mb-10">
            <div className="card-body py-5">
              <div className="row mb-7">
                <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>
                  วันที่ทำสัญญา
                </label>
                <div className="col-lg-8">
                  <span className={`fw-bolder text-gray-900 ${styles.label}`}>
                    {formatToBE(formattedDate)}
                  </span>
                </div>
              </div>

              {data?.NEWREFNO && (
                <div className="row mb-10">
                  <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                    เลขที่สัญญา
                  </label>
                  <div className="col-lg-8">
                    <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                      {data?.NEWREFNO}
                    </span>
                  </div>
                </div>
              )}

              <div className="row align-items-center mb-10">
                <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                  พนักงานขาย
                </label>
                <div className="col-lg-8 d-flex justify-content-between">
                  <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                    {data?.SALEEMPLOYEE?.[0]?.SALEEMPLOYEE?.FName}{" "}
                    {data?.SALEEMPLOYEE?.[0]?.SALEEMPLOYEE?.LName} -{" "}
                    {data?.SALEEMPLOYEE?.[0]?.SALEEMPLOYEE?.SaleEmp}
                  </span>
                </div>
              </div>

              <div className="row mb-7">
                <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>
                  ชื่อลูกค้า
                </label>
                <div className="col-lg-8">
                  <span className={`fw-bolder text-gray-900 ${styles.label}`}>
                    {data?.CUSTOMERDETAIL?.[0]?.PREFIX?.[0]?.PREFIXNAME || ""}{" "}
                    {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERNAME || ""}{" "}
                    {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERLASTNAME || ""}
                  </span>
                </div>
              </div>

              {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERID?.length > 0 && (
                <div className="row mb-7">
                  <label className={`col-lg-4 text-muted ${styles.label}`}>
                    {data.CUSTOMERDETAIL?.[0]?.CUSTOMERTYPE === "1"
                      ? "เลขประจำตัวผู้เสียภาษี"
                      : "เลขที่บัตรประชาชน"}
                  </label>
                  <div className="col-lg-8">
                    <span className={styles.label}>
                      {data.CUSTOMERDETAIL?.[0]?.CUSTOMERID}
                    </span>
                  </div>
                </div>
              )}

              {/* ที่อยู่ต่าง ๆ (ตัด logic เดิมมาวางเหมือนเดิม) */}
              {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSNUMBER && (
                <div className="row mb-7">
                  <label className={`col-lg-4 text-muted ${styles.label}`}>
                    ที่อยู่บัตรประชาชน
                  </label>
                  <div className="col-lg-8">
                    <span className={`${styles.label}`}>
                      {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSNUMBER || ""}&nbsp;
                      {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSMOO
                        ? `หมู่ที่ ${data.ADDRESS[0].ADDRESSCARD.ADDRESSMOO} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSSOI
                        ? `ซอย${data.ADDRESS[0].ADDRESSCARD.ADDRESSSOI} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSROAD
                        ? `ถนน${data.ADDRESS[0].ADDRESSCARD.ADDRESSROAD} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSSUBDISTRICTNAME && (
                        <>
                          {data.ADDRESS[0].ADDRESSCARD.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                            ? "แขวง"
                            : "ตำบล"}
                          {data.ADDRESS[0].ADDRESSCARD.ADDRESSSUBDISTRICTNAME}
                        </>
                      )}{" "}
                      {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSDISTRICTNAME && (
                        <>
                          {data.ADDRESS[0].ADDRESSCARD.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                            ? "เขต"
                            : "อำเภอ"}
                          {data.ADDRESS[0].ADDRESSCARD.ADDRESSDISTRICTNAME}
                        </>
                      )}{" "}
                      {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME
                        ? `จังหวัด${data.ADDRESS[0].ADDRESSCARD.ADDRESSPROVINCENAME} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSZIPCODE ||
                        ""}
                    </span>
                  </div>
                </div>
              )}

              {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER && (
                <div className="row mb-10">
                  <label className={`col-lg-4 text-muted ${styles.label}`}>
                    ที่อยู่ติดตั้ง
                  </label>
                  <div className="col-lg-8">
                    <span className={`${styles.label}`}>
                      {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER || ""}&nbsp;
                      {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSMOO
                        ? `หมู่ที่ ${data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSMOO} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSSOI
                        ? `ซอย${data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSSOI} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSROAD
                        ? `ถนน${data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSROAD} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME && (
                        <>
                          {data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                            ? "แขวง"
                            : "ตำบล"}
                          {data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME}
                        </>
                      )}{" "}
                      {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME && (
                        <>
                          {data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                            ? "เขต"
                            : "อำเภอ"}
                          {data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSDISTRICTNAME}
                        </>
                      )}{" "}
                      {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME
                        ? `จังหวัด${data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSPROVINCENAME} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE || ""}
                    </span>
                  </div>
                </div>
              )}

              {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER && (
                <div className="row mb-10">
                  <label className={`col-lg-4 text-muted ${styles.label}`}>
                    ที่อยู่เก็บเงิน
                  </label>
                  <div className="col-lg-8">
                    <span className={`${styles.label}`}>
                      {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER || ""}&nbsp;
                      {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSMOO
                        ? `หมู่ที่ ${data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSMOO} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSSOI
                        ? `ซอย${data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSSOI} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSROAD
                        ? `ถนน${data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSROAD} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME && (
                        <>
                          {data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                            ? "แขวง"
                            : "ตำบล"}
                          {data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME}
                        </>
                      )}{" "}
                      {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSDISTRICTNAME && (
                        <>
                          {data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                            ? "เขต"
                            : "อำเภอ"}
                          {data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSDISTRICTNAME}
                        </>
                      )}{" "}
                      {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME
                        ? `จังหวัด${data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSPROVINCENAME} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE || ""}
                    </span>
                  </div>
                </div>
              )}

              {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME && (
                <div className="row mb-10">
                  <label className={`col-lg-4 text-muted ${styles.label}`}>
                    ที่อยู่เสึยภาษี
                  </label>
                  <div className="col-lg-8">
                    <span className={`${styles.label}`}>
                      {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSNUMBER || ""}&nbsp;
                      {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSMOO
                        ? `หมู่ที่ ${data.ADDRESS[0].ADDRESSTAX.ADDRESSMOO} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSSOI
                        ? `ซอย${data.ADDRESS[0].ADDRESSTAX.ADDRESSSOI} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSROAD
                        ? `ถนน${data.ADDRESS[0].ADDRESSTAX.ADDRESSROAD} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSSUBDISTRICTNAME && (
                        <>
                          {data.ADDRESS[0].ADDRESSTAX.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                            ? "แขวง"
                            : "ตำบล"}
                          {data.ADDRESS[0].ADDRESSTAX.ADDRESSSUBDISTRICTNAME}
                        </>
                      )}{" "}
                      {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSDISTRICTNAME && (
                        <>
                          {data.ADDRESS[0].ADDRESSTAX.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                            ? "เขต"
                            : "อำเภอ"}
                          {data.ADDRESS[0].ADDRESSTAX.ADDRESSDISTRICTNAME}
                        </>
                      )}{" "}
                      {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME
                        ? `จังหวัด${data.ADDRESS[0].ADDRESSTAX.ADDRESSPROVINCENAME} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSZIPCODE || ""}
                    </span>
                  </div>
                </div>
              )}

              <div className="row mb-10">
                <label className={`col-lg-4 text-muted ${styles.label}`}>
                  เบอร์ที่ติดต่อได้
                </label>
                <div className="col-lg-8">
                  <span className={`${styles.label}`}>
                    {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERMOBILE ||
                      data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSPHONE ||
                      ""}
                  </span>
                </div>
              </div>

              {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERPHONE && (
                <div className="row mb-10">
                  <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                    เบอร์ที่ติดต่อได้ 2
                  </label>
                  <div className="col-lg-8">
                    <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                      {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERPHONE}
                    </span>
                  </div>
                </div>
              )}

              <div className="row mb-10">
                <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                  สินค้า
                </label>
                <div className="col-lg-8">
                  <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                    {data?.PRODUCT?.[0]?.ItemDescription}
                  </span>
                </div>
              </div>

              {data?.PRODUCT?.[1]?.ItemDescription && (
                <div className="row mb-10">
                  <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                    สินค้าบันเดิล
                  </label>
                  <div className="col-lg-8">
                    <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                      {data?.PRODUCT?.[1]?.ItemDescription}
                    </span>
                  </div>
                </div>
              )}

              {data?.PRODUCT?.[0]?.Package?.[0]?.PACKAGETITLE && (
                <div className="row mb-10">
                  <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                    แพ็คเกจ
                  </label>
                  <div className="col-lg-8">
                    <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                      {data?.PRODUCT?.[0]?.Package?.[0]?.PACKAGETITLE}
                    </span>
                  </div>
                </div>
              )}

              {data?.PRODUCT?.[0]?.Package?.[0]?.TOTALPRICE && (
                <div className="row align-items-center mb-10">
                  <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                    ราคาสินค้า
                  </label>
                  <div className="col-lg-8 d-flex justify-content-between">
                    <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                      {Number(data?.PRODUCT?.[0]?.Package?.[0]?.TOTALPRICE).toLocaleString()}
                    </span>
                    <span className="badge badge-light-success">บาท</span>
                  </div>
                </div>
              )}

              {data?.DISCOUNT?.[0]?.TRADEIN?.TRADEINBRANDNAME && (
                <div className="row align-items-center mb-10">
                  <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                    เครื่องเทิร์น
                  </label>
                  <div className="col-lg-8 d-flex justify-content-between">
                    <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                      {data?.DISCOUNT?.[0]?.TRADEIN?.TRADEINBRANDNAME || "ไม่มี"}
                    </span>
                  </div>
                </div>
              )}

              {data?.DISCOUNT?.[0]?.DISCOUNTAMOUNT && (
                <div className="row align-items-center mb-10">
                  <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                    ส่วนลด
                  </label>
                  <div className="col-lg-8 d-flex justify-content-between">
                    <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                      {Number(data?.DISCOUNT?.[0]?.DISCOUNTAMOUNT).toLocaleString()}
                    </span>
                    <span className="badge badge-light-success">บาท</span>
                  </div>
                </div>
              )}

              {data?.DISCOUNT?.[0]?.GIFT?.GIFTNAME && (
                <div className="row align-items-center mb-10">
                  <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                    ของแถม
                  </label>
                  <div className="col-lg-8 d-flex justify-content-between">
                    <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                      {data?.DISCOUNT?.[0]?.GIFT?.GIFTNAME || "ไม่มี"}
                    </span>
                  </div>
                </div>
              )}

              <div className="row align-items-center mb-10">
                <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                  ราคาสุทธิ
                </label>
                <div className="col-lg-8 d-flex justify-content-between">
                  <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                    {Number(netPrice).toLocaleString()}
                  </span>
                  <span className="badge badge-light-success">บาท</span>
                </div>
              </div>

              {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
              {data?.PRODUCT?.[0]?.Package?.[0]?.PACKAGETYPEID !== 1 && (
                <>
                  <div className="row align-items-center mb-10">
                    <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                      งวดที่ 1 ที่ต้องชำระ
                    </label>
                    <div className="col-lg-8 d-flex justify-content-between">
                      <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                        {Number(
                          (data?.PRODUCT?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT || 0) -
                          (discountAmount || 0)
                        ).toLocaleString()}
                      </span>
                      <span className="badge badge-light-success">บาท</span>
                    </div>
                  </div>

                  {data?.PRODUCT?.[0]?.Package?.[0]?.PERIODDETAILS?.length > 1 && (
                    <div className="row align-items-center mb-10">
                      <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                        งวดที่ 2 ถึง{" "}
                        {data?.PRODUCT?.[0]?.Package?.[0]?.PERIODDETAILS?.length} ต้องชำระงวดละ
                      </label>
                      <div className="col-lg-8 d-flex justify-content-between">
                        <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                          {Number(
                            data?.PRODUCT?.[0]?.Package?.[0]?.PERIODDETAILS?.[1]?.PAYMENTAMOUNT || 0
                          ).toLocaleString()}
                        </span>
                        <span className="badge badge-light-success">บาท</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* --------------------- ลายเซ็น --------------------- */}
              <div className="mb-5" style={{ maxWidth: 600, margin: "0 auto" }}>
                {hasSigned ? (
                  <div className="text-center">
                    <p className={`${styles.label} mb-3`}>ลายเซ็นลูกค้า</p>
                    <img
                      src={`data:image/png;base64,${data.CONTRACT[0].signature}`}
                      alt="signature"
                      className="img-fluid"
                      style={{ border: "1px solid #ccc", borderRadius: 4 }}
                    />
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        border: "1px solid #d7dbde",
                        borderRadius: 4,
                        width: "100%",
                        height: 200,
                        overflow: "hidden",
                      }}
                    >
                      <SignaturePad
                        ref={signaturePadRef}
                        options={{ minWidth: 1, maxWidth: 3, penColor: "black" }}
                        canvasProps={{ style: { width: "100%", height: "100%" } }}
                      />
                    </div>

                    <div className="my-5">
                      <button type="button" className={`${styles.btnDanger} mx-5`} onClick={clearSignature}>
                        ลบลายเซ็น
                      </button>
                      <button type="button" className={`${styles.btnPrimary}`} onClick={saveSignature}>
                        บันทึกลายเซ็น
                      </button>
                    </div>

                    {signatureDataURL && (
                      <div className="mt-3">
                        <img
                          src={`data:image/png;base64,${signatureDataURL}`}
                          alt="signature"
                          className="img-fluid"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {canShowSaveContractBtn && (
            <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
              <button
                className={`${styles.btnSecondary}`}
                onClick={() => navigate("/sale/overview")}
                disabled={isSubmitting}
              >
                กลับหน้าแรก
              </button>
              <button
                className={`${styles.btnPrimary}`}
                type="button"
                onClick={handleNextClick}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    กำลังบันทึก…
                  </>
                ) : (
                  "บันทึกสัญญา"
                )}
              </button>
            </div>
          )}

          {hasSigned && (
            <>
              <button className={`${styles.btnSecondary}`} onClick={() => navigate("/sale/overview")}>
                กลับหน้าแรก
              </button>
            </>
          )}

          {/******* หน้าจอเล็ก ******** */}
          {canShowSaveContractBtn && (
            <div className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
              style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1050 }}>
              <button
                className={`${styles.btnSecondary}`}
                onClick={() => navigate("/sale/overview")}
                disabled={isSubmitting}
              >
                กลับหน้าแรก
              </button>
              <button
                className={`${styles.btnPrimary}`}
                type="button"
                onClick={handleNextClick}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    กำลังบันทึก…
                  </>
                ) : (
                  "บันทึกสัญญา"
                )}
              </button>
            </div>
          )}

          {hasSigned && (
            <>
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
                <button className={`${styles.btnSecondary}`} onClick={() => navigate("/sale/overview")}>
                  กลับหน้าแรก
                </button>
              </div>
            </>
          )}
        </div>
      </Content>
    </>
  );
};

export default SalesContract;