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
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";

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
import {ACCOUNT_TYPES, ROLES, ROUTES} from "../../../services/constants";
import {runInAction} from "mobx";
import {Form, Formik, FormikProvider, useFormik} from "formik";
import FormikInput from "../../../components/Formik/FormikInput";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import {FormControlLabel} from "@mui/material";


function SignUp() {
  const loginStore = useLoginStore();
  const api = useApi()
  const {state} = useLocation();
  const navigate = useNavigate()
  const formikRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(state?.status || 0);
  const [industries, setIndustries] = useState([]);
  const [title, setTitle] = useState('Create Account')
  const [subtitle, setSubtitle] = useState('')
  const userType = state?.user_type || null

  const signup = (data) => {
    const dataToSend = {
      ...data,
      account_type: data.account_type.value
    }
    console.log(dataToSend)
    api.signup(dataToSend).handle({
        onSuccess: (result) => {
          console.log(result)
          const {response} = result
          // const {user, access_token} = response
          // runInAction(() => {
          //   loginStore.setUser(user)
          //   loginStore.setApiToken(access_token)
          // })
          //
          // if (user.is_superuser || user.group === ROLES.ADMIN.name) {
          //   navigate(ROUTES.ADMIN_ANALYTICS)
          // } else if (!(user.is_superuser || user.group === ROLES.ADMIN.name) && user?.password_changed_by_admin) {
          //   navigate(ROUTES.USER_CHANGE_PASSWORD)
          // } else {
          //   navigate(ROUTES.USER_PROJECT_SELECTOR)
          // }
        },
        errorMessage: 'Error creating account',
        onError: (result) => {
          formikRef.current?.setErrors(result.errors)
        },
        onFinally: () => setLoading(false)
      }
    )
  }

  const updateOwnerData = (data) => {
    setLoading(true)
    api.updateOwnerData(data).handle({
      onSuccess: (result) => {
        console.log(result)
        setStage(2)

      },
      errorMessage: 'Error updating owner data',
      onError: (result) => {
        formikSecondStep.setErrors(result.errors)
      },
      onFinally: () => setLoading(false)
    })
  }

  const verifyCode = (data) => {
    setLoading(true)
    api.verifyCode(data).handle({
      onSuccess: (result) => {
        console.log(result)
        setStage(3)
      },
      errorMessage: 'Error verifying code',
      onError: (result) => {
        formikThirdStep.setErrors(result.errors)
      },
      onFinally: () => setLoading(false)
    })
  }

  const sendVerificationCode = () => {
    setLoading(true)
    api.sendVerificationCode().handle({
      onSuccess: (result) => {
        console.log(result)
      },
      errorMessage: 'Error sending verification code',
      onFinally: () => setLoading(false)
    })
  }

  const getIndustries = () => {
    api.getIndustries().handle({
      onSuccess: (result) => {
        setIndustries(result?.data?.results)
      },
    })
  }

  // First step of the form

  const validationSchemaFirstStep =
    Yup.object().shape({
      account_type: Yup.object().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required(),
      confirm_password: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref("password")], "Passwords must match"),
      phone_number: Yup.string().when('account_type', {
        is: (account_type) => account_type.id === ACCOUNT_TYPES[1].id,
        then: () => Yup.string().required('Phone Number is required')
          .test('valid-phone', 'Phone Number is required', function (value) {
            if (!value) return false; // If no value, fail (Yup will report "required")
            if (value.length <= 6) return false; // If less than 3 characters, fail
            return true;
          }),
        otherwise: () => Yup.string().notRequired()
      })
    })

  const initialValuesFirstStep = {
    account_type: ACCOUNT_TYPES[0],
    email: "",
    password: "",
    confirm_password: "",
    phone_number: "",
  };


  const formikFirstStep = useFormik({
    initialValues: initialValuesFirstStep,
    validateOnChange: false,
    validationSchema: validationSchemaFirstStep,
    onSubmit: (values) => signup(values),
  })

  // Second step of the form

  const initialValuesSecondStep = {
    company_name: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    industry: "",
  };

  const validationSchemaSecondStep =
    Yup.object().shape({
      company_name: Yup.string().required('Company Name is required'),
      first_name: Yup.string().required('First Name is required'),
      last_name: Yup.string().required('Last Name is required'),
      phone_number: Yup.string()
        .required()
        .test('valid-phone', 'Phone Number is required', function (value) {
          if (!value) return false; // Fails if empty (required)
          if (value.length <= 6) return false; // Fails if not at least 7 characters
          return true;
        }),

      industry: Yup.object().required(),
    })

  const formikSecondStep = useFormik({
    initialValues: initialValuesSecondStep,
    validateOnChange: false,
    validationSchema: validationSchemaSecondStep,
    onSubmit: (values) => {
      const valuesToSend = {...values}
      valuesToSend.industry = values.industry.id
      updateOwnerData(valuesToSend)
    }
  })

  // Third step of the form for owners and fourth step for inspectors

  const initialValuesThirdStep = {
    verification_code: "",
  }

  const validationSchemaThirdStep = Yup.object().shape({
    verification_code: Yup.string().required('Verification Code is required')
  })

  const formikThirdStep = useFormik({
    initialValues: initialValuesThirdStep,
    validateOnChange: false,
    validationSchema: validationSchemaThirdStep,
    onSubmit: (values) => {
      verifyCode(values)
    }
  })

  const googleSignIn = () => {
    console.log('Google Sign In')
  }

  const facebookSignIn = () => {
    console.log('Facebook Sign In')
  }

  const cancel = () => {
    if (loginStore.isLoggedIn) loginStore.reset()
    navigate(ROUTES.LOGIN)
  }

  useEffect(() => {
    if (loginStore.isLoggedIn) {
      getIndustries()
    } else {
      setStage(0)
    }
  }, [])

  useEffect(() => {
    if (stage === 0) {
      setTitle(`Create ${formikFirstStep.values.account_type.name} Account`)
      setSubtitle(`Enter your email and password to create an account. We'll email you a verification link.`)
    } else if (stage === 1) {
      if (formikFirstStep.values.account_type.id === ACCOUNT_TYPES[0].id) {
        setTitle('Owner Details')
        setSubtitle('Provide your personal and company details.')
      } else {
      //TODO
      }
    } else if (stage === 2) {
      setTitle('Verification Code')
      setSubtitle(`We’ve sent a verification code to your phone number ${loginStore.phone_number}. Enter the code below to verify your account.`)
    }

  }, [formikFirstStep.values.account_type, stage])

  const firstStep = () => {
    return (
      <FormikProvider value={formikFirstStep}>
        <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <FormikInput
            type={"autocomplete"}
            value={formikFirstStep.values.account_type}
            fieldName={"account_type"}
            label={"Account Type"}
            options={ACCOUNT_TYPES}
            accessKey={"name"}
            multiple={false}
            onChange={(value) => {
              formikFirstStep.setFieldValue('account_type', value)
            }}
            disableClearable
            styleContainer={{mb: 2}}
          />
          <FormikInput
            name={'email'}
            label={'Email address'}
            type={'email'}
            errors={formikFirstStep.errors}
            mb={2}
          />
          {formikFirstStep.values.account_type === ACCOUNT_TYPES[1] && <FormikInput
            name={'phone_number'}
            label={'Phone Number'}
            type={'phone_input'}
            errors={formikFirstStep.errors}
            mb={2}
          />}
          <FormikInput
            name={'password'}
            label={'Set Password'}
            type={'password'}
            errors={formikFirstStep.errors}
            mb={2}
          />
          <FormikInput
            name={'confirm_password'}
            label={'Confirm Password'}
            type={'password'}
            errors={formikFirstStep.errors}
            mb={1}
          />
          <MDBox textAlign="center">
            <MDTypography variant="button" color="text" sx={{fontSize: 13}}>
              By signing up, you agree to our{" "}
              <MDTypography
                component={Link}
                to="/authentication/sign-up/cover"
                variant="button"
                color="info"
                fontWeight="medium"
                sx={{fontSize: 13}}
              >
                Terms & Conditions
              </MDTypography> and
              <MDTypography
                component={Link}
                to="/authentication/sign-up/cover"
                variant="button"
                color="info"
                fontWeight="medium"
                sx={{fontSize: 13}}
              >
                {" "}Privacy Policy
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mt={10} textAlign={"center"}>
            <MDButton
              fullWidth
              variant="contained"
              color="primary"
              loading={loading}
              disabled={loading || !formikFirstStep.isValid}
              size={"large"}
              type='submit'
            >
              Continue
            </MDButton>
          </MDBox>
          <MDBox mt={2} mb={1} textAlign={"center"}>
            <MDButton
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={cancel}
              size={"large"}
            >
              Cancel
            </MDButton>
          </MDBox>

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
      </FormikProvider>
    )
  }

  const secondStepOwner = () => {
    return (
      <FormikProvider value={formikSecondStep}>
        <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <FormikInput
            name={'company_name'}
            label={'Company Name'}
            type={'text'}
            errors={formikSecondStep.errors}
            mb={2}
          />
          <FormikInput
            name={'first_name'}
            label={'First Name'}
            type={'text'}
            errors={formikSecondStep.errors}
            mb={2}
          />
          <FormikInput
            name={'last_name'}
            label={'Last Name'}
            type={'text'}
            errors={formikSecondStep.errors}
            mb={2}
          />
          <FormikInput
            type={"autocomplete"}
            placeholder={"Industry"}
            value={formikSecondStep.values.industry}
            fieldName={"industry"}
            label={"Industry"}
            options={industries}
            accessKey={"name"}
            onChange={(value) => {
              formikSecondStep.setFieldValue('industry', value)
            }}
            disableClearable
            styleContainer={{mb: 2}}
          />
          <FormikInput
            name={'phone_number'}
            label={'Phone Number'}
            type={'phone_input'}
            errors={formikSecondStep.errors}
            mb={2}
          />
          <MDBox mt={10} textAlign={"center"}>
            <MDButton
              fullWidth
              variant="contained"
              color="primary"
              loading={loading}
              disabled={loading}
              size={"large"}
              type='submit'
            >
              Continue
            </MDButton>
          </MDBox>
          <MDBox mt={2} mb={1} textAlign={"center"}>
            <MDButton
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={cancel}
              size={"large"}
            >
              Cancel
            </MDButton>
          </MDBox>
        </Form>
      </FormikProvider>
    )
  }

  const verificationCode = () => {
    return (
      <FormikProvider value={formikThirdStep}>
        <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <FormikInput
            name={'verification_code'}
            label={'Verification Code'}
            type={'number'}
            errors={formikThirdStep.errors}
            style={{mb: 0}}
          />
          <MDBox mt={0} mb={3}>
            <MDTypography
              onClick={sendVerificationCode}
              sx={{
                cursor: "pointer",
                fontSize: 14,
                textAlign: "right",
                color: "#BFBFBF",
              }}
            >Resend Code</MDTypography>
          </MDBox>
          <FormControlLabel control={<Checkbox defaultChecked color={'primary'} />} label="Send me marketing and promotional emails" />
          <MDBox display={'flex'} alignItems={'center'} justifyContent={'center'} mt={7}>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY}
              onChange={
                (value) => {
                  console.log('Captcha value:', value)
                }
              }
            />
          </MDBox>
          <MDBox mt={10} textAlign={"center"}>
            <MDButton
              fullWidth
              variant="contained"
              color="primary"
              loading={loading}
              disabled={loading}
              size={"large"}
              type='submit'
            >
              Continue
            </MDButton>
          </MDBox>
          <MDBox mt={2} mb={1} textAlign={"center"}>
            <MDButton
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={cancel}
              size={"large"}
            >
              Cancel
            </MDButton>
          </MDBox>
        </Form>
      </FormikProvider>
    )
  }

  return (
    <IllustrationLayout
      title={title}
      description={subtitle}
      illustration={bgImage}
    >
      {stage === 0 && firstStep()}
      {stage === 1 && secondStepOwner()}
      {stage === 2 && verificationCode()}
      <MDBox display={"flex"} justifyContent={"space-between"} alignItems={"center"} width={'70%'} mx={'auto'} mt={5}>
        <MDBox borderRadius={"7px"} sx={{width: 70, height: 6}} bgColor={'#3C7092'}/>
        <MDBox borderRadius={"7px"} sx={{width: 70, height: 6}} bgColor={stage >= 1 ? '#3C7092' : '#C6C9CE'}/>
        <MDBox borderRadius={"7px"} sx={{width: 70, height: 6}} bgColor={stage >= 2 ? '#3C7092' : '#C6C9CE'}/>
        {formikFirstStep.values.account_type === ACCOUNT_TYPES[1] &&
          <MDBox borderRadius={"7px"} sx={{width: 70, height: 6}} bgColor={stage >= 3 ? '#3C7092' : '#C6C9CE'}/>}
      </MDBox>
    </IllustrationLayout>
  );
}

export default SignUp;
