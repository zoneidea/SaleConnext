import { KTIcon } from '../../../../../_metronic/helpers'
import { Link, useNavigate } from 'react-router-dom'

interface StatusLabelProps {
  status: string;
  item: any
}

const SalesItemNumber: React.FC<StatusLabelProps> = ({ status, item }) => {
  const navigate = useNavigate();
  // console.log(`item`, item);
  let customer, product, productPackage;
  if (item.CUSTOMERDETAIL.length > 0) {
    customer = <span className='text-gray-600 fw-semibold d-block'>{`ชื่อลูกค้า: ${item.CUSTOMERDETAIL[0].CUSTOMERNAME}`}</span>
  }

  if (item.PRODUCT.length > 0) {
    product = <span className='text-gray-600 fw-semibold d-block'>{`สินค้า: ${item.PRODUCT[0].ItemDescription}`}</span>
    if (item.PRODUCT[0].Package.length > 0) {
      productPackage = <span className='text-gray-600 fw-semibold d-block'>{`แพ็คเกจ: ${item.PRODUCT[0].Package[0].PACKAGETITLE}`}</span>
    }
  }

  return (
    <>
      {/* begin::Item */}
      <Link to='/sale/step' state={ item } >
        <div className='d-flex align-items-center bg-light-warning rounded p-5 mb-3 col-12'>
          {/* begin::Icon */}
          <span className='text-warning me-5'>
            <KTIcon iconName='abstract-26' className='text-warning fs-1 me-5' />
          </span>
          {/* end::Icon */}
          {/* begin::Title */}
          <div className='flex-grow-1 me-2'>
            <div className='fw-bold text-gray-800 text-hover-primary fs-6'>
              {`REFNO: ${item.REFNO}`}
            </div>
            {/* <span className='text-muted fw-semibold d-block'>{item.REFNO}</span> */}
            {customer}
            {product}
            {productPackage}
          </div>
          {/* end::Title */}
          {/* begin::Lable */}
          {/* <span className={`fw-bold py-1 ${status === 'FINISH' ? 'text-success' : item.STATUS === 'DRAFT' ? 'text-danger' : 'text-warning'}`}> */}
            {/* {status === 'FINISH' ? 'เสร็จสมบูรณ์' : 'กำลังดำเนินการ'} */}
            {/* {
              item.STATUS === 'DRAFT' ?
                'กำลังดำเนินการ'
                :
                item.STATUS === 'EDIT' ?
                  'แก้ไข'
                  :
                  'เสร็จสมบูรณ์'
            }
          </span> */}
          {/* end::Lable */}
        </div>
      </Link>
      {/* end::Item */}
    </>
  )
}

export { SalesItemNumber }
