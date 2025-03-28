
export const API_VERSION_PREFIX = '/api/v1'

export const ROUTES = {
  LOGOUT: "/logout",
  SIGN_UP: "/signup",
  LOGIN: "/",
  FORGOT_PASSWORD: "/forgot-password",
  SET_NEW_PASSWORD: "/set-new-password/*",
  DASHBOARD: `/dashboard-inspector`,
  PAYMENT: `/payment`,
  DASHBOARD_OWNER: `/dashboard-owner`,
  BIDS: `/bids`,
  MY_JOBS: `/my-jobs`,
  POST_JOB: "/post-job",
  APPLIED_JOBS: `/applied_jobs`,
  FIND_JOBS: `/find-jobs`,
  J0B_DETAILS: `/job-details`,
  MESSAGES: `/messages`,
  SETTINGS: `/settings`,
  SUPPORT: `/support`,
  DETAILS: `/details`,
  JOB_REDIRECT: `/jtv/*`,
  FIND_JOB_DETAILS: `/find-job-details`,
  EDIT_JOB: `/edit-job`,
  JOB_BIDS: (jobId) => `/job-bids/${jobId}`,

}

export const ACCOUNT_TYPES = [
  {id: 1, value: "OWNER", name: "Owner"},
  {id: 2, value: "INSPECTOR", name: "Inspector"},
]

export const ROLES = {
  OWNER: "OWNER",
  INSPECTOR: "INSPECTOR",
}
