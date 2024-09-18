import { useIntl } from 'react-intl'
import { KTIcon } from '../../../../helpers'
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub'
import { SidebarMenuItem } from './SidebarMenuItem'

const SidebarMenuMain = () => {
  const intl = useIntl()

  return (
    <>
      <SidebarMenuItem
        to='/dashboard'
        icon='element-11'
        title='หน้าแรก'
        fontIcon='bi-app-indicator'
      />

      <SidebarMenuItem to='/sale/overview' icon='shop' title='ระบบขาย' fontIcon='bi-layers' />

      <SidebarMenuItemWithSub to='/sale/*' title='ระบบขาย' hasBullet={false} icon='shop' fontIcon='bi-person'>
        <SidebarMenuItem
          to='/sale/overview'
          title='ภาพรวม'
          hasBullet={true}
        />
        <SidebarMenuItem
          to='/sale/scanbarcode'
          title='สแกนบาร์โค้ด'
          hasBullet={true}
        />
        <SidebarMenuItem
          to='/sale/package'
          title='เลือกแพ็คเกจ'
          hasBullet={true}
        />
        <SidebarMenuItem
          to='/sale/product'
          title='ตรวจสอบสินค้า'
          hasBullet={true}
        />
        <SidebarMenuItem
          to='/sale/statuscust'
          title='ตรวจสอบลูกค้า'
          hasBullet={true}
        />
        <SidebarMenuItem
          to='/sale/discount'
          title='ส่วนลด / เครื่องเทิร์น / ของแถม'
          hasBullet={true}
        />
        <SidebarMenuItem
          to='/sale/createcust'
          title='ข้อมูลลูกค้า'
          hasBullet={true}
        />
        <SidebarMenuItem
          to='/sale/hirepurchaseagmt'
          title='ใบสัญญาเช่าซื้อ'
          hasBullet={true}
        />
        <SidebarMenuItem
          to='/sale/watermeas'
          title='ข้อมูลคุณภาพน้ำ'
          hasBullet={true}
        />
        {/* <SidebarMenuItem
          to='/sales/receipt'
          title='Receipt'
          hasBullet={true}
        /> */}
        <SidebarMenuItem
          to='/sale/photo'
          title='ถ่ายรูป'
          hasBullet={true}
        />
        <SidebarMenuItem
          to='/sale/addcustinfo'
          title='ข้อมูลลูกค้าเพิ่มเติม'
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>

      <SidebarMenuItem to='/sale/overview' icon='handcart' title='ระบบสั่งซื้อสินค้า' fontIcon='bi-layers' />
    </>
  )
}

export { SidebarMenuMain }
