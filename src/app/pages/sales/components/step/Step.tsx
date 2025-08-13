// import { Link, useLocation, useNavigate } from 'react-router-dom'
// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import { useAuth } from '../../../../modules/auth/core/Auth';
// import { Content } from '../../../../../_metronic/layout/components/content'
// import useRefnoBarcodeStore from "../accessCam/refnoBarcodeStore";

// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// import { ThreeDot } from 'react-loading-indicators';

// //useStore
// import {
//   useCategoryStore
// } from '../../../../modules/stores/sales/packageStore/packageStore';

// interface ItemProps {
//   REFNO: string;
//   CONTNO: string;
//   EMPID: string;
//   TEAMSALE: string;
//   SALECODE: string;
//   SUPEMPID: string;
//   SECEMPID: string;
//   STATUS: string;
//   PRODUCT: [any];
//   CUSTOMERSTATUS: [any];
//   DISCOUNT: [any];
//   CUSTOMERDETAIL: [any];
//   ADDRESS: [any];
//   PDPA: [any];
//   CONTRACT: [any];
//   IMAGE: [any];
//   CHECKERCOMMENT: [any];
//   item?: {
//     REFNO: string; // เพิ่ม item เป็น optional object
//   };
// }

// interface ImagesType {
//   IMAGECARD: string[];
//   IMAGEGPS: string[];
//   IMAGEMAP: string[];
//   IMAGECUSTOMERHOME: string[];
//   IMAGEINSTALLATION: string[];
//   IMAGETDS: string[];
//   IMAGECUSTOMER: string[];
//   IMAGETRADEIN: string[];
// }

// const Step: React.FC = () => {
//   const MySwal = withReactContent(Swal);
//   const location = useLocation();
//   const navigate = useNavigate()
//   const item = location.state as ItemProps || [];
//   // console.log(`item`, item);

//   const refnoFromUpdate = useRefnoBarcodeStore((state: any) => state.refno || item?.REFNO || ""); // เพิ่มค่าเริ่มต้น
//   const refno = item.REFNO ? item.REFNO : refnoFromUpdate
//   // console.log(`refno`, refno);

//   const [data, setData] = useState<any[]>([])
//   console.log(`data`, data);
//   const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//   const GET_CONTRACT_URL = `${API_URL_MONGO}/Contract/GetContractSummary`;
//   const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
//   const GET_IMAGES_API = `${API_URL_MONGO}/Contract/GetContractImage?REFNO=${refno}`;

//   const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
//   const API_URL_POST_CONDITIONSCHECKHISTORY = `${API_SALECONNEXT}/ConditionsCheckHistory`;

//   const API_URL_POST_CHECKCUSTOMER = import.meta.env.VITE_APP_API_THIENSURAT;
//   const CHECKCUSTOMER_URL = `${API_URL_POST_CHECKCUSTOMER}/CheckCustomer`;

//   const API_URL_TSR = import.meta.env.VITE_APP_API_THIENSURAT;
//   const EMP_IN_TEAM_URL = `${API_URL_TSR}/Employee_Structure`;
//   const ADVISER_URL = `${API_URL_TSR}/Employee_Structure/Emp_All`;

//   const { auth } = useAuth();

//   const {
//     EmpId, setEmpId,
//     TeamSale, setTeamSale,
//     SaleCode, setSaleCode,
//     SupEmpId, setSupEmpId,
//     SecEmpId, setSecEmpId,
//     DivisionId, setDivisionId,
//     DepartId, setDepartId,
//     DepartGroup, setDepartGroup,
//   } = useCategoryStore();

//   const [isLoadingFinish, setIsLoadingFinish] = useState<boolean>(false);

//   const [images, setImages] = useState<ImagesType | null>(null);
//   // console.log(`images`, images);

//   const getData = async () => {
//     setIsLoadingFinish(true);
//     try {
//       const response = await axios.get(GET_CONTRACT_URL + '?refno=' + refno, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       const data = Array.isArray(response.data.data) ? response.data.data : [];
//       setData(data);
//       // console.log('Load data', data)
//     } catch (error) {
//       console.error('Error fetching DRAFT_ALLCONTRACT_URL:', error);
//     } finally {
//       setIsLoadingFinish(false);
//     }
//   };

//   useEffect(() => {
//     if (refno) {
//       getData(); // ดึงข้อมูลเมื่อ refno ถูกตั้งค่าแล้ว
//     } else {
//       console.warn("REFNO is undefined");
//     }
//   }, [refno]);

//   useEffect(() => {
//     getData();
//     setEmpId(auth.data[0].EmpId);
//     setTeamSale(auth.data[0].TeamSale);
//     setSaleCode(auth.data[0].SaleCode);
//     setSupEmpId(auth.data[0].SupEmp);
//     setSecEmpId(auth.data[0].SecEmp);
//     setDivisionId(auth.data[0].DivisionId);
//     setDepartId(auth.data[0].DepartId);
//     setDepartGroup(auth.data[0].DepartGroup);
//   }, [location]);

//   useEffect(() => {
//     if (data?.[0]?.PRODUCT?.length > 0) {
//       setToPackage('../sale/update/updateSalePackage')
//       setToStatusCust('../sale/update/updateSalesSatusCust')
//       setToPhoto('../sale/photo')
//       setToDiscount('../sale/update/updateSaleDiscount')
//     }

//     if (data?.[0]?.CUSTOMERSTATUS?.length > 0) {
//       setToStatusCust('../sale/update/updateSalesSatusCust')
//     }

//     if (data?.[0]?.DISCOUNT?.length > 0) {
//       setToDiscount('../sale/update/updateSaleDiscount')
//       setToCustDetail('../sale/update/updateCustDetail')
//     }

//     if (data?.[0]?.CUSTOMERDETAIL?.length > 0) {
//       setToCustDetail('../sale/update/updateCustDetail')
//       setToAddress('../sale/update/updateAddress')
//     }

//     if (data?.[0]?.ADDRESS?.length > 0) {
//       setToAddress('../sale/update/updateAddress')
//       setToPDPA('../sale/update/UpdateSalesPDPA')
//     }

//     if (data?.[0]?.PDPA?.length > 0) {
//       setToPDPA('../sale/update/UpdateSalesPDPA')
//       setToContract('../sale/update/UpdateSalesContract')
//     }

//     if (data?.[0]?.PDPA?.length > 0) {
//       setToContract('../sale/update/UpdateSalesContract')
//       setToPhoto('../sale/photo')
//     }
//   }, [data, location]);

//   const [toPackage, setToPackage] = useState('')
//   const [toStatusCust, setToStatusCust] = useState('')
//   const [toDiscount, setToDiscount] = useState('')
//   const [toCustDetail, setToCustDetail] = useState('')
//   const [toAddress, setToAddress] = useState('')
//   const [toPDPA, setToPDPA] = useState('')
//   const [toContract, setToContract] = useState('')
//   const [toPhoto, setToPhoto] = useState('')

//   const [empInTeam, setEmpInTeam] = useState<any[]>([]);
//   const [adviserList, setAdviserList] = useState<any[]>([]);

//   // กำหนดค่าเริ่มต้นของพนักงานจาก `data`
//   useEffect(() => {
//     const saleEmployee = data?.[0]?.SALEEMPLOYEE?.[0];
//     if (saleEmployee) {
//       setEmpInTeam((prev) => [...prev, saleEmployee]); // รวมพนักงานที่มีอยู่ใน `data`
//     }
//   }, [data]);

//   // api ผู้แนะนำ
//   useEffect(() => {
//     const getAdviserData = async () => {
//       try {
//         const formData = new FormData();
//         formData.append('EmpId', EmpId);

//         const response = await axios.post(ADVISER_URL, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         const data = Array.isArray(response.data.data) ? response.data.data : [];
//         setAdviserList(data);
//       } catch (error) {
//         console.error('Error fetching ADVISER_URL:', error);
//       }
//     };
//     getAdviserData();
//   }, []);

//   const handleClick = async (routeName: any) => {

//     if (routeName === 'updateSalesSatusCust' && data?.[0]?.PRODUCT > 0) {
//       setToStatusCust('../sale/update/updateSalesSatusCust'); // อนุญาตให้ทำขั้นตอนนี้ได้
//       navigate('../sale/update/updateSalesSatusCust', { state: data?.[0] });
//       return true;
//     }

//     // ตรวจสอบสถานะลูกค้าแบคลิสต์
//     if (routeName === 'updateSaleDiscount') {
//       if (data?.[0]?.CUSTOMERSTATUS?.[0]?.STATUSSALE === "0") {
//         await Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'ลูกค้ามีประวัติแบลคลิสต์ ไม่สามารถทำรายการต่อได้',
//           confirmButtonText: 'ตกลง',
//         });
//         return false;
//       } else {
//         setToDiscount('../sale/update/updateSaleDiscount');
//         navigate('../sale/update/updateSaleDiscount', { state: data?.[0] });
//         return true;
//       }
//     }

//     if (routeName === 'updateCustDetail' && data?.[0]?.CUSTOMERSTATUS?.[0]?.STATUSSALE === "0") {
//       await Swal.fire({
//         icon: 'error',
//         title: 'เกิดข้อผิดพลาด!',
//         text: 'ลูกค้ามีประวัติแบลคลิสต์ ไม่สามารถทำรายการต่อได้',
//         confirmButtonText: 'ตกลง',
//       });
//       return false;
//     }

//     if (routeName === 'updateAddress' && data?.[0]?.CUSTOMERSTATUS?.[0]?.STATUSSALE === "0") {
//       await Swal.fire({
//         icon: 'error',
//         title: 'เกิดข้อผิดพลาด!',
//         text: 'ลูกค้ามีประวัติแบลคลิสต์ ไม่สามารถทำรายการต่อได้',
//         confirmButtonText: 'ตกลง',
//       });
//       return false;
//     }

//     if (routeName === 'UpdateSalesPDPA' && data?.[0]?.CUSTOMERSTATUS?.[0]?.STATUSSALE === "0") {
//       await Swal.fire({
//         icon: 'error',
//         title: 'เกิดข้อผิดพลาด!',
//         text: 'ลูกค้ามีประวัติแบลคลิสต์ ไม่สามารถทำรายการต่อได้',
//         confirmButtonText: 'ตกลง',
//       });
//       return false;
//     }

//     if (routeName === 'UpdateSalesContract' && data?.[0]?.CUSTOMERSTATUS?.[0]?.STATUSSALE === "0") {
//       await Swal.fire({
//         icon: 'error',
//         title: 'เกิดข้อผิดพลาด!',
//         text: 'ลูกค้ามีประวัติแบลคลิสต์ ไม่สามารถทำรายการต่อได้',
//         confirmButtonText: 'ตกลง',
//       });
//       return false;
//     }

//     if (routeName === 'photo' && data?.[0]?.CUSTOMERSTATUS?.[0]?.STATUSSALE === "0") {
//       await Swal.fire({
//         icon: 'error',
//         title: 'เกิดข้อผิดพลาด!',
//         text: 'ลูกค้ามีประวัติแบลคลิสต์ ไม่สามารถทำรายการต่อได้',
//         confirmButtonText: 'ตกลง',
//       });
//       return false;
//     }

//     if (routeName === 'updateSalePackage') {
//       setToPackage('../sale/update/updateSalePackage')
//       return true;
//     }
//     if (routeName === 'updateSaleDiscount') {
//       if (data?.[0]?.CUSTOMERSTATUS?.length === 0) {
//         Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาตรวจสอบสถานะลูกค้าก่อน',
//           confirmButtonText: 'ตกลง'
//         });
//         return false
//       }
//       else if (data?.[0]?.PRODUCT?.length === 0) {
//         Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาบันทึกข้อมูลสินค้าและแพ็คเกจสินค้าก่อน',
//           confirmButtonText: 'ตกลง'
//         });
//         return false
//       } else {
//         setToDiscount('../sale/update/updateSaleDiscount')
//         return true
//       }
//     }
//     else if (routeName === 'updateCustDetail') {
//       // console.log('SALEEMPLOYEE:', data?.[0]?.SALEEMPLOYEE); // ตรวจสอบข้อมูล
//       if (!data?.[0]?.SALEEMPLOYEE || data?.[0]?.SALEEMPLOYEE.length === 0) {
//         await Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาบันทึกข้อมูลพนักงานขายก่อน',
//           confirmButtonText: 'ตกลง',
//         });
//         return false
//       }

//       console.log('Navigating to updateCustDetail'); // Debugging point
//       await new Promise((resolve) => setTimeout(resolve, 100));
//       setToCustDetail('../sale/update/updateCustDetail');
//       navigate('../sale/update/updateCustDetail', { state: data?.[0] });
//       return true
//     }
//     else if (routeName === 'updateAddress') {
//       if (data?.[0]?.CUSTOMERDETAIL?.length === 0) {
//         Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาบันทึกข้อมูลลูกค้าก่อน',
//           confirmButtonText: 'ตกลง'
//         });
//         return false
//       } else {
//         setToAddress('../sale/update/updateAddress')
//         return true
//       }
//     }
//     else if (routeName === 'UpdateSalesPDPA') {
//       if (data?.[0]?.ADDRESS?.length === 0) {
//         Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาบันทึกข้อมูลที่อยู่ก่อน',
//           confirmButtonText: 'ตกลง'
//         });
//         return false
//       } else {
//         setToPDPA('../sale/update/UpdateSalesPDPA')
//         return true
//       }
//     }
//     else if (routeName === 'UpdateSalesContract') {
//       if (data?.[0]?.PRODUCT?.length === 0 || data?.[0]?.CUSTOMERSTATUS?.length === 0 ||
//         data?.[0]?.CUSTOMERDETAIL?.length === 0 || data?.[0]?.ADDRESS?.length === 0 || data?.[0]?.PDPA?.length === 0) {
//         Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาบันทึกข้อมูลให้ครบทุกส่วน',
//           confirmButtonText: 'ตกลง'
//         });
//         return false
//       } else {
//         setToContract('../sale/update/UpdateSalesContract')
//         return true
//       }
//     }
//     else if (routeName === 'photo') {
//       if (data?.[0]?.PRODUCT?.length === 0 || data?.[0]?.CUSTOMERSTATUS?.length === 0 ||
//         data?.[0]?.CUSTOMERDETAIL?.length === 0 || data?.[0]?.ADDRESS?.length === 0 || data?.[0]?.PDPA?.length === 0) {
//         Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาบันทึกข้อมูลให้ครบทุกส่วน',
//           confirmButtonText: 'ตกลง'
//         });
//         return false
//       } else {
//         navigate('../sale/photo', { state: { fromStep: true, data: data?.[0] } });
//         return true
//       }
//     } else {
//       setToPackage('')
//       setToDiscount('')
//       setToCustDetail('')
//       setToAddress('')
//       setToPDPA('')
//       setToContract('')
//       setToPhoto('')
//     }
//   }

//   // const handleCheckCustStatus = async () => {
//   //   const Model = data?.[0]?.PRODUCT?.[0]?.Package.MODEL
//   //   const conditionCheckResponse = await axios.post(API_URL_POST_CONDITIONSCHECKHISTORY, {
//   //     EmpId, DivisionId, DepartId, DepartGroup, TeamSale, Model
//   //   }, {
//   //     headers: {
//   //       'Content-Type': 'multipart/form-data',
//   //     },
//   //   });

//   //   let updateData;

//   //   if (conditionCheckResponse.data.checktype !== 0) {
//   //     const { value: idCard } = await MySwal.fire({
//   //       title: 'ตรวจสอบประวัติลูกค้า',
//   //       html: `
//   //             <input 
//   //                 id="idCardInput" 
//   //                 type="text" 
//   //                 class="form-control" 
//   //                 placeholder="กรุณากรอกเลขบัตรประชาชน (13 หลัก)" 
//   //                 maxlength="13"
//   //                 oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0,13);" 
//   //             />
//   //         `,
//   //       showCancelButton: true,
//   //       confirmButtonText: 'ตรวจสอบ',
//   //       cancelButtonText: 'ยกเลิก',
//   //       preConfirm: async () => {
//   //         const input = (document.getElementById('idCardInput') as HTMLInputElement).value;
//   //         if (input.length === 13) {
//   //           return input;
//   //         } else {
//   //           MySwal.showValidationMessage('กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก');
//   //           return null;
//   //         }
//   //       }
//   //     });

//   //     if (idCard) {
//   //       const apiResponse = await axios.post(CHECKCUSTOMER_URL, { Search: idCard }, {
//   //         headers: {
//   //           'Content-Type': 'multipart/form-data',
//   //         },
//   //       });

//   //       const { Customerstatus, message } = apiResponse.data;
//   //       const destination = Customerstatus ? '/sale/overview' : '/sale/discount';

//   //       await MySwal.fire({
//   //         text: message,
//   //         icon: Customerstatus ? 'success' : 'success',
//   //         timer: 2000, 
//   //         showConfirmButton: false, 
//   //       });

//   //       updateData = [idCard, conditionCheckResponse.data.checktype, Customerstatus, message];
//   //     }
//   //   } else {
//   //     updateData = ["", conditionCheckResponse.data.checktype, conditionCheckResponse.data.message];
//   //   }

//   //   try {
//   //     const updateContract = await axios.post(UPDATECONTACT, {
//   //       REFNO: item.REFNO ? item.REFNO : refnoFromUpdate,
//   //       EMPID: EmpId,
//   //       TEAMSALE: TeamSale,
//   //       FIELD: "CUSTOMERSTATUS",
//   //       DATA: updateData,
//   //     }, {
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //     });
//   //     // console.log(`updateContract CUSTOMERSTATUS: `, updateContract.data);
//   //     getData();
//   //   } catch (error) {
//   //     console.error('Error updating contract:', error);
//   //     MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตข้อมูลได้', 'error');
//   //   }
//   // }

//   // GET EmpInTeam จาก API
//   useEffect(() => {
//     const getEmpInTeam = async () => {
//       try {
//         const response = await axios.post(EMP_IN_TEAM_URL, { EmpId }, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             'Accept': 'multipart/form-data',
//           },
//         });
//         const apiData = Array.isArray(response.data.data) ? response.data.data : [];
//         setEmpInTeam((prev) => [...new Set([...prev, ...apiData])]); // รวมข้อมูลพนักงานจาก API โดยไม่ซ้ำกัน
//       } catch (error) {
//         console.error('Error fetching EMP_IN_TEAM_URL:', error);
//       }
//     };
//     getEmpInTeam();
//   }, [EmpId]);

//   // ฟังก์ชันจัดการการเลือกพนักงานขายและผู้แนะนำ
//   const handleCheckEmpSale = async () => {
//     // ตรวจสอบสถานะลูกค้าแบล็คลิสต์ (หรือเงื่อนไขอื่น ๆ)
//     if (data?.[0]?.CUSTOMERSTATUS?.[0]?.STATUSSALE === '0') {
//       await Swal.fire({
//         icon: 'error',
//         title: 'เกิดข้อผิดพลาด!',
//         text: 'ลูกค้ามีประวัติแบลคลิสต์ ไม่สามารถทำรายการต่อได้',
//         confirmButtonText: 'ตกลง',
//       });
//       return;
//     }

//     try {
//       // สร้าง inputOptions สำหรับ "พนักงานขาย" จาก empInTeam
//       const empOptions = empInTeam.reduce((options, emp) => {
//         const fullName = `${emp.FName} ${emp.LName}`;
//         options[emp.SaleEmp] = fullName; // ใช้ SaleEmp เป็น key
//         return options;
//       }, {});

//       // สร้าง inputOptions สำหรับ "ผู้แนะนำ" (adviser) จาก adviserList
//       const adviserOptions = adviserList.reduce((options, adv) => {
//         const fullName = `${adv.FName} ${adv.LName}`;
//         options[adv.SaleEmp] = fullName; // ใช้ SaleEmp เป็น key
//         return options;
//       }, {});

//       // ดึงข้อมูล "พนักงานขาย" ปัจจุบันจาก DB (ถ้ามี)
//       const currentEmployee = data?.[0]?.SALEEMPLOYEE?.[0]?.SALEEMPLOYEE;
//       const currentEmployeeId = currentEmployee?.SaleEmp;

//       // ดึงข้อมูล "ผู้แนะนำ" ปัจจุบันจาก DB (ถ้ามี)
//       const currentAdviser = data?.[0]?.SALEEMPLOYEE?.[0]?.ADVISER;
//       const currentAdviserId = currentAdviser?.SaleEmp;

//       // แสดง popup ให้ผู้ใช้เลือกพนักงานขายและผู้แนะนำ (ถ้ามี)
//       const { value: formValues } = await MySwal.fire({
//         title: 'เลือกพนักงานขาย',
//         html: `
//         <select id="swal-employee" class="swal2-input" style="width: 100%; margin-bottom: 1rem;">
//           <option value="">เลือกพนักงานขาย...</option>
//           ${Object.entries(empOptions)
//             .map(([key, value]) => `<option value="${key}">${value}</option>`)
//             .join('')}
//         </select>
//         <select id="swal-adviser" class="swal2-input" style="width: 100%;">
//           <option value="">เลือกผู้แนะนำ (ถ้ามี)</option>
//           ${Object.entries(adviserOptions)
//             .map(([key, value]) => `<option value="${key}">${value}</option>`)
//             .join('')}
//         </select>
//       `,
//         focusConfirm: false,
//         showCancelButton: true,
//         confirmButtonText: 'ตกลง',
//         cancelButtonText: 'ยกเลิก',

//         // ตั้งค่าเริ่มต้นให้ select ทั้ง 2 ตัว
//         didOpen: () => {
//           // ใส่ค่าเริ่มต้น "พนักงานขาย"
//           if (currentEmployeeId) {
//             const empSelect = document.getElementById('swal-employee') as HTMLSelectElement;
//             if (empSelect) {
//               empSelect.value = currentEmployeeId;
//             }
//           }
//           // ใส่ค่าเริ่มต้น "ผู้แนะนำ"
//           if (currentAdviserId) {
//             const advSelect = document.getElementById('swal-adviser') as HTMLSelectElement;
//             if (advSelect) {
//               advSelect.value = currentAdviserId;
//             }
//           }
//         },

//         preConfirm: () => {
//           const employee = (document.getElementById('swal-employee') as HTMLSelectElement).value;
//           const adviser = (document.getElementById('swal-adviser') as HTMLSelectElement).value;

//           // บังคับให้เลือกพนักงานขายเสมอ
//           if (!employee) {
//             Swal.showValidationMessage('กรุณาเลือกพนักงานขาย');
//             return;
//           }

//           // ผู้แนะนำ (adviser) จะว่างได้
//           return { employee, adviser };
//         },
//       });

//       // ถ้าผู้ใช้กดยกเลิกหรือไม่กรอกอะไร formValues จะเป็น undefined
//       if (!formValues) {
//         return;
//       }

//       const { employee, adviser } = formValues;

//       // หา object ของ "พนักงานขาย" ที่เลือก
//       const selectedEmployee = empInTeam.find((emp) => emp.SaleEmp === employee);

//       // หา object ของ "ผู้แนะนำ" (ถ้ามีเลือก)
//       let selectedAdviser: any = null;
//       if (adviser) {
//         selectedAdviser = adviserList.find((adv) => adv.SaleEmp === adviser);
//       }

//       // สร้าง payload สำหรับบันทึกลง DB
//       const payload: any = {
//         SALEEMPLOYEE: selectedEmployee, // เก็บ object ของพนักงานขาย
//       };

//       // ถ้ามีผู้แนะนำ ก็เก็บ object ของผู้แนะนำด้วย
//       if (selectedAdviser) {
//         payload.ADVISER = selectedAdviser;
//       }

//       // เรียก API POST ไปที่ UPDATECONTACT เพื่อบันทึก (พนักงานขาย + ผู้แนะนำ)
//       await axios.post(
//         UPDATECONTACT,
//         {
//           REFNO: data?.[0]?.REFNO,
//           EMPID: EmpId,
//           TEAMSALE: TeamSale,
//           FIELD: 'SALEEMPLOYEE',
//           DATA: [payload],
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       // แสดง popup สำเร็จ
//       await MySwal.fire({
//         icon: 'success',
//         title: 'บันทึกสำเร็จ!',
//         text: `ข้อมูลพนักงานขาย "${selectedEmployee.FName} ${selectedEmployee.LName}"${adviser ? ` และ ผู้แนะนำถูกบันทึกเรียบร้อยแล้ว` : ''
//           }`,
//         timer: 2000,
//         showConfirmButton: false,
//       });

//       // อัปเดตข้อมูลใน state (กรณีต้องการแสดงผลทันทีในหน้าจอ)
//       const updatedData = { ...data[0], SALEEMPLOYEE: [payload] };
//       setData([updatedData]);
//     } catch (error) {
//       console.error('Error updating contract:', error);
//       MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตข้อมูลได้', 'error');
//     }
//   };

//   //แปลงวันที่เป็นไทย
//   const formatThaiDate = (dateString: string): string => {
//     if (!dateString) return '-';
//     const monthsThai = [
//       'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
//       'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
//     ];
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = monthsThai[date.getMonth()];
//     const year = date.getFullYear() + 543; // แปลงปีเป็นพุทธศักราช
//     return `${day} ${month} ${year}`;
//   };

//   // fetch collection ContractImage
//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const response = await axios.get(GET_IMAGES_API);

//         // ตรวจสอบว่า response.data เป็นไปตามโครงสร้างของ ImagesType
//         const data = response.data;

//         if (
//           data &&
//           typeof data === 'object' &&
//           'IMAGECARD' in data &&
//           'IMAGEGPS' in data &&
//           'IMAGEMAP' in data &&
//           'IMAGECUSTOMERHOME' in data &&
//           'IMAGEINSTALLATION' in data &&
//           'IMAGETDS' in data &&
//           'IMAGETRADEIN' in data
//         ) {
//           setImages(data as ImagesType);
//         } else {
//           setImages(null);
//         }
//       } catch (err) {
//         console.error('Error fetching images:', err);
//         setImages(null); // ตั้งค่าเป็น null หากมีข้อผิดพลาด
//       }
//     };

//     fetchImages();
//   }, [refno]);

//   return (
//     <>
//       <Content>
//         <div className='d-flex justify-content-between align-items-center mb-7 mt-7 mt-lg-0'>
//           <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
//             data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//             className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
//             <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
//               ขั้นตอนการดำเนินการ
//             </h1>
//             <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//               <li className="breadcrumb-item text-muted">
//                 <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
//                   ระบบขาย
//                 </a></li>
//               <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
//               <li className="breadcrumb-item text-gray-900">ขั้นตอนการดำเนินการ</li>
//             </ul>
//           </div>
//         </div>

//         {/* Card Body */}

//         {isLoadingFinish ? (
//           <div className="text-center my-10">
//             <ThreeDot />
//           </div>
//         ) : data.length > 0 && (
//           <>
//             <div className='card mb-10'>
//               <div className='card-body d-flex align-items-center'>
//                 <div className='flex-grow-1'>
//                   <div className='text-gray-800 text-hover-primary fw-bold fs-4'>
//                     {`REFNO: ${item?.REFNO || refnoFromUpdate}`}
//                   </div>
//                   <span className={`${data?.[0]?.STATUS === 'DRAFT' ? 'text-warning' : 'text-danger'} fw-semibold d-block fs-6`}>{`สถานะ: ${data?.[0]?.STATUS === 'DRAFT' ? 'ยังไม่ได้ตรวจสอบ' : 'แก้ไข'}`}</span>
//                   {
//                     data?.[0]?.CHECKKERCOMMENT?.[0]?.COMMENT && (
//                       <span className={`text-danger fw-semibold d-block fs-6`}>{`คอมเมนต์: ${data?.[0]?.CHECKKERCOMMENT?.[0]?.COMMENT}`}</span>
//                     )
//                   }
//                 </div>
//               </div>
//               <div className='card-body d-flex align-items-center py-5 pt-6'>
//                 <div className='col-12'>

//                   <Link to={toPackage} state={data?.[0]} onClick={() => handleClick('updateSalePackage')}>
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data?.[0]?.PRODUCT?.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
//                           {`1. เลือกแพ็คเกจ`}
//                         </div>
//                         {
//                           data?.[0]?.PRODUCT?.length !== 0 && (
//                             <span className='text-gray-700 fw-semibold d-block'>{`สินค้า: ${data?.[0]?.PRODUCT?.[0]?.ItemDescription}`}</span>
//                           )
//                         }
//                         {
//                           data?.[0]?.PRODUCT?.length &&
//                           data?.[0]?.PRODUCT?.[0]?.Package.length && (
//                             <span className='text-gray-700 fw-semibold d-block'>{`แพ็คเกจ: ${data?.[0]?.PRODUCT?.[0]?.Package[0]?.PACKAGETITLE ? data?.[0]?.PRODUCT?.[0]?.Package[0]?.PACKAGETITLE : 'ไม่มีแพ็คเกจ'}`}</span>
//                           )
//                         }
//                       </div>
//                     </div>
//                   </Link>
//                   {/* <Link onClick={handleCheckCustStatus} to={''}> */}
//                   {/* <a onClick={handleCheckCustStatus} style={{ cursor: 'pointer' }}>
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data?.[0]?.CUSTOMERSTATUS.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 fw-bold fs-2'>
//                           {`2. ตรวจสอบข้อมูลลูกค้า`}
//                         </div>
//                         {
//                           data?.[0]?.CUSTOMERSTATUS?.length !== 0 && data?.[0]?.CUSTOMERSTATUS?.length > 0 && (
//                             <span className='text-gray-700 fw-semibold d-block'>{`สถานะ: ${data?.[0]?.CUSTOMERSTATUS?.[0].MESSAGE ? data?.[0]?.CUSTOMERSTATUS?.[0].MESSAGE : ''}`}</span>
//                           )
//                         }
//                       </div>
//                     </div>
//                   </a> */}
//                   <Link
//                     to={data?.[0]?.PRODUCT?.length > 0 ? toStatusCust : '#'}
//                     state={data?.[0]}
//                     onClick={() => {
//                       // ถ้ามี PRODUCT => ให้ทำงาน handleClick('updateSalesSatusCust')
//                       if (data?.[0]?.PRODUCT?.length > 0) {
//                         handleClick('updateSalesSatusCust')
//                       } else {
//                         // ถ้าไม่มี PRODUCT => ไม่ต้องไปไหน และแจ้งเตือนผู้ใช้
//                         Swal.fire({
//                           icon: 'warning',
//                           title: 'กรุณาเลือกแพ็คเกจก่อน',
//                           text: 'กรุณาบันทึกข้อมูลสินค้าและแพ็คเกจสินค้าก่อนตรวจสอบลูกค้า',
//                           confirmButtonText: 'ตกลง',
//                         });
//                       }
//                     }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       {/* ถ้า CUSTOMERSTATUS เป็น 0 => ขึ้นสีแดง, ไม่ใช่ => ขึ้นสีเขียว */}
//                       <span
//                         className={`bullet bullet-vertical h-40px ${data?.[0]?.CUSTOMERSTATUS?.length === 0 ? 'bg-danger' : 'bg-success'
//                           }`}
//                       ></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 fw-bold fs-2'>2. ตรวจสอบข้อมูลลูกค้า</div>
//                         {
//                           data?.[0]?.CUSTOMERSTATUS?.length !== 0 && (
//                             <span className="text-gray-700 fw-semibold d-block">
//                               สถานะ: {
//                                 typeof data?.[0]?.CUSTOMERSTATUS?.[0] === 'string'
//                                   ? // กรณีเป็น string (เช่น "ไม่พบประวัติลูกค้า")
//                                   data?.[0]?.CUSTOMERSTATUS?.[0]
//                                   : // กรณีเป็น object STATUSSALE === '1'
//                                   data?.[0]?.CUSTOMERSTATUS?.[0]?.STATUSSALE === '1'
//                                     ? 'ผ่าน'
//                                     // กรณี STATUSSALE === '2'
//                                     : data?.[0]?.CUSTOMERSTATUS?.[0]?.MESSAGE || ''
//                               }
//                             </span>
//                           )
//                         }
//                       </div>
//                     </div>
//                   </Link>
//                   {/* <a
//                     style={{ cursor: 'pointer', textDecoration: 'none' }}
//                     onClick={() => handleClick('updateSaleDiscount')}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data?.[0]?.DISCOUNT?.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
//                           {`3. ส่วนลด/เครื่องเทิร์น/ของแถม`}
//                         </div>
//                       </div>
//                     </div>
//                   </a> */}
//                   <a
//                     style={{ cursor: 'pointer', textDecoration: 'none' }}
//                     onClick={() => {
//                       if (data?.[0]?.CUSTOMERSTATUS?.length === 0) {
//                         // ถ้าไม่มี CUSTOMERSTATUS => ให้แจ้งเตือน
//                         Swal.fire({
//                           icon: 'error',
//                           title: 'เกิดข้อผิดพลาด',
//                           text: 'กรุณาตรวจสอบข้อมูลลูกค้าก่อน',
//                           confirmButtonText: 'ตกลง'
//                         })
//                       } else {
//                         // ถ้ามี CUSTOMERSTATUS => ทำงานปกติ
//                         handleClick('updateSaleDiscount')
//                       }
//                     }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span
//                         className={`bullet bullet-vertical h-40px ${data?.[0]?.DISCOUNT?.length === 0 ? 'bg-danger' : 'bg-success'
//                           }`}
//                       ></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
//                           {`3. ส่วนลด/เครื่องเทิร์น/ของแถม`}
//                         </div>
//                       </div>
//                     </div>
//                   </a>
//                   {/* <Link onClick={handleCheckCustStatus} to={''}> */}
//                   {/* <a onClick={handleCheckEmpSale} style={{ cursor: 'pointer' }}>
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data?.[0]?.SALEEMPLOYEE.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 fw-bold fs-2'>
//                           {`4. เลือกพนักงานขาย`}
//                         </div>
//                         {
//                           data?.[0]?.SALEEMPLOYEE?.length !== 0 && (
//                             <>
//                               <span className='text-gray-700 fw-semibold d-block'>{`พนักงานขาย: 
//                               ${data?.[0]?.SALEEMPLOYEE[0]?.SALEEMPLOYEE?.FName} ${data?.[0]?.SALEEMPLOYEE[0]?.SALEEMPLOYEE?.LName}`}
//                               </span>
//                               {
//                                 data?.[0]?.SALEEMPLOYEE[0]?.ADVISER && (
//                                   <span className='text-gray-700 fw-semibold d-block'>{`ผู้แนะนำ: 
//                               ${data?.[0]?.SALEEMPLOYEE[0]?.ADVISER?.FName} ${data?.[0]?.SALEEMPLOYEE[0]?.ADVISER?.LName}`}
//                                   </span>
//                                 )
//                               }
//                             </>
//                           )
//                         }
//                       </div>
//                     </div>
//                   </a> */}
//                   <a
//                     style={{ cursor: 'pointer' }}
//                     onClick={() => {
//                       if (data?.[0]?.CUSTOMERSTATUS?.length === 0) {
//                         // ถ้ายังไม่มีการตรวจสอบสถานะลูกค้า => แจ้งเตือน
//                         Swal.fire({
//                           icon: 'error',
//                           title: 'เกิดข้อผิดพลาด',
//                           text: 'กรุณาตรวจสอบข้อมูลลูกค้าก่อน',
//                           confirmButtonText: 'ตกลง'
//                         })
//                       } if (data?.[0]?.CUSTOMERSTATUS?.length === 0 && data?.[0]?.DISCOUNT?.length === 0) {
//                         // ถ้ายังไม่มีการตรวจสอบสถานะลูกค้า => แจ้งเตือน
//                         Swal.fire({
//                           icon: 'error',
//                           title: 'เกิดข้อผิดพลาด',
//                           text: 'กรุณาทำขั้นตอนก่อนหน้าให้เสร็จก่อน',
//                           confirmButtonText: 'ตกลง'
//                         })
//                       } else {
//                         // ถ้ามี CUSTOMERSTATUS อยู่แล้ว => เรียก handleCheckEmpSale ปกติ
//                         handleCheckEmpSale()
//                       }
//                     }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data?.[0]?.SALEEMPLOYEE.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 fw-bold fs-2'>
//                           {`4. เลือกพนักงานขาย`}
//                         </div>
//                         {data?.[0]?.SALEEMPLOYEE?.length !== 0 && (
//                           <>
//                             <span className='text-gray-700 fw-semibold d-block'>
//                               {`พนักงานขาย: ${data?.[0]?.SALEEMPLOYEE[0]?.SALEEMPLOYEE?.FName} ${data?.[0]?.SALEEMPLOYEE[0]?.SALEEMPLOYEE?.LName}`}
//                             </span>
//                             {data?.[0]?.SALEEMPLOYEE[0]?.ADVISER && (
//                               <span className='text-gray-700 fw-semibold d-block'>
//                                 {`ผู้แนะนำ: ${data?.[0]?.SALEEMPLOYEE[0]?.ADVISER?.FName} ${data?.[0]?.SALEEMPLOYEE[0]?.ADVISER?.LName}`}
//                               </span>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </a>
//                   <button
//                     onClick={async () => {
//                       const result = await handleClick('updateCustDetail');  // รอให้ handleClick ทำงานเสร็จ
//                       if (result) {
//                         navigate(toCustDetail, { state: data?.[0] });  // นำทางถ้าเงื่อนไขผ่าน
//                       }
//                     }}
//                     className='w-100 text-start border-0 bg-transparent p-0'
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data?.[0]?.CUSTOMERDETAIL.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
//                           {`5. บันทึกข้อมูลลูกค้า`}
//                         </div>
//                         {
//                           data?.[0]?.CUSTOMERDETAIL?.length !== 0 && (
//                             <span className='text-gray-700 fw-semibold d-block'>{`ปะเภทลูกค้า: ${data?.[0]?.CUSTOMERDETAIL?.[0]?.CUSTOMERTYPENAME}`}</span>
//                           )
//                         }
//                         {
//                           data?.[0]?.CUSTOMERDETAIL?.length !== 0 && (
//                             data?.[0]?.CUSTOMERDETAIL?.CUSTOMERTYPE === 1 ?
//                               <span className='text-gray-700 fw-semibold d-block'>{`ชื่อบริษัท: ${data?.[0]?.CUSTOMERDETAIL?.[0]?.CUSTOMERNAME}`}</span>
//                               :
//                               <span className='text-gray-700 fw-semibold d-block'>{`ชื่อลูกค้า: ${data?.[0]?.CUSTOMERDETAIL?.[0]?.CUSTOMERNAME}`}</span>
//                           )
//                         }
//                       </div>
//                     </div>
//                   </button>
//                   <button
//                     onClick={async () => {
//                       const result = await handleClick('updateAddress');  // รอให้ handleClick ทำงานเสร็จ
//                       if (result) {
//                         navigate(toAddress, { state: data?.[0] });  // นำทางถ้าเงื่อนไขผ่าน
//                       }
//                     }}
//                     className='w-100 text-start border-0 bg-transparent p-0'
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data?.[0]?.ADDRESS.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
//                           {`6. บันทึกที่อยู่ลูกค้า`}
//                         </div>
//                         {
//                           data?.[0]?.ADDRESS?.length !== 0 && (
//                             <span className='text-gray-700 fw-semibold d-block'>{`ที่อยู่ตามบัตรฯ: ${data?.[0]?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSSUBDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSZIPCODE}`}</span>
//                           )
//                         }
//                         {
//                           data?.[0]?.ADDRESS?.length !== 0 && (
//                             <span className='text-gray-700 fw-semibold d-block'>{`ที่อยู่ติดตั้ง: ${data?.[0]?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE}`}</span>
//                           )
//                         }
//                         {
//                           data?.[0]?.ADDRESS?.length !== 0 && (
//                             <span className='text-gray-700 fw-semibold d-block'>{`ที่อยู่เก็บเงิน: ${data?.[0]?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE}`}</span>
//                           )
//                         }
//                       </div>
//                     </div>
//                   </button>
//                   <button
//                     onClick={async () => {
//                       const result = await handleClick('UpdateSalesPDPA');  // รอให้ handleClick ทำงานเสร็จ
//                       if (result) {
//                         navigate(toPDPA, { state: data?.[0] });  // นำทางถ้าเงื่อนไขผ่าน
//                       }
//                     }}
//                     className='w-100 text-start border-0 bg-transparent p-0'
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data?.[0]?.PDPA.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
//                           {`7. PDPA`}
//                         </div>
//                         {
//                           data?.[0]?.PDPA?.length !== 0 && (
//                             <span className='text-gray-700 fw-semibold d-block'>{`การยืนยอมให้ใช้ข้อมูล: ${data?.[0]?.PDPA?.[0].CONSENTGIVEN ? 'ยินยอม' : 'ไม่ยินยอม'}`}</span>
//                           )
//                         }
//                       </div>
//                     </div>
//                   </button>
//                   <button
//                     onClick={async () => {
//                       const result = await handleClick('UpdateSalesContract');  // รอให้ handleClick ทำงานเสร็จ
//                       if (result) {
//                         navigate(toContract, { state: data?.[0] });  // นำทางถ้าเงื่อนไขผ่าน
//                       }
//                     }}
//                     className='w-100 text-start border-0 bg-transparent p-0'
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data?.[0]?.PDPA.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
//                           {`8. รายละเอียดสัญญา`}
//                         </div>
//                         {data?.[0]?.CONTRACT?.length !== 0 && (
//                           <span className='text-gray-700 fw-semibold d-block'>
//                             {`วันที่ทำสัญญา: ${data?.[0]?.CONTRACT?.[0]?.createdAt ? (data[0].CONTRACT[0].createdAt) : '-'}`}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </button>
//                   <button
//                     style={{
//                       background: 'none',
//                       border: 'none',
//                       padding: 0,
//                       color: 'inherit',
//                       cursor: 'pointer',
//                       fontSize: 'inherit',
//                     }}
//                     onClick={() => handleClick('photo')}
//                     type='button'
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span
//                         className={`bullet bullet-vertical h-40px ${images &&
//                           Object.values(images).some((field) => Array.isArray(field) && field.length > 0)
//                           ? 'bg-success'
//                           : 'bg-danger'
//                           }`}
//                       ></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
//                           {`9. ถ่ายรูป`}
//                         </div>
//                       </div>
//                     </div>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* End Card Body */}

//             <div className='d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10'>
//               <Link to='/sale/overview' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
//                 ย้อนกลับ
//               </Link>
//             </div>

//             {/* ปุ่มในหน้าจอเล็ก */}
//             <div
//               className="d-flex d-xl-none justify-content-start align-items-center bg-light p-3 border-top"
//               style={{
//                 position: "fixed",
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 zIndex: 1050,
//               }}
//             >
//               <Link to='/sale/overview' className='btn btn-secondary align-self-center mb-2 mb-md-0'>
//                 ย้อนกลับ
//               </Link>
//             </div>

//           </>
//         )}
//       </Content>
//     </>
//   )
// }

// export default Step





// import { Link, useLocation, useNavigate } from 'react-router-dom'
// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import { useAuth } from '../../../../modules/auth/core/Auth';
// import { Content } from '../../../../../_metronic/layout/components/content'
// import useRefnoBarcodeStore from "../accessCam/refnoBarcodeStore";

// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// import { ThreeDot } from 'react-loading-indicators';

// //useStore
// import {
//   useCategoryStore
// } from '../../../../modules/stores/sales/packageStore/packageStore';

// interface ItemProps {
//   REFNO: string;
//   CONTNO: string;
//   EMPID: string;
//   TEAMSALE: string;
//   SALECODE: string;
//   SUPEMPID: string;
//   SECEMPID: string;
//   STATUS: string;
//   PRODUCT: [any];
//   CUSTOMERSTATUS: [any];
//   DISCOUNT: [any];
//   CUSTOMERDETAIL: [any];
//   ADDRESS: [any];
//   PDPA: [any];
//   CONTRACT: [any];
//   IMAGE: [any];
//   CHECKERCOMMENT: [any];
//   item?: {
//     REFNO: string; // เพิ่ม item เป็น optional object
//   };
// }

// interface ImagesType {
//   IMAGECARD: string[];
//   IMAGEGPS: string[];
//   IMAGEMAP: string[];
//   IMAGECUSTOMERHOME: string[];
//   IMAGEINSTALLATION: string[];
//   IMAGETDS: string[];
//   IMAGECUSTOMER: string[];
//   IMAGETRADEIN: string[];
// }

// const Step: React.FC = () => {
//   const MySwal = withReactContent(Swal);
//   const location = useLocation();
//   const navigate = useNavigate()
//   const item = location.state as ItemProps || [];
//   // console.log(`item`, item);

//   const refnoFromUpdate = useRefnoBarcodeStore((state: any) => state.refno || item?.REFNO || ""); // เพิ่มค่าเริ่มต้น
//   const refno = item.REFNO ? item.REFNO : refnoFromUpdate
//   // console.log(`refno`, refno);

//   const [data, setData] = useState<any[]>([])
//   console.log(`data`, data);
//   const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//   const GET_CONTRACT_URL = `${API_URL_MONGO}/Contract/GetContractSummary`;
//   const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
//   const GET_IMAGES_API = `${API_URL_MONGO}/Contract/GetContractImage?REFNO=${refno}`;

//   const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
//   const API_URL_POST_CONDITIONSCHECKHISTORY = `${API_SALECONNEXT}/ConditionsCheckHistory`;

//   const API_URL_POST_CHECKCUSTOMER = import.meta.env.VITE_APP_API_THIENSURAT;
//   const CHECKCUSTOMER_URL = `${API_URL_POST_CHECKCUSTOMER}/CheckCustomer`;

//   const API_URL_TSR = import.meta.env.VITE_APP_API_THIENSURAT;
//   const EMP_IN_TEAM_URL = `${API_URL_TSR}/Employee_Structure`;
//   const ADVISER_URL = `${API_URL_TSR}/Employee_Structure/Emp_All`;

//   const { auth } = useAuth();

//   const {
//     EmpId, setEmpId,
//     TeamSale, setTeamSale,
//     SaleCode, setSaleCode,
//     SupEmpId, setSupEmpId,
//     SecEmpId, setSecEmpId,
//     DivisionId, setDivisionId,
//     DepartId, setDepartId,
//     DepartGroup, setDepartGroup,
//   } = useCategoryStore();

//   const [isLoadingFinish, setIsLoadingFinish] = useState<boolean>(false);

//   const [images, setImages] = useState<ImagesType | null>(null);
//   // console.log(`images`, images);

//   const getData = async () => {
//     setIsLoadingFinish(true);
//     try {
//       const response = await axios.get(GET_CONTRACT_URL + '?refno=' + refno, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       const data = Array.isArray(response.data.data) ? response.data.data : [];
//       setData(data);
//       // console.log('Load data', data)
//     } catch (error) {
//       console.error('Error fetching DRAFT_ALLCONTRACT_URL:', error);
//     } finally {
//       setIsLoadingFinish(false);
//     }
//   };

//   useEffect(() => {
//     if (refno) {
//       getData(); // ดึงข้อมูลเมื่อ refno ถูกตั้งค่าแล้ว
//     } else {
//       console.warn("REFNO is undefined");
//     }
//   }, [refno]);

//   useEffect(() => {
//     getData();
//     setEmpId(auth.data[0].EmpId);
//     setTeamSale(auth.data[0].TeamSale);
//     setSaleCode(auth.data[0].SaleCode);
//     setSupEmpId(auth.data[0].SupEmp);
//     setSecEmpId(auth.data[0].SecEmp);
//     setDivisionId(auth.data[0].DivisionId);
//     setDepartId(auth.data[0].DepartId);
//     setDepartGroup(auth.data[0].DepartGroup);
//   }, [location]);

//   useEffect(() => {
//     if (data?.[0]?.PRODUCT?.length > 0) {
//       setToPackage('../sale/update/updateSalePackage')
//       setToStatusCust('../sale/update/updateSalesSatusCust')
//       setToPhoto('../sale/photo')
//       setToDiscount('../sale/update/updateSaleDiscount')
//     }

//     if (data?.[0]?.CUSTOMERSTATUS?.length > 0) {
//       setToStatusCust('../sale/update/updateSalesSatusCust')
//     }

//     if (data?.[0]?.DISCOUNT?.length > 0) {
//       setToDiscount('../sale/update/updateSaleDiscount')
//       setToCustDetail('../sale/update/updateCustDetail')
//     }

//     if (data?.[0]?.CUSTOMERDETAIL?.length > 0) {
//       setToCustDetail('../sale/update/updateCustDetail')
//       setToAddress('../sale/update/updateAddress')
//     }

//     if (data?.[0]?.ADDRESS?.length > 0) {
//       setToAddress('../sale/update/updateAddress')
//       setToPDPA('../sale/update/UpdateSalesPDPA')
//     }

//     if (data?.[0]?.PDPA?.length > 0) {
//       setToPDPA('../sale/update/UpdateSalesPDPA')
//       setToContract('../sale/update/UpdateSalesContract')
//     }

//     if (data?.[0]?.PDPA?.length > 0) {
//       setToContract('../sale/update/UpdateSalesContract')
//       setToPhoto('../sale/photo')
//     }
//   }, [data, location]);

//   const [toPackage, setToPackage] = useState('')
//   const [toStatusCust, setToStatusCust] = useState('')
//   const [toDiscount, setToDiscount] = useState('')
//   const [toCustDetail, setToCustDetail] = useState('')
//   const [toAddress, setToAddress] = useState('')
//   const [toPDPA, setToPDPA] = useState('')
//   const [toContract, setToContract] = useState('')
//   const [toPhoto, setToPhoto] = useState('')

//   const [empInTeam, setEmpInTeam] = useState<any[]>([]);
//   const [adviserList, setAdviserList] = useState<any[]>([]);

//   // กำหนดค่าเริ่มต้นของพนักงานจาก `data`
//   useEffect(() => {
//     const saleEmployee = data?.[0]?.SALEEMPLOYEE?.[0];
//     if (saleEmployee) {
//       setEmpInTeam((prev) => [...prev, saleEmployee]); // รวมพนักงานที่มีอยู่ใน `data`
//     }
//   }, [data]);

//   // api ผู้แนะนำ
//   useEffect(() => {
//     const getAdviserData = async () => {
//       try {
//         const formData = new FormData();
//         formData.append('EmpId', EmpId);

//         const response = await axios.post(ADVISER_URL, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         const data = Array.isArray(response.data.data) ? response.data.data : [];
//         setAdviserList(data);
//       } catch (error) {
//         console.error('Error fetching ADVISER_URL:', error);
//       }
//     };
//     getAdviserData();
//   }, []);

//   const handleClick = async (routeName: any) => {

//     if (routeName === 'updateSalesSatusCust' && data?.[0]?.PDPA > 0) {
//       setToStatusCust('../sale/update/updateSalesSatusCust'); // อนุญาตให้ทำขั้นตอนนี้ได้
//       navigate('../sale/update/updateSalesSatusCust', { state: data?.[0] });
//       return true;
//     }

//     // ตรวจสอบสถานะลูกค้าแบคลิสต์
//     if (routeName === 'updateSaleDiscount') {
//       if (data?.[0]?.CUSTOMERSTATUS?.[0]?.STATUSSALE === "0") {
//         await Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'ลูกค้ามีประวัติแบลคลิสต์ ไม่สามารถทำรายการต่อได้',
//           confirmButtonText: 'ตกลง',
//         });
//         return false;
//       } else {
//         setToDiscount('../sale/update/updateSaleDiscount');
//         navigate('../sale/update/updateSaleDiscount', { state: data?.[0] });
//         return true;
//       }
//     }

//     if (routeName === 'updateCustDetail' && data?.[0]?.CUSTOMERSTATUS?.[0]?.STATUSSALE === "0") {
//       await Swal.fire({
//         icon: 'error',
//         title: 'เกิดข้อผิดพลาด!',
//         text: 'ลูกค้ามีประวัติแบลคลิสต์ ไม่สามารถทำรายการต่อได้',
//         confirmButtonText: 'ตกลง',
//       });
//       return false;
//     }

//     if (routeName === 'updateAddress' && data?.[0]?.CUSTOMERSTATUS?.[0]?.STATUSSALE === "0") {
//       await Swal.fire({
//         icon: 'error',
//         title: 'เกิดข้อผิดพลาด!',
//         text: 'ลูกค้ามีประวัติแบลคลิสต์ ไม่สามารถทำรายการต่อได้',
//         confirmButtonText: 'ตกลง',
//       });
//       return false;
//     }

//     if (routeName === 'UpdateSalesPDPA' && data?.[0]?.CUSTOMERSTATUS?.[0]?.STATUSSALE === "0") {
//       await Swal.fire({
//         icon: 'error',
//         title: 'เกิดข้อผิดพลาด!',
//         text: 'ลูกค้ามีประวัติแบลคลิสต์ ไม่สามารถทำรายการต่อได้',
//         confirmButtonText: 'ตกลง',
//       });
//       return false;
//     }

//     if (routeName === 'UpdateSalesContract' && data?.[0]?.CUSTOMERSTATUS?.[0]?.STATUSSALE === "0") {
//       await Swal.fire({
//         icon: 'error',
//         title: 'เกิดข้อผิดพลาด!',
//         text: 'ลูกค้ามีประวัติแบลคลิสต์ ไม่สามารถทำรายการต่อได้',
//         confirmButtonText: 'ตกลง',
//       });
//       return false;
//     }

//     if (routeName === 'photo' && data?.[0]?.CUSTOMERSTATUS?.[0]?.STATUSSALE === "0") {
//       await Swal.fire({
//         icon: 'error',
//         title: 'เกิดข้อผิดพลาด!',
//         text: 'ลูกค้ามีประวัติแบลคลิสต์ ไม่สามารถทำรายการต่อได้',
//         confirmButtonText: 'ตกลง',
//       });
//       return false;
//     }

//     if (routeName === 'updateSalePackage') {
//       setToPackage('../sale/update/updateSalePackage')
//       return true;
//     }
//     if (routeName === 'updateSaleDiscount') {
//       if (data?.[0]?.CUSTOMERSTATUS?.length === 0) {
//         Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาตรวจสอบสถานะลูกค้าก่อน',
//           confirmButtonText: 'ตกลง'
//         });
//         return false
//       }
//       else if (data?.[0]?.PRODUCT?.length === 0) {
//         Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาบันทึกข้อมูลสินค้าและแพ็คเกจสินค้าก่อน',
//           confirmButtonText: 'ตกลง'
//         });
//         return false
//       } else {
//         setToDiscount('../sale/update/updateSaleDiscount')
//         return true
//       }
//     }
//     else if (routeName === 'updateCustDetail') {
//       // console.log('SALEEMPLOYEE:', data?.[0]?.SALEEMPLOYEE); // ตรวจสอบข้อมูล
//       if (!data?.[0]?.SALEEMPLOYEE || data?.[0]?.SALEEMPLOYEE.length === 0) {
//         await Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาบันทึกข้อมูลพนักงานขายก่อน',
//           confirmButtonText: 'ตกลง',
//         });
//         return false
//       }

//       console.log('Navigating to updateCustDetail'); // Debugging point
//       await new Promise((resolve) => setTimeout(resolve, 100));
//       setToCustDetail('../sale/update/updateCustDetail');
//       navigate('../sale/update/updateCustDetail', { state: data?.[0] });
//       return true
//     }
//     else if (routeName === 'updateAddress') {
//       if (data?.[0]?.CUSTOMERDETAIL?.length === 0) {
//         Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาบันทึกข้อมูลลูกค้าก่อน',
//           confirmButtonText: 'ตกลง'
//         });
//         return false
//       } else {
//         setToAddress('../sale/update/updateAddress')
//         return true
//       }
//     }
//     else if (routeName === 'UpdateSalesPDPA') {
//       if (data?.[0]?.ADDRESS?.length === 0) {
//         Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาบันทึกข้อมูลที่อยู่ก่อน',
//           confirmButtonText: 'ตกลง'
//         });
//         return false
//       } else {
//         setToPDPA('../sale/update/UpdateSalesPDPA')
//         return true
//       }
//     }
//     else if (routeName === 'UpdateSalesContract') {
//       if (data?.[0]?.PRODUCT?.length === 0 || data?.[0]?.CUSTOMERSTATUS?.length === 0 ||
//         data?.[0]?.CUSTOMERDETAIL?.length === 0 || data?.[0]?.ADDRESS?.length === 0 || data?.[0]?.PDPA?.length === 0) {
//         Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาบันทึกข้อมูลให้ครบทุกส่วน',
//           confirmButtonText: 'ตกลง'
//         });
//         return false
//       } else {
//         setToContract('../sale/update/UpdateSalesContract')
//         return true
//       }
//     }
//     else if (routeName === 'photo') {
//       if (data?.[0]?.PRODUCT?.length === 0 || data?.[0]?.CUSTOMERSTATUS?.length === 0 ||
//         data?.[0]?.CUSTOMERDETAIL?.length === 0 || data?.[0]?.ADDRESS?.length === 0 || data?.[0]?.PDPA?.length === 0) {
//         Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาบันทึกข้อมูลให้ครบทุกส่วน',
//           confirmButtonText: 'ตกลง'
//         });
//         return false
//       } else {
//         navigate('../sale/photo', { state: { fromStep: true, data: data?.[0] } });
//         return true
//       }
//     } else {
//       setToPackage('')
//       setToDiscount('')
//       setToCustDetail('')
//       setToAddress('')
//       setToPDPA('')
//       setToContract('')
//       setToPhoto('')
//     }
//   }

//   // const handleCheckCustStatus = async () => {
//   //   const Model = data?.[0]?.PRODUCT?.[0]?.Package.MODEL
//   //   const conditionCheckResponse = await axios.post(API_URL_POST_CONDITIONSCHECKHISTORY, {
//   //     EmpId, DivisionId, DepartId, DepartGroup, TeamSale, Model
//   //   }, {
//   //     headers: {
//   //       'Content-Type': 'multipart/form-data',
//   //     },
//   //   });

//   //   let updateData;

//   //   if (conditionCheckResponse.data.checktype !== 0) {
//   //     const { value: idCard } = await MySwal.fire({
//   //       title: 'ตรวจสอบประวัติลูกค้า',
//   //       html: `
//   //             <input 
//   //                 id="idCardInput" 
//   //                 type="text" 
//   //                 class="form-control" 
//   //                 placeholder="กรุณากรอกเลขบัตรประชาชน (13 หลัก)" 
//   //                 maxlength="13"
//   //                 oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0,13);" 
//   //             />
//   //         `,
//   //       showCancelButton: true,
//   //       confirmButtonText: 'ตรวจสอบ',
//   //       cancelButtonText: 'ยกเลิก',
//   //       preConfirm: async () => {
//   //         const input = (document.getElementById('idCardInput') as HTMLInputElement).value;
//   //         if (input.length === 13) {
//   //           return input;
//   //         } else {
//   //           MySwal.showValidationMessage('กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก');
//   //           return null;
//   //         }
//   //       }
//   //     });

//   //     if (idCard) {
//   //       const apiResponse = await axios.post(CHECKCUSTOMER_URL, { Search: idCard }, {
//   //         headers: {
//   //           'Content-Type': 'multipart/form-data',
//   //         },
//   //       });

//   //       const { Customerstatus, message } = apiResponse.data;
//   //       const destination = Customerstatus ? '/sale/overview' : '/sale/discount';

//   //       await MySwal.fire({
//   //         text: message,
//   //         icon: Customerstatus ? 'success' : 'success',
//   //         timer: 2000, 
//   //         showConfirmButton: false, 
//   //       });

//   //       updateData = [idCard, conditionCheckResponse.data.checktype, Customerstatus, message];
//   //     }
//   //   } else {
//   //     updateData = ["", conditionCheckResponse.data.checktype, conditionCheckResponse.data.message];
//   //   }

//   //   try {
//   //     const updateContract = await axios.post(UPDATECONTACT, {
//   //       REFNO: item.REFNO ? item.REFNO : refnoFromUpdate,
//   //       EMPID: EmpId,
//   //       TEAMSALE: TeamSale,
//   //       FIELD: "CUSTOMERSTATUS",
//   //       DATA: updateData,
//   //     }, {
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //     });
//   //     // console.log(`updateContract CUSTOMERSTATUS: `, updateContract.data);
//   //     getData();
//   //   } catch (error) {
//   //     console.error('Error updating contract:', error);
//   //     MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตข้อมูลได้', 'error');
//   //   }
//   // }

//   // GET EmpInTeam จาก API
//   useEffect(() => {
//     const getEmpInTeam = async () => {
//       try {
//         const response = await axios.post(EMP_IN_TEAM_URL, { EmpId }, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             'Accept': 'multipart/form-data',
//           },
//         });
//         const apiData = Array.isArray(response.data.data) ? response.data.data : [];
//         setEmpInTeam((prev) => [...new Set([...prev, ...apiData])]); // รวมข้อมูลพนักงานจาก API โดยไม่ซ้ำกัน
//       } catch (error) {
//         console.error('Error fetching EMP_IN_TEAM_URL:', error);
//       }
//     };
//     getEmpInTeam();
//   }, [EmpId]);

//   // ฟังก์ชันจัดการการเลือกพนักงานขายและผู้แนะนำ
//   const handleCheckEmpSale = async () => {
//     // ตรวจสอบสถานะลูกค้าแบล็คลิสต์ (หรือเงื่อนไขอื่น ๆ)
//     if (data?.[0]?.CUSTOMERSTATUS?.[0]?.STATUSSALE === '0') {
//       await Swal.fire({
//         icon: 'error',
//         title: 'เกิดข้อผิดพลาด!',
//         text: 'ลูกค้ามีประวัติแบลคลิสต์ ไม่สามารถทำรายการต่อได้',
//         confirmButtonText: 'ตกลง',
//       });
//       return;
//     }

//     try {
//       // สร้าง inputOptions สำหรับ "พนักงานขาย" จาก empInTeam
//       const empOptions = empInTeam.reduce((options, emp) => {
//         const fullName = `${emp.FName} ${emp.LName}`;
//         options[emp.SaleEmp] = fullName; // ใช้ SaleEmp เป็น key
//         return options;
//       }, {});

//       // สร้าง inputOptions สำหรับ "ผู้แนะนำ" (adviser) จาก adviserList
//       const adviserOptions = adviserList.reduce((options, adv) => {
//         const fullName = `${adv.FName} ${adv.LName}`;
//         options[adv.SaleEmp] = fullName; // ใช้ SaleEmp เป็น key
//         return options;
//       }, {});

//       // ดึงข้อมูล "พนักงานขาย" ปัจจุบันจาก DB (ถ้ามี)
//       const currentEmployee = data?.[0]?.SALEEMPLOYEE?.[0]?.SALEEMPLOYEE;
//       const currentEmployeeId = currentEmployee?.SaleEmp;

//       // ดึงข้อมูล "ผู้แนะนำ" ปัจจุบันจาก DB (ถ้ามี)
//       const currentAdviser = data?.[0]?.SALEEMPLOYEE?.[0]?.ADVISER;
//       const currentAdviserId = currentAdviser?.SaleEmp;

//       // แสดง popup ให้ผู้ใช้เลือกพนักงานขายและผู้แนะนำ (ถ้ามี)
//       const { value: formValues } = await MySwal.fire({
//         title: 'เลือกพนักงานขาย',
//         html: `
//         <select id="swal-employee" class="swal2-input" style="width: 100%; margin-bottom: 1rem;">
//           <option value="">เลือกพนักงานขาย...</option>
//           ${Object.entries(empOptions)
//             .map(([key, value]) => `<option value="${key}">${value}</option>`)
//             .join('')}
//         </select>
//         <select id="swal-adviser" class="swal2-input" style="width: 100%;">
//           <option value="">เลือกผู้แนะนำ (ถ้ามี)</option>
//           ${Object.entries(adviserOptions)
//             .map(([key, value]) => `<option value="${key}">${value}</option>`)
//             .join('')}
//         </select>
//       `,
//         focusConfirm: false,
//         showCancelButton: true,
//         confirmButtonText: 'ตกลง',
//         cancelButtonText: 'ยกเลิก',

//         // ตั้งค่าเริ่มต้นให้ select ทั้ง 2 ตัว
//         didOpen: () => {
//           // ใส่ค่าเริ่มต้น "พนักงานขาย"
//           if (currentEmployeeId) {
//             const empSelect = document.getElementById('swal-employee') as HTMLSelectElement;
//             if (empSelect) {
//               empSelect.value = currentEmployeeId;
//             }
//           }
//           // ใส่ค่าเริ่มต้น "ผู้แนะนำ"
//           if (currentAdviserId) {
//             const advSelect = document.getElementById('swal-adviser') as HTMLSelectElement;
//             if (advSelect) {
//               advSelect.value = currentAdviserId;
//             }
//           }
//         },

//         preConfirm: () => {
//           const employee = (document.getElementById('swal-employee') as HTMLSelectElement).value;
//           const adviser = (document.getElementById('swal-adviser') as HTMLSelectElement).value;

//           // บังคับให้เลือกพนักงานขายเสมอ
//           if (!employee) {
//             Swal.showValidationMessage('กรุณาเลือกพนักงานขาย');
//             return;
//           }

//           // ผู้แนะนำ (adviser) จะว่างได้
//           return { employee, adviser };
//         },
//       });

//       // ถ้าผู้ใช้กดยกเลิกหรือไม่กรอกอะไร formValues จะเป็น undefined
//       if (!formValues) {
//         return;
//       }

//       const { employee, adviser } = formValues;

//       // หา object ของ "พนักงานขาย" ที่เลือก
//       const selectedEmployee = empInTeam.find((emp) => emp.SaleEmp === employee);

//       // หา object ของ "ผู้แนะนำ" (ถ้ามีเลือก)
//       let selectedAdviser: any = null;
//       if (adviser) {
//         selectedAdviser = adviserList.find((adv) => adv.SaleEmp === adviser);
//       }

//       // สร้าง payload สำหรับบันทึกลง DB
//       const payload: any = {
//         SALEEMPLOYEE: selectedEmployee, // เก็บ object ของพนักงานขาย
//       };

//       // ถ้ามีผู้แนะนำ ก็เก็บ object ของผู้แนะนำด้วย
//       if (selectedAdviser) {
//         payload.ADVISER = selectedAdviser;
//       }

//       // เรียก API POST ไปที่ UPDATECONTACT เพื่อบันทึก (พนักงานขาย + ผู้แนะนำ)
//       await axios.post(
//         UPDATECONTACT,
//         {
//           REFNO: data?.[0]?.REFNO,
//           EMPID: EmpId,
//           TEAMSALE: TeamSale,
//           FIELD: 'SALEEMPLOYEE',
//           DATA: [payload],
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       // แสดง popup สำเร็จ
//       await MySwal.fire({
//         icon: 'success',
//         title: 'บันทึกสำเร็จ!',
//         text: `ข้อมูลพนักงานขาย "${selectedEmployee.FName} ${selectedEmployee.LName}"${adviser ? ` และ ผู้แนะนำถูกบันทึกเรียบร้อยแล้ว` : ''
//           }`,
//         timer: 2000,
//         showConfirmButton: false,
//       });

//       // อัปเดตข้อมูลใน state (กรณีต้องการแสดงผลทันทีในหน้าจอ)
//       const updatedData = { ...data[0], SALEEMPLOYEE: [payload] };
//       setData([updatedData]);
//     } catch (error) {
//       console.error('Error updating contract:', error);
//       MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตข้อมูลได้', 'error');
//     }
//   };

//   //แปลงวันที่เป็นไทย
//   const formatThaiDate = (dateString: string): string => {
//     if (!dateString) return '-';
//     const monthsThai = [
//       'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
//       'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
//     ];
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = monthsThai[date.getMonth()];
//     const year = date.getFullYear() + 543; // แปลงปีเป็นพุทธศักราช
//     return `${day} ${month} ${year}`;
//   };

//   // fetch collection ContractImage
//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const response = await axios.get(GET_IMAGES_API);

//         // ตรวจสอบว่า response.data เป็นไปตามโครงสร้างของ ImagesType
//         const data = response.data;

//         if (
//           data &&
//           typeof data === 'object' &&
//           'IMAGECARD' in data &&
//           'IMAGEGPS' in data &&
//           'IMAGEMAP' in data &&
//           'IMAGECUSTOMERHOME' in data &&
//           'IMAGEINSTALLATION' in data &&
//           'IMAGETDS' in data &&
//           'IMAGETRADEIN' in data
//         ) {
//           setImages(data as ImagesType);
//         } else {
//           setImages(null);
//         }
//       } catch (err) {
//         console.error('Error fetching images:', err);
//         setImages(null); // ตั้งค่าเป็น null หากมีข้อผิดพลาด
//       }
//     };

//     fetchImages();
//   }, [refno]);

//   return (
//     <>
//       <Content>
//         <div className='d-flex justify-content-between align-items-center mb-7 mt-7 mt-lg-0'>
//           <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
//             data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//             className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
//             <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
//               ขั้นตอนการดำเนินการ
//             </h1>
//             <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//               <li className="breadcrumb-item text-muted">
//                 <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
//                   ระบบขาย
//                 </a></li>
//               <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
//               <li className="breadcrumb-item text-gray-900">ขั้นตอนการดำเนินการ</li>
//             </ul>
//           </div>
//         </div>

//         {/* Card Body */}

//         {isLoadingFinish ? (
//           <div className="text-center my-10">
//             <ThreeDot />
//           </div>
//         ) : data.length > 0 && (
//           <>
//             <div className='card mb-10'>
//               <div className='card-body d-flex align-items-center'>
//                 <div className='flex-grow-1'>
//                   <div className='text-gray-800 text-hover-primary fw-bold fs-4'>
//                     {`REFNO: ${item?.REFNO || refnoFromUpdate}`}
//                   </div>
//                   <span className={`${data?.[0]?.STATUS === 'DRAFT' ? 'text-warning' : 'text-danger'} fw-semibold d-block fs-6`}>{`สถานะ: ${data?.[0]?.STATUS === 'DRAFT' ? 'ยังไม่ได้ตรวจสอบ' : 'แก้ไข'}`}</span>
//                   {
//                     data?.[0]?.CHECKKERCOMMENT?.[0]?.COMMENT && (
//                       <span className={`text-danger fw-semibold d-block fs-6`}>{`คอมเมนต์: ${data?.[0]?.CHECKKERCOMMENT?.[0]?.COMMENT}`}</span>
//                     )
//                   }
//                 </div>
//               </div>
//               <div className='card-body d-flex align-items-center py-5 pt-6'>
//                 <div className='col-12'>

//                   <button
//                     onClick={async () => {
//                       const result = await handleClick('UpdateSalesPDPA');  // รอให้ handleClick ทำงานเสร็จ
//                       if (result) {
//                         navigate(toPDPA, { state: data?.[0] });  // นำทางถ้าเงื่อนไขผ่าน
//                       }
//                     }}
//                     className='w-100 text-start border-0 bg-transparent p-0'
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data?.[0]?.PDPA.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
//                           {`1. PDPA`}
//                         </div>
//                         {
//                           data?.[0]?.PDPA?.length !== 0 && (
//                             <span className='text-gray-700 fw-semibold d-block'>{`การยืนยอมให้ใช้ข้อมูล: ${data?.[0]?.PDPA?.[0].CONSENTGIVEN ? 'ยินยอม' : 'ไม่ยินยอม'}`}</span>
//                           )
//                         }
//                       </div>
//                     </div>
//                   </button>

//                   <div className='d-flex align-items-center pb-8'>
//                     {/* ถ้า CUSTOMERSTATUS เป็น 0 => ขึ้นสีแดง, ไม่ใช่ => ขึ้นสีเขียว */}
//                     <span
//                       className={`bullet bullet-vertical h-40px ${data?.[0]?.CUSTOMERSTATUS?.length === 0 ? 'bg-danger' : 'bg-success'
//                         }`}
//                     ></span>
//                     <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                     <div className='flex-grow-1'>
//                       <div className='text-gray-800 fw-bold fs-2'>2. ตรวจสอบสถานะลูกค้า</div>
//                       {
//                         data?.[0]?.CUSTOMERSTATUS?.length !== 0 && (
//                           <span className="text-gray-700 fw-semibold d-block">
//                             StatusSale: {
//                               data?.[0]?.CUSTOMERSTATUS?.[0]?.StatusSale || ''
//                             }
//                             <br />
//                             สถานะ: {
//                               data?.[0]?.CUSTOMERSTATUS?.[0]?.CustomerStatus || ''
//                             }
//                             <br />
//                             {
//                               data?.[0]?.CUSTOMERSTATUS?.[0]?.Message || ''
//                             }
//                           </span>
//                         )
//                       }
//                     </div>
//                   </div>

//                   <Link to={toPackage} state={data?.[0]} onClick={() => handleClick('updateSalePackage')}>
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data?.[0]?.PRODUCT?.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
//                           {`3. เลือกแพ็คเกจ`}
//                         </div>
//                         {
//                           data?.[0]?.PRODUCT?.length !== 0 && (
//                             <span className='text-gray-700 fw-semibold d-block'>{`สินค้า: ${data?.[0]?.PRODUCT?.[0]?.ItemDescription}`}</span>
//                           )
//                         }
//                         {
//                           data?.[0]?.PRODUCT?.length &&
//                           data?.[0]?.PRODUCT?.[0]?.Package.length && (
//                             <span className='text-gray-700 fw-semibold d-block'>{`แพ็คเกจ: ${data?.[0]?.PRODUCT?.[0]?.Package[0]?.PACKAGETITLE ? data?.[0]?.PRODUCT?.[0]?.Package[0]?.PACKAGETITLE : 'ไม่มีแพ็คเกจ'}`}</span>
//                           )
//                         }
//                       </div>
//                     </div>
//                   </Link>

//                   <Link
//                     to={data?.[0]?.PRODUCT?.length > 0 ? toStatusCust : '#'}
//                     state={data?.[0]}
//                     onClick={() => {
//                       // ถ้ามี PRODUCT => ให้ทำงาน handleClick('updateSalesSatusCust')
//                       if (data?.[0]?.PRODUCT?.length > 0) {
//                         handleClick('updateSalesSatusCust')
//                       } else {
//                         // ถ้าไม่มี PRODUCT => ไม่ต้องไปไหน และแจ้งเตือนผู้ใช้
//                         Swal.fire({
//                           icon: 'warning',
//                           title: 'กรุณาเลือกแพ็คเกจก่อน',
//                           text: 'กรุณาบันทึกข้อมูลสินค้าและแพ็คเกจสินค้าก่อนตรวจสอบลูกค้า',
//                           confirmButtonText: 'ตกลง',
//                         });
//                       }
//                     }}
//                   >
//                   </Link>

//                   <a
//                     style={{ cursor: 'pointer', textDecoration: 'none' }}
//                     onClick={() => {
//                       if (data?.[0]?.CUSTOMERSTATUS?.length === 0) {
//                         // ถ้าไม่มี CUSTOMERSTATUS => ให้แจ้งเตือน
//                         Swal.fire({
//                           icon: 'error',
//                           title: 'เกิดข้อผิดพลาด',
//                           text: 'กรุณาตรวจสอบข้อมูลลูกค้าก่อน',
//                           confirmButtonText: 'ตกลง'
//                         })
//                       } else {
//                         // ถ้ามี CUSTOMERSTATUS => ทำงานปกติ
//                         handleClick('updateSaleDiscount')
//                       }
//                     }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span
//                         className={`bullet bullet-vertical h-40px ${data?.[0]?.DISCOUNT?.length === 0 ? 'bg-danger' : 'bg-success'
//                           }`}
//                       ></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
//                           {`4. ส่วนลด/เครื่องเทิร์น/ของแถม`}
//                         </div>
//                       </div>
//                     </div>
//                   </a>

//                   <a
//                     style={{ cursor: 'pointer' }}
//                     onClick={() => {
//                       if (data?.[0]?.CUSTOMERSTATUS?.length === 0) {
//                         // ถ้ายังไม่มีการตรวจสอบสถานะลูกค้า => แจ้งเตือน
//                         Swal.fire({
//                           icon: 'error',
//                           title: 'เกิดข้อผิดพลาด',
//                           text: 'กรุณาตรวจสอบข้อมูลลูกค้าก่อน',
//                           confirmButtonText: 'ตกลง'
//                         })
//                       } if (data?.[0]?.CUSTOMERSTATUS?.length === 0 && data?.[0]?.DISCOUNT?.length === 0) {
//                         // ถ้ายังไม่มีการตรวจสอบสถานะลูกค้า => แจ้งเตือน
//                         Swal.fire({
//                           icon: 'error',
//                           title: 'เกิดข้อผิดพลาด',
//                           text: 'กรุณาทำขั้นตอนก่อนหน้าให้เสร็จก่อน',
//                           confirmButtonText: 'ตกลง'
//                         })
//                       } else {
//                         // ถ้ามี CUSTOMERSTATUS อยู่แล้ว => เรียก handleCheckEmpSale ปกติ
//                         handleCheckEmpSale()
//                       }
//                     }}
//                   >

//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data?.[0]?.SALEEMPLOYEE.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 fw-bold fs-2'>
//                           {`5. เลือกพนักงานขาย`}
//                         </div>
//                         {data?.[0]?.SALEEMPLOYEE?.length !== 0 && (
//                           <>
//                             <span className='text-gray-700 fw-semibold d-block'>
//                               {`พนักงานขาย: ${data?.[0]?.SALEEMPLOYEE[0]?.SALEEMPLOYEE?.FName} ${data?.[0]?.SALEEMPLOYEE[0]?.SALEEMPLOYEE?.LName}`}
//                             </span>
//                             {data?.[0]?.SALEEMPLOYEE[0]?.ADVISER && (
//                               <span className='text-gray-700 fw-semibold d-block'>
//                                 {`ผู้แนะนำ: ${data?.[0]?.SALEEMPLOYEE[0]?.ADVISER?.FName} ${data?.[0]?.SALEEMPLOYEE[0]?.ADVISER?.LName}`}
//                               </span>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </a>

//                   <button
//                     onClick={async () => {
//                       const result = await handleClick('updateCustDetail');  // รอให้ handleClick ทำงานเสร็จ
//                       if (result) {
//                         navigate(toCustDetail, { state: data?.[0] });  // นำทางถ้าเงื่อนไขผ่าน
//                       }
//                     }}
//                     className='w-100 text-start border-0 bg-transparent p-0'
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data?.[0]?.CUSTOMERDETAIL.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
//                           {`6. บันทึกข้อมูลลูกค้า`}
//                         </div>
//                         {
//                           data?.[0]?.CUSTOMERDETAIL?.length !== 0 && (
//                             <span className='text-gray-700 fw-semibold d-block'>{`ปะเภทลูกค้า: ${data?.[0]?.CUSTOMERDETAIL?.[0]?.CUSTOMERTYPENAME}`}</span>
//                           )
//                         }
//                         {
//                           data?.[0]?.CUSTOMERDETAIL?.length !== 0 && (
//                             data?.[0]?.CUSTOMERDETAIL?.CUSTOMERTYPE === 1 ?
//                               <span className='text-gray-700 fw-semibold d-block'>{`ชื่อบริษัท: ${data?.[0]?.CUSTOMERDETAIL?.[0]?.CUSTOMERNAME}`}</span>
//                               :
//                               <span className='text-gray-700 fw-semibold d-block'>{`ชื่อลูกค้า: ${data?.[0]?.CUSTOMERDETAIL?.[0]?.CUSTOMERNAME}`}</span>
//                           )
//                         }
//                       </div>
//                     </div>
//                   </button>

//                   <button
//                     onClick={async () => {
//                       const result = await handleClick('updateAddress');  // รอให้ handleClick ทำงานเสร็จ
//                       if (result) {
//                         navigate(toAddress, { state: data?.[0] });  // นำทางถ้าเงื่อนไขผ่าน
//                       }
//                     }}
//                     className='w-100 text-start border-0 bg-transparent p-0'
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data?.[0]?.ADDRESS.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
//                           {`7. บันทึกที่อยู่ลูกค้า`}
//                         </div>
//                         {
//                           data?.[0]?.ADDRESS?.length !== 0 && (
//                             <span className='text-gray-700 fw-semibold d-block'>{`ที่อยู่ตามบัตรฯ: ${data?.[0]?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSSUBDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSZIPCODE}`}</span>
//                           )
//                         }
//                         {
//                           data?.[0]?.ADDRESS?.length !== 0 && (
//                             <span className='text-gray-700 fw-semibold d-block'>{`ที่อยู่ติดตั้ง: ${data?.[0]?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE}`}</span>
//                           )
//                         }
//                         {
//                           data?.[0]?.ADDRESS?.length !== 0 && (
//                             <span className='text-gray-700 fw-semibold d-block'>{`ที่อยู่เก็บเงิน: ${data?.[0]?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE}`}</span>
//                           )
//                         }
//                       </div>
//                     </div>
//                   </button>

//                   <button
//                     onClick={async () => {
//                       const result = await handleClick('UpdateSalesContract');  // รอให้ handleClick ทำงานเสร็จ
//                       if (result) {
//                         navigate(toContract, { state: data?.[0] });  // นำทางถ้าเงื่อนไขผ่าน
//                       }
//                     }}
//                     className='w-100 text-start border-0 bg-transparent p-0'
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data?.[0]?.PDPA.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
//                           {`8. รายละเอียดสัญญา`}
//                         </div>
//                         {data?.[0]?.CONTRACT?.length !== 0 && (
//                           <span className='text-gray-700 fw-semibold d-block'>
//                             {`วันที่ทำสัญญา: ${data?.[0]?.CONTRACT?.[0]?.createdAt ? (data[0].CONTRACT[0].createdAt) : '-'}`}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </button>

//                   <button
//                     style={{
//                       background: 'none',
//                       border: 'none',
//                       padding: 0,
//                       color: 'inherit',
//                       cursor: 'pointer',
//                       fontSize: 'inherit',
//                     }}
//                     onClick={() => handleClick('photo')}
//                     type='button'
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span
//                         className={`bullet bullet-vertical h-40px ${images &&
//                           Object.values(images).some((field) => Array.isArray(field) && field.length > 0)
//                           ? 'bg-success'
//                           : 'bg-danger'
//                           }`}
//                       ></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
//                           {`9. ถ่ายรูป`}
//                         </div>
//                       </div>
//                     </div>
//                   </button>

//                 </div>
//               </div>
//             </div>

//             {/* End Card Body */}

//             <div className='d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10'>
//               <Link to='/sale/overview' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
//                 ย้อนกลับ
//               </Link>
//             </div>

//             {/* ปุ่มในหน้าจอเล็ก */}
//             <div
//               className="d-flex d-xl-none justify-content-start align-items-center bg-light p-3 border-top"
//               style={{
//                 position: "fixed",
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 zIndex: 1050,
//               }}
//             >
//               <Link to='/sale/overview' className='btn btn-secondary align-self-center mb-2 mb-md-0'>
//                 ย้อนกลับ
//               </Link>
//             </div>

//           </>
//         )}
//       </Content>
//     </>
//   )
// }

// export default Step




// import { Link, useLocation, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { useState, useEffect } from 'react'
// import { useAuth } from '../../../../modules/auth/core/Auth'
// import { Content } from '../../../../../_metronic/layout/components/content'
// import useRefnoBarcodeStore from "../accessCam/refnoBarcodeStore"

// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'

// import { ThreeDot } from 'react-loading-indicators'

// // useStore
// import { useCategoryStore } from '../../../../modules/stores/sales/packageStore/packageStore'

// interface ItemProps {
//   REFNO: string
//   CONTNO: string
//   EMPID: string
//   TEAMSALE: string
//   SALECODE: string
//   SUPEMPID: string
//   SECEMPID: string
//   STATUS: string
//   PRODUCT: [any]
//   CUSTOMERSTATUS: [any]
//   DISCOUNT: [any]
//   CUSTOMERDETAIL: [any]
//   ADDRESS: [any]
//   PDPA: [any]
//   CONTRACT: [any]
//   IMAGE: [any]
//   CHECKERCOMMENT: [any]      // แก้จาก CHECKKERCOMMENT
//   item?: {
//     REFNO: string
//   }
// }

// interface ImagesType {
//   IMAGECARD: string[]
//   IMAGEGPS: string[]
//   IMAGEMAP: string[]
//   IMAGECUSTOMERHOME: string[]
//   IMAGEINSTALLATION: string[]
//   IMAGETDS: string[]
//   IMAGECUSTOMER: string[]
//   IMAGETRADEIN: string[]
// }

// const Step: React.FC = () => {
//   const MySwal = withReactContent(Swal)
//   const location = useLocation()
//   const navigate = useNavigate()
//   const item = (location.state as ItemProps) || []
//   console.log(`item`, item);

//   // ถ้าได้ REFNO มาจาก location.state ก็ใช้ ถ้าไม่มีก็ fallback ไปดึงจาก store
//   const refnoFromUpdate = useRefnoBarcodeStore((state: any) => state.refno || item?.REFNO || "")
//   const refno = item.REFNO ? item.REFNO : refnoFromUpdate

//   const [data, setData] = useState<any[]>([])
//   const [isLoadingFinish, setIsLoadingFinish] = useState<boolean>(false)
//   const [images, setImages] = useState<ImagesType | null>(null)

//   // สร้าง state สำหรับพนักงานขาย, ผู้แนะนำ, ช่างติดตั้ง
//   const [empInTeam, setEmpInTeam] = useState<any[]>([])
//   const [adviserList, setAdviserList] = useState<any[]>([])
//   const [installerList, setInstallerList] = useState<any[]>([])

//   const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO || ""
//   const GET_CONTRACT_URL = `${API_URL_MONGO}/Contract/GetContractSummary`
//   const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`

//   const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT || ""
//   const API_URL_POST_CONDITIONSCHECKHISTORY = `${API_SALECONNEXT}/ConditionsCheckHistory`

//   const API_URL_TSR = import.meta.env.VITE_APP_API_THIENSURAT || ""
//   const EMP_IN_TEAM_URL = `${API_URL_TSR}/Employee_Structure`
//   const ADVISER_URL = `${API_URL_TSR}/Employee_Structure/Emp_All`

//   const { auth } = useAuth()

//   const {
//     EmpId, setEmpId,
//     TeamSale, setTeamSale,
//     SaleCode, setSaleCode,
//     SupEmpId, setSupEmpId,
//     SecEmpId, setSecEmpId,
//     DivisionId, setDivisionId,
//     DepartId, setDepartId,
//     DepartGroup, setDepartGroup,
//   } = useCategoryStore()

//   // ดึงข้อมูล contract summary ตาม refno
//   const getData = async () => {
//     setIsLoadingFinish(true)
//     try {
//       const response = await axios.get(`${GET_CONTRACT_URL}?refno=${refno}`, {
//         headers: { 'Content-Type': 'application/json' }
//       })
//       const respData = Array.isArray(response.data.data) ? response.data.data : []
//       setData(respData)
//     } catch (error) {
//       console.error('Error fetching GET_CONTRACT_URL:', error)
//     } finally {
//       setIsLoadingFinish(false)
//     }
//   }

//   // ดึงภาพต่าง ๆ ของ contract
//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const GET_IMAGES_API = `${API_URL_MONGO}/Contract/GetContractImage?REFNO=${refno}`
//         const response = await axios.get(GET_IMAGES_API)
//         const resp = response.data
//         // ตรวจสอบว่ามี key ครบตาม ImagesType
//         if (
//           resp &&
//           typeof resp === 'object' &&
//           'IMAGECARD' in resp &&
//           'IMAGEGPS' in resp &&
//           'IMAGEMAP' in resp &&
//           'IMAGECUSTOMERHOME' in resp &&
//           'IMAGEINSTALLATION' in resp &&
//           'IMAGETDS' in resp &&
//           'IMAGETRADEIN' in resp
//         ) {
//           setImages(resp as ImagesType)
//         } else {
//           setImages(null)
//         }
//       } catch (err) {
//         console.error('Error fetching images:', err)
//         setImages(null)
//       }
//     }
//     if (refno) {
//       fetchImages()
//     }
//   }, [refno])

//   // เรียก getData ครั้งแรกเมื่อโหลด refno เสร็จ
//   useEffect(() => {
//     if (refno) {
//       getData()
//     } else {
//       console.warn("REFNO is undefined")
//     }
//   }, [refno])

//   // กำหนดค่าต่าง ๆ ใน useCategoryStore เมื่อ location เปลี่ยน
//   useEffect(() => {
//     getData()
//     setEmpId(auth.data[0]?.EmpId)
//     setTeamSale(auth.data[0]?.TeamSale)
//     setSaleCode(auth.data[0]?.SaleCode)
//     setSupEmpId(auth.data[0]?.SupEmp)
//     setSecEmpId(auth.data[0]?.SecEmp)
//     setDivisionId(auth.data[0]?.DivisionId)
//     setDepartId(auth.data[0]?.DepartId)
//     setDepartGroup(auth.data[0]?.DepartGroup)
//   }, [location])

//   // ถ้าใน data มี SALEEMPLOYEE อยู่ (มาจาก DB) ให้ set เป็น empInTeam ก่อน
//   useEffect(() => {
//     if (data?.[0]?.SALEEMPLOYEE?.length > 0) {
//       const saleEmpObj = data[0].SALEEMPLOYEE[0]?.SALEEMPLOYEE
//       if (saleEmpObj) {
//         setEmpInTeam([saleEmpObj])
//       }
//     }
//   }, [data])

//   // GET EmpInTeam (พนักงานขาย) จาก API
//   useEffect(() => {
//     if (!EmpId) return;

//     const getEmpInTeam = async () => {
//       try {
//         const formData = new FormData();
//         formData.append('EmpId', EmpId);
//         const response = await axios.post(
//           EMP_IN_TEAM_URL,
//           formData,
//           { headers: { 'Content-Type': 'multipart/form-data' } }
//         );
//         const apiData = Array.isArray(response.data.data)
//           ? response.data.data
//           : [];

//         // รวมข้อมูลใหม่กับของเก่า (แต่ไม่ซ้ำ)
//         setEmpInTeam(prev => {
//           const merged = [...prev];
//           apiData.forEach((emp: any) => {
//             if (!merged.find(e => e.SaleEmp === emp.SaleEmp)) {
//               merged.push(emp);
//             }
//           });
//           return merged;
//         });
//       } catch (error) {
//         console.error('Error fetching EMP_IN_TEAM_URL:', error);
//       }
//     };

//     getEmpInTeam();
//   }, [EmpId]); // ดึงซ้ำเฉพาะเมื่อ EmpId เปลี่ยนเท่านั้น  

//   // GET AdviserList (ผู้แนะนำ) จาก API
//   useEffect(() => {
//     const getAdviserData = async () => {
//       try {
//         const formData = new FormData()
//         formData.append('EmpId', EmpId)
//         const response = await axios.post(ADVISER_URL, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         })
//         const apiData = Array.isArray(response.data.data) ? response.data.data : []
//         setAdviserList(apiData)
//       } catch (error) {
//         console.error('Error fetching ADVISER_URL:', error)
//       }
//     }
//     if (EmpId) {
//       getAdviserData()
//     }
//   }, [EmpId, data])

//   // GET InstallerList (ช่างติดตั้ง) จาก API (ใช้ endpoint เดิมกับผู้แนะนำ สมมติ API เหมือนกัน)
//   useEffect(() => {
//     const getInstallerData = async () => {
//       try {
//         const formData = new FormData()
//         formData.append('EmpId', EmpId)
//         const response = await axios.post(ADVISER_URL, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         })
//         const apiData = Array.isArray(response.data.data) ? response.data.data : []
//         setInstallerList(apiData)
//       } catch (error) {
//         console.error('Error fetching installer data:', error)
//       }
//     }
//     if (EmpId) {
//       getInstallerData()
//     }
//   }, [EmpId, data])

//   // ฟังก์ชันสำหรับขั้นตอนต่าง ๆ (ปุ่มคลิกแล้วตรวจเงื่อนไข)
//   const handleClick = async (routeName: string) => {
//     if (routeName === 'UpdateSalesPDPA') {
//       if (data?.[0]?.PDPA?.length > 0) {
//         return false
//       }
//       return true
//     }

//     if (routeName === 'updateSalesSatusCust') {
//       if (data?.[0]?.CUSTOMERSTATUS?.length > 0) {
//         return false
//       }
//       return true
//     }

//     if (routeName === 'updateSaleDiscount') {
//       if (data?.[0]?.PRODUCT?.length === 0) {
//         await Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาบันทึกแพ็คเกจก่อน',
//           confirmButtonText: 'ตกลง',
//         })
//         return false
//       } if (data?.[0]?.PRODUCT?.length > 0 && data?.[0]?.DISCOUNT?.length > 0) {
//         return false
//       } if (data?.[0]?.PRODUCT?.length > 0 && data?.[0]?.DISCOUNT?.length === 0) {
//         return false
//       } else {
//         return true
//       }
//     }

//     if (routeName === 'updateCustDetail') {
//       if (!data?.[0]?.SALEEMPLOYEE || data[0].SALEEMPLOYEE.length === 0) {
//         await Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาบันทึกข้อมูลพนักงานขายก่อน',
//           confirmButtonText: 'ตกลง',
//         })
//         return false
//       }
//       return true
//     }

//     if (routeName === 'updateAddress') {
//       if (data?.[0]?.CUSTOMERDETAIL?.length === 0) {
//         await Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาบันทึกข้อมูลลูกค้าก่อน',
//           confirmButtonText: 'ตกลง'
//         })
//         return false
//       }
//       return true
//     }

//     if (routeName === 'UpdateSalesContract') {
//       if (
//         data?.[0]?.PRODUCT?.length === 0 ||
//         data?.[0]?.CUSTOMERSTATUS?.length === 0 ||
//         data?.[0]?.CUSTOMERDETAIL?.length === 0 ||
//         data?.[0]?.ADDRESS?.length === 0 ||
//         data?.[0]?.PDPA?.length === 0
//       ) {
//         Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาบันทึกข้อมูลให้ครบทุกส่วน',
//           confirmButtonText: 'ตกลง'
//         })
//         return false
//       }
//       return true
//     }

//     if (routeName === 'photo') {
//       if (
//         data?.[0]?.PRODUCT?.length === 0 ||
//         data?.[0]?.CUSTOMERSTATUS?.length === 0 ||
//         data?.[0]?.CUSTOMERDETAIL?.length === 0 ||
//         data?.[0]?.ADDRESS?.length === 0 ||
//         data?.[0]?.PDPA?.length === 0
//       ) {
//         Swal.fire({
//           icon: 'error',
//           title: 'เกิดข้อผิดพลาด!',
//           text: 'กรุณาบันทึกข้อมูลให้ครบทุกส่วน',
//           confirmButtonText: 'ตกลง'
//         })
//         return false
//       }
//       return true
//     }

//     return true
//   }

//   // ฟังก์ชันเลือกพนักงานขาย / ผู้แนะนำ / ช่างติดตั้ง
//   const handleCheckEmpSale = async () => {
//     // ตรวจสอบก่อนว่ามี CUSTOMERSTATUS หรือไม่
//     if (data?.[0]?.CUSTOMERSTATUS?.[0]?.STATUSSALE === '0') {
//       await Swal.fire({
//         icon: 'error',
//         title: 'เกิดข้อผิดพลาด!',
//         text: 'ลูกค้ามีประวัติแบลคลิสต์ ไม่สามารถทำรายการต่อได้',
//         confirmButtonText: 'ตกลง',
//       })
//       return
//     }

//     try {
//       // เตรียม options สำหรับพนักงานขาย
//       const empOptions = empInTeam.reduce((options: Record<string, string>, emp) => {
//         const fullName = `${emp.FName} ${emp.LName}`
//         options[emp.SaleEmp] = fullName
//         return options
//       }, {})

//       // options สำหรับผู้แนะนำ
//       const adviserOptions = adviserList.reduce((options: Record<string, string>, adv) => {
//         const fullName = `${adv.FName} ${adv.LName}`
//         options[adv.SaleEmp] = fullName
//         return options
//       }, {})

//       // options สำหรับช่างติดตั้ง
//       const installerOptions = installerList.reduce((options: Record<string, string>, ins) => {
//         const fullName = `${ins.FName} ${ins.LName}`
//         options[ins.SaleEmp] = fullName
//         return options
//       }, {})

//       // ดึงข้อมูล “พนักงานขาย” ปัจจุบัน (ถ้ามี)
//       const currentEmployeeObj = data?.[0]?.SALEEMPLOYEE?.[0]?.SALEEMPLOYEE
//       const currentEmployeeId = currentEmployeeObj?.SaleEmp || ""

//       // ดึงข้อมูล “ผู้แนะนำ” ปัจจุบัน (ถ้ามี)
//       const currentAdviserObj = data?.[0]?.SALEEMPLOYEE?.[0]?.ADVISER
//       const currentAdviserId = currentAdviserObj?.SaleEmp || ""

//       // ดึงข้อมูล “ช่างติดตั้ง” ปัจจุบัน (ถ้ามี)
//       const currentInstallerObj = data?.[0]?.SALEEMPLOYEE?.[0]?.INSTALLER
//       const currentInstallerId = currentInstallerObj?.SaleEmp || ""

//       // เรียก SweetAlert ให้เลือกพนักงานขาย / ผู้แนะนำ / ช่างติดตั้ง
//       const { value: formValues } = await MySwal.fire({
//         title: 'เลือกพนักงานขาย',
//         html: `
//           <select id="swal-employee" class="swal2-input" style="width: 100%; margin-bottom: 1rem;">
//             <option value="">เลือกพนักงานขาย...</option>
//             ${Object.entries(empOptions).map(([key, value]) => `<option value="${key}">${value}</option>`).join('')}
//           </select>
//           <select id="swal-adviser" class="swal2-input" style="width: 100%; margin-bottom: 1rem;">
//             <option value="">เลือกผู้แนะนำ (ถ้ามี)...</option>
//             ${Object.entries(adviserOptions).map(([key, value]) => `<option value="${key}">${value}</option>`).join('')}
//           </select>
//           <select id="swal-installer" class="swal2-input" style="width: 100%;">
//             <option value="">เลือกช่างติดตั้ง (ถ้ามี)...</option>
//             ${Object.entries(installerOptions).map(([key, value]) => `<option value="${key}">${value}</option>`).join('')}
//           </select>
//         `,
//         focusConfirm: false,
//         showCancelButton: true,
//         confirmButtonText: 'ตกลง',
//         cancelButtonText: 'ยกเลิก',

//         didOpen: () => {
//           // ตั้งค่า default ให้ select แต่ละตัวตามข้อมูลปัจจุบัน (ถ้ามี)
//           const empSelect = document.getElementById('swal-employee') as HTMLSelectElement
//           if (empSelect && currentEmployeeId) {
//             empSelect.value = currentEmployeeId
//           }

//           const advSelect = document.getElementById('swal-adviser') as HTMLSelectElement
//           if (advSelect && currentAdviserId) {
//             advSelect.value = currentAdviserId
//           }

//           const insSelect = document.getElementById('swal-installer') as HTMLSelectElement
//           if (insSelect && currentInstallerId) {
//             insSelect.value = currentInstallerId
//           }
//         },

//         preConfirm: () => {
//           const employee = (document.getElementById('swal-employee') as HTMLSelectElement).value
//           const adviser = (document.getElementById('swal-adviser') as HTMLSelectElement).value
//           const installer = (document.getElementById('swal-installer') as HTMLSelectElement).value

//           if (!employee) {
//             Swal.showValidationMessage('กรุณาเลือกพนักงานขาย')
//             return
//           }

//           return { employee, adviser, installer }
//         }
//       })

//       if (!formValues) {
//         // กด Cancel หรือไม่กรอกอะไรเลย
//         return
//       }

//       const { employee, adviser, installer } = formValues

//       // หา object พนักงานขายที่เลือก
//       const selectedEmployeeObj = empInTeam.find(emp => emp.SaleEmp === employee)

//       // หา object ผู้แนะนำถ้ามีเลือก
//       let selectedAdviserObj: any = null
//       if (adviser) {
//         selectedAdviserObj = adviserList.find(adv => adv.SaleEmp === adviser)
//       }

//       // หา object ช่างติดตั้งถ้ามีเลือก
//       let selectedInstallerObj: any = null
//       if (installer) {
//         selectedInstallerObj = installerList.find(ins => ins.SaleEmp === installer)
//       }

//       // เตรียม payload สำหรับส่งไปบันทึก
//       const payload: any = {
//         SALEEMPLOYEE: selectedEmployeeObj
//       }
//       if (selectedAdviserObj) {
//         payload.ADVISER = selectedAdviserObj
//       }
//       if (selectedInstallerObj) {
//         payload.INSTALLER = selectedInstallerObj
//       }

//       // เรียก API POST เพื่อบันทึกข้อมูล "พนักงานขาย / ผู้แนะนำ / ช่างติดตั้ง"
//       await axios.post(
//         UPDATECONTACT,
//         {
//           REFNO: data[0].REFNO,
//           EMPID: EmpId,
//           TEAMSALE: TeamSale,
//           FIELD: 'SALEEMPLOYEE',
//           DATA: [payload]
//         },
//         { headers: { 'Content-Type': 'application/json' } }
//       )

//       // แสดง popup สำเร็จ
//       await MySwal.fire({
//         icon: 'success',
//         title: 'บันทึกสำเร็จ!',
//         text: 'ข้อมูลพนักงานขายถูกบันทึกเรียบร้อยแล้ว',
//         timer: 2000,
//         showConfirmButton: false,
//       })

//       // อัปเดต state data ให้มี SALEEMPLOYEE ใหม่ทันที (เพื่อแสดงใน UI)
//       const updatedObj = {
//         ...data[0],
//         SALEEMPLOYEE: [{ SALEEMPLOYEE: selectedEmployeeObj, ADVISER: selectedAdviserObj, INSTALLER: selectedInstallerObj }]
//       }
//       setData([updatedObj])

//     } catch (error) {
//       console.error('Error updating contract:', error)
//       MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตข้อมูลได้', 'error')
//     }
//   }

//   // แปลงวันที่เป็นรูปแบบไทย
//   const formatThaiDate = (dateString: string): string => {
//     if (!dateString) return '-'
//     const monthsThai = [
//       'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
//       'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
//     ]
//     const date = new Date(dateString)
//     const day = date.getDate()
//     const month = monthsThai[date.getMonth()]
//     const year = date.getFullYear() + 543
//     return `${day} ${month} ${year}`
//   }

//   return (
//     <>
//       <Content>
//         <div className='d-flex justify-content-between align-items-center mb-7 mt-7 mt-lg-0'>
//           <div
//             id="kt_page_title"
//             data-kt-swapper="true"
//             data-kt-swapper-mode="prepend"
//             data-kt-swapper-parent='{default: "#kt_content_container", "lg": "#kt_toolbar_container"}'
//             className="page-title d-flex flex-wrap me-3 flex-column justify-content-center"
//           >
//             <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
//               ขั้นตอนการดำเนินการ
//             </h1>
//             <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//               <li className="breadcrumb-item text-muted">
//                 <a
//                   className="text-muted text-hover-primary"
//                   href="/metronic8/react/demo1/sales/overview"
//                 >
//                   ระบบขาย
//                 </a>
//               </li>
//               <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
//               <li className="breadcrumb-item text-gray-900">ขั้นตอนการดำเนินการ</li>
//             </ul>
//           </div>
//         </div>

//         {/* Card Body */}
//         {isLoadingFinish ? (
//           <div className="text-center my-10">
//             <ThreeDot />
//           </div>
//         ) : data.length > 0 ? (
//           <>
//             <div className='card mb-10'>
//               {/* หัวกระดาน */}
//               <div className='card-body d-flex align-items-center'>
//                 <div className='flex-grow-1'>
//                   <div className='text-gray-800 text-hover-primary fw-bold fs-4'>
//                     {`REFNO: ${item?.REFNO || refnoFromUpdate}`}
//                   </div>
//                   <span className={`${data?.[0]?.STATUS === 'DRAFT' ? 'text-warning' : 'text-danger'} fw-semibold d-block fs-6`}>
//                     {`สถานะ: ${data?.[0]?.STATUS === 'DRAFT' ? 'ยังไม่ได้ตรวจสอบ' : 'แก้ไข'}`}
//                   </span>
//                   {data?.[0]?.CHECKERCOMMENT?.[0]?.COMMENT && (
//                     <span className='text-danger fw-semibold d-block fs-6'>
//                       {`คอมเมนต์: ${data[0].CHECKERCOMMENT[0].COMMENT}`}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* เนื้อหาแต่ละขั้นตอน */}
//               <div className='card-body d-flex align-items-center py-5 pt-6'>
//                 <div className='col-12'>

//                   {/* 1. PDPA */}
//                   <button
//                     onClick={async () => {
//                       const ok = await handleClick('UpdateSalesPDPA')
//                       if (ok) {
//                         navigate('../sale/update/UpdateSalesPDPA', { state: data[0] })
//                       }
//                     }}
//                     className='w-100 text-start border-0 bg-transparent p-0'
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data[0].PDPA.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>1. PDPA</div>
//                         {data[0].PDPA.length !== 0 && (
//                           <span className='text-gray-700 fw-semibold d-block'>
//                             {`การยินยอมให้ใช้ข้อมูล: ${data[0].PDPA[0].CONSENTGIVEN ? 'ยินยอม' : 'ไม่ยินยอม'}`}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </button>

//                   {/* 2. ตรวจสอบสถานะลูกค้า */}
//                   <button
//                     onClick={async () => {
//                       const ok = await handleClick('updateSalesSatusCust')
//                       if (ok) {
//                         navigate('../sale/update/updateSalesSatusCust', { state: data[0] })
//                       }
//                     }}
//                     className='w-100 text-start border-0 bg-transparent p-0'
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data[0].CUSTOMERSTATUS.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 fw-bold fs-2'>2. ตรวจสอบสถานะลูกค้า</div>
//                         {data[0].CUSTOMERSTATUS.length !== 0 && (
//                           <span className="text-gray-700 fw-semibold d-block">
//                             {`Sale Status: ${data[0].CUSTOMERSTATUS[0].SaleStatus || ''}`}
//                             <br />
//                             {`ค้นหาจาก: ${data[0].CUSTOMERSTATUS[0].Searchtext || ''}`}
//                             <br />
//                             {`Message: ${data[0].CUSTOMERSTATUS[0].message || ''}`}
//                             <br />
//                             {data[0].CUSTOMERSTATUS[0].Message || ''}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </button>

//                   {/* 3. เลือกแพ็คเกจ */}
//                   <button
//                     onClick={async () => {
//                       // ตรวจสอบว่า PDPA กับ CUSTOMERSTATUS ผ่านหรือยัง
//                       if (data[0]?.PDPA.length === 0 || data[0]?.CUSTOMERSTATUS.length === 0) {
//                         await Swal.fire({
//                           icon: 'error',
//                           title: 'เกิดข้อผิดพลาด',
//                           text: 'กรุณาบันทึก PDPA และตรวจสอบสถานะลูกค้าก่อน',
//                           confirmButtonText: 'ตกลง',
//                         });
//                         return;
//                       }

//                       // ถ้าผ่าน ให้ navigate ไปหน้าที่ต้องการ
//                       navigate('../sale/update/updateSalePackage', { state: data[0] });
//                     }}
//                     className="w-100 text-start border-0 bg-transparent p-0"
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data[0].PRODUCT.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>3. เลือกแพ็คเกจ</div>
//                         {data[0].PRODUCT.length !== 0 && (
//                           <span className='text-gray-700 fw-semibold d-block'>
//                             {`สินค้า: ${data[0].PRODUCT[0].ItemDescription}`}
//                           </span>
//                         )}
//                         {data[0].PRODUCT.length > 0 && data[0].PRODUCT[0].Package.length > 0 && (
//                           <span className='text-gray-700 fw-semibold d-block'>
//                             {`แพ็คเกจ: ${data[0].PRODUCT[0].Package[0].PACKAGETITLE || 'ไม่มีแพ็คเกจ'}`}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </button>

//                   {/* 4. ส่วนลด / เครื่องเทิร์น / ของแถม */}
//                   <a
//                     style={{ cursor: 'pointer', textDecoration: 'none' }}
//                     onClick={() => {
//                       if (data[0].CUSTOMERSTATUS.length === 0) {
//                         Swal.fire({
//                           icon: 'error',
//                           title: 'เกิดข้อผิดพลาด',
//                           text: 'กรุณาตรวจสอบข้อมูลลูกค้าก่อน',
//                           confirmButtonText: 'ตกลง'
//                         })
//                       } else {
//                         handleClick('updateSaleDiscount').then(ok => {
//                           if (ok) {
//                             navigate('../sale/update/updateSaleDiscount', { state: data[0] })
//                           }
//                         })
//                       }
//                     }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data[0].DISCOUNT.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>4. ส่วนลด / เครื่องเทิร์น / ของแถม</div>
//                         {data[0]?.DISCOUNT[0]?.DISCOUNTAMOUNT && (
//                           <span className='text-gray-700 fw-semibold d-block'>
//                             {`ส่วนลด: ${data[0]?.DISCOUNT[0]?.DISCOUNTAMOUNT}`}
//                           </span>
//                         )}
//                         {data[0]?.DISCOUNT[0]?.GIFT.GIFTDESCRIPTION !== null && data[0]?.DISCOUNT[0]?.GIFT.GIFTDESCRIPTION !== undefined && (
//                           <span className='text-gray-700 fw-semibold d-block'>
//                             {`ของแถม: ${data[0]?.DISCOUNT[0]?.GIFT.GIFTDESCRIPTION}`}
//                           </span>
//                         )}
//                         {data[0]?.DISCOUNT[0]?.TRADEIN.HASTRADEIN.length > 0 && (
//                           <span className='text-gray-700 fw-semibold d-block'>
//                             {`เครื่องเทิร์น: ${data[0]?.DISCOUNT[0]?.TRADEIN.TRADEINBRANDNAME}`}
//                             {`รุ่น: ${data[0]?.DISCOUNT[0]?.TRADEIN.TRADEINMODEL}`}
//                             {`S/N: ${data[0]?.DISCOUNT[0]?.TRADEIN.TRADEINSERIAL}`}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </a>

//                   {/* 5. เลือกพนักงานขาย */}
//                   <a
//                     style={{ cursor: 'pointer' }}
//                     onClick={() => {
//                       if (data[0].CUSTOMERSTATUS.length === 0) {
//                         Swal.fire({
//                           icon: 'error',
//                           title: 'เกิดข้อผิดพลาด',
//                           text: 'กรุณาตรวจสอบข้อมูลลูกค้าก่อน',
//                           confirmButtonText: 'ตกลง'
//                         })
//                         return
//                       }
//                       if (data[0].DISCOUNT.length === 0) {
//                         Swal.fire({
//                           icon: 'error',
//                           title: 'เกิดข้อผิดพลาด',
//                           text: 'กรุณาทำขั้นตอนก่อนหน้าให้เสร็จก่อน',
//                           confirmButtonText: 'ตกลง'
//                         })
//                         return
//                       }
//                       handleCheckEmpSale()
//                     }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data[0].SALEEMPLOYEE.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 fw-bold fs-2'>5. เลือกพนักงานขาย</div>
//                         {data[0].SALEEMPLOYEE.length !== 0 && (
//                           <>
//                             <span className='text-gray-700 fw-semibold d-block'>
//                               {`พนักงานขาย: ${data[0].SALEEMPLOYEE[0].SALEEMPLOYEE.FName} ${data[0].SALEEMPLOYEE[0].SALEEMPLOYEE.LName}`}
//                             </span>
//                             {data[0].SALEEMPLOYEE[0].ADVISER && (
//                               <span className='text-gray-700 fw-semibold d-block'>
//                                 {`ผู้แนะนำ: ${data[0].SALEEMPLOYEE[0].ADVISER.FName} ${data[0].SALEEMPLOYEE[0].ADVISER.LName}`}
//                               </span>
//                             )}
//                             {data[0].SALEEMPLOYEE[0].INSTALLER && (
//                               <span className='text-gray-700 fw-semibold d-block'>
//                                 {`ช่างติดตั้ง: ${data[0].SALEEMPLOYEE[0].INSTALLER.FName} ${data[0].SALEEMPLOYEE[0].INSTALLER.LName}`}
//                               </span>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </a>

//                   {/* 6. บันทึกข้อมูลลูกค้า */}
//                   <button
//                     onClick={() => {
//                       handleClick('updateCustDetail').then(ok => {
//                         if (ok) {
//                           navigate('../sale/update/updateCustDetail', { state: data[0] })
//                         }
//                       })
//                     }}
//                     className='w-100 text-start border-0 bg-transparent p-0'
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data[0].CUSTOMERDETAIL.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>6. บันทึกข้อมูลลูกค้า</div>
//                         {data[0].CUSTOMERDETAIL.length !== 0 && (
//                           <span className='text-gray-700 fw-semibold d-block'>
//                             {data[0].CUSTOMERDETAIL[0].CUSTOMERTYPENAME === '1'
//                               ? `ชื่อบริษัท: ${data[0].CUSTOMERDETAIL[0].CUSTOMERNAME}`
//                               : `ชื่อลูกค้า: ${data[0].CUSTOMERDETAIL[0].CUSTOMERNAME}`}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </button>

//                   {/* 7. บันทึกที่อยู่ลูกค้า */}
//                   <button
//                     onClick={() => {
//                       handleClick('updateAddress').then(ok => {
//                         if (ok) {
//                           navigate('../sale/update/updateAddress', { state: data[0] })
//                         }
//                       })
//                     }}
//                     className='w-100 text-start border-0 bg-transparent p-0'
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data[0].ADDRESS.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>7. บันทึกที่อยู่ลูกค้า</div>
//                         {data[0].ADDRESS.length !== 0 && (
//                           <>
//                             <span className='text-gray-700 fw-semibold d-block'>
//                               {`ที่อยู่ตามบัตรฯ: ${data[0].ADDRESS[0].ADDRESSCARD.ADDRESSSUBDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSCARD.ADDRESSDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSCARD.ADDRESSPROVINCENAME} ${data[0].ADDRESS[0].ADDRESSCARD.ADDRESSZIPCODE}`}
//                             </span>
//                             <span className='text-gray-700 fw-semibold d-block'>
//                               {`ที่อยู่ติดตั้ง: ${data[0].ADDRESS[0].ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSINSTALLATION.ADDRESSDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSINSTALLATION.ADDRESSPROVINCENAME} ${data[0].ADDRESS[0].ADDRESSINSTALLATION.ADDRESSZIPCODE}`}
//                             </span>
//                             <span className='text-gray-700 fw-semibold d-block'>
//                               {`ที่อยู่เก็บเงิน: ${data[0].ADDRESS[0].ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSPAYMENT.ADDRESSDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSPAYMENT.ADDRESSPROVINCENAME} ${data[0].ADDRESS[0].ADDRESSPAYMENT.ADDRESSZIPCODE}`}
//                             </span>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </button>

//                   {/* 8. รายละเอียดสัญญา */}
//                   <button
//                     onClick={() => {
//                       handleClick('UpdateSalesContract').then(ok => {
//                         if (ok) {
//                           navigate('../sale/update/UpdateSalesContract', { state: data[0] })
//                         }
//                       })
//                     }}
//                     className='w-100 text-start border-0 bg-transparent p-0'
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${data[0].CONTRACT.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>8. รายละเอียดสัญญา</div>
//                         {data[0].CONTRACT.length !== 0 && (
//                           <span className='text-gray-700 fw-semibold d-block'>
//                             {`วันที่ทำสัญญา: ${data[0].CONTRACT[0].createdAt ? formatThaiDate(data[0].CONTRACT[0].createdAt) : '-'}`}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </button>

//                   {/* 9. ถ่ายรูป */}
//                   <button
//                     style={{
//                       background: 'none',
//                       border: 'none',
//                       padding: 0,
//                       color: 'inherit',
//                       cursor: 'pointer',
//                       fontSize: 'inherit',
//                     }}
//                     onClick={() => {
//                       handleClick('photo').then(ok => {
//                         if (ok) {
//                           navigate('../sale/photo', { state: { fromStep: true, data: data[0] } })
//                         }
//                       })
//                     }}
//                     type='button'
//                   >
//                     <div className='d-flex align-items-center pb-8'>
//                       <span className={`bullet bullet-vertical h-40px ${images && Object.values(images).some(field => Array.isArray(field) && field.length > 0)
//                         ? 'bg-success'
//                         : 'bg-danger'
//                         }`}></span>
//                       <div className='form-check form-check-custom form-check-solid mx-5'></div>
//                       <div className='flex-grow-1'>
//                         <div className='text-gray-800 text-hover-primary fw-bold fs-2'>9. ถ่ายรูป</div>
//                       </div>
//                     </div>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* ปุ่มย้อนกลับ (Desktop) */}
//             <div className='d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10'>
//               <Link to='/sale/overview' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
//                 ย้อนกลับ
//               </Link>
//             </div>

//             {/* ปุ่มย้อนกลับ (Mobile) */}
//             <div
//               className="d-flex d-xl-none justify-content-start align-items-center bg-light p-3 border-top"
//               style={{
//                 position: "fixed",
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 zIndex: 1050,
//               }}
//             >
//               <Link to='/sale/overview' className='btn btn-secondary align-self-center mb-2 mb-md-0'>
//                 ย้อนกลับ
//               </Link>
//             </div>
//           </>
//         ) : (
//           <div className="text-center my-10">
//             <h5>ไม่พบข้อมูล contract</h5>
//           </div>
//         )}
//       </Content>
//     </>
//   )
// }

// export default Step



import styles from '@/styles/style.module.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useAuth } from '../../../../modules/auth/core/Auth'
import { Content } from '../../../../../_metronic/layout/components/content'
import useRefnoBarcodeStore from "../accessCam/refnoBarcodeStore"

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { ThreeDot } from 'react-loading-indicators'

// useStore
import { useCategoryStore } from '../../../../modules/stores/sales/packageStore/packageStore'

interface ItemProps {
  REFNO: string
  CONTNO: string
  EMPID: string
  TEAMSALE: string
  SALECODE: string
  SUPEMPID: string
  SECEMPID: string
  STATUS: string
  PRODUCT: [any]
  CUSTOMERSTATUS: [any]
  DISCOUNT: [any]
  CUSTOMERDETAIL: [any]
  ADDRESS: [any]
  PDPA: [any]
  CONTRACT: [any]
  IMAGE: [any]
  CHECKERCOMMENT: [any]      // แก้จาก CHECKKERCOMMENT
  item?: {
    REFNO: string
  }
}

interface ImagesType {
  IMAGECARD: string[]
  IMAGEGPS: string[]
  IMAGEMAP: string[]
  IMAGECUSTOMERHOME: string[]
  IMAGEINSTALLATION: string[]
  IMAGETDS: string[]
  IMAGECUSTOMER: string[]
  IMAGETRADEIN: string[]
}

const Step: React.FC = () => {
  const MySwal = withReactContent(Swal)
  const location = useLocation()
  const navigate = useNavigate()
  const item = location.state as ItemProps

  // ถ้าได้ REFNO มาจาก location.state ก็ใช้ ถ้าไม่มีก็ fallback ไปดึงจาก store
  const refnoFromUpdate = useRefnoBarcodeStore((state: any) => state.refno || item?.REFNO || "")
  console.log(`refnoFromUpdate`, refnoFromUpdate);
  const refno = item.REFNO ? item.REFNO : refnoFromUpdate

  const [data, setData] = useState<any[]>([])
  // console.log(`data`, data);

  // ตรงบนสุดของ component (ก่อน return) ให้ดึง pkg กับ discount ออกมา
  const pkg = data[0]?.PRODUCT?.[0]?.Package?.[0] || {};
  const discount = data[0]?.DISCOUNT?.[0] || {};

  // แปลงเป็น boolean flags
  const hasPkgTradeIn = pkg.HASTRADEIN === 1;
  const hasDiscTradeIn = discount.TRADEIN?.HASTRADEIN === 1;
  const hasPkgPrice = Array.isArray(pkg.DISCOUNTPRICE) ? pkg.DISCOUNTPRICE.length > 0 : pkg.DISCOUNTPRICE != null;
  const hasDiscPrice = discount.DISCOUNTAMOUNT != null;
  const hasPkgGift = Array.isArray(pkg.FREEGIFT) ? pkg.FREEGIFT.length > 0 : false;
  const hasDiscGift = discount.GIFT?.GIFTDESCRIPTION != null;

  // คำนวณว่า package เปลี่ยนหรือไม่
  const packageChanged = !(
    hasPkgTradeIn === hasDiscTradeIn &&
    hasPkgPrice === hasDiscPrice &&
    hasPkgGift === hasDiscGift
  );

  const [isLoadingFinish, setIsLoadingFinish] = useState<boolean>(false)
  const [images, setImages] = useState<ImagesType | null>(null)

  // สร้าง state สำหรับพนักงานขาย, ผู้แนะนำ, ช่างติดตั้ง
  const [empInTeam, setEmpInTeam] = useState<any[]>([])
  const [adviserList, setAdviserList] = useState<any[]>([])
  const [installerList, setInstallerList] = useState<any[]>([])

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO || ""
  const GET_CONTRACT_URL = `${API_URL_MONGO}/Contract/GetContractSummary`
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`
  const GET_PAYMENT_URL = `${API_URL_MONGO}/Payment/GetPaymentPeriod`;

  const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT || ""
  const API_URL_POST_CONDITIONSCHECKHISTORY = `${API_SALECONNEXT}/ConditionsCheckHistory`

  const API_URL_TSR = import.meta.env.VITE_APP_API_THIENSURAT || ""
  const EMP_IN_TEAM_URL = `${API_URL_TSR}/Employee_Structure`
  const ADVISER_URL = `${API_URL_TSR}/Employee_Structure/Emp_All`

  const { auth } = useAuth()

  const {
    EmpId, setEmpId,
    TeamSale, setTeamSale,
    SaleCode, setSaleCode,
    SupEmpId, setSupEmpId,
    SecEmpId, setSecEmpId,
    DivisionId, setDivisionId,
    DepartId, setDepartId,
    DepartGroup, setDepartGroup,
  } = useCategoryStore()

  // ดึงข้อมูล contract summary ตาม refno
  const getData = async () => {
    setIsLoadingFinish(true)
    try {
      const response = await axios.get(`${GET_CONTRACT_URL}?refno=${refno}`, {
        headers: { 'Content-Type': 'application/json' }
      })
      const respData = Array.isArray(response.data.data) ? response.data.data : []
      setData(respData)
    } catch (error) {
      console.error('Error fetching GET_CONTRACT_URL:', error)
    } finally {
      setIsLoadingFinish(false)
    }
  }

  // ดึงภาพต่าง ๆ ของ contract
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const GET_IMAGES_API = `${API_URL_MONGO}/Contract/GetContractImage?REFNO=${refno}`
        const response = await axios.get(GET_IMAGES_API)
        const resp = response.data
        // ตรวจสอบว่ามี key ครบตาม ImagesType
        if (
          resp &&
          typeof resp === 'object' &&
          'IMAGECARD' in resp &&
          'IMAGEGPS' in resp &&
          'IMAGEMAP' in resp &&
          'IMAGECUSTOMERHOME' in resp &&
          'IMAGEINSTALLATION' in resp &&
          'IMAGETDS' in resp &&
          'IMAGETRADEIN' in resp
        ) {
          setImages(resp as ImagesType)
        } else {
          setImages(null)
        }
      } catch (err) {
        console.error('Error fetching images:', err)
        setImages(null)
      }
    }
    if (refno) {
      fetchImages()
    }
  }, [refno])

  // เรียก getData ครั้งแรกเมื่อโหลด refno เสร็จ
  useEffect(() => {
    if (refno) {
      getData()
    } else {
      console.warn("REFNO is undefined")
    }
  }, [refno])

  // กำหนดค่าต่าง ๆ ใน useCategoryStore เมื่อ location เปลี่ยน
  useEffect(() => {
    getData()
    setEmpId(auth.data[0]?.EmpId)
    setTeamSale(auth.data[0]?.TeamSale)
    setSaleCode(auth.data[0]?.SaleCode)
    setSupEmpId(auth.data[0]?.SupEmp)
    setSecEmpId(auth.data[0]?.SecEmp)
    setDivisionId(auth.data[0]?.DivisionId)
    setDepartId(auth.data[0]?.DepartId)
    setDepartGroup(auth.data[0]?.DepartGroup)
  }, [location])

  // ถ้าใน data มี SALEEMPLOYEE อยู่ (มาจาก DB) ให้ set เป็น empInTeam ก่อน
  useEffect(() => {
    if (data?.[0]?.SALEEMPLOYEE?.length > 0) {
      const saleEmpObj = data[0].SALEEMPLOYEE[0]?.SALEEMPLOYEE
      if (saleEmpObj) {
        setEmpInTeam([saleEmpObj])
      }
    }
  }, [data])

  // GET EmpInTeam (พนักงานขาย) จาก API
  useEffect(() => {
    if (!EmpId) return;

    const getEmpInTeam = async () => {
      try {
        const formData = new FormData();
        formData.append('EmpId', EmpId);
        const response = await axios.post(
          EMP_IN_TEAM_URL,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        const apiData = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        // รวมข้อมูลใหม่กับของเก่า (แต่ไม่ซ้ำ)
        setEmpInTeam(prev => {
          const merged = [...prev];
          apiData.forEach((emp: any) => {
            if (!merged.find(e => e.SaleEmp === emp.SaleEmp)) {
              merged.push(emp);
            }
          });
          return merged;
        });
      } catch (error) {
        console.error('Error fetching EMP_IN_TEAM_URL:', error);
      }
    };

    getEmpInTeam();
  }, [EmpId]); // ดึงซ้ำเฉพาะเมื่อ EmpId เปลี่ยนเท่านั้น  

  // GET AdviserList (ผู้แนะนำ) จาก API
  useEffect(() => {
    const getAdviserData = async () => {
      try {
        const formData = new FormData()
        formData.append('EmpId', EmpId)
        const response = await axios.post(ADVISER_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        const apiData = Array.isArray(response.data.data) ? response.data.data : []
        setAdviserList(apiData)
      } catch (error) {
        console.error('Error fetching ADVISER_URL:', error)
      }
    }
    if (EmpId) {
      getAdviserData()
    }
  }, [EmpId, data])

  // GET InstallerList (ช่างติดตั้ง) จาก API (ใช้ endpoint เดิมกับผู้แนะนำ สมมติ API เหมือนกัน)
  useEffect(() => {
    const getInstallerData = async () => {
      try {
        const formData = new FormData()
        formData.append('EmpId', EmpId)
        const response = await axios.post(ADVISER_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        const apiData = Array.isArray(response.data.data) ? response.data.data : []
        setInstallerList(apiData)
      } catch (error) {
        console.error('Error fetching installer data:', error)
      }
    }
    if (EmpId) {
      getInstallerData()
    }
  }, [EmpId, data])

  //////////เช็คว่ามีการชำระเงินรึยัง
  const [finish, setFinish] = useState<any[]>([]);
  console.log(`finish`, finish);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!EmpId || !TeamSale) return;
    getDataFinish();
  }, [EmpId, TeamSale]);

  const getDataFinish = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(GET_PAYMENT_URL, {
        params: {
          EMPID: EmpId,
          TEAMSALE: TeamSale
        }
      });
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setFinish(data);
    } catch (error) {
      console.error('Error fetching GET_PAYMENT_URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // state ตัวเก็บ matchedItem
  const [matchedItem, setMatchedItem] = useState<ItemProps | null>(null);
  console.log(`matchedItem`, matchedItem);

  useEffect(() => {
    if (!isLoading) {
      const found = finish.find((d) => d.REFNO === item?.REFNO || refnoFromUpdate);
      setMatchedItem(found);
    }
  }, [finish, isLoading]);

  const hasPaymentPeriod = !!matchedItem  // true = มีงวดชำระ/นัดชำระแล้ว

  //////////เช็คว่ามีการชำระเงินรึยัง

  // ฟังก์ชันสำหรับขั้นตอนต่าง ๆ (ปุ่มคลิกแล้วตรวจเงื่อนไข)
  const handleClick = async (routeName: string) => {
    if (routeName === 'UpdateSalesPDPA') {
      if (data?.[0]?.PDPA?.length > 0) {
        return false
      }
      return true
    }

    if (routeName === 'updateSalesSatusCust') {
      if (data?.[0]?.CUSTOMERSTATUS?.length > 0) {
        return false
      }
      return true
    }

    if (routeName === 'updateSaleDiscount') {
      if (data?.[0]?.PRODUCT?.length === 0) {
        await Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'กรุณาบันทึกแพ็คเกจก่อน',
          confirmButtonText: 'ตกลง',
        })
        return false
      } if (data?.[0]?.PRODUCT?.length > 0 && data?.[0]?.DISCOUNT?.length > 0) {
        return false
      } if (data?.[0]?.PRODUCT?.length > 0 && data?.[0]?.DISCOUNT?.length === 0) {
        return false
      } else {
        return true
      }
    }

    if (routeName === 'updateCustDetail') {
      if (!data?.[0]?.SALEEMPLOYEE || data[0].SALEEMPLOYEE.length === 0) {
        await Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'กรุณาบันทึกข้อมูลพนักงานขายก่อน',
          confirmButtonText: 'ตกลง',
        })
        return false
      }
      return true
    }

    if (routeName === 'updateAddress') {
      if (data?.[0]?.CUSTOMERDETAIL?.length === 0) {
        await Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'กรุณาบันทึกข้อมูลลูกค้าก่อน',
          confirmButtonText: 'ตกลง'
        })
        return false
      }
      return true
    }

    if (routeName === 'UpdateSalesContract') {
      if (
        data?.[0]?.PRODUCT?.length === 0 ||
        data?.[0]?.CUSTOMERSTATUS?.length === 0 ||
        data?.[0]?.CUSTOMERDETAIL?.length === 0 ||
        data?.[0]?.ADDRESS?.length === 0 ||
        data?.[0]?.PDPA?.length === 0
      ) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'กรุณาบันทึกข้อมูลให้ครบทุกส่วน',
          confirmButtonText: 'ตกลง'
        })
        return false
      }
      return true
    }

    if (routeName === 'photo') {
      if (
        data?.[0]?.PRODUCT?.length === 0 ||
        data?.[0]?.CUSTOMERSTATUS?.length === 0 ||
        data?.[0]?.CUSTOMERDETAIL?.length === 0 ||
        data?.[0]?.ADDRESS?.length === 0 ||
        data?.[0]?.PDPA?.length === 0
      ) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'กรุณาบันทึกข้อมูลให้ครบทุกส่วน',
          confirmButtonText: 'ตกลง'
        })
        return false
      }
      return true
    }

    return true
  }

  // ฟังก์ชันเลือกพนักงานขาย / ผู้แนะนำ / ช่างติดตั้ง
  // const handleCheckEmpSale = async () => {
  //   try {
  //     // เตรียม options สำหรับพนักงานขาย
  //     const empOptions = empInTeam.reduce((options: Record<string, string>, emp) => {
  //       const fullName = `${emp.FName} ${emp.LName}`
  //       options[emp.SaleEmp] = fullName
  //       return options
  //     }, {})

  //     // options สำหรับผู้แนะนำ
  //     const adviserOptions = adviserList.reduce((options: Record<string, string>, adv) => {
  //       const fullName = `${adv.FName} ${adv.LName}`
  //       options[adv.SaleEmp] = fullName
  //       return options
  //     }, {})

  //     // options สำหรับช่างติดตั้ง
  //     const installerOptions = installerList.reduce((options: Record<string, string>, ins) => {
  //       const fullName = `${ins.FName} ${ins.LName}`
  //       options[ins.SaleEmp] = fullName
  //       return options
  //     }, {})

  //     // ดึงข้อมูล “พนักงานขาย” ปัจจุบัน (ถ้ามี)
  //     const currentEmployeeObj = data?.[0]?.SALEEMPLOYEE?.[0]?.SALEEMPLOYEE
  //     const currentEmployeeId = currentEmployeeObj?.SaleEmp || ""

  //     // ดึงข้อมูล “ผู้แนะนำ” ปัจจุบัน (ถ้ามี)
  //     const currentAdviserObj = data?.[0]?.SALEEMPLOYEE?.[0]?.ADVISER
  //     const currentAdviserId = currentAdviserObj?.SaleEmp || ""

  //     // ดึงข้อมูล “ช่างติดตั้ง” ปัจจุบัน (ถ้ามี)
  //     const currentInstallerObj = data?.[0]?.SALEEMPLOYEE?.[0]?.INSTALLER
  //     const currentInstallerId = currentInstallerObj?.SaleEmp || ""

  //     // เรียก SweetAlert ให้เลือกพนักงานขาย / ผู้แนะนำ / ช่างติดตั้ง
  //     const { value: formValues } = await MySwal.fire({
  //       title: 'เลือกพนักงานขาย',
  //       html: `
  //         <select id="swal-employee" class="swal2-input" style="width: 100%; margin-bottom: 1rem;">
  //           <option value="">เลือกพนักงานขาย...</option>
  //           ${Object.entries(empOptions).map(([key, value]) => `<option value="${key}">${value}</option>`).join('')}
  //         </select>
  //         <select id="swal-adviser" class="swal2-input" style="width: 100%; margin-bottom: 1rem;">
  //           <option value="">เลือกผู้แนะนำ (ถ้ามี)...</option>
  //           ${Object.entries(adviserOptions).map(([key, value]) => `<option value="${key}">${value}</option>`).join('')}
  //         </select>
  //         <select id="swal-installer" class="swal2-input" style="width: 100%;">
  //           <option value="">เลือกช่างติดตั้ง (ถ้ามี)...</option>
  //           ${Object.entries(installerOptions).map(([key, value]) => `<option value="${key}">${value}</option>`).join('')}
  //         </select>
  //       `,
  //       focusConfirm: false,
  //       showCancelButton: true,
  //       confirmButtonText: 'ตกลง',
  //       cancelButtonText: 'ยกเลิก',

  //       didOpen: () => {
  //         // ตั้งค่า default ให้ select แต่ละตัวตามข้อมูลปัจจุบัน (ถ้ามี)
  //         const empSelect = document.getElementById('swal-employee') as HTMLSelectElement
  //         if (empSelect && currentEmployeeId) {
  //           empSelect.value = currentEmployeeId
  //         }

  //         const advSelect = document.getElementById('swal-adviser') as HTMLSelectElement
  //         if (advSelect && currentAdviserId) {
  //           advSelect.value = currentAdviserId
  //         }

  //         const insSelect = document.getElementById('swal-installer') as HTMLSelectElement
  //         if (insSelect && currentInstallerId) {
  //           insSelect.value = currentInstallerId
  //         }
  //       },

  //       preConfirm: () => {
  //         const employee = (document.getElementById('swal-employee') as HTMLSelectElement).value
  //         const adviser = (document.getElementById('swal-adviser') as HTMLSelectElement).value
  //         const installer = (document.getElementById('swal-installer') as HTMLSelectElement).value

  //         if (!employee) {
  //           Swal.showValidationMessage('กรุณาเลือกพนักงานขาย')
  //           return
  //         }

  //         return { employee, adviser, installer }
  //       }
  //     })

  //     if (!formValues) {
  //       // กด Cancel หรือไม่กรอกอะไรเลย
  //       return
  //     }

  //     const { employee, adviser, installer } = formValues

  //     // หา object พนักงานขายที่เลือก
  //     const selectedEmployeeObj = empInTeam.find(emp => emp.SaleEmp === employee)

  //     // หา object ผู้แนะนำถ้ามีเลือก
  //     let selectedAdviserObj: any = null
  //     if (adviser) {
  //       selectedAdviserObj = adviserList.find(adv => adv.SaleEmp === adviser)
  //     }

  //     // หา object ช่างติดตั้งถ้ามีเลือก
  //     let selectedInstallerObj: any = null
  //     if (installer) {
  //       selectedInstallerObj = installerList.find(ins => ins.SaleEmp === installer)
  //     }

  //     // เตรียม payload สำหรับส่งไปบันทึก
  //     const payload: any = {
  //       SALEEMPLOYEE: selectedEmployeeObj
  //     }
  //     if (selectedAdviserObj) {
  //       payload.ADVISER = selectedAdviserObj
  //     }
  //     if (selectedInstallerObj) {
  //       payload.INSTALLER = selectedInstallerObj
  //     }

  //     // เรียก API POST เพื่อบันทึกข้อมูล "พนักงานขาย / ผู้แนะนำ / ช่างติดตั้ง"
  //     await axios.post(
  //       UPDATECONTACT,
  //       {
  //         REFNO: data[0].REFNO,
  //         EMPID: EmpId,
  //         TEAMSALE: TeamSale,
  //         FIELD: 'SALEEMPLOYEE',
  //         DATA: [payload]
  //       },
  //       { headers: { 'Content-Type': 'application/json' } }
  //     )

  //     // แสดง popup สำเร็จ
  //     await MySwal.fire({
  //       icon: 'success',
  //       title: 'บันทึกสำเร็จ!',
  //       text: 'ข้อมูลพนักงานขายถูกบันทึกเรียบร้อยแล้ว',
  //       timer: 2000,
  //       showConfirmButton: false,
  //     })

  //     // อัปเดต state data ให้มี SALEEMPLOYEE ใหม่ทันที (เพื่อแสดงใน UI)
  //     const updatedObj = {
  //       ...data[0],
  //       SALEEMPLOYEE: [{ SALEEMPLOYEE: selectedEmployeeObj, ADVISER: selectedAdviserObj, INSTALLER: selectedInstallerObj }]
  //     }
  //     setData([updatedObj])

  //   } catch (error) {
  //     console.error('Error updating contract:', error)
  //     MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตข้อมูลได้', 'error')
  //   }
  // }

  // แปลงวันที่เป็นรูปแบบไทย
  const formatToBE = (isoDate?: string) => {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear() + 543;
    return `${dd}/${mm}/${yyyy}`;
  };

  const paidFromLocal = useMemo(() => {
    return localStorage.getItem(`paymentDone:${refnoFromUpdate}`) === '1';
  }, [refnoFromUpdate]);

  return (
    <>
      <Content>
        <div className='d-flex justify-content-between align-items-center mb-7 mt-7 mt-lg-0'>
          <div
            id="kt_page_title"
            data-kt-swapper="true"
            data-kt-swapper-mode="prepend"
            data-kt-swapper-parent='{default: "#kt_content_container", "lg": "#kt_toolbar_container"}'
            className="page-title d-flex flex-wrap me-3 flex-column justify-content-center"
          >
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
              <li className={`${styles.titlePage}`}>ขั้นตอนการดำเนินการ</li>
            </ul>
          </div>
        </div>

        {/* Card Body */}
        {isLoadingFinish ? (
          <div className="text-center my-10">
            <ThreeDot />
          </div>
        ) : data.length > 0 ? (
          <>
            <div className='card mb-10'>
              {/* หัวกระดาน */}
              <div className='card-body d-flex align-items-center'>
                <div className='flex-grow-1'>
                  <div className={`text-gray-800 text-hover-primary ${styles.label}`}>
                    {`REFNO: ${item?.REFNO || refnoFromUpdate}`}
                  </div>
                  <span className={`${data?.[0]?.STATUS === 'DRAFT' ? 'text-warning' : 'text-danger'} fw-semibold d-block fs-6`}>
                    {`สถานะ: ${data?.[0]?.STATUS === 'DRAFT' ? 'ยังไม่ได้ตรวจสอบ' : 'แก้ไข'}`}
                  </span>
                  {data?.[0]?.CHECKERCOMMENT?.[0]?.COMMENT && (
                    <span className='text-danger fw-semibold d-block fs-6'>
                      {`คอมเมนต์: ${data[0].CHECKERCOMMENT[0].COMMENT}`}
                    </span>
                  )}
                </div>
              </div>

              {/* เนื้อหาแต่ละขั้นตอน */}
              <div className='card-body d-flex align-items-center py-5 pt-6'>
                <div className='col-12'>

                  {/* 2. ตรวจสอบสถานะลูกค้า */}
                  <button
                    onClick={async () => {
                      if (data[0]?.CUSTOMERSTATUS.length > 0) {
                        await Swal.fire({
                          icon: 'info',
                          title: 'ไม่สามารถแก้ไขได้',
                          confirmButtonText: 'ตกลง',
                        });
                        return;
                      }
                      const ok = await handleClick('updateSalesSatusCust')
                      if (ok) {
                        navigate('/sale/update/updateSalesSatusCust', { state: data[0] })
                      }
                    }}
                    className='w-100 text-start border-0 bg-transparent p-0'
                    style={{ cursor: 'pointer' }}
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data[0].CUSTOMERSTATUS.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className={`${styles.label}`}>1. ตรวจสอบสถานะลูกค้า</div>
                        {data[0].CUSTOMERSTATUS.length !== 0 && (
                          <span className={`text-gray-700 d-block ${styles.label}`}>
                            {`ค้นหาจาก: ${data[0].CUSTOMERSTATUS[0].Searchtext || ''}`}
                            <br />
                            {data[0]?.CUSTOMERSTATUS?.[0]?.CustomerName && (
                              <p>ชื่อลูกค้า: {data[0].CUSTOMERSTATUS[0].CustomerName}</p>
                            )}
                            {data[0]?.CUSTOMERSTATUS?.[0]?.Message && (
                              <p>{data[0].CUSTOMERSTATUS[0].Message}</p>
                            )}
                            {data[0]?.CUSTOMERSTATUS?.[0]?.message && (
                              <p>{data[0].CUSTOMERSTATUS[0].message}</p>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* 3. เลือกแพ็คเกจ */}
                  <button
                    onClick={async () => {
                      if (data[0]?.NEWREFNO && data[0].NEWREFNO.length > 0) {
                        await Swal.fire({
                          icon: 'info',
                          title: 'ไม่สามารถแก้ไขได้',
                          confirmButtonText: 'ตกลง',
                        });
                        return;
                      }

                      // ถ้าผ่าน ให้ navigate ไปหน้าที่ต้องการ
                      navigate('/sale/update/updateSalePackage', { state: data[0] });
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data[0]?.PRODUCT.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className={`${styles.label}`}>2. เลือกแพ็คเกจ</div>
                        {data[0]?.PRODUCT.length !== 0 && (
                          <span className={`text-gray-700 d-block ${styles.label}`}>
                            {`สินค้าหลัก: ${data[0]?.PRODUCT[0]?.ItemDescription}`}
                          </span>
                        )}
                        {data[0].PRODUCT.length !== 0 && data[0]?.PRODUCT[1]?.ItemDescription && (
                          <span className={`text-gray-700 d-block ${styles.label}`}>
                            {`สินค้าบันเดิล: ${data[0]?.PRODUCT[1]?.ItemDescription}`}
                          </span>
                        )}
                        {data[0]?.PRODUCT.length > 0 && data[0]?.PRODUCT[0]?.Package.length > 0 && (
                          <span className={`text-gray-700 d-block ${styles.label}`}>
                            {`แพ็คเกจ: ${data[0]?.PRODUCT[0]?.Package[0]?.PACKAGETITLE || 'ไม่มีแพ็คเกจ'}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* 4. ส่วนลด / เครื่องเทิร์น / ของแถม */}
                  <a
                    style={{ cursor: 'pointer', textDecoration: 'none' }}
                    onClick={() => {
                      if (data[0].CUSTOMERSTATUS.length === 0) {
                        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'กรุณาตรวจสอบข้อมูลลูกค้าก่อน', confirmButtonText: 'ตกลง' });
                      } if (data[0].PRODUCT.length === 0) {
                        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'กรุณาเลือกแพ็คเกจก่อน', confirmButtonText: 'ตกลง' });
                      } if (data[0].PRODUCT.length > 0) {
                        Swal.fire({ icon: 'info', title: 'แก้ไขได้จากขั้นตอน เลือกแพ็คเกจ เท่านั้น', confirmButtonText: 'ตกลง' });
                      } if (data[0]?.NEWREFNO.length > 0) {
                        Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้', confirmButtonText: 'ตกลง' });
                      } else {
                        handleClick('updateSaleDiscount').then(ok => {
                          if (ok) navigate('/sale/update/updateSaleDiscount', { state: data[0] });
                        });
                      }
                    }}
                  >
                    <div className='d-flex align-items-center pb-8'>
                      {/* bullet แดงเมื่อ packageChanged หรือยังไม่มี discount record */}
                      <span
                        className={`bullet bullet-vertical h-40px ${packageChanged || !discount || data[0].PRODUCT.length === 0 ? 'bg-danger' : 'bg-success'
                          }`}
                      ></span>
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className={styles.label}>3. ส่วนลด / เครื่องเทิร์น / ของแถม</div>

                        {packageChanged ? (
                          <span className={`text-gray-700 d-block ${styles.label}`}>
                            แพ็คเกจมีการเปลี่ยนแปลง กรุณาเลือก ส่วนลด / เครื่องเทิร์น / ของแถม ใหม่
                          </span>
                        ) : (
                          <>
                            {hasDiscPrice && (
                              <span className={`text-gray-700 d-block ${styles.label}`}>
                                {`ส่วนลด: ${discount.DISCOUNTAMOUNT}`}
                              </span>
                            )}
                            {hasDiscGift && (
                              <span className={`text-gray-700 d-block ${styles.label}`}>
                                {`ของแถม: ${discount.GIFT.GIFTDESCRIPTION}`}
                              </span>
                            )}
                            {hasDiscTradeIn && (
                              <span className={`text-gray-700 d-block ${styles.label}`}>
                                {`เครื่องเทิร์น: ${discount.TRADEIN.TRADEINBRANDNAME}`}
                                {` รุ่น: ${discount.TRADEIN.TRADEINMODEL}`}
                                {` S/N: ${discount.TRADEIN.TRADEINSERIAL}`}
                              </span>
                            )}
                            {!(hasDiscPrice || hasDiscGift || hasDiscTradeIn) || (data[0].PRODUCT.length === 0) && (
                              <span className={`text-gray-700 d-block ${styles.label}`}>
                                ไม่มี ส่วนลด / เครื่องเทิร์น / ของแถม
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </a>

                  {/* 5. เลือกพนักงานขาย */}
                  {/* <a
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (data[0].CUSTOMERSTATUS.length === 0) {
                        Swal.fire({
                          icon: 'error',
                          title: 'เกิดข้อผิดพลาด',
                          text: 'กรุณาตรวจสอบข้อมูลลูกค้าก่อน',
                          confirmButtonText: 'ตกลง'
                        })
                        return
                      }
                      if (data[0].DISCOUNT.length === 0) {
                        Swal.fire({
                          icon: 'error',
                          title: 'เกิดข้อผิดพลาด',
                          text: 'กรุณาทำขั้นตอนก่อนหน้าให้เสร็จก่อน',
                          confirmButtonText: 'ตกลง'
                        })
                        return
                      }
                      handleCheckEmpSale()
                    }}
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data[0].SALEEMPLOYEE.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className={`${styles.label}`}>5. เลือกพนักงานขาย</div>
                        {data[0].SALEEMPLOYEE.length !== 0 && (
                          <>
                            <span className={`text-gray-700 d-block ${styles.label}`}>
                              {`พนักงานขาย: ${data[0].SALEEMPLOYEE[0].SALEEMPLOYEE.FName} ${data[0].SALEEMPLOYEE[0].SALEEMPLOYEE.LName}`}
                            </span>
                            {data[0].SALEEMPLOYEE[0].ADVISER && (
                              <span className={`text-gray-700 d-block ${styles.label}`}>
                                {`ผู้แนะนำ: ${data[0].SALEEMPLOYEE[0].ADVISER.FName} ${data[0].SALEEMPLOYEE[0].ADVISER.LName}`}
                              </span>
                            )}
                            {data[0].SALEEMPLOYEE[0].INSTALLER && (
                              <span className={`text-gray-700 d-block ${styles.label}`}>
                                {`ช่างติดตั้ง: ${data[0].SALEEMPLOYEE[0].INSTALLER.FName} ${data[0].SALEEMPLOYEE[0].INSTALLER.LName}`}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </a> */}

                  <button
                    onClick={async () => {
                      if (data[0]?.PRODUCT.length === 0 || data[0]?.DISCOUNT.length === 0) {
                        await Swal.fire({
                          icon: 'error',
                          title: 'เกิดข้อผิดพลาด',
                          text: 'กรุณาบันทึกแพ็คเกจให้ครบถ้วนก่อน',
                          confirmButtonText: 'ตกลง',
                        });
                        return;
                      } if (data[0]?.NEWREFNO && data[0].NEWREFNO.length > 0) {
                        await Swal.fire({
                          icon: 'info',
                          title: 'ไม่สามารถแก้ไขได้',
                          confirmButtonText: 'ตกลง',
                        });
                        return;
                      }

                      // ถ้าผ่าน ให้ navigate ไปหน้าที่ต้องการ
                      navigate('/sale/update/UpdateSalesEmployee', { state: data[0] });
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data[0].SALEEMPLOYEE.length > 0 ? 'bg-success' : 'bg-danger'}`}></span>
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className={`${styles.label}`}>4. เลือกพนักงานขาย</div>
                        {data[0].SALEEMPLOYEE.length > 0 && (
                          <>
                            {/* พนักงานขาย */}
                            {data[0].SALEEMPLOYEE[0]?.SALEEMPLOYEE?.FName && (
                              <span className={`text-gray-700 d-block ${styles.label}`}>
                                {`พนักงานขาย: ${data[0].SALEEMPLOYEE[0].SALEEMPLOYEE.FName
                                  } ${data[0].SALEEMPLOYEE[0].SALEEMPLOYEE.LName ?? ''
                                  }`}
                              </span>
                            )}
                            {/* ผู้แนะนำ */}
                            {data[0].SALEEMPLOYEE[0]?.ADVISER && (
                              <span className={`text-gray-700 d-block ${styles.label}`}>
                                {`ผู้แนะนำ: ${data[0].SALEEMPLOYEE[0].ADVISER.FName
                                  } ${data[0].SALEEMPLOYEE[0].ADVISER.LName ?? ''
                                  }`}
                              </span>
                            )}
                            {/* พนักงานติดตั้ง */}
                            {data[0].SALEEMPLOYEE[0]?.INSTALLER && (
                              <span className={`text-gray-700 d-block ${styles.label}`}>
                                {`พนักงานติดตั้ง: ${data[0].SALEEMPLOYEE[0].INSTALLER.FName
                                  } ${data[0].SALEEMPLOYEE[0].INSTALLER.LName ?? ''
                                  }`}
                              </span>
                            )}
                          </>
                        )}

                      </div>
                    </div>
                  </button>


                  {/* 6. บันทึกข้อมูลลูกค้า */}
                  <button
                    onClick={() => {
                      if (data[0]?.NEWREFNO && data[0].NEWREFNO.length > 0) {
                        Swal.fire({
                          icon: 'info',
                          title: 'ไม่สามารถแก้ไขได้',
                          confirmButtonText: 'ตกลง',
                        });
                        return; // ออกจาก function
                      }

                      // ถ้าผ่านเงื่อนไข NEWREFNO แล้ว ค่อย handleClick และ navigate
                      handleClick('updateCustDetail').then(ok => {
                        if (ok) {
                          navigate('/sale/update/updateCustDetail', { state: data[0] });
                        }
                      });
                    }}
                    className='w-100 text-start border-0 bg-transparent p-0'
                    style={{ cursor: 'pointer' }}
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data[0].CUSTOMERDETAIL.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className={`${styles.label}`}>5. บันทึกข้อมูลลูกค้า</div>
                        {data[0].CUSTOMERDETAIL.length > 0 && (
                          <span className={`text-gray-700 d-block ${styles.label}`}>
                            {data[0].CUSTOMERDETAIL[0].CUSTOMERTYPENAME === '1'
                              ? data[0].CUSTOMERDETAIL[0].CUSTOMERNAME
                                ? `ชื่อบริษัท: ${data[0].CUSTOMERDETAIL[0].CUSTOMERNAME}`
                                : ''
                              : data[0].CUSTOMERDETAIL[0].CUSTOMERNAME
                                ? `ชื่อลูกค้า: ${data[0].CUSTOMERDETAIL[0].CUSTOMERNAME} ${data[0].CUSTOMERDETAIL[0].CUSTOMERLASTNAME ? data[0].CUSTOMERDETAIL[0].CUSTOMERLASTNAME : ""}`
                                : ''
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* 7. บันทึกที่อยู่ลูกค้า */}
                  <button
                    onClick={() => {
                      if (data[0]?.NEWREFNO && data[0].NEWREFNO.length > 0) {
                        Swal.fire({
                          icon: 'info',
                          title: 'ไม่สามารถแก้ไขได้',
                          confirmButtonText: 'ตกลง',
                        });
                        return; // ออกจาก function
                      }
                      handleClick('updateAddress').then(ok => {
                        if (ok) {
                          navigate('/sale/update/updateAddress', { state: data[0] })
                        }
                      })
                    }}
                    className='w-100 text-start border-0 bg-transparent p-0'
                    style={{ cursor: 'pointer' }}
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data[0].ADDRESS.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className={`${styles.label}`}>6. บันทึกที่อยู่ลูกค้า</div>
                        {data[0].ADDRESS.length !== 0 && (
                          <>
                            <span className={`text-gray-700 d-block ${styles.label}`}>
                              {`ที่อยู่ติดตั้ง: ${data[0].ADDRESS[0].ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSINSTALLATION.ADDRESSDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSINSTALLATION.ADDRESSPROVINCENAME} ${data[0].ADDRESS[0].ADDRESSINSTALLATION.ADDRESSZIPCODE}`}
                            </span>
                            <span className={`text-gray-700 d-block ${styles.label}`}>
                              {`ที่อยู่ตามบัตร: ${data[0].ADDRESS[0].ADDRESSCARD.ADDRESSSUBDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSCARD.ADDRESSDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSCARD.ADDRESSPROVINCENAME} ${data[0].ADDRESS[0].ADDRESSCARD.ADDRESSZIPCODE}`}
                            </span>
                            <span className={`text-gray-700 d-block ${styles.label}`}>
                              {`ที่อยู่เก็บเงิน: ${data[0].ADDRESS[0].ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSPAYMENT.ADDRESSDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSPAYMENT.ADDRESSPROVINCENAME} ${data[0].ADDRESS[0].ADDRESSPAYMENT.ADDRESSZIPCODE}`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* PDPA */}
                  <button
                    onClick={async () => {
                      if (data[0]?.ADDRESS.length === 0) {
                        await Swal.fire({
                          icon: 'error',
                          title: 'เกิดข้อผิดพลาด',
                          text: 'กรุณาบันทึกข้อมูลให้ครบทุกส่วน',
                          confirmButtonText: 'ตกลง',
                        });
                        return;
                      } if (data[0]?.PDPA.length > 0) {
                        await Swal.fire({
                          icon: 'info',
                          title: 'ไม่สามารถแก้ไขได้',
                          confirmButtonText: 'ตกลง',
                        });
                        return;
                      } if (data[0]?.PDPA.length > 0) {
                        return;
                      } if (data[0]?.NEWREFNO && data[0].NEWREFNO.length > 0) {
                        await Swal.fire({
                          icon: 'info',
                          title: 'ไม่สามารถแก้ไขได้',
                          confirmButtonText: 'ตกลง',
                        });
                        return;
                      }
                      navigate('/sale/pdpa', { state: { ...data[0], from: '/sale/step' } });
                    }}
                    className='w-100 text-start border-0 bg-transparent p-0'
                    style={{ cursor: 'pointer' }}
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data[0].PDPA.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className={`${styles.label}`}>7. PDPA</div>
                        {data[0].PDPA.length !== 0 && (
                          <span className={`text-gray-700 d-block ${styles.label}`}>
                            {`${data[0].PDPA[0].CONSENTGIVEN ? 'ยินยอมให้ข้อมูล' : 'ไม่ยินยอมให้ข้อมูล'}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* 8. รายละเอียดสัญญา */}
                  <button
                    onClick={() => {
                      handleClick('UpdateSalesContract').then(ok => {
                        if (ok) {
                          // navigate('/sale/update/UpdateSalesContract', { state: data[0] })
                          navigate('/sale/contract', { state: data[0] })
                        }
                      })
                    }}
                    className='w-100 text-start border-0 bg-transparent p-0'
                    style={{ cursor: 'pointer' }}
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data[0].CONTRACT.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className={`${styles.label}`}>8. รายละเอียดสัญญา</div>
                        {data[0].CONTRACT.length !== 0 && (
                          <span className={`text-gray-700 d-block ${styles.label}`}>
                            {/* {`วันที่ทำสัญญา: ${data[0].CONTRACT[0].createdAt && formatThaiDate(data[0].CONTRACT[0].createdAt)}`} */}
                            {`วันที่ทำสัญญา: ${formatToBE(data[0].CONTRACT[0].createdAt && (data[0].CONTRACT[0].createdAt))}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* 9. การชำระเงิน / นัดชำระ */}
                  <button
                    onClick={async () => {
                      if (data[0]?.CONTRACT.length === 0) {
                        await Swal.fire({
                          icon: 'error',
                          title: 'เกิดข้อผิดพลาด',
                          text: 'กรุณาบันทึกรายละเอียดสัญญาก่อน',
                          confirmButtonText: 'ตกลง',
                        });
                        return;
                      }
                      if (hasPaymentPeriod) {
                        await Swal.fire({
                          icon: 'info',
                          title: 'ไม่สามารถแก้ไขได้',
                          confirmButtonText: 'ตกลง',
                        });
                        return;
                      }
                      // if (paidFromLocal) {
                      //   await Swal.fire({
                      //     icon: 'info',
                      //     title: 'ไม่สามารถแก้ไขได้',
                      //     confirmButtonText: 'ตกลง',
                      //   });
                      //   return;
                      // }
                      handleClick('UpdateSalesContract').then(ok => {
                        if (ok) {
                          // navigate('/firstBill/CreateFirstBill', { state: data[0] })
                          navigate('/firstBill/CreateFirstBill', {
                            state: {
                              item: data[0],
                              from: location.pathname
                            }
                          })
                        }
                      })
                    }}
                    className='w-100 text-start border-0 bg-transparent p-0'
                    style={{ cursor: 'pointer' }}
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data[0].CONTRACT.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className={`${styles.label}`}>9. การชำระเงิน / นัดชำระ</div>
                        {data[0].CONTRACT.length !== 0 && (
                          <span className={`text-gray-700 d-block ${styles.label}`}>
                            {/* {`วันที่ทำสัญญา: ${data[0].CONTRACT[0].createdAt && formatThaiDate(data[0].CONTRACT[0].createdAt)}`} */}
                            {/* {`วันที่ทำสัญญา: ${data[0].CONTRACT[0].createdAt && (data[0].CONTRACT[0].createdAt)}`} */}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* 9. ถ่ายรูป */}
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'inherit',
                      cursor: 'pointer',
                      fontSize: 'inherit',
                    }}
                    onClick={async () => {
                      if (data[0]?.CONTRACT.length === 0) {
                        await Swal.fire({
                          icon: 'error',
                          title: 'เกิดข้อผิดพลาด',
                          text: 'กรุณาบันทึกรายละเอียดสัญญาก่อน',
                          confirmButtonText: 'ตกลง',
                        });
                        return;
                      }
                      handleClick('photo').then(ok => {
                        if (ok) {
                          navigate('/sale/photo', { state: { fromStep: true, data: data[0] } })
                        }
                      })
                    }}
                    type='button'
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${images && Object.values(images).some(field => Array.isArray(field) && field.length > 0)
                        ? 'bg-success'
                        : 'bg-danger'
                        }`}></span>
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className={`${styles.label}`}>10. ถ่ายรูป</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* ปุ่มย้อนกลับ (Desktop) */}
            <div className='d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10'>
              <Link
                to='/sale/overview'
                className={`${styles.btnSecondary}`}
              >
                ย้อนกลับ
              </Link>
            </div>

            {/* ปุ่มย้อนกลับ (Mobile) */}
            <div
              className="d-flex d-xl-none justify-content-start align-items-center bg-light p-3 border-top"
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1050,
              }}
            >
              <Link to='/sale/overview'
                className={`${styles.btnSecondary}`}
              >
                ย้อนกลับ
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center my-10">
            <h5>ไม่พบข้อมูล contract</h5>
          </div>
        )}
      </Content >
    </>
  )
}

export default Step