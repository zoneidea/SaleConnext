import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/content'

const SalesPackage: React.FC = () => {
    const [showAdditionalCategory, setShowAdditionalCategory] = useState(false);
    const [showAdditionalProduct, setShowAdditionalProduct] = useState(false);

    const handleCateOptionChange = (event) => {
        const selectedValue = event.target.value;
        const isTurnOption = selectedValue === 'turn'; // เมื่อเลือก 'turn' จะเปิดฟิลด์เพิ่มเติม
        setShowAdditionalCategory(isTurnOption); // แสดงฟิลด์เพิ่มเติมสำหรับหมวดหมู่สินค้า
        setShowAdditionalProduct(false); // รีเซ็ตการแสดงฟิลด์เพิ่มเติมสำหรับสินค้า
    };

    const handleProductOptionChange = (event) => {
        const selectedValue = event.target.value;
        const isTurnOption = selectedValue === 'turn'; // เมื่อเลือก 'turn' จะเปิดฟิลด์เพิ่มเติม
        setShowAdditionalProduct(isTurnOption); // แสดงฟิลด์เพิ่มเติมสำหรับสินค้า
    };

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-1 mt-lg-0'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            เลือกแพ็คเกจ
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
                                    ระบบขาย
                                </a></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">เลือกแพ็คเกจ</li>
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
                                เลือกแพ็คเกจ
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

                                        {/* หมวดหมู่สินค้า */}
                                        <div className='row mb-6'>
                                            <div className='col-lg-6 mb-3'>
                                                <label className='form-label required fw-bold fs-6'>หมวดหมู่สินค้า</label>
                                                <select
                                                    className='form-select form-select-solid form-select-lg'
                                                    onChange={handleCateOptionChange}
                                                >
                                                    <option value=''>เลือกหมวดหมู่สินค้า...</option>
                                                    <option value='turn'>เครื่องกรองน้ำ</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* ฟิลด์เพิ่มเติมที่แสดงเมื่อเลือก "หมวดหมู่สินค้า" */}
                                        {showAdditionalCategory && (
                                            <div className='row mb-6'>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>สินค้า</label>
                                                    <select
                                                        className='form-select form-select-solid form-select-lg'
                                                        onChange={handleProductOptionChange}
                                                    >
                                                        <option value=''>เลือกสินค้า...</option>
                                                        <option value='turn'>เครื่องกรองน้ำ SAFE รุ่น UV</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {/* ฟิลด์เพิ่มเติมที่แสดงเมื่อเลือก "สินค้า" */}
                                        {showAdditionalProduct && (
                                            <div className='row mb-6'>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>แพ็คเกจ</label>
                                                    <select className='form-select form-select-solid form-select-lg'>
                                                        <option value=''>เลือกแพ็คเกจ...</option>
                                                        <option value=''>แพ็คเกจ A</option>
                                                        <option value=''>แพ็คเกจ B</option>
                                                    </select>
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
                    <Link to='/sale/scanbarcode' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        ย้อนกลับ
                    </Link>
                    <Link to='/sale/product' className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        ถัดไป
                    </Link>
                </div>

                {/* End Card Body */}
            </Content >
        </>
    )
}

export default SalesPackage