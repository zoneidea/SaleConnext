import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { KTIcon, toAbsoluteUrl } from '../../../../../_metronic/helpers';
import { turnStore } from '../../../../modules/stores/sales/galleryStore/turnStore'

const TurnGallery: React.FC = () => {
    const { images, addImage, removeImage, loadImages } = turnStore(); // ดึงข้อมูลและ actions จาก zustand
    const [error, setError] = useState<string | null>(null); // สำหรับเก็บข้อความแสดงข้อผิดพลาด

    const isIOS: boolean = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid: boolean = /Android/.test(navigator.userAgent);
    const isTablet: boolean = /Tablet|iPad/.test(navigator.userAgent);
    const isPC: boolean = !isIOS && !isAndroid && !isTablet;

    // ดึงรูปภาพจาก sessionStorage ทุกครั้งที่ component โหลดใหม่
    useEffect(() => {
        loadImages(); // โหลดรูปภาพจาก sessionStorage ผ่าน zustand
    }, [loadImages]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (images.length >= 3) {
            setError('คุณสามารถเลือกรูปได้สูงสุด 3 รูปเท่านั้น');
            return;
        }

        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    // บันทึก currentImage และเพิ่มรูปลง store
                    addImage(reader.result as string);
                    setError(null); // ล้างข้อความแสดงข้อผิดพลาดถ้ามี
                }
            };
            reader.readAsDataURL(file); // แปลงไฟล์เป็น Data URL
        }
    };

    // ฟังก์ชันเพื่อลบรูปภาพที่แสดงอยู่
    const handleDeleteImage = (image: string) => {
        removeImage(image); // ลบรูปภาพจาก store
    };

    return (
        <div>
            {!isPC ? (
                <>
                    <div className='d-flex flex-column flex-md-row justify-content-between mt-10 mb-5 mx-5'>
                        <label className='btn btn-primary w-100 w-md-auto align-self-center'
                            htmlFor="camera-input"
                            style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', display: 'inline-block' }}>
                            เลือกรูปจากคลัง
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
                        style={{ display: 'none' }} // ซ่อน input file แบบดั้งเดิม
                    />
                </>
            ) : (
                <div className='alert alert-warning fw-semibold fs-6 my-10 mx-10'>
                    ฟีเจอร์ถ่ายรูป ไม่สามารถใช้บนอุปกรณ์คอมพิวเตอร์ได้ โปรดใช้งานบนอุปกรณ์มือถือหรือแท็บเล็ต
                </div>
            )}

            {/* แสดงรูปภาพที่เลือก */}
            <div>
                {!isPC ? (
                    <div>
                        {images.length > 0 && (
                            <div className='d-flex flex-column flex-md-row justify-content-between mx-5'>
                                {images.slice(0, 3).map((image, index) => ( // แสดงสูงสุด 3 รูป
                                    <div className='border border-gray-500' key={index}>
                                        <div className='d-flex justify-content-between align-items-center mb-3'>
                                            <img
                                                src={image} // แสดงรูปที่เลือก
                                                alt={`Captured ${index + 1}`}
                                                style={{
                                                    width: '300px', height: 'auto',
                                                }}
                                            />
                                            {/* ไอคอนถังขยะสำหรับลบรูป */}
                                            <img
                                                className='mx-2 h-30px theme-light-show'
                                                src={toAbsoluteUrl('media/settings/trash-svgrepo-com.svg')}
                                                alt='ลบรูป'
                                                onClick={() => handleDeleteImage(image)} // เรียกใช้ฟังก์ชันลบเมื่อกดที่ไอคอน
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
                            <Link to='' className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                                บันทึกรูปภาพลงระบบ
                            </Link>
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

export default TurnGallery;