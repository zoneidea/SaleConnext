import React, { useState, useEffect } from "react";
import axios from "axios";
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from "../../modules/auth/core/Auth";
import dayjs from "dayjs";

type Row = {
  RECEIPTCODE?: string;
  DATEPAYMENT?: string;            // "03-08-2025 10:45"
  PAYMENTPERIODNUMBER?: number;
  CONTNO?: string;
  CUSTOMERNAME?: string;
  PAYAMOUNT?: string;              // "10,990.00"
  PAYAMOUNT2?: number;             // 10990 (ถ้ามีให้ใช้ตัวนี้)
  AMOUNTPERIOD?: string | number;  // "10,990.00" หรือ number
  STATUSPAY?: string;
};

const ReportSalePayment: React.FC = () => {
  const { auth } = useAuth();

  const empId = auth?.data?.[0]?.EmpId ?? "";
  const teamSale = auth?.data?.[0]?.TeamSale ?? "";
  const posId = auth?.data?.[0]?.PosId ?? auth?.data?.[0]?.PosID ?? "";
  const depId = auth?.data?.[0]?.DepId ?? auth?.data?.[0]?.DepID ?? "";

  const today = dayjs().format("YYYY-MM-DD");
  const [valueCalendarStart, setValueCalendarStart] = useState<string>(today);
  const [valueCalendarEnd, setValueCalendarEnd] = useState<string>(today);

  const [tableData, setTableData] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalFromApi, setTotalFromApi] = useState<string>("");

  const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT
  const BASE_URL = `${API_URL_SALECONNEXT}/GetListPayments`;

  // helper: แปลงวันที่ใบเสร็จเป็น พ.ศ.
  const formatToBE = (datePayment?: string) => {
    if (!datePayment) return "";
    // DATEPAYMENT = "DD-MM-YYYY HH:mm"
    const m = dayjs(datePayment, "DD-MM-YYYY HH:mm");
    if (!m.isValid()) return datePayment;
    const dd = m.date().toString().padStart(2, "0");
    const mm = (m.month() + 1).toString().padStart(2, "0");
    const yyyyBE = m.year() + 543;
    return `${dd}/${mm}/${yyyyBE}`;
  };

  const num = (v: unknown) =>
    typeof v === "number" ? v : Number(String(v ?? "0").replace(/[^0-9.-]/g, "")) || 0;

  const thb = (n?: number | string) =>
    num(n).toLocaleString("th-TH", { maximumFractionDigits: 2 });

  const handleSearch = async () => {
    if (!empId || !teamSale || !posId || !depId) return; // รอ auth
    if (!valueCalendarStart || !valueCalendarEnd) return;

    setIsLoading(true);
    setHasSearched(false);
    try {
      const res = await axios.get(BASE_URL, {
        params: {
          EmpId: empId,
          TeamSale: teamSale,
          PosId: posId,
          DepId: depId,
          Sdate: valueCalendarStart,
          Edate: valueCalendarEnd,
        },
      });

      const rows: Row[] = Array.isArray(res.data?.data) ? res.data.data : [];
      setTableData(rows);
      setTotalFromApi(res.data?.totalPayAmount ?? "");
    } catch (e) {
      console.error("GetListPayments error:", e);
      setTableData([]);
      setTotalFromApi("");
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  // ยิงครั้งแรกเมื่อ auth พร้อม
  useEffect(() => {
    if (empId && teamSale && (posId || posId === 0) && (depId || depId === 0)) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empId, teamSale, posId, depId]);

  // รวมยอดจากตาราง (สำรองเผื่อใช้แทนของ API)
  const totalCalc = tableData.reduce(
    (s, r) => s + (r.PAYAMOUNT2 ?? num(r.PAYAMOUNT)),
    0
  );

  return (
    <Content>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div className="d-flex justify-content-between align-items-center my-5">
          <div className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
            <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
              รายงานเก็บเงินประจำวัน
            </h1>
          </div>
        </div>

        <div className="card mb-10">
          <div className="card-body mt-3">
            <div className="col-12">
              <div className="row gy-3 gy-md-0 align-items-center">
                <div className="col-12 col-md-auto d-flex align-items-center">
                  <label className="form-label fw-bold fs-6 mb-0 me-3">วันที่เริ่มต้น</label>
                  <input
                    type="date"
                    className="form-control"
                    value={valueCalendarStart}
                    max={valueCalendarEnd || undefined}
                    onChange={(e) => setValueCalendarStart(e.target.value || today)}
                  />
                </div>

                <div className="col-12 col-md-auto d-flex align-items-center">
                  <label className="form-label fw-bold fs-6 mb-0 me-3">วันที่สิ้นสุด</label>
                  <input
                    type="date"
                    className="form-control"
                    value={valueCalendarEnd}
                    min={valueCalendarStart || undefined}
                    onChange={(e) => setValueCalendarEnd(e.target.value || today)}
                  />
                </div>

                <div className="col-12 col-md-auto">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 w-md-auto"
                    style={{ height: 38 }}
                  >
                    ค้นหา
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10">
              {isLoading ? (
                <div className="text-center">กำลังโหลดข้อมูล...</div>
              ) : hasSearched && tableData.length === 0 ? (
                <div className="text-center">ไม่พบข้อมูล</div>
              ) : tableData.length > 0 ? (
                <div className="table-responsive">
                  <table
                    className="table table-rounded table-row-bordered border table-striped gs-7 mt-3 text-nowrap"
                    style={{ minWidth: 1200 }}
                  >
                    <thead>
                      <tr className="fw-bold">
                        <th>ลำดับ</th>
                        <th>เลขที่ใบเสร็จ</th>
                        <th>วันที่ออกใบเสร็จ</th>
                        <th>งวดที่</th>
                        <th>เลขที่สัญญา</th>
                        <th>ชื่อ - สกุล</th>
                        <th className="text-end">ค่างวด</th>
                        <th className="text-end">จำนวนเงิน</th>
                        <th>สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((r, i) => (
                        <tr key={`${r.RECEIPTCODE}-${i}`}>
                          <td>{i + 1}</td>
                          <td>{r.RECEIPTCODE || "-"}</td>
                          <td>{formatToBE(r.DATEPAYMENT)}</td>
                          <td>{r.PAYMENTPERIODNUMBER ?? "-"}</td>
                          <td>{r.CONTNO || "-"}</td>
                          <td>{r.CUSTOMERNAME || "-"}</td>
                          <td className="text-end">{thb(r.AMOUNTPERIOD)}</td>
                          <td className="text-end">{thb(r.PAYAMOUNT2 ?? r.PAYAMOUNT)}</td>
                          <td>{r.STATUSPAY || "-"}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={6} />
                        <td className="fw-bold">ยอดรวม</td>
                        <td className="text-end fw-bold">
                          {totalFromApi ? totalFromApi : thb(totalCalc)}
                        </td>
                        <td>บาท</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
            <p className="mt-3">จำนวน: {tableData.length} รายการ</p>
          </div>
        </div>
      </form>
    </Content>
  );
};

export default ReportSalePayment;