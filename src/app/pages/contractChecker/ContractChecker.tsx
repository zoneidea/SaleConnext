import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { getLayoutFromLocalStorage, ILayout, LayoutSetup } from '../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'
import { TablesWidget5 } from '../../../_metronic/partials/widgets'
import { useAuth } from '../../modules/auth/core/Auth';
import { SalesItemNumber } from '../sales/components/salesItemNumber/SalesItemNumber';
import {
    useUUIDStore,
    useSaveProductStore,
    useSaveDiscountStore,
    useSaveCustomerStore,
    useSaveAddressStore
} from '../../modules/stores/stepsStore';

import { EntriesDropdown, PaginationTable } from '../../modules/entriesAndPagination/Pagination';
import { ThreeDot } from 'react-loading-indicators';

const ContractChecker: React.FC = () => {
    const navigate = useNavigate()

    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    // const { REFNO } = useUUIDStore();

    // const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    // const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

    // const currentDate = new Date();
    // const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

    // const { PRODUCT } = useSaveProductStore()
    // // console.log(`PRODUCT`, PRODUCT[0].Package[0].PACKAGETYPEID);

    // const { DISCOUNT } = useSaveDiscountStore()
    // // console.log(`DISCOUNT`, DISCOUNT);

    // const { saveCustomerTypes } = useSaveCustomerStore()
    // // console.log(`saveCustomerTypes`, saveCustomerTypes);

    // const { addressCard, addressInstallation, addressPayment } = useSaveAddressStore()
    // // console.log(`addressCard`, addressCard)
    // // console.log(`addressInstallation`, addressInstallation)
    // // console.log(`addressPayment`, addressPayment)

    // const totalPrice = PRODUCT[0]?.Package[0]?.TOTALPRICE || 0;
    // const discountAmount = DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
    // const netPrice = totalPrice - discountAmount;

    // const handleNextClick = async () => {
    //     try {
    //         const updateContract = await axios.post(UPDATECONTACT, {
    //             REFNO,
    //             EMPID: EmpId,
    //             TEAMSALE: TeamSale,
    //             SALECODE: SaleCode,
    //             SUPEMPID: SupEmpId,
    //             SECEMPID: SecEmpId,
    //             FIELD: "CONTRACT",
    //             DATA: { createdAt: formattedDate }
    //         }, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //         console.log(`updateContract CONTRACT: `, updateContract.data);
    //         navigate('/sale/photo');
    //     } catch (error) {
    //         console.error('Error fetching CONTRACT:', error);
    //     }
    // };

    const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO;
    const PENDING_ALLCONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/GetContractForCheck?supemp=${SupEmpId}&secemp=${SecEmpId}`;

    const [pending, setPending] = useState<any[]>([]); // กำหนดให้ state เป็น array เพื่อรองรับ map()

    const [isLoadingFinish, setIsLoadingFinish] = useState<boolean>(false);
    const [searchRefNo, setSearchRefNo] = useState<string>(''); // State สำหรับค้นหา

    // Pagination states
    const [entries, setEntries] = useState<number>(10); // Default entries per page
    const [currentPageFinish, setCurrentPageFinish] = useState<number>(1);

    useEffect(() => {
        const getDataPending = async () => {
            setIsLoadingFinish(true);
            try {
                const response = await axios.get(PENDING_ALLCONTRACT_URL, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setPending(data); // บันทึกข้อมูล
            } catch (error) {
                console.error('Error fetching PENDING_ALLCONTRACT_URL:', error);
            } finally {
                setIsLoadingFinish(false);
            }
        };
        getDataPending();
    }, []);

    // กรองข้อมูลตาม REFNO
    const filteredFinish = pending.filter((item) =>
        item.REFNO?.toLowerCase().includes(searchRefNo.toLowerCase())
    );

    // Pagination logic for Finish
    const finishStartIndex = (currentPageFinish - 1) * entries;
    const finishDisplayedData = filteredFinish.slice(finishStartIndex, finishStartIndex + entries);

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-7 mt-lg-0'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            <span>
                                ระบบตรวจสัญญา
                            </span>
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
                                    ระบบตรวจสัญญา
                                </a></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">ระบบตรวจสัญญา</li>
                        </ul>
                    </div>
                </div>

                {/* Card Body */}
                <div className='card mb-10'>
                    <div className='card-body d-flex align-items-center'>
                        <div className='col-12'>

                            {/* ช่องค้นหา */}
                            <div className="mb-5 col-xl-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ค้นหาจาก REFNO"
                                    value={searchRefNo}
                                    onChange={(e) => setSearchRefNo(e.target.value)}
                                />
                            </div>

                            {isLoadingFinish ? (
                                <div className="text-center my-10">
                                    <ThreeDot />
                                    <p className="text-gray-600 mt-3">กำลังโหลดรายการ...</p>
                                </div>
                            ) : pending.length > 0 ? (
                                <>
                                    {pending.map((item, index) => (
                                        <SalesItemNumber key={index} status="PENDING" item={item} />
                                    ))}

                                    <div className='d-none d-xl-flex justify-content-end align-items-center mt-5'>
                                        <PaginationTable
                                            totalData={filteredFinish.length}
                                            entries={entries}
                                            currentPage={currentPageFinish}
                                            onPageChange={setCurrentPageFinish}
                                        />
                                    </div>

                                    {/* PaginationTable หน้าจอเล็ก */}
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
                                        <PaginationTable
                                            totalData={filteredFinish.length}
                                            entries={entries}
                                            currentPage={currentPageFinish}
                                            onPageChange={setCurrentPageFinish}
                                        />
                                    </div>
                                </>

                            ) : (
                                <p className="text-gray-600 text-center mt-3">ไม่มีรายการที่ต้องตรวจสอบ</p>
                            )}
                        </div>
                    </div>
                </div>
                {/* End Card Body */}
            </Content>
        </>
    )
}

export default ContractChecker