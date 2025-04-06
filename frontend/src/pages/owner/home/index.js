import AdminLayout from "../../../components/AdminLayout";
import DataTable from "../../../components/DataTable/index";
import React, {useEffect, useState} from "react";
import {useApi, useLoginStore} from "../../../services/helpers";
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

import MDAvatar from "../../../components/MDAvatar"
import MDTypography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined"
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined"
import DataTableBodyCell from "../../../components/AdminLayout/DataTableBodyCell"
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined"
import {useNavigate} from "react-router-dom"
import {ROLES, ROUTES} from "../../../services/constants"

const DASHBOARD_INITIAL_STATE_INSPECTOR = {
  'available': 0,
  'favorite': 0,
  'applied': 0,
  'bids': 0,
  'accepted_bids': 0,
  'rejected_bids': 0,
}

const DASHBOARD_INITIAL_STATE_OWNER = {
  'available': 0,
}

const getButtonStylesS = () => ({
  borderRadius: '24px',
  width: '180px',
  fontSize: '14px',
  padding: '10px 20px',
});

function HomeInspector() {
  const loginStore = useLoginStore();
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [dataInspector, setDataInspector] = useState(DASHBOARD_INITIAL_STATE_INSPECTOR);
  const [dataOwner, setDataOwner] = useState(DASHBOARD_INITIAL_STATE_OWNER);

  const getDashboardDataInspector = () => {
    setLoading(true)
    api.getDashboardDataInspector().handle({
      onSuccess: (result) => {
        const {response} = result
        setDataInspector(response)
      },
      onFinally: () => {
        setLoading(false)
      }
    })
  }

  const getDashboardDataOwner = () => {
    setLoading(true)
    api.getDashboardDataOwner().handle({
      onSuccess: (result) => {
        const {response} = result
        setDataOwner(response)
      },
      onFinally: () => {
        setLoading(false)
      }
    })
  }


  useEffect(() => {
    if (loginStore.user_type === ROLES.INSPECTOR) {
      getDashboardDataInspector()
    } else {
      getDashboardDataOwner()
    }

  }, [])

  const renderAlertCard = (title, description, buttonText = '', onClick = null) => (
    <Card sx={{
      p: 2,
      border: '1px solid #FB8C00',
      display: "flex",
      flex: 1,
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexDirection: {xs: 'column', md: 'row'},
      borderRadius: '12px'
    }}>
      <MDBox>
        <MDTypography sx={{fontSize: '20px', fontWeight: 'bold'}}>
          {title}
        </MDTypography>
        <MDTypography sx={{fontSize: '14px', color: '#7B809A'}}>
          {description}
        </MDTypography>
      </MDBox>
      {onClick && <Grid padding="20px">
        <MDButton onClick={onClick} variant="outlined" color={'warning'} sx={getButtonStylesS}>{buttonText}</MDButton>
      </Grid>}
    </Card>
  );

  const renderInternalCard = (title, number, icon) => (
    <Grid item sm={4} xs={12}>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          height: '110px',
          border: '1px solid #D3D3D3',
          borderRadius: '12px',
        }}
        p={2}
      >
        <MDBox>
          <MDTypography sx={{fontWeight: 'bold', fontSize: '20px'}}>
            {title}
          </MDTypography>
          <MDTypography noWrap sx={{fontWeight: 'bold', fontSize: '40px'}}>
            {number}
          </MDTypography>
        </MDBox>

        <MDBox>
          {icon}
        </MDBox>
      </MDBox>
    </Grid>
  )



  return (
    <AdminLayout title={'Dashboard'}>
      <MDBox flex={1} display="flex" gap={2}
             sx={{width: '100%', flexDirection: 'column', justifyContent: 'space-between'}}>
        {!loginStore.phone_verified && renderAlertCard("Phone number not verified", "Your phone number is not verified. Verify your phone number to access more opportunities")}
        {!loginStore.email_verified && renderAlertCard("Email not verified", "Your email is not verified. Verify your email to access more opportunities")}

        <Card>
          <MDBox display="flex" flex={1} flexDirection="column" p={4} >
            <MDTypography sx={{fontWeight: 'bold'}} mb={4}>Recent Activities</MDTypography>
            <Grid container borderTop={'2px solid #e0e0e0'} spacing={3}>
              {renderInternalCard('Applied Jobs', dataInspector.applied, <WorkOutlineOutlinedIcon sx={{width: '60px', height: '60px', color: '#006E90'}}/>)}
              {renderInternalCard('Available Jobs', dataInspector.available, <WorkOutlineOutlinedIcon sx={{width: '60px', height: '60px', color: '#006E90'}}/>)}
              {renderInternalCard('Favorite Jobs', dataInspector.favorite, <WorkOutlineOutlinedIcon sx={{width: '60px', height: '60px', color: '#006E90'}}/>)}
              {renderInternalCard('Bids', dataInspector.bids, <NotificationsActiveOutlinedIcon sx={{width: '60px', height: '60px', color: '#006E90'}}/>)}
              {renderInternalCard('Accepted Bids', dataInspector.accepted_bids, <BookmarkOutlinedIcon sx={{width: '60px', height: '60px', color: '#006E90'}}/>)}
              {renderInternalCard('Rejected Bids', dataInspector.rejected_bids, <BookmarkOutlinedIcon sx={{width: '60px', height: '60px', color: '#006E90'}}/>)}
            </Grid>
          </MDBox>
        </Card>
      </MDBox>

    </AdminLayout>
  );
}

export default HomeInspector;
