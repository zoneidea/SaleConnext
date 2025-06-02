import { FC } from 'react';

type Props = {
    DescriptionTH: string;
    ItemDescription: string;
    ItemCode: string;
    SerialNo: string;
    onAccept: () => void;          // <-- เพิ่ม prop นี้
}

const CardProductStockWithdraw: FC<Props> = ({
    DescriptionTH,
    ItemDescription,
    ItemCode,
    SerialNo,
    onAccept,
}) => {
    return (
        <div
            className={`rounded border mb-3 px-7 py-7`}
            style={{
                backgroundColor: '#dbdfe9',
                transition: 'background-color 0.2s ease, color 0.2s ease',
            }}
        >
            <div className="d-flex align-items-center mb-2">
                <p className="fw-bold fs-6 m-0">{DescriptionTH}</p>
            </div>
            <div className="d-flex align-items-center mb-2">
                <p className="fw-bold fs-6 m-0">{ItemDescription}</p>
            </div>
            <div className="d-flex align-items-center mb-2">
                <span className="fw-regular fs-7 d-block">Code: {ItemCode}</span>
            </div>
            <div className="d-flex align-items-center mb-4">
                <span className="fw-regular fs-7 d-block">S/N: {SerialNo}</span>
            </div>

            <div className="d-flex justify-content-lg-center justify-content-md-center gap-2 mt-7">
                <button
                    type="button"
                    className="btn btn-sm btn-primary w-100 w-md-auto w-lg-150px"
                    onClick={onAccept}
                >
                    รับสินค้าเข้าคลัง
                </button>
            </div>

        </div>
    );
}

export { CardProductStockWithdraw };
