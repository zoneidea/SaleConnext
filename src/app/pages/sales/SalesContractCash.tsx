import styles from '@/styles/style.module.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios';
import clsx from 'clsx'
import { useState, useEffect, useRef } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { getLayoutFromLocalStorage, ILayout, LayoutSetup } from '../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'
import { TablesWidget5 } from '../../../_metronic/partials/widgets'
import { useAuth } from '../../modules/auth/core/Auth';
import SignaturePad from 'react-signature-pad-wrapper';
import {
    useUUIDStore,
    useSaveProductStore,
    useSaveDiscountStore,
    useSaveCustomerStore,
    useSaveAddressStore
} from '../../modules/stores/stepsStore';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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

const SalesContractCash: React.FC = () => {
    const navigate = useNavigate()

    // const location = useLocation();
    // const contNo = (location.state as ContractState)?.contNo;
    // console.log(`contNo`, contNo);

    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const { REFNO } = useUUIDStore();

    const [draft, setDraft] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
    const GET_ALL_CONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get(GET_ALL_CONTRACT_URL)
                // ตรวจสอบว่า response.data.data เป็น array หรือไม่
                if (response.data?.data && Array.isArray(response.data.data)) {
                    setDraft(response.data.data)
                }
            } catch (error) {
                console.error('Error fetching GetAllContract:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [GET_ALL_CONTRACT_URL])

    // ===== (5) หารายการที่มี REFNO ตรงกับ store =====
    const matchedItem = draft.find((item) => item.REFNO === REFNO)
    console.log('matchedItem =>', matchedItem)

    const totalPrice = matchedItem?.PRODUCT[0]?.Package[0]?.TOTALPRICE || 0;
    const discountAmount = matchedItem?.DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
    const netPrice = totalPrice - discountAmount;

    const contNoNew = matchedItem?.CUSTOMERSTATUS?.[0]?.CONTNO;
    // console.log('contNoNew', contNoNew); 

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

    // const { PRODUCT } = useSaveProductStore()
    // console.log(`PRODUCT`, PRODUCT[0]?.Package[0]?.PACKAGETYPEID);

    // const { DISCOUNT } = useSaveDiscountStore()
    // console.log(`DISCOUNT`, DISCOUNT);

    // const { saveCustomerTypes } = useSaveCustomerStore()
    // console.log(`saveCustomerTypes`, saveCustomerTypes);

    const { addressCard, addressInstallation, addressPayment, addressTax } = useSaveAddressStore()
    // console.log(`addressCard`, addressCard)
    // console.log(`addressInstallation`, addressInstallation)
    // console.log(`addressPayment`, addressPayment)

    // const totalPrice = PRODUCT[0]?.Package[0]?.TOTALPRICE || 0;
    // const discountAmount = DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
    // const netPrice = totalPrice - discountAmount;

    const signaturePadRef = useRef<any>(null);
    const [signatureDataURL, setSignatureDataURL] = useState<string | null>(null);

    const clearSignature = () => {
        signaturePadRef.current?.clear();
        setSignatureDataURL(null);
    };

    const saveSignature = () => {
        if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
            const dataUrl = signaturePadRef.current.toDataURL('image/png');
            setSignatureDataURL(dataUrl.replace(/^data:image\/png;base64,/, ''));
            signaturePadRef.current.clear();
        } else {
            Swal.fire('กรุณาลงชื่อก่อนบันทึก');
        }
    };

    const handleNextClick = async () => {
        try {
            const updateContract = await axios.post(UPDATECONTACT, {
                REFNO,
                EMPID: EmpId,
                TEAMSALE: TeamSale,
                SALECODE: SaleCode,
                SUPEMPID: SupEmpId,
                SECEMPID: SecEmpId,
                FIELD: "CONTRACT",
                DATA: {
                    createdAt: formattedDate,
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // console.log(`updateContract CONTRACT: `, updateContract.data);

            // แสดง SweetAlert2 หลังจากบันทึกสำเร็จ
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'บันทึกสัญญาเรียบร้อยแล้ว',
                timer: 2000, // แสดงผล 3 วินาที
                showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
            }).then(() => {
                navigate('/sale/photo'); // นำทางไปยังหน้าอื่นถ้าต้องการ
            });

        } catch (error) {
            console.error('Error fetching CONTRACT:', error);

            // แสดง SweetAlert2 เมื่อเกิดข้อผิดพลาด
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: 'ไม่สามารถบันทึกสัญญาได้ กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง'
            });
        }
    };

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center my-5'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <div className={`breadcrumb-item ${styles.titlePage}`}>
                            <span>ใบสัญญา</span>
                        </div>
                    </div>
                </div>
                <span className={`${styles.fontSize}`}>เลขที่ขาย: </span><span className={`${styles.titlePage}`}>{REFNO}</span>

                {/* Card Body */}
                <div className='card mb-10'>
                    <div className='card-body py-5'>

                        <div className='row mb-7'>
                            <label className={`col-lg-4 text-muted ${styles.label}`}>วันที่ทำสัญญา</label>
                            <div className='col-lg-8'>
                                <span className={`${styles.label}`}>{formattedDate}</span>
                            </div>
                        </div>

                        {/* <div className='row mb-7'>
              <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>เลขที่สัญญา</label>
              <div className='col-lg-8 fv-row'>
                <span className={`${styles.label}`}>{contNoNew}</span>
              </div>
            </div> */}

                        <div className='row mb-7'>
                            <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>REFNO</label>
                            <div className='col-lg-8 fv-row'>
                                <span className={`${styles.label}`}>{REFNO}</span>
                            </div>
                        </div>

                        {matchedItem?.CUSTOMERSTATUS?.[0]?.Customerstatus === true ||
                            matchedItem?.CUSTOMERDETAIL?.[0]?.CUSTOMERNAME && (
                                <div className='row mb-7'>
                                    <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>ชื่อ</label>
                                    <div className='col-lg-8'>
                                        <span className={`${styles.label}`}>
                                            {matchedItem?.CUSTOMERDETAIL[0]?.PREFIX[0]?.PREFIXNAME} {matchedItem?.CUSTOMERDETAIL[0]?.CUSTOMERNAME}
                                        </span>
                                    </div>
                                </div>
                            )}

                        {matchedItem?.CUSTOMERSTATUS[0]?.Customerstatus === true ||
                            matchedItem?.CUSTOMERDETAIL[0]?.CUSTOMERLASTNAME && (
                                <div className='row mb-7'>
                                    <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>นามสกุล</label>
                                    <div className='col-lg-8'>
                                        <span className={`${styles.label}`}>
                                            {matchedItem?.CUSTOMERDETAIL[0]?.CUSTOMERLASTNAME}
                                        </span>
                                    </div>
                                </div>
                            )}

                        {matchedItem?.CUSTOMERDETAIL?.[0].length > 0 && (
                            <div className="row mb-7">
                                {matchedItem?.CUSTOMERDETAIL?.[0].CUSTOMERTYPE === "1" ? (
                                    <>
                                        <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>
                                            เลขประจำตัวผู้เสียภาษีนิติบุคคล
                                        </label>
                                        <span className={`${styles.label}`}>
                                            {matchedItem?.CUSTOMERDETAIL?.[0].CUSTOMERID}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>
                                            เลขบัตรประชาชน
                                        </label>
                                        <span className={`${styles.label}`}>
                                            {matchedItem?.CUSTOMERDETAIL?.[0].CUSTOMERID}
                                        </span>
                                    </>
                                )}
                            </div>
                        )}

                        {matchedItem?.ADDRESS?.[0].ADDRESSCARD?.ADDRESSPROVINCENAME && (
                            <div className='row mb-7'>
                                <>
                                    <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>ที่อยู่บัตรประชาชน</label>
                                    <div className='col-lg-8'>
                                        <span className={`${styles.label}`}>
                                            {matchedItem?.ADDRESS?.[0].ADDRESSCARD?.ADDRESSNUMBER && `${matchedItem?.ADDRESS?.[0].ADDRESSCARD?.ADDRESSNUMBER}`}&nbsp;
                                            {matchedItem?.ADDRESS?.[0].ADDRESSCARD?.ADDRESSMOO && `หมู่ที่ ${matchedItem?.ADDRESS?.[0].ADDRESSCARD?.ADDRESSMOO}`}&nbsp;
                                            {matchedItem?.ADDRESS?.[0].ADDRESSCARD?.ADDRESSSOI && `ซอย ${matchedItem?.ADDRESS?.[0].ADDRESSCARD?.ADDRESSSOI}`}&nbsp;
                                            {matchedItem?.ADDRESS?.[0].ADDRESSCARD?.ADDRESSROAD && `ถนน ${matchedItem?.ADDRESS?.[0].ADDRESSCARD?.ADDRESSROAD}`}&nbsp;
                                            {matchedItem?.ADDRESS?.[0].ADDRESSCARD?.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${matchedItem?.ADDRESS?.[0].ADDRESSCARD?.ADDRESSSUBDISTRICTNAME}`}&nbsp;
                                            {matchedItem?.ADDRESS?.[0].ADDRESSCARD?.ADDRESSDISTRICTNAME && `อำเภอ ${matchedItem?.ADDRESS?.[0].ADDRESSCARD?.ADDRESSDISTRICTNAME}`}&nbsp;
                                            {matchedItem?.ADDRESS?.[0].ADDRESSCARD?.ADDRESSPROVINCENAME && `จังหวัด ${matchedItem?.ADDRESS?.[0].ADDRESSCARD?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
                                            {matchedItem?.ADDRESS?.[0].ADDRESSCARD?.ADDRESSZIPCODE && `${matchedItem?.ADDRESS?.[0].ADDRESSCARD?.ADDRESSZIPCODE}`}&nbsp;
                                        </span>
                                    </div>
                                </>
                            </div>
                        )}

                        {matchedItem?.ADDRESS?.[0].ADDRESSINSTALLATION?.ADDRESSPROVINCENAME && (
                            <div className='row mb-10'>
                                <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>ที่อยู่ติดตั้ง</label>
                                <div className='col-lg-8'>
                                    <span className={`${styles.label}`}>
                                        {matchedItem?.ADDRESS?.[0].ADDRESSINSTALLATION?.ADDRESSNUMBER}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSINSTALLATION?.ADDRESSMOO && `หมู่ที่ ${matchedItem?.ADDRESS?.[0].ADDRESSINSTALLATION?.ADDRESSMOO}`}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSINSTALLATION?.ADDRESSSOI && `ซอย ${matchedItem?.ADDRESS?.[0].ADDRESSINSTALLATION?.ADDRESSSOI}`}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSINSTALLATION?.ADDRESSROAD && `ถนน ${matchedItem?.ADDRESS?.[0].ADDRESSINSTALLATION?.ADDRESSROAD}`}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${matchedItem?.ADDRESS?.[0].ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME}`}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME && `อำเภอ ${matchedItem?.ADDRESS?.[0].ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME}`}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSINSTALLATION?.ADDRESSPROVINCENAME && `จังหวัด ${matchedItem?.ADDRESS?.[0].ADDRESSINSTALLATION?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSINSTALLATION?.ADDRESSZIPCODE && `${matchedItem?.ADDRESS?.[0].ADDRESSINSTALLATION?.ADDRESSZIPCODE}`}&nbsp;
                                    </span>
                                </div>
                            </div>
                        )}

                        {matchedItem?.ADDRESS?.[0].ADDRESSPAYMENT?.ADDRESSPROVINCENAME && (
                            <div className='row mb-10'>
                                <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>ที่อยู่เก็บเงิน</label>
                                <div className='col-lg-8'>
                                    <span className={`${styles.label}`}>
                                        {matchedItem?.ADDRESS?.[0].ADDRESSPAYMENT?.ADDRESSNUMBER}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSPAYMENT?.ADDRESSMOO && `หมู่ที่ ${matchedItem?.ADDRESS?.[0].ADDRESSPAYMENT?.ADDRESSMOO}`}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSPAYMENT?.ADDRESSSOI && `ซอย ${matchedItem?.ADDRESS?.[0].ADDRESSPAYMENT?.ADDRESSSOI}`}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSPAYMENT?.ADDRESSROAD && `ถนน ${matchedItem?.ADDRESS?.[0].ADDRESSPAYMENT?.ADDRESSROAD}`}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${matchedItem?.ADDRESS?.[0].ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME}`}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSPAYMENT?.ADDRESSDISTRICTNAME && `อำเภอ ${matchedItem?.ADDRESS?.[0].ADDRESSPAYMENT?.ADDRESSDISTRICTNAME}`}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSPAYMENT?.ADDRESSPROVINCENAME && `จังหวัด ${matchedItem?.ADDRESS?.[0].ADDRESSPAYMENT?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSPAYMENT?.ADDRESSZIPCODE && `${matchedItem?.ADDRESS?.[0].ADDRESSPAYMENT?.ADDRESSZIPCODE}`}&nbsp;
                                    </span>
                                </div>
                            </div>
                        )}

                        {matchedItem?.ADDRESS?.[0].ADDRESSTAX?.ADDRESSPROVINCENAME && (
                            <div className='row mb-10'>
                                <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>ที่อยู่เสึยภาษี</label>
                                <div className='col-lg-8'>
                                    <span className={`${styles.label}`}>
                                        {matchedItem?.ADDRESS?.[0].ADDRESSTAX?.ADDRESSNUMBER}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSTAX?.ADDRESSMOO && `หมู่ที่ ${matchedItem?.ADDRESS?.[0].ADDRESSTAX?.ADDRESSMOO}`}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSTAX?.ADDRESSSOI && `ซอย ${matchedItem?.ADDRESS?.[0].ADDRESSTAX?.ADDRESSSOI}`}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSTAX?.ADDRESSROAD && `ถนน ${matchedItem?.ADDRESS?.[0].ADDRESSTAX?.ADDRESSROAD}`}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSTAX?.ADDRESSSUBDISTRICTNAME && `ตำบล / แขวง ${matchedItem?.ADDRESS?.[0].ADDRESSTAX?.ADDRESSSUBDISTRICTNAME}`}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSTAX?.ADDRESSDISTRICTNAME && `อำเภอ ${matchedItem?.ADDRESS?.[0].ADDRESSTAX?.ADDRESSDISTRICTNAME}`}&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSTAX?.ADDRESSPROVINCENAME && `จังหวัด ${matchedItem?.ADDRESS?.[0].ADDRESSTAX?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
                                        {matchedItem?.ADDRESS?.[0].ADDRESSTAX?.ADDRESSZIPCODE && `${matchedItem?.ADDRESS?.[0].ADDRESSTAX?.ADDRESSZIPCODE}`}&nbsp;
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className='row mb-10'>
                            <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>เบอร์โทรติดต่อ</label>
                            <div className='col-lg-8'>
                                <span className={`${styles.label}`}>{matchedItem?.ADDRESS?.[0].ADDRESSINSTALLATION?.ADDRESSPHONE}</span>
                            </div>
                        </div>

                        <div className='row mb-10'>
                            <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>สินค้า</label>
                            <div className='col-lg-8'>
                                <span className={`${styles.label}`}>{matchedItem?.PRODUCT?.[0].ItemDescription}</span>
                            </div>
                        </div>

                        {matchedItem?.PRODUCT?.[0].Package?.[0].PACKAGETITLE && (
                            <div className='row mb-10'>
                                <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>แพ็คเกจ</label>
                                <div className='col-lg-8'>
                                    <span className={`${styles.label}`}>{matchedItem?.PRODUCT?.[0].Package?.[0].PACKAGETITLE}</span>
                                </div>
                            </div>
                        )}

                        {matchedItem?.DISCOUNT[0]?.GIFT?.GIFTNAME && (
                            <div className='row align-items-center mb-10'>
                                <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>ของแถม</label>
                                <div className='col-lg-8 d-flex justify-content-between'>
                                    <span className={`${styles.label}`}>
                                        {matchedItem?.DISCOUNT[0]?.GIFT?.GIFTNAME ? matchedItem?.DISCOUNT[0]?.GIFT?.GIFTNAME : "ไม่มี"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {matchedItem?.PRODUCT[0]?.Package?.[0]?.TOTALPRICE && (
                            <div className='row align-items-center mb-10'>
                                <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>ราคาสินค้า</label>
                                <div className='col-lg-8 d-flex justify-content-between'>
                                    <span className={`${styles.label}`}>
                                        {(matchedItem?.PRODUCT[0]?.Package[0]?.TOTALPRICE).toLocaleString()}
                                    </span>
                                    <span className='badge badge-light-success'>บาท</span>
                                </div>
                            </div>
                        )}

                        {matchedItem?.DISCOUNT[0] && matchedItem?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME && (
                            <div className='row align-items-center mb-10'>
                                <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>เครื่องเทิร์น</label>
                                <div className='col-lg-8 d-flex justify-content-between'>
                                    <span className={styles.label}>
                                        {matchedItem?.DISCOUNT?.[0]?.TRADEIN ? (
                                            <>
                                                {matchedItem.DISCOUNT[0].TRADEIN.TRADEINBRANDNAME || ''}<br />
                                                Model: {matchedItem.DISCOUNT[0].TRADEIN.TRADEINMODEL || ''}<br />
                                                S/N: {matchedItem.DISCOUNT[0].TRADEIN.TRADEINSERIAL || ''}
                                            </>
                                        ) : (
                                            'ไม่มี'
                                        )}
                                    </span>
                                </div>
                            </div>
                        )}

                        {matchedItem?.DISCOUNT[0]?.DISCOUNTAMOUNT && (
                            <div className='row align-items-center mb-10'>
                                <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>ส่วนลด</label>
                                <div className='col-lg-8 d-flex justify-content-between'>
                                    <span className={`${styles.label}`}>
                                        {matchedItem?.DISCOUNT[0]?.DISCOUNTAMOUNT ? (matchedItem?.DISCOUNT[0]?.DISCOUNTAMOUNT).toLocaleString() : "ไม่มี"}
                                    </span>
                                    <span className='badge badge-light-success'>บาท</span>
                                </div>
                            </div>
                        )}

                        <div className='row align-items-center mb-10'>
                            <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>ราคาสุทธิ</label>
                            <div className='col-lg-8 d-flex justify-content-between'>
                                <span className={`${styles.label}`}>{(netPrice).toLocaleString()}</span>
                                <span className='badge badge-light-success'>บาท</span>
                            </div>
                        </div>

                    </div>
                </div>
                {/* End Card Body */}

                <div className='d-none d-xl-flex justify-content-end align-items-center mt-5 mb-10'>
                    {/* <button
            className={`${styles.btnSecondary}`}
            onClick={handleNextClick}
          >
            ย้อนกลับ
          </button> */}
                    <button
                        className={`${styles.btnPrimary}`}
                        type='button'
                        onClick={handleNextClick}
                    >
                        บันทึกสัญญา
                    </button>
                </div>

                {/* ปุ่มในหน้าจอเล็ก */}
                <div
                    className="d-flex d-xl-none justify-content-end align-items-center bg-light p-3 border-top"
                    style={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1050,
                    }}
                >
                    {/* <button
            className={`${styles.btnSecondary}`}
            onClick={handleNextClick}
          >
            ย้อนกลับ
          </button> */}
                    <button
                        className={`${styles.btnPrimary}`}
                        onClick={handleNextClick}
                    >
                        บันทึกสัญญา
                    </button>
                </div>

            </Content>
        </>
    )
}

export default SalesContractCash