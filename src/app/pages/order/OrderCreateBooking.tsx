import axios from 'axios';
import { ChangeEvent, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Content } from '../../../_metronic/layout/components/content';
import { useUUIDStore } from '../../modules/stores/stepsStore';
import { useAuth } from '../../modules/auth/core/Auth';

//useStore
import { useFetchCategoryStore, } from '../../modules/stores/sales/packageStore/packageStore';
import { useCustomerStore } from './store/SerchCustomerStore'

import dayjs, { Dayjs } from 'dayjs';
import DatePicker from 'react-datepicker';
import DateTimePicker from 'react-datetime-picker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import ModalTrigger from "./modalSerchCustomer/ModalTrigger";
import SerchCustomerModal from "./modalSerchCustomer/SerchCustomerModal";

const OrderCreateBooking: React.FC = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();
    // console.log(`auth`, auth.data[0]);

    // ดึงข้อมูลลูกค้าที่เลือกจาก modal ที่เก็บใน Store
    const selectedCustomerDataFromModal = useCustomerStore((state) => state.selectedCustomer);
    console.log(`selectedCustomerDataFromModal`, selectedCustomerDataFromModal);

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

    const SAVEDATA_URL = `${API_SALECONNEXT}/CreateBooking/Submit_Createbooking`;

    const getProductUrl = () => `${API_URL_MONGO}/Product/GetStock?empid=${auth.data[0].EmpId}&teamSale=${auth.data[0].TeamSale}&categoryId=${selectedCategoryId}`;

    {/*-------------------- Start Modals ค้นหาลูกค้า --------------------*/ }
    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    {/*-------------------- End Modals ค้นหาลูกค้า --------------------*/ }

    {/*-------------------- Start ข้อมูลพนักงานขาย --------------------*/ }
    // POST พนักงานขาย
    const [employee, setEmployee] = useState<any[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<any>('');
    console.log(`selectedEmployee`, selectedEmployee);

    const [channelSale, setChannelSale] = useState<any[]>([]);
    const [selectedChannelSale, setSelectedChannelSale] = useState<any>('');
    console.log(`selectedChannelSale`, selectedChannelSale);

    const [adviser, setAdviser] = useState<any[]>([]);
    const [selectedAdviser, setSelectedAdviser] = useState<any>('');
    console.log(`selectedAdviser`, selectedAdviser);

    const [subChannelSale, setSubChannelSale] = useState<string>('');
    console.log(`subChannelSale`, subChannelSale);

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

    const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSaleEmp = e.target.value; // ดึง SaleEmp ที่เลือกจาก dropdown
        const selected = employee.find((item) => item.SaleEmp === selectedSaleEmp); // ค้นหาข้อมูลพนักงานจากอาร์เรย์
        setSelectedEmployee(selected || null); // อัปเดตข้อมูลพนักงานใน state
    };

    const handleAdviserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSaleEmp = e.target.value; // ดึง SaleEmp ที่เลือกจาก dropdown
        const selected = adviser.find((item) => item.SaleEmp === selectedSaleEmp); // ค้นหาข้อมูลพนักงานจากอาร์เรย์
        setSelectedAdviser(selected || null); // อัปเดตข้อมูลพนักงานใน state
    };

    {/*-------------------- End ข้อมูลพนักงานขาย --------------------*/ }

    {/*-------------------- Start ข้อมูลสินค้า --------------------*/ }
    const [usePackagePricing, setUsePackagePricing] = useState<boolean>(true);

    const { fetchCategory } = useFetchCategoryStore();
    // console.log(`fetchCategory`, fetchCategory);
    const [categories, setCategories] = useState<any[]>([]);
    // console.log(`categories`, categories);
    const [selectedCategoryId, setSelectedCategoryId] = useState<any>('');

    const [product, setProduct] = useState<any>('')
    // console.log(`product`, product);
    const [selectedProductId, setSelectedProductId] = useState<any>('');
    console.log(`selectedProductId`, selectedProductId);

    const [promotionList, setPromotionList] = useState<any[]>([]);
    const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(null);
    // console.log(`selectedPromotionId`, selectedPromotionId);

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

    const handleCateOptionChange = (event: any) => {
        const value = event.target.value;
        setSelectedCategoryId(value);

        // ล้างข้อมูลที่เกี่ยวข้อง
        setProduct([]);
        setSelectedProductId(null);
        setSelectedPackageTypeId(null);
        setSelectedPackageIndex(null);
        setSelectedPromotionId(null);
        setPromotionList([]);
        setDiscountInput(undefined);
        setDiscountValidationMessage(null);
        setIsDiscountValid(true);
        setPriceInput(undefined); // ล้างราคาขาย
    };

    const handleCardProductClick = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const selected = product.find((item: any) => item.PRODUCTID === selectedId); // ค้นหาข้อมูลพนักงานจากอาร์เรย์
        setSelectedProductId(selected || null); // อัปเดตข้อมูลพนักงานใน state

        if (selectedId === "") {
            // ล้างข้อมูลเมื่อไม่ได้เลือกสินค้า
            setSelectedProductId(null);
            setSelectedItemID('');
            setSelectedPackageTypeId(null);
            setSelectedPackageIndex(null);
            setSelectedPromotionId(null);
            setPromotionList([]);
            setDiscountInput(undefined);
            setDiscountValidationMessage(null);
            setIsDiscountValid(true);
            setPriceInput(undefined); // ล้างราคาขาย
            return;
        }

        // อัปเดตสินค้าเมื่อเลือก
        setSelectedProductId(Number(selectedId));
        const selectedProduct = product.find((item: any) => item.ITEMID === selectedId);

        if (selectedProduct) {
            setSelectedItemID(selectedProduct.ItemCode);

            const validPromotions = selectedProduct.PROMOTION?.filter(
                (promo: any) => promo.PROMOTIONID !== 0
            ) || [];

            setPromotionList(validPromotions);
            setSelectedPromotionId(null);
        } else {
            setPromotionList([]);
            setSelectedPromotionId("0");
        }

        // ล้างค่าที่เกี่ยวข้องเพิ่มเติม
        setSelectedPackageTypeId(null);
        setSelectedPackageIndex(null);
        setDiscountInput(undefined);
        setDiscountValidationMessage(null);
        setIsDiscountValid(true);
        setPriceInput(undefined); // ล้างราคาขาย
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

    {/*-------------------- Start ข้อมูลลูกค้า --------------------*/ }
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

    // ต้องการใบกำกับภาษีไหม
    const [isInvoiceRequired, setIsInvoiceRequired] = useState<boolean>(false);

    // เมื่อติ้กหรือยกเลิกติ้ก "ต้องการใบกำกับภาษี"
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setIsInvoiceRequired(checked);

        if (!checked) {
            // ล้างข้อมูลที่เกี่ยวข้องกับที่อยู่ออกใบกำกับภาษี
            setAddressNumberForTax('');
            setAddressMooForTax('');
            setAddressSoiForTax('');
            setAddressRoadForTax('');
            setSelectedProvinceForTax(undefined);
            setSelectedDistrictForTax(undefined);
            setSelectedSubDistrictForTax(undefined);
            setSelectedZipcodeForTax('');
            setAddressMobileForTax('');
            setAddressPhoneForTax('');
            setAddressPhoneReserveForTax('');
            setAddressEmailForTax('');
            setAddressTaxLikeInstall(false); // รีเซ็ตการเลือก "ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง"
        }
    };
    {/*-------------------- End ที่อยู่ติดตั้ง --------------------*/ }

    {/*-------------------- Start ที่อยู่ออกใบกำกับภาษี --------------------*/ }
    // ที่อยู่ติดตั้งเหมือน ที่อยู่ออกใบกำกับภาษี ไหม?
    const [addressTaxLikeInstall, setAddressTaxLikeInstall] = useState(false)

    // state ที่อยู่ออกใบกำกับภาษี
    const [getProvinceForTax, setGetProvinceForTax] = useState<any[]>([]);
    const [getDistrictForTax, setGetDistrictForTax] = useState<any[]>([]);
    const [getSubDistrictForTax, setGetSubDistrictForTax] = useState<any[]>([]);
    const [getZipcodeForTax, setGetZipcodeForTax] = useState<any[]>([]);

    const [addressNumberForTax, setAddressNumberForTax] = useState<string>('');
    const [addressMooForTax, setAddressMooForTax] = useState<string>('');
    const [addressSoiForTax, setAddressSoiForTax] = useState<string>('');
    const [addressRoadForTax, setAddressRoadForTax] = useState<string>('');
    const [selectedProvinceForTax, setSelectedProvinceForTax] = useState<number | undefined>();
    console.log(`selectedProvinceForTax`, selectedProvinceForTax);
    const [selectedDistrictForTax, setSelectedDistrictForTax] = useState<number | undefined>();
    const [selectedSubDistrictForTax, setSelectedSubDistrictForTax] = useState<number | undefined>();
    const [selectedZipcodeForTax, setSelectedZipcodeForTax] = useState<string>('');
    const [addressMobileForTax, setAddressMobileForTax] = useState<string>('');
    const [addressPhoneForTax, setAddressPhoneForTax] = useState<string>('');
    const [addressPhoneReserveForTax, setAddressPhoneReserveForTax] = useState<string>('');
    const [addressEmailForTax, setAddressEmailForTax] = useState<string>('');

    // GET Province For Tax
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(PROVINCE_URL, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setGetProvinceForTax(response.data);
            } catch (error) {
                console.error('Error fetching CUSTOMER_TYPE_URL:', error);
            }
        };
        getData();
    }, []);

    // POST District For Tax
    useEffect(() => {
        const getData = async () => {
            if (selectedProvinceForTax) { // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
                try {
                    const response = await axios.post(DISTRICT_URL, { ProvinceCode: selectedProvinceForTax }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    setGetDistrictForTax(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
                } catch (error) {
                    console.error('Error fetching DISTRICT_URL:', error);
                }
            } else {
                setGetDistrictForTax([]); // ล้างข้อมูล district เมื่อไม่ได้เลือก province
            }
        };
        getData();
    }, [selectedProvinceForTax]);

    // POST SubDistrict For Tax
    useEffect(() => {
        const fetchSubDistricts = async () => {
            if (selectedDistrictForTax) {
                try {
                    const response = await axios.post(SUBDISTRICT_URL, { DistrictCode: selectedDistrictForTax }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    setGetSubDistrictForTax(response.data);
                } catch (error) {
                    console.error('Error fetching SUBDISTRICT_URL:', error);
                }
            } else {
                setGetSubDistrictForTax([]);
            }
        };
        fetchSubDistricts();
    }, [selectedDistrictForTax]);

    // POST Zipcode For Tax
    useEffect(() => {
        const getZipcode = async () => {
            if (selectedSubDistrictForTax) {
                try {
                    const response = await axios.post(ZIPCODE_URL, { SubDistrictCode: selectedSubDistrictForTax }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    if (response.data.length > 0) {
                        setSelectedZipcodeForTax(response.data[0].POSTCODE); // อัปเดตรหัสไปรษณีย์ใน state
                    }
                } catch (error) {
                    console.error('Error fetching ZIPCODE_URL:', error);
                }
            } else {
                setSelectedZipcodeForTax(''); // เคลียร์ข้อมูลรหัสไปรษณีย์เมื่อไม่เลือกตำบล
            }
        };
        getZipcode();
    }, [selectedSubDistrictForTax]);

    // เมื่อติ้กหรือยกเลิกติ้ก "ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง"
    const handleCheckboxTax = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        setAddressTaxLikeInstall(checked);

        if (checked) {
            // คัดลอกข้อมูลจากที่อยู่ติดตั้งไปยังที่อยู่ออกใบกำกับภาษี
            setAddressNumberForTax(addressNumberForInstall);
            setAddressMooForTax(addressMooForInstall);
            setAddressSoiForTax(addressSoiForInstall);
            setAddressRoadForTax(addressRoadForInstall);
            setSelectedProvinceForTax(selectedProvinceForInstall);
            setSelectedDistrictForTax(selectedDistrictForInstall);
            setSelectedSubDistrictForTax(selectedSubDistrictForInstall);
            setSelectedZipcodeForTax(selectedZipcodeForInstall);
            setAddressMobileForTax(addressMobileForInstall);
            setAddressPhoneForTax(addressPhoneForInstall);
            setAddressPhoneReserveForTax(addressPhoneReserveForInstall);
            setAddressEmailForTax(addressEmailForInstall);
        } else {
            // ล้างข้อมูลที่อยู่ออกใบกำกับภาษี
            setAddressNumberForTax('');
            setAddressMooForTax('');
            setAddressSoiForTax('');
            setAddressRoadForTax('');
            setSelectedProvinceForTax(undefined); // รีเซ็ตจังหวัดให้เป็น undefined
            setSelectedDistrictForTax(undefined);
            setSelectedSubDistrictForTax(undefined);
            setSelectedZipcodeForTax('');
            setAddressMobileForTax('');
            setAddressPhoneForTax('');
            setAddressPhoneReserveForTax('');
            setAddressEmailForTax('');
        }
    };

    // ล้างค่า "ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง" และรีเซ็ต UI
    const handleAddressTaxFieldChange = () => {
        setAddressTaxLikeInstall(false);
    };
    {/*-------------------- End ที่อยู่ออกใบกำกับภาษี --------------------*/ }

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

    // บันทึกข้อมูลลงระบบ
    const SaveData = async () => {
        const allData = [
            {
                CreateData: {
                    CreateBy: auth.data[0].EmpId,
                    Latitude: "0",
                    Longitude: "0"
                },
                SalesmanData: {
                    SaleEmp: selectedEmployee.SaleEmp,
                    SaleCode: selectedEmployee.SaleCode,
                    SaleTeamCode: selectedEmployee.SaleTeamCode,
                    PreSaleEmployeeCode: selectedEmployee.TeamName,
                    PreSaleSaleCode: selectedAdviser.SaleCode,
                    PreSaleName: selectedAdviser.FName,
                    PreSaleTeamCode: "TAAX-02",
                    Channel: selectedChannelSale,
                    SubChannel: subChannelSale,
                },
                ProductData: {
                    ProductGroup: "เครื่องกรองน้ำ",
                    ProductID: "5E5A39C6AD0445D28F2F785C7FF20877",
                    ItemID: "10100110",
                    PackageCode: "UA102",
                    SALE: "17,660.00",
                    TotalPrice: "17,660.00",
                    TradeInDiscount: "0.00"
                },
                CustomerData: {
                    CustomerType: "0",
                    CardType: "IDCARD",
                    IDCar: "1234567890121",
                    PrefixCode: "T003",
                    PrefixName: "นาย",
                    CustomerName: "ทดสอบ ระบบ",
                    Brithday: "2024-11-20",
                    Age: "",
                    Gender: "ชาย"
                },
                AddressInstallData: {
                    HomeNumber: "37",
                    Moo: "1",
                    Soi: "สามัคคี 32",
                    Road: "สามัคคี",
                    Province: "3",
                    District: "62",
                    SubDistrict: "265",
                    ZipCode: "11000",
                    TelNo: "TelMobile",
                    ReserveTel: "",
                    HomeTel: "",
                    Email: ""
                },
                AddressTaxData: {
                    HomeNumber: "37",
                    Moo: "1",
                    Soi: "สามัคคี 32",
                    Road: "สามัคคี",
                    Province: "3",
                    District: "62",
                    SubDistrict: "265",
                    ZipCode: "11000",
                    TelNo: "TelMobile",
                    ReserveTel: "",
                    HomeTel: "",
                    Email: ""
                },
                TaxInvoiceData: true,
                FreeGiftData: [
                    {
                        GiftID: "1",
                        Quantity: "2"
                    }
                ],
                ShippingData: {
                    Distance: 10,
                    Price: "500.00"
                },
                OtherExpensesData: [
                    {
                        ExpenseTitle: "ขาตั้ง",
                        Price: "100.00"
                    }
                ],
                PictureData: {
                    TRANSFERSLIP: [
                        {
                            Base64: "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AAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAAAADZE3AAAAAA2RNwAAAAANkTcAAA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AABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2TPgAAAAALJnwAEAAABkz4ADAAAAyJ4BBwAAAJA9Aw4AAAAgewYcAAAAQPYMOAAAAIDsGXAAAAAA2fv/dv28Nm7lqekAAAAASUVORK5CYII="
                        },
                    ],
                    CERTIFICATE: "",
                    IDCARD: "",
                    OTHERFILES: ""
                },
                AddInformationData: {
                    DateForAppointment: "2024-11-22",
                    TimeForAppointment: "1",
                    DeliveryBy: "2",
                    AddDetail: "ทดสอบระบบจอง"
                }
            }
        ]

        try {
            const response = await axios.post(SAVEDATA_URL, { allData }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const data = Array.isArray(response.data.data) ? response.data.data : [];
            setGetShipping(data);
        } catch (error) {
            console.error('Error fetching SAVEDATA_URL:', error);
        }
    };

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center my-5'>
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
                                            onChange={handleEmployeeChange}
                                            value={selectedEmployee?.SaleEmp || ''}
                                        >
                                            <option value=''>เลือกพนักงานขาย...</option>
                                            {Array.isArray(employee) &&
                                                employee.map((item) => (
                                                    <option key={item.id} value={item.SaleEmp}>
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
                                                <option key={item.id} value={item.CHANNEL_ID}>
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
                                            onChange={handleAdviserChange}
                                            value={selectedAdviser?.SaleEmp || ''}
                                        >
                                            <option value=''>เลือกผู้แนะนำ (ถ้ามี)...</option>
                                            {Array.isArray(adviser) && adviser.map((item: any) => (
                                                <option key={item.id} value={item.SaleEmp}>
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
                                                            value={selectedProductId?.PRODUCTID || ''}
                                                            disabled={isLoadingProduct}
                                                        >
                                                            <option value="">เลือกสินค้า...</option>
                                                            {Array.isArray(product) &&
                                                                product.map((item: any) => (
                                                                    <option key={item.id} value={item.PRODUCTID}>
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
                                                            value={priceInput !== undefined ? priceInput : ""}
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
                                                            value={selectedProductId?.PRODUCTID || ''}
                                                            disabled={isLoadingProduct}
                                                        >
                                                            <option value="">เลือกสินค้า...</option>
                                                            {Array.isArray(product) &&
                                                                product.map((item) => (
                                                                    <option key={item.id} value={item.PRODUCTID}>
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

                                                        {isLoadingProduct && <div className="text-muted mt-2">กรุณารอสักครู่...</div>}
                                                        {!isLoadingProduct && selectedCategoryId && product.length === 0 && (
                                                            <div className="text-danger mt-2">ไม่มีสินค้าในหมวดหมู่นี้</div>
                                                        )}
                                                    </div>

                                                    <div className="mb-6">
                                                        <label className="form-label required fw-bold fs-6">ราคาขาย</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            onChange={(e) => setPriceInput(Number(e.target.value))}
                                                            value={priceInput !== undefined ? priceInput : ""}
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
                                                    value={selectedCustomerDataFromModal ? selectedCustomerDataFromModal.IDCard : idCard}
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
                                                    value={selectedCustomerDataFromModal ? selectedCustomerDataFromModal.name : fullName}
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
                                                            value={selectedCustomerDataFromModal ? selectedCustomerDataFromModal.phone_number : mobile}
                                                            onChange={(e) => setMobile(e.target.value)}
                                                            type='text'
                                                            className='form-control mb-3 mb-lg-0'
                                                        />
                                                        {/* {errors.mobile && <p className='text-danger'>{errors.mobile}</p>} */}
                                                    </div>
                                                    <div className='col-lg-6 mb-3'>
                                                        <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                                        <input
                                                            value={selectedCustomerDataFromModal ? selectedCustomerDataFromModal.TelHome : phone}
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
                                                        value={selectedCustomerDataFromModal ? selectedCustomerDataFromModal.TelOffice : workPhone}
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
                                            value={selectedCustomerDataFromModal ? selectedCustomerDataFromModal.AddressDetail : addressNumberForInstall}
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

                            <div className="container mt-10">
                                <div className='row'>
                                    <div className='col-lg-6'>
                                        <label className='form-check form-check-inline form-check-solid me-5'>
                                            <input
                                                className="form-check-input me-5"
                                                name="isInvoiceRequired"
                                                type="checkbox"
                                                onChange={handleCheckboxChange}
                                                checked={isInvoiceRequired}
                                            />
                                            <span className='form-label fw-bold'>ต้องการใบกำกับภาษี</span>
                                        </label>
                                    </div>
                                </div>

                            </div>

                            <hr className='my-10' style={{ borderTop: '1px dotted black' }} />

                            {isInvoiceRequired && (
                                <>
                                    <label className='form-label fw-bold fs-3 mb-10'>ที่อยู่ออกใบกำกับภาษี</label>

                                    <div className="container">
                                        <div className='row mb-6'>
                                            <div className='col-lg-6 mb-3 mt-xl-5'>
                                                <label className='form-check form-check-inline form-check-solid me-5'>
                                                    <input
                                                        onChange={handleCheckboxTax}
                                                        className='form-check-input'
                                                        name='addressTaxLikeInstall'
                                                        type='checkbox'
                                                        checked={addressTaxLikeInstall}
                                                    />
                                                    <span className='fw-bold ps-2 fs-6 mb-sm-5'>ข้อมูลเหมือนที่อยู่ติดตั้งทั้งหมด</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="container">
                                        <div className='row mb-6'>
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>บ้านเลขที่</label>
                                                <input
                                                    value={addressNumberForTax}
                                                    onChange={(e) => {
                                                        setAddressNumberForTax(e.target.value);
                                                        handleAddressTaxFieldChange(); // ล้างค่า "ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง"
                                                    }}
                                                    type='text'
                                                    className='form-control mb-3 mb-lg-0'
                                                />
                                            </div>
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label fw-bold fs-6'>หมู่ที่</label>
                                                <input
                                                    value={addressMooForTax}
                                                    onChange={(e) => {
                                                        setAddressMooForTax(e.target.value);
                                                        handleAddressTaxFieldChange(); // ล้างค่า "ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง"
                                                    }}
                                                    type='text'
                                                    className='form-control mb-3 mb-lg-0'
                                                />
                                            </div>
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label fw-bold fs-6'>ตรอก / ซอย</label>
                                                <input
                                                    value={addressSoiForTax}
                                                    onChange={(e) => {
                                                        setAddressSoiForTax(e.target.value)
                                                        handleAddressTaxFieldChange(); // ล้างค่า "ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง"
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
                                                    value={addressRoadForTax}
                                                    onChange={(e) => {
                                                        setAddressRoadForTax(e.target.value)
                                                        handleAddressTaxFieldChange(); // ล้างค่า "ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง"
                                                    }}
                                                    type='text'
                                                    className='form-control mb-3 mb-lg-0'
                                                />
                                            </div>

                                            {/* จังหวัด */}
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>จังหวัด</label>
                                                <select
                                                    className='form-select'
                                                    value={selectedProvinceForTax ?? ''} // ใช้ '' แทน undefined เพื่อ UI ไม่แสดงค่าที่ไม่ถูกต้อง
                                                    onChange={(e) => {
                                                        const selectedValue = Number(e.target.value) || undefined;
                                                        setSelectedProvinceForTax(selectedValue);
                                                        handleAddressTaxFieldChange(); // ล้างค่า "ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง"
                                                    }}
                                                >
                                                    <option value=''>เลือกจังหวัด...</option>
                                                    {getProvinceForTax.map((item) => (
                                                        <option key={item.PROVINCECODE} value={item.PROVINCECODE}>
                                                            {item.PROVINCENAME}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* อำเภอ / เขต */}
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>อำเภอ / เขต</label>
                                                <select
                                                    className='form-select'
                                                    value={addressTaxLikeInstall ? selectedDistrictForInstall : selectedDistrictForTax}
                                                    onChange={(e) => {
                                                        const selectedValue = Number(e.target.value);
                                                        if (addressTaxLikeInstall) {
                                                            setSelectedDistrictForInstall(selectedValue);
                                                        } else {
                                                            setSelectedDistrictForTax(selectedValue);
                                                            handleAddressTaxFieldChange(); // ล้างการติ้ก
                                                        }
                                                    }}
                                                >
                                                    <option value=''>เลือกอำเภอ / เขต...</option>
                                                    {(addressTaxLikeInstall ? getDistrictForInstall : getDistrictForTax).map((item) => (
                                                        <option key={item.DISTRICTCODE} value={item.DISTRICTCODE}>
                                                            {item.DISTRICTNAME}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* ตำบล / แขวง */}
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>ตำบล / แขวง</label>
                                                <select
                                                    className='form-select'
                                                    value={addressTaxLikeInstall ? selectedSubDistrictForInstall : selectedSubDistrictForTax}
                                                    onChange={(e) => {
                                                        const selectedValue = Number(e.target.value);
                                                        if (addressTaxLikeInstall) {
                                                            setSelectedSubDistrictForInstall(selectedValue);
                                                        } else {
                                                            setSelectedSubDistrictForTax(selectedValue);
                                                            handleAddressTaxFieldChange(); // ล้างการติ้ก
                                                        }
                                                    }}
                                                >
                                                    <option value=''>เลือกตำบล / แขวง...</option>
                                                    {(addressTaxLikeInstall ? getSubDistrictForInstall : getSubDistrictForTax).map((item) => (
                                                        <option key={item.SUBDISTRICTCODE} value={item.SUBDISTRICTCODE}>
                                                            {item.SUBDISTRICTNAME}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* รหัสไปรษณีย์ */}
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>รหัสไปรษณีย์</label>
                                                <input
                                                    type='text'
                                                    className='form-control mb-3 mb-lg-0'
                                                    value={addressTaxLikeInstall ? selectedZipcodeForInstall : selectedZipcodeForTax}
                                                    onChange={() => {
                                                        if (!addressTaxLikeInstall) {
                                                            handleAddressTaxFieldChange(); // ล้างการติ้ก
                                                        }
                                                    }}
                                                    readOnly
                                                    style={{
                                                        backgroundColor: '#d7dbde',
                                                    }}
                                                />
                                            </div>

                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                                <input
                                                    value={addressMobileForTax}
                                                    onChange={(e) => {
                                                        setAddressMobileForTax(e.target.value)
                                                        handleAddressTaxFieldChange(); // ล้างค่า "ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง"
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
                                                    value={addressPhoneReserveForTax}
                                                    onChange={(e) => {
                                                        setAddressPhoneReserveForTax(e.target.value)
                                                        handleAddressTaxFieldChange(); // ล้างค่า "ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง"
                                                    }}
                                                    type='text'
                                                    className='form-control mb-3 mb-lg-0'
                                                />
                                            </div>

                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                                <input
                                                    value={addressPhoneForTax}
                                                    onChange={(e) => {
                                                        setAddressPhoneForTax(e.target.value)
                                                        handleAddressTaxFieldChange(); // ล้างค่า "ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง"
                                                    }}
                                                    type='text'
                                                    className='form-control mb-3 mb-lg-0'
                                                />
                                            </div>
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label fw-bold fs-6'>E-Mail</label>
                                                <input
                                                    value={addressEmailForTax}
                                                    onChange={(e) => {
                                                        setAddressEmailForTax(e.target.value)
                                                        handleAddressTaxFieldChange(); // ล้างค่า "ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง"
                                                    }}
                                                    type='text'
                                                    className='form-control mb-3 mb-lg-0'
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <hr className='mt-10' style={{ borderTop: '1px dotted black' }} />
                                </>
                            )}

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

                <div className='d-none d-xl-flex justify-content-between align-items-center my-5'>
                    <button
                        className='btn btn-secondary w-100 w-md-auto align-self-center h-50px'
                        onClick={() => navigate('/order/overview')}
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        className='btn btn-primary w-100 w-md-auto align-self-center h-50px mt-5'
                        onClick={SaveData}
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
                        onClick={() => navigate('/order/overview')}
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        className={`btn btn-primary w-auto`}
                        onClick={SaveData}
                    >
                        บันทึก
                    </button>
                </div>

            </Content >
        </>
    )
}

export default OrderCreateBooking;