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

import {useEffect, useRef, useState} from "react";

// react-router-dom components
import {Link, useNavigate} from "react-router-dom";
import * as Yup from "yup";

// @mui material components
import Switch from "@mui/material/Switch";

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Image
import bgImage from "assets/svgs/backgroundAuth.svg";
import IllustrationLayout from "components/IllustrationLayout";
import {useApi, useLoginStore} from "../../../services/helpers";
import {ROLES, ROUTES} from "../../../services/constants";
import {runInAction} from "mobx";
import {Form, Formik} from "formik";
import FormikInput from "../../../components/Formik/FormikInput";


function SignIn() {
  const loginStore = useLoginStore();
  const api = useApi()
  const navigate = useNavigate()
  const formikRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);


  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const login = (data) => {
    setLoading(true)
    api.login(data.email, data.password).handle( {
        onSuccess: (result) => {
          const {response} = result
          const {user, access_token} = response
          runInAction(() => {
            loginStore.setUser(user)
            loginStore.setApiToken(access_token)
          })

          if (user.is_superuser || user.group === ROLES.ADMIN.name) {
            navigate(ROUTES.ADMIN_ANALYTICS)
          } else if (!(user.is_superuser || user.group === ROLES.ADMIN.name) && user?.password_changed_by_admin) {
            navigate(ROUTES.USER_CHANGE_PASSWORD)
          } else {
            navigate(ROUTES.USER_PROJECT_SELECTOR)
          }
        },
        errorMessage: 'Error signing in',
        onError: (result) => {
          formikRef.current?.setErrors(result.errors)
        },
        onFinally: () => setLoading(false)
      }
    )
  }

  const validationSchema =
    Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

  const initialValues = {
    email: "",
    password: "",
  };

  useEffect(() => {
    // if (loginStore.isLoggedIn) {
    //   if (loginStore.is_superuser || loginStore.group === ROLES.ADMIN.name) {
    //     navigate(ROUTES.ADMIN_ANALYTICS)
    //   } else {
    //     navigate(ROUTES.USER_PROJECT_SELECTOR)
    //   }
    // }

  }, [])

  return (
    <IllustrationLayout
      title="Sign In"
      description="Enter your email and password to sign in"
      illustration={bgImage}
    >
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnBlur={false}
        onSubmit={values => {
          login(values);
        }}
      >
        {({errors, isValid}) => (
          <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
            <FormikInput
              name={'email'}
              label={'Email address'}
              type={'email'}
              errors={errors}
              mb={2}
            />
            <FormikInput
              name={'password'}
              label={'Password'}
              type={'password'}
              errors={errors}
            />
            <MDBox textAlign="right">
              <MDTypography variant="button" color="text">
                <MDTypography
                  component={Link}
                  to={ROUTES.FORGOT_PASSWORD}
                  variant="button"
                  color="dark"
                  fontWeight="regular"
                >
                  Forgot Password?
                </MDTypography>
              </MDTypography>
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={10} mb={1} textAlign={"center"}>
              <MDButton
                fullWidth
                variant="contained"
                color="primary"
                loading={loading}
                disabled={loading || !isValid}
                type='submit'
              >
                Continue
              </MDButton>
            </MDBox>
          </Form>
        )}
      </Formik>
      {/*<MDBox component="form" role="form">*/}
      {/*  <MDBox mb={2}>*/}
      {/*    <MDInput type="email" label="Email" fullWidth />*/}
      {/*  </MDBox>*/}
      {/*  <MDBox mb={2}>*/}
      {/*    <MDInput type="password" label="Password" fullWidth />*/}
      {/*  </MDBox>*/}
      {/*  <MDBox display="flex" alignItems="center" ml={-1}>*/}
      {/*    <Switch checked={rememberMe} onChange={handleSetRememberMe} />*/}
      {/*    <MDTypography*/}
      {/*      variant="button"*/}
      {/*      fontWeight="regular"*/}
      {/*      color="text"*/}
      {/*      onClick={handleSetRememberMe}*/}
      {/*      sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}*/}
      {/*    >*/}
      {/*      &nbsp;&nbsp;Remember me*/}
      {/*    </MDTypography>*/}
      {/*  </MDBox>*/}
      {/*  <MDBox mt={4} mb={1}>*/}
      {/*    <MDButton variant="contained" color="primary" size="large" fullWidth>*/}
      {/*      sign in*/}
      {/*    </MDButton>*/}
      {/*  </MDBox>*/}
      {/*  <MDBox mt={4} mb={1}>*/}
      {/*    <MDButton variant="outlined" color="secondary" size="large" fullWidth>*/}
      {/*      cancel*/}
      {/*    </MDButton>*/}
      {/*  </MDBox>*/}
      {/*  <MDBox mt={3} textAlign="center">*/}
      {/*    <MDTypography variant="button" color="text">*/}
      {/*      Don&apos;t have an account?{" "}*/}
      {/*      <MDTypography*/}
      {/*        component={Link}*/}
      {/*        to="/authentication/sign-up/cover"*/}
      {/*        variant="button"*/}
      {/*        color="info"*/}
      {/*        fontWeight="medium"*/}
      {/*        textGradient*/}
      {/*      >*/}
      {/*        Sign up*/}
      {/*      </MDTypography>*/}
      {/*    </MDTypography>*/}
      {/*  </MDBox>*/}
      {/*</MDBox>*/}
    </IllustrationLayout>
  );
}

export default SignIn;
