import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

const DeviceScanBarcode = () => {
    const [data, setData] = useState('No result');

    // ตรวจสอบว่าเป็น iOS หรือ Android และเป็นอุปกรณ์มือถือเท่านั้น
    const isIOSorAndroid = /iPad|iPhone|iPod|Android/.test(navigator.userAgent);

    useEffect(() => {
        if (isIOSorAndroid) {
            const html5QrcodeScanner = new Html5Qrcode("reader");

            const config = {
                fps: 10,
                qrbox: 300, // เพิ่มขนาดของกรอบเพื่อให้จับภาพบาร์โค้ดได้ดีขึ้น
                formatsToSupport: [
                    Html5QrcodeSupportedFormats.EAN_13, // เพิ่มรูปแบบบาร์โค้ดที่ต้องการสแกน
                    Html5QrcodeSupportedFormats.CODE_128
                ],
                facingMode: { exact: "environment" } // ใช้กล้องหลัง
            };

            html5QrcodeScanner.start(
                { facingMode: "environment" }, // ใช้กล้องหลัง
                config,
                (decodedText, decodedResult) => {
                    setData(decodedText);
                },
                (errorMessage) => {
                    console.warn(`Error: ${errorMessage}`);
                }
            ).catch((err) => {
                console.error(`Unable to start scanning, error: ${err}`);
            });

            return () => {
                html5QrcodeScanner.stop().catch(err => console.error(err));
            };
        }
    }, [isIOSorAndroid]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '500px' }}>
            {isIOSorAndroid ? (
                <>
                    <div id="reader" style={{ width: '100%', height: '100%' }}></div>
                    <div
                        style={{
                            border: '2px solid red',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '80%',
                            height: '40%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: '10',
                            pointerEvents: 'none', // เพื่อให้คลิกทะลุกรอบได้
                        }}
                    />
                    <p>{data}</p>
                </>
            ) : (
                <div className='fw-semibold fs-6 my-10 mx-10'>
                    ฟีเจอร์สแกนบาร์โค้ด ไม่สามารถใช้บนอุปกรณ์ PC ได้
                    <div className='d-flex flex-column flex-md-row justify-content-between mb-5 mt-10'>
                        <Link to='/sale/overview' className='btn btn-secondary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                            ย้อนกลับ
                        </Link>
                        <Link to='/sale/order' className='btn btn-primary w-100 w-md-auto align-self-center mb-2 mb-md-0'>
                            ถัดไป
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeviceScanBarcode;






// import React, { useState } from 'react';

// const DeviceScanBarcode = () => {
//     const [image, setImage] = useState(null);
//     const [response, setResponse] = useState(null);

//     const handleImageChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             const file = e.target.files[0];
//             resizeImage(file, (resizedImage) => {
//                 setImage(resizedImage);
//             });
//         }
//     };

//     const resizeImage = (file, callback) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);

//         reader.onload = function (event) {
//             const img = new Image();
//             img.src = event.target.result;

//             img.onload = function () {
//                 const canvas = document.createElement('canvas');
//                 const MAX_SIZE = 2000 * 1024; // 2MB in bytes

//                 let width = img.width;
//                 let height = img.height;

//                 // Calculate the reduction ratio
//                 const ratio = Math.sqrt(MAX_SIZE / (file.size * 2));

//                 if (file.size > MAX_SIZE) {
//                     width *= ratio;
//                     height *= ratio;
//                 }

//                 canvas.width = width;
//                 canvas.height = height;

//                 const ctx = canvas.getContext('2d');
//                 ctx.drawImage(img, 0, 0, width, height);

//                 canvas.toBlob((blob) => {
//                     callback(blob);
//                 }, file.type, 0.9); // 0.9 is the quality of the image
//             };
//         };
//     };

//     const handleScan = async () => {
//         if (!image) {
//             console.error("No image selected");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("file", image, "resized-image.jpg");

//         try {
//             const response = await fetch("https://api.aiforthai.in.th/ocr-id-front-iapp", {
//                 method: "POST",
//                 headers: {
//                     "apikey": "H2EZPAEjqlRMNhueK1vOEiFgL4UuRLCv",
//                 },
//                 body: formData
//             });

//             const result = await response.json();
//             setResponse(result);
//         } catch (error) {
//             console.error("Error:", error);
//         }
//     };

//     return (
//         <div>
//             <h1>OCR ID Card Front</h1>
//             <input type="file" onChange={handleImageChange} />
//             <button onClick={handleScan}>Scan</button>
//             {response && (
//                 <div>
//                     <h2>Response:</h2>
//                     <pre>{JSON.stringify(response, null, 2)}</pre>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DeviceScanBarcode;







// import React, { useState } from 'react';
// import Tesseract from 'tesseract.js';
// import Pica from 'pica';

// const DeviceScanBarcode = () => {
//     const [image, setImage] = useState(null);
//     const [text, setText] = useState('');
//     const [extractedDetails, setExtractedDetails] = useState({
//         idNumber: '',
//         fullName: '',
//         dob: ''
//     });
//     const pica = Pica();

//     const handleImageChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             setImage(URL.createObjectURL(e.target.files[0]));
//         }
//     };

//     const handleScan = async () => {
//         if (image) {
//             const img = document.createElement('img');
//             img.src = image;

//             img.onload = async () => {
//                 // Create a canvas to resize or process the image
//                 const canvas = document.createElement('canvas');
//                 canvas.width = img.width;
//                 canvas.height = img.height;

//                 const ctx = canvas.getContext('2d');
//                 ctx.drawImage(img, 0, 0);

//                 // Grayscale the image (optional, based on your requirements)
//                 const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//                 const data = imageData.data;
//                 for (let i = 0; i < data.length; i += 4) {
//                     const grayscale = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
//                     data[i] = grayscale; // Red
//                     data[i + 1] = grayscale; // Green
//                     data[i + 2] = grayscale; // Blue
//                 }
//                 ctx.putImageData(imageData, 0, 0);

//                 // Resize the image with Pica
//                 const resizedCanvas = document.createElement('canvas');
//                 resizedCanvas.width = img.width;
//                 resizedCanvas.height = img.height;

//                 await pica.resize(canvas, resizedCanvas);

//                 // Convert canvas to data URL for Tesseract.js
//                 const processedImage = resizedCanvas.toDataURL();

//                 // Perform OCR using Tesseract.js
//                 Tesseract.recognize(
//                     processedImage,
//                     'tha',
//                     {
//                         logger: (m) => console.log(m),
//                         tessedit_char_whitelist: '0123456789กขคฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผพภมยรลวศษสหฬอฮ'
//                     }
//                 )
//                 .then(({ data: { text } }) => {
//                     setText(text);
//                     const details = extractIDCardDetails(text);
//                     setExtractedDetails(details);
//                 })
//                 .catch((error) => {
//                     console.error(error);
//                 });
//             };
//         } else {
//             console.error("No image selected");
//         }
//     };

//     const extractIDCardDetails = (ocrText) => {
//         const lines = ocrText.split('\n');
//         let idNumber = '';
//         let fullName = '';
//         let dob = '';

//         lines.forEach(line => {
//             // Regular expression to match Thai ID number format
//             if (/^\d{1}-\d{4}-\d{5}-\d{2}-\d{1}$/.test(line)) {
//                 idNumber = line;
//             } else if (line.includes('ชื่อ')) {
//                 fullName = line.replace('ชื่อ', '').trim();
//             } else if (line.includes('เกิด')) {
//                 dob = line.replace('เกิด', '').trim();
//             }
//         });

//         console.log({ idNumber, fullName, dob }); // Debugging purpose
//         return { idNumber, fullName, dob };
//     };

//     return (
//         <div>
//             <h1>Thai ID Card OCR</h1>
//             <input type="file" onChange={handleImageChange} />
//             <button onClick={handleScan}>Scan</button>
//             <p>Scanned Text:</p>
//             <pre>{text}</pre>
//             <h2>Extracted Details:</h2>
//             <p>ID Number: {extractedDetails.idNumber || 'Not Found'}</p>
//             <p>Full Name: {extractedDetails.fullName || 'Not Found'}</p>
//             <p>Date of Birth: {extractedDetails.dob || 'Not Found'}</p>
//         </div>
//     );
// };

// export default DeviceScanBarcode;










