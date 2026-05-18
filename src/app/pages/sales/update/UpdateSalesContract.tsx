import styles from "@/styles/style.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";
import { useState, useMemo, useEffect, useRef } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../../_metronic/helpers";
import {
  getLayoutFromLocalStorage,
  ILayout,
  LayoutSetup,
} from "../../../../_metronic/layout/core";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { TablesWidget5 } from "../../../../_metronic/partials/widgets";
import { useAuth } from "../../../modules/auth/core/Auth";
import {
  useUUIDStore,
  useSaveProductStore,
  useSaveDiscountStore,
  useSaveCustomerStore,
  useSaveAddressStore,
} from "../../../modules/stores/stepsStore";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SignaturePad from "react-signature-pad-wrapper";

interface ContractState {
  contNo: string;
}

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
}

interface ImagesType {
  IMAGECARD: string[];
  IMAGEGPS: string[];
  IMAGEMAP: string[];
  IMAGECUSTOMERHOME: string[];
  IMAGEINSTALLATION: string[];
  IMAGETDS: string[];
  IMAGECUSTOMER: string[];
  IMAGETRADEIN: string[];
}

const UpdateSalesContract: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const MySwal = withReactContent(Swal);

  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || "";
  const TeamSale = auth?.data?.[0]?.TeamSale || "";
  const SaleCode = auth?.data?.[0]?.SaleCode || "";
  const SupEmpId = auth?.data?.[0]?.SupEmp || "";
  const SecEmpId = auth?.data?.[0]?.SecEmp || "";

  const { REFNO } = useUUIDStore();

  const item = (location.state as ItemProps) || ({} as ItemProps);
  // console.log(`item`, item);

  const refno = item?.REFNO || "";

  // ป้องกัน undefined ด้วย default array
  const product = (item?.PRODUCT ?? []) as any[];
  const customerDetail = (item?.CUSTOMERDETAIL ?? []) as any[];
  const address = (item?.ADDRESS ?? []) as any[];

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
  const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}&ProcessType=${auth.processtype}`;
  const GET_IMAGES_API = `${API_URL_MONGO}/Contract/GetContractImage`;

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

  // helper: แปลงค่าใดๆ เป็นตัวเลขแล้ว format (กัน null/undefined/NaN)
  const toBaht = (v: unknown) => {
    const n = Number(v ?? 0);
    return Number.isFinite(n) ? n.toLocaleString() : "0";
  };

  const totalPrice = Number(product?.[0]?.Package?.[0]?.TOTALPRICE ?? 0);
  const discountAmount = Number(item?.DISCOUNT?.[0]?.DISCOUNTAMOUNT ?? 0);
  const netPrice = totalPrice - discountAmount;

  const signaturePadRef = useRef<any>(null);
  const [signatureDataURL, setSignatureDataURL] = useState<string | null>(null);

  const [images, setImages] = useState<ImagesType | null>(null);

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

  const isApiSaveSuccess = (response: any) => {
    const responseData = response?.data;
    const innerData = responseData?.data;
    const innerStatus = String(innerData?.status || "").toLowerCase();

    return (
      response?.status === 200 &&
      innerData &&
      innerStatus !== "error" &&
      innerStatus !== "fail" &&
      innerStatus !== "failed" &&
      innerStatus !== "false"
    );
  };

  const getApiErrorMessage = (response: any, fallback: string) => {
    return (
      response?.data?.data?.message ||
      response?.data?.message ||
      fallback
    );
  };

  const handleNextClick = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    let succeeded = false;

    try {
      const base = {
        REFNO: refno,
        EMPID: EmpId,
        TEAMSALE: TeamSale,
        SALECODE: SaleCode,
        SUPEMPID: SupEmpId,
        SECEMPID: SecEmpId,
      };

      const updateContract = await axios.post(
        UPDATECONTACT,
        {
          ...base,
          FIELD: "CONTRACT",
          DATA: {
            createdAt: formattedDate,
            signature: signatureDataURL,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!isApiSaveSuccess(updateContract)) {
        await MySwal.fire(
          "บันทึกไม่สำเร็จ",
          getApiErrorMessage(
            updateContract,
            "อัพเดตสัญญาไม่สำเร็จ กรุณาติดต่อผู้พัฒนา"
          ),
          "error"
        );
        return;
      }

      const finishResponse = await axios.post(
        UPDATECONTACT,
        {
          ...base,
          FIELD: "PAYMENT",
          DATA: "DRAFT",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!isApiSaveSuccess(finishResponse)) {
        await MySwal.fire(
          "บันทึกไม่สำเร็จ",
          getApiErrorMessage(
            finishResponse,
            "อัพเดตสถานะไม่สำเร็จ กรุณาติดต่อผู้พัฒนา"
          ),
          "error"
        );
        return;
      }

      succeeded = true;

      await Swal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: "บันทึกสัญญาเรียบร้อยแล้ว",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/sale/salesCreateFirstBill", {
        state: {
          item,
          from: location.pathname,
        },
      });
    } catch (error: any) {
      console.error("Error updating contract or status:", error);

      await MySwal.fire(
        "เกิดข้อผิดพลาด",
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "ไม่สามารถบันทึกสัญญาได้ กรุณาลองใหม่อีกครั้ง",
        "error"
      );
    } finally {
      if (!succeeded) {
        setIsSubmitting(false);
      }
    }
  };

  const handleCheckerClick = async () => {
    const response = await axios.post(
      UPDATECONTACT,
      {
        REFNO: item.REFNO,
        EMPID: EmpId,
        TEAMSALE: TeamSale,
        FIELD: "STATUS",
        DATA: "PENDING",
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.status === 200) {
      if (!response.data.data) {
        MySwal.fire("เกิดข้อผิดพลาด", "ส่งข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา", "error");
      } else {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ!",
          text: "ส่งข้อมูลตรวจสอบแล้ว",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/sale/overview");
      }
    } else {
      MySwal.fire("เกิดข้อผิดพลาด", response.data.message, "error");
    }
  };

  const isDataComplete = useMemo(() => {
    const hasImages =
      images && Object.values(images).some((field) => Array.isArray(field) && field.length > 0);

    return (
      Array.isArray(item.ADDRESS) &&
      item.ADDRESS.length > 0 &&
      Array.isArray(item.CUSTOMERDETAIL) &&
      item.CUSTOMERDETAIL.length > 0 &&
      Array.isArray(item.CUSTOMERSTATUS) &&
      item.CUSTOMERSTATUS.length > 0 &&
      Array.isArray(item.DISCOUNT) &&
      item.DISCOUNT.length > 0 &&
      Array.isArray(item.PDPA) &&
      item.PDPA.length > 0 &&
      Array.isArray(item.PRODUCT) &&
      item.PRODUCT.length > 0 &&
      hasImages
    );
  }, [item, images]);

  // draft/matchedItem (คงไว้ตามเดิมเผื่อใช้ต่อ)
  const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false);
  const [draft, setDraft] = useState<any[]>([]);
  const [matchedItem, setMatchedItem] = useState<ItemProps | null>(null);

  useEffect(() => {
    const getDataDraft = async () => {
      setIsLoadingDraft(true);
      try {
        const response = await axios.get(DRAFT_ALLCONTRACT_URL);
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        setDraft(data);
      } catch (error) {
        console.error("Error fetching DRAFT_ALLCONTRACT_URL:", error);
      } finally {
        setIsLoadingDraft(false);
      }
    };
    getDataDraft();
  }, []);

  useEffect(() => {
    if (!isLoadingDraft) {
      const found = draft.find((d) => d.REFNO === REFNO) || null;
      setMatchedItem(found);
    }
  }, [draft, isLoadingDraft, REFNO]);

  const formatToBE = (isoDate?: string) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear() + 543;
    return `${dd}/${mm}/${yyyy}`;
  };

  const hasSigned = !!item?.CONTRACT?.[0]?.signature;
  const hasNewSignature = !!(signatureDataURL && signatureDataURL.trim().length > 0);
  const canShowSaveContractBtn = !hasSigned && hasNewSignature;

  return (
    <>
      <Content>
        <div className="d-flex justify-content-between align-items-center my-5">
          <div
            id="kt_page_title"
            data-kt-swapper="true"
            data-kt-swapper-mode="prepend"
            data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
            className="page-title d-flex flex-wrap me-3 flex-column justify-content-ceดnter"
          >
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
              {product?.[0]?.Package?.[0]?.PACKAGETYPEID == 1 ? (
                <li className={`breadcrumb-item ${styles.titlePage}`}>ใบสัญญา</li>
              ) : (
                <li className={`breadcrumb-item ${styles.titlePage}`}>ใบสัญญาเช่าซื้อ</li>
              )}
            </ul>
          </div>
        </div>

        <span className={`${styles.fontSize}`}>เลขที่ขาย: </span>
        <span className={`${styles.titlePage}`}>{refno}</span>

        {/* Card Body */}
        <div className="card mb-10">
          <div className="card-body py-5">
            <div className="row my-7">
              <label className={`col-lg-4 text-muted ${styles.label}`}>วันที่ทำสัญญา</label>
              <div className="col-lg-8">
                <span className={`${styles.label}`}>{formatToBE(formattedDate)}</span>
              </div>
            </div>

            <div className="row mb-7">
              <label className={`col-lg-4 text-muted ${styles.label}`}>ชื่อลูกค้า</label>
              <div className="col-lg-8">
                <span className={`${styles.label}`}>
                  {customerDetail?.[0]?.CUSTOMERNAME} {customerDetail?.[0]?.CUSTOMERLASTNAME}
                </span>
              </div>
            </div>

            {customerDetail?.[0]?.CUSTOMERID && (
              <div className="row mb-7">
                {customerDetail?.[0]?.CUSTOMERTYPE === "1" ? (
                  <label className={`col-lg-4 text-muted ${styles.label}`}>เลขประจำตัวผู้เสียภาษี</label>
                ) : (
                  <label className={`col-lg-4 text-muted ${styles.label}`}>เลขที่บัตรประชาชน</label>
                )}
                <div className="col-lg-8">
                  <span className={`${styles.label}`}>{customerDetail?.[0]?.CUSTOMERID}</span>
                </div>
              </div>
            )}

            {address?.[0]?.ADDRESSCARD?.ADDRESSNUMBER && (
              <div className="row mb-7">
                <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่บัตรประชาชน</label>
                <div className="col-lg-8">
                  <span className={`${styles.label}`}>
                    {address?.[0]?.ADDRESSCARD?.ADDRESSNUMBER || ""}&nbsp;
                    {address?.[0]?.ADDRESSCARD?.ADDRESSMOO ? `หมู่ที่ ${address[0].ADDRESSCARD.ADDRESSMOO} ` : ""}
                    {address?.[0]?.ADDRESSCARD?.ADDRESSSOI ? `ซอย${address[0].ADDRESSCARD.ADDRESSSOI} ` : ""}
                    {address?.[0]?.ADDRESSCARD?.ADDRESSROAD ? `ถนน${address[0].ADDRESSCARD.ADDRESSROAD} ` : ""}
                    {address?.[0]?.ADDRESSCARD?.ADDRESSSUBDISTRICTNAME && (
                      <>
                        {address?.[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME === "กรุงเทพมหานคร" ? "แขวง" : "ตำบล"}
                        {address[0].ADDRESSCARD.ADDRESSSUBDISTRICTNAME}
                      </>
                    )}{" "}
                    {address?.[0]?.ADDRESSCARD?.ADDRESSDISTRICTNAME && (
                      <>
                        {address?.[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME === "กรุงเทพมหานคร" ? "เขต" : "อำเภอ"}
                        {address[0].ADDRESSCARD.ADDRESSDISTRICTNAME}
                      </>
                    )}{" "}
                    {address?.[0]?.ADDRESSCARD?.ADDRESSPROVINCENAME ? `จังหวัด${address[0].ADDRESSCARD.ADDRESSPROVINCENAME} ` : ""}
                    {address?.[0]?.ADDRESSCARD?.ADDRESSZIPCODE || ""}
                  </span>
                </div>
              </div>
            )}

            {address?.[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER && (
              <div className="row mb-10">
                <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่ติดตั้ง</label>
                <div className="col-lg-8">
                  <span className={`${styles.label}`}>
                    {address?.[0]?.ADDRESSINSTALLATION?.ADDRESSNUMBER || ""}&nbsp;
                    {address?.[0]?.ADDRESSINSTALLATION?.ADDRESSMOO ? `หมู่ที่ ${address[0].ADDRESSINSTALLATION.ADDRESSMOO} ` : ""}
                    {address?.[0]?.ADDRESSINSTALLATION?.ADDRESSSOI ? `ซอย${address[0].ADDRESSINSTALLATION.ADDRESSSOI} ` : ""}
                    {address?.[0]?.ADDRESSINSTALLATION?.ADDRESSROAD ? `ถนน${address[0].ADDRESSINSTALLATION.ADDRESSROAD} ` : ""}
                    {address?.[0]?.ADDRESSINSTALLATION?.ADDRESSSUBDISTRICTNAME && (
                      <>
                        {address?.[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME === "กรุงเทพมหานคร" ? "แขวง" : "ตำบล"}
                        {address[0].ADDRESSINSTALLATION.ADDRESSSUBDISTRICTNAME}
                      </>
                    )}{" "}
                    {address?.[0]?.ADDRESSINSTALLATION?.ADDRESSDISTRICTNAME && (
                      <>
                        {address?.[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME === "กรุงเทพมหานคร" ? "เขต" : "อำเภอ"}
                        {address[0].ADDRESSINSTALLATION.ADDRESSDISTRICTNAME}
                      </>
                    )}{" "}
                    {address?.[0]?.ADDRESSINSTALLATION?.ADDRESSPROVINCENAME ? `จังหวัด${address[0].ADDRESSINSTALLATION.ADDRESSPROVINCENAME} ` : ""}
                    {address?.[0]?.ADDRESSINSTALLATION?.ADDRESSZIPCODE || ""}
                  </span>
                </div>
              </div>
            )}

            {address?.[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER && (
              <div className="row mb-10">
                <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่เก็บเงิน</label>
                <div className="col-lg-8">
                  <span className={`${styles.label}`}>
                    {address?.[0]?.ADDRESSPAYMENT?.ADDRESSNUMBER || ""}&nbsp;
                    {address?.[0]?.ADDRESSPAYMENT?.ADDRESSMOO ? `หมู่ที่ ${address[0].ADDRESSPAYMENT.ADDRESSMOO} ` : ""}
                    {address?.[0]?.ADDRESSPAYMENT?.ADDRESSSOI ? `ซอย${address[0].ADDRESSPAYMENT.ADDRESSSOI} ` : ""}
                    {address?.[0]?.ADDRESSPAYMENT?.ADDRESSROAD ? `ถนน${address[0].ADDRESSPAYMENT.ADDRESSROAD} ` : ""}
                    {address?.[0]?.ADDRESSPAYMENT?.ADDRESSSUBDISTRICTNAME && (
                      <>
                        {address?.[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME === "กรุงเทพมหานคร" ? "แขวง" : "ตำบล"}
                        {address[0].ADDRESSPAYMENT.ADDRESSSUBDISTRICTNAME}
                      </>
                    )}{" "}
                    {address?.[0]?.ADDRESSPAYMENT?.ADDRESSDISTRICTNAME && (
                      <>
                        {address?.[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME === "กรุงเทพมหานคร" ? "เขต" : "อำเภอ"}
                        {address[0].ADDRESSPAYMENT.ADDRESSDISTRICTNAME}
                      </>
                    )}{" "}
                    {address?.[0]?.ADDRESSPAYMENT?.ADDRESSPROVINCENAME ? `จังหวัด${address[0].ADDRESSPAYMENT.ADDRESSPROVINCENAME} ` : ""}
                    {address?.[0]?.ADDRESSPAYMENT?.ADDRESSZIPCODE || ""}
                  </span>
                </div>
              </div>
            )}

            {address?.[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME && (
              <div className="row mb-10">
                <label className={`col-lg-4 text-muted ${styles.label}`}>ที่อยู่เสึยภาษี</label>
                <div className="col-lg-8">
                  <span className={`${styles.label}`}>
                    {address?.[0]?.ADDRESSTAX?.ADDRESSNUMBER || ""}&nbsp;
                    {address?.[0]?.ADDRESSTAX?.ADDRESSMOO ? `หมู่ที่ ${address[0].ADDRESSTAX.ADDRESSMOO} ` : ""}
                    {address?.[0]?.ADDRESSTAX?.ADDRESSSOI ? `ซอย${address[0].ADDRESSTAX.ADDRESSSOI} ` : ""}
                    {address?.[0]?.ADDRESSTAX?.ADDRESSROAD ? `ถนน${address[0].ADDRESSTAX.ADDRESSROAD} ` : ""}
                    {address?.[0]?.ADDRESSTAX?.ADDRESSSUBDISTRICTNAME && (
                      <>
                        {address?.[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME === "กรุงเทพมหานคร" ? "แขวง" : "ตำบล"}
                        {address[0].ADDRESSTAX.ADDRESSSUBDISTRICTNAME}
                      </>
                    )}{" "}
                    {address?.[0]?.ADDRESSTAX?.ADDRESSDISTRICTNAME && (
                      <>
                        {address?.[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME === "กรุงเทพมหานคร" ? "เขต" : "อำเภอ"}
                        {address[0].ADDRESSTAX.ADDRESSDISTRICTNAME}
                      </>
                    )}{" "}
                    {address?.[0]?.ADDRESSTAX?.ADDRESSPROVINCENAME ? `จังหวัด${address[0].ADDRESSTAX.ADDRESSPROVINCENAME} ` : ""}
                    {address?.[0]?.ADDRESSTAX?.ADDRESSZIPCODE || ""}
                  </span>
                </div>
              </div>
            )}

            <div className="row mb-10">
              <label className={`col-lg-4 text-muted ${styles.label}`}>เบอร์ที่ติดต่อได้</label>
              <div className="col-lg-8">
                <span className={`${styles.label}`}>
                  {customerDetail?.[0]?.CUSTOMERMOBILE || address?.[0]?.ADDRESSINSTALLATION?.ADDRESSPHONE || ""}
                </span>
              </div>
            </div>

            {customerDetail?.[0]?.CUSTOMERPHONE && (
              <div className="row mb-10">
                <label className={`col-lg-4 fw-bold text-muted ${styles.fontSize}`}>เบอร์ที่ติดต่อได้ 2</label>
                <div className="col-lg-8">
                  <span className={`fw-bolder text-gray-900 ${styles.fontSize}`}>{customerDetail?.[0]?.CUSTOMERPHONE}</span>
                </div>
              </div>
            )}

            <div className="row mb-10">
              <label className={`col-lg-4 text-muted ${styles.label}`}>สินค้า</label>
              <div className="col-lg-8">
                <span className={`${styles.label}`}>{product?.[0]?.ItemDescription}</span>
              </div>
            </div>

            {product?.[0]?.Package?.[0]?.PACKAGETITLE && (
              <div className="row mb-10">
                <label className={`col-lg-4 text-muted ${styles.label}`}>แพ็คเกจ</label>
                <div className="col-lg-8">
                  <span className={`${styles.label}`}>{product?.[0]?.Package?.[0]?.PACKAGETITLE}</span>
                </div>
              </div>
            )}

            {item?.DISCOUNT?.[0]?.GIFT && (
              <div className="row align-items-center mb-10">
                <label className={`col-lg-4 text-muted ${styles.label}`}>ของแถม</label>
                <div className="col-lg-8 d-flex justify-content-between">
                  <span className={`${styles.label}`}>{item?.DISCOUNT?.[0]?.GIFT?.GIFTNAME || "ไม่มี"}</span>
                </div>
              </div>
            )}

            <div className="row align-items-center mb-10">
              <label className={`col-lg-4 text-muted ${styles.label}`}>ราคาสินค้า</label>
              <div className="col-lg-8 d-flex justify-content-between">
                <span className={`${styles.label}`}>{toBaht(product?.[0]?.Package?.[0]?.TOTALPRICE)}</span>
                <span className="badge badge-light-success">บาท</span>
              </div>
            </div>

            {item?.DISCOUNT?.[0] && item?.DISCOUNT?.[0]?.TRADEIN?.HASTRADEIN !== 0 && (
              <div className="row align-items-center mb-10">
                <label className={`col-lg-4 text-muted ${styles.label}`}>เครื่องเทิร์น</label>
                <div className="col-lg-8 d-flex justify-content-between">
                  <span className={`${styles.label}`}>{item?.DISCOUNT?.[0]?.TRADEIN?.TRADEINBRANDNAME || "ไม่มี"}</span>
                </div>
              </div>
            )}

            <div className="row align-items-center mb-10">
              <label className={`col-lg-4 text-muted ${styles.label}`}>ส่วนลด</label>
              <div className="col-lg-8 d-flex justify-content-between">
                <span className={`${styles.label}`}>
                  {Number(item?.DISCOUNT?.[0]?.DISCOUNTAMOUNT ?? 0) > 0 ? toBaht(item?.DISCOUNT?.[0]?.DISCOUNTAMOUNT) : "ไม่มี"}
                </span>
                <span className="badge badge-light-success">บาท</span>
              </div>
            </div>

            <div className="row align-items-center mb-10">
              <label className={`col-lg-4 text-muted ${styles.label}`}>ราคาสุทธิ</label>
              <div className="col-lg-8 d-flex justify-content-between">
                <span className={`${styles.label}`}>{toBaht(netPrice)}</span>
                <span className="badge badge-light-success">บาท</span>
              </div>
            </div>

            {/* ถ้าเป็นเงินสดไม่ต้องแสดง */}
            {product?.[0]?.Package?.[0]?.PACKAGETYPEID !== 1 &&
              product?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT !== undefined && (
                <>
                  <div className="row align-items-center mb-10">
                    <label className={`col-lg-4 text-muted ${styles.label}`}>งวดที่ 1 ที่ต้องชำระ</label>
                    <div className="col-lg-8 d-flex justify-content-between">
                      <span className={`${styles.label}`}>
                        {toBaht(
                          Number(product?.[0]?.Package?.[0]?.PERIODDETAILS?.[0]?.PAYMENTAMOUNT ?? 0) -
                          Number(discountAmount ?? 0)
                        )}
                      </span>
                      <span className="badge badge-light-success">บาท</span>
                    </div>
                  </div>

                  {product?.[0]?.Package?.[0]?.PERIODDETAILS?.length > 1 && (
                    <div className="row align-items-center mb-10">
                      <label className={`col-lg-4 text-muted ${styles.label}`}>
                        งวดที่ 2 ถึง {product?.[0]?.Package?.[0]?.PERIODDETAILS?.length} ต้องชำระงวดละ
                      </label>
                      <div className="col-lg-8 d-flex justify-content-between">
                        <span className={`${styles.label}`}>
                          {toBaht(product?.[0]?.Package?.[0]?.PERIODDETAILS?.[1]?.PAYMENTAMOUNT)}
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
                    src={`data:image/png;base64,${item.CONTRACT[0].signature}`}
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
            <button className={`${styles.btnSecondary}`} onClick={() => navigate("/sale/overview")}>
              กลับหน้าแรก
            </button>
          </>
        )}

        {/******* หน้าจอเล็ก ******** */}
        {canShowSaveContractBtn && (
          <div
            className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
            style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1050 }}
          >
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
              <button className={`${styles.btnSecondary}`} onClick={() => navigate("/sale/overview")}>
                กลับหน้าแรก
              </button>
            </div>
          </>
        )}
      </Content>
    </>
  );
};

export default UpdateSalesContract;