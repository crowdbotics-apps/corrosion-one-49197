/**
 =========================================================
 * Material Dashboard 3 PRO React - v2.3.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
 * Copyright 2024 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import PageLayout from "components/PageLayout";

// Material Dashboard 3 PRO React context
import {useMaterialUIController} from "context";
import Card from "@mui/material/Card";
import logo from "assets/svgs/logo-text.svg";

function IllustrationLayout({header = "", title = "", description = "", illustration = "", children}) {
  const [controller] = useMaterialUIController();
  const {darkMode} = controller;

  const handleDescription = (description) => {
    // This regex matches digits or the listed special characters
    const regex = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g;

    // Use `String.replace()` with a function to wrap each match in <strong> tags
    return description.replace(regex, (match) => `<strong>${match}</strong>`);
  };

  const boldedText = handleDescription(description);

  return (
    <PageLayout background="white">
      <Grid
        container
        sx={{
          backgroundColor: ({palette: {background, white}}) =>
            darkMode ? background.default : white.main,
        }}
      >
        <Grid item xs={12} lg={6} md={6} xl={8}>
          <MDBox
            display={{xs: "none", md: "flex"}}
            width="calc(100%)"
            height="calc(100vh)"
            sx={{backgroundImage: `url(${illustration})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center center"}}
          />

        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={4} sx={{my: "auto"}}>
          <Card sx={{borderRadius: 0,     width: {
              xs: '100%',
              sm: '100%',
              md: '100%',
              lg: '97%',
              xl: '97%',
            },}}>
            <MDBox display="flex" flexDirection="column" justifyContent="center" height="96vh" mx={3}
                   sx={ {xl: { height: "100vh" } }}
            >
              <MDBox component="img" src={logo} alt="logo" width={"300px"} mx={"auto"} mb={3} display={{xs: "flex", md: "none"}} />
              <MDBox py={3} px={3} pb={1} textAlign="center">
                {!header ? (
                  <>
                    <MDBox mb={1} textAlign="center">
                      <MDTypography variant="h4" fontWeight="bold" textAlign="left">
                        {title}
                      </MDTypography>
                    </MDBox>
                    <p
                      style={{fontSize: "17px", textAlign: "left"}}
                      dangerouslySetInnerHTML={{ __html: boldedText }}
                    />
                  </>
                ) : (
                  header
                )}
              </MDBox>
              <MDBox p={3}>{children}</MDBox>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </PageLayout>
  );
}

// Typechecking props for the IllustrationLayout
IllustrationLayout.propTypes = {
  header: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  illustration: PropTypes.string,
};

export default IllustrationLayout;
