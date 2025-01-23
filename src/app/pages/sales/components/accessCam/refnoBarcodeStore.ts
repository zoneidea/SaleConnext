import create from 'zustand';
import { persist } from 'zustand/middleware';

interface RefnoBarcodeStore {
  refno: string | null;
  barCode: string | null; // ยังคงรองรับ null
  setRefno: (refno: string | null) => void; // เปลี่ยน type ให้รองรับ null
  setBarCode: (barCode: string | null) => void; // เปลี่ยน type ให้รองรับ null
}

const useRefnoBarcodeStore = create(
  persist<RefnoBarcodeStore>(
    (set) => ({
      refno: null,
      barCode: null,
      setRefno: (refno) => set({ refno }),
      setBarCode: (barCode) => set({ barCode }),
    }),
    {
      name: 'refno-barcode-store', // ชื่อ key ใน localStorage
    }
  )
);

export default useRefnoBarcodeStore;