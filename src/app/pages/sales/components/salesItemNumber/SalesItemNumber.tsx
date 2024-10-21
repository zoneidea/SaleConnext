import { KTIcon } from '../../../../../_metronic/helpers'
import { Link } from 'react-router-dom'

interface StatusLabelProps {
  status: string;
  item: any
}

const SalesItemNumber: React.FC<StatusLabelProps> = ({ status, item }) => {
  // console.log(`item`, item);

  return (
    <>
      {/* begin::Item */}
      <Link to='/sale/step'>
        <div className='d-flex align-items-center bg-light-warning rounded p-5 mb-3 col-12'>
          {/* begin::Icon */}
          <span className='text-warning me-5'>
            <KTIcon iconName='abstract-26' className='text-warning fs-1 me-5' />
          </span>
          {/* end::Icon */}
          {/* begin::Title */}
          <div className='flex-grow-1 me-2'>
            <div className='fw-bold text-gray-800 text-hover-primary fs-6'>
              เลขรายการขาย
            </div>
            <span className='text-muted fw-semibold d-block'>{item.REFNO}</span>
          </div>
          {/* end::Title */}
          {/* begin::Lable */}
          <span className={`fw-bold py-1 ${status === 'FINISH' ? 'text-success' : 'text-danger'}`}>
            {status === 'FINISH' ? 'เสร็จสมบูรณ์' : 'กำลังดำเนินการ'}
          </span>
          {/* end::Lable */}
        </div>
      </Link>
      {/* end::Item */}
    </>
  )
}

export { SalesItemNumber }
