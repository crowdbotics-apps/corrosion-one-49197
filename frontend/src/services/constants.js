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
  USER_PROJECT_SELECTED: (id) => `/project/${id}/`,
  USER_SUPPLY_MANAGER_PRODUCTS_SELECTED: (manufacturerId) => `/manufacturer/${manufacturerId}/products/`,
  CONTACT_LIST_PROJECT_MANAGER: (id, categoryId) => `/project/${id}/contact-list/${categoryId}/`,
  PROGRAM_DOCUMENTS: (manufacturerId) => `/manufacturer/${manufacturerId}/program-documents-list/`,
  PM_PROGRAM_DOCUMENTS: (id, categoryId) => `/project/${id}/products/${categoryId}/program-documents-list/`,
  // CATEGORY_SCREEN_PROJECT_MANAGER: `${DASHBOARD_PROJECT_MANAGER_PREFIX}/category-screen`,
  USER_ORDERS_AND_QUOTES: (id) => `/project/${id}/orders-and-quotes`,
  USER_SHOPPING_CART: (id) => `/project/${id}/shopping-cart`,
  PROJECT_PRODUCTS_BY_CATEGORY: (id, categoryId) => `/project/${id}/products/${categoryId}/`,
  SUPPLY_MANAGER_PRODUCTS_BY_CATEGORY: (manufacturerId, categoryId) => `/manufacturer/${manufacturerId}/products/${categoryId}/`,
  // PROJECT_PACKAGES_BY_CATEGORY: (id, categoryId) => `/project/${id}/packages/${categoryId}/`,
  PACKAGE_DETAIL: (id, packageId) => `/project/${id}/packages/${packageId}/`,
  SUPPLY_MANAGER_PACKAGE_DETAIL: (manufacturerId, packageId) => `/manufacturer/${manufacturerId}/packages/${packageId}/`,
  USER_PROJECT_PACKAGES: (idProject) => `/project/${idProject}/package/`,
  USER_PRODUCTS: (idProject) => `/project/${idProject}/products`,
  USER_PRODUCT_DETAIL: (idProject, idprod) => `/project/${idProject}/product/${idprod}/`,
  SUPPLY_MANAGER_PRODUCT_DETAIL: (manufacturerId, idprod) => `/manufacturer/${manufacturerId}/product/${idprod}/`,
  ORDER_DETAILS_PROJECT_MANAGER: `/order-details`,
  USER_ORDERS_AND_QUOTES_DETAIL: (idProject, idOrder) => `/project/${idProject}/orders-and-quotes/${idOrder}/`,
  USER_SHOPPING_CART_DETAIL: (idProject, idOrder) => `/project/${idProject}/shopping-cart/${idOrder}/`, // exactly like order, only selected button change
  // Supply manager routes


// Admin routes
  ADMIN_ANALYTICS: '/dashboard/analytics',
  ADMIN_ALL_USERS: '/dashboard/all-users',
  ADMIN_CREATE_NEW_USER: '/dashboard/create-user-account',
  ADMIN_ORDER_MANAGEMENT_DETAIL: (id) => `/dashboard/order-management/${id}`,
  ADMIN_PRODUCT_DETAIL: (id) => `/management/manage-products/${id}/detail/`,
  ADMIN_PRODUCT_ORDER_DETAIL: (id, projectId, orderId) => `/management/manage-products/${id}/detail/${projectId}/order/${orderId}/`,
  ADMIN_PRODUCT_ORDER_LIST: (projectId, orderId) => `/management/manage-products/${projectId}/project/${orderId}/order/`,
  ADMIN_CREATE_NEW_PRODUCT: '/management/manage-products/new',
  ADMIN_UPDATE_PRODUCT: (id) => `/management/manage-products/${id}/`,
  ADMIN_PRODUCTS: '/management/manage-products/',
  ADMIN_CREATE_NEW_BRAND: '/management/manage-brands/new',
  ADMIN_BRAND: '/management/manage-brands',
  ADMIN_UPDATE_BRAND: (id) => `/management/manage-brands/${id}/`,
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

export const PM_TASKS = {
  SHARE: 'share',
  APPROVE_ORDER: 'approve_order',
  EDIT_ORDER: 'edit_order',
  APPROVE_CONTRACT: 'approve_contract',
  REJECT: 'reject',
}

export const VENDOR_TASKS = {
  APPROVE_ORDER: 'approve_order',
  EDIT_ORDER: 'edit_order',
  APPROVE_CONTRACT: 'approve_contract',
  REJECT: 'reject',
  MARK_FULFILLED: 'mark_fulfilled',
}

export const ORDER_PHASES = {
    QUOTE: 'Quote',
    COLLABORATION: 'Collaboration',
    CONTRACT: 'Contract',
    DELIVERY: 'Delivery',
    FULFILLMENT: 'Fulfillment',
    COMPLETE: 'Complete',
    REJECTED: 'Rejected',
}

export const RENAMED_STATUS_OPTIONS = {
  REQUESTED: 'Quote/Cart Requested',
  PENDING_BUYER: 'Pending Buyer Approval',
  PENDING_SUPPLIER: 'Pending Supplier Acceptance',
  QUOTE_CREATED: 'Shopping Cart Created',
  CONTRACT: 'Contract',
  DELIVERY: 'Delivery',
  FULFILLMENT: 'Fulfillment',
  COMPLETE: 'Complete',
  REJECTED: 'Rejected',
}

export const BUTTON_OPTIONS = {
  PROJECTS: 1,
  PRODUCTS: 2,
  ORDERS: 3,
  SHOPPING_CART: 4,
  PROGRAM_DOCUMENTS: 5,
}
