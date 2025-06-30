// import { Link, useNavigate, useLocation } from 'react-router-dom'
// import axios from 'axios';
// import clsx from 'clsx'
// import { useState, useMemo, useEffect } from 'react'
// import { KTIcon, toAbsoluteUrl } from '../../../../_metronic/helpers'
// import { getLayoutFromLocalStorage, ILayout, LayoutSetup } from '../../../../_metronic/layout/core'
// import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
// import { Content } from '../../../../_metronic/layout/components/content'
// import { TablesWidget5 } from '../../../../_metronic/partials/widgets'
// import { useAuth } from '../../../modules/auth/core/Auth';
// import {
//     useUUIDStore,
//     useSaveProductStore,
//     useSaveDiscountStore,
//     useSaveCustomerStore,
//     useSaveAddressStore
// } from '../../../modules/stores/stepsStore';

// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// interface ContractState {
//     contNo: string;
// }

// interface ItemProps {
//     REFNO: String,
//     CONTNO: String,
//     EMPID: String,
//     TEAMSALE: String,
//     SALECODE: String,
//     SUPEMPID: String,
//     SECEMPID: String,
//     STATUS: String,
//     PRODUCT: [any],
//     CUSTOMERSTATUS: [any],
//     DISCOUNT: [any],
//     CUSTOMERDETAIL: [any],
//     ADDRESS: [any],
//     PDPA: [any],
//     CONTRACT: [any],
//     IMAGE: [any],
//     CHECKERCOMMENT: [any]
// }

// interface ImagesType {
//     IMAGECARD: string[];
//     IMAGEGPS: string[];
//     IMAGEMAP: string[];
//     IMAGECUSTOMERHOME: string[];
//     IMAGEINSTALLATION: string[];
//     IMAGETDS: string[];
//     IMAGECUSTOMER: string[];
//     IMAGETRADEIN: string[];
// }

// const UpdateSalesContract: React.FC = () => {
//     const navigate = useNavigate()
//     const location = useLocation();
//     const MySwal = withReactContent(Swal);

//     // const contNo = (location.state as ContractState)?.contNo;
//     // console.log(`contNo`, contNo);

//     const { auth } = useAuth();
//     const EmpId = auth?.data?.[0]?.EmpId || '';
//     const TeamSale = auth?.data?.[0]?.TeamSale || '';
//     const SaleCode = auth?.data?.[0]?.SaleCode || '';
//     const SupEmpId = auth?.data?.[0]?.SupEmp || '';
//     const SecEmpId = auth?.data?.[0]?.SecEmp || '';

//     const { REFNO } = useUUIDStore();

//     const item = location.state as ItemProps || [];
//     // console.log(`item`, item);
//     const refno = item?.REFNO
//     // console.log(`refno`, refno);

//     const product = item?.PRODUCT
//     // console.log(`product`, product);
//     const contNo = item?.CUSTOMERSTATUS[0]?.CONTNO
//     // console.log(`contNo`, contNo);
//     const customerDetail = item?.CUSTOMERDETAIL
//     const address = item?.ADDRESS

//     const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//     const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
//     const GET_IMAGES_API = `${API_URL_MONGO}/Contract/GetContractImage`;

//     const currentDate = new Date();
//     const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

//     const { PRODUCT } = useSaveProductStore()
//     // console.log(`PRODUCT`, PRODUCT[0].Package[0].PACKAGETYPEID);

//     const { DISCOUNT } = useSaveDiscountStore()
//     // console.log(`DISCOUNT`, DISCOUNT);

//     const { saveCustomerTypes } = useSaveCustomerStore()
//     // console.log(`saveCustomerTypes`, saveCustomerTypes);

//     const { addressCard, addressInstallation, addressPayment } = useSaveAddressStore()
//     // console.log(`addressCard`, addressCard)
//     // console.log(`addressInstallation`, addressInstallation)
//     // console.log(`addressPayment`, addressPayment)

//     const totalPrice = product[0]?.Package[0]?.TOTALPRICE || 0;
//     const discountAmount = item?.DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
//     const netPrice = totalPrice - discountAmount;

//     const [images, setImages] = useState<ImagesType | null>(null);
//     // console.log(`images`, images);

//     // fetch collection ContractImage
//     useEffect(() => {
//         const fetchImages = async () => {
//             try {
//                 const response = await axios.get(GET_IMAGES_API, {
//                     params: { REFNO: refno },
//                 });

//                 // ตรวจสอบว่า response.data เป็นไปตามโครงสร้างของ ImagesType
//                 const data = response.data;

//                 if (
//                     data &&
//                     typeof data === 'object' &&
//                     'IMAGECARD' in data &&
//                     'IMAGEGPS' in data &&
//                     'IMAGEMAP' in data &&
//                     'IMAGECUSTOMERHOME' in data &&
//                     'IMAGEINSTALLATION' in data &&
//                     'IMAGETDS' in data &&
//                     'IMAGETRADEIN' in data
//                 ) {
//                     setImages(data as ImagesType);
//                 } else {
//                     setImages(null);
//                 }
//             } catch (err) {
//                 console.error('Error fetching images:', err);
//                 setImages(null); // ตั้งค่าเป็น null หากมีข้อผิดพลาด
//             }
//         };

//         fetchImages();
//     }, [refno]);

//     const handleNextClick = async () => {
//         try {
//             const updateContract = await axios.post(UPDATECONTACT, {
//                 REFNO: refno,
//                 EMPID: EmpId,
//                 TEAMSALE: TeamSale,
//                 SALECODE: SaleCode,
//                 SUPEMPID: SupEmpId,
//                 SECEMPID: SecEmpId,
//                 FIELD: "CONTRACT",
//                 DATA: { createdAt: formattedDate }
//             }, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             // console.log(`updateContract CONTRACT: `, updateContract.data);

//             // แสดง SweetAlert2 หลังจากบันทึกสำเร็จ
//             Swal.fire({
//                 icon: 'success',
//                 title: 'สำเร็จ!',
//                 text: 'บันทึกสัญญาเรียบร้อยแล้ว',
//                 timer: 2000, // แสดงผล 3 วินาที
//                 showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
//             })
//         } catch (error) {
//             console.error('Error fetching CONTRACT:', error);

//             // แสดง SweetAlert2 เมื่อเกิดข้อผิดพลาด
//             Swal.fire({
//                 icon: 'error',
//                 title: 'เกิดข้อผิดพลาด!',
//                 text: 'ไม่สามารถบันทึกสัญญาได้ กรุณาลองใหม่อีกครั้ง',
//                 confirmButtonText: 'ตกลง'
//             });
//         }
//     };

//     const handleCheckerClick = async () => {
//         const response = await axios.post(UPDATECONTACT, {
//             REFNO: item.REFNO,
//             EMPID: EmpId,
//             TEAMSALE: TeamSale,
//             FIELD: "STATUS",
//             DATA: "PENDING",
//         }, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         // console.log(response)

//         if (response.status === 200) {
//             if (!response.data.data) {
//                 MySwal.fire('เกิดข้อผิดพลาด', 'ส่งข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา', 'error');
//             } else {
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'สำเร็จ!',
//                     text: 'ส่งข้อมูลตรวจสอบแล้ว',
//                     timer: 2000, // แสดงผล 3 วินาที
//                     showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
//                 })
//                 navigate("/sale/overview")
//             }
//         } else {
//             MySwal.fire('เกิดข้อผิดพลาด', response.data.message, 'error');
//         }
//     }

//     // เช็คว่า data ใน item มีครบทุกขั้นตอน (ไม่เป็น array เปล่า) ใช่ไหม ถ้าเป็นจะ disabled ปุ่มส่งตรวจสอบ
//     const isDataComplete = useMemo(() => {
//         // ตรวจสอบว่ามีรูปภาพในฟิลด์ใดฟิลด์หนึ่งใน images อย่างน้อย 1 รูป
//         const hasImages = images && Object.values(images).some(
//             (field) => Array.isArray(field) && field.length > 0
//         );

//         return (
//             Array.isArray(item.ADDRESS) && item.ADDRESS.length > 0 &&
//             Array.isArray(item.CUSTOMERDETAIL) && item.CUSTOMERDETAIL.length > 0 &&
//             Array.isArray(item.CUSTOMERSTATUS) && item.CUSTOMERSTATUS.length > 0 &&
//             Array.isArray(item.DISCOUNT) && item.DISCOUNT.length > 0 &&
//             Array.isArray(item.PDPA) && item.PDPA.length > 0 &&
//             Array.isArray(item.PRODUCT) && item.PRODUCT.length > 0 &&
//             hasImages
//         );
//     }, [item, images]);

//     return (
//         <>
//             <Content>
//                 <div className='d-flex justify-content-between align-items-center mb-7 mt-7 mt-lg-0'>
//                     <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
//                         data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//                         className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
//                         <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
//                             {product[0]?.Package[0]?.PACKAGETYPEID == 1 ? (
//                                 <span>ใบสัญญา</span>
//                             ) : (
//                                 <span>ใบสัญญาเช่าซื้อ</span>
//                             )}

//                         </h1>
//                         <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//                             <li className="breadcrumb-item text-muted">
//                                 <span className="text-muted text-hover-primary">
//                                     ระบบขาย
//                                 </span></li>
//                             <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
//                             {product[0]?.Package[0]?.PACKAGETYPEID == 1 ? (
//                                 <li className="breadcrumb-item text-gray-900">ใบสัญญา</li>
//                             ) : (
//                                 <li className="breadcrumb-item text-gray-900">ใบสัญญาเช่าซื้อ</li>
//                             )}
//                         </ul>
//                     </div>
//                 </div>
//                 <p>เลขที่ขาย: {refno}</p>

//                 {/* Card Body */}
//                 <div className='card mb-10'>
//                     <div className='card-body py-5'>

//                         {/* begin::Header */}
//                         <div className='d-flex justify-content-between align-items-center mb-7 mt-5'>
//                             {product[0]?.Package[0]?.PACKAGETYPEID == 1 ? (
//                                 <h3 className='card-title'>ใบสัญญา</h3>
//                             ) : (
//                                 <h3 className='card-title'>ใบสัญญาเช่าซื้อ</h3>
//                             )}
//                             <button
//                                 type='button'
//                                 className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
//                             >
//                                 <KTIcon iconName='category' className='fs-2' />
//                             </button>
//                         </div>
//                         {/* end::Header */}

//                         <div className='row mb-7'>
//                             <label className='col-lg-4 fw-bold text-muted'>วันที่ทำสัญญา</label>
//                             <div className='col-lg-8'>
//                                 <span className='fw-bolder fs-6 text-gray-900'>{formattedDate}</span>
//                             </div>
//                         </div>

//                         <div className='row mb-7'>
//                             <label className='col-lg-4 fw-bold text-muted'>เลขที่สัญญา</label>
//                             <div className='col-lg-8 fv-row'>
//                                 <span className='fw-bold fs-6'>{contNo}</span>
//                             </div>
//                         </div>

//                         <div className='row mb-7'>
//                             <label className='col-lg-4 fw-bold text-muted'>REFNO</label>
//                             <div className='col-lg-8 fv-row'>
//                                 <span className='fw-bold fs-6'>{refno}</span>
//                             </div>
//                         </div>

//                         <div className='row mb-7'>
//                             <label className='col-lg-4 fw-bold text-muted'>ชื่อลูกค้า</label>
//                             <div className='col-lg-8'>
//                                 <a href='#' className='fw-bold fs-6 text-gray-900 text-hover-primary'>
//                                     {customerDetail[0]?.CUSTOMERNAME}
//                                 </a>
//                             </div>
//                         </div>

//                         <div className='row mb-7'>
//                             {customerDetail[0]?.CUSTOMERTYPE === "1" ? (
//                                 <label className='col-lg-4 fw-bold text-muted'>เลขประจำตัวผู้เสียภาษี</label>
//                             ) : (
//                                 <label className='col-lg-4 fw-bold text-muted'>เลขที่บัตรประชาชน</label>
//                             )}
//                             <div className='col-lg-8'>
//                                 <span className='fw-bolder fs-6 text-gray-900'>{customerDetail[0]?.CUSTOMERID}</span>
//                             </div>
//                         </div>

//                         <div className='row mb-7'>
//                             <label className='col-lg-4 fw-bold text-muted'>ที่อยู่บัตรประชาชน</label>
//                             <div className='col-lg-8'>
//                                 <span className='fw-bolder fs-6 text-gray-900'>
//                                     {address[0]?.ADDRESSCARD?.ADDRESSNUMBER && `${address[0]?.ADDRESSCARD?.ADDRESSNUMBER}`}&nbsp;
//                                     {address[0]?.ADDRESSCARD?.ADDRESSMOO && `หมู่ที่ ${address[0]?.ADDRESSCARD?.ADDRESSMOO}`}&nbsp;
//                                     {address[0]?.ADDRESSCARD?.ADDRESSSOI && `ซอย ${address[0]?.ADDRESSCARD?.ADDRESSSOI}`}&nbsp;
//                                     {address[0]?.ADDRESSCARD?.ADDRESSROAD && `ถนน ${address[0]?.ADDRESSCARD?.ADDRESSROAD}`}&nbsp;
//                                     {address[0]?.ADDRESSCARD?.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${address[0]?.ADDRESSCARD?.ADDRESSSUBDISTRICTNAME}`}&nbsp;
//                                     {address[0]?.ADDRESSCARD?.ADDRESSDISTRICTNAME && `อำเภอ ${address[0]?.ADDRESSCARD?.ADDRESSDISTRICTNAME}`}&nbsp;
//                                     {address[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME && `จังหวัด ${address[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
//                                     {address[0]?.ADDRESSCARD?.ADDRESSZIPCODE && `${address[0]?.ADDRESSCARD?.ADDRESSZIPCODE}`}&nbsp;
//                                 </span>
//                             </div>
//                         </div>

//                         <div className='row mb-10'>
//                             <label className='col-lg-4 fw-bold text-muted'>ที่อยู่ติดตั้ง</label>
//                             <div className='col-lg-8'>
//                                 <span className='fw-bolder fs-6 text-gray-900'>
//                                     {address[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER && `${address[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER}`}&nbsp;
//                                     {address[0]?.ADDRESSINSTALLATION?.ADDRESSMOO && `หมู่ที่ ${address[0]?.ADDRESSINSTALLATION?.ADDRESSMOO}`}&nbsp;
//                                     {address[0]?.ADDRESSINSTALLATION?.ADDRESSSOI && `ซอย ${address[0]?.ADDRESSINSTALLATION?.ADDRESSSOI}`}&nbsp;
//                                     {address[0]?.ADDRESSINSTALLATION?.ADDRESSROAD && `ถนน ${address[0]?.ADDRESSINSTALLATION?.ADDRESSROAD}`}&nbsp;
//                                     {address[0]?.ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${address[0]?.ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME}`}&nbsp;
//                                     {address[0]?.ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME && `อำเภอ ${address[0]?.ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME}`}&nbsp;
//                                     {address[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME && `จังหวัด ${address[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
//                                     {address[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE && `${address[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE}`}&nbsp;
//                                 </span>
//                             </div>
//                         </div>

//                         <div className='row mb-10'>
//                             <label className='col-lg-4 fw-bold text-muted'>ที่อยู่เก็บเงิน</label>
//                             <div className='col-lg-8'>
//                                 <span className='fw-bolder fs-6 text-gray-900'>
//                                     {address[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER && `${address[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER}`}&nbsp;
//                                     {address[0]?.ADDRESSPAYMENT?.ADDRESSMOO && `หมู่ที่ ${address[0]?.ADDRESSPAYMENT?.ADDRESSMOO}`}&nbsp;
//                                     {address[0]?.ADDRESSPAYMENT?.ADDRESSSOI && `ซอย ${address[0]?.ADDRESSPAYMENT?.ADDRESSSOI}`}&nbsp;
//                                     {address[0]?.ADDRESSPAYMENT?.ADDRESSROAD && `ถนน ${address[0]?.ADDRESSPAYMENT?.ADDRESSROAD}`}&nbsp;
//                                     {address[0]?.ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${address[0]?.ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME}`}&nbsp;
//                                     {address[0]?.ADDRESSPAYMENT?.ADDRESSDISTRICTNAME && `อำเภอ ${address[0]?.ADDRESSPAYMENT?.ADDRESSDISTRICTNAME}`}&nbsp;
//                                     {address[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME && `จังหวัด ${address[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
//                                     {address[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE && `${address[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE}`}&nbsp;
//                                 </span>
//                             </div>
//                         </div>

//                         {address[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME && (
//                             <div className='row mb-10'>
//                                 <label className='col-lg-4 fw-bold text-muted'>ที่อยู่เสึยภาษี</label>
//                                 <div className='col-lg-8'>
//                                     <span className='fw-bolder fs-6 text-gray-900'>
//                                         {address[0]?.ADDRESSTAX?.ADDRESSNUMBER && `${address[0]?.ADDRESSTAX?.ADDRESSNUMBER}`}&nbsp;
//                                         {address[0]?.ADDRESSTAX?.ADDRESSMOO && `หมู่ที่ ${address[0]?.ADDRESSTAX?.ADDRESSMOO}`}&nbsp;
//                                         {address[0]?.ADDRESSTAX?.ADDRESSSOI && `ซอย ${address[0]?.ADDRESSTAX?.ADDRESSSOI}`}&nbsp;
//                                         {address[0]?.ADDRESSTAX?.ADDRESSROAD && `ถนน ${address[0]?.ADDRESSTAX?.ADDRESSROAD}`}&nbsp;
//                                         {address[0]?.ADDRESSTAX?.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${address[0]?.ADDRESSTAX?.ADDRESSSUBDISTRICTNAME}`}&nbsp;
//                                         {address[0]?.ADDRESSTAX?.ADDRESSDISTRICTNAME && `อำเภอ ${address[0]?.ADDRESSTAX?.ADDRESSDISTRICTNAME}`}&nbsp;
//                                         {address[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME && `จังหวัด ${address[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
//                                         {address[0]?.ADDRESSTAX?.ADDRESSZIPCODE && `${address[0]?.ADDRESSTAX?.ADDRESSZIPCODE}`}&nbsp;
//                                     </span>
//                                 </div>
//                             </div>
//                         )}

//                         < div className='row mb-10'>
//                             <label className='col-lg-4 fw-bold text-muted'>เบอร์โทรติดต่อ</label>
//                             <div className='col-lg-8'>
//                                 <span className='fw-bold fs-6'>{customerDetail[0]?.CUSTOMERMOBILE}</span>
//                             </div>
//                         </div>

//                         <div className='row mb-10'>
//                             <label className='col-lg-4 fw-bold text-muted'>สินค้า</label>
//                             <div className='col-lg-8'>
//                                 <span className='fw-bold fs-6'>{product[0]?.ItemDescription}</span>
//                             </div>
//                         </div>

//                         {product[0]?.Package[0]?.PACKAGETITLE && (
//                             <div className='row mb-10'>
//                                 <label className='col-lg-4 fw-bold text-muted'>แพ็คเกจ</label>
//                                 <div className='col-lg-8'>
//                                     <span className='fw-bold fs-6'>{product[0]?.Package[0]?.PACKAGETITLE}</span>
//                                 </div>
//                             </div>
//                         )}

//                         {item?.DISCOUNT[0]?.GIFT && (
//                             <div className='row align-items-center mb-10'>
//                                 <label className='col-lg-4 fw-bold text-muted mb-0'>ของแถม</label>
//                                 <div className='col-lg-8 d-flex justify-content-between'>
//                                     <span className='fw-bold fs-6'>
//                                         {item?.DISCOUNT[0]?.GIFT?.GIFTNAME ? item?.DISCOUNT[0]?.GIFT?.GIFTNAME : "ไม่มี"}
//                                     </span>
//                                 </div>
//                             </div>
//                         )}

//                         <div className='row align-items-center mb-10'>
//                             <label className='col-lg-4 fw-bold text-muted mb-0'>ราคาสินค้า</label>
//                             <div className='col-lg-8 d-flex justify-content-between'>
//                                 <span className='fw-bold fs-6'>
//                                     {product[0]?.Package[0]?.TOTALPRICE !== undefined
//                                         ? product[0]?.Package[0]?.TOTALPRICE.toLocaleString()
//                                         : '0'}
//                                 </span>
//                                 <span className='badge badge-light-success'>บาท</span>
//                             </div>
//                         </div>

//                         {item?.DISCOUNT[0] && item?.DISCOUNT[0]?.TRADEIN?.HASTRADEIN !== 0 && (
//                             <div className='row align-items-center mb-10'>
//                                 <label className='col-lg-4 fw-bold text-muted mb-0'>เครื่องเทิร์น</label>
//                                 <div className='col-lg-8 d-flex justify-content-between'>
//                                     <span className='fw-bold fs-6'>
//                                         {item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME ? item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME : "ไม่มี"}
//                                     </span>
//                                 </div>
//                             </div>
//                         )}

//                         <div className='row align-items-center mb-10'>
//                             <label className='col-lg-4 fw-bold text-muted mb-0'>ส่วนลด</label>
//                             <div className='col-lg-8 d-flex justify-content-between'>
//                                 <span className='fw-bold fs-6'>
//                                     {typeof item?.DISCOUNT?.[0]?.DISCOUNTAMOUNT === 'number'
//                                         ? item?.DISCOUNT?.[0]?.DISCOUNTAMOUNT.toLocaleString()
//                                         : "ไม่มี"}
//                                 </span>
//                                 <span className='badge badge-light-success'>บาท</span>
//                             </div>
//                         </div>

//                         <div className='row align-items-center mb-10'>
//                             <label className='col-lg-4 fw-bold text-muted mb-0'>ราคาสุทธิ</label>
//                             <div className='col-lg-8 d-flex justify-content-between'>
//                                 <span className='fw-bold fs-6'>
//                                     {netPrice !== undefined ? netPrice.toLocaleString() : '0'}
//                                 </span>
//                                 <span className='badge badge-light-success'>บาท</span>
//                             </div>
//                         </div>

//                         {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
//                         {product[0]?.Package[0]?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT !== undefined && (
//                             <>
//                                 <div className='row align-items-center mb-10'>
//                                     <label className='col-lg-4 fw-bold text-muted mb-0'>งวดที่ 1 ที่ต้องชำระ</label>
//                                     <div className='col-lg-8 d-flex justify-content-between'>
//                                         <span className='fw-bold fs-6'>{(product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT - discountAmount).toLocaleString()}</span>
//                                         <span className='badge badge-light-success'>บาท</span>
//                                     </div>
//                                 </div>

//                                 {product[0]?.Package[0]?.PERIODDETAILS.length > 1 && (
//                                     <div className='row align-items-center mb-10'>
//                                         <label className='col-lg-4 fw-bold text-muted mb-0'>งวดที่ 2 ถึง {product[0]?.Package[0]?.PERIODDETAILS.length} ต้องชำระงวดละ</label>
//                                         <div className='col-lg-8 d-flex justify-content-between'>
//                                             <span className='fw-bold fs-6'>{(product[0]?.Package[0]?.PERIODDETAILS[1]?.PAYMENTAMOUNT).toLocaleString()}</span>
//                                             <span className='badge badge-light-success'>บาท</span>
//                                         </div>
//                                     </div>
//                                 )}
//                             </>
//                         )}

//                     </div>
//                 </div>
//                 {/* End Card Body */}

//                 <div className='d-none d-xl-flex justify-content-between align-items-center my-5'>
//                     <button
//                         className='btn btn-secondary w-100 w-md-auto align-self-center h-50px'
//                         onClick={() => navigate('/sale/step', { state: item })}>
//                         ย้อนกลับ
//                     </button>
//                     <button
//                         className={`btn btn-primary w-100 w-md-auto align-self-center h-50px ${!isDataComplete ? `disabled` : ``}`}
//                         disabled={!isDataComplete}
//                         onClick={handleCheckerClick}
//                     >
//                         ส่งตรวจสอบ
//                     </button>
//                 </div>

//                 {/* ปุ่มในหน้าจอเล็ก */}
//                 <div
//                     className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
//                     style={{
//                         position: "fixed",
//                         bottom: 0,
//                         left: 0,
//                         right: 0,
//                         zIndex: 1050,
//                     }}
//                 >
//                     <button
//                         className="btn btn-secondary w-auto me-2"
//                         onClick={() => navigate('/sale/step', { state: item })}
//                     >
//                         ย้อนกลับ
//                     </button>
//                     <button
//                         className={`btn btn-primary w-auto ${!isDataComplete ? `disabled` : ``}`}
//                         disabled={!isDataComplete}
//                         onClick={handleCheckerClick}
//                     >
//                         ส่งตรวจสอบ
//                     </button>
//                 </div>

//             </Content >
//         </>
//     )
// }

// export default UpdateSalesContract

import styles from '@/styles/style.module.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios';
import clsx from 'clsx'
import { useState, useMemo, useEffect } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../../_metronic/helpers'
import { getLayoutFromLocalStorage, ILayout, LayoutSetup } from '../../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'
import { TablesWidget5 } from '../../../../_metronic/partials/widgets'
import { useAuth } from '../../../modules/auth/core/Auth';
import {
    useUUIDStore,
    useSaveProductStore,
    useSaveDiscountStore,
    useSaveCustomerStore,
    useSaveAddressStore
} from '../../../modules/stores/stepsStore';

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

interface ImagesType {
    IMAGECARD: string[];
    IMAGEGPS: string[];
    IMAGEMAP: string[];
    IMAGECUSTOMERHOME: string[];
    IMAGEINSTALLATION: string[];
    IMAGETDS: string[];
    IMAGECUSTOMER: string[];
    IMAGETRADEIN: string[];
}

const UpdateSalesContract: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const MySwal = withReactContent(Swal);

    // const contNo = (location.state as ContractState)?.contNo;
    // console.log(`contNo`, contNo);

    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const { REFNO } = useUUIDStore();

    // const item = location.state as ItemProps || [];
    const item = (location.state as ItemProps) || ({} as ItemProps);

    console.log(`item`, item);
    const refno = item?.REFNO
    // console.log(`refno`, refno);

    const product = item?.PRODUCT
    // console.log(`product`, product);
    const newRefNo = item?.CUSTOMERSTATUS[0]?.NEWREFNO
    // console.log(`contNo`, contNo);
    const customerDetail = item?.CUSTOMERDETAIL
    const address = item?.ADDRESS

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
    const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`
    const GET_IMAGES_API = `${API_URL_MONGO}/Contract/GetContractImage`;

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

    const { PRODUCT } = useSaveProductStore()
    // console.log(`PRODUCT`, PRODUCT[0].Package[0].PACKAGETYPEID);

    const { DISCOUNT } = useSaveDiscountStore()
    // console.log(`DISCOUNT`, DISCOUNT);

    const { saveCustomerTypes } = useSaveCustomerStore()
    // console.log(`saveCustomerTypes`, saveCustomerTypes);

    const { addressCard, addressInstallation, addressPayment } = useSaveAddressStore()
    // console.log(`addressCard`, addressCard)
    // console.log(`addressInstallation`, addressInstallation)
    // console.log(`addressPayment`, addressPayment)

    const totalPrice = product[0]?.Package[0]?.TOTALPRICE || 0;
    const discountAmount = item?.DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
    const netPrice = totalPrice - discountAmount;

    const [images, setImages] = useState<ImagesType | null>(null);
    // console.log(`images`, images);

    // fetch collection ContractImage
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(GET_IMAGES_API, {
                    params: { REFNO: refno },
                });

                // ตรวจสอบว่า response.data เป็นไปตามโครงสร้างของ ImagesType
                const data = response.data;

                if (
                    data &&
                    typeof data === 'object' &&
                    'IMAGECARD' in data &&
                    'IMAGEGPS' in data &&
                    'IMAGEMAP' in data &&
                    'IMAGECUSTOMERHOME' in data &&
                    'IMAGEINSTALLATION' in data &&
                    'IMAGETDS' in data &&
                    'IMAGETRADEIN' in data
                ) {
                    setImages(data as ImagesType);
                } else {
                    setImages(null);
                }
            } catch (err) {
                console.error('Error fetching images:', err);
                setImages(null); // ตั้งค่าเป็น null หากมีข้อผิดพลาด
            }
        };

        fetchImages();
    }, [refno]);

    // const handleNextClick = async () => {
    //     try {
    //         const updateContract = await axios.post(UPDATECONTACT, {
    //             REFNO: refno,
    //             EMPID: EmpId,
    //             TEAMSALE: TeamSale,
    //             SALECODE: SaleCode,
    //             SUPEMPID: SupEmpId,
    //             SECEMPID: SecEmpId,
    //             FIELD: "CONTRACT",
    //             DATA: { createdAt: formattedDate }
    //         }, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         // console.log(`updateContract CONTRACT: `, updateContract.data);

    //         // แสดง SweetAlert2 หลังจากบันทึกสำเร็จ
    //         Swal.fire({
    //             icon: 'success',
    //             title: 'สำเร็จ!',
    //             text: 'บันทึกสัญญาเรียบร้อยแล้ว',
    //             timer: 2000, // แสดงผล 3 วินาที
    //             showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
    //         }).then(() => {
    //             // navigate("/sale/photo", {
    //             //     state: {
    //             //         ...matchedItem,
    //             //     }
    //             // })
    //             navigate('/firstBill/CreateFirstBill', {
    //                 state: {
    //                     item: matchedItem,
    //                     from: location.pathname
    //                 }
    //             })
    //         });
    //     } catch (error) {
    //         console.error('Error fetching CONTRACT:', error);

    //         // แสดง SweetAlert2 เมื่อเกิดข้อผิดพลาด
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'เกิดข้อผิดพลาด!',
    //             text: 'ไม่สามารถบันทึกสัญญาได้ กรุณาลองใหม่อีกครั้ง',
    //             confirmButtonText: 'ตกลง'
    //         });
    //     }
    // };

    const handleNextClick = async () => {
        try {
            // 1) อัพเดตสัญญา (CONTRACT)
            const updateContract = await axios.post(UPDATECONTACT, {
                REFNO: refno,
                EMPID: EmpId,
                TEAMSALE: TeamSale,
                SALECODE: SaleCode,
                SUPEMPID: SupEmpId,
                SECEMPID: SecEmpId,
                FIELD: "CONTRACT",
                DATA: { createdAt: formattedDate }
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            // 2) ถ้าสำเร็จ ก็อัพเดตสถานะเป็น FINISH
            if (updateContract.status === 200) {
                const finishResponse = await axios.post(UPDATECONTACT, {
                    REFNO: refno,
                    EMPID: EmpId,
                    TEAMSALE: TeamSale,
                    SALECODE: SaleCode,
                    SUPEMPID: SupEmpId,
                    SECEMPID: SecEmpId,
                    // FIELD: 'STATUS',
                    // DATA: 'FINISH',
                    FIELD: "PAYMENT",
                    DATA: "DRAFT"
                }, {
                    headers: { 'Content-Type': 'application/json' },
                });
                console.log(`finishResponse`, finishResponse);


                if (finishResponse.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'สำเร็จ!',
                        text: 'บันทึกสัญญาเรียบร้อยแล้ว',
                        timer: 2000,
                        showConfirmButton: false,
                    }).then(() => {
                        console.log(`matchedItem`, matchedItem);
                        
                        navigate('/firstBill/CreateFirstBill', {
                            state: {
                                item: item,
                                from: location.pathname
                            }
                        });
                    });
                } else {
                    throw new Error('อัพเดตสถานะไม่สำเร็จ');
                }
            } else {
                throw new Error('อัพเดตสัญญาไม่สำเร็จ');
            }

        } catch (error) {
            console.error('Error updating contract or status:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: 'ไม่สามารถบันทึกสัญญาได้ กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง'
            });
        }
    };

    const handleCheckerClick = async () => {
        const response = await axios.post(UPDATECONTACT, {
            REFNO: item.REFNO,
            EMPID: EmpId,
            TEAMSALE: TeamSale,
            FIELD: "STATUS",
            DATA: "PENDING",
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // console.log(response)

        if (response.status === 200) {
            if (!response.data.data) {
                MySwal.fire('เกิดข้อผิดพลาด', 'ส่งข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา', 'error');
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ!',
                    text: 'ส่งข้อมูลตรวจสอบแล้ว',
                    timer: 2000, // แสดงผล 3 วินาที
                    showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
                })
                navigate("/sale/overview")
            }
        } else {
            MySwal.fire('เกิดข้อผิดพลาด', response.data.message, 'error');
        }
    }

    // เช็คว่า data ใน item มีครบทุกขั้นตอน (ไม่เป็น array เปล่า) ใช่ไหม ถ้าเป็นจะ disabled ปุ่มส่งตรวจสอบ
    const isDataComplete = useMemo(() => {
        // ตรวจสอบว่ามีรูปภาพในฟิลด์ใดฟิลด์หนึ่งใน images อย่างน้อย 1 รูป
        const hasImages = images && Object.values(images).some(
            (field) => Array.isArray(field) && field.length > 0
        );

        return (
            Array.isArray(item.ADDRESS) && item.ADDRESS.length > 0 &&
            Array.isArray(item.CUSTOMERDETAIL) && item.CUSTOMERDETAIL.length > 0 &&
            Array.isArray(item.CUSTOMERSTATUS) && item.CUSTOMERSTATUS.length > 0 &&
            Array.isArray(item.DISCOUNT) && item.DISCOUNT.length > 0 &&
            Array.isArray(item.PDPA) && item.PDPA.length > 0 &&
            Array.isArray(item.PRODUCT) && item.PRODUCT.length > 0 &&
            hasImages
        );
    }, [item, images]);

    {/****** matchedItem *******/ }
    const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false);
    const [draft, setDraft] = useState<any[]>([]);

    useEffect(() => {
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
        getDataDraft();
    }, []);

    // state ตัวเก็บ matchedItem
    const [matchedItem, setMatchedItem] = useState<ItemProps | null>(null);

    useEffect(() => {
        if (!isLoadingDraft) {
            const found = draft.find(d => d.REFNO === REFNO) || null;
            setMatchedItem(found);
        }
    }, [draft, isLoadingDraft]);

    {/****** matchedItem *******/ }

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center my-5'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-ceดnter">
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            {product[0]?.Package[0]?.PACKAGETYPEID == 1 ? (
                                <li className={`breadcrumb-item ${styles.titlePage}`}>ใบสัญญา</li>
                            ) : (
                                <li className={`breadcrumb-item ${styles.titlePage}`}>ใบสัญญาเช่าซื้อ</li>
                            )}
                        </ul>
                    </div>
                </div>
                <span className={`${styles.fontSize}`}>เลขที่ขาย: </span><span className={`${styles.titlePage}`}>{refno}</span>

                {/* Card Body */}
                <div className='card mb-10'>
                    <div className='card-body py-5'>

                        <div className='row my-7'>
                            <label className={`col-lg-4 text-muted ${styles.label}`}>วันที่ทำสัญญา</label>
                            <div className='col-lg-8'>
                                <span className={`${styles.label}`}>{formattedDate}</span>
                            </div>
                        </div>

                        {/* {newRefNo && (
                            <div className='row mb-7'>
                                <label className='col-lg-4 fw-bold text-muted'>เลขที่สัญญา</label>
                                <div className='col-lg-8 fv-row'>
                                    <span className='fw-bold fs-6'>{newRefNo}</span>
                                </div>
                            </div>
                        )} */}

                        <div className='row mb-7'>
                            <label className={`col-lg-4 text-muted ${styles.label}`}>ชื่อลูกค้า</label>
                            <div className='col-lg-8'>
                                <span className={`${styles.label}`}>
                                    {customerDetail[0]?.CUSTOMERNAME} {customerDetail[0]?.CUSTOMERLASTNAME}
                                </span>
                            </div>
                        </div>

                        {customerDetail[0]?.CUSTOMERID && (
                            <div className='row mb-7'>
                                {customerDetail[0].CUSTOMERTYPE === "1" ? (
                                    <label className={`col-lg-4 text-muted ${styles.label}`}>เลขประจำตัวผู้เสียภาษี</label>
                                ) : (
                                    <label className={`col-lg-4 text-muted ${styles.label}`}>เลขที่บัตรประชาชน</label>
                                )}
                                <div className='col-lg-8'>
                                    <span className={`${styles.label}`}>
                                        {customerDetail[0]?.CUSTOMERID}
                                    </span>
                                </div>
                            </div>
                        )}

                        {address[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER && (
                            <div className='row mb-10'>
                                <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่ติดตั้ง</label>
                                <div className='col-lg-8'>
                                    <span className={`${styles.label}`}>
                                        {address[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER && `${address[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER}`}&nbsp;
                                        {address[0]?.ADDRESSINSTALLATION?.ADDRESSMOO && `หมู่ที่ ${address[0]?.ADDRESSINSTALLATION?.ADDRESSMOO}`}&nbsp;
                                        {address[0]?.ADDRESSINSTALLATION?.ADDRESSSOI && `ซอย ${address[0]?.ADDRESSINSTALLATION?.ADDRESSSOI}`}&nbsp;
                                        {address[0]?.ADDRESSINSTALLATION?.ADDRESSROAD && `ถนน ${address[0]?.ADDRESSINSTALLATION?.ADDRESSROAD}`}&nbsp;
                                        {address[0]?.ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${address[0]?.ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME}`}&nbsp;
                                        {address[0]?.ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME && `อำเภอ ${address[0]?.ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME}`}&nbsp;
                                        {address[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME && `จังหวัด ${address[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
                                        {address[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE && `${address[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE}`}&nbsp;
                                    </span>
                                </div>
                            </div>
                        )}

                        {address[0]?.ADDRESSCARD?.ADDRESSNUMBER && (
                            <div className='row mb-7'>
                                <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่บัตรประชาชน</label>
                                <div className='col-lg-8'>
                                    <span className={`${styles.label}`}>
                                        {address[0]?.ADDRESSCARD?.ADDRESSNUMBER && `${address[0]?.ADDRESSCARD?.ADDRESSNUMBER}`}&nbsp;
                                        {address[0]?.ADDRESSCARD?.ADDRESSMOO && `หมู่ที่ ${address[0]?.ADDRESSCARD?.ADDRESSMOO}`}&nbsp;
                                        {address[0]?.ADDRESSCARD?.ADDRESSSOI && `ซอย ${address[0]?.ADDRESSCARD?.ADDRESSSOI}`}&nbsp;
                                        {address[0]?.ADDRESSCARD?.ADDRESSROAD && `ถนน ${address[0]?.ADDRESSCARD?.ADDRESSROAD}`}&nbsp;
                                        {address[0]?.ADDRESSCARD?.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${address[0]?.ADDRESSCARD?.ADDRESSSUBDISTRICTNAME}`}&nbsp;
                                        {address[0]?.ADDRESSCARD?.ADDRESSDISTRICTNAME && `อำเภอ ${address[0]?.ADDRESSCARD?.ADDRESSDISTRICTNAME}`}&nbsp;
                                        {address[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME && `จังหวัด ${address[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
                                        {address[0]?.ADDRESSCARD?.ADDRESSZIPCODE && `${address[0]?.ADDRESSCARD?.ADDRESSZIPCODE}`}&nbsp;
                                    </span>
                                </div>
                            </div>
                        )}

                        {address[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER && (
                            <div className='row mb-10'>
                                <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่เก็บเงิน</label>
                                <div className='col-lg-8'>
                                    <span className={`${styles.label}`}>
                                        {address[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER && `${address[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER}`}&nbsp;
                                        {address[0]?.ADDRESSPAYMENT?.ADDRESSMOO && `หมู่ที่ ${address[0]?.ADDRESSPAYMENT?.ADDRESSMOO}`}&nbsp;
                                        {address[0]?.ADDRESSPAYMENT?.ADDRESSSOI && `ซอย ${address[0]?.ADDRESSPAYMENT?.ADDRESSSOI}`}&nbsp;
                                        {address[0]?.ADDRESSPAYMENT?.ADDRESSROAD && `ถนน ${address[0]?.ADDRESSPAYMENT?.ADDRESSROAD}`}&nbsp;
                                        {address[0]?.ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${address[0]?.ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME}`}&nbsp;
                                        {address[0]?.ADDRESSPAYMENT?.ADDRESSDISTRICTNAME && `อำเภอ ${address[0]?.ADDRESSPAYMENT?.ADDRESSDISTRICTNAME}`}&nbsp;
                                        {address[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME && `จังหวัด ${address[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
                                        {address[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE && `${address[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE}`}&nbsp;
                                    </span>
                                </div>
                            </div>
                        )}

                        {address[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME && (
                            <div className='row mb-10'>
                                <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่เสึยภาษี</label>
                                <div className='col-lg-8'>
                                    <span className={`${styles.label}`}>
                                        {address[0]?.ADDRESSTAX?.ADDRESSNUMBER && `${address[0]?.ADDRESSTAX?.ADDRESSNUMBER}`}&nbsp;
                                        {address[0]?.ADDRESSTAX?.ADDRESSMOO && `หมู่ที่ ${address[0]?.ADDRESSTAX?.ADDRESSMOO}`}&nbsp;
                                        {address[0]?.ADDRESSTAX?.ADDRESSSOI && `ซอย ${address[0]?.ADDRESSTAX?.ADDRESSSOI}`}&nbsp;
                                        {address[0]?.ADDRESSTAX?.ADDRESSROAD && `ถนน ${address[0]?.ADDRESSTAX?.ADDRESSROAD}`}&nbsp;
                                        {address[0]?.ADDRESSTAX?.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${address[0]?.ADDRESSTAX?.ADDRESSSUBDISTRICTNAME}`}&nbsp;
                                        {address[0]?.ADDRESSTAX?.ADDRESSDISTRICTNAME && `อำเภอ ${address[0]?.ADDRESSTAX?.ADDRESSDISTRICTNAME}`}&nbsp;
                                        {address[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME && `จังหวัด ${address[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
                                        {address[0]?.ADDRESSTAX?.ADDRESSZIPCODE && `${address[0]?.ADDRESSTAX?.ADDRESSZIPCODE}`}&nbsp;
                                    </span>
                                </div>
                            </div>
                        )}

                        < div className='row mb-10'>
                            <label className={`col-lg-4 text-muted ${styles.label}`}>เบอร์โทรติดต่อ</label>
                            <div className='col-lg-8'>
                                <span className={`${styles.label}`}>
                                    {customerDetail[0]?.CUSTOMERMOBILE ?
                                        customerDetail[0]?.CUSTOMERMOBILE :
                                        address[0]?.ADDRESSINSTALLATION?.ADDRESSPHONE}
                                </span>
                            </div>
                        </div>

                        <div className='row mb-10'>
                            <label className={`col-lg-4 text-muted ${styles.label}`}>สินค้า</label>
                            <div className='col-lg-8'>
                                <span className={`${styles.label}`}>{product[0]?.ItemDescription}</span>
                            </div>
                        </div>

                        {product[0]?.Package[0]?.PACKAGETITLE && (
                            <div className='row mb-10'>
                                <label className={`col-lg-4 text-muted ${styles.label}`}>แพ็คเกจ</label>
                                <div className='col-lg-8'>
                                    <span className={`${styles.label}`}>{product[0]?.Package[0]?.PACKAGETITLE}</span>
                                </div>
                            </div>
                        )}

                        {item?.DISCOUNT[0]?.GIFT && (
                            <div className='row align-items-center mb-10'>
                                <label className={`col-lg-4 text-muted ${styles.label}`}>ของแถม</label>
                                <div className='col-lg-8 d-flex justify-content-between'>
                                    <span className={`${styles.label}`}>
                                        {item?.DISCOUNT[0]?.GIFT?.GIFTNAME ? item?.DISCOUNT[0]?.GIFT?.GIFTNAME : "ไม่มี"}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className='row align-items-center mb-10'>
                            <label className={`col-lg-4 text-muted ${styles.label}`}>ราคาสินค้า</label>
                            <div className='col-lg-8 d-flex justify-content-between'>
                                <span className={`${styles.label}`}>
                                    {product[0]?.Package[0]?.TOTALPRICE !== undefined
                                        ? product[0]?.Package[0]?.TOTALPRICE.toLocaleString()
                                        : '0'}
                                </span>
                                <span className='badge badge-light-success'>บาท</span>
                            </div>
                        </div>

                        {item?.DISCOUNT[0] && item?.DISCOUNT[0]?.TRADEIN?.HASTRADEIN !== 0 && (
                            <div className='row align-items-center mb-10'>
                                <label className={`col-lg-4 text-muted ${styles.label}`}>เครื่องเทิร์น</label>
                                <div className='col-lg-8 d-flex justify-content-between'>
                                    <span className={`${styles.label}`}>
                                        {item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME ? item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME : "ไม่มี"}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className='row align-items-center mb-10'>
                            <label className={`col-lg-4 text-muted ${styles.label}`}>ส่วนลด</label>
                            <div className='col-lg-8 d-flex justify-content-between'>
                                <span className={`${styles.label}`}>
                                    {typeof item?.DISCOUNT?.[0]?.DISCOUNTAMOUNT === 'number'
                                        ? item?.DISCOUNT?.[0]?.DISCOUNTAMOUNT.toLocaleString()
                                        : "ไม่มี"}
                                </span>
                                <span className='badge badge-light-success'>บาท</span>
                            </div>
                        </div>

                        <div className='row align-items-center mb-10'>
                            <label className={`col-lg-4 text-muted ${styles.label}`}>ราคาสุทธิ</label>
                            <div className='col-lg-8 d-flex justify-content-between'>
                                <span className={`${styles.label}`}>
                                    {netPrice !== undefined ? netPrice.toLocaleString() : '0'}
                                </span>
                                <span className='badge badge-light-success'>บาท</span>
                            </div>
                        </div>

                        {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
                        {product[0]?.Package[0]?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT !== undefined &&
                            product[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
                                <>
                                    <div className='row align-items-center mb-10'>
                                        <label className={`col-lg-4 text-muted ${styles.label}`}>งวดที่ 1 ที่ต้องชำระ</label>
                                        <div className='col-lg-8 d-flex justify-content-between'>
                                            <span className={`${styles.label}`}>{(product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT - discountAmount).toLocaleString()}</span>
                                            <span className='badge badge-light-success'>บาท</span>
                                        </div>
                                    </div>

                                    {product[0]?.Package[0]?.PERIODDETAILS.length > 1 && (
                                        <div className='row align-items-center mb-10'>
                                            <label className={`col-lg-4 text-muted ${styles.label}`}>งวดที่ 2 ถึง {product[0]?.Package[0]?.PERIODDETAILS.length} ต้องชำระงวดละ</label>
                                            <div className='col-lg-8 d-flex justify-content-between'>
                                                <span className={`${styles.label}`}>{(product[0]?.Package[0]?.PERIODDETAILS[1]?.PAYMENTAMOUNT).toLocaleString()}</span>
                                                <span className='badge badge-light-success'>บาท</span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                    </div>
                </div>
                {/* End Card Body */}

                <div className='d-none d-xl-flex justify-content-between align-items-center my-5'>
                    <button
                        className={`${styles.btnSecondary}`}
                        onClick={() =>
                            navigate('/sale/step', { state: item })
                        }
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        className={`${styles.btnPrimary}`}
                        type='button'
                        onClick={handleNextClick}
                    >
                        ถัดไป
                    </button>
                    {/* <button
                        className={`btn btn-primary w-100 w-md-auto align-self-center h-50px ${!isDataComplete ? `disabled` : ``}`}
                        disabled={!isDataComplete}
                        onClick={handleCheckerClick}
                    >
                        ส่งตรวจสอบ
                    </button> */}
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
                    <button
                        className={`${styles.btnSecondary}`}
                        onClick={() =>
                            navigate('/sale/step', { state: item })
                        }
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        className={`${styles.btnPrimary}`}
                        type='button'
                        onClick={handleNextClick}
                    >
                        ถัดไป
                    </button>
                    {/* <button
                        className={`btn btn-primary w-auto ${!isDataComplete ? `disabled` : ``}`}
                        disabled={!isDataComplete}
                        onClick={handleCheckerClick}
                    >
                        ส่งตรวจสอบ
                    </button> */}
                </div>

            </Content >
        </>
    )
}

export default UpdateSalesContract