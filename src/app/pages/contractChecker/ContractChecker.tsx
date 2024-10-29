import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import clsx from 'clsx'
import { useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { getLayoutFromLocalStorage, ILayout, LayoutSetup } from '../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'
import { TablesWidget5 } from '../../../_metronic/partials/widgets'
import { useAuth } from '../../modules/auth/core/Auth';
import {
    useUUIDStore,
    useSaveProductStore,
    useSaveDiscountStore,
    useSaveCustomerStore,
    useSaveAddressStore
} from '../../modules/stores/stepsStore';

const ContractChecker: React.FC = () => {
    const navigate = useNavigate()

    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const { REFNO } = useUUIDStore();

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

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

    const totalPrice = PRODUCT[0]?.Package[0]?.TOTALPRICE || 0;
    const discountAmount = DISCOUNT[0]?.DISCOUNTAMOUNT || 0;
    const netPrice = totalPrice - discountAmount;

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
                DATA: { createdAt: formattedDate }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(`updateContract CONTRACT: `, updateContract.data);
            navigate('/sale/photo');
        } catch (error) {
            console.error('Error fetching CONTRACT:', error);
        }
    };

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
                <p>เลขที่ขาย: {REFNO}</p>

                <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                    <Link to='/sale/createcust' className='btn btn-secondary w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px'>
                        ย้อนกลับ
                    </Link>
                    <button className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'
                        type='button'
                        onClick={handleNextClick}
                    >
                        บันทึกสัญญา
                    </button>
                </div>

            </Content>
        </>
    )
}

export default ContractChecker