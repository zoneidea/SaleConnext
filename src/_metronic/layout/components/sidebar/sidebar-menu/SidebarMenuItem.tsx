import styles from '@/styles/style.module.css'
import { FC } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { checkIsActive, WithChildren } from '../../../../helpers'

type Props = {
  to: string
  title: string
  imageSrc?: string // สำหรับไอคอนแบบรูปภาพ
  hasBullet?: boolean
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const SidebarMenuItem: FC<Props & WithChildren> = ({
  to,
  title,
  imageSrc,
  hasBullet = false,
  onMouseEnter,
  onMouseLeave
}) => {
  const { pathname } = useLocation()
  const isActive = checkIsActive(pathname, to)
  // console.log(`imageSrc`, imageSrc);

  return (
    <div className='menu-item'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link className={clsx('menu-link without-sub', { active: isActive })} to={to}>
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}
        {imageSrc && (
          <span className='menu-icon px-7'>
            <img src={imageSrc} alt={title} style={{ width: 25, height: 25 }} />
          </span>
        )}
        <span className={`menu-title ${styles.fontSize}`}>{title}</span>
      </Link>
    </div>
  )
}

export { SidebarMenuItem }