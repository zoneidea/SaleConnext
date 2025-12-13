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
  // console.log(`refnoFromUpdate`, refnoFromUpdate);
  const refno = item.REFNO ? item.REFNO : refnoFromUpdate

  const [data, setData] = useState<any[]>([])
  // console.log(`data`, data);

  // ตรงบนสุดของ component (ก่อน return) ให้ดึง pkg กับ discount ออกมา
  const pkg = data[0]?.PRODUCT?.[0]?.Package?.[0] || {};
  const discount = data[0]?.DISCOUNT?.[0]?.DISCOUNTAMOUNT || {};

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

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO || ""
  const GET_CONTRACT_URL = `${API_URL_MONGO}/Contract/GetContractSummary`
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`
  const GET_PAYMENT_URL = `${API_URL_MONGO}/Payment/GetPaymentPeriod`;

  const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT || ""
  const API_URL_POST_CONDITIONSCHECKHISTORY = `${API_SALECONNEXT}/ConditionsCheckHistory`

  const API_URL_TSR = import.meta.env.VITE_APP_API_THIENSURAT || ""
  const EMP_IN_TEAM_URL = `${API_URL_TSR}/Employee_Structure`
  const ADVISER_URL = `${API_URL_TSR}/Employee_Structure/Emp_All`

  const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
  const GET_IMAGES_API = `${API_URL_SALECONNEXT}/GetContractImages?RefNo=${refno}&EmpId=${EmpId}`;

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

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const resp = await axios.get(GET_IMAGES_API);
        const groups = Array.isArray(resp.data?.data) ? resp.data.data : [];

        // เตรียม object ตาม ImagesType เดิม
        const nextImages: ImagesType = {
          IMAGECARD: [],
          IMAGEGPS: [],
          IMAGEMAP: [],
          IMAGECUSTOMERHOME: [],
          IMAGEINSTALLATION: [],
          IMAGETDS: [],
          IMAGECUSTOMER: [],
          IMAGETRADEIN: [],
        };

        // helper: ดึง URL จากแต่ละรายการรูป
        const pickUrls = (arr: any[]) =>
          (Array.isArray(arr) ? arr : [])
            .map((it: any) => it?.FULLURL || it?.FULLPATH || "")
            .filter(Boolean);

        // แม็พ IMAGETYPECODE → ช่องใน state
        for (const g of groups) {
          const code = g?.IMAGETYPECODE;
          const urls = pickUrls(g?.IMAGES);

          switch (code) {
            case "MAP":
              nextImages.IMAGEGPS = urls;
              break;
            case "IDCARD":
              nextImages.IMAGECARD = urls;
              break;
            case "TDS":
              nextImages.IMAGETDS = urls;
              break;
            case "PAYMENTCARD":
              nextImages.IMAGEMAP = urls; // รูปวาดแผนที่
              break;
            case "ADDRESS":
              nextImages.IMAGECUSTOMERHOME = urls;
              break;
            case "INSTALLATION":
              nextImages.IMAGEINSTALLATION = urls;
              break;
            case "CUSTOMER":
              nextImages.IMAGETRADEIN = urls; // รูปเครื่องเทิร์น
              break;
            case "TRANSFERSLIP":
              nextImages.IMAGECUSTOMER = urls; // สลิปโอนเงิน
              break;
            default:
              break;
          }
        }

        setImages(nextImages);
      } catch (err) {
        console.error("Error fetching images:", err);
        setImages(null);
      }
    };

    fetchImages();
  }, [GET_IMAGES_API, refno, EmpId]);

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
        formData.append("EmpId", EmpId);
        formData.append("SaleCode", SaleCode);
        formData.append("TeamSale", TeamSale);
        formData.append("ProcessType", auth.processtype);
        formData.append("DepID", auth?.data?.[0]?.DepID);

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
  // console.log(`finish`, finish);
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
          TEAMSALE: TeamSale,
          ProcessType: auth.processtype
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
  // console.log(`matchedItem`, matchedItem);

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

  // ----- STEP COMPLETIONS -----
  // ---------- helpers ----------
  const isNonEmptyStr = (v: any) => typeof v === 'string' && v.trim() !== ''
  const hasAny = <T,>(arr: T[] | undefined, pred: (x: T) => boolean) =>
    Array.isArray(arr) && arr.some(pred)

  // ---------- สั้นๆ ชี้ไป data[0] ----------
  const s = data?.[0] ?? {}

  // 1) ตรวจสอบสถานะลูกค้า: ต้องมี field ใช้งานได้จริง
  const step1Complete = hasAny(s.CUSTOMERSTATUS, (o: any) =>
    isNonEmptyStr(o.CustomerName) ||
    isNonEmptyStr(o.message) ||
    isNonEmptyStr(o.Message) ||
    isNonEmptyStr(o.Searchtext)
  )

  // 2) เลือกแพ็คเกจ: ต้องมีคำอธิบาย/โค้ด หรือ Package จริง
  const step2Complete = hasAny(s.PRODUCT, (p: any) =>
    isNonEmptyStr(p.ItemDescription) ||
    isNonEmptyStr(p.ItemCode) ||
    (Array.isArray(p.Package) && p.Package.length > 0)
  )

  // 3) ส่วนลด/ของแถม/เทิร์น: ต้องมีค่าอย่างน้อยหนึ่ง และแพ็คเกจไม่ถูกเปลี่ยน
  const step3Complete = hasAny(s.DISCOUNT, (d: any) =>
    d?.DISCOUNTAMOUNT != null ||
    isNonEmptyStr(d?.GIFT?.GIFTDESCRIPTION) ||
    d?.TRADEIN?.HASTRADEIN === 1 ||
    isNonEmptyStr(d?.TRADEIN?.TRADEINMODEL) ||
    isNonEmptyStr(d?.TRADEIN?.TRADEINBRANDNAME)
  )

  // 4) พนักงานขาย: ต้องมี SALEEMPLOYEE พร้อมชื่อ/รหัสจริง
  const step4Complete = hasAny(s.SALEEMPLOYEE, (e: any) =>
    !!e?.SALEEMPLOYEE && (
      isNonEmptyStr(e.SALEEMPLOYEE.FName) ||
      isNonEmptyStr(e.SALEEMPLOYEE.EmpId) ||
      isNonEmptyStr(e.SALEEMPLOYEE.SaleEmp)
    )
  )

  // 5) ข้อมูลลูกค้า: ตามเกณฑ์เดิม แต่เช็ค “มีค่า”
  const cd = s.CUSTOMERDETAIL?.[0] ?? {}
  const step5Complete =
    !!cd?.CUSTOMERTYPE ||
    isNonEmptyStr(cd?.CUSTOMERNAME) ||
    isNonEmptyStr(cd?.CUSTOMERMOBILE) ||
    (Array.isArray(cd?.PREFIX) && cd.PREFIX.length > 0)

  // 6) ที่อยู่: address ใดๆ ต้องมี province/zipcode อย่างน้อยหนึ่ง
  const step6Complete = hasAny(s.ADDRESS, (a: any) => {
    const c = a?.ADDRESSCARD ?? a?.ADDRESSINSTALLATION ?? a?.ADDRESSPAYMENT
    return isNonEmptyStr(c?.ADDRESSPROVINCENAME) || isNonEmptyStr(c?.ADDRESSZIPCODE)
  })

  // 7) PDPA: ต้องมี CONSENTGIVEN (boolean)
  const step7Complete = hasAny(s.PDPA, (p: any) => typeof p?.CONSENTGIVEN === 'boolean')

  // 8) สัญญา: ต้องมี createdAt หรือเลขที่สัญญา
  const step8Complete = hasAny(s.CONTRACT, (c: any) =>
    isNonEmptyStr(c?.createdAt) || isNonEmptyStr(c?.CONTNO)
  )

  // 9) การชำระเงิน/นัดชำระ: จาก API หรือทำเครื่องหมาย local
  const step9Complete = !!(hasPaymentPeriod || paidFromLocal)

  // 10) ถ่ายรูป: มีรูปอย่างน้อย 1 หมวด
  const step10Complete = !!images && Object.values(images).some(v => Array.isArray(v) && v.length > 0)

  const completeArr = [
    step1Complete, // index 0 -> step 1
    step2Complete,
    step3Complete,
    step4Complete,
    step5Complete,
    step6Complete,
    step7Complete,
    step8Complete,
    step9Complete,
    step10Complete,
  ]

  // บล็อก step N ถ้ามี step ก่อนหน้าใดๆ ไม่ครบ
  const isBlocked = (stepNumber: number) => {
    const prevEndIdx = stepNumber - 2
    if (prevEndIdx < 0) return false
    return completeArr.slice(0, prevEndIdx + 1).some(ok => !ok)
  }

  // ใช้กับปุ่ม/ลิงก์เพื่อปิดคลิกและลด opacity
  // const disabledProps = (stepNumber: number) =>
  //   isBlocked(stepNumber)
  //     ? { disabled: true as const, style: { cursor: 'not-allowed', opacity: 0.6 } }
  //     : {}

  // // guard เรียกก่อน navigate
  // const guard = (stepNumber: number) => {
  //   if (isBlocked(stepNumber)) {
  //     Swal.fire({
  //       icon: 'warning',
  //       title: 'ขั้นตอนไม่ครบ',
  //       text: 'กรุณาทำให้ขั้นตอนก่อนหน้าเป็นสีเขียวก่อน',
  //       confirmButtonText: 'ตกลง',
  //     })
  //     return false
  //   }
  //   return true
  // }

  const hasSaleEmployee =
    !!data?.[0]?.SALEEMPLOYEE &&
    data[0].SALEEMPLOYEE.length > 0 &&
    !!data[0].SALEEMPLOYEE[0]?.SALEEMPLOYEE?.FName

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

                  {/* 1. ตรวจสอบสถานะลูกค้า */}
                  {/* <button
                    {...disabledProps(1)}
                    onClick={async () => {
                      if (!guard(1)) return
                      if (s?.CUSTOMERSTATUS?.length > 0) {
                        await Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้', confirmButtonText: 'ตกลง' })
                        return
                      }
                      const ok = await handleClick('updateSalesSatusCust')
                      if (ok) navigate('/sale/update/updateSalesSatusCust', { state: s })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  > */}
                  <button
                    onClick={async () => {
                      if (s?.CUSTOMERSTATUS?.length > 0) {
                        await Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้', confirmButtonText: 'ตกลง' })
                        return
                      }
                      const ok = await handleClick('updateSalesSatusCust')
                      if (ok) navigate('/sale/update/updateSalesSatusCust', { state: s })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data[0].CUSTOMERSTATUS.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
                      {/* <span className={`bullet bullet-vertical h-40px ${step1Complete ? 'bg-success' : 'bg-danger'}`}></span> */}
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

                  {/* 2. เลือกแพ็คเกจ */}
                  {/* <button
                    {...disabledProps(2)}
                    onClick={() => {
                      if (!guard(2)) return
                      if (s?.NEWREFNO?.length > 0) {
                        Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้', confirmButtonText: 'ตกลง' })
                        return
                      }
                      navigate('/sale/update/updateSalePackage', { state: s })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  > */}
                  <button
                    onClick={() => {
                      if (s?.NEWREFNO?.length > 0) {
                        Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้', confirmButtonText: 'ตกลง' })
                        return
                      }
                      navigate('/sale/update/updateSalePackage', { state: s })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data[0]?.PRODUCT.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
                      {/* <span className={`bullet bullet-vertical h-40px ${step2Complete ? 'bg-success' : 'bg-danger'}`}></span> */}
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

                  {/* 3. ส่วนลด / เครื่องเทิร์น / ของแถม */}
                  {/* <button
                    {...disabledProps(3)}
                    onClick={() => {
                      if (!guard(3)) return
                      if (s.CUSTOMERSTATUS.length === 0) {
                        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'กรุณาตรวจสอบข้อมูลลูกค้าก่อน' })
                        return
                      }
                      if (s.PRODUCT.length === 0) {
                        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'กรุณาเลือกแพ็คเกจก่อน' })
                        return
                      }
                      if (s.PRODUCT.length > 0) {
                        Swal.fire({ icon: 'info', title: 'แก้ไขได้จากขั้นตอน เลือกแพ็คเกจ เท่านั้น' })
                        return
                      }
                      if (s?.NEWREFNO?.length > 0) {
                        Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้' })
                        return
                      }
                      handleClick('updateSaleDiscount').then(ok => {
                        if (ok) navigate('/sale/update/updateSaleDiscount', { state: s })
                      })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  > */}
                  <button
                    onClick={() => {
                      if (s.CUSTOMERSTATUS.length === 0) {
                        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'กรุณาตรวจสอบข้อมูลลูกค้าก่อน' })
                        return
                      }
                      if (s.PRODUCT.length === 0) {
                        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'กรุณาเลือกแพ็คเกจก่อน' })
                        return
                      }
                      if (s.PRODUCT.length > 0) {
                        Swal.fire({ icon: 'info', title: 'แก้ไขได้จากขั้นตอน เลือกแพ็คเกจ เท่านั้น' })
                        return
                      }
                      if (s?.NEWREFNO?.length > 0) {
                        Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้' })
                        return
                      }
                      handleClick('updateSaleDiscount').then(ok => {
                        if (ok) navigate('/sale/update/updateSaleDiscount', { state: s })
                      })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span
                        className={`bullet bullet-vertical h-40px ${packageChanged || !discount || data[0].PRODUCT.length === 0 ? 'bg-danger' : 'bg-success'
                          }`}
                      ></span>
                      {/* <span className={`bullet bullet-vertical h-40px ${step3Complete ? 'bg-success' : 'bg-danger'}`}></span> */}
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className={styles.label}>3. ส่วนลด / เครื่องเทิร์น / ของแถม</div>

                        {/* {packageChanged ? (
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
                        )} */}
                        <>
                          {/* {hasDiscPrice && (
                            <span className={`text-gray-700 d-block ${styles.label}`}>
                              {`ส่วนลด: ${data?.[0]?.DISCOUNT?.[0]?.DISCOUNTAMOUNT}`}
                            </span>
                          )}
                          {hasDiscGift && (
                            <span className={`text-gray-700 d-block ${styles.label}`}>
                              {`ของแถม: ${data?.[0]?.DISCOUNT?.[0]?.GIFT.GIFTDESCRIPTION}`}
                            </span>
                          )}
                          {hasDiscTradeIn && (
                            <span className={`text-gray-700 d-block ${styles.label}`}>
                              {`เครื่องเทิร์น: ${data?.[0]?.DISCOUNT?.[0]?.TRADEIN.TRADEINBRANDNAME}`}
                              {` รุ่น: ${data?.[0]?.DISCOUNT?.[0]?.TRADEIN.TRADEINMODEL}`}
                              {` S/N: ${data?.[0]?.DISCOUNT?.[0]?.TRADEIN.TRADEINSERIAL}`}
                            </span>
                          )}
                          {!(hasDiscPrice || hasDiscGift || hasDiscTradeIn) || (data[0].PRODUCT.length === 0) && (
                            <span className={`text-gray-700 d-block ${styles.label}`}>
                              ไม่มี ส่วนลด / เครื่องเทิร์น / ของแถม
                            </span>
                          )} */}
                          <span className={`text-gray-700 d-block ${styles.label}`}>
                            {`ส่วนลด: ${data?.[0]?.DISCOUNT?.[0]?.DISCOUNTAMOUNT}`}
                          </span>
                          {data?.[0]?.DISCOUNT?.[0]?.GIFT.GIFTDESCRIPTION && (
                            <span className={`text-gray-700 d-block ${styles.label}`}>
                              {`ของแถม: ${data?.[0]?.DISCOUNT?.[0]?.GIFT.GIFTDESCRIPTION}`}
                            </span>
                          )}
                          {data?.[0]?.DISCOUNT?.[0]?.TRADEIN.TRADEINBRANDNAME && (
                            <span className={`text-gray-700 d-block ${styles.label}`}>
                              {`เครื่องเทิร์น: ${data?.[0]?.DISCOUNT?.[0]?.TRADEIN.TRADEINBRANDNAME}`}
                              {` รุ่น: ${data?.[0]?.DISCOUNT?.[0]?.TRADEIN.TRADEINMODEL}`}
                              {` S/N: ${data?.[0]?.DISCOUNT?.[0]?.TRADEIN.TRADEINSERIAL}`}
                            </span>
                          )}
                        </>
                      </div>
                    </div>
                  </button>

                  {/* 4. พนักงานขาย */}
                  {/* <button
                    {...disabledProps(4)}
                    onClick={() => {
                      if (!guard(4)) return
                      if (s?.PRODUCT.length === 0 || s?.DISCOUNT.length === 0) {
                        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'กรุณาบันทึกแพ็คเกจให้ครบถ้วนก่อน' })
                        return
                      }
                      if (s?.NEWREFNO?.length > 0) {
                        Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้' })
                        return
                      }
                      navigate('/sale/update/UpdateSalesEmployee', { state: s })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  > */}
                  <button
                    onClick={() => {
                      if (s?.PRODUCT.length === 0 || s?.DISCOUNT.length === 0) {
                        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'กรุณาบันทึกแพ็คเกจให้ครบถ้วนก่อน' })
                        return
                      }
                      // if (s?.NEWREFNO?.length > 0) {
                      //   Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้' })
                      //   return
                      // }
                      navigate('/sale/update/UpdateSalesEmployee', { state: s })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span
                        className={`bullet bullet-vertical h-40px ${hasSaleEmployee ? "bg-success" : "bg-danger"
                          }`}
                      />
                      {/* <span className={`bullet bullet-vertical h-40px ${step4Complete ? 'bg-success' : 'bg-danger'}`}></span> */}
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className={`${styles.label}`}>4. เลือกพนักงานขาย</div>
                        {(data?.[0]?.SALEEMPLOYEE?.length ?? 0) > 0 && (
                          <>
                            {data[0].SALEEMPLOYEE[0]?.SALEEMPLOYEE?.FName && (
                              <span className={`text-gray-700 d-block ${styles.label}`}>
                                {`พนักงานขาย: ${data[0].SALEEMPLOYEE[0].SALEEMPLOYEE.FName} ${data[0].SALEEMPLOYEE[0].SALEEMPLOYEE.LName ?? ""
                                  }`}
                              </span>
                            )}
                            {data[0].SALEEMPLOYEE[0]?.ADVISER && (
                              <span className={`text-gray-700 d-block ${styles.label}`}>
                                {`ผู้แนะนำ: ${data[0].SALEEMPLOYEE[0].ADVISER.FName} ${data[0].SALEEMPLOYEE[0].ADVISER.LName ?? ""
                                  }`}
                              </span>
                            )}
                            {data[0].SALEEMPLOYEE[0]?.INSTALLER && (
                              <span className={`text-gray-700 d-block ${styles.label}`}>
                                {`พนักงานติดตั้ง: ${data[0].SALEEMPLOYEE[0].INSTALLER.FName
                                  } ${data[0].SALEEMPLOYEE[0].INSTALLER.LName ?? ""}`}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </button>


                  {/* 5. บันทึกข้อมูลลูกค้า */}
                  {/* <button
                    {...disabledProps(5)}
                    onClick={() => {
                      if (!guard(5)) return
                      if (s?.NEWREFNO?.length > 0) {
                        Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้' })
                        return
                      }
                      handleClick('updateCustDetail').then(ok => {
                        if (ok) navigate('/sale/update/updateCustDetail', { state: s })
                      })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  > */}
                  <button
                    onClick={() => {
                      if (s?.NEWREFNO?.length > 0) {
                        Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้' })
                        return
                      }
                      handleClick('updateCustDetail').then(ok => {
                        if (ok) navigate('/sale/update/updateCustDetail', { state: s })
                      })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span
                        className={`bullet bullet-vertical h-40px ${!data[0]?.CUSTOMERDETAIL?.[0]?.CUSTOMERTYPE &&
                          !data[0]?.CUSTOMERDETAIL?.[0]?.CUSTOMERNAME &&
                          !data[0]?.CUSTOMERDETAIL?.[0]?.CUSTOMERMOBILE &&
                          !(data[0]?.CUSTOMERDETAIL?.[0]?.PREFIX?.length > 0)
                          ? 'bg-danger'
                          : 'bg-success'
                          }`}
                      />
                      {/* <span className={`bullet bullet-vertical h-40px ${step5Complete ? 'bg-success' : 'bg-danger'}`}></span> */}
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

                  {/* 6. บันทึกที่อยู่ลูกค้า */}
                  {/* <button
                    {...disabledProps(6)}
                    onClick={() => {
                      if (!guard(6)) return
                      if (s?.NEWREFNO?.length > 0) {
                        Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้' })
                        return
                      }
                      if ((s?.CUSTOMERDETAIL?.length ?? 0) <= 0) {
                        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'กรุณาบันทึกข้อมูลลูกค้าก่อน' })
                        return
                      }
                      handleClick('updateAddress').then(ok => {
                        if (ok) navigate('/sale/update/updateAddress', { state: s })
                      })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  > */}
                  <button
                    onClick={() => {
                      if (s?.NEWREFNO?.length > 0) {
                        Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้' })
                        return
                      }
                      if ((s?.CUSTOMERDETAIL?.length ?? 0) <= 0) {
                        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'กรุณาบันทึกข้อมูลลูกค้าก่อน' })
                        return
                      }
                      handleClick('updateAddress').then(ok => {
                        if (ok) navigate('/sale/update/updateAddress', { state: s })
                      })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data[0].ADDRESS.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
                      {/* <span className={`bullet bullet-vertical h-40px ${step6Complete ? 'bg-success' : 'bg-danger'}`}></span> */}
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className={`${styles.label}`}>6. บันทึกที่อยู่ลูกค้า</div>
                        {data[0].ADDRESS.length !== 0 && (
                          <>
                            <span className={`text-gray-700 d-block ${styles.label}`}>
                              {`ที่อยู่ตามบัตร: ${data[0].ADDRESS[0].ADDRESSCARD.ADDRESSSUBDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSCARD.ADDRESSDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSCARD.ADDRESSPROVINCENAME} ${data[0].ADDRESS[0].ADDRESSCARD.ADDRESSZIPCODE}`}
                            </span>
                            <span className={`text-gray-700 d-block ${styles.label}`}>
                              {`ที่อยู่ติดตั้ง: ${data[0].ADDRESS[0].ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSINSTALLATION.ADDRESSDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSINSTALLATION.ADDRESSPROVINCENAME} ${data[0].ADDRESS[0].ADDRESSINSTALLATION.ADDRESSZIPCODE}`}
                            </span>
                            <span className={`text-gray-700 d-block ${styles.label}`}>
                              {`ที่อยู่เก็บเงิน: ${data[0].ADDRESS[0].ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSPAYMENT.ADDRESSDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSPAYMENT.ADDRESSPROVINCENAME} ${data[0].ADDRESS[0].ADDRESSPAYMENT.ADDRESSZIPCODE}`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* 7. PDPA */}
                  {/* <button
                    {...disabledProps(7)}
                    onClick={() => {
                      if (!guard(7)) return
                      if ((s?.ADDRESS?.length ?? 0) === 0) {
                        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'กรุณาบันทึกข้อมูลให้ครบทุกส่วน' })
                        return
                      }
                      if ((s?.PDPA?.length ?? 0) > 0) {
                        Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้' })
                        return
                      }
                      if (s?.NEWREFNO?.length > 0) {
                        Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้' })
                        return
                      }
                      navigate('/sale/pdpa', { state: { ...s, from: '/sale/step' } })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  > */}
                  <button
                    onClick={() => {
                      if ((s?.ADDRESS?.length ?? 0) === 0) {
                        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'กรุณาบันทึกข้อมูลให้ครบทุกส่วน' })
                        return
                      }
                      if ((s?.PDPA?.length ?? 0) > 0) {
                        Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้' })
                        return
                      }
                      if (s?.NEWREFNO?.length > 0) {
                        Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้' })
                        return
                      }
                      navigate('/sale/pdpa', { state: { ...s, from: '/sale/step' } })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data[0].PDPA.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
                      {/* <span className={`bullet bullet-vertical h-40px ${step7Complete ? 'bg-success' : 'bg-danger'}`}></span> */}
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
                  {/* <button
                    {...disabledProps(8)}
                    onClick={() => {
                      if (!guard(8)) return
                      handleClick('UpdateSalesContract').then(ok => {
                        if (ok) navigate('/sale/contract', { state: s })
                      })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  > */}
                  <button
                    onClick={() => {
                      handleClick('UpdateSalesContract').then(ok => {
                        if (ok) navigate('/sale/contract', { state: s })
                      })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data[0].CONTRACT.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
                      {/* <span className={`bullet bullet-vertical h-40px ${step8Complete ? 'bg-success' : 'bg-danger'}`}></span> */}
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
                  {/* <button
                    {...disabledProps(9)}
                    onClick={() => {
                      if (!guard(9)) return
                      if ((s?.CONTRACT?.length ?? 0) === 0) {
                        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'กรุณาบันทึกรายละเอียดสัญญาก่อน' })
                        return
                      }
                      if (hasPaymentPeriod || paidFromLocal) {
                        Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้' })
                        return
                      }
                      handleClick('UpdateSalesContract').then(ok => {
                        if (ok) {
                          navigate('/firstBill/CreateFirstBill', { state: { item: s, from: location.pathname } })
                        }
                      })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  > */}
                  <button
                    onClick={() => {
                      if ((s?.CONTRACT?.length ?? 0) === 0) {
                        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'กรุณาบันทึกรายละเอียดสัญญาก่อน' })
                        return
                      }
                      if (hasPaymentPeriod || paidFromLocal) {
                        Swal.fire({ icon: 'info', title: 'ไม่สามารถแก้ไขได้' })
                        return
                      }
                      handleClick('UpdateSalesContract').then(ok => {
                        if (ok) {
                          navigate('/firstBill/CreateFirstBill', { state: { item: s, from: location.pathname } })
                        }
                      })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data[0].CONTRACT.length === 0 ? 'bg-danger' : 'bg-success'}`}></span>
                      {/* <span className={`bullet bullet-vertical h-40px ${step9Complete ? 'bg-success' : 'bg-danger'}`}></span> */}
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className={`${styles.label}`}>9. การชำระเงิน / นัดชำระ</div>
                        {data[0].CONTRACT.length !== 0 && (
                          <span className={`text-gray-700 d-block ${styles.label}`}>
                          </span>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* 10. ถ่ายรูป */}
                  {/* <button
                    {...disabledProps(10)}
                    onClick={() => {
                      if (!guard(10)) return
                      if (
                        (s?.CUSTOMERSTATUS?.length ?? 0) === 0 &&
                        (s?.PRODUCT?.length ?? 0) === 0 &&
                        (s?.DISCOUNT?.length ?? 0) === 0 &&
                        (s?.SALEEMPLOYEE?.length ?? 0) === 0 &&
                        (s?.CUSTOMERDETAIL?.length ?? 0) === 0 &&
                        (s?.ADDRESS?.length ?? 0) === 0 &&
                        (s?.PDPA?.length ?? 0) === 0 &&
                        (s?.CONTRACT?.length ?? 0) === 0
                      ) {
                        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'กรุณาบันทึกขั้นตอนก่อนหน้าให้ครบก่อน' })
                        return
                      }
                      handleClick('photo').then(ok => {
                        if (ok) navigate('/sale/update/UpdateSalesPhoto', { state: { fromStep: true, data: s } })
                      })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  > */}
                  <button
                    onClick={() => {
                      if (
                        (s?.CUSTOMERSTATUS?.length ?? 0) === 0 &&
                        (s?.PRODUCT?.length ?? 0) === 0 &&
                        (s?.DISCOUNT?.length ?? 0) === 0 &&
                        (s?.SALEEMPLOYEE?.length ?? 0) === 0 &&
                        (s?.CUSTOMERDETAIL?.length ?? 0) === 0 &&
                        (s?.ADDRESS?.length ?? 0) === 0 &&
                        (s?.PDPA?.length ?? 0) === 0 &&
                        (s?.CONTRACT?.length ?? 0) === 0
                      ) {
                        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'กรุณาบันทึกขั้นตอนก่อนหน้าให้ครบก่อน' })
                        return
                      }
                      handleClick('photo').then(ok => {
                        if (ok) navigate('/sale/update/UpdateSalesPhoto', { state: { fromStep: true, data: s } })
                      })
                    }}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${images && Object.values(images).some(field => Array.isArray(field) && field.length > 0)
                        ? 'bg-success'
                        : 'bg-danger'
                        }`}></span>
                      {/* <span className={`bullet bullet-vertical h-40px ${step10Complete ? 'bg-success' : 'bg-danger'}`}></span> */}
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