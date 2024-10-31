import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'; // Include Marker here
import { Link } from 'react-router-dom';
import { toPng } from 'html-to-image'; // นำเข้า html-to-image

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

const API_KEY_GOOGLE_MAP = import.meta.env.VITE_APP_GOOGLE_MAP_KEY as string;

// กำหนดขนาดของแผนที่
const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100vh',
};

// สร้าง interface สำหรับตำแหน่ง
interface Position {
  latitude: number | null;
  longitude: number | null;
}

const LocationFinder: React.FC = () => {
  const [position, setPosition] = useState<Position>({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState<string | null>(null);

  // ฟังก์ชันสำหรับดึงตำแหน่ง
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setError(null);
        },
        (err) => {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setError('ผู้ใช้ปฏิเสธการเข้าถึงตำแหน่งที่ตั้ง');
              break;
            case err.POSITION_UNAVAILABLE:
              setError('ข้อมูลตำแหน่งที่ตั้งไม่พร้อมใช้งาน');
              break;
            case err.TIMEOUT:
              setError('การร้องขอตำแหน่งเกินเวลาที่กำหนด');
              break;
            default:
              setError('เกิดข้อผิดพลาดในการดึงตำแหน่งที่ตั้ง');
          }
        }
      );
    } else {
      setError('เบราว์เซอร์ของคุณไม่รองรับการค้นหาตำแหน่งที่ตั้ง');
    }
  };

  // ดึงตำแหน่งเมื่อ Component โหลดครั้งแรก
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : position.latitude && position.longitude ? (
        <GoogleMapComponent position={position} />
      ) : (
        <p>กำลังดึงตำแหน่ง...</p>
      )}
    </div>
  );
};

// Component สำหรับแสดง Google Map
const GoogleMapComponent: React.FC<{ position: Position }> = ({ position }) => {
  const { REFNO } = useUUIDStore();
  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || '';
  const TeamSale = auth?.data?.[0]?.TeamSale || '';
  const SaleCode = auth?.data?.[0]?.SaleCode || '';
  const SupEmpId = auth?.data?.[0]?.SupEmp || '';
  const SecEmpId = auth?.data?.[0]?.SecEmp || '';

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

  const { imagesIdCard } = usePhotoIdCardStore();
  const { imagesDrawingMap } = usePhotoDrawingMapStore();
  const { imagesTurn } = usePhotoTurnStore();
  const { imagesInstallation } = usePhotoInstallationStore();
  const { imagesHomeCustomer } = usePhotoHomeCustomerStore();
  const { imagesCustomer, addImage, removeImage, loadImages } = usePhotoCustomerStore();
  const { imagesEquipment } = usePhotoEquipmentStore();

  const [cleanedImagesGPS, setCleanedImagesGPS] = useState<string | null>(null);
  console.log(`cleanedImagesGPS`, cleanedImagesGPS);

  const center = {
    lat: position.latitude ?? 0,
    lng: position.longitude ?? 0,
  };

  const mapRef = useRef<HTMLDivElement>(null); // Reference to the map container

  // ฟังก์ชันสำหรับแคปรูปแผนที่
  const captureMap = async () => {
    if (mapRef.current) {
      toPng(mapRef.current)
        .then((dataUrl) => {
          // สร้างลิงก์ดาวน์โหลด
          const cleanedDataUrl = dataUrl.replace(/^data:/, '');

          setCleanedImagesGPS(cleanedDataUrl); // ตั้งค่า cleanedImagesGPS

          // เรียกฟังก์ชันบันทึกข้อมูล
          handleNextClick(cleanedDataUrl); // ส่ง cleanedDataUrl ไปยัง handleNextClick
        })
        .catch((err) => {
          console.error('Error generating image:', err);
        });
    }
  };

  // ปรับให้ handleNextClick รับ cleanedDataUrl
  const handleNextClick = async (cleanedDataUrl: string) => {
    try {
      // ตัดส่วน 'data:image/jpeg;base64,' หรือ 'data:image/png;base64,' ออก
      const cleanedImagesIdCard = imagesIdCard.map(image => image.replace(/^data:/, ''));
      const cleanedImagesDrawingMap = imagesDrawingMap.map(image => image.replace(/^data:/, ''));
      const cleanedImagesTurn = imagesTurn.map(image => image.replace(/^data:/, ''));
      const cleanedImagesInstallation = imagesInstallation.map(image => image.replace(/^data:/, ''));
      const cleanedImagesHomeCustomer = imagesHomeCustomer.map(image => image.replace(/^data:/, ''));
      const cleanedImagesCustomer = imagesCustomer.map(image => image.replace(/^data:/, ''));
      const cleanedImagesEquipment = imagesEquipment.map(image => image.replace(/^data:/, ''));

      const updateContract = await axios.post(UPDATECONTACT, {
        REFNO,
        EMPID: EmpId,
        TEAMSALE: TeamSale,
        SALECODE: SaleCode,
        SUPEMPID: SupEmpId,
        SECEMPID: SecEmpId,
        FIELD: "IMAGE",
        DATA: [{
          "IMAGECARD": cleanedImagesIdCard,
          "IMAGEGPS": cleanedDataUrl, // ใช้ cleanedDataUrl ที่ส่งมา
          "IMAGEMAP": cleanedImagesDrawingMap,
          "IMAGETRADEIN": cleanedImagesTurn,
          "IMAGEINSTALLATION": cleanedImagesInstallation,
          "IMAGECUSTOMERHOME": cleanedImagesHomeCustomer,
          "IMAGECUSTOMER": cleanedImagesCustomer,
          "IMAGETDS": cleanedImagesEquipment,
        }]
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`updateContract IMAGE: `, updateContract.data);
      // แสดง SweetAlert เมื่อบันทึกสำเร็จ
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'บันทึกรูปภาพลงระบบเรียบร้อยแล้ว',
      });
    } catch (error) {
      console.error('Error fetching UPDATECONTACT IMAGE:', error);
      // แสดง SweetAlert เมื่อเกิดข้อผิดพลาด
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถบันทึกรูปภาพได้ กรุณาลองใหม่อีกครั้ง',
      });
    }
  };

  return (
    <>
      <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10 mx-lg-10 mx-5'>
        <Link to='/sale/photo' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
          ย้อนกลับ
        </Link>
        <button
          onClick={captureMap}
          className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'
        >
          บันทึกรูปภาพแผนที่ลงระบบ
        </button>
      </div>

      <LoadScript googleMapsApiKey={API_KEY_GOOGLE_MAP}>
        <div ref={mapRef} style={containerStyle}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
          >
            <Marker position={center} title="ตำแหน่งปัจจุบัน" />
          </GoogleMap>
        </div>
      </LoadScript>
    </>
  );
};

export default LocationFinder;