// src/components/cards/CardStatusCustomer.tsx
import styles from '@/styles/style.module.css'
import { FC, useState, useMemo } from 'react'
import clsx from 'clsx'
import { KTIcon } from '../../../../../_metronic/helpers'

type Props = {
    customerStatus: any[]
    selectedIdx: number | null
    handleSelectCard: (idx: number, cust: any) => void;
}

export const CardStatusCustomer: FC<Props> = ({
    customerStatus,
    selectedIdx,
    handleSelectCard,
}) => {
    const [visibleCount, setVisibleCount] = useState(10)
    const visibleList = useMemo(
        () => customerStatus.slice(0, visibleCount),
        [customerStatus, visibleCount]
    )

    return (
        <>
            <div className="row justify-content-center">
                {visibleList.map((cust, idx) => {
                    const isSelected = idx === selectedIdx

                    return (
                        <div className="col-12 mb-3" key={cust.Refno}>
                            <div
                                className="card cursor-pointer"
                                onClick={() => handleSelectCard(idx, cust)}
                            >
                                <div
                                    className="d-flex justify-content-between flex-column flex-sm-row align-items-center h-auto h-sm-50px px-5 py-4 rounded-top"
                                    style={{
                                        backgroundColor: isSelected ? '#33CC66' : '#E0E0E0',
                                    }}
                                >
                                    <div className="d-flex align-items-center">
                                        <KTIcon
                                            iconName="abstract-26"
                                            className="fs-3 me-2 me-sm-5 text-white d-none d-sm-block"
                                        />
                                        <span className={`fw-bold m-0 ${styles.label}`}>
                                            เลขที่สัญญา {cust.CONTNO}
                                        </span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <KTIcon
                                            iconName="abstract-26"
                                            className="fs-3 me-2 me-sm-5 d-none d-sm-block"
                                        />
                                        <span className={`fw-bold m-0 ${styles.label}`}>
                                            {cust.CustomerStatus} ({cust.Contract.AgingCumulativeDetail}){' '}
                                            {cust.Contract.StDate}
                                        </span>
                                    </div>
                                </div>

                                <div className={`card-body ${isSelected ? 'bg-success bg-opacity-10' : ''}`}>
                                    <div className="mb-3">
                                        <p className={`fw-bold m-0 ${styles.label}`}>ลูกค้า:&nbsp;</p>
                                        <span className={styles.fontSize}>
                                            {cust.Contract.PrefixName} {cust.Contract.CustomerName}
                                        </span>
                                    </div>
                                    <div className="mb-3">
                                        <p className={`fw-bold m-0 ${styles.label}`}>วันที่ติดตั้ง:&nbsp;</p>
                                        <span className={styles.fontSize}>{cust.Contract.EffDate}</span>
                                    </div>
                                    <div className="mb-3">
                                        <p className={`fw-bold m-0 ${styles.label}`}>สินค้า:&nbsp;</p>
                                        <span className={styles.fontSize}>
                                            {cust.Contract.ProductName}
                                        </span>
                                    </div>
                                    <div className="mb-3">
                                        <p className={`fw-bold m-0 ${styles.label}`}>รุ่น:&nbsp;</p>
                                        <span className={styles.fontSize}>
                                            {cust.Contract.ProductModel}
                                        </span>
                                    </div>
                                    <div className="mb-3">
                                        <p className={`fw-bold m-0 ${styles.label}`}>ที่อยู่:&nbsp;</p>
                                        <span className={styles.fontSize}>
                                            {[
                                                cust.Contract.Address[0]?.AddressDetail,
                                                cust.Contract.Address[0]?.Amphur,
                                                cust.Contract.Address[0]?.District,
                                                cust.Contract.Address[0]?.Province,
                                                cust.Contract.Address[0]?.Zipcode,
                                            ]
                                                .filter(Boolean)
                                                .join(' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {visibleCount < customerStatus.length && (
                <div className="text-center mt-4">
                    <button
                        className="btn btn-link"
                        onClick={() => setVisibleCount((v) => v + 10)}
                    >
                        ดูข้อมูลเพิ่มเติม
                    </button>
                </div>
            )}
        </>
    )
}