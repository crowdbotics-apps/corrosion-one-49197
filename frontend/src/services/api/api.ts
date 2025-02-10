import {ApiConfig, DEFAULT_API_CONFIG} from "./api-config";
import * as Types from "./api.types";
import {ApiBase, ApiReturnType} from "./api-base";
import {API_VERSION_PREFIX} from "../constants";

/**
 * Manages all requests to the API.
 */
export class Api extends ApiBase {
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    super(config);
  }

  login(username: string, password: string): ApiReturnType<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/users/login/`, {
      email: username,
      password,
    });
  }

  signup(data: any): ApiReturnType<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/users/`, data);
  }

  resendVerificationEmail(data: any): ApiReturnType<Types.GenericResponse> {
    return this.simple_post(`${API_VERSION_PREFIX}/users/resend_verification_email/`, data);
  }

  forgotPassword(email: string): ApiReturnType<Types.GenericResponse> {
    return this.simple_post(`${API_VERSION_PREFIX}/users/reset-password/`, { email: email });
  }

  resetPassword(data: any): ApiReturnType<Types.GenericResponse> {
    return this.simple_post(`${API_VERSION_PREFIX}/users/set-new-password/`, data);
  }

  changePassword(data: any): ApiReturnType<Types.GenericResponse> {
    return this.simple_post(`${API_VERSION_PREFIX}/change-password/`, data);
  }

  getTermsConditions(): ApiReturnType<Types.SimpleGetResult> {
    return this.simple_get(`${API_VERSION_PREFIX}/terms_and_conditions/`);
  }

  getPrivacyPolicy() {
    return this.simple_get(`${API_VERSION_PREFIX}/modules/privacy-policy/`);
  }

  getRegions(data: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/region/`, data);
  }

  getIndustries() {
    return this.simple_get(`${API_VERSION_PREFIX}/owner/industry/`);
  }

  getCredentialsAvailable() {
    return this.simple_get(`${API_VERSION_PREFIX}/inspector/credential/`);
  }

  getCountries() {
    return this.simple_get(`${API_VERSION_PREFIX}/inspector/country/`);
  }

  getStates(data: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/inspector/state/`, data);
  }

  getCities(data: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/inspector/city/`, data);
  }

  sendVerificationCode() {
    return this.simple_post(`${API_VERSION_PREFIX}/users/send_phone_code/`);
  }

  updateOwnerData(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/owner/complete/`, data);
  }

  updateInspectorWorkArea(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/inspector/workarea/`, data);
  }

  updateInspectorData(data: any) {
    return this.post_collected_multipart_form_data(`${API_VERSION_PREFIX}/inspector/complete/`, data);
  }

  verifyCode(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/users/verify_phone_code/`, data);
  }

  getOrdersStatusAdmin(data: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/order/list_status/`, data);
  }

  getOrders(idProject: any, data: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/project/${idProject}/order/`, data);
  }

  getShoppingCartQuantity(idProject: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/project/${idProject}/order/shopping_cart_items/`);
  }

  updateOrderProjectManager(pk: number, data: any) {
    return this.simple_patch(`${API_VERSION_PREFIX}/order/${pk}/update_buyer/`, data);
  }

  getOrder(idProject: number | string, orderId: number | string) {
    return this.simple_get(`${API_VERSION_PREFIX}/project/${idProject}/order/${orderId}/`);
  }

  getOrderDetail(idProject: any, orderId: number | string, version?: number | string) {
    return this.simple_get(
      `${API_VERSION_PREFIX}/project/${idProject}/order/${orderId}/full/` +
        (version ? `?version=${version}` : "")
    );
  }

  getOrderVersions(idProject: number | string, orderId: number | string, data: any) {
    return this.simple_get(
      `${API_VERSION_PREFIX}/project/${idProject}/order/${orderId}/versions/`,
      data
    );
  }

  getOrderActivity(idProject: number | string, orderId: number | string, data: any) {
    return this.simple_get(
      `${API_VERSION_PREFIX}/project/${idProject}/order/${orderId}/activity/`,
      data
    );
  }

  sendOrderMessage(idProject: number | string, orderId: number | string, data: any) {
    return this.post_collected_multipart_form_data(
      `${API_VERSION_PREFIX}/project/${idProject}/order/${orderId}/activity/send_message/`,
      data
    );
  }

  shareOrder(idProject: number | string, orderId: number | string, data: any) {
    return this.post_collected_multipart_form_data(
      `${API_VERSION_PREFIX}/project/${idProject}/order/${orderId}/share_order/`,
      data
    );
  }

  projectManufacturers(idProject: number | string, data: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/project/${idProject}/manufacturers/`, data);
  }

  requestQuote(idProject: number | string, data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/project/${idProject}/request_quote/`, data);
  }

  getCategories(data: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/category/`, data);
  }

  getManufacturers(data?: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/manufacturer/`, data);
  }

  getManufacturerById(manufacturerId?: number | string) {
    return this.simple_get(`${API_VERSION_PREFIX}/manufacturer/${manufacturerId}/`);
  }

  getManufacturersByCategory(category_id: Number, data?: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/manufacturer/by_category/`, {
      category_id,
      ...data,
    });
  }

  getCompanies(data?: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/company/`, data);
  }

  getProjects(data?: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/project/`, data);
  }

  getProject(id: number | string) {
    return this.simple_get(`${API_VERSION_PREFIX}/project/${id}/`);
  }
  getProjectCartSections(idProject: number | string) {
    return this.simple_get(`${API_VERSION_PREFIX}/project/${idProject}/cart_section/`);
  }

  createProjectCartSection(idProject: number | string, data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/project/${idProject}/cart_section/`, data);
  }

  deleteProjectCartSection(idProject: number | string, idProjectCartSection: number | string) {
    return this.simple_delete(
      `${API_VERSION_PREFIX}/project/${idProject}/cart_section/${idProjectCartSection}/`
    );
  }

  addItemToCartOrQuote(idProject: number | string, data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/project/${idProject}/order/add_item/`, data);
  }

  getProjectDashboardInfo(idProject: number | string) {
    return this.simple_get(`${API_VERSION_PREFIX}/project/${idProject}/dashboard/`);
  }

  downloadOrderCutsheets(idProject: number | string, orderId: number | string, params: any) {
    return this.download_file_get(
      `${API_VERSION_PREFIX}/project/${idProject}/order/${orderId}/download_cutsheets/`,
      params
    );
  }

  downloadManufacturerDocuments(idManufacturer: number | string, params: any) {
    return this.download_file_get(
      `${API_VERSION_PREFIX}/manufacturer/${idManufacturer}/download_program_documents/`,
      params
    );
  }

  downloadBrandDrawing(idproject: number | string, iddrawing: number | string) {
    return this.download_file_get(
      `${API_VERSION_PREFIX}/brand/${idproject}/drawing/${iddrawing}/files/`
    );
  }

  getProducts(data: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/product/`, data);
  }

  getProjectProducts(idProject: number | string, data: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/project/${idProject}/product/`, data);
  }

  getMyProfile(data: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/my-profile/`, data);
  }

  saveMyProfile(data: any, keys: any): ApiReturnType<Types.SimplePostResult> {
    return this.post_collected_multipart_form_data(`${API_VERSION_PREFIX}/my-profile/`, data);
  }

}
