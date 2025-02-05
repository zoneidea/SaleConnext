import { KTIcon } from '../../../../../_metronic/helpers'
import { Link, useNavigate } from 'react-router-dom'
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'

interface StatusLabelProps {
  status: string;
  item: any;
  onDelete: () => void; //Callback สำหรับแจ้งการลบสำเร็จ
}

const SalesItemNumber: React.FC<StatusLabelProps> = ({ status, item, onDelete }) => {
  console.log(`item`, item);

  const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO;
  const DEL_CONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/DelContract`;

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    return `${day} ${thaiMonths[month]} ${year + 543}`;
  };

  let customer, product, productPackage, serialNumber, createdAt, statusTxt, checkerComment
  if (item.CUSTOMERDETAIL.length > 0) {
    if (item.CUSTOMERDETAIL[0].CUSTOMERTYPE == 1) {
      customer = <span className='text-gray-700 fw-semibold d-block'>{`ชื่อบริษัท: ${item.CUSTOMERDETAIL[0].CUSTOMERMD}`}</span>
    } else {
      customer = <span className='text-gray-700 fw-semibold d-block'>{`ชื่อลูกค้า: ${item.CUSTOMERDETAIL[0].CUSTOMERNAME}`}</span>
    }
  }

  if (item.PRODUCT.length > 0) {
    product = <span className='text-gray-700 fw-semibold d-block'>{`สินค้า: ${item.PRODUCT[0].ItemDescription}`}</span>
    if (item.PRODUCT[0].Package.length > 0) {
      productPackage = <span className='text-gray-700 fw-semibold d-block'>{`แพ็คเกจ: ${item.PRODUCT[0].Package[0].PACKAGETITLE ? item.PRODUCT[0].Package[0].PACKAGETITLE : 'ไม่มีแพ็คเกจ'}`}</span>
      serialNumber = <span className='text-gray-700 fw-semibold d-block'>{`Serial Number: ${item.PRODUCT[0].SerialNo}`}</span>
    }
  }

  if (item.CONTRACT.length > 0) {
    createdAt = <span className='text-gray-700 fw-semibold d-block'>{`วันที่ทำสัญญา: ${item.CONTRACT[0].createdAt && formatDate(item.CONTRACT[0].createdAt)}`}</span>
  }

  if (item.STATUS === 'DRAFT') {
    statusTxt = <span className='text-warning fw-semibold d-block'>{`ร่าง`}</span>
  } else if (item.STATUS === 'EDIT') {
    statusTxt = <span className='text-danger fw-semibold d-block'>{`แก้ไข`}</span>
    // checkerComment = <span className='text-danger fw-semibold d-block'>{`Comment: ${item.CHECKKERCOMMENT[0]?.COMMENT}`}</span>
  } else if (item.STATUS === 'FINISH') {
    statusTxt = <span className='text-danger fw-semibold d-block'>{`เสร็จสมบูรณ์`}</span>
  } else if (item.STATUS === 'PENDING') {
    statusTxt = <span className='text-danger fw-semibold d-block'>{`รอตรวจสอบ`}</span>
  }

  const deleteDataDraft = async (e: React.MouseEvent, refno: string) => {
    e.stopPropagation()
    e.preventDefault()
    
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: `คุณต้องการลบ REFNO: ${refno} หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(DEL_CONTRACT_URL, { REFNO: refno });
          console.log('ลบข้อมูลสำเร็จ:', response.data);
          Swal.fire({
            text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
            icon: 'success',
            timer: 2000, 
            showConfirmButton: false, 
        });
          onDelete(); // ✅ รีเฟรชข้อมูลใหม่หลังลบสำเร็จ
        } catch (error) {
          console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
          Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถลบข้อมูลได้', 'error');
        }
      }
    });
  };

  // เช็คว่า data ใน item มีไม่ครบทุกขั้นตอน จึงจะสามารถลบได้
  const isDataIncomplete = useMemo(() => {
    return (
      (Array.isArray(item.ADDRESS) && item.ADDRESS.length === 0) ||
      (Array.isArray(item.CUSTOMERDETAIL) && item.CUSTOMERDETAIL.length === 0) ||
      (Array.isArray(item.CUSTOMERSTATUS) && item.CUSTOMERSTATUS.length === 0) ||
      (Array.isArray(item.DISCOUNT) && item.DISCOUNT.length === 0) ||
      (Array.isArray(item.PDPA) && item.PDPA.length === 0) ||
      (Array.isArray(item.PRODUCT) && item.PRODUCT.length === 0)
    );
  }, [item]);

  return (
    <>
      {status === 'DRAFT' ? (
        <Link to='/sale/step' state={item}>
          <div className='d-flex flex-column flex-md-row align-items-center bg-light-warning rounded p-5 mb-3 col-12'>
            <span className='text-warning me-5 d-none d-md-inline'>
              <KTIcon iconName='abstract-26' className='text-warning fs-1 me-5' />
            </span>

            <div className='flex-grow-1 me-2'>
              <div className='fw-bold text-gray-800 text-hover-primary fs-6'>
                {`REFNO: ${item.REFNO}`}
              </div>
              {customer}
              {product}
              {productPackage}
              {serialNumber}
              {createdAt}
              {statusTxt}
              {checkerComment}
            </div>

            {/* แสดงไอคอนถังขยะเฉพาะหน้าจอใหญ่ */}
            <span
              className={`d-none d-md-inline me-5 ${!isDataIncomplete ? 'disabled' : ''}`}
              onClick={(e) => isDataIncomplete && deleteDataDraft(e, item.REFNO)}
              style={{ cursor: isDataIncomplete ? 'pointer' : 'not-allowed', opacity: isDataIncomplete ? 1 : 0.5 }}
            >
              <img
                src={toAbsoluteUrl('media/settings/trash-svgrepo-com (2).png')}
                style={{ width: 35, height: 35 }}
                alt='Trash Icon'
              />
            </span>

            {/* แสดงคำว่า "ลบ" ในหน้าจอเล็ก */}
            <span
              className={`d-block d-md-none text-black fw-bold mt-3 text-center rounded ${!isDataIncomplete ? 'disabled' : ''}`}
              style={{
                backgroundColor: isDataIncomplete ? '#F6C000' : '#ccc',
                cursor: isDataIncomplete ? 'pointer' : 'not-allowed',
                width: '100%',
                height: '30px',
                lineHeight: '30px',
                opacity: isDataIncomplete ? 1 : 0.5,
              }}
              onClick={(e) => isDataIncomplete && deleteDataDraft(e, item.REFNO)}
            >
              ลบ
            </span>
          </div>
        </Link>
      ) : status === 'FINISH' ? (
        <div className='d-flex align-items-center bg-light-success rounded p-5 mb-3 col-12'>
          <span className='text-warning me-5'>
            <KTIcon iconName='abstract-26' className='text-warning fs-1 me-5' />
          </span>
          <div className='flex-grow-1 me-2'>
            <div className='fw-bold text-gray-800 text-hover-primary fs-6'>
              {`REFNO: ${item.REFNO}`}
            </div>
            {customer}
            {product}
            {productPackage}
            {serialNumber}
            {createdAt}
            {statusTxt}
          </div>
        </div>
      ) : (
        <Link to='/contract-checker/detailChecker' state={item}>
          <div className='d-flex align-items-center bg-light-warning rounded p-5 mb-3 col-12'>
            <span className='text-warning me-5'>
              <KTIcon iconName='abstract-26' className='text-warning fs-1 me-5' />
            </span>
            <div className='flex-grow-1 me-2'>
              <div className='fw-bold text-gray-800 text-hover-primary fs-6'>
                {`REFNO: ${item.REFNO}`}
              </div>
              {customer}
              {product}
              {productPackage}
              {serialNumber}
              {createdAt}
              {statusTxt}
            </div>
          </div>
        </Link>
      )}
    </>
  );
}

export { SalesItemNumber }
