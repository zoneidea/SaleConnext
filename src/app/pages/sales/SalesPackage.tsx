import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Content } from '../../../_metronic/layout/components/content';
import { useAuth } from '../../modules/auth/core/Auth';

//useStore
import {
    useCategoryStore,
    useFetchCategoryStore,
    useProductStore,
    usePackageStore
} from '../../modules/stores/sales/packageStore/packageStore';

//component
import { CardProduct } from './components/cards/CardProduct';
import { CardPackage } from './components/cards/CardPackage';

const SalesPackage: React.FC = () => {
    const { auth } = useAuth();
    const [categories, setCategories] = useState<any[]>([]);
    const [packageType, setPackageType] = useState<any[]>([]);
    const [packageList, setPackageList] = useState<any[]>([]);

    const [selectedCategoryId, setSelectedCategoryId] = useState<any>('');
    const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
    const [selectedPackageTypeId, setSelectedPackageTypeId] = useState<number | null>(null);
    const [selectedPackageModel, setSelectedPackageModel] = useState<number | null>(null);

    const {
        EmpId, setEmpId,
        DivisionId, setDivisionId,
        DepartId, setDepartId,
        DepartGroup, setDepartGroup,
        TeamSale, setTeamSale,
    } = useCategoryStore();

    const { fetchCategory } = useFetchCategoryStore();
    const { product, setProduct } = useProductStore();
    const { ItemID, setItemID, PackageTypeID, setPackageTypeID } = usePackageStore();

    const API_URL_POST_CATEGORIES = import.meta.env.VITE_APP_API_POST_CATEGORIES;
    const CATEGORIES_URL = `${API_URL_POST_CATEGORIES}/Categories`;

    const API_URL_GET_PRODUCT = import.meta.env.VITE_APP_API_GET_PRODUCT;
    const getProductUrl = () => `${API_URL_GET_PRODUCT}/empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`;

    const API_URL_GET_PACKAGE = import.meta.env.VITE_APP_API_GET_PACKAGE;
    const PACKAGE_URL = `${API_URL_GET_PACKAGE}/PackageType`;
    const POST_PACKAGE_URL = `${API_URL_GET_PACKAGE}/PackageList`;

    // สร้าง ref สำหรับส่วนแพ็คเกจ
    const packageSectionRef = useRef<HTMLDivElement>(null);

    // log เฉพาะเมื่อ selectedCategoryId หรือ selectedCardIndex หรือ selectedPackageTypeId เปลี่ยนแปลง
    useEffect(() => {
        console.log(fetchCategory, fetchCategory);
    }, [fetchCategory]);

    console.log('selectedCategoryId: ', selectedCategoryId);
    console.log('selectedProductIndex: ', selectedProductIndex);
    console.log('selectedPackageTypeId: ', selectedPackageTypeId);
    console.log('selectedPackageModel: ', selectedPackageModel);

    // POST GetProduct/Categories
    useEffect(() => {
        const postData = async () => {
            try {
                const response = await axios.post(CATEGORIES_URL, { EmpId, DivisionId, DepartId, DepartGroup, TeamSale }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setCategories(data);
            } catch (error) {
                console.error('Error fetching CATEGORIES_URL:', error);
            }

            setEmpId(auth.data[0].EmpId);
            setDivisionId(auth.data[0].DivisionId);
            setDepartId(auth.data[0].DepartId);
            setDepartGroup(auth.data[0].DepartGroup);
            setTeamSale(auth.data[0].TeamSale);
        };
        postData();
    }, [EmpId, DivisionId, DepartId, DepartGroup, TeamSale, auth]);

    // GET Product/GetStock?
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
                setProduct(data);
            } catch (error) {
                console.error('Error fetching getProductUrl:', error);
            }
        };
        getData();
    }, [categories, selectedCategoryId, setProduct]);

    // GET GetPackage/PackageType
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
                console.error('Error fetching PACKAGE_URL:', error);
            }
        };
        getData();
    }, []);

    // POST GetPackage/PackageList
    useEffect(() => {
        const postData = async () => {
            try {
                const response = await axios.post(POST_PACKAGE_URL, { EmpId, DivisionId, DepartId, DepartGroup, TeamSale, ItemID, PackageTypeID }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setPackageList(data);
            } catch (error) {
                console.error('Error fetching POST_PACKAGE_URL:', error);
            }

            setEmpId(EmpId);
            setDivisionId(DivisionId);
            setDepartId(DepartId);
            setDepartGroup(DepartGroup);
            setTeamSale(TeamSale);
            setItemID(ItemID);
            setPackageTypeID(PackageTypeID);
        };
        postData();
    }, [EmpId, DivisionId, DepartId, DepartGroup, TeamSale, ItemID, PackageTypeID]);

    const handleCateOptionChange = (event: any) => {
        const value = event.target.value;
        setSelectedCategoryId(value);

        if (selectedCategoryId === null) {
            setSelectedProductIndex(null);
            setSelectedPackageTypeId(null);
            setSelectedPackageModel(null);
        }
    };

    const handleCardProductClick = (index: number) => {
        setSelectedProductIndex(index);
        if (selectedCategoryId === null) {
            setSelectedProductIndex(null);
            setSelectedPackageTypeId(null);
            setSelectedPackageModel(null);
        }
    };

    //เปลี่ยนสไตล์เป็น success เมื่อเลือกปุ่ม package และเลื่อนลงมายังส่วนแพ็คเกจ
    const handlePackageTypeClick = (index: number) => {
        setSelectedPackageTypeId(index);
        if (selectedCategoryId === null) {
            setSelectedProductIndex(null);
            setSelectedPackageTypeId(null);
            setSelectedPackageModel(null);
        }

        // Scroll the page to the package section
        if (packageSectionRef.current) {
            packageSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handlePackageModelClick = (index: number) => {
        setSelectedPackageModel(index);
        if (selectedCategoryId === null) {
            setSelectedPackageModel(null);
        }
    };

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-10 mt-lg-0'>
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
                                aria-expanded='true'
                                aria-controls='kt_accordion_1_body_1'
                                style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                            >
                                เลือกแพ็คเกจ
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
                                        <div className='row'>
                                            <div className='col-lg-6 my-7 my-xl-10'>
                                                <label className='form-label required fw-bold fs-3'>หมวดหมู่สินค้า</label>
                                                <select
                                                    className='form-select form-select-solid form-select-lg'
                                                    onChange={handleCateOptionChange}
                                                >
                                                    <option value=''>เลือกหมวดหมู่สินค้า...</option>
                                                    {fetchCategory.map((item, index) => (
                                                        <option key={index} value={item.CATEGORIES_ID}>
                                                            {item.CATEGORIES_NAME_TH}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {selectedCategoryId.length > 0 && product.length > 0 ? (
                                            <label className='form-label required fw-bold fs-3 mt-7 mt-xl-10'>รายการสินค้า</label>
                                        ) : ('')}
                                        {selectedCategoryId.length > 0 && (
                                            <div className='row '>
                                                {product.map((item, index) => (
                                                    <div
                                                        className='col-6 col-md-4 mb-3 rounded'
                                                        key={index}
                                                        onClick={() => handleCardProductClick(index)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <CardProduct
                                                            DescriptionTH={item.DescriptionTH}
                                                            ItemDescription={item.ItemDescription}
                                                            ItemCode={item.ItemCode}
                                                            SerialNo={item.SerialNo}
                                                            isSelected={selectedProductIndex === index}
                                                        />
                                                    </div>
                                                ))}
                                                {product.length !== 0 ? (
                                                    <div className='container my-10 my-xl-10'>
                                                        <div className='row d-flex'>
                                                            <label className='form-label required fw-bold fs-3'>ประเภทการชำระ</label>
                                                            {packageType.map((item, index) => (
                                                                <div className='col-6 col-md-auto mb-2 d-flex align-items-center'>
                                                                    <div
                                                                        key={item.PACKAGETYPEID}
                                                                        className={`border rounded w-100 w-md-auto h-60px 
                                                                            d-flex justify-content-center align-items-center fw-bold fs-6 px-5`}
                                                                        style={{
                                                                            backgroundColor: selectedPackageTypeId === item.PACKAGETYPEID ? '#ACE1AF' : '#fcfcfc',
                                                                            transition: 'background-color 0.2s ease, color 0.2s ease',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                        onClick={() => handlePackageTypeClick(item.PACKAGETYPEID)}
                                                                    >
                                                                        {item.PACKAGETYPENAME}
                                                                    </div>
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
                                        {/* ส่วนของแพ็คเกจที่จะเลื่อนมาที่นี่ */}
                                        {selectedPackageTypeId !== null && selectedCategoryId.length > 0 && product.length > 0 && packageList.length > 0 ? (
                                            <div className='my-10 my-xl-10' ref={packageSectionRef}>
                                                <div className='row d-flex'>
                                                    <label className='form-label required fw-bold fs-3'>แพ็คเกจ</label>
                                                    {packageList.map((item, index) => (
                                                        <div
                                                            className='col-12 col-md-auto col-sm-auto mb-2'
                                                            key={item.MODEL}
                                                            onClick={() => handlePackageModelClick(index)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <CardPackage
                                                                PackageTitle={item.PACKAGETITLE}
                                                                isSelected={selectedPackageModel === index}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : ('')}
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
                    <Link to='/sale/statuscust' className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        ถัดไป
                    </Link>
                </div>
            </Content>
        </>
    );
}

export default SalesPackage;