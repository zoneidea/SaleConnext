import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Content } from '../../../_metronic/layout/components/content';
import { useAuth } from '../../modules/auth/core/Auth';
import { useUUIDStore, useSaveProductStore } from '../../modules/stores/stepsStore';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

//useStore
import {
    useCategoryStore,
    useFetchCategoryStore,
    useProductStore,
    usePackageStore,
    useConditionsCheckHistoryStore
} from '../../modules/stores/sales/packageStore/packageStore';

//component
import { CardProduct } from '../sales/components/cards/CardProduct';
import { CardPackage } from '../sales/components/cards/CardPackage';

interface ItemProps {
    REFNO: String,
    EMPID: String,
    TEAMSALE: String,
    SALECODE: String,
    SUPEMPID: String,
    SECEMPID: String,
    STATUS: String,
    PRODUCT?: [any],
    CUSTOMERSTATUS: [any],
    DISCOUNT: [any],
    CUSTOMERDETAIL: [any],
    ADDRESS: [any],
    PDPA: [any],
    CONTRACT: [any],
    IMAGE: [any]
}

const SalesPackage: React.FC = () => {
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);


    const location = useLocation();
    const item = location.state as ItemProps || [];

    const product = item?.PRODUCT
    const customer = item?.CUSTOMERDETAIL
    const address = item?.ADDRESS

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-7 mt-lg-0'>
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

                <div className='accordion mb-10' id='kt_accordion_1'>
                    <div className='accordion-item mb-10'>
                        <h2 className='accordion-header' id='kt_accordion_1_header_1'>
                            <h3
                                className='accordion-button fs-4 fw-bold border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                data-bs-toggle='collapse'
                                data-bs-target='#kt_accordion_1_body_1'
                                aria-expanded='true'
                                aria-controls='kt_accordion_1_body_1'
                                style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}>
                                แพ็คเกจสินค้า
                            </h3>
                        </h2>
                        <div className='accordion-collapse collapse show' >
                            <div className='accordion-body'>
                                <form noValidate className='form'>
                                    <div className='card-body px-lg-9 px-1'>
                                        <div className='card-body d-flex align-items-center'>
                                            <div className='flex-grow-1'>
                                                <div className='text-gray-800 fw-bold fs-4'>
                                                    {`REFNO: ${item?.REFNO}`}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='row mb-6 mt-6'>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>สินค้า</label>
                                                    <input
                                                        value={product?.[0]?.ItemDescription}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0' />
                                                </div>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>แพ็คเกจ</label>
                                                    <input
                                                        value={product?.[0]?.Package?.[0]?.PACKAGETITLE}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='accordion mb-10' id='kt_accordion_1'>
                    <div className='accordion-item mb-10'>
                        <h2 className='accordion-header' id='kt_accordion_1_header_1'>
                            <h3
                                className='accordion-button fs-4 fw-bold border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                data-bs-toggle='collapse'
                                data-bs-target='#kt_accordion_1_body_1'
                                aria-expanded='true'
                                aria-controls='kt_accordion_1_body_1'
                                style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}>
                                ข้อมูลลูกค้า
                            </h3>
                        </h2>
                        <div className='accordion-collapse collapse show' >
                            <div className='accordion-body'>
                                <form noValidate className='form'>
                                    <div className='card-body px-lg-9 px-1'>
                                        <div className='row'>
                                            <div className='row mb-6 mt-6'>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>ประเภทลูกค้า</label>
                                                    <input
                                                        value={customer?.[0]?.CUSTOMERTYPENAME}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0' />
                                                </div>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>ประเภทบัตร</label>
                                                    <input
                                                        value={customer?.[0]?.CARDTYPE?.[0]?.CARDTYPENAME}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0' />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='row mb-6'>
                                                <div className='col-lg-4'>
                                                    <label className='form-label fw-bold fs-6'>บัตรประชาชน</label>
                                                    <input
                                                        value={customer?.[0]?.CUSTOMERID}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>คำนำหน้าชื่อ</label>
                                                    <input
                                                        value={customer?.[0]?.PREFIX?.[0]?.PREFIXNAME}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4'>
                                                    <label className='form-label fw-bold fs-6'>ชื่อสกุล</label>
                                                    <input
                                                        value={customer?.[0]?.CUSTOMERNAME}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='row mb-6'>
                                                <div className='col-lg-4'>
                                                    <label className='form-label fw-bold fs-6'>วันเดือนปีเกิด</label>
                                                    <input
                                                        value={customer?.[0]?.CUSTOMERDOB}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>อายุ</label>
                                                    <input
                                                        value={customer?.[0]?.CUSTOMERRAGE}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4'>
                                                    <label className='form-label fw-bold fs-6'>เพศ</label>
                                                    <input
                                                        value={customer?.[0]?.SEX?.[0]?.SEXNAME}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='row mb-6'>
                                                <div className='col-lg-3'>
                                                    <label className='form-label fw-bold fs-6'>เบอร์มือถือ</label>
                                                    <input
                                                        value={customer?.[0]?.CUSTOMERMOBILE}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-3 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>เบอร์บ้าน</label>
                                                    <input
                                                        value={customer?.[0]?.CUSTOMERPHONE}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-3'>
                                                    <label className='form-label fw-bold fs-6'>เบอร์ที่ทำงาน</label>
                                                    <input
                                                        value={customer?.[0]?.SEX?.[0]?.CUSTOMERWORKPHONE}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-3'>
                                                    <label className='form-label fw-bold fs-6'>อีเมล</label>
                                                    <input
                                                        value={customer?.[0]?.SEX?.[0]?.CUSTOMEREMAIL}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='accordion mb-10' id='kt_accordion_1'>
                    <div className='accordion-item mb-10'>
                        <h2 className='accordion-header' id='kt_accordion_1_header_1'>
                            <h3
                                className='accordion-button fs-4 fw-bold border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                data-bs-toggle='collapse'
                                data-bs-target='#kt_accordion_1_body_1'
                                aria-expanded='true'
                                aria-controls='kt_accordion_1_body_1'
                                style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}>
                                ที่อยู่ตามบัตรฯ
                            </h3>
                        </h2>
                        <div className='accordion-collapse collapse show' >
                            <div className='accordion-body'>
                                <form noValidate className='form'>
                                    <div className='card-body px-lg-9 px-1'>
                                        <div className='row'>
                                            <div className='row mb-6 mt-6'>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>บ้านเลขที่</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSCARD?.ADDRESSNUMBER}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0' />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>หมู่ที่</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSCARD?.ADDRESSMOO}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0' />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>ซอย</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSCARD?.ADDRESSSOI}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0' />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='row mb-6'>
                                                <div className='col-lg-4'>
                                                    <label className='form-label fw-bold fs-6'>ถนน</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSCARD?.ADDRESSROAD}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>ตำบล</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSCARD?.ADDRESSSUBDISTRICTNAME}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4'>
                                                    <label className='form-label fw-bold fs-6'>อำเภอ</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSCARD?.ADDRESSDISTRICTNAME}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='row mb-6'>
                                                <div className='col-lg-4'>
                                                    <label className='form-label fw-bold fs-6'>จังหวัด</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>รหัสไปรษณีย์</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSCARD?.ADDRESSZIPCODE}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4'></div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='accordion mb-10' id='kt_accordion_1'>
                    <div className='accordion-item mb-10'>
                        <h2 className='accordion-header' id='kt_accordion_1_header_1'>
                            <h3
                                className='accordion-button fs-4 fw-bold border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                data-bs-toggle='collapse'
                                data-bs-target='#kt_accordion_1_body_1'
                                aria-expanded='true'
                                aria-controls='kt_accordion_1_body_1'
                                style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}>
                                ที่อยู่ติดตั้ง
                            </h3>
                        </h2>
                        <div className='accordion-collapse collapse show' >
                            <div className='accordion-body'>
                                <form noValidate className='form'>
                                    <div className='card-body px-lg-9 px-1'>
                                        <div className='row'>
                                            <div className='row mb-6 mt-6'>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>บ้านเลขที่</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0' />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>หมู่ที่</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSINSTALLATION?.ADDRESSMOO}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0' />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>ซอย</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSINSTALLATION?.ADDRESSSOI}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0' />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='row mb-6'>
                                                <div className='col-lg-4'>
                                                    <label className='form-label fw-bold fs-6'>ถนน</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSINSTALLATION?.ADDRESSROAD}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>ตำบล</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4'>
                                                    <label className='form-label fw-bold fs-6'>อำเภอ</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='row mb-6'>
                                                <div className='col-lg-4'>
                                                    <label className='form-label fw-bold fs-6'>จังหวัด</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>รหัสไปรษณีย์</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4'></div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='accordion mb-10' id='kt_accordion_1'>
                    <div className='accordion-item mb-10'>
                        <h2 className='accordion-header' id='kt_accordion_1_header_1'>
                            <h3
                                className='accordion-button fs-4 fw-bold border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                data-bs-toggle='collapse'
                                data-bs-target='#kt_accordion_1_body_1'
                                aria-expanded='true'
                                aria-controls='kt_accordion_1_body_1'
                                style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}>
                                ที่อยู่เก็บเงิน
                            </h3>
                        </h2>
                        <div className='accordion-collapse collapse show' >
                            <div className='accordion-body'>
                                <form noValidate className='form'>
                                    <div className='card-body px-lg-9 px-1'>
                                        <div className='row'>
                                            <div className='row mb-6 mt-6'>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>บ้านเลขที่</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0' />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>หมู่ที่</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSPAYMENT?.ADDRESSMOO}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0' />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>ซอย</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSPAYMENT?.ADDRESSSOI}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0' />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='row mb-6'>
                                                <div className='col-lg-4'>
                                                    <label className='form-label fw-bold fs-6'>ถนน</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSPAYMENT?.ADDRESSROAD}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>ตำบล</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4'>
                                                    <label className='form-label fw-bold fs-6'>อำเภอ</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSPAYMENT?.ADDRESSDISTRICTNAME}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='row mb-6'>
                                                <div className='col-lg-4'>
                                                    <label className='form-label fw-bold fs-6'>จังหวัด</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>รหัสไปรษณีย์</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4'></div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='accordion mb-10' id='kt_accordion_1'>
                    <div className='accordion-item mb-10'>
                        <h2 className='accordion-header' id='kt_accordion_1_header_1'>
                            <h3
                                className='accordion-button fs-4 fw-bold border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                data-bs-toggle='collapse'
                                data-bs-target='#kt_accordion_1_body_1'
                                aria-expanded='true'
                                aria-controls='kt_accordion_1_body_1'
                                style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}>
                                ที่อยู่ใบกำกับภาษี
                            </h3>
                        </h2>
                        <div className='accordion-collapse collapse show' >
                            <div className='accordion-body'>
                                <form noValidate className='form'>
                                    <div className='card-body px-lg-9 px-1'>
                                        <div className='row'>
                                            <div className='row mb-6 mt-6'>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>บ้านเลขที่</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSTAX?.ADDRESSNUMBER}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0' />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>หมู่ที่</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSTAX?.ADDRESSMOO}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0' />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>ซอย</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSTAX?.ADDRESSSOI}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0' />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='row mb-6'>
                                                <div className='col-lg-4'>
                                                    <label className='form-label fw-bold fs-6'>ถนน</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSTAX?.ADDRESSROAD}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>ตำบล</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSTAX?.ADDRESSSUBDISTRICTNAME}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4'>
                                                    <label className='form-label fw-bold fs-6'>อำเภอ</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSTAX?.ADDRESSDISTRICTNAME}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='row mb-6'>
                                                <div className='col-lg-4'>
                                                    <label className='form-label fw-bold fs-6'>จังหวัด</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>รหัสไปรษณีย์</label>
                                                    <input
                                                        value={address?.[0]?.ADDRESSTAX?.ADDRESSZIPCODE}
                                                        type='text'
                                                        disabled={true}
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                    />
                                                </div>
                                                <div className='col-lg-4'></div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row mb-6'>
                    <div className='col-lg-4 mb-3'>
                        <label className='form-check form-check-inline form-check-solid me-5'>
                            <input
                                // onChange={null}
                                className='form-check-input'
                                name='showInstallAddress'
                                type='checkbox'
                            // checked={showInstallAddress}
                            />
                            <span className='fw-bold ps-2 fs-6 mb-sm-5'>ผ่าน</span>
                        </label>
                    </div>
                    <div className='col-lg-4 mb-3'>
                        <label className='form-check form-check-inline form-check-solid me-5 mt-3 mt-sm-0'>
                            <input
                                // onChange={null}
                                className='form-check-input'
                                name='showPaymentAddress'
                                type='checkbox'
                            // checked={showPaymentAddress}
                            />
                            <span className='fw-bold ps-2 fs-6'>ไม่ผ่าน</span>
                        </label>
                    </div>
                    <div className='col-lg-4 mb-3'>
                        <label className='form-check form-check-inline form-check-solid me-5 mt-3 mt-sm-0'>
                            <input
                                // onChange={null}
                                className='form-check-input'
                                name='showPaymentAddress'
                                type='checkbox'
                            // checked={showPaymentAddress}
                            />
                            <span className='fw-bold ps-2 fs-6'>ยกเลิกสัญญา</span>
                        </label>
                    </div>
                </div>

                <div className='row mb-6'>
                    <div className='col-lg-6 mb-3'>
                        <label className='form-label fw-bold fs-6'>รายละเอียดเพิ่มเติม</label>
                        <input
                            value={''}
                            type='text'
                            multiple
                            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                        />
                    </div>
                </div>

                <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                    <Link to='/contract-checker' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        ย้อนกลับ
                    </Link>
                    <Link to='' className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                        บันทึกการตรวจสอบ
                    </Link>
                </div>
            </Content>
        </>
    );
}

export default SalesPackage;