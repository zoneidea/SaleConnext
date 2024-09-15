import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { getLayoutFromLocalStorage, ILayout, LayoutSetup } from '../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'
import { TablesWidget5 } from '../../../_metronic/partials/widgets'

const SalesReceipt: React.FC = () => {
    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-1 mt-lg-0'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            Receipt
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
                                    Sale
                                </a></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">Receipt</li>
                        </ul>
                    </div>
                </div>

                {/* Card Body */}
                <div className='card mb-10'>
                    <div className='card-body py-5'>

                        {/* begin::Header */}
                        <div className='d-flex justify-content-between align-items-center mb-7 mt-5'>
                            <h3 className='card-title'>ใบเสร็จรับเงิน</h3>
                            <button
                                type='button'
                                className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                            >
                                <KTIcon iconName='category' className='fs-2' />
                            </button>
                        </div>
                        {/* end::Header */}

                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bold text-muted'>วันที่รับเงิน</label>
                            <div className='col-lg-8'>
                                <span className='fw-bolder fs-6 text-gray-900'>22/07/2024</span>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bold text-muted'>เลขที่</label>
                            <div className='col-lg-8 fv-row'>
                                <span className='fw-bold fs-6'>6105846</span>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bold text-muted'>เลขที่สัญญา</label>
                            <div className='col-lg-8 d-flex align-items-center'>
                                <span className='fw-bolder fs-6 me-2'>6105846</span>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bold text-muted'>วันที่ทำสัญญา</label>
                            <div className='col-lg-8'>
                                <a href='#' className='fw-bold fs-6 text-gray-900 text-hover-primary'>
                                    keenthemes.com
                                </a>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bold text-muted'>ชื่อลูกค้า</label>
                            <div className='col-lg-8'>
                                <span className='fw-bolder fs-6 text-gray-900'>Germany</span>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bold text-muted'>เลขที่บัตร</label>
                            <div className='col-lg-8'>
                                <span className='fw-bolder fs-6 text-gray-900'>Email, Phone</span>
                            </div>
                        </div>

                        <div className='row mb-10'>
                            <label className='col-lg-4 fw-bold text-muted'>ที่อยู่ติดตั้ง</label>
                            <div className='col-lg-8'>
                                <span className='fw-bold fs-6'>Yes</span>
                            </div>
                        </div>

                        <div className='row mb-10'>
                            <label className='col-lg-4 fw-bold text-muted'>ชื่อสินค้า</label>
                            <div className='col-lg-8'>
                                <span className='fw-bold fs-6'>Yes</span>
                            </div>
                        </div>

                        <div className='row mb-10'>
                            <label className='col-lg-4 fw-bold text-muted'>รุ่น</label>
                            <div className='col-lg-8'>
                                <span className='fw-bold fs-6'>Yes</span>
                            </div>
                        </div>

                        <div className='row mb-10'>
                            <label className='col-lg-4 fw-bold text-muted'>รหัสสินค้า</label>
                            <div className='col-lg-8'>
                                <span className='fw-bold fs-6'>Yes</span>
                            </div>
                        </div>

                        <div className='row mb-10'>
                            <label className='col-lg-4 fw-bold text-muted'>ค่างวดที่ 1 / 12</label>
                            <div className='col-lg-8'>
                                <span className='fw-bold fs-6'>Yes</span>
                            </div>
                        </div>

                        <div className='row mb-10'>
                            <label className='col-lg-4 fw-bold text-muted'>ค่าเหลืองวดที่ 2 ถึง 12</label>
                            <div className='col-lg-8'>
                                <span className='fw-bold fs-6'>Yes</span>
                            </div>
                        </div>

                    </div>
                </div>
                {/* End Card Body */}

                <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                    <Link to='/sale/overview' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        ย้อนกลับ
                    </Link>
                    <button className='btn btn-primary w-100 w-md-auto align-self-center'
                        data-bs-toggle="modal"
                        data-bs-target="#kt_modal_1"
                    >
                        ยืนยัน
                    </button>
                </div>

            </Content>
        </>
    )
}

export default SalesReceipt
