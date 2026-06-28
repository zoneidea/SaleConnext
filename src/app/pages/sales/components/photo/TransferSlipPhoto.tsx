import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toAbsoluteUrl } from '../../../../../_metronic/helpers';
import { useAuth } from '../../../../modules/auth/core/Auth';
import { useUUIDStore } from '../../../../modules/stores/stepsStore';
import axios from 'axios';
import { usePhotoCustomerStore } from '../../../../modules/stores/sales/photoStore/photoStore';

import Swal from 'sweetalert2';
import styles from '@/styles/style.module.css';

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

interface PreviewImage {
    file: File;
    preview: string;
}

const MAX_IMAGE_SIZE = 1000;
const WEBP_QUALITY = 0.78;

const TransferSlipPhoto: React.FC = () => {
    const { REFNO } = useUUIDStore();

    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';

    const location = useLocation() as any;
    const navigate = useNavigate();

    const fromStep = location.state?.fromStep || false;
    const item = (location.state?.data as ItemProps) || {};
    const refno = fromStep ? item.REFNO : REFNO;

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;

    const { clearImages } = usePhotoCustomerStore();

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const compressImageToWebP = (
        file: File,
        maxSize = MAX_IMAGE_SIZE,
        quality = WEBP_QUALITY
    ): Promise<PreviewImage> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                const img = new Image();

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        reject(new Error('Canvas not supported'));
                        return;
                    }

                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxSize) {
                            height = Math.round(height * (maxSize / width));
                            width = maxSize;
                        }
                    } else if (height > maxSize) {
                        width = Math.round(width * (maxSize / height));
                        height = maxSize;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Cannot convert image to WebP'));
                                return;
                            }

                            const webpFileName =
                                file.name.replace(/\.[^/.]+$/, '') + '.webp';

                            const webpFile = new File([blob], webpFileName, {
                                type: 'image/webp',
                                lastModified: Date.now(),
                            });

                            resolve({
                                file: webpFile,
                                preview: URL.createObjectURL(blob),
                            });
                        },
                        'image/webp',
                        quality
                    );
                };

                img.onerror = () => reject(new Error('Cannot load image'));
                img.src = reader.result as string;
            };

            reader.onerror = () => reject(new Error('Cannot read file'));
            reader.readAsDataURL(file);
        });
    };

    useEffect(() => {
        return () => {
            previewImages.forEach((img) => {
                if (img.preview.startsWith('blob:')) {
                    URL.revokeObjectURL(img.preview);
                }
            });
        };
    }, [previewImages]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const list = event.target.files;
        if (!list) return;

        const selectedFiles = Array.from(list);

        const imageFiles = selectedFiles.filter((file) =>
            file.type.startsWith('image/')
        );

        const rejectedNames = selectedFiles
            .filter((file) => !file.type.startsWith('image/'))
            .map((file) => file.name);

        if (rejectedNames.length) {
            Swal.fire({
                icon: 'error',
                title: 'รองรับเฉพาะรูปภาพเท่านั้น',
                text: rejectedNames.join(', '),
            });
        }

        if (imageFiles.length === 0) {
            event.target.value = '';
            return;
        }

        try {
            setIsLoading(true);

            const compressedImages = await Promise.all(
                imageFiles.map((file) => compressImageToWebP(file))
            );

            setPreviewImages((prev) => [...prev, ...compressedImages]);
            setFiles((prev) => [
                ...prev,
                ...compressedImages.map((img) => img.file),
            ]);
        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถบีบอัดรูปภาพได้ กรุณาลองใหม่อีกครั้ง',
            });
        } finally {
            setIsLoading(false);
            event.target.value = '';
        }
    };

    const handleDeleteImage = (image: string) => {
        setPreviewImages((prevPreviews) => {
            const deletedImage = prevPreviews.find((img) => img.preview === image);

            if (deletedImage?.preview.startsWith('blob:')) {
                URL.revokeObjectURL(deletedImage.preview);
            }

            const updatedPreviews = prevPreviews.filter(
                (img) => img.preview !== image
            );

            setFiles(updatedPreviews.map((img) => img.file));

            return updatedPreviews;
        });

        if (selectedImage === image) {
            setSelectedImage(null);
        }
    };

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
        formData.append('EMPID', EmpId);

        files.forEach((file) => {
            formData.append('IMAGECUSTOMER', file);
        });

        try {
            setIsLoading(true);

            await axios.post(
                `${API_URL_MONGO}/Contract/SaveContractImage`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            previewImages.forEach((img) => {
                if (img.preview.startsWith('blob:')) {
                    URL.revokeObjectURL(img.preview);
                }
            });

            setPreviewImages([]);
            setFiles([]);
            clearImages();

            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'บันทึกรูปภาพลงระบบเรียบร้อยแล้ว',
                timer: 2000,
                showConfirmButton: false,
            });

            navigate('/sale/photo/gallery/transferslip', {
                state: { data: item, fromStep },
            });
        } catch (error) {
            console.error('Upload error:', error);

            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถบันทึกรูปภาพได้ กรุณาลองใหม่อีกครั้ง',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <input
                id="transfer-slip-camera-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={isLoading}
            />

            <input
                id="transfer-slip-gallery-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={isLoading}
            />

            <div>
                {previewImages.length > 0 && (
                    <div className="row mx-5">
                        <h5 className="my-8" style={{ color: 'red' }}>
                            * กดที่รูป หากต้องการดูภาพขนาดใหญ่หรือต้องการลบ
                        </h5>

                        {previewImages.map((image, index) => (
                            <div
                                className="col-6 col-xl-4 mb-3 position-relative"
                                key={`${image.file.name}-${index}`}
                                style={{ cursor: 'pointer', overflow: 'hidden' }}
                            >
                                <div className="border border-gray-500 position-relative">
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

                                    <div
                                        className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                                        style={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease-in-out',
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.opacity = '1')
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.opacity = '0')
                                        }
                                    >
                                        <img
                                            src={toAbsoluteUrl(
                                                'media/settings/eye-svgrepo-com.png'
                                            )}
                                            alt="ดูภาพ"
                                            className="me-5"
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() =>
                                                setSelectedImage(image.preview)
                                            }
                                        />

                                        <img
                                            src={toAbsoluteUrl(
                                                'media/settings/trash-svgrepo-com.png'
                                            )}
                                            alt="ลบรูป"
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() =>
                                                handleDeleteImage(image.preview)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

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

                <div
                    className="d-flex justify-content-center align-items-center gap-3 my-5 mx-7"
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        padding: '10px',
                        backgroundColor: '#f9f9f9',
                    }}
                >
                    <label
                        className={`${styles.btnPrimary}`}
                        htmlFor="transfer-slip-camera-input"
                        style={{
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            borderRadius: '10px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            opacity: isLoading ? 0.6 : 1,
                        }}
                    >
                        ถ่ายรูป
                    </label>

                    <label
                        className={`${styles.btnSuccess}`}
                        htmlFor="transfer-slip-gallery-input"
                        style={{
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            borderRadius: '10px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            opacity: isLoading ? 0.6 : 1,
                        }}
                    >
                        {isLoading ? 'กำลังประมวลผล...' : 'เลือกรูปจากคลัง'}
                    </label>
                </div>

                {fromStep ? (
                    <div className="d-none d-xl-flex justify-content-between align-items-center my-5 mx-7">
                        <button
                            className={`${styles.btnSecondary}`}
                            onClick={() =>
                                navigate('/sale/photo/gallery/transferslip', {
                                    state: { data: item, fromStep },
                                })
                            }
                            disabled={isLoading}
                        >
                            ย้อนกลับ
                        </button>

                        <button
                            className={`${styles.btnWarning}`}
                            type="button"
                            onClick={handleNextClick}
                            disabled={isLoading}
                        >
                            อัพเดทข้อมูล
                        </button>
                    </div>
                ) : (
                    <div className="d-none d-xl-flex justify-content-between align-items-center my-5 mx-7">
                        <button
                            className={`${styles.btnSecondary}`}
                            onClick={() =>
                                navigate('/sale/photo/gallery/transferslip', {
                                    state: { data: item, fromStep },
                                })
                            }
                            disabled={isLoading}
                        >
                            ย้อนกลับ
                        </button>

                        <button
                            className={`${styles.btnPrimary}`}
                            type="button"
                            onClick={handleNextClick}
                            disabled={isLoading}
                        >
                            บันทึกรูปภาพลงระบบ
                        </button>
                    </div>
                )}

                {fromStep ? (
                    <div
                        className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1050,
                        }}
                    >
                        <button
                            className={`${styles.btnSecondary}`}
                            onClick={() =>
                                navigate('/sale/photo/gallery/transferslip', {
                                    state: { data: item, fromStep },
                                })
                            }
                            disabled={isLoading}
                        >
                            ย้อนกลับ
                        </button>

                        <button
                            className={`${styles.btnWarning}`}
                            onClick={handleNextClick}
                            disabled={isLoading}
                        >
                            อัพเดทข้อมูล
                        </button>
                    </div>
                ) : (
                    <div
                        className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1050,
                        }}
                    >
                        <button
                            className={`${styles.btnSecondary}`}
                            onClick={() =>
                                navigate('/sale/photo/gallery/transferslip', {
                                    state: { data: item, fromStep },
                                })
                            }
                            disabled={isLoading}
                        >
                            ย้อนกลับ
                        </button>

                        <button
                            className={`${styles.btnPrimary}`}
                            onClick={handleNextClick}
                            disabled={isLoading}
                        >
                            บันทึกรูปภาพลงระบบ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransferSlipPhoto;