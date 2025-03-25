import AdminLayout from "../../../components/AdminLayout";
import DataTable from "../../../components/DataTable/index";
import React, { useEffect, useState } from "react";
import { dataTableModel } from "../findJobs/utils";
import { useApi, useLoginStore } from "../../../services/helpers";
import MDBox from "../../../components/MDBox";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Table,
  TableBody,
  TableContainer, TableRow,
} from "@mui/material"
import SearchBar from "../../../components/SearchBar";
import Box from "@mui/material/Box";
import MDButton from "../../../components/MDButton";
import DateBar from "../../../components/DateBar";
import { renderTableRow } from "../findJobs/utils";
import MDAvatar from "../../../components/MDAvatar"
import MDTypography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined"
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined"
import DataTableBodyCell from "../../../components/AdminLayout/DataTableBodyCell"
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined"
import { useNavigate } from "react-router-dom"

function HomeInspector() {
  const loginStore = useLoginStore();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const api = useApi();
  const [datatable, setDatatable] = useState({ ...dataTableModel });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [order, setOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  const [showManageCredentials, setShowManageCredentials] = useState(true);
  const [showLocationPreference, setShowLocationPreference] = useState(true);


  const handleIconClick = () => {
    const data = { someKey: true };
    navigate(`/find-jobs`, { state: data });
  };

  const handleClick = (data) => {
    navigate('/settings', { state: { defaultTab: data} });
  };


  const getButtonStylesS = () => ({
    borderRadius: '24px',
    width: '180px',
    fontSize: '14px',
    padding: '10px 20px',
  });



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

  const getJobs = (search = '', page = 1, ordering = order, dates = null) => {
    setLoading(true);
    const estilo = {
      title:{
        fontWeight: 'bold'
      },
      font: {
        color: '#7C8493',
      },
      button:{
        paddingTop: '2px',
        paddingBottom: '2px',
        paddingRight: '10px',
        paddingLeft: '10px',
        borderRadius: '12px',
        borderColor: '#006E90',
        color: '#006E90',
        fontSize: '15px',
      },
    };

    // Datos estáticos simulando la respuesta de la API
    const result = {
      data: {
        count: 25,
        results: [
          {
            profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"circular"} style={{ fontSize: "50px" }}/>,
            name: (
              <MDBox>
                <MDTypography style={estilo.title}>Niactic Media</MDTypography>
                <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
              </MDBox>
            ),
            status: "Active",
            applicationDate: <MDBox>{new Date("2025-02-17").toLocaleDateString()}</MDBox>,
          },
          {
            profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"circular"} style={{ fontSize: "50px" }}/>,
            name: (
              <MDBox>
                <MDTypography style={estilo.title}>Niactic Media</MDTypography>
                <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
              </MDBox>
            ),
            status: "Reject",
            applicationDate: <MDBox>{new Date("2025-02-15").toLocaleDateString()}</MDBox>,
          },
          {
            profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"circular"} style={{ fontSize: "50px" }}/>,
            name: (
              <MDBox>
                <MDTypography style={estilo.title}>Niactic Media</MDTypography>
                <MDTypography style={estilo.font}>Nomad - Paris,France - Full-Time</MDTypography>
              </MDBox>
            ),
            status: "Active",
            applicationDate: <MDBox>{new Date("2025-10-16").toLocaleDateString()}</MDBox>,
          },
        ]
      }
    };


    const { count, results } = result.data;
    const tmp = { ...dataTableModel };

    tmp.rows = results.map(e => renderTableRow(e, setSelectedItem, setOpenCancelModal));

    setDatatable(tmp);
    setNumberOfItems(count);
    setNumberOfItemsPage(results.length);
    setLoading(false);
  };

  useEffect(() => {
    getJobs(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (startDate && endDate) getJobs(searchQuery, 1, order, `${startDate.format('YYYY-MM-DD')},${endDate.format('YYYY-MM-DD')}`);
  }, [startDate, endDate]);

  return (
    <AdminLayout title={'Dashboard'} width={'100%'}>
      <Grid flex={1} display="flex" direction="column" gap={2} xs={12} sx={{width:'100%',flexDirection: 'column', justifyContent: 'space-between'}}>

        {showManageCredentials && (
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
              <MDButton onClick={() => handleClick("Credentials")} variant="outlined" color={'warning'} sx={getButtonStylesS}>Manage Credentials</MDButton>
            </Grid>
          </Card>
        )}
        {showLocationPreference && (
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
              <MDButton   onClick={() => handleClick("Location Preferences")} variant="outlined" color={'warning'} sx={getButtonStylesS}>Location Preference</MDButton>
            </Grid>
          </Card>
        )}

        <Card container spacing={2} >
          <Grid display={'flex'} padding={'30px'} md={12} xs={4} direction={'column'}>

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

              <DataTable
                loading={loading}
                loadingText={'Loading...'}
                showHeader={false}
                showTotalEntries={false}
                table={datatable}
                currentPage={currentPage}
                numberOfItems={numberOfItems}
                numberOfItemsPage={numberOfItemsPage}
                searchFunc={getJobs}
                searchQuery={searchQuery}
                pageSize={10}
                onPageChange={page => {
                  getJobs(searchQuery, page);
                  setCurrentPage(page);
                }}
              />

              <MDBox sx={{ display: "flex",justifyContent: "center", marginTop: '30px' }}>
                <MDButton
                  variant="outlined"
                  color="secondary"
                  onClick={handleIconClick}
                >
                  More
                </MDButton>
              </MDBox>
          </Grid>
        </Card>
      </Grid>

    </AdminLayout>
  );
}

export default HomeInspector;
