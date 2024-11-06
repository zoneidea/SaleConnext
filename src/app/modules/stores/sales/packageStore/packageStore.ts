import { create } from 'zustand';

interface FetchCategoryStore {
    fetchCategory: any[];
    setFetchCategory: (fetchCategory: any[]) => void;
}

export const useFetchCategoryStore = create<FetchCategoryStore>((set) => ({
    fetchCategory: JSON.parse(localStorage.getItem('fetchCategory') || '[]'), // โหลดค่าเริ่มต้นจาก localStorage
    setFetchCategory: (fetchCategory: any[]) => {
        localStorage.setItem('fetchCategory', JSON.stringify(fetchCategory)); // บันทึกค่าใน localStorage ทุกครั้งที่อัปเดต
        set({ fetchCategory });
    },
}));

interface CategoryStore {
    EmpId: string;
    TeamSale: string;
    SaleCode: string;
    SupEmpId: string;
    SecEmpId: string;
    DivisionId: string;
    DepartId: string;
    DepartGroup: string;
    
    setEmpId: (id: string) => void;
    setTeamSale: (team: string) => void;
    setSaleCode: (id: string) => void;
    setSupEmpId: (id: string) => void;
    setSecEmpId: (id: string) => void;
    setDivisionId: (id: string) => void;
    setDepartId: (id: string) => void;
    setDepartGroup: (group: string) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
    EmpId: '',
    TeamSale: '',
    SaleCode: '',
    SupEmpId: '',
    SecEmpId: '',
    DivisionId: '',
    DepartId: '',
    DepartGroup: '',
    
    setEmpId: (id) => set({ EmpId: id }),
    setTeamSale: (team) => set({ TeamSale: team }),
    setSaleCode: (id) => set({ SaleCode: id }),
    setSupEmpId: (id) => set({ SupEmpId: id }),
    setSecEmpId: (id) => set({ SecEmpId: id }),
    setDivisionId: (id) => set({ DivisionId: id }),
    setDepartId: (id) => set({ DepartId: id }),
    setDepartGroup: (group) => set({ DepartGroup: group }),
}));

interface ProductStore {
    product: any[];
    setProduct: (product: any[]) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
    product: [],
    setProduct: (product: any[]) => set({ product }),
}));

interface PackageStore {
    EmpId: string;
    DivisionId: string;
    DepartId: string;
    DepartGroup: string;
    TeamSale: string;
    ItemID: string;
    PackageTypeID: number;  // เปลี่ยนจาก string เป็น number
    HASTRADEIN: number | null;
    TOTALPRICE: number | null;
    DISCOUNTPRICE: number | null;
    SEQUENCE: number | null;

    setEmpId: (id: string) => void;
    setDivisionId: (id: string) => void;
    setDepartId: (id: string) => void;
    setDepartGroup: (group: string) => void;
    setTeamSale: (team: string) => void;
    setItemID: (id: string) => void;
    setPackageTypeID: (id: number) => void;  // เปลี่ยนประเภทเป็น number
    setHASTRADEIN: (id: number | null) => void;
    setTOTALPRICE: (price: number | null) => void;
    setDISCOUNTPRICE: (price: number | null) => void;
    setSEQUENCE: (price: number | null) => void;
}

export const usePackageStore = create<PackageStore>((set) => ({
    EmpId: '',
    DivisionId: '',
    DepartId: '',
    DepartGroup: '',
    TeamSale: '',
    ItemID: '',
    PackageTypeID: 0,  // กำหนดค่าเริ่มต้นเป็น number
    HASTRADEIN: null,
    TOTALPRICE: null,
    DISCOUNTPRICE: null,
    SEQUENCE: null,

    setEmpId: (id) => set({ EmpId: id }),
    setDivisionId: (id) => set({ DivisionId: id }),
    setDepartId: (id) => set({ DepartId: id }),
    setDepartGroup: (group) => set({ DepartGroup: group }),
    setTeamSale: (team) => set({ TeamSale: team }),
    setItemID: (id) => set({ ItemID: id }),
    setPackageTypeID: (id: number) => set({ PackageTypeID: id }),  // แก้ไขให้รองรับ number
    setHASTRADEIN: (id: number | null) => set({ HASTRADEIN: id }),
    setTOTALPRICE: (price: number | null) => set({ TOTALPRICE: price }),
    setDISCOUNTPRICE: (price: number | null) => set({ DISCOUNTPRICE: price }),
    setSEQUENCE: (price: number | null) => set({ SEQUENCE: price }),
}));

interface ConditionsCheckHistoryStore {
    EmpId: string;
    DivisionId: string;
    DepartId: string;
    DepartGroup: string;
    TeamSale: string;
    Model: string;

    setEmpId: (id: string) => void;
    setDivisionId: (id: string) => void;
    setDepartId: (id: string) => void;
    setDepartGroup: (group: string) => void;
    setTeamSale: (team: string) => void;
    setModel: (id: string) => void;
}

export const useConditionsCheckHistoryStore = create<ConditionsCheckHistoryStore>((set) => ({
    EmpId: '',
    DivisionId: '',
    DepartId: '',
    DepartGroup: '',
    TeamSale: '',
    Model: '',

    setEmpId: (id) => set({ EmpId: id }),
    setDivisionId: (id) => set({ DivisionId: id }),
    setDepartId: (id) => set({ DepartId: id }),
    setDepartGroup: (group) => set({ DepartGroup: group }),
    setTeamSale: (team) => set({ TeamSale: team }),
    setModel: (id) => set({ Model: id }),
}));