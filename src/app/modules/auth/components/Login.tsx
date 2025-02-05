import { useState, useEffect } from 'react'
import axios from 'axios'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { login } from '../core/_requests'
import { useAuth } from '../core/Auth'
import { KTIcon, toAbsoluteUrl } from '../../../../_metronic/helpers'
import { useCategoryStore, useFetchCategoryStore } from '../../../modules/stores/sales/packageStore/packageStore'
import CryptoJS from 'crypto-js'

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
})

// const initialValues = {
//   username: '058488',
//   password: 'Bb1234567',
// }

const initialValues = {
  username: '',
  password: '',
}

export function Login() {
  const API_URL_POST_CATEGORIES = import.meta.env.VITE_APP_API_SALECONNEXT
  const CATEGORIES_URL = `${API_URL_POST_CATEGORIES}/GetProduct/Categories`

  const {
    EmpId, setEmpId,
    TeamSale, setTeamSale,
    SaleCode, setSaleCode,
    SupEmpId, setSupEmpId,
    SecEmpId, setSecEmpId,
    DivisionId, setDivisionId,
    DepartId, setDepartId,
    DepartGroup, setDepartGroup,
  } = useCategoryStore()

  const { auth, saveAuth, setCurrentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { fetchCategory, setFetchCategory } = useFetchCategoryStore()
  const [isCategoryLoaded, setIsCategoryLoaded] = useState(false)
  const SECRET_KEY = import.meta.env.VITE_APP_SECRET_KEY

  const postData = async () => {
    try {
      const response = await axios.post(CATEGORIES_URL, {
        EmpId, DivisionId, DepartId, DepartGroup, TeamSale
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const data = Array.isArray(response.data.data) ? response.data.data : []

      if (data.length > 0) {
        setFetchCategory(data)
        localStorage.setItem('fetchCategory', JSON.stringify(data)) // บันทึกลง localStorage
        setIsCategoryLoaded(true)
      } else {
        setIsCategoryLoaded(false)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setIsCategoryLoaded(false)
    }
  }

  useEffect(() => {
    const savedCategory = localStorage.getItem('fetchCategory')
    if (savedCategory) {
      const parsedCategory = JSON.parse(savedCategory)
      setFetchCategory(parsedCategory)
      setIsCategoryLoaded(parsedCategory.length > 0)
    }
  }, [setFetchCategory])

  // set permission GPS
  const [locationAccess, setLocationAccess] = useState<boolean>(false);
  console.log(`locationAccess`, locationAccess);

  function success(pos: any) {
    var crd = pos.coords;
    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  }

  function errors(err: any) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    Swal.fire({
      icon: 'warning',
      text: 'กรุณาเปิดการใช้งานตำแหน่ง GPS',
      confirmButtonText: 'ตกลง',
    }).then(() => {
      // navigator.geolocation.getCurrentPosition(success, errors, options);
      // const locationPermission = await navigator.permissions.query({ name: 'geolocation' })
      // console.log(`locationPermission`, locationPermission);
      // requestPermissions()
      navigate("chrome://settings/content/location")
    })
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  useEffect(() => {
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        setLocationAccess(permissionStatus.state === "granted");
      });
  }, [locationAccess]);

  const requestPermissions = async () => {
    try {
      // await navigator.mediaDevices.getUserMedia({ video: true })
      const locationPermission = await navigator.permissions.query({ name: 'geolocation' })
      // console.log(`locationPermission`, locationPermission);

      if (locationPermission.state === 'granted') {
        navigator.geolocation.watchPosition(success, errors, options);
      }
      else if (locationPermission.state === 'prompt') {
        navigator.geolocation.watchPosition(success, errors, options);
        locationPermission.onchange = () => {
          setLocationAccess(locationPermission.state === "granted");
        };
      }
      else if (locationPermission.state === 'denied') {
        Swal.fire({
          icon: 'warning',
          text: 'กรุณาเปิดการใช้งานตำแหน่ง GPS',
          confirmButtonText: 'ตกลง',
        })
      }

      const filePermission = await navigator.permissions.query({ name: 'persistent-storage' as PermissionName })
      if (filePermission.state !== 'granted') {
        alert('โปรดอนุญาตการเข้าถึงไฟล์')
      }
    } catch (error) {
      console.error('Error requesting permissions:', error)
      alert('อุปกรณ์ของคุณไม่รองรับการขอ permissions ทั้งหมด')
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setLoading(true)
      try {
        const response = await login(values.username, values.password)

        if (response.data.status === 500) {
          setErrors({
            username: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง.',
            password: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง.',
          })
          setSubmitting(false)
          setLoading(false)
        } else {
          const authData = JSON.stringify(response.data)
          const encryptedAuthData = CryptoJS.AES.encrypt(authData, SECRET_KEY).toString()
          localStorage.setItem('authData', encryptedAuthData)

          saveAuth(response.data)
          const user = {
            id: response.data.userId,
            username: values.username,
            ...response.data.userDetails,
          }
          setCurrentUser(user)

          await requestPermissions()

          // ตรวจสอบว่ามีข้อมูลใน fetchCategory แล้วหรือไม่
          if (!isCategoryLoaded) {
            await postData()
          }

          // ตรวจสอบว่า isCategoryLoaded เป็น true ก่อนเข้าสู่ dashboard
          if (isCategoryLoaded && fetchCategory.length > 0) {
            setEmpId(response.data.userDetails.EmpId)
            setTeamSale(response.data.userDetails.TeamSale)
            setSaleCode(response.data.userDetails.SaleCode)
            setSupEmpId(response.data.userDetails.SupEmp)
            setSecEmpId(response.data.userDetails.SecEmp)
            setDivisionId(response.data.userDetails.DivisionId)
            setDepartId(response.data.userDetails.DepartId)
            setDepartGroup(response.data.userDetails.DepartGroup)

            setLoading(false)
            navigate('/dashboard')
          } else {
            console.error('fetchCategory ยังไม่ได้ถูกโหลดหรือไม่มีข้อมูล')
            setErrors({ username: 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่สินค้า' })
            setLoading(false)
          }
        }
      } catch (error: any) {
        console.error('Login error:', error)
        setSubmitting(false)
        setLoading(false)
      }
    }
  })

  return (
    <div className="d-flex justify-content-center">
      <form
        className="text-center d-flex flex-column align-items-center justify-content-center"
        onSubmit={formik.handleSubmit}
        noValidate
        id='kt_login_signin_form'
      >
        <div className="d-flex justify-content-center align-items-center mb-4">
          <img
            alt="Logo"
            src={toAbsoluteUrl("media/logos/logo-tsr-old.png")}
            className="h-150px w-150px"
          />
        </div>
        {/* {formik.status ? (
        <div className='mb-lg-15 alert alert-danger rounded'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : (
        <div className='mb-10 bg-light-info p-8 rounded'>
          <div className='text-info'>
            Use username <strong>058488</strong> and password <strong>Bb1234567</strong> to continue.
          </div>
        </div>
      )} */}

        <div className='fv-row mb-3 w-lg-500px w-300px w-md-500px'>
          <label className='d-flex form-label fw-bolder text-gray-900 fs-6 mb-0'>Username</label>
          <input
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('username')}
            className={clsx(
              'form-control bg-transparent',
              {
                'is-invalid': formik.touched.username && formik.errors.username,
              },
              {
                'is-valid': formik.touched.username && !formik.errors.username,
              }
            )}
          />
          {formik.touched.username && formik.errors.username && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block d-flex'>
                <span role='alert'>{formik.errors.username}</span>
              </div>
            </div>
          )}
        </div>

        <div className='fv-row mb-3 w-lg-500px w-300px w-md-500px'>
          <label className='d-flex form-label fw-bolder text-gray-900 fs-6 mb-0'>Password</label>
          <input
            type='password'
            autoComplete='off'
            {...formik.getFieldProps('password')}
            className={clsx(
              'form-control bg-transparent',
              {
                'is-invalid': formik.touched.password && formik.errors.password,
              },
              {
                'is-valid': formik.touched.password && !formik.errors.password,
              }
            )}
          />
          {formik.touched.password && formik.errors.password && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block d-flex'>
                <span role='alert'>{formik.errors.password}</span>
              </div>
            </div>
          )}
        </div>

        <div className='d-grid my-10 w-lg-500px w-300px w-md-500px'>
          <button
            type='submit'
            id='kt_sign_in_submit'
            className='btn btn-primary'
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {!loading && <span className='indicator-label'>เข้าสู่ระบบ</span>}
            {loading && (
              <span className='indicator-progress' style={{ display: 'block' }}>
                โปรดรอสักครู่...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>

  )
}