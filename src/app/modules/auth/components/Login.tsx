import styles from "@/styles/style.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import * as Yup from "yup";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { login } from "../core/_requests";
import { useAuth } from "../core/Auth";
import { KTIcon, toAbsoluteUrl } from "../../../../_metronic/helpers";
import {
  useCategoryStore,
  useFetchCategoryStore,
} from "../../../modules/stores/sales/packageStore/packageStore";
import CryptoJS from "crypto-js";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const loginSchema = Yup.object().shape({
  username: Yup.string().required("กรุณากรอก Username"),
  password: Yup.string().required("กรุณากรอก Password"),
});

const initialValues = {
  username: "",
  password: "",
};

export function Login() {
  const API_URL_POST_CATEGORIES = import.meta.env.VITE_APP_API_SALECONNEXT;
  const CATEGORIES_URL = `${API_URL_POST_CATEGORIES}/GetProduct/Categories`;

  const VERSION = import.meta.env.VITE_APP_VERSION;

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

  const { auth, saveAuth, setCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { fetchCategory, setFetchCategory } = useFetchCategoryStore();
  const [isCategoryLoaded, setIsCategoryLoaded] = useState(false);
  const SECRET_KEY = import.meta.env.VITE_APP_SECRET_KEY;

  const postData = async () => {
    try {
      const response = await axios.post(
        CATEGORIES_URL,
        {
          EmpId,
          DivisionId,
          DepartId,
          DepartGroup,
          TeamSale,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = Array.isArray(response.data.data) ? response.data.data : [];

      if (data.length > 0) {
        setFetchCategory(data);
        localStorage.setItem("fetchCategory", JSON.stringify(data)); // บันทึกลง localStorage
        setIsCategoryLoaded(true);
      } else {
        setIsCategoryLoaded(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsCategoryLoaded(false);
    }
  };

  useEffect(() => {
    const savedCategory = localStorage.getItem("fetchCategory");
    if (savedCategory) {
      const parsedCategory = JSON.parse(savedCategory);
      setFetchCategory(parsedCategory);
      setIsCategoryLoaded(parsedCategory.length > 0);
    }
  }, [setFetchCategory]);

  const [locationAccess, setLocationAccess] = useState<boolean>(false);

  function success(pos: any) {
    const crd = pos.coords;

    localStorage.setItem("latitude", crd.latitude.toString());
    localStorage.setItem("longitude", crd.longitude.toString());
  }

  function errors(err: any) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    Swal.fire({
      icon: "warning",
      text: "กรุณาเปิดการใช้งานตำแหน่ง GPS",
      confirmButtonText: "ตกลง",
    }).then(() => {
      navigator.geolocation.getCurrentPosition(success, errors, options);
      const locationPermission = navigator.permissions.query({
        name: "geolocation",
      });
      requestPermissions();
      navigate("chrome://settings/content/location");
    });
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((ps) => {
        if (ps.state === "prompt") {
          navigator.geolocation.getCurrentPosition(
            () => { },
            () => { }
          );
        }
      });
    }
  }, []);

  const requestPermissions = async () => {
    try {
      const locationPermission = await navigator.permissions.query({
        name: "geolocation",
      });

      if (locationPermission.state === "granted") {
        navigator.geolocation.watchPosition(success, errors, options);
      } else if (locationPermission.state === "prompt") {
        navigator.geolocation.watchPosition(success, errors, options);
        locationPermission.onchange = () => {
          setLocationAccess(locationPermission.state === "granted");
        };
      } else if (locationPermission.state === "denied") {
        Swal.fire({
          icon: "warning",
          text: "กรุณาเปิดการใช้งานตำแหน่ง GPS",
          confirmButtonText: "ตกลง",
        });
      }

      const filePermission = await navigator.permissions.query({
        name: "persistent-storage" as PermissionName,
      });
      if (filePermission.state !== "granted") {
        alert("โปรดอนุญาตการเข้าถึงไฟล์");
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
      alert("อุปกรณ์ของคุณไม่รองรับการขอ permissions ทั้งหมด");
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setLoading(true);
      try {
        const response = await login(values.username, values.password);

        if (response.data.status === 500) {
          setErrors({
            username: response.data.message,
            password: response.data.message,
          });
          setSubmitting(false);
          setLoading(false);
        } else if (response.data.status === 404) {
          setErrors({
            username: response.data.message,
            password: response.data.message,
          });
        } else {
          const authData = JSON.stringify(response.data);
          const encryptedAuthData = CryptoJS.AES.encrypt(
            authData,
            SECRET_KEY
          ).toString();
          const loginTimestamp = new Date().getTime(); // บันทึกเวลาล็อกอิน

          localStorage.setItem("authData", encryptedAuthData);
          localStorage.setItem("loginTimestamp", loginTimestamp.toString()); // บันทึกเวลาใน localStorage

          saveAuth(response.data);
          const user = {
            id: response.data.userId,
            username: values.username,
            ...response.data.userDetails,
          };
          setCurrentUser(user);

          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;

              localStorage.setItem("latitude", latitude.toString());
              localStorage.setItem("longitude", longitude.toString());
            },
            (err) => {
              console.warn("ไม่สามารถดึงตำแหน่งได้:", err);
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            }
          );

          setLoading(false);
          navigate("/dashboard");
        }
      } catch (error: any) {
        console.error("Login error:", error);
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  const hasFieldErrors = Boolean(
    formik.errors.username || formik.errors.password
  );

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw", 
        height: "100vh", 
        backgroundImage: `url(${toAbsoluteUrl("media/logos/bg3.png")})`,
        backgroundSize: "cover", 
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        className="text-center d-flex flex-column align-items-center justify-content-center"
        onSubmit={formik.handleSubmit}
        noValidate
        id="kt_login_signin_form"
      >
        <div className="d-flex justify-content-center align-items-center my-15">
          <img
            alt="Logo"
            src={toAbsoluteUrl("media/logos/logo-tsr-old-white.png")}
            style={{ width: "50%" }}
          />
        </div>

        <div className="fv-row mb-3 w-lg-500px w-300px w-md-500px">
          <input
            type="text"
            autoComplete="off"
            {...formik.getFieldProps("username")}
            className={clsx("form-control bg-transparent", styles.fontSize, {
              "is-invalid": formik.touched.username && formik.errors.username,
              "is-valid": formik.touched.username && !formik.errors.username,
            })}
            placeholder="Username"
            style={{ color: "white" }}
          />
          {formik.touched.username && formik.errors.username && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block d-flex">
                <span role="alert" className={`${styles.fontSize}`}>
                  {formik.errors.username}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="fv-row mb-3 w-lg-500px w-300px w-md-500px">
          <input
            style={{ color: "white" }}
            type="password"
            placeholder="Password"
            autoComplete="off"
            {...formik.getFieldProps("password")}
            className={clsx(
              "form-control bg-transparent",
              styles.fontSize, 
              {
                "is-invalid": formik.touched.password && formik.errors.password,
                "is-valid": formik.touched.password && !formik.errors.password,
              }
            )}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block d-flex">
                <span role="alert" className={styles.fontSize}>
                  {formik.errors.password}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="d-grid my-3 w-lg-500px w-300px w-md-500px">
          <button
            type="submit"
            id="kt_sign_in_submit"
            className="btn btn-primary d-flex justify-content-center align-items-center"
            disabled={formik.isSubmitting || !formik.isValid || loading}
            style={{ backgroundColor: "#001830" }}
          >
            {loading && !hasFieldErrors ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className={`ms-2 ${styles.fontSize}`}>กำลังโหลด...</span>
              </>
            ) : (
              <span
                className={`${styles.fontSize}`}
              >
                เข้าสู่ระบบ
              </span>
            )}
          </button>
        </div>
        <div className="fv-help-block d-flex w-lg-500px w-md-500px w-300px">
          <a
            href="https://app.tsrplc.com/Dataphone/ChangePassword"
            className={`${styles.fontSize} ms-auto text-decoration-none`}
            style={{ color: "white", fontSize: 16, marginTop: 15, textDecoration: 'underline', cursor: 'pointer' }}
          >
            เปลี่ยนรหัสผ่าน
          </a>
        </div>
        <div className="fv-help-block d-flex">
          <span
            role="alert"
            className={`${styles.fontSize}`}
            style={{
              color: "white",
              fontSize: 14,
              marginTop: 30,
            }}
          >
            v {VERSION}
          </span>
        </div>
      </form>
    </div>
  );
}