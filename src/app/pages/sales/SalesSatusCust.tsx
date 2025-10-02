import styles from "@/styles/style.module.css";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { KTIcon } from "../../../_metronic/helpers";
import { Content } from "../../../_metronic/layout/components/content";
import { CardStatusCustomer } from "./components/cards/CardStatusCustomer";
import {
  useUUIDStore,
  useSaveProductStore,
} from "../../modules/stores/stepsStore";
import { useAuth } from "../../modules/auth/core/Auth";
import axios from "axios";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ThreeDot } from "react-loading-indicators";

interface ProvinceItem {
  PROVINCENAME: string;
  PROVINCECODE: string;
}

interface DistrictItem {
  DISTRICTNAME: string;
  DISTRICTCODE: string;
}

interface SubDistrictItem {
  SUBDISTRICTNAME: string;
  SUBDISTRICTCODE: string;
}

interface NoHistoryData {
  Searchtext: string;
  payload: any;
}

const SalesSatusCust: React.FC = () => {
  const navigate = useNavigate();
  const { REFNO } = useUUIDStore();
  const { auth } = useAuth();
  // console.log(`auth`, auth);

  const EmpId = auth?.data?.[0]?.EmpId || "";
  const TeamSale = auth?.data?.[0]?.TeamSale || "";
  const SaleCode = auth?.data?.[0]?.SaleCode || "";
  const SupEmpId = auth?.data?.[0]?.SupEmp || "";
  const SecEmpId = auth?.data?.[0]?.SecEmp || "";

  const API_THIENSURAT = import.meta.env.VITE_APP_API_THIENSURAT;
  const CHECK_CUST_NEW_URL = `${API_THIENSURAT}/CheckCustomer/Check_New`;
  // const CHECK_OTP = `${API_THIENSURAT}/CheckCustomer/Check_otp`

  const API_MONGO = import.meta.env.VITE_APP_API_MONGO;
  const SAVEPRODUCTPACKAGE = `${API_MONGO}/Contract/saveProductPackage`;
  const GET_CONTRACT = `${API_MONGO}/Contract/GetContractSummary?refno=${REFNO}`;
  const UPDATECONTACT = `${API_MONGO}/Contract/updateContract`;

  const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
  const PROVINCE_URL = `${API_SALECONNEXT}/GetAddress/Province`;
  const DISTRICT_URL = `${API_SALECONNEXT}/GetAddress/District`;
  const SUBDISTRICT_URL = `${API_SALECONNEXT}/GetAddress/SubDistrict`;

  const [getContract, setGetContract] = useState<any[]>([]);
  // console.log(`getContract`, getContract);

  const ItemCode = getContract[0]?.PRODUCT[0]?.ItemCode;
  const Model = getContract[0]?.PRODUCT[0]?.Package[0]?.MODEL;
  const [idCard, setIdCard] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [customerStatus, setCustomerStatus] = useState<any[]>([]);
  // console.log(`customerStatus`, customerStatus);

  const [getProvince, setGetProvince] = useState<any[]>([]);
  // console.log(`getProvince`, getProvince);
  const [getDistrict, setGetDistrict] = useState<any[]>([]);
  const [getSubDistrict, setGetSubDistrict] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number>();
  const [selectedDistrict, setSelectedDistrict] = useState<number>();
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<number>();

  const [statusCustomerContract, setStatusCustomerContract] =
    useState<any>(null);

  // เช็คว่า user กดปุ่มค้นหาแล้วรึยัง
  const [isSearchDone, setIsSearchDone] = useState(false);

  // ถ้ามีการ์ด ให้คลิกการ์ดก่อน ปุ่มถัดไปจึงจะทำงานได้
  const [hasClickedCard, setHasClickedCard] = useState(false);
  // ตัวแปรคำนวณสำหรับ disable ปุ่ม “ถัดไป”
  const isNextDisabled =
    !isSearchDone || (customerStatus?.length > 0 && !hasClickedCard);

  const [isLoading, setIsLoading] = useState(false);

  const [matchedCustomer, setMatchedCustomer] = useState<any | null>(null);
  // console.log(`matchedCustomer`, matchedCustomer);

  const [matchedCustomers, setMatchedCustomers] = useState<any[]>([]);
  // console.log(`matchedCustomers`, matchedCustomers);

  // 1) เลือกจากลิสต์นี้
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showCardModal, setShowCardModal] = useState(false);

  const isIdSearch = /^\d{13}$/.test(idCard);
  const isPhoneSearch = /^\d{9,10}$/.test(idCard);
  const isNameSearch = !/^\d{13}$/.test(idCard) && !/^\d{9,10}$/.test(idCard);

  const trimmed = idCard.trim();

  // นับจำนวนที่จะแสดง เริ่มที่ 10
  const [visibleCount, setVisibleCount] = useState(10);

  // เตรียมรายการที่จะเรนเดอร์ โดย slice ตาม visibleCount
  const visibleMatched = useMemo(
    () => matchedCustomers.slice(0, visibleCount),
    [matchedCustomers, visibleCount]
  );
  // console.log(`visibleMatched`, visibleMatched);

  const searchData = {
    RefNo: REFNO,
    Search: idCard,
    EmpId,
  };

  // สเตทเก็บการ์ดที่เลือก
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  // console.log(`selectedIdx`, selectedIdx);

  const [noHistoryData, setNoHistoryData] = useState<NoHistoryData | null>(
    null
  );

  // ถ้าค้นหาเจอแค่ 1 ใบ ให้เลือกอัตโนมัติ
  useEffect(() => {
    if (visibleMatched.length === 1) {
      setSelectedIdx(visibleMatched[0]);
    }
  }, [visibleMatched]);

  useEffect(() => {
    if (visibleMatched.length === 1) {
      const cust = visibleMatched[0];
      Swal.fire({
        icon: "info",
        title: cust.CustomerStatus,
        text: cust.Message || "",
        confirmButtonText: "รับทราบ", // เปลี่ยนจาก OK
      });
    }
  }, [visibleMatched]);

  useEffect(() => {
    const getContract = async () => {
      try {
        const response = await axios.get(GET_CONTRACT, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "multipart/form-data",
          },
        });
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setGetContract(data);
      } catch (error) {
        console.error("Error fetching EMP_IN_TEAM_URL:", error);
      }
    };
    getContract();
  }, []);

  // GET Province
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(PROVINCE_URL, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setGetProvince(response.data);
      } catch (error) {
        console.error("Error fetching CUSTOMER_TYPE_URL:", error);
      }
    };
    getData();
  }, []);

  // POST District
  useEffect(() => {
    const getData = async () => {
      if (selectedProvince) {
        // ตรวจสอบว่ามี selectedProvince ก่อนการเรียก API
        try {
          const response = await axios.post(
            DISTRICT_URL,
            { ProvinceCode: selectedProvince },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setGetDistrict(response.data); // อัปเดต district เมื่อได้รับข้อมูลใหม่
        } catch (error) {
          console.error("Error fetching DISTRICT_URL:", error);
        }
      } else {
        setGetDistrict([]); // ล้างข้อมูล district เมื่อไม่ได้เลือก province
      }
    };
    getData();
  }, [selectedProvince]);

  // POST SubDistrict
  useEffect(() => {
    const fetchSubDistricts = async () => {
      if (selectedDistrict) {
        try {
          const response = await axios.post(
            SUBDISTRICT_URL,
            { DistrictCode: selectedDistrict },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setGetSubDistrict(response.data);
        } catch (error) {
          console.error("Error fetching SUBDISTRICT_URL:", error);
        }
      } else {
        setGetSubDistrict([]);
      }
    };
    fetchSubDistricts();
  }, [selectedDistrict]);

  const checkCustomer = async () => {
    const txt = idCard.trim();
    if (!txt) {
      setError("กรุณากรอกข้อมูล");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const resp = await axios.post(
        CHECK_CUST_NEW_URL,
        { RefNo: REFNO, Search: txt, EmpId },
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setIsLoading(false);

      const { status, message, data } = resp.data;
      if (status === 400) {
        await Swal.fire({
          icon: "warning",
          title: message,
          confirmButtonText: "ตกลง",
        });
        return;
      }

      const allData: any[] = Array.isArray(data) ? data : [];
      // console.log(`allData`, allData);

      // — กรณี no history —
      if (allData.length === 0) {
        setNoHistoryData({ Searchtext: txt, payload: resp.data });
        setMatchedCustomers([]);
        setIsSearchDone(true);
        await Swal.fire({
          icon: "info",
          title: "ไม่พบประวัติลูกค้า",
          confirmButtonText: "รับทราบ",
        });
        return;
      }

      // — กรณีมี history —
      // กรองเลขบัตร/เบอร์/ชื่อ
      const isNum = /^\d+$/.test(txt);
      let list = isNum
        ? allData.filter((i) => {
          const id = i.Contract?.IDCard || "";
          if (id.includes(txt)) return true;
          const phones = [
            i.Contract.Address[0]?.TelMobile,
            i.Contract.Address[0]?.TelHome,
            i.Contract.Address[0]?.TelOffice,
          ].filter(Boolean) as string[];
          return phones.some((t) => t.includes(txt));
        })
        : allData.filter((i) =>
          i.Contract?.CustomerName?.trim()
            .toLowerCase()
            .includes(txt.toLowerCase())
        );
      // ตัดชื่อซ้ำ
      list = Array.from(
        new Map(list.map((i) => [i.Contract.CustomerName.trim(), i])).values()
      );

      if (list.length === 0) {
        await Swal.fire({
          icon: "info",
          title: "ไม่พบประวัติหลังกรอง",
          confirmButtonText: "ตกลง",
        });
        return;
      }
      // console.log(`list`, list);

      setMatchedCustomers(list);
      setNoHistoryData(null);
      setIsSearchDone(true);
      // ถ้าเหลือแค่ใบเดียว
      if (list.length === 1) {
        setSelectedIdx(0);
        const only = list[0];
        await Swal.fire({
          icon: "info",
          title: only.CustomerStatus,
          text: only.Message || "",
          confirmButtonText: "รับทราบ",
        });
      }
    } catch (e) {
      setIsLoading(false);
      console.error(e);
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เชื่อมต่อไม่สำเร็จ",
        confirmButtonText: "ตกลง",
      });
    }
  };

  const handleCheckStatusCustomer = (customer: any) => {
    // console.log(`customer`, customer);

    Swal.fire({
      icon: "info",
      title: customer.CustomerStatus,
      text: customer.Message || "",
      showLoaderOnConfirm: true,
      confirmButtonText: "บันทึกข้อมูล",
      // เมื่อผู้ใช้กด OK จะเรียก preConfirm
      preConfirm: () =>
        axios
          .post(
            SAVEPRODUCTPACKAGE,
            {
              REFNO,
              EMPID: EmpId,
              TEAMSALE: TeamSale,
              SALECODE: SaleCode,
              SUPEMPID: SupEmpId,
              SECEMPID: SecEmpId,
              STATUS: "DRAFT",
              DATA: [
                {
                  ...customer,
                  Searchtext: idCard,
                },
              ],
            },
            { headers: { "Content-Type": "application/json" } }
          )
          .then((response) => {
            // คืนค่าผลลัพธ์ให้ then ต่อไป
            return response.data;
          })
          .catch((error) => {
            // ถ้าล้มเหลว แสดง validation message ใน modal เดิม
            Swal.showValidationMessage(`บันทึกล้มเหลว: ${error.message}`);
          }),
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        // ถ้าสำเร็จ ให้แจ้ง success และไปหน้า next
        Swal.fire({
          icon: "success",
          title: "บันทึกข้อมูลเรียบร้อยแล้ว",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/sale/package"); // หรือจะไปหน้าไหนก็ปรับได้
        });
      }
    });
  };

  useEffect(() => {
    if (customerStatus) {
      const province =
        customerStatus?.[0]?.Contract?.Address?.[0]?.Province || "";
      const selectedProvinceCode =
        getProvince.find((item) => item.PROVINCENAME === province)
          ?.PROVINCECODE || "";

      setSelectedProvince(selectedProvinceCode); // ตั้งค่าจังหวัดเพื่อดึงอำเภอ
    }
  }, [customerStatus, getProvince]);

  // โหลดอำเภอหลังจากเลือกจังหวัด
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.post(
            DISTRICT_URL,
            { ProvinceCode: selectedProvince },
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          setGetDistrict(response.data);

          // ตั้งค่าอำเภออัตโนมัติหลังโหลดเสร็จ
          const districtRaw =
            customerStatus?.[0]?.Contract?.Address?.[0]?.Amphur || "";
          const district = districtRaw.replace(/^อ\.\s*/, ""); // ตัด "อ." ออก
          const districtCode =
            response.data.find(
              (item: DistrictItem) => item.DISTRICTNAME === district
            )?.DISTRICTCODE || "";

          setSelectedDistrict(districtCode); // ตั้งค่าอำเภอเพื่อดึงตำบล
        } catch (error) {
          console.error("Error fetching DISTRICT_URL:", error);
        }
      };
      fetchDistricts();
    }
  }, [selectedProvince, customerStatus]);

  // โหลดตำบลหลังจากเลือกอำเภอ
  useEffect(() => {
    if (selectedDistrict) {
      const fetchSubDistricts = async () => {
        try {
          const response = await axios.post(
            SUBDISTRICT_URL,
            { DistrictCode: selectedDistrict },
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          setGetSubDistrict(response.data);

          // ตั้งค่าตำบลอัตโนมัติหลังโหลดเสร็จ
          const subDistrictRaw =
            customerStatus?.[0]?.Contract?.Address?.[0]?.District || "";
          const subDistrict = subDistrictRaw.replace(/^ต\.\s*/, ""); // ตัด "ต." ออก
          const subDistrictCode =
            response.data.find(
              (item: SubDistrictItem) => item.SUBDISTRICTNAME === subDistrict
            )?.SUBDISTRICTCODE || "";

          setSelectedSubDistrict(subDistrictCode); // ตั้งค่าตำบล
          // console.log('subDistrictCode:', subDistrictCode);
        } catch (error) {
          console.error("Error fetching SUBDISTRICT_URL:", error);
        }
      };
      fetchSubDistricts();
    }
  }, [selectedDistrict, customerStatus]);

  // map การ์ดที่เลือก -> โครง `CUSTOMERDETAIL`
  function buildCustomerDetailFromCard(card: any) {
    const c = card?.Contract ?? {};

    return {
      // ปรับตามที่ต้องการ/มีข้อมูล
      CUSTOMERTYPE: "",                 // ยังไม่มี mapping → ใส่ค่าว่างไว้ก่อน
      CUSTOMERTYPENAME: "",

      CUSTOMERID: String(c.IDCard ?? "").replace(/\D/g, ""),
      CUSTOMERNAME: c.CustomerFirstName ?? "",
      CUSTOMERLASTNAME: c.CustomerLastName ?? "",
      CUSTOMERMD: "",                   // กรรมการ (นิติบุคคล) ถ้ายังไม่รู้ ปล่อยว่าง

      CUSTOMERDOB: "",
      CUSTOMERRAGE: "",

      CUSTOMERMOBILE: String(c.Address[0].TelMobile ?? "").replace(/\D/g, ""),
      CUSTOMERWORKPHONE: String(c.Address[0].TelOffice ?? "").replace(/\D/g, ""),
      CUSTOMERPHONE: String(c.Address[0].TelHome ?? "").replace(/\D/g, ""),
      CUSTOMEREMAIL: String(c.Address[0].EMail ?? "").replace(/\D/g, ""),

      // ถ้าต้องการบังคับเป็น array ตาม schema แต่ยังไม่มีรหัสที่ระบบใช้ ให้เว้นไว้ก่อน
      CARDTYPE: [],  // หรือ map เองถ้ารู้ code: [{ CARDTYPE, CARDTYPECODE, CARDTYPENAME }]
      PREFIX: [],   // หรือ [{ PREFIXID, PREFIXCODE, PREFIXNAME: c.PrefixName }]
      SEX: [],   // หรือ [{ SEXID, SEXCODE, SEXNAME }]
    };
  }

  function buildCustomerDetailFromNoHistory(search: string) {
    const s = (search || "").trim();
    return {
      CUSTOMERTYPE: "",
      CUSTOMERTYPENAME: "",
      CUSTOMERID: /^\d{13}$/.test(s) ? s : "",
      CUSTOMERNAME: /^\d+$/.test(s) ? "" : s, // ถ้าไม่ใช่เลขล้วน ให้ถือว่าเป็นชื่อ
      CUSTOMERLASTNAME: "",
      CUSTOMERMD: "",
      CUSTOMERDOB: "",
      CUSTOMERRAGE: "",
      CUSTOMERMOBILE: /^\d{9,10}$/.test(s) ? s : "",
      CUSTOMERWORKPHONE: "",
      CUSTOMERPHONE: "",
      CUSTOMEREMAIL: "",
      CARDTYPE: [],
      PREFIX: [],
      SEX: [],
    };
  }

  // const handleNextClick = async () => {
  //   let cust: any = null;

  //   if (noHistoryData) {
  //     cust = { ...noHistoryData.payload, Searchtext: noHistoryData.Searchtext };
  //   } else if (visibleMatched.length === 1) {
  //     cust = { ...visibleMatched[0], Searchtext: idCard.trim() };
  //   } else if (selectedIdx !== null) {
  //     cust = { ...visibleMatched[selectedIdx], Searchtext: idCard.trim() };
  //   }
  //   if (!cust) {
  //     return Swal.fire("Warning", "กรุณาเลือกการ์ดก่อน", "warning");
  //   }
  //   console.log(`การ์ดที่เลือก`, [cust]);

  //   try {
  //     await axios.post(
  //       SAVEPRODUCTPACKAGE,
  //       {
  //         REFNO,
  //         EMPID: EmpId,
  //         TEAMSALE: TeamSale,
  //         SALECODE: SaleCode,
  //         SUPEMPID: SupEmpId,
  //         SECEMPID: SecEmpId,
  //         STATUS: "DRAFT",
  //         LATITUDE: localStorage.getItem("latitude") || "",
  //         LONGITUDE: localStorage.getItem("longitude") || "",
  //         DATA: [cust],
  //       },
  //       { headers: { "Content-Type": "application/json" } }
  //     );

  //     // >>> บันทึก CUSTOMERDETAIL จากการ์ดที่เลือก <<<
  //     const customerDetailPayload = buildCustomerDetailFromCard(cust);
  //     await axios.post(
  //       UPDATECONTACT,
  //       {
  //         REFNO,
  //         EMPID: EmpId,
  //         TEAMSALE: TeamSale,
  //         SALECODE: SaleCode,
  //         SUPEMPID: SupEmpId,
  //         SECEMPID: SecEmpId,
  //         FIELD: "CUSTOMERDETAIL",
  //         DATA: [customerDetailPayload],   // *** สำคัญ: ต้องเป็น array ***
  //       },
  //       { headers: { "Content-Type": "application/json" } }
  //     );

  //     await Swal.fire({
  //       icon: "success",
  //       title: "บันทึกเรียบร้อยแล้ว",
  //       timer: 1500,
  //       showConfirmButton: false,
  //     });
  //     navigate("/sale/package");
  //   } catch (err) {
  //     console.error(err);
  //     Swal.fire("Error", "ไม่สามารถบันทึกข้อมูลได้", "error");
  //   }
  // };

  const handleNextClick = async () => {
    let picked: any = null;

    if (noHistoryData) {
      picked = { Searchtext: noHistoryData.Searchtext }; // พอสำหรับบันทึกแพ็คเกจ
    } else if (visibleMatched.length === 1) {
      picked = visibleMatched[0];
    } else if (selectedIdx !== null) {
      picked = visibleMatched[selectedIdx];
    }

    if (!picked) {
      return Swal.fire("Warning", "กรุณาเลือกการ์ดก่อน", "warning");
    }

    try {
      // 1) บันทึกแพ็กเกจเหมือนเดิม (ส่งสิ่งที่เลือก หรือ searchtext กรณีไม่พบประวัติ)
      await axios.post(
        SAVEPRODUCTPACKAGE,
        {
          REFNO,
          EMPID: EmpId,
          TEAMSALE: TeamSale,
          SALECODE: SaleCode,
          SUPEMPID: SupEmpId,
          SECEMPID: SecEmpId,
          STATUS: "DRAFT",
          LATITUDE: localStorage.getItem("latitude") || "",
          LONGITUDE: localStorage.getItem("longitude") || "",
          DATA: [picked],
        },
        { headers: { "Content-Type": "application/json" } }
      );

      // 2) สร้าง CUSTOMERDETAIL ตามแหล่งที่มา
      const detail = noHistoryData
        ? buildCustomerDetailFromNoHistory(noHistoryData.Searchtext)
        : buildCustomerDetailFromCard(picked);

      // 3) บันทึก CUSTOMERDETAIL (สำคัญ: DATA ต้องเป็น array)
      await axios.post(
        UPDATECONTACT,
        {
          REFNO,
          EMPID: EmpId,
          TEAMSALE: TeamSale,
          SALECODE: SaleCode,
          SUPEMPID: SupEmpId,
          SECEMPID: SecEmpId,
          FIELD: "CUSTOMERDETAIL",
          DATA: [detail],
        },
        { headers: { "Content-Type": "application/json" } }
      );

      await Swal.fire({
        icon: "success",
        title: "บันทึกเรียบร้อยแล้ว",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/sale/package");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  return (
    <>
      <Content>
        <div className="d-flex justify-content-between align-items-center mt-lg-5 my-5">
          <div
            id="kt_page_title"
            data-kt-swapper="true"
            data-kt-swapper-mode="prepend"
            data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
            className="page-title d-flex flex-wrap me-3 flex-column justify-content-center"
          >
            <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0">
              <li
                className={`breadcrumb-item text-gray-900 font ${styles.titlePage}`}
              >
                ตรวจสอบสถานะลูกค้า
              </li>
            </ul>
          </div>
        </div>
        <span className={`${styles.fontSize}`}>เลขที่ขาย: </span>
        <span className={`${styles.titlePage}`}>{REFNO}</span>

        {/* ทำให้ card-body เป็น flex column */}
        <div className="card mb-10">
          <div className="card-body d-flex flex-column">
            {/* ส่วนค้นหา: ดันลงขอบล่าง และเรียง Input ก่อน ตามด้วยปุ่ม */}
            <div className="mt-auto d-flex flex-column align-items-end mb-4">
              <input
                type="text"
                className={`form-control mb-2 ${styles.fontSize} ${error ? "is-invalid" : ""
                  }`}
                placeholder="เลขบัตรประชาชน, ชื่อ สกุล, เบอร์"
                value={idCard}
                onChange={(e) => {
                  setIdCard(e.target.value);
                  setError("");
                }}
                style={{ width: "100%" }} // หรือกำหนดความกว้างตามต้องการ
              />
              <button
                className={styles.btnPrimary}
                type="button"
                onClick={checkCustomer}
                disabled={idCard.length === 0}
              >
                ค้นหา
              </button>
            </div>

            {error && <div className="invalid-feedback d-block">{error}</div>}

            {isLoading && (
              <div className="text-center my-10">
                <ThreeDot />
                <p className={`my-5 ${styles.fontSize}`}>
                  กำลังค้นหาข้อมูล กรุณารอสักครู่ ...
                </p>
              </div>
            )}

            {/* CardStatusCustomer Component */}
            {!isLoading && visibleMatched.length > 0 && (
              <div>
                <CardStatusCustomer
                  customerStatus={visibleMatched}
                  selectedIdx={selectedIdx}
                  handleSelectCard={(idx, cust) => {
                    setSelectedIdx(idx);
                    Swal.fire({
                      icon: "info",
                      title: cust.CustomerStatus,
                      html: cust.Message.replace(/\n/g, "<br/>"),
                      confirmButtonText: "รับทราบ",
                      customClass: {
                        htmlContainer: "swal-scrollable-content",
                      },
                    });
                  }}
                />
              </div>
            )}

            {/* ปุ่มดูข้อมูลเพิ่มเติม */}
            {!isLoading && visibleCount < matchedCustomers.length && (
              <div className="text-center mt-2">
                <button
                  className="btn btn-link"
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                >
                  ดูข้อมูลเพิ่มเติม
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ซ่อนปุ่มทั้งหมดขณะกำลังโหลด */}
        {!isLoading && (
          <>
            {/* ปุ่มบนหน้าจอใหญ่ */}
            <div className="d-none d-xl-flex justify-content-between align-items-center mt-5 mb-10">
              <button
                className={styles.btnSecondary}
                onClick={() => navigate("/sale/overview")}
              >
                กลับหน้าแรก
              </button>
              <button
                className={`${styles.btnPrimary} ${!isSearchDone || isNextDisabled ? "disabled" : ""
                  }`}
                onClick={handleNextClick}
                disabled={!isSearchDone || isNextDisabled}
              >
                ถัดไป
              </button>
            </div>

            {/* ปุ่มบนหน้าจอเล็ก */}
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
                className={styles.btnSecondary}
                onClick={() => navigate("/sale/overview")}
              >
                กลับหน้าแรก
              </button>
              <button
                className={`${styles.btnPrimary} ${!isSearchDone || isNextDisabled ? "disabled" : ""
                  }`}
                onClick={handleNextClick}
                disabled={!isSearchDone || isNextDisabled}
              >
                ถัดไป
              </button>
            </div>
          </>
        )}
      </Content>
    </>
  );
};

export default SalesSatusCust;
