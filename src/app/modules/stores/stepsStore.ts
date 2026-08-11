import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const REFNO_STORAGE_KEY = 'REFNO';

const createRefno = () => uuidv4().replace(/-/g, '').toUpperCase();

const getStoredRefno = () => {
    const sessionRefno = sessionStorage.getItem(REFNO_STORAGE_KEY);
    if (sessionRefno) {
        return sessionRefno;
    }

    // Drop legacy REFNO kept in localStorage to avoid reusing stale values across sessions.
    localStorage.removeItem(REFNO_STORAGE_KEY);

    const newREFNO = createRefno();
    sessionStorage.setItem(REFNO_STORAGE_KEY, newREFNO);
    return newREFNO;
};

interface UUIDStore {
    REFNO: string;
    SETREFNO: () => void;
}

export const useUUIDStore = create<UUIDStore>((set) => ({
    REFNO: getStoredRefno(),
    SETREFNO: () => {
        const newREFNO = createRefno();
        sessionStorage.setItem(REFNO_STORAGE_KEY, newREFNO);
        localStorage.removeItem(REFNO_STORAGE_KEY);
        set({ REFNO: newREFNO });
    },
}));

// à¸«à¸™à¹‰à¸² package
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
    PromotionId: string | number;
    ProductId: any
    Package: SavePackage[];
}

interface SavePackage {
    HASTRADEIN: number
    TOTALPRICE: number
    DISCOUNTPRICE: number
    SEQUENCE: number
    MODEL: string;
    PACKAGETYPEID: number | null;
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

export const useSaveProductStore = create<SaveProductStore>((set) => ({
    PRODUCT: [],
    SETPRODUCT: (newProduct) => set({ PRODUCT: newProduct }),
}));

// à¸«à¸™à¹‰à¸² discount
interface SaveTradeIn {
    HASTRADEIN: number;
    TRADEINBRANDID: number;
    TRADEINBRANDNAME: string
    TRADEINMODEL: string;
    TRADEINSERIAL: string;
}

interface SaveGift {
    GIFTID: number;
    GIFTCODE: string;
    GIFTNAME: string;
    GIFTDESCRIPTION: string | null;  // à¸ªà¸²à¸¡à¸²à¸£à¸–à¸¡à¸µà¸„à¹ˆà¸²à¹€à¸›à¹‡à¸™ null
    GIFTPRICE: number;
}

interface SaveDiscount {
    TRADEIN: SaveTradeIn;
    DISCOUNTAMOUNT: number | null;
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

// à¸«à¸™à¹‰à¸² createCust à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸¥à¸¹à¸à¸„à¹‰à¸²
interface SaveCardType {
    CARDTYPE: number;
    CARDTYPECODE: string;
    CARDTYPENAME: string;
}

interface SavePrefix {
    PREFIXID: number
    PREFIXCODE: string
    PREFIXNAME: string
}

interface SaveSex {
    SEXID: number
    SEXCODE: string
    SEXNAME: string
}

interface CustomerType {
    CUSTOMERTYPE: string;
    CUSTOMERTYPENAME: string;
    CUSTOMERID: string;
    CUSTOMERNAME: string;
    CUSTOMERLASTNAME: string;
    CUSTOMERMD: string; // Managing Director
    CUSTOMERDOB: string;
    CUSTOMERRAGE: string;
    CUSTOMERMOBILE: string
    CUSTOMERWORKPHONE: string
    CUSTOMERPHONE: string
    CUSTOMEREMAIL: string
    CARDTYPE: SaveCardType[];
    PREFIX: SavePrefix[];
    SEX: SaveSex[];
}

interface SaveCustomerStore {
    saveCustomerTypes: CustomerType[]
    setSaveCustomerTypes: (customerTypes: CustomerType[]) => void
}

export const useSaveCustomerStore = create<SaveCustomerStore>((set) => ({
    saveCustomerTypes: [],
    setSaveCustomerTypes: (saveCustomerTypes) => set({ saveCustomerTypes }),
}))

// à¸«à¸™à¹‰à¸² createCust à¸—à¸µà¹ˆà¸­à¸¢à¸¹à¹ˆ
interface AddressCard {
    ADDRESSNUMBER: string;
    ADDRESSMOO: string;
    ADDRESSSOI: string;
    ADDRESSROAD: string;
    ADDRESSPROVINCE: string | number;
    ADDRESSPROVINCENAME: string
    ADDRESSDISTRICT: string | number;
    ADDRESSDISTRICTNAME: string
    ADDRESSSUBDISTRICT: string | number;
    ADDRESSSUBDISTRICTNAME: string
    ADDRESSZIPCODE: string;
    ADDRESSPHONE: string;
    USETHISTAX: string;
}

interface AddressInstallation {
    ADDRESSNUMBER: string;
    ADDRESSMOO: string;
    ADDRESSSOI: string;
    ADDRESSROAD: string;
    ADDRESSPROVINCE: string | number;
    ADDRESSPROVINCENAME: string
    ADDRESSDISTRICT: string | number;
    ADDRESSDISTRICTNAME: string
    ADDRESSSUBDISTRICT: string | number;
    ADDRESSSUBDISTRICTNAME: string
    ADDRESSZIPCODE: string;
    ADDRESSPHONE: string;
    USETHISTAX: string;
}

interface AddressPayment {
    ADDRESSNUMBER: string;
    ADDRESSMOO: string;
    ADDRESSSOI: string;
    ADDRESSROAD: string;
    ADDRESSPROVINCE: string | number;
    ADDRESSPROVINCENAME: string
    ADDRESSDISTRICT: string | number;
    ADDRESSDISTRICTNAME: string
    ADDRESSSUBDISTRICT: string | number;
    ADDRESSSUBDISTRICTNAME: string
    ADDRESSZIPCODE: string;
    ADDRESSPHONE: string;
    USETHISTAX: string;
}

interface AddressTax {
    ADDRESSNUMBER: string;
    ADDRESSMOO: string;
    ADDRESSSOI: string;
    ADDRESSROAD: string;
    ADDRESSPROVINCE: string | number;
    ADDRESSPROVINCENAME: string
    ADDRESSDISTRICT: string | number;
    ADDRESSDISTRICTNAME: string
    ADDRESSSUBDISTRICT: string | number;
    ADDRESSSUBDISTRICTNAME: string
    ADDRESSZIPCODE: string;
    ADDRESSPHONE: string;
    USETHISTAX: string;
}

// Define the interface for the store
interface AddressStore {
    addressCard: AddressCard;
    setAddressCard: (newAddress: AddressCard) => void;
    clearAddressCard: () => void;

    addressInstallation: AddressInstallation;
    setAddressInstallation: (newAddress: AddressInstallation) => void;
    clearAddressInstallation: () => void;

    addressPayment: AddressPayment;
    setAddressPayment: (newAddress: AddressPayment) => void;
    clearAddressPayment: () => void;

    addressTax: AddressTax;
    setAddressTax: (newAddress: AddressTax) => void;
    clearAddressTax: () => void;
}

// Create the Zustand store
export const useSaveAddressStore = create<AddressStore>((set) => ({
    addressCard: {
        ADDRESSNUMBER: '',
        ADDRESSMOO: '',
        ADDRESSSOI: '',
        ADDRESSROAD: '',
        ADDRESSPROVINCE: '',
        ADDRESSPROVINCENAME: '',
        ADDRESSDISTRICT: '',
        ADDRESSDISTRICTNAME: '',
        ADDRESSSUBDISTRICT: '',
        ADDRESSSUBDISTRICTNAME: '',
        ADDRESSZIPCODE: '',
        ADDRESSPHONE: '',
        USETHISTAX: '',
    },
    addressInstallation: {
        ADDRESSNUMBER: '',
        ADDRESSMOO: '',
        ADDRESSSOI: '',
        ADDRESSROAD: '',
        ADDRESSPROVINCE: '',
        ADDRESSPROVINCENAME: '',
        ADDRESSDISTRICT: '',
        ADDRESSDISTRICTNAME: '',
        ADDRESSSUBDISTRICT: '',
        ADDRESSSUBDISTRICTNAME: '',
        ADDRESSZIPCODE: '',
        ADDRESSPHONE: '',
        USETHISTAX: '',
    },
    addressPayment: {
        ADDRESSNUMBER: '',
        ADDRESSMOO: '',
        ADDRESSSOI: '',
        ADDRESSROAD: '',
        ADDRESSPROVINCE: '',
        ADDRESSPROVINCENAME: '',
        ADDRESSDISTRICT: '',
        ADDRESSDISTRICTNAME: '',
        ADDRESSSUBDISTRICT: '',
        ADDRESSSUBDISTRICTNAME: '',
        ADDRESSZIPCODE: '',
        ADDRESSPHONE: '',
        USETHISTAX: '',
    },
    addressTax: {
        ADDRESSNUMBER: '',
        ADDRESSMOO: '',
        ADDRESSSOI: '',
        ADDRESSROAD: '',
        ADDRESSPROVINCE: '',
        ADDRESSPROVINCENAME: '',
        ADDRESSDISTRICT: '',
        ADDRESSDISTRICTNAME: '',
        ADDRESSSUBDISTRICT: '',
        ADDRESSSUBDISTRICTNAME: '',
        ADDRESSZIPCODE: '',
        ADDRESSPHONE: '',
        USETHISTAX: '',
    },

    // Function to set a new address
    setAddressCard: (newAddress: AddressCard) => set({ addressCard: newAddress }),
    setAddressInstallation: (newAddress: AddressInstallation) => set({ addressInstallation: newAddress }),
    setAddressPayment: (newAddress: AddressPayment) => set({ addressPayment: newAddress }),
    setAddressTax: (newAddress: AddressTax) => set({ addressTax: newAddress }),

    // Function to clear the address (reset to initial state)
    clearAddressCard: () =>
        set({
            addressCard: {
                ADDRESSNUMBER: '',
                ADDRESSMOO: '',
                ADDRESSSOI: '',
                ADDRESSROAD: '',
                ADDRESSPROVINCE: '',
                ADDRESSPROVINCENAME: '',
                ADDRESSDISTRICT: '',
                ADDRESSDISTRICTNAME: '',
                ADDRESSSUBDISTRICT: '',
                ADDRESSSUBDISTRICTNAME: '',
                ADDRESSZIPCODE: '',
                ADDRESSPHONE: '',
                USETHISTAX: '',
            },
        }),

    clearAddressInstallation: () =>
        set({
            addressInstallation: {
                ADDRESSNUMBER: '',
                ADDRESSMOO: '',
                ADDRESSSOI: '',
                ADDRESSROAD: '',
                ADDRESSPROVINCE: '',
                ADDRESSPROVINCENAME: '',
                ADDRESSDISTRICT: '',
                ADDRESSDISTRICTNAME: '',
                ADDRESSSUBDISTRICT: '',
                ADDRESSSUBDISTRICTNAME: '',
                ADDRESSZIPCODE: '',
                ADDRESSPHONE: '',
                USETHISTAX: '',
            },
        }),

    clearAddressPayment: () =>
        set({
            addressPayment: {
                ADDRESSNUMBER: '',
                ADDRESSMOO: '',
                ADDRESSSOI: '',
                ADDRESSROAD: '',
                ADDRESSPROVINCE: '',
                ADDRESSPROVINCENAME: '',
                ADDRESSDISTRICT: '',
                ADDRESSDISTRICTNAME: '',
                ADDRESSSUBDISTRICT: '',
                ADDRESSSUBDISTRICTNAME: '',
                ADDRESSZIPCODE: '',
                ADDRESSPHONE: '',
                USETHISTAX: '',
            },
        }),

    clearAddressTax: () =>
        set({
            addressTax: {
                ADDRESSNUMBER: '',
                ADDRESSMOO: '',
                ADDRESSSOI: '',
                ADDRESSROAD: '',
                ADDRESSPROVINCE: '',
                ADDRESSPROVINCENAME: '',
                ADDRESSDISTRICT: '',
                ADDRESSDISTRICTNAME: '',
                ADDRESSSUBDISTRICT: '',
                ADDRESSSUBDISTRICTNAME: '',
                ADDRESSZIPCODE: '',
                ADDRESSPHONE: '',
                USETHISTAX: '',
            },
        }),
}));
