import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Content } from '../../../_metronic/layout/components/content';
import { useAuth } from '../../modules/auth/core/Auth';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// useStore
import {
    useFetchCategoryStore,
    useCategoryStore,
    useProductStore,
} from '../../modules/stores/sales/packageStore/packageStore';

import { ThreeDot } from 'react-loading-indicators';

import { CardMoveProduct } from './components/CardMoveProduct';
import { CardWatingAprrove } from './components/CardWatingAprrove';
import { CardWatingAprroveBorrower } from './components/CardWatingAprroveBorrower';

// ระบบยืม สแกนบาร์โค้ดแล้วรับ barCode กลับมาหน้านี้
interface MyLocationState {
    barCode?: string
    tab?: string
}

const BorrowProduct: React.FC = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();

    const MySwal = withReactContent(Swal);

    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const { fetchCategory } = useFetchCategoryStore();

    const [categories, setCategories] = useState<any[]>([]);
    console.log(`categories`, categories);

    const { product, setProduct } = useProductStore();
    console.log(`product`, product);

    // เมื่อเริ่มต้นค่า selectedCategoryId เป็นค่าว่าง หมายถึง “ทุกหมวดหมู่”
    const [selectedCategoryId, setSelectedCategoryId] = useState<any>('');

    //เก็บ product แบบเต็มครั้งแรกไว้ตลอด
    const [initialProduct, setInitialProduct] = useState<any[]>([]);

    // const {
    //     EmpId, setEmpId,
    //     TeamSale, setTeamSale,
    //     SaleCode, setSaleCode,
    //     SupEmpId, setSupEmpId,
    //     SecEmpId, setSecEmpId,
    //     DivisionId, setDivisionId,
    //     DepartId, setDepartId,
    //     DepartGroup, setDepartGroup,
    // } = useCategoryStore();

    const EmpId = auth.data[0].EmpId;
    const EmpName = auth.data[0].EmpName;
    const TeamSale = auth.data[0].TeamSale;
    const SaleCode = auth.data[0].SaleCode;

    const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
    const CATEGORIES_URL = `${API_SALECONNEXT}/GetProduct/Categories`;

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    // เมื่อมีการเลือกหมวดหมู่จะเรียก API พร้อม filter ด้วย categoryId
    const getProductUrl = () =>
        `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`;

    {/**************** ระบบยืม **********************/ }
    const location = useLocation() as unknown as { state?: MyLocationState }

    // สร้าง state สำหรับ “รายการเต็ม” กับ “รายการปัจจุบัน”
    const [masterStockAllProductCompany, setMasterStockAllProductCompany] = useState<any[]>([]);
    const [stockAllProductCompany, setStockAllProductCompany] = useState<any[]>([]);
    // console.log(`stockAllProductCompany`, stockAllProductCompany);

    // State สำหรับควบคุมจำนวนรายการที่จะแสดง
    const [displayCount, setDisplayCount] = useState<number>(10);

    const [loadingStockAllProductCompany, setLoadingStockAllProductCompany] = useState(false);

    // state สำหรับเก็บข้อความที่พิมพ์ใน input เพื่อค้นหา/กรองสินค้า
    const [searchTerm, setSearchTerm] = useState<string>('');

    // เลือกโปรดักจากการคลิกที่การ์ด
    const [selectedProductForBorrow, setSelectedProductForBorrow] = useState<any | null>(null)
    console.log(`selectedProductForBorrow`, selectedProductForBorrow);

    // สร้าง state สำหรับบอกว่ากำลังค้นหา Barcode อยู่หรือไม่
    const [isSearchingBarcode, setIsSearchingBarcode] = useState(false)

    const [scannedBarCode, setScannedBarCode] = useState<string>('');

    // เมื่อมาจากหน้า สแกนบารโค้ด ให้เข้าแท็บ ระบบยืมสินค้า ออโต้
    const [activeTab, setActiveTab] = useState<"borrowing" | "waiting" | "history">("borrowing");

    const API_TSR_UAT = import.meta.env.VITE_APP_API_THIENSURAT_UAT;
    const PRODUCT_STOCK_ALL_COMPANY_URL = `${API_TSR_UAT}/ProductStock`;

    // const GET_BORROW_URL = (empid: string, teamSale: string, sn: string) =>
    //     `${API_TSR_UAT}/Product/GetBorrow?empid=${empid}&teamSale=${teamSale}&sn=${sn}`

    const MOVE_PRODUCT_STOCK_URL = `${API_TSR_UAT}/MoveProductInStock`;
    const UPDATE_STOCK_URL = `${API_URL_MONGO}/Product/UpdateStock`;
    const REQUEST_BORROW = `${API_URL_MONGO}/Product/RequestBorrow`;
    const GET_BORROW_LIST = `${API_URL_MONGO}/Product/GetBorrowList`;

    // โชว์การ์ดรายการสินค้าที่ยืม (คนยืมเห็น)
    const [watingProductAprroveBorrower, setWatingProductAprroveBorrower] = useState<any[]>([]);
    console.log(`watingProductAprroveBorrower`, watingProductAprroveBorrower);

    const [loadingWatingProductAprroveBorrower, setLoadingWatingProductAprroveBorrower] = useState(false)

    const handleScanBarcodeClick = () => {
        const isDesktop = !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isDesktop) {
            Swal.fire({
                icon: "info",
                title: "ไม่รองรับ",
                text: "ฟีเจอร์สแกนบาร์โค้ด สามารถใช้งานได้เฉพาะบนมือถือหรือแท็บเล็ตเท่านั้น",
            });
            return;
        }

        navigate("/borrowproduct/scanbarcode");
    };

    // ดึงข้อมูลทั้งหมด (ระบบยืม)
    useEffect(() => {
        setLoadingStockAllProductCompany(true);
        const getStockAllProductCompany = async () => {
            try {
                const response = await axios.get(PRODUCT_STOCK_ALL_COMPANY_URL);
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                // เก็บเป็นรายการเต็ม + รายการปัจจุบัน
                setMasterStockAllProductCompany(data);
                setStockAllProductCompany(data);
            } catch (error) {
                console.error('Error fetching StockAllProductCompany:', error);
            } finally {
                setLoadingStockAllProductCompany(false);
            }
        };
        getStockAllProductCompany();
    }, []);


    // ฟิลเตอร์ข้อมูล stockAllProductCompany ตาม searchTerm
    const filteredStockAllProductCompany = stockAllProductCompany.filter((item: any) => {
        const lowerSearch = searchTerm.toLowerCase();
        return (
            item.DescriptionTH?.toLowerCase().includes(lowerSearch) ||
            item.ItemDescription?.toLowerCase().includes(lowerSearch) ||
            item.ItemCode?.toLowerCase().includes(lowerSearch) ||
            item.SerialNo?.toLowerCase().includes(lowerSearch)
        );
    });

    useEffect(() => {
        if (location.state?.tab === "borrowing") {
            setActiveTab("borrowing")
        } else {
            setActiveTab("borrowing") // fallback default
        }
    }, [location.state])

    useEffect(() => {
        if (!location.state?.barCode) return;
        const code = location.state.barCode.trim().toLowerCase();
        setIsSearchingBarcode(true);

        // debounce 3 วิ ตามเดิม
        const timer = setTimeout(() => {
            // search จาก masterStockAllProductCompany แทน
            const found = masterStockAllProductCompany.find(item =>
                item.SerialNo?.trim().toLowerCase() === code
            );

            if (found) {
                // ถ้า TeamSale ตรงกับของผู้ใช้งาน ให้แจ้งเตือนและยกเลิกการค้นหา
                if (found.TeamSale === TeamSale) {
                    MySwal.fire({
                        icon: 'warning',
                        title: 'ไม่สามารถยืมสินค้าของทีมเดียวกันได้',
                    });
                    setIsSearchingBarcode(false);
                    // เคลียร์ state.barCode และกลับไปหน้า borrowproduct
                    navigate('/borrowproduct', { replace: true, state: {} });
                    return;
                }

                setSelectedProductForBorrow(found);
                setStockAllProductCompany([found]);
            } else {
                MySwal.fire({
                    icon: 'error',
                    title: `ไม่พบรหัสสินค้า ${code.toUpperCase()} ในระบบ`,
                });
            }

            setIsSearchingBarcode(false);
            navigate('/borrowproduct', { replace: true, state: {} });
        }, 3000);

        return () => clearTimeout(timer);
    }, [location.state?.barCode, masterStockAllProductCompany, MySwal, navigate, TeamSale]);

    const getWaitingApprovals = async () => {
        setLoadingWatingProductAprrove(true);
        try {
            const { data } = await axios.post(GET_REQUEST_BORROW, {
                TEAMSALE: TeamSale, SALECODE: SaleCode, EMPID: EmpId
            }, { headers: { 'Content-Type': 'application/json' } });
            setWatingProductAprrove(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingWatingProductAprrove(false);
        }
    };

    // โชว์รายการสินค้าที่ยืม (คนยืมเห็น)
    const getBorrowerList = async () => {
        setLoadingWatingProductAprroveBorrower(true);
        try {
            const { data } = await axios.post(GET_BORROW_LIST, {
                TEAMSALE: TeamSale, SALECODE: SaleCode, EMPID: EmpId
            }, { headers: { 'Content-Type': 'application/json' } });
            // บาง API return มาใน data.data บางตัวใน data
            const list = Array.isArray(data.data) ? data.data : data;
            setWatingProductAprroveBorrower(list);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingWatingProductAprroveBorrower(false);
        }
    };

    useEffect(() => {
        getWaitingApprovals();
        getBorrowerList();
    }, [EmpId, TeamSale, SaleCode]);

    // ฟังก์ชันยืมสินค้า — หลังสำเร็จให้สลับแท็บ + ดึง borrow list ใหม่
    const handleBorrowProduct = async (item: any) => {
        if (!selectedProductForBorrow) {
            MySwal.fire({
                icon: 'warning',
                title: 'กรุณาเลือกสินค้า',
                text: 'ยังไม่ได้เลือกสินค้าที่ต้องการยืม',
            });
            return;
        }
        try {
            const url = `${API_URL_MONGO}/Product/GetBorrow?empid=${selectedProductForBorrow.EmpId}&teamSale=${selectedProductForBorrow.TeamSale}&sn=${selectedProductForBorrow.SerialNo}`;
            const borrowRes = await axios.get(url);
            if (borrowRes.status === 200) {
                const payload = {
                    TEAMSALE: TeamSale,
                    SALECODE: SaleCode,
                    EMPID: EmpId,
                    EMPNAME: EmpName,
                    PRODUCT: selectedProductForBorrow,
                    STATUS: 'REQUEST',
                };
                const moveRes = await axios.post(REQUEST_BORROW, payload, {
                    headers: { 'Content-Type': 'application/json' },
                });
                if (moveRes) {
                    await MySwal.fire({
                        icon: 'success',
                        title: 'ยืมสินค้าเรียบร้อย',
                        text: `รหัสสินค้า ${selectedProductForBorrow.SerialNo} กำลังรออนุมัติ`,
                    });
                    // อัปเดต stock
                    axios.get(UPDATE_STOCK_URL).catch(console.error);

                    // เคลียร์การ์ดจาก Tab "borrowing"
                    setSelectedProductForBorrow(null);
                    setStockAllProductCompany(masterStockAllProductCompany);

                    setActiveTab('waiting');
                    getWaitingApprovals();
                    getBorrowerList();

                } else {
                    MySwal.fire({
                        icon: 'error',
                        title: 'ไม่สามารถยืมสินค้าได้',
                        text: 'เกิดข้อผิดพลาดบางอย่าง',
                    });
                }
            } else {
                MySwal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถยืมสินค้าได้',
                    text: 'สถานะไม่อนุญาตให้ยืม หรือไม่พบข้อมูล',
                });
            }
        } catch (err) {
            console.error(err);
            MySwal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถยืมสินค้าได้',
            });
        }
    };

    // ฟังก์ชันยกเลิกการยืม
    const handleCancelBorrow = async (refno: string, SerialNo: string) => {
        try {
            const response = await axios.post(UPDATE_BORROW_STATUS, {
                REFNO: refno,
                EMPID: EmpId,
                EMPNAME: EmpName,
                TEAMSALE: TeamSale,
                SALECODE: SaleCode,
                STATUS: "CANCEL"
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                await MySwal.fire({
                    icon: 'success',
                    title: 'ยกเลิกการยืมสำเร็จ',
                    text: `รหัสสินค้า ${SerialNo} ยกเลิกเรียบร้อย`,
                });

                // 1) ลบรายการนั้นออกจาก list ของ borrower ทันที
                setWatingProductAprroveBorrower(prev =>
                    prev.filter(req => req.REFNO !== refno)
                );

                // 2) ถ้าเผลอเลือกสินค้าชิ้นนั้น ยังอยู่ใน selectedProductForBorrow ก็เคลียร์ด้วย
                if (selectedProductForBorrow?.SerialNo === SerialNo) {
                    setSelectedProductForBorrow(null);
                }
            }
        } catch (err) {
            console.error('Error cancelling borrow:', err);
            MySwal.fire('ผิดพลาด', 'ไม่สามารถยกเลิกรายการได้', 'error');
        }
    };

    {/**************** จบ ระบบยืม **********************/ }

    {/**************** รายการสินค้าที่รออนุมัติ **********************/ }

    const GET_REQUEST_BORROW = `${API_URL_MONGO}/Product/GetRequestBorrow`;
    const UPDATE_BORROW_STATUS = `${API_URL_MONGO}/Product/UpdateBorrowStatus`;

    const [watingProductAprrove, setWatingProductAprrove] = useState<any[]>([]);
    console.log(`watingProductAprrove`, watingProductAprrove);

    const [loadingWatingProductAprrove, setLoadingWatingProductAprrove] = useState(false)

    const getWatingProductAprrove = async () => {
        setLoadingWatingProductAprrove(true);
        try {
            const response = await axios.post(GET_REQUEST_BORROW, {
                TEAMSALE: TeamSale,
                SALECODE: SaleCode,
                EMPID: EmpId,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
            setWatingProductAprrove(response.data.data)

        } catch (error) {
            console.error('Error fetching GET_REQUEST_BORROW:', error);
        } finally {
            setLoadingWatingProductAprrove(false);
        }
    };

    const handleApprove = async (refno: string, SerialNo: string) => {
        try {
            const response = await axios.post(UPDATE_BORROW_STATUS, {
                REFNO: refno,
                EMPID: EmpId,
                EMPNAME: EmpName,
                TEAMSALE: TeamSale,
                SALECODE: SaleCode,
                STATUS: "APPROVE"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
            if (response) {
                MySwal.fire({
                    icon: 'success',
                    title: `อนุมัติสำเร็จ`,
                    text: `รหัสสินค้า ${SerialNo} อนุมัติ`,
                })
            }
            // รีเฟรชลิสต์ waiting approval
            getWaitingApprovals();

        } catch (error) {
            console.error('Error fetching GET_REQUEST_BORROW:', error);
        }
    };

    const handleReject = async (refno: string, SerialNo: string) => {
        try {
            const payload = { REFNO: refno, EMPID: EmpId, EMPNAME: EmpName, TEAMSALE: TeamSale, SALECODE: SaleCode, STATUS: "REJECT" };
            const res = await axios.post(UPDATE_BORROW_STATUS, payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.status === 200) {
                await MySwal.fire({
                    icon: 'success',
                    title: 'ไม่อนุมัติเรียบร้อย',
                    text: `รหัสสินค้า ${SerialNo} ถูกปฏิเสธแล้ว`,
                });

                // 1) ลบจากลิสต์รออนุมัติ
                setWatingProductAprrove(prev =>
                    prev.filter(req => req.REFNO !== refno)
                );
                // 2) ลบจากลิสต์ borrower (ถ้ามี)
                setWatingProductAprroveBorrower(prev =>
                    prev.filter(req => req.REFNO !== refno)
                );
            }
        } catch (err) {
            console.error(err);
            MySwal.fire('ผิดพลาด', 'ไม่สามารถปฏิเสธรายการได้', 'error');
        }
    };

    // เรียกครั้งแรกตอน mount
    useEffect(() => {
        getWatingProductAprrove();
    }, [EmpId, TeamSale, SaleCode]);

    {/**************** จบ รายการสินค้าที่รออนุมัติ **********************/ }

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
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            ระบบยืมสินค้า
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <a
                                    className="text-muted text-hover-primary"
                                    href="/metronic8/react/demo1/sales/overview"
                                >
                                    ระบบยืมสินค้า
                                </a>
                            </li>
                            <li className="breadcrumb-item">
                                <span className="bullet bg-gray-500 w-5px h-2px"></span>
                            </li>
                            <li className="breadcrumb-item text-gray-900">ระบบยืมสินค้า</li>
                        </ul>
                    </div>
                </div>

                {/* แท็บสำหรับแบ่งหน้าจอ */}
                <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === "borrowing" && "active"}`}
                            onClick={() => setActiveTab("borrowing")}
                            data-bs-toggle="tab"
                            href="#kt_tab_pane_borrowing"
                        >
                            ระบบยืมสินค้า
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === "waiting" && "active"}`}
                            onClick={() => setActiveTab("waiting")}
                            data-bs-toggle="tab"
                            href="#kt_tab_pane_waiting"
                        >
                            รายการสินค้าที่รออนุมัติ
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === "history" && "active"}`}
                            onClick={() => setActiveTab("history")}
                            data-bs-toggle="tab"
                            href="#kt_tab_pane_history"
                        >
                            ประวัติ
                        </a>
                    </li>
                </ul>

                <div className="tab-content">

                    {/* Tab 1: ระบบยืมสินค้า */}
                    <div
                        className={`tab-pane fade ${activeTab === "borrowing" && "show active"}`}
                        id="kt_tab_pane_borrowing"
                    >
                        <div className="p-5">
                            <>
                                {/* สแกนบาร์โค้ด */}
                                <div
                                    className="d-flex justify-content-center align-items-center my-5 mx-7"
                                    style={{
                                        border: "1px solid #ccc",
                                        borderRadius: "10px",
                                        padding: "10px",
                                        backgroundColor: "#f9f9f9",
                                    }}
                                    onClick={handleScanBarcodeClick}
                                >
                                    <label
                                        className="btn btn-success px-5 w-200px"
                                        htmlFor="camera-input"
                                        style={{
                                            cursor: "pointer",
                                            borderRadius: "10px",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        สแกนบาร์โค้ด
                                    </label>
                                </div>
                                {/* สแกนบาร์โค้ด */}

                                <div className="tab-content">
                                    <div className="tab-pane fade show active" id="kt_tab_pane_categories">
                                        <div className="accordion mb-10" id="kt_accordion_1">
                                            <div className="accordion-item mb-10">
                                                <div
                                                    id="kt_accordion_1_body_1"
                                                    className="accordion-collapse collapse show"
                                                    aria-labelledby="kt_accordion_1_header_1"
                                                    data-bs-parent="#kt_accordion_1"
                                                >
                                                    <div className="accordion-body">
                                                        <form noValidate className="form">
                                                            <div className="card-body px-lg-9 px-1">

                                                                {scannedBarCode && (
                                                                    <label className='form-label fw-bold fs-3 mt-3'>
                                                                        S/N ที่สแกนได้: {scannedBarCode}
                                                                    </label>
                                                                )}

                                                                {isSearchingBarcode && (
                                                                    <div className="text-center my-10">
                                                                        <ThreeDot />
                                                                    </div>
                                                                )}

                                                                {!isSearchingBarcode && selectedProductForBorrow && (
                                                                    <>
                                                                        <label className='form-label fw-bold fs-3 mt-3'>
                                                                            ต้องการยืมสินค้า
                                                                        </label>

                                                                        <CardMoveProduct
                                                                            DescriptionTH={selectedProductForBorrow.DescriptionTH}
                                                                            ItemDescription={selectedProductForBorrow.ItemDescription}
                                                                            ItemCode={selectedProductForBorrow.ItemCode}
                                                                            SerialNo={selectedProductForBorrow.SerialNo}
                                                                            TeamSale={selectedProductForBorrow.TeamSale}
                                                                            isSelected={true}
                                                                            onBorrow={() => handleBorrowProduct(selectedProductForBorrow)}
                                                                        />
                                                                    </>
                                                                )}
                                                            </div>
                                                        </form>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        </div>
                    </div>
                    {/* จบ Tab 1: ระบบยืมสินค้า */}

                    {/* Tab 2: สินค้าที่รออนุมัติ */}
                    <div
                        className={`tab-pane fade ${activeTab === "waiting" && "show active"}`}
                        id="kt_tab_pane_waiting"
                    >
                        <div className="p-5">
                            <>
                                <div className="tab-content">
                                    <div className="tab-pane fade show active" id="kt_tab_pane_categories">
                                        <div className="accordion mb-10" id="kt_accordion_2">
                                            <div className="accordion-item mb-10">
                                                <div
                                                    id="kt_accordion_2_body_2"
                                                    className="accordion-collapse collapse show"
                                                    aria-labelledby="kt_accordion_2_header_2"
                                                    data-bs-parent="#kt_accordion_2"
                                                >
                                                    <div className="accordion-body">
                                                        <form noValidate className="form">
                                                            <div className="card-body px-lg-9 px-1">

                                                                <div className="p-5">

                                                                    <div className="d-flex justify-content-start mb-4">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-primary"
                                                                            onClick={() => {
                                                                                getBorrowerList();
                                                                            }}
                                                                        >
                                                                            รีเฟรชรายการสินค้าที่ยืม
                                                                        </button>
                                                                    </div>

                                                                    <label className='form-label fw-bold fs-3 mt-3'>
                                                                        รายการสินค้าที่ยืม
                                                                    </label>

                                                                    {!loadingWatingProductAprroveBorrower &&
                                                                        watingProductAprroveBorrower
                                                                            .filter(req => req.STATUS === 'REQUEST')
                                                                            .flatMap(req =>
                                                                                req.PRODUCT.map((prod: any) => (
                                                                                    <CardWatingAprroveBorrower
                                                                                        isSelected={selectedProductForBorrow?.RecordId === prod.RecordId}
                                                                                        DescriptionTH={prod.DescriptionTH}
                                                                                        ItemDescription={prod.ItemDescription}
                                                                                        ItemCode={prod.ItemCode}
                                                                                        SerialNo={prod.SerialNo}
                                                                                        EmpNameReq={req.EMPNAMEREQ}
                                                                                        TeamSaleReq={req.TEAMSALEREQ}
                                                                                        onCancelBorrow={() => handleCancelBorrow(req.REFNO, prod.SerialNo)}
                                                                                    />
                                                                                ))
                                                                            )
                                                                    }
                                                                </div>

                                                                <hr />

                                                                <div className="p-5">
                                                                    {/* ปุ่มรีเฟรชเหนือรายการสินค้าที่รออนุมัติ */}
                                                                    <div className="d-flex justify-content-start mb-4">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-primary"
                                                                            onClick={() => {
                                                                                getWaitingApprovals();
                                                                            }}
                                                                        >
                                                                            รีเฟรชรายการสินค้าที่รออนุมัติ
                                                                        </button>
                                                                    </div>

                                                                    <label className='form-label fw-bold fs-3 mt-3'>
                                                                        รายการสินค้าที่รออนุมัติ
                                                                    </label>

                                                                    {!loadingWatingProductAprrove &&
                                                                        watingProductAprrove
                                                                            .filter(req => req.STATUS === 'REQUEST')
                                                                            .flatMap(req =>
                                                                                req.PRODUCT.map((prod: any) => (
                                                                                    <CardWatingAprrove
                                                                                        isSelected={selectedProductForBorrow?.RecordId === prod.RecordId}
                                                                                        DescriptionTH={prod.DescriptionTH}
                                                                                        ItemDescription={prod.ItemDescription}
                                                                                        ItemCode={prod.ItemCode}
                                                                                        SerialNo={prod.SerialNo}
                                                                                        EmpNameReq={req.EMPNAMEREQ}
                                                                                        TeamSaleReq={req.TEAMSALEREQ}
                                                                                        onApprove={() => handleApprove(req.REFNO, prod.SerialNo)}
                                                                                        onReject={() => handleReject(req.REFNO, prod.SerialNo)}
                                                                                    />
                                                                                ))
                                                                            )
                                                                    }
                                                                </div>

                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        </div>
                    </div>
                    {/* จบ Tab 2: สินค้าที่รออนุมัติ */}
                </div>

            </Content>
        </>
    );
};

export default BorrowProduct;