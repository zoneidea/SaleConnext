// import { Link, useNavigate, useLocation } from 'react-router-dom'
// import axios from 'axios';
// import clsx from 'clsx'
// import { useState, useEffect, useMemo } from 'react'
// import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
// import { getLayoutFromLocalStorage, ILayout, LayoutSetup } from '../../../_metronic/layout/core'
// import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
// import { Content } from '../../../_metronic/layout/components/content'
// import { TablesWidget5 } from '../../../_metronic/partials/widgets'
// import { useAuth } from '../../modules/auth/core/Auth';
// import {
//     useUUIDStore,
//     useSaveProductStore,
//     useSaveDiscountStore,
//     useSaveCustomerStore,
//     useSaveAddressStore
// } from '../../modules/stores/stepsStore';

// import { useItemStore } from './store/useItemStore'

// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// interface ItemProps {
//     REFNO: string;
//     CONTNO: string;
//     EMPID: string;
//     TEAMSALE: string;
//     SALECODE: string;
//     SUPEMPID: string;
//     SECEMPID: string;
//     STATUS: string;
//     PRODUCT: [any];
//     CUSTOMERSTATUS: [any];
//     DISCOUNT: [any];
//     CUSTOMERDETAIL: [any];
//     ADDRESS: [any];
//     PDPA: [any];
//     CONTRACT: [any];
//     IMAGE: [any];
//     CHECKERCOMMENT: [any];
//     item?: {
//         REFNO: string; // เพิ่ม item เป็น optional object
//     };
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

// const SalesCancel: React.FC = () => {
//     const location = useLocation();
//     const navigate = useNavigate()
//     const item = location.state as ItemProps || [];
//     // console.log(`item`, item);

//     const refno = item.REFNO
//     const createdDate = item.CONTRACT[0]?.createdAt
//     const contno = item.CONTNO

//     const product = item.PRODUCT
//     const packageProduct = item.PRODUCT[0]?.Package
//     const discount = item.DISCOUNT
//     const customerDetail = item.CUSTOMERDETAIL
//     const customerAddress = item.ADDRESS

//     const { auth } = useAuth();
//     const EmpId = auth?.data?.[0]?.EmpId || '';
//     const TeamSale = auth?.data?.[0]?.TeamSale || '';
//     const SaleCode = auth?.data?.[0]?.SaleCode || '';
//     const SupEmpId = auth?.data?.[0]?.SupEmp || '';
//     const SecEmpId = auth?.data?.[0]?.SecEmp || '';

//     const setItem = useItemStore((state) => state.setItem)

//     useEffect(() => {
//         if (item) {
//             setItem(item)
//         }
//     }, [item])

//     const formatThaiDate = (dateString?: string) => {
//         if (!dateString) return '-'
//         const d = new Date(dateString)
//         if (isNaN(d.getTime())) return '-' // ถ้าไม่ใช่วันที่ valid
//         const day = d.getDate()
//         const month = d.getMonth()
//         const year = d.getFullYear() + 543
//         const thaiMonths = [
//             'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
//             'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
//         ]
//         return `${day} ${thaiMonths[month]} ${year}`
//     }

//     const createdDateString = item.CONTRACT?.[0]?.createdAt
//     const formattedDate = (createdDateString)

//     const totalPrice = packageProduct[0]?.TOTALPRICE || 0;
//     const discountAmount = discount[0]?.DISCOUNTAMOUNT || 0;
//     const netPrice = totalPrice - discountAmount;

//     const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
//     const GET_PAYMENT = `${API_URL_SALECONNEXT}/GetPayment`;
//     const REMOVE_CONTRACT = `${API_URL_SALECONNEXT}/UpdateContract/VoidContract`;

//     const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//     const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

//     // ฟังก์ชันเปรียบเทียบเฉพาะวัน/เดือน/ปี
//     const isTodayCreated = useMemo(() => {
//         if (!createdDateString) return false

//         const createdAt = new Date(createdDateString)
//         const today = new Date()

//         // เปรียบเทียบเฉพาะส่วนของ YYYY-MM-DD
//         return (
//             createdAt.getFullYear() === today.getFullYear() &&
//             createdAt.getMonth() === today.getMonth() &&
//             createdAt.getDate() === today.getDate()
//         )
//     }, [createdDateString])

//     // ฟังก์ชันที่เรียกเมื่อกดยกเลิกสัญญา
//     const handleCancelContract = () => {
//         Swal.fire({
//             title: 'ยกเลิกสัญญา',
//             text: `คุณต้องการยกเลิกสัญญา REFNO: ${item.REFNO} หรือไม่?`,
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonText: 'ใช่, ยกเลิก!',
//             cancelButtonText: 'ยกเลิก',
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 try {
//                     // 1) เรียก API ลบสัญญา
//                     const removeResponse = await axios.post(REMOVE_CONTRACT, {
//                         RefNo: item.REFNO,
//                         EmpId: EmpId,
//                     })
//                     console.log('Remove contract response:', removeResponse.data)

//                     // 2) เรียก API อัปเดตสถานะ (STATUS = REMOVE)
//                     const updateResponse = await axios.post(UPDATECONTACT, {
//                         REFNO: item.REFNO,
//                         EMPID: EmpId,
//                         TEAMSALE: TeamSale,
//                         FIELD: 'STATUS',
//                         DATA: 'REMOVE',
//                     })
//                     console.log('Update contract response:', updateResponse.data)

//                     Swal.fire({
//                         icon: 'success',
//                         title: 'สำเร็จ!',
//                         text: `ยกเลิกสัญญา ${item.REFNO} เรียบร้อยแล้ว`,
//                         timer: 2000,
//                         showConfirmButton: false,
//                     })

//                     navigate("/sale/overview")

//                 } catch (error) {
//                     console.error(error)
//                     Swal.fire({
//                         icon: 'error',
//                         title: 'เกิดข้อผิดพลาด!',
//                         text: 'ไม่สามารถยกเลิกสัญญาได้ กรุณาลองใหม่',
//                     })
//                 }
//             }
//         })
//     }

//     return (
//         <>
//             <Content>
//                 <div className='d-flex justify-content-between align-items-center my-5'>
//                     <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
//                         data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//                         className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
//                         <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
//                             {packageProduct[0]?.PACKAGETYPEID === 1 ? (
//                                 <span>ใบสัญญา</span>
//                             ) : (
//                                 <span>ใบสัญญาเช่าซื้อ</span>
//                             )}

//                         </h1>
//                         <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//                             <li className="breadcrumb-item text-muted">
//                                 <span className="text-muted text-hover-primary">
//                                     รายละเอียด
//                                 </span></li>
//                             <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
//                             {packageProduct[0]?.PACKAGETYPEID === 1 ? (
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
//                             {packageProduct[0]?.PACKAGETYPEID === 1 ? (
//                                 <h3 className='card-title'>ใบสัญญา</h3>
//                             ) : (
//                                 <h3 className='card-title'>ใบสัญญาเช่าซื้อ</h3>
//                             )}
//                             <button
//                                 className="btn btn-primary w-auto me-2"
//                                 onClick={() => navigate("/sale/billRecieveMoney", { state: item })}
//                             >
//                                 ใบเสร็จรับเงิน
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
//                                 <span className='fw-bold fs-6'>{contno}</span>
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
//                                 <label className='col-lg-4 fw-bold text-muted'>เลขที่บัตร</label>
//                             )}
//                             <div className='col-lg-8'>
//                                 <span className='fw-bolder fs-6 text-gray-900'>{customerDetail[0]?.CUSTOMERID}</span>
//                             </div>
//                         </div>

//                         <div className='row mb-7'>
//                             <label className='col-lg-4 fw-bold text-muted'>ที่อยู่บัตรประชาชน</label>
//                             <div className='col-lg-8'>
//                                 <span className='fw-bolder fs-6 text-gray-900'>
//                                     {customerAddress[0]?.ADDRESSCARD.ADDRESSNUMBER && `${customerAddress[0]?.ADDRESSCARD.ADDRESSNUMBER}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSCARD.ADDRESSMOO && `หมู่ที่ ${customerAddress[0]?.ADDRESSCARD.ADDRESSMOO}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSCARD.ADDRESSSOI && `ซอย ${customerAddress[0]?.ADDRESSCARD.ADDRESSSOI}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSCARD.ADDRESSROAD && `ถนน ${customerAddress[0]?.ADDRESSCARD.ADDRESSROAD}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSCARD.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${customerAddress[0]?.ADDRESSCARD.ADDRESSSUBDISTRICTNAME}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSCARD.ADDRESSDISTRICTNAME && `อำเภอ ${customerAddress[0]?.ADDRESSCARD.ADDRESSDISTRICTNAME}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSCARD.ADDRESSPROVINCENAME && `จังหวัด ${customerAddress[0]?.ADDRESSCARD.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
//                                     {customerAddress[0]?.ADDRESSCARD.ADDRESSZIPCODE && `${customerAddress[0]?.ADDRESSCARD.ADDRESSZIPCODE}`}&nbsp;
//                                 </span>
//                             </div>
//                         </div>

//                         <div className='row mb-10'>
//                             <label className='col-lg-4 fw-bold text-muted'>ที่อยู่ติดตั้ง</label>
//                             <div className='col-lg-8'>
//                                 <span className='fw-bolder fs-6 text-gray-900'>
//                                     {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSNUMBER && `${customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSNUMBER}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSMOO && `หมู่ที่ ${customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSMOO}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSSOI && `ซอย ${customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSSOI}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSROAD && `ถนน ${customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSROAD}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSDISTRICTNAME && `อำเภอ ${customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSDISTRICTNAME}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSPROVINCENAME && `จังหวัด ${customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
//                                     {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSZIPCODE && `${customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSZIPCODE}`}&nbsp;
//                                 </span>
//                             </div>
//                         </div>

//                         <div className='row mb-10'>
//                             <label className='col-lg-4 fw-bold text-muted'>ที่อยู่เก็บเงิน</label>
//                             <div className='col-lg-8'>
//                                 <span className='fw-bolder fs-6 text-gray-900'>
//                                     {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSNUMBER && `${customerAddress[0]?.ADDRESSPAYMENT.ADDRESSNUMBER}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSMOO && `หมู่ที่ ${customerAddress[0]?.ADDRESSPAYMENT.ADDRESSMOO}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSSOI && `ซอย ${customerAddress[0]?.ADDRESSPAYMENT.ADDRESSSOI}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSROAD && `ถนน ${customerAddress[0]?.ADDRESSPAYMENT.ADDRESSROAD}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${customerAddress[0]?.ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSDISTRICTNAME && `อำเภอ ${customerAddress[0]?.ADDRESSPAYMENT.ADDRESSDISTRICTNAME}`}&nbsp;
//                                     {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSPROVINCENAME && `จังหวัด ${customerAddress[0]?.ADDRESSPAYMENT.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
//                                     {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSZIPCODE && `${customerAddress[0]?.ADDRESSPAYMENT.ADDRESSZIPCODE}`}&nbsp;
//                                 </span>
//                             </div>
//                         </div>

//                         {customerAddress[0]?.ADDRESSTAX.ADDRESSNUMBER && (
//                             <div className='row mb-10'>
//                                 <label className='col-lg-4 fw-bold text-muted'>ที่อยู่เสึยภาษี</label>
//                                 <div className='col-lg-8'>
//                                     <span className='fw-bolder fs-6 text-gray-900'>
//                                         {customerAddress[0]?.ADDRESSTAX.ADDRESSNUMBER && `${customerAddress[0]?.ADDRESSTAX.ADDRESSNUMBER}`}&nbsp;
//                                         {customerAddress[0]?.ADDRESSTAX.ADDRESSMOO && `หมู่ที่ ${customerAddress[0]?.ADDRESSTAX.ADDRESSMOO}`}&nbsp;
//                                         {customerAddress[0]?.ADDRESSTAX.ADDRESSSOI && `ซอย ${customerAddress[0]?.ADDRESSTAX.ADDRESSSOI}`}&nbsp;
//                                         {customerAddress[0]?.ADDRESSTAX.ADDRESSROAD && `ถนน ${customerAddress[0]?.ADDRESSTAX.ADDRESSROAD}`}&nbsp;
//                                         {customerAddress[0]?.ADDRESSTAX.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${customerAddress[0]?.ADDRESSTAX.ADDRESSSUBDISTRICTNAME}`}&nbsp;
//                                         {customerAddress[0]?.ADDRESSTAX.ADDRESSDISTRICTNAME && `อำเภอ ${customerAddress[0]?.ADDRESSTAX.ADDRESSDISTRICTNAME}`}&nbsp;
//                                         {customerAddress[0]?.ADDRESSTAX.ADDRESSPROVINCENAME && `จังหวัด ${customerAddress[0]?.ADDRESSTAX.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
//                                         {customerAddress[0]?.ADDRESSTAX.ADDRESSZIPCODE && `${customerAddress[0]?.ADDRESSTAX.ADDRESSZIPCODE}`}&nbsp;
//                                     </span>
//                                 </div>
//                             </div>
//                         )}

//                         <div className='row mb-10'>
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

//                         {packageProduct[0]?.PACKAGETITLE && (
//                             <div className='row mb-10'>
//                                 <label className='col-lg-4 fw-bold text-muted'>แพ็คเกจ</label>
//                                 <div className='col-lg-8'>
//                                     <span className='fw-bold fs-6'>{packageProduct[0]?.PACKAGETITLE}</span>
//                                 </div>
//                             </div>
//                         )}

//                         {discount[0]?.GIFT?.GIFTNAME && (
//                             <div className='row align-items-center mb-10'>
//                                 <label className='col-lg-4 fw-bold text-muted mb-0'>ของแถม</label>
//                                 <div className='col-lg-8 d-flex justify-content-between'>
//                                     <span className='fw-bold fs-6'>
//                                         {discount[0]?.GIFT?.GIFTNAME ? discount[0]?.GIFT?.GIFTNAME : "ไม่มี"}
//                                     </span>
//                                 </div>
//                             </div>
//                         )}

//                         {packageProduct[0]?.TOTALPRICE && (
//                             <div className='row align-items-center mb-10'>
//                                 <label className='col-lg-4 fw-bold text-muted mb-0'>ราคาสินค้า</label>
//                                 <div className='col-lg-8 d-flex justify-content-between'>
//                                     <span className='fw-bold fs-6'>{(packageProduct[0]?.TOTALPRICE).toLocaleString()}</span>
//                                     <span className='badge badge-light-success'>บาท</span>
//                                 </div>
//                             </div>
//                         )}

//                         {discount[0] && discount[0]?.TRADEIN?.TRADEINBRANDNAME && (
//                             <div className='row align-items-center mb-10'>
//                                 <label className='col-lg-4 fw-bold text-muted mb-0'>เครื่องเทิร์น</label>
//                                 <div className='col-lg-8 d-flex justify-content-between'>
//                                     <span className='fw-bold fs-6'>
//                                         {discount[0]?.TRADEIN?.TRADEINBRANDNAME ? discount[0]?.TRADEIN?.TRADEINBRANDNAME : "ไม่มี"}
//                                     </span>
//                                 </div>
//                             </div>
//                         )}

//                         {discount[0]?.DISCOUNTAMOUNT && (
//                             <div className='row align-items-center mb-10'>
//                                 <label className='col-lg-4 fw-bold text-muted mb-0'>ส่วนลด</label>
//                                 <div className='col-lg-8 d-flex justify-content-between'>
//                                     <span className='fw-bold fs-6'>
//                                         {discount[0]?.DISCOUNTAMOUNT ? (discount[0]?.DISCOUNTAMOUNT).toLocaleString() : "ไม่มี"}
//                                     </span>
//                                     <span className='badge badge-light-success'>บาท</span>
//                                 </div>
//                             </div>
//                         )}

//                         <div className='row align-items-center mb-10'>
//                             <label className='col-lg-4 fw-bold text-muted mb-0'>ราคาสุทธิ</label>
//                             <div className='col-lg-8 d-flex justify-content-between'>
//                                 <span className='fw-bold fs-6'>{(netPrice).toLocaleString()}</span>
//                                 <span className='badge badge-light-success'>บาท</span>
//                             </div>
//                         </div>

//                         {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
//                         {packageProduct[0]?.PACKAGETYPEID !== 1 && (
//                             <>
//                                 <div className='row align-items-center mb-10'>
//                                     <label className='col-lg-4 fw-bold text-muted mb-0'>งวดที่ 1 ที่ต้องชำระ</label>
//                                     <div className='col-lg-8 d-flex justify-content-between'>
//                                         <span className='fw-bold fs-6'>{(packageProduct[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT - discountAmount).toLocaleString()}</span>
//                                         <span className='badge badge-light-success'>บาท</span>
//                                     </div>
//                                 </div>

//                                 {packageProduct[0]?.PERIODDETAILS.length > 1 && (
//                                     <div className='row align-items-center mb-10'>
//                                         <label className='col-lg-4 fw-bold text-muted mb-0'>งวดที่ 2 ถึง {packageProduct[0]?.PERIODDETAILS.length} ต้องชำระงวดละ</label>
//                                         <div className='col-lg-8 d-flex justify-content-between'>
//                                             <span className='fw-bold fs-6'>{(packageProduct[0]?.PERIODDETAILS[1]?.PAYMENTAMOUNT).toLocaleString()}</span>
//                                             <span className='badge badge-light-success'>บาท</span>
//                                         </div>
//                                     </div>
//                                 )}
//                             </>
//                         )}

//                     </div>
//                 </div>
//                 {/* End Card Body */}

//                 <div className='row d-flex justify-content-between mt-5 mb-20'>
//                     {/* คอลัมน์ซ้าย */}
//                     <div className='col-6'>
//                         <p>......................................................ผู้ให้เช่าซื้อ
//                             <br />
//                             (......................................................)
//                         </p>
//                         <p>
//                             ......................................................พยาน
//                             <br />
//                             (......................................................)
//                         </p>
//                     </div>

//                     {/* คอลัมน์ขวา */}
//                     <div className='col-6 text-end'>
//                         <p>......................................................ผู้เช่าซื้อ
//                             <br />
//                             ({customerDetail[0]?.CUSTOMERNAME})
//                         </p>
//                         <p>
//                             ......................................................พยาน
//                             <br />
//                             (......................................................)
//                         </p>
//                     </div>
//                 </div>

//                 < div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10" >
//                     <button
//                         className="btn btn-secondary w-auto me-2"
//                         onClick={() => navigate('/sale/overview')}
//                     >
//                         ย้อนกลับ
//                     </button>
//                     {/* ปุ่ม "ยกเลิกสัญญา" จะ disabled ถ้าวันนี้ != วันเดียวกับ createdAt */}
//                     {isTodayCreated && (
//                         <button
//                             className='btn btn-danger w-100 w-md-auto align-self-center mb-2 mb-md-0'
//                             type='button'
//                             onClick={handleCancelContract}
//                         >
//                             ยกเลิกสัญญา
//                         </button>
//                     )}
//                     <button
//                         className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'
//                         type='button'
//                         onClick={() => navigate("/sale/billRecieveMoney", { state: item })}
//                     >
//                         ใบเสร็จรับเงิน
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
//                         onClick={() => navigate('/sale/overview')}
//                     >
//                         ย้อนกลับ
//                     </button>
//                     {isTodayCreated && (
//                         <button
//                             className='btn btn-danger w-auto me-2'
//                             onClick={handleCancelContract}
//                         >
//                             ยกเลิกสัญญา
//                         </button>
//                     )}
//                     <button
//                         className="btn btn-primary w-auto me-2"
//                         onClick={() => navigate("/sale/billRecieveMoney", { state: item })}
//                     >
//                         ใบเสร็จรับเงิน
//                     </button>
//                 </div>

//             </Content>
//         </>
//     )
// }

// export default SalesCancel

import styles from "@/styles/style.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";
import { useState, useEffect, useMemo } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers";
import {
  getLayoutFromLocalStorage,
  ILayout,
  LayoutSetup,
} from "../../../_metronic/layout/core";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
import { Content } from "../../../_metronic/layout/components/content";
import { TablesWidget5 } from "../../../_metronic/partials/widgets";
import { useAuth } from "../../modules/auth/core/Auth";
import {
  useUUIDStore,
  useSaveProductStore,
  useSaveDiscountStore,
  useSaveCustomerStore,
  useSaveAddressStore,
} from "../../modules/stores/stepsStore";

import { useItemStore } from "./store/useItemStore";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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
  SALEEMPLOYEE: any[];
  item?: {
    REFNO: string; // เพิ่ม item เป็น optional object
  };
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

const SalesCancel: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { REFNO } = useUUIDStore();

  const item = location.state as ItemProps;
  console.log(`item`, item);

  const createdDate = item.CONTRACT[0]?.createdAt;
  const contno = item.CONTNO;

  const product = item.PRODUCT;
  const packageProduct = item.PRODUCT[0]?.Package;
  const discount = item.DISCOUNT;
  const customerDetail = item.CUSTOMERDETAIL;
  const customerAddress = item.ADDRESS;

  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || "";
  const TeamSale = auth?.data?.[0]?.TeamSale || "";
  const SaleCode = auth?.data?.[0]?.SaleCode || "";
  const SupEmpId = auth?.data?.[0]?.SupEmp || "";
  const SecEmpId = auth?.data?.[0]?.SecEmp || "";

  //   const setItem = useItemStore((state) => state.setItem);

  //   useEffect(() => {
  //     if (item) {
  //       setItem(item);
  //     }
  //   }, [item]);

  const formatThaiDate = (dateString?: string) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-"; // ถ้าไม่ใช่วันที่ valid
    const day = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear() + 543;
    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    return `${day} ${thaiMonths[month]} ${year}`;
  };

  const createdDateString = item.CONTRACT?.[0]?.createdAt;
  const formattedDate = createdDateString;

  const totalPrice = packageProduct[0]?.TOTALPRICE || 0;
  const discountAmount = discount[0]?.DISCOUNTAMOUNT || 0;
  const netPrice = totalPrice - discountAmount;

  const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
  const GET_PAYMENT = `${API_URL_SALECONNEXT}/GetPayment`;
  const REMOVE_CONTRACT = `${API_URL_SALECONNEXT}/UpdateContract/VoidContract`;

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
  const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;

  // ฟังก์ชันเปรียบเทียบเฉพาะวัน/เดือน/ปี
  const isTodayCreated = useMemo(() => {
    if (!createdDateString) return false;

    const createdAt = new Date(createdDateString);
    const today = new Date();

    // เปรียบเทียบเฉพาะส่วนของ YYYY-MM-DD
    return (
      createdAt.getFullYear() === today.getFullYear() &&
      createdAt.getMonth() === today.getMonth() &&
      createdAt.getDate() === today.getDate()
    );
  }, [createdDateString]);

  // ฟังก์ชันที่เรียกเมื่อกดยกเลิกสัญญา
  const handleCancelContract = () => {
    Swal.fire({
      title: "ยกเลิกสัญญา",
      text: `คุณต้องการยกเลิกสัญญา REFNO: ${item.REFNO} หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ยกเลิก!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // 1) เรียก API ลบสัญญา
          const removeResponse = await axios.post(REMOVE_CONTRACT, {
            RefNo: item.REFNO,
            EmpId: EmpId,
          });
          // console.log("Remove contract response:", removeResponse.data);

          // 2) เรียก API อัปเดตสถานะ (STATUS = REMOVE)
          const updateResponse = await axios.post(UPDATECONTACT, {
            REFNO: item.REFNO,
            EMPID: EmpId,
            TEAMSALE: TeamSale,
            FIELD: "STATUS",
            DATA: "REMOVE",
          });
          // console.log("Update contract response:", updateResponse.data);

          Swal.fire({
            icon: "success",
            title: "สำเร็จ!",
            text: `ยกเลิกสัญญา ${item.REFNO} เรียบร้อยแล้ว`,
            timer: 2000,
            showConfirmButton: false,
          });

          navigate("/sale/overview");
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด!",
            text: "ไม่สามารถยกเลิกสัญญาได้ กรุณาลองใหม่",
          });
        }
      }
    });
  };

  {
    /****** matchedItem *******/
  }
  const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false);
  const [draft, setDraft] = useState<any[]>([]);

  useEffect(() => {
    const getDataDraft = async () => {
      setIsLoadingDraft(true);
      try {
        const response = await axios.get(DRAFT_ALLCONTRACT_URL);
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setDraft(data);
      } catch (error) {
        console.error("Error fetching DRAFT_ALLCONTRACT_URL:", error);
      } finally {
        setIsLoadingDraft(false);
      }
    };
    getDataDraft();
  }, []);

  // เลือก item ที่ REFNO ตรงกัน (find สำหรับ 1 item หรือ filter สำหรับหลาย item)
  const matchedItem = draft.find((item) => item.REFNO === REFNO);
  console.log(`matchedItem`, matchedItem);

  const formatToBE = (isoDate?: string) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear() + 543;
    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <>
      <Content>
        <div className="d-flex justify-content-between align-items-center my-5">
          <div
            id="kt_page_title"
            data-kt-swapper="true"
            data-kt-swapper-mode="prepend"
            data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
            className="page-title d-flex flex-wrap me-3 flex-column justify-content-center"
          >
            <div className={`breadcrumb-item ${styles.titlePage}`}>
              {packageProduct[0]?.PACKAGETYPEID === 1 ? (
                <span>ใบสัญญา</span>
              ) : (
                <span>ใบสัญญาเช่าซื้อ</span>
              )}
            </div>
          </div>
        </div>
        <span className={`${styles.fontSize}`}>เลขที่ขาย: </span>
        <span className={`${styles.titlePage}`}>{item?.REFNO}</span>

        {/* Card Body */}
        <div className="card mb-10">
          <div className="card-body py-5">
            {/* begin::Header */}
            <div className="d-flex justify-content-between align-items-center mb-7 mt-5">
              {packageProduct[0]?.PACKAGETYPEID === 1 ? (
                <h3 className={`card-title ${styles.titlePage}`}>ใบสัญญา</h3>
              ) : (
                <h3 className={`card-title ${styles.titlePage}`}>
                  ใบสัญญาเช่าซื้อ
                </h3>
              )}
              <button
                className={`${styles.btnPrimary}`}
                onClick={() =>
                  // navigate("/sale/billRecieveMoney", { state: matchedItem })
                  navigate("/sale/billRecieveMoney", { state: item })
                }
              >
                ใบเสร็จรับเงิน
              </button>
            </div>
            {/* end::Header */}

            <div className="row mb-7">
              <label className={`col-lg-4 text-muted ${styles.label}`}>
                วันที่ทำสัญญา
              </label>
              <div className="col-lg-8">
                <span className={`${styles.label}`}>{formatToBE(formattedDate)}</span>
              </div>
            </div>

            <div className="row mb-7">
              <label className={`col-lg-4 text-muted ${styles.label}`}>
                เลขที่สัญญา
              </label>
              <div className="col-lg-8 fv-row">
                <span className={`${styles.label}`}>{contno}</span>
              </div>
            </div>

            <div className="row align-items-center mb-10">
              <label
                className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
              >
                พนักงานขาย
              </label>
              <div className="col-lg-8 d-flex justify-content-between">
                <span
                  className={`fw-bolder text-gray-900 ${styles.fontSize}`}
                >
                  {item?.SALEEMPLOYEE[0]?.SALEEMPLOYEE.FName} {item?.SALEEMPLOYEE[0]?.SALEEMPLOYEE.LName} - {item?.SALEEMPLOYEE[0]?.SALEEMPLOYEE.SaleEmp}
                </span>
              </div>
            </div>

            <div className="row mb-7">
              <label className={`col-lg-4 text-muted ${styles.label}`}>
                ชื่อลูกค้า
              </label>
              <div className="col-lg-8">
                <span className={`${styles.label}`}>
                  {customerDetail[0]?.PREFIX[0]?.PREFIXNAME && customerDetail[0]?.PREFIX[0]?.PREFIXNAME}{" "}
                  {customerDetail[0]?.CUSTOMERNAME}{" "}
                  {customerDetail[0]?.CUSTOMERLASTNAME && customerDetail[0]?.CUSTOMERLASTNAME}
                </span>
              </div>
            </div>

            {customerDetail[0]?.CUSTOMERID && (
              <div className="row mb-7">
                {customerDetail[0].CUSTOMERTYPE === "1" ? (
                  <label className={`col-lg-4 text-muted ${styles.label}`}>
                    เลขประจำตัวผู้เสียภาษี
                  </label>
                ) : (
                  <label className={`col-lg-4 text-muted ${styles.label}`}>
                    เลขที่บัตรประชาชน
                  </label>
                )}
                <div className="col-lg-8">
                  <span className={`${styles.label}`}>
                    {customerDetail[0]?.CUSTOMERID}
                  </span>
                </div>
              </div>
            )}

            {customerAddress[0]?.ADDRESSCARD?.ADDRESSNUMBER && (
              <div className="row mb-7">
                <label className={`col-lg-4 text-muted ${styles.label}`}>
                  ที่อยู่บัตรประชาชน
                </label>
                <div className="col-lg-8">
                  <span className={`${styles.label}`}>
                    {customerAddress[0]?.ADDRESSCARD.ADDRESSNUMBER &&
                      `${customerAddress[0]?.ADDRESSCARD.ADDRESSNUMBER}`}
                    &nbsp;
                    {customerAddress[0]?.ADDRESSCARD.ADDRESSMOO &&
                      `หมู่ที่ ${customerAddress[0]?.ADDRESSCARD.ADDRESSMOO}`}
                    &nbsp;
                    {customerAddress[0]?.ADDRESSCARD.ADDRESSSOI &&
                      `ซอย${customerAddress[0]?.ADDRESSCARD.ADDRESSSOI}`}
                    &nbsp;
                    {customerAddress[0]?.ADDRESSCARD.ADDRESSROAD &&
                      `ถนน${customerAddress[0]?.ADDRESSCARD.ADDRESSROAD}`}
                    &nbsp;
                    {customerAddress[0]?.ADDRESSCARD.ADDRESSSUBDISTRICTNAME && (
                      <>
                        {customerAddress[0]?.ADDRESSCARD.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                          ? "แขวง"
                          : "ตำบล"}
                        {customerAddress[0]?.ADDRESSCARD.ADDRESSSUBDISTRICTNAME}
                      </>
                    )}&nbsp;
                    {customerAddress[0]?.ADDRESSCARD.ADDRESSDISTRICTNAME && (
                      <>
                        {customerAddress[0]?.ADDRESSCARD.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                          ? "เขต"
                          : "อำเภอ"}
                        {customerAddress[0]?.ADDRESSCARD.ADDRESSDISTRICTNAME}
                      </>
                    )}&nbsp;
                    {customerAddress[0]?.ADDRESSCARD.ADDRESSPROVINCENAME &&
                      `จังหวัด${customerAddress[0]?.ADDRESSCARD.ADDRESSPROVINCENAME}`}
                    &nbsp;&nbsp;
                    {customerAddress[0]?.ADDRESSCARD.ADDRESSZIPCODE &&
                      `${customerAddress[0]?.ADDRESSCARD.ADDRESSZIPCODE}`}
                    &nbsp;
                  </span>
                </div>
              </div>
            )}

            {customerAddress[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER && (
              <div className="row mb-10">
                <label className={`col-lg-4 text-muted ${styles.label}`}>
                  ที่อยู่ติดตั้ง
                </label>
                <div className="col-lg-8">
                  <span className={`${styles.label}`}>
                    {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSNUMBER &&
                      `${customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSNUMBER}`}
                    &nbsp;
                    {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSMOO &&
                      `หมู่ที่ ${customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSMOO}`}
                    &nbsp;
                    {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSSOI &&
                      `ซอย${customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSSOI}`}
                    &nbsp;
                    {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSROAD &&
                      `ถนน${customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSROAD}`}
                    &nbsp;
                    {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME && (
                      <>
                        {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                          ? "แขวง"
                          : "ตำบล"}
                        {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME}
                      </>
                    )}&nbsp;
                    {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSDISTRICTNAME && (
                      <>
                        {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                          ? "เขต"
                          : "อำเภอ"}
                        {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSDISTRICTNAME}
                      </>
                    )}&nbsp;
                    {customerAddress[0]?.ADDRESSINSTALLATION
                      .ADDRESSPROVINCENAME &&
                      `จังหวัด${customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSPROVINCENAME}`}
                    &nbsp;&nbsp;
                    {customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSZIPCODE &&
                      `${customerAddress[0]?.ADDRESSINSTALLATION.ADDRESSZIPCODE}`}
                    &nbsp;
                  </span>
                </div>
              </div>
            )}

            {customerAddress[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER && (
              <div className="row mb-10">
                <label className={`col-lg-4 text-muted ${styles.label}`}>
                  ที่อยู่เก็บเงิน
                </label>
                <div className="col-lg-8">
                  <span className={`${styles.label}`}>
                    {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSNUMBER &&
                      `${customerAddress[0]?.ADDRESSPAYMENT.ADDRESSNUMBER}`}
                    &nbsp;
                    {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSMOO &&
                      `หมู่ที่ ${customerAddress[0]?.ADDRESSPAYMENT.ADDRESSMOO}`}
                    &nbsp;
                    {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSSOI &&
                      `ซอย${customerAddress[0]?.ADDRESSPAYMENT.ADDRESSSOI}`}
                    &nbsp;
                    {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSROAD &&
                      `ถนน${customerAddress[0]?.ADDRESSPAYMENT.ADDRESSROAD}`}
                    &nbsp;
                    {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME && (
                      <>
                        {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                          ? "แขวง"
                          : "ตำบล"}
                        {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME}
                      </>
                    )}&nbsp;
                    {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSDISTRICTNAME && (
                      <>
                        {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                          ? "เขต"
                          : "อำเภอ"}
                        {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSDISTRICTNAME}
                      </>
                    )}&nbsp;
                    {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSPROVINCENAME &&
                      `จังหวัด${customerAddress[0]?.ADDRESSPAYMENT.ADDRESSPROVINCENAME}`}
                    &nbsp;&nbsp;
                    {customerAddress[0]?.ADDRESSPAYMENT.ADDRESSZIPCODE &&
                      `${customerAddress[0]?.ADDRESSPAYMENT.ADDRESSZIPCODE}`}
                    &nbsp;
                  </span>
                </div>
              </div>
            )}

            {customerAddress[0]?.ADDRESSTAX.ADDRESSNUMBER && (
              <div className="row mb-10">
                <label className={`col-lg-4 text-muted ${styles.label}`}>
                  ที่อยู่เสึยภาษี
                </label>
                <div className="col-lg-8">
                  <span className={`${styles.label}`}>
                    {customerAddress[0]?.ADDRESSTAX.ADDRESSNUMBER &&
                      `${customerAddress[0]?.ADDRESSTAX.ADDRESSNUMBER}`}
                    &nbsp;
                    {customerAddress[0]?.ADDRESSTAX.ADDRESSMOO &&
                      `หมู่ที่ ${customerAddress[0]?.ADDRESSTAX.ADDRESSMOO}`}
                    &nbsp;
                    {customerAddress[0]?.ADDRESSTAX.ADDRESSSOI &&
                      `ซอย${customerAddress[0]?.ADDRESSTAX.ADDRESSSOI}`}
                    &nbsp;
                    {customerAddress[0]?.ADDRESSTAX.ADDRESSROAD &&
                      `ถนน${customerAddress[0]?.ADDRESSTAX.ADDRESSROAD}`}
                    &nbsp;
                    {customerAddress[0]?.ADDRESSTAX.ADDRESSSUBDISTRICTNAME && (
                      <>
                        {customerAddress[0]?.ADDRESSTAX.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                          ? "แขวง"
                          : "ตำบล"}
                        {customerAddress[0]?.ADDRESSTAX.ADDRESSSUBDISTRICTNAME}
                      </>
                    )}&nbsp;
                     {customerAddress[0]?.ADDRESSTAX.ADDRESSDISTRICTNAME && (
                      <>
                        {customerAddress[0]?.ADDRESSTAX.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                          ? "เขต"
                          : "อำเภอ"}
                        {customerAddress[0]?.ADDRESSTAX.ADDRESSDISTRICTNAME}
                      </>
                    )}&nbsp;
                    {customerAddress[0]?.ADDRESSTAX.ADDRESSPROVINCENAME &&
                      `จังหวัด${customerAddress[0]?.ADDRESSTAX.ADDRESSPROVINCENAME}`}
                    &nbsp;&nbsp;
                    {customerAddress[0]?.ADDRESSTAX.ADDRESSZIPCODE &&
                      `${customerAddress[0]?.ADDRESSTAX.ADDRESSZIPCODE}`}
                    &nbsp;
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
                  {customerDetail[0]?.CUSTOMERMOBILE
                    ? customerDetail[0]?.CUSTOMERMOBILE
                    : customerAddress[0]?.ADDRESSINSTALLATION?.ADDRESSPHONE}
                </span>
              </div>
            </div>

            {customerDetail[0]?.CUSTOMERPHONE && (
              <div className="row mb-10">
                <label
                  className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
                >
                  เบอร์ที่ติดต่อได้ 2
                </label>
                <div className="col-lg-8">
                  <span
                    className={`fw-bolder text-gray-900 ${styles.fontSize}`}
                  >
                    {customerDetail[0]?.CUSTOMERPHONE}
                  </span>
                </div>
              </div>
            )}

            <div className="row mb-10">
              <label className={`col-lg-4 text-muted ${styles.label}`}>
                สินค้า
              </label>
              <div className="col-lg-8">
                <span className={`${styles.label}`}>
                  {product[0]?.ItemDescription}
                </span>
              </div>
            </div>

            {product[1]?.ItemDescription && (
              <div className="row mb-10">
                <label
                  className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
                >
                  สินค้าบันเดิล
                </label>
                <div className="col-lg-8">
                  <span
                    className={`fw-bolder text-gray-900 ${styles.fontSize}`}
                  >
                    {product[1]?.ItemDescription}
                  </span>
                </div>
              </div>
            )}

            {packageProduct[0]?.PACKAGETITLE && (
              <div className="row mb-10">
                <label className={`col-lg-4 text-muted ${styles.label}`}>
                  แพ็คเกจ
                </label>
                <div className="col-lg-8">
                  <span className={`${styles.label}`}>
                    {packageProduct[0]?.PACKAGETITLE}
                  </span>
                </div>
              </div>
            )}

            {discount[0]?.GIFT?.GIFTNAME && (
              <div className="row align-items-center mb-10">
                <label className={`col-lg-4 text-muted ${styles.label}`}>
                  ของแถม
                </label>
                <div className="col-lg-8 d-flex justify-content-between">
                  <span className={`${styles.label}`}>
                    {discount[0]?.GIFT?.GIFTNAME
                      ? discount[0]?.GIFT?.GIFTNAME
                      : "ไม่มี"}
                  </span>
                </div>
              </div>
            )}

            {packageProduct[0]?.TOTALPRICE && (
              <div className="row align-items-center mb-10">
                <label className={`col-lg-4 text-muted ${styles.label}`}>
                  ราคาสินค้า
                </label>
                <div className="col-lg-8 d-flex justify-content-between">
                  <span className={`${styles.label}`}>
                    {(packageProduct[0]?.TOTALPRICE).toLocaleString()}
                  </span>
                  <span className="badge badge-light-success">บาท</span>
                </div>
              </div>
            )}

            {discount[0] && discount[0]?.TRADEIN?.TRADEINBRANDNAME && (
              <div className="row align-items-center mb-10">
                <label className={`col-lg-4 text-muted ${styles.label}`}>
                  เครื่องเทิร์น
                </label>
                <div className="col-lg-8 d-flex justify-content-between">
                  <span className={`${styles.label}`}>
                    {discount[0]?.TRADEIN?.TRADEINBRANDNAME
                      ? discount[0]?.TRADEIN?.TRADEINBRANDNAME
                      : "ไม่มี"}
                  </span>
                </div>
              </div>
            )}

            {discount[0]?.DISCOUNTAMOUNT && (
              <div className="row align-items-center mb-10">
                <label className={`col-lg-4 text-muted ${styles.label}`}>
                  ส่วนลด
                </label>
                <div className="col-lg-8 d-flex justify-content-between">
                  <span className={`${styles.label}`}>
                    {discount[0]?.DISCOUNTAMOUNT
                      ? (discount[0]?.DISCOUNTAMOUNT).toLocaleString()
                      : "ไม่มี"}
                  </span>
                  <span className="badge badge-light-success">บาท</span>
                </div>
              </div>
            )}

            <div className="row align-items-center mb-10">
              <label className={`col-lg-4 text-muted ${styles.label}`}>
                ราคาสุทธิ
              </label>
              <div className="col-lg-8 d-flex justify-content-between">
                <span className={`${styles.label}`}>
                  {netPrice.toLocaleString()}
                </span>
                <span className="badge badge-light-success">บาท</span>
              </div>
            </div>

            {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
            {packageProduct[0]?.PACKAGETYPEID !== 1 && (
              <>
                <div className="row align-items-center mb-10">
                  <label className={`col-lg-4 text-muted ${styles.label}`}>
                    งวดที่ 1 ที่ต้องชำระ
                  </label>
                  <div className="col-lg-8 d-flex justify-content-between">
                    <span className={`${styles.label}`}>
                      {(
                        packageProduct[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT -
                        discountAmount
                      ).toLocaleString()}
                    </span>
                    <span className="badge badge-light-success">บาท</span>
                  </div>
                </div>

                {packageProduct[0]?.PERIODDETAILS.length > 1 && (
                  <div className="row align-items-center mb-10">
                    <label className={`col-lg-4 text-muted ${styles.label}`}>
                      งวดที่ 2 ถึง {packageProduct[0]?.PERIODDETAILS.length}{" "}
                      ต้องชำระงวดละ
                    </label>
                    <div className="col-lg-8 d-flex justify-content-between">
                      <span className={`${styles.label}`}>
                        {(packageProduct[0]?.PERIODDETAILS[1]?.PAYMENTAMOUNT).toLocaleString()}
                      </span>
                      <span className="badge badge-light-success">บาท</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {/* End Card Body */}

        {/* <div className='row d-flex justify-content-between mt-5 mb-20'>
                    <div className='col-6'>
                        <p>......................................................ผู้ให้เช่าซื้อ
                            <br />
                            (......................................................)
                        </p>
                        <p>
                            ......................................................พยาน
                            <br />
                            (......................................................)
                        </p>
                    </div>

                    <div className='col-6 text-end'>
                        <p>......................................................ผู้เช่าซื้อ
                            <br />
                            ({customerDetail[0]?.CUSTOMERNAME})
                        </p>
                        <p>
                            ......................................................พยาน
                            <br />
                            (......................................................)
                        </p>
                    </div>
                </div> */}

        <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
          <button
            className={`${styles.btnSecondary}`}
            onClick={() => navigate("/sale/overview")}
          >
            ย้อนกลับ
          </button>
          {/* ปุ่ม "ยกเลิกสัญญา" จะ disabled ถ้าวันนี้ != วันเดียวกับ createdAt */}
          {isTodayCreated && (
            <>
              <button
                className={`${styles.btnDanger}`}
                type="button"
                onClick={handleCancelContract}
              >
                ยกเลิกสัญญา
              </button>
              <button
                className={`${styles.btnPrimary}`}
                type="button"
                onClick={() =>
                  navigate("/sale/editFinishInDay", { state: item })
                }
              >
                แก้ไขข้อมูล
              </button>
            </>
          )}
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
            onClick={() => navigate("/sale/overview")}
          >
            ย้อนกลับ
          </button>
          {isTodayCreated && (
            <>
              <button
                className={`${styles.btnDanger}`}
                onClick={handleCancelContract}
              >
                ยกเลิกสัญญา
              </button>
              <button
                className={`${styles.btnPrimary}`}
                onClick={() =>
                  navigate("/sale/editFinishInDay", { state: item })
                }
              >
                แก้ไขข้อมูล
              </button>
            </>
          )}
        </div>
      </Content>
    </>
  );
};

export default SalesCancel;
