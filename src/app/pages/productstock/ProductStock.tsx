import { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Content } from '../../../_metronic/layout/components/content'
import { SalesItemNumber } from '../sales/components/salesItemNumber/SalesItemNumber'

import { useAuth } from '../../modules/auth/core/Auth';

//useStore
import {
    useCategoryStore,
    useProductStore,
} from '../../modules/stores/sales/packageStore/packageStore';

import { CardProduct } from '../sales/components/cards/CardProduct';

const SalesProductStock: React.FC = () => {
    const navigate = useNavigate(); // ใช้ useNavigate สำหรับการเปลี่ยนเส้นทาง

    const { auth } = useAuth();

    const [loadingCategories, setLoadingCategories] = useState(true); // เพิ่ม state สำหรับการโหลดหมวดหมู่
    const [loadingProducts, setLoadingProducts] = useState(false); // เพิ่ม state สำหรับการโหลดสินค้า

    const [categories, setCategories] = useState<any[]>([]);
    const {product, setProduct } = useProductStore();
    const [selectedCategoryId, setSelectedCategoryId] = useState<any>('');
    const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);

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

    const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
    const CATEGORIES_URL = `${API_SALECONNEXT}/GetProduct/Categories`;

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const getProductUrl = () => `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`;

    // const getCategoryLocal = localStorage.getItem("fetchCategory");
    // const parsegetCategoryLocal = getCategoryLocal ? JSON.parse(getCategoryLocal) : null;

    // POST GetProduct/Categories
    useEffect(() => {
        const postData = async () => {
            try {
                const response = await axios.post(CATEGORIES_URL,
                    { EmpId, DivisionId, DepartId, DepartGroup, TeamSale }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setCategories(data);
                setLoadingCategories(false);
            } catch (error) {
                console.error('Error fetching CATEGORIES_URL:', error);
                setLoadingCategories(false);
            }

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
        getProductData();
    }, [EmpId, TeamSale, SaleCode, SupEmpId, SecEmpId, DivisionId, DepartId, DepartGroup, auth]);

    // GET Product/GetStock?
    useEffect(() => {
        const getData = async () => {
            if (!selectedCategoryId) return;
            setLoadingProducts(true); // ตั้งค่า state ให้เริ่มโหลดสินค้า

            try {
                const response = await axios.get(getProductUrl(), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setProduct(data);
            } catch (error) {
                console.error('Error fetching getProductUrl:', error);
            } finally {
                setLoadingProducts(false); // เสร็จสิ้นการโหลดสินค้า
            }
        };
        getData();
    }, [categories, selectedCategoryId, setProduct]);

    const getProductData = async () => {
        setLoadingProducts(true); // ตั้งค่า state ให้เริ่มโหลดสินค้า
        try {
            const response = await axios.get(`${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            const data = Array.isArray(response.data.data) ? response.data.data : [];
            setProduct(data);
        } catch (error) {
            console.error('Error fetching getProductUrl:', error);
        } finally {
            setLoadingProducts(false); // เสร็จสิ้นการโหลดสินค้า
        }
    };

    const handleCateOptionChange = (event: any) => {
        const value = event.target.value;
        setSelectedCategoryId(value);

        // ล้างข้อมูล product ทันทีเมื่อเลือกหมวดหมู่ใหม่
        setProduct([]);

        // ล้างค่าที่เลือกสำหรับ product, packageType, และ packageModel
        // setSelectedProductIndex(null);
        // setSelectedPackageTypeId(null);
        // setSelectedPackageModel(null);
    };

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-1 mt-lg-0'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            คลังสินค้า
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
                                    สินค้าในสต๊อก
                                </a></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">คลังสินค้า</li>
                        </ul>
                    </div>
                </div>
                <div className='accordion mb-10' id='kt_accordion_1'>
                    <div className='accordion-item mb-10'>
                        <div
                            id='kt_accordion_1_body_1'
                            className='accordion-collapse collapse show'
                            aria-labelledby='kt_accordion_1_header_1'
                            data-bs-parent='#kt_accordion_1' >
                            <div className='accordion-body'>
                                <form noValidate className='form'>
                                    <div className='card-body px-lg-9 px-1'>
                                        <div className='row'>
                                            <div className='col-lg-6 my-7 my-xl-10'>
                                                <label className='form-label fw-bold fs-3'>หมวดหมู่สินค้า</label>
                                                <select
                                                    className='form-select form-select-solid form-select-lg'
                                                    onChange={handleCateOptionChange}
                                                >
                                                    <option value=''>เลือกหมวดหมู่สินค้า...</option>
                                                    {categories.map((item: any, index: number) => (
                                                        <option key={index} value={item.CATEGORIES_ID}>
                                                            {item.CATEGORIES_NAME_TH}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {selectedCategoryId.length > 0 && product.length > 0 ? (
                                            <label className='form-label fw-bold fs-3 mt-7 mt-xl-10'>รายการสินค้า</label>
                                        ) : ('')}
                                        <div className='row '>
                                            {product.map((item, index) => (
                                                <div
                                                    className='col-6 col-md-4 mb-3 rounded'
                                                    key={index}
                                                    style={{ cursor: 'pointer' }} >
                                                    <CardProduct
                                                        DescriptionTH={item.DescriptionTH}
                                                        ItemDescription={item.ItemDescription}
                                                        ItemCode={item.ItemCode}
                                                        SerialNo={item.SerialNo}
                                                        isSelected={selectedProductIndex === index} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                    <Link to='/sale/overview' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        ย้อนกลับ
                    </Link>
                </div>
            </Content>
        </>
    )
}

export default SalesProductStock