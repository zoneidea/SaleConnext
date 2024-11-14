import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { Content } from '../../../_metronic/layout/components/content';
import { useAuth } from '../../modules/auth/core/Auth';
import { KTIcon } from '../../../_metronic/helpers'

import { useUUIDStore, useSaveProductStore } from '../../modules/stores/stepsStore';
import { useSaveDiscountStore } from '../../modules/stores/stepsStore';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import dayjs, { Dayjs } from 'dayjs';
import DatePicker from 'react-datepicker';
import DateTimePicker from 'react-datetime-picker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

interface ContractState {
    contNo: string;
}

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

const CreateFirstBill: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const MySwal = withReactContent(Swal);

    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const { REFNO } = useUUIDStore();

    const item = location.state as ItemProps || [];
    console.log(`item`, item);
    const refno = item?.REFNO
    const product = item?.PRODUCT
    const contNo = item?.CONTNO
    const customerDetail = item?.CUSTOMERDETAIL

    const totalPrice = product[0]?.Package[0]?.TOTALPRICE || 0;
    const discountAmount = item?.DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
    const netPrice = totalPrice - discountAmount;

    const [payQuick, setPayQuick] = useState<boolean>(true);
    const [payFullAmount, setPayFullAmount] = useState<boolean>(true);
    const [paySomeAmount, setPaySomeAmount] = useState<number>(0);

    const remainingAmount = netPrice - paySomeAmount

    const [valueCalendarInstall, setValueCalendarInstall] = useState<Date | null>(null);

    const handlePayQuickChange = (value: boolean) => {
        setPayQuick(value);
    };

    const handlePayFullAmountChange = (value: boolean) => {
        setPayFullAmount(value);
    };

    const handleDateChangeInstall = (date: Date | null) => {
        setValueCalendarInstall(date);
    };

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mt-7 mt-lg-0'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            การรับชำระเงินงวดแรก
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <span className="text-muted text-hover-primary">
                                    ระบบเก็บเงินงวดแรก
                                </span></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">การรับชำระเงินงวดแรก</li>
                        </ul>
                    </div>
                </div>
                <p>เลขที่ขาย: {REFNO}</p>

                <div className='row'>
                    {/* Card Body */}
                    <div className='col-lg-6'>
                        <div className='accordion mb-10' id='kt_accordion_1'>
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
                                        การรับชำระเงินงวดแรก
                                    </h3>
                                </h2>
                                <div
                                    id='kt_accordion_1_body_1'
                                    className='accordion-collapse collapse show'
                                    aria-labelledby='kt_accordion_1_header_1'
                                    data-bs-parent='#kt_accordion_1'
                                >
                                    <div className='accordion-body'>
                                        <form noValidate className='form'>
                                            <div className='card-body px-lg-9 px-1'>

                                                <div className="container">
                                                    <div className="d-flex mb-6">
                                                        <div className="form-check form-check-inline me-3">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="payQuick"
                                                                checked={payQuick}
                                                                onChange={() => handlePayQuickChange(true)}
                                                            />
                                                            <label className="form-label fw-bold fs-6">ชำระเงินทันที</label>
                                                        </div>
                                                        <div className="form-check form-check-inline me-3">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="payQuick"
                                                                checked={!payQuick}
                                                                onChange={() => handlePayQuickChange(false)}
                                                            />
                                                            <label className="form-label fw-bold fs-6">นัดชำระ</label>
                                                        </div>
                                                    </div>

                                                    {/* Start ชำระเงินทันที */}
                                                    {payQuick && (
                                                        <>
                                                            <div className="d-flex mb-6 mt-10">
                                                                <div className="form-check form-check-inline me-3">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="payFullAmount"
                                                                        checked={payFullAmount}
                                                                        onChange={() => handlePayFullAmountChange(true)}
                                                                    />
                                                                    <label className="form-label fw-bold fs-6">ชำระเต็ม</label>
                                                                </div>
                                                                <div className="form-check form-check-inline me-3">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="payFullAmount"
                                                                        checked={!payFullAmount}
                                                                        onChange={() => handlePayFullAmountChange(false)}
                                                                    />
                                                                    <label className="form-label fw-bold fs-6">ชำระบางส่วน / เกินจำนวน</label>
                                                                </div>
                                                            </div>

                                                            {/* Start ชำระเต็ม */}
                                                            {payFullAmount && (
                                                                <>
                                                                    <div className="mb-6">
                                                                        <label className="form-label fw-bold fs-6">จำนวนเงินที่ต้องชำระ</label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            readOnly
                                                                            style={{
                                                                                backgroundColor: '#d7dbde',
                                                                            }}
                                                                            value={netPrice}
                                                                        />
                                                                    </div>
                                                                    <div className="d-flex mb-6 mt-10">
                                                                        <div className="form-check form-check-inline me-3">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name="priceOption"
                                                                            // checked={usePackagePricing}
                                                                            // onChange={() => handleOptionChange(true)}
                                                                            />
                                                                            <label className="form-label fw-bold fs-6">เงินสด</label>
                                                                        </div>
                                                                        <div className="form-check form-check-inline me-3">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name="priceOption"
                                                                            // checked={!usePackagePricing}
                                                                            // onChange={() => handleOptionChange(false)}
                                                                            />
                                                                            <label className="form-label fw-bold fs-6">บัตรเครดิต</label>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                            {/* End ชำระเต็ม */}

                                                            {/* Start ชำระบางส่วน / เกินจำนวน */}
                                                            {!payFullAmount && (
                                                                <>
                                                                    <div className="mb-6">
                                                                        <label className="form-label fw-bold fs-6">จำนวนเงินที่ต้องชำระ</label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            readOnly
                                                                            style={{
                                                                                backgroundColor: '#d7dbde',
                                                                            }}
                                                                            value={netPrice}
                                                                        />
                                                                    </div>
                                                                    <div className="mb-6">
                                                                        <label className="form-label required fw-bold fs-6">จำนวนเงินที่แบ่งชำระ</label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            onChange={(e) => setPaySomeAmount(Number(e.target.value))}
                                                                            value={paySomeAmount}
                                                                        />
                                                                    </div>
                                                                    <div className="mb-6">
                                                                        <label className="form-label fw-bold fs-6">จำนวนเงินที่เหลือ</label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            readOnly
                                                                            style={{
                                                                                backgroundColor: '#d7dbde',
                                                                            }}
                                                                            value={remainingAmount}
                                                                        />
                                                                    </div>
                                                                    <div className="col-lg-12 mb-6">
                                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                            <label className="form-label required fw-bold fs-6">วันที่สะดวกชำระ</label>
                                                                            <DatePicker
                                                                                selected={valueCalendarInstall}
                                                                                onChange={handleDateChangeInstall}
                                                                                className="form-control mb-3 mb-lg-0"
                                                                                showYearDropdown
                                                                                showMonthDropdown
                                                                                dropdownMode="select"
                                                                                isClearable
                                                                                dateFormat="yyyy/MM/dd"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="d-flex mb-6 mt-10">
                                                                        <div className="form-check form-check-inline me-3">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name="priceOption"
                                                                            // checked={usePackagePricing}
                                                                            // onChange={() => handleOptionChange(true)}
                                                                            />
                                                                            <label className="form-label fw-bold fs-6">เงินสด</label>
                                                                        </div>
                                                                        <div className="form-check form-check-inline me-3">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name="priceOption"
                                                                            // checked={!usePackagePricing}
                                                                            // onChange={() => handleOptionChange(false)}
                                                                            />
                                                                            <label className="form-label fw-bold fs-6">บัตรเครดิต</label>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                            {/* End ชำระบางส่วน / เกินจำนวน */}
                                                        </>
                                                    )}
                                                    {/* End ชำระเงินทันที */}

                                                    {/* Start นัดชำระ */}
                                                    {!payQuick && (
                                                        <div className="col-lg-12 mb-6">
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <label className="form-label required fw-bold fs-6">วันที่สะดวกชำระ</label>
                                                                <DatePicker
                                                                    selected={valueCalendarInstall}
                                                                    onChange={handleDateChangeInstall}
                                                                    className="form-control mb-3 mb-lg-0"
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                    isClearable
                                                                    dateFormat="yyyy/MM/dd"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {/* End นัดชำระ*/}
                                                </div>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End Card Body */}

                    {/* Card Body */}
                    <div className='col-lg-6'>
                        <div className='card'>
                            <div className='card-body'>
                                <div className='d-flex justify-content-between mb-5'>
                                    <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                                        รายละเอียดสัญญา
                                    </h1>
                                    <button
                                        type='button'
                                        className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                                    >
                                        <KTIcon iconName='category' className='fs-2' />
                                    </button>
                                </div>

                                <div className='container'>
                                    <div className='row mb-7'>
                                        <label className='col-5 col-md-4 fw-bold text-muted'>เลขที่สัญญา</label>
                                        <div className='col-7 col-md-8'>
                                            <span className='fw-bold fs-6'>{contNo}</span>
                                        </div>
                                    </div>

                                    <div className='row mb-7'>
                                        <label className='col-5 col-md-4 fw-bold text-muted'>ชื่อลูกค้า</label>
                                        <div className='col-7 col-md-8'>
                                            <a href='#' className='fw-bold fs-6 text-gray-900 text-hover-primary'>
                                                {customerDetail[0]?.CUSTOMERNAME}
                                            </a>
                                        </div>
                                    </div>

                                    <div className='row mb-7'>
                                        <label className='col-5 col-md-4 fw-bold text-muted'>เบอร์โทรติดต่อ</label>
                                        <div className='col-7 col-md-8'>
                                            <span className='fw-bold fs-6'>{customerDetail[0]?.CUSTOMERMOBILE}</span>
                                        </div>
                                    </div>

                                    <div className='row mb-7'>
                                        <label className='col-5 col-md-4 fw-bold text-muted'>สินค้า</label>
                                        <div className='col-7 col-md-8'>
                                            <span className='fw-bold fs-6'>{product[0]?.ItemDescription}</span>
                                        </div>
                                    </div>

                                    {product[0]?.Package[0]?.PACKAGETITLE && (
                                        <div className='row mb-7'>
                                            <label className='col-5 col-md-4 fw-bold text-muted'>แพ็คเกจ</label>
                                            <div className='col-7 col-md-8'>
                                                <span className='fw-bold fs-6'>{product[0]?.Package[0]?.PACKAGETITLE}</span>
                                            </div>
                                        </div>
                                    )}

                                    {item?.DISCOUNT[0]?.GIFT && (
                                        <div className='row mb-7'>
                                            <label className='col-5 col-md-4 fw-bold text-muted'>ของแถม</label>
                                            <div className='col-7 col-md-8'>
                                                <span className='fw-bold fs-6'>{item?.DISCOUNT[0]?.GIFT?.GIFTNAME}</span>
                                            </div>
                                        </div>
                                    )}

                                    {product[0]?.Package[0]?.TOTALPRICE && (
                                        <div className='row mb-7'>
                                            <label className='col-5 col-md-4 fw-bold text-muted'>ราคาสินค้า</label>
                                            <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
                                                <span className='fw-bold fs-6'>{product[0]?.Package[0]?.TOTALPRICE}</span>
                                                <span className='badge badge-light-success'>บาท</span>
                                            </div>
                                        </div>
                                    )}

                                    {item?.DISCOUNT[0]?.TRADEIN?.HASTRADEIN != 0 && (
                                        <div className='row mb-7'>
                                            <label className='col-5 col-md-4 fw-bold text-muted'>เครื่องเทิร์น</label>
                                            <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
                                                <span className='fw-bold fs-6'>{item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME}</span>
                                            </div>
                                        </div>
                                    )}

                                    {item?.DISCOUNT[0]?.DISCOUNTAMOUNT != 0 && (
                                        <div className='row mb-7'>
                                            <label className='col-5 col-md-4 fw-bold text-muted'>ส่วนลด</label>
                                            <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
                                                <span className='fw-bold fs-6'>{item?.DISCOUNT[0]?.DISCOUNTAMOUNT}</span>
                                                <span className='badge badge-light-success'>บาท</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className='row mb-7'>
                                        <label className='col-5 col-md-4 fw-bold text-muted'>ราคาสุทธิ</label>
                                        <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
                                            <span className='fw-bold fs-6'>{netPrice}</span>
                                            <span className='badge badge-light-success'>บาท</span>
                                        </div>
                                    </div>

                                    {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
                                    {product[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
                                        <>
                                            <div className='row mb-7'>
                                                <label className='col-5 col-md-4 fw-bold text-muted'>งวดที่ 1 ที่ต้องชำระ</label>
                                                <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
                                                    <span className='fw-bold fs-6'>{product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT - discountAmount}</span>
                                                    <span className='badge badge-light-success'>บาท</span>
                                                </div>
                                            </div>

                                            {product[0]?.Package[0]?.PERIODDETAILS.length > 1 && (
                                                <div className='row mb-7'>
                                                    <label className='col-5 col-md-4 fw-bold text-muted'>งวดที่ 2 ถึง {product[0]?.Package[0]?.PERIODDETAILS.length} ต้องชำระงวดละ</label>
                                                    <div className='col-7 col-md-8 d-flex align-items-center justify-content-between'>
                                                        <span className='fw-bold fs-6'>{product[0]?.Package[0]?.PERIODDETAILS[1]?.PAYMENTAMOUNT}</span>
                                                        <span className='badge badge-light-success'>บาท</span>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End Card Body */}

                </div>

                <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-20'>
                    <button
                        className='btn btn-secondary w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px'
                        onClick={() => navigate('/firstBill/overview', { state: item })}
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        className='btn btn-primary w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px'
                    // onClick={handleNextClick}
                    >
                        ถัดไป
                    </button>
                </div>
            </Content>
        </>
    )
}

export default CreateFirstBill;