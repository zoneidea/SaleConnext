import { FC, useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers";
import { ThreeDot } from "react-loading-indicators";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from "../../modules/auth/core/Auth";
import { useLocation } from "react-router-dom";
import styles from "@/styles/style.module.css";

type Props = {
  payments: any[];
  isLoading: boolean;
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

// กำหนดตัวแปร URL ของแต่ละ API ไว้ก่อน (สมมติชื่อ)
const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
const VOID_RECEIPT_URL = `${API_URL_SALECONNEXT}/UpdatePayment/VoidReceipt`;
const UPDATE_CONTACT_URL = `${API_URL_SALECONNEXT}/UpdateContact/VoidContract`;
// หรือถ้าชื่อจริงๆ เป็นอะไร ก็เปลี่ยนตามจริง

const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
const GET_PAYMENT_URL = `${API_URL_MONGO}/Payment/GetPaymentPeriod`;

const ReceiptMock: FC = () => {
  const MySwal = withReactContent(Swal);
  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || "";
  const TeamSale = auth?.data?.[0]?.TeamSale || "";
  const EmpName = auth?.data?.[0]?.EmpName || "";

  // ดึง state ที่ส่งมาจาก navigate()
  const location = useLocation();
  const item = location.state as ItemProps;
  // console.log(`item`, item);

  const [finish, setFinish] = useState<any[]>([]);
  // console.log(`finish`, finish);
  const [isLoadingFinish, setIsLoadingFinish] = useState<boolean>(false);

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const GET_PAYMENT_URL = `${API_URL_MONGO}/Payment/GetPaymentPeriod`;

  useEffect(() => {
    if (item?.REFNO) {
      getDataFinish();
    }
  }, [item?.REFNO]);

  const getDataFinish = async () => {
    setIsLoadingFinish(true);
    try {
      const response = await axios.get(GET_PAYMENT_URL, {
        params: { 
          EMPID: EmpId, 
          TEAMSALE: TeamSale,
          ProcessType: auth.processtype
        },
      });
      // ดึง array ทั้งหมดมา
      const allPayments = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      // กรองเฉพาะอันที่ REFNO ตรงกับ item.REFNO
      const filtered = allPayments.filter((p: any) => p.REFNO === item.REFNO);
      setFinish(filtered);
    } catch (error) {
      console.error("Error fetching GET_PAYMENT_URL:", error);
    } finally {
      setIsLoadingFinish(false);
    }
  };

  return (
    <div
      style={{
        padding: 16,
        background: "#f8f9fa",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100vh",
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: 16,
          fontFamily: "monospace",
          fontSize: 14,
          color: "#333",
        }}
      >
        {/* ชื่อบริษัท + Tax ID */}
        <div className="text-center mt-5 mb-4">
          <span
            className={`${styles.fontSize} fw-bold`}
            style={{ color: "red" }}
          >
            ตัวอย่างใบรับเงิน
          </span>
        </div>

        {/* รายละเอียด */}
        <div>
          <div className={`d-flex justify-content-between ${styles.fontSize}`}>
            <span>วันที่รับเงิน</span>
            {/* <span>{dateTime}</span> */}
          </div>
          <div className={`d-flex justify-content-between ${styles.fontSize}`}>
            <span>เลขที่</span>
            {/* <span>{receiptNo}</span> */}
          </div>
          <div className={`d-flex justify-content-between ${styles.fontSize}`}>
            <span>เลขที่สัญญา</span>
            {/* <span>{contractNo}</span> */}
          </div>
          <div className={`d-flex justify-content-between ${styles.fontSize}`}>
            <span>ชื่อลูกค้า</span>
            {/* <span>{customerName}</span> */}
          </div>
          <div className={`d-flex justify-content-between ${styles.fontSize}`}>
            <span>สินค้า</span>
            {/* <span>{productName}</span> */}
          </div>
        </div>

        <hr />

        {/* ยอดจ่ายงวด */}
        <div>
          <div className={`d-flex justify-content-between ${styles.fontSize}`}>
            {/* <span>ชำระงวดที่ {periodNumber}</span>
            <span>{amount.toLocaleString()} บาท</span> */}
          </div>
          <div className={`d-flex justify-content-between ${styles.fontSize}`}>
            <span>ชำระงวดที่ 1</span>
            {/* <span>{amountText}</span> */}
          </div>
          <div className={`d-flex justify-content-between ${styles.fontSize}`}>
            <span>คงเหลือ</span>
            {/* <span>{remaining.toLocaleString()} บาท</span> */}
          </div>
        </div>

        <hr />

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 12 }}>
          {/* <div>{companyName}</div>
          <div>{footerLine1}</div> */}
        </div>

        {/* กล่องเบอร์โทร */}
        <div
          style={{
            marginTop: 12,
            border: "1px solid #444",
            borderRadius: 4,
            padding: "4px 8px",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          <div className={`${styles.label}`}>{EmpName}&nbsp;</div>
          <div className={`${styles.label}`}>ผู้รับเงิน</div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptMock;
