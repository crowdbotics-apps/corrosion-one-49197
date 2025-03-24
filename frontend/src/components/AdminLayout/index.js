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

import {useNavigate} from "react-router-dom";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";


import DashboardLayout from "../DashboardLayout";
import {useStores} from "../../models";
import {Navigate} from "react-router-dom";
import Card from "@mui/material/Card";
import {ROLES, ROUTES} from "../../services/constants";
import pxToRem from "assets/theme/functions/pxToRem";
import {useIsMobile} from "../../services/helpers";

function AdminLayout
({
   header,
   title,
   children,
   width,
   showCard,
   cardWidth = '98%',
   hasNavigationBack = false,
   contentCentered = false
 }) {
  const rootStore = useStores()
  const {loginStore} = rootStore
  const isLoggedIn = loginStore.isLoggedIn;
  const navigate = useNavigate();
  const isMobile = useIsMobile()

  const renderMainContent = () => {
    return (
      <DashboardLayout background={"white"}>
        <MDBox
          display={'flex'}
          alignItems='center'
          flex={1}
          position={'relative'}
          pb={pxToRem(26)}
          pl={contentCentered ? pxToRem(170) : 2}
          pt={2}
        >
          <MDTypography variant={'h2'} sx={isMobile ? {fontSize:"26px"}:{}}>
            {title}
          </MDTypography>
          {hasNavigationBack && (
            <MDTypography
              sx={{
                cursor: 'pointer',
                fontSize: pxToRem(35),
                left: -45,
                position: 'absolute',
              }}
              onClick={() => navigate(-1)}
            >
              {'<'}
            </MDTypography>
          )}

          <MDBox ml={'auto'}>
            {header}
          </MDBox>
        </MDBox>
        <MDBox
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          flex={1}
          sx={contentCentered && {justifyContent: 'flex-start', pl: pxToRem(160)}}
        >
          {showCard && <Card sx={{width: cardWidth, p:2}}>{children}</Card>}
          {!showCard && <MDBox p={2} display={'flex'} flex={1} sx={{width: width}} >{children}  </MDBox>}
        </MDBox>

      </DashboardLayout>
    );
  }

  if (isLoggedIn) {
    return renderMainContent();
  } else {
    return <Navigate to={ROUTES.LOGIN}/>;
  }

}

export default AdminLayout;
