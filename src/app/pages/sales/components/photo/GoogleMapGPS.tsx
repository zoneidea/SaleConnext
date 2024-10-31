import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Link } from 'react-router-dom';

const API_KEY_GOOGLE_MAP = import.meta.env.VITE_APP_GOOGLE_MAP_KEY as string;
const API_KEY_GOOGLE_MAP_STATIC = import.meta.env.VITE_APP_GOOGLE_MAP_STATIC as string;

// กำหนดขนาดของแผนที่
const containerStyle = {
  width: '100%',
  height: '100vh', // ปรับความสูงเป็น 100% ของความสูงหน้าจอ
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
          setError(null); // ลบข้อผิดพลาดถ้าสำเร็จ
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

  // ฟังก์ชันสำหรับตรวจสอบว่าเป็นอุปกรณ์มือถือหรือไม่
  const isMobileDevice = () => /Mobi|Android/i.test(navigator.userAgent);

  // ฟังก์ชันสำหรับสร้างลิงก์ดาวน์โหลดภาพแผนที่
  const captureAndSave = () => {
    if (isMobileDevice() && position.latitude && position.longitude) {
      const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${position.latitude},${position.longitude}&zoom=15&size=600x400&markers=color:red%7C${position.latitude},${position.longitude}&key=${API_KEY_GOOGLE_MAP_STATIC}`;
      // เปิด static map ในแท็บใหม่ให้ผู้ใช้ดาวน์โหลดเอง
      window.open(staticMapUrl, '_blank');
    } else {
      alert('การบันทึกภาพทำงานได้เฉพาะบนอุปกรณ์มือถือ และตำแหน่งต้องถูกต้อง');
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
        <GoogleMapComponent position={position} captureAndSave={captureAndSave} />
      ) : (
        <p>กำลังดึงตำแหน่ง...</p>
      )}
    </div>
  );
};

// กำหนด props type สำหรับ GoogleMapComponent
interface GoogleMapComponentProps {
  position: Position;
  captureAndSave: () => void;
}

// Component สำหรับแสดง Google Map
const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ position, captureAndSave }) => {
  const center = {
    lat: position.latitude ?? 0,
    lng: position.longitude ?? 0,
  };

  const options = {
    mapId: 'DEMO_MAP_ID',
  };

  return (
    <>
      <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10 mx-lg-10 mx-5'>
        <Link to='/sale/photo' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
          ย้อนกลับ
        </Link>
        <button onClick={captureAndSave} className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
          บันทึกตำแหน่งลงระบบ
        </button>
      </div>

      <LoadScript googleMapsApiKey={API_KEY_GOOGLE_MAP} libraries={['marker']}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          options={options}
          onLoad={(map) => {
            // ใช้ marker ปกติแทน AdvancedMarkerElement
            new google.maps.Marker({
              position: center,
              map,
              title: 'ตำแหน่งปัจจุบัน',
            });
          }}
        />
      </LoadScript>
    </>
  );
};

export default LocationFinder;