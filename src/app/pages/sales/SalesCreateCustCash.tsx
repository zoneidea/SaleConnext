// import styles from '@/styles/style.module.css'
// import IDCardOCR from './components/ocr/IDCardOCR'

// import { useState, ChangeEvent, useEffect, useMemo, useRef } from 'react'
// import { Link, useNavigate, } from 'react-router-dom'
// import axios from 'axios';
// import clsx from 'clsx'
// import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
// import { Content } from '../../../_metronic/layout/components/content'
// import { useAuth } from '../../modules/auth/core/Auth';

// import {
//     useUUIDStore,
//     useSaveCustomerStore,
//     useSaveAddressStore
// } from '../../modules/stores/stepsStore';

// import dayjs, { Dayjs } from 'dayjs';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// import { useForm, Controller } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faBarcode } from '@fortawesome/free-solid-svg-icons'

// interface OCRResultState {
//     rawText: string;
//     error?: string;
// }

// const SalesCreateCustCash: React.FC = () => {
//     const navigate = useNavigate()
//     const MySwal = withReactContent(Swal);

//     const { auth } = useAuth();
//     const EmpId = auth?.data?.[0]?.EmpId || '';
//     const TeamSale = auth?.data?.[0]?.TeamSale || '';
//     const SaleCode = auth?.data?.[0]?.SaleCode || '';
//     const SupEmpId = auth?.data?.[0]?.SupEmp || '';
//     const SecEmpId = auth?.data?.[0]?.SecEmp || '';

//     const { REFNO } = useUUIDStore();
//     const { saveCustomerTypes, setSaveCustomerTypes } = useSaveCustomerStore()
//     // console.log(`saveCustomerTypes`,saveCustomerTypes);

//     const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
//     const CUSTOMER_TYPE_URL = `${API_SALECONNEXT}/GetCustomertype`;
//     const PROVINCE_URL = `${API_SALECONNEXT}/GetAddress/Province`;
//     const DISTRICT_URL = `${API_SALECONNEXT}/GetAddress/District`;
//     const SUBDISTRICT_URL = `${API_SALECONNEXT}/GetAddress/SubDistrict`;
//     const ZIPCODE_URL = `${API_SALECONNEXT}/GetAddress/Zipcode`;

//     const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//     const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;
//     const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

//     {/************ สแกนบัตร ************/ }
//     const [showScanner, setShowScanner] = useState(false);
//     // เมื่อ user ถ่ายภาพบัตร เราเก็บ base64 ลง state นี้
//     const [idCardBase64, setIdCardBase64] = useState<string | null>(null);

//     // state สำหรับเก็บผลลัพธ์ Text จาก OCR.space
//     const [ocrResult, setOcrResult] = useState<OCRResultState | null>(null);

//     const [isLoadingOCR, setIsLoadingOCR] = useState(false);

//     // กรณีดึงมาจากเช็คสถานะลูกค้า เซ็ตค่าลง state แค่ครั้งแรก และสามารถลบแก้ไขค่าได้
//     const [hasInitialized, setHasInitialized] = useState(false);

//     // เดือนภาษาไทย (เต็มรูปแบบ)
//     const thaiMonths = [
//         { value: 1, label: 'มกราคม' },
//         { value: 2, label: 'กุมภาพันธ์' },
//         { value: 3, label: 'มีนาคม' },
//         { value: 4, label: 'เมษายน' },
//         { value: 5, label: 'พฤษภาคม' },
//         { value: 6, label: 'มิถุนายน' },
//         { value: 7, label: 'กรกฎาคม' },
//         { value: 8, label: 'สิงหาคม' },
//         { value: 9, label: 'กันยายน' },
//         { value: 10, label: 'ตุลาคม' },
//         { value: 11, label: 'พฤศจิกายน' },
//         { value: 12, label: 'ธันวาคม' },
//     ];

//     // สร้างลิสต์ปีพ.ศ. (ย้อนหลัง 100 ปี)
//     const currentBE = new Date().getFullYear() + 543;
//     const yearsBE = Array.from({ length: 100 }, (_, i) => currentBE - i);

//     // แยก state สำหรับวัน เดือน ปี
//     const [selectedDay, setSelectedDay] = useState<number | ''>('');
//     const [selectedMonth, setSelectedMonth] = useState<number | ''>('');
//     const [selectedYearBE, setSelectedYearBE] = useState<number | ''>('');

//     useEffect(() => {
//         if (selectedDay && selectedMonth && selectedYearBE) {
//             // แปลงกลับเป็น ค.ศ.
//             const yearAD = selectedYearBE - 543;
//             const dt = new Date(yearAD, selectedMonth - 1, selectedDay);
//             setValueCalendar(dt);
//             handleDateChange(dt);
//         }
//     }, [selectedDay, selectedMonth, selectedYearBE]);

//     // เมื่อได้รับ base64 จาก IDCardViewer ให้มา preview ที่หน้า SalesCreateCust
//     const handleCapturedImage = (base64Image: string) => {
//         setIdCardBase64(base64Image);
//         setShowScanner(false);
//         setOcrResult(null);
//     };

//     // ฟังก์ชันเรียก OCR.space API (เมื่อมี idCardBase64)
//     const callOCRSpace = async (base64Image: string) => {
//         try {
//             setIsLoadingOCR(true);
//             const API_OCR = import.meta.env.VITE_APP_API_OCR;

//             // เตรียม payload ในรูปแบบ FormData
//             const formData = new FormData();
//             formData.append('apikey', API_OCR);
//             formData.append('base64Image', base64Image);
//             formData.append('language', 'tha');            // อ่านภาษาไทย
//             formData.append('isOverlayRequired', 'false');
//             formData.append('filetype', 'PNG');            // หรือ 'JPG' ตาม screenshotFormat
//             formData.append('detectOrientation', 'true');
//             formData.append('isCreateSearchablePdf', 'false');
//             formData.append('scale', 'false');
//             formData.append('isTable', 'false');
//             formData.append('OCREngine', '2');             // ใช้ OCR Engine 2

//             const response = await axios.post(
//                 'https://api.ocr.space/parse/image',
//                 formData,
//                 {
//                     headers: {
//                         // 'Content-Type' จะถูกเซ็ตเป็น multipart/form-data โดย axios เอง
//                     },
//                 }
//             );

//             const data = response.data;
//             if (data.OCRExitCode === 1 && data.ParsedResults) {
//                 const allText = data.ParsedResults
//                     .map((res: any) => res.ParsedText)
//                     .join('\n');
//                 setOcrResult({ rawText: allText });
//             } else {
//                 const errMsg = data.ErrorMessage || 'Unknown OCR error';
//                 setOcrResult({ rawText: '', error: errMsg });
//             }
//         } catch (error: any) {
//             setOcrResult({ rawText: '', error: error.message || 'Request failed' });
//         } finally {
//             setIsLoadingOCR(false);
//         }
//     };

//     // เมื่อ selected idCardBase64 เปลี่ยน → เรียก OCR.space
//     useEffect(() => {
//         if (idCardBase64) {
//             callOCRSpace(idCardBase64);
//         }
//     }, [idCardBase64]);

//     {/************ สแกนบัตร ************/ }

//     const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false);
//     const [draft, setDraft] = useState<any[]>([]);

//     useEffect(() => {
//         const getDataDraft = async () => {
//             setIsLoadingDraft(true);
//             try {
//                 const response = await axios.get(DRAFT_ALLCONTRACT_URL);
//                 const data = Array.isArray(response.data.data) ? response.data.data : [];
//                 setDraft(data);
//             } catch (error) {
//                 console.error('Error fetching DRAFT_ALLCONTRACT_URL:', error);
//             } finally {
//                 setIsLoadingDraft(false);
//             }
//         };
//         getDataDraft();
//     }, []);

//     // เลือก item ที่ REFNO ตรงกัน (find สำหรับ 1 item หรือ filter สำหรับหลาย item)
//     const matchedItem = draft.find(item => item.REFNO === REFNO);
//     console.log(`matchedItem`, matchedItem);

//     const [customerTypes, setCustomerTypes] = useState<any[]>([]);

//     const [valueCalendar, setValueCalendar] = useState<Date | null>(null);
//     const [valueAge, setValueAge] = useState<number | null>(null);

//     const [selectedCustomerType, setsSelectedCustomerType] = useState<string>('');
//     console.log(`selectedCustomerType`, selectedCustomerType);
//     const [selectedCardType, setSelectedCardType] = useState<string>('');
//     const [selectedPrefixId, setSelectedPrefixId] = useState<number>();
//     const [selectedSexId, setSelectedSexId] = useState<number>();

//     const [idCard, setIdCard] = useState<string>('');
//     const [fullName, setFullName] = useState<string>('');
//     const [lastName, setLastName] = useState<string>('');
//     const [age, setAge] = useState<string>('');
//     const [email, setEmail] = useState<string>('');
//     const [mobile, setMobile] = useState<string>('');
//     const [phone, setPhone] = useState<string>('');
//     const [workPhone, setWorkPhone] = useState<string>('');
//     const [nameMD, setNameMD] = useState<string>('');

//     const selectedCustomer = customerTypes.find((type) => type.CUSTOMERTYPE === selectedCustomerType) || { CARDTYPE: [], PREFIX: [], SEX: [] };

//     // เก็บข้อมูลส่วนลดใน state และ store
//     const SaveCustomertData = useMemo(() => {
//         const customerTypeData = customerTypes.find((type) => type.CUSTOMERTYPE === selectedCustomerType);
//         // console.log("customerTypeData:", customerTypeData);

//         return [
//             {
//                 CUSTOMERTYPE: selectedCustomerType ? selectedCustomerType : '',
//                 CUSTOMERTYPENAME: customerTypeData ? customerTypeData.CUSTOMERTYPENAME : '',
//                 CUSTOMERID: idCard ? idCard : '',
//                 CUSTOMERNAME: fullName ? fullName : '',
//                 CUSTOMERLASTNAME: lastName ? lastName : '',
//                 CUSTOMERMD: nameMD ? nameMD : '',
//                 CUSTOMERDOB: valueCalendar ? dayjs(valueCalendar).format('YYYY-MM-DD') : '',
//                 CUSTOMERRAGE: valueAge ? valueAge.toString() : '',
//                 CUSTOMERMOBILE: mobile ? mobile : '',
//                 CUSTOMERWORKPHONE: workPhone ? workPhone : '',
//                 CUSTOMERPHONE: phone ? phone : '',
//                 CUSTOMEREMAIL: email ? email : '',
//                 CARDTYPE: customerTypeData?.CARDTYPE ? customerTypeData.CARDTYPE
//                     .filter((cardType: any) => {
//                         // console.log("Selected Card Type:", selectedCardType);
//                         // console.log("Available Card Type:", cardType.CARDTYPE);
//                         return String(cardType.CARDTYPE) === String(selectedCardType); // ใช้การเปรียบเทียบแบบ string
//                     })
//                     .map((cardType: any) => ({
//                         CARDTYPE: selectedCardType,
//                         CARDTYPECODE: cardType.CARDTYPECODE,
//                         CARDTYPENAME: cardType.CARDTYPENAME,
//                     })) : [],
//                 PREFIX: customerTypeData?.PREFIX ? customerTypeData.PREFIX
//                     .filter((prefix: any) => prefix.PREFIXID === selectedPrefixId) // ใช้เฉพาะค่าที่เลือก
//                     .map((prefix: any) => ({
//                         PREFIXID: selectedPrefixId,
//                         PREFIXCODE: prefix.PREFIXCODE,
//                         PREFIXNAME: prefix.PREFIXNAME,
//                     })) : [],
//                 SEX: customerTypeData?.SEX ? customerTypeData.SEX
//                     .filter((sex: any) => sex.SEXID === selectedSexId) // ใช้เฉพาะค่าที่เลือก
//                     .map((sex: any) => ({
//                         SEXID: selectedSexId,
//                         SEXCODE: sex.SEXCODE,
//                         SEXNAME: sex.SEXNAME,
//                     })) : [],
//             }
//         ];
//     }, [customerTypes,
//         selectedCustomerType,
//         idCard,
//         fullName,
//         lastName,
//         valueCalendar,
//         valueAge,
//         selectedCardType,
//         selectedPrefixId,
//         selectedSexId,
//         email,
//         mobile,
//         phone,
//         workPhone
//     ]);

//     // อัปเดตข้อมูลส่วน customer ลง store
//     useEffect(() => {
//         if (JSON.stringify(SaveCustomertData) !== JSON.stringify(saveCustomerTypes)) {
//             setSaveCustomerTypes(SaveCustomertData); // อัปเดตข้อมูลลง store
//         }
//     }, [SaveCustomertData, saveCustomerTypes, setSaveCustomerTypes]);

//     // GET Customertype
//     useEffect(() => {
//         const getData = async () => {
//             try {
//                 const response = await axios.get(CUSTOMER_TYPE_URL, {
//                     headers: {
//                         'Content-Type': 'application/json',
//                     }
//                 });
//                 setCustomerTypes(response.data);
//             } catch (error) {
//                 console.error('Error fetching CUSTOMER_TYPE_URL:', error);
//             }
//         };
//         getData();
//     }, []);

//     // Handle Customer Type Change
//     const handleCustTypeOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
//         const value = event.target.value;
//         setsSelectedCustomerType(value);
//         setSelectedCardType('');
//     }

//     const handleDateChange = (date: Date | null) => {
//         if (date) {
//             const calculatedAge = dayjs().diff(dayjs(date), 'year');
//             if (calculatedAge <= 20) {
//                 MySwal.fire({
//                     icon: 'warning',
//                     title: 'อายุไม่ถึงเกณฑ์',
//                     text: 'อายุต้องมากกว่า 20 ปีขึ้นไปจึงทำรายการได้',
//                     customClass: {
//                         title: styles.fontSize,
//                         htmlContainer: styles.fontSize,
//                         confirmButton: styles.fontSize,
//                         inputLabel: styles.fontSize,
//                     }
//                 })
//                 // เคลียร์ค่าใน DatePicker และอายุ
//                 setValueCalendar(null);
//                 setValueAge(null);
//                 return; // ยกเลิกการ set ค่าอื่น ๆ ต่อ
//             }
//             // ถ้าอายุมากกว่า 20 ก็ set ค่าให้ปกติ
//             setValueCalendar(date);
//             setValueAge(calculatedAge);
//         } else {
//             // กรณีลบวันที่ทิ้ง
//             setValueCalendar(null);
//             setValueAge(null);
//         }
//     };

//     {/*-------------------- Start Validate --------------------*/ }

//     const schema = yup.object({
//         // 1) ประเภทลูกค้า บังคับกรอกเสมอ
//         selectedCustomerType: yup
//             .string()
//             .required("กรุณาเลือกประเภทลูกค้า"),

//         // 2) ถ้าไม่ใช่ นิติบุคคล (ค่า !== '1') บังคับกรอกประเภทบัตร
//         selectedCardType: yup
//             .string()
//             .when('selectedCustomerType', {
//                 is: (v: any) => v === "1" || v === "3",
//                 then: s => s.required("กรุณาเลือกประเภทบัตร"),
//                 otherwise: s => s
//             }),

//         // 3) เลขบัตร
//         idCard: yup
//             .string()
//             .when('selectedCustomerType', {
//                 is: (v: any) => v === "1" || v === "3",
//                 then: s => s
//                     .required("กรุณากรอกเลขบัตร")
//                     .matches(/^[0-9]{13}$/, "กรุณากรอกเลขบัตร 13 หลัก")
//                     .test(
//                         "valid-thai-id",
//                         "เลขบัตรประชาชนไม่ถูกต้อง",
//                         val => isValidThaiId(val || "")
//                     ),
//                 otherwise: s => s
//             }),

//         // 4) คำนำหน้าชื่อ
//         selectedPrefixId: yup
//             .number()
//             .when(
//                 ["selectedCustomerType"] as const,
//                 ([custType], schema) =>
//                     custType !== "1"
//                         ? schema.required("กรุณาเลือกคำนำหน้าชื่อ")
//                         : schema
//             ),

//         // 5) ชื่อ บังคับกรอกเสมอ
//         fullName: yup
//             .string()
//             .required("กรุณากรอกชื่อ"),

//         // 6–8) วัน / เดือน / ปีเกิด (พ.ศ.) แยกสามฟิลด์
//         selectedDay: yup
//             .number()
//             .when(
//                 ["selectedCustomerType"] as const,
//                 ([custType], schema) =>
//                     custType !== "1"
//                         ? schema.required("กรุณาเลือกวันเกิด")
//                         : schema
//             ),
//         selectedMonth: yup
//             .number()
//             .when(
//                 ["selectedCustomerType"] as const,
//                 ([custType], schema) =>
//                     custType !== "1"
//                         ? schema.required("กรุณาเลือกเดือนเกิด")
//                         : schema
//             ),
//         selectedYearBE: yup
//             .number()
//             .when(
//                 ["selectedCustomerType"] as const,
//                 ([custType], schema) =>
//                     custType !== "1"
//                         ? schema.required("กรุณาเลือกปีเกิด")
//                         : schema
//             ),

//         // 9) เพศ
//         selectedSexId: yup
//             .number()
//             .when(
//                 ["selectedCustomerType"] as const,
//                 ([custType], schema) =>
//                     custType !== "1"
//                         ? schema.required("กรุณาเลือกเพศ")
//                         : schema
//             ),

//         // 10) เบอร์ที่ติดต่อได้ 1
//         telNo: yup
//             .string()
//             .when(
//                 ["selectedCustomerType"] as const,
//                 ([custType], schema) =>
//                     custType !== "1"
//                         ? schema
//                             .required("กรุณากรอกเบอร์ที่ติดต่อได้ 1")
//                             .matches(/^[0-9]{9,10}$/, "เบอร์โทรต้องเป็นตัวเลข 9–10 หลัก")
//                         : schema
//             ),

//         // 11) อีเมล ไม่บังคับ
//         email: yup
//             .string()
//             .notRequired()
//             .email("รูปแบบอีเมลไม่ถูกต้อง"),
//     });

//     // 2) infer type
//     type FormValues = yup.InferType<typeof schema>;

//     // 3. เรียก useForm พร้อม resolver
//     const {
//         control,
//         handleSubmit,
//         setValue,
//         trigger,
//         formState: { errors },
//     } = useForm<FormValues>({
//         resolver: yupResolver(schema),
//         defaultValues: {
//             selectedCustomerType: "",
//             selectedCardType: "",
//             idCard: "",
//             selectedPrefixId: undefined,
//             fullName: "",
//             selectedDay: undefined,
//             selectedMonth: undefined,
//             selectedYearBE: undefined,
//             selectedSexId: undefined,
//             telNo: "",
//             email: "",
//         },
//     });

//     // ตรง useEffect ที่ดึงค่า matchedItem เข้ามา
//     // useEffect(() => {
//     //     const custData = matchedItem?.CUSTOMERSTATUS?.[0];
//     //     if (!custData?.Contract) {
//     //         return;
//     //     }

//     //     const contract = custData.Contract;

//     //     // — IDCard ตามเดิม —
//     //     const newIdCard = contract.IDCard ?? '';
//     //     setIdCard(newIdCard);
//     //     setValue('idCard', newIdCard);

//     //     // — ชื่อ–นามสกุล จาก contract.CustomerName —
//     //     // trim() + split ด้วย whitespace แล้วเอาตัวแรกเป็นชื่อ
//     //     // ส่วนที่เหลือ join กลับเป็นนามสกุล
//     //     const rawName = (contract as any).CustomerName ?? '';
//     //     const parts = rawName.trim().split(/\s+/);
//     //     const first = parts.shift() || '';
//     //     const last = parts.join(' ') || '';

//     //     setFullName(first);
//     //     setLastName(last);

//     //     // ถ้าคุณใช้ react-hook-form เก็บ fullName ก็ setValue ด้วย
//     //     setValue('fullName', first);
//     //     // ถ้ามี lastName ใน form ก็เรียก setValue('lastName', last) ด้วย

//     //     // — เบอร์โทร เหมือนเดิม —
//     //     const address = Array.isArray(contract.Address)
//     //         ? contract.Address[0]
//     //         : {};
//     //     const rawMobile = address.TelMobile || address.TelHome || address.TelOffice || '';
//     //     const cleanedMobile = rawMobile.replace(/-/g, '');
//     //     setMobile(cleanedMobile);
//     //     setValue('telNo', cleanedMobile);

//     // }, [matchedItem, setValue]);

//     useEffect(() => {
//         const custData = matchedItem?.CUSTOMERSTATUS?.[0];
//         if (!custData?.Contract || hasInitialized) return;

//         const contract = custData.Contract;

//         // — IDCard ตามเดิม —
//         const newIdCard = (contract.IDCard && contract.IDCard !== '0')
//             ? contract.IDCard
//             : '';

//         setIdCard(newIdCard);
//         setValue('idCard', newIdCard);

//         // — ชื่อ–นามสกุล —
//         const rawName = (contract as any).CustomerName ?? '';
//         const parts = rawName.trim().split(/\s+/);
//         const first = parts.shift() || '';
//         const last = parts.join(' ') || '';
//         setFullName(first);
//         setLastName(last);
//         setValue('fullName', first);
//         // ถ้ามี lastName ในฟอร์ม ก็เรียก setValue('lastName', last);

//         // — เบอร์โทร —
//         const address = Array.isArray(contract.Address) ? contract.Address[0] : {};
//         const rawMobile = address.TelMobile || address.TelHome || address.TelOffice || '';
//         const cleanedMobile = rawMobile.replace(/-/g, '');
//         setMobile(cleanedMobile);
//         setValue('telNo', cleanedMobile);

//         // mark ว่า initialize เสร็จแล้ว
//         setHasInitialized(true);

//         // ฟังก์ชันบันทึกข้อมูล CUSTOMERDETAIL อัตโนมัติ
//         const saveMatchedCustomer = async () => {
//             try {
//                 await axios.post(UPDATECONTACT, {
//                     REFNO,
//                     EMPID: EmpId,
//                     TEAMSALE: TeamSale,
//                     SALECODE: SaleCode,
//                     SUPEMPID: SupEmpId,
//                     SECEMPID: SecEmpId,
//                     FIELD: "CUSTOMERDETAIL",
//                     DATA: SaveCustomertData
//                 }, {
//                     headers: { "Content-Type": "application/json" },
//                 });
//                 console.log("อัปเดต CUSTOMERDETAIL สำเร็จ");
//             } catch (err) {
//                 console.error("Error auto-saving CUSTOMERDETAIL:", err);
//             }
//         };

//         saveMatchedCustomer();

//     }, [matchedItem, SaveCustomertData, setValue, hasInitialized]);

//     {/*-------------------- End Validate --------------------*/ }

//     {/*-------------------- Start บันทึกข้อมูลลงระบบ และไปขั้นตอนต่อไป --------------------*/ }
//     const onSubmit = async (data: any) => {
//         try {
//             // เรียก API บันทึกข้อมูล
//             const response = await axios.post(UPDATECONTACT, {
//                 REFNO,
//                 EMPID: EmpId,
//                 TEAMSALE: TeamSale,
//                 SALECODE: SaleCode,
//                 SUPEMPID: SupEmpId,
//                 SECEMPID: SecEmpId,
//                 FIELD: "CUSTOMERDETAIL",
//                 DATA: SaveCustomertData
//             }, {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });
//             // console.log(`updateContract DISCOUNT: `, response.data);
//             MySwal.fire({
//                 icon: 'success',
//                 title: 'สำเร็จ!',
//                 text: 'บันทึกข้อมูลลูกค้าเรียบร้อยแล้ว',
//                 timer: 2000, // แสดงผล 3 วินาที
//                 showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
//             });
//             navigate("/sale/createaddress-cash")
//         } catch (error) {
//             console.error("Error saving data:", error);
//             MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
//         }
//     };
//     {/*-------------------- End บันทึกข้อมูล --------------------*/ }

//     useEffect(() => {
//         if (ocrResult && ocrResult.rawText) {
//             const text = ocrResult.rawText;

//             // 1) ดึงเลขบัตรเหมือนเดิม (กรองช่องว่าง/ขีดออก)
//             const match = text.match(/(\d[\d\s\-]{11,}\d)/);
//             if (match && match[1]) {
//                 // 1. ดึงค่าที่จับได้
//                 const rawId = match[1]; // อาจเป็น "1 103000 078735" หรือ "1103 0000787 35"
//                 // 2. กรองเอาช่องว่างและขีดออกเหลือตัวเลขติดกัน
//                 const cleanedId = rawId.replace(/[\s\-]/g, "");

//                 // 3. เซ็ตลง state และ React Hook Form
//                 setIdCard(cleanedId);
//                 setValue("idCard", cleanedId);
//                 trigger("idCard");
//             }

//             // 2) ดึงชื่อ-นามสกุล (สมมติว่าชื่อและนามสกุลใน OCR เป็นตัวอักษรไทย แยกด้วยเว้นวรรค)
//             //    เราจะจับกลุ่มอักษรไทยสองกลุ่ม ที่คั่นด้วยเว้นวรรคอย่างน้อยหนึ่งตัว
//             const nameRegex = /(?:น(?:าย|าง|\.ส\.))\s*([ก-์]+)\s+([ก-์]+)/;
//             const nameMatch = text.match(nameRegex);

//             if (nameMatch) {
//                 const firstNameFromOCR = nameMatch[1].trim();
//                 const lastNameFromOCR = nameMatch[2].trim();

//                 // เซ็ตลง state และ React Hook Form
//                 setFullName(firstNameFromOCR);
//                 setLastName(lastNameFromOCR);
//             }

//             // 3) ดึงวันเกิด
//             const thaiDateRe = /เกิดวันที่\s*([0-9]{1,2})\s*(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s*([0-9]{4})/;
//             const thaiMatch = text.match(thaiDateRe);
//             if (thaiMatch) {
//                 const day = parseInt(thaiMatch[1], 10);
//                 const thaiMonthMap: Record<string, number> = {
//                     'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4,
//                     'พ.ค.': 5, 'มิ.ย.': 6, 'ก.ค.': 7, 'ส.ค.': 8,
//                     'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12
//                 };
//                 const rawMonth = thaiMatch[2];           // type string
//                 const month = thaiMonthMap[rawMonth]; // ไม่เตือนแล้ว
//                 let year = parseInt(thaiMatch[3], 10);
//                 if (year > 2400) year -= 543;                  // ถ้าเป็น พ.ศ. ลบ 543

//                 const parsed = new Date(year, month - 1, day);
//                 if (!isNaN(parsed.getTime())) {
//                     setValueCalendar(parsed);
//                     handleDateChange(parsed);
//                     return;  // จบเลย ไม่ต้อง fallback English
//                 }
//             }

//             // 2) ถ้าไม่เจอวันที่ไทย จึงค่อย fallback English แบบเดิม (optional)
//             const engDateRe = /Date of (?:surth|birth)\s*([0-9]{1,2})\s*(Jan\.?|Feb\.?|Mar\.?|Apr\.?|May\.?|Jun\.?|Jul\.?|Aug\.?|Sep\.?|Oct\.?|Nov\.?|Dec\.?)\.?\s*([0-9]{4})/i;
//             const engMatch = text.match(engDateRe);
//             if (engMatch) {
//                 const day = parseInt(engMatch[1], 10);
//                 const engMonthMap: Record<string, number> = {
//                     'Jan': 1, 'Jan.': 1, 'Feb': 2, 'Feb.': 2, 'Mar': 3, 'Mar.': 3,
//                     'Apr': 4, 'Apr.': 4, 'May': 5, 'May.': 5, 'Jun': 6, 'Jun.': 6,
//                     'Jul': 7, 'Jul.': 7, 'Aug': 8, 'Aug.': 8, 'Sep': 9, 'Sep.': 9,
//                     'Oct': 10, 'Oct.': 10, 'Nov': 11, 'Nov.': 11, 'Dec': 12, 'Dec.': 12
//                 };
//                 const month = engMonthMap[engMatch[2]];
//                 const year = parseInt(engMatch[3], 10);
//                 const parsed = new Date(year, (month || 1) - 1, day);
//                 if (!isNaN(parsed.getTime())) {
//                     setValueCalendar(parsed);
//                     handleDateChange(parsed);
//                 }
//             }
//         }
//     }, [ocrResult]);

//     function formatLocalDate(d: Date): string {
//         const y = d.getFullYear();
//         const m = String(d.getMonth() + 1).padStart(2, '0');
//         const dd = String(d.getDate()).padStart(2, '0');
//         return `${y}-${m}-${dd}`;
//     }

//     // นำเข้าเลยข้างบนของไฟล์
//     function isValidThaiId(id: string): boolean {
//         if (!/^\d{13}$/.test(id)) return false;
//         const digits = id.split('').map(d => parseInt(d, 10));
//         let sum = 0;
//         for (let i = 0; i < 12; i++) {
//             sum += digits[i] * (13 - i);
//         }
//         const check = (11 - (sum % 11)) % 10;
//         return check === digits[12];
//     }

//     return (
//         <>
//             {/* Modal แสดง IDCardViewer เมื่อ showScanner === true */}
//             {showScanner && (
//                 <IDCardOCR
//                     onCapture={handleCapturedImage}
//                     onClose={() => setShowScanner(false)}
//                 />
//             )}

//             {/* Preview ภาพบัตรที่ถ่ายได้ (Base64) */}
//             {idCardBase64 && (
//                 <div style={{ marginTop: 20, textAlign: 'center' }}>
//                     <h4 className={`${styles.fontSize}`}>ภาพที่ถ่ายจากกล้อง:</h4>
//                     <img
//                         src={idCardBase64}
//                         alt="ID Card Preview"
//                         style={{
//                             maxWidth: '100%',
//                             border: '1px solid #ccc',
//                             borderRadius: 4,
//                         }}
//                     />
//                 </div>
//             )}

//             {/* แสดงสถานะการเรียก OCR.space */}
//             {idCardBase64 && (
//                 <div style={{ textAlign: 'center', marginTop: 12 }}>
//                     {isLoadingOCR ? (
//                         <p className={`${styles.fontSize}`}>กำลังอ่านข้อมูลจากบัตร (OCR)...</p>
//                     ) : ocrResult ? (
//                         <>
//                             {ocrResult.error ? (
//                                 <div style={{ color: 'red' }}>
//                                     <h5>เกิดข้อผิดพลาดจาก OCR:</h5>
//                                     <p>{ocrResult.error}</p>
//                                 </div>
//                             ) : (
//                                 <div style={{ textAlign: 'left', whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: 12, borderRadius: 4 }}>
//                                     <h5 className={`${styles.fontSize}`}>ผลลัพธ์:</h5>
//                                     <pre className={`${styles.fontSize}`}>{ocrResult.rawText}</pre>
//                                 </div>
//                             )}
//                         </>
//                     ) : null}
//                 </div>
//             )}
//             {/* สแกนบัตร */}

//             <Content>
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <div className='d-flex justify-content-between align-items-center my-5'>
//                         <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
//                             data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//                             className="page-title d-flex flex-wrap me-3 flex-column justify-content-ceดnter">
//                             <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//                                 <li className={`breadcrumb-item ${styles.titlePage}`}>ข้อมูลลูกค้า</li>
//                             </ul>
//                         </div>
//                     </div>
//                     <span className={`${styles.fontSize}`}>เลขที่ขาย: </span><span className={`${styles.titlePage}`}>{REFNO}</span>

//                     {/* Card Body */}
//                     <div className='accordion mb-10' id='kt_accordion_1'>

//                         {/* Start accordion ข้อมูลลูกค้า*/}
//                         <div className='accordion-item mb-10'>
//                             <h2 className='accordion-header' id='kt_accordion_1_header_1'>
//                                 <h3
//                                     className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
//                                     data-bs-toggle='collapse'
//                                     data-bs-target='#kt_accordion_1_body_1'
//                                     aria-expanded='true'
//                                     aria-controls='kt_accordion_1_body_1'
//                                     style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
//                                 >
//                                     ข้อมูลลูกค้า
//                                 </h3>
//                             </h2>
//                             <div
//                                 id='kt_accordion_1_body_1'
//                                 className='accordion-collapse collapse show'
//                                 aria-labelledby='kt_accordion_1_header_1'
//                                 data-bs-parent='#kt_accordion_1'
//                             >
//                                 <div className='accordion-body'>
//                                     {/* start form */}
//                                     <form className='form'>
//                                         <div className='card-body px-lg-9 px-1'>
//                                             {selectedCustomerType !== "1" && (
//                                                 <>
//                                                     <div>
//                                                         <div className='row mb-6'>
//                                                             <div className='col-lg-6 my-3'>
//                                                                 <label className={`${styles.label} ${styles.required}`}>ประเภทลูกค้า</label>
//                                                                 <select
//                                                                     className={`form-select ${styles.label}`}
//                                                                     value={selectedCustomerType}
//                                                                     onChange={(e) => handleCustTypeOptionChange(e)}
//                                                                 >
//                                                                     <option value="">เลือกประเภทลูกค้า</option>
//                                                                     {customerTypes.map((item: any) => (
//                                                                         <option key={item.CUSTOMERTYPE} value={item.CUSTOMERTYPE}>
//                                                                             {item.CUSTOMERTYPENAME}
//                                                                         </option>
//                                                                     ))}
//                                                                 </select>
//                                                             </div>

//                                                             <div className='col-lg-6 my-3'>
//                                                                 <label className={`${styles.label} `}>ประเภทบัตร</label>
//                                                                 <select
//                                                                     className={`form-select ${styles.label}`}
//                                                                     value={selectedCardType}
//                                                                     onChange={(e) => setSelectedCardType(e.target.value)}
//                                                                     disabled={!selectedCustomerType}
//                                                                 >
//                                                                     <option value=''>เลือกประเภทบัตร</option>
//                                                                     {selectedCustomer.CARDTYPE.map((cardType: any) => (
//                                                                         <option key={cardType.CARDTYPE} value={cardType.CARDTYPE}>
//                                                                             {cardType.CARDTYPENAME}
//                                                                         </option>
//                                                                     ))}
//                                                                 </select>
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                     <div className='row mb-6 mt-6'>
//                                                         <div className='col-lg-6 my-3'>
//                                                             <label className={`${styles.label} `}>เลขบัตร</label>
//                                                             <Controller
//                                                                 name="idCard"
//                                                                 control={control}
//                                                                 render={({ field }) => (
//                                                                     <div className={`input-group ${styles.customInputGroup}`}>
//                                                                         <input
//                                                                             {...field}
//                                                                             className={`form-control ${styles.label} ${errors.idCard ? "is-invalid" : ""}`}
//                                                                             value={idCard}
//                                                                             maxLength={13}
//                                                                             onKeyDown={e => {
//                                                                                 if (e.key === " " || e.key === "Tab") e.preventDefault();
//                                                                             }}
//                                                                             onPaste={e => {
//                                                                                 const cleaned = e.clipboardData.getData("Text").replace(/\s+/g, "");
//                                                                                 e.preventDefault();
//                                                                                 field.onChange(cleaned);
//                                                                                 setIdCard(cleaned);
//                                                                                 trigger("idCard");
//                                                                             }}
//                                                                             onChange={e => {
//                                                                                 const cleaned = e.target.value.replace(/\s+/g, "");
//                                                                                 field.onChange(cleaned);
//                                                                                 setIdCard(cleaned);
//                                                                                 trigger("idCard");
//                                                                             }}
//                                                                             type="text"
//                                                                             onBlur={field.onBlur}
//                                                                             ref={field.ref}
//                                                                         />
//                                                                         {selectedCardType === 1 && (
//                                                                             <span
//                                                                                 className="input-group-text"
//                                                                                 style={{ cursor: 'pointer' }}
//                                                                                 onClick={() => setShowScanner(true)}
//                                                                             >
//                                                                                 <FontAwesomeIcon icon={faBarcode} />
//                                                                             </span>
//                                                                         )}
//                                                                     </div>
//                                                                 )}
//                                                             />
//                                                             {errors.idCard && <p className={`text-danger ${styles.label}`}>{errors.idCard.message}</p>}
//                                                         </div>

//                                                         <div className='col-lg-6 my-3'>
//                                                             <label className={`${styles.label} `}>คำนำหน้าชื่อ</label>
//                                                             <select
//                                                                 className={`form-select ${styles.label}`}
//                                                                 onChange={(e) => setSelectedPrefixId(Number(e.target.value))}
//                                                                 disabled={!selectedCustomerType}
//                                                             >
//                                                                 <option value=''>เลือกคำนำหน้าชื่อ</option>
//                                                                 {selectedCustomer.PREFIX.map((prefix: any) => (
//                                                                     <option key={prefix.PREFIXID} value={prefix.PREFIXID}>{prefix.PREFIXNAME}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>

//                                                         <div className='col-lg-6 my-3'>
//                                                             <label className={`${styles.label} ${styles.required}`}>ชื่อ</label>
//                                                             <Controller
//                                                                 name="fullName"
//                                                                 control={control}
//                                                                 render={({ field }) => (
//                                                                     <>
//                                                                         <input
//                                                                             {...field}
//                                                                             type="text"
//                                                                             className={`form-control ${styles.label} ${errors.fullName ? "is-invalid" : ""}`}
//                                                                             onChange={e => {
//                                                                                 field.onChange(e);
//                                                                                 setFullName(e.target.value);
//                                                                             }}
//                                                                         />
//                                                                         {errors.fullName && (
//                                                                             <p className={`text-danger ${styles.label}`}>{errors.fullName.message}</p>
//                                                                         )}
//                                                                     </>
//                                                                 )}
//                                                             />
//                                                         </div>

//                                                         <div className='col-lg-6 my-3'>
//                                                             <label className={`${styles.label} `}>นามสกุล</label>
//                                                             <input
//                                                                 type="text"
//                                                                 className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                                                 value={lastName}
//                                                                 onChange={e => setLastName(e.target.value)}
//                                                             />
//                                                         </div>
//                                                     </div>

//                                                     <div className='row mb-6'>
//                                                         {/* <div className="col-lg-4 my-3">
//                                                             <div style={{ display: 'flex', flexDirection: 'column' }}>
//                                                                 <label className={`${styles.label} `}>วันเดือนปีเกิด</label>
//                                                                 <input
//                                                                     type="date"
//                                                                     value={valueCalendar ? formatLocalDate(valueCalendar) : ''}
//                                                                     onChange={e => {
//                                                                         // แยกปี เดือน วัน แล้วสร้างเป็น Date ท้องถิ่น
//                                                                         const [yy, mm, dd] = e.target.value.split('-').map(Number);
//                                                                         const newDate = new Date(yy, mm - 1, dd);
//                                                                         setValueCalendar(newDate);
//                                                                         handleDateChange(newDate);
//                                                                     }}
//                                                                     className={`form-control ${styles.label}`}
//                                                                 />
//                                                             </div>
//                                                         </div> */}

//                                                         <div className="col-lg-4 my-3">
//                                                             <label className={`${styles.label}`}>วันเดือนปีเกิด</label>
//                                                             <div className="d-flex gap-2">
//                                                                 {/* วัน */}
//                                                                 <select
//                                                                     className={`form-select ${styles.label}`}
//                                                                     value={selectedDay}
//                                                                     onChange={e => setSelectedDay(Number(e.target.value) || '')}
//                                                                 >
//                                                                     <option value="">วัน</option>
//                                                                     {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
//                                                                         <option key={day} value={day}>{day}</option>
//                                                                     ))}
//                                                                 </select>

//                                                                 {/* เดือน */}
//                                                                 <select
//                                                                     className={`form-select ${styles.label}`}
//                                                                     value={selectedMonth}
//                                                                     onChange={e => setSelectedMonth(Number(e.target.value) || '')}
//                                                                 >
//                                                                     <option value="">เดือน</option>
//                                                                     {thaiMonths.map(m => (
//                                                                         <option key={m.value} value={m.value}>{m.label}</option>
//                                                                     ))}
//                                                                 </select>

//                                                                 {/* ปี (พ.ศ.) */}
//                                                                 <select
//                                                                     className={`form-select ${styles.label}`}
//                                                                     value={selectedYearBE}
//                                                                     onChange={e => setSelectedYearBE(Number(e.target.value) || '')}
//                                                                 >
//                                                                     <option value="">ปี</option>
//                                                                     {yearsBE.map(year => (
//                                                                         <option key={year} value={year}>{year}</option>
//                                                                     ))}
//                                                                 </select>
//                                                             </div>
//                                                         </div>

//                                                         <div className="col-lg-4 my-3">
//                                                             <label className={`${styles.label} `}>อายุ</label>
//                                                             <input
//                                                                 value={valueAge !== null ? valueAge.toString() : ''}
//                                                                 type="text"
//                                                                 className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                                                 readOnly
//                                                             />

//                                                         </div>
//                                                         {selectedCustomerType !== "1" && (
//                                                             <div className='col-lg-4 my-3'>
//                                                                 <label className={`${styles.label} `}>เพศ</label>
//                                                                 <select
//                                                                     className={`form-select mb-3 mb-lg-0 ${styles.label}`}
//                                                                     onChange={(e) => setSelectedSexId(Number(e.target.value))}
//                                                                     disabled={!selectedCustomerType}
//                                                                 >
//                                                                     <option value=''>เลือกเพศ</option>
//                                                                     {selectedCustomer.SEX.map((sex: any) => (
//                                                                         <option key={sex.SEXID} value={sex.SEXID}>{sex.SEXNAME}</option>
//                                                                     ))}
//                                                                 </select>
//                                                             </div>
//                                                         )}
//                                                     </div>

//                                                     <div className='row mb-6 mt-6'>
//                                                         <div className='col-lg-6 my-3'>
//                                                             <label className={`${styles.label} `}>เบอร์ที่ติดต่อได้ 1</label>
//                                                             <Controller
//                                                                 name="telNo"
//                                                                 control={control}
//                                                                 render={({ field }) => (
//                                                                     <input
//                                                                         {...field}
//                                                                         className={`${styles.fontSize} form-control ${errors.telNo ? "is-invalid" : ""}`}
//                                                                         value={(mobile || '').replace(/-/g, '')}
//                                                                         maxLength={10}
//                                                                         onChange={(e) => {
//                                                                             field.onChange(e.target.value)
//                                                                             setMobile(e.target.value)
//                                                                             trigger("telNo")
//                                                                         }}
//                                                                         type='text'
//                                                                         inputMode='numeric'
//                                                                         pattern='[0-9]*'
//                                                                         onBlur={field.onBlur}
//                                                                         ref={field.ref}
//                                                                     />
//                                                                 )}
//                                                             />
//                                                             {errors.telNo && <p className={`text-danger ${styles.label}`}>{errors.telNo.message}</p>}
//                                                         </div>
//                                                         <div className='col-lg-6 my-3'>
//                                                             <label className={`${styles.label}`}>เบอร์ที่ติดต่อได้ 2</label>
//                                                             <input
//                                                                 value={(phone || '').replace(/-/g, '')}
//                                                                 onChange={(e) => setPhone(e.target.value)}
//                                                                 type='text'
//                                                                 inputMode='numeric'
//                                                                 pattern='[0-9]*'
//                                                                 className={`form-control ${styles.label}`}
//                                                                 maxLength={10}
//                                                             />
//                                                         </div>
//                                                     </div>

//                                                     <div className='row mb-6'>
//                                                         <div className='col-lg-6 my-3'>
//                                                             <label className={`${styles.label}`}>เบอร์ที่ทำงาน</label>
//                                                             <input
//                                                                 value={(workPhone || '').replace(/-/g, '')}
//                                                                 onChange={(e) => setWorkPhone(e.target.value)}
//                                                                 type='text'
//                                                                 inputMode='numeric'
//                                                                 pattern='[0-9]*'
//                                                                 className={`form-control ${styles.label}`}
//                                                                 maxLength={10}
//                                                             />
//                                                         </div>
//                                                         <div className='col-lg-6 my-3'>
//                                                             <label className={`${styles.label}`}>อีเมล์</label>
//                                                             <Controller
//                                                                 name="email"
//                                                                 control={control}
//                                                                 render={({ field }) => (
//                                                                     <input
//                                                                         {...field}
//                                                                         className={`${styles.label} form-control ${errors.email ? "is-invalid" : ""}`}
//                                                                         value={email}
//                                                                         onChange={(e) => {
//                                                                             field.onChange(e)
//                                                                             setEmail(e.target.value)
//                                                                             trigger("email")
//                                                                         }}
//                                                                         type='text'
//                                                                     />
//                                                                 )}
//                                                             />
//                                                             {errors.email && <p className={`text-danger ${styles.label}`}>{errors.email.message}</p>}
//                                                         </div>
//                                                     </div>
//                                                 </>
//                                             )}

//                                             {/* Start กรณีประเภทลูกค้าเป็น นิติบุคคล */}
//                                             {selectedCustomerType == "1" && (
//                                                 <>
//                                                     <div className="container">
//                                                         <div className='row mb-6'>
//                                                             <div className='col-lg-6 mb-3'>
//                                                                 <label className='form-label required fw-bold fs-6'>ประเภทลูกค้า</label>
//                                                                 <select
//                                                                     className='form-select'
//                                                                     onChange={handleCustTypeOptionChange}
//                                                                     value={selectedCustomerType}
//                                                                 >
//                                                                     <option value=''>เลือกประเภทลูกค้า...</option>
//                                                                     {customerTypes.map((item: any) => (
//                                                                         <option key={item.CUSTOMERTYPE} value={item.CUSTOMERTYPE}>
//                                                                             {item.CUSTOMERTYPENAME}
//                                                                         </option>
//                                                                     ))}
//                                                                 </select>
//                                                             </div>

//                                                             <div className='col-lg-6'>
//                                                                 <label className='form-label required fw-bold fs-6'>ชื่อบริษัท</label>
//                                                                 <input
//                                                                     type="text"
//                                                                     className="form-control mb-3 mb-lg-0"
//                                                                     value={fullName}
//                                                                     onChange={e => setFullName(e.target.value)}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                     <div className="container">
//                                                         <div className='row mb-6'>
//                                                             <div className='col-lg-4'>
//                                                                 <label className='form-label required fw-bold fs-6'>เลขประจำตัวผู้เสียภาษี</label>
//                                                                 <Controller
//                                                                     name="idCard"
//                                                                     control={control}
//                                                                     render={({ field }) => (
//                                                                         <input
//                                                                             {...field}
//                                                                             className={`form-control ${errors.idCard ? "is-invalid" : ""}`}
//                                                                             value={idCard}
//                                                                             onChange={(e) => {
//                                                                                 field.onChange(e)
//                                                                                 setIdCard(e.target.value)
//                                                                                 trigger("idCard");
//                                                                             }}
//                                                                             type='text'
//                                                                         />
//                                                                     )}
//                                                                 />
//                                                                 {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>}
//                                                             </div>
//                                                             <div className='col-lg-4 mb-3'>
//                                                                 <label className='form-label required fw-bold fs-6'>คำนำหน้า</label>
//                                                                 <select
//                                                                     className='form-select'
//                                                                     onChange={(e) => setSelectedPrefixId(Number(e.target.value))}
//                                                                     value={selectedPrefixId}
//                                                                     disabled={!selectedCustomerType}
//                                                                 >
//                                                                     <option value=''>เลือกคำนำหน้า...</option>
//                                                                     {selectedCustomer.PREFIX.map((prefix: any) => (
//                                                                         <option key={prefix.PREFIXID} value={prefix.PREFIXID}>{prefix.PREFIXNAME}</option>
//                                                                     ))}
//                                                                 </select>
//                                                             </div>
//                                                             <div className='col-lg-4 mb-3'>
//                                                                 <label className='form-label required fw-bold fs-6'>กรรมการผู้มีอำนาจ</label>
//                                                                 <input
//                                                                     value={nameMD}
//                                                                     onChange={(e) => setNameMD(e.target.value)}
//                                                                     type='text'
//                                                                     className='form-control mb-3 mb-lg-0'
//                                                                 />
//                                                             </div>
//                                                         </div>

//                                                         <div className="container">
//                                                             <div className='row mb-6 mt-6'>
//                                                                 <div className='col-lg-6 mb-3'>
//                                                                     <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
//                                                                     <Controller
//                                                                         name="telNo"
//                                                                         control={control}
//                                                                         render={({ field }) => (
//                                                                             <input
//                                                                                 {...field}
//                                                                                 className={`form-control ${errors.telNo ? "is-invalid" : ""}`}
//                                                                                 value={(mobile || '').replace(/-/g, '')}
//                                                                                 maxLength={10}
//                                                                                 type='text'
//                                                                                 inputMode='numeric'
//                                                                                 pattern='[0-9]*'
//                                                                                 onChange={(e) => {
//                                                                                     field.onChange(e)
//                                                                                     setMobile(e.target.value)
//                                                                                     trigger("telNo")
//                                                                                 }}
//                                                                             />
//                                                                         )}
//                                                                     />
//                                                                     {errors.telNo && <p className="text-danger">{errors.telNo.message}</p>}
//                                                                 </div>
//                                                                 <div className='col-lg-6 mb-3'>
//                                                                     <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
//                                                                     <input
//                                                                         inputMode='numeric'
//                                                                         pattern='[0-9]*'
//                                                                         value={(phone || '').replace(/-/g, '')}
//                                                                         type='text'
//                                                                         className='form-control mb-3 mb-lg-0'
//                                                                         onChange={(e) => setPhone(e.target.value)}
//                                                                         maxLength={10}
//                                                                     />
//                                                                 </div>
//                                                             </div>
//                                                         </div>

//                                                         <div className="container">
//                                                             <div className='row mb-6'>
//                                                                 <div className='col-lg-6 mb-3'>
//                                                                     <label className='form-label fw-bold fs-6'>เบอร์ที่ทำงาน</label>
//                                                                     <input
//                                                                         inputMode='numeric'
//                                                                         pattern='[0-9]*'
//                                                                         value={(workPhone || '').replace(/-/g, '')}
//                                                                         type='text'
//                                                                         className='form-control mb-3 mb-lg-0'
//                                                                         onChange={(e) => setWorkPhone(e.target.value)}
//                                                                         maxLength={10}
//                                                                     />
//                                                                 </div>
//                                                                 <div className='col-lg-6 mb-3'>
//                                                                     <label className='form-label fw-bold fs-6'>อีเมล์</label>
//                                                                     <input
//                                                                         value={email}
//                                                                         onChange={(e) => setEmail(e.target.value)}
//                                                                         type='text'
//                                                                         className='form-control mb-3 mb-lg-0'
//                                                                     />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </>
//                                             )}
//                                             {/* End กรณีประเภทลูกค้าเป็น นิติบุคคล */}

//                                         </div>
//                                     </form>
//                                     {/* end form */}
//                                 </div>
//                             </div>
//                         </div>

//                     </div>
//                     {/* End Card */}

//                     <>
//                         <div className='d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10'>
//                             <button
//                                 onClick={() => navigate('/sale/update/updateSalesEmployee', {
//                                     state: {
//                                         ...matchedItem,
//                                         fromDiscount: true,
//                                     }
//                                 })}
//                                 className={`${styles.btnSecondary}`}
//                                 type='button'
//                             >
//                                 แก้ไขพนักงานขาย
//                             </button>
//                             <button
//                                 onClick={handleSubmit(onSubmit)}
//                                 className={`${styles.btnPrimary}`}
//                                 type='button'
//                             >
//                                 บันทึก
//                             </button>
//                         </div>

//                         {/* ปุ่มในหน้าจอเล็ก */}
//                         <div
//                             className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
//                             style={{
//                                 position: "fixed",
//                                 bottom: 0,
//                                 left: 0,
//                                 right: 0,
//                                 zIndex: 1050,
//                             }}
//                         >
//                             <button
//                                 className={`${styles.btnSecondary}`}
//                                 onClick={() => navigate('/sale/update/updateSalesEmployee', {
//                                     state: {
//                                         ...matchedItem,
//                                         fromDiscount: true,
//                                     }
//                                 })}
//                                 type='button'
//                             >
//                                 แก้ไขพนักงานขาย
//                             </button>
//                             <button
//                                 className={`${styles.btnPrimary}`}
//                                 onClick={handleSubmit(onSubmit)}
//                                 type='button'
//                             >
//                                 บันทึก
//                             </button>
//                         </div>
//                     </>

//                 </form>
//             </Content >
//         </>
//     )
// }

// export default SalesCreateCustCash

import styles from "@/styles/style.module.css";
import IDCardOCR from "./components/ocr/IDCardOCR";

import { useState, ChangeEvent, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";
import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers";
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from "../../modules/auth/core/Auth";

import {
  useUUIDStore,
  useSaveCustomerStore,
  useSaveAddressStore,
} from "../../modules/stores/stepsStore";

import dayjs, { Dayjs } from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import { ThreeDot } from "react-loading-indicators";

interface OCRResultState {
  rawText: string;
  error?: string;
}

const SalesCreateCustCash: React.FC = () => {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || "";
  const TeamSale = auth?.data?.[0]?.TeamSale || "";
  const SaleCode = auth?.data?.[0]?.SaleCode || "";
  const SupEmpId = auth?.data?.[0]?.SupEmp || "";
  const SecEmpId = auth?.data?.[0]?.SecEmp || "";

  const { REFNO } = useUUIDStore();
  const { saveCustomerTypes, setSaveCustomerTypes } = useSaveCustomerStore();
  // console.log(`saveCustomerTypes`,saveCustomerTypes);

  const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
  const CUSTOMER_TYPE_URL = `${API_SALECONNEXT}/GetCustomertype`;
  const PROVINCE_URL = `${API_SALECONNEXT}/GetAddress/Province`;
  const DISTRICT_URL = `${API_SALECONNEXT}/GetAddress/District`;
  const SUBDISTRICT_URL = `${API_SALECONNEXT}/GetAddress/SubDistrict`;
  const ZIPCODE_URL = `${API_SALECONNEXT}/GetAddress/Zipcode`;

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

  {
    /************ สแกนบัตร ************/
  }
  const [showScanner, setShowScanner] = useState(false);
  // เมื่อ user ถ่ายภาพบัตร เราเก็บ base64 ลง state นี้
  const [idCardBase64, setIdCardBase64] = useState<string | null>(null);

  // state สำหรับเก็บผลลัพธ์ Text จาก OCR.space
  const [ocrResult, setOcrResult] = useState<OCRResultState | null>(null);

  const [isLoadingOCR, setIsLoadingOCR] = useState(false);

  // กรณีดึงมาจากเช็คสถานะลูกค้า เซ็ตค่าลง state แค่ครั้งแรก และสามารถลบแก้ไขค่าได้
  const [hasInitialized, setHasInitialized] = useState(false);

  // เดือนภาษาไทย (เต็มรูปแบบ)
  const thaiMonths = [
    { value: 1, label: "มกราคม" },
    { value: 2, label: "กุมภาพันธ์" },
    { value: 3, label: "มีนาคม" },
    { value: 4, label: "เมษายน" },
    { value: 5, label: "พฤษภาคม" },
    { value: 6, label: "มิถุนายน" },
    { value: 7, label: "กรกฎาคม" },
    { value: 8, label: "สิงหาคม" },
    { value: 9, label: "กันยายน" },
    { value: 10, label: "ตุลาคม" },
    { value: 11, label: "พฤศจิกายน" },
    { value: 12, label: "ธันวาคม" },
  ];

  // สร้างลิสต์ปีพ.ศ. (ย้อนหลัง 100 ปี)
  const currentBE = new Date().getFullYear() + 543;
  const yearsBE = Array.from({ length: 100 }, (_, i) => currentBE - i);

  // แยก state สำหรับวัน เดือน ปี
  const [selectedDay, setSelectedDay] = useState<number | "">("");
  const [selectedMonth, setSelectedMonth] = useState<number | "">("");
  const [selectedYearBE, setSelectedYearBE] = useState<number | "">("");

  const [loadingCustomerType, setLoadingCustomerType] = useState(false);

  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYearBE) {
      // แปลงกลับเป็น ค.ศ.
      const yearAD = selectedYearBE - 543;
      const dt = new Date(yearAD, selectedMonth - 1, selectedDay);
      setValueCalendar(dt);
      handleDateChange(dt);
    }
  }, [selectedDay, selectedMonth, selectedYearBE]);

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
      formData.append("apikey", API_OCR);
      formData.append("base64Image", base64Image);
      formData.append("language", "tha"); // อ่านภาษาไทย
      formData.append("isOverlayRequired", "false");
      formData.append("filetype", "PNG"); // หรือ 'JPG' ตาม screenshotFormat
      formData.append("detectOrientation", "true");
      formData.append("isCreateSearchablePdf", "false");
      formData.append("scale", "false");
      formData.append("isTable", "false");
      formData.append("OCREngine", "2"); // ใช้ OCR Engine 2

      const response = await axios.post(
        "https://api.ocr.space/parse/image",
        formData,
        {
          headers: {
            // 'Content-Type' จะถูกเซ็ตเป็น multipart/form-data โดย axios เอง
          },
        }
      );

      const data = response.data;
      if (data.OCRExitCode === 1 && data.ParsedResults) {
        const allText = data.ParsedResults.map(
          (res: any) => res.ParsedText
        ).join("\n");
        setOcrResult({ rawText: allText });
      } else {
        const errMsg = data.ErrorMessage || "Unknown OCR error";
        setOcrResult({ rawText: "", error: errMsg });
      }
    } catch (error: any) {
      setOcrResult({ rawText: "", error: error.message || "Request failed" });
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

  {
    /************ สแกนบัตร ************/
  }

  const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false);
  const [draft, setDraft] = useState<any[]>([]);

  useEffect(() => {
    const getDataDraft = async () => {
      setIsLoadingDraft(true);
      try {
        const response = await axios.get(DRAFT_ALLCONTRACT_URL);
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setDraft(data);
      } catch (error) {
        console.error("Error fetching DRAFT_ALLCONTRACT_URL:", error);
      } finally {
        setIsLoadingDraft(false);
      }
    };
    getDataDraft();
  }, []);

  // เลือก item ที่ REFNO ตรงกัน (find สำหรับ 1 item หรือ filter สำหรับหลาย item)
  const matchedItem = draft.find((item) => item.REFNO === REFNO);
  console.log(`matchedItem`, matchedItem);

  const [customerTypes, setCustomerTypes] = useState<any[]>([]);

  const [valueCalendar, setValueCalendar] = useState<Date | null>(null);
  const [valueAge, setValueAge] = useState<number | null>(null);

  const [selectedCustomerType, setsSelectedCustomerType] = useState<string>("");
  // console.log(`selectedCustomerType`, selectedCustomerType);
  const [selectedCardType, setSelectedCardType] = useState<string>("");
  const [selectedPrefixId, setSelectedPrefixId] = useState<number>();
  const [selectedSexId, setSelectedSexId] = useState<number>();

  const [idCard, setIdCard] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [workPhone, setWorkPhone] = useState<string>("");
  const [nameMD, setNameMD] = useState<string>("");

  const selectedCustomer = customerTypes.find(
    (type) => type.CUSTOMERTYPE === selectedCustomerType
  ) || { CARDTYPE: [], PREFIX: [], SEX: [] };

  // เก็บข้อมูลส่วนลดใน state และ store
  const SaveCustomertData = useMemo(() => {
    const customerTypeData = customerTypes.find(
      (type) => type.CUSTOMERTYPE === selectedCustomerType
    );
    // console.log("customerTypeData:", customerTypeData);

    return [
      {
        CUSTOMERTYPE: selectedCustomerType ? selectedCustomerType : "",
        CUSTOMERTYPENAME: customerTypeData
          ? customerTypeData.CUSTOMERTYPENAME
          : "",
        CUSTOMERID: idCard ? idCard : "",
        CUSTOMERNAME: fullName ? fullName : "",
        CUSTOMERLASTNAME: lastName ? lastName : "",
        CUSTOMERMD: nameMD ? nameMD : "",
        CUSTOMERDOB: valueCalendar
          ? dayjs(valueCalendar).format("YYYY-MM-DD")
          : "",
        CUSTOMERRAGE: valueAge ? valueAge.toString() : "",
        CUSTOMERMOBILE: mobile ? mobile : "",
        CUSTOMERWORKPHONE: workPhone ? workPhone : "",
        CUSTOMERPHONE: phone ? phone : "",
        CUSTOMEREMAIL: email ? email : "",
        CARDTYPE: customerTypeData?.CARDTYPE
          ? customerTypeData.CARDTYPE.filter((cardType: any) => {
              // console.log("Selected Card Type:", selectedCardType);
              // console.log("Available Card Type:", cardType.CARDTYPE);
              return String(cardType.CARDTYPE) === String(selectedCardType); // ใช้การเปรียบเทียบแบบ string
            }).map((cardType: any) => ({
              CARDTYPE: selectedCardType,
              CARDTYPECODE: cardType.CARDTYPECODE,
              CARDTYPENAME: cardType.CARDTYPENAME,
            }))
          : [],
        PREFIX: customerTypeData?.PREFIX
          ? customerTypeData.PREFIX.filter(
              (prefix: any) => prefix.PREFIXID === selectedPrefixId
            ) // ใช้เฉพาะค่าที่เลือก
              .map((prefix: any) => ({
                PREFIXID: selectedPrefixId,
                PREFIXCODE: prefix.PREFIXCODE,
                PREFIXNAME: prefix.PREFIXNAME,
              }))
          : [],
        SEX: customerTypeData?.SEX
          ? customerTypeData.SEX.filter(
              (sex: any) => sex.SEXID === selectedSexId
            ) // ใช้เฉพาะค่าที่เลือก
              .map((sex: any) => ({
                SEXID: selectedSexId,
                SEXCODE: sex.SEXCODE,
                SEXNAME: sex.SEXNAME,
              }))
          : [],
      },
    ];
  }, [
    customerTypes,
    selectedCustomerType,
    idCard,
    fullName,
    lastName,
    valueCalendar,
    valueAge,
    selectedCardType,
    selectedPrefixId,
    selectedSexId,
    email,
    mobile,
    phone,
    workPhone,
  ]);

  // อัปเดตข้อมูลส่วน customer ลง store
  // useEffect(() => {
  //   if (
  //     JSON.stringify(SaveCustomertData) !== JSON.stringify(saveCustomerTypes)
  //   ) {
  //     setSaveCustomerTypes(SaveCustomertData); // อัปเดตข้อมูลลง store
  //   }
  // }, [SaveCustomertData, saveCustomerTypes, setSaveCustomerTypes]);

  // GET Customertype
  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingCustomerType(true);
        const response = await axios.get(CUSTOMER_TYPE_URL, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setCustomerTypes(response.data);
      } catch (error) {
        console.error("Error fetching CUSTOMER_TYPE_URL:", error);
      } finally {
        setLoadingCustomerType(false);
      }
    };
    getData();
  }, []);

  // Handle Customer Type Change
  const handleCustTypeOptionChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setsSelectedCustomerType(value);
    setSelectedCardType("");
  };

  // const handleDateChange = (date: Date | null) => {
  //     if (date) {
  //         const calculatedAge = dayjs().diff(dayjs(date), 'year');
  //         if (calculatedAge <= 20) {
  //             MySwal.fire({
  //                 icon: 'warning',
  //                 title: 'อายุไม่ถึงเกณฑ์',
  //                 text: 'อายุต้องมากกว่า 20 ปีขึ้นไปจึงทำรายการได้',
  //                 customClass: {
  //                     title: styles.fontSize,
  //                     htmlContainer: styles.fontSize,
  //                     confirmButton: styles.fontSize,
  //                     inputLabel: styles.fontSize,
  //                 }
  //             })
  //             // เคลียร์ค่าใน DatePicker และอายุ
  //             setValueCalendar(null);
  //             setValueAge(null);
  //             return; // ยกเลิกการ set ค่าอื่น ๆ ต่อ
  //         }
  //         // ถ้าอายุมากกว่า 20 ก็ set ค่าให้ปกติ
  //         setValueCalendar(date);
  //         setValueAge(calculatedAge);
  //     } else {
  //         // กรณีลบวันที่ทิ้ง
  //         setValueCalendar(null);
  //         setValueAge(null);
  //     }
  // };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const calculatedAge = dayjs().diff(dayjs(date), "year");

      if (calculatedAge < 20 || calculatedAge > 85) {
        MySwal.fire({
          icon: "warning",
          title: calculatedAge < 20 ? "อายุไม่ถึงเกณฑ์" : "อายุเกินขอบเขต",
          text:
            calculatedAge < 20
              ? "อายุต้องมากกว่า 20 ปีขึ้นไปจึงทำรายการได้"
              : "อายุต้องไม่เกิน 85 ปี",
          customClass: {
            /* … */
          },
        });

        // ล้าง local state
        setSelectedDay("");
        setSelectedMonth("");
        setSelectedYearBE("");
        setValueCalendar(null);
        setValueAge(null);

        // **ล้าง RHF field**
        setValue("selectedDay", undefined);
        setValue("selectedMonth", undefined);
        setValue("selectedYearBE", undefined);
        return;
      }

      // อายุปกติ
      setValueCalendar(date);
      setValueAge(calculatedAge);
    } else {
      // ล้างกรณี user กดลบ
      setSelectedDay("");
      setSelectedMonth("");
      setSelectedYearBE("");
      setValueCalendar(null);
      setValueAge(null);
      setValue("selectedDay", undefined);
      setValue("selectedMonth", undefined);
      setValue("selectedYearBE", undefined);
    }
  };

  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYearBE) {
      const yearAD = selectedYearBE - 543;
      const dt = new Date(yearAD, selectedMonth - 1, selectedDay);
      handleDateChange(dt);
    }
  }, [selectedDay, selectedMonth, selectedYearBE]);

  {
    /*-------------------- Start Validate --------------------*/
  }

  const schema = yup.object({
    // 1) ประเภทลูกค้า บังคับกรอกเสมอ
    selectedCustomerType: yup.string().required("กรุณาเลือกประเภทลูกค้า"),

    // 2) ถ้าไม่ใช่ นิติบุคคล (ค่า !== '1') บังคับกรอกประเภทบัตร
    selectedCardType: yup.string().when("selectedCustomerType", {
      is: (v: any) => v === "0" || v === "2",
      then: (s) => s.required("กรุณาเลือกประเภทบัตร"),
      otherwise: (s) => s,
    }),

    // 3) เลขบัตร
    idCard: yup.string().when("selectedCustomerType", {
      is: (v: any) => v === "0" || v === "1" || v === "2",
      then: (s) =>
        s
          .required("กรุณากรอก")
          .matches(/^[0-9]{13}$/, "กรุณากรอกเลข 13 หลัก")
          .test("valid-thai-id", "เลขบัตรประชาชนไม่ถูกต้อง", (val) =>
            isValidThaiId(val || "")
          ),
      otherwise: (s) => s,
    }),

    // 4) คำนำหน้าชื่อ
    selectedPrefixId: yup
      .number()
      .when(["selectedCustomerType"] as const, ([custType], schema) =>
        custType === "0" ||
        custType === "1" ||
        custType === "2" ||
        custType === "3"
          ? schema.required("กรุณาเลือกคำนำหน้าชื่อ")
          : schema
      ),

    // 5) ชื่อ บังคับกรอกเสมอ
    fullName: yup.string().required("กรุณากรอกชื่อ"),

    // 6–8) วัน / เดือน / ปีเกิด (พ.ศ.) แยกสามฟิลด์
    selectedDay: yup
      .number()
      .when(["selectedCustomerType"] as const, ([custType], schema) =>
        custType === "0" || custType === "2"
          ? schema.required("กรุณาเลือกวันเดือนปีเกิดให้ครบ")
          : schema
      ),
    selectedMonth: yup
      .number()
      .when(["selectedCustomerType"] as const, ([custType], schema) =>
        custType === "0" || custType === "2"
          ? schema.required("กรุณาเลือกวันเดือนปีเกิดให้ครบ")
          : schema
      ),
    selectedYearBE: yup
      .number()
      .when(["selectedCustomerType"] as const, ([custType], schema) =>
        custType === "0" || custType === "2"
          ? schema.required("กรุณาเลือกวันเดือนปีเกิดให้ครบ")
          : schema
      ),

    // 9) เพศ
    selectedSexId: yup
      .number()
      .when(["selectedCustomerType"] as const, ([custType], schema) =>
        custType === "0" || custType === "2"
          ? schema.required("กรุณาเลือกเพศ")
          : schema
      ),

    // 10) เบอร์ที่ติดต่อได้ 1
    telNo: yup
      .string()
      .when(["selectedCustomerType"] as const, ([custType], schema) =>
        custType === "0" ||
        custType === "1" ||
        custType === "2" ||
        custType === "3"
          ? schema
              .required("กรุณากรอกเบอร์ที่ติดต่อได้ 1")
              .matches(/^[0-9]{10}$/, "เบอร์โทรต้องเป็นตัวเลข 10 หลัก")
          : schema.notRequired()
      ),

    // 11) อีเมล ไม่บังคับ
    email: yup.string().notRequired().email("รูปแบบอีเมลไม่ถูกต้อง"),
  });

  // 2) infer type
  type FormValues = yup.InferType<typeof schema>;

  // 3. เรียก useForm พร้อม resolver
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      selectedCustomerType: "",
      selectedCardType: "",
      idCard: "",
      selectedPrefixId: undefined,
      fullName: "",
      selectedDay: undefined,
      selectedMonth: undefined,
      selectedYearBE: undefined,
      selectedSexId: undefined,
      telNo: "",
      email: "",
    },
  });

  // ตรง useEffect ที่ดึงค่า matchedItem เข้ามา
  // useEffect(() => {
  //     const custData = matchedItem?.CUSTOMERSTATUS?.[0];
  //     if (!custData?.Contract) {
  //         return;
  //     }

  //     const contract = custData.Contract;

  //     // — IDCard ตามเดิม —
  //     const newIdCard = contract.IDCard ?? '';
  //     setIdCard(newIdCard);
  //     setValue('idCard', newIdCard);

  //     // — ชื่อ–นามสกุล จาก contract.CustomerName —
  //     // trim() + split ด้วย whitespace แล้วเอาตัวแรกเป็นชื่อ
  //     // ส่วนที่เหลือ join กลับเป็นนามสกุล
  //     const rawName = (contract as any).CustomerName ?? '';
  //     const parts = rawName.trim().split(/\s+/);
  //     const first = parts.shift() || '';
  //     const last = parts.join(' ') || '';

  //     setFullName(first);
  //     setLastName(last);

  //     // ถ้าคุณใช้ react-hook-form เก็บ fullName ก็ setValue ด้วย
  //     setValue('fullName', first);
  //     // ถ้ามี lastName ใน form ก็เรียก setValue('lastName', last) ด้วย

  //     // — เบอร์โทร เหมือนเดิม —
  //     const address = Array.isArray(contract.Address)
  //         ? contract.Address[0]
  //         : {};
  //     const rawMobile = address.TelMobile || address.TelHome || address.TelOffice || '';
  //     const cleanedMobile = rawMobile.replace(/-/g, '');
  //     setMobile(cleanedMobile);
  //     setValue('telNo', cleanedMobile);

  // }, [matchedItem, setValue]);

  useEffect(() => {
    const custData = matchedItem?.CUSTOMERSTATUS?.[0];
    if (!custData?.Contract || hasInitialized) return;

    const contract = custData.Contract;

    // — IDCard ตามเดิม —
    const newIdCard =
      contract.IDCard && contract.IDCard !== "0" ? contract.IDCard : "";

    setIdCard(newIdCard);
    setValue("idCard", newIdCard);

    // — ชื่อ–นามสกุล —
    const rawName = (contract as any).CustomerName ?? "";
    const parts = rawName.trim().split(/\s+/);
    const first = parts.shift() || "";
    const last = parts.join(" ") || "";
    setFullName(first);
    setLastName(last);
    setValue("fullName", first);
    // ถ้ามี lastName ในฟอร์ม ก็เรียก setValue('lastName', last);

    // — เบอร์โทร —
    const address = Array.isArray(contract.Address) ? contract.Address[0] : {};
    const rawMobile =
      address.TelMobile || address.TelHome || address.TelOffice || "";
    const cleanedMobile = rawMobile.replace(/-/g, "");
    setMobile(cleanedMobile);
    setValue("telNo", cleanedMobile);

    // mark ว่า initialize เสร็จแล้ว
    setHasInitialized(true);

    // ฟังก์ชันบันทึกข้อมูล CUSTOMERDETAIL อัตโนมัติ
    const saveMatchedCustomer = async () => {
      try {
        await axios.post(
          UPDATECONTACT,
          {
            REFNO,
            EMPID: EmpId,
            TEAMSALE: TeamSale,
            SALECODE: SaleCode,
            SUPEMPID: SupEmpId,
            SECEMPID: SecEmpId,
            FIELD: "CUSTOMERDETAIL",
            DATA: SaveCustomertData,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("อัปเดต CUSTOMERDETAIL สำเร็จ");
      } catch (err) {
        console.error("Error auto-saving CUSTOMERDETAIL:", err);
      }
    };

    saveMatchedCustomer();
  }, [matchedItem, SaveCustomertData, setValue, hasInitialized]);

  {
    /*-------------------- End Validate --------------------*/
  }

  {
    /*-------------------- Start บันทึกข้อมูลลงระบบ และไปขั้นตอนต่อไป --------------------*/
  }
  const onSubmit = async (data: any) => {
    try {
      // เรียก API บันทึกข้อมูล
      const response = await axios.post(
        UPDATECONTACT,
        {
          REFNO,
          EMPID: EmpId,
          TEAMSALE: TeamSale,
          SALECODE: SaleCode,
          SUPEMPID: SupEmpId,
          SECEMPID: SecEmpId,
          FIELD: "CUSTOMERDETAIL",
          DATA: SaveCustomertData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(`updateContract DISCOUNT: `, response.data);
      MySwal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: "บันทึกข้อมูลลูกค้าเรียบร้อยแล้ว",
        timer: 2000, // แสดงผล 3 วินาที
        showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
      });
      navigate("/sale/createaddress-cash");
    } catch (error) {
      console.error("Error saving data:", error);
      MySwal.fire("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };
  {
    /*-------------------- End บันทึกข้อมูล --------------------*/
  }

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
      const thaiDateRe =
        /เกิดวันที่\s*([0-9]{1,2})\s*(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s*([0-9]{4})/;
      const thaiMatch = text.match(thaiDateRe);
      if (thaiMatch) {
        const day = parseInt(thaiMatch[1], 10);
        const thaiMonthMap: Record<string, number> = {
          "ม.ค.": 1,
          "ก.พ.": 2,
          "มี.ค.": 3,
          "เม.ย.": 4,
          "พ.ค.": 5,
          "มิ.ย.": 6,
          "ก.ค.": 7,
          "ส.ค.": 8,
          "ก.ย.": 9,
          "ต.ค.": 10,
          "พ.ย.": 11,
          "ธ.ค.": 12,
        };
        const rawMonth = thaiMatch[2]; // type string
        const month = thaiMonthMap[rawMonth]; // ไม่เตือนแล้ว
        let year = parseInt(thaiMatch[3], 10);
        if (year > 2400) year -= 543; // ถ้าเป็น พ.ศ. ลบ 543

        const parsed = new Date(year, month - 1, day);
        if (!isNaN(parsed.getTime())) {
          setValueCalendar(parsed);
          handleDateChange(parsed);
          return; // จบเลย ไม่ต้อง fallback English
        }
      }

      // 2) ถ้าไม่เจอวันที่ไทย จึงค่อย fallback English แบบเดิม (optional)
      const engDateRe =
        /Date of (?:surth|birth)\s*([0-9]{1,2})\s*(Jan\.?|Feb\.?|Mar\.?|Apr\.?|May\.?|Jun\.?|Jul\.?|Aug\.?|Sep\.?|Oct\.?|Nov\.?|Dec\.?)\.?\s*([0-9]{4})/i;
      const engMatch = text.match(engDateRe);
      if (engMatch) {
        const day = parseInt(engMatch[1], 10);
        const engMonthMap: Record<string, number> = {
          Jan: 1,
          "Jan.": 1,
          Feb: 2,
          "Feb.": 2,
          Mar: 3,
          "Mar.": 3,
          Apr: 4,
          "Apr.": 4,
          May: 5,
          "May.": 5,
          Jun: 6,
          "Jun.": 6,
          Jul: 7,
          "Jul.": 7,
          Aug: 8,
          "Aug.": 8,
          Sep: 9,
          "Sep.": 9,
          Oct: 10,
          "Oct.": 10,
          Nov: 11,
          "Nov.": 11,
          Dec: 12,
          "Dec.": 12,
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

  function formatLocalDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  }

  // นำเข้าเลยข้างบนของไฟล์
  function isValidThaiId(id: string): boolean {
    if (!/^\d{13}$/.test(id)) return false;
    const digits = id.split("").map((d) => parseInt(d, 10));
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
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <h4 className={`${styles.fontSize}`}>ภาพที่ถ่ายจากกล้อง:</h4>
          <img
            src={idCardBase64}
            alt="ID Card Preview"
            style={{
              maxWidth: "100%",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
        </div>
      )}

      {/* แสดงสถานะการเรียก OCR.space */}
      {idCardBase64 && (
        <div style={{ textAlign: "center", marginTop: 12 }}>
          {isLoadingOCR ? (
            <p className={`${styles.fontSize}`}>
              กำลังอ่านข้อมูลจากบัตร (OCR)...
            </p>
          ) : ocrResult ? (
            <>
              {ocrResult.error ? (
                <div style={{ color: "red" }}>
                  <h5>เกิดข้อผิดพลาดจาก OCR:</h5>
                  <p>{ocrResult.error}</p>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "left",
                    whiteSpace: "pre-wrap",
                    backgroundColor: "#f5f5f5",
                    padding: 12,
                    borderRadius: 4,
                  }}
                >
                  <h5 className={`${styles.fontSize}`}>ผลลัพธ์:</h5>
                  <pre className={`${styles.fontSize}`}>
                    {ocrResult.rawText}
                  </pre>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
      {/* สแกนบัตร */}

      {/* แสดง Loading */}
      {loadingCustomerType && (
        <div className="text-center my-10">
          <ThreeDot />
          <p className={`my-5 ${styles.fontSize}`}>
            กำลังโหลดข้อมูล กรุณารอสักครู่ ...
          </p>
        </div>
      )}

      {!loadingCustomerType && (
        <>
          <Content>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="d-flex justify-content-between align-items-center my-5">
                <div
                  id="kt_page_title"
                  data-kt-swapper="true"
                  data-kt-swapper-mode="prepend"
                  data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                  className="page-title d-flex flex-wrap me-3 flex-column justify-content-ceดnter"
                >
                  <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                    <li className={`breadcrumb-item ${styles.titlePage}`}>
                      ข้อมูลลูกค้า
                    </li>
                  </ul>
                </div>
              </div>
              <span className={`${styles.fontSize}`}>เลขที่ขาย: </span>
              <span className={`${styles.titlePage}`}>{REFNO}</span>

              {/* Card Body */}
              <div className="accordion mb-10" id="kt_accordion_1">
                {/* Start accordion ข้อมูลลูกค้า*/}
                <div className="accordion-item mb-10">
                  <h2 className="accordion-header" id="kt_accordion_1_header_1">
                    <h3
                      className="accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7"
                      data-bs-toggle="collapse"
                      data-bs-target="#kt_accordion_1_body_1"
                      aria-expanded="true"
                      aria-controls="kt_accordion_1_body_1"
                      style={{
                        color: "white",
                        cursor: "pointer",
                        backgroundColor: "#3777bc",
                      }}
                    >
                      ข้อมูลลูกค้า
                    </h3>
                  </h2>
                  <div
                    id="kt_accordion_1_body_1"
                    className="accordion-collapse collapse show"
                    aria-labelledby="kt_accordion_1_header_1"
                    data-bs-parent="#kt_accordion_1"
                  >
                    <div className="accordion-body">
                      {/* start form */}
                      <form className="form">
                        <div className="card-body px-lg-9 px-1">
                          {selectedCustomerType !== "1" && (
                            <>
                              <div>
                                <div className="row mb-6">
                                  <div className="col-lg-6 my-3">
                                    {/* <select
                                                                    className={`form-select ${styles.label}`}
                                                                    value={selectedCustomerType}
                                                                    onChange={(e) => handleCustTypeOptionChange(e)}
                                                                >
                                                                    <option value="">เลือกประเภทลูกค้า</option>
                                                                    {customerTypes.map((item: any) => (
                                                                        <option key={item.CUSTOMERTYPE} value={item.CUSTOMERTYPE}>
                                                                            {item.CUSTOMERTYPENAME}
                                                                        </option>
                                                                    ))}
                                                                </select> */}
                                    <Controller
                                      name="selectedCustomerType"
                                      control={control}
                                      render={({ field }) => (
                                        <div className="mb-3">
                                          <label
                                            className={`${styles.label} ${styles.required}`}
                                          >
                                            ประเภทลูกค้า
                                          </label>
                                          <select
                                            {...field}
                                            className={`form-select ${
                                              styles.label
                                            } ${
                                              errors.selectedCustomerType
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                            onChange={(e) => {
                                              field.onChange(e); // อัปเดต RHF
                                              setsSelectedCustomerType(
                                                e.target.value
                                              ); // ถ้าคุณยังใช้ state แยกอยู่
                                            }}
                                          >
                                            <option value="">
                                              เลือกประเภทลูกค้า
                                            </option>
                                            {customerTypes.map((ct) => (
                                              <option
                                                key={ct.CUSTOMERTYPE}
                                                value={ct.CUSTOMERTYPE}
                                              >
                                                {ct.CUSTOMERTYPENAME}
                                              </option>
                                            ))}
                                          </select>
                                          {errors.selectedCustomerType && (
                                            <div
                                              className={`invalid-feedback ${styles.label}`}
                                            >
                                              {
                                                errors.selectedCustomerType
                                                  .message
                                              }
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    />
                                  </div>

                                  <div className="col-lg-6 my-3">
                                    {/* <label className={`${styles.label} `}>ประเภทบัตร</label>
                                                                <select
                                                                    className={`form-select ${styles.label}`}
                                                                    value={selectedCardType}
                                                                    onChange={(e) => setSelectedCardType(e.target.value)}
                                                                    disabled={!selectedCustomerType}
                                                                >
                                                                    <option value=''>เลือกประเภทบัตร</option>
                                                                    {selectedCustomer.CARDTYPE.map((cardType: any) => (
                                                                        <option key={cardType.CARDTYPE} value={cardType.CARDTYPE}>
                                                                            {cardType.CARDTYPENAME}
                                                                        </option>
                                                                    ))}
                                                                </select> */}
                                    <Controller
                                      name="selectedCardType"
                                      control={control}
                                      render={({ field }) => (
                                        <div className="mb-3">
                                          <label className={`${styles.label}`}>
                                            ประเภทบัตร
                                          </label>
                                          <select
                                            {...field}
                                            className={`form-select ${
                                              styles.label
                                            } ${
                                              errors.selectedCardType
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                            onChange={(e) => {
                                              field.onChange(e); // อัปเดต RHF
                                              setSelectedCardType(
                                                e.target.value
                                              ); // ถ้าคุณยังใช้ state แยกอยู่
                                            }}
                                          >
                                            <option value="">
                                              เลือกประเภทบัตร
                                            </option>
                                            {selectedCustomer.CARDTYPE.map(
                                              (ct: any) => (
                                                <option
                                                  key={ct.CARDTYPE}
                                                  value={ct.CARDTYPE}
                                                >
                                                  {ct.CARDTYPENAME}
                                                </option>
                                              )
                                            )}
                                          </select>
                                          {errors.selectedCardType && (
                                            <div
                                              className={`invalid-feedback ${styles.label}`}
                                            >
                                              {errors.selectedCardType.message}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="row mb-6 mt-6">
                                <div className="col-lg-6 my-3">
                                  <label className={`${styles.label} `}>
                                    เลขบัตร
                                  </label>
                                  <Controller
                                    name="idCard"
                                    control={control}
                                    render={({ field }) => (
                                      <div
                                        className={`input-group ${styles.customInputGroup}`}
                                      >
                                        <input
                                          {...field}
                                          className={`form-control ${
                                            styles.label
                                          } ${
                                            errors.idCard ? "is-invalid" : ""
                                          }`}
                                          value={idCard}
                                          maxLength={13}
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === " " ||
                                              e.key === "Tab"
                                            )
                                              e.preventDefault();
                                          }}
                                          onPaste={(e) => {
                                            const cleaned = e.clipboardData
                                              .getData("Text")
                                              .replace(/\s+/g, "");
                                            e.preventDefault();
                                            field.onChange(cleaned);
                                            setIdCard(cleaned);
                                            trigger("idCard");
                                          }}
                                          onChange={(e) => {
                                            const cleaned =
                                              e.target.value.replace(
                                                /\s+/g,
                                                ""
                                              );
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
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setShowScanner(true)}
                                          >
                                            <FontAwesomeIcon icon={faBarcode} />
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  />
                                  {errors.idCard && (
                                    <p
                                      className={`text-danger ${styles.label}`}
                                    >
                                      {errors.idCard.message}
                                    </p>
                                  )}
                                </div>

                                <div className="col-lg-6 my-3">
                                  {/* <label className={`${styles.label} `}>คำนำหน้าชื่อ</label>
                                                            <select
                                                                className={`form-select ${styles.label}`}
                                                                onChange={(e) => setSelectedPrefixId(Number(e.target.value))}
                                                                disabled={!selectedCustomerType}
                                                            >
                                                                <option value=''>เลือกคำนำหน้าชื่อ</option>
                                                                {selectedCustomer.PREFIX.map((prefix: any) => (
                                                                    <option key={prefix.PREFIXID} value={prefix.PREFIXID}>{prefix.PREFIXNAME}</option>
                                                                ))}
                                                            </select> */}
                                  <Controller
                                    name="selectedPrefixId"
                                    control={control}
                                    render={({ field }) => (
                                      <div className="mb-3">
                                        <label className={`${styles.label}`}>
                                          คำนำหน้าชื่อ
                                        </label>
                                        <select
                                          {...field}
                                          className={`form-select ${
                                            styles.label
                                          } ${
                                            errors.selectedPrefixId
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                          onChange={(e) => {
                                            field.onChange(e); // อัปเดต RHF
                                            setSelectedPrefixId(
                                              Number(e.target.value)
                                            ); // ถ้าคุณยังใช้ state แยกอยู่
                                          }}
                                        >
                                          <option value="">
                                            เลือกคำนำหน้าชื่อ
                                          </option>
                                          {selectedCustomer.PREFIX.map(
                                            (prefix: any) => (
                                              <option
                                                key={prefix.PREFIXID}
                                                value={prefix.PREFIXID}
                                              >
                                                {prefix.PREFIXNAME}
                                              </option>
                                            )
                                          )}
                                        </select>
                                        {errors.selectedPrefixId && (
                                          <div
                                            className={`invalid-feedback ${styles.label}`}
                                          >
                                            {errors.selectedPrefixId.message}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  />
                                </div>

                                <div className="col-lg-6 my-3">
                                  <label
                                    className={`${styles.label} ${styles.required}`}
                                  >
                                    ชื่อ
                                  </label>
                                  <Controller
                                    name="fullName"
                                    control={control}
                                    render={({ field }) => (
                                      <>
                                        <input
                                          {...field}
                                          type="text"
                                          className={`form-control ${
                                            styles.label
                                          } ${
                                            errors.fullName ? "is-invalid" : ""
                                          }`}
                                          onChange={(e) => {
                                            field.onChange(e);
                                            setFullName(e.target.value);
                                          }}
                                        />
                                        {errors.fullName && (
                                          <p
                                            className={`text-danger ${styles.label}`}
                                          >
                                            {errors.fullName.message}
                                          </p>
                                        )}
                                      </>
                                    )}
                                  />
                                </div>

                                <div className="col-lg-6 my-3">
                                  <label className={`${styles.label} `}>
                                    นามสกุล
                                  </label>
                                  <input
                                    type="text"
                                    className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                    value={lastName}
                                    onChange={(e) =>
                                      setLastName(e.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              <div className="row mb-6">
                                {/* <div className="col-lg-4 my-3">
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <label className={`${styles.label} `}>วันเดือนปีเกิด</label>
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
                                                        </div> */}

                                {/* <div className="col-lg-4 my-3">
                                                            <label className={`${styles.label}`}>วันเดือนปีเกิด</label>
                                                            <div className="d-flex gap-2">

                                                                <select
                                                                    className={`form-select ${styles.label}`}
                                                                    value={selectedDay}
                                                                    onChange={e => setSelectedDay(Number(e.target.value) || '')}
                                                                >
                                                                    <option value="">วัน</option>
                                                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                                                        <option key={day} value={day}>{day}</option>
                                                                    ))}
                                                                </select>

                                                                <select
                                                                    className={`form-select ${styles.label}`}
                                                                    value={selectedMonth}
                                                                    onChange={e => setSelectedMonth(Number(e.target.value) || '')}
                                                                >
                                                                    <option value="">เดือน</option>
                                                                    {thaiMonths.map(m => (
                                                                        <option key={m.value} value={m.value}>{m.label}</option>
                                                                    ))}
                                                                </select>

                                                                <select
                                                                    className={`form-select ${styles.label}`}
                                                                    value={selectedYearBE}
                                                                    onChange={e => setSelectedYearBE(Number(e.target.value) || '')}
                                                                >
                                                                    <option value="">ปี</option>
                                                                    {yearsBE.map(year => (
                                                                        <option key={year} value={year}>{year}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div> */}

                                <div className="col-lg-4 my-3">
                                  <label className={`${styles.label}`}>
                                    วันเดือนปีเกิด
                                  </label>
                                  <div className="d-flex gap-2">
                                    {/* วัน */}
                                    <Controller
                                      name="selectedDay"
                                      control={control}
                                      render={({ field }) => (
                                        <select
                                          {...field}
                                          value={field.value ?? ""}
                                          className={`form-select ${
                                            styles.label
                                          } ${
                                            errors.selectedDay
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                          onChange={(e) => {
                                            const v =
                                              Number(e.target.value) || "";
                                            field.onChange(v);
                                            setSelectedDay(v);
                                          }}
                                        >
                                          <option value="">วัน</option>
                                          {Array.from(
                                            { length: 31 },
                                            (_, i) => i + 1
                                          ).map((day) => (
                                            <option key={day} value={day}>
                                              {day}
                                            </option>
                                          ))}
                                        </select>
                                      )}
                                    />

                                    {/* เดือน */}
                                    <Controller
                                      name="selectedMonth"
                                      control={control}
                                      render={({ field }) => (
                                        <select
                                          {...field}
                                          value={field.value ?? ""}
                                          className={`form-select ${
                                            styles.label
                                          } ${
                                            errors.selectedMonth
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                          onChange={(e) => {
                                            const v =
                                              Number(e.target.value) || "";
                                            field.onChange(v);
                                            setSelectedMonth(v);
                                          }}
                                        >
                                          <option value="">เดือน</option>
                                          {thaiMonths.map((m) => (
                                            <option
                                              key={m.value}
                                              value={m.value}
                                            >
                                              {m.label}
                                            </option>
                                          ))}
                                        </select>
                                      )}
                                    />

                                    {/* ปี (พ.ศ.) */}
                                    <Controller
                                      name="selectedYearBE"
                                      control={control}
                                      render={({ field }) => (
                                        <select
                                          {...field}
                                          value={field.value ?? ""}
                                          className={`form-select ${
                                            styles.label
                                          } ${
                                            errors.selectedYearBE
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                          onChange={(e) => {
                                            const v =
                                              Number(e.target.value) || "";
                                            field.onChange(v);
                                            setSelectedYearBE(v);
                                          }}
                                        >
                                          <option value="">ปี</option>
                                          {yearsBE.map((year) => (
                                            <option key={year} value={year}>
                                              {year}
                                            </option>
                                          ))}
                                        </select>
                                      )}
                                    />
                                  </div>

                                  {/* แสดงข้อความ error ถ้ามี */}
                                  {errors.selectedYearBE && (
                                    <p
                                      className={`text-danger ${styles.label}`}
                                    >
                                      {errors.selectedYearBE.message}
                                    </p>
                                  )}
                                </div>

                                <div className="col-lg-4 my-3">
                                  <label className={`${styles.label} `}>
                                    อายุ
                                  </label>
                                  <input
                                    value={
                                      valueAge !== null
                                        ? valueAge.toString()
                                        : ""
                                    }
                                    type="text"
                                    className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                    readOnly
                                  />
                                </div>
                                {selectedCustomerType !== "1" && (
                                  <div className="col-lg-4 my-3">
                                    {/* <label className={`${styles.label} `}>เพศ</label>
                                                                <select
                                                                    className={`form-select mb-3 mb-lg-0 ${styles.label}`}
                                                                    onChange={(e) => setSelectedSexId(Number(e.target.value))}
                                                                    disabled={!selectedCustomerType}
                                                                >
                                                                    <option value=''>เลือกเพศ</option>
                                                                    {selectedCustomer.SEX.map((sex: any) => (
                                                                        <option key={sex.SEXID} value={sex.SEXID}>{sex.SEXNAME}</option>
                                                                    ))}
                                                                </select> */}
                                    <Controller
                                      name="selectedSexId"
                                      control={control}
                                      render={({ field }) => (
                                        <div className="mb-3">
                                          <label className={`${styles.label}`}>
                                            เพศ
                                          </label>
                                          <select
                                            {...field}
                                            className={`form-select ${
                                              styles.label
                                            } ${
                                              errors.selectedSexId
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                            onChange={(e) => {
                                              field.onChange(e); // อัปเดต RHF
                                              setSelectedSexId(
                                                Number(e.target.value)
                                              ); // ถ้าคุณยังใช้ state แยกอยู่
                                            }}
                                          >
                                            <option value="">เลือกเพศ</option>
                                            {selectedCustomer.SEX.map(
                                              (sex: any) => (
                                                <option
                                                  key={sex.SEXID}
                                                  value={sex.SEXID}
                                                >
                                                  {sex.SEXNAME}
                                                </option>
                                              )
                                            )}
                                          </select>
                                          {errors.selectedSexId && (
                                            <div
                                              className={`invalid-feedback ${styles.label}`}
                                            >
                                              {errors.selectedSexId.message}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="row mb-6 mt-6">
                                <div className="col-lg-6 my-3">
                                  <label className={`${styles.label} `}>
                                    เบอร์ที่ติดต่อได้ 1
                                  </label>
                                  <Controller
                                    name="telNo"
                                    control={control}
                                    render={({ field }) => (
                                      <input
                                        {...field}
                                        className={`${
                                          styles.label
                                        } form-control ${
                                          errors.telNo ? "is-invalid" : ""
                                        }`}
                                        value={(mobile || "").replace(/-/g, "")}
                                        maxLength={10}
                                        onChange={(e) => {
                                          field.onChange(e.target.value);
                                          setMobile(e.target.value);
                                          trigger("telNo");
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        onBlur={field.onBlur}
                                        ref={field.ref}
                                      />
                                    )}
                                  />
                                  {errors.telNo && (
                                    <p
                                      className={`text-danger ${styles.label}`}
                                    >
                                      {errors.telNo.message}
                                    </p>
                                  )}
                                </div>
                                <div className="col-lg-6 my-3">
                                  <label className={`${styles.label}`}>
                                    เบอร์ที่ติดต่อได้ 2
                                  </label>
                                  <input
                                    value={(phone || "").replace(/-/g, "")}
                                    onChange={(e) => setPhone(e.target.value)}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className={`form-control ${styles.label}`}
                                    maxLength={10}
                                  />
                                </div>
                              </div>

                              <div className="row mb-6">
                                <div className="col-lg-6 my-3">
                                  <label className={`${styles.label}`}>
                                    เบอร์ที่ทำงาน
                                  </label>
                                  <input
                                    value={(workPhone || "").replace(/-/g, "")}
                                    onChange={(e) =>
                                      setWorkPhone(e.target.value)
                                    }
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className={`form-control ${styles.label}`}
                                    maxLength={10}
                                  />
                                </div>
                                <div className="col-lg-6 my-3">
                                  <label className={`${styles.label}`}>
                                    อีเมล์
                                  </label>
                                  <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                      <input
                                        {...field}
                                        className={`${
                                          styles.label
                                        } form-control ${
                                          errors.email ? "is-invalid" : ""
                                        }`}
                                        value={email}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          setEmail(e.target.value);
                                          trigger("email");
                                        }}
                                        type="text"
                                      />
                                    )}
                                  />
                                  {errors.email && (
                                    <p
                                      className={`text-danger ${styles.label}`}
                                    >
                                      {errors.email.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </>
                          )}

                          {/* Start กรณีประเภทลูกค้าเป็น นิติบุคคล */}
                          {selectedCustomerType == "1" && (
                            <>
                              <div className="">
                                <div className="row mb-6">
                                  <div className="col-lg-6 mb-3">
                                    <Controller
                                      name="selectedCustomerType"
                                      control={control}
                                      render={({ field }) => (
                                        <div className="mb-3">
                                          <label
                                            className={`${styles.label} ${styles.required}`}
                                          >
                                            ประเภทลูกค้า
                                          </label>
                                          <select
                                            {...field}
                                            className={`form-select ${
                                              styles.label
                                            } ${
                                              errors.selectedCustomerType
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                            onChange={(e) => {
                                              field.onChange(e); // อัปเดต RHF
                                              setsSelectedCustomerType(
                                                e.target.value
                                              ); // ถ้าคุณยังใช้ state แยกอยู่
                                            }}
                                          >
                                            <option value="">
                                              เลือกประเภทลูกค้า
                                            </option>
                                            {customerTypes.map((ct) => (
                                              <option
                                                key={ct.CUSTOMERTYPE}
                                                value={ct.CUSTOMERTYPE}
                                              >
                                                {ct.CUSTOMERTYPENAME}
                                              </option>
                                            ))}
                                          </select>
                                          {errors.selectedCustomerType && (
                                            <div
                                              className={`invalid-feedback ${styles.label}`}
                                            >
                                              {
                                                errors.selectedCustomerType
                                                  .message
                                              }
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    />
                                  </div>

                                  <div className="col-lg-6">
                                    <label
                                      className={`form-label required ${styles.label}`}
                                    >
                                      ชื่อบริษัท
                                    </label>
                                    {/* <input
                                                                    type="text"
                                                                    className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                                                    value={fullName}
                                                                    onChange={e => setFullName(e.target.value)}
                                                                /> */}
                                    <Controller
                                      name="fullName"
                                      control={control}
                                      render={({ field }) => (
                                        <>
                                          <input
                                            {...field}
                                            type="text"
                                            className={`form-control ${
                                              styles.label
                                            } ${
                                              errors.fullName
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                            onChange={(e) => {
                                              field.onChange(e);
                                              setFullName(e.target.value);
                                            }}
                                          />
                                          {errors.fullName && (
                                            <p
                                              className={`text-danger ${styles.label}`}
                                            >
                                              {errors.fullName.message}
                                            </p>
                                          )}
                                        </>
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="">
                                <div className="row mb-6">
                                  <div className="col-lg-4">
                                    {/* <label className={`form-label ${styles.required} ${styles.label}`}>เลขประจำตัวผู้เสียภาษี</label>
                                                                <Controller
                                                                    name="idCard"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <input
                                                                            {...field}
                                                                            className={`form-control ${styles.label} ${errors.idCard ? "is-invalid" : ""}`}
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
                                                                {errors.idCard && <p className="text-danger">{errors.idCard.message}</p>} */}
                                    <label
                                      className={`form-label ${styles.required} ${styles.label}`}
                                    >
                                      เลขประจำตัวผู้เสียภาษี
                                    </label>
                                    <Controller
                                      name="idCard"
                                      control={control}
                                      render={({ field }) => (
                                        <div
                                          className={`input-group ${styles.customInputGroup}`}
                                        >
                                          <input
                                            {...field}
                                            className={`form-control ${
                                              styles.label
                                            } ${
                                              errors.idCard ? "is-invalid" : ""
                                            }`}
                                            value={idCard}
                                            maxLength={13}
                                            onKeyDown={(e) => {
                                              if (
                                                e.key === " " ||
                                                e.key === "Tab"
                                              )
                                                e.preventDefault();
                                            }}
                                            onPaste={(e) => {
                                              const cleaned = e.clipboardData
                                                .getData("Text")
                                                .replace(/\s+/g, "");
                                              e.preventDefault();
                                              field.onChange(cleaned);
                                              setIdCard(cleaned);
                                              trigger("idCard");
                                            }}
                                            onChange={(e) => {
                                              const cleaned =
                                                e.target.value.replace(
                                                  /\s+/g,
                                                  ""
                                                );
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
                                              style={{ cursor: "pointer" }}
                                              onClick={() =>
                                                setShowScanner(true)
                                              }
                                            >
                                              <FontAwesomeIcon
                                                icon={faBarcode}
                                              />
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    />
                                    {errors.idCard && (
                                      <p
                                        className={`text-danger ${styles.label}`}
                                      >
                                        {errors.idCard.message}
                                      </p>
                                    )}
                                  </div>
                                  <div className="col-lg-4 mb-3">
                                    {/* <select
                                                                    className={`form-select ${styles.label}`}
                                                                    onChange={(e) => setSelectedPrefixId(Number(e.target.value))}
                                                                    value={selectedPrefixId}
                                                                    disabled={!selectedCustomerType}
                                                                >
                                                                    <option value=''>เลือกคำนำหน้า...</option>
                                                                    {selectedCustomer.PREFIX.map((prefix: any) => (
                                                                        <option key={prefix.PREFIXID} value={prefix.PREFIXID}>{prefix.PREFIXNAME}</option>
                                                                    ))}
                                                                </select> */}
                                    <Controller
                                      name="selectedPrefixId"
                                      control={control}
                                      render={({ field }) => (
                                        <div className="mb-3">
                                          <label
                                            className={`${styles.label} ${styles.required}`}
                                          >
                                            คำนำหน้าชื่อ
                                          </label>
                                          <select
                                            {...field}
                                            className={`form-select ${
                                              styles.label
                                            } ${
                                              errors.selectedPrefixId
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                            onChange={(e) => {
                                              field.onChange(e); // อัปเดต RHF
                                              setSelectedPrefixId(
                                                Number(e.target.value)
                                              ); // ถ้าคุณยังใช้ state แยกอยู่
                                            }}
                                          >
                                            <option value="">
                                              เลือกคำนำหน้าชื่อ
                                            </option>
                                            {selectedCustomer.PREFIX.map(
                                              (prefix: any) => (
                                                <option
                                                  key={prefix.PREFIXID}
                                                  value={prefix.PREFIXID}
                                                >
                                                  {prefix.PREFIXNAME}
                                                </option>
                                              )
                                            )}
                                          </select>
                                          {errors.selectedPrefixId && (
                                            <div
                                              className={`invalid-feedback ${styles.label}`}
                                            >
                                              {errors.selectedPrefixId.message}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    />
                                  </div>
                                  <div className="col-lg-4 mb-3">
                                    <label
                                      className={`form-labe ${styles.label}`}
                                    >
                                      กรรมการผู้มีอำนาจ
                                    </label>
                                    <input
                                      value={nameMD}
                                      onChange={(e) =>
                                        setNameMD(e.target.value)
                                      }
                                      type="text"
                                      className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                    />
                                  </div>
                                </div>

                                <div className="">
                                  <div className="row mb-6 mt-6">
                                    <div className="col-lg-6 mb-3">
                                      <label
                                        className={`form-labe required ${styles.label}`}
                                      >
                                        เบอร์ที่ติดต่อได้ 1
                                      </label>
                                      {/* <Controller
                                                                        name="telNo"
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <input
                                                                                {...field}
                                                                                className={`form-control ${styles.label} ${errors.telNo ? "is-invalid" : ""}`}
                                                                                value={(mobile || '').replace(/-/g, '')}
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
                                                                    {errors.telNo && <p className="text-danger">{errors.telNo.message}</p>} */}
                                      <Controller
                                        name="telNo"
                                        control={control}
                                        render={({ field }) => (
                                          <input
                                            {...field}
                                            className={`${
                                              styles.label
                                            } form-control ${
                                              errors.telNo ? "is-invalid" : ""
                                            }`}
                                            value={(mobile || "").replace(
                                              /-/g,
                                              ""
                                            )}
                                            maxLength={10}
                                            onChange={(e) => {
                                              field.onChange(e.target.value);
                                              setMobile(e.target.value);
                                              trigger("telNo");
                                            }}
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            onBlur={field.onBlur}
                                            ref={field.ref}
                                          />
                                        )}
                                      />
                                      {errors.telNo && (
                                        <p
                                          className={`text-danger ${styles.label}`}
                                        >
                                          {errors.telNo.message}
                                        </p>
                                      )}
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                      <label
                                        className={`form-labe ${styles.label}`}
                                      >
                                        เบอร์ที่ติดต่อได้ 2
                                      </label>
                                      <input
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={(phone || "").replace(/-/g, "")}
                                        type="text"
                                        className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                        onChange={(e) =>
                                          setPhone(e.target.value)
                                        }
                                        maxLength={10}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="">
                                  <div className="row mb-6">
                                    <div className="col-lg-6 mb-3">
                                      <label
                                        className={`form-labe ${styles.label}`}
                                      >
                                        เบอร์ที่ทำงาน
                                      </label>
                                      <input
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={(workPhone || "").replace(
                                          /-/g,
                                          ""
                                        )}
                                        type="text"
                                        className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                        onChange={(e) =>
                                          setWorkPhone(e.target.value)
                                        }
                                        maxLength={10}
                                      />
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                      <label
                                        className={`form-labe ${styles.label}`}
                                      >
                                        อีเมล์
                                      </label>
                                      <input
                                        value={email}
                                        onChange={(e) =>
                                          setEmail(e.target.value)
                                        }
                                        type="text"
                                        className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                      />
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
              </div>
              {/* End Card */}

              <>
                <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
                  <button
                    onClick={() =>
                      navigate("/sale/update/updateSalesEmployee", {
                        state: {
                          ...matchedItem,
                          fromDiscount: true,
                        },
                      })
                    }
                    className={`${styles.btnSecondary}`}
                    type="button"
                  >
                    แก้ไขพนักงานขาย
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    className={`${styles.btnPrimary}`}
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
                    className={`${styles.btnSecondary}`}
                    onClick={() =>
                      navigate("/sale/update/updateSalesEmployee", {
                        state: {
                          ...matchedItem,
                          fromDiscount: true,
                        },
                      })
                    }
                    type="button"
                  >
                    แก้ไขพนักงานขาย
                  </button>
                  <button
                    className={`${styles.btnPrimary}`}
                    onClick={handleSubmit(onSubmit)}
                    type="button"
                  >
                    บันทึก
                  </button>
                </div>
              </>
            </form>
          </Content>
        </>
      )}

    </>
  );
};

export default SalesCreateCustCash;
