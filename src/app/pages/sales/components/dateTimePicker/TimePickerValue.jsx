import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

const StyledTimePicker = styled(DatePicker)`
  font-family: 'Kanit', sans-serif;
  padding: 10px;
  margin-left: 10px;
  margin-right: 10px; /* เว้นระยะห่างจากด้านขวา 10px */
  border-radius: 4px;
  border: 1px solid #ccc;

  /* Full width with 10px space from right */
  width: calc(100% - 20px); /* ลบ 20px จาก 100% (10px ด้านซ้าย + 10px ด้านขวา) */
`;

export default function TimePickerValue() {
  const [selectedTime, setSelectedTime] = useState(new Date());

  return (
    <StyledTimePicker
      selected={selectedTime}
      onChange={(date) => setSelectedTime(date)}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="h:mm aa"
    />
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
