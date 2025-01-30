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
import {ACCOUNT_TYPES, ROLES, ROUTES} from "../../../services/constants";
import {runInAction} from "mobx";
import {Form, Formik, FormikProvider, useFormik} from "formik";
import FormikInput from "../../../components/Formik/FormikInput";
import Divider from "@mui/material/Divider";


function SignUp() {
  const loginStore = useLoginStore();
  const api = useApi()
  const navigate = useNavigate()
  const formikRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(1);


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
        then: () => Yup.string() .required('Phone Number is required')
          .test('valid-phone', 'Phone Number is required', function (value) {
            if (!value) return false; // If no value, fail (Yup will report "required")
            if (value.length <= 6) return false; // If less than 3 characters, fail
            return true;
          }),
        otherwise: () =>  Yup.string().notRequired()
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


  const googleSignIn = () => {
    console.log('Google Sign In')
  }

  const facebookSignIn = () => {
    console.log('Facebook Sign In')
  }

  return (
    <IllustrationLayout
      title={`Create ${formikFirstStep.values.account_type.name} Account`}
      description=""
      illustration={bgImage}
    >
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
              styleContainer={{mb:2}}
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
                onClick={() => navigate(ROUTES.LOGIN)}
                size={"large"}
              >
                Cancel
              </MDButton>
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
            <MDBox display={"flex"} justifyContent={"space-between"} alignItems={"center"} width={'70%'} mx={'auto'} mt={5}>
              <MDBox borderRadius={"7px"} sx={{width: 70, height: 6}} bgColor={'#3C7092'} />
              <MDBox borderRadius={"7px"} sx={{width: 70, height: 6}} bgColor={stage >= 2 ? '#3C7092' : '#C6C9CE'} />
              <MDBox borderRadius={"7px"} sx={{width: 70, height: 6}} bgColor={stage >= 3 ? '#3C7092' : '#C6C9CE'} />
              {formikFirstStep.values.account_type === ACCOUNT_TYPES[1] &&  <MDBox borderRadius={"7px"} sx={{width: 70, height: 6}} bgColor={stage >= 4 ? '#3C7092' : '#C6C9CE'} />}
            </MDBox>
          </Form>
      </FormikProvider>
    </IllustrationLayout>
  );
}

export default SignUp;
