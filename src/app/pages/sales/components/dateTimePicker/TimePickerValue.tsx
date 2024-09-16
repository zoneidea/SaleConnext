import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

// กำหนดสไตล์สำหรับ TimePicker
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

export function TimePickerValue() {
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());

  return (
    <StyledWrapper>
      <DatePicker
        selected={selectedTime}
        onChange={(date: Date | null) => setSelectedTime(date)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="h:mm aa"
        className="custom-datepicker" // ใช้ className เพื่อเพิ่มสไตล์
      />
    </StyledWrapper>
  );
}


// import * as React from 'react';
// import dayjs, { Dayjs } from 'dayjs';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';

// export default function TimePickerValue() {
//   const [value, setValue] = React.useState<Dayjs | null>(dayjs());

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DemoContainer components={['TimePicker']}>
//         <TimePicker
//           label="เวลา"
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
