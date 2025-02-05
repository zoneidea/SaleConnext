import { KTIcon } from '../../../../../_metronic/helpers'
import { Link, useNavigate } from 'react-router-dom'

interface StatusLabelProps {
  item: any
}

const OrderItemNumber: React.FC<StatusLabelProps> = ({ item }) => {
  // console.log(`item`, item);
  
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

  let bookingNo, saleEmployeeName, productName, packageName, customerName, checkerStatusName, status
  if (item.BookingNo && item.BookingNo.length > 0) {
    bookingNo = <span className='text-gray-700 fw-semibold d-block'>{`Booking No: ${item.BookingNo}`}</span>
  }

  if (item.Booking_Detail && item.Booking_Detail[0]?.SaleEmployeeName.length > 0) {
    saleEmployeeName = <span className='text-gray-700 fw-semibold d-block'>{`พนักงานขาย: ${item.Booking_Detail[0]?.SaleEmployeeName}`}</span>
  }

  if (item.Products_Detail && item.Products_Detail[0]?.ProductName.length > 0) {
    productName = <span className='text-gray-700 fw-semibold d-block'>{`สินค้า: ${item.Products_Detail[0]?.ProductName}`}</span>
  }

  if (item.PackageTitle && item.PackageTitle.length > 0) {
    packageName = <span className='text-gray-700 fw-semibold d-block'>{`แพ็คเกจ: ${item.PackageTitle}`}</span>
  }

  if (item.CustomerName && item.CustomerName.length > 0) {
    customerName = <span className='text-gray-700 fw-semibold d-block'>{`ลูกค้า: ${item.Customer_Detail[0].PrefixName} ${item.CustomerName}`}</span>
  }

  if (item.CheckerResult && item.CheckerResult.length > 0) {
    if (item.CheckerResult === 'รอดำเนินการ') {
      status = <span className='text-warning fw-semibold d-block'>{`รอตรวจสอบ`}</span>
    } else if (item.CheckerResult === 'ระหว่างดำเนินการ') {
      status = <span className='text-primary fw-semibold d-block'>{`ระหว่างตรวจสอบ`}</span>
    } else if (item.CheckerResult === 'ผ่าน') {
      status = <span className='text-success fw-semibold d-block'>{`ผ่าน`}</span>
    } else if (item.CheckerResult === 'ไม่ผ่าน') {
      status = <span className='text-danger fw-semibold d-block'>{`ไม่ผ่าน`}</span>
    } else if (item.CheckerResult === 'ยกเลิก') {
      status = <span className='text-danger fw-semibold d-block'>{`ยกเลิก`}</span>
    }
  }

  return (
    <>
      <Link to='/order-admin/detailCheckerAdmin' state={item} >
        <div className='d-flex align-items-center bg-light-warning rounded p-5 mb-3 col-12'>
          <span className='text-warning me-5'>
            <KTIcon iconName='abstract-26' className='text-warning fs-1 me-5' />
          </span>
          <div className='flex-grow-1 me-2'>
            <div className='fw-bold text-gray-800 fs-6'>
              {`Booking No: ${item.BookingNo}`}
            </div>
            <div className='fw-bold text-danger'>
              {item.CheckerStatusName ? `สถานะ: ${item.CheckerStatusName}` : ""}
            </div>
            {saleEmployeeName}
            {productName}
            {packageName}
            {customerName}
            {checkerStatusName}
            {status}
          </div>
        </div>
      </Link>
    </>
  )
}

export { OrderItemNumber }