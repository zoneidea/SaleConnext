import { KTIcon } from '../../../../../_metronic/helpers'
import { Link, useNavigate } from 'react-router-dom'

interface StatusLabelProps {
  status: string;
  item: any
}

const SalesItemNumber: React.FC<StatusLabelProps> = ({ status, item }) => {
  let customer, product, productPackage, createdAt, statusTxt;
  if (item.CUSTOMERDETAIL.length > 0) {
    customer = <span className='text-gray-700 fw-semibold d-block'>{`ชื่อลูกค้า: ${item.CUSTOMERDETAIL[0].CUSTOMERNAME}`}</span>
  }

  if (item.PRODUCT.length > 0) {
    product = <span className='text-gray-700 fw-semibold d-block'>{`สินค้า: ${item.PRODUCT[0].ItemDescription}`}</span>
    if (item.PRODUCT[0].Package.length > 0) {
      productPackage = <span className='text-gray-700 fw-semibold d-block'>{`แพ็คเกจ: ${item.PRODUCT[0].Package[0].PACKAGETITLE}`}</span>
    }
  }

  if (item.CONTRACT.length > 0) {
    createdAt = <span className='text-gray-700 fw-semibold d-block'>{`วันที่ทำสัญญา: ${item.CONTRACT[0].createdAt}`}</span>
  }

  if (item.STATUS === 'DRAFT') {
    statusTxt = <span className='text-warning fw-semibold d-block'>{`ร่าง`}</span>
  } else if (item.STATUS === 'EDIT') {
    statusTxt = <span className='text-danger fw-semibold d-block'>{`แก้ไข`}</span>
  } else if (item.STATUS === 'FINISH') {
    statusTxt = <span className='text-danger fw-semibold d-block'>{`เสร็จสมบูรณ์`}</span>
  } else if (item.STATUS === 'PENDING') {
    statusTxt = <span className='text-danger fw-semibold d-block'>{`รอตรวจสอบ`}</span>
  }

  console.log(`${status} item: `, item)

  return (
    <>
      {
        status === 'DRAFT' ?
          <Link to='/sale/step' state={item} >
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
                {createdAt}
                {statusTxt}
              </div>
            </div>
          </Link>
          :
          status === 'FINISH' ?
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
                {createdAt}
                {statusTxt}
              </div>
            </div>
            :
            <Link to='/contract-checker/step' state={item} >
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
                  {createdAt}
                  {statusTxt}
                </div>
              </div>
            </Link>
      }
    </>
  )
}

export { SalesItemNumber }
