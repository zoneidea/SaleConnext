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

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const OrderCreateBooking: React.FC = () => {
    const MySwal = withReactContent(Swal);

    const navigate = useNavigate();
    const { auth } = useAuth();
    // console.log(`auth`, auth.data[0]);

    // ดึงข้อมูลลูกค้าที่เลือกจาก modal ที่เก็บใน Store
    const selectedCustomerDataFromModal = useCustomerStore((state) => state.selectedCustomer);
    // console.log(`selectedCustomerDataFromModal`, selectedCustomerDataFromModal);

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

    const getProductUrl = () => `${API_URL_MONGO}/Product/GetStock?empid=${auth.data[0].EmpId}&teamSale=${auth.data[0].TeamSale}&categoryId=${selectedCategoryId}&ProcessType=${auth.processtype}`;

    const [isLoading, setIsLoading] = useState<boolean>(false)

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
        setIsLoading(true)
        const postData = async () => {
            try {
                const response = await axios.post(EMPLOYEE_URL,
                    {
                        EmpId: auth.data[0].EmpId,
                        TeamSale: auth.data[0].TeamSale,
                        ProcessType: auth.processtype,
                        DepID: auth.data[0].DepID,
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
            } finally {
                setIsLoading(false)
            }
        };
        postData();
    }, [auth]);

    // ช่องทาง
    useEffect(() => {
        setIsLoading(true)
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
            } finally {
                setIsLoading(false)
            }
        };
        postData();
    }, [auth]);

    // ผู้แนะนำ (ถ้ามี)
    useEffect(() => {
        setIsLoading(true)
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
            } finally {
                setIsLoading(false)
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
        setIsLoading(true)
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
            } finally {
                setIsLoading(false)
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
        setIsLoading(true)
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
            } finally {
                setIsLoading(false)
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

    // GET Province For Install
    useEffect(() => {
        setIsLoading(true)
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
            } finally {
                setIsLoading(false)
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
        setIsLoading(true)
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
            } finally {
                setIsLoading(false)
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
        setIsLoading(true)
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
            } finally {
                setIsLoading(false)
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
        setIsLoading(true)
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
            } finally {
                setIsLoading(false)
            }
        };
        getData();
    }, []);

    // GET GetAppointmentTime
    useEffect(() => {
        setIsLoading(true)
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
            } finally {
                setIsLoading(false)
            }
        };
        getData();
    }, []);

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

    // console.log("Errors:", errors)

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


    return (
        <>
            <Content>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                                {auth.data[0].HascustomerSearch === "true" && (
                                    <>
                                        < ModalTrigger handleShow={handleShow} />
                                        <SerchCustomerModal show={showModal} handleClose={handleClose} />
                                        <hr className='my-10' style={{ borderTop: '1px dotted black' }} />
                                    </>
                                )}

                                {/* <>
                                    < ModalTrigger handleShow={handleShow} />
                                    <SerchCustomerModal show={showModal} handleClose={handleClose} />
                                    <hr className='my-10' style={{ borderTop: '1px dotted black' }} />
                                </> */}

                                {/* End ปุ่มค้นหาลูกค้า */}

                                <label className='form-label fw-bold fs-3 mb-10'>ข้อมูลพนักงานขาย</label>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label required fw-bold fs-6">พนักงานขาย</label>
                                            <Controller
                                                name="employee"
                                                control={control}
                                                render={({ field }) => (
                                                    <select
                                                        {...field}
                                                        className={`form-select ${errors.employee ? "is-invalid" : ""}`}
                                                        value={selectedEmployee.SaleEmp}
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                            handleEmployeeChange(e)
                                                        }}
                                                    >
                                                        <option value="">เลือกพนักงานขาย...</option>
                                                        {Array.isArray(employee) &&
                                                            employee.map((item) => (
                                                                <option key={item.id} value={item.SaleEmp}>
                                                                    {item.SaleCode} - {item.FName} {item.LName} (ทีม {item.TeamName})
                                                                </option>
                                                            ))}
                                                    </select>
                                                )}
                                            />
                                            {errors.employee && <p className="text-danger">{errors.employee.message}</p>}
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label required fw-bold fs-6">ช่องทางการขาย</label>
                                            <Controller
                                                name="channelSale"
                                                control={control}
                                                render={({ field }) => (
                                                    <select
                                                        {...field}
                                                        className={`form-select ${errors.channelSale ? "is-invalid" : ""}`}
                                                        value={selectedChannelSale}
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                            setSelectedChannelSale(e.target.value)
                                                        }}
                                                    >
                                                        <option value="">เลือกช่องทางการขาย...</option>
                                                        {Array.isArray(channelSale) &&
                                                            channelSale.map((item: any) => (
                                                                <option key={item.id} value={item.CHANNEL_ID}>
                                                                    {item.CHANNEL_NAME}
                                                                </option>
                                                            ))}
                                                    </select>
                                                )}
                                            />
                                            {errors.channelSale && <p className="text-danger">{errors.channelSale.message}</p>}
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
                                                            <label className='form-label required fw-bold'>หมวดหมู่สินค้า</label>
                                                            <select
                                                                className={`form-select`}
                                                                onChange={(e) => {
                                                                    handleCateOptionChange(e); // อัปเดต state หรือ logic อื่น ๆ
                                                                }}
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
                                                            <label className='form-label required fw-bold'>หมวดหมู่สินค้า</label>
                                                            <select
                                                                className={`form-select`}
                                                                onChange={(e) => {
                                                                    handleCateOptionChange(e); // อัปเดต state หรือ logic อื่น ๆ
                                                                }}
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
                                                            <label className='form-label required fw-bold'>หมวดหมู่สินค้า</label>
                                                            <select
                                                                className={`form-select`}
                                                                onChange={(e) => {
                                                                    handleCateOptionChange(e); // อัปเดต state หรือ logic อื่น ๆ
                                                                }}
                                                            >
                                                                <option value="">เลือกหมวดหมู่สินค้า...</option>
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
                                                                        <option key={item.id} value={index}>
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
                                                            <label className='form-label required fw-bold'>หมวดหมู่สินค้า</label>
                                                            <select
                                                                className={`form-select`}
                                                                onChange={(e) => {
                                                                    handleCateOptionChange(e); // อัปเดต state หรือ logic อื่น ๆ
                                                                }}
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
                                                    <Controller
                                                        name="customerType"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <select
                                                                {...field}
                                                                className={`form-select ${errors.customerType ? "is-invalid" : ""}`}
                                                                value={selectedCustomerType || ''}
                                                                onChange={(e) => {
                                                                    field.onChange(e); // อัปเดต React Hook Form
                                                                    handleCustTypeOptionChange(e); // อัปเดต state หรือ logic อื่น ๆ
                                                                }}
                                                            >
                                                                <option value=''>เลือกประเภทลูกค้า...</option>
                                                                {customerTypes.map((item: any) => (
                                                                    <option key={item.CUSTOMERTYPE} value={item.CUSTOMERTYPE}>
                                                                        {item.CUSTOMERTYPENAME}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    />
                                                    {errors.customerType && <p className="text-danger">{errors.customerType.message}</p>}
                                                </div>

                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>ประเภทบัตร</label>
                                                    <select
                                                        className={`form-select`}
                                                        value={selectedCardType || ''}
                                                        onChange={(e) => {
                                                            setSelectedCardType(e.target.value); // อัปเดต selectedCardType
                                                        }}
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
                                                <div className="col-lg-4 mb-3">
                                                    <label className="form-label required fw-bold fs-6">บัตรประชาชน</label>
                                                    <Controller
                                                        name="idCard"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <input
                                                                {...field}
                                                                className={`form-control ${errors.idCard ? "is-invalid" : ""}`}
                                                                onChange={(e) => {
                                                                    field.onChange(e)
                                                                    setIdCard(e.target.value)
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>คำนำหน้าชื่อ</label>
                                                    <select
                                                        className={`form-control form-select`}
                                                        value={individualPrefixId || ''}
                                                        onChange={(e) => {
                                                            const selected = selectedCustomer.PREFIX.find((prefix: any) => prefix.PREFIXID === Number(e.target.value));
                                                            if (selected) {
                                                                setIndividualPrefix(selected);
                                                                setIndividualPrefixId(selected.PREFIXID);
                                                            } else {
                                                                setIndividualPrefix(null);
                                                                setIndividualPrefixId(null);
                                                            }
                                                        }}
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
                                                        className={`form-control`}
                                                        value={selectedCustomerDataFromModal ? selectedCustomerDataFromModal.name : fullName}
                                                        onChange={(e) => {
                                                            setFullName(e.target.value)
                                                        }}
                                                        type='text'
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="container">
                                            <div className='row mb-6'>
                                                <div className="col-lg-4 mb-3">
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <label className="form-label required fw-bold fs-6">วันเดือนปีเกิด</label>
                                                        <DatePicker
                                                            className={`form-control mb-3 mb-lg-0`}
                                                            selected={valueCalendar ? new Date(valueCalendar) : null}
                                                            onChange={(e) => {
                                                                handleDateChange(e)
                                                            }}
                                                            showYearDropdown
                                                            showMonthDropdown
                                                            dropdownMode="select"
                                                            isClearable
                                                            dateFormat="yyyy-MM-dd"
                                                            withPortal
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
                                                            className={`form-control form-select mb-3 mb-lg-0`}
                                                            value={selectedSexId}
                                                            onChange={(e) => {
                                                                handleSexChange(Number(e.target.value))
                                                            }}
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
                                                            <Controller
                                                                name="telNo"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <input
                                                                        {...field}
                                                                        className={`form-control ${errors.telNo ? "is-invalid" : ""}`}
                                                                        value={selectedCustomerDataFromModal ? selectedCustomerDataFromModal.phone_number : mobile}
                                                                        onChange={(e) => {
                                                                            field.onChange(e)
                                                                            setMobile(e.target.value)
                                                                        }}
                                                                        type='text'
                                                                        required
                                                                    />
                                                                )}
                                                            />
                                                            {errors.telNo && <p className="text-danger">{errors.telNo.message}</p>}
                                                        </div>
                                                        <div className='col-lg-6 mb-3'>
                                                            <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                                            <input
                                                                className={`form-control`}
                                                                value={selectedCustomerDataFromModal ? selectedCustomerDataFromModal.TelHome : phone}
                                                                onChange={(e) => {
                                                                    setPhone(e.target.value)
                                                                }}
                                                                type='text'
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
                                                            className={`form-control`}
                                                            value={selectedCustomerDataFromModal ? selectedCustomerDataFromModal.TelOffice : workPhone}
                                                            onChange={(e) => {
                                                                setWorkPhone(e.target.value)
                                                            }}
                                                            type='text'
                                                        />
                                                    </div>
                                                    <div className='col-lg-6 mb-3'>
                                                        <label className='form-label fw-bold fs-6'>อีเมล์</label>
                                                        <input
                                                            className={`form-control`}
                                                            value={email}
                                                            onChange={(e) => {
                                                                setEmail(e.target.value)
                                                            }}
                                                            type='text'
                                                        />
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
                                                    <Controller
                                                        name="customerType"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <select
                                                                {...field}
                                                                className={`form-select ${errors.customerType ? "is-invalid" : ""}`}
                                                                onChange={handleCustTypeOptionChange}
                                                                value={selectedCustomerType || ''}
                                                            >
                                                                <option value=''>เลือกประเภทลูกค้า...</option>
                                                                {customerTypes.map((item: any) => (
                                                                    <option key={item.CUSTOMERTYPE} value={item.CUSTOMERTYPE}>
                                                                        {item.CUSTOMERTYPENAME}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    />
                                                    {errors.customerType && <p className="text-danger">{errors.customerType.message}</p>}
                                                </div>

                                                <div className='col-lg-6'>
                                                    <label className='form-label required fw-bold fs-6'>ชื่อบริษัท</label>
                                                    <input
                                                        className={`form-control`}
                                                        value={fullName}
                                                        onChange={(e) => {
                                                            setFullName(e.target.value)
                                                        }}
                                                        type='text'
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="container">
                                            <div className='row mb-6'>
                                                <div className='col-lg-4'>
                                                    <label className='form-label required fw-bold fs-6'>เลขประจำตัวผู้เสียภาษี</label>
                                                    <Controller
                                                        name="idCard"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <input
                                                                {...field}
                                                                className={`form-control ${errors.idCard ? "is-invalid" : ""}`}
                                                                value={idCard}
                                                                onChange={(e) => {
                                                                    field.onChange(e)
                                                                    setIdCard(e.target.value)
                                                                }}
                                                                type='text'
                                                            />
                                                        )}
                                                    />
                                                    {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>คำนำหน้า</label>
                                                    <select
                                                        className={`form-select`}
                                                        value={companyPrefixId || ''}
                                                        onChange={(e) => {
                                                            const selected = selectedCustomer.PREFIX.find((prefix: any) => prefix.PREFIXID === Number(e.target.value));
                                                            if (selected) {
                                                                setCompanyPrefix(selected);
                                                                setCompanyPrefixId(selected.PREFIXID);
                                                            } else {
                                                                setCompanyPrefix(null);
                                                                setCompanyPrefixId(null);
                                                            }
                                                        }}
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
                                                        className={`form-control`}
                                                        value={nameMD}
                                                        onChange={(e) => {
                                                            setNameMD(e.target.value)
                                                        }}
                                                        type='text'
                                                    />
                                                </div>
                                            </div>

                                            <div className="container">
                                                <div className='row mb-6 mt-6'>
                                                    <div className='col-lg-6 mb-3'>
                                                        <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                                        <Controller
                                                            name="telNo"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <input
                                                                    {...field}
                                                                    className={`form-control ${errors.telNo ? "is-invalid" : ""}`}
                                                                    value={mobile}
                                                                    type='text'
                                                                    onChange={(e) => {
                                                                        field.onChange(e)
                                                                        setMobile(e.target.value)
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                        {errors.telNo && <p className="text-danger">{errors.telNo.message}</p>}
                                                    </div>
                                                    <div className='col-lg-6 mb-3'>
                                                        <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                                        <input
                                                            className={`form-control`}
                                                            value={phone}
                                                            type='text'
                                                            onChange={(e) => {
                                                                setPhone(e.target.value)
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="container">
                                                <div className='row mb-6'>
                                                    <div className='col-lg-6 mb-3'>
                                                        <label className='form-label fw-bold fs-6'>เบอร์ที่ทำงาน</label>
                                                        <input
                                                            className={`form-select form-control mb-3 mb-lg-0`}
                                                            value={workPhone}
                                                            type='text'
                                                            onChange={(e) => {
                                                                setWorkPhone(e.target.value)
                                                            }}
                                                        />
                                                    </div>
                                                    <div className='col-lg-6 mb-3'>
                                                        <label className='form-label fw-bold fs-6'>อีเมล์</label>
                                                        <input
                                                            className={`form-control mb-3 mb-lg-0`}
                                                            value={email}
                                                            onChange={(e) => {
                                                                setEmail(e.target.value)
                                                            }}
                                                            type='text'
                                                        />
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
                                            <Controller
                                                name="homeNo"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        className={`form-control ${errors.homeNo ? "is-invalid" : ""}`}
                                                        value={selectedCustomerDataFromModal ? selectedCustomerDataFromModal.AddressDetail : addressNumberForInstall}
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                            setAddressNumberForInstall(e.target.value);
                                                        }}
                                                        type='text'
                                                    />
                                                )}
                                            />
                                            {errors.homeNo && <p className="text-danger">{errors.homeNo.message}</p>}
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
                                            <Controller
                                                name="province"
                                                control={control}
                                                render={({ field }) => (
                                                    <select
                                                        {...field}
                                                        className={`form-select ${errors.province ? "is-invalid" : ""}`}
                                                        value={selectedProvinceForInstall}
                                                        onChange={(e) => {
                                                            setSelectedProvinceForInstall(Number(e.target.value))
                                                            field.onChange(e)
                                                        }}
                                                    >
                                                        <option value=''>เลือกจังหวัด...</option>
                                                        {getProvinceForInstall.map((item: any) => (
                                                            <option key={item.id} value={item.PROVINCECODE}>
                                                                {item.PROVINCENAME}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            />
                                            {errors.province && <p className="text-danger">{errors.province.message}</p>}
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label required fw-bold fs-6'>อำเภอ / เขต</label>
                                            <Controller
                                                name="district"
                                                control={control}
                                                render={({ field }) => (
                                                    <select
                                                        {...field}
                                                        className={`form-select ${errors.district ? "is-invalid" : ""}`}
                                                        value={selectedDistrictForInstall}
                                                        onChange={(e) => {
                                                            setSelectedDistrictForInstall(Number(e.target.value))
                                                            field.onChange(e)
                                                        }}
                                                    >
                                                        <option value=''>เลือกอำเภอ / เขต...</option>
                                                        {getDistrictForInstall.map((item: any) => (
                                                            <option key={item.DISTRICTCODE} value={item.DISTRICTCODE}>
                                                                {item.DISTRICTNAME}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            />
                                            {errors.district && <p className="text-danger">{errors.district.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label required fw-bold fs-6'>ตำบล / แขวง</label>
                                            <Controller
                                                name="subDistrict"
                                                control={control}
                                                render={({ field }) => (
                                                    <select
                                                        {...field}
                                                        className={`form-select ${errors.subDistrict ? "is-invalid" : ""}`}
                                                        value={selectedSubDistrictForInstall}
                                                        onChange={(e) => {
                                                            setSelectedSubDistrictForInstall(Number(e.target.value))
                                                            field.onChange(e)
                                                        }}
                                                    >
                                                        <option value=''>เลือกตำบล / แขวง...</option>
                                                        {getSubDistrictForInstall.map((item: any) => (
                                                            <option key={item.SUBDISTRICTCODE} value={item.SUBDISTRICTCODE}>
                                                                {item.SUBDISTRICTNAME}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            />
                                            {errors.subDistrict && <p className="text-danger">{errors.subDistrict.message}</p>}
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
                                            <Controller
                                                name="telNoInstall"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        className={`form-control mb-3 mb-lg-0 ${errors.telNoInstall ? "is-invalid" : ""}`}
                                                        value={addressMobileForInstall}
                                                        onChange={(e) => {
                                                            setAddressMobileForInstall(e.target.value)
                                                            field.onChange(e)
                                                        }}
                                                        type='text'
                                                    />
                                                )}
                                            />
                                            {errors.telNoInstall && <p className="text-danger">{errors.telNoInstall.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className='row mb-6'>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>เบอร์โทรศัพท์สำรอง</label>
                                            <input
                                                className={`form-control mb-3 mb-lg-0`}
                                                value={addressPhoneReserveForInstall}
                                                onChange={(e) => {
                                                    setAddressPhoneReserveForInstall(e.target.value)
                                                }}
                                                type='text'
                                            />
                                        </div>

                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                            <input
                                                className={`form-control mb-3 mb-lg-0`}
                                                value={addressPhoneForInstall}
                                                onChange={(e) => {
                                                    setAddressPhoneForInstall(e.target.value)
                                                }}
                                                type='text'
                                            />
                                        </div>
                                        <div className='col-lg-4 mb-3'>
                                            <label className='form-label fw-bold fs-6'>E-Mail</label>
                                            <input
                                                className={`form-control mb-3 mb-lg-0 $`}
                                                value={addressEmailForInstall}
                                                onChange={(e) => {
                                                    setAddressEmailForInstall(e.target.value)
                                                }}
                                                type='text'
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
                                                            value={gift.GiftID}
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
                                                            value={gift.Quantity}
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

                                <label className='form-label fw-bold fs-3 mb-10 mt-10'>ค่าใช้จ่ายอื่น ๆ</label>

                                <div className="container">
                                    {expenses.map((expense, index) => (
                                        <div
                                            className="row mb-2 align-items-center"
                                            key={expense.id}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px", // เพิ่มการจัดช่องว่างระหว่างคอลัมน์
                                            }}
                                        >
                                            <div
                                                style={{
                                                    flex: "0 0 5%",
                                                    textAlign: "center",
                                                }}
                                            >
                                                <span>{index + 1}.</span>
                                            </div>

                                            {index === 0 ? (
                                                <>
                                                    {/* ข้อแรก: ค่าขนส่ง */}
                                                    <div
                                                        style={{
                                                            flex: "0 0 5%",
                                                            display: "flex",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <strong>{expense.description}</strong>
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: "0 0 25%",
                                                        }}
                                                    >
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            style={{
                                                                width: "100%",
                                                                textAlign: "center",
                                                            }}
                                                            value={expense.unit}
                                                            onChange={(e) =>
                                                                handleChange(expense.id, "unit", e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: "0 0 7%",
                                                            display: "flex",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <span>กิโลเมตร</span>
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: "0 0 10%",
                                                        }}
                                                    >
                                                        <span>เป็นเงิน</span>
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: "0 0 15%",
                                                        }}
                                                    >
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            style={{
                                                                width: "100%",
                                                                textAlign: "center",
                                                            }}
                                                            value={expense.cost}
                                                            onChange={(e) =>
                                                                handleChange(expense.id, "cost", e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: "0 0 10%",
                                                        }}
                                                    >
                                                        <span>บาท</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {/* ข้อต่อไป */}
                                                    <div
                                                        style={{
                                                            flex: "0 0 31%",
                                                        }}
                                                    >
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={expense.description}
                                                            onChange={(e) =>
                                                                handleChange(expense.id, "description", e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: "0 0 7%",
                                                        }}
                                                    >
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: "0 0 10%",
                                                        }}
                                                    >
                                                        <span>เป็นเงิน</span>
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: "0 0 15%",
                                                        }}
                                                    >
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            style={{
                                                                width: "100%",
                                                                textAlign: "center",
                                                            }}
                                                            value={expense.cost}
                                                            onChange={(e) =>
                                                                handleChange(expense.id, "cost", e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: "0 0 10%",
                                                        }}
                                                    >
                                                        <span>บาท</span>
                                                    </div>
                                                    <div
                                                        style={{
                                                            flex: "0 0 5%",
                                                            display: "flex",
                                                            justifyContent: "flex-end",
                                                        }}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger"
                                                            style={{
                                                                backgroundColor: "#ff4d4f",
                                                                color: "#fff",
                                                                border: "none",
                                                            }}
                                                            onClick={() => handleRemoveExpense(expense.id)}
                                                        >
                                                            ลบ
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}

                                    {/* ปุ่มสำหรับเพิ่มค่าใช้จ่าย */}
                                    <div
                                        className="row mt-4"
                                        style={{
                                            textAlign: "center",
                                        }}
                                    >
                                        <div className="col-12">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                style={{
                                                    backgroundColor: "#007bff",
                                                    color: "#fff",
                                                    border: "none",
                                                }}
                                                onClick={handleAddExpense}
                                            >
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
                                                <Controller
                                                    name="dateInstall"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <DatePicker
                                                            {...field}
                                                            className={`form-select ${errors.dateInstall ? "is-invalid" : ""}`}
                                                            selected={valueCalendarInstall}
                                                            onChange={(e) => {
                                                                handleDateChangeInstall(e)
                                                                field.onChange(e)
                                                            }}
                                                            showYearDropdown
                                                            showMonthDropdown
                                                            dropdownMode="select"
                                                            isClearable
                                                            dateFormat="yyyy/MM/dd"
                                                            withPortal
                                                        />
                                                    )}
                                                />
                                                {errors.dateInstall && <p className="text-danger">{errors.dateInstall.message}</p>}
                                            </div>
                                        </div>

                                        <div className='col-lg-6 mb-6'>
                                            <label className='form-label required fw-bold fs-6'>ช่วงเวลา</label>
                                            <Controller
                                                name="timeInstall"
                                                control={control}
                                                render={({ field }) => (
                                                    <select
                                                        {...field}
                                                        className={`form-select ${errors.timeInstall ? "is-invalid" : ""}`}
                                                        value={selectedValueTimeInstall}
                                                        onChange={(e) => {
                                                            setSelectedValueTimeInstall(e.target.value)
                                                            field.onChange(e)
                                                        }}
                                                    >
                                                        <option value=''>เลือกช่วงเวลา...</option>
                                                        {valueTimeInstall.map((item: any) => (
                                                            <option key={item.id} value={item.TIME_ID}>
                                                                {item.TIME_TITLE}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            />
                                            {errors.timeInstall && <p className="text-danger">{errors.timeInstall.message}</p>}
                                        </div>

                                        <div className="container">
                                            <div className='col-lg-6 mb-10'>
                                                <label className='form-label required fw-bold fs-6'>รูปแบบการจัดส่ง</label>
                                                <Controller
                                                    name="deliveryBy"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <select
                                                            {...field}
                                                            className={`form-select ${errors.deliveryBy ? "is-invalid" : ""}`}
                                                            value={selectedShipping?.SHIPPING_ID || ''}
                                                            onChange={(e) => {
                                                                handleShippingChange(e.target.value)
                                                                field.onChange(e)
                                                            }}
                                                        >
                                                            <option value=''>เลือกรูปแบบการจัดส่ง...</option>
                                                            {getShipping.map((item: any) => (
                                                                <option key={item.SHIPPING_ID} value={item.SHIPPING_ID}>
                                                                    {item.SHIPPING_NAME}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                />
                                                {errors.deliveryBy && <p className="text-danger">{errors.deliveryBy.message}</p>}
                                            </div>

                                            <div className='col-lg-12 mb-6'>
                                                <textarea
                                                    className="form-control"
                                                    style={{
                                                        width: '100%',       // ความกว้างเต็มพื้นที่
                                                        resize: 'none',       // ปิดการปรับขนาด
                                                        minHeight: '100px',   // ความสูงขั้นต่ำ
                                                    }}
                                                    onChange={(e) => setAddDetail(e.target.value)}
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
                            type='button'
                        >
                            ย้อนกลับ
                        </button>
                        <button
                            className='btn btn-primary w-100 w-md-auto align-self-center h-50px mt-5'
                            onClick={handleSubmit(onSubmit)} // เรียก handleSubmit เมื่อกดปุ่ม
                            type="button"
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
                            type='button'
                        >
                            ย้อนกลับ
                        </button>
                        <button
                            className={`btn btn-primary w-auto`}
                            onClick={handleSubmit(onSubmit)}
                            type="button"
                        >
                            บันทึก
                        </button>
                    </div>
                </form>
            </Content >
        </>
    )
}

export default OrderCreateBooking;