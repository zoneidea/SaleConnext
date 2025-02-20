import { AuthModel, UserModel } from "./_models";
import axios from "axios";

// Server should return AuthModel

const API_URL = import.meta.env.VITE_APP_API_THIENSURAT;
export const LOGIN_URL = `${API_URL}/Login`;

// ฟังก์ชัน login
export function login(username: string, password: string) {
  // console.log('username', username);
  // console.log('password', password);

  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  return axios.post(LOGIN_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  .then((response) => {
    // ตรวจสอบการตอบกลับจาก API
    if (response.status === 200 && response.data) {
      // console.log('Login successful:', response.data);
      return response;
    } else {
      console.error('Unexpected response:', response);
      throw new Error('Unexpected response from login API');
    }
  })
  .catch((error) => {
    console.error('Login error:', error);
    throw error;
  });
}

// export function getUserByToken(token: string) {
//   return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
//     api_token: token,
//   });
// }
