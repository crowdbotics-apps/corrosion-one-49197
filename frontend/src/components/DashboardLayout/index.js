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

import {useEffect} from "react";

// react-router-dom components
import {useLocation} from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React context
import {useMaterialUIController, setLayout} from "context";
import DashboardNavbar from "components/DashboardNavbar";

function DashboardLayout({children}) {
  const [controller, dispatch] = useMaterialUIController();
  const {miniSidenav} = controller;
  const {pathname} = useLocation();

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  return (
    <MDBox
      sx={({breakpoints, transitions, functions: {pxToRem}}) => ({
        // p: pxToRem(50),
        position: "relative",
        // paddingTop: pxToRem(105),
        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? pxToRem(97) : pxToRem(251),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      <DashboardNavbar/>
      {children}
    </MDBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
