import axios from 'axios';
import { useState, useEffect } from 'react';
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
import 'react-datepicker/dist/react-datepicker.css';

const OrderCreateBooking: React.FC = () => {
    const navigate = useNavigate();
    const { SETREFNO } = useUUIDStore();

    const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
    const CATEGORIES_URL = `${API_SALECONNEXT}/GetProduct/Categories`;
    const PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageType`;
    const POST_PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageList`;

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const getProductUrl = () => `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}`;

    const { auth } = useAuth();

    const { fetchCategory } = useFetchCategoryStore();
    console.log(`fetchCategory: `, fetchCategory);

    const {
        EmpId, setEmpId,
        TeamSale, setTeamSale,
        SaleCode, setSaleCode,
        SupEmpId, setSupEmpId,
        SecEmpId, setSecEmpId,
        DivisionId, setDivisionId,
        DepartId, setDepartId,
        DepartGroup, setDepartGroup,
    } = useCategoryStore();

    const { product, setProduct } = useProductStore();
    console.log(`product: `, product);

    const { ItemID, setItemID, PackageTypeID, setPackageTypeID } = usePackageStore();

    const [selectedCategoryId, setSelectedCategoryId] = useState<any>('');
    console.log(`selectedCategoryId: `, selectedCategoryId);

    const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
    console.log(`selectedProductIndex: `, selectedProductIndex);

    const [packageList, setPackageList] = useState<any[]>([]);

    const [selectedPackageTypeId, setSelectedPackageTypeId] = useState<number | null>(null);
    const [selectedPackageModel, setSelectedPackageModel] = useState<number | null>(null);

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

    // GET Product/GetStock?
    useEffect(() => {
        const getData = async () => {
            if (!selectedCategoryId) return;
            try {
                const response = await axios.get(getProductUrl(), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setProduct(data);
            } catch (error) {
                console.error('Error fetching getProductUrl:', error);
            }
        };
        getData();
    }, [selectedCategoryId, setProduct]);

    // POST GetPackage/PackageList
    useEffect(() => {
        const postData = async () => {
            try {
                const response = await axios.post(POST_PACKAGE_URL,
                    { EmpId, DivisionId, DepartId, DepartGroup, TeamSale, ItemID, PackageTypeID }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                // console.log(`response data from GetPackage/PackageList: `, data);
                setPackageList(data);
            } catch (error) {
                console.error('Error fetching POST_PACKAGE_URL:', error);
            }
        };
        postData();
    }, [EmpId, DivisionId, DepartId, DepartGroup, TeamSale, ItemID, PackageTypeID]);

    const handleCateOptionChange = (event: any) => {
        const value = event.target.value;
        setSelectedCategoryId(value);

        // ล้างข้อมูล product ทันทีเมื่อเลือกหมวดหมู่ใหม่
        setProduct([]);

        // ล้างค่าที่เลือกสำหรับ product, packageType, และ packageModel
        setSelectedProductIndex(null);
        setSelectedPackageTypeId(null);
        setSelectedPackageModel(null);
    };

    const handleCardProductClick = (event: any) => {
        const index = event.target.value; // รับค่า index ของสินค้าที่เลือก
        setSelectedProductIndex(Number(index));

        if (index !== null && product[Number(index)]) {
            // setSelectedItemCode(product[Number(index)].ItemCode);
            // setSelectedItemDescription(product[Number(index)].ItemDescription);
            // setSelectedSerialNo(product[Number(index)].SerialNo);
            // setSelectedStatus(product[Number(index)].Status);
            // setSelectedBranch(product[Number(index)].Branch);
            // setSelectedTransDate(product[Number(index)].TransDate);
        }
    };

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-7 mt-lg-0'>
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

                            <button
                                className='btn btn-success w-100 w-md-auto align-self-center h-50px mt-5'
                            // onClick={handleCheckerClick}
                            >
                                ค้นหาลูกค้า
                            </button>

                            <hr className='my-10' style={{ borderTop: '1px dotted black' }} />

                            <label className='form-label fw-bold fs-3 mb-10'>ข้อมูลพนักงานขาย</label>

                            <div className="container">
                                <div className='row mb-6'>
                                    <div className='col-lg-6 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>พนักงานขาย</label>
                                        <select
                                            className='form-select'
                                        // onChange={handleCustTypeOptionChange}
                                        // value={selectedCustomerType}
                                        >
                                            <option value=''>เลือกประเภทลูกค้า...</option>
                                            {/* {customerTypes.map((item: any) => (
                                        <option key={item.CUSTOMERTYPE} value={item.CUSTOMERTYPE}>
                                            {item.CUSTOMERTYPENAME}
                                        </option>
                                    ))} */}
                                        </select>
                                    </div>

                                    <div className='col-lg-6 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>ช่องทาง</label>
                                        <select
                                            className='form-select'
                                        // value={selectedCardType}
                                        // onChange={(e) => setSelectedCardType(e.target.value)}
                                        // disabled={!selectedCustomerType}
                                        >
                                            <option value=''>เลือกประเภทบัตร...</option>
                                            {/* {selectedCustomer.CARDTYPE.map((cardType: any) => (
                                        <option key={cardType.CARDTYPE} value={cardType.CARDTYPE}>
                                            {cardType.CARDTYPENAME}
                                        </option>
                                    ))} */}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="container">
                                <div className='row mb-6'>
                                    <div className='col-lg-6 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>ผู้แนะนำ (ถ้ามี)</label>
                                        <select
                                            className='form-select'
                                        // onChange={handleCustTypeOptionChange}
                                        // value={selectedCustomerType}
                                        >
                                            <option value=''>เลือกประเภทลูกค้า...</option>
                                            {/* {customerTypes.map((item: any) => (
                                        <option key={item.CUSTOMERTYPE} value={item.CUSTOMERTYPE}>
                                            {item.CUSTOMERTYPENAME}
                                        </option>
                                    ))} */}
                                        </select>
                                    </div>

                                    <div className='col-lg-6 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>ช่องทางย่อย</label>
                                        <input
                                            // value={fullName}
                                            // onChange={(e) => setFullName(e.target.value)}
                                            type='text'
                                            className='form-control form-control-lg  mb-3 mb-lg-0'
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className='my-10' style={{ borderTop: '1px dotted black' }} />

                            <label className='form-label fw-bold fs-3 mb-10'>ข้อมูลสินค้า</label>

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
                                                {fetchCategory.map((item: any, index: number) => (
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
                                                value={selectedProductIndex !== null ? selectedProductIndex : ''}
                                            >
                                                <option value="">เลือกสินค้า...</option>
                                                {product.map((item: any, index: number) => (
                                                    <option key={index} value={index}>
                                                        {item.ItemDescription} [ SerialNo: {item.SerialNo} ]
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-6">
                                            <label className="form-label required fw-bold fs-6">การชำระ</label>
                                            <div className="d-flex">
                                                <div className="form-check form-check-inline me-3">
                                                    <input className="form-check-input" type="radio" name="payment" value="cash" />
                                                    <label className='form-label fw-bold fs-6'>{packageType[0].PACKAGETYPENAME}</label>
                                                </div>
                                                <div className="form-check form-check-inline me-3">
                                                    <input className="form-check-input" type="radio" name="payment" value="installment" />
                                                    <label className='form-label fw-bold fs-6'>{packageType[1].PACKAGETYPENAME}</label>
                                                </div>
                                                <div className="form-check form-check-inline me-3">
                                                    <input className="form-check-input" type="radio" name="payment" value="credit" />
                                                    <label className='form-label fw-bold fs-6'>{packageType[2].PACKAGETYPENAME}</label>
                                                </div>
                                                <div className="form-check form-check-inline me-3">
                                                    <input className="form-check-input" type="radio" name="payment" value="credit" />
                                                    <label className='form-label fw-bold fs-6'>{packageType[3].PACKAGETYPENAME}</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label className="form-label required fw-bold fs-6">แพ็คเกจ</label>
                                            <select className="form-select">
                                                <option>เลือกแพ็คเกจ...</option>
                                                {/* Options here */}
                                            </select>
                                        </div>

                                        <div className="mb-6">
                                            <label className="form-label required fw-bold fs-6">ส่วนลด</label>
                                            <select className="form-select">
                                                <option>เลือกส่วนลด...</option>
                                                {/* Options here */}
                                            </select>
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
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Summary Table */}
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
                                            <tr>
                                                <td>1</td>
                                                <td>1000</td>
                                                <td>บาท</td>
                                            </tr>
                                            {/* Additional rows as needed */}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <hr className='my-10' style={{ borderTop: '1px dotted black' }} />

                            <label className='form-label fw-bold fs-3 mb-10'>ข้อมูลลูกค้า</label>

                            <div className="container">
                                <div className='row mb-6'>
                                    <div className='col-lg-6 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>ประเภทลูกค้า</label>
                                        <select
                                            className='form-select'
                                        // onChange={handleCustTypeOptionChange}
                                        // value={selectedCustomerType}
                                        >
                                            <option value=''>เลือกประเภทลูกค้า...</option>
                                            {/* {customerTypes.map((item: any) => (
                                        <option key={item.CUSTOMERTYPE} value={item.CUSTOMERTYPE}>
                                            {item.CUSTOMERTYPENAME}
                                        </option>
                                    ))} */}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <hr className='my-10' style={{ borderTop: '1px dotted black' }} />

                            <label className='form-label fw-bold fs-3 mb-10'>ที่อยู่ติดตั้ง</label>

                            <div className="container">
                                <div className='row mb-6'>
                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>บ้านเลขที่</label>
                                        <input
                                            // value={addressNumberForInstall}
                                            // onChange={(e) => {
                                            //     setAddressNumberForInstall(e.target.value);
                                            //     resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                            // }}
                                            type='text'
                                            className='form-control mb-3 mb-lg-0'
                                        />
                                    </div>
                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label fw-bold fs-6'>หมู่ที่</label>
                                        <input
                                            // value={addressMooForInstall}
                                            // onChange={(e) => {
                                            //     setAddressMooForInstall(e.target.value);
                                            //     resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                            // }}
                                            type='text'
                                            className='form-control mb-3 mb-lg-0'
                                        />
                                    </div>
                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label fw-bold fs-6'>ตรอก / ซอย</label>
                                        <input
                                            // value={addressSoiForInstall}
                                            // onChange={(e) => {
                                            //     setAddressSoiForInstall(e.target.value);
                                            //     resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                            // }}
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
                                            // value={addressRoadForInstall}
                                            // onChange={(e) => {
                                            //     setAddressRoadForInstall(e.target.value);
                                            //     resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                            // }}
                                            type='text'
                                            className='form-control mb-3 mb-lg-0'
                                        />
                                    </div>
                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>จังหวัด</label>
                                        <select
                                            className='form-select'
                                        // value={selectedProvinceForInstall}
                                        // onChange={(e) => {
                                        //     setSelectedProvinceForInstall(Number(e.target.value))
                                        //     resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                        // }}
                                        >
                                            <option value=''>เลือกจังหวัด...</option>
                                            {/* {getProvinceForInstall.map((item: any) => (
                                            <option key={item.PROVINCECODE} value={item.PROVINCECODE}>
                                                {item.PROVINCENAME}
                                            </option>
                                        ))} */}
                                        </select>
                                    </div>
                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>อำเภอ / เขต</label>
                                        <select
                                            className='form-select'
                                        // value={selectedDistrictForInstall}
                                        // onChange={(e) => {
                                        //     setSelectedDistrictForInstall(Number(e.target.value))
                                        //     resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                        // }}
                                        >
                                            {/* <option value=''>เลือกอำเภอ / เขต...</option>
                                        {getDistrictForInstall.map((item: any) => (
                                            <option key={item.DISTRICTCODE} value={item.DISTRICTCODE}>
                                                {item.DISTRICTNAME}
                                            </option>
                                        ))} */}
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
                                        // value={selectedSubDistrictForInstall}
                                        // onChange={(e) => {
                                        //     setSelectedSubDistrictForInstall(Number(e.target.value))
                                        //     resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                        // }}
                                        >
                                            {/* <option value=''>เลือกตำบล / แขวง...</option>
                                        {getSubDistrictForInstall.map((item: any) => (
                                            <option key={item.SUBDISTRICTCODE} value={item.SUBDISTRICTCODE}>
                                                {item.SUBDISTRICTNAME}
                                            </option>
                                        ))} */}
                                        </select>
                                    </div>

                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>รหัสไปรษณีย์</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            readOnly
                                            style={{
                                                backgroundColor: '#d7dbde',
                                            }}
                                        />
                                    </div>
                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                        <input
                                            // value={addressPhoneForInstall}
                                            // onChange={(e) => {
                                            //     setAddressPhoneForInstall(e.target.value)
                                            //     resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                            // }}
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
                                            // value={addressPhoneForInstall}
                                            // onChange={(e) => {
                                            //     setAddressPhoneForInstall(e.target.value)
                                            //     resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                            // }}
                                            type='text'
                                            className='form-control mb-3 mb-lg-0'
                                        />
                                    </div>

                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                        <input
                                            // value={addressPhoneForInstall}
                                            // onChange={(e) => {
                                            //     setAddressPhoneForInstall(e.target.value)
                                            //     resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                            // }}
                                            type='text'
                                            className='form-control mb-3 mb-lg-0'
                                        />
                                    </div>
                                    <div className='col-lg-4 mb-3'>
                                        <label className='form-label fw-bold fs-6'>E-Mail</label>
                                        <input
                                            // value={addressPhoneForInstall}
                                            // onChange={(e) => {
                                            //     setAddressPhoneForInstall(e.target.value)
                                            //     resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                            // }}
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

                            <label className='form-label fw-bold fs-3 mb-10 mt-10'>ของแถม</label>

                            <div className="container">
                                <div className="row mb-3 align-items-center">
                                    <div className="col-1 text-center">
                                        <span></span>
                                    </div>
                                    <div className="col-7">
                                        <select
                                            className='form-select'
                                        // onChange={handleCustTypeOptionChange}
                                        // value={selectedCustomerType}
                                        >
                                            <option value=''>เลือกของแถม...</option>
                                            {/* {customerTypes.map((item: any) => (
                                        <option key={item.CUSTOMERTYPE} value={item.CUSTOMERTYPE}>
                                            {item.CUSTOMERTYPENAME}
                                        </option>
                                    ))} */}
                                        </select>
                                    </div>
                                    <div className="col-2 text-center">
                                        <span>จำนวน</span>
                                    </div>
                                    <div className="col-2 d-flex align-items-center">
                                        <input type="text" className="form-control me-2" placeholder="หน่วย" />
                                        <span>หน่วย</span>
                                    </div>
                                </div>
                            </div>

                            <div className="container">
                                <div className="row mb-3 align-items-center">
                                    <div className="col-1 text-center">
                                        <span></span>
                                    </div>
                                    <div className="col-7">
                                        <select
                                            className='form-select'
                                        // onChange={handleCustTypeOptionChange}
                                        // value={selectedCustomerType}
                                        >
                                            <option value=''>เลือกของแถม...</option>
                                            {/* {customerTypes.map((item: any) => (
                                        <option key={item.CUSTOMERTYPE} value={item.CUSTOMERTYPE}>
                                            {item.CUSTOMERTYPENAME}
                                        </option>
                                    ))} */}
                                        </select>
                                    </div>
                                    <div className="col-2 text-center">
                                        <span>จำนวน</span>
                                    </div>
                                    <div className="col-2 d-flex align-items-center">
                                        <input type="text" className="form-control me-2" />
                                        <span>หน่วย</span>
                                    </div>
                                </div>
                            </div>

                            <hr className='mt-10' style={{ borderTop: '1px dotted black' }} />

                            <label className='form-label fw-bold fs-3 mb-10 mt-10'>ค่าใช้จ่าย อื่นๆ</label>

                            <div className="container">
                                <div className="row mb-3 align-items-center">
                                    <div className="col-1 text-center">
                                        <span>1.</span>
                                    </div>
                                    <div className="col-2">
                                        <label className="form-label fw-bold mb-0">ค่าขนส่ง</label>
                                    </div>
                                    <div className="col-3">
                                        <input type="text" className="form-control" />
                                    </div>
                                    <div className="col-2 text-center">
                                        <span>กิโลเมตร</span>
                                    </div>
                                    <div className="col-2 text-center">
                                        <span>เป็นเงิน</span>
                                    </div>
                                    <div className="col-2 d-flex align-items-center">
                                        <input type="text" className="form-control me-2" />
                                        <span>บาท</span>
                                    </div>
                                </div>

                                {/* ข้ออื่น ๆ */}
                                {[2, 3, 4, 5].map((num) => (
                                    <div className="row mb-3 align-items-center" key={num}>
                                        <div className="col-1 text-center">
                                            <span>{num}.</span>
                                        </div>
                                        <div className="col-7">
                                            <input type="text" className="form-control" placeholder="..." />
                                        </div>
                                        <div className="col-2 text-center">
                                            <span>เป็นเงิน</span>
                                        </div>
                                        <div className="col-2 d-flex align-items-center">
                                            <input type="text" className="form-control me-2" />
                                            <span>บาท</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <hr className='mt-10' style={{ borderTop: '1px dotted black' }} />

                            <label className='form-label fw-bold fs-3 mb-10 mt-10'>ค่าใช้จ่าย อื่นๆ</label>

                            <div className="container">
                                <div className="row mb-3">
                                    <div className="col-lg-3 col-form-label fw-bold">สลิปโอนเงิน</div>
                                    <div className="col-lg-9">
                                        <input type="file" className="form-control" />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-lg-3 col-form-label fw-bold">หนังสือรับรอง</div>
                                    <div className="col-lg-9">
                                        <input type="file" className="form-control" />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-lg-3 col-form-label fw-bold">บัตรประชาชน</div>
                                    <div className="col-lg-9">
                                        <input type="file" className="form-control" />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-lg-3 col-form-label fw-bold">อื่นๆ</div>
                                    <div className="col-lg-9">
                                        <input type="file" className="form-control" />
                                    </div>
                                </div>
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
                                                // selected={valueCalendar}
                                                // onChange={handleDateChange}
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
                                        // value={selectedCardType}
                                        // onChange={(e) => setSelectedCardType(e.target.value)}
                                        // disabled={!selectedCustomerType}
                                        >
                                            <option value=''>เลือกช่วงเวลา...</option>
                                            {/* {selectedCustomer.CARDTYPE.map((cardType: any) => (
                                        <option key={cardType.CARDTYPE} value={cardType.CARDTYPE}>
                                            {cardType.CARDTYPENAME}
                                        </option>
                                    ))} */}
                                        </select>
                                    </div>

                                    <div className="container">
                                        <div className='col-lg-6 mb-10'>
                                            <label className='form-label required fw-bold fs-6'>รูปแบบการจัดส่ง</label>
                                            <select
                                                className='form-select'
                                            // value={selectedCardType}
                                            // onChange={(e) => setSelectedCardType(e.target.value)}
                                            // disabled={!selectedCustomerType}
                                            >
                                                <option value=''>เลือกรูปแบบการจัดส่ง...</option>
                                                {/* {selectedCustomer.CARDTYPE.map((cardType: any) => (
                                        <option key={cardType.CARDTYPE} value={cardType.CARDTYPE}>
                                            {cardType.CARDTYPENAME}
                                        </option>
                                    ))} */}
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

                            <hr className='mt-10' style={{ borderTop: '1px dotted black' }} />

                            <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                                <button
                                    className='btn btn-secondary w-100 w-md-auto align-self-center h-50px'
                                // onClick={() => navigate('/sale/step', { state: item })}
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

                        </div>
                    </div>
                </div >
                {/* End Card Body */}
            </Content >
        </>
    )
}

export default OrderCreateBooking;