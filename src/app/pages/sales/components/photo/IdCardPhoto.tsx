import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toAbsoluteUrl } from '../../../../../_metronic/helpers';
import { useAuth } from '../../../../modules/auth/core/Auth';
import { useUUIDStore } from '../../../../modules/stores/stepsStore';
import axios from 'axios';
import {
    usePhotoIdCardStore,
    usePhotoDrawingMapStore,
    usePhotoTurnStore,
    usePhotoInstallationStore,
    usePhotoHomeCustomerStore,
    usePhotoCustomerStore,
    usePhotoEquipmentStore
} from '../../../../modules/stores/sales/photoStore/photoStore';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const IdCardPhoto: React.FC = () => {
    // สร้างใหม่
    const { REFNO } = useUUIDStore();
    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

    // อัพเดท
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
    const location = useLocation() as any;
    const navigate = useNavigate()
    const fromStep = location.state?.fromStep || false;
    console.log(`fromStep`, fromStep);

    const item = location.state?.data as ItemProps || [];
    console.log(`item`, item);

    // กำหนด REFNO
    const refno = fromStep ? item.REFNO : REFNO;

    const { imagesIdCard, addImage, removeImage, loadImages } = usePhotoIdCardStore();
    const { imagesDrawingMap } = usePhotoDrawingMapStore();
    const { imagesTurn } = usePhotoTurnStore();
    const { imagesInstallation } = usePhotoInstallationStore();
    const { imagesHomeCustomer } = usePhotoHomeCustomerStore();
    const { imagesCustomer } = usePhotoCustomerStore();
    const { imagesEquipment } = usePhotoEquipmentStore();

    const [error, setError] = useState<string | null>(null);

    const isIOS: boolean = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid: boolean = /Android/.test(navigator.userAgent);
    const isTablet: boolean = /Tablet|iPad/.test(navigator.userAgent);
    const isPC: boolean = !isIOS && !isAndroid && !isTablet;

    const [imageFromApi, setImageFromApi] = useState<string[]>([]); // ตัวแปรเก็บภาพจาก API
    console.log(`imageFromApi`, imageFromApi);

    // โหลดภาพจาก API ถ้า fromStep เป็น true
    useEffect(() => {
        if (fromStep && Array.isArray(item.IMAGE?.[0]?.IMAGECARD)) {
            const formattedImages = item.IMAGE?.[0]?.IMAGECARD.map((image: string) => {
                // ลบ prefix ซ้ำทั้งหมด
                const cleanedImage = image.replace(/^(data:image\/(jpeg|png|webp);base64,)+/, '');
                // ตรวจสอบประเภทของรูป
                if (image.includes('webp') || image.startsWith('data:image/webp;')) {
                    return `data:image/webp;base64,${cleanedImage.trim()}`; // เพิ่ม prefix ที่ถูกต้องสำหรับ webp
                }
                return `data:image/jpeg;base64,${cleanedImage.trim()}`; // ค่าเริ่มต้นใช้ jpeg
            });

            console.log('Formatted Images:', formattedImages);
            setImageFromApi(formattedImages);
        } else {
            console.warn('IMAGECARD is not an array or does not exist.');
            setImageFromApi([]);
        }
    }, [fromStep, item]);

    // โหลดภาพจาก Local Store
    useEffect(() => {
        if (!fromStep) {
            loadImages();
        }
    }, [fromStep, loadImages]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 3 * 1024 * 1024) {
                resizeImage(file);
            } else {
                readImageFile(file);
            }
        }
    };

    const readImageFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) {
                const imageData = reader.result as string;
                const cleanedImage = imageData.replace(/^(data:image\/(jpeg|png|webp);base64,)+/, '');
                const fileType = file.type; // ประเภทของไฟล์
                const formattedImage = fileType.includes('webp')
                    ? `data:image/webp;base64,${cleanedImage.trim()}`
                    : `data:image/jpeg;base64,${cleanedImage.trim()}`; // ค่าเริ่มต้นเป็น jpeg

                addImage(formattedImage);
                setError(null);
            }
        };
        reader.readAsDataURL(file);
    };

    const resizeImage = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const maxSize = 1024;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);

                // ตรวจสอบประเภทของไฟล์ก่อนบีบอัด
                const fileType = file.type; // "image/jpeg" หรือ "image/png"
                const resizedDataUrl = canvas.toDataURL(fileType === 'image/png' ? 'image/png' : 'image/jpeg', 0.7); // ใช้ type ของไฟล์ที่ถูกอัปโหลด

                addImage(resizedDataUrl);
                setError(null);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteImage = (image: string) => {
        removeImage(image);
    };

    // POST Contract/updateContract
    const handleNextClick = async () => {
        try {
            const cleanedImagesIdCard = imagesIdCard?.map((image) => {
                return image.replace(/^data:image\/(jpeg|png|webp);base64,/, ''); // ลบ prefix ก่อนส่ง
            });

            const updateContract = await axios.post(UPDATECONTACT, {
                REFNO: refno,
                EMPID: EmpId,
                TEAMSALE: TeamSale,
                SALECODE: SaleCode,
                SUPEMPID: SupEmpId,
                SECEMPID: SecEmpId,
                FIELD: "IMAGE",
                DATA: [{
                    "IMAGECARD": cleanedImagesIdCard,
                    "IMAGEGPS": [],
                    "IMAGEMAP": [],
                    "IMAGETRADEIN": [],
                    "IMAGEINSTALLATION": [],
                    "IMAGECUSTOMERHOME": [],
                    "IMAGECUSTOMER": [],
                    "IMAGETDS": [],
                }]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(`updateContract IMAGE: `, updateContract.data);
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'บันทึกรูปภาพลงระบบเรียบร้อยแล้ว',
            });
        } catch (error) {
            console.error('Error fetching UPDATECONTACT IMAGE:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: 'ไม่สามารถบันทึกรูปภาพได้ กรุณาลองใหม่อีกครั้ง',
            });
        }
    };

    const handleViewGallery = () => {
        const updatedItem = {
            ...item,
            IMAGE: [
                {
                    ...item.IMAGE?.[0],
                    IMAGECARD: [...imagesIdCard] // เพิ่มข้อมูลจาก `imagesIdCard`
                }
            ]
        };

        navigate("/sale/photo/gallery/idcard", { state: { data: updatedItem, fromStep } });
    };

    return (
        <div>

            <div className='d-flex align-items-center mt-10 mb-5 mx-7 gap-3'>
                <label
                    className='btn btn-success w-100 w-md-auto align-self-center'
                    htmlFor="camera-input"
                    style={{
                        cursor: 'pointer',
                        padding: '10px',
                        border: '1px solid #ccc',
                        display: 'inline-block',
                    }}
                >
                    {isPC ? "เลือกรูปจากคลัง" : "เลือกรูปจากคลัง / ใช้กล้อง"}
                </label>
                <button
                    className="btn btn-primary w-100 w-md-auto align-self-center"
                    onClick={handleViewGallery}
                >
                    ดูรูปภาพที่บันทึก
                </button>
            </div>
            {error && (
                <div className='alert alert-danger mx-5'>
                    {error}
                </div>
            )}
            <input
                id="camera-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            <div>
                {imagesIdCard.length > 0 && (
                    <div className='row mx-5'>
                        {(imagesIdCard)
                            .map((image: string, index: number) => (
                                <div className='col-6 col-xl-4 mb-3' key={index}>
                                    <div className='border border-gray-500'>
                                        <img
                                            src={image}
                                            alt={`Captured ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '200px',
                                                objectFit: 'cover',
                                            }}
                                            onError={(e) => {
                                                console.error('Error loading image:', image);
                                                // e.currentTarget.src = toAbsoluteUrl('media/placeholder.png'); // แสดง placeholder
                                            }}
                                        />

                                        <div className='d-flex justify-content-center mt-3 mb-2'>
                                            <img
                                                className='h-30px theme-light-show'
                                                src={toAbsoluteUrl('media/settings/trash-svgrepo-com.svg')}
                                                alt='ลบรูป'
                                                onClick={() => handleDeleteImage(image)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </div>

                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {/* แสดงปุ่มเมื่อมาจาก Step */}
                {fromStep ? (
                    <div className='d-none d-xl-flex justify-content-between align-items-center my-5 mx-7'>
                        <button
                            className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'
                            onClick={() => navigate('/sale/photo', { state: { data: item, fromStep } })}
                        >
                            ย้อนกลับ
                        </button>
                        <button
                            className='btn btn-warning w-100 w-md-auto align-self-center mb-2 mb-md-0'
                            type='button'
                            onClick={handleNextClick}
                        >
                            อัพเดทข้อมูล
                        </button>
                    </div>
                ) : (
                    <div className='d-none d-xl-flex justify-content-between align-items-center my-5 mx-7'>
                        <button
                            className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'
                            onClick={() => navigate('/sale/photo')}
                        >
                            ย้อนกลับ
                        </button>
                        <button
                            className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'
                            type='button'
                            onClick={handleNextClick}
                        >
                            บันทึกรูปภาพลงระบบ
                        </button>
                    </div>
                )}

                {/* ปุ่มในหน้าจอเล็ก */}
                {/* แสดงปุ่มเมื่อมาจาก Step */}
                {fromStep ? (
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
                            onClick={() => navigate('/sale/photo', { state: { data: item, fromStep } })}
                        >
                            ย้อนกลับ
                        </button>
                        <button
                            className="btn btn-warning w-auto me-2"
                            onClick={handleNextClick}
                        >
                            อัพเดทข้อมูล
                        </button>
                    </div>
                ) : (
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
                            onClick={() => navigate('/sale/photo')}
                        >
                            ย้อนกลับ
                        </button>
                        <button
                            className="btn btn-primary w-auto me-2"
                            onClick={handleNextClick}
                        >
                            บันทึกรูปภาพลงระบบ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IdCardPhoto;