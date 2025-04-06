
export const API_VERSION_PREFIX = '/api/v1'

export const ROUTES = {
  LOGOUT: "/logout",
  SIGN_UP: "/signup",
  LOGIN: "/",
  FORGOT_PASSWORD: "/forgot-password",
  SET_NEW_PASSWORD: "/set-new-password/*",
  DASHBOARD: `/dashboard`,
  PAYMENT: `/payment`,
  BIDS: `/bids`,
  MY_JOBS: `/my-jobs`,
  HISTORY: `/history`,
  FAVORITE: `/favorite-jobs`,
  POST_JOB: "/post-job",
  APPLIED_JOBS: `/applied-jobs`,
  FIND_JOBS: `/find-jobs`,
  MESSAGES: `/messages`,
  SETTINGS: `/settings`,
  SUPPORT: `/support`,
  DETAILS: `/details`,
  JOB_REDIRECT: `/jtv/*`,
  FIND_JOB_DETAILS: `/find-job-details`,
  EDIT_JOB: (jobId) => `/edit-job/${jobId}`,
  JOB_BIDS: (jobId) => `/job-bids/${jobId}`,
  J0B_DETAIL: (jobId) => `/job-detail/${jobId}`,
  BID_DETAIL: (bidId) => `/bid-detail/${bidId}`,
  NOTIFICATIONS: `/notifications`,

}

export const ACCOUNT_TYPES = [
  {id: 1, value: "OWNER", name: "Owner"},
  {id: 2, value: "INSPECTOR", name: "Inspector"},
]

export const ROLES = {
  OWNER: "OWNER",
  INSPECTOR: "INSPECTOR",
}
