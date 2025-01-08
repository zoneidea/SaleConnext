import React, { useState, useEffect } from 'react';
import { toAbsoluteUrl } from '../../../../../../_metronic/helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../modules/auth/core/Auth';
import { useUUIDStore } from '../../../../../modules/stores/stepsStore';
import axios from 'axios';
import { ThreeDot } from 'react-loading-indicators';

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

interface LocationState {
    data?: ItemProps;
    fromStep?: boolean;
}

function EquipmentPhotoGallery() {
    const location = useLocation();
    const navigate = useNavigate();

    // ตรวจสอบชนิดของ location.state
    const { data: item, fromStep = false } = (location.state as LocationState) || {};

    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // เพิ่ม state สำหรับ loading

    // สร้างใหม่
    const { REFNO } = useUUIDStore();

    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    // กำหนด REFNO
    const refno = fromStep ? item?.REFNO : REFNO;

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const GETSUMMARYCONTACT = `${API_URL_MONGO}/Contract/GetContractSummary?refno=${refno}`;

    const [getSummaryContract, setGetSummaryContract] = useState<any[]>([]);
    const imageFromSummary = getSummaryContract[0]?.IMAGE;

    // โหลด summary contract
    useEffect(() => {
        const fetchContractSummary = async () => {
            try {
                const response = await axios.get(GETSUMMARYCONTACT, {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setGetSummaryContract(data);
            } catch (error) {
                console.error('Error fetching contract summary:', error);
            } finally {
                setLoading(false); // หยุด loading เมื่อดึงข้อมูลเสร็จ
            }
        };

        fetchContractSummary();
    }, [refno]);

    useEffect(() => {
        const getDataFromSummary = async () => {
            try {
                if (imageFromSummary && imageFromSummary.length > 0 && imageFromSummary[0]?.IMAGETDS) {
                    const data = imageFromSummary[0]?.IMAGETDS;

                    const processedImages = data.map((image: string) => {
                        const prefix = 'data:image/jpeg;base64,';
                        return `${prefix}${image.trim()}`;
                    });

                    setImages(processedImages);
                } else {
                    setImages([]);
                }
            } catch (error) {
                console.error('Error processing images from summary:', error);
            }
        };

        getDataFromSummary();
    }, [imageFromSummary]);

    return (
        <div className="row mx-5 mt-10">
            {loading ? (
                <div className="text-center w-100">
                    {/* แสดง ThreeDot ขณะกำลังโหลด */}
                    {/* <ThreeDot color="#3B82F6" size="large" /> */}
                    <ThreeDot />
                </div>
            ) : images.length > 0 ? (
                images.map((base64Image, index) => (
                    <div className="col-6 col-xl-4 mb-3" key={index}>
                        <div className="border border-gray-500 position-relative">
                            <img
                                src={base64Image}
                                alt={`Captured ${index + 1}`}
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setSelectedImage(base64Image)}
                            />
                            {/* Overlay */}
                            <div
                                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                                style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease-in-out',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                            >
                                <img
                                    src={toAbsoluteUrl('media/settings/eye-svgrepo-com.png')}
                                    alt="ดูภาพ"
                                    style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                                    onClick={() => setSelectedImage(base64Image)}
                                />
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center w-100">
                    <h3>ยังไม่มีรูปภาพในระบบ</h3>
                </div>
            )}

            {/* Modal สำหรับแสดงรูปภาพขยาย */}
            {selectedImage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                    onClick={() => setSelectedImage(null)}
                >
                    <img
                        src={selectedImage}
                        alt="Selected"
                        style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            border: '2px solid white',
                        }}
                    />
                </div>
            )}

            {/* ปุ่มย้อนกลับ */}
            <div className="d-none d-xl-flex justify-content-between align-items-center my-5">
                <button
                    className="btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0"
                    onClick={() =>
                        navigate('/sale/photo/idcard', { state: { data: item, fromStep } })
                    }
                >
                    ย้อนกลับ
                </button>
            </div>

            {/* ปุ่มในหน้าจอเล็ก */}
            <div
                className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1050,
                }}
            >
                <button
                    className="btn btn-secondary w-auto me-2"
                    onClick={() => navigate('/sale/photo/equipment', { state: { data: item, fromStep } })}
                >
                    ย้อนกลับ
                </button>
            </div>
        </div>
    );
}

export default EquipmentPhotoGallery;