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
          to='/sale/order'
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

      {/* <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Crafted</span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to='/crafted/pages'
        title='Pages'
        fontIcon='bi-archive'
        icon='element-plus'
      >
        <SidebarMenuItemWithSub to='/crafted/pages/profile' title='Profile' hasBullet={true}>
          <SidebarMenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
          <SidebarMenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
          <SidebarMenuItem
            to='/crafted/pages/profile/campaigns'
            title='Campaigns'
            hasBullet={true}
          />
          <SidebarMenuItem
            to='/crafted/pages/profile/documents'
            title='Documents'
            hasBullet={true}
          />
          <SidebarMenuItem
            to='/crafted/pages/profile/connections'
            title='Connections'
            hasBullet={true}
          />
        </SidebarMenuItemWithSub>

        <SidebarMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
          <SidebarMenuItem
            to='/crafted/pages/wizards/horizontal'
            title='Horizontal'
            hasBullet={true}
          />
          <SidebarMenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
        </SidebarMenuItemWithSub>
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to='/crafted/accounts'
        title='Accounts'
        icon='profile-circle'
        fontIcon='bi-person'
      >
        <SidebarMenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
        <SidebarMenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub to='/error' title='Errors' fontIcon='bi-sticky' icon='cross-circle'>
        <SidebarMenuItem to='/error/404' title='Error 404' hasBullet={true} />
        <SidebarMenuItem to='/error/500' title='Error 500' hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to='/crafted/widgets'
        title='Widgets'
        icon='element-7'
        fontIcon='bi-layers'
      >
        <SidebarMenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
      </SidebarMenuItemWithSub>
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Apps</span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to='/apps/chat'
        title='Chat'
        fontIcon='bi-chat-left'
        icon='message-text-2'
      >
        <SidebarMenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
        <SidebarMenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
        <SidebarMenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItem
        to='/apps/user-management/users'
        icon='abstract-28'
        title='User management'
        fontIcon='bi-layers'
      />
      <div className='menu-item'>
        <a
          target='_blank'
          className='menu-link'
          href={import.meta.env.VITE_APP_PREVIEW_DOCS_URL + '/changelog'}
        >
          <span className='menu-icon'>
            <KTIcon iconName='code' className='fs-2' />
          </span>
          <span className='menu-title'>Changelog {import.meta.env.VITE_APP_VERSION}</span>
        </a>
      </div> */}
    </>
  )
}

export { SidebarMenuMain }
