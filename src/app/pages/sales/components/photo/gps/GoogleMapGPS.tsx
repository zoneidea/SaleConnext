import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { useAuth } from '../../../../../modules/auth/core/Auth';
import { useUUIDStore } from '../../../../../modules/stores/stepsStore';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_KEY_GOOGLE_MAP = import.meta.env.VITE_APP_GOOGLE_MAP_KEY as string;
const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;

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

  const location = useLocation() as { state?: { fromStep?: boolean; data?: any } };
  const navigate = useNavigate();

  // รับค่า REFNO และ fromStep จาก state
  const { fromStep, data } = location.state || {};
  const REFNO = data?.REFNO;

  // console.log(`REFNO`, REFNO);
  // console.log(`fromStep`, fromStep);

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
        <GoogleMapComponent position={position} REFNO={REFNO} fromStep={fromStep} />
      ) : (
        <p>กำลังดึงตำแหน่ง...</p>
      )}
    </div>
  );
};

const GoogleMapComponent: React.FC<{ position: Position; REFNO?: string; fromStep?: boolean }> = ({
  position,
  REFNO,
  fromStep,
}) => {
  const navigate = useNavigate();

  const mapRef = useRef<HTMLDivElement>(null);

  const captureMap = async () => {
    if (mapRef.current) {
      try {
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

      // console.log('Upload success:', response.data);

      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'บันทึกรูปภาพแผนที่ลงระบบเรียบร้อยแล้ว',
      });
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
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
            <Marker position={center} title="ตำแหน่งปัจจุบัน" />
          </GoogleMap>
        </div>
      </LoadScript>

      <div className='d-none d-xl-flex justify-content-between align-items-center my-5 mx-7'>
        <button
          className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'
          onClick={() => navigate('/sale/photo/gallery-gps', { state: { fromStep, data: { REFNO } } })}
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
          onClick={() => navigate('/sale/photo/gallery-gps', { state: { fromStep, data: { REFNO } } })}
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