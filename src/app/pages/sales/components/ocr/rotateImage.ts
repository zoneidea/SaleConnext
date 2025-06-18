/**
 * หมุน base64 image แล้วคืนกลับมาเป็น base64 ใหม่ที่ถูกปรับ orientation
 * @param base64String รูปเดิม (เช่น "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...")
 * @param rotationDegree จำนวนองศาที่จะหมุน (90, 180, 270 ฯลฯ)
 * @returns Promise<string> ที่ resolve เป็น base64 ของภาพหลังหมุน
 */
export function rotateBase64Image(
    base64String: string,
    rotationDegree: 0 | 90 | 180 | 270
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64String;
      img.onload = () => {
        const w = img.width;
        const h = img.height;
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d')!;
  
        // ถ้าหมุน 90° หรือ 270° → เปลี่ยนขนาด canvas ให้สลับกัน
        if (rotationDegree === 90 || rotationDegree === 270) {
          canvas.width = h;
          canvas.height = w;
        } else {
          canvas.width = w;
          canvas.height = h;
        }
  
        // ย้ายจุด origin ไปตรงกลางก่อนหมุน
        ctx.translate(canvas.width / 2, canvas.height / 2);
        // หมุนเป็นเรเดียน
        ctx.rotate((rotationDegree * Math.PI) / 180);
        // วาดรูป (พลอตภาพ) โดยเลื่อนกลับไปครึ่งภาพ บน canvas ที่หมุนแล้ว
        ctx.drawImage(img, -w / 2, -h / 2);
  
        // เอา base64 ออกมา
        const rotatedBase64 = canvas.toDataURL('image/jpeg');
        resolve(rotatedBase64);
      };
      img.onerror = (err) => {
        reject(err);
      };
    });
  }
  