import AdminLayout from "../../../components/AdminLayout";
import React, {useEffect, useState} from "react";
import {FormikProvider, useFormik} from "formik"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import FormikInput from "../../../components/Formik/FormikInput"
import MDBox from "../../../components/MDBox"
import MDButton from "../../../components/MDButton"
import * as Yup from "yup"
import {useApi} from "../../../services/helpers";

function Support() {
  const api = useApi()
  const [loading, setLoading] = useState(false);

  const support = (values) => {
    setLoading(true)
    api.support(values).handle({
      successMessage: 'Support request sent successfully',
      onSuccess: () => {
        formik.resetForm()
      },
      errorMessage: 'Error sending support request',
      onFinally: () => setLoading(false)
    })
  }


  const initialValues = {
    subject: '',
    description: '',
  };

  const validationSchema = Yup.object().shape({
    subject: Yup.string().required('Subject is required'),
    description: Yup.string().required('Description is required'),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      support(values)
    },
  });


  return (
    <AdminLayout title={'Corrosion One Support'} showCard>
      <FormikProvider value={formik}>
        <FormikInput name="subject" label="Subject" type="text" errors={formik.errors} mb={2}/>
        <FormikInput
          type="textarea"
          label="Description"
          name="description"
          rows={5}
          mb={2}
        />

        <MDBox display="flex" justifyContent="flex-end" mr={1} mt={'auto'}>
          <MDButton
            color={'secondary'}
            onClick={formik.handleSubmit}
            loading={loading}
            disabled={loading}
          >Submit</MDButton>
        </MDBox>
      </FormikProvider>
    </AdminLayout>
  );
}

export default Support;
