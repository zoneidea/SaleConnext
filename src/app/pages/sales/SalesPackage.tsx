// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { useState, useEffect, useRef, useMemo } from 'react';
// import { Content } from '../../../_metronic/layout/components/content';
// import { useAuth } from '../../modules/auth/core/Auth';
// import { useUUIDStore, useSaveProductStore } from '../../modules/stores/stepsStore';
// import '/public/splash-screen.css';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// import { ThreeDot } from 'react-loading-indicators';

// //useStore
// import {
//     useCategoryStore,
//     useFetchCategoryStore,
//     useProductStore,
//     usePackageStore,
//     useConditionsCheckHistoryStore
// } from '../../modules/stores/sales/packageStore/packageStore';

// //component
// import { CardProduct } from './components/cards/CardProduct';
// import { CardPackage } from './components/cards/CardPackage';
// import { log } from 'node:console';

// interface LocationState {
//     barCode?: any; // ระบุว่ามี barCode ใน state หรือไม่
// }

// const SalesPackage: React.FC = () => {
//     const location = useLocation();
//     const state = location.state as { barCode?: any } || {}; // เพิ่ม fallback เป็นอ็อบเจ็กต์ว่าง
//     const barCode = state.barCode; // กำหนดค่าเริ่มต้นเป็น "ยังไม่มีข้อมูล"
//     // console.log(`barCode`, barCode);

//     // State สำหรับตรวจสอบสถานะการโหลด
//     const [loadingCategories, setLoadingCategories] = useState(true);
//     const [loadingProducts, setLoadingProducts] = useState(false)
//     const [loadingPackages, setLoadingPackages] = useState(true)

//     const navigate = useNavigate(); // ใช้ useNavigate สำหรับการเปลี่ยนเส้นทาง
//     const MySwal = withReactContent(Swal);

//     const { REFNO } = useUUIDStore();

//     const { auth } = useAuth();

//     const { fetchCategory } = useFetchCategoryStore();
//     // console.log(`fetchCategory: `, fetchCategory);

//     const [categories, setCategories] = useState<any[]>([]);
//     console.log(`categories`, categories);

//     const [promotion, setPromotion] = useState<any[]>([]);
//     // console.log(`promotion`, promotion);

//     const [packageType, setPackageType] = useState<any[]>([]);
//     // console.log(`packageType: `, packageType);

//     const [packageList, setPackageList] = useState<any[]>([]);
//     // console.log(`packageList: `, packageList);

//     const [selectedCategoryId, setSelectedCategoryId] = useState<any>('');

//     const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
//     // console.log(`selectedProductIndex: `, selectedProductIndex);

//     const [selectedItemCode, setSelectedItemCode] = useState<string | null>(null);
//     // console.log(`selectedItemCode: `, selectedItemCode);

//     const [selectedItemDescription, setSelectedItemDescription] = useState<string | null>(null);
//     const [selectedDescriptionEN, setSelectedDescriptionEN] = useState<string | null>(null);
//     const [selectedDescriptionTH, setSelectedDescriptionTH] = useState<string | null>(null);
//     const [selectedSerialNo, setSelectedSerialNo] = useState<string | null>(null);
//     const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
//     const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
//     const [selectedTransDate, setSelectedTransDate] = useState<string | null>(null);
//     const [productId, setProductId] = useState(null);  // สร้าง state สำหรับเก็บ _id
//     // console.log(`productId: `, productId);

//     const [selectedPackageTypeId, setSelectedPackageTypeId] = useState<number | null>(null);
//     // console.log(`selectedPackageTypeId`, selectedPackageTypeId);

//     const [selectedPackageModel, setSelectedPackageModel] = useState<number | null>(null);
//     // console.log(`selectedPackageModel`, selectedPackageModel);

//     const [selectedProductId, setSelectedProductId] = useState<any>('');
//     // console.log(`selectedProductId`, selectedProductId);
//     const [selectedPromotion, setSelectedPromotion] = useState<string | number>('');
//     console.log(`selectedPromotion`, selectedPromotion);

//     const [checktype, setChecktype] = useState<number | null>(null);
//     // console.log(`checktype`, checktype);

//     const [Search, setSearch] = useState<string>(''); // เก็บค่าของเลขบัตรประชาชน
//     // console.log(`Search: `, Search);

//     const {
//         EmpId, setEmpId,
//         TeamSale, setTeamSale,
//         SaleCode, setSaleCode,
//         SupEmpId, setSupEmpId,
//         SecEmpId, setSecEmpId,
//         DivisionId, setDivisionId,
//         DepartId, setDepartId,
//         DepartGroup, setDepartGroup,
//     } = useCategoryStore();
//     // console.log(`EmpId`, EmpId);
//     // console.log(`EmpId`, EmpId);

//     // const getCategoryLocal = localStorage.getItem("fetchCategory");
//     // const parseGetCategoryLocal = getCategoryLocal ? JSON.parse(getCategoryLocal) : null;

//     const { product, setProduct } = useProductStore();
//     // console.log(`product: `, product);

//     const { ItemID, setItemID, PackageTypeID, setPackageTypeID } = usePackageStore();

//     const { Model, setModel } = useConditionsCheckHistoryStore();

//     const { PRODUCT, SETPRODUCT } = useSaveProductStore();

//     const SaveProductData = useMemo(() => [
//         {
//             EmpId: EmpId || '',
//             TeamSale: TeamSale || '',
//             SaleCode: "C000000000000",
//             ItemCode: selectedItemCode || '',
//             ItemDescription: selectedItemDescription || '',
//             CategoriesId: selectedCategoryId || '',
//             DescriptionEN: selectedDescriptionEN || '',
//             DescriptionTH: selectedDescriptionTH || '',
//             SerialNo: selectedSerialNo || '',
//             Status: selectedStatus || '',
//             Branch: selectedBranch || '',
//             TransDate: selectedTransDate || '',
//             PromotionId: selectedPromotion,
//             ProductId: productId,
//             Package: selectedPackageModel !== null
//                 ? [
//                     {
//                         MODEL: packageList[selectedPackageModel]?.MODEL || [],
//                         PACKAGETYPEID: selectedPackageTypeId ?? 0, // ดึงค่า selectedPackageTypeId แม้ selectedPackageModel จะไม่มี
//                         ORGANIZATIONCODE: packageList[selectedPackageModel]?.ORGANIZATIONCODE || [],
//                         ITEMID: packageList[selectedPackageModel]?.ITEMID || [],
//                         PRODUCTID: packageList[selectedPackageModel]?.PRODUCTID || [],
//                         PACKAGETITLE: packageList[selectedPackageModel]?.PACKAGETITLE || [],
//                         TOTALPRICE: packageList[selectedPackageModel]?.TOTALPRICE || [],
//                         HASTRADEIN: packageList[selectedPackageModel]?.HASTRADEIN || [],
//                         DISCOUNTPRICE: packageList[selectedPackageModel]?.DISCOUNTPRICE || [],
//                         SEQUENCE: packageList[selectedPackageModel]?.SEQUENCE || [],
//                         PERMITION_ACTIVE: packageList[selectedPackageModel]?.PERMITION_ACTIVE || [],
//                         FREEGIFT: packageList[selectedPackageModel]?.FREEGIFT || [],
//                         PERIODDETAILS: packageList[selectedPackageModel]?.PERIODDETAILS || []
//                     }
//                 ]
//                 : selectedPackageTypeId !== null
//                     ? [
//                         {
//                             MODEL: null, // หากไม่มี selectedPackageModel ให้ตั้งค่า MODEL เป็น null
//                             PACKAGETYPEID: selectedPackageTypeId, // เก็บค่าของ selectedPackageTypeId ได้โดยตรง
//                             ORGANIZATIONCODE: null,
//                             ITEMID: null,
//                             PRODUCTID: null,
//                             PACKAGETITLE: null,
//                             TOTALPRICE: null,
//                             HASTRADEIN: null,
//                             DISCOUNTPRICE: null,
//                             SEQUENCE: null,
//                             PERMITION_ACTIVE: null,
//                             FREEGIFT: null,
//                             PERIODDETAILS: null
//                         }
//                     ]
//                     : [], // หากไม่มีค่าใดเลย ให้เป็น array ว่าง
//         },
//     ], [
//         EmpId,
//         TeamSale,
//         SaleCode,
//         SupEmpId,
//         SecEmpId,
//         selectedItemCode,
//         selectedItemDescription,
//         selectedCategoryId,
//         selectedDescriptionEN,
//         selectedDescriptionTH,
//         selectedSerialNo,
//         selectedStatus,
//         selectedBranch,
//         selectedTransDate,
//         selectedPromotion,
//         selectedPackageModel,
//         selectedPackageTypeId,
//         packageList
//     ]);

//     const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
//     const CATEGORIES_URL = `${API_SALECONNEXT}/GetProduct/Categories`;
//     const PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageType`;
//     const PROMOTION_URL = `${API_SALECONNEXT}/GetProduct/ProductPromotionList`;
//     const POST_PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageList`;
//     const API_URL_POST_CONDITIONSCHECKHISTORY = `${API_SALECONNEXT}/ConditionsCheckHistory`;

//     const API_URL_POST_CHECKCUSTOMER = import.meta.env.VITE_APP_API_THIENSURAT;
//     const CHECKCUSTOMER_URL = `${API_URL_POST_CHECKCUSTOMER}/CheckCustomer`;

//     const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//     // const getProductUrl = () => `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`;
//     // const getProductUrl = `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}&sn=${barCode}`;
//     const SAVEPRODUCTPACKAGE = `${API_URL_MONGO}/Contract/saveProductPackage`;
//     const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

//     const GET_STOCK_URL = `${API_URL_MONGO}/Product/GetStock`;

//     // สร้าง ref สำหรับส่วนแพ็คเกจ
//     const packageSectionRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         postData()
//     }, [])

//     // const postData = async () => {
//     //     try {
//     //         const response = await axios.post(
//     //             CATEGORIES_URL,
//     //             { EmpId, DivisionId, DepartId, DepartGroup, TeamSale },
//     //             {
//     //                 headers: {
//     //                     'Content-Type': 'multipart/form-data',
//     //                     'Accept': 'multipart/form-data',
//     //                 },
//     //             }
//     //         );
//     //         const data = Array.isArray(response.data.data) ? response.data.data : [];

//     //         // เพิ่มฟิลเตอร์เฉพาะหมวดหมู่ที่มีสินค้า
//     //         const filteredCategories = data.filter((category: any) => category.hasProducts === true);

//     //         setCategories(filteredCategories);
//     //     } catch (error) {
//     //         console.error('Error fetching CATEGORIES_URL:', error);
//     //     } finally {
//     //         setLoadingCategories(false);
//     //     }
//     // };

//     const postData = async () => {
//         setLoadingCategories(true);
//         try {
//             const response = await axios.get(GET_STOCK_URL, {
//                 params: {
//                     empid: EmpId,
//                     teamSale: TeamSale,
//                 },
//             });
//             // แยก data จาก response
//             const raw = Array.isArray(response.data.data) ? response.data.data : [];
//             setCategories(raw);

//         } catch (error) {
//             console.error('Error fetching stock:', error);
//         } finally {
//             setLoadingCategories(false);
//         }
//     };

//     // // GET Product/GetStock?
//     // useEffect(() => {
//     //     const fetchProducts = async () => {
//     //         if (!selectedCategoryId) return;
//     //         setLoadingProducts(true); // เริ่มโหลดเมื่อเปลี่ยนหมวดหมู่สินค้า
//     //         try {
//     //             const response = await axios.get(getProductUrl(), {
//     //                 headers: {
//     //                     'Content-Type': 'application/json',
//     //                     'Accept': 'application/json',
//     //                 }
//     //             });
//     //             const data = Array.isArray(response.data.data) ? response.data.data : [];
//     //             setProduct(data); // บันทึกสินค้าใหม่
//     //         } catch (error) {
//     //             console.error('Error fetching products:', error);
//     //         } finally {
//     //             setLoadingProducts(false); // หยุดโหลดเมื่อดึงข้อมูลเสร็จ
//     //         }
//     //     };

//     //     fetchProducts();
//     // }, [selectedCategoryId]); // ทำงานเมื่อ selectedCategoryId เปลี่ยนแปลง

//     useEffect(() => {
//         setProduct([]); // ล้างข้อมูล product ทุกครั้งเมื่อเริ่มต้น
//         postData()
//     }, []);

//     // GET Product/GetStock?
//     useEffect(() => {
//         const fetchProducts = async () => {
//             setLoadingProducts(true);
//             try {
//                 // สร้าง URL ตามเงื่อนไข
//                 const url = selectedCategoryId
//                     ? `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`
//                     : `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&sn=${barCode}`;

//                 const response = await axios.get(url);

//                 const data = Array.isArray(response.data.data) ? response.data.data : [];
//                 setProduct(data);

//                 // เลือกสินค้าตัวแรกโดยอัตโนมัติหากมีบาร์โค้ด
//                 if (data.length === 1 && barCode) {
//                     setSelectedProductIndex(0);
//                     setSelectedItemCode(data[0].ItemCode);
//                     setItemID(data[0].ItemCode);
//                     setProductId(data[0].ProductID);
//                     setSelectedItemDescription(data[0].ItemDescription);
//                     setSelectedDescriptionEN(data[0].DescriptionEN);
//                     setSelectedDescriptionTH(data[0].DescriptionTH);
//                     setSelectedSerialNo(data[0].SerialNo);
//                     setSelectedStatus(data[0].Status);
//                     setSelectedBranch(data[0].Branch);
//                     setSelectedTransDate(data[0].TransDate);
//                 }
//             } catch (error) {
//                 console.error("Error fetching products:", error);
//             } finally {
//                 setLoadingProducts(false);
//             }
//         };

//         if (selectedCategoryId || barCode) {
//             fetchProducts();
//         }
//     }, [selectedCategoryId, barCode]);

//     // GetProduct/ProductPromotionList
//     useEffect(() => {
//         const fetchPromotion = async () => {
//             if (selectedProductIndex === null) return;
//             try {
//                 const response = await axios.post(PROMOTION_URL, {
//                     ProductID: productId,
//                     EmpId,
//                     DivisionId,
//                     DepartId,
//                     DepartGroup,
//                     TeamSale,
//                     ItemID: selectedItemCode
//                 }, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                         'Accept': 'multipart/form-data',
//                     }
//                 });
//                 const data = Array.isArray(response.data.data) ? response.data.data : [];
//                 setPromotion(data);
//             } catch (error) {
//                 console.error('Error fetching promotion:', error);
//             }
//         };

//         fetchPromotion();
//     }, [selectedProductIndex]);

//     // GET GetPackage/PackageType
//     useEffect(() => {
//         const getData = async () => {
//             try {
//                 const response = await axios.get(PACKAGE_URL, {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Accept': 'application/json',
//                     }
//                 });
//                 const data = Array.isArray(response.data.data) ? response.data.data : [];
//                 setPackageType(data);
//             } catch (error) {
//                 console.error('Error fetching PACKAGE_URL:', error);
//             }
//         };
//         getData();

//         setEmpId(auth.data[0].EmpId);
//         setTeamSale(auth.data[0].TeamSale);
//         setSaleCode(auth.data[0].SaleCode);
//         setSupEmpId(auth.data[0].SupEmp);
//         setSecEmpId(auth.data[0].SecEmp);
//         setDivisionId(auth.data[0].DivisionId);
//         setDepartId(auth.data[0].DepartId);
//         setDepartGroup(auth.data[0].DepartGroup);
//     }, []);

//     // POST GetPackage/PackageList
//     useEffect(() => {
//         const postData = async () => {
//             setLoadingPackages(true); // เริ่มโหลดข้อมูล
//             try {
//                 const response = await axios.post(POST_PACKAGE_URL,
//                     {
//                         EmpId,
//                         DivisionId,
//                         DepartId,
//                         DepartGroup,
//                         TeamSale,
//                         ItemID,
//                         PackageTypeID,
//                         PromotionID: selectedPromotion
//                     },
//                     {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         },
//                     }
//                 );

//                 const data = Array.isArray(response.data.data) ? response.data.data : [];

//                 // หน่วงเวลา 2 วินาทีก่อนแสดงผลข้อมูล
//                 setTimeout(() => {
//                     setPackageList(data); // อัปเดตแพ็คเกจหลังจากหน่วงเวลา
//                     setLoadingPackages(false); // หยุดแสดง loading หลังหน่วงเวลา
//                 }, 1000);

//             } catch (error) {
//                 console.error('Error fetching POST_PACKAGE_URL:', error);
//                 setLoadingPackages(false); // หยุดแสดง loading ถ้าเกิดข้อผิดพลาด
//             }
//         };

//         postData();
//     }, [EmpId, DivisionId, DepartId, DepartGroup, TeamSale, ItemID, PackageTypeID, selectedPromotion]);

//     useEffect(() => {
//         // console.log("SaveProductData:", SaveProductData);
//         if (JSON.stringify(SaveProductData) !== JSON.stringify(PRODUCT)) {
//             // console.log("Updating product in store...");
//             SETPRODUCT(SaveProductData);
//         }
//     }, [SaveProductData, PRODUCT, SETPRODUCT]);

//     // เลื่อนหน้าจอมายังแพ็คเกจ หากมีการเลือกประเภทการชำระ
//     useEffect(() => {
//         if (selectedPackageTypeId !== null && packageSectionRef.current) {
//             // เลื่อนหน้าจอไปยังแพ็คเกจเมื่อ selectedPackageTypeId ถูกอัปเดต
//             packageSectionRef.current.scrollIntoView({ behavior: 'smooth' });
//         }
//     }, [selectedPackageTypeId]);

//     const handleCateOptionChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const value = event.target.value;
//         setSelectedCategoryId(value);

//         // ล้างค่าทั้งหมดใน state ที่เกี่ยวข้อง
//         setProduct([]);
//         setSelectedProductIndex(null);
//         setSelectedItemCode(null);
//         setSelectedItemDescription(null);
//         setSelectedDescriptionEN(null);
//         setSelectedDescriptionTH(null);
//         setSelectedSerialNo(null); // ล้าง Serial Number
//         setSelectedStatus(null);
//         setSelectedBranch(null);
//         setSelectedTransDate(null);
//         setSelectedPromotion('');
//         setSelectedPackageTypeId(null);
//         setSelectedPackageModel(null);
//         setPackageList([]);

//         // ล้าง barCode
//         navigate("/sale/package", { state: { barCode: "" } });

//         if (value) {
//             try {
//                 setLoadingProducts(true);
//                 const response = await axios.get(
//                     `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${value}`
//                 );
//                 const data = Array.isArray(response.data.data) ? response.data.data : [];
//                 setProduct(data);
//             } catch (error) {
//                 console.error('Error fetching products:', error);
//             } finally {
//                 setLoadingProducts(false);
//             }
//         }
//     };

//     const handleCardProductClick = (index: number) => {
//         setSelectedProductIndex(index);
//         setSelectedItemCode(product[index].ItemCode);
//         setItemID(product[index].ItemCode);
//         setProductId(product[index].ProductID);
//         setSelectedItemDescription(product[index].ItemDescription);
//         setSelectedDescriptionEN(product[index].DescriptionEN);
//         setSelectedDescriptionTH(product[index].DescriptionTH);
//         setSelectedSerialNo(product[index].SerialNo);
//         setSelectedStatus(product[index].Status);
//         setSelectedBranch(product[index].Branch);
//         setSelectedTransDate(product[index].TransDate);
//     };

//     //เปลี่ยนสไตล์เป็น success เมื่อเลือกปุ่ม package และเลื่อนลงมายังส่วนแพ็คเกจ
//     const handlePackageTypeClick = (index: number) => {
//         setSelectedPackageTypeId(index);
//         setPackageTypeID(index); // เก็บค่าใน Zustand

//         // ตรวจสอบว่า packageList ไม่ว่าง
//         if (packageList.length > 0 && packageSectionRef.current) {
//             packageSectionRef.current.scrollIntoView({ behavior: 'smooth' });
//         } else {
//             console.error("packageList is empty or invalid.");
//         }
//     };

//     const handlePackageModelClick = (index: number) => {
//         if (packageList[index] && packageList[index].MODEL) {
//             // console.log("Selected Package:", packageList[index]); // Debug ข้อมูล
//             setSelectedPackageModel(index); // อัปเดต selectedPackageModel
//             setModel(packageList[index].MODEL); // อัปเดต Model
//             setSelectedProductId(packageList[index].PRODUCTID); // อัปเดต Product ID
//         } else {
//             console.error("Invalid package data at index:", index);
//             setSelectedPackageModel(null); // หากข้อมูลไม่ถูกต้อง ตั้งค่า null
//         }
//     };

//     useEffect(() => {
//         // console.log("Package List:", packageList);
//     }, [packageList]);

//     useEffect(() => {
//         if (selectedPackageModel !== null && packageList[selectedPackageModel]) {
//             const selectedModel = packageList[selectedPackageModel].MODEL;
//             setModel(selectedModel); // อัปเดตค่า Model จาก packageList[selectedPackageModel]
//         }
//     }, [selectedPackageModel, packageList, setModel]);

//     const handleScanBarcodeClick = () => {
//         const isDesktop = !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//         if (isDesktop) {
//             Swal.fire({
//                 icon: "info",
//                 title: "ไม่รองรับ",
//                 text: "ฟีเจอร์สแกนบาร์โค้ด สามารถใช้งานได้เฉพาะบนมือถือหรือแท็บเล็ตเท่านั้น",
//             });
//             return;
//         }

//         navigate("/sale/scanbarcode"); // นำทางไปยังหน้าสแกนบาร์โค้ด
//     };

//     // const handleNextClick = async () => {
//     //     console.log("SaveProductData ก่อนส่ง:", SaveProductData);

//     //     try {
//     //         // Save product package
//     //         const response = await axios.post(SAVEPRODUCTPACKAGE, {
//     //             REFNO,
//     //             EMPID: EmpId,
//     //             TEAMSALE: TeamSale,
//     //             SALECODE: SaleCode,
//     //             SUPEMPID: SupEmpId,
//     //             SECEMPID: SecEmpId,
//     //             STATUS: "DRAFT",
//     //             PRODUCT: SaveProductData,
//     //         }, {
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //             },
//     //         });

//     //         const result = response.data;
//     //         console.log(`result`, result);

//     //         const newId = result.data._id; // ดึง _id จาก response

//     //         // อัปเดต state ด้วย _id ที่ได้รับจาก API
//     //         setProductId(newId);

//     //         const conditionCheckResponse = await axios.post(API_URL_POST_CONDITIONSCHECKHISTORY, {
//     //             EmpId, DivisionId, DepartId, DepartGroup, TeamSale, Model
//     //         }, {
//     //             headers: {
//     //                 'Content-Type': 'multipart/form-data',
//     //             },
//     //         });

//     //         setChecktype(conditionCheckResponse.data.checktype); // อัปเดตค่า checktype ใน state

//     //         let updateData;

//     //         if (conditionCheckResponse.data.checktype !== 0) {
//     //             const { value: idCard } = await MySwal.fire({
//     //                 title: 'ตรวจสอบประวัติลูกค้า',
//     //                 html: `
//     //                     <input
//     //                         id="idCardInput"
//     //                         type="text"
//     //                         class="form-control"
//     //                         placeholder="กรุณากรอกเลขบัตรประชาชน (13 หลัก)"
//     //                         maxlength="13"
//     //                         oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0,13);"
//     //                     />
//     //                 `,
//     //                 showCancelButton: true,
//     //                 confirmButtonText: 'ตรวจสอบ',
//     //                 cancelButtonText: 'ยกเลิก',
//     //                 preConfirm: async () => {
//     //                     const input = (document.getElementById('idCardInput') as HTMLInputElement).value;
//     //                     if (input.length === 13) {
//     //                         return input;
//     //                     } else {
//     //                         MySwal.showValidationMessage('กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก');
//     //                         return null;
//     //                     }
//     //                 }
//     //             });

//     //             if (idCard) {
//     //                 setSearch(idCard);
//     //                 const apiResponse = await axios.post(CHECKCUSTOMER_URL, { Search: idCard }, {
//     //                     headers: {
//     //                         'Content-Type': 'multipart/form-data',
//     //                     },
//     //                 });

//     //                 const { Customerstatus, message } = apiResponse.data;
//     //                 const destination = Customerstatus ? '/sale/overview' : '/sale/discount';

//     //                 await MySwal.fire({
//     //                     text: message,
//     //                     icon: Customerstatus ? 'success' : 'warning',
//     //                     timer: 2000, // แสดงผล 3 วินาที
//     //                     showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
//     //                 });

//     //                 updateData = [idCard, conditionCheckResponse.data.checktype, Customerstatus, message];
//     //                 navigate(destination); // นำทางไปยังหน้าที่ต้องการ
//     //             }
//     //         } else {
//     //             SETPRODUCT(result.data); // อัปเดต PRODUCT ใน Zustand store
//     //             updateData = ["", conditionCheckResponse.data.checktype, conditionCheckResponse.data.message];
//     //             navigate('/sale/discount'); // นำทางไปยังหน้า sale/discount
//     //         }

//     //         // เรียก API UPDATECONTACT หลังจากเสร็จสิ้นเงื่อนไขทั้งหมด
//     //         try {
//     //             const updateContract = await axios.post(UPDATECONTACT, {
//     //                 REFNO,
//     //                 EMPID: EmpId,
//     //                 TEAMSALE: TeamSale,
//     //                 FIELD: "CUSTOMERSTATUS",
//     //                 DATA: updateData,
//     //             }, {
//     //                 headers: {
//     //                     'Content-Type': 'application/json',
//     //                 },
//     //             });

//     //             // console.log(`updateContract CUSTOMERSTATUS: `, updateContract.data);

//     //             await MySwal.fire({
//     //                 icon: 'success',
//     //                 title: 'สำเร็จ!',
//     //                 text: 'บันทึกข้อมูลสินค้าเรียบร้อยแล้ว',
//     //                 timer: 2000, // แสดงผล 3 วินาที
//     //                 showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
//     //             });
//     //         } catch (error) {
//     //             console.error('Error updating contract:', error);
//     //             MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
//     //         }
//     //     } catch (error) {
//     //         console.error('Error saving product package:', error);
//     //         MySwal.fire({
//     //             title: 'เกิดข้อผิดพลาด',
//     //             text: 'ไม่สามารถบันทึกข้อมูลได้',
//     //             icon: 'error',
//     //             confirmButtonText: 'ตกลง'
//     //         });
//     //     }
//     // };

//     const handleNextClick = async () => {
//         console.log("SaveProductData ก่อนส่ง:", SaveProductData);
//         try {
//             // Save product package
//             const response = await axios.post(UPDATECONTACT, {
//                 REFNO,
//                 EMPID: EmpId,
//                 TEAMSALE: TeamSale,
//                 FIELD: "PRODUCT",
//                 DATA: SaveProductData,
//             }, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
//             const result = response.data;
//             console.log(`result`, result);

//             // เรียก API UPDATECONTACT หลังจากเสร็จสิ้นเงื่อนไขทั้งหมด
//             try {
//                 await MySwal.fire({
//                     icon: 'success',
//                     title: 'สำเร็จ!',
//                     text: 'บันทึกข้อมูลสินค้าเรียบร้อยแล้ว',
//                     timer: 2000, // แสดงผล 3 วินาที
//                     showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
//                 });
//                 navigate('/sale/discount')
//             } catch (error) {
//                 console.error('Error updating contract:', error);
//                 MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
//             }
//         } catch (error) {
//             console.error('Error saving product package:', error);
//             MySwal.fire({
//                 title: 'เกิดข้อผิดพลาด',
//                 text: 'ไม่สามารถบันทึกข้อมูลได้',
//                 icon: 'error',
//                 confirmButtonText: 'ตกลง'
//             });
//         }
//     };

//     return (
//         <>
//             {/* สแกนบาร์โค้ด */}
//             <div
//                 className="d-flex justify-content-center align-items-center mt-5 mx-7"
//                 style={{
//                     border: "1px solid #ccc",
//                     borderRadius: "10px",
//                     padding: "10px",
//                     backgroundColor: "#f9f9f9",
//                 }}
//                 onClick={handleScanBarcodeClick}
//             >
//                 <label
//                     className="btn btn-success px-5 w-200px"
//                     htmlFor="camera-input"
//                     style={{
//                         cursor: "pointer",
//                         borderRadius: "10px",
//                         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                     }}
//                 >
//                     สแกนบาร์โค้ด
//                 </label>
//             </div>
//             {/* สแกนบาร์โค้ด */}

//             <Content>
//                 <div className='d-flex justify-content-between align-items-center my-5'>
//                     <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
//                         data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//                         className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
//                         <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
//                             เลือกแพ็คเกจ
//                         </h1>
//                         <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//                             <li className="breadcrumb-item text-muted">
//                                 <span className="text-muted text-hover-primary">
//                                     ระบบขาย
//                                 </span></li>
//                             <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
//                             <li className="breadcrumb-item text-gray-900">เลือกแพ็คเกจ</li>
//                         </ul>
//                     </div>
//                 </div>
//                 <p>เลขที่ขาย: {REFNO}</p>

//                 <div className='accordion mb-10' id='kt_accordion_1'>
//                     <div className='accordion-item mb-10'>
//                         <h2 className='accordion-header' id='kt_accordion_1_header_1'>
//                             <h3
//                                 className='accordion-button fs-4 fw-bold border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
//                                 data-bs-toggle='collapse'
//                                 data-bs-target='#kt_accordion_1_body_1'
//                                 aria-expanded='true'
//                                 aria-controls='kt_accordion_1_body_1'
//                                 style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
//                             >
//                                 เลือกแพ็คเกจ
//                             </h3>
//                         </h2>

//                         <div
//                             id='kt_accordion_1_body_1'
//                             className='accordion-collapse collapse show'
//                             aria-labelledby='kt_accordion_1_header_1'
//                             data-bs-parent='#kt_accordion_1' >
//                             <div className='accordion-body'>
//                                 <form noValidate className='form'>
//                                     <div className='card-body px-lg-9 px-1'>
//                                         <div className='row'>

//                                             {barCode && (
//                                                 <label className='form-label fw-bold fs-3 mt-3'>S/N ที่สแกนได้: {barCode}</label>
//                                             )}

//                                             <div className='col-lg-6 my-7 my-xl-10'>
//                                                 <label className='form-label required fw-bold fs-3'>หมวดหมู่สินค้า</label>
//                                                 <select
//                                                     className='form-select'
//                                                     onChange={handleCateOptionChange}
//                                                 >
//                                                     <option value=''>เลือกหมวดหมู่สินค้า...</option>
//                                                     {(fetchCategory.length > 0 ? fetchCategory : categories).map((item: any, index: number) => (
//                                                         <option key={index} value={item.CategoriesId}>
//                                                             {item.DescriptionTH}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </div>

//                                         </div>

//                                         {/* แสดง Loading */}
//                                         {loadingProducts && (
//                                             <div className="text-center my-10">
//                                                 <ThreeDot />
//                                             </div>
//                                         )}

//                                         {/* หากไม่มีสินค้าให้แสดงข้อความนี้ */}
//                                         {!loadingProducts && selectedCategoryId.length > 0 && product.length === 0 && (
//                                             <div className='text-center my-7'>
//                                                 <h5>ไม่มีรายการสินค้า</h5>
//                                             </div>
//                                         )}

//                                         <>
//                                             {selectedCategoryId.length > 0 && product.length > 0 ? (
//                                                 <label className='form-label required fw-bold fs-3 mt-7 mt-xl-10'>รายการสินค้า</label>
//                                             ) : ('')}
//                                             {!loadingProducts && product.length > 0 && (
//                                                 <div className='row '>
//                                                     {product.map((item, index) => (
//                                                         <div
//                                                             className='col-6 col-md-4 mb-3 rounded'
//                                                             key={index}
//                                                             onClick={() => handleCardProductClick(index)}
//                                                             style={{ cursor: 'pointer' }}
//                                                         >
//                                                             <CardProduct
//                                                                 DescriptionTH={item.DescriptionTH}
//                                                                 ItemDescription={item.ItemDescription}
//                                                                 ItemCode={item.ItemCode}
//                                                                 SerialNo={item.SerialNo}
//                                                                 isSelected={selectedProductIndex === index}
//                                                             />
//                                                         </div>
//                                                     ))}

//                                                     <div className='row'>
//                                                         <div className='col-lg-6 my-7 my-xl-10'>
//                                                             <label className='form-label required fw-bold fs-3'>โปรโมชั่น</label>
//                                                             <select
//                                                                 className='form-select'
//                                                                 onChange={(e) => {
//                                                                     setSelectedPromotion(Number(e.target.value)); // แปลงค่า string เป็น number
//                                                                 }}
//                                                                 value={selectedPromotion ?? ''} // ใช้ nullish coalescing เพื่อป้องกันค่าที่เป็น null
//                                                             >
//                                                                 <option value=''>เลือกโปรโมชั่น...</option>
//                                                                 {promotion.map((item: any, index: number) => (
//                                                                     <option key={index} value={item?.PROMOTIONID}>
//                                                                         {item.PROMOTIONNAME}
//                                                                     </option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>

//                                                     {product.length !== 0 && (
//                                                         <div className='container my-10 my-xl-10'>
//                                                             <div className='row d-flex'>
//                                                                 <label className='form-label required fw-bold fs-3'>ประเภทการชำระ</label>
//                                                                 {packageType.map((item, index) => (
//                                                                     <div className='col-6 col-md-auto mb-2 d-flex align-items-center'>
//                                                                         <div
//                                                                             key={item.PACKAGETYPEID}
//                                                                             className={`border rounded w-100 w-md-auto h-60px
//                                                                             d-flex justify-content-center align-items-center fw-bold fs-6 px-5`}
//                                                                             style={{
//                                                                                 backgroundColor: selectedPackageTypeId === item.PACKAGETYPEID ? '#ACE1AF' : '#fcfcfc',
//                                                                                 transition: 'background-color 0.2s ease, color 0.2s ease',
//                                                                                 cursor: 'pointer'
//                                                                             }}
//                                                                             onClick={() => handlePackageTypeClick(item.PACKAGETYPEID)}
//                                                                         >
//                                                                             {item.PACKAGETYPENAME}
//                                                                         </div>
//                                                                     </div>
//                                                                 ))}
//                                                             </div>
//                                                         </div>
//                                                     )}

//                                                     {/* หากไม่มีแพ็คเกจให้แสดงข้อความนี้ */}
//                                                     {!loadingPackages && packageList.length === 0 && selectedCategoryId !== null && selectedProductIndex !== null && selectedPackageTypeId && (
//                                                         <div className='text-center my-7'>
//                                                             <h5>ไม่มีรายการแพ็คเกจ</h5>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             )}
//                                         </>

//                                         {/* ส่วนของแพ็คเกจที่จะเลื่อนมาที่นี่ */}
//                                         {/* แสดง Loading */}
//                                         {loadingPackages && (
//                                             <div className="text-center my-10">
//                                                 <ThreeDot />
//                                             </div>
//                                         )}

//                                         {/* แสดงแพ็คเกจหากโหลดเสร็จ */}
//                                         {!loadingPackages && packageList.length > 0 && selectedPackageTypeId !== null && (
//                                             <div className='my-10 my-xl-10' ref={packageSectionRef}>
//                                                 <div className='row d-flex'>
//                                                     <label className='form-label required fw-bold fs-3'>แพ็คเกจ</label>
//                                                     {packageList.map((item, index) => (
//                                                         <div
//                                                             className='col-12 col-md-4 col-sm-4 mb-2'
//                                                             key={item.MODEL || index}
//                                                             onClick={() => handlePackageModelClick(index)}
//                                                             style={{ cursor: 'pointer' }}
//                                                         >
//                                                             <CardPackage
//                                                                 PackageTitle={item.PACKAGETITLE || "No Title"}
//                                                                 isSelected={selectedPackageModel === index}
//                                                             />
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div >

//                 {/* ปุ่มในหน้าจอใหญ่ */}
//                 < div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10" >
//                     <button
//                         className="btn btn-secondary w-auto me-2"
//                         onClick={() => navigate('/sale/overview')}
//                     >
//                         กลับหน้าแรก
//                     </button>
//                     <button
//                         className={`btn btn-primary w-auto
//                 ${product.length === 0 || selectedProductIndex === null ? 'disabled' : ''}`}
//                         disabled={product.length === 0 || selectedProductIndex === null}
//                         onClick={handleNextClick}
//                     >
//                         บันทึก
//                     </button>
//                 </div >

//                 {/* ปุ่มในหน้าจอเล็ก */}
//                 < div
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
//                         className="btn btn-secondary w-auto me-2"
//                         onClick={() => navigate('/sale/overview')}
//                     >
//                         กลับหน้าแรก
//                     </button>
//                     <button
//                         className={`btn btn-primary w-auto
//                 ${product.length === 0 || selectedProductIndex === null ? 'disabled' : ''}`}
//                         disabled={product.length === 0 || selectedProductIndex === null}
//                         onClick={handleNextClick}
//                     >
//                         บันทึก
//                     </button>
//                 </div >

//             </Content >
//         </>
//     );
// }

// export default SalesPackage;

// import styles from '@/styles/style.module.css'
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { useState, useEffect, useRef, useMemo } from 'react';
// import { Content } from '../../../_metronic/layout/components/content';
// import { useAuth } from '../../modules/auth/core/Auth';
// import { useUUIDStore, useSaveProductStore } from '../../modules/stores/stepsStore';
// import '/public/splash-screen.css';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// import { ThreeDot } from 'react-loading-indicators';

// //useStore
// import {
//     useCategoryStore,
//     useFetchCategoryStore,
//     useProductStore,
//     usePackageStore,
//     useConditionsCheckHistoryStore
// } from '../../modules/stores/sales/packageStore/packageStore';

// //component
// import { CardProduct } from './components/cards/CardProduct';
// import { CardPackage } from './components/cards/CardPackage';
// import { log } from 'node:console';

// interface LocationState {
//     barCode?: any; // ระบุว่ามี barCode ใน state หรือไม่
// }

// const SalesPackage: React.FC = () => {
//     const location = useLocation();
//     const state = location.state as { barCode?: any } || {}; // เพิ่ม fallback เป็นอ็อบเจ็กต์ว่าง
//     const barCode = state.barCode; // กำหนดค่าเริ่มต้นเป็น "ยังไม่มีข้อมูล"
//     // console.log(`barCode`, barCode);

//     // State สำหรับตรวจสอบสถานะการโหลด
//     const [loadingCategories, setLoadingCategories] = useState(true);
//     const [loadingProducts, setLoadingProducts] = useState(false)
//     const [loadingPackages, setLoadingPackages] = useState(true)

//     const navigate = useNavigate(); // ใช้ useNavigate สำหรับการเปลี่ยนเส้นทาง
//     const MySwal = withReactContent(Swal);

//     const { REFNO } = useUUIDStore();

//     const { auth } = useAuth();

//     const { fetchCategory } = useFetchCategoryStore();
//     // console.log(`fetchCategory: `, fetchCategory);

//     const [categories, setCategories] = useState<any[]>([]);
//     console.log(`categories`, categories);

//     const [promotion, setPromotion] = useState<any[]>([]);
//     // console.log(`promotion`, promotion);

//     const [packageType, setPackageType] = useState<any[]>([]);
//     // console.log(`packageType: `, packageType);

//     const [packageList, setPackageList] = useState<any[]>([]);
//     // console.log(`packageList: `, packageList);

//     const [selectedCategoryId, setSelectedCategoryId] = useState<any>('');

//     const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
//     // console.log(`selectedProductIndex: `, selectedProductIndex);

//     const [selectedItemCode, setSelectedItemCode] = useState<string | null>(null);
//     // console.log(`selectedItemCode: `, selectedItemCode);

//     const [selectedItemDescription, setSelectedItemDescription] = useState<string | null>(null);
//     const [selectedDescriptionEN, setSelectedDescriptionEN] = useState<string | null>(null);
//     const [selectedDescriptionTH, setSelectedDescriptionTH] = useState<string | null>(null);
//     const [selectedSerialNo, setSelectedSerialNo] = useState<string | null>(null);
//     const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
//     const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
//     const [selectedTransDate, setSelectedTransDate] = useState<string | null>(null);
//     const [productId, setProductId] = useState(null);  // สร้าง state สำหรับเก็บ _id
//     // console.log(`productId: `, productId);

//     const [selectedPackageTypeId, setSelectedPackageTypeId] = useState<number | null>(null);
//     // console.log(`selectedPackageTypeId`, selectedPackageTypeId);

//     const [selectedPackageModel, setSelectedPackageModel] = useState<number | null>(null);
//     // console.log(`selectedPackageModel`, selectedPackageModel);

//     const [selectedProductId, setSelectedProductId] = useState<any>('');
//     // console.log(`selectedProductId`, selectedProductId);
//     const [selectedPromotion, setSelectedPromotion] = useState<string | number>('');
//     console.log(`selectedPromotion`, selectedPromotion);

//     const [checktype, setChecktype] = useState<number | null>(null);
//     // console.log(`checktype`, checktype);

//     const [Search, setSearch] = useState<string>(''); // เก็บค่าของเลขบัตรประชาชน
//     // console.log(`Search: `, Search);

//     const {
//         EmpId, setEmpId,
//         TeamSale, setTeamSale,
//         SaleCode, setSaleCode,
//         SupEmpId, setSupEmpId,
//         SecEmpId, setSecEmpId,
//         DivisionId, setDivisionId,
//         DepartId, setDepartId,
//         DepartGroup, setDepartGroup,
//     } = useCategoryStore();
//     // console.log(`EmpId`, EmpId);
//     // console.log(`EmpId`, EmpId);

//     // const getCategoryLocal = localStorage.getItem("fetchCategory");
//     // const parseGetCategoryLocal = getCategoryLocal ? JSON.parse(getCategoryLocal) : null;

//     const { product, setProduct } = useProductStore();
//     // console.log(`product: `, product);

//     const { ItemID, setItemID, PackageTypeID, setPackageTypeID } = usePackageStore();

//     const { Model, setModel } = useConditionsCheckHistoryStore();

//     const { PRODUCT, SETPRODUCT } = useSaveProductStore();

//     const SaveProductData = useMemo(() => [
//         {
//             EmpId: EmpId || '',
//             TeamSale: TeamSale || '',
//             SaleCode: "C000000000000",
//             ItemCode: selectedItemCode || '',
//             ItemDescription: selectedItemDescription || '',
//             CategoriesId: selectedCategoryId || '',
//             DescriptionEN: selectedDescriptionEN || '',
//             DescriptionTH: selectedDescriptionTH || '',
//             SerialNo: selectedSerialNo || '',
//             Status: selectedStatus || '',
//             Branch: selectedBranch || '',
//             TransDate: selectedTransDate || '',
//             PromotionId: selectedPromotion,
//             ProductId: productId,
//             Package: selectedPackageModel !== null
//                 ? [
//                     {
//                         MODEL: packageList[selectedPackageModel]?.MODEL || [],
//                         PACKAGETYPEID: selectedPackageTypeId ?? 0, // ดึงค่า selectedPackageTypeId แม้ selectedPackageModel จะไม่มี
//                         ORGANIZATIONCODE: packageList[selectedPackageModel]?.ORGANIZATIONCODE || [],
//                         ITEMID: packageList[selectedPackageModel]?.ITEMID || [],
//                         PRODUCTID: packageList[selectedPackageModel]?.PRODUCTID || [],
//                         PACKAGETITLE: packageList[selectedPackageModel]?.PACKAGETITLE || [],
//                         TOTALPRICE: packageList[selectedPackageModel]?.TOTALPRICE || [],
//                         HASTRADEIN: packageList[selectedPackageModel]?.HASTRADEIN || [],
//                         DISCOUNTPRICE: packageList[selectedPackageModel]?.DISCOUNTPRICE || [],
//                         SEQUENCE: packageList[selectedPackageModel]?.SEQUENCE || [],
//                         PERMITION_ACTIVE: packageList[selectedPackageModel]?.PERMITION_ACTIVE || [],
//                         FREEGIFT: packageList[selectedPackageModel]?.FREEGIFT || [],
//                         PERIODDETAILS: packageList[selectedPackageModel]?.PERIODDETAILS || []
//                     }
//                 ]
//                 : selectedPackageTypeId !== null
//                     ? [
//                         {
//                             MODEL: null, // หากไม่มี selectedPackageModel ให้ตั้งค่า MODEL เป็น null
//                             PACKAGETYPEID: selectedPackageTypeId, // เก็บค่าของ selectedPackageTypeId ได้โดยตรง
//                             ORGANIZATIONCODE: null,
//                             ITEMID: null,
//                             PRODUCTID: null,
//                             PACKAGETITLE: null,
//                             TOTALPRICE: null,
//                             HASTRADEIN: null,
//                             DISCOUNTPRICE: null,
//                             SEQUENCE: null,
//                             PERMITION_ACTIVE: null,
//                             FREEGIFT: null,
//                             PERIODDETAILS: null
//                         }
//                     ]
//                     : [], // หากไม่มีค่าใดเลย ให้เป็น array ว่าง
//         },
//     ], [
//         EmpId,
//         TeamSale,
//         SaleCode,
//         SupEmpId,
//         SecEmpId,
//         selectedItemCode,
//         selectedItemDescription,
//         selectedCategoryId,
//         selectedDescriptionEN,
//         selectedDescriptionTH,
//         selectedSerialNo,
//         selectedStatus,
//         selectedBranch,
//         selectedTransDate,
//         selectedPromotion,
//         selectedPackageModel,
//         selectedPackageTypeId,
//         packageList
//     ]);

//     const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
//     const CATEGORIES_URL = `${API_SALECONNEXT}/GetProduct/Categories`;
//     const PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageType`;
//     const PROMOTION_URL = `${API_SALECONNEXT}/GetProduct/ProductPromotionList`;
//     const POST_PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageList`;
//     const API_URL_POST_CONDITIONSCHECKHISTORY = `${API_SALECONNEXT}/ConditionsCheckHistory`;

//     const API_URL_POST_CHECKCUSTOMER = import.meta.env.VITE_APP_API_THIENSURAT;
//     const CHECKCUSTOMER_URL = `${API_URL_POST_CHECKCUSTOMER}/CheckCustomer`;

//     const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//     // const getProductUrl = () => `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`;
//     // const getProductUrl = `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}&sn=${barCode}`;
//     const SAVEPRODUCTPACKAGE = `${API_URL_MONGO}/Contract/saveProductPackage`;
//     const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

//     const GET_STOCK_URL = `${API_URL_MONGO}/Product/GetStock`;

//     // สร้าง ref สำหรับส่วนแพ็คเกจ
//     const packageSectionRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         postData()
//     }, [])

//     // const postData = async () => {
//     //     try {
//     //         const response = await axios.post(
//     //             CATEGORIES_URL,
//     //             { EmpId, DivisionId, DepartId, DepartGroup, TeamSale },
//     //             {
//     //                 headers: {
//     //                     'Content-Type': 'multipart/form-data',
//     //                     'Accept': 'multipart/form-data',
//     //                 },
//     //             }
//     //         );
//     //         const data = Array.isArray(response.data.data) ? response.data.data : [];

//     //         // เพิ่มฟิลเตอร์เฉพาะหมวดหมู่ที่มีสินค้า
//     //         const filteredCategories = data.filter((category: any) => category.hasProducts === true);

//     //         setCategories(filteredCategories);
//     //     } catch (error) {
//     //         console.error('Error fetching CATEGORIES_URL:', error);
//     //     } finally {
//     //         setLoadingCategories(false);
//     //     }
//     // };

//     const postData = async () => {
//         setLoadingCategories(true);
//         try {
//             const response = await axios.get(GET_STOCK_URL, {
//                 params: {
//                     empid: EmpId,
//                     teamSale: TeamSale,
//                 },
//             });
//             // แยก data จาก response
//             const raw = Array.isArray(response.data.data) ? response.data.data : [];
//             setCategories(raw);

//         } catch (error) {
//             console.error('Error fetching stock:', error);
//         } finally {
//             setLoadingCategories(false);
//         }
//     };

//     // // GET Product/GetStock?
//     // useEffect(() => {
//     //     const fetchProducts = async () => {
//     //         if (!selectedCategoryId) return;
//     //         setLoadingProducts(true); // เริ่มโหลดเมื่อเปลี่ยนหมวดหมู่สินค้า
//     //         try {
//     //             const response = await axios.get(getProductUrl(), {
//     //                 headers: {
//     //                     'Content-Type': 'application/json',
//     //                     'Accept': 'application/json',
//     //                 }
//     //             });
//     //             const data = Array.isArray(response.data.data) ? response.data.data : [];
//     //             setProduct(data); // บันทึกสินค้าใหม่
//     //         } catch (error) {
//     //             console.error('Error fetching products:', error);
//     //         } finally {
//     //             setLoadingProducts(false); // หยุดโหลดเมื่อดึงข้อมูลเสร็จ
//     //         }
//     //     };

//     //     fetchProducts();
//     // }, [selectedCategoryId]); // ทำงานเมื่อ selectedCategoryId เปลี่ยนแปลง

//     useEffect(() => {
//         setProduct([]); // ล้างข้อมูล product ทุกครั้งเมื่อเริ่มต้น
//         postData()
//     }, []);

//     // GET Product/GetStock?
//     useEffect(() => {
//         const fetchProducts = async () => {
//             setLoadingProducts(true);
//             try {
//                 // สร้าง URL ตามเงื่อนไข
//                 const url = selectedCategoryId
//                     ? `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`
//                     : `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&sn=${barCode}`;

//                 const response = await axios.get(url);

//                 const data = Array.isArray(response.data.data) ? response.data.data : [];
//                 setProduct(data);

//                 // เลือกสินค้าตัวแรกโดยอัตโนมัติหากมีบาร์โค้ด
//                 if (data.length === 1 && barCode) {
//                     setSelectedProductIndex(0);
//                     setSelectedItemCode(data[0].ItemCode);
//                     setItemID(data[0].ItemCode);
//                     setProductId(data[0].ProductID);
//                     setSelectedItemDescription(data[0].ItemDescription);
//                     setSelectedDescriptionEN(data[0].DescriptionEN);
//                     setSelectedDescriptionTH(data[0].DescriptionTH);
//                     setSelectedSerialNo(data[0].SerialNo);
//                     setSelectedStatus(data[0].Status);
//                     setSelectedBranch(data[0].Branch);
//                     setSelectedTransDate(data[0].TransDate);
//                 }
//             } catch (error) {
//                 console.error("Error fetching products:", error);
//             } finally {
//                 setLoadingProducts(false);
//             }
//         };

//         if (selectedCategoryId || barCode) {
//             fetchProducts();
//         }
//     }, [selectedCategoryId, barCode]);

//     // GetProduct/ProductPromotionList
//     useEffect(() => {
//         const fetchPromotion = async () => {
//             if (selectedProductIndex === null) return;
//             try {
//                 const response = await axios.post(PROMOTION_URL, {
//                     ProductID: productId,
//                     EmpId,
//                     DivisionId,
//                     DepartId,
//                     DepartGroup,
//                     TeamSale,
//                     ItemID: selectedItemCode
//                 }, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                         'Accept': 'multipart/form-data',
//                     }
//                 });
//                 const data = Array.isArray(response.data.data) ? response.data.data : [];
//                 setPromotion(data);
//             } catch (error) {
//                 console.error('Error fetching promotion:', error);
//             }
//         };

//         fetchPromotion();
//     }, [selectedProductIndex]);

//     // GET GetPackage/PackageType
//     useEffect(() => {
//         const getData = async () => {
//             try {
//                 const response = await axios.get(PACKAGE_URL, {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Accept': 'application/json',
//                     }
//                 });
//                 const data = Array.isArray(response.data.data) ? response.data.data : [];
//                 setPackageType(data);
//             } catch (error) {
//                 console.error('Error fetching PACKAGE_URL:', error);
//             }
//         };
//         getData();

//         setEmpId(auth.data[0].EmpId);
//         setTeamSale(auth.data[0].TeamSale);
//         setSaleCode(auth.data[0].SaleCode);
//         setSupEmpId(auth.data[0].SupEmp);
//         setSecEmpId(auth.data[0].SecEmp);
//         setDivisionId(auth.data[0].DivisionId);
//         setDepartId(auth.data[0].DepartId);
//         setDepartGroup(auth.data[0].DepartGroup);
//     }, []);

//     // POST GetPackage/PackageList
//     useEffect(() => {
//         const postData = async () => {
//             setLoadingPackages(true); // เริ่มโหลดข้อมูล
//             try {
//                 const response = await axios.post(POST_PACKAGE_URL,
//                     {
//                         EmpId,
//                         DivisionId,
//                         DepartId,
//                         DepartGroup,
//                         TeamSale,
//                         ItemID,
//                         PackageTypeID,
//                         PromotionID: selectedPromotion
//                     },
//                     {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         },
//                     }
//                 );

//                 const data = Array.isArray(response.data.data) ? response.data.data : [];

//                 // หน่วงเวลา 2 วินาทีก่อนแสดงผลข้อมูล
//                 setTimeout(() => {
//                     setPackageList(data); // อัปเดตแพ็คเกจหลังจากหน่วงเวลา
//                     setLoadingPackages(false); // หยุดแสดง loading หลังหน่วงเวลา
//                 }, 1000);

//             } catch (error) {
//                 console.error('Error fetching POST_PACKAGE_URL:', error);
//                 setLoadingPackages(false); // หยุดแสดง loading ถ้าเกิดข้อผิดพลาด
//             }
//         };

//         postData();
//     }, [EmpId, DivisionId, DepartId, DepartGroup, TeamSale, ItemID, PackageTypeID, selectedPromotion]);

//     useEffect(() => {
//         // console.log("SaveProductData:", SaveProductData);
//         if (JSON.stringify(SaveProductData) !== JSON.stringify(PRODUCT)) {
//             // console.log("Updating product in store...");
//             SETPRODUCT(SaveProductData);
//         }
//     }, [SaveProductData, PRODUCT, SETPRODUCT]);

//     // เลื่อนหน้าจอมายังแพ็คเกจ หากมีการเลือกประเภทการชำระ
//     useEffect(() => {
//         if (selectedPackageTypeId !== null && packageSectionRef.current) {
//             // เลื่อนหน้าจอไปยังแพ็คเกจเมื่อ selectedPackageTypeId ถูกอัปเดต
//             packageSectionRef.current.scrollIntoView({ behavior: 'smooth' });
//         }
//     }, [selectedPackageTypeId]);

//     const handleCateOptionChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const value = event.target.value;
//         setSelectedCategoryId(value);

//         // ล้างค่าทั้งหมดใน state ที่เกี่ยวข้อง
//         setProduct([]);
//         setSelectedProductIndex(null);
//         setSelectedItemCode(null);
//         setSelectedItemDescription(null);
//         setSelectedDescriptionEN(null);
//         setSelectedDescriptionTH(null);
//         setSelectedSerialNo(null); // ล้าง Serial Number
//         setSelectedStatus(null);
//         setSelectedBranch(null);
//         setSelectedTransDate(null);
//         setSelectedPromotion('');
//         setSelectedPackageTypeId(null);
//         setSelectedPackageModel(null);
//         setPackageList([]);

//         // ล้าง barCode
//         navigate("/sale/package", { state: { barCode: "" } });

//         if (value) {
//             try {
//                 setLoadingProducts(true);
//                 const response = await axios.get(
//                     `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${value}`
//                 );
//                 const data = Array.isArray(response.data.data) ? response.data.data : [];
//                 setProduct(data);
//             } catch (error) {
//                 console.error('Error fetching products:', error);
//             } finally {
//                 setLoadingProducts(false);
//             }
//         }
//     };

//     const handleCardProductClick = (index: number) => {
//         setSelectedProductIndex(index);
//         setSelectedItemCode(product[index].ItemCode);
//         setItemID(product[index].ItemCode);
//         setProductId(product[index].ProductID);
//         setSelectedItemDescription(product[index].ItemDescription);
//         setSelectedDescriptionEN(product[index].DescriptionEN);
//         setSelectedDescriptionTH(product[index].DescriptionTH);
//         setSelectedSerialNo(product[index].SerialNo);
//         setSelectedStatus(product[index].Status);
//         setSelectedBranch(product[index].Branch);
//         setSelectedTransDate(product[index].TransDate);
//     };

//     //เปลี่ยนสไตล์เป็น success เมื่อเลือกปุ่ม package และเลื่อนลงมายังส่วนแพ็คเกจ
//     const handlePackageTypeClick = (index: number) => {
//         setSelectedPackageTypeId(index);
//         setPackageTypeID(index); // เก็บค่าใน Zustand

//         // ตรวจสอบว่า packageList ไม่ว่าง
//         if (packageList.length > 0 && packageSectionRef.current) {
//             packageSectionRef.current.scrollIntoView({ behavior: 'smooth' });
//         } else {
//             console.error("packageList is empty or invalid.");
//         }
//     };

//     const handlePackageModelClick = (index: number) => {
//         if (packageList[index] && packageList[index].MODEL) {
//             // console.log("Selected Package:", packageList[index]); // Debug ข้อมูล
//             setSelectedPackageModel(index); // อัปเดต selectedPackageModel
//             setModel(packageList[index].MODEL); // อัปเดต Model
//             setSelectedProductId(packageList[index].PRODUCTID); // อัปเดต Product ID
//         } else {
//             console.error("Invalid package data at index:", index);
//             setSelectedPackageModel(null); // หากข้อมูลไม่ถูกต้อง ตั้งค่า null
//         }
//     };

//     useEffect(() => {
//         // console.log("Package List:", packageList);
//     }, [packageList]);

//     useEffect(() => {
//         if (selectedPackageModel !== null && packageList[selectedPackageModel]) {
//             const selectedModel = packageList[selectedPackageModel].MODEL;
//             setModel(selectedModel); // อัปเดตค่า Model จาก packageList[selectedPackageModel]
//         }
//     }, [selectedPackageModel, packageList, setModel]);

//     const handleScanBarcodeClick = () => {
//         const isDesktop = !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//         if (isDesktop) {
//             Swal.fire({
//                 icon: "info",
//                 title: "ไม่รองรับ",
//                 text: "ฟีเจอร์สแกนบาร์โค้ด สามารถใช้งานได้เฉพาะบนมือถือหรือแท็บเล็ตเท่านั้น",
//             });
//             return;
//         }

//         navigate("/sale/scanbarcode"); // นำทางไปยังหน้าสแกนบาร์โค้ด
//     };

//     // const handleNextClick = async () => {
//     //     console.log("SaveProductData ก่อนส่ง:", SaveProductData);

//     //     try {
//     //         // Save product package
//     //         const response = await axios.post(SAVEPRODUCTPACKAGE, {
//     //             REFNO,
//     //             EMPID: EmpId,
//     //             TEAMSALE: TeamSale,
//     //             SALECODE: SaleCode,
//     //             SUPEMPID: SupEmpId,
//     //             SECEMPID: SecEmpId,
//     //             STATUS: "DRAFT",
//     //             PRODUCT: SaveProductData,
//     //         }, {
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //             },
//     //         });

//     //         const result = response.data;
//     //         console.log(`result`, result);

//     //         const newId = result.data._id; // ดึง _id จาก response

//     //         // อัปเดต state ด้วย _id ที่ได้รับจาก API
//     //         setProductId(newId);

//     //         const conditionCheckResponse = await axios.post(API_URL_POST_CONDITIONSCHECKHISTORY, {
//     //             EmpId, DivisionId, DepartId, DepartGroup, TeamSale, Model
//     //         }, {
//     //             headers: {
//     //                 'Content-Type': 'multipart/form-data',
//     //             },
//     //         });

//     //         setChecktype(conditionCheckResponse.data.checktype); // อัปเดตค่า checktype ใน state

//     //         let updateData;

//     //         if (conditionCheckResponse.data.checktype !== 0) {
//     //             const { value: idCard } = await MySwal.fire({
//     //                 title: 'ตรวจสอบประวัติลูกค้า',
//     //                 html: `
//     //                     <input
//     //                         id="idCardInput"
//     //                         type="text"
//     //                         class="form-control"
//     //                         placeholder="กรุณากรอกเลขบัตรประชาชน (13 หลัก)"
//     //                         maxlength="13"
//     //                         oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0,13);"
//     //                     />
//     //                 `,
//     //                 showCancelButton: true,
//     //                 confirmButtonText: 'ตรวจสอบ',
//     //                 cancelButtonText: 'ยกเลิก',
//     //                 preConfirm: async () => {
//     //                     const input = (document.getElementById('idCardInput') as HTMLInputElement).value;
//     //                     if (input.length === 13) {
//     //                         return input;
//     //                     } else {
//     //                         MySwal.showValidationMessage('กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก');
//     //                         return null;
//     //                     }
//     //                 }
//     //             });

//     //             if (idCard) {
//     //                 setSearch(idCard);
//     //                 const apiResponse = await axios.post(CHECKCUSTOMER_URL, { Search: idCard }, {
//     //                     headers: {
//     //                         'Content-Type': 'multipart/form-data',
//     //                     },
//     //                 });

//     //                 const { Customerstatus, message } = apiResponse.data;
//     //                 const destination = Customerstatus ? '/sale/overview' : '/sale/discount';

//     //                 await MySwal.fire({
//     //                     text: message,
//     //                     icon: Customerstatus ? 'success' : 'warning',
//     //                     timer: 2000, // แสดงผล 3 วินาที
//     //                     showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
//     //                 });

//     //                 updateData = [idCard, conditionCheckResponse.data.checktype, Customerstatus, message];
//     //                 navigate(destination); // นำทางไปยังหน้าที่ต้องการ
//     //             }
//     //         } else {
//     //             SETPRODUCT(result.data); // อัปเดต PRODUCT ใน Zustand store
//     //             updateData = ["", conditionCheckResponse.data.checktype, conditionCheckResponse.data.message];
//     //             navigate('/sale/discount'); // นำทางไปยังหน้า sale/discount
//     //         }

//     //         // เรียก API UPDATECONTACT หลังจากเสร็จสิ้นเงื่อนไขทั้งหมด
//     //         try {
//     //             const updateContract = await axios.post(UPDATECONTACT, {
//     //                 REFNO,
//     //                 EMPID: EmpId,
//     //                 TEAMSALE: TeamSale,
//     //                 FIELD: "CUSTOMERSTATUS",
//     //                 DATA: updateData,
//     //             }, {
//     //                 headers: {
//     //                     'Content-Type': 'application/json',
//     //                 },
//     //             });

//     //             // console.log(`updateContract CUSTOMERSTATUS: `, updateContract.data);

//     //             await MySwal.fire({
//     //                 icon: 'success',
//     //                 title: 'สำเร็จ!',
//     //                 text: 'บันทึกข้อมูลสินค้าเรียบร้อยแล้ว',
//     //                 timer: 2000, // แสดงผล 3 วินาที
//     //                 showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
//     //             });
//     //         } catch (error) {
//     //             console.error('Error updating contract:', error);
//     //             MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
//     //         }
//     //     } catch (error) {
//     //         console.error('Error saving product package:', error);
//     //         MySwal.fire({
//     //             title: 'เกิดข้อผิดพลาด',
//     //             text: 'ไม่สามารถบันทึกข้อมูลได้',
//     //             icon: 'error',
//     //             confirmButtonText: 'ตกลง'
//     //         });
//     //     }
//     // };

//     const handleNextClick = async () => {
//         console.log("SaveProductData ก่อนส่ง:", SaveProductData);
//         try {
//             // Save product package
//             const response = await axios.post(UPDATECONTACT, {
//                 REFNO,
//                 EMPID: EmpId,
//                 TEAMSALE: TeamSale,
//                 FIELD: "PRODUCT",
//                 DATA: SaveProductData,
//             }, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
//             const result = response.data;
//             console.log(`result`, result);

//             // เรียก API UPDATECONTACT หลังจากเสร็จสิ้นเงื่อนไขทั้งหมด
//             try {
//                 await MySwal.fire({
//                     icon: 'success',
//                     title: 'สำเร็จ!',
//                     text: 'บันทึกข้อมูลสินค้าเรียบร้อยแล้ว',
//                     timer: 2000, // แสดงผล 3 วินาที
//                     showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
//                 });
//                 navigate('/sale/discount')
//             } catch (error) {
//                 console.error('Error updating contract:', error);
//                 MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
//             }
//         } catch (error) {
//             console.error('Error saving product package:', error);
//             MySwal.fire({
//                 title: 'เกิดข้อผิดพลาด',
//                 text: 'ไม่สามารถบันทึกข้อมูลได้',
//                 icon: 'error',
//                 confirmButtonText: 'ตกลง'
//             });
//         }
//     };

//     return (
//         <>
//             {/* สแกนบาร์โค้ด */}
//             <div
//                 className="d-flex justify-content-center align-items-center mt-5 mx-7"
//                 style={{
//                     border: "1px solid #ccc",
//                     borderRadius: "10px",
//                     padding: "10px",
//                     backgroundColor: "#f9f9f9",
//                 }}
//                 onClick={handleScanBarcodeClick}
//             >
//                 <label
//                     // className="btn btn-success px-5 w-200px"
//                     className={`${styles.btnSuccess}`}
//                     htmlFor="camera-input"
//                     style={{
//                         cursor: "pointer",
//                         borderRadius: "10px",
//                         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                     }}
//                 >
//                     สแกนบาร์โค้ด
//                 </label>
//             </div>
//             {/* สแกนบาร์โค้ด */}

//             <Content>
//                 <div className='d-flex justify-content-between align-items-center my-5'>
//                     <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
//                         data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//                         className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
//                         <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//                             <li className={`${styles.titlePage}`}>เลือกแพ็คเกจ</li>
//                         </ul>
//                     </div>
//                 </div>
//                 <p className={`${styles.fontSize}`}>เลขที่ขาย:</p><p className={`${styles.titlePage}`}>{REFNO}</p>

//                 <div className='accordion mb-10' id='kt_accordion_1'>
//                     <div className='accordion-item mb-10'>
//                         <h2 className='accordion-header' id='kt_accordion_1_header_1'>
//                             <h3
//                                 className='accordion-button fs-4 fw-bold border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
//                                 data-bs-toggle='collapse'
//                                 data-bs-target='#kt_accordion_1_body_1'
//                                 aria-expanded='true'
//                                 aria-controls='kt_accordion_1_body_1'
//                                 style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
//                             >
//                                 เลือกแพ็คเกจ
//                             </h3>
//                         </h2>

//                         <div
//                             id='kt_accordion_1_body_1'
//                             className='accordion-collapse collapse show'
//                             aria-labelledby='kt_accordion_1_header_1'
//                             data-bs-parent='#kt_accordion_1' >
//                             <div className='accordion-body'>
//                                 <form noValidate className='form'>
//                                     <div className='card-body px-lg-9 px-1'>
//                                         <div className='row'>

//                                             {barCode && (
//                                                 <label className={`form-label mb-5 ${styles.fontSize}`}>S/N ที่สแกนได้: {barCode}</label>
//                                             )}

//                                             {/* <div className='col-lg-6 my-7 my-xl-10'>
//                                                 <label className='form-label required fw-bold fs-3'>หมวดหมู่สินค้า</label>
//                                                 <select
//                                                     className='form-select'
//                                                     onChange={handleCateOptionChange}
//                                                 >
//                                                     <option value=''>เลือกหมวดหมู่สินค้า...</option>
//                                                     {(fetchCategory.length > 0 ? fetchCategory : categories).map((item: any, index: number) => (
//                                                         <option key={index} value={item.CategoriesId}>
//                                                             {item.DescriptionTH}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </div> */}

//                                         </div>

//                                         {/* แสดง Loading */}
//                                         {loadingProducts && (
//                                             <div className="text-center my-10">
//                                                 <ThreeDot />
//                                             </div>
//                                         )}

//                                         {/* หากไม่มีสินค้าให้แสดงข้อความนี้ */}
//                                         {!loadingProducts && selectedCategoryId.length > 0 && product.length === 0 && (
//                                             <div className='text-center my-7'>
//                                                 <h5>ไม่มีรายการสินค้า</h5>
//                                             </div>
//                                         )}

//                                         <>
//                                             {selectedCategoryId.length > 0 && product.length > 0 ? (
//                                                 <label className='form-label required fw-bold fs-3 mt-7 mt-xl-10'>รายการสินค้า</label>
//                                             ) : ('')}
//                                             {!loadingProducts && product.length > 0 && (
//                                                 <div className='row '>
//                                                     {product.map((item, index) => (
//                                                         <div
//                                                             className='col-6 col-md-4 mb-3 rounded'
//                                                             key={index}
//                                                             onClick={() => handleCardProductClick(index)}
//                                                             style={{ cursor: 'pointer' }}
//                                                         >
//                                                             <CardProduct
//                                                                 DescriptionTH={item.DescriptionTH}
//                                                                 ItemDescription={item.ItemDescription}
//                                                                 ItemCode={item.ItemCode}
//                                                                 SerialNo={item.SerialNo}
//                                                                 isSelected={selectedProductIndex === index}
//                                                             />
//                                                         </div>
//                                                     ))}

//                                                     <div className='row'>
//                                                         <div className='col-lg-6 my-7 my-xl-10'>
//                                                             <label className={`form-label required ${styles.fontSize}`}>โปรโมชั่น</label>
//                                                             <select
//                                                                 className={`${styles.fontSize} form-select`}
//                                                                 onChange={(e) => {
//                                                                     setSelectedPromotion(Number(e.target.value)); // แปลงค่า string เป็น number
//                                                                 }}
//                                                                 value={selectedPromotion ?? ''} // ใช้ nullish coalescing เพื่อป้องกันค่าที่เป็น null
//                                                             >
//                                                                 <option value=''>เลือกโปรโมชั่น</option>
//                                                                 {promotion.map((item: any, index: number) => (
//                                                                     <option key={index} value={item?.PROMOTIONID}>
//                                                                         {item.PROMOTIONNAME}
//                                                                     </option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>

//                                                     {product.length !== 0 && (
//                                                         <div className='container my-10 my-xl-10'>
//                                                             <div className='row d-flex'>
//                                                                 <label className={`form-label required ${styles.fontSize}`}>ประเภทการชำระ</label>
//                                                                 {packageType.map((item, index) => (
//                                                                     <div className='col-6 col-md-auto mb-2 d-flex align-items-center'>
//                                                                         <div
//                                                                             key={item.PACKAGETYPEID}
//                                                                             className={`border rounded w-100 w-md-auto h-60px
//                                                                             d-flex justify-content-center align-items-center fw-bold fs-6 px-5`}
//                                                                             style={{
//                                                                                 backgroundColor: selectedPackageTypeId === item.PACKAGETYPEID ? '#ACE1AF' : '#fcfcfc',
//                                                                                 transition: 'background-color 0.2s ease, color 0.2s ease',
//                                                                                 cursor: 'pointer'
//                                                                             }}
//                                                                             onClick={() => handlePackageTypeClick(item.PACKAGETYPEID)}
//                                                                         >
//                                                                             <p className={`${styles.fontSize}`}>{item.PACKAGETYPENAME}</p>
//                                                                         </div>
//                                                                     </div>
//                                                                 ))}
//                                                             </div>
//                                                         </div>
//                                                     )}

//                                                     {/* หากไม่มีแพ็คเกจให้แสดงข้อความนี้ */}
//                                                     {!loadingPackages && packageList.length === 0 && selectedCategoryId !== null && selectedProductIndex !== null && selectedPackageTypeId && (
//                                                         <div className='text-center my-7'>
//                                                             <h5 className={`${styles.fontSize}`}>ไม่มีรายการแพ็คเกจ</h5>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             )}
//                                         </>

//                                         {/* ส่วนของแพ็คเกจที่จะเลื่อนมาที่นี่ */}
//                                         {/* แสดง Loading */}
//                                         {loadingPackages && (
//                                             <div className="text-center my-10">
//                                                 <ThreeDot />
//                                             </div>
//                                         )}

//                                         {/* แสดงแพ็คเกจหากโหลดเสร็จ */}
//                                         {!loadingPackages && packageList.length > 0 && selectedPackageTypeId !== null && (
//                                             <div className='my-10 my-xl-10' ref={packageSectionRef}>
//                                                 <div className='row d-flex'>
//                                                     <label className={`form-label required ${styles.fontSize}`}>แพ็คเกจ</label>
//                                                     {packageList.map((item, index) => (
//                                                         <div
//                                                             className='col-12 col-md-4 col-sm-4 mb-2'
//                                                             key={item.MODEL || index}
//                                                             onClick={() => handlePackageModelClick(index)}
//                                                             style={{ cursor: 'pointer' }}
//                                                         >
//                                                             <CardPackage
//                                                                 PackageTitle={item.PACKAGETITLE || "No Title"}
//                                                                 isSelected={selectedPackageModel === index}
//                                                             />
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div >

//                 {/* ปุ่มในหน้าจอใหญ่ */}
//                 < div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10" >
//                     <button
//                         className={`${styles.btnSecondary}`}
//                         onClick={() => navigate('/sale/overview')}
//                     >
//                         กลับหน้าแรก
//                     </button>
//                     <button
//                         className={`${styles.btnPrimary}
//                 ${product.length === 0 || selectedProductIndex === null ? 'disabled' : ''}`}
//                         disabled={product.length === 0 || selectedProductIndex === null}
//                         onClick={handleNextClick}
//                     >
//                         ถัดไป
//                     </button>
//                 </div >

//                 {/* ปุ่มในหน้าจอเล็ก */}
//                 < div
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
//                         onClick={() => navigate('/sale/overview')}
//                     >
//                         กลับหน้าแรก
//                     </button>
//                     <button
//                         className={`${styles.btnPrimary}
//                 ${product.length === 0 || selectedProductIndex === null ? 'disabled' : ''}`}
//                         disabled={product.length === 0 || selectedProductIndex === null}
//                         onClick={handleNextClick}
//                     >
//                         ถัดไป
//                     </button>
//                 </div >

//             </Content >
//         </>
//     );
// }

// export default SalesPackage;

// import styles from '@/styles/style.module.css'
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { useState, useEffect, useRef, useMemo } from 'react';
// import { Content } from '../../../_metronic/layout/components/content';
// import { useAuth } from '../../modules/auth/core/Auth';
// import { useUUIDStore, useSaveProductStore } from '../../modules/stores/stepsStore';
// import '/public/splash-screen.css';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// import { ThreeDot } from 'react-loading-indicators';

// //useStore
// import {
//     useCategoryStore,
//     useFetchCategoryStore,
//     useProductStore,
//     usePackageStore,
//     useConditionsCheckHistoryStore
// } from '../../modules/stores/sales/packageStore/packageStore';

// //component
// import { CardProduct } from './components/cards/CardProduct';
// import { CardPackage } from './components/cards/CardPackage';
// import { log } from 'node:console';

// interface LocationState {
//     barCode?: any; // ระบุว่ามี barCode ใน state หรือไม่
// }

// const SalesPackage: React.FC = () => {
//     const location = useLocation();

//     const state = location.state as { barCode?: any } || {}; // เพิ่ม fallback เป็นอ็อบเจ็กต์ว่าง
//     const barCode = state.barCode; // กำหนดค่าเริ่มต้นเป็น "ยังไม่มีข้อมูล"
//     // console.log(`barCode`, barCode);
//     // State สำหรับตรวจสอบสถานะการโหลด
//     const [loadingCategories, setLoadingCategories] = useState(true);
//     const [loadingProducts, setLoadingProducts] = useState(false)
//     const [loadingPackages, setLoadingPackages] = useState(true)

//     const navigate = useNavigate(); // ใช้ useNavigate สำหรับการเปลี่ยนเส้นทาง
//     const MySwal = withReactContent(Swal);

//     const { REFNO } = useUUIDStore();

//     const { auth } = useAuth();

//     const { fetchCategory } = useFetchCategoryStore();
//     // console.log(`fetchCategory: `, fetchCategory);

//     const [categories, setCategories] = useState<any[]>([]);
//     console.log(`categories`, categories);

//     const [promotion, setPromotion] = useState<any[]>([]);
//     // console.log(`promotion`, promotion);

//     const [packageType, setPackageType] = useState<any[]>([]);
//     // console.log(`packageType: `, packageType);

//     const [packageList, setPackageList] = useState<any[]>([]);
//     // console.log(`packageList: `, packageList);

//     const [selectedCategoryId, setSelectedCategoryId] = useState<any>('');

//     const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
//     // console.log(`selectedProductIndex: `, selectedProductIndex);

//     const [selectedItemCode, setSelectedItemCode] = useState<string | null>(null);
//     console.log(`selectedItemCode: `, selectedItemCode);

//     const [selectedItemDescription, setSelectedItemDescription] = useState<string | null>(null);
//     const [selectedDescriptionEN, setSelectedDescriptionEN] = useState<string | null>(null);
//     const [selectedDescriptionTH, setSelectedDescriptionTH] = useState<string | null>(null);
//     const [selectedSerialNo, setSelectedSerialNo] = useState<string | null>(null);
//     const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
//     const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
//     const [selectedTransDate, setSelectedTransDate] = useState<string | null>(null);
//     const [productId, setProductId] = useState(null);  // สร้าง state สำหรับเก็บ _id
//     // console.log(`productId: `, productId);

//     const [selectedPackageTypeId, setSelectedPackageTypeId] = useState<number | null>(null);
//     // console.log(`selectedPackageTypeId`, selectedPackageTypeId);

//     const [selectedPackageModel, setSelectedPackageModel] = useState<number | null>(null);
//     // console.log(`selectedPackageModel`, selectedPackageModel);

//     const [selectedProductId, setSelectedProductId] = useState<any>('');
//     // console.log(`selectedProductId`, selectedProductId);
//     const [selectedPromotion, setSelectedPromotion] = useState<string | number>('');
//     // console.log(`selectedPromotion`, selectedPromotion);

//     const [checktype, setChecktype] = useState<number | null>(null);
//     // console.log(`checktype`, checktype);

//     const [Search, setSearch] = useState<string>(''); // เก็บค่าของเลขบัตรประชาชน
//     // console.log(`Search: `, Search);

//     const [isCheckingBundle, setIsCheckingBundle] = useState(false);
//     const [isBundle, setIsBundle] = useState<any[]>([]);

//     const {
//         EmpId, setEmpId,
//         TeamSale, setTeamSale,
//         SaleCode, setSaleCode,
//         SupEmpId, setSupEmpId,
//         SecEmpId, setSecEmpId,
//         DivisionId, setDivisionId,
//         DepartId, setDepartId,
//         DepartGroup, setDepartGroup,
//     } = useCategoryStore();
//     console.log(`DepartGroup`, DepartGroup);
//     // console.log(`EmpId`, EmpId);

//     // const getCategoryLocal = localStorage.getItem("fetchCategory");
//     // const parseGetCategoryLocal = getCategoryLocal ? JSON.parse(getCategoryLocal) : null;

//     const { product, setProduct } = useProductStore();
//     // console.log(`product: `, product);

//     const { ItemID, setItemID, PackageTypeID, setPackageTypeID } = usePackageStore();

//     const { Model, setModel } = useConditionsCheckHistoryStore();

//     const { PRODUCT, SETPRODUCT } = useSaveProductStore();

//     const SaveProductData = useMemo(() => [
//         {
//             EmpId: EmpId || '',
//             TeamSale: TeamSale || '',
//             SaleCode: "C000000000000",
//             ItemCode: selectedItemCode || '',
//             ItemDescription: selectedItemDescription || '',
//             CategoriesId: selectedCategoryId || '',
//             DescriptionEN: selectedDescriptionEN || '',
//             DescriptionTH: selectedDescriptionTH || '',
//             SerialNo: selectedSerialNo || '',
//             Status: selectedStatus || '',
//             Branch: selectedBranch || '',
//             TransDate: selectedTransDate || '',
//             PromotionId: selectedPromotion,
//             ProductId: productId,
//             Package: selectedPackageModel !== null
//                 ? [
//                     {
//                         MODEL: packageList[selectedPackageModel]?.MODEL || [],
//                         PACKAGETYPEID: selectedPackageTypeId ?? 0, // ดึงค่า selectedPackageTypeId แม้ selectedPackageModel จะไม่มี
//                         ORGANIZATIONCODE: packageList[selectedPackageModel]?.ORGANIZATIONCODE || [],
//                         ITEMID: packageList[selectedPackageModel]?.ITEMID || [],
//                         PRODUCTID: packageList[selectedPackageModel]?.PRODUCTID || [],
//                         PACKAGETITLE: packageList[selectedPackageModel]?.PACKAGETITLE || [],
//                         TOTALPRICE: packageList[selectedPackageModel]?.TOTALPRICE || [],
//                         HASTRADEIN: packageList[selectedPackageModel]?.HASTRADEIN || [],
//                         DISCOUNTPRICE: packageList[selectedPackageModel]?.DISCOUNTPRICE || [],
//                         SEQUENCE: packageList[selectedPackageModel]?.SEQUENCE || [],
//                         PERMITION_ACTIVE: packageList[selectedPackageModel]?.PERMITION_ACTIVE || [],
//                         FREEGIFT: packageList[selectedPackageModel]?.FREEGIFT || [],
//                         PERIODDETAILS: packageList[selectedPackageModel]?.PERIODDETAILS || []
//                     }
//                 ]
//                 : selectedPackageTypeId !== null
//                     ? [
//                         {
//                             MODEL: null, // หากไม่มี selectedPackageModel ให้ตั้งค่า MODEL เป็น null
//                             PACKAGETYPEID: selectedPackageTypeId, // เก็บค่าของ selectedPackageTypeId ได้โดยตรง
//                             ORGANIZATIONCODE: null,
//                             ITEMID: null,
//                             PRODUCTID: null,
//                             PACKAGETITLE: null,
//                             TOTALPRICE: null,
//                             HASTRADEIN: null,
//                             DISCOUNTPRICE: null,
//                             SEQUENCE: null,
//                             PERMITION_ACTIVE: null,
//                             FREEGIFT: null,
//                             PERIODDETAILS: null
//                         }
//                     ]
//                     : [], // หากไม่มีค่าใดเลย ให้เป็น array ว่าง
//         },
//     ], [
//         EmpId,
//         TeamSale,
//         SaleCode,
//         SupEmpId,
//         SecEmpId,
//         selectedItemCode,
//         selectedItemDescription,
//         selectedCategoryId,
//         selectedDescriptionEN,
//         selectedDescriptionTH,
//         selectedSerialNo,
//         selectedStatus,
//         selectedBranch,
//         selectedTransDate,
//         selectedPromotion,
//         selectedPackageModel,
//         selectedPackageTypeId,
//         packageList
//     ]);

//     const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
//     const CATEGORIES_URL = `${API_SALECONNEXT}/GetProduct/Categories`;
//     const PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageType`;
//     const PROMOTION_URL = `${API_SALECONNEXT}/GetProduct/ProductPromotionList`;
//     const POST_PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageList`;
//     const API_URL_POST_CONDITIONSCHECKHISTORY = `${API_SALECONNEXT}/ConditionsCheckHistory`;
//     const CHECK_PRODUCT_BUNDLE = `${API_SALECONNEXT}/GetProduct/CheckProductBundle`;

//     const API_URL_POST_CHECKCUSTOMER = import.meta.env.VITE_APP_API_THIENSURAT;
//     const CHECKCUSTOMER_URL = `${API_URL_POST_CHECKCUSTOMER}/CheckCustomer`;

//     const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//     // const getProductUrl = () => `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`;
//     // const getProductUrl = `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}&sn=${barCode}`;
//     const SAVEPRODUCTPACKAGE = `${API_URL_MONGO}/Contract/saveProductPackage`;
//     const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

//     const GET_STOCK_URL = `${API_URL_MONGO}/Product/GetStock`;

//     // สร้าง ref สำหรับส่วนแพ็คเกจ
//     const packageSectionRef = useRef<HTMLDivElement>(null);

//     // ดึงงวดการผ่อนจากแพ็คเกจที่เลือก
//     const periods = packageList[selectedPackageModel!]?.PERIODDETAILS ?? [];

//     useEffect(() => {
//         // รอจนกว่าทั้ง 2 ตัวนี้จะมีค่า
//         if (EmpId && TeamSale) {
//             postData();
//         }
//     }, [EmpId, TeamSale]);

//     // const postData = async () => {
//     //     try {
//     //         const response = await axios.post(
//     //             CATEGORIES_URL,
//     //             { EmpId, DivisionId, DepartId, DepartGroup, TeamSale },
//     //             {
//     //                 headers: {
//     //                     'Content-Type': 'multipart/form-data',
//     //                     'Accept': 'multipart/form-data',
//     //                 },
//     //             }
//     //         );
//     //         const data = Array.isArray(response.data.data) ? response.data.data : [];

//     //         // เพิ่มฟิลเตอร์เฉพาะหมวดหมู่ที่มีสินค้า
//     //         const filteredCategories = data.filter((category: any) => category.hasProducts === true);

//     //         setCategories(filteredCategories);
//     //     } catch (error) {
//     //         console.error('Error fetching CATEGORIES_URL:', error);
//     //     } finally {
//     //         setLoadingCategories(false);
//     //     }
//     // };

//     //// ใช้อยู่
//     // const postData = async () => {
//     //     setLoadingCategories(true);
//     //     try {
//     //         const response = await axios.get(GET_STOCK_URL, {
//     //             params: {
//     //                 empid: EmpId,
//     //                 teamSale: TeamSale,
//     //             },
//     //         });
//     //         // แยก data จาก response
//     //         const raw = Array.isArray(response.data.data) ? response.data.data : [];
//     //         setCategories(raw);

//     //     } catch (error) {
//     //         console.error('Error fetching stock:', error);
//     //     } finally {
//     //         setLoadingCategories(false);
//     //     }
//     // };

//     const postData = async () => {
//         setLoadingCategories(true);
//         try {
//             const response = await axios.get(GET_STOCK_URL, {
//                 params: { empid: EmpId, teamSale: TeamSale },
//             });
//             const raw: any[] = Array.isArray(response.data.data)
//                 ? response.data.data
//                 : [];

//             // ดึงเฉพาะ { CategoriesId, DescriptionTH } ไม่ซ้ำกัน
//             const cats = raw.reduce((acc: any[], item) => {
//                 if (!acc.some(c => c.CategoriesId === item.CategoriesId)) {
//                     acc.push({
//                         CategoriesId: item.CategoriesId,
//                         DescriptionTH: item.DescriptionTH   // หรือชื่อ field จริงจาก API
//                     });
//                 }
//                 return acc;
//             }, []);

//             setCategories(cats);
//         } catch (error) {
//             console.error('Error fetching stock for categories:', error);
//         } finally {
//             setLoadingCategories(false);
//         }
//     };

//     // // GET Product/GetStock?
//     // useEffect(() => {
//     //     const fetchProducts = async () => {
//     //         if (!selectedCategoryId) return;
//     //         setLoadingProducts(true); // เริ่มโหลดเมื่อเปลี่ยนหมวดหมู่สินค้า
//     //         try {
//     //             const response = await axios.get(getProductUrl(), {
//     //                 headers: {
//     //                     'Content-Type': 'application/json',
//     //                     'Accept': 'application/json',
//     //                 }
//     //             });
//     //             const data = Array.isArray(response.data.data) ? response.data.data : [];
//     //             setProduct(data); // บันทึกสินค้าใหม่
//     //         } catch (error) {
//     //             console.error('Error fetching products:', error);
//     //         } finally {
//     //             setLoadingProducts(false); // หยุดโหลดเมื่อดึงข้อมูลเสร็จ
//     //         }
//     //     };

//     //     fetchProducts();
//     // }, [selectedCategoryId]); // ทำงานเมื่อ selectedCategoryId เปลี่ยนแปลง

//     useEffect(() => {
//         setProduct([]); // ล้างข้อมูล product ทุกครั้งเมื่อเริ่มต้น
//         postData()
//     }, []);

//     // GET Product/GetStock?
//     // useEffect(() => {
//     //     const fetchProducts = async () => {
//     //         setLoadingProducts(true);
//     //         try {
//     //             // สร้าง URL ตามเงื่อนไข
//     //             const url = selectedCategoryId
//     //                 ? `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`
//     //                 : `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&sn=${barCode}`;

//     //             const response = await axios.get(url);

//     //             const data = Array.isArray(response.data.data) ? response.data.data : [];
//     //             setProduct(data);

//     //             // ถ้ามี barCode แต่ไม่พบสินค้า ให้แจ้งเตือน
//     //             if (data.length === 0) {
//     //                 Swal.fire({
//     //                     icon: 'warning',
//     //                     title: 'ไม่พบสินค้า',
//     //                     text: `ไม่พบสินค้า ${barCode} ในคลัง`,
//     //                     confirmButtonText: 'ตกลง'
//     //                 });
//     //             }

//     //             if (data.length === 1) {
//     //                 try {
//     //                     const response = await axios.post(CHECK_PRODUCT_BUNDLE, {
//     //                         ProductID: productId,
//     //                         EmpId,
//     //                         DivisionId,
//     //                         DepartId,
//     //                         DepartGroup,
//     //                         TeamSale,
//     //                         ItemID: selectedItemCode
//     //                     }, {
//     //                         headers: {
//     //                             'Content-Type': 'multipart/form-data',
//     //                             'Accept': 'multipart/form-data',
//     //                         }
//     //                     });
//     //                     const data = Array.isArray(response.data.data) ? response.data.data : [];
//     //                     console.log(`setIsBundle`, data);
//     //                     setIsBundle(data);
//     //                 } catch (error) {
//     //                     console.error('Error fetching CHECK_PRODUCT_BUNDLE:', error);
//     //                 }
//     //             };

//     //             // เลือกสินค้าตัวแรกโดยอัตโนมัติหากมีบาร์โค้ด
//     //             if (data.length === 1 && barCode) {
//     //                 setSelectedProductIndex(0);
//     //                 setSelectedItemCode(data[0].ItemCode);
//     //                 setItemID(data[0].ItemCode);
//     //                 setProductId(data[0].ProductID);
//     //                 setSelectedItemDescription(data[0].ItemDescription);
//     //                 setSelectedDescriptionEN(data[0].DescriptionEN);
//     //                 setSelectedDescriptionTH(data[0].DescriptionTH);
//     //                 setSelectedSerialNo(data[0].SerialNo);
//     //                 setSelectedStatus(data[0].Status);
//     //                 setSelectedBranch(data[0].Branch);
//     //                 setSelectedTransDate(data[0].TransDate);
//     //             }
//     //         } catch (error) {
//     //             console.error("Error fetching products:", error);
//     //         } finally {
//     //             setLoadingProducts(false);
//     //         }
//     //     };

//     //     if (selectedCategoryId || barCode) {
//     //         fetchProducts();
//     //     }
//     // }, [selectedCategoryId, barCode]);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             setLoadingProducts(true);
//             try {
//                 const url = selectedCategoryId
//                     ? `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`
//                     : `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&sn=${barCode}`;
//                 const res = await axios.get(url);
//                 const data = Array.isArray(res.data.data) ? res.data.data : [];
//                 console.log(`data`, data);

//                 // ถ้ามี SN แต่ไม่เจอสินค้า
//                 if (barCode && data.length === 0) {
//                     await Swal.fire({
//                         icon: 'warning',
//                         title: 'ไม่พบสินค้า',
//                         text: `ไม่พบสินค้า ${barCode} ในคลัง`,
//                         confirmButtonText: 'ตกลง'
//                     });
//                 }

//                 // ถ้าพบสินค้า 1 รายการ ให้เช็ค bundle ก่อน
//                 if (barCode && data.length > 0) {
//                     setIsCheckingBundle(true);
//                     console.log(`ProductID`, productId);
//                     console.log(`ItemID`, selectedItemCode);

//                     try {
//                         const bundleRes = await axios.post(CHECK_PRODUCT_BUNDLE, {
//                             ProductID: productId,
//                             EmpId,
//                             DivisionId,
//                             DepartId,
//                             DepartGroup,
//                             TeamSale,
//                             ItemID: selectedItemCode
//                         }, {
//                             headers: {
//                                 'Content-Type': 'multipart/form-data',
//                                 'Accept': 'multipart/form-data'
//                             }
//                         });
//                         console.log(`bundleRes`, bundleRes);
//                         setIsBundle(Array.isArray(bundleRes.data.data) ? bundleRes.data.data : []);

//                     } catch (err) {
//                         console.error('Error fetching bundle:', err);
//                     } finally {
//                         setIsCheckingBundle(false);
//                     }

//                     // ออโต้เลือกสินค้า และดึง detail ต่างๆ
//                     if (barCode) {
//                         const item = data[0];
//                         setSelectedProductIndex(0);
//                         setSelectedItemCode(item.ItemCode);
//                         setItemID(item.ItemCode);
//                         setProductId(item.ProductID);
//                         setSelectedItemDescription(item.ItemDescription);
//                         setSelectedDescriptionEN(item.DescriptionEN);
//                         setSelectedDescriptionTH(item.DescriptionTH);
//                         setSelectedSerialNo(item.SerialNo);
//                         setSelectedStatus(item.Status);
//                         setSelectedBranch(item.Branch);
//                         setSelectedTransDate(item.TransDate);
//                     }
//                 }

//                 // สุดท้ายค่อยเซ็ต product
//                 // setProduct(data);
//             } catch (error) {
//                 console.error("Error fetching products:", error);
//             } finally {
//                 setLoadingProducts(false);
//             }
//         };

//         if (selectedCategoryId || barCode) {
//             fetchProducts();
//         }
//     }, [selectedCategoryId, barCode]);

//     // GetProduct/ProductPromotionList
//     useEffect(() => {
//         const fetchPromotion = async () => {
//             if (selectedProductIndex === null) return;
//             try {
//                 const response = await axios.post(PROMOTION_URL, {
//                     ProductID: productId,
//                     EmpId,
//                     DivisionId,
//                     DepartId,
//                     DepartGroup,
//                     TeamSale,
//                     ItemID: selectedItemCode,
//                     // IsBundle
//                 }, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                         'Accept': 'multipart/form-data',
//                     }
//                 });
//                 const data = Array.isArray(response.data.data) ? response.data.data : [];
//                 setPromotion(data);
//             } catch (error) {
//                 console.error('Error fetching promotion:', error);
//             }
//         };

//         fetchPromotion();
//     }, [selectedProductIndex]);

//     // GET GetPackage/PackageType
//     useEffect(() => {
//         const getData = async () => {
//             try {
//                 const response = await axios.get(PACKAGE_URL, {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Accept': 'application/json',
//                     }
//                 });
//                 const data = Array.isArray(response.data.data) ? response.data.data : [];
//                 setPackageType(data);
//             } catch (error) {
//                 console.error('Error fetching PACKAGE_URL:', error);
//             }
//         };
//         getData();

//         setEmpId(auth.data[0].EmpId);
//         setTeamSale(auth.data[0].TeamSale);
//         setSaleCode(auth.data[0].SaleCode);
//         setSupEmpId(auth.data[0].SupEmp);
//         setSecEmpId(auth.data[0].SecEmp);
//         setDivisionId(auth.data[0].DivisionId);
//         setDepartId(auth.data[0].DepartId);
//         setDepartGroup(auth.data[0].DepartGroup);
//     }, []);

//     // POST GetPackage/PackageList
//     useEffect(() => {
//         const postData = async () => {
//             setLoadingPackages(true); // เริ่มโหลดข้อมูล
//             try {
//                 const response = await axios.post(POST_PACKAGE_URL,
//                     {
//                         EmpId,
//                         DivisionId,
//                         DepartId,
//                         DepartGroup,
//                         TeamSale,
//                         ItemID,
//                         PackageTypeID,
//                         PromotionID: selectedPromotion
//                     },
//                     {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         },
//                     }
//                 );

//                 const data = Array.isArray(response.data.data) ? response.data.data : [];

//                 // หน่วงเวลา 2 วินาทีก่อนแสดงผลข้อมูล
//                 setTimeout(() => {
//                     setPackageList(data); // อัปเดตแพ็คเกจหลังจากหน่วงเวลา
//                     setLoadingPackages(false); // หยุดแสดง loading หลังหน่วงเวลา
//                 }, 1000);

//             } catch (error) {
//                 console.error('Error fetching POST_PACKAGE_URL:', error);
//                 setLoadingPackages(false); // หยุดแสดง loading ถ้าเกิดข้อผิดพลาด
//             }
//         };

//         postData();
//     }, [EmpId, DivisionId, DepartId, DepartGroup, TeamSale, ItemID, PackageTypeID, selectedPromotion]);

//     useEffect(() => {
//         // console.log("SaveProductData:", SaveProductData);
//         if (JSON.stringify(SaveProductData) !== JSON.stringify(PRODUCT)) {
//             // console.log("Updating product in store...");
//             SETPRODUCT(SaveProductData);
//         }
//     }, [SaveProductData, PRODUCT, SETPRODUCT]);

//     const handleCateOptionChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const value = event.target.value;
//         setSelectedCategoryId(value);

//         // ล้างค่าทั้งหมดใน state ที่เกี่ยวข้อง
//         setProduct([]);
//         setSelectedProductIndex(null);
//         setSelectedItemCode(null);
//         setSelectedItemDescription(null);
//         setSelectedDescriptionEN(null);
//         setSelectedDescriptionTH(null);
//         setSelectedSerialNo(null); // ล้าง Serial Number
//         setSelectedStatus(null);
//         setSelectedBranch(null);
//         setSelectedTransDate(null);
//         setSelectedPromotion('');
//         setSelectedPackageTypeId(null);
//         setSelectedPackageModel(null);
//         setPackageList([]);

//         // ล้าง barCode
//         navigate("/sale/package", { state: { barCode: "" } });

//         if (value) {
//             try {
//                 setLoadingProducts(true);
//                 const response = await axios.get(
//                     `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${value}`
//                 );
//                 const data = Array.isArray(response.data.data) ? response.data.data : [];
//                 setProduct(data);
//             } catch (error) {
//                 console.error('Error fetching products:', error);
//             } finally {
//                 setLoadingProducts(false);
//             }
//         }
//     };

//     const handleCardProductClick = (index: number) => {
//         setSelectedProductIndex(index);
//         setSelectedItemCode(product[index].ItemCode);
//         setItemID(product[index].ItemCode);
//         setProductId(product[index].ProductID);
//         setSelectedItemDescription(product[index].ItemDescription);
//         setSelectedDescriptionEN(product[index].DescriptionEN);
//         setSelectedDescriptionTH(product[index].DescriptionTH);
//         setSelectedSerialNo(product[index].SerialNo);
//         setSelectedStatus(product[index].Status);
//         setSelectedBranch(product[index].Branch);
//         setSelectedTransDate(product[index].TransDate);
//     };

//     const handlePackageTypeClick = (packageTypeId: number) => {
//         setSelectedPackageTypeId(packageTypeId);
//         setPackageTypeID(packageTypeId);
//     };

//     // 2. ใส่ useEffect ใหม่ รอให้ packageList โหลดเสร็จ และ selectedPackageTypeId มีค่า
//     useEffect(() => {
//         if (selectedPackageTypeId !== null && packageList.length > 0 && packageSectionRef.current) {
//             packageSectionRef.current.scrollIntoView({
//                 behavior: 'smooth',
//                 block: 'start'
//             });
//         }
//     }, [selectedPackageTypeId, packageList]);

//     const handlePackageModelClick = (index: number) => {
//         if (packageList[index] && packageList[index].MODEL) {
//             // console.log("Selected Package:", packageList[index]); // Debug ข้อมูล
//             setSelectedPackageModel(index); // อัปเดต selectedPackageModel
//             setModel(packageList[index].MODEL); // อัปเดต Model
//             setSelectedProductId(packageList[index].PRODUCTID); // อัปเดต Product ID
//         } else {
//             console.error("Invalid package data at index:", index);
//             setSelectedPackageModel(null); // หากข้อมูลไม่ถูกต้อง ตั้งค่า null
//         }
//     };

//     useEffect(() => {
//         // console.log("Package List:", packageList);
//     }, [packageList]);

//     useEffect(() => {
//         if (selectedPackageModel !== null && packageList[selectedPackageModel]) {
//             const selectedModel = packageList[selectedPackageModel].MODEL;
//             setModel(selectedModel); // อัปเดตค่า Model จาก packageList[selectedPackageModel]
//         }
//     }, [selectedPackageModel, packageList, setModel]);

//     const handleScanBarcodeClick = () => {
//         const isDesktop = !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//         if (isDesktop) {
//             Swal.fire({
//                 icon: "info",
//                 title: "ไม่รองรับ",
//                 text: "ฟีเจอร์สแกนบาร์โค้ด สามารถใช้งานได้เฉพาะบนมือถือหรือแท็บเล็ตเท่านั้น",
//             });
//             return;
//         }

//         // navigate("/sale/scanbarcode");
//         navigate('/sale/scanbarcode', {
//             state: { state, REFNO, origin: '/sale/package' }
//         })
//     };

//     // const handleNextClick = async () => {
//     //     console.log("SaveProductData ก่อนส่ง:", SaveProductData);

//     //     try {
//     //         // Save product package
//     //         const response = await axios.post(SAVEPRODUCTPACKAGE, {
//     //             REFNO,
//     //             EMPID: EmpId,
//     //             TEAMSALE: TeamSale,
//     //             SALECODE: SaleCode,
//     //             SUPEMPID: SupEmpId,
//     //             SECEMPID: SecEmpId,
//     //             STATUS: "DRAFT",
//     //             PRODUCT: SaveProductData,
//     //         }, {
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //             },
//     //         });

//     //         const result = response.data;
//     //         console.log(`result`, result);

//     //         const newId = result.data._id; // ดึง _id จาก response

//     //         // อัปเดต state ด้วย _id ที่ได้รับจาก API
//     //         setProductId(newId);

//     //         const conditionCheckResponse = await axios.post(API_URL_POST_CONDITIONSCHECKHISTORY, {
//     //             EmpId, DivisionId, DepartId, DepartGroup, TeamSale, Model
//     //         }, {
//     //             headers: {
//     //                 'Content-Type': 'multipart/form-data',
//     //             },
//     //         });

//     //         setChecktype(conditionCheckResponse.data.checktype); // อัปเดตค่า checktype ใน state

//     //         let updateData;

//     //         if (conditionCheckResponse.data.checktype !== 0) {
//     //             const { value: idCard } = await MySwal.fire({
//     //                 title: 'ตรวจสอบประวัติลูกค้า',
//     //                 html: `
//     //                     <input
//     //                         id="idCardInput"
//     //                         type="text"
//     //                         class="form-control"
//     //                         placeholder="กรุณากรอกเลขบัตรประชาชน (13 หลัก)"
//     //                         maxlength="13"
//     //                         oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0,13);"
//     //                     />
//     //                 `,
//     //                 showCancelButton: true,
//     //                 confirmButtonText: 'ตรวจสอบ',
//     //                 cancelButtonText: 'ยกเลิก',
//     //                 preConfirm: async () => {
//     //                     const input = (document.getElementById('idCardInput') as HTMLInputElement).value;
//     //                     if (input.length === 13) {
//     //                         return input;
//     //                     } else {
//     //                         MySwal.showValidationMessage('กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก');
//     //                         return null;
//     //                     }
//     //                 }
//     //             });

//     //             if (idCard) {
//     //                 setSearch(idCard);
//     //                 const apiResponse = await axios.post(CHECKCUSTOMER_URL, { Search: idCard }, {
//     //                     headers: {
//     //                         'Content-Type': 'multipart/form-data',
//     //                     },
//     //                 });

//     //                 const { Customerstatus, message } = apiResponse.data;
//     //                 const destination = Customerstatus ? '/sale/overview' : '/sale/discount';

//     //                 await MySwal.fire({
//     //                     text: message,
//     //                     icon: Customerstatus ? 'success' : 'warning',
//     //                     timer: 2000, // แสดงผล 3 วินาที
//     //                     showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
//     //                 });

//     //                 updateData = [idCard, conditionCheckResponse.data.checktype, Customerstatus, message];
//     //                 navigate(destination); // นำทางไปยังหน้าที่ต้องการ
//     //             }
//     //         } else {
//     //             SETPRODUCT(result.data); // อัปเดต PRODUCT ใน Zustand store
//     //             updateData = ["", conditionCheckResponse.data.checktype, conditionCheckResponse.data.message];
//     //             navigate('/sale/discount'); // นำทางไปยังหน้า sale/discount
//     //         }

//     //         // เรียก API UPDATECONTACT หลังจากเสร็จสิ้นเงื่อนไขทั้งหมด
//     //         try {
//     //             const updateContract = await axios.post(UPDATECONTACT, {
//     //                 REFNO,
//     //                 EMPID: EmpId,
//     //                 TEAMSALE: TeamSale,
//     //                 FIELD: "CUSTOMERSTATUS",
//     //                 DATA: updateData,
//     //             }, {
//     //                 headers: {
//     //                     'Content-Type': 'application/json',
//     //                 },
//     //             });

//     //             // console.log(`updateContract CUSTOMERSTATUS: `, updateContract.data);

//     //             await MySwal.fire({
//     //                 icon: 'success',
//     //                 title: 'สำเร็จ!',
//     //                 text: 'บันทึกข้อมูลสินค้าเรียบร้อยแล้ว',
//     //                 timer: 2000, // แสดงผล 3 วินาที
//     //                 showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
//     //             });
//     //         } catch (error) {
//     //             console.error('Error updating contract:', error);
//     //             MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
//     //         }
//     //     } catch (error) {
//     //         console.error('Error saving product package:', error);
//     //         MySwal.fire({
//     //             title: 'เกิดข้อผิดพลาด',
//     //             text: 'ไม่สามารถบันทึกข้อมูลได้',
//     //             icon: 'error',
//     //             confirmButtonText: 'ตกลง'
//     //         });
//     //     }
//     // };

//     // เมื่อ SaveProductData เปลี่ยน ให้เก็บลง localStorage เสมอ
//     useEffect(() => {
//         if (SaveProductData.length > 0) {
//             localStorage.setItem('saveProductData', JSON.stringify(SaveProductData));
//         }
//     }, [SaveProductData]);

//     useEffect(() => {
//         const saved = localStorage.getItem('saveProductData');
//         console.log(`saved`, saved);

//         if (saved) {
//             const data = JSON.parse(saved);
//             SETPRODUCT(data);           // เติมลง Zustand store
//             // ... (ถ้าต้องเติม selectedCategoryId, selectedProductIndex, ฯลฯ จาก data[0]) ...
//         }
//     }, []);

//     const handleNextClick = async () => {
//         console.log("SaveProductData ก่อนส่ง:", SaveProductData);

//         // ก่อน navigate เรายังเก็บล่าสุดอีกรอบก็ได้
//         localStorage.setItem('saveProductData', JSON.stringify(SaveProductData));

//         try {
//             // Save product package
//             const response = await axios.post(UPDATECONTACT, {
//                 REFNO,
//                 EMPID: EmpId,
//                 TEAMSALE: TeamSale,
//                 FIELD: "PRODUCT",
//                 DATA: SaveProductData,
//             }, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
//             const result = response.data;
//             console.log(`result`, result);

//             // เรียก API UPDATECONTACT หลังจากเสร็จสิ้นเงื่อนไขทั้งหมด
//             try {
//                 await MySwal.fire({
//                     icon: 'success',
//                     title: 'สำเร็จ!',
//                     text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
//                     timer: 2000, // แสดงผล 3 วินาที
//                     showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
//                 });
//                 navigate('/sale/discount', { state: { fromPackage: true } });
//             } catch (error) {
//                 console.error('Error updating contract:', error);
//                 MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
//             }
//         } catch (error) {
//             console.error('Error saving product package:', error);
//             MySwal.fire({
//                 title: 'เกิดข้อผิดพลาด',
//                 text: 'ไม่สามารถบันทึกข้อมูลได้',
//                 icon: 'error',
//                 confirmButtonText: 'ตกลง'
//             });
//         }
//     };

//     return (
//         <>
//             <Content>
//                 <div className='d-flex justify-content-between align-items-center my-5'>
//                     <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
//                         data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
//                         className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
//                         <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
//                             <li className={`${styles.titlePage}`}>เลือกแพ็คเกจ</li>
//                         </ul>
//                     </div>
//                 </div>
//                 <span className={`${styles.fontSize}`}>เลขที่ขาย: </span><span className={`${styles.titlePage}`}>{REFNO}</span>

//                 <div className='accordion mb-10' id='kt_accordion_1'>
//                     <div className='accordion-item mb-10'>
//                         <h2 className='accordion-header' id='kt_accordion_1_header_1'>
//                             <h3
//                                 className='accordion-button fs-4 fw-bold border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
//                                 data-bs-toggle='collapse'
//                                 data-bs-target='#kt_accordion_1_body_1'
//                                 aria-expanded='true'
//                                 aria-controls='kt_accordion_1_body_1'
//                                 style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
//                             >
//                                 เลือกแพ็คเกจ
//                             </h3>
//                         </h2>

//                         <div
//                             id='kt_accordion_1_body_1'
//                             className='accordion-collapse collapse show'
//                             aria-labelledby='kt_accordion_1_header_1'
//                             data-bs-parent='#kt_accordion_1' >
//                             <div className='accordion-body'>
//                                 <form noValidate className='form'>
//                                     <div className='card-body px-lg-9 px-1 mb-10'>
//                                         <div className='row'>

//                                             {/* สแกนบาร์โค้ด */}
//                                             <div
//                                                 className="d-flex justify-content-center align-items-center mb-5"
//                                                 // style={{
//                                                 //     border: "1px solid #ccc",
//                                                 //     borderRadius: "10px",
//                                                 //     padding: "10px",
//                                                 //     backgroundColor: "#f9f9f9",
//                                                 // }}
//                                                 onClick={handleScanBarcodeClick}
//                                             >
//                                                 <label
//                                                     className={`btn btn-success px-5 w-200px ${styles.label}`}
//                                                     htmlFor="camera-input"
//                                                     style={{
//                                                         cursor: "pointer",
//                                                         borderRadius: "10px",
//                                                         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                                                     }}
//                                                 >
//                                                     สแกน S/N
//                                                 </label>
//                                             </div>
//                                             {/* สแกนบาร์โค้ด */}

//                                             {/* {barCode && (
//                                                 <label className={`form-label my-5 ${styles.fontSize}`}>S/N ที่สแกนได้: {barCode}</label>
//                                             )} */}

//                                             <div className='col-lg-6 my-7 my-xl-10'>
//                                                 <label className='form-label required fw-bold fs-3'>หมวดหมู่สินค้า</label>
//                                                 <select
//                                                     className='form-select'
//                                                     onChange={handleCateOptionChange}
//                                                 >
//                                                     <option value=''>เลือกหมวดหมู่สินค้า...</option>
//                                                     {categories.map((item: any, index: number) => (
//                                                         <option key={index} value={item.CategoriesId}>
//                                                             {item.DescriptionTH}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </div>

//                                         </div>

//                                         {/* แสดง Loading */}
//                                         {loadingProducts && (
//                                             <div className="text-center my-10">
//                                                 <ThreeDot />
//                                             </div>
//                                         )}

//                                         {/* หากไม่มีสินค้าให้แสดงข้อความนี้ */}
//                                         {!loadingProducts && selectedCategoryId.length > 0 && product.length === 0 && (
//                                             <div className='text-center my-7'>
//                                                 <h5>ไม่มีรายการสินค้า</h5>
//                                             </div>
//                                         )}

//                                         <>
//                                             {selectedCategoryId.length > 0 && product.length > 0 ? (
//                                                 <label className={`form-label required mt-7 mt-xl-10 ${styles.label}`}>รายการสินค้า</label>
//                                             ) : ('')}
//                                             {!loadingProducts && product.length > 0 && (
//                                                 <div className='row '>
//                                                     {product.map((item, index) => (
//                                                         <div
//                                                             className='col-lg-6 mb-3 rounded'
//                                                             key={index}
//                                                             onClick={() => handleCardProductClick(index)}
//                                                             style={{ cursor: 'pointer' }}
//                                                         >
//                                                             <CardProduct
//                                                                 DescriptionTH={item.DescriptionTH}
//                                                                 ItemDescription={item.ItemDescription}
//                                                                 ItemCode={item.ItemCode}
//                                                                 SerialNo={item.SerialNo}
//                                                                 isSelected={selectedProductIndex === index}
//                                                             />
//                                                         </div>
//                                                     ))}

//                                                     <div className='row'>
//                                                         <div className='col-lg-6 my-7 my-xl-10'>
//                                                             <label className={`form-label required ${styles.label}`}>โปรโมชั่น</label>
//                                                             <select
//                                                                 className={`${styles.fontSize} form-select`}
//                                                                 onChange={(e) => {
//                                                                     setSelectedPromotion(Number(e.target.value)); // แปลงค่า string เป็น number
//                                                                 }}
//                                                                 value={selectedPromotion ?? ''} // ใช้ nullish coalescing เพื่อป้องกันค่าที่เป็น null
//                                                             >
//                                                                 <option value=''>เลือกโปรโมชั่น</option>
//                                                                 {promotion.map((item: any, index: number) => (
//                                                                     <option key={index} value={item?.PROMOTIONID}>
//                                                                         {item.PROMOTIONNAME}
//                                                                     </option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>

//                                                     {product.length !== 0 && (
//                                                         <div className='container my-10 my-xl-10'>
//                                                             <div className='row d-flex'>
//                                                                 <label className={`form-label required ${styles.label}`}>ประเภทการชำระ</label>
//                                                                 {packageType.map((item, index) => (
//                                                                     <div className='col-6 col-md-auto mb-2 d-flex align-items-center'>
//                                                                         <div
//                                                                             key={item.PACKAGETYPEID}
//                                                                             className={`border rounded w-100 w-md-auto h-60px
//                                                                             d-flex justify-content-center align-items-center fw-bold fs-6 px-5`}
//                                                                             style={{
//                                                                                 backgroundColor: selectedPackageTypeId === item.PACKAGETYPEID ? '#ACE1AF' : '#fcfcfc',
//                                                                                 transition: 'background-color 0.2s ease, color 0.2s ease',
//                                                                                 cursor: 'pointer'
//                                                                             }}
//                                                                             onClick={() => handlePackageTypeClick(item.PACKAGETYPEID)}
//                                                                         >
//                                                                             <p className={`${styles.fontSize}`}>{item.PACKAGETYPENAME}</p>
//                                                                         </div>
//                                                                     </div>
//                                                                 ))}
//                                                             </div>
//                                                         </div>
//                                                     )}

//                                                     {/* หากไม่มีแพ็คเกจให้แสดงข้อความนี้ */}
//                                                     {!loadingPackages && packageList.length === 0 && selectedCategoryId !== null && selectedProductIndex !== null && selectedPackageTypeId && (
//                                                         <div className='text-center my-7'>
//                                                             <h5 className={`${styles.fontSize}`}>ไม่มีรายการแพ็คเกจ</h5>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             )}
//                                         </>

//                                         {/* ส่วนของแพ็คเกจที่จะเลื่อนมาที่นี่ */}
//                                         {/* แสดง Loading */}
//                                         {loadingPackages && (
//                                             <div className="text-center my-10">
//                                                 <ThreeDot />
//                                             </div>
//                                         )}

//                                         {/* แสดงแพ็คเกจหากโหลดเสร็จ */}
//                                         {!loadingPackages && packageList.length > 0 && selectedPackageTypeId !== null && (
//                                             <div className='my-10 my-xl-10' ref={packageSectionRef}>
//                                                 <div className='row d-flex'>
//                                                     <label className={`form-label required ${styles.label}`}>แพ็คเกจ</label>
//                                                     {packageList.map((item, index) => (
//                                                         <div
//                                                             className='col-12 col-md-4 col-sm-4 mb-2'
//                                                             key={item.MODEL || index}
//                                                             onClick={() => handlePackageModelClick(index)}
//                                                             style={{ cursor: 'pointer' }}
//                                                         >
//                                                             <CardPackage
//                                                                 PackageTitle={item.PACKAGETITLE || "No Title"}
//                                                                 isSelected={selectedPackageModel === index}
//                                                             />
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         )}

//                                         {/* Summary Table */}
//                                         {periods.length > 0 && (
//                                             <div className="mt-4">
//                                                 <table className="table table-bordered">
//                                                     <thead>
//                                                         <tr>
//                                                             <th className={styles.fontSize}>งวดที่</th>
//                                                             <th className={styles.fontSize}>ราคา</th>
//                                                             <th className={styles.fontSize}>หน่วย</th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody>
//                                                         {/* งวดที่ 1 */}
//                                                         <tr>
//                                                             <td className={styles.fontSize}>1</td>
//                                                             <td className={styles.fontSize}>
//                                                                 {Number(periods[0].PAYMENTAMOUNT)
//                                                                     .toLocaleString(undefined, {
//                                                                         minimumFractionDigits: 2,
//                                                                         maximumFractionDigits: 2,
//                                                                     })}
//                                                             </td>
//                                                             <td className={styles.fontSize}>บาท</td>
//                                                         </tr>

//                                                         {/* งวดที่ 2–สุดท้าย ถ้ามีมากกว่า 1 งวด */}
//                                                         {periods.length > 1 && (
//                                                             <tr>
//                                                                 <td className={styles.fontSize}>
//                                                                     2–{periods.length}
//                                                                 </td>
//                                                                 <td className={styles.fontSize}>
//                                                                     {Number(periods[1].PAYMENTAMOUNT)
//                                                                         .toLocaleString(undefined, {
//                                                                             minimumFractionDigits: 2,
//                                                                             maximumFractionDigits: 2,
//                                                                         })}
//                                                                 </td>
//                                                                 <td className={styles.fontSize}>บาท</td>
//                                                             </tr>
//                                                         )}
//                                                     </tbody>
//                                                 </table>
//                                             </div>
//                                         )}

//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div >

//                 {/* ปุ่มในหน้าจอใหญ่ */}
//                 < div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10" >
//                     <button
//                         className={`${styles.btnSecondary}`}
//                         onClick={() => navigate('/sale/overview')}
//                     >
//                         กลับหน้าแรก
//                     </button>
//                     <button
//                         className={`${styles.btnPrimary}
//                 ${product.length === 0 || selectedProductIndex === null ? 'disabled' : ''}`}
//                         disabled={product.length === 0 || selectedProductIndex === null}
//                         onClick={handleNextClick}
//                     >
//                         ถัดไป
//                     </button>
//                 </div >

//                 {/* ปุ่มในหน้าจอเล็ก */}
//                 < div
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
//                         onClick={() => navigate('/sale/overview')}
//                     >
//                         กลับหน้าแรก
//                     </button>
//                     <button
//                         className={`${styles.btnPrimary}
//                 ${product.length === 0 || selectedProductIndex === null ? 'disabled' : ''}`}
//                         disabled={product.length === 0 || selectedProductIndex === null}
//                         onClick={handleNextClick}
//                     >
//                         ถัดไป
//                     </button>
//                 </div >

//             </Content >
//         </>
//     );
// }

// export default SalesPackage;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/style.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useRef, useMemo } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from "../../modules/auth/core/Auth";
import {
  useUUIDStore,
  useSaveProductStore,
} from "../../modules/stores/stepsStore";
import "/public/splash-screen.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { ThreeDot } from "react-loading-indicators";

//useStore
import {
  useCategoryStore,
  useFetchCategoryStore,
  useProductStore,
  usePackageStore,
  useConditionsCheckHistoryStore,
} from "../../modules/stores/sales/packageStore/packageStore";

//component
import { CardProduct } from "./components/cards/CardProduct";
import { CardProductBundle } from "./components/cards/CardProductBundle";
import { CardPackage } from "./components/cards/CardPackage";
import { log } from "node:console";

interface LocationState {
  barCode?: any; // ระบุว่ามี barCode ใน state หรือไม่
}

const SalesPackage: React.FC = () => {
  const location = useLocation();
  const { REFNO } = useUUIDStore();

  const state = (location.state as { barCode?: any }) || {}; // เพิ่ม fallback เป็นอ็อบเจ็กต์ว่าง
  // const barCode = state.barCode; // กำหนดค่าเริ่มต้นเป็น "ยังไม่มีข้อมูล"
  // console.log(`barCode`, barCode);
  // State สำหรับตรวจสอบสถานะการโหลด
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingPromotion, setLoadingPromotion] = useState(false);

  const navigate = useNavigate(); // ใช้ useNavigate สำหรับการเปลี่ยนเส้นทาง
  const MySwal = withReactContent(Swal);

  // **1. state เพื่อกันโหลดซ้ำ**
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  const { auth } = useAuth();

  const { fetchCategory } = useFetchCategoryStore();
  // console.log(`fetchCategory: `, fetchCategory);

  const [categories, setCategories] = useState<any[]>([]);
  // console.log(`categories`, categories);

  const [promotion, setPromotion] = useState<any[]>([]);
  // console.log(`promotion`, promotion);

  const [packageType, setPackageType] = useState<any[]>([]);
  // console.log(`packageType: `, packageType);

  const [packageList, setPackageList] = useState<any[]>([]);
  // console.log(`packageList: `, packageList);

  const [selectedCategoryId, setSelectedCategoryId] = useState<any>("");

  const [selectedProductIndex, setSelectedProductIndex] = useState<
    number | null
  >(null);
  // console.log(`selectedProductIndex: `, selectedProductIndex);

  const [selectedItemCode, setSelectedItemCode] = useState<string | null>(null);
  // console.log(`selectedItemCode: `, selectedItemCode);

  const [selectedItemDescription, setSelectedItemDescription] = useState<
    string | null
  >(null);
  const [selectedDescriptionEN, setSelectedDescriptionEN] = useState<
    string | null
  >(null);
  const [selectedDescriptionTH, setSelectedDescriptionTH] = useState<
    string | null
  >(null);
  const [selectedSerialNo, setSelectedSerialNo] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedTransDate, setSelectedTransDate] = useState<string | null>(
    null
  );
  const [productId, setProductId] = useState<string | null>(null);
  // console.log(`productId: `, productId);

  const [selectedPackageTypeId, setSelectedPackageTypeId] = useState<
    number | null
  >(null);
  // console.log(`selectedPackageTypeId`, selectedPackageTypeId);

  const [selectedPackageModel, setSelectedPackageModel] = useState<
    number | null
  >(null);
  // console.log(`selectedPackageModel`, selectedPackageModel);

  const [selectedProductId, setSelectedProductId] = useState<any>("");
  // console.log(`selectedProductId`, selectedProductId);
  const [selectedPromotion, setSelectedPromotion] = useState<number | null>(null);
  // console.log(`selectedPromotion`, selectedPromotion);

  const [checktype, setChecktype] = useState<number | null>(null);
  // console.log(`checktype`, checktype);

  const [Search, setSearch] = useState<string>(""); // เก็บค่าของเลขบัตรประชาชน
  // console.log(`Search: `, Search);

  const {
    barCode: barCodeNormal,
    barCodeBundle,
    bundleProduct,
    promotionId, // <-- ดึงกลับมา
    selectedItemCode: codeFromState,
    productId: prodFromState,
  } = (location.state as any) || {};

  const [bundleOk, setBundleOk] = useState(false);
  // console.log(`bundleOk: `, bundleOk);
  const [useBundle, setUseBundle] = useState<"normal" | "bundle" | null>(null);
  // console.log(`useBundle: `, useBundle);
  const [scannedBundleProduct, setScannedBundleProduct] = useState<any | null>(
    null
  );
  const [scanningBundle, setScanningBundle] = useState(false);

  useEffect(() => {
    if (bundleProduct && barCodeBundle) {
      setUseBundle("bundle");
      setBundleOk(true);
      setScannedBundleProduct(bundleProduct);

      // เซ็ตโปรโมชั่นกลับคืน
      if (promotionId !== undefined) {
        setSelectedPromotion(promotionId);
      }
    }
  }, [bundleProduct, barCodeBundle, promotionId, codeFromState, prodFromState]);

  // 2) เปลี่ยนตัว fetch bundle จากใช้ `barCode` เป็นใช้ `barCodeBundle`
  useEffect(() => {
    if (useBundle === "bundle" && barCodeBundle) {
      axios
        .get(`${GET_STOCK_URL}`, {
          params: { empid: EmpId, teamSale: TeamSale, sn: barCodeBundle },
        })
        .then((res) => {
          const items = Array.isArray(res.data.data) ? res.data.data : [];
          if (items.length) {
            setScannedBundleProduct(items[0]);
          } else {
            Swal.fire("ไม่พบสินค้า", `ไม่พบ S/N: ${barCodeBundle}`, "warning");
          }
        })
        .catch(console.error);
    }
  }, [barCodeBundle, useBundle]);

  const {
    EmpId,
    setEmpId,
    TeamSale,
    setTeamSale,
    SaleCode,
    setSaleCode,
    SupEmpId,
    setSupEmpId,
    SecEmpId,
    setSecEmpId,
    DivisionId,
    setDivisionId,
    DepartId,
    setDepartId,
    DepartGroup,
    setDepartGroup,
  } = useCategoryStore();
  // console.log(`DepartGroup`, DepartGroup);
  // console.log(`EmpId`, EmpId);

  // const getCategoryLocal = localStorage.getItem("fetchCategory");
  // const parseGetCategoryLocal = getCategoryLocal ? JSON.parse(getCategoryLocal) : null;

  const { product, setProduct } = useProductStore();
  // console.log(`product: `, product);

  const { ItemID, setItemID, PackageTypeID, setPackageTypeID } =
    usePackageStore();

  const { Model, setModel } = useConditionsCheckHistoryStore();

  const { PRODUCT, SETPRODUCT } = useSaveProductStore();

  // const SaveProductData = useMemo(() => [
  //     {
  //         EmpId: EmpId || '',
  //         TeamSale: TeamSale || '',
  //         SaleCode: SaleCode,
  //         ItemCode: selectedItemCode || '',
  //         ItemDescription: selectedItemDescription || '',
  //         CategoriesId: selectedCategoryId || '',
  //         DescriptionEN: selectedDescriptionEN || '',
  //         DescriptionTH: selectedDescriptionTH || '',
  //         SerialNo: selectedSerialNo || '',
  //         Status: selectedStatus || '',
  //         Branch: selectedBranch || '',
  //         TransDate: selectedTransDate || '',
  //         PromotionId: selectedPromotion,
  //         ProductId: productId,
  //         Package: selectedPackageModel !== null
  //             ? [
  //                 {
  //                     MODEL: packageList[selectedPackageModel]?.MODEL || [],
  //                     PACKAGETYPEID: selectedPackageTypeId ?? 0, // ดึงค่า selectedPackageTypeId แม้ selectedPackageModel จะไม่มี
  //                     ORGANIZATIONCODE: packageList[selectedPackageModel]?.ORGANIZATIONCODE || [],
  //                     ITEMID: packageList[selectedPackageModel]?.ITEMID || [],
  //                     PRODUCTID: packageList[selectedPackageModel]?.PRODUCTID || [],
  //                     PACKAGETITLE: packageList[selectedPackageModel]?.PACKAGETITLE || [],
  //                     TOTALPRICE: packageList[selectedPackageModel]?.TOTALPRICE || [],
  //                     HASTRADEIN: packageList[selectedPackageModel]?.HASTRADEIN || [],
  //                     DISCOUNTPRICE: packageList[selectedPackageModel]?.DISCOUNTPRICE || [],
  //                     SEQUENCE: packageList[selectedPackageModel]?.SEQUENCE || [],
  //                     PERMITION_ACTIVE: packageList[selectedPackageModel]?.PERMITION_ACTIVE || [],
  //                     FREEGIFT: packageList[selectedPackageModel]?.FREEGIFT || [],
  //                     PERIODDETAILS: packageList[selectedPackageModel]?.PERIODDETAILS || []
  //                 }
  //             ]
  //             : selectedPackageTypeId !== null
  //                 ? [
  //                     {
  //                         MODEL: null, // หากไม่มี selectedPackageModel ให้ตั้งค่า MODEL เป็น null
  //                         PACKAGETYPEID: selectedPackageTypeId, // เก็บค่าของ selectedPackageTypeId ได้โดยตรง
  //                         ORGANIZATIONCODE: null,
  //                         ITEMID: null,
  //                         PRODUCTID: null,
  //                         PACKAGETITLE: null,
  //                         TOTALPRICE: null,
  //                         HASTRADEIN: null,
  //                         DISCOUNTPRICE: null,
  //                         SEQUENCE: null,
  //                         PERMITION_ACTIVE: null,
  //                         FREEGIFT: null,
  //                         PERIODDETAILS: null
  //                     }
  //                 ]
  //                 : [], // หากไม่มีค่าใดเลย ให้เป็น array ว่าง
  //     },
  // ], [
  //     EmpId,
  //     TeamSale,
  //     SaleCode,
  //     SupEmpId,
  //     SecEmpId,
  //     selectedItemCode,
  //     selectedItemDescription,
  //     selectedCategoryId,
  //     selectedDescriptionEN,
  //     selectedDescriptionTH,
  //     selectedSerialNo,
  //     selectedStatus,
  //     selectedBranch,
  //     selectedTransDate,
  //     selectedPromotion,
  //     selectedPackageModel,
  //     selectedPackageTypeId,
  //     packageList
  // ]);

  const SaveProductData = useMemo(() => {
    const rows: any[] = [];

    // 1) เก็บสินค้า Main เป็นตัวแรกเสมอ
    rows.push({
      MainItem: "Y",
      EmpId: EmpId || "",
      TeamSale: TeamSale || "",
      SaleCode: SaleCode || "",
      ItemCode: selectedItemCode || "",
      ItemDescription: selectedItemDescription || "",
      CategoriesId: selectedCategoryId || "",
      DescriptionEN: selectedDescriptionEN || "",
      DescriptionTH: selectedDescriptionTH || "",
      SerialNo: selectedSerialNo || "",
      Status: selectedStatus || "",
      Branch: selectedBranch || "",
      TransDate: selectedTransDate || "",
      PromotionId: selectedPromotion || "",
      ProductId: productId || "",
      Package:
        selectedPackageModel !== null
          ? [
            {
              MODEL: packageList[selectedPackageModel]?.MODEL || [],
              PACKAGETYPEID: selectedPackageTypeId ?? 0,
              ORGANIZATIONCODE:
                packageList[selectedPackageModel]?.ORGANIZATIONCODE || [],
              ITEMID: packageList[selectedPackageModel]?.ITEMID || [],
              PRODUCTID: packageList[selectedPackageModel]?.PRODUCTID || [],
              PACKAGETITLE:
                packageList[selectedPackageModel]?.PACKAGETITLE || [],
              TOTALPRICE: packageList[selectedPackageModel]?.TOTALPRICE || [],
              HASTRADEIN: packageList[selectedPackageModel]?.HASTRADEIN || [],
              DISCOUNTPRICE:
                packageList[selectedPackageModel]?.DISCOUNTPRICE || [],
              SEQUENCE: packageList[selectedPackageModel]?.SEQUENCE || [],
              PERMITION_ACTIVE:
                packageList[selectedPackageModel]?.PERMITION_ACTIVE || [],
              FREEGIFT: packageList[selectedPackageModel]?.FREEGIFT || [],
              PERIODDETAILS:
                packageList[selectedPackageModel]?.PERIODDETAILS || [],
            },
          ]
          : selectedPackageTypeId !== null
            ? [
              {
                MODEL: null,
                PACKAGETYPEID: selectedPackageTypeId,
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
                PERIODDETAILS: null,
              },
            ]
            : [],
    });

    // 2) ถ้าเป็นโหมด bundle และมี scannedBundleProduct ให้เก็บต่อท้าย Main
    if (useBundle === "bundle" && scannedBundleProduct) {
      rows.push({
        MainItem: "N",
        EmpId: EmpId || "",
        TeamSale: TeamSale || "",
        SaleCode: SaleCode || "",
        ItemCode: scannedBundleProduct.ItemCode || "",
        ItemDescription: scannedBundleProduct.ItemDescription || "",
        CategoriesId: (scannedBundleProduct.CategoriesId ?? "").toString(),
        DescriptionEN: scannedBundleProduct.DescriptionEN || "",
        DescriptionTH: scannedBundleProduct.DescriptionTH || "",
        SerialNo: scannedBundleProduct.SerialNo || "",
        Status: scannedBundleProduct.Status || "",
        Branch: scannedBundleProduct.Branch || "",
        TransDate: scannedBundleProduct.TransDate || "",
        PromotionId: selectedPromotion || "",
        ProductId: scannedBundleProduct.ProductID || "",
        Package: [],
      });
    }

    return rows;
  }, [
    useBundle,
    scannedBundleProduct,
    EmpId,
    TeamSale,
    SaleCode,
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
    productId,
    selectedPackageModel,
    selectedPackageTypeId,
    packageList,
  ]);

  const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
  const CATEGORIES_URL = `${API_SALECONNEXT}/GetProduct/Categories`;
  const PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageType`;
  const PROMOTION_URL = `${API_SALECONNEXT}/GetProduct/ProductPromotionList`;
  const POST_PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageList`;
  const API_URL_POST_CONDITIONSCHECKHISTORY = `${API_SALECONNEXT}/ConditionsCheckHistory`;
  const CHECK_PRODUCT_BUNDLE = `${API_SALECONNEXT}/GetProduct/CheckProductBundle`;

  const API_URL_POST_CHECKCUSTOMER = import.meta.env.VITE_APP_API_THIENSURAT;
  const CHECKCUSTOMER_URL = `${API_URL_POST_CHECKCUSTOMER}/CheckCustomer`;

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  // const getProductUrl = () => `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`;
  // const getProductUrl = `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}&sn=${barCode}`;
  const SAVEPRODUCTPACKAGE = `${API_URL_MONGO}/Contract/saveProductPackage`;
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

  const GET_STOCK_URL = `${API_URL_MONGO}/Product/GetStock`;

  // สร้าง ref สำหรับส่วนแพ็คเกจ
  const packageSectionRef = useRef<HTMLDivElement>(null);

  // ดึงงวดการผ่อนจากแพ็คเกจที่เลือก
  const periods =
    selectedPackageModel !== null && packageList[selectedPackageModel]
      ? packageList[selectedPackageModel].PERIODDETAILS ?? []
      : [];

  useEffect(() => {
    // รอจนกว่าทั้ง 2 ตัวนี้จะมีค่า
    if (EmpId && TeamSale) {
      postData();
    }
  }, [EmpId, TeamSale]);

  // const postData = async () => {
  //     try {
  //         const response = await axios.post(
  //             CATEGORIES_URL,
  //             { EmpId, DivisionId, DepartId, DepartGroup, TeamSale },
  //             {
  //                 headers: {
  //                     'Content-Type': 'multipart/form-data',
  //                     'Accept': 'multipart/form-data',
  //                 },
  //             }
  //         );
  //         const data = Array.isArray(response.data.data) ? response.data.data : [];

  //         // เพิ่มฟิลเตอร์เฉพาะหมวดหมู่ที่มีสินค้า
  //         const filteredCategories = data.filter((category: any) => category.hasProducts === true);

  //         setCategories(filteredCategories);
  //     } catch (error) {
  //         console.error('Error fetching CATEGORIES_URL:', error);
  //     } finally {
  //         setLoadingCategories(false);
  //     }
  // };

  //// ใช้อยู่
  // const postData = async () => {
  //     setLoadingCategories(true);
  //     try {
  //         const response = await axios.get(GET_STOCK_URL, {
  //             params: {
  //                 empid: EmpId,
  //                 teamSale: TeamSale,
  //             },
  //         });
  //         // แยก data จาก response
  //         const raw = Array.isArray(response.data.data) ? response.data.data : [];
  //         setCategories(raw);

  //     } catch (error) {
  //         console.error('Error fetching stock:', error);
  //     } finally {
  //         setLoadingCategories(false);
  //     }
  // };

  const postData = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.get(GET_STOCK_URL, {
        params: { empid: EmpId, teamSale: TeamSale },
      });
      const raw: any[] = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      // ดึงเฉพาะ { CategoriesId, DescriptionTH } ไม่ซ้ำกัน
      const cats = raw.reduce((acc: any[], item) => {
        if (!acc.some((c) => c.CategoriesId === item.CategoriesId)) {
          acc.push({
            CategoriesId: item.CategoriesId,
            DescriptionTH: item.DescriptionTH, // หรือชื่อ field จริงจาก API
          });
        }
        return acc;
      }, []);

      setCategories(cats);
    } catch (error) {
      console.error("Error fetching stock for categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // // GET Product/GetStock?
  // useEffect(() => {
  //     const fetchProducts = async () => {
  //         if (!selectedCategoryId) return;
  //         setLoadingProducts(true); // เริ่มโหลดเมื่อเปลี่ยนหมวดหมู่สินค้า
  //         try {
  //             const response = await axios.get(getProductUrl(), {
  //                 headers: {
  //                     'Content-Type': 'application/json',
  //                     'Accept': 'application/json',
  //                 }
  //             });
  //             const data = Array.isArray(response.data.data) ? response.data.data : [];
  //             setProduct(data); // บันทึกสินค้าใหม่
  //         } catch (error) {
  //             console.error('Error fetching products:', error);
  //         } finally {
  //             setLoadingProducts(false); // หยุดโหลดเมื่อดึงข้อมูลเสร็จ
  //         }
  //     };

  //     fetchProducts();
  // }, [selectedCategoryId]); // ทำงานเมื่อ selectedCategoryId เปลี่ยนแปลง

  useEffect(() => {
    setProduct([]); // ล้างข้อมูล product ทุกครั้งเมื่อเริ่มต้น
    postData();
  }, []);

  // GET Product/GetStock?
  // useEffect(() => {
  //     const fetchProducts = async () => {
  //         setLoadingProducts(true);
  //         try {
  //             // สร้าง URL ตามเงื่อนไข
  //             const url = selectedCategoryId
  //                 ? `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`
  //                 : `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&sn=${barCode}`;

  //             const response = await axios.get(url);

  //             const data = Array.isArray(response.data.data) ? response.data.data : [];
  //             setProduct(data);

  //             // ถ้ามี barCode แต่ไม่พบสินค้า ให้แจ้งเตือน
  //             if (data.length === 0) {
  //                 Swal.fire({
  //                     icon: 'warning',
  //                     title: 'ไม่พบสินค้า',
  //                     text: `ไม่พบสินค้า ${barCode} ในคลัง`,
  //                     confirmButtonText: 'ตกลง'
  //                 });
  //             }

  //             if (data.length === 1) {
  //                 try {
  //                     const response = await axios.post(CHECK_PRODUCT_BUNDLE, {
  //                         ProductID: productId,
  //                         EmpId,
  //                         DivisionId,
  //                         DepartId,
  //                         DepartGroup,
  //                         TeamSale,
  //                         ItemID: selectedItemCode
  //                     }, {
  //                         headers: {
  //                             'Content-Type': 'multipart/form-data',
  //                             'Accept': 'multipart/form-data',
  //                         }
  //                     });
  //                     const data = Array.isArray(response.data.data) ? response.data.data : [];
  //                     console.log(`setIsBundle`, data);
  //                     setIsBundle(data);
  //                 } catch (error) {
  //                     console.error('Error fetching CHECK_PRODUCT_BUNDLE:', error);
  //                 }
  //             };

  //             // เลือกสินค้าตัวแรกโดยอัตโนมัติหากมีบาร์โค้ด
  //             if (data.length === 1 && barCode) {
  //                 setSelectedProductIndex(0);
  //                 setSelectedItemCode(data[0].ItemCode);
  //                 setItemID(data[0].ItemCode);
  //                 setProductId(data[0].ProductID);
  //                 setSelectedItemDescription(data[0].ItemDescription);
  //                 setSelectedDescriptionEN(data[0].DescriptionEN);
  //                 setSelectedDescriptionTH(data[0].DescriptionTH);
  //                 setSelectedSerialNo(data[0].SerialNo);
  //                 setSelectedStatus(data[0].Status);
  //                 setSelectedBranch(data[0].Branch);
  //                 setSelectedTransDate(data[0].TransDate);
  //             }
  //         } catch (error) {
  //             console.error("Error fetching products:", error);
  //         } finally {
  //             setLoadingProducts(false);
  //         }
  //     };

  //     if (selectedCategoryId || barCode) {
  //         fetchProducts();
  //     }
  // }, [selectedCategoryId, barCode]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setBundleOk(false);

      try {
        // ดึง stock
        const url = selectedCategoryId
          ? `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`
          : `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&sn=${barCodeNormal}`;
        const res = await axios.get(url);
        const data = Array.isArray(res.data.data) ? res.data.data : [];

        // ถ้า S/N มา แต่ไม่เจอ
        if (barCodeNormal && data.length === 0) {
          await Swal.fire({
            icon: "warning",
            title: "ไม่พบสินค้า",
            text: `ไม่พบสินค้า ${barCodeNormal} ในคลัง`,
            confirmButtonText: "ตกลง",
          });
          setProduct([]);
          return;
        }

        // ถ้าพบสินค้าอย่างน้อย 1 เครื่อง ให้เช็ค bundle
        if (barCodeNormal && data.length > 0) {
          const form = new FormData();
          form.append("ItemID", data[0].ItemCode);
          form.append("EmpId", EmpId);
          form.append("DivisionId", DivisionId);
          form.append("DepartId", DepartId);
          form.append("DepartGroup", DepartGroup);
          form.append("TeamSale", TeamSale);
          form.append("ProductID", data[0].ProductID);

          // สักพักหลัง auto-select ตัวแรก ให้เก็บลง localStorage
          localStorage.setItem("sp.barCodeNormal", barCodeNormal);
          localStorage.setItem("sp.selectedItemCode", data[0].ItemCode);
          localStorage.setItem("sp.productId", data[0].ProductID);

          const bundleRes = await axios.post(CHECK_PRODUCT_BUNDLE, form, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          const { statustext, message } = bundleRes.data;

          if (statustext === "success" || statustext === "notfouund") {
            // ทั้งกรณีเจอ bundle หรือไม่เจอ (notfound)
            setBundleOk(statustext === "success"); // ถ้า success ให้เป็น bundle mode
            setProduct(data);

            // auto-select ตัวแรกเสมอ
            const first = data[0];
            setSelectedProductIndex(0);
            setSelectedItemCode(first.ItemCode);
            setItemID(first.ItemCode);
            setProductId(first.ProductID);
            setSelectedItemDescription(first.ItemDescription);
            setSelectedDescriptionEN(first.DescriptionEN);
            setSelectedDescriptionTH(first.DescriptionTH);
            setSelectedSerialNo(first.SerialNo);
            setSelectedStatus(first.Status);
            setSelectedBranch(first.Branch);
            setSelectedTransDate(first.TransDate);
          } else {
            // กรณี error อื่น ๆ
            await Swal.fire({
              icon: "warning",
              title: "ไม่สามารถเลือกสินค้าได้",
              text: message || "เกิดข้อผิดพลาด",
              confirmButtonText: "ตกลง",
            });
            setProduct([]);
          }
        }

        // กรณีมาจากการเลือก category ปกติ (ไม่มี barCodeNormal) ก็เซ็ตปกติ
        if (!barCodeNormal) {
          setBundleOk(true);
          setProduct(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (selectedCategoryId || barCodeNormal) {
      fetchProducts();
    }
  }, [selectedCategoryId, barCodeNormal]);

  // GetProduct/ProductPromotionList
  useEffect(() => {
    // 1) ตรวจสอบเงื่อนไขก่อน
    if (selectedProductIndex === null || useBundle === null) return;
    // 2) สร้าง FormData จริงๆ
    const form = new FormData();
    form.append("ProductID", String(productId));
    form.append("EmpId", EmpId);
    form.append("DivisionId", DivisionId);
    form.append("DepartId", DepartId);
    form.append("DepartGroup", DepartGroup);
    form.append("TeamSale", TeamSale);
    form.append("ItemID", selectedItemCode!);
    form.append("IsBundle", useBundle === "bundle" ? "1" : "0");

    // 3) ส่ง FormData ให้ axios จัด header ให้เอง
    const fetchPromotion = async () => {
      setLoadingPromotion(true);
      try {
        const res = await axios.post(PROMOTION_URL, form);
        const promos = Array.isArray(res.data.data) ? res.data.data : [];
        setPromotion(promos);
      } catch (err) {
        console.error("Error fetching promotion:", err);
      } finally {
        setLoadingPromotion(false);
      }
    };

    fetchPromotion();
  }, [
    selectedProductIndex,
    useBundle,
    productId, // ถ้าตัวแปรพวกนี้เปลี่ยน ก็สั่ง fetch ใหม่
    EmpId,
    DivisionId,
    DepartId,
    DepartGroup,
    TeamSale,
    selectedItemCode,
  ]);

  // 1) โปรโมชั่นโหมด “ปกติ”
  useEffect(() => {
    if (selectedProductIndex === null || useBundle !== "normal") return;

    const form = new FormData();
    form.append("ProductID", productId!);
    form.append("EmpId", EmpId);
    form.append("DivisionId", DivisionId);
    form.append("DepartId", DepartId);
    form.append("DepartGroup", DepartGroup);
    form.append("TeamSale", TeamSale);
    form.append("ItemID", selectedItemCode!);
    form.append("IsBundle", "0");

    axios
      .post(PROMOTION_URL, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setPromotion(Array.isArray(res.data.data) ? res.data.data : []);
        // **อย่าไป setSelectedPromotion ใหม่ที่นี่**
      })
      .catch(console.error);
  }, [selectedProductIndex, useBundle]);

  // 2) โปรโมชั่นโหมด “บันเดิล”
  useEffect(() => {
    if (selectedProductIndex === null || useBundle !== "bundle") return;

    const form = new FormData();
    form.append("ProductID", productId!);
    form.append("EmpId", EmpId);
    form.append("DivisionId", DivisionId);
    form.append("DepartId", DepartId);
    form.append("DepartGroup", DepartGroup);
    form.append("TeamSale", TeamSale);
    form.append("ItemID", selectedItemCode!);
    form.append("IsBundle", "1");

    axios
      .post(PROMOTION_URL, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setPromotion(Array.isArray(res.data.data) ? res.data.data : []);
        // **อย่าไป setSelectedPromotion ใหม่ที่นี่**
      })
      .catch(console.error);
  }, [selectedProductIndex, useBundle]);

  // GET GetPackage/PackageType
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(PACKAGE_URL, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setPackageType(data);
      } catch (error) {
        console.error("Error fetching PACKAGE_URL:", error);
      }
    };
    getData();

    setEmpId(auth.data[0].EmpId);
    setTeamSale(auth.data[0].TeamSale);
    setSaleCode(auth.data[0].SaleCode);
    setSupEmpId(auth.data[0].SupEmp);
    setSecEmpId(auth.data[0].SecEmp);
    setDivisionId(auth.data[0].DivisionId);
    setDepartId(auth.data[0].DepartId);
    setDepartGroup(auth.data[0].DepartGroup);
  }, []);

  // POST GetPackage/PackageList
  useEffect(() => {
    const postData = async () => {
      setLoadingPackages(true); // เริ่มโหลดข้อมูล
      try {
        const response = await axios.post(
          POST_PACKAGE_URL,
          {
            EmpId,
            DivisionId,
            DepartId,
            DepartGroup,
            TeamSale,
            ItemID,
            PackageTypeID,
            PromotionID: selectedPromotion,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        // หน่วงเวลา 2 วินาทีก่อนแสดงผลข้อมูล
        setTimeout(() => {
          setPackageList(data); // อัปเดตแพ็คเกจหลังจากหน่วงเวลา
          setLoadingPackages(false); // หยุดแสดง loading หลังหน่วงเวลา
        }, 1000);
      } catch (error) {
        console.error("Error fetching POST_PACKAGE_URL:", error);
        setLoadingPackages(false); // หยุดแสดง loading ถ้าเกิดข้อผิดพลาด
      }
    };

    postData();
  }, [
    EmpId,
    DivisionId,
    DepartId,
    DepartGroup,
    TeamSale,
    ItemID,
    PackageTypeID,
    selectedPromotion,
  ]);

  useEffect(() => {
    // console.log("SaveProductData:", SaveProductData);
    if (JSON.stringify(SaveProductData) !== JSON.stringify(PRODUCT)) {
      // console.log("Updating product in store...");
      SETPRODUCT(SaveProductData);
    }
  }, [SaveProductData, PRODUCT, SETPRODUCT]);

  const handleCateOptionChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
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
    setSelectedPromotion(null);
    setSelectedPackageTypeId(null);
    setSelectedPackageModel(null);
    setPackageList([]);

    // ล้าง barCode
    navigate("/sale/package", { state: { barCode: "" } });

    if (value) {
      try {
        setLoadingProducts(true);
        const response = await axios.get(
          `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${value}`
        );
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setProduct(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    }
  };

  const handleCardProductClick = (index: number) => {
    setSelectedProductIndex(index);
    setSelectedItemCode(product[index].ItemCode);
    setItemID(product[index].ItemCode);
    setProductId(product[index].ProductID);
    setSelectedItemDescription(product[index].ItemDescription);
    setSelectedDescriptionEN(product[index].DescriptionEN);
    setSelectedDescriptionTH(product[index].DescriptionTH);
    setSelectedSerialNo(product[index].SerialNo);
    setSelectedStatus(product[index].Status);
    setSelectedBranch(product[index].Branch);
    setSelectedTransDate(product[index].TransDate);
  };

  const handlePackageTypeClick = (packageTypeId: number) => {
    setSelectedPackageTypeId(packageTypeId);
    setPackageTypeID(packageTypeId);
  };

  // 2. ใส่ useEffect ใหม่ รอให้ packageList โหลดเสร็จ และ selectedPackageTypeId มีค่า
  useEffect(() => {
    if (
      selectedPackageTypeId !== null &&
      packageList.length > 0 &&
      packageSectionRef.current
    ) {
      packageSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedPackageTypeId, packageList]);

  const handlePackageModelClick = (index: number) => {
    if (packageList[index] && packageList[index].MODEL) {
      // console.log("Selected Package:", packageList[index]); // Debug ข้อมูล
      setSelectedPackageModel(index); // อัปเดต selectedPackageModel
      setModel(packageList[index].MODEL); // อัปเดต Model
      setSelectedProductId(packageList[index].PRODUCTID); // อัปเดต Product ID
    } else {
      console.error("Invalid package data at index:", index);
      setSelectedPackageModel(null); // หากข้อมูลไม่ถูกต้อง ตั้งค่า null
    }
  };

  useEffect(() => {
    // console.log("Package List:", packageList);
  }, [packageList]);

  useEffect(() => {
    if (selectedPackageModel !== null && packageList[selectedPackageModel]) {
      const selectedModel = packageList[selectedPackageModel].MODEL;
      setModel(selectedModel); // อัปเดตค่า Model จาก packageList[selectedPackageModel]
    }
  }, [selectedPackageModel, packageList, setModel]);

  const handleScanBarcodeClick = () => {
    // ล้างค่าของสินค้าตัวแรก (CardProduct)
    setSelectedProductIndex(null);
    setSelectedItemCode(null);
    setItemID("");
    setProduct([]);
    setSelectedPromotion(null);
    localStorage.removeItem("sp.selectedProductIndex");
    localStorage.removeItem("sp.selectedItemCode");
    localStorage.removeItem("sp.productId");
    localStorage.removeItem("sp.selectedPromotion");

    // ลบ bundle เก่าด้วย (ถ้ามี)
    setUseBundle(null);
    setScannedBundleProduct(null);
    localStorage.removeItem("sp.barCodeBundle");
    localStorage.removeItem("sp.bundleProduct");

    const isDesktop = !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isDesktop) {
      Swal.fire({
        icon: "info",
        title: "ไม่รองรับ",
        text: "ฟีเจอร์สแกนบาร์โค้ด สามารถใช้งานได้เฉพาะบนมือถือหรือแท็บเล็ตเท่านั้น",
      });
      return;
    }

    // navigate("/sale/scanbarcode");
    navigate("/sale/scanbarcode", {
      state: { state, REFNO, origin: "/sale/package" },
    });
  };

  const handleScanBarcodeBundleClick = () => {
    const isDesktop = !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isDesktop) {
      Swal.fire({
        icon: "info",
        title: "ไม่รองรับ",
        text: "ฟีเจอร์สแกนบาร์โค้ด สามารถใช้งานได้เฉพาะบนมือถือหรือแท็บเล็ตเท่านั้น",
      });
      return;
    }

    navigate("/sale/scanbarcodebundle", {
      state: {
        origin: "/sale/package",
        refno: REFNO,
        barCodeNormal,
        barCode: barCodeNormal,
        promotionId: selectedPromotion as number,
        selectedItemCode,
        productId,
      },
    });
  };

  // const handleNextClick = async () => {
  //     console.log("SaveProductData ก่อนส่ง:", SaveProductData);

  //     try {
  //         // Save product package
  //         const response = await axios.post(SAVEPRODUCTPACKAGE, {
  //             REFNO,
  //             EMPID: EmpId,
  //             TEAMSALE: TeamSale,
  //             SALECODE: SaleCode,
  //             SUPEMPID: SupEmpId,
  //             SECEMPID: SecEmpId,
  //             STATUS: "DRAFT",
  //             PRODUCT: SaveProductData,
  //         }, {
  //             headers: {
  //                 'Content-Type': 'application/json',
  //             },
  //         });

  //         const result = response.data;
  //         console.log(`result`, result);

  //         const newId = result.data._id; // ดึง _id จาก response

  //         // อัปเดต state ด้วย _id ที่ได้รับจาก API
  //         setProductId(newId);

  //         const conditionCheckResponse = await axios.post(API_URL_POST_CONDITIONSCHECKHISTORY, {
  //             EmpId, DivisionId, DepartId, DepartGroup, TeamSale, Model
  //         }, {
  //             headers: {
  //                 'Content-Type': 'multipart/form-data',
  //             },
  //         });

  //         setChecktype(conditionCheckResponse.data.checktype); // อัปเดตค่า checktype ใน state

  //         let updateData;

  //         if (conditionCheckResponse.data.checktype !== 0) {
  //             const { value: idCard } = await MySwal.fire({
  //                 title: 'ตรวจสอบประวัติลูกค้า',
  //                 html: `
  //                     <input
  //                         id="idCardInput"
  //                         type="text"
  //                         class="form-control"
  //                         placeholder="กรุณากรอกเลขบัตรประชาชน (13 หลัก)"
  //                         maxlength="13"
  //                         oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0,13);"
  //                     />
  //                 `,
  //                 showCancelButton: true,
  //                 confirmButtonText: 'ตรวจสอบ',
  //                 cancelButtonText: 'ยกเลิก',
  //                 preConfirm: async () => {
  //                     const input = (document.getElementById('idCardInput') as HTMLInputElement).value;
  //                     if (input.length === 13) {
  //                         return input;
  //                     } else {
  //                         MySwal.showValidationMessage('กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก');
  //                         return null;
  //                     }
  //                 }
  //             });

  //             if (idCard) {
  //                 setSearch(idCard);
  //                 const apiResponse = await axios.post(CHECKCUSTOMER_URL, { Search: idCard }, {
  //                     headers: {
  //                         'Content-Type': 'multipart/form-data',
  //                     },
  //                 });

  //                 const { Customerstatus, message } = apiResponse.data;
  //                 const destination = Customerstatus ? '/sale/overview' : '/sale/discount';

  //                 await MySwal.fire({
  //                     text: message,
  //                     icon: Customerstatus ? 'success' : 'warning',
  //                     timer: 2000, // แสดงผล 3 วินาที
  //                     showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
  //                 });

  //                 updateData = [idCard, conditionCheckResponse.data.checktype, Customerstatus, message];
  //                 navigate(destination); // นำทางไปยังหน้าที่ต้องการ
  //             }
  //         } else {
  //             SETPRODUCT(result.data); // อัปเดต PRODUCT ใน Zustand store
  //             updateData = ["", conditionCheckResponse.data.checktype, conditionCheckResponse.data.message];
  //             navigate('/sale/discount'); // นำทางไปยังหน้า sale/discount
  //         }

  //         // เรียก API UPDATECONTACT หลังจากเสร็จสิ้นเงื่อนไขทั้งหมด
  //         try {
  //             const updateContract = await axios.post(UPDATECONTACT, {
  //                 REFNO,
  //                 EMPID: EmpId,
  //                 TEAMSALE: TeamSale,
  //                 FIELD: "CUSTOMERSTATUS",
  //                 DATA: updateData,
  //             }, {
  //                 headers: {
  //                     'Content-Type': 'application/json',
  //                 },
  //             });

  //             // console.log(`updateContract CUSTOMERSTATUS: `, updateContract.data);

  //             await MySwal.fire({
  //                 icon: 'success',
  //                 title: 'สำเร็จ!',
  //                 text: 'บันทึกข้อมูลสินค้าเรียบร้อยแล้ว',
  //                 timer: 2000, // แสดงผล 3 วินาที
  //                 showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
  //             });
  //         } catch (error) {
  //             console.error('Error updating contract:', error);
  //             MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
  //         }
  //     } catch (error) {
  //         console.error('Error saving product package:', error);
  //         MySwal.fire({
  //             title: 'เกิดข้อผิดพลาด',
  //             text: 'ไม่สามารถบันทึกข้อมูลได้',
  //             icon: 'error',
  //             confirmButtonText: 'ตกลง'
  //         });
  //     }
  // };

  const handleNextClick = async () => {
    // console.log("SaveProductData ก่อนส่ง:", SaveProductData);

    // ก่อน navigate เรายังเก็บล่าสุดอีกรอบก็ได้
    localStorage.setItem("saveProductData", JSON.stringify(SaveProductData));

    try {
      // Save product package
      const response = await axios.post(
        UPDATECONTACT,
        {
          REFNO,
          EMPID: EmpId,
          TEAMSALE: TeamSale,
          FIELD: "PRODUCT",
          DATA: SaveProductData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = response.data;
      // console.log(`result`, result);

      // เรียก API UPDATECONTACT หลังจากเสร็จสิ้นเงื่อนไขทั้งหมด
      try {
        await MySwal.fire({
          icon: "success",
          title: "สำเร็จ!",
          text: "บันทึกข้อมูลเรียบร้อยแล้ว",
          timer: 2000, // แสดงผล 3 วินาที
          showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
        });
        navigate("/sale/discount", { state: { fromPackage: true } });
      } catch (error) {
        console.error("Error updating contract:", error);
        MySwal.fire("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
      }
    } catch (error) {
      console.error("Error saving product package:", error);
      MySwal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกข้อมูลได้",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  // การ์ดสินค้า bundle
  useEffect(() => {
    // ให้ default เป็นออบเจ็กต์ว่าง เพื่อไม่ให้ s ever be null
    const s = (location.state ?? {}) as any;
    if (s.bundleProduct && s.barCodeBundle) {
      setUseBundle("bundle");
      setBundleOk(true);
      setScannedBundleProduct(s.bundleProduct);

      // คืนโปรโมชั่น
      if (s.promotionId != null) {
        setSelectedPromotion(s.promotionId);
      }
      // **ห้าม setItemCode/productId ตรงนี้เด็ดขาด**
    }
  }, [location.state]);

  // บังคับทำ ถึงโชว์ปุ่มถัดไป
  const canProceed = useMemo(() => {
    // ต้องเลือกสินค้าแล้ว
    if (selectedProductIndex === null) return false;
    // ต้องเลือกโหมดแล้ว (ปกติ/บันเดิล)
    if (useBundle === null) return false;
    // ต้องเลือกโปรโมชันแล้ว
    if (selectedPromotion === null) return false;
    // ต้องเลือกประเภทการชำระแล้ว
    if (selectedPackageTypeId === null) return false;
    // ระหว่างโหลดแพ็กเกจ ห้ามกด
    if (loadingPackages) return false;
    // ต้องเลือกแพ็คเกจแล้ว
    if (selectedPackageModel === null) return false;
    // ✅ เงื่อนไขใหม่: ถ้าเป็นบันเดิล ต้องสแกนสินค้าบันเดิลแล้ว
    if (useBundle === "bundle" && !scannedBundleProduct) return false;

    return true;
  }, [
    selectedProductIndex,
    useBundle,
    selectedPromotion,
    selectedPackageTypeId,
    loadingPackages,
    packageList.length,
    selectedPackageModel,
    scannedBundleProduct, // สำคัญสำหรับบันเดิล
  ]);

  useEffect(() => {
    // เมื่อมีการเปลี่ยนสินค้า / โหมด (ปกติ-บันเดิล) / โปรโมชัน / ประเภทการชำระ
    // ให้ล้างแพ็กเกจที่เลือกไว้
    setSelectedPackageModel(null);

    // ถ้าคุณต้องการล้าง Model ใน store ด้วย (กันค่าค้าง)
    setModel(null as any);
  }, [selectedProductIndex, useBundle, selectedPromotion, selectedPackageTypeId]);

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
              <li className={`${styles.titlePage}`}>เลือกแพ็คเกจ</li>
            </ul>
          </div>
        </div>
        <span className={`${styles.fontSize}`}>เลขที่ขาย: </span>
        <span className={`${styles.titlePage}`}>{REFNO}</span>

        <div className="accordion mb-10" id="kt_accordion_1">
          <div className="accordion-item mb-10">
            <h2 className="accordion-header" id="kt_accordion_1_header_1">
              <h3
                className="accordion-button fs-4 fw-bold border-0 h-50px pt-5 rounded-top px-lg-15 px-7"
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
                เลือกแพ็คเกจ
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
                  <div className="card-body px-lg-9 px-1 mb-10">
                    <div className="row">
                      {/* สแกนบาร์โค้ด */}
                      <div
                        className="d-flex justify-content-center align-items-center mb-5"
                        onClick={handleScanBarcodeClick}
                      >
                        <label
                          className={`${styles.btnSuccess}`}
                          htmlFor="camera-input"
                          style={{
                            cursor: "pointer",
                            borderRadius: "10px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            width: "250px",
                            textAlign: "center",
                          }}
                        >
                          สแกน S/N
                          <FontAwesomeIcon icon={faBarcode} className="ms-3" />
                        </label>
                      </div>
                      {/* สแกนบาร์โค้ด */}

                      {/* <div className='col-lg-6 my-7 my-xl-10'>
                                                <label className='form-label required fw-bold fs-3'>หมวดหมู่สินค้า</label>
                                                <select
                                                    className='form-select'
                                                    onChange={handleCateOptionChange}
                                                >
                                                    <option value=''>เลือกหมวดหมู่สินค้า...</option>
                                                    {categories.map((item: any, index: number) => (
                                                        <option key={index} value={item.CategoriesId}>
                                                            {item.DescriptionTH}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div> */}
                    </div>

                    {/* แสดง Loading */}
                    {loadingProducts && (
                      <div className="text-center my-10">
                        <ThreeDot />
                        <p className={`my-5 ${styles.fontSize}`}>
                          กำลังโหลดข้อมูล กรุณารอสักครู่ ...
                        </p>
                      </div>
                    )}

                    {/* หากไม่มีสินค้าให้แสดงข้อความนี้ */}
                    {!loadingProducts &&
                      selectedCategoryId.length > 0 &&
                      product.length === 0 && (
                        <div className="text-center my-7">
                          <h5>ไม่มีรายการสินค้า</h5>
                        </div>
                      )}

                    <>
                      {selectedCategoryId.length > 0 && product.length > 0 ? (
                        <label
                          className={`form-label required mt-7 mt-xl-10 ${styles.label}`}
                        >
                          รายการสินค้า
                        </label>
                      ) : (
                        ""
                      )}
                      {!loadingProducts && product.length > 0 && (
                        <div className="row ">
                          {product.map((item, index) => (
                            <div
                              className="col-lg-6 mb-3 rounded"
                              key={index}
                              onClick={() => handleCardProductClick(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <CardProduct
                                DescriptionTH={item.DescriptionTH}
                                ItemDescription={item.ItemDescription}
                                ItemCode={item.ItemCode}
                                SerialNo={item.SerialNo}
                                // isSelected={selectedProductIndex === index}
                                isSelected={true}
                              />
                            </div>
                          ))}

                          {/* ถ้ามี bundle ให้โชว์ toggle */}
                          {selectedItemCode && (
                            <div className="d-flex gap-3 my-4 w-100">
                              {/* ปุ่ม ปกติ */}
                              <div className="flex-fill d-flex justify-content-center">
                                <div
                                  className={`
          border rounded h-60px d-flex justify-content-center align-items-center 
          fw-bold fs-6 px-5
          ${useBundle === "normal"
                                      ? "bg-success text-white"
                                      : "bg-white text-dark"
                                    }
        `}
                                  style={{
                                    cursor: "pointer",
                                    transition: "background-color 0.2s",
                                  }}
                                  onClick={() => {
                                    setUseBundle("normal");
                                    setSelectedPromotion(null);         // ✅ รีเซ็ต
                                    setScannedBundleProduct(null);      // เผื่อเคยสแกนบันเดิลค้างไว้
                                  }}
                                >
                                  <p className={styles.fontSize}>ปกติ</p>
                                </div>
                              </div>

                              {bundleOk && (
                                <>
                                  {/* ปุ่ม บันเดิล */}
                                  <div className="flex-fill d-flex justify-content-center">
                                    <div
                                      className={`
          border rounded h-60px d-flex justify-content-center align-items-center 
          fw-bold fs-6 px-5
          ${useBundle === "bundle"
                                          ? "bg-success text-white"
                                          : "bg-white text-dark"
                                        }
        `}
                                      style={{
                                        cursor: "pointer",
                                        transition: "background-color 0.2s",
                                      }}
                                      onClick={() => {
                                        setUseBundle("bundle");
                                        setSelectedPromotion(null);         // ✅ รีเซ็ต
                                        setScannedBundleProduct(null);      // ต้องสแกนใหม่อยู่ดี
                                      }}
                                    >
                                      <p className={styles.fontSize}>บันเดิล</p>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}

                          {/* แสดง Loading */}
                          {loadingPromotion && (
                            <div className="text-center my-10">
                              <ThreeDot />
                              <p className={`my-5 ${styles.fontSize}`}>
                                กำลังโหลดข้อมูล กรุณารอสักครู่ ...
                              </p>
                            </div>
                          )}

                          {/* {!loadingPromotion && (
                            <div className="row">
                              <div className="col-lg-6 my-7 my-xl-10">
                                <label
                                  className={`form-label required ${styles.label}`}
                                >
                                  โปรโมชั่น
                                </label>
                                <select
                                  className={`${styles.fontSize} form-select`}
                                  onChange={(e) => {
                                    const promoId = Number(e.target.value);
                                    setSelectedPromotion(promoId);
                                    localStorage.setItem(
                                      "sp.selectedPromotion",
                                      String(promoId)
                                    );
                                  }}
                                  value={selectedPromotion ?? ""} // ใช้ nullish coalescing เพื่อป้องกันค่าที่เป็น null
                                >
                                  <option value="">เลือกโปรโมชั่น</option>
                                  {promotion.map((item: any, index: number) => (
                                    <option
                                      key={index}
                                      value={item?.PROMOTIONID}
                                    >
                                      {item.PROMOTIONNAME}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )} */}

                          {!loadingPromotion && (
                            <div className="row">
                              <div className="col-lg-6 my-7 my-xl-10">
                                <label
                                  className={`form-label required ${styles.label}`}
                                >
                                  โปรโมชั่น
                                </label>
                                <select
                                  className={`${styles.fontSize} form-select`}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    const promoId = v ? Number(v) : null;
                                    setSelectedPromotion(promoId);

                                    // เปลี่ยนโปรฯ เมื่ออยู่โหมดบันเดิล → ต้องสแกนใหม่
                                    if (useBundle === "bundle") {
                                      setScannedBundleProduct(null);
                                      localStorage.removeItem("sp.barCodeBundle");
                                      localStorage.removeItem("sp.bundleProduct");
                                    }

                                    if (promoId == null) {
                                      localStorage.removeItem("sp.selectedPromotion");
                                    } else {
                                      localStorage.setItem("sp.selectedPromotion", String(promoId));
                                    }
                                  }}
                                  value={selectedPromotion ?? ""}   // null → แสดง placeholder
                                >
                                  <option value="">เลือกโปรโมชั่น</option>
                                  {promotion.map((item: any, idx: number) => (
                                    <option key={idx} value={item?.PROMOTIONID}>
                                      {item.PROMOTIONNAME}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}

                          {/* สแกนบาร์โค้ด */}
                          {useBundle === "bundle" && selectedPromotion && (
                            <div
                              className="d-flex justify-content-center align-items-center mb-5"
                              onClick={handleScanBarcodeBundleClick}
                            >
                              <label
                                className={`${styles.btnSuccess}`}
                                htmlFor="camera-input"
                                style={{
                                  cursor: "pointer",
                                  borderRadius: "10px",
                                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                  width: "250px",
                                  textAlign: "center",
                                }}
                              >
                                สแกน S/N (บันเดิล)
                                <FontAwesomeIcon
                                  icon={faBarcode}
                                  className="ms-3"
                                />
                              </label>
                            </div>
                          )}
                          {/* สแกนบาร์โค้ด */}

                          {useBundle === "bundle" && scannedBundleProduct && (
                            <div className="mt-4">
                              <label
                                className={`form-label required ${styles.label}`}
                              >
                                สินค้าบันเดิล
                              </label>
                              <CardProductBundle
                                DescriptionTH={
                                  scannedBundleProduct.DescriptionTH
                                }
                                ItemDescription={
                                  scannedBundleProduct.ItemDescription
                                }
                                ItemCode={scannedBundleProduct.ItemCode}
                                SerialNo={scannedBundleProduct.SerialNo}
                                isSelected={true}
                              />
                            </div>
                          )}

                          {!loadingPromotion && product.length !== 0 && (
                            <div className="container my-10 my-xl-10">
                              <div className="row d-flex">
                                <label
                                  className={`form-label required ${styles.label}`}
                                >
                                  ประเภทการชำระ
                                </label>
                                {packageType.map((item, index) => (
                                  <div className="col-6 col-md-auto mb-2 d-flex align-items-center">
                                    <div
                                      key={item.PACKAGETYPEID}
                                      className={`border rounded w-100 w-md-auto h-60px 
                                                                            d-flex justify-content-center align-items-center fw-bold fs-6 px-5`}
                                      style={{
                                        backgroundColor:
                                          selectedPackageTypeId ===
                                            item.PACKAGETYPEID
                                            ? "#ACE1AF"
                                            : "#fcfcfc",
                                        transition:
                                          "background-color 0.2s ease, color 0.2s ease",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handlePackageTypeClick(
                                          item.PACKAGETYPEID
                                        )
                                      }
                                    >
                                      <p className={`${styles.fontSize}`}>
                                        {item.PACKAGETYPENAME}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* หากไม่มีแพ็คเกจให้แสดงข้อความนี้ */}
                          {!loadingPackages &&
                            packageList.length === 0 &&
                            selectedCategoryId !== null &&
                            selectedProductIndex !== null &&
                            selectedPackageTypeId && (
                              <div className="text-center my-7">
                                <h5 className={`${styles.fontSize}`}>
                                  ไม่มีรายการแพ็คเกจ<br />ไม่สามารถขายสินค้าได้
                                </h5>
                              </div>
                            )}
                        </div>
                      )}
                    </>

                    {/* แสดง Loading */}
                    {loadingPackages && (
                      <div className="text-center my-10">
                        <ThreeDot />
                        <p className={`my-5 ${styles.fontSize}`}>
                          กำลังโหลดข้อมูล กรุณารอสักครู่ ...
                        </p>
                      </div>
                    )}

                    {/* แสดงแพ็คเกจหากโหลดเสร็จ */}
                    {!loadingPackages &&
                      packageList.length > 0 &&
                      selectedPackageTypeId !== null && (
                        <div className="my-10 my-xl-10" ref={packageSectionRef}>
                          <div className="row d-flex">
                            <label
                              className={`form-label required ${styles.label}`}
                            >
                              แพ็คเกจ
                            </label>
                            {packageList.map((item, index) => (
                              <div
                                className="col-12 col-md-4 col-sm-4 mb-2"
                                key={item.MODEL || index}
                                onClick={() => handlePackageModelClick(index)}
                                style={{ cursor: "pointer" }}
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

                    {/* Summary Table */}
                    {periods.length > 0 && (
                      <div className="mt-4">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th className={styles.fontSize}>งวดที่</th>
                              <th className={styles.fontSize}>ราคา</th>
                              <th className={styles.fontSize}>หน่วย</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* งวดที่ 1 */}
                            <tr>
                              <td className={styles.fontSize}>1</td>
                              <td className={styles.fontSize}>
                                {Number(
                                  periods[0].PAYMENTAMOUNT
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td className={styles.fontSize}>บาท</td>
                            </tr>

                            {/* งวดที่ 2–สุดท้าย ถ้ามีมากกว่า 1 งวด */}
                            {periods.length > 1 && (
                              <tr>
                                <td className={styles.fontSize}>
                                  2–{periods.length}
                                </td>
                                <td className={styles.fontSize}>
                                  {Number(
                                    periods[1].PAYMENTAMOUNT
                                  ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </td>
                                <td className={styles.fontSize}>บาท</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* เงื่อนไขแสดงปุ่มถัดไป เฉพาะเมื่อครบทุกข้อ */}
        {/* ปุ่มในหน้าจอใหญ่ */}
        <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
          <button
            className={styles.btnSecondary}
            onClick={() => navigate("/sale/overview")}
          >
            กลับหน้าแรก
          </button>

          {/* {selectedProductIndex !== null &&
            useBundle !== null &&
            selectedPromotion !== "" &&
            selectedPackageTypeId !== null &&
            !loadingPackages &&
            (packageList.length === 0 || selectedPackageModel !== null) && (
              <button className={styles.btnPrimary} onClick={handleNextClick}>
                ถัดไป
              </button>
            )} */}
          {canProceed && (
            <button className={styles.btnPrimary} onClick={handleNextClick}>
              ถัดไป
            </button>
          )}
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
            className={styles.btnSecondary}
            onClick={() => navigate("/sale/overview")}
          >
            กลับหน้าแรก
          </button>

          {/* {selectedProductIndex !== null &&
            useBundle !== null &&
            selectedPromotion !== "" &&
            selectedPackageTypeId !== null &&
            !loadingPackages &&
            (packageList.length === 0 || selectedPackageModel !== null) && (
              <button className={styles.btnPrimary} onClick={handleNextClick}>
                ถัดไป
              </button>
            )} */}
          {canProceed && (
            <button className={styles.btnPrimary} onClick={handleNextClick}>
              ถัดไป
            </button>
          )}
        </div>
      </Content>
    </>
  );
};

export default SalesPackage;
