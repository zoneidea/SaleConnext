import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CryptoJS from 'crypto-js';

// คีย์ลับสำหรับการเข้ารหัส/ถอดรหัส
const secretKey = import.meta.env.VITE_SECRET_KEY;

// ฟังก์ชันเข้ารหัสข้อมูล
const encryptData = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

// ฟังก์ชันถอดรหัสข้อมูล
const decryptData = (data: string) => {
  const bytes = CryptoJS.AES.decrypt(data, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Zustand Store
interface FieldsState {
  fields: {
    // ข้อมูลลูกค้า
    idCard: string;
    fullname: string;
    age: string;

    // ที่อยู่ลูกค้า
    email: string;
  };
  setFieldValue: (fieldName: keyof FieldsState['fields'], value: any) => void;
}

const useStore = create<FieldsState>()(
  persist(
    (set) => ({
      // ข้อมูลลูกค้าเริ่มต้น
      fields: {
        idCard: '',
        fullname: '',
        age: '',
        email: ''
      },
      setFieldValue: (fieldName, value) => {
        set((state) => ({
          fields: { ...state.fields, [fieldName]: value },
        }));
      },
    }),
    {
      name: 'form-fields-storage',
      getStorage: () => sessionStorage, // ใช้ sessionStorage

      // ฟังก์ชันในการบันทึกข้อมูล โดยเข้ารหัสข้อมูลก่อนจัดเก็บ
      serialize: (state) => encryptData(state),

      // ฟังก์ชันในการดึงข้อมูล โดยถอดรหัสข้อมูลเมื่อดึงมาใช้
      deserialize: (state) => decryptData(state),
    }
  )
);

export default useStore;