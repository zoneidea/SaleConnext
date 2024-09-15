import { Link } from 'react-router-dom'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/content'
import DeviceSpecificGallery from './components/accessCam/DeviceSpecificGallery';


const SalesGallery: React.FC = () => {
    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-1 mt-lg-0'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            Check Photos
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
                                    Sale
                                </a></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">Check Photos</li>
                        </ul>
                    </div>
                </div>

                <div className='row'>
                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <Link className='card-body d-flex flex-column justify-content-between 
                        bgi-no-repeat bgi-size-cover bgi-position-x-center pb-0'
                            to='/crafted/pages/profile/overview'
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
                            to='/crafted/pages/profile/overview'
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
                            to='/crafted/pages/profile/overview'
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
                            to='/crafted/pages/profile/overview'
                        >
                            <div className='mb-10'>
                                <div className='fw-bold text-gray-800 text-center'>
                                    <span className='position-relative d-inline-block text-dangeropacity-75-hover fs-lg-2 fs-28'>
                                        รูปเครื่องเทริน์
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
                </div>

                <div className='row mb-6'>
                    {/* Card Body */}
                    <div className='card col-lg-3 col-6'>
                        <Link className='card-body d-flex flex-column justify-content-between 
                        bgi-no-repeat bgi-size-cover bgi-position-x-center pb-0'
                            to='/crafted/pages/profile/overview'
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
                            to='/crafted/pages/profile/overview'
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
                            to='/crafted/pages/profile/overview'
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
                            to='/crafted/pages/profile/overview'
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
                                src={toAbsoluteUrl('media/take-a-pic/id-card-pass.svg')}
                                alt=''
                            />
                        </Link>
                    </div>
                    {/* End Card Body */}
                </div>

                <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                    <Link to='/sale/photo' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        ย้อนกลับ
                    </Link>
                </div>
            </Content>
        </>
    )
}

export default SalesGallery
