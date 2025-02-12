import { FC } from 'react'
import { KTIcon } from '../../../../../_metronic/helpers'

type Props = {
    customerStatus: any[];
    handleCheckStatusCustomer: () => void; 
}

const UpdateCardStatusCustomer: FC<Props> = ({ customerStatus, handleCheckStatusCustomer }) => {  // เพิ่ม handleNextClick ที่นี่
    console.log(`customerStatus`, customerStatus);

    return (
        <>
            {customerStatus?.map((customer, index) => (
                <div 
                    key={index} 
                    className="card border mb-3 cursor-pointer"  // เพิ่ม cursor-pointer เพื่อแสดงว่าเป็น clickable
                    onClick={handleCheckStatusCustomer}  // เรียก handleNextClick เมื่อคลิกการ์ด
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
            ))}
        </>
    )
}

export { UpdateCardStatusCustomer }