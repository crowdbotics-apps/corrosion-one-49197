import MDTypography from "../../../components/MDTypography";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import Icon from "@mui/material/Icon";
import MDButton from "../../../components/MDButton";
import {useRef, useState} from "react";
import {checkUrl, truncateFilename, useLoginStore} from "../../../services/helpers";
import {Form, FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import FormikInput from "../../../components/Formik/FormikInput";
import DocumentItem from "./documentItem";
import AddDocumentBox from "./addDocumentBox";
import RenderWorkArea from "../../../components/RenderListOption";
import moment from "moment";

function ProfileInspector({updateProfile, languages = [], loading = false}) {
  const loginStore = useLoginStore();
  const fileInputRef = useRef(null);

  const handleOpenDownload = (doc) => {
    window.open(checkUrl(doc.document), '_blank');
  };

  const handleDelete = (item) => {
    formik.setFieldValue('support_documents', formik.values.support_documents.filter((doc) => doc.id !== item.id))
  };

  const handleAddDocument = (e) => {
    const file = e.target.files[0];
    const filename = truncateFilename(file.name);
    const newFile = new File([file], filename, {type: file.type});
   formik.setFieldValue('support_documents', [...formik.values.support_documents, {id: Math.random(), name: filename, file: newFile}])
  };


  const handleFileChange = (e) => {
    formik.setFieldValue('profile_picture', e.target.files[0])
  }


  const initialValues = {
    profile_picture: loginStore.profile_picture,
    first_name: loginStore.first_name,
    last_name: loginStore.last_name,
    email: loginStore.email,
    phone_number: loginStore.phone_number,
    date_of_birth:  loginStore.date_of_birth ? moment(loginStore.date_of_birth).format("MM/DD/YYYY") : "",
    website: loginStore.website || "",
    linkedin: loginStore.linkedin || "",
    languages: loginStore.languages,
    support_documents: loginStore.support_documents
  }

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    phone_number: Yup.string().required("Phone number is required"),
    website: Yup.string().url("Invalid URL").nullable(),
    linkedin: Yup.string().url("Invalid URL").nullable(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const dataToSend = {
        ...values,
        profile_picture: typeof formik.values.profile_picture === 'object' ? formik.values.profile_picture : checkUrl(loginStore.profile_picture),
        date_of_birth: moment(values.date_of_birth, "MM/DD/YYYY", true).format("YYYY-MM-DD")
      }
      dataToSend.languages = dataToSend.languages.map((item) => item.id)
      updateProfile(dataToSend)
    }
  });

  const removeLanguage = (id) => {
    const currentValues = [...formik.values.languages]
    const newValues = currentValues.filter((item) => item.id !== id)
    formik.setFieldValue('languages', newValues)
  }


  return (
    <MDBox>
      <MDTypography fontSize={"18px"} sx={{fontWeight: 500}}>
        Basic Information
      </MDTypography>
      <FormikProvider value={formik}>
        <Form>
          <Grid container spacing={{xs: 0, lg: 3}}>
            <Grid item xs={12} lg={4}>
              <MDBox
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: '50%',
                  width: 250,
                  height: 250,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  flexDirection: 'column',
                  margin: '0 auto 0 auto',
                  mb: 2
                }}
              >
                {/* If a file is selected, show image preview; otherwise, show instructions */}
                {typeof formik.values.profile_picture === 'object' && formik.values.profile_picture ? (
                  <>
                    <img
                      src={URL.createObjectURL(formik.values.profile_picture)}
                      onClick={() => fileInputRef?.current?.click()}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      ref={fileInputRef}
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleFileChange}
                    />
                  </>
                ) : loginStore.profile_picture ? (
                  <>
                    <img
                      // TODO: esto es una mierda cambiar por ref
                      onClick={() => fileInputRef?.current?.click()}
                      src={checkUrl(loginStore.profile_picture)}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      ref={fileInputRef}
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleFileChange}
                    />
                  </>
                ) : (
                  <>
                    <Icon sx={{fontSize: 48, color: '#aaa', mb: 1}}>photo_camera_outlined</Icon>
                    <MDTypography variant="body2" sx={{mb: 1, fontSize: 12, mx: 1, color: "#767F8C"}}>
                      A photo larger than 400 pixels works best.
                      Max photo size 5 MB.
                    </MDTypography>
                    <MDButton variant="contained" component="label">
                      Upload Photo
                      <input
                        ref={fileInputRef}
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleFileChange}
                      />
                    </MDButton>
                  </>
                )
                }
              </MDBox>
            </Grid>
            <Grid item xs={12} lg={4}>
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
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormikInput
                name={'phone_number'}
                label={'Phone Number'}
                type={'phone_input'}
                errors={formik.errors}
                mb={2}
              />
              <FormikInput
                name={'date_of_birth'}
                label={'Date of Birth'}
                type={'date_year'}
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
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormikInput
                type={"autocomplete"}
                placeholder={"Languages"}
                value={null}
                fieldName={"languages"}
                label={"Languages"}
                options={languages}
                accessKey={"name"}
                multiple
                onChange={(value) => {
                  const currentValues = [...formik.values.languages]
                  if (currentValues.find((item) => item.id === value?.[0]?.id)) return
                  currentValues.push(value[0])
                  formik.setFieldValue('languages', currentValues)
                }}
              />
              <MDBox display="flex" flexDirection="row" flexWrap="wrap" gap={1} mb={2}>
                {formik.values.languages.map((item) => <RenderWorkArea key={item.id} item={item} handleRemove={removeLanguage}/>)}
              </MDBox>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormikInput
                name={'linkedin'}
                label={'Linkedin'}
                type={'text'}
                errors={formik.errors}
                mb={2}
              />
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
      <MDTypography fontSize={"18px"} sx={{fontWeight: 500}} mb={2}>
        Supporting Documents
      </MDTypography>
      <Grid container spacing={2}>
        {formik.values.support_documents.map((doc) => (
          <Grid item key={doc.id}>
            <DocumentItem
              key={doc.id}
              doc={doc}
              onOpenDownload={handleOpenDownload}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
        {/* "Add Supporting Document" dashed box */}
        <Grid item>
          <label htmlFor='input_file'>
            <AddDocumentBox />
          </label>
            <input
              id={'input_file'}
              hidden
              accept=".pdf,.xlsx,.docx"
              type="file"
              onChange={handleAddDocument}
            />
        </Grid>
      </Grid>
      <MDBox sx={{height: '1px', width: "100%", backgroundColor: "#E4E5E8"}} my={3}/>
      <MDBox display={"flex"}>
        <MDButton
          type={"submit"}
          variant={"contained"}
          color={"secondary"}
          size={"large"}
          sx={{marginLeft: "auto"}}
          disabled={loading}
          onClick={formik.handleSubmit}
        >
          Save Changes
        </MDButton>
      </MDBox>
    </MDBox>
  );
}

export default ProfileInspector;
