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

// const initialValues = {
//   username: '058488',
//   password: 'Bb1234567',
// }

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

  // set permission GPS
  const [locationAccess, setLocationAccess] = useState<boolean>(false);
  console.log(`locationAccess`, locationAccess);

  function success(pos: any) {
    const crd = pos.coords;

    // เก็บลง localStorage
    localStorage.setItem("latitude", crd.latitude.toString());
    localStorage.setItem("longitude", crd.longitude.toString());
    // console.log("ตำแหน่งถูกบันทึก:", crd.latitude, crd.longitude);
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
      console.log(`locationPermission`, locationPermission);
      requestPermissions();
      navigate("chrome://settings/content/location");
    });
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  // useEffect(() => {
  //   navigator.permissions
  //     .query({ name: "geolocation" })
  //     .then((permissionStatus) => {
  //       setLocationAccess(permissionStatus.state === "granted");
  //     });
  // }, [locationAccess]);

  // useEffect(() => {
  //   navigator.permissions.query({ name: "geolocation" }).then((ps) => {
  //     if (ps.state === "prompt" || ps.state === "granted") {
  //       navigator.geolocation.getCurrentPosition(success, errors, options);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((ps) => {
        if (ps.state === "prompt") {
          // จะเรียกให้แสดง dialog ขออนุญาต
          navigator.geolocation.getCurrentPosition(
            () => {},
            () => {}
          );
        }
      });
    }
  }, []);

  const requestPermissions = async () => {
    try {
      // await navigator.mediaDevices.getUserMedia({ video: true })
      const locationPermission = await navigator.permissions.query({
        name: "geolocation",
      });
      // console.log(`locationPermission`, locationPermission);

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
        // console.log(`response`, response);

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

          await requestPermissions();

          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              // 2) เก็บลง localStorage
              localStorage.setItem("latitude", latitude.toString());
              localStorage.setItem("longitude", longitude.toString());
              // console.log("ตำแหน่งถูกบันทึก:", latitude, longitude);
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
    <div className="d-flex justify-content-center">
      <form
        className="text-center d-flex flex-column align-items-center justify-content-center"
        onSubmit={formik.handleSubmit}
        noValidate
        id="kt_login_signin_form"
      >
        <div className="d-flex justify-content-center align-items-center mb-4">
          <img
            alt="Logo"
            src={toAbsoluteUrl("media/logos/logo-tsr-old.png")}
            className="h-150px w-150px"
          />
        </div>

        <div className="fv-row mb-3 w-lg-500px w-300px w-md-500px">
          <label
            className={`d-flex form-label fw-bolder text-gray-900 mb-0 ${styles.fontSize}`}
          >
            Username
          </label>
          <input
            type="text"
            autoComplete="off"
            {...formik.getFieldProps("username")}
            className={clsx("form-control bg-transparent", styles.fontSize, {
              "is-invalid": formik.touched.username && formik.errors.username,
              "is-valid": formik.touched.username && !formik.errors.username,
            })}
            placeholder="Username"
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
          <label
            className={`d-flex form-label fw-bolder text-gray-900 mb-0 ${styles.fontSize}`}
          >
            Password
          </label>
          <input
            type="text"
            placeholder="Password"
            autoComplete="off"
            {...formik.getFieldProps("password")}
            className={clsx(
              "form-control bg-transparent", // ต้องมี form-control อยู่ด้วย
              styles.fontSize, // เอาคลาส .fontSize มาด้วย
              {
                "is-invalid": formik.touched.password && formik.errors.password,
                "is-valid": formik.touched.password && !formik.errors.password,
              }
            )}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block d-flex">
                {/* ห้ามใส่ role ผสมกับ className นะ */}
                <span role="alert" className={styles.fontSize}>
                  {formik.errors.password}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="d-grid my-10 w-lg-500px w-300px w-md-500px">
          <button
            type="submit"
            id="kt_sign_in_submit"
            className="btn btn-primary d-flex justify-content-center align-items-center"
            disabled={formik.isSubmitting || !formik.isValid || loading}
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
              <span className={`${styles.fontSize}`}>เข้าสู่ระบบ</span>
            )}
          </button>
        </div>
        <div className="fv-help-block d-flex">
          <span role="alert" className={`${styles.fontSize}`}>
            version {VERSION}
          </span>
        </div>
      </form>
    </div>
  );
}

// import styles from "@/styles/style.module.css";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import * as Yup from "yup";
// import clsx from "clsx";
// import { Link, useNavigate } from "react-router-dom";
// import { useFormik } from "formik";
// import { login } from "../core/_requests";
// import { useAuth } from "../core/Auth";
// import { KTIcon, toAbsoluteUrl } from "../../../../_metronic/helpers";
// import {
//   useCategoryStore,
//   useFetchCategoryStore,
// } from "../../../modules/stores/sales/packageStore/packageStore";
// import CryptoJS from "crypto-js";

// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";

// const loginSchema = Yup.object().shape({
//   username: Yup.string().required("กรุณากรอก Username"),
//   password: Yup.string().required("กรุณากรอก Password"),
// });

// // const initialValues = {
// //   username: '058488',
// //   password: 'Bb1234567',
// // }

// const initialValues = {
//   username: "",
//   password: "",
// };

// export function Login() {
//   const VERSION = import.meta.env.VITE_APP_VERSION;

//   const {
//     EmpId,
//     setEmpId,
//     TeamSale,
//     setTeamSale,
//     SaleCode,
//     setSaleCode,
//     SupEmpId,
//     setSupEmpId,
//     SecEmpId,
//     setSecEmpId,
//     DivisionId,
//     setDivisionId,
//     DepartId,
//     setDepartId,
//     DepartGroup,
//     setDepartGroup,
//   } = useCategoryStore();

//   const { auth, saveAuth, setCurrentUser } = useAuth();
//   const authData = localStorage.getItem("authData");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const { fetchCategory, setFetchCategory } = useFetchCategoryStore();
//   const [isCategoryLoaded, setIsCategoryLoaded] = useState(false);

//   const SECRET_KEY = import.meta.env.VITE_APP_SECRET_KEY;

//   // set permission GPS
//   const [locationAccess, setLocationAccess] = useState<boolean>(false);
//   console.log(`locationAccess`, locationAccess);

//   const requestPermissions = async () => {
//     try {
//       // await navigator.mediaDevices.getUserMedia({ video: true })
//       const locationPermission = await navigator.permissions.query({
//         name: "geolocation",
//       });
//       // console.log(`locationPermission`, locationPermission);

//       if (locationPermission.state === "granted") {
//         navigator.geolocation.watchPosition(success, errors, options);
//       } else if (locationPermission.state === "prompt") {
//         navigator.geolocation.watchPosition(success, errors, options);
//         locationPermission.onchange = () => {
//           setLocationAccess(locationPermission.state === "granted");
//         };
//       } else if (locationPermission.state === "denied") {
//         Swal.fire({
//           icon: "warning",
//           text: "กรุณาเปิดการใช้งาน GPS",
//           confirmButtonText: "ตกลง",
//         });
//       }

//       const filePermission = await navigator.permissions.query({
//         name: "persistent-storage" as PermissionName,
//       });
//       if (filePermission.state !== "granted") {
//         Swal.fire({
//           icon: "warning",
//           text: "โปรดอนุญาตการเข้าถึงไฟล์",
//           confirmButtonText: "ตกลง",
//         });
//       }
//     } catch (error) {
//       console.error("Error requesting permissions:", error);
//       alert("อุปกรณ์ของคุณไม่รองรับการขอ permissions ทั้งหมด");
//     }
//   };

//   const formik = useFormik({
//     initialValues,
//     validationSchema: loginSchema,
//     onSubmit: async (values, { setSubmitting, setErrors }) => {
//       setLoading(true);
//       try {
//         const response = await login(values.username, values.password);
//         // console.log(`response`, response);

//         if (response.data.status === 500 || response.data.status === 404) {
//           setErrors({
//             username: response.data.message,
//             password: response.data.message,
//           });
//           setSubmitting(false);
//           setLoading(false);
//           return;
//         } else {
//           const authData = JSON.stringify(response.data);
//           const encryptedAuthData = CryptoJS.AES.encrypt(
//             authData,
//             SECRET_KEY
//           ).toString();
//           const loginTimestamp = new Date().getTime(); // บันทึกเวลาล็อกอิน

//           localStorage.setItem("authData", encryptedAuthData);
//           localStorage.setItem("loginTimestamp", loginTimestamp.toString()); // บันทึกเวลาใน localStorage

//           saveAuth(response.data);
//           const user = {
//             id: response.data.userId,
//             username: values.username,
//             ...response.data.userDetails,
//           };
//           setCurrentUser(user);

//           const locPerm = await navigator.permissions.query({
//             name: "geolocation",
//           });
//           console.log(`locPerm`, locPerm);
//           const filePerm = await navigator.permissions.query({
//             name: "persistent-storage" as PermissionName,
//           });
//           console.log(`filePerm`, filePerm);

//           // 3) ขอ permission GPS
//           if (locPerm.state !== "granted" && filePerm.state === "granted") {
//             await Swal.fire({
//               icon: "warning",
//               text: "กรุณาเปิดการใช้งาน GPS",
//               confirmButtonText: "ตกลง",
//               allowOutsideClick: false,
//               allowEscapeKey: false,
//             });
//             // ถ้าต้องการพาไปหน้า setting จริง ๆ ก็ใส่ได้
//             // window.location.href = 'chrome://settings/content/location';
//           }

//           if (locPerm.state === "granted" && filePerm.state !== "granted") {
//             await Swal.fire({
//               icon: "warning",
//               text: "โปรดอนุญาตการเข้าถึงไฟล์",
//               confirmButtonText: "อนุญาต",
//               allowOutsideClick: false,
//               allowEscapeKey: false,
//             });
//           }

//           // 3) ขอ permission Persistent Storage
//           if (locPerm.state !== "granted" && filePerm.state !== "granted") {
//             await Swal.fire({
//               icon: "warning",
//               text: "โปรดอนุญาตการเข้าถึงไฟล์ และเปิดใช้งาน GPS",
//               confirmButtonText: "ตกลง",
//               allowOutsideClick: false,
//               allowEscapeKey: false,
//             });
//           }

//           // 4) สุดท้าย navigate ไป dashboard
//           setLoading(false);
//           navigate("/dashboard");
//         }
//       } catch (error: any) {
//         console.error("Login error:", error);
//         setSubmitting(false);
//         setLoading(false);
//       }
//     },
//   });

//   // เช็คสิทธิ์ GPS ครั้งแรก
//   useEffect(() => {
//     navigator.permissions
//       .query({ name: "geolocation" })
//       .then((ps) => setLocationAccess(ps.state === "granted"));
//   }, []);

//   // เมื่อ auth เป็นจริง (ล็อกอินสำเร็จ) แต่ locationAccess ยัง false
//   useEffect(() => {
//     // อ่านใหม่จาก localStorage ทุกครั้งที่ locationAccess เปลี่ยน
//     const stored = localStorage.getItem("authData");
//     if (stored && !locationAccess) {
//       Swal.fire({
//         icon: "warning",
//         text: "กรุณาเปิดการใช้งาน GPS",
//         confirmButtonText: "ตกลง",
//       }).then(() => {
//         navigate("chrome://settings/content/location");
//       });
//     }
//   }, [locationAccess, navigate]);

//   function success(pos: any) {
//     const crd = pos.coords;

//     // เก็บลง localStorage
//     localStorage.setItem("latitude", crd.latitude.toString());
//     localStorage.setItem("longitude", crd.longitude.toString());

//     console.log("Your current position is:");
//     console.log(`Latitude : ${crd.latitude}`);
//     console.log(`Longitude: ${crd.longitude}`);
//     console.log(`More or less ${crd.accuracy} meters.`);
//   }

//   function errors(err: any) {
//     console.warn(`ERROR(${err.code}): ${err.message}`);
//     if (!authData) return; // ถ้าไม่มี auth (ล็อกเอ้าแล้ว) ก็ไม่ต้องโชว์

//     Swal.fire({
//       icon: "warning",
//       text: "กรุณาเปิดการใช้งาน GPS",
//       confirmButtonText: "ตกลง",
//     }).then(() => {
//       // navigator.geolocation.getCurrentPosition(success, errors, options);
//       // const locationPermission = await navigator.permissions.query({ name: 'geolocation' })
//       // console.log(`locationPermission`, locationPermission);
//       // requestPermissions()
//       navigate("chrome://settings/content/location");
//     });
//   }

//   var options = {
//     enableHighAccuracy: true,
//     timeout: 5000,
//     maximumAge: 0,
//   };

//   useEffect(() => {
//     navigator.permissions
//       .query({ name: "geolocation" })
//       .then((permissionStatus) => {
//         setLocationAccess(permissionStatus.state === "granted");
//       });
//   }, [locationAccess]);

//   return (
//     <div className="d-flex justify-content-center">
//       <form
//         className="text-center d-flex flex-column align-items-center justify-content-center"
//         onSubmit={formik.handleSubmit}
//         noValidate
//         id="kt_login_signin_form"
//       >
//         <div className="d-flex justify-content-center align-items-center mb-4">
//           <img
//             alt="Logo"
//             src={toAbsoluteUrl("media/logos/logo-tsr-old.png")}
//             className="h-150px w-150px"
//           />
//         </div>

//         <div className="fv-row mb-3 w-lg-500px w-300px w-md-500px">
//           <label
//             className={`d-flex form-label fw-bolder text-gray-900 mb-0 ${styles.fontSize}`}
//           >
//             Username
//           </label>
//           <input
//             type="text"
//             autoComplete="off"
//             {...formik.getFieldProps("username")}
//             className={clsx("form-control bg-transparent", styles.fontSize, {
//               "is-invalid": formik.touched.username && formik.errors.username,
//               "is-valid": formik.touched.username && !formik.errors.username,
//             })}
//           />
//           {formik.touched.username && formik.errors.username && (
//             <div className="fv-plugins-message-container">
//               <div className="fv-help-block d-flex">
//                 <span role="alert" className={`${styles.fontSize}`}>
//                   {formik.errors.username}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="fv-row mb-3 w-lg-500px w-300px w-md-500px">
//           <label
//             className={`d-flex form-label fw-bolder text-gray-900 mb-0 ${styles.fontSize}`}
//           >
//             Password
//           </label>
//           <input
//             type="text"
//             autoComplete="off"
//             {...formik.getFieldProps("password")}
//             className={clsx(
//               "form-control bg-transparent", // ต้องมี form-control อยู่ด้วย
//               styles.fontSize, // เอาคลาส .fontSize มาด้วย
//               {
//                 "is-invalid": formik.touched.password && formik.errors.password,
//                 "is-valid": formik.touched.password && !formik.errors.password,
//               }
//             )}
//           />
//           {formik.touched.password && formik.errors.password && (
//             <div className="fv-plugins-message-container">
//               <div className="fv-help-block d-flex">
//                 {/* ห้ามใส่ role ผสมกับ className นะ */}
//                 <span role="alert" className={styles.fontSize}>
//                   {formik.errors.password}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="d-grid my-10 w-lg-500px w-300px w-md-500px">
//           <button
//             type="submit"
//             id="kt_sign_in_submit"
//             className="btn btn-primary d-flex justify-content-center align-items-center"
//             disabled={formik.isSubmitting || !formik.isValid || loading}
//           >
//             {loading ? (
//               <>
//                 <span
//                   className="spinner-border spinner-border-sm"
//                   role="status"
//                   aria-hidden="true"
//                 ></span>
//                 <span className={`ms-2 ${styles.fontSize}`}>กำลังโหลด...</span>
//               </>
//             ) : (
//               <span className={`${styles.fontSize}`}>เข้าสู่ระบบ</span>
//             )}
//           </button>
//         </div>

//         <div className="fv-help-block d-flex">
//           <span role="alert" className={`${styles.fontSize}`}>
//             version {VERSION}
//           </span>
//         </div>
//       </form>
//     </div>
//   );
// }
