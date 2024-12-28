import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Content } from '../../../_metronic/layout/components/content';
import { useAuth } from '../../modules/auth/core/Auth';
import { useUUIDStore, useSaveProductStore } from '../../modules/stores/stepsStore';
import '/public/splash-screen.css';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { ThreeDot } from 'react-loading-indicators';

//useStore
import {
    useCategoryStore,
    useFetchCategoryStore,
    useProductStore,
    usePackageStore,
    useConditionsCheckHistoryStore
} from '../../modules/stores/sales/packageStore/packageStore';

//component
import { CardProduct } from './components/cards/CardProduct';
import { CardPackage } from './components/cards/CardPackage';

const SalesPackage: React.FC = () => {
    // State สำหรับตรวจสอบสถานะการโหลด
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false)
    const [loadingPackages, setLoadingPackages] = useState(true)

    const navigate = useNavigate(); // ใช้ useNavigate สำหรับการเปลี่ยนเส้นทาง
    const MySwal = withReactContent(Swal);

    const { REFNO } = useUUIDStore();

    const { auth } = useAuth();

    const { fetchCategory } = useFetchCategoryStore();
    // console.log(`fetchCategory: `, fetchCategory);

    const [categories, setCategories] = useState<any[]>([]);
    // console.log(`categories`, categories);

    const [promotion, setPromotion] = useState<any[]>([]);
    // console.log(`promotion`, promotion);

    const [packageType, setPackageType] = useState<any[]>([]);
    // console.log(`packageType: `, packageType);

    const [packageList, setPackageList] = useState<any[]>([]);
    // console.log(`packageList: `, packageList);

    const [selectedCategoryId, setSelectedCategoryId] = useState<any>('');

    const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
    // console.log(`selectedProductIndex: `, selectedProductIndex);

    const [selectedItemCode, setSelectedItemCode] = useState<string | null>(null);
    // console.log(`selectedItemCode: `, selectedItemCode);

    const [selectedItemDescription, setSelectedItemDescription] = useState<string | null>(null);
    const [selectedDescriptionEN, setSelectedDescriptionEN] = useState<string | null>(null);
    const [selectedDescriptionTH, setSelectedDescriptionTH] = useState<string | null>(null);
    const [selectedSerialNo, setSelectedSerialNo] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [selectedTransDate, setSelectedTransDate] = useState<string | null>(null);
    const [productId, setProductId] = useState(null);  // สร้าง state สำหรับเก็บ _id
    // console.log(`productId: `, productId);

    const [selectedPackageTypeId, setSelectedPackageTypeId] = useState<number | null>(null);
    const [selectedPackageModel, setSelectedPackageModel] = useState<number | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<any>('');
    // console.log(`selectedProductId`, selectedProductId);
    const [selectedPromotion, setSelectedPromotion] = useState<string | number>('');
    // console.log(`selectedPromotion`, selectedPromotion);

    const [checktype, setChecktype] = useState<number | null>(null);
    // console.log(`checktype`, checktype);

    const [Search, setSearch] = useState<string>(''); // เก็บค่าของเลขบัตรประชาชน
    // console.log(`Search: `, Search);

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
    // console.log(`EmpId`, EmpId);
    // console.log(`EmpId`, EmpId);

    // const getCategoryLocal = localStorage.getItem("fetchCategory");
    // const parseGetCategoryLocal = getCategoryLocal ? JSON.parse(getCategoryLocal) : null;

    const { product, setProduct } = useProductStore();
    // console.log(`product: `, product);

    const { ItemID, setItemID, PackageTypeID, setPackageTypeID } = usePackageStore();

    const { Model, setModel } = useConditionsCheckHistoryStore();

    const { PRODUCT, SETPRODUCT } = useSaveProductStore();

    const SaveProductData = useMemo(() => [
        {
            EmpId: EmpId || '',
            TeamSale: TeamSale || '',
            SaleCode: "C000000000000",
            ItemCode: selectedItemCode || '',
            ItemDescription: selectedItemDescription || '',
            CategoriesId: selectedCategoryId || '',
            DescriptionEN: selectedDescriptionEN || '',
            DescriptionTH: selectedDescriptionTH || '',
            SerialNo: selectedSerialNo || '',
            Status: selectedStatus || '',
            Branch: selectedBranch || '',
            TransDate: selectedTransDate || '',
            PromotionId: selectedPromotion,
            ProductId: productId,
            Package: selectedPackageModel !== null ? [
                {
                    MODEL: packageList[selectedPackageModel].MODEL,
                    PACKAGETYPEID: packageList[selectedPackageModel].PACKAGETYPEID,
                    ORGANIZATIONCODE: packageList[selectedPackageModel].ORGANIZATIONCODE,
                    ITEMID: packageList[selectedPackageModel].ITEMID,
                    PRODUCTID: packageList[selectedPackageModel].PRODUCTID,
                    PACKAGETITLE: packageList[selectedPackageModel].PACKAGETITLE,
                    TOTALPRICE: packageList[selectedPackageModel].TOTALPRICE,
                    HASTRADEIN: packageList[selectedPackageModel].HASTRADEIN,
                    DISCOUNTPRICE: packageList[selectedPackageModel].DISCOUNTPRICE,
                    SEQUENCE: packageList[selectedPackageModel].SEQUENCE,
                    PERMITION_ACTIVE: packageList[selectedPackageModel].PERMITION_ACTIVE,
                    FREEGIFT: packageList[selectedPackageModel].FREEGIFT,
                    PERIODDETAILS: packageList[selectedPackageModel].PERIODDETAILS
                }
            ] : [], // ถ้าไม่มี package ที่เลือกให้เป็น array ว่าง
        },
    ], [EmpId, TeamSale, SaleCode, SupEmpId, SecEmpId, selectedItemCode, selectedItemDescription, selectedCategoryId,
        selectedDescriptionEN, selectedDescriptionTH, selectedSerialNo,
        selectedStatus, selectedBranch, selectedTransDate, selectedPromotion, selectedPackageModel, packageList]);

    const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
    const CATEGORIES_URL = `${API_SALECONNEXT}/GetProduct/Categories`;
    const PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageType`;
    const PROMOTION_URL = `${API_SALECONNEXT}/GetProduct/ProductPromotionList`;
    const POST_PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageList`;
    const API_URL_POST_CONDITIONSCHECKHISTORY = `${API_SALECONNEXT}/ConditionsCheckHistory`;

    const API_URL_POST_CHECKCUSTOMER = import.meta.env.VITE_APP_API_THIENSURAT;
    const CHECKCUSTOMER_URL = `${API_URL_POST_CHECKCUSTOMER}/CheckCustomer`;

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const getProductUrl = () => `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`;
    const SAVEPRODUCTPACKAGE = `${API_URL_MONGO}/Contract/saveProductPackage`;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

    // สร้าง ref สำหรับส่วนแพ็คเกจ
    const packageSectionRef = useRef<HTMLDivElement>(null);

    // console.log('selectedCategoryId: ', selectedCategoryId);
    // console.log('selectedProductIndex: ', selectedProductIndex);
    // console.log('selectedPackageTypeId: ', selectedPackageTypeId);
    // console.log('selectedPackageModel: ', selectedPackageModel);

    // POST GetProduct/Categories
    // useEffect(() => {
    //     const postData = async () => {
    //         try {
    //             const response = await axios.post(CATEGORIES_URL,
    //                 { EmpId, DivisionId, DepartId, DepartGroup, TeamSale }, {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data',
    //                     'Accept': 'multipart/form-data',
    //                 },
    //             });
    //             const data = Array.isArray(response.data.data) ? response.data.data : [];
    //             setCategories(data);
    //         } catch (error) {
    //             console.error('Error fetching CATEGORIES_URL:', error);
    //         }
    //     };
    //     postData();
    // }, [EmpId, TeamSale, SaleCode, SupEmpId, SecEmpId, DivisionId, DepartId, DepartGroup, auth, setCategories, fetchCategory]);

    useEffect(() => {
        const postData = async () => {
            try {
                const response = await axios.post(CATEGORIES_URL,
                    { EmpId, DivisionId, DepartId, DepartGroup, TeamSale }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'multipart/form-data',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setCategories(data);
            } catch (error) {
                console.error('Error fetching CATEGORIES_URL:', error);
            }
        };
        postData();
    });

    // GET Product/GetStock?
    useEffect(() => {
        const fetchProducts = async () => {
            if (!selectedCategoryId) return;
            setLoadingProducts(true); // เริ่มโหลดเมื่อเปลี่ยนหมวดหมู่สินค้า
            try {
                const response = await axios.get(getProductUrl(), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setProduct(data); // บันทึกสินค้าใหม่
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoadingProducts(false); // หยุดโหลดเมื่อดึงข้อมูลเสร็จ
            }
        };

        fetchProducts();
    }, [selectedCategoryId]); // ทำงานเมื่อ selectedCategoryId เปลี่ยนแปลง

    // GetProduct/ProductPromotionList
    useEffect(() => {
        const fetchPromotion = async () => {
            if (selectedProductIndex === null) return;
            try {
                const response = await axios.post(PROMOTION_URL, {
                    ProductID: productId,
                    EmpId,
                    DivisionId,
                    DepartId,
                    DepartGroup,
                    TeamSale,
                    ItemID: selectedItemCode
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'multipart/form-data',
                    }
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setPromotion(data);
            } catch (error) {
                console.error('Error fetching promotion:', error);
            }
        };

        fetchPromotion();
    }, [selectedProductIndex]);

    // GET GetPackage/PackageType
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(PACKAGE_URL, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setPackageType(data);
            } catch (error) {
                console.error('Error fetching PACKAGE_URL:', error);
            }
        };
        getData();

        setEmpId(auth.data[0].EmpId);
        setTeamSale(auth.data[0].TeamSale);
        setSaleCode(auth.data[0].SaleCode);
        setSupEmpId(auth.data[0].SupEmp);
        setSecEmpId(auth.data[0].SecEmp);
        setDivisionId(auth.data[0].DivisionId);
        setDepartId(auth.data[0].DepartId);
        setDepartGroup(auth.data[0].DepartGroup);
    }, []);

    // POST GetPackage/PackageList
    useEffect(() => {
        const postData = async () => {
            setLoadingPackages(true)
            try {
                const response = await axios.post(POST_PACKAGE_URL,
                    { EmpId, DivisionId, DepartId, DepartGroup, TeamSale, ItemID, PackageTypeID }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                // console.log(`response data from GetPackage/PackageList: `, data);
                setPackageList(data);
            } catch (error) {
                console.error('Error fetching POST_PACKAGE_URL:', error);
            } finally {
                setLoadingPackages(false)
            }
        };
        postData();
    }, [EmpId, DivisionId, DepartId, DepartGroup, TeamSale, ItemID, PackageTypeID]);

    useEffect(() => {
        // console.log("SaveProductData:", SaveProductData);
        if (JSON.stringify(SaveProductData) !== JSON.stringify(PRODUCT)) {
            // console.log("Updating product in store...");
            SETPRODUCT(SaveProductData);
        }
    }, [SaveProductData, PRODUCT, SETPRODUCT]);

    useEffect(() => {
        if (selectedPackageTypeId !== null && packageSectionRef.current) {
            packageSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedPackageTypeId]);

    const handleCateOptionChange = (event: any) => {
        const value = event.target.value;
        setSelectedCategoryId(value);

        // ล้างข้อมูล product ทันทีเมื่อเลือกหมวดหมู่ใหม่
        setProduct([]);

        // ล้างค่าที่เลือกสำหรับ product, packageType, และ packageModel
        setSelectedProductIndex(null);
        setSelectedPackageTypeId(null);
        setSelectedPackageModel(null);
    };

    const handleCardProductClick = (index: number) => {
        setSelectedProductIndex(index);
        setSelectedItemCode(product[index].ItemCode);
        setItemID(product[index].ItemCode)
        setProductId(product[index].ProductID)

        setSelectedItemDescription(product[index].ItemDescription);
        setSelectedDescriptionEN(product[index].DescriptionEN);
        setSelectedDescriptionTH(product[index].DescriptionTH);
        setSelectedSerialNo(product[index].SerialNo);
        setSelectedStatus(product[index].Status);
        setSelectedBranch(product[index].Branch);
        setSelectedTransDate(product[index].TransDate);

        if (selectedCategoryId === '') {
            setSelectedProductIndex(null);
            setSelectedPackageTypeId(null);
            setSelectedPackageModel(null);
        }
    };

    //เปลี่ยนสไตล์เป็น success เมื่อเลือกปุ่ม package และเลื่อนลงมายังส่วนแพ็คเกจ
    const handlePackageTypeClick = (index: number) => {
        setSelectedPackageTypeId(index);
        setPackageTypeID(index); // เก็บค่าใน PackageTypeID ด้วย
        if (selectedCategoryId === '') {
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
        if (packageList[index] && packageList[index].MODEL) {
            setModel(packageList[index].MODEL); // กำหนดค่าให้กับ Model จาก packageList[selectedPackageModel]
            setSelectedProductId(packageList[index].PRODUCTID)
        }
        if (selectedCategoryId === null) {
            setSelectedPackageModel(null);
        }
    };

    useEffect(() => {
        if (selectedPackageModel !== null && packageList[selectedPackageModel]) {
            const selectedModel = packageList[selectedPackageModel].MODEL;
            setModel(selectedModel); // อัปเดตค่า Model จาก packageList[selectedPackageModel]
        }
    }, [selectedPackageModel, packageList, setModel]);

    // ตรวจสอบ ConditionsCheckHistory ว่าต้องตรวจสอบประวัติไหม หากตรวจให้เช็ค CheckCustomer ต่อ
    const handleNextClick = async () => {
        try {
            // Save product package
            const response = await axios.post(SAVEPRODUCTPACKAGE, {
                REFNO,
                EMPID: EmpId,
                TEAMSALE: TeamSale,
                SALECODE: SaleCode,
                SUPEMPID: SupEmpId,
                SECEMPID: SecEmpId,
                STATUS: "DRAFT",
                PRODUCT,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = response.data;
            const newId = result.data._id; // ดึง _id จาก response

            // อัปเดต state ด้วย _id ที่ได้รับจาก API
            setProductId(newId);

            const conditionCheckResponse = await axios.post(API_URL_POST_CONDITIONSCHECKHISTORY, {
                EmpId, DivisionId, DepartId, DepartGroup, TeamSale, Model
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setChecktype(conditionCheckResponse.data.checktype); // อัปเดตค่า checktype ใน state

            let updateData;

            if (conditionCheckResponse.data.checktype !== 0) {
                const { value: idCard } = await MySwal.fire({
                    title: 'ตรวจสอบประวัติลูกค้า',
                    html: `
                        <input 
                            id="idCardInput" 
                            type="text" 
                            class="form-control" 
                            placeholder="กรุณากรอกเลขบัตรประชาชน (13 หลัก)" 
                            maxlength="13"
                            oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0,13);" 
                        />
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'ตรวจสอบ',
                    cancelButtonText: 'ยกเลิก',
                    preConfirm: async () => {
                        const input = (document.getElementById('idCardInput') as HTMLInputElement).value;
                        if (input.length === 13) {
                            return input;
                        } else {
                            MySwal.showValidationMessage('กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก');
                            return null;
                        }
                    }
                });

                if (idCard) {
                    setSearch(idCard);
                    const apiResponse = await axios.post(CHECKCUSTOMER_URL, { Search: idCard }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    const { Customerstatus, message } = apiResponse.data;
                    const destination = Customerstatus ? '/sale/overview' : '/sale/discount';

                    await MySwal.fire({
                        text: message,
                        icon: Customerstatus ? 'success' : 'success',
                        confirmButtonText: 'ตกลง'
                    });

                    updateData = [idCard, conditionCheckResponse.data.checktype, message];
                    navigate(destination); // นำทางไปยังหน้าที่ต้องการ
                }
            } else {
                SETPRODUCT(result.data); // อัปเดต PRODUCT ใน Zustand store
                updateData = ["", conditionCheckResponse.data.checktype, conditionCheckResponse.data.message];
                navigate('/sale/discount'); // นำทางไปยังหน้า sale/discount
            }

            // เรียก API UPDATECONTACT หลังจากเสร็จสิ้นเงื่อนไขทั้งหมด
            try {
                const updateContract = await axios.post(UPDATECONTACT, {
                    REFNO,
                    EMPID: EmpId,
                    TEAMSALE: TeamSale,
                    FIELD: "CUSTOMERSTATUS",
                    DATA: updateData,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log(`updateContract CUSTOMERSTATUS: `, updateContract.data);
                MySwal.fire({
                    icon: 'success',
                    title: 'สำเร็จ!',
                    text: 'บันทึกข้อมูลสินค้าเรียบร้อยแล้ว',
                    confirmButtonText: 'ตกลง'
                });
            } catch (error) {
                console.error('Error updating contract:', error);
                MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
            }
        } catch (error) {
            console.error('Error saving product package:', error);
            MySwal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถบันทึกข้อมูลได้',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
        }
    };

    // console.log(`EmpId: `, EmpId);
    // console.log(`DivisionId: `, DivisionId);
    // console.log(`DepartId: `, DepartId);
    // console.log(`DepartGroup: `, DepartGroup);
    // console.log(`TeamSale: `, TeamSale);
    // console.log(`Model: `, Model);

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center my-5'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            เลือกแพ็คเกจ
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <span className="text-muted text-hover-primary">
                                    ระบบขาย
                                </span></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">เลือกแพ็คเกจ</li>
                        </ul>
                    </div>
                </div>
                <p>เลขที่ขาย: {REFNO}</p>

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
                            data-bs-parent='#kt_accordion_1' >
                            <div className='accordion-body'>
                                <form noValidate className='form'>
                                    <div className='card-body px-lg-9 px-1'>
                                        <div className='row'>
                                            <div className='col-lg-6 my-7 my-xl-10'>
                                                <label className='form-label required fw-bold fs-3'>หมวดหมู่สินค้า</label>
                                                <select
                                                    className='form-select'
                                                    onChange={handleCateOptionChange}
                                                >
                                                    <option value=''>เลือกหมวดหมู่สินค้า...</option>
                                                    {(fetchCategory.length > 0 ? fetchCategory : categories).map((item: any, index: number) => (
                                                        <option key={index} value={item.CATEGORIES_ID}>
                                                            {item.CATEGORIES_NAME_TH}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* แสดง Loading */}
                                        {loadingProducts && (
                                            <div className="text-center my-10">
                                                <ThreeDot />
                                            </div>
                                        )}
                                        <>
                                            {selectedCategoryId.length > 0 && product.length > 0 ? (
                                                <label className='form-label required fw-bold fs-3 mt-7 mt-xl-10'>รายการสินค้า</label>
                                            ) : ('')}
                                            {!loadingProducts && selectedCategoryId.length > 0 && (
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

                                                    {/* หากไม่มีสินค้าให้แสดงข้อความนี้ */}
                                                    {!loadingProducts && product.length === 0 && selectedCategoryId && (
                                                        <div className='text-center my-7'>
                                                            <h5>ไม่มีรายการสินค้า</h5>
                                                        </div>
                                                    )}

                                                    <div className='row'>
                                                        <div className='col-lg-6 my-7 my-xl-10'>
                                                            <label className='form-label required fw-bold fs-3'>โปรโมชั่น</label>
                                                            <select
                                                                className='form-select'
                                                                onChange={(e) => {
                                                                    setSelectedPromotion(Number(e.target.value)); // แปลงค่า string เป็น number
                                                                }}
                                                                value={selectedPromotion ?? ''} // ใช้ nullish coalescing เพื่อป้องกันค่าที่เป็น null
                                                            >
                                                                <option value=''>เลือกโปรโมชั่น...</option>
                                                                {promotion.map((item: any, index: number) => (
                                                                    <option key={index} value={item?.PROMOTIONID}>
                                                                        {item.PROMOTIONNAME}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {product.length !== 0 && (
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
                                                    )}

                                                    {/* หากไม่มีแพ็คเกจให้แสดงข้อความนี้ */}
                                                    {!loadingPackages && packageList.length === 0 && selectedCategoryId !== null && selectedProductIndex !== null && selectedPackageTypeId && (
                                                        <div className='text-center my-7'>
                                                            <h5>ไม่มีรายการแพ็คเกจ</h5>
                                                        </div>
                                                    )}

                                                </div>
                                            )}
                                        </>

                                        {/* ส่วนของแพ็คเกจที่จะเลื่อนมาที่นี่ */}

                                        {/* แสดง Loading */}
                                        {loadingPackages && (
                                            <div className="text-center my-10">
                                                <ThreeDot />
                                            </div>
                                        )}

                                        {/* แสดงแพ็คเกจหากโหลดเสร็จ */}
                                        {!loadingPackages && selectedPackageTypeId !== null && selectedCategoryId.length > 0 && product.length > 0 && packageList.length > 0 ? (
                                            <div className='my-10 my-xl-10' ref={packageSectionRef}>
                                                <div className='row d-flex'>
                                                    <label className='form-label required fw-bold fs-3'>แพ็คเกจ</label>
                                                    {packageList.map((item, index) => (
                                                        <div
                                                            className='col-12 col-md-4 col-sm-4 mb-2'
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

                {/* ปุ่มในหน้าจอใหญ่ */}
                <div className="d-none d-xl-flex justify-content-between align-items-center mt-5">
                    <button
                        className="btn btn-secondary w-auto me-2"
                        onClick={() => navigate('/sale/overview')}
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        className={`btn btn-primary w-auto 
                ${product.length === 0 || selectedProductIndex === null ? 'disabled' : ''}`}
                        disabled={product.length === 0 || selectedProductIndex === null}
                        onClick={handleNextClick}
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
                        onClick={() => navigate('/sale/overview')}
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        className={`btn btn-primary w-auto 
                ${product.length === 0 || selectedProductIndex === null ? 'disabled' : ''}`}
                        disabled={product.length === 0 || selectedProductIndex === null}
                        onClick={handleNextClick}
                    >
                        บันทึก
                    </button>
                </div>

            </Content>
        </>
    );
}

export default SalesPackage;