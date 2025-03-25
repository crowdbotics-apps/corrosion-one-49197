import MDBox from "components/MDBox";
import React, { useState, useEffect } from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import MDTypography from "../MDTypography";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import IconButton from '@mui/material/IconButton';
import Grid from "@mui/material/Grid"
import CancelIcon from "@mui/icons-material/Cancel";

const DateBar = ({ start, end, onDateChange }) => {
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    onDateChange(startDate, endDate);
  }, [startDate, endDate, onDateChange]);

  const handleDateChange = (newStartDate, newEndDate) => {
    if (newEndDate && newStartDate && newEndDate.isBefore(newStartDate)) {
      setError('End date cannot be before start date');
    } else {
      setError(null);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      if (newStartDate && newEndDate) {
        setOpen(false);
      }
    }
  };

  const formatDateRange = () => {
    if (!startDate || !endDate) return 'Select Dates';
    return `${startDate.format('MMM DD')} - ${endDate.format('MMM DD')}`;
  };

  const handleClearDates = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Grid display={'flex'} direction={'row'} alignItems={'center'}>
        <MDBox>
          {(startDate && endDate) && (
            <IconButton onClick={handleClearDates} color={'error'}>
              <CancelIcon />
            </IconButton>
          )}
        </MDBox>
        <MDBox
          display="flex"
          alignItems="center"
          sx={{
            fontSize: '20px',
            border: '1px solid #D3D3D3',
            borderRadius: '12px',
            padding: '20px',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={() => setOpen(!open)}
        >
          <MDTypography sx={{fontSize: '16px', marginRight: '10px'}}>
            {formatDateRange()}
          </MDTypography>
          <CalendarTodayIcon sx={{color: '#006E90'}} />
        </MDBox>
      </Grid>

      {open && (
        <div
          style={{
            gap: 5,
            position: 'absolute',
            right: '200px',
            zIndex: 999,
            backgroundColor: '#fff',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            padding: '15px',
            width: '200px',
            marginTop: '8px',
          }}
        >
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => handleDateChange(newValue, endDate)}
            renderInput={(params) => <input {...params} />}
            sx={{ mb: 2 }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => handleDateChange(startDate, newValue)}
            renderInput={(params) => <input {...params} />}
          />
          {error && <div style={{ color: 'red', marginTop: '10px', fontSize:'12px' }}>{error}</div>}
        </div>
      )}
    </LocalizationProvider>
  );
};

export default DateBar;
