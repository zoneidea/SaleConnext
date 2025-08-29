// src/pages/UpdateSalesEmployee.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from '@/styles/style.module.css'
import axios from 'axios'
import { Content } from '../../../../_metronic/layout/components/content'
import { useAuth } from '../../../modules/auth/core/Auth'
import { useUUIDStore } from '../../../modules/stores/stepsStore'
import { ThreeDot } from 'react-loading-indicators'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

interface ItemProps {
    REFNO: string
    CONTNO: string
    EMPID: string
    TEAMSALE: string
    SALECODE: string
    SUPEMPID: string
    SECEMPID: string
    STATUS: string
    PRODUCT: any[]
    CUSTOMERSTATUS: any[]
    DISCOUNT: any[]
    SALEEMPLOYEE: any[]
    CUSTOMERDETAIL: any[]
    ADDRESS: any[]
    PDPA: any[]
    CONTRACT: any[]
    IMAGE: any[]
    CHECKERCOMMENT: any[]
}

interface Employee {
    SaleEmp: string
    SaleCode?: string
    FName: string
    LName: string
}

const UpdateSalesEmployee: React.FC = () => {
    const MySwal = withReactContent(Swal)
    const { auth } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const EmpId = auth?.data?.[0]?.EmpId || ''
    const TeamSale = auth?.data?.[0]?.TeamSale || ''
    const SaleCode = auth?.data?.[0]?.SaleCode || ''
    const SupEmpId = auth?.data?.[0]?.SupEmp || ''
    const SecEmpId = auth?.data?.[0]?.SecEmp || ''

    const item = (location.state as ItemProps) || ({} as ItemProps)
    const refno = item.REFNO

    const API_URL_TSR = import.meta.env.VITE_APP_API_THIENSURAT
    const EMP_IN_TEAM_URL = `${API_URL_TSR}/Employee_Structure`
    const ADVISER_URL = `${API_URL_TSR}/Employee_Structure/Emp_Lead`
    const TECHNICAL_URL = `${API_URL_TSR}/Employee_Structure/Emp_Technician`

    const { REFNO: uuidRefno } = useUUIDStore()
    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`
    const DRAFT_ALLCONTRACT_URL =
        `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}&ProcessType=${auth.processtype}`

    // ตัวเลือก
    const [empInTeam, setEmpInTeam] = useState<Employee[]>([])
    const [adviserList, setAdviserList] = useState<Employee[]>([])
    const [installerList, setInstallerList] = useState<Employee[]>([])

    const everyItem =
        empInTeam.length > 0 &&
        adviserList.length > 0 &&
        installerList.length > 0

    // ค่าที่เลือก
    const [values, setValues] = useState({
        employee: '',
        adviser: '',
        installer: ''
    })

    // สถานะ loading + เก็บ draft ทั้งหมด
    const [isLoadingDraft, setIsLoadingDraft] = useState(false)
    const [draft, setDraft] = useState<ItemProps[]>([])

    // ───────────────────────────────────────────────────────────────────────────
    // โหลด draft ทั้งหมด แล้วตั้งค่า default values ให้ select แสดงค่าจาก DB ทันที
    useEffect(() => {
        if (!refno) return

        const fetchDraftAndInit = async () => {
            setIsLoadingDraft(true)
            try {
                const res = await axios.get(DRAFT_ALLCONTRACT_URL)
                const data = Array.isArray(res.data.data) ? res.data.data : []
                setDraft(data)

                const matched = data.find((d: any) => d.REFNO === refno)
                if (matched?.SALEEMPLOYEE?.length) {
                    const rec = matched.SALEEMPLOYEE[0]
                    setValues({
                        employee: rec.SALEEMPLOYEE?.SaleEmp || '',
                        adviser: rec.ADVISER?.SaleEmp || '',
                        installer: rec.INSTALLER?.SaleEmp || '',
                    })
                }
            } catch (error) {
                console.error('Error fetching draft:', error)
                MySwal.fire('Error', 'ไม่สามารถโหลดข้อมูลตั้งต้นได้', 'error')
            } finally {
                setIsLoadingDraft(false)
            }
        }

        fetchDraftAndInit()
    }, [refno])

    // หาของ matchedItem สำหรับนำไปใช้ต่อ (เช่น navigate)
    const matchedItem = draft.find(d => d.REFNO === refno)

    // ───────────────────────────────────────────────────────────────────────────
    // helper โหลดรายชื่อพนักงาน
    const fetchList = useCallback(
        (url: string, setter: React.Dispatch<React.SetStateAction<Employee[]>>) => {
            const form = new FormData()
            form.append("EmpId", EmpId);
            form.append("SaleCode", SaleCode);
            form.append("TeamSale", TeamSale);
            form.append("ProcessType", auth.processtype);
            form.append("DepID", auth?.data?.[0]?.DepID);

            axios
                .post(url, form, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(r => {
                    setter(Array.isArray(r.data.data) ? r.data.data : [])
                })
                .catch(() => {
                    MySwal.fire('Error', 'ไม่สามารถโหลดข้อมูลพนักงานได้', 'error')
                })
        },
        [EmpId, TeamSale, SaleCode]
    )

    // โหลดตัวเลือกเมื่อ EmpId พร้อม
    useEffect(() => {
        if (!EmpId) return
        setIsLoadingDraft(true)
        fetchList(EMP_IN_TEAM_URL, setEmpInTeam)
        fetchList(ADVISER_URL, setAdviserList)
        fetchList(TECHNICAL_URL, setInstallerList)
        setIsLoadingDraft(false)
    }, [EmpId, fetchList])

    // ───────────────────────────────────────────────────────────────────────────
    const handleSelect =
        (key: keyof typeof values) =>
            (e: React.ChangeEvent<HTMLSelectElement>) => {
                setValues(v => ({ ...v, [key]: e.target.value }))
            }

    const handleNextClick = async () => {
        if (!values.employee) {
            return MySwal.fire('Warning', 'กรุณาเลือกพนักงานขายก่อน', 'warning')
        }

        if (!values.installer) {
            return MySwal.fire('Warning', 'กรุณาเลือกพนักงานติดตั้งก่อน', 'warning')
        }

        const payload: any = {
            SALEEMPLOYEE: empInTeam.find(e => e.SaleEmp === values.employee),
            INSTALLER: installerList.find(e => e.SaleEmp === values.installer),
        }

        if (values.adviser) payload.ADVISER = adviserList.find(e => e.SaleEmp === values.adviser)
        if (values.installer) payload.INSTALLER = installerList.find(e => e.SaleEmp === values.installer)

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

            // navigate('/sale/update/updateCustDetail', { state: item })
            navigate('/sale/update/updateCustDetail', { state: matchedItem })
        } catch {
            MySwal.fire('Error', 'ไม่สามารถบันทึกข้อมูลได้', 'error')
        }
    }

    // ───────────────────────────────────────────────────────────────────────────
    return (
        <Content>
            <div className="d-flex justify-content-between align-items-center my-5">
                <div
                    id="kt_page_title"
                    className="page-title d-flex flex-wrap me-3 flex-column justify-content-center"
                >
                    <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                        <li className={styles.titlePage}>แก้ไขพนักงานขาย</li>
                    </ul>
                </div>
            </div>

            <span className={styles.fontSize}>เลขที่ขาย: </span>
            <span className={styles.titlePage}>{item.REFNO}</span>

            <div className="accordion mb-10" id="kt_accordion_1">

                {!everyItem ? (
                    <div className="text-center my-10">
                        <ThreeDot />
                    </div>
                ) : (
                    <div className="accordion-item mb-10">
                        <h2 className="accordion-header" id="kt_accordion_1_header_1">
                            <h3
                                className={`accordion-button collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7 ${styles.fontSize}`}
                                data-bs-toggle="collapse"
                                data-bs-target="#kt_accordion_1_body_1"
                                aria-expanded="true"
                                aria-controls="kt_accordion_1_body_1"
                                style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                            >
                                ข้อมูลพนักงาน
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
                                                            {emp.FName} {emp.LName} – {emp.SaleCode}
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
                                                <label className={`form-label ${styles.label} ${styles.required}`}>พนักงานติดตั้ง</label>
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
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
                    <button
                        className={styles.btnSecondary}
                        onClick={() =>
                            // navigate('/sale/update/updateSalePackage', { state: item })
                            navigate('/sale/update/updateSalePackage', {
                                state: matchedItem
                            })
                        }
                    >
                        แก้ไขแพ็คเกจ
                    </button>
                    <button className={styles.btnPrimary} onClick={handleNextClick}>
                        ถัดไป
                    </button>
                </div>

                <div
                    className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1050,
                    }}
                >
                    <button
                        className={styles.btnSecondary}
                        onClick={() =>
                            // navigate('/sale/update/updateSalePackage', { state: item })
                            navigate('/sale/update/updateSalePackage', {
                                state: matchedItem
                            })
                        }
                    >
                        แก้ไขแพ็คเกจ
                    </button>
                    <button className={styles.btnPrimary} onClick={handleNextClick}>
                        ถัดไป
                    </button>
                </div>
            </div>
        </Content>
    )
}

export default UpdateSalesEmployee
