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
    Package: SavePackage[];
}

interface SavePackage {
    MODEL: string;
    PACKAGETYPEID: number;
    ORGANIZATIONCODE: string;
    ITEMID: string;
    PRODUCTID: string;
    PACKAGETITLE: string;
    TOTALPRICE: number;
    FREEGIFT: {
        GIFTID: number;
        GIFTCODE: string;
        GIFTNAME: string;
        GIFTPRICE: number | null;
    }[];
    PERIODDETAILS: {
        PAYMENTPERIODDETAILID: string;
        PAYMENTPERIODNUMBER: number;
        PAYMENTAMOUNT: number;
        CLOSEDISCOUNTAMOUNT: number;
    }[];
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
