import { KTIcon } from '../../../../../_metronic/helpers'
import { Link, useNavigate } from 'react-router-dom'

interface StatusLabelProps {
    item: any
}

const FirstBillItemNumber: React.FC<StatusLabelProps> = ({ item }) => {
    console.log(`item`, item);

    let customer, telNo, product, productPackage, serialNumber, createdAt, statusTxt, dueDate;

    if (item.CUSTOMERDETAIL.length > 0) {
        if (item.CUSTOMERDETAIL[0].CUSTOMERTYPE == 1) {
            customer = <span className='text-gray-700 fw-semibold d-block'>{`ชื่อบริษัท: ${item.CUSTOMERDETAIL[0].CUSTOMERNAME}`}</span>
            telNo = <span className='text-gray-700 fw-semibold d-block'>{`เบอร์โทร: ${item.CUSTOMERDETAIL[0].CUSTOMERMOBILE}`}</span>
        } else {
            customer = <span className='text-gray-700 fw-semibold d-block'>{`ชื่อลูกค้า: ${item.CUSTOMERDETAIL[0].CUSTOMERNAME}`}</span>
            telNo = <span className='text-gray-700 fw-semibold d-block'>{`เบอร์โทร: ${item.CUSTOMERDETAIL[0].CUSTOMERMOBILE}`}</span>
        }
    }

    if (item.PRODUCT.length > 0) {
        product = <span className='text-gray-700 fw-semibold d-block'>{`สินค้า: ${item.PRODUCT[0].ItemDescription}`}</span>
        serialNumber = <span className='text-gray-700 fw-semibold d-block'>{`Serial Number: ${item.PRODUCT[0].SerialNo}`}</span>
        if (item.PRODUCT[0].Package.length > 0) {
            productPackage = <span className='text-gray-700 fw-semibold d-block'>{`แพ็คเกจ: ${item.PRODUCT[0].Package[0].PACKAGETITLE}`}</span>
        }
    }

    // if (item.CONTRACT.length > 0) {
    //     createdAt = <span className='text-gray-700 fw-semibold d-block'>{`วันที่ทำสัญญา: ${item.CONTRACT[0].createdAt}`}</span>
    // }

    if (item.STATUS === 'DRAFT') {
        statusTxt = <span className='text-warning fw-semibold d-block'>{`ร่าง`}</span>
    } else if (item.STATUS === 'EDIT') {
        statusTxt = <span className='text-danger fw-semibold d-block'>{`แก้ไข`}</span>
    } else if (item.STATUS === 'FINISH') {
        statusTxt = <span className='text-danger fw-semibold d-block'>{`รอชำระเงิน`}</span>
    } else if (item.STATUS === 'PENDING') {
        statusTxt = <span className='text-danger fw-semibold d-block'>{`รอตรวจสอบ`}</span>
    }

    console.log(`item: `, item)

    return (
        <>
            <Link to='/firstBill/CreateFirstBill' state={item} >
                <div className='d-flex align-items-center bg-light-success rounded p-5 mb-3 col-12'>
                    <span className='text-warning me-5'>
                        <KTIcon iconName='abstract-26' className='text-warning fs-1 me-5' />
                    </span>
                    <div className='flex-grow-1 me-2'>
                        <div className='fw-bold text-gray-800 text-hover-primary fs-6'>
                            {`REFNO: ${item.REFNO}`}
                        </div>
                        {customer}
                        {telNo}
                        {product}
                        {productPackage}
                        {serialNumber}
                        {createdAt}
                        {statusTxt}
                    </div>
                </div>
            </Link>
        </>
    )
}

export { FirstBillItemNumber }