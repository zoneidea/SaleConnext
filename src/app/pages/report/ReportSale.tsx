import React, { useState, useEffect } from "react";
import axios from "axios";
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from "../../modules/auth/core/Auth";
import dayjs from "dayjs";
import { log } from "console";

const ReportSale: React.FC = () => {
  const { auth } = useAuth();

  const empId = auth.data[0].EmpId;
  const teamSale = auth.data[0].TeamSale;
  const saleCode = auth.data[0].SaleCode;
  const postName = auth.data[0].PosName2;
  const posID = auth.data[0].PosID;
  const depID = auth.data[0].DepID;

  const today = dayjs().format("YYYY-MM-DD");
  const [valueCalendarStart, setValueCalendarStart] = useState<string>(today);
  const [valueCalendarEnd, setValueCalendarEnd] = useState<string>(today);
  const [tableData, setTableData] = useState<any[]>([]);
  console.log(`tableData`, tableData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
  // const REPORT_DAILY_URL = `${API_URL_MONGO}/Report/GetReportDaily`;
  const REPORT_DAILY_URL = `${API_URL_SALECONNEXT}/GetListContracts?EmpId=${empId}&TeamSale=${teamSale}&PosId=${posID}&DepId=${depID}&Sdate=${valueCalendarStart}&Edate=${valueCalendarEnd}&ProcessType=${auth.processtype}`;

  const handleSearch = async () => {
    if (!valueCalendarStart || !valueCalendarEnd) {
      alert("กรุณาเลือกวันที่เริ่มต้นและวันที่สิ้นสุด");
      return;
    }

    setIsLoading(true);
    setHasSearched(false);
    try {
      // const response = await axios.post(REPORT_DAILY_URL, {
      //   EMPID: empId,
      //   TEAMSALE: teamSale,
      //   SALECODE: saleCode,
      //   POSNAME: postName,
      //   STARTDATE: valueCalendarStart,
      //   ENDDATE: valueCalendarEnd,
      const response = await axios.get(REPORT_DAILY_URL);

      if (response.data && response.data.data) {
        setTableData(response.data.data);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const toThaiDate = (iso?: string) => {
    if (!iso) return '-'
    const d = new Date(iso)
    if (!isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, '0')
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const yyyy = d.getFullYear() + 543
      return `${dd}/${mm}/${yyyy}`
    }
    return String(iso).split(' ')[0]
  }

  const payStatusMap: Record<string, string> = {
    PENDING: 'รอตรวจสอบ',
    EDIT: 'แจ้งแก้ไข',
    FINISH: 'อนุมัติผ่าน',
    APPROVE: 'อนุมัติผ่าน',
  }
  const num = (v: any) => {
    const n = Number(v)
    return isNaN(n) ? 0 : n
  }
  const money = (n: number) =>
    n.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

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
              รายงานการขายประจำวัน
            </h1>
          </div>
        </div>

        <div className="card mb-10">
          <div className="card-body mt-3">
            <div className="col-12">
              <div className="row gy-3 gy-md-0 align-items-center">
                <div className="col-12 col-md-auto d-flex align-items-center">
                  <label className="form-label fw-bold fs-6 mb-0 me-3">
                    วันที่เริ่มต้น
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={valueCalendarStart}
                    onChange={(e) => setValueCalendarStart(e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-auto d-flex align-items-center">
                  <label className="form-label fw-bold fs-6 mb-0 me-3">
                    วันที่สิ้นสุด
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={valueCalendarEnd}
                    onChange={(e) => setValueCalendarEnd(e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-auto">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 w-md-auto"
                    style={{ height: "38px" }}
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
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table className="table table-rounded table-row-bordered border table-striped gs-7 mt-3">
                    <thead>
                      <tr className="fw-bold">
                        <th style={{ minWidth: 70 }}>ลำดับ<br /><span className="text-muted fs-7"></span></th>
                        <th style={{ minWidth: 140 }}>เลขที่สัญญา<br /><span className="text-muted fs-7"></span></th>
                        <th style={{ minWidth: 120 }}>สถานะ<br /><span className="text-muted fs-7"></span></th>
                        <th style={{ minWidth: 140 }}>วันที่ทำสัญญา<br /><span className="text-muted fs-7"></span></th>
                        <th style={{ minWidth: 220 }}>ชื่อ-นามสกุล<br /><span className="text-muted fs-7"></span></th>
                        <th style={{ minWidth: 220 }}>หมายเลขสินค้า<br /><span className="text-muted fs-7"></span></th>

                        <th style={{ minWidth: 240 }}>สินค้า<br /><span className="text-muted fs-7"></span></th>
                        <th style={{ minWidth: 220 }}>แพ็กเกจ<br /><span className="text-muted fs-7"></span></th>
                        <th style={{ minWidth: 140, textAlign: 'right' }}>ราคาขาย<br /><span className="text-muted fs-7"></span></th>
                        <th style={{ minWidth: 140, textAlign: 'right' }}>ส่วนลด<br /><span className="text-muted fs-7"></span></th>
                        <th style={{ minWidth: 140, textAlign: 'right' }}>ราคาสุทธิ<br /><span className="text-muted fs-7"></span></th>
                        <th style={{ minWidth: 140, textAlign: 'right' }}>แต้ม<br /><span className="text-muted fs-7"></span></th>

                        <th style={{ minWidth: 140 }}>ทีมขาย<br /><span className="text-muted fs-7"></span></th>
                        <th style={{ minWidth: 240 }}>พนักงานขาย<br /><span className="text-muted fs-7"></span></th>
                      </tr>
                    </thead>

                    <tbody>
                      {tableData.map((item: any, index: number) => {
                        const contNo = item?.CONTNO ?? '-'
                        const payStatus = item?.PAYSTATUS ?? payStatusMap[item?.CHECKKERSTATUS] ?? '-'
                        const effDate = item?.EFFDATE?.substring(0, 10);

                        const customerName =
                          [
                            item?.CUSTOMERNAME,
                          ].filter(Boolean).join(' ') || '-'

                        const productName =
                          item?.PRODUCT?.[0]?.ItemDescription ??
                          item?.PRODUCTNAME ??
                          '-'

                        const productSerialNumber =
                          item?.PRODUCTSERIALNUMBER ??
                          '-'

                        const packageTitle =
                          item?.PRODUCT?.[0]?.Package?.[0]?.PACKAGETITLE ??
                          item?.PRODUCT?.[0]?.PackageTitle ??
                          item?.PACKAGETITLE ??
                          '-'

                        const sales = item?.SALES ?? 0
                        const point = item?.POINT ?? 0
                        const tradeInDiscount = item?.TRADEINDISCOUNT ?? 0
                        const totalPrice = item?.TOTALPRICE ?? 0

                        const teamCode = item?.SALETEAMCODE ?? '-'
                        const emp = item?.SALEEMPLOYEE?.[0]?.SALEEMPLOYEE
                        const employeeName =
                          <>
                            {item.SALECODE} - <br />
                            {item?.SALEEMPLOYEENAME}
                          </>


                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{contNo}</td>
                            <td>{payStatus}</td>
                            <td>{effDate}</td>
                            <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{customerName}</td>
                            <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{productSerialNumber}</td>
                            <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{productName}</td>
                            <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{packageTitle}</td>
                            <td style={{ textAlign: 'right' }}>{sales}</td>
                            <td style={{ textAlign: 'right' }}>{tradeInDiscount}</td>
                            <td style={{ textAlign: 'right' }}>{totalPrice}</td>
                            <td style={{ textAlign: 'right' }}>{point}</td>
                            <td>{teamCode}</td>
                            <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{employeeName}</td>
                          </tr>
                        )
                      })}
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

export default ReportSale;