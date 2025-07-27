// import styles from '@/styles/style.module.css'
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { Content } from '../../../_metronic/layout/components/content';
// import { useAuth } from '../../modules/auth/core/Auth';

// import { useUUIDStore, useSaveProductStore } from '../../modules/stores/stepsStore';
// import { useSaveDiscountStore } from '../../modules/stores/stepsStore';

// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// interface TradeInBrand {
//     TRADEINBRANDID: string;
//     TRADEINBRANDNAME: string;
// }

// interface FreeGift {
//     GIFTID: string;
//     GIFTCODE: string;
//     GIFTNAME: string;
//     GIFTPRICE: number;
//     GIFTDESCRIPTION: string | null;
// }

// interface Package {
//     HASTRADEIN: number;
//     TOTALPRICE: number;
//     DISCOUNTPRICE: number;
//     SEQUENCE: number;
//     FREEGIFT: FreeGift[];
// }

// interface Product {
//     Package: Package[];
// }

// interface SalesEmployeePayload {
//     SALEEMPLOYEE: {
//         SaleEmp: string;
//         SaleCode: string;
//         FName: string;
//         LName: string;
//     };
//     ADVISER?: {
//         SaleEmp: string;
//         SaleCode: string;
//         FName: string;
//         LName: string;
//     };
//     INSTALLER?: {
//         SaleEmp: string;
//         SaleCode: string;
//         FName: string;
//         LName: string;
//     };
// }

// interface SaveDiscount {
//     TRADEIN: {
//         HASTRADEIN: number;
//         TRADEINBRANDID: number;
//         TRADEINBRANDNAME: string;
//         TRADEINMODEL: string;
//         TRADEINSERIAL: string;
//     };
//     DISCOUNTAMOUNT: number | null;
//     GIFT: {
//         GIFTID: number;
//         GIFTCODE: string;
//         GIFTNAME: string;
//         GIFTPRICE: number;
//         GIFTDESCRIPTION: string | null;
//     };
// }

// const SalesDiscount: React.FC = () => {
//     const navigate = useNavigate();
//     const MySwal = withReactContent(Swal);

//     const { auth } = useAuth();
//     const EmpId = auth?.data?.[0]?.EmpId || '';
//     const TeamSale = auth?.data?.[0]?.TeamSale || '';
//     const SaleCode = auth?.data?.[0]?.SaleCode || '';
//     const SupEmpId = auth?.data?.[0]?.SupEmp || '';
//     const SecEmpId = auth?.data?.[0]?.SecEmp || '';

//     const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
//     const TRADEINBRAND_URL = `${API_SALECONNEXT}/GetProduct/Tradeinbrand`;

//     const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//     const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

//     const API_URL_TSR = import.meta.env.VITE_APP_API_THIENSURAT;
//     const EMP_IN_TEAM_URL = `${API_URL_TSR}/Employee_Structure`;
//     const ADVISER_URL = `${API_URL_TSR}/Employee_Structure/Emp_All`;

//     const { REFNO } = useUUIDStore();
//     const { PRODUCT } = useSaveProductStore();
//     const { DISCOUNT, SETDISCOUNT } = useSaveDiscountStore();

//     const [tradeInBrand, setTradeInBrand] = useState<TradeInBrand[]>([]);
//     const [selectedTurnId, setSelectedTurnId] = useState<number>(0);
//     const [selectedTradeInBrandName, setSelectedTradeInBrandName] = useState<string>('');
//     const [tradeInModel, setTradeInModel] = useState<string>('');
//     const [tradeInSerial, setTradeInSerial] = useState<string>('');
//     const [selectedGiftId, setSelectedGiftId] = useState<number>(0);
//     const [isLoading, setIsLoading] = useState<boolean>(false);

//     const hasTradeIn = PRODUCT?.[0]?.Package?.[0]?.HASTRADEIN ?? 0;
//     const totalPrice = PRODUCT?.[0]?.Package?.[0]?.TOTALPRICE ?? 0;
//     const discountPrice = PRODUCT?.[0]?.Package?.[0]?.DISCOUNTPRICE ?? 0;
//     const sequence = PRODUCT?.[0]?.Package?.[0]?.SEQUENCE ?? 0;
//     const freeGift = PRODUCT?.[0]?.Package?.[0]?.FREEGIFT ?? [];

//     const [empInTeam, setEmpInTeam] = useState<any[]>([]);
//     const [adviserList, setAdviserList] = useState<any[]>([]);
//     const [installerList, setInstallerList] = useState<any[]>([]);

//     const [discountInput, setDiscountInput] = useState<number | null>(null);
//     const [discountValidationMessage, setDiscountValidationMessage] = useState<{
//         message: string;
//         type: "success" | "danger";
//     } | null>(null);
//     const [isDiscountValid, setIsDiscountValid] = useState<boolean>(true);

//     const handleDiscountChange = useCallback((value: string) => {
//         const inputNumber = Number(value.replace(/,/g, ""));

//         if (isNaN(inputNumber)) {
//             setDiscountValidationMessage({
//                 message: "กรุณากรอกตัวเลขที่ถูกต้อง",
//                 type: "danger",
//             });
//             setIsDiscountValid(false);
//             return;
//         }

//         setDiscountInput(inputNumber);
//         validateDiscount(inputNumber);
//     }, []);

//     const validateDiscount = useCallback((inputNumber: number) => {
//         if (discountPrice === 0) {
//             setDiscountValidationMessage(null);
//             setIsDiscountValid(true);
//             return;
//         }

//         if (discountPrice !== undefined && sequence !== undefined) {
//             let validationMessage = "";

//             if (inputNumber <= discountPrice) {
//                 if (inputNumber % sequence === 0) {
//                     validationMessage = "";
//                     setIsDiscountValid(true);
//                     setDiscountValidationMessage({
//                         message: validationMessage,
//                         type: "success",
//                     });
//                 } else {
//                     validationMessage = `กรอกส่วนลดผิด ต้องลดหรือเพิ่มได้ทีละ ${sequence} บาท`;
//                     setIsDiscountValid(false);
//                     setDiscountValidationMessage({
//                         message: validationMessage,
//                         type: "danger",
//                     });
//                 }
//             } else {
//                 validationMessage = `ส่วนลดต้องไม่เกิน ${discountPrice} บาท`;
//                 setIsDiscountValid(false);
//                 setDiscountValidationMessage({
//                     message: validationMessage,
//                     type: "danger",
//                 });
//             }
//         }
//     }, [discountPrice, sequence]);

//     const SaveDiscountData = useMemo(() => {
//         if (!PRODUCT?.[0]?.Package?.[0]) {
//             return [];
//         }

//         return [
//             {
//                 TRADEIN: {
//                     HASTRADEIN: PRODUCT[0].Package[0].HASTRADEIN,
//                     TRADEINBRANDID: selectedTurnId,
//                     TRADEINBRANDNAME: selectedTradeInBrandName,
//                     TRADEINMODEL: tradeInModel,
//                     TRADEINSERIAL: tradeInSerial,
//                 },
//                 DISCOUNTAMOUNT: discountInput,
//                 GIFT: {
//                     GIFTID: selectedGiftId,
//                     GIFTCODE: freeGift[selectedGiftId - 1]?.GIFTCODE || '',
//                     GIFTNAME: freeGift[selectedGiftId - 1]?.GIFTNAME || '',
//                     GIFTPRICE: freeGift[selectedGiftId - 1]?.GIFTPRICE ?? 0,
//                     GIFTDESCRIPTION: freeGift[selectedGiftId - 1]?.GIFTDESCRIPTION || null,
//                 },
//             },
//         ] as SaveDiscount[];
//     }, [PRODUCT, selectedTurnId, tradeInModel, tradeInSerial, discountInput, selectedGiftId, selectedTradeInBrandName, freeGift]);

//     useEffect(() => {
//         if (JSON.stringify(SaveDiscountData) !== JSON.stringify(DISCOUNT)) {
//             SETDISCOUNT(SaveDiscountData);
//         }
//     }, [SaveDiscountData, DISCOUNT, SETDISCOUNT]);

//     const getData = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             const response = await axios.get(TRADEINBRAND_URL, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             });
//             const data = Array.isArray(response.data.data) ? response.data.data : [];
//             setTradeInBrand(data);
//         } catch (error) {
//             MySwal.fire({
//                 icon: 'error',
//                 title: 'เกิดข้อผิดพลาด!',
//                 text: 'ไม่สามารถดึงข้อมูลเครื่องเทิร์นได้ กรุณาลองใหม่อีกครั้ง',
//                 confirmButtonText: 'ตกลง',
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [TRADEINBRAND_URL]);

//     const getEmpInTeam = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             const formData = new FormData();
//             formData.append('EmpId', EmpId);

//             const response = await axios.post(
//                 EMP_IN_TEAM_URL,
//                 formData,
//                 {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 }
//             );
//             const data = Array.isArray(response.data.data) ? response.data.data : [];
//             setEmpInTeam(data);
//         } catch (error) {
//             MySwal.fire({
//                 icon: 'error',
//                 title: 'เกิดข้อผิดพลาด!',
//                 text: 'ไม่สามารถดึงข้อมูลพนักงานในทีมได้ กรุณาลองใหม่อีกครั้ง',
//                 confirmButtonText: 'ตกลง',
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [EmpId, EMP_IN_TEAM_URL]);

//     const getAdviserData = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             const formData = new FormData();
//             formData.append('EmpId', EmpId);

//             const response = await axios.post(ADVISER_URL, formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//             });
//             const data = Array.isArray(response.data.data) ? response.data.data : [];
//             setAdviserList(data);
//         } catch (error) {
//             MySwal.fire({
//                 icon: 'error',
//                 title: 'เกิดข้อผิดพลาด!',
//                 text: 'ไม่สามารถดึงข้อมูลผู้แนะนำได้ กรุณาลองใหม่อีกครั้ง',
//                 confirmButtonText: 'ตกลง',
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [EmpId, ADVISER_URL]);

//     const getInstallerData = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             const formData = new FormData();
//             formData.append('EmpId', EmpId);

//             const response = await axios.post(ADVISER_URL, formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//             });
//             const data = Array.isArray(response.data.data) ? response.data.data : [];
//             setInstallerList(data);
//         } catch (error) {
//             MySwal.fire({
//                 icon: 'error',
//                 title: 'เกิดข้อผิดพลาด!',
//                 text: 'ไม่สามารถดึงข้อมูลช่างติดตั้งได้ กรุณาลองใหม่อีกครั้ง',
//                 confirmButtonText: 'ตกลง',
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [EmpId, ADVISER_URL]);

//     useEffect(() => {
//         getData();
//         getEmpInTeam();
//         getAdviserData();
//         getInstallerData();
//     }, [getData, getEmpInTeam, getAdviserData, getInstallerData]);

//     const handleTurnOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const value = Number(event.target.value);
//         setSelectedTurnId(value);
//     };

//     const handleTradeInModelChange = (event: any) => {
//         const value = event.target.value;
//         setTradeInModel(value);
//     };

//     const handleTradeInSerialChange = (event: any) => {
//         const value = event.target.value;
//         setTradeInSerial(value);
//     };

//     const handleGiftOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const value = Number(event.target.value);
//         setSelectedGiftId(value);
//     };

//     const handleNextClick = async () => {
//         try {
//             const empOptions = empInTeam.reduce((options, emp) => {
//                 const fullName = `${emp.FName} ${emp.LName}`;
//                 options[emp.SaleEmp] = fullName;
//                 return options;
//             }, {});

//             const { value: formValues } = await MySwal.fire({
//                 title: 'เลือกพนักงานขาย',
//                 html: `
//                   <select id="swal-employee" class="swal2-input" style="width: 100%; font-size:1.5rem;" margin-bottom: 1rem;">
//                     <option value="">เลือกพนักงานขาย</option>
//                     ${Object.entries(empOptions)
//                         .map(([key, value]) => `<option value="${key}">${value}</option>`)
//                         .join('')}
//                   </select>
//                   <select id="swal-adviser" class="swal2-input" style="width: 100%; font-size:1.5rem;" margin-bottom: 1rem;">
//                     <option value="">เลือกผู้แนะนำ (ถ้ามี)</option>
//                     ${adviserList
//                         .map(emp => `<option value="${emp.SaleEmp}">${emp.FName} ${emp.LName}</option>`)
//                         .join('')}
//                   </select>
//                      <select id="swal-installer" class="swal2-input" style="width: 100%; font-size:1.5rem;" margin-bottom: 1rem;">
//                     <option value="">เลือกช่างติดตั้ง (ถ้ามี)</option>
//                     ${installerList
//                         .map(emp => `<option value="${emp.SaleEmp}">${emp.FName} ${emp.LName}</option>`)
//                         .join('')}
//                   </select>
//                 `,
//                 focusConfirm: false,
//                 showCancelButton: true,
//                 confirmButtonText: 'ตกลง',
//                 cancelButtonText: 'ยกเลิก',
//                 customClass: {
//                     confirmButton: styles.fontSize,
//                     cancelButton: styles.fontSize
//                 },
//                 preConfirm: () => {
//                     const employee = (document.getElementById('swal-employee') as HTMLSelectElement).value;
//                     const adviser = (document.getElementById('swal-adviser') as HTMLSelectElement).value;
//                     const installer = (document.getElementById('swal-installer') as HTMLSelectElement).value;
//                     if (!employee) {
//                         Swal.showValidationMessage('กรุณาเลือกพนักงานขาย');
//                     }
//                     return { employee, adviser, installer };
//                 },
//             });

//             if (formValues && formValues.employee) {
//                 const selectedEmployee = empInTeam.find((emp) => emp.SaleEmp === formValues.employee);

//                 const payload: {
//                     SALEEMPLOYEE: any;
//                     ADVISER?: {
//                         SaleEmp: string;
//                         SaleCode: string;
//                     };
//                     INSTALLER?: {
//                         SaleEmp: string;
//                         SaleCode: string;
//                     };
//                 } = {
//                     SALEEMPLOYEE: selectedEmployee,
//                 };

//                 if (formValues.adviser) {
//                     const selectedAdviser = adviserList.find((emp) => emp.SaleEmp === formValues.adviser);
//                     if (selectedAdviser) {
//                         payload.ADVISER = selectedAdviser;
//                     }
//                 }

//                 if (formValues.installer) {
//                     const selectedInstaller = installerList.find((emp) => emp.SaleEmp === formValues.installer);
//                     if (selectedInstaller) {
//                         payload.INSTALLER = selectedInstaller;
//                     }
//                 }

//                 await axios.post(
//                     UPDATECONTACT,
//                     {
//                         REFNO,
//                         EMPID: EmpId,
//                         TEAMSALE: TeamSale,
//                         FIELD: 'SALEEMPLOYEE',
//                         DATA: [payload],
//                     },
//                     {
//                         headers: { 'Content-Type': 'application/json' },
//                     }
//                 );

//                 await MySwal.fire({
//                     icon: 'success',
//                     title: 'บันทึกสำเร็จ!',
//                     text: `ข้อมูลพนักงานขาย ถูกบันทึกเรียบร้อยแล้ว`,
//                     timer: 2000,
//                     showConfirmButton: false,
//                 });

//                 const discountUpdateResponse = await axios.post(
//                     UPDATECONTACT,
//                     {
//                         REFNO,
//                         EMPID: EmpId,
//                         TEAMSALE: TeamSale,
//                         SALECODE: SaleCode,
//                         SUPEMPID: SupEmpId,
//                         SECEMPID: SecEmpId,
//                         FIELD: 'DISCOUNT',
//                         DATA: SaveDiscountData,
//                     },
//                     {
//                         headers: { 'Content-Type': 'application/json' },
//                     }
//                 );

//                 if (discountUpdateResponse.status === 200) {
//                     console.log('ส่วนลดบันทึกสำเร็จ:', discountUpdateResponse.data);
//                 } else {
//                     console.log('เกิดข้อผิดพลาดในการบันทึกส่วนลด:', discountUpdateResponse.status);
//                 }

//                 await MySwal.fire({
//                     icon: 'success',
//                     title: 'บันทึกสำเร็จ!',
//                     text: 'ข้อมูลส่วนลดถูกบันทึกเรียบร้อยแล้ว',
//                     timer: 2000,
//                     showConfirmButton: false,
//                 });

//                 navigate('/sale/createcust');
//             }
//         } catch (error) {
//             console.error('Error fetching UPDATECONTACT:', error);
//             MySwal.fire({
//                 icon: 'error',
//                 title: 'เกิดข้อผิดพลาด!',
//                 text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
//                 confirmButtonText: 'ตกลง',
//             });
//         }
//     };

//     const finalPrice = Math.max(0, totalPrice - (discountInput ?? 0));

//     return (
//         <>
//             <Content>
//                 <div className='d-flex justify-content-between align-items-center my-5'>
//                     <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
//                         data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//                         className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
//                         <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//                             <li className={`${styles.titlePage}`}>เครื่องเทิร์น / ส่วนลด / ของแถม</li>
//                         </ul>
//                     </div>
//                 </div>
//                 <p className={`${styles.fontSize}`}>เลขที่ขาย:</p><p className={`${styles.titlePage}`}>{REFNO}</p>

//                 <div className='accordion mb-10' id='kt_accordion_1'>
//                     {hasTradeIn === 1 && (
//                         <div className='accordion-item mb-10'>
//                             <h2 className='accordion-header' id='kt_accordion_1_header_1'>
//                                 <h3
//                                     className={`accordion-button collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7 ${styles.fontSize}`}
//                                     data-bs-toggle='collapse'
//                                     data-bs-target='#kt_accordion_1_body_1'
//                                     aria-expanded='true'
//                                     aria-controls='kt_accordion_1_body_1'
//                                     style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
//                                 >
//                                     เครื่องเทิร์น
//                                 </h3>
//                             </h2>
//                             <div
//                                 id='kt_accordion_1_body_1'
//                                 className='accordion-collapse collapse show'
//                                 aria-labelledby='kt_accordion_1_header_1'
//                                 data-bs-parent='#kt_accordion_1'
//                             >
//                                 <div className='accordion-body'>
//                                     <form noValidate className='form'>
//                                         <div className='card-body px-lg-9 px-1'>
//                                             <div className='row mb-6'>
//                                                 <div className='col-lg-4 mb-3'>
//                                                     <label className={`form-label ${styles.fontSize}`}>เครื่องเทิร์น</label>
//                                                     <select
//                                                         className={`form-select ${styles.fontSize}`}
//                                                         onChange={handleTurnOptionChange}
//                                                     >
//                                                         <option value=''>เลือกเครื่องเทิร์น...</option>
//                                                         {tradeInBrand.map((item, index) => (
//                                                             <option key={index} value={item.TRADEINBRANDID}>
//                                                                 {item.TRADEINBRANDNAME}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                                 <div className='col-lg-4 mb-3'>
//                                                     <label className={`form-label ${styles.fontSize}`}>รุ่น</label>
//                                                     <input
//                                                         type='text'
//                                                         className={`form-control mb-3 mb-lg-0 ${styles.fontSize}`}
//                                                         onChange={handleTradeInModelChange}
//                                                         value={tradeInModel}
//                                                     />
//                                                 </div>
//                                                 <div className='col-lg-4 mb-3'>
//                                                     <label className={`form-label ${styles.fontSize}`}>หมายเลขเครื่อง</label>
//                                                     <input
//                                                         type='text'
//                                                         className={`form-control mb-3 mb-lg-0 ${styles.fontSize}`}
//                                                         onChange={handleTradeInSerialChange}
//                                                         value={tradeInSerial}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {
//                         (
//                             (!Array.isArray(discountPrice) && discountPrice !== 0 && discountPrice !== null) ||
//                             (Array.isArray(discountPrice) && discountPrice.length > 0)
//                         ) && (
//                             <div className='accordion-item mb-10'>
//                                 <h2 className='accordion-header' id='kt_accordion_2_header_2'>
//                                     <h3
//                                         className={`accordion-button collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7 ${styles.fontSize}`}
//                                         data-bs-toggle='collapse'
//                                         data-bs-target='#kt_accordion_2_body_2'
//                                         aria-expanded='true'
//                                         aria-controls='kt_accordion_2_body_2'
//                                         style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
//                                     >
//                                         ส่วนลด
//                                     </h3>
//                                 </h2>
//                                 <div
//                                     id='kt_accordion_2_body_2'
//                                     className='accordion-collapse collapse show'
//                                     aria-labelledby='kt_accordion_2_header_2'
//                                     data-bs-parent='#kt_accordion_2'
//                                 >
//                                     <div className='accordion-body'>
//                                         <form noValidate className='form'>
//                                             <div className='card-body px-lg-9 px-1'>
//                                                 <div className='row mb-6'>
//                                                     <div className='col-lg-6 mb-3'>
//                                                         <label className={`form-label ${styles.fontSize}`}>ราคา</label>
//                                                         <p className={`form-control mb-3 mb-lg-0 ${styles.fontSize}`}>
//                                                             {(finalPrice).toLocaleString()}
//                                                         </p>
//                                                     </div>
//                                                     <div className='col-lg-6 mb-3'>
//                                                         <label className={`form-label ${styles.fontSize}`}>ส่วนลด</label>
//                                                         <div className='d-flex align-items-center'>
//                                                             <input
//                                                                 type="text"
//                                                                 className={`form-control ${styles.fontSize}`}
//                                                                 onChange={(e) => handleDiscountChange(e.target.value)}
//                                                             />
//                                                         </div>
//                                                         {discountValidationMessage && (
//                                                             <div
//                                                                 className={`${styles.fontSize} mt-2 text-${discountValidationMessage.type}`}
//                                                             >
//                                                                 {discountValidationMessage.message}
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                     {freeGift.length > 0 && (
//                         <div className='accordion-item mb-10'>
//                             <h2 className='accordion-header' id='kt_accordion_3_header_3'>
//                                 <h3
//                                     className={`accordion-button collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7 ${styles.fontSize}`}
//                                     data-bs-toggle='collapse'
//                                     data-bs-target='#kt_accordion_3_body_3'
//                                     aria-expanded='true'
//                                     aria-controls='kt_accordion_3_body_3'
//                                     style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
//                                 >
//                                     ของแถม
//                                 </h3>
//                             </h2>
//                             <div
//                                 id='kt_accordion_3_body_3'
//                                 className='accordion-collapse collapse show'
//                                 aria-labelledby='kt_accordion_3_header_3'
//                                 data-bs-parent='#kt_accordion_3'
//                             >
//                                 <div className='accordion-body'>
//                                     <form noValidate className='form'>
//                                         <div className='card-body px-lg-9 px-1'>
//                                             <div className='row mb-6'>
//                                                 <div className='col-lg-12 mb-3'>
//                                                     <label className={`form-label ${styles.fontSize}`}>ของแถม</label>
//                                                     <select
//                                                         className={`form-select ${styles.fontSize}`}
//                                                         onChange={handleGiftOptionChange}
//                                                     >
//                                                         <option value=''>เลือกของแถม...</option>
//                                                         {freeGift.map((item, index) => (
//                                                             <option key={index} value={item.GIFTID}>
//                                                                 {item.GIFTNAME}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {
//                     (hasTradeIn !== 1) &&
//                     (
//                         Array.isArray(discountPrice)
//                             ? discountPrice.length === 0
//                             : discountPrice === 0
//                     ) &&
//                     (freeGift.length === 0) && (
//                         <div className='text-center my-20'>
//                             <h5 className={`${styles.fontSize}`}>ไม่มี เครื่องเทิร์น / ส่วนลด / ของแถม</h5>
//                         </div>
//                     )
//                 }

//                 <div className='d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10'>
//                     <button
//                         className={`${styles.btnSecondary}`}
//                         onClick={() => navigate('/sale/package')}
//                     >
//                         ย้อนกลับ
//                     </button>
//                     <button
//                         className={`${styles.btnPrimary}`}
//                         onClick={handleNextClick}
//                     >
//                         บันทึก
//                     </button>
//                 </div>

//                 <div
//                     className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
//                     style={{
//                         position: "fixed",
//                         bottom: 0,
//                         left: 0,
//                         right: 0,
//                         zIndex: 1050,
//                     }}
//                 >
//                     <button
//                         className={`${styles.btnSecondary}`}
//                         onClick={() => navigate('/sale/package')}
//                     >
//                         ย้อนกลับ
//                     </button>
//                     <button
//                         className={`${styles.btnPrimary}`}
//                         onClick={handleNextClick}
//                     >
//                         บันทึก
//                     </button>
//                 </div>

//             </Content>
//         </>
//     )
// }

// export default SalesDiscount;

// import styles from '@/styles/style.module.css'
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { Content } from '../../../_metronic/layout/components/content';
// import { useAuth } from '../../modules/auth/core/Auth';

// import { useUUIDStore, useSaveProductStore } from '../../modules/stores/stepsStore';
// import { useSaveDiscountStore } from '../../modules/stores/stepsStore';

// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// interface TradeInBrand {
//     TRADEINBRANDID: string;
//     TRADEINBRANDNAME: string;
// }

// interface FreeGift {
//     GIFTID: string;
//     GIFTCODE: string;
//     GIFTNAME: string;
//     GIFTPRICE: number;
//     GIFTDESCRIPTION: string | null;
// }

// interface Package {
//     HASTRADEIN: number;
//     TOTALPRICE: number;
//     DISCOUNTPRICE: number;
//     SEQUENCE: number;
//     FREEGIFT: FreeGift[];
// }

// interface Product {
//     Package: Package[];
// }

// interface SalesEmployeePayload {
//     SALEEMPLOYEE: {
//         SaleEmp: string;
//         SaleCode: string;
//         FName: string;
//         LName: string;
//     };
//     ADVISER?: {
//         SaleEmp: string;
//         SaleCode: string;
//         FName: string;
//         LName: string;
//     };
//     INSTALLER?: {
//         SaleEmp: string;
//         SaleCode: string;
//         FName: string;
//         LName: string;
//     };
// }

// interface SaveDiscount {
//     TRADEIN: {
//         HASTRADEIN: number;
//         TRADEINBRANDID: number;
//         TRADEINBRANDNAME: string;
//         TRADEINMODEL: string;
//         TRADEINSERIAL: string;
//     };
//     DISCOUNTAMOUNT: number | null;
//     GIFT: {
//         GIFTID: number;
//         GIFTCODE: string;
//         GIFTNAME: string;
//         GIFTPRICE: number;
//         GIFTDESCRIPTION: string | null;
//     };
// }

// const SalesDiscount: React.FC = () => {
//     const navigate = useNavigate();
//     const MySwal = withReactContent(Swal);

//     const { auth } = useAuth();
//     const EmpId = auth?.data?.[0]?.EmpId || '';
//     const TeamSale = auth?.data?.[0]?.TeamSale || '';
//     const SaleCode = auth?.data?.[0]?.SaleCode || '';
//     const SupEmpId = auth?.data?.[0]?.SupEmp || '';
//     const SecEmpId = auth?.data?.[0]?.SecEmp || '';

//     const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
//     const TRADEINBRAND_URL = `${API_SALECONNEXT}/GetProduct/Tradeinbrand`;

//     const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//     const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
//     const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;

//     const API_URL_TSR = import.meta.env.VITE_APP_API_THIENSURAT;
//     const EMP_IN_TEAM_URL = `${API_URL_TSR}/Employee_Structure`;
//     const ADVISER_URL = `${API_URL_TSR}/Employee_Structure/Emp_All`;

//     const { REFNO } = useUUIDStore();
//     const { PRODUCT } = useSaveProductStore();
//     const { DISCOUNT, SETDISCOUNT } = useSaveDiscountStore();

//     const [tradeInBrand, setTradeInBrand] = useState<TradeInBrand[]>([]);
//     const [selectedTurnId, setSelectedTurnId] = useState<number>(0);
//     const [selectedTradeInBrandName, setSelectedTradeInBrandName] = useState<string>('');
//     const [tradeInModel, setTradeInModel] = useState<string>('');
//     const [tradeInSerial, setTradeInSerial] = useState<string>('');
//     const [selectedGiftId, setSelectedGiftId] = useState<number>(0);
//     const [isLoading, setIsLoading] = useState<boolean>(false);

//     const hasTradeIn = PRODUCT?.[0]?.Package?.[0]?.HASTRADEIN ?? 0;
//     const totalPrice = PRODUCT?.[0]?.Package?.[0]?.TOTALPRICE ?? 0;
//     const discountPrice = PRODUCT?.[0]?.Package?.[0]?.DISCOUNTPRICE ?? 0;
//     const sequence = PRODUCT?.[0]?.Package?.[0]?.SEQUENCE ?? 0;
//     const freeGift = PRODUCT?.[0]?.Package?.[0]?.FREEGIFT ?? [];

//     const [empInTeam, setEmpInTeam] = useState<any[]>([]);
//     const [adviserList, setAdviserList] = useState<any[]>([]);
//     const [installerList, setInstallerList] = useState<any[]>([]);

//     const [discountInput, setDiscountInput] = useState<number | null>(null);
//     const [discountValidationMessage, setDiscountValidationMessage] = useState<{
//         message: string;
//         type: "success" | "danger";
//     } | null>(null);
//     const [isDiscountValid, setIsDiscountValid] = useState<boolean>(true);

//     const handleDiscountChange = useCallback((value: string) => {
//         const inputNumber = Number(value.replace(/,/g, ""));

//         if (isNaN(inputNumber)) {
//             setDiscountValidationMessage({
//                 message: "กรุณากรอกตัวเลขที่ถูกต้อง",
//                 type: "danger",
//             });
//             setIsDiscountValid(false);
//             return;
//         }

//         setDiscountInput(inputNumber);
//         validateDiscount(inputNumber);
//     }, []);

//     const validateDiscount = useCallback((inputNumber: number) => {
//         if (discountPrice === 0) {
//             setDiscountValidationMessage(null);
//             setIsDiscountValid(true);
//             return;
//         }

//         if (discountPrice !== undefined && sequence !== undefined) {
//             let validationMessage = "";

//             if (inputNumber <= discountPrice) {
//                 if (inputNumber % sequence === 0) {
//                     validationMessage = "";
//                     setIsDiscountValid(true);
//                     setDiscountValidationMessage({
//                         message: validationMessage,
//                         type: "success",
//                     });
//                 } else {
//                     validationMessage = `กรอกส่วนลดผิด ต้องลดหรือเพิ่มได้ทีละ ${sequence} บาท`;
//                     setIsDiscountValid(false);
//                     setDiscountValidationMessage({
//                         message: validationMessage,
//                         type: "danger",
//                     });
//                 }
//             } else {
//                 validationMessage = `ส่วนลดต้องไม่เกิน ${discountPrice} บาท`;
//                 setIsDiscountValid(false);
//                 setDiscountValidationMessage({
//                     message: validationMessage,
//                     type: "danger",
//                 });
//             }
//         }
//     }, [discountPrice, sequence]);

//     const SaveDiscountData = useMemo(() => {
//         if (!PRODUCT?.[0]?.Package?.[0]) {
//             return [];
//         }

//         return [
//             {
//                 TRADEIN: {
//                     HASTRADEIN: PRODUCT[0].Package[0].HASTRADEIN,
//                     TRADEINBRANDID: selectedTurnId,
//                     TRADEINBRANDNAME: selectedTradeInBrandName,
//                     TRADEINMODEL: tradeInModel,
//                     TRADEINSERIAL: tradeInSerial,
//                 },
//                 DISCOUNTAMOUNT: discountInput,
//                 GIFT: {
//                     GIFTID: selectedGiftId,
//                     GIFTCODE: freeGift[selectedGiftId - 1]?.GIFTCODE || '',
//                     GIFTNAME: freeGift[selectedGiftId - 1]?.GIFTNAME || '',
//                     GIFTPRICE: freeGift[selectedGiftId - 1]?.GIFTPRICE ?? 0,
//                     GIFTDESCRIPTION: freeGift[selectedGiftId - 1]?.GIFTDESCRIPTION || null,
//                 },
//             },
//         ] as SaveDiscount[];
//     }, [PRODUCT, selectedTurnId, tradeInModel, tradeInSerial, discountInput, selectedGiftId, selectedTradeInBrandName, freeGift]);

//     useEffect(() => {
//         if (JSON.stringify(SaveDiscountData) !== JSON.stringify(DISCOUNT)) {
//             SETDISCOUNT(SaveDiscountData);
//         }
//     }, [SaveDiscountData, DISCOUNT, SETDISCOUNT]);

//     // const getData = useCallback(async () => {
//     //     try {
//     //         setIsLoading(true);
//     //         const response = await axios.get(TRADEINBRAND_URL, {
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //             }
//     //         });
//     //         const data = Array.isArray(response.data.data) ? response.data.data : [];
//     //         setTradeInBrand(data);
//     //     } catch (error) {
//     //         MySwal.fire({
//     //             icon: 'error',
//     //             title: 'เกิดข้อผิดพลาด!',
//     //             text: 'ไม่สามารถดึงข้อมูลเครื่องเทิร์นได้ กรุณาลองใหม่อีกครั้ง',
//     //             confirmButtonText: 'ตกลง',
//     //         });
//     //     } finally {
//     //         setIsLoading(false);
//     //     }
//     // }, [TRADEINBRAND_URL]);

//     // กรองเหลือแค่ SAFE เซฟ, กิฟฟารีน, เครื่องอื่นๆ
//     const getData = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             const resp = await axios.get(TRADEINBRAND_URL, {
//                 headers: { 'Content-Type': 'application/json' }
//             });
//             const allBrands: TradeInBrand[] = Array.isArray(resp.data.data)
//                 ? resp.data.data
//                 : [];

//             // กรองเฉพาะ SAFE และ กิฟฟารีน
//             const filtered = allBrands.filter(b =>
//                 b.TRADEINBRANDNAME === 'SAFE เซฟ' ||
//                 b.TRADEINBRANDNAME === 'กิฟฟารีน'
//             );

//             // เพิ่มตัวเลือก “อื่นๆ”
//             const finalList: TradeInBrand[] = [
//                 ...filtered,
//                 { TRADEINBRANDID: 'other', TRADEINBRANDNAME: 'อื่นๆ' }
//             ];

//             setTradeInBrand(finalList);
//         } catch (err) {
//             MySwal.fire({
//                 icon: 'error',
//                 title: 'เกิดข้อผิดพลาด!',
//                 text: 'ไม่สามารถดึงข้อมูลเครื่องเทิร์นได้ กรุณาลองใหม่อีกครั้ง',
//                 confirmButtonText: 'ตกลง',
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [TRADEINBRAND_URL]);

//     const getEmpInTeam = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             const formData = new FormData();
//             formData.append('EmpId', EmpId);

//             const response = await axios.post(
//                 EMP_IN_TEAM_URL,
//                 formData,
//                 {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 }
//             );
//             const data = Array.isArray(response.data.data) ? response.data.data : [];
//             setEmpInTeam(data);
//         } catch (error) {
//             MySwal.fire({
//                 icon: 'error',
//                 title: 'เกิดข้อผิดพลาด!',
//                 text: 'ไม่สามารถดึงข้อมูลพนักงานในทีมได้ กรุณาลองใหม่อีกครั้ง',
//                 confirmButtonText: 'ตกลง',
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [EmpId, EMP_IN_TEAM_URL]);

//     const getAdviserData = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             const formData = new FormData();
//             formData.append('EmpId', EmpId);

//             const response = await axios.post(ADVISER_URL, formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//             });
//             const data = Array.isArray(response.data.data) ? response.data.data : [];
//             setAdviserList(data);
//         } catch (error) {
//             MySwal.fire({
//                 icon: 'error',
//                 title: 'เกิดข้อผิดพลาด!',
//                 text: 'ไม่สามารถดึงข้อมูลผู้แนะนำได้ กรุณาลองใหม่อีกครั้ง',
//                 confirmButtonText: 'ตกลง',
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [EmpId, ADVISER_URL]);

//     const getInstallerData = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             const formData = new FormData();
//             formData.append('EmpId', EmpId);

//             const response = await axios.post(ADVISER_URL, formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//             });
//             const data = Array.isArray(response.data.data) ? response.data.data : [];
//             setInstallerList(data);
//         } catch (error) {
//             MySwal.fire({
//                 icon: 'error',
//                 title: 'เกิดข้อผิดพลาด!',
//                 text: 'ไม่สามารถดึงข้อมูลช่างติดตั้งได้ กรุณาลองใหม่อีกครั้ง',
//                 confirmButtonText: 'ตกลง',
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [EmpId, ADVISER_URL]);

//     useEffect(() => {
//         if (EmpId && TeamSale) {
//             getData();
//         }
//     }, [EmpId, TeamSale]);

//     useEffect(() => {
//         getData();
//         getEmpInTeam();
//         getAdviserData();
//         getInstallerData();
//     }, [getData, getEmpInTeam, getAdviserData, getInstallerData]);

//     const handleTurnOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const value = event.target.value;
//         setSelectedTurnId(Number(value));
//         // หาแบรนด์ตาม ID ที่เลือก
//         const brand = tradeInBrand.find(b => String(b.TRADEINBRANDID) === value);
//         setSelectedTradeInBrandName(brand?.TRADEINBRANDNAME ?? '');
//     };

//     const handleTradeInModelChange = (event: any) => {
//         const value = event.target.value;
//         setTradeInModel(value);
//     };

//     const handleTradeInSerialChange = (event: any) => {
//         const value = event.target.value;
//         setTradeInSerial(value);
//     };

//     const handleGiftOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const value = Number(event.target.value);
//         setSelectedGiftId(value);
//     };

//     const handleNextClick = async () => {
//         try {
//             const empOptions = empInTeam.reduce((options, emp) => {
//                 const fullName = `${emp.FName} ${emp.LName}`;
//                 options[emp.SaleEmp] = fullName;
//                 return options;
//             }, {});

//             const { value: formValues } = await MySwal.fire({
//                 title: 'เลือกพนักงานขาย',
//                 html: `
//                   <select id="swal-employee" class="swal2-input" style="width: 100%; font-size:1.5rem;" margin-bottom: 1rem;">
//                     <option value="">เลือกพนักงานขาย</option>
//                     ${Object.entries(empOptions)
//                         .map(([key, value]) => `<option value="${key}">${value}</option>`)
//                         .join('')}
//                   </select>
//                   <select id="swal-adviser" class="swal2-input" style="width: 100%; font-size:1.5rem;" margin-bottom: 1rem;">
//                     <option value="">เลือกผู้แนะนำ (ถ้ามี)</option>
//                     ${adviserList
//                         .map(emp => `<option value="${emp.SaleEmp}">${emp.FName} ${emp.LName}</option>`)
//                         .join('')}
//                   </select>
//                      <select id="swal-installer" class="swal2-input" style="width: 100%; font-size:1.5rem;" margin-bottom: 1rem;">
//                     <option value="">เลือกช่างติดตั้ง (ถ้ามี)</option>
//                     ${installerList
//                         .map(emp => `<option value="${emp.SaleEmp}">${emp.FName} ${emp.LName}</option>`)
//                         .join('')}
//                   </select>
//                 `,
//                 focusConfirm: false,
//                 showCancelButton: true,
//                 confirmButtonText: 'ตกลง',
//                 cancelButtonText: 'ยกเลิก',
//                 customClass: {
//                     confirmButton: styles.fontSize,
//                     cancelButton: styles.fontSize
//                 },
//                 preConfirm: () => {
//                     const employee = (document.getElementById('swal-employee') as HTMLSelectElement).value;
//                     const adviser = (document.getElementById('swal-adviser') as HTMLSelectElement).value;
//                     const installer = (document.getElementById('swal-installer') as HTMLSelectElement).value;
//                     if (!employee) {
//                         Swal.showValidationMessage('กรุณาเลือกพนักงานขาย');
//                     }
//                     return { employee, adviser, installer };
//                 },
//             });

//             if (formValues && formValues.employee) {
//                 const selectedEmployee = empInTeam.find((emp) => emp.SaleEmp === formValues.employee);

//                 const payload: {
//                     SALEEMPLOYEE: any;
//                     ADVISER?: {
//                         SaleEmp: string;
//                         SaleCode: string;
//                     };
//                     INSTALLER?: {
//                         SaleEmp: string;
//                         SaleCode: string;
//                     };
//                 } = {
//                     SALEEMPLOYEE: selectedEmployee,
//                 };

//                 if (formValues.adviser) {
//                     const selectedAdviser = adviserList.find((emp) => emp.SaleEmp === formValues.adviser);
//                     if (selectedAdviser) {
//                         payload.ADVISER = selectedAdviser;
//                     }
//                 }

//                 if (formValues.installer) {
//                     const selectedInstaller = installerList.find((emp) => emp.SaleEmp === formValues.installer);
//                     if (selectedInstaller) {
//                         payload.INSTALLER = selectedInstaller;
//                     }
//                 }

//                 await axios.post(
//                     UPDATECONTACT,
//                     {
//                         REFNO,
//                         EMPID: EmpId,
//                         TEAMSALE: TeamSale,
//                         FIELD: 'SALEEMPLOYEE',
//                         DATA: [payload],
//                     },
//                     {
//                         headers: { 'Content-Type': 'application/json' },
//                     }
//                 );

//                 await MySwal.fire({
//                     icon: 'success',
//                     title: 'บันทึกสำเร็จ!',
//                     text: `ข้อมูลพนักงานขาย ถูกบันทึกเรียบร้อยแล้ว`,
//                     timer: 2000,
//                     showConfirmButton: false,
//                 });

//                 const discountUpdateResponse = await axios.post(
//                     UPDATECONTACT,
//                     {
//                         REFNO,
//                         EMPID: EmpId,
//                         TEAMSALE: TeamSale,
//                         SALECODE: SaleCode,
//                         SUPEMPID: SupEmpId,
//                         SECEMPID: SecEmpId,
//                         FIELD: 'DISCOUNT',
//                         DATA: SaveDiscountData,
//                     },
//                     {
//                         headers: { 'Content-Type': 'application/json' },
//                     }
//                 );

//                 if (discountUpdateResponse.status === 200) {
//                     console.log('ส่วนลดบันทึกสำเร็จ:', discountUpdateResponse.data);
//                 } else {
//                     console.log('เกิดข้อผิดพลาดในการบันทึกส่วนลด:', discountUpdateResponse.status);
//                 }

//                 await MySwal.fire({
//                     icon: 'success',
//                     title: 'บันทึกสำเร็จ!',
//                     text: 'ข้อมูลส่วนลดถูกบันทึกเรียบร้อยแล้ว',
//                     timer: 2000,
//                     showConfirmButton: false,
//                 });

//                 const pkgTypeId = matchedItem?.PRODUCT?.[0]?.Package?.[0]?.PACKAGETYPEID;
//                 const nextPath = pkgTypeId === 1
//                     ? '/sale/createcust-cash'
//                     : '/sale/createcust';
//                 navigate(nextPath);
//             }

//         } catch (error) {
//             console.error('Error fetching UPDATECONTACT:', error);
//             MySwal.fire({
//                 icon: 'error',
//                 title: 'เกิดข้อผิดพลาด!',
//                 text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
//                 confirmButtonText: 'ตกลง',
//             });
//         }
//     };

//     const finalPrice = Math.max(0, totalPrice - (discountInput ?? 0));

//     const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false);
//     const [draft, setDraft] = useState<any[]>([]);
//     // console.log(`draft`, draft);

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

//     return (
//         <>
//             <Content>
//                 <div className='d-flex justify-content-between align-items-center my-5'>
//                     <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
//                         data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//                         className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
//                         <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//                             <li className={`${styles.titlePage}`}>เครื่องเทิร์น / ส่วนลด / ของแถม</li>
//                         </ul>
//                     </div>
//                 </div>
//                 <span className={`${styles.fontSize}`}>เลขที่ขาย: </span><span className={`${styles.titlePage}`}>{REFNO}</span>

//                 <div className='accordion mb-10' id='kt_accordion_1'>
//                     {hasTradeIn === 1 && (
//                         <div className='accordion-item mb-10'>
//                             <h2 className='accordion-header' id='kt_accordion_1_header_1'>
//                                 <h3
//                                     className={`accordion-button collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7 ${styles.fontSize}`}
//                                     data-bs-toggle='collapse'
//                                     data-bs-target='#kt_accordion_1_body_1'
//                                     aria-expanded='true'
//                                     aria-controls='kt_accordion_1_body_1'
//                                     style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
//                                 >
//                                     เครื่องเทิร์น
//                                 </h3>
//                             </h2>
//                             <div
//                                 id='kt_accordion_1_body_1'
//                                 className='accordion-collapse collapse show'
//                                 aria-labelledby='kt_accordion_1_header_1'
//                                 data-bs-parent='#kt_accordion_1'
//                             >
//                                 <div className='accordion-body'>
//                                     <form noValidate className='form'>
//                                         <div className='card-body px-lg-9 px-1'>
//                                             <div className='row mb-6'>
//                                                 <div className='col-lg-4 mb-3'>
//                                                     <label className={`form-label ${styles.fontSize}`}>เครื่องเทิร์น</label>
//                                                     <select
//                                                         className={`form-select ${styles.fontSize}`}
//                                                         onChange={handleTurnOptionChange}
//                                                     >
//                                                         <option value=''>เลือกเครื่องเทิร์น...</option>
//                                                         {tradeInBrand.map((item, index) => (
//                                                             <option key={index} value={item.TRADEINBRANDID}>
//                                                                 {item.TRADEINBRANDNAME}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                                 <div className='col-lg-4 mb-3'>
//                                                     <label className={`form-label ${styles.fontSize}`}>รุ่น</label>
//                                                     <input
//                                                         type='text'
//                                                         className={`form-control mb-3 mb-lg-0 ${styles.fontSize}`}
//                                                         onChange={handleTradeInModelChange}
//                                                         value={tradeInModel}
//                                                     />
//                                                 </div>
//                                                 <div className='col-lg-4 mb-3'>
//                                                     <label className={`form-label ${styles.fontSize}`}>หมายเลขเครื่อง</label>
//                                                     <input
//                                                         type='text'
//                                                         className={`form-control mb-3 mb-lg-0 ${styles.fontSize}`}
//                                                         onChange={handleTradeInSerialChange}
//                                                         value={tradeInSerial}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {
//                         (
//                             (!Array.isArray(discountPrice) && discountPrice !== 0 && discountPrice !== null) ||
//                             (Array.isArray(discountPrice) && discountPrice.length > 0)
//                         ) && (
//                             <div className='accordion-item mb-10'>
//                                 <h2 className='accordion-header' id='kt_accordion_2_header_2'>
//                                     <h3
//                                         className={`accordion-button collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7 ${styles.fontSize}`}
//                                         data-bs-toggle='collapse'
//                                         data-bs-target='#kt_accordion_2_body_2'
//                                         aria-expanded='true'
//                                         aria-controls='kt_accordion_2_body_2'
//                                         style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
//                                     >
//                                         ส่วนลด
//                                     </h3>
//                                 </h2>
//                                 <div
//                                     id='kt_accordion_2_body_2'
//                                     className='accordion-collapse collapse show'
//                                     aria-labelledby='kt_accordion_2_header_2'
//                                     data-bs-parent='#kt_accordion_2'
//                                 >
//                                     <div className='accordion-body'>
//                                         <form noValidate className='form'>
//                                             <div className='card-body px-lg-9 px-1'>
//                                                 <div className='row mb-6'>
//                                                     <div className='col-lg-6 mb-3'>
//                                                         <label className={`form-label ${styles.fontSize}`}>ราคา</label>
//                                                         <p className={`form-control mb-3 mb-lg-0 ${styles.fontSize}`}>
//                                                             {(finalPrice).toLocaleString()}
//                                                         </p>
//                                                     </div>
//                                                     <div className='col-lg-6 mb-3'>
//                                                         <label className={`form-label ${styles.fontSize}`}>ส่วนลด</label>
//                                                         <div className='d-flex align-items-center'>
//                                                             <input
//                                                                 type="text"
//                                                                 className={`form-control ${styles.fontSize}`}
//                                                                 onChange={(e) => handleDiscountChange(e.target.value)}
//                                                             />
//                                                         </div>
//                                                         {discountValidationMessage && (
//                                                             <div
//                                                                 className={`${styles.fontSize} mt-2 text-${discountValidationMessage.type}`}
//                                                             >
//                                                                 {discountValidationMessage.message}
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                     {freeGift.length > 0 && (
//                         <div className='accordion-item mb-10'>
//                             <h2 className='accordion-header' id='kt_accordion_3_header_3'>
//                                 <h3
//                                     className={`accordion-button collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7 ${styles.fontSize}`}
//                                     data-bs-toggle='collapse'
//                                     data-bs-target='#kt_accordion_3_body_3'
//                                     aria-expanded='true'
//                                     aria-controls='kt_accordion_3_body_3'
//                                     style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
//                                 >
//                                     ของแถม
//                                 </h3>
//                             </h2>
//                             <div
//                                 id='kt_accordion_3_body_3'
//                                 className='accordion-collapse collapse show'
//                                 aria-labelledby='kt_accordion_3_header_3'
//                                 data-bs-parent='#kt_accordion_3'
//                             >
//                                 <div className='accordion-body'>
//                                     <form noValidate className='form'>
//                                         <div className='card-body px-lg-9 px-1'>
//                                             <div className='row mb-6'>
//                                                 <div className='col-lg-12 mb-3'>
//                                                     <label className={`form-label ${styles.fontSize}`}>ของแถม</label>
//                                                     <select
//                                                         className={`form-select ${styles.fontSize}`}
//                                                         onChange={handleGiftOptionChange}
//                                                     >
//                                                         <option value=''>เลือกของแถม...</option>
//                                                         {freeGift.map((item, index) => (
//                                                             <option key={index} value={item.GIFTID}>
//                                                                 {item.GIFTNAME}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {
//                     (hasTradeIn !== 1) &&
//                     (
//                         Array.isArray(discountPrice)
//                             ? discountPrice.length === 0
//                             : discountPrice === 0
//                     ) &&
//                     (freeGift.length === 0) && (
//                         <div className='text-center my-20'>
//                             <h5 className={`${styles.fontSize}`}>ไม่มี เครื่องเทิร์น / ส่วนลด / ของแถม</h5>
//                         </div>
//                     )
//                 }

//                 <div className='d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10'>
//                     <button
//                         className={`${styles.btnSecondary}`}
//                         onClick={() => navigate('/sale/update/updateSalePackage', {
//                             state: {
//                                 ...matchedItem,
//                                 fromDiscount: true,
//                             }
//                         })}
//                     >
//                         แก้ไขแพ็คเกจ
//                     </button>
//                     <button
//                         className={`${styles.btnPrimary}`}
//                         onClick={handleNextClick}
//                     >
//                         บันทึก
//                     </button>
//                 </div>

//                 <div
//                     className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
//                     style={{
//                         position: "fixed",
//                         bottom: 0,
//                         left: 0,
//                         right: 0,
//                         zIndex: 1050,
//                     }}
//                 >
//                     <button
//                         className={`${styles.btnSecondary}`}
//                         onClick={() => navigate('/sale/update/updateSalePackage', {
//                             state: {
//                                 ...matchedItem,
//                                 fromDiscount: true,
//                             }
//                         })}
//                     >
//                         แก้ไขแพ็คเกจ
//                     </button>
//                     <button
//                         className={`${styles.btnPrimary}`}
//                         onClick={handleNextClick}
//                     >
//                         บันทึก
//                     </button>
//                 </div>

//             </Content>
//         </>
//     )
// }

// export default SalesDiscount;

// src/pages/SalesDiscount.tsx
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import styles from "@/styles/style.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from "../../modules/auth/core/Auth";

import {
  useUUIDStore,
  useSaveProductStore,
} from "../../modules/stores/stepsStore";
import { useSaveDiscountStore } from "../../modules/stores/stepsStore";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface TradeInBrand {
  TRADEINBRANDID: string;
  TRADEINBRANDNAME: string;
}

interface FreeGift {
  GIFTID: string;
  GIFTCODE: string;
  GIFTNAME: string;
  GIFTPRICE: number;
  GIFTDESCRIPTION: string | null;
}

interface Package {
  HASTRADEIN: number;
  TOTALPRICE: number;
  DISCOUNTPRICE: number;
  SEQUENCE: number;
  FREEGIFT: FreeGift[];
}

interface Product {
  Package: Package[];
}

interface SaveDiscount {
  TRADEIN: {
    HASTRADEIN: number;
    TRADEINBRANDID: number;
    TRADEINBRANDNAME: string;
    TRADEINMODEL: string;
    TRADEINSERIAL: string;
  };
  DISCOUNTAMOUNT: number | null;
  GIFT: {
    GIFTID: number;
    GIFTCODE: string;
    GIFTNAME: string;
    GIFTPRICE: number;
    GIFTDESCRIPTION: string | null;
  };
}

const SalesDiscount: React.FC = () => {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || "";
  const TeamSale = auth?.data?.[0]?.TeamSale || "";
  const SaleCode = auth?.data?.[0]?.SaleCode || "";
  const SupEmpId = auth?.data?.[0]?.SupEmp || "";
  const SecEmpId = auth?.data?.[0]?.SecEmp || "";

  const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
  const TRADEINBRAND_URL = `${API_SALECONNEXT}/GetProduct/Tradeinbrand`;

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
  const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;

  const { REFNO } = useUUIDStore();
  const { PRODUCT } = useSaveProductStore();
  const { DISCOUNT, SETDISCOUNT } = useSaveDiscountStore();

  // state สำหรับเครื่องเทิร์น / ส่วนลด / ของแถม
  const [tradeInBrand, setTradeInBrand] = useState<TradeInBrand[]>([]);
  const [selectedTurnId, setSelectedTurnId] = useState<number>(0);
  const [selectedTradeInBrandName, setSelectedTradeInBrandName] =
    useState<string>("");
  const [tradeInModel, setTradeInModel] = useState<string>("");
  const [tradeInSerial, setTradeInSerial] = useState<string>("");
  const [selectedGiftId, setSelectedGiftId] = useState<number>(0);

  const [discountInput, setDiscountInput] = useState<number | null>(null);
  const [discountValidationMessage, setDiscountValidationMessage] = useState<{
    message: string;
    type: "success" | "danger";
  } | null>(null);

  const pkg = PRODUCT?.[0]?.Package?.[0] || {};
  const hasTradeIn = pkg.HASTRADEIN ?? 0;
  const totalPrice = pkg.TOTALPRICE ?? 0;
  const discountPrice = pkg.DISCOUNTPRICE ?? 0;
  const sequence = pkg.SEQUENCE ?? 0;
  const freeGift = pkg.FREEGIFT ?? [];

  const [isDiscountValid, setIsDiscountValid] = useState<boolean>(true);

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

  // โหลดรายชื่อแบรนด์เครื่องเทิร์น
  const loadTradeInBrands = useCallback(async () => {
    try {
      const resp = await axios.get(TRADEINBRAND_URL);
      const all = Array.isArray(resp.data.data) ? resp.data.data : [];
      // กรอง SAFE, กิฟฟารีน เพิ่มอื่นๆ
      const filtered = all.filter((b: TradeInBrand) =>
        ["SAFE เซฟ", "กิฟฟารีน"].includes(b.TRADEINBRANDNAME)
      );
      setTradeInBrand([
        ...filtered,
        { TRADEINBRANDID: "other", TRADEINBRANDNAME: "อื่นๆ" },
      ]);
    } catch {
      MySwal.fire("Error", "ไม่สามารถโหลดแบรนด์เครื่องเทิร์นได้", "error");
    }
  }, [TRADEINBRAND_URL]);

  useEffect(() => {
    loadTradeInBrands();
  }, [loadTradeInBrands]);

  // ตั้งค่า SaveDiscountStore
  const SaveDiscountData = useMemo<SaveDiscount[]>(() => {
    return [
      {
        TRADEIN: {
          HASTRADEIN: pkg.HASTRADEIN,
          TRADEINBRANDID: selectedTurnId,
          TRADEINBRANDNAME: selectedTradeInBrandName,
          TRADEINMODEL: tradeInModel,
          TRADEINSERIAL: tradeInSerial,
        },
        DISCOUNTAMOUNT: discountInput,
        GIFT: {
          GIFTID: selectedGiftId,
          GIFTCODE: freeGift[selectedGiftId - 1]?.GIFTCODE || "",
          GIFTNAME: freeGift[selectedGiftId - 1]?.GIFTNAME || "",
          GIFTPRICE: freeGift[selectedGiftId - 1]?.GIFTPRICE ?? 0,
          GIFTDESCRIPTION:
            freeGift[selectedGiftId - 1]?.GIFTDESCRIPTION || null,
        },
      },
    ];
  }, [
    pkg,
    selectedTurnId,
    selectedTradeInBrandName,
    tradeInModel,
    tradeInSerial,
    discountInput,
    selectedGiftId,
    freeGift,
  ]);

  useEffect(() => {
    // ถ้า SaveDiscountData ไม่เท่ากับ DISCOUNT ใน store เท่านั้น ถึงจะอัปเดต
    if (JSON.stringify(SaveDiscountData) !== JSON.stringify(DISCOUNT)) {
      SETDISCOUNT(SaveDiscountData);
    }
  }, [SaveDiscountData, DISCOUNT, SETDISCOUNT]);

  // ฟังก์ชันจัดการเมื่อมีการเปลี่ยนแปลงในฟิลด์ส่วนลด
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

  // ฟังก์ชันตรวจสอบค่าที่กรอก
  const validateDiscount = (inputNumber: number) => {
    if (discountPrice === 0) {
      setDiscountValidationMessage(null);
      setIsDiscountValid(true); // ไม่มีส่วนลด ไม่ต้องแสดงข้อความ
      return;
    }

    if (discountPrice !== undefined && sequence !== undefined) {
      let validationMessage = "";

      if (inputNumber <= discountPrice) {
        if (inputNumber % sequence === 0) {
          validationMessage = "";
          setIsDiscountValid(true); // ส่วนลดถูกต้อง
          setDiscountValidationMessage({
            message: validationMessage,
            type: "success",
          });
        } else {
          validationMessage = `กรอกส่วนลดผิด ต้องลดหรือเพิ่มได้ทีละ ${sequence} บาท`;
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

  // Handle option changes
  const handleTurnOptionChange = (event: any) => {
    const value = event.target.value;
    setSelectedTurnId(value);
  };

  const handleTradeInModelChange = (event: any) => {
    const value = event.target.value;
    setTradeInModel(value);
  };

  const handleTradeInSerialChange = (event: any) => {
    const value = event.target.value;
    setTradeInSerial(value);
  };

  const handleGiftOptionChange = (event: any) => {
    const value = event.target.value;
    setSelectedGiftId(value);
  };

  // บันทึกข้อมูลทั้งหมดขึ้น API
  const handleNextClick = async () => {
    try {
      await axios.post(UPDATECONTACT, {
        REFNO,
        EMPID: EmpId,
        TEAMSALE: TeamSale,
        SALECODE: SaleCode,
        SUPEMPID: SupEmpId,
        SECEMPID: SecEmpId,
        FIELD: "DISCOUNT",
        DATA: SaveDiscountData,
      });
      await MySwal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: "บันทึกข้อมูลเรียบร้อยแล้ว",
        timer: 2000, // แสดงผล 3 วินาที
        showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
      });
      // นำทางไปหน้าถัดไป
      // const next = pkg.PACKAGETYPEID === 1 ? '/sale/createcust-cash' : '/sale/createcust'
      const next = "/sale/salesemployee";
      navigate(next);
    } catch {
      MySwal.fire("Error", "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  const finalPrice = Math.max(0, totalPrice - (discountInput ?? 0));

  return (
    <>
      <Content>
        <div className="d-flex justify-content-between align-items-center my-5">
          <div
            id="kt_page_title"
            data-kt-swapper="true"
            data-kt-swapper-mode="prepend"
            data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
            className="page-title d-flex flex-wrap me-3 flex-column justify-content-center"
          >
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
              <li className={`${styles.titlePage}`}>
                เครื่องเทิร์น / ส่วนลด / ของแถม
              </li>
            </ul>
          </div>
        </div>
        <span className={`${styles.fontSize}`}>เลขที่ขาย: </span>
        <span className={`${styles.titlePage}`}>{REFNO}</span>

        <div className="accordion mb-10" id="kt_accordion_1">
          {hasTradeIn === 1 && (
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
                  เครื่องเทิร์น
                </h3>
              </h2>
              <div
                id="kt_accordion_1_body_1"
                className="accordion-collapse collapse show"
                aria-labelledby="kt_accordion_1_header_1"
                data-bs-parent="#kt_accordion_1"
              >
                <div className="accordion-body">
                  <form noValidate className="form">
                    <div className="card-body px-lg-9 px-1">
                      <div className="row mb-6">
                        <div className="col-lg-4 mb-3">
                          <label className={`form-label ${styles.fontSize}`}>
                            เครื่องเทิร์น
                          </label>
                          <select
                            className={`form-select ${styles.fontSize}`}
                            onChange={handleTurnOptionChange}
                            value={selectedTurnId}
                          >
                            <option value="">เลือกเครื่องเทิร์น</option>
                            {tradeInBrand.map((item, index) => (
                              <option key={index} value={item.TRADEINBRANDID}>
                                {item.TRADEINBRANDNAME}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className={`form-label ${styles.fontSize}`}>
                            รุ่น
                          </label>
                          <input
                            type="text"
                            className={`form-control mb-3 mb-lg-0 ${styles.fontSize}`}
                            onChange={handleTradeInModelChange}
                            value={tradeInModel}
                          />
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className={`form-label ${styles.fontSize}`}>
                            หมายเลขเครื่อง
                          </label>
                          <input
                            type="text"
                            className={`form-control mb-3 mb-lg-0 ${styles.fontSize}`}
                            onChange={handleTradeInSerialChange}
                            value={tradeInSerial}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {((!Array.isArray(discountPrice) &&
            discountPrice !== 0 &&
            discountPrice !== null) ||
            (Array.isArray(discountPrice) && discountPrice.length > 0)) && (
            <div className="accordion-item mb-10">
              <h2 className="accordion-header" id="kt_accordion_2_header_2">
                <h3
                  className="accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7"
                  data-bs-toggle="collapse"
                  data-bs-target="#kt_accordion_2_body_2"
                  aria-expanded="true"
                  aria-controls="kt_accordion_2_body_2"
                  style={{
                    color: "white",
                    cursor: "pointer",
                    backgroundColor: "#3777bc",
                  }}
                >
                  ส่วนลด
                </h3>
              </h2>
              <div
                id="kt_accordion_2_body_2"
                className="accordion-collapse collapse show"
                aria-labelledby="kt_accordion_2_header_2"
                data-bs-parent="#kt_accordion_2"
              >
                <div className="accordion-body">
                  <form noValidate className="form">
                    <div className="card-body px-lg-9 px-1">
                      <div className="row mb-6">
                        <div className="col-lg-6 mb-3">
                          <label className={`form-label ${styles.fontSize}`}>
                            ราคาขาย
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={totalPrice.toLocaleString()}
                            className={`${styles.fontSize} form-control bg-light`}
                            style={{ cursor: "not-allowed" }}
                          />
                        </div>
                        <div className="col-lg-6 mb-3">
                          <label className={`form-label ${styles.fontSize}`}>
                            ส่วนลด
                          </label>
                          <div className="d-flex align-items-center">
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              className={`form-control ${styles.fontSize}`}
                              onChange={(e) =>
                                handleDiscountChange(e.target.value)
                              }
                              value={
                                discountInput !== null
                                  ? discountInput.toString()
                                  : ""
                              }
                            />
                          </div>
                          {discountValidationMessage && (
                            <div
                              className={`${styles.fontSize} mt-2 text-${discountValidationMessage.type}`}
                            >
                              {discountValidationMessage.message}
                            </div>
                          )}
                        </div>
                        <div className="col-lg-6 mb-3">
                          <label className={`form-label ${styles.fontSize}`}>
                            ราคาสุทธิ
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={finalPrice.toLocaleString()}
                            className={`${styles.fontSize} form-control bg-light`}
                            style={{ cursor: "not-allowed" }}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {freeGift.length > 0 && (
            <div className="accordion-item mb-10">
              <h2 className="accordion-header" id="kt_accordion_3_header_3">
                <h3
                  className={`accordion-button collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7 ${styles.fontSize}`}
                  data-bs-toggle="collapse"
                  data-bs-target="#kt_accordion_3_body_3"
                  aria-expanded="true"
                  aria-controls="kt_accordion_3_body_3"
                  style={{
                    color: "white",
                    cursor: "pointer",
                    backgroundColor: "#3777bc",
                  }}
                >
                  ของแถม
                </h3>
              </h2>
              <div
                id="kt_accordion_3_body_3"
                className="accordion-collapse collapse show"
                aria-labelledby="kt_accordion_3_header_3"
                data-bs-parent="#kt_accordion_3"
              >
                <div className="accordion-body">
                  <form noValidate className="form">
                    <div className="card-body px-lg-9 px-1">
                      <div className="row mb-6">
                        <div className="col-lg-12 mb-3">
                          <label className={`form-label ${styles.fontSize}`}>
                            ของแถม
                          </label>
                          <select
                            value={selectedGiftId}
                            className={`form-select ${styles.fontSize}`}
                            onChange={handleGiftOptionChange}
                          >
                            <option value="">เลือกของแถม</option>
                            {freeGift.map(
                              (
                                item: {
                                  GIFTID:
                                    | string
                                    | number
                                    | readonly string[]
                                    | undefined;
                                  GIFTNAME:
                                    | string
                                    | number
                                    | boolean
                                    | ReactElement<
                                        any,
                                        string | JSXElementConstructor<any>
                                      >
                                    | Iterable<ReactNode>
                                    | ReactPortal
                                    | null
                                    | undefined;
                                },
                                index: Key | null | undefined
                              ) => (
                                <option key={index} value={item.GIFTID}>
                                  {item.GIFTNAME}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {hasTradeIn !== 1 &&
          (Array.isArray(discountPrice)
            ? discountPrice.length === 0
            : discountPrice === 0) &&
          freeGift.length === 0 && (
            <>
              <div className="col-lg-6 mb-3">
                <label className={`form-label ${styles.fontSize}`}>
                  ราคาขาย
                </label>
                <input
                  type="text"
                  readOnly
                  value={totalPrice.toLocaleString()}
                  className={`${styles.fontSize} form-control bg-light`}
                  style={{ cursor: "not-allowed" }}
                />
              </div>
              <div className="text-center my-20">
                <h5 className={`${styles.fontSize}`}>
                  ไม่มี เครื่องเทิร์น / ส่วนลด / ของแถม
                </h5>
              </div>
            </>
          )}

        {isDiscountValid && (
          <>
            <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
              <button
                className={`${styles.btnSecondary}`}
                onClick={() =>
                  navigate("/sale/update/updateSalePackage", {
                    state: {
                      ...matchedItem,
                      fromDiscount: true,
                    },
                  })
                }
              >
                แก้ไขแพ็คเกจ
              </button>
              <button
                className={`${styles.btnPrimary}`}
                onClick={handleNextClick}
              >
                บันทึก
              </button>
            </div>

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
                  navigate("/sale/update/updateSalePackage", {
                    state: {
                      ...matchedItem,
                      fromDiscount: true,
                    },
                  })
                }
              >
                แก้ไขแพ็คเกจ
              </button>
              <button
                className={`${styles.btnPrimary}`}
                onClick={handleNextClick}
              >
                บันทึก
              </button>
            </div>
          </>
        )}
      </Content>
    </>
  );
};

export default SalesDiscount;
