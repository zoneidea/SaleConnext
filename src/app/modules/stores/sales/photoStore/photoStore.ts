import { create } from 'zustand';

// รูปบัตรปชช
interface Photo {
  file: File | null; // เก็บไฟล์จริง
  preview: string; // เก็บ URL สำหรับ preview
}

interface PhotoIdCardStore {
  imagesIdCard: Photo[];
  addImage: (image: Photo) => void;
  removeImage: (preview: string) => void;
  loadImages: () => void;
  clearImages: () => void;
}

export const usePhotoIdCardStore = create<PhotoIdCardStore>((set) => ({
  imagesIdCard: JSON.parse(localStorage.getItem("IdCardImages") || "[]"),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.imagesIdCard, image];
      // เก็บเฉพาะ preview URL ลงใน localStorage
      localStorage.setItem(
        "IdCardImages",
        JSON.stringify(newImages.map((img) => ({ preview: img.preview })))
      );
      // console.log("Images after add:", newImages); // Log เพื่อตรวจสอบข้อมูลใน state
      return { imagesIdCard: newImages };
    });
  },
  removeImage: (preview) => {
    set((state) => {
      const newImages = state.imagesIdCard.filter((img) => img.preview !== preview);
      // อัปเดต localStorage หลังลบ
      localStorage.setItem(
        "IdCardImages",
        JSON.stringify(newImages.map((img) => ({ preview: img.preview })))
      );
      // console.log("Images after remove:", newImages); // Log เพื่อตรวจสอบข้อมูลใน state
      return { imagesIdCard: newImages };
    });
  },
  loadImages: () => {
    const savedImages = JSON.parse(localStorage.getItem("IdCardImages") || "[]");
    // เพิ่ม `null` ใน file เพื่อให้สอดคล้องกับโครงสร้าง `Photo`
    const formattedImages = savedImages.map((img: { preview: string }) => ({
      file: null,
      preview: img.preview,
    }));
    set({ imagesIdCard: formattedImages });
  },
  clearImages: () => {
    set(() => {
      localStorage.removeItem("IdCardImages"); // ลบข้อมูลใน localStorage
      // console.log("Images cleared"); // Log ข้อมูลหลังล้างรูป
      return { imagesIdCard: [] };
    });
  },
}));

interface photoDrawingMapStore {
  imagesDrawingMap: Photo[];
  addImage: (image: Photo) => void;
  removeImage: (preview: string) => void;
  loadImages: () => void;
  clearImages: () => void;
}

export const usePhotoDrawingMapStore = create<photoDrawingMapStore>((set) => ({
  imagesDrawingMap: JSON.parse(localStorage.getItem('DrawingMapImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.imagesDrawingMap, image];
      // เก็บเฉพาะ preview URL ลงใน localStorage
      localStorage.setItem(
        "DrawingMapImages",
        JSON.stringify(newImages.map((img) => ({ preview: img.preview })))
      );
      // console.log("Images after add:", newImages); // Log เพื่อตรวจสอบข้อมูลใน state
      return { imagesDrawingMap: newImages };
    });
  },
  removeImage: (preview) => {
    set((state) => {
      const newImages = state.imagesDrawingMap.filter((img) => img.preview !== preview);
      // อัปเดต localStorage หลังลบ
      localStorage.setItem(
        "DrawingMapImages",
        JSON.stringify(newImages.map((img) => ({ preview: img.preview })))
      );
      // console.log("Images after remove:", newImages); // Log เพื่อตรวจสอบข้อมูลใน state
      return { imagesDrawingMap: newImages };
    });
  },
  loadImages: () => {
    const savedImages = JSON.parse(localStorage.getItem("DrawingMapImages") || "[]");
    // เพิ่ม `null` ใน file เพื่อให้สอดคล้องกับโครงสร้าง `Photo`
    const formattedImages = savedImages.map((img: { preview: string }) => ({
      file: null,
      preview: img.preview,
    }));
    set({ imagesDrawingMap: formattedImages });
  },
  clearImages: () => {
    set(() => {
      localStorage.removeItem("DrawingMapImages"); // ลบข้อมูลใน localStorage
      // console.log("Images cleared"); // Log ข้อมูลหลังล้างรูป
      return { imagesDrawingMap: [] };
    });
  },
}));

// รูปเครื่องเทิร์น
// interface photoTurnStore {
//   imagesTurn: string[];
//   addImage: (image: string) => void;
//   removeImage: (image: string) => void;
//   loadImages: () => void;
// }

// export const usePhotoTurnStore = create<photoTurnStore>((set) => ({
//   imagesTurn: JSON.parse(localStorage.getItem('turnImages') || '[]'),
//   addImage: (image) => {
//     set((state) => {
//       const newImages = [...state.imagesTurn, image];
//       localStorage.setItem('turnImages', JSON.stringify(newImages));
//       console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
//       return { imagesTurn: newImages };
//     });
//   },
//   removeImage: (image) => {
//     set((state) => {
//       const newImages = state.imagesTurn.filter((img) => img !== image);
//       localStorage.setItem('turnImages', JSON.stringify(newImages));
//       console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
//       return { imagesTurn: newImages };
//     });
//   },
//   loadImages: () => {
//     const savedImages = localStorage.getItem('turnImages');
//     set({ imagesTurn: savedImages ? JSON.parse(savedImages) : [] });
//   },
// }));
interface photoTurnStore {
  imagesTurn: Photo[];
  addImage: (image: Photo) => void;
  removeImage: (preview: string) => void;
  loadImages: () => void;
  clearImages: () => void;
}

export const usePhotoTurnStore = create<photoTurnStore>((set) => ({
  imagesTurn: JSON.parse(localStorage.getItem('turnImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.imagesTurn, image];
      // เก็บเฉพาะ preview URL ลงใน localStorage
      localStorage.setItem(
        "turnImages",
        JSON.stringify(newImages.map((img) => ({ preview: img.preview })))
      );
      // console.log("Images after add:", newImages); // Log เพื่อตรวจสอบข้อมูลใน state
      return { imagesTurn: newImages };
    });
  },
  removeImage: (preview) => {
    set((state) => {
      const newImages = state.imagesTurn.filter((img) => img.preview !== preview);
      // อัปเดต localStorage หลังลบ
      localStorage.setItem(
        "turnImages",
        JSON.stringify(newImages.map((img) => ({ preview: img.preview })))
      );
      // console.log("Images after remove:", newImages); // Log เพื่อตรวจสอบข้อมูลใน state
      return { imagesTurn: newImages };
    });
  },
  loadImages: () => {
    const savedImages = JSON.parse(localStorage.getItem("turnImages") || "[]");
    // เพิ่ม `null` ใน file เพื่อให้สอดคล้องกับโครงสร้าง `Photo`
    const formattedImages = savedImages.map((img: { preview: string }) => ({
      file: null,
      preview: img.preview,
    }));
    set({ imagesTurn: formattedImages });
  },
  clearImages: () => {
    set(() => {
      localStorage.removeItem("turnImages"); // ลบข้อมูลใน localStorage
      // console.log("Images cleared"); // Log ข้อมูลหลังล้างรูป
      return { imagesTurn: [] };
    });
  },
}));

// รูปติดตั้งเครื่อง
// interface photoInstallationStore {
//   imagesInstallation: string[];
//   addImage: (image: string) => void;
//   removeImage: (image: string) => void;
//   loadImages: () => void;
// }

// export const usePhotoInstallationStore = create<photoInstallationStore>((set) => ({
//   imagesInstallation: JSON.parse(localStorage.getItem('InstallationImages') || '[]'),
//   addImage: (image) => {
//     set((state) => {
//       const newImages = [...state.imagesInstallation, image];
//       localStorage.setItem('InstallationImages', JSON.stringify(newImages));
//       console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
//       return { imagesInstallation: newImages };
//     });
//   },
//   removeImage: (image) => {
//     set((state) => {
//       const newImages = state.imagesInstallation.filter((img) => img !== image);
//       localStorage.setItem('InstallationImages', JSON.stringify(newImages));
//       console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
//       return { imagesInstallation: newImages };
//     });
//   },
//   loadImages: () => {
//     const savedImages = localStorage.getItem('InstallationImages');
//     set({ imagesInstallation: savedImages ? JSON.parse(savedImages) : [] });
//   },
// }));

interface photoInstallationStore {
  imagesInstallation: Photo[];
  addImage: (image: Photo) => void;
  removeImage: (preview: string) => void;
  loadImages: () => void;
  clearImages: () => void;
}

export const usePhotoInstallationStore = create<photoInstallationStore>((set) => ({
  imagesInstallation: JSON.parse(localStorage.getItem('InstallationImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.imagesInstallation, image];
      // เก็บเฉพาะ preview URL ลงใน localStorage
      localStorage.setItem(
        "InstallationImages",
        JSON.stringify(newImages.map((img) => ({ preview: img.preview })))
      );
      // console.log("Images after add:", newImages); // Log เพื่อตรวจสอบข้อมูลใน state
      return { imagesInstallation: newImages };
    });
  },
  removeImage: (preview) => {
    set((state) => {
      const newImages = state.imagesInstallation.filter((img) => img.preview !== preview);
      // อัปเดต localStorage หลังลบ
      localStorage.setItem(
        "InstallationImages",
        JSON.stringify(newImages.map((img) => ({ preview: img.preview })))
      );
      // console.log("Images after remove:", newImages); // Log เพื่อตรวจสอบข้อมูลใน state
      return { imagesInstallation: newImages };
    });
  },
  loadImages: () => {
    const savedImages = JSON.parse(localStorage.getItem("InstallationImages") || "[]");
    // เพิ่ม `null` ใน file เพื่อให้สอดคล้องกับโครงสร้าง `Photo`
    const formattedImages = savedImages.map((img: { preview: string }) => ({
      file: null,
      preview: img.preview,
    }));
    set({ imagesInstallation: formattedImages });
  },
  clearImages: () => {
    set(() => {
      localStorage.removeItem("InstallationImages"); // ลบข้อมูลใน localStorage
      // console.log("Images cleared"); // Log ข้อมูลหลังล้างรูป
      return { imagesInstallation: [] };
    });
  },
}));

// รูปบ้านลูกค้า
// interface photoHomeCustomerStore {
//   imagesHomeCustomer: string[];
//   addImage: (image: string) => void;
//   removeImage: (image: string) => void;
//   loadImages: () => void;
// }

// export const usePhotoHomeCustomerStore = create<photoHomeCustomerStore>((set) => ({
//   imagesHomeCustomer: JSON.parse(localStorage.getItem('HomeCustomerImages') || '[]'),
//   addImage: (image) => {
//     set((state) => {
//       const newImages = [...state.imagesHomeCustomer, image];
//       localStorage.setItem('HomeCustomerImages', JSON.stringify(newImages));
//       console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
//       return { imagesHomeCustomer: newImages };
//     });
//   },
//   removeImage: (image) => {
//     set((state) => {
//       const newImages = state.imagesHomeCustomer.filter((img) => img !== image);
//       localStorage.setItem('HomeCustomerImages', JSON.stringify(newImages));
//       console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
//       return { imagesHomeCustomer: newImages };
//     });
//   },
//   loadImages: () => {
//     const savedImages = localStorage.getItem('HomeCustomerImages');
//     set({ imagesHomeCustomer: savedImages ? JSON.parse(savedImages) : [] });
//   },
// }));

interface photoHomeCustomerStore {
  imagesHomeCustomer: Photo[];
  addImage: (image: Photo) => void;
  removeImage: (preview: string) => void;
  loadImages: () => void;
  clearImages: () => void;
}

export const usePhotoHomeCustomerStore = create<photoHomeCustomerStore>((set) => ({
  imagesHomeCustomer: JSON.parse(localStorage.getItem('HomeCustomerImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.imagesHomeCustomer, image];
      // เก็บเฉพาะ preview URL ลงใน localStorage
      localStorage.setItem(
        "HomeCustomerImages",
        JSON.stringify(newImages.map((img) => ({ preview: img.preview })))
      );
      // console.log("Images after add:", newImages); // Log เพื่อตรวจสอบข้อมูลใน state
      return { imagesHomeCustomer: newImages };
    });
  },
  removeImage: (preview) => {
    set((state) => {
      const newImages = state.imagesHomeCustomer.filter((img) => img.preview !== preview);
      // อัปเดต localStorage หลังลบ
      localStorage.setItem(
        "HomeCustomerImages",
        JSON.stringify(newImages.map((img) => ({ preview: img.preview })))
      );
      // console.log("Images after remove:", newImages); // Log เพื่อตรวจสอบข้อมูลใน state
      return { imagesHomeCustomer: newImages };
    });
  },
  loadImages: () => {
    const savedImages = JSON.parse(localStorage.getItem("HomeCustomerImages") || "[]");
    // เพิ่ม `null` ใน file เพื่อให้สอดคล้องกับโครงสร้าง `Photo`
    const formattedImages = savedImages.map((img: { preview: string }) => ({
      file: null,
      preview: img.preview,
    }));
    set({ imagesHomeCustomer: formattedImages });
  },
  clearImages: () => {
    set(() => {
      localStorage.removeItem("HomeCustomerImages"); // ลบข้อมูลใน localStorage
      // console.log("Images cleared"); // Log ข้อมูลหลังล้างรูป
      return { imagesHomeCustomer: [] };
    });
  },
}));

// รูปลูกค้า
// interface photoCustomerStore {
//   imagesCustomer: string[];
//   addImage: (image: string) => void;
//   removeImage: (image: string) => void;
//   loadImages: () => void;
// }

// export const usePhotoCustomerStore = create<photoCustomerStore>((set) => ({
//   imagesCustomer: JSON.parse(localStorage.getItem('CustomerImages') || '[]'),
//   addImage: (image) => {
//     set((state) => {
//       const newImages = [...state.imagesCustomer, image];
//       localStorage.setItem('CustomerImages', JSON.stringify(newImages));
//       console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
//       return { imagesCustomer: newImages };
//     });
//   },
//   removeImage: (image) => {
//     set((state) => {
//       const newImages = state.imagesCustomer.filter((img) => img !== image);
//       localStorage.setItem('CustomerImages', JSON.stringify(newImages));
//       console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
//       return { imagesCustomer: newImages };
//     });
//   },
//   loadImages: () => {
//     const savedImages = localStorage.getItem('CustomerImages');
//     set({ imagesCustomer: savedImages ? JSON.parse(savedImages) : [] });
//   },
// }));

interface photoCustomerStore {
  imagesCustomer: Photo[];
  addImage: (image: Photo) => void;
  removeImage: (preview: string) => void;
  loadImages: () => void;
  clearImages: () => void;
}

export const usePhotoCustomerStore = create<photoCustomerStore>((set) => ({
  imagesCustomer: JSON.parse(localStorage.getItem('CustomerImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.imagesCustomer, image];
      // เก็บเฉพาะ preview URL ลงใน localStorage
      localStorage.setItem(
        "CustomerImages",
        JSON.stringify(newImages.map((img) => ({ preview: img.preview })))
      );
      // console.log("Images after add:", newImages); // Log เพื่อตรวจสอบข้อมูลใน state
      return { imagesCustomer: newImages };
    });
  },
  removeImage: (preview) => {
    set((state) => {
      const newImages = state.imagesCustomer.filter((img) => img.preview !== preview);
      // อัปเดต localStorage หลังลบ
      localStorage.setItem(
        "CustomerImages",
        JSON.stringify(newImages.map((img) => ({ preview: img.preview })))
      );
      // console.log("Images after remove:", newImages); // Log เพื่อตรวจสอบข้อมูลใน state
      return { imagesCustomer: newImages };
    });
  },
  loadImages: () => {
    const savedImages = JSON.parse(localStorage.getItem("CustomerImages") || "[]");
    // เพิ่ม `null` ใน file เพื่อให้สอดคล้องกับโครงสร้าง `Photo`
    const formattedImages = savedImages.map((img: { preview: string }) => ({
      file: null,
      preview: img.preview,
    }));
    set({ imagesCustomer: formattedImages });
  },
  clearImages: () => {
    set(() => {
      localStorage.removeItem("CustomerImages"); // ลบข้อมูลใน localStorage
      // console.log("Images cleared"); // Log ข้อมูลหลังล้างรูป
      return { imagesCustomer: [] };
    });
  },
}));

// รูปอุปกรณ์วัดค่าน้ำ
// interface photoEquipmentStore {
//   imagesEquipment: string[];
//   addImage: (image: string) => void;
//   removeImage: (image: string) => void;
//   loadImages: () => void;
// }

// export const usePhotoEquipmentStore = create<photoEquipmentStore>((set) => ({
//   imagesEquipment: JSON.parse(localStorage.getItem('EquipmentImages') || '[]'),
//   addImage: (image) => {
//     set((state) => {
//       const newImages = [...state.imagesEquipment, image];
//       localStorage.setItem('EquipmentImages', JSON.stringify(newImages));
//       console.log('Images after add:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
//       return { imagesEquipment: newImages };
//     });
//   },
//   removeImage: (image) => {
//     set((state) => {
//       const newImages = state.imagesEquipment.filter((img) => img !== image);
//       localStorage.setItem('EquipmentImages', JSON.stringify(newImages));
//       console.log('Images after remove:', newImages); // เพิ่ม log เพื่อตรวจสอบข้อมูลใน state
//       return { imagesEquipment: newImages };
//     });
//   },
//   loadImages: () => {
//     const savedImages = localStorage.getItem('EquipmentImages');
//     set({ imagesEquipment: savedImages ? JSON.parse(savedImages) : [] });
//   },
// }));

interface photoEquipmentStore {
  imagesEquipment: Photo[];
  addImage: (image: Photo) => void;
  removeImage: (preview: string) => void;
  loadImages: () => void;
  clearImages: () => void;
}

export const usePhotoEquipmentStore = create<photoEquipmentStore>((set) => ({
  imagesEquipment: JSON.parse(localStorage.getItem('EquipmentImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.imagesEquipment, image];
      // เก็บเฉพาะ preview URL ลงใน localStorage
      localStorage.setItem(
        "EquipmentImages",
        JSON.stringify(newImages.map((img) => ({ preview: img.preview })))
      );
      // console.log("Images after add:", newImages); // Log เพื่อตรวจสอบข้อมูลใน state
      return { imagesEquipment: newImages };
    });
  },
  removeImage: (preview) => {
    set((state) => {
      const newImages = state.imagesEquipment.filter((img) => img.preview !== preview);
      // อัปเดต localStorage หลังลบ
      localStorage.setItem(
        "EquipmentImages",
        JSON.stringify(newImages.map((img) => ({ preview: img.preview })))
      );
      // console.log("Images after remove:", newImages); // Log เพื่อตรวจสอบข้อมูลใน state
      return { imagesEquipment: newImages };
    });
  },
  loadImages: () => {
    const savedImages = JSON.parse(localStorage.getItem("EquipmentImages") || "[]");
    // เพิ่ม `null` ใน file เพื่อให้สอดคล้องกับโครงสร้าง `Photo`
    const formattedImages = savedImages.map((img: { preview: string }) => ({
      file: null,
      preview: img.preview,
    }));
    set({ imagesEquipment: formattedImages });
  },
  clearImages: () => {
    set(() => {
      localStorage.removeItem("EquipmentImages"); // ลบข้อมูลใน localStorage
      // console.log("Images cleared"); // Log ข้อมูลหลังล้างรูป
      return { imagesEquipment: [] };
    });
  },
}));

//gps
// interface PhotoGPSStore {
//   imagesGPS: string[]; // Array of GPS images
//   addImage: (image: string) => void; // Function to add a new image
//   setImagesGPS: (image: string) => void; // Function to set the GPS images
//   removeImage: (image: string) => void; // Function to remove an image
//   loadImages: () => void; // Function to load images from local storage
// }

// export const usePhotoGPSStore = create<PhotoGPSStore>((set) => ({
//   imagesGPS: JSON.parse(localStorage.getItem('GPSImages') || '[]'),
//   addImage: (image) => {
//     set((state) => {
//       const newImages = [...state.imagesGPS, image]; // เพิ่มภาพใหม่เข้าไปในอาเรย์
//       localStorage.setItem('GPSImages', JSON.stringify(newImages));
//       return { imagesGPS: newImages };
//     })
//   },
//   setImagesGPS: (image) => {
//     set({ imagesGPS: [image] }); // Override the current images with the new one
//     localStorage.setItem('GPSImages', JSON.stringify([image])); // Store the image in local storage
//   },
//   removeImage: (image) => {
//     set((state) => {
//       const newImages = state.imagesGPS.filter((img) => img !== image);
//       localStorage.setItem('GPSImages', JSON.stringify(newImages));
//       return { imagesGPS: newImages };
//     });
//   },
//   loadImages: () => {
//     const savedImages = localStorage.getItem('GPSImages');
//     set({ imagesGPS: savedImages ? JSON.parse(savedImages) : [] });
//   },
// }));

interface PhotoGPSStore {
  imagesGPS: Photo[];
  addImage: (image: Photo) => void;
  removeImage: (preview: string) => void;
  loadImages: () => void;
  clearImages: () => void;
}

export const usePhotoGPSStore = create<PhotoGPSStore>((set) => ({
  imagesGPS: JSON.parse(localStorage.getItem('GPSImages') || '[]'),
  addImage: (image) => {
    set((state) => {
      const newImages = [...state.imagesGPS, image];
      // เก็บเฉพาะ preview URL ลงใน localStorage
      localStorage.setItem(
        "GPSImages",
        JSON.stringify(newImages.map((img) => ({ preview: img.preview })))
      );
      // console.log("Images after add:", newImages); // Log เพื่อตรวจสอบข้อมูลใน state
      return { imagesGPS: newImages };
    });
  },
  removeImage: (preview) => {
    set((state) => {
      const newImages = state.imagesGPS.filter((img) => img.preview !== preview);
      // อัปเดต localStorage หลังลบ
      localStorage.setItem(
        "GPSImages",
        JSON.stringify(newImages.map((img) => ({ preview: img.preview })))
      );
      // console.log("Images after remove:", newImages); // Log เพื่อตรวจสอบข้อมูลใน state
      return { imagesGPS: newImages };
    });
  },
  loadImages: () => {
    const savedImages = JSON.parse(localStorage.getItem("GPSImages") || "[]");
    // เพิ่ม `null` ใน file เพื่อให้สอดคล้องกับโครงสร้าง `Photo`
    const formattedImages = savedImages.map((img: { preview: string }) => ({
      file: null,
      preview: img.preview,
    }));
    set({ imagesGPS: formattedImages });
  },
  clearImages: () => {
    set(() => {
      localStorage.removeItem("GPSImages"); // ลบข้อมูลใน localStorage
      // console.log("Images cleared"); // Log ข้อมูลหลังล้างรูป
      return { imagesGPS: [] };
    });
  },
}));