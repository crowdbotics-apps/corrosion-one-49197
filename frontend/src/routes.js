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

/**
  All of the routes for the Material Dashboard 3 PRO React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav.
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
 */

// Material Dashboard 3 PRO React layouts
import Analytics from "layouts/dashboards/analytics";
import Sales from "layouts/dashboards/sales";
import ProfileOverview from "layouts/pages/profile/profile-overview";
import AllProjects from "layouts/pages/profile/all-projects";
import NewUser from "layouts/pages/users/new-user";
import Settings from "layouts/pages/account/settings";
import Billing from "layouts/pages/account/billing";
import Invoice from "layouts/pages/account/invoice";
import Timeline from "layouts/pages/projects/timeline";
import PricingPage from "layouts/pages/pricing-page";
import Widgets from "layouts/pages/widgets";
import RTL from "layouts/pages/rtl";
import Charts from "layouts/pages/charts";
import Notifications from "layouts/pages/notifications";
import Kanban from "layouts/applications/kanban";
import Wizard from "layouts/applications/wizard";
import DataTables from "layouts/applications/data-tables";
import Calendar from "layouts/applications/calendar";
import NewProduct from "layouts/ecommerce/products/new-product";
import EditProduct from "layouts/ecommerce/products/edit-product";
import ProductPage from "layouts/ecommerce/products/product-page";
import OrderList from "layouts/ecommerce/orders/order-list";
import OrderDetails from "layouts/ecommerce/orders/order-details";
import SignInBasic from "layouts/authentication/sign-in/basic";
import SignInCover from "layouts/authentication/sign-in/cover";
import SignInIllustration from "layouts/authentication/sign-in/illustration";
import SignUpCover from "layouts/authentication/sign-up/cover";
import ResetCover from "layouts/authentication/reset-password/cover";

// Material Dashboard 3 PRO React components
import MDAvatar from "components/MDAvatar";

// @mui icons
import Icon from "@mui/material/Icon";

// Images
import profilePicture from "./assets/imagesExamples/team-3.jpg";
import {
  SignIn,
  ForgotPassword,
  SignUp, HomeOwner, SetNewPassword
} from "./pages";
import {ROLES, ROUTES} from "./services/constants";


export const unprotectedRoutes = [
  {
    type: "fixed",
    name: "Sign In",
    key: "sign-in",
    route: ROUTES.LOGIN,
    component: <SignIn />,
  },
  {
    type: "fixed",
    name: "Forgot Password",
    key: "forgot-password",
    route: ROUTES.FORGOT_PASSWORD,
    component: <ForgotPassword />,
  },
  {
    type: "fixed",
    name: "Sign Up",
    key: "sign-up",
    route: ROUTES.SIGN_UP,
    component: <SignUp />,
  },
  {
    type: "fixed",
    name: "Set New Password",
    key: "set-new-password",
    route: ROUTES.SET_NEW_PASSWORD,
    component: <SetNewPassword />,
  }
]

export const protectedRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: ROUTES.OWNER_DASHBOARD,
    component: <HomeOwner />,
    noCollapse: true,
    icon: <Icon fontSize="small">home_outlined</Icon>,
    role: [ROLES.OWNER, ROLES.INSPECTOR],

  },
  {
    type: "collapse",
    name: "Find Jobs",
    key: "find-jobs",
    route: ROUTES.OWNER_DASHBOARD,
    component: <HomeOwner />,
    icon: <Icon fontSize="small">search_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.INSPECTOR],
  },
  {
    type: "collapse",
    name: "Post a Job",
    key: "post-jobs",
    route: ROUTES.OWNER_DASHBOARD,
    component: <HomeOwner />,
    icon: <Icon fontSize="small">ballot_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.OWNER],
  },
  {
    type: "collapse",
    name: "Bids",
    key: "bids",
    route: ROUTES.OWNER_DASHBOARD,
    component: <HomeOwner />,
    icon: <Icon fontSize="small">people_all_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.OWNER],
  },
  {
    type: "collapse",
    name: "My Jobs",
    key: "my-jobs",
    route: ROUTES.OWNER_DASHBOARD,
    component: <HomeOwner />,
    icon: <Icon fontSize="small">cases_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.OWNER],
  },
  {
    type: "collapse",
    name: "History",
    key: "history",
    route: ROUTES.OWNER_DASHBOARD,
    component: <HomeOwner />,
    icon: <Icon fontSize="small">history_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.OWNER],
  },
  {
    type: "collapse",
    name: "Applied Jobs",
    key: "applied-jobs",
    route: ROUTES.OWNER_DASHBOARD,
    component: <HomeOwner />,
    icon: <Icon fontSize="small">cases_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.INSPECTOR],
  },
  {
    type: "collapse",
    name: "Favorite Jobs",
    key: "favorite-jobs",
    route: ROUTES.OWNER_DASHBOARD,
    component: <HomeOwner />,
    icon: <Icon fontSize="small">bookmarks_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.INSPECTOR],
  },
  {
    type: "collapse",
    name: "Messages",
    key: "messages",
    route: ROUTES.OWNER_DASHBOARD,
    component: <HomeOwner />,
    icon: <Icon fontSize="small">forum_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.OWNER, ROLES.INSPECTOR],
  },
  {
    type: "collapse",
    name: "Payment",
    key: "payment",
    route: ROUTES.OWNER_DASHBOARD,
    component: <HomeOwner />,
    icon: <Icon fontSize="small">account_balance_wallet_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.OWNER, ROLES.INSPECTOR],
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    route: ROUTES.OWNER_DASHBOARD,
    component: <HomeOwner />,
    icon: <Icon fontSize="small">notifications_active_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.OWNER, ROLES.INSPECTOR],
  },
  ];
