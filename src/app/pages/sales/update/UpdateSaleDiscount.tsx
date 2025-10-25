import styles from "@/styles/style.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  useState,
  useEffect,
  useMemo,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { Content } from "../../../../_metronic/layout/components/content";
import { useAuth } from "../../../modules/auth/core/Auth";

import {
  useUUIDStore,
  useSaveProductStore,
} from "../../../modules/stores/stepsStore";
import { useSaveDiscountStore } from "../../../modules/stores/stepsStore";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ThreeDot } from "react-loading-indicators";

interface ItemProps {
  REFNO: String;
  CONTNO: String;
  EMPID: String;
  TEAMSALE: String;
  SALECODE: String;
  SUPEMPID: String;
  SECEMPID: String;
  STATUS: String;
  PRODUCT: [any];
  CUSTOMERSTATUS: [any];
  DISCOUNT: [any];
  CUSTOMERDETAIL: [any];
  ADDRESS: [any];
  PDPA: [any];
  CONTRACT: [any];
  IMAGE: [any];
  CHECKERCOMMENT: [any];
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

interface UpdatePackageState {
  item: ItemProps;
  SaveProductData: Array<{
    EmpId: string;
    TeamSale: string;
    SaleCode: string;
    ItemCode: string;
    ItemDescription: string;
    CategoriesId: string;
    DescriptionEN: string | null;
    DescriptionTH: string | null;
    SerialNo: string | null;
    Status: string | null;
    Branch: string | null;
    TransDate: string | null;
    PromotionId: number | string;
    ProductId: any;
    Package: Array<{
      MODEL: any;
      PACKAGETYPEID: number;
      ORGANIZATIONCODE: any;
      ITEMID: any;
      PRODUCTID: any;
      PACKAGETITLE: any;
      TOTALPRICE: any;
      HASTRADEIN: any;
      DISCOUNTPRICE: any;
      SEQUENCE: any;
      PERMITION_ACTIVE: any;
      FREEGIFT: any;
      PERIODDETAILS: any;
    }>;
  }>;
  REFNO: string;
}

interface TradeInBrand {
  TRADEINBRANDID: string;
  TRADEINBRANDNAME: string;
}

const UpdateSalesDiscount: React.FC = () => {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const location = useLocation();

  const { item, SaveProductData, REFNO } = location.state as UpdatePackageState;
  // console.log(`item`, item);

  // ให้ item อ้างอิง matchedItem เพื่อไม่ต้องแก้ส่วนอื่นเยอะ
  const refno = REFNO;
  const productContract = item.PRODUCT;

  // Pre-fill จาก matchedItem.DISCOUNT[0]
  useEffect(() => {
    const d = item.DISCOUNT?.[0];
    if (!d) return;

    if (d.TRADEIN?.HASTRADEIN !== 0) {
      setSelectedTurnId(d.TRADEIN.TRADEINBRANDID);
      setSelectedTradeInBrandName(d.TRADEIN.TRADEINBRANDNAME);
      setTradeInModel(d.TRADEIN.TRADEINMODEL);
      setTradeInSerial(d.TRADEIN.TRADEINSERIAL);
    }

    setDiscountInput(d.DISCOUNTAMOUNT);
    setSelectedGiftId(d.GIFT?.GIFTID ?? "");
  }, [item]);

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
  const GET_IMAGES_API = `${API_URL_MONGO}/Contract/GetContractImage`;

  // const { REFNO } = useUUIDStore();
  // const { PRODUCT } = useSaveProductStore();
  const { DISCOUNT, SETDISCOUNT } = useSaveDiscountStore();

  const [tradeInBrand, setTradeInBrand] = useState<any[]>([]);
  // console.log(`tradeInBrand`, tradeInBrand);แ

  const [selectedTurnId, setSelectedTurnId] = useState<any>("");
  // console.log(`selectedTurnId`, selectedTurnId);
  const [selectedTradeInBrandName, setSelectedTradeInBrandName] =
    useState<string>("");
  // console.log(`selectedTradeInBrandName`, selectedTradeInBrandName);
  const [tradeInModel, setTradeInModel] = useState<any>("");
  const [tradeInSerial, setTradeInSerial] = useState<any>("");

  const everyItemTradeIn =
    tradeInBrand.length > 0 &&
    tradeInModel.length > 0 &&
    tradeInSerial.length > 0;

  const [selectedGiftId, setSelectedGiftId] = useState<any>("");

  // ตรวจสอบว่ามีข้อมูล PRODUCT หรือไม่ก่อนที่จะดึงข้อมูลจากมัน
  const hasTradeIn = SaveProductData?.[0]?.Package?.[0]?.HASTRADEIN ?? null;
  const totalPrice = SaveProductData?.[0]?.Package?.[0]?.TOTALPRICE ?? 0;
  // console.log(`totalPrice`, totalPrice);

  const discountPrice = SaveProductData?.[0]?.Package?.[0]?.DISCOUNTPRICE ?? 0;
  const sequence = SaveProductData?.[0]?.Package?.[0]?.SEQUENCE ?? 0;
  const freeGift = SaveProductData?.[0]?.Package?.[0]?.FREEGIFT ?? [];
  const discount = SaveProductData?.[0]?.Package?.[0]?.DISCOUNTPRICE ?? [];

  const [step, setStep] = useState<number>(100);
  const [currentSequence, setCurrentSequence] = useState<number>(sequence);
  const totalPriceSafe = totalPrice; // ตั้งค่า TOTALPRICE เป็น 0 ถ้าเป็น null

  // State ที่เกี่ยวข้อง
  const [discountInput, setDiscountInput] = useState<number | null>(null);
  const [discountValidationMessage, setDiscountValidationMessage] = useState<{
    message: string;
    type: "success" | "danger";
  } | null>(null);

  const [isDiscountValid, setIsDiscountValid] = useState<boolean>(true);

  const [images, setImages] = useState<ImagesType | null>(null);

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

  // อัปเดต selectedTradeInBrandName เมื่อ selectedTurnId หรือ tradeInBrand เปลี่ยน
  useEffect(() => {
    // console.log("Selected TradeIn ID:", selectedTurnId);
    // console.log("TradeIn Brand List:", tradeInBrand);

    const selectedTradeInBrand = tradeInBrand.find(
      (brand) => String(brand.TRADEINBRANDID) === String(selectedTurnId) // แปลงเป็นสตริงก่อนการเปรียบเทียบ
    );

    if (selectedTradeInBrand) {
      setSelectedTradeInBrandName(selectedTradeInBrand.TRADEINBRANDNAME || "");
      // console.log("Found TradeIn Brand Name:", selectedTradeInBrand.TRADEINBRANDNAME);
    } else {
      setSelectedTradeInBrandName(""); // รีเซ็ตค่าเมื่อไม่มีการเลือก
      // console.log("No TradeIn Brand Name Found");
    }
  }, [selectedTurnId, tradeInBrand]);

  // เก็บข้อมูลส่วนลดใน state และ store
  const SaveDiscountData = useMemo(() => {
    if (!SaveProductData?.[0]?.Package?.[0]) {
      return [];
    }

    return [
      {
        TRADEIN: {
          HASTRADEIN: SaveProductData[0].Package[0].HASTRADEIN,
          TRADEINBRANDID: selectedTurnId,
          TRADEINBRANDNAME: selectedTradeInBrandName,
          TRADEINMODEL: tradeInModel,
          TRADEINSERIAL: tradeInSerial,
        },
        DISCOUNTAMOUNT: discountInput ?? 0,
        GIFT: {
          GIFTID: selectedGiftId,
          GIFTCODE: freeGift[selectedGiftId - 1]?.GIFTCODE,
          GIFTNAME: freeGift[selectedGiftId - 1]?.GIFTNAME,
          GIFTPRICE: freeGift[selectedGiftId - 1]?.GIFTPRICE ?? 0,
          GIFTDESCRIPTION:
            freeGift[selectedGiftId - 1]?.GIFTDESCRIPTION || null,
        },
      },
    ];
  }, [
    SaveProductData,
    selectedTurnId,
    tradeInModel,
    tradeInSerial,
    discountInput,
    selectedGiftId,
    selectedTradeInBrandName,
  ]);

  // อัปเดตข้อมูลส่วนลดใน store
  useEffect(() => {
    if (JSON.stringify(SaveDiscountData) !== JSON.stringify(DISCOUNT)) {
      SETDISCOUNT(SaveDiscountData); // อัปเดตข้อมูลลง store
    }
  }, [SaveDiscountData, DISCOUNT, SETDISCOUNT]);

  // GET Trade-in brands + prefill จาก discount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(TRADEINBRAND_URL, {
          headers: { "Content-Type": "application/json" },
        });
        const allBrands: TradeInBrand[] = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        // กรองเฉพาะ SAFE เซฟ และ กิฟฟารีน
        const filtered = allBrands.filter(
          (b) =>
            b.TRADEINBRANDNAME === "SAFE เซฟ" ||
            b.TRADEINBRANDNAME === "กิฟฟารีน"
        );

        // เพิ่มตัวเลือก “อื่นๆ”
        const finalList: TradeInBrand[] = [
          ...filtered,
          { TRADEINBRANDID: "other", TRADEINBRANDNAME: "อื่นๆ" },
        ];

        setTradeInBrand(finalList);
      } catch (error) {
        console.error("Error fetching TRADEINBRAND_URL:", error);
      }
    };

    fetchBrands();

    // พรีฟิลด์ค่าจาก discount ถ้ามี
    if (discount?.[0]) {
      const d = discount[0];
      if (d.TRADEIN?.HASTRADEIN !== 0) {
        setSelectedTurnId(d.TRADEIN.TRADEINBRANDID);
        setTradeInModel(d.TRADEIN.TRADEINMODEL);
        setTradeInSerial(d.TRADEIN.TRADEINSERIAL);
      }
      setDiscountInput(d.DISCOUNTAMOUNT);
      setSelectedGiftId(d.GIFT.GIFTID);
    }
  }, [discount]);

  // POST Contract/updateContract
  const handleNextClick = async () => {
    try {
      // POST Contract/updateContract
      const updateContract = await axios.post(
        UPDATECONTACT,
        {
          REFNO,
          EMPID: EmpId,
          TEAMSALE: TeamSale,
          SALECODE: SaleCode,
          SUPEMPID: SupEmpId,
          SECEMPID: SecEmpId,
          FIELD: "DISCOUNT",
          DATA: SaveDiscountData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(`updateContract DISCOUNT: `, updateContract.data);
      if (updateContract.status === 200) {
        if (!updateContract.data.data) {
          MySwal.fire(
            "เกิดข้อผิดพลาด",
            "ปรับปรุงข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา",
            "error"
          );
        } else {
          Swal.fire({
            icon: "success",
            title: "สำเร็จ!",
            text: "ปรับปรุงข้อมูลส่วนลดแล้ว",
            timer: 2000, // แสดงผล 3 วินาที
            showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
          });
          navigate("/sale/update/UpdateSalesEmployee", {
            // state: {
            //     ...matchedItem,
            // }
            state: {
              ...matchedFromDraft,
            },
          });
        }
      } else {
        MySwal.fire("เกิดข้อผิดพลาด", updateContract.data.message, "error");
      }
    } catch (error) {
      console.error("Error fetching UPDATECONTACT:", error);
    }
  };

  // Handle increment and decrement functions
  // const handleDecrement = () => {
  //     setCurrentSequence((prev) => Math.max(0, prev - step)); // ลดค่า step แต่ไม่ให้ต่ำกว่า 0
  // };

  // const handleIncrement = () => {
  //     setCurrentSequence((prev) => {
  //         if (prev + step <= discountPrice) {
  //             return prev + step;
  //         } else {
  //             return prev;
  //         }
  //     });
  // };

  // คำนวณราคาหลังหักส่วนลด
  const finalPrice = Math.max(0, totalPriceSafe - (discountInput ?? 0));

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

  const handleCheckerClick = async () => {
    const response = await axios.post(
      UPDATECONTACT,
      {
        REFNO: REFNO,
        EMPID: EmpId,
        TEAMSALE: TeamSale,
        FIELD: "STATUS",
        DATA: "PENDING",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // console.log(response)

    if (response.status === 200) {
      if (!response.data.data) {
        MySwal.fire(
          "เกิดข้อผิดพลาด",
          "ส่งข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา",
          "error"
        );
      } else {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ!",
          text: "ส่งข้อมูลตรวจสอบแล้ว",
          timer: 2000, // แสดงผล 3 วินาที
          showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
        });
        navigate("/sale/overview");
      }
    } else {
      MySwal.fire("เกิดข้อผิดพลาด", response.data.message, "error");
    }
  };

  // เช็คว่า data ใน item มีครบทุกขั้นตอน (ไม่เป็น array เปล่า) ใช่ไหม ถ้าเป็นจะ disabled ปุ่มส่งตรวจสอบ
  const isDataComplete = useMemo(() => {
    // ตรวจสอบว่ามีรูปภาพในฟิลด์ใดฟิลด์หนึ่งใน images อย่างน้อย 1 รูป
    const hasImages =
      images &&
      Object.values(images).some(
        (field) => Array.isArray(field) && field.length > 0
      );

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
  const matchedFromDraft = draft.find((match) => match.REFNO === REFNO);
  // console.log(`matchedFromDraft`, matchedFromDraft);

  // console.log(`เทส`, productContract[0].Package[0].TOTALPRICE);

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
                แก้ไข เครื่องเทิร์น / ส่วนลด / ของแถม
              </li>
            </ul>
          </div>
        </div>
        <span className={`${styles.fontSize}`}>เลขที่ขาย: </span>
        <span className={`${styles.titlePage}`}>{refno}</span>

        <div className="accordion mb-10" id="kt_accordion_1">
          {hasTradeIn === 1 && (
            <>
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
            </>
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
                              value={productContract[0].Package[0].TOTALPRICE.toLocaleString()}
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
            <div className="d-none d-xl-flex justify-content-end align-items-center my-5">
              {/* <button
                className={`${styles.btnSecondary}`}
                onClick={() =>
                  navigate("/sale/update/updateSalePackage", {
                    state: {
                      ...item,
                    },
                  })
                }
              >
                แก้ไขแพ็คเกจ
              </button> */}
              <button className={`${styles.btnPrimary}`} onClick={handleNextClick}>
                ถัดไป
              </button>
              {/* {isDataComplete && (
                        <button
                            className={`${styles.btnPrimary} ${!isDataComplete ? `disabled` : ``}`}
                            onClick={handleCheckerClick}
                        >
                            ส่งตรวจสอบ
                        </button>
                    )} */}
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
              {/* <button
                className={`${styles.btnSecondary}`}
                onClick={() =>
                  navigate("/sale/update/updateSalePackage", {
                    state: {
                      ...item,
                    },
                  })
                }
              >
                แก้ไขแพ็คเกจ
              </button> */}
              <button className={`${styles.btnPrimary}`} onClick={handleNextClick}>
                ถัดไป
              </button>
              {/* {isDataComplete && (
                        <button
                            className={`${styles.btnPrimary} ${!isDataComplete ? `disabled` : ``}`}
                            onClick={handleCheckerClick}
                        >
                            ส่งตรวจสอบ
                        </button>
                    )} */}
            </div>
          </>
        )}
      </Content>
    </>
  );
};

export default UpdateSalesDiscount;
