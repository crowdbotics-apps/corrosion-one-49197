import MDTypography from "../../../components/MDTypography";
import Grid from "@mui/material/Grid";
import MDBox from "../../../components/MDBox";
import Icon from "@mui/material/Icon";
import MDButton from "../../../components/MDButton";
import {useState} from "react";
import {useLoginStore} from "../../../services/helpers";
import {Form, FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import FormikInput from "../../../components/Formik/FormikInput";
import DocumentItem from "./documentItem";
import AddDocumentBox from "./addDocumentBox";
import RenderWorkArea from "../../../components/RenderListOption";

function ProfileInspector({updateProfile, languages = [], loading = false}) {
  const loginStore = useLoginStore();
  const [selectedFile, setSelectedFile] = useState(null);

  const [docs, setDocs] = useState([
    // {id: 1, name: 'Supporting Document', size: 3.5},
    // {id: 2, name: 'Supporting Document 2', size: 4.7},
    // {id: 3, name: 'Supporting Document 2', size: 4.7},
    // {id: 4, name: 'Supporting Document 2', size: 4.7},
    // {id: 5, name: 'Supporting Document 2', size: 4.7},
  ]);


  const handleOpenDownload = (doc) => {
    // Example: just alert, or open a new page, etc.
    alert(`Open / Download: ${doc.name}`);
  };

  const handleDelete = (doc) => {
    // Remove from array
    setDocs((prevDocs) => prevDocs.filter((d) => d.id !== doc.id));
  };

  const handleAddDocument = () => {
    // Example: could open file dialog, or show a modal
    alert('Add Document clicked!');
  };


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  }


  const initialValues = {
    profile_picture: loginStore.profile_picture,
    first_name: loginStore.first_name,
    last_name: loginStore.last_name,
    email: loginStore.email,
    phone_number: loginStore.phone_number,
    user_type: loginStore.user_type,
    date_of_birth:  loginStore.date_of_birth,
    website: loginStore.website,
    linkedin: loginStore.linkedin,
    documents: loginStore.support_documents,
    languages: loginStore.languages,
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
      updateProfile(values);
    }
  });


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
                {selectedFile ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                  />
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
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleFileChange}
                      />
                    </MDButton>
                  </>
                )}
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
                type={'date'}
                errors={formik.errors}
                containerStyle={{mb: 4}}
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
                {formik.values.languages.map((item) => <RenderWorkArea key={item.id} item={item}/>)}
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
        {docs.map((doc) => (
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
          <AddDocumentBox onClick={handleAddDocument}/>
        </Grid>
      </Grid>
      <MDBox sx={{height: '1px', width: "100%", backgroundColor: "#E4E5E8"}} my={3} />
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
