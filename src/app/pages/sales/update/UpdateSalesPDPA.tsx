import styles from "@/styles/style.module.css";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Content } from "../../../../_metronic/layout/components/content";
import {
  useUUIDStore,
  useSaveCustomerStore,
} from "../../../modules/stores/stepsStore";
import { useAuth } from "../../../modules/auth/core/Auth";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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

const UpdateSalesPDPA: React.FC = () => {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const location = useLocation();
  const item = (location.state as ItemProps) || ({} as ItemProps);
  // console.log(`item`, item);

  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || "";
  const TeamSale = auth?.data?.[0]?.TeamSale || "";
  const SaleCode = auth?.data?.[0]?.SaleCode || "";
  const SupEmpId = auth?.data?.[0]?.SupEmp || "";
  const SecEmpId = auth?.data?.[0]?.SecEmp || "";

  const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false);
  const [draft, setDraft] = useState<any[]>([]);
  const [matchedItem, setMatchedItem] = useState<ItemProps | null>(null);
  // console.log(`matchedItem`, matchedItem);

  const { REFNO } = useUUIDStore();
  const API_URL_PDPA_LETTER = import.meta.env.VITE_APP_API_PDPA_LETTER;
  const CONSENT_LETTER_API = `${API_URL_PDPA_LETTER}/PDPA?OrganizationCode=0`;

  const API_URL_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
  const SEND_SMS_API = `${API_URL_SALECONNEXT}/sendSMS/PDPA`;
  const CHECK_OTP_API = `${API_URL_SALECONNEXT}/CheckOTP/PDPA`;

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
  const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}&ProcessType=${auth.processtype}`;

  const { saveCustomerTypes } = useSaveCustomerStore();

  const [consentGiven, setConsentGiven] = useState(false);
  const [consentNotGiven, setConsentNotGiven] = useState(false);
  const [Alllow_Contract, setAlllow_Contract] = useState<number>();
  const [PDPA_Code, setPDPA_Code] = useState<string | null>();
  const [inputOTP, setInputOTP] = useState("");
  const [isOTPRequested, setIsOTPRequested] = useState(false);

  const telCustomer =
    matchedItem?.CUSTOMERDETAIL?.[0]?.CUSTOMERMOBILE ??
    item?.CUSTOMERDETAIL?.[0]?.CUSTOMERMOBILE ??
    "";
  // console.log(`telCustomer`, telCustomer);

  const otpInputRef = useRef<HTMLInputElement | null>(null);

  // เช็คว่าติ้ก consent ยัง
  const hasChosenConsent = consentGiven || consentNotGiven;

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
  }, [DRAFT_ALLCONTRACT_URL]);

  useEffect(() => {
    if (!isLoadingDraft) {
      const found = draft.find((d) => d.REFNO === REFNO) || null;
      setMatchedItem(found);
    }
  }, [draft, isLoadingDraft, REFNO]);

  useEffect(() => {
    setAlllow_Contract(consentGiven ? 1 : 0);
    setPDPA_Code(consentGiven ? "0001" : "0000");
  }, [consentGiven]);

  useEffect(() => {
    if (isOTPRequested && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [isOTPRequested]);

  const handleConsentChange = (isGiven: boolean) => {
    setConsentGiven(isGiven);
    setConsentNotGiven(!isGiven);
  };

  // เลือกแหล่งข้อมูลที่ “เชื่อ” มากกว่า
  const fromTag = (location.state as any)?.from;
  const preferItem =
    fromTag === "/sale/step" || fromTag === "/sale/update/updateAddress";
  const ctxItem: ItemProps = (preferItem ? item : matchedItem ?? item) as ItemProps;

  // REFNO ที่จะ “ล็อก” ทั้งหน้าจอ PDPA
  const refNoToShow = (ctxItem?.REFNO as string) ?? "";
  // console.log(`refNoToShow`, refNoToShow);

  const handleRequestOTP = async () => {
    if (!telCustomer || (telCustomer.length !== 9 && telCustomer.length !== 10)) {
      Swal.fire({ icon: "warning", title: "กรุณาระบุเบอร์โทรลูกค้าให้ถูกต้อง" });
      return;
    }

    try {
      await axios.post(
        SEND_SMS_API,
        {
          RefNo: refNoToShow, // ถ้าต้องการให้ผูกกับ refNoToShow เปลี่ยนเป็น refNoToShow ได้
          Alllow_Contract,
          PDPA_Code,
          TelMobile: telCustomer,
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setIsOTPRequested(true);
      MySwal.fire({
        toast: true,
        icon: "success",
        title: "ส่ง OTP ไปยังเบอร์โทรลูกค้าสำเร็จ",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => otpInputRef.current?.focus());
    } catch (error) {
      console.error("ส่ง OTP ไม่สำเร็จ:", error);
      Swal.fire({ icon: "error", title: "ไม่สามารถส่ง OTP ได้" });
    }
  };

  const checkOTP = async () => {
    try {
      const resp = await axios.post(
        CHECK_OTP_API,
        { EmpID: EmpId, RefNo: refNoToShow, OTP: inputOTP },
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (resp.data.status === 400) {
        Swal.fire({ icon: "error", title: "OTP ไม่ถูกต้อง" });
        return;
      }

      const updateContract = await axios.post(
        UPDATECONTACT,
        {
          REFNO: refNoToShow,
          EMPID: EmpId,
          TEAMSALE: TeamSale,
          SALECODE: SaleCode,
          SUPEMPID: SupEmpId,
          SECEMPID: SecEmpId,
          FIELD: "PDPA",
          DATA: [
            {
              CONSENTGIVEN: consentGiven,
              TELCUSTOMER: telCustomer,
              OTP: inputOTP,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = updateContract.data;
      const innerData = responseData?.data;
      const innerStatus = String(innerData?.status || "").toLowerCase();

      const isSaveSuccess =
        updateContract.status === 200 &&
        innerData &&
        innerStatus !== "error" &&
        innerStatus !== "fail" &&
        innerStatus !== "failed" &&
        innerStatus !== "false";

      if (!isSaveSuccess) {
        await MySwal.fire(
          "บันทึกไม่สำเร็จ",
          innerData?.message ||
          responseData?.message ||
          "จัดเก็บข้อมูล PDPA ไม่สำเร็จ กรุณาติดต่อผู้พัฒนา",
          "error"
        );
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "จัดเก็บข้อมูลสำเร็จ",
        timer: 2000,
        showConfirmButton: false,
      });

      const payload: ItemProps = {
        ...(matchedItem ?? item),
        REFNO: refNoToShow,
        PDPA: [
          {
            CONSENTGIVEN: consentGiven,
            TELCUSTOMER: telCustomer,
            OTP: inputOTP,
          },
        ],
      } as ItemProps;

      navigate("/sale/update/UpdateSalesContract", {
        state: {
          ...payload,
          from: "/sale/update/UpdateSalesPDPA",
        },
      });
    } catch (error: any) {
      console.error("ตรวจสอบ OTP หรือบันทึก PDPA ล้มเหลว:", error);

      await MySwal.fire(
        "เกิดข้อผิดพลาด",
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "ไม่สามารถตรวจสอบ OTP หรือบันทึกข้อมูล PDPA ได้",
        "error"
      );
    }
  };
  
  return (
    <>
      <Content>
        <div className="d-flex justify-content-between align-items-center my-5">
          <div className="page-title d-flex flex-wrap me-3 flex-column justify-content-center">
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
              <li className={`breadcrumb-item text-gray-900 font ${styles.titlePage}`}>PDPA</li>
            </ul>
          </div>
        </div>

        <span className={`${styles.fontSize}`}>เลขที่ขาย: </span>
        <span className={`${styles.titlePage}`}>{refNoToShow}</span>

        <div className="card mb-10 px-4">
          <div className="card-body flex justify-between items-center p-5">
            <iframe src={CONSENT_LETTER_API} title="Consent Letter" width="100%" height="500px" />

            <div className="row mt-10 mb-4">
              <div className="col-12">
                <div className="d-flex justify-content-center align-items-center gap-4">
                  <label className="form-check form-check-inline form-check-solid">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={consentGiven}
                      onChange={() => handleConsentChange(true)}
                    />
                    <span className={`fw-bold ${styles.fontSize}`}>ให้ความยินยอม</span>
                  </label>
                  <label className="form-check form-check-inline form-check-solid">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={consentNotGiven}
                      onChange={() => handleConsentChange(false)}
                    />
                    <span className={`fw-bold ${styles.fontSize}`}>ไม่ให้ความยินยอม</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="col-lg-12 mb-10">
              <label className={`form-label required fw-bold ${styles.fontSize}`}>เบอร์โทรลูกค้า</label>
              <input
                value={telCustomer}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className={`form-control form-control-lg form-control-solid mb-3 mb-lg-0 ${styles.placeholder}`}
                readOnly
              />
            </div>

            {isOTPRequested && (
              <div className="col-lg-12 my-10">
                <label className={`form-label required fw-bold ${styles.fontSize}`}>
                  OTP ที่ได้รับจากลูกค้า
                </label>
                <input
                  ref={otpInputRef}
                  value={inputOTP}
                  onChange={(e) => setInputOTP(e.target.value)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="form-control form-control-lg form-control-solid mb-3 mb-lg-0"
                />
              </div>
            )}
          </div>
        </div>

        {/* ปุ่ม */}
        <div className="d-none d-xl-flex justify-content-between align-items-center mt-5">
          {!isOTPRequested ? (
            <button
              className={`${styles.btnPrimary}`}
              type="button" onClick={handleRequestOTP}
            >
              รับ OTP
            </button>
          ) : (
            <>
              <button
                className={`${styles.btnSuccess} me-3`}
                type="button" onClick={handleRequestOTP}
              >
                ส่ง OTP ใหม่
              </button>
              {inputOTP && hasChosenConsent && (
                <button className={`${styles.btnPrimary}`} type="button" onClick={checkOTP}>
                  จัดเก็บข้อมูล
                </button>
              )}
            </>
          )}
        </div>

        <div
          className="d-flex d-xl-none justify-content-between align-items-center bg-light p-3 border-top"
          style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1050 }}
        >
          {!isOTPRequested ? (
            <button
              className={`${styles.btnPrimary}`}
              onClick={handleRequestOTP}
            >
              รับ OTP
            </button>
          ) : (
            <>
              <button
                className={`${styles.btnSuccess} me-3`}
                onClick={handleRequestOTP}
              >
                ส่ง OTP ใหม่
              </button>
              {inputOTP && hasChosenConsent && (
                <button className={`${styles.btnPrimary}`} type="button" onClick={checkOTP}>
                  จัดเก็บข้อมูล
                </button>
              )}
            </>
          )}
        </div>
      </Content>
    </>
  );
};

export default UpdateSalesPDPA;