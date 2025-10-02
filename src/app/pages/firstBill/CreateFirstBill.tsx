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
    SALEPAYMENTPERIODID: string;
    CONTNO: string;
    EFFDATE: string;
    MODE: number;
    SALES: number;
    TRADEINDISCOUNT: number;
    TOTALPRICE: number;
    SALETEAMCODE: string;
    CUSTOMERNAME: string;
    ADDRESSSTRING: string;
    TEL1: string;
    TEL2: string;
    TELOFFICE: string;
    PRODUCTNAME: string;
    PACKAGETITLE: string;
    PACKAGETYPEID: number;
    PACKAGETYPENAME: string;
    PAYMENTPERIODNUMBER: number;
    FIRSTTPERIOD: number;
    NEXTPERIOD: number;
    AMOUNTPAID: number;
    BALANCESOFPERIOD: number;
    SERIALNUMBER: string;
    ORGANIZATIONCODE: string;
    ORGANIZATIONNAME: string;
    PAYMENTAPPOINTMENTDATE: string;
    LATITUDE: string | null;
    LONGITUDE: string | null;
}

interface LocationState {
    item?: ItemProps;
    from?: string;
}

const CreateFirstBill: React.FC = () => {
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
    const state = (location.state ?? {}) as LocationState;

    // ⭐ เก็บใน state ภายในหน้า
    const [item, setItem] = useState<ItemProps | undefined>(state.item);
    const from = state.from ?? "";

    const refno = String(item?.REFNO);
    const contNo = item?.CONTNO;
    const mode = item?.MODE;
    const latitude = item?.LATITUDE;
    const longitude = item?.LONGITUDE;
    const customerName = item?.CUSTOMERNAME;
    const addressString = item?.ADDRESSSTRING;
    const productName = item?.PRODUCTNAME;
    const packageTitle = item?.PACKAGETITLE;
    const tel1 = item?.TEL1;
    const tel2 = item?.TEL2;
    const telOffice = item?.TELOFFICE;

    const sales = item?.SALES;
    const tradeInDiscount = Number(item?.TRADEINDISCOUNT ?? 0);
    const totalPrice = Number(item?.TOTALPRICE ?? 0);

    const isCash = item?.PACKAGETYPEID === 1;
    const firstPeriod = Number(item?.FIRSTTPERIOD ?? 0);
    const nextPeriod = Number(item?.NEXTPERIOD ?? 0);
    const balanceOfPeriod = Number(item?.BALANCESOFPERIOD ?? 0);
    const netPrice = totalPrice - tradeInDiscount;

    // หน้าจอนี้คือ "รับงวดแรก" → ยอดที่จะเก็บแบบเต็มงวด
    const paymentAmount = isCash ? netPrice : firstPeriod;

    const salePaymentPeriodID = item?.SALEPAYMENTPERIODID;
    const paymentPeriodNumber = item?.PAYMENTPERIODNUMBER;
    const packageTypeID = item?.PACKAGETYPEID;

    // กดเข้ามาแล้วถ้ามีวันนัดชำระ ให้ติ๊กอยู่ที่ นัดชำระ แล้ววันที่ให้โชวันที่นัดก่อนหน้า
    useEffect(() => {
        if (item?.PAYMENTAPPOINTMENTDATE && item.PAYMENTAPPOINTMENTDATE.length > 0) {
            // โหมดนัดชำระ
            handlePayQuickChange(false);
            // แปลงวันจาก SCHEDULE[0].DUEDATE (สมมติเป็น ISO string) ให้เป็น Date
            const due = new Date(item.PAYMENTAPPOINTMENTDATE);
            setValueCalendarInstall(due);
        }
    }, [item]);

    // ชำระเงินทันที หรือ นัดชำระ
    const [payQuick, setPayQuick] = useState<boolean>(true);
    const [status, setStatus] = useState("PAID");

    // ชำระเต็ม หรือ ชำระบางส่วน / เกินจำนวน
    const [payFullAmount, setPayFullAmount] = useState<boolean>(true);
    const [paySomeAmount, setPaySomeAmount] = useState<number>(0);
    // console.log(`จำนวนเงินแบ่งชำระ`, paySomeAmount);
    const [paymentChoice, setPaymentChoice] = useState<string>("FULL");

    const [priceOption, setPriceOption] = useState<string>("CASH");

    // ประเภทการชำระเงิน
    const [paymentChannel, setPaymentChannel] = useState<string>("CASH");

    const remainingAmount = Math.max(0, balanceOfPeriod - paySomeAmount);

    const [valueCalendarInstall, setValueCalendarInstall] = useState<Date | null>(
        null
    );

    const dueDate = valueCalendarInstall
        ? dayjs(valueCalendarInstall).format("YYYY-MM-DD")
        : "";

    const [errorMessage, setErrorMessage] = useState<string>("");

    const [qrCodeData, setQrCodeData] = useState<string>("");

    const [loadingQR, setLoadingQR] = useState<boolean>(false);

    const paymentId = uuidv4();

    ///////// บังคับกรอกปฏิทิน
    const [dateError, setDateError] = useState<string>("");
    const dueDateRef = useRef<HTMLInputElement>(null);

    // ไม่ให้เลือกย้อนหลัง (เสริมความปลอดภัย)
    const todayStr = dayjs().format("YYYY-MM-DD");

    const getAmountForQR = () => (payFullAmount ? balanceOfPeriod : paySomeAmount);

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
            // ชำระบางส่วนแบบ “ทันที” ให้ถือว่าเป็นการจ่ายแล้ว
            setStatus("PAID");
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

    // const submitPayment = async () => {
    //     try {
    //         // ถ้าเป็นโหมดนัดชำระ ให้ส่งนัดหมายเข้า UPDATE_APPOINTMENT ก่อน
    //         if (status === "SCHEDULE") {
    //             if (!dueDate) {
    //                 Swal.fire("แจ้งเตือน", "กรุณาเลือกวันที่นัดชำระ", "warning");
    //                 return;
    //             }

    //             const appointmentPayload = {
    //                 RefNo: refno,
    //                 EmpId: EmpId,
    //                 TeamSale: TeamSale,
    //                 SalePaymentPeriodID: salePaymentPeriodID,
    //                 Appointdate: dueDate,
    //             };

    //             const appRes = await axios.post(UPDATE_APPOINTMENT, appointmentPayload, {
    //                 headers: { "Content-Type": "application/json" },
    //             });

    //             // ถ้า API ฝั่งนัดชำระไม่โอเค ให้หยุดไว้ก่อน
    //             if (appRes.status !== 200) {
    //                 Swal.fire("เกิดข้อผิดพลาด", "บันทึกวันนัดชำระไม่สำเร็จ", "error");
    //                 return;
    //             }
    //         }

    //         // จากนั้นบันทึกธุรกรรมการชำระ/นัดชำระตามเดิม
    //         const response = await axios.post(POST_PAYMENT_TRANSACTION_URL, allData, {
    //             headers: { "Content-Type": "application/json" },
    //         });

    //         if (response.status === 200) {
    //             Swal.fire({
    //                 icon: "success",
    //                 title: "สำเร็จ!",
    //                 text: "บันทึกธุรกรรมการชำระเงินสำเร็จ",
    //                 timer: 2000,
    //                 showConfirmButton: false,
    //             });

    //             if (status === "SCHEDULE") {
    //                 navigate("/firstBill/overview", { state: item });
    //             } else {
    //                 navigate("/firstBill/receiptFromCreateFirstBill", {
    //                     state: { REFNO: refno },
    //                 });
    //             }
    //         } else {
    //             Swal.fire("เกิดข้อผิดพลาด", response.data?.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
    //         }
    //     } catch (error) {
    //         console.error("Error saving data:", error);
    //         Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้", "error");
    //     }
    // };

    const submitPayment = async () => {
        try {
            // ต้องมีนัดชำระ? (นัดชำระล้วนๆ หรือ จ่ายบางส่วนแล้วยังเหลือ)
            const needAppointment =
                (!payQuick) || (payQuick && !payFullAmount && (paySomeAmount < paymentAmount));

            if (needAppointment) {
                if (!dueDate) {
                    Swal.fire("แจ้งเตือน", "กรุณาเลือกวันที่นัดชำระ", "warning");
                    return;
                }

                const appointmentPayload = {
                    RefNo: refno,
                    EmpId: EmpId,
                    TeamSale: TeamSale,
                    SalePaymentPeriodID: salePaymentPeriodID,
                    Appointdate: dueDate,
                };

                const appRes = await axios.post(UPDATE_APPOINTMENT, appointmentPayload, {
                    headers: { "Content-Type": "application/json" },
                });

                if (appRes.status !== 200) {
                    Swal.fire("เกิดข้อผิดพลาด", "บันทึกวันนัดชำระไม่สำเร็จ", "error");
                    return;
                }
            }

            const response = await axios.post(POST_PAYMENT_TRANSACTION_URL, allData, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "สำเร็จ!",
                    text: "บันทึกธุรกรรมการชำระเงินสำเร็จ",
                    timer: 2000,
                    showConfirmButton: false,
                });

                // ถ้าเป็น “นัดชำระล้วนๆ” → ไป overview
                // ถ้าเป็น “ชำระทันที” (เต็ม/บางส่วน) → ไปหน้าใบเสร็จ
                if (!payQuick) {
                    navigate("/firstBill/overview", { state: item });
                } else {
                    navigate("/firstBill/receiptFromCreateFirstBill", { state: { REFNO: refno } });
                }
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
                    paySomeAmount >= paymentAmount - tradeInDiscount
                    ? ""
                    : dueDate,
        PAYMENTPERIODDETAILID: salePaymentPeriodID,
        PAYMENTPERIODNUMBER: paymentPeriodNumber,
        PAYMENTCHANNEL: paymentChannel,
        PAYMENTCHOICE: paymentChoice,
        AMOUNT:
            status === "SCHEDULE" && paymentChoice === "NONE"
                ? paymentAmount - tradeInDiscount
                : paymentChoice === "FULL"
                    ? balanceOfPeriod
                    : paySomeAmount,
        PERIODAMOUNT: firstPeriod - tradeInDiscount,
        DISCOUNT: tradeInDiscount,
        PAYMENTID: paymentId,
    };
    // console.log(`allData`, allData);

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

                        navigate("/firstBill/receiptFromCreateFirstBill", {
                            state: { REFNO: refno }
                        });

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

    const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO;
    const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;

    const POST_PAYMENT_TRANSACTION_URL = `${API_URL_GET_ALLCONTRACT}/Payment/UpdatePaymentTransaction`;

    const GET_QR_PAYMENT_URL = `${API_URL_SALECONNEXT}/GetQRPayment`;
    const UPDATE_APPOINTMENT = `${API_URL_SALECONNEXT}/GetListFirstPayments/UpdateAppointment`;

    const getCheckPaidUrl = (ref: string, amount: number) =>
        `${API_URL_SALECONNEXT}/GetQRPayment/CheckPaidQR?RefNo=${encodeURIComponent(ref)}&Amount=${encodeURIComponent(amount)}`

    ////////////// ที่อยู่เก็บเงิน กดแล้วไป google map
    const mapHref = useMemo(() => {
        if (latitude && longitude) {
            // มีพิกัด → ใช้พิกัด
            return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        }
        if (addressString) {
            // ไม่มีพิกัด → ใช้ที่อยู่เป็นคำค้นหา
            return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressString)}`;
        }
        return "";
    }, [latitude, longitude, addressString]);

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
                                                                        {packageTypeID === 1 ? (
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
                                                                    {packageTypeID === 1 ? (
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
                                                                                value={balanceOfPeriod}
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
                                                                                value={balanceOfPeriod}
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
                                                                        {packageTypeID !== 1 ? (
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
                                                                        {packageTypeID !== 1 ? (
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
                                                {customerName}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="row mb-7">
                                        {/* หัวข้ออยู่ col-lg-4 */}
                                        <label className={`col-lg-4 text-muted ${styles.label}`}>
                                            ที่อยู่เก็บเงิน
                                        </label>
                                        {/* เนื้อหาอยู่ col-lg-7 */}
                                        <div className="col-lg-7 d-flex align-items-center">
                                            <span className={`${styles.label} me-2`}>
                                                {addressString}
                                            </span>
                                            {mapHref && (
                                                <a
                                                    href={mapHref}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                    aria-label="เปิดแผนที่"
                                                    title="เปิดแผนที่ใน Google Maps"
                                                    style={{ lineHeight: 0 }}
                                                >
                                                    <FontAwesomeIcon icon={faLocationDot} size="2x" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row mb-10">
                                        <label className={`col-lg-4 text-muted ${styles.label}`}>
                                            เบอร์โทรติดต่อ
                                        </label>
                                        <div className="col-lg-7">
                                            <span className={`${styles.label}`}>
                                                {tel1 && tel1}, {tel2 ? tel2 : ''} {telOffice ? telOffice : ''}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="row mb-7">
                                        <label className={`col-lg-4 text-muted ${styles.label}`}>
                                            สินค้า
                                        </label>
                                        <div className="col-lg-7 col-md-8">
                                            <span className={`${styles.label}`}>
                                                {productName}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="row mb-7">
                                        <label className={`col-lg-4 text-muted ${styles.label}`}>
                                            แพ็คเกจ
                                        </label>
                                        <div className="col-7 col-md-8">
                                            <span className={`${styles.label}`}>
                                                {packageTitle}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="row mb-7">
                                        <label className={`col-lg-4 text-muted ${styles.label}`}>
                                            ราคาสินค้า
                                        </label>
                                        <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
                                            <span className={`${styles.label}`}>
                                                {sales}
                                            </span>
                                            <span className="badge badge-light-success">บาท</span>
                                        </div>
                                    </div>

                                    <div className="row mb-7">
                                        <label className={`col-lg-4 text-muted ${styles.label}`}>
                                            ส่วนลด
                                        </label>
                                        <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
                                            <span className={`${styles.label}`}>
                                                {tradeInDiscount}
                                            </span>
                                            <span className="badge badge-light-success">บาท</span>
                                        </div>
                                    </div>

                                    <div className="row mb-7">
                                        <label className={`col-lg-4 text-muted ${styles.label}`}>
                                            ราคาสุทธิ
                                        </label>
                                        <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
                                            <span className={`${styles.label}`}>
                                                {totalPrice}
                                            </span>
                                            <span className="badge badge-light-success">บาท</span>
                                        </div>
                                    </div>

                                    {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
                                    {packageTypeID !== 1 && (
                                        <>
                                            <div className="row mb-7">
                                                <label
                                                    className={`col-lg-4 text-muted ${styles.label}`}
                                                >
                                                    งวดที่ 1 ที่ต้องชำระ
                                                </label>
                                                <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
                                                    <span className={`${styles.label}`}>
                                                        {firstPeriod}
                                                    </span>
                                                    <span className="badge badge-light-success">บาท</span>
                                                </div>
                                            </div>

                                            {mode !== 1 && (
                                                <div className="row mb-7">
                                                    <label
                                                        className={`col-lg-4 text-muted ${styles.label}`}
                                                    >
                                                        งวดที่ 2 ถึง{" "}
                                                        {mode}
                                                        ต้องชำระงวดละ
                                                    </label>
                                                    <div className="col-7 col-md-8 d-flex align-items-center justify-content-between">
                                                        <span className={`${styles.label}`}>
                                                            {nextPeriod}
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