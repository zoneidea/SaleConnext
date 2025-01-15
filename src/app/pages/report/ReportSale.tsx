import React, { useState, useEffect } from "react";
import axios from "axios";
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from "../../modules/auth/core/Auth";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

const ReportSale: React.FC = () => {
    const { auth } = useAuth();

    const empId = auth.data[0].EmpId;
    const teamSale = auth.data[0].TeamSale;
    const saleCode = auth.data[0].SaleCode;
    const postName = auth.data[0].PosName2;

    const today = dayjs().format("YYYY-MM-DD"); // วันที่ปัจจุบัน
    const [valueCalendarStart, setValueCalendarStart] = useState<string | null>(today);
    const [valueCalendarEnd, setValueCalendarEnd] = useState<string | null>(today);
    const [tableData, setTableData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
    const REPORT_DAILY_URL = `${API_URL_MONGO}/Report/GetReportDaily`;

    const handleDateChangeStart = (date: Date | null) => {
        if (date) {
            const formattedDate = dayjs(date).format("YYYY-MM-DD");
            setValueCalendarStart(formattedDate);
        } else {
            setValueCalendarStart(null);
        }
    };

    const handleDateChangeEnd = (date: Date | null) => {
        if (date) {
            const formattedDate = dayjs(date).format("YYYY-MM-DD");
            setValueCalendarEnd(formattedDate);
        } else {
            setValueCalendarEnd(null);
        }
    };

    const handleSearch = async () => {
        if (!valueCalendarStart || !valueCalendarEnd) {
            alert("กรุณาเลือกวันที่เริ่มต้นและวันที่สิ้นสุด");
            return;
        }

        setIsLoading(true);
        setHasSearched(false); // Reset ก่อนเริ่มการค้นหาใหม่
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
            setHasSearched(true); // ระบุว่าได้กดค้นหาแล้ว
        }
    };

    useEffect(() => {
        // เรียก API ทันทีเมื่อเปิดหน้า
        handleSearch();
    }, []);

    return (
        <>
            <Content>
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
                            <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                                รายงานระบบขาย
                            </h1>
                            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                                <li className="breadcrumb-item text-muted">
                                    <span className="text-muted text-hover-primary">รายงาน</span>
                                </li>
                                <li className="breadcrumb-item">
                                    <span className="bullet bg-gray-500 w-5px h-2px"></span>
                                </li>
                                <li className="breadcrumb-item text-gray-900">รายงานระบบขาย</li>
                            </ul>
                        </div>
                    </div>

                    <div className="card mb-10">
                        <div className="card-body mt-3">
                            <div className="col-12">
                                <div className="row gy-3 gy-md-0 align-items-center">
                                    <div className="col-12 col-md-auto d-flex align-items-center">
                                        <label className="form-label fw-bold fs-6 mb-0 me-3">วันที่เริ่มต้น</label>
                                        <DatePicker
                                            className="form-control custom-datepicker"
                                            selected={valueCalendarStart ? dayjs(valueCalendarStart).toDate() : null}
                                            onChange={(e) => handleDateChangeStart(e)}
                                            showYearDropdown
                                            showMonthDropdown
                                            dropdownMode="select"
                                            isClearable
                                            dateFormat="yyyy-MM-dd"
                                            withPortal
                                        />
                                    </div>

                                    <div className="col-12 col-md-auto d-flex align-items-center">
                                        <label className="form-label fw-bold fs-6 mb-0 me-3">วันที่สิ้นสุด</label>
                                        <DatePicker
                                            className="form-control custom-datepicker"
                                            selected={valueCalendarEnd ? dayjs(valueCalendarEnd).toDate() : null}
                                            onChange={(e) => handleDateChangeEnd(e)}
                                            showYearDropdown
                                            showMonthDropdown
                                            dropdownMode="select"
                                            isClearable
                                            dateFormat="yyyy-MM-dd"
                                            withPortal
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
                                                <tr>
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
                                                        <td>{item.PRODUCT[0]?.ItemDescription || "-"}</td>
                                                        <td>{item.PRODUCT[0]?.Package[0]?.PACKAGETITLE || "-"}</td>
                                                        <td>
                                                            {item.CUSTOMERDETAIL[0]?.PREFIX[0]?.PREFIXNAME || ""}{" "}
                                                            {item.CUSTOMERDETAIL[0]?.CUSTOMERNAME || ""}
                                                        </td>
                                                        <td>{item.TEAMSALE}</td>
                                                        <td>{item.SALECODE}</td>
                                                        <td>{item.EFFDATE}</td>
                                                        <td>{item.STATUS}</td>
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
        </>
    );
};

export default ReportSale;