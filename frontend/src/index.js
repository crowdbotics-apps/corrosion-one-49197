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
import {GoogleOAuthProvider} from "@react-oauth/google";

const container = document.getElementById("app");
const root = createRoot(container);

if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });


}

root.render(
  <HashRouter>
    <MaterialUIControllerProvider>
      <StoreApp>
        <GoogleOAuthProvider clientId={"1075946037800-i2uef08ogjjtill8vrc8ao9coankl1i8.apps.googleusercontent.com"}>
          <App/>
        </GoogleOAuthProvider>
      </StoreApp>
    </MaterialUIControllerProvider>
  </HashRouter>
);
