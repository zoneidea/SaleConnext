import { create } from 'zustand';

// รูปบัตรปชช
interface photoIdCardStore {
  imagesIdCard: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const usePhotoIdCardStore = create<photoIdCardStore>((set) => ({
  imagesIdCard: JSON.parse(localStorage.getItem('IdCardImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.imagesIdCard, image];
      localStorage.setItem('IdCardImages', JSON.stringify(newImages));
      console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { imagesIdCard: newImages };
    });
  },
  removeImage: (image) => {
    set((state) => {
      const newImages = state.imagesIdCard.filter((img) => img !== image);
      localStorage.setItem('IdCardImages', JSON.stringify(newImages));
      console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { imagesIdCard: newImages };
    });
  },
  loadImages: () => {
    const savedImages = localStorage.getItem('IdCardImages');
    set({ imagesIdCard: savedImages ? JSON.parse(savedImages) : [] });
  },
}));

// รูปวาดแผนที่
interface photoDrawingMapStore {
  imagesDrawingMap: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const usePhotoDrawingMapStore = create<photoDrawingMapStore>((set) => ({
  imagesDrawingMap: JSON.parse(localStorage.getItem('DrawingMapImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.imagesDrawingMap, image];
      localStorage.setItem('DrawingMapImages', JSON.stringify(newImages));
      console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { imagesDrawingMap: newImages };
    });
  },
  removeImage: (image) => {
    set((state) => {
      const newImages = state.imagesDrawingMap.filter((img) => img !== image);
      localStorage.setItem('DrawingMapImages', JSON.stringify(newImages));
      console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { imagesDrawingMap: newImages };
    });
  },
  loadImages: () => {
    const savedImages = localStorage.getItem('DrawingMapImages');
    set({ imagesDrawingMap: savedImages ? JSON.parse(savedImages) : [] });
  },
}));

// รูปเครื่องเทิร์น
interface photoTurnStore {
  imagesTurn: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const usePhotoTurnStore = create<photoTurnStore>((set) => ({
  imagesTurn: JSON.parse(localStorage.getItem('turnImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.imagesTurn, image];
      localStorage.setItem('turnImages', JSON.stringify(newImages));
      console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { imagesTurn: newImages };
    });
  },
  removeImage: (image) => {
    set((state) => {
      const newImages = state.imagesTurn.filter((img) => img !== image);
      localStorage.setItem('turnImages', JSON.stringify(newImages));
      console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { imagesTurn: newImages };
    });
  },
  loadImages: () => {
    const savedImages = localStorage.getItem('turnImages');
    set({ imagesTurn: savedImages ? JSON.parse(savedImages) : [] });
  },
}));

// รูปติดตั้งเครื่อง
interface photoInstallationStore {
  imagesInstallation: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const usePhotoInstallationStore = create<photoInstallationStore>((set) => ({
  imagesInstallation: JSON.parse(localStorage.getItem('InstallationImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.imagesInstallation, image];
      localStorage.setItem('InstallationImages', JSON.stringify(newImages));
      console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { imagesInstallation: newImages };
    });
  },
  removeImage: (image) => {
    set((state) => {
      const newImages = state.imagesInstallation.filter((img) => img !== image);
      localStorage.setItem('InstallationImages', JSON.stringify(newImages));
      console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { imagesInstallation: newImages };
    });
  },
  loadImages: () => {
    const savedImages = localStorage.getItem('InstallationImages');
    set({ imagesInstallation: savedImages ? JSON.parse(savedImages) : [] });
  },
}));

// รูปบ้านลูกค้า
interface photoHomeCustomerStore {
  imagesHomeCustomer: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const usePhotoHomeCustomerStore = create<photoHomeCustomerStore>((set) => ({
  imagesHomeCustomer: JSON.parse(localStorage.getItem('HomeCustomerImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.imagesHomeCustomer, image];
      localStorage.setItem('HomeCustomerImages', JSON.stringify(newImages));
      console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { imagesHomeCustomer: newImages };
    });
  },
  removeImage: (image) => {
    set((state) => {
      const newImages = state.imagesHomeCustomer.filter((img) => img !== image);
      localStorage.setItem('HomeCustomerImages', JSON.stringify(newImages));
      console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { imagesHomeCustomer: newImages };
    });
  },
  loadImages: () => {
    const savedImages = localStorage.getItem('HomeCustomerImages');
    set({ imagesHomeCustomer: savedImages ? JSON.parse(savedImages) : [] });
  },
}));

// รูปลูกค้า
interface photoCustomerStore {
  imagesCustomer: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const usePhotoCustomerStore = create<photoCustomerStore>((set) => ({
  imagesCustomer: JSON.parse(localStorage.getItem('CustomerImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.imagesCustomer, image];
      localStorage.setItem('CustomerImages', JSON.stringify(newImages));
      console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { imagesCustomer: newImages };
    });
  },
  removeImage: (image) => {
    set((state) => {
      const newImages = state.imagesCustomer.filter((img) => img !== image);
      localStorage.setItem('CustomerImages', JSON.stringify(newImages));
      console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { imagesCustomer: newImages };
    });
  },
  loadImages: () => {
    const savedImages = localStorage.getItem('CustomerImages');
    set({ imagesCustomer: savedImages ? JSON.parse(savedImages) : [] });
  },
}));

// รูปอุปกรณ์วัดค่าน้ำ
interface photoEquipmentStore {
  imagesEquipment: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const usePhotoEquipmentStore = create<photoEquipmentStore>((set) => ({
  imagesEquipment: JSON.parse(localStorage.getItem('EquipmentImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.imagesEquipment, image];
      localStorage.setItem('EquipmentImages', JSON.stringify(newImages));
      console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { imagesEquipment: newImages };
    });
  },
  removeImage: (image) => {
    set((state) => {
      const newImages = state.imagesEquipment.filter((img) => img !== image);
      localStorage.setItem('EquipmentImages', JSON.stringify(newImages));
      console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { imagesEquipment: newImages };
    });
  },
  loadImages: () => {
    const savedImages = localStorage.getItem('EquipmentImages');
    set({ imagesEquipment: savedImages ? JSON.parse(savedImages) : [] });
  },
}));

// รูป GPS
interface photoGPSStore {
  imagesGPS: string[];
  setImagesGPS: (image: string) => void; // Change type to string to match a single image
  addImage: (image: string) => void; // Optional: If you want to add images individually
  removeImage: (image: string) => void; // Optional: If you want to remove images
  loadImages: () => void; // Optional: Load images from localStorage
}

export const usePhotoGPSStore = create<photoGPSStore>((set) => ({
  imagesGPS: JSON.parse(localStorage.getItem('GPSImages') || '[]'),
  setImagesGPS: (image) => {
    set((state) => {
      const newImages = [...state.imagesGPS, image]; // Add new image
      localStorage.setItem('GPSImages', JSON.stringify(newImages));
      console.log('Images after setImagesGPS:', newImages);
      return { imagesGPS: newImages };
    });
  },
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.imagesGPS, image];
      localStorage.setItem('GPSImages', JSON.stringify(newImages));
      return { imagesGPS: newImages };
    });
  },
  removeImage: (image) => {
    set((state) => {
      const newImages = state.imagesGPS.filter((img) => img !== image);
      localStorage.setItem('GPSImages', JSON.stringify(newImages));
      return { imagesGPS: newImages };
    });
  },
  loadImages: () => {
    const savedImages = localStorage.getItem('GPSImages');
    set({ imagesGPS: savedImages ? JSON.parse(savedImages) : [] });
  },
}));