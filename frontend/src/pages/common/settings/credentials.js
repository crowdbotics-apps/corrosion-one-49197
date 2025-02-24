import MDTypography from "../../../components/MDTypography";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import {Form, FormikProvider, useFormik} from "formik";
import * as Yup from "yup";
import FormikInput from "../../../components/Formik/FormikInput";
import {useLoginStore} from "../../../services/helpers";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React from "react";
import {CredentialsInspector} from "../../../components/CredentialsInspector";


function Credentials({updateCredentials, credentials, loading}) {
  const loginStore = useLoginStore();

  const initialValues  = {
    credentials: JSON.parse(JSON.stringify(loginStore.credentials)),
  }

  const validationSchema = Yup.object().shape({
    // credentials: Yup.array().min(1, 'At least one credential is required'),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log('values', values)
      updateCredentials(values);
    }
  })

  const handleRemove = (id) => {
    const currentValues = formik.values.credentials.filter((item) => item.id !== id)
    formik.setFieldValue('credentials', currentValues)
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
              const newValues = {...value[0], credential_id: value[0].id}
              currentValues.push(newValues)
              formik.setFieldValue('credentials', currentValues)
            }}
          />
        </Form>
      </FormikProvider>
      {formik.values.credentials.map((item, index) => (
        <CredentialsInspector
          id={index}
          key={index}
          credential={item}
          handleRemove={handleRemove}
          setFieldValue={formik.setFieldValue}
        />
      ))}
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
          onClick={formik.handleSubmit}
        >
          Save Changes
        </MDButton>
      </MDBox>
    </MDBox>
  );

}

export default Credentials;
