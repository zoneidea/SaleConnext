import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
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
  usePhotoGPSStore // Import your GPS store here
} from '../../../../../modules/stores/sales/photoStore/photoStore';

import Swal from 'sweetalert2';
import { log } from 'node:console';

const API_KEY_GOOGLE_MAP = import.meta.env.VITE_APP_GOOGLE_MAP_KEY as string;
const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
const GET_CONTRACT_URL = `${API_URL_MONGO}/Contract/GetContractSummary`;

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

interface ItemProps {
  IMAGEGPS: [any],
}

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100vh',
};

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

const GoogleMapComponent: React.FC<{ position: Position }> = ({ position }) => {

  const navigate = useNavigate();
  const location = useLocation() as { state?: { data: ItemProps; fromStep?: boolean } };

  const item = location?.state?.data as ItemProps || [];
  console.log(`item`, item);

  const fromStep = location?.state?.fromStep || false;
  console.log(`fromStep`, fromStep);

  const [isLoadingFinish, setIsLoadingFinish] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([])
  console.log(`data`, data);

  const getData = async () => {
    setIsLoadingFinish(true);
    try {
      const response = await axios.get(GET_CONTRACT_URL + '?refno=' + REFNO, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setData(data);
      console.log('Load data', data)
    } catch (error) {
      console.error('Error fetching DRAFT_ALLCONTRACT_URL:', error);
    } finally {
      setIsLoadingFinish(false);
    }
  };

  useEffect(() => {
    getData()
  })

  const { REFNO } = useUUIDStore();
  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || '';
  const TeamSale = auth?.data?.[0]?.TeamSale || '';
  const SaleCode = auth?.data?.[0]?.SaleCode || '';
  const SupEmpId = auth?.data?.[0]?.SupEmp || '';
  const SecEmpId = auth?.data?.[0]?.SecEmp || '';

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

  const { setImagesGPS, addImage } = usePhotoGPSStore(); // ใช้ setImagesGPS จาก GPS Store

  const center = {
    lat: position.latitude ?? 0,
    lng: position.longitude ?? 0,
  };

  const mapRef = useRef<HTMLDivElement>(null); // Reference to the map container

  const captureMap = async () => {
    if (mapRef.current) {
      try {
        const canvas = await html2canvas(mapRef.current, {
          useCORS: true, // เปิดใช้งาน CORS สำหรับโหลดรูปภาพ
        });
        const dataUrl = canvas.toDataURL('image/png');

        // สร้าง canvas ใหม่สำหรับปรับขนาด
        const resizedCanvas = document.createElement('canvas');
        const ctx = resizedCanvas.getContext('2d');

        const desiredWidth = 800; // กำหนดความกว้างที่ต้องการ
        const scaleFactor = desiredWidth / canvas.width; // คำนวณสัดส่วนการย่อขนาด

        // กำหนดขนาดใหม่
        resizedCanvas.width = desiredWidth;
        resizedCanvas.height = canvas.height * scaleFactor;

        // วาดภาพเดิมลงบน canvas ใหม่
        ctx?.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);

        // ดึงข้อมูลภาพที่ถูกปรับขนาด
        const resizedDataUrl = resizedCanvas.toDataURL('image/png');
        const cleanedDataUrl = resizedDataUrl.replace(/^data:image\/(?:jpeg|png);base64,/, '');
        console.log(`cleanedDataUrl`, cleanedDataUrl);

        await handleNextClick(cleanedDataUrl); // ส่งข้อมูลที่ปรับขนาดแล้ว

      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการสร้างภาพด้วย html2canvas:', error);
      }
    }
  };

  const handleNextClick = async (cleanedDataUrl: string) => {
    try {
      // ตรวจสอบและดึงข้อมูล IMAGEGPS เดิม
      const existingImages = item?.IMAGE?.[0]?.IMAGEGPS || [];

      // ตรวจสอบว่า existingImages เป็นอาร์เรย์ และรวมภาพใหม่
      const updatedImages = Array.isArray(existingImages)
        ? [...existingImages, cleanedDataUrl] // รวมภาพเก่ากับภาพใหม่
        : [cleanedDataUrl]; // หากไม่มีภาพเดิม ให้สร้างอาร์เรย์ใหม่

      // บันทึกภาพ GPS ลงใน store โดยใช้ addImage
      addImage(cleanedDataUrl);

      // ส่งข้อมูลอัปเดตไปยัง API
      const updateContract = await axios.post(
        UPDATECONTACT,
        {
          REFNO,
          EMPID: EmpId,
          TEAMSALE: TeamSale,
          SALECODE: SaleCode,
          SUPEMPID: SupEmpId,
          SECEMPID: SecEmpId,
          FIELD: "IMAGE",
          DATA: [{
            "IMAGECARD": data[0]?.IMAGE?.[0]?.IMAGECARD || [],
            "IMAGEGPS": updatedImages, // ใช้ภาพที่อัปเดตใหม่
            "IMAGEMAP": data[0]?.IMAGE?.[0]?.IMAGEMAP || [],
            "IMAGETRADEIN": data[0]?.IMAGE?.[0]?.IMAGETRADEIN || [],
            "IMAGEINSTALLATION": data[0]?.IMAGE?.[0]?.IMAGEINSTALLATION || [],
            "IMAGECUSTOMERHOME": data[0]?.IMAGE?.[0]?.IMAGECUSTOMERHOME || [],
            "IMAGECUSTOMER": data[0]?.IMAGE?.[0]?.IMAGECUSTOMER || [],
            "IMAGETDS": data[0]?.IMAGE?.[0]?.IMAGETDS || [],
          }],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`updateContract IMAGE GPS: `, updateContract.data);
      Swal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: "บันทึกรูปภาพลงระบบเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error("Error fetching UPDATECONTACT IMAGE GPS:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถบันทึกรูปภาพได้ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  return (
    <>
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

      {/* <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-5 mx-lg-10 mx-5'>
        <Link to='/sale/photo/gallery-gps' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
          ย้อนกลับ
        </Link>
        <button
          onClick={captureMap}
          className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'
        >
          บันทึกรูปภาพแผนที่ลงระบบ
        </button>
      </div> */}

      <div className='d-none d-xl-flex justify-content-between align-items-center my-5 mx-7'>
        <button
          className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'
          onClick={() => navigate('/sale/photo/gallery-gps', { state: { data: item, fromStep } })}
        >
          ย้อนกลับ
        </button>
        <button
          onClick={captureMap}
          className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'
        >
          บันทึกรูปภาพแผนที่ลงระบบ
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
          onClick={() => navigate('/sale/photo/gallery-gps', { state: { data: item, fromStep } })}
        >
          ย้อนกลับ
        </button>
        <button
          className="btn btn-primary w-auto me-2"
          onClick={captureMap}
        >
          บันทึกรูปภาพแผนที่ลงระบบ
        </button>
      </div>

    </>
  );
};

export default LocationFinder;