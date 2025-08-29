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

// const SalesCreateAddress: React.FC = () => {
//     const navigate = useNavigate()
//     const MySwal = withReactContent(Swal);

//     const { REFNO } = useUUIDStore();
//     const { auth } = useAuth();
//     const EmpId = auth?.data?.[0]?.EmpId || '';
//     const TeamSale = auth?.data?.[0]?.TeamSale || '';
//     const SaleCode = auth?.data?.[0]?.SaleCode || '';
//     const SupEmpId = auth?.data?.[0]?.SupEmp || '';
//     const SecEmpId = auth?.data?.[0]?.SecEmp || '';

//     const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//     const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;
//     const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

//     const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
//     const CUSTOMER_TYPE_URL = `${API_SALECONNEXT}/GetCustomertype`;
//     const PROVINCE_URL = `${API_SALECONNEXT}/GetAddress/Province`;
//     const DISTRICT_URL = `${API_SALECONNEXT}/GetAddress/District`;
//     const SUBDISTRICT_URL = `${API_SALECONNEXT}/GetAddress/SubDistrict`;
//     const ZIPCODE_URL = `${API_SALECONNEXT}/GetAddress/Zipcode`;

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

//     // ที่อยู่ลูกค้า ตามบัตร
//     const [getProvince, setGetProvince] = useState<any[]>([]);
//     const [getDistrict, setGetDistrict] = useState<any[]>([]);
//     const [getSubDistrict, setGetSubDistrict] = useState<any[]>([]);
//     const [getZipcode, setGetZipcode] = useState<any[]>([]);

//     // สร้าง state สำหรับ "ที่อยู่ลูกค้า (ตามบัตร)
//     const [addressNumber, setAddressNumber] = useState<string>('');
//     const [addressMoo, setAddressMoo] = useState<string>('');
//     const [addressSoi, setAddressSoi] = useState<string>('');
//     const [addressRoad, setAddressRoad] = useState<string>('');
//     const [selectedProvince, setSelectedProvince] = useState<number>();
//     // console.log(`selectedProvince`, selectedProvince);

//     const [selectedDistrict, setSelectedDistrict] = useState<number>();
//     const [selectedSubDistrict, setSelectedSubDistrict] = useState<number>();
//     const [selectedZipcode, setSelectedZipcode] = useState<string>('');
//     const [addressPhone, setAddressPhone] = useState<string>('');
//     const [useThisTax, setUseThisTax] = useState<string>('FALSE');

//     // ที่อยู่ลูกค้า ติดตั้ง
//     const [getProvinceForInstall, setGetProvinceForInstall] = useState<any[]>([]);
//     const [getDistrictForInstall, setGetDistrictForInstall] = useState<any[]>([]);
//     const [getSubDistrictForInstall, setGetSubDistrictForInstall] = useState<any[]>([]);
//     const [getZipcodeForInstall, setGetZipcodeForInstall] = useState<any[]>([]);

//     // สร้าง state สำหรับ "ที่อยู่ลูกค้า (ติดตั้ง)
//     const [addressNumberForInstall, setAddressNumberForInstall] = useState<string>('');
//     // console.log(`addressNumberForInstall`, addressNumberForInstall);
//     const [addressMooForInstall, setAddressMooForInstall] = useState<string>('');
//     const [addressSoiForInstall, setAddressSoiForInstall] = useState<string>('');
//     const [addressRoadForInstall, setAddressRoadForInstall] = useState<string>('');
//     const [selectedProvinceForInstall, setSelectedProvinceForInstall] = useState<number | undefined>();
//     const [selectedDistrictForInstall, setSelectedDistrictForInstall] = useState<number | undefined>();
//     const [selectedSubDistrictForInstall, setSelectedSubDistrictForInstall] = useState<number | undefined>();
//     const [selectedZipcodeForInstall, setSelectedZipcodeForInstall] = useState<string>('');
//     const [addressPhoneForInstall, setAddressPhoneForInstall] = useState<string>('');

//     // ที่อยู่ลูกค้า เก็บเงิน
//     const [getProvinceForPayment, setGetProvinceForPayment] = useState<any[]>([]);
//     const [getDistrictForPayment, setGetDistrictForPayment] = useState<any[]>([]);
//     const [getSubDistrictForPayment, setGetSubDistrictForPayment] = useState<any[]>([]);
//     const [getZipcodeForPayment, setGetZipcodeForPayment] = useState<any[]>([]);

//     // สร้าง state สำหรับ "ที่อยู่ลูกค้า (เก็บเงิน)
//     const [addressNumberForPayment, setAddressNumberForPayment] = useState<string>('');
//     // console.log(`addressNumberForPayment`, addressNumberForPayment);

//     const [addressMooForPayment, setAddressMooForPayment] = useState<string>('');
//     const [addressSoiForPayment, setAddressSoiForPayment] = useState<string>('');
//     const [addressRoadForPayment, setAddressRoadForPayment] = useState<string>('');
//     const [selectedProvinceForPayment, setSelectedProvinceForPayment] = useState<number | undefined>();
//     const [selectedDistrictForPayment, setSelectedDistrictForPayment] = useState<number | undefined>();
//     const [selectedSubDistrictForPayment, setSelectedSubDistrictForPayment] = useState<number | undefined>();
//     const [selectedZipcodeForPayment, setSelectedZipcodeForPayment] = useState<string>('');
//     const [addressPhoneForPayment, setAddressPhoneForPayment] = useState<string>('');

//     // สร้าง state สำหรับ "ที่อยู่ลูกค้า (ออกใบกำกับภาษี)
//     const [showTaxAddress, setShowTaxAddress] = useState<boolean>(false);

//     const [getProvinceForBilling, setGetProvinceForBilling] = useState<any[]>([]);
//     const [getDistrictForBilling, setGetDistrictForBilling] = useState<any[]>([]);
//     const [getSubDistrictForBilling, setGetSubDistrictForBilling] = useState<any[]>([]);
//     const [getZipcodeForBilling, setGetZipcodeForBilling] = useState<any[]>([]);

//     const [addressNumberForBilling, setAddressNumberForBilling] = useState<string>('');
//     const [addressMooForBilling, setAddressMooForBilling] = useState<string>('');
//     const [addressSoiForBilling, setAddressSoiForBilling] = useState<string>('');
//     const [addressRoadForBilling, setAddressRoadForBilling] = useState<string>('');
//     const [selectedProvinceForBilling, setSelectedProvinceForBilling] = useState<number | undefined>();
//     const [selectedDistrictForBilling, setSelectedDistrictForBilling] = useState<number | undefined>();
//     const [selectedSubDistrictForBilling, setSelectedSubDistrictForBilling] = useState<number | undefined>();
//     const [selectedZipcodeForBilling, setSelectedZipcodeForBilling] = useState<string>('');
//     const [addressPhoneForBilling, setAddressPhoneForBilling] = useState<string>('');

//     // [ที่อยู่ลูกค้า (ตามบัตร)]
//     const [likeAllAddr, setLikeAllAddr] = useState(false)

//     // [ที่อยู่ลูกค้า (ติดตั้ง)]
//     const [installLikeCardAddr, setInstallLikeCardAddr] = useState(false)

//     // [ที่อยู่ลูกค้า (เก็บเงิน)]
//     const [paymentLikeCardAddr, setPaymentLikeCardAddr] = useState(false)
//     const [paymentLikeInstallAddr, setPaymentLikeInstallAddr] = useState(false)

//     // [ที่อยู่ลูกค้า (ออกใบกำกับ)]
//     const [billLikeCardAddr, setBillLikeCardAddr] = useState(false)
//     const [billLikeInstallAddr, setBillLikeInstallAddr] = useState(false)
//     const [billLikePaymentAddr, setBillLikePaymentAddr] = useState(false)

//     const [showCustomerAddress, setShowCustomerAddress] = useState(false);
//     const [showInstallAddress, setShowInstallAddress] = useState(false);
//     const [showPaymentAddress, setShowPaymentAddress] = useState(false);

//     // GET Province
//     useEffect(() => {
//         const getData = async () => {
//             try {
//                 const response = await axios.get(PROVINCE_URL, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     }
//                 });
//                 setGetProvince(response.data);
//             } catch (error) {
//                 console.error('Error fetching CUSTOMER_TYPE_URL:', error);
//             }
//         };
//         getData();
//     }, []);

//     // GET Province For Install
//     useEffect(() => {
//         const getData = async () => {
//             try {
//                 const response = await axios.get(PROVINCE_URL, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     }
//                 });
//                 setGetProvinceForInstall(response.data);
//             } catch (error) {
//                 console.error('Error fetching CUSTOMER_TYPE_URL:', error);
//             }
//         };
//         getData();
//     }, []);

//     // GET Province For Payment
//     useEffect(() => {
//         const getData = async () => {
//             try {
//                 const response = await axios.get(PROVINCE_URL, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     }
//                 });
//                 setGetProvinceForPayment(response.data);
//             } catch (error) {
//                 console.error('Error fetching CUSTOMER_TYPE_URL:', error);
//             }
//         };
//         getData();
//     }, []);

//     // GET Province For Billing tax
//     useEffect(() => {
//         const getData = async () => {
//             try {
//                 const response = await axios.get(PROVINCE_URL, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     }
//                 });
//                 setGetProvinceForBilling(response.data);
//             } catch (error) {
//                 console.error('Error fetching CUSTOMER_TYPE_URL:', error);
//             }
//         };
//         getData();
//     }, []);

//     // POST District
//     useEffect(() => {
//         const getData = async () => {
//             if (selectedProvince) { // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
//                 try {
//                     const response = await axios.post(DISTRICT_URL, { ProvinceCode: selectedProvince }, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         }
//                     });
//                     setGetDistrict(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
//                 } catch (error) {
//                     console.error('Error fetching DISTRICT_URL:', error);
//                 }
//             } else {
//                 setGetDistrict([]); // ล้างข้อมูล district เมื่อไม่ได้เลือก province
//             }
//         };
//         getData();
//     }, [selectedProvince]);

//     // POST District For Install
//     useEffect(() => {
//         const getData = async () => {
//             if (selectedProvinceForInstall) { // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
//                 try {
//                     const response = await axios.post(DISTRICT_URL, { ProvinceCode: selectedProvinceForInstall }, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         }
//                     });
//                     setGetDistrictForInstall(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
//                 } catch (error) {
//                     console.error('Error fetching DISTRICT_URL:', error);
//                 }
//             } else {
//                 setGetDistrictForInstall([]); // ล้างข้อมูล district เมื่อไม่ได้เลือก province
//             }
//         };
//         getData();
//     }, [selectedProvinceForInstall]);

//     // POST District For Payment
//     useEffect(() => {
//         const getData = async () => {
//             if (selectedProvinceForPayment) { // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
//                 try {
//                     const response = await axios.post(DISTRICT_URL, { ProvinceCode: selectedProvinceForPayment }, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         }
//                     });
//                     setGetDistrictForPayment(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
//                 } catch (error) {
//                     console.error('Error fetching DISTRICT_URL:', error);
//                 }
//             } else {
//                 setGetDistrictForPayment([]); // ล้างข้อมูล district เมื่อไม่ได้เลือก province
//             }
//         };
//         getData();
//     }, [selectedProvinceForPayment]);

//     // POST District For Billing tax
//     useEffect(() => {
//         const getData = async () => {
//             if (selectedProvinceForBilling) { // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
//                 try {
//                     const response = await axios.post(DISTRICT_URL, { ProvinceCode: selectedProvinceForBilling }, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         }
//                     });
//                     setGetDistrictForBilling(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
//                 } catch (error) {
//                     console.error('Error fetching DISTRICT_URL:', error);
//                 }
//             } else {
//                 setGetDistrictForBilling([]); // ล้างข้อมูล district เมื่อไม่ได้เลือก province
//             }
//         };
//         getData();
//     }, [selectedProvinceForBilling]);

//     // POST SubDistrict
//     useEffect(() => {
//         const fetchSubDistricts = async () => {
//             if (selectedDistrict) {
//                 try {
//                     const response = await axios.post(SUBDISTRICT_URL, { DistrictCode: selectedDistrict }, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         }
//                     });
//                     setGetSubDistrict(response.data);
//                 } catch (error) {
//                     console.error('Error fetching SUBDISTRICT_URL:', error);
//                 }
//             } else {
//                 setGetSubDistrict([]);
//             }
//         };
//         fetchSubDistricts();
//     }, [selectedDistrict]);

//     // POST SubDistrict For Install
//     useEffect(() => {
//         const fetchSubDistricts = async () => {
//             if (selectedDistrictForInstall) {
//                 try {
//                     const response = await axios.post(SUBDISTRICT_URL, { DistrictCode: selectedDistrictForInstall }, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         }
//                     });
//                     setGetSubDistrictForInstall(response.data);
//                 } catch (error) {
//                     console.error('Error fetching SUBDISTRICT_URL:', error);
//                 }
//             } else {
//                 setGetSubDistrictForInstall([]);
//             }
//         };
//         fetchSubDistricts();
//     }, [selectedDistrictForInstall]);

//     // POST SubDistrict For Payment
//     useEffect(() => {
//         const fetchSubDistricts = async () => {
//             if (selectedDistrictForPayment) {
//                 try {
//                     const response = await axios.post(SUBDISTRICT_URL, { DistrictCode: selectedDistrictForPayment }, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         }
//                     });
//                     setGetSubDistrictForPayment(response.data);
//                 } catch (error) {
//                     console.error('Error fetching SUBDISTRICT_URL:', error);
//                 }
//             } else {
//                 setGetSubDistrictForPayment([]);
//             }
//         };
//         fetchSubDistricts();
//     }, [selectedDistrictForPayment]);

//     // POST SubDistrict For Billing tax
//     useEffect(() => {
//         const fetchSubDistricts = async () => {
//             if (selectedDistrictForBilling) {
//                 try {
//                     const response = await axios.post(SUBDISTRICT_URL, { DistrictCode: selectedDistrictForBilling }, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         }
//                     });
//                     setGetSubDistrictForBilling(response.data);
//                 } catch (error) {
//                     console.error('Error fetching SUBDISTRICT_URL:', error);
//                 }
//             } else {
//                 setGetSubDistrictForBilling([]);
//             }
//         };
//         fetchSubDistricts();
//     }, [selectedDistrictForBilling]);

//     // POST Zipcode
//     useEffect(() => {
//         const getZipcode = async () => {
//             if (selectedSubDistrict) {
//                 try {
//                     const response = await axios.post(ZIPCODE_URL, { SubDistrictCode: selectedSubDistrict }, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         }
//                     });
//                     if (response.data.length > 0) {
//                         setSelectedZipcode(response.data[0].POSTCODE); // อัปเดตรหัสไปรษณีย์ใน state
//                     }
//                 } catch (error) {
//                     console.error('Error fetching ZIPCODE_URL:', error);
//                 }
//             } else {
//                 setSelectedZipcode(''); // เคลียร์ข้อมูลรหัสไปรษณีย์เมื่อไม่เลือกตำบล
//             }
//         };
//         getZipcode();
//     }, [selectedSubDistrict]);

//     // POST Zipcode For Install
//     useEffect(() => {
//         const getZipcode = async () => {
//             if (selectedSubDistrictForInstall) {
//                 try {
//                     const response = await axios.post(ZIPCODE_URL, { SubDistrictCode: selectedSubDistrictForInstall }, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         }
//                     });
//                     if (response.data.length > 0) {
//                         setSelectedZipcodeForInstall(response.data[0].POSTCODE); // อัปเดตรหัสไปรษณีย์ใน state
//                     }
//                 } catch (error) {
//                     console.error('Error fetching ZIPCODE_URL:', error);
//                 }
//             } else {
//                 setSelectedZipcodeForInstall(''); // เคลียร์ข้อมูลรหัสไปรษณีย์เมื่อไม่เลือกตำบล
//             }
//         };
//         getZipcode();
//     }, [selectedSubDistrictForInstall]);

//     // POST Zipcode For Payment
//     useEffect(() => {
//         const getZipcode = async () => {
//             if (selectedSubDistrictForPayment) {
//                 try {
//                     const response = await axios.post(ZIPCODE_URL, { SubDistrictCode: selectedSubDistrictForPayment }, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         }
//                     });
//                     if (response.data.length > 0) {
//                         setSelectedZipcodeForPayment(response.data[0].POSTCODE); // อัปเดตรหัสไปรษณีย์ใน state
//                     }
//                 } catch (error) {
//                     console.error('Error fetching ZIPCODE_URL:', error);
//                 }
//             } else {
//                 setSelectedZipcodeForPayment(''); // เคลียร์ข้อมูลรหัสไปรษณีย์เมื่อไม่เลือกตำบล
//             }
//         };
//         getZipcode();
//     }, [selectedSubDistrictForPayment]);

//     // POST Zipcode For Billing tax
//     useEffect(() => {
//         const getZipcode = async () => {
//             if (selectedSubDistrictForBilling) {
//                 try {
//                     const response = await axios.post(ZIPCODE_URL, { SubDistrictCode: selectedSubDistrictForBilling }, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         }
//                     });
//                     if (response.data.length > 0) {
//                         setSelectedZipcodeForBilling(response.data[0].POSTCODE); // อัปเดตรหัสไปรษณีย์ใน state
//                     }
//                 } catch (error) {
//                     console.error('Error fetching ZIPCODE_URL:', error);
//                 }
//             } else {
//                 setSelectedZipcodeForBilling(''); // เคลียร์ข้อมูลรหัสไปรษณีย์เมื่อไม่เลือกตำบล
//             }
//         };
//         getZipcode();
//     }, [selectedSubDistrictForBilling]);

//     // ที่อยู่ลูกค้า (ตามบัตร)
//     const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
//         const value = Number(e.target.value);
//         // console.log(`test`, value);
//         setSelectedProvince(value);

//         // Reset district, subdistrict, and zipcode
//         setSelectedDistrict(undefined);
//         setSelectedSubDistrict(undefined);
//         setSelectedZipcode('');
//     };

//     const handleDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
//         const value = Number(e.target.value);
//         setSelectedDistrict(value);
//         // Reset subdistrict and zipcode
//         setSelectedSubDistrict(undefined);
//         setSelectedZipcode('');
//     };

//     const handleSubDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
//         const value = Number(e.target.value);
//         setSelectedSubDistrict(value);
//         // Reset zipcode
//         setSelectedZipcode('');
//     };

//     // ที่อยู่ลูกค้า (ติดตั้ง)
//     const handleProvinceChangeForInstall = (e: ChangeEvent<HTMLSelectElement>) => {
//         const value = Number(e.target.value);
//         setSelectedProvinceForInstall(value);
//         // Reset district, subdistrict, and zipcode
//         setSelectedDistrictForInstall(undefined);
//         setSelectedSubDistrictForInstall(undefined);
//         setSelectedZipcodeForInstall('');
//     };

//     const handleDistrictChangeForInstall = (e: ChangeEvent<HTMLSelectElement>) => {
//         const value = Number(e.target.value);
//         setSelectedDistrictForInstall(value);
//         // Reset subdistrict and zipcode
//         setSelectedSubDistrictForInstall(undefined);
//         setSelectedZipcodeForInstall('');
//     };

//     const handleSubDistrictChangeForInstall = (e: ChangeEvent<HTMLSelectElement>) => {
//         const value = Number(e.target.value);
//         setSelectedSubDistrictForInstall(value);
//         // Reset zipcode
//         setSelectedZipcodeForInstall('');
//     };

//     // ที่อยู่ลูกค้า (เก็บเงิน)
//     const handleProvinceChangeForPayment = (e: ChangeEvent<HTMLSelectElement>) => {
//         const value = Number(e.target.value);
//         setSelectedProvinceForPayment(value);
//         // Reset district, subdistrict, and zipcode
//         setSelectedDistrictForPayment(undefined);
//         setSelectedSubDistrictForPayment(undefined);
//         setSelectedZipcodeForPayment('');
//     };

//     const handleDistrictChangeForPayment = (e: ChangeEvent<HTMLSelectElement>) => {
//         const value = Number(e.target.value);
//         setSelectedDistrictForPayment(value);
//         // Reset subdistrict and zipcode
//         setSelectedSubDistrictForPayment(undefined);
//         setSelectedZipcodeForPayment('');
//     };

//     const handleSubDistrictChangeForPayment = (e: ChangeEvent<HTMLSelectElement>) => {
//         const value = Number(e.target.value);
//         setSelectedSubDistrictForPayment(value);
//         // Reset zipcode
//         setSelectedZipcodeForPayment('');
//     };

//     // จัดการติ้กใน accordion ที่อยู่ลูกค้า (ตามบัตร)
//     const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
//         const { name, checked } = event.target;

//         if (name === 'allAddress') {
//             setLikeAllAddr(checked)

//             if (checked) {
//                 setAddressNumberForInstall(addressNumber);
//                 setAddressMooForInstall(addressMoo);
//                 setAddressSoiForInstall(addressSoi);
//                 setAddressRoadForInstall(addressRoad);
//                 setSelectedProvinceForInstall(selectedProvince);
//                 setSelectedDistrictForInstall(selectedDistrict);
//                 setSelectedSubDistrictForInstall(selectedSubDistrict);
//                 setSelectedZipcodeForInstall(selectedZipcode);
//                 setAddressPhoneForInstall(addressPhone);

//                 setAddressNumberForPayment(addressNumber);
//                 setAddressMooForPayment(addressMoo);
//                 setAddressSoiForPayment(addressSoi);
//                 setAddressRoadForPayment(addressRoad);
//                 setSelectedProvinceForPayment(selectedProvince);
//                 setSelectedDistrictForPayment(selectedDistrict);
//                 setSelectedSubDistrictForPayment(selectedSubDistrict);
//                 setSelectedZipcodeForPayment(selectedZipcode);
//                 setAddressPhoneForPayment(addressPhone);
//             }
//         }

//         if (name === 'likeAddressCard') {
//             setInstallLikeCardAddr(checked)

//             if (checked) {
//                 // คัดลอกข้อมูลจากที่อยู่ตามบัตร ไปยังที่อยู่ติดตั้ง
//                 setAddressNumberForInstall(addressNumber);
//                 setAddressMooForInstall(addressMoo);
//                 setAddressSoiForInstall(addressSoi);
//                 setAddressRoadForInstall(addressRoad);
//                 setSelectedProvinceForInstall(selectedProvince);
//                 setSelectedDistrictForInstall(selectedDistrict);
//                 setSelectedSubDistrictForInstall(selectedSubDistrict);
//                 setSelectedZipcodeForInstall(selectedZipcode);
//                 setAddressPhoneForInstall(addressPhone);
//             }
//         }

//         if (name === 'paymentLikeAddressCard') {
//             // setShowPaymentAddress(checked);
//             setPaymentLikeCardAddr(checked)
//             setPaymentLikeInstallAddr(false)

//             if (checked) {
//                 // คัดลอกข้อมูลจากที่อยู่ตามบัตร ไปยังที่อยู่เก็บเงิน
//                 setAddressNumberForPayment(addressNumber);
//                 setAddressMooForPayment(addressMoo);
//                 setAddressSoiForPayment(addressSoi);
//                 setAddressRoadForPayment(addressRoad);
//                 setSelectedProvinceForPayment(selectedProvince);
//                 setSelectedDistrictForPayment(selectedDistrict);
//                 setSelectedSubDistrictForPayment(selectedSubDistrict);
//                 setSelectedZipcodeForPayment(selectedZipcode);
//                 setAddressPhoneForPayment(addressPhone);
//             }
//         }

//         if (name === 'paymentLikeAddressInstall') {
//             // setShowPaymentAddress(checked);
//             setPaymentLikeCardAddr(false)
//             setPaymentLikeInstallAddr(checked)

//             if (checked) {
//                 // คัดลอกข้อมูลจากที่อยู่ตามบัตร ไปยังที่อยู่เก็บเงิน
//                 setAddressNumberForPayment(addressNumberForInstall);
//                 setAddressMooForPayment(addressMooForInstall);
//                 setAddressSoiForPayment(addressSoiForInstall);
//                 setAddressRoadForPayment(addressRoadForInstall);
//                 setSelectedProvinceForPayment(selectedProvinceForInstall);
//                 setSelectedDistrictForPayment(selectedDistrictForInstall);
//                 setSelectedSubDistrictForPayment(selectedSubDistrictForInstall);
//                 setSelectedZipcodeForPayment(selectedZipcodeForInstall);
//                 setAddressPhoneForPayment(addressPhoneForInstall);
//             }
//         }

//         if (name === 'showInstallAddress') {
//             setShowInstallAddress(checked);

//             if (checked) {
//                 // คัดลอกข้อมูลจากที่อยู่ตามบัตร ไปยังที่อยู่ติดตั้ง
//                 setAddressNumberForInstall(addressNumber);
//                 setAddressMooForInstall(addressMoo);
//                 setAddressSoiForInstall(addressSoi);
//                 setAddressRoadForInstall(addressRoad);
//                 setSelectedProvinceForInstall(selectedProvince);
//                 setSelectedDistrictForInstall(selectedDistrict);
//                 setSelectedSubDistrictForInstall(selectedSubDistrict);
//                 setSelectedZipcodeForInstall(selectedZipcode);
//                 setAddressPhoneForInstall(addressPhone);
//             }
//         }

//         if (name === 'showPaymentAddress') {
//             setShowPaymentAddress(checked);

//             if (checked) {
//                 // คัดลอกข้อมูลจากที่อยู่ตามบัตร ไปยังที่อยู่เก็บเงิน
//                 setAddressNumberForPayment(addressNumber);
//                 setAddressMooForPayment(addressMoo);
//                 setAddressSoiForPayment(addressSoi);
//                 setAddressRoadForPayment(addressRoad);
//                 setSelectedProvinceForPayment(selectedProvince);
//                 setSelectedDistrictForPayment(selectedDistrict);
//                 setSelectedSubDistrictForPayment(selectedSubDistrict);
//                 setSelectedZipcodeForPayment(selectedZipcode);
//                 setAddressPhoneForPayment(addressPhone);
//             }
//         }

//         if (name === 'billLikeAddressCard') {
//             setBillLikeCardAddr(checked)
//             setBillLikeInstallAddr(false)
//             setBillLikePaymentAddr(false)

//             if (checked) {
//                 setAddressNumberForBilling(addressNumber);
//                 setAddressMooForBilling(addressMoo);
//                 setAddressSoiForBilling(addressSoi);
//                 setAddressRoadForBilling(addressRoad);
//                 setSelectedProvinceForBilling(selectedProvince);
//                 setSelectedDistrictForBilling(selectedDistrict);
//                 setSelectedSubDistrictForBilling(selectedSubDistrict);
//                 setSelectedZipcodeForBilling(selectedZipcode);
//                 setAddressPhoneForBilling(addressPhone);
//             }
//         }

//         if (name === 'billLikeAddressInstall') {
//             setBillLikeCardAddr(false)
//             setBillLikeInstallAddr(checked)
//             setBillLikePaymentAddr(false)

//             if (checked) {
//                 setAddressNumberForBilling(addressNumberForInstall);
//                 setAddressMooForBilling(addressMooForInstall);
//                 setAddressSoiForBilling(addressSoiForInstall);
//                 setAddressRoadForBilling(addressRoadForInstall);
//                 setSelectedProvinceForBilling(selectedProvinceForInstall);
//                 setSelectedDistrictForBilling(selectedDistrictForInstall);
//                 setSelectedSubDistrictForBilling(selectedSubDistrictForInstall);
//                 setSelectedZipcodeForBilling(selectedZipcodeForInstall);
//                 setAddressPhoneForBilling(addressPhoneForInstall);
//             }
//         }

//         if (name === 'billLikeAddressPayment') {
//             setBillLikeCardAddr(false)
//             setBillLikeInstallAddr(false)
//             setBillLikePaymentAddr(checked)

//             if (checked) {
//                 setAddressNumberForBilling(addressNumberForPayment);
//                 setAddressMooForBilling(addressMooForPayment);
//                 setAddressSoiForBilling(addressSoiForPayment);
//                 setAddressRoadForBilling(addressRoadForPayment);
//                 setSelectedProvinceForBilling(selectedProvinceForPayment);
//                 setSelectedDistrictForBilling(selectedDistrictForPayment);
//                 setSelectedSubDistrictForBilling(selectedSubDistrictForPayment);
//                 setSelectedZipcodeForBilling(selectedZipcodeForPayment);
//                 setAddressPhoneForBilling(addressPhoneForPayment);
//             }
//         }

//     };

//     // ฟังก์ชันเพื่อล้างการติ๊กใน  accordion อื่นๆ เมื่อมีการเปลี่ยนแปลงข้อมูลใน accordion ที่อยู่ลูกค้า (ตามบัตร)
//     const resetShowAddressCard = () => {
//         setLikeAllAddr(false)
//         setInstallLikeCardAddr(false)
//         setPaymentLikeInstallAddr(false)
//         setPaymentLikeCardAddr(false)
//         setBillLikePaymentAddr(false)
//         setBillLikeCardAddr(false)
//     };

//     // ฟังก์ชันเพื่อล้างการติ๊กใน  accordion ที่อยู่ลูกค้า (ตามบัตร) เมื่อมีการเปลี่ยนแปลงข้อมูลใน accordion ที่อยู่ลูกค้า (ติดตั้ง)
//     const resetShowInstallAddress = () => {
//         setLikeAllAddr(false)
//         setInstallLikeCardAddr(false)
//         setPaymentLikeInstallAddr(false)
//         setBillLikeInstallAddr(false)

//     };

//     // ฟังก์ชันเพื่อล้างการติ๊กใน  accordion ที่อยู่ลูกค้า (ตามบัตร) เมื่อมีการเปลี่ยนแปลงข้อมูลใน accordion ที่อยู่ลูกค้า (เก็บเงิน)
//     const resetShowPaymentAddress = () => {
//         setLikeAllAddr(false)
//         setInstallLikeCardAddr(false)
//         setPaymentLikeInstallAddr(false)
//         setBillLikePaymentAddr(false)

//     };

//     // ฟังก์ชันเพื่อล้างการติ๊กใน  accordion อื่นๆ เมื่อมีการเปลี่ยนแปลงข้อมูลใน accordion ที่อยู่ลูกค้า (เก็บเงิน)
//     const resetShowBillingAddress = () => {
//         setLikeAllAddr(false)
//         setBillLikeCardAddr(false)
//         setBillLikeInstallAddr(false)
//         setBillLikePaymentAddr(false)
//     };

//     {/*-------------------- Start Validate --------------------*/ }
//     const schema = yup.object().shape({
//         //ที่อยู่ติดตั้ง
//         homeNoIdCard: yup.string().required("กรุณากรอกบ้านเลขที่"),
//         provinceIdCard: yup.string().required("กรุณาเลือกจังหวัด"),
//         districtIdCard: yup.string().required("กรุณาเลือกอำเภอ / เขต"),
//         subDistrictIdCard: yup.string().required("กรุณาเลือกตำบล / แขวง"),
//         telNoIdCard: yup
//             .string()
//             .required("กรุณากรอกเบอร์ที่ติดต่อได้")
//             .matches(/^[0-9]{9,10}$/, "เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก"),
//     });

//     const { control, handleSubmit, formState: { errors }, trigger, setValue } = useForm({
//         resolver: yupResolver(schema),
//         mode: "onChange", // ตรวจสอบเมื่อมีการกรอกข้อมูล
//         reValidateMode: "onChange", // ตรวจสอบซ้ำเมื่อมีการเปลี่ยนแปลงข้อมูล
//         defaultValues: {
//             //ที่อยู่ติดตั้ง
//             homeNoIdCard: "",
//             provinceIdCard: "",
//             districtIdCard: "",
//             subDistrictIdCard: "",
//             telNoIdCard: "",
//         },
//     });

//     // console.log("Errors:", errors)

//     {/*-------------------- End Validate --------------------*/ }

//     const SaveAddressData = useMemo(() => {
//         const province = getProvince.find(p => String(p.PROVINCECODE) === String(selectedProvince));
//         const district = getDistrict.find(p => String(p.DISTRICTCODE) === String(selectedDistrict));
//         const subDistrict = getSubDistrict.find(p => String(p.SUBDISTRICTCODE) === String(selectedSubDistrict));

//         const provinceForInstall = getProvinceForInstall.find(p => String(p.PROVINCECODE) === String(selectedProvinceForInstall));
//         const districtForInstall = getDistrictForInstall.find(p => String(p.DISTRICTCODE) === String(selectedDistrictForInstall));
//         const subDistrictForInstall = getSubDistrictForInstall.find(p => String(p.SUBDISTRICTCODE) === String(selectedSubDistrictForInstall));

//         const provinceForPayment = getProvinceForPayment.find(p => String(p.PROVINCECODE) === String(selectedProvinceForPayment));
//         const districtForPayment = getDistrictForPayment.find(p => String(p.DISTRICTCODE) === String(selectedDistrictForPayment));
//         const subDistrictForPayment = getSubDistrictForPayment.find(p => String(p.SUBDISTRICTCODE) === String(selectedSubDistrictForPayment));

//         const provinceForBilling = getProvince.find(p => String(p.PROVINCECODE) === String(selectedProvinceForBilling));
//         const districtForBilling = getDistrictForBilling.find(p => String(p.DISTRICTCODE) === String(selectedDistrictForBilling));
//         const subDistrictForBilling = getSubDistrictForBilling.find(p => String(p.SUBDISTRICTCODE) === String(selectedSubDistrictForBilling));

//         return {
//             ADDRESSINSTALLATION: {
//                 ADDRESSNUMBER: addressNumber,
//                 ADDRESSMOO: addressMoo,
//                 ADDRESSSOI: addressSoi,
//                 ADDRESSROAD: addressRoad,
//                 ADDRESSPROVINCE: selectedProvince ? selectedProvince.toString() : '',
//                 ADDRESSPROVINCENAME: province ? province.PROVINCENAME : '',
//                 ADDRESSDISTRICT: selectedDistrict ? selectedDistrict.toString() : '',
//                 ADDRESSDISTRICTNAME: district ? district.DISTRICTNAME : '',
//                 ADDRESSSUBDISTRICT: selectedSubDistrict ? selectedSubDistrict.toString() : '',
//                 ADDRESSSUBDISTRICTNAME: subDistrict ? subDistrict.SUBDISTRICTNAME : '',
//                 ADDRESSZIPCODE: selectedZipcode,
//                 ADDRESSPHONE: addressPhone,
//                 USETHISTAX: useThisTax,
//             },
//             ADDRESSCARD: {
//                 ADDRESSNUMBER: addressNumberForInstall,
//                 ADDRESSMOO: addressMooForInstall,
//                 ADDRESSSOI: addressSoiForInstall,
//                 ADDRESSROAD: addressRoadForInstall,
//                 ADDRESSPROVINCE: selectedProvinceForInstall ? selectedProvinceForInstall.toString() : '',
//                 ADDRESSPROVINCENAME: provinceForInstall ? provinceForInstall.PROVINCENAME : '',
//                 ADDRESSDISTRICT: selectedDistrictForInstall ? selectedDistrictForInstall.toString() : '',
//                 ADDRESSDISTRICTNAME: districtForInstall ? districtForInstall.DISTRICTNAME : '',
//                 ADDRESSSUBDISTRICT: selectedSubDistrictForInstall ? selectedSubDistrictForInstall.toString() : '',
//                 ADDRESSSUBDISTRICTNAME: subDistrictForInstall ? subDistrictForInstall.SUBDISTRICTNAME : '',
//                 ADDRESSZIPCODE: selectedZipcodeForInstall,
//                 ADDRESSPHONE: addressPhoneForInstall,
//                 USETHISTAX: useThisTax,
//             },
//             ADDRESSPAYMENT: {
//                 ADDRESSNUMBER: addressNumberForPayment,
//                 ADDRESSMOO: addressMooForPayment,
//                 ADDRESSSOI: addressSoiForPayment,
//                 ADDRESSROAD: addressRoadForPayment,
//                 ADDRESSPROVINCE: selectedProvinceForPayment ? selectedProvinceForPayment.toString() : '',
//                 ADDRESSPROVINCENAME: provinceForPayment ? provinceForPayment.PROVINCENAME : '',
//                 ADDRESSDISTRICT: selectedDistrictForPayment ? selectedDistrictForPayment.toString() : '',
//                 ADDRESSDISTRICTNAME: districtForPayment ? districtForPayment.DISTRICTNAME : '',
//                 ADDRESSSUBDISTRICT: selectedSubDistrictForPayment ? selectedSubDistrictForPayment.toString() : '',
//                 ADDRESSSUBDISTRICTNAME: subDistrictForPayment ? subDistrictForPayment.SUBDISTRICTNAME : '',
//                 ADDRESSZIPCODE: selectedZipcodeForPayment,
//                 ADDRESSPHONE: addressPhoneForPayment,
//                 USETHISTAX: useThisTax,
//             },
//             ADDRESSTAX: {
//                 ADDRESSNUMBER: addressNumberForBilling,
//                 ADDRESSMOO: addressMooForBilling,
//                 ADDRESSSOI: addressSoiForBilling,
//                 ADDRESSROAD: addressRoadForBilling,
//                 ADDRESSPROVINCE: selectedProvinceForBilling ? selectedProvinceForBilling.toString() : '',
//                 ADDRESSPROVINCENAME: provinceForBilling ? provinceForBilling.PROVINCENAME : '',
//                 ADDRESSDISTRICT: selectedDistrictForBilling ? selectedDistrictForBilling.toString() : '',
//                 ADDRESSDISTRICTNAME: districtForBilling ? districtForBilling.DISTRICTNAME : '',
//                 ADDRESSSUBDISTRICT: selectedSubDistrictForBilling ? selectedSubDistrictForBilling.toString() : '',
//                 ADDRESSSUBDISTRICTNAME: subDistrictForBilling ? subDistrictForBilling.SUBDISTRICTNAME : '',
//                 ADDRESSZIPCODE: selectedZipcodeForBilling,
//                 ADDRESSPHONE: addressPhoneForBilling,
//                 USETHISTAX: useThisTax,
//             },
//         };
//     }, [
//         addressNumber, addressMoo, addressSoi, addressRoad, selectedProvince, selectedDistrict, selectedSubDistrict,
//         selectedZipcode, addressPhone, useThisTax, getProvince, getDistrict, getSubDistrict,

//         addressNumberForInstall, addressMooForInstall, addressSoiForInstall, addressRoadForInstall, selectedProvinceForInstall,
//         selectedDistrictForInstall, selectedSubDistrictForInstall, selectedZipcodeForInstall, addressPhoneForInstall,
//         getProvinceForInstall, getDistrictForInstall, getSubDistrictForInstall,

//         addressNumberForPayment, addressMooForPayment, addressSoiForPayment, addressRoadForPayment, selectedProvinceForPayment,
//         selectedDistrictForPayment, selectedSubDistrictForPayment, selectedZipcodeForPayment, addressPhoneForPayment,
//         getProvinceForPayment, getDistrictForPayment, getSubDistrictForPayment,

//         addressNumberForBilling, addressMooForBilling, addressSoiForBilling, addressRoadForBilling, selectedProvinceForBilling,
//         selectedDistrictForBilling, selectedSubDistrictForBilling, selectedZipcodeForBilling, addressPhoneForBilling,
//         getProvinceForBilling, getDistrictForBilling, getSubDistrictForBilling,
//     ]);

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
//                 FIELD: "ADDRESS",
//                 DATA: SaveAddressData
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
//             navigate("/sale/pdpa")
//         } catch (error) {
//             console.error("Error saving data:", error);
//             MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
//         }
//     };
//     {/*-------------------- End บันทึกข้อมูล --------------------*/ }

//     return (
//         <>
//             <Content >
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <div className='d-flex justify-content-between align-items-center my-5'>
//                         <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
//                             data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//                             className="page-title d-flex flex-wrap me-3 flex-column justify-content-ceดnter">
//                             <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//                                 <li className={`breadcrumb-item ${styles.titlePage}`}>ที่อยู่ลูกค้า</li>
//                             </ul>
//                         </div>
//                     </div>
//                     <span className={`${styles.fontSize}`}>เลขที่ขาย: </span><span className={`${styles.titlePage}`}>{REFNO}</span>

//                     {/* Start accordion ที่อยู่ลูกค้า (ติดตั้ง)*/}
//                     < div className='accordion mb-10' id='kt_accordion_2'>
//                         <div className='accordion-item mb-10'>
//                             <h2 className='accordion-header' id='kt_accordion_2_header_2'>
//                                 <h3
//                                     className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
//                                     data-bs-toggle='collapse'
//                                     data-bs-target='#kt_accordion_2_body_2'
//                                     aria-expanded='true'
//                                     aria-controls='kt_accordion_2_body_2'
//                                     style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
//                                 >
//                                     ที่อยู่ลูกค้า (ติดตั้ง)
//                                 </h3>
//                             </h2>
//                             <div
//                                 id='kt_accordion_2_body_2'
//                                 className='accordion-collapse collapse show'
//                                 aria-labelledby='kt_accordion_2_header_2'
//                                 data-bs-parent='#kt_accordion_2'
//                             >
//                                 <div className='accordion-body'>
//                                     {/* start form */}
//                                     <form noValidate className='form'>
//                                         <div className='card-body px-lg-9 px-1'>

//                                             <div className="">
//                                                 <div className='row mb-6'>
//                                                     <div className='col-lg-6 mt-xl-5'>
//                                                         <label className='form-check form-check-inline form-check-solid me-5'>
//                                                             <input
//                                                                 onChange={handleCheckboxChange}
//                                                                 className='form-check-input'
//                                                                 name='allAddress'
//                                                                 type='checkbox'
//                                                                 checked={likeAllAddr}
//                                                             />
//                                                             <span className={`ps-2 mb-sm-5 ${styles.label}`}>ใช้ที่อยู่เดียวกันทั้งหมด</span>
//                                                         </label>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="">
//                                                 <div className='row mb-6'>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label required ${styles.label}`}>บ้านเลขที่</label>
//                                                         <Controller
//                                                             name="homeNoIdCard"
//                                                             control={control}
//                                                             render={({ field }) => (
//                                                                 <input
//                                                                     {...field}
//                                                                     className={`${styles.label} form-control ${errors.homeNoIdCard ? "is-invalid" : ""}`}
//                                                                     value={addressNumber}
//                                                                     onChange={(e) => {
//                                                                         field.onChange(e)
//                                                                         setAddressNumber(e.target.value)
//                                                                         resetShowAddressCard()
//                                                                     }}
//                                                                     type='text'
//                                                                 />
//                                                             )}
//                                                         />
//                                                         {errors.homeNoIdCard && <p className={`text-danger ${styles.label}`}>{errors.homeNoIdCard.message}</p>}
//                                                     </div>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>หมู่ที่</label>
//                                                         <input
//                                                             value={addressMoo}
//                                                             onChange={(e) => {
//                                                                 setAddressMoo(e.target.value)
//                                                                 resetShowAddressCard()
//                                                             }}
//                                                             type='text'
//                                                             className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                                         />
//                                                     </div>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>ตรอก / ซอย</label>
//                                                         <input
//                                                             value={addressSoi}
//                                                             onChange={(e) => {
//                                                                 setAddressSoi(e.target.value)
//                                                                 resetShowAddressCard()
//                                                             }}
//                                                             type='text'
//                                                             className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="">
//                                                 <div className='row mb-6'>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>ถนน</label>
//                                                         <input
//                                                             value={addressRoad}
//                                                             onChange={(e) => {
//                                                                 setAddressRoad(e.target.value)
//                                                                 resetShowAddressCard()
//                                                             }}
//                                                             type='text'
//                                                             className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                                         />
//                                                     </div>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label required ${styles.label}`}>จังหวัด</label>
//                                                         <Controller
//                                                             name="provinceIdCard"
//                                                             control={control}
//                                                             render={({ field }) => (
//                                                                 <select
//                                                                     {...field}
//                                                                     className={`${styles.label} form-select ${errors.provinceIdCard ? "is-invalid" : ""}`}
//                                                                     onChange={(e) => {
//                                                                         field.onChange(e)
//                                                                         handleProvinceChange(e)
//                                                                         resetShowAddressCard()
//                                                                     }}
//                                                                 >
//                                                                     <option value=''>เลือกจังหวัด</option>
//                                                                     {getProvince.map((item: any) => (
//                                                                         <option key={item.PROVINCECODE} value={Number(item.PROVINCECODE)}>
//                                                                             {item.PROVINCENAME}
//                                                                         </option>
//                                                                     ))}
//                                                                 </select>
//                                                             )}
//                                                         />
//                                                         {errors.provinceIdCard && <p className={`text-danger ${styles.label}`}>{errors.provinceIdCard.message}</p>}
//                                                     </div>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label required ${styles.label}`}>อำเภอ / เขต</label>
//                                                         <Controller
//                                                             name="districtIdCard"
//                                                             control={control}
//                                                             render={({ field }) => (
//                                                                 <select
//                                                                     {...field}
//                                                                     className={`${styles.label} form-select ${errors.districtIdCard ? "is-invalid" : ""}`}
//                                                                     onChange={(e) => {
//                                                                         field.onChange(e)
//                                                                         handleDistrictChange(e)
//                                                                         resetShowAddressCard()
//                                                                     }}
//                                                                 >
//                                                                     <option value=''>เลือกอำเภอ / เขต</option>
//                                                                     {Array.isArray(getDistrict) && getDistrict.map((item: any) => (
//                                                                         <option key={item.DISTRICTCODE} value={item.DISTRICTCODE}>
//                                                                             {item.DISTRICTNAME}
//                                                                         </option>
//                                                                     ))}
//                                                                 </select>
//                                                             )}
//                                                         />
//                                                         {errors.districtIdCard && <p className={`text-danger ${styles.label}`}>{errors.districtIdCard.message}</p>}
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="">
//                                                 <div className='row mb-6'>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label required ${styles.label}`}>ตำบล / แขวง</label>
//                                                         <Controller
//                                                             name="subDistrictIdCard"
//                                                             control={control}
//                                                             render={({ field }) => (
//                                                                 <select
//                                                                     {...field}
//                                                                     className={`${styles.label} form-select ${errors.subDistrictIdCard ? "is-invalid" : ""}`}
//                                                                     onChange={(e) => {
//                                                                         field.onChange(e)
//                                                                         handleSubDistrictChange(e)
//                                                                         resetShowAddressCard()
//                                                                     }}
//                                                                 >
//                                                                     <option value=''>เลือกตำบล / แขวง</option>
//                                                                     {Array.isArray(getSubDistrict) && getSubDistrict.map((item: any) => (
//                                                                         <option key={item.SUBDISTRICTCODE} value={item.SUBDISTRICTCODE}>
//                                                                             {item.SUBDISTRICTNAME}
//                                                                         </option>
//                                                                     ))}
//                                                                 </select>
//                                                             )}
//                                                         />
//                                                         {errors.subDistrictIdCard && <p className={`text-danger ${styles.label}`}>{errors.subDistrictIdCard.message}</p>}
//                                                     </div>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label required ${styles.label}`}>รหัสไปรษณีย์</label>
//                                                         <input
//                                                             type='text'
//                                                             inputMode='numeric'
//                                                             pattern='[0-9]*'
//                                                             className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                                             value={selectedZipcode}
//                                                             readOnly
//                                                             style={{
//                                                                 backgroundColor: '#d7dbde',
//                                                             }}
//                                                         />
//                                                     </div>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label required ${styles.label}`}>เบอร์ที่ติดต่อได้</label>
//                                                         <Controller
//                                                             name="telNoIdCard"
//                                                             control={control}
//                                                             render={({ field }) => (
//                                                                 <input
//                                                                     {...field}
//                                                                     className={`${styles.label} form-control ${errors.telNoIdCard ? "is-invalid" : ""}`}
//                                                                     value={addressPhone}
//                                                                     maxLength={10}
//                                                                     onChange={(e) => {
//                                                                         field.onChange(e)
//                                                                         setAddressPhone(e.target.value)
//                                                                         resetShowAddressCard()
//                                                                     }}
//                                                                     type='text'
//                                                                     inputMode='numeric'
//                                                                     pattern='[0-9]*'
//                                                                 />
//                                                             )}
//                                                         />
//                                                         {errors.telNoIdCard && <p className={`text-danger ${styles.label}`}>{errors.telNoIdCard.message}</p>}
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                         </div>
//                                     </form>
//                                     {/* end form */}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {/* End accordion ที่อยู่ลูกค้า (ติดตั้ง)*/}

//                     {/* Start accordion ที่อยู่ลูกค้า (ตามบัตร) */}
//                     <div className='accordion mb-10' id='kt_accordion_3'>
//                         <div className='accordion-item mb-10'>
//                             <h2 className='accordion-header' id='kt_accordion_3_header_3'>
//                                 <h3
//                                     className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
//                                     data-bs-toggle='collapse'
//                                     data-bs-target='#kt_accordion_3_body_3'
//                                     aria-expanded='true'
//                                     aria-controls='kt_accordion_3_body_3'
//                                     style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
//                                 >
//                                     ที่อยู่ลูกค้า (ตามบัตร)
//                                 </h3>
//                             </h2>
//                             <div
//                                 id='kt_accordion_3_body_3'
//                                 className='accordion-collapse collapse hide'
//                                 aria-labelledby='kt_accordion_3_header_3'
//                                 data-bs-parent='#kt_accordion_3'
//                             >
//                                 <div className='accordion-body'>
//                                     <form noValidate className='form'>
//                                         <div className='card-body px-lg-9 px-1'>

//                                             <div className="">
//                                                 <div className='row mb-6'>
//                                                     <div className='col-lg-6 my-10 mt-xl-5'>
//                                                         <label className='form-check form-check-inline form-check-solid me-5'>
//                                                             <input
//                                                                 onChange={handleCheckboxChange}
//                                                                 className='form-check-input'
//                                                                 name='likeAddressCard'
//                                                                 type='checkbox'
//                                                                 checked={installLikeCardAddr}
//                                                             />
//                                                             <span className={`ps-2 mb-sm-5 ${styles.label}`}>ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง</span>
//                                                         </label>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="">
//                                                 <div className='row mb-6'>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>บ้านเลขที่</label>
//                                                         <input
//                                                             className={`form-control ${styles.label}`}
//                                                             value={addressNumberForInstall}
//                                                             onChange={(e) => {
//                                                                 setAddressNumberForInstall(e.target.value);
//                                                                 resetShowInstallAddress();
//                                                             }}
//                                                             type='text'
//                                                         />
//                                                     </div>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>หมู่ที่</label>
//                                                         <input
//                                                             value={addressMooForInstall}
//                                                             onChange={(e) => {
//                                                                 setAddressMooForInstall(e.target.value);
//                                                                 resetShowInstallAddress();
//                                                             }}
//                                                             type='text'
//                                                             className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                                         />
//                                                     </div>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>ตรอก / ซอย</label>
//                                                         <input
//                                                             value={addressSoiForInstall}
//                                                             onChange={(e) => {
//                                                                 setAddressSoiForInstall(e.target.value);
//                                                                 resetShowInstallAddress();
//                                                             }}
//                                                             type='text'
//                                                             className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="">
//                                                 <div className='row mb-6'>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>ถนน</label>
//                                                         <input
//                                                             value={addressRoadForInstall}
//                                                             onChange={(e) => {
//                                                                 setAddressRoadForInstall(e.target.value);
//                                                                 resetShowInstallAddress();
//                                                             }}
//                                                             type='text'
//                                                             className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                                         />
//                                                     </div>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>จังหวัด</label>
//                                                         <select
//                                                             className={`form-select ${styles.label}`}
//                                                             value={selectedProvinceForInstall}
//                                                             onChange={(e) => {
//                                                                 setSelectedProvinceForInstall(Number(e.target.value))
//                                                                 resetShowInstallAddress();
//                                                             }}
//                                                         >
//                                                             <option value=''>เลือกจังหวัด</option>
//                                                             {getProvinceForInstall.map((item: any) => (
//                                                                 <option key={item.PROVINCECODE} value={item.PROVINCECODE}>
//                                                                     {item.PROVINCENAME}
//                                                                 </option>
//                                                             ))}
//                                                         </select>
//                                                     </div>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>อำเภอ / เขต</label>
//                                                         <select
//                                                             className={`form-select ${styles.label}`}
//                                                             value={selectedDistrictForInstall}
//                                                             onChange={(e) => {
//                                                                 setSelectedDistrictForInstall(Number(e.target.value))
//                                                                 resetShowInstallAddress();
//                                                             }}
//                                                         >
//                                                             <option value=''>เลือกอำเภอ / เขต</option>
//                                                             {getDistrictForInstall.map((item: any) => (
//                                                                 <option key={item.DISTRICTCODE} value={item.DISTRICTCODE}>
//                                                                     {item.DISTRICTNAME}
//                                                                 </option>
//                                                             ))}
//                                                         </select>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="">
//                                                 <div className='row mb-6'>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>ตำบล / แขวง</label>
//                                                         <select
//                                                             className={`form-select ${styles.label}`}
//                                                             value={selectedSubDistrictForInstall}
//                                                             onChange={(e) => {
//                                                                 setSelectedSubDistrictForInstall(Number(e.target.value))
//                                                                 resetShowInstallAddress();
//                                                             }}
//                                                         >
//                                                             <option value=''>เลือกตำบล / แขวง</option>
//                                                             {getSubDistrictForInstall.map((item: any) => (
//                                                                 <option key={item.SUBDISTRICTCODE} value={item.SUBDISTRICTCODE}>
//                                                                     {item.SUBDISTRICTNAME}
//                                                                 </option>
//                                                             ))}
//                                                         </select>
//                                                     </div>

//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>รหัสไปรษณีย์</label>
//                                                         <input
//                                                             type='text'
//                                                             className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                                             value={selectedZipcodeForInstall}
//                                                             readOnly
//                                                             style={{
//                                                                 backgroundColor: '#d7dbde',
//                                                             }}
//                                                         />
//                                                     </div>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>เบอร์ที่ติดต่อได้</label>
//                                                         <input
//                                                             className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                                             value={addressPhoneForInstall}
//                                                             onChange={(e) => {
//                                                                 setAddressPhoneForInstall(e.target.value)
//                                                                 resetShowInstallAddress();
//                                                             }}
//                                                             type='text'
//                                                             inputMode='numeric'
//                                                             pattern='[0-9]*'
//                                                             maxLength={10}
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                         </div>
//                                     </form>
//                                     {/* end form */}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {/* End accordion ที่อยู่ลูกค้า (ตามบัตร) */}

//                     {/* Start accordion ที่อยู่ลูกค้า (เก็บเงิน)*/}
//                     <div className='accordion mb-10' id='kt_accordion_4'>

//                         <div className='accordion-item mb-10'>
//                             <h2 className='accordion-header' id='kt_accordion_4_header_4'>
//                                 <h3
//                                     className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
//                                     data-bs-toggle='collapse'
//                                     data-bs-target='#kt_accordion_4_body_4'
//                                     aria-expanded='true'
//                                     aria-controls='kt_accordion_4_body_4'
//                                     style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
//                                 >
//                                     ที่อยู่ลูกค้า (เก็บเงิน)
//                                 </h3>
//                             </h2>
//                             <div
//                                 id='kt_accordion_4_body_4'
//                                 className='accordion-collapse collapse hide'
//                                 aria-labelledby='kt_accordion_4_header_4'
//                                 data-bs-parent='#kt_accordion_4'
//                             >
//                                 <div className='accordion-body'>
//                                     {/* start form */}
//                                     <form noValidate className='form'>
//                                         <div className='card-body px-lg-9 px-1'>

//                                             <div className="">
//                                                 <div className='row mb-6'>
//                                                     <div className='col-lg-6 my-10 mt-xl-5'>
//                                                         <label className='form-check form-check-inline form-check-solid me-5'>
//                                                             <input
//                                                                 onChange={handleCheckboxChange}
//                                                                 className='form-check-input'
//                                                                 name='paymentLikeAddressCard'
//                                                                 type='checkbox'
//                                                                 checked={paymentLikeCardAddr}
//                                                             />
//                                                             <span className={`${styles.label} ps-2 mb-sm-5`}>ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง</span>
//                                                         </label>
//                                                         <label className='form-check form-check-inline form-check-solid me-5 mt-3 mt-sm-0'>
//                                                             <input
//                                                                 onChange={handleCheckboxChange}
//                                                                 className='form-check-input'
//                                                                 name='paymentLikeAddressInstall'
//                                                                 type='checkbox'
//                                                                 checked={paymentLikeInstallAddr}
//                                                             />
//                                                             <span className={`${styles.label} ps-2 mb-sm-5`}>ใช้ที่อยู่เดียวกับที่อยู่ตามบัตรฯ</span>
//                                                         </label>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="">
//                                                 <div className='row mb-6'>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>บ้านเลขที่</label>
//                                                         <input
//                                                             className={`form-control ${styles.label}`}
//                                                             value={addressNumberForPayment}
//                                                             onChange={(e) => {
//                                                                 setAddressNumberForPayment(e.target.value)
//                                                                 resetShowPaymentAddress();
//                                                             }}
//                                                             type='text'
//                                                         />
//                                                     </div>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>หมู่ที่</label>
//                                                         <input
//                                                             value={addressMooForPayment}
//                                                             onChange={(e) => {
//                                                                 setAddressMooForPayment(e.target.value)
//                                                                 resetShowPaymentAddress();
//                                                             }}
//                                                             type='text'
//                                                             className={`form-control ${styles.label}`}
//                                                         />
//                                                     </div>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>ตรอก / ซอย</label>
//                                                         <input
//                                                             value={addressSoiForPayment}
//                                                             onChange={(e) => {
//                                                                 setAddressSoiForPayment(e.target.value)
//                                                                 resetShowPaymentAddress();
//                                                             }}
//                                                             type='text'
//                                                             className={`form-control ${styles.label}`} />
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="">
//                                                 <div className='row mb-6'>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>ถนน</label>
//                                                         <input
//                                                             value={addressRoadForPayment}
//                                                             onChange={(e) => {
//                                                                 setAddressRoadForPayment(e.target.value)
//                                                                 resetShowPaymentAddress();
//                                                             }}
//                                                             type='text'
//                                                             className={`form-control ${styles.label}`}
//                                                         />
//                                                     </div>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>จังหวัด</label>
//                                                         <select
//                                                             className={`form-select ${styles.label}`}
//                                                             value={selectedProvinceForPayment}
//                                                             onChange={(e) => {
//                                                                 setSelectedProvinceForPayment(Number(e.target.value))
//                                                                 resetShowPaymentAddress();
//                                                             }}
//                                                         >
//                                                             <option value=''>เลือกจังหวัด</option>
//                                                             {getProvinceForPayment.map((item: any) => (
//                                                                 <option key={item.PROVINCECODE} value={item.PROVINCECODE}>
//                                                                     {item.PROVINCENAME}
//                                                                 </option>
//                                                             ))}
//                                                         </select>
//                                                     </div>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>อำเภอ / เขต</label>
//                                                         <select
//                                                             className={`form-select ${styles.label}`}
//                                                             value={selectedDistrictForPayment}
//                                                             onChange={(e) => {
//                                                                 setSelectedDistrictForPayment(Number(e.target.value))
//                                                                 resetShowPaymentAddress();
//                                                             }}
//                                                         >
//                                                             <option value=''>เลือกอำเภอ / เขต</option>
//                                                             {Array.isArray(getDistrictForPayment) && getDistrictForPayment.map((item: any) => (
//                                                                 <option key={item.DISTRICTCODE} value={item.DISTRICTCODE}>
//                                                                     {item.DISTRICTNAME}
//                                                                 </option>
//                                                             ))}
//                                                         </select>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="">
//                                                 <div className='row mb-6'>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>ตำบล / แขวง</label>
//                                                         <select
//                                                             className={`form-select ${styles.label}`}
//                                                             value={selectedSubDistrictForPayment}
//                                                             onChange={(e) => {
//                                                                 setSelectedSubDistrictForPayment(Number(e.target.value))
//                                                                 resetShowPaymentAddress();
//                                                             }}
//                                                         >
//                                                             <option value=''>เลือกตำบล / แขวง</option>
//                                                             {Array.isArray(getSubDistrictForPayment) && getSubDistrictForPayment.map((item: any) => (
//                                                                 <option key={item.SUBDISTRICTCODE} value={item.SUBDISTRICTCODE}>
//                                                                     {item.SUBDISTRICTNAME}
//                                                                 </option>
//                                                             ))}
//                                                         </select>
//                                                     </div>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label required ${styles.label}`}>รหัสไปรษณีย์</label>
//                                                         <input
//                                                             type='text'
//                                                             className={`form-control ${styles.label}`}
//                                                             value={selectedZipcodeForPayment}
//                                                             readOnly
//                                                             style={{
//                                                                 backgroundColor: '#d7dbde',
//                                                             }}
//                                                         />
//                                                     </div>
//                                                     <div className='col-lg-4 mb-3'>
//                                                         <label className={`form-label ${styles.label}`}>เบอร์ที่ติดต่อได้</label>
//                                                         <input
//                                                             className={`form-control ${styles.label}`}
//                                                             value={addressPhoneForPayment}
//                                                             onChange={(e) => {
//                                                                 setAddressPhoneForPayment(e.target.value)
//                                                                 resetShowPaymentAddress();
//                                                             }}
//                                                             type='text'
//                                                             maxLength={10}
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                         </div>
//                                     </form>
//                                     {/* end form */}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {/* End accordion ที่อยู่ลูกค้า (เก็บเงิน)*/}

//                     <div className=''>
//                         <div className='row'>
//                             <div className='col-12 mb-15'>
//                                 <label className='form-check form-check-inline form-check-solid'>
//                                     <input
//                                         className='form-check-input'
//                                         name='showTaxAddress'
//                                         type='checkbox'
//                                         checked={showTaxAddress}
//                                         onChange={(e) => setShowTaxAddress(e.target.checked)}
//                                     />
//                                     <span className={`${styles.label} ps-2 mb-sm-20`}>
//                                         ต้องการใบกำกับภาษี
//                                     </span>
//                                 </label>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Start accordion ที่อยู่ลูกค้า (ใบกำกับภาษี)*/}
//                     {showTaxAddress && (
//                         <>
//                             <div className='accordion mb-10' id='kt_accordion_5'>
//                                 <div className='accordion-item mb-10'>
//                                     <h2 className='accordion-header' id='kt_accordion_5_header_5'>
//                                         <h3
//                                             className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
//                                             data-bs-toggle='collapse'
//                                             data-bs-target='#kt_accordion_5_body_5'
//                                             aria-expanded='true'
//                                             aria-controls='kt_accordion_5_body_5'
//                                             style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
//                                         >
//                                             ที่อยู่ลูกค้า (ออกใบกำกับภาษี)
//                                         </h3>
//                                     </h2>
//                                     <div
//                                         id='kt_accordion_5_body_5'
//                                         className='accordion-collapse collapse show'
//                                         aria-labelledby='kt_accordion_5_header_5'
//                                         data-bs-parent='#kt_accordion_5'
//                                     >
//                                         <div className='accordion-body'>
//                                             {/* start form */}
//                                             <form noValidate className='form'>
//                                                 <div className='card-body px-lg-9 px-1'>

//                                                     <div className="">
//                                                         <div className='row mb-6'>
//                                                             <div className='col-lg-4 mb-3'>
//                                                                 <label className={`form-label ${styles.label}`}>บ้านเลขที่</label>
//                                                                 <input
//                                                                     value={addressNumberForBilling}
//                                                                     onChange={(e) => {
//                                                                         setAddressNumberForBilling(e.target.value)
//                                                                         resetShowBillingAddress()
//                                                                     }}
//                                                                     type='text'
//                                                                     className={`form-control ${styles.label}`}
//                                                                 />
//                                                             </div>
//                                                             <div className='col-lg-4 mb-3'>
//                                                                 <label className={`form-label ${styles.label}`}>หมู่ที่</label>
//                                                                 <input
//                                                                     value={addressMooForBilling}
//                                                                     onChange={(e) => {
//                                                                         setAddressMooForBilling(e.target.value)
//                                                                         resetShowBillingAddress()
//                                                                     }}
//                                                                     type='text'
//                                                                     className={`form-control ${styles.label}`}
//                                                                 />
//                                                             </div>
//                                                             <div className='col-lg-4 mb-3'>
//                                                                 <label className={`form-label ${styles.label}`}>ตรอก / ซอย</label>
//                                                                 <input
//                                                                     value={addressSoiForBilling}
//                                                                     onChange={(e) => {
//                                                                         setAddressSoiForBilling(e.target.value)
//                                                                         resetShowBillingAddress()
//                                                                     }}
//                                                                     type='text'
//                                                                     className={`form-control ${styles.label}`}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                     <div className="">
//                                                         <div className='row mb-6'>
//                                                             <div className='col-lg-4 mb-3'>
//                                                                 <label className={`form-label ${styles.label}`}>ถนน</label>
//                                                                 <input
//                                                                     value={addressRoadForBilling}
//                                                                     onChange={(e) => {
//                                                                         setAddressRoadForBilling(e.target.value)
//                                                                         resetShowBillingAddress()
//                                                                     }}
//                                                                     type='text'
//                                                                     className={`form-control ${styles.label}`}
//                                                                 />
//                                                             </div>

//                                                             {/* จังหวัด */}
//                                                             <div className='col-lg-4 mb-3'>
//                                                                 <label className={`form-label ${styles.label}`}>จังหวัด</label>
//                                                                 <select
//                                                                     className={`form-select ${styles.label}`}
//                                                                     value={
//                                                                         billLikeCardAddr ? selectedProvince :
//                                                                             billLikeInstallAddr ? selectedProvinceForInstall :
//                                                                                 billLikePaymentAddr ? selectedProvinceForPayment :
//                                                                                     selectedProvinceForBilling
//                                                                     }
//                                                                     onChange={(e) => {
//                                                                         const selectedValue = Number(e.target.value);
//                                                                         if (billLikeCardAddr) {
//                                                                             setSelectedProvince(selectedValue);
//                                                                         } else if (billLikeInstallAddr) {
//                                                                             setSelectedProvinceForInstall(selectedValue);
//                                                                         } else if (billLikePaymentAddr) {
//                                                                             setSelectedProvinceForPayment(selectedValue);
//                                                                         } else {
//                                                                             setSelectedProvinceForBilling(selectedValue);
//                                                                         }
//                                                                         resetShowBillingAddress()
//                                                                     }}
//                                                                 >
//                                                                     <option value=''>เลือกจังหวัด</option>
//                                                                     {(billLikeCardAddr ? getProvince :
//                                                                         billLikeInstallAddr ? getProvinceForInstall :
//                                                                             billLikePaymentAddr ? getProvinceForPayment :
//                                                                                 getProvinceForBilling).map((item) => (
//                                                                                     <option key={item.PROVINCECODE} value={item.PROVINCECODE}>
//                                                                                         {item.PROVINCENAME}
//                                                                                     </option>
//                                                                                 ))}
//                                                                 </select>
//                                                             </div>

//                                                             {/* อำเภอ / เขต */}
//                                                             <div className='col-lg-4 mb-3'>
//                                                                 <label className={`form-label ${styles.label}`}>อำเภอ / เขต</label>
//                                                                 <select
//                                                                     className={`form-select ${styles.label}`}
//                                                                     value={
//                                                                         billLikeCardAddr ? selectedDistrict :
//                                                                             billLikeInstallAddr ? selectedDistrictForInstall :
//                                                                                 billLikePaymentAddr ? selectedDistrictForPayment :
//                                                                                     selectedDistrictForBilling
//                                                                     }
//                                                                     onChange={(e) => {
//                                                                         const selectedValue = Number(e.target.value);
//                                                                         if (billLikeCardAddr) {
//                                                                             setSelectedDistrict(selectedValue);
//                                                                         } else if (billLikeInstallAddr) {
//                                                                             setSelectedDistrictForInstall(selectedValue);
//                                                                         } else if (billLikePaymentAddr) {
//                                                                             setSelectedDistrictForPayment(selectedValue);
//                                                                         } else {
//                                                                             setSelectedDistrictForBilling(selectedValue);
//                                                                         }
//                                                                         resetShowBillingAddress()
//                                                                     }}
//                                                                 >
//                                                                     <option value=''>เลือกอำเภอ / เขต</option>
//                                                                     {(billLikeCardAddr ? getDistrict :
//                                                                         billLikeInstallAddr ? getDistrictForInstall :
//                                                                             billLikePaymentAddr ? getDistrictForPayment :
//                                                                                 getDistrictForBilling).map((item) => (
//                                                                                     <option key={item.DISTRICTCODE} value={item.DISTRICTCODE}>
//                                                                                         {item.DISTRICTNAME}
//                                                                                     </option>
//                                                                                 ))}
//                                                                 </select>
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                     <div className="">
//                                                         <div className='row mb-6'>
//                                                             {/* ตำบล / แขวง */}
//                                                             <div className='col-lg-4 mb-3'>
//                                                                 <label className={`form-label ${styles.label}`}>ตำบล / แขวง</label>
//                                                                 <select
//                                                                     className={`form-select ${styles.label}`}
//                                                                     value={
//                                                                         billLikeCardAddr ? selectedSubDistrict :
//                                                                             billLikeInstallAddr ? selectedSubDistrictForInstall :
//                                                                                 billLikePaymentAddr ? selectedSubDistrictForPayment :
//                                                                                     selectedSubDistrictForBilling
//                                                                     }
//                                                                     onChange={(e) => {
//                                                                         const selectedValue = Number(e.target.value);
//                                                                         if (billLikeCardAddr) {
//                                                                             setSelectedSubDistrict(selectedValue);
//                                                                         } else if (billLikeInstallAddr) {
//                                                                             setSelectedSubDistrictForInstall(selectedValue);
//                                                                         } else if (billLikePaymentAddr) {
//                                                                             setSelectedSubDistrictForPayment(selectedValue);
//                                                                         } else {
//                                                                             setSelectedSubDistrictForBilling(selectedValue);
//                                                                         }
//                                                                         resetShowBillingAddress()
//                                                                     }}
//                                                                 >
//                                                                     <option value=''>เลือกตำบล / แขวง</option>
//                                                                     {(billLikeCardAddr ? getSubDistrict :
//                                                                         billLikeInstallAddr ? getSubDistrictForInstall :
//                                                                             billLikePaymentAddr ? getSubDistrictForPayment :
//                                                                                 getSubDistrictForBilling).map((item) => (
//                                                                                     <option key={item.SUBDISTRICTCODE} value={item.SUBDISTRICTCODE}>
//                                                                                         {item.SUBDISTRICTNAME}
//                                                                                     </option>
//                                                                                 ))}
//                                                                 </select>
//                                                             </div>

//                                                             {/* รหัสไปรษณีย์ */}
//                                                             <div className='col-lg-4 mb-3'>
//                                                                 <label className={`form-label ${styles.label}`}>รหัสไปรษณีย์</label>
//                                                                 <input
//                                                                     type='text'
//                                                                     className={`form-control ${styles.label}`}
//                                                                     value={
//                                                                         billLikeCardAddr ? selectedZipcode :
//                                                                             billLikeInstallAddr ? selectedZipcodeForInstall :
//                                                                                 billLikePaymentAddr ? selectedZipcodeForPayment :
//                                                                                     selectedZipcodeForBilling
//                                                                     }
//                                                                     readOnly
//                                                                     style={{
//                                                                         backgroundColor: '#d7dbde',
//                                                                     }}
//                                                                 />
//                                                             </div>

//                                                             <div className='col-lg-4 mb-3'>
//                                                                 <label className={`form-label ${styles.label}`}>เบอร์ที่ติดต่อได้</label>
//                                                                 <input
//                                                                     value={addressPhoneForBilling}
//                                                                     onChange={(e) => {
//                                                                         setAddressPhoneForBilling(e.target.value)
//                                                                         resetShowBillingAddress()
//                                                                     }}
//                                                                     type='text'
//                                                                     className={`form-control ${styles.label}`}
//                                                                     maxLength={10}
//                                                                 />
//                                                             </div>

//                                                         </div>
//                                                     </div>

//                                                     <div className="">
//                                                         <div className='row mb-6'>
//                                                             <div className='col-lg-6 mb-3 mt-xl-5'>
//                                                                 <label className='form-check form-check-inline form-check-solid me-5'>
//                                                                     <input
//                                                                         onChange={handleCheckboxChange}
//                                                                         className='form-check-input'
//                                                                         name='billLikeAddressCard'
//                                                                         type='checkbox'
//                                                                         checked={billLikeCardAddr}
//                                                                     />
//                                                                     <span className={`${styles.label} ps-2 mb-sm-5`}>ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง</span>
//                                                                 </label>
//                                                                 <label className='form-check form-check-inline form-check-solid me-5 mt-3 mt-sm-0'>
//                                                                     <input
//                                                                         onChange={handleCheckboxChange}
//                                                                         className='form-check-input'
//                                                                         name='billLikeAddressInstall'
//                                                                         type='checkbox'
//                                                                         checked={billLikeInstallAddr}
//                                                                     />
//                                                                     <span className={`${styles.label} ps-2 mb-sm-5`}>ใช้ที่อยู่เดียวกับที่อยู่ตามบัตรฯ</span>
//                                                                 </label>
//                                                                 <label className='form-check form-check-inline form-check-solid me-5 mt-3 mt-sm-0'>
//                                                                     <input
//                                                                         onChange={handleCheckboxChange}
//                                                                         className='form-check-input'
//                                                                         name='billLikeAddressPayment'
//                                                                         type='checkbox'
//                                                                         checked={billLikePaymentAddr}
//                                                                     />
//                                                                     <span className={`${styles.label} ps-2 mb-sm-5`}>ใช้ที่อยู่เดียวกับที่อยู่เก็บเงิน</span>
//                                                                 </label>
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                 </div>

//                                             </form>
//                                             {/* end form */}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </>
//                     )}

//                     <div className='d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10'>
//                         <button
//                             onClick={() => navigate('/sale/update/updateCustDetail', {
//                                 state: {
//                                     ...matchedItem,
//                                 }
//                             })}
//                             className={`${styles.btnSecondary}`}
//                             type='button'
//                         >
//                             แก้ไขข้อมูลลูกค้า
//                         </button>
//                         <button
//                             onClick={handleSubmit(onSubmit)}
//                             className={`${styles.btnPrimary}`}
//                             type='button'
//                         >
//                             ถัดไป
//                         </button>
//                     </div>

//                     {/* ปุ่มในหน้าจอเล็ก */}
//                     <div
//                         className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
//                         style={{
//                             position: "fixed",
//                             bottom: 0,
//                             left: 0,
//                             right: 0,
//                             zIndex: 1050,
//                         }}
//                     >
//                         <button
//                             className={`${styles.btnSecondary}`}
//                             onClick={() => navigate('/sale/update/updateCustDetail', {
//                                 state: {
//                                     ...matchedItem,
//                                 }
//                             })}
//                             type='button'
//                         >
//                             แก้ไขข้อมูลลูกค้า
//                         </button>
//                         <button
//                             className={`${styles.btnPrimary}`}
//                             onClick={handleSubmit(onSubmit)}
//                             type='button'
//                         >
//                             ถัดไป
//                         </button>
//                     </div>

//                 </form>
//                 {/* End accordion ที่อยู่ลูกค้า (ใบกำกับภาษี)*/}
//             </Content >
//         </>
//     )
// }

// export default SalesCreateAddress

// import styles from "@/styles/style.module.css";
// import IDCardOCR from "./components/ocr/IDCardOCR";

// import { useState, ChangeEvent, useEffect, useMemo, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import clsx from "clsx";
// import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers";
// import { Content } from "../../../_metronic/layout/components/content";
// import { useAuth } from "../../modules/auth/core/Auth";

// import {
//   useUUIDStore,
//   useSaveCustomerStore,
//   useSaveAddressStore,
// } from "../../modules/stores/stepsStore";

// import dayjs, { Dayjs } from "dayjs";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";

// import { useForm, Controller } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { ThreeDot } from "react-loading-indicators";

// const SalesCreateAddress: React.FC = () => {
//   const navigate = useNavigate();
//   const MySwal = withReactContent(Swal);

//   const { REFNO } = useUUIDStore();
//   const { auth } = useAuth();
//   const EmpId = auth?.data?.[0]?.EmpId || "";
//   const TeamSale = auth?.data?.[0]?.TeamSale || "";
//   const SaleCode = auth?.data?.[0]?.SaleCode || "";
//   const SupEmpId = auth?.data?.[0]?.SupEmp || "";
//   const SecEmpId = auth?.data?.[0]?.SecEmp || "";

//   const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//   const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;
//   const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

//   const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
//   const CUSTOMER_TYPE_URL = `${API_SALECONNEXT}/GetCustomertype`;
//   const PROVINCE_URL = `${API_SALECONNEXT}/GetAddress/Province`;
//   const DISTRICT_URL = `${API_SALECONNEXT}/GetAddress/District`;
//   const SUBDISTRICT_URL = `${API_SALECONNEXT}/GetAddress/SubDistrict`;
//   const ZIPCODE_URL = `${API_SALECONNEXT}/GetAddress/Zipcode`;

//   const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false);
//   const [draft, setDraft] = useState<any[]>([]);
//   // console.log(`draft`, draft);

//   useEffect(() => {
//     const getDataDraft = async () => {
//       setIsLoadingDraft(true);
//       try {
//         const response = await axios.get(DRAFT_ALLCONTRACT_URL);
//         const data = Array.isArray(response.data.data)
//           ? response.data.data
//           : [];
//         setDraft(data);
//       } catch (error) {
//         console.error("Error fetching DRAFT_ALLCONTRACT_URL:", error);
//       } finally {
//         setIsLoadingDraft(false);
//       }
//     };
//     getDataDraft();
//   }, []);

//   // เลือก item ที่ REFNO ตรงกัน (find สำหรับ 1 item หรือ filter สำหรับหลาย item)
//   const matchedItem = draft.find((item) => item.REFNO === REFNO);
//   console.log(`matchedItem`, matchedItem);

//   // ที่อยู่ลูกค้า ตามบัตร
//   const [getProvince, setGetProvince] = useState<any[]>([]);
//   const [getDistrict, setGetDistrict] = useState<any[]>([]);
//   const [getSubDistrict, setGetSubDistrict] = useState<any[]>([]);
//   const [getZipcode, setGetZipcode] = useState<any[]>([]);

//   // สร้าง state สำหรับ "ที่อยู่ลูกค้า (ตามบัตร)
//   const [addressNumber, setAddressNumber] = useState<string>("");
//   const [addressMoo, setAddressMoo] = useState<string>("");
//   const [addressSoi, setAddressSoi] = useState<string>("");
//   const [addressRoad, setAddressRoad] = useState<string>("");
//   const [selectedProvince, setSelectedProvince] = useState<number>();
//   // console.log(`selectedProvince`, selectedProvince);

//   const [selectedDistrict, setSelectedDistrict] = useState<number>();
//   const [selectedSubDistrict, setSelectedSubDistrict] = useState<number>();
//   const [selectedZipcode, setSelectedZipcode] = useState<string>("");
//   const [addressPhone, setAddressPhone] = useState<string>("");
//   const [useThisTax, setUseThisTax] = useState<string>("FALSE");

//   // ที่อยู่ลูกค้า ติดตั้ง
//   const [getProvinceForInstall, setGetProvinceForInstall] = useState<any[]>([]);
//   const [getDistrictForInstall, setGetDistrictForInstall] = useState<any[]>([]);
//   const [getSubDistrictForInstall, setGetSubDistrictForInstall] = useState<
//     any[]
//   >([]);
//   const [getZipcodeForInstall, setGetZipcodeForInstall] = useState<any[]>([]);

//   // สร้าง state สำหรับ "ที่อยู่ลูกค้า (ติดตั้ง)
//   const [addressNumberForInstall, setAddressNumberForInstall] =
//     useState<string>("");
//   // console.log(`addressNumberForInstall`, addressNumberForInstall);
//   const [addressMooForInstall, setAddressMooForInstall] = useState<string>("");
//   const [addressSoiForInstall, setAddressSoiForInstall] = useState<string>("");
//   const [addressRoadForInstall, setAddressRoadForInstall] =
//     useState<string>("");
//   const [selectedProvinceForInstall, setSelectedProvinceForInstall] = useState<
//     number | undefined
//   >();
//   const [selectedDistrictForInstall, setSelectedDistrictForInstall] = useState<
//     number | undefined
//   >();
//   const [selectedSubDistrictForInstall, setSelectedSubDistrictForInstall] =
//     useState<number | undefined>();
//   const [selectedZipcodeForInstall, setSelectedZipcodeForInstall] =
//     useState<string>("");
//   const [addressPhoneForInstall, setAddressPhoneForInstall] =
//     useState<string>("");

//   // ที่อยู่ลูกค้า เก็บเงิน
//   const [getProvinceForPayment, setGetProvinceForPayment] = useState<any[]>([]);
//   const [getDistrictForPayment, setGetDistrictForPayment] = useState<any[]>([]);
//   const [getSubDistrictForPayment, setGetSubDistrictForPayment] = useState<
//     any[]
//   >([]);
//   const [getZipcodeForPayment, setGetZipcodeForPayment] = useState<any[]>([]);

//   // สร้าง state สำหรับ "ที่อยู่ลูกค้า (เก็บเงิน)
//   const [addressNumberForPayment, setAddressNumberForPayment] =
//     useState<string>("");
//   // console.log(`addressNumberForPayment`, addressNumberForPayment);

//   const [addressMooForPayment, setAddressMooForPayment] = useState<string>("");
//   const [addressSoiForPayment, setAddressSoiForPayment] = useState<string>("");
//   const [addressRoadForPayment, setAddressRoadForPayment] =
//     useState<string>("");
//   const [selectedProvinceForPayment, setSelectedProvinceForPayment] = useState<
//     number | undefined
//   >();
//   const [selectedDistrictForPayment, setSelectedDistrictForPayment] = useState<
//     number | undefined
//   >();
//   const [selectedSubDistrictForPayment, setSelectedSubDistrictForPayment] =
//     useState<number | undefined>();
//   const [selectedZipcodeForPayment, setSelectedZipcodeForPayment] =
//     useState<string>("");
//   const [addressPhoneForPayment, setAddressPhoneForPayment] =
//     useState<string>("");

//   // สร้าง state สำหรับ "ที่อยู่ลูกค้า (ออกใบกำกับภาษี)
//   const [showTaxAddress, setShowTaxAddress] = useState<boolean>(false);

//   const [getProvinceForBilling, setGetProvinceForBilling] = useState<any[]>([]);
//   const [getDistrictForBilling, setGetDistrictForBilling] = useState<any[]>([]);
//   const [getSubDistrictForBilling, setGetSubDistrictForBilling] = useState<
//     any[]
//   >([]);
//   const [getZipcodeForBilling, setGetZipcodeForBilling] = useState<any[]>([]);

//   const [addressNumberForBilling, setAddressNumberForBilling] =
//     useState<string>("");
//   const [addressMooForBilling, setAddressMooForBilling] = useState<string>("");
//   const [addressSoiForBilling, setAddressSoiForBilling] = useState<string>("");
//   const [addressRoadForBilling, setAddressRoadForBilling] =
//     useState<string>("");
//   const [selectedProvinceForBilling, setSelectedProvinceForBilling] = useState<
//     number | undefined
//   >();
//   const [selectedDistrictForBilling, setSelectedDistrictForBilling] = useState<
//     number | undefined
//   >();
//   const [selectedSubDistrictForBilling, setSelectedSubDistrictForBilling] =
//     useState<number | undefined>();
//   const [selectedZipcodeForBilling, setSelectedZipcodeForBilling] =
//     useState<string>("");
//   const [addressPhoneForBilling, setAddressPhoneForBilling] =
//     useState<string>("");

//   // [ที่อยู่ลูกค้า (ตามบัตร)]
//   const [likeAllAddr, setLikeAllAddr] = useState(false);

//   // [ที่อยู่ลูกค้า (ติดตั้ง)]
//   const [installLikeCardAddr, setInstallLikeCardAddr] = useState(false);

//   // [ที่อยู่ลูกค้า (เก็บเงิน)]
//   const [paymentLikeCardAddr, setPaymentLikeCardAddr] = useState(false);
//   const [paymentLikeInstallAddr, setPaymentLikeInstallAddr] = useState(false);

//   // [ที่อยู่ลูกค้า (ออกใบกำกับ)]
//   const [billLikeCardAddr, setBillLikeCardAddr] = useState(false);
//   const [billLikeInstallAddr, setBillLikeInstallAddr] = useState(false);
//   const [billLikePaymentAddr, setBillLikePaymentAddr] = useState(false);

//   const [showCustomerAddress, setShowCustomerAddress] = useState(false);
//   const [showInstallAddress, setShowInstallAddress] = useState(false);
//   const [showPaymentAddress, setShowPaymentAddress] = useState(false);

//   const [loadingProvince, setLoadingProvince] = useState(false);
//   const [loadingDistrict, setLoadingDistrict] = useState(false);
//   const [loadingSubDistrict, setLoadingSubDistrict] = useState(false);

//   // 1) useEffect สำหรับ preload ที่อยู่ติดตั้ง
//   useEffect(() => {
//     if (!matchedItem?.CUSTOMERSTATUS?.[0]?.Contract) return;
//     const contract = matchedItem.CUSTOMERSTATUS[0].Contract;
//     const installAddr = Array.isArray(contract.Address)
//       ? contract.Address.find(
//         (a: any) => a.AddressTypeCode === "AddressInstall"
//       )
//       : undefined;
//     if (!installAddr) return;

//     // สมมติ AddressDetail1 เก็บ "บ้านเลขที่ ซ.หมู่ฯ ถ.ฯ …"
//     // จะเอาทั้งหมดไปช่อง บ้านเลขที่ ก่อน ถ้าอยากแยกให้ละเอียดอีกรอบก็ parse ต่อ
//     setAddressNumber(installAddr.AddressDetail);
//     setAddressMoo(installAddr.AddressDetail2);
//     setAddressSoi(installAddr.AddressDetail3);
//     setAddressRoad(installAddr.AddressDetail4);

//     // เบอร์โทร (ถ้ามี TelMobile ใช้ ถ้าไม่มีก็กด TelHome)
//     const rawPhone = installAddr.TelMobile || installAddr.TelHome || "";
//     // setAddressPhone(rawPhone.replace(/-/g, ""));

//     // province / district / subdistrict / zipcode
//     // ต้องแม็ปกับ list ที่คุณโหลดมา (getProvince, getDistrict, getSubDistrict)
//     const prov = getProvince.find(
//       (p) => p.PROVINCENAME === installAddr.Province
//     );
//     if (prov) setSelectedProvince(Number(prov.PROVINCECODE));

//     // หลังจาก setSelectedProvince แล้ว useEffect อื่นจะไป fetch district มาให้
//     // เมื่อ getDistrict มาแล้ว ก็แม็ปชื่อกลับไป

//     setValue("homeNoIdCard", installAddr.AddressDetail || "");
//     setValue("provinceIdCard", selectedProvince?.toString() || "");
//     setValue("districtIdCard", selectedDistrict?.toString() || "");
//     setValue("subDistrictIdCard", selectedSubDistrict?.toString() || "");
//     setValue("telNoIdCard", rawPhone);
//   }, [matchedItem, getProvince]);

//   // 2) useEffect รอ district list (getDistrict) แล้วแม็ปชื่อ
//   useEffect(() => {
//     if (!matchedItem?.CUSTOMERSTATUS?.[0]?.Contract || !selectedProvince)
//       return;
//     const contract = matchedItem.CUSTOMERSTATUS[0].Contract;
//     const installAddr = contract.Address.find(
//       (a: any) => a.AddressTypeCode === "AddressInstall"
//     );
//     if (!installAddr) return;
//     const dist = getDistrict.find(
//       (d) => d.DISTRICTNAME === installAddr.District
//     );
//     if (dist) setSelectedDistrict(Number(dist.DISTRICTCODE));
//   }, [getDistrict, matchedItem, selectedProvince]);

//   // 3) useEffect รอ subdistrict list (getSubDistrict) แล้วแม็ปชื่อ
//   useEffect(() => {
//     if (!matchedItem?.CUSTOMERSTATUS?.[0]?.Contract || !selectedDistrict)
//       return;
//     const contract = matchedItem.CUSTOMERSTATUS[0].Contract;
//     const installAddr = contract.Address.find(
//       (a: any) => a.AddressTypeCode === "AddressInstall"
//     );
//     if (!installAddr) return;
//     const sub = getSubDistrict.find(
//       (s) => s.SUBDISTRICTNAME === installAddr.SubDistrict
//     );
//     if (sub) {
//       setSelectedSubDistrict(Number(sub.SUBDISTRICTCODE));
//       setSelectedZipcode(installAddr.Zipcode); // zip มักมาแล้ว
//     }
//   }, [getSubDistrict, matchedItem, selectedDistrict]);

//   ////////////////////// ที่อยู่ตามบัตร

//   // 1) useEffect สำหรับ preload ที่อยู่ตามบัตร
//   useEffect(() => {
//     if (!matchedItem?.CUSTOMERSTATUS?.[0]?.Contract) return;
//     const contract = matchedItem.CUSTOMERSTATUS[0].Contract;
//     // หา AddressIDCard (index 0)
//     const cardAddr = Array.isArray(contract.Address)
//       ? contract.Address.find((a: any) => a.AddressTypeCode === "AddressIDCard")
//       : undefined;
//     if (!cardAddr) return;

//     // เติมข้อมูลช่อง input
//     setAddressNumberForInstall(cardAddr.AddressDetail || "");
//     setAddressMooForInstall(cardAddr.AddressDetail2 || "");
//     setAddressSoiForInstall(cardAddr.AddressDetail3 || "");
//     setAddressRoadForInstall(cardAddr.AddressDetail4 || "");

//     // เบอร์โทร
//     const rawPhone = cardAddr.TelMobile || cardAddr.TelHome || "";
//     // setAddressPhoneForInstall(rawPhone.replace(/-/g, ""));

//     // จากตรงนี้จะรอ useEffect ข้างล่างแม็ปจังหวัด → อำเภอ → ตำบล ให้อัตโนมัติ
//   }, [matchedItem]);

//   // 2) useEffect รอ district list (getDistrict) แล้วแม็ปชื่อ
//   useEffect(() => {
//     if (!matchedItem?.CUSTOMERSTATUS?.[0]?.Contract || !selectedProvince)
//       return;
//     const contract = matchedItem.CUSTOMERSTATUS[0].Contract;
//     const cardAddr = contract.Address.find(
//       (a: any) => a.AddressTypeCode === "AddressIDCard"
//     );
//     if (!cardAddr) return;
//     const dist = getDistrictForInstall.find(
//       (d) => d.DISTRICTNAME === cardAddr.District
//     );
//     if (dist) setSelectedDistrictForInstall(Number(dist.DISTRICTCODE));
//   }, [getDistrictForInstall, matchedItem, selectedProvinceForInstall]);

//   // 3) useEffect รอ subdistrict list (getSubDistrict) แล้วแม็ปชื่อ
//   useEffect(() => {
//     if (!matchedItem?.CUSTOMERSTATUS?.[0]?.Contract || !selectedDistrict)
//       return;
//     const contract = matchedItem.CUSTOMERSTATUS[0].Contract;
//     const cardAddr = contract.Address.find(
//       (a: any) => a.AddressTypeCode === "AddressIDCard"
//     );
//     if (!cardAddr) return;
//     const sub = getSubDistrictForInstall.find(
//       (s) => s.SUBDISTRICTNAME === cardAddr.SubDistrict
//     );
//     if (sub) {
//       setSelectedSubDistrictForInstall(Number(sub.SUBDISTRICTCODE));
//       setSelectedZipcodeForInstall(cardAddr.Zipcode); // zip มักมาแล้ว
//     }
//   }, [getSubDistrictForInstall, matchedItem, selectedDistrictForInstall]);

//   /////////////////////////////////

//   // GET Province
//   useEffect(() => {
//     const getData = async () => {
//       try {
//         setLoadingProvince(true);
//         const response = await axios.get(PROVINCE_URL, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         setGetProvince(response.data);
//       } catch (error) {
//         console.error("Error fetching CUSTOMER_TYPE_URL:", error);
//       } finally {
//         setLoadingProvince(false);
//       }
//     };
//     getData();
//   }, []);

//   // GET Province For Install
//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const response = await axios.get(PROVINCE_URL, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         setGetProvinceForInstall(response.data);
//       } catch (error) {
//         console.error("Error fetching CUSTOMER_TYPE_URL:", error);
//       }
//     };
//     getData();
//   }, []);

//   // GET Province For Payment
//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const response = await axios.get(PROVINCE_URL, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         setGetProvinceForPayment(response.data);
//       } catch (error) {
//         console.error("Error fetching CUSTOMER_TYPE_URL:", error);
//       }
//     };
//     getData();
//   }, []);

//   // GET Province For Billing tax
//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const response = await axios.get(PROVINCE_URL, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         setGetProvinceForBilling(response.data);
//       } catch (error) {
//         console.error("Error fetching CUSTOMER_TYPE_URL:", error);
//       }
//     };
//     getData();
//   }, []);

//   // POST District
//   useEffect(() => {
//     const getData = async () => {
//       if (selectedProvince) {
//         // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
//         try {
//           setLoadingDistrict(true);
//           const response = await axios.post(
//             DISTRICT_URL,
//             { ProvinceCode: selectedProvince },
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//           setGetDistrict(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
//         } catch (error) {
//           console.error("Error fetching DISTRICT_URL:", error);
//         } finally {
//           setLoadingDistrict(false);
//         }
//       } else {
//         setGetDistrict([]); // ล้างข้อมูล district เมื่อไม่ได้เลือก province
//       }
//     };
//     getData();
//   }, [selectedProvince]);

//   // POST District For Install
//   useEffect(() => {
//     const getData = async () => {
//       if (selectedProvinceForInstall) {
//         // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
//         try {
//           const response = await axios.post(
//             DISTRICT_URL,
//             { ProvinceCode: selectedProvinceForInstall },
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//           setGetDistrictForInstall(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
//         } catch (error) {
//           console.error("Error fetching DISTRICT_URL:", error);
//         }
//       } else {
//         setGetDistrictForInstall([]); // ล้างข้อมูล district เมื่อไม่ได้เลือก province
//       }
//     };
//     getData();
//   }, [selectedProvinceForInstall]);

//   // POST District For Payment
//   useEffect(() => {
//     const getData = async () => {
//       if (selectedProvinceForPayment) {
//         // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
//         try {
//           const response = await axios.post(
//             DISTRICT_URL,
//             { ProvinceCode: selectedProvinceForPayment },
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//           setGetDistrictForPayment(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
//         } catch (error) {
//           console.error("Error fetching DISTRICT_URL:", error);
//         }
//       } else {
//         setGetDistrictForPayment([]); // ล้างข้อมูล district เมื่อไม่ได้เลือก province
//       }
//     };
//     getData();
//   }, [selectedProvinceForPayment]);

//   // POST District For Billing tax
//   useEffect(() => {
//     const getData = async () => {
//       if (selectedProvinceForBilling) {
//         // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
//         try {
//           const response = await axios.post(
//             DISTRICT_URL,
//             { ProvinceCode: selectedProvinceForBilling },
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//           setGetDistrictForBilling(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
//         } catch (error) {
//           console.error("Error fetching DISTRICT_URL:", error);
//         }
//       } else {
//         setGetDistrictForBilling([]); // ล้างข้อมูล district เมื่อไม่ได้เลือก province
//       }
//     };
//     getData();
//   }, [selectedProvinceForBilling]);

//   // POST SubDistrict
//   useEffect(() => {
//     const fetchSubDistricts = async () => {
//       if (selectedDistrict) {
//         try {
//           setLoadingSubDistrict(true);
//           const response = await axios.post(
//             SUBDISTRICT_URL,
//             { DistrictCode: selectedDistrict },
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//           setGetSubDistrict(response.data);
//         } catch (error) {
//           console.error("Error fetching SUBDISTRICT_URL:", error);
//         } finally {
//           setLoadingSubDistrict(false);
//         }
//       } else {
//         setGetSubDistrict([]);
//       }
//     };
//     fetchSubDistricts();
//   }, [selectedDistrict]);

//   // POST SubDistrict For Install
//   useEffect(() => {
//     const fetchSubDistricts = async () => {
//       if (selectedDistrictForInstall) {
//         try {
//           const response = await axios.post(
//             SUBDISTRICT_URL,
//             { DistrictCode: selectedDistrictForInstall },
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//           setGetSubDistrictForInstall(response.data);
//         } catch (error) {
//           console.error("Error fetching SUBDISTRICT_URL:", error);
//         }
//       } else {
//         setGetSubDistrictForInstall([]);
//       }
//     };
//     fetchSubDistricts();
//   }, [selectedDistrictForInstall]);

//   // POST SubDistrict For Payment
//   useEffect(() => {
//     const fetchSubDistricts = async () => {
//       if (selectedDistrictForPayment) {
//         try {
//           const response = await axios.post(
//             SUBDISTRICT_URL,
//             { DistrictCode: selectedDistrictForPayment },
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//           setGetSubDistrictForPayment(response.data);
//         } catch (error) {
//           console.error("Error fetching SUBDISTRICT_URL:", error);
//         }
//       } else {
//         setGetSubDistrictForPayment([]);
//       }
//     };
//     fetchSubDistricts();
//   }, [selectedDistrictForPayment]);

//   // POST SubDistrict For Billing tax
//   useEffect(() => {
//     const fetchSubDistricts = async () => {
//       if (selectedDistrictForBilling) {
//         try {
//           const response = await axios.post(
//             SUBDISTRICT_URL,
//             { DistrictCode: selectedDistrictForBilling },
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//           setGetSubDistrictForBilling(response.data);
//         } catch (error) {
//           console.error("Error fetching SUBDISTRICT_URL:", error);
//         }
//       } else {
//         setGetSubDistrictForBilling([]);
//       }
//     };
//     fetchSubDistricts();
//   }, [selectedDistrictForBilling]);

//   // POST Zipcode
//   useEffect(() => {
//     const getZipcode = async () => {
//       if (selectedSubDistrict) {
//         try {
//           const response = await axios.post(
//             ZIPCODE_URL,
//             { SubDistrictCode: selectedSubDistrict },
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//           if (response.data.length > 0) {
//             setSelectedZipcode(response.data[0].POSTCODE); // อัปเดตรหัสไปรษณีย์ใน state
//           }
//         } catch (error) {
//           console.error("Error fetching ZIPCODE_URL:", error);
//         }
//       } else {
//         setSelectedZipcode(""); // เคลียร์ข้อมูลรหัสไปรษณีย์เมื่อไม่เลือกตำบล
//       }
//     };
//     getZipcode();
//   }, [selectedSubDistrict]);

//   // POST Zipcode For Install
//   useEffect(() => {
//     const getZipcode = async () => {
//       if (selectedSubDistrictForInstall) {
//         try {
//           const response = await axios.post(
//             ZIPCODE_URL,
//             { SubDistrictCode: selectedSubDistrictForInstall },
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//           if (response.data.length > 0) {
//             setSelectedZipcodeForInstall(response.data[0].POSTCODE); // อัปเดตรหัสไปรษณีย์ใน state
//           }
//         } catch (error) {
//           console.error("Error fetching ZIPCODE_URL:", error);
//         }
//       } else {
//         setSelectedZipcodeForInstall(""); // เคลียร์ข้อมูลรหัสไปรษณีย์เมื่อไม่เลือกตำบล
//       }
//     };
//     getZipcode();
//   }, [selectedSubDistrictForInstall]);

//   // POST Zipcode For Payment
//   useEffect(() => {
//     const getZipcode = async () => {
//       if (selectedSubDistrictForPayment) {
//         try {
//           const response = await axios.post(
//             ZIPCODE_URL,
//             { SubDistrictCode: selectedSubDistrictForPayment },
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//           if (response.data.length > 0) {
//             setSelectedZipcodeForPayment(response.data[0].POSTCODE); // อัปเดตรหัสไปรษณีย์ใน state
//           }
//         } catch (error) {
//           console.error("Error fetching ZIPCODE_URL:", error);
//         }
//       } else {
//         setSelectedZipcodeForPayment(""); // เคลียร์ข้อมูลรหัสไปรษณีย์เมื่อไม่เลือกตำบล
//       }
//     };
//     getZipcode();
//   }, [selectedSubDistrictForPayment]);

//   // POST Zipcode For Billing tax
//   useEffect(() => {
//     const getZipcode = async () => {
//       if (selectedSubDistrictForBilling) {
//         try {
//           const response = await axios.post(
//             ZIPCODE_URL,
//             { SubDistrictCode: selectedSubDistrictForBilling },
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//           if (response.data.length > 0) {
//             setSelectedZipcodeForBilling(response.data[0].POSTCODE); // อัปเดตรหัสไปรษณีย์ใน state
//           }
//         } catch (error) {
//           console.error("Error fetching ZIPCODE_URL:", error);
//         }
//       } else {
//         setSelectedZipcodeForBilling(""); // เคลียร์ข้อมูลรหัสไปรษณีย์เมื่อไม่เลือกตำบล
//       }
//     };
//     getZipcode();
//   }, [selectedSubDistrictForBilling]);

//   // ที่อยู่ลูกค้า (ตามบัตร)
//   const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     const value = Number(e.target.value);
//     // console.log(`test`, value);
//     setSelectedProvince(value);

//     // Reset district, subdistrict, and zipcode
//     setSelectedDistrict(undefined);
//     setSelectedSubDistrict(undefined);
//     setSelectedZipcode("");
//   };

//   const handleDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     const value = Number(e.target.value);
//     setSelectedDistrict(value);
//     // Reset subdistrict and zipcode
//     setSelectedSubDistrict(undefined);
//     setSelectedZipcode("");
//   };

//   const handleSubDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     const value = Number(e.target.value);
//     setSelectedSubDistrict(value);
//     // Reset zipcode
//     setSelectedZipcode("");
//   };

//   // ที่อยู่ลูกค้า (ติดตั้ง)
//   const handleProvinceChangeForInstall = (
//     e: ChangeEvent<HTMLSelectElement>
//   ) => {
//     const value = Number(e.target.value);
//     setSelectedProvinceForInstall(value);
//     // Reset district, subdistrict, and zipcode
//     setSelectedDistrictForInstall(undefined);
//     setSelectedSubDistrictForInstall(undefined);
//     setSelectedZipcodeForInstall("");
//   };

//   const handleDistrictChangeForInstall = (
//     e: ChangeEvent<HTMLSelectElement>
//   ) => {
//     const value = Number(e.target.value);
//     setSelectedDistrictForInstall(value);
//     // Reset subdistrict and zipcode
//     setSelectedSubDistrictForInstall(undefined);
//     setSelectedZipcodeForInstall("");
//   };

//   const handleSubDistrictChangeForInstall = (
//     e: ChangeEvent<HTMLSelectElement>
//   ) => {
//     const value = Number(e.target.value);
//     setSelectedSubDistrictForInstall(value);
//     // Reset zipcode
//     setSelectedZipcodeForInstall("");
//   };

//   // ที่อยู่ลูกค้า (เก็บเงิน)
//   const handleProvinceChangeForPayment = (
//     e: ChangeEvent<HTMLSelectElement>
//   ) => {
//     const value = Number(e.target.value);
//     setSelectedProvinceForPayment(value);
//     // Reset district, subdistrict, and zipcode
//     setSelectedDistrictForPayment(undefined);
//     setSelectedSubDistrictForPayment(undefined);
//     setSelectedZipcodeForPayment("");
//   };

//   const handleDistrictChangeForPayment = (
//     e: ChangeEvent<HTMLSelectElement>
//   ) => {
//     const value = Number(e.target.value);
//     setSelectedDistrictForPayment(value);
//     // Reset subdistrict and zipcode
//     setSelectedSubDistrictForPayment(undefined);
//     setSelectedZipcodeForPayment("");
//   };

//   const handleSubDistrictChangeForPayment = (
//     e: ChangeEvent<HTMLSelectElement>
//   ) => {
//     const value = Number(e.target.value);
//     setSelectedSubDistrictForPayment(value);
//     // Reset zipcode
//     setSelectedZipcodeForPayment("");
//   };

//   // จัดการติ้กใน accordion ที่อยู่ลูกค้า (ตามบัตร)
//   const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = event.target;

//     if (name === "allAddress") {
//       setLikeAllAddr(checked);

//       if (checked) {
//         setAddressNumberForInstall(addressNumber);
//         setAddressMooForInstall(addressMoo);
//         setAddressSoiForInstall(addressSoi);
//         setAddressRoadForInstall(addressRoad);
//         setSelectedProvinceForInstall(selectedProvince);
//         setSelectedDistrictForInstall(selectedDistrict);
//         setSelectedSubDistrictForInstall(selectedSubDistrict);
//         setSelectedZipcodeForInstall(selectedZipcode);
//         setAddressPhoneForInstall(addressPhone);

//         setAddressNumberForPayment(addressNumber);
//         setAddressMooForPayment(addressMoo);
//         setAddressSoiForPayment(addressSoi);
//         setAddressRoadForPayment(addressRoad);
//         setSelectedProvinceForPayment(selectedProvince);
//         setSelectedDistrictForPayment(selectedDistrict);
//         setSelectedSubDistrictForPayment(selectedSubDistrict);
//         setSelectedZipcodeForPayment(selectedZipcode);
//         setAddressPhoneForPayment(addressPhone);
//       }

//       // อัปเดตค่าใน RHF ของ accordion “ตามบัตร”
//       setValue("homeNoIdCard", addressNumber, {
//         shouldDirty: true,
//         shouldValidate: true,
//       });
//       setValue("provinceIdCard", String(selectedProvince), {
//         shouldDirty: true,
//         shouldValidate: true,
//       });
//       setValue("districtIdCard", String(selectedDistrict), {
//         shouldDirty: true,
//         shouldValidate: true,
//       });
//       setValue("subDistrictIdCard", String(selectedSubDistrict), {
//         shouldDirty: true,
//         shouldValidate: true,
//       });
//       setValue("telNoIdCard", addressPhone, {
//         shouldDirty: true,
//         shouldValidate: true,
//       });

//       setValue("homeNoInstall", addressNumber, {
//         shouldDirty: true,
//         shouldValidate: true,
//       });
//       setValue("provinceInstall", String(selectedProvince), {
//         shouldDirty: true,
//         shouldValidate: true,
//       });
//       setValue("districtInstall", String(selectedDistrict), {
//         shouldDirty: true,
//         shouldValidate: true,
//       });
//       setValue("subDistrictInstall", String(selectedSubDistrict), {
//         shouldDirty: true,
//         shouldValidate: true,
//       });

//       // ล้างข้อผิดพลาดของทุกฟิลด์ใน accordion “ตามบัตร” และ “ติดตั้ง”
//       clearErrors([
//         "homeNoIdCard",
//         "provinceIdCard",
//         "districtIdCard",
//         "subDistrictIdCard",
//         "telNoIdCard",

//         // เพิ่มส่วนนี้เพื่อเคลียร์ error ใน accordion “ติดตั้ง”
//         "homeNoInstall",
//         "provinceInstall",
//         "districtInstall",
//         "subDistrictInstall",
//       ]);
//     }

//     if (name === "likeAddressCard") {
//       setInstallLikeCardAddr(checked);

//       if (checked) {
//         // คัดลอกข้อมูลจากที่อยู่ตามบัตร ไปยังที่อยู่ติดตั้ง
//         setAddressNumberForInstall(addressNumber);
//         setAddressMooForInstall(addressMoo);
//         setAddressSoiForInstall(addressSoi);
//         setAddressRoadForInstall(addressRoad);
//         setSelectedProvinceForInstall(selectedProvince);
//         setSelectedDistrictForInstall(selectedDistrict);
//         setSelectedSubDistrictForInstall(selectedSubDistrict);
//         setSelectedZipcodeForInstall(selectedZipcode);
//         setAddressPhoneForInstall(addressPhone);
//       }

//       setValue("homeNoInstall", addressNumber, {
//         shouldDirty: true, // mark ว่าฟิลด์นี้เปลี่ยนแล้ว
//         shouldValidate: true, // สั่งให้ validate ใหม่
//       });
//       setValue("provinceInstall", String(selectedProvince), {
//         shouldDirty: true,
//         shouldValidate: true,
//       });
//       setValue("districtInstall", String(selectedDistrict), {
//         shouldDirty: true,
//         shouldValidate: true,
//       });
//       setValue("subDistrictInstall", String(selectedSubDistrict), {
//         shouldDirty: true,
//         shouldValidate: true,
//       });

//       // ลบข้อผิดพลาดเก่าๆ ถ้ามี
//       clearErrors([
//         "homeNoInstall",
//         "provinceInstall",
//         "districtInstall",
//         "subDistrictInstall",
//       ]);
//     }

//     if (name === "paymentLikeAddressCard") {
//       // setShowPaymentAddress(checked);
//       setPaymentLikeCardAddr(checked);
//       setPaymentLikeInstallAddr(false);

//       if (checked) {
//         // คัดลอกข้อมูลจากที่อยู่ตามบัตร ไปยังที่อยู่เก็บเงิน
//         setAddressNumberForPayment(addressNumber);
//         setAddressMooForPayment(addressMoo);
//         setAddressSoiForPayment(addressSoi);
//         setAddressRoadForPayment(addressRoad);
//         setSelectedProvinceForPayment(selectedProvince);
//         setSelectedDistrictForPayment(selectedDistrict);
//         setSelectedSubDistrictForPayment(selectedSubDistrict);
//         setSelectedZipcodeForPayment(selectedZipcode);
//         setAddressPhoneForPayment(addressPhone);
//       }
//     }

//     if (name === "paymentLikeAddressInstall") {
//       // setShowPaymentAddress(checked);
//       setPaymentLikeCardAddr(false);
//       setPaymentLikeInstallAddr(checked);

//       if (checked) {
//         // คัดลอกข้อมูลจากที่อยู่ตามบัตร ไปยังที่อยู่เก็บเงิน
//         setAddressNumberForPayment(addressNumberForInstall);
//         setAddressMooForPayment(addressMooForInstall);
//         setAddressSoiForPayment(addressSoiForInstall);
//         setAddressRoadForPayment(addressRoadForInstall);
//         setSelectedProvinceForPayment(selectedProvinceForInstall);
//         setSelectedDistrictForPayment(selectedDistrictForInstall);
//         setSelectedSubDistrictForPayment(selectedSubDistrictForInstall);
//         setSelectedZipcodeForPayment(selectedZipcodeForInstall);
//         setAddressPhoneForPayment(addressPhoneForInstall);
//       }
//     }

//     if (name === "showInstallAddress") {
//       setShowInstallAddress(checked);

//       if (checked) {
//         // คัดลอกข้อมูลจากที่อยู่ตามบัตร ไปยังที่อยู่ติดตั้ง
//         setAddressNumberForInstall(addressNumber);
//         setAddressMooForInstall(addressMoo);
//         setAddressSoiForInstall(addressSoi);
//         setAddressRoadForInstall(addressRoad);
//         setSelectedProvinceForInstall(selectedProvince);
//         setSelectedDistrictForInstall(selectedDistrict);
//         setSelectedSubDistrictForInstall(selectedSubDistrict);
//         setSelectedZipcodeForInstall(selectedZipcode);
//         setAddressPhoneForInstall(addressPhone);
//       }
//     }

//     if (name === "showPaymentAddress") {
//       setShowPaymentAddress(checked);

//       if (checked) {
//         // คัดลอกข้อมูลจากที่อยู่ตามบัตร ไปยังที่อยู่เก็บเงิน
//         setAddressNumberForPayment(addressNumber);
//         setAddressMooForPayment(addressMoo);
//         setAddressSoiForPayment(addressSoi);
//         setAddressRoadForPayment(addressRoad);
//         setSelectedProvinceForPayment(selectedProvince);
//         setSelectedDistrictForPayment(selectedDistrict);
//         setSelectedSubDistrictForPayment(selectedSubDistrict);
//         setSelectedZipcodeForPayment(selectedZipcode);
//         setAddressPhoneForPayment(addressPhone);
//       }
//     }

//     if (name === "billLikeAddressCard") {
//       setBillLikeCardAddr(checked);
//       setBillLikeInstallAddr(false);
//       setBillLikePaymentAddr(false);

//       if (checked) {
//         setAddressNumberForBilling(addressNumber);
//         setAddressMooForBilling(addressMoo);
//         setAddressSoiForBilling(addressSoi);
//         setAddressRoadForBilling(addressRoad);
//         setSelectedProvinceForBilling(selectedProvince);
//         setSelectedDistrictForBilling(selectedDistrict);
//         setSelectedSubDistrictForBilling(selectedSubDistrict);
//         setSelectedZipcodeForBilling(selectedZipcode);
//         setAddressPhoneForBilling(addressPhone);
//       }
//     }

//     if (name === "billLikeAddressInstall") {
//       setBillLikeCardAddr(false);
//       setBillLikeInstallAddr(checked);
//       setBillLikePaymentAddr(false);

//       if (checked) {
//         setAddressNumberForBilling(addressNumberForInstall);
//         setAddressMooForBilling(addressMooForInstall);
//         setAddressSoiForBilling(addressSoiForInstall);
//         setAddressRoadForBilling(addressRoadForInstall);
//         setSelectedProvinceForBilling(selectedProvinceForInstall);
//         setSelectedDistrictForBilling(selectedDistrictForInstall);
//         setSelectedSubDistrictForBilling(selectedSubDistrictForInstall);
//         setSelectedZipcodeForBilling(selectedZipcodeForInstall);
//         setAddressPhoneForBilling(addressPhoneForInstall);
//       }
//     }

//     if (name === "billLikeAddressPayment") {
//       setBillLikeCardAddr(false);
//       setBillLikeInstallAddr(false);
//       setBillLikePaymentAddr(checked);

//       if (checked) {
//         setAddressNumberForBilling(addressNumberForPayment);
//         setAddressMooForBilling(addressMooForPayment);
//         setAddressSoiForBilling(addressSoiForPayment);
//         setAddressRoadForBilling(addressRoadForPayment);
//         setSelectedProvinceForBilling(selectedProvinceForPayment);
//         setSelectedDistrictForBilling(selectedDistrictForPayment);
//         setSelectedSubDistrictForBilling(selectedSubDistrictForPayment);
//         setSelectedZipcodeForBilling(selectedZipcodeForPayment);
//         setAddressPhoneForBilling(addressPhoneForPayment);
//       }
//     }
//   };

//   // ฟังก์ชันเพื่อล้างการติ๊กใน  accordion อื่นๆ เมื่อมีการเปลี่ยนแปลงข้อมูลใน accordion ที่อยู่ลูกค้า (ตามบัตร)
//   const resetShowAddressCard = () => {
//     setLikeAllAddr(false);
//     setInstallLikeCardAddr(false);
//     setPaymentLikeInstallAddr(false);
//     setPaymentLikeCardAddr(false);
//     setBillLikePaymentAddr(false);
//     setBillLikeCardAddr(false);
//   };

//   // ฟังก์ชันเพื่อล้างการติ๊กใน  accordion ที่อยู่ลูกค้า (ตามบัตร) เมื่อมีการเปลี่ยนแปลงข้อมูลใน accordion ที่อยู่ลูกค้า (ติดตั้ง)
//   const resetShowInstallAddress = () => {
//     setLikeAllAddr(false);
//     setInstallLikeCardAddr(false);
//     setPaymentLikeInstallAddr(false);
//     setBillLikeInstallAddr(false);
//   };

//   // ฟังก์ชันเพื่อล้างการติ๊กใน  accordion ที่อยู่ลูกค้า (ตามบัตร) เมื่อมีการเปลี่ยนแปลงข้อมูลใน accordion ที่อยู่ลูกค้า (เก็บเงิน)
//   const resetShowPaymentAddress = () => {
//     setLikeAllAddr(false);
//     setInstallLikeCardAddr(false);
//     setPaymentLikeInstallAddr(false);
//     setBillLikePaymentAddr(false);
//   };

//   // ฟังก์ชันเพื่อล้างการติ๊กใน  accordion อื่นๆ เมื่อมีการเปลี่ยนแปลงข้อมูลใน accordion ที่อยู่ลูกค้า (เก็บเงิน)
//   const resetShowBillingAddress = () => {
//     setLikeAllAddr(false);
//     setBillLikeCardAddr(false);
//     setBillLikeInstallAddr(false);
//     setBillLikePaymentAddr(false);
//   };

//   {
//     /*-------------------- Start Validate --------------------*/
//   }
//   const schema = yup.object().shape({
//     //ที่อยู่ติดตั้ง
//     homeNoIdCard: yup.string().required("กรุณากรอกบ้านเลขที่"),
//     provinceIdCard: yup.string().required("กรุณาเลือกจังหวัด"),
//     districtIdCard: yup.string().required("กรุณาเลือกอำเภอ / เขต"),
//     subDistrictIdCard: yup.string().required("กรุณาเลือกตำบล / แขวง"),
//     telNoIdCard: yup
//       .string(),

//     homeNoInstall: yup.string().required("กรุณากรอกบ้านเลขที่"),
//     provinceInstall: yup.string().required("กรุณาเลือกจังหวัด"),
//     districtInstall: yup.string().required("กรุณาเลือกอำเภอ / เขต"),
//     subDistrictInstall: yup.string().required("กรุณาเลือกตำบล / แขวง"),

//     // ✅ ที่อยู่เก็บเงิน (Require)
//     homeNoPayment: yup.string().required("กรุณากรอกบ้านเลขที่"),
//     provincePayment: yup.string().required("กรุณาเลือกจังหวัด"),
//     districtPayment: yup.string().required("กรุณาเลือกอำเภอ / เขต"),
//     subDistrictPayment: yup.string().required("กรุณาเลือกตำบล / แขวง"),
//   });

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     trigger,
//     setValue,
//     clearErrors,
//   } = useForm({
//     resolver: yupResolver(schema),
//     mode: "onChange", // ตรวจสอบเมื่อมีการกรอกข้อมูล
//     reValidateMode: "onChange", // ตรวจสอบซ้ำเมื่อมีการเปลี่ยนแปลงข้อมูล
//     defaultValues: {
//       //ที่อยู่ติดตั้ง
//       homeNoIdCard: "",
//       provinceIdCard: "",
//       districtIdCard: "",
//       subDistrictIdCard: "",
//       telNoIdCard: "",

//       homeNoInstall: "",
//       provinceInstall: "",
//       districtInstall: "",
//       subDistrictInstall: "",

//       homeNoPayment: "",
//       provincePayment: "",
//       districtPayment: "",
//       subDistrictPayment: "",
//     },
//   });

//   // ใน useEffect ที่ preload installation
//   useEffect(() => {
//     if (!matchedItem?.CUSTOMERSTATUS?.[0]?.Contract) return;
//     const contract = matchedItem.CUSTOMERSTATUS[0].Contract;
//     const installAddr = Array.isArray(contract.Address)
//       ? contract.Address.find(
//         (a: any) => a.AddressTypeCode === "AddressInstall"
//       )
//       : undefined;
//     if (!installAddr) return;

//     // สกัดเบอร์โทร
//     const rawPhone = installAddr.TelMobile || installAddr.TelHome || "";
//     const cleaned = rawPhone.replace(/-/g, "");
//     // setAddressPhone(cleaned);

//     // **เติมบรรทัดนี้ เพื่อเซ็ตค่าให้ Controller**
//     setValue("telNoIdCard", cleaned);

//     // … (เซ็ต state อื่น ๆ ต่อ)
//   }, [matchedItem, setValue]);

//   // 1) โหลดจังหวัดครั้งเดียว
//   useEffect(() => {
//     axios
//       .get(PROVINCE_URL)
//       .then((res) => {
//         const list = Array.isArray(res.data)
//           ? res.data
//           : Array.isArray(res.data.data)
//             ? res.data.data
//             : [];
//         setGetProvince(list);
//       })
//       .catch(console.error);
//   }, []);

//   // 2) พอ getProvince มีข้อมูลแล้ว ให้แม็ปชื่อจาก matchedItem
//   useEffect(() => {
//     if (!matchedItem) return;
//     const installAddr =
//       matchedItem.CUSTOMERSTATUS?.[0]?.Contract?.Address?.find(
//         (a: any) => a.AddressTypeCode === "AddressInstall"
//       );
//     if (!installAddr || getProvince.length === 0) return;

//     const rawProv = installAddr.Province?.trim();
//     const prov = getProvince.find((p) => p.PROVINCENAME.trim() === rawProv);
//     if (prov) {
//       const code = Number(prov.PROVINCECODE);
//       setSelectedProvince(code);
//       setValue("provinceIdCard", prov.PROVINCECODE.toString());
//     }
//   }, [matchedItem, getProvince, setValue]);

//   // 3) พอ selectedProvince เปลี่ยน → โหลดอำเภอ และแม็ปชื่อกลับจาก matchedItem
//   useEffect(() => {
//     if (!selectedProvince) return;
//     const form = new FormData();
//     form.append("ProvinceCode", String(selectedProvince));
//     axios
//       .post(DISTRICT_URL, form, {
//         headers: { "Content-Type": "multipart/form-data" },
//       })
//       .then((res) => {
//         const list = Array.isArray(res.data)
//           ? res.data
//           : Array.isArray(res.data.data)
//             ? res.data.data
//             : [];
//         setGetDistrict(list);

//         // แม็ปอำเภอจาก matchedItem
//         const installAddr =
//           matchedItem.CUSTOMERSTATUS?.[0]?.Contract?.Address?.find(
//             (a: any) => a.AddressTypeCode === "AddressInstall"
//           );
//         if (!installAddr) return;

//         const rawAmp = installAddr.Amphur?.replace(/^อ\.\s*/, "").trim();
//         const dist = list.find((d: any) => d.DISTRICTNAME.trim() === rawAmp);
//         if (dist) {
//           setSelectedDistrict(Number(dist.DISTRICTCODE));
//           setValue("districtIdCard", dist.DISTRICTCODE.toString());
//         }
//       })
//       .catch(console.error);
//   }, [selectedProvince, matchedItem, setValue]);

//   // 4) พอ selectedDistrict เปลี่ยน → โหลดตำบล และแม็ปชื่อกลับจาก matchedItem
//   useEffect(() => {
//     if (!selectedDistrict) return;
//     const form = new FormData();
//     form.append("DistrictCode", String(selectedDistrict));
//     axios
//       .post(SUBDISTRICT_URL, form, {
//         headers: { "Content-Type": "multipart/form-data" },
//       })
//       .then((res) => {
//         const list = Array.isArray(res.data)
//           ? res.data
//           : Array.isArray(res.data.data)
//             ? res.data.data
//             : [];
//         setGetSubDistrict(list);

//         // หา AddressInstall
//         const installAddr =
//           matchedItem?.CUSTOMERSTATUS?.[0]?.Contract?.Address?.find(
//             (a: any) => a.AddressTypeCode === "AddressInstall"
//           );
//         if (!installAddr) return;

//         // ตัด prefix "ต." ออก
//         const rawSub = (installAddr.District ?? "")
//           .replace(/^ต\.\s*/, "")
//           .trim();

//         // แม็ปชื่อตำบลกลับเข้า list
//         const sub = list.find((s: any) => s.SUBDISTRICTNAME.trim() === rawSub);
//         if (sub) {
//           setSelectedSubDistrict(Number(sub.SUBDISTRICTCODE));
//           // ถ้าใช้ RHF
//           setValue("subDistrictIdCard", sub.SUBDISTRICTCODE.toString());
//         }
//       })
//       .catch(console.error);
//   }, [selectedDistrict, matchedItem, setValue]);

//   {
//     /*-------------------- End Validate --------------------*/
//   }

//   const SaveAddressData = useMemo(() => {
//     const province = getProvince.find(
//       (p) => String(p.PROVINCECODE) === String(selectedProvince)
//     );
//     const district = getDistrict.find(
//       (p) => String(p.DISTRICTCODE) === String(selectedDistrict)
//     );
//     const subDistrict = getSubDistrict.find(
//       (p) => String(p.SUBDISTRICTCODE) === String(selectedSubDistrict)
//     );

//     const provinceForInstall = getProvinceForInstall.find(
//       (p) => String(p.PROVINCECODE) === String(selectedProvinceForInstall)
//     );
//     const districtForInstall = getDistrictForInstall.find(
//       (p) => String(p.DISTRICTCODE) === String(selectedDistrictForInstall)
//     );
//     const subDistrictForInstall = getSubDistrictForInstall.find(
//       (p) => String(p.SUBDISTRICTCODE) === String(selectedSubDistrictForInstall)
//     );

//     const provinceForPayment = getProvinceForPayment.find(
//       (p) => String(p.PROVINCECODE) === String(selectedProvinceForPayment)
//     );
//     const districtForPayment = getDistrictForPayment.find(
//       (p) => String(p.DISTRICTCODE) === String(selectedDistrictForPayment)
//     );
//     const subDistrictForPayment = getSubDistrictForPayment.find(
//       (p) => String(p.SUBDISTRICTCODE) === String(selectedSubDistrictForPayment)
//     );

//     const provinceForBilling = getProvince.find(
//       (p) => String(p.PROVINCECODE) === String(selectedProvinceForBilling)
//     );
//     const districtForBilling = getDistrictForBilling.find(
//       (p) => String(p.DISTRICTCODE) === String(selectedDistrictForBilling)
//     );
//     const subDistrictForBilling = getSubDistrictForBilling.find(
//       (p) => String(p.SUBDISTRICTCODE) === String(selectedSubDistrictForBilling)
//     );

//     return {
//       ADDRESSINSTALLATION: {
//         ADDRESSNUMBER: addressNumber,
//         ADDRESSMOO: addressMoo,
//         ADDRESSSOI: addressSoi,
//         ADDRESSROAD: addressRoad,
//         ADDRESSPROVINCE: selectedProvince ? selectedProvince.toString() : "",
//         ADDRESSPROVINCENAME: province ? province.PROVINCENAME : "",
//         ADDRESSDISTRICT: selectedDistrict ? selectedDistrict.toString() : "",
//         ADDRESSDISTRICTNAME: district ? district.DISTRICTNAME : "",
//         ADDRESSSUBDISTRICT: selectedSubDistrict
//           ? selectedSubDistrict.toString()
//           : "",
//         ADDRESSSUBDISTRICTNAME: subDistrict ? subDistrict.SUBDISTRICTNAME : "",
//         ADDRESSZIPCODE: selectedZipcode,
//         ADDRESSPHONE: addressPhone,
//         USETHISTAX: useThisTax,
//       },
//       ADDRESSCARD: {
//         ADDRESSNUMBER: addressNumberForInstall,
//         ADDRESSMOO: addressMooForInstall,
//         ADDRESSSOI: addressSoiForInstall,
//         ADDRESSROAD: addressRoadForInstall,
//         ADDRESSPROVINCE: selectedProvinceForInstall
//           ? selectedProvinceForInstall.toString()
//           : "",
//         ADDRESSPROVINCENAME: provinceForInstall
//           ? provinceForInstall.PROVINCENAME
//           : "",
//         ADDRESSDISTRICT: selectedDistrictForInstall
//           ? selectedDistrictForInstall.toString()
//           : "",
//         ADDRESSDISTRICTNAME: districtForInstall
//           ? districtForInstall.DISTRICTNAME
//           : "",
//         ADDRESSSUBDISTRICT: selectedSubDistrictForInstall
//           ? selectedSubDistrictForInstall.toString()
//           : "",
//         ADDRESSSUBDISTRICTNAME: subDistrictForInstall
//           ? subDistrictForInstall.SUBDISTRICTNAME
//           : "",
//         ADDRESSZIPCODE: selectedZipcodeForInstall,
//         ADDRESSPHONE: addressPhoneForInstall,
//         USETHISTAX: useThisTax,
//       },
//       ADDRESSPAYMENT: {
//         ADDRESSNUMBER: addressNumberForPayment,
//         ADDRESSMOO: addressMooForPayment,
//         ADDRESSSOI: addressSoiForPayment,
//         ADDRESSROAD: addressRoadForPayment,
//         ADDRESSPROVINCE: selectedProvinceForPayment
//           ? selectedProvinceForPayment.toString()
//           : "",
//         ADDRESSPROVINCENAME: provinceForPayment
//           ? provinceForPayment.PROVINCENAME
//           : "",
//         ADDRESSDISTRICT: selectedDistrictForPayment
//           ? selectedDistrictForPayment.toString()
//           : "",
//         ADDRESSDISTRICTNAME: districtForPayment
//           ? districtForPayment.DISTRICTNAME
//           : "",
//         ADDRESSSUBDISTRICT: selectedSubDistrictForPayment
//           ? selectedSubDistrictForPayment.toString()
//           : "",
//         ADDRESSSUBDISTRICTNAME: subDistrictForPayment
//           ? subDistrictForPayment.SUBDISTRICTNAME
//           : "",
//         ADDRESSZIPCODE: selectedZipcodeForPayment,
//         ADDRESSPHONE: addressPhoneForPayment,
//         USETHISTAX: useThisTax,
//       },
//       ADDRESSTAX: {
//         ADDRESSNUMBER: addressNumberForBilling,
//         ADDRESSMOO: addressMooForBilling,
//         ADDRESSSOI: addressSoiForBilling,
//         ADDRESSROAD: addressRoadForBilling,
//         ADDRESSPROVINCE: selectedProvinceForBilling
//           ? selectedProvinceForBilling.toString()
//           : "",
//         ADDRESSPROVINCENAME: provinceForBilling
//           ? provinceForBilling.PROVINCENAME
//           : "",
//         ADDRESSDISTRICT: selectedDistrictForBilling
//           ? selectedDistrictForBilling.toString()
//           : "",
//         ADDRESSDISTRICTNAME: districtForBilling
//           ? districtForBilling.DISTRICTNAME
//           : "",
//         ADDRESSSUBDISTRICT: selectedSubDistrictForBilling
//           ? selectedSubDistrictForBilling.toString()
//           : "",
//         ADDRESSSUBDISTRICTNAME: subDistrictForBilling
//           ? subDistrictForBilling.SUBDISTRICTNAME
//           : "",
//         ADDRESSZIPCODE: selectedZipcodeForBilling,
//         ADDRESSPHONE: addressPhoneForBilling,
//         USETHISTAX: useThisTax,
//       },
//     };
//   }, [
//     addressNumber,
//     addressMoo,
//     addressSoi,
//     addressRoad,
//     selectedProvince,
//     selectedDistrict,
//     selectedSubDistrict,
//     selectedZipcode,
//     addressPhone,
//     useThisTax,
//     getProvince,
//     getDistrict,
//     getSubDistrict,

//     addressNumberForInstall,
//     addressMooForInstall,
//     addressSoiForInstall,
//     addressRoadForInstall,
//     selectedProvinceForInstall,
//     selectedDistrictForInstall,
//     selectedSubDistrictForInstall,
//     selectedZipcodeForInstall,
//     addressPhoneForInstall,
//     getProvinceForInstall,
//     getDistrictForInstall,
//     getSubDistrictForInstall,

//     addressNumberForPayment,
//     addressMooForPayment,
//     addressSoiForPayment,
//     addressRoadForPayment,
//     selectedProvinceForPayment,
//     selectedDistrictForPayment,
//     selectedSubDistrictForPayment,
//     selectedZipcodeForPayment,
//     addressPhoneForPayment,
//     getProvinceForPayment,
//     getDistrictForPayment,
//     getSubDistrictForPayment,

//     addressNumberForBilling,
//     addressMooForBilling,
//     addressSoiForBilling,
//     addressRoadForBilling,
//     selectedProvinceForBilling,
//     selectedDistrictForBilling,
//     selectedSubDistrictForBilling,
//     selectedZipcodeForBilling,
//     addressPhoneForBilling,
//     getProvinceForBilling,
//     getDistrictForBilling,
//     getSubDistrictForBilling,
//   ]);

//   {
//     /*-------------------- Start บันทึกข้อมูลลงระบบ และไปขั้นตอนต่อไป --------------------*/
//   }
//   const onSubmit = async (data: any) => {
//     try {
//       // เรียก API บันทึกข้อมูล
//       const response = await axios.post(
//         UPDATECONTACT,
//         {
//           REFNO,
//           EMPID: EmpId,
//           TEAMSALE: TeamSale,
//           SALECODE: SaleCode,
//           SUPEMPID: SupEmpId,
//           SECEMPID: SecEmpId,
//           FIELD: "ADDRESS",
//           DATA: SaveAddressData,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       // console.log(`updateContract DISCOUNT: `, response.data);
//       MySwal.fire({
//         icon: "success",
//         title: "สำเร็จ!",
//         text: "บันทึกข้อมูลลูกค้าเรียบร้อยแล้ว",
//         timer: 2000, // แสดงผล 3 วินาที
//         showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
//       });
//       navigate("/sale/pdpa");
//     } catch (error) {
//       console.error("Error saving data:", error);
//       MySwal.fire("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
//     }
//   };
//   {
//     /*-------------------- End บันทึกข้อมูล --------------------*/
//   }

//   return (
//     <>
//       {/* แสดง Loading */}
//       {loadingProvince && (
//         <div className="text-center my-10">
//           <ThreeDot />
//           <p className={`my-5 ${styles.fontSize}`}>
//             กำลังโหลดข้อมูล กรุณารอสักครู่ ...
//           </p>
//         </div>
//       )}

//       {!loadingProvince && (
//         <>
//           <Content>
//             <form onSubmit={handleSubmit(onSubmit)}>
//               <div className="d-flex justify-content-between align-items-center my-5">
//                 <div
//                   id="kt_page_title"
//                   data-kt-swapper="true"
//                   data-kt-swapper-mode="prepend"
//                   data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//                   className="page-title d-flex flex-wrap me-3 flex-column justify-content-ceดnter"
//                 >
//                   <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//                     <li className={`breadcrumb-item ${styles.titlePage}`}>
//                       ที่อยู่ลูกค้า
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//               <span className={`${styles.fontSize}`}>เลขที่ขาย: </span>
//               <span className={`${styles.titlePage}`}>{REFNO}</span>

//               {/* Start accordion ที่อยู่ลูกค้า (ตามบัตร)*/}
//               <div className="accordion mb-10" id="kt_accordion_2">
//                 <div className="accordion-item mb-10">
//                   <h2 className="accordion-header" id="kt_accordion_2_header_2">
//                     <h3
//                       className="accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7"
//                       data-bs-toggle="collapse"
//                       data-bs-target="#kt_accordion_2_body_2"
//                       aria-expanded="true"
//                       aria-controls="kt_accordion_2_body_2"
//                       style={{
//                         color: "white",
//                         cursor: "pointer",
//                         backgroundColor: "#3777bc",
//                       }}
//                     >
//                       ที่อยู่ลูกค้า (ตามบัตร)
//                     </h3>
//                   </h2>
//                   <div
//                     id="kt_accordion_2_body_2"
//                     className="accordion-collapse collapse show"
//                     aria-labelledby="kt_accordion_2_header_2"
//                     data-bs-parent="#kt_accordion_2"
//                   >
//                     <div className="accordion-body">
//                       {/* start form */}
//                       <form noValidate className="form">
//                         <div className="card-body px-lg-9 px-1">
//                           <div className="">
//                             <div className="row mb-6">
//                               <div className="col-lg-6 mt-xl-5">
//                                 <label className="form-check form-check-inline form-check-solid me-5">
//                                   <input
//                                     onChange={handleCheckboxChange}
//                                     className="form-check-input"
//                                     name="allAddress"
//                                     type="checkbox"
//                                     checked={likeAllAddr}
//                                   />
//                                   <span
//                                     className={`ps-2 mb-sm-5 ${styles.label}`}
//                                   >
//                                     ใช้ที่อยู่เดียวกันทั้งหมด
//                                   </span>
//                                 </label>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="">
//                             <div className="row mb-6">
//                               <div className="col-lg-4 mb-3">
//                                 <label
//                                   className={`form-label required ${styles.label}`}
//                                 >
//                                   บ้านเลขที่
//                                 </label>
//                                 <Controller
//                                   name="homeNoIdCard"
//                                   control={control}
//                                   render={({ field }) => (
//                                     <input
//                                       {...field}
//                                       className={`${styles.label
//                                         } form-control ${errors.homeNoIdCard ? "is-invalid" : ""
//                                         }`}
//                                       value={addressNumber}
//                                       onChange={(e) => {
//                                         field.onChange(e);
//                                         setAddressNumber(e.target.value);
//                                         resetShowAddressCard();
//                                       }}
//                                       type="text"
//                                     />
//                                   )}
//                                 />
//                                 {errors.homeNoIdCard && (
//                                   <p className={`text-danger ${styles.label}`}>
//                                     {errors.homeNoIdCard.message}
//                                   </p>
//                                 )}
//                               </div>
//                               <div className="col-lg-4 mb-3">
//                                 <label className={`form-label ${styles.label}`}>
//                                   หมู่ที่
//                                 </label>
//                                 <input
//                                   value={addressMoo}
//                                   onChange={(e) => {
//                                     setAddressMoo(e.target.value);
//                                     resetShowAddressCard();
//                                   }}
//                                   type="text"
//                                   className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                 />
//                               </div>
//                               <div className="col-lg-4 mb-3">
//                                 <label className={`form-label ${styles.label}`}>
//                                   ตรอก / ซอย
//                                 </label>
//                                 <input
//                                   value={addressSoi}
//                                   onChange={(e) => {
//                                     setAddressSoi(e.target.value);
//                                     resetShowAddressCard();
//                                   }}
//                                   type="text"
//                                   className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                 />
//                               </div>
//                             </div>
//                           </div>

//                           <div className="">
//                             <div className="row mb-6">
//                               <div className="col-lg-4 mb-3">
//                                 <label className={`form-label ${styles.label}`}>
//                                   ถนน
//                                 </label>
//                                 <input
//                                   value={addressRoad}
//                                   onChange={(e) => {
//                                     setAddressRoad(e.target.value);
//                                     resetShowAddressCard();
//                                   }}
//                                   type="text"
//                                   className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                 />
//                               </div>
//                               <div className="col-lg-4 mb-3">
//                                 <label
//                                   className={`form-label required ${styles.label}`}
//                                 >
//                                   จังหวัด
//                                 </label>
//                                 <Controller
//                                   name="provinceIdCard"
//                                   control={control}
//                                   render={({ field }) => (
//                                     <select
//                                       {...field}
//                                       className={`${styles.label} form-select ${errors.provinceIdCard
//                                         ? "is-invalid"
//                                         : ""
//                                         }`}
//                                       onChange={(e) => {
//                                         field.onChange(e);
//                                         handleProvinceChange(e);
//                                         resetShowAddressCard();
//                                       }}
//                                     >
//                                       <option value="">เลือกจังหวัด</option>
//                                       {getProvince.map((item: any) => (
//                                         <option
//                                           key={item.PROVINCECODE}
//                                           value={Number(item.PROVINCECODE)}
//                                         >
//                                           {item.PROVINCENAME}
//                                         </option>
//                                       ))}
//                                     </select>
//                                   )}
//                                 />
//                                 {errors.provinceIdCard && (
//                                   <p className={`text-danger ${styles.label}`}>
//                                     {errors.provinceIdCard.message}
//                                   </p>
//                                 )}
//                               </div>

//                               <div className="col-lg-4 mb-3">
//                                 <label
//                                   className={`form-label required ${styles.label}`}
//                                 >
//                                   อำเภอ / เขต
//                                 </label>
//                                 <Controller
//                                   name="districtIdCard"
//                                   control={control}
//                                   render={({ field }) => (
//                                     <select
//                                       {...field}
//                                       className={`${styles.label} form-select ${errors.districtIdCard
//                                         ? "is-invalid"
//                                         : ""
//                                         }`}
//                                       onChange={(e) => {
//                                         field.onChange(e);
//                                         handleDistrictChange(e);
//                                         resetShowAddressCard();
//                                       }}
//                                     >
//                                       <option value="">เลือกอำเภอ / เขต</option>
//                                       {Array.isArray(getDistrict) &&
//                                         getDistrict.map((item: any) => (
//                                           <option
//                                             key={item.DISTRICTCODE}
//                                             value={item.DISTRICTCODE}
//                                           >
//                                             {item.DISTRICTNAME}
//                                           </option>
//                                         ))}
//                                     </select>
//                                   )}
//                                 />
//                                 {errors.districtIdCard && (
//                                   <p className={`text-danger ${styles.label}`}>
//                                     {errors.districtIdCard.message}
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                           </div>

//                           <div className="">
//                             <div className="row mb-6">
//                               <div className="col-lg-4 mb-3">
//                                 <label
//                                   className={`form-label required ${styles.label}`}
//                                 >
//                                   ตำบล / แขวง
//                                 </label>
//                                 <Controller
//                                   name="subDistrictIdCard"
//                                   control={control}
//                                   render={({ field }) => (
//                                     <select
//                                       {...field}
//                                       className={`${styles.label} form-select ${errors.subDistrictIdCard
//                                         ? "is-invalid"
//                                         : ""
//                                         }`}
//                                       onChange={(e) => {
//                                         field.onChange(e);
//                                         handleSubDistrictChange(e);
//                                         resetShowAddressCard();
//                                       }}
//                                     >
//                                       <option value="">เลือกตำบล / แขวง</option>
//                                       {Array.isArray(getSubDistrict) &&
//                                         getSubDistrict.map((item: any) => (
//                                           <option
//                                             key={item.SUBDISTRICTCODE}
//                                             value={item.SUBDISTRICTCODE}
//                                           >
//                                             {item.SUBDISTRICTNAME}
//                                           </option>
//                                         ))}
//                                     </select>
//                                   )}
//                                 />
//                                 {errors.subDistrictIdCard && (
//                                   <p className={`text-danger ${styles.label}`}>
//                                     {errors.subDistrictIdCard.message}
//                                   </p>
//                                 )}
//                               </div>
//                               <div className="col-lg-4 mb-3">
//                                 <label
//                                   className={`form-label required ${styles.label}`}
//                                 >
//                                   รหัสไปรษณีย์
//                                 </label>
//                                 <input
//                                   type="text"
//                                   inputMode="numeric"
//                                   pattern="[0-9]*"
//                                   className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                   value={selectedZipcode}
//                                   readOnly
//                                   style={{
//                                     backgroundColor: "#d7dbde",
//                                   }}
//                                 />
//                               </div>
//                               <div className="col-lg-4 mb-3">
//                                 <label
//                                   className={`form-label ${styles.label}`}
//                                 >
//                                   เบอร์ที่ติดต่อได้
//                                 </label>
//                                 <Controller
//                                   name="telNoIdCard"
//                                   control={control}
//                                   render={({ field }) => (
//                                     <input
//                                       {...field}
//                                       className={`${styles.label
//                                         } form-control ${errors.telNoIdCard ? "is-invalid" : ""
//                                         }`}
//                                       value={(addressPhone || "").replace(
//                                         /-/g,
//                                         ""
//                                       )}
//                                       maxLength={10}
//                                       onChange={(e) => {
//                                         field.onChange(e);
//                                         setAddressPhone(e.target.value);
//                                         resetShowAddressCard();
//                                       }}
//                                       type="text"
//                                       inputMode="numeric"
//                                       pattern="[0-9]*"
//                                     />
//                                   )}
//                                 />
//                                 {errors.telNoIdCard && (
//                                   <p className={`text-danger ${styles.label}`}>
//                                     {errors.telNoIdCard.message}
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </form>
//                       {/* end form */}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* End accordion ที่อยู่ลูกค้า (ตามบัตร)*/}

//               {/* Start accordion ที่อยู่ลูกค้า (ติดตั้ง) */}
//               <div className="accordion mb-10" id="kt_accordion_3">
//                 <div className="accordion-item mb-10">
//                   <h2 className="accordion-header" id="kt_accordion_3_header_3">
//                     <h3
//                       className="accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7"
//                       data-bs-toggle="collapse"
//                       data-bs-target="#kt_accordion_3_body_3"
//                       aria-expanded="true"
//                       aria-controls="kt_accordion_3_body_3"
//                       style={{
//                         color: "white",
//                         cursor: "pointer",
//                         backgroundColor: "#3777bc",
//                       }}
//                     >
//                       ที่อยู่ลูกค้า (ติดตั้ง)
//                     </h3>
//                   </h2>
//                   <div
//                     id="kt_accordion_3_body_3"
//                     className="accordion-collapse collapse show"
//                     aria-labelledby="kt_accordion_3_header_3"
//                     data-bs-parent="#kt_accordion_3"
//                   >
//                     <div className="accordion-body">
//                       <form noValidate className="form">
//                         <div className="card-body px-lg-9 px-1">
//                           <div className="">
//                             <div className="row mb-6">
//                               <div className="col-lg-6 my-10 mt-xl-5">
//                                 <label className="form-check form-check-inline form-check-solid me-5">
//                                   <input
//                                     onChange={handleCheckboxChange}
//                                     className="form-check-input"
//                                     name="likeAddressCard"
//                                     type="checkbox"
//                                     checked={installLikeCardAddr}
//                                   />
//                                   <span
//                                     className={`ps-2 mb-sm-5 ${styles.label}`}
//                                   >
//                                     ใช้ที่อยู่เดียวกับที่อยู่ตามบัตรฯ
//                                   </span>
//                                 </label>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="">
//                             <div className="row mb-6">
//                               <div className="col-lg-4 mb-3">
//                                 <label
//                                   className={`form-label required ${styles.label}`}
//                                 >
//                                   บ้านเลขที่
//                                 </label>
//                                 <Controller
//                                   name="homeNoInstall"
//                                   control={control}
//                                   render={({ field }) => (
//                                     <input
//                                       {...field}
//                                       className={`form-control ${styles.label
//                                         } ${errors.homeNoInstall ? "is-invalid" : ""
//                                         }`}
//                                       value={addressNumberForInstall}
//                                       onChange={(e) => {
//                                         field.onChange(e);
//                                         setAddressNumberForInstall(
//                                           e.target.value
//                                         );
//                                         resetShowInstallAddress();
//                                       }}
//                                     />
//                                   )}
//                                 />
//                                 {errors.homeNoInstall && (
//                                   <p className={`text-danger ${styles.label}`}>
//                                     {errors.homeNoInstall.message}
//                                   </p>
//                                 )}
//                               </div>
//                               <div className="col-lg-4 mb-3">
//                                 <label className={`form-label ${styles.label}`}>
//                                   หมู่ที่
//                                 </label>
//                                 <input
//                                   value={addressMooForInstall}
//                                   onChange={(e) => {
//                                     setAddressMooForInstall(e.target.value);
//                                     resetShowInstallAddress();
//                                   }}
//                                   type="text"
//                                   className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                 />
//                               </div>
//                               <div className="col-lg-4 mb-3">
//                                 <label className={`form-label ${styles.label}`}>
//                                   ตรอก / ซอย
//                                 </label>
//                                 <input
//                                   value={addressSoiForInstall}
//                                   onChange={(e) => {
//                                     setAddressSoiForInstall(e.target.value);
//                                     resetShowInstallAddress();
//                                   }}
//                                   type="text"
//                                   className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                 />
//                               </div>
//                             </div>
//                           </div>

//                           <div className="">
//                             <div className="row mb-6">
//                               <div className="col-lg-4 mb-3">
//                                 <label className={`form-label ${styles.label}`}>
//                                   ถนน
//                                 </label>
//                                 <input
//                                   value={addressRoadForInstall}
//                                   onChange={(e) => {
//                                     setAddressRoadForInstall(e.target.value);
//                                     resetShowInstallAddress();
//                                   }}
//                                   type="text"
//                                   className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                 />
//                               </div>
//                               <div className="col-lg-4 mb-3">
//                                 <label
//                                   className={`form-label required ${styles.label}`}
//                                 >
//                                   จังหวัด
//                                 </label>
//                                 <Controller
//                                   name="provinceInstall"
//                                   control={control}
//                                   render={({ field }) => (
//                                     <select
//                                       {...field}
//                                       className={`form-select ${styles.label} ${errors.provinceInstall
//                                         ? "is-invalid"
//                                         : ""
//                                         }`}
//                                       value={selectedProvinceForInstall}
//                                       onChange={(e) => {
//                                         field.onChange(e.target.value);
//                                         setSelectedProvinceForInstall(
//                                           Number(e.target.value)
//                                         );
//                                         resetShowInstallAddress();
//                                       }}
//                                     >
//                                       <option value="">เลือกจังหวัด</option>
//                                       {getProvinceForInstall.map((p) => (
//                                         <option
//                                           key={p.PROVINCECODE}
//                                           value={p.PROVINCECODE}
//                                         >
//                                           {p.PROVINCENAME}
//                                         </option>
//                                       ))}
//                                     </select>
//                                   )}
//                                 />
//                                 {errors.provinceInstall && (
//                                   <p className={`text-danger ${styles.label}`}>
//                                     {errors.provinceInstall.message}
//                                   </p>
//                                 )}
//                               </div>
//                               <div className="col-lg-4 mb-3">
//                                 <label
//                                   className={`form-label required ${styles.label}`}
//                                 >
//                                   อำเภอ / เขต
//                                 </label>
//                                 <Controller
//                                   name="districtInstall"
//                                   control={control}
//                                   render={({ field }) => (
//                                     <select
//                                       {...field}
//                                       className={`form-select ${styles.label} ${errors.districtInstall
//                                         ? "is-invalid"
//                                         : ""
//                                         }`}
//                                       value={selectedDistrictForInstall}
//                                       onChange={(e) => {
//                                         field.onChange(e.target.value);
//                                         setSelectedDistrictForInstall(
//                                           Number(e.target.value)
//                                         );
//                                         resetShowInstallAddress();
//                                       }}
//                                     >
//                                       <option value="">เลือกอำเภอ / เขต</option>
//                                       {getDistrictForInstall.map((d) => (
//                                         <option
//                                           key={d.DISTRICTCODE}
//                                           value={d.DISTRICTCODE}
//                                         >
//                                           {d.DISTRICTNAME}
//                                         </option>
//                                       ))}
//                                     </select>
//                                   )}
//                                 />
//                                 {errors.districtInstall && (
//                                   <p className={`text-danger ${styles.label}`}>
//                                     {errors.districtInstall.message}
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                           </div>

//                           <div className="">
//                             <div className="row mb-6">
//                               <div className="col-lg-4 mb-3">
//                                 <label
//                                   className={`form-label required ${styles.label}`}
//                                 >
//                                   ตำบล / แขวง
//                                 </label>
//                                 <Controller
//                                   name="subDistrictInstall"
//                                   control={control}
//                                   render={({ field }) => (
//                                     <select
//                                       {...field}
//                                       className={`form-select ${styles.label} ${errors.subDistrictInstall
//                                         ? "is-invalid"
//                                         : ""
//                                         }`}
//                                       value={selectedSubDistrictForInstall}
//                                       onChange={(e) => {
//                                         field.onChange(e.target.value);
//                                         setSelectedSubDistrictForInstall(
//                                           Number(e.target.value)
//                                         );
//                                         resetShowInstallAddress();
//                                       }}
//                                     >
//                                       <option value="">เลือกตำบล / แขวง</option>
//                                       {getSubDistrictForInstall.map((s) => (
//                                         <option
//                                           key={s.SUBDISTRICTCODE}
//                                           value={s.SUBDISTRICTCODE}
//                                         >
//                                           {s.SUBDISTRICTNAME}
//                                         </option>
//                                       ))}
//                                     </select>
//                                   )}
//                                 />
//                                 {errors.subDistrictInstall && (
//                                   <p className={`text-danger ${styles.label}`}>
//                                     {errors.subDistrictInstall.message}
//                                   </p>
//                                 )}
//                               </div>

//                               <div className="col-lg-4 mb-3">
//                                 <label
//                                   className={`form-label required ${styles.label}`}
//                                 >
//                                   รหัสไปรษณีย์
//                                 </label>
//                                 <input
//                                   type="text"
//                                   className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                   value={selectedZipcodeForInstall}
//                                   readOnly
//                                   style={{
//                                     backgroundColor: "#d7dbde",
//                                   }}
//                                 />
//                               </div>
//                               <div className="col-lg-4 mb-3">
//                                 <label className={`form-label ${styles.label}`}>
//                                   เบอร์ที่ติดต่อได้
//                                 </label>
//                                 <input
//                                   className={`form-control mb-3 mb-lg-0 ${styles.label}`}
//                                   value={(addressPhoneForInstall || "").replace(
//                                     /-/g,
//                                     ""
//                                   )}
//                                   onChange={(e) => {
//                                     setAddressPhoneForInstall(e.target.value);
//                                     resetShowInstallAddress();
//                                   }}
//                                   type="text"
//                                   inputMode="numeric"
//                                   pattern="[0-9]*"
//                                   maxLength={10}
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </form>
//                       {/* end form */}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* End accordion ที่อยู่ลูกค้า (ติดตั้ง) */}

//               {/* Start accordion ที่อยู่ลูกค้า (เก็บเงิน)*/}
//               <div className="accordion mb-10" id="kt_accordion_4">
//                 <div className="accordion-item mb-10">
//                   <h2 className="accordion-header" id="kt_accordion_4_header_4">
//                     <h3
//                       className="accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7"
//                       data-bs-toggle="collapse"
//                       data-bs-target="#kt_accordion_4_body_4"
//                       aria-expanded="true"
//                       aria-controls="kt_accordion_4_body_4"
//                       style={{
//                         color: "white",
//                         cursor: "pointer",
//                         backgroundColor: "#3777bc",
//                       }}
//                     >
//                       ที่อยู่ลูกค้า (เก็บเงิน)
//                     </h3>
//                   </h2>
//                   <div
//                     id="kt_accordion_4_body_4"
//                     className="accordion-collapse collapse show"
//                     aria-labelledby="kt_accordion_4_header_4"
//                     data-bs-parent="#kt_accordion_4"
//                   >
//                     <div className="accordion-body">
//                       {/* start form */}
//                       <form noValidate className="form">
//                         <div className="card-body px-lg-9 px-1">
//                           <div className="">
//                             <div className="row mb-6">
//                               <div className="col-lg-6 my-10 mt-xl-5">
//                                 <label className="form-check form-check-inline form-check-solid me-5">
//                                   <input
//                                     onChange={handleCheckboxChange}
//                                     className="form-check-input"
//                                     name="paymentLikeAddressCard"
//                                     type="checkbox"
//                                     checked={paymentLikeCardAddr}
//                                   />
//                                   <span
//                                     className={`${styles.label} ps-2 mb-sm-5`}
//                                   >
//                                     ใช้ที่อยู่เดียวกับที่อยู่ตามบัตรฯ
//                                   </span>
//                                 </label>
//                                 <label className="form-check form-check-inline form-check-solid me-5 mt-3 mt-sm-0">
//                                   <input
//                                     onChange={handleCheckboxChange}
//                                     className="form-check-input"
//                                     name="paymentLikeAddressInstall"
//                                     type="checkbox"
//                                     checked={paymentLikeInstallAddr}
//                                   />
//                                   <span
//                                     className={`${styles.label} ps-2 mb-sm-5`}
//                                   >
//                                     ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง
//                                   </span>
//                                 </label>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="">
//                             <div className="row mb-6">
//                               <div className="col-lg-4 mb-3">
//                                 <label className={`form-label ${styles.label}`}>
//                                   บ้านเลขที่
//                                 </label>
//                                 <input
//                                   className={`form-control ${styles.label}`}
//                                   value={addressNumberForPayment}
//                                   onChange={(e) => {
//                                     setAddressNumberForPayment(e.target.value);
//                                     resetShowPaymentAddress();
//                                   }}
//                                   type="text"
//                                 />
//                               </div>
//                               <div className="col-lg-4 mb-3">
//                                 <label className={`form-label ${styles.label}`}>
//                                   หมู่ที่
//                                 </label>
//                                 <input
//                                   value={addressMooForPayment}
//                                   onChange={(e) => {
//                                     setAddressMooForPayment(e.target.value);
//                                     resetShowPaymentAddress();
//                                   }}
//                                   type="text"
//                                   className={`form-control ${styles.label}`}
//                                 />
//                               </div>
//                               <div className="col-lg-4 mb-3">
//                                 <label className={`form-label ${styles.label}`}>
//                                   ตรอก / ซอย
//                                 </label>
//                                 <input
//                                   value={addressSoiForPayment}
//                                   onChange={(e) => {
//                                     setAddressSoiForPayment(e.target.value);
//                                     resetShowPaymentAddress();
//                                   }}
//                                   type="text"
//                                   className={`form-control ${styles.label}`}
//                                 />
//                               </div>
//                             </div>
//                           </div>

//                           <div className="">
//                             <div className="row mb-6">
//                               <div className="col-lg-4 mb-3">
//                                 <label className={`form-label ${styles.label}`}>
//                                   ถนน
//                                 </label>
//                                 <input
//                                   value={addressRoadForPayment}
//                                   onChange={(e) => {
//                                     setAddressRoadForPayment(e.target.value);
//                                     resetShowPaymentAddress();
//                                   }}
//                                   type="text"
//                                   className={`form-control ${styles.label}`}
//                                 />
//                               </div>
//                               <div className="col-lg-4 mb-3">
//                                 <label className={`form-label ${styles.label}`}>
//                                   จังหวัด
//                                 </label>
//                                 <select
//                                   className={`form-select ${styles.label}`}
//                                   value={selectedProvinceForPayment}
//                                   onChange={(e) => {
//                                     setSelectedProvinceForPayment(
//                                       Number(e.target.value)
//                                     );
//                                     resetShowPaymentAddress();
//                                   }}
//                                 >
//                                   <option value="">เลือกจังหวัด</option>
//                                   {getProvinceForPayment.map((item: any) => (
//                                     <option
//                                       key={item.PROVINCECODE}
//                                       value={item.PROVINCECODE}
//                                     >
//                                       {item.PROVINCENAME}
//                                     </option>
//                                   ))}
//                                 </select>
//                               </div>
//                               <div className="col-lg-4 mb-3">
//                                 <label className={`form-label ${styles.label}`}>
//                                   อำเภอ / เขต
//                                 </label>
//                                 <select
//                                   className={`form-select ${styles.label}`}
//                                   value={selectedDistrictForPayment}
//                                   onChange={(e) => {
//                                     setSelectedDistrictForPayment(
//                                       Number(e.target.value)
//                                     );
//                                     resetShowPaymentAddress();
//                                   }}
//                                 >
//                                   <option value="">เลือกอำเภอ / เขต</option>
//                                   {Array.isArray(getDistrictForPayment) &&
//                                     getDistrictForPayment.map((item: any) => (
//                                       <option
//                                         key={item.DISTRICTCODE}
//                                         value={item.DISTRICTCODE}
//                                       >
//                                         {item.DISTRICTNAME}
//                                       </option>
//                                     ))}
//                                 </select>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="">
//                             <div className="row mb-6">
//                               <div className="col-lg-4 mb-3">
//                                 <label className={`form-label ${styles.label}`}>
//                                   ตำบล / แขวง
//                                 </label>
//                                 <select
//                                   className={`form-select ${styles.label}`}
//                                   value={selectedSubDistrictForPayment}
//                                   onChange={(e) => {
//                                     setSelectedSubDistrictForPayment(
//                                       Number(e.target.value)
//                                     );
//                                     resetShowPaymentAddress();
//                                   }}
//                                 >
//                                   <option value="">เลือกตำบล / แขวง</option>
//                                   {Array.isArray(getSubDistrictForPayment) &&
//                                     getSubDistrictForPayment.map(
//                                       (item: any) => (
//                                         <option
//                                           key={item.SUBDISTRICTCODE}
//                                           value={item.SUBDISTRICTCODE}
//                                         >
//                                           {item.SUBDISTRICTNAME}
//                                         </option>
//                                       )
//                                     )}
//                                 </select>
//                               </div>
//                               <div className="col-lg-4 mb-3">
//                                 <label
//                                   className={`form-label required ${styles.label}`}
//                                 >
//                                   รหัสไปรษณีย์
//                                 </label>
//                                 <input
//                                   type="text"
//                                   className={`form-control ${styles.label}`}
//                                   value={selectedZipcodeForPayment}
//                                   readOnly
//                                   style={{
//                                     backgroundColor: "#d7dbde",
//                                   }}
//                                 />
//                               </div>
//                               <div className="col-lg-4 mb-3">
//                                 <label className={`form-label ${styles.label}`}>
//                                   เบอร์ที่ติดต่อได้
//                                 </label>
//                                 <input
//                                   className={`form-control ${styles.label}`}
//                                   value={(addressPhoneForPayment || "").replace(
//                                     /-/g,
//                                     ""
//                                   )}
//                                   onChange={(e) => {
//                                     setAddressPhoneForPayment(e.target.value);
//                                     resetShowPaymentAddress();
//                                   }}
//                                   type="text"
//                                   maxLength={10}
//                                   inputMode="numeric"
//                                   pattern="[0-9]*"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </form>
//                       {/* end form */}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* End accordion ที่อยู่ลูกค้า (เก็บเงิน)*/}

//               <div className="">
//                 <div className="row">
//                   <div className="col-12 mb-15">
//                     <label className="form-check form-check-inline form-check-solid">
//                       <input
//                         className="form-check-input mx-1"
//                         name="showTaxAddress"
//                         type="checkbox"
//                         checked={showTaxAddress}
//                         onChange={(e) => setShowTaxAddress(e.target.checked)}
//                       />
//                       <span className={`${styles.label} ps-3 mb-sm-5 mb-5`}>
//                         ต้องการใบกำกับภาษี
//                       </span>
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {/* Start accordion ที่อยู่ลูกค้า (ใบกำกับภาษี)*/}
//               {showTaxAddress && (
//                 <>
//                   <div className="accordion mb-10" id="kt_accordion_5">
//                     <div className="accordion-item mb-10">
//                       <h2
//                         className="accordion-header"
//                         id="kt_accordion_5_header_5"
//                       >
//                         <h3
//                           className="accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7"
//                           data-bs-toggle="collapse"
//                           data-bs-target="#kt_accordion_5_body_5"
//                           aria-expanded="true"
//                           aria-controls="kt_accordion_5_body_5"
//                           style={{
//                             color: "white",
//                             cursor: "pointer",
//                             backgroundColor: "#3777bc",
//                           }}
//                         >
//                           ที่อยู่ลูกค้า (ออกใบกำกับภาษี)
//                         </h3>
//                       </h2>
//                       <div
//                         id="kt_accordion_5_body_5"
//                         className="accordion-collapse collapse show"
//                         aria-labelledby="kt_accordion_5_header_5"
//                         data-bs-parent="#kt_accordion_5"
//                       >
//                         <div className="accordion-body">
//                           {/* start form */}
//                           <form noValidate className="form">
//                             <div className="card-body px-lg-9 px-1">
//                               <div className="">
//                                 <div className="row mb-6">
//                                   <div className="col-lg-6 mb-3 mt-xl-5">
//                                     <label className="form-check form-check-inline form-check-solid me-5">
//                                       <input
//                                         onChange={handleCheckboxChange}
//                                         className="form-check-input"
//                                         name="billLikeAddressCard"
//                                         type="checkbox"
//                                         checked={billLikeCardAddr}
//                                       />
//                                       <span
//                                         className={`${styles.label} ps-2 mb-sm-5`}
//                                       >
//                                         ใช้ที่อยู่เดียวกับที่อยู่ตามบัตรฯ
//                                       </span>
//                                     </label>
//                                     <label className="form-check form-check-inline form-check-solid me-5 mt-3 mt-sm-0">
//                                       <input
//                                         onChange={handleCheckboxChange}
//                                         className="form-check-input"
//                                         name="billLikeAddressInstall"
//                                         type="checkbox"
//                                         checked={billLikeInstallAddr}
//                                       />
//                                       <span
//                                         className={`${styles.label} ps-2 mb-sm-5`}
//                                       >
//                                         ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง
//                                       </span>
//                                     </label>
//                                     <label className="form-check form-check-inline form-check-solid me-5 mt-3 mt-sm-0">
//                                       <input
//                                         onChange={handleCheckboxChange}
//                                         className="form-check-input"
//                                         name="billLikeAddressPayment"
//                                         type="checkbox"
//                                         checked={billLikePaymentAddr}
//                                       />
//                                       <span
//                                         className={`${styles.label} ps-2 mb-sm-5`}
//                                       >
//                                         ใช้ที่อยู่เดียวกับที่อยู่เก็บเงิน
//                                       </span>
//                                     </label>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="">
//                                 <div className="row mb-6">
//                                   <div className="col-lg-4 mb-3">
//                                     <label
//                                       className={`form-label ${styles.label}`}
//                                     >
//                                       บ้านเลขที่
//                                     </label>
//                                     <input
//                                       value={addressNumberForBilling}
//                                       onChange={(e) => {
//                                         setAddressNumberForBilling(
//                                           e.target.value
//                                         );
//                                         resetShowBillingAddress();
//                                       }}
//                                       type="text"
//                                       className={`form-control ${styles.label}`}
//                                     />
//                                   </div>
//                                   <div className="col-lg-4 mb-3">
//                                     <label
//                                       className={`form-label ${styles.label}`}
//                                     >
//                                       หมู่ที่
//                                     </label>
//                                     <input
//                                       value={addressMooForBilling}
//                                       onChange={(e) => {
//                                         setAddressMooForBilling(e.target.value);
//                                         resetShowBillingAddress();
//                                       }}
//                                       type="text"
//                                       className={`form-control ${styles.label}`}
//                                     />
//                                   </div>
//                                   <div className="col-lg-4 mb-3">
//                                     <label
//                                       className={`form-label ${styles.label}`}
//                                     >
//                                       ตรอก / ซอย
//                                     </label>
//                                     <input
//                                       value={addressSoiForBilling}
//                                       onChange={(e) => {
//                                         setAddressSoiForBilling(e.target.value);
//                                         resetShowBillingAddress();
//                                       }}
//                                       type="text"
//                                       className={`form-control ${styles.label}`}
//                                     />
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="">
//                                 <div className="row mb-6">
//                                   <div className="col-lg-4 mb-3">
//                                     <label
//                                       className={`form-label ${styles.label}`}
//                                     >
//                                       ถนน
//                                     </label>
//                                     <input
//                                       value={addressRoadForBilling}
//                                       onChange={(e) => {
//                                         setAddressRoadForBilling(
//                                           e.target.value
//                                         );
//                                         resetShowBillingAddress();
//                                       }}
//                                       type="text"
//                                       className={`form-control ${styles.label}`}
//                                     />
//                                   </div>

//                                   {/* จังหวัด */}
//                                   <div className="col-lg-4 mb-3">
//                                     <label
//                                       className={`form-label ${styles.label}`}
//                                     >
//                                       จังหวัด
//                                     </label>
//                                     <select
//                                       className={`form-select ${styles.label}`}
//                                       value={
//                                         billLikeCardAddr
//                                           ? selectedProvince
//                                           : billLikeInstallAddr
//                                             ? selectedProvinceForInstall
//                                             : billLikePaymentAddr
//                                               ? selectedProvinceForPayment
//                                               : selectedProvinceForBilling
//                                       }
//                                       onChange={(e) => {
//                                         const selectedValue = Number(
//                                           e.target.value
//                                         );
//                                         if (billLikeCardAddr) {
//                                           setSelectedProvince(selectedValue);
//                                         } else if (billLikeInstallAddr) {
//                                           setSelectedProvinceForInstall(
//                                             selectedValue
//                                           );
//                                         } else if (billLikePaymentAddr) {
//                                           setSelectedProvinceForPayment(
//                                             selectedValue
//                                           );
//                                         } else {
//                                           setSelectedProvinceForBilling(
//                                             selectedValue
//                                           );
//                                         }
//                                         resetShowBillingAddress();
//                                       }}
//                                     >
//                                       <option value="">เลือกจังหวัด</option>
//                                       {(billLikeCardAddr
//                                         ? getProvince
//                                         : billLikeInstallAddr
//                                           ? getProvinceForInstall
//                                           : billLikePaymentAddr
//                                             ? getProvinceForPayment
//                                             : getProvinceForBilling
//                                       ).map((item) => (
//                                         <option
//                                           key={item.PROVINCECODE}
//                                           value={item.PROVINCECODE}
//                                         >
//                                           {item.PROVINCENAME}
//                                         </option>
//                                       ))}
//                                     </select>
//                                   </div>

//                                   {/* อำเภอ / เขต */}
//                                   <div className="col-lg-4 mb-3">
//                                     <label
//                                       className={`form-label ${styles.label}`}
//                                     >
//                                       อำเภอ / เขต
//                                     </label>
//                                     <select
//                                       className={`form-select ${styles.label}`}
//                                       value={
//                                         billLikeCardAddr
//                                           ? selectedDistrict
//                                           : billLikeInstallAddr
//                                             ? selectedDistrictForInstall
//                                             : billLikePaymentAddr
//                                               ? selectedDistrictForPayment
//                                               : selectedDistrictForBilling
//                                       }
//                                       onChange={(e) => {
//                                         const selectedValue = Number(
//                                           e.target.value
//                                         );
//                                         if (billLikeCardAddr) {
//                                           setSelectedDistrict(selectedValue);
//                                         } else if (billLikeInstallAddr) {
//                                           setSelectedDistrictForInstall(
//                                             selectedValue
//                                           );
//                                         } else if (billLikePaymentAddr) {
//                                           setSelectedDistrictForPayment(
//                                             selectedValue
//                                           );
//                                         } else {
//                                           setSelectedDistrictForBilling(
//                                             selectedValue
//                                           );
//                                         }
//                                         resetShowBillingAddress();
//                                       }}
//                                     >
//                                       <option value="">เลือกอำเภอ / เขต</option>
//                                       {(billLikeCardAddr
//                                         ? getDistrict
//                                         : billLikeInstallAddr
//                                           ? getDistrictForInstall
//                                           : billLikePaymentAddr
//                                             ? getDistrictForPayment
//                                             : getDistrictForBilling
//                                       ).map((item) => (
//                                         <option
//                                           key={item.DISTRICTCODE}
//                                           value={item.DISTRICTCODE}
//                                         >
//                                           {item.DISTRICTNAME}
//                                         </option>
//                                       ))}
//                                     </select>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="">
//                                 <div className="row mb-6">
//                                   {/* ตำบล / แขวง */}
//                                   <div className="col-lg-4 mb-3">
//                                     <label
//                                       className={`form-label ${styles.label}`}
//                                     >
//                                       ตำบล / แขวง
//                                     </label>
//                                     <select
//                                       className={`form-select ${styles.label}`}
//                                       value={
//                                         billLikeCardAddr
//                                           ? selectedSubDistrict
//                                           : billLikeInstallAddr
//                                             ? selectedSubDistrictForInstall
//                                             : billLikePaymentAddr
//                                               ? selectedSubDistrictForPayment
//                                               : selectedSubDistrictForBilling
//                                       }
//                                       onChange={(e) => {
//                                         const selectedValue = Number(
//                                           e.target.value
//                                         );
//                                         if (billLikeCardAddr) {
//                                           setSelectedSubDistrict(selectedValue);
//                                         } else if (billLikeInstallAddr) {
//                                           setSelectedSubDistrictForInstall(
//                                             selectedValue
//                                           );
//                                         } else if (billLikePaymentAddr) {
//                                           setSelectedSubDistrictForPayment(
//                                             selectedValue
//                                           );
//                                         } else {
//                                           setSelectedSubDistrictForBilling(
//                                             selectedValue
//                                           );
//                                         }
//                                         resetShowBillingAddress();
//                                       }}
//                                     >
//                                       <option value="">เลือกตำบล / แขวง</option>
//                                       {(billLikeCardAddr
//                                         ? getSubDistrict
//                                         : billLikeInstallAddr
//                                           ? getSubDistrictForInstall
//                                           : billLikePaymentAddr
//                                             ? getSubDistrictForPayment
//                                             : getSubDistrictForBilling
//                                       ).map((item) => (
//                                         <option
//                                           key={item.SUBDISTRICTCODE}
//                                           value={item.SUBDISTRICTCODE}
//                                         >
//                                           {item.SUBDISTRICTNAME}
//                                         </option>
//                                       ))}
//                                     </select>
//                                   </div>

//                                   {/* รหัสไปรษณีย์ */}
//                                   <div className="col-lg-4 mb-3">
//                                     <label
//                                       className={`form-label ${styles.label}`}
//                                     >
//                                       รหัสไปรษณีย์
//                                     </label>
//                                     <input
//                                       type="text"
//                                       className={`form-control ${styles.label}`}
//                                       value={
//                                         billLikeCardAddr
//                                           ? selectedZipcode
//                                           : billLikeInstallAddr
//                                             ? selectedZipcodeForInstall
//                                             : billLikePaymentAddr
//                                               ? selectedZipcodeForPayment
//                                               : selectedZipcodeForBilling
//                                       }
//                                       readOnly
//                                       style={{
//                                         backgroundColor: "#d7dbde",
//                                       }}
//                                     />
//                                   </div>

//                                   <div className="col-lg-4 mb-3">
//                                     <label
//                                       className={`form-label ${styles.label}`}
//                                     >
//                                       เบอร์ที่ติดต่อได้
//                                     </label>
//                                     <input
//                                       value={(
//                                         addressPhoneForBilling || ""
//                                       ).replace(/-/g, "")}
//                                       onChange={(e) => {
//                                         setAddressPhoneForBilling(
//                                           e.target.value
//                                         );
//                                         resetShowBillingAddress();
//                                       }}
//                                       type="text"
//                                       className={`form-control ${styles.label}`}
//                                       maxLength={10}
//                                       inputMode="numeric"
//                                       pattern="[0-9]*"
//                                     />
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </form>
//                           {/* end form */}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}

//               <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
//                 <button
//                   onClick={() =>
//                     navigate("/sale/update/updateCustDetail", {
//                       state: {
//                         ...matchedItem,
//                       },
//                     })
//                   }
//                   className={`${styles.btnSecondary}`}
//                   type="button"
//                 >
//                   แก้ไขข้อมูลลูกค้า
//                 </button>
//                 <button
//                   onClick={handleSubmit(onSubmit)}
//                   className={`${styles.btnPrimary}`}
//                   type="button"
//                 >
//                   ถัดไป
//                 </button>
//               </div>

//               {/* ปุ่มในหน้าจอเล็ก */}
//               <div
//                 className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
//                 style={{
//                   position: "fixed",
//                   bottom: 0,
//                   left: 0,
//                   right: 0,
//                   zIndex: 1050,
//                 }}
//               >
//                 <button
//                   className={`${styles.btnSecondary}`}
//                   onClick={() =>
//                     navigate("/sale/update/updateCustDetail", {
//                       state: {
//                         ...matchedItem,
//                       },
//                     })
//                   }
//                   type="button"
//                 >
//                   แก้ไขข้อมูลลูกค้า
//                 </button>
//                 <button
//                   className={`${styles.btnPrimary}`}
//                   onClick={handleSubmit(onSubmit)}
//                   type="button"
//                 >
//                   ถัดไป
//                 </button>
//               </div>
//             </form>
//             {/* End accordion ที่อยู่ลูกค้า (ใบกำกับภาษี)*/}
//           </Content>
//         </>
//       )}
//     </>
//   );
// };

// export default SalesCreateAddress;



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
import { ThreeDot } from "react-loading-indicators";

const SalesCreateAddress: React.FC = () => {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const { REFNO } = useUUIDStore();
  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || "";
  const TeamSale = auth?.data?.[0]?.TeamSale || "";
  const SaleCode = auth?.data?.[0]?.SaleCode || "";
  const SupEmpId = auth?.data?.[0]?.SupEmp || "";
  const SecEmpId = auth?.data?.[0]?.SecEmp || "";

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}&ProcessType=${auth.processtype}`;
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

  const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
  const CUSTOMER_TYPE_URL = `${API_SALECONNEXT}/GetCustomertype`;
  const PROVINCE_URL = `${API_SALECONNEXT}/GetAddress/Province`;
  const DISTRICT_URL = `${API_SALECONNEXT}/GetAddress/District`;
  const SUBDISTRICT_URL = `${API_SALECONNEXT}/GetAddress/SubDistrict`;
  const ZIPCODE_URL = `${API_SALECONNEXT}/GetAddress/Zipcode`;

  const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false);
  const [draft, setDraft] = useState<any[]>([]);
  // console.log(`draft`, draft);

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
  // console.log(`matchedItem`, matchedItem);

  // ที่อยู่ลูกค้า ตามบัตร
  const [getProvince, setGetProvince] = useState<any[]>([]);
  const [getDistrict, setGetDistrict] = useState<any[]>([]);
  const [getSubDistrict, setGetSubDistrict] = useState<any[]>([]);
  const [getZipcode, setGetZipcode] = useState<any[]>([]);

  // สร้าง state สำหรับ "ที่อยู่ลูกค้า (ตามบัตร)
  const [addressNumber, setAddressNumber] = useState<string>("");
  const [addressMoo, setAddressMoo] = useState<string>("");
  const [addressSoi, setAddressSoi] = useState<string>("");
  const [addressRoad, setAddressRoad] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<number>();
  // console.log(`selectedProvince`, selectedProvince);

  const [selectedDistrict, setSelectedDistrict] = useState<number>();
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<number>();
  const [selectedZipcode, setSelectedZipcode] = useState<string>("");
  const [addressPhone, setAddressPhone] = useState<string>("");
  const [useThisTax, setUseThisTax] = useState<string>("FALSE");

  // ที่อยู่ลูกค้า ติดตั้ง
  const [getProvinceForInstall, setGetProvinceForInstall] = useState<any[]>([]);
  const [getDistrictForInstall, setGetDistrictForInstall] = useState<any[]>([]);
  const [getSubDistrictForInstall, setGetSubDistrictForInstall] = useState<
    any[]
  >([]);
  const [getZipcodeForInstall, setGetZipcodeForInstall] = useState<any[]>([]);

  // สร้าง state สำหรับ "ที่อยู่ลูกค้า (ติดตั้ง)
  const [addressNumberForInstall, setAddressNumberForInstall] =
    useState<string>("");
  // console.log(`addressNumberForInstall`, addressNumberForInstall);
  const [addressMooForInstall, setAddressMooForInstall] = useState<string>("");
  const [addressSoiForInstall, setAddressSoiForInstall] = useState<string>("");
  const [addressRoadForInstall, setAddressRoadForInstall] =
    useState<string>("");
  const [selectedProvinceForInstall, setSelectedProvinceForInstall] = useState<
    number | undefined
  >();
  const [selectedDistrictForInstall, setSelectedDistrictForInstall] = useState<
    number | undefined
  >();
  const [selectedSubDistrictForInstall, setSelectedSubDistrictForInstall] =
    useState<number | undefined>();
  const [selectedZipcodeForInstall, setSelectedZipcodeForInstall] =
    useState<string>("");
  const [addressPhoneForInstall, setAddressPhoneForInstall] =
    useState<string>("");

  // ที่อยู่ลูกค้า เก็บเงิน
  const [getProvinceForPayment, setGetProvinceForPayment] = useState<any[]>([]);
  const [getDistrictForPayment, setGetDistrictForPayment] = useState<any[]>([]);
  const [getSubDistrictForPayment, setGetSubDistrictForPayment] = useState<
    any[]
  >([]);
  const [getZipcodeForPayment, setGetZipcodeForPayment] = useState<any[]>([]);

  // สร้าง state สำหรับ "ที่อยู่ลูกค้า (เก็บเงิน)
  const [addressNumberForPayment, setAddressNumberForPayment] =
    useState<string>("");
  // console.log(`addressNumberForPayment`, addressNumberForPayment);

  const [addressMooForPayment, setAddressMooForPayment] = useState<string>("");
  const [addressSoiForPayment, setAddressSoiForPayment] = useState<string>("");
  const [addressRoadForPayment, setAddressRoadForPayment] =
    useState<string>("");
  const [selectedProvinceForPayment, setSelectedProvinceForPayment] = useState<
    number | undefined
  >();
  const [selectedDistrictForPayment, setSelectedDistrictForPayment] = useState<
    number | undefined
  >();
  const [selectedSubDistrictForPayment, setSelectedSubDistrictForPayment] =
    useState<number | undefined>();
  const [selectedZipcodeForPayment, setSelectedZipcodeForPayment] =
    useState<string>("");
  const [addressPhoneForPayment, setAddressPhoneForPayment] =
    useState<string>("");

  // สร้าง state สำหรับ "ที่อยู่ลูกค้า (ออกใบกำกับภาษี)
  const [showTaxAddress, setShowTaxAddress] = useState<boolean>(false);

  const [getProvinceForBilling, setGetProvinceForBilling] = useState<any[]>([]);
  const [getDistrictForBilling, setGetDistrictForBilling] = useState<any[]>([]);
  const [getSubDistrictForBilling, setGetSubDistrictForBilling] = useState<
    any[]
  >([]);
  const [getZipcodeForBilling, setGetZipcodeForBilling] = useState<any[]>([]);

  const [addressNumberForBilling, setAddressNumberForBilling] =
    useState<string>("");
  const [addressMooForBilling, setAddressMooForBilling] = useState<string>("");
  const [addressSoiForBilling, setAddressSoiForBilling] = useState<string>("");
  const [addressRoadForBilling, setAddressRoadForBilling] =
    useState<string>("");
  const [selectedProvinceForBilling, setSelectedProvinceForBilling] = useState<
    number | undefined
  >();
  const [selectedDistrictForBilling, setSelectedDistrictForBilling] = useState<
    number | undefined
  >();
  const [selectedSubDistrictForBilling, setSelectedSubDistrictForBilling] =
    useState<number | undefined>();
  const [selectedZipcodeForBilling, setSelectedZipcodeForBilling] =
    useState<string>("");
  const [addressPhoneForBilling, setAddressPhoneForBilling] =
    useState<string>("");

  // [ที่อยู่ลูกค้า (ตามบัตร)]
  const [likeAllAddr, setLikeAllAddr] = useState(false);

  // [ที่อยู่ลูกค้า (ติดตั้ง)]
  const [installLikeCardAddr, setInstallLikeCardAddr] = useState(false);

  // [ที่อยู่ลูกค้า (เก็บเงิน)]
  const [paymentLikeCardAddr, setPaymentLikeCardAddr] = useState(false);
  const [paymentLikeInstallAddr, setPaymentLikeInstallAddr] = useState(false);

  // [ที่อยู่ลูกค้า (ออกใบกำกับ)]
  const [billLikeCardAddr, setBillLikeCardAddr] = useState(false);
  const [billLikeInstallAddr, setBillLikeInstallAddr] = useState(false);
  const [billLikePaymentAddr, setBillLikePaymentAddr] = useState(false);

  const [showCustomerAddress, setShowCustomerAddress] = useState(false);
  const [showInstallAddress, setShowInstallAddress] = useState(false);
  const [showPaymentAddress, setShowPaymentAddress] = useState(false);

  const [loadingProvince, setLoadingProvince] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState(false);
  const [loadingSubDistrict, setLoadingSubDistrict] = useState(false);

  // 1) useEffect สำหรับ preload ที่อยู่ติดตั้ง
  useEffect(() => {
    if (!matchedItem?.CUSTOMERSTATUS?.[0]?.Contract) return;
    const contract = matchedItem.CUSTOMERSTATUS[0].Contract;
    const installAddr = Array.isArray(contract.Address)
      ? contract.Address.find(
        (a: any) => a.AddressTypeCode === "AddressIDCard"
      )
      : undefined;
    if (!installAddr) return;

    // สมมติ AddressDetail1 เก็บ "บ้านเลขที่ ซ.หมู่ฯ ถ.ฯ …"
    // จะเอาทั้งหมดไปช่อง บ้านเลขที่ ก่อน ถ้าอยากแยกให้ละเอียดอีกรอบก็ parse ต่อ
    setAddressNumber(installAddr.AddressDetail);
    setAddressMoo(installAddr.AddressDetail2);
    setAddressSoi(installAddr.AddressDetail3);
    setAddressRoad(installAddr.AddressDetail4);

    // เบอร์โทร (ถ้ามี TelMobile ใช้ ถ้าไม่มีก็กด TelHome)
    const rawPhone = installAddr.TelMobile || installAddr.TelHome || "";
    // setAddressPhone(rawPhone.replace(/-/g, ""));

    // province / district / subdistrict / zipcode
    // ต้องแม็ปกับ list ที่คุณโหลดมา (getProvince, getDistrict, getSubDistrict)
    const prov = getProvince.find(
      (p) => p.PROVINCENAME === installAddr.Province
    );
    if (prov) setSelectedProvince(Number(prov.PROVINCECODE));

    // หลังจาก setSelectedProvince แล้ว useEffect อื่นจะไป fetch district มาให้
    // เมื่อ getDistrict มาแล้ว ก็แม็ปชื่อกลับไป

    setValue("homeNoIdCard", installAddr.AddressDetail || "");
    setValue("provinceIdCard", selectedProvince?.toString() || "");
    setValue("districtIdCard", selectedDistrict?.toString() || "");
    setValue("subDistrictIdCard", selectedSubDistrict?.toString() || "");
    setValue("telNoIdCard", rawPhone);
  }, [matchedItem, getProvince]);

  // 2) useEffect รอ district list (getDistrict) แล้วแม็ปชื่อ
  useEffect(() => {
    if (!matchedItem?.CUSTOMERSTATUS?.[0]?.Contract || !selectedProvince)
      return;
    const contract = matchedItem.CUSTOMERSTATUS[0].Contract;
    const installAddr = contract.Address.find(
      (a: any) => a.AddressTypeCode === "AddressIDCard"
    );
    if (!installAddr) return;
    const dist = getDistrict.find(
      (d) => d.DISTRICTNAME === installAddr.District
    );
    if (dist) setSelectedDistrict(Number(dist.DISTRICTCODE));
  }, [getDistrict, matchedItem, selectedProvince]);

  // 3) useEffect รอ subdistrict list (getSubDistrict) แล้วแม็ปชื่อ
  useEffect(() => {
    if (!matchedItem?.CUSTOMERSTATUS?.[0]?.Contract || !selectedDistrict)
      return;
    const contract = matchedItem.CUSTOMERSTATUS[0].Contract;
    const installAddr = contract.Address.find(
      (a: any) => a.AddressTypeCode === "AddressIDCard"
    );
    if (!installAddr) return;
    const sub = getSubDistrict.find(
      (s) => s.SUBDISTRICTNAME === installAddr.SubDistrict
    );
    if (sub) {
      setSelectedSubDistrict(Number(sub.SUBDISTRICTCODE));
      setSelectedZipcode(installAddr.Zipcode); // zip มักมาแล้ว
    }
  }, [getSubDistrict, matchedItem, selectedDistrict]);

  ////////////////////// ที่อยู่ตามบัตร

  // 1) useEffect สำหรับ preload ที่อยู่ตามบัตร
  useEffect(() => {
    if (!matchedItem?.CUSTOMERSTATUS?.[0]?.Contract) return;
    const contract = matchedItem.CUSTOMERSTATUS[0].Contract;
    // หา AddressIDCard (index 0)
    const cardAddr = Array.isArray(contract.Address)
      ? contract.Address.find((a: any) => a.AddressTypeCode === "AddressIDCard")
      : undefined;
    if (!cardAddr) return;

    // เบอร์โทร
    const rawPhone = cardAddr.TelMobile || cardAddr.TelHome || "";
    // setAddressPhoneForInstall(rawPhone.replace(/-/g, ""));

    // จากตรงนี้จะรอ useEffect ข้างล่างแม็ปจังหวัด → อำเภอ → ตำบล ให้อัตโนมัติ
  }, [matchedItem]);

  // 2) useEffect รอ district list (getDistrict) แล้วแม็ปชื่อ
  useEffect(() => {
    if (!matchedItem?.CUSTOMERSTATUS?.[0]?.Contract || !selectedProvince)
      return;
    const contract = matchedItem.CUSTOMERSTATUS[0].Contract;
    const cardAddr = contract.Address.find(
      (a: any) => a.AddressTypeCode === "AddressIDCard"
    );
    if (!cardAddr) return;
    const dist = getDistrictForInstall.find(
      (d) => d.DISTRICTNAME === cardAddr.District
    );
    if (dist) setSelectedDistrictForInstall(Number(dist.DISTRICTCODE));
  }, [getDistrictForInstall, matchedItem, selectedProvinceForInstall]);

  // 3) useEffect รอ subdistrict list (getSubDistrict) แล้วแม็ปชื่อ
  useEffect(() => {
    if (!matchedItem?.CUSTOMERSTATUS?.[0]?.Contract || !selectedDistrict)
      return;
    const contract = matchedItem.CUSTOMERSTATUS[0].Contract;
    const cardAddr = contract.Address.find(
      (a: any) => a.AddressTypeCode === "AddressIDCard"
    );
    if (!cardAddr) return;
    const sub = getSubDistrictForInstall.find(
      (s) => s.SUBDISTRICTNAME === cardAddr.SubDistrict
    );
    if (sub) {
      setSelectedSubDistrictForInstall(Number(sub.SUBDISTRICTCODE));
      setSelectedZipcodeForInstall(cardAddr.Zipcode); // zip มักมาแล้ว
    }
  }, [getSubDistrictForInstall, matchedItem, selectedDistrictForInstall]);

  /////////////////////////////////

  // GET Province
  useEffect(() => {
    const getData = async () => {
      try {
        setLoadingProvince(true);
        const response = await axios.get(PROVINCE_URL, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setGetProvince(response.data);
      } catch (error) {
        console.error("Error fetching CUSTOMER_TYPE_URL:", error);
      } finally {
        setLoadingProvince(false);
      }
    };
    getData();
  }, []);

  // GET Province For Install
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(PROVINCE_URL, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setGetProvinceForInstall(response.data);
      } catch (error) {
        console.error("Error fetching CUSTOMER_TYPE_URL:", error);
      }
    };
    getData();
  }, []);

  // GET Province For Payment
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(PROVINCE_URL, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setGetProvinceForPayment(response.data);
      } catch (error) {
        console.error("Error fetching CUSTOMER_TYPE_URL:", error);
      }
    };
    getData();
  }, []);

  // GET Province For Billing tax
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(PROVINCE_URL, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setGetProvinceForBilling(response.data);
      } catch (error) {
        console.error("Error fetching CUSTOMER_TYPE_URL:", error);
      }
    };
    getData();
  }, []);

  // POST District
  useEffect(() => {
    const getData = async () => {
      if (selectedProvince) {
        // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
        try {
          setLoadingDistrict(true);
          const response = await axios.post(
            DISTRICT_URL,
            { ProvinceCode: selectedProvince },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setGetDistrict(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
        } catch (error) {
          console.error("Error fetching DISTRICT_URL:", error);
        } finally {
          setLoadingDistrict(false);
        }
      } else {
        setGetDistrict([]); // ล้างข้อมูล district เมื่อไม่ได้เลือก province
      }
    };
    getData();
  }, [selectedProvince]);

  // POST District For Install
  useEffect(() => {
    const getData = async () => {
      if (selectedProvinceForInstall) {
        // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
        try {
          const response = await axios.post(
            DISTRICT_URL,
            { ProvinceCode: selectedProvinceForInstall },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setGetDistrictForInstall(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
        } catch (error) {
          console.error("Error fetching DISTRICT_URL:", error);
        }
      } else {
        setGetDistrictForInstall([]); // ล้างข้อมูล district เมื่อไม่ได้เลือก province
      }
    };
    getData();
  }, [selectedProvinceForInstall]);

  // POST District For Payment
  useEffect(() => {
    const getData = async () => {
      if (selectedProvinceForPayment) {
        // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
        try {
          const response = await axios.post(
            DISTRICT_URL,
            { ProvinceCode: selectedProvinceForPayment },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setGetDistrictForPayment(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
        } catch (error) {
          console.error("Error fetching DISTRICT_URL:", error);
        }
      } else {
        setGetDistrictForPayment([]); // ล้างข้อมูล district เมื่อไม่ได้เลือก province
      }
    };
    getData();
  }, [selectedProvinceForPayment]);

  // POST District For Billing tax
  useEffect(() => {
    const getData = async () => {
      if (selectedProvinceForBilling) {
        // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
        try {
          const response = await axios.post(
            DISTRICT_URL,
            { ProvinceCode: selectedProvinceForBilling },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setGetDistrictForBilling(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
        } catch (error) {
          console.error("Error fetching DISTRICT_URL:", error);
        }
      } else {
        setGetDistrictForBilling([]); // ล้างข้อมูล district เมื่อไม่ได้เลือก province
      }
    };
    getData();
  }, [selectedProvinceForBilling]);

  // POST SubDistrict
  useEffect(() => {
    const fetchSubDistricts = async () => {
      if (selectedDistrict) {
        try {
          setLoadingSubDistrict(true);
          const response = await axios.post(
            SUBDISTRICT_URL,
            { DistrictCode: selectedDistrict },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setGetSubDistrict(response.data);
        } catch (error) {
          console.error("Error fetching SUBDISTRICT_URL:", error);
        } finally {
          setLoadingSubDistrict(false);
        }
      } else {
        setGetSubDistrict([]);
      }
    };
    fetchSubDistricts();
  }, [selectedDistrict]);

  // POST SubDistrict For Install
  useEffect(() => {
    const fetchSubDistricts = async () => {
      if (selectedDistrictForInstall) {
        try {
          const response = await axios.post(
            SUBDISTRICT_URL,
            { DistrictCode: selectedDistrictForInstall },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setGetSubDistrictForInstall(response.data);
        } catch (error) {
          console.error("Error fetching SUBDISTRICT_URL:", error);
        }
      } else {
        setGetSubDistrictForInstall([]);
      }
    };
    fetchSubDistricts();
  }, [selectedDistrictForInstall]);

  // POST SubDistrict For Payment
  useEffect(() => {
    const fetchSubDistricts = async () => {
      if (selectedDistrictForPayment) {
        try {
          const response = await axios.post(
            SUBDISTRICT_URL,
            { DistrictCode: selectedDistrictForPayment },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setGetSubDistrictForPayment(response.data);
        } catch (error) {
          console.error("Error fetching SUBDISTRICT_URL:", error);
        }
      } else {
        setGetSubDistrictForPayment([]);
      }
    };
    fetchSubDistricts();
  }, [selectedDistrictForPayment]);

  // POST SubDistrict For Billing tax
  useEffect(() => {
    const fetchSubDistricts = async () => {
      if (selectedDistrictForBilling) {
        try {
          const response = await axios.post(
            SUBDISTRICT_URL,
            { DistrictCode: selectedDistrictForBilling },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setGetSubDistrictForBilling(response.data);
        } catch (error) {
          console.error("Error fetching SUBDISTRICT_URL:", error);
        }
      } else {
        setGetSubDistrictForBilling([]);
      }
    };
    fetchSubDistricts();
  }, [selectedDistrictForBilling]);

  // POST Zipcode
  useEffect(() => {
    const getZipcode = async () => {
      if (selectedSubDistrict) {
        try {
          const response = await axios.post(
            ZIPCODE_URL,
            { SubDistrictCode: selectedSubDistrict },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.data.length > 0) {
            setSelectedZipcode(response.data[0].POSTCODE); // อัปเดตรหัสไปรษณีย์ใน state
          }
        } catch (error) {
          console.error("Error fetching ZIPCODE_URL:", error);
        }
      } else {
        setSelectedZipcode(""); // เคลียร์ข้อมูลรหัสไปรษณีย์เมื่อไม่เลือกตำบล
      }
    };
    getZipcode();
  }, [selectedSubDistrict]);

  // POST Zipcode For Install
  useEffect(() => {
    const getZipcode = async () => {
      if (selectedSubDistrictForInstall) {
        try {
          const response = await axios.post(
            ZIPCODE_URL,
            { SubDistrictCode: selectedSubDistrictForInstall },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.data.length > 0) {
            setSelectedZipcodeForInstall(response.data[0].POSTCODE); // อัปเดตรหัสไปรษณีย์ใน state
          }
        } catch (error) {
          console.error("Error fetching ZIPCODE_URL:", error);
        }
      } else {
        setSelectedZipcodeForInstall(""); // เคลียร์ข้อมูลรหัสไปรษณีย์เมื่อไม่เลือกตำบล
      }
    };
    getZipcode();
  }, [selectedSubDistrictForInstall]);

  // POST Zipcode For Payment
  useEffect(() => {
    const getZipcode = async () => {
      if (selectedSubDistrictForPayment) {
        try {
          const response = await axios.post(
            ZIPCODE_URL,
            { SubDistrictCode: selectedSubDistrictForPayment },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.data.length > 0) {
            setSelectedZipcodeForPayment(response.data[0].POSTCODE); // อัปเดตรหัสไปรษณีย์ใน state
          }
        } catch (error) {
          console.error("Error fetching ZIPCODE_URL:", error);
        }
      } else {
        setSelectedZipcodeForPayment(""); // เคลียร์ข้อมูลรหัสไปรษณีย์เมื่อไม่เลือกตำบล
      }
    };
    getZipcode();
  }, [selectedSubDistrictForPayment]);

  // POST Zipcode For Billing tax
  useEffect(() => {
    const getZipcode = async () => {
      if (selectedSubDistrictForBilling) {
        try {
          const response = await axios.post(
            ZIPCODE_URL,
            { SubDistrictCode: selectedSubDistrictForBilling },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.data.length > 0) {
            setSelectedZipcodeForBilling(response.data[0].POSTCODE); // อัปเดตรหัสไปรษณีย์ใน state
          }
        } catch (error) {
          console.error("Error fetching ZIPCODE_URL:", error);
        }
      } else {
        setSelectedZipcodeForBilling(""); // เคลียร์ข้อมูลรหัสไปรษณีย์เมื่อไม่เลือกตำบล
      }
    };
    getZipcode();
  }, [selectedSubDistrictForBilling]);

  // ที่อยู่ลูกค้า (ตามบัตร)
  const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    // console.log(`test`, value);
    setSelectedProvince(value);

    // Reset district, subdistrict, and zipcode
    setSelectedDistrict(undefined);
    setSelectedSubDistrict(undefined);
    setSelectedZipcode("");
  };

  const handleDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setSelectedDistrict(value);
    // Reset subdistrict and zipcode
    setSelectedSubDistrict(undefined);
    setSelectedZipcode("");
  };

  const handleSubDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setSelectedSubDistrict(value);
    // Reset zipcode
    setSelectedZipcode("");
  };

  // ที่อยู่ลูกค้า (ติดตั้ง)
  const handleProvinceChangeForInstall = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const value = Number(e.target.value);
    setSelectedProvinceForInstall(value);
    // Reset district, subdistrict, and zipcode
    setSelectedDistrictForInstall(undefined);
    setSelectedSubDistrictForInstall(undefined);
    setSelectedZipcodeForInstall("");
  };

  const handleDistrictChangeForInstall = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const value = Number(e.target.value);
    setSelectedDistrictForInstall(value);
    // Reset subdistrict and zipcode
    setSelectedSubDistrictForInstall(undefined);
    setSelectedZipcodeForInstall("");
  };

  const handleSubDistrictChangeForInstall = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const value = Number(e.target.value);
    setSelectedSubDistrictForInstall(value);
    // Reset zipcode
    setSelectedZipcodeForInstall("");
  };

  // ที่อยู่ลูกค้า (เก็บเงิน)
  const handleProvinceChangeForPayment = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const value = Number(e.target.value);
    setSelectedProvinceForPayment(value);
    // Reset district, subdistrict, and zipcode
    setSelectedDistrictForPayment(undefined);
    setSelectedSubDistrictForPayment(undefined);
    setSelectedZipcodeForPayment("");
  };

  const handleDistrictChangeForPayment = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const value = Number(e.target.value);
    setSelectedDistrictForPayment(value);
    // Reset subdistrict and zipcode
    setSelectedSubDistrictForPayment(undefined);
    setSelectedZipcodeForPayment("");
  };

  const handleSubDistrictChangeForPayment = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const value = Number(e.target.value);
    setSelectedSubDistrictForPayment(value);
    // Reset zipcode
    setSelectedZipcodeForPayment("");
  };

  // จัดการติ้กใน accordion ที่อยู่ลูกค้า (ตามบัตร)
  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    if (name === "allAddress") {
      setLikeAllAddr(checked);

      if (checked) {
        setAddressNumberForInstall(addressNumber);
        setAddressMooForInstall(addressMoo);
        setAddressSoiForInstall(addressSoi);
        setAddressRoadForInstall(addressRoad);
        setSelectedProvinceForInstall(selectedProvince);
        setSelectedDistrictForInstall(selectedDistrict);
        setSelectedSubDistrictForInstall(selectedSubDistrict);
        setSelectedZipcodeForInstall(selectedZipcode);
        setAddressPhoneForInstall(addressPhone);

        setAddressNumberForPayment(addressNumber);
        setAddressMooForPayment(addressMoo);
        setAddressSoiForPayment(addressSoi);
        setAddressRoadForPayment(addressRoad);
        setSelectedProvinceForPayment(selectedProvince);
        setSelectedDistrictForPayment(selectedDistrict);
        setSelectedSubDistrictForPayment(selectedSubDistrict);
        setSelectedZipcodeForPayment(selectedZipcode);
        setAddressPhoneForPayment(addressPhone);
      }

      // อัปเดตค่าใน RHF ของ accordion “ตามบัตร”
      setValue("homeNoIdCard", addressNumber, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("provinceIdCard", String(selectedProvince), {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("districtIdCard", String(selectedDistrict), {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("subDistrictIdCard", String(selectedSubDistrict), {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("telNoIdCard", addressPhone, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue("homeNoInstall", addressNumber, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("provinceInstall", String(selectedProvince), {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("districtInstall", String(selectedDistrict), {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("subDistrictInstall", String(selectedSubDistrict), {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("homeNoPayment", addressNumber, { shouldValidate: true, shouldDirty: true });
      setValue("provincePayment", String(selectedProvince ?? ""), { shouldValidate: true, shouldDirty: true });
      setValue("districtPayment", String(selectedDistrict ?? ""), { shouldValidate: true, shouldDirty: true });
      setValue("subDistrictPayment", String(selectedSubDistrict ?? ""), { shouldValidate: true, shouldDirty: true });

      // ล้างข้อผิดพลาดของทุกฟิลด์ใน accordion “ตามบัตร” และ “ติดตั้ง”
      clearErrors([
        "homeNoIdCard",
        "provinceIdCard",
        "districtIdCard",
        "subDistrictIdCard",
        "telNoIdCard",

        // เพิ่มส่วนนี้เพื่อเคลียร์ error ใน accordion “ติดตั้ง”
        "homeNoInstall",
        "provinceInstall",
        "districtInstall",
        "subDistrictInstall",

        "homeNoPayment",
        "provincePayment",
        "districtPayment",
        "subDistrictPayment",
      ]);
    }

    if (name === "likeAddressCard") {
      setInstallLikeCardAddr(checked);

      if (checked) {
        // คัดลอกข้อมูลจากที่อยู่ตามบัตร ไปยังที่อยู่ติดตั้ง
        setAddressNumberForInstall(addressNumber);
        setAddressMooForInstall(addressMoo);
        setAddressSoiForInstall(addressSoi);
        setAddressRoadForInstall(addressRoad);
        setSelectedProvinceForInstall(selectedProvince);
        setSelectedDistrictForInstall(selectedDistrict);
        setSelectedSubDistrictForInstall(selectedSubDistrict);
        setSelectedZipcodeForInstall(selectedZipcode);
        setAddressPhoneForInstall(addressPhone);
      }

      setValue("homeNoInstall", addressNumber, {
        shouldDirty: true, // mark ว่าฟิลด์นี้เปลี่ยนแล้ว
        shouldValidate: true, // สั่งให้ validate ใหม่
      });
      setValue("provinceInstall", String(selectedProvince), {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("districtInstall", String(selectedDistrict), {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("subDistrictInstall", String(selectedSubDistrict), {
        shouldDirty: true,
        shouldValidate: true,
      });

      // ลบข้อผิดพลาดเก่าๆ ถ้ามี
      clearErrors([
        "homeNoInstall",
        "provinceInstall",
        "districtInstall",
        "subDistrictInstall",
      ]);
    }

    if (name === "paymentLikeAddressCard") {
      // setShowPaymentAddress(checked);
      setPaymentLikeCardAddr(checked);
      setPaymentLikeInstallAddr(false);

      if (checked) {
        // คัดลอกข้อมูลจากที่อยู่ตามบัตร ไปยังที่อยู่เก็บเงิน
        setAddressNumberForPayment(addressNumber);
        setAddressMooForPayment(addressMoo);
        setAddressSoiForPayment(addressSoi);
        setAddressRoadForPayment(addressRoad);
        setSelectedProvinceForPayment(selectedProvince);
        setSelectedDistrictForPayment(selectedDistrict);
        setSelectedSubDistrictForPayment(selectedSubDistrict);
        setSelectedZipcodeForPayment(selectedZipcode);
        setAddressPhoneForPayment(addressPhone);
      }

      // ✅ sync เข้า RHF (สำคัญสำหรับ required)
      setValue("homeNoPayment", addressNumber, { shouldValidate: true, shouldDirty: true });
      setValue("provincePayment", String(selectedProvince ?? ""), { shouldValidate: true, shouldDirty: true });
      setValue("districtPayment", String(selectedDistrict ?? ""), { shouldValidate: true, shouldDirty: true });
      setValue("subDistrictPayment", String(selectedSubDistrict ?? ""), { shouldValidate: true, shouldDirty: true });
      // setValue("telNoPayment", addressPhone, { shouldValidate: true, shouldDirty: true });

      clearErrors(["homeNoPayment", "provincePayment", "districtPayment", "subDistrictPayment"/*,"telNoPayment"*/]);
    }

    if (name === "paymentLikeAddressInstall") {
      // setShowPaymentAddress(checked);
      setPaymentLikeCardAddr(false);
      setPaymentLikeInstallAddr(checked);

      if (checked) {
        // คัดลอกข้อมูลจากที่อยู่ตามบัตร ไปยังที่อยู่เก็บเงิน
        setAddressNumberForPayment(addressNumberForInstall);
        setAddressMooForPayment(addressMooForInstall);
        setAddressSoiForPayment(addressSoiForInstall);
        setAddressRoadForPayment(addressRoadForInstall);
        setSelectedProvinceForPayment(selectedProvinceForInstall);
        setSelectedDistrictForPayment(selectedDistrictForInstall);
        setSelectedSubDistrictForPayment(selectedSubDistrictForInstall);
        setSelectedZipcodeForPayment(selectedZipcodeForInstall);
        setAddressPhoneForPayment(addressPhoneForInstall);
      }

      setValue("homeNoPayment", addressNumberForInstall, { shouldValidate: true, shouldDirty: true });
      setValue("provincePayment", String(selectedProvinceForInstall ?? ""), { shouldValidate: true, shouldDirty: true });
      setValue("districtPayment", String(selectedDistrictForInstall ?? ""), { shouldValidate: true, shouldDirty: true });
      setValue("subDistrictPayment", String(selectedSubDistrictForInstall ?? ""), { shouldValidate: true, shouldDirty: true });
      // setValue("telNoPayment", addressPhoneForInstall, { shouldValidate: true, shouldDirty: true });

      clearErrors(["homeNoPayment", "provincePayment", "districtPayment", "subDistrictPayment"/*,"telNoPayment"*/]);
    }

    if (name === "showInstallAddress") {
      setShowInstallAddress(checked);

      if (checked) {
        // คัดลอกข้อมูลจากที่อยู่ตามบัตร ไปยังที่อยู่ติดตั้ง
        setAddressNumberForInstall(addressNumber);
        setAddressMooForInstall(addressMoo);
        setAddressSoiForInstall(addressSoi);
        setAddressRoadForInstall(addressRoad);
        setSelectedProvinceForInstall(selectedProvince);
        setSelectedDistrictForInstall(selectedDistrict);
        setSelectedSubDistrictForInstall(selectedSubDistrict);
        setSelectedZipcodeForInstall(selectedZipcode);
        setAddressPhoneForInstall(addressPhone);
      }
    }

    if (name === "showPaymentAddress") {
      setShowPaymentAddress(checked);

      if (checked) {
        // คัดลอกข้อมูลจากที่อยู่ตามบัตร ไปยังที่อยู่เก็บเงิน
        setAddressNumberForPayment(addressNumber);
        setAddressMooForPayment(addressMoo);
        setAddressSoiForPayment(addressSoi);
        setAddressRoadForPayment(addressRoad);
        setSelectedProvinceForPayment(selectedProvince);
        setSelectedDistrictForPayment(selectedDistrict);
        setSelectedSubDistrictForPayment(selectedSubDistrict);
        setSelectedZipcodeForPayment(selectedZipcode);
        setAddressPhoneForPayment(addressPhone);
      }
    }

    if (name === "billLikeAddressCard") {
      setBillLikeCardAddr(checked);
      setBillLikeInstallAddr(false);
      setBillLikePaymentAddr(false);

      if (checked) {
        setAddressNumberForBilling(addressNumber);
        setAddressMooForBilling(addressMoo);
        setAddressSoiForBilling(addressSoi);
        setAddressRoadForBilling(addressRoad);
        setSelectedProvinceForBilling(selectedProvince);
        setSelectedDistrictForBilling(selectedDistrict);
        setSelectedSubDistrictForBilling(selectedSubDistrict);
        setSelectedZipcodeForBilling(selectedZipcode);
        setAddressPhoneForBilling(addressPhone);
      }
    }

    if (name === "billLikeAddressInstall") {
      setBillLikeCardAddr(false);
      setBillLikeInstallAddr(checked);
      setBillLikePaymentAddr(false);

      if (checked) {
        setAddressNumberForBilling(addressNumberForInstall);
        setAddressMooForBilling(addressMooForInstall);
        setAddressSoiForBilling(addressSoiForInstall);
        setAddressRoadForBilling(addressRoadForInstall);
        setSelectedProvinceForBilling(selectedProvinceForInstall);
        setSelectedDistrictForBilling(selectedDistrictForInstall);
        setSelectedSubDistrictForBilling(selectedSubDistrictForInstall);
        setSelectedZipcodeForBilling(selectedZipcodeForInstall);
        setAddressPhoneForBilling(addressPhoneForInstall);
      }
    }

    if (name === "billLikeAddressPayment") {
      setBillLikeCardAddr(false);
      setBillLikeInstallAddr(false);
      setBillLikePaymentAddr(checked);

      if (checked) {
        setAddressNumberForBilling(addressNumberForPayment);
        setAddressMooForBilling(addressMooForPayment);
        setAddressSoiForBilling(addressSoiForPayment);
        setAddressRoadForBilling(addressRoadForPayment);
        setSelectedProvinceForBilling(selectedProvinceForPayment);
        setSelectedDistrictForBilling(selectedDistrictForPayment);
        setSelectedSubDistrictForBilling(selectedSubDistrictForPayment);
        setSelectedZipcodeForBilling(selectedZipcodeForPayment);
        setAddressPhoneForBilling(addressPhoneForPayment);
      }
    }
  };

  // ฟังก์ชันเพื่อล้างการติ๊กใน  accordion อื่นๆ เมื่อมีการเปลี่ยนแปลงข้อมูลใน accordion ที่อยู่ลูกค้า (ตามบัตร)
  const resetShowAddressCard = () => {
    setLikeAllAddr(false);
    setInstallLikeCardAddr(false);
    setPaymentLikeInstallAddr(false);
    setPaymentLikeCardAddr(false);
    setBillLikePaymentAddr(false);
    setBillLikeCardAddr(false);
  };

  // ฟังก์ชันเพื่อล้างการติ๊กใน  accordion ที่อยู่ลูกค้า (ตามบัตร) เมื่อมีการเปลี่ยนแปลงข้อมูลใน accordion ที่อยู่ลูกค้า (ติดตั้ง)
  const resetShowInstallAddress = () => {
    setLikeAllAddr(false);
    setInstallLikeCardAddr(false);
    setPaymentLikeInstallAddr(false);
    setBillLikeInstallAddr(false);
  };

  // ฟังก์ชันเพื่อล้างการติ๊กใน  accordion ที่อยู่ลูกค้า (ตามบัตร) เมื่อมีการเปลี่ยนแปลงข้อมูลใน accordion ที่อยู่ลูกค้า (เก็บเงิน)
  const resetShowPaymentAddress = () => {
    setLikeAllAddr(false);
    setInstallLikeCardAddr(false);
    setPaymentLikeInstallAddr(false);
    setBillLikePaymentAddr(false);
  };

  // ฟังก์ชันเพื่อล้างการติ๊กใน  accordion อื่นๆ เมื่อมีการเปลี่ยนแปลงข้อมูลใน accordion ที่อยู่ลูกค้า (เก็บเงิน)
  const resetShowBillingAddress = () => {
    setLikeAllAddr(false);
    setBillLikeCardAddr(false);
    setBillLikeInstallAddr(false);
    setBillLikePaymentAddr(false);
  };

  {
    /*-------------------- Start Validate --------------------*/
  }
  const schema = yup.object().shape({
    //ที่อยู่ติดตั้ง
    homeNoIdCard: yup.string().required("กรุณากรอกบ้านเลขที่"),
    provinceIdCard: yup.string().required("กรุณาเลือกจังหวัด"),
    districtIdCard: yup.string().required("กรุณาเลือกอำเภอ / เขต"),
    subDistrictIdCard: yup.string().required("กรุณาเลือกตำบล / แขวง"),
    telNoIdCard: yup
      .string(),

    homeNoInstall: yup.string().required("กรุณากรอกบ้านเลขที่"),
    provinceInstall: yup.string().required("กรุณาเลือกจังหวัด"),
    districtInstall: yup.string().required("กรุณาเลือกอำเภอ / เขต"),
    subDistrictInstall: yup.string().required("กรุณาเลือกตำบล / แขวง"),

    // ✅ ที่อยู่เก็บเงิน (Require)
    homeNoPayment: yup.string().required("กรุณากรอกบ้านเลขที่"),
    provincePayment: yup.string().required("กรุณาเลือกจังหวัด"),
    districtPayment: yup.string().required("กรุณาเลือกอำเภอ / เขต"),
    subDistrictPayment: yup.string().required("กรุณาเลือกตำบล / แขวง"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange", // ตรวจสอบเมื่อมีการกรอกข้อมูล
    reValidateMode: "onChange", // ตรวจสอบซ้ำเมื่อมีการเปลี่ยนแปลงข้อมูล
    defaultValues: {
      //ที่อยู่ติดตั้ง
      homeNoIdCard: "",
      provinceIdCard: "",
      districtIdCard: "",
      subDistrictIdCard: "",
      telNoIdCard: "",

      homeNoInstall: "",
      provinceInstall: "",
      districtInstall: "",
      subDistrictInstall: "",

      homeNoPayment: "",
      provincePayment: "",
      districtPayment: "",
      subDistrictPayment: "",
    },
  });

  // ใน useEffect ที่ preload installation
  useEffect(() => {
    if (!matchedItem?.CUSTOMERSTATUS?.[0]?.Contract) return;
    const contract = matchedItem.CUSTOMERSTATUS[0].Contract;
    const installAddr = Array.isArray(contract.Address)
      ? contract.Address.find(
        (a: any) => a.AddressTypeCode === "AddressIDCard"
      )
      : undefined;
    if (!installAddr) return;

    // สกัดเบอร์โทร
    const rawPhone = installAddr.TelMobile || installAddr.TelHome || "";
    const cleaned = rawPhone.replace(/-/g, "");
    // setAddressPhone(cleaned);

    // **เติมบรรทัดนี้ เพื่อเซ็ตค่าให้ Controller**
    setValue("telNoIdCard", cleaned);

    // … (เซ็ต state อื่น ๆ ต่อ)
  }, [matchedItem, setValue]);

  // 1) โหลดจังหวัดครั้งเดียว
  useEffect(() => {
    axios
      .get(PROVINCE_URL)
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
            ? res.data.data
            : [];
        setGetProvince(list);
      })
      .catch(console.error);
  }, []);

  // 2) พอ getProvince มีข้อมูลแล้ว ให้แม็ปชื่อจาก matchedItem
  useEffect(() => {
    if (!matchedItem) return;
    const installAddr =
      matchedItem.CUSTOMERSTATUS?.[0]?.Contract?.Address?.find(
        (a: any) => a.AddressTypeCode === "AddressIDCard"
      );
    if (!installAddr || getProvince.length === 0) return;

    const rawProv = installAddr.Province?.trim();
    const prov = getProvince.find((p) => p.PROVINCENAME.trim() === rawProv);
    if (prov) {
      const code = Number(prov.PROVINCECODE);
      setSelectedProvince(code);
      setValue("provinceIdCard", prov.PROVINCECODE.toString());
    }
  }, [matchedItem, getProvince, setValue]);

  // 3) พอ selectedProvince เปลี่ยน → โหลดอำเภอ และแม็ปชื่อกลับจาก matchedItem
  useEffect(() => {
    if (!selectedProvince) return;
    const form = new FormData();
    form.append("ProvinceCode", String(selectedProvince));
    axios
      .post(DISTRICT_URL, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
            ? res.data.data
            : [];
        setGetDistrict(list);

        // แม็ปอำเภอจาก matchedItem
        const installAddr =
          matchedItem.CUSTOMERSTATUS?.[0]?.Contract?.Address?.find(
            (a: any) => a.AddressTypeCode === "AddressIDCard"
          );
        if (!installAddr) return;

        const rawAmp = installAddr.Amphur?.replace(/^อ\.\s*/, "").trim();
        const dist = list.find((d: any) => d.DISTRICTNAME.trim() === rawAmp);
        if (dist) {
          setSelectedDistrict(Number(dist.DISTRICTCODE));
          setValue("districtIdCard", dist.DISTRICTCODE.toString());
        }
      })
      .catch(console.error);
  }, [selectedProvince, matchedItem, setValue]);

  // 4) พอ selectedDistrict เปลี่ยน → โหลดตำบล และแม็ปชื่อกลับจาก matchedItem
  useEffect(() => {
    if (!selectedDistrict) return;
    const form = new FormData();
    form.append("DistrictCode", String(selectedDistrict));
    axios
      .post(SUBDISTRICT_URL, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
            ? res.data.data
            : [];
        setGetSubDistrict(list);

        // หา AddressInstall
        const idCardAddr =
          matchedItem?.CUSTOMERSTATUS?.[0]?.Contract?.Address?.find(
            (a: any) => a.AddressTypeCode === "AddressIDCard"
          );
        if (!idCardAddr) return;

        // ตัด prefix "ต." ออก
        const rawSub = (idCardAddr.District ?? "")
          .replace(/^ต\.\s*/, "")
          .trim();

        // แม็ปชื่อตำบลกลับเข้า list
        const sub = list.find((s: any) => s.SUBDISTRICTNAME.trim() === rawSub);
        if (sub) {
          setSelectedSubDistrict(Number(sub.SUBDISTRICTCODE));
          // ถ้าใช้ RHF
          setValue("subDistrictIdCard", sub.SUBDISTRICTCODE.toString());
        }
      })
      .catch(console.error);
  }, [selectedDistrict, matchedItem, setValue]);

  {
    /*-------------------- End Validate --------------------*/
  }

  const SaveAddressData = useMemo(() => {
    const province = getProvince.find(
      (p) => String(p.PROVINCECODE) === String(selectedProvince)
    );
    const district = getDistrict.find(
      (p) => String(p.DISTRICTCODE) === String(selectedDistrict)
    );
    const subDistrict = getSubDistrict.find(
      (p) => String(p.SUBDISTRICTCODE) === String(selectedSubDistrict)
    );

    const provinceForInstall = getProvinceForInstall.find(
      (p) => String(p.PROVINCECODE) === String(selectedProvinceForInstall)
    );
    const districtForInstall = getDistrictForInstall.find(
      (p) => String(p.DISTRICTCODE) === String(selectedDistrictForInstall)
    );
    const subDistrictForInstall = getSubDistrictForInstall.find(
      (p) => String(p.SUBDISTRICTCODE) === String(selectedSubDistrictForInstall)
    );

    const provinceForPayment = getProvinceForPayment.find(
      (p) => String(p.PROVINCECODE) === String(selectedProvinceForPayment)
    );
    const districtForPayment = getDistrictForPayment.find(
      (p) => String(p.DISTRICTCODE) === String(selectedDistrictForPayment)
    );
    const subDistrictForPayment = getSubDistrictForPayment.find(
      (p) => String(p.SUBDISTRICTCODE) === String(selectedSubDistrictForPayment)
    );

    const provinceForBilling = getProvince.find(
      (p) => String(p.PROVINCECODE) === String(selectedProvinceForBilling)
    );
    const districtForBilling = getDistrictForBilling.find(
      (p) => String(p.DISTRICTCODE) === String(selectedDistrictForBilling)
    );
    const subDistrictForBilling = getSubDistrictForBilling.find(
      (p) => String(p.SUBDISTRICTCODE) === String(selectedSubDistrictForBilling)
    );

    return {
      ADDRESSCARD: {
        ADDRESSNUMBER: addressNumber,
        ADDRESSMOO: addressMoo,
        ADDRESSSOI: addressSoi,
        ADDRESSROAD: addressRoad,
        ADDRESSPROVINCE: selectedProvince ? selectedProvince.toString() : "",
        ADDRESSPROVINCENAME: province ? province.PROVINCENAME : "",
        ADDRESSDISTRICT: selectedDistrict ? selectedDistrict.toString() : "",
        ADDRESSDISTRICTNAME: district ? district.DISTRICTNAME : "",
        ADDRESSSUBDISTRICT: selectedSubDistrict
          ? selectedSubDistrict.toString()
          : "",
        ADDRESSSUBDISTRICTNAME: subDistrict ? subDistrict.SUBDISTRICTNAME : "",
        ADDRESSZIPCODE: selectedZipcode,
        ADDRESSPHONE: addressPhone,
        USETHISTAX: useThisTax,
      },
      ADDRESSINSTALLATION: {
        ADDRESSNUMBER: addressNumberForInstall,
        ADDRESSMOO: addressMooForInstall,
        ADDRESSSOI: addressSoiForInstall,
        ADDRESSROAD: addressRoadForInstall,
        ADDRESSPROVINCE: selectedProvinceForInstall
          ? selectedProvinceForInstall.toString()
          : "",
        ADDRESSPROVINCENAME: provinceForInstall
          ? provinceForInstall.PROVINCENAME
          : "",
        ADDRESSDISTRICT: selectedDistrictForInstall
          ? selectedDistrictForInstall.toString()
          : "",
        ADDRESSDISTRICTNAME: districtForInstall
          ? districtForInstall.DISTRICTNAME
          : "",
        ADDRESSSUBDISTRICT: selectedSubDistrictForInstall
          ? selectedSubDistrictForInstall.toString()
          : "",
        ADDRESSSUBDISTRICTNAME: subDistrictForInstall
          ? subDistrictForInstall.SUBDISTRICTNAME
          : "",
        ADDRESSZIPCODE: selectedZipcodeForInstall,
        ADDRESSPHONE: addressPhoneForInstall,
        USETHISTAX: useThisTax,
      },
      ADDRESSPAYMENT: {
        ADDRESSNUMBER: addressNumberForPayment,
        ADDRESSMOO: addressMooForPayment,
        ADDRESSSOI: addressSoiForPayment,
        ADDRESSROAD: addressRoadForPayment,
        ADDRESSPROVINCE: selectedProvinceForPayment
          ? selectedProvinceForPayment.toString()
          : "",
        ADDRESSPROVINCENAME: provinceForPayment
          ? provinceForPayment.PROVINCENAME
          : "",
        ADDRESSDISTRICT: selectedDistrictForPayment
          ? selectedDistrictForPayment.toString()
          : "",
        ADDRESSDISTRICTNAME: districtForPayment
          ? districtForPayment.DISTRICTNAME
          : "",
        ADDRESSSUBDISTRICT: selectedSubDistrictForPayment
          ? selectedSubDistrictForPayment.toString()
          : "",
        ADDRESSSUBDISTRICTNAME: subDistrictForPayment
          ? subDistrictForPayment.SUBDISTRICTNAME
          : "",
        ADDRESSZIPCODE: selectedZipcodeForPayment,
        ADDRESSPHONE: addressPhoneForPayment,
        USETHISTAX: useThisTax,
      },
      ADDRESSTAX: {
        ADDRESSNUMBER: addressNumberForBilling,
        ADDRESSMOO: addressMooForBilling,
        ADDRESSSOI: addressSoiForBilling,
        ADDRESSROAD: addressRoadForBilling,
        ADDRESSPROVINCE: selectedProvinceForBilling
          ? selectedProvinceForBilling.toString()
          : "",
        ADDRESSPROVINCENAME: provinceForBilling
          ? provinceForBilling.PROVINCENAME
          : "",
        ADDRESSDISTRICT: selectedDistrictForBilling
          ? selectedDistrictForBilling.toString()
          : "",
        ADDRESSDISTRICTNAME: districtForBilling
          ? districtForBilling.DISTRICTNAME
          : "",
        ADDRESSSUBDISTRICT: selectedSubDistrictForBilling
          ? selectedSubDistrictForBilling.toString()
          : "",
        ADDRESSSUBDISTRICTNAME: subDistrictForBilling
          ? subDistrictForBilling.SUBDISTRICTNAME
          : "",
        ADDRESSZIPCODE: selectedZipcodeForBilling,
        ADDRESSPHONE: addressPhoneForBilling,
        USETHISTAX: useThisTax,
      },
    };
  }, [
    addressNumber,
    addressMoo,
    addressSoi,
    addressRoad,
    selectedProvince,
    selectedDistrict,
    selectedSubDistrict,
    selectedZipcode,
    addressPhone,
    useThisTax,
    getProvince,
    getDistrict,
    getSubDistrict,

    addressNumberForInstall,
    addressMooForInstall,
    addressSoiForInstall,
    addressRoadForInstall,
    selectedProvinceForInstall,
    selectedDistrictForInstall,
    selectedSubDistrictForInstall,
    selectedZipcodeForInstall,
    addressPhoneForInstall,
    getProvinceForInstall,
    getDistrictForInstall,
    getSubDistrictForInstall,

    addressNumberForPayment,
    addressMooForPayment,
    addressSoiForPayment,
    addressRoadForPayment,
    selectedProvinceForPayment,
    selectedDistrictForPayment,
    selectedSubDistrictForPayment,
    selectedZipcodeForPayment,
    addressPhoneForPayment,
    getProvinceForPayment,
    getDistrictForPayment,
    getSubDistrictForPayment,

    addressNumberForBilling,
    addressMooForBilling,
    addressSoiForBilling,
    addressRoadForBilling,
    selectedProvinceForBilling,
    selectedDistrictForBilling,
    selectedSubDistrictForBilling,
    selectedZipcodeForBilling,
    addressPhoneForBilling,
    getProvinceForBilling,
    getDistrictForBilling,
    getSubDistrictForBilling,
  ]);

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
          FIELD: "ADDRESS",
          DATA: SaveAddressData,
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
      navigate("/sale/pdpa");
    } catch (error) {
      console.error("Error saving data:", error);
      MySwal.fire("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };
  {
    /*-------------------- End บันทึกข้อมูล --------------------*/
  }

  ///////// ล้างค้าที่อยู่ใบกำกับ หากยกเลิกการติ้กต้องการใบกำกับ
  const clearBillingAddress = () => {
    // เคลียร์ค่าฟิลด์ที่อยู่ใบกำกับ
    setAddressNumberForBilling("");
    setAddressMooForBilling("");
    setAddressSoiForBilling("");
    setAddressRoadForBilling("");
    setSelectedProvinceForBilling(undefined);
    setSelectedDistrictForBilling(undefined);
    setSelectedSubDistrictForBilling(undefined);
    setSelectedZipcodeForBilling("");
    setAddressPhoneForBilling("");

    // ปิดเช็กบ็อกซ์ “เหมือน…” ทั้งหมดของใบกำกับ เพื่อไม่ให้ลากค่าจาก panel อื่นกลับมาอีก
    setBillLikeCardAddr(false);
    setBillLikeInstallAddr(false);
    setBillLikePaymentAddr(false);
  };

  return (
    <>
      {/* แสดง Loading */}
      {loadingProvince && (
        <div className="text-center my-10">
          <ThreeDot />
          <p className={`my-5 ${styles.fontSize}`}>
            กำลังโหลดข้อมูล กรุณารอสักครู่ ...
          </p>
        </div>
      )}

      {!loadingProvince && (
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
                      ที่อยู่ลูกค้า
                    </li>
                  </ul>
                </div>
              </div>
              <span className={`${styles.fontSize}`}>เลขที่ขาย: </span>
              <span className={`${styles.titlePage}`}>{REFNO}</span>

              {/* Start accordion ที่อยู่ลูกค้า (ตามบัตร)*/}
              <div className="accordion mb-10" id="kt_accordion_2">
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
                      ที่อยู่ลูกค้า (ตามบัตร)
                    </h3>
                  </h2>
                  <div
                    id="kt_accordion_2_body_2"
                    className="accordion-collapse collapse show"
                    aria-labelledby="kt_accordion_2_header_2"
                    data-bs-parent="#kt_accordion_2"
                  >
                    <div className="accordion-body">
                      {/* start form */}
                      <form noValidate className="form">
                        <div className="card-body px-lg-9 px-1">
                          <div className="">
                            <div className="row mb-6">
                              <div className="col-lg-6 mt-xl-5">
                                <label className="form-check form-check-inline form-check-solid me-5">
                                  <input
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                    name="allAddress"
                                    type="checkbox"
                                    checked={likeAllAddr}
                                  />
                                  <span
                                    className={`ps-2 mb-sm-5 ${styles.label}`}
                                  >
                                    ใช้ที่อยู่เดียวกันทั้งหมด
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="">
                            <div className="row mb-6">
                              <div className="col-lg-4 mb-3">
                                <label
                                  className={`form-label required ${styles.label}`}
                                >
                                  บ้านเลขที่
                                </label>
                                <Controller
                                  name="homeNoIdCard"
                                  control={control}
                                  render={({ field }) => (
                                    <input
                                      {...field}
                                      className={`${styles.label
                                        } form-control ${errors.homeNoIdCard ? "is-invalid" : ""
                                        }`}
                                      value={addressNumber}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setAddressNumber(e.target.value);
                                        resetShowAddressCard();
                                      }}
                                      type="text"
                                    />
                                  )}
                                />
                                {errors.homeNoIdCard && (
                                  <p className={`text-danger ${styles.label}`}>
                                    {errors.homeNoIdCard.message}
                                  </p>
                                )}
                              </div>
                              <div className="col-lg-4 mb-3">
                                <label className={`form-label ${styles.label}`}>
                                  หมู่ที่
                                </label>
                                <input
                                  value={addressMoo}
                                  onChange={(e) => {
                                    setAddressMoo(e.target.value);
                                    resetShowAddressCard();
                                  }}
                                  type="text"
                                  className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <label className={`form-label ${styles.label}`}>
                                  ตรอก / ซอย
                                </label>
                                <input
                                  value={addressSoi}
                                  onChange={(e) => {
                                    setAddressSoi(e.target.value);
                                    resetShowAddressCard();
                                  }}
                                  type="text"
                                  className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="">
                            <div className="row mb-6">
                              <div className="col-lg-4 mb-3">
                                <label className={`form-label ${styles.label}`}>
                                  ถนน
                                </label>
                                <input
                                  value={addressRoad}
                                  onChange={(e) => {
                                    setAddressRoad(e.target.value);
                                    resetShowAddressCard();
                                  }}
                                  type="text"
                                  className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <label
                                  className={`form-label required ${styles.label}`}
                                >
                                  จังหวัด
                                </label>
                                <Controller
                                  name="provinceIdCard"
                                  control={control}
                                  render={({ field }) => (
                                    <select
                                      {...field}
                                      className={`${styles.label} form-select ${errors.provinceIdCard
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        handleProvinceChange(e);
                                        resetShowAddressCard();
                                      }}
                                    >
                                      <option value="">เลือกจังหวัด</option>
                                      {getProvince.map((item: any) => (
                                        <option
                                          key={item.PROVINCECODE}
                                          value={Number(item.PROVINCECODE)}
                                        >
                                          {item.PROVINCENAME}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                />
                                {errors.provinceIdCard && (
                                  <p className={`text-danger ${styles.label}`}>
                                    {errors.provinceIdCard.message}
                                  </p>
                                )}
                              </div>

                              <div className="col-lg-4 mb-3">
                                <label
                                  className={`form-label required ${styles.label}`}
                                >
                                  อำเภอ / เขต
                                </label>
                                <Controller
                                  name="districtIdCard"
                                  control={control}
                                  render={({ field }) => (
                                    <select
                                      {...field}
                                      className={`${styles.label} form-select ${errors.districtIdCard
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        handleDistrictChange(e);
                                        resetShowAddressCard();
                                      }}
                                    >
                                      <option value="">เลือกอำเภอ / เขต</option>
                                      {Array.isArray(getDistrict) &&
                                        getDistrict.map((item: any) => (
                                          <option
                                            key={item.DISTRICTCODE}
                                            value={item.DISTRICTCODE}
                                          >
                                            {item.DISTRICTNAME}
                                          </option>
                                        ))}
                                    </select>
                                  )}
                                />
                                {errors.districtIdCard && (
                                  <p className={`text-danger ${styles.label}`}>
                                    {errors.districtIdCard.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="">
                            <div className="row mb-6">
                              <div className="col-lg-4 mb-3">
                                <label
                                  className={`form-label required ${styles.label}`}
                                >
                                  ตำบล / แขวง
                                </label>
                                <Controller
                                  name="subDistrictIdCard"
                                  control={control}
                                  render={({ field }) => (
                                    <select
                                      {...field}
                                      className={`${styles.label} form-select ${errors.subDistrictIdCard
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        handleSubDistrictChange(e);
                                        resetShowAddressCard();
                                      }}
                                    >
                                      <option value="">เลือกตำบล / แขวง</option>
                                      {Array.isArray(getSubDistrict) &&
                                        getSubDistrict.map((item: any) => (
                                          <option
                                            key={item.SUBDISTRICTCODE}
                                            value={item.SUBDISTRICTCODE}
                                          >
                                            {item.SUBDISTRICTNAME}
                                          </option>
                                        ))}
                                    </select>
                                  )}
                                />
                                {errors.subDistrictIdCard && (
                                  <p className={`text-danger ${styles.label}`}>
                                    {errors.subDistrictIdCard.message}
                                  </p>
                                )}
                              </div>
                              <div className="col-lg-4 mb-3">
                                <label
                                  className={`form-label required ${styles.label}`}
                                >
                                  รหัสไปรษณีย์
                                </label>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                  value={selectedZipcode}
                                  readOnly
                                  style={{
                                    backgroundColor: "#d7dbde",
                                  }}
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <label
                                  className={`form-label ${styles.label}`}
                                >
                                  เบอร์ที่ติดต่อได้
                                </label>
                                <Controller
                                  name="telNoIdCard"
                                  control={control}
                                  render={({ field }) => (
                                    <input
                                      {...field}
                                      className={`${styles.label
                                        } form-control ${errors.telNoIdCard ? "is-invalid" : ""
                                        }`}
                                      value={(addressPhone || "").replace(
                                        /-/g,
                                        ""
                                      )}
                                      maxLength={10}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setAddressPhone(e.target.value);
                                        resetShowAddressCard();
                                      }}
                                      type="text"
                                      inputMode="numeric"
                                      pattern="[0-9]*"
                                    />
                                  )}
                                />
                                {errors.telNoIdCard && (
                                  <p className={`text-danger ${styles.label}`}>
                                    {errors.telNoIdCard.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                      {/* end form */}
                    </div>
                  </div>
                </div>
              </div>
              {/* End accordion ที่อยู่ลูกค้า (ตามบัตร)*/}

              {/* Start accordion ที่อยู่ลูกค้า (ติดตั้ง) */}
              <div className="accordion mb-10" id="kt_accordion_3">
                <div className="accordion-item mb-10">
                  <h2 className="accordion-header" id="kt_accordion_3_header_3">
                    <h3
                      className="accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7"
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
                      ที่อยู่ลูกค้า (ติดตั้ง)
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
                          <div className="">
                            <div className="row mb-6">
                              <div className="col-lg-6 my-10 mt-xl-5">
                                <label className="form-check form-check-inline form-check-solid me-5">
                                  <input
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                    name="likeAddressCard"
                                    type="checkbox"
                                    checked={installLikeCardAddr}
                                  />
                                  <span
                                    className={`ps-2 mb-sm-5 ${styles.label}`}
                                  >
                                    ใช้ที่อยู่เดียวกับที่อยู่ตามบัตรฯ
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="">
                            <div className="row mb-6">
                              <div className="col-lg-4 mb-3">
                                <label
                                  className={`form-label required ${styles.label}`}
                                >
                                  บ้านเลขที่
                                </label>
                                <Controller
                                  name="homeNoInstall"
                                  control={control}
                                  render={({ field }) => (
                                    <input
                                      {...field}
                                      className={`form-control ${styles.label
                                        } ${errors.homeNoInstall ? "is-invalid" : ""
                                        }`}
                                      value={addressNumberForInstall}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setAddressNumberForInstall(
                                          e.target.value
                                        );
                                        resetShowInstallAddress();
                                      }}
                                    />
                                  )}
                                />
                                {errors.homeNoInstall && (
                                  <p className={`text-danger ${styles.label}`}>
                                    {errors.homeNoInstall.message}
                                  </p>
                                )}
                              </div>
                              <div className="col-lg-4 mb-3">
                                <label className={`form-label ${styles.label}`}>
                                  หมู่ที่
                                </label>
                                <input
                                  value={addressMooForInstall}
                                  onChange={(e) => {
                                    setAddressMooForInstall(e.target.value);
                                    resetShowInstallAddress();
                                  }}
                                  type="text"
                                  className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <label className={`form-label ${styles.label}`}>
                                  ตรอก / ซอย
                                </label>
                                <input
                                  value={addressSoiForInstall}
                                  onChange={(e) => {
                                    setAddressSoiForInstall(e.target.value);
                                    resetShowInstallAddress();
                                  }}
                                  type="text"
                                  className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="">
                            <div className="row mb-6">
                              <div className="col-lg-4 mb-3">
                                <label className={`form-label ${styles.label}`}>
                                  ถนน
                                </label>
                                <input
                                  value={addressRoadForInstall}
                                  onChange={(e) => {
                                    setAddressRoadForInstall(e.target.value);
                                    resetShowInstallAddress();
                                  }}
                                  type="text"
                                  className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <label
                                  className={`form-label required ${styles.label}`}
                                >
                                  จังหวัด
                                </label>
                                <Controller
                                  name="provinceInstall"
                                  control={control}
                                  render={({ field }) => (
                                    <select
                                      {...field}
                                      className={`form-select ${styles.label} ${errors.provinceInstall
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                      value={selectedProvinceForInstall}
                                      onChange={(e) => {
                                        field.onChange(e.target.value);
                                        setSelectedProvinceForInstall(
                                          Number(e.target.value)
                                        );
                                        resetShowInstallAddress();
                                      }}
                                    >
                                      <option value="">เลือกจังหวัด</option>
                                      {getProvinceForInstall.map((p) => (
                                        <option
                                          key={p.PROVINCECODE}
                                          value={p.PROVINCECODE}
                                        >
                                          {p.PROVINCENAME}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                />
                                {errors.provinceInstall && (
                                  <p className={`text-danger ${styles.label}`}>
                                    {errors.provinceInstall.message}
                                  </p>
                                )}
                              </div>
                              <div className="col-lg-4 mb-3">
                                <label
                                  className={`form-label required ${styles.label}`}
                                >
                                  อำเภอ / เขต
                                </label>
                                <Controller
                                  name="districtInstall"
                                  control={control}
                                  render={({ field }) => (
                                    <select
                                      {...field}
                                      className={`form-select ${styles.label} ${errors.districtInstall
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                      value={selectedDistrictForInstall}
                                      onChange={(e) => {
                                        field.onChange(e.target.value);
                                        setSelectedDistrictForInstall(
                                          Number(e.target.value)
                                        );
                                        resetShowInstallAddress();
                                      }}
                                    >
                                      <option value="">เลือกอำเภอ / เขต</option>
                                      {getDistrictForInstall.map((d) => (
                                        <option
                                          key={d.DISTRICTCODE}
                                          value={d.DISTRICTCODE}
                                        >
                                          {d.DISTRICTNAME}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                />
                                {errors.districtInstall && (
                                  <p className={`text-danger ${styles.label}`}>
                                    {errors.districtInstall.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="">
                            <div className="row mb-6">
                              <div className="col-lg-4 mb-3">
                                <label
                                  className={`form-label required ${styles.label}`}
                                >
                                  ตำบล / แขวง
                                </label>
                                <Controller
                                  name="subDistrictInstall"
                                  control={control}
                                  render={({ field }) => (
                                    <select
                                      {...field}
                                      className={`form-select ${styles.label} ${errors.subDistrictInstall
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                      value={selectedSubDistrictForInstall}
                                      onChange={(e) => {
                                        field.onChange(e.target.value);
                                        setSelectedSubDistrictForInstall(
                                          Number(e.target.value)
                                        );
                                        resetShowInstallAddress();
                                      }}
                                    >
                                      <option value="">เลือกตำบล / แขวง</option>
                                      {getSubDistrictForInstall.map((s) => (
                                        <option
                                          key={s.SUBDISTRICTCODE}
                                          value={s.SUBDISTRICTCODE}
                                        >
                                          {s.SUBDISTRICTNAME}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                />
                                {errors.subDistrictInstall && (
                                  <p className={`text-danger ${styles.label}`}>
                                    {errors.subDistrictInstall.message}
                                  </p>
                                )}
                              </div>

                              <div className="col-lg-4 mb-3">
                                <label
                                  className={`form-label required ${styles.label}`}
                                >
                                  รหัสไปรษณีย์
                                </label>
                                <input
                                  type="text"
                                  className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                  value={selectedZipcodeForInstall}
                                  readOnly
                                  style={{
                                    backgroundColor: "#d7dbde",
                                  }}
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <label className={`form-label ${styles.label}`}>
                                  เบอร์ที่ติดต่อได้
                                </label>
                                <input
                                  className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                  value={(addressPhoneForInstall || "").replace(
                                    /-/g,
                                    ""
                                  )}
                                  onChange={(e) => {
                                    setAddressPhoneForInstall(e.target.value);
                                    resetShowInstallAddress();
                                  }}
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  maxLength={10}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                      {/* end form */}
                    </div>
                  </div>
                </div>
              </div>
              {/* End accordion ที่อยู่ลูกค้า (ติดตั้ง) */}

              {/* Start accordion ที่อยู่ลูกค้า (เก็บเงิน)*/}
              <div className="accordion mb-10" id="kt_accordion_4">
                <div className="accordion-item mb-10">
                  <h2 className="accordion-header" id="kt_accordion_4_header_4">
                    <h3
                      className="accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7"
                      data-bs-toggle="collapse"
                      data-bs-target="#kt_accordion_4_body_4"
                      aria-expanded="true"
                      aria-controls="kt_accordion_4_body_4"
                      style={{
                        color: "white",
                        cursor: "pointer",
                        backgroundColor: "#3777bc",
                      }}
                    >
                      ที่อยู่ลูกค้า (เก็บเงิน)
                    </h3>
                  </h2>
                  <div
                    id="kt_accordion_4_body_4"
                    className="accordion-collapse collapse show"
                    aria-labelledby="kt_accordion_4_header_4"
                    data-bs-parent="#kt_accordion_4"
                  >
                    <div className="accordion-body">
                      {/* start form */}
                      <form noValidate className="form">
                        <div className="card-body px-lg-9 px-1">
                          <div className="">
                            <div className="row mb-6">
                              <div className="col-lg-6 my-10 mt-xl-5">
                                <label className="form-check form-check-inline form-check-solid me-5">
                                  <input
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                    name="paymentLikeAddressCard"
                                    type="checkbox"
                                    checked={paymentLikeCardAddr}
                                  />
                                  <span
                                    className={`${styles.label} ps-2 mb-sm-5`}
                                  >
                                    ใช้ที่อยู่เดียวกับที่อยู่ตามบัตรฯ
                                  </span>
                                </label>
                                <label className="form-check form-check-inline form-check-solid me-5 mt-3 mt-sm-0">
                                  <input
                                    onChange={handleCheckboxChange}
                                    className="form-check-input"
                                    name="paymentLikeAddressInstall"
                                    type="checkbox"
                                    checked={paymentLikeInstallAddr}
                                  />
                                  <span
                                    className={`${styles.label} ps-2 mb-sm-5`}
                                  >
                                    ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="">
                            <div className="row mb-6">
                              <div className="col-lg-4 mb-3">
                                <label
                                  className={`form-label required ${styles.label}`}
                                >
                                  บ้านเลขที่
                                </label>
                                <Controller
                                  name="homeNoPayment"
                                  control={control}
                                  render={({ field }) => (
                                    <input
                                      {...field}
                                      className={`form-control ${styles.label
                                        } ${errors.homeNoPayment ? "is-invalid" : ""
                                        }`}
                                      value={addressNumberForPayment}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setAddressNumberForPayment(
                                          e.target.value
                                        );
                                        resetShowPaymentAddress();
                                      }}
                                    />
                                  )}
                                />
                                {errors.homeNoPayment && (
                                  <p className={`text-danger ${styles.label}`}>
                                    {errors.homeNoPayment.message}
                                  </p>
                                )}
                              </div>
                              <div className="col-lg-4 mb-3">
                                <label className={`form-label ${styles.label}`}>
                                  หมู่ที่
                                </label>
                                <input
                                  value={addressMooForPayment}
                                  onChange={(e) => {
                                    setAddressMooForPayment(e.target.value);
                                    resetShowPaymentAddress();
                                  }}
                                  type="text"
                                  className={`form-control ${styles.label}`}
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <label className={`form-label ${styles.label}`}>
                                  ตรอก / ซอย
                                </label>
                                <input
                                  value={addressSoiForPayment}
                                  onChange={(e) => {
                                    setAddressSoiForPayment(e.target.value);
                                    resetShowPaymentAddress();
                                  }}
                                  type="text"
                                  className={`form-control ${styles.label}`}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="">
                            <div className="row mb-6">
                              <div className="col-lg-4 mb-3">
                                <label className={`form-label ${styles.label}`}>
                                  ถนน
                                </label>
                                <input
                                  value={addressRoadForPayment}
                                  onChange={(e) => {
                                    setAddressRoadForPayment(e.target.value);
                                    resetShowPaymentAddress();
                                  }}
                                  type="text"
                                  className={`form-control ${styles.label}`}
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <label className={`form-label required ${styles.label}`}>
                                  จังหวัด
                                </label>
                                <Controller
                                  name="provincePayment"
                                  control={control}
                                  render={({ field }) => (
                                    <>
                                      <select
                                        {...field}
                                        className={`form-select ${styles.label} ${errors.provincePayment ? "is-invalid" : ""}`}
                                        value={selectedProvinceForPayment ?? ""}
                                        onChange={(e) => {
                                          const v = e.target.value === "" ? "" : Number(e.target.value);
                                          field.onChange(e.target.value);            // RHF เก็บเป็น string
                                          setSelectedProvinceForPayment(v as any);   // state เก็บเป็น number | undefined
                                          resetShowPaymentAddress();
                                        }}
                                      >
                                        <option value="">เลือกจังหวัด</option>
                                        {getProvinceForPayment.map((item: any) => (
                                          <option key={item.PROVINCECODE} value={item.PROVINCECODE}>{item.PROVINCENAME}</option>
                                        ))}
                                      </select>
                                      {errors.provincePayment && <p className={`text-danger ${styles.label}`}>{errors.provincePayment.message}</p>}
                                    </>
                                  )}
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <label className={`form-label required ${styles.label}`}>
                                  อำเภอ / เขต
                                </label>
                                <Controller
                                  name="districtPayment"
                                  control={control}
                                  render={({ field }) => (
                                    <>
                                      <select
                                        {...field}
                                        className={`form-select ${styles.label} ${errors.districtPayment ? "is-invalid" : ""}`}
                                        value={selectedDistrictForPayment ?? ""}
                                        onChange={(e) => {
                                          const v = e.target.value === "" ? "" : Number(e.target.value);
                                          field.onChange(e.target.value);
                                          setSelectedDistrictForPayment(v as any);
                                          resetShowPaymentAddress();
                                        }}
                                      >
                                        <option value="">เลือกอำเภอ / เขต</option>
                                        {Array.isArray(getDistrictForPayment) && getDistrictForPayment.map((d: any) => (
                                          <option key={d.DISTRICTCODE} value={d.DISTRICTCODE}>{d.DISTRICTNAME}</option>
                                        ))}
                                      </select>
                                      {errors.districtPayment && <p className={`text-danger ${styles.label}`}>{errors.districtPayment.message}</p>}
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="">
                            <div className="row mb-6">
                              <div className="col-lg-4 mb-3">
                                <label className={`form-label required ${styles.label}`}>
                                  ตำบล / แขวง
                                </label>
                                <Controller
                                  name="subDistrictPayment"
                                  control={control}
                                  render={({ field }) => (
                                    <>
                                      <select
                                        {...field}
                                        className={`form-select ${styles.label} ${errors.subDistrictPayment ? "is-invalid" : ""}`}
                                        value={selectedSubDistrictForPayment ?? ""}
                                        onChange={(e) => {
                                          const v = e.target.value === "" ? "" : Number(e.target.value);
                                          field.onChange(e.target.value);
                                          setSelectedSubDistrictForPayment(v as any);
                                          resetShowPaymentAddress();
                                        }}
                                      >
                                        <option value="">เลือกตำบล / แขวง</option>
                                        {Array.isArray(getSubDistrictForPayment) && getSubDistrictForPayment.map((s: any) => (
                                          <option key={s.SUBDISTRICTCODE} value={s.SUBDISTRICTCODE}>{s.SUBDISTRICTNAME}</option>
                                        ))}
                                      </select>
                                      {errors.subDistrictPayment && <p className={`text-danger ${styles.label}`}>{errors.subDistrictPayment.message}</p>}
                                    </>
                                  )}
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <label
                                  className={`form-label required ${styles.label}`}
                                >
                                  รหัสไปรษณีย์
                                </label>
                                <input
                                  type="text"
                                  className={`form-control ${styles.label}`}
                                  value={selectedZipcodeForPayment}
                                  readOnly
                                  style={{
                                    backgroundColor: "#d7dbde",
                                  }}
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <label className={`form-label ${styles.label}`}>
                                  เบอร์ที่ติดต่อได้
                                </label>
                                <input
                                  className={`form-control ${styles.label}`}
                                  value={(addressPhoneForPayment || "").replace(
                                    /-/g,
                                    ""
                                  )}
                                  onChange={(e) => {
                                    setAddressPhoneForPayment(e.target.value);
                                    resetShowPaymentAddress();
                                  }}
                                  type="text"
                                  maxLength={10}
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                      {/* end form */}
                    </div>
                  </div>
                </div>
              </div>
              {/* End accordion ที่อยู่ลูกค้า (เก็บเงิน)*/}

              <div className="">
                <div className="row">
                  <div className="col-12 mb-15">
                    <label className="form-check form-check-inline form-check-solid">
                      <input
                        className="form-check-input mx-1"
                        name="showTaxAddress"
                        type="checkbox"
                        checked={showTaxAddress}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setShowTaxAddress(checked);
                          setUseThisTax(checked ? "TRUE" : "FALSE"); // ถ้าไม่ต้องการจะให้ FALSE

                          if (!checked) {
                            clearBillingAddress();  // ยกเลิกติ้ก → ล้างค่าที่อยู่ใบกำกับ
                          }
                        }}
                      />
                      <span className={`${styles.label} ps-3 mb-sm-5 mb-5`}>
                        ต้องการใบกำกับภาษี
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Start accordion ที่อยู่ลูกค้า (ใบกำกับภาษี)*/}
              {showTaxAddress && (
                <>
                  <div className="accordion mb-10" id="kt_accordion_5">
                    <div className="accordion-item mb-10">
                      <h2
                        className="accordion-header"
                        id="kt_accordion_5_header_5"
                      >
                        <h3
                          className="accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7"
                          data-bs-toggle="collapse"
                          data-bs-target="#kt_accordion_5_body_5"
                          aria-expanded="true"
                          aria-controls="kt_accordion_5_body_5"
                          style={{
                            color: "white",
                            cursor: "pointer",
                            backgroundColor: "#3777bc",
                          }}
                        >
                          ที่อยู่ลูกค้า (ออกใบกำกับภาษี)
                        </h3>
                      </h2>
                      <div
                        id="kt_accordion_5_body_5"
                        className="accordion-collapse collapse show"
                        aria-labelledby="kt_accordion_5_header_5"
                        data-bs-parent="#kt_accordion_5"
                      >
                        <div className="accordion-body">
                          {/* start form */}
                          <form noValidate className="form">
                            <div className="card-body px-lg-9 px-1">
                              <div className="">
                                <div className="row mb-6">
                                  <div className="col-lg-6 mb-3 mt-xl-5">
                                    <label className="form-check form-check-inline form-check-solid me-5">
                                      <input
                                        onChange={handleCheckboxChange}
                                        className="form-check-input"
                                        name="billLikeAddressCard"
                                        type="checkbox"
                                        checked={billLikeCardAddr}
                                      />
                                      <span
                                        className={`${styles.label} ps-2 mb-sm-5`}
                                      >
                                        ใช้ที่อยู่เดียวกับที่อยู่ตามบัตรฯ
                                      </span>
                                    </label>
                                    <label className="form-check form-check-inline form-check-solid me-5 mt-3 mt-sm-0">
                                      <input
                                        onChange={handleCheckboxChange}
                                        className="form-check-input"
                                        name="billLikeAddressInstall"
                                        type="checkbox"
                                        checked={billLikeInstallAddr}
                                      />
                                      <span
                                        className={`${styles.label} ps-2 mb-sm-5`}
                                      >
                                        ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง
                                      </span>
                                    </label>
                                    <label className="form-check form-check-inline form-check-solid me-5 mt-3 mt-sm-0">
                                      <input
                                        onChange={handleCheckboxChange}
                                        className="form-check-input"
                                        name="billLikeAddressPayment"
                                        type="checkbox"
                                        checked={billLikePaymentAddr}
                                      />
                                      <span
                                        className={`${styles.label} ps-2 mb-sm-5`}
                                      >
                                        ใช้ที่อยู่เดียวกับที่อยู่เก็บเงิน
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              </div>

                              <div className="">
                                <div className="row mb-6">
                                  <div className="col-lg-4 mb-3">
                                    <label
                                      className={`form-label ${styles.label}`}
                                    >
                                      บ้านเลขที่
                                    </label>
                                    <input
                                      value={addressNumberForBilling}
                                      onChange={(e) => {
                                        setAddressNumberForBilling(
                                          e.target.value
                                        );
                                        resetShowBillingAddress();
                                      }}
                                      type="text"
                                      className={`form-control ${styles.label}`}
                                    />
                                  </div>
                                  <div className="col-lg-4 mb-3">
                                    <label
                                      className={`form-label ${styles.label}`}
                                    >
                                      หมู่ที่
                                    </label>
                                    <input
                                      value={addressMooForBilling}
                                      onChange={(e) => {
                                        setAddressMooForBilling(e.target.value);
                                        resetShowBillingAddress();
                                      }}
                                      type="text"
                                      className={`form-control ${styles.label}`}
                                    />
                                  </div>
                                  <div className="col-lg-4 mb-3">
                                    <label
                                      className={`form-label ${styles.label}`}
                                    >
                                      ตรอก / ซอย
                                    </label>
                                    <input
                                      value={addressSoiForBilling}
                                      onChange={(e) => {
                                        setAddressSoiForBilling(e.target.value);
                                        resetShowBillingAddress();
                                      }}
                                      type="text"
                                      className={`form-control ${styles.label}`}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="">
                                <div className="row mb-6">
                                  <div className="col-lg-4 mb-3">
                                    <label
                                      className={`form-label ${styles.label}`}
                                    >
                                      ถนน
                                    </label>
                                    <input
                                      value={addressRoadForBilling}
                                      onChange={(e) => {
                                        setAddressRoadForBilling(
                                          e.target.value
                                        );
                                        resetShowBillingAddress();
                                      }}
                                      type="text"
                                      className={`form-control ${styles.label}`}
                                    />
                                  </div>

                                  {/* จังหวัด */}
                                  <div className="col-lg-4 mb-3">
                                    <label
                                      className={`form-label ${styles.label}`}
                                    >
                                      จังหวัด
                                    </label>
                                    <select
                                      className={`form-select ${styles.label}`}
                                      value={
                                        billLikeCardAddr
                                          ? selectedProvince
                                          : billLikeInstallAddr
                                            ? selectedProvinceForInstall
                                            : billLikePaymentAddr
                                              ? selectedProvinceForPayment
                                              : selectedProvinceForBilling
                                      }
                                      onChange={(e) => {
                                        const selectedValue = Number(
                                          e.target.value
                                        );
                                        if (billLikeCardAddr) {
                                          setSelectedProvince(selectedValue);
                                        } else if (billLikeInstallAddr) {
                                          setSelectedProvinceForInstall(
                                            selectedValue
                                          );
                                        } else if (billLikePaymentAddr) {
                                          setSelectedProvinceForPayment(
                                            selectedValue
                                          );
                                        } else {
                                          setSelectedProvinceForBilling(
                                            selectedValue
                                          );
                                        }
                                        resetShowBillingAddress();
                                      }}
                                    >
                                      <option value="">เลือกจังหวัด</option>
                                      {(billLikeCardAddr
                                        ? getProvince
                                        : billLikeInstallAddr
                                          ? getProvinceForInstall
                                          : billLikePaymentAddr
                                            ? getProvinceForPayment
                                            : getProvinceForBilling
                                      ).map((item) => (
                                        <option
                                          key={item.PROVINCECODE}
                                          value={item.PROVINCECODE}
                                        >
                                          {item.PROVINCENAME}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* อำเภอ / เขต */}
                                  <div className="col-lg-4 mb-3">
                                    <label
                                      className={`form-label ${styles.label}`}
                                    >
                                      อำเภอ / เขต
                                    </label>
                                    <select
                                      className={`form-select ${styles.label}`}
                                      value={
                                        billLikeCardAddr
                                          ? selectedDistrict
                                          : billLikeInstallAddr
                                            ? selectedDistrictForInstall
                                            : billLikePaymentAddr
                                              ? selectedDistrictForPayment
                                              : selectedDistrictForBilling
                                      }
                                      onChange={(e) => {
                                        const selectedValue = Number(
                                          e.target.value
                                        );
                                        if (billLikeCardAddr) {
                                          setSelectedDistrict(selectedValue);
                                        } else if (billLikeInstallAddr) {
                                          setSelectedDistrictForInstall(
                                            selectedValue
                                          );
                                        } else if (billLikePaymentAddr) {
                                          setSelectedDistrictForPayment(
                                            selectedValue
                                          );
                                        } else {
                                          setSelectedDistrictForBilling(
                                            selectedValue
                                          );
                                        }
                                        resetShowBillingAddress();
                                      }}
                                    >
                                      <option value="">เลือกอำเภอ / เขต</option>
                                      {(billLikeCardAddr
                                        ? getDistrict
                                        : billLikeInstallAddr
                                          ? getDistrictForInstall
                                          : billLikePaymentAddr
                                            ? getDistrictForPayment
                                            : getDistrictForBilling
                                      ).map((item) => (
                                        <option
                                          key={item.DISTRICTCODE}
                                          value={item.DISTRICTCODE}
                                        >
                                          {item.DISTRICTNAME}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className="">
                                <div className="row mb-6">
                                  {/* ตำบล / แขวง */}
                                  <div className="col-lg-4 mb-3">
                                    <label
                                      className={`form-label ${styles.label}`}
                                    >
                                      ตำบล / แขวง
                                    </label>
                                    <select
                                      className={`form-select ${styles.label}`}
                                      value={
                                        billLikeCardAddr
                                          ? selectedSubDistrict
                                          : billLikeInstallAddr
                                            ? selectedSubDistrictForInstall
                                            : billLikePaymentAddr
                                              ? selectedSubDistrictForPayment
                                              : selectedSubDistrictForBilling
                                      }
                                      onChange={(e) => {
                                        const selectedValue = Number(
                                          e.target.value
                                        );
                                        if (billLikeCardAddr) {
                                          setSelectedSubDistrict(selectedValue);
                                        } else if (billLikeInstallAddr) {
                                          setSelectedSubDistrictForInstall(
                                            selectedValue
                                          );
                                        } else if (billLikePaymentAddr) {
                                          setSelectedSubDistrictForPayment(
                                            selectedValue
                                          );
                                        } else {
                                          setSelectedSubDistrictForBilling(
                                            selectedValue
                                          );
                                        }
                                        resetShowBillingAddress();
                                      }}
                                    >
                                      <option value="">เลือกตำบล / แขวง</option>
                                      {(billLikeCardAddr
                                        ? getSubDistrict
                                        : billLikeInstallAddr
                                          ? getSubDistrictForInstall
                                          : billLikePaymentAddr
                                            ? getSubDistrictForPayment
                                            : getSubDistrictForBilling
                                      ).map((item) => (
                                        <option
                                          key={item.SUBDISTRICTCODE}
                                          value={item.SUBDISTRICTCODE}
                                        >
                                          {item.SUBDISTRICTNAME}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* รหัสไปรษณีย์ */}
                                  <div className="col-lg-4 mb-3">
                                    <label
                                      className={`form-label ${styles.label}`}
                                    >
                                      รหัสไปรษณีย์
                                    </label>
                                    <input
                                      type="text"
                                      className={`form-control ${styles.label}`}
                                      value={
                                        billLikeCardAddr
                                          ? selectedZipcode
                                          : billLikeInstallAddr
                                            ? selectedZipcodeForInstall
                                            : billLikePaymentAddr
                                              ? selectedZipcodeForPayment
                                              : selectedZipcodeForBilling
                                      }
                                      readOnly
                                      style={{
                                        backgroundColor: "#d7dbde",
                                      }}
                                    />
                                  </div>

                                  <div className="col-lg-4 mb-3">
                                    <label
                                      className={`form-label ${styles.label}`}
                                    >
                                      เบอร์ที่ติดต่อได้
                                    </label>
                                    <input
                                      value={(
                                        addressPhoneForBilling || ""
                                      ).replace(/-/g, "")}
                                      onChange={(e) => {
                                        setAddressPhoneForBilling(
                                          e.target.value
                                        );
                                        resetShowBillingAddress();
                                      }}
                                      type="text"
                                      className={`form-control ${styles.label}`}
                                      maxLength={10}
                                      inputMode="numeric"
                                      pattern="[0-9]*"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                          {/* end form */}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
                <button
                  onClick={() =>
                    navigate("/sale/update/updateCustDetail", {
                      state: {
                        ...matchedItem,
                      },
                    })
                  }
                  className={`${styles.btnSecondary}`}
                  type="button"
                >
                  แก้ไขข้อมูลลูกค้า
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  className={`${styles.btnPrimary}`}
                  type="button"
                >
                  ถัดไป
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
                    navigate("/sale/update/updateCustDetail", {
                      state: {
                        ...matchedItem,
                      },
                    })
                  }
                  type="button"
                >
                  แก้ไขข้อมูลลูกค้า
                </button>
                <button
                  className={`${styles.btnPrimary}`}
                  onClick={handleSubmit(onSubmit)}
                  type="button"
                >
                  ถัดไป
                </button>
              </div>
            </form>
            {/* End accordion ที่อยู่ลูกค้า (ใบกำกับภาษี)*/}
          </Content>
        </>
      )}
    </>
  );
};

export default SalesCreateAddress;
