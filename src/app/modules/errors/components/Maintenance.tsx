import { FC } from 'react'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'

const Maintenance: FC = () => {
    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center overflow-hidden">

            {/* 🔵 Background */}
            <img
                src={toAbsoluteUrl('media/auth/bg6.jpg')}
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    objectFit: 'cover',
                    zIndex: 0,
                    filter: 'blur(8px)',
                    transform: 'scale(1.05)',
                }}
                alt="bg"
            />

            {/* 🔵 Dark Overlay */}
            <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    background: 'rgba(0, 0, 0, 0.01)',
                    zIndex: 1,
                }}
            />

            {/* 🔵 Content Card */}
            <div
                className="text-center px-8 py-15 rounded-4 shadow-lg"
                style={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: '720px',
                    width: '100%',
                    background: '#ffffff', // ✅ ขาว 100%
                    border: '1px solid #e5e7eb',
                }}
            >
                {/* 🔵 Title */}
                <h1 className="fw-bolder text-dark mb-4" style={{ fontSize: '42px', letterSpacing: '0.5px' }}>
                    ระบบกำลังปรับปรุง
                </h1>

                {/* 🔵 Divider */}
                <div
                    className="mx-auto mb-5"
                    style={{
                        width: 80,
                        height: 4,
                        borderRadius: 2,
                        background: 'linear-gradient(90deg, #0d6efd, #6ea8fe)',
                    }}
                />

                {/* 🔵 Description */}
                <div
                    className="fw-bolder text-dark mb-6"
                    style={{
                        fontSize: '18px',
                        lineHeight: '1.8',
                        opacity: 0.9,
                    }}
                >
                    ขออภัยในความไม่สะดวก<br />
                    ขณะนี้ระบบอยู่ระหว่างการปรับปรุงเพื่อเพิ่มประสิทธิภาพการให้บริการ<br />
                    กรุณาเข้าใช้งานอีกครั้งในภายหลัง
                </div>

                {/* 🔵 Image */}
                <img
                    src={toAbsoluteUrl('media/auth/chart-graph.png')}
                    style={{
                        maxHeight: 220,
                        opacity: 0.95,
                    }}
                    alt="Maintenance"
                />

                {/* 🔵 Footer */}
                <div className="fw-normal text-dark mt-6" style={{ fontSize: '13px', opacity: 0.6 }}>
                    © {new Date().getFullYear()} sc.tsrplc.com All rights reserved.
                </div>
            </div>
        </div>
    )
}

export { Maintenance }