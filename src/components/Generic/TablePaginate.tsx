import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  LinearProgress,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  InputLabel,
  Typography,
  Stack,
  styled,
  type TableCellProps,
  Checkbox,
} from "@mui/material";

import { observer } from "mobx-react";
import React, { useEffect, useState, type ReactNode } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { red } from "@mui/material/colors";
import axiosClient from "../../services/axiosClient";
import DeleteModalConfirmation from "./DeleteModalConfirmation";
import DateRangeSelector from "./DateRangePicker";
import dayjs from "dayjs";
import {
  ExitToApp,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";

export interface TableColumnsProps {
  label: string;
  field: string;
  minWidth?: number;
  format?: (value: string) => void;
  align?: "right" | "left" | "center" | "inherit" | "justify" | undefined;
  isNested?: boolean;
}

export interface TablePaginateProps {
  children: ReactNode;
  model: any;
  customHeaderAction?: ReactNode;
  columns: TableColumnsProps[];
  itemsPerPageOptions: number[];
  apiUrl: string;
  actionButtons?: (item: any) => void | ReactNode;
  primaryKey: string;
  itemsPerPageDefault: number;
  exportable: boolean;
  reload?: boolean;
}

const TablePaginate = ({
  children,
  model,
  columns,
  itemsPerPageOptions = [5, 25, 50],
  apiUrl,
  actionButtons,
  primaryKey,
  itemsPerPageDefault = 10,
  exportable = true,
  reload,
}: TablePaginateProps) => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(itemsPerPageDefault);
  const [loadingData, setLoadingData] = React.useState(false);
  const [searchKeyword, setSearchKeyword] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  let dataFetchTimeout = 500;

  const [selectedDateRange, setSelectedRange] = useState({
    start: new Date(),
    end: new Date(),
  });

  const handleDateChange = (start: Date, end: Date) => {
    setSelectedRange({
      start: start,
      end: end,
    });
  };

  const [filterByDateRange, setFilterByDateRange] = useState(false);

  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);

  const handleChangeDateCheckbox = () => {
    setFilterByDateRange((prev) => !prev);
  };

  const fetchItems = async (page = 1) => {
    setLoadingData(true);

    try {
      let url = `${apiUrl}?page=${page}&per_page=${rowsPerPage}&searchKeyword=${searchKeyword}`;

      if (filterByDateRange) {
        let start = dayjs(selectedDateRange.start).format(
          "YYYY-MM-DD 00:00:00"
        );
        let end = dayjs(selectedDateRange.end).format("YYYY-MM-DD 23:59:59");
        url = `${url}&date_from=${start}&date_to=${end}`;
      }

      const response = await axiosClient.get(url);
      const data = await response.data;

      let fromCount = data.meta.from;
      var res: any = [...data.data];
      if (res.length) {
        res.map((obj: any) => (obj.count = fromCount++));
      }

      if (data.meta.current_page > data.meta.last_page) {
        const lastValidPage = Math.max(data.meta.last_page - 1, 0);
        setPage(0);
        fetchItems(lastValidPage);
        return;
      }

      setFrom(data.meta.from);
      setTo(data.meta.to);
      setTimeout(() => {
        setTimeout(() => {
          setLoadingData(false);
          setItems(res);
          setTotalItems(data.meta.total);
          setLoadingData(false);
        }, dataFetchTimeout);
      }, 800);
    } catch (error) {
      setLoadingData(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchItems(currentPage + 1);
  }, [currentPage, page, rowsPerPage, reload]);

  const handlePageChange = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(event.target.value);
    setCurrentPage(0);
    setPage(0);
  };

  const getNestedValue = (item: any, path: any) => {
    return path.split("?.").reduce((acc: any, part: any) => acc?.[part], item);
  };

  const deleteRow = () => {
    try {
      axiosClient
        .delete(`${apiUrl}/${selectedItem.id ?? selectedItem[primaryKey]}`)
        .then(() => {
          handleClose();
          setSelectedItem(null);
          fetchItems();
        })
        .catch((error) => {
          console.log(error);
          if (error.status === 422) {
            handleClose();
            setSelectedItem(null);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("debounce");
    }, 800);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const handleSearchChange = (e: any) => {
    setSearchKeyword(e.target.value);
  };

  const handleClearKeyword = () => {
    setSearchKeyword("");
  };

  const StyledTableCell = styled(TableCell, {
    shouldForwardProp: (prop) => prop !== "primary",
  })<TableCellProps>(() => ({ padding: "1px" }));

  useEffect(() => {}, [selectedDateRange]);

  async function requestExportToXLS() {
    try {
      const response = await axiosClient.get("/export-clearance", {
        responseType: "blob",
        params: {
          start_date: filterByDateRange ? selectedDateRange.start : null,
          end_date: filterByDateRange ? selectedDateRange.end : null,
          searchKeyWord: searchKeyword,
        },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const currentDate = dayjs();
      const formattedDate = currentDate.format("YYYY-MM-DD-HH-mm-a");

      let filename = `tagcom_clearance_${formattedDate}.xlsx`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  }

  return (
    <Box margin={10} marginTop={0}>
      {model?.label && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>{model?.label ?? ""}</h1>
        </div>
      )}
      <Box flexDirection={"column"}>
        <Stack className="main-tableheader-actions" direction={"row"}>
          <Box flex={1}>
            <Stack direction="row" className="left-table-actions">
              <Box flex={1} alignContent={"center"} textAlign={"left"}>
                {exportable && (
                  <Box>
                    <Stack direction="row">
                      <Button
                        variant="outlined"
                        startIcon={<ExitToApp />}
                        size="large"
                        sx={{ mb: 1 }}
                        onClick={requestExportToXLS}
                      >
                        Export to XLSX
                      </Button>
                    </Stack>
                  </Box>
                )}
              </Box>
            </Stack>
          </Box>
          <Box flex={1}>
            <Stack direction={"row"} className="right-table-actions">
              <DateRangeSelector
                onDateChange={handleDateChange}
                enable={filterByDateRange}
              />
              <Checkbox
                checked={filterByDateRange}
                onChange={handleChangeDateCheckbox}
              />
              <FormControl sx={{ width: "400px" }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Search
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  }
                  size="small"
                  endAdornment={
                    <InputAdornment position="start">
                      <IconButton
                        aria-label={"clear search"}
                        onClick={handleClearKeyword}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  value={searchKeyword}
                  label="Amount"
                  onChange={handleSearchChange}
                />
              </FormControl>
              <Button
                variant="outlined"
                onClick={() => fetchItems()}
                size="medium"
                sx={{ ml: 1 }}
              >
                Search
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <div className="card animated fadeInDown">
        <TableContainer
          sx={{
            height: "calc(70vh - 64px)",
            borderColor: "divider",
            borderWidth: 1,
            borderStyle: "solid",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: "50px" }} />
                {columns?.map((column: TableColumnsProps, index: number) => (
                  <TableCell
                    key={index}
                    align={column.align ?? "left"}
                    style={{
                      minWidth: column.minWidth,
                      width: column.minWidth ? column.minWidth : "20px",
                      wordBreak: "break-word",
                      padding: "5px",
                    }}
                  >
                    <Typography fontWeight={"bold"}>{column.label}</Typography>
                  </TableCell>
                ))}
                <StyledTableCell width={"500px"}>
                  <Typography fontWeight={"bold"}>Action</Typography>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingData ? (
                <TableRow>
                  <StyledTableCell colSpan={columns.length + 2}>
                    <LinearProgress />
                  </StyledTableCell>
                </TableRow>
              ) : items.length ? (
                items.map((item: any, index) => (
                  <TableRow key={index}>
                    <StyledTableCell
                      sx={{ minWidth: "50px", textAlign: "center" }}
                    >
                      {item?.count}
                    </StyledTableCell>
                    {columns.map((col: TableColumnsProps, colIndex) => {
                      const value = col.isNested
                        ? getNestedValue(item, col.field)
                        : col.format
                        ? col.format(item[col.field])
                        : item[col.field];
                      return (
                        <StyledTableCell key={colIndex}>
                          {value}
                        </StyledTableCell>
                      );
                    })}
                    <TableCell>
                      <Stack direction={"row"}>
                        {actionButtons ? <>{actionButtons(item)}</> : null}
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setSelectedItem(item);
                            setOpen(true);
                          }}
                          sx={{ margin: 1 }}
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <StyledTableCell
                    colSpan={columns.length + 2}
                    style={{ textAlign: "center" }}
                  >
                    No records to be displayed.
                  </StyledTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Material UI Pagination */}
        <TablePagination
          rowsPerPageOptions={itemsPerPageOptions}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={() => `${from}–${to} of ${totalItems}`}
          ActionsComponent={CustomTablePaginationActions}
        />
      </div>
      <DeleteModalConfirmation
        open={open}
        handleClose={() => {
          handleClose();
          setSelectedItem(null);
        }}
        setOpen={setOpen}
        handleOpen={handleOpen}
        model={model}
        selectedItem={selectedItem}
      >
        <Box mb={3}>{children}</Box>
        <Box textAlign={"center"}>
          <Button
            onClick={() => {
              handleClose();
              setSelectedItem(null);
            }}
            variant="outlined"
            startIcon={<CancelOutlinedIcon />}
            style={{ marginRight: 10 }}
          >
            Cancel
          </Button>
          <Button
            onClick={deleteRow}
            startIcon={<DeleteOutlineIcon />}
            style={{
              backgroundColor: red[800],
              color: "white",
            }}
          >
            Delete this {model.labelSingular}
          </Button>
        </Box>
      </DeleteModalConfirmation>
    </Box>
  );
};

export default observer(TablePaginate);

const CustomTablePaginationActions = (props: {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}) => {
  const { count, page, rowsPerPage, onPageChange } = props;
  const totalPages = Math.ceil(count / rowsPerPage);

  const handleBack = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2 }}>
      <IconButton onClick={handleBack} disabled={page === 0}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={handleNext} disabled={page >= totalPages - 1}>
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
};
