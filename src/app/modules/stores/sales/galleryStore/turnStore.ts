import { create } from 'zustand';

interface TurnStore {
  images: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const turnStore = create<TurnStore>((set) => ({
  images: JSON.parse(sessionStorage.getItem('turnImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.images, image];
      sessionStorage.setItem('turnImages', JSON.stringify(newImages));
      console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { images: newImages };
    });
  },
  removeImage: (image) => {
    set((state) => {
      const newImages = state.images.filter((img) => img !== image);
      sessionStorage.setItem('turnImages', JSON.stringify(newImages));
      console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
      return { images: newImages };
    });
  },
  loadImages: () => {
    const savedImages = sessionStorage.getItem('turnImages');
    set({ images: savedImages ? JSON.parse(savedImages) : [] });
  },
}));