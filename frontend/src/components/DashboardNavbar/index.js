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

import {useEffect, useState} from "react";

// react-router components
import {Link, useLocation} from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDBadge from "components/MDBadge";

// Material Dashboard 3 PRO React examples
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarDesktopMenu,
  navbarIconButton,
  navbarMobileMenu,
  navbarRow,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 3 PRO React context
import {setMiniSidenav, setOpenConfigurator, setTransparentNavbar, useMaterialUIController,} from "context";
import MDTypography from "../MDTypography";
import {useLoginStore} from "../../services/helpers";
import {ACCOUNT_TYPES} from "../../services/constants";

function DashboardNavbar({absolute = false, light = false, isMini = false}) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    transparentNavbar,
    fixedNavbar,
    openConfigurator,
    darkMode,
  } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const loginStore = useLoginStore()
  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(
        dispatch,
        (fixedNavbar && window.scrollY === 0) || !fixedNavbar
      );
    }

    /**
     The event listener that's calling the handleTransparentNavbar function when
     scrolling the window.
     */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);


  // Styles for the navbar icons
  const iconsStyle = ({
                        palette: {dark, white, text},
                        functions: {rgba},
                      }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) =>
        navbar(theme, {transparentNavbar, absolute, light, darkMode})
      }
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" sx={(theme) => navbarRow(theme, {isMini})}>
          <IconButton
            sx={{
              ...navbarMobileMenu,
              display: {xs: 'none', xl: 'flex' },
            }}
            size="small"
            disableRipple
            color="inherit"
            onClick={handleMiniSidenav}
          >
            <Icon sx={iconsStyle} fontSize="medium">
              {miniSidenav ? "menu" : "menu_open"}
            </Icon>
          </IconButton>
          {/*<Breadcrumbs*/}
          {/*  icon="home"*/}
          {/*  title={route[route.length - 1]}*/}
          {/*  route={route}*/}
          {/*  light={light}*/}
          {/*/>*/}
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, {isMini})}>
            <IconButton
              size="small"
              disableRipple
              color="inherit"
              sx={navbarIconButton}
              onClick={handleConfiguratorOpen}
            >
              {/*<HelpOutlineOutlinedIcon sx={iconsStyle} />*/}
            </IconButton>
            <IconButton
              size="small"
              disableRipple
              color="inherit"
              sx={navbarIconButton}
              aria-controls="notification-menu"
              aria-haspopup="true"
              variant="contained"
              onClick={handleOpenMenu}
            >
              {/*<MDBadge badgeContent={9} color="error" size="xs" circular>*/}
              {/*<Icon sx={iconsStyle}>notifications</Icon>*/}
              {/*</MDBadge>*/}
            </IconButton>
            <MDBox
              color={light ? "white" : "inherit"}
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={{
                  ...navbarMobileMenu,
                  ml: { xs: "auto", sm: "auto" },
                  mr: 0,
                  display: { xs: 'flex', xl: 'none' },

                }}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
            </MDBox>
            <MDBox sx={{ width: 1.5, height: 20, backgroundColor: '#000000' }} ml={1} mr={1.5} />
            <MDTypography
              variant="h6"
              color="primary"
              sx={{
                fontSize: 16,
                ml: { xs: 0, sm: 1 },
              }}
            >
              {ACCOUNT_TYPES.find((type) => type.value === loginStore.user_type)?.name}
            </MDTypography>
          </MDBox>
        )}

      </Toolbar>
    </AppBar>
  );
}

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
