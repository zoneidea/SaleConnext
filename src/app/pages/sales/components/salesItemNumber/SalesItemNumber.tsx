import styles from "@/styles/style.module.css";
import { KTIcon } from "../../../../../_metronic/helpers";
import { Link, useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../../_metronic/helpers";
import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface StatusLabelProps {
  status: string;
  item: any;
  onDelete: () => void;
}

const SalesItemNumber: React.FC<StatusLabelProps> = ({
  status,
  item,
  onDelete,
}) => {

  const API_URL_GET_ALLCONTRACT = import.meta.env.VITE_APP_API_MONGO;
  const DEL_CONTRACT_URL = `${API_URL_GET_ALLCONTRACT}/Contract/DelContract`;

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1
    }-${currentDate.getDate()}`;

  let customer, product, productPackage, serialNumber, createdAt, statusTxt;

  let customerRow, serialRow, dateRow;

  const rawCheckerStatus =
    item?.CHECKKERSTATUS ?? item?.CHECKERSTATUS ?? "";
  const checkerStatusMap: Record<string, string> = {
    PENDING: "รอตรวจสอบ",
    EDIT: "แจ้งแก้ไข",
    APPROVE: "อนุมัติ",
    CANCEL: "ไม่อนุมัติ",
  };
  const checkerStatusText = checkerStatusMap[rawCheckerStatus] ?? "";

  const checkerStatusClass: Record<string, string> = {
    PENDING: "badge badge-light-primary",
    EDIT: "badge badge-light-danger",
    APPROVE: "badge badge-light-success",
    CANCEL: "badge badge-light-secondary",
  };

  if (item.CUSTOMERDETAIL?.length > 0) {
    const { CUSTOMERNAME, CUSTOMERLASTNAME } = item.CUSTOMERDETAIL[0];
    customerRow = (
      <div className="row">
        {/* หัวข้อ กำหนดคอลัมน์กว้างเท่ากันทุกแถว */}
        <div className={`col-5 text-gray-700 fw-semibold ${styles.fontSize}`}>
          ชื่อลูกค้า:
        </div>
        {/* ค่าที่ต้องเยื้อง */}
        <div className={`col text-gray-800 fw-bold ${styles.fontSize}`}>
          {CUSTOMERNAME} {CUSTOMERLASTNAME}
        </div>
      </div>
    );
  }

  if (item.PRODUCT?.[0]?.Package?.length > 0) {
    serialRow = (
      <div className="row">
        <div className={`col-5 text-gray-700 fw-semibold ${styles.fontSize}`}>
          S/N:
        </div>
        <div className={`col text-gray-800 fw-bold ${styles.fontSize}`}>
          {item.PRODUCT[0].SerialNo}
        </div>
      </div>
    );
  }

  if (item.CONTRACT?.length > 0) {
    dateRow = (
      <div className="row">
        <div className={`col-5 text-gray-700 fw-semibold ${styles.fontSize}`}>
          วันที่ทำสัญญา:
        </div>
        <div className={`col text-gray-800 fw-bold ${styles.fontSize}`}>
          {item.CONTRACT[0].createdAt}
        </div>
      </div>
    );
  }

  const deleteDataDraft = async (e: React.MouseEvent, refno: string) => {
    e.stopPropagation();
    e.preventDefault();

    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: `คุณต้องการลบ REFNO: ${refno} หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(DEL_CONTRACT_URL, { REFNO: refno });
          Swal.fire({
            text: "ข้อมูลถูกลบเรียบร้อยแล้ว",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          onDelete();
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error);
          Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบข้อมูลได้", "error");
        }
      }
    });
  };

  const isDataIncomplete = useMemo(() => {
    return !item?.CONTNO;
  }, [item]);

  // ด้านบนของ component
  const formatToBE = (isoDate?: string) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear() + 543;
    return `${dd}/${mm}/${yyyy}`;
  };

  const checkerCommentText = useMemo(() => {
    const arr = (item?.CHECKERCOMMENT ?? item?.CHECKKERCOMMENT ?? []) as any[];
    return (
      arr
        .map((x) => String(x?.COMMENT ?? "").trim())
        .find((t) => t.length > 0) || ""
    );
  }, [item]);

  return (
    <>
      {status === "DRAFT" && (
        <Link to="/sale/step" state={item}>
          <div
            className="
        d-flex flex-column flex-md-row align-items-center
        bg-light-warning rounded
        px-2 px-md-3 
        py-2 mb-2
      "
          >
            {/* ไอคอนฝั่งซ้าย (ซ่อนบนมือถือ) */}
            <span className="d-none d-md-inline me-2">
              <KTIcon iconName="abstract-26" className="text-warning fs-1" />
            </span>

            {/* เนื้อหา */}
            <div className="flex-grow-1">
              <div className="row gx-2 gy-1 align-items-center">
                {/* label: ใช้ col-4 บนมือถือ, col-md-3 บน desktop */}
                <div
                  className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}
                >
                  ชื่อลูกค้า:
                </div>
                {/* value: กินที่เหลือ */}
                <div
                  className={`col-7 col-md-9 fw-bold text-gray-800 ${styles.fontSize}`}
                >
                  {item.CUSTOMERDETAIL[0]?.CUSTOMERNAME}{" "}
                  {item.CUSTOMERDETAIL[0]?.CUSTOMERLASTNAME}
                </div>

                <div
                  className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}
                >
                  S/N:
                </div>
                <div
                  className={`col-7 col-md-9 fw-bold text-gray-800 ${styles.fontSize}`}
                >
                  {item.PRODUCT[0]?.SerialNo}
                </div>

                <div
                  className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}
                >
                  วันที่ทำสัญญา:
                </div>
                <div
                  className={`col-7 col-md-9 fw-bold text-gray-800 ${styles.fontSize}`}
                >
                  {formatToBE(item.CONTRACT[0]?.createdAt)}
                </div>
              </div>
            </div>
            {/* แสดงไอคอนถังขยะเฉพาะหน้าจอใหญ่ */}
            <span
              className={`d-none d-md-inline me-5 ${!isDataIncomplete ? "disabled" : ""
                }`}
              onClick={(e) =>
                isDataIncomplete && deleteDataDraft(e, item.REFNO)
              }
              style={{
                cursor: isDataIncomplete ? "pointer" : "not-allowed",
                opacity: isDataIncomplete ? 1 : 0.5,
              }}
            >
              <img
                src={toAbsoluteUrl("media/settings/trash-svgrepo-com (2).png")}
                style={{ width: 35, height: 35 }}
                alt="Trash Icon"
              />
            </span>

            {/* แสดงคำว่า "ลบ" ในหน้าจอเล็ก */}
            <button
              className={`d-block d-md-none text-black fw-bold text-center rounded mt-5 ${!isDataIncomplete ? "disabled" : ""
                }`}
              style={{
                backgroundColor: isDataIncomplete ? "#F6C000" : "#ccc",
                cursor: isDataIncomplete ? "pointer" : "not-allowed",
                width: "100%",
                height: "50px",
                opacity: isDataIncomplete ? 1 : 0.5,
              }}
              onClick={(e) =>
                isDataIncomplete && deleteDataDraft(e, item.REFNO)
              }
            >
              <span className="fs-2">ลบ</span>
            </button>
          </div>
        </Link>
      )}

      {status === "EDIT" && (
        <Link to="/sale/step" state={item}>
          <div
            className="
        d-flex flex-column flex-md-row align-items-center
        bg-light-secondary rounded
        px-2 px-md-3 
        py-2 mb-2
      "
          >
            {/* ไอคอนฝั่งซ้าย (ซ่อนบนมือถือ) */}
            <span className="d-none d-md-inline me-2">
              <KTIcon iconName="abstract-26" className="text-secondary fs-1" />
            </span>

            {/* เนื้อหา */}
            <div className="flex-grow-1">
              <div className="row gx-2 gy-1 align-items-center">
                {/* label: ใช้ col-4 บนมือถือ, col-md-3 บน desktop */}
                <div
                  className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}
                >
                  ชื่อลูกค้า:
                </div>
                {/* value: กินที่เหลือ */}
                <div
                  className={`col-7 col-md-9 fw-bold text-gray-800 ${styles.fontSize}`}
                >
                  {item.CUSTOMERDETAIL[0]?.CUSTOMERNAME}{" "}
                  {item.CUSTOMERDETAIL[0]?.CUSTOMERLASTNAME}
                </div>

                <div
                  className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}
                >
                  S/N:
                </div>
                <div
                  className={`col-5 col-md-9 fw-bold text-gray-800 ${styles.fontSize}`}
                >
                  {item.PRODUCT[0]?.SerialNo}
                </div>

                <div
                  className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}
                >
                  วันที่ทำสัญญา:
                </div>
                <div
                  className={`col-5 col-md-9 fw-bold text-gray-800 ${styles.fontSize}`}
                >
                  {formatToBE(item.CONTRACT[0]?.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {status === "PENDING" && (
        <div className="d-flex flex-column flex-md-row align-items-center bg-light-secondary rounded p-5 mb-3 col-12">
          <span className="text-warning me-5 d-none d-md-inline">
            <KTIcon iconName="abstract-26" className="text-primary fs-1 me-5" />
          </span>

          <div className="flex-grow-1 me-2">
            {/* <div className='fw-bold text-gray-800 text-hover-black fs-6'>
              {`REFNO: ${item.REFNO}`}
            </div> */}
            {customerRow}
            {serialRow}
            {dateRow}
            {statusTxt}
          </div>
        </div>
      )}

      {status === "FINISH" && (
        <Link to="/sale/cancel" state={item}>
          <div
            className="
        d-flex flex-column flex-md-row align-items-center
        bg-light-success rounded
        px-2 px-md-3 
        py-2 mb-2
      "
          >
            {/* ไอคอนฝั่งซ้าย (ซ่อนบนมือถือ) */}
            <span className="d-none d-md-inline me-2">
              <KTIcon iconName="abstract-26" className="text-success fs-1" />
            </span>

            {/* เนื้อหา */}
            <div className="flex-grow-1">
              <div className="row gx-2 gy-1 align-items-center">
                <div
                  className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}
                >
                  เลขที่สัญญา:
                </div>
                <div
                  className={`col-7 col-md-9 fw-bold text-gray-800 ${styles.fontSize}`}
                >
                  {item.NEWREFNO}
                </div>

                {/* label: ใช้ col-4 บนมือถือ, col-md-3 บน desktop */}
                <div
                  className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}
                >
                  ชื่อลูกค้า:
                </div>
                {/* value: กินที่เหลือ */}
                <div
                  className={`col-7 col-md-9 fw-bold text-gray-800 ${styles.fontSize}`}
                >
                  {item.CUSTOMERDETAIL[0]?.CUSTOMERNAME}{" "}
                  {item.CUSTOMERDETAIL[0]?.CUSTOMERLASTNAME}
                </div>

                <div
                  className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}
                >
                  S/N:
                </div>
                <div
                  className={`col-7 col-md-9 fw-bold text-gray-800 ${styles.fontSize}`}
                >
                  {item.PRODUCT[0]?.SerialNo}
                </div>

                <div
                  className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}
                >
                  วันที่ทำสัญญา:
                </div>
                <div
                  className={`col-7 col-md-9 fw-bold text-gray-800 ${styles.fontSize}`}
                >
                  {formatToBE(item.CONTRACT[0]?.createdAt)}
                </div>
                <div
                  className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}
                >
                  สถานะตรวจสอบ:
                </div>
                <div
                  className={`col-7 col-md-9 fw-bold text-gray-800 ${styles.fontSize} `}
                >
                  <span
                    className={`${checkerStatusClass[rawCheckerStatus] ?? "badge badge-light"} ${styles.statusBadgeBig}`}
                  >
                    {checkerStatusText}
                  </span>
                </div>
                {checkerCommentText && (
                  <>
                    <div className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}>
                      หมายเหตุ:
                    </div>
                    <div className={`col-7 col-md-9 fw-bold text-gray-800 ${styles.fontSize}`}>
                      <span className="text-danger">{checkerCommentText}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Link>
      )}

      {status === "CANCEL" && (
        <Link to="/sale/cancel" state={item}>
          <div
            className="
        d-flex flex-column flex-md-row align-items-center
        bg-light-danger rounded
        px-2 px-md-3 
        py-2 mb-2
      "
          >
            {/* ไอคอนฝั่งซ้าย (ซ่อนบนมือถือ) */}
            <span className="d-none d-md-inline me-2">
              <KTIcon iconName="abstract-26" className="text-danger fs-1" />
            </span>

            {/* เนื้อหา */}
            <div className="flex-grow-1">
              <div className="row gx-2 gy-1 align-items-center">
                <div
                  className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}
                >
                  เลขที่สัญญา:
                </div>
                <div
                  className={`col-7 col-md-9 fw-bold text-gray-800 ${styles.fontSize}`}
                >
                  {item.NEWREFNO}
                </div>

                {/* label: ใช้ col-4 บนมือถือ, col-md-3 บน desktop */}
                <div
                  className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}
                >
                  ชื่อลูกค้า:
                </div>
                {/* value: กินที่เหลือ */}
                <div
                  className={`col-7 col-md-9 fw-bold text-gray-800 ${styles.fontSize}`}
                >
                  {item.CUSTOMERDETAIL[0]?.CUSTOMERNAME}{" "}
                  {item.CUSTOMERDETAIL[0]?.CUSTOMERLASTNAME}
                </div>

                <div
                  className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}
                >
                  S/N:
                </div>
                <div
                  className={`col-7 col-md-9 fw-bold text-gray-800 ${styles.fontSize}`}
                >
                  {item.PRODUCT[0]?.SerialNo}
                </div>

                <div
                  className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}
                >
                  วันที่ทำสัญญา:
                </div>
                <div
                  className={`col-7 col-md-9 fw-bold text-gray-800 ${styles.fontSize}`}
                >
                  {formatToBE(item.CONTRACT[0]?.createdAt)}
                </div>
                <div
                  className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}
                >
                  สถานะตรวจสอบ:
                </div>
                <div
                  className={`col-7 col-md-9 fw-bold text-gray-800 ${styles.fontSize} `}
                >
                  <span
                    className={`${checkerStatusClass[rawCheckerStatus] ?? "badge badge-light"} ${styles.statusBadgeBig}`}
                  >
                    {checkerStatusText}
                  </span>
                </div>
                {checkerCommentText && (
                  <>
                    <div className={`col-5 col-md-3 fw-semibold text-gray-700 ${styles.fontSize}`}>
                      หมายเหตุ:
                    </div>
                    <div className={`col-7 col-md-9 fw-bold text-gray-800 ${styles.fontSize}`}>
                      <span className="text-danger">{checkerCommentText}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export { SalesItemNumber };
