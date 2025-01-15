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
import { log } from 'console';

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

const EquipmentPhoto: React.FC = () => {
    // สร้างใหม่
    const { REFNO } = useUUIDStore();

    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const location = useLocation() as any;
    const navigate = useNavigate()
    const fromStep = location.state?.fromStep || false;
    // console.log(`fromStep`, fromStep);

    const item = location.state?.data as ItemProps || [];
    // console.log(`item`, item);

    // กำหนด REFNO
    const refno = fromStep ? item.REFNO : REFNO;
    // console.log(`refno`, refno);

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
    const GETSUMMARYCONTACT = `${API_URL_MONGO}/Contract/GetContractSummary?refno=${refno}`;

    const [getSummaryContract, setGetSummaryContract] = useState<any[]>([])
    // console.log(`getSummaryContract`, getSummaryContract);
    const imageFromSummary = getSummaryContract[0]?.IMAGE
    // console.log(`imageFromSummary`, imageFromSummary);

    const { imagesIdCard } = usePhotoIdCardStore();
    const { imagesDrawingMap } = usePhotoDrawingMapStore();
    const { imagesTurn } = usePhotoTurnStore();
    const { imagesInstallation } = usePhotoInstallationStore();
    const { imagesHomeCustomer } = usePhotoHomeCustomerStore();
    const { imagesCustomer } = usePhotoCustomerStore();
    const { imagesEquipment, addImage, removeImage, loadImages, clearImages } = usePhotoEquipmentStore();

    const [error, setError] = useState<string | null>(null);

    const isIOS: boolean = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid: boolean = /Android/.test(navigator.userAgent);
    const isTablet: boolean = /Tablet|iPad/.test(navigator.userAgent);
    const isPC: boolean = !isIOS && !isAndroid && !isTablet;

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // States
    const [previewImages, setPreviewImages] = useState<{ file: File; preview: string }[]>([]);
    const [imagesFromSystem, setImagesFromSystem] = useState<string[]>([]); // รูปภาพจากระบบ
    const [files, setFiles] = useState<File[]>([]); // เก็บไฟล์ที่อัปโหลดใหม่

    useEffect(() => {
        // โหลดรูปภาพและไฟล์จาก Local Storage ตาม REFNO
        const savedFiles = localStorage.getItem(`files_${refno}`);
        const savedPreviewImages = localStorage.getItem(`previewImages_${refno}`);

        if (savedFiles) {
            setFiles(JSON.parse(savedFiles));
        }

        if (savedPreviewImages) {
            setPreviewImages(JSON.parse(savedPreviewImages));
        }
    }, [refno]);

    useEffect(() => {
        // อัปเดตข้อมูลไฟล์และรูปภาพลงใน Local Storage
        localStorage.setItem(`files_${refno}`, JSON.stringify(files));
        localStorage.setItem(`previewImages_${refno}`, JSON.stringify(previewImages));
    }, [files, previewImages, refno]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
    
            selectedFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.result) {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement("canvas");
                            const ctx = canvas.getContext("2d");
    
                            // กำหนดขนาดสูงสุดของภาพ
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
    
                            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
    
                            const newPreview = {
                                file,
                                preview: compressedBase64,
                            };
    
                            setPreviewImages((prevPreviews) => [...prevPreviews, newPreview]);
                        };
                        img.src = reader.result as string;
                    }
                };
                reader.readAsDataURL(file);
            });
    
            setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    
            // รีเซ็ตค่า input
            event.target.value = '';
        }
    };
    
    const handleDeleteImage = (image: string, isFromSystem: boolean) => {
        if (!isFromSystem) {
            setPreviewImages((prevPreviews) => {
                const updatedPreviews = prevPreviews.filter((img) => img.preview !== image);
                const updatedFiles = updatedPreviews.map((img) => img.file);
                setFiles(updatedFiles);
                return updatedPreviews;
            });
        }
    };    

    // Handle การอัปโหลดไฟล์
    const handleNextClick = async () => {
        if (files.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'กรุณาเลือกรูปภาพก่อนบันทึก',
            });
            return;
        }

        const formData = new FormData();
        formData.append('REFNO', refno);
        files.forEach((file) => {
            formData.append('IMAGETDS', file); // ส่งเฉพาะไฟล์ใน state files
        });


        try {
            const response = await axios.post(`${API_URL_MONGO}/Contract/SaveContractImage`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // console.log('Upload success:', response.data);

            // ล้างรูปภาพและไฟล์ใน local state หลังจากบันทึกสำเร็จ
            setPreviewImages([]);
            setFiles([]);
            clearImages();

            // ล้างข้อมูลไฟล์ใน Local Storage
            localStorage.removeItem(`files_${refno}`);
            localStorage.removeItem(`previewImages_${refno}`);

            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'บันทึกรูปภาพลงระบบเรียบร้อยแล้ว',
            });
        } catch (error) {
            console.error('Upload error:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถบันทึกรูปภาพได้ กรุณาลองใหม่อีกครั้ง',
            });
        }
    };

    const handleViewGallery = () => {
        const updatedItem = {
            ...item,
        };
        navigate("/sale/photo/gallery/equipment", { state: { data: updatedItem, fromStep } });
    };

    return (
        <div>
            <div
                className="d-flex justify-content-center align-items-center my-5 mx-7"
                style={{
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    padding: "10px",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <label
                    className="btn btn-success px-5"
                    htmlFor="camera-input"
                    style={{
                        cursor: "pointer",
                        borderRadius: "10px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    เลือกรูปจากคลัง
                </label>
            </div>

            {/* Input hidden สำหรับการอัปโหลดไฟล์ */}
            <input
                id="camera-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

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
                {previewImages.length > 0 && (
                    <div className='row mx-5'>
                        {previewImages.map((image, index) => (
                            <div
                                className='col-6 col-xl-4 mb-3 position-relative'
                                key={index}
                                style={{ cursor: 'pointer', overflow: 'hidden' }}
                            >
                                <div className='border border-gray-500 position-relative'>
                                    <img
                                        src={image.preview}
                                        alt={`Captured ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                        }}
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
                                        {/* Icon View */}
                                        <img
                                            src={toAbsoluteUrl('media/settings/eye-svgrepo-com.png')}
                                            alt="ดูภาพ"
                                            className="me-5"
                                            style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                                            onClick={() => setSelectedImage(image.preview)}
                                        />
                                        {/* Icon Delete */}
                                        <img
                                            src={toAbsoluteUrl('media/settings/trash-svgrepo-com.png')}
                                            alt="ลบรูป"
                                            style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                                            onClick={() => handleDeleteImage(image.preview, false)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
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

                {/* แสดงปุ่มเมื่อมาจาก Step */}
                {fromStep ? (
                    <div className='d-none d-xl-flex justify-content-between align-items-center my-5 mx-7'>
                        <button
                            className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'
                            onClick={() => navigate('/sale/photo/gallery/equipment', { state: { data: item, fromStep } })}
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
                            onClick={() => navigate('/sale/photo/gallery/equipment')}
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
                            onClick={() => navigate('/sale/photo/gallery/equipment', { state: { data: item, fromStep } })}
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
                            onClick={() => navigate('/sale/photo/gallery/equipment')}
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

export default EquipmentPhoto;