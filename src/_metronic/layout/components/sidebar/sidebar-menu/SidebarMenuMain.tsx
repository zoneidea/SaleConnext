import axios from 'axios'
import { useState, useEffect } from 'react'
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { SidebarMenuItem } from './SidebarMenuItem'

const SidebarMenuMain = () => {
  const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT
  const GET_MENU_URL = `${API_SALECONNEXT}/GetMenu`

  // เก็บข้อมูลเมนูเป็น array
  const [menu, setMenu] = useState<any[]>([])
  console.log(`menu`, menu);
  
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
    }
  }

  return (
    <>
      {menu.map((item) => (
        <SidebarMenuItem
          key={item.MENU_ID}
          to={item.MENU_OBJECT}
          title={item.MENU_NAME}
          imageSrc={getCustomMenuIcon(item.MENU_NAME)}
        />
      ))}
    </>
  )
}

export { SidebarMenuMain }