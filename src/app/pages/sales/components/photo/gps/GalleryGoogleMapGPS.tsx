// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { toAbsoluteUrl } from '../../../../../../_metronic/helpers';
// import { useAuth } from '../../../../../modules/auth/core/Auth';
// import { useUUIDStore } from '../../../../../modules/stores/stepsStore';
// import axios from 'axios';
// import {
//     usePhotoIdCardStore,
//     usePhotoDrawingMapStore,
//     usePhotoTurnStore,
//     usePhotoInstallationStore,
//     usePhotoHomeCustomerStore,
//     usePhotoCustomerStore,
//     usePhotoEquipmentStore,
// } from '../../../../../modules/stores/sales/photoStore/photoStore';

// import Swal from 'sweetalert2';

// const GalleryGoogleMapGPS: React.FC = () => {
//     const { REFNO } = useUUIDStore();
//     const { auth } = useAuth();
//     const EmpId = auth?.data?.[0]?.EmpId || '';
//     const TeamSale = auth?.data?.[0]?.TeamSale || '';
//     const SaleCode = auth?.data?.[0]?.SaleCode || '';
//     const SupEmpId = auth?.data?.[0]?.SupEmp || '';
//     const SecEmpId = auth?.data?.[0]?.SecEmp || '';

//     const { imagesIdCard } = usePhotoIdCardStore();
//     const { imagesDrawingMap } = usePhotoDrawingMapStore();
//     const { imagesTurn } = usePhotoTurnStore();
//     const { imagesInstallation } = usePhotoInstallationStore();
//     const { imagesHomeCustomer } = usePhotoHomeCustomerStore();
//     const { imagesCustomer } = usePhotoCustomerStore();
//     const { imagesEquipment } = usePhotoEquipmentStore();

//     const [ImagesGPS, setImagesGPS] = useState<string[]>([]);
//     console.log(`ImagesGPS`, ImagesGPS);

//     const [error, setError] = useState<string | null>(null);

//     const isIOS: boolean = /iPad|iPhone|iPod/.test(navigator.userAgent);
//     const isAndroid: boolean = /Android/.test(navigator.userAgent);
//     const isTablet: boolean = /Tablet|iPad/.test(navigator.userAgent);
//     const isPC: boolean = !isIOS && !isAndroid && !isTablet;

//     const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
//     const GET_ALL_CONTRACT = () => `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}`

//     useEffect(() => {
//         const getData = async () => {
//             try {
//                 const response = await axios.get(GET_ALL_CONTRACT(), {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Accept': 'application/json',
//                     }
//                 });

//                 const data = response.data.data;
//                 // console.log('API Data:', data); // ดูข้อมูลที่ได้รับจาก API

//                 // กรองข้อมูลตาม REFNO
//                 const matchedData = data.filter((item: any) => item.REFNO === REFNO);
//                 // console.log('matchedData:', matchedData); // ดูข้อมูลที่ได้รับจาก API

//                 // ตรวจสอบว่ามีข้อมูลที่ตรงกันหรือไม่
//                 if (matchedData.length > 0) {
//                     // เข้าถึง IMAGEGPS ที่อยู่ภายใน IMAGE
//                     const gpsImages = matchedData.flatMap((item: any) => item.IMAGE.map((img: any) => img.IMAGEGPS).filter(Boolean)); // กรองเฉพาะค่าที่มีอยู่
//                     console.log('gpsImages:', gpsImages); // ดูข้อมูลที่ได้รับจาก API

//                     setImagesGPS(gpsImages)
//                 } else {
//                     setError('ไม่พบข้อมูล GPS ที่ตรงกับ REFNO');
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
//             }
//         };

//         getData();
//     }, [EmpId, REFNO]);

//     // ฟังก์ชันสำหรับลบภาพ GPS
//     const handleDeleteImage = (imageToDelete: string) => {
//         setImagesGPS((prevImages) => prevImages.filter((image) => image !== imageToDelete));
//         Swal.fire({
//             icon: 'success',
//             title: 'ลบรูปภาพสำเร็จ',
//             text: 'ลบรูปภาพ GPS แล้ว',
//         });
//     };

//     return (
//         <div>
//             {!isPC ? (
//                 <>
//                     <div className='d-flex flex-column flex-md-row justify-content-between mt-10 mb-5 mx-5'>
//                         <Link to='/sale/photo/gps'
//                             state={ImagesGPS}
//                             className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0 mx-lg-10 mx-5'>
//                             ใช้งานแผนที่
//                         </Link>
//                     </div>
//                     {error && (
//                         <div className='alert alert-danger mx-5'>
//                             {error}
//                         </div>
//                     )}
//                 </>
//             ) : (
//                 <div className='alert alert-warning fw-semibold fs-6 my-10 mx-10'>
//                     ฟีเจอร์ถ่ายรูป ไม่สามารถใช้บนอุปกรณ์คอมพิวเตอร์ได้ โปรดใช้งานบนอุปกรณ์มือถือหรือแท็บเล็ต
//                 </div>
//             )}

//             <div>
//                 {!isPC ? (
//                     <div>
//                         {ImagesGPS.length > 0 ? ( // ใช้ length ของ ImagesGPS แทนการเช็ค null
//                             <div className='row mx-5'>
//                                 {ImagesGPS.map((image, index) => (
//                                     <div className='col-6 mb-3' key={index}>
//                                         <div className='border border-gray-500'>
//                                             <img
//                                                 src={`data:image/png;base64,${image}`} // Use image directly from the array
//                                                 alt={`GPS Image ${index + 1}`}
//                                                 style={{
//                                                     width: '100%',
//                                                     height: '150px',
//                                                 }}
//                                             />
//                                             <div className='d-flex justify-content-center mt-3 mb-2'>
//                                                 <img
//                                                     className='h-30px theme-light-show'
//                                                     src={toAbsoluteUrl('media/settings/trash-svgrepo-com.svg')}
//                                                     alt='ลบรูป'
//                                                     onClick={() => handleDeleteImage(image)} // เรียกใช้ฟังก์ชันลบเมื่อคลิก
//                                                     style={{ cursor: 'pointer' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <p>ไม่มีภาพ GPS</p>
//                         )}
//                         <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10 mx-lg-10 mx-5'>
//                             <Link to='/sale/photo' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
//                                 ย้อนกลับ
//                             </Link>
//                         </div>
//                     </div>
//                 ) : (
//                     <div>
//                         <Link to='/sale/photo' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0 mx-lg-10 mx-5'>
//                             ย้อนกลับ
//                         </Link>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default GalleryGoogleMapGPS;



import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
            {!isPC ? (
                <>
                    <div className='d-flex flex-column flex-md-row justify-content-between mt-10 mb-5 mx-5'>
                        <Link to='/sale/photo/gps'
                            state={imagesGPS}
                            className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0 mx-lg-10 mx-5'>
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