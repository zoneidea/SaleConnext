// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { useState, useEffect, useMemo } from 'react';
// import { Content } from '../../../_metronic/layout/components/content';
// import { useAuth } from '../../modules/auth/core/Auth';
// import { KTIcon } from '../../../_metronic/helpers'

// import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import { useUUIDStore, useSaveProductStore } from '../../modules/stores/stepsStore';
// import { useSaveDiscountStore } from '../../modules/stores/stepsStore';

// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// import dayjs, { Dayjs } from 'dayjs';
// import DatePicker from 'react-datepicker';
// import DateTimePicker from 'react-datetime-picker';
// import 'react-datepicker/dist/react-datepicker.css';
// import 'react-datetime-picker/dist/DateTimePicker.css';
// import 'react-calendar/dist/Calendar.css';
// import 'react-clock/dist/Clock.css';

// import { ThreeDot } from 'react-loading-indicators'

// interface ContractState {
//     contNo: string;
// }

// interface ItemProps {
//     REFNO: string,
//     CONTNO: string,
//     EMPID: string,
//     TEAMSALE: string,
//     SALECODE: string,
//     SUPEMPID: string,
//     SECEMPID: string,
//     STATUS: string,
//     PRODUCT: [any],
//     CUSTOMERSTATUS: [any],
//     DISCOUNT: [any],
//     CUSTOMERDETAIL: [any],
//     ADDRESS: AddressItem[];
//     PDPA: [any],
//     CONTRACT: [any],
//     IMAGE: [any],
//     CHECKERCOMMENT: [any]
//     TRANSACTION: [any]
// }

// interface AddressCard {
//     ADDRESSDISTRICT: string
//     ADDRESSDISTRICTNAME: string
//     ADDRESSMOO: string;
//     ADDRESSNUMBER: string;
//     ADDRESSPHONE: string;
//     ADDRESSPROVINCE: string;
//     ADDRESSPROVINCENAME: string;
//     ADDRESSROAD: string;
//     ADDRESSSOI: string;
//     ADDRESSSUBDISTRICT: string;
//     ADDRESSSUBDISTRICTNAME: string;
//     ADDRESSZIPCODE: string;
//     USETHISTAX: string;
// }
// interface AddressInstallation {
//     ADDRESSDISTRICT: string
//     ADDRESSDISTRICTNAME: string
//     ADDRESSMOO: string;
//     ADDRESSNUMBER: string;
//     ADDRESSPHONE: string;
//     ADDRESSPROVINCE: string;
//     ADDRESSPROVINCENAME: string;
//     ADDRESSROAD: string;
//     ADDRESSSOI: string;
//     ADDRESSSUBDISTRICT: string;
//     ADDRESSSUBDISTRICTNAME: string;
//     ADDRESSZIPCODE: string;
//     USETHISTAX: string;
// }
// interface AddressPayment {
//     ADDRESSDISTRICT: string
//     ADDRESSDISTRICTNAME: string
//     ADDRESSMOO: string;
//     ADDRESSNUMBER: string;
//     ADDRESSPHONE: string;
//     ADDRESSPROVINCE: string;
//     ADDRESSPROVINCENAME: string;
//     ADDRESSROAD: string;
//     ADDRESSSOI: string;
//     ADDRESSSUBDISTRICT: string;
//     ADDRESSSUBDISTRICTNAME: string;
//     ADDRESSZIPCODE: string;
//     USETHISTAX: string;
// }

// interface AddressTax {
//     ADDRESSDISTRICT: string
//     ADDRESSDISTRICTNAME: string
//     ADDRESSMOO: string;
//     ADDRESSNUMBER: string;
//     ADDRESSPHONE: string;
//     ADDRESSPROVINCE: string;
//     ADDRESSPROVINCENAME: string;
//     ADDRESSROAD: string;
//     ADDRESSSOI: string;
//     ADDRESSSUBDISTRICT: string;
//     ADDRESSSUBDISTRICTNAME: string;
//     ADDRESSZIPCODE: string;
//     USETHISTAX: string;
// }

// // ถ้าโครงสร้างในฐานข้อมูลเหมือนตัวอย่างข้างบน
// interface AddressItem {
//     ADDRESSCARD: AddressCard;
//     ADDRESSINSTALLATION: AddressInstallation;
//     ADDRESSPAYMENT: AddressPayment;
//     ADDRESSTAX: AddressTax;
// }

// const CreateFirstBill: React.FC = () => {
//     const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO;
//     const POST_PAYMENT_TRANSACTION_URL = `${API_URL_GET_ALLCONTRACT}/Payment/UpdatePaymentTransaction`;

//     const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
//     const GET_QR_PAYMENT_URL = `${API_URL_SALECONNEXT}/GetQRPayment`;

//     const navigate = useNavigate()
//     const location = useLocation();
//     const MySwal = withReactContent(Swal);

//     const { auth } = useAuth();
//     const EmpId = auth?.data?.[0]?.EmpId || '';
//     const TeamSale = auth?.data?.[0]?.TeamSale || '';
//     const SaleCode = auth?.data?.[0]?.SaleCode || '';
//     const SupEmpId = auth?.data?.[0]?.SupEmp || '';
//     const SecEmpId = auth?.data?.[0]?.SecEmp || '';

//     const item = location.state as ItemProps || [];
//     console.log(`item`, item);

//     const refno = item?.REFNO
//     const product = item?.PRODUCT
//     const contNo = item?.CONTNO
//     const customerDetail = item?.CUSTOMERDETAIL
//     const discountAmount = item?.DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
//     const transaction = item?.TRANSACTION

//     const addressArray = item?.ADDRESS;
//     const firstAddress = addressArray?.[0];
//     const secondAddress = addressArray?.[1];
//     const thirdAddress = addressArray?.[2];
//     const fourthAddress = addressArray?.[3];

//     const paymentPeriodDetailId = product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTPERIODDETAILID
//     const paymentPeriodNumber = product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTPERIODNUMBER
//     const periodAmount = product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT
//     const paymentAmount = product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT

//     const totalPrice = product[0]?.Package[0]?.TOTALPRICE || 0;
//     const netPrice = totalPrice - discountAmount;
//     // console.log(`netPrice`, netPrice);

//     // ชำระเงินทันที หรือ นัดชำระ
//     const [payQuick, setPayQuick] = useState<boolean>(true);
//     const [status, setStatus] = useState("PAID");

//     // ชำระเต็ม หรือ ชำระบางส่วน / เกินจำนวน
//     const [payFullAmount, setPayFullAmount] = useState<boolean>(true);
//     const [paySomeAmount, setPaySomeAmount] = useState<number>(0);
//     const [paymentChoice, setPaymentChoice] = useState<string>("FULL");

//     const [priceOption, setPriceOption] = useState<string>("CASH");

//     // ประเภทการชำระเงิน
//     const [paymentChannel, setPaymentChannel] = useState<string>("CASH");

//     // const remainingAmount = transaction[0]?.AMOUNT - paySomeAmount
//     const remainingAmount = Math.max(
//         0,
//         (product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT || 0) - discountAmount - paySomeAmount
//     );

//     const [valueCalendarInstall, setValueCalendarInstall] = useState<Date | null>(null);
//     const dueDate = dayjs(valueCalendarInstall).format("YYYY-MM-DD");

//     const [errorMessage, setErrorMessage] = useState<string>("");

//     const [qrCodeData, setQrCodeData] = useState<string>('')
//     const [loadingQR, setLoadingQR] = useState<boolean>(false)

//     const getQRPayment = async () => {
//         try {
//             setLoadingQR(true);

//             // ตรงนี้คำนวนยอดที่จะจ่ายก่อน
//             // ถ้า PACKAGETYPEID !== 1 → เงินผ่อน (installment) → ใช้ amountToPay
//             // ถ้า PACKAGETYPEID === 1 → เงินสด (cash) → ใช้ netPrice
//             const amountToPay = payFullAmount ? paymentAmount : paySomeAmount;
//             const isInstallment = product[0]?.Package[0]?.PACKAGETYPEID !== 1;
//             const qrAmount = isInstallment ? amountToPay : netPrice;

//             console.log('qrAmount', qrAmount);

//             const formData = new FormData();
//             formData.append('RefNo', refno);
//             formData.append('Amount', qrAmount.toString());

//             const response = await axios.post(GET_QR_PAYMENT_URL, formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//             });

//             if (response.status === 200 && response.data) {
//                 setQrCodeData(response.data.data.QrCode || '');
//             }
//         } catch (error) {
//             console.error('Error fetching QR Payment:', error);
//         } finally {
//             setLoadingQR(false);
//         }
//     };

//     const handlePayQuickChange = (isPayQuick: boolean) => {
//         setQrCodeData('')
//         setPayQuick(isPayQuick);
//         setStatus(isPayQuick ? "PAID" : "SCHEDULE");;
//         setPaymentChannel(isPayQuick ? "CASH" : "NONE");
//         setPaymentChoice(isPayQuick ? (payFullAmount ? "FULL" : "SOME") : "NONE"); // อัปเดต PAYMENTCHOICE
//     };

//     const handlePayFullAmountChange = (value: boolean) => {
//         setQrCodeData('')
//         setPayFullAmount(value)
//         setPaymentChoice(value ? 'FULL' : 'SOME')

//         if (!value) {
//             // ถ้าเป็นชำระบางส่วน => สถานะ SCHEDULE
//             setStatus('SCHEDULE')
//             // บังคับให้เป็นเงินสด
//             setPaymentChannel('CASH')
//             setPriceOption('CASH')     // <<--- เพิ่มบรรทัดนี้ด้วย
//         } else {
//             // ถ้าเป็นชำระเต็มจำนวน => สถานะ PAID
//             setStatus('PAID')
//             // บังคับให้เป็นเงินสด
//             setPaymentChannel('CASH')
//             setPriceOption('CASH')     // <<--- เพิ่มบรรทัดนี้ด้วย
//         }
//     }

//     const handleDateChangeInstall = (date: Date | null) => {
//         setValueCalendarInstall(date);
//     };

//     const handlePaymentChannelChange = (channel: string) => {
//         setPaymentChannel(channel)

//         // ถ้าผู้ใช้เลือก "QR CODE" → call API
//         if (channel === 'QR CODE') {
//             // เช็คยอดที่จะจ่าย
//             let amountToPay = 0
//             if (payFullAmount) {
//                 // ชำระเต็ม → (paymentAmount - discount) สมมติเป็นงวดแรก
//                 amountToPay = Math.max(0, paymentAmount - discountAmount)
//             } else {
//                 // ชำระบางส่วน → paySomeAmount
//                 amountToPay = paySomeAmount
//             }

//             // call API ขอ QR
//             getQRPayment()
//         } else {
//             // ถ้าเปลี่ยนกลับเป็น 'CASH' ก็เคลียร์ qrCodeData
//             setQrCodeData('')
//         }
//     }

//     const handlePriceOptionChange = (option: string) => {
//         setPriceOption(option)

//         // ถ้าเลือก QR CODE จากชุด priceOption
//         if (option === "QR CODE") {
//             // ก็ต้องเรียก getQRPayment ด้วย
//             // หรือบังคับ paymentChannel เป็น "QR CODE" ไปเลย
//             setPaymentChannel("QR CODE")
//             getQRPayment()
//         } else {
//             // ถ้าเป็น "CASH"
//             setPaymentChannel("CASH")
//             setQrCodeData('')
//         }
//     }

//     // ฟังก์ชัน handleSomeAmountChange (แก้ให้ลบหมด = 0)
//     const handleSomeAmountChange = (value: string) => {
//         // ล้างค่า QR (ถ้ามี)
//         setQrCodeData('')

//         // 1) ถ้าผู้ใช้ลบตัวเลขจนเป็น "" หรือ "0" → ให้เป็น 0
//         if (!value) {
//             setPaySomeAmount(0)
//             setErrorMessage('')
//             return
//         }
//         if (value === '0') {
//             setPaySomeAmount(0)
//             setErrorMessage('')
//             return
//         }

//         // 2) จากนั้นตรวจสอบเลข
//         const number = Number(value)
//         if (isNaN(number) || number < 0) {
//             setErrorMessage("กรุณากรอกจำนวนเงินที่ถูกต้อง")
//         } else if (number > netPrice) {
//             setPaySomeAmount(number)
//             setErrorMessage(`ห้ามชำระเกินราคาสุทธิ ${netPrice.toLocaleString()} บาท`)
//         } else {
//             setPaySomeAmount(number)
//             setErrorMessage('')
//         }
//     }

//     const handleSomeAmountBlur = () => {
//         // กรณีต้องการให้ยิงเฉพาะตอนเป็น QR CODE
//         if (paymentChannel === 'QR CODE') {
//             getQRPayment()
//         }
//     }

//     const allData = {
//         REFNO: refno,
//         EMPID: EmpId,
//         STATUS: status,
//         DUEDATE: status === "SCHEDULE"
//             ? dueDate
//             : (paymentChoice === "FULL" || paySomeAmount >= paymentAmount - discountAmount
//                 ? ""
//                 : dueDate),
//         PAYMENTPERIODDETAILID: paymentPeriodDetailId,
//         PAYMENTPERIODNUMBER: paymentPeriodNumber,
//         PAYMENTCHANNEL: paymentChannel,
//         PAYMENTCHOICE: paymentChoice,
//         AMOUNT: status === "SCHEDULE" && paymentChoice === "NONE"
//             ? ""
//             : (paymentChoice === "FULL"
//                 ? paymentAmount - discountAmount
//                 : paySomeAmount),
//         PERIODAMOUNT: periodAmount - discountAmount,
//         DISCOUNT: discountAmount
//     };

//     const onSubmit = async (data: any) => {
//         // ตรวจสอบการมี qrCodeData เมื่อเลือกช่องทาง QR CODE
//         if (paymentChannel === "QR CODE" && qrCodeData) {
//             Swal.fire("แจ้งเตือน", "กรุณาทำการสแกน qr code ก่อน", "warning");
//             return;
//         }
//         try {
//             const response = await axios.post(POST_PAYMENT_TRANSACTION_URL, allData, {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });

//             if (response.status === 200) {
//                 Swal.fire("สำเร็จ", "บันทึกธุรกรรมการชำระเงินสำเร็จ", "success");
//                 navigate("/firstBill/overview");
//             } else {
//                 Swal.fire("เกิดข้อผิดพลาด", response.data.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
//             }
//         } catch (error) {
//             console.error("Error saving data:", error);
//             Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้", "error");
//         }
//     };

//     return (
//         <>
//             <Content>
//                 <div className='d-flex justify-content-between align-items-center my-5'>
//                     <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
//                         data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//                         className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
//                         <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
//                             การรับชำระเงินงวดแรก
//                         </h1>
//                         <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//                             <li className="breadcrumb-item text-muted">
//                                 <span className="text-muted text-hover-primary">
//                                     ระบบเก็บเงินงวดแรก
//                                 </span></li>
//                             <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
//                             <li className="breadcrumb-item text-gray-900">การรับชำระเงินงวดแรก</li>
//                         </ul>
//                     </div>
//                 </div>
//                 <p>เลขที่ขาย: {refno}</p>

//                 <div className='row'>
//                     {/* Card Body */}
//                     <div className='col-lg-6'>
//                         <div className='accordion mb-10' id='kt_accordion_1'>
//                             <div className='accordion-item mb-10'>
//                                 <h2 className='accordion-header' id='kt_accordion_1_header_1'>
//                                     <h3
//                                         className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
//                                         data-bs-toggle='collapse'
//                                         data-bs-target='#kt_accordion_1_body_1'
//                                         aria-expanded='true'
//                                         aria-controls='kt_accordion_1_body_1'
//                                         style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
//                                     >
//                                         การรับชำระเงินงวดแรก
//                                     </h3>
//                                 </h2>
//                                 <div
//                                     id='kt_accordion_1_body_1'
//                                     className='accordion-collapse collapse show'
//                                     aria-labelledby='kt_accordion_1_header_1'
//                                     data-bs-parent='#kt_accordion_1'
//                                 >
//                                     <div className='accordion-body'>
//                                         <form noValidate className='form'>
//                                             <div className='card-body px-lg-9 px-1'>

//                                                 <div className="container">
//                                                     <div className="d-flex mb-6">
//                                                         <div className="form-check form-check-inline me-3">
//                                                             <input
//                                                                 className="form-check-input"
//                                                                 type="radio"
//                                                                 name="payQuick"
//                                                                 checked={payQuick}
//                                                                 onChange={() => handlePayQuickChange(true)}
//                                                             />
//                                                             <label className="form-label fw-bold fs-6">ชำระเงินทันที</label>
//                                                         </div>
//                                                         <div className="form-check form-check-inline me-3">
//                                                             <input
//                                                                 className="form-check-input"
//                                                                 type="radio"
//                                                                 name="payQuick"
//                                                                 checked={!payQuick}
//                                                                 onChange={() => handlePayQuickChange(false)}
//                                                             />
//                                                             <label className="form-label fw-bold fs-6">นัดชำระ</label>
//                                                         </div>
//                                                     </div>

//                                                     {/* Start ชำระเงินทันที */}
//                                                     {payQuick && (
//                                                         <>
//                                                             <div className="d-flex mb-6 mt-10">
//                                                                 <div className="form-check form-check-inline me-3">
//                                                                     <input
//                                                                         className="form-check-input"
//                                                                         type="radio"
//                                                                         name="payFullAmount"
//                                                                         checked={payFullAmount}
//                                                                         onChange={() => handlePayFullAmountChange(true)}
//                                                                     />
//                                                                     <label className="form-label fw-bold fs-6">ชำระเต็มจำนวน</label>
//                                                                 </div>
//                                                                 <div className="form-check form-check-inline me-3">
//                                                                     <input
//                                                                         className="form-check-input"
//                                                                         type="radio"
//                                                                         name="payFullAmount"
//                                                                         checked={!payFullAmount}
//                                                                         onChange={() => handlePayFullAmountChange(false)}
//                                                                     />
//                                                                     <label className="form-label fw-bold fs-6">
//                                                                         {product[0]?.Package[0]?.PACKAGETYPEID === 1 ? (
//                                                                             <span>ชำระบางส่วน</span>
//                                                                         ) : (
//                                                                             <span>ชำระบางส่วน / เกินจำนวน</span>
//                                                                         )}
//                                                                     </label>
//                                                                 </div>
//                                                             </div>

//                                                             {/* Start ชำระเต็ม */}
//                                                             {payFullAmount && (
//                                                                 <>
//                                                                     {product[0].Package.PACKAGETYPEID === 1 ? (
//                                                                         <div className="mb-6">
//                                                                             <label className="form-label fw-bold fs-6">จำนวนเงินที่ต้องชำระ</label>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 className="form-control"
//                                                                                 readOnly
//                                                                                 style={{
//                                                                                     backgroundColor: '#d7dbde',
//                                                                                 }}
//                                                                                 value={paymentAmount}
//                                                                             // value={transaction[0]?.AMOUNT}
//                                                                             />
//                                                                         </div>
//                                                                     ) : (
//                                                                         <div className="mb-6">
//                                                                             <label className="form-label fw-bold fs-6">จำนวนเงินที่ต้องชำระ</label>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 className="form-control"
//                                                                                 readOnly
//                                                                                 style={{
//                                                                                     backgroundColor: '#d7dbde',
//                                                                                 }}
//                                                                                 value={paymentAmount - discountAmount}
//                                                                             // value={transaction[0]?.AMOUNT}
//                                                                             />
//                                                                         </div>
//                                                                     )}
//                                                                     <div className="d-flex mb-6 mt-10">
//                                                                         <div className="form-check form-check-inline me-3">
//                                                                             <input
//                                                                                 className="form-check-input"
//                                                                                 type="radio"
//                                                                                 name="paymentChannel"
//                                                                                 checked={paymentChannel === "CASH"}
//                                                                                 onChange={() => handlePaymentChannelChange("CASH")}
//                                                                             />
//                                                                             <label className="form-label fw-bold fs-6">เงินสด</label>
//                                                                         </div>
//                                                                         <div className="form-check form-check-inline me-3">
//                                                                             <input
//                                                                                 className="form-check-input"
//                                                                                 type="radio"
//                                                                                 name="paymentChannel"
//                                                                                 checked={paymentChannel === "QR CODE"}
//                                                                                 onChange={() => handlePaymentChannelChange("QR CODE")}
//                                                                             />
//                                                                             <label className="form-label fw-bold fs-6">QR CODE</label>
//                                                                         </div>
//                                                                     </div>
//                                                                 </>
//                                                             )}
//                                                             {/* End ชำระเต็ม */}

//                                                             {/* Start ชำระบางส่วน / เกินจำนวน */}
//                                                             {!payFullAmount && (
//                                                                 <>
//                                                                     {/* {product[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
//                                                                         <div className="mb-6">
//                                                                             <label className="form-label fw-bold fs-6">ราคาสุทธิ</label>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 className="form-control"
//                                                                                 readOnly
//                                                                                 style={{
//                                                                                     backgroundColor: '#d7dbde',
//                                                                                 }}
//                                                                                 value={netPrice}
//                                                                             />
//                                                                         </div>
//                                                                     )} */}
//                                                                     <div className="mb-6">
//                                                                         {product[0]?.Package[0]?.PACKAGETYPEID !== 1 ? (
//                                                                             <>
//                                                                                 <label className="form-label fw-bold fs-6">จำนวนเงินที่ต้องชำระงวดที่ 1</label>
//                                                                                 <input
//                                                                                     type="text"
//                                                                                     className="form-control"
//                                                                                     readOnly
//                                                                                     style={{
//                                                                                         backgroundColor: '#d7dbde',
//                                                                                     }}
//                                                                                     value={paymentAmount - discountAmount}
//                                                                                 // value={transaction[0]?.AMOUNT}
//                                                                                 />
//                                                                             </>
//                                                                         ) : (
//                                                                             <>
//                                                                                 <label className="form-label fw-bold fs-6">ราคาสุทธิ</label>
//                                                                                 <input
//                                                                                     type="text"
//                                                                                     className="form-control"
//                                                                                     readOnly
//                                                                                     style={{
//                                                                                         backgroundColor: '#d7dbde',
//                                                                                     }}
//                                                                                     value={netPrice}
//                                                                                 />
//                                                                             </>
//                                                                         )}
//                                                                     </div>

//                                                                     <div className="mb-6">
//                                                                         {product[0]?.Package[0]?.PACKAGETYPEID !== 1 ? (
//                                                                             <>
//                                                                                 <label className="form-label required fw-bold fs-6">จำนวนเงินที่แบ่งชำระ</label>
//                                                                                 <input
//                                                                                     type="text"
//                                                                                     className="form-control"
//                                                                                     onChange={(e) => handleSomeAmountChange(e.target.value)}
//                                                                                     value={paySomeAmount}
//                                                                                 />
//                                                                             </>
//                                                                         ) : (
//                                                                             <>
//                                                                                 <label className="form-label required fw-bold fs-6">จำนวนเงินที่ชำระ</label>
//                                                                                 <input
//                                                                                     type="text"
//                                                                                     className={`form-control ${errorMessage ? "is-invalid" : ""}`}
//                                                                                     onChange={(e) => handleSomeAmountChange(e.target.value)}
//                                                                                     onBlur={handleSomeAmountBlur}
//                                                                                     value={paySomeAmount === 0 ? "0" : paySomeAmount} // ใช้ "0" เพื่อให้พิมพ์ได้
//                                                                                     min="0" // ป้องกันค่าติดลบ
//                                                                                 />
//                                                                                 {errorMessage && (
//                                                                                     <div className="text-danger mt-1">{errorMessage}</div>
//                                                                                 )}
//                                                                             </>
//                                                                         )}
//                                                                     </div>
//                                                                     <div className="mb-6">
//                                                                         <label className="form-label fw-bold fs-6">จำนวนเงินที่เหลืองวดที่ 1</label>
//                                                                         <input
//                                                                             type="text"
//                                                                             className="form-control"
//                                                                             readOnly
//                                                                             style={{
//                                                                                 backgroundColor: '#d7dbde',
//                                                                             }}
//                                                                             value={isNaN(remainingAmount) ? 0 : remainingAmount}
//                                                                         />
//                                                                     </div>
//                                                                     {/* ถ้าชำระมากกว่าหรือเท่ากับ ไม่ต้องโชว์ */}
//                                                                     {/* {paySomeAmount < transaction[0]?.AMOUNT && ( */}
//                                                                     {paySomeAmount < paymentAmount - discountAmount && (
//                                                                         <div className="col-lg-12 mb-6">
//                                                                             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                                                                                 <label className="form-label required fw-bold fs-6">วันที่สะดวกชำระส่วนที่เหลือ</label>
//                                                                                 <DatePicker
//                                                                                     selected={valueCalendarInstall}
//                                                                                     onChange={handleDateChangeInstall}
//                                                                                     className="form-control mb-3 mb-lg-0"
//                                                                                     showYearDropdown
//                                                                                     showMonthDropdown
//                                                                                     dropdownMode="select"
//                                                                                     isClearable
//                                                                                     dateFormat="yyyy/MM/dd"
//                                                                                     withPortal
//                                                                                 />
//                                                                             </div>
//                                                                         </div>
//                                                                     )}
//                                                                     {/* )} */}
//                                                                     <div className="d-flex mb-6 mt-10">
//                                                                         <div className="form-check form-check-inline me-3">
//                                                                             <input
//                                                                                 className="form-check-input"
//                                                                                 type="radio"
//                                                                                 name="priceOption"
//                                                                                 checked={priceOption === "CASH"}
//                                                                                 onChange={() => handlePriceOptionChange("CASH")}
//                                                                             />
//                                                                             <label className="form-label fw-bold fs-6">เงินสด</label>
//                                                                         </div>
//                                                                         <div className="form-check form-check-inline me-3">
//                                                                             <input
//                                                                                 className="form-check-input"
//                                                                                 type="radio"
//                                                                                 name="priceOption"
//                                                                                 checked={priceOption === "QR CODE"}
//                                                                                 onChange={() => handlePriceOptionChange("QR CODE")}
//                                                                             />
//                                                                             <label className="form-label fw-bold fs-6">QR CODE</label>
//                                                                         </div>
//                                                                     </div>
//                                                                 </>
//                                                             )}
//                                                             {/* End ชำระบางส่วน / เกินจำนวน */}
//                                                         </>
//                                                     )}
//                                                     {/* End ชำระเงินทันที */}

//                                                     {/* Start นัดชำระ */}
//                                                     {!payQuick && (
//                                                         <div className="col-lg-12 mb-6">
//                                                             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                                                                 <label className="form-label required fw-bold fs-6">วันที่สะดวกชำระ</label>
//                                                                 <DatePicker
//                                                                     selected={valueCalendarInstall}
//                                                                     onChange={handleDateChangeInstall}
//                                                                     className="form-control mb-3 mb-lg-0"
//                                                                     showYearDropdown
//                                                                     showMonthDropdown
//                                                                     dropdownMode="select"
//                                                                     isClearable
//                                                                     dateFormat="yyyy/MM/dd"
//                                                                     withPortal
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                     )}
//                                                     {/* End นัดชำระ*/}

//                                                     <div className='mb-6 mt-10 d-flex justify-content-center'>
//                                                         {loadingQR ? (
//                                                             <ThreeDot />
//                                                         ) : qrCodeData ? (
//                                                             <img
//                                                                 src={qrCodeData}
//                                                                 alt='QR Code'
//                                                                 style={{ width: 200, height: 200 }}
//                                                             />
//                                                         ) : null}
//                                                     </div>

//                                                 </div>
//                                             </div>

//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {/* End Card Body */}

//                     {/* Card Body */}
//                     <div className='col-lg-6'>
//                         <div className='card'>
//                             <div className='card-body'>
//                                 <div className='d-flex justify-content-between mb-5'>
//                                     <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
//                                         รายละเอียดสัญญา
//                                     </h1>
//                                     <button
//                                         type='button'
//                                         className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
//                                     >
//                                         <KTIcon iconName='category' className='fs-2' />
//                                     </button>
//                                 </div>

//                                 <div className='container'>
//                                     <div className='row mb-7'>
//                                         <label className='col-5 col-md-4 fw-bold text-muted'>เลขที่สัญญา</label>
//                                         <div className='col-7 col-md-8'>
//                                             <span className='fw-bold fs-6'>{contNo}</span>
//                                         </div>
//                                     </div>

//                                     <div className='row mb-7'>
//                                         <label className='col-5 col-md-4 fw-bold text-muted'>ชื่อ สกุล</label>
//                                         <div className='col-7 col-md-8'>
//                                             <a href='#' className='fw-bold fs-6 text-gray-900 text-hover-primary'>
//                                                 {customerDetail[0]?.PREFIX[0]?.PREFIXNAME} {customerDetail[0]?.CUSTOMERNAME} {customerDetail[0]?.CUSTOMERLASTNAME}
//                                             </a>
//                                         </div>
//                                     </div>

//                                     {/* {firstAddress?.ADDRESSCARD.ADDRESSPROVINCENAME && (
//                                         <div className="row mb-7">
//                                             <label className="col-5 col-md-4 fw-bold text-muted">ที่อยู่ตามบัตร</label>
//                                             <div className="col-7 col-md-8">
//                                                 <div className="d-flex justify-content-between align-items-center">
//                                                     <a
//                                                         href="#"
//                                                         className="fw-bold fs-6 text-gray-900 text-hover-primary"
//                                                         style={{ wordBreak: "break-word" }}
//                                                     >
//                                                         {firstAddress.ADDRESSCARD.ADDRESSNUMBER && firstAddress.ADDRESSCARD.ADDRESSNUMBER}{" "}
//                                                         {firstAddress.ADDRESSCARD.ADDRESSMOO && `หมู่ ${firstAddress.ADDRESSCARD.ADDRESSMOO}`}{" "}
//                                                         {firstAddress.ADDRESSCARD.ADDRESSSOI && `ซอย ${firstAddress.ADDRESSCARD.ADDRESSSOI}`}{" "}
//                                                         {firstAddress.ADDRESSCARD.ADDRESSROAD && `ถนน ${firstAddress.ADDRESSCARD.ADDRESSROAD}`}{" "}
//                                                         {firstAddress.ADDRESSCARD.ADDRESSDISTRICTNAME && `เขต ${firstAddress.ADDRESSCARD.ADDRESSDISTRICTNAME}`}{" "}
//                                                         {firstAddress.ADDRESSCARD.ADDRESSSUBDISTRICTNAME && `แขวง ${firstAddress.ADDRESSCARD.ADDRESSSUBDISTRICTNAME}`}{" "}
//                                                         {firstAddress.ADDRESSCARD.ADDRESSPROVINCENAME && `จังหวัด ${firstAddress.ADDRESSCARD.ADDRESSPROVINCENAME}`}{" "}
//                                                         {firstAddress.ADDRESSCARD.ADDRESSZIPCODE && firstAddress.ADDRESSCARD.ADDRESSZIPCODE}
//                                                     </a>

//                                                     <FontAwesomeIcon icon={faLocationDot} size="lg" />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )} */}

//                                     {/* {firstAddress?.ADDRESSINSTALLATION.ADDRESSPROVINCENAME && (
//                                         <div className='row mb-7'>
//                                             <label className='col-5 col-md-4 fw-bold text-muted'>ที่อยู่ติดตั้ง</label>
//                                             <div className='col-7 col-md-8'>
//                                                 <div className="d-flex justify-content-between align-items-center">
//                                                     <a href='#' className='fw-bold fs-6 text-gray-900 text-hover-primary'>
//                                                         {firstAddress.ADDRESSINSTALLATION.ADDRESSNUMBER && firstAddress.ADDRESSINSTALLATION.ADDRESSNUMBER}{" "}
//                                                         {firstAddress.ADDRESSINSTALLATION.ADDRESSMOO && `หมู่ ${firstAddress.ADDRESSINSTALLATION.ADDRESSMOO}`}{" "}
//                                                         {firstAddress.ADDRESSINSTALLATION.ADDRESSSOI && `ซอย ${firstAddress.ADDRESSINSTALLATION.ADDRESSSOI}`}{" "}
//                                                         {firstAddress.ADDRESSINSTALLATION.ADDRESSROAD && `ถนน ${firstAddress.ADDRESSINSTALLATION.ADDRESSROAD}`}{" "}
//                                                         {firstAddress.ADDRESSINSTALLATION.ADDRESSDISTRICTNAME && `เขต ${firstAddress.ADDRESSINSTALLATION.ADDRESSDISTRICTNAME}`}{" "}
//                                                         {firstAddress.ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME && `แขวง ${firstAddress.ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME}`}{" "}
//                                                         {firstAddress.ADDRESSINSTALLATION.ADDRESSPROVINCENAME && `จังหวัด ${firstAddress.ADDRESSINSTALLATION.ADDRESSPROVINCENAME}`}{" "}
//                                                         {firstAddress.ADDRESSINSTALLATION.ADDRESSZIPCODE && firstAddress.ADDRESSINSTALLATION.ADDRESSZIPCODE}{" "}
//                                                     </a>

//                                                     <FontAwesomeIcon icon={faLocationDot} size="lg" />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )} */}

//                                     {firstAddress?.ADDRESSPAYMENT.ADDRESSPROVINCENAME && (
//                                         <div className='row mb-7'>
//                                             <label className='col-5 col-md-4 fw-bold text-muted'>ที่อยู่เก็บเงิน</label>
//                                             <div className='col-7 col-md-8'>
//                                                 <div className="d-flex justify-content-between align-items-center">
//                                                     <a href='#' className='fw-bold fs-6 text-gray-900 text-hover-primary'>
//                                                         {firstAddress.ADDRESSPAYMENT.ADDRESSNUMBER && firstAddress.ADDRESSPAYMENT.ADDRESSNUMBER}{" "}
//                                                         {firstAddress.ADDRESSPAYMENT.ADDRESSMOO && `หมู่ ${firstAddress.ADDRESSPAYMENT.ADDRESSMOO}`}{" "}
//                                                         {firstAddress.ADDRESSPAYMENT.ADDRESSSOI && `ซอย ${firstAddress.ADDRESSPAYMENT.ADDRESSSOI}`}{" "}
//                                                         {firstAddress.ADDRESSPAYMENT.ADDRESSROAD && `ถนน ${firstAddress.ADDRESSPAYMENT.ADDRESSROAD}`}{" "}
//                                                         {firstAddress.ADDRESSPAYMENT.ADDRESSDISTRICTNAME && `เขต ${firstAddress.ADDRESSPAYMENT.ADDRESSDISTRICTNAME}`}{" "}
//                                                         {firstAddress.ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME && `แขวง ${firstAddress.ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME}`}{" "}
//                                                         {firstAddress.ADDRESSPAYMENT.ADDRESSPROVINCENAME && `จังหวัด ${firstAddress.ADDRESSPAYMENT.ADDRESSPROVINCENAME}`}{" "}
//                                                         {firstAddress.ADDRESSPAYMENT.ADDRESSZIPCODE && firstAddress.ADDRESSPAYMENT.ADDRESSZIPCODE}{" "}
//                                                     </a>

//                                                     <FontAwesomeIcon icon={faLocationDot} size="2x" />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {/* {firstAddress?.ADDRESSTAX.ADDRESSPROVINCENAME && (
//                                         <div className='row mb-7'>
//                                             <label className='col-5 col-md-4 fw-bold text-muted'>ที่อยู่กำกับภาษี</label>
//                                             <div className='col-7 col-md-8'>
//                                                 <div className="d-flex justify-content-between align-items-center">
//                                                     <a href='#' className='fw-bold fs-6 text-gray-900 text-hover-primary'>
//                                                         {firstAddress.ADDRESSTAX.ADDRESSNUMBER && firstAddress.ADDRESSTAX.ADDRESSNUMBER}{" "}
//                                                         {firstAddress.ADDRESSTAX.ADDRESSMOO && `หมู่ ${firstAddress.ADDRESSTAX.ADDRESSMOO}`}{" "}
//                                                         {firstAddress.ADDRESSTAX.ADDRESSSOI && `ซอย ${firstAddress.ADDRESSTAX.ADDRESSSOI}`}{" "}
//                                                         {firstAddress.ADDRESSTAX.ADDRESSROAD && `ถนน ${firstAddress.ADDRESSTAX.ADDRESSROAD}`}{" "}
//                                                         {firstAddress.ADDRESSTAX.ADDRESSDISTRICTNAME && `เขต ${firstAddress.ADDRESSTAX.ADDRESSDISTRICTNAME}`}{" "}
//                                                         {firstAddress.ADDRESSTAX.ADDRESSSUBDISTRICTNAME && `แขวง ${firstAddress.ADDRESSTAX.ADDRESSSUBDISTRICTNAME}`}{" "}
//                                                         {firstAddress.ADDRESSTAX.ADDRESSPROVINCENAME && `จังหวัด ${firstAddress.ADDRESSTAX.ADDRESSPROVINCENAME}`}{" "}
//                                                         {firstAddress.ADDRESSTAX.ADDRESSZIPCODE && firstAddress.ADDRESSTAX.ADDRESSZIPCODE}{" "}
//                                                     </a>

//                                                     <FontAwesomeIcon icon={faLocationDot} size="lg" />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )} */}

//                                     <div className='row mb-7'>
//                                         <label className='col-5 col-md-4 fw-bold text-muted'>เบอร์โทรติดต่อ</label>
//                                         <div className='col-7 col-md-8'>
//                                             <span className='fw-bold fs-6'>{customerDetail[0]?.CUSTOMERMOBILE}</span>
//                                         </div>
//                                     </div>

//                                     <div className='row mb-7'>
//                                         <label className='col-5 col-md-4 fw-bold text-muted'>สินค้า</label>
//                                         <div className='col-7 col-md-8'>
//                                             <span className='fw-bold fs-6'>{product[0]?.ItemDescription}</span>
//                                         </div>
//                                     </div>

//                                     {product[0]?.Package[0]?.PACKAGETITLE && (
//                                         <div className='row mb-7'>
//                                             <label className='col-5 col-md-4 fw-bold text-muted'>แพ็คเกจ</label>
//                                             <div className='col-7 col-md-8'>
//                                                 <span className='fw-bold fs-6'>{product[0]?.Package[0]?.PACKAGETITLE}</span>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {item?.DISCOUNT[0]?.GIFT && (
//                                         <div className='row mb-7'>
//                                             <label className='col-5 col-md-4 fw-bold text-muted'>ของแถม</label>
//                                             <div className='col-7 col-md-8'>
//                                                 <span className='fw-bold fs-6'>
//                                                     {item?.DISCOUNT[0]?.GIFT?.GIFTNAME ? item?.DISCOUNT[0]?.GIFT?.GIFTNAME : "ไม่มี"}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {product[0]?.Package[0]?.TOTALPRICE && (
//                                         <div className='row mb-7'>
//                                             <label className='col-5 col-md-4 fw-bold text-muted'>ราคาสินค้า</label>
//                                             <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
//                                                 <span className='fw-bold fs-6'>{product[0]?.Package[0]?.TOTALPRICE}</span>
//                                                 <span className='badge badge-light-success'>บาท</span>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {item?.DISCOUNT[0]?.TRADEIN?.HASTRADEIN != 0 && (
//                                         <div className='row mb-7'>
//                                             <label className='col-5 col-md-4 fw-bold text-muted'>เครื่องเทิร์น</label>
//                                             <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
//                                                 <span className='fw-bold fs-6'>
//                                                     {item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME ? item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME : "ไม่มี"}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {item?.DISCOUNT[0]?.DISCOUNTAMOUNT != 0 && (
//                                         <div className='row mb-7'>
//                                             <label className='col-5 col-md-4 fw-bold text-muted'>ส่วนลด</label>
//                                             <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
//                                                 <span className='fw-bold fs-6'>
//                                                     {discountAmount ? discountAmount : "ไม่มี"}
//                                                 </span>
//                                                 <span className='badge badge-light-success'>บาท</span>
//                                             </div>
//                                         </div>
//                                     )}

//                                     <div className='row mb-7'>
//                                         <label className='col-5 col-md-4 fw-bold text-muted'>ราคาสุทธิ</label>
//                                         <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
//                                             <span className='fw-bold fs-6'>{netPrice}</span>
//                                             <span className='badge badge-light-success'>บาท</span>
//                                         </div>
//                                     </div>

//                                     {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
//                                     {product[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
//                                         <>
//                                             <div className='row mb-7'>
//                                                 <label className='col-5 col-md-4 fw-bold text-muted'>งวดที่ 1 ที่ต้องชำระ</label>
//                                                 <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
//                                                     <span className='fw-bold fs-6'>{product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT - discountAmount}</span>
//                                                     <span className='badge badge-light-success'>บาท</span>
//                                                 </div>
//                                             </div>

//                                             {product[0]?.Package[0]?.PERIODDETAILS.length > 1 && (
//                                                 <div className='row mb-7'>
//                                                     <label className='col-5 col-md-4 fw-bold text-muted'>งวดที่ 2 ถึง {product[0]?.Package[0]?.PERIODDETAILS.length} ต้องชำระงวดละ</label>
//                                                     <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
//                                                         <span className='fw-bold fs-6'>{product[0]?.Package[0]?.PERIODDETAILS[1]?.PAYMENTAMOUNT}</span>
//                                                         <span className='badge badge-light-success'>บาท</span>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </>
//                                     )}

//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {/* End Card Body */}

//                 </div >

//                 <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
//                     <button
//                         className='btn btn-secondary w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px'
//                         onClick={() => navigate('/firstBill/overview', { state: item })}
//                     >
//                         ย้อนกลับ
//                     </button>
//                     <button
//                         className='btn btn-primary w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px'
//                         onClick={onSubmit}
//                     >
//                         บันทึก
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
//                         onClick={() => navigate('/firstBill/overview', { state: item })}
//                     >
//                         ย้อนกลับ
//                     </button>
//                     <button
//                         className="btn btn-primary w-auto me-2"
//                         onClick={onSubmit}
//                     >
//                         บันทึก
//                     </button>
//                 </div>

//             </Content >
//         </>
//     )
// }

// export default CreateFirstBill;



// import styles from '@/styles/style.module.css'
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { useState, useEffect, useMemo } from 'react';
// import { Content } from '../../../_metronic/layout/components/content';
// import { useAuth } from '../../modules/auth/core/Auth';
// import { KTIcon } from '../../../_metronic/helpers'

// import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import { useUUIDStore, useSaveProductStore } from '../../modules/stores/stepsStore';
// import { useSaveDiscountStore } from '../../modules/stores/stepsStore';

// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// import dayjs, { Dayjs } from 'dayjs';
// import DatePicker from 'react-datepicker';
// import DateTimePicker from 'react-datetime-picker';
// import 'react-datepicker/dist/react-datepicker.css';
// import 'react-datetime-picker/dist/DateTimePicker.css';
// import 'react-calendar/dist/Calendar.css';
// import 'react-clock/dist/Clock.css';

// import { ThreeDot } from 'react-loading-indicators'
// import { log } from 'node:console';

// interface ContractState {
//     contNo: string;
// }

// interface ItemProps {
//     REFNO: string,
//     EFFDATE: string,
//     CREATEDATE: string,
//     CONTNO: string,
//     EMPID: string,
//     TEAMSALE: string,
//     SALECODE: string,
//     SUPEMPID: string,
//     SECEMPID: string,
//     STATUS: string,
//     PRODUCT: [any],
//     CUSTOMERSTATUS: [any],
//     DISCOUNT: [any],
//     CUSTOMERDETAIL: [any],
//     ADDRESS: AddressItem[];
//     PDPA: [any],
//     CONTRACT: [any],
//     IMAGE: [any],
//     CHECKERCOMMENT: [any]
//     TRANSACTION: [any]
// }

// interface AddressCard {
//     ADDRESSDISTRICT: string
//     ADDRESSDISTRICTNAME: string
//     ADDRESSMOO: string;
//     ADDRESSNUMBER: string;
//     ADDRESSPHONE: string;
//     ADDRESSPROVINCE: string;
//     ADDRESSPROVINCENAME: string;
//     ADDRESSROAD: string;
//     ADDRESSSOI: string;
//     ADDRESSSUBDISTRICT: string;
//     ADDRESSSUBDISTRICTNAME: string;
//     ADDRESSZIPCODE: string;
//     USETHISTAX: string;
// }
// interface AddressInstallation {
//     ADDRESSDISTRICT: string
//     ADDRESSDISTRICTNAME: string
//     ADDRESSMOO: string;
//     ADDRESSNUMBER: string;
//     ADDRESSPHONE: string;
//     ADDRESSPROVINCE: string;
//     ADDRESSPROVINCENAME: string;
//     ADDRESSROAD: string;
//     ADDRESSSOI: string;
//     ADDRESSSUBDISTRICT: string;
//     ADDRESSSUBDISTRICTNAME: string;
//     ADDRESSZIPCODE: string;
//     USETHISTAX: string;
// }
// interface AddressPayment {
//     ADDRESSDISTRICT: string
//     ADDRESSDISTRICTNAME: string
//     ADDRESSMOO: string;
//     ADDRESSNUMBER: string;
//     ADDRESSPHONE: string;
//     ADDRESSPROVINCE: string;
//     ADDRESSPROVINCENAME: string;
//     ADDRESSROAD: string;
//     ADDRESSSOI: string;
//     ADDRESSSUBDISTRICT: string;
//     ADDRESSSUBDISTRICTNAME: string;
//     ADDRESSZIPCODE: string;
//     USETHISTAX: string;
// }

// interface AddressTax {
//     ADDRESSDISTRICT: string
//     ADDRESSDISTRICTNAME: string
//     ADDRESSMOO: string;
//     ADDRESSNUMBER: string;
//     ADDRESSPHONE: string;
//     ADDRESSPROVINCE: string;
//     ADDRESSPROVINCENAME: string;
//     ADDRESSROAD: string;
//     ADDRESSSOI: string;
//     ADDRESSSUBDISTRICT: string;
//     ADDRESSSUBDISTRICTNAME: string;
//     ADDRESSZIPCODE: string;
//     USETHISTAX: string;
// }

// // ถ้าโครงสร้างในฐานข้อมูลเหมือนตัวอย่างข้างบน
// interface AddressItem {
//     ADDRESSCARD: AddressCard;
//     ADDRESSINSTALLATION: AddressInstallation;
//     ADDRESSPAYMENT: AddressPayment;
//     ADDRESSTAX: AddressTax;
// }

// interface LocationState {
//     item?: ItemProps
//     from?: string
// }

// const CreateFirstBill: React.FC = () => {
//     const navigate = useNavigate()
//     const MySwal = withReactContent(Swal);

//     const { auth } = useAuth();
//     const EmpId = auth?.data?.[0]?.EmpId || '';
//     const TeamSale = auth?.data?.[0]?.TeamSale || '';
//     const SaleCode = auth?.data?.[0]?.SaleCode || '';
//     const SupEmpId = auth?.data?.[0]?.SupEmp || '';
//     const SecEmpId = auth?.data?.[0]?.SecEmp || '';

//     const location = useLocation();
//     // const item = location.state as ItemProps || [];
//     // const from = location.state as ItemProps || [];
//     // console.log(`item`, item);

//     // const state = (location.state ?? {}) as LocationState
//     // console.log(`state`, state);

//     const { state } = useLocation() as { state: LocationState };
//     console.log('CreateFirstBill got state:', state);
//     const item = state.item
//     console.log(`item`, item);
//     const from = state.from ?? ''

//     // const { item, from } = (location.state as LocationState) || {};

//     const refno = item?.REFNO ?? ''
//     const product = item?.PRODUCT ?? []
//     const contNo = item?.CONTNO ?? ''
//     const customerDetail = item?.CUSTOMERDETAIL ?? []
//     const discountAmount = item?.DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
//     const transaction = item?.TRANSACTION ?? []

//     const addressArray = item?.ADDRESS;
//     const firstAddress = addressArray?.[0];
//     const secondAddress = addressArray?.[1];
//     const thirdAddress = addressArray?.[2];
//     const fourthAddress = addressArray?.[3];

//     const paymentPeriodDetailId = product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTPERIODDETAILID
//     const paymentPeriodNumber = product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTPERIODNUMBER
//     const periodAmount = product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT
//     const paymentAmount = product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT

//     const totalPrice = product[0]?.Package[0]?.TOTALPRICE || 0;
//     const netPrice = totalPrice - discountAmount;
//     // console.log(`netPrice`, netPrice);

//     // ชำระเงินทันที หรือ นัดชำระ
//     const [payQuick, setPayQuick] = useState<boolean>(true);
//     const [status, setStatus] = useState("PAID");

//     // ชำระเต็ม หรือ ชำระบางส่วน / เกินจำนวน
//     const [payFullAmount, setPayFullAmount] = useState<boolean>(true);
//     const [paySomeAmount, setPaySomeAmount] = useState<number>(0);
//     const [paymentChoice, setPaymentChoice] = useState<string>("FULL");

//     const [priceOption, setPriceOption] = useState<string>("CASH");

//     // ประเภทการชำระเงิน
//     const [paymentChannel, setPaymentChannel] = useState<string>("CASH");

//     // const remainingAmount = transaction[0]?.AMOUNT - paySomeAmount
//     const remainingAmount = Math.max(
//         0,
//         (product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT || 0) - discountAmount - paySomeAmount
//     );

//     const [valueCalendarInstall, setValueCalendarInstall] = useState<Date | null>(null);
//     const dueDate = dayjs(valueCalendarInstall).format("YYYY-MM-DD");

//     const [errorMessage, setErrorMessage] = useState<string>("");

//     const [qrCodeData, setQrCodeData] = useState<string>('')
//     console.log(`qrCodeData`, qrCodeData);

//     const [loadingQR, setLoadingQR] = useState<boolean>(false)

//     const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO;
//     const POST_PAYMENT_TRANSACTION_URL = `${API_URL_GET_ALLCONTRACT}/Payment/UpdatePaymentTransaction`;
//     const UPDATECONTACT = `${API_URL_GET_ALLCONTRACT}/Contract/updateContract`;
//     const DRAFT_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`

//     const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
//     const GET_QR_PAYMENT_URL = `${API_URL_SALECONNEXT}/GetQRPayment`;

//     {/****** matchedItem *******/ }
//     const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false);
//     const [draft, setDraft] = useState<any[]>([]);

//     useEffect(() => {
//         const getDataDraft = async () => {
//             setIsLoadingDraft(true);
//             try {
//                 const response = await axios.get(DRAFT_ALLCONTRACT_URL);
//                 const data = Array.isArray(response.data.data) ? response.data.data : [];
//                 setDraft(data);
//             } catch (error) {
//                 console.error('Error fetching DRAFT_ALLCONTRACT_URL:', error);
//             } finally {
//                 setIsLoadingDraft(false);
//             }
//         };
//         getDataDraft();
//     }, []);

//     // state ตัวเก็บ matchedItem
//     const [matchedItem, setMatchedItem] = useState<ItemProps | null>(null);
//     console.log(`matchedItem`, matchedItem);

//     useEffect(() => {
//         if (!isLoadingDraft) {
//             const found = draft.find(d => d.REFNO === refno) || null;
//             setMatchedItem(found);
//         }
//     }, [draft, isLoadingDraft]);

//     {/****** matchedItem *******/ }

//     const getQRPayment = async () => {
//         try {
//             setLoadingQR(true);

//             // ตรงนี้คำนวนยอดที่จะจ่ายก่อน
//             // ถ้า PACKAGETYPEID !== 1 → เงินผ่อน (installment) → ใช้ amountToPay
//             // ถ้า PACKAGETYPEID === 1 → เงินสด (cash) → ใช้ netPrice
//             const amountToPay = payFullAmount ? paymentAmount : paySomeAmount;
//             const isInstallment = product[0]?.Package[0]?.PACKAGETYPEID !== 1;
//             const qrAmount = isInstallment ? amountToPay : netPrice;

//             console.log('qrAmount', qrAmount);

//             const formData = new FormData();
//             formData.append('RefNo', refno);
//             formData.append('Amount', qrAmount.toString());

//             console.log('refno', refno);
//             console.log('Amount', qrAmount.toString());

//             const response = await axios.post(GET_QR_PAYMENT_URL, formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//             });

//             console.log(`response`, response);

//             if (response.status === 200 && response.data) {
//                 setQrCodeData(response.data.data.QrCode || '');
//             }
//         } catch (error) {
//             console.error('Error fetching QR Payment:', error);
//         } finally {
//             setLoadingQR(false);
//         }
//     };

//     const handlePayQuickChange = (isPayQuick: boolean) => {
//         setQrCodeData('')
//         setPayQuick(isPayQuick);
//         setStatus(isPayQuick ? "PAID" : "SCHEDULE");;
//         setPaymentChannel(isPayQuick ? "CASH" : "NONE");
//         setPaymentChoice(isPayQuick ? (payFullAmount ? "FULL" : "SOME") : "NONE"); // อัปเดต PAYMENTCHOICE
//     };

//     const handlePayFullAmountChange = (value: boolean) => {
//         setQrCodeData('')
//         setPayFullAmount(value)
//         setPaymentChoice(value ? 'FULL' : 'SOME')

//         if (!value) {
//             // ถ้าเป็นชำระบางส่วน => สถานะ SCHEDULE
//             setStatus('SCHEDULE')
//             // บังคับให้เป็นเงินสด
//             setPaymentChannel('CASH')
//             setPriceOption('CASH')     // <<--- เพิ่มบรรทัดนี้ด้วย
//         } else {
//             // ถ้าเป็นชำระเต็มจำนวน => สถานะ PAID
//             setStatus('PAID')
//             // บังคับให้เป็นเงินสด
//             setPaymentChannel('CASH')
//             setPriceOption('CASH')     // <<--- เพิ่มบรรทัดนี้ด้วย
//         }
//     }

//     const handleDateChangeInstall = (date: Date | null) => {
//         setValueCalendarInstall(date);
//     };

//     const handlePaymentChannelChange = (channel: string) => {
//         setPaymentChannel(channel)

//         // ถ้าผู้ใช้เลือก "QR CODE" → call API
//         if (channel === 'QR CODE') {
//             // เช็คยอดที่จะจ่าย
//             let amountToPay = 0
//             if (payFullAmount) {
//                 // ชำระเต็ม → (paymentAmount - discount) สมมติเป็นงวดแรก
//                 amountToPay = Math.max(0, paymentAmount - discountAmount)
//             } else {
//                 // ชำระบางส่วน → paySomeAmount
//                 amountToPay = paySomeAmount
//             }

//             // call API ขอ QR
//             getQRPayment()
//         } else {
//             // ถ้าเปลี่ยนกลับเป็น 'CASH' ก็เคลียร์ qrCodeData
//             setQrCodeData('')
//         }
//     }

//     const handlePriceOptionChange = (option: string) => {
//         setPriceOption(option)

//         // ถ้าเลือก QR CODE จากชุด priceOption
//         if (option === "QR CODE") {
//             // ก็ต้องเรียก getQRPayment ด้วย
//             // หรือบังคับ paymentChannel เป็น "QR CODE" ไปเลย
//             setPaymentChannel("QR CODE")
//             getQRPayment()
//         } else {
//             // ถ้าเป็น "CASH"
//             setPaymentChannel("CASH")
//             setQrCodeData('')
//         }
//     }

//     // ฟังก์ชัน handleSomeAmountChange (แก้ให้ลบหมด = 0)
//     const handleSomeAmountChange = (value: string) => {
//         // ล้างค่า QR (ถ้ามี)
//         setQrCodeData('')

//         // 1) ถ้าผู้ใช้ลบตัวเลขจนเป็น "" หรือ "0" → ให้เป็น 0
//         if (!value) {
//             setPaySomeAmount(0)
//             setErrorMessage('')
//             return
//         }
//         if (value === '0') {
//             setPaySomeAmount(0)
//             setErrorMessage('')
//             return
//         }

//         // 2) จากนั้นตรวจสอบเลข
//         const number = Number(value)
//         if (isNaN(number) || number < 0) {
//             setErrorMessage("กรุณากรอกจำนวนเงินที่ถูกต้อง")
//         } else if (number > netPrice) {
//             setPaySomeAmount(number)
//             setErrorMessage(`ห้ามชำระเกินราคาสุทธิ ${netPrice.toLocaleString()} บาท`)
//         } else {
//             setPaySomeAmount(number)
//             setErrorMessage('')
//         }
//     }

//     const handleSomeAmountBlur = () => {
//         // กรณีต้องการให้ยิงเฉพาะตอนเป็น QR CODE
//         if (paymentChannel === 'QR CODE') {
//             getQRPayment()
//         }
//     }

//     // const allData = {
//     //     REFNO: refno,
//     //     EMPID: EmpId,
//     //     STATUS: status,
//     //     DUEDATE: status === "SCHEDULE"
//     //         ? dueDate
//     //         : (paymentChoice === "FULL" || paySomeAmount >= paymentAmount - discountAmount
//     //             ? ""
//     //             : dueDate),
//     //     PAYMENTPERIODDETAILID: paymentPeriodDetailId,
//     //     PAYMENTPERIODNUMBER: paymentPeriodNumber,
//     //     PAYMENTCHANNEL: paymentChannel,
//     //     PAYMENTCHOICE: paymentChoice,
//     //     AMOUNT: status === "SCHEDULE" && paymentChoice === "NONE"
//     //         ? paymentAmount - discountAmount
//     //         : (paymentChoice === "FULL"
//     //             ? paymentAmount - discountAmount
//     //             : paySomeAmount),
//     //     PERIODAMOUNT: periodAmount - discountAmount,
//     //     DISCOUNT: discountAmount
//     // };
//     if (!matchedItem) {
//         return null;
//     }

//     const allData = {
//         REFNO: refno,
//         EFFDATE: matchedItem?.EFFDATE ?? item?.EFFDATE ?? '',
//         CREATEDATE: matchedItem?.CREATEDATE ?? item?.CREATEDATE ?? '',
//         CONTNO: matchedItem.CONTNO ?? item?.CONTNO ?? '',
//         EMPID: EmpId,
//         TEAMSALE: TeamSale,
//         SALECODE: SaleCode,
//         SUPEMPID: SupEmpId,
//         SECEMPID: SecEmpId,
//         CUSTOMERDETAIL: matchedItem.CUSTOMERDETAIL ?? item?.CUSTOMERDETAIL ?? '',
//         PRODUCT: matchedItem.PRODUCT ?? item?.PRODUCT ?? '',
//         ADDRESS: matchedItem.ADDRESS ?? item?.CONTNO ?? '',
//         PERIODDETAILS: matchedItem.PRODUCT[0].Package[0].PERIODDETAILS ?? item?.CONTNO ?? '',
//         SCHEDULE: status,
//         TRANSACTION: "",
//         CASHONHAND: "",
//         STATUS: status,
//         DUEDATE: status === "SCHEDULE"
//             ? dueDate
//             : (paymentChoice === "FULL" || paySomeAmount >= paymentAmount - discountAmount
//                 ? ""
//                 : dueDate),
//         PAYMENTPERIODDETAILID: paymentPeriodDetailId,
//         PAYMENTPERIODNUMBER: paymentPeriodNumber,
//         PAYMENTCHANNEL: paymentChannel,
//         PAYMENTCHOICE: paymentChoice,
//         AMOUNT: status === "SCHEDULE" && paymentChoice === "NONE"
//             ? paymentAmount - discountAmount
//             : (paymentChoice === "FULL"
//                 ? paymentAmount - discountAmount
//                 : paySomeAmount),
//         PERIODAMOUNT: periodAmount - discountAmount,
//         DISCOUNT: discountAmount
//     };
//     console.log(`allData`, allData);

//     const onSubmit = async () => {
//         // ตรวจสอบการมี qrCodeData เมื่อเลือกช่องทาง QR CODE
//         if (paymentChannel === "QR CODE" && qrCodeData) {
//             Swal.fire("แจ้งเตือน", "กรุณาทำการสแกน qr code ก่อน", "warning");
//             return;
//         }
//         // try {
//         //     const response = await axios.post(POST_PAYMENT_TRANSACTION_URL, allData, {
//         //         headers: {
//         //             "Content-Type": "application/json",
//         //         },
//         //     });
//         //     console.log("📬 response.data:", response.data);

//         //     if (response.status === 200) {
//         //         Swal.fire("สำเร็จ", "บันทึกธุรกรรมการชำระเงินสำเร็จ", "success");
//         //         navigate("/firstBill/overview");
//         //     } else {
//         //         Swal.fire("เกิดข้อผิดพลาด", response.data.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
//         //     }
//         // } catch (error) {
//         //     console.error("Error saving data:", error);
//         //     Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้", "error");

//         try {
//             const response = await axios.post(
//                 POST_PAYMENT_TRANSACTION_URL,
//                 allData,
//                 { headers: { "Content-Type": "application/json" } }
//             );

//             // ดูเฉพาะ payload ที่ server ส่งกลับ
//             console.log("📬 response.data:", response.data);

//             if (response.status === 200) {
//                 Swal.fire("สำเร็จ", "บันทึกธุรกรรมการชำระเงินสำเร็จ", "success");
//                 navigate("/dashboard");
//             } else {
//                 Swal.fire(
//                     "เกิดข้อผิดพลาด",
//                     response.data.message || "ไม่สามารถบันทึกข้อมูลได้",
//                     "error"
//                 );
//             }
//         } catch (error: any) {
//             console.error("Error saving data:", error);
//             Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้", "error");
//         }
//     }

//     // const onSubmit = async (data: any) => {
//     //     // ตรวจสอบกรณีเลือก QR CODE แต่ยังไม่ได้สแกน
//     //     if (paymentChannel === "QR CODE" && qrCodeData) {
//     //         Swal.fire("แจ้งเตือน", "กรุณาทำการสแกน qr code ก่อน", "warning");
//     //         return;
//     //     }

//     //     try {
//     //         const response = await axios.post(POST_PAYMENT_TRANSACTION_URL, allData, {
//     //             headers: { "Content-Type": "application/json" },
//     //         });

//     //         if (response.status === 200) {
//     //             Swal.fire("สำเร็จ", "บันทึกธุรกรรมการชำระเงินสำเร็จ", "success");

//     //             // รอสักครู่ให้ SweetAlert แสดงก่อน แล้วค่อย navigate
//     //             setTimeout(() => {
//     //                 // ถ้ามาจาก sale/contract, updateSalesContract หรือ sale/step
//     //                 const saleRoutes = [
//     //                     '/sale/contract',
//     //                     '/sale/update/UpdateSalesContract',
//     //                     '/sale/step',
//     //                 ];
//     //                 if (saleRoutes.includes(from)) {
//     //                     // ไปหน้า photo ต่อ
//     //                     navigate('/sale/photo', {
//     //                         state: { item, from }
//     //                     });
//     //                 } else {
//     //                     // ปกติไปหน้า overview ของ firstBill
//     //                     navigate('/firstBill/overview', { state: item });
//     //                 }
//     //             }, 500);

//     //         } else {
//     //             Swal.fire("เกิดข้อผิดพลาด", response.data.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
//     //         }

//     //     } catch (error) {
//     //         console.error("Error saving data:", error);
//     //         Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้", "error");
//     //     }
//     // };

//     const handleBack = () => {
//         const saleRoutes = [
//             '/sale/contract',
//             '/sale/update/UpdateSalesContract',
//             '/sale/step',
//         ]
//         if (saleRoutes.includes(from)) {
//             navigate('/sale/step', { state: item })
//         } else {
//             navigate('/firstBill/overview', { state: item })
//         }
//     }

//     return (
//         <>
//             <Content>
//                 <div className='d-flex justify-content-between align-items-center my-5'>
//                     <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
//                         data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//                         className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
//                         <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//                             <li className={`breadcrumb-item text-gray-900 font ${styles.titlePage}`}>การรับชำระเงินงวดแรก</li>
//                         </ul>
//                     </div>
//                 </div>
//                 <span className={`${styles.fontSize}`}>เลขที่ขาย: </span><span className={`${styles.titlePage}`}>{refno}</span>

//                 <div className='row'>
//                     {/* Card Body */}
//                     <div className='col-lg-6'>
//                         <div className='accordion mb-10' id='kt_accordion_1'>
//                             <div className='accordion-item mb-10'>
//                                 <h2 className='accordion-header' id='kt_accordion_1_header_1'>
//                                     <h3
//                                         className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
//                                         data-bs-toggle='collapse'
//                                         data-bs-target='#kt_accordion_1_body_1'
//                                         aria-expanded='true'
//                                         aria-controls='kt_accordion_1_body_1'
//                                         style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
//                                     >
//                                         การรับชำระเงินงวดแรก
//                                     </h3>
//                                 </h2>
//                                 <div
//                                     id='kt_accordion_1_body_1'
//                                     className='accordion-collapse collapse show'
//                                     aria-labelledby='kt_accordion_1_header_1'
//                                     data-bs-parent='#kt_accordion_1'
//                                 >
//                                     <div className='accordion-body'>
//                                         <form noValidate className='form'>
//                                             <div className='card-body px-lg-9 px-1'>

//                                                 <div className="">
//                                                     <div className="d-flex mb-6">
//                                                         <div className="form-check form-check-inline me-3">
//                                                             <input
//                                                                 className="form-check-input"
//                                                                 type="radio"
//                                                                 name="payQuick"
//                                                                 checked={payQuick}
//                                                                 onChange={() => handlePayQuickChange(true)}
//                                                             />
//                                                             <label className={`${styles.label} me-2`}>ชำระเงินทันที</label>
//                                                         </div>
//                                                         <div className="form-check form-check-inline me-3">
//                                                             <input
//                                                                 className="form-check-input"
//                                                                 type="radio"
//                                                                 name="payQuick"
//                                                                 checked={!payQuick}
//                                                                 onChange={() => handlePayQuickChange(false)}
//                                                             />
//                                                             <label className={`${styles.label} me-2`}>นัดชำระ</label>
//                                                         </div>
//                                                     </div>

//                                                     {/* Start ชำระเงินทันที */}
//                                                     {payQuick && (
//                                                         <>
//                                                             <div className="d-flex mb-6 mt-10">
//                                                                 <div className="form-check form-check-inline me-3">
//                                                                     <input
//                                                                         className="form-check-input"
//                                                                         type="radio"
//                                                                         name="payFullAmount"
//                                                                         checked={payFullAmount}
//                                                                         onChange={() => handlePayFullAmountChange(true)}
//                                                                     />
//                                                                     <label className={`${styles.label} me-2`}>ชำระเต็มจำนวน</label>
//                                                                 </div>
//                                                                 <div className="form-check form-check-inline me-3">
//                                                                     <input
//                                                                         className="form-check-input"
//                                                                         type="radio"
//                                                                         name="payFullAmount"
//                                                                         checked={!payFullAmount}
//                                                                         onChange={() => handlePayFullAmountChange(false)}
//                                                                     />
//                                                                     <label className={`${styles.label} me-2`}>
//                                                                         {product[0]?.Package[0]?.PACKAGETYPEID === 1 ? (
//                                                                             <span>ชำระบางส่วน</span>
//                                                                         ) : (
//                                                                             <span>ชำระบางส่วน / เกินจำนวน</span>
//                                                                         )}
//                                                                     </label>
//                                                                 </div>
//                                                             </div>

//                                                             {/* Start ชำระเต็ม */}
//                                                             {payFullAmount && (
//                                                                 <>
//                                                                     {product[0].Package.PACKAGETYPEID === 1 ? (
//                                                                         <div className="mb-6">
//                                                                             <label className={`${styles.label} me-2`}>จำนวนเงินที่ต้องชำระ</label>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 className="form-control"
//                                                                                 readOnly
//                                                                                 style={{
//                                                                                     backgroundColor: '#d7dbde',
//                                                                                 }}
//                                                                                 value={paymentAmount}
//                                                                             // value={transaction[0]?.AMOUNT}
//                                                                             />
//                                                                         </div>
//                                                                     ) : (
//                                                                         <div className="mb-6">
//                                                                             <label className={`${styles.label} me-2`}>จำนวนเงินที่ต้องชำระ</label>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 className={`form-control ${styles.label}`}
//                                                                                 readOnly
//                                                                                 style={{
//                                                                                     backgroundColor: '#d7dbde',
//                                                                                 }}
//                                                                                 value={paymentAmount - discountAmount}
//                                                                             // value={transaction[0]?.AMOUNT}
//                                                                             />
//                                                                         </div>
//                                                                     )}
//                                                                     <div className="d-flex mb-6 mt-10">
//                                                                         <div className="form-check form-check-inline me-3">
//                                                                             <input
//                                                                                 className="form-check-input"
//                                                                                 type="radio"
//                                                                                 name="paymentChannel"
//                                                                                 checked={paymentChannel === "CASH"}
//                                                                                 onChange={() => handlePaymentChannelChange("CASH")}
//                                                                             />
//                                                                             <label className={`${styles.label} me-2`}>เงินสด</label>
//                                                                         </div>
//                                                                         <div className="form-check form-check-inline me-3">
//                                                                             <input
//                                                                                 className="form-check-input"
//                                                                                 type="radio"
//                                                                                 name="paymentChannel"
//                                                                                 checked={paymentChannel === "QR CODE"}
//                                                                                 onChange={() => handlePaymentChannelChange("QR CODE")}
//                                                                             />
//                                                                             <label className={`${styles.label} me-2`}>QR CODE</label>
//                                                                         </div>
//                                                                     </div>
//                                                                 </>
//                                                             )}
//                                                             {/* End ชำระเต็ม */}

//                                                             {/* Start ชำระบางส่วน / เกินจำนวน */}
//                                                             {!payFullAmount && (
//                                                                 <>
//                                                                     {/* {product[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
//                                                                         <div className="mb-6">
//                                                                             <label className={`${styles.label} me-2`}>ราคาสุทธิ</label>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 className="form-control"
//                                                                                 readOnly
//                                                                                 style={{
//                                                                                     backgroundColor: '#d7dbde',
//                                                                                 }}
//                                                                                 value={netPrice}
//                                                                             />
//                                                                         </div>
//                                                                     )} */}
//                                                                     <div className="mb-6">
//                                                                         {product[0]?.Package[0]?.PACKAGETYPEID !== 1 ? (
//                                                                             <>
//                                                                                 <label className={`${styles.label} me-2`}>จำนวนเงินที่ต้องชำระงวดที่ 1</label>
//                                                                                 <input
//                                                                                     type="text"
//                                                                                     className={`form-control ${styles.label}`}
//                                                                                     readOnly
//                                                                                     style={{
//                                                                                         backgroundColor: '#d7dbde',
//                                                                                     }}
//                                                                                     value={paymentAmount - discountAmount}
//                                                                                 // value={transaction[0]?.AMOUNT}
//                                                                                 />
//                                                                             </>
//                                                                         ) : (
//                                                                             <>
//                                                                                 <label className={`${styles.label} me-2`}>ราคาสุทธิ</label>
//                                                                                 <input
//                                                                                     type="text"
//                                                                                     className={`form-control ${styles.label}`}
//                                                                                     readOnly
//                                                                                     style={{
//                                                                                         backgroundColor: '#d7dbde',
//                                                                                     }}
//                                                                                     value={netPrice}
//                                                                                 />
//                                                                             </>
//                                                                         )}
//                                                                     </div>

//                                                                     <div className="mb-6">
//                                                                         {product[0]?.Package[0]?.PACKAGETYPEID !== 1 ? (
//                                                                             <>
//                                                                                 <label className={`${styles.label} me-2`}>จำนวนเงินที่แบ่งชำระ</label>
//                                                                                 <input
//                                                                                     type="text"
//                                                                                     className="form-control"
//                                                                                     onChange={(e) => handleSomeAmountChange(e.target.value)}
//                                                                                     value={paySomeAmount}
//                                                                                 />
//                                                                             </>
//                                                                         ) : (
//                                                                             <>
//                                                                                 <label className={`${styles.label} me-2`}>จำนวนเงินที่ชำระ</label>
//                                                                                 <input
//                                                                                     type="text"
//                                                                                     className={`form-control ${styles.label} ${errorMessage ? "is-invalid" : ""}`}
//                                                                                     onChange={(e) => handleSomeAmountChange(e.target.value)}
//                                                                                     onBlur={handleSomeAmountBlur}
//                                                                                     value={paySomeAmount === 0 ? "0" : paySomeAmount} // ใช้ "0" เพื่อให้พิมพ์ได้
//                                                                                     min="0" // ป้องกันค่าติดลบ
//                                                                                     inputMode='numeric'
//                                                                                     pattern='[0-9]*'
//                                                                                 />
//                                                                                 {errorMessage && (
//                                                                                     <div className="text-danger mt-1">{errorMessage}</div>
//                                                                                 )}
//                                                                             </>
//                                                                         )}
//                                                                     </div>
//                                                                     <div className="mb-6">
//                                                                         <label className={`${styles.label} me-2`}>จำนวนเงินที่เหลืองวดที่ 1</label>
//                                                                         <input
//                                                                             type="text"
//                                                                             className={`form-control ${styles.label}`}
//                                                                             readOnly
//                                                                             style={{
//                                                                                 backgroundColor: '#d7dbde',
//                                                                             }}
//                                                                             value={isNaN(remainingAmount) ? 0 : remainingAmount}
//                                                                         />
//                                                                     </div>
//                                                                     {/* ถ้าชำระมากกว่าหรือเท่ากับ ไม่ต้องโชว์ */}
//                                                                     {/* {paySomeAmount < transaction[0]?.AMOUNT && ( */}
//                                                                     {/* {paySomeAmount < paymentAmount - discountAmount && (
//                                                                         <div className="col-lg-12 mb-6">
//                                                                             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                                                                                 <label className={`${styles.label} me-2`}>วันที่สะดวกชำระส่วนที่เหลือ</label>
//                                                                                 <DatePicker
//                                                                                     selected={valueCalendarInstall}
//                                                                                     onChange={handleDateChangeInstall}
//                                                                                     className="form-control mb-3 mb-lg-0"
//                                                                                     showYearDropdown
//                                                                                     showMonthDropdown
//                                                                                     dropdownMode="select"
//                                                                                     isClearable
//                                                                                     dateFormat="yyyy/MM/dd"
//                                                                                     withPortal
//                                                                                 />
//                                                                             </div>
//                                                                         </div>
//                                                                     )} */}
//                                                                     {paySomeAmount < paymentAmount - discountAmount && (
//                                                                         <div className="col-lg-12 mb-6">
//                                                                             <label className={`${styles.label} mb-2`}>วันที่สะดวกชำระส่วนที่เหลือ</label>
//                                                                             <input
//                                                                                 type="date"
//                                                                                 className={`form-control ${styles.label}`}
//                                                                                 value={valueCalendarInstall ? dayjs(valueCalendarInstall).format('YYYY-MM-DD') : ''}
//                                                                                 onChange={e => {
//                                                                                     const v = e.target.value
//                                                                                     setValueCalendarInstall(v ? new Date(v) : null)
//                                                                                 }}
//                                                                             />
//                                                                         </div>
//                                                                     )}

//                                                                     {/* )} */}
//                                                                     <div className="d-flex mb-6 mt-10">
//                                                                         <div className="form-check form-check-inline me-3">
//                                                                             <input
//                                                                                 className="form-check-input"
//                                                                                 type="radio"
//                                                                                 name="priceOption"
//                                                                                 checked={priceOption === "CASH"}
//                                                                                 onChange={() => handlePriceOptionChange("CASH")}
//                                                                             />
//                                                                             <label className={`${styles.label} me-2`}>เงินสด</label>
//                                                                         </div>
//                                                                         <div className="form-check form-check-inline me-3">
//                                                                             <input
//                                                                                 className="form-check-input"
//                                                                                 type="radio"
//                                                                                 name="priceOption"
//                                                                                 checked={priceOption === "QR CODE"}
//                                                                                 onChange={() => handlePriceOptionChange("QR CODE")}
//                                                                             />
//                                                                             <label className={`${styles.label} me-2`}>QR CODE</label>
//                                                                         </div>
//                                                                     </div>
//                                                                 </>
//                                                             )}
//                                                             {/* End ชำระบางส่วน / เกินจำนวน */}
//                                                         </>
//                                                     )}
//                                                     {/* End ชำระเงินทันที */}

//                                                     {/* Start นัดชำระ */}
//                                                     {/* {!payQuick && (
//                                                         <div className="col-lg-12 mb-6">
//                                                             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                                                                 <label className={`${styles.label} me-2`}>วันที่สะดวกชำระ</label>
//                                                                 <DatePicker
//                                                                     selected={valueCalendarInstall}
//                                                                     onChange={handleDateChangeInstall}
//                                                                     className="form-control mb-3 mb-lg-0"
//                                                                     showYearDropdown
//                                                                     showMonthDropdown
//                                                                     dropdownMode="select"
//                                                                     isClearable
//                                                                     dateFormat="yyyy/MM/dd"
//                                                                     withPortal
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                     )} */}
//                                                     {!payQuick && (
//                                                         <div className="col-lg-12 mb-6">
//                                                             {/* ไม่ต้องใช้ flex-column แล้ว แค่ label กับ input */}
//                                                             <label className={`${styles.label} mb-2`}>วันที่สะดวกชำระ</label>
//                                                             <input
//                                                                 type="date"
//                                                                 className={`form-control ${styles.label}`}
//                                                                 // แปลง Date → YYYY-MM-DD เพื่อให้ value ของ input ตรงกัน
//                                                                 value={valueCalendarInstall ? dayjs(valueCalendarInstall).format('YYYY-MM-DD') : ''}
//                                                                 onChange={e => {
//                                                                     const dateStr = e.target.value
//                                                                     // ถ้าเลือกค่าว่าง ให้เป็น null
//                                                                     setValueCalendarInstall(dateStr ? new Date(dateStr) : null)
//                                                                 }}
//                                                             />
//                                                         </div>
//                                                     )}
//                                                     {/* End นัดชำระ*/}

//                                                     <div className='mb-6 mt-10 d-flex justify-content-center'>
//                                                         {loadingQR ? (
//                                                             <ThreeDot />
//                                                         ) : qrCodeData ? (
//                                                             <img
//                                                                 src={qrCodeData}
//                                                                 alt='QR Code'
//                                                                 style={{ width: 200, height: 200 }}
//                                                             />
//                                                         ) : null}
//                                                     </div>

//                                                 </div>
//                                             </div>

//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {/* End Card Body */}

//                     {/* Card Body */}
//                     <div className='col-lg-6 mb-20'>
//                         <div className='card'>
//                             <div className='card-body'>
//                                 <div className='d-flex justify-content-between mb-5'>
//                                     <label className={`col-lg-4 fw-bold ${styles.label}`}>
//                                         รายละเอียดสัญญา
//                                     </label>
//                                     <button
//                                         type='button'
//                                         className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
//                                     >
//                                         <KTIcon iconName='category' className='fs-2' />
//                                     </button>
//                                 </div>

//                                 <div className=''>
//                                     {contNo && (
//                                         <div className='row mb-7'>
//                                             <label className={`col-lg-4 text-muted ${styles.label}`}>เลขที่สัญญา</label>
//                                             <label className={`col-lg-4 ${styles.label}`}>
//                                                 <span className={`${styles.label}`}>{contNo}</span>
//                                             </label>
//                                         </div>
//                                     )}

//                                     <div className='row mb-7'>
//                                         <label className={`col-lg-4 text-muted ${styles.label}`}>ชื่อลูกค้า</label>
//                                         <div className='col-7 col-md-8'>
//                                             <label className={`col-lg-4 ${styles.label}`}>
//                                                 {customerDetail[0]?.PREFIX[0]?.PREFIXNAME} {customerDetail[0]?.CUSTOMERNAME} {customerDetail[0]?.CUSTOMERLASTNAME}
//                                             </label>
//                                         </div>
//                                     </div>

//                                     {firstAddress?.ADDRESSINSTALLATION.ADDRESSPROVINCENAME && (
//                                         <div className="row mb-7">
//                                             {/* หัวข้ออยู่ col-lg-4 */}
//                                             <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่ติดตั้ง</label>
//                                             {/* เนื้อหาอยู่ col-lg-7 */}
//                                             <div className="col-lg-7 d-flex align-items-center">
//                                                 <span className={`${styles.label} me-2`}>
//                                                     {firstAddress.ADDRESSINSTALLATION.ADDRESSNUMBER}{" "}
//                                                     {firstAddress.ADDRESSINSTALLATION.ADDRESSMOO && `หมู่ ${firstAddress.ADDRESSINSTALLATION.ADDRESSMOO}`}{" "}
//                                                     {firstAddress.ADDRESSINSTALLATION.ADDRESSSOI && `ซอย ${firstAddress.ADDRESSINSTALLATION.ADDRESSSOI}`}{" "}
//                                                     {firstAddress.ADDRESSINSTALLATION.ADDRESSROAD && `ถนน ${firstAddress.ADDRESSINSTALLATION.ADDRESSROAD}`}{" "}
//                                                     {firstAddress.ADDRESSINSTALLATION.ADDRESSDISTRICTNAME && `เขต ${firstAddress.ADDRESSINSTALLATION.ADDRESSDISTRICTNAME}`}{" "}
//                                                     {firstAddress.ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME && `แขวง ${firstAddress.ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME}`}{" "}
//                                                     {firstAddress.ADDRESSINSTALLATION.ADDRESSPROVINCENAME && `จังหวัด ${firstAddress.ADDRESSINSTALLATION.ADDRESSPROVINCENAME}`}{" "}
//                                                     {firstAddress.ADDRESSINSTALLATION.ADDRESSZIPCODE}
//                                                 </span>
//                                                 <FontAwesomeIcon icon={faLocationDot} size="2x" />
//                                             </div>
//                                         </div>
//                                     )}

//                                     {firstAddress?.ADDRESSCARD.ADDRESSPROVINCENAME && (
//                                         <div className="row mb-7">
//                                             {/* หัวข้ออยู่ col-lg-4 */}
//                                             <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่ตามบัตร</label>
//                                             {/* เนื้อหาอยู่ col-lg-7 */}
//                                             <div className="col-lg-7 d-flex align-items-center">
//                                                 <span className={`${styles.label} me-2`}>
//                                                     {firstAddress.ADDRESSCARD.ADDRESSNUMBER && firstAddress.ADDRESSCARD.ADDRESSNUMBER}{" "}
//                                                     {firstAddress.ADDRESSCARD.ADDRESSMOO && `หมู่ ${firstAddress.ADDRESSCARD.ADDRESSMOO}`}{" "}
//                                                     {firstAddress.ADDRESSCARD.ADDRESSSOI && `ซอย ${firstAddress.ADDRESSCARD.ADDRESSSOI}`}{" "}
//                                                     {firstAddress.ADDRESSCARD.ADDRESSROAD && `ถนน ${firstAddress.ADDRESSCARD.ADDRESSROAD}`}{" "}
//                                                     {firstAddress.ADDRESSCARD.ADDRESSDISTRICTNAME && `เขต ${firstAddress.ADDRESSCARD.ADDRESSDISTRICTNAME}`}{" "}
//                                                     {firstAddress.ADDRESSCARD.ADDRESSSUBDISTRICTNAME && `แขวง ${firstAddress.ADDRESSCARD.ADDRESSSUBDISTRICTNAME}`}{" "}
//                                                     {firstAddress.ADDRESSCARD.ADDRESSPROVINCENAME && `จังหวัด ${firstAddress.ADDRESSCARD.ADDRESSPROVINCENAME}`}{" "}
//                                                     {firstAddress.ADDRESSCARD.ADDRESSZIPCODE && firstAddress.ADDRESSCARD.ADDRESSZIPCODE}
//                                                 </span>
//                                                 <FontAwesomeIcon icon={faLocationDot} size="2x" />
//                                             </div>
//                                         </div>
//                                     )}

//                                     {firstAddress?.ADDRESSPAYMENT.ADDRESSPROVINCENAME && (
//                                         <div className="row mb-7">
//                                             {/* หัวข้ออยู่ col-lg-4 */}
//                                             <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่เก็บเงิน</label>
//                                             {/* เนื้อหาอยู่ col-lg-7 */}
//                                             <div className="col-lg-7 d-flex align-items-center">
//                                                 <span className={`${styles.label} me-2`}>                                                  {firstAddress.ADDRESSPAYMENT.ADDRESSNUMBER && firstAddress.ADDRESSPAYMENT.ADDRESSNUMBER}{" "}
//                                                     {firstAddress.ADDRESSPAYMENT.ADDRESSMOO && `หมู่ ${firstAddress.ADDRESSPAYMENT.ADDRESSMOO}`}{" "}
//                                                     {firstAddress.ADDRESSPAYMENT.ADDRESSSOI && `ซอย ${firstAddress.ADDRESSPAYMENT.ADDRESSSOI}`}{" "}
//                                                     {firstAddress.ADDRESSPAYMENT.ADDRESSROAD && `ถนน ${firstAddress.ADDRESSPAYMENT.ADDRESSROAD}`}{" "}
//                                                     {firstAddress.ADDRESSPAYMENT.ADDRESSDISTRICTNAME && `เขต ${firstAddress.ADDRESSPAYMENT.ADDRESSDISTRICTNAME}`}{" "}
//                                                     {firstAddress.ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME && `แขวง ${firstAddress.ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME}`}{" "}
//                                                     {firstAddress.ADDRESSPAYMENT.ADDRESSPROVINCENAME && `จังหวัด ${firstAddress.ADDRESSPAYMENT.ADDRESSPROVINCENAME}`}{" "}
//                                                     {firstAddress.ADDRESSPAYMENT.ADDRESSZIPCODE && firstAddress.ADDRESSPAYMENT.ADDRESSZIPCODE}{" "}
//                                                 </span>
//                                                 <FontAwesomeIcon icon={faLocationDot} size="2x" />
//                                             </div>
//                                         </div>
//                                     )}

//                                     {firstAddress?.ADDRESSTAX.ADDRESSPROVINCENAME && (
//                                         <div className="row mb-7">
//                                             {/* หัวข้ออยู่ col-lg-4 */}
//                                             <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่เสึยภาษี</label>
//                                             {/* เนื้อหาอยู่ col-lg-7 */}
//                                             <div className="col-lg-7 d-flex align-items-center">
//                                                 <span className={`${styles.label} me-2`}>                                                    {firstAddress.ADDRESSTAX.ADDRESSNUMBER && firstAddress.ADDRESSTAX.ADDRESSNUMBER}{" "}
//                                                     {firstAddress.ADDRESSTAX.ADDRESSMOO && `หมู่ ${firstAddress.ADDRESSTAX.ADDRESSMOO}`}{" "}
//                                                     {firstAddress.ADDRESSTAX.ADDRESSSOI && `ซอย ${firstAddress.ADDRESSTAX.ADDRESSSOI}`}{" "}
//                                                     {firstAddress.ADDRESSTAX.ADDRESSROAD && `ถนน ${firstAddress.ADDRESSTAX.ADDRESSROAD}`}{" "}
//                                                     {firstAddress.ADDRESSTAX.ADDRESSDISTRICTNAME && `เขต ${firstAddress.ADDRESSTAX.ADDRESSDISTRICTNAME}`}{" "}
//                                                     {firstAddress.ADDRESSTAX.ADDRESSSUBDISTRICTNAME && `แขวง ${firstAddress.ADDRESSTAX.ADDRESSSUBDISTRICTNAME}`}{" "}
//                                                     {firstAddress.ADDRESSTAX.ADDRESSPROVINCENAME && `จังหวัด ${firstAddress.ADDRESSTAX.ADDRESSPROVINCENAME}`}{" "}
//                                                     {firstAddress.ADDRESSTAX.ADDRESSZIPCODE && firstAddress.ADDRESSTAX.ADDRESSZIPCODE}{" "}
//                                                 </span>
//                                                 <FontAwesomeIcon icon={faLocationDot} size="2x" />
//                                             </div>
//                                         </div>
//                                     )}

//                                     < div className='row mb-10'>
//                                         <label className={`col-lg-4 text-muted ${styles.label}`}>เบอร์โทรติดต่อ</label>
//                                         <div className='col-lg-7'>
//                                             <span className={`${styles.label}`}>
//                                                 {customerDetail[0]?.CUSTOMERMOBILE ?
//                                                     customerDetail[0]?.CUSTOMERMOBILE :
//                                                     firstAddress?.ADDRESSINSTALLATION.ADDRESSPHONE}
//                                             </span>
//                                         </div>
//                                     </div>

//                                     <div className='row mb-7'>
//                                         <label className={`col-lg-4 text-muted ${styles.label}`}>สินค้า</label>
//                                         <div className='col-lg-7 col-md-8'>
//                                             <span className={`${styles.label}`}>{product[0]?.ItemDescription}</span>
//                                         </div>
//                                     </div>

//                                     {product[0]?.Package[0]?.PACKAGETITLE && (
//                                         <div className='row mb-7'>
//                                             <label className={`col-lg-4 text-muted ${styles.label}`}>แพ็คเกจ</label>
//                                             <div className='col-7 col-md-8'>
//                                                 <span className={`${styles.label}`}>{product[0]?.Package[0]?.PACKAGETITLE}</span>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {item?.DISCOUNT[0]?.GIFT && (
//                                         <div className='row mb-7'>
//                                             <label className={`col-lg-4 text-muted ${styles.label}`}>ของแถม</label>
//                                             <div className='col-7 col-md-8'>
//                                                 <span className={`${styles.label}`}>
//                                                     {item?.DISCOUNT[0]?.GIFT?.GIFTNAME ? item?.DISCOUNT[0]?.GIFT?.GIFTNAME : "ไม่มี"}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {product[0]?.Package[0]?.TOTALPRICE && (
//                                         <div className='row mb-7'>
//                                             <label className={`col-lg-4 text-muted ${styles.label}`}>ราคาสินค้า</label>
//                                             <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
//                                                 <span className={`${styles.label}`}>{product[0]?.Package[0]?.TOTALPRICE}</span>
//                                                 <span className='badge badge-light-success'>บาท</span>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {item?.DISCOUNT[0]?.TRADEIN?.HASTRADEIN != 0 && (
//                                         <div className='row mb-7'>
//                                             <label className={`col-lg-4 text-muted ${styles.label}`}>เครื่องเทิร์น</label>
//                                             <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
//                                                 <span className={`${styles.label}`}>
//                                                     {item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME ? item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME : "ไม่มี"}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {item?.DISCOUNT[0]?.DISCOUNTAMOUNT != 0 && (
//                                         <div className='row mb-7'>
//                                             <label className={`col-lg-4 text-muted ${styles.label}`}>ส่วนลด</label>
//                                             <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
//                                                 <span className={`${styles.label}`}>
//                                                     {discountAmount ? discountAmount : "ไม่มี"}
//                                                 </span>
//                                                 <span className='badge badge-light-success'>บาท</span>
//                                             </div>
//                                         </div>
//                                     )}

//                                     <div className='row mb-7'>
//                                         <label className={`col-lg-4 text-muted ${styles.label}`}>ราคาสุทธิ</label>
//                                         <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
//                                             <span className={`${styles.label}`}>{netPrice}</span>
//                                             <span className='badge badge-light-success'>บาท</span>
//                                         </div>
//                                     </div>

//                                     {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
//                                     {product[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
//                                         <>
//                                             <div className='row mb-7'>
//                                                 <label className={`col-lg-4 text-muted ${styles.label}`}>งวดที่ 1 ที่ต้องชำระ</label>
//                                                 <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
//                                                     <span className={`${styles.label}`}>{product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT - discountAmount}</span>
//                                                     <span className='badge badge-light-success'>บาท</span>
//                                                 </div>
//                                             </div>

//                                             {product[0]?.Package[0]?.PERIODDETAILS.length > 1 && (
//                                                 <div className='row mb-7'>
//                                                     <label className={`col-lg-4 text-muted ${styles.label}`}>งวดที่ 2 ถึง {product[0]?.Package[0]?.PERIODDETAILS.length} ต้องชำระงวดละ</label>
//                                                     <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
//                                                         <span className={`${styles.label}`}>{product[0]?.Package[0]?.PERIODDETAILS[1]?.PAYMENTAMOUNT}</span>
//                                                         <span className='badge badge-light-success'>บาท</span>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </>
//                                     )}

//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {/* End Card Body */}

//                 </div >

//                 <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
//                     <button
//                         className={`${styles.btnSecondary}`}
//                         onClick={handleBack}
//                     >
//                         ย้อนกลับ
//                     </button>
//                     <button
//                         className={`${styles.btnPrimary}`}
//                         onClick={onSubmit}
//                     >
//                         บันทึก
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
//                         className={`${styles.btnSecondary}`}
//                         onClick={handleBack}
//                     >
//                         ย้อนกลับ
//                     </button>
//                     <button
//                         className={`${styles.btnPrimary}`}
//                         onClick={onSubmit}
//                     >
//                         บันทึก
//                     </button>
//                 </div>

//             </Content >
//         </>
//     )
// }

// export default CreateFirstBill;



// import styles from "@/styles/style.module.css";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { useState, useEffect, useMemo } from "react";
// import { Content } from "../../../_metronic/layout/components/content";
// import { useAuth } from "../../modules/auth/core/Auth";
// import { KTIcon } from "../../../_metronic/helpers";
// import { v4 as uuidv4 } from "uuid";

// import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import {
//   useUUIDStore,
//   useSaveProductStore,
// } from "../../modules/stores/stepsStore";
// import { useSaveDiscountStore } from "../../modules/stores/stepsStore";

// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";

// import dayjs, { Dayjs } from "dayjs";
// import DatePicker from "react-datepicker";
// import DateTimePicker from "react-datetime-picker";
// import "react-datepicker/dist/react-datepicker.css";
// import "react-datetime-picker/dist/DateTimePicker.css";
// import "react-calendar/dist/Calendar.css";
// import "react-clock/dist/Clock.css";

// import { ThreeDot } from "react-loading-indicators";
// import { log } from "node:console";

// interface ContractState {
//   contNo: string;
// }

// interface ItemProps {
//   REFNO: string;
//   CONTNO: string;
//   EMPID: string;
//   TEAMSALE: string;
//   SALECODE: string;
//   SUPEMPID: string;
//   SECEMPID: string;
//   STATUS: string;
//   PRODUCT: [any];
//   CUSTOMERSTATUS: [any];
//   DISCOUNT: [any];
//   CUSTOMERDETAIL: [any];
//   ADDRESS: AddressItem[];
//   PDPA: [any];
//   CONTRACT: [any];
//   IMAGE: [any];
//   CHECKERCOMMENT: [any];
//   TRANSACTION: [any];
//   SCHEDULE: [any];
//   PERIODDETAILS: [any];
// }

// interface AddressCard {
//   ADDRESSDISTRICT: string;
//   ADDRESSDISTRICTNAME: string;
//   ADDRESSMOO: string;
//   ADDRESSNUMBER: string;
//   ADDRESSPHONE: string;
//   ADDRESSPROVINCE: string;
//   ADDRESSPROVINCENAME: string;
//   ADDRESSROAD: string;
//   ADDRESSSOI: string;
//   ADDRESSSUBDISTRICT: string;
//   ADDRESSSUBDISTRICTNAME: string;
//   ADDRESSZIPCODE: string;
//   USETHISTAX: string;
// }
// interface AddressInstallation {
//   ADDRESSDISTRICT: string;
//   ADDRESSDISTRICTNAME: string;
//   ADDRESSMOO: string;
//   ADDRESSNUMBER: string;
//   ADDRESSPHONE: string;
//   ADDRESSPROVINCE: string;
//   ADDRESSPROVINCENAME: string;
//   ADDRESSROAD: string;
//   ADDRESSSOI: string;
//   ADDRESSSUBDISTRICT: string;
//   ADDRESSSUBDISTRICTNAME: string;
//   ADDRESSZIPCODE: string;
//   USETHISTAX: string;
// }
// interface AddressPayment {
//   ADDRESSDISTRICT: string;
//   ADDRESSDISTRICTNAME: string;
//   ADDRESSMOO: string;
//   ADDRESSNUMBER: string;
//   ADDRESSPHONE: string;
//   ADDRESSPROVINCE: string;
//   ADDRESSPROVINCENAME: string;
//   ADDRESSROAD: string;
//   ADDRESSSOI: string;
//   ADDRESSSUBDISTRICT: string;
//   ADDRESSSUBDISTRICTNAME: string;
//   ADDRESSZIPCODE: string;
//   USETHISTAX: string;
// }

// interface AddressTax {
//   ADDRESSDISTRICT: string;
//   ADDRESSDISTRICTNAME: string;
//   ADDRESSMOO: string;
//   ADDRESSNUMBER: string;
//   ADDRESSPHONE: string;
//   ADDRESSPROVINCE: string;
//   ADDRESSPROVINCENAME: string;
//   ADDRESSROAD: string;
//   ADDRESSSOI: string;
//   ADDRESSSUBDISTRICT: string;
//   ADDRESSSUBDISTRICTNAME: string;
//   ADDRESSZIPCODE: string;
//   USETHISTAX: string;
// }

// // ถ้าโครงสร้างในฐานข้อมูลเหมือนตัวอย่างข้างบน
// interface AddressItem {
//   ADDRESSCARD: AddressCard;
//   ADDRESSINSTALLATION: AddressInstallation;
//   ADDRESSPAYMENT: AddressPayment;
//   ADDRESSTAX: AddressTax;
// }

// interface LocationState {
//   item?: ItemProps;
//   from?: string;
// }

// const CreateFirstBill: React.FC = () => {
//   const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO;
//   const POST_PAYMENT_TRANSACTION_URL = `${API_URL_GET_ALLCONTRACT}/Payment/UpdatePaymentTransaction`;

//   const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
//   const GET_QR_PAYMENT_URL = `${API_URL_SALECONNEXT}/GetQRPayment`;

//   const navigate = useNavigate();
//   const MySwal = withReactContent(Swal);

//   const { auth } = useAuth();
//   const EmpId = auth?.data?.[0]?.EmpId || "";
//   const EmpName = auth?.data?.[0]?.EmpName || "";
//   const TeamSale = auth?.data?.[0]?.TeamSale || "";
//   const SaleCode = auth?.data?.[0]?.SaleCode || "";
//   const SupEmpId = auth?.data?.[0]?.SupEmp || "";
//   const SecEmpId = auth?.data?.[0]?.SecEmp || "";

//   const location = useLocation();
//   // const item = location.state as ItemProps || [];
//   // const from = location.state as ItemProps || [];

//   const state = (location.state ?? {}) as LocationState;
//   const item = state.item;
//   console.log(`item`, item);
//   const from = state.from ?? "";

//   const refno = item?.REFNO ?? "";
//   const product = item?.PRODUCT ?? [];
//   const contNo = item?.CONTNO ?? "";
//   const customerDetail = item?.CUSTOMERDETAIL ?? [];
//   const discountAmount = item?.DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
//   const transaction = item?.TRANSACTION ?? [];
//   // console.log(`transaction`, transaction);

//   const addressArray = item?.ADDRESS;
//   const firstAddress = addressArray?.[0];
//   const secondAddress = addressArray?.[1];
//   const thirdAddress = addressArray?.[2];
//   const fourthAddress = addressArray?.[3];

//   // กดเข้ามาแล้วถ้ามีวันนัดชำระ ให้ติ๊กอยู่ที่ นัดชำระ แล้ววันที่ให้โชวันที่นัดก่อนหน้า
//   useEffect(() => {
//     if (item?.SCHEDULE && item.SCHEDULE.length > 0) {
//       // โหมดนัดชำระ
//       handlePayQuickChange(false);
//       // แปลงวันจาก SCHEDULE[0].DUEDATE (สมมติเป็น ISO string) ให้เป็น Date
//       const due = new Date(item.SCHEDULE[0].DUEDATE);
//       setValueCalendarInstall(due);
//     }
//   }, [item]);

//   const paymentPeriodDetailId =
//     product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTPERIODDETAILID;
//   const paymentPeriodNumber =
//     product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTPERIODNUMBER;
//   const periodAmount = product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT;

//   // ถ้ามาจาก /firstBill/overview ให้ใช้ item.PERIODDETAILS[0].PAYMENTAMOUNT
//   // ไม่งั้นใช้ค่าจากแพ็กเกจตามเดิม
//   const paymentAmount =
//     (from === "/firstBill/overview"
//       ? item?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT
//       : product?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT) ?? 0;

//   console.log("paymentAmount", paymentAmount);
//   // คำนวณยอดที่จะชำระจริง โดยลบส่วนลดถ้ามี
//   // const paymentAmount = Math.max(0, baseAmount - discountAmount);

//   const totalPrice = product[0]?.Package[0]?.TOTALPRICE || 0;
//   const netPrice = totalPrice - discountAmount;
//   // console.log(`netPrice`, netPrice);

//   // ชำระเงินทันที หรือ นัดชำระ
//   const [payQuick, setPayQuick] = useState<boolean>(true);
//   const [status, setStatus] = useState("PAID");

//   // ชำระเต็ม หรือ ชำระบางส่วน / เกินจำนวน
//   const [payFullAmount, setPayFullAmount] = useState<boolean>(true);
//   const [paySomeAmount, setPaySomeAmount] = useState<number>(0);
//   console.log(`จำนวนเงินแบ่งชำระ`, paySomeAmount);
//   const [paymentChoice, setPaymentChoice] = useState<string>("FULL");

//   const [priceOption, setPriceOption] = useState<string>("CASH");

//   // ประเภทการชำระเงิน
//   const [paymentChannel, setPaymentChannel] = useState<string>("CASH");

//   // const remainingAmount = Math.max(
//   //   0,
//   //   (product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT || 0) -
//   //   discountAmount -
//   //   paySomeAmount
//   // );

//   // ใช้ยอดงวดล่าสุด ถ้ามี TRANSACTION ********สำคัญ
//   // const remainingAmount = Math.max(
//   //   0,
//   //   paymentAmount - discountAmount - paySomeAmount
//   // );
//   const remainingAmount = Math.max(0, paymentAmount - paySomeAmount);

//   const [valueCalendarInstall, setValueCalendarInstall] = useState<Date | null>(
//     null
//   );
//   const dueDate = dayjs(valueCalendarInstall).format("YYYY-MM-DD");

//   const [errorMessage, setErrorMessage] = useState<string>("");

//   const [qrCodeData, setQrCodeData] = useState<string>("");
//   // console.log(`qrCodeData`, qrCodeData);

//   const [loadingQR, setLoadingQR] = useState<boolean>(false);

//   const paymentId = uuidv4();
//   console.log(`paymentId`, paymentId);

//   const getQRPayment = async () => {
//     try {
//       setLoadingQR(true);

//       // ตรงนี้คำนวนยอดที่จะจ่ายก่อน
//       // ถ้า PACKAGETYPEID !== 1 → เงินผ่อน (installment) → ใช้ amountToPay
//       // ถ้า PACKAGETYPEID === 1 → เงินสด (cash) → ใช้ netPrice
//       //   const amountToPay = payFullAmount ? paymentAmount : paySomeAmount;
//       //   const isInstallment = product[0]?.Package[0]?.PACKAGETYPEID !== 1;
//       //   const qrAmount = isInstallment ? amountToPay : netPrice;

//       // คำนวณยอดที่จะจ่าย
//       // ถ้าเป็นเงินผ่อน (installment)
//       const isInstallment = product[0]?.Package[0]?.PACKAGETYPEID !== 1;

//       // ยอดสุทธิหลังหักส่วนลด
//       // const netPrice = totalPrice - discountAmount;
//       // console.log(`netPrice`, netPrice);

//       // เลือกยอดที่จะส่งไปขอ QR
//       let qrAmount: number;
//       if (!isInstallment) {
//         qrAmount = payFullAmount ? paymentAmount : paySomeAmount;
//       } else {
//         qrAmount = paySomeAmount;
//       }

//       const formData = new FormData();
//       formData.append("RefNo", refno);
//       formData.append("Amount", qrAmount.toString());

//       //   console.log("refno", refno);
//       console.log("สแกน", qrAmount.toString());

//       const response = await axios.post(GET_QR_PAYMENT_URL, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       // console.log(`response`, response);

//       if (response.status === 200 && response.data) {
//         setQrCodeData(response.data.data.QrCode || "");
//       }
//     } catch (error) {
//       console.error("Error fetching QR Payment:", error);
//     } finally {
//       setLoadingQR(false);
//     }
//   };

//   const handlePayQuickChange = (isPayQuick: boolean) => {
//     setQrCodeData("");
//     setPayQuick(isPayQuick);
//     setStatus(isPayQuick ? "PAID" : "SCHEDULE");
//     setPaymentChannel(isPayQuick ? "CASH" : "NONE");
//     setPaymentChoice(isPayQuick ? (payFullAmount ? "FULL" : "SOME") : "NONE"); // อัปเดต PAYMENTCHOICE
//   };

//   const handlePayFullAmountChange = (value: boolean) => {
//     setQrCodeData("");
//     setPayFullAmount(value);
//     setPaymentChoice(value ? "FULL" : "SOME");

//     if (!value) {
//       // ถ้าเป็นชำระบางส่วน => สถานะ SCHEDULE
//       setStatus("SCHEDULE");
//       // บังคับให้เป็นเงินสด
//       setPaymentChannel("CASH");
//       setPriceOption("CASH"); // <<--- เพิ่มบรรทัดนี้ด้วย
//     } else {
//       // ถ้าเป็นชำระเต็มจำนวน => สถานะ PAID
//       setStatus("PAID");
//       // บังคับให้เป็นเงินสด
//       setPaymentChannel("CASH");
//       setPriceOption("CASH"); // <<--- เพิ่มบรรทัดนี้ด้วย
//     }
//   };

//   const handleDateChangeInstall = (date: Date | null) => {
//     setValueCalendarInstall(date);
//   };

//   const handlePaymentChannelChange = (channel: string) => {
//     setPaymentChannel(channel);

//     // ถ้าผู้ใช้เลือก "QR CODE" → call API
//     if (channel === "QR CODE") {
//       // เช็คยอดที่จะจ่าย
//       let amountToPay = 0;
//       if (payFullAmount) {
//         // ชำระเต็ม → (paymentAmount - discount) สมมติเป็นงวดแรก
//         amountToPay = Math.max(0, paymentAmount - discountAmount);
//       } else {
//         // ชำระบางส่วน → paySomeAmount
//         amountToPay = paySomeAmount;
//       }

//       // call API ขอ QR
//       getQRPayment();
//     } else {
//       // ถ้าเปลี่ยนกลับเป็น 'CASH' ก็เคลียร์ qrCodeData
//       setQrCodeData("");
//     }
//   };

//   const handlePriceOptionChange = (option: string) => {
//     setPriceOption(option);

//     // ถ้าเลือก QR CODE จากชุด priceOption
//     if (option === "QR CODE") {
//       // ก็ต้องเรียก getQRPayment ด้วย
//       // หรือบังคับ paymentChannel เป็น "QR CODE" ไปเลย
//       setPaymentChannel("QR CODE");
//       getQRPayment();
//     } else {
//       // ถ้าเป็น "CASH"
//       setPaymentChannel("CASH");
//       setQrCodeData("");
//     }
//   };

//   // ฟังก์ชัน handleSomeAmountChange (แก้ให้ลบหมด = 0)
//   const handleSomeAmountChange = (value: string) => {
//     // ล้างค่า QR (ถ้ามี)
//     setQrCodeData("");

//     // 1) ถ้าผู้ใช้ลบตัวเลขจนเป็น "" หรือ "0" → ให้เป็น 0
//     if (!value) {
//       setPaySomeAmount(0);
//       setErrorMessage("");
//       return;
//     }
//     if (value === "0") {
//       setPaySomeAmount(0);
//       setErrorMessage("");
//       return;
//     }

//     // 2) จากนั้นตรวจสอบเลข
//     const number = Number(value);
//     if (isNaN(number) || number < 0) {
//       setErrorMessage("กรุณากรอกจำนวนเงินที่ถูกต้อง");
//     } else if (number > netPrice) {
//       setPaySomeAmount(number);
//       setErrorMessage(`ห้ามชำระเกินราคาสุทธิ ${netPrice.toLocaleString()} บาท`);
//     } else {
//       setPaySomeAmount(number);
//       setErrorMessage("");
//     }
//   };

//   const handleSomeAmountBlur = () => {
//     // กรณีต้องการให้ยิงเฉพาะตอนเป็น QR CODE
//     if (paymentChannel === "QR CODE") {
//       getQRPayment();
//     }
//   };

//   const allData = {
//     REFNO: refno,
//     EMPID: EmpId,
//     EMPNAME: EmpName,
//     SALECODE: SaleCode,
//     TEAMSALE: TeamSale,
//     LATITUDE: localStorage.getItem("latitude") || "",
//     LONGITUDE: localStorage.getItem("longitude") || "",
//     STATUS: status,
//     DUEDATE:
//       status === "SCHEDULE"
//         ? dueDate
//         : paymentChoice === "FULL" ||
//           paySomeAmount >= paymentAmount - discountAmount
//           ? ""
//           : dueDate,
//     PAYMENTPERIODDETAILID: paymentPeriodDetailId,
//     PAYMENTPERIODNUMBER: paymentPeriodNumber,
//     PAYMENTCHANNEL: paymentChannel,
//     PAYMENTCHOICE: paymentChoice,
//     AMOUNT:
//       status === "SCHEDULE" && paymentChoice === "NONE"
//         ? paymentAmount - discountAmount
//         : paymentChoice === "FULL"
//           ? paymentAmount - discountAmount
//           : paySomeAmount,
//     PERIODAMOUNT: periodAmount - discountAmount,
//     DISCOUNT: discountAmount,
//     PAYMENTID: paymentId,
//   };
//   console.log(`allData`, allData);

//   const onSubmit = async (data: any) => {
//     // ตรวจสอบการมี qrCodeData เมื่อเลือกช่องทาง QR CODE
//     // if (paymentChannel === "QR CODE" && qrCodeData) {
//     //   Swal.fire("แจ้งเตือน", "กรุณาทำการสแกน qr code ก่อน", "warning");
//     //   return;
//     // }

//     // if (payQuick) {
//     //   Swal.fire({
//     //     title: "ยืนยันการออกใบเสร็จ",
//     //     icon: "warning",
//     //     showCancelButton: true,
//     //     confirmButtonText: "ตกลง",
//     //     cancelButtonText: "ยกเลิก",
//     //   }).then((result) => {
//     //     if (result.isConfirmed) {
//     //       navigate("/firstBill/receipt", { state: item });
//     //     }
//     //   });
//     //   return;
//     // }

//     try {
//       const response = await axios.post(POST_PAYMENT_TRANSACTION_URL, allData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.status === 200) {
//         // ปักธงว่า REFNO นี้บันทึกการชำระ/นัดชำระแล้ว
//         localStorage.setItem(`paymentDone:${refno.toUpperCase().trim()}`, '1');

//         Swal.fire({
//           icon: "success",
//           title: "สำเร็จ!",
//           text: "บันทึกธุรกรรมการชำระเงินสำเร็จ",
//           timer: 2000,
//           showConfirmButton: false,
//         });
//         navigate("/");

//         // ถ้ามาจาก sale/contract หรือ sale/update/updatecontract
//         // และสถานะเป็น SCHEDULE (มี DUEDATE)
//         const saleRoutes = ["/sale/contract", "/sale/update/updatecontract"];
//         // if (saleRoutes.includes(from) && status === "SCHEDULE" && item?.STATUS === "DRAFT") {
//         if (item?.STATUS === "DRAFT" && payQuick) {
//           //   navigate("/sale/photo", { state: { data: item, fromStep: "true" } });
//           // navigate("/firstBill/receiptmock", { state: item });
//           navigate("/firstBill/receipt", { state: item });
//         }
//         if (item?.STATUS === "DRAFT" && !payQuick) {
//           navigate("/sale/photo", { state: { data: item, fromStep: "true" } });
//         }
//       } else {
//         Swal.fire(
//           "เกิดข้อผิดพลาด",
//           response.data.message || "ไม่สามารถบันทึกข้อมูลได้",
//           "error"
//         );
//       }
//     } catch (error) {
//       console.error("Error saving data:", error);
//       Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้", "error");
//     }
//   };

//   // const onSubmit = async (data: any) => {
//   //     // ตรวจสอบกรณีเลือก QR CODE แต่ยังไม่ได้สแกน
//   //     if (paymentChannel === "QR CODE" && qrCodeData) {
//   //         Swal.fire("แจ้งเตือน", "กรุณาทำการสแกน qr code ก่อน", "warning");
//   //         return;
//   //     }

//   //     try {
//   //         const response = await axios.post(POST_PAYMENT_TRANSACTION_URL, allData, {
//   //             headers: { "Content-Type": "application/json" },
//   //         });

//   //         if (response.status === 200) {
//   //             Swal.fire("สำเร็จ", "บันทึกธุรกรรมการชำระเงินสำเร็จ", "success");

//   //             // รอสักครู่ให้ SweetAlert แสดงก่อน แล้วค่อย navigate
//   //             setTimeout(() => {
//   //                 // ถ้ามาจาก sale/contract, updateSalesContract หรือ sale/step
//   //                 const saleRoutes = [
//   //                     '/sale/contract',
//   //                     '/sale/update/UpdateSalesContract',
//   //                     '/sale/step',
//   //                 ];
//   //                 if (saleRoutes.includes(from)) {
//   //                     // ไปหน้า photo ต่อ
//   //                     navigate('/sale/photo', {
//   //                         state: { item, from }
//   //                     });
//   //                 } else {
//   //                     // ปกติไปหน้า overview ของ firstBill
//   //                     navigate('/firstBill/overview', { state: item });
//   //                 }
//   //             }, 500);

//   //         } else {
//   //             Swal.fire("เกิดข้อผิดพลาด", response.data.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
//   //         }

//   //     } catch (error) {
//   //         console.error("Error saving data:", error);
//   //         Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้", "error");
//   //     }
//   // };

//   const handleBack = () => {
//     const saleRoutes = [
//       "/sale/contract",
//       "/sale/update/UpdateSalesContract",
//       "/sale/step",
//     ];

//     if (saleRoutes.includes(from)) {
//       navigate("/sale/step", { state: item });
//     }

//     const saleRoutesEditFinishInDay = ["/sale/editFinishInDay"];

//     if (saleRoutesEditFinishInDay.includes(from)) {
//       navigate("/sale/editFinishInDay", { state: item });
//     } else {
//       navigate("/firstBill/overview", { state: item });
//     }
//   };

//   // const FINISH_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=FINISH&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;
//   const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//   const GET_PAYMENT_URL = `${API_URL_MONGO}/Payment/GetPaymentPeriod`;

//   const [finish, setFinish] = useState<any[]>([]); // กำหนดให้ state เป็น array เพื่อรองรับ map()
//   console.log(`finish`, finish);

//   const [isLoadingFinish, setIsLoadingFinish] = useState<boolean>(false);

//   const [search, setSearch] = useState<string>(""); // State สำหรับค้นหา

//   // Pagination states
//   const [entries, setEntries] = useState<number>(10); // Default entries per page
//   const [currentPageFinish, setCurrentPageFinish] = useState<number>(1);

//   useEffect(() => {
//     getDataFinish();
//   }, []);

//   const getDataFinish = async () => {
//     setIsLoadingFinish(true);
//     try {
//       const response = await axios.get(GET_PAYMENT_URL, {
//         params: {
//           EMPID: EmpId,
//           TEAMSALE: TeamSale,
//         },
//       });
//       const data = Array.isArray(response.data.data) ? response.data.data : [];
//       setFinish(data);
//     } catch (error) {
//       console.error("Error fetching GET_PAYMENT_URL:", error);
//     } finally {
//       setIsLoadingFinish(false);
//     }
//   };

//   return (
//     <>
//       <Content>
//         <div className="d-flex justify-content-between align-items-center my-5">
//           <div
//             id="kt_page_title"
//             data-kt-swapper="true"
//             data-kt-swapper-mode="prepend"
//             data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//             className="page-title d-flex flex-wrap me-3 flex-column justify-content-center"
//           >
//             <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//               <li
//                 className={`breadcrumb-item text-gray-900 font ${styles.titlePage}`}
//               >
//                 การรับชำระเงินงวดแรก
//               </li>
//             </ul>
//           </div>
//         </div>
//         <span className={`${styles.fontSize}`}>เลขที่ขาย: </span>
//         <span className={`${styles.titlePage}`}>{refno}</span>

//         <div className="row">
//           {/* Card Body */}
//           <div className="col-lg-6">
//             <div className="accordion mb-10" id="kt_accordion_1">
//               <div className="accordion-item mb-10">
//                 <h2 className="accordion-header" id="kt_accordion_1_header_1">
//                   <h3
//                     className="accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7"
//                     data-bs-toggle="collapse"
//                     data-bs-target="#kt_accordion_1_body_1"
//                     aria-expanded="true"
//                     aria-controls="kt_accordion_1_body_1"
//                     style={{
//                       color: "white",
//                       cursor: "pointer",
//                       backgroundColor: "#3777bc",
//                     }}
//                   >
//                     การรับชำระเงินงวดแรก
//                   </h3>
//                 </h2>
//                 <div
//                   id="kt_accordion_1_body_1"
//                   className="accordion-collapse collapse show"
//                   aria-labelledby="kt_accordion_1_header_1"
//                   data-bs-parent="#kt_accordion_1"
//                 >
//                   <div className="accordion-body">
//                     <form noValidate className="form">
//                       <div className="card-body px-lg-9 px-1">
//                         <div className="">
//                           <div className="d-flex mb-6">
//                             <div className="form-check form-check-inline me-3">
//                               <input
//                                 className="form-check-input"
//                                 type="radio"
//                                 name="payQuick"
//                                 checked={payQuick}
//                                 onChange={() => handlePayQuickChange(true)}
//                               />
//                               <label className={`${styles.label} me-2`}>
//                                 ชำระเงินทันที
//                               </label>
//                             </div>
//                             <div className="form-check form-check-inline me-3">
//                               <input
//                                 className="form-check-input"
//                                 type="radio"
//                                 name="payQuick"
//                                 checked={!payQuick}
//                                 onChange={() => handlePayQuickChange(false)}
//                               />
//                               <label className={`${styles.label} me-2`}>
//                                 นัดชำระ
//                               </label>
//                             </div>
//                           </div>

//                           {/* Start ชำระเงินทันที */}
//                           {payQuick && (
//                             <>
//                               <div className="d-flex mb-6 mt-10">
//                                 <div className="form-check form-check-inline me-3">
//                                   <input
//                                     className="form-check-input"
//                                     type="radio"
//                                     name="payFullAmount"
//                                     checked={payFullAmount}
//                                     onChange={() =>
//                                       handlePayFullAmountChange(true)
//                                     }
//                                   />
//                                   <label className={`${styles.label} me-2`}>
//                                     ชำระเต็มจำนวน
//                                   </label>
//                                 </div>
//                                 <div className="form-check form-check-inline me-3">
//                                   <input
//                                     className="form-check-input"
//                                     type="radio"
//                                     name="payFullAmount"
//                                     checked={!payFullAmount}
//                                     onChange={() =>
//                                       handlePayFullAmountChange(false)
//                                     }
//                                   />
//                                   <label className={`${styles.label} me-2`}>
//                                     {product[0]?.Package[0]?.PACKAGETYPEID ===
//                                       1 ? (
//                                       <span>ชำระบางส่วน</span>
//                                     ) : (
//                                       <span>ชำระบางส่วน / เกินจำนวน</span>
//                                     )}
//                                   </label>
//                                 </div>
//                               </div>

//                               {/* Start ชำระเต็ม */}
//                               {payFullAmount && (
//                                 <>
//                                   {product[0].Package.PACKAGETYPEID === 1 ? (
//                                     <div className="mb-6">
//                                       <label className={`${styles.label} me-2`}>
//                                         จำนวนเงินที่ต้องชำระ
//                                       </label>
//                                       <input
//                                         type="text"
//                                         className="form-control"
//                                         readOnly
//                                         style={{
//                                           backgroundColor: "#d7dbde",
//                                         }}
//                                         // value={paymentAmount - discountAmount}
//                                         value={paymentAmount}
//                                       // value={transaction[0]?.AMOUNT}
//                                       />
//                                     </div>
//                                   ) : (
//                                     <div className="mb-6">
//                                       <label className={`${styles.label} me-2`}>
//                                         จำนวนเงินที่ต้องชำระ
//                                       </label>
//                                       <input
//                                         type="text"
//                                         className={`form-control ${styles.label}`}
//                                         readOnly
//                                         style={{
//                                           backgroundColor: "#d7dbde",
//                                         }}
//                                         value={paymentAmount}
//                                       // value={transaction[0]?.AMOUNT}
//                                       />
//                                     </div>
//                                   )}
//                                   <div className="d-flex mb-6 mt-10">
//                                     <div className="form-check form-check-inline me-3">
//                                       <input
//                                         className="form-check-input"
//                                         type="radio"
//                                         name="paymentChannel"
//                                         checked={paymentChannel === "CASH"}
//                                         onChange={() =>
//                                           handlePaymentChannelChange("CASH")
//                                         }
//                                       />
//                                       <label className={`${styles.label} me-2`}>
//                                         เงินสด
//                                       </label>
//                                     </div>
//                                     <div className="form-check form-check-inline me-3">
//                                       <input
//                                         className="form-check-input"
//                                         type="radio"
//                                         name="paymentChannel"
//                                         checked={paymentChannel === "QR CODE"}
//                                         onChange={() =>
//                                           handlePaymentChannelChange("QR CODE")
//                                         }
//                                       />
//                                       <label className={`${styles.label} me-2`}>
//                                         QR CODE
//                                       </label>
//                                     </div>
//                                   </div>
//                                 </>
//                               )}
//                               {/* End ชำระเต็ม */}

//                               {/* Start ชำระบางส่วน / เกินจำนวน */}
//                               {!payFullAmount && (
//                                 <>
//                                   {/* {product[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
//                                                                         <div className="mb-6">
//                                                                             <label className={`${styles.label} me-2`}>ราคาสุทธิ</label>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 className="form-control"
//                                                                                 readOnly
//                                                                                 style={{
//                                                                                     backgroundColor: '#d7dbde',
//                                                                                 }}
//                                                                                 value={netPrice}
//                                                                             />
//                                                                         </div>
//                                                                     )} */}
//                                   <div className="mb-6">
//                                     {product[0]?.Package[0]?.PACKAGETYPEID !==
//                                       1 ? (
//                                       <>
//                                         <label
//                                           className={`${styles.label} me-2`}
//                                         >
//                                           จำนวนเงินที่ต้องชำระงวดที่ 1
//                                         </label>
//                                         <input
//                                           type="text"
//                                           className={`form-control ${styles.label}`}
//                                           readOnly
//                                           style={{
//                                             backgroundColor: "#d7dbde",
//                                           }}
//                                           // value={paymentAmount - discountAmount}
//                                           value={paymentAmount}
//                                         // value={transaction[0]?.AMOUNT}
//                                         />
//                                       </>
//                                     ) : (
//                                       <>
//                                         <label
//                                           className={`${styles.label} me-2`}
//                                         >
//                                           ราคาสุทธิ
//                                         </label>
//                                         <input
//                                           type="text"
//                                           className={`form-control ${styles.label}`}
//                                           readOnly
//                                           style={{
//                                             backgroundColor: "#d7dbde",
//                                           }}
//                                           value={netPrice}
//                                         />
//                                       </>
//                                     )}
//                                   </div>

//                                   <div className="mb-6">
//                                     {product[0]?.Package[0]?.PACKAGETYPEID !==
//                                       1 ? (
//                                       <>
//                                         <label
//                                           className={`${styles.label} me-2`}
//                                         >
//                                           จำนวนเงินที่แบ่งชำระ
//                                         </label>
//                                         <input
//                                           inputMode="numeric"
//                                           pattern="[0-9]*"
//                                           type="text"
//                                           className={`form-control ${styles.label}`}
//                                           onChange={(e) =>
//                                             handleSomeAmountChange(
//                                               e.target.value
//                                             )
//                                           }
//                                           value={paySomeAmount}
//                                         />
//                                       </>
//                                     ) : (
//                                       <>
//                                         <label
//                                           className={`${styles.label} me-2`}
//                                         >
//                                           จำนวนเงินที่ชำระ
//                                         </label>
//                                         <input
//                                           type="text"
//                                           className={`form-control ${styles.label
//                                             } ${errorMessage ? "is-invalid" : ""
//                                             }`}
//                                           onChange={(e) =>
//                                             handleSomeAmountChange(
//                                               e.target.value
//                                             )
//                                           }
//                                           onBlur={handleSomeAmountBlur}
//                                           value={
//                                             paySomeAmount === 0
//                                               ? "0"
//                                               : paySomeAmount
//                                           } // ใช้ "0" เพื่อให้พิมพ์ได้
//                                           min="0" // ป้องกันค่าติดลบ
//                                           inputMode="numeric"
//                                           pattern="[0-9]*"
//                                         />
//                                         {errorMessage && (
//                                           <div className="text-danger mt-1">
//                                             {errorMessage}
//                                           </div>
//                                         )}
//                                       </>
//                                     )}
//                                   </div>
//                                   <div className="mb-6">
//                                     <label className={`${styles.label} me-2`}>
//                                       จำนวนเงินที่เหลืองวดที่ 1
//                                     </label>
//                                     <input
//                                       type="text"
//                                       className={`form-control ${styles.label}`}
//                                       readOnly
//                                       style={{
//                                         backgroundColor: "#d7dbde",
//                                       }}
//                                       value={
//                                         isNaN(remainingAmount)
//                                           ? 0
//                                           : remainingAmount
//                                       }
//                                     />
//                                   </div>
//                                   {/* ถ้าชำระมากกว่าหรือเท่ากับ ไม่ต้องโชว์ */}
//                                   {/* {paySomeAmount < transaction[0]?.AMOUNT && ( */}
//                                   {/* {paySomeAmount < paymentAmount - discountAmount && (
//                                                                         <div className="col-lg-12 mb-6">
//                                                                             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                                                                                 <label className={`${styles.label} me-2`}>วันที่สะดวกชำระส่วนที่เหลือ</label>
//                                                                                 <DatePicker
//                                                                                     selected={valueCalendarInstall}
//                                                                                     onChange={handleDateChangeInstall}
//                                                                                     className="form-control mb-3 mb-lg-0"
//                                                                                     showYearDropdown
//                                                                                     showMonthDropdown
//                                                                                     dropdownMode="select"
//                                                                                     isClearable
//                                                                                     dateFormat="yyyy/MM/dd"
//                                                                                     withPortal
//                                                                                 />
//                                                                             </div>
//                                                                         </div>
//                                                                     )} */}
//                                   {paySomeAmount <
//                                     paymentAmount - discountAmount && (
//                                       <div className="col-lg-12 mb-6">
//                                         <label className={`${styles.label} mb-2`}>
//                                           วันที่สะดวกชำระส่วนที่เหลือ
//                                         </label>
//                                         <input
//                                           type="date"
//                                           className={`form-control ${styles.label}`}
//                                           value={
//                                             valueCalendarInstall
//                                               ? dayjs(
//                                                 valueCalendarInstall
//                                               ).format("YYYY-MM-DD")
//                                               : ""
//                                           }
//                                           onChange={(e) => {
//                                             const v = e.target.value;
//                                             setValueCalendarInstall(
//                                               v ? new Date(v) : null
//                                             );
//                                           }}
//                                         />
//                                       </div>
//                                     )}

//                                   {/* )} */}
//                                   <div className="d-flex mb-6 mt-10">
//                                     <div className="form-check form-check-inline me-3">
//                                       <input
//                                         className="form-check-input"
//                                         type="radio"
//                                         name="priceOption"
//                                         checked={priceOption === "CASH"}
//                                         onChange={() =>
//                                           handlePriceOptionChange("CASH")
//                                         }
//                                       />
//                                       <label className={`${styles.label} me-2`}>
//                                         เงินสด
//                                       </label>
//                                     </div>
//                                     <div className="form-check form-check-inline me-3">
//                                       <input
//                                         className="form-check-input"
//                                         type="radio"
//                                         name="priceOption"
//                                         checked={priceOption === "QR CODE"}
//                                         onChange={() =>
//                                           handlePriceOptionChange("QR CODE")
//                                         }
//                                       />
//                                       <label className={`${styles.label} me-2`}>
//                                         QR CODE
//                                       </label>
//                                     </div>
//                                   </div>
//                                 </>
//                               )}
//                               {/* End ชำระบางส่วน / เกินจำนวน */}
//                             </>
//                           )}
//                           {/* End ชำระเงินทันที */}

//                           {/* Start นัดชำระ */}
//                           {/* {!payQuick && (
//                                                         <div className="col-lg-12 mb-6">
//                                                             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                                                                 <label className={`${styles.label} me-2`}>วันที่สะดวกชำระ</label>
//                                                                 <DatePicker
//                                                                     selected={valueCalendarInstall}
//                                                                     onChange={handleDateChangeInstall}
//                                                                     className="form-control mb-3 mb-lg-0"
//                                                                     showYearDropdown
//                                                                     showMonthDropdown
//                                                                     dropdownMode="select"
//                                                                     isClearable
//                                                                     dateFormat="yyyy/MM/dd"
//                                                                     withPortal
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                     )} */}
//                           {!payQuick && (
//                             <div className="col-lg-12 mb-6">
//                               {/* ไม่ต้องใช้ flex-column แล้ว แค่ label กับ input */}
//                               <label className={`${styles.label} mb-2`}>
//                                 วันที่สะดวกชำระ
//                               </label>
//                               <input
//                                 type="date"
//                                 className={`form-control ${styles.label}`}
//                                 // แปลง Date → YYYY-MM-DD เพื่อให้ value ของ input ตรงกัน
//                                 value={
//                                   valueCalendarInstall
//                                     ? dayjs(valueCalendarInstall).format(
//                                       "YYYY-MM-DD"
//                                     )
//                                     : ""
//                                 }
//                                 onChange={(e) => {
//                                   const dateStr = e.target.value;
//                                   // ถ้าเลือกค่าว่าง ให้เป็น null
//                                   setValueCalendarInstall(
//                                     dateStr ? new Date(dateStr) : null
//                                   );
//                                 }}
//                               />
//                             </div>
//                           )}
//                           {/* End นัดชำระ*/}

//                           <div className="mb-6 mt-10 d-flex justify-content-center">
//                             {loadingQR ? (
//                               <ThreeDot />
//                             ) : qrCodeData ? (
//                               <img
//                                 src={qrCodeData}
//                                 alt="QR Code"
//                                 style={{ width: 200, height: 200 }}
//                               />
//                             ) : null}
//                           </div>
//                         </div>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* End Card Body */}

//           {/* Card Body */}
//           <div className="col-lg-6 mb-20">
//             <div className="card">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between mb-5">
//                   <label className={`col-lg-4 fw-bold ${styles.label}`}>
//                     รายละเอียดสัญญา
//                   </label>
//                   <button
//                     type="button"
//                     className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
//                   >
//                     <KTIcon iconName="category" className="fs-2" />
//                   </button>
//                 </div>

//                 <div className="">
//                   {contNo && (
//                     <div className="row mb-7">
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         เลขที่สัญญา
//                       </label>
//                       <label className={`col-lg-4 ${styles.label}`}>
//                         <span className={`${styles.label}`}>{contNo}</span>
//                       </label>
//                     </div>
//                   )}

//                   <div className="row mb-7">
//                     <label className={`col-lg-4 text-muted ${styles.label}`}>
//                       ชื่อลูกค้า
//                     </label>
//                     <div className="col-7 col-md-8">
//                       <label className={`col-lg-4 ${styles.label}`}>
//                         {customerDetail[0]?.PREFIX[0]?.PREFIXNAME}{" "}
//                         {customerDetail[0]?.CUSTOMERNAME}{" "}
//                         {customerDetail[0]?.CUSTOMERLASTNAME}
//                       </label>
//                     </div>
//                   </div>

//                   {firstAddress?.ADDRESSCARD.ADDRESSPROVINCENAME && (
//                     <div className="row mb-7">
//                       {/* หัวข้ออยู่ col-lg-4 */}
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         ที่อยู่ตามบัตร
//                       </label>
//                       {/* เนื้อหาอยู่ col-lg-7 */}
//                       <div className="col-lg-7 d-flex align-items-center">
//                         <span className={`${styles.label} me-2`}>
//                           {firstAddress.ADDRESSCARD.ADDRESSNUMBER &&
//                             firstAddress.ADDRESSCARD.ADDRESSNUMBER}{" "}
//                           {firstAddress.ADDRESSCARD.ADDRESSMOO &&
//                             `หมู่ ${firstAddress.ADDRESSCARD.ADDRESSMOO}`}{" "}
//                           {firstAddress.ADDRESSCARD.ADDRESSSOI &&
//                             `ซอย ${firstAddress.ADDRESSCARD.ADDRESSSOI}`}{" "}
//                           {firstAddress.ADDRESSCARD.ADDRESSROAD &&
//                             `ถนน ${firstAddress.ADDRESSCARD.ADDRESSROAD}`}{" "}
//                           {firstAddress.ADDRESSCARD.ADDRESSDISTRICTNAME &&
//                             `เขต ${firstAddress.ADDRESSCARD.ADDRESSDISTRICTNAME}`}{" "}
//                           {firstAddress.ADDRESSCARD.ADDRESSSUBDISTRICTNAME &&
//                             `แขวง ${firstAddress.ADDRESSCARD.ADDRESSSUBDISTRICTNAME}`}{" "}
//                           {firstAddress.ADDRESSCARD.ADDRESSPROVINCENAME &&
//                             `จังหวัด ${firstAddress.ADDRESSCARD.ADDRESSPROVINCENAME}`}{" "}
//                           {firstAddress.ADDRESSCARD.ADDRESSZIPCODE &&
//                             firstAddress.ADDRESSCARD.ADDRESSZIPCODE}
//                         </span>
//                         <FontAwesomeIcon icon={faLocationDot} size="2x" />
//                       </div>
//                     </div>
//                   )}

//                   {firstAddress?.ADDRESSINSTALLATION.ADDRESSPROVINCENAME && (
//                     <div className="row mb-7">
//                       {/* หัวข้ออยู่ col-lg-4 */}
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         ที่อยู่ติดตั้ง
//                       </label>
//                       {/* เนื้อหาอยู่ col-lg-7 */}
//                       <div className="col-lg-7 d-flex align-items-center">
//                         <span className={`${styles.label} me-2`}>
//                           {firstAddress.ADDRESSINSTALLATION.ADDRESSNUMBER}{" "}
//                           {firstAddress.ADDRESSINSTALLATION.ADDRESSMOO &&
//                             `หมู่ ${firstAddress.ADDRESSINSTALLATION.ADDRESSMOO}`}{" "}
//                           {firstAddress.ADDRESSINSTALLATION.ADDRESSSOI &&
//                             `ซอย ${firstAddress.ADDRESSINSTALLATION.ADDRESSSOI}`}{" "}
//                           {firstAddress.ADDRESSINSTALLATION.ADDRESSROAD &&
//                             `ถนน ${firstAddress.ADDRESSINSTALLATION.ADDRESSROAD}`}{" "}
//                           {firstAddress.ADDRESSINSTALLATION
//                             .ADDRESSDISTRICTNAME &&
//                             `เขต ${firstAddress.ADDRESSINSTALLATION.ADDRESSDISTRICTNAME}`}{" "}
//                           {firstAddress.ADDRESSINSTALLATION
//                             .ADDRESSSUBDISTRICTNAME &&
//                             `แขวง ${firstAddress.ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME}`}{" "}
//                           {firstAddress.ADDRESSINSTALLATION
//                             .ADDRESSPROVINCENAME &&
//                             `จังหวัด ${firstAddress.ADDRESSINSTALLATION.ADDRESSPROVINCENAME}`}{" "}
//                           {firstAddress.ADDRESSINSTALLATION.ADDRESSZIPCODE}
//                         </span>
//                         <FontAwesomeIcon icon={faLocationDot} size="2x" />
//                       </div>
//                     </div>
//                   )}

//                   {firstAddress?.ADDRESSPAYMENT.ADDRESSPROVINCENAME && (
//                     <div className="row mb-7">
//                       {/* หัวข้ออยู่ col-lg-4 */}
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         ที่อยู่เก็บเงิน
//                       </label>
//                       {/* เนื้อหาอยู่ col-lg-7 */}
//                       <div className="col-lg-7 d-flex align-items-center">
//                         <span className={`${styles.label} me-2`}>
//                           {" "}
//                           {firstAddress.ADDRESSPAYMENT.ADDRESSNUMBER &&
//                             firstAddress.ADDRESSPAYMENT.ADDRESSNUMBER}{" "}
//                           {firstAddress.ADDRESSPAYMENT.ADDRESSMOO &&
//                             `หมู่ ${firstAddress.ADDRESSPAYMENT.ADDRESSMOO}`}{" "}
//                           {firstAddress.ADDRESSPAYMENT.ADDRESSSOI &&
//                             `ซอย ${firstAddress.ADDRESSPAYMENT.ADDRESSSOI}`}{" "}
//                           {firstAddress.ADDRESSPAYMENT.ADDRESSROAD &&
//                             `ถนน ${firstAddress.ADDRESSPAYMENT.ADDRESSROAD}`}{" "}
//                           {firstAddress.ADDRESSPAYMENT.ADDRESSDISTRICTNAME &&
//                             `เขต ${firstAddress.ADDRESSPAYMENT.ADDRESSDISTRICTNAME}`}{" "}
//                           {firstAddress.ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME &&
//                             `แขวง ${firstAddress.ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME}`}{" "}
//                           {firstAddress.ADDRESSPAYMENT.ADDRESSPROVINCENAME &&
//                             `จังหวัด ${firstAddress.ADDRESSPAYMENT.ADDRESSPROVINCENAME}`}{" "}
//                           {firstAddress.ADDRESSPAYMENT.ADDRESSZIPCODE &&
//                             firstAddress.ADDRESSPAYMENT.ADDRESSZIPCODE}{" "}
//                         </span>
//                         <FontAwesomeIcon icon={faLocationDot} size="2x" />
//                       </div>
//                     </div>
//                   )}

//                   {firstAddress?.ADDRESSTAX.ADDRESSPROVINCENAME && (
//                     <div className="row mb-7">
//                       {/* หัวข้ออยู่ col-lg-4 */}
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         ที่อยู่เสึยภาษี
//                       </label>
//                       {/* เนื้อหาอยู่ col-lg-7 */}
//                       <div className="col-lg-7 d-flex align-items-center">
//                         <span className={`${styles.label} me-2`}>
//                           {" "}
//                           {firstAddress.ADDRESSTAX.ADDRESSNUMBER &&
//                             firstAddress.ADDRESSTAX.ADDRESSNUMBER}{" "}
//                           {firstAddress.ADDRESSTAX.ADDRESSMOO &&
//                             `หมู่ ${firstAddress.ADDRESSTAX.ADDRESSMOO}`}{" "}
//                           {firstAddress.ADDRESSTAX.ADDRESSSOI &&
//                             `ซอย ${firstAddress.ADDRESSTAX.ADDRESSSOI}`}{" "}
//                           {firstAddress.ADDRESSTAX.ADDRESSROAD &&
//                             `ถนน ${firstAddress.ADDRESSTAX.ADDRESSROAD}`}{" "}
//                           {firstAddress.ADDRESSTAX.ADDRESSDISTRICTNAME &&
//                             `เขต ${firstAddress.ADDRESSTAX.ADDRESSDISTRICTNAME}`}{" "}
//                           {firstAddress.ADDRESSTAX.ADDRESSSUBDISTRICTNAME &&
//                             `แขวง ${firstAddress.ADDRESSTAX.ADDRESSSUBDISTRICTNAME}`}{" "}
//                           {firstAddress.ADDRESSTAX.ADDRESSPROVINCENAME &&
//                             `จังหวัด ${firstAddress.ADDRESSTAX.ADDRESSPROVINCENAME}`}{" "}
//                           {firstAddress.ADDRESSTAX.ADDRESSZIPCODE &&
//                             firstAddress.ADDRESSTAX.ADDRESSZIPCODE}{" "}
//                         </span>
//                         <FontAwesomeIcon icon={faLocationDot} size="2x" />
//                       </div>
//                     </div>
//                   )}

//                   <div className="row mb-10">
//                     <label className={`col-lg-4 text-muted ${styles.label}`}>
//                       เบอร์โทรติดต่อ
//                     </label>
//                     <div className="col-lg-7">
//                       <span className={`${styles.label}`}>
//                         {customerDetail[0]?.CUSTOMERMOBILE
//                           ? customerDetail[0]?.CUSTOMERMOBILE
//                           : firstAddress?.ADDRESSINSTALLATION.ADDRESSPHONE}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="row mb-7">
//                     <label className={`col-lg-4 text-muted ${styles.label}`}>
//                       สินค้า
//                     </label>
//                     <div className="col-lg-7 col-md-8">
//                       <span className={`${styles.label}`}>
//                         {product[0]?.ItemDescription}
//                       </span>
//                     </div>
//                   </div>

//                   {product[0]?.Package[0]?.PACKAGETITLE && (
//                     <div className="row mb-7">
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         แพ็คเกจ
//                       </label>
//                       <div className="col-7 col-md-8">
//                         <span className={`${styles.label}`}>
//                           {product[0]?.Package[0]?.PACKAGETITLE}
//                         </span>
//                       </div>
//                     </div>
//                   )}

//                   {item?.DISCOUNT[0]?.GIFT && (
//                     <div className="row mb-7">
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         ของแถม
//                       </label>
//                       <div className="col-7 col-md-8">
//                         <span className={`${styles.label}`}>
//                           {item?.DISCOUNT[0]?.GIFT?.GIFTNAME
//                             ? item?.DISCOUNT[0]?.GIFT?.GIFTNAME
//                             : "ไม่มี"}
//                         </span>
//                       </div>
//                     </div>
//                   )}

//                   {product[0]?.Package[0]?.TOTALPRICE && (
//                     <div className="row mb-7">
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         ราคาสินค้า
//                       </label>
//                       <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
//                         <span className={`${styles.label}`}>
//                           {product[0]?.Package[0]?.TOTALPRICE}
//                         </span>
//                         <span className="badge badge-light-success">บาท</span>
//                       </div>
//                     </div>
//                   )}

//                   {item?.DISCOUNT[0]?.TRADEIN?.HASTRADEIN != 0 && (
//                     <div className="row mb-7">
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         เครื่องเทิร์น
//                       </label>
//                       <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
//                         <span className={`${styles.label}`}>
//                           {item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME
//                             ? item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME
//                             : "ไม่มี"}
//                         </span>
//                       </div>
//                     </div>
//                   )}

//                   {item?.DISCOUNT[0]?.DISCOUNTAMOUNT != 0 && (
//                     <div className="row mb-7">
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         ส่วนลด
//                       </label>
//                       <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
//                         <span className={`${styles.label}`}>
//                           {discountAmount ? discountAmount : "ไม่มี"}
//                         </span>
//                         <span className="badge badge-light-success">บาท</span>
//                       </div>
//                     </div>
//                   )}

//                   <div className="row mb-7">
//                     <label className={`col-lg-4 text-muted ${styles.label}`}>
//                       ราคาสุทธิ
//                     </label>
//                     <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
//                       <span className={`${styles.label}`}>{netPrice}</span>
//                       <span className="badge badge-light-success">บาท</span>
//                     </div>
//                   </div>

//                   {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
//                   {product[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
//                     <>
//                       <div className="row mb-7">
//                         <label
//                           className={`col-lg-4 text-muted ${styles.label}`}
//                         >
//                           งวดที่ 1 ที่ต้องชำระ
//                         </label>
//                         <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
//                           <span className={`${styles.label}`}>
//                             {product[0]?.Package[0]?.PERIODDETAILS[0]
//                               ?.PAYMENTAMOUNT - discountAmount}
//                           </span>
//                           <span className="badge badge-light-success">บาท</span>
//                         </div>
//                       </div>

//                       {product[0]?.Package[0]?.PERIODDETAILS.length > 1 && (
//                         <div className="row mb-7">
//                           <label
//                             className={`col-lg-4 text-muted ${styles.label}`}
//                           >
//                             งวดที่ 2 ถึง{" "}
//                             {product[0]?.Package[0]?.PERIODDETAILS.length}{" "}
//                             ต้องชำระงวดละ
//                           </label>
//                           <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
//                             <span className={`${styles.label}`}>
//                               {
//                                 product[0]?.Package[0]?.PERIODDETAILS[1]
//                                   ?.PAYMENTAMOUNT
//                               }
//                             </span>
//                             <span className="badge badge-light-success">
//                               บาท
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* End Card Body */}
//         </div>

//         <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
//           <button className={`${styles.btnSecondary}`} onClick={handleBack}>
//             ย้อนกลับ
//           </button>
//           <button className={`${styles.btnPrimary}`} onClick={onSubmit}>
//             ถัดไป
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
//           <button className={`${styles.btnSecondary}`} onClick={handleBack}>
//             ย้อนกลับ
//           </button>
//           <button className={`${styles.btnPrimary}`} onClick={onSubmit}>
//             ถัดไป
//           </button>
//         </div>
//       </Content>
//     </>
//   );
// };

// export default CreateFirstBill;





// import styles from "@/styles/style.module.css";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { useState, useEffect, useMemo, useRef } from "react";
// import { Content } from "../../../_metronic/layout/components/content";
// import { useAuth } from "../../modules/auth/core/Auth";
// import { KTIcon } from "../../../_metronic/helpers";
// import { v4 as uuidv4 } from "uuid";

// import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import {
//   useUUIDStore,
//   useSaveProductStore,
// } from "../../modules/stores/stepsStore";
// import { useSaveDiscountStore } from "../../modules/stores/stepsStore";

// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";

// import dayjs, { Dayjs } from "dayjs";
// import DatePicker from "react-datepicker";
// import DateTimePicker from "react-datetime-picker";
// import "react-datepicker/dist/react-datepicker.css";
// import "react-datetime-picker/dist/DateTimePicker.css";
// import "react-calendar/dist/Calendar.css";
// import "react-clock/dist/Clock.css";

// import { ThreeDot } from "react-loading-indicators";
// import { log } from "node:console";

// interface ContractState {
//   contNo: string;
// }

// interface ItemProps {
//   REFNO: string;
//   CONTNO: string;
//   EMPID: string;
//   TEAMSALE: string;
//   SALECODE: string;
//   SUPEMPID: string;
//   SECEMPID: string;
//   STATUS: string;
//   PRODUCT: [any];
//   CUSTOMERSTATUS: [any];
//   DISCOUNT: [any];
//   CUSTOMERDETAIL: [any];
//   ADDRESS: AddressItem[];
//   PDPA: [any];
//   CONTRACT: [any];
//   IMAGE: [any];
//   CHECKERCOMMENT: [any];
//   TRANSACTION: [any];
//   SCHEDULE: [any];
//   PERIODDETAILS: [any];
// }

// interface AddressCard {
//   ADDRESSDISTRICT: string;
//   ADDRESSDISTRICTNAME: string;
//   ADDRESSMOO: string;
//   ADDRESSNUMBER: string;
//   ADDRESSPHONE: string;
//   ADDRESSPROVINCE: string;
//   ADDRESSPROVINCENAME: string;
//   ADDRESSROAD: string;
//   ADDRESSSOI: string;
//   ADDRESSSUBDISTRICT: string;
//   ADDRESSSUBDISTRICTNAME: string;
//   ADDRESSZIPCODE: string;
//   USETHISTAX: string;
// }
// interface AddressInstallation {
//   ADDRESSDISTRICT: string;
//   ADDRESSDISTRICTNAME: string;
//   ADDRESSMOO: string;
//   ADDRESSNUMBER: string;
//   ADDRESSPHONE: string;
//   ADDRESSPROVINCE: string;
//   ADDRESSPROVINCENAME: string;
//   ADDRESSROAD: string;
//   ADDRESSSOI: string;
//   ADDRESSSUBDISTRICT: string;
//   ADDRESSSUBDISTRICTNAME: string;
//   ADDRESSZIPCODE: string;
//   USETHISTAX: string;
// }
// interface AddressPayment {
//   ADDRESSDISTRICT: string;
//   ADDRESSDISTRICTNAME: string;
//   ADDRESSMOO: string;
//   ADDRESSNUMBER: string;
//   ADDRESSPHONE: string;
//   ADDRESSPROVINCE: string;
//   ADDRESSPROVINCENAME: string;
//   ADDRESSROAD: string;
//   ADDRESSSOI: string;
//   ADDRESSSUBDISTRICT: string;
//   ADDRESSSUBDISTRICTNAME: string;
//   ADDRESSZIPCODE: string;
//   USETHISTAX: string;
// }

// interface AddressTax {
//   ADDRESSDISTRICT: string;
//   ADDRESSDISTRICTNAME: string;
//   ADDRESSMOO: string;
//   ADDRESSNUMBER: string;
//   ADDRESSPHONE: string;
//   ADDRESSPROVINCE: string;
//   ADDRESSPROVINCENAME: string;
//   ADDRESSROAD: string;
//   ADDRESSSOI: string;
//   ADDRESSSUBDISTRICT: string;
//   ADDRESSSUBDISTRICTNAME: string;
//   ADDRESSZIPCODE: string;
//   USETHISTAX: string;
// }

// // ถ้าโครงสร้างในฐานข้อมูลเหมือนตัวอย่างข้างบน
// interface AddressItem {
//   ADDRESSCARD: AddressCard;
//   ADDRESSINSTALLATION: AddressInstallation;
//   ADDRESSPAYMENT: AddressPayment;
//   ADDRESSTAX: AddressTax;
// }

// interface LocationState {
//   item?: ItemProps;
//   from?: string;
// }

// const CreateFirstBill: React.FC = () => {
//   const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO;
//   const POST_PAYMENT_TRANSACTION_URL = `${API_URL_GET_ALLCONTRACT}/Payment/UpdatePaymentTransaction`;

//   const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
//   const GET_QR_PAYMENT_URL = `${API_URL_SALECONNEXT}/GetQRPayment`;

//   const navigate = useNavigate();
//   const MySwal = withReactContent(Swal);

//   const { auth } = useAuth();
//   const EmpId = auth?.data?.[0]?.EmpId || "";
//   const EmpName = auth?.data?.[0]?.EmpName || "";
//   const TeamSale = auth?.data?.[0]?.TeamSale || "";
//   const SaleCode = auth?.data?.[0]?.SaleCode || "";
//   const SupEmpId = auth?.data?.[0]?.SupEmp || "";
//   const SecEmpId = auth?.data?.[0]?.SecEmp || "";

//   const location = useLocation();
//   // const item = location.state as ItemProps || [];
//   // const from = location.state as ItemProps || [];

//   const state = (location.state ?? {}) as LocationState;
//   const item = state.item;
//   console.log(`item`, item);
//   const from = state.from ?? "";

//   const refno = item?.REFNO ?? "";
//   const product = item?.PRODUCT ?? [];
//   const contNo = item?.CONTNO ?? "";
//   const customerDetail = item?.CUSTOMERDETAIL ?? [];
//   const discountAmount = item?.DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
//   console.log(`discountAmount`, discountAmount);
//   const transaction = item?.TRANSACTION ?? [];
//   // console.log(`transaction`, transaction);

//   const addressArray = item?.ADDRESS;
//   const firstAddress = addressArray?.[0];
//   const secondAddress = addressArray?.[1];
//   const thirdAddress = addressArray?.[2];
//   const fourthAddress = addressArray?.[3];

//   // กดเข้ามาแล้วถ้ามีวันนัดชำระ ให้ติ๊กอยู่ที่ นัดชำระ แล้ววันที่ให้โชวันที่นัดก่อนหน้า
//   useEffect(() => {
//     if (item?.SCHEDULE && item.SCHEDULE.length > 0) {
//       // โหมดนัดชำระ
//       handlePayQuickChange(false);
//       // แปลงวันจาก SCHEDULE[0].DUEDATE (สมมติเป็น ISO string) ให้เป็น Date
//       const due = new Date(item.SCHEDULE[0].DUEDATE);
//       setValueCalendarInstall(due);
//     }
//   }, [item]);

//   // อ่านแพ็กเกจ/งวด
//   const paymentPeriodDetailId =
//     product?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTPERIODDETAILID;
//   const paymentPeriodNumber =
//     product?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTPERIODNUMBER;
//   const periodAmount =
//     product?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT ?? 0;

//   const paymentAmount =
//     (from === "/firstBill/overview"
//       ? item?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT
//       : product?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT - discountAmount) ?? 0;
//   console.log(`paymentAmount`, paymentAmount);

//   const totalPrice = Number(product?.[0]?.Package?.[0]?.TOTALPRICE ?? 0);
//   const netPrice = totalPrice - discountAmount;

//   // ชำระเงินทันที หรือ นัดชำระ
//   const [payQuick, setPayQuick] = useState<boolean>(true);
//   const [status, setStatus] = useState("PAID");

//   // ชำระเต็ม หรือ ชำระบางส่วน / เกินจำนวน
//   const [payFullAmount, setPayFullAmount] = useState<boolean>(true);
//   const [paySomeAmount, setPaySomeAmount] = useState<number>(0);
//   console.log(`จำนวนเงินแบ่งชำระ`, paySomeAmount);
//   const [paymentChoice, setPaymentChoice] = useState<string>("FULL");

//   const [priceOption, setPriceOption] = useState<string>("CASH");

//   // ประเภทการชำระเงิน
//   const [paymentChannel, setPaymentChannel] = useState<string>("CASH");

//   // const remainingAmount = Math.max(
//   //   0,
//   //   (product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT || 0) -
//   //   discountAmount -
//   //   paySomeAmount
//   // );

//   // ใช้ยอดงวดล่าสุด ถ้ามี TRANSACTION ********สำคัญ
//   // const remainingAmount = Math.max(
//   //   0,
//   //   paymentAmount - discountAmount - paySomeAmount
//   // );
//   const remainingAmount = Math.max(0, paymentAmount - paySomeAmount);

//   const [valueCalendarInstall, setValueCalendarInstall] = useState<Date | null>(
//     null
//   );
//   const dueDate = dayjs(valueCalendarInstall).format("YYYY-MM-DD");

//   const [errorMessage, setErrorMessage] = useState<string>("");

//   const [qrCodeData, setQrCodeData] = useState<string>("");
//   // console.log(`qrCodeData`, qrCodeData);

//   const [loadingQR, setLoadingQR] = useState<boolean>(false);

//   const paymentId = uuidv4();
//   console.log(`paymentId`, paymentId);

//   ///////// บังคับกรอกปฏิทิน
//   const [dateError, setDateError] = useState<string>("");
//   const dueDateRef = useRef<HTMLInputElement>(null);

//   // ไม่ให้เลือกย้อนหลัง (เสริมความปลอดภัย)
//   const todayStr = dayjs().format("YYYY-MM-DD");

//   const getQRPayment = async () => {
//     try {
//       setLoadingQR(true);

//       // ตรงนี้คำนวนยอดที่จะจ่ายก่อน
//       // ถ้า PACKAGETYPEID !== 1 → เงินผ่อน (installment) → ใช้ amountToPay
//       // ถ้า PACKAGETYPEID === 1 → เงินสด (cash) → ใช้ netPrice
//       //   const amountToPay = payFullAmount ? paymentAmount : paySomeAmount;
//       //   const isInstallment = product[0]?.Package[0]?.PACKAGETYPEID !== 1;
//       //   const qrAmount = isInstallment ? amountToPay : netPrice;

//       // คำนวณยอดที่จะจ่าย
//       // ถ้าเป็นเงินผ่อน (installment)
//       const isInstallment = product[0]?.Package[0]?.PACKAGETYPEID !== 1;

//       // ยอดสุทธิหลังหักส่วนลด
//       // const netPrice = totalPrice - discountAmount;
//       // console.log(`netPrice`, netPrice);

//       // เลือกยอดที่จะส่งไปขอ QR
//       let qrAmount: number;
//       if (!isInstallment) {
//         qrAmount = payFullAmount ? paymentAmount : paySomeAmount;
//       } else {
//         qrAmount = paySomeAmount;
//       }

//       const formData = new FormData();
//       formData.append("RefNo", refno);
//       formData.append("Amount", qrAmount.toString());

//       //   console.log("refno", refno);
//       console.log("สแกน", qrAmount.toString());

//       const response = await axios.post(GET_QR_PAYMENT_URL, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       // console.log(`response`, response);

//       if (response.status === 200 && response.data) {
//         setQrCodeData(response.data.data.QrCode || "");
//       }
//     } catch (error) {
//       console.error("Error fetching QR Payment:", error);
//     } finally {
//       setLoadingQR(false);
//     }
//   };

//   const handlePayQuickChange = (isPayQuick: boolean) => {
//     setQrCodeData("");
//     setPayQuick(isPayQuick);
//     setStatus(isPayQuick ? "PAID" : "SCHEDULE");
//     setPaymentChannel(isPayQuick ? "CASH" : "NONE");
//     setPaymentChoice(isPayQuick ? (payFullAmount ? "FULL" : "SOME") : "NONE"); // อัปเดต PAYMENTCHOICE
//   };

//   const handlePayFullAmountChange = (value: boolean) => {
//     setQrCodeData("");
//     setPayFullAmount(value);
//     setPaymentChoice(value ? "FULL" : "SOME");

//     if (!value) {
//       // ถ้าเป็นชำระบางส่วน => สถานะ SCHEDULE
//       setStatus("SCHEDULE");
//       // บังคับให้เป็นเงินสด
//       setPaymentChannel("CASH");
//       setPriceOption("CASH"); // <<--- เพิ่มบรรทัดนี้ด้วย
//     } else {
//       // ถ้าเป็นชำระเต็มจำนวน => สถานะ PAID
//       setStatus("PAID");
//       // บังคับให้เป็นเงินสด
//       setPaymentChannel("CASH");
//       setPriceOption("CASH"); // <<--- เพิ่มบรรทัดนี้ด้วย
//     }
//   };

//   const handleDateChangeInstall = (date: Date | null) => {
//     setValueCalendarInstall(date);
//   };

//   const handlePaymentChannelChange = (channel: string) => {
//     setPaymentChannel(channel);

//     // ถ้าผู้ใช้เลือก "QR CODE" → call API
//     if (channel === "QR CODE") {
//       // เช็คยอดที่จะจ่าย
//       let amountToPay = 0;
//       if (payFullAmount) {
//         // ชำระเต็ม → (paymentAmount - discount) สมมติเป็นงวดแรก
//         amountToPay = Math.max(0, paymentAmount - discountAmount);
//       } else {
//         // ชำระบางส่วน → paySomeAmount
//         amountToPay = paySomeAmount;
//       }

//       // call API ขอ QR
//       getQRPayment();
//     } else {
//       // ถ้าเปลี่ยนกลับเป็น 'CASH' ก็เคลียร์ qrCodeData
//       setQrCodeData("");
//     }
//   };

//   const handlePriceOptionChange = (option: string) => {
//     setPriceOption(option);

//     // ถ้าเลือก QR CODE จากชุด priceOption
//     if (option === "QR CODE") {
//       // ก็ต้องเรียก getQRPayment ด้วย
//       // หรือบังคับ paymentChannel เป็น "QR CODE" ไปเลย
//       setPaymentChannel("QR CODE");
//       getQRPayment();
//     } else {
//       // ถ้าเป็น "CASH"
//       setPaymentChannel("CASH");
//       setQrCodeData("");
//     }
//   };

//   // ฟังก์ชัน handleSomeAmountChange (แก้ให้ลบหมด = 0)
//   const handleSomeAmountChange = (value: string) => {
//     // ล้างค่า QR (ถ้ามี)
//     setQrCodeData("");

//     // 1) ถ้าผู้ใช้ลบตัวเลขจนเป็น "" หรือ "0" → ให้เป็น 0
//     if (!value) {
//       setPaySomeAmount(0);
//       setErrorMessage("");
//       return;
//     }
//     if (value === "0") {
//       setPaySomeAmount(0);
//       setErrorMessage("");
//       return;
//     }

//     // 2) จากนั้นตรวจสอบเลข
//     const number = Number(value);
//     if (isNaN(number) || number < 0) {
//       setErrorMessage("กรุณากรอกจำนวนเงินที่ถูกต้อง");
//     } else if (number > netPrice) {
//       setPaySomeAmount(number);
//       setErrorMessage(`ห้ามชำระเกินราคาสุทธิ ${netPrice.toLocaleString()} บาท`);
//     } else {
//       setPaySomeAmount(number);
//       setErrorMessage("");
//     }
//   };

//   const handleSomeAmountBlur = () => {
//     // กรณีต้องการให้ยิงเฉพาะตอนเป็น QR CODE
//     if (paymentChannel === "QR CODE") {
//       getQRPayment();
//     }
//   };

//   const allData = {
//     REFNO: refno,
//     EMPID: EmpId,
//     EMPNAME: EmpName,
//     SALECODE: SaleCode,
//     TEAMSALE: TeamSale,
//     LATITUDE: localStorage.getItem("latitude") || "",
//     LONGITUDE: localStorage.getItem("longitude") || "",
//     STATUS: status,
//     DUEDATE:
//       status === "SCHEDULE"
//         ? dueDate
//         : paymentChoice === "FULL" ||
//           paySomeAmount >= paymentAmount - discountAmount
//           ? ""
//           : dueDate,
//     PAYMENTPERIODDETAILID: paymentPeriodDetailId,
//     PAYMENTPERIODNUMBER: paymentPeriodNumber,
//     PAYMENTCHANNEL: paymentChannel,
//     PAYMENTCHOICE: paymentChoice,
//     AMOUNT:
//       status === "SCHEDULE" && paymentChoice === "NONE"
//         ? paymentAmount - discountAmount
//         : paymentChoice === "FULL"
//           ? paymentAmount - discountAmount
//           : paySomeAmount,
//     PERIODAMOUNT: periodAmount - discountAmount,
//     DISCOUNT: discountAmount,
//     PAYMENTID: paymentId,
//   };
//   console.log(`allData`, allData);

//   const onSubmit = async (data: any) => {
//     // ตรวจสอบการมี qrCodeData เมื่อเลือกช่องทาง QR CODE
//     // if (paymentChannel === "QR CODE" && qrCodeData) {
//     //   Swal.fire("แจ้งเตือน", "กรุณาทำการสแกน qr code ก่อน", "warning");
//     //   return;
//     // }

//     // if (payQuick) {
//     //   Swal.fire({
//     //     title: "ยืนยันการออกใบเสร็จ",
//     //     icon: "warning",
//     //     showCancelButton: true,
//     //     confirmButtonText: "ตกลง",
//     //     cancelButtonText: "ยกเลิก",
//     //   }).then((result) => {
//     //     if (result.isConfirmed) {
//     //       navigate("/firstBill/receipt", { state: item });
//     //     }
//     //   });
//     //   return;
//     // }

//     try {
//       const response = await axios.post(POST_PAYMENT_TRANSACTION_URL, allData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.status === 200) {
//         // ปักธงว่า REFNO นี้บันทึกการชำระ/นัดชำระแล้ว
//         localStorage.setItem(`paymentDone:${refno.toUpperCase().trim()}`, '1');

//         Swal.fire({
//           icon: "success",
//           title: "สำเร็จ!",
//           text: "บันทึกธุรกรรมการชำระเงินสำเร็จ",
//           timer: 2000,
//           showConfirmButton: false,
//         });
//         navigate("/");

//         // ถ้ามาจาก sale/contract หรือ sale/update/updatecontract
//         // และสถานะเป็น SCHEDULE (มี DUEDATE)
//         const saleRoutes = ["/sale/contract", "/sale/update/updatecontract"];
//         // if (saleRoutes.includes(from) && status === "SCHEDULE" && item?.STATUS === "DRAFT") {
//         if (item?.STATUS === "DRAFT" && payQuick) {
//           //   navigate("/sale/photo", { state: { data: item, fromStep: "true" } });
//           // navigate("/firstBill/receiptmock", { state: item });
//           navigate("/firstBill/receipt", { state: item });
//         } if (item?.STATUS === "DRAFT" && !payQuick) {
//           navigate("/sale/photo", { state: { data: item, fromStep: "true" } });
//         } if (item?.STATUS !== "DRAFT") {
//           navigate("/firstBill/receiptFromCreateFirstBill", { state: item });
//         }
//       } else {
//         Swal.fire(
//           "เกิดข้อผิดพลาด",
//           response.data.message || "ไม่สามารถบันทึกข้อมูลได้",
//           "error"
//         );
//       }
//     } catch (error) {
//       console.error("Error saving data:", error);
//       Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้", "error");
//     }
//   };

//   // const onSubmit = async (data: any) => {
//   //     // ตรวจสอบกรณีเลือก QR CODE แต่ยังไม่ได้สแกน
//   //     if (paymentChannel === "QR CODE" && qrCodeData) {
//   //         Swal.fire("แจ้งเตือน", "กรุณาทำการสแกน qr code ก่อน", "warning");
//   //         return;
//   //     }

//   //     try {
//   //         const response = await axios.post(POST_PAYMENT_TRANSACTION_URL, allData, {
//   //             headers: { "Content-Type": "application/json" },
//   //         });

//   //         if (response.status === 200) {
//   //             Swal.fire("สำเร็จ", "บันทึกธุรกรรมการชำระเงินสำเร็จ", "success");

//   //             // รอสักครู่ให้ SweetAlert แสดงก่อน แล้วค่อย navigate
//   //             setTimeout(() => {
//   //                 // ถ้ามาจาก sale/contract, updateSalesContract หรือ sale/step
//   //                 const saleRoutes = [
//   //                     '/sale/contract',
//   //                     '/sale/update/UpdateSalesContract',
//   //                     '/sale/step',
//   //                 ];
//   //                 if (saleRoutes.includes(from)) {
//   //                     // ไปหน้า photo ต่อ
//   //                     navigate('/sale/photo', {
//   //                         state: { item, from }
//   //                     });
//   //                 } else {
//   //                     // ปกติไปหน้า overview ของ firstBill
//   //                     navigate('/firstBill/overview', { state: item });
//   //                 }
//   //             }, 500);

//   //         } else {
//   //             Swal.fire("เกิดข้อผิดพลาด", response.data.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
//   //         }

//   //     } catch (error) {
//   //         console.error("Error saving data:", error);
//   //         Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้", "error");
//   //     }
//   // };

//   const handleBack = () => {
//     const saleRoutes = [
//       "/sale/contract",
//       "/sale/update/UpdateSalesContract",
//       "/sale/step",
//     ];

//     if (saleRoutes.includes(from)) {
//       navigate("/sale/step", { state: item });
//     }

//     const saleRoutesEditFinishInDay = ["/sale/editFinishInDay"];

//     if (saleRoutesEditFinishInDay.includes(from)) {
//       navigate("/sale/editFinishInDay", { state: item });
//     } else {
//       navigate("/firstBill/overview", { state: item });
//     }
//   };

//   // const FINISH_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=FINISH&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;
//   const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//   const GET_PAYMENT_URL = `${API_URL_MONGO}/Payment/GetPaymentPeriod`;

//   const [finish, setFinish] = useState<any[]>([]); // กำหนดให้ state เป็น array เพื่อรองรับ map()
//   console.log(`finish`, finish);

//   const [isLoadingFinish, setIsLoadingFinish] = useState<boolean>(false);

//   const [search, setSearch] = useState<string>(""); // State สำหรับค้นหา

//   // Pagination states
//   const [entries, setEntries] = useState<number>(10); // Default entries per page
//   const [currentPageFinish, setCurrentPageFinish] = useState<number>(1);

//   useEffect(() => {
//     getDataFinish();
//   }, []);

//   const getDataFinish = async () => {
//     setIsLoadingFinish(true);
//     try {
//       const response = await axios.get(GET_PAYMENT_URL, {
//         params: {
//           EMPID: EmpId,
//           TEAMSALE: TeamSale,
//         },
//       });
//       const data = Array.isArray(response.data.data) ? response.data.data : [];
//       setFinish(data);
//     } catch (error) {
//       console.error("Error fetching GET_PAYMENT_URL:", error);
//     } finally {
//       setIsLoadingFinish(false);
//     }
//   };

//   return (
//     <>
//       <Content>
//         <div className="d-flex justify-content-between align-items-center my-5">
//           <div
//             id="kt_page_title"
//             data-kt-swapper="true"
//             data-kt-swapper-mode="prepend"
//             data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//             className="page-title d-flex flex-wrap me-3 flex-column justify-content-center"
//           >
//             <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//               <li
//                 className={`breadcrumb-item text-gray-900 font ${styles.titlePage}`}
//               >
//                 การรับชำระเงินงวดแรก
//               </li>
//             </ul>
//           </div>
//         </div>
//         <span className={`${styles.fontSize}`}>เลขที่ขาย: </span>
//         <span className={`${styles.titlePage}`}>{refno}</span>

//         <div className="row">
//           {/* Card Body */}
//           <div className="col-lg-6">
//             <div className="accordion mb-10" id="kt_accordion_1">
//               <div className="accordion-item mb-10">
//                 <h2 className="accordion-header" id="kt_accordion_1_header_1">
//                   <h3
//                     className="accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7"
//                     data-bs-toggle="collapse"
//                     data-bs-target="#kt_accordion_1_body_1"
//                     aria-expanded="true"
//                     aria-controls="kt_accordion_1_body_1"
//                     style={{
//                       color: "white",
//                       cursor: "pointer",
//                       backgroundColor: "#3777bc",
//                     }}
//                   >
//                     การรับชำระเงินงวดแรก
//                   </h3>
//                 </h2>
//                 <div
//                   id="kt_accordion_1_body_1"
//                   className="accordion-collapse collapse show"
//                   aria-labelledby="kt_accordion_1_header_1"
//                   data-bs-parent="#kt_accordion_1"
//                 >
//                   <div className="accordion-body">
//                     <form noValidate className="form">
//                       <div className="card-body px-lg-9 px-1">
//                         <div className="">
//                           <div className="d-flex mb-6">
//                             <div className="form-check form-check-inline me-3">
//                               <input
//                                 className="form-check-input"
//                                 type="radio"
//                                 name="payQuick"
//                                 checked={payQuick}
//                                 onChange={() => handlePayQuickChange(true)}
//                               />
//                               <label className={`${styles.label} me-2`}>
//                                 ชำระเงินทันที
//                               </label>
//                             </div>
//                             <div className="form-check form-check-inline me-3">
//                               <input
//                                 className="form-check-input"
//                                 type="radio"
//                                 name="payQuick"
//                                 checked={!payQuick}
//                                 onChange={() => handlePayQuickChange(false)}
//                               />
//                               <label className={`${styles.label} me-2`}>
//                                 นัดชำระ
//                               </label>
//                             </div>
//                           </div>

//                           {/* Start ชำระเงินทันที */}
//                           {payQuick && (
//                             <>
//                               <div className="d-flex mb-6 mt-10">
//                                 <div className="form-check form-check-inline me-3">
//                                   <input
//                                     className="form-check-input"
//                                     type="radio"
//                                     name="payFullAmount"
//                                     checked={payFullAmount}
//                                     onChange={() =>
//                                       handlePayFullAmountChange(true)
//                                     }
//                                   />
//                                   <label className={`${styles.label} me-2`}>
//                                     ชำระเต็มจำนวน
//                                   </label>
//                                 </div>
//                                 <div className="form-check form-check-inline me-3">
//                                   <input
//                                     className="form-check-input"
//                                     type="radio"
//                                     name="payFullAmount"
//                                     checked={!payFullAmount}
//                                     onChange={() =>
//                                       handlePayFullAmountChange(false)
//                                     }
//                                   />
//                                   <label className={`${styles.label} me-2`}>
//                                     {product[0]?.Package[0]?.PACKAGETYPEID ===
//                                       1 ? (
//                                       <span>ชำระบางส่วน</span>
//                                     ) : (
//                                       <span>ชำระบางส่วน / เกินจำนวน</span>
//                                     )}
//                                   </label>
//                                 </div>
//                               </div>

//                               {/* Start ชำระเต็ม */}
//                               {payFullAmount && (
//                                 <>
//                                   {product[0].Package.PACKAGETYPEID === 1 ? (
//                                     <div className="mb-6">
//                                       <label className={`${styles.label} me-2`}>
//                                         จำนวนเงินที่ต้องชำระ
//                                       </label>
//                                       <input
//                                         type="text"
//                                         className="form-control"
//                                         readOnly
//                                         style={{
//                                           backgroundColor: "#d7dbde",
//                                         }}
//                                         // value={paymentAmount - discountAmount}
//                                         value={paymentAmount}
//                                       // value={transaction[0]?.AMOUNT}
//                                       />
//                                     </div>
//                                   ) : (
//                                     <div className="mb-6">
//                                       <label className={`${styles.label} me-2`}>
//                                         จำนวนเงินที่ต้องชำระ
//                                       </label>
//                                       <input
//                                         type="text"
//                                         className={`form-control ${styles.label}`}
//                                         readOnly
//                                         style={{
//                                           backgroundColor: "#d7dbde",
//                                         }}
//                                         value={paymentAmount}
//                                       // value={transaction[0]?.AMOUNT}
//                                       />
//                                     </div>
//                                   )}
//                                   <div className="d-flex mb-6 mt-10">
//                                     <div className="form-check form-check-inline me-3">
//                                       <input
//                                         className="form-check-input"
//                                         type="radio"
//                                         name="paymentChannel"
//                                         checked={paymentChannel === "CASH"}
//                                         onChange={() =>
//                                           handlePaymentChannelChange("CASH")
//                                         }
//                                       />
//                                       <label className={`${styles.label} me-2`}>
//                                         เงินสด
//                                       </label>
//                                     </div>
//                                     <div className="form-check form-check-inline me-3">
//                                       <input
//                                         className="form-check-input"
//                                         type="radio"
//                                         name="paymentChannel"
//                                         checked={paymentChannel === "QR CODE"}
//                                         onChange={() =>
//                                           handlePaymentChannelChange("QR CODE")
//                                         }
//                                       />
//                                       <label className={`${styles.label} me-2`}>
//                                         QR CODE
//                                       </label>
//                                     </div>
//                                   </div>
//                                 </>
//                               )}
//                               {/* End ชำระเต็ม */}

//                               {/* Start ชำระบางส่วน / เกินจำนวน */}
//                               {!payFullAmount && (
//                                 <>
//                                   {/* {product[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
//                                                                         <div className="mb-6">
//                                                                             <label className={`${styles.label} me-2`}>ราคาสุทธิ</label>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 className="form-control"
//                                                                                 readOnly
//                                                                                 style={{
//                                                                                     backgroundColor: '#d7dbde',
//                                                                                 }}
//                                                                                 value={netPrice}
//                                                                             />
//                                                                         </div>
//                                                                     )} */}
//                                   <div className="mb-6">
//                                     {product[0]?.Package[0]?.PACKAGETYPEID !==
//                                       1 ? (
//                                       <>
//                                         <label
//                                           className={`${styles.label} me-2`}
//                                         >
//                                           จำนวนเงินที่ต้องชำระงวดที่ 1
//                                         </label>
//                                         <input
//                                           type="text"
//                                           className={`form-control ${styles.label}`}
//                                           readOnly
//                                           style={{
//                                             backgroundColor: "#d7dbde",
//                                           }}
//                                           // value={paymentAmount - discountAmount}
//                                           value={paymentAmount}
//                                         // value={transaction[0]?.AMOUNT}
//                                         />
//                                       </>
//                                     ) : (
//                                       <>
//                                         <label
//                                           className={`${styles.label} me-2`}
//                                         >
//                                           ราคาสุทธิ
//                                         </label>
//                                         <input
//                                           type="text"
//                                           className={`form-control ${styles.label}`}
//                                           readOnly
//                                           style={{
//                                             backgroundColor: "#d7dbde",
//                                           }}
//                                           value={netPrice}
//                                         />
//                                       </>
//                                     )}
//                                   </div>

//                                   <div className="mb-6">
//                                     {product[0]?.Package[0]?.PACKAGETYPEID !==
//                                       1 ? (
//                                       <>
//                                         <label
//                                           className={`${styles.label} me-2`}
//                                         >
//                                           จำนวนเงินที่แบ่งชำระ
//                                         </label>
//                                         <input
//                                           inputMode="numeric"
//                                           pattern="[0-9]*"
//                                           type="text"
//                                           className={`form-control ${styles.label}`}
//                                           onChange={(e) =>
//                                             handleSomeAmountChange(
//                                               e.target.value
//                                             )
//                                           }
//                                           value={paySomeAmount}
//                                         />
//                                       </>
//                                     ) : (
//                                       <>
//                                         <label
//                                           className={`${styles.label} me-2`}
//                                         >
//                                           จำนวนเงินที่ชำระ
//                                         </label>
//                                         <input
//                                           type="text"
//                                           className={`form-control ${styles.label
//                                             } ${errorMessage ? "is-invalid" : ""
//                                             }`}
//                                           onChange={(e) =>
//                                             handleSomeAmountChange(
//                                               e.target.value
//                                             )
//                                           }
//                                           onBlur={handleSomeAmountBlur}
//                                           value={
//                                             paySomeAmount === 0
//                                               ? "0"
//                                               : paySomeAmount
//                                           } // ใช้ "0" เพื่อให้พิมพ์ได้
//                                           min="0" // ป้องกันค่าติดลบ
//                                           inputMode="numeric"
//                                           pattern="[0-9]*"
//                                         />
//                                         {errorMessage && (
//                                           <div className="text-danger mt-1">
//                                             {errorMessage}
//                                           </div>
//                                         )}
//                                       </>
//                                     )}
//                                   </div>
//                                   <div className="mb-6">
//                                     <label className={`${styles.label} me-2`}>
//                                       จำนวนเงินที่เหลืองวดที่ 1
//                                     </label>
//                                     <input
//                                       type="text"
//                                       className={`form-control ${styles.label}`}
//                                       readOnly
//                                       style={{
//                                         backgroundColor: "#d7dbde",
//                                       }}
//                                       value={
//                                         isNaN(remainingAmount)
//                                           ? 0
//                                           : remainingAmount
//                                       }
//                                     />
//                                   </div>
//                                   {/* ถ้าชำระมากกว่าหรือเท่ากับ ไม่ต้องโชว์ */}
//                                   {/* {paySomeAmount < transaction[0]?.AMOUNT && ( */}
//                                   {/* {paySomeAmount < paymentAmount - discountAmount && (
//                                                                         <div className="col-lg-12 mb-6">
//                                                                             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                                                                                 <label className={`${styles.label} me-2`}>วันที่สะดวกชำระส่วนที่เหลือ</label>
//                                                                                 <DatePicker
//                                                                                     selected={valueCalendarInstall}
//                                                                                     onChange={handleDateChangeInstall}
//                                                                                     className="form-control mb-3 mb-lg-0"
//                                                                                     showYearDropdown
//                                                                                     showMonthDropdown
//                                                                                     dropdownMode="select"
//                                                                                     isClearable
//                                                                                     dateFormat="yyyy/MM/dd"
//                                                                                     withPortal
//                                                                                 />
//                                                                             </div>
//                                                                         </div>
//                                                                     )} */}

//                                   <div className="col-lg-12 mb-6">
//                                     <label className={`${styles.label} mb-2`}>
//                                       วันที่สะดวกชำระส่วนที่เหลือ
//                                     </label>
//                                     <input
//                                       type="date"
//                                       className={`form-control ${styles.label}`}
//                                       value={
//                                         valueCalendarInstall
//                                           ? dayjs(
//                                             valueCalendarInstall
//                                           ).format("YYYY-MM-DD")
//                                           : ""
//                                       }
//                                       onChange={(e) => {
//                                         const v = e.target.value;
//                                         setValueCalendarInstall(
//                                           v ? new Date(v) : null
//                                         );
//                                       }}
//                                     />
//                                   </div>

//                                   {/* )} */}
//                                   <div className="d-flex mb-6 mt-10">
//                                     <div className="form-check form-check-inline me-3">
//                                       <input
//                                         className="form-check-input"
//                                         type="radio"
//                                         name="priceOption"
//                                         checked={priceOption === "CASH"}
//                                         onChange={() =>
//                                           handlePriceOptionChange("CASH")
//                                         }
//                                       />
//                                       <label className={`${styles.label} me-2`}>
//                                         เงินสด
//                                       </label>
//                                     </div>
//                                     <div className="form-check form-check-inline me-3">
//                                       <input
//                                         className="form-check-input"
//                                         type="radio"
//                                         name="priceOption"
//                                         checked={priceOption === "QR CODE"}
//                                         onChange={() =>
//                                           handlePriceOptionChange("QR CODE")
//                                         }
//                                       />
//                                       <label className={`${styles.label} me-2`}>
//                                         QR CODE
//                                       </label>
//                                     </div>
//                                   </div>
//                                 </>
//                               )}
//                               {/* End ชำระบางส่วน / เกินจำนวน */}
//                             </>
//                           )}
//                           {/* End ชำระเงินทันที */}

//                           {/* Start นัดชำระ */}
//                           {/* {!payQuick && (
//                                                         <div className="col-lg-12 mb-6">
//                                                             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                                                                 <label className={`${styles.label} me-2`}>วันที่สะดวกชำระ</label>
//                                                                 <DatePicker
//                                                                     selected={valueCalendarInstall}
//                                                                     onChange={handleDateChangeInstall}
//                                                                     className="form-control mb-3 mb-lg-0"
//                                                                     showYearDropdown
//                                                                     showMonthDropdown
//                                                                     dropdownMode="select"
//                                                                     isClearable
//                                                                     dateFormat="yyyy/MM/dd"
//                                                                     withPortal
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                     )} */}
//                           {!payQuick && (
//                             <div className="col-lg-12 mb-6">
//                               {/* ไม่ต้องใช้ flex-column แล้ว แค่ label กับ input */}
//                               <label className={`${styles.label} mb-2`}>
//                                 วันที่สะดวกชำระ
//                               </label>
//                               <input
//                                 type="date"
//                                 className={`form-control ${styles.label}`}
//                                 // แปลง Date → YYYY-MM-DD เพื่อให้ value ของ input ตรงกัน
//                                 value={
//                                   valueCalendarInstall
//                                     ? dayjs(valueCalendarInstall).format(
//                                       "YYYY-MM-DD"
//                                     )
//                                     : ""
//                                 }
//                                 onChange={(e) => {
//                                   const dateStr = e.target.value;
//                                   // ถ้าเลือกค่าว่าง ให้เป็น null
//                                   setValueCalendarInstall(
//                                     dateStr ? new Date(dateStr) : null
//                                   );
//                                 }}
//                               />
//                             </div>
//                           )}
//                           {/* End นัดชำระ*/}

//                           <div className="mb-6 mt-10 d-flex justify-content-center">
//                             {loadingQR ? (
//                               <ThreeDot />
//                             ) : qrCodeData ? (
//                               <img
//                                 src={qrCodeData}
//                                 alt="QR Code"
//                                 style={{ width: 200, height: 200 }}
//                               />
//                             ) : null}
//                           </div>
//                         </div>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* End Card Body */}

//           {/* Card Body */}
//           <div className="col-lg-6 mb-20">
//             <div className="card">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between mb-5">
//                   <label className={`col-lg-4 fw-bold ${styles.label}`}>
//                     รายละเอียดสัญญา
//                   </label>
//                   <button
//                     type="button"
//                     className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
//                   >
//                     <KTIcon iconName="category" className="fs-2" />
//                   </button>
//                 </div>

//                 <div className="">
//                   {contNo && (
//                     <div className="row mb-7">
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         เลขที่สัญญา
//                       </label>
//                       <label className={`col-lg-4 ${styles.label}`}>
//                         <span className={`${styles.label}`}>{contNo}</span>
//                       </label>
//                     </div>
//                   )}

//                   <div className="row mb-7">
//                     <label className={`col-lg-4 text-muted ${styles.label}`}>
//                       ชื่อลูกค้า
//                     </label>
//                     <div className="col-7 col-md-8">
//                       <label className={`col-lg-4 ${styles.label}`}>
//                         {customerDetail[0]?.PREFIX[0]?.PREFIXNAME}{" "}
//                         {customerDetail[0]?.CUSTOMERNAME}{" "}
//                         {customerDetail[0]?.CUSTOMERLASTNAME}
//                       </label>
//                     </div>
//                   </div>

//                   {firstAddress?.ADDRESSCARD.ADDRESSPROVINCENAME && (
//                     <div className="row mb-7">
//                       {/* หัวข้ออยู่ col-lg-4 */}
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         ที่อยู่ตามบัตร
//                       </label>
//                       {/* เนื้อหาอยู่ col-lg-7 */}
//                       <div className="col-lg-7 d-flex align-items-center">
//                         <span className={`${styles.label} me-2`}>
//                           {firstAddress.ADDRESSCARD.ADDRESSNUMBER &&
//                             firstAddress.ADDRESSCARD.ADDRESSNUMBER}{" "}
//                           {firstAddress.ADDRESSCARD.ADDRESSMOO &&
//                             `หมู่ ${firstAddress.ADDRESSCARD.ADDRESSMOO}`}{" "}
//                           {firstAddress.ADDRESSCARD.ADDRESSSOI &&
//                             `ซอย ${firstAddress.ADDRESSCARD.ADDRESSSOI}`}{" "}
//                           {firstAddress.ADDRESSCARD.ADDRESSROAD &&
//                             `ถนน ${firstAddress.ADDRESSCARD.ADDRESSROAD}`}{" "}
//                           {firstAddress.ADDRESSCARD.ADDRESSDISTRICTNAME &&
//                             `เขต ${firstAddress.ADDRESSCARD.ADDRESSDISTRICTNAME}`}{" "}
//                           {firstAddress.ADDRESSCARD.ADDRESSSUBDISTRICTNAME &&
//                             `แขวง ${firstAddress.ADDRESSCARD.ADDRESSSUBDISTRICTNAME}`}{" "}
//                           {firstAddress.ADDRESSCARD.ADDRESSPROVINCENAME &&
//                             `จังหวัด ${firstAddress.ADDRESSCARD.ADDRESSPROVINCENAME}`}{" "}
//                           {firstAddress.ADDRESSCARD.ADDRESSZIPCODE &&
//                             firstAddress.ADDRESSCARD.ADDRESSZIPCODE}
//                         </span>
//                         <FontAwesomeIcon icon={faLocationDot} size="2x" />
//                       </div>
//                     </div>
//                   )}

//                   {firstAddress?.ADDRESSINSTALLATION.ADDRESSPROVINCENAME && (
//                     <div className="row mb-7">
//                       {/* หัวข้ออยู่ col-lg-4 */}
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         ที่อยู่ติดตั้ง
//                       </label>
//                       {/* เนื้อหาอยู่ col-lg-7 */}
//                       <div className="col-lg-7 d-flex align-items-center">
//                         <span className={`${styles.label} me-2`}>
//                           {firstAddress.ADDRESSINSTALLATION.ADDRESSNUMBER}{" "}
//                           {firstAddress.ADDRESSINSTALLATION.ADDRESSMOO &&
//                             `หมู่ ${firstAddress.ADDRESSINSTALLATION.ADDRESSMOO}`}{" "}
//                           {firstAddress.ADDRESSINSTALLATION.ADDRESSSOI &&
//                             `ซอย ${firstAddress.ADDRESSINSTALLATION.ADDRESSSOI}`}{" "}
//                           {firstAddress.ADDRESSINSTALLATION.ADDRESSROAD &&
//                             `ถนน ${firstAddress.ADDRESSINSTALLATION.ADDRESSROAD}`}{" "}
//                           {firstAddress.ADDRESSINSTALLATION
//                             .ADDRESSDISTRICTNAME &&
//                             `เขต ${firstAddress.ADDRESSINSTALLATION.ADDRESSDISTRICTNAME}`}{" "}
//                           {firstAddress.ADDRESSINSTALLATION
//                             .ADDRESSSUBDISTRICTNAME &&
//                             `แขวง ${firstAddress.ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME}`}{" "}
//                           {firstAddress.ADDRESSINSTALLATION
//                             .ADDRESSPROVINCENAME &&
//                             `จังหวัด ${firstAddress.ADDRESSINSTALLATION.ADDRESSPROVINCENAME}`}{" "}
//                           {firstAddress.ADDRESSINSTALLATION.ADDRESSZIPCODE}
//                         </span>
//                         <FontAwesomeIcon icon={faLocationDot} size="2x" />
//                       </div>
//                     </div>
//                   )}

//                   {firstAddress?.ADDRESSPAYMENT.ADDRESSPROVINCENAME && (
//                     <div className="row mb-7">
//                       {/* หัวข้ออยู่ col-lg-4 */}
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         ที่อยู่เก็บเงิน
//                       </label>
//                       {/* เนื้อหาอยู่ col-lg-7 */}
//                       <div className="col-lg-7 d-flex align-items-center">
//                         <span className={`${styles.label} me-2`}>
//                           {" "}
//                           {firstAddress.ADDRESSPAYMENT.ADDRESSNUMBER &&
//                             firstAddress.ADDRESSPAYMENT.ADDRESSNUMBER}{" "}
//                           {firstAddress.ADDRESSPAYMENT.ADDRESSMOO &&
//                             `หมู่ ${firstAddress.ADDRESSPAYMENT.ADDRESSMOO}`}{" "}
//                           {firstAddress.ADDRESSPAYMENT.ADDRESSSOI &&
//                             `ซอย ${firstAddress.ADDRESSPAYMENT.ADDRESSSOI}`}{" "}
//                           {firstAddress.ADDRESSPAYMENT.ADDRESSROAD &&
//                             `ถนน ${firstAddress.ADDRESSPAYMENT.ADDRESSROAD}`}{" "}
//                           {firstAddress.ADDRESSPAYMENT.ADDRESSDISTRICTNAME &&
//                             `เขต ${firstAddress.ADDRESSPAYMENT.ADDRESSDISTRICTNAME}`}{" "}
//                           {firstAddress.ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME &&
//                             `แขวง ${firstAddress.ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME}`}{" "}
//                           {firstAddress.ADDRESSPAYMENT.ADDRESSPROVINCENAME &&
//                             `จังหวัด ${firstAddress.ADDRESSPAYMENT.ADDRESSPROVINCENAME}`}{" "}
//                           {firstAddress.ADDRESSPAYMENT.ADDRESSZIPCODE &&
//                             firstAddress.ADDRESSPAYMENT.ADDRESSZIPCODE}{" "}
//                         </span>
//                         <FontAwesomeIcon icon={faLocationDot} size="2x" />
//                       </div>
//                     </div>
//                   )}

//                   {firstAddress?.ADDRESSTAX.ADDRESSPROVINCENAME && (
//                     <div className="row mb-7">
//                       {/* หัวข้ออยู่ col-lg-4 */}
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         ที่อยู่เสึยภาษี
//                       </label>
//                       {/* เนื้อหาอยู่ col-lg-7 */}
//                       <div className="col-lg-7 d-flex align-items-center">
//                         <span className={`${styles.label} me-2`}>
//                           {" "}
//                           {firstAddress.ADDRESSTAX.ADDRESSNUMBER &&
//                             firstAddress.ADDRESSTAX.ADDRESSNUMBER}{" "}
//                           {firstAddress.ADDRESSTAX.ADDRESSMOO &&
//                             `หมู่ ${firstAddress.ADDRESSTAX.ADDRESSMOO}`}{" "}
//                           {firstAddress.ADDRESSTAX.ADDRESSSOI &&
//                             `ซอย ${firstAddress.ADDRESSTAX.ADDRESSSOI}`}{" "}
//                           {firstAddress.ADDRESSTAX.ADDRESSROAD &&
//                             `ถนน ${firstAddress.ADDRESSTAX.ADDRESSROAD}`}{" "}
//                           {firstAddress.ADDRESSTAX.ADDRESSDISTRICTNAME &&
//                             `เขต ${firstAddress.ADDRESSTAX.ADDRESSDISTRICTNAME}`}{" "}
//                           {firstAddress.ADDRESSTAX.ADDRESSSUBDISTRICTNAME &&
//                             `แขวง ${firstAddress.ADDRESSTAX.ADDRESSSUBDISTRICTNAME}`}{" "}
//                           {firstAddress.ADDRESSTAX.ADDRESSPROVINCENAME &&
//                             `จังหวัด ${firstAddress.ADDRESSTAX.ADDRESSPROVINCENAME}`}{" "}
//                           {firstAddress.ADDRESSTAX.ADDRESSZIPCODE &&
//                             firstAddress.ADDRESSTAX.ADDRESSZIPCODE}{" "}
//                         </span>
//                         <FontAwesomeIcon icon={faLocationDot} size="2x" />
//                       </div>
//                     </div>
//                   )}

//                   <div className="row mb-10">
//                     <label className={`col-lg-4 text-muted ${styles.label}`}>
//                       เบอร์โทรติดต่อ
//                     </label>
//                     <div className="col-lg-7">
//                       <span className={`${styles.label}`}>
//                         {customerDetail[0]?.CUSTOMERMOBILE
//                           ? customerDetail[0]?.CUSTOMERMOBILE
//                           : firstAddress?.ADDRESSINSTALLATION.ADDRESSPHONE}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="row mb-7">
//                     <label className={`col-lg-4 text-muted ${styles.label}`}>
//                       สินค้า
//                     </label>
//                     <div className="col-lg-7 col-md-8">
//                       <span className={`${styles.label}`}>
//                         {product[0]?.ItemDescription}
//                       </span>
//                     </div>
//                   </div>

//                   {product[0]?.Package[0]?.PACKAGETITLE && (
//                     <div className="row mb-7">
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         แพ็คเกจ
//                       </label>
//                       <div className="col-7 col-md-8">
//                         <span className={`${styles.label}`}>
//                           {product[0]?.Package[0]?.PACKAGETITLE}
//                         </span>
//                       </div>
//                     </div>
//                   )}

//                   {item?.DISCOUNT[0]?.GIFT && (
//                     <div className="row mb-7">
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         ของแถม
//                       </label>
//                       <div className="col-7 col-md-8">
//                         <span className={`${styles.label}`}>
//                           {item?.DISCOUNT[0]?.GIFT?.GIFTNAME
//                             ? item?.DISCOUNT[0]?.GIFT?.GIFTNAME
//                             : "ไม่มี"}
//                         </span>
//                       </div>
//                     </div>
//                   )}

//                   {product[0]?.Package[0]?.TOTALPRICE && (
//                     <div className="row mb-7">
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         ราคาสินค้า
//                       </label>
//                       <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
//                         <span className={`${styles.label}`}>
//                           {product[0]?.Package[0]?.TOTALPRICE}
//                         </span>
//                         <span className="badge badge-light-success">บาท</span>
//                       </div>
//                     </div>
//                   )}

//                   {item?.DISCOUNT[0]?.TRADEIN?.HASTRADEIN != 0 && (
//                     <div className="row mb-7">
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         เครื่องเทิร์น
//                       </label>
//                       <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
//                         <span className={`${styles.label}`}>
//                           {item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME
//                             ? item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME
//                             : "ไม่มี"}
//                         </span>
//                       </div>
//                     </div>
//                   )}

//                   {item?.DISCOUNT[0]?.DISCOUNTAMOUNT != 0 && (
//                     <div className="row mb-7">
//                       <label className={`col-lg-4 text-muted ${styles.label}`}>
//                         ส่วนลด
//                       </label>
//                       <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
//                         <span className={`${styles.label}`}>
//                           {discountAmount ? discountAmount : "ไม่มี"}
//                         </span>
//                         <span className="badge badge-light-success">บาท</span>
//                       </div>
//                     </div>
//                   )}

//                   <div className="row mb-7">
//                     <label className={`col-lg-4 text-muted ${styles.label}`}>
//                       ราคาสุทธิ
//                     </label>
//                     <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
//                       <span className={`${styles.label}`}>{netPrice}</span>
//                       <span className="badge badge-light-success">บาท</span>
//                     </div>
//                   </div>

//                   {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
//                   {product[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
//                     <>
//                       <div className="row mb-7">
//                         <label
//                           className={`col-lg-4 text-muted ${styles.label}`}
//                         >
//                           งวดที่ 1 ที่ต้องชำระ
//                         </label>
//                         <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
//                           <span className={`${styles.label}`}>
//                             {product[0]?.Package[0]?.PERIODDETAILS[0]
//                               ?.PAYMENTAMOUNT - discountAmount}
//                           </span>
//                           <span className="badge badge-light-success">บาท</span>
//                         </div>
//                       </div>

//                       {product[0]?.Package[0]?.PERIODDETAILS.length > 1 && (
//                         <div className="row mb-7">
//                           <label
//                             className={`col-lg-4 text-muted ${styles.label}`}
//                           >
//                             งวดที่ 2 ถึง{" "}
//                             {product[0]?.Package[0]?.PERIODDETAILS.length}{" "}
//                             ต้องชำระงวดละ
//                           </label>
//                           <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
//                             <span className={`${styles.label}`}>
//                               {
//                                 product[0]?.Package[0]?.PERIODDETAILS[1]
//                                   ?.PAYMENTAMOUNT
//                               }
//                             </span>
//                             <span className="badge badge-light-success">
//                               บาท
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* End Card Body */}
//         </div>

//         <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
//           <button className={`${styles.btnSecondary}`} onClick={handleBack}>
//             ย้อนกลับ
//           </button>
//           <button className={`${styles.btnPrimary}`} onClick={onSubmit}>
//             ถัดไป
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
//           <button className={`${styles.btnSecondary}`} onClick={handleBack}>
//             ย้อนกลับ
//           </button>
//           <button className={`${styles.btnPrimary}`} onClick={onSubmit}>
//             ถัดไป
//           </button>
//         </div>
//       </Content>
//     </>
//   );
// };

// export default CreateFirstBill;






import styles from "@/styles/style.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useMemo, useRef } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from "../../modules/auth/core/Auth";
import { KTIcon } from "../../../_metronic/helpers";
import { v4 as uuidv4 } from "uuid";

import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  useUUIDStore,
  useSaveProductStore,
} from "../../modules/stores/stepsStore";
import { useSaveDiscountStore } from "../../modules/stores/stepsStore";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import dayjs, { Dayjs } from "dayjs";
import DatePicker from "react-datepicker";
import DateTimePicker from "react-datetime-picker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

import { ThreeDot } from "react-loading-indicators";
import { log } from "node:console";

interface ContractState {
  contNo: string;
}

interface ItemProps {
  REFNO: string;
  CONTNO: string;
  EMPID: string;
  TEAMSALE: string;
  SALECODE: string;
  SUPEMPID: string;
  SECEMPID: string;
  STATUS: string;
  PRODUCT: [any];
  CUSTOMERSTATUS: [any];
  DISCOUNT: [any];
  CUSTOMERDETAIL: [any];
  ADDRESS: AddressItem[];
  PDPA: [any];
  CONTRACT: [any];
  IMAGE: [any];
  CHECKERCOMMENT: [any];
  TRANSACTION: [any];
  SCHEDULE: [any];
  PERIODDETAILS: [any];
}

interface AddressCard {
  ADDRESSDISTRICT: string;
  ADDRESSDISTRICTNAME: string;
  ADDRESSMOO: string;
  ADDRESSNUMBER: string;
  ADDRESSPHONE: string;
  ADDRESSPROVINCE: string;
  ADDRESSPROVINCENAME: string;
  ADDRESSROAD: string;
  ADDRESSSOI: string;
  ADDRESSSUBDISTRICT: string;
  ADDRESSSUBDISTRICTNAME: string;
  ADDRESSZIPCODE: string;
  USETHISTAX: string;
}
interface AddressInstallation {
  ADDRESSDISTRICT: string;
  ADDRESSDISTRICTNAME: string;
  ADDRESSMOO: string;
  ADDRESSNUMBER: string;
  ADDRESSPHONE: string;
  ADDRESSPROVINCE: string;
  ADDRESSPROVINCENAME: string;
  ADDRESSROAD: string;
  ADDRESSSOI: string;
  ADDRESSSUBDISTRICT: string;
  ADDRESSSUBDISTRICTNAME: string;
  ADDRESSZIPCODE: string;
  USETHISTAX: string;
}
interface AddressPayment {
  ADDRESSDISTRICT: string;
  ADDRESSDISTRICTNAME: string;
  ADDRESSMOO: string;
  ADDRESSNUMBER: string;
  ADDRESSPHONE: string;
  ADDRESSPROVINCE: string;
  ADDRESSPROVINCENAME: string;
  ADDRESSROAD: string;
  ADDRESSSOI: string;
  ADDRESSSUBDISTRICT: string;
  ADDRESSSUBDISTRICTNAME: string;
  ADDRESSZIPCODE: string;
  USETHISTAX: string;
}

interface AddressTax {
  ADDRESSDISTRICT: string;
  ADDRESSDISTRICTNAME: string;
  ADDRESSMOO: string;
  ADDRESSNUMBER: string;
  ADDRESSPHONE: string;
  ADDRESSPROVINCE: string;
  ADDRESSPROVINCENAME: string;
  ADDRESSROAD: string;
  ADDRESSSOI: string;
  ADDRESSSUBDISTRICT: string;
  ADDRESSSUBDISTRICTNAME: string;
  ADDRESSZIPCODE: string;
  USETHISTAX: string;
}

// ถ้าโครงสร้างในฐานข้อมูลเหมือนตัวอย่างข้างบน
interface AddressItem {
  ADDRESSCARD: AddressCard;
  ADDRESSINSTALLATION: AddressInstallation;
  ADDRESSPAYMENT: AddressPayment;
  ADDRESSTAX: AddressTax;
}

interface LocationState {
  item?: ItemProps;
  from?: string;
}

const CreateFirstBill: React.FC = () => {
  const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO;
  const POST_PAYMENT_TRANSACTION_URL = `${API_URL_GET_ALLCONTRACT}/Payment/UpdatePaymentTransaction`;

  const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
  const GET_QR_PAYMENT_URL = `${API_URL_SALECONNEXT}/GetQRPayment`;

  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || "";
  const EmpName = auth?.data?.[0]?.EmpName || "";
  const TeamSale = auth?.data?.[0]?.TeamSale || "";
  const SaleCode = auth?.data?.[0]?.SaleCode || "";
  const SupEmpId = auth?.data?.[0]?.SupEmp || "";
  const SecEmpId = auth?.data?.[0]?.SecEmp || "";

  const location = useLocation();
  // const item = location.state as ItemProps || [];
  // const from = location.state as ItemProps || [];

  const state = (location.state ?? {}) as LocationState;
  const item = state.item;
  console.log(`item`, item);
  const from = state.from ?? "";

  const refno = item?.REFNO ?? "";
  const product = item?.PRODUCT ?? [];
  const contNo = item?.CONTNO ?? "";
  const customerDetail = item?.CUSTOMERDETAIL ?? [];
  const discountAmount = item?.DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
  console.log(`discountAmount`, discountAmount);
  const transaction = item?.TRANSACTION ?? [];
  // console.log(`transaction`, transaction);

  const addressArray = item?.ADDRESS;
  const firstAddress = addressArray?.[0];
  const secondAddress = addressArray?.[1];
  const thirdAddress = addressArray?.[2];
  const fourthAddress = addressArray?.[3];

  // กดเข้ามาแล้วถ้ามีวันนัดชำระ ให้ติ๊กอยู่ที่ นัดชำระ แล้ววันที่ให้โชวันที่นัดก่อนหน้า
  useEffect(() => {
    if (item?.SCHEDULE && item.SCHEDULE.length > 0) {
      // โหมดนัดชำระ
      handlePayQuickChange(false);
      // แปลงวันจาก SCHEDULE[0].DUEDATE (สมมติเป็น ISO string) ให้เป็น Date
      const due = new Date(item.SCHEDULE[0].DUEDATE);
      setValueCalendarInstall(due);
    }
  }, [item]);

  // อ่านแพ็กเกจ/งวด
  const paymentPeriodDetailId =
    product?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTPERIODDETAILID;
  const paymentPeriodNumber =
    product?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTPERIODNUMBER;
  const periodAmount =
    product?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT ?? 0;

  const paymentAmount =
    (from === "/firstBill/overview"
      ? item?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT
      : product?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT - discountAmount) ?? 0;
  console.log(`paymentAmount`, paymentAmount);

  const totalPrice = Number(product?.[0]?.Package?.[0]?.TOTALPRICE ?? 0);
  const netPrice = totalPrice - discountAmount;

  // ชำระเงินทันที หรือ นัดชำระ
  const [payQuick, setPayQuick] = useState<boolean>(true);
  const [status, setStatus] = useState("PAID");

  // ชำระเต็ม หรือ ชำระบางส่วน / เกินจำนวน
  const [payFullAmount, setPayFullAmount] = useState<boolean>(true);
  const [paySomeAmount, setPaySomeAmount] = useState<number>(0);
  console.log(`จำนวนเงินแบ่งชำระ`, paySomeAmount);
  const [paymentChoice, setPaymentChoice] = useState<string>("FULL");

  const [priceOption, setPriceOption] = useState<string>("CASH");

  // ประเภทการชำระเงิน
  const [paymentChannel, setPaymentChannel] = useState<string>("CASH");

  // const remainingAmount = Math.max(
  //   0,
  //   (product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT || 0) -
  //   discountAmount -
  //   paySomeAmount
  // );

  // ใช้ยอดงวดล่าสุด ถ้ามี TRANSACTION ********สำคัญ
  // const remainingAmount = Math.max(
  //   0,
  //   paymentAmount - discountAmount - paySomeAmount
  // );
  const remainingAmount = Math.max(0, paymentAmount - paySomeAmount);

  const [valueCalendarInstall, setValueCalendarInstall] = useState<Date | null>(
    null
  );

  const dueDate = valueCalendarInstall
    ? dayjs(valueCalendarInstall).format("YYYY-MM-DD")
    : "";

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [qrCodeData, setQrCodeData] = useState<string>("");
  // console.log(`qrCodeData`, qrCodeData);

  const [loadingQR, setLoadingQR] = useState<boolean>(false);

  const paymentId = uuidv4();
  console.log(`paymentId`, paymentId);

  ///////// บังคับกรอกปฏิทิน
  const [dateError, setDateError] = useState<string>("");
  const dueDateRef = useRef<HTMLInputElement>(null);

  // ไม่ให้เลือกย้อนหลัง (เสริมความปลอดภัย)
  const todayStr = dayjs().format("YYYY-MM-DD");

  const getQRPayment = async () => {
    try {
      setLoadingQR(true);

      // ตรงนี้คำนวนยอดที่จะจ่ายก่อน
      // ถ้า PACKAGETYPEID !== 1 → เงินผ่อน (installment) → ใช้ amountToPay
      // ถ้า PACKAGETYPEID === 1 → เงินสด (cash) → ใช้ netPrice
      //   const amountToPay = payFullAmount ? paymentAmount : paySomeAmount;
      //   const isInstallment = product[0]?.Package[0]?.PACKAGETYPEID !== 1;
      //   const qrAmount = isInstallment ? amountToPay : netPrice;

      // คำนวณยอดที่จะจ่าย
      // ถ้าเป็นเงินผ่อน (installment)
      const isInstallment = product[0]?.Package[0]?.PACKAGETYPEID !== 1;

      // ยอดสุทธิหลังหักส่วนลด
      // const netPrice = totalPrice - discountAmount;
      // console.log(`netPrice`, netPrice);

      // เลือกยอดที่จะส่งไปขอ QR
      let qrAmount: number;
      if (!isInstallment) {
        qrAmount = payFullAmount ? paymentAmount : paySomeAmount;
      } else {
        qrAmount = paySomeAmount;
      }

      const formData = new FormData();
      formData.append("RefNo", refno);
      formData.append("Amount", qrAmount.toString());

      //   console.log("refno", refno);
      console.log("สแกน", qrAmount.toString());

      const response = await axios.post(GET_QR_PAYMENT_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // console.log(`response`, response);

      if (response.status === 200 && response.data) {
        setQrCodeData(response.data.data.QrCode || "");
      }
    } catch (error) {
      console.error("Error fetching QR Payment:", error);
    } finally {
      setLoadingQR(false);
    }
  };

  const handlePayQuickChange = (isPayQuick: boolean) => {
    setQrCodeData("");
    setPayQuick(isPayQuick);
    setStatus(isPayQuick ? "PAID" : "SCHEDULE");
    setPaymentChannel(isPayQuick ? "CASH" : "NONE");
    setPaymentChoice(isPayQuick ? (payFullAmount ? "FULL" : "SOME") : "NONE"); // อัปเดต PAYMENTCHOICE
    setDateError("");
  };

  const handlePayFullAmountChange = (value: boolean) => {
    setQrCodeData("");
    setPayFullAmount(value);
    setPaymentChoice(value ? "FULL" : "SOME");

    if (!value) {
      // ถ้าเป็นชำระบางส่วน => สถานะ SCHEDULE
      setStatus("SCHEDULE");
      // บังคับให้เป็นเงินสด
      setPaymentChannel("CASH");
      setPriceOption("CASH");
    } else {
      // ถ้าเป็นชำระเต็มจำนวน => สถานะ PAID
      setStatus("PAID");
      // บังคับให้เป็นเงินสด
      setPaymentChannel("CASH");
      setPriceOption("CASH");
      setDateError("");
    }
  };

  const handleDateChangeInstall = (date: Date | null) => {
    setValueCalendarInstall(date);
  };

  const handlePaymentChannelChange = (channel: string) => {
    setPaymentChannel(channel);

    // ถ้าผู้ใช้เลือก "QR CODE" → call API
    if (channel === "QR CODE") {
      // เช็คยอดที่จะจ่าย
      let amountToPay = 0;
      if (payFullAmount) {
        // ชำระเต็ม → (paymentAmount - discount) สมมติเป็นงวดแรก
        amountToPay = Math.max(0, paymentAmount - discountAmount);
      } else {
        // ชำระบางส่วน → paySomeAmount
        amountToPay = paySomeAmount;
      }

      // call API ขอ QR
      getQRPayment();
    } else {
      // ถ้าเปลี่ยนกลับเป็น 'CASH' ก็เคลียร์ qrCodeData
      setQrCodeData("");
    }
  };

  const handlePriceOptionChange = (option: string) => {
    setPriceOption(option);

    // ถ้าเลือก QR CODE จากชุด priceOption
    if (option === "QR CODE") {
      // ก็ต้องเรียก getQRPayment ด้วย
      // หรือบังคับ paymentChannel เป็น "QR CODE" ไปเลย
      setPaymentChannel("QR CODE");
      getQRPayment();
    } else {
      // ถ้าเป็น "CASH"
      setPaymentChannel("CASH");
      setQrCodeData("");
    }
  };

  // ฟังก์ชัน handleSomeAmountChange (แก้ให้ลบหมด = 0)
  const handleSomeAmountChange = (value: string) => {
    // ล้างค่า QR (ถ้ามี)
    setQrCodeData("");

    // 1) ถ้าผู้ใช้ลบตัวเลขจนเป็น "" หรือ "0" → ให้เป็น 0
    if (!value) {
      setPaySomeAmount(0);
      setErrorMessage("");
      return;
    }
    if (value === "0") {
      setPaySomeAmount(0);
      setErrorMessage("");
      return;
    }

    // 2) จากนั้นตรวจสอบเลข
    const number = Number(value);
    if (isNaN(number) || number < 0) {
      setErrorMessage("กรุณากรอกจำนวนเงินที่ถูกต้อง");
    } else if (number > netPrice) {
      setPaySomeAmount(number);
      setErrorMessage(`ห้ามชำระเกินราคาสุทธิ ${netPrice.toLocaleString()} บาท`);
    } else {
      setPaySomeAmount(number);
      setErrorMessage("");
    }
  };

  const handleSomeAmountBlur = () => {
    // กรณีต้องการให้ยิงเฉพาะตอนเป็น QR CODE
    if (paymentChannel === "QR CODE") {
      getQRPayment();
    }
  };

  const submitPayment = async () => {
    try {
      const response = await axios.post(POST_PAYMENT_TRANSACTION_URL, allData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        // ปักธงว่า REFNO นี้บันทึกแล้ว
        localStorage.setItem(`paymentDone:${refno.toUpperCase().trim()}`, '1');

        Swal.fire({
          icon: "success",
          title: "สำเร็จ!",
          text: "บันทึกธุรกรรมการชำระเงินสำเร็จ",
          timer: 2000,
          showConfirmButton: false,
        });

        // เส้นทางเดิมของคุณ
        navigate("/");

        if (item?.STATUS === "DRAFT" && payQuick) {
          navigate("/firstBill/receipt", { state: item });
        } else if (item?.STATUS === "DRAFT" && !payQuick) {
          navigate("/sale/photo", { state: { data: item, fromStep: "true" } });
        } else {
          navigate("/firstBill/receiptFromCreateFirstBill", { state: item });
        }
      } else {
        Swal.fire("เกิดข้อผิดพลาด", response.data.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้", "error");
    }
  };

  const allData = {
    REFNO: refno,
    EMPID: EmpId,
    EMPNAME: EmpName,
    SALECODE: SaleCode,
    TEAMSALE: TeamSale,
    LATITUDE: localStorage.getItem("latitude") || "",
    LONGITUDE: localStorage.getItem("longitude") || "",
    STATUS: status,
    DUEDATE:
      status === "SCHEDULE"
        ? dueDate
        : paymentChoice === "FULL" ||
          paySomeAmount >= paymentAmount - discountAmount
          ? ""
          : dueDate,
    PAYMENTPERIODDETAILID: paymentPeriodDetailId,
    PAYMENTPERIODNUMBER: paymentPeriodNumber,
    PAYMENTCHANNEL: paymentChannel,
    PAYMENTCHOICE: paymentChoice,
    AMOUNT:
      status === "SCHEDULE" && paymentChoice === "NONE"
        ? paymentAmount - discountAmount
        : paymentChoice === "FULL"
          ? paymentAmount
          : paySomeAmount,
    PERIODAMOUNT: periodAmount - discountAmount,
    DISCOUNT: discountAmount,
    PAYMENTID: paymentId,
  };
  console.log(`allData`, allData);

  const onSubmit = async () => {
    // บังคับเลือกวันที่ในเคสที่ต้องมีวัน
    const mustHaveDueDate = (!payQuick) || (payQuick && !payFullAmount);
    if (mustHaveDueDate && !valueCalendarInstall) {
      setDateError("กรุณาเลือกวันที่");
      dueDateRef.current?.focus();
      return;
    } else {
      setDateError("");
    }

    // ถ้าเลือก "เงินสด" ให้ยืนยันก่อน
    if (paymentChannel === "CASH") {
      const { isConfirmed } = await Swal.fire({
        title: "ต้องการออกใบรับเงินหรือไม่?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
        reverseButtons: true,
      });

      if (!isConfirmed) return; // กดยกเลิก → ไม่ยิง API
    }

    // กรณีอื่น ๆ (เช่น นัดชำระ/ชำระบางส่วน/เลือกช่องทางอื่น) → ยิงตามปกติ
    await submitPayment();
  };

  // const onSubmit = async (data: any) => {
  //   // ตรวจสอบการมี qrCodeData เมื่อเลือกช่องทาง QR CODE
  //   // if (paymentChannel === "QR CODE" && qrCodeData) {
  //   //   Swal.fire("แจ้งเตือน", "กรุณาทำการสแกน qr code ก่อน", "warning");
  //   //   return;
  //   // }

  //   // if (payQuick) {
  //   //   Swal.fire({
  //   //     title: "ยืนยันการออกใบเสร็จ",
  //   //     icon: "warning",
  //   //     showCancelButton: true,
  //   //     confirmButtonText: "ตกลง",
  //   //     cancelButtonText: "ยกเลิก",
  //   //   }).then((result) => {
  //   //     if (result.isConfirmed) {
  //   //       navigate("/firstBill/receipt", { state: item });
  //   //     }
  //   //   });
  //   //   return;
  //   // }

  //   // ต้องมีวันเมื่อ "นัดชำระ" หรือ "ชำระบางส่วน/เกินจำนวน"
  //   const mustHaveDueDate = (!payQuick) || (payQuick && !payFullAmount);

  //   if (mustHaveDueDate && !valueCalendarInstall) {
  //     setDateError("กรุณาเลือกวันที่");
  //     // โฟกัสช่องวันที่ (ตัวใดตัวหนึ่งที่กำลังแสดงอยู่)
  //     dueDateRef.current?.focus();
  //     return; // หยุดก่อน ส่ง API ยังไม่ได้
  //   } else {
  //     setDateError("");
  //   }

  //   try {
  //     const response = await axios.post(POST_PAYMENT_TRANSACTION_URL, allData, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (response.status === 200) {
  //       // ปักธงว่า REFNO นี้บันทึกการชำระ/นัดชำระแล้ว
  //       localStorage.setItem(`paymentDone:${refno.toUpperCase().trim()}`, '1');

  //       Swal.fire({
  //         icon: "success",
  //         title: "สำเร็จ!",
  //         text: "บันทึกธุรกรรมการชำระเงินสำเร็จ",
  //         timer: 2000,
  //         showConfirmButton: false,
  //       });
  //       navigate("/");

  //       // ถ้ามาจาก sale/contract หรือ sale/update/updatecontract
  //       // และสถานะเป็น SCHEDULE (มี DUEDATE)
  //       const saleRoutes = ["/sale/contract", "/sale/update/updatecontract"];
  //       // if (saleRoutes.includes(from) && status === "SCHEDULE" && item?.STATUS === "DRAFT") {
  //       if (item?.STATUS === "DRAFT" && payQuick) {
  //         //   navigate("/sale/photo", { state: { data: item, fromStep: "true" } });
  //         // navigate("/firstBill/receiptmock", { state: item });
  //         navigate("/firstBill/receipt", { state: item });
  //       } if (item?.STATUS === "DRAFT" && !payQuick) {
  //         navigate("/sale/photo", { state: { data: item, fromStep: "true" } });
  //       } if (item?.STATUS !== "DRAFT") {
  //         navigate("/firstBill/receiptFromCreateFirstBill", { state: item });
  //       }
  //     } else {
  //       Swal.fire(
  //         "เกิดข้อผิดพลาด",
  //         response.data.message || "ไม่สามารถบันทึกข้อมูลได้",
  //         "error"
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error saving data:", error);
  //     Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้", "error");
  //   }
  // };

  // const onSubmit = async (data: any) => {
  //     // ตรวจสอบกรณีเลือก QR CODE แต่ยังไม่ได้สแกน
  //     if (paymentChannel === "QR CODE" && qrCodeData) {
  //         Swal.fire("แจ้งเตือน", "กรุณาทำการสแกน qr code ก่อน", "warning");
  //         return;
  //     }

  //     try {
  //         const response = await axios.post(POST_PAYMENT_TRANSACTION_URL, allData, {
  //             headers: { "Content-Type": "application/json" },
  //         });

  //         if (response.status === 200) {
  //             Swal.fire("สำเร็จ", "บันทึกธุรกรรมการชำระเงินสำเร็จ", "success");

  //             // รอสักครู่ให้ SweetAlert แสดงก่อน แล้วค่อย navigate
  //             setTimeout(() => {
  //                 // ถ้ามาจาก sale/contract, updateSalesContract หรือ sale/step
  //                 const saleRoutes = [
  //                     '/sale/contract',
  //                     '/sale/update/UpdateSalesContract',
  //                     '/sale/step',
  //                 ];
  //                 if (saleRoutes.includes(from)) {
  //                     // ไปหน้า photo ต่อ
  //                     navigate('/sale/photo', {
  //                         state: { item, from }
  //                     });
  //                 } else {
  //                     // ปกติไปหน้า overview ของ firstBill
  //                     navigate('/firstBill/overview', { state: item });
  //                 }
  //             }, 500);

  //         } else {
  //             Swal.fire("เกิดข้อผิดพลาด", response.data.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
  //         }

  //     } catch (error) {
  //         console.error("Error saving data:", error);
  //         Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้", "error");
  //     }
  // };

  const handleBack = () => {
    const saleRoutes = [
      "/sale/contract",
      "/sale/update/UpdateSalesContract",
      "/sale/step",
    ];

    if (saleRoutes.includes(from)) {
      navigate("/sale/step", { state: item });
    }

    const saleRoutesEditFinishInDay = ["/sale/editFinishInDay"];

    if (saleRoutesEditFinishInDay.includes(from)) {
      navigate("/sale/editFinishInDay", { state: item });
    } else {
      navigate("/firstBill/overview", { state: item });
    }
  };

  // const FINISH_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetAllContract?status=FINISH&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;
  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const GET_PAYMENT_URL = `${API_URL_MONGO}/Payment/GetPaymentPeriod`;

  const [finish, setFinish] = useState<any[]>([]); // กำหนดให้ state เป็น array เพื่อรองรับ map()
  console.log(`finish`, finish);

  const [isLoadingFinish, setIsLoadingFinish] = useState<boolean>(false);

  const [search, setSearch] = useState<string>(""); // State สำหรับค้นหา

  // Pagination states
  const [entries, setEntries] = useState<number>(10); // Default entries per page
  const [currentPageFinish, setCurrentPageFinish] = useState<number>(1);

  useEffect(() => {
    getDataFinish();
  }, []);

  const getDataFinish = async () => {
    setIsLoadingFinish(true);
    try {
      const response = await axios.get(GET_PAYMENT_URL, {
        params: {
          EMPID: EmpId,
          TEAMSALE: TeamSale,
        },
      });
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setFinish(data);
    } catch (error) {
      console.error("Error fetching GET_PAYMENT_URL:", error);
    } finally {
      setIsLoadingFinish(false);
    }
  };

  const hideNext = paymentChannel === "QR CODE";

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
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
              <li
                className={`breadcrumb-item text-gray-900 font ${styles.titlePage}`}
              >
                การรับชำระเงินงวดแรก
              </li>
            </ul>
          </div>
        </div>
        <span className={`${styles.fontSize}`}>เลขที่ขาย: </span>
        <span className={`${styles.titlePage}`}>{refno}</span>

        <div className="row">
          {/* Card Body */}
          <div className="col-lg-6">
            <div className="accordion mb-10" id="kt_accordion_1">
              <div className="accordion-item mb-10">
                <h2 className="accordion-header" id="kt_accordion_1_header_1">
                  <h3
                    className="accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7"
                    data-bs-toggle="collapse"
                    data-bs-target="#kt_accordion_1_body_1"
                    aria-expanded="true"
                    aria-controls="kt_accordion_1_body_1"
                    style={{
                      color: "white",
                      cursor: "pointer",
                      backgroundColor: "#3777bc",
                    }}
                  >
                    การรับชำระเงินงวดแรก
                  </h3>
                </h2>
                <div
                  id="kt_accordion_1_body_1"
                  className="accordion-collapse collapse show"
                  aria-labelledby="kt_accordion_1_header_1"
                  data-bs-parent="#kt_accordion_1"
                >
                  <div className="accordion-body">
                    <form noValidate className="form">
                      <div className="card-body px-lg-9 px-1">
                        <div className="">
                          <div className="d-flex mb-6">
                            <div className="form-check form-check-inline me-3">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="payQuick"
                                checked={payQuick}
                                onChange={() => handlePayQuickChange(true)}
                              />
                              <label className={`${styles.label} me-2`}>
                                ชำระเงินทันที
                              </label>
                            </div>
                            <div className="form-check form-check-inline me-3">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="payQuick"
                                checked={!payQuick}
                                onChange={() => handlePayQuickChange(false)}
                              />
                              <label className={`${styles.label} me-2`}>
                                นัดชำระ
                              </label>
                            </div>
                          </div>

                          {/* Start ชำระเงินทันที */}
                          {payQuick && (
                            <>
                              <div className="d-flex mb-6 mt-10">
                                <div className="form-check form-check-inline me-3">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="payFullAmount"
                                    checked={payFullAmount}
                                    onChange={() =>
                                      handlePayFullAmountChange(true)
                                    }
                                  />
                                  <label className={`${styles.label} me-2`}>
                                    ชำระเต็มจำนวน
                                  </label>
                                </div>
                                <div className="form-check form-check-inline me-3">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="payFullAmount"
                                    checked={!payFullAmount}
                                    onChange={() =>
                                      handlePayFullAmountChange(false)
                                    }
                                  />
                                  <label className={`${styles.label} me-2`}>
                                    {product[0]?.Package[0]?.PACKAGETYPEID ===
                                      1 ? (
                                      <span>ชำระบางส่วน</span>
                                    ) : (
                                      <span>ชำระบางส่วน / เกินจำนวน</span>
                                    )}
                                  </label>
                                </div>
                              </div>

                              {/* Start ชำระเต็ม */}
                              {payFullAmount && (
                                <>
                                  {product[0].Package.PACKAGETYPEID === 1 ? (
                                    <div className="mb-6">
                                      <label className={`${styles.label} me-2`}>
                                        จำนวนเงินที่ต้องชำระ
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        readOnly
                                        style={{
                                          backgroundColor: "#d7dbde",
                                        }}
                                        // value={paymentAmount - discountAmount}
                                        value={paymentAmount}
                                      // value={transaction[0]?.AMOUNT}
                                      />
                                    </div>
                                  ) : (
                                    <div className="mb-6">
                                      <label className={`${styles.label} me-2`}>
                                        จำนวนเงินที่ต้องชำระ
                                      </label>
                                      <input
                                        type="text"
                                        className={`form-control ${styles.label}`}
                                        readOnly
                                        style={{
                                          backgroundColor: "#d7dbde",
                                        }}
                                        value={paymentAmount}
                                      // value={transaction[0]?.AMOUNT}
                                      />
                                    </div>
                                  )}
                                  <div className="d-flex mb-6 mt-10">
                                    <div className="form-check form-check-inline me-3">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="paymentChannel"
                                        checked={paymentChannel === "CASH"}
                                        onChange={() =>
                                          handlePaymentChannelChange("CASH")
                                        }
                                      />
                                      <label className={`${styles.label} me-2`}>
                                        เงินสด
                                      </label>
                                    </div>
                                    <div className="form-check form-check-inline me-3">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="paymentChannel"
                                        checked={paymentChannel === "QR CODE"}
                                        onChange={() =>
                                          handlePaymentChannelChange("QR CODE")
                                        }
                                      />
                                      <label className={`${styles.label} me-2`}>
                                        QR CODE
                                      </label>
                                    </div>
                                  </div>
                                </>
                              )}
                              {/* End ชำระเต็ม */}

                              {/* Start ชำระบางส่วน / เกินจำนวน */}
                              {!payFullAmount && (
                                <>
                                  {/* {product[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
                                                                        <div className="mb-6">
                                                                            <label className={`${styles.label} me-2`}>ราคาสุทธิ</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                readOnly
                                                                                style={{
                                                                                    backgroundColor: '#d7dbde',
                                                                                }}
                                                                                value={netPrice}
                                                                            />
                                                                        </div>
                                                                    )} */}
                                  <div className="mb-6">
                                    {product[0]?.Package[0]?.PACKAGETYPEID !==
                                      1 ? (
                                      <>
                                        <label
                                          className={`${styles.label} me-2`}
                                        >
                                          จำนวนเงินที่ต้องชำระงวดที่ 1
                                        </label>
                                        <input
                                          type="text"
                                          className={`form-control ${styles.label}`}
                                          readOnly
                                          style={{
                                            backgroundColor: "#d7dbde",
                                          }}
                                          // value={paymentAmount - discountAmount}
                                          value={paymentAmount}
                                        // value={transaction[0]?.AMOUNT}
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <label
                                          className={`${styles.label} me-2`}
                                        >
                                          ราคาสุทธิ
                                        </label>
                                        <input
                                          type="text"
                                          className={`form-control ${styles.label}`}
                                          readOnly
                                          style={{
                                            backgroundColor: "#d7dbde",
                                          }}
                                          value={netPrice}
                                        />
                                      </>
                                    )}
                                  </div>

                                  <div className="mb-6">
                                    {product[0]?.Package[0]?.PACKAGETYPEID !==
                                      1 ? (
                                      <>
                                        <label
                                          className={`${styles.label} me-2`}
                                        >
                                          จำนวนเงินที่แบ่งชำระ
                                        </label>
                                        <input
                                          inputMode="numeric"
                                          pattern="[0-9]*"
                                          type="text"
                                          className={`form-control ${styles.label}`}
                                          onChange={(e) =>
                                            handleSomeAmountChange(
                                              e.target.value
                                            )
                                          }
                                          value={paySomeAmount}
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <label
                                          className={`${styles.label} me-2`}
                                        >
                                          จำนวนเงินที่ชำระ
                                        </label>
                                        <input
                                          type="text"
                                          className={`form-control ${styles.label
                                            } ${errorMessage ? "is-invalid" : ""
                                            }`}
                                          onChange={(e) =>
                                            handleSomeAmountChange(
                                              e.target.value
                                            )
                                          }
                                          onBlur={handleSomeAmountBlur}
                                          value={
                                            paySomeAmount === 0
                                              ? "0"
                                              : paySomeAmount
                                          } // ใช้ "0" เพื่อให้พิมพ์ได้
                                          min="0" // ป้องกันค่าติดลบ
                                          inputMode="numeric"
                                          pattern="[0-9]*"
                                        />
                                        {errorMessage && (
                                          <div className="text-danger mt-1">
                                            {errorMessage}
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                  <div className="mb-6">
                                    <label className={`${styles.label} me-2`}>
                                      จำนวนเงินที่เหลืองวดที่ 1
                                    </label>
                                    <input
                                      type="text"
                                      className={`form-control ${styles.label}`}
                                      readOnly
                                      style={{
                                        backgroundColor: "#d7dbde",
                                      }}
                                      value={
                                        isNaN(remainingAmount)
                                          ? 0
                                          : remainingAmount
                                      }
                                    />
                                  </div>
                                  {/* ถ้าชำระมากกว่าหรือเท่ากับ ไม่ต้องโชว์ */}
                                  {/* {paySomeAmount < transaction[0]?.AMOUNT && ( */}
                                  {/* {paySomeAmount < paymentAmount - discountAmount && (
                                                                        <div className="col-lg-12 mb-6">
                                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <label className={`${styles.label} me-2`}>วันที่สะดวกชำระส่วนที่เหลือ</label>
                                                                                <DatePicker
                                                                                    selected={valueCalendarInstall}
                                                                                    onChange={handleDateChangeInstall}
                                                                                    className="form-control mb-3 mb-lg-0"
                                                                                    showYearDropdown
                                                                                    showMonthDropdown
                                                                                    dropdownMode="select"
                                                                                    isClearable
                                                                                    dateFormat="yyyy/MM/dd"
                                                                                    withPortal
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    )} */}

                                  <div className="col-lg-12 mb-6">
                                    <label className={`${styles.label} mb-2`}>
                                      วันที่สะดวกชำระส่วนที่เหลือ
                                    </label>
                                    <input
                                      type="date"
                                      ref={dueDateRef}
                                      className={`form-control ${styles.label} ${dateError ? "is-invalid" : ""}`}
                                      value={
                                        valueCalendarInstall
                                          ? dayjs(
                                            valueCalendarInstall
                                          ).format("YYYY-MM-DD")
                                          : ""
                                      }
                                      onChange={(e) => {
                                        const v = e.target.value;
                                        setValueCalendarInstall(
                                          v ? new Date(v) : null
                                        );
                                      }}
                                      min={todayStr}
                                      required
                                    />
                                    {dateError && <div className={`invalid-feedback ${styles.label}`}>{dateError}</div>}
                                  </div>

                                  {/* )} */}
                                  <div className="d-flex mb-6 mt-10">
                                    <div className="form-check form-check-inline me-3">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="priceOption"
                                        checked={priceOption === "CASH"}
                                        onChange={() =>
                                          handlePriceOptionChange("CASH")
                                        }
                                      />
                                      <label className={`${styles.label} me-2`}>
                                        เงินสด
                                      </label>
                                    </div>
                                    <div className="form-check form-check-inline me-3">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="priceOption"
                                        checked={priceOption === "QR CODE"}
                                        onChange={() =>
                                          handlePriceOptionChange("QR CODE")
                                        }
                                      />
                                      <label className={`${styles.label} me-2`}>
                                        QR CODE
                                      </label>
                                    </div>
                                  </div>
                                </>
                              )}
                              {/* End ชำระบางส่วน / เกินจำนวน */}
                            </>
                          )}
                          {/* End ชำระเงินทันที */}

                          {/* Start นัดชำระ */}
                          {/* {!payQuick && (
                                                        <div className="col-lg-12 mb-6">
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <label className={`${styles.label} me-2`}>วันที่สะดวกชำระ</label>
                                                                <DatePicker
                                                                    selected={valueCalendarInstall}
                                                                    onChange={handleDateChangeInstall}
                                                                    className="form-control mb-3 mb-lg-0"
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                    isClearable
                                                                    dateFormat="yyyy/MM/dd"
                                                                    withPortal
                                                                />
                                                            </div>
                                                        </div>
                                                    )} */}
                          {!payQuick && (
                            <div className="col-lg-12 mb-6">
                              {/* ไม่ต้องใช้ flex-column แล้ว แค่ label กับ input */}
                              <label className={`${styles.label} mb-2`}>
                                วันที่สะดวกชำระ
                              </label>
                              <input
                                type="date"
                                ref={dueDateRef}
                                className={`form-control ${styles.label} ${dateError ? "is-invalid" : ""}`}
                                value={
                                  valueCalendarInstall
                                    ? dayjs(valueCalendarInstall).format(
                                      "YYYY-MM-DD"
                                    )
                                    : ""
                                }
                                onChange={(e) => {
                                  const dateStr = e.target.value;
                                  // ถ้าเลือกค่าว่าง ให้เป็น null
                                  setValueCalendarInstall(
                                    dateStr ? new Date(dateStr) : null
                                  );
                                }}
                                min={todayStr}
                                required
                              />
                              {dateError && <div className={`invalid-feedback ${styles.label}`}>{dateError}</div>}
                            </div>
                          )}
                          {/* End นัดชำระ*/}

                          <div className="mb-6 mt-10 d-flex justify-content-center">
                            {loadingQR ? (
                              <ThreeDot />
                            ) : qrCodeData ? (
                              <img
                                src={qrCodeData}
                                alt="QR Code"
                                style={{ width: 200, height: 200 }}
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End Card Body */}

          {/* Card Body */}
          <div className="col-lg-6 mb-20">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-5">
                  <label className={`col-lg-4 fw-bold ${styles.label}`}>
                    รายละเอียดสัญญา
                  </label>
                  <button
                    type="button"
                    className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
                  >
                    <KTIcon iconName="category" className="fs-2" />
                  </button>
                </div>

                <div className="">
                  {contNo && (
                    <div className="row mb-7">
                      <label className={`col-lg-4 text-muted ${styles.label}`}>
                        เลขที่สัญญา
                      </label>
                      <label className={`col-lg-4 ${styles.label}`}>
                        <span className={`${styles.label}`}>{contNo}</span>
                      </label>
                    </div>
                  )}

                  <div className="row mb-7">
                    <label className={`col-lg-4 text-muted ${styles.label}`}>
                      ชื่อลูกค้า
                    </label>
                    <div className="col-7 col-md-8">
                      <label className={`col-lg-4 ${styles.label}`}>
                        {customerDetail[0]?.PREFIX[0]?.PREFIXNAME}{" "}
                        {customerDetail[0]?.CUSTOMERNAME}{" "}
                        {customerDetail[0]?.CUSTOMERLASTNAME}
                      </label>
                    </div>
                  </div>

                  {firstAddress?.ADDRESSCARD.ADDRESSPROVINCENAME && (
                    <div className="row mb-7">
                      {/* หัวข้ออยู่ col-lg-4 */}
                      <label className={`col-lg-4 text-muted ${styles.label}`}>
                        ที่อยู่ตามบัตร
                      </label>
                      {/* เนื้อหาอยู่ col-lg-7 */}
                      <div className="col-lg-7 d-flex align-items-center">
                        <span className={`${styles.label} me-2`}>
                          {firstAddress.ADDRESSCARD.ADDRESSNUMBER &&
                            firstAddress.ADDRESSCARD.ADDRESSNUMBER}{" "}
                          {firstAddress.ADDRESSCARD.ADDRESSMOO &&
                            `หมู่ ${firstAddress.ADDRESSCARD.ADDRESSMOO}`}{" "}
                          {firstAddress.ADDRESSCARD.ADDRESSSOI &&
                            `ซอย${firstAddress.ADDRESSCARD.ADDRESSSOI}`}{" "}
                          {firstAddress.ADDRESSCARD.ADDRESSROAD &&
                            `ถนน${firstAddress.ADDRESSCARD.ADDRESSROAD}`}{" "}
                          {firstAddress.ADDRESSCARD.ADDRESSSUBDISTRICTNAME && (
                            <>
                              {firstAddress.ADDRESSCARD.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                                ? "แขวง"
                                : "ตำบล"}
                              {firstAddress.ADDRESSCARD.ADDRESSSUBDISTRICTNAME}
                            </>
                          )}{" "}
                          {firstAddress.ADDRESSCARD.ADDRESSDISTRICTNAME && (
                            <>
                              {firstAddress.ADDRESSCARD.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                                ? "เขต"
                                : "อำเภอ"}
                              {firstAddress.ADDRESSCARD.ADDRESSDISTRICTNAME}
                            </>
                          )}{" "}
                          {firstAddress.ADDRESSCARD.ADDRESSPROVINCENAME &&
                            `จังหวัด${firstAddress.ADDRESSCARD.ADDRESSPROVINCENAME}`}{" "}
                          {firstAddress.ADDRESSCARD.ADDRESSZIPCODE &&
                            firstAddress.ADDRESSCARD.ADDRESSZIPCODE}
                        </span>
                        <FontAwesomeIcon icon={faLocationDot} size="2x" />
                      </div>
                    </div>
                  )}

                  {firstAddress?.ADDRESSINSTALLATION.ADDRESSPROVINCENAME && (
                    <div className="row mb-7">
                      {/* หัวข้ออยู่ col-lg-4 */}
                      <label className={`col-lg-4 text-muted ${styles.label}`}>
                        ที่อยู่ติดตั้ง
                      </label>
                      {/* เนื้อหาอยู่ col-lg-7 */}
                      <div className="col-lg-7 d-flex align-items-center">
                        <span className={`${styles.label} me-2`}>
                          {firstAddress.ADDRESSINSTALLATION.ADDRESSNUMBER}{" "}
                          {firstAddress.ADDRESSINSTALLATION.ADDRESSMOO &&
                            `หมู่ ${firstAddress.ADDRESSINSTALLATION.ADDRESSMOO}`}{" "}
                          {firstAddress.ADDRESSINSTALLATION.ADDRESSSOI &&
                            `ซอย${firstAddress.ADDRESSINSTALLATION.ADDRESSSOI}`}{" "}
                          {firstAddress.ADDRESSINSTALLATION.ADDRESSROAD &&
                            `ถนน${firstAddress.ADDRESSINSTALLATION.ADDRESSROAD}`}{" "}
                          {firstAddress.ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME && (
                            <>
                              {firstAddress.ADDRESSINSTALLATION.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                                ? "แขวง"
                                : "ตำบล"}
                              {firstAddress.ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME}
                            </>
                          )}{" "}
                          {firstAddress.ADDRESSINSTALLATION.ADDRESSDISTRICTNAME && (
                            <>
                              {firstAddress.ADDRESSINSTALLATION.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                                ? "เขต"
                                : "อำเภอ"}
                              {firstAddress.ADDRESSINSTALLATION.ADDRESSDISTRICTNAME}
                            </>
                          )}{" "}
                          {firstAddress.ADDRESSINSTALLATION
                            .ADDRESSPROVINCENAME &&
                            `จังหวัด${firstAddress.ADDRESSINSTALLATION.ADDRESSPROVINCENAME}`}{" "}
                          {firstAddress.ADDRESSINSTALLATION.ADDRESSZIPCODE}
                        </span>
                        <FontAwesomeIcon icon={faLocationDot} size="2x" />
                      </div>
                    </div>
                  )}

                  {firstAddress?.ADDRESSPAYMENT.ADDRESSPROVINCENAME && (
                    <div className="row mb-7">
                      {/* หัวข้ออยู่ col-lg-4 */}
                      <label className={`col-lg-4 text-muted ${styles.label}`}>
                        ที่อยู่เก็บเงิน
                      </label>
                      {/* เนื้อหาอยู่ col-lg-7 */}
                      <div className="col-lg-7 d-flex align-items-center">
                        <span className={`${styles.label} me-2`}>
                          {" "}
                          {firstAddress.ADDRESSPAYMENT.ADDRESSNUMBER &&
                            firstAddress.ADDRESSPAYMENT.ADDRESSNUMBER}{" "}
                          {firstAddress.ADDRESSPAYMENT.ADDRESSMOO &&
                            `หมู่ ${firstAddress.ADDRESSPAYMENT.ADDRESSMOO}`}{" "}
                          {firstAddress.ADDRESSPAYMENT.ADDRESSSOI &&
                            `ซอย${firstAddress.ADDRESSPAYMENT.ADDRESSSOI}`}{" "}
                          {firstAddress.ADDRESSPAYMENT.ADDRESSROAD &&
                            `ถนน${firstAddress.ADDRESSPAYMENT.ADDRESSROAD}`}{" "}
                          {firstAddress.ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME && (
                            <>
                              {firstAddress.ADDRESSPAYMENT.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                                ? "แขวง"
                                : "ตำบล"}
                              {firstAddress.ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME}
                            </>
                          )}{" "}
                          {firstAddress.ADDRESSPAYMENT.ADDRESSDISTRICTNAME && (
                            <>
                              {firstAddress.ADDRESSPAYMENT.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                                ? "เขต"
                                : "อำเภอ"}
                              {firstAddress.ADDRESSPAYMENT.ADDRESSDISTRICTNAME}
                            </>
                          )}{" "}
                          {firstAddress.ADDRESSPAYMENT.ADDRESSPROVINCENAME &&
                            `จังหวัด${firstAddress.ADDRESSPAYMENT.ADDRESSPROVINCENAME}`}{" "}
                          {firstAddress.ADDRESSPAYMENT.ADDRESSZIPCODE &&
                            firstAddress.ADDRESSPAYMENT.ADDRESSZIPCODE}{" "}
                        </span>
                        <FontAwesomeIcon icon={faLocationDot} size="2x" />
                      </div>
                    </div>
                  )}

                  {firstAddress?.ADDRESSTAX.ADDRESSPROVINCENAME && (
                    <div className="row mb-7">
                      {/* หัวข้ออยู่ col-lg-4 */}
                      <label className={`col-lg-4 text-muted ${styles.label}`}>
                        ที่อยู่เสึยภาษี
                      </label>
                      {/* เนื้อหาอยู่ col-lg-7 */}
                      <div className="col-lg-7 d-flex align-items-center">
                        <span className={`${styles.label} me-2`}>
                          {" "}
                          {firstAddress.ADDRESSTAX.ADDRESSNUMBER &&
                            firstAddress.ADDRESSTAX.ADDRESSNUMBER}{" "}
                          {firstAddress.ADDRESSTAX.ADDRESSMOO &&
                            `หมู่ ${firstAddress.ADDRESSTAX.ADDRESSMOO}`}{" "}
                          {firstAddress.ADDRESSTAX.ADDRESSSOI &&
                            `ซอย${firstAddress.ADDRESSTAX.ADDRESSSOI}`}{" "}
                          {firstAddress.ADDRESSTAX.ADDRESSROAD &&
                            `ถนน${firstAddress.ADDRESSTAX.ADDRESSROAD}`}{" "}
                          {firstAddress.ADDRESSTAX.ADDRESSSUBDISTRICTNAME && (
                            <>
                              {firstAddress.ADDRESSTAX.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                                ? "แขวง"
                                : "ตำบล"}
                              {firstAddress.ADDRESSTAX.ADDRESSSUBDISTRICTNAME}
                            </>
                          )}{" "}
                          {firstAddress.ADDRESSTAX.ADDRESSDISTRICTNAME && (
                            <>
                              {firstAddress.ADDRESSTAX.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                                ? "เขต"
                                : "อำเภอ"}
                              {firstAddress.ADDRESSTAX.ADDRESSDISTRICTNAME}
                            </>
                          )}{" "}
                          {firstAddress.ADDRESSTAX.ADDRESSPROVINCENAME &&
                            `จังหวัด${firstAddress.ADDRESSTAX.ADDRESSPROVINCENAME}`}{" "}
                          {firstAddress.ADDRESSTAX.ADDRESSZIPCODE &&
                            firstAddress.ADDRESSTAX.ADDRESSZIPCODE}{" "}
                        </span>
                        <FontAwesomeIcon icon={faLocationDot} size="2x" />
                      </div>
                    </div>
                  )}

                  <div className="row mb-10">
                    <label className={`col-lg-4 text-muted ${styles.label}`}>
                      เบอร์โทรติดต่อ
                    </label>
                    <div className="col-lg-7">
                      <span className={`${styles.label}`}>
                        {customerDetail[0]?.CUSTOMERMOBILE
                          ? customerDetail[0]?.CUSTOMERMOBILE
                          : firstAddress?.ADDRESSINSTALLATION.ADDRESSPHONE}
                      </span>
                    </div>
                  </div>

                  <div className="row mb-7">
                    <label className={`col-lg-4 text-muted ${styles.label}`}>
                      สินค้า
                    </label>
                    <div className="col-lg-7 col-md-8">
                      <span className={`${styles.label}`}>
                        {product[0]?.ItemDescription}
                      </span>
                    </div>
                  </div>

                  {product[0]?.Package[0]?.PACKAGETITLE && (
                    <div className="row mb-7">
                      <label className={`col-lg-4 text-muted ${styles.label}`}>
                        แพ็คเกจ
                      </label>
                      <div className="col-7 col-md-8">
                        <span className={`${styles.label}`}>
                          {product[0]?.Package[0]?.PACKAGETITLE}
                        </span>
                      </div>
                    </div>
                  )}

                  {item?.DISCOUNT[0]?.GIFT && (
                    <div className="row mb-7">
                      <label className={`col-lg-4 text-muted ${styles.label}`}>
                        ของแถม
                      </label>
                      <div className="col-7 col-md-8">
                        <span className={`${styles.label}`}>
                          {item?.DISCOUNT[0]?.GIFT?.GIFTNAME
                            ? item?.DISCOUNT[0]?.GIFT?.GIFTNAME
                            : "ไม่มี"}
                        </span>
                      </div>
                    </div>
                  )}

                  {product[0]?.Package[0]?.TOTALPRICE && (
                    <div className="row mb-7">
                      <label className={`col-lg-4 text-muted ${styles.label}`}>
                        ราคาสินค้า
                      </label>
                      <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
                        <span className={`${styles.label}`}>
                          {product[0]?.Package[0]?.TOTALPRICE}
                        </span>
                        <span className="badge badge-light-success">บาท</span>
                      </div>
                    </div>
                  )}

                  {item?.DISCOUNT[0]?.TRADEIN?.HASTRADEIN != 0 && (
                    <div className="row mb-7">
                      <label className={`col-lg-4 text-muted ${styles.label}`}>
                        เครื่องเทิร์น
                      </label>
                      <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
                        <span className={`${styles.label}`}>
                          {item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME
                            ? item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME
                            : "ไม่มี"}
                        </span>
                      </div>
                    </div>
                  )}

                  {item?.DISCOUNT[0]?.DISCOUNTAMOUNT != 0 && (
                    <div className="row mb-7">
                      <label className={`col-lg-4 text-muted ${styles.label}`}>
                        ส่วนลด
                      </label>
                      <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
                        <span className={`${styles.label}`}>
                          {discountAmount ? discountAmount : "ไม่มี"}
                        </span>
                        <span className="badge badge-light-success">บาท</span>
                      </div>
                    </div>
                  )}

                  <div className="row mb-7">
                    <label className={`col-lg-4 text-muted ${styles.label}`}>
                      ราคาสุทธิ
                    </label>
                    <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
                      <span className={`${styles.label}`}>{netPrice}</span>
                      <span className="badge badge-light-success">บาท</span>
                    </div>
                  </div>

                  {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
                  {product[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
                    <>
                      <div className="row mb-7">
                        <label
                          className={`col-lg-4 text-muted ${styles.label}`}
                        >
                          งวดที่ 1 ที่ต้องชำระ
                        </label>
                        <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
                          <span className={`${styles.label}`}>
                            {product[0]?.Package[0]?.PERIODDETAILS[0]
                              ?.PAYMENTAMOUNT - discountAmount}
                          </span>
                          <span className="badge badge-light-success">บาท</span>
                        </div>
                      </div>

                      {product[0]?.Package[0]?.PERIODDETAILS.length > 1 && (
                        <div className="row mb-7">
                          <label
                            className={`col-lg-4 text-muted ${styles.label}`}
                          >
                            งวดที่ 2 ถึง{" "}
                            {product[0]?.Package[0]?.PERIODDETAILS.length}{" "}
                            ต้องชำระงวดละ
                          </label>
                          <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
                            <span className={`${styles.label}`}>
                              {
                                product[0]?.Package[0]?.PERIODDETAILS[1]
                                  ?.PAYMENTAMOUNT
                              }
                            </span>
                            <span className="badge badge-light-success">
                              บาท
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* End Card Body */}
        </div>

        <div className="d-none d-xl-flex justify-content-end align-items-center mt-5 mb-10">
          {/* <button className={`${styles.btnSecondary}`} onClick={handleBack}>
            ย้อนกลับ
          </button> */}
          {!hideNext && (
            <button className={`${styles.btnPrimary}`} onClick={onSubmit}>
              ถัดไป
            </button>
          )}
        </div>

        {/* ปุ่มในหน้าจอเล็ก */}
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
          {/* <button className={`${styles.btnSecondary}`} onClick={handleBack}>
            ย้อนกลับ
          </button> */}
          {!hideNext && (
            <button className={`${styles.btnPrimary}`} onClick={onSubmit}>
              ถัดไป
            </button>
          )}
        </div>
      </Content>
    </>
  );
};

export default CreateFirstBill;