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

import React, {useEffect, useRef, useState} from "react";

// react-router-dom components
import {Link, useLocation, useNavigate} from "react-router-dom";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";

// @mui material components

// Material Dashboard 3 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Image
import bgImage from "assets/svgs/backgroundAuth.svg";
import facebookIcon from "assets/svgs/facebook.svg";
import googleIcon from "assets/svgs/google.svg";

import IllustrationLayout from "components/IllustrationLayout";
import {checkUrl, showMessage, useApi, useLoginStore} from "../../../services/helpers";
import {ACCOUNT_TYPES, ROLES, ROUTES} from "../../../services/constants";
import {runInAction} from "mobx";
import {Form, FormikProvider, useFormik} from "formik";
import FormikInput from "../../../components/Formik/FormikInput";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import UserAvatar from "assets/images/photo-placeholder.png";
import RenderListOption from "../../../components/RenderListOption";
import CustomCheckbox from "../../../components/CheckboxCustom";
import {useGoogleLogin} from "@react-oauth/google";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";


function SignUp() {
  const loginStore = useLoginStore();
  const api = useApi()
  const {state} = useLocation();
  const navigate = useNavigate()
  const currentPath = window.location.href;
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(state?.status || 0);
  const [industries, setIndustries] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [title, setTitle] = useState('Create Account')
  const [subtitle, setSubtitle] = useState('')
  const [imgPreview, setImgPreview] = useState(UserAvatar);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [showResendEmail, setShowResendEmail] = useState(false);
  const recaptchaRef = useRef(null);
  const [recaptchaToken, setRecaptchaToken] = useState('xd');
  const [marketingAgreement, setMarketingAgreement] = useState(false);
  const [ctaAgreement, setCtaAgreement] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);


  const signup = (data) => {
    const dataToSend = {
      ...data,
      user_type: data.user_type.value
    }
    setLoading(true)

    api.signup(dataToSend).handle({
        onSuccess: (result) => {
          const {response} = result
          const {user, access} = response
          runInAction(() => {
            loginStore.setUser(user)
            loginStore.setApiToken(access)
          })
          if (loginStore.status !== 4) {
            setStage(user.status)
            showMessage('Please verify your email to continue', 'success')
          }
        },
        errorMessage: 'Error creating account',
        onError: (result) => {
          formikFirstStep.setErrors(result.errors)
        },
        onFinally: () => setLoading(false)
      }
    )
  }

  const updateOwnerData = (data) => {
    setLoading(true)
    api.completeOwnerData(data).handle({
      onSuccess: (result) => {
        runInAction(() => {
          loginStore.setUser(result.data)
          //TODO: REVERTIR UNA VEZ QUE ANDE TWILIO
          navigate(ROUTES.DASHBOARD)
        })
        setStage(2)

      },
      errorMessage: 'Error updating owner data',
      onError: (result) => {
        if (result?.errors?.non_field_errors?.[0] === "Please verify your email to continue with the sign up process") {
          setShowResendEmail(true)
        }
        formikSecondStep.setErrors(result?.errors)
      },
      onFinally: () => setLoading(false)
    })
  }

  const completeInspectorData = (data) => {
    setLoading(true)
    api.completeInspectorData(data).handle({
      onSuccess: (result) => {
        runInAction(() => {
          loginStore.setUser(result.response)
        })
        setStage(2)
      },
      errorMessage: 'Error updating inspector data',
      onError: (result) => {
        if (result?.errors?.non_field_errors?.[0] === "Please verify your email to continue with the sign up process") {
          setShowResendEmail(true)
        }
        formikSecondStep.setErrors(result?.errors)
      },
      onFinally: () => setLoading(false)
    })
  }

  const resendEmail = (data) => {
    setLoading(true)
    api.resendVerificationEmail(data).handle({
      onSuccess: (result) => {
        setShowResendEmail(false)
      },
      successMessage: 'Email sent successfully',
      errorMessage: 'Error resending email',
      onFinally: () => setLoading(false)
    })
  }

  const updateInspectorWorkArea = (data) => {
    setLoading(true)
    api.updateInspectorWorkArea(data).handle({
      onSuccess: (result) => {
        // setStage(3)
        //TODO: REVERTIR UNA VEZ QUE ANDE TWILIO
        loginStore.setUser(result.response)
        navigate(ROUTES.DASHBOARD)
      },
      errorMessage: 'Error updating inspector work area',
      onError: (result) => {
        formikThirdStepInspector.setErrors(result.errors)
      },
      onFinally: () => setLoading(false)
    })
  }

  const verifyCode = (data) => {
    const dataToSend = {
      ...data,
      recaptcha: recaptchaToken,
      marketing_notifications: marketingAgreement
    }
    setLoading(true)
    api.verifyCode(dataToSend).handle({
      onSuccess: (result) => {
        loginStore.setUser(result.response)
        navigate(ROUTES.DASHBOARD)
      },
      successMessage: 'Phone number verified successfully',
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
      onSuccess: () => {
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

  const getCredentialOptions = () => {
    api.getCredentialsAvailable().handle({
      onSuccess: (result) => {
        setCredentials(result?.data?.results)
      },
    })
  }

  const getCountries = () => {
    api.getCountries().handle({
      onSuccess: (result) => {
        setCountries(result?.data)
      },
    })
  }

  const getStates = (countryIds) => {
    setLoading(true)
    api.getStates({countries: countryIds.toString()}).handle({
      onSuccess: (result) => {
        // let states = result?.data
        // if (countryIds.includes(234)) {
        //   const allState = {
        //     id: 0,
        //     name: 'All States',
        //   }
        //   states = [allState, ...states]
        // }
        setStates(result?.data)
      },
      onFinally: () => setLoading(false)
    })
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

        if (user.user_type === ROLES.INSPECTOR) {
          formikSecondStepInspector.setValues({
            ...initialValuesSecondStepInspector,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_picture: user.profile_picture,
          })
        } else {
          formikSecondStep.setValues({
            ...initialValuesSecondStep,
            first_name: user.first_name,
            last_name: user.last_name,
          })
        }


        // TODO: RESTORE THIS AFTER TESTING
        // if (loginStore.status !== 4) {
        //   navigate(ROUTES.SIGN_UP, {state: {status: loginStore.status, user_type: loginStore.user_type}})
        // } else {
        //   navigate(ROUTES.DASHBOARD)
        // }
        // UNTIL HERE
        // navigate(ROUTES.DASHBOARD)
        setStage(user.status)
      },
      errorMessage: 'Error signing in with Google',
      onError: (result) => {
        window.location.replace("https://app.corrosionone.com");
      },
      onFinally: () => setLoading(false)
    })
  }


  // First step of the form

  const validationSchemaFirstStep =
    Yup.object().shape({
      user_type: Yup.object().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required(),
      confirm_password: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref("password")], "Passwords must match"),
    })

  const initialValuesFirstStep = {
    user_type: ACCOUNT_TYPES[1],
    email: "",
    password: "",
    confirm_password: "",
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

  const initialValuesSecondStepInspector = {
    profile_picture: "",
    first_name: "",
    last_name: "",
    credentials: [],
    phone_number: "",
  };

  const validationSchemaSecondStepInspector = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    credentials: Yup.array().min(1, 'At least one credential is required'),
    phone_number: Yup.string()
      .required()
      .test('valid-phone', 'Phone Number is required', function (value) {
        if (!value) return false; // Fails if empty (required)
        if (value.length <= 6) return false; // Fails if not at least 7 characters
        return true;
      }),
  })

  const formikSecondStepInspector = useFormik({
    initialValues: initialValuesSecondStepInspector,
    validateOnChange: false,
    validationSchema: validationSchemaSecondStepInspector,
    onSubmit: (values) => {
      const valuesToSend = {
        ...values,
        profile_picture: typeof formikSecondStepInspector.values.profile_picture === 'object' ? formikSecondStepInspector.values.profile_picture : null,
        credentials:  values.credentials.map((item) => item.id)
      }
      console.log(valuesToSend)
      completeInspectorData(valuesToSend)
    }
  })

  const handleFileChange = (e) => {
    formikSecondStepInspector.setFieldValue('profile_picture', e.target.files[0])
  }


  const initialValuesThirdStepInspector = {
    country: [],
    state: [],
  }

  const validationSchemaThirdStepInspector = Yup.object().shape({
    country: Yup.array().min(1, 'At least one country is required'),
    state: Yup.array().min(1, 'At least one state is required'),
  })

  const formikThirdStepInspector = useFormik({
    initialValues: initialValuesThirdStepInspector,
    validateOnChange: false,
    validationSchema: validationSchemaThirdStepInspector,
    onSubmit: (values) => {
      const valuesToSend = {...values}
      valuesToSend.state = valuesToSend.state.map((item) => item.id)
      valuesToSend.country = valuesToSend.country.map((item) => item.id)
      updateInspectorWorkArea(valuesToSend)
    }
  })

  const handleRemoveCredential = (id) => {
    const newCredentials = formikSecondStepInspector.values.credentials.filter((item) => item.id !== id)
    formikSecondStepInspector.setFieldValue('credentials', newCredentials)
  }

  const handleRemoveCountry = (id) => {
    const currentCountries = formikThirdStepInspector.values.country
    const newCountries = currentCountries.filter((item) => item.id !== id)
    const newStates = formikThirdStepInspector.values.state.filter((item) => {
      return item.country_id !== id
    })

    formikThirdStepInspector.setFieldValue('country', newCountries)
    formikThirdStepInspector.setFieldValue('state', newStates)
  }

  const handleRemoveState = (id) => {
    const newStates = formikThirdStepInspector.values.state.filter((item) => item.id !== id)
    formikThirdStepInspector.setFieldValue('state', newStates)
  }

  const googleSignIn = useGoogleLogin({
    onSuccess: tokenResponse => console.log('===> ', tokenResponse),
    onError: (errorResponse) => console.log("### onError =>", errorResponse),
    onNonOAuthError: (nonOAuthError) => console.log("### onNonOAuthError =>", nonOAuthError),
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: "https://app.corrosionone.com/signup/",
  })

  const cancel = () => {
    if (loginStore.isLoggedIn) loginStore.reset()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  useEffect(() => {
    if (loginStore.isLoggedIn) {
      if (loginStore.status !== 4) {
        setStage(loginStore.status)
      }
    } else {
      setStage(0)
    }
    getIndustries()
    getCredentialOptions()
    getCountries()
  }, [])

  useEffect(() => {
    getStates(formikThirdStepInspector.values.country.map((item) => item.id))
  }, [formikThirdStepInspector.values.country])

  useEffect(() => {
    if (stage === 0) {
      setTitle(`Create ${formikFirstStep.values.user_type.name} Account`)
      setSubtitle(`Enter your email and password to create an account. We'll email you a verification link.`)
    } else if (stage === 1) {
      if (loginStore.user_type === ACCOUNT_TYPES[0].value) {
        setTitle('Owner Details')
        setSubtitle('Provide your personal and company details.')
      } else {
        setTitle('Inspector Details')
        setSubtitle('Provide your personal details and credentials.')
      }
    } else if (stage === 2) {
      if (loginStore.user_type === ACCOUNT_TYPES[0].value) {
        setTitle('Verification Code')
        setSubtitle(`We’ve sent a verification code to your phone number ${loginStore.phone_number}. Enter the code below to verify your account.`)
      } else {
        setTitle('Work Area')
        setSubtitle('Select your work area.')
      }
    } else if (stage === 3) {
      setTitle('Verification Code')
      setSubtitle(`We’ve sent a verification code to your phone number ${loginStore.phone_number}. Enter the code below to verify your account.`)
    }

  }, [formikFirstStep.values.user_type, stage])

  const analyzedUrl = (url) => {
    const nUrl = new URL(url);

    const fullHash = nUrl.hash;
    const queryStart = fullHash.indexOf('?');
    if (queryStart !== -1) {
      // Potentially there's another "#" after our query
      const secondHash = fullHash.indexOf('#', queryStart);
      let queryString = "";

      if (secondHash !== -1) {
        // substring from '?' to before the second '#'
        queryString = fullHash.substring(queryStart + 1, secondHash);
      } else {
        // substring from '?' to the end of the string
        queryString = fullHash.substring(queryStart + 1);
      }

      // 4. Parse the resulting query string manually
      const params = new URLSearchParams(queryString);
      const code = params.get("code");
      if (code) {
        loginGoogle({code, account_type: loginStore.user_type_sign_up_process ? loginStore.user_type_sign_up_process : formikFirstStep.values.user_type.value})
      }
    }

  }

  useEffect(() => {
    console.log(stage)
    if (stage === 0) {
      analyzedUrl(currentPath)
    }

  }, [currentPath])


  const renderFooter = () => {
    const isLoggedIn = loginStore.isLoggedIn
    let isInspector
    if (isLoggedIn) {
      isInspector = loginStore.user_type === ACCOUNT_TYPES[1].value
    } else {
      isInspector = formikFirstStep.values.user_type.value === ACCOUNT_TYPES[1].value
    }

    return (
      <MDBox display={"flex"} justifyContent={"space-between"} alignItems={"center"} width={isInspector ? '90%' : '70%'}
             mx={'auto'} mt={5}>
        <MDBox borderRadius={"7px"} sx={{width: 70, height: 6}} bgColor={'#3C7092'}/>
        <MDBox borderRadius={"7px"} sx={{width: 70, height: 6}} bgColor={stage >= 1 ? '#3C7092' : '#C6C9CE'}/>
        <MDBox borderRadius={"7px"} sx={{width: 70, height: 6}} bgColor={stage >= 2 ? '#3C7092' : '#C6C9CE'}/>
        {isInspector &&
          <MDBox borderRadius={"7px"} sx={{width: 70, height: 6}} bgColor={stage >= 3 ? '#3C7092' : '#C6C9CE'}/>
        }
      </MDBox>
    )
  }

  const renderBody = () => {
    const isLoggedIn = loginStore.isLoggedIn
    let isInspector
    if (isLoggedIn) {
      isInspector = loginStore.user_type === ACCOUNT_TYPES[1].value
    } else {
      isInspector = formikFirstStep.values.user_type.value === ACCOUNT_TYPES[1].value
    }

    if (!isLoggedIn) {
      return firstStep()
    } else {
      switch (stage) {
        case 0:
          return firstStep()
        case 1:
          return !isInspector ? secondStepOwner() : secondStepInspector()
        case 2:
          return !isInspector ? verificationCode() : setInspectorWorkArea()
        case 3:
          return verificationCode()
        default:
          return firstStep()
      }
    }

  }

  const renderInspectorCredentials = (item) => {
    return (
      <MDBox
        key={item.id}
        display="flex"
        alignItems="center"
        justifyContent="space-between" // let text + "X" be spaced out
        borderRadius="24px"
        p={0.25}
        px={1}
        sx={{border: '1px solid #C6C9CE'}}
        // optional: add minWidth so text + X have some horizontal space
      >
        {/* The credential text */}
        <MDTypography sx={{fontSize: 14, fontWeight: 500}}>
          {item.name}
        </MDTypography>

        {/* "X" Button */}
        <IconButton
          aria-label="remove"
          size="small"
          onClick={() => handleRemoveCredential(item.id)}
          sx={{ml: 1, p: 0}} // small margin to separate from text
        >
          <CloseIcon fontSize="inherit"/>
        </IconButton>
      </MDBox>
    )
  }

  const firstStep = () => {
    return (
      <FormikProvider value={formikFirstStep}>
        <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          {/*<MDTypography variant={"h6"} textAlign={"center"}>{JSON.stringify(formikFirstStep.values)}</MDTypography>*/}
          <FormikInput
            type={"autocomplete"}
            value={formikFirstStep.values.user_type}
            fieldName={"user_type"}
            label={"Account Type"}
            options={ACCOUNT_TYPES}
            accessKey={"name"}
            multiple={false}
            onChange={(value) => {
              formikFirstStep.setFieldValue('user_type', value)
              loginStore.setUserTypeSignUp(value.value)
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
                to={ROUTES.TERMS_AND_CONDITIONS}
                variant="button"
                color="info"
                fontWeight="medium"
                sx={{fontSize: 13}}
                target="_blank"
              >
                Terms of Service
              </MDTypography> and
              <MDTypography
                component={Link}
                to={ROUTES.PRIVACY_POLICY}
                variant="button"
                color="info"
                fontWeight="medium"
                sx={{fontSize: 13}}
                target="_blank"
              >
                {" "}Privacy Policy
              </MDTypography>
            </MDTypography>
          </MDBox>
          <MDBox mt={5} textAlign={"center"}>
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
              onClick={() =>setShowSignUpModal(true)}
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
          <CustomCheckbox
            text="I agree to receive SMS messages from Corrosion One LLC. Message and data rates may apply. Message frequency varies. Reply STOP to unsubscribe or HELP for help. View our Privacy Policy and Terms & Conditions."
            onCheck={(value) => {
              setCtaAgreement(value)
            }}
            checked={ctaAgreement}
          />
          {showResendEmail && <MDBox mt={3} textAlign="center" color={"primary"}>
            <MDTypography sx={{cursor: 'pointer'}} variant="button" color="warning" onClick={() => resendEmail({email: loginStore.email})}>
              Didn&apos;t receive the verification email?{" "}
            </MDTypography>
          </MDBox>}
          <MDBox mt={10} textAlign={"center"}>
            <MDButton
              fullWidth
              variant="contained"
              color="primary"
              loading={loading}
              disabled={loading || !ctaAgreement}
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

  const secondStepInspector = () => {
    return (
      <FormikProvider value={formikSecondStepInspector}>
        {/*<MDTypography variant={"h6"} textAlign={"center"}>{JSON.stringify(formikSecondStepInspector.values)}</MDTypography>*/}
        <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <MDBox sx={{position: 'relative'}} display="flex" justifyContent="center" alignItems="center"
                 flexDirection="column" mb={4}>
            {typeof formikSecondStepInspector.values.profile_picture === 'object' && formikSecondStepInspector.values.profile_picture ? (
              <>
                <MDBox
                  component={"img"}
                  onClick={() => fileInputRef?.current?.click()}
                  src={URL.createObjectURL(formikSecondStepInspector.values.profile_picture)}
                  alt={"Profile Picture"}
                  width={100}
                  height={100}
                  borderRadius={'50%'}
                  sx={{objectFit: 'cover', cursor: 'pointer'}}
                />
                <input
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleFileChange}
                />
              </>
            ) : loginStore.profile_picture ? (
              <>
                <MDBox
                  component={"img"}
                  onClick={() => fileInputRef?.current?.click()}
                  src={checkUrl(loginStore.profile_picture)}
                  alt={"Profile Picture"}
                  width={100}
                  height={100}
                  borderRadius={'50%'}
                  sx={{objectFit: 'cover', cursor: 'pointer'}}
                />
                <input
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleFileChange}
                />
              </>
            ) : (
              <>
                <MDBox
                  component={"img"}
                  onClick={() => fileInputRef?.current?.click()}
                  src={imgPreview}
                  alt={"Profile Picture"}
                  width={100}
                  height={100}
                  borderRadius={'50%'}
                  sx={{objectFit: 'cover'}}
                />
              <MDTypography
                component={"span"}
                variant='caption'
                fontSize={14}
                onClick={() => fileInputRef?.current?.click()}
                sx={{cursor: 'pointer', mt: 1, fontWeight: "bold", color: '#000000'}}
              >
                Upload Your Photo
                <input
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleFileChange}
                />
              </MDTypography>
              </>
            )
            }
            {formikSecondStepInspector.errors.profile_picture && (
              <MDTypography variant={"caption"}
                            color={"error"}>{formikSecondStepInspector.errors.profile_picture}</MDTypography>
            )}
          </MDBox>
          <FormikInput
            name={'first_name'}
            label={'First Name'}
            type={'text'}
            errors={formikSecondStepInspector.errors}
            mb={2}
          />
          <FormikInput
            name={'last_name'}
            label={'Last Name'}
            type={'text'}
            errors={formikSecondStepInspector.errors}
            mb={2}
          />
          <FormikInput
            name={'phone_number'}
            label={'Phone Number'}
            type={'phone_input'}
            errors={formikFirstStep.errors}
            mb={2}
          />
          <FormikInput
            type={"autocomplete"}
            placeholder={"Credentials"}
            value={formikSecondStep.values.industry}
            fieldName={"credentials"}
            label={"Credentials"}
            options={credentials}
            accessKey={"name"}
            multiple
            onChange={(value) => {
              const currentValues = [...formikSecondStepInspector.values.credentials]
              if (currentValues.find((item) => item.id === value?.[0]?.id)) return
              currentValues.push(value[0])
              formikSecondStepInspector.setFieldValue('credentials', currentValues)
            }}
          />
          <MDBox display="flex" flexDirection="row" flexWrap="wrap" gap={1} mb={2}>
            {formikSecondStepInspector.values.credentials.map((item) => renderInspectorCredentials(item))}
          </MDBox>

          <MDTypography
            variant={"caption"}
            textAlign={"left"}
            sx={{fontStyle: "italic", color: "#141514"}}
            mb={3}

          >
            Upload documents in your profile settings
          </MDTypography>
          <CustomCheckbox
            text="I agree to receive SMS messages from Corrosion One LLC. Message and data rates may apply. Message frequency varies. Reply STOP to unsubscribe or HELP for help. View our Privacy Policy and Terms & Conditions."
            onCheck={(value) => {
              setCtaAgreement(value)
            }}
            checked={ctaAgreement}
          />
          {showResendEmail && <MDBox mt={3} textAlign="center" color={"primary"}>
            <MDTypography sx={{cursor: 'pointer'}} variant="button" color="warning" onClick={() => resendEmail({email: loginStore.email})}>
              Didn&apos;t receive the verification email?{" "}
            </MDTypography>
          </MDBox>}
          <MDBox mt={10} textAlign={"center"}>
            <MDButton
              fullWidth
              variant="contained"
              color="primary"
              loading={loading}
              disabled={loading || !ctaAgreement}
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

  const setInspectorWorkArea = () => {
    return (
      <FormikProvider value={formikThirdStepInspector}>
        <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <FormikInput
            type={"autocomplete"}
            value={[]}
            fieldName={"country"}
            label={"Country"}
            placeholder={"Country"}
            options={countries}
            accessKey={"name"}
            multiple
            onChange={(value) => {
              const currentValues = [...formikThirdStepInspector.values.country]
              if (currentValues.find((item) => item.id === value?.[0]?.id)) return
              currentValues.push(value[0])
              formikThirdStepInspector.setFieldValue('country', currentValues)
            }}
          />
          <MDBox display="flex" flexDirection="row" flexWrap="wrap" gap={1} mb={2}>
            {formikThirdStepInspector.values.country.map((item) => <RenderListOption key={item.id} item={item} handleRemove={handleRemoveCountry}/>)}
          </MDBox>
          <FormikInput
            type={"autocomplete"}
            value={[]}
            fieldName={"state"}
            label={"State"}
            options={states}
            accessKey={"name"}
            multiple={true}
            onChange={(value) => {
              const currentValues = [...formikThirdStepInspector.values.state]
              // if (value[0].id === 0) {
              //   formikThirdStepInspector.setFieldValue('state', [value[0]])
              //   return
              // }
              // if (currentValues.find((item) => item.id === 0)){
              //   showMessage('You have already selected all US states')
              //   return
              // }
              if (currentValues.find((item) => item.id === value?.[0]?.id)) return
              currentValues.push(value[0])
              formikThirdStepInspector.setFieldValue('state', currentValues)
            }}
          />
          <MDBox display="flex" flexDirection="row" flexWrap="wrap" gap={1} mb={2}>
            {formikThirdStepInspector.values.state.map((item) => <RenderListOption key={item.id} item={item} handleRemove={handleRemoveState}/>)}
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

  const verificationCode = () => {
    return (
      <FormikProvider value={formikThirdStep}>
        <Form style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <FormikInput
            name={'verification_code'}
            label={'Verification Code'}
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
                textDecoration: "underline",
                fontWeight: "bold"
              }}
            >Resend Code</MDTypography>
          </MDBox>
          <CustomCheckbox
            text="Send Me Marketing And Promotional Emails"
            onCheck={(value) => setMarketingAgreement(value)}
            checked={marketingAgreement}
          />
          <MDBox display={'flex'} alignItems={'center'} justifyContent={'center'} mt={7}>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY}
              onChange={
                (value) => {
                  setRecaptchaToken(value)
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
      {renderBody()}
      {renderFooter()}
      <Dialog open={showSignUpModal} onClose={() => setShowSignUpModal(false)}>
        <DialogTitle>Sign Up with Google</DialogTitle>
        <DialogContent>
          <p>Do you want to sign up with your Google account? Before continue please be sure that you chose the correct account type.</p>
        </DialogContent>
        <DialogActions sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Box sx={{display: 'flex', justifyContent: 'flex-start', flexGrow: 1}}>
            <MDButton
              variant="outlined"
              onClick={() => setShowSignUpModal(false)}
              color={'secondary'}
              disabled={loading}
            >
              Cancel
            </MDButton>
          </Box>
          <MDButton
            onClick={() => googleSignIn()}
            color={'primary'}
            disabled={loading}
            loading={loading}
          >
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>
    </IllustrationLayout>
  );
}

export default SignUp;
