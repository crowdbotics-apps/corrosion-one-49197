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
import {Link, useLocation, useNavigate} from "react-router-dom";
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
import {GoogleLogin, useGoogleLogin, useGoogleOneTapLogin} from "@react-oauth/google";


function SignIn() {
  const loginStore = useLoginStore();
  const api = useApi()
  const navigate = useNavigate()
  const formikRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(loginStore.remember_me);
  const [showResendEmail, setShowResendEmail] = useState(false);
  const currentPath = window.location.href;


  const handleSetRememberMe = () => {
    setRememberMe(!rememberMe)
    loginStore.setRememberMe(!rememberMe)
  };

  const login = (data) => {
    setLoading(true)
    api.login(data.email, data.password).handle({
        onSuccess: (result) => {
          if (rememberMe) {
            loginStore.setStoredEmail(data.email)
          } else {
            loginStore.setStoredEmail('')
          }
          const {response} = result
          const {user, access} = response

          runInAction(() => {
            loginStore.setUser(user)
            loginStore.setApiToken(access)
          })
          console.log('user ', user)
          if (loginStore.status !== 4) {
            navigate(ROUTES.SIGN_UP, {state: {status: loginStore.status, user_type: loginStore.user_type}})
          } else {
            navigate(ROUTES.DASHBOARD)
          }
        },
        errorMessage: 'Error signing in',
        onError: (result) => {
          if (result.errors === "Please verify your email address") {
            setShowResendEmail(true)
          }
          if (result.errors === "User doesn't exist") {
            navigate(ROUTES.SIGN_UP)
          }
          formikRef.current?.setErrors(result.errors)
        },
        onFinally: () => setLoading(false)
      }
    )
  }

  const loginGoogle = (data) => {
    api.loginGoogle(data).handle({
      onSuccess: (result) => {
        const {response} = result
        const {user, access} = response

        runInAction(() => {
          loginStore.setUser(user)
          loginStore.setApiToken(access)
        })
        if (loginStore.status !== 4) {
          navigate(ROUTES.SIGN_UP, {state: {status: loginStore.status, user_type: loginStore.user_type}})
        } else {
          window.location.replace("https://app.corrosionone.com/#" + ROUTES.DASHBOARD);
        }
      },
      errorMessage: 'Error signing in with Google',
      onError: (result) => {
        setTimeout(
          () => {
            window.location.replace("https://app.corrosionone.com");
          }, 1000
        )
      },
      onFinally: () => setLoading(false)
    })
  }

  const resendEmail = (data) => {
    api.resendVerificationEmail(data).handle({
      onSuccess: (result) => {
        setShowResendEmail(false)
      },
      successMessage: 'Email sent successfully',
      errorMessage: 'Error resending email',
    })
  }

  const googleSignIn = useGoogleLogin({
    onSuccess: tokenResponse => console.log('===> ', tokenResponse),
    onError: (errorResponse) => console.log("### onError =>", errorResponse),
    onNonOAuthError: (nonOAuthError) => console.log("### onNonOAuthError =>", nonOAuthError),
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: "https://app.corrosionone.com",
  })

  const validationSchema =
    Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

  const initialValues = {
    email: loginStore.stored_email || "",
    password: "",
  };

  useEffect(() => {
    if (loginStore.isLoggedIn) {
      if (loginStore.status !== 4) {
        navigate(ROUTES.SIGN_UP, {state: {status: loginStore.status, user_type: loginStore.user_type}})
      } else {
        navigate(ROUTES.DASHBOARD)
      }
    }
  }, [])

  const analyzedUrl = (url) => {
    const nUrl = new URL(url);
    const code = nUrl.searchParams.get("code");
    if (code) {
      if (url.includes("signup")) {
        console.log('signup')
        navigate(ROUTES.SIGN_UP + '?code=' + code)
      } else{
        loginGoogle({code})
      }
    }
  }

  useEffect(() => {
    analyzedUrl(currentPath)
  }, [currentPath])

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
                disabled={loading}
                type='submit'
                size={"large"}
              >
                Continue
              </MDButton>
            </MDBox>
            {showResendEmail && <MDBox mt={3} textAlign="center" color={"primary"}>
              <MDTypography variant="button" color="warning"
                            onClick={() => resendEmail({email: formikRef.current?.values.email})}>
                Didn&apos;t receive the verification email?{" "}
              </MDTypography>
            </MDBox>}
            <MDBox mt={3} display={"flex"} justifyContent={"center"} alignItems={"center"}>
              <Divider sx={{flexGrow: 1}}/>
              <MDTypography color="text" fontWeight="regular" variant="button">
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
                // mr={5}
                sx={{cursor: "pointer"}}
                onClick={googleSignIn}
              />
            </MDBox>
            <MDBox mt={3} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to={ROUTES.SIGN_UP}
                  variant="button"
                  color="info"
                  fontWeight="medium"
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </Form>
        )}
      </Formik>
    </IllustrationLayout>
  );
}

export default SignIn;
