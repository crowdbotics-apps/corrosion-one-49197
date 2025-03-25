
export const API_VERSION_PREFIX = '/api/v1'

export const ROUTES = {
  LOGOUT: "/logout",
  SIGN_UP: "/signup",
  LOGIN: "/",
  FORGOT_PASSWORD: "/forgot-password",
  SET_NEW_PASSWORD: "/set-new-password/*",
  DASHBOARD: `/dashboard`,
  DASHBOARD_OWNER: `/dashboard-owner`,
  BIDS: `/bids`,
  MY_JOBS: `/my-jobs`,
  POST_JOB: "/post-job",
  FIND_JOBS: `/find-jobs`,
  FIND_J0B_DETAILS: `/find-jobs-details`,
  MESSAGES: `/messages`,
  SETTINGS: `/settings`,
  SUPPORT: `/support`,
  DETAILS: `/details`,
  JOB_REDIRECT: `/jtv/*`,

}

export const ACCOUNT_TYPES = [
  {id: 1, value: "OWNER", name: "Owner"},
  {id: 2, value: "INSPECTOR", name: "Inspector"},
]

export const ROLES = {
  OWNER: "OWNER",
  INSPECTOR: "INSPECTOR",
}
