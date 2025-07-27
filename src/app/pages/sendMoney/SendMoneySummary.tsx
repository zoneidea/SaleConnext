import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useAuth } from '../../modules/auth/core/Auth'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Barcode from 'react-barcode'
import dayjs from 'dayjs'
import styles from '@/styles/style.module.css'

interface LocationState {
    responseData?: any
}

interface ItemProps {
    AMOUNT: number
    CHANNELNAME?: string
    CHANNELITEMNAME?: string
    SENDDATE?: string
    REFERENCE1?: string
    REFERENCE2?: string
}

const SendMoneySummary: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const MySwal = withReactContent(Swal)

    const { auth } = useAuth()
    const EmpId = auth?.data?.[0]?.EmpId || ''
    const EmpName = auth?.data?.[0]?.EmpName || ''

    // 1) ดึง state ทั้ง 2 รูปแบบ
    // - แบบแรก: { responseData: [ { ... } ] }
    // - แบบสอง: { ... } (item เดี่ยว)
    const locationState = location.state as LocationState | ItemProps

    // 2) ตรวจสอบว่าเป็นแบบไหน
    // ถ้ามี locationState.responseData => แสดงว่ามาจากโค้ดเดิม (array)
    // ถ้าไม่มีก็ลองมองว่าเป็น item เดี่ยว
    let itemData: any = null

    if ((locationState as LocationState)?.responseData) {
        // โครงสร้างแบบ { responseData: [ { ... } ] }
        const arrayData = (locationState as LocationState).responseData
        itemData = Array.isArray(arrayData) ? arrayData[0] : null
    } else {
        // โครงสร้างแบบ { ... } (item เดี่ยว)
        itemData = locationState
    }

    // 3) ถ้า itemData ไม่มี ก็อาจแจ้ง error หรือ navigate กลับ
    if (!itemData) {
        return (
            <div className='text-center mt-10'>
                <h2>ไม่พบข้อมูลสำหรับแสดงผล</h2>
                <button className='btn btn-primary' onClick={() => navigate('/sendmoney')}>
                    กลับ
                </button>
            </div>
        )
    }

    console.log(`itemData`, itemData);

    // 4) ดึงค่าไปใช้งาน
    const channelName = itemData.CHANNELNAME || ''
    const channelItemName = itemData.CHANNELITEMNAME || ''
    const sendDate = itemData.SENDDATE || ''
    const barcode = itemData.BARCODE || ''
    const barcodeText = itemData.BARCODETEXT || ''
    const ref1 = itemData.REFERENCE1 || ''
    const ref2 = itemData.REFERENCE2 || ''
    const amount = itemData.AMOUNT || 0

    const formattedSendDate = dayjs(sendDate).format('DD/MM/YYYY')
    const formattedAmount = amount.toLocaleString('en-US')

    return (
        <div className='d-flex justify-content-center'>
            <div className='container mt-10 mb-5' style={{ maxWidth: '800px' }}>
                <div className='text-center mb-5'>
                    <p className='fs-3 fw-bold'>ใบนำส่งเงินสด <br />{channelName} {channelItemName}</p>
                </div>

                <div className='d-flex justify-content-center align-items-center mb-10'>
                    <Barcode
                        value={barcodeText}
                        format='CODE128'
                    />
                </div>

                <div className='p-4 fs-5 flex justify-content-center align-items-center'>
                    <div className='d-flex mb-2'>
                        <div style={{ width: '150px' }} className='pe-6'>
                            <strong>ชื่อผู้ส่งเงิน :</strong>
                        </div>
                        <div>{EmpName}</div>
                    </div>

                    <div className='d-flex mb-2'>
                        <div style={{ width: '150px' }} className='pe-3'>
                            <strong>รหัสผู้ส่ง :</strong>
                        </div>
                        <div>{EmpId}</div>
                    </div>

                    <div className='d-flex mb-2'>
                        <div style={{ width: '150px' }} className='pe-3'>
                            <strong>วันที่นำส่งเงิน :</strong>
                        </div>
                        <div>{formattedSendDate}</div>
                    </div>

                    <div className='d-flex mb-2'>
                        <div style={{ width: '150px' }} className='pe-3'>
                            <strong>ชื่อผู้รับเงิน/สาขา :</strong>
                        </div>
                        <div>{channelItemName}</div>
                    </div>

                    <div className='d-flex mb-2'>
                        <div style={{ width: '150px' }} className='pe-3'>
                            <strong>Ref 1 :</strong>
                        </div>
                        <div>{ref1}</div>
                    </div>

                    <div className='d-flex mb-2'>
                        <div style={{ width: '150px' }} className='pe-3'>
                            <strong>Ref 2 :</strong>
                        </div>
                        <div>{ref2}</div>
                    </div>

                    <div className='d-flex mb-2'>
                        <div style={{ width: '150px' }} className='pe-3'>
                            <strong>จำนวนเงิน :</strong>
                        </div>
                        <div>{formattedAmount} บาท</div>
                    </div>
                </div>
            </div>

            <div className='d-none d-xl-flex align-items-end my-5 justify-content-end mx-10'>
                <button className='btn btn-primary w-100 w-md-auto h-50px'
                    onClick={() => navigate('/sendmoney')}>
                    จบการทำงาน
                </button>
            </div>

            <div
                className='d-flex d-xl-none align-items-end bg-light p-3 border-top justify-content-end'
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1050,
                }}
            >
                <button
                    className={`${styles.btnPrimary}`}
                    onClick={() => navigate('/sendmoney')}
                >
                    จบการทำงาน
                </button>
            </div>
        </div>
    )
}

export default SendMoneySummary
