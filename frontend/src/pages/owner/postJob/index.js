import AdminLayout from "../../../components/AdminLayout"
import MDBox from "../../../components/MDBox"
import Card from "@mui/material/Card"
import pxToRem from "assets/theme/functions/pxToRem";
import {Form, FormikProvider, useFormik} from "formik";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {InputAdornment} from "@mui/material";
import FormatBoldOutlinedIcon from "@mui/icons-material/FormatBoldOutlined";
import FormatItalicOutlinedIcon from "@mui/icons-material/FormatItalicOutlined";
import FormatUnderlinedOutlinedIcon from "@mui/icons-material/FormatUnderlinedOutlined";
import StrikethroughSOutlinedIcon from "@mui/icons-material/StrikethroughSOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import React, {useEffect, useState} from "react";
import * as Yup from "yup";
import MDTypography from "@mui/material/Typography";
import FormikInput from "../../../components/Formik/FormikInput";
import MDButton from "../../../components/MDButton";
import Grid from "@mui/material/Grid";
import {useApi, useLoginStore} from "../../../services/helpers";
import RenderWorkArea from "../../../components/RenderListOption";


function PostJob() {
  const loginStore = useLoginStore();
  const api = useApi()
  const [credentials, setCredentials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fileName, setFileName] = useState('');

  const getCredentialOptions = () => {
    api.getCredentialsAvailable().handle({
      onSuccess: (result) => {
        setCredentials(result?.data?.results)
      },
    })
  }

  const getJobCategories = () => {
    api.getJobCategories().handle({
      onSuccess: (result) => {
        setCategories(result?.data)
      },
    })
  }

  const createJob = (values) => {
    setLoading(true);
    api.createJob(values).handle({
      onSuccess: (result) => {
        console.log('Job Created:', result)
      },
      successMessage: 'Job Created',
      onError: (error) => {
        formik.setErrors(error?.response?.data)
      },
      errorMessage: 'Error creating job',
      onFinally: () => {
        setLoading(false);
      }
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const removeFile = () => {
    setFileName(null);
  };

  const PerMonthOptions = [
    {id: 1, name: 'Daily Rate'},
    {id: 2, name: 'Per Diem'},
    {id: 3, name: 'Mileage'},
    {id: 4, name: 'Misc/Other'},
  ];


  const removeCategory = (id) => {
    const currentValues = [...formik.values.categories]
    const newValues = currentValues.filter((item) => item.id !== id)
    formik.setFieldValue('categories', newValues)
  }

  const removeCertifications = (id) => {
    const currentValues = [...formik.values.certifications]
    const newValues = currentValues.filter((item) => item.id !== id)
    formik.setFieldValue('certifications', newValues)
  }

  const initialValues = {
    title: '',
    address: '',
    categories: [],
    description: '',
    certifications: [],
    start_date: '',
    end_date: '',
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Job Title is required'),
    description: Yup.string().required('Job Description is required'),
    start_date: Yup.date().required('Required'),
    certifications: Yup.array().min(1, 'At least one certification is required'),
    categories: Yup.array().min(1, 'At least one category is required'),
    end_date: Yup.date()
      .min(Yup.ref('start_date'), 'Completion date cannot be before the start date')
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const dataToSend = {
        ...values,
        categories: values.categories.map((category) => category.id),
        certifications: values.certifications.map((certification) => certification.id),
      }
      createJob(dataToSend);
    },
  });

  useEffect(() => {
    getCredentialOptions()
    getJobCategories()
  }, []);

  return (
    <AdminLayout title={'Post a Job'}>
      <FormikProvider value={formik}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Card sx={{p: 3, height: '100%' }} >
              {/*{JSON.stringify(formik.errors, null, 2)}*/}
              <FormikInput name="title" label="Job Title" type="text" errors={formik.errors} mb={2}/>
              <FormikInput name="address" label="Job Address" type="text" errors={formik.errors} mb={2}/>
              <FormikInput
                type="autocomplete"
                placeholder="Select your categories"
                value={[]}
                fieldName="categories"
                label="Categories"
                options={categories}
                accessKey="name"
                onChange={(value) => {
                  const currentValues = [...formik.values.categories]
                  if (currentValues.find((item) => item.id === value?.[0]?.id)) return
                  currentValues.push(value[0])
                  formik.setFieldValue('categories', currentValues)
                }}
                styleContainer={{mb: 2}}
                multiple
              />
              <MDBox display="flex" flexDirection="row" flexWrap="wrap" gap={1} mb={2}>
              {formik.values.categories.map((item) => <RenderWorkArea key={item.id} item={item} handleRemove={removeCategory}/>)}
              </MDBox>

              <FormikInput
                type="textarea"
                label="Job Description"
                name="description"
                rows={5}
                mb={2}
              />

              {/*<FormikInput*/}
              {/*  type={"autocomplete"}*/}
              {/*  placeholder={"Select your certifications"}*/}
              {/*  value={[]}*/}
              {/*  fieldName={"certifications"}*/}
              {/*  label={"Required Certifications"}*/}
              {/*  options={CertificationsOptions}*/}
              {/*  accessKey={"name"}*/}
              {/*  onChange={(value) => {*/}
              {/*    formik.setFieldValue('certifications', value);*/}
              {/*    handleCertificationsChange(value);*/}
              {/*  }}*/}
              {/*  disableClearable*/}
              {/*  styleContainer={{mb: 2}}*/}
              {/*/>*/}
              <FormikInput
                type={"autocomplete"}
                placeholder={"Credentials"}
                value={[]}
                fieldName={"certifications"}
                label={"Credentials"}
                options={credentials}
                accessKey={"name"}
                multiple
                onChange={(value) => {
                  const currentValues = [...formik.values.certifications]
                  if (currentValues.find((item) => item.id === value?.[0]?.id)) return
                  currentValues.push(value[0])
                  formik.setFieldValue('certifications', currentValues)
                }}
                styleContainer={{mb: 2}}
              />
              <MDBox display="flex" flexDirection="row" flexWrap="wrap" gap={1} mb={2}>
              {formik.values.certifications.map((item) => <RenderWorkArea key={item.id} item={item} handleRemove={removeCertifications}/>)}
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card sx={{p: 3, height: '100%' }} >
              {/*<FormikInput*/}
              {/*  type="autocomplete"*/}
              {/*  placeholder="paymentMethod"*/}
              {/*  value={formik.values.paymentMethod}*/}
              {/*  fieldName="paymentMethod"*/}
              {/*  label="How do you want to pay?"*/}
              {/*  options={PerMonthOptions}*/}
              {/*  accessKey="name"*/}
              {/*  onChange={(value) => {*/}
              {/*    formik.setFieldValue('paymentMethod', value);*/}
              {/*    handlePerMonthChange(value);*/}
              {/*  }}*/}
              {/*  disableClearable*/}
              {/*  styleContainer={{mb: 2}}*/}
              {/*/>*/}

              {/*<MDBox sx={{display: 'flex', flexDirection: 'column', gap: '10px'}}>*/}
              {/*  <MDBox sx={{display: 'flex', flexWrap: 'wrap', width: '100%', gap: '10px'}}>*/}
              {/*    {selectedPaymentMethod.map((paymentMethod, index) => (*/}
              {/*      <MDBox key={index} sx={{*/}
              {/*        backgroundColor: 'white',*/}
              {/*        border: '1px solid rgba(0, 0, 0, 0.2)',*/}
              {/*        borderRadius: 5,*/}
              {/*        width: 'fit-content',*/}
              {/*        marginBottom: '10px'*/}
              {/*      }}>*/}
              {/*        <MDTypography sx={{*/}
              {/*          padding: '2px',*/}
              {/*          display: 'flex',*/}
              {/*          fontSize: '14px',*/}
              {/*          margin: '7px',*/}
              {/*          whiteSpace: {xs: 'normal', sm: 'nowrap'},*/}
              {/*          fontWeight: 'bold'*/}
              {/*        }}>*/}
              {/*          {paymentMethod.name !== 'Daily Rate' && (*/}
              {/*            <HighlightOffIcon*/}
              {/*              sx={{*/}
              {/*                marginTop: '2px',*/}
              {/*                width: '20px',*/}
              {/*                height: '20px',*/}
              {/*                color: 'red',*/}
              {/*                marginRight: '2px',*/}
              {/*                cursor: 'pointer'*/}
              {/*              }}*/}
              {/*              onClick={() => removePaymentMethod(paymentMethod)}*/}
              {/*            />*/}
              {/*          )}*/}
              {/*          {paymentMethod.name === 'Daily Rate' && (*/}
              {/*            <HighlightOffIcon*/}
              {/*              sx={{*/}
              {/*                marginTop: '2px',*/}
              {/*                width: '20px',*/}
              {/*                height: '20px',*/}
              {/*                color: 'gray',*/}
              {/*                marginRight: '2px',*/}
              {/*                cursor: 'not-allowed'*/}
              {/*              }}*/}
              {/*              onClick={() => alert('This payment method is required and cannot be removed.')}/>*/}
              {/*          )}*/}
              {/*          {paymentMethod.name}*/}
              {/*        </MDTypography>*/}
              {/*      </MDBox>*/}
              {/*    ))}*/}
              {/*  </MDBox>*/}
              {/*</MDBox>*/}

              <FormikInput
                name="rate"
                label="Rate"
                type="text"
                errors={formik.errors}
                mb={2}
              />
              <FormikInput
                type="date"
                name="start_date"
                label="Expected Start Date"
                onChange={(value) => formik.setFieldValue('start_date', value)}
                errors={formik.errors}
                touched={formik.touched}
                setFieldValue={formik.setFieldValue}
                containerStyle={{mb: 4}}
              />

              <FormikInput
                type="date"
                name="end_date"
                label="Expected Completion Date"
                errors={formik.errors}
                touched={formik.touched}
                setFieldValue={formik.setFieldValue}
                containerStyle={{mb: 4}}
              />

              <MDBox mb={2}>
                <MDButton
                  fullWidth
                  variant="outlined"
                  color="secondary"
                >
                  {fileName ? (
                    <>
                      {`Document: ${fileName}`}
                      <HighlightOffIcon
                        sx={{
                          marginTop: '2px',
                          width: '20px',
                          height: '20px',
                          color: 'red',
                          marginLeft: '8px',
                          cursor: 'pointer',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                      />
                    </>
                  ) : (
                    'Add Document'
                  )}

                  <input
                    type="file"
                    style={{display: 'none'}}
                    onChange={handleFileChange}
                  />
                </MDButton>
              </MDBox>
              <MDBox display="flex" justifyContent="flex-end" mr={1} mt={'auto'}>
                <MDButton
                  color={'secondary'}
                  onClick={formik.handleSubmit}
                  loading={loading}
                  disabled={loading}
                >Publish</MDButton>
              </MDBox>
            </Card>
          </Grid>

        </Grid>
      </FormikProvider>
    </AdminLayout>
  );
}


export default PostJob;
