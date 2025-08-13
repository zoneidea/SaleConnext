import styles from '@/styles/style.module.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useAuth } from '../../modules/auth/core/Auth'
import dayjs from 'dayjs'
// ถ้า CardBillRecieveMoney อยู่ใน ./components/cards/CardBillRecieveMoney
import { CardBillRecieveMoney } from './components/cards/CardBillRecieveMoney'
import { useItemStore } from './store/useItemStore'
import {
    useUUIDStore,
    useSaveProductStore,
    useSaveDiscountStore,
    useSaveCustomerStore,
    useSaveAddressStore
} from '../../modules/stores/stepsStore';

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

    const { REFNO } = useUUIDStore();

    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT
    const GET_PAYMENT = `${API_URL_SALECONNEXT}/GetPayment`

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`

    const [payment, setPayment] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const item = useItemStore((state) => state.item)
    // console.log(`item`, item);

    const itemPropFromSalesCancel = location.state as ItemProps | null;
    console.log(`itemPropFromSalesCancel`, itemPropFromSalesCancel);
    
    useEffect(() => {
        getPayment()
    }, [])

    const getPayment = async () => {
        setIsLoading(true)
        console.log(`test RefNo`, itemPropFromSalesCancel?.REFNO);
        console.log(`test EmpId`, EmpId);
        
        try {
            const response = await axios.post(
                GET_PAYMENT,
                {
                    RefNo: itemPropFromSalesCancel?.REFNO,
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

    {/****** matchedItem *******/ }
    const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false);
    const [draft, setDraft] = useState<any[]>([]);

    useEffect(() => {
        const getDataDraft = async () => {
            setIsLoadingDraft(true);
            try {
                const response = await axios.get(DRAFT_ALLCONTRACT_URL);
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setDraft(data);
            } catch (error) {
                console.error('Error fetching DRAFT_ALLCONTRACT_URL:', error);
            } finally {
                setIsLoadingDraft(false);
            }
        };
        getDataDraft();
    }, []);

    // state ตัวเก็บ matchedItem
    const [matchedItem, setMatchedItem] = useState<ItemProps | null>(null);
    console.log(`matchedItem`, matchedItem);

    useEffect(() => {
        if (!isLoadingDraft) {
            const found = draft.find(d => d.REFNO === REFNO) || null;
            setMatchedItem(found);
        }
    }, [draft, isLoadingDraft]);

    {/****** matchedItem *******/ }

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
                    className={`${styles.btnSecondary}`}
                    onClick={() => navigate('/sale/cancel', { state: itemPropFromSalesCancel })}
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
                    className={`${styles.btnSecondary}`}
                    onClick={() => navigate('/sale/cancel', { state: itemPropFromSalesCancel })}
                >
                    ย้อนกลับ
                </button>
            </div>

        </>
    )
}

export default SalesBillRecieveMoney