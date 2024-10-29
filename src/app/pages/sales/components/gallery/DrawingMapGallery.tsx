import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '../../../../../_metronic/helpers';
import { drawingMapStore } from '../../../../modules/stores/sales/galleryStore/drawingMapStore';

const DrawingMapGallery: React.FC = () => {
    const { image, setImage, clearImage, loadImage } = drawingMapStore();
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

    const isIOS: boolean = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid: boolean = /Android/.test(navigator.userAgent);
    const isTablet: boolean = /Tablet|iPad/.test(navigator.userAgent);
    const isPC: boolean = !isIOS && !isAndroid && !isTablet;

    useEffect(() => {
        loadImage();
    }, [loadImage]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setImage(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = () => {
        clearImage();
    };

    const handleImageClick = () => {
        setIsFullScreen(true);
    };

    const handleCloseFullScreen = () => {
        setIsFullScreen(false);
    };

    // ฟังก์ชันเพื่อบันทึกรูปลงเครื่อง
    const handleSaveImage = () => {
        if (image) {
            const link = document.createElement('a');
            link.href = image;
            link.download = 'captured_image.png'; // ตั้งชื่อไฟล์ที่ดาวน์โหลด
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div>
            {!isPC ? (
                <>
                    <div className='d-flex flex-column flex-md-row justify-content-between mt-10 mb-3 mx-5'>
                        <label className='btn btn-primary w-100 w-md-auto align-self-center' htmlFor="camera-input" style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', display: 'inline-block' }}>
                            ใช้กล้อง / เลือกรูปจากคลัง
                        </label>
                    </div>
                    <input
                        id="camera-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mx-5'>
                        <button
                            className='btn btn-success'
                            onClick={handleSaveImage}
                            style={{ cursor: 'pointer' }}
                        >
                            บันทึกรูปภาพลงเครื่อง
                        </button>
                    </div>
                </>
            ) : (
                <div className='alert alert-warning fw-semibold fs-6 my-10 mx-10'>
                    ฟีเจอร์ถ่ายรูป ไม่สามารถใช้บนอุปกรณ์คอมพิวเตอร์ได้ โปรดใช้งานบนอุปกรณ์มือถือหรือแท็บเล็ต
                </div>
            )}

            <div>
                {!isPC && image && (
                    <div className='row'>
                        <div className='card col-lg-3 col-6 mx-5'>
                            <div className='d-flex flex-column justify-content-between bgi-no-repeat 
                            bgi-size-cover bgi-position-x-center pb-0'>
                                <img
                                    src={image}
                                    alt="Captured"
                                    style={{
                                        width: '100%', height: 'auto',
                                        objectFit: 'contain'
                                    }}
                                    className='img-fluid'
                                    onClick={handleImageClick}
                                />
                            </div>
                            <div className='d-flex justify-content-center mt-3'>
                                <img
                                    className='mx-2 h-30px theme-light-show'
                                    src={toAbsoluteUrl('media/settings/trash-svgrepo-com.svg')}
                                    alt='ลบรูป'
                                    onClick={handleDeleteImage}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {isFullScreen && (
                    <div
                        className="fullscreen-overlay"
                        onClick={handleCloseFullScreen}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                        }}
                    >
                        <img
                            src={image!}
                            alt="Full Screen"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                )}

                <div className='d-flex flex-column flex-md-row justify-content-between mx-5 mx-lg-10 mt-10 mb-3'>
                    <Link to='/sale/photo' className='btn btn-secondary w-100 w-md-auto align-self-center'>
                        ย้อนกลับ
                    </Link>
                </div>
                <div className='d-flex flex-column flex-md-row justify-content-between mx-5 mx-lg-10 mb-10'>
                    <Link to='' className='btn btn-primary w-100 w-md-auto align-self-center'>
                        บันทึกรูปภาพลงระบบ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DrawingMapGallery;