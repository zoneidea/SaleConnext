import { FC, useState, useEffect, createContext, useContext, Dispatch, SetStateAction } from 'react'
import { LayoutSplashScreen } from '../../../../_metronic/layout/core'
import { UserModel } from './_models'
import * as authHelper from './AuthHelpers'
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

      if (timeDifference > 86400000) {
        localStorage.removeItem('REFNO');
        sessionStorage.removeItem('REFNO');
        localStorage.removeItem('kt_theme_mode_value');
        localStorage.removeItem('authData');
        localStorage.removeItem('loginTimestamp');
        localStorage.removeItem('userData');
        localStorage.removeItem('latitude');
        localStorage.removeItem('longitude');
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
      localStorage.removeItem('REFNO');
      sessionStorage.removeItem('REFNO');
      localStorage.removeItem('kt_theme_mode_value');
      localStorage.removeItem('authData');
      localStorage.removeItem('loginTimestamp');
      localStorage.removeItem('userData');
      localStorage.removeItem('latitude');
      localStorage.removeItem('longitude');
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
