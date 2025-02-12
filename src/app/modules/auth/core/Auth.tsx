// /* eslint-disable react-refresh/only-export-components */
// import { FC, useState, useEffect, createContext, useContext, Dispatch, SetStateAction } from 'react'
// import { LayoutSplashScreen } from '../../../../_metronic/layout/core'
// import { UserModel } from './_models'
// import * as authHelper from './AuthHelpers'
// // import {getUserByToken} from './_requests'
// import { WithChildren } from '../../../../_metronic/helpers'

// type AuthContextProps = {
//   auth: any | undefined
//   saveAuth: (auth: any | undefined) => void
//   currentUser: UserModel | undefined
//   setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
//   logout: () => void
// }

// const initAuthContextPropsState = {
//   auth: authHelper.getAuth(),
//   saveAuth: () => { },
//   currentUser: undefined,
//   setCurrentUser: () => { },
//   logout: () => { },
// }

// const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

// const useAuth = () => {
//   return useContext(AuthContext)
// }

// const AuthProvider: FC<WithChildren> = ({ children }) => {
//   const [auth, setAuth] = useState<any | undefined>(authHelper.getAuth())
//   const [currentUser, setCurrentUser] = useState<UserModel | undefined>()
//   // console.log(`currentUser`, currentUser);
//   // console.log(`auth`, auth);

//   const saveAuth = (auth: any | undefined) => {
//     setAuth(auth)
//     if (auth) {
//       authHelper.setAuth(auth)
//     } else {
//       authHelper.removeAuth()
//     }
//   }

//   const logout = () => {
//     saveAuth(undefined)
//     setCurrentUser(undefined)
//   }

//   return (
//     <AuthContext.Provider value={{ auth, saveAuth, currentUser, setCurrentUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// const AuthInit: FC<WithChildren> = ({ children }) => {
//   const { auth, currentUser, logout, setCurrentUser } = useAuth()

//   const [showSplashScreen, setShowSplashScreen] = useState(true)

//   // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
//   useEffect(() => {
//     const requestUser = async (apiToken: string) => {
//       try {
//         // if (!currentUser) {
//         //   const {data} = await getUserByToken(apiToken)
//         //   if (data) {
//         //     setCurrentUser(data)
//         //   }
//         // }
//       } catch (error) {
//         console.error(error)
//         if (currentUser) {
//           logout()
//         }
//       } finally {
//         setShowSplashScreen(false)
//       }
//     }

//     if (auth) {
//       // requestUser(auth.api_token)
//     } else {
//       logout()
//       setShowSplashScreen(false)
//     }
//     // eslint-disable-next-line
//   }, [])

//   return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
// }

// export { AuthProvider, AuthInit, useAuth }



/* eslint-disable react-refresh/only-export-components */
// import { FC, useState, useEffect, createContext, useContext, Dispatch, SetStateAction } from 'react'
// import { LayoutSplashScreen } from '../../../../_metronic/layout/core'
// import { UserModel } from './_models'
// import * as authHelper from './AuthHelpers'
// // import {getUserByToken} from './_requests'
// import { WithChildren } from '../../../../_metronic/helpers'

// type AuthContextProps = {
//   auth: any | undefined
//   saveAuth: (auth: any | undefined) => void
//   currentUser: UserModel | undefined
//   setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
//   logout: () => void
// }

// const initAuthContextPropsState = {
//   auth: authHelper.getAuth(),
//   saveAuth: () => { },
//   currentUser: undefined,
//   setCurrentUser: () => { },
//   logout: () => { },
// }

// const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

// const useAuth = () => {
//   return useContext(AuthContext)
// }

// const AuthProvider: FC<WithChildren> = ({ children }) => {
//   const [auth, setAuth] = useState<any | undefined>(() => {
//     const storedAuth = localStorage.getItem('authData');
//     return storedAuth ? JSON.parse(storedAuth) : undefined;
//   });

//   const [currentUser, setCurrentUser] = useState<UserModel | undefined>(() => {
//     const storedUser = localStorage.getItem('userData');
//     return storedUser ? JSON.parse(storedUser) : undefined;
//   });

//   const saveAuth = (auth: any | undefined) => {
//     setAuth(auth)
//     if (auth) {
//       authHelper.setAuth(auth)
//       localStorage.setItem('authData', JSON.stringify(auth))
//     } else {
//       authHelper.removeAuth()
//       localStorage.removeItem('authData')
//     }
//   }

//   // ปรับ setUserData ให้รองรับ Dispatch<SetStateAction<UserModel | undefined>>
//   const setUserData: Dispatch<SetStateAction<UserModel | undefined>> = (value) => {
//     const user = typeof value === 'function' ? (value as (prevState: UserModel | undefined) => UserModel | undefined)(currentUser) : value;

//     setCurrentUser(user);

//     if (user) {
//       localStorage.setItem('userData', JSON.stringify(user)); // บันทึกข้อมูล user
//     } else {
//       localStorage.removeItem('userData'); // ลบข้อมูล user เมื่อ logout
//     }
//   };

//   const logout = () => {
//     saveAuth(undefined)
//     setUserData(undefined)
//   }

//   return (
//     <AuthContext.Provider value={{ auth, saveAuth, currentUser, setCurrentUser: setUserData, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// const AuthInit: FC<WithChildren> = ({ children }) => {
//   const { auth, currentUser, logout, setCurrentUser } = useAuth()
//   const [showSplashScreen, setShowSplashScreen] = useState(true)

//   useEffect(() => {
//     const requestUser = async (apiToken: string) => {
//       try {
//         // กู้คืนข้อมูลผู้ใช้หากยังไม่มีการตั้งค่า currentUser
//         if (!currentUser) {
//           // const {data} = await getUserByToken(apiToken)
//           // if (data) {
//           //   setCurrentUser(data)
//           // }
//         }
//       } catch (error) {
//         console.error(error)
//         if (currentUser) {
//           logout()
//         }
//       } finally {
//         setShowSplashScreen(false)
//       }
//     }

//     if (auth) {
//       // requestUser(auth.api_token) // เรียก API ด้วย token ที่กู้คืนจาก localStorage
//     } else {
//       logout()
//       setShowSplashScreen(false)
//     }
//   }, [auth, currentUser, logout, setCurrentUser])

//   return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
// }

// export { AuthProvider, AuthInit, useAuth }




import { FC, useState, useEffect, createContext, useContext, Dispatch, SetStateAction } from 'react'
import { LayoutSplashScreen } from '../../../../_metronic/layout/core'
import { UserModel } from './_models'
import * as authHelper from './AuthHelpers'
// import {getUserByToken} from './_requests'
import { WithChildren } from '../../../../_metronic/helpers'

type AuthContextProps = {
  auth: any | undefined
  saveAuth: (auth: any | undefined) => void
  currentUser: UserModel | undefined
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
  logout: () => void
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => { },
  currentUser: undefined,
  setCurrentUser: () => { },
  logout: () => { },
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider: FC<WithChildren> = ({ children }) => {
  const [auth, setAuth] = useState<any | undefined>(() => {
    const storedAuth = localStorage.getItem('authData');
    const loginTimestamp = localStorage.getItem('loginTimestamp');

    if (storedAuth && loginTimestamp) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - parseInt(loginTimestamp, 10);

      // ตรวจสอบว่าผ่านไปแล้วเกิน 24 ชั่วโมง (86,400,000 มิลลิวินาที)
      if (timeDifference > 86400000) {
        // ลบข้อมูลเมื่อ session หมดอายุ
        localStorage.removeItem('authData');
        localStorage.removeItem('loginTimestamp');
        localStorage.removeItem('userData');
        return undefined;
      }

      return JSON.parse(storedAuth);
    }

    return undefined;
  });

  const [currentUser, setCurrentUser] = useState<UserModel | undefined>(() => {
    const storedUser = localStorage.getItem('userData');
    return storedUser ? JSON.parse(storedUser) : undefined;
  });

  const saveAuth = (auth: any | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
      localStorage.setItem('authData', JSON.stringify(auth));

      // บันทึกเวลาที่ผู้ใช้เข้าสู่ระบบ
      const loginTimestamp = new Date().getTime();
      localStorage.setItem('loginTimestamp', loginTimestamp.toString());
    } else {
      authHelper.removeAuth();
      localStorage.removeItem('authData');
      localStorage.removeItem('loginTimestamp');
    }
  };

  const setUserData: Dispatch<SetStateAction<UserModel | undefined>> = (value) => {
    const user = typeof value === 'function'
      ? (value as (prevState: UserModel | undefined) => UserModel | undefined)(currentUser)
      : value;

    setCurrentUser(user);

    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
    } else {
      localStorage.removeItem('userData');
    }
  };

  const logout = () => {
    saveAuth(undefined);
    setUserData(undefined);
  };

  // ตรวจสอบเวลา session เมื่อโหลดแอป
  useEffect(() => {
    const loginTimestamp = localStorage.getItem('loginTimestamp');

    if (loginTimestamp) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - parseInt(loginTimestamp, 10);

      if (timeDifference > 86400000) {
        logout(); // ลบ session ถ้าหมดอายุ
      }
    }
  }, []);  // ตรวจสอบครั้งเดียวเมื่อ component ถูกโหลด

  return (
    <AuthContext.Provider value={{ auth, saveAuth, currentUser, setCurrentUser: setUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthInit: FC<WithChildren> = ({ children }) => {
  const { auth, currentUser, logout, setCurrentUser } = useAuth()
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  useEffect(() => {
    const requestUser = async (apiToken: string) => {
      try {
        // กู้คืนข้อมูลผู้ใช้หากยังไม่มีการตั้งค่า currentUser
        if (!currentUser) {
          // const {data} = await getUserByToken(apiToken)
          // if (data) {
          //   setCurrentUser(data)
          // }
        }
      } catch (error) {
        console.error(error)
        if (currentUser) {
          logout()
        }
      } finally {
        setShowSplashScreen(false)
      }
    }

    if (auth) {
      // requestUser(auth.api_token) // เรียก API ด้วย token ที่กู้คืนจาก localStorage
    } else {
      logout()
      setShowSplashScreen(false)
    }
  }, [auth, currentUser, logout, setCurrentUser])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export { AuthProvider, AuthInit, useAuth }