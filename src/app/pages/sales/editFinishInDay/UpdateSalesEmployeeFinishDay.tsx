// src/pages/UpdateSalesEmployeeFinishDay.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from '@/styles/style.module.css'
import axios from 'axios'
import { Content } from '../../../../_metronic/layout/components/content'
import { useAuth } from '../../../modules/auth/core/Auth'
import { ThreeDot } from 'react-loading-indicators'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

interface ItemProps {
    REFNO: string
    // ... (ฟิลด์อื่นๆ ตามที่ต้องการ)
    SALEEMPLOYEE: Array<{
        SALEEMPLOYEE?: { SaleEmp: string; FName: string; LName: string }
        ADVISER?: { SaleEmp: string; FName: string; LName: string }
        INSTALLER?: { SaleEmp: string; FName: string; LName: string }
    }>
}

interface Employee {
    SaleEmp: string
    SaleCode?: string
    FName: string
    LName: string
}

const UpdateSalesEmployeeFinishDay: React.FC = () => {
    const MySwal = withReactContent(Swal)
    const { auth } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // ดึง item ที่ส่งมาจากหน้าเดิม
    const item = location.state as ItemProps

    const EmpId = auth?.data?.[0]?.EmpId || ''
    const TeamSale = auth?.data?.[0]?.TeamSale || ''
    const SaleCode = auth?.data?.[0]?.SaleCode || ''
    const SupEmpId = auth?.data?.[0]?.SupEmp || ''
    const SecEmpId = auth?.data?.[0]?.SecEmp || ''

    // URL สำหรับดึงรายชื่อพนักงาน
    const API_URL_TSR = import.meta.env.VITE_APP_API_THIENSURAT
    const EMP_IN_TEAM_URL = `${API_URL_TSR}/Employee_Structure`
    const ADVISER_URL = `${API_URL_TSR}/Employee_Structure/Emp_Lead`
    const TECHNICAL_URL = `${API_URL_TSR}/Employee_Structure/Emp_Technician`

    // URL สำหรับ update
    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`

    // รายชื่อเลือก
    const [empInTeam, setEmpInTeam] = useState<Employee[]>([])
    const [adviserList, setAdviserList] = useState<Employee[]>([])
    const [installerList, setInstallerList] = useState<Employee[]>([])

    // ทำให้แสดง spinner จนกว่าจะโหลด dropdown ทั้ง 3 เสร็จ
    const everyItemLoaded = empInTeam.length > 0 && adviserList.length > 0 && installerList.length > 0

    // ค่าใน select (pre-fill จาก item.SALEEMPLOYEE[0])
    const initialRec = item.SALEEMPLOYEE?.[0] || {}
    const [values, setValues] = useState({
        employee: initialRec.SALEEMPLOYEE?.SaleEmp || '',
        adviser: initialRec.ADVISER?.SaleEmp || '',
        installer: initialRec.INSTALLER?.SaleEmp || ''
    })

    // helper โหลดรายชื่อ
    const fetchList = useCallback((url: string, setter: React.Dispatch<React.SetStateAction<Employee[]>>) => {
        const form = new FormData()
        form.append('EmpId', EmpId)
        form.append('TeamSale', TeamSale)
        axios.post(url, form, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(r => setter(Array.isArray(r.data.data) ? r.data.data : []))
            .catch(() => {
                MySwal.fire('Error', 'ไม่สามารถโหลดข้อมูลพนักงานได้', 'error')
            })
    }, [EmpId, TeamSale])

    // โหลด dropdown เมื่อ EmpId พร้อม
    useEffect(() => {
        if (!EmpId) return
        fetchList(EMP_IN_TEAM_URL, setEmpInTeam)
        fetchList(ADVISER_URL, setAdviserList)
        fetchList(TECHNICAL_URL, setInstallerList)
    }, [EmpId, fetchList])

    // handler เปลี่ยน select
    const handleSelect = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValues(v => ({ ...v, [key]: e.target.value }))
    }

    // บันทึกแล้วไปขั้นตอนถัดไป
    const handleNextClick = async () => {
        if (!values.employee) {
            return MySwal.fire('Warning', 'กรุณาเลือกพนักงานขายก่อน', 'warning')
        }
        if (!values.installer) {
            return MySwal.fire('Warning', 'กรุณาเลือกพนักงานติดตั้งก่อน', 'warning')
        }

        const payload: any = {
            SALEEMPLOYEE: empInTeam.find(e => e.SaleEmp === values.employee)
        }
        if (values.adviser) payload.ADVISER = adviserList.find(a => a.SaleEmp === values.adviser)
        if (values.installer) payload.INSTALLER = installerList.find(t => t.SaleEmp === values.installer)

        try {
            await axios.post(UPDATECONTACT, {
                REFNO: item.REFNO,
                EMPID: EmpId,
                TEAMSALE: TeamSale,
                SALECODE: SaleCode,
                SUPEMPID: SupEmpId,
                SECEMPID: SecEmpId,
                FIELD: 'SALEEMPLOYEE',
                DATA: [payload],
            })

            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'ปรับปรุงข้อมูลพนักงานขายแล้ว',
                timer: 2000,
                showConfirmButton: false,
            })
        } catch {
            MySwal.fire('Error', 'ไม่สามารถบันทึกข้อมูลได้', 'error')
        }
    }

    return (
        <Content>
            <div className="d-flex justify-content-between align-items-center my-5">
                <div className="page-title">
                    <ul className="breadcrumb">
                        <li className={styles.titlePage}>แก้ไขพนักงานขาย</li>
                    </ul>
                </div>
            </div>

            <span className={styles.fontSize}>เลขที่ขาย: </span>
            <span className={styles.titlePage}>{item.REFNO}</span>

            <div className="accordion mb-10" id="kt_accordion_1">
                {!everyItemLoaded ? (
                    <div className="text-center my-10">
                        <ThreeDot />
                    </div>
                ) : (
                    <div className="accordion-item mb-10">
                        <h2 className="accordion-header" id="kt_accordion_1_header_1">
                            <h3
                                className={`accordion-button collapsed ${styles.fontSize}`}
                                data-bs-toggle="collapse"
                                data-bs-target="#kt_accordion_1_body_1"
                                aria-expanded="true"
                                style={{ color: 'white', backgroundColor: '#3777bc', cursor: 'pointer' }}
                            >
                                ข้อมูลพนักงาน
                            </h3>
                        </h2>
                        <div
                            id="kt_accordion_1_body_1"
                            className="accordion-collapse collapse show"
                            aria-labelledby="kt_accordion_1_header_1"
                        >
                            <div className="accordion-body">
                                <div className="card-body px-lg-9 px-1">
                                    <div className="row mb-6">
                                        <div className="col-lg-4 mb-3">
                                            <label className={`form-label ${styles.label} ${styles.required}`}>
                                                พนักงานขาย
                                            </label>
                                            <select
                                                className={`form-select ${styles.label}`}
                                                value={values.employee}
                                                onChange={handleSelect('employee')}
                                            >
                                                <option value="">เลือกพนักงานขาย</option>
                                                {empInTeam.map(emp => (
                                                    <option key={emp.SaleEmp} value={emp.SaleEmp}>
                                                        {emp.FName} {emp.LName}{emp.SaleCode ? ` – ${emp.SaleCode}` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-lg-4 mb-3">
                                            <label className={`form-label ${styles.label}`}>ผู้แนะนำ</label>
                                            <select
                                                className={`form-select ${styles.label}`}
                                                value={values.adviser}
                                                onChange={handleSelect('adviser')}
                                            >
                                                <option value="">เลือกผู้แนะนำ</option>
                                                {adviserList.map(emp => (
                                                    <option key={emp.SaleEmp} value={emp.SaleEmp}>
                                                        {emp.FName} {emp.LName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-lg-4 mb-3">
                                            <label className={`form-label ${styles.label} ${styles.required}`}>
                                                พนักงานติดตั้ง
                                            </label>
                                            <select
                                                className={`form-select ${styles.label}`}
                                                value={values.installer}
                                                onChange={handleSelect('installer')}
                                            >
                                                <option value="">เลือกพนักงานติดตั้ง</option>
                                                {installerList.map(emp => (
                                                    <option key={emp.SaleEmp} value={emp.SaleEmp}>
                                                        {emp.FName} {emp.LName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
                    <button
                        className={styles.btnSecondary}
                        onClick={() => navigate('/sale/editFinishInDay', { state: item })}
                    >
                        ย้อนกลับ
                    </button>
                    <button className={styles.btnPrimary} onClick={handleNextClick}>
                        บันทึก
                    </button>
                </div>

                <div
                    className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
                    style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1050 }}
                >
                    <button
                        className={styles.btnSecondary}
                        onClick={() => navigate('/sale/editFinishInDay', { state: item })}
                    >
                        ย้อนกลับ
                    </button>
                    <button className={styles.btnPrimary} onClick={handleNextClick}>
                        บันทึก
                    </button>
                </div>
            </div>
        </Content>
    )
}

export default UpdateSalesEmployeeFinishDay