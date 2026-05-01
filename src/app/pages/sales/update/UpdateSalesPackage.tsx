import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/style.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useRef, useMemo } from "react";
import { Content } from "../../../../_metronic/layout/components/content";
import { useAuth } from "../../../modules/auth/core/Auth";
import {
  useUUIDStore,
  useSaveProductStore,
} from "../../../modules/stores/stepsStore";
import useRefnoBarcodeStore from "../components/accessCam/refnoBarcodeStore";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { ThreeDot } from "react-loading-indicators";

//useStore
import {
  useCategoryStore,
  useFetchCategoryStore,
  useProductStore,
  usePackageStore,
  useConditionsCheckHistoryStore,
} from "../../../modules/stores/sales/packageStore/packageStore";

//component
import { CardProduct } from "../components/cards/CardProduct";
import { CardProductBundle } from "../components/cards/CardProductBundle";
import { CardPackage } from "../components/cards/CardPackage";

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
  CHECKERCOMMENT: [any];
  barCode?: string; // เพิ่ม property barCode
  item?: {
    REFNO: string; // เพิ่ม item เป็น optional object
    barcode: string;
  };
}

// กรณีย้อนมาจาก DeviceScanBarcode
interface ScanReturnState {
  itemFromDevice: ItemProps;
  refno: string;
  barCode: string;
}

// กรณีเข้ามาจากหน้า step (เดิม)
type StepState = ItemProps & { fromDiscount?: boolean };

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

const UpdateSalesPackage: React.FC = () => {
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับการเปลี่ยนเส้นทาง
  const { auth } = useAuth();
  const MySwal = withReactContent(Swal);

  const location = useLocation();
  // union สองกรณี
  const state = location.state as ScanReturnState | StepState;
  // console.log(`state`, state);

  // ถ้ามี itemFromDevice ให้ใช้ ถ้าไม่มีก็คือเข้ามาจาก step => state เองก็คือ ItemProps
  const item: ItemProps =
    "itemFromDevice" in state ? state.itemFromDevice : (state as StepState);
  // console.log(`item`, item);

  // refno: ถ้ามาจาก scan ก็อ่าน state.refno อ่านไม่เจอ fallback เป็น item.REFNO
  const refno = "refno" in state ? state.refno : item.REFNO;

  // barcode ถ้ามีให้เก็บไว้ (อาจ undefined เมื่อเข้าจาก step)
  const barCode = "barCode" in state ? state.barCode : undefined;

  // const fromDiscount = item.fromDiscount === true;

  // const { refno, barCode, setRefno, setBarCode } = useRefnoBarcodeStore((state) => ({
  //     refno: state.refno,
  //     barCode: state.barCode,
  //     setRefno: state.setRefno,
  //     setBarCode: state.setBarCode,
  // }));

  const productContract = item?.PRODUCT || [];
  // console.log(`productContract`, productContract);

  const [loadingCategories, setLoadingCategories] = useState(true); // เพิ่ม state สำหรับการโหลดหมวดหมู่
  const [loadingProducts, setLoadingProducts] = useState(false); // เพิ่ม state สำหรับการโหลดสินค้า
  const [loadingPackages, setLoadingPackages] = useState(true);

  const { fetchCategory } = useFetchCategoryStore();
  // console.log(fetchCategory: , fetchCategory);

  const [categories, setCategories] = useState<any[]>([]);

  const [packageType, setPackageType] = useState<any[]>([]);
  // console.log(packageType: , packageType);

  const [promotion, setPromotion] = useState<any[]>([]);
  // console.log(promotion: , promotion);

  const [packageList, setPackageList] = useState<any[]>([]);
  // console.log(`packageList:`, packageList);

  const [selectedCategoryId, setSelectedCategoryId] = useState<any>("");
  // console.log(selectedCategoryId, selectedCategoryId);

  const [selectedProductIndex, setSelectedProductIndex] = useState<
    number | null
  >(null);
  // console.log(selectedProductIndex, selectedProductIndex);
  const [selectedItemCode, setSelectedItemCode] = useState<string | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<number | null>(null);

  // กัน useEffect เซ็ตโปรทับหลังจาก user เลือกเองแล้ว
  const promotionTouchedRef = useRef(false);

  // ถ้า db PromotionId = "" ให้บังคับเลือกอันที่ 0 (ไม่มีโปรโมชั่น)
  const normalizePromotionId = (value: any): number | null => {
    if (value === "" || value === null || value === undefined) return null;

    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  };

  const [selectedItemDescription, setSelectedItemDescription] = useState<
    string | null
  >(null);
  const [selectedDescriptionEN, setSelectedDescriptionEN] = useState<
    string | null
  >(null);
  const [selectedDescriptionTH, setSelectedDescriptionTH] = useState<
    string | null
  >(null);
  const [selectedSerialNo, setSelectedSerialNo] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedTransDate, setSelectedTransDate] = useState<string | null>(
    null
  );
  const [productId, setProductId] = useState(null); // สร้าง state สำหรับเก็บ _id
  // console.log(productId, productId);

  const [selectedPackageTypeId, setSelectedPackageTypeId] = useState<
    number | null
  >(null);
  // console.log(`selectedPackageTypeId:`, selectedPackageTypeId);

  const [selectedPackageModel, setSelectedPackageModel] = useState<
    number | null
  >(null);
  // console.log(`selectedPackageModel`, selectedPackageModel);

  const [checktype, setChecktype] = useState<number | null>(null);
  // console.log(checktype, checktype);

  const {
    barCode: barCodeNormal,
    barCodeBundle,
    bundleProduct,
    promotionId, // <-- ดึงกลับมา
    selectedItemCode: codeFromState,
    productId: prodFromState,
  } = (location.state as any) || {};

  const [bundleOk, setBundleOk] = useState(false);
  // console.log(`bundleOk: `, bundleOk);
  const [useBundle, setUseBundle] = useState<"normal" | "bundle" | null>(null);
  // console.log(`useBundle: `, useBundle);
  const [scannedBundleProduct, setScannedBundleProduct] = useState<any | null>(
    null
  );
  const [scanningBundle, setScanningBundle] = useState(false);

  // เพิ่ม state สำหรับเก็บ options
  const [promotionOptions, setPromotionOptions] = useState<any[]>([]);
  const [mainPackages, setMainPackages] = useState<any[]>([]);

  useEffect(() => {
    if (bundleProduct && barCodeBundle) {
      setUseBundle("bundle");
      setBundleOk(true);
      setScannedBundleProduct(bundleProduct);

      // เซ็ตโปรโมชั่นกลับคืน
      if (promotionId !== undefined) {
        setSelectedPromotion(promotionId);
      }
    }
  }, [bundleProduct, barCodeBundle, promotionId, codeFromState, prodFromState]);

  // 2) เปลี่ยนตัว fetch bundle จากใช้ `barCode` เป็นใช้ `barCodeBundle`
  useEffect(() => {
    if (useBundle === "bundle" && barCodeBundle) {
      axios
        .get(`${GET_STOCK_URL}`, {
          params: { empid: EmpId, teamSale: TeamSale, sn: barCodeBundle },
        })
        .then((res) => {
          const items = Array.isArray(res.data.data) ? res.data.data : [];
          if (items.length) {
            setScannedBundleProduct(items[0]);
          } else {
            Swal.fire("ไม่พบสินค้า", `ไม่พบ S/N: ${barCodeBundle}`, "warning");
          }
        })
        .catch(console.error);
    }
  }, [barCodeBundle, useBundle]);

  const {
    EmpId,
    setEmpId,
    TeamSale,
    setTeamSale,
    SaleCode,
    setSaleCode,
    SupEmpId,
    setSupEmpId,
    SecEmpId,
    setSecEmpId,
    DivisionId,
    setDivisionId,
    DepartId,
    setDepartId,
    DepartGroup,
    setDepartGroup,
  } = useCategoryStore();
  // console.log(EmpId, EmpId);
  // console.log(EmpId, EmpId);

  // ✅ เช็คว่าสินค้าหลักสามารถทำบันเดิลได้ไหม (หน้าแก้ไข)
  useEffect(() => {
    if (!productContract?.length) return;

    const main = productContract.find((p: any) => p.MainItem === "Y");
    if (!main || !EmpId) return;

    const form = new FormData();
    form.append("ItemID", main.ItemCode);
    form.append("EmpId", EmpId);
    form.append("DivisionId", DivisionId);
    form.append("DepartId", DepartId);
    form.append("DepartGroup", DepartGroup);
    form.append("TeamSale", TeamSale);
    form.append("ProductID", main.ProductID);

    axios
      .post(CHECK_PRODUCT_BUNDLE, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        const { statustext } = res.data;
        // success = มีบันเดิลให้เลือก → โชว์ปุ่ม "บันเดิล"
        setBundleOk(statustext === "success");
      })
      .catch(() => setBundleOk(false));
  }, [productContract, EmpId, DivisionId, DepartId, DepartGroup, TeamSale]);

  const getCategoryLocal = localStorage.getItem("fetchCategory");
  const parsegetCategoryLocal = getCategoryLocal
    ? JSON.parse(getCategoryLocal)
    : null;

  const { product, setProduct } = useProductStore();
  // console.log(`product:`, product);

  const [PackageTypeID, setPackageTypeID] = useState<number | null>(null);
  const { ItemID, setItemID } = usePackageStore();
  // console.log(ItemID: , ItemID);
  // console.log(PackageTypeID: , PackageTypeID);

  const { Model, setModel } = useConditionsCheckHistoryStore();

  const { PRODUCT, SETPRODUCT } = useSaveProductStore();

  const SaveProductData = useMemo(() => {
    const rows: any[] = [];

    // 1) เก็บสินค้า Main เป็นตัวแรกเสมอ
    rows.push({
      MainItem: "Y",
      EmpId: EmpId || "",
      TeamSale: TeamSale || "",
      SaleCode: SaleCode || "",
      ItemCode: selectedItemCode || "",
      ItemDescription: selectedItemDescription || "",
      CategoriesId: selectedCategoryId || "",
      DescriptionEN: selectedDescriptionEN || "",
      DescriptionTH: selectedDescriptionTH || "",
      SerialNo: selectedSerialNo || "",
      Status: selectedStatus || "",
      Branch: selectedBranch || "",
      TransDate: selectedTransDate || "",
      PromotionId: selectedPromotion ?? "",
      ProductId: productId || "",
      Package:
        selectedPackageModel !== null
          ? [
            {
              MODEL: packageList[selectedPackageModel]?.MODEL || [],
              PACKAGETYPEID: selectedPackageTypeId ?? 0,
              ORGANIZATIONCODE:
                packageList[selectedPackageModel]?.ORGANIZATIONCODE || [],
              ITEMID: packageList[selectedPackageModel]?.ITEMID || [],
              PRODUCTID: packageList[selectedPackageModel]?.PRODUCTID || [],
              PACKAGETITLE:
                packageList[selectedPackageModel]?.PACKAGETITLE || [],
              TOTALPRICE: packageList[selectedPackageModel]?.TOTALPRICE || [],
              HASTRADEIN: packageList[selectedPackageModel]?.HASTRADEIN || [],
              DISCOUNTPRICE:
                packageList[selectedPackageModel]?.DISCOUNTPRICE || [],
              SEQUENCE: packageList[selectedPackageModel]?.SEQUENCE || [],
              PERMITION_ACTIVE:
                packageList[selectedPackageModel]?.PERMITION_ACTIVE || [],
              FREEGIFT: packageList[selectedPackageModel]?.FREEGIFT || [],
              PERIODDETAILS:
                packageList[selectedPackageModel]?.PERIODDETAILS || [],
            },
          ]
          : selectedPackageTypeId !== null
            ? [
              {
                MODEL: null,
                PACKAGETYPEID: selectedPackageTypeId,
                ORGANIZATIONCODE: null,
                ITEMID: null,
                PRODUCTID: null,
                PACKAGETITLE: null,
                TOTALPRICE: null,
                HASTRADEIN: null,
                DISCOUNTPRICE: null,
                SEQUENCE: null,
                PERMITION_ACTIVE: null,
                FREEGIFT: null,
                PERIODDETAILS: null,
              },
            ]
            : [],
    });

    // 2) ถ้าเป็นโหมด bundle และมี scannedBundleProduct ให้เก็บต่อท้าย Main
    if (useBundle === "bundle" && scannedBundleProduct) {
      rows.push({
        MainItem: "N",
        EmpId: EmpId || "",
        TeamSale: TeamSale || "",
        SaleCode: SaleCode || "",
        ItemCode: scannedBundleProduct.ItemCode || "",
        ItemDescription: scannedBundleProduct.ItemDescription || "",
        CategoriesId: (scannedBundleProduct.CategoriesId ?? "").toString(),
        DescriptionEN: scannedBundleProduct.DescriptionEN || "",
        DescriptionTH: scannedBundleProduct.DescriptionTH || "",
        SerialNo: scannedBundleProduct.SerialNo || "",
        Status: scannedBundleProduct.Status || "",
        Branch: scannedBundleProduct.Branch || "",
        TransDate: scannedBundleProduct.TransDate || "",
        PromotionId: selectedPromotion ?? "",
        ProductId: scannedBundleProduct.ProductID || "",
        Package: [],
      });
    }

    return rows;
  }, [
    useBundle,
    scannedBundleProduct,
    EmpId,
    TeamSale,
    SaleCode,
    selectedItemCode,
    selectedItemDescription,
    selectedCategoryId,
    selectedDescriptionEN,
    selectedDescriptionTH,
    selectedSerialNo,
    selectedStatus,
    selectedBranch,
    selectedTransDate,
    selectedPromotion,
    productId,
    selectedPackageModel,
    selectedPackageTypeId,
    packageList,
  ]);

  const API_SALECONNEXT = import.meta.env.VITE_APP_API_SALECONNEXT;
  const CATEGORIES_URL = `${API_SALECONNEXT}/GetProduct/Categories`;
  const PROMOTION_URL = `${API_SALECONNEXT}/GetProduct/ProductPromotionList`;
  const PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageType`;
  const POST_PACKAGE_URL = `${API_SALECONNEXT}/GetPackage/PackageList`;
  const API_URL_POST_CONDITIONSCHECKHISTORY = `${API_SALECONNEXT}/ConditionsCheckHistory`;
  const CHECK_PRODUCT_BUNDLE = `${API_SALECONNEXT}/GetProduct/CheckProductBundle`;

  const API_URL_POST_CHECKCUSTOMER = import.meta.env.VITE_APP_API_THIENSURAT;
  const CHECKCUSTOMER_URL = `${API_URL_POST_CHECKCUSTOMER}/CheckCustomer`;

  const API_URL_MONGO = import.meta.env.VITE_APP_API_MONGO;
  // const getProductUrl = () => ${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId};
  const SAVEPRODUCTPACKAGE = `${API_URL_MONGO}/Contract/saveProductPackage`;
  const UPDATECONTACT = `${API_URL_MONGO}/Contract/updateContract`;
  const GET_IMAGES_API = `${API_URL_MONGO}/Contract/GetContractImage`;
  const DRAFT_ALLCONTRACT_URL = `${API_URL_MONGO}/Contract/GetAllContract?status=DRAFT&empid=${EmpId}&teamsale=${TeamSale}&salecode=${SaleCode}&ProcessType=${auth.processtype}`;

  const GET_STOCK_URL = `${API_URL_MONGO}/Product/GetStock`;

  // สร้าง ref สำหรับส่วนแพ็คเกจ
  const packageSectionRef = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<ImagesType | null>(null);
  // console.log(`images`, images);

  // ดึงข้อมูล PERIODDETAILS ของแพ็คเกจที่เลือกมาเก็บในตัวแปร periods
  const periods = packageList[selectedPackageModel!]?.PERIODDETAILS ?? [];

  useEffect(() => {
    if (!productContract.length) return;

    // 1. แยกข้อมูล main กับ bundle ออกจาก productContract
    const main = productContract.find((p) => p.MainItem === "Y")!;
    // console.log(`main`, main);
    const bundle = productContract.find((p) => p.MainItem === "N");
    // console.log(`bundle`, bundle);

    // 2. แสดงเฉพาะ main item ในรายการสินค้า
    setProduct([
      {
        ItemCode: main.ItemCode,
        ItemDescription: main.ItemDescription,
        DescriptionTH: main.DescriptionTH,
        SerialNo: main.SerialNo,
        Branch: main.Branch,
        TransDate: main.TransDate,
        Status: main.Status,
        ProductID: main.ProductID,
        PromotionId: main.PromotionId,
      },
    ]);

    // 3. ตั้งค่าโหมด bundle/normal แค่ครั้งแรก (useBundle ยังเป็น null)
    if (useBundle === null) {
      if (bundle) {
        // ถ้ามี bundle จาก DB ให้เริ่มที่ bundle mode
        setUseBundle("bundle");
        setBundleOk(true);
        setScannedBundleProduct({
          ItemCode: bundle.ItemCode,
          ItemDescription: bundle.ItemDescription,
          DescriptionTH: bundle.DescriptionTH,
          SerialNo: bundle.SerialNo,
          Branch: bundle.Branch,
          TransDate: bundle.TransDate,
          Status: bundle.Status,
          ProductID: bundle.ProductID,
          PromotionId: bundle.PromotionId,
        });
        setSelectedPromotion(bundle.PromotionId);
      } else {
        // ถ้าไม่มี bundle ให้เป็น normal mode
        setUseBundle("normal");
        setSelectedPromotion(main.PromotionId);
      }
    }

    // 4. กำหนดค่าของช่องฟอร์มสำหรับ main item
    setSelectedProductIndex(0);
    setSelectedItemCode(main.ItemCode);
    setSelectedItemDescription(main.ItemDescription);
    setSelectedDescriptionTH(main.DescriptionTH);
    setSelectedSerialNo(main.SerialNo);
    setSelectedStatus(main.Status);
    setSelectedBranch(main.Branch);
    setSelectedTransDate(main.TransDate);
    setProductId(main.ProductID);
    setSelectedPromotion(main.PromotionId);

    // 5. โหลด dropdown โปรโมชั่น ตามโหมดที่เลือก
    const loadDefaultPromotion = async () => {
      try {
        const form = new FormData();
        form.append("ProductID", main.ProductID);
        form.append("EmpId", EmpId);
        form.append("DivisionId", DivisionId);
        form.append("DepartId", DepartId);
        form.append("DepartGroup", DepartGroup);
        form.append("TeamSale", TeamSale);
        form.append("ItemID", main.ItemCode);
        form.append("IsBundle", bundle ? "1" : "0");

        const res = await axios.post(PROMOTION_URL, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const promos = Array.isArray(res.data.data) ? res.data.data : [];
        setPromotion(promos);
        // ไม่ต้อง setSelectedPromotion อีก เพราะเราเซ็ตไว้แล้วข้างบน
      } catch (err) {
        console.error("Error loading default promotion:", err);
      }
    };
    loadDefaultPromotion();

    // 6. เตรียมข้อมูลแพ็คเกจหลัก (mainPackages)
    setMainPackages(main.Package || []);
    if (main.Package?.length) {
      setSelectedPackageModel(0);
      setSelectedPackageTypeId(main.Package[0].PACKAGETYPEID);
      setModel(main.Package[0].MODEL);
    }
  }, [
    EmpId,
    DivisionId,
    DepartId,
    DepartGroup,
    TeamSale,
    // ตั้งใจไม่ใส่ useBundle ไว้ใน dependency เพื่อไม่ให้ลูปซ้ำ
  ]);

  useEffect(() => {
    if (productContract?.[0]?.Package?.length > 0) {
      setSelectedPackageTypeId(
        productContract?.[0]?.Package?.[0]?.PACKAGETYPEID
      );
      setPackageTypeID(productContract?.[0]?.Package?.[0]?.PACKAGETYPEID);
      setModel(productContract?.[0]?.Package?.[0]?.MODEL);
    } else {
      console.warn("No packages found in productContract.");
    }

    setSelectedItemCode(productContract?.[0]?.ItemCode);
    setItemID(productContract?.[0]?.ItemCode);
    setSelectedItemDescription(productContract?.[0]?.ItemDescription);
    setSelectedDescriptionEN(productContract?.[0]?.DescriptionEN);
    setSelectedDescriptionTH(productContract?.[0]?.DescriptionTH);
    setSelectedSerialNo(productContract?.[0]?.SerialNo);
    setSelectedStatus(productContract?.[0]?.Status);
    setSelectedBranch(productContract?.[0]?.Branch);
    setSelectedTransDate(productContract?.[0]?.TransDate);

    const initialPromotionId =
      normalizePromotionId(
        productContract?.[0]?.PromotionId ?? productContract?.[0]?.Promotion
      );

    setSelectedPromotion(initialPromotionId);
    setProductId(productContract?.[0]?.ProductId ?? productContract?.[0]?.ProductID);

    getPackageType();

    setEmpId(auth.data[0].EmpId);
    setTeamSale(auth.data[0].TeamSale);
    setSaleCode(auth.data[0].SaleCode);
    setSupEmpId(auth.data[0].SupEmp);
    setSecEmpId(auth.data[0].SecEmp);
    setDivisionId(auth.data[0].DivisionId);
    setDepartId(auth.data[0].DepartId);
    setDepartGroup(auth.data[0].DepartGroup);

    getPackageList();
  }, []);

  useEffect(() => {
    // รอจนกว่าทั้ง 2 ตัวนี้จะมีค่า
    if (EmpId && TeamSale) {
      postData();
    }
  }, [EmpId, TeamSale]);

  const postData = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.get(GET_STOCK_URL, {
        params: { empid: EmpId, teamSale: TeamSale },
      });
      const raw: any[] = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      // ดึงเฉพาะ { CategoriesId, DescriptionTH } ไม่ซ้ำกัน
      const cats = raw.reduce((acc: any[], item) => {
        if (!acc.some((c) => c.CategoriesId === item.CategoriesId)) {
          acc.push({
            CategoriesId: item.CategoriesId,
            DescriptionTH: item.DescriptionTH, // หรือชื่อ field จริงจาก API
          });
        }
        return acc;
      }, []);

      setCategories(cats);
    } catch (error) {
      console.error("Error fetching stock for categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // GET Product/GetStock?
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setBundleOk(false);

      try {
        // ดึง stock
        const url = selectedCategoryId
          ? `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${selectedCategoryId}&ProcessType=${auth.processtype}`
          : `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&sn=${barCodeNormal}&ProcessType=${auth.processtype}`;
        const res = await axios.get(url);
        const data = Array.isArray(res.data.data) ? res.data.data : [];

        // ถ้า S/N มา แต่ไม่เจอ
        if (barCodeNormal && data.length === 0) {
          await Swal.fire({
            icon: "warning",
            title: "ไม่พบสินค้า",
            text: `ไม่พบสินค้า ${barCodeNormal} ในคลัง`,
            confirmButtonText: "ตกลง",
          });
          setProduct([]);
          return;
        }

        // ถ้าพบสินค้าอย่างน้อย 1 เครื่อง ให้เช็ค bundle
        if (barCodeNormal && data.length > 0) {
          const form = new FormData();
          form.append("ItemID", data[0].ItemCode);
          form.append("EmpId", EmpId);
          form.append("DivisionId", DivisionId);
          form.append("DepartId", DepartId);
          form.append("DepartGroup", DepartGroup);
          form.append("TeamSale", TeamSale);
          form.append("ProductID", data[0].ProductID);

          // สักพักหลัง auto-select ตัวแรก ให้เก็บลง localStorage
          localStorage.setItem("sp.barCodeNormal", barCodeNormal);
          localStorage.setItem("sp.selectedItemCode", data[0].ItemCode);
          localStorage.setItem("sp.productId", data[0].ProductID);

          const bundleRes = await axios.post(CHECK_PRODUCT_BUNDLE, form, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          const { statustext, message } = bundleRes.data;

          if (statustext === "success" || statustext === "notfouund") {
            // ทั้งกรณีเจอ bundle หรือไม่เจอ (notfound)
            setBundleOk(statustext === "success"); // ถ้า success ให้เป็น bundle mode
            setProduct(data);

            // auto-select ตัวแรกเสมอ
            const first = data[0];
            setSelectedProductIndex(0);
            setSelectedItemCode(first.ItemCode);
            setItemID(first.ItemCode);
            setProductId(first.ProductID);
            setSelectedItemDescription(first.ItemDescription);
            setSelectedDescriptionEN(first.DescriptionEN);
            setSelectedDescriptionTH(first.DescriptionTH);
            setSelectedSerialNo(first.SerialNo);
            setSelectedStatus(first.Status);
            setSelectedBranch(first.Branch);
            setSelectedTransDate(first.TransDate);
          } else {
            // กรณี error อื่น ๆ
            await Swal.fire({
              icon: "warning",
              title: "ไม่สามารถเลือกสินค้าได้",
              text: message || "เกิดข้อผิดพลาด",
              confirmButtonText: "ตกลง",
            });
            setProduct([]);
          }
        }

        // กรณีมาจากการเลือก category ปกติ (ไม่มี barCodeNormal) ก็เซ็ตปกติ
        if (!barCodeNormal) {
          setBundleOk(true);
          setProduct(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (selectedCategoryId || barCodeNormal) {
      fetchProducts();
    }
  }, [selectedCategoryId, barCodeNormal]);

  const applyDefaultPromotion = (promos: any[]) => {
    // ถ้า user เลือกโปรเองแล้ว ห้าม reset กลับค่าเดิม
    if (promotionTouchedRef.current) return;

    const dbPromotionId = normalizePromotionId(
      productContract?.find((p: any) => p.MainItem === "Y")?.PromotionId ??
      productContract?.[0]?.PromotionId ??
      productContract?.[0]?.Promotion
    );

    if (promos.length === 0) {
      setSelectedPromotion(null);
      return;
    }

    if (dbPromotionId === null) {
      setSelectedPromotion(promos[0].PROMOTIONID);
      return;
    }

    const matched = promos.find(
      (p: any) => Number(p.PROMOTIONID) === Number(dbPromotionId)
    );

    if (matched) {
      setSelectedPromotion(Number(matched.PROMOTIONID));
    } else {
      setSelectedPromotion(Number(promos[0].PROMOTIONID));
    }
  };

  // 1) โปรโมชั่นโหมด “ปกติ”
  useEffect(() => {
    if (selectedProductIndex === null || useBundle !== "normal") return;

    const form = new FormData();
    form.append("ProductID", productId!);
    form.append("EmpId", EmpId);
    form.append("DivisionId", DivisionId);
    form.append("DepartId", DepartId);
    form.append("DepartGroup", DepartGroup);
    form.append("TeamSale", TeamSale);
    form.append("ItemID", selectedItemCode!);
    form.append("IsBundle", "0");

    axios
      .post(PROMOTION_URL, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        const promos = Array.isArray(res.data.data) ? res.data.data : [];
        setPromotion(promos);
        applyDefaultPromotion(promos);
      })
      .catch(console.error);
  }, [selectedProductIndex, useBundle, productContract, productId, EmpId, DivisionId, DepartId, DepartGroup, TeamSale, selectedItemCode]);

  // 2) โปรโมชั่นโหมด “บันเดิล”
  useEffect(() => {
    if (selectedProductIndex === null || useBundle !== "bundle") return;

    const form = new FormData();
    form.append("ProductID", productId!);
    form.append("EmpId", EmpId);
    form.append("DivisionId", DivisionId);
    form.append("DepartId", DepartId);
    form.append("DepartGroup", DepartGroup);
    form.append("TeamSale", TeamSale);
    form.append("ItemID", selectedItemCode!);
    form.append("IsBundle", "1");

    axios
      .post(PROMOTION_URL, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        const promos = Array.isArray(res.data.data) ? res.data.data : [];
        setPromotion(promos);
        applyDefaultPromotion(promos);
      })
      .catch(console.error);
  }, [selectedProductIndex, useBundle, productContract, productId, EmpId, DivisionId, DepartId, DepartGroup, TeamSale, selectedItemCode]);

  const getPackageType = async () => {
    try {
      const response = await axios.get(PACKAGE_URL, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setPackageType(data);

      setEmpId(auth.data[0].EmpId);
      setTeamSale(auth.data[0].TeamSale);
      setSaleCode(auth.data[0].SaleCode);
      setSupEmpId(auth.data[0].SupEmp);
      setSecEmpId(auth.data[0].SecEmp);
      setDivisionId(auth.data[0].DivisionId);
      setDepartId(auth.data[0].DepartId);
      setDepartGroup(auth.data[0].DepartGroup);
    } catch (error) {
      console.error("Error fetching PACKAGE_URL:", error);
    }
  };

  const getPackageList = async () => {
    setLoadingPackages(true);
    try {
      const response = await axios.post(
        POST_PACKAGE_URL,
        {
          EmpId,
          DivisionId,
          DepartId,
          DepartGroup,
          TeamSale,
          ItemID,
          PackageTypeID,
          PromotionID: selectedPromotion,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setPackageList(data);

      // หาค่า MODEL ของ main item จาก productContract
      const mainModel = productContract.find((p) => p.MainItem === "Y")
        ?.Package?.[0]?.MODEL;

      // หา index ที่ตรงกับ mainModel ใน data
      const index =
        mainModel != null
          ? data.findIndex((pl: any) => pl.MODEL === mainModel)
          : -1;

      // เซ็ต selectedPackageModel ให้ตรงกับเดิม (หรือ null ถ้าไม่เจอ)
      setSelectedPackageModel(index >= 0 ? index : null);
    } catch (error) {
      console.error("Error fetching POST_PACKAGE_URL:", error);
    } finally {
      setLoadingPackages(false);
    }
  };

  // ดึงข้อมูลแพ็คเกจจาก db มาโชว์
  useEffect(() => {
    getPackageList();
  }, [
    EmpId,
    DivisionId,
    DepartId,
    DepartGroup,
    TeamSale,
    ItemID,
    PackageTypeID,
    selectedPromotion,
  ]);

  const handleCateOptionChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedCategoryId(value);

    promotionTouchedRef.current = false;

    setProduct([]);
    setSelectedProductIndex(null);
    setSelectedItemCode(null);
    setSelectedItemDescription(null);
    setSelectedDescriptionEN(null);
    setSelectedDescriptionTH(null);
    setSelectedSerialNo(null);
    setSelectedStatus(null);
    setSelectedBranch(null);
    setSelectedTransDate(null);
    setSelectedPromotion(null);
    setSelectedPackageTypeId(null);
    setPackageTypeID(null);
    setSelectedPackageModel(null);
    setPackageList([]);
    setScannedBundleProduct(null);
    setUseBundle("normal");

    if (value) {
      try {
        setLoadingProducts(true);
        const response = await axios.get(
          `${API_URL_MONGO}/Product/GetStock?empid=${EmpId}&teamSale=${TeamSale}&categoryId=${value}&ProcessType=${auth.processtype}`
        );

        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        setProduct(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    }
  };

  const handleCardProductClick = (index: number) => {
    const selected = product[index];
    if (!selected) return;

    promotionTouchedRef.current = false;

    setSelectedProductIndex(index);
    setSelectedItemCode(selected.ItemCode);
    setItemID(selected.ItemCode);
    setProductId(selected.ProductID);

    setSelectedItemDescription(selected.ItemDescription);
    setSelectedDescriptionEN(selected.DescriptionEN);
    setSelectedDescriptionTH(selected.DescriptionTH);
    setSelectedSerialNo(selected.SerialNo);
    setSelectedStatus(selected.Status);
    setSelectedBranch(selected.Branch);
    setSelectedTransDate(selected.TransDate);

    // reset ค่าที่ขึ้นกับสินค้า
    setSelectedPromotion(null);
    setSelectedPackageTypeId(null);
    setPackageTypeID(null);
    setSelectedPackageModel(null);
    setPackageList([]);
    setScannedBundleProduct(null);

    // บังคับให้มี mode เสมอ
    setUseBundle("normal");
  };

  //เปลี่ยนสไตล์เป็น success เมื่อเลือกปุ่ม package และเลื่อนลงมายังส่วนแพ็คเกจ
  const handlePackageTypeClick = (packageTypeId: number) => {
    if (!packageTypeId) {
      console.error("Invalid PackageTypeId:", packageTypeId);
      return;
    }

    setSelectedPackageTypeId(packageTypeId); // อัปเดตค่า selectedPackageTypeId
    setPackageTypeID(packageTypeId); // อัปเดตค่าใน state อื่นถ้าจำเป็น
    // console.log("PackageTypeId selected:", packageTypeId); // ตรวจสอบว่าค่าถูกตั้งไว้ถูกต้อง

    // Scroll the page to the package section
    if (packageSectionRef.current) {
      packageSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePackageModelClick = (index: number) => {
    setSelectedPackageModel(index);
    if (packageList[index] && packageList[index].MODEL) {
      setModel(packageList[index].MODEL); // กำหนดค่าให้กับ Model จาก packageList[selectedPackageModel]
    }
    if (selectedCategoryId === null) {
      setSelectedPackageModel(null);
    }
  };

  useEffect(() => {
    // ตรวจสอบว่า productContract มีข้อมูลก่อน
    if (productContract && productContract.length > 0) {
      // ตรวจสอบว่าข้อมูลสินค้า (product) พร้อมใช้งาน
      if (product && product.length > 0) {
        const productIndex = product.findIndex(
          (p) => p.ItemCode === productContract[0]?.ItemCode
        );

        if (productIndex !== -1) {
          setSelectedProductIndex(productIndex); // ตั้งค่าดัชนีของสินค้า
          setSelectedItemCode(product[productIndex]?.ItemCode); // ตั้งค่า ItemCode
        }
      }

      // ตั้งค่าโปรโมชั่นจาก productContract
      if (productContract[0]?.Promotion) {
        setSelectedPromotion(productContract[0]?.Promotion);
      }
    }
  }, [product, productContract]);

  useEffect(() => {
    // อัปเดต Model เมื่อ packageList และ selectedPackageModel พร้อม
    if (selectedPackageModel !== null && packageList[selectedPackageModel]) {
      const selectedModel = packageList[selectedPackageModel].MODEL;
      setModel(selectedModel); // อัปเดตค่า Model
    }
  }, [selectedPackageModel, packageList, setModel]);

  useEffect(() => {
    if (packageType && packageType.length > 0) {
      // console.log('PackageType Loaded:', packageType);
    } else {
      console.warn("No PackageType data available");
    }
  }, [packageType]);

  const handleScanBarcodeClick = () => {
    const isDesktop = !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isDesktop) {
      Swal.fire({
        icon: "info",
        title: "ไม่รองรับ",
        text: "ฟีเจอร์สแกนบาร์โค้ด สามารถใช้งานได้เฉพาะบนมือถือหรือแท็บเล็ตเท่านั้น",
      });
      return;
    }

    navigate("/sale/scanbarcode", {
      state: {
        item,
        refno,
        origin: "/sale/update/updateSalePackage",
      },
    });
  };

  const handleScanBarcodeBundleClick = () => {
    const isDesktop = !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isDesktop) {
      Swal.fire({
        icon: "info",
        title: "ไม่รองรับ",
        text: "ฟีเจอร์สแกนบาร์โค้ด สามารถใช้งานได้เฉพาะบนมือถือหรือแท็บเล็ตเท่านั้น",
      });
      return;
    }

    navigate("/sale/scanbarcodebundle", {
      state: {
        origin: "/sale/update/updateSalePackage",
        refno,
        barCodeNormal,
        barCode: barCodeNormal,
        promotionId: selectedPromotion as number,
        selectedItemCode,
        productId,
      },
    });
  };

  const normalizeProduct = (rows: any[] = []) =>
    rows.map(p => ({
      MainItem: p.MainItem,
      ItemCode: p.ItemCode,
      ItemDescription: p.ItemDescription,
      CategoriesId: p.CategoriesId ?? p.CategoriesID ?? "",
      DescriptionEN: p.DescriptionEN ?? null,
      DescriptionTH: p.DescriptionTH ?? null,
      SerialNo: p.SerialNo ?? null,
      Status: p.Status ?? null,
      Branch: p.Branch ?? null,
      TransDate: p.TransDate ?? null,
      PromotionId: Number(p.PromotionId ?? p.PROMOTIONID ?? 0),
      ProductId: p.ProductId ?? p.ProductID ?? "",
      Package: (p.Package ?? []).map((pk: any) => ({
        MODEL: pk.MODEL ?? null,
        PACKAGETYPEID: Number(pk.PACKAGETYPEID ?? 0),
      })),
    }));

  const handleNextClick = async () => {
    // a = ของเดิมจาก DB, b = ของที่กำลังจะส่ง
    const a = normalizeProduct(item.PRODUCT);
    const b = normalizeProduct(SaveProductData);

    const unchanged = JSON.stringify(a) === JSON.stringify(b);
    const packageChanged = !unchanged;

    if (unchanged) {
      // ข้ามการอัปเดต เพื่อไม่ให้ DISCOUNT ถูกเคลียร์
      navigate("/sale/update/updateSaleDiscount", {
        state: {
          item,
          SaveProductData,
          REFNO: refno ?? item.REFNO,
          packageChanged: false,
        },
      });
      return;
    }

    // มีการแก้ไขจริง → ค่อยอัปเดต
    try {
      const resp = await axios.post(UPDATECONTACT, {
        REFNO: refno ?? item.REFNO,
        EMPID: EmpId,
        TEAMSALE: TeamSale,
        FIELD: "PRODUCT",
        DATA: SaveProductData,
      }, { headers: { "Content-Type": "application/json" } });

      if (resp.status !== 200 || !resp.data?.data) {
        await MySwal.fire("เกิดข้อผิดพลาด", "ปรับปรุงข้อมูลไม่สำเร็จ\nกรุณาติดต่อผู้พัฒนา", "error");
        return;
      }

      await Swal.fire({ icon: "success", title: "สำเร็จ!", text: "ปรับปรุงข้อมูลแพ็คเกจแล้ว", timer: 2000, showConfirmButton: false });

      // *** ถ้ายังต้องรีเฟรช draft ต่อ ให้คงค่า DISCOUNT เดิมไว้ เมื่อ navigate ***
      const refresh = await axios.get(DRAFT_ALLCONTRACT_URL);
      const list: any[] = Array.isArray(refresh.data?.data) ? refresh.data.data : [];
      const updatedItem = list.find(c => c.REFNO === (item?.REFNO ?? refno)) ?? item;

      navigate("/sale/update/updateSaleDiscount", {
        state: {
          item: {
            ...updatedItem,

            // ✅ ถ้าเปลี่ยนแพ็คเกจ ให้ล้าง DISCOUNT ใน state ทันที
            DISCOUNT: packageChanged
              ? []
              : updatedItem.DISCOUNT?.length
                ? updatedItem.DISCOUNT
                : item.DISCOUNT,
          },
          SaveProductData,
          REFNO: refno ?? item.REFNO,

          // ✅ ส่ง flag ไปให้หน้า Discount
          packageChanged,
        },
      });
    } catch (err) {
      console.error(err);
      MySwal.fire({ title: "เกิดข้อผิดพลาด", text: "ไม่สามารถบันทึกข้อมูลได้", icon: "error" });
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

    // console.log(response);

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
      }
    } else {
      MySwal.fire("เกิดข้อผิดพลาด", response.data.message, "error");
    }
  };

  useEffect(() => {
    const s = (location.state ?? {}) as any;
    if (s.bundleProduct && s.barCodeBundle) {
      setUseBundle("bundle");
      setBundleOk(true);
      setScannedBundleProduct(s.bundleProduct);
      // คืนค่า promotion
      if (s.promotionId != null) {
        setSelectedPromotion(s.promotionId);
      }
      // *** ห้ามเซ็ต selectedItemCode/productId ตรงนี้ ***
    }
  }, [location.state]);

  // บังคับทำ ถึงโชว์ปุ่มถัดไป
  const canProceed = useMemo(() => {
    // ต้องเลือกสินค้าแล้ว
    if (selectedProductIndex === null) return false;
    // ต้องเลือกโหมดแล้ว (ปกติ/บันเดิล)
    if (useBundle === null) return false;
    // ต้องเลือกโปรโมชันแล้ว
    if (selectedPromotion === null) return false;
    // ต้องเลือกประเภทการชำระแล้ว
    if (selectedPackageTypeId === null) return false;
    // ระหว่างโหลดแพ็กเกจ ห้ามกด
    if (loadingPackages) return false;
    // ต้องเลือกแพ็คเกจแล้ว
    if (selectedPackageModel === null) return false;
    // ✅ เงื่อนไขใหม่: ถ้าเป็นบันเดิล ต้องสแกนสินค้าบันเดิลแล้ว
    if (useBundle === "bundle" && !scannedBundleProduct) return false;

    return true;
  }, [
    selectedProductIndex,
    useBundle,
    selectedPromotion,
    selectedPackageTypeId,
    loadingPackages,
    packageList.length,
    selectedPackageModel,
    scannedBundleProduct, // สำคัญสำหรับบันเดิล
  ]);

  const didInitPackageRef = useRef(false);

  useEffect(() => {
    if (!didInitPackageRef.current) {
      didInitPackageRef.current = true;
      return;
    }

    setSelectedPackageModel(null);
    setModel(null as any);
  }, [selectedProductIndex, useBundle, selectedPromotion, selectedPackageTypeId]);

  return (
    <>
      {/* แสดง Loading */}
      {loadingProducts && (
        <div className="text-center my-10">
          <ThreeDot />
          <p className={`my-5 ${styles.fontSize}`}>
            กำลังโหลดข้อมูล กรุณารอสักครู่ ...
          </p>
        </div>
      )}

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
              <li className={`${styles.titlePage}`}>แก้ไขแพ็คเกจ</li>
            </ul>
          </div>
        </div>
        {/* <span className={`${styles.fontSize}`}>เลขที่ขาย: </span><span className={`${styles.titlePage}`}>{item?.REFNO || item?.item?.REFNO}</span> */}
        <span className={`${styles.fontSize}`}>เลขที่ขาย: </span>
        <span className={`${styles.titlePage}`}>
          {item?.REFNO ? item?.REFNO : refno}
        </span>

        <div className="accordion mb-10" id="kt_accordion_1">
          <div className="accordion-item mb-10">
            <h2 className="accordion-header" id="kt_accordion_1_header_1">
              <h3
                className="accordion-button fs-4 fw-bold border-0 h-50px pt-5 rounded-top px-lg-15 px-7"
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
                เลือกแพ็คเกจ
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
                  <div className="card-body px-lg-9 px-1 mb-10">
                    <div className="row">
                      {/* สแกนบาร์โค้ด */}
                      <div
                        className="d-flex justify-content-center align-items-center mt-5"
                        onClick={handleScanBarcodeClick}
                      >
                        <label
                          className={`${styles.btnSuccess}`}
                          htmlFor="camera-input"
                          style={{
                            cursor: "pointer",
                            borderRadius: "10px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            width: "250px",
                            textAlign: "center",
                          }}
                        >
                          สแกน S/N
                          <FontAwesomeIcon icon={faBarcode} className="ms-3" />
                        </label>
                      </div>
                      {/* สแกนบาร์โค้ด */}

                      {item?.barCode && (
                        <label className="form-label fw-bold fs-3 mt-3">
                          S/N ที่สแกนได้: {item?.barCode}
                        </label>
                      )}

                      {/* <div className='col-lg-6 my-7 my-xl-10'>
                                                <label className='form-label required fw-bold fs-3'>หมวดหมู่สินค้า</label>
                                                <select
                                                    className='form-select'
                                                    onChange={handleCateOptionChange}
                                                >
                                                    <option value=''>เลือกหมวดหมู่สินค้า...</option>
                                                    {categories.map((item: any, index: number) => (
                                                        <option key={index} value={item.CategoriesId}>
                                                            {item.DescriptionTH}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div> */}
                    </div>

                    {/* แสดง Loading */}
                    {loadingProducts && (
                      <div className="text-center my-10">
                        <ThreeDot />
                      </div>
                    )}

                    {/* หากไม่มีสินค้าให้แสดงข้อความนี้ */}
                    {!loadingProducts &&
                      selectedCategoryId &&
                      product &&
                      selectedCategoryId.length > 0 &&
                      product.length === 0 && (
                        <div className="text-center my-7">
                          <h5>ไม่มีรายการสินค้า</h5>
                        </div>
                      )}

                    {selectedCategoryId &&
                      product &&
                      selectedCategoryId.length > 0 &&
                      product.length > 0 ? (
                      <label className="form-label required fw-bold fs-3 mt-7 mt-xl-10">
                        รายการสินค้า
                      </label>
                    ) : (
                      ""
                    )}
                    {!loadingProducts && product.length > 0 && (
                      <div className="row ">
                        {product.map((item, index) => (
                          <div
                            className="col-6 col-md-4 mb-3 rounded"
                            key={index}
                            onClick={() => handleCardProductClick(index)}
                            style={{ cursor: "pointer" }}
                          >
                            <CardProduct
                              DescriptionTH={item?.DescriptionTH}
                              ItemDescription={item?.ItemDescription}
                              ItemCode={item?.ItemCode}
                              SerialNo={item?.SerialNo}
                              isSelected={selectedProductIndex === index}
                            />
                          </div>
                        ))}

                        {/* ถ้ามี bundle ให้โชว์ toggle */}
                        {selectedItemCode && (
                          <div className="d-flex gap-3 my-4 w-100">
                            {/* ปุ่ม ปกติ */}
                            <div className="flex-fill d-flex justify-content-center">
                              <div
                                className={`
          border rounded h-60px d-flex justify-content-center align-items-center 
          fw-bold fs-6 px-5
          ${useBundle === "normal"
                                    ? "bg-success text-white"
                                    : "bg-white text-dark"
                                  }
        `}
                                style={{
                                  cursor: "pointer",
                                  transition: "background-color 0.2s",
                                }}
                                onClick={() => {
                                  setUseBundle("normal");
                                  setSelectedPromotion(null);         // ✅ รีเซ็ต
                                  setScannedBundleProduct(null);      // เผื่อเคยสแกนบันเดิลค้างไว้
                                }}
                              >
                                <p className={styles.fontSize}>ปกติ</p>
                              </div>
                            </div>

                            {/* ปุ่ม บันเดิล */}
                            {bundleOk && (
                              <div className="flex-fill d-flex justify-content-center">
                                <div
                                  className={`
          border rounded h-60px d-flex justify-content-center align-items-center 
          fw-bold fs-6 px-5
          ${useBundle === "bundle"
                                      ? "bg-success text-white"
                                      : "bg-white text-dark"
                                    }
        `}
                                  style={{
                                    cursor: "pointer",
                                    transition: "background-color 0.2s",
                                  }}
                                  onClick={() => {
                                    setUseBundle("bundle");
                                    setSelectedPromotion(null);         // ✅ รีเซ็ต
                                    setScannedBundleProduct(null);      // ต้องสแกนใหม่อยู่ดี
                                  }}
                                >
                                  <p className={styles.fontSize}>บันเดิล</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="row">
                          <div className="col-lg-6 my-7 my-xl-10">
                            <label
                              className={`form-label required ${styles.label}`}
                            >
                              โปรโมชั่น
                            </label>
                            <select
                              className={`${styles.fontSize} form-select`}
                              onChange={(e) => {
                                promotionTouchedRef.current = true;

                                const v = e.target.value;
                                const promoId = v === "" ? null : Number(v);
                                setSelectedPromotion(promoId);

                                setSelectedPackageModel(null);
                                setModel(null as any);

                                if (useBundle === "bundle") {
                                  setScannedBundleProduct(null);
                                  localStorage.removeItem("sp.barCodeBundle");
                                  localStorage.removeItem("sp.bundleProduct");
                                }

                                if (promoId == null) {
                                  localStorage.removeItem("sp.selectedPromotion");
                                } else {
                                  localStorage.setItem("sp.selectedPromotion", String(promoId));
                                }
                              }}
                              value={selectedPromotion ?? ""}   // null → แสดง placeholder
                            >
                              <option value="">เลือกโปรโมชั่น</option>
                              {promotion.map((item: any, idx: number) => (
                                <option key={idx} value={item?.PROMOTIONID}>
                                  {item.PROMOTIONNAME}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* สแกนบาร์โค้ด */}
                        {useBundle === "bundle" && selectedPromotion !== null && (
                          <div
                            className="d-flex justify-content-center align-items-center mb-5"
                            onClick={handleScanBarcodeBundleClick}
                          >
                            <label
                              className={`${styles.btnSuccess}`}
                              htmlFor="camera-input"
                              style={{
                                cursor: "pointer",
                                borderRadius: "10px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                width: "250px",
                                textAlign: "center",
                              }}
                            >
                              สแกน S/N (บันเดิล)
                              <FontAwesomeIcon
                                icon={faBarcode}
                                className="ms-3"
                              />
                            </label>
                          </div>
                        )}
                        {/* สแกนบาร์โค้ด */}

                        {useBundle === "bundle" && scannedBundleProduct && (
                          <div className="mt-4">
                            <label
                              className={`form-label required ${styles.label}`}
                            >
                              สินค้าบันเดิล
                            </label>
                            <CardProductBundle
                              DescriptionTH={scannedBundleProduct.DescriptionTH}
                              ItemDescription={
                                scannedBundleProduct.ItemDescription
                              }
                              ItemCode={scannedBundleProduct.ItemCode}
                              SerialNo={scannedBundleProduct.SerialNo}
                              isSelected={true}
                            />
                          </div>
                        )}

                        {product.length !== 0 && (
                          <div className="container my-10 my-xl-10">
                            <div className="row d-flex">
                              <label
                                className={`form-label required ${styles.label}`}
                              >
                                ประเภทการชำระ
                              </label>
                              {packageType.map((item) => (
                                <div
                                  className="col-6 col-md-auto mb-2 d-flex align-items-center"
                                  key={item.PACKAGETYPEID}
                                >
                                  <div
                                    className="border rounded w-100 w-md-auto h-60px d-flex justify-content-center align-items-center fw-bold fs-6 px-5"
                                    style={{
                                      backgroundColor:
                                        selectedPackageTypeId ===
                                          item.PACKAGETYPEID
                                          ? "#ACE1AF"
                                          : "#fcfcfc",
                                      transition:
                                        "background-color 0.2s ease, color 0.2s ease",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      handlePackageTypeClick(
                                        item.PACKAGETYPEID
                                      );
                                    }}
                                  >
                                    <p className={`${styles.fontSize}`}>
                                      {item.PACKAGETYPENAME}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* หากไม่มีแพ็คเกจให้แสดงข้อความนี้ */}
                        {!loadingPackages &&
                          packageList.length === 0 &&
                          selectedCategoryId !== null &&
                          selectedProductIndex !== null && (
                            <div className="text-center my-7">
                              <h5 className={`${styles.fontSize}`}>
                                ไม่มีรายการแพ็คเกจ<br />ไม่สามารถขายสินค้าได้
                              </h5>
                            </div>
                          )}
                      </div>
                    )}

                    {/* ส่วนของแพ็คเกจที่จะเลื่อนมาที่นี่ */}
                    {/* แสดง Loading */}
                    {loadingPackages && (
                      <div className="text-center my-10">
                        <ThreeDot />
                      </div>
                    )}

                    {/* แสดงแพ็คเกจหากโหลดเสร็จ */}
                    {!loadingPackages &&
                      packageList.length > 0 &&
                      selectedPromotion !== null &&
                      selectedPackageTypeId !== null && (
                        <div className="my-10 my-xl-10" ref={packageSectionRef}>
                          <div className="row d-flex">
                            <label
                              className={`form-label required ${styles.label}`}
                            >
                              แพ็คเกจ
                            </label>
                            {packageList.map((item, index) => (
                              <div
                                className="col-12 col-md-4 col-sm-4 mb-2"
                                key={item.MODEL || index}
                                onClick={() => handlePackageModelClick(index)}
                                style={{ cursor: "pointer" }}
                              >
                                <CardPackage
                                  PackageTitle={item.PACKAGETITLE || "No Title"}
                                  isSelected={selectedPackageModel === index}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Summary Table */}
                    {periods.length > 0 && (
                      <div className="mt-4">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th className={styles.fontSize}>งวดที่</th>
                              <th className={styles.fontSize}>ราคา</th>
                              <th className={styles.fontSize}>หน่วย</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* งวดที่ 1 */}
                            <tr>
                              <td className={styles.fontSize}>1</td>
                              <td className={styles.fontSize}>
                                {Number(
                                  periods[0].PAYMENTAMOUNT
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td className={styles.fontSize}>บาท</td>
                            </tr>

                            {/* งวดที่ 2–สุดท้าย ถ้ามีมากกว่า 1 งวด */}
                            {periods.length > 1 && (
                              <tr>
                                <td className={styles.fontSize}>
                                  2–{periods.length}
                                </td>
                                <td className={styles.fontSize}>
                                  {Number(
                                    periods[1].PAYMENTAMOUNT
                                  ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </td>
                                <td className={styles.fontSize}>บาท</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <>
          <div className="d-none d-xl-flex justify-content-between align-items-center my-5">
            <button
              className={`${styles.btnSecondary}`}
              onClick={() => navigate("/sale/step", { state: item })}
            >
              ย้อนกลับ
            </button>
            {canProceed && (
              <button className={styles.btnPrimary} onClick={handleNextClick}>
                ถัดไป
              </button>
            )}
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
              onClick={() => navigate("/sale/step", { state: item })}
            >
              ย้อนกลับ
            </button>
            {canProceed && (
              <button className={styles.btnPrimary} onClick={handleNextClick}>
                ถัดไป
              </button>
            )}
          </div>
        </>
      </Content>
    </>
  );
};

export default UpdateSalesPackage;
