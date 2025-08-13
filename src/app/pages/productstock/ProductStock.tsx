import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Content } from '../../../_metronic/layout/components/content';
import { useAuth } from '../../modules/auth/core/Auth';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ThreeDot } from 'react-loading-indicators';

// useStore
import {
    useFetchCategoryStore,
    useCategoryStore,
    useProductStore,
} from '../../modules/stores/sales/packageStore/packageStore';

import { SummaryStockOnlyMe } from './components/SummaryStockOnlyMe'
import { CardProductStockOnlyMe } from './components/CardProductStockOnlyMe';
import { CardProductStockWithdraw } from './components/CardProductStockWithdraw';

interface Category {
    CATEGORIES_ID: string;
    CATEGORIES_NAME_TH: string;
}

const SalesProductStock: React.FC = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();

    const MySwal = withReactContent(Swal);

    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const { fetchCategory } = useFetchCategoryStore();

    const [categories, setCategories] = useState<any[]>([]);
    // console.log(`categories`, categories);

    const { product, setProduct } = useProductStore();
    console.log(`product`, product);

    // เมื่อเริ่มต้นค่า selectedCategoryId เป็นค่าว่าง หมายถึง “ทุกหมวดหมู่”
    const [selectedCategoryId, setSelectedCategoryId] = useState<any>('');

    //เก็บ product แบบเต็มครั้งแรกไว้ตลอด
    const [initialProduct, setInitialProduct] = useState<any[]>([]);

    // เมื่อมาจากหน้า สแกนบารโค้ด ให้เข้าแท็บ ระบบยืมสินค้า ออโต้
    const [activeTab, setActiveTab] = useState<"stock" | "withdraw">("stock");

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

    const API_TSR_UAT = import.meta.env.VITE_APP_API_THIENSURAT_UAT;
    const PRODUCT_STOCK_ALL_COMPANY_URL = `${API_TSR_UAT}/ProductStock`;

    // const GET_BORROW_URL = (empid: string, teamSale: string, sn: string) =>
    //     `${API_TSR_UAT}/Product/GetBorrow?empid=${empid}&teamSale=${teamSale}&sn=${sn}`

    const MOVE_PRODUCT_STOCK_URL = `${API_TSR_UAT}/MoveProductInStock`;
    const GET_STOCK_URL = `${API_URL_MONGO}/Product/GetStock`;
    const GET_STOCK_WITHDRAW = `${API_TSR_UAT}/ProductStock/GetStock`
    const ACCEPT_PRODUCT_URL = `${API_TSR_UAT}/ProductStock/AcceptProduct`;

    const UPDATE_STOCK_URL = `${API_URL_MONGO}/Product/UpdateStock`;

    {/**************** สินค้าในสต๊อกตัวเอง **********************/ }

    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const form = new FormData();
                form.append('EmpId', auth.data[0].EmpId);
                form.append('DivisionId', auth.data[0].DivisionId);
                form.append('DepartId', auth.data[0].DepartId);
                form.append('DepartGroup', auth.data[0].DepartGroup);
                form.append('TeamSale', auth.data[0].TeamSale);

                const res = await axios.post(CATEGORIES_URL, form);
                const data = Array.isArray(res.data.data) ? res.data.data : [];
                setCategories(data);

                // initialize user context
                setEmpId(auth.data[0].EmpId);
                setTeamSale(auth.data[0].TeamSale);
                setSaleCode(auth.data[0].SaleCode);
                setSupEmpId(auth.data[0].SupEmp);
                setSecEmpId(auth.data[0].SecEmp);
                setDivisionId(auth.data[0].DivisionId);
                setDepartId(auth.data[0].DepartId);
                setDepartGroup(auth.data[0].DepartGroup);
            } catch (e) {
                console.error('Error fetching categories:', e);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, [auth]);

    // 1) ดึงสินค้า “ทุกหมวดหมู่” ครั้งแรก
    const fetchAllProducts = async () => {
        setLoadingProducts(true)
        try {
            const params = new URLSearchParams({ empid: EmpId, teamSale: TeamSale })
            const res = await axios.get(`${GET_STOCK_URL}?${params.toString()}`)
            const data = Array.isArray(res.data.data) ? res.data.data : []
            setProduct(data)
            setInitialProduct(data)
        } finally {
            setLoadingProducts(false)
        }
    }
    const fetchProductsByCategory = async (categoryId: string) => {
        setLoadingProducts(true)
        try {
            const params = new URLSearchParams({ empid: EmpId, teamSale: TeamSale })
            if (categoryId) params.append('categoryId', categoryId)
            const res = await axios.get(`${GET_STOCK_URL}?${params.toString()}`)
            const data = Array.isArray(res.data.data) ? res.data.data : []
            setProduct(data)
        } finally {
            setLoadingProducts(false)
        }
    }

    // initial load
    useEffect(() => {
        if (EmpId && TeamSale) fetchAllProducts()
    }, [EmpId, TeamSale])

    // filter by category
    const handleCateOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cat = e.target.value
        setSelectedCategoryId(cat)
        if (cat) fetchProductsByCategory(cat)
        else fetchAllProducts()
    }

    // optional: เวลาสลับแท็บกลับมาที่ stock ก็ fetch ใหม่ให้อัตโนมัติ
    useEffect(() => {
        if (activeTab === 'stock') {
            // รีเฟรชข้อมูลทุกครั้งที่กลับมาแท็บคลัง
            if (selectedCategoryId) fetchProductsByCategory(selectedCategoryId)
            else fetchAllProducts()
        }
    }, [activeTab])

    {/**************** จบ สินค้าในสต๊อกตัวเอง **********************/ }

    {/**************** สินค้าเบิกใหม่ **********************/ }

    const [getStockWithDraw, setGetStockWithDraw] = useState<any[]>([]);
    console.log(`getStockWithDraw`, getStockWithDraw);

    const [loadingStockWithDraw, setLoadingStockWithDraw] = useState(false);

    useEffect(() => {
        fetchStock();
    }, [EmpId, TeamSale, selectedCategoryId]);

    // วางไว้ใน component หลัก (SalesProductStock) ร่วมกับ handleBorrowProduct
    const handleAcceptProduct = async (item: any) => {
        const formData = new FormData();
        formData.append("EmpID", EmpId);
        formData.append("TeamSale", TeamSale);
        formData.append("RecordId", item.RecordId);
        formData.append("SerialNo", item.SerialNo);

        try {
            const res = await axios.post(ACCEPT_PRODUCT_URL, formData);
            if (res.status === 200) {
                axios.get(UPDATE_STOCK_URL)
                MySwal.fire({
                    icon: "success",
                    title: "บันทึกข้อมูลสำเร็จ",
                    timer: 2000,
                    showConfirmButton: false, 
                });
                // รีเฟรชรายการใหม่
                // เรียก fetchStock ภายใน useEffect หรือแยกเป็นฟังก์ชันแล้วเรียกซ้ำ
                fetchStock();
            } else {
                throw new Error(res.data?.message || "เกิดข้อผิดพลาด");
            }
        } catch (err: any) {
            console.error(err);
            MySwal.fire({
                icon: "error",
                title: "ไม่สามารถรับสินค้าได้",
                text: err.message || "เกิดข้อผิดพลาดบางอย่าง",
            });
        }
    };

    // แทนที่ใน useEffect เดิม
    const fetchStock = async () => {
        setLoadingStockWithDraw(true);
        try {
            const form = new FormData();
            form.append("EmpID", EmpId);
            form.append("TeamSale", TeamSale);
            form.append("CategoriesId", selectedCategoryId);

            const response = await axios.post(GET_STOCK_WITHDRAW, form);
            const data = Array.isArray(response.data.data) ? response.data.data : [];
            setGetStockWithDraw(data);
        } catch (error) {
            console.error("Error fetching getStockWithDraw:", error);
        } finally {
            setLoadingStockWithDraw(false);
        }
    };

    useEffect(() => {
        fetchStock();
    }, [EmpId, TeamSale]);

    {/* **************** จบ สินค้าเบิกใหม่ **********************/ }

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
                            สินค้าในสต๊อก
                        </h1>
                    </div>
                </div>

                {/* แท็บสำหรับแบ่งหน้าจอ */}
                <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === "stock" ? "active" : ""}`}
                            onClick={() => setActiveTab("stock")}
                            data-bs-toggle="tab"
                            href="#kt_tab_pane_categories"
                        >
                            คลังสินค้า
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === "withdraw" ? "active" : ""}`}
                            onClick={() => setActiveTab("withdraw")}
                            data-bs-toggle="tab"
                            href="#kt_tab_pane_borrowing"
                        >
                            สินค้าเบิกใหม่
                        </a>
                    </li>
                </ul>

                <div className="tab-content">
                    {/* Tab 1: หมวดหมู่สินค้า */}
                    <div
                        className={`tab-pane fade ${activeTab === "stock" ? "show active" : ""}`}
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

                                                {/* สรุป */}
                                                <SummaryStockOnlyMe
                                                    initialProduct={initialProduct}
                                                />
                                                {/* สรุป */}

                                                {/* แถวแรก: หมวดหมู่ */}
                                                <div className="row my-10">
                                                    <div className="col-12 col-lg-6">
                                                        <label className="form-label fw-bold fs-3">
                                                            หมวดหมู่สินค้า
                                                        </label>
                                                        <select
                                                            className="form-select"
                                                            value={selectedCategoryId}
                                                            onChange={handleCateOptionChange}
                                                        >
                                                            <option value="">ทุกหมวดหมู่สินค้า</option>
                                                            {categories.map(c => (
                                                                <option
                                                                    key={c.CATEGORIES_ID}
                                                                    value={c.CATEGORIES_ID}
                                                                >
                                                                    {c.CATEGORIES_NAME_TH}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* แถวที่สอง: กริดการ์ด กว้างเต็ม */}
                                                <div className="row g-4">
                                                    {product.map(item => (
                                                        <div key={item.RecordId} className="col-lg-4">
                                                            <CardProductStockOnlyMe
                                                                DescriptionTH={item.DescriptionTH}
                                                                ItemDescription={item.ItemDescription}
                                                                ItemCode={item.ItemCode}
                                                                SerialNo={item.SerialNo}
                                                                TransDate={item.TransDate}
                                                                ExtDate={item.ExtDate}
                                                            />
                                                        </div>
                                                    ))}
                                                    {product.length === 0 && (
                                                        <div className="col-12 text-center py-5">
                                                            <h5>ไม่มีรายการสินค้า</h5>
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
                    {/* จบ Tab 1: หมวดหมู่สินค้า */}

                    {/* Tab 2: หมวดหมู่สินค้า */}
                    <div
                        className={`tab-pane fade ${activeTab === "withdraw" ? "show active" : ""}`}
                        id="kt_tab_pane_categories">
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
                                                {loadingStockWithDraw && (
                                                    <div className="text-center my-10">
                                                        <ThreeDot />
                                                    </div>
                                                )}

                                                <div>
                                                    {!loadingStockWithDraw && getStockWithDraw.length > 0 && (
                                                        <label className="form-label required fw-bold fs-3 mt-7 mt-xl-10">
                                                            รายการสินค้า
                                                        </label>
                                                    )}
                                                    {!loadingStockWithDraw && (
                                                        <div className="row">
                                                            <div className="row">
                                                                {getStockWithDraw.map((item, index) => (
                                                                    <div className="col-lg-4 mb-3" key={index}>
                                                                        <CardProductStockWithdraw
                                                                            DescriptionTH={item.DescriptionTH}
                                                                            ItemDescription={item.ItemDescription}
                                                                            ItemCode={item.ItemCode}
                                                                            SerialNo={item.SerialNo}
                                                                            TransDate={item.TransDate}
                                                                            ExtDate={item.ExtDate}
                                                                            onAccept={() => handleAcceptProduct(item)}    // <-- ส่ง handler เข้าไป
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {getStockWithDraw.length === 0 && (
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
                    {/* จบ Tab 2: หมวดหมู่สินค้า */}
                </div >

            </Content >
        </>
    );
};

export default SalesProductStock;