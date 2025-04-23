import AdminLayout from "../../../components/AdminLayout";
import DataTable from "../../../components/DataTable";
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
  'active': 0,
  'bids': 0,
  'all': 0,
  'finished_jobs': 0,
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataInspector, setDataInspector] = useState(DASHBOARD_INITIAL_STATE_INSPECTOR);
  const [dataOwner, setDataOwner] = useState(DASHBOARD_INITIAL_STATE_OWNER);
  const [cards, setCards] = useState([{}]);

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

  const getCards = () => {
    api.getCards().handle({
      onSuccess: (result) => {
        setCards(result.data)
      },
      errorMessage: 'Error getting cards',
    })
  }



  useEffect(() => {
    if (loginStore.user_type === ROLES.INSPECTOR) {
      getDashboardDataInspector()
    } else {
      getDashboardDataOwner()
      getCards()
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

  const renderInternalCard = (title, number, icon, onClick = () => {}) => (
    <Grid item sm={4} xs={12} onClick={onClick}>
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
        {!loginStore.stripe_account_linked && loginStore.user_type === ROLES.INSPECTOR && renderAlertCard("Stripe account not linked", "Your Stripe account is not linked. Please link your Stripe account to receive payments", "Link Stripe Account", () => navigate(ROUTES.PAYMENT))}
        {cards.length === 0 && loginStore.user_type === ROLES.OWNER && renderAlertCard("No payment method", "You don't have any payment method. Please add a payment method or pay as you go", "Add Payment Method", () => navigate(ROUTES.PAYMENT))}

        <Card>
          <MDBox display="flex" flex={1} flexDirection="column" p={4} >
            <MDTypography sx={{fontWeight: 'bold'}} mb={4}>Recent Activities</MDTypography>
            {loginStore.user_type === ROLES.INSPECTOR && <Grid container borderTop={'2px solid #e0e0e0'} spacing={3}>
              {renderInternalCard('Applied Jobs', dataInspector.applied, <WorkOutlineOutlinedIcon sx={{width: '60px', height: '60px', color: '#006E90'}}/>, () => navigate(ROUTES.APPLIED_JOBS))}
              {renderInternalCard('Available Jobs', dataInspector.available, <WorkOutlineOutlinedIcon sx={{width: '60px', height: '60px', color: '#006E90'}}/>, () => navigate(ROUTES.FIND_JOBS))}
              {renderInternalCard('Favorite Jobs', dataInspector.favorite, <WorkOutlineOutlinedIcon sx={{width: '60px', height: '60px', color: '#006E90'}}/>, () => navigate(ROUTES.FAVORITE))}
              {renderInternalCard('Bids', dataInspector.bids, <NotificationsActiveOutlinedIcon sx={{width: '60px', height: '60px', color: '#006E90'}}/>)}
              {renderInternalCard('Accepted Bids', dataInspector.accepted_bids, <BookmarkOutlinedIcon sx={{width: '60px', height: '60px', color: '#006E90'}}/>)}
              {renderInternalCard('Rejected Bids', dataInspector.rejected_bids, <BookmarkOutlinedIcon sx={{width: '60px', height: '60px', color: '#006E90'}}/>)}
            </Grid>}
            {loginStore.user_type === ROLES.OWNER && <Grid container borderTop={'2px solid #e0e0e0'} spacing={3}>
              {renderInternalCard('Active Jobs', dataOwner.active, <WorkOutlineOutlinedIcon sx={{width: '60px', height: '60px', color: '#006E90'}}/>, () => navigate(ROUTES.MY_JOBS))}
              {renderInternalCard('Bids', dataOwner.bids, <NotificationsActiveOutlinedIcon sx={{width: '60px', height: '60px', color: '#006E90'}}/>, () => navigate(ROUTES.BIDS))}
              {renderInternalCard('All Jobs', dataOwner.all, <WorkOutlineOutlinedIcon sx={{width: '60px', height: '60px', color: '#006E90'}}/>, () => navigate(ROUTES.MY_JOBS))}
              {renderInternalCard('Finished Jobs', dataOwner.finished_jobs, <BookmarkOutlinedIcon sx={{width: '60px', height: '60px', color: '#006E90'}}/>, () => navigate(ROUTES.HISTORY))}
            </Grid>}
          </MDBox>
        </Card>
      </MDBox>

    </AdminLayout>
  );
}

export default HomeInspector;
