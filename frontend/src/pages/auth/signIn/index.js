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
import MDButton from "components/MDButton";

// Image
import bgImage from "assets/svgs/backgroundAuth.svg";
import facebookIcon from "assets/svgs/facebook.svg";
import googleIcon from "assets/svgs/google.svg";

import IllustrationLayout from "components/IllustrationLayout";
import {useApi, useLoginStore} from "../../../services/helpers";
import {ROLES, ROUTES} from "../../../services/constants";
import {runInAction} from "mobx";
import {Form, Formik} from "formik";
import FormikInput from "../../../components/Formik/FormikInput";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";


function SignIn() {
  const loginStore = useLoginStore();
  const api = useApi()
  const navigate = useNavigate()
  const formikRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);


  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const login = (data) => {
    setLoading(true)
    api.login(data.email, data.password).handle({
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

  const googleSignIn = () => {
    console.log('Google Sign In')
  }

  const facebookSignIn = () => {
    console.log('Facebook Sign In')
  }

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
            <Grid container>
              <Grid item xs={6}>
                <MDBox display="flex" alignItems="center" ml={-1}>
                  <Switch checked={rememberMe} onChange={handleSetRememberMe}/>
                  <MDTypography
                    variant="button"
                    fontWeight="regular"
                    color="text"
                    onClick={handleSetRememberMe}
                    sx={{cursor: "pointer", userSelect: "none", ml: -1}}
                  >
                    &nbsp;&nbsp;Remember me
                  </MDTypography>
                </MDBox>
              </Grid>
              <Grid item xs={6}>
                <MDBox textAlign="right">
                  <MDTypography
                    component={Link}
                    to={ROUTES.FORGOT_PASSWORD}
                    variant="button"
                    color="text"
                    fontWeight="regular"
                  >
                    Forgot Password?
                  </MDTypography>
                </MDBox>
              </Grid>
            </Grid>
            <MDBox mt={8} mb={1} textAlign={"center"}>
              <MDButton
                fullWidth
                variant="contained"
                color="primary"
                loading={loading}
                disabled={loading || !isValid}
                type='submit'
                size={"large"}
              >
                Continue
              </MDButton>
            </MDBox>
            <MDBox mt={3} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up/cover"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
            <MDBox mt={3} display={"flex"} justifyContent={"center"} alignItems={"center"}>
              <Divider sx={{flexGrow: 1}}/>
              <MDTypography color="text" fontWeight="regular"  variant="button">
                or
              </MDTypography>
              <Divider sx={{flexGrow: 1}}/>
            </MDBox>
            <MDBox mt={3} display={"flex"} justifyContent={"center"} alignItems={"center"}>
              <MDBox
                component="img"
                src={googleIcon}
                alt="google"
                width={"32px"}
                mr={5}
                sx={{cursor: "pointer"}}
                onClick={googleSignIn}
              />
              <MDBox
                component="img"
                src={facebookIcon}
                alt="facebook"
                width={"32px"}
                sx={{cursor: "pointer"}}
                onClick={facebookSignIn}
              />
            </MDBox>

          </Form>
        )}
      </Formik>
    </IllustrationLayout>
  );
}

export default SignIn;
