import MDTypography from "../../../components/MDTypography";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import Icon from "@mui/material/Icon";
import MDButton from "../../../components/MDButton";
import {useState} from "react";
import {checkUrl, isFile, useLoginStore} from "../../../services/helpers";
import {Form, FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import FormikInput from "../../../components/Formik/FormikInput";
import DocumentItem from "./documentItem";
import AddDocumentBox from "./addDocumentBox";
import Divider from "@mui/material/Divider";
import ImageUploadCard from "./imageUploadCard";

function ProfileOwner({updateProfile, industries, loading}) {
  const loginStore = useLoginStore();

  const initialValues = {
    first_name: loginStore.first_name,
    last_name: loginStore.last_name,
    email: loginStore.email,
    phone_number: loginStore.phone_number,
    website: loginStore.website,
    linkedin: loginStore.linkedin,
    company_name: loginStore.company_name,
    address: loginStore.address,
    industry: loginStore.industry,
    logo: loginStore.logo,
    banner: loginStore.banner,
  }

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    phone_number: Yup.string().required("Phone number is required"),
    website: Yup.string().url("Invalid URL").nullable(),
    linkedin: Yup.string().url("Invalid URL").nullable(),
    company_name: Yup.string().required("Company name is required"),
    // address: Yup.string().required("Address is required"),
    // industry: Yup.string().required("Industry is required"),
    logo: Yup.string().required("Logo is required"),
    banner: Yup.string().required("Banner is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const dataToSend = {
        ...values,
        industry: values.industry.id,
        logo: typeof formik.values.logo === 'object' ? formik.values.logo : checkUrl(loginStore.logo),
        banner: typeof formik.values.banner === 'object' ? formik.values.banner : checkUrl(loginStore.banner),
      }
      updateProfile(dataToSend);
    }
  });
  const replaceLogo = (file) => {
    formik.setFieldValue('logo', file)
  };

  const replaceBanner = (file) => {
    formik.setFieldValue('banner', file)
  };


  return (
    <MDBox>
      <MDTypography fontSize={"18px"} sx={{fontWeight: 500}} mb={2}>
        Logo & Banner
      </MDTypography>
      <Grid container spacing={{xs: 0, lg: 3}}>
        <Grid item xs={12} lg={2}>
          <ImageUploadCard
            title={"Upload Logo"}
            imageSrc={formik.values.logo && isFile(formik.values.logo) ?  formik.values.logo : checkUrl(formik.values.logo)}
            fileSize={loginStore.logo_size}
            onReplace={replaceLogo}
          />
        </Grid>
        <Grid item xs={12} lg={10}>
          <ImageUploadCard
            title={"Banner Image"}
            imageSrc={formik.values.banner && isFile(formik.values.banner) ?  formik.values.banner : checkUrl(formik.values.banner)}
            fileSize={loginStore.banner_size}
            onReplace={replaceBanner}
          />
        </Grid>
      </Grid>
      <MDTypography fontSize={"18px"} sx={{fontWeight: 500}} mb={2}>
        Basic Information
      </MDTypography>
      <FormikProvider value={formik}>
        <Form>
          <Grid container spacing={{xs: 0, lg: 3}}>
            <Grid item xs={12} lg={6}>
              <FormikInput
                name={'first_name'}
                label={'First Name'}
                type={'text'}
                errors={formik.errors}
                mb={2}
              />
              <FormikInput
                name={'last_name'}
                label={'Last Name'}
                type={'text'}
                errors={formik.errors}
                mb={2}
              />
              <FormikInput
                name={'email'}
                label={'Email'}
                type={'email'}
                errors={formik.errors}
                disabled
                mb={2}
              />
              <FormikInput
                name={'address'}
                label={'Address'}
                type={'text'}
                errors={formik.errors}
                mb={2}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormikInput
                name={'phone_number'}
                label={'Phone Number'}
                type={'phone_input'}
                errors={formik.errors}
                mb={2}
              />
              <FormikInput
                name={'company_name'}
                label={'Company name'}
                type={'text'}
                errors={formik.errors}
                mb={2}
              />
              <FormikInput
                name={'website'}
                label={'Personal website'}
                type={'text'}
                errors={formik.errors}
                mb={2}
              />
              <FormikInput
                name={'linkedin'}
                label={'Linkedin'}
                type={'text'}
                errors={formik.errors}
                mb={2}
              />
            </Grid>
            <Grid item xs={12}>
              <FormikInput
                type={"autocomplete"}
                placeholder={"Industry"}
                value={formik.values.industry}
                fieldName={"industry"}
                label={"Industry"}
                options={industries}
                accessKey={"name"}
                onChange={(value) => {
                  formik.setFieldValue('industry', value)
                }}
                disableClearable
                styleContainer={{mb: 2}}
              />
            </Grid>

          </Grid>
        </Form>
      </FormikProvider>
      <MDBox sx={{height: '1px', width: "100%", backgroundColor: "#E4E5E8"}} my={3} />
      <MDBox display={"flex"}>
        <MDButton
          type={"submit"}
          variant={"contained"}
          color={"secondary"}
          size={"large"}
          sx={{marginLeft: "auto"}}
          onClick={formik.handleSubmit}
          disabled={loading}
          loading={loading}
        >
          Save Changes
        </MDButton>
      </MDBox>
    </MDBox>
  );
}

export default ProfileOwner;
