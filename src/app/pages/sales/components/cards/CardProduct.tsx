import styles from '@/styles/style.module.css'
import { FC } from 'react';

type Props = {
    DescriptionTH: string;
    ItemDescription: string;
    ItemCode: string;
    SerialNo: string;
    isSelected: boolean;  // เปลี่ยนเป็น boolean สำหรับตรวจสอบว่าถูกเลือกหรือไม่
}

const CardProduct: FC<Props> = ({ DescriptionTH, ItemDescription, ItemCode, SerialNo, isSelected }) => {
    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className={`rounded border mb-3 px-3 py-3`}
                        style={{
                            backgroundColor: isSelected ? '#ACE1AF' : '#dbdfe9',
                            transition: 'background-color 0.2s ease, color 0.2s ease'
                        }}>
                        {/* <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <p className={`fw-bold fs-1 m-0`}>
                                    {DescriptionTH}
                                </p>
                            </div>
                        </div> */}
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <p className={`fw-bold fs-1 m-0`}>
                                    {ItemDescription}
                                </p>
                            </div>
                        </div>
                        {/* <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <span className={`fw-regular fs-1 d-block`}>
                                    Code: {ItemCode}
                                </span>
                            </div>
                        </div> */}
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <span className={`fw-regular fs-1 d-block`}>
                                    S/N: {SerialNo}
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

export { CardProduct };