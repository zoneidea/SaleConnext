import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../modules/auth/core/Auth';
import { Content } from '../../../../../_metronic/layout/components/content'

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { ThreeDot } from 'react-loading-indicators';

//useStore
import {
  useCategoryStore
} from '../../../../modules/stores/sales/packageStore/packageStore';

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
  const MySwal = withReactContent(Swal);
  const location = useLocation();
  const navigate = useNavigate()
  const item = location.state as ItemProps || [];
  const [data, setData] = useState<any[]>([])
  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const GET_CONTRACT_URL = `${API_URL_MONGO}/Contract/GetContractSummary`;
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;

  const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
  const API_URL_POST_CONDITIONSCHECKHISTORY = `${API_SALECONNEXT}/ConditionsCheckHistory`;

  const API_URL_POST_CHECKCUSTOMER = import.meta.env.VITE_APP_API_THIENSURAT;
  const CHECKCUSTOMER_URL = `${API_URL_POST_CHECKCUSTOMER}/CheckCustomer`;

  const { auth } = useAuth();

  const {
    EmpId, setEmpId,
    TeamSale, setTeamSale,
    SaleCode, setSaleCode,
    SupEmpId, setSupEmpId,
    SecEmpId, setSecEmpId,
    DivisionId, setDivisionId,
    DepartId, setDepartId,
    DepartGroup, setDepartGroup,
  } = useCategoryStore();

  const [isLoadingFinish, setIsLoadingFinish] = useState<boolean>(false);

  const getData = async () => {
    setIsLoadingFinish(true);
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
    } finally {
      setIsLoadingFinish(false);
    }
  };

  useEffect(() => {
    getData();
    setEmpId(auth.data[0].EmpId);
    setTeamSale(auth.data[0].TeamSale);
    setSaleCode(auth.data[0].SaleCode);
    setSupEmpId(auth.data[0].SupEmp);
    setSecEmpId(auth.data[0].SecEmp);
    setDivisionId(auth.data[0].DivisionId);
    setDepartId(auth.data[0].DepartId);
    setDepartGroup(auth.data[0].DepartGroup);
  }, [location]);

  useEffect(() => {
    if (data?.[0]?.PRODUCT?.length > 0) {
      setToPackage('../sale/update/updateSalePackage')
      setToPhoto('../sale/photo')
      setToDiscount('../sale/update/updateSaleDiscount')
    }

    if (data?.[0]?.DISCOUNT?.length > 0) {
      setToDiscount('../sale/update/updateSaleDiscount')
      setToCustDetail('../sale/update/updateCustDetail')
    }

    if (data?.[0]?.CUSTOMERDETAIL?.length > 0) {
      setToCustDetail('../sale/update/updateCustDetail')
      setToAddress('../sale/update/updateAddress')
    }

    if (data?.[0]?.ADDRESS?.length > 0) {
      setToAddress('../sale/update/updateAddress')
      setToPDPA('../sale/update/UpdateSalesPDPA')
    }

    if (data?.[0]?.PDPA?.length > 0) {
      setToPDPA('../sale/update/UpdateSalesPDPA')
      setToContract('../sale/update/UpdateSalesContract')
    }

    if (data?.[0]?.PDPA?.length > 0) {
      setToContract('../sale/update/UpdateSalesContract')
      setToPhoto('../sale/photo')
    }
  }, [data, location]);

  const [toPackage, setToPackage] = useState('')
  const [toDiscount, setToDiscount] = useState('')
  const [toCustDetail, setToCustDetail] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [toPDPA, setToPDPA] = useState('')
  const [toContract, setToContract] = useState('')
  const [toPhoto, setToPhoto] = useState('')
  const handleClick = (routeName: any) => {

    if (routeName === 'updateSalePackage') {
      setToPackage('../sale/update/updateSalePackage')
    } else if (routeName === 'updateSaleDiscount') {
      if (data?.[0]?.CUSTOMERSTATU?.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'กรุณาตรวจสอบสถานะลูกค้าก่อน',
          confirmButtonText: 'ตกลง'
        });
      } else if (data?.[0]?.PRODUCT?.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'กรุณาบันทึกข้อมูลสินค้าและแพ็คเกจสินค้าก่อน',
          confirmButtonText: 'ตกลง'
        });
      } else {
        setToDiscount('../sale/update/updateSaleDiscount')
      }
    } else if (routeName === 'updateCustDetail') {
      if (data?.[0]?.DISCOUNT?.length === 0 && data?.[0]?.PRODUCT?.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'กรุณาบันทึกข้อมูลสินค้าและตรวจสอบสถานะลูกค้า',
          confirmButtonText: 'ตกลง'
        });
      } else if (data?.[0]?.DISCOUNT?.length === 0 && data?.[0]?.PRODUCT?.length !== 0) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'กรุณาบันทึกข้อมูลส่วนลด/เครื่องเทิร์น/ของแถม',
          confirmButtonText: 'ตกลง'
        });
      } else {
        setToCustDetail('../sale/update/updateCustDetail')
      }
    } else if (routeName === 'updateAddress') {
      if (data?.[0]?.CUSTOMERDETAIL?.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'กรุณาบันทึกข้อมูลลูกค้าก่อน',
          confirmButtonText: 'ตกลง'
        });
      } else {
        setToAddress('../sale/update/updateAddress')
      }
    } else if (routeName === 'UpdateSalesPDPA') {
      if (data?.[0]?.ADDRESS?.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'กรุณาบันทึกข้อมูลที่อยู่ก่อน',
          confirmButtonText: 'ตกลง'
        });
      } else {
        setToPDPA('../sale/update/UpdateSalesPDPA')
      }
    } else if (routeName === 'UpdateSalesContract') {
      if (data?.[0]?.PRODUCT?.length === 0 || data?.[0]?.CUSTOMERSTATUS?.length === 0 || data?.[0]?.DISCOUNT?.length === 0 ||
        data?.[0]?.CUSTOMERDETAIL?.length === 0 || data?.[0]?.ADDRESS?.length === 0 || data?.[0]?.PDPA?.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'กรุณาบันทึกข้อมูลให้ครบทุกส่วน',
          confirmButtonText: 'ตกลง'
        });
      } else {
        setToContract('../sale/update/UpdateSalesContract')
      }
    } else if (routeName === 'photo') {
      if (data?.[0]?.PRODUCT?.length === 0 || data?.[0]?.CUSTOMERSTATUS?.length === 0 || data?.[0]?.DISCOUNT?.length === 0 ||
        data?.[0]?.CUSTOMERDETAIL?.length === 0 || data?.[0]?.ADDRESS?.length === 0 || data?.[0]?.PDPA?.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'กรุณาบันทึกข้อมูลให้ครบทุกส่วน',
          confirmButtonText: 'ตกลง'
        });
      } else {
        navigate('../sale/photo', { state: { fromStep: true, data: data?.[0] } });
      }
    } else {
      setToPackage('')
      setToDiscount('')
      setToCustDetail('')
      setToAddress('')
      setToPDPA('')
      setToContract('')
      setToPhoto('')
    }
  }

  const handleCheckCustStatus = async () => {
    const Model = data?.[0]?.PRODUCT?.[0]?.Package.MODEL
    const conditionCheckResponse = await axios.post(API_URL_POST_CONDITIONSCHECKHISTORY, {
      EmpId, DivisionId, DepartId, DepartGroup, TeamSale, Model
    }, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    let updateData;

    if (conditionCheckResponse.data.checktype !== 0) {
      const { value: idCard } = await MySwal.fire({
        title: 'ตรวจสอบประวัติลูกค้า',
        html: `
              <input 
                  id="idCardInput" 
                  type="text" 
                  class="form-control" 
                  placeholder="กรุณากรอกเลขบัตรประชาชน (13 หลัก)" 
                  maxlength="13"
                  oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0,13);" 
              />
          `,
        showCancelButton: true,
        confirmButtonText: 'ตรวจสอบ',
        cancelButtonText: 'ยกเลิก',
        preConfirm: async () => {
          const input = (document.getElementById('idCardInput') as HTMLInputElement).value;
          if (input.length === 13) {
            return input;
          } else {
            MySwal.showValidationMessage('กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก');
            return null;
          }
        }
      });

      if (idCard) {
        const apiResponse = await axios.post(CHECKCUSTOMER_URL, { Search: idCard }, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const { Customerstatus, message } = apiResponse.data;
        const destination = Customerstatus ? '/sale/overview' : '/sale/discount';

        await MySwal.fire({
          text: message,
          icon: Customerstatus ? 'success' : 'success',
          confirmButtonText: 'ตกลง'
        });

        updateData = [idCard, conditionCheckResponse.data.checktype, message];
      }
    } else {
      updateData = ["", conditionCheckResponse.data.checktype, conditionCheckResponse.data.message];
    }

    try {
      const updateContract = await axios.post(UPDATECONTACT, {
        REFNO: item.REFNO,
        EMPID: EmpId,
        TEAMSALE: TeamSale,
        FIELD: "CUSTOMERSTATUS",
        DATA: updateData,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(`updateContract CUSTOMERSTATUS: `, updateContract.data);
      getData();
    } catch (error) {
      console.error('Error updating contract:', error);
      MySwal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตข้อมูลได้', 'error');
    }
  }

  // console.log(`test`, data?.[0]?.PDPA);

  return (
    <>
      <Content>
        <div className='d-flex justify-content-between align-items-center mb-7 mt-7 mt-lg-0'>
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

        {isLoadingFinish ? (
          <div className="text-center my-10">
            <ThreeDot />
          </div>
        ) : data.length > 0 && (
          <>
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
                  <Link to={toPackage} state={data?.[0]} onClick={() => handleClick('updateSalePackage')}>
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
                  {/* <Link onClick={handleCheckCustStatus} to={''}> */}
                  <a onClick={handleCheckCustStatus} style={{ cursor: 'pointer' }}>
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
                  </a>
                  {/* </Link> */}
                  <Link to={toDiscount} state={data?.[0]} onClick={() => handleClick('updateSaleDiscount')}>
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
                  <Link to={toCustDetail} state={data?.[0]} onClick={() => handleClick('updateCustDetail')}>
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
                  <Link to={toAddress} state={data?.[0]} onClick={() => handleClick('updateAddress')}>
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
                  <Link to={toPDPA} state={data?.[0]} onClick={() => handleClick('UpdateSalesPDPA')}>
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
                  <Link to={toContract} state={data?.[0]} onClick={() => handleClick('UpdateSalesContract')}>
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data?.[0]?.CONTRACT.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                          {`7. รายละเอียดสัญญา`}
                        </div>
                        {
                          data?.[0]?.CONTRACT?.length !== 0 && (
                            <span className='text-gray-700 fw-semibold d-block'>{`วันที่ทำสัญญา: ${data?.[0]?.CONTRACT?.[0]?.createdAt ? `` : ``}`}</span>
                          )
                        }
                      </div>
                    </div>
                  </Link>
                  {/* <Link to={toContract} state={data?.[0]} onClick={() => handleClick('photo')}>
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data?.[0]?.IMAGE.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                          {`8. ถ่ายรูป`}
                        </div>
                        {
                          data?.[0]?.IMAGE?.length !== 0 && (
                            <span className='text-gray-700 fw-semibold d-block'>{`วันที่ทำสัญญา: ${data?.[0]?.IMAGE?.[0]?.createdAt ? `` : ``}`}</span>
                          )
                        }
                      </div>
                    </div>
                  </Link> */}
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'inherit',
                      cursor: 'pointer',
                      fontSize: 'inherit',
                    }}
                    onClick={() => handleClick('photo')}
                    type='button'
                  >
                    <div className='d-flex align-items-center pb-8'>
                      <span className={`bullet bullet-vertical h-40px ${data?.[0]?.IMAGE.length === 0 ? 'bg-danger' : 'bg-success'} `}></span>
                      <div className='form-check form-check-custom form-check-solid mx-5'></div>
                      <div className='flex-grow-1'>
                        <div className='text-gray-800 text-hover-primary fw-bold fs-2'>
                          {`8. ถ่ายรูป`}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* End Card Body */}

            <div className='d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10'>
              <Link to='/sale/overview' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                ย้อนกลับ
              </Link>
            </div>

            {/* ปุ่มในหน้าจอเล็ก */}
            <div
              className="d-flex d-xl-none justify-content-start align-items-center bg-light p-3 border-top"
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1050,
              }}
            >
              <Link to='/sale/overview' className='btn btn-secondary align-self-center mb-2 mb-md-0'>
                ย้อนกลับ
              </Link>
            </div>

          </>
        )}
      </Content>
    </>
  )
}

export default Step
