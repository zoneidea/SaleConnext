import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

// สร้างคอมโพเนนต์ที่ห่อ DatePicker และใช้ styled-components
const StyledWrapper = styled.div`
  .custom-datepicker {
    font-family: 'Kanit', sans-serif;
    padding: 10px;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    width: calc(100% - 20px);
  }
`;

export function DatePickerValue() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const handleChange = (date: Date | null) => {
    setStartDate(date);
  };

  return (
    <StyledWrapper>
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        dateFormat="dd/MM/yyyy"
        className="custom-datepicker"
      />
    </StyledWrapper>
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
