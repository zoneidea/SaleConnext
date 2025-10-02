import styles from "@/styles/style.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useRef, useMemo } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from "../../modules/auth/core/Auth";
import SignaturePad from "react-signature-pad-wrapper";
import {
  useUUIDStore,
  useSaveProductStore,
  useSaveDiscountStore,
  useSaveCustomerStore,
  useSaveAddressStore,
} from "../../modules/stores/stepsStore";
import Swal from "sweetalert2";

interface ItemProps {
  REFNO: string;
  CONTNO: string;
  EMPID: string;
  TEAMSALE: string;
  SALECODE: string;
  SUPEMPID: string;
  SECEMPID: string;
  STATUS: string;
  PRODUCT: any[];
  CUSTOMERSTATUS: any[];
  DISCOUNT: any[];
  CUSTOMERDETAIL: any[];
  ADDRESS: any[];
  PDPA: any[];
  CONTRACT: any[];
  IMAGE: any[];
  CHECKERCOMMENT: any[];
  SALEEMPLOYEE?: any[];
  NEWREFNO?: string;
}

// state ที่ PDPA ส่งมาเป็นแบบแบน { ...item, from: '/sale/pdpa' }
type IncomingState = (ItemProps & { from?: string }) | undefined;

const SalesContract: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ⬇️ state จาก PDPA (หรือหน้าอื่น)
  const state = location.state as IncomingState;
  // console.log(`state`, state);

  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || "";
  const TeamSale = auth?.data?.[0]?.TeamSale || "";
  const SaleCode = auth?.data?.[0]?.SaleCode || "";
  const SupEmpId = auth?.data?.[0]?.SupEmp || "";
  const SecEmpId = auth?.data?.[0]?.SecEmp || "";

  const { REFNO: storeRefNo } = useUUIDStore();

  const [draft, setDraft] = useState<ItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
  const GET_ALL_CONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}&ProcessType=${auth.processtype}`;

  // โหลด draft เสมอ (เพื่อให้ sync กับ DB)
  useEffect(() => {
    let ignore = false;
    (async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(GET_ALL_CONTRACT_URL);
        if (!ignore && Array.isArray(res.data?.data)) {
          setDraft(res.data.data);
        }
      } catch (e) {
        console.error("Error fetching GetAllContract:", e);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [GET_ALL_CONTRACT_URL]);

  // ✅ “REFNO กลาง” ที่จะใช้ทั้งไฟล์ (ให้ state มาก่อน ถ้าไม่มีค่อย fallback เป็น store)
  const refNoToUse = state?.REFNO || storeRefNo || "";

  // ✅ หา record จาก draft ด้วย REFNO ตัวเดียวกัน
  const recordFromDraft = useMemo(
    () => draft.find(d => d.REFNO === refNoToUse) || null,
    [draft, refNoToUse]
  );

  // ✅ ข้อมูลที่ใช้เรนเดอร์ทั้งหมด
  // ถ้ามีใน draft (อัปเดตสุด) ใช้ draft ก่อน, ถ้ายังไม่เจอใช้ state
  const data: ItemProps = (recordFromDraft || state || ({} as ItemProps)) as ItemProps;
  // console.log(`data`, data);

  // console.log("refNoToUse:", refNoToUse);
  // console.log("recordFromDraft:", recordFromDraft);
  // console.log("data:", data);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

  const { PRODUCT } = useSaveProductStore();
  const { DISCOUNT } = useSaveDiscountStore();
  const { saveCustomerTypes } = useSaveCustomerStore();
  const { addressCard, addressInstallation, addressPayment, addressTax } = useSaveAddressStore();

  const totalPrice = data?.PRODUCT?.[0]?.Package?.[0]?.TOTALPRICE || 0;
  const discountAmount = data?.DISCOUNT?.[0]?.DISCOUNTAMOUNT || 0;
  const netPrice = totalPrice - discountAmount;

  const signaturePadRef = useRef<any>(null);
  const [signatureDataURL, setSignatureDataURL] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearSignature = () => {
    signaturePadRef.current?.clear();
    setSignatureDataURL(null);
  };

  const saveSignature = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const dataUrl = signaturePadRef.current.toDataURL("image/png");
      setSignatureDataURL(dataUrl.replace(/^data:image\/png;base64,/, ""));
      signaturePadRef.current.clear();
    } else {
      Swal.fire("กรุณาลงชื่อก่อนบันทึก");
    }
  };

  // const handleNextClick = async () => {
  //   try {
  //     // ใช้ REFNO ตัวเดียวกับที่แสดงผล
  //     const payloadBase = {
  //       REFNO: refNoToUse,
  //       EMPID: EmpId,
  //       TEAMSALE: TeamSale,
  //       SALECODE: SaleCode,
  //       SUPEMPID: SupEmpId,
  //       SECEMPID: SecEmpId,
  //     };

  //     const updateContract = await axios.post(
  //       UPDATECONTACT,
  //       {
  //         ...payloadBase,
  //         FIELD: "CONTRACT",
  //         DATA: { createdAt: formattedDate, signature: signatureDataURL },
  //       },
  //       { headers: { "Content-Type": "application/json" } }
  //     );

  //     if (updateContract.status === 200) {
  //       const finishResponse = await axios.post(
  //         UPDATECONTACT,
  //         { ...payloadBase, FIELD: "PAYMENT", DATA: "DRAFT" },
  //         { headers: { "Content-Type": "application/json" } }
  //       );

  //       if (finishResponse.status === 200) {
  //         Swal.fire({
  //           icon: "success",
  //           title: "สำเร็จ!",
  //           text: "บันทึกสัญญาเรียบร้อยแล้ว",
  //           timer: 2000,
  //           showConfirmButton: false,
  //         }).then(() => {
  //           // ส่ง item ที่เรนเดอร์อยู่ (ผูก REFNO เดียวกัน)
  //           navigate("/firstBill/CreateFirstBill", { state: { item: data, from: location.pathname } });
  //         });
  //       } else {
  //         throw new Error("ไม่สามารถอัปเดตสถานะ PAYMENT ได้");
  //       }
  //     } else {
  //       throw new Error("ไม่สามารถอัปเดตสัญญาได้");
  //     }
  //   } catch (error) {
  //     console.error("Error updating contract or status:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "เกิดข้อผิดพลาด!",
  //       text: "ไม่สามารถบันทึกสัญญาหรืออัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง",
  //       confirmButtonText: "ตกลง",
  //     });
  //   }
  // };

  const handleNextClick = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    let succeeded = false;

    try {
      const payloadBase = {
        REFNO: refNoToUse,
        EMPID: EmpId,
        TEAMSALE: TeamSale,
        SALECODE: SaleCode,
        SUPEMPID: SupEmpId,
        SECEMPID: SecEmpId,
      };

      const updateContract = await axios.post(
        UPDATECONTACT,
        { ...payloadBase, FIELD: "CONTRACT", DATA: { createdAt: formattedDate, signature: signatureDataURL } },
        { headers: { "Content-Type": "application/json" } }
      );
      if (updateContract.status !== 200) throw new Error("ไม่สามารถอัปเดตสัญญาได้");

      const finishResponse = await axios.post(
        UPDATECONTACT,
        { ...payloadBase, FIELD: "PAYMENT", DATA: "DRAFT" },
        { headers: { "Content-Type": "application/json" } }
      );
      if (finishResponse.status !== 200) throw new Error("ไม่สามารถอัปเดตสถานะ PAYMENT ได้");

      succeeded = true;
      await Swal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: "บันทึกสัญญาเรียบร้อยแล้ว",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/sale/salesCreateFirstBill", { state: { item: data, from: location.pathname } });
    } catch (error) {
      console.error("Error updating contract or status:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถบันทึกสัญญาหรืออัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
      });
    } finally {
      if (!succeeded) setIsSubmitting(false); // สำเร็จแล้วจะ navigate ออก ไม่ต้องปลดล็อก
    }
  };

  const formatToBE = (isoDate?: string) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear() + 543;
    return `${dd}/${mm}/${yyyy}`;
  };

  const hasSigned = !!data?.CONTRACT?.[0]?.signature;
  const hasNewSignature = !!(signatureDataURL && signatureDataURL.trim().length > 0);
  const canShowSaveContractBtn = !hasSigned && hasNewSignature;

  return (
    <>
      <Content>
        <div style={{ position: "relative" }}>
          <div className="d-flex justify-content-between align-items-center my-5">
            <div className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
              <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                {data?.PRODUCT?.[0]?.Package?.[0]?.PACKAGETYPEID === 1 ? (
                  <li className={`breadcrumb-item ${styles.titlePage}`}>ใบสัญญา</li>
                ) : (
                  <li className={`breadcrumb-item ${styles.titlePage}`}>ใบสัญญาเช่าซื้อ</li>
                )}
              </ul>
            </div>
          </div>

          <p className={`${styles.label}`}>เลขที่ขาย:</p>
          <p className={`${styles.titlePage}`}>{refNoToUse}</p>

          {/* Card Body */}
          <div className="card mb-10">
            <div className="card-body py-5">
              <div className="row mb-7">
                <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>
                  วันที่ทำสัญญา
                </label>
                <div className="col-lg-8">
                  <span className={`fw-bolder text-gray-900 ${styles.label}`}>
                    {formatToBE(formattedDate)}
                  </span>
                </div>
              </div>

              {data?.NEWREFNO && (
                <div className="row mb-10">
                  <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                    เลขที่สัญญา
                  </label>
                  <div className="col-lg-8">
                    <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                      {data?.NEWREFNO}
                    </span>
                  </div>
                </div>
              )}

              <div className="row align-items-center mb-10">
                <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                  พนักงานขาย
                </label>
                <div className="col-lg-8 d-flex justify-content-between">
                  <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                    {data?.SALEEMPLOYEE?.[0]?.SALEEMPLOYEE?.FName}{" "}
                    {data?.SALEEMPLOYEE?.[0]?.SALEEMPLOYEE?.LName} -{" "}
                    {data?.SALEEMPLOYEE?.[0]?.SALEEMPLOYEE?.SaleEmp}
                  </span>
                </div>
              </div>

              <div className="row mb-7">
                <label className={`col-lg-4 fw-bold text-muted ${styles.label}`}>
                  ชื่อลูกค้า
                </label>
                <div className="col-lg-8">
                  <span className={`fw-bolder text-gray-900 ${styles.label}`}>
                    {data?.CUSTOMERDETAIL?.[0]?.PREFIX?.[0]?.PREFIXNAME || ""}{" "}
                    {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERNAME || ""}{" "}
                    {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERLASTNAME || ""}
                  </span>
                </div>
              </div>

              {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERID?.length > 0 && (
                <div className="row mb-7">
                  <label className={`col-lg-4 text-muted ${styles.label}`}>
                    {data.CUSTOMERDETAIL?.[0]?.CUSTOMERTYPE === "1"
                      ? "เลขประจำตัวผู้เสียภาษี"
                      : "เลขที่บัตรประชาชน"}
                  </label>
                  <div className="col-lg-8">
                    <span className={styles.label}>
                      {data.CUSTOMERDETAIL?.[0]?.CUSTOMERID}
                    </span>
                  </div>
                </div>
              )}

              {/* ที่อยู่ต่าง ๆ (ตัด logic เดิมมาวางเหมือนเดิม) */}
              {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSNUMBER && (
                <div className="row mb-7">
                  <label className={`col-lg-4 text-muted ${styles.label}`}>
                    ที่อยู่บัตรประชาชน
                  </label>
                  <div className="col-lg-8">
                    <span className={`${styles.label}`}>
                      {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSNUMBER || ""}&nbsp;
                      {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSMOO
                        ? `หมู่ที่ ${data.ADDRESS[0].ADDRESSCARD.ADDRESSMOO} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSSOI
                        ? `ซอย${data.ADDRESS[0].ADDRESSCARD.ADDRESSSOI} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSROAD
                        ? `ถนน${data.ADDRESS[0].ADDRESSCARD.ADDRESSROAD} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSSUBDISTRICTNAME && (
                        <>
                          {data.ADDRESS[0].ADDRESSCARD.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                            ? "แขวง"
                            : "ตำบล"}
                          {data.ADDRESS[0].ADDRESSCARD.ADDRESSSUBDISTRICTNAME}
                        </>
                      )}{" "}
                      {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSDISTRICTNAME && (
                        <>
                          {data.ADDRESS[0].ADDRESSCARD.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                            ? "เขต"
                            : "อำเภอ"}
                          {data.ADDRESS[0].ADDRESSCARD.ADDRESSDISTRICTNAME}
                        </>
                      )}{" "}
                      {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME
                        ? `จังหวัด${data.ADDRESS[0].ADDRESSCARD.ADDRESSPROVINCENAME} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSCARD?.ADDRESSZIPCODE ||
                        ""}
                    </span>
                  </div>
                </div>
              )}

              {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER && (
                <div className="row mb-10">
                  <label className={`col-lg-4 text-muted ${styles.label}`}>
                    ที่อยู่ติดตั้ง
                  </label>
                  <div className="col-lg-8">
                    <span className={`${styles.label}`}>
                      {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER || ""}&nbsp;
                      {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSMOO
                        ? `หมู่ที่ ${data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSMOO} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSSOI
                        ? `ซอย${data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSSOI} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSROAD
                        ? `ถนน${data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSROAD} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME && (
                        <>
                          {data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                            ? "แขวง"
                            : "ตำบล"}
                          {data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME}
                        </>
                      )}{" "}
                      {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME && (
                        <>
                          {data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                            ? "เขต"
                            : "อำเภอ"}
                          {data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSDISTRICTNAME}
                        </>
                      )}{" "}
                      {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME
                        ? `จังหวัด${data.ADDRESS[0].ADDRESSINSTALLATION.ADDRESSPROVINCENAME} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE || ""}
                    </span>
                  </div>
                </div>
              )}

              {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER && (
                <div className="row mb-10">
                  <label className={`col-lg-4 text-muted ${styles.label}`}>
                    ที่อยู่เก็บเงิน
                  </label>
                  <div className="col-lg-8">
                    <span className={`${styles.label}`}>
                      {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER || ""}&nbsp;
                      {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSMOO
                        ? `หมู่ที่ ${data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSMOO} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSSOI
                        ? `ซอย${data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSSOI} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSROAD
                        ? `ถนน${data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSROAD} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME && (
                        <>
                          {data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                            ? "แขวง"
                            : "ตำบล"}
                          {data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME}
                        </>
                      )}{" "}
                      {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSDISTRICTNAME && (
                        <>
                          {data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                            ? "เขต"
                            : "อำเภอ"}
                          {data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSDISTRICTNAME}
                        </>
                      )}{" "}
                      {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME
                        ? `จังหวัด${data.ADDRESS[0].ADDRESSPAYMENT.ADDRESSPROVINCENAME} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE || ""}
                    </span>
                  </div>
                </div>
              )}

              {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME && (
                <div className="row mb-10">
                  <label className={`col-lg-4 text-muted ${styles.label}`}>
                    ที่อยู่เสึยภาษี
                  </label>
                  <div className="col-lg-8">
                    <span className={`${styles.label}`}>
                      {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSNUMBER || ""}&nbsp;
                      {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSMOO
                        ? `หมู่ที่ ${data.ADDRESS[0].ADDRESSTAX.ADDRESSMOO} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSSOI
                        ? `ซอย${data.ADDRESS[0].ADDRESSTAX.ADDRESSSOI} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSROAD
                        ? `ถนน${data.ADDRESS[0].ADDRESSTAX.ADDRESSROAD} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSSUBDISTRICTNAME && (
                        <>
                          {data.ADDRESS[0].ADDRESSTAX.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                            ? "แขวง"
                            : "ตำบล"}
                          {data.ADDRESS[0].ADDRESSTAX.ADDRESSSUBDISTRICTNAME}
                        </>
                      )}{" "}
                      {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSDISTRICTNAME && (
                        <>
                          {data.ADDRESS[0].ADDRESSTAX.ADDRESSPROVINCENAME === "กรุงเทพมหานคร"
                            ? "เขต"
                            : "อำเภอ"}
                          {data.ADDRESS[0].ADDRESSTAX.ADDRESSDISTRICTNAME}
                        </>
                      )}{" "}
                      {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME
                        ? `จังหวัด${data.ADDRESS[0].ADDRESSTAX.ADDRESSPROVINCENAME} `
                        : ""}
                      {data?.ADDRESS?.[0]?.ADDRESSTAX?.ADDRESSZIPCODE || ""}
                    </span>
                  </div>
                </div>
              )}

              <div className="row mb-10">
                <label className={`col-lg-4 text-muted ${styles.label}`}>
                  เบอร์ที่ติดต่อได้
                </label>
                <div className="col-lg-8">
                  <span className={`${styles.label}`}>
                    {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERMOBILE ||
                      data?.ADDRESS?.[0]?.ADDRESSINSTALLATION?.ADDRESSPHONE ||
                      ""}
                  </span>
                </div>
              </div>

              {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERPHONE && (
                <div className="row mb-10">
                  <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                    เบอร์ที่ติดต่อได้ 2
                  </label>
                  <div className="col-lg-8">
                    <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                      {data?.CUSTOMERDETAIL?.[0]?.CUSTOMERPHONE}
                    </span>
                  </div>
                </div>
              )}

              <div className="row mb-10">
                <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                  สินค้า
                </label>
                <div className="col-lg-8">
                  <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                    {data?.PRODUCT?.[0]?.ItemDescription}
                  </span>
                </div>
              </div>

              {data?.PRODUCT?.[1]?.ItemDescription && (
                <div className="row mb-10">
                  <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                    สินค้าบันเดิล
                  </label>
                  <div className="col-lg-8">
                    <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                      {data?.PRODUCT?.[1]?.ItemDescription}
                    </span>
                  </div>
                </div>
              )}

              {data?.PRODUCT?.[0]?.Package?.[0]?.PACKAGETITLE && (
                <div className="row mb-10">
                  <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                    แพ็คเกจ
                  </label>
                  <div className="col-lg-8">
                    <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                      {data?.PRODUCT?.[0]?.Package?.[0]?.PACKAGETITLE}
                    </span>
                  </div>
                </div>
              )}

              {data?.PRODUCT?.[0]?.Package?.[0]?.TOTALPRICE && (
                <div className="row align-items-center mb-10">
                  <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                    ราคาสินค้า
                  </label>
                  <div className="col-lg-8 d-flex justify-content-between">
                    <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                      {Number(data?.PRODUCT?.[0]?.Package?.[0]?.TOTALPRICE).toLocaleString()}
                    </span>
                    <span className="badge badge-light-success">บาท</span>
                  </div>
                </div>
              )}

              {data?.DISCOUNT?.[0]?.TRADEIN?.TRADEINBRANDNAME && (
                <div className="row align-items-center mb-10">
                  <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                    เครื่องเทิร์น
                  </label>
                  <div className="col-lg-8 d-flex justify-content-between">
                    <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                      {data?.DISCOUNT?.[0]?.TRADEIN?.TRADEINBRANDNAME || "ไม่มี"}
                    </span>
                  </div>
                </div>
              )}

              {data?.DISCOUNT?.[0]?.DISCOUNTAMOUNT && (
                <div className="row align-items-center mb-10">
                  <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                    ส่วนลด
                  </label>
                  <div className="col-lg-8 d-flex justify-content-between">
                    <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                      {Number(data?.DISCOUNT?.[0]?.DISCOUNTAMOUNT).toLocaleString()}
                    </span>
                    <span className="badge badge-light-success">บาท</span>
                  </div>
                </div>
              )}

              {data?.DISCOUNT?.[0]?.GIFT?.GIFTNAME && (
                <div className="row align-items-center mb-10">
                  <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                    ของแถม
                  </label>
                  <div className="col-lg-8 d-flex justify-content-between">
                    <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                      {data?.DISCOUNT?.[0]?.GIFT?.GIFTNAME || "ไม่มี"}
                    </span>
                  </div>
                </div>
              )}

              <div className="row align-items-center mb-10">
                <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                  ราคาสุทธิ
                </label>
                <div className="col-lg-8 d-flex justify-content-between">
                  <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                    {Number(netPrice).toLocaleString()}
                  </span>
                  <span className="badge badge-light-success">บาท</span>
                </div>
              </div>

              {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
              {data?.PRODUCT?.[0]?.Package?.[0]?.PACKAGETYPEID !== 1 && (
                <>
                  <div className="row align-items-center mb-10">
                    <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                      งวดที่ 1 ที่ต้องชำระ
                    </label>
                    <div className="col-lg-8 d-flex justify-content-between">
                      <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                        {Number(
                          (data?.PRODUCT?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT || 0) -
                          (discountAmount || 0)
                        ).toLocaleString()}
                      </span>
                      <span className="badge badge-light-success">บาท</span>
                    </div>
                  </div>

                  {data?.PRODUCT?.[0]?.Package?.[0]?.PERIODDETAILS?.length > 1 && (
                    <div className="row align-items-center mb-10">
                      <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>
                        งวดที่ 2 ถึง{" "}
                        {data?.PRODUCT?.[0]?.Package?.[0]?.PERIODDETAILS?.length} ต้องชำระงวดละ
                      </label>
                      <div className="col-lg-8 d-flex justify-content-between">
                        <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>
                          {Number(
                            data?.PRODUCT?.[0]?.Package?.[0]?.PERIODDETAILS?.[1]?.PAYMENTAMOUNT || 0
                          ).toLocaleString()}
                        </span>
                        <span className="badge badge-light-success">บาท</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* --------------------- ลายเซ็น --------------------- */}
              <div className="mb-5" style={{ maxWidth: 600, margin: "0 auto" }}>
                {hasSigned ? (
                  <div className="text-center">
                    <p className={`${styles.label} mb-3`}>ลายเซ็นลูกค้า</p>
                    <img
                      src={`data:image/png;base64,${data.CONTRACT[0].signature}`}
                      alt="signature"
                      className="img-fluid"
                      style={{ border: "1px solid #ccc", borderRadius: 4 }}
                    />
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        border: "1px solid #d7dbde",
                        borderRadius: 4,
                        width: "100%",
                        height: 200,
                        overflow: "hidden",
                      }}
                    >
                      <SignaturePad
                        ref={signaturePadRef}
                        options={{ minWidth: 1, maxWidth: 3, penColor: "black" }}
                        canvasProps={{ style: { width: "100%", height: "100%" } }}
                      />
                    </div>

                    <div className="my-5">
                      <button type="button" className={`${styles.btnDanger} mx-5`} onClick={clearSignature}>
                        ลบลายเซ็น
                      </button>
                      <button type="button" className={`${styles.btnPrimary}`} onClick={saveSignature}>
                        บันทึกลายเซ็น
                      </button>
                    </div>

                    {signatureDataURL && (
                      <div className="mt-3">
                        <img
                          src={`data:image/png;base64,${signatureDataURL}`}
                          alt="signature"
                          className="img-fluid"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {canShowSaveContractBtn && (
            <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
              <button
                className={`${styles.btnSecondary}`}
                onClick={() => navigate("/sale/overview")}
                disabled={isSubmitting}
              >
                กลับหน้าแรก
              </button>
              <button
                className={`${styles.btnPrimary}`}
                type="button"
                onClick={handleNextClick}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    กำลังบันทึก…
                  </>
                ) : (
                  "บันทึกสัญญา"
                )}
              </button>
            </div>
          )}

          {hasSigned && (
            <>
              <button className={`${styles.btnSecondary}`}
                onClick={() => navigate("/sale/step", { state: state })}
              >
                ย้อนกลับ
              </button>
            </>
          )}

          {/******* หน้าจอเล็ก ******** */}
          {canShowSaveContractBtn && (
            <div className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
              style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1050 }}>
              <button
                className={`${styles.btnSecondary}`}
                onClick={() => navigate("/sale/overview")}
                disabled={isSubmitting}
              >
                กลับหน้าแรก
              </button>
              <button
                className={`${styles.btnPrimary}`}
                type="button"
                onClick={handleNextClick}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    กำลังบันทึก…
                  </>
                ) : (
                  "บันทึกสัญญา"
                )}
              </button>
            </div>
          )}

          {hasSigned && (
            <>
              <div
                className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
                style={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1050,
                }}
              >
                <button className={`${styles.btnSecondary}`}
                  onClick={() => navigate("/sale/step", { state: state })}
                >
                  ย้อนกลับ
                </button>
              </div>
            </>
          )}
        </div>
      </Content>
    </>
  );
};

export default SalesContract;