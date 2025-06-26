import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from '@/styles/style.module.css'
import axios from 'axios'
import { Content } from '../../../_metronic/layout/components/content'
import { useAuth } from '../../modules/auth/core/Auth'
import { useUUIDStore } from '../../modules/stores/stepsStore'
import { ThreeDot } from 'react-loading-indicators';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

interface Employee {
    SaleEmp: string
    SaleCode?: string
    FName: string
    LName: string
}

const SalesEmployee: React.FC = () => {
    const MySwal = withReactContent(Swal)
    const { auth } = useAuth()
    const navigate = useNavigate();

    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const API_URL_TSR = import.meta.env.VITE_APP_API_THIENSURAT
    const EMP_IN_TEAM_URL = `${API_URL_TSR}/Employee_Structure`
    const ADVISER_URL = `${API_URL_TSR}/Employee_Structure/Emp_Lead`
    const TECHNICAL_URL = `${API_URL_TSR}/Employee_Structure/Emp_Technician`

    const { REFNO } = useUUIDStore()
    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
    const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`;

    const [empInTeam, setEmpInTeam] = useState<Employee[]>([])
    const [adviserList, setAdviserList] = useState<Employee[]>([])
    const [installerList, setInstallerList] = useState<Employee[]>([])

    const [values, setValues] = useState({ employee: '', adviser: '', installer: '' })

    const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false);
    const [draft, setDraft] = useState<any[]>([]);

    useEffect(() => {
        const getDataDraft = async () => {
            setIsLoadingDraft(true);
            try {
                const response = await axios.get(DRAFT_ALLCONTRACT_URL);
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setDraft(data);
            } catch (error) {
                console.error('Error fetching DRAFT_ALLCONTRACT_URL:', error);
            } finally {
                setIsLoadingDraft(false);
            }
        };
        getDataDraft();
    }, []);

    // เลือก item ที่ REFNO ตรงกัน (find สำหรับ 1 item หรือ filter สำหรับหลาย item)
    const matchedItem = draft.find(item => item.REFNO === REFNO);
    console.log(`matchedItem`, matchedItem);

    const fetchList = useCallback(async (url: string, setter: React.Dispatch<React.SetStateAction<Employee[]>>) => {
        try {
            const formData = new FormData()
            formData.append('EmpId', EmpId);
            formData.append('SaleCode', SaleCode);
            formData.append('TeamSale', TeamSale);

            const resp = await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            const data = Array.isArray(resp.data.data) ? resp.data.data : []
            setter(data)
        } catch (err) {
            MySwal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถโหลดข้อมูลได้' })
        }
    }, [EmpId])

    // โหลดตัวเลือกเมื่อ EmpId พร้อม
    useEffect(() => {
        if (!EmpId) return
        setIsLoadingDraft(true)
        fetchList(EMP_IN_TEAM_URL, setEmpInTeam)
        fetchList(ADVISER_URL, setAdviserList)
        fetchList(TECHNICAL_URL, setInstallerList)
        setIsLoadingDraft(false)
    }, [EmpId, fetchList])

    const handleSelect = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValues(v => ({ ...v, [key]: e.target.value }))
        // TODO: บันทึกค่าไปยัง API หากต้องการบันทึกทันที
    }

    const handleNextClick = async () => {
        if (!values.employee) {
            MySwal.fire('Warning', 'กรุณาเลือกพนักงานขายก่อน', 'warning')
            return
        }

        if (!values.installer) {
            return MySwal.fire('Warning', 'กรุณาเลือกพนักงานติดตั้งก่อน', 'warning')
        }

        // เตรียม payload
        const payload: any = {
            SALEEMPLOYEE: empInTeam.find(emp => emp.SaleEmp === values.employee),
            INSTALLER: installerList.find(e => e.SaleEmp === values.installer),
        }

        if (values.adviser) payload.ADVISER = adviserList.find(e => e.SaleEmp === values.adviser)
        if (values.installer) payload.INSTALLER = installerList.find(e => e.SaleEmp === values.installer)

        try {
            await axios.post(UPDATECONTACT, {
                REFNO,
                EMPID: EmpId,
                TEAMSALE: TeamSale,
                SALECODE: SaleCode,
                SUPEMPID: SupEmpId,
                SECEMPID: SecEmpId,
                FIELD: 'SALEEMPLOYEE',
                DATA: [payload],
            })
            await MySwal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                timer: 2000,
                showConfirmButton: false,
            });
            navigate('/sale/createcust-cash')
        } catch {
            MySwal.fire('Error', 'ไม่สามารถบันทึกข้อมูลได้', 'error')
        }
    }

    return (
        <Content>
            <div className='d-flex justify-content-between align-items-center my-5'>
                <div
                    id="kt_page_title"
                    data-kt-swapper="true"
                    data-kt-swapper-mode="prepend"
                    data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                    className="page-title d-flex flex-wrap me-3 flex-column justify-content-center"
                >
                    <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                        <li className={styles.titlePage}>เลือกพนักงานขาย</li>
                    </ul>
                </div>
            </div>
            <span className={styles.fontSize}>เลขที่ขาย: </span>
            <span className={styles.titlePage}>{REFNO}</span>

            <div className='accordion mb-10' id='kt_accordion_1'>
                <div className='accordion-item mb-10'>
                    <h2 className='accordion-header' id='kt_accordion_1_header_1'>
                        <h3
                            className={`accordion-button collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7 ${styles.fontSize}`}
                            data-bs-toggle='collapse'
                            data-bs-target='#kt_accordion_1_body_1'
                            aria-expanded='true'
                            aria-controls='kt_accordion_1_body_1'
                            style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                        >
                            ข้อมูลพนักงาน
                        </h3>
                    </h2>
                    <div
                        id='kt_accordion_1_body_1'
                        className='accordion-collapse collapse show'
                        aria-labelledby='kt_accordion_1_header_1'
                        data-bs-parent='#kt_accordion_1'
                    >
                        <div className='accordion-body'>
                            <form noValidate className='form'>
                                <div className='card-body px-lg-9 px-1'>
                                    <div className="row mb-6">

                                        <div className="col-lg-4 mb-3">
                                            <label className={`form-label ${styles.label} ${styles.required}`}>พนักงานขาย</label>
                                            <select
                                                className={`form-select ${styles.label}`}
                                                value={values.employee}
                                                onChange={handleSelect('employee')}
                                            >
                                                <option value="">เลือกพนักงานขาย</option>
                                                {empInTeam.map(emp => (
                                                    <option key={emp.SaleEmp} value={emp.SaleEmp}>
                                                        {emp.FName} {emp.LName} - {emp.SaleCode}
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

                <div className='d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10'>
                    <button
                        className={`${styles.btnSecondary}`}
                        onClick={() => navigate('/sale/update/updateSalePackage', {
                            state: {
                                ...matchedItem,
                                fromDiscount: true,
                            }
                        })}
                    >
                        แก้ไขแพ็คเกจ
                    </button>
                    <button
                        className={`${styles.btnPrimary}`}
                        onClick={handleNextClick}
                    >
                        บันทึก
                    </button>
                </div>

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
                        className={`${styles.btnSecondary}`}
                        onClick={() => navigate('/sale/update/updateSalePackage', {
                            state: {
                                ...matchedItem,
                                fromDiscount: true,
                            }
                        })}
                    >
                        แก้ไขแพ็คเกจ
                    </button>
                    <button
                        className={`${styles.btnPrimary}`}
                        onClick={handleNextClick}
                    >
                        บันทึก
                    </button>
                </div>

            </div>
        </Content>
    )
}

export default SalesEmployee