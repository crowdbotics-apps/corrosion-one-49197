import MDTypography from "../../../components/MDTypography";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import {Form, FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import FormikInput from "../../../components/Formik/FormikInput";
import Grid from "@mui/material/Grid";
import CustomCheckbox from "../../../components/CheckboxCustom";
import {ROLES} from "../../../services/constants";
import {useLoginStore} from "../../../services/helpers";


function AccountSettings({updateSMSNotificationSettings, updateNotificationSettings, changePassword, formikRefAccountSettings, setShowDeleteModal, loading = false}) {
  const loginStore = useLoginStore();

  const initialValues = {
    current_password: "",
    new_password: "",
    confirm_password: ""
  }

  const validationSchema = Yup.object().shape({
    current_password: Yup.string().required('Current password is required'),
    new_password: Yup.string().required('New password is required'),
    confirm_password: Yup.string().required('Confirm password is required').oneOf([Yup.ref("new_password")], "Passwords must match"),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, {resetForm}) => {
      changePassword(values);
    }
  })

  formikRefAccountSettings.current = formik;

  return (
    <MDBox>
      <MDTypography fontSize={"18px"} sx={{fontWeight: 500}} mb={2}>
        Notifications
      </MDTypography>
      <CustomCheckbox
        checked={loginStore.cta_agreement}
        text="SMS Notifications"
        onCheck={() => updateSMSNotificationSettings({sms_notification_settings: "cta_agreement"})}
      />
      {loginStore.user_type === ROLES.INSPECTOR && <>
        <CustomCheckbox
          checked={loginStore.notify_im_qualified}
          text="Notify me when a job I'm qualified for is posted"
          onCheck={() => updateNotificationSettings({notification_setting: "notify_im_qualified"})}
        />
        <CustomCheckbox
          checked={loginStore.notify_new_message}
          text="Notify me when  I receive a message"
          onCheck={() => updateNotificationSettings({notification_setting: "notify_new_message"})}
        />
        <CustomCheckbox
          checked={loginStore.notify_job_applied}
          text="Notify me updates on jobs I've applied for"
          onCheck={() => updateNotificationSettings({notification_setting: "notify_job_applied"})}
        />
        <MDBox sx={{height: '1px', width: "100%", backgroundColor: "#E4E5E8"}} my={3} />
      </>}
      <MDTypography fontSize={"18px"} sx={{fontWeight: 500}} mb={2}>
        Change Password
      </MDTypography>
      <FormikProvider value={formik}>
        <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <Grid container spacing={{xs: 0, lg: 3}}>
            <Grid item xs={12} lg={4}>
              <FormikInput
                name={'current_password'}
                label={'Current Password'}
                type={'password'}
                errors={formik.errors}
                mb={2}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormikInput
                name={'new_password'}
                label={'New Password'}
                type={'password'}
                errors={formik.errors}
                mb={2}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormikInput
                name={'confirm_password'}
                label={'Confirm New Password'}
                type={'password'}
                errors={formik.errors}
                mb={2}
              />
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
      <MDButton
        type={"submit"}
        variant={"contained"}
        color={"secondary"}
        size={"large"}
        loading={loading}
        disabled={loading}
        onClick={formik.handleSubmit}
      >
        Change Password
      </MDButton>
      <MDBox sx={{height: '1px', width: "100%", backgroundColor: "#E4E5E8"}} my={3} />
      <MDTypography fontSize={"18px"} sx={{fontWeight: 500}} mb={2}>
        Delete your {loginStore.user_type === ROLES.INSPECTOR ? "account" : "company"}
      </MDTypography>
      <MDTypography fontSize={"14px"} mb={2}>
        If you delete your Corrosion One account, you will no longer be able to get information about the
        matched jobs, following employers, and job alert, shortlisted jobs and more. You will be abandoned
        from all the services of Corrosion One.
      </MDTypography>
      <MDButton
        variant={"contained"}
        color={"error"}
        size={"large"}
        onClick={() => setShowDeleteModal(true)}
        disabled={loading}
        loading={loading}
      >
        Delete {loginStore.user_type === ROLES.INSPECTOR ? "Account" : "Company"}
      </MDButton>
    </MDBox>
  );

}

export default AccountSettings;
