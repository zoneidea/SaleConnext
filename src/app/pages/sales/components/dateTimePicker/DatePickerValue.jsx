import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

const StyledDatePicker = styled(DatePicker)`
  font-family: 'Kanit', sans-serif;
  padding: 10px;
  margin-left: 10px;
  margin-right: 10px; /* เว้นระยะห่างจากด้านขวา 10px */
  border-radius: 4px;
  border: 1px solid #ccc;
  
  /* Full width with 10px space from right */
  width: calc(100% - 20px); /* ลบ 20px จาก 100% (10px ด้านซ้าย + 10px ด้านขวา) */
`;

export default function DatePickerValue() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <StyledDatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      dateFormat="dd/MM/yyyy"
    />
  );
}




// import * as React from 'react';
// import dayjs, { Dayjs } from 'dayjs';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// export default function DatePickerValue() {
//   const [value, setValue] = React.useState<Dayjs | null>(dayjs());

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DemoContainer components={['DatePicker']}>
//         <DatePicker
//           label="วันที่"
//           value={value}
//           onChange={(newValue) => setValue(newValue)}
//           slotProps={{
//             textField: { fullWidth: true },
//           }}
//         />
//       </DemoContainer>
//     </LocalizationProvider>
//   );
// }
