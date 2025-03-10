import { KTIcon } from '../../../../_metronic/helpers'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef, useMemo } from 'react';
import dayjs from 'dayjs'
import axios from 'axios';
import Swal from 'sweetalert2'
import { useAuth } from '../../../modules/auth/core/Auth';

interface StatusLabelProps {
  status: string
  item: any
  onDelete: () => void // Callback สำหรับแจ้งการลบสำเร็จ (ถ้ามีการใช้งาน)
}

const SendMoneyItemNumber: React.FC<StatusLabelProps> = ({ status, item, onDelete }) => {
  console.log(`item`, item)

  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || '';
  const TeamSale = auth?.data?.[0]?.TeamSale || '';
  const SaleCode = auth?.data?.[0]?.SaleCode || '';

  const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
  const DEL_CONTRACT_URL = `${API_SALECONNEXT}/UpdateSendMoney/Delete_SendMoney`;

  // ฟังก์ชันฟอร์แมตวันที่ภาษาไทย
  const formatThaiDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const monthIndex = date.getMonth()
    const year = date.getFullYear() + 543

    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ]
    const dayStr = day.toString().padStart(2, '0')
    return `${dayStr} ${thaiMonths[monthIndex]} ${year}`
  }

  let amount = 0
  let formattedAmount = ''

  let organizationCode, organizationDesc, organizationName, payDate, sendMoneyId

  if (item) {
    amount = Number(item?.AMOUNT ?? 0)
    formattedAmount = amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

    sendMoneyId = (
      <span className='text-gray-700 fw-semibold d-block'>
        {`ID: ${item.SENDMONEYID}`}
      </span>
    )
    organizationCode = (
      <span className='text-gray-700 fw-semibold d-block'>
        {`รหัสบริษัท: ${item.ORGANIZATIONCODE}`}
      </span>
    )
    organizationDesc = (
      <span className='text-gray-700 fw-semibold d-block'>
        {`ชื่อบริษัท: ${item.ORGANIZATIONDESCRIPTION}`}
      </span>
    )
    organizationName = (
      <span className='text-gray-700 fw-semibold d-block'>
        {`ชื่อย่อบริษัท: ${item.ORGANIZATIONNAME}`}
      </span>
    )
    payDate = (
      <span className='text-gray-700 fw-semibold d-block'>
        {`วันที่ลูกค้าจ่ายเงิน: ${formatThaiDate(item.PAYDATE)}`}
      </span>
    )
  }

  // สร้างเงื่อนไขสุดท้ายว่าลบได้หรือไม่
  // ตัวอย่าง: ต้อง "ไม่ครบทุกขั้นตอน" + "STATUSRECEIVEDMONEY === 0" ถึงลบได้
  const canDelete = item?.STATUSRECEIVEDMONEY === 0

  // ฟังก์ชันลบ
  const deleteDataDraft = async (e: React.MouseEvent, item: any) => {
    e.stopPropagation()
    e.preventDefault()

    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: `คุณต้องการลบ ID: ${item.SENDMONEYID} หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // สร้าง FormData และใส่ key ให้ตรงกับฝั่ง Server
          const formData = new FormData()
          console.log(`EmpId`, EmpId);
          console.log(`SendmoneyId`, item.SENDMONEYID);
          
          formData.append('EmpId', EmpId) // สะกด Empid ให้ตรงกับ Postman
          formData.append('SendmoneyId', item.SENDMONEYID)

          const response = await axios.post(DEL_CONTRACT_URL, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })

          console.log('ลบข้อมูลสำเร็จ:', response.data)
          Swal.fire({
            text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          })
          onDelete()
        } catch (error) {
          console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error)
          Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถลบข้อมูลได้', 'error')
        }
      }
    })
  }

  return (
    <>
      {/* กรณีสถานะ DRAFT */}
      {status === 'DRAFT' && (
        <Link to='/sendmoney/CreateSendMoney' state={item}>
          <div className='d-flex flex-column flex-md-row align-items-center bg-light-warning rounded p-5 mb-3 col-12'>
            <span className='text-warning me-5 d-none d-md-inline'>
              <KTIcon iconName='abstract-26' className='text-warning fs-1 me-5' />
            </span>

            <div className='flex-grow-1 me-2'>
              <div className='fw-bold text-gray-800 text-hover-primary fs-5 mb-1'>
                {`ยอดที่ต้องนำส่ง: ${formattedAmount} บาท`}
              </div>
              {organizationDesc}
              {organizationName}
              {payDate}
            </div>
          </div>
        </Link>
      )}

      {/* กรณีสถานะ FINISH */}
      {status === 'FINISH' && (
        <Link to='/sendmoney/SendMoneySummary' state={item}>
          <div className='d-flex flex-column flex-md-row align-items-center bg-light-success rounded p-5 mb-3 col-12'>
            <span className='text-warning me-5 d-none d-md-inline'>
              <KTIcon iconName='abstract-26' className='text-warning fs-1 me-5' />
            </span>

            <div className='flex-grow-1 me-2'>
              <div className='fw-bold text-gray-800 text-hover-primary fs-5 mb-1'>
                {`ยอดที่ต้องนำส่ง: ${formattedAmount} บาท`}
              </div>
              {sendMoneyId}
              {organizationDesc}
              {organizationName}
              {payDate}
            </div>

            {/* ไอคอนถังขยะ (เฉพาะหน้าจอใหญ่) */}
            <span
              className={`d-none d-md-inline me-5 ${!canDelete ? 'disabled' : ''}`}
              onClick={(e) => canDelete && deleteDataDraft(e, item)}
              style={{
                cursor: canDelete ? 'pointer' : 'not-allowed',
                opacity: canDelete ? 1 : 0.5,
              }}
            >
              <img
                src={toAbsoluteUrl('media/settings/trash-svgrepo-com (2).png')}
                style={{ width: 35, height: 35 }}
                alt='Trash Icon'
              />
            </span>

            {/* ปุ่ม "ลบ" ในหน้าจอเล็ก (mobile) */}
            <span
              className={`d-block d-md-none text-black fw-bold mt-3 text-center rounded ${!canDelete ? 'disabled' : ''}`}
              style={{
                backgroundColor: canDelete ? '#F6C000' : '#ccc',
                cursor: canDelete ? 'pointer' : 'not-allowed',
                width: '100%',
                height: '30px',
                lineHeight: '30px',
                opacity: canDelete ? 1 : 0.5,
              }}
              onClick={(e) => canDelete && deleteDataDraft(e, item)}
            >
              ลบ
            </span>
          </div>
        </Link>
      )}
    </>
  )
}

export { SendMoneyItemNumber }
