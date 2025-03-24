import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import {
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
} from "@mui/material"
import MDBox from "../../../../components/MDBox";
import DataTableHeadCell from "../../../../components/AdminLayout/DataTableHeadCell";
import DataTAbleBodyCell from "./DataTAbleBodyCell"
import { EmptyResponseDatatable } from "../../../../components/AdminLayout/EmptyResponseDatatable";
import Card from "@mui/material/Card";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Box from "@mui/material/Box";
import Pagination from '@mui/material/Pagination';
import MDTypography from "../../../../components/MDTypography"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MDButton from "../../../../components/MDButton"
import { useNavigate } from 'react-router-dom';
import SearchIcon from "@mui/icons-material/Search"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers" // Importa useNavigate de react-router-dom

function DataTable({
                     table,
                     noEndBorder,
                     searchFunc,
                     searchQuery = "",
                     showHeader = true,
                     showRecords = true,
                     currentPage,
                     selectedProject = null,
                     pageSize = 4,
                     loading = false,
                     emptyLabelText = "No items found",
                     loadingText = "",
                   }) {
  const navigate = useNavigate();
  const [orderedColumn, setOrderedColumn] = useState();
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);
  const [sortedByColumn, setSortedByColumn] = useState({ column: "", order: "none" });
  const [openRejectModal, setOpenRejectModal] = useState(false);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: pageSize },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows = [],
    page,
    gotoPage,
  } = tableInstance;

  const getDataSortedByColumn = (column) => {
    if (column.disableOrdering) {
      return;
    }
    const columnName = column.custom_ordering ? column.custom_ordering : column.id;
    if (sortedByColumn.column !== columnName) {
      setSortedByColumn({ column: columnName, order: "asce" });
    } else if (sortedByColumn.order === "asce") {
      setSortedByColumn({ column: columnName, order: "desc" });
    } else {
      setSortedByColumn({ column: "", order: "none" });
    }
  };

  const setSortedValue = (column) => {
    const sortedColum = { ...orderedColumn };
    if (column.id === sortedColum.column) {
      return sortedColum.order;
    } else {
      return "none";
    }
  };
  const getButtonStyles = () => ({
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingRight: '5px',
    paddingLeft: '5px',
    borderRadius: '12px',
    fontSize: '15px',
    width: {md:'180px', xs:'100px'} ,

  });


  const onColumnOrdering = useCallback(
    (ordering) => {
      const { column, order } = ordering;
      if (column === "") {
        searchFunc?.(searchQuery);
      } else if (order === "asce") {
        searchFunc?.(searchQuery, currentPage, `${column}`);
      } else {
        searchFunc?.(searchQuery, currentPage, `-${column}`);
      }
      setOrderedColumn(ordering);
    },
    [currentPage, searchFunc, searchQuery]
  );

  useEffect(() => {
    if (onColumnOrdering) {
      onColumnOrdering(sortedByColumn);
    }
  }, [onColumnOrdering, sortedByColumn]);

  const handlePageChange = (event, newPage) => {
    gotoPage(newPage - 1);
  };

  const handleReject = () => {
    setOpenRejectModal(true);
  };

  const handleCloseModal = () => {
    setOpenRejectModal(false);
  };

  const handleConfirmReject = () => {
    setOpenRejectModal(false);
    navigate("/dashboard");
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  const formatDateRange = () => {
    if (!startDate || !endDate) return 'Select Dates';
    return `${startDate.format('MMM DD')} - ${endDate.format('MMM DD')}`;
  };

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

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Card sx={{ display: "flex", flex: 1, border: `none`, backgroundColor: "white" }}>
      <TableContainer sx={{ boxShadow: "none", backgroundColor: "white" }}>
        <MDBox sx={{display:"flex", justifyContent: "space-between", alignItems: "flex-start",  flexDirection: {xs:'column', md:'row'}}}>
          <MDBox sx={{padding:'10px'}}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: '12px',
                },
              }}
              placeholder="Search and Filter"
              sx={{
                width: '300px',
                '& .MuiInputBase-input': {
                  height: '40px',
                  fontSize: '18px',
                },
              }}
            />

          </MDBox>
          <LocalizationProvider dateAdapter={AdapterMoment}>
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
              onClick={handleClick}
            >
              <MDTypography sx={{ fontSize: '16px', marginRight: '10px' }}>
                {formatDateRange()}
              </MDTypography>
              <CalendarTodayIcon sx={{ color: '#006E90' }} />
            </MDBox>

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
                  width: '200PX',
                  marginTop: '8px',
                }}
              >
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => handleDateChange(newValue, endDate)}
                  renderInput={(params) => <input {...params} />}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => handleDateChange(startDate, newValue)}
                  renderInput={(params) => <input {...params} />}
                />
                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
              </div>
            )}
          </LocalizationProvider>

        </MDBox>

        <Table {...getTableProps()}>
          {showHeader && (
            <MDBox key={`tablehead__1`} component="thead">
              {headerGroups.map((headerGroup, idx) => (
                <TableRow key={`tablerow__${idx}`} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, idx3) => {
                    return (
                      <DataTableHeadCell
                        key={`tablecell__${idx3}`}
                        onClick={() => getDataSortedByColumn(column)}
                        width={column.width ? column.width : "50px"}
                        align={column.align ? column.align : "left"}
                        sorted={setSortedValue(column)}
                        disableOrdering={column?.disableOrdering}
                      >
                        {column.render("Header")}
                      </DataTableHeadCell>
                    );
                  })}
                </TableRow>
              ))}
            </MDBox>
          )}

          {showRecords && (
            <TableBody key={`tablebody__2`} {...getTableBodyProps()}>
              {page.map((row, key) => {
                prepareRow(row);
                return (
                  <TableRow
                    key={`tablerow2__${key}`}
                    {...row.getRowProps()}
                    sx={{ cursor: "pointer" }}
                  >
                    {row.cells.map((cell, idx2) => (
                      <DataTAbleBodyCell
                        key={`tablecell__${idx2}`}
                        gender={row.original.gender}
                        selected={row.original.id === selectedProject?.id}
                        noBorder={noEndBorder && rows.length - 1 === key}
                        width={cell.column.width}
                        align={cell.column.align ? cell.column.align : "left"}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}

                        {idx2 === row.cells.length - 1 && (
                          <MDBox
                            sx={{
                              marginLeft: {md:'-60px', xs:'-10px'},
                              display: 'flex',
                              width: {md:'210px', xs:'100px'},
                              flexDirection: { xs: 'column', md: 'row' },
                              gap: '8px',
                            }}
                          >
                            <MDButton variant="outlined" color={'secondary'} sx={getButtonStyles()}>View Details</MDButton>
                            <MDButton variant="outlined" color={'error'} sx={getButtonStyles()} onClick={handleReject}>Rejected</MDButton>
                          </MDBox>
                        )}

                      </DataTAbleBodyCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          )}

          {rows?.length === 0 && (
            <EmptyResponseDatatable
              loadingText={loadingText}
              loading={loading}
              text={emptyLabelText}
              colSpan={table.columns.length}
            />
          )}
        </Table>

        <Grid item container xs={12} justifyContent="center" style={{ padding: '2rem' }}>
          <Pagination
            size="large"
            count={rows.length / 4}
            variant="outlined"
            color="secondary"
            page={currentPage}
            onChange={handlePageChange}
          />
        </Grid>
      </TableContainer>

      <Dialog open={openRejectModal} onClose={handleCloseModal}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to close?</p>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexGrow: 1 }}>
            <MDButton
              variant="outlined"
              color={'secondary'}
              onClick={handleCloseModal}
            >
              Cancel
            </MDButton>
          </Box>
          <MDButton
            variant="contained"
            onClick={handleCloseModal}
            color={'error'}
          >
            Reject
          </MDButton>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default DataTable;
