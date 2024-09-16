import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/content'
import { DatePickerValue } from './components/dateTimePicker/DatePickerValue.js'
import { TimePickerValue } from './components/dateTimePicker/TimePickerValue.js'

const SalesAddCustInfo: React.FC = () => {
    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-1 mt-lg-0'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            ข้อมูลลูกค้าเพิ่มเติม
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
                                    ระบบขาย
                                </a></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">ข้อมูลลูกค้าเพิ่มเติม</li>
                        </ul>
                    </div>
                </div>

                {/* Card Body */}
                <div className='accordion' id='kt_accordion_1'>

                    <div className='accordion-item mb-10'>
                        <h2 className='accordion-header' id='kt_accordion_1_header_1'>
                            <h3
                                className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                data-bs-toggle='collapse'
                                data-bs-target='#kt_accordion_1_body_1'
                                aria-expanded='false'
                                aria-controls='kt_accordion_1_body_1'
                                style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                            >
                                รายละเอียดลูกค้าเพิ่มเติม
                            </h3>
                        </h2>
                        <div
                            id='kt_accordion_1_body_1'
                            className='accordion-collapse collapse'
                            aria-labelledby='kt_accordion_1_header_1'
                            data-bs-parent='#kt_accordion_1'
                        >
                            <div className='accordion-body'>
                                {/* start form */}
                                <form noValidate className='form'>
                                    <div className='card-body px-lg-9 px-1'>

                                        <div className='row mb-6'>
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>สถานภาพ</label>
                                                <select className='form-select form-select-solid form-select-lg'>
                                                    <option value=''>เลือกสถานภาพ...</option>
                                                    <option value='AF'>Afghanistan</option>
                                                </select>
                                            </div>
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>สถานะที่อยู่อาศัย</label>
                                                <select className='form-select form-select-solid form-select-lg'>
                                                    <option value=''>เลือกสถานะที่อยู่อาศัย...</option>
                                                    <option value='AF'>Afghanistan</option>
                                                </select>
                                            </div>
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>ระยะเวลาที่อยู่อาศัย</label>
                                                <select className='form-select form-select-solid form-select-lg'>
                                                    <option value=''>เลือกระยะเวลาที่อยู่อาศัย...</option>
                                                    <option value='AF'>Afghanistan</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className='row mb-6'>
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>อาชีพ</label>
                                                <select className='form-select form-select-solid form-select-lg'>
                                                    <option value=''>เลือกอาชีพ...</option>
                                                    <option value='AF'>Afghanistan</option>
                                                </select>
                                            </div>
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>อายุงาน</label>
                                                <select className='form-select form-select-solid form-select-lg'>
                                                    <option value=''>เลือกอายุงาน...</option>
                                                    <option value='AF'>Afghanistan</option>
                                                </select>
                                            </div>
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>รายได้ต่อเดือน</label>
                                                <select className='form-select form-select-solid form-select-lg'>
                                                    <option value=''>เลือกรายได้ต่อเดือน...</option>
                                                    <option value='AF'>Afghanistan</option>
                                                </select>
                                            </div>
                                        </div>

                                    </div>
                                </form>
                                {/* end form */}
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Card Body */}

                {/* Card Body */}
                <div className='accordion mb-10' id='kt_accordion_2'>

                    <div className='accordion-item mb-10'>
                        <h2 className='accordion-header' id='kt_accordion_2_header_2'>
                            <h3
                                className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                data-bs-toggle='collapse'
                                data-bs-target='#kt_accordion_2_body_2'
                                aria-expanded='false'
                                aria-controls='kt_accordion_2_body_2'
                                style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                            >
                                รายละเอียดการติดตั้งเพิ่มเติม
                            </h3>
                        </h2>
                        <div
                            id='kt_accordion_2_body_2'
                            className='accordion-collapse collapse'
                            aria-labelledby='kt_accordion_2_header_2'
                            data-bs-parent='#kt_accordion_2'
                        >
                            <div className='accordion-body'>
                                {/* start form */}
                                <form noValidate className='form'>
                                    <div className='card-body px-lg-9 px-1'>

                                        <div className='row mb-6'>
                                            <label className='form-label required fw-bold fs-6 mb-7'>ผู้ทำสัญญา</label>
                                            <div className='col-lg-6 mb-3'>
                                                <div className="form-check">
                                                    <input
                                                        className='form-check-input'
                                                        name='contractor'
                                                        type='radio'
                                                        id='teamSales1'
                                                        value='teamSales1'
                                                    />
                                                    <label className='form-check-label fw-bold ps-2 fs-6'
                                                        htmlFor='teamSales1' style={{ color: '#000000' }}>
                                                        ทีมขาย
                                                    </label>
                                                </div>
                                            </div>
                                            <div className='col-lg-6 mb-3'>
                                                <div className="form-check">
                                                    <input
                                                        className='form-check-input'
                                                        name='contractor'
                                                        type='radio'
                                                        id='installer1'
                                                        value='installer1'
                                                    />
                                                    <label className='form-check-label fw-bold ps-2 fs-6'
                                                        htmlFor='installer1' style={{ color: '#000000' }}>
                                                        ช่างติดตั้ง
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row mb-6'>
                                            <label className='form-label required fw-bold fs-6 mb-7'>ผู้ติดตั้ง</label>
                                            <div className='col-lg-6 mb-3'>
                                                <div className="form-check">
                                                    <input
                                                        className='form-check-input'
                                                        name='installer'
                                                        type='radio'
                                                        id='teamSales2'
                                                        value='teamSales2'
                                                    />
                                                    <label className='form-check-label fw-bold ps-2 fs-6'
                                                        htmlFor='teamSales2' style={{ color: '#000000' }}>
                                                        ทีมขายติดตั้งเอง
                                                    </label>
                                                </div>
                                            </div>
                                            <div className='col-lg-6 mb-3'>
                                                <div className="form-check">
                                                    <input
                                                        className='form-check-input'
                                                        name='installer'
                                                        type='radio'
                                                        id='installer2'
                                                        value='installer2'
                                                    />
                                                    <label className='form-check-label fw-bold ps-2 fs-6'
                                                        htmlFor='installer2' style={{ color: '#000000' }}>
                                                        ช่างติดตั้ง
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row mb-6'>
                                            <label className='form-label required fw-bold fs-6 mb-7'>วันเวลาที่ลูกค้าสะดวกนัดติดตั้ง</label>
                                            <div className='col-lg-6 mb-3'>
                                                <div className="row">
                                                    <DatePickerValue />
                                                </div>
                                            </div>
                                            <div className='col-lg-6 mb-3'>
                                                <div className="row">
                                                    <TimePickerValue />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row mb-6'>
                                            <div className='col-lg-6 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>ข้อมูลน้ำดิบ</label>
                                                <select className='form-select form-select-solid form-select-lg'>
                                                    <option value=''>กรุณาเลือก...</option>
                                                    <option value='AF'>Afghanistan</option>
                                                </select>
                                            </div>
                                            <div className='col-lg-6 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>ปัญหาสภาพน้ำที่ต้องการเน้นเป็นพิเศษ</label>
                                                <select className='form-select form-select-solid form-select-lg'>
                                                    <option value=''>กรุณาเลือก...</option>
                                                    <option value='AF'>Afghanistan</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className='row mb-6'>
                                            <label className='form-label required fw-bold fs-6 mb-7'>ผู้จัดส่งสินค้า</label>
                                            <div className='col-lg-6 mb-3'>
                                                <div className="form-check">
                                                    <input
                                                        className='form-check-input'
                                                        name='installer'
                                                        type='radio'
                                                        id='teamSales2'
                                                        value='teamSales2'
                                                    />
                                                    <label className='form-check-label fw-bold ps-2 fs-6'
                                                        htmlFor='teamSales2' style={{ color: '#000000' }}>
                                                        ทีมขายจัดส่งสินค้าเอง
                                                    </label>
                                                </div>
                                            </div>
                                            <div className='col-lg-6 mb-3'>
                                                <div className="form-check">
                                                    <input
                                                        className='form-check-input'
                                                        name='installer'
                                                        type='radio'
                                                        id='installer2'
                                                        value='installer2'
                                                    />
                                                    <label className='form-check-label fw-bold ps-2 fs-6'
                                                        htmlFor='installer2' style={{ color: '#000000' }}>
                                                        คลังจัดส่งสินค้า
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row mb-6'>
                                            <div className='col-lg-12 mb-3'>
                                                <label className='form-label fw-bold fs-6'>ข้อมูลควรทราบอื่น ๆ เรื่องการติดตั้ง</label>
                                                <input
                                                    type='text'
                                                    className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    placeholder='ระบุ'
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </form>
                                {/* end form */}
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Card Body */}

                <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                    <Link to='/sale' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        ยกเลิก
                    </Link>
                    <Link to='/sale/createcust' className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        บันทึกข้อมูล
                    </Link>
                </div>
            </Content>
        </>
    )
}

export default SalesAddCustInfo
