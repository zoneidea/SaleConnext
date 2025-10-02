import styles from '@/styles/style.module.css'
import React, { useState } from "react";

{ /* Entries */ }
export const EntriesDropdown = ({ onEntriesChange }: { onEntriesChange: (entries: number) => void }) => {
  const [entries, setEntries] = useState<number>(10); // ค่าเริ่มต้นเป็น 10

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setEntries(value); // อัปเดตค่าที่เลือก
    onEntriesChange(value); // เรียกฟังก์ชันจาก props เพื่อส่งค่ากลับ
  };

  return (
    <div className="d-flex align-items-center my-3">
      <label className="me-2">Show</label>
      <select
        className="form-select"
        style={{ width: "80px" }}
        value={entries}
        onChange={handleChange}
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      <label className="ms-2">entries</label>
    </div>
  ); ``
};

{ /* Pagination */ }
type PaginationTableProps = {
  totalData: number; // จำนวนรายการทั้งหมด
  entries: number; // จำนวนรายการต่อหน้า
  currentPage: number; // หน้าปัจจุบัน
  onPageChange: (page: number) => void; // ฟังก์ชันเปลี่ยนหน้า
};

export const PaginationTable: React.FC<PaginationTableProps> = ({
  totalData,
  entries,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalData / entries); // คำนวณจำนวนหน้าทั้งหมด

  // ฟังก์ชันเปลี่ยนหน้า
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="d-flex justify-content-end">
      {/* ปุ่ม Previous */}
      <button
        className="btn btn-outline-primary mx-1"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <span className={`${styles.fontSize}`}>
          ก่อนหน้า
        </span>
      </button>

      {/* หมายเลขหน้า */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`btn mx-1 ${currentPage === page ? "btn-primary" : "btn-outline-primary"
            }`}
          onClick={() => handlePageChange(page)}
        >
          <span className={`${styles.fontSize}`}>
            {page}
          </span>
        </button>
      ))}

      {/* ปุ่ม Next */}

      <button
        className="btn btn-outline-primary mx-1"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span className={`${styles.fontSize}`}>
          ถัดไป
        </span>
      </button>
    </div>
  );
};