import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/content'

const SalesProduct: React.FC = () => {
    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-1 mt-lg-0'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            ตรวจสอบสินค้า
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
                                    ระบบขาย
                                </a></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">ตรวจสอบสินค้า</li>
                        </ul>
                    </div>
                </div>

                {/* Card Body */}
                <div className='card mb-10'>
                    <div className='card-body py-5'>

                        {/* begin::Header */}
                        <div className='d-flex justify-content-between align-items-center mb-7 mt-5'>
                            <h3 className='card-title'>ตรวจสอบข้อมูลสินค้า</h3>
                            <button
                                type='button'
                                className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                            >
                                <KTIcon iconName='category' className='fs-2' />
                            </button>
                        </div>
                        {/* end::Header */}

                        <div className='col-xl-12'>
                            <div className='col-12 col-sm-12 col-xl'>

                                {/* begin::Item */}
                                <div className='d-flex align-items-sm-center mb-7 mt-7'>
                                    {/* begin::Symbol */}
                                    <div className='symbol symbol-60px symbol-2by3 me-4'>
                                        <div
                                            className='symbol-label'
                                            style={{ backgroundImage: `url(${toAbsoluteUrl('media/stock/600x400/img-20.jpg')})` }}
                                        ></div>
                                    </div>
                                    {/* end::Symbol */}
                                    {/* begin::Title */}
                                    <div className='d-flex flex-row-fluid flex-wrap align-items-center'>
                                        <div className='flex-grow-1 me-2'>
                                            <a href='#' className='text-gray-800 fw-bold text-hover-primary fs-6'>
                                                รหัสสินค้า
                                            </a>
                                            <span className='text-muted fw-semibold d-block pt-1'>UA036453</span>
                                        </div>
                                    </div>
                                    {/* end::Title */}
                                </div>
                                {/* end::Item */}

                                {/* begin::Item */}
                                <div className='d-flex align-items-sm-center mb-7 mt-7'>
                                    {/* begin::Symbol */}
                                    <div className='symbol symbol-60px symbol-2by3 me-4'>
                                        <div
                                            className='symbol-label'
                                            style={{ backgroundImage: `url(${toAbsoluteUrl('media/stock/600x400/img-20.jpg')})` }}
                                        ></div>
                                    </div>
                                    {/* end::Symbol */}
                                    {/* begin::Title */}
                                    <div className='d-flex flex-row-fluid flex-wrap align-items-center'>
                                        <div className='flex-grow-1 me-2'>
                                            <a href='#' className='text-gray-800 fw-bold text-hover-primary fs-6'>
                                                ชื่อสินค้า
                                            </a>
                                            <span className='text-muted fw-semibold d-block pt-1'>เครื่องกรองน้ำ</span>
                                        </div>
                                    </div>
                                    {/* end::Title */}
                                </div>
                                {/* end::Item */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                    <Link to='/sale/package' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        ย้อนกลับ
                    </Link>
                    <Link to='/sale/statuscust' className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        ถัดไป
                    </Link>
                </div>

                {/* End Card Body */}
            </Content>
        </>
    )
}

export default SalesProduct
