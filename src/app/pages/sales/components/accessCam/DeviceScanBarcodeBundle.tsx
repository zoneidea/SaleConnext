import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import useRefnoBarcodeStore from '../accessCam/refnoBarcodeStore';
import { useCategoryStore } from '../../../../modules/stores/sales/packageStore/packageStore';
import styles from '@/styles/style.module.css';

type LocationState = {
    origin: string;
    refno?: string;
    promotionId?: number;
    selectedItemCode?: string;
    productId?: string;
    barCode?: string;
};

interface Props {
    onSetBundleData?: (barcode: string, bundleProduct: any | null) => void;
}

const DeviceScanBarcodeBundle: React.FC<Props> = ({ onSetBundleData }) => {
    const navigate = useNavigate();
    const {
        origin,
        refno,
        promotionId,
        selectedItemCode,
        productId,
        barCode: originalBarCode
    } = (useLocation().state as LocationState) || {};

    const { EmpId, DivisionId, DepartId, DepartGroup, TeamSale } = useCategoryStore();
    const { setRefno, setBarCode } = useRefnoBarcodeStore(s => ({
        setRefno: s.setRefno,
        setBarCode: s.setBarCode,
    }));

    const [barCode, setBarCodeState] = useState<string>('');
    const isMobile = /iPad|iPhone|iPod|Android/.test(navigator.userAgent);

    const GET_STOCK_URL = `${import.meta.env.VITE_APP_API_MONGO}/Product/GetStock`;
    const PROMOTION_URL = `${import.meta.env.VITE_APP_API_SALECONNEXT}/GetProduct/ProductPromotionList`;

    const goBack = (bundleProduct: any | null) => {
        const newState: any = {
            origin,
            refno,
            promotionId,
            selectedItemCode,
            productId,
            barCode: originalBarCode,
        };

        if (bundleProduct) {
            newState.bundleProduct = bundleProduct;
            newState.barCodeBundle = barCode;
        }
        navigate(origin, { state: newState });
    };

    const html5QrcodeRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        if (!isMobile) return;

        const config: Html5QrcodeCameraScanConfig = {
            fps: 10,
            qrbox: { width: 300, height: 180 },
        };

        const html5Qrcode = new Html5Qrcode("reader");
        html5QrcodeRef.current = html5Qrcode;

        html5Qrcode
            .start(
                { facingMode: "environment" },
                config,
                decodedText => setBarCodeState(decodedText),
                err => {
                    const msg = String(err);
                    // ignore the “ไม่มีบาร์โค้ด” errors:
                    if (
                        msg.includes('No barcode or QR code detected') ||
                        msg.includes('QR code parse error') ||
                        msg.includes('NotFoundException') ||
                        msg.includes('getImageData') ||
                        msg.includes('IndexSizeError')
                    ) {
                        // do nothing
                        return;
                    }
                    // ถ้าไม่ใช่กรณี above จึงแสดง log
                    console.error('Unexpected scanning error:', err);
                }
            )

        return () => {
            if (html5QrcodeRef.current) {
                html5QrcodeRef.current
                    .stop()
                    .then(() => html5QrcodeRef.current?.clear())
                    .catch(() => { });
            }
        };
    }, [isMobile]);

    useEffect(() => {
        if (!barCode || !promotionId || !selectedItemCode || !productId) return;

        axios
            .get(GET_STOCK_URL, {
                params: { empid: EmpId, teamSale: TeamSale, sn: encodeURIComponent(barCode) }
            })
            .then(resStock => {
                const stock = Array.isArray(resStock.data.data) ? resStock.data.data : [];
                if (!stock.length) {
                    Swal.fire('ไม่พบสินค้า', `ไม่พบ S/N: ${barCode}`, 'warning');
                    throw new Error('no-stock');
                }
                return {
                    scannedCode: stock[0].ItemCode,
                    stockItem: stock[0]
                };
            })
            .then(({ scannedCode, stockItem }) => {
                const form = new FormData();
                form.append('ProductID', productId);
                form.append('EmpId', EmpId);
                form.append('DivisionId', DivisionId);
                form.append('DepartId', DepartId);
                form.append('DepartGroup', DepartGroup);
                form.append('TeamSale', TeamSale);
                form.append('ItemID', selectedItemCode);
                form.append('IsBundle', '1');

                return axios.post(PROMOTION_URL, form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }).then(resPromo => {
                    const data = resPromo.data;
                    Swal.fire({
                        icon: 'info',
                        title: 'Promotion API Response',
                        html: `<pre style="text-align:left; font-size:12px;">${JSON.stringify(data, null, 2)}</pre>`,
                        width: 600,
                        confirmButtonText: 'ปิด'
                    });

                    return {
                        promos: Array.isArray(data.data) ? data.data : [],
                        scannedCode,
                        stockItem
                    };
                });
            })
            .then(({ promos, scannedCode, stockItem }) => {
                const promo = promos.find((p: any) => Number(p.PROMOTIONID) === promotionId);
                if (!promo) {
                    Swal.fire('ผิดพลาด', 'ไม่พบโปรโมชั่นที่เลือก', 'error');
                    return;
                }

                const match = Array.isArray(promo.PRODUCTDUNDLE) &&
                    promo.PRODUCTDUNDLE.some((d: any) => String(d.ITEMID) === scannedCode);

                if (match) {
                    Swal.fire({
                        icon: 'success',
                        title: 'สแกนสำเร็จ',
                        text: `S/N ที่สแกนได้: ${barCode}`,
                        timer: 1500,
                        showConfirmButton: false,
                    }).then(() => {
                        goBack(stockItem);
                    });
                } else {
                    Swal.fire('ไม่ตรงโปรโมชั่น', 'สินค้าที่สแกนไม่ตรงรายการบันเดิล', 'error')
                        .then(() => {
                            goBack(null);
                        });
                }
            })
            .catch(err => {
                if (err.message !== 'no-stock') console.error(err);
            });
    }, [barCode]);

    return (
        <div style={{ position: "relative", width: "100%", height: "500px" }}>
            {isMobile ? (
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

export default DeviceScanBarcodeBundle;