import { Link, useLocation, useNavigate } from 'react-router-dom'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/content'
import axios from 'axios';
import { useAuth } from '../../modules/auth/core/Auth';
import { useUUIDStore } from '../../modules/stores/stepsStore';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const SalesPhoto: React.FC = () => {
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal);

    // สร้างใหม่
    const { REFNO } = useUUIDStore();
    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

    // อัพเดท
    interface ItemProps {
        REFNO: string,
        CONTNO: string,
        EMPID: string,
        TEAMSALE: string,
        SALECODE: string,
        SUPEMPID: string,
        SECEMPID: string,
        STATUS: string,
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
    const location = useLocation() as any;
    const fromStep = location.state?.fromStep || false;
    console.log(`fromStep`, fromStep);
    const item = location.state?.data as ItemProps || [];
    console.log(`item`, item);

    // กำหนด REFNO
    const refno = fromStep ? item.REFNO : REFNO;

    // สร้างใหม่ ส่งตรวจสอบ
    const handleCheckerClick = async () => {
        const response = await axios.post(UPDATECONTACT, {
            REFNO: REFNO,
            EMPID: EmpId,
            TEAMSALE: TeamSale,
            FIELD: "STATUS",
            DATA: "PENDING",
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(response)

        if (response.status === 200) {
            if (!response.data.data) {
                MySwal.fire('เกิดข้อผิดพลาด', 'ส่งข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา', 'error');
            } else {
                MySwal.fire('สำเร็จ', 'ส่งข้อมูลตรวจสอบแล้ว', 'success');
                navigate('/sale/overview')
            }
        } else {
            MySwal.fire('เกิดข้อผิดพลาด', response.data.message, 'error');
        }
    }

    // อัพเดต มาจากขั้นตอน step ส่งตรวจสอบ
    const handleUpdateCheckerClick = async () => {
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

        console.log(response)

        if (response.status === 200) {
            if (!response.data.data) {
                MySwal.fire('เกิดข้อผิดพลาด', 'ส่งข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา', 'error');
            } else {
                MySwal.fire('สำเร็จ', 'ส่งข้อมูลตรวจสอบแล้ว', 'success');
                navigate('/sale/overview')
            }
        } else {
            MySwal.fire('เกิดข้อผิดพลาด', response.data.message, 'error');
        }
    }

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center my-5'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            ถ่ายรูป
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <span className="text-muted text-hover-primary">
                                    ระบบขาย
                                </span></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">ถ่ายรูป</li>
                        </ul>
                    </div>
                </div>
                <p>เลขที่ขาย: {refno}</p>

                <div className='row'>
                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                color: 'inherit',
                                cursor: 'pointer',
                                fontSize: 'inherit',
                            }}
                            onClick={() => navigate('/sale/photo/idcard', { state: { fromStep, data: item } })}
                        >
                            <div className='mb-10 mt-7'>
                                <div className='fw-bold text-gray-800 text-center'>
                                    <span className='position-relative d-inline-block text-dangeropacity-75-hover fs-lg-2 fs-28'>
                                        รูปบัตรประชาชน
                                    </span>
                                </div>
                            </div>
                            <img
                                className='mx-auto h-100px h-lg-150px theme-light-show'
                                src={toAbsoluteUrl('media/take-a-pic/id-card-pass.svg')}
                                alt=''
                            />
                        </button>
                    </div>
                    {/* End Card Body */}

                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                color: 'inherit',
                                cursor: 'pointer',
                                fontSize: 'inherit',
                            }}
                            onClick={() => navigate('/sale/photo/gallery-gps', { state: { fromStep, data: item } })}
                        >
                            <div className='mb-10 mt-7'>
                                <div className='fw-bold text-gray-800 text-center'>
                                    <span className='position-relative d-inline-block text-dangeropacity-75-hover fs-lg-2 fs-28'>
                                        รูปแผนที่ GPS
                                    </span>
                                </div>
                            </div>
                            <img
                                className='mx-auto h-100px h-lg-150px theme-light-show'
                                src={toAbsoluteUrl('media/take-a-pic/map-gps-svgrepo-com.svg')}
                                alt=''
                            />
                        </button>
                    </div>
                    {/* End Card Body */}

                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                color: 'inherit',
                                cursor: 'pointer',
                                fontSize: 'inherit',
                            }}
                            onClick={() => navigate('/sale/photo/drawing-map', { state: { fromStep, data: item } })}
                        >
                            <div className='mb-10 mt-7'>
                                <div className='fw-bold text-gray-800 text-center'>
                                    <span className='position-relative d-inline-block text-dangeropacity-75-hover fs-lg-2 fs-28'>
                                        รูปวาดแผนที่
                                    </span>
                                </div>
                            </div>
                            <img
                                className='mx-auto h-100px h-lg-150px theme-light-show'
                                src={toAbsoluteUrl('media/take-a-pic/map-svgrepo-com.svg')}
                                alt=''
                            />
                        </button>
                    </div>
                    {/* End Card Body */}

                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                color: 'inherit',
                                cursor: 'pointer',
                                fontSize: 'inherit',
                            }}
                            onClick={() => navigate('/sale/photo/turn', { state: { fromStep, data: item } })}
                        >
                            <div className='mb-10 mt-7'>
                                <div className='fw-bold text-gray-800 text-center'>
                                    <span className='position-relative d-inline-block text-dangeropacity-75-hover fs-lg-2 fs-28'>
                                        รูปเครื่องเทิร์น
                                    </span>
                                </div>
                            </div>
                            <img
                                className='mx-auto h-100px h-lg-150px theme-light-show'
                                src={toAbsoluteUrl('media/take-a-pic/water-svgrepo-com.svg')}
                                alt=''
                            />
                        </button>
                    </div>
                    {/* End Card Body */}
                </div>

                <div className='row mb-6'>
                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                color: 'inherit',
                                cursor: 'pointer',
                                fontSize: 'inherit',
                            }}
                            onClick={() => navigate('/sale/photo/installation', { state: { fromStep, data: item } })}
                        >
                            <div className='mb-10 mt-7'>
                                <div className='fw-bold text-gray-800 text-center'>
                                    <span className='position-relative d-inline-block text-dangeropacity-75-hover fs-lg-2 fs-28'>
                                        รูปติดตั้งเครื่อง
                                    </span>
                                </div>
                            </div>
                            <img
                                className='mx-auto h-100px h-lg-150px theme-light-show'
                                src={toAbsoluteUrl('media/take-a-pic/setting-configuration-gear-svgrepo-com.svg')}
                                alt=''
                            />
                        </button>
                    </div>
                    {/* End Card Body */}

                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                color: 'inherit',
                                cursor: 'pointer',
                                fontSize: 'inherit',
                            }}
                            onClick={() => navigate('/sale/photo/home-customer', { state: { fromStep, data: item } })}
                        >
                            <div className='mb-10 mt-7'>
                                <div className='fw-bold text-gray-800 text-center'>
                                    <span className='position-relative d-inline-block text-dangeropacity-75-hover fs-lg-2 fs-28'>
                                        รูปบ้านลูกค้า
                                    </span>
                                </div>
                            </div>
                            <img
                                className='mx-auto h-100px h-lg-150px theme-light-show'
                                src={toAbsoluteUrl('media/take-a-pic/home-house-svgrepo-com.svg')}
                                alt=''
                            />
                        </button>
                    </div>
                    {/* End Card Body */}

                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                color: 'inherit',
                                cursor: 'pointer',
                                fontSize: 'inherit',
                            }}
                            onClick={() => navigate('/sale/photo/customer', { state: { fromStep, data: item } })}
                        >
                           <div className='mb-10 mt-7'>
                                <div className='fw-bold text-gray-800 text-center'>
                                    <span className='position-relative d-inline-block text-dangeropacity-75-hover fs-lg-2 fs-28'>
                                        รูปลูกค้า
                                    </span>
                                </div>
                            </div>
                            <img
                                className='mx-auto h-100px h-lg-150px theme-light-show'
                                src={toAbsoluteUrl('media/take-a-pic/person-boy-svgrepo-com.svg')}
                                alt=''
                            />
                        </button>
                    </div>
                    {/* End Card Body */}

                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                color: 'inherit',
                                cursor: 'pointer',
                                fontSize: 'inherit',
                            }}
                            onClick={() => navigate('/sale/photo/equipment', { state: { fromStep, data: item } })}
                        >
                           <div className='mb-10 mt-7'>
                                <div className='fw-bold text-gray-800 text-center'>
                                    <span className='position-relative d-inline-block text-dangeropacity-75-hover fs-lg-2 fs-28'>
                                        รูปอุปกรณ์วัดค่าน้ำ
                                    </span>
                                </div>
                            </div>
                            <img
                                className='mx-auto h-100px h-lg-150px theme-light-show'
                                src={toAbsoluteUrl('media/take-a-pic/water-water-svgrepo-com.svg')}
                                alt=''
                            />
                        </button>
                    </div>
                    {/* End Card Body */}
                </div>

                {/* แสดงปุ่มเมื่อมาจาก Step */}
                {fromStep ? (
                    <div className='d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10'>
                        <button
                            className='btn btn-secondary w-100 w-md-auto align-self-center h-50px'
                            onClick={() => navigate('/sale/step', { state: item })}
                        >
                            ย้อนกลับ
                        </button>
                        <button
                            className='btn btn-primary w-100 w-md-auto align-self-center h-50px'
                            onClick={handleUpdateCheckerClick}
                        >
                            ส่งตรวจสอบ
                        </button>
                    </div>
                ) : (
                    <div className='d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10'>
                        <button
                            className='btn btn-secondary w-100 w-md-auto align-self-center h-50px'
                            onClick={() => navigate('/sale/overview')}
                        >
                            กลับหน้าแรก
                        </button>
                        <button
                            className='btn btn-primary w-100 w-md-auto align-self-center h-50px'
                            onClick={handleCheckerClick}
                        >
                            ส่งตรวจสอบ
                        </button>
                    </div>
                )}

                {/* ปุ่มในหน้าจอเล็ก */}
                {/* แสดงปุ่มเมื่อมาจาก Step */}
                {fromStep ? (
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
                            className="btn btn-primary w-auto me-2"
                            onClick={handleUpdateCheckerClick}
                        >
                            ส่งตรวจสอบ
                        </button>
                    </div>
                ) : (
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
                            onClick={() => navigate('/sale/overview')}
                        >
                            กลับหน้าแรก
                        </button>
                        <button
                            className="btn btn-primary w-auto me-2"
                            onClick={handleCheckerClick}
                        >
                            ส่งตรวจสอบ
                        </button>
                    </div>
                )}

            </Content>
        </>
    )
}

export default SalesPhoto
