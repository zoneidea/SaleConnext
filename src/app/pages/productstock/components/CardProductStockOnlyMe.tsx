import { FC } from 'react';

type Props = {
    DescriptionTH: string;
    ItemDescription: string;
    ItemCode: string;
    SerialNo: string;
    TransDate: string;
    ExtDate: string;
}

// ด้านบนของ component
const formatToBE = (isoDate?: string) => {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear() + 543;
    return `${dd}/${mm}/${yyyy}`;
};

const CardProductStockOnlyMe: FC<Props> = ({ DescriptionTH, ItemDescription, ItemCode, SerialNo, TransDate, ExtDate }) => {
    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className={`rounded border mb-3 px-7 py-7`}
                        style={{
                            backgroundColor: '#dbdfe9',
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
                                    Code: {ItemCode}
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
                                    วันที่เบิก: {formatToBE(TransDate)}
                                </span>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <span className={`fw-regular fs-7 d-block`}>
                                    วันที่รับ: {formatToBE(ExtDate)}
                                </span>
                            </div>
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

export { CardProductStockOnlyMe };