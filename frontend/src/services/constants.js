
export const API_VERSION_PREFIX = '/api/v1'

export const ROUTES = {
  LOGOUT: "/logout",
  SIGN_UP: "/signup",
  LOGIN: "/",
  FORGOT_PASSWORD: "/forgot-password",
  SET_NEW_PASSWORD: "/set-new-password/*",
  OWNER_DASHBOARD: `/dashboard-owner`,

}

export const ACCOUNT_TYPES = [
  {id: 1, value: "OWNER", name: "Owner"},
  {id: 2, value: "INSPECTOR", name: "Inspector"},
]

export const ROLES = {
  OWNER: "OWNER",
  INSPECTOR: "INSPECTOR",
}
