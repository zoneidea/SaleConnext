// import styles from '@/styles/style.module.css'
// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

// import useRefnoBarcodeStore from "../accessCam/refnoBarcodeStore";

// interface LocationState {
//     item?: ItemProps; // กำหนดให้ state มี item เป็น optional
// }

// interface ItemProps {
//     REFNO: string;
//     CONTNO: string;
//     EMPID: string;
//     TEAMSALE: string;
//     SALECODE: string;
//     SUPEMPID: string;
//     SECEMPID: string;
//     STATUS: string;
//     PRODUCT: [any];
//     CUSTOMERSTATUS: [any];
//     DISCOUNT: [any];
//     CUSTOMERDETAIL: [any];
//     ADDRESS: [any];
//     PDPA: [any];
//     CONTRACT: [any];
//     IMAGE: [any];
//     CHECKERCOMMENT: [any];
// }

// const DeviceScanBarcode: React.FC = () => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     // ใช้ type assertion เพื่อระบุประเภทของ state
//     const state = location.state as LocationState | undefined;
//     const item = state?.item as ItemProps; // ใช้ type assertion กับ item
//     // console.log(`Received item:`, item);

//     const { setRefno, setBarCode } = useRefnoBarcodeStore((state) => ({
//         setRefno: state.setRefno,
//         setBarCode: state.setBarCode,
//     }));
//     const [barCode, setBarCodeState] = useState<string>("");

//     const html5QrcodeScannerRef = React.useRef<Html5Qrcode | null>(null);
//     const [isScannerRunning, setIsScannerRunning] = useState(false);

//     const isIOSorAndroid = /iPad|iPhone|iPod|Android/.test(navigator.userAgent);

//     useEffect(() => {
//         if (isIOSorAndroid) {
//             const html5QrcodeScanner = new Html5Qrcode("reader");
//             html5QrcodeScannerRef.current = html5QrcodeScanner;

//             const config = {
//                 fps: 10,
//                 qrbox: 250,
//                 formatsToSupport: [
//                     Html5QrcodeSupportedFormats.EAN_13,
//                     Html5QrcodeSupportedFormats.CODE_128,
//                 ],
//                 verbose: true,
//             };

//             html5QrcodeScanner
//                 .start(
//                     { facingMode: "environment" },
//                     config,
//                     (decodedText) => {
//                         setBarCodeState(decodedText); // บันทึกค่า Barcode ที่สแกนได้
//                     },
//                     (errorMessage) => {
//                         console.warn(`Error scanning: ${errorMessage}`);
//                     }
//                 )
//                 .then(() => {
//                     setIsScannerRunning(true);
//                 })
//                 .catch((err) => {
//                     console.error(`Unable to start scanning: ${err}`);
//                 });

//             return () => {
//                 if (isScannerRunning && html5QrcodeScannerRef.current) {
//                     html5QrcodeScannerRef.current
//                         .stop()
//                         .then(() => console.log("Scanner stopped successfully"))
//                         .catch((err) => console.error("Error stopping scanner:", err));
//                 }
//             };
//         }
//     }, [isIOSorAndroid, isScannerRunning]);

//     const handleNavigateBack = () => {
//         setBarCode(barCode); // บันทึก barCode ลง Zustand
//         setRefno(item?.REFNO || ""); // บันทึก refno ลง Zustand
//         navigate("/sale/package", {
//             state: { item, barCode }, // ส่งกลับมาทั้ง item และ refno
//         });
//     };

//     useEffect(() => {
//         if (barCode) {
//             navigate("/sale/package", {
//                 state: { item, barCode }, // ส่งกลับมาทั้ง item และ refno
//             });
//         }
//     })

//     return (
//         <div style={{ position: "relative", width: "100%", height: "500px" }}>
//             {isIOSorAndroid ? (
//                 <>
//                     <div id="reader" style={{ width: "100%", height: "100%" }}></div>
//                     <div
//                         style={{
//                             border: "2px solid red",
//                             position: "absolute",
//                             top: "50%",
//                             left: "50%",
//                             width: "80%",
//                             height: "40%",
//                             transform: "translate(-50%, -50%)",
//                             zIndex: 10,
//                             pointerEvents: "none",
//                         }}
//                     />
//                     <div className="d-flex justify-content-center align-items-center mt-20">
//                         {/* <h3 className={`${styles.fontSize}`}>S/N ที่สแกนได้: {barCode}</h3> */}
//                     </div>
//                     <div className="d-flex justify-content-center align-items-center mt-5">
//                         <button className="btn btn-danger w-150px" onClick={handleNavigateBack}>
//                            <p className={`${styles.fontSize}`}>ปิด</p>
//                         </button>
//                     </div>
//                 </>
//             ) : (
//                 <>
//                     <div className="alert alert-primary fw-semibold fs-6 my-10 mx-10">
//                         ฟีเจอร์สแกนบาร์โค้ด สามารถใช้งานได้เฉพาะบนมือถือหรือแท็บเล็ตเท่านั้น
//                     </div>
//                     <button className="btn btn-secondary mx-10" onClick={() => navigate("/sale/package")}>
//                         ย้อนกลับ
//                     </button>
//                 </>
//             )}
//         </div>
//     );
// };

// export default DeviceScanBarcode;



import styles from '@/styles/style.module.css'
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

import useRefnoBarcodeStore from "../accessCam/refnoBarcodeStore";

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
}

type FromUpdateState = {
    origin: '/sale/update/updateSalePackage'
    item: ItemProps
    refno: string
}

type FromPackageState = {
    origin: '/sale/package'
    REFNO: string           // note: มาจาก SalesPackage คุณส่งชื่อ REFNO ขึ้นต้น
}

type LocationState = FromUpdateState | FromPackageState

const DeviceScanBarcode: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const state = (location.state || {}) as Partial<LocationState>
    const origin = state.origin!

    // ปะทะทั้งสองชื่อ refno / REFNO ให้ใช้ตัวที่มีจริง
    const refno = 'refno' in state
        ? state.refno!
        : ('REFNO' in state ? state.REFNO! : '')

    // item จะมีก็ต่อเมื่อมาจากหน้า UpdateSalesPackage
    const item = 'item' in state
        ? state.item!
        : undefined

    const { setRefno, setBarCode } = useRefnoBarcodeStore((state) => ({
        setRefno: state.setRefno,
        setBarCode: state.setBarCode,
    }));
    const [barCode, setBarCodeState] = useState<string>("");

    const html5QrcodeScannerRef = React.useRef<Html5Qrcode | null>(null);
    const [isScannerRunning, setIsScannerRunning] = useState(false);

    const isIOSorAndroid = /iPad|iPhone|iPod|Android/.test(navigator.userAgent);

    useEffect(() => {
        if (isIOSorAndroid) {
            const html5QrcodeScanner = new Html5Qrcode("reader");
            html5QrcodeScannerRef.current = html5QrcodeScanner;

            const config = {
                fps: 10,
                qrbox: 250,
                formatsToSupport: [
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.CODE_128,
                ],
                verbose: true,
            };

            html5QrcodeScanner
                .start(
                    { facingMode: "environment" },
                    config,
                    (decodedText) => {
                        setBarCodeState(decodedText); // บันทึกค่า Barcode ที่สแกนได้
                    },
                    (errorMessage) => {
                        console.warn(`Error scanning: ${errorMessage}`);
                    }
                )
                .then(() => {
                    setIsScannerRunning(true);
                })
                .catch((err) => {
                    console.error(`Unable to start scanning: ${err}`);
                });

            return () => {
                if (isScannerRunning && html5QrcodeScannerRef.current) {
                    html5QrcodeScannerRef.current
                        .stop()
                        .then(() => console.log("Scanner stopped successfully"))
                        .catch((err) => console.error("Error stopping scanner:", err));
                }
            };
        }
    }, [isIOSorAndroid, isScannerRunning]);

    const goBack = () => {

        setRefno(refno)
        setBarCode(barCode)
        // ถ้ามี item ส่งกลับไปด้วย ไม่งั้นหน้า SalesPackage ก็ไม่ต้อง
        const backState = item
            ? { item, refno, barCode }
            : { barCode }
        navigate(origin, { state: backState })
    }

    // ถ้าได้ barCode ปั๊บก็ redirect เลย
    useEffect(() => {
        if (barCode) goBack()
    }, [barCode])

    return (
        <div style={{ position: "relative", width: "100%", height: "500px" }}>
            {isIOSorAndroid ? (
                <>
                    <div id="reader" style={{ width: "100%", height: "100%" }}></div>
                    <div
                        style={{
                            border: "2px solid red",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            width: "80%",
                            height: "40%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 10,
                            pointerEvents: "none",
                        }}
                    />
                    <div className="d-flex justify-content-center align-items-center mt-20">
                        {/* <h3 className={`${styles.fontSize}`}>S/N ที่สแกนได้: {barCode}</h3> */}
                    </div>
                    <div className="d-flex justify-content-center align-items-center mt-5">
                        <button className="btn btn-danger w-150px" onClick={goBack}>
                            <p className={`${styles.fontSize}`}>ปิด</p>
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="alert alert-primary fw-semibold fs-6 my-10 mx-10">
                        ฟีเจอร์สแกนบาร์โค้ด สามารถใช้งานได้เฉพาะบนมือถือหรือแท็บเล็ตเท่านั้น
                    </div>
                    <button className="btn btn-secondary" onClick={goBack}>
                        ย้อนกลับ
                    </button>
                </>
            )}
        </div>
    );
};

export default DeviceScanBarcode;