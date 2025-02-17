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
import Divider from "@mui/material/Divider";
import ImageUploadCard from "./imageUploadCard";

function ProfileOwner({updateProfile}) {
  const loginStore = useLoginStore();
  const [selectedFile, setSelectedFile] = useState(null);

  const [docs, setDocs] = useState([
    {id: 1, name: 'Supporting Document', size: 3.5},
    {id: 2, name: 'Supporting Document 2', size: 4.7},
    {id: 2, name: 'Supporting Document 2', size: 4.7},
    {id: 2, name: 'Supporting Document 2', size: 4.7},
    {id: 2, name: 'Supporting Document 2', size: 4.7},
    {id: 3, name: 'Supporting Document 3', size: 1.3}
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
    first_name: loginStore.first_name,
    last_name: loginStore.last_name,
    email: loginStore.email,
    phone_number: loginStore.phone_number,
    user_type: loginStore.user_type,
    date_of_birth: "",
    website: "",
    linkedin: "",
    documents: [],
    experience: [],
  }

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone_number: Yup.string().required("Phone number is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      updateProfile(values);
    }
  });

  const [logo, setLogo] = useState({
    src: '',         // or a real URL
    size: 3.5,
    isUploaded: true
  });
  const [banner, setBanner] = useState({
    src: '',         // or a real URL
    size: 4.3,
    isUploaded: true
  });

  // Example remove/replace handlers
  const removeLogo = () => {
    setLogo({ src: '', size: 0, isUploaded: false });
  };
  const replaceLogo = () => {
    // This is where you'd open a file dialog, then set a new `src`, etc.
    alert('Replace logo clicked');
  };

  const removeBanner = () => {
    setBanner({ src: '', size: 0, isUploaded: false });
  };
  const replaceBanner = () => {
    alert('Replace banner clicked');
  };


  return (
    <MDBox>
      <MDTypography fontSize={"18px"} sx={{fontWeight: 500}} mb={2}>
        Logo & Banner
      </MDTypography>
      <Grid container spacing={{xs: 0, lg: 3}}>
        <Grid item xs={12} lg={2}>
          <ImageUploadCard
            title="Upload Logo"
            imageSrc={logo.isUploaded ? logo.src : ''}
            fileSize={logo.isUploaded ? logo.size : null}
            onRemove={removeLogo}
            onReplace={replaceLogo}
          />
        </Grid>
        <Grid item xs={12} lg={10}>
          <ImageUploadCard
            title="Banner Image"
            imageSrc={banner.isUploaded ? banner.src : ''}
            fileSize={banner.isUploaded ? banner.size : null}
            onRemove={removeBanner}
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
        >
          Save Changes
        </MDButton>
      </MDBox>
    </MDBox>
  );
}

export default ProfileOwner;
