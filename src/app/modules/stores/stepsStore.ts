import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

interface UUIDStore {
    REFNO: string;
    SETREFNO: () => void;
}

interface SaveProduct {
    EmpId: string;
    TeamSale: string;
    SaleCode: string;
    ItemCode: string;
    ItemDescription: string;
    CategoriesId: any;
    DescriptionEN: string;
    DescriptionTH: string;
    SerialNo: string;
    Status: string;
    Branch: string;
    TransDate: string;
    Package: any[];
}

interface SaveProductStore {
    PRODUCT: SaveProduct[];
    SETPRODUCT: (PRODUCT: SaveProduct[]) => void;
}

export const useUUIDStore = create<UUIDStore>((set) => ({
    REFNO: uuidv4().replace(/-/g, '').toUpperCase(),
    SETREFNO: () => set({ REFNO: uuidv4().replace(/-/g, '').toUpperCase() }),
}));

export const useSaveProductStore = create<SaveProductStore>((set) => ({
    PRODUCT: [],
    SETPRODUCT: (newProduct) => set({ PRODUCT: newProduct }),
}));
