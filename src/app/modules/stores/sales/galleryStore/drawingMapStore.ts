import { create } from 'zustand';

interface DrawingMapStore {
  image: string | null;
  setImage: (image: string) => void;
  clearImage: () => void;
  loadImage: () => void;
}

export const drawingMapStore = create<DrawingMapStore>((set) => ({
  image: sessionStorage.getItem('drawingMapImage'), // ดึงรูปภาพจาก sessionStorage
  
  setImage: (image) => {
    sessionStorage.setItem('drawingMapImage', image); // บันทึกลง sessionStorage
    set({ image });
  },

  clearImage: () => {
    sessionStorage.removeItem('drawingMapImage'); // ลบรูปจาก sessionStorage
    set({ image: null });
  },

  loadImage: () => {
    const savedImage = sessionStorage.getItem('drawingMapImage');
    set({ image: savedImage });
  }
}));