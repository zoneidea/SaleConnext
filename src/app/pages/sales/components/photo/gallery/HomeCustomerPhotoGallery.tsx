import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ItemProps {
    IMAGE: [any];
}

interface LocationState {
    data?: ItemProps;
    fromStep?: boolean;
}

function HomeCustomerPhotoGallery() {
    const location = useLocation();
    const navigate = useNavigate();

    // ตรวจสอบชนิดของ location.state
    const { data: item = { IMAGE: [] }, fromStep = false } = (location.state as LocationState) || {};

    console.log(`Item:`, item);
    console.log(`FromStep:`, fromStep);

    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    console.log(`Images:`, images);

    // ฟังก์ชันแปลง WebP เป็น JPEG หรือ PNG
    const convertWebPToJpegOrPng = (
        webpDataUrl: string,
        outputFormat: 'image/jpeg' | 'image/png' = 'image/jpeg'
    ): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const convertedDataUrl = canvas.toDataURL(outputFormat, 1.0);
                    resolve(convertedDataUrl);
                } else {
                    reject(new Error('Canvas context is not available.'));
                }
            };
            img.onerror = (err) => reject(err);
            img.src = webpDataUrl;
        });
    };

    useEffect(() => {
        const getData = async () => {
            try {
                if (item?.IMAGE && item?.IMAGE.length > 0 && item?.IMAGE[0]?.IMAGECUSTOMERHOME) {
                    const data = item?.IMAGE[0]?.IMAGECUSTOMERHOME;
                    console.log('Raw image data:', data);

                    const processedImages = await Promise.all(
                        data.map(async (image: string) => {
                            if (image.startsWith('data:image/webp;')) {
                                try {
                                    return await convertWebPToJpegOrPng(image); // แปลง WebP เป็น JPEG
                                } catch (err) {
                                    console.error('Error converting WebP:', err);
                                    return image; // ใช้รูป WebP เดิมหากแปลงไม่ได้
                                }
                            }
                            return image; // คืนค่ารูป JPEG/PNG เดิม
                        })
                    );

                    console.log('Processed images:', processedImages);
                    setImages(processedImages);
                } else {
                    console.log('No image data available');
                    setImages([]);
                }
            } catch (error) {
                console.error('Error processing images:', error);
            }
        };

        getData();
    }, [item]);

    return (
        <div className="row mx-5">
            {images.length > 0 ? (
                images.map((base64Image, index) => (
                    <div className="col-6 col-xl-4 mb-3" key={index}>
                        <div className="border border-gray-500">
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
                                onError={(e) => {
                                    console.error(`Error loading image at index ${index}:`, base64Image);
                                }}
                            />
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center">
                    <p>ไม่มีรูปภาพที่จะแสดง</p>
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
                        navigate('/sale/photo/home-customer', { state: { data: item, fromStep } })}
                >
                    ย้อนกลับ
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
                    className="btn btn-secondary w-auto me-2"
                    onClick={() => navigate('/sale/photo/home-customer',  { state: { data: item, fromStep } })}
                >
                    ย้อนกลับ
                </button>
            </div>

        </div>
    );
}

export default HomeCustomerPhotoGallery;