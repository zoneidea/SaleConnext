import { KTIcon } from '../../../../_metronic/helpers'
import { Link, useNavigate } from 'react-router-dom'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'

interface StatusLabelProps {
  status: string;
  item: any;
  onDelete: () => void; //Callback สำหรับแจ้งการลบสำเร็จ
}

const SendMoneyItemNumber: React.FC<StatusLabelProps> = ({ status, item, onDelete }) => {
  console.log(`item`, item);

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

  let amount, organizationCode, organizationDesc, organizationName, payDate, statusTxt
  if (item) {
    amount = item.AMOUNT
    organizationCode = <span className='text-gray-700 fw-semibold d-block'>{`รหัสบริษัท: ${item.ORGANIZATIONCODE}`}</span>
    organizationDesc = <span className='text-gray-700 fw-semibold d-block'>{`ชื่อบริษัท: ${item.ORGANIZATIONDESCRIPTION}`}</span>
    organizationName = <span className='text-gray-700 fw-semibold d-block'>{`ชื่อย่อบริษัท: ${item.ORGANIZATIONNAME}`}</span>
    payDate = <span className='text-gray-700 fw-semibold d-block'>{`วันที่ลูกค้าจ่ายเงิน: ${item.PAYDATE}`}</span>
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
        <Link to='/sendmoney/CreateSendMoney' state={item}>
          <div className='d-flex flex-column flex-md-row align-items-center bg-light-warning rounded p-5 mb-3 col-12'>
            <span className='text-warning me-5 d-none d-md-inline'>
              <KTIcon iconName='abstract-26' className='text-warning fs-1 me-5' />
            </span>

            <div className='flex-grow-1 me-2'>
              <div className='fw-bold text-gray-800 text-hover-primary fs-6'>
                {`ยอดที่ต้องนำส่ง: ${amount} บาท`}
              </div>
              {organizationCode}
              {organizationDesc}
              {organizationName}
              {payDate}
            </div>
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
            {amount}
            {organizationCode}
            {organizationDesc}
            {payDate}
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
              {amount}
              {organizationCode}
              {organizationDesc}
              {payDate}
            </div>
          </div>
        </Link>
      )}
    </>
  );
}

export { SendMoneyItemNumber }