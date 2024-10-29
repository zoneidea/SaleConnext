import { create } from 'zustand';

// รูปวาดแผนที่
interface photoDrawingMapStore {
  images: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const usePhotoDrawingMapStore = create<photoDrawingMapStore>((set) => ({
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

// รูปเครื่องเทิร์น
interface photoTurnStore {
  images: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const useTurnStore = create<photoTurnStore>((set) => ({
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