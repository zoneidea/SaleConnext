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
    paymentData?: any;
    from?: string;
}

const SalesCreateFirstBill: React.FC = () => {
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
    // console.log(`item`, item);
    const from = state.from ?? "";
    const paymentData = state.paymentData;

    const refno = item?.REFNO ?? "";
    const product = item?.PRODUCT ?? [];
    const contNo = item?.CONTNO ?? "";
    const customerDetail = item?.CUSTOMERDETAIL ?? [];
    const discountAmount = item?.DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
    // console.log(`discountAmount`, discountAmount);
    const transaction = item?.TRANSACTION ?? [];
    // console.log(`transaction`, transaction);

    const addressArray = item?.ADDRESS;
    const firstAddress = addressArray?.[0];
    const secondAddress = addressArray?.[1];
    const thirdAddress = addressArray?.[2];
    const fourthAddress = addressArray?.[3];

    const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO;
    const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;

    const POST_PAYMENT_TRANSACTION_URL = `${API_URL_GET_ALLCONTRACT}/Payment/UpdatePaymentTransaction`;

    const GET_QR_PAYMENT_URL = `${API_URL_SALECONNEXT}/GetQRPayment`;

    const getCheckPaidUrl = (ref: string, amount: number) =>
        `${API_URL_SALECONNEXT}/GetQRPayment/CheckPaidQR?RefNo=${encodeURIComponent(ref)}&Amount=${encodeURIComponent(amount)}`

    const UPDATE_APPOINTMENT = `${API_URL_SALECONNEXT}/GetListFirstPayments/UpdateAppointment`;

    useEffect(() => {
        const appointmentDate =
            item?.SCHEDULE?.[0]?.DUEDATE ||
            paymentData?.SCHEDULE?.[0]?.DUEDATE ||
            paymentData?.firstDueDate ||
            paymentData?.PAYMENTAPPOINTMENTDATE ||
            paymentData?.DUEDATE ||
            paymentData?.Appointdate ||
            "";

        if (appointmentDate) {
            handlePayQuickChange(false);

            const due = new Date(appointmentDate);
            if (!isNaN(due.getTime())) {
                setValueCalendarInstall(due);
            }
        }
    }, [item, paymentData]);

    // อ่านแพ็กเกจ/งวด
    const paymentPeriodDetailId =
        product?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTPERIODDETAILID;
    const paymentPeriodNumber =
        product?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTPERIODNUMBER;
    const periodAmount =
        product?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT ?? 0;

    const paymentAmount = product?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT - discountAmount;
    // console.log(`paymentAmount`, paymentAmount);

    const totalPrice = Number(product?.[0]?.Package?.[0]?.TOTALPRICE ?? 0);
    const netPrice = totalPrice - discountAmount;

    // default เมื่อเข้าหน้านี้ = นัดชำระ
    const [payQuick, setPayQuick] = useState<boolean>(false)
    const [status, setStatus] = useState<"PAID" | "SCHEDULE">("SCHEDULE")
    const [paymentChannel, setPaymentChannel] = useState<string>("NONE")
    const [paymentChoice, setPaymentChoice] = useState<string>("NONE")

    // ชำระเงินทันที หรือ นัดชำระ
    // const [payQuick, setPayQuick] = useState<boolean>(true);
    // const [status, setStatus] = useState("PAID");

    // ชำระเต็ม หรือ ชำระบางส่วน / เกินจำนวน
    const [payFullAmount, setPayFullAmount] = useState<boolean>(true);
    const [paySomeAmount, setPaySomeAmount] = useState<number>(0);
    // const [paymentChoice, setPaymentChoice] = useState<string>("FULL");
    const [priceOption, setPriceOption] = useState<string>("CASH");

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
    // console.log(`paymentId`, paymentId);

    ///////// บังคับกรอกปฏิทิน
    const [dateError, setDateError] = useState<string>("");
    const dueDateRef = useRef<HTMLInputElement>(null);

    // ไม่ให้เลือกย้อนหลัง (เสริมความปลอดภัย)
    const todayStr = dayjs().format("YYYY-MM-DD");

    const getAmountForQR = () => (payFullAmount ? paymentAmount : paySomeAmount);

    const getQRPayment = async () => {
        try {
            setLoadingQR(true);

            const qrAmount = getAmountForQR();
            if (!qrAmount || qrAmount <= 0) {
                setLoadingQR(false);
                Swal.fire("แจ้งเตือน", "กรุณาระบุจำนวนเงินให้ถูกต้องก่อนออก QR", "warning");
                return;
            }

            const formData = new FormData();
            formData.append("RefNo", refno);
            formData.append("Amount", qrAmount.toFixed(2)); // ส่งเป็น 2 ตำแหน่ง

            const response = await axios.post(GET_QR_PAYMENT_URL, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

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
        if (channel === "QR CODE") {
            getQRPayment();      // ✅ ใช้ยอดจาก getAmountForQR()
        } else {
            setQrCodeData("");
        }
    };

    const handlePriceOptionChange = (option: string) => {
        setPriceOption(option);
        if (option === "QR CODE") {
            setPaymentChannel("QR CODE");
            getQRPayment();      // ✅ เช่นกัน
        } else {
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
            //ถ้าเป็นโหมดนัดชำระ ให้ส่งนัดหมายเข้า UPDATE_APPOINTMENT ก่อน
            if (status === "SCHEDULE") {
                if (!dueDate) {
                    Swal.fire("แจ้งเตือน", "กรุณาเลือกวันที่นัดชำระ", "warning");
                    return;
                }

                const appointmentPayload = {
                    RefNo: refno,
                    EmpId: EmpId,
                    TeamSale: TeamSale,
                    Appointdate: dueDate,
                };

                const appRes = await axios.post(UPDATE_APPOINTMENT, appointmentPayload, {
                    headers: { "Content-Type": "application/json" },
                });

                // ถ้า API ฝั่งนัดชำระไม่โอเค ให้หยุดไว้ก่อน
                if (appRes.status !== 200) {
                    Swal.fire("เกิดข้อผิดพลาด", "บันทึกวันนัดชำระไม่สำเร็จ", "error");
                    return;
                }
            }

            // จากนั้นบันทึกธุรกรรมการชำระ/นัดชำระตามเดิม
            const response = await axios.post(POST_PAYMENT_TRANSACTION_URL, allData, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                localStorage.setItem(`paymentDone:${refno.toUpperCase().trim()}`, "1");

                if (status === "SCHEDULE" && dueDate) {
                    localStorage.setItem(
                        `paymentSchedule:${refno.toUpperCase().trim()}`,
                        dueDate
                    );
                }

                await Swal.fire({
                    icon: "success",
                    title: "สำเร็จ!",
                    text: "บันทึกธุรกรรมการชำระเงินสำเร็จ",
                    timer: 1500,
                    showConfirmButton: false,
                });

                if (status === "SCHEDULE" || !payQuick) {
                    navigate("/sale/photo", {
                        state: {
                            fromStep: true,
                            data: item,
                            from: "/sale/salesCreateFirstBill",
                        },
                    });
                    return;
                }

                navigate("/sale/salesReceiptFirstBill", { state: item });
            } else {
                Swal.fire("เกิดข้อผิดพลาด", response.data?.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
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
    // console.log(`allData`, allData);

    //// หากกดถัดไป บันทึกลง localstorage
    const saveNextClick = () => {
        try {
            const payload = {
                ...allData,
                clicked: 'next',
                at: new Date().toISOString(),
                actor: { EmpId, EmpName, TeamSale, SaleCode },
            };
            localStorage.setItem(`firstBill:next:${refno.toUpperCase().trim()}`, JSON.stringify(payload));
        } catch (e) {
            // กัน error localStorage เต็ม/โหมด private
            console.error('localStorage save error:', e);
        }
    };

    const onSubmit = async () => {
        saveNextClick();

        const mustHaveDueDate = !payQuick || (payQuick && !payFullAmount);

        if (mustHaveDueDate && !valueCalendarInstall) {
            setDateError("กรุณาเลือกวันที่");
            dueDateRef.current?.focus();
            return;
        } else {
            setDateError("");
        }

        if (payQuick && paymentChannel === "CASH") {
            const { isConfirmed } = await Swal.fire({
                title: "ต้องการออกใบรับเงินหรือไม่?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "ตกลง",
                cancelButtonText: "ยกเลิก",
                reverseButtons: true,
            });

            if (!isConfirmed) return;
        }

        await submitPayment();
    };

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const GET_PAYMENT_URL = `${API_URL_MONGO}/Payment/GetPaymentPeriod`;

    const [finish, setFinish] = useState<any[]>([]); // กำหนดให้ state เป็น array เพื่อรองรับ map()
    // console.log(`finish`, finish);

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
                    ProcessType: auth.processtype
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

    /////////////////////////////////////////
    ////// นับเวลา qr ให้มีอายุ 3 นาที
    const COUNTDOWN_SECS = 180

    const [secondsLeft, setSecondsLeft] = useState<number>(COUNTDOWN_SECS)

    const paidBaselineCountRef = useRef<number | null>(null)
    const hasRedirectedRef = useRef(false)
    const countdownIdRef = useRef<number | null>(null)
    const secondsLeftRef = useRef<number>(0)

    // sync ค่า countdown เข้ากับ ref เสมอ
    useEffect(() => {
        secondsLeftRef.current = secondsLeft
    }, [secondsLeft])

    // ช่วยคำนวณ amount ที่ใช้เช็ค
    const getAmountToCheck = () =>
        (payFullAmount ? paymentAmount : (paySomeAmount || 0))

    // แปลง response เป็นจำนวนเรคคอร์ดที่ “จ่ายสำเร็จ”
    const parsePaidCount = (res: any): number => {
        const d = res?.data
        if (Array.isArray(d?.data)) return d.data.length
        if (typeof d?.count === 'number') return d.count
        // กรณี API ให้แค่ boolean
        if (d?.status === true || d?.Status === true || d?.data === true) return 1
        return 0
    }

    // ===== แก้ effect นับถอยหลัง ให้เก็บ id ไว้ใน ref =====
    useEffect(() => {
        if (!qrCodeData || loadingQR || paymentChannel !== "QR CODE") return

        hasRedirectedRef.current = false
        setSecondsLeft(COUNTDOWN_SECS)

        // เคานต์ดาวน์
        if (countdownIdRef.current) clearInterval(countdownIdRef.current)
        const id = window.setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    if (countdownIdRef.current) clearInterval(countdownIdRef.current)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        countdownIdRef.current = id

            // ==== เก็บ baseline ของรอบนี้ ====
            ; (async () => {
                try {
                    const amount = getAmountToCheck()
                    if (amount <= 0) { paidBaselineCountRef.current = 0; return }
                    const url = getCheckPaidUrl(refno, amount)
                    const res = await axios.get(url)
                    paidBaselineCountRef.current = parsePaidCount(res)
                    // console.log('baseline count =', paidBaselineCountRef.current)
                } catch {
                    // ถ้าพลาด ให้ถือว่า 0 เพื่อรอจำนวนเพิ่ม
                    paidBaselineCountRef.current = 0
                }
            })()

        return () => {
            if (countdownIdRef.current) clearInterval(countdownIdRef.current)
        }
        // amount เปลี่ยน → รีคอมพิวต์ baseline
    }, [qrCodeData, loadingQR, paymentChannel, payFullAmount, paySomeAmount, paymentAmount, refno])

    ///// ยิงเช็คสถานะว่าจ่ายรึยังทุก 3 วิ
    useEffect(() => {
        if (paymentChannel !== "QR CODE") return
        if (!qrCodeData || loadingQR) return

        let stopped = false
        let tm: number

        const tick = async () => {
            if (stopped) return
            if (secondsLeftRef.current <= 0) return

            try {
                const amount = getAmountToCheck()
                if (amount > 0) {
                    const url = getCheckPaidUrl(refno, amount)
                    const res = await axios.get(url)

                    const currentCount = parsePaidCount(res)
                    const baseline = paidBaselineCountRef.current ?? 0
                    const isNewPayment = currentCount > baseline
                    // console.log({ currentCount, baseline, isNewPayment })

                    if (isNewPayment && !hasRedirectedRef.current) {
                        hasRedirectedRef.current = true
                        // อัปเดต baseline กันเด้งซ้ำ
                        paidBaselineCountRef.current = currentCount
                        if (countdownIdRef.current) clearInterval(countdownIdRef.current)
                        setQrCodeData("")
                        paidBaselineCountRef.current = null
                        localStorage.setItem(`paymentDone:${refno.toUpperCase().trim()}`, "1")
                        navigate("/sale/salesReceiptFirstBill", { state: item })
                        return
                    }
                }
            } catch (e) {
                console.error("Error CHECK_PAID_QR_PAYMENT:", e)
            }

            tm = window.setTimeout(tick, 3000)
        }

        // ยิงทันทีรอบแรก
        tm = window.setTimeout(tick, 0)

        return () => {
            stopped = true
            clearTimeout(tm)
        }
    }, [
        paymentChannel,
        qrCodeData,
        loadingQR,
        payFullAmount,
        paySomeAmount,
        paymentAmount,
        refno,
        navigate,
        item,
    ])

    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
    const ss = String(secondsLeft % 60).padStart(2, '0')

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
                                                                                    value={paymentAmount}
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
                                                                                    }
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
                                                            <>
                                                                <div className="d-flex flex-column align-items-center">
                                                                    <img
                                                                        src={qrCodeData}
                                                                        alt="QR Code"
                                                                        style={{ width: 200, height: 200 }}
                                                                    />
                                                                    <div className="mt-3">
                                                                        <span className={`${styles.fontSize}`}>ชำระเงินภายใน: {mm}:{ss}</span>
                                                                    </div>
                                                                </div>
                                                            </>
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

                <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
                    <button className={`${styles.btnSecondary}`} onClick={() => navigate("/sale/overview")}>
                        กลับหน้าแรก
                    </button>
                    {!hideNext && (
                        <button className={`${styles.btnPrimary}`} onClick={onSubmit}>
                            ถัดไป
                        </button>
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
                    <button className={`${styles.btnSecondary}`} onClick={() => navigate("/sale/overview")}>
                        กลับหน้าแรก
                    </button>
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

export default SalesCreateFirstBill;