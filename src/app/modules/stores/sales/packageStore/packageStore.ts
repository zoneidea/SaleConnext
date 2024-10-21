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
    PackageTypeID: string
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
    setPackageTypeID: (id: string) => void;
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
    EmpId: 'A82517',
    DivisionId: 'M1124',
    DepartId: 'M1011',
    DepartGroup: 'S1',
    TeamSale: 'C06AA-8',

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
    EmpId: 'A82517',
    DivisionId: 'M1124',
    DepartId: 'M1011',
    DepartGroup: 'S1',
    TeamSale: 'C06AA-8',
    ItemID: '10200039',
    PackageTypeID: '1',
    HASTRADEIN: 1,
    TOTALPRICE: 4500,
    DISCOUNTPRICE: 1000,
    SEQUENCE: 100,

    setEmpId: (id) => set({ EmpId: id }),
    setDivisionId: (id) => set({ DivisionId: id }),
    setDepartId: (id) => set({ DepartId: id }),
    setDepartGroup: (group) => set({ DepartGroup: group }),
    setTeamSale: (team) => set({ TeamSale: team }),
    setItemID: (id) => set({ ItemID: id }),
    setPackageTypeID: (id) => set({ PackageTypeID: id }),
    setHASTRADEIN: (id: number | null) => set({ HASTRADEIN: id }),
    setTOTALPRICE: (price: number | null) => set({ TOTALPRICE: price }),
    setDISCOUNTPRICE: (price: number | null) => set({ DISCOUNTPRICE: price }),
    setSEQUENCE: (price: number | null) => set({ SEQUENCE: price }),
}));

export const useConditionsCheckHistoryStore = create<ConditionsCheckHistoryStore>((set) => ({
    EmpId: 'A82517',
    DivisionId: 'M1124',
    DepartId: 'M1011',
    DepartGroup: 'S1',
    TeamSale: 'C06AA-8',
    Model: '200039C0645_N01',

    setEmpId: (id) => set({ EmpId: id }),
    setDivisionId: (id) => set({ DivisionId: id }),
    setDepartId: (id) => set({ DepartId: id }),
    setDepartGroup: (group) => set({ DepartGroup: group }),
    setTeamSale: (team) => set({ TeamSale: team }),
    setModel: (id) => set({ Model: id }),
}));


