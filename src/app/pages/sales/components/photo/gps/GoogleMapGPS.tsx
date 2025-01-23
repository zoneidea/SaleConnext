import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { useAuth } from '../../../../../modules/auth/core/Auth';
import { useUUIDStore } from '../../../../../modules/stores/stepsStore';
import axios from 'axios';
import Swal from 'sweetalert2';
import { log } from 'console';

const API_KEY_GOOGLE_MAP = import.meta.env.VITE_APP_GOOGLE_MAP_KEY as string;
const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;

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

interface ImagesType {
  IMAGECARD: string[];
  IMAGEGPS: string[];
  IMAGEMAP: string[];
  IMAGECUSTOMERHOME: string[];
  IMAGEINSTALLATION: string[];
  IMAGETDS: string[];
  IMAGECUSTOMER: string[];
  IMAGETRADEIN: string[];
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
  const navigate = useNavigate();
  const { REFNO } = useUUIDStore();
  const location = useLocation() as any;

  const item = location.state?.data as ItemProps || [];
  const fromStep = location.state?.fromStep || false;
  // console.log(`fromStep`, fromStep);
  
  const refno = fromStep ? item.REFNO : REFNO;
  // console.log(`refno`, refno);

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
        <GoogleMapComponent position={position} REFNO={refno} fromStep={fromStep} item={item} />
      ) : (
        <p>กำลังดึงตำแหน่ง...</p>
      )}
    </div>
  );
};

const GoogleMapComponent: React.FC<{ position: Position; REFNO?: string; fromStep?: boolean; item: ItemProps }> = ({
  position,
  REFNO,
  fromStep,
  item,
}) => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // State สำหรับควบคุมปุ่ม

  const captureMap = async () => {
    if (mapRef.current) {
      try {
        setIsLoading(true); // Disable ปุ่ม
        const canvas = await html2canvas(mapRef.current, {
          useCORS: true,
        });
        const dataUrl = canvas.toDataURL('image/png');
        const blob = await (await fetch(dataUrl)).blob();

        const formData = new FormData();
        if (REFNO) {
          formData.append('REFNO', REFNO);
        }
        formData.append('IMAGEGPS', blob, 'map.png');

        await handleNextClick(formData);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการสร้างภาพด้วย html2canvas:', error);
      } finally {
        setIsLoading(false); // Enable ปุ่มเมื่อทำงานเสร็จ
      }
    }
  };

  const handleNextClick = async (formData: FormData) => {
    try {
      const response = await axios.post(`${API_URL_MONGO}/Contract/SaveContractImage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'บันทึกรูปภาพแผนที่ลงระบบเรียบร้อยแล้ว',
        timer: 2000, // แสดงผล 2 วินาที
        showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
      });

      navigate('/sale/photo/gallery-gps', { state: { fromStep, data: item } });
    } catch (error) {
      console.error('Error uploading map image:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถบันทึกรูปภาพได้ กรุณาลองใหม่อีกครั้ง',
      });
    }
  };

  const center = {
    lat: position.latitude ?? 0,
    lng: position.longitude ?? 0,
  };

  return (
    <>
      <LoadScript googleMapsApiKey={API_KEY_GOOGLE_MAP}>
        <div ref={mapRef} style={containerStyle}>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
            <Marker position={center} title="ตำแหน่งปัจจุบัน" />
          </GoogleMap>
        </div>
      </LoadScript>

      <div className='d-none d-xl-flex justify-content-between align-items-center my-5 mx-7'>
        <button
          className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'
          onClick={() => navigate('/sale/photo/gallery-gps', { state: { data: item, fromStep } })}
          disabled={isLoading}
        >
          ย้อนกลับ
        </button>
        <button
          onClick={captureMap}
          className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'
          disabled={isLoading}
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
          disabled={isLoading}
        >
          ย้อนกลับ
        </button>
        <button
          className="btn btn-primary w-auto me-2"
          onClick={captureMap}
          disabled={isLoading}
        >
          บันทึกรูปภาพแผนที่ลงระบบ
        </button>
      </div>
    </>
  );
};

export default LocationFinder;