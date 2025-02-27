/**
 =========================================================
 * Material Dashboard 2 PRO React - v2.1.0
 =========================================================
 * Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)
 Coded by www.creative-tim.com
 =========================================================
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
// react-table components
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
// @mui material components
import { Grid, Table, TableBody, TableContainer, TableRow, TextField } from "@mui/material"
// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
// Material Dashboard 2 PRO React examples
import DataTableHeadCell from "./DataTableHeadCell";
import DataTableBodyCell from "./DataTableBodyCell";

import { EmptyResponseDatatable } from "./EmptyResponseDatatable";
import Card from "@mui/material/Card";
import  {PaginationCustom} from "./PaginationCustom";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Box from "@mui/material/Box"

function DataTable({
                     entriesPerPage,
                     table,
                     noEndBorder,
                     searchFunc,
                     searchQuery = "",
                     showHeader = true,
                     showRecords = true,
                     currentPage,
                     setSelectedProject = () => {},
                     selectedProject = null,
                     start,
                     end,
                     numberOfItems,
                     setPageSize,
                     pageSize = 10,
                     onPageChange,
                     showTotalEntries = true,
                     loading = false,
                     emptyLabelText = "No items found",
                     loadingText = "",
                   }) {
  // const rootStore = useStores()
  // const {projectStore} = rootStore
  const [orderedColumn, setOrderedColumn] = useState();
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);
  const [sortedByColumn, setSortedByColumn] = useState({ column: "", order: "none" });
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: entriesPerPage.sort((a, b) => a - b).slice(-1) },
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

  return (
    <Card sx={{ display: "flex", flex: 1, border: `none`, backgroundColor: "white" }}>
      <TableContainer sx={{ boxShadow: "none", backgroundColor: "white" }}>
        <MDBox>
          <TextField
            label={
              <Box display="flex" alignItems="center" sx={{ padding: '2.5rem' , fontSize:'20px'}}>
                <SearchOutlinedIcon sx={{ marginRight: 1 }} />
                <span>Search and Filter</span>
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
      </TableContainer>
      {showTotalEntries && rows?.length > 0 && (
        <Grid container mt={"14px"}>
          <Grid item>
            <MDBox mb={{ xs: 3, sm: 0 }}>
              <PaginationCustom
                currentPage={currentPage}
                totalCount={numberOfItems}
                startPage={start}
                endPage={end}
                setPageSize={setPageSize}
                pageSize={pageSize}
                onPageChange={onPageChange}
              />
            </MDBox>
          </Grid>
        </Grid>
      )}
    </Card>
  );
}

// Setting default values for the props of DataTable
DataTable.defaultProps = {
  entriesPerPage: [10, 25, 50, 100],
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
};
// Typechecking props for the DataTable
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
