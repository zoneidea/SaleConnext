import { Link } from 'react-router-dom'
import axios from 'axios';
import { useState, useEffect } from 'react'
import { Content } from '../../../_metronic/layout/components/content'
import { useSaveProductStore } from '../../modules/stores/stepsStore';

const SalesDiscount: React.FC = () => {
    const API_URL_GET_TRADEINBRAND = import.meta.env.VITE_APP_API_POST_CATEGORIES;
    const TRADEINBRAND_URL = `${API_URL_GET_TRADEINBRAND}/Tradeinbrand`;

    // GET GetPackage/PackageType สำหรับ trade-in brands
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

    const { PRODUCT } = useSaveProductStore();
    console.log("PRODUCT: ", PRODUCT);

    // ตรวจสอบว่ามีข้อมูล PRODUCT หรือไม่ก่อนที่จะดึงข้อมูลจากมัน
    const hasTradeIn = PRODUCT?.[0]?.Package?.[0]?.HASTRADEIN ?? null;
    console.log("HASTRADEIN: ", hasTradeIn);

    const totalPrice = PRODUCT?.[0]?.Package?.[0]?.TOTALPRICE ?? 0;
    console.log("TOTALPRICE: ", totalPrice);

    const discountPrice = PRODUCT?.[0]?.Package?.[0]?.DISCOUNTPRICE ?? 0;
    console.log("DISCOUNTPRICE: ", discountPrice);

    const sequence = PRODUCT?.[0]?.Package?.[0]?.SEQUENCE ?? 0;
    console.log("SEQUENCE: ", sequence);

    const freeGift = PRODUCT?.[0]?.Package?.[0]?.FREEGIFT ?? [];
    console.log("FREEGIFT: ", freeGift);

    const [tradeInBrand, setTradeInBrand] = useState<any[]>([]);
    const [step, setStep] = useState<number>(100); // ค่าเพิ่ม/ลดที่กำหนดเอง

    const [currentSequence, setCurrentSequence] = useState<number>(sequence); // เก็บค่า sequence ปัจจุบัน

    const totalPriceSafe = totalPrice; // ตั้งค่า TOTALPRICE เป็น 0 ถ้าเป็น null

    // Handle increment and decrement functions
    const handleDecrement = () => {
        setCurrentSequence((prev) => Math.max(0, prev - step)); // ลดค่า step แต่ไม่ให้ต่ำกว่า 0
    };

    const handleIncrement = () => {
        setCurrentSequence((prev) => {
            // ตรวจสอบว่าเมื่อบวกแล้วจะไม่เกิน DISCOUNTPRICE
            if (prev + step <= discountPrice) {
                return prev + step; // เพิ่มค่า step ถ้าไม่เกิน
            } else {
                return prev; // ถ้าเกิน DISCOUNTPRICE ไม่ทำอะไร
            }
        });
    };

    // คำนวณราคาหลังหักส่วนลด
    const finalPrice = Math.max(0, totalPriceSafe - currentSequence); // ราคาหลังหักส่วนลด ไม่ให้ต่ำกว่า 0

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

                <div className='accordion mb-10' id='kt_accordion_1'>
                    {/* Start accordion for trade-in */}
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
                                                    <select className='form-select form-select-solid form-select-lg'>
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
                                                    />
                                                </div>
                                                <div className='col-lg-4 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>หมายเลขเครื่อง</label>
                                                    <input
                                                        type='text'
                                                        className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                                        placeholder='หมายเลขเครื่อง'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Start accordion for discount */}
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

                    {/* Start accordion for free gift */}
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
                                                    <select className='form-select form-select-solid form-select-lg'>
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
                    <Link to='/sale/createcust' className='btn btn-primary w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px'>
                        ถัดไป
                    </Link>
                </div>
            </Content>
        </>
    )
}

export default SalesDiscount;