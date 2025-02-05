import { FC } from 'react'
import { KTIcon } from '../../../../../_metronic/helpers'

type Props = {
    customerStatus: any[];
}

const CardStatusCustomer: FC<Props> = ({ customerStatus }) => {
    console.log(`customerStatus`, customerStatus);

    return (
        <>
            {customerStatus?.map((customer, index) => (
                <div className="card border mb-3 ">
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

                    {/* begin::card body */}
                    <div className="card-body bg-light-subtle">
                        <div className="row">
                            {/* begin::Item */}
                            <div className="col-md-6 mb-8">
                                <div className="d-flex align-items-center">
                                    {/* begin::Checkbox */}
                                    <div className="form-check form-check-custom form-check-solid me-3">
                                        <input className="form-check-input" type="checkbox" value="" />
                                    </div>
                                    {/* end::Checkbox */}
                                    {/* begin::Description */}
                                    <div className="flex-grow-1">
                                        <p className="text-gray-800 text-hover-primary fw-bold fs-6 m-0">
                                            ลูกค้า
                                        </p>
                                        <span className="text-muted fw-semibold d-block">{customer.Contract.PrefixName}&nbsp;{customer.Contract.CustomerName}</span>
                                    </div>
                                    {/* end::Description */}
                                </div>
                            </div>
                            {/* end::Item */}

                            {/* begin::Item */}
                            <div className="col-md-6 mb-8">
                                <div className="d-flex align-items-center">
                                    {/* begin::Checkbox */}
                                    <div className="form-check form-check-custom form-check-solid me-3">
                                        <input className="form-check-input" type="checkbox" value="" />
                                    </div>
                                    {/* end::Checkbox */}
                                    {/* begin::Description */}
                                    <div className="flex-grow-1">
                                        <p className="text-gray-800 text-hover-primary fw-bold fs-6 m-0">
                                            วันที่ติดตั้ง
                                        </p>
                                        <span className="text-muted fw-semibold d-block">{customer.Contract.EffDate}</span>
                                    </div>
                                    {/* end::Description */}
                                </div>
                            </div>
                            {/* end::Item */}

                            {/* begin::Item */}
                            <div className="col-md-6 mb-8">
                                <div className="d-flex align-items-center">
                                    {/* begin::Checkbox */}
                                    <div className="form-check form-check-custom form-check-solid me-3">
                                        <input className="form-check-input" type="checkbox" value="" />
                                    </div>
                                    {/* end::Checkbox */}
                                    {/* begin::Description */}
                                    <div className="flex-grow-1">
                                        <p className="text-gray-800 text-hover-primary fw-bold fs-6 m-0">
                                            สินค้า
                                        </p>
                                        <span className="text-muted fw-semibold d-block">{customer.Contract.ProductName}</span>
                                    </div>
                                    {/* end::Description */}
                                </div>
                            </div>
                            {/* end::Item */}

                            {/* begin::Item */}
                            <div className="col-md-6 mb-8">
                                <div className="d-flex align-items-center">
                                    {/* begin::Checkbox */}
                                    <div className="form-check form-check-custom form-check-solid me-3">
                                        <input className="form-check-input" type="checkbox" value="" />
                                    </div>
                                    {/* end::Checkbox */}
                                    {/* begin::Description */}
                                    <div className="flex-grow-1">
                                        <p className="text-gray-800 text-hover-primary fw-bold fs-6 m-0">
                                            รุ่น
                                        </p>
                                        <span className="text-muted fw-semibold d-block">{customer.Contract.ProductModel}</span>
                                    </div>
                                    {/* end::Description */}
                                </div>
                            </div>
                            {/* end::Item */}

                            {/* begin::Item */}
                            <div className="col-md-6">
                                <div className="d-flex align-items-center">
                                    {/* begin::Checkbox */}
                                    <div className="form-check form-check-custom form-check-solid me-3">
                                        <input className="form-check-input" type="checkbox" value="" />
                                    </div>
                                    {/* end::Checkbox */}
                                    {/* begin::Description */}
                                    <div className="flex-grow-1">
                                        <p className="text-gray-800 text-hover-primary fw-bold fs-6 m-0">
                                            ที่อยู่
                                        </p>
                                        <span className="text-muted fw-semibold d-block">
                                            {[
                                                customer.Contract.Address[0]?.AddressDetail,
                                                customer.Contract.Address[0]?.AddressDetail2,
                                                customer.Contract.Address[0]?.AddressDetail3,
                                                customer.Contract.Address[0]?.AddressDetail4,
                                                customer.Contract.Address[0]?.Amphur,
                                                customer.Contract.Address[0]?.District,
                                                customer.Contract.Address[0]?.Province,
                                                customer.Contract.Address[0]?.Zipcode
                                            ]
                                                .filter(Boolean)
                                                .join(' ')}
                                        </span>
                                    </div>
                                    {/* end::Description */}
                                </div>
                            </div>
                            {/* end::Item */}
                        </div>
                    </div>
                    {/* end::card body */}

                </div>
            ))}
        </>
    )
}

export { CardStatusCustomer }
