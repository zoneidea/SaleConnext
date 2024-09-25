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

export const useFetchCategoryStore = create<FetchCategoryStore>((set) => ({
    fetchCategory: [],
    setFetchCategory: (fetchCategory: any[]) => set({ fetchCategory }),
}));

