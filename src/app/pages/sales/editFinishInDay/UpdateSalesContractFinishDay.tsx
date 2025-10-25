import styles from '@/styles/style.module.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios';
import clsx from 'clsx'
import { useState, useMemo, useEffect } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../../_metronic/helpers'
import { getLayoutFromLocalStorage, ILayout, LayoutSetup } from '../../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'
import { TablesWidget5 } from '../../../../_metronic/partials/widgets'
import { useAuth } from '../../../modules/auth/core/Auth';
import {
    useUUIDStore,
    useSaveProductStore,
    useSaveDiscountStore,
    useSaveCustomerStore,
    useSaveAddressStore
} from '../../../modules/stores/stepsStore';

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
    PRODUCT: any[],
    CUSTOMERSTATUS: any[],
    DISCOUNT: any[],
    CUSTOMERDETAIL: any[],
    ADDRESS: any[],
    PDPA: any[],
    CONTRACT: any[],
    IMAGE: any[],
    CHECKERCOMMENT: any[],
    NEWREFNO: String,
    SALEEMPLOYEE: any[],
}

interface ImagesType {
    IMAGECARD: string[];
    IMAGEGPS: string[];
    IMAGEMAP: string[];
    IMAGECUSTOMERHOME: string[];
    IMAGEINSTALLATION: string[];
    IMAGETDS: string[];
    IMAGECUSTOMER: string[];
    IMAGETRADEIN: string[];
}

const UpdateSalesContractFinishDay: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const MySwal = withReactContent(Swal);

    // const contNo = (location.state as ContractState)?.contNo;
    // console.log(`contNo`, contNo);

    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const { REFNO } = useUUIDStore();

    // const item = location.state as ItemProps || [];
    const item = (location.state as ItemProps) || ({} as ItemProps);

    // console.log(`item`, item);
    const refno = item?.REFNO
    // console.log(`refno`, refno);

    const product = item?.PRODUCT
    // console.log(`product`, product);
    const newRefNo = item?.CUSTOMERSTATUS[0]?.NEWREFNO
    // console.log(`contNo`, contNo);
    const customerDetail = item?.CUSTOMERDETAIL
    const address = item?.ADDRESS

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
    const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}&ProcessType=${auth.processtype}`
    const GET_IMAGES_API = `${API_URL_MONGO}/Contract/GetContractImage`;

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

    const { PRODUCT } = useSaveProductStore()
    // console.log(`PRODUCT`, PRODUCT[0].Package[0].PACKAGETYPEID);

    const { DISCOUNT } = useSaveDiscountStore()
    // console.log(`DISCOUNT`, DISCOUNT);

    const { saveCustomerTypes } = useSaveCustomerStore()
    // console.log(`saveCustomerTypes`, saveCustomerTypes);

    const { addressCard, addressInstallation, addressPayment } = useSaveAddressStore()
    // console.log(`addressCard`, addressCard)
    // console.log(`addressInstallation`, addressInstallation)
    // console.log(`addressPayment`, addressPayment)

    const totalPrice = product[0]?.Package[0]?.TOTALPRICE || 0;
    const discountAmount = item?.DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
    const netPrice = totalPrice - discountAmount;

    const [images, setImages] = useState<ImagesType | null>(null);
    // console.log(`images`, images);
    
    const handleNextClick = async () => {
        try {
            // 1) อัพเดตสัญญา (CONTRACT)
            const updateContract = await axios.post(UPDATECONTACT, {
                REFNO: refno,
                EMPID: EmpId,
                TEAMSALE: TeamSale,
                SALECODE: SaleCode,
                SUPEMPID: SupEmpId,
                SECEMPID: SecEmpId,
                FIELD: "CONTRACT",
                DATA: { createdAt: formattedDate }
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            // 2) ถ้าสำเร็จ ก็อัพเดตสถานะเป็น FINISH
            if (updateContract.status === 200) {
                const finishResponse = await axios.post(UPDATECONTACT, {
                    REFNO: refno,
                    EMPID: EmpId,
                    TEAMSALE: TeamSale,
                    SALECODE: SaleCode,
                    SUPEMPID: SupEmpId,
                    SECEMPID: SecEmpId,
                    // FIELD: 'STATUS',
                    // DATA: 'FINISH',
                    FIELD: "PAYMENT",
                    DATA: "DRAFT"
                }, {
                    headers: { 'Content-Type': 'application/json' },
                });
                // console.log(`finishResponse`, finishResponse);


                if (finishResponse.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'สำเร็จ!',
                        text: 'บันทึกสัญญาเรียบร้อยแล้ว',
                        timer: 2000,
                        showConfirmButton: false,
                    }).then(() => {
                        // console.log(`matchedItem`, matchedItem);

                        navigate('/firstBill/CreateFirstBill', {
                            state: {
                                item: item,
                                from: location.pathname
                            }
                        });
                    });
                } else {
                    throw new Error('อัพเดตสถานะไม่สำเร็จ');
                }
            } else {
                throw new Error('อัพเดตสัญญาไม่สำเร็จ');
            }

        } catch (error) {
            console.error('Error updating contract or status:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: 'ไม่สามารถบันทึกสัญญาได้ กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง'
            });
        }
    };

    const handleCheckerClick = async () => {
        const response = await axios.post(UPDATECONTACT, {
            REFNO: item.REFNO,
            EMPID: EmpId,
            TEAMSALE: TeamSale,
            FIELD: "STATUS",
            DATA: "PENDING",
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // console.log(response)

        if (response.status === 200) {
            if (!response.data.data) {
                MySwal.fire('เกิดข้อผิดพลาด', 'ส่งข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา', 'error');
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ!',
                    text: 'ส่งข้อมูลตรวจสอบแล้ว',
                    timer: 2000, // แสดงผล 3 วินาที
                    showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
                })
                navigate("/sale/overview")
            }
        } else {
            MySwal.fire('เกิดข้อผิดพลาด', response.data.message, 'error');
        }
    }

    // เช็คว่า data ใน item มีครบทุกขั้นตอน (ไม่เป็น array เปล่า) ใช่ไหม ถ้าเป็นจะ disabled ปุ่มส่งตรวจสอบ
    const isDataComplete = useMemo(() => {
        // ตรวจสอบว่ามีรูปภาพในฟิลด์ใดฟิลด์หนึ่งใน images อย่างน้อย 1 รูป
        const hasImages = images && Object.values(images).some(
            (field) => Array.isArray(field) && field.length > 0
        );

        return (
            Array.isArray(item.ADDRESS) && item.ADDRESS.length > 0 &&
            Array.isArray(item.CUSTOMERDETAIL) && item.CUSTOMERDETAIL.length > 0 &&
            Array.isArray(item.CUSTOMERSTATUS) && item.CUSTOMERSTATUS.length > 0 &&
            Array.isArray(item.DISCOUNT) && item.DISCOUNT.length > 0 &&
            Array.isArray(item.PDPA) && item.PDPA.length > 0 &&
            Array.isArray(item.PRODUCT) && item.PRODUCT.length > 0 &&
            hasImages
        );
    }, [item, images]);

    {/****** matchedItem *******/ }
    const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false);
    const [draft, setDraft] = useState<any[]>([]);

    useEffect(() => {
        const getDataDraft = async () => {
            setIsLoadingDraft(true);
            try {
                const response = await axios.get(DRAFT_ALLCONTRACT_URL);
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setDraft(data);
            } catch (error) {
                console.error('Error fetching DRAFT_ALLCONTRACT_URL:', error);
            } finally {
                setIsLoadingDraft(false);
            }
        };
        getDataDraft();
    }, []);

    // state ตัวเก็บ matchedItem
    const [matchedItem, setMatchedItem] = useState<ItemProps | null>(null);

    useEffect(() => {
        if (!isLoadingDraft) {
            const found = draft.find(d => d.REFNO === REFNO) || null;
            setMatchedItem(found);
        }
    }, [draft, isLoadingDraft]);

    {/****** matchedItem *******/ }

    const formatToBE = (isoDate?: string) => {
        if (!isoDate) return "";
        const d = new Date(isoDate);
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear() + 543;
        return `${dd}/${mm}/${yyyy}`;
    };

    const hasSignature = Boolean(item?.CONTRACT?.[0]?.signature?.trim());

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center my-5'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-ceดnter">
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            {product[0]?.Package[0]?.PACKAGETYPEID == 1 ? (
                                <li className={`breadcrumb-item ${styles.titlePage}`}>ใบสัญญา</li>
                            ) : (
                                <li className={`breadcrumb-item ${styles.titlePage}`}>ใบสัญญาเช่าซื้อ</li>
                            )}
                        </ul>
                    </div>
                </div>
                <span className={`${styles.label}`}>เลขที่ขาย: </span><span className={`${styles.titlePage}`}>{refno}</span>

                {/* Card Body */}
                <div className='card mb-10'>
                    <div className='card-body py-5'>

                        <div className='row my-7'>
                            <label className={`col-lg-4 text-muted ${styles.label}`}>วันที่ทำสัญญา</label>
                            <div className='col-lg-8'>
                                <span className={`${styles.label}`}>{formatToBE(formattedDate)}</span>
                            </div>
                        </div>

                        {item?.NEWREFNO && (
                            <div className='row mb-7'>
                                <label className={`col-lg-4 text-muted ${styles.label}`}>เลขที่สัญญา</label>
                                <div className='col-lg-8 fv-row'>
                                    <span className={`${styles.label}`}>{item?.NEWREFNO}</span>
                                </div>
                            </div>
                        )}

                        <div className="row align-items-center mb-10">
                            <label
                                className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
                            >
                                พนักงานขาย
                            </label>
                            <div className="col-lg-8 d-flex justify-content-between">
                                <span
                                    className={`fw-bolder text-gray-900 ${styles.fontSize}`}
                                >
                                    {item?.SALEEMPLOYEE[0]?.SALEEMPLOYEE.FName} {item?.SALEEMPLOYEE[0]?.SALEEMPLOYEE.LName} - {item?.SALEEMPLOYEE[0]?.SALEEMPLOYEE.SaleEmp}
                                </span>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label className={`col-lg-4 text-muted ${styles.label}`}>ชื่อลูกค้า</label>
                            <div className='col-lg-8'>
                                <span className={`${styles.label}`}>
                                    {customerDetail[0]?.PREFIX[0]?.PREFIXNAME && customerDetail[0]?.PREFIX[0]?.PREFIXNAME}{" "}
                                    {customerDetail[0]?.CUSTOMERNAME}{" "}
                                    {customerDetail[0]?.CUSTOMERLASTNAME && customerDetail[0]?.CUSTOMERLASTNAME}
                                </span>
                            </div>
                        </div>

                        {customerDetail[0]?.CUSTOMERID && (
                            <div className='row mb-7'>
                                {customerDetail[0].CUSTOMERTYPE === "1" ? (
                                    <label className={`col-lg-4 text-muted ${styles.label}`}>เลขประจำตัวผู้เสียภาษี</label>
                                ) : (
                                    <label className={`col-lg-4 text-muted ${styles.label}`}>เลขที่บัตรประชาชน</label>
                                )}
                                <div className='col-lg-8'>
                                    <span className={`${styles.label}`}>
                                        {customerDetail[0]?.CUSTOMERID}
                                    </span>
                                </div>
                            </div>
                        )}

                        {address[0]?.ADDRESSCARD?.ADDRESSNUMBER && (
                            <div className='row mb-7'>
                                <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่บัตรประชาชน</label>
                                <div className='col-lg-8'>
                                    <span className={`${styles.label}`}>
                                        {address[0]?.ADDRESSCARD?.ADDRESSNUMBER && `${address[0]?.ADDRESSCARD?.ADDRESSNUMBER}`}&nbsp;
                                        {address[0]?.ADDRESSCARD?.ADDRESSMOO && `หมู่ที่ ${address[0]?.ADDRESSCARD?.ADDRESSMOO}`}&nbsp;
                                        {address[0]?.ADDRESSCARD?.ADDRESSSOI && `ซอย${address[0]?.ADDRESSCARD?.ADDRESSSOI}`}&nbsp;
                                        {address[0]?.ADDRESSCARD?.ADDRESSROAD && `ถนน${address[0]?.ADDRESSCARD?.ADDRESSROAD}`}&nbsp;
                                        {address?.[0]?.ADDRESSCARD?.ADDRESSSUBDISTRICTNAME && (
                                            <>
                                                {address?.[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME === "กรุงเทพมหานคร" ? "แขวง" : "ตำบล"}
                                                {address[0].ADDRESSCARD.ADDRESSSUBDISTRICTNAME}
                                            </>
                                        )}{" "}
                                        {address?.[0]?.ADDRESSCARD?.ADDRESSDISTRICTNAME && (
                                            <>
                                                {address?.[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME === "กรุงเทพมหานคร" ? "เขต" : "อำเภอ"}
                                                {address[0].ADDRESSCARD.ADDRESSDISTRICTNAME}
                                            </>
                                        )}{" "}
                                        {address[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME && `จังหวัด${address[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
                                        {address[0]?.ADDRESSCARD?.ADDRESSZIPCODE && `${address[0]?.ADDRESSCARD?.ADDRESSZIPCODE}`}&nbsp;
                                    </span>
                                </div>
                            </div>
                        )}

                        {address[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER && (
                            <div className='row mb-10'>
                                <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่ติดตั้ง</label>
                                <div className='col-lg-8'>
                                    <span className={`${styles.label}`}>
                                        {address[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER && `${address[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER}`}&nbsp;
                                        {address[0]?.ADDRESSINSTALLATION?.ADDRESSMOO && `หมู่ที่ ${address[0]?.ADDRESSINSTALLATION?.ADDRESSMOO}`}&nbsp;
                                        {address[0]?.ADDRESSINSTALLATION?.ADDRESSSOI && `ซอย${address[0]?.ADDRESSINSTALLATION?.ADDRESSSOI}`}&nbsp;
                                        {address[0]?.ADDRESSINSTALLATION?.ADDRESSROAD && `ถนน${address[0]?.ADDRESSINSTALLATION?.ADDRESSROAD}`}&nbsp;
                                        {address?.[0]?.ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME && (
                                            <>
                                                {address?.[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME === "กรุงเทพมหานคร" ? "แขวง" : "ตำบล"}
                                                {address[0].ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME}
                                            </>
                                        )}{" "}
                                        {address?.[0]?.ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME && (
                                            <>
                                                {address?.[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME === "กรุงเทพมหานคร" ? "เขต" : "อำเภอ"}
                                                {address[0].ADDRESSINSTALLATION.ADDRESSDISTRICTNAME}
                                            </>
                                        )}{" "}
                                        {address[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME && `จังหวัด${address[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
                                        {address[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE && `${address[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE}`}&nbsp;
                                    </span>
                                </div>
                            </div>
                        )}

                        {address[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER && (
                            <div className='row mb-10'>
                                <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่เก็บเงิน</label>
                                <div className='col-lg-8'>
                                    <span className={`${styles.label}`}>
                                        {address[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER && `${address[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER}`}&nbsp;
                                        {address[0]?.ADDRESSPAYMENT?.ADDRESSMOO && `หมู่ที่ ${address[0]?.ADDRESSPAYMENT?.ADDRESSMOO}`}&nbsp;
                                        {address[0]?.ADDRESSPAYMENT?.ADDRESSSOI && `ซอย${address[0]?.ADDRESSPAYMENT?.ADDRESSSOI}`}&nbsp;
                                        {address[0]?.ADDRESSPAYMENT?.ADDRESSROAD && `ถนน${address[0]?.ADDRESSPAYMENT?.ADDRESSROAD}`}&nbsp;
                                        {address?.[0]?.ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME && (
                                            <>
                                                {address?.[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME === "กรุงเทพมหานคร" ? "แขวง" : "ตำบล"}
                                                {address[0].ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME}
                                            </>
                                        )}{" "}
                                        {address?.[0]?.ADDRESSPAYMENT?.ADDRESSDISTRICTNAME && (
                                            <>
                                                {address?.[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME === "กรุงเทพมหานคร" ? "เขต" : "อำเภอ"}
                                                {address[0].ADDRESSPAYMENT.ADDRESSDISTRICTNAME}
                                            </>
                                        )}{" "}
                                        {address[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME && `จังหวัด${address[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
                                        {address[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE && `${address[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE}`}&nbsp;
                                    </span>
                                </div>
                            </div>
                        )}

                        {address[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME && (
                            <div className='row mb-10'>
                                <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่เสึยภาษี</label>
                                <div className='col-lg-8'>
                                    <span className={`${styles.label}`}>
                                        {address[0]?.ADDRESSTAX?.ADDRESSNUMBER && `${address[0]?.ADDRESSTAX?.ADDRESSNUMBER}`}&nbsp;
                                        {address[0]?.ADDRESSTAX?.ADDRESSMOO && `หมู่ที่ ${address[0]?.ADDRESSTAX?.ADDRESSMOO}`}&nbsp;
                                        {address[0]?.ADDRESSTAX?.ADDRESSSOI && `ซอย${address[0]?.ADDRESSTAX?.ADDRESSSOI}`}&nbsp;
                                        {address[0]?.ADDRESSTAX?.ADDRESSROAD && `ถนน${address[0]?.ADDRESSTAX?.ADDRESSROAD}`}&nbsp;
                                        {address?.[0]?.ADDRESSTAX?.ADDRESSSUBDISTRICTNAME && (
                                            <>
                                                {address?.[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME === "กรุงเทพมหานคร" ? "แขวง" : "ตำบล"}
                                                {address[0].ADDRESSTAX.ADDRESSSUBDISTRICTNAME}
                                            </>
                                        )}{" "}
                                        {address?.[0]?.ADDRESSTAX?.ADDRESSDISTRICTNAME && (
                                            <>
                                                {address?.[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME === "กรุงเทพมหานคร" ? "เขต" : "อำเภอ"}
                                                {address[0].ADDRESSTAX.ADDRESSDISTRICTNAME}
                                            </>
                                        )}{" "}
                                        {address[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME && `จังหวัด${address[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME}`}&nbsp;&nbsp;
                                        {address[0]?.ADDRESSTAX?.ADDRESSZIPCODE && `${address[0]?.ADDRESSTAX?.ADDRESSZIPCODE}`}&nbsp;
                                    </span>
                                </div>
                            </div>
                        )}

                        < div className='row mb-10'>
                            <label className={`col-lg-4 text-muted ${styles.label}`}>เบอร์ที่ติดต่อได้</label>
                            <div className='col-lg-8'>
                                <span className={`${styles.label}`}>
                                    {customerDetail[0]?.CUSTOMERMOBILE ?
                                        customerDetail[0]?.CUSTOMERMOBILE :
                                        address[0]?.ADDRESSINSTALLATION?.ADDRESSPHONE}
                                </span>
                            </div>
                        </div>

                        {customerDetail[0]?.CUSTOMERPHONE && (
                            <div className="row mb-10">
                                <label
                                    className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
                                >
                                    เบอร์ที่ติดต่อได้ 2
                                </label>
                                <div className="col-lg-8">
                                    <span
                                        className={`fw-bolder text-gray-900 ${styles.fontSize}`}
                                    >
                                        {customerDetail[0]?.CUSTOMERPHONE}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className='row mb-10'>
                            <label className={`col-lg-4 text-muted ${styles.label}`}>สินค้า</label>
                            <div className='col-lg-8'>
                                <span className={`${styles.label}`}>{product[0]?.ItemDescription}</span>
                            </div>
                        </div>

                        {product[1]?.ItemDescription && (
                            <div className="row mb-10">
                                <label
                                    className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}
                                >
                                    สินค้าบันเดิล
                                </label>
                                <div className="col-lg-8">
                                    <span
                                        className={`fw-bolder text-gray-900 ${styles.fontSize}`}
                                    >
                                        {product[1]?.ItemDescription}
                                    </span>
                                </div>
                            </div>
                        )}

                        {product[0]?.Package[0]?.PACKAGETITLE && (
                            <div className='row mb-10'>
                                <label className={`col-lg-4 text-muted ${styles.label}`}>แพ็คเกจ</label>
                                <div className='col-lg-8'>
                                    <span className={`${styles.label}`}>{product[0]?.Package[0]?.PACKAGETITLE}</span>
                                </div>
                            </div>
                        )}

                        <div className='row align-items-center mb-10'>
                            <label className={`col-lg-4 text-muted ${styles.label}`}>ราคาสินค้า</label>
                            <div className='col-lg-8 d-flex justify-content-between'>
                                <span className={`${styles.label}`}>
                                    {product[0]?.Package[0]?.TOTALPRICE !== undefined
                                        ? product[0]?.Package[0]?.TOTALPRICE.toLocaleString()
                                        : '0'}
                                </span>
                                <span className='badge badge-light-success'>บาท</span>
                            </div>
                        </div>

                        {item?.DISCOUNT[0] && item?.DISCOUNT[0]?.TRADEIN?.HASTRADEIN !== 0 && (
                            <div className='row align-items-center mb-10'>
                                <label className={`col-lg-4 text-muted ${styles.label}`}>เครื่องเทิร์น</label>
                                <div className='col-lg-8 d-flex justify-content-between'>
                                    <span className={`${styles.label}`}>
                                        {item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME ? item?.DISCOUNT[0]?.TRADEIN?.TRADEINBRANDNAME : "ไม่มี"}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className='row align-items-center mb-10'>
                            <label className={`col-lg-4 text-muted ${styles.label}`}>ส่วนลด</label>
                            <div className='col-lg-8 d-flex justify-content-between'>
                                <span className={`${styles.label}`}>
                                    {typeof item?.DISCOUNT?.[0]?.DISCOUNTAMOUNT === 'number'
                                        ? item?.DISCOUNT?.[0]?.DISCOUNTAMOUNT.toLocaleString()
                                        : "ไม่มี"}
                                </span>
                                <span className='badge badge-light-success'>บาท</span>
                            </div>
                        </div>

                        {item?.DISCOUNT[0]?.GIFT && (
                            <div className='row align-items-center mb-10'>
                                <label className={`col-lg-4 text-muted ${styles.label}`}>ของแถม</label>
                                <div className='col-lg-8 d-flex justify-content-between'>
                                    <span className={`${styles.label}`}>
                                        {item?.DISCOUNT[0]?.GIFT?.GIFTNAME ? item?.DISCOUNT[0]?.GIFT?.GIFTNAME : "ไม่มี"}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className='row align-items-center mb-10'>
                            <label className={`col-lg-4 text-muted ${styles.label}`}>ราคาสุทธิ</label>
                            <div className='col-lg-8 d-flex justify-content-between'>
                                <span className={`${styles.label}`}>
                                    {netPrice !== undefined ? netPrice.toLocaleString() : '0'}
                                </span>
                                <span className='badge badge-light-success'>บาท</span>
                            </div>
                        </div>

                        {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
                        {product[0]?.Package[0]?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT !== undefined &&
                            product[0]?.Package[0]?.PACKAGETYPEID !== 1 && (
                                <>
                                    <div className='row align-items-center mb-10'>
                                        <label className={`col-lg-4 text-muted ${styles.label}`}>งวดที่ 1 ที่ต้องชำระ</label>
                                        <div className='col-lg-8 d-flex justify-content-between'>
                                            <span className={`${styles.label}`}>{(product[0]?.Package[0]?.PERIODDETAILS[0]?.PAYMENTAMOUNT - discountAmount).toLocaleString()}</span>
                                            <span className='badge badge-light-success'>บาท</span>
                                        </div>
                                    </div>

                                    {product[0]?.Package[0]?.PERIODDETAILS.length > 1 && (
                                        <div className='row align-items-center mb-10'>
                                            <label className={`col-lg-4 text-muted ${styles.label}`}>งวดที่ 2 ถึง {product[0]?.Package[0]?.PERIODDETAILS.length} ต้องชำระงวดละ</label>
                                            <div className='col-lg-8 d-flex justify-content-between'>
                                                <span className={`${styles.label}`}>{(product[0]?.Package[0]?.PERIODDETAILS[1]?.PAYMENTAMOUNT).toLocaleString()}</span>
                                                <span className='badge badge-light-success'>บาท</span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                        {/* ลายเซ็นลูกค้า (โชว์เมื่อมีใน item.CONTRACT[0].signature) */}
                        {hasSignature && (
                            <div className="mb-10">
                                <div className="row mb-7">
                                    <label className={`col-lg-4 text-muted ${styles.label}`}>ลายเซ็นลูกค้า</label>
                                    <div className="col-lg-8">
                                        <img
                                            src={`data:image/png;base64,${item.CONTRACT[0].signature}`}
                                            alt="signature"
                                            className="img-fluid"
                                            style={{ border: "1px solid #ccc", borderRadius: 4 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
                {/* End Card Body */}

                <div className='d-none d-xl-flex justify-content-between align-items-center my-5'>
                    <button
                        className={`${styles.btnSecondary}`}
                        onClick={() =>
                            navigate('/sale/editFinishInDay', { state: item })
                        }
                    >
                        ย้อนกลับ
                    </button>
                </div>

                {/* ปุ่มในหน้าจอเล็ก */}
                <div
                    className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
                    style={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1050,
                    }}
                >
                    <button
                        className={`${styles.btnSecondary}`}
                        onClick={() =>
                            navigate('/sale/editFinishInDay', { state: item })
                        }
                    >
                        ย้อนกลับ
                    </button>
                </div>

            </Content >
        </>
    )
}

export default UpdateSalesContractFinishDay