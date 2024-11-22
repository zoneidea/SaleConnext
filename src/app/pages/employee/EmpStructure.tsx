import { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/content'

import { useAuth } from '../../modules/auth/core/Auth';
import { Commet, ThreeDot } from 'react-loading-indicators'

//useStore
import {
    useFetchCategoryStore,
    useCategoryStore,
    useProductStore,
} from '../../modules/stores/sales/packageStore/packageStore';

const EmpStructure: React.FC = () => {
    const navigate = useNavigate(); // ใช้ useNavigate สำหรับการเปลี่ยนเส้นทาง

    const { auth } = useAuth();

    const [adviser, setAdviser] = useState<any[]>([]);

    const {
        EmpId, setEmpId,
        TeamSale, setTeamSale,
        SaleCode, setSaleCode,
        SupEmpId, setSupEmpId,
        SecEmpId, setSecEmpId,
        DivisionId, setDivisionId,
        DepartId, setDepartId,
        DepartGroup, setDepartGroup,
    } = useCategoryStore();

    const API_THIENSURAT = import.meta.env.VITE_APP_API_THIENSURAT
    const ADVISER_URL = `${API_THIENSURAT}/Employee_Structure/Emp_All`;
    const EMPLOYEE_URL = `${API_THIENSURAT}/Employee_Structure`;

    const [isLoading, setIsLoading] = useState<boolean>(false); // สถานะการโหลด

    useEffect(() => {
        setIsLoading(true); // เริ่มสถานะการโหลด
        setTimeout(async () => {
            try {
                const response = await axios.post(EMPLOYEE_URL,
                    {
                        EmpId: auth.data[0].EmpId,
                    }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setAdviser(data);
                console.log(data)
            } catch (error) {
                console.error('Error fetching ADVISER_URL:', error);
                setAdviser([]); // กำหนดค่าเป็น array ว่าง หากเกิดข้อผิดพลาด
            } finally {
                setIsLoading(false); // ปิดสถานะการโหลดหลังจากเสร็จสิ้น
            }
        }, 1000); // หน่วงเวลา 1 วินาทีก่อนเรียก API
    }, [auth]);

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center my-5'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            พนักงาน
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
                                    โครงสร้างพนักงาน
                                </a></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">พนักงาน</li>
                        </ul>
                    </div>
                </div>

                <div className='accordion' id='kt_accordion_1'>
                    <div className='accordion-item'>
                        <div id='kt_accordion_1_body_1' className='accordion-collapse collapse show' >
                            <div className='accordion-body'>
                                <div className='row gy-5 gx-xl-8'>
                                    <div className='col-xl-12'>
                                        <div className={`card-xxl-stretch px-3`}>

                                            {/* Progress Loader */}
                                            {isLoading && (
                                                <div className="text-center my-10">
                                                    <ThreeDot />
                                                </div>
                                            )}

                                            {!isLoading && adviser.length > 0 && (
                                                <>
                                                    <div className='card-header border-0 pt-5'>
                                                        <h3 className='card-title align-items-start flex-column'>
                                                            <span className='card-label fw-bold fs-3 mb-1'>พนักงานในทีม</span>
                                                            <span className='fw-bold fs-3 mx-1'>{`${adviser.length} คน`}</span>
                                                        </h3>
                                                    </div>
                                                    <div className='card-body py-3'>
                                                        <div className='table-responsive'>
                                                            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                                                                <thead>
                                                                    <tr className='fw-bold text-muted'>
                                                                        <th className='min-w-150px'>ชื่อ นามสกุล</th>
                                                                        <th className='min-w-140px'>ตำแหน่ง</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        adviser.map((v, i) => {
                                                                            return (
                                                                                <tr>
                                                                                    <td>
                                                                                        <div className='d-flex align-items-center'>
                                                                                            <div className='symbol symbol-45px me-5'>
                                                                                                <img src={toAbsoluteUrl('media/avatars/blank.png')} alt='' />
                                                                                            </div>
                                                                                            <div className='d-flex justify-content-start flex-column'>
                                                                                                <a href='#' className='text-gray-900 fw-bold text-hover-primary fs-6'>
                                                                                                    {`${v.FName} ${v.LName}`}
                                                                                                </a>
                                                                                                <span className='text-gray-700 fw-semibold d-block fs-7'>
                                                                                                    {v.SaleEmp}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td>
                                                                                        <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block fs-6'>
                                                                                            {v.PosName}
                                                                                        </a>
                                                                                        <span className='text-gray-700 fw-semibold d-block fs-7'>
                                                                                            {v.PosName2}
                                                                                        </span>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-none d-xl-flex justify-content-between align-items-center mt-5">
                    <Link to='/' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        ย้อนกลับ
                    </Link>
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
                        onClick={() => navigate('/')}
                    >
                        ย้อนกลับ
                    </button>
                </div>

            </Content>
        </>
    )
}

export default EmpStructure