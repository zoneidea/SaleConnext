import axios from 'axios';
import { ChangeEvent, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Content } from '../../../_metronic/layout/components/content';
import { useUUIDStore } from '../../modules/stores/stepsStore';
import { useAuth } from '../../modules/auth/core/Auth';

//useStore
import {
    useCategoryStore,
    useFetchCategoryStore,
    useProductStore,
    usePackageStore,
    useConditionsCheckHistoryStore
} from '../../modules/stores/sales/packageStore/packageStore';

import dayjs, { Dayjs } from 'dayjs';
import DatePicker from 'react-datepicker';
import DateTimePicker from 'react-datetime-picker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import ModalTrigger from "./ModalSerchCustomer/ModalTrigger";
import SerchCustomerModal from "./ModalSerchCustomer/SerchCustomerModal";

const OrderCreateBooking: React.FC = () => {
    const navigate = useNavigate();
    const { SETREFNO } = useUUIDStore();

    const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
    const API_THIENSURAT = import.meta.env.VITE_APP_API_THIENSURAT
    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;

    const CATEGORIES_URL = `${API_SALECONNEXT}/GetProduct/Categories`;
    const PRODUCTLIST_URL = `${API_SALECONNEXT}/GetProduct/ProductList`;
    const PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageType`;
    const POST_PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageList`;

    const CUSTOMER_TYPE_URL = `${API_SALECONNEXT}/GetCustomertype`;
    const PROVINCE_URL = `${API_SALECONNEXT}/GetAddress/Province`;
    const DISTRICT_URL = `${API_SALECONNEXT}/GetAddress/District`;
    const SUBDISTRICT_URL = `${API_SALECONNEXT}/GetAddress/SubDistrict`;
    const ZIPCODE_URL = `${API_SALECONNEXT}/GetAddress/Zipcode`;

    const EMPLOYEE_URL = `${API_THIENSURAT}/Employee_Structure`;
    const CHANNEL_SALE_URL = `${API_SALECONNEXT}/GetChannelSale`;
    const ADVISER_URL = `${API_THIENSURAT}/Employee_Structure/Emp_All`;
    const SHIPPING_URL = `${API_SALECONNEXT}/GetShipping`;
    const FREEGIFT_URL = `${API_SALECONNEXT}/GetFreegift`;

    const getProductUrl = () => `${API_URL_MONGO}/Product/GetStock?empid=${auth.data[0].EmpId}&teamSale=${auth.data[0].TeamSale}&categoryId=${selectedCategoryId}`;

    const { auth } = useAuth();
    // console.log(`auth`, auth.data[0]);

    {/*-------------------- Start Modals ค้นหาลูกค้า --------------------*/ }
    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    {/*-------------------- End Modals ค้นหาลูกค้า --------------------*/ }

    {/*-------------------- Start ข้อมูลพนักงานขาย --------------------*/ }
    // POST พนักงานขาย
    const [employee, setEmployee] = useState<any[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<any>('');

    const [channelSale, setChannelSale] = useState<any[]>([]);
    const [selectedChannelSale, setSelectedChannelSale] = useState<any>('');

    const [adviser, setAdviser] = useState<any[]>([]);
    const [selectedAdviser, setSelectedAdviser] = useState<any>('');

    const [subChannelSale, setSubChannelSale] = useState<string>('');

    // พนักงานขาย
    useEffect(() => {
        const postData = async () => {
            try {
                const response = await axios.post(EMPLOYEE_URL,
                    {
                        EmpId: auth.data[0].EmpId,
                    }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setEmployee(data);
            } catch (error) {
                console.error('Error fetching EMPLOYEE_URL:', error);
                setEmployee([]); // กำหนดค่าเป็น array ว่าง หากเกิดข้อผิดพลาด
            }
        };
        postData();
    }, [auth]);

    // ช่องทาง
    useEffect(() => {
        const postData = async () => {
            try {
                const response = await axios.post(CHANNEL_SALE_URL,
                    {
                        EmpId: auth.data[0].EmpId,
                        DivisionId: auth.data[0].DivisionId,
                        DepartId: auth.data[0].DepartId,
                        DepartGroup: auth.data[0].DepartGroup,
                        TeamSale: auth.data[0].TeamSale,
                    }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setChannelSale(data);
            } catch (error) {
                console.error('Error fetching CHANNEL_SALE_URL:', error);
                setChannelSale([]); // กำหนดค่าเป็น array ว่าง หากเกิดข้อผิดพลาด
            }
        };
        postData();
    }, [auth]);

    // ผู้แนะนำ (ถ้ามี)
    useEffect(() => {
        const postData = async () => {
            try {
                const response = await axios.post(ADVISER_URL,
                    {
                        EmpId: auth.data[0].EmpId,
                    }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setAdviser(data);
            } catch (error) {
                console.error('Error fetching ADVISER_URL:', error);
                setAdviser([]); // กำหนดค่าเป็น array ว่าง หากเกิดข้อผิดพลาด
            }
        };
        postData();
    }, [auth]);
    {/*-------------------- End ข้อมูลพนักงานขาย --------------------*/ }

    {/*-------------------- Start ข้อมูลสินค้า --------------------*/ }
    const [usePackagePricing, setUsePackagePricing] = useState<boolean>(true);

    const { fetchCategory } = useFetchCategoryStore();

    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<any>('');

    const [product, setProduct] = useState<any>('');
    console.log(`product`, product);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    console.log(`selectedProductId`, selectedProductId);

    const [promotionList, setPromotionList] = useState<any[]>([]);
    const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(null);
    console.log(`selectedPromotionId`, selectedPromotionId);

    const [selectedItemID, setSelectedItemID] = useState<any>('');
    // console.log(`selectedItemID`, selectedItemID);

    const packageType = [
        {
            "PACKAGETYPEID": 1,
            "PACKAGETYPENAME": "เงินสด"
        },
        {
            "PACKAGETYPEID": 2,
            "PACKAGETYPENAME": "เงินผ่อน"
        },
        {
            "PACKAGETYPEID": 3,
            "PACKAGETYPENAME": "บัตรเครดิต (เต็มจำนวน)"
        },
        {
            "PACKAGETYPEID": 4,
            "PACKAGETYPENAME": "บัตรเครดิต (ผ่อน 0%)"
        }
    ]

    const [selectedPackageTypeId, setSelectedPackageTypeId] = useState<number | null>(null);
    console.log(`selectedPackageTypeId`, selectedPackageTypeId);

    const [packageList, setPackageList] = useState<any[]>([]);
    console.log(`packageList`, packageList);

    const [selectedPackageIndex, setSelectedPackageIndex] = useState<number | null>(null);
    console.log(`selectedPackageIndex`, selectedPackageIndex);

    const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(false);
    const [isLoadingPackage, setIsLoadingPackage] = useState<boolean>(false);

    // ตัวแปรเก็บค่าราคา + ส่วนลดจาก api
    const [totalPrice, setTotalPrice] = useState<any>(''); //TOTALPRICE
    const [discountAmount, setDiscountAmount] = useState<any>(''); //DISCOUNT

    // input + ฟีลด์ด้านขวา กรอกราคาและส่วนลดเอง
    const [priceInput, setPriceInput] = useState<number | undefined>(undefined);
    const [discountInput, setDiscountInput] = useState<number | undefined>(undefined); // input ส่วนลด
    const [netPriceInput, setNetPriceInput] = useState<number | undefined>(undefined);

    const [discountValidationMessage, setDiscountValidationMessage] = useState<{
        message: string;
        type: string;
    } | null>(null);

    // คำนวณส่วนลดอัตโนมัติเพื่อนำไปแสดงที่ฟีลด์ด้านขวา
    const discountPrice =
        selectedPackageIndex !== null &&
            packageList[selectedPackageIndex]?.DISCOUNTPRICE !== undefined
            ? packageList[selectedPackageIndex].DISCOUNTPRICE
            : 0;

    const seq =
        selectedPackageIndex !== null &&
            packageList[selectedPackageIndex] &&
            packageList[selectedPackageIndex].SEQUENCE
            ? packageList[selectedPackageIndex].SEQUENCE
            : 1; // ตั้งค่าเริ่มต้นเป็น 1 หากไม่มีข้อมูล

    // ราคาสุทธิ
    const netPrice = discountInput !== undefined ? totalPrice - discountInput : totalPrice;

    // ซ่อนฟีลด์ด้านขวา กรณีที่กรอกส่วนลดผิด
    const [isDiscountValid, setIsDiscountValid] = useState<boolean>(true);

    const handleDiscountChange = (value: string) => {
        const inputNumber = Number(value.replace(/,/g, "")); // แปลงค่าที่กรอกเป็นตัวเลข

        if (isNaN(inputNumber)) {
            setDiscountValidationMessage({
                message: "กรุณากรอกตัวเลขที่ถูกต้อง",
                type: "danger",
            });
            setIsDiscountValid(false); // กรอกค่าผิด
            return;
        }

        setDiscountInput(inputNumber); // อัปเดตส่วนลด
        validateDiscount(inputNumber); // เรียกฟังก์ชัน validateDiscount เพื่อเช็คค่า
    };

    const validateDiscount = (inputNumber: number) => {
        if (discountPrice === 0) {
            setDiscountValidationMessage(null);
            setIsDiscountValid(true); // ไม่มีส่วนลด ไม่ต้องแสดงข้อความ
            return;
        }

        if (discountPrice !== undefined && seq !== undefined) {
            let validationMessage = "";

            if (inputNumber <= discountPrice) {
                if (inputNumber % seq === 0) {
                    validationMessage = "";
                    setIsDiscountValid(true); // ส่วนลดถูกต้อง
                    setDiscountValidationMessage({
                        message: validationMessage,
                        type: "success",
                    });
                } else {
                    validationMessage = `กรอกส่วนลดผิด ต้องลดหรือเพิ่มได้ทีละ ${seq} บาท`;
                    setIsDiscountValid(false); // ส่วนลดไม่ถูกต้อง
                    setDiscountValidationMessage({
                        message: validationMessage,
                        type: "danger",
                    });
                }
            } else {
                validationMessage = `ส่วนลดต้องไม่เกิน ${discountPrice} บาท`;
                setIsDiscountValid(false); // ส่วนลดไม่ถูกต้อง
                setDiscountValidationMessage({
                    message: validationMessage,
                    type: "danger",
                });
            }
        }
    };

    // โหมด กรอกราคาและส่วนลดเอง เมื่อใส่ฟิลด์ ราคาขาย + ส่วนลด ฟีลด์ readonly ด้านขวาจะแสดงอัตโนมัติ
    useEffect(() => {
        if (priceInput !== undefined && discountInput !== undefined) {
            setNetPriceInput(priceInput - discountInput);
        } else if (priceInput !== undefined) {
            setNetPriceInput(priceInput);
        } else {
            setNetPriceInput(undefined);
        }
    }, [priceInput, discountInput]);

    useEffect(() => {
        // ล้างค่าฟิลด์เมื่อสลับโหมด
        setSelectedCategoryId(null); // ล้างหมวดหมู่สินค้า
        setSelectedProductId(null); // ล้างสินค้า
        setSelectedPromotionId(null); // ล้างโปรโมชั่น
        setSelectedPackageTypeId(null); // ล้างประเภทการชำระเงิน
        setSelectedPackageIndex(null); // ล้างแพ็คเกจที่เลือก
        setTotalPrice(undefined); // ล้างราคาขาย
        setDiscountAmount(undefined); // ล้างส่วนลดจากแพ็คเกจ
        setPriceInput(undefined); // ล้างราคาขาย (input)
        setDiscountInput(0); // ล้างส่วนลด (input)
        setNetPriceInput(undefined); // ล้างราคาสุทธิ
        setDiscountValidationMessage(null); // ล้างข้อความการตรวจสอบส่วนลด
        setIsDiscountValid(true); // รีเซ็ตสถานะส่วนลดให้ถูกต้อง
    }, [usePackagePricing]);

    // POST GetProduct/Categories
    useEffect(() => {
        const postData = async () => {
            try {
                const response = await axios.post(CATEGORIES_URL,
                    {
                        EmpId: auth.data[0].EmpId,
                        DivisionId: auth.data[0].DivisionId,
                        DepartId: auth.data[0].DepartId,
                        DepartGroup: auth.data[0].DepartGroup,
                        TeamSale: auth.data[0].TeamSale,
                        ItemID: selectedItemID,
                        PackageTypeID: selectedPackageTypeId
                    }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setCategories(data);
            } catch (error) {
                console.error('Error fetching CATEGORIES_URL:', error);
            }
        };
        postData();
    }, [auth]);

    // POST GetProduct/ProductList
    useEffect(() => {
        const fetchPromotionData = async () => {
            if (!selectedCategoryId) return;

            setIsLoadingProduct(true); // ตั้งค่าสถานะกำลังโหลดโปรโมชั่นเป็น true
            try {
                const response = await axios.post(PRODUCTLIST_URL, {
                    EmpId: auth.data[0].EmpId,
                    DivisionId: auth.data[0].DivisionId,
                    DepartId: auth.data[0].DepartId,
                    DepartGroup: auth.data[0].DepartGroup,
                    TeamSale: auth.data[0].TeamSale,
                    Categories_id: selectedCategoryId
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];

                // // ตั้งเวลาให้ข้อความ "กรุณารอสักครู่..." แสดงเป็นเวลา 2 วินาที
                setTimeout(() => {
                    setProduct(data);
                    setIsLoadingProduct(false); // ตั้งค่าสถานะกำลังโหลดเป็น false หลัง 2 วินาที
                }, 2000);
            } catch (error) {
                console.error('Error fetching PRODUCTLIST_URL:', error);
                setIsLoadingProduct(false);
            }
        };
        fetchPromotionData();
    }, [selectedCategoryId]);

    // POST GetPackage/PackageList
    useEffect(() => {
        const fetchPackageData = async () => {
            if (!selectedPackageTypeId) return;

            setIsLoadingPackage(true); // ตั้งค่าสถานะกำลังโหลดแพ็คเกจเป็น true
            try {
                const response = await axios.post(POST_PACKAGE_URL, {
                    EmpId: auth.data[0].EmpId,
                    DivisionId: auth.data[0].DivisionId,
                    DepartId: auth.data[0].DepartId,
                    DepartGroup: auth.data[0].DepartGroup,
                    TeamSale: auth.data[0].TeamSale,
                    ItemID: selectedProductId,
                    PackageTypeID: selectedPackageTypeId,
                    PromotionID: selectedPromotionId
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];

                // ตั้งเวลาให้ข้อความ "กรุณารอสักครู่..." แสดงเป็นเวลา 2 วินาที
                setTimeout(() => {
                    setPackageList(data);
                    setIsLoadingPackage(false); // ตั้งค่าสถานะกำลังโหลดเป็น false หลัง 2 วินาที
                }, 2000);
            } catch (error) {
                console.error('Error fetching POST_PACKAGE_URL:', error);
                setIsLoadingPackage(false);
            }
        };
        fetchPackageData();
    }, [selectedPackageTypeId]);

    // set ค่า totalprice เมื่อมีการเลือก selectedPackageIndex
    useEffect(() => {
        if (selectedPackageIndex !== null && packageList[selectedPackageIndex]) {
            setTotalPrice(packageList[selectedPackageIndex].TOTALPRICE);
        } else {
            setTotalPrice("");
        }
    }, [selectedPackageIndex, packageList]);

    // set ค่า discountAmount เมื่อมีการเลือก selectedPackageIndex
    useEffect(() => {
        if (selectedPackageIndex !== null && packageList[selectedPackageIndex]) {
            setDiscountAmount(packageList[selectedPackageIndex].DISCOUNTPRICE);
        } else {
            setDiscountAmount(""); // หรือค่าเริ่มต้นที่คุณต้องการเมื่อไม่ได้เลือก
        }
    }, [selectedPackageIndex, packageList]);

    // โหมด all สลับตัวเลือก
    const handleOptionChange = (value: boolean) => {
        setUsePackagePricing(value);
    };

    const handleCateOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedCategoryId(value);

        // ล้างค่าที่เกี่ยวข้องเมื่อเปลี่ยนหมวดหมู่สินค้า
        setProduct([]);
        setSelectedProductId(null);
        setSelectedPromotionId(null);
        setSelectedPackageTypeId(null); // ล้างการชำระ
        setSelectedPackageIndex(null);
        setPackageList([]);
        setDiscountInput(undefined);
        setDiscountValidationMessage(null);
        setIsDiscountValid(true);
    };

    const handleCardProductClick = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;

        if (selectedId === "") {
            // ล้างค่าที่เกี่ยวข้องเมื่อไม่ได้เลือกสินค้า
            setSelectedProductId(null);
            setSelectedItemID('');
            setSelectedPromotionId(null);
            setSelectedPackageTypeId(null); // ล้างการชำระ
            setSelectedPackageIndex(null);
            setPackageList([]);
            setDiscountInput(undefined);
            setDiscountValidationMessage(null);
            setIsDiscountValid(true);
        } else {
            setSelectedProductId(Number(selectedId));
            setSelectedPackageTypeId(null); // ล้างการชำระ

            const selectedProduct = product.find((item: any) => item.ITEMID === selectedId);
            if (selectedProduct) {
                setSelectedItemID(selectedProduct.ItemCode);

                const validPromotions = selectedProduct.PROMOTION?.filter(
                    (promo: any) => promo.PROMOTIONID !== 0
                );

                if (validPromotions && validPromotions.length > 0) {
                    setPromotionList(validPromotions);
                    setSelectedPromotionId(null);
                } else {
                    setPromotionList([]);
                    setSelectedPromotionId("0");
                }
            }
        }
    };

    const handlePromotionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const promotionId = e.target.value;

        if (promotionId === "") {
            // ล้างค่าที่เกี่ยวข้องเมื่อไม่ได้เลือกโปรโมชั่น
            setSelectedPromotionId(null);
            setSelectedPackageTypeId(null); // ล้างการชำระ
            setSelectedPackageIndex(null);
            setPackageList([]);
            setDiscountInput(undefined);
            setDiscountValidationMessage(null);
            setIsDiscountValid(true);
        } else {
            setSelectedPromotionId(promotionId);
            setSelectedPackageTypeId(null); // ล้างการชำระ
            setSelectedPackageIndex(null);
            setPackageList([]);
            setDiscountInput(undefined);
            setDiscountValidationMessage(null);
            setIsDiscountValid(true);
        }
    };

    const handlePaymentChange = (paymentTypeId: number | null) => {
        // ตั้งค่าการชำระใหม่
        setSelectedPackageTypeId(paymentTypeId);

        // ล้างค่าแพ็คเกจและส่วนลด
        setSelectedPackageIndex(null);
        setDiscountInput(undefined); // ล้างฟีลด์ส่วนลด
        setDiscountValidationMessage(null); // ล้างข้อความการตรวจสอบส่วนลด
        setIsDiscountValid(true); // รีเซ็ตสถานะส่วนลดให้ถูกต้อง
    };

    const handlePackageClick = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = e.target.value;

        if (selectedIndex === "") {
            // ล้างค่าเมื่อเลือกแพ็คเกจเป็น "เลือกแพ็คเกจ..."
            setSelectedPackageIndex(null);
            setDiscountInput(undefined); // ล้างฟีลด์ส่วนลด
            setDiscountValidationMessage(null); // ล้างข้อความการตรวจสอบส่วนลด
            setIsDiscountValid(true); // รีเซ็ตสถานะส่วนลดให้ถูกต้อง
        } else {
            // ตั้งค่าเมื่อเลือกแพ็คเกจใหม่
            setSelectedPackageIndex(Number(selectedIndex));
            setDiscountInput(undefined); // ล้างฟีลด์ส่วนลด
            setDiscountValidationMessage(null); // ล้างข้อความการตรวจสอบส่วนลด
            setIsDiscountValid(true); // รีเซ็ตสถานะส่วนลดให้ถูกต้อง
        }

        // ไม่ล้าง `selectedPackageTypeId` เพื่อคง UI การชำระเงินไว้
    };
    {/*-------------------- End ข้อมูลสินค้า --------------------*/ }

    {/* Start ข้อมูลลูกค้า */ }
    const [customerTypes, setCustomerTypes] = useState<any[]>([]);
    const [selectedCustomerType, setsSelectedCustomerType] = useState<string>('');
    // console.log(`selectedCustomerType`, selectedCustomerType);

    const [selectedCardType, setSelectedCardType] = useState<string>('');
    const [selectedPrefixId, setSelectedPrefixId] = useState<number>();
    const [selectedSexId, setSelectedSexId] = useState<number>();

    const [valueCalendar, setValueCalendar] = useState<Date | null>(null);
    const [valueAge, setValueAge] = useState<number | null>(null);

    const [idCard, setIdCard] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [nameMD, setNameMD] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [mobile, setMobile] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [workPhone, setWorkPhone] = useState<string>('');

    const selectedCustomer = customerTypes.find((type) => type.CUSTOMERTYPE === selectedCustomerType) || { CARDTYPE: [], PREFIX: [], SEX: [] };

    // GET Customertype
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(CUSTOMER_TYPE_URL, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                setCustomerTypes(response.data);
            } catch (error) {
                console.error('Error fetching CUSTOMER_TYPE_URL:', error);
            }
        };
        getData();
    }, []);

    // Handle Customer Type Change
    const handleCustTypeOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setsSelectedCustomerType(value);
        setSelectedCardType('');
    }

    // Handle IdCard Change
    const handleIdCardChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, ''); // ลบตัวอักษรที่ไม่ใช่ตัวเลขออก
        if (value.length <= 13) {
            setIdCard(value);
        }
    };

    const handleDateChange = (date: Date | null) => {
        setValueCalendar(date);
        if (date) {
            const calculatedAge = dayjs().diff(dayjs(date), 'year');
            setValueAge(calculatedAge);
        } else {
            setValueAge(null); // ตั้งค่าเป็น null หากผู้ใช้ล้างฟิลด์วันเดือนปีเกิด
        }
    };
    {/*-------------------- End ข้อมูลลูกค้า --------------------*/ }

    {/*-------------------- Start ที่อยู่ติดตั้ง --------------------*/ }
    // สร้าง state สำหรับ "ที่อยู่ลูกค้า (ติดตั้ง)
    const [getProvinceForInstall, setGetProvinceForInstall] = useState<any[]>([]);
    const [getDistrictForInstall, setGetDistrictForInstall] = useState<any[]>([]);
    const [getSubDistrictForInstall, setGetSubDistrictForInstall] = useState<any[]>([]);
    const [getZipcodeForInstall, setGetZipcodeForInstall] = useState<any[]>([]);

    const [addressNumberForInstall, setAddressNumberForInstall] = useState<string>('');
    const [addressMooForInstall, setAddressMooForInstall] = useState<string>('');
    const [addressSoiForInstall, setAddressSoiForInstall] = useState<string>('');
    const [addressRoadForInstall, setAddressRoadForInstall] = useState<string>('');
    const [selectedProvinceForInstall, setSelectedProvinceForInstall] = useState<number | undefined>();
    const [selectedDistrictForInstall, setSelectedDistrictForInstall] = useState<number | undefined>();
    const [selectedSubDistrictForInstall, setSelectedSubDistrictForInstall] = useState<number | undefined>();
    const [selectedZipcodeForInstall, setSelectedZipcodeForInstall] = useState<string>('');
    const [addressMobileForInstall, setAddressMobileForInstall] = useState<string>('');
    const [addressPhoneForInstall, setAddressPhoneForInstall] = useState<string>('');
    const [addressPhoneReserveForInstall, setAddressPhoneReserveForInstall] = useState<string>('');
    const [addressEmailForInstall, setAddressEmailForInstall] = useState<string>('');

    // GET Province For Install
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(PROVINCE_URL, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setGetProvinceForInstall(response.data);
            } catch (error) {
                console.error('Error fetching CUSTOMER_TYPE_URL:', error);
            }
        };
        getData();
    }, []);

    // POST District For Install
    useEffect(() => {
        const getData = async () => {
            if (selectedProvinceForInstall) { // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
                try {
                    const response = await axios.post(DISTRICT_URL, { ProvinceCode: selectedProvinceForInstall }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    setGetDistrictForInstall(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
                } catch (error) {
                    console.error('Error fetching DISTRICT_URL:', error);
                }
            } else {
                setGetDistrictForInstall([]); // ล้างข้อมูล district เมื่อไม่ได้เลือก province
            }
        };
        getData();
    }, [selectedProvinceForInstall]);

    // POST SubDistrict For Install
    useEffect(() => {
        const fetchSubDistricts = async () => {
            if (selectedDistrictForInstall) {
                try {
                    const response = await axios.post(SUBDISTRICT_URL, { DistrictCode: selectedDistrictForInstall }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    setGetSubDistrictForInstall(response.data);
                } catch (error) {
                    console.error('Error fetching SUBDISTRICT_URL:', error);
                }
            } else {
                setGetSubDistrictForInstall([]);
            }
        };
        fetchSubDistricts();
    }, [selectedDistrictForInstall]);

    // POST Zipcode For Install
    useEffect(() => {
        const getZipcode = async () => {
            if (selectedSubDistrictForInstall) {
                try {
                    const response = await axios.post(ZIPCODE_URL, { SubDistrictCode: selectedSubDistrictForInstall }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    if (response.data.length > 0) {
                        setSelectedZipcodeForInstall(response.data[0].POSTCODE); // อัปเดตรหัสไปรษณีย์ใน state
                    }
                } catch (error) {
                    console.error('Error fetching ZIPCODE_URL:', error);
                }
            } else {
                setSelectedZipcodeForInstall(''); // เคลียร์ข้อมูลรหัสไปรษณีย์เมื่อไม่เลือกตำบล
            }
        };
        getZipcode();
    }, [selectedSubDistrictForInstall]);

    {/*-------------------- End ที่อยู่ติดตั้ง --------------------*/ }

    {/*-------------------- Start ค่าใช้จ่ายอื่น ๆ --------------------*/ }
    const [expenses, setExpenses] = useState([
        { id: 1, description: '...', unit: '...', cost: '' },
    ]);

    const handleAddExpense = () => {
        const newId = expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1;
        setExpenses([
            ...expenses,
            { id: newId, description: '', unit: '', cost: '' },
        ]);
    };

    const handleRemoveExpense = (id: number) => {
        setExpenses(expenses.filter((expense) => expense.id !== id));
    };

    const handleChange = (id: number, field: any, value: any) => {
        setExpenses(expenses.map((expense) =>
            expense.id === id ? { ...expense, [field]: value } : expense
        ));
    };
    {/*-------------------- End ค่าใช้จ่ายอื่น ๆ --------------------*/ }

    {/*-------------------- Start สลิป --------------------*/ }
    interface FileWithPreview extends File {
        preview?: string;
    }

    interface FileState {
        transferSlip: FileWithPreview | null;
        certificate: FileWithPreview | null;
        idCard: FileWithPreview | null;
        other: FileWithPreview | null;
    }

    const [files, setFiles] = useState<FileState>({
        transferSlip: null,
        certificate: null,
        idCard: null,
        other: null,
    });

    const fileInputRefs = {
        transferSlip: useRef<HTMLInputElement>(null),
        certificate: useRef<HTMLInputElement>(null),
        idCard: useRef<HTMLInputElement>(null),
        other: useRef<HTMLInputElement>(null),
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>, type: keyof FileState) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileWithPreview: FileWithPreview = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });
            setFiles(prevFiles => ({
                ...prevFiles,
                [type]: fileWithPreview,
            }));
        }
    };

    const removeFile = (type: keyof FileState) => {
        setFiles(prevFiles => ({
            ...prevFiles,
            [type]: null,
        }));
        // รีเซ็ต input file
        if (fileInputRefs[type].current) {
            fileInputRefs[type].current!.value = '';
        }
    };

    const openFile = (file: FileWithPreview) => {
        if (file.preview) {
            window.open(file.preview, '_blank');
        }
    };

    const renderFilePreview = (file: FileWithPreview, type: keyof FileState) => (
        <div className="file-preview mt-2">
            {file.preview && (
                <img
                    src={file.preview}
                    alt="Preview"
                    width="80"
                    height="80"
                    onClick={() => openFile(file)}
                    style={{ cursor: 'pointer' }}
                />
            )}
            <div className="file-info">
                <span>{file.name}</span> ({(file.size / 1024).toFixed(2)} KB)
            </div>
            <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeFile(type)}
            >
                ลบ
            </button>
        </div>
    );
    {/*-------------------- End สลิป --------------------*/ }

    {/* Start ของแถม */ }
    const [freegift, setFreegift] = useState<any>([]);
    // console.log(`freegift`, freegift);

    const [giftFields, setGiftFields] = useState([{ id: '', quantity: '' }]); // state สำหรับเก็บรายการของแถม
    // console.log(`giftFields`, giftFields);

    const handleGiftOptionChange = (index: number, value: string) => {
        const newGiftFields = [...giftFields];
        newGiftFields[index].id = value;
        setGiftFields(newGiftFields);
    };

    const handleQuantityChange = (index: number, value: string) => {
        const newGiftFields = [...giftFields];
        newGiftFields[index].quantity = value;
        setGiftFields(newGiftFields);
    };

    const addGiftField = () => {
        setGiftFields([...giftFields, { id: '', quantity: '' }]);
    };

    const removeGiftField = (index: number) => {
        const newGiftFields = [...giftFields];
        newGiftFields.splice(index, 1); // ลบฟีลด์ที่ระบุตาม index
        setGiftFields(newGiftFields);
    };

    // GET GetFreegift
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(FREEGIFT_URL, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setFreegift(response.data);
            } catch (error) {
                console.error('Error fetching CUSTOMER_TYPE_URL:', error);
            }
        };
        getData();
    }, []);
    {/*-------------------- End ของแถม --------------------*/ }

    {/*-------------------- Start ข้อมูลเพิ่มเติม --------------------*/ }
    const [valueCalendarInstall, setValueCalendarInstall] = useState<Date | null>(null);
    const [selectedValueTimeInstall, setSelectedValueTimeInstall] = useState<string>('');

    const [getShipping, setGetShipping] = useState<any[]>([]);
    const [selectedShipping, setSelectedShipping] = useState<any>('');
    // console.log(`selectedShipping`, selectedShipping);


    const valueTimeInstallation = [
        {
            "VALUETIMEID": 1,
            "VALUETIME": "สะดวกทุกช่วงเวลา"
        },
        {
            "VALUETIMEID": 2,
            "VALUETIME": "08.00 - 12.00 (ช่วงเช้า)"
        },
        {
            "VALUETIMEID": 3,
            "VALUETIME": "12.01 - 15.00 (ช่วงบ่าย)"
        },
        {
            "VALUETIMEID": 4,
            "VALUETIME": "15.01 - 19.00 (ช่วงเย็น)"
        },
        {
            "VALUETIMEID": 5,
            "VALUETIME": "19.01 - 21.00 (ช่วงดึก)"
        },
    ]

    // GET GetShipping
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.post(SHIPPING_URL, {
                    EmpId: auth.data[0].EmpId,
                    DivisionId: auth.data[0].DivisionId,
                    DepartId: auth.data[0].DepartId,
                    DepartGroup: auth.data[0].DepartGroup,
                    TeamSale: auth.data[0].TeamSale,
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setGetShipping(data);
            } catch (error) {
                console.error('Error fetching SHIPPING_URL:', error);
            }
        };
        getData();
    }, [selectedCategoryId, setProduct]);

    const handleDateChangeInstall = (date: Date | null) => {
        setValueCalendarInstall(date);
    };
    {/*-------------------- End ข้อมูลเพิ่มเติม --------------------*/ }

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mt-7 mt-lg-0'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            สร้างใบสั่งซื้อ
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <span className="text-muted text-hover-primary">
                                    ระบบจอง
                                </span></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">สร้างใบสั่งซื้อ</li>
                        </ul>
                    </div>
                </div>

                {/* Card Body */}
                <div className='card mb-10'>
                    <div className='card-body d-flex align-items-center py-5'>
                        <div className='col-12'>

                            {/* Start ปุ่มค้นหาลูกค้า */}
                            {/* {auth.data[0].HascustomerSearch === "true" && ( */}
                            <>
                                < ModalTrigger handleShow={handleShow} />
                                <SerchCustomerModal show={showModal} handleClose={handleClose} />
                                <hr className='my-10' style={{ borderTop: '1px dotted black' }} />
                            </>
                            {/* )} */}
                            {/* End ปุ่มค้นหาลูกค้า */}

                            <label className='form-label fw-bold fs-3 mb-10'>ข้อมูลพนักงานขาย</label>

                            <div className="container">
                                <div className='row mb-6'>
                                    <div className='col-lg-6 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>พนักงานขาย</label>
                                        <select
                                            className='form-select'
                                            onChange={(e) => setSelectedEmployee(e.target.value)}
                                            value={selectedEmployee}
                                        >
                                            <option value=''>เลือกพนักงานขาย...</option>
                                            {Array.isArray(employee) && employee.map((item: any) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.SaleCode} - {item.FName} {item.LName}&nbsp;&nbsp;(ทีม {item.TeamName})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='col-lg-6 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>ช่องทาง</label>
                                        <select
                                            className='form-select'
                                            value={selectedChannelSale}
                                            onChange={(e) => setSelectedChannelSale(e.target.value)}
                                        >
                                            <option value=''>เลือกช่องทาง...</option>
                                            {Array.isArray(channelSale) && channelSale.map((item: any) => (
                                                <option key={item.CHANNEL_ID} value={item.CHANNEL_ID}>
                                                    {item.CHANNEL_NAME}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="container">
                                <div className='row mb-6'>
                                    <div className='col-lg-6 mb-3'>
                                        <label className='form-label fw-bold fs-6'>ผู้แนะนำ (ถ้ามี)</label>
                                        <select
                                            className='form-select'
                                            onChange={(e) => setSelectedAdviser(e.target.value)}
                                            value={selectedAdviser}
                                        >
                                            <option value=''>เลือกผู้แนะนำ (ถ้ามี)...</option>
                                            {Array.isArray(adviser) && adviser.map((item: any) => (
                                                <option key={item.CHANNEL_ID} value={item.CHANNEL_ID}>
                                                    {item.SaleCode} - {item.FName} {item.LName}&nbsp;&nbsp;{item.TeamName ? `(ทีม ${item.TeamName})` : ""}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='col-lg-6 mb-3'>
                                        <label className='form-label fw-bold fs-6'>ช่องทางย่อย</label>
                                        <input
                                            value={subChannelSale}
                                            onChange={(e) => setSubChannelSale(e.target.value)}
                                            type='text'
                                            className='form-control form-control-lg  mb-3 mb-lg-0'
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className='my-10' style={{ borderTop: '1px dotted black' }} />

                            <label className='form-label fw-bold fs-3 mb-10'>ข้อมูลสินค้า</label>

                            <div className="container">

                                {auth.data[0].PriceinsertType === "all" && (
                                    <div className="d-flex mb-6">
                                        <div className="form-check form-check-inline me-3">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="priceOption"
                                                checked={usePackagePricing}
                                                onChange={() => handleOptionChange(true)}
                                            />
                                            <label className="form-label fw-bold fs-6">ใช้ราคาและส่วนลดจากแพ็คเกจ</label>
                                        </div>
                                        <div className="form-check form-check-inline me-3">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="priceOption"
                                                checked={!usePackagePricing}
                                                onChange={() => handleOptionChange(false)}
                                            />
                                            <label className="form-label fw-bold fs-6">กรอกราคาและส่วนลดเอง</label>
                                        </div>
                                    </div>
                                )}

                                {/* Start PriceinsertType === "all" */}
                                {usePackagePricing && auth.data[0].PriceinsertType === "all" && (
                                    <>
                                        <div className="container">
                                            {/* Left Side */}
                                            <div className="row mb-6">
                                                <div className="col-lg-6">
                                                    <div className="mb-6">
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

                                                    <div className="mb-6">
                                                        <label className="form-label required fw-bold fs-6">สินค้า</label>
                                                        <select
                                                            className="form-select"
                                                            onChange={handleCardProductClick}
                                                            value={selectedProductId || ''}
                                                            disabled={isLoadingProduct}
                                                        >
                                                            <option value="">เลือกสินค้า...</option>
                                                            {Array.isArray(product) &&
                                                                product.map((item: any) => (
                                                                    <option key={item.ITEMID} value={item.ITEMID}>
                                                                        {item.ITEMID} - {item.PRODUCTNAME}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                        {/* ข้อความแสดงระหว่างการโหลด */}
                                                        {isLoadingProduct && (
                                                            <div className="text-muted mt-2">กรุณารอสักครู่...</div>
                                                        )}

                                                        {/* ข้อความแสดงเมื่อไม่มีสินค้าในหมวดหมู่นี้ */}
                                                        {!isLoadingProduct && selectedCategoryId && Array.isArray(product) && product.length === 0 && (
                                                            <div className="text-danger mt-2">ไม่มีสินค้าในหมวดหมู่นี้</div>
                                                        )}
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label required fw-bold fs-6">โปรโมชั่น</label>
                                                        <select
                                                            className="form-select"
                                                            onChange={handlePromotionChange}
                                                            value={selectedPromotionId || ''}
                                                            disabled={promotionList.length === 0 || isLoadingProduct}
                                                        >
                                                            <option value="">เลือกโปรโมชั่น...</option>
                                                            {promotionList.map((promotion: any, index: number) => (
                                                                <option key={index} value={promotion.PROMOTIONID}>
                                                                    {promotion.PROMOTIONNAME}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        {/* แสดงข้อความเมื่อเลือกสินค้าแล้วไม่มีโปรโมชั่น */}
                                                        {selectedProductId && promotionList.length === 0 && !isLoadingProduct && (
                                                            <div className="text-danger mt-2">ไม่มีโปรโมชั่นสำหรับสินค้านี้</div>
                                                        )}
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label required fw-bold fs-6">การชำระ</label>
                                                        <div className="d-flex">
                                                            {packageType.map((pkg, index) => (
                                                                <div className="form-check form-check-inline me-3" key={index}>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="payment"
                                                                        value={pkg.PACKAGETYPEID}
                                                                        checked={selectedPackageTypeId === pkg.PACKAGETYPEID}
                                                                        onChange={() => handlePaymentChange(pkg.PACKAGETYPEID)} // เรียกฟังก์ชันเมื่อเปลี่ยนการชำระ
                                                                    />
                                                                    <label className="form-label fw-bold fs-6">{pkg.PACKAGETYPENAME}</label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label required fw-bold fs-6">แพ็คเกจ</label>
                                                        <select
                                                            className="form-select"
                                                            onChange={handlePackageClick}
                                                            value={selectedPackageIndex !== null ? selectedPackageIndex : ''}
                                                            disabled={isLoadingPackage} // ปิดการใช้งาน select ขณะกำลังโหลดแพ็คเกจ
                                                        >
                                                            <option value="">เลือกแพ็คเกจ...</option>
                                                            {Array.isArray(packageList) && packageList.length > 0 && (
                                                                packageList.map((item: any, index: number) => (
                                                                    <option key={index} value={index}>
                                                                        {item.PACKAGETITLE}
                                                                    </option>
                                                                ))
                                                            )}
                                                        </select>
                                                        {isLoadingPackage && (
                                                            <div className="text-muted mt-2">กรุณารอสักครู่...</div>
                                                        )}
                                                        {!isLoadingPackage && selectedPackageTypeId && Array.isArray(packageList) && packageList.length === 0 && (
                                                            <div className="text-danger mt-2">ไม่มีแพ็คเกจสำหรับการชำระประเภทนี้</div>
                                                        )}
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label required fw-bold fs-6">ส่วนลด</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            disabled={
                                                                isLoadingPackage || discountPrice === 0 || selectedPackageIndex === null
                                                            } // ปิดการแก้ไขเมื่อยังโหลด, ไม่มีส่วนลด, หรือยังไม่ได้เลือกแพ็คเกจ
                                                            onChange={(e) => handleDiscountChange(e.target.value)}
                                                            value={
                                                                isLoadingPackage
                                                                    ? "" // แสดงค่าว่างเมื่อยังโหลดข้อมูลอยู่
                                                                    : discountPrice === 0
                                                                        ? "0.00" // แสดงค่า 0.00 เมื่อไม่มีส่วนลด
                                                                        : discountInput || ""
                                                            }
                                                        />
                                                        {selectedCategoryId &&
                                                            selectedProductId &&
                                                            selectedPackageIndex !== null &&
                                                            !isLoadingProduct &&
                                                            !isLoadingPackage &&
                                                            discountPrice === 0 && (
                                                                <div className="text-danger mt-2">ไม่มีส่วนลดสำหรับสินค้านี้</div>
                                                            )}

                                                        {/* แสดงข้อความ Validation */}
                                                        {discountValidationMessage && (
                                                            <div className={`text-${discountValidationMessage.type} mt-2`}>
                                                                {discountValidationMessage.message}
                                                            </div>
                                                        )}
                                                    </div>

                                                </div>

                                                {/* Right Side */}
                                                <div className="col-lg-6">
                                                    <div className="mb-6">
                                                        <label className="form-label fw-bold">ราคาขาย</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            readOnly
                                                            style={{
                                                                backgroundColor: '#d7dbde',
                                                            }}
                                                            value={selectedPackageIndex !== null && packageList[selectedPackageIndex]
                                                                ? totalPrice.toLocaleString(undefined, {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                })
                                                                : "0.00"
                                                            }
                                                        />
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label fw-bold">ส่วนลด</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            readOnly
                                                            style={{
                                                                backgroundColor: "#d7dbde",
                                                            }}
                                                            value={discountPrice === 0
                                                                ? "0.00"
                                                                : discountInput || ""}
                                                        />
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label fw-bold">ราคาสุทธิ</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            readOnly
                                                            style={{
                                                                backgroundColor: '#d7dbde',
                                                            }}
                                                            value={isDiscountValid && netPrice !== undefined
                                                                ? netPrice.toLocaleString(undefined, {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                })
                                                                : ""
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Summary Table */}
                                            {selectedPackageIndex !== null && selectedPackageIndex !== 1 && selectedPackageTypeId !== 1 && packageList.length !== 0 && (
                                                <div className="mt-4">
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>งวดที่</th>
                                                                <th>ราคา</th>
                                                                <th>หน่วย</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {/* งวดที่ 1 */}
                                                            <tr>
                                                                <td>1</td>
                                                                <td>
                                                                    {/* งวดที่ 1 */}
                                                                    <tr>
                                                                        <td>
                                                                            {packageList[selectedPackageIndex] && packageList[selectedPackageIndex].PERIODDETAILS[0]
                                                                                ? (Number(packageList[selectedPackageIndex].PERIODDETAILS[0].PAYMENTAMOUNT - (discountInput || 0)))
                                                                                    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                                                : ""}
                                                                        </td>
                                                                    </tr>
                                                                </td>
                                                                <td>บาท</td>
                                                            </tr>

                                                            {/* งวดที่ 2 ถึงงวดสุดท้าย */}
                                                            {packageList[selectedPackageIndex] && packageList[selectedPackageIndex].PERIODDETAILS.length > 1 && (
                                                                <tr>
                                                                    <td>2-{packageList[selectedPackageIndex].PERIODDETAILS.length}</td>
                                                                    <td>{packageList[selectedPackageIndex] && packageList[selectedPackageIndex].PERIODDETAILS[1]
                                                                        ? Number(packageList[selectedPackageIndex].PERIODDETAILS[1].PAYMENTAMOUNT)
                                                                            .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                                        : ""}
                                                                    </td>
                                                                    <td>บาท</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {!usePackagePricing && auth.data[0].PriceinsertType === "all" && (
                                    <>
                                        <div className="container">
                                            {/* Left Side */}
                                            <div className="row mb-6">
                                                <div className="col-lg-6">
                                                    <div className="mb-6">
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

                                                    <div className="mb-6">
                                                        <label className="form-label required fw-bold fs-6">สินค้า</label>
                                                        <select
                                                            className="form-select"
                                                            onChange={handleCardProductClick}
                                                            value={selectedProductId || ''}
                                                            disabled={isLoadingProduct}
                                                        >
                                                            <option value="">เลือกสินค้า...</option>
                                                            {Array.isArray(product) &&
                                                                product.map((item: any) => (
                                                                    <option key={item.ITEMID} value={item.ITEMID}>
                                                                        {item.ITEMID} - {item.PRODUCTNAME}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                        {/* ข้อความแสดงระหว่างการโหลด */}
                                                        {isLoadingProduct && (
                                                            <div className="text-muted mt-2">กรุณารอสักครู่...</div>
                                                        )}

                                                        {/* ข้อความแสดงเมื่อไม่มีสินค้าในหมวดหมู่นี้ */}
                                                        {!isLoadingProduct && selectedCategoryId && Array.isArray(product) && product.length === 0 && (
                                                            <div className="text-danger mt-2">ไม่มีสินค้าในหมวดหมู่นี้</div>
                                                        )}
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label required fw-bold fs-6">ราคาขาย</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            onChange={(e) => setPriceInput(Number(e.target.value))}
                                                            value={priceInput}
                                                        />
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label required fw-bold fs-6">ส่วนลด</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            onChange={(e) => setDiscountInput(Number(e.target.value))}
                                                            value={discountInput ?? ""}
                                                        />
                                                    </div>

                                                </div>

                                                {/* Right Side */}
                                                <div className="col-lg-6">
                                                    <div className="mb-6">
                                                        <label className="form-label fw-bold">ราคาขาย</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            readOnly
                                                            style={{
                                                                backgroundColor: '#d7dbde',
                                                            }}
                                                            value={priceInput !== undefined ? priceInput.toLocaleString(undefined, {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })
                                                                : "0.00"
                                                            }
                                                        />
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label fw-bold">ส่วนลด</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            readOnly
                                                            style={{
                                                                backgroundColor: '#d7dbde',
                                                            }}
                                                            value={discountInput !== undefined ? discountInput.toLocaleString(undefined, {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })
                                                                : "0.00"
                                                            }
                                                        />
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label fw-bold">ราคาสุทธิ</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            readOnly
                                                            style={{
                                                                backgroundColor: '#d7dbde',
                                                            }}
                                                            value={netPriceInput !== undefined ? netPriceInput.toLocaleString(undefined, {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })
                                                                : "0.00"
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </>
                                )}
                                {/* End PriceinsertType === "all" */}

                                {/* Start PriceinsertType === "package" */}
                                {usePackagePricing && auth.data[0].PriceinsertType === "package" && (
                                    <>
                                        <div className="container">
                                            {/* Left Side */}
                                            <div className="row mb-6">
                                                <div className="col-lg-6">
                                                    <div className="mb-6">
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

                                                    <div className="mb-6">
                                                        <label className="form-label required fw-bold fs-6">สินค้า</label>
                                                        <select
                                                            className="form-select"
                                                            onChange={handleCardProductClick}
                                                            value={selectedProductId || ''}
                                                            disabled={isLoadingProduct}
                                                        >
                                                            <option value="">เลือกสินค้า...</option>
                                                            {Array.isArray(product) &&
                                                                product.map((item: any) => (
                                                                    <option key={item.ITEMID} value={item.ITEMID}>
                                                                        {item.ITEMID} - {item.PRODUCTNAME}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                        {/* ข้อความแสดงระหว่างการโหลด */}
                                                        {isLoadingProduct && (
                                                            <div className="text-muted mt-2">กรุณารอสักครู่...</div>
                                                        )}

                                                        {/* ข้อความแสดงเมื่อไม่มีสินค้าในหมวดหมู่นี้ */}
                                                        {!isLoadingProduct && selectedCategoryId && Array.isArray(product) && product.length === 0 && (
                                                            <div className="text-danger mt-2">ไม่มีสินค้าในหมวดหมู่นี้</div>
                                                        )}
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label required fw-bold fs-6">โปรโมชั่น</label>
                                                        <select
                                                            className="form-select"
                                                            onChange={handlePromotionChange}
                                                            value={selectedPromotionId || ''}
                                                            disabled={promotionList.length === 0 || isLoadingProduct}
                                                        >
                                                            <option value="">เลือกโปรโมชั่น...</option>
                                                            {promotionList.map((promotion: any, index: number) => (
                                                                <option key={index} value={promotion.PROMOTIONID}>
                                                                    {promotion.PROMOTIONNAME}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        {/* แสดงข้อความเมื่อเลือกสินค้าแล้วไม่มีโปรโมชั่น */}
                                                        {selectedProductId && promotionList.length === 0 && !isLoadingProduct && (
                                                            <div className="text-danger mt-2">ไม่มีโปรโมชั่นสำหรับสินค้านี้</div>
                                                        )}
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label required fw-bold fs-6">การชำระ</label>
                                                        <div className="d-flex">
                                                            {packageType.map((pkg, index) => (
                                                                <div className="form-check form-check-inline me-3" key={index}>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="payment"
                                                                        value={pkg.PACKAGETYPEID}
                                                                        checked={selectedPackageTypeId === pkg.PACKAGETYPEID}
                                                                        onChange={() => handlePaymentChange(pkg.PACKAGETYPEID)} // เรียกฟังก์ชันเมื่อเปลี่ยนการชำระ
                                                                    />
                                                                    <label className="form-label fw-bold fs-6">{pkg.PACKAGETYPENAME}</label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label required fw-bold fs-6">แพ็คเกจ</label>
                                                        <select
                                                            className="form-select"
                                                            onChange={handlePackageClick}
                                                            value={selectedPackageIndex !== null ? selectedPackageIndex : ''}
                                                            disabled={isLoadingPackage} // ปิดการใช้งาน select ขณะกำลังโหลดแพ็คเกจ
                                                        >
                                                            <option value="">เลือกแพ็คเกจ...</option>
                                                            {Array.isArray(packageList) && packageList.length > 0 && (
                                                                packageList.map((item: any, index: number) => (
                                                                    <option key={index} value={index}>
                                                                        {item.PACKAGETITLE}
                                                                    </option>
                                                                ))
                                                            )}
                                                        </select>
                                                        {isLoadingPackage && (
                                                            <div className="text-muted mt-2">กรุณารอสักครู่...</div>
                                                        )}
                                                        {!isLoadingPackage && selectedPackageTypeId && Array.isArray(packageList) && packageList.length === 0 && (
                                                            <div className="text-danger mt-2">ไม่มีแพ็คเกจสำหรับการชำระประเภทนี้</div>
                                                        )}
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label required fw-bold fs-6">ส่วนลด</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            disabled={
                                                                isLoadingPackage || discountPrice === 0 || selectedPackageIndex === null
                                                            } // ปิดการแก้ไขเมื่อยังโหลด, ไม่มีส่วนลด, หรือยังไม่ได้เลือกแพ็คเกจ
                                                            onChange={(e) => handleDiscountChange(e.target.value)}
                                                            value={
                                                                isLoadingPackage
                                                                    ? "" // แสดงค่าว่างเมื่อยังโหลดข้อมูลอยู่
                                                                    : discountPrice === 0
                                                                        ? "0.00" // แสดงค่า 0.00 เมื่อไม่มีส่วนลด
                                                                        : discountInput || ""
                                                            }
                                                        />
                                                        {selectedCategoryId &&
                                                            selectedProductId &&
                                                            selectedPackageIndex !== null &&
                                                            !isLoadingProduct &&
                                                            !isLoadingPackage &&
                                                            discountPrice === 0 && (
                                                                <div className="text-danger mt-2">ไม่มีส่วนลดสำหรับสินค้านี้</div>
                                                            )}

                                                        {/* แสดงข้อความ Validation */}
                                                        {discountValidationMessage && (
                                                            <div className={`text-${discountValidationMessage.type} mt-2`}>
                                                                {discountValidationMessage.message}
                                                            </div>
                                                        )}
                                                    </div>

                                                </div>

                                                {/* Right Side */}
                                                <div className="col-lg-6">
                                                    <div className="mb-6">
                                                        <label className="form-label fw-bold">ราคาขาย</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            readOnly
                                                            style={{
                                                                backgroundColor: '#d7dbde',
                                                            }}
                                                            value={selectedPackageIndex !== null && packageList[selectedPackageIndex]
                                                                ? totalPrice.toLocaleString(undefined, {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                })
                                                                : "0.00"
                                                            }
                                                        />
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label fw-bold">ส่วนลด</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            readOnly
                                                            style={{
                                                                backgroundColor: "#d7dbde",
                                                            }}
                                                            value={discountPrice === 0
                                                                ? "0.00"
                                                                : discountInput || ""}
                                                        />
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label fw-bold">ราคาสุทธิ</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            readOnly
                                                            style={{
                                                                backgroundColor: '#d7dbde',
                                                            }}
                                                            value={isDiscountValid && netPrice !== undefined
                                                                ? netPrice.toLocaleString(undefined, {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                })
                                                                : ""
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Summary Table */}
                                            {selectedPackageIndex !== null && selectedPackageIndex !== 1 && selectedPackageTypeId !== 1 && packageList.length !== 0 && (
                                                <div className="mt-4">
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>งวดที่</th>
                                                                <th>ราคา</th>
                                                                <th>หน่วย</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {/* งวดที่ 1 */}
                                                            <tr>
                                                                <td>1</td>
                                                                <td>
                                                                    {/* งวดที่ 1 */}
                                                                    <tr>
                                                                        <td>
                                                                            {packageList[selectedPackageIndex] && packageList[selectedPackageIndex].PERIODDETAILS[0]
                                                                                ? (Number(packageList[selectedPackageIndex].PERIODDETAILS[0].PAYMENTAMOUNT - (discountInput || 0)))
                                                                                    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                                                : ""}
                                                                        </td>
                                                                    </tr>
                                                                </td>
                                                                <td>บาท</td>
                                                            </tr>

                                                            {/* งวดที่ 2 ถึงงวดสุดท้าย */}
                                                            {packageList[selectedPackageIndex] && packageList[selectedPackageIndex].PERIODDETAILS.length > 1 && (
                                                                <tr>
                                                                    <td>
                                                                        {packageList[selectedPackageIndex].PERIODDETAILS.length === 2
                                                                            ? "2" // แสดงเฉพาะ "2" ถ้ามีแค่ 2 งวด
                                                                            : `2-${packageList[selectedPackageIndex].PERIODDETAILS.length}`} {/* แสดง 2-งวดสุดท้าย */}
                                                                    </td>
                                                                    <td>
                                                                        {packageList[selectedPackageIndex] && packageList[selectedPackageIndex].PERIODDETAILS[1]
                                                                            ? Number(packageList[selectedPackageIndex].PERIODDETAILS[1].PAYMENTAMOUNT)
                                                                                .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                                            : ""}
                                                                    </td>
                                                                    <td>บาท</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                                {/* End PriceinsertType === "package" */}

                                {/* Start PriceinsertType === "manual" */}
                                {usePackagePricing && auth.data[0].PriceinsertType === "manual" && (
                                    <>
                                        <div className="container">
                                            {/* Left Side */}
                                            <div className="row mb-6">
                                                <div className="col-lg-6">
                                                    <div className="mb-6">
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

                                                    <div className="mb-6">
                                                        <label className="form-label required fw-bold fs-6">สินค้า</label>
                                                        <select
                                                            className="form-select"
                                                            onChange={handleCardProductClick}
                                                            value={selectedProductId || ''}
                                                            disabled={isLoadingProduct}
                                                        >
                                                            <option value="">เลือกสินค้า...</option>
                                                            {Array.isArray(product) &&
                                                                product.map((item: any) => (
                                                                    <option key={item.ITEMID} value={item.ITEMID}>
                                                                        {item.ITEMID} - {item.PRODUCTNAME}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                        {/* ข้อความแสดงระหว่างการโหลด */}
                                                        {isLoadingProduct && (
                                                            <div className="text-muted mt-2">กรุณารอสักครู่...</div>
                                                        )}

                                                        {/* ข้อความแสดงเมื่อไม่มีสินค้าในหมวดหมู่นี้ */}
                                                        {!isLoadingProduct && selectedCategoryId && Array.isArray(product) && product.length === 0 && (
                                                            <div className="text-danger mt-2">ไม่มีสินค้าในหมวดหมู่นี้</div>
                                                        )}
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label required fw-bold fs-6">ราคาขาย</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            onChange={(e) => setPriceInput(Number(e.target.value))}
                                                            value={priceInput}
                                                        />
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label required fw-bold fs-6">ส่วนลด</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            onChange={(e) => handleDiscountChange(e.target.value)}
                                                            value={discountInput}
                                                        />
                                                    </div>

                                                </div>

                                                {/* Right Side */}
                                                <div className="col-lg-6">
                                                    <div className="mb-6">
                                                        <label className="form-label fw-bold">ราคาขาย</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            readOnly
                                                            style={{
                                                                backgroundColor: '#d7dbde',
                                                            }}
                                                            value={priceInput !== undefined ? priceInput.toLocaleString(undefined, {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })
                                                                : ""
                                                            }
                                                        />
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label fw-bold">ส่วนลด</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            readOnly
                                                            style={{
                                                                backgroundColor: '#d7dbde',
                                                            }}
                                                            value={discountInput !== undefined ? discountInput.toLocaleString(undefined, {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })
                                                                : ""
                                                            }
                                                        />
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label fw-bold">ราคาสุทธิ</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            readOnly
                                                            style={{
                                                                backgroundColor: '#d7dbde',
                                                            }}
                                                            value={netPriceInput !== undefined ? netPriceInput.toLocaleString(undefined, {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })
                                                                : ""
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </>
                                )}
                                {/* End PriceinsertType === "manual" */}

                            </div>

                            <hr className='my-10' style={{ borderTop: '1px dotted black' }} />

                            <label className='form-label fw-bold fs-3 mb-10'>ข้อมูลลูกค้า</label>

                            {selectedCustomerType !== "1" && (
                                <>
                                    <div className="container">
                                        <div className='row mb-6'>
                                            <div className='col-lg-6 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>ประเภทลูกค้า</label>
                                                <select
                                                    className='form-select'
                                                    onChange={handleCustTypeOptionChange}
                                                    value={selectedCustomerType} >
                                                    <option value=''>เลือกประเภทลูกค้า...</option>
                                                    {customerTypes.map((item: any) => (
                                                        <option key={item.CUSTOMERTYPE} value={item.CUSTOMERTYPE}>
                                                            {item.CUSTOMERTYPENAME}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className='col-lg-6 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>ประเภทบัตร</label>
                                                <select
                                                    className='form-select'
                                                    value={selectedCardType}
                                                    onChange={(e) => setSelectedCardType(e.target.value)}
                                                >
                                                    <option value=''>เลือกประเภทบัตร...</option>
                                                    {selectedCustomer.CARDTYPE.map((cardType: any) => (
                                                        <option key={cardType.CARDTYPE} value={cardType.CARDTYPE}>
                                                            {cardType.CARDTYPENAME}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="container">
                                        <div className='row mb-6'>
                                            <div className='col-lg-4'>
                                                <label className='form-label required fw-bold fs-6'>บัตรประชาชน</label>
                                                <input
                                                    value={idCard}
                                                    onChange={handleIdCardChange}
                                                    type='text'
                                                    className='form-control mb-3 mb-lg-0'
                                                />
                                                {/* {errors.idCard && <p className='text-danger'>{errors.idCard.message}</p>} */}
                                            </div>
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>คำนำหน้าชื่อ</label>
                                                <select
                                                    value={selectedPrefixId}
                                                    className='form-select'
                                                    onChange={(e) => setSelectedPrefixId(Number(e.target.value))}
                                                >
                                                    <option value=''>เลือกคำนำหน้าชื่อ...</option>
                                                    {selectedCustomer.PREFIX.map((prefix: any) => (
                                                        <option key={prefix.PREFIXID} value={prefix.PREFIXID}>{prefix.PREFIXNAME}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='col-lg-4'>
                                                <label className='form-label required fw-bold fs-6'>ชื่อสกุล</label>
                                                <input
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    type='text'
                                                    className='form-control mb-3 mb-lg-0'
                                                />
                                                {/* {errors.fullName && <p className='text-danger'>{errors.fullName}</p>} */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="container">
                                        <div className='row mb-6'>
                                            <div className="col-lg-4 mb-3">
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <label className="form-label required fw-bold fs-6">วันเดือนปีเกิด</label>
                                                    <DatePicker
                                                        selected={valueCalendar}
                                                        onChange={handleDateChange}
                                                        className="form-control mb-3 mb-lg-0"
                                                        showYearDropdown
                                                        showMonthDropdown
                                                        dropdownMode="select"
                                                        isClearable
                                                        dateFormat="yyyy/MM/dd"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-lg-4 mb-3">
                                                <label className="form-label required fw-bold fs-6">อายุ</label>
                                                <input
                                                    value={valueAge !== null ? valueAge.toString() : ''}
                                                    type="text"
                                                    className="form-control mb-3 mb-lg-0"
                                                    readOnly
                                                />

                                            </div>
                                            {selectedCustomerType !== "1" && (
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>เพศ</label>
                                                    <select
                                                        value={selectedSexId}
                                                        className='form-select mb-3 mb-lg-0'
                                                        onChange={(e) => setSelectedSexId(Number(e.target.value))}
                                                    >
                                                        <option value=''>เลือกเพศ...</option>
                                                        {selectedCustomer.SEX.map((sex: any) => (
                                                            <option key={sex.SEXID} value={sex.SEXID}>{sex.SEXNAME}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            <div className="container">
                                                <div className='row mt-6'>
                                                    <div className='col-lg-6 mb-3'>
                                                        <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                                        <input
                                                            value={mobile}
                                                            onChange={(e) => setMobile(e.target.value)}
                                                            type='text'
                                                            className='form-control mb-3 mb-lg-0'
                                                        />
                                                        {/* {errors.mobile && <p className='text-danger'>{errors.mobile}</p>} */}
                                                    </div>
                                                    <div className='col-lg-6 mb-3'>
                                                        <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                                        <input
                                                            value={phone}
                                                            onChange={(e) => setPhone(e.target.value)}
                                                            type='text'
                                                            className='form-control mb-3 mb-lg-0'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="container">
                                            <div className='row mb-6'>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>เบอร์ที่ทำงาน</label>
                                                    <input
                                                        value={workPhone}
                                                        onChange={(e) => setWorkPhone(e.target.value)}
                                                        type='text'
                                                        className='form-control mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>อีเมล์</label>
                                                    <input
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        type='text'
                                                        className='form-control mb-3 mb-lg-0'
                                                    />
                                                    {/* {errors.email && <p className='text-danger'>{errors.email}</p>} */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Start กรณีประเภทลูกค้าเป็น นิติบุคคล */}
                            {selectedCustomerType == "1" && (
                                <>
                                    <div className="container">
                                        <div className='row mb-6'>
                                            <div className='col-lg-6 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>ประเภทลูกค้า</label>
                                                <select
                                                    className='form-select'
                                                    onChange={handleCustTypeOptionChange}
                                                    value={selectedCustomerType}
                                                >
                                                    <option value=''>เลือกประเภทลูกค้า...</option>
                                                    {customerTypes.map((item: any) => (
                                                        <option key={item.CUSTOMERTYPE} value={item.CUSTOMERTYPE}>
                                                            {item.CUSTOMERTYPENAME}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className='col-lg-6'>
                                                <label className='form-label required fw-bold fs-6'>ชื่อบริษัท</label>
                                                <input
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    type='text'
                                                    className='form-control mb-3 mb-lg-0'
                                                />
                                                {/* {errors.idCard && <p className='text-danger'>{errors.idCard.message}</p>} */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="container">
                                        <div className='row mb-6'>
                                            <div className='col-lg-4'>
                                                <label className='form-label required fw-bold fs-6'>เลขประจำตัวผู้เสียภาษี</label>
                                                <input
                                                    value={idCard}
                                                    onChange={(e) => setIdCard(e.target.value)}
                                                    type='text'
                                                    className='form-control mb-3 mb-lg-0'
                                                />
                                                {/* {errors.idCard && <p className='text-danger'>{errors.idCard.message}</p>} */}
                                            </div>
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>คำนำหน้า</label>
                                                <select
                                                    className='form-select'
                                                    onChange={(e) => setSelectedPrefixId(Number(e.target.value))}
                                                    value={selectedPrefixId}
                                                >
                                                    <option value=''>เลือกคำนำหน้า...</option>
                                                    {selectedCustomer.PREFIX.map((prefix: any) => (
                                                        <option key={prefix.PREFIXID} value={prefix.PREFIXID}>{prefix.PREFIXNAME}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>กรรมการผู้มีอำนาจ</label>
                                                <input
                                                    value={nameMD}
                                                    onChange={(e) => setNameMD(e.target.value)}
                                                    type='text'
                                                    className='form-control mb-3 mb-lg-0'
                                                />
                                                {/* {errors.fullname && <p className='text-danger'>{errors.fullname.message}</p>} */}
                                            </div>
                                        </div>

                                        <div className="container">
                                            <div className='row mb-6 mt-6'>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                                    <input
                                                        value={mobile}
                                                        type='text'
                                                        className='form-control mb-3 mb-lg-0'
                                                        onChange={(e) => setMobile(e.target.value)}
                                                    />
                                                </div>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                                    <input
                                                        value={phone}
                                                        type='text'
                                                        className='form-control mb-3 mb-lg-0'
                                                        onChange={(e) => setPhone(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="container">
                                            <div className='row mb-6'>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>เบอร์ที่ทำงาน</label>
                                                    <input
                                                        value={workPhone}
                                                        type='text'
                                                        className='form-control mb-3 mb-lg-0'
                                                        onChange={(e) => setWorkPhone(e.target.value)}
                                                    />
                                                </div>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>อีเมล์</label>
                                                    <input
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        type='text'
                                                        className='form-control mb-3 mb-lg-0'
                                                    />
                                                    {/* {errors.email && <p className='text-danger'>{errors.email.message}</p>} */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {/* End กรณีประเภทลูกค้าเป็น นิติบุคคล */}

                            <hr className='my-10' style={{ borderTop: '1px dotted black' }} />

                            <label className='form-label fw-bold fs-3 mb-10'>ที่อยู่ติดตั้ง</label>

                            <div className="container">
                                <div className='row mb-6'>
                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>บ้านเลขที่</label>
                                        <input
                                            value={addressNumberForInstall}
                                            onChange={(e) => {
                                                setAddressNumberForInstall(e.target.value);
                                            }}
                                            type='text'
                                            className='form-control mb-3 mb-lg-0'
                                        />
                                    </div>
                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label fw-bold fs-6'>หมู่ที่</label>
                                        <input
                                            value={addressMooForInstall}
                                            onChange={(e) => {
                                                setAddressMooForInstall(e.target.value);
                                            }}
                                            type='text'
                                            className='form-control mb-3 mb-lg-0'
                                        />
                                    </div>
                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label fw-bold fs-6'>ตรอก / ซอย</label>
                                        <input
                                            value={addressSoiForInstall}
                                            onChange={(e) => {
                                                setAddressSoiForInstall(e.target.value);
                                            }}
                                            type='text'
                                            className='form-control mb-3 mb-lg-0'
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="container">
                                <div className='row mb-6'>
                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label fw-bold fs-6'>ถนน</label>
                                        <input
                                            value={addressRoadForInstall}
                                            onChange={(e) => {
                                                setAddressRoadForInstall(e.target.value);
                                            }}
                                            type='text'
                                            className='form-control mb-3 mb-lg-0'
                                        />
                                    </div>
                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>จังหวัด</label>
                                        <select
                                            className='form-select'
                                            value={selectedProvinceForInstall}
                                            onChange={(e) => {
                                                setSelectedProvinceForInstall(Number(e.target.value))
                                            }}
                                        >
                                            <option value=''>เลือกจังหวัด...</option>
                                            {getProvinceForInstall.map((item: any) => (
                                                <option key={item.PROVINCECODE} value={item.PROVINCECODE}>
                                                    {item.PROVINCENAME}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>อำเภอ / เขต</label>
                                        <select
                                            className='form-select'
                                            value={selectedDistrictForInstall}
                                            onChange={(e) => {
                                                setSelectedDistrictForInstall(Number(e.target.value))
                                            }}
                                        >
                                            <option value=''>เลือกอำเภอ / เขต...</option>
                                            {getDistrictForInstall.map((item: any) => (
                                                <option key={item.DISTRICTCODE} value={item.DISTRICTCODE}>
                                                    {item.DISTRICTNAME}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="container">
                                <div className='row mb-6'>
                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>ตำบล / แขวง</label>
                                        <select
                                            className='form-select'
                                            value={selectedSubDistrictForInstall}
                                            onChange={(e) => {
                                                setSelectedSubDistrictForInstall(Number(e.target.value))
                                            }}
                                        >
                                            <option value=''>เลือกตำบล / แขวง...</option>
                                            {getSubDistrictForInstall.map((item: any) => (
                                                <option key={item.SUBDISTRICTCODE} value={item.SUBDISTRICTCODE}>
                                                    {item.SUBDISTRICTNAME}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>รหัสไปรษณีย์</label>
                                        <input
                                            type='text'
                                            className='form-control mb-3 mb-lg-0'
                                            value={selectedZipcodeForInstall}
                                            readOnly
                                            style={{
                                                backgroundColor: '#d7dbde',
                                            }}
                                        />
                                    </div>
                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                        <input
                                            value={addressMobileForInstall}
                                            onChange={(e) => {
                                                setAddressMobileForInstall(e.target.value)
                                            }}
                                            type='text'
                                            className='form-control mb-3 mb-lg-0'
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="container">
                                <div className='row mb-6'>
                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label fw-bold fs-6'>เบอร์โทรศัพท์สำรอง</label>
                                        <input
                                            value={addressPhoneReserveForInstall}
                                            onChange={(e) => {
                                                setAddressPhoneReserveForInstall(e.target.value)
                                            }}
                                            type='text'
                                            className='form-control mb-3 mb-lg-0'
                                        />
                                    </div>

                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                        <input
                                            value={addressPhoneForInstall}
                                            onChange={(e) => {
                                                setAddressPhoneForInstall(e.target.value)
                                            }}
                                            type='text'
                                            className='form-control mb-3 mb-lg-0'
                                        />
                                    </div>
                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label fw-bold fs-6'>E-Mail</label>
                                        <input
                                            value={addressEmailForInstall}
                                            onChange={(e) => {
                                                setAddressEmailForInstall(e.target.value)
                                            }}
                                            type='text'
                                            className='form-control mb-3 mb-lg-0'
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className='my-10' style={{ borderTop: '1px dotted black' }} />

                            <div className="container">
                                <input
                                    className='form-check-input me-5 mt-1'
                                    name='billLikeAddressCard'
                                    type='checkbox'
                                // onChange={handleCheckboxChange}
                                // checked={billLikeCardAddr}
                                />
                                <label className='form-label fw-bold fs-3 mb-10'>ต้องการใบกำกับภาษี</label>
                            </div>

                            <hr className='my-1' style={{ borderTop: '1px dotted black' }} />

                            {auth.data[0].Hasfreegift === "false" && (
                                <>
                                    <label className="form-label fw-bold fs-3 mb-10 mt-10">ของแถม</label>

                                    <div className="container">
                                        {giftFields.map((gift, index) => (
                                            <div className="row mb-3 align-items-center" key={index}>
                                                <div className="col-1 text-center">
                                                    <span>{index + 1}</span>
                                                </div>
                                                <div className="col-5">
                                                    <select
                                                        className="form-select"
                                                        onChange={(e) => handleGiftOptionChange(index, e.target.value)}
                                                        value={gift.id}
                                                    >
                                                        <option value="">เลือกของแถม...</option>
                                                        {Array.isArray(freegift) &&
                                                            freegift.map((item: any) => (
                                                                <option key={item.GIFTID} value={item.GIFTID}>
                                                                    {item.GIFTNAME}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                                <div className="col-2 text-center">
                                                    <span>จำนวน</span>
                                                </div>
                                                <div className="col-2 d-flex align-items-center">
                                                    <input
                                                        type="text"
                                                        className="form-control me-2"
                                                        value={gift.quantity}
                                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                    />
                                                    <span>หน่วย</span>
                                                </div>
                                                <div className="col-2 text-center">
                                                    {index !== 0 && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger"
                                                            onClick={() => removeGiftField(index)}
                                                        >
                                                            ลบ
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        <div className="row mt-10">
                                            <div className="col-12 text-center">
                                                <button type="button" className="btn btn-primary" onClick={addGiftField}>
                                                    เพิ่มของแถม
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className='mt-10' style={{ borderTop: '1px dotted black' }} />
                                </>
                            )}

                            <label className='form-label fw-bold fs-3 mb-10 mt-10'>ค่าใช้จ่าย อื่นๆ</label>
                            <div className="container">
                                {expenses.map((expense, index) => (
                                    <div className="row mb-3 align-items-center" key={expense.id}>
                                        <div className="col-1 text-center">
                                            <span>{index + 1}.</span> {/* ใช้ index ที่เป็น parameter ของ map */}
                                        </div>
                                        <div className="col-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={expense.description}
                                                onChange={(e) => handleChange(expense.id, 'description', e.target.value)}
                                                placeholder={"..."}
                                            />
                                        </div>
                                        <div className="col-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={expense.unit}
                                                onChange={(e) => handleChange(expense.id, 'unit', e.target.value)}
                                                placeholder={"..."}
                                            />
                                        </div>
                                        <div className="col-2 text-center">
                                            <span>เป็นเงิน</span>
                                        </div>
                                        <div className="col-2 d-flex align-items-center">
                                            <input
                                                type="text"
                                                className="form-control me-2"
                                                value={expense.cost}
                                                onChange={(e) => handleChange(expense.id, 'cost', e.target.value)}
                                            />
                                            <span>บาท</span>
                                        </div>
                                        <div className="col-2">
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => handleRemoveExpense(expense.id)}
                                                >
                                                    ลบ
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* ปุ่มสำหรับเพิ่มค่าใช้จ่ายอื่น ๆ */}
                                <div className="row mt-10">
                                    <div className="col-12 text-center">
                                        <button type="button" className="btn btn-primary" onClick={handleAddExpense}>
                                            เพิ่มค่าใช้จ่ายอื่น ๆ
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <hr className='mt-10 mb-10' style={{ borderTop: '1px dotted black' }} />

                            <div className="container">
                                {(['transferSlip', 'certificate', 'idCard', 'other'] as Array<keyof FileState>).map((type) => (
                                    <div className="row mb-3" key={type}>
                                        <div className="col-lg-3 col-form-label fw-bold">
                                            {type === 'transferSlip' ? 'สลิปโอนเงิน' :
                                                type === 'certificate' ? 'หนังสือรับรอง' :
                                                    type === 'idCard' ? 'บัตรประชาชน' : 'อื่นๆ'}
                                        </div>
                                        <div className="col-lg-9">
                                            <input
                                                type="file"
                                                className="form-control"
                                                ref={fileInputRefs[type]}
                                                onChange={(e) => handleFileChange(e, type)}
                                            />
                                            {files[type] && renderFilePreview(files[type] as FileWithPreview, type)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <hr className='mt-10' style={{ borderTop: '1px dotted black' }} />

                            <label className='form-label fw-bold fs-3 mb-10 mt-10'>ข้อมูลเพิ่มเติม</label>

                            {/* S2 Telesale */}

                            <div className="container">
                                <div className='row mb-6'>
                                    <div className="col-lg-6 mb-6">
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <label className="form-label required fw-bold fs-6">วันที่สะดวกติดตั้ง</label>
                                            <DatePicker
                                                selected={valueCalendarInstall}
                                                onChange={handleDateChangeInstall}
                                                className="form-control mb-3 mb-lg-0"
                                                showYearDropdown
                                                showMonthDropdown
                                                dropdownMode="select"
                                                isClearable
                                                dateFormat="yyyy/MM/dd"
                                            />
                                        </div>
                                    </div>

                                    <div className='col-lg-6 mb-6'>
                                        <label className='form-label required fw-bold fs-6'>ช่วงเวลา</label>
                                        <select
                                            className='form-select'
                                            value={selectedValueTimeInstall}
                                            onChange={(e) => setSelectedValueTimeInstall(e.target.value)}
                                        >
                                            <option value=''>เลือกช่วงเวลา...</option>
                                            {valueTimeInstallation.map((item: any) => (
                                                <option key={item.VALUETIMEID} value={item.VALUETIMEID}>
                                                    {item.VALUETIME}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="container">
                                        <div className='col-lg-6 mb-10'>
                                            <label className='form-label required fw-bold fs-6'>รูปแบบการจัดส่ง</label>
                                            <select
                                                className='form-select'
                                                value={selectedShipping}
                                                onChange={(e) => setSelectedShipping(e.target.value)}
                                            >
                                                <option value=''>เลือกรูปแบบการจัดส่ง...</option>
                                                {getShipping.map((item: any) => (
                                                    <option key={item.SHIPPING_ID} value={item.SHIPPING_ID}>
                                                        {item.SHIPPING_NAME}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className='col-lg-12 mb-6'>
                                            <textarea
                                                className="form-control"
                                                style={{
                                                    width: '100%',       // ความกว้างเต็มพื้นที่
                                                    resize: 'none',       // ปิดการปรับขนาด
                                                    minHeight: '100px',   // ความสูงขั้นต่ำ
                                                }}
                                                placeholder="ข้อมูลเพิ่มเติม"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                {/* End Card Body */}

                <div className='d-none d-md-flex justify-content-between align-items-center mt-5'>
                    <button
                        className='btn btn-secondary w-100 w-md-auto align-self-center h-50px'
                        onClick={() => navigate('/order/overview')}
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        className='btn btn-primary w-100 w-md-auto align-self-center h-50px mt-5'
                    // onClick={handleCheckerClick}
                    >
                        บันทึก
                    </button>
                </div>

                {/* ปุ่มในหน้าจอเล็ก */}
                <div
                    className="d-flex d-md-none justify-content-between align-items-center bg-light p-3 border-top"
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
                        onClick={() => navigate('/order/overview')}
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        className={`btn btn-primary w-auto`}
                    // onClick={handleNextClick}
                    >
                        บันทึก
                    </button>
                </div>

            </Content >
        </>
    )
}

export default OrderCreateBooking;