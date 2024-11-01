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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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

const UpdateSaleCustDetail: React.FC = () => {
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal);

    const location = useLocation();
    const item = location.state as ItemProps || [];

    const refno = item?.REFNO
    const customerDetail = item?.CUSTOMERDETAIL
    let customerStatus = item?.CUSTOMERSTATUS
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

    const [Model, setModel] = useState<string>('');
    const [checktype, setChecktype] = useState<number | null>(null);

    const [customerTypes, setCustomerTypes] = useState<any[]>([]);

    const [valueCalendar, setValueCalendar] = useState<Date | null>(null);
    const [valueAge, setValueAge] = useState<number | null>(null);

    const [selectedCustomerType, setsSelectedCustomerType] = useState<string>('');
    const [selectedCardType, setSelectedCardType] = useState<string>('');
    const [selectedPrefixId, setSelectedPrefixId] = useState<number>();
    const [selectedSexId, setSelectedSexId] = useState<number>();

    const [idCard, setIdCard] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [nameMD, setNameMD] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [mobile, setMobile] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [workPhone, setWorkPhone] = useState<string>('');

    const selectedCustomer = customerTypes.find((type) => type.CUSTOMERTYPE === selectedCustomerType) || { CARDTYPE: [], PREFIX: [], SEX: [] };

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

        setsSelectedCustomerType(customerDetail?.[0]?.CUSTOMERTYPE)
        setSelectedCardType(customerDetail?.[0]?.CARDTYPE?.[0]?.CARDTYPE)
        setIdCard(customerDetail?.[0]?.CUSTOMERID)
        setFullName(customerDetail?.[0]?.CUSTOMERNAME)
        setNameMD(customerDetail?.[0]?.CUSTOMERMD)
        setSelectedPrefixId(customerDetail?.[0]?.PREFIX?.[0]?.PREFIXID)
        setValueCalendar(customerDetail?.[0]?.CUSTOMERDOB)
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

    const customerValidation = async () => {
        const conditionCheckResponse = await axios.post(API_URL_POST_CONDITIONSCHECKHISTORY, {
            EmpId, DivisionId, DepartId, DepartGroup, TeamSale, Model
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        let updateData;

        console.log(conditionCheckResponse)

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
                    console.log(result)
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

                        console.log(apiResponse)

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

    // validate filed
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!idCard || !/^\d{13}$/.test(idCard)) {
            newErrors.idCard = 'กรุณากรอกเลขบัตรประชาชนที่ถูกต้อง';
        }

        if (!fullName || fullName.trim() === '') {
            newErrors.fullName = 'กรุณากรอกชื่อ-สกุล';
        }

        if (!age || !/^\d+$/.test(age) || parseInt(age) <= 0) {
            newErrors.age = 'กรุณากรอกอายุที่ถูกต้อง';
        }

        if (email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            newErrors.email = 'กรุณากรอกอีเมลให้ถูกต้อง';
        }

        if (!mobile || !/^\d{9,10}$/.test(mobile)) {
            newErrors.mobile = 'กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง (9-10 หลัก)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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

    const handleNextClick = async () => {
        try {
            // POST Contract/updateContract
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
            console.log(`updateContract CUSTOMERDETAIL: `, updateContract.data);

            if (updateContract.status === 200) {
                if (!updateContract.data.data) {
                    MySwal.fire('เกิดข้อผิดพลาด', 'ปรับปรุงข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา', 'error');
                } else {
                    MySwal.fire('สำเร็จ', 'ปรับปรุงข้อมูลลูกค้าแล้ว', 'success');
                }
            } else {
                MySwal.fire('เกิดข้อผิดพลาด', updateContract.data.message, 'error');
            }
        } catch (error) {
            console.error('Error fetching UPDATECONTACT:', error);
        }
    };

    const handleCheckerClick = async () => {
        const response = await axios.post(UPDATECONTACT, {
            REFNO: refno,
            EMPID: EmpId,
            TEAMSALE: TeamSale,
            FIELD: "STATUS",
            DATA: "PENDING",
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(response)

        if (response.status === 200) {
            if (!response.data.data) {
                MySwal.fire('เกิดข้อผิดพลาด', 'ส่งข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา', 'error');
            } else {
                MySwal.fire('สำเร็จ', 'ส่งข้อมูลตรวจสอบแล้ว', 'success');
            }
        } else {
            MySwal.fire('เกิดข้อผิดพลาด', response.data.message, 'error');
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const formData = {
                selectedCustomerType,
                selectedCardType,
                idCard,
                selectedPrefixId,
                fullName,
                valueCalendar,
                age,
                selectedSexId,
                email,
                mobile
            };
            console.log('Submitting form data:', formData);
        } else {
            console.log('Form has errors');
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
                            ข้อมูลลูกค้า
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
                                    ระบบขาย
                                </a></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">แก้ไขข้อมูลลูกค้า</li>
                        </ul>
                    </div>
                </div>
                <p>REFNO: {refno}</p>

                {/* Card Body */}
                <form onSubmit={handleSubmit}>
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
                                                    <div className='row mb-6'>
                                                        <div className='col-lg-6 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ประเภทลูกค้า</label>
                                                            <select
                                                                disabled={customerDetail?.length > 0 ? true : false}
                                                                className='form-select form-select-solid form-select-lg'
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
                                                                className='form-select form-select-solid form-select-lg'
                                                                value={selectedCardType}
                                                                disabled={customerDetail?.length > 0 ? customerDetail?.[0]?.CARDTYPE.length > 0 ? true : false : false}
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

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4'>
                                                            <label className='form-label required fw-bold fs-6'>บัตรประชาชน</label>
                                                            <input
                                                                disabled={customerDetail?.length > 0 ? customerDetail?.[0]?.CUSTOMERID !== "" ? true : false : false}
                                                                value={idCard}
                                                                onChange={handleIdCardChange}
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='บัตรประชาชน'
                                                            />
                                                            {/* {errors.idCard && <p className='text-danger'>{errors.idCard.message}</p>} */}
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>คำนำหน้าชื่อ</label>
                                                            <select
                                                                value={selectedPrefixId}
                                                                className='form-select form-select-solid form-select-lg'
                                                                onChange={(e) => setSelectedPrefixId(Number(e.target.value))}
                                                                disabled={customerDetail?.length > 0 ? customerDetail?.[0]?.PREFIX.length > 0 ? true : false : false}
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
                                                                value={fullName}
                                                                onChange={(e) => setFullName(e.target.value)}
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='ชื่อ-สกุล'
                                                            />
                                                            {errors.fullName && <p className='text-danger'>{errors.fullName}</p>}
                                                        </div>
                                                    </div>

                                                    <div className='row mb-6'>
                                                        <div className="col-lg-4 mb-3">
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <label className="form-label required fw-bold fs-6">วันเดือนปีเกิด</label>
                                                                <DatePicker
                                                                    selected={valueCalendar}
                                                                    onChange={handleDateChange}
                                                                    className="form-control form-control-lg form-control-solid mb-3 mb-lg-0"
                                                                    placeholderText="วันเดือนปีเกิด"
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
                                                                className="form-control form-control-lg form-control-solid mb-3 mb-lg-0"
                                                                placeholder="อายุ"
                                                                readOnly
                                                            />

                                                        </div>
                                                        {selectedCustomerType !== "1" && (
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>เพศ</label>
                                                                <select
                                                                    value={selectedSexId}
                                                                    className='form-select form-select-solid form-select-lg mb-3 mb-lg-0'
                                                                    onChange={(e) => setSelectedSexId(Number(e.target.value))}
                                                                    disabled={customerDetail?.length > 0 ? customerDetail?.[0]?.SEX.length > 0 ? true : false : false}
                                                                >
                                                                    <option value=''>เลือกเพศ...</option>
                                                                    {selectedCustomer.SEX.map((sex: any) => (
                                                                        <option key={sex.SEXID} value={sex.SEXID}>{sex.SEXNAME}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        )}

                                                        <div className='row mb-6 mt-6'>
                                                            <div className='col-lg-6 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                                                <input
                                                                    value={mobile}
                                                                    onChange={(e) => setMobile(e.target.value)}
                                                                    type='text'
                                                                    className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                    placeholder='เบอร์ที่ติดต่อได้'
                                                                />
                                                                {errors.mobile && <p className='text-danger'>{errors.mobile}</p>}
                                                            </div>
                                                            <div className='col-lg-6 mb-3'>
                                                                <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                                                <input
                                                                    value={phone}
                                                                    onChange={(e) => setPhone(e.target.value)}
                                                                    type='text'
                                                                    className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                    placeholder='เบอร์บ้าน'
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='row mb-6'>
                                                            <div className='col-lg-6 mb-3'>
                                                                <label className='form-label fw-bold fs-6'>เบอร์ที่ทำงาน</label>
                                                                <input
                                                                    value={workPhone}
                                                                    onChange={(e) => setWorkPhone(e.target.value)}
                                                                    type='text'
                                                                    className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                    placeholder='เบอร์ที่ทำงาน'
                                                                />
                                                            </div>
                                                            <div className='col-lg-6 mb-3'>
                                                                <label className='form-label fw-bold fs-6'>อีเมล์</label>
                                                                <input
                                                                    value={email}
                                                                    onChange={(e) => setEmail(e.target.value)}
                                                                    type='text'
                                                                    className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                    placeholder='อีเมล์'
                                                                />
                                                                {errors.email && <p className='text-danger'>{errors.email}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* Start กรณีประเภทลูกค้าเป็น นิติบุคคล */}
                                            {selectedCustomerType == "1" && (
                                                <>
                                                    <div className='row mb-6'>
                                                        <div className='col-lg-6 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ประเภทลูกค้า</label>
                                                            <select
                                                                className='form-select form-select-solid form-select-lg'
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
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='ชื่อบริษัท'
                                                            />
                                                            {/* {errors.idCard && <p className='text-danger'>{errors.idCard.message}</p>} */}
                                                        </div>

                                                    </div>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4'>
                                                            <label className='form-label required fw-bold fs-6'>เลขประจำตัวผู้เสียภาษี</label>
                                                            <input
                                                                value={idCard}
                                                                onChange={(e) => setIdCard(e.target.value)}
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='เลขประจำตัวผู้เสียภาษี'
                                                                disabled={customerDetail?.length > 0 ? customerDetail?.[0]?.CUSTOMERID !== "" ? true : false : false}
                                                            />
                                                            {/* {errors.idCard && <p className='text-danger'>{errors.idCard.message}</p>} */}
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>คำนำหน้า</label>
                                                            <select
                                                                className='form-select form-select-solid form-select-lg'
                                                                onChange={(e) => setSelectedPrefixId(Number(e.target.value))}
                                                                disabled={customerDetail?.length > 0 ? customerDetail?.[0]?.PREFIX.length > 0 ? true : false : false}
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
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='กรรมการผู้มีอำนาจ'
                                                                disabled={customerDetail?.length > 0 ? customerDetail?.[0]?.CUSTOMERMD !== "" ? true : false : false}
                                                            />
                                                            {/* {errors.fullname && <p className='text-danger'>{errors.fullname.message}</p>} */}
                                                        </div>

                                                        <div className='row mb-6 mt-6'>
                                                            <div className='col-lg-6 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                                                <input
                                                                    value={mobile}
                                                                    type='text'
                                                                    className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                    placeholder='เบอร์ที่ติดต่อได้'
                                                                    onChange={(e) => setMobile(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className='col-lg-6 mb-3'>
                                                                <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                                                <input
                                                                    value={phone}
                                                                    type='text'
                                                                    className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                    placeholder='เบอร์บ้าน'
                                                                    onChange={(e) => setPhone(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='row mb-6'>
                                                            <div className='col-lg-6 mb-3'>
                                                                <label className='form-label fw-bold fs-6'>เบอร์ที่ทำงาน</label>
                                                                <input
                                                                    value={workPhone}
                                                                    type='text'
                                                                    className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                    placeholder='เบอร์ที่ทำงาน'
                                                                    onChange={(e) => setWorkPhone(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className='col-lg-6 mb-3'>
                                                                <label className='form-label fw-bold fs-6'>อีเมล์</label>
                                                                <input
                                                                    value={email}
                                                                    onChange={(e) => setEmail(e.target.value)}
                                                                    type='text'
                                                                    className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                    placeholder='อีเมล์'
                                                                />
                                                                {/* {errors.email && <p className='text-danger'>{errors.email.message}</p>} */}
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

                    <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                        <button
                            className='btn btn-secondary w-100 w-md-auto align-self-center h-50px'
                            onClick={() => navigate('/sale/step', { state: item })}>
                            ย้อนกลับ
                        </button>
                        <button
                            className='btn btn-warning w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px'
                            onClick={handleNextClick}>
                            อัพเดทข้อมูล
                        </button>
                        <button
                            className='btn btn-primary w-100 w-md-auto align-self-center h-50px'
                            onClick={handleCheckerClick}
                        >
                            ส่งตรวจสอบ
                        </button>
                    </div>
                </form>
            </Content >
        </>
    )
}

export default UpdateSaleCustDetail