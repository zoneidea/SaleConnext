import { FC } from 'react';

type Props = {
    DescriptionTH: string;
    ItemDescription: string;
    ItemCode: string;
    SerialNo: string;
    TeamSale: string;
    isSelected: boolean;
    onBorrow: () => void;
}

const CardMoveProduct: FC<Props> = ({
    DescriptionTH, ItemDescription, ItemCode, SerialNo, TeamSale, isSelected, onBorrow,
}) => {
    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className={`rounded border mb-3 px-7 py-7`}
                        style={{
                            backgroundColor: isSelected ? '#ACE1AF' : '#dbdfe9',
                            transition: 'background-color 0.2s ease, color 0.2s ease'
                        }}>
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <p className={`fw-bold fs-6 m-0`}>
                                    {DescriptionTH}
                                </p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <p className={`fw-bold fs-6 m-0`}>
                                    {ItemDescription}
                                </p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <span className={`fw-regular fs-7 d-block`}>
                                    Item Code: {ItemCode}
                                </span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <span className={`fw-regular fs-7 d-block`}>
                                    S/N: {SerialNo}
                                </span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <span className={`fw-regular fs-7 d-block`}>
                                    Team Sale: {TeamSale}
                                </span>
                            </div>
                        </div>

                        <div className="d-flex justify-content-lg-end justify-content-md-end gap-2 mt-7">
                            <button
                                type="button"
                                className="btn btn-sm btn-primary w-100 w-md-auto w-lg-150px"
                                onClick={onBorrow}
                            >
                                ยืมสินค้า
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            {/* เพิ่ม media query CSS เฉพาะในหน้าจอขนาดเล็ก */}
            <style>{`
                @media (max-width: 900px) {
                    .h-390px {
                        height: 150px; /* เพิ่มความสูงของการ์ดในหน้าจอขนาดเล็ก */
                    }
                }
            `}</style>
        </>
    );
}

export { CardMoveProduct };