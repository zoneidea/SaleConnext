import { FC } from 'react';
import styles from "@/styles/style.module.css";

type Props = {
    DescriptionTH: string;
    ItemDescription: string;
    ItemCode: string;
    SerialNo: string;
    TransDate: string;
    ExtDate: string;
    onAccept: () => void;          // <-- เพิ่ม prop นี้
}

const formatToBE = (isoDate?: string) => {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear() + 543;
    return `${dd}/${mm}/${yyyy}`;
};

const CardProductStockWithdraw: FC<Props> = ({
    DescriptionTH,
    ItemDescription,
    ItemCode,
    SerialNo,
    TransDate,
    ExtDate,
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
            <div className="d-flex align-items-center mb-2">
                <span className="fw-regular fs-7 d-block">S/N: {SerialNo}</span>
            </div>
            <div className="d-flex align-items-center mb-2">
                <span className="fw-regular fs-7 d-block">วันที่เบิก: {TransDate}</span>
            </div>

            <div className="d-flex justify-content-lg-center justify-content-md-center gap-2 mt-7">
                <button
                    type="button"
                    className={`${styles.btnPrimary}`}
                    onClick={onAccept}
                >
                    รับสินค้าเข้าคลัง
                </button>
            </div>

        </div>
    );
}

export { CardProductStockWithdraw };
