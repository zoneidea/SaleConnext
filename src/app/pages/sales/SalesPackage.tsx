import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Content } from '../../../_metronic/layout/components/content';
import { useAuth } from '../../modules/auth/core/Auth';

//useStore
import { useCategoryStore, useFetchCategoryStore, useProductStore } from '../../modules/stores/sales/packageStore/packageStore';

//component
import { CardProduct } from './components/cards/CardProduct';

const SalesPackage: React.FC = () => {
    const { auth } = useAuth();
    const [categories, setCategories] = useState<any[]>([]);
    const [packageType, setPackageType] = useState<any[]>([]);

    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    console.log(`selectedCategoryId: `, selectedCategoryId);

    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    console.log(`selectedCardIndex: `, selectedCardIndex);

    const {
        EmpId, setEmpId,
        DivisionId, setDivisionId,
        DepartId, setDepartId,
        DepartGroup, setDepartGroup,
        TeamSale, setTeamSale,
    } = useCategoryStore();
    console.log(`EmpId: `,);
    
    const { product, setProduct } = useProductStore();

    const API_URL_POST_CATEGORIES = import.meta.env.VITE_APP_API_POST_CATEGORIES;
    const CATEGORIES_URL = `${API_URL_POST_CATEGORIES}/Categories`;

    const API_URL_GET_PRODUCT = import.meta.env.VITE_APP_API_GET_PRODUCT;
    const getProductUrl = () => `${API_URL_GET_PRODUCT}/empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`;

    const API_URL_GET_PACKAGE = import.meta.env.VITE_APP_API_GET_PACKAGE;
    const PACKAGE_URL = `${API_URL_GET_PACKAGE}/PackageType`;

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
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            setEmpId(auth.data[0].EmpId);
            setDivisionId(auth.data[0].DivisionId);
            setDepartId(auth.data[0].DepartId);
            setDepartGroup(auth.data[0].DepartGroup);
            setTeamSale(auth.data[0].TeamSale);
        };
        postData();
    }, [EmpId, DivisionId, DepartId, DepartGroup, TeamSale, auth]);

    useEffect(() => {
        const getData = async () => {
            if (!selectedCategoryId) return;

            try {
                const response = await axios.get(getProductUrl(), {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setProduct(data); // อัปเดต product ลงใน Zustand store
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getData();
    }, [categories, selectedCategoryId, setProduct]);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(PACKAGE_URL, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setPackageType(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getData();
    }, []);

    const handleCateOptionChange = (event: any) => {
        const value = event.target.value;
        setSelectedCategoryId(value);

        // ถ้าเลือกเป็น "เลือกหมวดหมู่สินค้า..." จะล้างค่าการเลือก card
        if (value === '') {
            setSelectedCardIndex(null);
            setSelectedPackageTypeId(null);
        }
    };

    const handleCardClick = (index: number) => {
        setSelectedCardIndex(index);
        if (selectedCategoryId === null) {
            setSelectedCardIndex(null);
        }
    };

    //เปลี่ยนสไตล์เป็น success เมื่อเลือกปุ่ม package
    const [selectedPackageTypeId, setSelectedPackageTypeId] = useState<number | null>(null);
    console.log(`selectedPackageTypeId: `, selectedPackageTypeId);
    const handleButtonClick = (id: number) => {
        setSelectedPackageTypeId(id);
    };

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-1 mt-lg-0'>
                    <div className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            เลือกแพ็คเกจ
                        </h1>
                    </div>
                </div>

                <div className='accordion mb-10' id='kt_accordion_1'>
                    <div className='accordion-item mb-10'>
                        <h2 className='accordion-header' id='kt_accordion_1_header_1'>
                            <h3
                                className='accordion-button fs-4 fw-bold border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                data-bs-toggle='collapse'
                                data-bs-target='#kt_accordion_1_body_1'
                                aria-expanded='true'  // ทำให้ปุ่ม accordion เปิดค่าเริ่มต้น
                                aria-controls='kt_accordion_1_body_1'
                                style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                            >
                                เลือกแพ็คเกจ
                            </h3>
                        </h2>
                        <div
                            id='kt_accordion_1_body_1'
                            className='accordion-collapse collapse show'  // ใช้ class 'show' เพื่อแสดง accordion ทันที
                            aria-labelledby='kt_accordion_1_header_1'
                            data-bs-parent='#kt_accordion_1'
                        >
                            <div className='accordion-body'>
                                <form noValidate className='form'>
                                    <div className='card-body px-lg-9 px-1'>
                                        <div className='row mb-6'>
                                            <div className='col-lg-6 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>หมวดหมู่สินค้า</label>
                                                <select
                                                    className='form-select form-select-solid form-select-lg'
                                                    onChange={handleCateOptionChange}
                                                >
                                                    <option value=''>เลือกหมวดหมู่สินค้า...</option>
                                                    {categories.map((item, index) => (
                                                        <option key={index} value={item.CATEGORIES_ID}>
                                                            {item.CATEGORIES_NAME_TH}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {selectedCategoryId !== '' && (
                                            <div className='row'>
                                                {product.map((item, index) => (
                                                    <div
                                                        className={`col-6 col-md-4 mb-3 ${selectedCardIndex === index ? 'border border-success' : ''}`}
                                                        key={index}
                                                        onClick={() => handleCardClick(index)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <CardProduct
                                                            DescriptionTH={item.DescriptionTH}
                                                            ItemDescription={item.ItemDescription}
                                                            ItemCode={item.ItemCode}
                                                            SerialNo={item.SerialNo}
                                                        />
                                                    </div>
                                                ))}
                                                {product.length !== 0 ? (
                                                    <div className='container mt-10'>
                                                        <div className='row d-flex'>
                                                            {packageType.map((item, index) => (
                                                                <div className='col-6 col-md-auto mb-2' key={item.PACKAGETYPEID}>
                                                                    <button
                                                                        type="button"
                                                                        className={`btn w-100 w-md-auto h-60px ${selectedPackageTypeId === item.PACKAGETYPEID ? 'btn-success' : 'btn-secondary'}`}
                                                                        onClick={() => handleButtonClick(item.PACKAGETYPEID)}
                                                                        value={item.PACKAGETYPEID}
                                                                    >
                                                                        {item.PACKAGETYPENAME}
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className='text-center my-7'>
                                                        <h5>ไม่มีรายการสินค้า</h5>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                    <Link to='/sale/scanbarcode' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        ย้อนกลับ
                    </Link>
                    <Link to='/sale/product' className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        ถัดไป
                    </Link>
                </div>
            </Content>
        </>
    );
}

export default SalesPackage;