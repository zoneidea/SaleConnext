// import styles from '@/styles/style.module.css'
// import React, { useState } from "react";

// { /* Entries */ }
// export const EntriesDropdown = ({ onEntriesChange }: { onEntriesChange: (entries: number) => void }) => {
//   const [entries, setEntries] = useState<number>(10); // ค่าเริ่มต้นเป็น 10

//   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = Number(e.target.value);
//     setEntries(value); // อัปเดตค่าที่เลือก
//     onEntriesChange(value); // เรียกฟังก์ชันจาก props เพื่อส่งค่ากลับ
//   };

//   return (
//     <div className="d-flex align-items-center my-3">
//       <label className="me-2">Show</label>
//       <select
//         className="form-select"
//         style={{ width: "80px" }}
//         value={entries}
//         onChange={handleChange}
//       >
//         <option value="10">10</option>
//         <option value="25">25</option>
//         <option value="50">50</option>
//         <option value="100">100</option>
//       </select>
//       <label className="ms-2">entries</label>
//     </div>
//   ); ``
// };

// { /* Pagination */ }
// type PaginationTableProps = {
//   totalData: number; // จำนวนรายการทั้งหมด
//   entries: number; // จำนวนรายการต่อหน้า
//   currentPage: number; // หน้าปัจจุบัน
//   onPageChange: (page: number) => void; // ฟังก์ชันเปลี่ยนหน้า
// };

// export const PaginationTable: React.FC<PaginationTableProps> = ({
//   totalData,
//   entries,
//   currentPage,
//   onPageChange,
// }) => {
//   const totalPages = Math.ceil(totalData / entries); // คำนวณจำนวนหน้าทั้งหมด

//   // ฟังก์ชันเปลี่ยนหน้า
//   const handlePageChange = (page: number) => {
//     if (page > 0 && page <= totalPages) {
//       onPageChange(page);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-end">
//       {/* ปุ่ม Previous */}
//       <button
//         className="btn btn-outline-primary mx-1"
//         onClick={() => handlePageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//       >
//         <span className={`${styles.fontSize}`}>
//           ก่อนหน้า
//         </span>
//       </button>

//       {/* หมายเลขหน้า */}
//       {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//         <button
//           key={page}
//           className={`btn mx-1 ${currentPage === page ? "btn-primary" : "btn-outline-primary"
//             }`}
//           onClick={() => handlePageChange(page)}
//         >
//           <span className={`${styles.fontSize}`}>
//             {page}
//           </span>
//         </button>
//       ))}

//       {/* ปุ่ม Next */}

//       <button
//         className="btn btn-outline-primary mx-1"
//         onClick={() => handlePageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//       >
//         <span className={`${styles.fontSize}`}>
//           ถัดไป
//         </span>
//       </button>
//     </div>
//   );
// };



import React, { useEffect, useMemo, useState } from "react";
import styles from "@/styles/style.module.css";

/* -------------------- EntriesDropdown (คงเดิม) -------------------- */
interface EntriesDropdownProps {
  onEntriesChange: (entries: number) => void;
}
export const EntriesDropdown: React.FC<EntriesDropdownProps> = ({ onEntriesChange }) => {
  const [entries, setEntries] = useState<number>(10);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const n = Number(e.target.value);
    setEntries(n);
    onEntriesChange(n);
  };
  return (
    <div className="d-flex align-items-center my-3">
      <label className="me-2">Show</label>
      <select className="form-select" style={{ width: 80 }} value={entries} onChange={handleChange}>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      <label className="ms-2">entries</label>
    </div>
  );
};

/* -------------------- PaginationTable (ย่ออัตโนมัติ) -------------------- */
interface PaginationTableProps {
  totalData: number;
  entries: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

type PageToken = number | "DOTS";

/** สร้างลิสต์หมายเลขหน้า (มี ellipsis) ตามจำนวน siblings รอบ ๆ current */
function buildPages(totalPages: number, current: number, siblings: number): PageToken[] {
  const totalNumbers = siblings * 2 + 5; // first, last, current, 2*DOTS
  if (totalNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, totalPages);
  const showLeftDots = left > 2;
  const showRightDots = right < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const range = Array.from({ length: 3 + 2 * siblings }, (_, i) => i + 1);
    return [...range, "DOTS", totalPages];
  }
  if (showLeftDots && !showRightDots) {
    const count = 3 + 2 * siblings;
    const start = totalPages - count + 1;
    const range = Array.from({ length: count }, (_, i) => start + i);
    return [1, "DOTS", ...range];
  }
  const middle = Array.from({ length: right - left + 1 }, (_, i) => left + i);
  return [1, "DOTS", ...middle, "DOTS", totalPages];
}

export const PaginationTable: React.FC<PaginationTableProps> = ({
  totalData,
  entries,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalData / entries));
  const current = Math.min(Math.max(currentPage, 1), totalPages);

  // ปรับจำนวนปุ่มรอบ ๆ current ตามขนาดหน้าจอ
  const [siblings, setSiblings] = useState<number>(1);
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      // ปรับตาม breakpoint: ยิ่งจอเล็ก ยิ่งแสดงปุ่มน้อยลง
      if (w < 400) setSiblings(0);      // มือถือจอเล็กมาก: 0 ปุ่มรอบ ๆ (กระชับสุด)
      else if (w < 576) setSiblings(0); // มือถือ
      else if (w < 768) setSiblings(1); // แท็บเล็ตเล็ก
      else if (w < 992) setSiblings(1); // แท็บเล็ต/โน้ตบุ๊กเล็ก
      else setSiblings(2);              // จอใหญ่
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const pages = useMemo(() => buildPages(totalPages, current, siblings), [totalPages, current, siblings]);
  const go = (p: number) => {
    if (p >= 1 && p <= totalPages && p !== current) onPageChange(p);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center gap-2 mt-3"
      style={{
        flexWrap: "nowrap",     // คงให้บรรทัดเดียว
        overflow: "hidden",     // ❗ ไม่ให้สไลด์นอกจอ
        maxWidth: "100%",       // จำกัดให้อยู่ในความกว้างคอนเทนเนอร์
      }}
    >
      <button
        className="btn btn-outline-primary"
        onClick={() => go(current - 1)}
        disabled={current === 1}
      >
        <span className={styles.fontSize}>ก่อนหน้า</span>
      </button>

      {pages.map((p, idx) =>
        p === "DOTS" ? (
          <span key={`dots-${idx}`} className="px-1 text-muted user-select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            className={`btn ${p === current ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => go(p as number)}
          >
            <span className={styles.fontSize}>{p}</span>
          </button>
        )
      )}

      <button
        className="btn btn-outline-primary"
        onClick={() => go(current + 1)}
        disabled={current === totalPages}
      >
        <span className={styles.fontSize}>ถัดไป</span>
      </button>
    </div>
  );
};
