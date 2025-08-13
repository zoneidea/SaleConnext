// ReceiptSlideshow.tsx
import React, { useState, useEffect, useRef, FC } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moduleStyles from "@/styles/style.module.css";

// Inline CSS as a template string
const styles = `
.slideshow-container { max-width: 350px; position: relative; margin: auto; }
.mySlides { display: none; }
.activeSlide { display: block; }
.fade { animation-name: fade; animation-duration: 1.5s; }
@keyframes fade { from { opacity: .4 } to { opacity: 1 } }
.prev, .next {
  cursor: pointer;
  position: absolute;
  top: 50%;
  padding: 16px;
  margin-top: -22px;a
  color: white;
  font-weight: bold;
  font-size: 18px;
  transition: 0.6s ease;
  border-radius: 0 3px 3px 0;
  background-color: rgba(0,0,0,0.5);
  user-select: none;
}
.prev { left: 0; border-radius: 3px 0 0 3px; }
.next { right: 0; border-radius: 3px 0 0 3px; }
.dot, .dotc {
  cursor: pointer;
  height: 15px;
  width: 15px;
  margin: 0 2px;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.6s ease;
}
.dot { background-color: #bbb; }
.dotc { background-color: red; color: white; }
.dot:hover, .dotc:hover, .active { background-color: #717171; }
.dotc.active { background-color: #7c0000; }
.flexRow { display: flex; justify-content: space-between; padding: 5px 0; }
`;

type Slide = {
  Cpmpany: string;
  DataType: string;
  DatePayment: string;
  ReceiptCode: string;
  CONTNO: string;
  CustomerName: string;
  ProductName: string;
  PaymentPeriodNumber: number;
  Amount: string;
  AmountCharacter: string;
  minPeriod: number;
  maxPeriod: number;
  balance: string;
  BalancesOfPeriod2: string;
  Accrued: string;
};

interface ItemProps {
  REFNO: string;
  CONTNO: string;
  EMPID: string;
  TEAMSALE: string;
  SALECODE: string;
  SUPEMPID: string;
  SECEMPID: string;
  STATUS: string;
  PRODUCT: [any];
  CUSTOMERSTATUS: [any];
  DISCOUNT: [any];
  CUSTOMERDETAIL: [any];
  ADDRESS: [any];
  PDPA: [any];
  CONTRACT: [any];
  IMAGE: [any];
  CHECKERCOMMENT: [any]; // แก้จาก CHECKKERCOMMENT
  item?: {
    REFNO: string;
  };
}

interface LocationState {
  item: ItemProps;
}

const ReceiptFirstBillFromCreateFirstBill: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const item = location.state as ItemProps;
  // console.log(`item`, item);

  const REFNO = item?.REFNO;

  const API_URL_GET_RECEIPT = import.meta.env.VITE_APP_API_PDPA_LETTER;
  const POST_RECEIPT_URL = (r: string) =>
    `${API_URL_GET_RECEIPT}/Electronic/Receipt?RefNo=${encodeURIComponent(r)}`;

  return (
    <div
      style={{
        textAlign: "center",
        /* ซ่อน scrollbar ของ parent */
        overflow: "hidden",
      }}
    >
      <iframe
        title="Receipt"
        src={POST_RECEIPT_URL(REFNO)}
        scrolling="no" /* Deprecated แต่ใช้ได้ผล */
        style={{
          width: 350,
          height: 700,
          border: "none",
          overflow: "hidden" /* ซ่อน scrollbar ภายใน iframe */,
          /* บาง browser */
          msOverflowStyle: "none" /* IE 10+ */,
          scrollbarWidth: "none" /* Firefox */,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: 8,
        }}
      />
      {/* ซ่อน scrollbar ของ WebKit (Chrome, Safari) */}
      <style>
        {`
          iframe::-webkit-scrollbar { 
            display: none; 
          }
        `}
      </style>

      <div className="d-none d-xl-flex justify-content-end align-items-center mt-5 mb-10">
        <button
          className={`${moduleStyles.btnPrimary}`}
          onClick={() => navigate("/firstBill/overview")}
        >
          จบการทำงาน
        </button>
      </div>

      {/* ปุ่มในหน้าจอเล็ก */}
      <div
        className="d-flex d-xl-none justify-content-end align-items-center bg-light p-3 border-top"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1050,
        }}
      >
        <button
          className={`${moduleStyles.btnPrimary}`}
          onClick={() => navigate("/firstBill/overview")}
        >
          จบการทำงาน
        </button>
      </div>
    </div>
  );
};

export default ReceiptFirstBillFromCreateFirstBill;
