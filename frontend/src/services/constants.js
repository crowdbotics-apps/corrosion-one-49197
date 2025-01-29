export const ROLES = {
  ADMIN: {id: 1, name: "Admin"},
  PROJECT_MANAGER: {id: 2, name: "Project Manager"},
  SUPPLY_MANAGER: {id: 3, name: "Supply Manager"},
  SUB_CONTRACTOR_REP: {id: 4, name: "Sub Contractor Rep"},
}

export const PERMISSION_TYPES = [
  {value: "Viewer", name: "Viewer"},
  {value: "Approver", name: "Approver"},
]


export const API_VERSION_PREFIX = '/api/v1'
export const DASHBOARD_PROJECT_MANAGER_PREFIX = '/project-manager'
export const DASHBOARD_SUPPLY_MANAGER_PREFIX = '/supply-manager'

export const ROUTES = {
  LOGOUT: "/logout",
  SIGN_UP: "/signup",
  SIGN_UP_2: "/signup",
  SIGN_UP_3: "/signup",
  LOGIN: "/",
  FORGOT_PASSWORD: "/forgot-password",
  SET_NEW_PASSWORD: "/set-new-password/*",
// Project manager routes
  USER_PROJECT_SELECTOR: `/projects`,
  USER_HOME: `${DASHBOARD_PROJECT_MANAGER_PREFIX}/home`,
  USER_MY_ACCOUNT: `/my-account`,
  USER_CHANGE_PASSWORD: `/change-password`,
  USER_TERMS_AND_CONDITIONS: `/terms-and-conditions`,
  USER_PRIVACY_POLICY: `/privacy-policy`,
  USER_ACCOUNT_SETTINGS: `/account-settings`,
  DIRECT_MESSAGES: (id) => `/project/${id}/direct-messages`,
  NOTIFICATIONS: `/notifications/`,
}

export const PM_ROUTES_WITH_NO_PROJECT = [
  ROUTES.USER_PROJECT_SELECTOR,
  ROUTES.USER_MY_ACCOUNT,
  ROUTES.USER_CHANGE_PASSWORD,
  ROUTES.USER_TERMS_AND_CONDITIONS,
  ROUTES.USER_PRIVACY_POLICY,
  ROUTES.USER_ACCOUNT_SETTINGS,
  ROUTES.NOTIFICATIONS,
  // Using regular expression instead of ROUTES.USER_SUPPLY_MANAGER_PRODUCTS_SELECTED(':manufacturerId'), because with
  // regular expression is using a string and not a function
  /\/manufacturer\/\d+\/products\//,
  /\/manufacturer\/\d+\/product\//,
  /\/manufacturer\/\d+\/packages\//,
  /\/manufacturer\/\d+\/program-documents-list\//,
  ROUTES.DIRECT_MESSAGES(':id'),
]

export const ACCOUNT_TYPES = [
  {id: 1, value: "OWNER", name: "Owner"},
  {id: 2, value: "INSPECTOR", name: "Inspector"},
]
