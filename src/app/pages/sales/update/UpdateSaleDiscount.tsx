import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useMemo, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { Content } from '../../../../_metronic/layout/components/content';
import { useAuth } from '../../../modules/auth/core/Auth';

import { useUUIDStore, useSaveProductStore } from '../../../modules/stores/stepsStore';
import { useSaveDiscountStore } from '../../../modules/stores/stepsStore';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface ItemProps {
    REFNO: String,
    CONTNO: String,
    EMPID: String,
    TEAMSALE: String,
    SALECODE: String,
    SUPEMPID: String,
    SECEMPID: String,
    STATUS: String,
    PRODUCT: [any],
    CUSTOMERSTATUS: [any],
    DISCOUNT: [any],
    CUSTOMERDETAIL: [any],
    ADDRESS: [any],
    PDPA: [any],
    CONTRACT: [any],
    IMAGE: [any],
    CHECKERCOMMENT: [any]
}

const UpdateSalesDiscount: React.FC = () => {
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);

    const location = useLocation();
    const item = location.state as ItemProps || [];
    console.log(`item`, item);

    const refno = item?.REFNO
    const productContract = item?.PRODUCT
    const discount = item?.DISCOUNT

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

    // const { REFNO } = useUUIDStore();
    // const { PRODUCT } = useSaveProductStore();
    const { DISCOUNT, SETDISCOUNT } = useSaveDiscountStore();

    const [tradeInBrand, setTradeInBrand] = useState<any[]>([]);
    const [selectedTurnId, setSelectedTurnId] = useState<any>('');
    // console.log(`selectedTurnId`, selectedTurnId);
    const [selectedTradeInBrandName, setSelectedTradeInBrandName] = useState<string>('');
    console.log(`selectedTradeInBrandName`, selectedTradeInBrandName);
    const [tradeInModel, setTradeInModel] = useState<any>('');
    const [tradeInSerial, setTradeInSerial] = useState<any>('');
    const [selectedGiftId, setSelectedGiftId] = useState<any>('');

    // ตรวจสอบว่ามีข้อมูล PRODUCT หรือไม่ก่อนที่จะดึงข้อมูลจากมัน
    const hasTradeIn = productContract?.[0]?.Package?.[0]?.HASTRADEIN ?? null;
    const totalPrice = productContract?.[0]?.Package?.[0]?.TOTALPRICE ?? 0;
    const discountPrice = productContract?.[0]?.Package?.[0]?.DISCOUNTPRICE ?? 0;
    const sequence = productContract?.[0]?.Package?.[0]?.SEQUENCE ?? 0;
    const freeGift = productContract?.[0]?.Package?.[0]?.FREEGIFT ?? [];
    // console.log(`selectedGift`, freeGift[selectedGiftId-1]?.GIFTCODE);

    const [step, setStep] = useState<number>(100);
    const [currentSequence, setCurrentSequence] = useState<number>(sequence);
    const totalPriceSafe = totalPrice; // ตั้งค่า TOTALPRICE เป็น 0 ถ้าเป็น null

    // อัปเดต selectedTradeInBrandName เมื่อ selectedTurnId หรือ tradeInBrand เปลี่ยน
    useEffect(() => {
        console.log("Selected TradeIn ID:", selectedTurnId);
        // console.log("TradeIn Brand List:", tradeInBrand);

        const selectedTradeInBrand = tradeInBrand.find(
            (brand) => String(brand.TRADEINBRANDID) === String(selectedTurnId) // แปลงเป็นสตริงก่อนการเปรียบเทียบ
        );

        if (selectedTradeInBrand) {
            setSelectedTradeInBrandName(selectedTradeInBrand.TRADEINBRANDNAME || '');
            // console.log("Found TradeIn Brand Name:", selectedTradeInBrand.TRADEINBRANDNAME);
        } else {
            setSelectedTradeInBrandName(''); // รีเซ็ตค่าเมื่อไม่มีการเลือก
            console.log("No TradeIn Brand Name Found");
        }
    }, [selectedTurnId, tradeInBrand]);

    // เก็บข้อมูลส่วนลดใน state และ store
    const SaveDiscountData = useMemo(() => {
        if (!productContract?.[0]?.Package?.[0]) {
            return [];
        }

        return [
            {
                TRADEIN: {
                    HASTRADEIN: productContract[0].Package[0].HASTRADEIN,
                    TRADEINBRANDID: selectedTurnId,
                    TRADEINBRANDNAME: selectedTradeInBrandName, // ใช้ selectedTradeInBrandName ที่อัปเดตจาก useEffect
                    TRADEINMODEL: tradeInModel,
                    TRADEINSERIAL: tradeInSerial,
                },
                DISCOUNTAMOUNT: currentSequence,
                GIFT: {
                    GIFTID: selectedGiftId,
                    GIFTCODE: freeGift[selectedGiftId - 1]?.GIFTCODE,
                    GIFTNAME: freeGift[selectedGiftId - 1]?.GIFTNAME,
                    GIFTPRICE: freeGift[selectedGiftId - 1]?.GIFTPRICE ?? 0,
                    GIFTDESCRIPTION: freeGift[selectedGiftId - 1]?.GIFTDESCRIPTION || null,
                },
            },
        ];
    }, [productContract, selectedTurnId, tradeInModel, tradeInSerial, currentSequence, selectedGiftId, selectedTradeInBrandName]);

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

        if (discount?.[0]) {
            if (discount?.[0].TRADEIN?.HASTRADEIN !== 0) {
                getData();

                setSelectedTurnId(discount?.[0].TRADEIN?.TRADEINBRANDID)
                setTradeInModel(discount?.[0].TRADEIN?.TRADEINMODEL);
                setTradeInSerial(discount?.[0].TRADEIN?.TRADEINSERIAL);
            }

            setCurrentSequence(discount?.[0].DISCOUNTAMOUNT)

            setSelectedGiftId(discount?.[0].GIFT?.GIFTID);
        }
    }, []);

    // POST Contract/updateContract
    const handleNextClick = async () => {
        try {
            // POST Contract/updateContract
            const updateContract = await axios.post(UPDATECONTACT, {
                REFNO: refno,
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
            if (updateContract.status === 200) {
                if (!updateContract.data.data) {
                    MySwal.fire('เกิดข้อผิดพลาด', 'ปรับปรุงข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา', 'error');
                } else {
                    MySwal.fire('สำเร็จ', 'ปรับปรุงข้อมูลส่วนลดแล้ว', 'success');
                }
            } else {
                MySwal.fire('เกิดข้อผิดพลาด', updateContract.data.message, 'error');
            }
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

    const handleCheckerClick = async () => {
        const response = await axios.post(UPDATECONTACT, {
            REFNO: refno,
            EMPID: EmpId,
            TEAMSALE: TeamSale,
            FIELD: "STATUS",
            DATA: "PENDING",
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(response)

        if (response.status === 200) {
            if (!response.data.data) {
                MySwal.fire('เกิดข้อผิดพลาด', 'ส่งข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา', 'error');
            } else {
                MySwal.fire('สำเร็จ', 'ส่งข้อมูลตรวจสอบแล้ว', 'success');
            }
        } else {
            MySwal.fire('เกิดข้อผิดพลาด', response.data.message, 'error');
        }
    }

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-7 mt-lg-0'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            เครื่องเทิร์น / ส่วนลด / ของแถม
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <span className="text-muted text-hover-primary">
                                    ระบบขาย
                                </span></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">แก้ไขเครื่องเทิร์น / ส่วนลด / ของแถม</li>
                        </ul>
                    </div>
                </div>
                <p>REFNO: {refno}</p>

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
                                                        {(finalPrice).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className='col-lg-6 mb-3'>
                                                    <label className='form-label fw-bold fs-6'>ส่วนลด</label>
                                                    <div className='d-flex align-items-center'>
                                                        <button className='btn btn-light-primary' type='button' onClick={handleDecrement}>
                                                            -
                                                        </button>
                                                        <div className='form-control form-control-lg form-control-solid mx-2 mb-0 text-center flex-grow-1'>
                                                            {(currentSequence).toLocaleString()}
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
                                                        value={selectedGiftId}
                                                        className='form-select form-select-solid form-select-lg'
                                                        onChange={handleGiftOptionChange}
                                                    >
                                                        <option value=''>เลือกของแถม...</option>
                                                        {freeGift.map((item: { GIFTID: string | number | readonly string[] | undefined; GIFTNAME: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
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

                <div className='d-none d-md-flex justify-content-between align-items-center mt-5'>
                    <button
                        className='btn btn-secondary w-100 w-md-auto align-self-center h-50px'
                        onClick={() => navigate('/sale/step', { state: item })}>
                        ย้อนกลับ
                    </button>
                    <button
                        className='btn btn-warning w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px'
                        onClick={handleNextClick}>
                        อัพเดทข้อมูล
                    </button>
                    <button
                        className='btn btn-primary w-100 w-md-auto align-self-center h-50px'
                        onClick={handleCheckerClick}
                    >
                        ส่งตรวจสอบ
                    </button>
                </div>

                {/* ปุ่มในหน้าจอเล็ก */}
                <div
                    className="d-flex d-md-none justify-content-between align-items-center bg-light p-3 border-top"
                    style={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1050,
                    }}
                >
                    <button
                        className="btn btn-secondary w-auto me-2"
                        onClick={() => navigate('/sale/step', { state: item })}
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        className="btn btn-warning w-auto me-2"
                        onClick={handleNextClick}
                    >
                        อัพเดทข้อมูล
                    </button>
                    <button
                        className='btn btn-primary w-auto'
                        onClick={handleCheckerClick}
                    >
                        ส่งตรวจสอบ
                    </button>
                </div>

            </Content>
        </>
    )
}

export default UpdateSalesDiscount;