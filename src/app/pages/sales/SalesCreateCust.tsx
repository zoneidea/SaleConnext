import { useState, ChangeEvent, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate, } from 'react-router-dom'
import axios from 'axios';
import clsx from 'clsx'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/content'
import { useAuth } from '../../modules/auth/core/Auth';

import {
    useUUIDStore,
    useSaveCustomerStore,
    useSaveAddressStore
} from '../../modules/stores/stepsStore';

import dayjs, { Dayjs } from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SalesCreateCust: React.FC = () => {
    const navigate = useNavigate()

    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const { REFNO } = useUUIDStore();
    const { saveCustomerTypes, setSaveCustomerTypes } = useSaveCustomerStore()
    // console.log(`saveCustomerTypes`,saveCustomerTypes);

    const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
    const CUSTOMER_TYPE_URL = `${API_SALECONNEXT}/GetCustomertype`;
    const PROVINCE_URL = `${API_SALECONNEXT}/GetAddress/Province`;
    const DISTRICT_URL = `${API_SALECONNEXT}/GetAddress/District`;
    const SUBDISTRICT_URL = `${API_SALECONNEXT}/GetAddress/SubDistrict`;
    const ZIPCODE_URL = `${API_SALECONNEXT}/GetAddress/Zipcode`;

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

    const {
        addressCard, setAddressCard,
        addressInstallation, setAddressInstallation,
        addressPayment, setAddressPayment,
        addressTax, setAddressTax,
    } = useSaveAddressStore();

    const [customerTypes, setCustomerTypes] = useState<any[]>([]);

    // [ที่อยู่ลูกค้า (ตามบัตร)]
    const [likeAllAddr, setLikeAllAddr] = useState(false)

    // [ที่อยู่ลูกค้า (ติดตั้ง)] 
    const [installLikeCardAddr, setInstallLikeCardAddr] = useState(false)

    // [ที่อยู่ลูกค้า (เก็บเงิน)] 
    const [paymentLikeCardAddr, setPaymentLikeCardAddr] = useState(false)
    const [paymentLikeInstallAddr, setPaymentLikeInstallAddr] = useState(false)

    // [ที่อยู่ลูกค้า (ออกใบกำกับ)] 
    const [billLikeCardAddr, setBillLikeCardAddr] = useState(false)
    const [billLikeInstallAddr, setBillLikeInstallAddr] = useState(false)
    const [billLikePaymentAddr, setBillLikePaymentAddr] = useState(false)

    const [showCustomerAddress, setShowCustomerAddress] = useState(false);
    const [showInstallAddress, setShowInstallAddress] = useState(false);
    const [showPaymentAddress, setShowPaymentAddress] = useState(false);
    // console.log(`showInstallAddress`, showInstallAddress);

    const [showBillTax, setShowBillTax] = useState(false);

    const [valueCalendar, setValueCalendar] = useState<Date | null>(null);
    const [valueAge, setValueAge] = useState<number | null>(null);

    const [selectedCustomerType, setsSelectedCustomerType] = useState<string>('');
    const [selectedCardType, setSelectedCardType] = useState<string>('');
    const [selectedPrefixId, setSelectedPrefixId] = useState<number>();
    const [selectedSexId, setSelectedSexId] = useState<number>();

    const [idCard, setIdCard] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [mobile, setMobile] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [workPhone, setWorkPhone] = useState<string>('');
    const [nameMD, setNameMD] = useState<string>('');

    const selectedCustomer = customerTypes.find((type) => type.CUSTOMERTYPE === selectedCustomerType) || { CARDTYPE: [], PREFIX: [], SEX: [] };

    // ที่อยู่ลูกค้า ตามบัตร
    const [getProvince, setGetProvince] = useState<any[]>([]);
    const [getDistrict, setGetDistrict] = useState<any[]>([]);
    const [getSubDistrict, setGetSubDistrict] = useState<any[]>([]);
    const [getZipcode, setGetZipcode] = useState<any[]>([]);

    // สร้าง state สำหรับ "ที่อยู่ลูกค้า (ตามบัตร)
    const [addressNumber, setAddressNumber] = useState<string>('');
    const [addressMoo, setAddressMoo] = useState<string>('');
    const [addressSoi, setAddressSoi] = useState<string>('');
    const [addressRoad, setAddressRoad] = useState<string>('');
    const [selectedProvince, setSelectedProvince] = useState<number>();
    // console.log(`selectedProvince`, selectedProvince);

    const [selectedDistrict, setSelectedDistrict] = useState<number>();
    const [selectedSubDistrict, setSelectedSubDistrict] = useState<number>();
    const [selectedZipcode, setSelectedZipcode] = useState<string>('');
    const [addressPhone, setAddressPhone] = useState<string>('');
    const [useThisTax, setUseThisTax] = useState<string>('FALSE');

    // ที่อยู่ลูกค้า ติดตั้ง
    const [getProvinceForInstall, setGetProvinceForInstall] = useState<any[]>([]);
    const [getDistrictForInstall, setGetDistrictForInstall] = useState<any[]>([]);
    const [getSubDistrictForInstall, setGetSubDistrictForInstall] = useState<any[]>([]);
    const [getZipcodeForInstall, setGetZipcodeForInstall] = useState<any[]>([]);

    // สร้าง state สำหรับ "ที่อยู่ลูกค้า (ติดตั้ง)
    const [addressNumberForInstall, setAddressNumberForInstall] = useState<string>('');
    // console.log(`addressNumberForInstall`, addressNumberForInstall);

    const [addressMooForInstall, setAddressMooForInstall] = useState<string>('');
    const [addressSoiForInstall, setAddressSoiForInstall] = useState<string>('');
    const [addressRoadForInstall, setAddressRoadForInstall] = useState<string>('');
    const [selectedProvinceForInstall, setSelectedProvinceForInstall] = useState<number | undefined>();
    const [selectedDistrictForInstall, setSelectedDistrictForInstall] = useState<number | undefined>();
    const [selectedSubDistrictForInstall, setSelectedSubDistrictForInstall] = useState<number | undefined>();
    const [selectedZipcodeForInstall, setSelectedZipcodeForInstall] = useState<string>('');
    const [addressPhoneForInstall, setAddressPhoneForInstall] = useState<string>('');

    // ที่อยู่ลูกค้า เก็บเงิน
    const [getProvinceForPayment, setGetProvinceForPayment] = useState<any[]>([]);
    const [getDistrictForPayment, setGetDistrictForPayment] = useState<any[]>([]);
    const [getSubDistrictForPayment, setGetSubDistrictForPayment] = useState<any[]>([]);
    const [getZipcodeForPayment, setGetZipcodeForPayment] = useState<any[]>([]);

    // สร้าง state สำหรับ "ที่อยู่ลูกค้า (เก็บเงิน)
    const [addressNumberForPayment, setAddressNumberForPayment] = useState<string>('');
    // console.log(`addressNumberForPayment`, addressNumberForPayment);

    const [addressMooForPayment, setAddressMooForPayment] = useState<string>('');
    const [addressSoiForPayment, setAddressSoiForPayment] = useState<string>('');
    const [addressRoadForPayment, setAddressRoadForPayment] = useState<string>('');
    const [selectedProvinceForPayment, setSelectedProvinceForPayment] = useState<number | undefined>();
    const [selectedDistrictForPayment, setSelectedDistrictForPayment] = useState<number | undefined>();
    const [selectedSubDistrictForPayment, setSelectedSubDistrictForPayment] = useState<number | undefined>();
    const [selectedZipcodeForPayment, setSelectedZipcodeForPayment] = useState<string>('');
    const [addressPhoneForPayment, setAddressPhoneForPayment] = useState<string>('');

    // สร้าง state สำหรับ "ที่อยู่ลูกค้า (ออกใบกำกับภาษี)
    const [getProvinceForBilling, setGetProvinceForBilling] = useState<any[]>([]);
    const [getDistrictForBilling, setGetDistrictForBilling] = useState<any[]>([]);
    const [getSubDistrictForBilling, setGetSubDistrictForBilling] = useState<any[]>([]);
    const [getZipcodeForBilling, setGetZipcodeForBilling] = useState<any[]>([]);

    const [addressNumberForBilling, setAddressNumberForBilling] = useState<string>('');
    const [addressMooForBilling, setAddressMooForBilling] = useState<string>('');
    const [addressSoiForBilling, setAddressSoiForBilling] = useState<string>('');
    const [addressRoadForBilling, setAddressRoadForBilling] = useState<string>('');
    const [selectedProvinceForBilling, setSelectedProvinceForBilling] = useState<number | undefined>();
    const [selectedDistrictForBilling, setSelectedDistrictForBilling] = useState<number | undefined>();
    const [selectedSubDistrictForBilling, setSelectedSubDistrictForBilling] = useState<number | undefined>();
    const [selectedZipcodeForBilling, setSelectedZipcodeForBilling] = useState<string>('');
    const [addressPhoneForBilling, setAddressPhoneForBilling] = useState<string>('');

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

    const SaveAddressData = useMemo(() => {
        const province = getProvince.find(p => String(p.PROVINCECODE) === String(selectedProvince));
        const district = getDistrict.find(p => String(p.DISTRICTCODE) === String(selectedDistrict));
        const subDistrict = getSubDistrict.find(p => String(p.SUBDISTRICTCODE) === String(selectedSubDistrict));

        const provinceForInstall = getProvinceForInstall.find(p => String(p.PROVINCECODE) === String(selectedProvinceForInstall));
        const districtForInstall = getDistrictForInstall.find(p => String(p.DISTRICTCODE) === String(selectedDistrictForInstall));
        const subDistrictForInstall = getSubDistrictForInstall.find(p => String(p.SUBDISTRICTCODE) === String(selectedSubDistrictForInstall));

        const provinceForPayment = getProvinceForPayment.find(p => String(p.PROVINCECODE) === String(selectedProvinceForPayment));
        const districtForPayment = getDistrictForPayment.find(p => String(p.DISTRICTCODE) === String(selectedDistrictForPayment));
        const subDistrictForPayment = getSubDistrictForPayment.find(p => String(p.SUBDISTRICTCODE) === String(selectedSubDistrictForPayment));

        const provinceForBilling = getProvince.find(p => String(p.PROVINCECODE) === String(selectedProvinceForBilling));
        const districtForBilling = getDistrictForBilling.find(p => String(p.DISTRICTCODE) === String(selectedDistrictForBilling));
        const subDistrictForBilling = getSubDistrictForBilling.find(p => String(p.SUBDISTRICTCODE) === String(selectedSubDistrictForBilling));

        return {
            ADDRESSCARD: {
                ADDRESSNUMBER: addressNumber,
                ADDRESSMOO: addressMoo,
                ADDRESSSOI: addressSoi,
                ADDRESSROAD: addressRoad,
                ADDRESSPROVINCE: selectedProvince ? selectedProvince.toString() : '',
                ADDRESSPROVINCENAME: province ? province.PROVINCENAME : '',
                ADDRESSDISTRICT: selectedDistrict ? selectedDistrict.toString() : '',
                ADDRESSDISTRICTNAME: district ? district.DISTRICTNAME : '',
                ADDRESSSUBDISTRICT: selectedSubDistrict ? selectedSubDistrict.toString() : '',
                ADDRESSSUBDISTRICTNAME: subDistrict ? subDistrict.SUBDISTRICTNAME : '',
                ADDRESSZIPCODE: selectedZipcode,
                ADDRESSPHONE: addressPhone,
                USETHISTAX: useThisTax,
            },
            ADDRESSINSTALLATION: {
                ADDRESSNUMBER: addressNumberForInstall,
                ADDRESSMOO: addressMooForInstall,
                ADDRESSSOI: addressSoiForInstall,
                ADDRESSROAD: addressRoadForInstall,
                ADDRESSPROVINCE: selectedProvinceForInstall ? selectedProvinceForInstall.toString() : '',
                ADDRESSPROVINCENAME: provinceForInstall ? provinceForInstall.PROVINCENAME : '',
                ADDRESSDISTRICT: selectedDistrictForInstall ? selectedDistrictForInstall.toString() : '',
                ADDRESSDISTRICTNAME: districtForInstall ? districtForInstall.DISTRICTNAME : '',
                ADDRESSSUBDISTRICT: selectedSubDistrictForInstall ? selectedSubDistrictForInstall.toString() : '',
                ADDRESSSUBDISTRICTNAME: subDistrictForInstall ? subDistrictForInstall.SUBDISTRICTNAME : '',
                ADDRESSZIPCODE: selectedZipcodeForInstall,
                ADDRESSPHONE: addressPhoneForInstall,
                USETHISTAX: useThisTax,
            },
            ADDRESSPAYMENT: {
                ADDRESSNUMBER: addressNumberForPayment,
                ADDRESSMOO: addressMooForPayment,
                ADDRESSSOI: addressSoiForPayment,
                ADDRESSROAD: addressRoadForPayment,
                ADDRESSPROVINCE: selectedProvinceForPayment ? selectedProvinceForPayment.toString() : '',
                ADDRESSPROVINCENAME: provinceForPayment ? provinceForPayment.PROVINCENAME : '',
                ADDRESSDISTRICT: selectedDistrictForPayment ? selectedDistrictForPayment.toString() : '',
                ADDRESSDISTRICTNAME: districtForPayment ? districtForPayment.DISTRICTNAME : '',
                ADDRESSSUBDISTRICT: selectedSubDistrictForPayment ? selectedSubDistrictForPayment.toString() : '',
                ADDRESSSUBDISTRICTNAME: subDistrictForPayment ? subDistrictForPayment.SUBDISTRICTNAME : '',
                ADDRESSZIPCODE: selectedZipcodeForPayment,
                ADDRESSPHONE: addressPhoneForPayment,
                USETHISTAX: useThisTax,
            },
            ADDRESSTAX: {
                ADDRESSNUMBER: addressNumberForBilling,
                ADDRESSMOO: addressMooForBilling,
                ADDRESSSOI: addressSoiForBilling,
                ADDRESSROAD: addressRoadForBilling,
                ADDRESSPROVINCE: selectedProvinceForBilling ? selectedProvinceForBilling.toString() : '',
                ADDRESSPROVINCENAME: provinceForBilling ? provinceForBilling.PROVINCENAME : '',
                ADDRESSDISTRICT: selectedDistrictForBilling ? selectedDistrictForBilling.toString() : '',
                ADDRESSDISTRICTNAME: districtForBilling ? districtForBilling.DISTRICTNAME : '',
                ADDRESSSUBDISTRICT: selectedSubDistrictForBilling ? selectedSubDistrictForBilling.toString() : '',
                ADDRESSSUBDISTRICTNAME: subDistrictForBilling ? subDistrictForBilling.SUBDISTRICTNAME : '',
                ADDRESSZIPCODE: selectedZipcodeForBilling,
                ADDRESSPHONE: addressPhoneForBilling,
                USETHISTAX: useThisTax,
            },
        };
    }, [
        addressNumber, addressMoo, addressSoi, addressRoad, selectedProvince, selectedDistrict, selectedSubDistrict,
        selectedZipcode, addressPhone, useThisTax, getProvince, getDistrict, getSubDistrict,

        addressNumberForInstall, addressMooForInstall, addressSoiForInstall, addressRoadForInstall, selectedProvinceForInstall,
        selectedDistrictForInstall, selectedSubDistrictForInstall, selectedZipcodeForInstall, addressPhoneForInstall,
        getProvinceForInstall, getDistrictForInstall, getSubDistrictForInstall,

        addressNumberForPayment, addressMooForPayment, addressSoiForPayment, addressRoadForPayment, selectedProvinceForPayment,
        selectedDistrictForPayment, selectedSubDistrictForPayment, selectedZipcodeForPayment, addressPhoneForPayment,
        getProvinceForPayment, getDistrictForPayment, getSubDistrictForPayment,

        addressNumberForBilling, addressMooForBilling, addressSoiForBilling, addressRoadForBilling, selectedProvinceForBilling,
        selectedDistrictForBilling, selectedSubDistrictForBilling, selectedZipcodeForBilling, addressPhoneForBilling,
        getProvinceForBilling, getDistrictForBilling, getSubDistrictForBilling,
    ]);

    // อัปเดตข้อมูลส่วน address ลง store
    useEffect(() => {
        // เช็คและอัปเดตข้อมูล AddressCard
        if (JSON.stringify(addressCard) !== JSON.stringify(SaveAddressData.ADDRESSCARD)) {
            setAddressCard(SaveAddressData.ADDRESSCARD);
        }

        // เช็คและอัปเดตข้อมูล AddressInstallation
        if (JSON.stringify(addressInstallation) !== JSON.stringify(SaveAddressData.ADDRESSINSTALLATION)) {
            setAddressInstallation(SaveAddressData.ADDRESSINSTALLATION);
        }

        // เช็คและอัปเดตข้อมูล AddressPayment
        if (JSON.stringify(addressPayment) !== JSON.stringify(SaveAddressData.ADDRESSPAYMENT)) {
            setAddressPayment(SaveAddressData.ADDRESSPAYMENT);
        }

        // เช็คและอัปเดตข้อมูล AddressTax
        if (JSON.stringify(addressTax) !== JSON.stringify(SaveAddressData.ADDRESSTAX)) {
            setAddressTax(SaveAddressData.ADDRESSTAX);
        }
    }, [
        SaveAddressData,
        addressCard,
        setAddressCard,
        addressInstallation,
        setAddressInstallation,
        addressPayment,
        setAddressPayment,
        addressTax,
        setAddressTax,
    ]);

    useEffect(() => {
        setLikeAllAddr(false)
        setInstallLikeCardAddr(false)
        setPaymentLikeCardAddr(false)
        setPaymentLikeInstallAddr(false)
        setBillLikeCardAddr(false)
        setBillLikeInstallAddr(false)
        setBillLikePaymentAddr(false)
    }, []);

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

    // GET Province For Install
    useEffect(() => {
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
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setGetProvinceForPayment(response.data);
            } catch (error) {
                console.error('Error fetching CUSTOMER_TYPE_URL:', error);
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
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setGetProvinceForBilling(response.data);
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

    // POST District For Payment
    useEffect(() => {
        const getData = async () => {
            if (selectedProvinceForPayment) { // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
                try {
                    const response = await axios.post(DISTRICT_URL, { ProvinceCode: selectedProvinceForPayment }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    setGetDistrictForPayment(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
                } catch (error) {
                    console.error('Error fetching DISTRICT_URL:', error);
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
            if (selectedProvinceForBilling) { // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
                try {
                    const response = await axios.post(DISTRICT_URL, { ProvinceCode: selectedProvinceForBilling }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    setGetDistrictForBilling(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
                } catch (error) {
                    console.error('Error fetching DISTRICT_URL:', error);
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
                    const response = await axios.post(SUBDISTRICT_URL, { DistrictCode: selectedDistrict }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    setGetSubDistrict(response.data);
                } catch (error) {
                    console.error('Error fetching SUBDISTRICT_URL:', error);
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

    // POST SubDistrict For Payment
    useEffect(() => {
        const fetchSubDistricts = async () => {
            if (selectedDistrictForPayment) {
                try {
                    const response = await axios.post(SUBDISTRICT_URL, { DistrictCode: selectedDistrictForPayment }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    setGetSubDistrictForPayment(response.data);
                } catch (error) {
                    console.error('Error fetching SUBDISTRICT_URL:', error);
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
                    const response = await axios.post(SUBDISTRICT_URL, { DistrictCode: selectedDistrictForBilling }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    setGetSubDistrictForBilling(response.data);
                } catch (error) {
                    console.error('Error fetching SUBDISTRICT_URL:', error);
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
                    const response = await axios.post(ZIPCODE_URL, { SubDistrictCode: selectedSubDistrict }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    if (response.data.length > 0) {
                        setSelectedZipcode(response.data[0].POSTCODE); // อัปเดตรหัสไปรษณีย์ใน state
                    }
                } catch (error) {
                    console.error('Error fetching ZIPCODE_URL:', error);
                }
            } else {
                setSelectedZipcode(''); // เคลียร์ข้อมูลรหัสไปรษณีย์เมื่อไม่เลือกตำบล
            }
        };
        getZipcode();
    }, [selectedSubDistrict]);

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

    // POST Zipcode For Payment
    useEffect(() => {
        const getZipcode = async () => {
            if (selectedSubDistrictForPayment) {
                try {
                    const response = await axios.post(ZIPCODE_URL, { SubDistrictCode: selectedSubDistrictForPayment }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    if (response.data.length > 0) {
                        setSelectedZipcodeForPayment(response.data[0].POSTCODE); // อัปเดตรหัสไปรษณีย์ใน state
                    }
                } catch (error) {
                    console.error('Error fetching ZIPCODE_URL:', error);
                }
            } else {
                setSelectedZipcodeForPayment(''); // เคลียร์ข้อมูลรหัสไปรษณีย์เมื่อไม่เลือกตำบล
            }
        };
        getZipcode();
    }, [selectedSubDistrictForPayment]);

    // POST Zipcode For Billing tax
    useEffect(() => {
        const getZipcode = async () => {
            if (selectedSubDistrictForBilling) {
                try {
                    const response = await axios.post(ZIPCODE_URL, { SubDistrictCode: selectedSubDistrictForBilling }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    if (response.data.length > 0) {
                        setSelectedZipcodeForBilling(response.data[0].POSTCODE); // อัปเดตรหัสไปรษณีย์ใน state
                    }
                } catch (error) {
                    console.error('Error fetching ZIPCODE_URL:', error);
                }
            } else {
                setSelectedZipcodeForBilling(''); // เคลียร์ข้อมูลรหัสไปรษณีย์เมื่อไม่เลือกตำบล
            }
        };
        getZipcode();
    }, [selectedSubDistrictForBilling]);

    // เช็คว่า User กรอก ที่อยู่ลูกค้า (ออกใบกำกับภาษี) ไหม ถ้ากรอก USETHISTAX เป็น true ไม่กรอกเป็น false
    useEffect(() => {
        // ตรวจสอบว่าข้อมูลทั้งหมดถูกกรอกหรือไม่
        if (
            addressNumberForBilling &&
            selectedProvinceForBilling !== undefined &&
            selectedDistrictForBilling !== undefined &&
            selectedSubDistrictForBilling !== undefined &&
            selectedZipcodeForBilling &&
            addressPhoneForBilling
        ) {
            setUseThisTax("TRUE");  // ถ้าข้อมูลครบให้ตั้งค่าเป็น "TRUE"
        } else {
            setUseThisTax("FALSE"); // ถ้าข้อมูลไม่ครบให้ตั้งค่าเป็น "FALSE"
        }
    }, [
        addressNumberForBilling,
        selectedProvinceForBilling,
        selectedDistrictForBilling,
        selectedSubDistrictForBilling,
        selectedZipcodeForBilling,
        addressPhoneForBilling
    ]);

    // ยิง UPDATECONTACT เมื่อมีการเปลี่ยนค่า value ของทุก Address อัตโนมัติ
    useEffect(() => {
        if (
            // ที่อยู่ลูกค้า ตามบัตร
            addressNumber &&
            selectedProvince !== undefined &&
            selectedDistrict !== undefined &&
            selectedSubDistrict !== undefined &&
            selectedZipcode &&
            addressPhone ||

            // ที่อยู่ลูกค้า ติดตั้ง
            addressNumberForInstall &&
            selectedProvinceForInstall !== undefined &&
            selectedDistrictForInstall !== undefined &&
            selectedSubDistrictForInstall !== undefined &&
            selectedZipcodeForInstall &&
            addressPhoneForInstall ||

            // ที่อยู่ลูกค้า เก็บเงิน
            addressNumberForPayment &&
            selectedProvinceForPayment !== undefined &&
            selectedDistrictForPayment !== undefined &&
            selectedSubDistrictForPayment !== undefined &&
            selectedZipcodeForPayment &&
            addressPhoneForPayment ||

            // ที่อยู่ลูกค้า ออกใบกำกับ
            addressNumberForBilling &&
            selectedProvinceForBilling !== undefined &&
            selectedDistrictForBilling !== undefined &&
            selectedSubDistrictForBilling !== undefined &&
            selectedZipcodeForBilling &&
            addressPhoneForBilling
        ) {
            const updateContactData = async () => {
                try {
                    const response = await axios.post(UPDATECONTACT, {
                        REFNO,
                        EMPID: EmpId,
                        TEAMSALE: TeamSale,
                        SALECODE: SaleCode,
                        SUPEMPID: SupEmpId,
                        SECEMPID: SecEmpId,
                        FIELD: "ADDRESS",
                        DATA: SaveAddressData
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    console.log("updateContract ADDRESS: ", response.data);
                } catch (error) {
                    console.error('Error updating contact:', error);
                }
            };
            updateContactData();
        }
    }, [
        addressNumber, addressSoi, addressRoad, selectedProvince, selectedDistrict, selectedSubDistrict, selectedZipcode, addressPhone, useThisTax,

        addressNumberForInstall, addressSoiForInstall, addressRoadForInstall, selectedProvinceForInstall, selectedDistrictForInstall, selectedSubDistrictForInstall, selectedZipcodeForInstall, addressPhoneForInstall,

        addressNumberForPayment, addressSoiForPayment, addressRoadForPayment, selectedProvinceForPayment, selectedDistrictForPayment, selectedSubDistrictForPayment, selectedZipcodeForPayment, addressPhoneForPayment,

        addressNumberForBilling, addressSoiForBilling, addressRoadForBilling, selectedProvinceForBilling, selectedDistrictForBilling, selectedSubDistrictForBilling, selectedZipcodeForBilling, addressPhoneForBilling,

        SaveAddressData
    ]);

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

    // ที่อยู่ลูกค้า (ตามบัตร)
    const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setSelectedProvince(value);
        // Reset district, subdistrict, and zipcode
        setSelectedDistrict(undefined);
        setSelectedSubDistrict(undefined);
        setSelectedZipcode('');
    };

    const handleDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setSelectedDistrict(value);
        // Reset subdistrict and zipcode
        setSelectedSubDistrict(undefined);
        setSelectedZipcode('');
    };

    const handleSubDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setSelectedSubDistrict(value);
        // Reset zipcode
        setSelectedZipcode('');
    };

    // ที่อยู่ลูกค้า (ติดตั้ง)
    const handleProvinceChangeForInstall = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setSelectedProvinceForInstall(value);
        // Reset district, subdistrict, and zipcode
        setSelectedDistrictForInstall(undefined);
        setSelectedSubDistrictForInstall(undefined);
        setSelectedZipcodeForInstall('');
    };

    const handleDistrictChangeForInstall = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setSelectedDistrictForInstall(value);
        // Reset subdistrict and zipcode
        setSelectedSubDistrictForInstall(undefined);
        setSelectedZipcodeForInstall('');
    };

    const handleSubDistrictChangeForInstall = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setSelectedSubDistrictForInstall(value);
        // Reset zipcode
        setSelectedZipcodeForInstall('');
    };

    // ที่อยู่ลูกค้า (เก็บเงิน)
    const handleProvinceChangeForPayment = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setSelectedProvinceForPayment(value);
        // Reset district, subdistrict, and zipcode
        setSelectedDistrictForPayment(undefined);
        setSelectedSubDistrictForPayment(undefined);
        setSelectedZipcodeForPayment('');
    };

    const handleDistrictChangeForPayment = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setSelectedDistrictForPayment(value);
        // Reset subdistrict and zipcode
        setSelectedSubDistrictForPayment(undefined);
        setSelectedZipcodeForPayment('');
    };

    const handleSubDistrictChangeForPayment = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setSelectedSubDistrictForPayment(value);
        // Reset zipcode
        setSelectedZipcodeForPayment('');
    };

    // จัดการติ้กใน accordion ที่อยู่ลูกค้า (ตามบัตร)
    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;

        if (name === 'allAddress') {
            setLikeAllAddr(checked)

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

        if (name === 'likeAddressCard') {
            setInstallLikeCardAddr(checked)

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

        if (name === 'paymentLikeAddressCard') {
            // setShowPaymentAddress(checked);
            setPaymentLikeCardAddr(checked)
            setPaymentLikeInstallAddr(false)

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

        if (name === 'paymentLikeAddressInstall') {
            // setShowPaymentAddress(checked);
            setPaymentLikeCardAddr(false)
            setPaymentLikeInstallAddr(checked)

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
        }

        if (name === 'showInstallAddress') {
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

        if (name === 'showPaymentAddress') {
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

        if (name === 'billLikeAddressCard') {
            setBillLikeCardAddr(checked)
            setBillLikeInstallAddr(false)
            setBillLikePaymentAddr(false)

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

        if (name === 'billLikeAddressInstall') {
            setBillLikeCardAddr(false)
            setBillLikeInstallAddr(checked)
            setBillLikePaymentAddr(false)

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

        if (name === 'billLikeAddressPayment') {
            setBillLikeCardAddr(false)
            setBillLikeInstallAddr(false)
            setBillLikePaymentAddr(checked)

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

    // ฟังก์ชันเพื่อล้างการติ๊กใน  accordion ที่อยู่ลูกค้า (ตามบัตร) เมื่อมีการเปลี่ยนแปลงข้อมูลใน accordion ที่อยู่ลูกค้า (ติดตั้ง)
    const resetShowInstallAddress = () => {
        setShowInstallAddress(false);
    };

    // ฟังก์ชันเพื่อล้างการติ๊กใน  accordion ที่อยู่ลูกค้า (ตามบัตร) เมื่อมีการเปลี่ยนแปลงข้อมูลใน accordion ที่อยู่ลูกค้า (เก็บเงิน)
    const resetShowPaymentAddress = () => {
        setShowPaymentAddress(false);
    };

    const handleNextClick = async () => {
        try {
            // POST Contract/updateContract
            const updateContract = await axios.post(UPDATECONTACT, {
                REFNO,
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
                <div className='d-flex justify-content-between align-items-center mb-7 mt-7 mt-lg-0'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            ข้อมูลลูกค้า
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <span className="text-muted text-hover-primary">
                                    ระบบขาย
                                </span></li>
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
                                                    <div className="container">
                                                        <div className='row mb-6'>
                                                            <div className='col-lg-6 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>ประเภทลูกค้า</label>
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

                                                            <div className='col-lg-6 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>ประเภทบัตร</label>
                                                                <select
                                                                    className='form-select'
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
                                                    </div>

                                                    <div className="container">
                                                        <div className='row mb-6'>
                                                            <div className='col-lg-4'>
                                                                <label className='form-label required fw-bold fs-6'>บัตรประชาชน</label>
                                                                <input
                                                                    value={idCard}
                                                                    onChange={handleIdCardChange}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                                {/* {errors.idCard && <p className='text-danger'>{errors.idCard.message}</p>} */}
                                                            </div>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>คำนำหน้าชื่อ</label>
                                                                <select
                                                                    className='form-select'
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
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                                {errors.fullName && <p className='text-danger'>{errors.fullName}</p>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="container">
                                                        <div className='row mb-6'>
                                                            <div className="col-lg-4 mb-3">
                                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <label className="form-label required fw-bold fs-6">วันเดือนปีเกิด</label>
                                                                    <DatePicker
                                                                        selected={valueCalendar}
                                                                        onChange={handleDateChange}
                                                                        className="form-control mb-3 mb-lg-0"
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
                                                                    className="form-control mb-3 mb-lg-0"
                                                                    readOnly
                                                                />

                                                            </div>
                                                            {selectedCustomerType !== "1" && (
                                                                <div className='col-lg-4 mb-3'>
                                                                    <label className='form-label required fw-bold fs-6'>เพศ</label>
                                                                    <select
                                                                        className='form-select mb-3 mb-lg-0'
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
                                                        </div>

                                                        <div className="container">
                                                            <div className='row mb-6 mt-6'>
                                                                <div className='col-lg-6 mb-3'>
                                                                    <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                                                    <input
                                                                        value={mobile}
                                                                        onChange={(e) => setMobile(e.target.value)}
                                                                        type='text'
                                                                        className='form-control mb-3 mb-lg-0'
                                                                    />
                                                                    {errors.mobile && <p className='text-danger'>{errors.mobile}</p>}
                                                                </div>
                                                                <div className='col-lg-6 mb-3'>
                                                                    <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                                                    <input
                                                                        value={phone}
                                                                        onChange={(e) => setPhone(e.target.value)}
                                                                        type='text'
                                                                        className='form-control mb-3 mb-lg-0'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="container">
                                                            <div className='row mb-6'>
                                                                <div className='col-lg-6 mb-3'>
                                                                    <label className='form-label fw-bold fs-6'>เบอร์ที่ทำงาน</label>
                                                                    <input
                                                                        value={workPhone}
                                                                        onChange={(e) => setWorkPhone(e.target.value)}
                                                                        type='text'
                                                                        className='form-control mb-3 mb-lg-0'
                                                                    />
                                                                </div>
                                                                <div className='col-lg-6 mb-3'>
                                                                    <label className='form-label fw-bold fs-6'>อีเมล์</label>
                                                                    <input
                                                                        value={email}
                                                                        onChange={(e) => setEmail(e.target.value)}
                                                                        type='text'
                                                                        className='form-control mb-3 mb-lg-0'
                                                                    />
                                                                    {errors.email && <p className='text-danger'>{errors.email}</p>}
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

                                                            <div className='col-lg-6'>
                                                                <label className='form-label required fw-bold fs-6'>ชื่อบริษัท</label>
                                                                <input
                                                                    // value={fields.idCard}
                                                                    // onChange={handleTextChange('idCard')}
                                                                    onChange={(e) => setFullName(e.target.value)}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                                {/* {errors.idCard && <p className='text-danger'>{errors.idCard.message}</p>} */}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="container">
                                                        <div className='row mb-6'>
                                                            <div className='col-lg-4'>
                                                                <label className='form-label required fw-bold fs-6'>เลขประจำตัวผู้เสียภาษี</label>
                                                                <input
                                                                    // value={fields.idCard}
                                                                    // onChange={handleTextChange('idCard')}
                                                                    onChange={handleIdCardChange}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                                {/* {errors.idCard && <p className='text-danger'>{errors.idCard.message}</p>} */}
                                                            </div>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>คำนำหน้า</label>
                                                                <select
                                                                    className='form-select'
                                                                    onChange={(e) => setSelectedPrefixId(Number(e.target.value))}
                                                                    value={selectedPrefixId}
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
                                                                    value={nameMD}
                                                                    onChange={(e) => setNameMD(e.target.value)}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                                {/* {errors.fullname && <p className='text-danger'>{errors.fullname.message}</p>} */}
                                                            </div>
                                                        </div>

                                                        <div className="container">
                                                            <div className='row mb-6 mt-6'>
                                                                <div className='col-lg-6 mb-3'>
                                                                    <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                                                    <input
                                                                        value={mobile}
                                                                        type='text'
                                                                        className='form-control mb-3 mb-lg-0'
                                                                        onChange={(e) => setMobile(e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className='col-lg-6 mb-3'>
                                                                    <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                                                    <input
                                                                        value={phone}
                                                                        type='text'
                                                                        className='form-control mb-3 mb-lg-0'
                                                                        onChange={(e) => setPhone(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="container">
                                                            <div className='row mb-6'>
                                                                <div className='col-lg-6 mb-3'>
                                                                    <label className='form-label fw-bold fs-6'>เบอร์ที่ทำงาน</label>
                                                                    <input
                                                                        value={workPhone}
                                                                        type='text'
                                                                        className='form-control mb-3 mb-lg-0'
                                                                        onChange={(e) => setWorkPhone(e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className='col-lg-6 mb-3'>
                                                                    <label className='form-label fw-bold fs-6'>อีเมล์</label>
                                                                    <input
                                                                        value={email}
                                                                        onChange={(e) => setEmail(e.target.value)}
                                                                        type='text'
                                                                        className='form-control mb-3 mb-lg-0'
                                                                    />
                                                                    {/* {errors.email && <p className='text-danger'>{errors.email.message}</p>} */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {/* End กรณีประเภทลูกค้าเป็น นิติบุคคล */}

                                            {selectedCustomerType == "0" || selectedCustomerType == "2" ? (
                                                <>
                                                    <div className="container">
                                                        <button
                                                            className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'
                                                            type='button'
                                                            onClick={handleNextClick}
                                                            disabled={!selectedCustomerType || !selectedCardType || !idCard ||
                                                                !selectedPrefixId || !fullName || !valueCalendar || !valueAge ||
                                                                !selectedSexId || !mobile} >
                                                            เพิ่มที่อยู่ลูกค้า
                                                        </button>
                                                    </div>
                                                </>
                                            ) : selectedCustomerType == "1" && (
                                                <>
                                                    <div className="container">
                                                        <button
                                                            className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'
                                                            type='button'
                                                            onClick={handleNextClick}
                                                            disabled={!selectedCustomerType || !idCard ||
                                                                !selectedPrefixId || !nameMD || !mobile} >
                                                            เพิ่มที่อยู่นิติบุคคล
                                                        </button>
                                                    </div>
                                                </>
                                            )
                                            }
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

                                                    <div className="container">
                                                        <div className='row mb-6'>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>บ้านเลขที่</label>
                                                                <input
                                                                    value={addressNumber}
                                                                    onChange={(e) => setAddressNumber(e.target.value)}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                            </div>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label fw-bold fs-6'>หมู่ที่</label>
                                                                <input
                                                                    value={addressMoo}
                                                                    onChange={(e) => setAddressMoo(e.target.value)}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                            </div>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label fw-bold fs-6'>ตรอก / ซอย</label>
                                                                <input
                                                                    value={addressSoi}
                                                                    onChange={(e) => setAddressSoi(e.target.value)}
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
                                                                    value={addressRoad}
                                                                    onChange={(e) => setAddressRoad(e.target.value)}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                            </div>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>จังหวัด</label>
                                                                <select
                                                                    className='form-select'
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
                                                                    className='form-select'
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
                                                    </div>

                                                    <div className="container">
                                                        <div className='row mb-6'>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>ตำบล / แขวง</label>
                                                                <select
                                                                    className='form-select'
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
                                                                    className='form-control mb-3 mb-lg-0'
                                                                    value={selectedZipcode}
                                                                    readOnly
                                                                    style={{
                                                                        backgroundColor: '#d7dbde',
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                                                <input
                                                                    value={addressPhone}
                                                                    onChange={(e) => setAddressPhone(e.target.value)}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="container">
                                                        <div className='row mb-6'>
                                                            <div className='col-lg-6 mb-3 mt-xl-5'>
                                                                <label className='form-check form-check-inline form-check-solid me-5'>
                                                                    <input
                                                                        onChange={handleCheckboxChange}
                                                                        className='form-check-input'
                                                                        name='allAddress'
                                                                        type='checkbox'
                                                                        checked={likeAllAddr}
                                                                    />
                                                                    <span className='fw-bold ps-2 fs-6 mb-sm-5'>ใช้ที่อยู่เดียวกันทั้งหมด</span>
                                                                </label>
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
                        )}
                        {/* End accordion ที่อยู่ลูกค้า (ตามบัตร)*/}

                        {/* Start accordion ที่อยู่ลูกค้า (ติดตั้ง) */}
                        {showCustomerAddress && (
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
                                            <form noValidate className='form'>
                                                <div className='card-body px-lg-9 px-1'>

                                                    <div className="container">
                                                        <div className='row mb-6'>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>บ้านเลขที่</label>
                                                                <input
                                                                    value={addressNumberForInstall}
                                                                    onChange={(e) => {
                                                                        setAddressNumberForInstall(e.target.value);
                                                                        resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                                                    }}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                            </div>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label fw-bold fs-6'>หมู่ที่</label>
                                                                <input
                                                                    value={addressMooForInstall}
                                                                    onChange={(e) => {
                                                                        setAddressMooForInstall(e.target.value);
                                                                        resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
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
                                                                        resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
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
                                                                        resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                                                    }}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                            </div>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>จังหวัด</label>
                                                                <select
                                                                    className='form-select'
                                                                    value={selectedProvinceForInstall}
                                                                    onChange={(e) => {
                                                                        setSelectedProvinceForInstall(Number(e.target.value))
                                                                        resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                                                    }}
                                                                >
                                                                    <option value=''>เลือกจังหวัด...</option>
                                                                    {getProvinceForInstall.map((item: any) => (
                                                                        <option key={item.PROVINCECODE} value={item.PROVINCECODE}>
                                                                            {item.PROVINCENAME}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>อำเภอ / เขต</label>
                                                                <select
                                                                    className='form-select'
                                                                    value={selectedDistrictForInstall}
                                                                    onChange={(e) => {
                                                                        setSelectedDistrictForInstall(Number(e.target.value))
                                                                        resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                                                    }}
                                                                >
                                                                    <option value=''>เลือกอำเภอ / เขต...</option>
                                                                    {getDistrictForInstall.map((item: any) => (
                                                                        <option key={item.DISTRICTCODE} value={item.DISTRICTCODE}>
                                                                            {item.DISTRICTNAME}
                                                                        </option>
                                                                    ))}
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
                                                                    value={selectedSubDistrictForInstall}
                                                                    onChange={(e) => {
                                                                        setSelectedSubDistrictForInstall(Number(e.target.value))
                                                                        resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                                                    }}
                                                                >
                                                                    <option value=''>เลือกตำบล / แขวง...</option>
                                                                    {getSubDistrictForInstall.map((item: any) => (
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
                                                                <input
                                                                    value={addressPhoneForInstall}
                                                                    onChange={(e) => {
                                                                        setAddressPhoneForInstall(e.target.value)
                                                                        resetShowInstallAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                                                    }}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="container">
                                                        <div className='row mb-6'>
                                                            <div className='col-lg-6 mb-3 mt-xl-5'>
                                                                <label className='form-check form-check-inline form-check-solid me-5'>
                                                                    <input
                                                                        onChange={handleCheckboxChange}
                                                                        className='form-check-input'
                                                                        name='likeAddressCard'
                                                                        type='checkbox'
                                                                    // checked={installLikeCardAddr}
                                                                    />
                                                                    <span className='fw-bold ps-2 fs-6 mb-sm-5'>ใช้ที่อยู่เดียวกับที่อยู่ตามบัตรฯ</span>
                                                                </label>
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
                        )}
                        {/* End accordion ที่อยู่ลูกค้า (ติดตั้ง) */}

                        {/* Start accordion ที่อยู่ลูกค้า (เก็บเงิน)*/}
                        {showCustomerAddress && (
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

                                                    <div className="container">
                                                        <div className='row mb-6'>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>บ้านเลขที่</label>
                                                                <input
                                                                    value={addressNumberForPayment}
                                                                    onChange={(e) => {
                                                                        setAddressNumberForPayment(e.target.value)
                                                                        resetShowPaymentAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                                                    }}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                            </div>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label fw-bold fs-6'>หมู่ที่</label>
                                                                <input
                                                                    value={addressMooForPayment}
                                                                    onChange={(e) => {
                                                                        setAddressMooForPayment(e.target.value)
                                                                        resetShowPaymentAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                                                    }}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                            </div>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label fw-bold fs-6'>ตรอก / ซอย</label>
                                                                <input
                                                                    value={addressSoiForPayment}
                                                                    onChange={(e) => {
                                                                        setAddressSoiForPayment(e.target.value)
                                                                        resetShowPaymentAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                                                    }}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0' />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="container">
                                                        <div className='row mb-6'>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label fw-bold fs-6'>ถนน</label>
                                                                <input
                                                                    value={addressRoadForPayment}
                                                                    onChange={(e) => {
                                                                        setAddressRoadForPayment(e.target.value)
                                                                        resetShowPaymentAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                                                    }}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                            </div>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>จังหวัด</label>
                                                                <select
                                                                    className='form-select'
                                                                    value={selectedProvinceForPayment}
                                                                    onChange={(e) => {
                                                                        setSelectedProvinceForPayment(Number(e.target.value))
                                                                        resetShowPaymentAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                                                    }}
                                                                >
                                                                    <option value=''>เลือกจังหวัด...</option>
                                                                    {getProvinceForPayment.map((item: any) => (
                                                                        <option key={item.PROVINCECODE} value={item.PROVINCECODE}>
                                                                            {item.PROVINCENAME}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>อำเภอ / เขต</label>
                                                                <select
                                                                    className='form-select'
                                                                    value={selectedDistrictForPayment}
                                                                    onChange={(e) => {
                                                                        setSelectedDistrictForPayment(Number(e.target.value))
                                                                        resetShowPaymentAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                                                    }}
                                                                >
                                                                    <option value=''>เลือกอำเภอ / เขต...</option>
                                                                    {Array.isArray(getDistrictForPayment) && getDistrictForPayment.map((item: any) => (
                                                                        <option key={item.DISTRICTCODE} value={item.DISTRICTCODE}>
                                                                            {item.DISTRICTNAME}
                                                                        </option>
                                                                    ))}
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
                                                                    value={selectedSubDistrictForPayment}
                                                                    onChange={(e) => {
                                                                        setSelectedSubDistrictForPayment(Number(e.target.value))
                                                                        resetShowPaymentAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                                                    }}
                                                                >
                                                                    <option value=''>เลือกตำบล / แขวง...</option>
                                                                    {Array.isArray(getSubDistrictForPayment) && getSubDistrictForPayment.map((item: any) => (
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
                                                                    className='form-control mb-3 mb-lg-0'
                                                                    value={selectedZipcodeForPayment}
                                                                    readOnly
                                                                    style={{
                                                                        backgroundColor: '#d7dbde',
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                                                <input
                                                                    value={addressPhoneForPayment}
                                                                    onChange={(e) => {
                                                                        setAddressPhoneForPayment(e.target.value)
                                                                        resetShowPaymentAddress(); // รีเซ็ตค่าการติ้กเมื่อฟิลด์มีการเปลี่ยนแปลง
                                                                    }}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="container">
                                                        <div className='row mb-6'>
                                                            <div className='col-lg-6 mb-3 mt-xl-5'>
                                                                <label className='form-check form-check-inline form-check-solid me-5'>
                                                                    <input
                                                                        onChange={handleCheckboxChange}
                                                                        className='form-check-input'
                                                                        name='paymentLikeAddressCard'
                                                                        type='checkbox'
                                                                        checked={paymentLikeCardAddr}
                                                                    />
                                                                    <span className='fw-bold ps-2 fs-6 mb-sm-5'>ใช้ที่อยู่เดียวกับที่อยู่ตามบัตรฯ</span>
                                                                </label>
                                                                <label className='form-check form-check-inline form-check-solid me-5 mt-3 mt-sm-0'>
                                                                    <input
                                                                        onChange={handleCheckboxChange}
                                                                        className='form-check-input'
                                                                        name='paymentLikeAddressInstall'
                                                                        type='checkbox'
                                                                        checked={paymentLikeInstallAddr}
                                                                    />
                                                                    <span className='fw-bold ps-2 fs-6'>ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง</span>
                                                                </label>
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
                        )}
                        {/* End accordion ที่อยู่ลูกค้า (เก็บเงิน)*/}

                        {/* Start accordion ที่อยู่ลูกค้า (ใบกำกับภาษี)*/}
                        {showCustomerAddress && (
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

                                                    <div className="container">
                                                        <div className='row mb-6'>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>บ้านเลขที่</label>
                                                                <input
                                                                    value={addressNumberForBilling}
                                                                    onChange={(e) => setAddressNumberForBilling(e.target.value)}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                            </div>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label fw-bold fs-6'>หมู่ที่</label>
                                                                <input
                                                                    value={addressMooForBilling}
                                                                    onChange={(e) => setAddressMooForBilling(e.target.value)}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                            </div>
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label fw-bold fs-6'>ตรอก / ซอย</label>
                                                                <input
                                                                    value={addressSoiForBilling}
                                                                    onChange={(e) => setAddressSoiForBilling(e.target.value)}
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
                                                                    value={addressRoadForBilling}
                                                                    onChange={(e) => setAddressRoadForBilling(e.target.value)}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                            </div>

                                                            {/* จังหวัด */}
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>จังหวัด</label>
                                                                <select
                                                                    className='form-select'
                                                                    value={
                                                                        billLikeCardAddr ? selectedProvince :
                                                                            billLikeInstallAddr ? selectedProvinceForInstall :
                                                                                billLikePaymentAddr ? selectedProvinceForPayment :
                                                                                    selectedProvinceForBilling
                                                                    }
                                                                    onChange={(e) => {
                                                                        const selectedValue = Number(e.target.value);
                                                                        if (billLikeCardAddr) {
                                                                            setSelectedProvince(selectedValue);
                                                                        } else if (billLikeInstallAddr) {
                                                                            setSelectedProvinceForInstall(selectedValue);
                                                                        } else if (billLikePaymentAddr) {
                                                                            setSelectedProvinceForPayment(selectedValue);
                                                                        } else {
                                                                            setSelectedProvinceForBilling(selectedValue);
                                                                        }
                                                                    }}
                                                                >
                                                                    <option value=''>เลือกจังหวัด...</option>
                                                                    {(billLikeCardAddr ? getProvince :
                                                                        billLikeInstallAddr ? getProvinceForInstall :
                                                                            billLikePaymentAddr ? getProvinceForPayment :
                                                                                getProvinceForBilling).map((item) => (
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
                                                                    value={
                                                                        billLikeCardAddr ? selectedDistrict :
                                                                            billLikeInstallAddr ? selectedDistrictForInstall :
                                                                                billLikePaymentAddr ? selectedDistrictForPayment :
                                                                                    selectedDistrictForBilling
                                                                    }
                                                                    onChange={(e) => {
                                                                        const selectedValue = Number(e.target.value);
                                                                        if (billLikeCardAddr) {
                                                                            setSelectedDistrict(selectedValue);
                                                                        } else if (billLikeInstallAddr) {
                                                                            setSelectedDistrictForInstall(selectedValue);
                                                                        } else if (billLikePaymentAddr) {
                                                                            setSelectedDistrictForPayment(selectedValue);
                                                                        } else {
                                                                            setSelectedDistrictForBilling(selectedValue);
                                                                        }
                                                                    }}
                                                                >
                                                                    <option value=''>เลือกอำเภอ / เขต...</option>
                                                                    {(billLikeCardAddr ? getDistrict :
                                                                        billLikeInstallAddr ? getDistrictForInstall :
                                                                            billLikePaymentAddr ? getDistrictForPayment :
                                                                                getDistrictForBilling).map((item) => (
                                                                                    <option key={item.DISTRICTCODE} value={item.DISTRICTCODE}>
                                                                                        {item.DISTRICTNAME}
                                                                                    </option>
                                                                                ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="container">
                                                        <div className='row mb-6'>
                                                            {/* ตำบล / แขวง */}
                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>ตำบล / แขวง</label>
                                                                <select
                                                                    className='form-select'
                                                                    value={
                                                                        billLikeCardAddr ? selectedSubDistrict :
                                                                            billLikeInstallAddr ? selectedSubDistrictForInstall :
                                                                                billLikePaymentAddr ? selectedSubDistrictForPayment :
                                                                                    selectedSubDistrictForBilling
                                                                    }
                                                                    onChange={(e) => {
                                                                        const selectedValue = Number(e.target.value);
                                                                        if (billLikeCardAddr) {
                                                                            setSelectedSubDistrict(selectedValue);
                                                                        } else if (billLikeInstallAddr) {
                                                                            setSelectedSubDistrictForInstall(selectedValue);
                                                                        } else if (billLikePaymentAddr) {
                                                                            setSelectedSubDistrictForPayment(selectedValue);
                                                                        } else {
                                                                            setSelectedSubDistrictForBilling(selectedValue);
                                                                        }
                                                                    }}
                                                                >
                                                                    <option value=''>เลือกตำบล / แขวง...</option>
                                                                    {(billLikeCardAddr ? getSubDistrict :
                                                                        billLikeInstallAddr ? getSubDistrictForInstall :
                                                                            billLikePaymentAddr ? getSubDistrictForPayment :
                                                                                getSubDistrictForBilling).map((item) => (
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
                                                                    value={
                                                                        billLikeCardAddr ? selectedZipcode :
                                                                            billLikeInstallAddr ? selectedZipcodeForInstall :
                                                                                billLikePaymentAddr ? selectedZipcodeForPayment :
                                                                                    selectedZipcodeForBilling
                                                                    }
                                                                    readOnly
                                                                    style={{
                                                                        backgroundColor: '#d7dbde',
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className='col-lg-4 mb-3'>
                                                                <label className='form-label required fw-bold fs-6'>เบอร์ที่ติดต่อได้</label>
                                                                <input
                                                                    value={addressPhoneForBilling}
                                                                    onChange={(e) => {
                                                                        setAddressPhoneForBilling(e.target.value)
                                                                    }}
                                                                    type='text'
                                                                    className='form-control mb-3 mb-lg-0'
                                                                />
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div className="container">
                                                        <div className='row mb-6'>
                                                            <div className='col-lg-6 mb-3 mt-xl-5'>
                                                                <label className='form-check form-check-inline form-check-solid me-5'>
                                                                    <input
                                                                        onChange={handleCheckboxChange}
                                                                        className='form-check-input'
                                                                        name='billLikeAddressCard'
                                                                        type='checkbox'
                                                                        checked={billLikeCardAddr}
                                                                    />
                                                                    <span className='fw-bold ps-2 fs-6 mb-sm-5'>ใช้ที่อยู่เดียวกับที่อยู่ตามบัตรฯ</span>
                                                                </label>
                                                                <label className='form-check form-check-inline form-check-solid me-5 mt-3 mt-sm-0'>
                                                                    <input
                                                                        onChange={handleCheckboxChange}
                                                                        className='form-check-input'
                                                                        name='billLikeAddressInstall'
                                                                        type='checkbox'
                                                                        checked={billLikeInstallAddr}
                                                                    />
                                                                    <span className='fw-bold ps-2 fs-6'>ใช้ที่อยู่เดียวกับที่อยู่ติดตั้ง</span>
                                                                </label>
                                                                <label className='form-check form-check-inline form-check-solid me-5 mt-3 mt-sm-0'>
                                                                    <input
                                                                        onChange={handleCheckboxChange}
                                                                        className='form-check-input'
                                                                        name='billLikeAddressPayment'
                                                                        type='checkbox'
                                                                        checked={billLikePaymentAddr}
                                                                    />
                                                                    <span className='fw-bold ps-2 fs-6'>ใช้ที่อยู่เดียวกับที่อยู่เก็บเงิน</span>
                                                                </label>
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
                        )}
                        {/* End accordion ที่อยู่ลูกค้า (ใบกำกับภาษี)*/}
                    </div>
                    {/* End Card */}

                    {showCustomerAddress && (
                        <>
                            <div className='d-none d-md-flex justify-content-between align-items-center mt-5'>
                                <button onClick={() => navigate('/sale/discount')} className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                                    ย้อนกลับ
                                </button>
                                <button onClick={() => navigate('/sale/pdpa')} className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                                    บันทึก
                                </button>
                            </div>

                            {/* ปุ่มในหน้าจอเล็ก */}
                            <div
                                className="d-flex d-md-none justify-content-between align-items-center bg-light p-3 border-top"
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
                                    onClick={() => navigate('/sale/discount')}
                                >
                                    ย้อนกลับ
                                </button>
                                <button
                                    className={`btn btn-primary w-auto`}
                                    onClick={() => navigate('/sale/pdpa')}
                                >
                                    บันทึก
                                </button>
                            </div>
                        </>
                    )}

                </form>
            </Content >
        </>
    )
}

export default SalesCreateCust