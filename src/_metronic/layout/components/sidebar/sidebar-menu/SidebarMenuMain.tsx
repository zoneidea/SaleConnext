// import axios from 'axios'
// import { useState, useEffect } from 'react'
// import { useIntl } from 'react-intl'
// import { KTIcon } from '../../../../helpers'
// import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub'
// import { SidebarMenuItem } from './SidebarMenuItem'

// import { useAuth } from '../../../../../app/modules/auth/core/Auth'

// const SidebarMenuMain = () => {
//   const intl = useIntl()

//   const { auth } = useAuth();
//   console.log(`auth`, auth.data[0]);

//   const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
//   const GET_MENU_URL = `${API_SALECONNEXT}/GetMenu`;

//   const [menu, setMenu] = useState<any>('');
//   console.log(`menu`, menu)

//   const menuData = [
//     {
//       "MENU_ID": menu.MENU_ID,
//       "MENU_PARENT_ID": menu.MENU_PARENT_ID,
//       "MENU_OBJECT": menu.MENU_OBJECT,
//       "MENU_COMPONENT": menu.MENU_COMPONENT,
//       "MENU_NAME": menu.MENU_NAME,
//       "MENU_ORDER": menu.MENU_ORDER,
//       "SUB_MENUS": []
//     },
//     // เพิ่มข้อมูลเมนูอื่นๆ ได้ที่นี่
//   ];

//   // GET GetMenu
//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const response = await axios.get(GET_MENU_URL, {
//           headers: {
//             'Content-Type': 'application/json',
//           }
//         });
//         setMenu(response.data);
//       } catch (error) {
//         console.error('Error fetching PACKAGE_URL:', error);
//       }
//     };
//     getData();
//   }, []);

//   return (
//     <>
//       {menuData.map((item) => (
//         <SidebarMenuItem
//           key={item.MENU_ID}
//           to={item.MENU_OBJECT}
//           title={item.MENU_NAME}
//           fontIcon="bi-app-indicator" // คุณสามารถปรับเปลี่ยนได้ตามต้องการ
//         />
//       ))}
//       {/* <SidebarMenuItem
//         to='/dashboard'
//         icon='element-11'
//         title='หน้าแรก'
//         fontIcon='bi-app-indicator'
//       />

//       <SidebarMenuItem to='/employee/overview' icon='shop' title='พนักงานขาย' fontIcon='bi-layers' />

//       <SidebarMenuItem to='/sale/overview' icon='shop' title='ระบบขาย' fontIcon='bi-layers' />

//       <SidebarMenuItem to='/order/overview' icon='handcart' title='ระบบสั่งซื้อสินค้า' fontIcon='bi-layers' /> */}

//       {/* <SidebarMenuItemWithSub to='/sale/*' title='ระบบขาย' hasBullet={false} icon='shop' fontIcon='bi-person'>
//         <SidebarMenuItem
//           to='/sale/overview'
//           title='ภาพรวม'
//           hasBullet={true}
//         />
//         <SidebarMenuItem
//           to='/sale/scanbarcode'
//           title='สแกนบาร์โค้ด'
//           hasBullet={true}
//         />
//         <SidebarMenuItem
//           to='/sale/package'
//           title='เลือกแพ็คเกจ'
//           hasBullet={true}
//         />
//         <SidebarMenuItem
//           to='/sale/product'
//           title='ตรวจสอบสินค้า'
//           hasBullet={true}
//         />
//         <SidebarMenuItem
//           to='/sale/statuscust'
//           title='ตรวจสอบลูกค้า'
//           hasBullet={true}
//         />
//         <SidebarMenuItem
//           to='/sale/discount'
//           title='ส่วนลด / เครื่องเทิร์น / ของแถม'
//           hasBullet={true}
//         />
//         <SidebarMenuItem
//           to='/sale/createcust'
//           title='ข้อมูลลูกค้า'
//           hasBullet={true}
//         />
//         <SidebarMenuItem
//           to='/sale/hirepurchaseagmt'
//           title='ใบสัญญาเช่าซื้อ'
//           hasBullet={true}
//         />
//         <SidebarMenuItem
//           to='/sale/watermeas'
//           title='ข้อมูลคุณภาพน้ำ'
//           hasBullet={true}
//         />
//         <SidebarMenuItem
//           to='/sale/photo'
//           title='ถ่ายรูป'
//           hasBullet={true}
//         />
//         <SidebarMenuItem
//           to='/sale/addcustinfo'
//           title='ข้อมูลลูกค้าเพิ่มเติม'
//           hasBullet={true}
//         />
//         <SidebarMenuItem
//           to='/sale/productstock'
//           title='คลังสินค้า'
//           hasBullet={true}
//         />
//       </SidebarMenuItemWithSub> */}
//     </>
//   )
// }

// export { SidebarMenuMain }

import axios from 'axios'
import { useState, useEffect } from 'react'
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

  return (
    <>
      {menu.map((item) => (
        <SidebarMenuItem
          key={item.MENU_ID}
          to={item.MENU_OBJECT}
          title={item.MENU_NAME}
          fontIcon='bi-app-indicator' // ปรับไอคอนได้ตามต้องการ
        />
      ))}
    </>
  )
}

export { SidebarMenuMain }