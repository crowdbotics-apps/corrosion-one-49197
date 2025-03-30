
import AdminLayout from "../../../components/AdminLayout";
import React, { useEffect, useState } from "react";
import { FormikProvider, useFormik } from "formik"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import FormikInput from "../../../components/Formik/FormikInput"
import MDBox from "../../../components/MDBox"
import MDButton from "../../../components/MDButton"
import * as Yup from "yup"

function Support() {
  const [loading, setLoading] = useState(false);


  const initialValues = {
    Subject: '',
    description: '',
  };

  const validationSchema = Yup.object().shape({
    Subject: Yup.string().required('Subject is required'),
    description: Yup.string().required('Description is required'),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      const dataToSend = {
        ...values,
      }
    },
  });




  return (
    <AdminLayout title={'Support'} showCard>
      <FormikProvider value={formik}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={12}>
            <Card sx={{p: 3, height: '100%'}}>
              <FormikInput name="Subject" label="Subject" type="text" errors={formik.errors} mb={2}/>
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

            </Card>
          </Grid>

        </Grid>
      </FormikProvider>
    </AdminLayout>
  );
}

export default Support;
