import { FC, useState, useMemo } from 'react'
import Swal from 'sweetalert2'
import { KTIcon } from '../../../../../_metronic/helpers'

type Props = {
    customerStatus: any[];
    handleCheckStatusCustomer: (customer: any) => void;
}

const CardStatusCustomer: FC<Props> = ({ customerStatus, handleCheckStatusCustomer }) => {
    // จำนวนการ์ดที่จะแสดงเริ่มต้น
    const [visibleCount, setVisibleCount] = useState(10);

    // รายการการ์ดที่จะแสดง
    const visibleList = useMemo(
        () => customerStatus.slice(0, visibleCount),
        [customerStatus, visibleCount]
    );

    return (
        <>
            <div className="row">
                {visibleList.map((customer, index) => (
                    <div className='col-12 col-md-6 col-xl-4 mb-3' key={index}>
                        <div
                            className="card border mb-3 cursor-pointer"
                            onClick={() => {
                                // แสดง SweetAlert ก่อนดำเนินการต่อ
                                Swal.fire({
                                    icon: 'info',
                                    title: customer.CustomerStatus,
                                    text: customer.Message || '',
                                }).then(() => handleCheckStatusCustomer(customer));
                            }}
                        >
                            <div className="d-flex justify-content-between
                                flex-column flex-sm-row align-items-center h-auto h-sm-50px px-5 py-4 py-sm-0 rounded-top"
                                style={{ backgroundColor: '#3777bc' }}>
                                <div className="card-title flex-column flex-sm-row mb-2 mb-sm-0
                                    d-flex align-items-center pt-3 pt-sm-0">
                                    <KTIcon iconName="abstract-26" className="fs-3 me-2 me-sm-5 text-white d-none d-sm-block" />
                                    <span className="card-label fw-bold fs-lg-6 fs-sm-8 text-white">
                                        เลขที่สัญญา {customer.CONTNO}
                                    </span>
                                </div>
                                <div className="card-title flex-column flex-sm-row mb-2 mb-sm-0
                                    d-flex align-items-center pt-3 pt-sm-0">
                                    <KTIcon iconName="abstract-26" className="fs-3 me-2 me-sm-5 text-white d-none d-sm-block" />
                                    <span className="card-label fw-bold fs-lg-6 fs-sm-8 text-white">
                                        {customer.CustomerStatus} ( {customer.Contract.AgingCumulativeDetail} )&nbsp;{customer.Contract.StDate}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="card-body bg-light-subtle">
                                <div className="row">
                                    {/* Customer Information */}
                                    <div className="col-md-6 mb-8">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <p className="text-gray-800 fw-bold fs-6 m-0">ลูกค้า</p>
                                                <span className="text-muted fw-semibold d-block">
                                                    {customer.Contract.PrefixName} {customer.Contract.CustomerName}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Install Date */}
                                    <div className="col-md-6 mb-8">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <p className="text-gray-800 fw-bold fs-6 m-0">วันที่ติดตั้ง</p>
                                                <span className="text-muted fw-semibold d-block">
                                                    {customer.Contract.EffDate}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="col-md-6 mb-8">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <p className="text-gray-800 fw-bold fs-6 m-0">สินค้า</p>
                                                <span className="text-muted fw-semibold d-block">
                                                    {customer.Contract.ProductName}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Model Info */}
                                    <div className="col-md-6 mb-8">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <p className="text-gray-800 fw-bold fs-6 m-0">รุ่น</p>
                                                <span className="text-muted fw-semibold d-block">
                                                    {customer.Contract.ProductModel}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Info */}
                                    <div className="col-md-12">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <p className="text-gray-800 fw-bold fs-6 m-0">ที่อยู่</p>
                                                <span className="text-muted fw-semibold d-block">
                                                    {[
                                                        customer.Contract.Address[0]?.AddressDetail,
                                                        customer.Contract.Address[0]?.Amphur,
                                                        customer.Contract.Address[0]?.District,
                                                        customer.Contract.Address[0]?.Province,
                                                        customer.Contract.Address[0]?.Zipcode
                                                    ]
                                                        .filter(Boolean)
                                                        .join(' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ปุ่มโหลดการ์ดเพิ่มเติม */}
            {visibleCount < customerStatus.length && (
                <div className="text-center mt-4">
                    <button
                        className="btn btn-link"
                        onClick={() => setVisibleCount(prev => prev + 10)}
                    >
                        ดูข้อมูลเพิ่มเติม
                    </button>
                </div>
            )}
        </>
    )
}

export { CardStatusCustomer }