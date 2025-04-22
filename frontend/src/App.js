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
import {Navigate, Route, Routes, useLocation} from "react-router-dom";

// @mui material components
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";


// Material Dashboard 3 PRO React examples
import Sidenav from "examples/Sidenav";

// Material Dashboard 3 PRO React themes
import theme from "assets/theme";

// Material Dashboard 3 PRO React Dark Mode themes
import themeDark from "assets/theme-dark";
import icon from 'assets/images/favicon.png';


// Material Dashboard 3 PRO React routes
import routes, {protectedRoutes, unprotectedRoutes} from "routes";

// Material Dashboard 3 PRO React contexts
import {setMiniSidenav, useMaterialUIController,} from "context";

// Images
import brandWhite from "./assets/imagesExamples/logo-ct.png";
import brandDark from "./assets/imagesExamples/logo-ct-dark.png";
import {setupRootStore} from "./models";
import useCurrentBreakpoint from "./services/helpers";
import {ROUTES} from "./services/constants";
import {SignUp} from "./pages";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const {pathname} = useLocation();
  const [rootStore, setRootStore] = useState(undefined)
  const currentBp = useCurrentBreakpoint();

  useEffect(() => {
    const favicon = document.getElementById('favicon');
    favicon.setAttribute('href', icon);
  }, []);

  useEffect(() => {
    (async () => {
      setupRootStore().then((rootStore) => {
        setRootStore(rootStore)
      })
    })()
  }, [])


  useEffect(() => {
    // console.log('Root Store:', JSON.stringify(rootStore.loginStore))
    if (rootStore) {
      rootStore.loginStore.setUp()
    }
  }, [rootStore])


  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };


  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={route.component}
            key={route.key}
          />
        );
      }

      return null;
    });


  // console.log('Current Breakpoint:', currentBp);

  const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

  const stripeInstance = loadStripe(stripePublicKey);

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline/>
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={
              (transparentSidenav && !darkMode) || whiteSidenav
                ? brandDark
                : brandWhite
            }
            brandName="Creative Tim"
            routes={protectedRoutes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
        </>
      )}
      <Elements stripe={stripeInstance}>
        <Routes>
          {getRoutes(unprotectedRoutes)}
          {getRoutes(protectedRoutes)}
        </Routes>
      </Elements>
    </ThemeProvider>
  );
}
