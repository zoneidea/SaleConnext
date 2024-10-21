
// import {useState} from 'react'
// import * as Yup from 'yup'
// import clsx from 'clsx'
// import {Link} from 'react-router-dom'
// import {useFormik} from 'formik'
// import {getUserByToken, login} from '../core/_requests'
// import {toAbsoluteUrl} from '../../../../_metronic/helpers'
// import {useAuth} from '../core/Auth'

// const loginSchema = Yup.object().shape({
//   email: Yup.string()
//     .email('Wrong email format')
//     .min(3, 'Minimum 3 symbols')
//     .max(50, 'Maximum 50 symbols')
//     .required('Email is required'),
//   password: Yup.string()
//     .min(3, 'Minimum 3 symbols')
//     .max(50, 'Maximum 50 symbols')
//     .required('Password is required'),
// })

// const initialValues = {
//   email: 'admin@demo.com',
//   password: 'demo',
// }

// /*
//   Formik+YUP+Typescript:
//   https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
//   https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
// */

// export function Login() {
//   const [loading, setLoading] = useState(false)
//   const {saveAuth, setCurrentUser} = useAuth()

//   const formik = useFormik({
//     initialValues,
//     validationSchema: loginSchema,
//     onSubmit: async (values, {setStatus, setSubmitting}) => {
//       setLoading(true)
//       try {
//         const {data: auth} = await login(values.email, values.password)
//         saveAuth(auth)
//         const {data: user} = await getUserByToken(auth.api_token)
//         setCurrentUser(user)
//       } catch (error) {
//         console.error(error)
//         saveAuth(undefined)
//         setStatus('The login details are incorrect')
//         setSubmitting(false)
//         setLoading(false)
//       }
//     },
//   })

//   return (
//     <form
//       className='form w-100'
//       onSubmit={formik.handleSubmit}
//       noValidate
//       id='kt_login_signin_form'
//     >
//       {/* begin::Heading */}
//       <div className='text-center mb-11'>
//         <h1 className='text-gray-900 fw-bolder mb-3'>Sign In</h1>
//         {/* <div className='text-gray-500 fw-semibold fs-6'>Your Social Campaigns</div> */}
//       </div>
//       {/* begin::Heading */}

//       {/* begin::Login options */}
//       {/* end::Login options */}

//       {/* begin::Separator */}
//       <div className='separator separator-content my-14'>
//         {/* <span className='w-125px text-gray-500 fw-semibold fs-7'>Or with email</span> */}
//       </div>
//       {/* end::Separator */}

//       {formik.status ? (
//         <div className='mb-lg-15 alert alert-danger'>
//           <div className='alert-text font-weight-bold'>{formik.status}</div>
//         </div>
//       ) : (
//         <div className='mb-10 bg-light-info p-8 rounded'>
//           <div className='text-info'>
//             Use account <strong>admin@demo.com</strong> and password <strong>demo</strong> to
//             continue.
//           </div>
//         </div>
//       )}

//       {/* begin::Form group */}
//       <div className='fv-row mb-8'>
//         <label className='form-label fs-6 fw-bolder text-gray-900'>Email</label>
//         <input
//           placeholder='Email'
//           {...formik.getFieldProps('email')}
//           className={clsx(
//             'form-control bg-transparent',
//             {'is-invalid': formik.touched.email && formik.errors.email},
//             {
//               'is-valid': formik.touched.email && !formik.errors.email,
//             }
//           )}
//           type='email'
//           name='email'
//           autoComplete='off'
//         />
//         {formik.touched.email && formik.errors.email && (
//           <div className='fv-plugins-message-container'>
//             <span role='alert'>{formik.errors.email}</span>
//           </div>
//         )}
//       </div>
//       {/* end::Form group */}

//       {/* begin::Form group */}
//       <div className='fv-row mb-3'>
//         <label className='form-label fw-bolder text-gray-900 fs-6 mb-0'>Password</label>
//         <input
//           type='password'
//           autoComplete='off'
//           {...formik.getFieldProps('password')}
//           className={clsx(
//             'form-control bg-transparent',
//             {
//               'is-invalid': formik.touched.password && formik.errors.password,
//             },
//             {
//               'is-valid': formik.touched.password && !formik.errors.password,
//             }
//           )}
//         />
//         {formik.touched.password && formik.errors.password && (
//           <div className='fv-plugins-message-container'>
//             <div className='fv-help-block'>
//               <span role='alert'>{formik.errors.password}</span>
//             </div>
//           </div>
//         )}
//       </div>
//       {/* end::Form group */}

//       {/* begin::Wrapper */}
//       <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
//         <div />

//         {/* begin::Link */}
//         <Link to='/auth/forgot-password' className='link-primary'>
//           Forgot Password ?
//         </Link>
//         {/* end::Link */}
//       </div>
//       {/* end::Wrapper */}

//       {/* begin::Action */}
//       <div className='d-grid mb-10'>
//         <button
//           type='submit'
//           id='kt_sign_in_submit'
//           className='btn btn-primary'
//           disabled={formik.isSubmitting || !formik.isValid}
//         >
//           {!loading && <span className='indicator-label'>Continue</span>}
//           {loading && (
//             <span className='indicator-progress' style={{display: 'block'}}>
//               Please wait...
//               <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
//             </span>
//           )}
//         </button>
//       </div>
//       {/* end::Action */}

//       <div className='text-gray-500 text-center fw-semibold fs-6'>
//         Not a Member yet?{' '}
//         <Link to='/auth/registration' className='link-primary'>
//           Sign up
//         </Link>
//       </div>
//     </form>
//   )
// }

import { useState, useEffect } from 'react'
import axios from 'axios'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { login } from '../core/_requests'
import { useAuth } from '../core/Auth'
import { KTIcon, toAbsoluteUrl } from '../../../../_metronic/helpers'

//useStore
import { useCategoryStore, useFetchCategoryStore } from '../../../modules/stores/sales/packageStore/packageStore';

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
})

const initialValues = {
  username: '082517',
  password: 'Aa87654321',
}

export function Login() {
  const API_URL_POST_CATEGORIES = import.meta.env.VITE_APP_API_POST_CATEGORIES;
  const CATEGORIES_URL = `${API_URL_POST_CATEGORIES}/Categories`;

  const {
    EmpId, setEmpId,
    DivisionId, setDivisionId,
    DepartId, setDepartId,
    DepartGroup, setDepartGroup,
    TeamSale, setTeamSale,
  } = useCategoryStore();

  const { fetchCategory, setFetchCategory } = useFetchCategoryStore();
  useEffect(() => {
    console.log(`fetchCategory after login`, fetchCategory);
  }, [fetchCategory]);

  const postData = async () => {
    try {
      const response = await axios.post(CATEGORIES_URL, {
        EmpId, DivisionId, DepartId, DepartGroup, TeamSale
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setFetchCategory(data); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setEmpId(auth.data[0].EmpId);
    setDivisionId(auth.data[0].DivisionId);
    setDepartId(auth.data[0].DepartId);
    setDepartGroup(auth.data[0].DepartGroup);
    setTeamSale(auth.data[0].TeamSale);
  };

  const { auth, saveAuth, setCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requestPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true })
      console.log('Camera access granted')

      const locationPermission = await navigator.permissions.query({ name: 'geolocation' });
      if (locationPermission.state !== 'granted') {
        alert('โปรดอนุญาตการเข้าถึงตำแหน่ง (GPS)');
      }

      const filePermission = await navigator.permissions.query({ name: 'persistent-storage' as PermissionName });
      if (filePermission.state !== 'granted') {
        alert('โปรดอนุญาตการเข้าถึงไฟล์');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      alert('อุปกรณ์ของคุณไม่รองรับการขอ permissions ทั้งหมด');
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setLoading(true);
      try {
        const response = await login(values.username, values.password);
        console.log(`Response Login: ${response.data.status}, ${response.data.message}`);

        if (response.data.status === 500) {
          setErrors({
            username: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง.',
            password: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง.',
          });
          setSubmitting(false);
          setLoading(false);
        } else {
          // บันทึกข้อมูลลงใน localStorage
          localStorage.setItem('authData', JSON.stringify(response.data));

          saveAuth(response.data);
          const user = {
            id: response.data.userId,
            username: values.username,
            ...response.data.userDetails,
          };
          setCurrentUser(user);
          setLoading(false);
          navigate('/dashboard');

          await requestPermissions();
          await postData();
        }
      } catch (error: any) {
        console.log(`error`, error);
        setSubmitting(false);
        setLoading(false);
      }
    }
  });

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      <div className='text-center mb-11'>
        <img
          alt='Logo'
          src={toAbsoluteUrl('media/logos/logo-sabuyconnext.svg')}
          className='h-50px'
        />
      </div>
      {formik.status ? (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : (
        <div className='mb-10 bg-light-info p-8 rounded'>
          <div className='text-info'>
            Use username <strong>082517</strong> and password <strong>Aa87654321</strong> to continue.
          </div>
        </div>
      )}

      <div className='fv-row mb-3'>
        <label className='form-label fw-bolder text-gray-900 fs-6 mb-0'>Username</label>
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
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.username}</span>
            </div>
          </div>
        )}
      </div>

      <div className='fv-row mb-3'>
        <label className='form-label fw-bolder text-gray-900 fs-6 mb-0'>Password</label>
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
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>

      <div className='d-grid my-10'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-primary'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>เข้าสู่ระบบ</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
    </form>
  )
}