import create from 'zustand'

interface ItemProps {
    REFNO: string;
    CONTNO: string;
    EMPID: string;
    TEAMSALE: string;
    SALECODE: string;
    SUPEMPID: string;
    SECEMPID: string;
    STATUS: string;
    PRODUCT: [any];
    CUSTOMERSTATUS: [any];
    DISCOUNT: [any];
    CUSTOMERDETAIL: [any];
    ADDRESS: [any];
    PDPA: [any];
    CONTRACT: [any];
    IMAGE: [any];
    CHECKERCOMMENT: [any];
    item?: {
        REFNO: string; // เพิ่ม item เป็น optional object
    };
}

interface ItemStore {
  item: ItemProps | null
  setItem: (item: ItemProps) => void
  clearItem: () => void
}

export const useItemStore = create<ItemStore>((set) => ({
  item: null,
  setItem: (item: ItemProps) => set({ item }),
  clearItem: () => set({ item: null }),
}))
