import React, { useState, useEffect } from 'react';
import { toAbsoluteUrl } from '../../../../../../_metronic/helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../modules/auth/core/Auth';
import { useUUIDStore } from '../../../../../modules/stores/stepsStore';
import axios from 'axios';
import { ThreeDot } from 'react-loading-indicators';
import styles from "@/styles/style.module.css";

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

const IdCardPhotoGallery: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || "";

    const { data: item, fromStep = false } = (location.state as LocationState) || {};

    const [images, setImages] = useState<string[]>([]);
    // console.log(`images`, images);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { REFNO } = useUUIDStore();

    const refno = fromStep ? item?.REFNO : REFNO;

    // const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    // const GET_IMAGES_API = `${API_URL_MONGO}/Contract/GetContractImage?REFNO=${refno}`;
    const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
    const GET_IMAGES_API = `${API_URL_SALECONNEXT}/GetContractImages?RefNo=${refno}&EmpId=${EmpId}`;

    const isIOS: boolean = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid: boolean = /Android/.test(navigator.userAgent);
    const isTablet: boolean = /Tablet|iPad/.test(navigator.userAgent);
    const isPC: boolean = !isIOS && !isAndroid && !isTablet;

    // useEffect(() => {
    //     const fetchImages = async () => {
    //         setLoading(true);
    //         setError(null);

    //         try {
    //             const response = await axios.get(GET_IMAGES_API);

    //             const data = response.data;
    //             // console.log(data); // ตรวจสอบข้อมูล

    //             if (data?.IMAGECARD) {
    //                 // ใช้ข้อมูล Base64 ที่ได้โดยตรง
    //                 setImages(data.IMAGECARD);
    //             } else {
    //                 setImages([]);
    //             }

    //         } catch (err) {
    //             console.error('Error fetching images:', err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchImages();
    // }, [refno]);

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            setError(null);
            try {
                const resp = await axios.get(GET_IMAGES_API);
                const groups = Array.isArray(resp.data?.data) ? resp.data.data : [];

                const idcardGroup = groups.find(
                    (g: any) => g?.IMAGETYPECODE === "IDCARD"
                );

                const imgs = Array.isArray(idcardGroup?.IMAGES) ? idcardGroup.IMAGES : [];

                // map เอา URL (FULLURL > FULLPATH) และกรองค่าว่างออก
                const urls: string[] = imgs
                    .map((it: any) => it?.FULLURL || it?.FULLPATH || "")
                    .filter(Boolean);

                setImages(urls);
            } catch (err) {
                console.error("Error fetching images:", err);
                setError("ไม่สามารถโหลดรูปภาพได้");
                setImages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [GET_IMAGES_API, refno, EmpId]);

    return (
        <>
            {images.length > 0 && (<h2 className='mt-8 mb-2 mx-8' style={{ color: 'red' }}>* กดที่รูป หากต้องการดูรูปขนาดใหญ่</h2>)}
            <div className="row mx-5 mt-1">
                {loading ? (
                    <div className="text-center w-100">
                        <ThreeDot />
                    </div>
                ) : error ? (
                    <div className="text-center w-100 text-danger">
                        <h3>{error}</h3>
                    </div>
                ) : images.length > 0 ? (
                    images.map((url, index) => (
                        <div className="col-6 col-xl-4 mb-3 mt-3" key={index}>
                            <div className="border border-gray-500 position-relative">
                                <img
                                    src={url}
                                    alt={`Captured ${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setSelectedImage(url)}
                                />

                                <div
                                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                                    style={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease-in-out'
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                                >
                                    <img
                                        src={toAbsoluteUrl('media/settings/eye-svgrepo-com.png')}
                                        alt="ดูภาพ"
                                        style={{ width: 30, height: 30, cursor: 'pointer' }}
                                        onClick={() => setSelectedImage(url)}
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
                <div className='d-none d-xl-flex justify-content-between align-items-center my-5'>
                    <button
                        className={`${styles.btnSecondary}`}
                        onClick={() => navigate('/sale/photo', { state: { data: item, fromStep } })}
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        className={`${styles.btnPrimary}`}
                        onClick={() => navigate('/sale/photo/idcard', { state: { data: item, fromStep } })}
                    >
                        {isPC ? "เพิ่มรูปภาพ" : "แกลอรี่ / ถ่ายรูป"}
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
                        className={`${styles.btnSecondary}`}
                        onClick={() => navigate('/sale/photo', { state: { data: item, fromStep, from: location.pathname, } })}
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        className={`${styles.btnPrimary}`}
                        onClick={() => navigate('/sale/photo/idcard', { state: { data: item, fromStep } })}
                    >
                        {isPC ? "เพิ่มรูปภาพ" : "แกลอรี่ / ถ่ายรูป"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default IdCardPhotoGallery;