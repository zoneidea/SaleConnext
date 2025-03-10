import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Content } from '../../../_metronic/layout/components/content';
import { SalesItemNumber } from '../sales/components/salesItemNumber/SalesItemNumber';
import { useAuth } from '../../modules/auth/core/Auth';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// useStore
import {
    useFetchCategoryStore,
    useCategoryStore,
    useProductStore,
} from '../../modules/stores/sales/packageStore/packageStore';

import { CardProductStockOnlyMe } from './components/CardProductStockOnlyMe';
import { CardMoveProduct } from './components/CardMoveProduct';
import { ThreeDot } from 'react-loading-indicators';

// ระบบยืม สแกนบาร์โค้ดแล้วรับ barCode กลับมาหน้านี้
interface MyLocationState {
    barCode?: string
    tab?: string
}

const SalesProductStock: React.FC = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();

    const MySwal = withReactContent(Swal);

    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const { fetchCategory } = useFetchCategoryStore();
    const [categories, setCategories] = useState<any[]>([]);
    const { product, setProduct } = useProductStore();
    // เมื่อเริ่มต้นค่า selectedCategoryId เป็นค่าว่าง หมายถึง “ทุกหมวดหมู่”
    const [selectedCategoryId, setSelectedCategoryId] = useState<any>('');

    const {
        EmpId, setEmpId,
        TeamSale, setTeamSale,
        SaleCode, setSaleCode,
        SupEmpId, setSupEmpId,
        SecEmpId, setSecEmpId,
        DivisionId, setDivisionId,
        DepartId, setDepartId,
        DepartGroup, setDepartGroup,
    } = useCategoryStore();

    const EmpName = auth.data[0].EmpName;

    const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
    const CATEGORIES_URL = `${API_SALECONNEXT}/GetProduct/Categories`;

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    // เมื่อมีการเลือกหมวดหมู่จะเรียก API พร้อม filter ด้วย categoryId
    const getProductUrl = () =>
        `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`;

    {/**************** สินค้าในสต๊อกตัวเอง **********************/ }

    // POST สำหรับดึงหมวดหมู่สินค้า
    useEffect(() => {
        const postData = async () => {
            try {
                const response = await axios.post(
                    CATEGORIES_URL,
                    { EmpId, DivisionId, DepartId, DepartGroup, TeamSale },
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setCategories(data);
                setLoadingCategories(false);
            } catch (error) {
                console.error('Error fetching CATEGORIES_URL:', error);
                setLoadingCategories(false);
            }

            // ตั้งค่า state จาก auth
            setEmpId(auth.data[0].EmpId);
            setTeamSale(auth.data[0].TeamSale);
            setSaleCode(auth.data[0].SaleCode);
            setSupEmpId(auth.data[0].SupEmp);
            setSecEmpId(auth.data[0].SecEmp);
            setDivisionId(auth.data[0].DivisionId);
            setDepartId(auth.data[0].DepartId);
            setDepartGroup(auth.data[0].DepartGroup);
        };
        postData();
        // เมื่อเข้ามาหน้าให้เรียก getProductData เพื่อดึงสินค้าทุกหมวดหมู่
        getProductData();
    }, [EmpId, TeamSale, SaleCode, SupEmpId, SecEmpId, DivisionId, DepartId, DepartGroup, auth]);

    // เมื่อมีการเลือกหมวดหมู่ ให้เรียก API สำหรับดึงสินค้าที่ filter ตามหมวดหมู่
    useEffect(() => {
        const getData = async () => {
            // ถ้า selectedCategoryId เป็นค่าว่างจะไม่เรียกใช้ API นี้
            if (!selectedCategoryId) return;
            setLoadingProducts(true);
            try {
                const response = await axios.get(getProductUrl(), {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setProduct(data);
            } catch (error) {
                console.error('Error fetching getProductUrl:', error);
            } finally {
                setLoadingProducts(false);
            }
        };
        getData();
    }, [selectedCategoryId, setProduct]);

    // ฟังก์ชันสำหรับดึงสินค้าทุกหมวดหมู่ (เมื่อยังไม่เลือกหรือเลือกทุกหมวดหมู่)
    const getProductData = async () => {
        setLoadingProducts(true);
        try {
            const response = await axios.get(
                `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
            const data = Array.isArray(response.data.data) ? response.data.data : [];
            setProduct(data);
        } catch (error) {
            console.error('Error fetching getProductData:', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    // เมื่อมีการเปลี่ยนแปลงหมวดหมู่สินค้า
    const handleCateOptionChange = (event: any) => {
        const value = event.target.value;
        setSelectedCategoryId(value);
        // ถ้าเลือก "ทุกหมวดหมู่สินค้า" (value เป็นค่าว่าง) ให้ดึงสินค้าทั้งหมด
        if (value === "") {
            getProductData();
        } else {
            // กรณีเลือกหมวดหมู่ที่เจาะจง ให้เคลียร์รายการสินค้าแล้วรอการดึงข้อมูลใหม่
            setProduct([]);
        }
    };

    {/**************** จบ สินค้าในสต๊อกตัวเอง **********************/ }

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
    const [activeTab, setActiveTab] = useState<"categories" | "borrowing">("categories");

    const API_TSR_UAT = import.meta.env.VITE_APP_API_THIENSURAT_UAT;
    const PRODUCT_STOCK_ALL_COMPANY_URL = `${API_TSR_UAT}/ProductStock`;

    // const GET_BORROW_URL = (empid: string, teamSale: string, sn: string) =>
    //     `${API_TSR_UAT}/Product/GetBorrow?empid=${empid}&teamSale=${teamSale}&sn=${sn}`

    const MOVE_PRODUCT_STOCK_URL = `${API_TSR_UAT}/MoveProductInStock`;

    const UPDATE_STOCK_URL = `${API_URL_MONGO}/Product/UpdateStock`;

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

        navigate("/productstock/moveProductInStock");
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

    // ฟังก์ชันกดปุ่ม "ดูสินค้าเพิ่มเติม..."
    const handleShowMore = () => {
        setDisplayCount((prev) => prev + 10);
    };

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
        // ถ้ามีค่า tab === "borrowing" ให้สลับแท็บเป็น "borrowing"
        if (location.state?.tab === "borrowing") {
            setActiveTab("borrowing")
        }
        // ถ้ามีค่า barCode ให้เอามาใส่ใน scannedBarCode
        if (location.state?.barCode) {
            setActiveTab("borrowing");
            setScannedBarCode(location.state.barCode)
        }
    }, [location.state])

    useEffect(() => {
        if (!loadingStockAllProductCompany && location.state?.barCode) {
            const scannedSerial = location.state.barCode.trim().toLowerCase();

            // เริ่มต้นค้นหา -> แสดง Loading
            setIsSearchingBarcode(true);

            // ตั้ง timer เพื่อหน่วงเวลา 3 วินาที (3000 ms)
            const timer = setTimeout(() => {
                const foundIndex = stockAllProductCompany.findIndex(
                    (item) => item.SerialNo?.trim().toLowerCase() === scannedSerial
                );

                if (foundIndex >= 0) {
                    // ดึงรายการที่เจอ
                    const foundItem = stockAllProductCompany[foundIndex];

                    // เซตให้ state มีแค่รายการที่เจอ
                    setStockAllProductCompany([masterStockAllProductCompany[foundIndex]]);
                    // ไฮไลต์การ์ด index=0
                    setSelectedProductForBorrow(foundItem);

                    // ล้าง state.barCode กันสแกนซ้ำ
                    navigate("/productstock", { replace: true, state: {} });

                    // ค้นหาเสร็จแล้ว -> ปิด Loading
                    setIsSearchingBarcode(false);

                } else {
                    // ไม่พบสินค้า -> แจ้งเตือน และหยุดค้นหา
                    MySwal.fire({
                        icon: "warning",
                        title: "ไม่พบสินค้า",
                        text: "ไม่พบ SerialNo ในระบบ"
                    });

                    // ปิด Loading
                    setIsSearchingBarcode(false);
                }
            }, 3000);

            // Cleanup function สำหรับยกเลิก timer ถ้า component ถูก unmount ก่อนครบ 3 วินาที
            return () => clearTimeout(timer);
        }
    }, [
        loadingStockAllProductCompany,
        scannedBarCode,
        masterStockAllProductCompany,
        MySwal,
        navigate
    ]);

    // ฟังก์ชันจัดการคลิกการ์ด
    const handleCardClick = (item: any) => {
        setSelectedProductForBorrow(item)
    }

    // ฟังก์ชันสำหรับกด "ยืมสินค้า"
    // ฟังก์ชันสำหรับกด "ยืมสินค้า"
    const handleBorrowProduct = async () => {
        if (!selectedProductForBorrow) {
            MySwal.fire({
                icon: 'warning',
                title: 'กรุณาเลือกสินค้า',
                text: 'ยังไม่ได้เลือกสินค้าที่ต้องการยืม',
            })
            return
        }

        try {
            // 1) เรียก GET_BORROW_URL เพื่อตรวจสอบสถานะก่อน
            const url = `${API_URL_MONGO}/Product/GetBorrow?empid=${selectedProductForBorrow.EmpId}&teamSale=${selectedProductForBorrow.TeamSale}&sn=${selectedProductForBorrow.SerialNo}`;

            const borrowRes = await axios.get(url)
            const data = Array.isArray(borrowRes.data.data) ? borrowRes.data.data : [];

            if (borrowRes.status === 200) {
                // 2) ถ้าสามารถยืมได้ ก็เรียก API MoveProductInStock
                // ---- สร้าง FormData สำหรับส่งเป็น multipart/form-data ----
                const formData = new FormData()
                formData.append('RecordId', selectedProductForBorrow.RecordId)
                formData.append('SerialNo', selectedProductForBorrow.SerialNo)
                formData.append('TeamSale', TeamSale)
                formData.append('SaleCode', SaleCode)
                formData.append('EmpId', EmpId)
                formData.append('EmpName', EmpName)

                // console.log(`RecordId`, selectedProductForBorrow.RecordId);
                // console.log(`SerialNo`, selectedProductForBorrow.SerialNo);
                // console.log(`TeamSale`, TeamSale);
                // console.log(`SaleCode`, SaleCode);
                // console.log(`EmpId`, EmpId);
                // console.log(`EmpName`, EmpName);       

                // ---- เรียกใช้ axios.post พร้อม headers ----
                const moveRes = await axios.post(MOVE_PRODUCT_STOCK_URL, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                
                if (moveRes.status === 200) {
                    // ยืมสำเร็จ
                    MySwal.fire({
                        icon: 'success',
                        title: 'ยืมสินค้าเรียบร้อย',
                        text: 'สินค้าถูกย้ายเข้าสต๊อกของคุณแล้ว',
                    })
                    // ตัวอย่าง: อัปเดตข้อมูลใน Mongo ถ้าจำเป็น
                    axios.get(UPDATE_STOCK_URL)
                } else {
                    // MoveProductInStock ตอบไม่ 200
                    MySwal.fire({
                        icon: 'error',
                        title: 'ไม่สามารถยืมสินค้าได้',
                        text: moveRes.data?.message ?? 'เกิดข้อผิดพลาดบางอย่าง',
                    })
                }
            } else {
                MySwal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถยืมสินค้าได้',
                    text: 'สถานะไม่อนุญาตให้ยืม หรือไม่พบข้อมูล',
                })
            }
        } catch (error) {
            console.error(error)
            MySwal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถยืมสินค้าได้',
            })
        }
    }


    {/**************** จบ ระบบยืม **********************/ }

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
                            คลังสินค้า
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <a
                                    className="text-muted text-hover-primary"
                                    href="/metronic8/react/demo1/sales/overview"
                                >
                                    สินค้าในสต๊อก
                                </a>
                            </li>
                            <li className="breadcrumb-item">
                                <span className="bullet bg-gray-500 w-5px h-2px"></span>
                            </li>
                            <li className="breadcrumb-item text-gray-900">คลังสินค้า</li>
                        </ul>
                    </div>
                </div>

                {/* แท็บสำหรับแบ่งหน้าจอ */}
                <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === "categories" ? "active" : ""}`}
                            onClick={() => setActiveTab("categories")}
                            data-bs-toggle="tab"
                            href="#kt_tab_pane_categories"
                        >
                            คลังสินค้า
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === "borrowing" ? "active" : ""}`}
                            onClick={() => setActiveTab("borrowing")}
                            data-bs-toggle="tab"
                            href="#kt_tab_pane_borrowing"
                        >
                            ระบบยืมสินค้า
                        </a>
                    </li>
                </ul>

                <div className="tab-content">
                    {/* Tab 1: หมวดหมู่สินค้า */}
                    <div
                        className={`tab-pane fade ${activeTab === "categories" ? "show active" : ""}`}
                        id="kt_tab_pane_categories">
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
                                                <div className="row">
                                                    <div className="col-lg-6 my-7 my-xl-10">
                                                        <label className="form-label fw-bold fs-3">
                                                            หมวดหมู่สินค้า
                                                        </label>
                                                        <select
                                                            className="form-select form-select-solid form-select-lg"
                                                            onChange={handleCateOptionChange}
                                                            value={selectedCategoryId}
                                                        >
                                                            <option value="">
                                                                ทุกหมวดหมู่สินค้า
                                                            </option>
                                                            {(fetchCategory.length > 0 ? fetchCategory : categories).map(
                                                                (item: any, index: number) => (
                                                                    <option key={index} value={item.CATEGORIES_ID}>
                                                                        {item.CATEGORIES_NAME_TH}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* แสดง Loading */}
                                                {loadingProducts && (
                                                    <div className="text-center my-10">
                                                        <ThreeDot />
                                                    </div>
                                                )}

                                                <div>
                                                    {!loadingProducts && product.length > 0 && (
                                                        <label className="form-label required fw-bold fs-3 mt-7 mt-xl-10">
                                                            รายการสินค้า
                                                        </label>
                                                    )}
                                                    {!loadingProducts && (
                                                        <div className="row">
                                                            {product.map((item, index) => (
                                                                <div
                                                                    className="col-6 col-md-4 mb-3 rounded"
                                                                    key={index}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    <CardProductStockOnlyMe
                                                                        DescriptionTH={item.DescriptionTH}
                                                                        ItemDescription={item.ItemDescription}
                                                                        ItemCode={item.ItemCode}
                                                                        SerialNo={item.SerialNo}
                                                                    />
                                                                </div>
                                                            ))}
                                                            {!loadingProducts && product.length === 0 && (
                                                                <div className="text-center my-7">
                                                                    <h5>ไม่มีรายการสินค้า</h5>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab 2: ระบบยืมสินค้า */}
                    <div
                        className={`tab-pane fade ${activeTab === "borrowing" ? "show active" : ""}`}
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

                                                                {/* ช่องกรอกข้อความเพื่อค้นหา/กรองสินค้า */}
                                                                <div className="row mt-10">
                                                                    <div className="col-lg-6 my-3">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-solid form-control-lg"
                                                                            value={searchTerm}
                                                                            onChange={(e) => {
                                                                                // ถ้ามี scannedBarCode อยู่ แล้วผู้ใช้เริ่มพิมพ์ => ล้างค่า
                                                                                if (scannedBarCode) {
                                                                                    setScannedBarCode('');
                                                                                    setStockAllProductCompany(masterStockAllProductCompany);
                                                                                    setSelectedProductForBorrow(null)
                                                                                }
                                                                                setSearchTerm(e.target.value);
                                                                            }}
                                                                            placeholder="ค้นหาจาก หมวดหมู่, ชื่อสินค้า, Code, S/N"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* ตัวอย่าง: เช็ค isSearchingBarcode */}
                                                                {isSearchingBarcode ? (
                                                                    // ถ้า isSearchingBarcode เป็น true => แสดง Loading
                                                                    <div className="text-center my-10">
                                                                        <ThreeDot />
                                                                    </div>
                                                                ) : (
                                                                    // ถ้าไม่ใช่ (false) => แสดงรายการสินค้า
                                                                    <>
                                                                        {/* แสดง Loading ระหว่างดึงข้อมูลทั้งหมด (ถ้ายังไม่เสร็จ) */}
                                                                        {loadingStockAllProductCompany && (
                                                                            <div className="text-center my-10">
                                                                                <ThreeDot />
                                                                            </div>
                                                                        )}

                                                                        <div>
                                                                            {!isSearchingBarcode && !loadingStockAllProductCompany && stockAllProductCompany.length > 0 && (
                                                                                <label className="form-label required fw-bold fs-3 mt-7 mt-xl-10">
                                                                                    รายการสินค้า
                                                                                </label>
                                                                            )}

                                                                            {!loadingStockAllProductCompany && (
                                                                                <div className="row">
                                                                                    {filteredStockAllProductCompany.slice(0, displayCount).map((item, index) => (
                                                                                        <div
                                                                                            key={index}
                                                                                            className="col-6 col-md-4 mb-3 rounded"
                                                                                            style={{ cursor: 'pointer' }}
                                                                                            onClick={() => handleCardClick(item)}
                                                                                        >
                                                                                            <CardMoveProduct
                                                                                                DescriptionTH={item.DescriptionTH}
                                                                                                ItemDescription={item.ItemDescription}
                                                                                                ItemCode={item.ItemCode}
                                                                                                SerialNo={item.SerialNo}
                                                                                                isSelected={selectedProductForBorrow?.SerialNo === item.SerialNo}
                                                                                            />
                                                                                        </div>
                                                                                    ))}

                                                                                    {filteredStockAllProductCompany.length > displayCount && (
                                                                                        <div className="text-center my-6">
                                                                                            <button
                                                                                                type='button'
                                                                                                className="btn btn-link"
                                                                                                style={{ textDecoration: 'none' }}
                                                                                                onClick={handleShowMore}
                                                                                            >
                                                                                                <h4>ดูสินค้าเพิ่มเติม ...</h4>
                                                                                            </button>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
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
                    {/* จบ Tab 2: ระบบยืมสินค้า */}
                </div>

                <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
                    <Link
                        to="/"
                        className="btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0"
                    >
                        ย้อนกลับ
                    </Link>
                    {activeTab === "borrowing" && (
                        <button className="btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0"
                            disabled={!selectedProductForBorrow}
                            onClick={handleBorrowProduct}
                        >
                            ยืมสินค้า
                        </button>
                    )}
                </div>

                <div
                    className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1050,
                    }}
                >
                    <button className="btn btn-secondary w-auto me-2" onClick={() => navigate('/')}>
                        ย้อนกลับ
                    </button>
                    {activeTab === "borrowing" && (
                        <button className="btn btn-primary w-auto me-2"
                            disabled={!selectedProductForBorrow}
                            onClick={handleBorrowProduct}
                        >
                            ยืมสินค้า
                        </button>
                    )}
                </div>
            </Content>
        </>
    );
};

export default SalesProductStock;