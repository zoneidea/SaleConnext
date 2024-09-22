import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { KTIcon, toAbsoluteUrl } from '../../../../../_metronic/helpers';
import { drawingMapStore } from '../../../../modules/stores/galleryStore/drawingMapStore'; // Import store

const DrawingMapGallery: React.FC = () => {
    const { images, addImage, removeImage, loadImages } = drawingMapStore(); // ดึงข้อมูลและ actions จาก zustand
    const [currentImage, setCurrentImage] = useState<string | null>(null);

    const isIOS: boolean = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid: boolean = /Android/.test(navigator.userAgent);
    const isTablet: boolean = /Tablet|iPad/.test(navigator.userAgent);
    const isPC: boolean = !isIOS && !isAndroid && !isTablet;

    // โหลดรูปภาพจาก sessionStorage เมื่อ component ถูกโหลด
    useEffect(() => {
        loadImages(); // โหลดรูปภาพจาก store ที่เก็บใน sessionStorage
    }, [loadImages]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    // แสดงรูปที่เพิ่งเลือก ณ ขณะนั้น
                    setCurrentImage(reader.result as string);

                    // เพิ่มรูปลง store และบันทึกใน sessionStorage
                    addImage(reader.result as string);
                }
            };
            reader.readAsDataURL(file); // แปลงไฟล์เป็น Data URL
        }
    };

    // ฟังก์ชันเพื่อลบรูปภาพที่แสดงอยู่
    const handleDeleteImage = () => {
        if (currentImage) {
            // ลบรูปภาพจาก store
            removeImage(currentImage);
            setCurrentImage(null); // ลบรูปที่แสดงอยู่
        }
    };

    // ฟังก์ชันเพื่อบันทึกรูปลงเครื่อง
    const saveImageToDevice = async (imageDataUrl: string, filename: string) => {
        const link = document.createElement('a');
        link.href = imageDataUrl;
        link.download = `${filename}.png`; // ตั้งชื่อไฟล์ที่ดาวน์โหลด
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // ฟังก์ชันเพื่อบันทึกรูปภาพล่าสุดที่แสดง
    const handleSaveImage = async () => {
        if (images.length > 0) {
            const latestImage = images[images.length - 1]; // เอารูปสุดท้ายที่ถูกเพิ่ม
            await saveImageToDevice(latestImage, 'latest_photo');
        }
    };

    return (
        <div>
            {/* ตรวจสอบว่าถ้าเป็น PC ให้บล็อกฟีเจอร์ถ่ายรูป */}
            {!isPC ? (
                <>
                    <div className='d-flex flex-column flex-md-row justify-content-between mt-10 mb-5 mx-5'>
                        {/* ถ้าบนมือถือหรือแท็บเล็ต ให้ใช้กล้องหรือเลือกรูปจากคลัง */}
                        <label className='btn btn-primary w-100 w-md-auto align-self-center' htmlFor="camera-input" style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', display: 'inline-block' }}>
                            ใช้กล้อง / เลือกรูปจากคลัง
                        </label>
                    </div>
                    <input
                        id="camera-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }} // ซ่อน input file แบบดั้งเดิม
                    />
                    <div className='d-flex flex-column flex-md-row justify-content-between mb-10 mx-5'>
                        <label className='btn btn-success w-100 w-md-auto align-self-center'
                            style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', display: 'inline-block' }}
                            onClick={handleSaveImage}
                        >
                            บันทึกรูปภาพลงเครื่อง
                        </label>
                    </div>
                </>
            ) : (
                // ถ้าเป็น PC แสดงข้อความเตือนผู้ใช้ว่าไม่สามารถใช้ฟีเจอร์ถ่ายรูปได้
                <div className='alert alert-warning fw-semibold fs-6 my-10 mx-10'>
                    ฟีเจอร์ถ่ายรูป ไม่สามารถใช้บนอุปกรณ์คอมพิวเตอร์ได้ โปรดใช้งานบนอุปกรณ์มือถือหรือแท็บเล็ต
                </div>
            )}

            {/* แสดงรูปภาพที่เพิ่งถ่ายหรือเลือก */}
            <div>
                {!isPC ? (
                    <div>
                        {currentImage && (
                            <div className='row'>
                                {/* Card Body */}
                                <div className='card col-lg-3 col-6 mx-5'>
                                    <div className='d-flex flex-column justify-content-between bgi-no-repeat 
                                    bgi-size-cover bgi-position-x-center pb-0'>
                                        <img
                                            src={currentImage} // แสดงรูปที่เพิ่งเลือกหรือถ่าย
                                            alt="Captured"
                                            style={{
                                                width: 'auto', height: 'auto',
                                                objectFit: 'contain' // ให้ภาพถูกครอบตามขนาด
                                            }}
                                            className='img-fluid'
                                        />
                                    </div>
                                    <div className='d-flex justify-content-center mt-3'>
                                        <img
                                            className='mx-2 h-30px theme-light-show'
                                            src={toAbsoluteUrl('media/settings/trash-svgrepo-com.svg')}
                                            alt='ลบรูป'
                                            onClick={handleDeleteImage} // เรียกใช้ฟังก์ชันลบเมื่อกดที่ไอคอน
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </div>
                                </div>
                                {/* End Card Body */}
                            </div>
                        )}
                    </div>
                ) : (
                    <div></div>
                )}

                <div className='d-flex flex-column flex-md-row justify-content-between mx-5 mx-lg-10 mb-10'>
                    <Link to='/sale/photo' className='btn btn-secondary w-100 w-md-auto align-self-center'>
                        ย้อนกลับ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DrawingMapGallery;