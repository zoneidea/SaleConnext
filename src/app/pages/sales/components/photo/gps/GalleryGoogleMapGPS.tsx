import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '../../../../../../_metronic/helpers';
import { useAuth } from '../../../../../modules/auth/core/Auth';
import { useUUIDStore } from '../../../../../modules/stores/stepsStore';
import axios from 'axios';
import {
    usePhotoIdCardStore,
    usePhotoDrawingMapStore,
    usePhotoTurnStore,
    usePhotoInstallationStore,
    usePhotoHomeCustomerStore,
    usePhotoCustomerStore,
    usePhotoEquipmentStore,
    usePhotoGPSStore
} from '../../../../../modules/stores/sales/photoStore/photoStore';

import Swal from 'sweetalert2';

const GalleryGoogleMapGPS: React.FC = () => {
    const { REFNO } = useUUIDStore();
    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const { imagesIdCard } = usePhotoIdCardStore();
    const { imagesDrawingMap } = usePhotoDrawingMapStore();
    const { imagesTurn } = usePhotoTurnStore();
    const { imagesInstallation } = usePhotoInstallationStore();
    const { imagesHomeCustomer } = usePhotoHomeCustomerStore();
    const { imagesCustomer } = usePhotoCustomerStore();
    const { imagesEquipment } = usePhotoEquipmentStore();
    const { imagesGPS, loadImages, removeImage } = usePhotoGPSStore();
    console.log(`imagesGPS`, imagesGPS);

    const [error, setError] = useState<string | null>(null);

    const isIOS: boolean = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid: boolean = /Android/.test(navigator.userAgent);
    const isTablet: boolean = /Tablet|iPad/.test(navigator.userAgent);
    const isPC: boolean = !isIOS && !isAndroid && !isTablet;

    useEffect(() => {
        loadImages();
    }, [loadImages]);

    const handleDeleteImage = (image: string) => {
        removeImage(image);
    };

    return (
        <div>
            {!isPC ? (
                <>
                    <div className='d-flex flex-column flex-md-row justify-content-between mt-10 mb-5 mx-5'>
                        <Link to='/sale/photo/gps' className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0 mx-lg-10 mx-5'>
                            ใช้งานแผนที่
                        </Link>
                    </div>
                    {error && (
                        <div className='alert alert-danger mx-5'>
                            {error}
                        </div>
                    )}
                </>
            ) : (
                <div className='alert alert-warning fw-semibold fs-6 my-10 mx-10'>
                    ฟีเจอร์ถ่ายรูป ไม่สามารถใช้บนอุปกรณ์คอมพิวเตอร์ได้ โปรดใช้งานบนอุปกรณ์มือถือหรือแท็บเล็ต
                </div>
            )}

            <div>
                {!isPC ? (
                    <div>
                        {imagesGPS.length > 0 ? (
                            <div className='row mx-5'>
                                {imagesGPS.map((image, index) => (
                                    <div className='col-6 mb-3' key={index}>
                                        <div className='border border-gray-500'>
                                            <img
                                                src={`data:image/png;base64,${image}`} // Use image directly from the array
                                                alt={`GPS Image ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '150px',
                                                }}
                                            />
                                            <div className='d-flex justify-content-center mt-3 mb-2'>
                                                <img
                                                    className='h-30px theme-light-show'
                                                    src={toAbsoluteUrl('media/settings/trash-svgrepo-com.svg')}
                                                    alt='ลบรูป'
                                                    onClick={() => handleDeleteImage(image)} // Call delete function
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>ไม่มีภาพ GPS</p>
                        )}
                        <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10 mx-lg-10 mx-5'>
                            <Link to='/sale/photo' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                                ย้อนกลับ
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

export default GalleryGoogleMapGPS;
