import { Link, useLocation } from 'react-router-dom'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Content } from '../../../../../_metronic/layout/components/content'


interface ItemProps {
  REFNO: String,
  CONTNO: String,
  EMPID: String,
  TEAMSALE: String,
  SALECODE: String,
  SUPEMPID: String,
  SECEMPID: String,
  STATUS: String,
  PRODUCT: [any],
  CUSTOMERSTATUS: [any],
  DISCOUNT: [any],
  CUSTOMERDETAIL: [any],
  ADDRESS: [any],
  PDPA: [any],
  CONTRACT: [any],
  IMAGE: [any],
  CHECKERCOMMENT: [any]
}

const Step: React.FC = () => {
  const location = useLocation();
  const item = location.state as ItemProps || [];
  const [data, setData] = useState<any[]>([])
  const API_URL_UPDATE_CONTRACT = import.meta.env.VITE_APP_API_MONGO;
  const GET_CONTRACT_URL = `${API_URL_UPDATE_CONTRACT}/Contract/GetContractSummary`;

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(GET_CONTRACT_URL + '?refno=' + item.REFNO, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        setData(data);
        console.log('Load data', data)
      } catch (error) {
        console.error('Error fetching DRAFT_ALLCONTRACT_URL:', error);
      }
    };
    getData();
  }, [location]);

  return (
    <>
      <Content>
        <div className='d-flex justify-content-between align-items-center mb-7 mt-1 mt-lg-0'>
          <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
            data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
            className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
            <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
              ขั้นตอนการดำเนินการ
            </h1>
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
              <li className="breadcrumb-item text-muted">
                <a className="text-muted text-hover-primary" href="/metronic8/react/demo1/sales/overview">
                  ระบบขาย
                </a></li>
              <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
              <li className="breadcrumb-item text-gray-900">ขั้นตอนการดำเนินการ</li>
            </ul>
          </div>
        </div>

        {/* Card Body */}
        <div className='card mb-10'>
          <div className='card-body d-flex align-items-center'>
            <div className='flex-grow-1'>
              <div className='text-gray-800 text-hover-primary fw-bold fs-4'>
                {`REFNO: ${item?.REFNO}`}
              </div>
              <span className={`${data?.[0]?.STATUS === 'DRAFT' ? 'text-warning' : 'text-danger'} fw-semibold d-block fs-6`}>{`สถานะ: ${data?.[0]?.STATUS === 'DRAFT' ? 'ยังไม่ได้ตรวจสอบ' : 'แก้ไข'}`}</span>
              {
                data?.[0]?.CHECKKERCOMMENT?.COMMENT && (
                  <span className={`text-danger fw-semibold d-block fs-6`}>{`คอมเม้นท์: ${data?.[0]?.CHECKKERCOMMENT?.[0]?.COMMENT}`}</span>
                )
              }
            </div>
          </div>
          <div className='card-body d-flex align-items-center py-5 pt-6'>
            <div className='col-12'>
              <Link to='../sale/update/updateSalePackage' state={data?.[0]}>
                <div className='d-flex align-items-center pb-8'>
                  <span className={`bullet bullet-vertical h-40px ${data?.[0]?.PRODUCT?.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'></div>
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                      {`1. เลือกแพ็คเกจ`}
                    </div>
                    {
                      data?.[0]?.PRODUCT?.length !== 0 && (
                        <span className='text-gray-700 fw-semibold d-block'>{`สินค้า: ${data?.[0]?.PRODUCT?.[0]?.ItemDescription}`}</span>
                      )
                    }
                    {
                      data?.[0]?.PRODUCT?.length &&
                      data?.[0]?.PRODUCT?.[0]?.Package.length && (
                        <span className='text-gray-700 fw-semibold d-block'>{`แพ็คเกจ: ${data?.[0]?.PRODUCT?.[0]?.Package[0]?.PACKAGETITLE}`}</span>
                      )
                    }
                  </div>
                </div>
              </Link>
              {/* <Link to=''> */}
              <div className='d-flex align-items-center pb-8'>
                <span className={`bullet bullet-vertical h-40px ${data?.[0]?.CUSTOMERSTATUS.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                <div className='form-check form-check-custom form-check-solid mx-5'></div>
                <div className='flex-grow-1'>
                  <div className='text-gray-800 fw-bold fs-2'>
                    {`2. ตรวจสอบข้อมูลลูกค้า`}
                  </div>
                  {
                    data?.[0]?.CUSTOMERSTATUS?.length !== 0 && (
                      <span className='text-gray-700 fw-semibold d-block'>{`สถานะ: ${data?.[0]?.CUSTOMERSTATUS?.[2]}`}</span>
                    )
                  }
                </div>
              </div>
              {/* </Link> */}
              <Link to='../sale/update/updateSaleDiscount' state={data?.[0]}>
                <div className='d-flex align-items-center pb-8'>
                  <span className={`bullet bullet-vertical h-40px ${data?.[0]?.DISCOUNT.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'> </div>
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                      {`3. ส่วนลด/เครื่องเทิร์น/ของแถม`}
                    </div>
                    {
                      data?.[0]?.DISCOUNT?.length !== 0 && (
                        <span className='text-gray-700 fw-semibold d-block'>{`${data?.[0]?.DISCOUNT?.[0]?.TRADEIN?.HASTRADEIN === 0 ? 'ไม่มีเครื่องเทิร์น' : 'มีเครื่องเทิร์น'}`}</span>
                      )
                    }
                    {
                      data?.[0]?.DISCOUNT?.[0]?.TRADEIN?.HASTRADEIN === 1 && (
                        <span className='text-gray-700 fw-semibold d-block'>{`แบรนด์: ${data?.[0]?.DISCOUNT?.[0]?.TRADEIN?.TRADEINBRANDNAME} รุ่น: ${data?.[0]?.DISCOUNT?.[0]?.TRADEIN?.TRADEINMODEL}`}</span>
                      )
                    }
                  </div>
                </div>
              </Link>
              <Link to='../sale/update/updateCustDetail' state={data?.[0]}>
                <div className='d-flex align-items-center pb-8'>
                  <span className={`bullet bullet-vertical h-40px ${data?.[0]?.CUSTOMERDETAIL.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'></div>
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                      {`4. บันทึกข้อมูลลูกค้า`}
                    </div>
                    {
                      data?.[0]?.CUSTOMERDETAIL?.length !== 0 && (
                        <span className='text-gray-700 fw-semibold d-block'>{`ปะเภทลูกค้า: ${data?.[0]?.CUSTOMERDETAIL?.[0]?.CUSTOMERTYPENAME}`}</span>
                      )
                    }
                    {
                      data?.[0]?.CUSTOMERDETAIL?.length !== 0 && (
                        data?.[0]?.CUSTOMERDETAIL?.CUSTOMERTYPE === 1 ?
                          <span className='text-gray-700 fw-semibold d-block'>{`ชื่อบริษัท: ${data?.[0]?.CUSTOMERDETAIL?.[0]?.CUSTOMERNAME}`}</span>
                          :
                          <span className='text-gray-700 fw-semibold d-block'>{`ชื่อลูกค้า: ${data?.[0]?.CUSTOMERDETAIL?.[0]?.CUSTOMERNAME}`}</span>
                      )
                    }
                  </div>
                </div>
              </Link>
              <Link to='../sale/update/updateAddress' state={data?.[0]}>
                <div className='d-flex align-items-center pb-8'>
                  <span className={`bullet bullet-vertical h-40px ${data?.[0]?.ADDRESS.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'></div>
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                      {`5. บันทึกที่อยู่ลูกค้า`}
                    </div>
                    {
                      data?.[0]?.ADDRESS?.length !== 0 && (
                        <span className='text-gray-700 fw-semibold d-block'>{`ที่อยู่ตามบัตรฯ: ${data?.[0]?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSSUBDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSZIPCODE}`}</span>
                      )
                    }
                    {
                      data?.[0]?.ADDRESS?.length !== 0 && (
                        <span className='text-gray-700 fw-semibold d-block'>{`ที่อยู่ติดตั้ง: ${data?.[0]?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE}`}</span>
                      )
                    }
                    {
                      data?.[0]?.ADDRESS?.length !== 0 && (
                        <span className='text-gray-700 fw-semibold d-block'>{`ที่อยู่เก็บเงิน: ${data?.[0]?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSDISTRICTNAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME} ${data?.[0]?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE}`}</span>
                      )
                    }
                  </div>
                </div>
              </Link>
              <Link to='../sale/update/UpdateSalesPDPA' state={data?.[0]}>
                <div className='d-flex align-items-center pb-8'>
                  <span className={`bullet bullet-vertical h-40px ${data?.[0]?.PDPA.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'></div>
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                      {`6. PDPA`}
                    </div>
                    {
                      data?.[0]?.PDPA?.length !== 0 && (
                        <span className='text-gray-700 fw-semibold d-block'>{`การยืนยอมให้ใช้ข้อมูล: ${data?.[0]?.PDPA?.[0].CONSENTGIVEN ? 'ยินยอม' : 'ไม่ยินยอม'}`}</span>
                      )
                    }
                  </div>
                </div>
              </Link>
              <Link to='../sale/update/UpdateSalesContract' state={data?.[0]}>
                <div className='d-flex align-items-center pb-8'>
                  <span className={`bullet bullet-vertical h-40px ${data?.[0]?.CONTRACT.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'></div>
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                      {`7. รายละเอียดสัญญา`}
                    </div>
                    {
                      data?.[0]?.CONTRACT?.length !== 0 && (
                        <span className='text-gray-700 fw-semibold d-block'>{`วันที่ทำสัญญา: ${data?.[0]?.CONTRACT?.[0]?.createdAt}`}</span>
                      )
                    }
                  </div>
                </div>
              </Link>
              {/* <Link to='../sale/photo' state={data?.[0]}>
                <div className='d-flex align-items-center pb-8'>
                  <span className={`bullet bullet-vertical h-40px ${data?.[0]?.IMAGE.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'></div>
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                      {`8. ถ่ายรูป`}
                    </div>
                  </div>
                </div>
              </Link> */}
              <Link to='../sale/photo' state={{ fromStep: true, data: data?.[0] }}>
                <div className='d-flex align-items-center pb-8'>
                  <span className={`bullet bullet-vertical h-40px ${data?.[0]?.IMAGE.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'></div>
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                      {`8. ถ่ายรูป`}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        {/* End Card Body */}

        <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
          <Link to='/sale/overview' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
            ย้อนกลับ
          </Link>
        </div>

      </Content>
    </>
  )
}

export default Step
