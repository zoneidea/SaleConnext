import { create } from 'zustand';

// รูปบัตรปชช
interface photoIdCardStore {
  images: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const usePhotoIdCardStore = create<photoIdCardStore>((set) => ({
  images: JSON.parse(localStorage.getItem('IdCardImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.images, image];
      localStorage.setItem('IdCardImages', JSON.stringify(newImages));
      console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { images: newImages };
    });
  },
  removeImage: (image) => {
    set((state) => {
      const newImages = state.images.filter((img) => img !== image);
      localStorage.setItem('IdCardImages', JSON.stringify(newImages));
      console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { images: newImages };
    });
  },
  loadImages: () => {
    const savedImages = localStorage.getItem('IdCardImages');
    set({ images: savedImages ? JSON.parse(savedImages) : [] });
  },
}));

// รูปวาดแผนที่
interface photoDrawingMapStore {
  images: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const usePhotoDrawingMapStore = create<photoDrawingMapStore>((set) => ({
  images: JSON.parse(localStorage.getItem('DrawingMapImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.images, image];
      localStorage.setItem('DrawingMapImages', JSON.stringify(newImages));
      console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { images: newImages };
    });
  },
  removeImage: (image) => {
    set((state) => {
      const newImages = state.images.filter((img) => img !== image);
      localStorage.setItem('DrawingMapImages', JSON.stringify(newImages));
      console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { images: newImages };
    });
  },
  loadImages: () => {
    const savedImages = localStorage.getItem('DrawingMapImages');
    set({ images: savedImages ? JSON.parse(savedImages) : [] });
  },
}));

// รูปเครื่องเทิร์น
interface photoTurnStore {
  images: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const usePhotoTurnStore = create<photoTurnStore>((set) => ({
  images: JSON.parse(localStorage.getItem('turnImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.images, image];
      localStorage.setItem('turnImages', JSON.stringify(newImages));
      console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { images: newImages };
    });
  },
  removeImage: (image) => {
    set((state) => {
      const newImages = state.images.filter((img) => img !== image);
      localStorage.setItem('turnImages', JSON.stringify(newImages));
      console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { images: newImages };
    });
  },
  loadImages: () => {
    const savedImages = localStorage.getItem('turnImages');
    set({ images: savedImages ? JSON.parse(savedImages) : [] });
  },
}));

// รูปติดตั้งเครื่อง
interface photoInstallationStore {
  images: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const usePhotoInstallationStore = create<photoInstallationStore>((set) => ({
  images: JSON.parse(localStorage.getItem('InstallationImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.images, image];
      localStorage.setItem('InstallationImages', JSON.stringify(newImages));
      console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { images: newImages };
    });
  },
  removeImage: (image) => {
    set((state) => {
      const newImages = state.images.filter((img) => img !== image);
      localStorage.setItem('InstallationImages', JSON.stringify(newImages));
      console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { images: newImages };
    });
  },
  loadImages: () => {
    const savedImages = localStorage.getItem('InstallationImages');
    set({ images: savedImages ? JSON.parse(savedImages) : [] });
  },
}));

// รูปบ้านลูกค้า
interface photoHomeCustomerStore {
  images: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const usePhotoHomeCustomerStore = create<photoHomeCustomerStore>((set) => ({
  images: JSON.parse(localStorage.getItem('HomeCustomerImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.images, image];
      localStorage.setItem('HomeCustomerImages', JSON.stringify(newImages));
      console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { images: newImages };
    });
  },
  removeImage: (image) => {
    set((state) => {
      const newImages = state.images.filter((img) => img !== image);
      localStorage.setItem('HomeCustomerImages', JSON.stringify(newImages));
      console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { images: newImages };
    });
  },
  loadImages: () => {
    const savedImages = localStorage.getItem('HomeCustomerImages');
    set({ images: savedImages ? JSON.parse(savedImages) : [] });
  },
}));

// รูปลูกค้า
interface photoCustomerStore {
  images: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const usePhotoCustomerStore = create<photoCustomerStore>((set) => ({
  images: JSON.parse(localStorage.getItem('CustomerImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.images, image];
      localStorage.setItem('CustomerImages', JSON.stringify(newImages));
      console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { images: newImages };
    });
  },
  removeImage: (image) => {
    set((state) => {
      const newImages = state.images.filter((img) => img !== image);
      localStorage.setItem('CustomerImages', JSON.stringify(newImages));
      console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { images: newImages };
    });
  },
  loadImages: () => {
    const savedImages = localStorage.getItem('CustomerImages');
    set({ images: savedImages ? JSON.parse(savedImages) : [] });
  },
}));

// รูปอุปกรณ์วัดค่าน้ำ
interface photoEquipmentStore {
  images: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const usePhotoEquipmentStore = create<photoEquipmentStore>((set) => ({
  images: JSON.parse(localStorage.getItem('EquipmentImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.images, image];
      localStorage.setItem('EquipmentImages', JSON.stringify(newImages));
      console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { images: newImages };
    });
  },
  removeImage: (image) => {
    set((state) => {
      const newImages = state.images.filter((img) => img !== image);
      localStorage.setItem('EquipmentImages', JSON.stringify(newImages));
      console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { images: newImages };
    });
  },
  loadImages: () => {
    const savedImages = localStorage.getItem('EquipmentImages');
    set({ images: savedImages ? JSON.parse(savedImages) : [] });
  },
}));