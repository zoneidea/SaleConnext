import styles from '@/styles/style.module.css'
import { FC } from 'react';

type Props = {
    PackageTitle: string;
    isSelected: boolean;
}

const CardPackage: FC<Props> = ({ PackageTitle, isSelected }) => {
    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className={`rounded border mb-3 px-3 py-3 align-items-center h-150px`}
                        style={{
                            height: '80px',
                            backgroundColor: isSelected ? '#ACE1AF' : '#dbdfe9',
                            transition: 'background-color 0.2s ease, color 0.2s ease'
                        }}>
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <p className={`${styles.label}`}>
                                    {PackageTitle}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* เพิ่ม media query CSS เฉพาะในหน้าจอขนาดเล็ก */}
            <style>{`
                @media (max-width: 900px) {
                    .card .h-390px {
                        height: 70px; /* เพิ่มความสูงของการ์ดในหน้าจอขนาดเล็ก */
                    }
                }
            `}</style>
        </>
    );
}

export { CardPackage };