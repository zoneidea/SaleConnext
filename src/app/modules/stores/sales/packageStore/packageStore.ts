import { create } from 'zustand';

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

interface FetchCategoryStore {
    fetchCategory: any[];
    setFetchCategory: (fetchCategory: any[]) => void;
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

    setEmpId: (id: string) => void;
    setDivisionId: (id: string) => void;
    setDepartId: (id: string) => void;
    setDepartGroup: (group: string) => void;
    setTeamSale: (team: string) => void;
    setItemID: (id: string) => void;
    setPackageTypeID: (id: string) => void;
}

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

export const useFetchCategoryStore = create<FetchCategoryStore>((set) => ({
    fetchCategory: [],
    setFetchCategory: (fetchCategory: any[]) => set({ fetchCategory }),
}));

export const usePackageStore = create<PackageStore>((set) => ({
    EmpId: 'A82517',
    DivisionId: 'M1124',
    DepartId: 'M1011',
    DepartGroup: 'S1',
    TeamSale: 'C06AA-8',
    ItemID: '10200039',
    PackageTypeID: '1',

    setEmpId: (id) => set({ EmpId: id }),
    setDivisionId: (id) => set({ DivisionId: id }),
    setDepartId: (id) => set({ DepartId: id }),
    setDepartGroup: (group) => set({ DepartGroup: group }),
    setTeamSale: (team) => set({ TeamSale: team }),
    setItemID: (id) => set({ ItemID: id }),
    setPackageTypeID: (id) => set({ PackageTypeID: id }),
}));


