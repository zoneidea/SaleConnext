import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/content'

const SalesDiscount: React.FC = () => {
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [labelText, setLabelText] = useState('ราคาสุทธิ');

    const handleTurnOptionChange = (event: any) => {
        const isTurnOption = event.target.value === 'turn';
        setShowAdditionalFields(isTurnOption);
        setLabelText(isTurnOption ? 'ส่วนลด' : 'ราคาสุทธิ');
    };

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-1 mt-lg-0'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            ส่วนลด / เครื่องเทิร์น / ของแถม
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
                                    ระบบขาย
                                </a></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">ส่วนลด / เครื่องเทิร์น / ของแถม</li>
                        </ul>
                    </div>
                </div>

                {/* Card Body */}
                <div className='accordion mb-10' id='kt_accordion_1'>

                    {/* Start accordion */}
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
                                ส่วนลด / เทิร์น / ของแถม
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
                                                <label className='form-label required fw-bold fs-6'>เครื่องแสดง</label>
                                                <select
                                                    className='form-select form-select-solid form-select-lg'
                                                    onChange={handleTurnOptionChange}
                                                >
                                                    <option value=''>ไม่มีเครื่องเทิร์น</option>
                                                    <option value='turn'>มีเครื่องเทิร์น</option>
                                                </select>
                                            </div>
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>ราคาขาย</label>
                                                <input
                                                    type='text'
                                                    className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    placeholder='ราคาขาย'
                                                />
                                            </div>
                                            <div className='col-lg-4 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>{labelText}</label>
                                                <input
                                                    type='text'
                                                    className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    placeholder={labelText}
                                                />
                                            </div>
                                        </div>

                                        {/* ฟิลด์เพิ่มเติมที่แสดงเมื่อเลือก "มีเครื่องเทิร์น" */}
                                        {showAdditionalFields && (
                                            <div className='row mb-6'>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>ยี่ห้อ</label>
                                                    <select className='form-select form-select-solid form-select-lg'>
                                                        <option value=''>เลือกยี่ห้อ...</option>
                                                        <option value='AF'>Afghanistan</option>
                                                    </select>
                                                </div>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>รุ่น</label>
                                                    <input
                                                        type='text'
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                        placeholder='รุ่น'
                                                    />
                                                </div>

                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>หมายเลขเครื่อง</label>
                                                    <input
                                                        type='text'
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                        placeholder='หมายเลขเครื่อง'
                                                    />
                                                </div>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>ราคาสุทธิ</label>
                                                    <input
                                                        type='text'
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                        placeholder='ราคาสุทธิ'
                                                    />
                                                </div>

                                            </div>
                                        )}

                                    </div>
                                </form>
                                {/* end form */}

                            </div>
                        </div>
                    </div>
                    {/* End accordion */}

                </div>
                {/* End Card */}

                <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                    <Link to='/sale/order' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        ย้อนกลับ
                    </Link>
                    <Link to='/sale/createcust' className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        ถัดไป
                    </Link>
                </div>
            </Content>
        </>
    )
}

export default SalesDiscount
