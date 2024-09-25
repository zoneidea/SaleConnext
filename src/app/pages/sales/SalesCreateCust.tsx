import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useState, ChangeEvent } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Content } from '../../../_metronic/layout/components/content'

import useStore from '../../modules/stores/sales/custStore/custStore'

import { useForm } from "react-hook-form"
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const SalesCreateCust: React.FC = () => {
    // ใช้ข้อมูลจาก store zustand
    const { fields, setFieldValue } = useStore();

    // สร้าง schema validation
    const validationSchema = Yup.object().shape({
        // ข้อมูลลูกค้า
        idCard: Yup.string()
            .required('กรุณากรอกเลขบัตรประชาชน')
            .matches(/^\d{13}$/, 'ต้องมี 13 หลัก และเป็นตัวเลขเท่านั้น'),
        fullname: Yup.string().required('กรุณากรอกชื่อ-สกุล'),
        age: Yup.string()
            .required('กรุณากรอกอายุ')
            .matches(/^[1-9]\d*$/, 'ต้องเป็นตัวเลขเท่านั้น'),

        // ที่อยู่ลูกค้า
        email: Yup.string()
        .test(
            'is-valid-email',
            'กรุณากรอกให้ถูก format',
            (value) => {
                // ตรวจสอบเฉพาะเมื่อมีการกรอกข้อมูล
                if (!value || value.length === 0) {
                    return true; // ผ่าน validation ถ้าไม่ได้กรอกข้อมูล
                }
                // ตรวจสอบรูปแบบอีเมล
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            }
        )
    })

    // validate form react-hook-form
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            // ข้อมูลลูกค้า
            idCard: fields.idCard,
            fullname: fields.fullname,
            age: fields.age,

            // ที่อยู่ลูกค้า
            email: fields.email
        },
        resolver: yupResolver(validationSchema)
    });

    // handleTextChange เพื่ออัปเดตทั้ง Zustand และ React Hook Form
    const handleTextChange = (fieldName: keyof typeof fields) => (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        // อัปเดต Zustand
        setFieldValue(fieldName, value);

        // อัปเดต React Hook Form
        setValue(fieldName, value);
    };

    const onSubmit = (data: any) => {
        console.log(data);
    };

    //checkbox accordion
    const [showInstallAddress, setShowInstallAddress] = useState(false);
    const [showBillAddress, setShowBillAddress] = useState(false);

    const handleCheckboxChange = (event: any) => {
        const { name, checked } = event.target
        if (name === 'showInstallAddress') {
            setShowInstallAddress(checked)
        } else if (name === 'showBillAddress') {
            setShowBillAddress(checked)
        }
    };

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-1 mt-lg-0'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            ข้อมูลลูกค้า
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
                                    ระบบขาย
                                </a></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">ข้อมูลลูกค้า</li>
                        </ul>
                    </div>
                </div>

                {/* Card Body */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='accordion mb-10' id='kt_accordion_1'>

                        {/* Start accordion ข้อมูลลูกค้า*/}
                        <div className='accordion-item mb-10'>
                            <h2 className='accordion-header' id='kt_accordion_1_header_1'>
                                <h3
                                    className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                    data-bs-toggle='collapse'
                                    data-bs-target='#kt_accordion_1_body_1'
                                    aria-expanded='true'
                                    aria-controls='kt_accordion_1_body_1'
                                    style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                                >
                                    ข้อมูลลูกค้า
                                </h3>
                            </h2>
                            <div
                                id='kt_accordion_1_body_1'
                                className='accordion-collapse collapse show'
                                aria-labelledby='kt_accordion_1_header_1'
                                data-bs-parent='#kt_accordion_1'
                            >
                                <div className='accordion-body'>
                                    {/* start form */}
                                    <form className='form'>
                                        <div className='card-body px-lg-9 px-1'>

                                            <div className='row mb-15'>
                                                <div className='d-flex justify-content-center'>
                                                    <div
                                                        className='image-input image-input-outline'
                                                        data-kt-image-input='true'
                                                        style={{ backgroundImage: `url(${toAbsoluteUrl('media/avatars/blank.png')})` }}
                                                    >
                                                        <img
                                                            className='image-input-wrapper w-125px h-125px'
                                                            src={toAbsoluteUrl('media/avatars/300-14.jpg')}
                                                            alt=''
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='row mb-6'>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>ประเภทลูกค้า</label>
                                                    <select className='form-select form-select-solid form-select-lg'>
                                                        <option value=''>เลือกประเภทลูกค้า...</option>
                                                        <option value='AF'>Afghanistan</option>
                                                    </select>
                                                </div>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>ประเภทบัตร</label>
                                                    <select className='form-select form-select-solid form-select-lg'>
                                                        <option value=''>เลือกประเภทบัตร...</option>
                                                        <option value='AF'>Afghanistan</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className='row mb-6'>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>บัตรประชาชน</label>
                                                    <input
                                                        {...register('idCard')}
                                                        value={fields.idCard}
                                                        onChange={handleTextChange('idCard')}
                                                        type='text'
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                        placeholder='บัตรประชาชน'
                                                    />
                                                    {errors.idCard && <p className='text-danger'>{errors.idCard.message}</p>}
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>คำนำหน้าชื่อ</label>
                                                    <select className='form-select form-select-solid form-select-lg'>
                                                        <option value=''>เลือกคำนำหน้าชื่อ...</option>
                                                        <option value='AF'>Afghanistan</option>
                                                    </select>
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>ชื่อ-สกุล</label>
                                                    <input
                                                        {...register('fullname')}
                                                        value={fields.fullname}
                                                        onChange={handleTextChange('fullname')}
                                                        type='text'
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                        placeholder='ชื่อ-สกุล'
                                                    />
                                                    {errors.fullname && <p className='text-danger'>{errors.fullname.message}</p>}
                                                </div>
                                            </div>

                                            <div className='row mb-6'>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>ปีเกิด</label>
                                                    <select className='form-select form-select-solid form-select-lg'>
                                                        <option value=''>เลือกปีเกิด...</option>
                                                        <option value='AF'>Afghanistan</option>
                                                    </select>
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>เดือนเกิด</label>
                                                    <select className='form-select form-select-solid form-select-lg'>
                                                        <option value=''>เลือกเดือนเกิด...</option>
                                                        <option value='AF'>Afghanistan</option>
                                                    </select>
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>วันเกิด</label>
                                                    <select className='form-select form-select-solid form-select-lg'>
                                                        <option value=''>เลือกวันเกิด...</option>
                                                        <option value='AF'>Afghanistan</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className='row mb-6'>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>เพศ</label>
                                                    <select className='form-select form-select-solid form-select-lg'>
                                                        <option value=''>เลือกเพศ...</option>
                                                        <option value='AF'>Afghanistan</option>
                                                    </select>
                                                </div>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label required fw-bold fs-6'>อายุ</label>
                                                    <input
                                                        value={fields.age}
                                                        onChange={handleTextChange('age')}
                                                        type='text'
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                        placeholder='อายุ'
                                                    />
                                                    {errors.age && <p className='text-danger'>{errors.age.message}</p>}
                                                </div>
                                            </div>

                                        </div>
                                    </form>
                                    {/* end form */}
                                </div>
                            </div>
                        </div>
                        {/* End accordion ข้อมูลลูกค้า*/}

                        {/* Start accordion ที่อยู่ลูกค้า (ตามบัตร)*/}
                        <div className='accordion mb-10' id='kt_accordion_2'>

                            <div className='accordion-item mb-10'>
                                <h2 className='accordion-header' id='kt_accordion_2_header_2'>
                                    <h3
                                        className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                        data-bs-toggle='collapse'
                                        data-bs-target='#kt_accordion_2_body_2'
                                        aria-expanded='true'
                                        aria-controls='kt_accordion_2_body_2'
                                        style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                                    >
                                        ที่อยู่ลูกค้า (ตามบัตร)
                                    </h3>
                                </h2>
                                <div
                                    id='kt_accordion_2_body_2'
                                    className='accordion-collapse collapse show'
                                    aria-labelledby='kt_accordion_2_header_2'
                                    data-bs-parent='#kt_accordion_2'
                                >
                                    <div className='accordion-body'>
                                        {/* start form */}
                                        <form noValidate className='form'>
                                            <div className='card-body px-lg-9 px-1'>

                                                <div className='row mb-6'>
                                                    <div className='col-lg-4 mb-3'>
                                                        <label className='form-label required fw-bold fs-6'>บ้านเลขที่</label>
                                                        <input
                                                            // value={fields.field4}
                                                            // onChange={handleTextChange('field4')}
                                                            type='text'
                                                            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                            placeholder='บ้านเลขที่'
                                                        />
                                                    </div>
                                                    <div className='col-lg-4 mb-3'>
                                                        <label className='form-label required fw-bold fs-6'>หมู่ที่</label>
                                                        <input
                                                            // value={fields.field5}
                                                            // onChange={handleTextChange('field5')}
                                                            type='text'
                                                            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                            placeholder='หมู่ที่'
                                                        />
                                                    </div>
                                                    <div className='col-lg-4 mb-3'>
                                                        <label className='form-label required fw-bold fs-6'>ตรอก / ซอย</label>
                                                        <input
                                                            // value={fields.field6}
                                                            // onChange={handleTextChange('field6')}
                                                            type='text'
                                                            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                            placeholder='ตรอก / ซอย'
                                                        />
                                                    </div>
                                                </div>

                                                <div className='row mb-6'>
                                                    <div className='col-lg-4 mb-3'>
                                                        <label className='form-label required fw-bold fs-6'>ถนน</label>
                                                        <input
                                                            type='text'
                                                            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                            placeholder='ถนน'
                                                        />
                                                    </div>
                                                    <div className='col-lg-4 mb-3'>
                                                        <label className='form-label required fw-bold fs-6'>จังหวัด</label>
                                                        <select className='form-select form-select-solid form-select-lg'>
                                                            <option value=''>เลือกจังหวัด...</option>
                                                            <option value='AF'>Afghanistan</option>
                                                        </select>
                                                    </div>
                                                    <div className='col-lg-4 mb-3'>
                                                        <label className='form-label required fw-bold fs-6'>อำเภอ / เขต</label>
                                                        <select className='form-select form-select-solid form-select-lg'>
                                                            <option value=''>เลือกอำเภอ / เขต...</option>
                                                            <option value='AF'>Afghanistan</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className='row mb-6'>
                                                    <div className='col-lg-4 mb-3'>
                                                        <label className='form-label required fw-bold fs-6'>ตำบล / แขวง</label>
                                                        <select className='form-select form-select-solid form-select-lg'>
                                                            <option value=''>เลือกตำบล / แขวง...</option>
                                                            <option value='AF'>Afghanistan</option>
                                                        </select>
                                                    </div>
                                                    <div className='col-lg-4 mb-3'>
                                                        <label className='form-label required fw-bold fs-6'>รหัสไปรษณีย์</label>
                                                        <select className='form-select form-select-solid form-select-lg'>
                                                            <option value=''>เลือกรหัสไปรษณีย์...</option>
                                                            <option value='AF'>Afghanistan</option>
                                                        </select>
                                                    </div>
                                                    <div className='col-lg-4 mb-3'>
                                                        <label className='form-label required fw-bold fs-6'>เบอร์บ้าน</label>
                                                        <input
                                                            type='text'
                                                            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                            placeholder='เบอร์บ้าน'
                                                        />
                                                    </div>
                                                </div>

                                                <div className='row mb-6'>
                                                    <div className='col-lg-4 mb-3'>
                                                        <label className='form-label required fw-bold fs-6'>เบอร์ที่ทำงาน</label>
                                                        <input
                                                            type='text'
                                                            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                            placeholder='เบอร์ที่ทำงาน'
                                                        />
                                                    </div>
                                                    <div className='col-lg-4 mb-3'>
                                                        <label className='form-label required fw-bold fs-6'>เบอร์มือถือที่ติดต่อได้</label>
                                                        <input
                                                            type='text'
                                                            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                            placeholder='เบอร์มือถือที่ติดต่อได้'
                                                        />
                                                    </div>
                                                    <div className='col-lg-4 mb-3'>
                                                        <label className='form-label fw-bold fs-6'>อีเมล์</label>
                                                        <input
                                                            value={fields.email}
                                                            onChange={handleTextChange("email")}
                                                            type='text'
                                                            className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                            placeholder='อีเมล์'
                                                        />
                                                        {errors.email && <p className='text-danger'>{errors.email.message}</p>}
                                                    </div>
                                                </div>

                                                <div className='row mb-6'>
                                                    <div className='col-lg-4 mb-3 mt-xl-5'>
                                                        <label className='form-check form-check-inline form-check-solid me-5'>
                                                            <input
                                                                onChange={handleCheckboxChange}
                                                                className='form-check-input'
                                                                name='showInstallAddress'
                                                                type='checkbox'
                                                            />
                                                            <span className='fw-bold ps-2 fs-6 mb-sm-5'>ใช้เหมือนที่อยู่ติดตั้ง</span>
                                                        </label>
                                                        <label className='form-check form-check-inline form-check-solid me-5 mt-3 mt-sm-0'>
                                                            <input
                                                                onChange={handleCheckboxChange}
                                                                className='form-check-input'
                                                                name='showBillAddress'
                                                                type='checkbox'
                                                            />
                                                            <span className='fw-bold ps-2 fs-6'>ใช้เหมือนที่อยู่เก็บเงิน</span>
                                                        </label>
                                                    </div>
                                                </div>

                                            </div>
                                        </form>
                                        {/* end form */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End accordion ที่อยู่ลูกค้า (ตามบัตร)*/}

                        {/* Start accordion ที่อยู่ลูกค้า (ติดตั้ง)*/}
                        {!showInstallAddress && (
                            <div className='accordion mb-10' id='kt_accordion_3'>

                                <div className='accordion-item mb-10'>
                                    <h2 className='accordion-header' id='kt_accordion_3_header_3'>
                                        <h3
                                            className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                            data-bs-toggle='collapse'
                                            data-bs-target='#kt_accordion_3_body_3'
                                            aria-expanded='true'
                                            aria-controls='kt_accordion_3_body_3'
                                            style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                                        >
                                            ที่อยู่ลูกค้า (ติดตั้ง)
                                        </h3>
                                    </h2>
                                    <div
                                        id='kt_accordion_3_body_3'
                                        className='accordion-collapse collapse show'
                                        aria-labelledby='kt_accordion_3_header_3'
                                        data-bs-parent='#kt_accordion_3'
                                    >
                                        <div className='accordion-body'>
                                            {/* start form */}
                                            <form noValidate className='form'>
                                                <div className='card-body px-lg-9 px-1'>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>บ้านเลขที่</label>
                                                            <input
                                                                // // value={fields.field4}
                                                                // onChange={handleTextChange('field4')}
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='บ้านเลขที่'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>หมู่ที่</label>
                                                            <input
                                                                // // value={fields.field5}
                                                                // onChange={handleTextChange('field5')}
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='หมู่ที่'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ตรอก / ซอย</label>
                                                            <input
                                                                // // value={fields.field6}
                                                                // onChange={handleTextChange('field6')}
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='ตรอก / ซอย'
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ถนน</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='ถนน'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>จังหวัด</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกจังหวัด...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>อำเภอ / เขต</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกอำเภอ / เขต...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ตำบล / แขวง</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกตำบล / แขวง...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>รหัสไปรษณีย์</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกรหัสไปรษณีย์...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>เบอร์บ้าน</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='เบอร์บ้าน'
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>เบอร์ที่ทำงาน</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='เบอร์ที่ทำงาน'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>เบอร์มือถือที่ติดต่อได้</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='เบอร์มือถือที่ติดต่อได้'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label fw-bold fs-6'>อีเมล์</label>
                                                            <input
                                                                value={fields.email}
                                                                onChange={handleTextChange('email')}
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='อีเมล์'
                                                            />
                                                            {errors.email && <p className='text-danger'>{errors.email.message}</p>}
                                                        </div>
                                                    </div>

                                                </div>
                                            </form>
                                            {/* end form */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* End accordion ที่อยู่ลูกค้า (ติดตั้ง)*/}

                        {/* Start accordion ที่อยู่ลูกค้า (เก็บเงิน)*/}
                        {!showBillAddress && (
                            <div className='accordion mb-10' id='kt_accordion_4'>

                                <div className='accordion-item mb-10'>
                                    <h2 className='accordion-header' id='kt_accordion_4_header_4'>
                                        <h3
                                            className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                            data-bs-toggle='collapse'
                                            data-bs-target='#kt_accordion_4_body_4'
                                            aria-expanded='true'
                                            aria-controls='kt_accordion_4_body_4'
                                            style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                                        >
                                            ที่อยู่ลูกค้า (เก็บเงิน)
                                        </h3>
                                    </h2>
                                    <div
                                        id='kt_accordion_4_body_4'
                                        className='accordion-collapse collapse show'
                                        aria-labelledby='kt_accordion_4_header_4'
                                        data-bs-parent='#kt_accordion_4'
                                    >
                                        <div className='accordion-body'>
                                            {/* start form */}
                                            <form noValidate className='form'>
                                                <div className='card-body px-lg-9 px-1'>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>บ้านเลขที่</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='บ้านเลขที่'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>หมู่ที่</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='หมู่ที่'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ตรอก / ซอย</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='ตรอก / ซอย'
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ถนน</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='ถนน'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>จังหวัด</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกจังหวัด...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>อำเภอ / เขต</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกอำเภอ / เขต...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>ตำบล / แขวง</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกตำบล / แขวง...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>รหัสไปรษณีย์</label>
                                                            <select className='form-select form-select-solid form-select-lg'>
                                                                <option value=''>เลือกรหัสไปรษณีย์...</option>
                                                                <option value='AF'>Afghanistan</option>
                                                            </select>
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>เบอร์บ้าน</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='เบอร์บ้าน'
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='row mb-6'>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>เบอร์ที่ทำงาน</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='เบอร์ที่ทำงาน'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>เบอร์มือถือที่ติดต่อได้</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='เบอร์มือถือที่ติดต่อได้'
                                                            />
                                                        </div>
                                                        <div className='col-lg-4 mb-3'>
                                                            <label className='form-label required fw-bold fs-6'>อีเมล์</label>
                                                            <input
                                                                type='text'
                                                                className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                                placeholder='อีเมล์'
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
                        )}
                        {/* End accordion ที่อยู่ลูกค้า (เก็บเงิน)*/}
                    </div>
                    {/* End Card */}

                    <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                        <Link to='/sale/discount' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                            ย้อนกลับ
                        </Link>
                        <button className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0' type='submit'>
                            จัดเก็บข้อมูล
                        </button>
                    </div>
                </form>
            </Content>
        </>
    )
}

export default SalesCreateCust