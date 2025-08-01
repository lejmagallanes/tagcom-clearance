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
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { observer } from "mobx-react";
import React, { useEffect, useState, type ReactNode } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { red } from "@mui/material/colors";
import axiosClient from "../../services/axiosClient";
import DeleteModalConfirmation from "./DeleteModalConfirmation";

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
  itemsPerPage: number;
  apiUrl: string;
  actionButtons?: ReactNode;
  primaryKey: string;
}

const TablePaginate = ({
  children,
  model,
  customHeaderAction,
  columns,
  itemsPerPage = 10,
  apiUrl,
  actionButtons,
  primaryKey,
}: TablePaginateProps) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [_, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loadingData, setLoadingData] = React.useState(false);
  const [searchKeyword, setSearchKeyword] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  let dataFetchTimeout = 500;

  const [debouncedQuery, setDebouncedQuery] = useState(""); // Store the debounced query

  const fetchItems = async (page = 1) => {
    setLoadingData(true);
    try {
      const response = await axiosClient.get(
        `${apiUrl}?page=${page}&per_page=${rowsPerPage}&searchKeyword=${searchKeyword}`
      );
      const data = await response.data;

      let fromCount = data.meta.from;

      var res: any = [...data.data];

      if (res.length) {
        res.map((obj: any) => (obj.count = fromCount++));
      }

      // Simulate fetching data (replace with actual API call)
      setTimeout(() => {
        // If data is fetched quickly, we wait 2 seconds before setting loading to false
        setTimeout(() => {
          setLoadingData(false);
          setItems(res); // Data for the current page
          setPageCount(data.last_page); // Total number of pages
          setTotalItems(data.meta.total); // Total number of items
          setLoadingData(false);
        }, dataFetchTimeout); // Delay 2 seconds before setting loading to false

        // If data takes longer, we don't clear the timeout above but let it finish
      }, 800);
    } catch (error) {
      setLoadingData(false);
      console.error("Error fetching data:", error);
    }
  };

  // Effect to fetch data when the component mounts or when the page changes
  useEffect(() => {
    if (debouncedQuery) {
      setCurrentPage(0);
      fetchItems(1);
    } else {
      fetchItems(currentPage + 1);
    }

    // +1 because Laravel pages are 1-indexed
  }, [currentPage, page, rowsPerPage, debouncedQuery]);

  // Handle page change (pagination)
  const handlePageChange = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setCurrentPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(event.target.value);
    setPage(0); // Reset to first page when rows per page change
  };

  // Utility function to get nested field value
  const getNestedValue = (item: any, path: any) => {
    return path.split("?.").reduce((acc: any, part: any) => acc?.[part], item);
  };

  const deleteRow = () => {
    // open delete modal for confirmation
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
      setDebouncedQuery(searchKeyword); // Set the debounced query after the timeout
    }, 800); // 500ms debounce delay

    // Cleanup the previous timeout if the query changes before the debounce time
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // Only run when debouncedQuery changes
  // Handle the input change event
  const handleSearchChange = (e: any) => {
    setSearchKeyword(e.target.value); // Update the query as the user types
  };

  const handleClearKeyword = () => {
    setSearchKeyword("");
  };

  const StyledTableCell = styled(TableCell, {
    shouldForwardProp: (prop) => prop !== "primary",
  })<TableCellProps>(() => ({ padding: "5px" }));

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
      <Box flex={1} flexDirection={"column"}>
        <Stack direction={"row"}>
          <Box flex={1} alignContent={"center"} textAlign={"left"}>
            {customHeaderAction}
          </Box>
          <Box>
            <FormControl sx={{ mb: 1, width: "400px" }}>
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
          <Table stickyHeader aria-label="sticky table">
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
                <StyledTableCell>
                  <Typography fontWeight={"bold"}>Action</Typography>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingData ? (
                <TableRow>
                  <StyledTableCell colSpan={columns.length}>
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
                    {actionButtons ?? (
                      <StyledTableCell>
                        <Box flexDirection={"row"} display={"flex"}>
                          <Button
                            variant="outlined"
                            onClick={() =>
                              navigate(
                                `${model.route}/${item.id ?? item[primaryKey]}`
                              )
                            }
                            startIcon={<EditIcon />}
                            style={{
                              marginRight: 3,
                              marginLeft: 3,
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setSelectedItem(item);
                              setOpen(true);
                            }}
                            startIcon={<DeleteIcon />}
                            style={{
                              marginRight: 3,
                              marginLeft: 3,
                            }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </StyledTableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <StyledTableCell
                    colSpan={columns.length}
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
          rowsPerPageOptions={[itemsPerPage, 25, 50]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleChangeRowsPerPage}
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
