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

interface ProductStore {
    EmpId: string;
    TeamSale: string;
    CategoryId: string

    setEmpId: (id: string) => void;
    setTeamSaleId: (id: string) => void;
    setCategoryId: (id: string) => void;
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

// export const useProductStore = create<ProductStore>((set) => ({
//     EmpId: '',
//     TeamSale: '',
//     CategoryId: '',

//     setEmpId: (id) => set({ EmpId: id }),
//     setTeamSaleId: (id) => set({ TeamSale: id }),
//     setCategoryId: (id) => set({ CategoryId: id }),
// }));
