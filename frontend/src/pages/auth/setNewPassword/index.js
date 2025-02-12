/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import {Link, useNavigate} from "react-router-dom";


// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Image
import bgImage from "assets/svgs/backgroundAuth.svg";
import IllustrationLayout from "../../../components/IllustrationLayout";
import pxToRem from "../../../assets/theme/functions/pxToRem";
import {ROUTES} from "../../../services/constants";
import {observer} from "mobx-react";
import {showMessage, useApi} from "../../../services/helpers";
import {useRef, useState} from "react";
import * as Yup from "yup";
import {Field, Form, Formik} from "formik";
import FormikInput from "../../../components/Formik/FormikInput";

function SetNewPassword() {
  const api = useApi()
  const navigate = useNavigate()
  const formikRef = useRef();
  const [loading, setLoading] = useState(false);
  const getUrls = window.location.href.split('set-new-password/')[1].split('/')

  const resetPassword = (data) => {
    const form = {
      new_password: data.password,
      new_password2: data.new_password2,
      uidb64: getUrls[0],
      token: getUrls[1]
    }
    setLoading(true)
    api.resetPassword(form).then((result) => {
      if (result.kind === "ok") {
        showMessage('Password reset successful', 'success')
        navigate(ROUTES.LOGIN)
      } else if(result.kind === "bad-data") {
        console.log(result.errors)
        if (result.errors.token) {
          showMessage(result.errors.token)
        } else {
          showMessage(result.errors?.errors)
          formikRef.current.setErrors(result.errors)
        }
      } else {
        showMessage()
      }
    })
      .catch(err => {
        showMessage()
        console.log(err)
      })
      .finally(() => setLoading(false))
  }

  const validationSchema =
    Yup.object().shape({
      password: Yup.string().required('Password is required'),
      new_password2: Yup.string().required('Confirm password is required').oneOf([Yup.ref('password'), null], "Passwords doesn't match"),
    })

  const initialValues = {
    password: "",
    new_password2: "",
  };

  return (
    <IllustrationLayout
      title="Set New Password"
      description=""
      illustration={bgImage}
    >
      <MDBox>
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={values => {
            resetPassword(values);
          }}
        >
          {({errors, touched, isValid}) => (
            <Form >
              <FormikInput name={'password'} label={'New Password'} type={'password'} errors={errors} mb={4}/>
              <FormikInput name={'new_password2'} label={'Confirm New Password'} type={'password'} errors={errors}/>
              <MDBox mt={10} mb={1} textAlign={"center"}>
                <MDButton
                  loading={loading}
                  disabled={loading || !isValid}
                  type='submit'
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Save
                </MDButton>
              </MDBox>
            </Form>
          )}
        </Formik>
      </MDBox>
    </IllustrationLayout>
  );
}

export default observer(SetNewPassword);
