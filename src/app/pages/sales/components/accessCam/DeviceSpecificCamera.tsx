import React, { useRef, useState } from 'react';

const DeviceSpecificCamera: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [images, setImages] = useState<string[]>(() => {
        const savedImages = localStorage.getItem('images');
        return savedImages ? JSON.parse(savedImages) : [];
    });

    const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());

    const isIOS: boolean = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid: boolean = /Android/.test(navigator.userAgent);
    const isTablet: boolean = /Tablet|iPad/.test(navigator.userAgent);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { exact: 'environment' } }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing the camera: ", err);
            alert("ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้งานกล้องในเบราว์เซอร์ของคุณ");
        }
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                const width = videoRef.current.videoWidth;
                const height = videoRef.current.videoHeight;

                canvasRef.current.width = width;
                canvasRef.current.height = height;

                context.drawImage(videoRef.current, 0, 0, width, height);

                const imageDataUrl = canvasRef.current.toDataURL('image/png');
                const newImages = [...images, imageDataUrl];
                setImages(newImages);
                localStorage.setItem('images', JSON.stringify(newImages));
            }
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    const newImages = [...images, reader.result as string];
                    setImages(newImages);
                    localStorage.setItem('images', JSON.stringify(newImages));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleSelectImage = (index: number) => {
        setSelectedImages(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(index)) {
                newSelection.delete(index);
            } else {
                newSelection.add(index);
            }
            return newSelection;
        });
    };

    const saveSelectedPhotos = async () => {
        for (const index of selectedImages) {
            const image = images[index];
            const link = document.createElement('a');
            link.href = image;
            link.download = `photo_${index}.png`;
            document.body.appendChild(link); // ทำให้ลิงก์เป็นส่วนหนึ่งของ DOM
            link.click();
            document.body.removeChild(link); // ลบลิงก์หลังจากคลิก
            await new Promise(resolve => setTimeout(resolve, 100)); // เพิ่มดีเลย์เล็กน้อย
        }
    };

    return (
        <div>
            <p>{isIOS ? 'iOS' : isAndroid ? 'Android' : 'Tablet'} Device Detected</p>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={takePhoto}>Take Photo</button>
            <button onClick={saveSelectedPhotos}>Save Selected Photos</button>
            <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* แสดงภาพที่ถ่าย */}
            <div>
                {images.length > 0 && (
                    <div>
                        <h3>Captured Photos:</h3>
                        {images.map((image, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <img
                                    src={image}
                                    alt={`Captured ${index}`}
                                    style={{ width: '300px', height: 'auto', border: selectedImages.has(index) ? '5px solid blue' : 'none' }}
                                    onClick={() => toggleSelectImage(index)}
                                />
                                <input
                                    type="checkbox"
                                    checked={selectedImages.has(index)}
                                    onChange={() => toggleSelectImage(index)}
                                    style={{ marginLeft: '10px' }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeviceSpecificCamera;
