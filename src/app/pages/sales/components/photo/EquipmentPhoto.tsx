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
    const { imagesEquipment, addImage, removeImage, loadImages, } = usePhotoEquipmentStore();

    const [error, setError] = useState<string | null>(null);

    const isIOS: boolean = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid: boolean = /Android/.test(navigator.userAgent);
    const isTablet: boolean = /Tablet|iPad/.test(navigator.userAgent);
    const isPC: boolean = !isIOS && !isAndroid && !isTablet;

    const [imageFromApi, setImageFromApi] = useState<string[]>([]); // ตัวแปรเก็บภาพจาก API
    // console.log(`imageFromApi`, imageFromApi);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // โหลด summary contract
    useEffect(() => {
        const fetchContractSummary = async () => {
            try {
                const response = await axios.get(GETSUMMARYCONTACT, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                });
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setGetSummaryContract(data); // บันทึกสินค้าใหม่
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchContractSummary();
    });

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
        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: 'คุณต้องการลบรูปภาพนี้หรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
        }).then((result) => {
            if (result.isConfirmed) {
                removeImage(image); // ลบรูปภาพออก
                Swal.fire({
                    title: 'ลบสำเร็จ!',
                    text: 'รูปภาพถูกลบเรียบร้อยแล้ว',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                });
            }
        });
    };

    // POST Contract/updateContract
    const handleNextClick = async () => {
        try {
            const cleanedImagesEquipment = imagesEquipment?.map((image) => {
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
                    "IMAGECARD": imageFromSummary[0]?.IMAGECARD,
                    "IMAGEGPS": imageFromSummary[0]?.IMAGEGPS,
                    "IMAGEMAP": imageFromSummary[0]?.IMAGEMAP,
                    "IMAGETRADEIN": imageFromSummary[0]?.IMAGETRADEIN,
                    "IMAGEINSTALLATION": imageFromSummary[0]?.IMAGEINSTALLATION,
                    "IMAGECUSTOMERHOME": imageFromSummary[0]?.IMAGECUSTOMERHOME,
                    "IMAGECUSTOMER": imageFromSummary[0]?.IMAGECUSTOMER,
                    "IMAGETDS": cleanedImagesEquipment,
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

            // ล้างรูปภาพหลังบันทึกสำเร็จ
            // clearImages();
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
        };
        navigate("/sale/photo/gallery/equipment", { state: { data: updatedItem, fromStep } });
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
                    ดูรูปภาพที่บันทึกในระบบ
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
                {imagesEquipment.length > 0 && (
                    <div className='row mx-5'>
                        {imagesEquipment.map((image: string, index: number) => (
                            <div
                                className='col-6 col-xl-4 mb-3 position-relative'
                                key={index}
                                style={{ cursor: 'pointer', overflow: 'hidden' }}
                            >
                                <div className='border border-gray-500 position-relative'>
                                    <img
                                        src={image}
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
                                            onClick={() => setSelectedImage(image)}
                                        />
                                        {/* Icon Delete */}
                                        <img
                                            src={toAbsoluteUrl('media/settings/trash-svgrepo-com.png')}
                                            alt="ลบรูป"
                                            style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                                            onClick={() => handleDeleteImage(image)}
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

export default EquipmentPhoto;