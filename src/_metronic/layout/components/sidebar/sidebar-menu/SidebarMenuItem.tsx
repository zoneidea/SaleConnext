import styles from '@/styles/style.module.css'
import { FC } from 'react'
import clsx from 'clsx'
import { Link, useLocation } from 'react-router-dom'
import { WithChildren } from '../../../../helpers'

type Props = {
  fontSize?: string
  to: string
  title: string
  imageSrc?: string // สำหรับไอคอนแบบรูปภาพ
  hasBullet?: boolean
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const SidebarMenuItem: FC<Props & WithChildren> = ({
  fontSize,
  to,
  title,
  imageSrc,
  hasBullet = false,
  onMouseEnter,
  onMouseLeave
}) => {
  const { pathname } = useLocation()

  // ใช้ exact match แทน checkIsActive เดิม
  const isActive = pathname === to

  return (
    <div
      className="menu-item"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link className={clsx('menu-link without-sub', { active: isActive })} to={to}>
        {hasBullet && (
          <span className="menu-bullet">
            <span className="bullet bullet-dot"></span>
          </span>
        )}
        {imageSrc && (
          <span className="menu-icon px-2 py-1">
            <img src={imageSrc} alt={title} style={{ width: 20, height: 20 }} />
          </span>
        )}
        <span className="menu-title" style={{ fontSize }}>{title}</span>
      </Link>
    </div>
  )
}

export { SidebarMenuItem }