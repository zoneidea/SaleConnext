import { FC } from 'react'
import { KTIcon } from '../../../../../_metronic/helpers'

type Props = {
    // contractNumber: string
    // company: string
    // installationDate: string
    // product: string
    // model: string
    // address: string
    icon: string
    title: string
    description: string
}

const CardStatusCustomer: FC<Props> = ({ }) => {
    return (
        <>
            <div className="card border mb-3 ">
                <div className="d-flex justify-content-between 
                flex-column flex-sm-row align-items-center h-auto h-sm-50px px-5 py-4 py-sm-0 rounded-top"
                    style={{ backgroundColor: '#3777bc' }}>
                    <div className="card-title flex-column flex-sm-row mb-2 mb-sm-0 
                    d-flex align-items-center pt-3 pt-sm-0">
                        <KTIcon iconName="abstract-26" className="fs-3 me-2 me-sm-5 text-white d-none d-sm-block" />
                        <span className="card-label fw-bold fs-lg-6 fs-sm-8 text-white">
                            เลขที่สัญญา {"20171394"}
                        </span>
                    </div>
                    <div className="card-title flex-column flex-sm-row mb-2 mb-sm-0 
                    d-flex align-items-center pt-3 pt-sm-0">
                        <KTIcon iconName="abstract-26" className="fs-3 me-2 me-sm-5 text-white d-none d-sm-block" />
                        <span className="card-label fw-bold fs-lg-6 fs-sm-8 text-white">
                            F จ่ายครบ
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
                                        บริษัท
                                    </p>
                                    <span className="text-muted fw-semibold d-block">Due in 2 Days</span>
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
                                    <span className="text-muted fw-semibold d-block">Due in 2 Days</span>
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
                                    <span className="text-muted fw-semibold d-block">Due in 2 Days</span>
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
                                    <span className="text-muted fw-semibold d-block">Due in 2 Days</span>
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
                                    <span className="text-muted fw-semibold d-block">Due in 2 Days</span>
                                </div>
                                {/* end::Description */}
                            </div>
                        </div>
                        {/* end::Item */}
                    </div>
                </div>
                {/* end::card body */}

            </div>

        </>
    )
}

export { CardStatusCustomer }
