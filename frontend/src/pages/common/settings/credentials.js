import MDTypography from "../../../components/MDTypography";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import {Form, FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import FormikInput from "../../../components/Formik/FormikInput";
import {useLoginStore} from "../../../services/helpers";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";


function Credentials({updateCredentials, credentials, loading}) {
  const loginStore = useLoginStore();

  const initialValues  = {
    credentials: [],
  }

  const validationSchema = Yup.object().shape({
    credentials: Yup.array().min(1, 'At least one credential is required'),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    }
  })

  const renderCurrentCredentials = (credential) => {

    return (
      <MDBox
        key={credential.id}
        display="flex"
        alignItems="center"
        borderRadius="12px"
        p={1}
        px={1}
        sx={{border: '1px solid #C6C9CE'}}
        // optional: add minWidth so text + X have some horizontal space
      >
        <IconButton
          aria-label="remove"
          size="small"
          // onClick={() => handleRemove ? handleRemove(item.id) : null}
          sx={{mr: 1, p: 0}} // small margin to separate from text
        >
          <HighlightOffIcon sx={{color: "#E14640", height: 26, width: 26}}/>
        </IconButton>
        <MDTypography sx={{fontSize: 14, fontWeight: 500}}>
          {credential.name}
        </MDTypography>
        {credential.document && <MDButton
          color={"secondary"}
          variant={"outlined"}
          size={"small"}
          sx={{marginLeft: "auto"}}
        >
          View document
        </MDButton>}
        {!credential.document && <MDButton
          color={"primary"}
          variant={"outlined"}
          size={"small"}
          sx={{marginLeft: "auto"}}
        >
          Add document
        </MDButton>}
      </MDBox>
    )
  }

  return (
    <MDBox>
      <MDTypography fontSize={"18px"} sx={{fontWeight: 500}}>
        Credentials
      </MDTypography>
      <FormikProvider value={formik}>
        <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <FormikInput
            type={"autocomplete"}
            value={null}
            fieldName={"credentials"}
            label={"Credentials"}
            placeholder={"Credentials"}
            options={credentials}
            accessKey={"name"}
            multiple
            onChange={(value) => {
              const currentValues = [...formik.values.credentials]
              if (currentValues.find((item) => item.id === value?.[0]?.id)) return
              currentValues.push(value[0])
              formik.setFieldValue('credentials', currentValues)
            }}
          />
        </Form>
      </FormikProvider>
      {loginStore.credentials.map((item) => renderCurrentCredentials(item))}
      <MDBox sx={{height: '1px', width: "100%", backgroundColor: "#E4E5E8"}} my={3} />
      <MDBox display={"flex"}>
        <MDButton
          type={"submit"}
          variant={"contained"}
          color={"secondary"}
          size={"large"}
          sx={{marginLeft: "auto"}}
          disabled={loading}
          loading={loading}
        >
          Save Changes
        </MDButton>
      </MDBox>
    </MDBox>
  );

}

export default Credentials;
