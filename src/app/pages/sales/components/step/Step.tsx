import { Link, useLocation } from 'react-router-dom'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Content } from '../../../../../_metronic/layout/components/content'


interface ItemProps {
  REFNO: String,
  EMPID: String,
  TEAMSALE: String,
  SALECODE: String,
  SUPEMPID: String,
  SECEMPID: String,
  STATUS: String,
  PRODUCT: [],
  CUSTOMERSTATUS: [],
  DISCOUNT: [],
  CUSTOMERDETAIL: [],
  ADDRESS: [],
  PDPA: [],
  CONTRACT: [],
  IMAGE: []
}

const Step: React.FC = () => {
  const location = useLocation();
  const item = location.state as ItemProps || [];

  const [data, setData] = useState<any[]>([])
  const [product, setProduct] = useState<any[]>([])

  const API_URL_UPDATE_CONTRACT = import.meta.env.VITE_APP_API_MONGO;
  const GET_CONTRACT_URL = `${API_URL_UPDATE_CONTRACT}/Contract/GetContractSummary`;

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(GET_CONTRACT_URL + '?refno=' + item?.REFNO, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        // product = data?.[0]?.PRODUCT || []
        // console.log('product', product)
        setData(data);
        setProduct(data?.[0]?.PRODUCT)
      } catch (error) {
        console.error('Error fetching DRAFT_ALLCONTRACT_URL:', error);
      }
    };
    getData();
  }, []);

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
          <div className='card-body d-flex align-items-center py-5 pt-12'>
            <div className='col-12'>
              <Link to=''>
                <div className='d-flex align-items-center pb-8'>
                  <span className={`bullet bullet-vertical h-40px ${product?.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'></div>
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                      {`1. เลือกแพ็คเกจ`}
                    </div>
                    {
                      product?.length !== 0 && (
                        <span className='text-muted fw-semibold d-block'>{`สินค้า: ${product?.[0]?.ItemDescription}`}</span>
                      )
                    }
                    {
                      product?.length ?
                        product?.[0]?.Package.length && (
                          <span className='text-muted fw-semibold d-block'>{`แพ็คเกจ: ${product?.[0]?.Package[0]?.PACKAGETITLE}`}</span>
                        )
                        :
                        null
                    }

                  </div>
                </div>
              </Link>
              {/* <Link to=''>
                <div className='d-flex align-items-center pb-8'>
                  <span className={`bullet bullet-vertical h-40px ${item?.CUSTOMERSTATUS.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'></div>
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                      {`2. ตรวจสอบข้อมูลลูกค้า`}
                    </div>
                    <span className='text-muted fw-semibold d-block'>ตรวจสอบข้อมูลลูกค้า</span>
                  </div>
                </div>
              </Link> */}
              {/* <Link to=''>
                <div className='d-flex align-items-center pb-8'>
                  <span className={`bullet bullet-vertical h-40px ${item?.DISCOUNT.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'> </div>
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                      {`3. ส่วนลด/เครื่องเทิร์น/ของแถม`}
                    </div>
                    <span className='text-muted fw-semibold d-block'>ตรวจสอบข้อมูลลูกค้า</span>
                  </div>
                </div>
              </Link> */}
              {/* <Link to=''>
                <div className='d-flex align-items-center pb-8'>
                  <span className={`bullet bullet-vertical h-40px ${item?.CUSTOMERDETAIL.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'></div>
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                      {`4. บันทึกข้อมูลลูกค้า`}
                    </div>
                    <span className='text-muted fw-semibold d-block'>ตรวจสอบข้อมูลลูกค้า</span>
                  </div>
                </div>
              </Link> */}
              {/* <Link to=''>
                <div className='d-flex align-items-center pb-8'>
                  <span className={`bullet bullet-vertical h-40px ${item?.ADDRESS.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'></div>
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                      {`5. บันทึกที่อยู่ลูกค้า`}
                    </div>
                    <span className='text-muted fw-semibold d-block'>ตรวจสอบข้อมูลลูกค้า</span>
                  </div>
                </div>
              </Link> */}
              {/* <Link to=''>
                <div className='d-flex align-items-center pb-8'>
                  <span className={`bullet bullet-vertical h-40px ${item?.PDPA.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'></div>
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                      {`6. PDPA`}
                    </div>
                    <span className='text-muted fw-semibold d-block'>ตรวจสอบข้อมูลลูกค้า</span>
                  </div>
                </div>
              </Link> */}
              {/* <Link to=''>
                <div className='d-flex align-items-center pb-8'>
                  <span className={`bullet bullet-vertical h-40px ${item?.CONTRACT.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'></div>
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                      {`7. รายละเอียดสัญญา`}
                    </div>
                    <span className='text-muted fw-semibold d-block'>ตรวจสอบข้อมูลลูกค้า</span>
                  </div>
                </div>
              </Link> */}
              {/* <Link to=''>
                <div className='d-flex align-items-center pb-8'>
                  <span className={`bullet bullet-vertical h-40px ${item?.IMAGE.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                  <div className='form-check form-check-custom form-check-solid mx-5'></div>
                  <div className='flex-grow-1'>
                    <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                      {`8. ถ่ายรูป`}
                    </div>
                    <span className='text-muted fw-semibold d-block'>ตรวจสอบข้อมูลลูกค้า</span>
                  </div>
                </div>
              </Link> */}
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
