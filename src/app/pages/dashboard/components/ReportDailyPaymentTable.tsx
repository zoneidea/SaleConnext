import React, { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import { useAuth } from '../../../modules/auth/core/Auth'

type Row = {
    RECEIPTCODE?: string
    DATEPAYMENT?: string            // "03-08-2025 10:45"
    PAYMENTPERIODNUMBER?: number
    CONTNO?: string
    CUSTOMERNAME?: string
    PAYAMOUNT?: string              // "10,990.00"
    PAYAMOUNT2?: number             // 10990 (ถ้ามีให้ใช้ตัวนี้)
    AMOUNTPERIOD?: string | number  // "10,990.00" หรือ number
    STATUSPAY?: string
}

type Props = { className?: string }

const ReportDailyPaymentTable: React.FC<Props> = ({ className = '' }) => {
    const { auth } = useAuth()

    const empId = auth?.data?.[0]?.EmpId ?? ""
    const teamSale = auth?.data?.[0]?.TeamSale ?? ""
    const posIdRaw = auth?.data?.[0]?.PosId ?? auth?.data?.[0]?.PosID
    const depIdRaw = auth?.data?.[0]?.DepId ?? auth?.data?.[0]?.DepID
    const posId = posIdRaw != null ? String(posIdRaw) : ''   // type: string
    const depId = depIdRaw != null ? String(depIdRaw) : ''   // type: string

    // ใช้ "วันนี้" เป็นค่า fix สำหรับการดึงข้อมูล
    const today = dayjs().format("YYYY-MM-DD")
    const startDate = today
    const endDate = today

    const [tableData, setTableData] = useState<Row[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const [totalFromApi, setTotalFromApi] = useState<string>("")

    const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT
    const BASE_URL = `${API_URL_SALECONNEXT}/GetListPayments`;

    // helper: แปลงวันที่ใบเสร็จเป็น พ.ศ.
    const formatToBE = (datePayment?: string) => {
        if (!datePayment) return ""
        // DATEPAYMENT = "DD-MM-YYYY HH:mm"
        const m = dayjs(datePayment, "DD-MM-YYYY HH:mm")
        if (!m.isValid()) return datePayment
        const dd = m.date().toString().padStart(2, "0")
        const mm = (m.month() + 1).toString().padStart(2, "0")
        const yyyyBE = m.year() + 543
        return `${dd}/${mm}/${yyyyBE}`
    }

    const num = (v: unknown) =>
        typeof v === "number" ? v : Number(String(v ?? "0").replace(/[^0-9.-]/g, "")) || 0

    const thb = (n?: number | string) =>
        num(n).toLocaleString("th-TH", { maximumFractionDigits: 2 })

    const fetchToday = async () => {
        if (!empId || !teamSale || posId === '' || depId === '') return
        setIsLoading(true)
        setHasSearched(false)
        try {
            const res = await axios.get(BASE_URL, {
                params: {
                    EmpId: empId,
                    TeamSale: teamSale,
                    PosId: posId,
                    DepId: depId,
                    Sdate: startDate,
                    Edate: endDate,
                },
            })
            const rows: Row[] = Array.isArray(res.data?.data) ? res.data.data : []
            setTableData(rows)
            setTotalFromApi(res.data?.totalPayAmount ?? "")
        } catch (e) {
            console.error("GetListPayments error:", e)
            setTableData([])
            setTotalFromApi("")
        } finally {
            setIsLoading(false)
            setHasSearched(true)
        }
    }

    // โหลดอัตโนมัติ “ของวันนี้” เมื่อ auth พร้อม
    useEffect(() => {
        fetchToday()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [empId, teamSale, posId, depId, startDate, endDate])

    // รวมยอดจากตาราง (สำรองเผื่อใช้แทนของ API)
    const totalCalc = tableData.reduce(
        (s, r) => s + (r.PAYAMOUNT2 ?? num(r.PAYAMOUNT)),
        0
    )

    const currentDay =
        startDate === endDate
            ? formatToBE(startDate)
            : `${formatToBE(startDate)} - ${formatToBE(endDate)}`

    return (
        <div className={`card ${className}`}>
            <div className='card-body mt-3'>
                <div className='d-flex justify-content-between align-items-center mb-5'>
                    <div className='page-title d-flex flex-wrap me-3 flex-column justify-content-center'>
                        <h2 className='page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center'>
                            รายงานเก็บเงินวันที่ {currentDay}
                        </h2>
                        <p className="mt-3">จำนวน: {tableData.length} รายการ</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center"></div>
                ) : hasSearched && tableData.length === 0 ? (
                    <div className="text-center"></div>
                ) : tableData.length > 0 ? (
                    <div style={{ overflowX: "auto", width: "100%" }}>
                        <table className="table table-rounded table-row-bordered border table-striped gs-7 mt-3">
                            <thead>
                                <tr className="fw-bold">
                                    <th>ลำดับ</th>
                                    <th>เลขที่ใบเสร็จ</th>
                                    <th>เลขที่สัญญา</th>
                                    <th>ค่างวด</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((r, i) => (
                                    <tr key={`${r.RECEIPTCODE}-${i}`}>
                                        <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}>
                                            {i + 1}
                                        </td>
                                        <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}>
                                            {r.RECEIPTCODE || "-"}
                                        </td>
                                        <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}>
                                            {r.CONTNO || "-"}
                                        </td>
                                        <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}>
                                            {thb(r.AMOUNTPERIOD)}
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={2} />
                                    <td colSpan={2} className="text-end fw-bold text-nowrap">
                                        ยอดรวม&nbsp;&nbsp;{totalFromApi ? totalFromApi : thb(totalCalc)}&nbsp;บาท
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default ReportDailyPaymentTable