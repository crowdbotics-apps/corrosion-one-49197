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

import React from "react";
import {createRoot} from "react-dom/client";
import {HashRouter} from "react-router-dom";
import * as Sentry from "@sentry/react";
import App from "App";

// Material Dashboard 3 PRO React Context Provider
import {MaterialUIControllerProvider} from "context";
import StoreApp from "./StoreApp";

const container = document.getElementById("app");
const root = createRoot(container);

if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
      }),
    ],
    tracesSampleRate: 1.0,
  });


}

root.render(
  <HashRouter>
    <MaterialUIControllerProvider>
      <StoreApp>
        <App/>
      </StoreApp>
    </MaterialUIControllerProvider>
  </HashRouter>
);
