import styles from "@/styles/style.module.css";
import IDCardOCR from "../components/ocr/IDCardOCR";

import { useState, ChangeEvent, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";
import { KTIcon, toAbsoluteUrl } from "../../../../_metronic/helpers";
import { Content } from "../../../../_metronic/layout/components/content";
import { useAuth } from "../../../modules/auth/core/Auth";

import {
  useUUIDStore,
  useSaveCustomerStore,
  useSaveAddressStore,
} from "../../../modules/stores/stepsStore";

import dayjs, { Dayjs } from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";

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

interface OCRResultState {
  rawText: string;
  error?: string;
}

type FormValues = {
  fullName: string;
  lastName: string;
  idCard: string;
  telNo: string;
  email: string;
};

const UpdateSaleCustDetail: React.FC = () => {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const location = useLocation();
  const item = (location.state as ItemProps) || [];
  // console.log(`item`, item);

  const refno = item?.REFNO;
  const customerDetail = item?.CUSTOMERDETAIL?.[0] ?? {};
  // console.log(`customerDetail`, customerDetail);

  let customerStatus = item?.CUSTOMERSTATUS;
  // console.log(`customerStatus`, customerStatus);

  const product = item?.PRODUCT;

  const { auth } = useAuth();
  const EmpId = auth?.data?.[0]?.EmpId || "";
  const TeamSale = auth?.data?.[0]?.TeamSale || "";
  const SaleCode = auth?.data?.[0]?.SaleCode || "";
  const SupEmpId = auth?.data?.[0]?.SupEmp || "";
  const SecEmpId = auth?.data?.[0]?.SecEmp || "";
  const DivisionId = auth?.data?.[0]?.DivisionId || "";
  const DepartId = auth?.data?.[0]?.DepartId || "";
  const DepartGroup = auth?.data?.[0]?.DepartGroup || "";

  const { saveCustomerTypes, setSaveCustomerTypes } = useSaveCustomerStore();
  // console.log(`saveCustomerTypes`,saveCustomerTypes);

  const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
  const CUSTOMER_TYPE_URL = `${API_SALECONNEXT}/GetCustomertype`;
  const API_URL_POST_CONDITIONSCHECKHISTORY = `${API_SALECONNEXT}/ConditionsCheckHistory`;

  const API_URL_POST_CHECKCUSTOMER = import.meta.env.VITE_APP_API_THIENSURAT;
  const CHECKCUSTOMER_URL = `${API_URL_POST_CHECKCUSTOMER}/CheckCustomer`;

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
  const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}&ProcessType=${auth.processtype}`;
  const GET_IMAGES_API = `${API_URL_MONGO}/Contract/GetContractImage`;

  const CHECKDATACUSTOMER = `${API_SALECONNEXT}/CheckDataCustomer`;

  const [Model, setModel] = useState<string>("");
  const [checktype, setChecktype] = useState<number | null>(null);

  const [customerTypes, setCustomerTypes] = useState<any[]>([]);
  const [valueCalendar, setValueCalendar] = useState<Date | null>(null);
  const [valueAge, setValueAge] = useState<number | null>(
    customerDetail[0]?.CUSTOMERRAGE ?? null
  );
  // console.log(`valueAge`, valueAge);

  const [selectedCustomerType, setSelectedCustomerType] = useState<string>("");
  const [selectedCardType, setSelectedCardType] = useState<string>("");
  const [selectedPrefixId, setSelectedPrefixId] = useState<number>();
  const [selectedSexId, setSelectedSexId] = useState<number>();

  const [idCard, setIdCard] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  // console.log(`lastName`, lastName);
  const [nameMD, setNameMD] = useState<string>("");
  // const [age, setAge] = useState<string>('');
  const [age, setAge] = useState<number | null>(null);
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [workPhone, setWorkPhone] = useState<string>("");

  const selectedCustomer = customerTypes.find(
    (type) => type.CUSTOMERTYPE === selectedCustomerType
  ) || { CARDTYPE: [], PREFIX: [], SEX: [] };

  const [images, setImages] = useState<ImagesType | null>(null);

  // เช็ค validate ฟอร์ม
  const [formValid, setFormValid] = useState<boolean>(false);

  {
    /************ สแกนบัตร ************/
  }
  const [showScanner, setShowScanner] = useState(false);
  // เมื่อ user ถ่ายภาพบัตร เราเก็บ base64 ลง state นี้
  const [idCardBase64, setIdCardBase64] = useState<string | null>(null);

  // state สำหรับเก็บผลลัพธ์ Text จาก OCR.space
  const [ocrResult, setOcrResult] = useState<OCRResultState | null>(null);

  const [isLoadingOCR, setIsLoadingOCR] = useState(false);

  // กรณีดึงมาจากเช็คสถานะลูกค้า เซ็ตค่าลง state แค่ครั้งแรก และสามารถลบแก้ไขค่าได้
  const [hasInitialized, setHasInitialized] = useState(false);

  {
    /****** matchedItem *******/
  }
  const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(false);
  const [draft, setDraft] = useState<any[]>([]);

  // เช็คว่า PDPA มีค่าหรือไม่ ถ้ามีไม่ให้แก้เบอร์
  const isPdpaFilled = Array.isArray(item?.PDPA) && item?.PDPA.length > 0;

  // เดือนภาษาไทย (เต็มรูปแบบ)
  const thaiMonths = [
    { value: 1, label: "มกราคม" },
    { value: 2, label: "กุมภาพันธ์" },
    { value: 3, label: "มีนาคม" },
    { value: 4, label: "เมษายน" },
    { value: 5, label: "พฤษภาคม" },
    { value: 6, label: "มิถุนายน" },
    { value: 7, label: "กรกฎาคม" },
    { value: 8, label: "สิงหาคม" },
    { value: 9, label: "กันยายน" },
    { value: 10, label: "ตุลาคม" },
    { value: 11, label: "พฤศจิกายน" },
    { value: 12, label: "ธันวาคม" },
  ];

  // สร้างลิสต์ปีพ.ศ. (ย้อนหลัง 100 ปี)
  const currentBE = new Date().getFullYear() + 543;
  const yearsBE = Array.from({ length: 100 }, (_, i) => currentBE - i);

  // แยก state สำหรับวัน เดือน ปี
  const [selectedDay, setSelectedDay] = useState<number | "">("");
  const [selectedMonth, setSelectedMonth] = useState<number | "">("");
  const [selectedYearBE, setSelectedYearBE] = useState<number | "">("");

  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYearBE) {
      // แปลงกลับเป็น ค.ศ.
      const yearAD = selectedYearBE - 543;
      const dt = new Date(yearAD, selectedMonth - 1, selectedDay);
      setValueCalendar(dt);
      handleDateChange(dt);
    }
  }, [selectedDay, selectedMonth, selectedYearBE]);

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
  const matchedItem = draft.find((item) => item.REFNO === refno);
  // console.log(`matchedItem`, matchedItem);

  {
    /****** matchedItem *******/
  }

  // เมื่อได้รับ base64 จาก IDCardViewer ให้มา preview ที่หน้า SalesCreateCust
  const handleCapturedImage = (base64Image: string) => {
    setIdCardBase64(base64Image);
    setShowScanner(false);
    setOcrResult(null);
  };

  // ฟังก์ชันเรียก OCR.space API (เมื่อมี idCardBase64)
  const callOCRSpace = async (base64Image: string) => {
    try {
      setIsLoadingOCR(true);
      const API_OCR = import.meta.env.VITE_APP_API_OCR;

      // เตรียม payload ในรูปแบบ FormData
      const formData = new FormData();
      formData.append("apikey", API_OCR);
      formData.append("base64Image", base64Image);
      formData.append("language", "tha"); // อ่านภาษาไทย
      formData.append("isOverlayRequired", "false");
      formData.append("filetype", "PNG"); // หรือ 'JPG' ตาม screenshotFormat
      formData.append("detectOrientation", "true");
      formData.append("isCreateSearchablePdf", "false");
      formData.append("scale", "false");
      formData.append("isTable", "false");
      formData.append("OCREngine", "2"); // ใช้ OCR Engine 2

      const response = await axios.post(
        "https://api.ocr.space/parse/image",
        formData,
        {
          headers: {
            // 'Content-Type' จะถูกเซ็ตเป็น multipart/form-data โดย axios เอง
          },
        }
      );

      const data = response.data;
      if (data.OCRExitCode === 1 && data.ParsedResults) {
        const allText = data.ParsedResults.map(
          (res: any) => res.ParsedText
        ).join("\n");
        setOcrResult({ rawText: allText });
      } else {
        const errMsg = data.ErrorMessage || "Unknown OCR error";
        setOcrResult({ rawText: "", error: errMsg });
      }
    } catch (error: any) {
      setOcrResult({ rawText: "", error: error.message || "Request failed" });
    } finally {
      setIsLoadingOCR(false);
    }
  };

  // เมื่อ selected idCardBase64 เปลี่ยน → เรียก OCR.space
  useEffect(() => {
    if (idCardBase64) {
      callOCRSpace(idCardBase64);
    }
  }, [idCardBase64]);

  {
    /************ สแกนบัตร ************/
  }

  function formatLocalDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  }

  // เก็บข้อมูลส่วนลดใน state และ store
  const SaveCustomertData = useMemo(() => {
    const customerTypeData = customerTypes.find(
      (type) => type.CUSTOMERTYPE === selectedCustomerType
    );
    // console.log("customerTypeData:", customerTypeData);

    return [
      {
        CUSTOMERTYPE: selectedCustomerType,
        CUSTOMERTYPENAME: customerTypeData
          ? customerTypeData.CUSTOMERTYPENAME
          : "", // ตรวจสอบว่าข้อมูล customerTypeData มีหรือไม่
        CUSTOMERID: idCard,
        CUSTOMERNAME: fullName,
        CUSTOMERLASTNAME: lastName || "",
        CUSTOMERMD: nameMD,
        CUSTOMERDOB: valueCalendar
          ? dayjs(valueCalendar).format("YYYY-MM-DD")
          : "",
        CUSTOMERRAGE: valueAge ? valueAge.toString() : "",
        CUSTOMERMOBILE: mobile,
        CUSTOMERWORKPHONE: workPhone,
        CUSTOMERPHONE: phone,
        CUSTOMEREMAIL: email,
        CARDTYPE: customerTypeData?.CARDTYPE
          ? customerTypeData.CARDTYPE.filter((cardType: any) => {
            // console.log("Selected Card Type:", selectedCardType);
            // console.log("Available Card Type:", cardType.CARDTYPE);
            return String(cardType.CARDTYPE) === String(selectedCardType); // ใช้การเปรียบเทียบแบบ string
          }).map((cardType: any) => ({
            CARDTYPE: selectedCardType,
            CARDTYPECODE: cardType.CARDTYPECODE,
            CARDTYPENAME: cardType.CARDTYPENAME,
          }))
          : [],
        PREFIX: customerTypeData?.PREFIX
          ? customerTypeData.PREFIX.filter(
            (prefix: any) => prefix.PREFIXID === selectedPrefixId
          ) // ใช้เฉพาะค่าที่เลือก
            .map((prefix: any) => ({
              PREFIXID: selectedPrefixId,
              PREFIXCODE: prefix.PREFIXCODE,
              PREFIXNAME: prefix.PREFIXNAME,
            }))
          : [],
        SEX: customerTypeData?.SEX
          ? customerTypeData.SEX.filter(
            (sex: any) => sex.SEXID === selectedSexId
          ) // ใช้เฉพาะค่าที่เลือก
            .map((sex: any) => ({
              SEXID: selectedSexId,
              SEXCODE: sex.SEXCODE,
              SEXNAME: sex.SEXNAME,
            }))
          : [],
      },
    ];
  }, [
    customerTypes,
    selectedCustomerType,
    idCard,
    fullName,
    lastName,
    valueCalendar,
    valueAge,
    selectedCardType,
    selectedPrefixId,
    selectedSexId,
    email,
    mobile,
    phone,
    workPhone,
  ]);

  // Handle Customer Type Change
  const handleCustTypeOptionChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedCustomerType(value);
    setSelectedCardType("");
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const calculatedAge = dayjs().diff(dayjs(date), "year");

      if (calculatedAge < 20 || calculatedAge > 85) {
        MySwal.fire({
          icon: "warning",
          title: calculatedAge < 20 ? "อายุไม่ถึงเกณฑ์" : "อายุเกินขอบเขต",
          text:
            calculatedAge < 20
              ? "อายุต้องมากกว่า 20 ปีขึ้นไปจึงทำรายการได้"
              : "อายุต้องไม่เกิน 85 ปี",
          customClass: {
            /* … */
          },
        });

        // ล้าง local state
        setSelectedDay("");
        setSelectedMonth("");
        setSelectedYearBE("");
        setValueCalendar(null);
        setValueAge(null);

        // **ล้าง RHF field**
        setValue("selectedDay", undefined);
        setValue("selectedMonth", undefined);
        setValue("selectedYearBE", undefined);
        return;
      }

      // อายุปกติ
      setValueCalendar(date);
      setValueAge(calculatedAge);
    } else {
      // ล้างกรณี user กดลบ
      setSelectedDay("");
      setSelectedMonth("");
      setSelectedYearBE("");
      setValueCalendar(null);
      setValueAge(null);
      setValue("selectedDay", undefined);
      setValue("selectedMonth", undefined);
      setValue("selectedYearBE", undefined);
    }
  };

  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYearBE) {
      const yearAD = selectedYearBE - 543;
      const dt = new Date(yearAD, selectedMonth - 1, selectedDay);
      handleDateChange(dt);
    }
  }, [selectedDay, selectedMonth, selectedYearBE]);

  const onSubmit = async (formData: FormValues) => {
    try {
      //-------------------------------
      // 1) เตรียม Payload สำหรับเช็คเบอร์/ลูกค้า
      //-------------------------------
      const checkPayload = {
        EmpID: EmpId,
        Tel_Mobile: (mobile || "").replace(/-/g, ""),
        Tel_Work: (workPhone || "").replace(/-/g, ""),
        Tel_Home: (phone || "").replace(/-/g, ""),
        Cus_FName: formData.fullName || "",
        Cus_LName: formData.lastName || "",
        Cus_IDCard: formData.idCard || "",
      };

      //-------------------------------
      // 2) เรียก CHECKDATACUSTOMER
      //-------------------------------
      const checkRes = await axios.post(CHECKDATACUSTOMER, checkPayload, {
        validateStatus: () => true, // สำคัญมาก ทำให้ status 400 ไม่เข้า catch
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("CHECKDATACUSTOMER:", checkRes.data);

      const { statustext, message } = checkRes.data || {};

      // ❌ ไม่ผ่าน → โชว์ alert แล้วหยุด
      if (statustext !== "success") {
        await MySwal.fire({
          icon: "warning",
          text: message,
        });
        return;
      }

      //-------------------------------
      // 3) ผ่าน → เรียก UPDATECONTACT
      //-------------------------------
      const updateContract = await axios.post(
        UPDATECONTACT,
        {
          REFNO: refno,
          EMPID: EmpId,
          TEAMSALE: TeamSale,
          SALECODE: SaleCode,
          SUPEMPID: SupEmpId,
          SECEMPID: SecEmpId,
          FIELD: "CUSTOMERDETAIL",
          DATA: SaveCustomertData,
        },
        {
          validateStatus: () => true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("UPDATECONTACT:", updateContract.data);

      if (updateContract.status === 200 && updateContract.data.data) {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ!",
          text: "ปรับปรุงข้อมูลลูกค้าแล้ว",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate("/sale/update/updateAddress", {
          state: {
            ...matchedItem,
          },
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: updateContract.data.message || "ไม่สามารถอัปเดตข้อมูลได้",
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      MySwal.fire("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
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
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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

  const idCardFromOutside = !!(
    matchedItem?.CUSTOMERDETAIL?.[0]?.CUSTOMERID ||
    matchedItem?.CUSTOMERSTATUS?.[0]?.Searchtext ||
    customerDetail?.CUSTOMERID
  );

  {
    /*-------------------- Start Validate --------------------*/
  }

  const schema = yup.object({
    // 1) ประเภทลูกค้า บังคับกรอกเสมอ
    selectedCustomerType: yup.string().required("กรุณาเลือกประเภทลูกค้า"),

    // 2) ถ้าไม่ใช่ นิติบุคคล (ค่า !== '1') บังคับกรอกประเภทบัตร
    selectedCardType: yup.string().when("selectedCustomerType", {
      is: (v: any) => v === "0" || v === "2",
      then: (s) => s.required("กรุณาเลือกประเภทบัตร"),
      otherwise: (s) => s,
    }),

    // 3) เลขบัตร
    idCard: yup
      .string()
      .when(
        ["selectedCustomerType", "selectedCardType"] as const,
        ([custType, cardType], schema) => {
          if (custType === "0" && cardType === "3") {
            return schema
              .required("กรุณากรอก")
              .matches(/^\d+$/, "กรุณากรอกเป็นตัวเลข");
          }

          if (custType === "1") {
            return schema
              .required("กรุณากรอกเลขประจำตัวผู้เสียภาษี")
              .matches(/^[0-9]{13}$/, "กรุณากรอกเลข 13 หลัก");
          }

          if (custType === "0") {
            return schema
              .required("กรุณากรอก")
              .matches(/^[0-9]{13}$/, "กรุณากรอกเลข 13 หลัก")
              .test("valid-thai-id", "เลขบัตรประชาชนไม่ถูกต้อง", (val) => {
                if (disableIdCard) return true;
                return isValidThaiId(val || "");
              });
          }

          return schema;
        }
      ),

    // 4) คำนำหน้าชื่อ
    selectedPrefixId: yup
      .number()
      // 1) แปลง originalValue === "" → undefined ก่อน cast
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? undefined : value
      )
      // 2) อนุญาตให้เป็น null / undefined ได้ (ถือว่า empty)
      .typeError("กรุณาเลือกคำนำหน้าชื่อ")
      // 4) บังคับ required เมื่อเป็นประเภทลูกค้า 0,1,2,3
      .when("selectedCustomerType", {
        is: (v: any) => ["0", "1", "2", "3"].includes(v),
        then: (schema) => schema.required("กรุณาเลือกคำนำหน้าชื่อ"),
        otherwise: (schema) => schema,
      }),

    // 5) ชื่อ บังคับกรอกเสมอ
    fullName: yup.string().required("กรุณากรอกชื่อ"),
    lastName: yup.string().when("selectedCustomerType", {
      is: (v: any) => v !== "1",
      then: (schema) => schema.trim().required("กรุณากรอกนามสกุล"),
      otherwise: (schema) => schema.notRequired().default(""),
    }),

    // 6–8) วัน / เดือน / ปีเกิด (พ.ศ.) แยกสามฟิลด์
    selectedDay: yup
      .number()
      .when(["selectedCustomerType"] as const, ([custType], schema) =>
        custType === "0" || custType === "2"
          ? schema.required("กรุณาเลือกวันเดือนปีเกิดให้ครบ")
          : schema
      ),
    selectedMonth: yup
      .number()
      .when(["selectedCustomerType"] as const, ([custType], schema) =>
        custType === "0" || custType === "2"
          ? schema.required("กรุณาเลือกวันเดือนปีเกิดให้ครบ")
          : schema
      ),
    selectedYearBE: yup
      .number()
      .when(["selectedCustomerType"] as const, ([custType], schema) =>
        custType === "0" || custType === "2"
          ? schema.required("กรุณาเลือกวันเดือนปีเกิดให้ครบ")
          : schema
      ),

    // 9) เพศ
    selectedSexId: yup
      .number()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? undefined : value
      )
      .typeError("กรุณาเลือกเพศ")
      .when("selectedCustomerType", {
        is: (v: any) => ["0", "2"].includes(v),
        then: (schema) => schema.required("กรุณาเลือกเพศ"),
        otherwise: (schema) => schema,
      }),

    telNo: yup.string().required("กรุณากรอกเบอร์ที่ติดต่อได้ 1"),

    // 11) อีเมล ไม่บังคับ
    email: yup.string().notRequired().email("รูปแบบอีเมลไม่ถูกต้อง"),
  });

  // 2) infer type
  type FormValues = yup.InferType<typeof schema>;

  // 3. เรียก useForm พร้อม resolver
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      selectedCustomerType: "",
      selectedCardType: "",
      idCard: "",
      selectedPrefixId: undefined,
      fullName: "",
      lastName: "",
      selectedDay: undefined,
      selectedMonth: undefined,
      selectedYearBE: undefined,
      selectedSexId: undefined,
      telNo: "",
      email: "",
    },
  });

  // 1) prefill จาก DRAFT
  useEffect(() => {
    if (!isLoadingDraft && matchedItem) {
      const cd = matchedItem.CUSTOMERDETAIL?.[0] ?? {};

      setValue("fullName", cd.CUSTOMERNAME || "");
      setValue("lastName", cd.CUSTOMERLASTNAME || "");
      setValue("idCard", cd.CUSTOMERID || "");
      setValue("telNo", cd.CUSTOMERMOBILE || "");
      setValue("email", cd.CUSTOMEREMAIL || "");

      setSelectedCustomerType(cd.CUSTOMERTYPE || "");
      setSelectedCardType(cd.CARDTYPE?.[0]?.CARDTYPE || "");
      setIdCard(cd.CUSTOMERID || "");
      setFullName(cd.CUSTOMERNAME || "");
      setLastName(cd.CUSTOMERLASTNAME || "");
      setNameMD(cd.CUSTOMERMD || "");
      setSelectedPrefixId(cd.PREFIX?.[0]?.PREFIXID);

      const dobDate = cd.CUSTOMERDOB ? new Date(cd.CUSTOMERDOB) : null;
      setValueCalendar(dobDate);
      setValueAge(dobDate ? dayjs().diff(dayjs(dobDate), "year") : null);
      setSelectedSexId(cd.SEX?.[0]?.SEXID);
      setMobile(cd.CUSTOMERMOBILE || "");
      setPhone(cd.CUSTOMERPHONE || "");
      setWorkPhone(cd.CUSTOMERWORKPHONE || "");
      setEmail(cd.CUSTOMEREMAIL || "");
    }
  }, [isLoadingDraft, matchedItem, setValue]);

  // ค่าที่มากับ CUSTOMERDETAIL
  const prefixIdFromCD = matchedItem?.CUSTOMERDETAIL?.[0]?.PREFIX?.[0]?.PREFIXID;

  useEffect(() => {
    if (prefixIdFromCD == null) return;
    const id = Number(prefixIdFromCD);
    setSelectedPrefixId(id);
    setValue('selectedPrefixId', id, { shouldValidate: true });
    setDidInitPrefix(true);               // <-- ล็อกไม่ให้โดน override ทีหลัง
  }, [prefixIdFromCD, setValue]);

  useEffect(() => {
    if (prefixIdFromCD == null) return;
    const id = Number(prefixIdFromCD);
    setSelectedPrefixId(id);
    setValue('selectedPrefixId', id, { shouldValidate: true });
    setDidInitPrefix(true);               // <-- ล็อกไม่ให้โดน override ทีหลัง
  }, [prefixIdFromCD, setValue]);

  const custTypeFromCD =
    matchedItem?.CUSTOMERDETAIL?.[0]?.CUSTOMERTYPE ?? "";
  const cardTypeFromCD =
    matchedItem?.CUSTOMERDETAIL?.[0]?.CARDTYPE?.[0]?.CARDTYPE ?? "";

  // กัน override
  const [didInitCustType, setDidInitCustType] = useState(false);
  const [didInitCardType, setDidInitCardType] = useState(false);

  // ตั้งประเภทลูกค้าจาก CUSTOMERDETAIL
  useEffect(() => {
    if (didInitCustType) return;
    if (!customerTypes.length) return;
    if (!custTypeFromCD) return;

    setSelectedCustomerType(String(custTypeFromCD));
    setValue("selectedCustomerType", String(custTypeFromCD), {
      shouldValidate: true,
    });
    setDidInitCustType(true);
  }, [customerTypes, custTypeFromCD, didInitCustType, setValue]);

  // ตั้งประเภทบัตรจาก CUSTOMERDETAIL (รอให้ type ตั้งก่อน)
  useEffect(() => {
    if (didInitCardType) return;
    if (!didInitCustType) return;
    if (!cardTypeFromCD) return;

    setSelectedCardType(String(cardTypeFromCD));
    setValue("selectedCardType", String(cardTypeFromCD), {
      shouldValidate: true,
    });
    setDidInitCardType(true);
  }, [didInitCustType, cardTypeFromCD, didInitCardType, setValue]);

  /////////////////////////////////////////////////////////////
  // ชื่อประเภทลูกค้าที่มาจาก CUSTOMERSTATUS (string ภาษาไทย)
  const contractCustTypeName =
    matchedItem?.CUSTOMERSTATUS?.[0]?.Contract?.CustomerType?.trim() || "";

  // เมื่อโหลด customerTypes เสร็จ และมีชื่อประเภทลูกค้า ให้หา item ที่ชื่อไทยตรงกัน
  useEffect(() => {
    if (!contractCustTypeName || customerTypes.length === 0) return;

    const found = customerTypes.find(
      (ct: any) => (ct.CUSTOMERTYPENAME || "").trim() === contractCustTypeName
    );

    if (found) {
      // เซ็ตทั้ง state และค่าใน RHF ให้ select โชว์ตรงกับที่หาได้
      setSelectedCustomerType(String(found.CUSTOMERTYPE));
      setValue("selectedCustomerType", String(found.CUSTOMERTYPE), {
        shouldValidate: true,
        shouldDirty: true,
      });

      // ถ้าต้องการ reset ประเภทบัตรเมื่อเปลี่ยนประเภทลูกค้า
      setSelectedCardType("");
      setValue("selectedCardType", "");
    }
  }, [contractCustTypeName, customerTypes]);

  // ชื่อคำนำหน้าชื่อที่มาจาก CUSTOMERSTATUS (string ภาษาไทย)
  const contractPrefixName =
    matchedItem?.CUSTOMERSTATUS?.[0]?.Contract?.PrefixName?.trim() || ""

  // กันการ override หลังผู้ใช้แก้เอง (ถ้าอยากให้ตั้งค่าแค่ครั้งแรก)
  const [didInitPrefix, setDidInitPrefix] = useState(false)

  // --- เพิ่ม useEffect อีกอัน: เลือกคำนำหน้าชื่อตาม PrefixName ---
  useEffect(() => {
    if (!contractPrefixName || !selectedCustomerType || didInitPrefix) return
    // หา customer type ที่ถูกเลือก
    const ct = customerTypes.find(
      (x: any) => String(x.CUSTOMERTYPE) === String(selectedCustomerType)
    )
    if (!ct || !Array.isArray(ct.PREFIX)) return

    // หา prefix ที่ชื่อไทยตรงกับ PrefixName จาก Contract
    const found = ct.PREFIX.find(
      (p: any) => (p.PREFIXNAME || "").trim() === contractPrefixName
    )
    if (!found) return

    // เซ็ตทั้ง state และ RHF
    setSelectedPrefixId(Number(found.PREFIXID))
    setValue("selectedPrefixId", Number(found.PREFIXID), {
      shouldValidate: true,
      shouldDirty: true,
    })
    setDidInitPrefix(true)
  }, [contractPrefixName, selectedCustomerType, customerTypes]);

  useEffect(() => {
    const newIdCard =
      matchedItem?.CUSTOMERDETAIL?.[0].CUSTOMERID && matchedItem?.CUSTOMERDETAIL?.[0].CUSTOMERID !== "0" ? String(matchedItem?.CUSTOMERDETAIL?.[0].CUSTOMERID) : "";
    setIdCard(newIdCard);
    setValue("idCard", newIdCard, { shouldValidate: true });

    // const rawName = String(contract.CustomerName ?? "").trim();
    // const [first, ...rest] = rawName.split(/\s+/);
    // const last = rest.join(" ");
    setFullName(matchedItem?.CUSTOMERDETAIL?.[0].CUSTOMERNAME || "");
    setLastName(matchedItem?.CUSTOMERDETAIL?.[0].CUSTOMERLASTNAME || "");
    setValue("fullName", matchedItem?.CUSTOMERDETAIL?.[0].CUSTOMERNAME || "");

    // const addr = Array.isArray(contract.Address) ? contract.Address[0] : {};
    // const cleanedMobile = String(
    //   addr.TelMobile || addr.TelHome || addr.TelOffice || ""
    // ).replace(/-/g, "");
    setMobile(matchedItem?.CUSTOMERDETAIL?.[0].CUSTOMERMOBILE);
    setValue("telNo", matchedItem?.CUSTOMERDETAIL?.[0].CUSTOMERMOBILE, { shouldValidate: true });

    // Brithday เก็บรูปแบบ "YYYY-MM-DD" (อาจเป็น พ.ศ. หรือ ค.ศ.)
    const rawDob = matchedItem?.CUSTOMERSTATUS?.[0]?.Contract?.Brithday;

    if (rawDob) {
      // รองรับทั้ง 2020-01-31 และ 2020/01/31
      const parts = rawDob.trim().split(/[-/]/).map(Number);
      // รูปแบบตามโจทย์: ปี-เดือน-วัน
      const [y, m, d] = parts;

      // แปลงปี พ.ศ. -> ค.ศ. (ถ้าเกิน 2400 ถือว่าเป็น พ.ศ.)
      const yearAD = y > 2400 ? y - 543 : y;
      // ปี พ.ศ. ไว้แสดงใน UI
      const yearBE = y > 2400 ? y : y + 543;

      const dob = new Date(yearAD, (m || 1) - 1, d || 1);

      // อัปเดต select วัน/เดือน/ปี (พ.ศ.)
      setSelectedDay(d);
      setSelectedMonth(m);
      setSelectedYearBE(yearBE);

      setValue("selectedDay", d);
      setValue("selectedMonth", m);
      setValue("selectedYearBE", yearBE);

      // เก็บค่า Date (ค.ศ.) สำหรับคำนวณอายุ/validate อื่นๆ
      setValueCalendar(dob);
      setValueAge(dayjs().diff(dayjs(dob), "year"));
    }

    setHasInitialized(true);
  }, [matchedItem?.CUSTOMERDETAIL?.[0]]);

  const hasSearchtext =
    !!matchedItem?.CUSTOMERSTATUS?.[0]?.Searchtext;
  // console.log(`hasSearchtext`, hasSearchtext);

  const searchText =
    matchedItem?.CUSTOMERSTATUS?.[0]?.Searchtext ?? '';
  // console.log(`searchText`, searchText);

  const is13Digits = /^\d{13}$/.test(searchText);

  // ถ้ามีประวัติลูกค้า
  const hasCustomerName =
    !!matchedItem?.CUSTOMERSTATUS?.[0]?.CustomerName;

  // ถ้ามี Searchtext: disable เฉพาะ ลูกค้าบุคคล (0) + บัตรประชาชน (0)
  // ถ้าไม่มี Searchtext: กลับไปใช้เงื่อนไขเดิม (13 หลัก)

  const disableIdCard =
    hasCustomerName
      ? true
      : hasSearchtext
        ? (selectedCustomerType === "0" && selectedCardType === "0")
        : is13Digits;

  {
    /*-------------------- End Validate --------------------*/
  }

  useEffect(() => {
    if (ocrResult && ocrResult.rawText) {
      const text = ocrResult.rawText;

      // 1) ดึงเลขบัตรเหมือนเดิม (กรองช่องว่าง/ขีดออก)
      const match = text.match(/(\d[\d\s\-]{11,}\d)/);
      if (match && match[1]) {
        // 1. ดึงค่าที่จับได้
        const rawId = match[1]; // อาจเป็น "1 103000 078735" หรือ "1103 0000787 35"
        // 2. กรองเอาช่องว่างและขีดออกเหลือตัวเลขติดกัน
        const cleanedId = rawId.replace(/[\s\-]/g, "");

        // 3. เซ็ตลง state และ React Hook Form
        setIdCard(cleanedId);
        setValue("idCard", cleanedId);
        trigger("idCard");
      }

      // 2) ดึงชื่อ-นามสกุล (สมมติว่าชื่อและนามสกุลใน OCR เป็นตัวอักษรไทย แยกด้วยเว้นวรรค)
      //    เราจะจับกลุ่มอักษรไทยสองกลุ่ม ที่คั่นด้วยเว้นวรรคอย่างน้อยหนึ่งตัว
      const nameRegex = /(?:น(?:าย|าง|\.ส\.))\s*([ก-์]+)\s+([ก-์]+)/;
      const nameMatch = text.match(nameRegex);

      if (nameMatch) {
        const firstNameFromOCR = nameMatch[1].trim();
        const lastNameFromOCR = nameMatch[2].trim();

        // เซ็ตลง state และ React Hook Form
        setFullName(firstNameFromOCR);
        setLastName(lastNameFromOCR);
      }

      // 3) ดึงวันเกิด
      const thaiDateRe =
        /เกิดวันที่\s*([0-9]{1,2})\s*(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s*([0-9]{4})/;
      const thaiMatch = text.match(thaiDateRe);
      if (thaiMatch) {
        const day = parseInt(thaiMatch[1], 10);
        const thaiMonthMap: Record<string, number> = {
          "ม.ค.": 1,
          "ก.พ.": 2,
          "มี.ค.": 3,
          "เม.ย.": 4,
          "พ.ค.": 5,
          "มิ.ย.": 6,
          "ก.ค.": 7,
          "ส.ค.": 8,
          "ก.ย.": 9,
          "ต.ค.": 10,
          "พ.ย.": 11,
          "ธ.ค.": 12,
        };
        const rawMonth = thaiMatch[2]; // type string
        const month = thaiMonthMap[rawMonth]; // ไม่เตือนแล้ว
        let year = parseInt(thaiMatch[3], 10);
        if (year > 2400) year -= 543; // ถ้าเป็น พ.ศ. ลบ 543

        const parsed = new Date(year, month - 1, day);
        if (!isNaN(parsed.getTime())) {
          setValueCalendar(parsed);
          handleDateChange(parsed);
          return; // จบเลย ไม่ต้อง fallback English
        }
      }

      // 2) ถ้าไม่เจอวันที่ไทย จึงค่อย fallback English แบบเดิม (optional)
      const engDateRe =
        /Date of (?:surth|birth)\s*([0-9]{1,2})\s*(Jan\.?|Feb\.?|Mar\.?|Apr\.?|May\.?|Jun\.?|Jul\.?|Aug\.?|Sep\.?|Oct\.?|Nov\.?|Dec\.?)\.?\s*([0-9]{4})/i;
      const engMatch = text.match(engDateRe);
      if (engMatch) {
        const day = parseInt(engMatch[1], 10);
        const engMonthMap: Record<string, number> = {
          Jan: 1,
          "Jan.": 1,
          Feb: 2,
          "Feb.": 2,
          Mar: 3,
          "Mar.": 3,
          Apr: 4,
          "Apr.": 4,
          May: 5,
          "May.": 5,
          Jun: 6,
          "Jun.": 6,
          Jul: 7,
          "Jul.": 7,
          Aug: 8,
          "Aug.": 8,
          Sep: 9,
          "Sep.": 9,
          Oct: 10,
          "Oct.": 10,
          Nov: 11,
          "Nov.": 11,
          Dec: 12,
          "Dec.": 12,
        };
        const month = engMonthMap[engMatch[2]];
        const year = parseInt(engMatch[3], 10);
        const parsed = new Date(year, (month || 1) - 1, day);
        if (!isNaN(parsed.getTime())) {
          setValueCalendar(parsed);
          handleDateChange(parsed);
        }
      }
    }
  }, [ocrResult]);

  // นำเข้าเลยข้างบนของไฟล์
  function isValidThaiId(id: string): boolean {
    if (!/^\d{13}$/.test(id)) return false;
    const digits = id.split("").map((d) => parseInt(d, 10));
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * (13 - i);
    }
    const check = (11 - (sum % 11)) % 10;
    return check === digits[12];
  }

  //ย้อนกลับมาจาก SalesCreateAddressCash หรือมาจาก step
  // GET Customertype
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(CUSTOMER_TYPE_URL, {
          headers: { "Content-Type": "application/json" },
        });
        setCustomerTypes(response.data);
      } catch (error) {
        console.error("Error fetching CUSTOMER_TYPE_URL:", error);
      }
    };
    getData();

    // ดึงข้อมูล CUSTOMERDETAIL ที่มีมาจาก props/location
    const cd = customerDetail || {};
    // console.log(`มาจาก SalesCreateAddressCash`, cd);

    // 1) อัปเดตค่าใน RHF form
    setValue("selectedCustomerType", cd.CUSTOMERTYPE || "");
    setValue("selectedCardType", cd.CARDTYPE?.[0]?.CARDTYPE || "");
    setValue("selectedPrefixId", cd.PREFIX?.[0]?.PREFIXID || "");
    setValue("selectedSexId", cd.SEX?.[0]?.SEXID || "");

    setValue("fullName", cd.CUSTOMERNAME || "");
    setValue("telNo", cd.CUSTOMERMOBILE || "");
    setValue("idCard", cd.CUSTOMERID || "");
    setValue("email", cd.CUSTOMEREMAIL || "");

    if (cd.CUSTOMERDOB) {
      // 1. แยก YYYY-MM-DD
      const [yearAD, month, day] = cd.CUSTOMERDOB.split("-").map((v: any) =>
        parseInt(v, 10)
      );
      // 2. คำนวณเป็นปี พ.ศ.
      const yearBE = yearAD + 543;

      // 3. เซ็ต RHF
      setValue("selectedDay", day);
      setValue("selectedMonth", month);
      setValue("selectedYearBE", yearBE);

      // 4. เซ็ต state UI
      setSelectedDay(day);
      setSelectedMonth(month);
      setSelectedYearBE(yearBE);

      // 5. เซ็ตปฏิทินและอายุ
      const dt = new Date(yearAD, month - 1, day);
      setValueCalendar(dt);
      const calcAge = dayjs().diff(dayjs(dt), "year");
      setValueAge(calcAge);
    }

    // 2) อัปเดต state ปกติ เพื่อให้ UI อื่นๆ ใช้ได้
    setSelectedCustomerType(cd.CUSTOMERTYPE);
    setSelectedCardType(cd.CARDTYPE?.CARDTYPE);
    setIdCard(cd.CUSTOMERID);
    setFullName(cd.CUSTOMERNAME);
    setLastName(cd.CUSTOMERLASTNAME);
    setNameMD(cd.CUSTOMERMD);
    setSelectedPrefixId(cd.PREFIX?.[0]?.PREFIXID);
    setAge(cd.CUSTOMERRAGE);
    setSelectedSexId(cd.SEX?.[0]?.SEXID);
    setMobile(cd.CUSTOMERMOBILE);
    setPhone(cd.CUSTOMERPHONE);
    setWorkPhone(cd.CUSTOMERWORKPHONE);
    setEmail(cd.CUSTOMEREMAIL);

    if (product?.[0]?.Package?.[0]) {
      setModel(product?.[0]?.Package?.[0]?.MODEL);
    }
  }, []);

  return (
    <>
      {/* Modal แสดง IDCardViewer เมื่อ showScanner === true */}
      {showScanner && (
        <IDCardOCR
          onCapture={handleCapturedImage}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Preview ภาพบัตรที่ถ่ายได้ (Base64) */}
      {idCardBase64 && (
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <h4 className={`${styles.fontSize}`}>ภาพที่ถ่ายจากกล้อง:</h4>
          <img
            src={idCardBase64}
            alt="ID Card Preview"
            style={{
              maxWidth: "100%",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
        </div>
      )}

      {/* แสดงสถานะการเรียก OCR.space */}
      {idCardBase64 && (
        <div style={{ textAlign: "center", marginTop: 12 }}>
          {isLoadingOCR ? (
            <p className={`${styles.fontSize}`}>
              กำลังอ่านข้อมูลจากบัตร (OCR)...
            </p>
          ) : ocrResult ? (
            <>
              {ocrResult.error ? (
                <div style={{ color: "red" }}>
                  <h5>เกิดข้อผิดพลาดจาก OCR:</h5>
                  <p>{ocrResult.error}</p>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "left",
                    whiteSpace: "pre-wrap",
                    backgroundColor: "#f5f5f5",
                    padding: 12,
                    borderRadius: 4,
                  }}
                >
                  <h5 className={`${styles.fontSize}`}>ผลลัพธ์:</h5>
                  <pre className={`${styles.fontSize}`}>
                    {ocrResult.rawText}
                  </pre>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
      {/* สแกนบัตร */}

      <Content>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex justify-content-between align-items-center my-5">
            <div
              id="kt_page_title"
              data-kt-swapper="true"
              data-kt-swapper-mode="prepend"
              data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
              className="page-title d-flex flex-wrap me-3 flex-column justify-content-ceดnter"
            >
              <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
                <li className={`breadcrumb-item ${styles.titlePage}`}>
                  ข้อมูลลูกค้า
                </li>
              </ul>
            </div>
          </div>
          <span className={`${styles.fontSize}`}>เลขที่ขาย: </span>
          <span className={`${styles.titlePage}`}>{refno}</span>

          {/* Card Body */}
          <div className="accordion mb-10" id="kt_accordion_1">
            {/* Start accordion ข้อมูลลูกค้า*/}
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
                  ข้อมูลลูกค้า
                </h3>
              </h2>
              <div
                id="kt_accordion_1_body_1"
                className="accordion-collapse collapse show"
                aria-labelledby="kt_accordion_1_header_1"
                data-bs-parent="#kt_accordion_1"
              >
                <div className="accordion-body">
                  {/* start form */}
                  <form className="form">
                    <div className="card-body px-lg-9 px-1">
                      {selectedCustomerType !== "1" && (
                        <>
                          <div>
                            <div className="row mb-6">
                              <div className="col-lg-6 my-3">
                                <Controller
                                  name="selectedCustomerType"
                                  control={control}
                                  render={({ field }) => (
                                    <div className="mb-3">
                                      <label
                                        className={`${styles.label} ${styles.required}`}
                                      >
                                        ประเภทลูกค้า
                                      </label>
                                      <select
                                        {...field}
                                        className={`form-select ${styles.label
                                          } ${errors.selectedCustomerType
                                            ? "is-invalid"
                                            : ""
                                          }`}
                                        onChange={(e) => {
                                          field.onChange(e); // อัปเดต RHF
                                          setSelectedCustomerType(
                                            e.target.value
                                          ); // ถ้าคุณยังใช้ state แยกอยู่
                                        }}
                                      >
                                        <option value="">
                                          เลือกประเภทลูกค้า
                                        </option>
                                        {customerTypes.map((ct) => (
                                          <option
                                            key={ct.CUSTOMERTYPE}
                                            value={ct.CUSTOMERTYPE}
                                          >
                                            {ct.CUSTOMERTYPENAME}
                                          </option>
                                        ))}
                                      </select>
                                      {errors.selectedCustomerType && (
                                        <div
                                          className={`invalid-feedback ${styles.label}`}
                                        >
                                          {errors.selectedCustomerType.message}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                />
                              </div>

                              <div className="col-lg-6 my-3">
                                <Controller
                                  name="selectedCardType"
                                  control={control}
                                  render={({ field }) => (
                                    <div className="mb-3">
                                      <label
                                        className={`${styles.label} ${styles.required}`}
                                      >
                                        ประเภทบัตร
                                      </label>
                                      <select
                                        {...field}
                                        className={`form-select ${styles.label
                                          } ${errors.selectedCardType
                                            ? "is-invalid"
                                            : ""
                                          }`}
                                        onChange={(e) => {
                                          field.onChange(e); // อัปเดต RHF
                                          setSelectedCardType(e.target.value); // ถ้าคุณยังใช้ state แยกอยู่
                                        }}
                                      >
                                        <option value="">
                                          เลือกประเภทบัตร
                                        </option>
                                        {selectedCustomer.CARDTYPE.map(
                                          (ct: any) => (
                                            <option
                                              key={ct.CARDTYPE}
                                              value={ct.CARDTYPE}
                                            >
                                              {ct.CARDTYPENAME}
                                            </option>
                                          )
                                        )}
                                      </select>
                                      {errors.selectedCardType && (
                                        <div
                                          className={`invalid-feedback ${styles.label}`}
                                        >
                                          {errors.selectedCardType.message}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row mb-6 mt-6">
                            <div className="col-lg-6 my-3">
                              <label
                                className={`${styles.label} ${styles.required}`}
                              >
                                เลขบัตร
                              </label>
                              <Controller
                                name="idCard"
                                control={control}
                                render={({ field }) => (
                                  <div
                                    className={`input-group ${styles.customInputGroup}`}
                                  >
                                    <input
                                      {...field}
                                      className={`form-control ${styles.label
                                        } ${errors.idCard ? "is-invalid" : ""}`}
                                      value={idCard}
                                      // maxLength={13}
                                      onKeyDown={(e) => {
                                        if (e.key === " " || e.key === "Tab")
                                          e.preventDefault();
                                      }}
                                      disabled={disableIdCard}
                                      onPaste={(e) => {
                                        const cleaned = e.clipboardData
                                          .getData("Text")
                                          .replace(/\s+/g, "");
                                        e.preventDefault();
                                        field.onChange(cleaned);
                                        setIdCard(cleaned);
                                        trigger("idCard");
                                      }}
                                      onChange={(e) => {
                                        const cleaned = e.target.value.replace(
                                          /\s+/g,
                                          ""
                                        );
                                        field.onChange(cleaned);
                                        setIdCard(cleaned);
                                        trigger("idCard");
                                      }}
                                      type="text"
                                      onBlur={field.onBlur}
                                      ref={field.ref}
                                    />
                                    {selectedCardType === "1" && (
                                      <span
                                        className="input-group-text"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setShowScanner(true)}
                                      >
                                        <FontAwesomeIcon icon={faBarcode} />
                                      </span>
                                    )}
                                  </div>
                                )}
                              />
                              {errors.idCard && (
                                <p className={`text-danger ${styles.label}`}>
                                  {errors.idCard.message}
                                </p>
                              )}
                            </div>

                            <div className="col-lg-6 my-3">
                              <Controller
                                name="selectedPrefixId"
                                control={control}
                                render={({ field }) => (
                                  <div className="mb-3">
                                    <label
                                      className={`${styles.label} ${styles.required}`}
                                    >
                                      คำนำหน้าชื่อ
                                    </label>
                                    <select
                                      {...field}
                                      value={field.value ?? ""}
                                      className={`form-select ${styles.label} ${errors.selectedPrefixId
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                      onChange={(e) => {
                                        const raw = e.target.value;
                                        // ถ้าผู้ใช้เลือก placeholder (""), ให้เป็น undefined
                                        const num =
                                          raw === "" ? undefined : Number(raw);
                                        // ส่งเลขหรือ undefined เข้า RHF โดยตรง
                                        field.onChange(num);
                                        // อัปเดต state ภายใน component ด้วย
                                        setSelectedPrefixId(num);
                                      }}
                                    >
                                      <option value="">
                                        เลือกคำนำหน้าชื่อ
                                      </option>
                                      {selectedCustomer.PREFIX.map(
                                        (prefix: any) => (
                                          <option
                                            key={prefix.PREFIXID}
                                            value={prefix.PREFIXID}
                                          >
                                            {prefix.PREFIXNAME}
                                          </option>
                                        )
                                      )}
                                    </select>
                                    {errors.selectedPrefixId && (
                                      <div
                                        className={`invalid-feedback ${styles.label}`}
                                      >
                                        {errors.selectedPrefixId.message}
                                      </div>
                                    )}
                                  </div>
                                )}
                              />
                            </div>

                            <div className="col-lg-6 my-3">
                              <label
                                className={`${styles.label} ${styles.required}`}
                              >
                                ชื่อ
                              </label>
                              <Controller
                                name="fullName"
                                control={control}
                                render={({ field }) => (
                                  <>
                                    <input
                                      {...field}
                                      type="text"
                                      className={`form-control ${styles.label
                                        } ${errors.fullName ? "is-invalid" : ""}`}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setFullName(e.target.value);
                                      }}
                                    />
                                    {errors.fullName && (
                                      <p
                                        className={`text-danger ${styles.label}`}
                                      >
                                        {errors.fullName.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>

                            <div className="col-lg-6 my-3">
                              <label
                                className={`${styles.label} ${styles.required}`}
                              >
                                นามสกุล
                              </label>
                              <Controller
                                name="lastName"
                                control={control}
                                render={({ field }) => (
                                  <>
                                    <input
                                      {...field}
                                      type="text"
                                      className={`form-control mb-3 mb-lg-0 ${styles.label} ${errors.lastName ? "is-invalid" : ""
                                        }`}
                                      value={field.value ?? ""}
                                      onChange={(e) => {
                                        field.onChange(e.target.value);
                                        setLastName(e.target.value);
                                      }}
                                    />
                                    {errors.lastName && (
                                      <p className={`text-danger ${styles.label}`}>
                                        {errors.lastName.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                          </div>

                          <div className="row mb-6">
                            <div className="col-lg-4 my-3">
                              <label
                                className={`${styles.label} ${styles.required}`}
                              >
                                วันเดือนปีเกิด
                              </label>
                              <div className="d-flex gap-2">
                                {/* วัน */}
                                <Controller
                                  name="selectedDay"
                                  control={control}
                                  render={({ field }) => (
                                    <select
                                      {...field}
                                      value={field.value ?? ""}
                                      className={`form-select ${styles.label} ${errors.selectedDay ? "is-invalid" : ""
                                        }`}
                                      onChange={(e) => {
                                        const v = Number(e.target.value) || "";
                                        field.onChange(v);
                                        setSelectedDay(v);
                                      }}
                                    >
                                      <option value="">วัน</option>
                                      {Array.from(
                                        { length: 31 },
                                        (_, i) => i + 1
                                      ).map((day) => (
                                        <option key={day} value={day}>
                                          {day}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                />

                                {/* เดือน */}
                                <Controller
                                  name="selectedMonth"
                                  control={control}
                                  render={({ field }) => (
                                    <select
                                      {...field}
                                      value={field.value ?? ""}
                                      className={`form-select ${styles.label} ${errors.selectedMonth ? "is-invalid" : ""
                                        }`}
                                      onChange={(e) => {
                                        const v = Number(e.target.value) || "";
                                        field.onChange(v);
                                        setSelectedMonth(v);
                                      }}
                                    >
                                      <option value="">เดือน</option>
                                      {thaiMonths.map((m) => (
                                        <option key={m.value} value={m.value}>
                                          {m.label}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                />

                                {/* ปี (พ.ศ.) */}
                                <Controller
                                  name="selectedYearBE"
                                  control={control}
                                  render={({ field }) => (
                                    <select
                                      {...field}
                                      value={field.value ?? ""}
                                      className={`form-select ${styles.label} ${errors.selectedYearBE
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                      onChange={(e) => {
                                        const v = Number(e.target.value) || "";
                                        field.onChange(v);
                                        setSelectedYearBE(v);
                                      }}
                                    >
                                      <option value="">ปี</option>
                                      {yearsBE.map((year) => (
                                        <option key={year} value={year}>
                                          {year}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                />
                              </div>

                              {/* แสดงข้อความ error ถ้ามี */}
                              {errors.selectedYearBE && (
                                <p className={`text-danger ${styles.label}`}>
                                  {errors.selectedYearBE.message}
                                </p>
                              )}
                            </div>

                            <div className="col-lg-4 my-3">
                              <label
                                className={`${styles.label} ${styles.required}`}
                              >
                                อายุ
                              </label>
                              <input
                                value={
                                  valueAge !== null ? valueAge.toString() : ""
                                }
                                type="text"
                                className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                readOnly
                              />
                            </div>
                            {selectedCustomerType !== "1" && (
                              <div className="col-lg-4 my-3">
                                <Controller
                                  name="selectedSexId"
                                  control={control}
                                  render={({ field }) => (
                                    <div className="mb-3">
                                      <label
                                        className={`${styles.label} ${styles.required}`}
                                      >
                                        เพศ
                                      </label>
                                      <select
                                        {...field}
                                        className={`form-select ${styles.label
                                          } ${errors.selectedSexId
                                            ? "is-invalid"
                                            : ""
                                          }`}
                                        onChange={(e) => {
                                          field.onChange(e); // อัปเดต RHF
                                          setSelectedSexId(
                                            Number(e.target.value)
                                          ); // ถ้าคุณยังใช้ state แยกอยู่
                                        }}
                                      >
                                        <option value="">เลือกเพศ</option>
                                        {selectedCustomer.SEX.map(
                                          (sex: any) => (
                                            <option
                                              key={sex.SEXID}
                                              value={sex.SEXID}
                                            >
                                              {sex.SEXNAME}
                                            </option>
                                          )
                                        )}
                                      </select>
                                      {errors.selectedSexId && (
                                        <div
                                          className={`invalid-feedback ${styles.label}`}
                                        >
                                          {errors.selectedSexId.message}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                />
                              </div>
                            )}
                          </div>

                          <div className="row mb-6 mt-6">
                            <div className="col-lg-6 my-3">
                              <label
                                className={`${styles.label} ${styles.required}`}
                              >
                                เบอร์ที่ติดต่อได้ 1
                              </label>
                              <Controller
                                name="telNo"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    className={`${styles.label} form-control ${errors.telNo ? "is-invalid" : ""
                                      }`}
                                    value={(mobile || "").replace(/-/g, "")}
                                    maxLength={10}
                                    onChange={(e) => {
                                      field.onChange(e.target.value);
                                      setMobile(e.target.value);
                                      trigger("telNo");
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                    readOnly={isPdpaFilled}
                                  />
                                )}
                              />
                              {errors.telNo && (
                                <p className={`text-danger ${styles.label}`}>
                                  {errors.telNo.message}
                                </p>
                              )}
                            </div>
                            <div className="col-lg-6 my-3">
                              <label className={`${styles.label}`}>
                                เบอร์ที่ติดต่อได้ 2
                              </label>
                              <input
                                value={(phone || "").replace(/-/g, "")}
                                onChange={(e) => setPhone(e.target.value)}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className={`form-control ${styles.label}`}
                                maxLength={10}
                              />
                            </div>
                          </div>

                          <div className="row mb-6">
                            <div className="col-lg-6 my-3">
                              <label className={`${styles.label}`}>
                                เบอร์ที่ทำงาน
                              </label>
                              <input
                                value={(workPhone || "").replace(/-/g, "")}
                                onChange={(e) => setWorkPhone(e.target.value)}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className={`form-control ${styles.label}`}
                                maxLength={10}
                              />
                            </div>
                            <div className="col-lg-6 my-3">
                              <label className={`${styles.label}`}>
                                อีเมล์
                              </label>
                              <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    className={`${styles.label} form-control ${errors.email ? "is-invalid" : ""
                                      }`}
                                    value={email}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setEmail(e.target.value);
                                      trigger("email");
                                    }}
                                    type="text"
                                  />
                                )}
                              />
                              {errors.email && (
                                <p className={`text-danger ${styles.label}`}>
                                  {errors.email.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Start กรณีประเภทลูกค้าเป็น นิติบุคคล */}
                      {selectedCustomerType == "1" && (
                        <>
                          <div className="">
                            <div className="row mb-6">
                              <div className="col-lg-6 mb-3">
                                <Controller
                                  name="selectedCustomerType"
                                  control={control}
                                  render={({ field }) => (
                                    <div className="mb-3">
                                      <label
                                        className={`${styles.label} ${styles.required}`}
                                      >
                                        ประเภทลูกค้า
                                      </label>
                                      <select
                                        {...field}
                                        className={`form-select ${styles.label
                                          } ${errors.selectedCustomerType
                                            ? "is-invalid"
                                            : ""
                                          }`}
                                        onChange={(e) => {
                                          field.onChange(e); // อัปเดต RHF
                                          setSelectedCustomerType(
                                            e.target.value
                                          ); // ถ้าคุณยังใช้ state แยกอยู่
                                        }}
                                      >
                                        <option value="">
                                          เลือกประเภทลูกค้า
                                        </option>
                                        {customerTypes.map((ct) => (
                                          <option
                                            key={ct.CUSTOMERTYPE}
                                            value={ct.CUSTOMERTYPE}
                                          >
                                            {ct.CUSTOMERTYPENAME}
                                          </option>
                                        ))}
                                      </select>
                                      {errors.selectedCustomerType && (
                                        <div
                                          className={`invalid-feedback ${styles.label}`}
                                        >
                                          {errors.selectedCustomerType.message}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                />
                              </div>

                              <div className="col-lg-6">
                                <label
                                  className={`form-label required ${styles.label}`}
                                >
                                  ชื่อบริษัท
                                </label>

                                <Controller
                                  name="fullName"
                                  control={control}
                                  render={({ field }) => (
                                    <>
                                      <input
                                        {...field}
                                        type="text"
                                        className={`form-control ${styles.label
                                          } ${errors.fullName ? "is-invalid" : ""
                                          }`}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          setFullName(e.target.value);
                                        }}
                                      />
                                      {errors.fullName && (
                                        <p
                                          className={`text-danger ${styles.label}`}
                                        >
                                          {errors.fullName.message}
                                        </p>
                                      )}
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="">
                            <div className="row mb-6">
                              <div className="col-lg-4">
                                <label
                                  className={`form-label ${styles.required} ${styles.label}`}
                                >
                                  เลขประจำตัวผู้เสียภาษี
                                </label>
                                <Controller
                                  name="idCard"
                                  control={control}
                                  render={({ field }) => (
                                    <div
                                      className={`input-group ${styles.customInputGroup}`}
                                    >
                                      <input
                                        {...field}
                                        className={`form-control ${styles.label
                                          } ${errors.idCard ? "is-invalid" : ""}`}
                                        value={idCard}
                                        maxLength={13}
                                        onKeyDown={(e) => {
                                          if (e.key === " " || e.key === "Tab")
                                            e.preventDefault();
                                        }}
                                        onPaste={(e) => {
                                          const cleaned = e.clipboardData
                                            .getData("Text")
                                            .replace(/\s+/g, "");
                                          e.preventDefault();
                                          field.onChange(cleaned);
                                          setIdCard(cleaned);
                                          trigger("idCard");
                                        }}
                                        onChange={(e) => {
                                          const cleaned =
                                            e.target.value.replace(/\s+/g, "");
                                          field.onChange(cleaned);
                                          setIdCard(cleaned);
                                          trigger("idCard");
                                        }}
                                        type="text"
                                        onBlur={field.onBlur}
                                        ref={field.ref}
                                      />
                                      {selectedCardType === "1" && (
                                        <span
                                          className="input-group-text"
                                          style={{ cursor: "pointer" }}
                                          onClick={() => setShowScanner(true)}
                                        >
                                          <FontAwesomeIcon icon={faBarcode} />
                                        </span>
                                      )}
                                    </div>
                                  )}
                                />
                                {errors.idCard && (
                                  <p className={`text-danger ${styles.label}`}>
                                    {errors.idCard.message}
                                  </p>
                                )}
                              </div>
                              <div className="col-lg-4 mb-3">
                                <Controller
                                  name="selectedPrefixId"
                                  control={control}
                                  render={({ field }) => (
                                    <div className="mb-3">
                                      <label
                                        className={`${styles.label} ${styles.required}`}
                                      >
                                        คำนำหน้าชื่อ
                                      </label>
                                      <select
                                        {...field}
                                        className={`form-select ${styles.label
                                          } ${errors.selectedPrefixId
                                            ? "is-invalid"
                                            : ""
                                          }`}
                                        onChange={(e) => {
                                          field.onChange(e); // อัปเดต RHF
                                          setSelectedPrefixId(
                                            Number(e.target.value)
                                          ); // ถ้าคุณยังใช้ state แยกอยู่
                                        }}
                                      >
                                        <option value="">
                                          เลือกคำนำหน้าชื่อ
                                        </option>
                                        {selectedCustomer.PREFIX.map(
                                          (prefix: any) => (
                                            <option
                                              key={prefix.PREFIXID}
                                              value={prefix.PREFIXID}
                                            >
                                              {prefix.PREFIXNAME}
                                            </option>
                                          )
                                        )}
                                      </select>
                                      {errors.selectedPrefixId && (
                                        <div
                                          className={`invalid-feedback ${styles.label}`}
                                        >
                                          {errors.selectedPrefixId.message}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                />
                              </div>
                              <div className="col-lg-4 mb-3">
                                <label className={`form-labe ${styles.label}`}>
                                  กรรมการผู้มีอำนาจ
                                </label>
                                <input
                                  value={nameMD}
                                  onChange={(e) => setNameMD(e.target.value)}
                                  type="text"
                                  className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                />
                              </div>
                            </div>

                            <div className="">
                              <div className="row mb-6 mt-6">
                                <div className="col-lg-6 mb-3">
                                  <label
                                    className={`form-labe required ${styles.label}`}
                                  >
                                    เบอร์ที่ติดต่อได้ 1
                                  </label>
                                  <Controller
                                    name="telNo"
                                    control={control}
                                    render={({ field }) => (
                                      <input
                                        {...field}
                                        className={`${styles.label
                                          } form-control ${errors.telNo ? "is-invalid" : ""
                                          }`}
                                        value={(mobile || "").replace(/-/g, "")}
                                        maxLength={10}
                                        onChange={(e) => {
                                          field.onChange(e.target.value);
                                          setMobile(e.target.value);
                                          trigger("telNo");
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        onBlur={field.onBlur}
                                        ref={field.ref}
                                        readOnly={isPdpaFilled}
                                      />
                                    )}
                                  />
                                  {errors.telNo && (
                                    <p
                                      className={`text-danger ${styles.label}`}
                                    >
                                      {errors.telNo.message}
                                    </p>
                                  )}
                                </div>
                                <div className="col-lg-6 mb-3">
                                  <label
                                    className={`form-labe ${styles.label}`}
                                  >
                                    เบอร์ที่ติดต่อได้ 2
                                  </label>
                                  <input
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={(phone || "").replace(/-/g, "")}
                                    type="text"
                                    className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                    onChange={(e) => setPhone(e.target.value)}
                                    maxLength={10}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="">
                              <div className="row mb-6">
                                <div className="col-lg-6 mb-3">
                                  <label
                                    className={`form-labe ${styles.label}`}
                                  >
                                    เบอร์ที่ทำงาน
                                  </label>
                                  <input
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={(workPhone || "").replace(/-/g, "")}
                                    type="text"
                                    className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                    onChange={(e) =>
                                      setWorkPhone(e.target.value)
                                    }
                                    maxLength={10}
                                  />
                                </div>
                                <div className="col-lg-6 mb-3">
                                  <label
                                    className={`form-labe ${styles.label}`}
                                  >
                                    อีเมล์
                                  </label>
                                  <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="text"
                                    className={`form-control mb-3 mb-lg-0 ${styles.label}`}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {/* End กรณีประเภทลูกค้าเป็น นิติบุคคล */}
                    </div>
                  </form>
                  {/* end form */}
                </div>
              </div>
            </div>
          </div>
          {/* End Card */}

          <div className="d-none d-xl-flex justify-content-between align-items-center my-5">
            <button
              className={`${styles.btnSecondary}`}
              onClick={() =>
                navigate("/sale/update/updateSalesEmployee", {
                  state: {
                    ...matchedItem,
                  },
                })
              }
            >
              แก้ไขพนักงานขาย
            </button>
            <button
              className={`${styles.btnPrimary}`}
              onClick={handleSubmit(onSubmit)}
            >
              ถัดไป
            </button>
            {/* <button
                            className={`btn btn-primary w-100 w-md-auto align-self-center h-50px ${!isDataComplete ? `disabled` : ``}`}
                            disabled={!isDataComplete}
                            onClick={handleCheckerClick}
                        >
                            ส่งตรวจสอบ
                        </button> */}
          </div>

          {/* ปุ่มในหน้าจอเล็ก */}
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
            <button
              className={`${styles.btnSecondary}`}
              onClick={() =>
                navigate("/sale/update/updateSalesEmployee", {
                  state: {
                    ...matchedItem,
                  },
                })
              }
            >
              แก้ไขพนักงานขาย
            </button>
            <button
              className={`${styles.btnPrimary}`}
              onClick={handleSubmit(onSubmit)}
            >
              ถัดไป
            </button>
            {/* <button
                            className={`btn btn-primary w-auto ${!isDataComplete ? `disabled` : ``}`}
                            disabled={!isDataComplete}
                            onClick={handleCheckerClick}
                        >
                            ส่งตรวจสอบ
                        </button> */}
          </div>
        </form>
      </Content>
    </>
  );
};

export default UpdateSaleCustDetail;
