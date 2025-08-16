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

  const today = dayjs().format("YYYY-MM-DD");
  const [valueCalendarStart, setValueCalendarStart] = useState<string>(today);
  const [valueCalendarEnd, setValueCalendarEnd] = useState<string>(today);
  const [tableData, setTableData] = useState<any[]>([]);
  console.log(`tableData`, tableData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const REPORT_DAILY_URL = `${API_URL_MONGO}/Report/GetReportDaily`;

  const handleSearch = async () => {
    if (!valueCalendarStart || !valueCalendarEnd) {
      alert("กรุณาเลือกวันที่เริ่มต้นและวันที่สิ้นสุด");
      return;
    }

    setIsLoading(true);
    setHasSearched(false);
    try {
      const response = await axios.post(REPORT_DAILY_URL, {
        EMPID: empId,
        TEAMSALE: teamSale,
        SALECODE: saleCode,
        POSNAME: postName,
        STARTDATE: valueCalendarStart,
        ENDDATE: valueCalendarEnd,
      });

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

  const formatToBE = (isoDate?: string) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear() + 543;
    return `${dd}/${mm}/${yyyy}`;
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
                <div style={{ overflowX: "auto", width: "100%" }}>
                  <table className="table table-rounded table-row-bordered border table-striped gs-7 mt-3">
                    <thead>
                      <tr className="fw-bold">
                        <th>ContNo</th>
                        <th>สินค้า</th>
                        <th>แพ็คเกจ</th>
                        <th>ลูกค้า</th>
                        <th>ทีมขาย</th>
                        <th>รหัสขาย</th>
                        <th>วันที่ทำสัญญา</th>
                        <th>สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.CONTNO}</td>
                          <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '150px' }}>
                            {item.PRODUCT[0]?.ItemDescription || "-"}
                          </td>
                          <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '250px' }}>
                            {item.PRODUCT[0]?.Package[0]?.PACKAGETITLE || "-"}
                          </td>
                          <td>
                            {item.CUSTOMERDETAIL[0]?.PREFIX[0]?.PREFIXNAME ||
                              ""}{" "}
                            {item.CUSTOMERDETAIL[0]?.CUSTOMERNAME || ""} {item.CUSTOMERDETAIL[0]?.CUSTOMERLASTNAME || ""}
                          </td>
                          <td>{item.TEAMSALE}</td>
                          <td style={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '150px' }}>
                            {item.SALEEMPLOYEE[0].SALEEMPLOYEE.SaleCode}-<br/>{item.SALEEMPLOYEE[0].SALEEMPLOYEE.FName} {item.SALEEMPLOYEE[0].SALEEMPLOYEE.LName}
                          </td>
                          <td>{formatToBE(item.EFFDATE)}</td>
                          <td>
                            {(() => {
                              const statusMap: Record<string, string> = {
                                PENDING: "รอตรวจสอบ",
                                EDIT: "แจ้งแก้ไข",
                                APPROVE: "อนุมัติผ่าน",
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
      </form>
    </Content>
  );
};

export default ReportSale;