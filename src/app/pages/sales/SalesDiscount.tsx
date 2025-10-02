
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import styles from "@/styles/style.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from "../../modules/auth/core/Auth";

import {
  useUUIDStore,
  useSaveProductStore,
} from "../../modules/stores/stepsStore";
import { useSaveDiscountStore } from "../../modules/stores/stepsStore";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface TradeInBrand {
  TRADEINBRANDID: string;
  TRADEINBRANDNAME: string;
}

interface FreeGift {
  GIFTID: string;
  GIFTCODE: string;
  GIFTNAME: string;
  GIFTPRICE: number;
  GIFTDESCRIPTION: string | null;
}

interface Package {
  HASTRADEIN: number;
  TOTALPRICE: number;
  DISCOUNTPRICE: number;
  SEQUENCE: number;
  FREEGIFT: FreeGift[];
}

interface Product {
  Package: Package[];
}

interface SaveDiscount {
  TRADEIN: {
    HASTRADEIN: number;
    TRADEINBRANDID: number;
    TRADEINBRANDNAME: string;
    TRADEINMODEL: string;
    TRADEINSERIAL: string;
  };
  DISCOUNTAMOUNT: number | null;
  GIFT: {
    GIFTID: number;
    GIFTCODE: string;
    GIFTNAME: string;
    GIFTPRICE: number;
    GIFTDESCRIPTION: string | null;
  };
}

const SalesDiscount: React.FC = () => {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || "";
  const TeamSale = auth?.data?.[0]?.TeamSale || "";
  const SaleCode = auth?.data?.[0]?.SaleCode || "";
  const SupEmpId = auth?.data?.[0]?.SupEmp || "";
  const SecEmpId = auth?.data?.[0]?.SecEmp || "";

  const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
  const TRADEINBRAND_URL = `${API_SALECONNEXT}/GetProduct/Tradeinbrand`;

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
  const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}&ProcessType=${auth.processtype}`;

  const { REFNO } = useUUIDStore();
  const { PRODUCT } = useSaveProductStore();
  const { DISCOUNT, SETDISCOUNT } = useSaveDiscountStore();

  // state สำหรับเครื่องเทิร์น / ส่วนลด / ของแถม
  const [tradeInBrand, setTradeInBrand] = useState<TradeInBrand[]>([]);
  const [selectedTurnId, setSelectedTurnId] = useState<number>(0);
  const [selectedTradeInBrandName, setSelectedTradeInBrandName] =
    useState<string>("");
  const [tradeInModel, setTradeInModel] = useState<string>("");
  const [tradeInSerial, setTradeInSerial] = useState<string>("");
  const [selectedGiftId, setSelectedGiftId] = useState<number>(0);

  const [discountInput, setDiscountInput] = useState<number | null>(null);
  const [discountValidationMessage, setDiscountValidationMessage] = useState<{
    message: string;
    type: "success" | "danger";
  } | null>(null);

  const pkg = PRODUCT?.[0]?.Package?.[0] || {};
  const hasTradeIn = pkg.HASTRADEIN ?? 0;
  const totalPrice = pkg.TOTALPRICE ?? 0;
  const discountPrice = pkg.DISCOUNTPRICE ?? 0;
  const sequence = pkg.SEQUENCE ?? 0;
  const freeGift = pkg.FREEGIFT ?? [];

  const [isDiscountValid, setIsDiscountValid] = useState<boolean>(true);

  const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false);
  const [draft, setDraft] = useState<any[]>([]);

  useEffect(() => {
    const getDataDraft = async () => {
      setIsLoadingDraft(true);
      try {
        const response = await axios.get(DRAFT_ALLCONTRACT_URL);
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setDraft(data);
      } catch (error) {
        console.error("Error fetching DRAFT_ALLCONTRACT_URL:", error);
      } finally {
        setIsLoadingDraft(false);
      }
    };
    getDataDraft();
  }, []);

  // เลือก item ที่ REFNO ตรงกัน (find สำหรับ 1 item หรือ filter สำหรับหลาย item)
  const matchedItem = draft.find((item) => item.REFNO === REFNO);
  // console.log(`matchedItem`, matchedItem);

  // โหลดรายชื่อแบรนด์เครื่องเทิร์น
  const loadTradeInBrands = useCallback(async () => {
    try {
      const resp = await axios.get(TRADEINBRAND_URL);
      const all = Array.isArray(resp.data.data) ? resp.data.data : [];
      // กรอง SAFE, กิฟฟารีน เพิ่มอื่นๆ
      const filtered = all.filter((b: TradeInBrand) =>
        ["SAFE เซฟ", "กิฟฟารีน"].includes(b.TRADEINBRANDNAME)
      );
      setTradeInBrand([
        ...filtered,
        { TRADEINBRANDID: "other", TRADEINBRANDNAME: "อื่นๆ" },
      ]);
    } catch {
      MySwal.fire("Error", "ไม่สามารถโหลดแบรนด์เครื่องเทิร์นได้", "error");
    }
  }, [TRADEINBRAND_URL]);

  useEffect(() => {
    loadTradeInBrands();
  }, [loadTradeInBrands]);

  // ตั้งค่า SaveDiscountStore
  const SaveDiscountData = useMemo<SaveDiscount[]>(() => {
    return [
      {
        TRADEIN: {
          HASTRADEIN: pkg.HASTRADEIN,
          TRADEINBRANDID: selectedTurnId,
          TRADEINBRANDNAME: selectedTradeInBrandName,
          TRADEINMODEL: tradeInModel,
          TRADEINSERIAL: tradeInSerial,
        },
        DISCOUNTAMOUNT: discountInput,
        GIFT: {
          GIFTID: selectedGiftId,
          GIFTCODE: freeGift[selectedGiftId - 1]?.GIFTCODE || "",
          GIFTNAME: freeGift[selectedGiftId - 1]?.GIFTNAME || "",
          GIFTPRICE: freeGift[selectedGiftId - 1]?.GIFTPRICE ?? 0,
          GIFTDESCRIPTION:
            freeGift[selectedGiftId - 1]?.GIFTDESCRIPTION || null,
        },
      },
    ];
  }, [
    pkg,
    selectedTurnId,
    selectedTradeInBrandName,
    tradeInModel,
    tradeInSerial,
    discountInput,
    selectedGiftId,
    freeGift,
  ]);

  useEffect(() => {
    // ถ้า SaveDiscountData ไม่เท่ากับ DISCOUNT ใน store เท่านั้น ถึงจะอัปเดต
    if (JSON.stringify(SaveDiscountData) !== JSON.stringify(DISCOUNT)) {
      SETDISCOUNT(SaveDiscountData);
    }
  }, [SaveDiscountData, DISCOUNT, SETDISCOUNT]);

  // ฟังก์ชันจัดการเมื่อมีการเปลี่ยนแปลงในฟิลด์ส่วนลด
  const handleDiscountChange = (value: string) => {
    const inputNumber = Number(value.replace(/,/g, "")); // แปลงค่าที่กรอกเป็นตัวเลข

    if (isNaN(inputNumber)) {
      setDiscountValidationMessage({
        message: "กรุณากรอกตัวเลขที่ถูกต้อง",
        type: "danger",
      });
      setIsDiscountValid(false); // กรอกค่าผิด
      return;
    }

    setDiscountInput(inputNumber); // อัปเดตส่วนลด
    validateDiscount(inputNumber); // เรียกฟังก์ชัน validateDiscount เพื่อเช็คค่า
  };

  // ฟังก์ชันตรวจสอบค่าที่กรอก
  const validateDiscount = (inputNumber: number) => {
    if (discountPrice === 0) {
      setDiscountValidationMessage(null);
      setIsDiscountValid(true); // ไม่มีส่วนลด ไม่ต้องแสดงข้อความ
      return;
    }

    if (discountPrice !== undefined && sequence !== undefined) {
      let validationMessage = "";

      if (inputNumber <= discountPrice) {
        if (inputNumber % sequence === 0) {
          validationMessage = "";
          setIsDiscountValid(true); // ส่วนลดถูกต้อง
          setDiscountValidationMessage({
            message: validationMessage,
            type: "success",
          });
        } else {
          validationMessage = `กรอกส่วนลดผิด ต้องลดหรือเพิ่มได้ทีละ ${sequence} บาท`;
          setIsDiscountValid(false); // ส่วนลดไม่ถูกต้อง
          setDiscountValidationMessage({
            message: validationMessage,
            type: "danger",
          });
        }
      } else {
        validationMessage = `ส่วนลดต้องไม่เกิน ${discountPrice} บาท`;
        setIsDiscountValid(false); // ส่วนลดไม่ถูกต้อง
        setDiscountValidationMessage({
          message: validationMessage,
          type: "danger",
        });
      }
    }
  };

  // Handle option changes
  const handleTurnOptionChange = (event: any) => {
    const value = event.target.value;
    setSelectedTurnId(value);
  };

  const handleTradeInModelChange = (event: any) => {
    const value = event.target.value;
    setTradeInModel(value);
  };

  const handleTradeInSerialChange = (event: any) => {
    const value = event.target.value;
    setTradeInSerial(value);
  };

  const handleGiftOptionChange = (event: any) => {
    const value = event.target.value;
    setSelectedGiftId(value);
  };

  // บันทึกข้อมูลทั้งหมดขึ้น API
  const handleNextClick = async () => {
    try {
      await axios.post(UPDATECONTACT, {
        REFNO,
        EMPID: EmpId,
        TEAMSALE: TeamSale,
        SALECODE: SaleCode,
        SUPEMPID: SupEmpId,
        SECEMPID: SecEmpId,
        FIELD: "DISCOUNT",
        DATA: SaveDiscountData,
      });
      await MySwal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: "บันทึกข้อมูลเรียบร้อยแล้ว",
        timer: 2000, // แสดงผล 3 วินาที
        showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
      });
      // นำทางไปหน้าถัดไป
      // const next = pkg.PACKAGETYPEID === 1 ? '/sale/createcust-cash' : '/sale/createcust'
      const next = "/sale/salesemployee";
      navigate(next);
    } catch {
      MySwal.fire("Error", "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  const finalPrice = Math.max(0, totalPrice - (discountInput ?? 0));

  return (
    <>
      <Content>
        <div className="d-flex justify-content-between align-items-center my-5">
          <div
            id="kt_page_title"
            data-kt-swapper="true"
            data-kt-swapper-mode="prepend"
            data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
            className="page-title d-flex flex-wrap me-3 flex-column justify-content-center"
          >
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
              <li className={`${styles.titlePage}`}>
                เครื่องเทิร์น / ส่วนลด / ของแถม
              </li>
            </ul>
          </div>
        </div>
        <span className={`${styles.fontSize}`}>เลขที่ขาย: </span>
        <span className={`${styles.titlePage}`}>{REFNO}</span>

        <div className="accordion mb-10" id="kt_accordion_1">
          {hasTradeIn === 1 && (
            <div className="accordion-item mb-10">
              <h2 className="accordion-header" id="kt_accordion_1_header_1">
                <h3
                  className="accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7"
                  data-bs-toggle="collapse"
                  data-bs-target="#kt_accordion_1_body_1"
                  aria-expanded="true"
                  aria-controls="kt_accordion_1_body_1"
                  style={{
                    color: "white",
                    cursor: "pointer",
                    backgroundColor: "#3777bc",
                  }}
                >
                  เครื่องเทิร์น
                </h3>
              </h2>
              <div
                id="kt_accordion_1_body_1"
                className="accordion-collapse collapse show"
                aria-labelledby="kt_accordion_1_header_1"
                data-bs-parent="#kt_accordion_1"
              >
                <div className="accordion-body">
                  <form noValidate className="form">
                    <div className="card-body px-lg-9 px-1">
                      <div className="row mb-6">
                        <div className="col-lg-4 mb-3">
                          <label className={`form-label ${styles.fontSize}`}>
                            เครื่องเทิร์น
                          </label>
                          <select
                            className={`form-select ${styles.fontSize}`}
                            onChange={handleTurnOptionChange}
                            value={selectedTurnId}
                          >
                            <option value="">เลือกเครื่องเทิร์น</option>
                            {tradeInBrand.map((item, index) => (
                              <option key={index} value={item.TRADEINBRANDID}>
                                {item.TRADEINBRANDNAME}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className={`form-label ${styles.fontSize}`}>
                            รุ่น
                          </label>
                          <input
                            type="text"
                            className={`form-control mb-3 mb-lg-0 ${styles.fontSize}`}
                            onChange={handleTradeInModelChange}
                            value={tradeInModel}
                          />
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className={`form-label ${styles.fontSize}`}>
                            หมายเลขเครื่อง
                          </label>
                          <input
                            type="text"
                            className={`form-control mb-3 mb-lg-0 ${styles.fontSize}`}
                            onChange={handleTradeInSerialChange}
                            value={tradeInSerial}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {((!Array.isArray(discountPrice) &&
            discountPrice !== 0 &&
            discountPrice !== null) ||
            (Array.isArray(discountPrice) && discountPrice.length > 0)) && (
            <div className="accordion-item mb-10">
              <h2 className="accordion-header" id="kt_accordion_2_header_2">
                <h3
                  className="accordion-button fs-4 fw-bold collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7"
                  data-bs-toggle="collapse"
                  data-bs-target="#kt_accordion_2_body_2"
                  aria-expanded="true"
                  aria-controls="kt_accordion_2_body_2"
                  style={{
                    color: "white",
                    cursor: "pointer",
                    backgroundColor: "#3777bc",
                  }}
                >
                  ส่วนลด
                </h3>
              </h2>
              <div
                id="kt_accordion_2_body_2"
                className="accordion-collapse collapse show"
                aria-labelledby="kt_accordion_2_header_2"
                data-bs-parent="#kt_accordion_2"
              >
                <div className="accordion-body">
                  <form noValidate className="form">
                    <div className="card-body px-lg-9 px-1">
                      <div className="row mb-6">
                        <div className="col-lg-6 mb-3">
                          <label className={`form-label ${styles.fontSize}`}>
                            ราคาขาย
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={totalPrice.toLocaleString()}
                            className={`${styles.fontSize} form-control bg-light`}
                            style={{ cursor: "not-allowed" }}
                          />
                        </div>
                        <div className="col-lg-6 mb-3">
                          <label className={`form-label ${styles.fontSize}`}>
                            ส่วนลด
                          </label>
                          <div className="d-flex align-items-center">
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              className={`form-control ${styles.fontSize}`}
                              onChange={(e) =>
                                handleDiscountChange(e.target.value)
                              }
                              value={
                                discountInput !== null
                                  ? discountInput.toString()
                                  : ""
                              }
                            />
                          </div>
                          {discountValidationMessage && (
                            <div
                              className={`${styles.fontSize} mt-2 text-${discountValidationMessage.type}`}
                            >
                              {discountValidationMessage.message}
                            </div>
                          )}
                        </div>
                        <div className="col-lg-6 mb-3">
                          <label className={`form-label ${styles.fontSize}`}>
                            ราคาสุทธิ
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={finalPrice.toLocaleString()}
                            className={`${styles.fontSize} form-control bg-light`}
                            style={{ cursor: "not-allowed" }}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {freeGift.length > 0 && (
            <div className="accordion-item mb-10">
              <h2 className="accordion-header" id="kt_accordion_3_header_3">
                <h3
                  className={`accordion-button collapsed border-0 h-50px pt-5 rounded-top px-lg-15 px-7 ${styles.fontSize}`}
                  data-bs-toggle="collapse"
                  data-bs-target="#kt_accordion_3_body_3"
                  aria-expanded="true"
                  aria-controls="kt_accordion_3_body_3"
                  style={{
                    color: "white",
                    cursor: "pointer",
                    backgroundColor: "#3777bc",
                  }}
                >
                  ของแถม
                </h3>
              </h2>
              <div
                id="kt_accordion_3_body_3"
                className="accordion-collapse collapse show"
                aria-labelledby="kt_accordion_3_header_3"
                data-bs-parent="#kt_accordion_3"
              >
                <div className="accordion-body">
                  <form noValidate className="form">
                    <div className="card-body px-lg-9 px-1">
                      <div className="row mb-6">
                        <div className="col-lg-12 mb-3">
                          <label className={`form-label ${styles.fontSize}`}>
                            ของแถม
                          </label>
                          <select
                            value={selectedGiftId}
                            className={`form-select ${styles.fontSize}`}
                            onChange={handleGiftOptionChange}
                          >
                            <option value="">เลือกของแถม</option>
                            {freeGift.map(
                              (
                                item: {
                                  GIFTID:
                                    | string
                                    | number
                                    | readonly string[]
                                    | undefined;
                                  GIFTNAME:
                                    | string
                                    | number
                                    | boolean
                                    | ReactElement<
                                        any,
                                        string | JSXElementConstructor<any>
                                      >
                                    | Iterable<ReactNode>
                                    | ReactPortal
                                    | null
                                    | undefined;
                                },
                                index: Key | null | undefined
                              ) => (
                                <option key={index} value={item.GIFTID}>
                                  {item.GIFTNAME}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {hasTradeIn !== 1 &&
          (Array.isArray(discountPrice)
            ? discountPrice.length === 0
            : discountPrice === 0) &&
          freeGift.length === 0 && (
            <>
              <div className="col-lg-6 mb-3">
                <label className={`form-label ${styles.fontSize}`}>
                  ราคาขาย
                </label>
                <input
                  type="text"
                  readOnly
                  value={totalPrice.toLocaleString()}
                  className={`${styles.fontSize} form-control bg-light`}
                  style={{ cursor: "not-allowed" }}
                />
              </div>
              <div className="text-center my-20">
                <h5 className={`${styles.fontSize}`}>
                  ไม่มี เครื่องเทิร์น / ส่วนลด / ของแถม
                </h5>
              </div>
            </>
          )}

        {isDiscountValid && (
          <>
            <div className="d-none d-xl-flex justify-content-end align-items-center mt-5 mb-10">
              {/* <button
                className={`${styles.btnSecondary}`}
                onClick={() =>
                  navigate("/sale/update/updateSalePackage", {
                    state: {
                      ...matchedItem,
                      fromDiscount: true,
                    },
                  })
                }
              >
                แก้ไขแพ็คเกจ
              </button> */}
              <button
                className={`${styles.btnPrimary}`}
                onClick={handleNextClick}
              >
                บันทึก
              </button>
            </div>

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
              {/* <button
                className={`${styles.btnSecondary}`}
                onClick={() =>
                  navigate("/sale/update/updateSalePackage", {
                    state: {
                      ...matchedItem,
                      fromDiscount: true,
                    },
                  })
                }
              >
                แก้ไขแพ็คเกจ
              </button> */}
              <button
                className={`${styles.btnPrimary}`}
                onClick={handleNextClick}
              >
                บันทึก
              </button>
            </div>
          </>
        )}
      </Content>
    </>
  );
};

export default SalesDiscount;
