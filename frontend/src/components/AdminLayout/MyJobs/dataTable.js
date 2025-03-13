import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import { Grid, Table, TableBody, TableContainer, TableRow, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import DataTableHeadCell from "../DataTableHeadCell";
import DataTableBodyCell from "../DataTableBodyCell";
import { EmptyResponseDatatable } from "../EmptyResponseDatatable";
import Card from "@mui/material/Card";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Box from "@mui/material/Box";
import Pagination from '@mui/material/Pagination';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MDTypography from "../../MDTypography"

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

  const [orderedColumn, setOrderedColumn] = useState();
  const currentDate = new Date().toLocaleDateString();
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);
  const [sortedByColumn, setSortedByColumn] = useState({ column: "", order: "none" });
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

  return (
    <Card sx={{ display: "flex", flex: 1, border: `none`, backgroundColor: "white" }}>
      <TableContainer sx={{ boxShadow: "none", backgroundColor: "white" }}>
        <MDBox sx={{display: "flex"}}>
          <MDBox>
            <TextField
              label={
                <Box display="flex" alignItems="center" sx={{ padding: '2.5rem' , fontSize:'20px'}}>
                  <SearchOutlinedIcon sx={{ marginRight: 1 }} />
                  <Box>Search and Filter</Box>
                </Box>
              }
              sx={{
                width: '599px',
                padding: '2rem',
              }}
              InputProps={{
                style: {
                  height: '72px',
                  borderRadius:'12px',
                },
              }}
            />
          </MDBox>

          <MDBox sx={{ marginLeft: '750px' }}>
            <TextField
              label={
                <MDBox display="flex" alignItems="center" sx={{marginTop:'40px', fontSize: '20px', marginLeft:'50px' }}>
                  <MDTypography sx={{fontSize:'16px', marginTop:'3px'}}>Jul 19 - Jul 25</MDTypography>
                  <CalendarTodayIcon sx={{ marginLeft: '10px', color:'#006E90' }} />
                </MDBox>
              }
              sx={{
                width: '250px',
                padding: '2rem',
              }}
              InputProps={{
                style: {
                  height: '72px',
                  borderRadius: '12px',
                },
              }}
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
                      <DataTableBodyCell
                        key={`tablecell__${idx2}`}
                        odd={key % 2 === 0}
                        selected={row.original.id === selectedProject?.id}
                        noBorder={noEndBorder && rows.length - 1 === key}
                        width={cell.column.width}
                        align={cell.column.align ? cell.column.align : "left"}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </DataTableBodyCell>
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
            count={3}
            variant="outlined"
            color="secondary"
            page={currentPage}
            onChange={handlePageChange}
          />
        </Grid>
      </TableContainer>

    </Card>
  );
}

DataTable.defaultProps = {
  entriesPerPage: [4, 25, 50, 100],
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
};

DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.bool]),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
};

export default DataTable;
