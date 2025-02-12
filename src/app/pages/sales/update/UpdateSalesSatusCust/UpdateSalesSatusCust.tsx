import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { KTIcon } from '../../../../../_metronic/helpers'
import { Content } from '../../../../../_metronic/layout/components/content'
import { UpdateCardStatusCustomer } from './UpdateCardStatusCustomer'
import { useUUIDStore, useSaveProductStore } from '../../../../modules/stores/stepsStore';
import { useAuth } from '../../../../modules/auth/core/Auth';
import axios from 'axios';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ThreeDot } from 'react-loading-indicators';

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

interface ProvinceItem {
  PROVINCENAME: string;
  PROVINCECODE: string;
}

interface DistrictItem {
  DISTRICTNAME: string;
  DISTRICTCODE: string;
}

interface SubDistrictItem {
  SUBDISTRICTNAME: string;
  SUBDISTRICTCODE: string;
}


const UpdateSalesSatusCust: React.FC = () => {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [showModal, setShowModal] = useState(false); // เริ่มต้นโมดาลปิดอยู่
  const { REFNO } = useUUIDStore();
  const { auth } = useAuth();
  // console.log(`auth`, auth);

  const location = useLocation();
  const item = location.state as ItemProps || [];
  const refno = item?.REFNO

  const EmpId = auth?.data?.[0]?.EmpId || '';
  const TeamSale = auth?.data?.[0]?.TeamSale || '';
  const SaleCode = auth?.data?.[0]?.SaleCode || '';
  const SupEmpId = auth?.data?.[0]?.SupEmp || '';
  const SecEmpId = auth?.data?.[0]?.SecEmp || '';

  const API_THIENSURAT = import.meta.env.VITE_APP_API_THIENSURAT;
  const CHECK_CUST_NEW_URL = `${API_THIENSURAT}/CheckCustomer/Check_New`;
  const CHECK_OTP = `${API_THIENSURAT}/CheckCustomer/Check_otp`

  const API_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const GET_CONTRACT = `${API_MONGO}/Contract/GetContractSummary?refno=${REFNO}`;
  const UPDATECONTACT = `${API_MONGO}/Contract/updateContract`;
  const GET_IMAGES_API = `${API_MONGO}/Contract/GetContractImage`;

  const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
  const PROVINCE_URL = `${API_SALECONNEXT}/GetAddress/Province`;
  const DISTRICT_URL = `${API_SALECONNEXT}/GetAddress/District`;
  const SUBDISTRICT_URL = `${API_SALECONNEXT}/GetAddress/SubDistrict`;

  const [getContract, setGetContract] = useState<any[]>([]);
  // console.log(`getContract`, getContract);

  const ItemCode = getContract[0]?.PRODUCT[0]?.ItemCode
  const Model = getContract[0]?.PRODUCT[0]?.Package[0]?.MODEL
  const [idCard, setIdCard] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [customerStatus, setCustomerStatus] = useState<any>(null);
  // console.log(`customerStatus`, customerStatus);

  const [getProvince, setGetProvince] = useState<any[]>([]);
  // console.log(`getProvince`, getProvince);
  const [getDistrict, setGetDistrict] = useState<any[]>([]);
  const [getSubDistrict, setGetSubDistrict] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number>();
  const [selectedDistrict, setSelectedDistrict] = useState<number>();
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<number>();

  const [statusCustomerContract, setStatusCustomerContract] = useState<any>(null);

  // เช็คว่า user กดปุ่มค้นหาแล้วรึยัง
  const [isSearchDone, setIsSearchDone] = useState(false);

  // ถ้ามีการ์ด ให้คลิกการ์ดก่อน ปุ่มถัดไปจึงจะทำงานได้
  const [hasClickedCard, setHasClickedCard] = useState(false);
  // ตัวแปรคำนวณสำหรับ disable ปุ่ม “ถัดไป”
  const isNextDisabled = !isSearchDone || (customerStatus?.length > 0 && !hasClickedCard);

  const [images, setImages] = useState<ImagesType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const searchData = {
    RefNo: REFNO,
    Search: idCard,
    EmpId,
    ItemCode: ItemCode,
    Model: Model,
  }

  useEffect(() => {
    if (statusCustomerContract && statusCustomerContract.statustext && statusCustomerContract.date?.OTP) {
      saveCustomerStatus();  // เรียกฟังก์ชันบันทึกข้อมูลเมื่อ statusCustomerContract ถูกอัปเดตเสร็จ
    }
  }, [statusCustomerContract]);

  useEffect(() => {
    const getContract = async () => {
      try {
        const response = await axios.get(GET_CONTRACT, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'multipart/form-data',
          },
        });
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        setGetContract(data);
      } catch (error) {
        console.error('Error fetching EMP_IN_TEAM_URL:', error);
      }
    };
    getContract();
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

  // POST Check_otp
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.post(CHECK_OTP, {
          EmpId: EmpId,
          RefNo: REFNO,
          Otp: 446981
        }, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      } catch (error) {
        console.error('Error fetching :', error);
      }
    };
    getData();
  }, []);

  // fetch collection ContractImage
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(GET_IMAGES_API, {
          params: { REFNO: item?.REFNO },
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

  const handleConfirmClick = () => {
    // ซ่อนโมดาล
    setShowModal(false);

    // หน่วงเวลา 1 วินาทีก่อนนำทาง
    setTimeout(() => {
      navigate('/sale/discount');
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // จำกัดให้กรอกเฉพาะตัวเลข และไม่เกิน 13 หลัก
    if (/^\d{0,13}$/.test(value)) {
      setIdCard(value);
      setError(''); // ล้าง error เมื่อกรอกถูกต้อง
    }
  };

  const checkCustomer = async () => {
    if (idCard.length !== 13) {
      setError('กรุณากรอกเลขบัตรประชาชน 13 หลัก');
      return;
    }

    try {
      setIsLoading(true); // เริ่มแสดง loading

      // หน่วงเวลา 2 วินาทีก่อนเรียก API
      setTimeout(async () => {
        const response = await axios.post(CHECK_CUST_NEW_URL, searchData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'multipart/form-data',
          }
        });

        const data = Array.isArray(response.data.data) ? response.data.data : [];
        // console.log(`response`, response);

        setIsLoading(false); // หยุดแสดง loading หลังจากได้ผลลัพธ์

        if (data.length === 0) {
          Swal.fire({
            icon: 'success',
            title: 'ไม่พบประวัติลูกค้า',
          });
        }

        setCustomerStatus(data);
        setIsSearchDone(true);
      }, 2000);  // หน่วงเวลา 2 วินาที

    } catch (error) {
      setIsLoading(false); // หยุดแสดง loading ในกรณีเกิดข้อผิดพลาด
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
      });
    }
  };

  const handleCheckStatusCustomer = () => {
    if (!customerStatus) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'กรุณาตรวจสอบสถานะลูกค้าก่อน',
      });
      return;
    }

    // กำหนด state เมื่อผู้ใช้คลิก CardStatusCustomer (เฉพาะเมื่อมีข้อมูลอยู่)
    if (customerStatus.length > 0) {
      setHasClickedCard(true);
    }

    const statusSale = customerStatus?.[0]?.StatusSale;
    console.log(`statusSale`, statusSale);

    if (statusSale === "0") {
      // กรณีไม่ผ่านการตรวจสอบ
      Swal.fire({
        icon: 'error',
        title: 'ไม่ผ่านการตรวจสอบ',
        text: 'ลูกค้าไม่ผ่านเงื่อนไขในการดำเนินการต่อ',
      });
      navigate('/sale/overview');
    } else if (statusSale === "1") {
      // กรณีผ่านการตรวจสอบ
      // navigate('/sale/discount');
    } else if (statusSale === "2") {
      // ℹ️ กรณีต้องแสดงเนื้อหาในหน้าต่างใหม่
      const refNo = REFNO;
      const bookingNo = REFNO;
      const createBy = auth?.data?.[0]?.EmpId || '';
      const saleEmployeeCode = auth?.data?.[0]?.EmpId || '';
      const saleCode = auth?.data?.[0]?.saleCode || '';
      const teamName = auth?.data?.[0]?.TeamSale || '';
      const processType = auth?.data?.[0]?.DepartGroup || '';
      const customerType = customerStatus?.[0]?.CustomerType;

      const fullName = customerStatus?.[0]?.CustomerName || '';
      const firstName = fullName.split(' ')[0];
      const lastName = fullName.split(' ')[1];
      const fName = encodeURIComponent(firstName);
      const lName = encodeURIComponent(lastName);

      const idCard = customerStatus?.[0]?.Contract.IDCard || '';
      const birthDay = customerStatus?.[0]?.Contract.Brithday || '';

      const addressDetails = customerStatus?.[0]?.Contract.Address[0] || {};
      const fullAddress = [
        addressDetails.AddressDetail || '',
        addressDetails.AddressDetail2 || '',
        addressDetails.AddressDetail3 || '',
        addressDetails.AddressDetail4 || ''
      ].filter(detail => detail.trim() !== '').join(' ');
      const address = encodeURIComponent(fullAddress);

      const province = customerStatus?.[0]?.Contract?.Address?.[0]?.Province || '';
      const provinceCode = getProvince.find(item => item.PROVINCENAME === province)?.PROVINCECODE || '';

      const districtRaw = customerStatus?.[0]?.Contract?.Address?.[0]?.Amphur || '';
      const district = districtRaw.replace(/^อ\.\s*/, '');  // ตัดคำว่า "อ." ออก
      const districtCode = getDistrict.find(item => item.DISTRICTNAME === district)?.DISTRICTCODE || '';

      const subDistrictRaw = customerStatus?.[0]?.Contract?.Address?.[0]?.District || '';
      const subDistrict = subDistrictRaw.replace(/^ต\.\s*/, '');  // ตัดคำว่า "อ." ออก
      const subDistrictCode = getSubDistrict.find(item => item.SUBDISTRICTNAME === subDistrict)?.SUBDISTRICTCODE || '';

      const zipCode = customerStatus?.[0]?.Contract.Address[0]?.Zipcode || '';
      const telMobile = customerStatus?.[0]?.Contract.Address[0]?.TelMobile || '';
      const telHome = customerStatus?.[0]?.Contract.Address[0]?.TelHome || '';
      const telOffice = customerStatus?.[0]?.Contract.Address[0]?.TelOffice || '';

      const productID = getContract?.[0]?.PRODUCT[0]?.ProductId || '';
      const itemCode = getContract?.[0]?.PRODUCT[0]?.ItemCode || '';
      const productName = getContract?.[0]?.PRODUCT[0]?.ItemDescription || '';
      const packageCode = getContract?.[0]?.PRODUCT[0]?.Package[0]?.MODEL || '';
      const packageName = getContract?.[0]?.PRODUCT[0]?.Package[0]?.PACKAGETITLE || '';
      const packagePrice = getContract?.[0]?.PRODUCT[0]?.Package[0]?.TOTALPRICE || '';
      const firstPayment = getContract?.[0]?.PRODUCT[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT || '';
      const nextPayment = getContract?.[0]?.PRODUCT[0]?.Package[0]?.PERIODDETAILS[1]?.PAYMENTAMOUNT || '';

      const saleName1 = '';
      const saleName2 = auth?.data?.[0]?.TeamName || '';
      const saleName3 = auth?.data?.[0]?.SupName || '';

      const iframeURL =
        `https://app.tsrplc.com/love_connext/issue_systems_page_2.php?RefNo=${refNo}&BookingNo=${bookingNo}&CreateBy=${createBy}&SaleEmployeeCode=${saleEmployeeCode}&SaleCode=${saleCode}&TeamName=${teamName}&ProcessType=${processType}&CustomerType=${customerType}&FName=${fName}&LName=${lName}&IDCard=${idCard}&BirthDay=${birthDay}&Address=${address}&ProvinceCode=${provinceCode}&DistrictCode=${districtCode}&SubDistrictCode=${subDistrictCode}&Zipcode=${zipCode}&TelMobile=${telMobile}&TelHome=${telHome}&TelOffice=${telOffice}&ProductID=${productID}&ItemCode=${itemCode}&ProductName=${productName}&PackageCode=${packageCode}&PackageName=${packageName}&PackagePrice=${packagePrice}&FirstPayment=${firstPayment}&NextPayment=${nextPayment}&SaleName1=${saleName1}&SaleName2=${saleName2}&SaleName3=${saleName3}`;

      // ยืนยันก่อนเปิดหน้าต่างใหม่
      Swal.fire({
        title: 'แสดงรายละเอียดเพิ่มเติม',
        text: 'คุณต้องการเปิดรายละเอียดเพิ่มเติมในหน้าต่างใหม่หรือไม่?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'เปิดหน้าต่างใหม่',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {
          // เปิดหน้าต่างใหม่
          window.open(iframeURL, '_blank', 'width=1200,height=800,noopener,noreferrer');
        }
      });
    }
  };

  const saveCustomerStatus = async () => {
    try {
      const response = await axios.post(UPDATECONTACT, {
        REFNO,
        EMPID: EmpId,
        TEAMSALE: TeamSale,
        FIELD: 'CUSTOMERSTATUS',
        DATA: [{
          STATUSSALE: customerStatus[0]?.StatusSale,
          STATUSTEXT: statusCustomerContract.statustext,
          MESSAGE: statusCustomerContract.message,
          OTP: statusCustomerContract.date.OTP
        }]
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('API Update Response:', response.data);

      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        // navigate('/sale/discount');
      });

    } catch (error) {
      console.error('Error while updating contract:', error);
      Swal.fire({
        icon: 'error',
        title: 'การบันทึกข้อมูลล้มเหลว!',
        text: 'เกิดข้อผิดพลาดระหว่างการบันทึกข้อมูล',
      });
    }
  };

  const handleNextClick = () => {
    Swal.fire({
      title: 'กรุณากรอก OTP',
      input: 'text',
      inputAttributes: {
        maxlength: '6',
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      showLoaderOnConfirm: true,
      preConfirm: (otp) => {
        if (!otp || otp.length !== 6) {
          Swal.showValidationMessage('กรุณากรอก OTP ให้ครบ 6 หลัก');
          return;
        }

        return axios.post(CHECK_OTP, {
          EmpId: EmpId,
          RefNo: REFNO,
          Otp: otp
        }, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
          if (response.data.message !== 'ตรวจสอบผ่าน') {
            throw new Error(response.data.message || 'OTP ไม่ถูกต้อง');
          }

          setStatusCustomerContract(response.data);  // อัปเดตข้อมูล OTP ลงใน state
          return response.data;
        }).catch(error => {
          Swal.showValidationMessage(`การตรวจสอบล้มเหลว: ${error.message}`);
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'ตรวจสอบ OTP ผ่าน!',
          text: 'กำลังบันทึกข้อมูล...',
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        // หลังจากนี้ไม่จำเป็นต้องทำอะไร เพราะ useEffect จะเรียก saveCustomerStatus ให้อัตโนมัติ
      }
    });
  };

  useEffect(() => {
    if (customerStatus) {
      const province = customerStatus?.[0]?.Contract?.Address?.[0]?.Province || '';
      const selectedProvinceCode = getProvince.find(item => item.PROVINCENAME === province)?.PROVINCECODE || '';

      setSelectedProvince(selectedProvinceCode);  // ตั้งค่าจังหวัดเพื่อดึงอำเภอ
    }
  }, [customerStatus, getProvince]);

  // โหลดอำเภอหลังจากเลือกจังหวัด
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.post(DISTRICT_URL, { ProvinceCode: selectedProvince }, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          setGetDistrict(response.data);

          // ตั้งค่าอำเภออัตโนมัติหลังโหลดเสร็จ
          const districtRaw = customerStatus?.[0]?.Contract?.Address?.[0]?.Amphur || '';
          const district = districtRaw.replace(/^อ\.\s*/, '');  // ตัด "อ." ออก
          const districtCode = response.data.find((item: DistrictItem) => item.DISTRICTNAME === district)?.DISTRICTCODE || '';

          setSelectedDistrict(districtCode);  // ตั้งค่าอำเภอเพื่อดึงตำบล
        } catch (error) {
          console.error('Error fetching DISTRICT_URL:', error);
        }
      };
      fetchDistricts();
    }
  }, [selectedProvince, customerStatus]);

  // โหลดตำบลหลังจากเลือกอำเภอ
  useEffect(() => {
    if (selectedDistrict) {
      const fetchSubDistricts = async () => {
        try {
          const response = await axios.post(SUBDISTRICT_URL, { DistrictCode: selectedDistrict }, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          setGetSubDistrict(response.data);

          // ตั้งค่าตำบลอัตโนมัติหลังโหลดเสร็จ
          const subDistrictRaw = customerStatus?.[0]?.Contract?.Address?.[0]?.District || '';
          const subDistrict = subDistrictRaw.replace(/^ต\.\s*/, '');  // ตัด "ต." ออก
          const subDistrictCode = response.data.find((item: SubDistrictItem) => item.SUBDISTRICTNAME === subDistrict)?.SUBDISTRICTCODE || '';

          setSelectedSubDistrict(subDistrictCode);  // ตั้งค่าตำบล
          // console.log('subDistrictCode:', subDistrictCode);
        } catch (error) {
          console.error('Error fetching SUBDISTRICT_URL:', error);
        }
      };
      fetchSubDistricts();
    }
  }, [selectedDistrict, customerStatus]);

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

  return (
    <>
      <Content>
        <div className='d-flex justify-content-between align-items-center mb-7 mt-lg-5 my-5'>
          <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
            data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
            className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
            <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
              ตรวจสอบลูกค้า
            </h1>
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
              <li className="breadcrumb-item text-muted">
                <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
                  ระบบขาย
                </a></li>
              <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
              <li className="breadcrumb-item text-gray-900">ตรวจสอบลูกค้า</li>
            </ul>
          </div>
        </div>
        <p>เลขที่ขาย: {REFNO}</p>

        {/* Card Body */}
        <div className='card mb-10'>
          <div className='card-body py-5'>

            {/* begin::Header */}
            <div className='d-flex justify-content-between align-items-center mb-7 mt-5'>
              <h3 className='card-title'>ตรวจสอบสถานะลูกค้า</h3>
              <button
                type='button'
                className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
              >
                <KTIcon iconName='category' className='fs-2' />
              </button>
            </div>
            {/* end::Header */}

            <div className="input-group gap-2 mb-10 d-flex align-items-center">
              <input
                type="text"
                className={`form-control flex-grow-1 ${error ? 'is-invalid' : ''}`}
                placeholder="กรอกเลขบัตรประชาชน"
                onChange={handleInputChange}
                value={idCard}
              />

              <button
                className="btn btn-primary ms-2" // เพิ่มระยะห่างด้านซ้าย
                type="button"
                onClick={checkCustomer}
                disabled={idCard.length !== 13} // ตรวจสอบว่าครบ 13 หลักหรือไม่
              >
                ค้นหา
              </button>
              {error && <div className="invalid-feedback d-block">{error}</div>}
            </div>

            {/* แสดง Loading */}
            {isLoading && (
              <div className="text-center my-10">
                <ThreeDot />
              </div>
            )}

            {/* CardStatusCustomer Component */}
            <div className='row'>
              <div className='col-12 col-md-6 col-xl-4'>
                {!isLoading && customerStatus && customerStatus.length > 0 && (
                  <UpdateCardStatusCustomer customerStatus={customerStatus} handleCheckStatusCustomer={handleCheckStatusCustomer} />
                )}
              </div>
            </div>
            {/* End CardStatusCustomer Component */}
          </div>
        </div>

        <div className='d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10'>
          <button
            className="btn btn-secondary w-auto me-2"
            onClick={() => navigate('/sale/step', { state: item })}
          >
            ย้อนกลับ
          </button>
          <button
            className={`btn btn-warning w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px 
    ${!isSearchDone || isNextDisabled ? 'disabled' : ''}`}
            onClick={handleNextClick}
            disabled={!isSearchDone || isNextDisabled}  // ปุ่มจะ disable ถ้า isSearchDone หรือ hasClickedCard เป็น false
          >
            อัพเดท
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
            className={`btn btn-warning w-auto me-2 
 ${!isSearchDone || isNextDisabled ? 'disabled' : ''}`}
            onClick={handleNextClick}
            disabled={!isSearchDone || isNextDisabled} // ป้องกันการกดปุ่มถ้าไม่ได้ค้นหา
          >
            อัพเดท
          </button>
          <button
            className={`btn btn-primary w-auto ${!isDataComplete ? `disabled` : ``}`}
            disabled={!isDataComplete}
            onClick={handleCheckerClick}
          >
            ส่งตรวจสอบ
          </button>
        </div>

        {/* Modal Component */}
        {showModal && (
          <>
            <div className="modal-backdrop fade show"></div> {/* พื้นหลังจาง */}
            <div
              className="modal show"
              style={{ display: 'block' }}
              tabIndex={-1}
              id="kt_modal_1"
              aria-labelledby="kt_modal_1_label"
              aria-hidden={!showModal}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="kt_modal_1_label">
                      แจ้งเตือน
                    </h5>
                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                      onClick={() => setShowModal(false)}
                      aria-label="Close"
                    >
                      X
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>ลูกค้าต้องชำระเป็นเงินสดเท่านั้น</p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary w-100 w-md-auto px-9"
                      onClick={() => setShowModal(false)}
                    >
                      ปิด
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary w-100 w-md-auto"
                      onClick={handleConfirmClick}
                    >
                      ตกลง
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* End Modal Component */}

        {/* End Card Body */}

      </Content>
    </>
  )
}

export default UpdateSalesSatusCust