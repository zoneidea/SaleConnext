// src/components/IDCardViewer.tsx
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import Webcam from 'react-webcam';

export interface IDCardViewerProps {
  onCapture: (base64Image: string) => void;
  onClose: () => void;
}

const IDCardOCR: React.FC<IDCardViewerProps> = ({ onCapture, onClose }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // เก็บสถานะว่าอุปกรณ์อยู่ในโหมด Portrait หรือ Landscape
  const [isPortrait, setIsPortrait] = useState<boolean>(
    window.matchMedia('(orientation: portrait)').matches
  );

  useEffect(() => {
    // เตรียมให้กล้องพร้อมทันที (ถ้า onUserMedia ยังไม่เรียก set ก็ถือว่า ready)
    setIsCameraReady(true);

    // ฟังการเปลี่ยนแปลง orientation
    const mql = window.matchMedia('(orientation: portrait)');
    const handler = (e: MediaQueryListEvent) => {
      setIsPortrait(e.matches);
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // ถ่ายภาพ แล้วส่ง base64 กลับ parent
  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  // สลับ videoConstraints ตาม orientation
  const videoConstraints = useMemo(() => {
    return isPortrait
      ? { width: 720, height: 1280, facingMode: 'environment' }
      : { width: 1280, height: 720, facingMode: 'environment' };
  }, [isPortrait]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          maxWidth: 700,
          maxHeight: '100%',
          backgroundColor: '#000',
          overflow: 'hidden',
        }}
      >
        {/* ปุ่มปิดมุมบนขวา */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            fontSize: 28,
            background: 'transparent',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            zIndex: 5,
          }}
        >
          &times;
        </button>

        {/* วิดีโอจากกล้อง ให้เต็มช่อง (ปรับขนาดอัตโนมัติ) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
          }}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={() => setIsCameraReady(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain', // หรือ 'cover' ตามความต้องการ (แต่ 'contain' จะไม่ซูมจนเกินไป)
            }}
          />
        </div>

        {/* Overlay กรอบบัตร (อยู่ตรงกลางตลอด) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            aspectRatio: `${85.60} / ${53.98}`, // กลมๆ สัดส่วนบัตรจริง ≈ 1.585
            border: '2px solid rgba(0, 255, 0, 0.7)',
            borderRadius: 6,
            pointerEvents: 'none',
            zIndex: 2,
            boxSizing: 'border-box',
          }}
        />

        {/* ปุ่มถ่ายรูปวางด้านล่างกลาง */}
        <button
          onClick={capture}
          disabled={!isCameraReady}
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 32px',
            fontSize: 18,
            backgroundColor: isCameraReady ? '#28a745' : '#555',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: isCameraReady ? 'pointer' : 'not-allowed',
            zIndex: 5,
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          {isCameraReady ? 'ถ่ายภาพบัตรประชาชน' : 'กำลังเตรียมกล้อง...'}
        </button>
      </div>
    </div>
  );
};

export default IDCardOCR;
