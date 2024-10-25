import { useState, ChangeEvent, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate, } from 'react-router-dom'
import axios from 'axios';
import clsx from 'clsx'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/content'

import {
    useUUIDStore,
    useSaveCustomerStore,
    useAddressCardStore
} from '../../modules/stores/stepsStore';

import dayjs, { Dayjs } from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SalesCreateCust: React.FC = () => {
    const navigate = useNavigate()

    const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
    const CUSTOMER_TYPE_URL = `${API_SALECONNEXT}/GetCustomertype`;
    const PROVINCE_URL = `${API_SALECONNEXT}/GetAddress/Province`;
    const DISTRICT_URL = `${API_SALECONNEXT}/GetAddress/District`;
    const SUBDISTRICT_URL = `${API_SALECONNEXT}/GetAddress/SubDistrict`;
    const ZIPCODE_URL = `${API_SALECONNEXT}/GetAddress/Zipcode`;

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

    const { REFNO } = useUUIDStore();
    const { saveCustomerTypes, setSaveCustomerTypes } = useSaveCustomerStore()
    const { addressCard, setAddressCard } = useAddressCardStore();

    const [customerTypes, setCustomerTypes] = useState<any[]>([]);
    const [getProvince, setGetProvince] = useState<any[]>([]);
    const [getDistrict, setGetDistrict] = useState<any[]>([]);
    // console.log("getDistrict:", getDistrict);
    const [getSubDistrict, setGetSubDistrict] = useState<any[]>([]);
    const [getZipcode, setGetZipcode] = useState<any[]>([]);

    const [showCustomerAddress, setShowCustomerAddress] = useState(true);
    const [showInstallAddress, setShowInstallAddress] = useState(false);
    const [showBillAddress, setShowBillAddress] = useState(false);
    const [showBillTax, setShowBillTax] = useState(false);

    const [valueCalendar, setValueCalendar] = useState<Date | null>(null);
    const [valueAge, setValueAge] = useState<number | null>(null);

    const [selectedCustomerType, setsSelectedCustomerType] = useState<string>('');
    const [selectedCardType, setSelectedCardType] = useState<string>('');
    const [selectedPrefixId, setSelectedPrefixId] = useState<number>();
    const [selectedSexId, setSelectedSexId] = useState<number>();

    const [selectedProvince, setSelectedProvince] = useState<number>();
    console.log(`selectedProvince`, selectedProvince);
    const [selectedDistrict, setSelectedDistrict] = useState<number>();
    console.log(`selectedDistrict`, selectedDistrict);
    const [selectedSubDistrict, setSelectedSubDistrict] = useState<number>();
    console.log(`selectedSubDistrict`, selectedSubDistrict);
    const [selectedZipcode, setSelectedZipcode] = useState<string>('');
    console.log(`selectedZipcode`, selectedZipcode);

    const [idCard, setIdCard] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [mobile, setMobile] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [workPhone, setWorkPhone] = useState<string>('');

    const selectedCustomer = customerTypes.find((type) => type.CUSTOMERTYPE === selectedCustomerType) || { CARDTYPE: [], PREFIX: [], SEX: [] };

    const [addressNumber, setAddressNumber] = useState<string>('');
    const [addressMoo, setAddressMoo] = useState<string>('');
    const [addressSoi, setAddressSoi] = useState<string>('');
    const [addressRoad, setAddressRoad] = useState<string>('');
    const [addressProvince, setAddressProvince] = useState<string>('');
    const [addressDistrict, setAddressDistrict] = useState<string>('');
    const [addressSubdistrict, setAddressSubdistrict] = useState<string>('');
    const [addressZipcode, setAddressZipcode] = useState<string>('');
    const [addressPhone, setAddressPhone] = useState<string>('');
    const [useThisTax, setUseThisTax] = useState<string>('FALSE');

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
                CUSTOMERMD: '',
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

    // อัปเดตข้อมูลส่วนลดใน store
    useEffect(() => {
        if (JSON.stringify(SaveCustomertData) !== JSON.stringify(saveCustomerTypes)) {
            setSaveCustomerTypes(SaveCustomertData); // อัปเดตข้อมูลลง store
        }
    }, [SaveCustomertData, saveCustomerTypes, setSaveCustomerTypes]);

    const SaveAddressCardData = useMemo(() => {
        return [
            {
                ADDRESSCARD: {
                    ADDRESSNUMBER: addressNumber,
                    ADDRESSMOO: addressMoo,
                    ADDRESSSOI: addressSoi,
                    ADDRESSROAD: addressRoad,
                    ADDRESSPROVINCE: selectedProvince,
                    ADDRESSDISTRICT: selectedDistrict,
                    ADDRESSSUBDISTRICT: selectedSubDistrict,
                    ADDRESSZIPCODE: selectedZipcode,
                    ADDRESSPHONE: addressPhone,
                    USETHISTAX: useThisTax,
                },
            },
        ];
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
        useThisTax
    ]);

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

    // GET Province
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

    // POST District
    useEffect(() => {
        const getData = async () => {
            if (selectedProvince) { // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
                try {
                    const response = await axios.post(DISTRICT_URL, { ProvinceCode: selectedProvince }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    setGetDistrict(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
                } catch (error) {
                    console.error('Error fetching DISTRICT_URL:', error);
                }
            } else {
                setGetDistrict([]); // ล้างข้อมูล district เมื่อไม่ได้เลือก province
            }
        };
        getData();
    }, [selectedProvince]);

    // POST SubDistrict
    useEffect(() => {
        const getData = async () => {
            if (selectedSubDistrict) {
                try {
                    const response = await axios.post(ZIPCODE_URL, { SubDistrictCode: selectedSubDistrict }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    if (response.data.length > 0) {
                        setSelectedZipcode(response.data[0].POSTCODE); // อัปเดต selectedZipcode จากข้อมูล API
                    }
                } catch (error) {
                    console.error('Error fetching ZIPCODE_URL:', error);
                }
            } else {
                setSelectedZipcode(''); // ล้างข้อมูลรหัสไปรษณีย์หากไม่เลือกตำบล
            }
        };
        getData();
    }, [selectedSubDistrict]);

    // POST Zipcode
    useEffect(() => {
        const getData = async () => {
            if (selectedSubDistrict) {
                try {
                    const response = await axios.post(ZIPCODE_URL, { SubDistrictCode: selectedSubDistrict }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    setGetZipcode(response.data);
                } catch (error) {
                    console.error('Error fetching ZIPCODE_URL:', error);
                }
            } else {
                setGetZipcode([]);
            }
        };
        getData();
    }, [selectedSubDistrict]);

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

    const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setSelectedProvince(value);
        // Reset district, subdistrict, and zipcode
        setSelectedDistrict(undefined);
        setSelectedSubDistrict(undefined);
        // setSelectedZipcode(undefined);
    };

    const handleDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setSelectedDistrict(value);
        // Reset subdistrict and zipcode
        setSelectedSubDistrict(undefined);
        // setSelectedZipcode(undefined);
    };

    const handleSubDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setSelectedSubDistrict(value);
        // Reset zipcode
        // setSelectedZipcode(undefined);
    };

    const handleZipcodeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        // setSelectedZipcode(value);
    };

    const handleCheckboxChange = (event: any) => {
        const { name, checked } = event.target;
        if (name === 'showInstallAddress') {
            setShowInstallAddress(checked);
        } else if (name === 'showBillAddress') {
            setShowBillAddress(checked);
        }
    };

    const handleShowBillTax = () => {
        setShowBillTax(true);
    };

    const handleNextClick = async () => {
        try {
            // POST Contract/updateContract
            const updateContract = await axios.post(UPDATECONTACT, {
                REFNO,
                FIELD: "CUSTOMERDETAIL",
                DATA: SaveCustomertData
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(`updateContract CUSTOMERDETAIL: `, updateContract.data);
        } catch (error) {
            console.error('Error fetching UPDATECONTACT:', error);
        }
        setShowCustomerAddress(true);
    };

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
                <div className='d-flex justify-content-between align-items-center mb-7 mt-1 mt-lg-0'>
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
                            <li className="breadcrumb-item text-gray-900">ข้อมูลลูกค้า</li>
                        </ul>
                    </div>
                </div>
                <p>เลขที่ขาย: {REFNO}</p>

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

                                            {/* <div className='row mb-15'>
                                                <div className='d-flex justify-content-center'>
                                                    <div
                                                        className='image-input image-input-outline'
                                                        data-kt-image-input='true'
                                                        style={{ backgroundImage: `url(${toAbsoluteUrl('media/avatars/blank.png')})` }}
                                                    >
                                                        <img
                                                            className='image-input-wrapper w-125px h-125px'
                                                            src={toAbsoluteUrl('media/avatars/300-14.jpg')}
                                                            alt=''
                                                        />
                                                    </div>
                                                </div>
                                            </div> */}

                                            {selectedCustomerType !== "1" && (
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

                                                        <div className='col-lg-6 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ประเภทบัตร</label>
                                                            <select
                                                                className='form-select form-select-solid form-select-lg'
                                                                value={selectedCardType}
                                                                onChange={(e) => setSelectedCardType(e.target.value)}
                                                                disabled={!selectedCustomerType}
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
                                                                className='form-select form-select-solid form-select-lg'
                                                                onChange={(e) => setSelectedPrefixId(Number(e.target.value))}
                                                                disabled={!selectedCustomerType}
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
                                                                    className='form-select form-select-solid form-select-lg mb-3 mb-lg-0'
                                                                    onChange={(e) => setSelectedSexId(Number(e.target.value))}
                                                                    disabled={!selectedCustomerType}
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
                                                                // value={fields.idCard}
                                                                // onChange={handleTextChange('idCard')}
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
                                                                // value={fields.idCard}
                                                                // onChange={handleTextChange('idCard')}
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='เลขประจำตัวผู้เสียภาษี'
                                                            />
                                                            {/* {errors.idCard && <p className='text-danger'>{errors.idCard.message}</p>} */}
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>คำนำหน้า</label>
                                                            <select
                                                                className='form-select form-select-solid form-select-lg'
                                                                onChange={(e) => setSelectedPrefixId(Number(e.target.value))}
                                                                disabled={!selectedCustomerType}
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
                                                                // value={fields.fullname}
                                                                // onChange={handleTextChange('fullname')}
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='กรรมการผู้มีอำนาจ'
                                                            />
                                                            {/* {errors.fullname && <p className='text-danger'>{errors.fullname.message}</p>} */}
                                                        </div>

                                                        <div className='row mb-6 mt-6'>
                                                            <div className='col-lg-6 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                                                <input
                                                                    type='text'
                                                                    className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                    placeholder='เบอร์ที่ติดต่อได้'
                                                                />
                                                            </div>
                                                            <div className='col-lg-6 mb-3'>
                                                                <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                                                <input
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
                                                                    type='text'
                                                                    className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                    placeholder='เบอร์ที่ทำงาน'
                                                                />
                                                            </div>
                                                            <div className='col-lg-6 mb-3'>
                                                                <label className='form-label fw-bold fs-6'>อีเมล์</label>
                                                                <input
                                                                    // value={fields.email}
                                                                    // onChange={handleTextChange("email")}
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

                                            <button
                                                className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'
                                                type='button'
                                                onClick={handleNextClick}
                                                disabled={!selectedCustomerType || !selectedCardType || !idCard ||
                                                    !selectedPrefixId || !fullName || !valueCalendar || !valueAge ||
                                                    !selectedSexId || !mobile}
                                            >
                                                เพิ่มที่อยู่ลูกค้า
                                            </button>

                                        </div>
                                    </form>
                                    {/* end form */}
                                </div>
                            </div>
                        </div>

                        {/* End accordion ข้อมูลลูกค้า*/}

                        {/* Start accordion ที่อยู่ลูกค้า (ตามบัตร)*/}
                        {showCustomerAddress && (
                            < div className='accordion mb-10' id='kt_accordion_2'>
                                <div className='accordion-item mb-10'>
                                    <h2 className='accordion-header' id='kt_accordion_2_header_2'>
                                        <h3
                                            className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                            data-bs-toggle='collapse'
                                            data-bs-target='#kt_accordion_2_body_2'
                                            aria-expanded='true'
                                            aria-controls='kt_accordion_2_body_2'
                                            style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                                        >
                                            ที่อยู่ลูกค้า (ตามบัตร)
                                        </h3>
                                    </h2>
                                    <div
                                        id='kt_accordion_2_body_2'
                                        className='accordion-collapse collapse show'
                                        aria-labelledby='kt_accordion_2_header_2'
                                        data-bs-parent='#kt_accordion_2'
                                    >
                                        <div className='accordion-body'>
                                            {/* start form */}
                                            <form noValidate className='form'>
                                                <div className='card-body px-lg-9 px-1'>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>บ้านเลขที่</label>
                                                            <input
                                                                value={addressNumber}
                                                                onChange={(e) => setAddressNumber(e.target.value)}
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='บ้านเลขที่'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label fw-bold fs-6'>หมู่ที่</label>
                                                            <input
                                                                value={addressMoo}
                                                                onChange={(e) => setAddressMoo(e.target.value)}
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='หมู่ที่'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label fw-bold fs-6'>ตรอก / ซอย</label>
                                                            <input
                                                                value={addressSoi}
                                                                onChange={(e) => setAddressSoi(e.target.value)}
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='ตรอก / ซอย'
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label fw-bold fs-6'>ถนน</label>
                                                            <input
                                                                value={addressRoad}
                                                                onChange={(e) => setAddressRoad(e.target.value)}
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='ถนน'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>จังหวัด</label>
                                                            <select
                                                                className='form-select form-select-solid form-select-lg'
                                                                onChange={handleProvinceChange}
                                                            >
                                                                <option value=''>เลือกจังหวัด...</option>
                                                                {getProvince.map((item: any) => (
                                                                    <option key={item.PROVINCECODE} value={item.PROVINCECODE}>
                                                                        {item.PROVINCENAME}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>อำเภอ / เขต</label>
                                                            <select
                                                                className='form-select form-select-solid form-select-lg'
                                                                onChange={handleDistrictChange}
                                                            >
                                                                <option value=''>เลือกอำเภอ / เขต...</option>
                                                                {Array.isArray(getDistrict) && getDistrict.map((item: any) => (
                                                                    <option key={item.DISTRICTCODE} value={item.DISTRICTCODE}>
                                                                        {item.DISTRICTNAME}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ตำบล / แขวง</label>
                                                            <select
                                                                className='form-select form-select-solid form-select-lg'
                                                                onChange={handleSubDistrictChange}
                                                            >
                                                                <option value=''>เลือกตำบล / แขวง...</option>
                                                                {Array.isArray(getSubDistrict) && getSubDistrict.map((item: any) => (
                                                                    <option key={item.SUBDISTRICTCODE} value={item.SUBDISTRICTCODE}>
                                                                        {item.SUBDISTRICTNAME}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>รหัสไปรษณีย์</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                value={selectedZipcode} // แสดงผลรหัสไปรษณีย์
                                                                readOnly // ตั้งค่าให้อ่านได้อย่างเดียว
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                                            <input
                                                                value={addressPhone}
                                                                onChange={(e) => setAddressPhone(e.target.value)}
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='เบอร์ที่ติดต่อได้'
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-6 mb-3 mt-xl-5'>
                                                            <label className='form-check form-check-inline form-check-solid me-5'>
                                                                <input
                                                                    onChange={handleCheckboxChange}
                                                                    className='form-check-input'
                                                                    name='showInstallAddress'
                                                                    type='checkbox'
                                                                />
                                                                <span className='fw-bold ps-2 fs-6 mb-sm-5'>ใช้เหมือนที่อยู่ติดตั้ง</span>
                                                            </label>
                                                            <label className='form-check form-check-inline form-check-solid me-5 mt-3 mt-sm-0'>
                                                                <input
                                                                    onChange={handleCheckboxChange}
                                                                    className='form-check-input'
                                                                    name='showBillAddress'
                                                                    type='checkbox'
                                                                />
                                                                <span className='fw-bold ps-2 fs-6'>ใช้เหมือนที่อยู่เก็บเงิน</span>
                                                            </label>
                                                        </div>
                                                    </div>

                                                </div>
                                            </form>
                                            {/* end form */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* End accordion ที่อยู่ลูกค้า (ตามบัตร)*/}

                        {/* Start accordion ที่อยู่ลูกค้า (ติดตั้ง)*/}
                        {showCustomerAddress && !showInstallAddress && (
                            <div className='accordion mb-10' id='kt_accordion_3'>

                                <div className='accordion-item mb-10'>
                                    <h2 className='accordion-header' id='kt_accordion_3_header_3'>
                                        <h3
                                            className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                            data-bs-toggle='collapse'
                                            data-bs-target='#kt_accordion_3_body_3'
                                            aria-expanded='true'
                                            aria-controls='kt_accordion_3_body_3'
                                            style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                                        >
                                            ที่อยู่ลูกค้า (ติดตั้ง)
                                        </h3>
                                    </h2>
                                    <div
                                        id='kt_accordion_3_body_3'
                                        className='accordion-collapse collapse show'
                                        aria-labelledby='kt_accordion_3_header_3'
                                        data-bs-parent='#kt_accordion_3'
                                    >
                                        <div className='accordion-body'>
                                            {/* start form */}
                                            <form noValidate className='form'>
                                                <div className='card-body px-lg-9 px-1'>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>บ้านเลขที่</label>
                                                            <input
                                                                // // value={fields.field4}
                                                                // onChange={handleTextChange('field4')}
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='บ้านเลขที่'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>หมู่ที่</label>
                                                            <input
                                                                // // value={fields.field5}
                                                                // onChange={handleTextChange('field5')}
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='หมู่ที่'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ตรอก / ซอย</label>
                                                            <input
                                                                // // value={fields.field6}
                                                                // onChange={handleTextChange('field6')}
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='ตรอก / ซอย'
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ถนน</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='ถนน'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>จังหวัด</label>
                                                            <select
                                                                className='form-select form-select-solid form-select-lg'
                                                                onChange={(e) => setSelectedProvince(Number(e.target.value))}
                                                            >
                                                                <option value=''>เลือกจังหวัด...</option>
                                                                {getProvince.map((item: any) => (
                                                                    <option key={item.PROVINCECODE} value={item.PROVINCECODE}>
                                                                        {item.PROVINCENAME}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>อำเภอ / เขต</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกอำเภอ / เขต...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ตำบล / แขวง</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกตำบล / แขวง...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>รหัสไปรษณีย์</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกรหัสไปรษณีย์...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='เบอร์ที่ติดต่อได้'
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                            </form>
                                            {/* end form */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* End accordion ที่อยู่ลูกค้า (ติดตั้ง)*/}

                        {/* Start accordion ที่อยู่ลูกค้า (เก็บเงิน)*/}
                        {showCustomerAddress && !showBillAddress && (
                            <div className='accordion mb-10' id='kt_accordion_4'>

                                <div className='accordion-item mb-10'>
                                    <h2 className='accordion-header' id='kt_accordion_4_header_4'>
                                        <h3
                                            className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                            data-bs-toggle='collapse'
                                            data-bs-target='#kt_accordion_4_body_4'
                                            aria-expanded='true'
                                            aria-controls='kt_accordion_4_body_4'
                                            style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                                        >
                                            ที่อยู่ลูกค้า (เก็บเงิน)
                                        </h3>
                                    </h2>
                                    <div
                                        id='kt_accordion_4_body_4'
                                        className='accordion-collapse collapse show'
                                        aria-labelledby='kt_accordion_4_header_4'
                                        data-bs-parent='#kt_accordion_4'
                                    >
                                        <div className='accordion-body'>
                                            {/* start form */}
                                            <form noValidate className='form'>
                                                <div className='card-body px-lg-9 px-1'>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>บ้านเลขที่</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='บ้านเลขที่'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>หมู่ที่</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='หมู่ที่'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ตรอก / ซอย</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='ตรอก / ซอย'
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ถนน</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='ถนน'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>จังหวัด</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกจังหวัด...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>อำเภอ / เขต</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกอำเภอ / เขต...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ตำบล / แขวง</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกตำบล / แขวง...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>รหัสไปรษณีย์</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกรหัสไปรษณีย์...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='เบอร์ที่ติดต่อได้'
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                            </form>
                                            {/* end form */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* End accordion ที่อยู่ลูกค้า (เก็บเงิน)*/}

                        {/* Start accordion ที่อยู่ลูกค้า (ใบกำกับภาษี)*/}
                        {showBillTax && (
                            <div className='accordion mb-10' id='kt_accordion_5'>

                                <div className='accordion-item mb-10'>
                                    <h2 className='accordion-header' id='kt_accordion_5_header_5'>
                                        <h3
                                            className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                            data-bs-toggle='collapse'
                                            data-bs-target='#kt_accordion_5_body_5'
                                            aria-expanded='true'
                                            aria-controls='kt_accordion_5_body_5'
                                            style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                                        >
                                            ที่อยู่ลูกค้า (ออกใบกำกับภาษี)
                                        </h3>
                                    </h2>
                                    <div
                                        id='kt_accordion_5_body_5'
                                        className='accordion-collapse collapse show'
                                        aria-labelledby='kt_accordion_5_header_5'
                                        data-bs-parent='#kt_accordion_5'
                                    >
                                        <div className='accordion-body'>
                                            {/* start form */}
                                            <form noValidate className='form'>
                                                <div className='card-body px-lg-9 px-1'>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>บ้านเลขที่</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='บ้านเลขที่'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>หมู่ที่</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='หมู่ที่'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ตรอก / ซอย</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='ตรอก / ซอย'
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ถนน</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='ถนน'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>จังหวัด</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกจังหวัด...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>อำเภอ / เขต</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกอำเภอ / เขต...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ตำบล / แขวง</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกตำบล / แขวง...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>รหัสไปรษณีย์</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกรหัสไปรษณีย์...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='เบอร์ที่ติดต่อได้'
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                            </form>
                                            {/* end form */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* End accordion ที่อยู่ลูกค้า (ใบกำกับภาษี)*/}

                        {!showBillTax && (
                            <button
                                className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'
                                type='button'
                                onClick={handleShowBillTax}
                                disabled={!addressNumber || !selectedProvince || !selectedDistrict || !selectedSubDistrict
                                    || !selectedZipcode || !addressPhone}
                            >
                                เพิ่มที่อยู่ออกใบกำกับภาษี
                            </button>
                        )}

                    </div>
                    {/* End Card */}

                    {showCustomerAddress && (
                        <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                            <Link to='/sale/discount' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                                ย้อนกลับ
                            </Link>
                            <button className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0' type='submit'>
                                จัดเก็บข้อมูล
                            </button>
                        </div>
                    )}
                </form>
            </Content >
        </>
    )
}

export default SalesCreateCust