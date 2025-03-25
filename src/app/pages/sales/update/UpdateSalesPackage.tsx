import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Content } from '../../../../_metronic/layout/components/content';
import { useAuth } from '../../../modules/auth/core/Auth';
import { useUUIDStore, useSaveProductStore } from '../../../modules/stores/stepsStore';
import useRefnoBarcodeStore from "../components/accessCam/refnoBarcodeStore";

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
} from '../../../modules/stores/sales/packageStore/packageStore';

//component
import { CardProduct } from '../components/cards/CardProduct';
import { CardPackage } from '../components/cards/CardPackage';
import { log } from 'node:console';

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
    barCode?: string; // เพิ่ม property barCode
    item?: {
        REFNO: string; // เพิ่ม item เป็น optional object
        barcode: string;
    };
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

const UpdateSalesPackage: React.FC = () => {
    const navigate = useNavigate(); // ใช้ useNavigate สำหรับการเปลี่ยนเส้นทาง
    const location = useLocation();
    const { auth } = useAuth();
    const MySwal = withReactContent(Swal);

    const item = location.state as ItemProps || [];
    
    // console.log(`item`, item);

    // const itemFromStore = (location.state || {}) as { item?: { REFNO?: string } };
    // console.log(`itemFromStore`, itemFromStore);

    const { refno, barCode, setRefno, setBarCode } = useRefnoBarcodeStore((state) => ({
        refno: state.refno,
        barCode: state.barCode,
        setRefno: state.setRefno,
        setBarCode: state.setBarCode,
    }));
    // console.log(`barCode`, barCode);
    // console.log(`refno`, item.REFNO);

    // const memoizedRefno: string = useMemo(() => {
    //     return refno || itemFromStore?.REFNO || ""; // ใช้ "" เป็นค่าเริ่มต้นหากไม่มีค่า
    // }, [refno, item?.REFNO]);

    const productContract = item?.PRODUCT || [];
    // console.log(productContract, productContract);

    const [loadingCategories, setLoadingCategories] = useState(true); // เพิ่ม state สำหรับการโหลดหมวดหมู่
    const [loadingProducts, setLoadingProducts] = useState(false); // เพิ่ม state สำหรับการโหลดสินค้า
    const [loadingPackages, setLoadingPackages] = useState(true)

    const { fetchCategory } = useFetchCategoryStore();
    // console.log(fetchCategory: , fetchCategory);

    const [categories, setCategories] = useState<any[]>([]);

    const [packageType, setPackageType] = useState<any[]>([]);
    // console.log(packageType: , packageType);

    const [promotion, setPromotion] = useState<any[]>([]);
    // console.log(promotion: , promotion);

    const [packageList, setPackageList] = useState<any[]>([]);
    // console.log(`packageList:`, packageList);

    const [selectedCategoryId, setSelectedCategoryId] = useState<any>('');
    const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
    // console.log(selectedProductIndex, selectedProductIndex);
    const [selectedItemCode, setSelectedItemCode] = useState<string | null>(null);
    const [selectedPromotion, setSelectedPromotion] = useState<string | number>('');

    const [selectedItemDescription, setSelectedItemDescription] = useState<string | null>(null);
    const [selectedDescriptionEN, setSelectedDescriptionEN] = useState<string | null>(null);
    const [selectedDescriptionTH, setSelectedDescriptionTH] = useState<string | null>(null);
    const [selectedSerialNo, setSelectedSerialNo] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [selectedTransDate, setSelectedTransDate] = useState<string | null>(null);
    const [productId, setProductId] = useState(null);  // สร้าง state สำหรับเก็บ _id
    // console.log(productId, productId);

    const [selectedPackageTypeId, setSelectedPackageTypeId] = useState<number | null>(null);
    // console.log(`selectedPackageTypeId:`, selectedPackageTypeId);

    const [selectedPackageModel, setSelectedPackageModel] = useState<number | null>(null);
    // console.log(`selectedPackageModel`, selectedPackageModel);

    const [checktype, setChecktype] = useState<number | null>(null);
    // console.log(checktype, checktype);

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
    // console.log(EmpId, EmpId);
    // console.log(EmpId, EmpId);

    const getCategoryLocal = localStorage.getItem("fetchCategory");
    const parsegetCategoryLocal = getCategoryLocal ? JSON.parse(getCategoryLocal) : null;

    const { product, setProduct } = useProductStore();
    // console.log(`product:`, product);

    const [PackageTypeID, setPackageTypeID] = useState<number | null>(null);
    const { ItemID, setItemID } = usePackageStore();
    // console.log(ItemID: , ItemID);
    // console.log(PackageTypeID: , PackageTypeID);

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
            Package: selectedPackageModel !== null
                ? [
                    {
                        MODEL: packageList[selectedPackageModel]?.MODEL || [],
                        PACKAGETYPEID: selectedPackageTypeId ?? 0, // ดึงค่า selectedPackageTypeId แม้ selectedPackageModel จะไม่มี
                        ORGANIZATIONCODE: packageList[selectedPackageModel]?.ORGANIZATIONCODE || [],
                        ITEMID: packageList[selectedPackageModel]?.ITEMID || [],
                        PRODUCTID: packageList[selectedPackageModel]?.PRODUCTID || [],
                        PACKAGETITLE: packageList[selectedPackageModel]?.PACKAGETITLE || [],
                        TOTALPRICE: packageList[selectedPackageModel]?.TOTALPRICE || [],
                        HASTRADEIN: packageList[selectedPackageModel]?.HASTRADEIN || [],
                        DISCOUNTPRICE: packageList[selectedPackageModel]?.DISCOUNTPRICE || [],
                        SEQUENCE: packageList[selectedPackageModel]?.SEQUENCE || [],
                        PERMITION_ACTIVE: packageList[selectedPackageModel]?.PERMITION_ACTIVE || [],
                        FREEGIFT: packageList[selectedPackageModel]?.FREEGIFT || [],
                        PERIODDETAILS: packageList[selectedPackageModel]?.PERIODDETAILS || []
                    }
                ]
                : selectedPackageTypeId !== null
                    ? [
                        {
                            MODEL: null, // หากไม่มี selectedPackageModel ให้ตั้งค่า MODEL เป็น null
                            PACKAGETYPEID: selectedPackageTypeId, // เก็บค่าของ selectedPackageTypeId ได้โดยตรง
                            ORGANIZATIONCODE: null,
                            ITEMID: null,
                            PRODUCTID: null,
                            PACKAGETITLE: null,
                            TOTALPRICE: null,
                            HASTRADEIN: null,
                            DISCOUNTPRICE: null,
                            SEQUENCE: null,
                            PERMITION_ACTIVE: null,
                            FREEGIFT: null,
                            PERIODDETAILS: null
                        }
                    ]
                    : [], // หากไม่มีค่าใดเลย ให้เป็น array ว่าง
        },
    ], [
        EmpId,
        TeamSale,
        SaleCode,
        SupEmpId,
        SecEmpId,
        selectedItemCode,
        selectedItemDescription,
        selectedCategoryId,
        selectedDescriptionEN,
        selectedDescriptionTH,
        selectedSerialNo,
        selectedStatus,
        selectedBranch,
        selectedTransDate,
        selectedPromotion,
        selectedPackageModel,
        selectedPackageTypeId,
        packageList
    ]);

    const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
    const CATEGORIES_URL = `${API_SALECONNEXT}/GetProduct/Categories`;
    const PROMOTION_URL = `${API_SALECONNEXT}/GetProduct/ProductPromotionList`;
    const PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageType`;
    const POST_PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageList`;
    const API_URL_POST_CONDITIONSCHECKHISTORY = `${API_SALECONNEXT}/ConditionsCheckHistory`;

    const API_URL_POST_CHECKCUSTOMER = import.meta.env.VITE_APP_API_THIENSURAT;
    const CHECKCUSTOMER_URL = `${API_URL_POST_CHECKCUSTOMER}/CheckCustomer`;

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    // const getProductUrl = () => ${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId};
    const SAVEPRODUCTPACKAGE = `${API_URL_MONGO}/Contract/saveProductPackage`;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
    const GET_IMAGES_API = `${API_URL_MONGO}/Contract/GetContractImage`;

    // สร้าง ref สำหรับส่วนแพ็คเกจ
    const packageSectionRef = useRef<HTMLDivElement>(null);

    const [images, setImages] = useState<ImagesType | null>(null);
    console.log(`images`, images);

    // // บันทึก refno ลง Zustand หากยังไม่มี
    // useEffect(() => {
    //     if (!refno && memoizedRefno) {
    //         setRefno(memoizedRefno ?? ""); // กำหนดค่าเริ่มต้นหาก memoizedRefno เป็น null
    //     }
    // }, [refno, memoizedRefno, setRefno]);

    useEffect(() => {
        setBarCode(null); // ล้างค่า barCode เมื่อเปิดหน้า
    }, []);

    useEffect(() => {
        if (productContract && productContract.length > 0) {
            // console.log("ProductContract data:", productContract);

            // แปลงข้อมูลจาก productContract ให้อยู่ในรูปแบบของ product
            const formattedProducts = productContract.map((item) => ({
                ItemCode: item.ItemCode,
                ItemDescription: item.ItemDescription,
                DescriptionTH: item.DescriptionTH,
                SerialNo: item.SerialNo,
                Branch: item.Branch,
                TransDate: item.TransDate,
                Status: item.Status,
            }));

            // ตั้งค่า product
            setProduct(formattedProducts);

            // ตั้งค่าข้อมูลที่เลือกไว้ (Selected)
            setSelectedProductIndex(0); // เลือกรายการแรก
            setSelectedItemCode(productContract?.[0]?.ItemCode);
            setSelectedItemDescription(productContract?.[0]?.ItemDescription);
            setSelectedDescriptionTH(productContract?.[0]?.DescriptionTH);
            setSelectedSerialNo(productContract?.[0]?.SerialNo);
            setSelectedStatus(productContract?.[0]?.Status);
            setSelectedBranch(productContract?.[0]?.Branch);
            setSelectedTransDate(productContract?.[0]?.TransDate);
        } else {
            console.log("No productContract data available");
        }
    }, [productContract]);


    useEffect(() => {
        if (productContract?.[0]?.Package?.length > 0) {
            setSelectedPackageTypeId(productContract?.[0]?.Package?.[0]?.PACKAGETYPEID);
            setPackageTypeID(productContract?.[0]?.Package?.[0]?.PACKAGETYPEID);
            setModel(productContract?.[0]?.Package?.[0]?.MODEL);
        } else {
            console.warn("No packages found in productContract.");
        }

        setSelectedItemCode(productContract?.[0]?.ItemCode);
        setItemID(productContract?.[0]?.ItemCode)
        setSelectedItemDescription(productContract?.[0]?.ItemDescription);
        setSelectedDescriptionEN(productContract?.[0]?.DescriptionEN);
        setSelectedDescriptionTH(productContract?.[0]?.DescriptionTH);
        setSelectedSerialNo(productContract?.[0]?.SerialNo);
        setSelectedStatus(productContract?.[0]?.Status);
        setSelectedBranch(productContract?.[0]?.Branch);
        setSelectedTransDate(productContract?.[0]?.TransDate);
        setSelectedPromotion(productContract?.[0]?.Promotion)
        setProductId(productContract?.[0]?.ProductId)

        getPackageType()

        setEmpId(auth.data[0].EmpId);
        setTeamSale(auth.data[0].TeamSale);
        setSaleCode(auth.data[0].SaleCode);
        setSupEmpId(auth.data[0].SupEmp);
        setSecEmpId(auth.data[0].SecEmp);
        setDivisionId(auth.data[0].DivisionId);
        setDepartId(auth.data[0].DepartId);
        setDepartGroup(auth.data[0].DepartGroup);

        getPackageList()
    }, [])

    useEffect(() => {
        if (selectedItemCode && productId) {
            fetchPromotion(); // เรียกฟังก์ชันดึงข้อมูลโปรโมชั่น
        }
    }, [selectedItemCode, productId]);

    useEffect(() => {
        // console.log("packageList updated:", packageList);
    }, [packageList]);

    // fetch collection ContractImage
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(GET_IMAGES_API, {
                    params: { REFNO: item?.REFNO },
                });

                // ตรวจสอบว่า response.data เป็นไปตามโครงสร้างของ ImagesType
                const data = response.data;

                if (
                    data &&
                    typeof data === 'object' &&
                    'IMAGECARD' in data &&
                    'IMAGEGPS' in data &&
                    'IMAGEMAP' in data &&
                    'IMAGECUSTOMERHOME' in data &&
                    'IMAGEINSTALLATION' in data &&
                    'IMAGETDS' in data &&
                    'IMAGETRADEIN' in data
                ) {
                    setImages(data as ImagesType);
                } else {
                    setImages(null);
                }
            } catch (err) {
                console.error('Error fetching images:', err);
                setImages(null); // ตั้งค่าเป็น null หากมีข้อผิดพลาด
            }
        };

        fetchImages();
    }, [refno]);

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
        };
        postData();
        setSelectedCategoryId(productContract?.[0]?.CategoriesId)
    }, [EmpId, TeamSale, SaleCode, SupEmpId, SecEmpId, DivisionId, DepartId, DepartGroup, auth]);

    // GET Product/GetStock?
    useEffect(() => {
        const fetchProducts = async () => {
            setLoadingProducts(true); // เริ่มแสดงสถานะการโหลด
            try {
                let url = ""; // สร้างตัวแปร URL

                // เลือก URL ตามเงื่อนไข
                if (selectedCategoryId) {
                    url = `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`;
                } else if (barCode && barCode !== "ยังไม่มีข้อมูล") {
                    url = `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&sn=${barCode}`;
                } else {
                    console.warn("No valid category or barcode to fetch products");
                    setLoadingProducts(false);
                    return;
                }

                // เรียก API
                const response = await axios.get(url);

                // ตรวจสอบว่า response.data มีข้อมูล
                const data = Array.isArray(response.data?.data) ? response.data.data : [];
                // console.log("Fetched products:", data);

                // ตั้งค่า product
                setProduct(data);

                // หากมีสินค้าตัวเดียวและมี barCode ให้ตั้งค่าตัวแรกโดยอัตโนมัติ
                if (data.length === 1 && barCode && barCode !== "ยังไม่มีข้อมูล") {
                    const product = data[0];
                    setSelectedProductIndex(0);
                    setSelectedItemCode(product?.ItemCode);
                    setItemID(product?.ItemCode);
                    setProductId(product?.ProductID);
                    setSelectedItemDescription(product?.ItemDescription);
                    setSelectedDescriptionEN(product?.DescriptionEN);
                    setSelectedDescriptionTH(product?.DescriptionTH);
                    setSelectedSerialNo(product?.SerialNo);
                    setSelectedStatus(product?.Status);
                    setSelectedBranch(product?.Branch);
                    setSelectedTransDate(product?.TransDate);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoadingProducts(false); // ซ่อนสถานะการโหลด
            }
        };

        // เรียกใช้ fetchProducts เมื่อมีการเปลี่ยนแปลง selectedCategoryId หรือ barCode
        if (selectedCategoryId || (barCode && barCode !== "ยังไม่มีข้อมูล")) {
            fetchProducts();
        }
    }, [selectedCategoryId, barCode, EmpId, TeamSale]); // เพิ่ม dependencies ที่จำเป็น    

    // GetProduct/ProductPromotionList
    const fetchPromotion = async () => {
        if (!selectedItemCode && !productId) {
            console.log("Missing parameters: selectedItemCode or productId");
            return;
        }
        try {
            const response = await axios.post(PROMOTION_URL, {
                ProductID: productId,
                EmpId,
                DivisionId,
                DepartId,
                DepartGroup,
                TeamSale,
                ItemID: selectedItemCode,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            const data = Array.isArray(response.data.data) ? response.data.data : [];
            // console.log("Fetched promotions:", data);

            setPromotion(data);

            // ตั้งค่าการเลือกโปรโมชั่นเริ่มต้น (ถ้ามี)
            if (productContract && productContract.length > 0) {
                const defaultPromotion = data.find(
                    (p: any) => p.PROMOTIONID === productContract[0]?.PromotionId
                );
                setSelectedPromotion(defaultPromotion ? productContract[0]?.PromotionId : '');
            }
        } catch (error) {
            console.error('Error fetching promotions:', error);
        }
    }

    const getPackageType = async () => {
        try {
            const response = await axios.get(PACKAGE_URL, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = Array.isArray(response.data.data) ? response.data.data : [];
            setPackageType(data);

            setEmpId(auth.data[0].EmpId);
            setTeamSale(auth.data[0].TeamSale);
            setSaleCode(auth.data[0].SaleCode);
            setSupEmpId(auth.data[0].SupEmp);
            setSecEmpId(auth.data[0].SecEmp);
            setDivisionId(auth.data[0].DivisionId);
            setDepartId(auth.data[0].DepartId);
            setDepartGroup(auth.data[0].DepartGroup);
        } catch (error) {
            console.error('Error fetching PACKAGE_URL:', error);
        }
    };

    // POST GetPackage/PackageList
    const getPackageList = async () => {
        setLoadingPackages(true);
        try {
            const response = await axios.post(POST_PACKAGE_URL, {
                EmpId,
                DivisionId,
                DepartId,
                DepartGroup,
                TeamSale,
                ItemID,
                PackageTypeID,
                PromotionID: selectedPromotion,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = Array.isArray(response.data.data) ? response.data.data : [];
            // console.log('Fetched Package List:', data); // ตรวจสอบข้อมูล
            setPackageList(data);

            let index = data.findIndex((pl: { MODEL: any }) => pl.MODEL === productContract?.[0]?.Package?.[0].MODEL);
            if (index !== -1) {
                // หน่วงเวลา 2 วินาทีก่อนแสดงผลข้อมูล
                setTimeout(() => {
                    setPackageList(data); // อัปเดตแพ็คเกจหลังจากหน่วงเวลา
                    setLoadingPackages(false); // หยุดแสดง loading หลังหน่วงเวลา
                }, 1000);

                setSelectedPackageModel(index);
            } else {
                setSelectedPackageModel(null);
            }

        } catch (error) {
            console.error('Error fetching POST_PACKAGE_URL:', error);
        } finally {
            setLoadingPackages(false);
        }
    };

    // ดึงข้อมูลแพ็คเกจจาก db มาโชว์
    useEffect(() => {
        getPackageList()
    }, [EmpId, DivisionId, DepartId, DepartGroup, TeamSale, ItemID, PackageTypeID, selectedPromotion]);

    const handleCateOptionChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedCategoryId(value);

        // ล้างค่าทั้งหมดใน state ที่เกี่ยวข้อง
        setProduct([]);
        setSelectedProductIndex(null);
        setSelectedItemCode(null);
        setSelectedItemDescription(null);
        setSelectedDescriptionEN(null);
        setSelectedDescriptionTH(null);
        setSelectedSerialNo(null); // ล้าง Serial Number
        setSelectedStatus(null);
        setSelectedBranch(null);
        setSelectedTransDate(null);
        setSelectedPromotion('');
        setSelectedPackageTypeId(null);
        setSelectedPackageModel(null);
        setPackageList([]);

        // ล้าง barCode
        navigate("/sale/update/updateSalePackage", { state: { barCode: "" } });

        if (value) {
            try {
                setLoadingProducts(true);
                const response = await axios.get(
                    `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${value}`
                );
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setProduct(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoadingProducts(false);
            }
        }
    };

    const handleCardProductClick = (index: number) => {
        setSelectedProductIndex(index);
        setSelectedItemCode(product[index]?.ItemCode);
        setItemID(product[index]?.ItemCode);
        setProductId(product[index]?.ProductID);
        setSelectedItemDescription(product[index]?.ItemDescription);
        setSelectedDescriptionEN(product[index]?.DescriptionEN);
        setSelectedDescriptionTH(product[index]?.DescriptionTH);
        setSelectedSerialNo(product[index]?.SerialNo);
        setSelectedStatus(product[index]?.Status);
        setSelectedBranch(product[index]?.Branch);
        setSelectedTransDate(product[index]?.TransDate);
    };

    //เปลี่ยนสไตล์เป็น success เมื่อเลือกปุ่ม package และเลื่อนลงมายังส่วนแพ็คเกจ
    const handlePackageTypeClick = (packageTypeId: number) => {
        if (!packageTypeId) {
            console.error("Invalid PackageTypeId:", packageTypeId);
            return;
        }

        setSelectedPackageTypeId(packageTypeId); // อัปเดตค่า selectedPackageTypeId
        setPackageTypeID(packageTypeId); // อัปเดตค่าใน state อื่นถ้าจำเป็น
        // console.log("PackageTypeId selected:", packageTypeId); // ตรวจสอบว่าค่าถูกตั้งไว้ถูกต้อง

        // Scroll the page to the package section
        if (packageSectionRef.current) {
            packageSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handlePackageModelClick = (index: number) => {
        setSelectedPackageModel(index);
        if (packageList[index] && packageList[index].MODEL) {
            setModel(packageList[index].MODEL); // กำหนดค่าให้กับ Model จาก packageList[selectedPackageModel]
        }
        if (selectedCategoryId === null) {
            setSelectedPackageModel(null);
        }
    };

    useEffect(() => {
        // ตรวจสอบว่า productContract มีข้อมูลก่อน
        if (productContract && productContract.length > 0) {
            // ตรวจสอบว่าข้อมูลสินค้า (product) พร้อมใช้งาน
            if (product && product.length > 0) {
                const productIndex = product.findIndex(
                    (p) => p.ItemCode === productContract[0]?.ItemCode
                );

                if (productIndex !== -1) {
                    setSelectedProductIndex(productIndex); // ตั้งค่าดัชนีของสินค้า
                    setSelectedItemCode(product[productIndex]?.ItemCode); // ตั้งค่า ItemCode
                }
            }

            // ตั้งค่าโปรโมชั่นจาก productContract
            if (productContract[0]?.Promotion) {
                setSelectedPromotion(productContract[0]?.Promotion);
            }
        }
    }, [product, productContract]);

    useEffect(() => {
        if (promotion.length > 0 && productContract?.[0]?.Promotion) {
            const defaultPromotion = promotion.find(
                (p) => p.PROMOTIONID === productContract[0]?.Promotion
            );
            setSelectedPromotion(defaultPromotion ? defaultPromotion.PROMOTIONID : '');
        }
    }, [promotion, productContract]);

    useEffect(() => {
        // อัปเดต Model เมื่อ packageList และ selectedPackageModel พร้อม
        if (selectedPackageModel !== null && packageList[selectedPackageModel]) {
            const selectedModel = packageList[selectedPackageModel].MODEL;
            setModel(selectedModel); // อัปเดตค่า Model
        }
    }, [selectedPackageModel, packageList, setModel]);

    useEffect(() => {
        if (packageType && packageType.length > 0) {
            // console.log('PackageType Loaded:', packageType);
        } else {
            console.warn('No PackageType data available');
        }
    }, [packageType]);

    const handleScanBarcodeClick = () => {
        setBarCode(null); // ล้างค่า barCode ก่อนเปลี่ยนหน้า

        const isDesktop = !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isDesktop) {
            Swal.fire({
                icon: "info",
                title: "ไม่รองรับ",
                text: "ฟีเจอร์สแกนบาร์โค้ด สามารถใช้งานได้เฉพาะบนมือถือหรือแท็บเล็ตเท่านั้น",
            });
            return;
        }

        navigate("/sale/update/updateDeviceScanBarcode", {
            state: { item, refno }, // ส่งค่า refno ไปด้วย
        });
    };

    useEffect(() => {
        // ล้างค่าบาร์โค้ดเมื่อโหลดหน้านี้
        setBarCode("");
    }, [setBarCode]);

    // ตรวจสอบ ConditionsCheckHistory ว่าต้องตรวจสอบประวัติไหม หากตรวจให้เช็ค CheckCustomer ต่อ
    const handleNextClick = async () => {
        // console.log("SaveProductData ก่อนส่ง:", SaveProductData); // เพิ่มตรงนี้

        try {
            // Save product package
            const response = await axios.post(UPDATECONTACT, {
                REFNO: refno ? refno : item.REFNO,
                EMPID: EmpId,
                TEAMSALE: TeamSale,
                FIELD: "PRODUCT",
                DATA: SaveProductData,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // console.log('response: ', response)
            if (response.status === 200) {
                if (!response.data.data) {
                    MySwal.fire('เกิดข้อผิดพลาด', 'ปรับปรุงข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา', 'error');
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'สำเร็จ!',
                        text: 'ปรับปรุงข้อมูลแพ็คเกจแล้ว',
                        timer: 2000, // แสดงผล 3 วินาที
                        showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
                    })
                }
            } else {
                MySwal.fire('เกิดข้อผิดพลาด', response.data.message, 'error');
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

    const handleCheckerClick = async () => {
        const response = await axios.post(UPDATECONTACT, {
            REFNO: item.REFNO,
            EMPID: EmpId,
            TEAMSALE: TeamSale,
            FIELD: "STATUS",
            DATA: "PENDING",
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(response)

        if (response.status === 200) {
            if (!response.data.data) {
                MySwal.fire('เกิดข้อผิดพลาด', 'ส่งข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา', 'error');
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ!',
                    text: 'ส่งข้อมูลตรวจสอบแล้ว',
                    timer: 2000, // แสดงผล 3 วินาที
                    showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
                })
                navigate("/sale/overview")
            }
        } else {
            MySwal.fire('เกิดข้อผิดพลาด', response.data.message, 'error');
        }
    }

    // เช็คว่า data ใน item มีครบทุกขั้นตอน (ไม่เป็น array เปล่า) ใช่ไหม ถ้าเป็นจะ disabled ปุ่มส่งตรวจสอบ
    const isDataComplete = useMemo(() => {
        // ตรวจสอบว่ามีรูปภาพในฟิลด์ใดฟิลด์หนึ่งใน images อย่างน้อย 1 รูป
        const hasImages = images && Object.values(images).some(
            (field) => Array.isArray(field) && field.length > 0
        );

        return (
            Array.isArray(item.ADDRESS) && item.ADDRESS.length > 0 &&
            Array.isArray(item.CUSTOMERDETAIL) && item.CUSTOMERDETAIL.length > 0 &&
            Array.isArray(item.CUSTOMERSTATUS) && item.CUSTOMERSTATUS.length > 0 &&
            Array.isArray(item.DISCOUNT) && item.DISCOUNT.length > 0 &&
            Array.isArray(item.PDPA) && item.PDPA.length > 0 &&
            Array.isArray(item.PRODUCT) && item.PRODUCT.length > 0 &&
            hasImages
        );
    }, [item, images]);

    return (
        <>
            {/* สแกนบาร์โค้ด */}
            <div
                className="d-flex justify-content-center align-items-center mt-5 mx-7"
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

            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-7'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            แก้ไขแพ็คเกจ
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <span className="text-muted text-hover-primary">
                                    ระบบขาย
                                </span></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">แก้ไขแพ็คเกจ</li>
                        </ul>
                    </div>
                </div>
                <p>REFNO: {item?.REFNO || item?.item?.REFNO}</p>

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

                                            {item?.barCode && (
                                                <label className='form-label fw-bold fs-3 mt-3'>S/N ที่สแกนได้: {item?.barCode}</label>
                                            )}

                                            {/* <div className='col-lg-6 my-7 my-xl-10'>
                                                <label className='form-label required fw-bold fs-3'>หมวดหมู่สินค้า</label>
                                                <select
                                                    value={selectedCategoryId}
                                                    className='form-select form-select-solid form-select-lg'
                                                    onChange={handleCateOptionChange} >
                                                    <option value=''>เลือกหมวดหมู่สินค้า...</option>
                                                    {(fetchCategory.length > 0 ? fetchCategory : categories).map((item: any, index: number) => (
                                                        <option key={index} value={item.CATEGORIES_ID}>
                                                            {item.CATEGORIES_NAME_TH}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div> */}
                                        </div>

                                        {/* แสดง Loading */}
                                        {loadingProducts && (
                                            <div className="text-center my-10">
                                                <ThreeDot />
                                            </div>
                                        )}

                                        {/* หากไม่มีสินค้าให้แสดงข้อความนี้ */}
                                        {!loadingProducts && selectedCategoryId && product && selectedCategoryId.length > 0 && product.length === 0 && (
                                            <div className='text-center my-7'>
                                                <h5>ไม่มีรายการสินค้า</h5>
                                            </div>
                                        )}

                                        {selectedCategoryId && product && selectedCategoryId.length > 0 && product.length > 0 ? (
                                            <label className='form-label required fw-bold fs-3 mt-7 mt-xl-10'>รายการสินค้า</label>
                                        ) : ('')}
                                        {!loadingProducts && product.length > 0 && (
                                            <div className='row '>
                                                {product.map((item, index) => (
                                                    <div
                                                        className='col-6 col-md-4 mb-3 rounded'
                                                        key={index}
                                                        onClick={() => handleCardProductClick(index)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <CardProduct
                                                            DescriptionTH={item?.DescriptionTH}
                                                            ItemDescription={item?.ItemDescription}
                                                            ItemCode={item?.ItemCode}
                                                            SerialNo={item?.SerialNo}
                                                            isSelected={selectedProductIndex === index}
                                                        />
                                                    </div>
                                                ))}

                                                <div className='row'>
                                                    <div className='col-lg-6 my-7 my-xl-10'>
                                                        <label className='form-label required fw-bold fs-3'>โปรโมชั่น</label>
                                                        <select
                                                            className="form-select"
                                                            value={selectedPromotion}
                                                            onChange={(e) => setSelectedPromotion(Number(e.target.value))}
                                                        >
                                                            <option value="">เลือกโปรโมชั่น...</option>
                                                            {promotion.map((item, index) => (
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
                                                            {packageType.map((item) => (
                                                                <div className='col-6 col-md-auto mb-2 d-flex align-items-center' key={item.PACKAGETYPEID}>
                                                                    <div
                                                                        className="border rounded w-100 w-md-auto h-60px d-flex justify-content-center align-items-center fw-bold fs-6 px-5"
                                                                        style={{
                                                                            backgroundColor: selectedPackageTypeId === item.PACKAGETYPEID ? '#ACE1AF' : '#fcfcfc',
                                                                            transition: 'background-color 0.2s ease, color 0.2s ease',
                                                                            cursor: 'pointer',
                                                                        }}
                                                                        onClick={() => {
                                                                            console.log('Clicked PackageTypeId:', item.PACKAGETYPEID);
                                                                            handlePackageTypeClick(item.PACKAGETYPEID);
                                                                        }}
                                                                    >
                                                                        {item.PACKAGETYPENAME}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* หากไม่มีแพ็คเกจให้แสดงข้อความนี้ */}
                                                {!loadingPackages && packageList.length === 0 && selectedCategoryId !== null && selectedProductIndex !== null && (
                                                    <div className='text-center my-7'>
                                                        <h5>ไม่มีรายการแพ็คเกจ</h5>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* ส่วนของแพ็คเกจที่จะเลื่อนมาที่นี่ */}
                                        {/* แสดง Loading */}
                                        {loadingPackages && (
                                            <div className="text-center my-10">
                                                <ThreeDot />
                                            </div>
                                        )}

                                        {/* แสดงแพ็คเกจหากโหลดเสร็จ */}
                                        {!loadingPackages && packageList.length > 0 && selectedPromotion !== null && selectedPackageTypeId !== null && (
                                            <div className='my-10 my-xl-10' ref={packageSectionRef}>
                                                <div className='row d-flex'>
                                                    <label className='form-label required fw-bold fs-3'>แพ็คเกจ</label>
                                                    {packageList.map((item, index) => (
                                                        <div
                                                            className='col-12 col-md-4 col-sm-4 mb-2'
                                                            key={item.MODEL || index}
                                                            onClick={() => handlePackageModelClick(index)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <CardPackage
                                                                PackageTitle={item.PACKAGETITLE || "No Title"}
                                                                isSelected={selectedPackageModel === index}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='d-none d-xl-flex justify-content-between align-items-center my-5'>
                    <button
                        className='btn btn-secondary w-100 w-md-auto align-self-center h-50px'
                        onClick={() => navigate('/sale/step', { state: item })}
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        className={`btn btn-warning w-100 w-md-auto align-self-center h-50px m-5 
                        ${product.length === 0 || selectedProductIndex === null ? 'disabled' : ''}`}
                        disabled={product.length === 0 || selectedProductIndex === null}
                        onClick={handleNextClick}
                    >
                        อัพเดทข้อมูล
                    </button>
                    <button
                        className={`btn btn-primary w-100 w-md-auto align-self-center h-50px ${!isDataComplete ? 'disabled' : ''}`}
                        disabled={!isDataComplete}
                        onClick={handleCheckerClick}
                    >
                        ส่งตรวจสอบ
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
                        onClick={() => navigate('/sale/step', { state: item })}
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        className={`btn btn-warning w-auto me-2 ${product.length === 0 || selectedProductIndex === null ? 'disabled' : ''}`}
                        disabled={product.length === 0 || selectedProductIndex === null}
                        onClick={handleNextClick}
                    >
                        อัพเดทข้อมูล
                    </button>
                    <button
                        className={`btn btn-primary w-auto ${!isDataComplete ? `disabled` : ``}`}
                        disabled={!isDataComplete}
                        onClick={handleCheckerClick}
                    >
                        ส่งตรวจสอบ
                    </button>
                </div >
            </Content >
        </>
    );
}

export default UpdateSalesPackage;