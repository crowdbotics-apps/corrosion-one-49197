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


// @mui icons
import Icon from "@mui/material/Icon";

// Images
import profilePicture from "./assets/imagesExamples/team-3.jpg";
import {
  SignIn,
  ForgotPassword,
  SignUp,
  SetNewPassword,
  Logout,
  Settings,
  JobRedirect, BidDetail
} from "./pages";
import {ROLES, ROUTES} from "./services/constants";
import HomeOwnerMessages from "./pages/common/messages"
import HomeOwnerPostJob from "./pages/owner/postJob"
import Bids from "./pages/owner/bids"
import JobList from "./pages/common/jobs"
import HomeInspector from "./pages/owner/home"
import HomeOwner from "./pages/owner/homeOwner"
import HomeOwnerAppliedJobs from "./pages/inspector/appliedJobs"
import Support from "./pages/common/support"
import Payment from "./pages/owner/payment"
import JobDetail from "./pages/common/jobDetail";
// import EditJob from "./pages/owner/editJob"



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
  },
  {
    type: "fixed",
    name: "Job redirect",
    key: "job-redirect",
    route: ROUTES.JOB_REDIRECT,
    component: <JobRedirect />,
  }
]

export const protectedRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: ROUTES.DASHBOARD,
    component: <HomeInspector />,
    noCollapse: true,
    icon: <Icon fontSize="small">home_outlined</Icon>,
    role: [ROLES.INSPECTOR, ROLES.OWNER],
    sidenav: true
  },

  {
    type: "collapse",
    name: "Find Jobs",
    key: "find-jobs",
    route: ROUTES.FIND_JOBS,
    component: <JobList />,
    icon: <Icon fontSize="small">search_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.INSPECTOR],
    sidenav: true
  },
  ////////////////////////////////////////
  {
    name: "Edit Job",
    key: "edit-job",
    route: ROUTES.EDIT_JOB(':jobId'),
    component: <HomeOwnerPostJob />,
    role: [ROLES.OWNER],
    sidenav: false
  },
  {
    name: "Job Detail",
    key: "job-detail",
    route: ROUTES.J0B_DETAIL(':jobId'),
    component: <JobDetail />,
    role: [ROLES.INSPECTOR, ROLES.OWNER],
    sidenav: false
  },

  ////////////////////////////////////////
  {
    type: "collapse",
    name: "Post a Job",
    key: "post-job",
    route: ROUTES.POST_JOB,
    component: <HomeOwnerPostJob />,
    icon: <Icon fontSize="small">ballot_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.OWNER],
    sidenav: true
  },
  {
    type: "collapse",
    name: "Bids",
    key: "bids",
    route: ROUTES.BIDS,
    component: <Bids />,
    icon: <Icon fontSize="small">people_all_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.OWNER],
    sidenav: true
  },
  {
    type: "collapse",
    name: "My Active Jobs",
    key: "my-jobs",
    route: ROUTES.MY_JOBS,
    component: <JobList />,
    icon: <Icon fontSize="small">cases_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.OWNER],
    sidenav: true
  },
  {
    type: "collapse",
    name: "Job Bids",
    key: "job-bids",
    route: ROUTES.JOB_BIDS(':jobId'),
    component: <Bids />,
    icon: null,
    noCollapse: true,
    role: [ROLES.OWNER],
    sidenav: false
  },
  {
    type: "collapse",
    name: "Bid detail",
    key: "bid-detail",
    route: ROUTES.BID_DETAIL(':bidId'),
    component: <BidDetail />,
    icon: null,
    noCollapse: true,
    role: [ROLES.OWNER],
    sidenav: false
  },
  {
    type: "collapse",
    name: "Jobs History",
    key: "history",
    route: ROUTES.HISTORY,
    component: <JobList />,
    icon: <Icon fontSize="small">history_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.OWNER],
    sidenav: true
  },
  {
    type: "collapse",
    name: "Applied Jobs",
    key: "applied-jobs",
    route: ROUTES.APPLIED_JOBS,
    component: <JobList />,
    icon: <Icon fontSize="small">cases_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.INSPECTOR],
    sidenav: true
  },
  {
    type: "collapse",
    name: "Favorite Jobs",
    key: "favorite-jobs",
    route: ROUTES.FAVORITE,
    component: <JobList />,
    icon: <Icon fontSize="small">bookmarks_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.INSPECTOR],
    sidenav: true
  },
  {
    type: "collapse",
    name: "Messages",
    key: "messages",
    route: ROUTES.MESSAGES,
    component: <HomeOwnerMessages />,
    icon: <Icon fontSize="small">forum_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.OWNER, ROLES.INSPECTOR],
    sidenav: true
  },
  {
    type: "collapse",
    name: "Payment",
    key: "payment",
    route: ROUTES.PAYMENT,
    component: <Payment />,
    icon: <Icon fontSize="small">account_balance_wallet_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.OWNER, ROLES.INSPECTOR],
    sidenav: true
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    route: ROUTES.DASHBOARD,
    component: <HomeOwner />,
    icon: <Icon fontSize="small">notifications_active_outlined</Icon>,
    noCollapse: true,
    role: [ROLES.OWNER, ROLES.INSPECTOR],
    sidenav: true
  },
  {
    type: "collapse",
    name: "Logout",
    key: "logout",
    route: ROUTES.LOGOUT,
    component: <Logout />,
    icon: null,
    noCollapse: true,
    role: [ROLES.OWNER, ROLES.INSPECTOR],
    sidenav: false
  },
  {
    type: "collapse",
    name: "Settings",
    key: "settings",
    route: ROUTES.SETTINGS,
    component: <Settings />,
    icon: null,
    noCollapse: true,
    role: [ROLES.OWNER, ROLES.INSPECTOR],
    sidenav: false
  },
  {
    type: "collapse",
    name: "Support",
    key: "support",
    route: ROUTES.SUPPORT,
    component: <Support />,
    icon: null,
    noCollapse: true,
    role: [ROLES.OWNER, ROLES.INSPECTOR],
    sidenav: false
  },

  ];
