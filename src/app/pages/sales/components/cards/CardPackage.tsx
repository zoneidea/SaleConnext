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
                    <div className={`rounded border mb-3 px-7 py-7 align-items-center`}
                        style={{
                            height: '80px',
                            backgroundColor: isSelected ? '#ACE1AF' : '#dbdfe9',
                            transition: 'background-color 0.2s ease, color 0.2s ease'
                        }}>
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <p className={`fw-bold fs-6 m-0`}>
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