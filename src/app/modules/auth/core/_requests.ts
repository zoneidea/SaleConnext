// import { AuthModel, UserModel } from "./_models";


// export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`;

// Server should return AuthModel
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;
export const LOGIN_URL = `${API_URL}/Login`;

// ฟังก์ชัน login
export function login(username: string, password: string) {
  console.log('username', username);
  console.log('password', password);

  // สร้าง FormData
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  // ส่งข้อมูลด้วย FormData
  return axios.post(
    LOGIN_URL,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data', // ระบุว่าเป็น multipart/form-data
      },
    }
  );
}

// export function getUserByToken(token: string) {
//   return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
//     api_token: token,
//   });
// }
