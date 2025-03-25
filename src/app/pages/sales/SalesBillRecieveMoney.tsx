import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useAuth } from '../../modules/auth/core/Auth'
import dayjs from 'dayjs'
// ถ้า CardBillRecieveMoney อยู่ใน ./components/cards/CardBillRecieveMoney
import { CardBillRecieveMoney } from './components/cards/CardBillRecieveMoney'
import { useItemStore } from './store/useItemStore'

interface ItemProps {
    REFNO: string;
    CONTNO: string;
    EMPID: string;
    TEAMSALE: string;
    SALECODE: string;
    SUPEMPID: string;
    SECEMPID: string;
    STATUS: string;
    PRODUCT: [any];
    CUSTOMERSTATUS: [any];
    DISCOUNT: [any];
    CUSTOMERDETAIL: [any];
    ADDRESS: [any];
    PDPA: [any];
    CONTRACT: [any];
    IMAGE: [any];
    CHECKERCOMMENT: [any];
    item?: {
        REFNO: string; // เพิ่ม item เป็น optional object
    };
}

const SalesBillRecieveMoney: React.FC = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { auth } = useAuth()
    const EmpId = auth?.data?.[0]?.EmpId || ''

    const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT
    const GET_PAYMENT = `${API_URL_SALECONNEXT}/GetPayment`

    const [payment, setPayment] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const item = useItemStore((state) => state.item)

    useEffect(() => {
        getPayment()
    }, [])

    const getPayment = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(
                GET_PAYMENT,
                {
                    RefNo: item?.REFNO,
                    EmpId: EmpId,
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Accept: 'multipart/form-data',
                    },
                }
            )
            const data = Array.isArray(response.data.data) ? response.data.data : []
            setPayment(data)
        } catch (error) {
            console.error('Error fetching GET_PAYMENT:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className='d-flex justify-content-center'>
                <div className='container-fluid mt-10 mb-20 mx-15'>
                    {/* Title */}
                    <div className='text-center mb-5'>
                        <p className='fs-3 fw-bold'>ใบเสร็จรับเงิน</p>
                    </div>

                    {/* เรียกใช้คอมโพเนนต์ CardBillRecieveMoney */}
                    <CardBillRecieveMoney payments={payment} isLoading={isLoading} />

                </div>
            </div>

            {/* ปุ่มสำหรับปิดการทำงาน */}
            <div className='d-none d-xl-flex align-items-end my-5 justify-content-start mx-10'>
                <button
                    className='btn btn-secondary w-100 w-md-auto h-50px'
                    onClick={() => navigate('/sale/cancel')}
                >
                    ย้อนกลับ
                </button>
            </div>

            <div
                className='d-flex d-xl-none align-items-end bg-light p-3 border-top justify-content-start'
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1050,
                }}
            >
                <button
                    className='btn btn-secondary w-auto'
                    onClick={() => navigate('/sale/cancel', { state: item })}
                >
                    ย้อนกลับ
                </button>
            </div>
        </>
    )
}

export default SalesBillRecieveMoney