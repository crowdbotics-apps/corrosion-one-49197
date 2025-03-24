import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import MDBox from "../../../../components/MDBox";
import DataTableBodyCell from "../../../../components/AdminLayout/DataTableBodyCell";
import { EmptyResponseDatatable } from "../../../../components/AdminLayout/EmptyResponseDatatable";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import MDButton from "../../../../components/MDButton";
import { useNavigate } from "react-router-dom";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import MDTypography from "@mui/material/Typography";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';

function DataTable({
                     table,
                     noEndBorder,
                     searchFunc,
                     searchQuery = "",
                     showRecords = true,
                     currentPage,
                     selectedProject = null,
                     loading = true,
                     emptyLabelText = "No items found",
                     loadingText = "",
                   }) {
  const [orderedColumn, setOrderedColumn] = useState();
  const navigate = useNavigate();
  const columns = useMemo(() => table.columns, [table]);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const data = useMemo(() => table.rows, [table]);
  const [sortedByColumn, setSortedByColumn] = useState({ column: "", order: "none" });

  const handleIconClick = () => {
    const data = { someKey: true };
    navigate("/my-jobs", { state: data });
  };


  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize:  3 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    rows = [],
    page,
  } = tableInstance;


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

  const getButtonStyles = () => ({
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingRight: '8px',
    paddingLeft: '8px',
    borderRadius: '12px',
    fontSize: '15px',
    width: { md: '120px' },
  });

  const getButtonStylesS = () => ({
    borderRadius: '24px',
    width: '180px',
    fontSize: '14px',
    padding: '10px 20px',
  });


  useEffect(() => {
    if (onColumnOrdering) {
      onColumnOrdering(sortedByColumn);
    }
  }, [onColumnOrdering, sortedByColumn]);


  const handleCloseModal = () => {
    setOpenRejectModal(false);
  };


  return (
    <Grid flex={1} display="flex" direction="column" gap={2} xs={12} sx={{width:'100%',flexDirection: 'column', justifyContent: 'space-between'}}>

        <Card sx={{ p: 2, border: '1px solid #FB8C00', display:"flex", flex:1, justifyContent: "space-between", alignItems: "flex-start", flexDirection: {xs:'column', md:'row'}, borderRadius:'12px' }}>
          <Grid>
            <MDTypography sx={{fontSize:'20px', fontWeight: 'bold'}}>
              Missing
            </MDTypography>
            <MDTypography sx={{fontSize:'20px', fontWeight: 'bold'}}>
              certifications
            </MDTypography>
            <MDTypography sx={{fontSize:'14px', color:'#7B809A'}}>
              Your profile is incomplete. Complete your information to access more opportunities
            </MDTypography>
          </Grid>
          <Grid padding="20px">
          <MDButton  variant="outlined" color={'warning'} sx={getButtonStylesS}>Manage Credentials</MDButton>
          </Grid>
        </Card>


      <Card sx={{ p: 2, border: '1px solid #FB8C00', display:"flex", justifyContent: "space-between", alignItems: "flex-start",  flexDirection: {xs:'column', md:'row'}, borderRadius:'12px' }}>
        <MDBox>
          <MDTypography sx={{fontSize:'20px', fontWeight: 'bold'}}>
            Location not selected
          </MDTypography>
          <MDTypography sx={{fontSize:'14px',  color:'#7B809A'}}>
            You haven't selected a location. You must choose one to complete your profile
          </MDTypography>
        </MDBox>
        <Grid padding="20px">
          <MDButton variant="outlined" color={'warning'} sx={getButtonStylesS}>Location Preference</MDButton>
        </Grid>
      </Card>

      <Card container spacing={2} >
        <Grid display={'flex'} padding={'30px'} md={12} xs={4}>
          <TableContainer sx={{ boxShadow: "none"}}>
            <Grid spacing={2}>
              <MDTypography sx={{fontWeight: 'bold', padding:'10px'}}>Recent Activities</MDTypography>
              <Grid item container display={'flex'} rowGap={2} justifyContent={'space-between'} alignItems={'flex-start'} padding={'20px'} borderTop={'2px solid #e0e0e0'} borderBottom={'2px solid #e0e0e0'}>
                <Grid
                  sm={5}
                  xs={12}
                  sx={{
                    height: '110px',
                    border: '1px solid #D3D3D3',
                    borderRadius: '12px',
                    position: 'relative',
                  }}
                >
                  <Grid xs={12} >
                    <MDTypography sx={{ fontWeight: 'bold', marginLeft: '10px', fontSize: '20px' }}>
                      Applied Jobs
                    </MDTypography>
                    <Grid item xs={8} zeroMinWidth>
                      <MDTypography noWrap sx={{ fontWeight: 'bold', marginLeft: '10px', fontSize: '40px', marginTop: '10px' }}>
                        45
                      </MDTypography>
                    </Grid>
                    <MDBox sx={{ position: 'absolute', top: '30px', right: '10px', }}>
                      <WorkOutlineOutlinedIcon sx={{ width: '60px', height: '60px', color: '#006E90' }} />
                    </MDBox>
                  </Grid>
                </Grid>
                <Grid
                  sm={5}
                  xs={12}
                  sx={{
                    height: '110px',
                    border: '1px solid #D3D3D3',
                    borderRadius: '12px',
                    position: 'relative',
                  }}
                >
                  <Grid >
                    <MDTypography sx={{ fontWeight: 'bold', marginLeft: '10px', fontSize: '20px' }}>
                      Jobs Alerts
                    </MDTypography>
                    <Grid item xs={8} zeroMinWidth>
                      <MDTypography noWrap sx={{ fontWeight: 'bold', marginLeft: '10px', fontSize: '40px', marginTop: '10px' }}>
                        27
                      </MDTypography>
                    </Grid>
                    <MDBox sx={{ position: 'absolute', top: '30px', right: '10px', }}>
                      <NotificationsActiveOutlinedIcon sx={{ width: '60px', height: '60px', color: '#006E90' }} />
                    </MDBox>
                  </Grid>

                </Grid>
              </Grid>

              <Grid display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'} sx={{flexDirection: {xs:'column', md:'row'}}}>
                <MDTypography sx={{fontWeight: 'bold', padding:'10px'}}>Recent Bids</MDTypography>
                <MDBox sx={{ padding: '10px', display: 'flex', gap: '20px', flexDirection: {xs:'column', md:'row'} }}>
                  <MDButton variant={'contained'} color={'secondary'} sx={{ borderRadius: '24px', width: '180px', fontSize: '14px' }}>All</MDButton>
                  <MDButton  variant={'outlined'} color={'dark'} sx={getButtonStylesS ()}>Favorite</MDButton>
                </MDBox>
              </Grid>
            </Grid>

          <Table {...getTableProps()}>
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
                        status={row.status}
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
                              marginLeft: {md:'-100px', xs:'-10px'},
                              display: 'flex',
                              flexDirection: { xs: 'column', md: 'row' },
                            }}
                          >
                            <MDBox sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2,  width: { xs: '150px', md: '300px' } }}>
                              <MDButton variant="text" color={'secondary'}>
                                <BookmarkOutlinedIcon />
                              </MDButton>
                              <MDButton variant="outlined" color={'secondary'} sx={getButtonStyles}>View Details</MDButton>
                            </MDBox>
                          </MDBox>
                        )}
                      </DataTableBodyCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>

        <MDBox sx={{ display: "flex",justifyContent: "center"}}>
          <MDButton
            variant="outlined"
            color="secondary"
            onClick={handleIconClick}
          >
            More
          </MDButton>
        </MDBox>
      </TableContainer>
    </Grid>
    </Card>
    </Grid>
  );
}

DataTable.defaultProps = {
  entriesPerPage: [6, 25, 50, 100],
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
