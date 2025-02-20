import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { Content } from '../../../_metronic/layout/components/content';
import { useAuth } from '../../modules/auth/core/Auth';
import { KTIcon } from '../../../_metronic/helpers'

import { useUUIDStore, useSaveProductStore } from '../../modules/stores/stepsStore';
import { useSaveDiscountStore } from '../../modules/stores/stepsStore';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import dayjs, { Dayjs } from 'dayjs';
import DatePicker from 'react-datepicker';
import DateTimePicker from 'react-datetime-picker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

interface ItemProps {
    AMOUNT: number,
    ORGANIZATIONCODE: string,
    ORGANIZATIONDESCRIPTION: string,
    ORGANIZATIONNAME: string,
    PAYDATE: string,
    PaymentType: [any]
}

const CreateSendMoney: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const MySwal = withReactContent(Swal);

    const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
    const GET_CHANNEL = `${API_SALECONNEXT}/GetSendMoney/GetChannel`;
    const GET_CHANNEL_ITEM = `${API_SALECONNEXT}/GetSendMoney/GetChannelItem`;

    const { auth } = useAuth();
    const EmpId = auth?.data?.[0]?.EmpId || '';
    const TeamSale = auth?.data?.[0]?.TeamSale || '';
    const SaleCode = auth?.data?.[0]?.SaleCode || '';
    const SupEmpId = auth?.data?.[0]?.SupEmp || '';
    const SecEmpId = auth?.data?.[0]?.SecEmp || '';

    const item = location.state as ItemProps || [];
    console.log(`item`, item);
    const amount = item.AMOUNT
    const organizationCode = item.ORGANIZATIONCODE
    const organizationDesc = item.ORGANIZATIONDESCRIPTION
    const organizationName = item.ORGANIZATIONNAME
    const payDate = item.PAYDATE
    const paymentType = item.PaymentType[0]?.PAYMENTTYPE

    const [valueCalendarPayment, setValueCalendarPayment] = useState<Date | null>(null);
    const [channelSendMoney, setChannelSendMoney] = useState<any[]>([]);
    // console.log(`channelSendMoney`, channelSendMoney);
    const [subChannelSendMoney, setSubChannelSendMoney] = useState<any[]>([]);
    console.log(`subChannelSendMoney`, subChannelSendMoney);
    const [selectedChannel, setSelectedChannel] = useState<number>();
    console.log(`selectedChannel`, selectedChannel);
    const [selectedSubChannel, setSelectedSubChannel] = useState<number>();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        getChannelSendMoney();
    }, [item, paymentType]);

    const getChannelSendMoney = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(GET_CHANNEL, { PayType: paymentType }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = Array.isArray(response.data.data) ? response.data.data : [];
            setChannelSendMoney(data);
        } catch (error) {
            console.error('Error fetching GET_CHANNEL:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // POST สาขาย่อย
    useEffect(() => {
        const getData = async () => {
            if (selectedChannel) {
                try {
                    const response = await axios.post(GET_CHANNEL_ITEM, {
                        ChannelId: selectedChannel,
                        OrganizationCode: organizationCode,
                    }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    setSubChannelSendMoney(response.data); // เซ็ตข้อมูลที่ได้รับ
                } catch (error) {
                    console.error('Error fetching sub channels:', error);
                }
            } else {
                setSubChannelSendMoney([]); // ล้างค่าถ้าไม่มีสถานที่นำส่งเงินที่เลือก
            }
        };
        getData();
    }, [selectedChannel]);

    const handleDateChangePayment = (date: Date | null) => {
        setValueCalendarPayment(date);
    };

    const handleChannelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setSelectedChannel(value);
        setSelectedSubChannel(undefined); // ล้างค่าของสาขาย่อยเมื่อเปลี่ยนสถานที่นำส่งเงิน
    };

    const handleSubChannelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setSelectedSubChannel(value);
    };

    return (
        <>
            <Content>
                <div className='d-flex justify-content-between align-items-center mb-7 mt-7 mt-lg-0'>
                    <div id="kt_page_title" data-kt-swapper="true" data-kt-swapper-mode="prepend"
                        data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
                        className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                        <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                            สร้างรายการส่งเงิน
                        </h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                            <li className="breadcrumb-item text-muted">
                                <span className="text-muted text-hover-primary">
                                    ระบบส่งเงิน
                                </span></li>
                            <li className="breadcrumb-item"><span className="bullet bg-gray-500 w-5px h-2px"></span></li>
                            <li className="breadcrumb-item text-gray-900">สร้างรายการส่งเงิน</li>
                        </ul>
                    </div>
                </div>

                {/* Card Body */}
                <form>
                    {/* Start accordion*/}
                    <div className='accordion mb-10' id='kt_accordion_1'>
                        <div className='accordion-item mb-10'>
                            <h2 className='accordion-header' id='kt_accordion_1_header_1'>
                                <h3
                                    className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                    data-bs-toggle='collapse'
                                    data-bs-target='#kt_accordion_1_body_1'
                                    aria-expanded='true'
                                    aria-controls='kt_accordion_1_body_1'
                                    style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                                >
                                    วันที่นำส่งเงิน
                                </h3>
                            </h2>
                            <div
                                id='kt_accordion_1_body_1'
                                className='accordion-collapse collapse show'
                                aria-labelledby='kt_accordion_1_header_1'
                                data-bs-parent='#kt_accordion_1'
                            >
                                <div className='accordion-body'>
                                    {/* start form */}
                                    <form className='form'>
                                        <div className='card-body px-lg-9 px-1'>

                                            <div className="container">
                                                <div className='row mb-6'>
                                                    <div className='col-lg-4 mb-3'>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <label className="form-label required fw-bold fs-6">วันที่นำส่งเงิน</label>
                                                            <DatePicker
                                                                selected={valueCalendarPayment}
                                                                onChange={handleDateChangePayment}
                                                                className="form-control mb-3 mb-lg-0"
                                                                showYearDropdown
                                                                showMonthDropdown
                                                                dropdownMode="select"
                                                                isClearable
                                                                dateFormat="yyyy/MM/dd"
                                                                withPortal
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='col-lg-4 mb-6'>
                                                        <label className='form-label fw-bold fs-6'>จำนวนเงิน</label>
                                                        <input
                                                            value={amount}
                                                            type='text'
                                                            className='form-control mb-3 mb-lg-0'
                                                            disabled={true}
                                                        />
                                                    </div>
                                                    {/* <div className='col-lg-4 mb-6'>
                                                        <label className='form-label fw-bold fs-6'>คงเหลือ</label>
                                                        <input
                                                            // value={amount}
                                                            type='text'
                                                            className='form-control mb-3 mb-lg-0'
                                                            disabled={true}
                                                        />
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    {/* end form */}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End accordion*/}

                    {/* Start accordion*/}
                    <div className='accordion mb-10' id='kt_accordion_2'>
                        <div className='accordion-item mb-10'>
                            <h2 className='accordion-header' id='kt_accordion_2_header_2'>
                                <h3
                                    className='accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7'
                                    data-bs-toggle='collapse'
                                    data-bs-target='#kt_accordion_2_body_2'
                                    aria-expanded='true'
                                    aria-controls='kt_accordion_2_body_2'
                                    style={{ color: 'white', cursor: 'pointer', backgroundColor: '#3777bc' }}
                                >
                                    สถานที่นำส่งเงิน
                                </h3>
                            </h2>
                            <div
                                id='kt_accordion_2_body_2'
                                className='accordion-collapse collapse show'
                                aria-labelledby='kt_accordion_2_header_2'
                                data-bs-parent='#kt_accordion_2'
                            >
                                <div className='accordion-body'>
                                    {/* start form */}
                                    <form className='form'>
                                        <div className='card-body px-lg-9 px-1'>

                                            <div className="container">
                                                <div className='row mb-6'>
                                                    <div className='col-lg-4 mb-3'>
                                                        <label className='form-label required fw-bold fs-6'>สถานที่นำส่งเงิน</label>
                                                        <select
                                                            className='form-select'
                                                            value={selectedChannel || ''}
                                                            onChange={handleChannelChange}
                                                        >
                                                            <option value=''>เลือกสถานที่นำส่งเงิน...</option>
                                                            {channelSendMoney.map((item, index) => (
                                                                <option key={index} value={item.CHANNELITEMID}>
                                                                    {item.CHANNELNAME}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className='col-lg-4 mb-3'>
                                                        <label className='form-label required fw-bold fs-6'>สาขาย่อย</label>
                                                        <select
                                                            className='form-select'
                                                            value={selectedSubChannel || ''}
                                                            onChange={handleSubChannelChange}
                                                        >
                                                            <option value=''>เลือกสาขาย่อย...</option>
                                                            {subChannelSendMoney.map((item, index) => (
                                                                <option key={index} value={item.SUBCHANNELID}>
                                                                    {item.SUBCHANNELNAME}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    {/* end form */}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End accordion*/}

                    {/* End Card */}

                    <div className='d-none d-xl-flex justify-content-between align-items-center my-5'>
                        <button
                            className='btn btn-secondary w-100 w-md-auto align-self-center h-50px'
                            onClick={() => navigate('/sendmoney')}>
                            ย้อนกลับ
                        </button>
                        <button
                            className={`btn btn-primary w-100 w-md-auto align-self-center h-50px`}
                        // disabled={!isDataComplete}
                        // onClick={handleCheckerClick}
                        >
                            บันทึก
                        </button>
                    </div>

                    {/* ปุ่มในหน้าจอเล็ก */}
                    <div
                        className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
                        style={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1050,
                        }}
                    >
                        <button
                            className="btn btn-secondary w-auto me-2"
                            onClick={() => navigate('/sendmoney')}
                        >
                            ย้อนกลับ
                        </button>
                        <button
                            className={`btn btn-primary w-auto`}
                        // disabled={!isDataComplete}
                        // onClick={handleCheckerClick}
                        >
                            บันทึก
                        </button>
                    </div>

                </form>
            </Content >
        </>
    )
}

export default CreateSendMoney;