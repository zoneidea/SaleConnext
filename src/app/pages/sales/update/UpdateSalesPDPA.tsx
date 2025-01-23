import axios from 'axios';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SignaturePad from 'react-signature-pad-wrapper';
import { Content } from '../../../../_metronic/layout/components/content';
import { useUUIDStore, useSaveCustomerStore } from '../../../modules/stores/stepsStore';
import { useAuth } from '../../../modules/auth/core/Auth';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface ContractState {
    contNo: string;
}

interface ItemProps {
    REFNO: string,
    CONTNO: string,
    EMPID: string,
    TEAMSALE: string,
    SALECODE: string,
    SUPEMPID: string,
    SECEMPID: string,
    STATUS: string,
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

interface ImagesType {
    IMAGECARD: string[];
    IMAGEGPS: string[];
    IMAGEMAP: string[];
    IMAGECUSTOMERHOME: string[];
    IMAGEINSTALLATION: string[];
    IMAGETDS: string[];
    IMAGECUSTOMER: string[];
    IMAGETRADEIN: string[];
}

const UpdateSalesPDPA: React.FC = () => {
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal);

    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const location = useLocation();
    const item = location.state as ItemProps || [];
    // console.log(`item`, item);

    const refno = item?.REFNO
    const pdpaContract = item?.PDPA
    // console.log(`pdpaContract`, pdpaContract[0].SIGNATURE);
    const customer = item?.CUSTOMERDETAIL
    // console.log(`customer`, customer);

    const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
    const SEND_SMS_API = `${API_URL_SALECONNEXT}/sendSMS/PDPA`;
    const CHECK_OTP_API = `${API_URL_SALECONNEXT}/CheckOTP/PDPA`;

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
    const GET_IMAGES_API = `${API_URL_MONGO}/Contract/GetContractImage`;

    const { saveCustomerTypes } = useSaveCustomerStore()

    const [consentGiven, setConsentGiven] = useState<boolean>(pdpaContract?.[0]?.CONSENTGIVEN || false); // ให้ความยินยอม
    // console.log(`consentGiven`, consentGiven);

    const [consentNotGiven, setConsentNotGiven] = useState<boolean>(!pdpaContract?.[0]?.CONSENTGIVEN || false); // ไม่ให้ความยินยอม
    // console.log(`consentNotGiven`, consentNotGiven);

    const [Alllow_Contract, setAlllow_Contract] = useState<number | undefined>();
    const [PDPA_Code, setPDPA_Code] = useState<string | null>();
    // console.log(`PDPA_Code`, PDPA_Code);

    const signaturePadRef = useRef<any>(null);
    const [signatureDataURL, setSignatureDataURL] = useState<string | null>(null);
    // console.log(`signatureDataURL`, signatureDataURL);

    const [isSignatureSaved, setIsSignatureSaved] = useState<boolean>(false); // สถานะการเซ็นชื่อ
    const [inputOTP, setInputOTP] = useState<string>('');
    // console.log(`inputOTP`, inputOTP);

    const [isOTPSent, setIsOTPSent] = useState<boolean>(false);
    const [responseCheckOTPSuccess, setResponseCheckOTPSuccess] = useState<boolean>(false);

    // State สำหรับเก็บ ContNo
    const [contNo, setContNo] = useState<string | null>(item?.CONTNO || null);

    const [images, setImages] = useState<ImagesType | null>(null);

    // Memoized ContNo สำหรับการใช้งานใน component อื่น
    const memoizedContNo = useMemo(() => {
        // ตรวจสอบว่าค่าที่ได้มาจาก item.CONTNO หรือ contNo
        if (!item?.CONTNO && contNo) {
            return contNo;
        }
        return item?.CONTNO || null; // ใช้ค่า item.CONTNO ถ้ามีค่าอยู่แล้ว
    }, [item?.CONTNO, contNo]);

    // console.log(`memoizedContNo`, memoizedContNo);

    // ตรวจสอบว่า `signaturePadRef` พร้อมใช้งานแล้ว
    useEffect(() => {
        if (signaturePadRef.current) {
            // console.log("SignaturePad is ready");
        }
    }, [signaturePadRef]);

    const clear = () => signaturePadRef.current?.clear()

    // Function to save the signature
    const saveSignature = () => {
        if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
            const signatureData = signaturePadRef.current.toDataURL('image/png');
            const base64Data = signatureData.replace(/^data:image\/png;base64,/, '');
            setSignatureDataURL(base64Data);
            signaturePadRef.current.clear();

            setIsSignatureSaved(true);
        } else {
            console.log("Signature pad is empty or not ready.");
        }
    };

    useEffect(() => {
        if (signatureDataURL) {
            sendSMS(); // เรียกใช้ sendSMS เมื่อ signatureDataURL เปลี่ยนแปลง
        }
    }, [signatureDataURL]); // ใช้ useEffect เพื่อรอให้ signatureDataURL มีค่า  

    // ให้ความยินยอมหรือไม่
    const handleConsentChange = (isGiven: boolean) => {
        setConsentGiven(isGiven);
        setConsentNotGiven(!isGiven);
    };

    useEffect(() => {
        setAlllow_Contract(consentGiven ? 1 : 0);
    }, [consentGiven]);

    useEffect(() => {
        setPDPA_Code(consentGiven ? '0001' : '0000');
    }, [consentGiven]);

    // fetch collection ContractImage
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(GET_IMAGES_API, {
                    params: { REFNO: refno },
                });

                // ตรวจสอบว่า response.data เป็นไปตามโครงสร้างของ ImagesType
                const data = response.data;

                if (
                    data &&
                    typeof data === 'object' &&
                    'IMAGECARD' in data &&
                    'IMAGEGPS' in data &&
                    'IMAGEMAP' in data &&
                    'IMAGECUSTOMERHOME' in data &&
                    'IMAGEINSTALLATION' in data &&
                    'IMAGETDS' in data &&
                    'IMAGETRADEIN' in data
                ) {
                    setImages(data as ImagesType);
                } else {
                    setImages(null);
                }
            } catch (err) {
                console.error('Error fetching images:', err);
                setImages(null); // ตั้งค่าเป็น null หากมีข้อผิดพลาด
            }
        };

        fetchImages();
    }, [refno]);

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    const sendSMS = async () => {
        saveSignature()
        setIsOTPSent(true)
        try {
            const responseSendSMS = await axios.post(SEND_SMS_API, {
                RefNo: refno,
                Alllow_Contract,
                PDPA_Code,
                TelMobile: customer?.[0]?.CUSTOMERMOBILE,
                IDCard: customer?.[0]?.CUSTOMERID,
                SignPath: pdpaContract?.[0]?.SIGNATURE || signatureDataURL,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // console.log(`responseSendSMS: `, responseSendSMS.data);
            if (responseSendSMS.data.status === 200) {
                if (!item?.CONTNO) {
                    setContNo(responseSendSMS.data.ContNo);
                }
            }
        } catch (error) {
            console.error('Error responseSendSMS:', error);
        }
    };

    // const checkOTP = async () => {
    //     try {
    //         const responseCheckOTP = await axios.post(CHECK_OTP_API, {
    //             EmpID: EmpId,
    //             RefNo: refno,
    //             OTP: inputOTP,
    //         }, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });

    //         // console.log(`responseCheckOTP: `, responseCheckOTP.data);

    //         if (responseCheckOTP.data.status === 400) {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'ข้อผิดพลาด!',
    //                 text: 'รหัส OTP ไม่ถูกต้อง!',
    //                 confirmButtonText: 'ตกลง',
    //             });
    //         } else if (responseCheckOTP.data.status === 200) {
    //             Swal.fire({
    //                 icon: 'success',
    //                 title: 'สำเร็จ!',
    //                 text: 'การตรวจสอบ OTP สำเร็จ!',
    //                 timer: 2000, // แสดงผล 3 วินาที
    //                 showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
    //             })
    //             setResponseCheckOTPSuccess(true)
    //         }
    //     } catch (error) {
    //         console.error('Error responseCheckOTP:', error);
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'ข้อผิดพลาด!',
    //             text: 'ไม่สามารถตรวจสอบ OTP ได้!',
    //             confirmButtonText: 'ตกลง',
    //         });
    //     }
    // };

    const checkOTP = async () => {
        try {
            const responseCheckOTP = await axios.post(CHECK_OTP_API, {
                EmpID: EmpId,
                RefNo: refno,
                OTP: inputOTP,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // ตรวจสอบสถานะการตอบกลับ
            if (responseCheckOTP.data.status === 400) {
                Swal.fire({
                    icon: 'error',
                    title: 'ข้อผิดพลาด!',
                    text: 'รหัส OTP ไม่ถูกต้อง!',
                    confirmButtonText: 'ตกลง',
                });
            } else if (responseCheckOTP.data.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ!',
                    text: 'การตรวจสอบ OTP สำเร็จ!',
                    timer: 2000, // แสดงผล 3 วินาที
                    showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
                });

                setResponseCheckOTPSuccess(true);

                // เรียก API handleUpdateContract หลังจาก OTP สำเร็จ
                handleUpdateContract();
            }
        } catch (error) {
            console.error('Error responseCheckOTP:', error);
            Swal.fire({
                icon: 'error',
                title: 'ข้อผิดพลาด!',
                text: 'ไม่สามารถตรวจสอบ OTP ได้!',
                confirmButtonText: 'ตกลง',
            });
        }
    };

    const handleUpdateContract = async () => {
        try {
            const updateContract = await axios.post(UPDATECONTACT, {
                REFNO: refno,
                EMPID: EmpId,
                TEAMSALE: TeamSale,
                FIELD: "PDPA",
                CONTNO: contNo,
                DATA: [{ CONSENTGIVEN: consentGiven, SIGNATURE: pdpaContract?.[0]?.SIGNATURE || signatureDataURL, OTP: inputOTP }]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // console.log(`updateContract PDPA: `, updateContract.data);
            if (updateContract.data.message === "Update contract successfully.") {
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ!',
                    text: 'ปรับปรุงข้อมูล PDPA แล้ว',
                    timer: 2000, // แสดงผล 3 วินาที
                    showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
                })
            } else {
                MySwal.fire('เกิดข้อผิดพลาด', updateContract.data.message, 'error');
            }
        } catch (error) {
            console.error('Error fetching PDPA:', error);
        }
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

        // console.log(response)

        if (response.status === 200) {
            if (!response.data.data) {
                MySwal.fire('เกิดข้อผิดพลาด', 'ส่งข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา', 'error');
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ!',
                    text: 'ส่งข้อมูลตรวจสอบแล้ว',
                    timer: 2000, // แสดงผล 3 วินาที
                    showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
                })
            }
        } else {
            MySwal.fire('เกิดข้อผิดพลาด', response.data.message, 'error');
        }
    }

    // เช็คว่า data ใน item มีครบทุกขั้นตอน (ไม่เป็น array เปล่า) ใช่ไหม ถ้าเป็นจะ disabled ปุ่มส่งตรวจสอบ
    const isDataComplete = useMemo(() => {
        // ตรวจสอบว่ามีรูปภาพในฟิลด์ใดฟิลด์หนึ่งใน images อย่างน้อย 1 รูป
        const hasImages = images && Object.values(images).some(
            (field) => Array.isArray(field) && field.length > 0
        );

        return (
            Array.isArray(item.ADDRESS) && item.ADDRESS.length > 0 &&
            Array.isArray(item.CUSTOMERDETAIL) && item.CUSTOMERDETAIL.length > 0 &&
            Array.isArray(item.CUSTOMERSTATUS) && item.CUSTOMERSTATUS.length > 0 &&
            Array.isArray(item.DISCOUNT) && item.DISCOUNT.length > 0 &&
            Array.isArray(item.PDPA) && item.PDPA.length > 0 &&
            Array.isArray(item.PRODUCT) && item.PRODUCT.length > 0 &&
            hasImages
        );
    }, [item, images]);

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-7 mt-lg-0'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            แก้ไข PDPA
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <span className="text-muted text-hover-primary">
                                    ระบบขาย
                                </span></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">แก้ไข PDPA</li>
                        </ul>
                    </div>
                </div>
                <p>เลขที่ขาย: {refno}</p>

                <div className='card mb-10 px-4'>
                    <div className='card-body flex justify-between items-center p-5'>
                        <div className='col-12 text-center'>
                            <span className="fw-bold fs-4">หนังสือให้ความยินยอม</span>
                        </div>
                        <br />
                        <div className='col-12'>
                            <span className="fs-6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ข้าพเจ้าตกลงและให้ความยินยอมแก่บริษัท สบาย เทคโนโลยี จำกัด (มหาชน) และบริษัทในกลุ่มสบาย รวมถึงพันธมิตรทางธุรกิจ (ให้เรียกรวมกัน“บริษัท”) โดยข้าพเจ้าตกลงใช้บริการและ/หรือผลิตภัณฑ์ของบริษัทในกลุ่มสบาย ณ วันที่ให้ความยินยอมนี้และต่อไปในภายหน้า ในการเก็บ รวบรวม ประมวลผล ใช้ และ/หรือ เปิดเผยข้อมูลส่วนบุคคล และข้อมูลส่วนบุคคลที่อ่อนไหว (Sensitive Data) (เช่น เชื้อชาติ สัญชาติ ศาสนา กรุ๊ปเลือด เป็นต้น) ที่มีข้อมูลปรากฏอยู่บนเอกสารระบุตัวตนของข้าพเจ้า (เช่น บัตรประชาชน หนังสือเดินทาง หรือเอกสารอื่นใดที่ออกโดยหน่วยงานราชการ) รวมถึงข้อมูลชีวภาพของข้าพเจ้า (เช่น ข้อมูลจำลองลายนิ้วมือ ข้อมูลชีวมิติ ข้อมูลภาพถ่ายจำลองใบหน้า เป็นต้น) ตลอดจนข้อมูลภาพหรือเสียงที่มีการบันทึก (ต่อไปนี้รวมเรียกว่า “<span className="fw-bold">ข้อมูลส่วนบุคคลของข้าพเจ้า</span>”) เพื่อวัตถุประสงค์ในการยืนยันและระบุตัวตนของข้าพเจ้าในการขอใช้บริการหรือผลิตภัณฑ์ดังกล่าว และ/หรือ ตามที่กฎหมายกำหนด โดยการดำเนินการดังกล่าวนั้น บริษัทได้ให้ความสำคัญต่อความเป็นส่วนตัวของผู้ใช้บริการ และจัดเก็บข้อมูลส่วนบุคคลของผู้ใช้บริการอย่างปลอดภัยและเป็นไปตามมาตรฐานที่กฎหมายกำหนด ดังนั้น ข้าพเจ้าในฐานะผู้ใช้บริการตกลงให้ความยินยอม ดังต่อไปนี้</span>
                            <br />
                            <span className="fs-6" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;โดยท่านสามารถตรวจสอบ บริษัทในกลุ่มสบายและพันธมิตรทางธุรกิจ รวมถึงบริษัทหรือพันธมิตรที่เกิดขึ้นในอนาคต ได้ที่ <a href="https://sabuytech.com/privacy-policy/" target="_blank" >https://sabuytech.com/privacy-policy/</a></span>
                            <br />
                            <u><span className="fs-6; fw-bold" >วัตถุประสงค์ในการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล</span></u>
                            <br />
                            <span className="fs-6" >วัตถุประสงค์ในการวิเคราะห์ หรือคาดการณ์เกี่ยวกับความชื่นชอบหรือพฤติกรรมของการใช้บริการหรือผลิตภัณฑ์ข้าพเจ้า เพื่อวิจัย พัฒนา ปรับปรุงผลิตภัณฑ์ และวางแผนการตลาด ให้<u>บริษัทในกลุ่มสบายและพันธมิตรทางธุรกิจ</u> เพื่อให้บริษัทสามารถวิเคราะห์และคัดสรรสินค้าและบริการอย่างเหมาะสมให้แก่ข้าพเจ้า รวมถึงยินยอมให้มีการเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้าระหว่าง และ/หรือให้แก่ บริษัทในกลุ่มสบาย และ/หรือ พันธมิตรทางธุรกิจ เพื่อวัตถุประสงค์ดังกล่าวด้วย</span>
                            <br />
                            <u><span className="fs-6 fw-bold" >ความยินยอม</span></u>
                            <br />
                            <u><span className="fs-6" >1.ความยินยอมให้เก็บรวบรวมใช้และเปิดเผยข้อมูลส่วนบุคคลเพื่อวัตถุประสงค์อื่นที่ไม่ใช่ทางการตลาด</span></u>
                            <br />
                            <span className="fs+6" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(ข้อมูลของท่านดังต่อไปนี้ มีความสำคัญต่อบริษัท, บริษัทในกลุ่มสบาย และพันธมิตรทางธุรกิจ ในการให้บริการได้อย่างมีประสิทธิภาพ หากท่านไม่ให้ความยินยอม อาจส่งผลให้บริษัทไม่สามารถให้บริการที่จำเป็นต้องใช้ข้อมูลที่เกี่ยวข้องได้ ทั้งนี้ บริษัทจะเก็บรวบรวมข้อมูลของท่านในส่วนที่ 2 เฉพาะกรณีการสมัครหรือขอใช้ผลิตภัณฑ์หรือบริการ ของบริษัทที่ต้องใช้ข้อมูลดังกล่าวเท่านั้น)</span>
                            <br />
                            <span className="fs+6" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. ข้อมูลที่มีความสำคัญต่อการให้บริการ </span>
                            <br />
                            <span className="fs+6" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. ยินยอมให้บริษัท เก็บรวบรวม ใช้ และ/หรือ เปิดเผยข้อมูลชีวมิติของท่าน (Biometric Data) สำหรับวัตถุประสงค์เพื่อการระบุตัวตนและพิสูจน์ตัวตนทางอิเล็กทรอนิกส์และเพื่อวัตถุประสงค์ในการสร้างลายมือชื่ออิเล็กทรอนิกส์</span>
                            <br />
                            <span className="fs+6" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. ยินยอมให้บริษัทรวบรวม ใช้ และ/หรือ เปิดเผยข้อมูลของท่านเกี่ยวกับศาสนา ซึ่งปรากฎอยู่ในสำเนาหรือรูปถ่ายของบัตรประชาชน และเป็นส่วนหนึ่งในขั้นตอนกระบวนการแสดงตัวตน ระบุตัวตน ยืนยันและพิสูจน์ตัวตนของท่านต่อกลุ่มบริษัท</span>
                            <br />
                            <span className="fs+6" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4. ยินยอมให้บริษัท เปิดเผย ส่งหรือโอนข้อมูลของท่านไปยังต่างประเทศ ซึ่งเป็นการปฏิบัติตามวัตถุประสงค์โดยชอบด้วยกฎหมาย ตามเงื่อนไขที่กำหนดไว้ในประกาศการคุ้มครองข้อมูลส่วนบุคคลของบริษัทในกลุ่มสบาย, และพันธมิตรทางธุรกิจ</span>
                            <br />
                            <span className="fs+6" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5. ยินยอมให้บริษัท เก็บรวบรวม ใช้ และ/หรือ เปิดเผยข้อมูลส่วนบุคคลที่มีความละเอียดอ่อนเกี่ยวกับความพิการ เพื่อวัตถุประสงค์ในการจัดทำสัญญาระหว่างบริษัทกับท่าน</span>
                            <br />
                            <u><span className="fs-6" >2.ความยินยอมให้เก็บรวบรวม ใช้ และเปิดเผยข้อมูลข้อมูลของท่านเพื่อวัตถุประสงค์การทำวิจัย หรือ การจัดทำข้อมูลสถิติ</span></u>
                            <br />
                            <span className="fs-6" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;เพื่อบรรลุวัตถุประสงค์ที่เกี่ยวกับการจัดทำเอกสารประวัติศาสตร์หรือจดหมายเหตุเพื่อประโยชน์สาธารณะ หรือที่เกี่ยวกับการศึกษาวิจัยหรือสถิติซึ่งได้จัดให้มีมาตรการปกป้องที่เหมาะสมเพื่อคุ้มครองสิทธิและเสรีภาพของเจ้าของข้อมูลส่วนบุคคล</span>
                            <br />
                            <u><span className="fs-6" >3.ความยินยอมให้เก็บรวบรวมใช้และเปิดเผยข้อมูลส่วนบุคคลเพื่อวัตถุประสงค์ทางการตลาด</span></u>
                            <br />
                            <span className="fs-6" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(การให้ความยินยอมเพื่อวัตถุประสงค์ทางการตลาด นี้จะช่วยให้ท่านได้รับข้อเสนอ ผลิตภัณฑ์และบริการที่หลากหลาย รวมถึงสิทธิพิเศษที่คัดสรรมาสำหรับท่านโดยเฉพาะเพื่อให้ตอบโจทย์ทุกความต้องการทางการเงินให้กับท่านมากยิ่งขึ้น)</span>
                            <br />
                            <span className="fs-6" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ข้าพเจ้ายินยอมให้บริษัท เก็บรวบรวมข้อมูลส่วนบุคคลไม่ว่าบริษัท จะได้รับจากข้าพเจ้าโดยตรงหรือจากแหล่งอื่น ใช้ และเปิดเผยข้อมูลของข้าพเจ้าให้แก่บริษัท เพื่อการวิเคราะห์ การส่งเสริมการขาย หรือการประชาสัมพันธ์ผลิตภัณฑ์และบริการ รวมถึงสิทธิพิเศษที่เป็นประโยชน์และตรงความต้องการโดยมีรายละเอียดดังต่อไปนี้</span>
                            <br />
                            <ul>
                                <li><span className="fs-6" >ธุรกิจบริการระบบชำระเงิน (Payment & Wallet) หมายถึง การให้บริการรับชำระเงิน โอนเงิน และการให้บริการกระเป๋าเงินอิเล็กทรอนิกส์ </span></li>
                                <li><span className="fs-6" >ธุรกิจจัดจำหน่ายสินค้าและผลิตภัณฑ์ (Merchandising) หมายถึง การให้บริการจำหน่ายสินค้าในกลุ่มอาหารเสริมบำรุงสุขภาพ, ธุรกิจขายส่งและขายปลีก เครื่องสำอางค์, เครื่องสาธารณูปโภค เครื่องใช้ไฟฟ้า, เครื่องกรองน้ำ, ไส้กรองน้ำ, ตู้เติมเงิน, ตู้น้ำมัน, ตู้กดน้ำลิตร, ตู้กดน้ำอัตโนมัติ, ตู้น้ำแข็ง, เครื่องแต่งกาย, เครื่องประดับ,อุปกรณ์สำนักงาน, อุปกรณ์เครื่องมือเครื่องใช้, อาหารเสริม,สินค้าอุปโภคและบริโภค, อุปกรณ์กีฬา, อุปกรณ์อิเล็กทรอนิกส์,แฟชั่น, เครื่องดื่มบำรุงสุขภาพ, บริการเสริมส่วน mobile service, อุปกรณ์เครื่องใช้ในครัวเรือน, ขายอาหาร</span></li>
                                <li><span className="fs-6" >ธุรกิจระบบโซลูชั่นส์ (Solution) หมายถึง การให้บริการขนส่ง ธุรกิจฝากของ กลุ่มธุรกิจแฟรนไชส์ต่าง ๆ ธุรกิจการจัดหางาน ธุรกิจการตลาดแบบตรง และรวมถึงธุรกิจขายตรง</span></li>
                                <li><span className="fs-6" >ธุรกิจบริการทางการเงิน (Financial Service) หมายถึง ธุรกิจในกลุ่มผลิตภัณฑ์สินเชื่อต่างๆ อาทิ สินเชื่อส่วนบุคคล ธุรกิจเช่าซื้อ ธุรกิจเช่าแบบลิสซิ่ง ผลิตภัณฑ์ประกันภัย, ผลิตภัณฑ์ประกันชีวิตและผลิตภัณฑ์ประกันวินาศภัย</span></li>
                                <li><span className="fs-6" >ธุรกิจเศรษฐกิจใหม่ (Innovation) หมายถึง สินทรัพย์ดิจิทัล การให้บริการใช้พอยท์ เป็นส่วนลดค่าสินค้าและหรือบริการ ธุรกิจนวัตกรรมทางสื่อ ดิจิทัลมีเดีย และ ขายเครือข่ายอินเตอร์เน็ต เครือข่าย การพัฒนาสินค้า และช่องทางจำหน่าย</span></li>
                            </ul>
                            <br />
                            <span className="fs-6" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ทั้งนี้ ในกรณีที่ข้าพเจ้ายังไม่บรรลุนิติภาวะ หรือ เป็นคนไร้ความสามารถ หรือคนเสมือนไร้ความสามารถ ข้าพเจ้าได้ขอความยินยอมและได้รับความยินยอมจากผู้ปกครองตามกฎหมายแล้ว</span>
                            <br />
                            <u><span className="fs-6 fw-bold" >การถอนความยินยอม</span></u>
                            <br />
                            <span className="fs-6" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ผู้ใช้บริการมีสิทธิขอถอนคำยินยอมเมื่อใดก็ได้ ผ่าน Application ของบริษัทหรือติดต่อ Call Center โทร. 1210  และหรือช่องทางที่บริษัทในกลุ่มสบายกำหนดในภายหน้า โดยสามารถดูรายละเอียดช่องทางการยกเลิกการให้คำยินยอมได้ที่ประกาศนโยบายความเป็นส่วนตัวของบริษัทในกลุ่มสบาย ทั้งนี้ บริษัทจะพิจารณาดำเนินการภายใน 7 วัน นับแต่วันที่ได้รับการแจ้งถอนคำยินยอม</span>
                            <br />
                            <span className="fs-6" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ซึ่งการถอนความยินยอมดังกล่าวไม่กระทบต่อการใช้ เปิดเผย รวมถึงการประมวลผลข้อมูลที่ได้ดำเนินการเสร็จสิ้นไปแล้ว โดยข้าพเจ้าสามารถขอถอนความยินยอมได้ตามช่องทางที่บริษัทระบุไว้</span>
                            <br />
                            <u><span className="fs-6 fw-bold" >ช่องทางการติดต่อข้อแนะนำเกี่ยวกับวิธีปฏิบัติของบริษัทเกี่ยวกับการจัดการข้อมูลส่วนบุคคล หรือต้องการไม่ให้ความยินยอมของท่านในภายหลัง</span></u>
                            <br />
                            <span className="fs-6" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ท่านสามารถติดต่อบริษัท สบาย คอนเน็กซ์ เทค จำกัด (มหาชน)  ตามที่อยู่ 43/9 หมู่ 7 ต.บางตลาด อ.ปากเกร็ด จ.นนทบรี 11120 หากท่านมีข้อสงสัยหรือข้อแนะนำเกี่ยวกับวิธีปฏิบัติของบริษัทเกี่ยวกับการจัดการข้อมูลส่วนบุคคล หรือต้องการไม่ให้ความยินยอมของท่านในภายหลัง ท่านสามารถดาวน์โหลดแบบฟอร์มคำขอใช้สิทธิของเจ้าของข้อมูลที่เกี่ยวกับข้อมูลส่วนบุคคลทาง Website ดำเนินการกรอกรายละเอียดส่งมายัง E-mail:  dpo@sabuyconnext.com</span>
                            <br />
                            <span className="fs-6" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;หากท่านประสงค์จะแก้ไขข้อมูลกรุณาติดต่อ Call Center โทร. 1210  ทั้งนี้หากไม่ได้รับการแจ้งจากท่านเป็นอย่างอื่น 7 วันหลังจากนี้ บริษัทจะเก็บรวบรวม ประมวลผลใช้ และเปิดเผยข้อมูลของท่านต่อไปตามกฎหมายภายใต้สัญญาที่ท่านมีกับบริษัท</span>
                            <br />
                            <span className="fs-6" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ข้าพเจ้าได้อ่านและรับทราบนโยบายคุ้มครองข้อมูลส่วนบุคคลของบริษัทในกลุ่มสบายและพันธมิตรทางธุรกิจเป็นอย่างดีแล้ว ที่เว็บไซต์ <a href="https://sabuytech.com/privacy-policy/" target="_blank" >https://sabuytech.com/privacy-policy/</a> ทั้งนี้ข้าพเจ้าขอรับรองว่าได้ทราบและเข้าใจสิทธิการคุ้มครองข้อมูลส่วนบุคคลและวัตถุประสงค์ในการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล ตามข้อความในหนังสือนี้อย่างครบถ้วนสมบูรณ์แล้ว จึงได้ลงเครื่องหมายแสดงความยินยอมรับเงื่อนไขการเก็บ รวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้าและสิทธิของข้าพเจ้าตามเงื่อนไขในหนังสือฉบับนี้ และลงลายมือชื่อไว้เป็นหลักฐาน</span>
                            <br />
                            <span className="fs-6" >&nbsp;</span>
                        </div>
                        <div className='row mb-4 text-center'>
                            <div className='col-lg-6 mb-3 mt-xl-5'>
                                <label className='form-check form-check-inline form-check-solid me-5'>
                                    <input
                                        className="form-check-input"
                                        name="showInstallAddress"
                                        type="checkbox"
                                        checked={consentGiven}
                                        onChange={() => handleConsentChange(true)}
                                    />
                                    <span className='fw-bold ps-2 fs-6 mb-sm-5'>ให้ความยินยอม</span>
                                </label>
                                <label className='form-check form-check-inline form-check-solid me-5 mt-3 mt-sm-0'>
                                    <input
                                        className="form-check-input"
                                        name="showBillAddress"
                                        type="checkbox"
                                        checked={consentNotGiven}
                                        onChange={() => handleConsentChange(false)}
                                    />
                                    <span className='fw-bold ps-2 fs-6'>ไม่ให้ความยินยอม</span>
                                </label>
                            </div>
                        </div>
                        <br />
                        <div className='col-12 text-center'>
                            {pdpaContract[0]?.SIGNATURE ? (
                                <img
                                    src={`data:image/png;base64,${pdpaContract?.[0]?.SIGNATURE}`}
                                    alt="ลายเซ็น"
                                    style={{ width: '100%', maxWidth: '300px', height: 'auto', marginTop: '10px' }}
                                />
                            ) : (
                                <>
                                    <SignaturePad
                                        ref={signaturePadRef}
                                        options={{ minWidth: 1, maxWidth: 3, penColor: 'rgb(0, 0, 0)' }}
                                        canvasProps={{
                                            className: 'responsive-canvas',
                                            style: { border: '1px solid grey', borderRadius: '10px' }
                                        }}
                                    />
                                    <div className='mt-5 mb-5'>
                                        <button
                                            className='btn btn-danger w-100 w-md-auto align-self-center mb-2 mb-md-0'
                                            onClick={clear}
                                        >ลบลายเซ็น
                                        </button>
                                    </div>
                                </>
                            )}

                            <div className='mt-5 mb-5'>
                            </div>

                            <span className="fs-1">&nbsp;</span>
                            <span className="fs-6" >ลงชื่อ
                                {pdpaContract?.[0]?.SIGNATURE && (
                                    <img src={`data:image/png;base64,${pdpaContract?.[0]?.SIGNATURE}`} alt="ลายเซ็น"
                                        style={{ maxWidth: '100px', marginTop: '10px' }} />
                                )}
                                {signatureDataURL && (
                                    <img src={`data:image/png;base64,${signatureDataURL}`} alt="ลายเซ็น"
                                        style={{ maxWidth: '100px' }} />
                                )}
                                <span>เจ้าของข้อมูล</span>
                            </span>
                            <br />
                            <br />
                            <span className="fs-6" >( {customer?.[0]?.CUSTOMERNAME} )</span>
                            <br />
                            <br />
                            {customer?.[0]?.CUSTOMERTYPE === "1" ? (
                                <span className="fs-6" >เลขประจำตัวผู้เสียภาษี {customer?.[0]?.CUSTOMERID} </span>
                            ) : (
                                <span className="fs-6" >เลขประจำตัวประชาชน {customer?.[0]?.CUSTOMERID} </span>
                            )}
                            <br />
                            <br />
                            <span className="fs-6" >วันที่ {formattedDate} </span>
                            <span className="fs-1">&nbsp;</span>
                        </div>

                        {isOTPSent && (
                            <div className='col-lg-12 mb-3'>
                                <label className='form-label required fw-bold fs-6'>OTP ที่ได้รับจากลูกค้า</label>
                                <input
                                    value={inputOTP}
                                    onChange={(e) => setInputOTP(e.target.value)}
                                    type='text'
                                    className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                                    placeholder='OTP ที่ได้รับจากลูกค้า'
                                />
                            </div>
                        )}

                    </div>
                </div>

                <div className='d-none d-xl-flex justify-content-between align-items-center mt-5'>
                    <button
                        className='btn btn-secondary w-100 w-md-auto align-self-center h-50px'
                        onClick={() => navigate('/sale/step', { state: item })}>
                        ย้อนกลับ
                    </button>

                    {/* {!responseCheckOTPSuccess && ( */}
                    <>
                        {isOTPSent ? (
                            <button
                                className='btn btn-warning w-100 w-md-auto align-self-center mb-2 mb-md-0'
                                type='button'
                                onClick={checkOTP}
                            >
                                อัพเดทข้อมูล
                            </button>
                        ) : (
                            <button
                                className='btn btn-warning w-100 w-md-auto align-self-center mb-2 mb-md-0'
                                type='button'
                                onClick={sendSMS}
                            >
                                รับ OTP
                            </button>
                        )}
                    </>
                    {/* )} */}
                    {/* 
                    {responseCheckOTPSuccess && (
                        <button
                            className='btn btn-warning w-100 w-md-auto align-self-center mb-5 mb-md-0 h-50px'
                            onClick={handleUpdateContract}>
                            อัพเดทข้อมูล
                        </button>
                    )} */}

                    <button className={`btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0 ${!isDataComplete ? `disabled` : ``}`}
                        disabled={!isDataComplete}
                        type='button'
                        onClick={handleCheckerClick}
                    >
                        ส่งตรวจสอบ
                    </button>
                </div>

                {/* ปุ่มในหน้าจอเล็ก */}
                <div
                    className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
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

                    {/* {!responseCheckOTPSuccess && ( */}
                    <>
                        {isOTPSent ? (
                            <button
                                className="btn btn-warning w-auto me-2"
                                type='button'
                                onClick={checkOTP}
                            >
                                อัพเดทข้อมูล
                            </button>
                        ) : (
                            <button
                                className="btn btn-warning w-auto me-2"
                                type='button'
                                onClick={sendSMS}
                            >
                                รับ OTP
                            </button>
                        )}
                    </>
                    {/* )} */}

                    {/* {responseCheckOTPSuccess && (
                        <button
                            className="btn btn-warning w-auto me-2"
                            onClick={handleUpdateContract}>
                            อัพเดทข้อมูล
                        </button>
                    )} */}

                    <button className={`btn btn-primary w-auto me-2 ${!isDataComplete ? `disabled` : ``}`}
                        disabled={!isDataComplete}
                        type='button'
                        onClick={handleCheckerClick}
                    >
                        ส่งตรวจสอบ
                    </button>
                </div>

            </Content>
        </>
    )
}

export default UpdateSalesPDPA;