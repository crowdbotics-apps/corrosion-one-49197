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
import {useEffect, useMemo, useState} from "react";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
// react-table components
import {useGlobalFilter, usePagination, useSortBy, useTable} from "react-table";
// @mui material components
import {Grid, Table, TableBody, TableContainer, TableRow} from "@mui/material";
// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
// Material Dashboard 2 PRO React examples
import DataTableHeadCell from "./DataTableHeadCell";
import DataTableBodyCell from "./DataTableBodyCell";
import Pagination from "./Pagination/Pagination";
import {EmptyResponseDatatable} from "./EmptyResponseDatatable";
import Card from "@mui/material/Card";

function DataTable(
  {
    entriesPerPage = [10, 25, 50, 100],
    table,
    searchFunc,
    searchQuery = '',
    showHeader = true,
    showRecords = true,
    currentPage,
    setSelectedProject = () => {
    },
    numberOfItems,
    numberOfItemsPage,
    pageSize = 10,
    onPageChange,
    showTotalEntries = true,
    loading = false,
    emptyLabelText = 'No items found',
    loadingText = ''
  }
) {
  // const rootStore = useStores()
  // const {projectStore} = rootStore
  const [orderedColumn, setOrderedColumn] = useState()
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);
  const [sortedByColumn, setSortedByColumn] = useState({column: '', order: 'none'})
  const tableInstance = useTable(
    {columns, data, initialState: {pageIndex: 0, pageSize: entriesPerPage.sort((a, b) => a - b).slice(-1)}},
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
      return
    }
    const columnName = column.custom_ordering ? column.custom_ordering : column.id
    if (sortedByColumn.column !== columnName) {
      setSortedByColumn({column: columnName, order: 'asce'})
    } else if (sortedByColumn.order === 'asce') {
      setSortedByColumn({column: columnName, order: 'desc'})
    } else {
      setSortedByColumn({column: '', order: 'none'})
    }
  }

  const setSortedValue = (column) => {
    const sortedColum = {...orderedColumn}
    if (column.id === sortedColum.column) {
      return sortedColum.order;
    } else {
      return 'none'
    }
  };

  const onColumnOrdering = (ordering) => {
    const {column, order} = ordering
    if (column === '') {
      searchFunc(searchQuery, currentPage, column)
    } else if (order === 'asce') {
      searchFunc(searchQuery, currentPage, `${column}`)
    } else {
      searchFunc(searchQuery, currentPage, `-${column}`)
    }
    setOrderedColumn(ordering)
  }

  const handleRowSelected = (row) => {
    setSelectedProject(() => {
      // if (projectStore.id === row.original.id) {
      //   projectStore.reset()
      //   return null
      // } else {
      //   projectStore.setData(row.original)
      return row.original
      // }
    })
  }

  useEffect(() => {
    if (onColumnOrdering) {
      onColumnOrdering(sortedByColumn)
    }

  }, [sortedByColumn])

  return (
    <MDBox>
      <TableContainer sx={{boxShadow: "none"}}>
        <Table {...getTableProps()}>
          {showHeader && (<MDBox key={`tablehead__1`} component="thead">
            {headerGroups.map((headerGroup, idx) => {
              const headerGroupProps = headerGroup.getHeaderGroupProps();
              // separate out the 'key' so we don't spread it
              const {key: headerGroupKey, ...restHeaderGroupProps} = headerGroupProps;
              return (
                <TableRow key={headerGroupKey} {...restHeaderGroupProps}>
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
                    )
                  })}
                </TableRow>
              )
            })}
          </MDBox>)}
          {showRecords && <TableBody key={`tablebody__2`} {...getTableBodyProps()}>
            {page.map((row, key) => {
              prepareRow(row);
// get the row props object
              const rowProps = row.getRowProps();
// separate out the "key" so we don’t spread it
              const {key: rowKey, ...restRowProps} = rowProps;
              return (
                <TableRow key={rowKey} {...restRowProps} sx={{cursor: 'pointer'}}
                          onClick={() => handleRowSelected(row)}>
                  {row.cells.map((cell) => {
                    const cellProps = cell.getCellProps();
                    const {key: cellKey, ...restCellProps} = cellProps;

                    return (
                      <DataTableBodyCell odd={key % 2 === 0} key={cellKey} {...restCellProps}>
                        {cell.render("Cell")}
                      </DataTableBodyCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>}
          {rows?.length === 0 &&
            <EmptyResponseDatatable loadingText={loadingText} loading={loading} text={emptyLabelText}
                                    colSpan={table.columns.length}/>}
        </Table>
      </TableContainer>
      {showTotalEntries && rows?.length > 0 && <Grid container mt={5}>
        <Grid item>
          <MDBox m={2} sx={{color: '#666666', fontSize: 17, width: 300}}>Showing <span
            style={{color: '#000000'}}>{numberOfItemsPage}</span> from <span
            style={{color: '#000000'}}>{numberOfItems}</span> data</MDBox>
        </Grid>
        <Grid item ml={'auto'}>
          <Pagination
            currentPage={currentPage}
            totalCount={numberOfItems}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </Grid>
      </Grid>}
    </MDBox>
  );
}


// Typechecking props for the DataTable
DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.bool,
  ]),
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
