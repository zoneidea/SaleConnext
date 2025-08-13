// import { FC } from 'react'
// import { OrderOverview } from './OrderOverview'

// const OrderWrapper: FC = () => {
//   return (
//     <>
//       <OrderOverview />
//     </>
//   )
// }

// export {OrderWrapper}

import { useEffect } from "react";
import { useAuth } from "../../../app/modules/auth";

const OrderWrapper: React.FC = () => {
  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId ?? "";
  const PW_saleorder = auth?.data?.[0]?.PW_saleorder ?? "";

  // base ของระบบจองฝั่งนั้น (เช่น https://telesale.xxx.com)
  const API_THIENSURAT2 = import.meta.env.VITE_APP_API_THIENSURAT2 as string;

  // ถ้ามีปลายทางหน้า UI หลังล็อกอิน ให้ใส่ไว้ (ถ้าไม่มีให้คอมเมนต์บรรทัดนี้ไว้)
  // const ORDER_PORTAL_URL = `${API_THIENSURAT2}/TeleSale/Order/Overview`;

  useEffect(() => {
    if (!EmpId || !PW_saleorder) {
      // ถ้าไม่มี creds ก็อยู่หน้าเดิม หรือจะแจ้งเตือนก่อนก็ได้
      console.warn("missing EmpId or PW_saleorder");
      return;
    }

    // แนวทาง 1: ให้ server สร้าง session แล้ว redirect เอง
    const loginUrl =
      `${API_THIENSURAT2}/TeleSale/Login/CheckLogin2` +
      `?us=${encodeURIComponent(EmpId)}` +
      `&pw=${encodeURIComponent(PW_saleorder)}`;

    // แนวทาง 2 (ถ้า server รองรับพารามิเตอร์ redirect):
    // const loginUrl =
    //   `${API_THIENSURAT2}/TeleSale/Login/CheckLogin2` +
    //   `?us=${encodeURIComponent(EmpId)}` +
    //   `&pw=${encodeURIComponent(PW_saleorder)}` +
    //   `&redirect=${encodeURIComponent(ORDER_PORTAL_URL)}`;

    // ไปเว็บนั้น “ในแท็บเดียว”
    window.location.replace(loginUrl);

    // ถ้าอยากเปิดแท็บใหม่ (อาจโดนบล็อกถ้าไม่ใช่อีเวนต์จากคลิก):
    // window.open(loginUrl, "_blank", "noopener");
  }, [EmpId, PW_saleorder, API_THIENSURAT2]);

  // ระหว่างกำลัง redirect แสดงอะไรเล็กน้อย
  return <div style={{ padding: 24 }}>กำลังกำหนดสิทธิ์และนำทางไปยังระบบจอง…</div>;
};

export { OrderWrapper };