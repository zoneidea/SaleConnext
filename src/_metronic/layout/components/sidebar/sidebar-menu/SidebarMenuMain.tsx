import axios from 'axios'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { SidebarMenuItem } from './SidebarMenuItem'
import { useAuth } from '../../../../../app/modules/auth'

const SidebarMenuMain = () => {
  const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT
  const GET_MENU_URL = `${API_SALECONNEXT}/GetMenu`

  const { auth } = useAuth()
  const EmpId = auth?.data?.[0]?.EmpId || ''
  const TeamSale = auth?.data?.[0]?.TeamSale || ''
  const SaleCode = auth?.data?.[0]?.SaleCode || ''

  // เก็บข้อมูลเมนูเป็น array
  const [menu, setMenu] = useState<any[]>([])
  const [fontSize, setFontSize] = useState('14px'); //เฉพาะเมนูที่ไม่ได้ดึงจาก api

  // GET GetMenu
  useEffect(() => {
    // ถ้ายังไม่มี EmpId/TeamSale ก็ไม่ต้องไปเรียก API
    if (!EmpId || !TeamSale) return;

    const getData = async () => {
      try {
        const response = await axios.post(
          GET_MENU_URL,
          { EmpId, TeamSale },
          { headers: { 'Content-Type': 'application/json' } }
        );
        // สมมติ API ของคุณคืนเป็น { status, message, data: [ … ] }
        const payload = response.data?.data ?? response.data;
        if (Array.isArray(payload)) {
          setMenu(payload);
        } else {
          console.error('Response payload is not an array:', payload);
        }
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };
    getData();
  }, [EmpId, TeamSale]);  // เพิ่ม EmpId กับ TeamSale ใน dependency array

  // แก้ฟอนต์ตามขนาดหน้าจอ เฉพาะเมนูที่ไม่ได้ดึงจาก api
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setFontSize('11px'); // ฟอนต์เล็กลงสำหรับหน้าจอเล็ก
      } else {
        setFontSize('14px'); // ฟอนต์ปกติสำหรับหน้าจอใหญ่
      }
    };

    handleResize(); // เรียกครั้งแรกเมื่อโหลดหน้า
    window.addEventListener('resize', handleResize); // ฟังค์ชันตรวจจับการเปลี่ยนแปลงหน้าจอ

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ฟังก์ชันกำหนดไอคอนของแต่ละเมนู
  const getCustomMenuIcon = (menuName: string) => {
    if (menuName.includes('หน้าแรก')) {
      return toAbsoluteUrl('media/iconSidebar/home-1-svgrepo-com.png')
    } else if (menuName.includes('พนักงาน')) {
      return toAbsoluteUrl('media/iconSidebar/employee-svgrepo-com.png')
    } else if (menuName.includes('สินค้าในสต๊อก')) {
      return toAbsoluteUrl('media/iconSidebar/product-management-svgrepo-com.png')
    } else if (menuName.includes('ระบบจอง')) {
      return toAbsoluteUrl('media/iconSidebar/book-sparkles-svgrepo-com.png')
    } else if (menuName.includes('ระบบขาย')) {
      return toAbsoluteUrl('media/iconSidebar/shopping-card-svgrepo-com.png')
    } else if (menuName.includes('ระบบเก็บเงินงวดแรก')) {
      return toAbsoluteUrl('media/iconSidebar/money-bag-svgrepo-com.png')
    } else if (menuName.includes('ระบบตรวจสัญญา')) {
      return toAbsoluteUrl('media/iconSidebar/check-circle-svgrepo-com.png')
    } else if (menuName.includes('ระบบตรวจใบจอง')) {
      return toAbsoluteUrl('media/iconSidebar/check-1-svgrepo-com.png')
    } else if (menuName.includes('ระบบตรวจสอบ CT')) {
      return toAbsoluteUrl('media/iconSidebar/check-1-svgrepo-com.png')
    } else if (menuName.includes('ระบบติดตั้งจากใบจอง')) {
      return toAbsoluteUrl('media/iconSidebar/install-svgrepo-com.png')
    } else if (menuName.includes('รายงานการขายประจำวัน')) {
      return toAbsoluteUrl('media/iconSidebar/report-linechart-svgrepo-com.png')
    } else if (menuName.includes('ระบบส่งเงิน')) {
      return toAbsoluteUrl('media/iconSidebar/money-send-svgrepo-com.png')
    } else if (menuName.includes('ระบบยืมสินค้า')) {
      return toAbsoluteUrl('media/iconSidebar/product-transfer-svgrepo-com.png')
    }
  }

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.backgroundColor = '#1b1b28';
    event.currentTarget.style.borderRadius = '7px';
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.backgroundColor = 'transparent';
  };

  return (
    <>
      {/* เมนูทั่วไป */}
      {menu
        .filter((item) => item.MENU_NAME !== 'รายงานการขายประจำวัน' &&
          item.MENU_NAME !== 'ระบบตรวจสัญญา'
        )
        .map((item) => (
          <SidebarMenuItem
            key={item.MENU_ID}
            to={item.MENU_OBJECT}
            title={item.MENU_NAME}
            imageSrc={getCustomMenuIcon(item.MENU_NAME)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        ))}

      {/* เส้นคั่น */}
      <hr
        style={{
          border: 'none',
          borderTop: '2px dashed white',
          margin: '20px',
        }}
      />

      {/* เมนู "รายงานการขายประจำวัน" */}
      {menu
        .filter((item) => item.MENU_NAME === 'รายงานการขายประจำวัน') // แสดงเฉพาะ "รายงานการขายประจำวัน"
        .map((item) => (
          <SidebarMenuItem
            key={item.MENU_ID}
            to={item.MENU_OBJECT}
            title={item.MENU_NAME}
            imageSrc={getCustomMenuIcon(item.MENU_NAME)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        ))}
    </>
  )
}

export { SidebarMenuMain }