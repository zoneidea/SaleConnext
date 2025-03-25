import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { Content } from '../../../_metronic/layout/components/content';
import { useAuth } from '../../modules/auth/core/Auth';
import { KTIcon } from '../../../_metronic/helpers'

import { useUUIDStore, useSaveProductStore } from '../../modules/stores/stepsStore';
import { useSaveDiscountStore } from '../../modules/stores/stepsStore';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import dayjs, { Dayjs } from 'dayjs';
import DatePicker from 'react-datepicker';
import DateTimePicker from 'react-datetime-picker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import { ThreeDot } from 'react-loading-indicators'

interface ContractState {
    contNo: string;
}

interface ItemProps {
    REFNO: string,
    CONTNO: string,
    EMPID: string,
    TEAMSALE: string,
    SALECODE: string,
    SUPEMPID: string,
    SECEMPID: string,
    STATUS: string,
    PRODUCT: [any],
    CUSTOMERSTATUS: [any],
    DISCOUNT: [any],
    CUSTOMERDETAIL: [any],
    ADDRESS: [any],
    PDPA: [any],
    CONTRACT: [any],
    IMAGE: [any],
    CHECKERCOMMENT: [any]
    TRANSACTION: [any]
}

const CreateFirstBill: React.FC = () => {
    const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO;
    const POST_PAYMENT_TRANSACTION_URL = `${API_URL_GET_ALLCONTRACT}/Payment/UpdatePaymentTransaction`;

    const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
    const GET_QR_PAYMENT_URL = `${API_URL_SALECONNEXT}/GetQRPayment`;

    const navigate = useNavigate()
    const location = useLocation();
    const MySwal = withReactContent(Swal);

    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const item = location.state as ItemProps || [];
    // console.log(`item`, item);
    const refno = item?.REFNO
    const product = item?.PRODUCT
    const contNo = item?.CONTNO
    const customerDetail = item?.CUSTOMERDETAIL
    const discountAmount = item?.DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
    const transaction = item?.TRANSACTION

    const paymentPeriodDetailId = product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTPERIODDETAILID
    const paymentPeriodNumber = product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTPERIODNUMBER
    const periodAmount = product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT
    const paymentAmount = product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT

    const totalPrice = product[0]?.Package[0]?.TOTALPRICE || 0;
    const netPrice = totalPrice - discountAmount;
    // console.log(`netPrice`, netPrice);

    // ชำระเงินทันที หรือ นัดชำระ
    const [payQuick, setPayQuick] = useState<boolean>(true);
    const [status, setStatus] = useState("PAID");

    // ชำระเต็ม หรือ ชำระบางส่วน / เกินจำนวน
    const [payFullAmount, setPayFullAmount] = useState<boolean>(true);
    const [paySomeAmount, setPaySomeAmount] = useState<number>(0);
    const [paymentChoice, setPaymentChoice] = useState<string>("FULL");

    const [priceOption, setPriceOption] = useState<string>("CASH");

    // ประเภทการชำระเงิน
    const [paymentChannel, setPaymentChannel] = useState<string>("CASH");

    // const remainingAmount = transaction[0]?.AMOUNT - paySomeAmount
    const remainingAmount = Math.max(
        0,
        (product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT || 0) - discountAmount - paySomeAmount
    );

    const [valueCalendarInstall, setValueCalendarInstall] = useState<Date | null>(null);
    const dueDate = dayjs(valueCalendarInstall).format("YYYY-MM-DD");

    const [errorMessage, setErrorMessage] = useState<string>("");

    const [qrCodeData, setQrCodeData] = useState<string>('')
    const [loadingQR, setLoadingQR] = useState<boolean>(false)

    const getQRPayment = async () => {
        try {
            setLoadingQR(true)
            // ถ้า payFullAmount === true → ใช้ paymentAmount
            // ถ้า payFullAmount === false → ใช้ paySomeAmount
            const amountToPay = payFullAmount
                ? paymentAmount
                : paySomeAmount

            console.log('amountToPay', amountToPay)

            const formData = new FormData()
            formData.append('RefNo', refno)                 // เลขที่ขาย
            formData.append('Amount', String(amountToPay))  // แปลงเป็น string

            const response = await axios.post(GET_QR_PAYMENT_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (response.status === 200 && response.data) {
                // สมมติว่า response.data.data.QrCode เป็น URL
                setQrCodeData(response.data.data.QrCode || '')
            }
        } catch (error) {
            console.error('Error fetching QR Payment:', error)
        } finally {
            setLoadingQR(false)
        }
    }

    const handlePayQuickChange = (isPayQuick: boolean) => {
        setQrCodeData('')
        setPayQuick(isPayQuick);
        setStatus(isPayQuick ? "PAID" : "SCHEDULE");;
        setPaymentChannel(isPayQuick ? "CASH" : "NONE");
        setPaymentChoice(isPayQuick ? (payFullAmount ? "FULL" : "SOME") : "NONE"); // อัปเดต PAYMENTCHOICE
    };

    const handlePayFullAmountChange = (value: boolean) => {
        setQrCodeData('')
        setPayFullAmount(value)
        setPaymentChoice(value ? 'FULL' : 'SOME')

        if (!value) {
            // ถ้าเป็นชำระบางส่วน => สถานะ SCHEDULE
            setStatus('SCHEDULE')
            // บังคับให้เป็นเงินสด
            setPaymentChannel('CASH')
            setPriceOption('CASH')     // <<--- เพิ่มบรรทัดนี้ด้วย
        } else {
            // ถ้าเป็นชำระเต็มจำนวน => สถานะ PAID
            setStatus('PAID')
            // บังคับให้เป็นเงินสด
            setPaymentChannel('CASH')
            setPriceOption('CASH')     // <<--- เพิ่มบรรทัดนี้ด้วย
        }
    }

    const handleDateChangeInstall = (date: Date | null) => {
        setValueCalendarInstall(date);
    };

    const handlePaymentChannelChange = (channel: string) => {
        setPaymentChannel(channel)

        // ถ้าผู้ใช้เลือก "QR CODE" → call API
        if (channel === 'QR CODE') {
            // เช็คยอดที่จะจ่าย
            let amountToPay = 0
            if (payFullAmount) {
                // ชำระเต็ม → (paymentAmount - discount) สมมติเป็นงวดแรก
                amountToPay = Math.max(0, paymentAmount - discountAmount)
            } else {
                // ชำระบางส่วน → paySomeAmount
                amountToPay = paySomeAmount
            }

            // call API ขอ QR
            getQRPayment()
        } else {
            // ถ้าเปลี่ยนกลับเป็น 'CASH' ก็เคลียร์ qrCodeData
            setQrCodeData('')
        }
    }

    const handlePriceOptionChange = (option: string) => {
        setPriceOption(option)

        // ถ้าเลือก QR CODE จากชุด priceOption
        if (option === "QR CODE") {
            // ก็ต้องเรียก getQRPayment ด้วย
            // หรือบังคับ paymentChannel เป็น "QR CODE" ไปเลย
            setPaymentChannel("QR CODE")
            getQRPayment()
        } else {
            // ถ้าเป็น "CASH"
            setPaymentChannel("CASH")
            setQrCodeData('')
        }
    }

    // ฟังก์ชัน handleSomeAmountChange (แก้ให้ลบหมด = 0)
    const handleSomeAmountChange = (value: string) => {
        // ล้างค่า QR (ถ้ามี)
        setQrCodeData('')

        // 1) ถ้าผู้ใช้ลบตัวเลขจนเป็น "" หรือ "0" → ให้เป็น 0
        if (!value) {
            setPaySomeAmount(0)
            setErrorMessage('')
            return
        }
        if (value === '0') {
            setPaySomeAmount(0)
            setErrorMessage('')
            return
        }

        // 2) จากนั้นตรวจสอบเลข
        const number = Number(value)
        if (isNaN(number) || number < 0) {
            setErrorMessage("กรุณากรอกจำนวนเงินที่ถูกต้อง")
        } else if (number > netPrice) {
            setPaySomeAmount(number)
            setErrorMessage(`ห้ามชำระเกินราคาสุทธิ ${netPrice.toLocaleString()} บาท`)
        } else {
            setPaySomeAmount(number)
            setErrorMessage('')
        }
    }

    const handleSomeAmountBlur = () => {
        // กรณีต้องการให้ยิงเฉพาะตอนเป็น QR CODE
        if (paymentChannel === 'QR CODE') {
            getQRPayment()
        }
    }

    const allData = {
        REFNO: refno,
        EMPID: EmpId,
        STATUS: status,
        DUEDATE: status === "SCHEDULE"
            ? dueDate
            : (paymentChoice === "FULL" || paySomeAmount >= paymentAmount - discountAmount
                ? ""
                : dueDate),
        PAYMENTPERIODDETAILID: paymentPeriodDetailId,
        PAYMENTPERIODNUMBER: paymentPeriodNumber,
        PAYMENTCHANNEL: paymentChannel,
        PAYMENTCHOICE: paymentChoice,
        AMOUNT: status === "SCHEDULE" && paymentChoice === "NONE"
            ? ""
            : (paymentChoice === "FULL"
                ? paymentAmount - discountAmount
                : paySomeAmount),
        PERIODAMOUNT: periodAmount - discountAmount,
        DISCOUNT: discountAmount
    };

    const onSubmit = async (data: any) => {
        // ตรวจสอบการมี qrCodeData เมื่อเลือกช่องทาง QR CODE
        if (paymentChannel === "QR CODE" && qrCodeData) {
            Swal.fire("แจ้งเตือน", "กรุณาทำการสแกน qr code ก่อน", "warning");
            return;
        }
        // try {
        //     const response = await axios.post(POST_PAYMENT_TRANSACTION_URL, allData, {
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //     });

        //     if (response.status === 200) {
        //         Swal.fire("สำเร็จ", "บันทึกธุรกรรมการชำระเงินสำเร็จ", "success");
        //         navigate("/firstBill/overview");
        //     } else {
        //         Swal.fire("เกิดข้อผิดพลาด", response.data.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
        //     }
        // } catch (error) {
        //     console.error("Error saving data:", error);
        //     Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้", "error");
        // }
    };

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center my-5'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            การรับชำระเงินงวดแรก
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <span className="text-muted text-hover-primary">
                                    ระบบเก็บเงินงวดแรก
                                </span></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">การรับชำระเงินงวดแรก</li>
                        </ul>
                    </div>
                </div>
                <p>เลขที่ขาย: {refno}</p>

                <div className='row'>
                    {/* Card Body */}
                    <div className='col-lg-6'>
                        <div className='accordion mb-10' id='kt_accordion_1'>
                            <div className='accordion-item mb-10'>
                                <h2 className='accordion-header' id='kt_accordion_1_header_1'>
                                    <h3
                                        className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                        data-bs-toggle='collapse'
                                        data-bs-target='#kt_accordion_1_body_1'
                                        aria-expanded='true'
                                        aria-controls='kt_accordion_1_body_1'
                                        style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                                    >
                                        การรับชำระเงินงวดแรก
                                    </h3>
                                </h2>
                                <div
                                    id='kt_accordion_1_body_1'
                                    className='accordion-collapse collapse show'
                                    aria-labelledby='kt_accordion_1_header_1'
                                    data-bs-parent='#kt_accordion_1'
                                >
                                    <div className='accordion-body'>
                                        <form noValidate className='form'>
                                            <div className='card-body px-lg-9 px-1'>

                                                <div className="container">
                                                    <div className="d-flex mb-6">
                                                        <div className="form-check form-check-inline me-3">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="payQuick"
                                                                checked={payQuick}
                                                                onChange={() => handlePayQuickChange(true)}
                                                            />
                                                            <label className="form-label fw-bold fs-6">ชำระเงินทันที</label>
                                                        </div>
                                                        <div className="form-check form-check-inline me-3">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="payQuick"
                                                                checked={!payQuick}
                                                                onChange={() => handlePayQuickChange(false)}
                                                            />
                                                            <label className="form-label fw-bold fs-6">นัดชำระ</label>
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
                                                                        onChange={() => handlePayFullAmountChange(true)}
                                                                    />
                                                                    <label className="form-label fw-bold fs-6">ชำระเต็มจำนวน</label>
                                                                </div>
                                                                <div className="form-check form-check-inline me-3">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="payFullAmount"
                                                                        checked={!payFullAmount}
                                                                        onChange={() => handlePayFullAmountChange(false)}
                                                                    />
                                                                    <label className="form-label fw-bold fs-6">
                                                                        {product[0]?.Package[0]?.PACKAGETYPEID === 1 ? (
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
                                                                            <label className="form-label fw-bold fs-6">จำนวนเงินที่ต้องชำระ</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                readOnly
                                                                                style={{
                                                                                    backgroundColor: '#d7dbde',
                                                                                }}
                                                                                value={paymentAmount}
                                                                            // value={transaction[0]?.AMOUNT}
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="mb-6">
                                                                            <label className="form-label fw-bold fs-6">จำนวนเงินที่ต้องชำระ</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                readOnly
                                                                                style={{
                                                                                    backgroundColor: '#d7dbde',
                                                                                }}
                                                                                value={paymentAmount - discountAmount}
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
                                                                                onChange={() => handlePaymentChannelChange("CASH")}
                                                                            />
                                                                            <label className="form-label fw-bold fs-6">เงินสด</label>
                                                                        </div>
                                                                        <div className="form-check form-check-inline me-3">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name="paymentChannel"
                                                                                checked={paymentChannel === "QR CODE"}
                                                                                onChange={() => handlePaymentChannelChange("QR CODE")}
                                                                            />
                                                                            <label className="form-label fw-bold fs-6">QR CODE</label>
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
                                                                            <label className="form-label fw-bold fs-6">ราคาสุทธิ</label>
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
                                                                        {product[0]?.Package[0]?.PACKAGETYPEID !== 1 ? (
                                                                            <>
                                                                                <label className="form-label fw-bold fs-6">จำนวนเงินที่ต้องชำระงวดที่ 1</label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    readOnly
                                                                                    style={{
                                                                                        backgroundColor: '#d7dbde',
                                                                                    }}
                                                                                    value={paymentAmount - discountAmount}
                                                                                // value={transaction[0]?.AMOUNT}
                                                                                />
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <label className="form-label fw-bold fs-6">ราคาสุทธิ</label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    readOnly
                                                                                    style={{
                                                                                        backgroundColor: '#d7dbde',
                                                                                    }}
                                                                                    value={netPrice}
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </div>

                                                                    <div className="mb-6">
                                                                        {product[0]?.Package[0]?.PACKAGETYPEID !== 1 ? (
                                                                            <>
                                                                                <label className="form-label required fw-bold fs-6">จำนวนเงินที่แบ่งชำระ</label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    onChange={(e) => handleSomeAmountChange(e.target.value)}
                                                                                    value={paySomeAmount}
                                                                                />
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <label className="form-label required fw-bold fs-6">จำนวนเงินที่ชำระ</label>
                                                                                <input
                                                                                    type="text"
                                                                                    className={`form-control ${errorMessage ? "is-invalid" : ""}`}
                                                                                    onChange={(e) => handleSomeAmountChange(e.target.value)}
                                                                                    onBlur={handleSomeAmountBlur}
                                                                                    value={paySomeAmount === 0 ? "0" : paySomeAmount} // ใช้ "0" เพื่อให้พิมพ์ได้
                                                                                    min="0" // ป้องกันค่าติดลบ
                                                                                />
                                                                                {errorMessage && (
                                                                                    <div className="text-danger mt-1">{errorMessage}</div>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <div className="mb-6">
                                                                        <label className="form-label fw-bold fs-6">จำนวนเงินที่เหลืองวดที่ 1</label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            readOnly
                                                                            style={{
                                                                                backgroundColor: '#d7dbde',
                                                                            }}
                                                                            value={isNaN(remainingAmount) ? 0 : remainingAmount}
                                                                        />
                                                                    </div>
                                                                    {/* ถ้าชำระมากกว่าหรือเท่ากับ ไม่ต้องโชว์ */}
                                                                    {/* {paySomeAmount < transaction[0]?.AMOUNT && ( */}
                                                                    {paySomeAmount < paymentAmount - discountAmount && (
                                                                        <div className="col-lg-12 mb-6">
                                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <label className="form-label required fw-bold fs-6">วันที่สะดวกชำระส่วนที่เหลือ</label>
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
                                                                    )}
                                                                    {/* )} */}
                                                                    <div className="d-flex mb-6 mt-10">
                                                                        <div className="form-check form-check-inline me-3">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name="priceOption"
                                                                                checked={priceOption === "CASH"}
                                                                                onChange={() => handlePriceOptionChange("CASH")}
                                                                            />
                                                                            <label className="form-label fw-bold fs-6">เงินสด</label>
                                                                        </div>
                                                                        <div className="form-check form-check-inline me-3">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name="priceOption"
                                                                                checked={priceOption === "QR CODE"}
                                                                                onChange={() => handlePriceOptionChange("QR CODE")}
                                                                            />
                                                                            <label className="form-label fw-bold fs-6">QR CODE</label>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                            {/* End ชำระบางส่วน / เกินจำนวน */}
                                                        </>
                                                    )}
                                                    {/* End ชำระเงินทันที */}

                                                    {/* Start นัดชำระ */}
                                                    {!payQuick && (
                                                        <div className="col-lg-12 mb-6">
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <label className="form-label required fw-bold fs-6">วันที่สะดวกชำระ</label>
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
                                                    )}
                                                    {/* End นัดชำระ*/}

                                                    <div className='mb-6 mt-10 d-flex justify-content-center'>
                                                        {loadingQR ? (
                                                            <ThreeDot />
                                                        ) : qrCodeData ? (
                                                            <img
                                                                src={qrCodeData}
                                                                alt='QR Code'
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
                    <div className='col-lg-6'>
                        <div className='card'>
                            <div className='card-body'>
                                <div className='d-flex justify-content-between mb-5'>
                                    <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                                        รายละเอียดสัญญา
                                    </h1>
                                    <button
                                        type='button'
                                        className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                                    >
                                        <KTIcon iconName='category' className='fs-2' />
                                    </button>
                                </div>

                                <div className='container'>
                                    <div className='row mb-7'>
                                        <label className='col-5 col-md-4 fw-bold text-muted'>เลขที่สัญญา</label>
                                        <div className='col-7 col-md-8'>
                                            <span className='fw-bold fs-6'>{contNo}</span>
                                        </div>
                                    </div>

                                    <div className='row mb-7'>
                                        <label className='col-5 col-md-4 fw-bold text-muted'>ชื่อลูกค้า</label>
                                        <div className='col-7 col-md-8'>
                                            <a href='#' className='fw-bold fs-6 text-gray-900 text-hover-primary'>
                                                {customerDetail[0]?.CUSTOMERNAME}
                                            </a>
                                        </div>
                                    </div>

                                    <div className='row mb-7'>
                                        <label className='col-5 col-md-4 fw-bold text-muted'>เบอร์โทรติดต่อ</label>
                                        <div className='col-7 col-md-8'>
                                            <span className='fw-bold fs-6'>{customerDetail[0]?.CUSTOMERMOBILE}</span>
                                        </div>
                                    </div>

                                    <div className='row mb-7'>
                                        <label className='col-5 col-md-4 fw-bold text-muted'>สินค้า</label>
                                        <div className='col-7 col-md-8'>
                                            <span className='fw-bold fs-6'>{product[0]?.ItemDescription}</span>
                                        </div>
                                    </div>

                                    {product[0]?.Package[0]?.PACKAGETITLE && (
                                        <div className='row mb-7'>
                                            <label className='col-5 col-md-4 fw-bold text-muted'>แพ็คเกจ</label>
                                            <div className='col-7 col-md-8'>
                                                <span className='fw-bold fs-6'>{product[0]?.Package[0]?.PACKAGETITLE}</span>
                                            </div>
                                        </div>
                                    )}

                                    {item?.DISCOUNT[0]?.GIFT && (
                                        <div className='row mb-7'>
                                            <label className='col-5 col-md-4 fw-bold text-muted'>ของแถม</label>
                                            <div className='col-7 col-md-8'>
                                                <span className='fw-bold fs-6'>
                                                    {item?.DISCOUNT[0]?.GIFT?.GIFTNAME ? item?.DISCOUNT[0]?.GIFT?.GIFTNAME : "ไม่มี"}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {product[0]?.Package[0]?.TOTALPRICE && (
                                        <div className='row mb-7'>
                                            <label className='col-5 col-md-4 fw-bold text-muted'>ราคาสินค้า</label>
                                            <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
                                                <span className='fw-bold fs-6'>{product[0]?.Package[0]?.TOTALPRICE}</span>
                                                <span className='badge badge-light-success'>บาท</span>
                                            </div>
                                        </div>
                                    )}

                                    {item?.DISCOUNT[0]?.TRADEIN?.HASTRADEIN != 0 && (
                                        <div className='row mb-7'>
                                            <label className='col-5 col-md-4 fw-bold text-muted'>เครื่องเทิร์น</label>
                                            <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
                                                <span className='fw-bold fs-6'>
                                                    {item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME ? item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME : "ไม่มี"}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {item?.DISCOUNT[0]?.DISCOUNTAMOUNT != 0 && (
                                        <div className='row mb-7'>
                                            <label className='col-5 col-md-4 fw-bold text-muted'>ส่วนลด</label>
                                            <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
                                                <span className='fw-bold fs-6'>
                                                    {discountAmount ? discountAmount : "ไม่มี"}
                                                </span>
                                                <span className='badge badge-light-success'>บาท</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className='row mb-7'>
                                        <label className='col-5 col-md-4 fw-bold text-muted'>ราคาสุทธิ</label>
                                        <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
                                            <span className='fw-bold fs-6'>{netPrice}</span>
                                            <span className='badge badge-light-success'>บาท</span>
                                        </div>
                                    </div>

                                    {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
                                    {product[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
                                        <>
                                            <div className='row mb-7'>
                                                <label className='col-5 col-md-4 fw-bold text-muted'>งวดที่ 1 ที่ต้องชำระ</label>
                                                <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
                                                    <span className='fw-bold fs-6'>{product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT - discountAmount}</span>
                                                    <span className='badge badge-light-success'>บาท</span>
                                                </div>
                                            </div>

                                            {product[0]?.Package[0]?.PERIODDETAILS.length > 1 && (
                                                <div className='row mb-7'>
                                                    <label className='col-5 col-md-4 fw-bold text-muted'>งวดที่ 2 ถึง {product[0]?.Package[0]?.PERIODDETAILS.length} ต้องชำระงวดละ</label>
                                                    <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
                                                        <span className='fw-bold fs-6'>{product[0]?.Package[0]?.PERIODDETAILS[1]?.PAYMENTAMOUNT}</span>
                                                        <span className='badge badge-light-success'>บาท</span>
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

                </div >

                <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
                    <button
                        className='btn btn-secondary w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px'
                        onClick={() => navigate('/firstBill/overview', { state: item })}
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        className='btn btn-primary w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px'
                        onClick={onSubmit}
                    >
                        บันทึก
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
                    <button
                        className="btn btn-secondary w-auto me-2"
                        onClick={() => navigate('/firstBill/overview', { state: item })}
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        className="btn btn-primary w-auto me-2"
                        onClick={onSubmit}
                    >
                        บันทึก
                    </button>
                </div>

            </Content >
        </>
    )
}

export default CreateFirstBill;