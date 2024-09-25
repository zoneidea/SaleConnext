import { FC } from 'react';

type Props = {
    DescriptionTH: string;
    ItemDescription: string;
    ItemCode: string;
    SerialNo: string;
}

const CardProduct: FC<Props> = ({ DescriptionTH, ItemDescription, ItemCode, SerialNo }) => {
    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className="card border mb-3">
                        <div className="bg-light-subtle h-390px px-5 py-5">
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <p className="text-gray-800 text-hover-primary fw-bold fs-6 m-0">
                                        {DescriptionTH}
                                    </p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <p className="text-gray-800 text-hover-primary fw-bold fs-6 m-0">
                                        {ItemDescription}
                                    </p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <span className="text-muted fw-semibold d-block">Code: {ItemCode}</span>
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <span className="text-muted fw-semibold d-block">S/N: {SerialNo}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export { CardProduct };