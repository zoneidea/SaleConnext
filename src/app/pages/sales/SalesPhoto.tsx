import { Link, useLocation, useNavigate } from 'react-router-dom'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/content'

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const SalesPhoto: React.FC = () => {
    const navigate = useNavigate()

    
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
    const location = useLocation() as any;
    const fromStep = location.state?.fromStep || false;
    const item = location.state?.data as ItemProps || [];
    console.log(`item`, item);

    const refno = item?.REFNO

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-1 mt-lg-0'>
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

                <div className='row'>
                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <Link className='card-body d-flex flex-column justify-content-between 
                        bgi-no-repeat bgi-size-cover bgi-position-x-center pb-0'
                            to='/sale/photo/idcard'
                        >
                            <div className='mb-10'>
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
                        </Link>
                    </div>
                    {/* End Card Body */}

                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <Link className='card-body d-flex flex-column justify-content-between 
                        bgi-no-repeat bgi-size-cover bgi-position-x-center pb-0'
                            to='/sale/photo/gallery-gps'
                        >
                            <div className='mb-10'>
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
                        </Link>
                    </div>
                    {/* End Card Body */}

                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <Link
                            className='card-body d-flex flex-column justify-content-between bgi-no-repeat bgi-size-cover bgi-position-x-center pb-0'
                            to='/sale/photo/drawing-map'
                        >
                            <div className='mb-10'>
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
                        </Link>
                    </div>
                    {/* End Card Body */}

                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <Link className='card-body d-flex flex-column justify-content-between 
                        bgi-no-repeat bgi-size-cover bgi-position-x-center pb-0'
                            to='/sale/photo/turn'
                        >
                            <div className='mb-10'>
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
                        </Link>
                    </div>
                    {/* End Card Body */}
                </div>

                <div className='row mb-6'>
                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <Link className='card-body d-flex flex-column justify-content-between 
                        bgi-no-repeat bgi-size-cover bgi-position-x-center pb-0'
                            to='/sale/photo/installation'
                        >
                            <div className='mb-10'>
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
                        </Link>
                    </div>
                    {/* End Card Body */}

                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <Link className='card-body d-flex flex-column justify-content-between 
                        bgi-no-repeat bgi-size-cover bgi-position-x-center pb-0'
                            to='/sale/photo/home-customer'
                        >
                            <div className='mb-10'>
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
                        </Link>
                    </div>
                    {/* End Card Body */}

                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <Link className='card-body d-flex flex-column justify-content-between 
                        bgi-no-repeat bgi-size-cover bgi-position-x-center pb-0'
                            to='/sale/photo/customer'
                        >
                            <div className='mb-10'>
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
                        </Link>
                    </div>
                    {/* End Card Body */}

                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <Link className='card-body d-flex flex-column justify-content-between 
                        bgi-no-repeat bgi-size-cover bgi-position-x-center pb-0'
                            to='/sale/photo/equipment'
                        >
                            <div className='mb-10'>
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
                        </Link>
                    </div>
                    {/* End Card Body */}
                </div>

                {/* แสดงปุ่มเมื่อมาจาก Step */}
                {fromStep ? (
                    <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                        <button
                            className='btn btn-secondary w-100 w-md-auto align-self-center h-50px'
                            // onClick={() => navigate('/sale/step', { state: item })}
                            onClick={() => navigate('/sale/step')}
                        >
                            ย้อนกลับ
                        </button>
                        <button
                            className='btn btn-primary w-100 w-md-auto align-self-center h-50px'
                        // onClick={handleCheckerClick}
                        >
                            ส่งตรวจสอบ
                        </button>
                    </div>
                ) : (
                    <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                        <button
                            className='btn btn-secondary w-100 w-md-auto align-self-center h-50px'
                            // onClick={() => navigate('/sale/step', { state: item })}
                            onClick={() => navigate('/sale/contract')}
                        >
                            ย้อนกลับ
                        </button>
                    </div>
                )}

            </Content>
        </>
    )
}

export default SalesPhoto
