import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toAbsoluteUrl } from '../../../../../../_metronic/helpers';
import { useAuth } from '../../../../../modules/auth/core/Auth';
import { useUUIDStore } from '../../../../../modules/stores/stepsStore';
import {
    usePhotoIdCardStore,
    usePhotoDrawingMapStore,
    usePhotoTurnStore,
    usePhotoInstallationStore,
    usePhotoHomeCustomerStore,
    usePhotoCustomerStore,
    usePhotoEquipmentStore,
    usePhotoGPSStore // Import your GPS store here
} from '../../../../../modules/stores/sales/photoStore/photoStore';

import Swal from 'sweetalert2';

const GalleryGoogleMapGPS: React.FC = () => {
    // สร้างใหม่
    const { REFNO } = useUUIDStore();
    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

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
    const location = useLocation() as any;
    const navigate = useNavigate()
    const fromStep = location.state?.fromStep || false;
    console.log(`fromStep`, fromStep);

    const item = location.state?.data as ItemProps || [];
    console.log(`item`, item);

    // กำหนด REFNO
    const refno = fromStep ? item.REFNO : REFNO;

    const { imagesGPS, loadImages, removeImage } = usePhotoGPSStore(); // Load images from GPS store
    console.log(`imagesGPS`, imagesGPS);

    const [error, setError] = useState<string | null>(null);

    const isIOS: boolean = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid: boolean = /Android/.test(navigator.userAgent);
    const isTablet: boolean = /Tablet|iPad/.test(navigator.userAgent);
    const isPC: boolean = !isIOS && !isAndroid && !isTablet;

    // Load images when component mounts
    useEffect(() => {
        loadImages(); // Load images from store
    }, [loadImages]);

    // Function to handle image deletion
    const handleDeleteImage = (imageToDelete: string) => {
        removeImage(imageToDelete); // Call removeImage function from the store
        Swal.fire({
            icon: 'success',
            title: 'ลบรูปภาพสำเร็จ',
            text: 'ลบรูปภาพ GPS แล้ว',
        });
    };

    return (
        <div>
            <div className='d-flex flex-column flex-md-row justify-content-between mt-10 mb-5'>
                <button
                    className="btn btn-primary w-100 w-md-auto align-self-center mx-7"
                    onClick={() => navigate("/sale/photo/gps/", { state: { data: item, fromStep } })}
                >
                    ใช้งานแผนที่
                </button>
            </div>
            {error && (
                <div className='alert alert-danger mx-5'>
                    {error}
                </div>
            )}

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

                <div className='d-none d-xl-flex justify-content-between align-items-center my-5 mx-7'>
                    <button
                        className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'
                        onClick={() => navigate('/sale/photo', { state: { data: item, fromStep } })}
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
                        onClick={() => navigate('/sale/photo', { state: { data: item, fromStep } })}
                    >
                        ย้อนกลับ
                    </button>
                </div>

            </div>
        </div>
    );
};

export default GalleryGoogleMapGPS;