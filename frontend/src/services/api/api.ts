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

  userDetail() {
    return this.simple_get(`${API_VERSION_PREFIX}/users/user-detail/`);
  }

  resendVerificationEmail(data: any): ApiReturnType<Types.GenericResponse> {
    return this.simple_post(`${API_VERSION_PREFIX}/users/resend_verification_email/`, data);
  }

  loginGoogle(data: any): ApiReturnType<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/users/login-google/`, data);
  }

  forgotPassword(email: string): ApiReturnType<Types.GenericResponse> {
    return this.simple_post(`${API_VERSION_PREFIX}/users/reset-password/`, { email: email });
  }

  resetPassword(data: any): ApiReturnType<Types.GenericResponse> {
    return this.simple_post(`${API_VERSION_PREFIX}/users/set-new-password/`, data);
  }

  loginWithToken(data: any): ApiReturnType<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/users/login-with-token/`, data);
  }

  support(data: any): ApiReturnType<Types.SimplePostResult> {
    return this.simple_post(`${API_VERSION_PREFIX}/users/support/`, data);
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

  getLanguages() {
    return this.simple_get(`${API_VERSION_PREFIX}/inspector/language/`);
  }

  sendVerificationCode() {
    return this.simple_post(`${API_VERSION_PREFIX}/users/send_phone_code/`);
  }

  completeOwnerData(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/owner/complete/`, data);
  }

  updateInspectorWorkArea(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/inspector/workarea/`, data);
  }

  completeInspectorData(data: any) {
    return this.post_collected_multipart_form_data(`${API_VERSION_PREFIX}/inspector/complete/`, data);
  }

  updateInspectorData(data: any) {
    return this.patch_collected_multipart_form_data(`${API_VERSION_PREFIX}/inspector/update/`, data);
  }

  updateNotificationSettings(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/inspector/notification_settings/`, data);
  }

  updateCredentials(data: any) {
    return this.post_collected_multipart_form_data(`${API_VERSION_PREFIX}/inspector/credentials/`, data);
  }

  getDashboardDataInspector(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/inspector/dashboard/`, data);
  }

  getDashboardDataOwner(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/owner/dashboard/`, data);
  }

  updateOwnerData(data: any) {
    return this.patch_collected_multipart_form_data(`${API_VERSION_PREFIX}/owner/update/`, data);
  }

  updatePassword(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/users/change/`, data);
  }

  deactivateAccount() {
    return this.simple_post(`${API_VERSION_PREFIX}/users/deactivate/`);
  }

  verifyCode(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/users/verify_phone_code/`, data);
  }

  getJobCategories() {
    return this.simple_get(`${API_VERSION_PREFIX}/jobs/categories/`);
  }

  createJob(data: any) {
    return this.post_collected_multipart_form_data(`${API_VERSION_PREFIX}/jobs/`, data);
  }

  editJob(data: any) {
    return this.patch_collected_multipart_form_data(`${API_VERSION_PREFIX}/jobs/${data.id}/`, data);
  }

  getJobs(data: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/jobs/`, data);
  }

  getJob(id: number | string) {
    return this.simple_get(`${API_VERSION_PREFIX}/jobs/${id}/`);
  }

  cancelJob(id: number | string) {
    return this.simple_delete(`${API_VERSION_PREFIX}/jobs/${id}/`);
  }

  markAsCompleted(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/jobs/${data.id}/mark_as_completed/`, data);
  }

  markAsFavorite(id: number | string) {
    return this.simple_post(`${API_VERSION_PREFIX}/jobs/${id}/mark_as_favorite/`);
  }

  markAsViewed(id: number | string) {
    return this.simple_post(`${API_VERSION_PREFIX}/jobs/${id}/viewed/`);
  }

  getBids(data: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/jobs/bids/`, data);
  }

  createBid(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/jobs/bids/`, data);
  }

  getBid(id: number | string) {
    return this.simple_get(`${API_VERSION_PREFIX}/jobs/bids/${id}/`);
  }

  acceptBid(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/jobs/bids/accept/`, data);
  }

  rejectBid(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/jobs/bids/reject/`, data);
  }

  getNotifications(data: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/notifications/`, data);
  }

  markAaRead(id: number | string) {
    return this.simple_post(`${API_VERSION_PREFIX}/notifications/${id}/mark_as_read/`);
  }

  startChat(data: any) {
    return this.simple_post(`${API_VERSION_PREFIX}/chat/start-chat/`, data);
  }

  getChatsAvailable(data: any) {
    return this.simple_get(`${API_VERSION_PREFIX}/chat/`, data);
  }

  getChat(id: number | string) {
    return this.simple_get(`${API_VERSION_PREFIX}/chat/${id}/`);
  }

  getInspectorPublic(id: string | number) {
    return this.simple_get(`${API_VERSION_PREFIX}/inspector/${id}/public-profile/`);
  }


}
