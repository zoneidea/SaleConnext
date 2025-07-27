import { FC } from 'react'
import dayjs from 'dayjs'
import { KTIcon } from '../../../../../_metronic/helpers'
import { ThreeDot } from 'react-loading-indicators'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useAuth } from '../../../../modules/auth/core/Auth'
import { useItemStore } from '../../store/useItemStore'

type Props = {
  payments: any[]
  isLoading: boolean
}

// กำหนดตัวแปร URL ของแต่ละ API ไว้ก่อน (สมมติชื่อ)
const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT
const VOID_RECEIPT_URL = `${API_URL_SALECONNEXT}/UpdatePayment/VoidReceipt`
const UPDATE_CONTACT_URL = `${API_URL_SALECONNEXT}/UpdateContact/VoidContract`
// หรือถ้าชื่อจริงๆ เป็นอะไร ก็เปลี่ยนตามจริง

const CardBillRecieveMoney: FC<Props> = ({ payments, isLoading }) => {
  const MySwal = withReactContent(Swal)
  const { auth } = useAuth()
  const EmpId = auth?.data?.[0]?.EmpId || ''

  // ดึงข้อมูล item จาก store (ถ้ามี)
  const item = useItemStore((state) => state.item)

  const handleVoidReceipt = async (pay: any) => {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: `คุณต้องการยกเลิกใบเสร็จเลขที่ ${pay.RECEIPTCODE} หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ยกเลิก!',
      cancelButtonText: 'ยกเลิก',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // -----------------------------
          // 1) เรียก API VoidReceipt ก่อน
          // -----------------------------
          const formData = new FormData()
          formData.append('EmpId', EmpId)
          formData.append('RefNo', pay.REFNO)
          formData.append('ReceiptId', pay.RECEIPTID)
          formData.append('ReceiptCode', pay.RECEIPTCODE)

          const responseVoid = await axios.post(VOID_RECEIPT_URL, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'multipart/form-data',
            },
          })
          console.log('Void success:', responseVoid.data)

          // -----------------------------
          // 2) เรียก API UpdateContact ต่อ
          // (เปลี่ยนสถานะเป็น REMOVE)
          // -----------------------------
          const responseUpdate = await axios.post(UPDATE_CONTACT_URL, {
            RefNo: pay.REFNO,
            EmpId: EmpId,
            // กรณีต้องการส่ง TeamSale หรือ Field/Data อื่นด้วย
            // TEAMSALE: TeamSale,
            // FIELD: 'STATUS',
            // DATA: 'REMOVE',
          })
          console.log('Update success:', responseUpdate.data)

          // ถ้าทั้งสองสำเร็จ
          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ!',
            text: `ใบเสร็จถูกยกเลิกเรียบร้อยแล้ว และสถานะถูกอัปเดตเป็น REMOVE`,
            timer: 2000,
            showConfirmButton: false,
          })

          // TODO: หากต้องการรีเฟรชหน้าหรือ navigate ไปหน้าอื่น ก็เพิ่มได้
        } catch (error) {
          console.error('Error:', error)
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด!',
            text: 'ไม่สามารถยกเลิกใบเสร็จหรืออัปเดตสถานะได้ กรุณาลองใหม่',
            confirmButtonText: 'ตกลง',
          })
        }
      }
    })
  }

  if (isLoading) {
    return (
      <div className='text-center my-10'>
        <ThreeDot />
      </div>
    )
  }

  return (
    <div className='row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4'>
      {payments.map((pay, index) => {
        // ฟอร์แมตวันที่
        const receivedDate = pay.SENDDATE
          ? dayjs(pay.SENDDATE).format('DD/MM/YYYY')
          : '-'
        const contractDate = pay.CONTRACTDATE
          ? dayjs(pay.CONTRACTDATE).format('DD/MM/YYYY')
          : '-'

        return (
          <div className='col' key={index}>
            <div className='card h-100 p-4'>
              {/* ส่วนหัวการ์ด */}
              <div className='d-flex justify-content-between align-items-center mb-4'>
                <div className='d-flex align-items-center'>
                  <KTIcon iconName='abstract-26' className='fs-3 me-2 text-primary' />
                  <span className='fw-bold fs-5'>
                    เลขที่สัญญา {pay.CONTRACTREFERENCENO ?? '-'}
                  </span>
                </div>
                <span className='badge bg-primary text-white fs-6'>
                  งวดที่ {index + 1} / {payments.length}
                </span>
              </div>

              {/* Card body */}
              <div className='mb-3'>
                <strong>ลูกค้า:</strong> {pay.CUSTOMERNAME ?? '-'} {pay.CUSTOMERLASTNAME}
              </div>
              <div className='mb-3'>
                <strong>เลขบัตร:</strong> {pay.IDCARD ?? '-'}
              </div>
              <div className='mb-3'>
                <strong>สินค้า:</strong> {pay.PRODUCTNAME ?? '-'}
              </div>
              <div className='mb-3'>
                <strong>Model:</strong> {pay.MODEL ?? '-'}
              </div>
              <div className='mb-3'>
                <strong>S/N:</strong> {pay.PRODUCTSERIALNUMBER ?? '-'}
              </div>
              <div className='mb-3'>
                <strong>แพ็คเกจ:</strong> {pay.PACKAGETITLE ?? '-'}
              </div>
              <div className='mb-3'>
                <strong>วันที่จ่าย:</strong> {pay.DATEPAYMENT ?? '-'}
              </div>
              <div className='mb-3'>
                <strong>ยอดที่จ่าย:</strong>{' '}
                {pay.ACCRUED
                  ? Number(pay.ACCRUED).toLocaleString('th-TH')
                  : '-'}{' '}
                บาท
              </div>
              <div className='mb-3'>
                <strong>ยอดที่จ่าย คำอ่าน:</strong> {pay.AMOUNTTEXT ?? '-'}
              </div>
              <div className='mb-3'>
                <strong>ยอดคงเหลือ:</strong>{' '}
                {pay.BALANCE
                  ? Number(pay.BALANCE).toLocaleString('th-TH')
                  : '-'}{' '}
                บาท
              </div>
              <div className='mb-4'>
                <strong>ประเภทการชำระ:</strong> {pay.PAYMENTTYPE ?? '-'}
              </div>

              {/* ปุ่มยกเลิกใบเสร็จ (Disable ถ้าไม่มี ISACTIVE_VOID) */}
              <button
                className='btn btn-danger w-100 w-md-auto align-self-center mt-7 mb-2'
                type='button'
                disabled={!pay.ISACTIVE_VOID}
                onClick={() => handleVoidReceipt(pay)}
              >
                ยกเลิกใบเสร็จ
              </button>
            </div>
          </div>
        )
      })}
    </div >
  )
}

export { CardBillRecieveMoney }
