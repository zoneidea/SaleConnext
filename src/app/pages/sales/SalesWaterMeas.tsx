import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/content'

const SalesWaterMeas: React.FC = () => {
    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-1 mt-lg-0'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            ข้อมูลคุณภาพน้ำ
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
                                    ระบบขาย
                                </a></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">ข้อมูลคุณภาพน้ำ</li>
                        </ul>
                    </div>
                </div>

                {/* Card Body */}
                <div className='card mb-5 mb-xl-10'>
                    {/* start form */}
                    <form noValidate className='form'>
                        <div className='card-body border-top p-9'>

                            <div className='row mb-6'>
                                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                                    <span className='required'>ข้อมูลน้ำดิบ</span>
                                </label>
                                <div className='col-lg-8 fv-row'>
                                    <select
                                        className='form-select form-select-solid form-select-lg'
                                    >
                                        <option value=''>กรุณาเลือก...</option>
                                        <option value='AF'>Afghanistan</option>
                                    </select>
                                </div>
                            </div>

                            <div className='row mb-6'>
                                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                                    <span className='required'>TDS</span>
                                </label>
                                <div className='col-lg-8 fv-row'>
                                    <input
                                        type='text'
                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                        placeholder='ผลทดสอบ TDS'
                                    />
                                </div>
                            </div>

                        </div>
                    </form>
                    {/* end form */}
                </div>
                {/* End Card Body */}

                <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                    <Link to='/sale/hirepurchaseagmt' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        ย้อนกลับ
                    </Link>
                    <Link to='/sale/photo' className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        บันทึกข้อมูล
                    </Link>
                </div>
            </Content>
        </>
    )
}

export default SalesWaterMeas
