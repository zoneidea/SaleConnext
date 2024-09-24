import { create } from 'zustand';

// สร้าง DrawingMap Store ที่เก็บรูปภาพแยกกัน
interface turnStore {
  images: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  loadImages: () => void;
}

export const turnStore = create<turnStore>((set) => ({
  images: JSON.parse(sessionStorage.getItem('turnImages') || '[]'), // ใช้ sessionStorage key แยก
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.images, image];
      sessionStorage.setItem('turnImages', JSON.stringify(newImages)); // บันทึกลง sessionStorage แยก key
      return { images: newImages };
    });
  },
  removeImage: (image) => {
    set((state) => {
      const newImages = state.images.filter((img) => img !== image);
      sessionStorage.setItem('turnImages', JSON.stringify(newImages)); // บันทึกลง sessionStorage
      return { images: newImages };
    });
  },
  loadImages: () => {
    const savedImages = sessionStorage.getItem('turnImages');
    set({ images: savedImages ? JSON.parse(savedImages) : [] });
  }
}));