import styles from '@/styles/style.module.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../../modules/auth/core/Auth'
import { Content } from '../../../../_metronic/layout/components/content'
import useRefnoBarcodeStore from "../components/accessCam/refnoBarcodeStore"

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { ThreeDot } from 'react-loading-indicators'

// useStore
import { useCategoryStore } from '../../../modules/stores/sales/packageStore/packageStore'

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

const EditFinishInDay: React.FC = () => {
  const MySwal = withReactContent(Swal)
  const location = useLocation()
  const navigate = useNavigate()
  const item = location.state as ItemProps

  // ถ้าได้ REFNO มาจาก location.state ก็ใช้ ถ้าไม่มีก็ fallback ไปดึงจาก store
  const refnoFromUpdate = useRefnoBarcodeStore((state: any) => state.refno || item?.REFNO || "")
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

  // สร้าง state สำหรับพดกงานขาย, ผู้แนะนำ, ช่างติดตั้ง
  const [empInTeam, setEmpInTeam] = useState<any[]>([])
  const [adviserList, setAdviserList] = useState<any[]>([])
  const [installerList, setInstallerList] = useState<any[]>([])

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO || ""
  const GET_CONTRACT_URL = `${API_URL_MONGO}/Contract/GetContractSummary`
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`

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

              {/* เนื้อหาแต่ละขั้นตอน */}
              <div className='card-body d-flex align-items-center py-5 pt-10'>
                <div className='col-12'>

                  {/* 1. ตรวจสอบสถานะลูกค้า */}
                  <button
                    onClick={async () => {
                      await Swal.fire({
                        icon: 'info',
                        title: 'ไม่สามารถแก้ไขได้',
                        confirmButtonText: 'ตกลง',
                      });
                      return;
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
                    // onClick={async () => {
                    //   navigate('/sale/editFinishInDay/UpdateSalesPackageFinishDay', { state: data[0] });
                    // }}
                    onClick={async () => {
                      await Swal.fire({
                        icon: 'info',
                        title: 'ไม่สามารถแก้ไขได้',
                        confirmButtonText: 'ตกลง',
                      });
                      return;
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
                            {`${data[0]?.PRODUCT[0]?.ItemDescription}`}
                          </span>
                        )}
                        {data[0]?.PRODUCT.length !== 0 && data[0]?.PRODUCT[1]?.ItemDescription && (
                          <span className={`text-gray-700 d-block ${styles.label}`}>
                            {`สินค้าบันเดิล: ${data[0]?.PRODUCT[1]?.ItemDescription}`}
                          </span>
                        )}
                        {data[0]?.PRODUCT.length > 0 && data[0]?.PRODUCT[0]?.Package.length > 0 && (
                          <span className={`text-gray-700 d-block ${styles.label}`}>
                            {`${data[0]?.PRODUCT[0]?.Package[0]?.PACKAGETITLE || 'ไม่มีแพ็คเกจ'}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* 4. ส่วนลด / เครื่องเทิร์น / ของแถม */}
                  <a
                    style={{ cursor: 'pointer', textDecoration: 'none' }}
                    // onClick={async () => {
                    //   await Swal.fire({
                    //     icon: 'info',
                    //     title: 'แก้ไขได้จากขั้นตอน เลือกแพ็คเกจ เท่านั้น',
                    //     confirmButtonText: 'ตกลง',
                    //   });
                    //   return;
                    // }}
                    onClick={async () => {
                      await Swal.fire({
                        icon: 'info',
                        title: 'ไม่สามารถแก้ไขได้',
                        confirmButtonText: 'ตกลง',
                      });
                      return;
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
                      }

                      // ถ้าผ่าน ให้ navigate ไปหน้าที่ต้องการ
                      navigate('/sale/editFinishInDay/UpdateSalesEmployeeFinishDay', { state: { ...data[0] } });
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
                      handleClick('updateCustDetail').then(ok => {
                        if (ok) {
                          navigate('/sale/editFinishInDay/UpdateSaleCustDetailFinishDay', { state: { ...data[0] } });
                        }
                      })
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
                                ? `ชื่อลูกค้า: ${data[0].CUSTOMERDETAIL[0].CUSTOMERNAME} ${data[0].CUSTOMERDETAIL[0].CUSTOMERLASTNAME}`
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
                      handleClick('updateAddress').then(ok => {
                        if (ok) {
                          navigate('/sale/editFinishInDay/UpdateSaleAddressFinishDay', { state: { ...data[0] } });
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
                              {`ที่อยู่ตามบัตร: ${data[0].ADDRESS[0].ADDRESSCARD.ADDRESSSUBDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSCARD.ADDRESSDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSCARD.ADDRESSPROVINCENAME} ${data[0].ADDRESS[0].ADDRESSCARD.ADDRESSZIPCODE}`}
                            </span>
                            <span className={`text-gray-700 d-block ${styles.label}`}>
                              {`ที่อยู่ติดตั้ง: ${data[0].ADDRESS[0].ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSINSTALLATION.ADDRESSDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSINSTALLATION.ADDRESSPROVINCENAME} ${data[0].ADDRESS[0].ADDRESSINSTALLATION.ADDRESSZIPCODE}`}
                            </span>
                            {data[0].ADDRESS[0].ADDRESSPAYMENT.ADDRESSPROVINCENAME.length > 0 && (
                              <span className={`text-gray-700 d-block ${styles.label}`}>
                                {`ที่อยู่เก็บเงิน: ${data[0].ADDRESS[0].ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSPAYMENT.ADDRESSDISTRICTNAME} ${data[0].ADDRESS[0].ADDRESSPAYMENT.ADDRESSPROVINCENAME} ${data[0].ADDRESS[0].ADDRESSPAYMENT.ADDRESSZIPCODE}`}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* PDPA */}
                  <button
                    onClick={async () => {
                      await Swal.fire({
                        icon: 'info',
                        title: 'ไม่สามารถแก้ไขได้',
                        confirmButtonText: 'ตกลง',
                      });
                      return;
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
                          navigate('/sale/editFinishInDay/UpdateSalesContractFinishDay', { state: data[0] })
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
                    onClick={() => {
                      if (data[0]?.NEWREFNO && data[0].NEWREFNO.length > 0) {
                        Swal.fire({
                          icon: 'info',
                          title: 'ไม่สามารถแก้ไขได้',
                          confirmButtonText: 'ตกลง',
                        });
                        return;
                      }

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
                    onClick={() => {
                      handleClick('photo').then(ok => {
                        if (ok) {
                          navigate('/sale/update/UpdateSalesPhoto', { state: { fromStep: true, from: location.pathname, data: data[0] } })
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
                to='/sale/cancel'
                state={data[0]}
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
              <Link to='/sale/cancel'
                state={data[0]}
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
      </Content>
    </>
  )
}

export default EditFinishInDay