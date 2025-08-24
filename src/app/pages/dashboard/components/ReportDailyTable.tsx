import styles from "@/styles/style.module.css";
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import { useAuth } from '../../../modules/auth/core/Auth'

type Props = {
    className?: string
    showTitle?: boolean
    defaultStartDate?: string
    defaultEndDate?: string
}

const ReportDailyTable: React.FC<Props> = ({
    className = '',
    showTitle = true,
    defaultStartDate,
    defaultEndDate,
}) => {
    const { auth } = useAuth()

    const empId = auth?.data?.[0]?.EmpId ?? ''
    const teamSale = auth?.data?.[0]?.TeamSale ?? ''
    const saleCode = auth?.data?.[0]?.SaleCode ?? ''
    const postName = auth?.data?.[0]?.PosName2 ?? ''

    const today = dayjs().format('YYYY-MM-DD')
    const startDate = defaultStartDate ?? today
    const endDate = defaultEndDate ?? today

    const [tableData, setTableData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [hasSearched, setHasSearched] = useState<boolean>(false)

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO
    const REPORT_DAILY_URL = `${API_URL_MONGO}/Report/GetReportDaily`

    const fetchToday = async () => {
        setIsLoading(true)
        setHasSearched(false)
        try {
            const response = await axios.post(REPORT_DAILY_URL, {
                EMPID: empId,
                TEAMSALE: teamSale,
                SALECODE: saleCode,
                POSNAME: postName,
                STARTDATE: startDate,
                ENDDATE: endDate,
            })
            const rows = response?.data?.data
            setTableData(Array.isArray(rows) ? rows : [])
        } catch (error) {
            console.error('Error fetching data:', error)
            setTableData([])
        } finally {
            setIsLoading(false)
            setHasSearched(true)
        }
    }

    // โหลดอัตโนมัติ “ของวันนี้” เมื่อ auth พร้อม
    useEffect(() => {
        if (!empId && !teamSale && !saleCode && !postName) return
        fetchToday()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [empId, teamSale, saleCode, postName, startDate, endDate])

    const formatToBE = (isoDate?: string) => {
        if (!isoDate) return ''
        const d = new Date(isoDate)
        if (isNaN(d.getTime())) return ''
        const dd = String(d.getDate()).padStart(2, '0')
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const yyyy = d.getFullYear() + 543
        return `${dd}/${mm}/${yyyy}`
    }

    const statusMap: Record<string, string> = {
        PENDING: 'รอตรวจสอบ',
        EDIT: 'แจ้งแก้ไข',
        FINISH: 'อนุมัติผ่าน',
    }

    const currentDay =
        startDate === endDate
            ? formatToBE(startDate)
            : `${formatToBE(startDate)} - ${formatToBE(endDate)}`

    return (
        <div className={`card ${className}`}>
            <div className='card-body mt-3'>
                <div className='d-flex justify-content-between align-items-center mb-5'>
                    <div className='page-title d-flex flex-wrap me-3 flex-column justify-content-center'>
                        <p className={`page-heading d-flex text-gray-900 my-0 flex-column justify-content-center ${styles.label}`}>
                            รายงานการขายวันที่ {currentDay}
                        </p>
                        <p className={`mt-3 ${styles.label}`}>จำนวน: {tableData.length} รายการ</p>
                    </div>
                </div>

                {/* ตาราง */}
                <div className='mt-6'>
                    {isLoading ? (
                        <div className='text-center'></div>
                    ) : hasSearched && tableData.length === 0 ? (
                        <div className='text-center'></div>
                    ) : tableData.length > 0 ? (
                        <div style={{ overflowX: 'auto', width: '100%' }}>
                            <table className='table table-rounded table-row-bordered border table-striped gs-7 mt-3'>
                                <thead>
                                    <tr className='fw-bold'>
                                        <th>ContNo</th>
                                        <th>สินค้า</th>
                                        <th>รหัสขาย</th>
                                        <th>สถานะ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((item, idx) => (
                                        <tr key={idx}>

                                            <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}>
                                                {item?.CONTNO ?? '-'}
                                            </td>

                                            <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}>
                                                {item.PRODUCT[0]?.ItemDescription ?? '-'}
                                            </td>

                                            <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}>
                                                {item.SALEEMPLOYEE[0].SALEEMPLOYEE.SaleCode} - {item.SALEEMPLOYEE[0].SALEEMPLOYEE.FName} {item.SALEEMPLOYEE[0].SALEEMPLOYEE.LName}
                                            </td>
                                            <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}>
                                                {(() => {
                                                    const statusMap: Record<string, string> = {
                                                        PENDING: "รอตรวจสอบ",
                                                        EDIT: "แจ้งแก้ไข",
                                                        FINISH: "อนุมัติผ่าน",
                                                    };
                                                    return statusMap[item.CHECKKERSTATUS];
                                                })()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default ReportDailyTable