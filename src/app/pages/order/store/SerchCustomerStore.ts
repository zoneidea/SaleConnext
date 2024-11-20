import create from "zustand";

type Customer = {
  code: string;
  request_number: string | null;
  name: string;
  addr_detail: string;
  phone_number: string;
  from_data: string;
  create_date: string;
  PrefixCode: string;
  PrefixName: string;
  Sex: string | null;
  IDCard: string;
  AddressTypeCode: string;
  AddressDetail: string;
  AddressDetail2: string;
  AddressDetail3: string;
  AddressDetail4: string;
  ProvinceCode: string;
  DistrictCode: string;
  SubDistrictCode: string;
  Zipcode: string;
  TelMobile: string;
  TelOffice: string;
  TelHome: string;
  ProductSerialNumber: string;
};

type CustomerStore = {
  selectedCustomer: Customer | null; // เก็บข้อมูลลูกค้าที่เลือก
  setSelectedCustomer: (customer: Customer | null) => void; // ฟังก์ชันอัปเดตข้อมูลลูกค้า
};

export const useCustomerStore = create<CustomerStore>((set) => ({
  selectedCustomer: null,
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
}));