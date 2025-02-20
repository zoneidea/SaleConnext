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

const UpdateSaleAddress: React.FC = () => {
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal);

    const location = useLocation();
    const item = location.state as ItemProps || [];
    // console.log(`item`, item);

    const refno = item?.REFNO
    const custAddr = item?.ADDRESS
    // console.log(`custAddr`, custAddr);

    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

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
    const GET_IMAGES_API = `${API_URL_MONGO}/Contract/GetContractImage`;

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

    const [images, setImages] = useState<ImagesType | null>(null);

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
        setAddressNumber(custAddr?.[0]?.ADDRESSCARD.ADDRESSNUMBER)
        setAddressMoo(custAddr?.[0]?.ADDRESSCARD.ADDRESSMOO)
        setAddressSoi(custAddr?.[0]?.ADDRESSCARD.ADDRESSSOI)
        setAddressRoad(custAddr?.[0]?.ADDRESSCARD.ADDRESSROAD)
        setSelectedProvince(custAddr?.[0]?.ADDRESSCARD.ADDRESSPROVINCE)
        setSelectedDistrict(custAddr?.[0]?.ADDRESSCARD.ADDRESSDISTRICT)
        setSelectedSubDistrict(custAddr?.[0]?.ADDRESSCARD.ADDRESSSUBDISTRICT)
        setSelectedZipcode(custAddr?.[0]?.ADDRESSCARD.ADDRESSZIPCODE)
        setAddressPhone(custAddr?.[0]?.ADDRESSCARD.ADDRESSPHONE)

        setAddressNumberForInstall(custAddr?.[0]?.ADDRESSINSTALLATION.ADDRESSNUMBER)
        setAddressMooForInstall(custAddr?.[0]?.ADDRESSINSTALLATION.ADDRESSMOO)
        setAddressSoiForInstall(custAddr?.[0]?.ADDRESSINSTALLATION.ADDRESSSOI)
        setAddressRoadForInstall(custAddr?.[0]?.ADDRESSINSTALLATION.ADDRESSROAD)
        setSelectedProvinceForInstall(custAddr?.[0]?.ADDRESSINSTALLATION.ADDRESSPROVINCE)
        setSelectedDistrictForInstall(custAddr?.[0]?.ADDRESSINSTALLATION.ADDRESSDISTRICT)
        setSelectedSubDistrictForInstall(custAddr?.[0]?.ADDRESSINSTALLATION.ADDRESSSUBDISTRICT)
        setSelectedZipcodeForInstall(custAddr?.[0]?.ADDRESSINSTALLATION.ADDRESSZIPCODE)
        setAddressPhoneForInstall(custAddr?.[0]?.ADDRESSINSTALLATION.ADDRESSPHONE)

        setAddressNumberForPayment(custAddr?.[0]?.ADDRESSPAYMENT.ADDRESSNUMBER)
        setAddressMooForPayment(custAddr?.[0]?.ADDRESSPAYMENT.ADDRESSMOO)
        setAddressSoiForPayment(custAddr?.[0]?.ADDRESSPAYMENT.ADDRESSSOI)
        setAddressRoadForPayment(custAddr?.[0]?.ADDRESSPAYMENT.ADDRESSROAD)
        setSelectedProvinceForPayment(custAddr?.[0]?.ADDRESSPAYMENT.ADDRESSPROVINCE)
        setSelectedDistrictForPayment(custAddr?.[0]?.ADDRESSPAYMENT.ADDRESSDISTRICT)
        setSelectedSubDistrictForPayment(custAddr?.[0]?.ADDRESSPAYMENT.ADDRESSSUBDISTRICT)
        setSelectedZipcodeForPayment(custAddr?.[0]?.ADDRESSPAYMENT.ADDRESSZIPCODE)
        setAddressPhoneForPayment(custAddr?.[0]?.ADDRESSPAYMENT.ADDRESSPHONE)

        setAddressNumberForBilling(custAddr?.[0]?.ADDRESSTAX.ADDRESSNUMBER)
        setAddressMooForBilling(custAddr?.[0]?.ADDRESSTAX.ADDRESSMOO)
        setAddressSoiForBilling(custAddr?.[0]?.ADDRESSTAX.ADDRESSSOI)
        setAddressRoadForBilling(custAddr?.[0]?.ADDRESSTAX.ADDRESSROAD)
        setSelectedProvinceForBilling(custAddr?.[0]?.ADDRESSTAX.ADDRESSPROVINCE)
        setSelectedDistrictForBilling(custAddr?.[0]?.ADDRESSTAX.ADDRESSDISTRICT)
        setSelectedSubDistrictForBilling(custAddr?.[0]?.ADDRESSTAX.ADDRESSSUBDISTRICT)
        setSelectedZipcodeForBilling(custAddr?.[0]?.ADDRESSTAX.ADDRESSZIPCODE)
        setAddressPhoneForBilling(custAddr?.[0]?.ADDRESSTAX.ADDRESSPHONE)

        setLikeAllAddr(false)
        setInstallLikeCardAddr(false)
        setPaymentLikeCardAddr(false)
        setPaymentLikeInstallAddr(false)
        setBillLikeCardAddr(false)
        setBillLikeInstallAddr(false)
        setBillLikePaymentAddr(false)
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

    // ยิง UPDATECONTACT เมื่อมีการเปลี่ยนค่า value ของทุก Address อัตโนมัติ
    // useEffect(() => {
    //     if (
    //         // ที่อยู่ลูกค้า ตามบัตร
    //         addressNumber &&
    //         selectedProvince !== undefined &&
    //         selectedDistrict !== undefined &&
    //         selectedSubDistrict !== undefined &&
    //         selectedZipcode &&
    //         addressPhone ||

    //         // ที่อยู่ลูกค้า ติดตั้ง
    //         addressNumberForInstall &&
    //         selectedProvinceForInstall !== undefined &&
    //         selectedDistrictForInstall !== undefined &&
    //         selectedSubDistrictForInstall !== undefined &&
    //         selectedZipcodeForInstall &&
    //         addressPhoneForInstall ||

    //         // ที่อยู่ลูกค้า เก็บเงิน
    //         addressNumberForPayment &&
    //         selectedProvinceForPayment !== undefined &&
    //         selectedDistrictForPayment !== undefined &&
    //         selectedSubDistrictForPayment !== undefined &&
    //         selectedZipcodeForPayment &&
    //         addressPhoneForPayment ||

    //         // ที่อยู่ลูกค้า ออกใบกำกับ
    //         addressNumberForBilling &&
    //         selectedProvinceForBilling !== undefined &&
    //         selectedDistrictForBilling !== undefined &&
    //         selectedSubDistrictForBilling !== undefined &&
    //         selectedZipcodeForBilling &&
    //         addressPhoneForBilling
    //     ) {
    //         const updateContactData = async () => {
    //             try {
    //                 const response = await axios.post(UPDATECONTACT, {
    //                     REFNO: refno,
    //                     EMPID: EmpId,
    //                     TEAMSALE: TeamSale,
    //                     SALECODE: SaleCode,
    //                     SUPEMPID: SupEmpId,
    //                     SECEMPID: SecEmpId,
    //                     FIELD: "ADDRESS",
    //                     DATA: SaveAddressData
    //                 }, {
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                 });
    //                 console.log("updateContract ADDRESS: ", response.data);
    //             } catch (error) {
    //                 console.error('Error updating contact:', error);
    //             }
    //         };
    //         updateContactData();
    //     }
    // }, [
    //     addressNumber, addressSoi, addressRoad, selectedProvince, selectedDistrict, selectedSubDistrict, selectedZipcode, addressPhone, useThisTax,

    //     addressNumberForInstall, addressSoiForInstall, addressRoadForInstall, selectedProvinceForInstall, selectedDistrictForInstall, selectedSubDistrictForInstall, selectedZipcodeForInstall, addressPhoneForInstall,

    //     addressNumberForPayment, addressSoiForPayment, addressRoadForPayment, selectedProvinceForPayment, selectedDistrictForPayment, selectedSubDistrictForPayment, selectedZipcodeForPayment, addressPhoneForPayment,

    //     addressNumberForBilling, addressSoiForBilling, addressRoadForBilling, selectedProvinceForBilling, selectedDistrictForBilling, selectedSubDistrictForBilling, selectedZipcodeForBilling, addressPhoneForBilling,

    //     SaveAddressData
    // ]);

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
                REFNO: refno,
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
            // console.log(`updateContract CUSTOMERDETAIL: `, updateContract.data);
            if (updateContract.status === 200) {
                if (!updateContract.data.data) {
                    MySwal.fire('เกิดข้อผิดพลาด', 'ปรับปรุงข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา', 'error');
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'สำเร็จ!',
                        text: 'ปรับปรุงข้อมูลที่อยู่แล้ว',
                        timer: 2000, // แสดงผล 3 วินาที
                        showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
                    })
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

    // ใช้ validate ห้ามฟีลด์ว่าง
    const isAddressCardValid =
        addressNumber !== '' &&
        selectedProvince !== undefined &&
        selectedDistrict !== undefined &&
        selectedSubDistrict !== undefined &&
        addressPhone !== '';

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
                <p>REFNO: {refno}</p>

                {/* Card Body */}
                {/* <form onSubmit={handleSubmit}> */}
                <div className='accordion mb-10' id='kt_accordion_1'>

                    {/* Start accordion ที่อยู่ลูกค้า (ตามบัตร)*/}
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
                                                            value={selectedProvince}
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
                                                            value={selectedDistrict}
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
                                                            value={selectedSubDistrict}
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
                    {/* End accordion ที่อยู่ลูกค้า (ตามบัตร)*/}

                    {/* Start accordion ที่อยู่ลูกค้า (ติดตั้ง) */}
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
                                data-bs-parent='#kt_accordion_3' >
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
                                                                checked={installLikeCardAddr}
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
                    {/* End accordion ที่อยู่ลูกค้า (ติดตั้ง) */}

                    {/* Start accordion ที่อยู่ลูกค้า (เก็บเงิน)*/}
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
                    {/* End accordion ที่อยู่ลูกค้า (เก็บเงิน)*/}

                    {/* Start accordion ที่อยู่ลูกค้า (ใบกำกับภาษี)*/}
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
                    {/* End accordion ที่อยู่ลูกค้า (ใบกำกับภาษี)*/}
                </div>
                {/* End Card */}
                <div className='d-none d-xl-flex justify-content-between align-items-center my-5'>
                    <button
                        className='btn btn-secondary w-100 w-md-auto align-self-center h-50px'
                        onClick={() => navigate('/sale/step', { state: item })}>
                        ย้อนกลับ
                    </button>
                    <button
                        className='btn btn-warning w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px'
                        onClick={handleNextClick}
                        disabled={!isAddressCardValid}  // ปุ่มอัพเดทจะถูก disabled หากข้อมูลที่อยู่ (ตามบัตร) ไม่ครบ
                    >
                        อัพเดทข้อมูล
                    </button>
                    <button
                        className={`btn btn-primary w-100 w-md-auto align-self-center h-50px ${!isDataComplete ? `disabled` : ``}`}
                        disabled={!isDataComplete}
                        onClick={handleCheckerClick}
                    >
                        ส่งตรวจสอบ
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
                        className="btn btn-secondary w-auto me-2"
                        onClick={() => navigate('/sale/step', { state: item })}
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        className="btn btn-warning w-auto me-2"
                        onClick={handleNextClick}
                        disabled={!isAddressCardValid}  // ปุ่มอัพเดทจะถูก disabled หากข้อมูลที่อยู่ (ตามบัตร) ไม่ครบ
                    >
                        อัพเดทข้อมูล
                    </button>
                    <button
                        className={`btn btn-primary w-auto ${!isDataComplete ? `disabled` : ``}`}
                        disabled={!isDataComplete}
                        onClick={handleCheckerClick}
                    >
                        ส่งตรวจสอบ
                    </button>
                </div>

                {/* </form> */}
            </Content >
        </>
    )
}

export default UpdateSaleAddress