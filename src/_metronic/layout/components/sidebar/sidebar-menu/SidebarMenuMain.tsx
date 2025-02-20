import axios from 'axios'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { SidebarMenuItem } from './SidebarMenuItem'

const SidebarMenuMain = () => {
  const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT
  const GET_MENU_URL = `${API_SALECONNEXT}/GetMenu`

  const APP_VERSION = import.meta.env.VITE_APP_VERSION;

  // เก็บข้อมูลเมนูเป็น array
  const [menu, setMenu] = useState<any[]>([])
  const [fontSize, setFontSize] = useState('14px'); //เฉพาะเมนูที่ไม่ได้ดึงจาก api

  // GET GetMenu
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(GET_MENU_URL, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        // ตรวจสอบว่า response.data เป็น array หรือไม่
        if (Array.isArray(response.data)) {
          setMenu(response.data)
        } else {
          console.error('Response is not an array:', response.data)
        }
      } catch (error) {
        console.error('Error fetching menu data:', error)
      }
    }
    getData()
  }, [])

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
        .filter((item) => item.MENU_NAME !== 'รายงานการขายประจำวัน') // กรองเมนูที่ไม่ใช่ "รายงานการขายประจำวัน"
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

      <div style={{ color: '#9A9CAE' }} className="mt-4 text-end">
        version {APP_VERSION}
      </div>
      
    </>
  )
}

export { SidebarMenuMain }