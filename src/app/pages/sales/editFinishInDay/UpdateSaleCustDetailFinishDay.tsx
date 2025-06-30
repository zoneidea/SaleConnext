import styles from '@/styles/style.module.css'
import IDCardOCR from '../components/ocr/IDCardOCR'

import { useState, ChangeEvent, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios';
import clsx from 'clsx'
import { KTIcon, toAbsoluteUrl } from '../../../../_metronic/helpers'
import { Content } from '../../../../_metronic/layout/components/content'
import { useAuth } from '../../../modules/auth/core/Auth';

import {
    useUUIDStore,
    useSaveCustomerStore,
    useSaveAddressStore
} from '../../../modules/stores/stepsStore';

import dayjs, { Dayjs } from 'dayjs';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'

interface ItemProps {
    REFNO: String,
    CONTNO: String,
    EMPID: String,
    TEAMSALE: String,
    SALECODE: String,
    SUPEMPID: String,
    SECEMPID: String,
    STATUS: String,
    PRODUCT: [any],
    CUSTOMERSTATUS: [any],
    DISCOUNT: [any],
    CUSTOMERDETAIL: [any],
    ADDRESS: [any],
    PDPA: [any],
    CONTRACT: [any],
    IMAGE: [any],
    CHECKERCOMMENT: [any]
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

interface OCRResultState {
    rawText: string;
    error?: string;
}

type FormValues = {
    fullName: string;
    lastName: string;
    idCard:   string;
    telNo:    string;
    email:    string;
  };

const UpdateSaleCustDetailFinishDay: React.FC = () => {
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal);

    const location = useLocation();
    const item = location.state as ItemProps || [];
    console.log(`item`, item);

    const refno = item?.REFNO
    const customerDetail = item?.CUSTOMERDETAIL?.[0] ?? {}
    // console.log(`customerDetail`, customerDetail);

    let customerStatus = item?.CUSTOMERSTATUS
    // console.log(`customerStatus`, customerStatus);

    const product = item?.PRODUCT

    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';
    const DivisionId = auth?.data?.[0]?.DivisionId || '';
    const DepartId = auth?.data?.[0]?.DepartId || '';
    const DepartGroup = auth?.data?.[0]?.DepartGroup || '';

    const { saveCustomerTypes, setSaveCustomerTypes } = useSaveCustomerStore()
    // console.log(`saveCustomerTypes`,saveCustomerTypes);

    const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
    const CUSTOMER_TYPE_URL = `${API_SALECONNEXT}/GetCustomertype`;
    const API_URL_POST_CONDITIONSCHECKHISTORY = `${API_SALECONNEXT}/ConditionsCheckHistory`;

    const API_URL_POST_CHECKCUSTOMER = import.meta.env.VITE_APP_API_THIENSURAT;
    const CHECKCUSTOMER_URL = `${API_URL_POST_CHECKCUSTOMER}/CheckCustomer`;

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
    const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`
    const GET_IMAGES_API = `${API_URL_MONGO}/Contract/GetContractImage`;

    const [Model, setModel] = useState<string>('');
    const [checktype, setChecktype] = useState<number | null>(null);

    const [customerTypes, setCustomerTypes] = useState<any[]>([]);

    const [valueCalendar, setValueCalendar] = useState<Date | null>(null);
    const [valueAge, setValueAge] = useState<number | null>(customerDetail[0]?.CUSTOMERRAGE ?? null);
    // console.log(`valueAge`, valueAge);

    const [selectedCustomerType, setsSelectedCustomerType] = useState<string>('');
    const [selectedCardType, setSelectedCardType] = useState<string>('');
    const [selectedPrefixId, setSelectedPrefixId] = useState<number>();
    const [selectedSexId, setSelectedSexId] = useState<number>();

    const [idCard, setIdCard] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [nameMD, setNameMD] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [mobile, setMobile] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [workPhone, setWorkPhone] = useState<string>('');

    const selectedCustomer = customerTypes.find((type) => type.CUSTOMERTYPE === selectedCustomerType) || { CARDTYPE: [], PREFIX: [], SEX: [] };

    const [images, setImages] = useState<ImagesType | null>(null);

    // เช็ค validate ฟอร์ม
    const [formValid, setFormValid] = useState<boolean>(false);

    {/************ สแกนบัตร ************/ }
    const [showScanner, setShowScanner] = useState(false);
    // เมื่อ user ถ่ายภาพบัตร เราเก็บ base64 ลง state นี้
    const [idCardBase64, setIdCardBase64] = useState<string | null>(null);

    // state สำหรับเก็บผลลัพธ์ Text จาก OCR.space
    const [ocrResult, setOcrResult] = useState<OCRResultState | null>(null);

    const [isLoadingOCR, setIsLoadingOCR] = useState(false);

    {/****** matchedItem *******/ }
    const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false);
    const [draft, setDraft] = useState<any[]>([]);

    useEffect(() => {
        const getDataDraft = async () => {
            setIsLoadingDraft(true);
            try {
                const response = await axios.get(DRAFT_ALLCONTRACT_URL);
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setDraft(data);
            } catch (error) {
                console.error('Error fetching DRAFT_ALLCONTRACT_URL:', error);
            } finally {
                setIsLoadingDraft(false);
            }
        };
        getDataDraft();
    }, []);

    // เลือก item ที่ REFNO ตรงกัน (find สำหรับ 1 item หรือ filter สำหรับหลาย item)
    const matchedItem = draft.find(item => item.REFNO === refno);
    console.log(`matchedItem`, matchedItem);

    {/****** matchedItem *******/ }

    // เมื่อได้รับ base64 จาก IDCardViewer ให้มา preview ที่หน้า SalesCreateCust
    const handleCapturedImage = (base64Image: string) => {
        setIdCardBase64(base64Image);
        setShowScanner(false);
        setOcrResult(null);
    };

    // ฟังก์ชันเรียก OCR.space API (เมื่อมี idCardBase64)
    const callOCRSpace = async (base64Image: string) => {
        try {
            setIsLoadingOCR(true);
            const API_OCR = import.meta.env.VITE_APP_API_OCR;

            // เตรียม payload ในรูปแบบ FormData
            const formData = new FormData();
            formData.append('apikey', API_OCR);
            formData.append('base64Image', base64Image);
            formData.append('language', 'tha');            // อ่านภาษาไทย
            formData.append('isOverlayRequired', 'false');
            formData.append('filetype', 'PNG');            // หรือ 'JPG' ตาม screenshotFormat 
            formData.append('detectOrientation', 'true');
            formData.append('isCreateSearchablePdf', 'false');
            formData.append('scale', 'false');
            formData.append('isTable', 'false');
            formData.append('OCREngine', '2');             // ใช้ OCR Engine 2

            const response = await axios.post(
                'https://api.ocr.space/parse/image',
                formData,
                {
                    headers: {
                        // 'Content-Type' จะถูกเซ็ตเป็น multipart/form-data โดย axios เอง
                    },
                }
            );

            const data = response.data;
            if (data.OCRExitCode === 1 && data.ParsedResults) {
                const allText = data.ParsedResults
                    .map((res: any) => res.ParsedText)
                    .join('\n');
                setOcrResult({ rawText: allText });
            } else {
                const errMsg = data.ErrorMessage || 'Unknown OCR error';
                setOcrResult({ rawText: '', error: errMsg });
            }
        } catch (error: any) {
            setOcrResult({ rawText: '', error: error.message || 'Request failed' });
        } finally {
            setIsLoadingOCR(false);
        }
    };

    // เมื่อ selected idCardBase64 เปลี่ยน → เรียก OCR.space
    useEffect(() => {
        if (idCardBase64) {
            callOCRSpace(idCardBase64);
        }
    }, [idCardBase64]);


    {/************ สแกนบัตร ************/ }

    function formatLocalDate(d: Date): string {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${dd}`;
    }

    // เก็บข้อมูลส่วนลดใน state และ store
    const SaveCustomertData = useMemo(() => {
        const customerTypeData = customerTypes.find((type) => type.CUSTOMERTYPE === selectedCustomerType);
        // console.log("customerTypeData:", customerTypeData);

        return [
            {
                CUSTOMERTYPE: selectedCustomerType,
                CUSTOMERTYPENAME: customerTypeData ? customerTypeData.CUSTOMERTYPENAME : '', // ตรวจสอบว่าข้อมูล customerTypeData มีหรือไม่
                CUSTOMERID: idCard,
                CUSTOMERNAME: fullName,
                CUSTOMERLASTNAME: lastName,
                CUSTOMERMD: nameMD,
                CUSTOMERDOB: valueCalendar ? dayjs(valueCalendar).format('YYYY-MM-DD') : '',
                CUSTOMERRAGE: valueAge ? valueAge.toString() : '',
                CUSTOMERMOBILE: mobile,
                CUSTOMERWORKPHONE: workPhone,
                CUSTOMERPHONE: phone,
                CUSTOMEREMAIL: email,
                CARDTYPE: customerTypeData?.CARDTYPE ? customerTypeData.CARDTYPE
                    .filter((cardType: any) => {
                        // console.log("Selected Card Type:", selectedCardType);
                        // console.log("Available Card Type:", cardType.CARDTYPE);
                        return String(cardType.CARDTYPE) === String(selectedCardType); // ใช้การเปรียบเทียบแบบ string
                    })
                    .map((cardType: any) => ({
                        CARDTYPE: selectedCardType,
                        CARDTYPECODE: cardType.CARDTYPECODE,
                        CARDTYPENAME: cardType.CARDTYPENAME,
                    })) : [],
                PREFIX: customerTypeData?.PREFIX ? customerTypeData.PREFIX
                    .filter((prefix: any) => prefix.PREFIXID === selectedPrefixId) // ใช้เฉพาะค่าที่เลือก
                    .map((prefix: any) => ({
                        PREFIXID: selectedPrefixId,
                        PREFIXCODE: prefix.PREFIXCODE,
                        PREFIXNAME: prefix.PREFIXNAME,
                    })) : [],
                SEX: customerTypeData?.SEX ? customerTypeData.SEX
                    .filter((sex: any) => sex.SEXID === selectedSexId) // ใช้เฉพาะค่าที่เลือก
                    .map((sex: any) => ({
                        SEXID: selectedSexId,
                        SEXCODE: sex.SEXCODE,
                        SEXNAME: sex.SEXNAME,
                    })) : [],
            }
        ];
    }, [customerTypes,
        selectedCustomerType,
        idCard,
        fullName,
        valueCalendar,
        valueAge,
        selectedCardType,
        selectedPrefixId,
        selectedSexId,
        email,
        mobile,
        phone,
        workPhone
    ]);

    // อัปเดตข้อมูลส่วน customer ลง store
    useEffect(() => {
        if (JSON.stringify(SaveCustomertData) !== JSON.stringify(saveCustomerTypes)) {
            setSaveCustomerTypes(SaveCustomertData); // อัปเดตข้อมูลลง store
        }
    }, [SaveCustomertData, saveCustomerTypes, setSaveCustomerTypes]);

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

        const dobString = customerDetail?.[0]?.CUSTOMERDOB;  // สมมติได้ "2023-06-17"
        if (dobString) {
            // แปลงจาก "YYYY-MM-DD" → Date object
            setValueCalendar(new Date(dobString));
        } else {
            setValueCalendar(null);
        }

        setsSelectedCustomerType(customerDetail?.[0]?.CUSTOMERTYPE)
        setSelectedCardType(customerDetail?.[0]?.CARDTYPE?.[0]?.CARDTYPE)
        setIdCard(customerDetail?.[0]?.CUSTOMERID)
        setFullName(customerDetail?.[0]?.CUSTOMERNAME)
        setLastName(customerDetail?.[0]?.CUSTOMERLASTNAME)
        setNameMD(customerDetail?.[0]?.CUSTOMERMD)
        setSelectedPrefixId(customerDetail?.[0]?.PREFIX?.[0]?.PREFIXID)
        setAge(customerDetail?.[0]?.CUSTOMERRAGE)
        setSelectedSexId(customerDetail?.[0]?.SEX?.[0]?.SEXID)
        setMobile(customerDetail?.[0]?.CUSTOMERMOBILE)
        setPhone(customerDetail?.[0]?.CUSTOMERPHONE)
        setWorkPhone(customerDetail?.[0]?.CUSTOMERWORKPHONE)
        setEmail(customerDetail?.[0]?.CUSTOMEREMAIL)

        if (product?.[0]) {
            if (product?.[0].Package?.[0]) {
                setModel(product?.[0].Package?.[0].MODEL)
            }
        }

        if (customerStatus.length > 0) {

        } else {
            customerValidation()
        }
    }, []);

    // fetch collection ContractImage
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(GET_IMAGES_API, {
                    params: { REFNO: refno },
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

    const customerValidation = async () => {
        const conditionCheckResponse = await axios.post(API_URL_POST_CONDITIONSCHECKHISTORY, {
            EmpId, DivisionId, DepartId, DepartGroup, TeamSale, Model
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        let updateData;

        // console.log(conditionCheckResponse)

        setChecktype(conditionCheckResponse.data.checktype);
        if (conditionCheckResponse.data.status == 200) {
            if (conditionCheckResponse.data.checktype !== 0) {
                MySwal.fire({
                    title: 'กรุณาตรวจสอบประวัติลูกค้า',
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
                    showDenyButton: true,
                    showCancelButton: true,
                    showCloseButton: false,
                    confirmButtonText: 'ตรวจสอบ',
                    cancelButtonText: 'กลับ',
                    denyButtonText: 'ยกลเลิก',
                    preConfirm: async () => {
                        const input = (document.getElementById('idCardInput') as HTMLInputElement).value;
                        if (input.length === 13) {
                            return input;
                        } else {
                            MySwal.showValidationMessage('กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก');
                            return null;
                        }
                    }
                }).then(async (result) => {
                    // console.log(result)
                    if (result.isDismissed) {
                        navigate('/sale/step', { state: item })
                    } else if (result.isDenied) {
                        customerValidation()
                    } else {
                        const apiResponse = await axios.post(CHECKCUSTOMER_URL, { Search: result.value }, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });

                        const { Customerstatus, message } = apiResponse.data;
                        await MySwal.fire({
                            text: message,
                            icon: Customerstatus ? 'error' : 'success',
                            confirmButtonText: 'ตกลง'
                        });

                        // console.log(apiResponse)

                        if (Customerstatus) {
                            navigate('/sale/step', { state: item })
                        } else {
                            setIdCard(result.value)

                            updateData = [result.value, conditionCheckResponse.data.checktype, message];
                        }
                    }
                });
            } else {
                updateData = ["", conditionCheckResponse.data.checktype, conditionCheckResponse.data.message];
            }
        }

        try {
            const updateContract = await axios.post(UPDATECONTACT, {
                REFNO: refno,
                EMPID: EmpId,
                TEAMSALE: TeamSale,
                FIELD: "CUSTOMERSTATUS",
                DATA: updateData,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (conditionCheckResponse.data.checktype !== 0) {
                if (updateContract.status === 200) {
                    if (!updateContract.data.data) {
                        MySwal.fire('เกิดข้อผิดพลาด', 'ปรับปรุงข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา', 'error');
                    } else {
                        customerStatus = updateContract.data.data
                        MySwal.fire('สำเร็จ', 'ปรับปรุงข้อมูลการตรวจสอบสถานะแล้ว', 'success');
                    }
                } else {
                    MySwal.fire('เกิดข้อผิดพลาด', updateContract.data.message, 'error');
                }
            }
        } catch (error) {
            console.error('Error updating contract:', error);
            MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตข้อมูลได้', 'error');
        }
    }

    // Handle Customer Type Change
    const handleCustTypeOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setsSelectedCustomerType(value);
        setSelectedCardType('');
    }

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const calculatedAge = dayjs().diff(dayjs(date), 'year');
            if (calculatedAge <= 20) {
                MySwal.fire({
                    icon: 'warning',
                    title: 'อายุไม่ถึงเกณฑ์',
                    text: 'อายุต้องมากกว่า 20 ปีขึ้นไปจึงทำรายการได้',
                })
                // เคลียร์ค่าใน DatePicker และอายุ
                setValueCalendar(null);
                setValueAge(null);
                return; // ยกเลิกการ set ค่าอื่น ๆ ต่อ
            }
            // ถ้าอายุมากกว่า 18 ก็ set ค่าให้ปกติ
            setValueCalendar(date);
            setValueAge(calculatedAge);
        } else {
            // กรณีลบวันที่ทิ้ง
            setValueCalendar(null);
            setValueAge(null);
        }
    };

    const onSubmit = async () => {
        // ถ้าไม่มีข้อผิดพลาดให้ทำการอัพเดทข้อมูล
        try {
            const updateContract = await axios.post(UPDATECONTACT, {
                REFNO: refno,
                EMPID: EmpId,
                TEAMSALE: TeamSale,
                SALECODE: SaleCode,
                SUPEMPID: SupEmpId,
                SECEMPID: SecEmpId,
                FIELD: "CUSTOMERDETAIL",
                DATA: SaveCustomertData
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (updateContract.status === 200 && updateContract.data.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ!',
                    text: 'ปรับปรุงข้อมูลลูกค้าแล้ว',
                    timer: 2000,
                    showConfirmButton: false,
                });
                navigate("/sale/update/updateAddress", {
                    state: {
                        ...matchedItem,
                    }
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด!',
                    text: updateContract.data.message || 'ไม่สามารถอัปเดตข้อมูลได้',
                });
            }
        } catch (error) {
            console.error('Error updating data:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง',
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

        // console.log(response)

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

    {/*-------------------- Start Validate --------------------*/ }

    const schema = yup.object({
        fullName: yup
            .string()
            .required("กรุณากรอกชื่อ"),
        lastName: yup
            .string(),
        idCard: yup
            .string()
            .notRequired()
            .test('is-13-digits', 'กรุณากรอกเลขบัตร 13 หลัก', v => !v || /^[0-9]{13}$/.test(v))
            .test(
                'valid-thai-id',
                'เลขบัตรประชาชนไม่ถูกต้อง',
                v => {
                    if (!v) return true;               // ถ้าไม่กรอก → ผ่านเลย
                    if (selectedCardType !== '1') return true; // ถ้าไม่ใช่บัตรประชาชน → ผ่าน
                    return isValidThaiId(v);           // ถ้าใช่บัตรประชาชนและมีค่า → ตรวจ checksum
                }
            ),
        telNo: yup
            .string()
            .notRequired()
            .test('is-9-10-digits', 'เบอร์โทรต้องเป็นตัวเลข 9–10 หลัก', v => !v || /^[0-9]{9,10}$/.test(v)),
        email: yup
            .string()
            .notRequired()
            .email('รูปแบบอีเมลไม่ถูกต้อง'),
    });

    // 2) infer type
    type FormValues = yup.InferType<typeof schema>;

    // 3. เรียก useForm พร้อม resolver
    const {
        control,
        handleSubmit,
        setValue,
        reset,
        trigger,
        getValues,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            fullName: '',
            lastName: '',
            idCard: '',
            telNo: '',
            email: '',
        },
    });

    // useEffect(() => {
    //     if (customerDetail?.length) {
    //         const cd = customerDetail[0];
    //         setValue("fullName", cd.CUSTOMERNAME);
    //         setValue("idCard", cd.CUSTOMERID);
    //         setValue("telNo", cd.CUSTOMERMOBILE);
    //         setValue("email", cd.CUSTOMEREMAIL);

    //         setsSelectedCustomerType(cd.CUSTOMERTYPE)
    //         setSelectedCardType(cd.CARDTYPE?.[0]?.CARDTYPE)
    //         setIdCard(cd.CUSTOMERID)
    //         setFullName(cd.CUSTOMERNAME)
    //         setLastName(cd.CUSTOMERLASTNAME)
    //         setNameMD(cd.CUSTOMERMD)
    //         setSelectedPrefixId(cd.PREFIX?.[0]?.PREFIXID)
    //         setAge(cd.CUSTOMERRAGE)
    //         setSelectedSexId(cd.SEX?.[0]?.SEXID)
    //         setMobile(cd.CUSTOMERMOBILE)
    //         setPhone(cd.CUSTOMERPHONE)
    //         setWorkPhone(cd.CUSTOMERWORKPHONE)
    //         setEmail(cd.CUSTOMEREMAIL)
    //     }
    // }, [customerDetail, setValue]);

  const didInit = useRef(false);

useEffect(() => {
  if (didInit.current) return;
  const c = matchedItem?.CUSTOMERSTATUS?.[0]?.Contract;
  if (!c) return;
  didInit.current = true;

  // แยกชื่อ–นามสกุล
  const parts = (c.CustomerName || '').trim().split(/\s+/);
  const first = parts.shift() || '';
  const last  = parts.join(' ')  || '';

  // เลือก Address ตัวที่สองก่อน ถ้าไม่มีค่อย fallback ตัวแรก
  const addrs = Array.isArray(c.Address) ? c.Address : [];
  const addr  = addrs[1] ?? addrs[0] ?? {};

  // เตรียมค่าที่จะใส่ลงฟอร์ม + local state
  const values = {
    fullName:  first,
    lastName:  last,
    idCard:    c.IDCard       || '',
    telNo:     (addr.TelMobile  || '').replace(/-/g, ''),
    phone:     (addr.TelHome    || '').replace(/-/g, ''),
    workPhone: (addr.TelOffice  || '').replace(/-/g, ''),
    email:     addr.EMail      || '',
  }

  // 1) รีเซ็ต RHF fields
  reset({
    fullName: values.fullName,
    lastName: values.lastName,
    idCard:   values.idCard,
    telNo:    values.telNo,
    email:    values.email,
  });

  // 2) ซิงก์กลับ local state
  setFullName(  values.fullName );
  setLastName(  values.lastName );
  setIdCard(    values.idCard );
  setMobile(    values.telNo );
  setPhone(     values.phone );
  setWorkPhone( values.workPhone );
  setEmail(     values.email );

  // 3) ถ้าต้องการให้ RHF field อัปเดตด้วย
  setValue('telNo',  values.telNo);
  setValue('email', values.email);
}, [matchedItem, reset, setValue]);
      
    {/*-------------------- End Validate --------------------*/ }

    useEffect(() => {
        if (ocrResult && ocrResult.rawText) {
            const text = ocrResult.rawText;

            // 1) ดึงเลขบัตรเหมือนเดิม (กรองช่องว่าง/ขีดออก)
            const match = text.match(/(\d[\d\s\-]{11,}\d)/);
            if (match && match[1]) {
                // 1. ดึงค่าที่จับได้
                const rawId = match[1]; // อาจเป็น "1 103000 078735" หรือ "1103 0000787 35"
                // 2. กรองเอาช่องว่างและขีดออกเหลือตัวเลขติดกัน
                const cleanedId = rawId.replace(/[\s\-]/g, "");

                // 3. เซ็ตลง state และ React Hook Form
                setIdCard(cleanedId);
                setValue("idCard", cleanedId);
                trigger("idCard");
            }

            // 2) ดึงชื่อ-นามสกุล (สมมติว่าชื่อและนามสกุลใน OCR เป็นตัวอักษรไทย แยกด้วยเว้นวรรค)
            //    เราจะจับกลุ่มอักษรไทยสองกลุ่ม ที่คั่นด้วยเว้นวรรคอย่างน้อยหนึ่งตัว
            const nameRegex = /(?:น(?:าย|าง|\.ส\.))\s*([ก-์]+)\s+([ก-์]+)/;
            const nameMatch = text.match(nameRegex);

            if (nameMatch) {
                const firstNameFromOCR = nameMatch[1].trim();
                const lastNameFromOCR = nameMatch[2].trim();

                // เซ็ตลง state และ React Hook Form
                setFullName(firstNameFromOCR);
                setLastName(lastNameFromOCR);
            }

            // 3) ดึงวันเกิด
            const thaiDateRe = /เกิดวันที่\s*([0-9]{1,2})\s*(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s*([0-9]{4})/;
            const thaiMatch = text.match(thaiDateRe);
            if (thaiMatch) {
                const day = parseInt(thaiMatch[1], 10);
                const thaiMonthMap: Record<string, number> = {
                    'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4,
                    'พ.ค.': 5, 'มิ.ย.': 6, 'ก.ค.': 7, 'ส.ค.': 8,
                    'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12
                };
                const rawMonth = thaiMatch[2];           // type string
                const month = thaiMonthMap[rawMonth]; // ไม่เตือนแล้ว
                let year = parseInt(thaiMatch[3], 10);
                if (year > 2400) year -= 543;                  // ถ้าเป็น พ.ศ. ลบ 543

                const parsed = new Date(year, month - 1, day);
                if (!isNaN(parsed.getTime())) {
                    setValueCalendar(parsed);
                    handleDateChange(parsed);
                    return;  // จบเลย ไม่ต้อง fallback English
                }
            }

            // 2) ถ้าไม่เจอวันที่ไทย จึงค่อย fallback English แบบเดิม (optional)
            const engDateRe = /Date of (?:surth|birth)\s*([0-9]{1,2})\s*(Jan\.?|Feb\.?|Mar\.?|Apr\.?|May\.?|Jun\.?|Jul\.?|Aug\.?|Sep\.?|Oct\.?|Nov\.?|Dec\.?)\.?\s*([0-9]{4})/i;
            const engMatch = text.match(engDateRe);
            if (engMatch) {
                const day = parseInt(engMatch[1], 10);
                const engMonthMap: Record<string, number> = {
                    'Jan': 1, 'Jan.': 1, 'Feb': 2, 'Feb.': 2, 'Mar': 3, 'Mar.': 3,
                    'Apr': 4, 'Apr.': 4, 'May': 5, 'May.': 5, 'Jun': 6, 'Jun.': 6,
                    'Jul': 7, 'Jul.': 7, 'Aug': 8, 'Aug.': 8, 'Sep': 9, 'Sep.': 9,
                    'Oct': 10, 'Oct.': 10, 'Nov': 11, 'Nov.': 11, 'Dec': 12, 'Dec.': 12
                };
                const month = engMonthMap[engMatch[2]];
                const year = parseInt(engMatch[3], 10);
                const parsed = new Date(year, (month || 1) - 1, day);
                if (!isNaN(parsed.getTime())) {
                    setValueCalendar(parsed);
                    handleDateChange(parsed);
                }
            }
        }
    }, [ocrResult]);

    // นำเข้าเลยข้างบนของไฟล์
    function isValidThaiId(id: string): boolean {
        if (!/^\d{13}$/.test(id)) return false;
        const digits = id.split('').map(d => parseInt(d, 10));
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            sum += digits[i] * (13 - i);
        }
        const check = (11 - (sum % 11)) % 10;
        return check === digits[12];
    }

    return (
        <>
            {/* Modal แสดง IDCardViewer เมื่อ showScanner === true */}
            {showScanner && (
                <IDCardOCR
                    onCapture={handleCapturedImage}
                    onClose={() => setShowScanner(false)}
                />
            )}

            {/* Preview ภาพบัตรที่ถ่ายได้ (Base64) */}
            {idCardBase64 && (
                <div style={{ marginTop: 20, textAlign: 'center' }}>
                    <h4 className={`${styles.fontSize}`}>ภาพที่ถ่ายจากกล้อง:</h4>
                    <img
                        src={idCardBase64}
                        alt="ID Card Preview"
                        style={{
                            maxWidth: '100%',
                            border: '1px solid #ccc',
                            borderRadius: 4,
                        }}
                    />
                </div>
            )}

            {/* แสดงสถานะการเรียก OCR.space */}
            {idCardBase64 && (
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                    {isLoadingOCR ? (
                        <p className={`${styles.fontSize}`}>กำลังอ่านข้อมูลจากบัตร (OCR)...</p>
                    ) : ocrResult ? (
                        <>
                            {ocrResult.error ? (
                                <div style={{ color: 'red' }}>
                                    <h5>เกิดข้อผิดพลาดจาก OCR:</h5>
                                    <p>{ocrResult.error}</p>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'left', whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                                    <h5 className={`${styles.fontSize}`}>ผลลัพธ์:</h5>
                                    <pre className={`${styles.fontSize}`}>{ocrResult.rawText}</pre>
                                </div>
                            )}
                        </>
                    ) : null}
                </div>
            )}
            {/* สแกนบัตร */}

            <Content>
                <div className='d-flex justify-content-between align-items-center my-5'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-ceดnter">
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className={`breadcrumb-item ${styles.titlePage}`}>แก้ไขข้อมูลลูกค้า</li>
                        </ul>
                    </div>
                </div>
                <span className={`${styles.fontSize}`}>เลขที่ขาย: </span><span className={`${styles.titlePage}`}>{refno}</span>

                {/* Card Body */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='accordion mb-10' id='kt_accordion_1'>
                        {/* Start accordion ข้อมูลลูกค้า*/}
                        <div className='accordion-item mb-10'>
                            <h2 className='accordion-header' id='kt_accordion_1_header_1'>
                                <h3
                                    className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                    data-bs-toggle='collapse'
                                    data-bs-target='#kt_accordion_1_body_1'
                                    aria-expanded='true'
                                    aria-controls='kt_accordion_1_body_1'
                                    style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                                >
                                    ข้อมูลลูกค้า
                                </h3>
                            </h2>
                            <div
                                id='kt_accordion_1_body_1'
                                className='accordion-collapse collapse show'
                                aria-labelledby='kt_accordion_1_header_1'
                                data-bs-parent='#kt_accordion_1'
                            >
                                <div className='accordion-body'>
                                    {/* start form */}
                                    <form className='form'>
                                        <div className='card-body px-lg-9 px-1'>
                                            {selectedCustomerType !== "1" && (
                                                <>
                                                    <div className="">
                                                        <div className='row mb-6'>
                                                            <div className='col-lg-6 mb-3'>
                                                                <label className={`form-label ${styles.label}`}>ประเภทลูกค้า</label>
                                                                <select
                                                                    // disabled={customerDetail?.length > 0 ? true : false}
                                                                    className={`form-select ${styles.label}`}
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
                                                                <label className={`form-label ${styles.label}`}>ประเภทบัตร</label>
                                                                <select
                                                                    className={`form-select ${styles.label}`}
                                                                    value={selectedCardType}
                                                                    // disabled={customerDetail?.length > 0 ? customerDetail?.[0]?.CARDTYPE.length > 0 ? true : false : false}
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

                                                    <div className="">
                                                        <div className='row mb-6'>
                                                            {/* <div className='col-lg-6'>
                                                                <label className={`form-label ${styles.label}`}>เลขบัตร</label>
                                                                <input
                                                                    // disabled={customerDetail?.length > 0 ? customerDetail?.[0]?.CUSTOMERID !== "" ? true : false : false}
                                                                    value={idCard}
                                                                    onChange={handleIdCardChange}
                                                                    type='text'
                                                                    className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                                                    placeholder='บัตรประชาชน'
                                                                />
                                                                {errors.idCard && <p className='text-danger'>{errors.idCard}</p>}
                                                            </div> */}
                                                            <div className='col-lg-6 mb-3'>
                                                                <label className={`${styles.label} `}>เลขบัตร</label>
                                                                <Controller
                                                                    name="idCard"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <div className={`input-group ${styles.customInputGroup}`}>
                                                                            <input
                                                                                {...field}
                                                                                className={`form-control ${styles.label} ${errors.idCard ? "is-invalid" : ""}`}
                                                                                value={idCard}
                                                                                maxLength={13}
                                                                                onKeyDown={e => {
                                                                                    if (e.key === " " || e.key === "Tab") e.preventDefault();
                                                                                }}
                                                                                onPaste={e => {
                                                                                    const cleaned = e.clipboardData.getData("Text").replace(/\s+/g, "");
                                                                                    e.preventDefault();
                                                                                    field.onChange(cleaned);
                                                                                    setIdCard(cleaned);
                                                                                    trigger("idCard");
                                                                                }}
                                                                                onChange={e => {
                                                                                    const cleaned = e.target.value.replace(/\s+/g, "");
                                                                                    field.onChange(cleaned);
                                                                                    setIdCard(cleaned);
                                                                                    trigger("idCard");
                                                                                }}
                                                                                type="text"
                                                                                onBlur={field.onBlur}
                                                                                ref={field.ref}
                                                                            />
                                                                            {selectedCardType === "1" && (
                                                                                <span
                                                                                    className="input-group-text"
                                                                                    style={{ cursor: 'pointer' }}
                                                                                    onClick={() => setShowScanner(true)}
                                                                                >
                                                                                    <FontAwesomeIcon icon={faBarcode} />
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                />
                                                                {errors.idCard && <p className={`text-danger ${styles.label}`}>{errors.idCard.message}</p>}
                                                            </div>

                                                            <div className='col-lg-6 mb-3'>
                                                                <label className={`form-label ${styles.label}`}>คำนำหน้าชื่อ</label>
                                                                <select
                                                                    value={selectedPrefixId}
                                                                    className={`form-select ${styles.label}`}
                                                                    onChange={(e) => setSelectedPrefixId(Number(e.target.value))}
                                                                // disabled={customerDetail?.length > 0 ? customerDetail?.[0]?.PREFIX.length > 0 ? true : false : false}
                                                                >
                                                                    <option value=''>เลือกคำนำหน้าชื่อ...</option>
                                                                    {selectedCustomer.PREFIX.map((prefix: any) => (
                                                                        <option key={prefix.PREFIXID} value={prefix.PREFIXID}>{prefix.PREFIXNAME}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            {/* <div className='col-lg-6'>
                                                                <label className={`form-label ${styles.label}`}>ชื่อ</label>
                                                                <input
                                                                    value={fullName}
                                                                    onChange={handleFullNameChange}
                                                                    type='text'
                                                                    className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                                                    placeholder='ชื่อ-สกุล'
                                                                />
                                                                {errors.fullName && <p className='text-danger'>{errors.fullName}</p>}
                                                            </div> */}
                                                            <div className='col-lg-6 my-3'>
                                                                <label className={`${styles.label} ${styles.required}`}>ชื่อ</label>
                                                                <Controller
                                                                    name="fullName"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <>
                                                                            <input
                                                                                {...field}
                                                                                type="text"
                                                                                className={`form-control ${styles.label} ${errors.fullName ? "is-invalid" : ""}`}
                                                                                onChange={e => {
                                                                                    field.onChange(e);
                                                                                    setFullName(e.target.value);
                                                                                }}
                                                                            />
                                                                            {errors.fullName && (
                                                                                <p className={`text-danger ${styles.label}`}>{errors.fullName.message}</p>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                />
                                                            </div>

                                                            <div className='col-lg-6 my-3'>
                                                                <label className={`form-label ${styles.label}`}>นามสกุล</label>
                                                                <input
                                                                    type="text"
                                                                    className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                                                    value={lastName}
                                                                    onChange={e => setLastName(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="">
                                                        <div className='row mb-6'>
                                                            <div className="col-lg-4 mb-3">
                                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <label className={`form-label ${styles.label}`}>วันเดือนปีเกิด</label>
                                                                    <input
                                                                        type="date"
                                                                        value={valueCalendar ? formatLocalDate(valueCalendar) : ''}
                                                                        onChange={e => {
                                                                            // แยกปี เดือน วัน แล้วสร้างเป็น Date ท้องถิ่น
                                                                            const [yy, mm, dd] = e.target.value.split('-').map(Number);
                                                                            const newDate = new Date(yy, mm - 1, dd);
                                                                            setValueCalendar(newDate);
                                                                            handleDateChange(newDate);
                                                                        }}
                                                                        className={`form-control ${styles.label}`}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-lg-4 mb-3">
                                                                <label className={`form-label ${styles.label}`}>อายุ</label>
                                                                <input
                                                                    value={valueAge !== null ? valueAge.toString() : ''}
                                                                    type="text"
                                                                    className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                                                    readOnly
                                                                />

                                                            </div>
                                                            {selectedCustomerType !== "1" && (
                                                                <div className='col-lg-4 mb-3'>
                                                                    <label className={`form-label ${styles.label}`}>เพศ</label>
                                                                    <select
                                                                        value={selectedSexId}
                                                                        className={`form-select ${styles.label}`}
                                                                        onChange={(e) => setSelectedSexId(Number(e.target.value))}
                                                                    // disabled={customerDetail?.length > 0 ? customerDetail?.[0]?.SEX.length > 0 ? true : false : false}
                                                                    >
                                                                        <option value=''>เลือกเพศ...</option>
                                                                        {selectedCustomer.SEX.map((sex: any) => (
                                                                            <option key={sex.SEXID} value={sex.SEXID}>{sex.SEXNAME}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            )}

                                                            <div className="">
                                                                <div className='row mt-6'>
                                                                    {/* <div className='col-lg-6 mb-3'>
                                                                        <label className={`form-label ${styles.label}`}>เบอร์ที่ติดต่อได้</label>
                                                                        <input
                                                                            value={mobile}
                                                                            onChange={handleMobileChange}
                                                                            type='text'
                                                                            className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                                                            maxLength={10}
                                                                        />
                                                                        {errors.mobile && <p className='text-danger'>{errors.mobile}</p>}
                                                                    </div> */}

                                                                    <div className='col-lg-6 mb-3'>
                                                                        <label className={`${styles.label} `}>เบอร์ที่ติดต่อได้</label>
                                                                        <Controller
                                                                            name="telNo"
                                                                            control={control}
                                                                            render={({ field }) => (
                                                                                <input
                                                                                    {...field}
                                                                                    className={`${styles.label} form-control ${errors.telNo ? "is-invalid" : ""}`}
                                                                                    value={mobile}
                                                                                    maxLength={10}
                                                                                    onChange={(e) => {
                                                                                        field.onChange(e.target.value)
                                                                                        setMobile(e.target.value)
                                                                                        trigger("telNo")
                                                                                    }}
                                                                                    type='text'
                                                                                    inputMode='numeric'
                                                                                    pattern='[0-9]*'
                                                                                    onBlur={field.onBlur}
                                                                                    ref={field.ref}
                                                                                />
                                                                            )}
                                                                        />
                                                                        {errors.telNo && <p className={`text-danger ${styles.label}`}>{errors.telNo.message}</p>}
                                                                    </div>

                                                                    <div className='col-lg-6 mb-3'>
                                                                        <label className={`form-label ${styles.label}`}>เบอร์บ้าน</label>
                                                                        <input
                                                                            value={phone}
                                                                            onChange={(e) => setPhone(e.target.value)}
                                                                            type='text'
                                                                            inputMode='numeric'
                                                                            pattern='[0-9]*'
                                                                            className={`form-control ${styles.label}`}
                                                                            maxLength={10}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="">
                                                            <div className='row mb-6'>
                                                                <div className='col-lg-6 my-3'>
                                                                    <label className={`form-label ${styles.label}`}>เบอร์ที่ทำงาน</label>
                                                                    <input
                                                                        value={workPhone}
                                                                        onChange={(e) => setWorkPhone(e.target.value)}
                                                                        type='text'
                                                                        inputMode='numeric'
                                                                        pattern='[0-9]*'
                                                                        className={`form-control ${styles.label}`}
                                                                        maxLength={10}
                                                                    />
                                                                </div>
                                                                {/* <div className='col-lg-6 mb-3'>
                                                                    <label className={`form-label ${styles.label}`}>อีเมล์</label>
                                                                    <input
                                                                        value={email}
                                                                        onChange={handleEmailChange}
                                                                        type='text'
                                                                        className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                                                    />
                                                                    {errors.email && <p className='text-danger'>{errors.email}</p>}
                                                                </div> */}
                                                                <div className='col-lg-6 my-3'>
                                                                    <label className={`${styles.label}`}>อีเมล์</label>
                                                                    <Controller
                                                                        name="email"
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <input
                                                                                {...field}
                                                                                className={`${styles.label} form-control ${errors.email ? "is-invalid" : ""}`}
                                                                                value={email}
                                                                                onChange={(e) => {
                                                                                    field.onChange(e)
                                                                                    setEmail(e.target.value)
                                                                                    trigger("email")
                                                                                }}
                                                                                type='text'
                                                                            />
                                                                        )}
                                                                    />
                                                                    {errors.email && <p className={`text-danger ${styles.label}`}>{errors.email.message}</p>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* Start กรณีประเภทลูกค้าเป็น นิติบุคคล */}
                                            {selectedCustomerType == "1" && (
                                                <>
                                                    <div className="">
                                                        <div className='row mb-6'>
                                                            <div className='col-lg-6 mb-3'>
                                                                <label className={`form-label ${styles.label}`}>ประเภทลูกค้า</label>
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
                                                            {/* <div className='col-lg-6'>
                                                                <label className={`form-label ${styles.label}`}>เลขประจำตัวผู้เสียภาษี</label>
                                                                <input
                                                                    value={idCard}
                                                                    onChange={handleIdCardChange}
                                                                    type='text'
                                                                    className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                                                // disabled={customerDetail?.length > 0 ? customerDetail?.[0]?.CUSTOMERID !== "" ? true : false : false}
                                                                />
                                                                {errors.idCard && <p className='text-danger'>{errors.idCard}</p>}
                                                            </div> */}
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
                                                                                trigger("idCard");
                                                                            }}
                                                                            type='text'
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="">
                                                        <div className='row mb-6'>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className={`form-label ${styles.label}`}>คำนำหน้า</label>
                                                                <select
                                                                    className='form-select'
                                                                    onChange={(e) => setSelectedPrefixId(Number(e.target.value))}
                                                                    value={selectedPrefixId}
                                                                // disabled={customerDetail?.length > 0 ? customerDetail?.[0]?.PREFIX.length > 0 ? true : false : false}
                                                                >
                                                                    <option value=''>เลือกคำนำหน้า...</option>
                                                                    {selectedCustomer.PREFIX.map((prefix: any) => (
                                                                        <option key={prefix.PREFIXID} value={prefix.PREFIXID}>{prefix.PREFIXNAME}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            {/* <div className='col-lg-4'>
                                                                <label className={`form-label ${styles.label}`}>ชื่อบริษัท</label>
                                                                <input
                                                                    value={fullName}
                                                                    onChange={handleFullNameChange}
                                                                    type='text'
                                                                    className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                                                />
                                                                {errors.fullName && <p className='text-danger'>{errors.fullName}</p>}
                                                            </div> */}
                                                            <div className='col-lg-6'>
                                                                <label className='form-label required fw-bold fs-6'>ชื่อบริษัท</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control mb-3 mb-lg-0"
                                                                    value={fullName}
                                                                    onChange={e => setFullName(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className={`form-label ${styles.label}`}>กรรมการผู้มีอำนาจ</label>
                                                                <input
                                                                    value={nameMD}
                                                                    onChange={(e) => setNameMD(e.target.value)}
                                                                    type='text'
                                                                    className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                                                // disabled={customerDetail?.length > 0 ? customerDetail?.[0]?.CUSTOMERMD !== "" ? true : false : false}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="">
                                                            <div className='row mb-6 mt-6'>
                                                                {/* <div className='col-lg-6 mb-3'>
                                                                    <label className={`form-label ${styles.label}`}>เบอร์ที่ติดต่อได้</label>
                                                                    <input
                                                                        value={mobile}
                                                                        type='text'
                                                                        className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                                                        onChange={handleMobileChange}
                                                                        maxLength={10}
                                                                    />
                                                                    {errors.mobile && <p className='text-danger'>{errors.mobile}</p>}
                                                                </div> */}
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
                                                                                maxLength={10}
                                                                                type='text'
                                                                                inputMode='numeric'
                                                                                pattern='[0-9]*'
                                                                                onChange={(e) => {
                                                                                    field.onChange(e)
                                                                                    setMobile(e.target.value)
                                                                                    trigger("telNo")
                                                                                }}
                                                                            />
                                                                        )}
                                                                    />
                                                                    {errors.telNo && <p className="text-danger">{errors.telNo.message}</p>}
                                                                </div>
                                                                <div className='col-lg-6 mb-3'>
                                                                    <label className={`form-label ${styles.label}`}>เบอร์บ้าน</label>
                                                                    <input
                                                                        value={phone}
                                                                        type='text'
                                                                        inputMode='numeric'
                                                                        pattern='[0-9]*'
                                                                        className='form-control mb-3 mb-lg-0'
                                                                        onChange={(e) => setPhone(e.target.value)}
                                                                        maxLength={10}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="">
                                                            <div className='row mb-6'>
                                                                <div className='col-lg-6 mb-3'>
                                                                    <label className={`form-label ${styles.label}`}>เบอร์ที่ทำงาน</label>
                                                                    <input
                                                                        value={workPhone}
                                                                        type='text'
                                                                        inputMode='numeric'
                                                                        pattern='[0-9]*'
                                                                        className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                                                        onChange={(e) => setWorkPhone(e.target.value)}
                                                                        maxLength={10}
                                                                    />
                                                                </div>
                                                                {/* <div className='col-lg-6 mb-3'>
                                                                    <label className={`form-label ${styles.label}`}>อีเมล์</label>
                                                                    <input
                                                                        value={email}
                                                                        onChange={handleEmailChange}
                                                                        type='text'
                                                                        className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                                                    />
                                                                    {errors.email && <p className='text-danger'>{errors.email.message}</p>}
                                                                </div> */}
                                                                <div className='col-lg-6 my-3'>
                                                                    <label className={`${styles.label}`}>อีเมล์</label>
                                                                    <Controller
                                                                        name="email"
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <input
                                                                                {...field}
                                                                                className={`${styles.label} form-control ${errors.email ? "is-invalid" : ""}`}
                                                                                value={email}
                                                                                onChange={(e) => {
                                                                                    field.onChange(e)
                                                                                    setEmail(e.target.value)
                                                                                    trigger("email")
                                                                                }}
                                                                                type='text'
                                                                            />
                                                                        )}
                                                                    />
                                                                    {errors.email && <p className={`text-danger ${styles.label}`}>{errors.email.message}</p>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {/* End กรณีประเภทลูกค้าเป็น นิติบุคคล */}
                                        </div>
                                    </form>
                                    {/* end form */}
                                </div>
                            </div>
                        </div>
                        {/* End accordion ข้อมูลลูกค้า*/}
                    </div>
                    {/* End Card */}

                    <div className='d-none d-xl-flex justify-content-between align-items-center my-5'>
                        <button
                            className={`${styles.btnSecondary}`}
                            onClick={() => navigate('/sale/update/updateSalesEmployee', {
                            state: {
                                ...matchedItem,
                            }
                        })}
                        >
                            แก้ไขพนักงานขาย
                        </button>
                        <button
                            className={`${styles.btnPrimary}`}
                            onClick={handleSubmit(onSubmit)}
                        >
                            ถัดไป
                        </button>
                        {/* <button
                            className={`btn btn-primary w-100 w-md-auto align-self-center h-50px ${!isDataComplete ? `disabled` : ``}`}
                            disabled={!isDataComplete}
                            onClick={handleCheckerClick}
                        >
                            ส่งตรวจสอบ
                        </button> */}
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
                            className={`${styles.btnSecondary}`}
                            onClick={() => navigate('/sale/update/updateSalesEmployee', {
                                state: {
                                    ...matchedItem,
                                }
                            })}
                        >
                            แก้ไขพนักงานขาย
                        </button>
                        <button
                            className={`${styles.btnPrimary}`}
                            onClick={handleSubmit(onSubmit)}
                        >
                            ถัดไป
                        </button>
                        {/* <button
                            className={`btn btn-primary w-auto ${!isDataComplete ? `disabled` : ``}`}
                            disabled={!isDataComplete}
                            onClick={handleCheckerClick}
                        >
                            ส่งตรวจสอบ
                        </button> */}
                    </div>

                </form>
            </Content >
        </>
    )
}

export default UpdateSaleCustDetailFinishDay