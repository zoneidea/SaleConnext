import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toAbsoluteUrl } from '../../../../../_metronic/helpers';
import { usePhotoIdCardStore } from '../../../../modules/stores/sales/photoStore/photoStore';
import { useAuth } from '../../../../modules/auth/core/Auth';
import { useUUIDStore } from '../../../../modules/stores/stepsStore';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const IdCardPhoto: React.FC = () => {
    const { REFNO } = useUUIDStore();
    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

    const { images, addImage, removeImage, loadImages } = usePhotoIdCardStore();
    const [error, setError] = useState<string | null>(null);

    const isIOS: boolean = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid: boolean = /Android/.test(navigator.userAgent);
    const isTablet: boolean = /Tablet|iPad/.test(navigator.userAgent);
    const isPC: boolean = !isIOS && !isAndroid && !isTablet;

    useEffect(() => {
        loadImages();
    }, [loadImages]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (images.length >= 3) {
            setError('คุณสามารถเลือกรูปได้สูงสุด 3 รูปเท่านั้น');
            return;
        }

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
                addImage(reader.result as string);
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
    // POST Contract/updateContract
    const handleNextClick = async () => {
        try {
            const updateContract = await axios.post(UPDATECONTACT, {
                REFNO,
                EMPID: EmpId,
                TEAMSALE: TeamSale,
                SALECODE: SaleCode,
                SUPEMPID: SupEmpId,
                SECEMPID: SecEmpId,
                FIELD: "IMAGE",
                IMAGECARD: images // ลบ DATA: ออก
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(`updateContract IMAGE: `, updateContract.data);
            // แสดง SweetAlert เมื่อบันทึกสำเร็จ
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'บันทึกรูปภาพลงระบบเรียบร้อยแล้ว',
            });
        } catch (error) {
            console.error('Error fetching UPDATECONTACT IMAGE:', error);
            // แสดง SweetAlert เมื่อเกิดข้อผิดพลาด
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: 'ไม่สามารถบันทึกรูปภาพได้ กรุณาลองใหม่อีกครั้ง',
            });
        }
    };

    return (
        <div>
            {!isPC ? (
                <>
                    <div className='d-flex flex-column flex-md-row justify-content-between mt-10 mb-5 mx-5'>
                        <label className='btn btn-primary w-100 w-md-auto align-self-center'
                            htmlFor="camera-input"
                            style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', display: 'inline-block' }}>
                            เลือกรูปจากคลัง / ใช้กล้อง
                        </label>
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
                </>
            ) : (
                <div className='alert alert-warning fw-semibold fs-6 my-10 mx-10'>
                    ฟีเจอร์ถ่ายรูป ไม่สามารถใช้บนอุปกรณ์คอมพิวเตอร์ได้ โปรดใช้งานบนอุปกรณ์มือถือหรือแท็บเล็ต
                </div>
            )}

            <div>
                {!isPC ? (
                    <div>
                        {images.length > 0 && (
                            <div className='d-flex flex-column flex-md-row justify-content-between mx-5'>
                                {images.slice(0, 3).map((image, index) => (
                                    <div className='border border-gray-500' key={index}>
                                        <div className='d-flex justify-content-between align-items-center mb-3'>
                                            <img
                                                src={image}
                                                alt={`Captured ${index + 1}`}
                                                style={{
                                                    width: '300px', height: 'auto',
                                                }}
                                            />
                                            <img
                                                className='mx-2 h-30px theme-light-show'
                                                src={toAbsoluteUrl('media/settings/trash-svgrepo-com.svg')}
                                                alt='ลบรูป'
                                                onClick={() => handleDeleteImage(image)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10 mx-lg-10 mx-5'>
                            <Link to='/sale/photo' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                                ย้อนกลับ
                            </Link>
                            <button
                                className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'
                                type='button'
                                onClick={handleNextClick}
                            >
                                บันทึกรูปภาพลงระบบ
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <Link to='/sale/photo' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0 mx-lg-10 mx-5'>
                            ย้อนกลับ
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IdCardPhoto;