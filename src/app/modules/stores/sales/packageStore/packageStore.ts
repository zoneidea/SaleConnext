import { create } from 'zustand';

interface FetchCategoryStore {
    fetchCategory: any[];
    setFetchCategory: (fetchCategory: any[]) => void;
}

interface CategoryStore {
    EmpId: string;
    DivisionId: string;
    DepartId: string;
    DepartGroup: string;
    TeamSale: string;

    setEmpId: (id: string) => void;
    setDivisionId: (id: string) => void;
    setDepartId: (id: string) => void;
    setDepartGroup: (group: string) => void;
    setTeamSale: (team: string) => void;
}

interface ProductStore {
    product: any[];
    setProduct: (product: any[]) => void;
}

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

export const useFetchCategoryStore = create<FetchCategoryStore>((set) => ({
    fetchCategory: [],
    setFetchCategory: (fetchCategory: any[]) => set({ fetchCategory }),
}));

export const useCategoryStore = create<CategoryStore>((set) => ({
    EmpId: '',
    DivisionId: '',
    DepartId: '',
    DepartGroup: '',
    TeamSale: '',

    setEmpId: (id) => set({ EmpId: id }),
    setDivisionId: (id) => set({ DivisionId: id }),
    setDepartId: (id) => set({ DepartId: id }),
    setDepartGroup: (group) => set({ DepartGroup: group }),
    setTeamSale: (team) => set({ TeamSale: team }),
}));

export const useProductStore = create<ProductStore>((set) => ({
    product: [],
    setProduct: (product: any[]) => set({ product }),
}));


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


