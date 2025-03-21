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
import MDBox from "components/MDBox";
import DataTableHeadCell from "../DataTableHeadCell";
import DataTAbleBodyCell from "./DataTAbleBodyCell"
import { EmptyResponseDatatable } from "../EmptyResponseDatatable";
import Card from "@mui/material/Card";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Box from "@mui/material/Box";
import Pagination from '@mui/material/Pagination';
import MDTypography from "../../MDTypography"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MDButton from "../../MDButton"
import { useNavigate } from 'react-router-dom';
import SearchIcon from "@mui/icons-material/Search" // Importa useNavigate de react-router-dom

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
  const getButtonStyles = (color) => ({
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingRight: '5px',
    paddingLeft: '5px',
    borderRadius: '12px',
    borderColor: color,
    color: color,
    fontSize: '15px',
    width: {md:'180px', xs:'100px'} ,
    '&:hover': {
      backgroundColor: 'transparent',
      borderColor: color,
      color: color,
    },
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

  return (
    <Card sx={{ display: "flex", flex: 1, border: `none`, backgroundColor: "white" }}>
      <TableContainer sx={{ boxShadow: "none", backgroundColor: "white" }}>
        <MDBox sx={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
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
          <MDBox>
            <MDBox display="flex" alignItems="center" sx={{ marginTop: '40px', fontSize: '20px', marginLeft: '50px' }}>
              <MDTypography sx={{ fontSize: '16px', marginTop: '3px' }}>Jul 19 - Jul 25</MDTypography>
              <CalendarTodayIcon sx={{ marginLeft: '10px', color: '#006E90' }} />
            </MDBox>
            />
          </MDBox>

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
                            <MDButton variant="outlined" sx={getButtonStyles('#006E90')}>View Details</MDButton>
                            <MDButton variant="outlined" sx={getButtonStyles('#E14640')} onClick={handleReject}>Rejected</MDButton>
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
              onClick={handleCloseModal}
              sx={{
                padding: '2px',
                borderRadius: '10px',
                borderColor: '#006E90',
                color: '#006E90',
                fontSize: '15px',
                width: { md: '90px', xs: '100px' },
                '&:hover': {
                  backgroundColor: 'transparent',
                  borderColor: '#006E90',
                  color: '#006E90',
                },
              }}
            >
              Cancel
            </MDButton>
          </Box>
          <MDButton
            onClick={handleCloseModal}
            color={'secondary'}
            sx={{
              backgroundColor: '#E14640',
              color: 'white',
              '&:hover': { backgroundColor: '#E14640' },
            }}
          >
            Reject
          </MDButton>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default DataTable;
