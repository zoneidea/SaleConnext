import { useBarcodeCamera } from '../sales/components/accessCam/useBarcodeCamera';
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

const BorrowScanBarCode: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [barCode, setBarCodeState] = useState<string>("");

    const isIOSorAndroid = /iPad|iPhone|iPod|Android/.test(navigator.userAgent);
    useBarcodeCamera(isIOSorAndroid, setBarCodeState);

    const handleNavigateBack = () => {
        navigate("/borrowproduct", {
            state: { tab: "borrowing" },
        });
    };

    useEffect(() => {
        if (barCode) {
            navigate("/borrowproduct", {
                state: { barCode },
            });
        }
    })

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
                        <h3>S/N ที่สแกนได้: {barCode}</h3>
                    </div>
                    <div className="d-flex justify-content-center align-items-center mt-5">
                        <button className="btn btn-danger w-150px"
                            onClick={handleNavigateBack}
                        >
                            ปิด
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="alert alert-primary fw-semibold fs-6 my-10 mx-10">
                        ฟีเจอร์สแกนบาร์โค้ด สามารถใช้งานได้เฉพาะบนมือถือหรือแท็บเล็ตเท่านั้น
                    </div>
                    <button className="btn btn-secondary mx-10"
                        onClick={() => navigate("/borrowproduct")}
                    >
                        ย้อนกลับ
                    </button>
                </>
            )}
        </div>
    );
};

export default BorrowScanBarCode;