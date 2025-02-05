import axios from 'axios';
import { ChangeEvent, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Content } from '../../../../_metronic/layout/components/content';
import { useUUIDStore } from '../../../modules/stores/stepsStore';
import { useAuth } from '../../../modules/auth/core/Auth';

//useStore
import { useFetchCategoryStore, } from '../../../modules/stores/sales/packageStore/packageStore';

import dayjs, { Dayjs } from 'dayjs';
import DatePicker from 'react-datepicker';
import DateTimePicker from 'react-datetime-picker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { log } from 'node:console';

interface FreegifDetail {
    Gifts1: any;
    Gifts1_qty: any;
    Gifts_Detail: any;
    Gifts_Name: any;
    Gifts_Price: any;
}

interface AddressDetail {
    AddressDetail: any;
    AddressDetail2: any;
    AddressDetail3: any;
    AddressDetail4: any;
    ProvinceCode: any;
    DistrictCode?: any;
    SubDistrictCode?: any;
    Zipcode?: any;
    TelMobile?: any;
    TelHome?: any;
    TelOffice?: any;
    EMail?: any;
    CreateBy?: any;
    CreateDate?: any;
    LastUpdateBy?: any;
    LastUpdateDate?: any;
}

interface ItemProps {
    BookingNo: any
    CheckerStatusName: any
    Booking_Detail: [any]
    Products_Detail: [any]
    PackageTitle: any
    TotalPrice: any
    PackageCash: any
    DownPay: any
    FirstPay: any
    MODE: any
    CustomerName: any
    Customer_Detail: [any]
    Address_Detail: AddressDetail[]
    Freegif_Detail: FreegifDetail[]
}

const OrderDetailCheckerAdmin: React.FC = () => {
    const MySwal = withReactContent(Swal);

    const navigate = useNavigate();
    const { auth } = useAuth();
    // console.log(`auth`, auth.data[0]);

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
    const APPOINTMENT_TIME_URL = `${API_SALECONNEXT}/GetAppointmentTime`;

    const SAVEDATA_URL = `${API_SALECONNEXT}/CreateBooking/Submit_Createbooking`;

    const getProductUrl = () => `${API_URL_MONGO}/Product/GetStock?empid=${auth.data[0].EmpId}&teamSale=${auth.data[0].TeamSale}&categoryId=${selectedCategoryId}`;

    const formatThaiDate = (dateString: string) => {
        if (!dateString) return "";

        const date = new Date(dateString);
        const thaiMonths = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
            "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
            "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];

        const day = date.getDate();
        const month = thaiMonths[date.getMonth()];
        const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.

        return `${day} ${month} ${year}`;
    };

    const formatTime = (timeString: string) => {
        if (!timeString) return "";
        const [hours, minutes] = timeString.split(":");
        return `${hours}.${minutes}`; // แปลง ":" เป็น "."
    };

    {/*-------------------- Start Modals ค้นหาลูกค้า --------------------*/ }
    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    {/*-------------------- End Modals ค้นหาลูกค้า --------------------*/ }

    {/*-------------------- Start ข้อมูลพนักงานขาย --------------------*/ }
    // POST พนักงานขาย
    const [employee, setEmployee] = useState<any[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<any>('');
    // console.log(`selectedEmployee`, selectedEmployee);

    const [channelSale, setChannelSale] = useState<any[]>([]);
    const [selectedChannelSale, setSelectedChannelSale] = useState<any>('');
    // console.log(`selectedChannelSale`, selectedChannelSale);

    const [adviser, setAdviser] = useState<any[]>([]);
    const [selectedAdviser, setSelectedAdviser] = useState<any>('');
    // console.log(`selectedAdviser`, selectedAdviser);
    const [selectedfullnameAdviser, setSelectedFullnameAdviser] = useState<any>('');
    // console.log(`selectedfullnameAdviser`, selectedfullnameAdviser);

    const [subChannelSale, setSubChannelSale] = useState<string>('');
    // console.log(`subChannelSale`, subChannelSale);

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

        if (selected) {
            setSelectedAdviser(selected); // อัปเดตข้อมูลพนักงานใน state

            // สร้าง fullnameAdviser โดยรวม FName และ LName
            const fullname = `${selected.FName} ${selected.LName}`;
            setSelectedFullnameAdviser(fullname); // เก็บ fullnameAdviser ใน state
        } else {
            setSelectedAdviser(null); // ล้างข้อมูลพนักงานใน state
            setSelectedFullnameAdviser(''); // ล้างค่า fullnameAdviser
        }
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
    // console.log(`selectedProductId`, selectedProductId);

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
    // console.log(`selectedPackageTypeId`, selectedPackageTypeId);

    const [packageList, setPackageList] = useState<any[]>([]);
    // console.log(`packageList`, packageList);

    const [selectedPackageIndex, setSelectedPackageIndex] = useState<number | null>(null);
    // console.log(`selectedPackageIndex`, selectedPackageIndex);
    const [selectedPackage, setSelectedPackage] = useState<any>('')
    // console.log(`selectedPackage`, selectedPackage);

    const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(false);
    const [isLoadingPackage, setIsLoadingPackage] = useState<boolean>(false);

    // ตัวแปรเก็บค่าราคา + ส่วนลดจาก api
    const [totalPrice, setTotalPrice] = useState<any>(''); //TOTALPRICE
    const [discountAmount, setDiscountAmount] = useState<any>(''); //DISCOUNT

    // input + ฟีลด์ด้านขวา กรอกราคาและส่วนลดเอง
    const [priceInput, setPriceInput] = useState<number | undefined>(undefined);
    const [discountInput, setDiscountInput] = useState<number | undefined>(undefined); // input ส่วนลด
    // console.log(`discountInput`, discountInput);
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
    // console.log(`netPrice`, netPrice);

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
                    ItemID: selectedProductId.ITEMID,
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

        if (selectedId === "") {
            // ล้างค่าทั้งหมดเมื่อไม่มีการเลือกสินค้า
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

        // ค้นหาสินค้าที่เลือก
        const selectedProduct = product.find((item: any) => item.PRODUCTID === selectedId);

        if (selectedProduct) {
            // เก็บข้อมูลสินค้าใน state
            setSelectedProductId(selectedProduct);

            // อัปเดตข้อมูลเพิ่มเติม
            setSelectedItemID(selectedProduct.ITEMID);

            // กรองโปรโมชันที่เกี่ยวข้อง
            const validPromotions = selectedProduct.PROMOTION?.filter(
                (promo: any) => promo.PROMOTIONID !== 0
            ) || [];
            setPromotionList(validPromotions);
            setSelectedPromotionId(null);
        } else {
            // หากไม่มีสินค้าในรายการ ล้างข้อมูลที่เกี่ยวข้อง
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
            setSelectedPackage(null); // ล้างข้อมูลแพ็คเกจที่เลือก
            setDiscountInput(undefined); // ล้างฟีลด์ส่วนลด
            setDiscountValidationMessage(null); // ล้างข้อความการตรวจสอบส่วนลด
            setIsDiscountValid(true); // รีเซ็ตสถานะส่วนลดให้ถูกต้อง
        } else {
            // ค้นหาแพ็คเกจที่เลือกจาก packageList
            const selectedPackageData = packageList[Number(selectedIndex)];
            setSelectedPackageIndex(Number(selectedIndex));
            setSelectedPackage(selectedPackageData); // เก็บข้อมูลแพ็คเกจทั้งหมดใน state
            setDiscountInput(undefined); // ล้างฟีลด์ส่วนลด
            setDiscountValidationMessage(null); // ล้างข้อความการตรวจสอบส่วนลด
            setIsDiscountValid(true); // รีเซ็ตสถานะส่วนลดให้ถูกต้อง
        }
    };
    {/*-------------------- End ข้อมูลสินค้า --------------------*/ }

    {/*-------------------- Start ข้อมูลลูกค้า --------------------*/ }
    const [customerTypes, setCustomerTypes] = useState<any[]>([]);
    const [selectedCustomerType, setsSelectedCustomerType] = useState<string>('');
    // console.log(`selectedCustomerType`, selectedCustomerType);
    const [selectedCardType, setSelectedCardType] = useState<string>('');
    // console.log(`selectedCardType`, selectedCardType);
    const [selectedSexId, setSelectedSexId] = useState<number>();
    // console.log(`selectedSexId`, selectedSexId);
    const [selectedSex, setSelectedSex] = useState<any | null>(null);
    // console.log(`selectedSex`, selectedSex);

    const [companyPrefix, setCompanyPrefix] = useState<any | null>(null); // คำนำหน้าชื่อของนิติบุคคล
    // console.log(`companyPrefix`, companyPrefix);
    const [individualPrefix, setIndividualPrefix] = useState<any | null>(null); // คำนำหน้าชื่อของบุคคลธรรมดา/บุคคลต่างชาติ
    // console.log(`individualPrefix`, individualPrefix);
    const [companyPrefixId, setCompanyPrefixId] = useState<number | null>(null); // ID คำนำหน้าชื่อของนิติบุคคล
    // console.log(`companyPrefixId`, companyPrefixId);
    const [individualPrefixId, setIndividualPrefixId] = useState<number | null>(null); // ID คำนำหน้าชื่อของบุคคลธรรมดา/บุคคลต่างชาติ
    // console.log(`individualPrefixId`, individualPrefixId);

    const [valueCalendar, setValueCalendar] = useState<string | null>(null);
    // console.log(`valueCalendar`, valueCalendar);
    const [valueAge, setValueAge] = useState<number | null>(null);
    // console.log(`valueAge`, valueAge);

    const [idCard, setIdCard] = useState<string>('');
    // console.log(`idCard`, idCard);
    const [fullName, setFullName] = useState<string>('');
    // console.log(`fullName`, fullName);
    const [nameMD, setNameMD] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [mobile, setMobile] = useState<string>('');
    // console.log(`mobile`, mobile);
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
        setsSelectedCustomerType(value); // เปลี่ยนประเภทลูกค้า
        setSelectedCardType(''); // ล้างประเภทบัตร
        resetPrefix(); // ล้างคำนำหน้าชื่อทั้งหมด
    };

    const resetPrefix = () => {
        setCompanyPrefix(null); // ล้างคำนำหน้าชื่อของนิติบุคคล
        setIndividualPrefix(null); // ล้างคำนำหน้าชื่อของบุคคลธรรมดา/บุคคลต่างชาติ
        setCompanyPrefixId(null); // ล้าง ID คำนำหน้าชื่อของนิติบุคคล
        setIndividualPrefixId(null); // ล้าง ID คำนำหน้าชื่อของบุคคลธรรมดา/บุคคลต่างชาติ
    };

    const handleSexChange = (sexId: number) => {
        // ค้นหาเพศที่เลือก
        const selected = selectedCustomer.SEX.find((sex: any) => sex.SEXID === sexId);

        if (selected) {
            // เก็บข้อมูลเพศที่เลือกใน state
            setSelectedSex(selected);
        } else {
            // ล้างข้อมูลเมื่อไม่มีการเลือก
            setSelectedSex(null);
        }

        // อัปเดต ID ที่เลือก
        setSelectedSexId(sexId);
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const formattedDate = dayjs(date).format('YYYY-MM-DD'); // ใช้ dayjs เพื่อให้รองรับ timezone
            setValueCalendar(formattedDate); // เก็บค่าในรูปแบบ yyyy-MM-dd
            const calculatedAge = dayjs().diff(dayjs(date), 'year'); // คำนวณอายุ
            setValueAge(calculatedAge);
        } else {
            setValueCalendar(null); // หากไม่มีวันที่ ให้ตั้งค่าเป็น null
            setValueAge(null); // ตั้งค่าอายุเป็น null
        }
    };

    {/*-------------------- End ข้อมูลลูกค้า --------------------*/ }

    {/*-------------------- Start ที่อยู่ตามบัตร --------------------*/ }
    const [getProvince, setGetProvince] = useState<any[]>([]);
    const [getDistrict, setGetDistrict] = useState<any[]>([]);
    const [getSubDistrict, setGetSubDistrict] = useState<any[]>([]);
    const [getZipcode, setGetZipcode] = useState<any[]>([]);

    {/*-------------------- End ที่อยู่ตามบัตร --------------------*/ }

    {/*-------------------- Start ที่อยู่ติดตั้ง --------------------*/ }
    // สร้าง state สำหรับ "ที่อยู่ลูกค้า (ติดตั้ง)
    const [getProvinceForInstall, setGetProvinceForInstall] = useState<any[]>([]);
    const [getDistrictForInstall, setGetDistrictForInstall] = useState<any[]>([]);
    const [getSubDistrictForInstall, setGetSubDistrictForInstall] = useState<any[]>([]);
    const [getZipcodeForInstall, setGetZipcodeForInstall] = useState<any[]>([]);

    const [addressNumberForInstall, setAddressNumberForInstall] = useState<string>('');
    // console.log(`addressNumberForInstall`, addressNumberForInstall);
    const [addressMooForInstall, setAddressMooForInstall] = useState<string>('');
    const [addressSoiForInstall, setAddressSoiForInstall] = useState<string>('');
    const [addressRoadForInstall, setAddressRoadForInstall] = useState<string>('');
    const [selectedProvinceForInstall, setSelectedProvinceForInstall] = useState<number | undefined>();
    // console.log(`selectedProvinceForInstall`, selectedProvinceForInstall);
    const [selectedDistrictForInstall, setSelectedDistrictForInstall] = useState<number | undefined>();
    const [selectedSubDistrictForInstall, setSelectedSubDistrictForInstall] = useState<number | undefined>();
    const [selectedZipcodeForInstall, setSelectedZipcodeForInstall] = useState<string>('');
    // console.log(`selectedZipcodeForInstall`, selectedZipcodeForInstall);
    const [addressMobileForInstall, setAddressMobileForInstall] = useState<string>('');
    // console.log(`addressMobileForInstall`, addressMobileForInstall);
    const [addressPhoneForInstall, setAddressPhoneForInstall] = useState<string>('');
    const [addressPhoneReserveForInstall, setAddressPhoneReserveForInstall] = useState<string>('');
    const [addressEmailForInstall, setAddressEmailForInstall] = useState<string>('');

    {/*-------------------- Start ที่อยู่เก็บเงิน --------------------*/ }
    const [getProvinceForPayment, setGetProvinceForPayment] = useState<any[]>([]);
    const [getDistrictForPayment, setGetDistrictForPayment] = useState<any[]>([]);
    const [getSubDistrictForPayment, setGetSubDistrictForPayment] = useState<any[]>([]);
    const [getZipcodeForPayment, setGetZipcodeForPayment] = useState<any[]>([]);

    {/*-------------------- End ที่อยู่เก็บเงิน --------------------*/ }

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(PROVINCE_URL, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setGetProvince(response.data);
            } catch (error) {
                console.error('Error fetching CUSTOMER_TYPE_URL:', error);
            }
        };
        getData();
    }, []);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.post(DISTRICT_URL, { ProvinceCode: item.Address_Detail[0].ProvinceCode }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setGetDistrict(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
            } catch (error) {
                console.error('Error fetching DISTRICT_URL:', error);
            }
        }
        getData();
    }, []);

    useEffect(() => {
        const fetchSubDistricts = async () => {
            try {
                const response = await axios.post(SUBDISTRICT_URL, { DistrictCode: item.Address_Detail[0].DistrictCode }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setGetSubDistrict(response.data);
            } catch (error) {
                console.error('Error fetching SUBDISTRICT_URL:', error);
            }
        }
        fetchSubDistricts();
    }, []);

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

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.post(DISTRICT_URL, { ProvinceCode: item.Address_Detail[1].ProvinceCode }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setGetDistrictForInstall(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
            } catch (error) {
                console.error('Error fetching DISTRICT_URL:', error);
            }
        }
        getData();
    }, []);

    useEffect(() => {
        const fetchSubDistricts = async () => {
            try {
                const response = await axios.post(SUBDISTRICT_URL, { DistrictCode: item.Address_Detail[1].DistrictCode }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setGetSubDistrictForInstall(response.data);
            } catch (error) {
                console.error('Error fetching SUBDISTRICT_URL:', error);
            }
        }
        fetchSubDistricts();
    }, []);

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

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(PROVINCE_URL, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setGetProvinceForPayment(response.data);
            } catch (error) {
                console.error('Error fetching CUSTOMER_TYPE_URL:', error);
            }
        };
        getData();
    }, []);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.post(DISTRICT_URL, { ProvinceCode: item.Address_Detail[2].ProvinceCode }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setGetDistrictForPayment(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
            } catch (error) {
                console.error('Error fetching DISTRICT_URL:', error);
            }
        }
        getData();
    }, []);

    useEffect(() => {
        const fetchSubDistricts = async () => {
            try {
                const response = await axios.post(SUBDISTRICT_URL, { DistrictCode: item.Address_Detail[2].DistrictCode }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setGetSubDistrictForPayment(response.data);
            } catch (error) {
                console.error('Error fetching SUBDISTRICT_URL:', error);
            }
        }
        fetchSubDistricts();
    }, []);

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
    // console.log(`isInvoiceRequired`, isInvoiceRequired);

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
    // console.log(`selectedProvinceForTax`, selectedProvinceForTax);
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
    // State สำหรับเก็บรายการค่าใช้จ่าย
    // State สำหรับเก็บรายการค่าใช้จ่าย
    const [expenses, setExpenses] = useState([
        { id: 1, description: 'ค่าขนส่ง', unit: '', cost: '' },
    ]);

    // ฟังก์ชันสำหรับเพิ่มค่าใช้จ่ายใหม่
    const handleAddExpense = () => {
        const newId = expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1;
        setExpenses([
            ...expenses,
            { id: newId, description: '', unit: '', cost: '' },
        ]);
    };

    // ฟังก์ชันสำหรับลบค่าใช้จ่าย
    const handleRemoveExpense = (id: number) => {
        setExpenses(expenses.filter((expense) => expense.id !== id));
    };

    // ฟังก์ชันสำหรับอัปเดตค่าในรายการค่าใช้จ่าย
    const handleChange = (id: number, field: string, value: any) => {
        setExpenses(
            expenses.map((expense) =>
                expense.id === id ? { ...expense, [field]: value } : expense
            )
        );
    };

    // แปลงค่าข้อแรกเป็น ShippingData
    const shippingData = {
        Distance: expenses[0]?.unit || 0, // เก็บค่าจาก "unit" ในข้อแรก
        Price: expenses[0]?.cost || "0.00", // เก็บค่าจาก "cost" ในข้อแรก
    };
    // console.log(`shippingData`, shippingData);

    // ข้อมูลค่าใช้จ่ายอื่น ๆ (ยกเว้นข้อแรก)
    const otherExpensesData = expenses
        .filter((expense) => expense.id > 1) // กรองเฉพาะข้อ 2 เป็นต้นไป
        .map((expense) => ({
            ExpenseTitle: expense.description || 'รายละเอียดค่าใช้จ่าย',
            Price: expense.cost || '0.00',
        }));
    // console.log(`otherExpensesData`, otherExpensesData);

    {/*-------------------- End ค่าใช้จ่ายอื่น ๆ --------------------*/ }

    {/*-------------------- Start สลิป --------------------*/ }
    interface FileWithPreview extends File {
        preview?: string;
        base64?: string; // เพิ่ม base64 property
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
    // console.log(`files`, files);

    const fileInputRefs = {
        transferSlip: useRef<HTMLInputElement>(null),
        certificate: useRef<HTMLInputElement>(null),
        idCard: useRef<HTMLInputElement>(null),
        other: useRef<HTMLInputElement>(null),
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: keyof FileState) => {
        const file = event.target.files?.[0];
        if (file) {
            const base64 = await fileToBase64(file); // แปลงไฟล์เป็น Base64
            const fileWithPreview: FileWithPreview = Object.assign(file, {
                base64: base64, // เก็บ Base64 ที่ตัดส่วนหัวแล้ว
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

    // ฟังก์ชันสำหรับแปลงไฟล์เป็น Base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file); // อ่านไฟล์เป็น Base64
            reader.onload = () => {
                const base64String = reader.result as string;

                // ตัดส่วน "data:image/jpeg;base64," หรือส่วนหัวออก
                const cleanedBase64 = base64String.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
                resolve(cleanedBase64);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    // ตัวอย่างโครงสร้าง PictureData
    const PictureData = {
        TRANSFERSLIP: files.transferSlip
            ? { Base64: files.transferSlip.base64 || '' }
            : null,
        CERTIFICATE: files.certificate
            ? { Base64: files.certificate.base64 || '' }
            : null,
        IDCARD: files.idCard
            ? { Base64: files.idCard.base64 || '' }
            : null,
        OTHERFILES: files.other
            ? { Base64: files.other.base64 || '' }
            : null,
    };

    // แสดงผลใน console
    // console.log(`PictureData`, PictureData);

    {/*-------------------- End สลิป --------------------*/ }

    {/* Start ของแถม */ }
    const [freegift, setFreegift] = useState<any>([]);
    // console.log(`freegift`, freegift);

    const [giftFields, setGiftFields] = useState([{ GiftID: '', Quantity: '' }]); // state สำหรับเก็บรายการของแถม
    // console.log(`giftFields`, giftFields);

    const handleGiftOptionChange = (index: number, value: string) => {
        const newGiftFields = [...giftFields];
        newGiftFields[index].GiftID = value;
        setGiftFields(newGiftFields);
    };

    const handleQuantityChange = (index: number, value: string) => {
        const newGiftFields = [...giftFields];
        newGiftFields[index].Quantity = value;
        setGiftFields(newGiftFields);
    };

    const addGiftField = () => {
        setGiftFields([...giftFields, { GiftID: '', Quantity: '' }]);
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
    // console.log(`valueCalendarInstall`, valueCalendarInstall);
    const [valueTimeInstall, setValueTimeInstall] = useState<any[]>([]);
    const [selectedValueTimeInstall, setSelectedValueTimeInstall] = useState<string>('');
    // console.log(`selectedValueTimeInstall`, selectedValueTimeInstall);
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    const [getShipping, setGetShipping] = useState<any[]>([]);
    const [selectedShipping, setSelectedShipping] = useState<any>(null);
    // console.log(`selectedShipping`, selectedShipping);

    const [addDetail, setAddDetail] = useState<string>('');
    // console.log(`addDetail`, addDetail);

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
    }, [auth]);

    // GET GetAppointmentTime
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(APPOINTMENT_TIME_URL, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setValueTimeInstall(data);
            } catch (error) {
                console.error('Error fetching SHIPPING_URL:', error);
            }
        };
        getData();
    }, [auth]);

    const handleDateChangeInstall = (date: Date | null) => {
        setValueCalendarInstall(date);

        if (date) {
            // Format date to "yyyy-MM-dd"
            const formatted = date.toISOString().split('T')[0];
            setFormattedDate(formatted);
        } else {
            setFormattedDate(null);
        }
    };

    useEffect(() => {
        // console.log(`Formatted DateForAppointment: ${formattedDate}`);
    }, [formattedDate]);

    const handleShippingChange = (shippingId: string) => {
        const selected = getShipping.find((item: any) => String(item.SHIPPING_ID) === shippingId);

        if (selected) {
            setSelectedShipping({
                SHIPPING_ID: selected.SHIPPING_ID,
                SHIPPING_NAME: selected.SHIPPING_NAME,
                SHIPPING_TYPE: selected.SHIPPING_TYPE,
                SHIPPING_GROUP: selected.SHIPPING_GROUP,
            });
        } else {
            setSelectedShipping(null); // ถ้าไม่ได้เลือกอะไรเคลียร์ค่า
        }
    };
    {/*-------------------- End ข้อมูลเพิ่มเติม --------------------*/ }

    {/*-------------------- Start Validate --------------------*/ }
    const schema = yup.object().shape({
        //ข้อมูลพนักงานขาย
        employee: yup.string().required("กรุณาเลือกพนักงานขาย"),
        channelSale: yup.string().required("กรุณาเลือกช่องทางการขาย"),

        //ข้อมูลลูกค้า
        customerType: yup.string().required("กรุณาเลือกประเภทลูกค้า"),
        idCard: yup
            .string()
            .required("กรุณากรอก")
            .matches(/^[0-9]{13}$/, "ต้องเป็นตัวเลข 13 หลัก"),
        telNo: yup
            .string()
            .required("กรุณากรอกเบอร์ที่ติดต่อได้")
            .matches(/^[0-9]{9,10}$/, "เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก"),

        //ที่อยู่ติดตั้ง
        homeNo: yup.string().required("กรุณากรอกบ้านเลขที่"),
        province: yup.string().required("กรุณาเลือกจังหวัด"),
        district: yup.string().required("กรุณาเลือกอำเภอ / เขต"),
        subDistrict: yup.string().required("กรุณาเลือกตำบล / แขวง"),
        telNoInstall: yup
            .string()
            .required("กรุณากรอกเบอร์ที่ติดต่อได้")
            .matches(/^[0-9]{9,10}$/, "เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก"),

        //ข้อมูลเพิ่มเติม
        dateInstall: yup.string().required("กรุณาเลือกวันที่สะดวกติดตั้ง"),
        timeInstall: yup.string().required("กรุณาเลือกช่วงเวลาที่สะดวกติดตั้ง"),
        deliveryBy: yup.string().required("กรุณาเลือกรูปแบบการจัดส่ง"),

    });
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            //ข้อมูลพนักงานขาย
            employee: "",
            channelSale: "",

            //ข้อมูลลูกค้า
            customerType: "",
            idCard: "",
            telNo: "",

            //ที่อยู่ติดตั้ง
            homeNo: "",
            province: "",
            district: "",
            subDistrict: "",
            telNoInstall: "",

            //ข้อมูลเพิ่มเติม
            dateInstall: "",
            timeInstall: "",
            deliveryBy: "",
        },
    });

    console.log("Errors:", errors)

    {/*-------------------- End Validate --------------------*/ }

    {/*-------------------- Start บันทึกข้อมูล --------------------*/ }
    const allData = [
        {
            CreateData: {
                CreateBy: auth.data[0].EmpId,
                Latitude: "0",
                Longitude: "0"
            },
            SalesmanData: {
                SaleEmp: selectedEmployee?.SaleEmp,
                SaleCode: selectedEmployee?.SaleCode,
                SaleTeamCode: selectedEmployee?.TeamName,
                PreSaleEmployeeCode: selectedAdviser?.SaleEmp,
                PreSaleSaleCode: selectedAdviser?.SaleCode,
                PreSaleName: selectedfullnameAdviser,
                PreSaleTeamCode: selectedAdviser?.TeamName,
                Channel: selectedChannelSale,
                SubChannel: subChannelSale,
            },
            ProductData: {
                ProductGroup: selectedProductId?.PRODUCTDESCRIPTION,
                ProductID: selectedProductId?.PRODUCTID,
                ItemID: selectedProductId?.ITEMID,
                PackageCode: selectedPackage?.MODEL,
                SALE: selectedPackage?.TOTALPRICE,
                TotalPrice: netPrice,
                TradeInDiscount: discountInput
            },
            CustomerData: {
                CustomerType: selectedCustomerType,
                CardType: selectedCardType,
                IDCard: idCard,
                PrefixCode: individualPrefixId || companyPrefixId,
                PrefixName: individualPrefix?.PREFIXNAME || companyPrefix?.PREFIXNAME,
                CustomerName: fullName,
                Brithday: valueCalendar,
                Age: valueAge,
                Gender: selectedSex?.SEXNAME,
            },
            AddressInstallData: {
                HomeNumber: addressNumberForInstall,
                Moo: addressMooForInstall,
                Soi: addressSoiForInstall,
                Road: addressRoadForInstall,
                Province: selectedProvinceForInstall,
                District: selectedDistrictForInstall,
                SubDistrict: selectedSubDistrictForInstall,
                ZipCode: selectedZipcodeForInstall,
                TelNo: addressMobileForInstall,
                ReserveTel: addressPhoneReserveForInstall,
                HomeTel: addressPhoneForInstall,
                Email: addressEmailForInstall,
            },
            AddressTaxData: {
                HomeNumber: addressNumberForTax,
                Moo: addressMooForTax,
                Soi: addressSoiForTax,
                Road: addressRoadForTax,
                Province: selectedProvinceForTax,
                District: selectedDistrictForTax,
                SubDistrict: selectedSubDistrictForTax,
                ZipCode: selectedZipcodeForTax,
                TelNo: addressMobileForTax,
                ReserveTel: addressPhoneReserveForTax,
                HomeTel: addressPhoneForTax,
                Email: addressEmailForTax,
            },
            TaxInvoiceData: isInvoiceRequired,
            FreeGiftData: giftFields,
            ShippingData: shippingData,
            OtherExpensesData: otherExpensesData,
            PictureData: PictureData,
            AddInformationData: {
                DateForAppointment: formattedDate,
                TimeForAppointment: selectedValueTimeInstall,
                DeliveryBy: selectedShipping?.SHIPPING_ID,
                AddDetail: addDetail
            }
        }
    ]

    const onSubmit = async (data: any) => {
        // console.log("All Data to Submit:", allData);
        try {
            const response = await axios.post(SAVEDATA_URL, allData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                Swal.fire("สำเร็จ", "บันทึกใบสั่งซื้อสำเร็จ", "success");
                navigate("/order/overview")
            } else {
                Swal.fire("เกิดข้อผิดพลาด", response.data.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
            }
        } catch (error) {
            console.error("Error saving data:", error);
            Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้", "error");
        }
    };
    {/*-------------------- End บันทึกข้อมูล --------------------*/ }

    const location = useLocation();
    const item = location.state as ItemProps || [];
    console.log(`item`, item);

    const [isLoadingPending, setIsLoadingPending] = useState<boolean>(false);
    const [search, setSearch] = useState<string>(''); // State สำหรับค้นหา

    return (
        <>
            <Content>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='d-flex justify-content-between align-items-center mb-5'>
                        <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                            data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                            className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                            <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                                ระบบตรวจใบจองโดย Admin
                            </h1>
                            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                                <li className="breadcrumb-item text-muted">
                                    <span className="text-muted text-hover-primary">
                                        ระบบตรวจใบจอง
                                    </span></li>
                                <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                                <li className="breadcrumb-item text-gray-900">ระบบตรวจใบจองโดย Admin</li>
                            </ul>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className='card mb-10'>
                        <div className='card-body d-flex align-items-center py-5'>
                            <div className='col-12'>

                                <div className='flex-grow-1 mb-15'>
                                    <div className='text-gray-800 fw-bold fs-3'>
                                        {`Booking No: ${item?.BookingNo}`}
                                    </div>
                                    <div className='text-gray-800 fs-6 mt-3'>
                                        {`พนักงานขาย: ${item?.Booking_Detail[0]?.SaleEmployeeName}`}
                                    </div>
                                    <div className='text-danger fs-6'>
                                        {item.CheckerStatusName ? `สถานะ: ${item.CheckerStatusName}` : ""}
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-6 mb-3'>
                                            <label className='form-label fw-bold fs-6'>พนักงานขาย</label>
                                            <input
                                                value={item?.Booking_Detail[0]?.SaleEmployeeName ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>

                                        <div className='col-lg-6 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ช่องทางการขาย</label>
                                            <input
                                                value={item.Booking_Detail[0]?.Channel ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-6 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ผู้แนะนำ (ถ้ามี)</label>
                                            <input
                                                value={item.Booking_Detail[0]?.PreSaleEmployeeName ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>

                                        <div className='col-lg-6 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ช่องทางย่อย</label>
                                            <input
                                                value={item.Booking_Detail[0]?.SubChannel ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <hr className='my-10' style={{ borderTop: '1px dotted black' }} />

                                <label className='form-label fw-bold fs-3 mb-10'>ข้อมูลสินค้า</label>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-6 mb-3'>
                                            <label className='form-label fw-bold fs-6'>สินค้า</label>
                                            <input
                                                value={item.Products_Detail[0]?.ProductName ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-6 mb-3'>
                                            <label className='form-label fw-bold fs-6'>แพ็คเกจ</label>
                                            <input
                                                value={item.PackageTitle ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    <div className='row mb-6'>
                                        <div className='col-lg-6 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ราคาสุทธิ</label>
                                            <input
                                                value={item.TotalPrice ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-6 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ราคาเงินสด</label>
                                            <input
                                                value={item.PackageCash ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>เงินดาวน์</label>
                                            <input
                                                value={item.DownPay ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ชำระครั้งแรก</label>
                                            <input
                                                value={item.FirstPay ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>งวดที่</label>
                                            <input
                                                value={item.MODE ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <hr className='my-10' style={{ borderTop: '1px dotted black' }} />

                                <label className='form-label fw-bold fs-3 mb-10'>เครื่องเทิร์น</label>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-6 mb-3'>
                                            <label className='form-label fw-bold fs-6'>เครื่องเทิร์น</label>
                                            <input
                                                value={item.Booking_Detail[0]?.TradeInBrandCode ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-6 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ส่วนลด</label>
                                            <input
                                                value={item.Booking_Detail[0]?.TradeInDiscount ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-6 mb-3'>
                                            <label className='form-label fw-bold fs-6'>หมายเลขเครื่อง</label>
                                            <input
                                                value={item.Booking_Detail[0]?.TradeInProductCode ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-6 mb-3'>
                                            <label className='form-label fw-bold fs-6'>รุ่น</label>
                                            <input
                                                value={item.Booking_Detail[0]?.TradeInProductModel ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>


                                <hr className='my-10' style={{ borderTop: '1px dotted black' }} />

                                <label className='form-label fw-bold fs-3 mb-10'>ของแถม</label>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-6 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ของแถม</label>
                                            <input
                                                value={item.Freegif_Detail[0]?.Gifts_Name ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-6 mb-3'>
                                            <label className='form-label fw-bold fs-6'>รายละเอียดของแถม</label>
                                            <input
                                                value={item.Freegif_Detail[0]?.Gifts_Detail ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-6 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ราคาของแถม</label>
                                            <input
                                                value={item.Freegif_Detail[0]?.Gifts_Price ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-6 mb-3'>
                                            <label className='form-label fw-bold fs-6'>จำนวนของแถม</label>
                                            <input
                                                value={item.Freegif_Detail[0]?.Gifts1_qty ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <hr className='my-10' style={{ borderTop: '1px dotted black' }} />

                                <label className='form-label fw-bold fs-3 mb-10'>ข้อมูลลูกค้า</label>
                                <>
                                    <div className="container">
                                        <div className='row mb-6'>
                                            <div className="col-lg-4 mb-3">
                                                <label className="form-label fw-bold fs-6">คำนำหน้า</label>
                                                <input
                                                    value={item.Customer_Detail[0]?.PrefixName ?? ""}
                                                    onChange={(e) => setSubChannelSale(e.target.value)}
                                                    type='text'
                                                    className='form-control form-control-lg  mb-3 mb-lg-0'
                                                    disabled={true}
                                                />
                                                {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                            </div>
                                            <div className="col-lg-4 mb-3">
                                                <label className="form-label fw-bold fs-6">ชื่อสกุล</label>
                                                <input
                                                    value={item.CustomerName ?? ""}
                                                    onChange={(e) => setSubChannelSale(e.target.value)}
                                                    type='text'
                                                    className='form-control form-control-lg  mb-3 mb-lg-0'
                                                    disabled={true}
                                                />
                                                {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                            </div>
                                            <div className="col-lg-4 mb-3">
                                                <label className="form-label fw-bold fs-6">ประเภทบัตร</label>
                                                <input
                                                    value={item.Customer_Detail[0]?.IDCardType ?? ""}
                                                    onChange={(e) => setSubChannelSale(e.target.value)}
                                                    type='text'
                                                    className='form-control form-control-lg  mb-3 mb-lg-0'
                                                    disabled={true}
                                                />
                                                {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="container">
                                        <div className='row mb-6'>
                                            <div className="col-lg-4 mb-3">
                                                <label className="form-label fw-bold fs-6">เลขบัตรประชาชน</label>
                                                <input
                                                    value={item.Customer_Detail[0]?.IDCard ?? ""}
                                                    onChange={(e) => setSubChannelSale(e.target.value)}
                                                    type='text'
                                                    className='form-control form-control-lg  mb-3 mb-lg-0'
                                                    disabled={true}
                                                />
                                                {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                            </div>
                                            <div className="col-lg-4 mb-3">
                                                <label className="form-label fw-bold fs-6">ชื่อบริษัท</label>
                                                <input
                                                    value={item.Customer_Detail[0]?.CompanyName ?? ""}
                                                    onChange={(e) => setSubChannelSale(e.target.value)}
                                                    type='text'
                                                    className='form-control form-control-lg  mb-3 mb-lg-0'
                                                    disabled={true}
                                                />
                                                {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                            </div>
                                            <div className="col-lg-4 mb-3">
                                                <label className="form-label fw-bold fs-6">วันเกิด</label>
                                                <input
                                                    value={item.Customer_Detail[0]?.Brithday ?? ""}
                                                    onChange={(e) => setSubChannelSale(e.target.value)}
                                                    type='text'
                                                    className='form-control form-control-lg  mb-3 mb-lg-0'
                                                    disabled={true}
                                                />
                                                {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="container">
                                        <div className='row mt-6'>
                                            <div className="col-lg-6 mb-3">
                                                <label className="form-label fw-bold fs-6">สร้างโดย</label>
                                                <input
                                                    value={item.Customer_Detail[0]?.CreateBy ?? ""}
                                                    onChange={(e) => setSubChannelSale(e.target.value)}
                                                    type='text'
                                                    className='form-control form-control-lg  mb-3 mb-lg-0'
                                                    disabled={true}
                                                />
                                                {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                            </div>
                                            <div className="col-lg-6 mb-3">
                                                <label className="form-label fw-bold fs-6">วันเวลาที่สร้าง</label>
                                                <input
                                                    value={
                                                        `${formatThaiDate(item.Customer_Detail[0]?.CreateDate?.split(' ')[0] ?? "")} เวลา ${formatTime(item.Customer_Detail[0]?.CreateDate?.split(' ')[1] ?? "")
                                                        } น.`
                                                    }
                                                    onChange={(e) => setSubChannelSale(e.target.value)}
                                                    type='text'
                                                    className='form-control form-control-lg  mb-3 mb-lg-0'
                                                    disabled={true}
                                                />
                                                {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="container">
                                        <div className='row mt-6'>
                                            <div className="col-lg-6 mb-3">
                                                <label className="form-label fw-bold fs-6">อัพเดทล่าสุดโดย</label>
                                                <input
                                                    value={item.Customer_Detail[0]?.LastUpdateBy ?? ""}
                                                    onChange={(e) => setSubChannelSale(e.target.value)}
                                                    type='text'
                                                    className='form-control form-control-lg  mb-3 mb-lg-0'
                                                    disabled={true}
                                                />
                                                {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                            </div>
                                            <div className="col-lg-6 mb-3">
                                                <label className="form-label fw-bold fs-6">วันเวลาที่อัพเดทล่าสุด</label>
                                                <input
                                                    value={
                                                        `${formatThaiDate(item.Customer_Detail[0]?.LastUpdateDate?.split(' ')[0] ?? "")} เวลา ${formatTime(item.Customer_Detail[0]?.LastUpdateDate?.split(' ')[1] ?? "")
                                                        } น.`
                                                    }                                              
                                                    onChange={(e) => setSubChannelSale(e.target.value)}
                                                    type='text'
                                                    className='form-control form-control-lg  mb-3 mb-lg-0'
                                                    disabled={true}
                                                />
                                                {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </>

                                <hr className='my-10' style={{ borderTop: '1px dotted black' }} />

                                <label className='form-label fw-bold fs-3 mb-10'>ที่อยู่ตามบัตรประชาชนลูกค้า</label>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>บ้านเลขที่</label>
                                            <input
                                                value={item.Address_Detail[0]?.AddressDetail ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.homeNo && <p className="text-danger">{errors.homeNo.message}</p>}
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>หมู่ที่</label>
                                            <input
                                                value={item.Address_Detail[0]?.AddressDetail2 ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ตรอก / ซอย</label>
                                            <input
                                                value={item.Address_Detail[0]?.AddressDetail3 ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ถนน</label>
                                            <input
                                                value={item.Address_Detail[0]?.AddressDetail4 ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>จังหวัด</label>
                                            <input
                                                value={
                                                    getProvince.find(
                                                        (province) => province.PROVINCECODE === item.Address_Detail[0].ProvinceCode
                                                    )?.PROVINCENAME || ''
                                                }
                                                type='text'
                                                className='form-control mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.province && <p className="text-danger">{errors.province.message}</p>}
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>อำเภอ / เขต</label>
                                            <input
                                                value={
                                                    getDistrict.find(
                                                        (district) => district.DISTRICTCODE === item.Address_Detail[0].DistrictCode
                                                    )?.DISTRICTNAME || ''
                                                }
                                                type='text'
                                                className='form-control mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.district && <p className="text-danger">{errors.district.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ตำบล / แขวง</label>
                                            <input
                                                value={
                                                    getSubDistrict.find(
                                                        (subdistrict) => subdistrict.SUBDISTRICTCODE === item.Address_Detail[0].SubDistrictCode
                                                    )?.SUBDISTRICTNAME || ''
                                                }
                                                type='text'
                                                className='form-control mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.subDistrict && <p className="text-danger">{errors.subDistrict.message}</p>}
                                        </div>

                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>รหัสไปรษณีย์</label>
                                            <input
                                                value={item.Address_Detail[0]?.Zipcode ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                            <input
                                                value={item.Address_Detail[0]?.TelMobile ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.telNoInstall && <p className="text-danger">{errors.telNoInstall.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>เบอร์ที่ทำงาน</label>
                                            <input
                                                value={item.Address_Detail[0]?.TelOffice ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>

                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                            <input
                                                value={item.Address_Detail[0]?.TelHome ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>E-Mail</label>
                                            <input
                                                value={item.Address_Detail[0]?.EMail ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mt-6'>
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label fw-bold fs-6">สร้างโดย</label>
                                            <input
                                                value={item.Address_Detail[0]?.CreateBy ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label fw-bold fs-6">วันเวลาที่สร้าง</label>
                                            <input
                                                value={
                                                    `${formatThaiDate(item.Address_Detail[0]?.CreateDate?.split(' ')[0] ?? "")} เวลา ${formatTime(item.Address_Detail[0]?.CreateDate?.split(' ')[1] ?? "")
                                                    } น.`
                                                }
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mt-6'>
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label fw-bold fs-6">อัพเดทล่าสุดโดย</label>
                                            <input
                                                value={item.Address_Detail[0]?.LastUpdateBy ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label fw-bold fs-6">วันเวลาที่อัพเดทล่าสุด</label>
                                            <input
                                                value={
                                                    `${formatThaiDate(item.Address_Detail[0]?.LastUpdateDate?.split(' ')[0] ?? "")} เวลา ${formatTime(item.Address_Detail[0]?.LastUpdateDate?.split(' ')[1] ?? "")
                                                    } น.`
                                                }
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <hr className='my-10' style={{ borderTop: '1px dotted black' }} />

                                <label className='form-label fw-bold fs-3 mb-10'>ที่อยู่ติดตั้ง</label>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>บ้านเลขที่</label>
                                            <input
                                                value={item.Address_Detail[1]?.AddressDetail ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.homeNo && <p className="text-danger">{errors.homeNo.message}</p>}
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>หมู่ที่</label>
                                            <input
                                                value={item.Address_Detail[1]?.AddressDetail2 ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ตรอก / ซอย</label>
                                            <input
                                                value={item.Address_Detail[1]?.AddressDetail3 ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ถนน</label>
                                            <input
                                                value={item.Address_Detail[1]?.AddressDetail4 ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>จังหวัด</label>
                                            <input
                                                value={
                                                    getProvince.find(
                                                        (province) => province.PROVINCECODE === item.Address_Detail[1].ProvinceCode
                                                    )?.PROVINCENAME || ''
                                                }
                                                type='text'
                                                className='form-control mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.province && <p className="text-danger">{errors.province.message}</p>}
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>อำเภอ / เขต</label>
                                            <input
                                                value={
                                                    getDistrict.find(
                                                        (district) => district.DISTRICTCODE === item.Address_Detail[1].DistrictCode
                                                    )?.DISTRICTNAME || ''
                                                }
                                                type='text'
                                                className='form-control mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.district && <p className="text-danger">{errors.district.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ตำบล / แขวง</label>
                                            <input
                                                value={
                                                    getSubDistrict.find(
                                                        (subdistrict) => subdistrict.SUBDISTRICTCODE === item.Address_Detail[1].SubDistrictCode
                                                    )?.SUBDISTRICTNAME || ''
                                                }
                                                type='text'
                                                className='form-control mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.subDistrict && <p className="text-danger">{errors.subDistrict.message}</p>}
                                        </div>

                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>รหัสไปรษณีย์</label>
                                            <input
                                                value={item.Address_Detail[1]?.Zipcode ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                            <input
                                                value={item.Address_Detail[1]?.TelMobile ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.telNoInstall && <p className="text-danger">{errors.telNoInstall.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>เบอร์ที่ทำงาน</label>
                                            <input
                                                value={item.Address_Detail[1]?.TelOffice ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>

                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                            <input
                                                value={item.Address_Detail[1]?.TelHome ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>E-Mail</label>
                                            <input
                                                value={item.Address_Detail[1]?.EMail ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mt-6'>
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label fw-bold fs-6">สร้างโดย</label>
                                            <input
                                                value={item.Address_Detail[1]?.CreateBy ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label fw-bold fs-6">วันเวลาที่สร้าง</label>
                                            <input
                                                value={
                                                    `${formatThaiDate(item.Address_Detail[1]?.CreateDate?.split(' ')[0] ?? "")} เวลา ${formatTime(item.Address_Detail[1]?.CreateDate?.split(' ')[1] ?? "")
                                                    } น.`
                                                }
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mt-6'>
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label fw-bold fs-6">อัพเดทล่าสุดโดย</label>
                                            <input
                                                value={item.Address_Detail[1]?.LastUpdateBy ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label fw-bold fs-6">วันเวลาที่อัพเดทล่าสุด</label>
                                            <input
                                                value={
                                                    `${formatThaiDate(item.Address_Detail[1]?.LastUpdateDate?.split(' ')[0] ?? "")} เวลา ${formatTime(item.Address_Detail[1]?.LastUpdateDate?.split(' ')[1] ?? "")
                                                    } น.`
                                                }
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <hr className='my-10' style={{ borderTop: '1px dotted black' }} />

                                <label className='form-label fw-bold fs-3 mb-10'>ที่อยู่เรียกเก็บเงิน</label>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>บ้านเลขที่</label>
                                            <input
                                                value={item.Address_Detail[2]?.AddressDetail ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.homeNo && <p className="text-danger">{errors.homeNo.message}</p>}
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>หมู่ที่</label>
                                            <input
                                                value={item.Address_Detail[2]?.AddressDetail2 ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ตรอก / ซอย</label>
                                            <input
                                                value={item.Address_Detail[2]?.AddressDetail3 ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ถนน</label>
                                            <input
                                                value={item.Address_Detail[2]?.AddressDetail4 ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>จังหวัด</label>
                                            <input
                                                value={
                                                    getProvinceForPayment.find(
                                                        (province) => province.PROVINCECODE === item.Address_Detail[2].ProvinceCode
                                                    )?.PROVINCENAME || ''
                                                }
                                                type='text'
                                                className='form-control mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.province && <p className="text-danger">{errors.province.message}</p>}
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>อำเภอ / เขต</label>
                                            <input
                                                value={
                                                    getDistrictForPayment.find(
                                                        (district) => district.DISTRICTCODE === item.Address_Detail[2].DistrictCode
                                                    )?.DISTRICTNAME || ''
                                                }
                                                type='text'
                                                className='form-control mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.district && <p className="text-danger">{errors.district.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>ตำบล / แขวง</label>
                                            <input
                                                value={
                                                    getSubDistrictForPayment.find(
                                                        (subdistrict) => subdistrict.SUBDISTRICTCODE === item.Address_Detail[2].SubDistrictCode
                                                    )?.SUBDISTRICTNAME || ''
                                                }
                                                type='text'
                                                className='form-control mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.subDistrict && <p className="text-danger">{errors.subDistrict.message}</p>}
                                        </div>

                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>รหัสไปรษณีย์</label>
                                            <input
                                                value={item.Address_Detail[2]?.Zipcode ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                            <input
                                                value={item.Address_Detail[2]?.TelMobile ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.telNoInstall && <p className="text-danger">{errors.telNoInstall.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>เบอร์ที่ทำงาน</label>
                                            <input
                                                value={item.Address_Detail[2]?.TelOffice ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>

                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                            <input
                                                value={item.Address_Detail[2]?.TelHome ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>E-Mail</label>
                                            <input
                                                value={item.Address_Detail[2]?.EMail ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mt-6'>
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label fw-bold fs-6">สร้างโดย</label>
                                            <input
                                                value={item.Address_Detail[2]?.CreateBy ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label fw-bold fs-6">วันเวลาที่สร้าง</label>
                                            <input
                                                value={
                                                    `${formatThaiDate(item.Address_Detail[2]?.CreateDate?.split(' ')[0] ?? "")} เวลา ${formatTime(item.Address_Detail[2]?.CreateDate?.split(' ')[1] ?? "")
                                                    } น.`
                                                }
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mt-6'>
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label fw-bold fs-6">อัพเดทล่าสุดโดย</label>
                                            <input
                                                value={item.Address_Detail[2]?.LastUpdateBy ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label fw-bold fs-6">วันเวลาที่อัพเดทล่าสุด</label>
                                            <input
                                                value={
                                                    `${formatThaiDate(item.Address_Detail[2]?.LastUpdateDate?.split(' ')[0] ?? "")} เวลา ${formatTime(item.Address_Detail[2]?.LastUpdateDate?.split(' ')[1] ?? "")
                                                    } น.`
                                                }
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <hr className='my-10' style={{ borderTop: '1px dotted black' }} />

                                <label className='form-label fw-bold fs-3 mb-10 mt-10'>ค่าใช้จ่ายอื่น ๆ</label>

                                <hr className='mt-10 mb-10' style={{ borderTop: '1px dotted black' }} />

                                <label className='form-label fw-bold fs-3 mb-10 mt-10'>ไฟล์รูป</label>

                                <hr className='mt-10' style={{ borderTop: '1px dotted black' }} />

                                <label className='form-label fw-bold fs-3 mb-10 mt-10'>ข้อมูลเพิ่มเติม</label>

                                {/* S2 Telesale */}

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className="col-lg-4 mb-6">
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <label className="form-label fw-bold fs-6">วันที่สะดวกติดตั้ง</label>
                                                <input
                                                    value={formatThaiDate(item.Booking_Detail[0]?.InstallDate?.split(' ')[0] ?? "")}
                                                    onChange={(e) => setSubChannelSale(e.target.value)}
                                                    type='text'
                                                    className='form-control form-control-lg  mb-3 mb-lg-0'
                                                    disabled={true}
                                                />
                                                {errors.dateInstall && <p className="text-danger">{errors.dateInstall.message}</p>}
                                            </div>
                                        </div>
                                        <div className='col-lg-4 mb-6'>
                                            <label className='form-label fw-bold fs-6'>ช่วงเวลา</label>
                                            <input
                                                value={formatTime(item.Customer_Detail[0]?.CreateDate?.split(' ')[1] ?? "")}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.timeInstall && <p className="text-danger">{errors.timeInstall.message}</p>}
                                        </div>
                                        <div className='col-lg-4 mb-10'>
                                            <label className='form-label fw-bold fs-6'>รูปแบบการจัดส่ง</label>
                                            <input
                                                value={""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.deliveryBy && <p className="text-danger">{errors.deliveryBy.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className="col-lg-4 mb-6">
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <label className="form-label fw-bold fs-6">พนักงานติดตั้ง</label>
                                                <input
                                                    value={item.Booking_Detail[0]?.InstallerEmployeeCode ?? ""}
                                                    onChange={(e) => setSubChannelSale(e.target.value)}
                                                    type='text'
                                                    className='form-control form-control-lg  mb-3 mb-lg-0'
                                                    disabled={true}
                                                />
                                                {errors.dateInstall && <p className="text-danger">{errors.dateInstall.message}</p>}
                                            </div>
                                        </div>
                                        <div className='col-lg-4 mb-6'>
                                            <label className='form-label fw-bold fs-6'>โปรแกรมติดตั้ง</label>
                                            <input
                                                value={item.Booking_Detail[0]?.InstallerSaleCode ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.timeInstall && <p className="text-danger">{errors.timeInstall.message}</p>}
                                        </div>
                                        <div className='col-lg-4 mb-10'>
                                            <label className='form-label fw-bold fs-6'>ทีมติดตั้ง</label>
                                            <input
                                                value={item.Booking_Detail[0]?.InstallerTeamCode ?? ""}
                                                onChange={(e) => setSubChannelSale(e.target.value)}
                                                type='text'
                                                className='form-control form-control-lg  mb-3 mb-lg-0'
                                                disabled={true}
                                            />
                                            {errors.deliveryBy && <p className="text-danger">{errors.deliveryBy.message}</p>}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div >
                    {/* End Card Body */}

                    {/* ผ่าน ไม่ผ่าน */}
                    <div className='row mb-6 mx-10'>
                        <div className='col-lg-4 mb-3'>
                            <label className='form-check form-check-inline me-5'>
                                <input
                                    onChange={handleCheckboxChange}
                                    className='form-check-input'
                                    name='cbxApprove'
                                    type='checkbox'
                                // checked={cbxApproveSelected}
                                />
                                <span className='fw-bold ps-2 fs-6 mb-sm-5'>ผ่าน</span>
                            </label>
                        </div>
                        <div className='col-lg-4 mb-3'>
                            <label className='form-check form-check-inline me-5 mt-3 mt-sm-0'>
                                <input
                                    onChange={handleCheckboxChange}
                                    className='form-check-input'
                                    name='cbxReject'
                                    type='checkbox'
                                // checked={cbxRejectSelected}
                                />
                                <span className='fw-bold ps-2 fs-6'>ไม่ผ่าน</span>
                            </label>
                        </div>
                        <div className='col-lg-4 mb-3'>
                            <label className='form-check form-check-inline me-5 mt-3 mt-sm-0'>
                                <input
                                    onChange={handleCheckboxChange}
                                    className='form-check-input'
                                    name='cbxCancel'
                                    type='checkbox'
                                // checked={cbxCancelSelected}
                                />
                                <span className='fw-bold ps-2 fs-6'>แจ้งแก้ไข</span>
                            </label>
                        </div>
                    </div>

                    <div className='row mb-10 mx-10'>
                        <div className='col-lg-6 mb-20'>
                            <label className='form-label fw-bold fs-6'>รายละเอียดเพิ่มเติม</label>
                            <textarea
                                // onChange={(e) => setComment(e.target.value)}
                                className='form-control bg-transparent mb-3 mb-lg-0 h-100' />
                        </div>
                    </div>
                    {/* ผ่าน ไม่ผ่าน */}

                    <div className='d-none d-xl-flex justify-content-between align-items-center my-5'>
                        <button
                            className='btn btn-secondary w-100 w-md-auto align-self-center h-50px'
                            onClick={() => navigate('/order-checker')}
                            type='button'
                        >
                            ย้อนกลับ
                        </button>
                        <button
                            className='btn btn-primary w-100 w-md-auto align-self-center h-50px mt-5'
                            onClick={handleSubmit(onSubmit)} // เรียก handleSubmit เมื่อกดปุ่ม
                            type="button"
                        >
                            บันทึกการตรวจสอบ
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
                            onClick={() => navigate('/order-checker')}
                            type='button'
                        >
                            ย้อนกลับ
                        </button>
                        <button
                            className={`btn btn-primary w-auto`}
                            onClick={handleSubmit(onSubmit)}
                            type="button"
                        >
                            บันทึกการตรวจสอบ
                        </button>
                    </div>
                </form>
            </Content >
        </>
    )
}

export default OrderDetailCheckerAdmin;