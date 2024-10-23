import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

interface UUIDStore {
    REFNO: string;
    SETREFNO: () => void;
}

// หน้า package
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
    HASTRADEIN: number
    TOTALPRICE: number
    DISCOUNTPRICE: number
    SEQUENCE: number
    MODEL: string;
    PACKAGETYPEID: number;
    ORGANIZATIONCODE: string;
    ITEMID: string;
    PRODUCTID: string;
    PACKAGETITLE: string;
    FREEGIFT: {
        GIFTDESCRIPTION: null;
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

// หน้า discount
interface SaveTradeIn {
    HASTRADEIN: number;
    TRADEINBRANDID: number;
    TRADEINMODEL: string;
    TRADEINSERIAL: string;
}

interface SaveGift {
    GIFTID: number;
    GIFTCODE: string;
    GIFTNAME: string;
    GIFTDESCRIPTION: string | null;  // สามารถมีค่าเป็น null
    GIFTPRICE: number;
}

interface SaveDiscount {
    TRADEIN: SaveTradeIn;
    DISCOUNTAMOUNT: number;
    GIFT: SaveGift;
}

interface SaveDiscountStore {
    DISCOUNT: SaveDiscount[];
    SETDISCOUNT: (DISCOUNT: SaveDiscount[]) => void;
}

export const useSaveDiscountStore = create<SaveDiscountStore>((set) => ({
    DISCOUNT: [],
    SETDISCOUNT: (newDiscount) => set({ DISCOUNT: newDiscount }),
}));