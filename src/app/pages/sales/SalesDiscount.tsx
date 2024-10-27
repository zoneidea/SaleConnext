import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { Content } from '../../../_metronic/layout/components/content';
import { useAuth } from '../../modules/auth/core/Auth';

import { useUUIDStore, useSaveProductStore } from '../../modules/stores/stepsStore';
import { useSaveDiscountStore } from '../../modules/stores/stepsStore';

const SalesDiscount: React.FC = () => {
    const navigate = useNavigate();

    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
    const TRADEINBRAND_URL = `${API_SALECONNEXT}/GetProduct/Tradeinbrand`;

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

    const { REFNO } = useUUIDStore();
    const { PRODUCT } = useSaveProductStore();
    const { DISCOUNT, SETDISCOUNT } = useSaveDiscountStore();

    const [tradeInBrand, setTradeInBrand] = useState<any[]>([]);
    const [selectedTurnId, setSelectedTurnId] = useState<any>('');
    const [tradeInModel, setTradeInModel] = useState<any>('');
    const [tradeInSerial, setTradeInSerial] = useState<any>('');
    const [selectedGiftId, setSelectedGiftId] = useState<any>('');
    // console.log(`selectedTurnId`, selectedTurnId);

    // ตรวจสอบว่ามีข้อมูล PRODUCT หรือไม่ก่อนที่จะดึงข้อมูลจากมัน
    const hasTradeIn = PRODUCT?.[0]?.Package?.[0]?.HASTRADEIN ?? null;
    const totalPrice = PRODUCT?.[0]?.Package?.[0]?.TOTALPRICE ?? 0;
    const discountPrice = PRODUCT?.[0]?.Package?.[0]?.DISCOUNTPRICE ?? 0;
    const sequence = PRODUCT?.[0]?.Package?.[0]?.SEQUENCE ?? 0;
    const freeGift = PRODUCT?.[0]?.Package?.[0]?.FREEGIFT ?? [];
    // console.log(`selectedGift`, freeGift[selectedGiftId-1]?.GIFTCODE);

    const [step, setStep] = useState<number>(100);
    const [currentSequence, setCurrentSequence] = useState<number>(sequence);
    const totalPriceSafe = totalPrice; // ตั้งค่า TOTALPRICE เป็น 0 ถ้าเป็น null

    // เก็บข้อมูลส่วนลดใน state และ store
    const SaveDiscountData = useMemo(() => {
        // ตรวจสอบว่ามีข้อมูลใน PRODUCT และ Package หรือไม่ก่อนที่จะเข้าถึง
        if (!PRODUCT?.[0]?.Package?.[0]) {
            return [];
        }

        return [
            {
                TRADEIN: {
                    HASTRADEIN: PRODUCT[0].Package[0].HASTRADEIN,
                    TRADEINBRANDID: selectedTurnId,
                    TRADEINMODEL: tradeInModel,
                    TRADEINSERIAL: tradeInSerial,
                },
                DISCOUNTAMOUNT: currentSequence,
                GIFT: {
                    GIFTID: selectedGiftId,
                    GIFTCODE: freeGift[selectedGiftId - 1]?.GIFTCODE,
                    GIFTNAME: freeGift[selectedGiftId - 1]?.GIFTNAME,
                    GIFTPRICE: freeGift[selectedGiftId - 1]?.GIFTPRICE ?? 0, // ใช้ 0 แทน null
                    GIFTDESCRIPTION: freeGift[selectedGiftId - 1]?.GIFTDESCRIPTION || null,
                }
            }
        ];
    }, [PRODUCT, selectedTurnId, tradeInModel, tradeInSerial, currentSequence, selectedGiftId]);

    // อัปเดตข้อมูลส่วนลดใน store
    useEffect(() => {
        if (JSON.stringify(SaveDiscountData) !== JSON.stringify(DISCOUNT)) {
            SETDISCOUNT(SaveDiscountData); // อัปเดตข้อมูลลง store
        }
    }, [SaveDiscountData, DISCOUNT, SETDISCOUNT]);

    // GET Trade-in brands
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(TRADEINBRAND_URL, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setTradeInBrand(data);
            } catch (error) {
                console.error('Error fetching TRADEINBRAND_URL:', error);
            }
        };
        getData();
    }, []);

    // POST Contract/updateContract
    const handleNextClick = async () => {
        try {
            // POST Contract/updateContract
            const updateContract = await axios.post(UPDATECONTACT, {
                REFNO,
                EMPID: EmpId,
                TEAMSALE: TeamSale,
                SALECODE: SaleCode,
                SUPEMPID: SupEmpId,
                SECEMPID: SecEmpId,
                FIELD: "DISCOUNT",
                DATA: SaveDiscountData 
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(`updateContract DISCOUNT: `, updateContract.data);
            // หลังจากทำการส่งข้อมูลสำเร็จ นำทางไปยังหน้า /sale/createcust
            navigate('/sale/createcust');
        } catch (error) {
            console.error('Error fetching UPDATECONTACT:', error);
        }
    };

    // Handle increment and decrement functions
    const handleDecrement = () => {
        setCurrentSequence((prev) => Math.max(0, prev - step)); // ลดค่า step แต่ไม่ให้ต่ำกว่า 0
    };

    const handleIncrement = () => {
        setCurrentSequence((prev) => {
            if (prev + step <= discountPrice) {
                return prev + step;
            } else {
                return prev;
            }
        });
    };

    // คำนวณราคาหลังหักส่วนลด
    const finalPrice = Math.max(0, totalPriceSafe - currentSequence);

    // Handle option changes
    const handleTurnOptionChange = (event: any) => {
        const value = event.target.value;
        setSelectedTurnId(value);
    };

    const handleTradeInModelChange = (event: any) => {
        const value = event.target.value;
        setTradeInModel(value);
    };

    const handleTradeInSerialChange = (event: any) => {
        const value = event.target.value;
        setTradeInSerial(value);
    };

    const handleGiftOptionChange = (event: any) => {
        const value = event.target.value
        setSelectedGiftId(value);
    };

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-10 mt-lg-0'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            เครื่องเทิร์น / ส่วนลด / ของแถม
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <Link className="text-muted text-hover-primary" to="/metronic8/react/demo1/sales/overview">
                                    ระบบขาย
                                </Link></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">เครื่องเทิร์น / ส่วนลด / ของแถม</li>
                        </ul>
                    </div>
                </div>
                <p>เลขที่ขาย: {REFNO}</p>

                <div className='accordion mb-10' id='kt_accordion_1'>
                    {hasTradeIn === 1 && (
                        <div className='accordion-item mb-10'>
                            <h2 className='accordion-header' id='kt_accordion_1_header_1'>
                                <h3
                                    className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                    data-bs-toggle='collapse'
                                    data-bs-target='#kt_accordion_1_body_1'
                                    aria-expanded='true'
                                    aria-controls='kt_accordion_1_body_1'
                                    style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                                >
                                    เครื่องเทิร์น
                                </h3>
                            </h2>
                            <div
                                id='kt_accordion_1_body_1'
                                className='accordion-collapse collapse show'
                                aria-labelledby='kt_accordion_1_header_1'
                                data-bs-parent='#kt_accordion_1'
                            >
                                <div className='accordion-body'>
                                    <form noValidate className='form'>
                                        <div className='card-body px-lg-9 px-1'>
                                            <div className='row mb-6'>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>เครื่องเทิร์น</label>
                                                    <select
                                                        className='form-select form-select-solid form-select-lg'
                                                        onChange={handleTurnOptionChange}
                                                    >
                                                        <option value=''>เลือกเครื่องเทิร์น...</option>
                                                        {tradeInBrand.map((item, index) => (
                                                            <option key={index} value={item.TRADEINBRANDID}>
                                                                {item.TRADEINBRANDNAME}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>รุ่น</label>
                                                    <input
                                                        type='text'
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                        placeholder='รุ่น'
                                                        onChange={handleTradeInModelChange}
                                                    />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>หมายเลขเครื่อง</label>
                                                    <input
                                                        type='text'
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                        placeholder='หมายเลขเครื่อง'
                                                        onChange={handleTradeInSerialChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {discountPrice !== 0 && (
                        <div className='accordion-item mb-10'>
                            <h2 className='accordion-header' id='kt_accordion_2_header_2'>
                                <h3
                                    className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                    data-bs-toggle='collapse'
                                    data-bs-target='#kt_accordion_2_body_2'
                                    aria-expanded='true'
                                    aria-controls='kt_accordion_2_body_2'
                                    style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                                >
                                    ส่วนลด
                                </h3>
                            </h2>
                            <div
                                id='kt_accordion_2_body_2'
                                className='accordion-collapse collapse show'
                                aria-labelledby='kt_accordion_2_header_2'
                                data-bs-parent='#kt_accordion_2'
                            >
                                <div className='accordion-body'>
                                    <form noValidate className='form'>
                                        <div className='card-body px-lg-9 px-1'>
                                            <div className='row mb-6'>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>ราคา</label>
                                                    <p className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'>
                                                        {finalPrice}
                                                    </p>
                                                </div>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>ส่วนลด</label>
                                                    <div className='d-flex align-items-center'>
                                                        <button className='btn btn-light-primary' type='button' onClick={handleDecrement}>
                                                            -
                                                        </button>
                                                        <div className='form-control form-control-lg form-control-solid mx-2 mb-0 text-center flex-grow-1'>
                                                            {currentSequence}
                                                        </div>
                                                        <button className='btn btn-light-primary' type='button' onClick={handleIncrement}>
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {freeGift.length > 0 && (
                        <div className='accordion-item mb-10'>
                            <h2 className='accordion-header' id='kt_accordion_3_header_3'>
                                <h3
                                    className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                    data-bs-toggle='collapse'
                                    data-bs-target='#kt_accordion_3_body_3'
                                    aria-expanded='true'
                                    aria-controls='kt_accordion_3_body_3'
                                    style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                                >
                                    ของแถม
                                </h3>
                            </h2>
                            <div
                                id='kt_accordion_3_body_3'
                                className='accordion-collapse collapse show'
                                aria-labelledby='kt_accordion_3_header_3'
                                data-bs-parent='#kt_accordion_3'
                            >
                                <div className='accordion-body'>
                                    <form noValidate className='form'>
                                        <div className='card-body px-lg-9 px-1'>
                                            <div className='row mb-6'>
                                                <div className='col-lg-12 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>ของแถม</label>
                                                    <select
                                                        className='form-select form-select-solid form-select-lg'
                                                        onChange={handleGiftOptionChange}
                                                    >
                                                        <option value=''>เลือกของแถม...</option>
                                                        {freeGift.map((item, index) => (
                                                            <option key={index} value={item.GIFTID}>
                                                                {item.GIFTNAME}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                    <Link to='/sale/package' className='btn btn-secondary w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px'>
                        ย้อนกลับ
                    </Link>
                    <button
                        className='btn btn-primary w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px'
                        onClick={handleNextClick}
                    >
                        ถัดไป
                    </button>
                </div>
            </Content>
        </>
    )
}

export default SalesDiscount;