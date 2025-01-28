/**
 =========================================================
 * Material Dashboard 3 PRO React - v2.3.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
 * Copyright 2024 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import {useRef, useState} from "react";

// react-router-dom components
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";

// @mui material components

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

// Image
import bgImage from "assets/svgs/backgroundAuth.svg";

import IllustrationLayout from "components/IllustrationLayout";
import {showMessage, useApi} from "../../../services/helpers";
import {ROUTES} from "../../../services/constants";
import {Form, Formik} from "formik";
import FormikInput from "../../../components/Formik/FormikInput";


function ForgotPassword() {
  const api = useApi()
  const navigate = useNavigate()
  const formikRef = useRef(null);
  const [loading, setLoading] = useState(false);


  const forgotPassword = (data) => {
    setLoading(true)
    api.forgotPassword(data.email).then((result) => {
      if (result.kind === "ok") {
        showMessage('Password reset e-mail has been sent.', 'success')
        navigate(ROUTES.LOGIN)
      } else if (result.kind === "bad-data") {
        formikRef.current.setErrors(result.errors)
        showMessage(result.errors.details)
      } else {
        showMessage()
      }
    })
      .catch(err => showMessage(err.message))
      .finally(() => setLoading(false))
  }
  const validationSchema =
    Yup.object().shape({
      email: Yup.string().email().required()
    })

  const initialValues = {
    email: "",
  };

  return (
    <IllustrationLayout
      title="Forgot Password"
      description="Please enter your registered email address and we will send you a link to reset your password."
      illustration={bgImage}
    >
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnBlur={false}
        onSubmit={values => {
          forgotPassword(values);
        }}
      >
        {({errors, isValid}) => (
          <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
            <FormikInput
              name={'email'}
              label={'Email address'}
              type={'email'}
              errors={errors}
            />
            <MDBox mt={7} mb={3}>
              <MDButton
                fullWidth
                variant="contained"
                color="primary"
                loading={loading}
                disabled={loading || !isValid}
                type='submit'
                size={"large"}
              >
                Confirm
              </MDButton>
            </MDBox>
            <MDBox>
              <MDButton
                fullWidth
                variant="outlined"
                color="secondary"
                disabled={loading}
                size={"large"}
                mt={2}
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Cancel
              </MDButton>
            </MDBox>
          </Form>
        )}
      </Formik>
    </IllustrationLayout>
  );
}

export default ForgotPassword;
