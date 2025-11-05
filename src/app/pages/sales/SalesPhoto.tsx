import styles from "@/styles/style.module.css";
import { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers";
import { Content } from "../../../_metronic/layout/components/content";
import axios from "axios";
import { useAuth } from "../../modules/auth/core/Auth";
import { useUUIDStore } from "../../modules/stores/stepsStore";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { ThreeDot } from "react-loading-indicators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { log } from "node:console";

// อัพเดท
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
    ADDRESS: [any];
    PDPA: [any];
    CONTRACT: [any];
    IMAGE: [any];
    CHECKERCOMMENT: [any];
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

const SalesPhoto: React.FC = () => {
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);

    // สร้างใหม่
    const { REFNO } = useUUIDStore();
    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || "";
    const TeamSale = auth?.data?.[0]?.TeamSale || "";
    const SaleCode = auth?.data?.[0]?.SaleCode || "";
    const SupEmpId = auth?.data?.[0]?.SupEmp || "";
    const SecEmpId = auth?.data?.[0]?.SecEmp || "";

    const location = useLocation() as any;
    const fromStep = location.state?.fromStep || false;
    // console.log(`fromStep`, fromStep);
    const fromPath = location.state?.from || '';
    const item = (location.state?.data as ItemProps) || [];
    // console.log(`item`, item);

    const hideFinish = fromPath === '/sale/editFinishInDay' ||
        '/sale/photo/gallery/drawingMap' ||
        '/sale/photo/gallery/idcard' ||
        '/sale/photo/gallery/customer' ||
        '/sale/photo/gallery/customerHome' ||
        '/sale/photo/gallery/equipment' ||
        '/sale/photo/gallery/installation' ||
        '/sale/photo/gallery/turn' ||
        '/sale/photo/gallery-gps'

    // console.log(`hideFinish`, hideFinish);

    // กำหนด REFNO
    const refno = fromStep ? item.REFNO : REFNO;
    // console.log(`refno`, refno);

    const [images, setImages] = useState<ImagesType | null>(null);
    // console.log(`images`, images);

    const [isLoading, setIsLoading] = useState(true);

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
    const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}&ProcessType=${auth.processtype}`;
    // const GET_IMAGES_API = `${API_URL_MONGO}/Contract/GetContractImage?REFNO=${refno}`;

    const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
    const GET_IMAGES_API = `${API_URL_SALECONNEXT}/GetContractImages?RefNo=${refno}&EmpId=${EmpId}`;
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

    const matchedItem = draft.find((d) => d.REFNO === refno);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const resp = await axios.get(GET_IMAGES_API);
                const groups = Array.isArray(resp.data?.data) ? resp.data.data : [];

                // เตรียม object ตาม ImagesType เดิม
                const nextImages: ImagesType = {
                    IMAGECARD: [],
                    IMAGEGPS: [],
                    IMAGEMAP: [],
                    IMAGECUSTOMERHOME: [],
                    IMAGEINSTALLATION: [],
                    IMAGETDS: [],
                    IMAGECUSTOMER: [],     // จะใช้เก็บ TRANSFERSLIP
                    IMAGETRADEIN: [],      // จะใช้เก็บ CUSTOMER (เครื่องเทิร์น)
                };

                // helper: ดึง URL จากแต่ละรายการรูป
                const pickUrls = (arr: any[]) =>
                    (Array.isArray(arr) ? arr : [])
                        .map((it: any) => it?.FULLURL || it?.FULLPATH || "")
                        .filter(Boolean);

                // แม็พ IMAGETYPECODE → ช่องใน state
                for (const g of groups) {
                    const code = g?.IMAGETYPECODE;
                    const urls = pickUrls(g?.IMAGES);

                    switch (code) {
                        case "MAP":
                            nextImages.IMAGEGPS = urls;
                            break;
                        case "IDCARD":
                            nextImages.IMAGECARD = urls;
                            break;
                        case "TDS":
                            nextImages.IMAGETDS = urls;
                            break;
                        case "PAYMENTCARD":
                            nextImages.IMAGEMAP = urls; // รูปวาดแผนที่
                            break;
                        case "ADDRESS":
                            nextImages.IMAGECUSTOMERHOME = urls;
                            break;
                        case "INSTALLATION":
                            nextImages.IMAGEINSTALLATION = urls;
                            break;
                        case "TRADEINPRODUCT":
                            nextImages.IMAGETRADEIN = urls; // รูปเครื่องเทิร์น
                            break;
                        case "TRANSFERSLIP":
                            nextImages.IMAGECUSTOMER = urls; // สลิปโอนเงิน
                            break;
                        default:
                            break;
                    }
                }

                setImages(nextImages);
            } catch (err) {
                console.error("Error fetching images:", err);
                setImages(null);
            }
        };

        fetchImages();
    }, [GET_IMAGES_API, refno, EmpId]);

    // โหลดก่อน 2 วิจึงโชว์ ui ทั้งหน้า
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // แสดง ThreeDot เป็นเวลา 2 วินาที

        return () => clearTimeout(timer); // เคลียร์ timer เมื่อ component ถูก unmount
    }, []);

    // ฟังก์ชัน ส่งตรวจสอบ (กรณีไม่ได้มาจาก step)
    const handleCheckerClick = async () => {
        if (!isDataComplete) {
            MySwal.fire({
                icon: "warning",
                title: "ข้อมูลยังไม่ครบ",
                text: "กรุณากรอกข้อมูลให้ครบก่อนจบการทำงาน",
            });
            return;
        }
        MySwal.fire({
            title: "โปรดรอสักครู่...",
            text: "กำลังส่งข้อมูล",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const finishRefno = refno ? refno : matchedItem.REFNO;

        try {
            const response = await axios.post(
                UPDATECONTACT,
                {
                    REFNO: finishRefno,
                    EMPID: EmpId,
                    TEAMSALE: TeamSale,
                    SALECODE: SaleCode,
                    SUPEMPID: SupEmpId,
                    SECEMPID: SecEmpId,
                    FIELD: "STATUS",
                    DATA: "FINISH",
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            // ตรวจสอบ status
            if (response.status === 200) {
                if (!response.data.data) {
                    MySwal.fire(
                        "เกิดข้อผิดพลาด",
                        "ส่งข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา",
                        "error"
                    );
                } else {
                    MySwal.fire("สำเร็จ", "ทำสัญญาเรียบร้อยแล้ว", "success");
                    navigate("/sale/overview");
                }
            } else {
                MySwal.fire("เกิดข้อผิดพลาด", response.data.message, "error");
            }

            if (response.status === 200) {
                if (!response.data.data) {
                    MySwal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด",
                        text: "ส่งข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา",
                    });
                } else {
                    MySwal.fire({
                        icon: "success",
                        title: "สำเร็จ!",
                        text: "บันทึกสัญญาเรียบร้อยแล้ว",
                        timer: 2000,
                        showConfirmButton: false,
                    }).then(() => {
                        navigate("/sale/overview");
                    });
                }
            } else {
                MySwal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด",
                    text: "ส่งข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา",
                });
            }
        } catch (error) {
            // กรณีเกิด Error ให้ปิด Loading ก่อน แล้วแจ้ง
            Swal.close();
            MySwal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ส่งข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา",
            });
        }
    };

    // ฟังก์ชัน ส่งตรวจสอบ (กรณีมาจาก step)
    const handleUpdateCheckerClick = async () => {
        if (!isDataComplete) {
            MySwal.fire({
                icon: "warning",
                title: "ข้อมูลยังไม่ครบ",
                text: "กรุณากรอกข้อมูลให้ครบก่อนจบการทำงาน",
            });
            return;
        }
        // เรียก SweetAlert2 loading
        MySwal.fire({
            title: "โปรดรอสักครู่...",
            text: "กำลังส่งข้อมูล",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const response = await axios.post(
                UPDATECONTACT,
                {
                    REFNO: refno,
                    EMPID: EmpId,
                    TEAMSALE: TeamSale,
                    FIELD: "STATUS",
                    DATA: "FINISH",
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.status === 200) {
                if (!response.data.data) {
                    MySwal.fire(
                        "เกิดข้อผิดพลาด",
                        "ส่งข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา",
                        "error"
                    );
                } else {
                    MySwal.fire("สำเร็จ", "ส่งข้อมูลตรวจสอบแล้ว", "success");
                    navigate("/sale/overview");
                }
            } else {
                MySwal.fire("เกิดข้อผิดพลาด", response.data.message, "error");
            }
        } catch (error) {
            // กรณีเกิด Error ให้ปิด Loading ก่อน แล้วแจ้ง
            Swal.close();
            MySwal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้", "error");
        }
    };

    const isNonEmptyStr = (v: any) => typeof v === 'string' && v.trim() !== ''

    const hasAny = <T,>(arr: T[], pred: (x: T) => boolean) =>
        Array.isArray(arr) && arr.some(pred)

    // const isDataComplete = useMemo(() => {
    //     const isNotEmptyArray = (arr: any): boolean =>
    //         Array.isArray(arr) && arr.length > 0;

    //     // เลือกแหล่งข้อมูลตาม fromStep
    //     const source = fromStep
    //         ? item // ถ้ามาจาก step เริ่มแรก
    //         : matchedItem; // ถ้าเป็น draft
    //     // console.log(`source`, source);

    //     if (!source) return false;

    //     return (
    //         isNotEmptyArray(source.CUSTOMERSTATUS) &&
    //         isNotEmptyArray(source.PRODUCT) &&
    //         isNotEmptyArray(source.DISCOUNT) &&
    //         isNotEmptyArray(source.SALEEMPLOYEE) &&
    //         isNotEmptyArray(source.CUSTOMERDETAIL) &&
    //         isNotEmptyArray(source.ADDRESS) &&
    //         isNotEmptyArray(source.PDPA) &&
    //         isNotEmptyArray(source.CONTRACT)
    //     );
    // }, [fromStep, item, matchedItem]);

    const isDataComplete = useMemo(() => {
        const source = fromStep ? item : matchedItem
        if (!source) return false

        // 1) สถานะลูกค้า: ต้องมีอย่างน้อยหนึ่งฟิลด์ที่ใช้จริง
        const okCustomerStatus = hasAny(source.CUSTOMERSTATUS, (o: any) =>
            isNonEmptyStr(o.CustomerName) ||
            isNonEmptyStr(o.message) ||
            isNonEmptyStr(o.Message) ||
            isNonEmptyStr(o.Searchtext)
        )

        // 2) แพ็คเกจ/สินค้า: ต้องมีคำอธิบาย/โค้ด หรือมี Package จริง
        const okProduct = hasAny(source.PRODUCT, (p: any) =>
            isNonEmptyStr(p.ItemDescription) ||
            isNonEmptyStr(p.ItemCode) ||
            (Array.isArray(p.Package) && p.Package.length > 0)
        )

        // 3) ส่วนลด/ของแถม/เทิร์น: ต้องมีค่าใดค่าหนึ่งจริง
        const okDiscount = hasAny(source.DISCOUNT, (d: any) =>
            d?.DISCOUNTAMOUNT != null ||
            isNonEmptyStr(d?.GIFT?.GIFTDESCRIPTION) ||
            isNonEmptyStr(d?.TRADEIN?.TRADEINMODEL) ||
            d?.TRADEIN?.HASTRADEIN === 1
        )

        // 4) พนักงานขาย/ผู้แนะนำ/ช่าง: ต้องมี SALEEMPLOYEE ที่มีชื่อ/รหัส
        const okSaleEmp = hasAny(source.SALEEMPLOYEE, (s: any) =>
            !!s?.SALEEMPLOYEE &&
            (
                isNonEmptyStr(s.SALEEMPLOYEE.FName) ||
                isNonEmptyStr(s.SALEEMPLOYEE.SaleEmp) ||
                isNonEmptyStr(s.SALEEMPLOYEE.EmpId)
            )
        )

        // 5) ข้อมูลลูกค้า: ตามเกณฑ์ bullet เดิมของคุณ
        const cd = source.CUSTOMERDETAIL?.[0] ?? {}
        const okCustDetail =
            !!cd?.CUSTOMERTYPE ||
            isNonEmptyStr(cd?.CUSTOMERNAME) ||
            isNonEmptyStr(cd?.CUSTOMERMOBILE) ||
            (Array.isArray(cd?.PREFIX) && cd.PREFIX.length > 0)

        // 6) ที่อยู่: มีข้อมูล address ใดๆ ที่เป็นรูปธรรม (จังหวัด/รหัสไปรษณีย์อย่างใดอย่างหนึ่ง)
        const okAddress = hasAny(source.ADDRESS, (a: any) => {
            const c = a?.ADDRESSCARD ?? a?.ADDRESSINSTALLATION ?? a?.ADDRESSPAYMENT
            return isNonEmptyStr(c?.ADDRESSPROVINCENAME) || isNonEmptyStr(c?.ADDRESSZIPCODE)
        })

        // 7) PDPA: ต้องมี record ที่มี CONSENTGIVEN (boolean)
        const okPdpa = hasAny(source.PDPA, (p: any) => typeof p?.CONSENTGIVEN === 'boolean')

        // 8) สัญญา: ต้องมี createdAt หรือเลขที่สัญญา
        const okContract = hasAny(source.CONTRACT, (c: any) =>
            isNonEmptyStr(c?.createdAt) || isNonEmptyStr(c?.CONTNO)
        )

        return (
            okCustomerStatus &&
            okProduct &&
            okDiscount &&
            okSaleEmp &&
            okCustDetail &&
            okAddress &&
            okPdpa &&
            okContract
        )
    }, [fromStep, item, matchedItem])

    const whereRefno = fromStep ? refno : matchedItem?.REFNO ?? "";

    return (
        <>
            {isLoading ? (
                <div className="text-center my-10">
                    <ThreeDot />
                </div>
            ) : (
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
                                <span>ถ่ายรูป</span>
                            </div>
                        </div>
                    </div>
                    <span className={`${styles.fontSize}`}>เลขที่ขาย: {""}</span>
                    <span className={`${styles.titlePage}`}>
                        {whereRefno ? whereRefno : item?.REFNO}
                    </span>

                    <div className="row gx-4 gy-6 mb-20">
                        {/* Card Body */}
                        <div className="card col-lg-3 col-6">
                            {images?.IMAGEGPS.length! > 0 && (
                                <span className="position-absolute bottom-0 end-0 m-2 fs-6">
                                    <img
                                        className="mx-auto h-40px theme-light-show"
                                        src={toAbsoluteUrl(
                                            "media/take-a-pic/circle-check-solid-full.svg"
                                        )}
                                    />
                                </span>
                            )}
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    color: "inherit",
                                    cursor: "pointer",
                                    fontSize: "inherit",
                                }}
                                onClick={() =>
                                    navigate("/sale/photo/gallery-gps", {
                                        state: { fromStep, data: item },
                                    })
                                }
                            >
                                <div className="mb-10 mt-7">
                                    <div className="text-gray-800 text-center">
                                        <span
                                            className={`position-relative d-inline-block text-dangeropacity-75-hover ${styles.fontSize}`}
                                        >
                                            รูปแผนที่ GPS
                                        </span>
                                    </div>
                                </div>
                                <img
                                    className="mx-auto h-100px h-lg-150px theme-light-show"
                                    src={toAbsoluteUrl(
                                        "media/take-a-pic/map-gps-svgrepo-com.svg"
                                    )}
                                    alt=""
                                />
                            </button>
                        </div>
                        {/* End Card Body */}

                        {/* Card Body */}
                        <div className="card col-lg-3 col-6">
                            {images?.IMAGECARD.length! > 0 && (
                                <span className="position-absolute bottom-0 end-0 m-2 fs-6">
                                    <img
                                        className="mx-auto h-40px theme-light-show"
                                        src={toAbsoluteUrl(
                                            "media/take-a-pic/circle-check-solid-full.svg"
                                        )}
                                    />
                                </span>
                            )}
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    color: "inherit",
                                    cursor: "pointer",
                                    fontSize: "inherit",
                                }}
                                onClick={() =>
                                    navigate("/sale/photo/gallery/idcard", {
                                        state: { fromStep, data: item },
                                    })
                                }
                            >
                                <div className="mb-10 mt-7">
                                    <div className="text-gray-800 text-center">
                                        <span
                                            className={`position-relative d-inline-block text-dangeropacity-75-hover ${styles.fontSize}`}
                                        >
                                            รูปบัตรประชาชน
                                        </span>
                                    </div>
                                </div>
                                <img
                                    className="mx-auto h-100px h-lg-150px theme-light-show"
                                    src={toAbsoluteUrl("media/take-a-pic/id-card-pass.svg")}
                                    alt=""
                                />
                            </button>
                        </div>
                        {/* End Card Body */}

                        {/* Card Body */}
                        <div className="card col-lg-3 col-6">
                            {images?.IMAGETDS.length! > 0 && (
                                <span className="position-absolute bottom-0 end-0 m-2 fs-6">
                                    <img
                                        className="mx-auto h-40px theme-light-show"
                                        src={toAbsoluteUrl(
                                            "media/take-a-pic/circle-check-solid-full.svg"
                                        )}
                                    />
                                </span>
                            )}
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    color: "inherit",
                                    cursor: "pointer",
                                    fontSize: "inherit",
                                }}
                                onClick={() =>
                                    navigate("/sale/photo/gallery/equipment", {
                                        state: { fromStep, data: item },
                                    })
                                }
                            >
                                <div className="mb-10 mt-7">
                                    <div className="text-gray-800 text-center">
                                        <span
                                            className={`position-relative d-inline-block text-dangeropacity-75-hover ${styles.fontSize}`}
                                        >
                                            รูปอุปกรณ์วัดค่าน้ำ
                                        </span>
                                    </div>
                                </div>
                                <img
                                    className="mx-auto h-100px h-lg-150px theme-light-show"
                                    src={toAbsoluteUrl(
                                        "media/take-a-pic/water-water-svgrepo-com.svg"
                                    )}
                                    alt=""
                                />
                            </button>
                        </div>
                        {/* End Card Body */}

                        {/* Card Body */}
                        <div className="card col-lg-3 col-6">
                            {images?.IMAGEMAP.length! > 0 && (
                                <span className="position-absolute bottom-0 end-0 m-2 fs-6">
                                    <img
                                        className="mx-auto h-40px theme-light-show"
                                        src={toAbsoluteUrl(
                                            "media/take-a-pic/circle-check-solid-full.svg"
                                        )}
                                    />
                                </span>
                            )}
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    color: "inherit",
                                    cursor: "pointer",
                                    fontSize: "inherit",
                                }}
                                onClick={() =>
                                    navigate("/sale/photo/gallery/drawingMap", {
                                        state: { fromStep, data: item },
                                    })
                                }
                            >
                                <div className="mb-10 mt-7">
                                    <div className="text-gray-800 text-center">
                                        <span
                                            className={`position-relative d-inline-block text-dangeropacity-75-hover ${styles.fontSize}`}
                                        >
                                            รูปวาดแผนที่
                                        </span>
                                    </div>
                                </div>
                                <img
                                    className="mx-auto h-100px h-lg-150px theme-light-show"
                                    src={toAbsoluteUrl("media/take-a-pic/map-svgrepo-com.svg")}
                                    alt=""
                                />
                            </button>
                        </div>
                        {/* End Card Body */}

                        {/* Card Body */}
                        <div className="card col-lg-3 col-6">
                            {images?.IMAGECUSTOMERHOME.length! > 0 && (
                                <span className="position-absolute bottom-0 end-0 m-2 fs-6">
                                    <img
                                        className="mx-auto h-40px theme-light-show"
                                        src={toAbsoluteUrl(
                                            "media/take-a-pic/circle-check-solid-full.svg"
                                        )}
                                    />
                                </span>
                            )}
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    color: "inherit",
                                    cursor: "pointer",
                                    fontSize: "inherit",
                                }}
                                onClick={() =>
                                    navigate("/sale/photo/gallery/customerHome", {
                                        state: { fromStep, data: item },
                                    })
                                }
                            >
                                <div className="mb-10 mt-7">
                                    <div className="text-gray-800 text-center">
                                        <span
                                            className={`position-relative d-inline-block text-dangeropacity-75-hover ${styles.fontSize}`}
                                        >
                                            รูปบ้านลูกค้า
                                        </span>
                                    </div>
                                </div>
                                <img
                                    className="mx-auto h-100px h-lg-150px theme-light-show"
                                    src={toAbsoluteUrl(
                                        "media/take-a-pic/home-house-svgrepo-com.svg"
                                    )}
                                    alt=""
                                />
                            </button>
                        </div>
                        {/* End Card Body */}

                        {/* Card Body */}
                        <div className="card col-lg-3 col-6">
                            {images?.IMAGEINSTALLATION.length! > 0 && (
                                <span className="position-absolute bottom-0 end-0 m-2 fs-6">
                                    <img
                                        className="mx-auto h-40px theme-light-show"
                                        src={toAbsoluteUrl(
                                            "media/take-a-pic/circle-check-solid-full.svg"
                                        )}
                                    />
                                </span>
                            )}
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    color: "inherit",
                                    cursor: "pointer",
                                    fontSize: "inherit",
                                }}
                                onClick={() =>
                                    navigate("/sale/photo/gallery/installation", {
                                        state: { fromStep, data: item },
                                    })
                                }
                            >
                                <div className="mb-10 mt-7">
                                    <div className="text-gray-800 text-center">
                                        <span
                                            className={`position-relative d-inline-block text-dangeropacity-75-hover ${styles.fontSize}`}
                                        >
                                            รูปติดตั้งเครื่อง/ลูกค้า
                                        </span>
                                    </div>
                                </div>
                                <img
                                    className="mx-auto h-100px h-lg-150px theme-light-show"
                                    src={toAbsoluteUrl(
                                        "media/take-a-pic/setting-configuration-gear-svgrepo-com.svg"
                                    )}
                                    alt=""
                                />
                            </button>
                        </div>
                        {/* End Card Body */}

                        {/* Card Body */}
                        <div className="card col-lg-3 col-6">
                            {images?.IMAGETRADEIN.length! > 0 && (
                                <span className="position-absolute bottom-0 end-0 m-2 fs-6">
                                    <img
                                        className="mx-auto h-40px theme-light-show"
                                        src={toAbsoluteUrl(
                                            "media/take-a-pic/circle-check-solid-full.svg"
                                        )}
                                    />
                                </span>
                            )}
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    color: "inherit",
                                    cursor: "pointer",
                                    fontSize: "inherit",
                                }}
                                onClick={() =>
                                    navigate("/sale/photo/gallery/turn", {
                                        state: { fromStep, data: item },
                                    })
                                }
                            >
                                <div className="mb-10 mt-7">
                                    <div className="text-gray-800 text-center">
                                        <span
                                            className={`position-relative d-inline-block text-dangeropacity-75-hover ${styles.fontSize}`}
                                        >
                                            รูปเครื่องเทิร์นหรือโปรโมชั่น
                                        </span>
                                    </div>
                                </div>
                                <img
                                    className="mx-auto h-100px h-lg-150px theme-light-show"
                                    src={toAbsoluteUrl("media/take-a-pic/water-svgrepo-com.svg")}
                                    alt=""
                                />
                            </button>
                        </div>
                        {/* End Card Body */}

                        {/* Card Body */}
                        <div className="card col-lg-3 col-6">
                            {images?.IMAGECUSTOMER.length! > 0 && (
                                <span className="position-absolute bottom-0 end-0 m-2 fs-6">
                                    <img
                                        className="mx-auto h-40px theme-light-show"
                                        src={toAbsoluteUrl(
                                            "media/take-a-pic/circle-check-solid-full.svg"
                                        )}
                                    />
                                </span>
                            )}
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    color: "inherit",
                                    cursor: "pointer",
                                    fontSize: "inherit",
                                }}
                                onClick={() =>
                                    navigate("/sale/photo/gallery/transferslip", {
                                        state: { fromStep, data: item },
                                    })
                                }
                            >
                                <div className="mb-10 mt-7">
                                    <div className="text-gray-800 text-center">
                                        <span
                                            className={`position-relative d-inline-block text-dangeropacity-75-hover ${styles.fontSize}`}
                                        >
                                            สลิปโอนเงิน (ถ้ามี)
                                        </span>
                                    </div>
                                </div>
                                <img
                                    className="mx-auto h-100px h-lg-150px theme-light-show"
                                    src={toAbsoluteUrl(
                                        "media/take-a-pic/person-boy-svgrepo-com.svg"
                                    )}
                                    alt=""
                                />
                            </button>
                        </div>
                    </div>
                    {/* End Card Body */}

                    {/* แสดงปุ่มเมื่อมาจาก Step */}
                    <div className="d-none d-xl-flex justify-content-start align-items-center mt-5 mb-10">
                        <div
                            className="ms-auto"
                        >
                            <button
                                className={`${styles.btnPrimary}`}
                                onClick={handleCheckerClick}
                                disabled={!isDataComplete}
                            >
                                จบการทำงาน
                            </button>
                        </div>
                    </div>

                    {/* ปุ่มในหน้าจอเล็ก */}
                    {/* แสดงปุ่มเมื่อมาจาก Step */}
                    <div
                        className="d-flex d-xl-none justify-content-start align-items-center bg-light p-3 border-top"
                        style={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1050,
                        }}
                    >
                        <div
                            className="ms-auto"
                        >
                            <button
                                className={`${styles.btnPrimary}`}
                                onClick={handleCheckerClick}
                                disabled={!isDataComplete}
                            >
                                จบการทำงาน
                            </button>
                        </div>
                    </div>
                </Content>
            )}
        </>
    );
};

export default SalesPhoto;
