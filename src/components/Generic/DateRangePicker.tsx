import React, { useState } from "react";
import { DateRange } from "react-date-range";
import type { DateRangeProps, Range } from "react-date-range";
import { format } from "date-fns";
import {
  TextField,
  Popper,
  Paper,
  ClickAwayListener,
  InputAdornment,
  styled,
} from "@mui/material";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangeIcon } from "@mui/x-date-pickers";

type Props = {
  onDateChange: (startDate: Date, endDate: Date) => void;
  enable: boolean;
};

const DateRangeSelector: React.FC<Props> = ({ onDateChange, enable }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [range, setRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setRange(ranges.selection);
    setOpen(false);
    if (startDate && endDate) {
      onDateChange(startDate, endDate);
    }
  };

  const displayValue = `${format(
    range.startDate ?? new Date(),
    "yyyy-MM-dd"
  )} to ${format(range.endDate ?? new Date(), "yyyy-MM-dd")}`;

  const StyledDateRange = styled(DateRange, {
    shouldForwardProp: (prop: any) => prop !== "primary", // Don't pass to DOM
  })<DateRangeProps>(({ theme }) => ({
    //selected dates
    ".rdrSelected, .rdrInRange, .rdrStartEdge, .rdrEndEdge": {
      backgroundColor: theme.palette.primary.main,
    },

    // underlined current day
    ".rdrDayToday .rdrDayNumber span:after": {
      backgroundColor: theme.palette.primary.main,
    },

    //background for start date and end date
    ".rdrDateDisplayWrapper": {
      backgroundColor: theme.palette.primary.contrastText,
    },

    //highlighted border for display start date or end date
    ".rdrDateDisplayItemActive": {
      borderColor: theme.palette.primary.main,
    },

    //hover per day transparent, and border color only
    ".rdrDayStartPreview, .rdrDayInPreview, .rdrDayEndPreview": {
      borderColor: theme.palette.primary.main,
    },

    " .rdrNextPrevButton": {
      background: theme.palette.primary.contrastText,
    },
  }));

  return (
    <>
      <TextField
        label="Select Date Range"
        value={displayValue}
        onClick={handleClick}
        slotProps={{
          htmlInput: {
            readOnly: true,
            sx: { cursor: "pointer", width: "200px" },
          },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <DateRangeIcon />
              </InputAdornment>
            ),
          },
        }}
        disabled={!enable}
        size="small"
      />

      <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper elevation={4}>
            <StyledDateRange
              ranges={[range]}
              onChange={handleSelect}
              moveRangeOnFirstSelection={false}
              editableDateInputs={true}
              months={1}
              direction="horizontal"
            />
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export default DateRangeSelector;
