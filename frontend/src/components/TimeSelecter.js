import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export const TimeSelecter = ({ val, idx, sch, setSch }) => {
  const [startValue, setStartValue] = useState(val.from);
  const [endValue, setEndValue] = useState(val.to);

  return (
    <div className="flex grid grid-flow-col gap-1">
      <div className="flex items-center justify-start p-4 rounded-md ">
        <LocalizationProvider className="" dateAdapter={AdapterDateFns}>
          <TimePicker
            disabled={idx == 0}
            label="Start Time"
            value={startValue}
            onChange={(newValue) => {
              setSch([
                ...sch.slice(0, idx),
                { ...sch[idx], from: newValue.toLocaleString() },
                ...sch.slice(idx + 1),
              ]);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
      <div className="flex items-center justify-start p-4 rounded-md ">
        <LocalizationProvider className="" dateAdapter={AdapterDateFns}>
          <TimePicker
            disabled={idx == 4}
            label="End Time"
            value={endValue}
            onChange={(newValue) => {
              setSch([
                ...sch.slice(0, idx),
                { ...sch[idx], to: newValue },
                { ...sch[idx + 1], from: newValue },
                ...sch.slice(idx + 2),
              ]);
              console.log(sch);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
      <div className="flex items-center justify-start p-4 rounded-md ">
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">
            Intensity
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={sch[idx].i}
            label="Intensity"
            onChange={(e) =>
              setSch([
                ...sch.slice(0, idx),
                { ...sch[idx], i: e.target.value },
                ...sch.slice(idx + 1),
              ])
            }
          >
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={75}>75</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
        {/* <IntensitySelecter /> */}
      </div>
    </div>
  );
};
