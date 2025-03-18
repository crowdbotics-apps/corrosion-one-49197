import React, { useState } from 'react';
import { Formik, Field, Form, useFormik, FormikProvider } from "formik"
import MDButton from "../../MDButton"
import MDBox from "../../MDBox"
import MDTypography from "../../MDTypography"
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined';
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined';
import FormatUnderlinedOutlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined';
import StrikethroughSOutlinedIcon from '@mui/icons-material/StrikethroughSOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import * as Yup from 'yup';
import FormikInput from "../../Formik/FormikInput"
import Autocomplete from "@mui/material/Autocomplete"

export function PostJob() {

  const [isVisible, setIsVisible] = useState(true);
  const [isVisibleOne, setIsVisibleOne] = useState(true);
  const [isVisibleTWO, setIsVisibleTWO] = useState(true);
  const [isVisibleTwo, setIsVisibleTwo] = useState(true);
  const [isVisibleThree, setIsVisibleThree] = useState(true);

  const initialValues = {
    jobTitle: '',
    jobAddress: null,
    category: null,
    jobDescription: '',
    certifications: null,
  };

  const validationSchema = Yup.object().shape({
    jobTitle: Yup.string().required("Job Title is required"),
    jobAddress: Yup.string().required("Job Address is required"),
    category: Yup.string().required("Category is required"),
    jobDescription: Yup.string().required("Job Description is required"),
    certifications: Yup.string().required("Certifications are required"),
  });

  const jobAddressOptions = [
    { id: 10, name: 'One' },
    { id: 20, name: 'Tenn' },
    { id: 30, name: 'Nine' },
  ];
  const CategoryOptions = [
    { id: 10, name: 'Two' },
    { id: 20, name: 'Nine' },
    { id: 30, name: 'tenn' },
  ];
const CertificationsOptions = [
    { id: 10, name: 'One' },
    { id: 20, name: 'Tenn' },
    { id: 30, name: 'Nine' },
  ];

  const formikSecondStep = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const valuesToSend = { ...values };
      console.log('Form Values:', valuesToSend);
    },
  });

  return (
    <FormikProvider value={formikSecondStep}>

        <Form>
          <MDBox display="flex" flex={1} style={{ border: 'none', backgroundColor: 'white' }}>
            <MDBox sx={{ width: '100%', height: '100%', display: 'flex' }}>
              <MDBox sx={{ width: '100%' }}>

                <MDBox style={{ width: '100%' }}>
                  <MDTypography variant="h5" component="div">
                    Job Title
                  </MDTypography>
                  <FormikInput
                    name={'jobTitle'}
                    label={'Job Title'}
                    type={'text'}
                    errors={formikSecondStep.errors}
                    mb={2}
                  />
                </MDBox>

                <MDBox sx={{ width: '100%', height: '100px', marginTop: '20px' }}>
                  <MDTypography variant="h5" component="div">
                    Job Address
                  </MDTypography>
                  <MDBox mb={2}>
                    <FormikInput
                      type={"autocomplete"}
                      placeholder={"job Address"}
                      value={formikSecondStep.values.jobAddress}
                      fieldName={"jobAddress"}
                      label={"jobAddress"}
                      options={jobAddressOptions}
                      accessKey={"name"}
                      onChange={(value) => {
                        formikSecondStep.setFieldValue('jobAddress', value)
                      }}
                      disableClearable
                      styleContainer={{mb: 2}}
                    />
                  </MDBox>
                </MDBox>

                <MDBox sx={{ width: '100%', height: '100px' }}>
                  <MDTypography variant="h5" component="div">
                    Category
                  </MDTypography>
                  <MDBox mb={2}>
                    <FormikInput
                      type={"autocomplete"}
                      placeholder={"category"}
                      value={formikSecondStep.values.category}
                      fieldName={"category"}
                      label={"category"}
                      options={CategoryOptions}
                      accessKey={"name"}
                      onChange={(value) => {
                        formikSecondStep.setFieldValue('category', value)
                      }}
                      disableClearable
                      styleContainer={{mb: 2}}
                    />

                  </MDBox>
                </MDBox>

                <MDBox sx={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', width: '100%' , gap: '10px' }}>

                  {isVisible && (
                    <MDBox
                      sx={{
                        backgroundColor: 'white',
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        borderRadius: 5,
                        width: 'fit-content',
                        marginBottom: '10px',
                      }}
                    >
                      <MDTypography
                        sx={{
                          padding: '2px',
                          display: 'flex',
                          fontSize: '14px',
                          margin: '7px',
                          whiteSpace: { xs: 'normal', sm: 'nowrap' },
                          fontWeight: 'bold',
                        }}
                      >
                        <CancelOutlinedIcon
                          sx={{
                            marginTop: '2px',
                            width: '20px',
                            height: '20px',
                            color: 'red',
                            marginRight: '2px',
                            cursor: 'pointer',
                          }}
                          onClick={() => setIsVisible(false)}
                        />
                        Development
                      </MDTypography>
                    </MDBox>
                  )}


                  {isVisibleTWO && (
                    <MDBox
                      sx={{
                        backgroundColor: 'white',
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        borderRadius: 5,
                        width: 'fit-content',
                        marginBottom: '10px',
                      }}
                    >
                      <MDTypography
                        sx={{
                          padding: '2px',
                          display: 'flex',
                          fontSize: '14px',
                          margin: '7px',
                          whiteSpace: { xs: 'normal', sm: 'nowrap' },
                          fontWeight: 'bold',
                        }}
                      >
                        <CancelOutlinedIcon
                          sx={{
                            marginTop: '2px',
                            width: '20px',
                            height: '20px',
                            color: 'red',
                            marginRight: '2px',
                            cursor: 'pointer',
                          }}
                          onClick={() => setIsVisibleTWO(false)}
                        />
                        Consulting
                      </MDTypography>
                    </MDBox>
                  )}

                </MDBox>

                <MDBox sx={{ marginTop: '20px' }}>
                  <MDTypography variant="h5" component="div">
                    Job Description
                  </MDTypography>

                  <FormikInput
                    type="textarea"
                    label=""
                    name="jobDescription"
                    rows={5}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10 }}>
                          <MDBox
                            sx={{
                              marginTop: '190px',
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: '8px',
                              zIndex: 1,
                            }}
                          >
                            <FormatBoldOutlinedIcon sx={{marginRight: '10px', width: '20px', height: '20px', color: '#1F4255' }} />
                            <FormatItalicOutlinedIcon sx={{marginRight: '10px', width: '20px', height: '20px', color: '#1F4255' }} />
                            <FormatUnderlinedOutlinedIcon sx={{ marginRight: '10px', width: '20px', height: '20px', color: '#1F4255' }} />
                            <StrikethroughSOutlinedIcon sx={{ marginRight: '10px', width: '30px', height: '30px', color: '#1F4255', borderRight: '1px solid #ccc', paddingRight: '10px' }} />
                            <InsertLinkOutlinedIcon sx={{ marginRight: '10px', width: '20px', height: '20px', color: '#1F4255' }} />
                            <ListOutlinedIcon sx={{ marginRight: '10px', width: '30px', height: '30px', color: '#1F4255', borderLeft: '1px solid #ccc', paddingLeft: '10px' }} />
                            <FormatListNumberedOutlinedIcon sx={{ width: '20px', height: '20px', marginRight: '10px', color: '#1F4255' }} />
                          </MDBox>
                        </InputAdornment>
                      ),
                    }}
                  />


                </MDBox>

                <MDBox sx={{ with: '120px', height: '100px', marginTop: '20px' }}>
                  <MDTypography variant="h5" component="div">
                    Certifications Required
                  </MDTypography>
                  <MDBox mb={2}>
                    <FormikInput
                      type={"autocomplete"}
                      placeholder={"certifications"}
                      value={formikSecondStep.values.certifications}
                      fieldName={"certifications"}
                      label={"certifications"}
                      options={CertificationsOptions}
                      accessKey={"name"}
                      onChange={(value) => {
                        formikSecondStep.setFieldValue('certifications', value)
                      }}
                      disableClearable
                      styleContainer={{mb: 2}}
                    />
                  </MDBox>
                </MDBox>

                <MDBox sx={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', width: '100%' , gap: '10px' }}>

                  {isVisibleOne && (
                    <MDBox
                      sx={{
                        backgroundColor: 'white',
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        borderRadius: 5,
                        width: 'fit-content',
                        marginBottom: '10px',
                      }}
                    >
                      <MDTypography
                        sx={{
                          padding: '2px',
                          display: 'flex',
                          fontSize: '14px',
                          margin: '7px',
                          whiteSpace: { xs: 'normal', sm: 'nowrap' },
                          fontWeight: 'bold',
                        }}
                      >
                        <CancelOutlinedIcon
                          sx={{
                            marginTop: '2px',
                            width: '20px',
                            height: '20px',
                            color: 'red',
                            marginRight: '2px',
                            cursor: 'pointer',
                          }}
                          onClick={() => setIsVisibleOne(false)}
                        />
                        OSHA Safety Certification
                      </MDTypography>
                    </MDBox>
                  )}


                  {isVisibleTwo && (
                    <MDBox
                      sx={{
                        backgroundColor: 'white',
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        borderRadius: 5,
                        width: 'fit-content',
                        marginBottom: '10px',
                      }}
                    >
                      <MDTypography
                        sx={{
                          padding: '2px',
                          display: 'flex',
                          fontSize: '14px',
                          margin: '7px',
                          whiteSpace: { xs: 'normal', sm: 'nowrap' },
                          fontWeight: 'bold',
                        }}
                      >
                        <CancelOutlinedIcon
                          sx={{
                            marginTop: '2px',
                            width: '20px',
                            height: '20px',
                            color: 'red',
                            marginRight: '2px',
                            cursor: 'pointer',
                          }}
                          onClick={() => setIsVisibleTwo(false)}
                        />
                        Roof Inspection Certification
                      </MDTypography>
                    </MDBox>
                  )}


                  {isVisibleThree && (
                    <MDBox
                      sx={{
                        backgroundColor: 'white',
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        borderRadius: 5,
                        width: 'fit-content',
                        marginBottom: '10px',
                      }}
                    >
                      <MDTypography
                        sx={{
                          padding: '2px',
                          display: 'flex',
                          fontSize: '14px',
                          margin: '7px',
                          whiteSpace: { xs: 'normal', sm: 'nowrap' },
                          fontWeight: 'bold',
                        }}
                      >
                        <CancelOutlinedIcon
                          sx={{
                            marginTop: '2px',
                            width: '20px',
                            height: '20px',
                            color: 'red',
                            marginRight: '2px',
                            cursor: 'pointer',
                          }}
                          onClick={() => setIsVisibleThree(false)}
                        />
                        Building Safety Inspector Certification
                      </MDTypography>
                    </MDBox>
                  )}

                </MDBox>

              </MDBox>
            </MDBox>
          </MDBox>
        </Form>
      </FormikProvider>
  );
}



export default function PostJobTwo() {
  const initialValues = {
    paymentMethod: '',
    dailyRate: '',
    timeLine: 'Ends in 6 Months',
    startDate: '',
    completionDate: '',
  };

  const validationSchema = Yup.object().shape({
    paymentMethod: Yup.string().required('Required'),
    dailyRate: Yup.number().min(2000).max(3000).required('Required'),
    startDate: Yup.date().required('Required'),
    completionDate: Yup.date().required('Required'),
  });

  const formikSecondStep = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const valuesToSend = { ...values };
      console.log('Form Values:', valuesToSend);
    },
  });

  return (
    <FormikProvider value={formikSecondStep}>
      <Form style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <MDBox sx={{ width: '100%' }}>
          <MDTypography variant="h5" component="div">
            How you Pay?
          </MDTypography>
          <FormikInput
            name={'paymentMethod'}
            label={'Per Month'}
            type={'text'}
            errors={formikSecondStep.errors}
            mb={2}
          />
        </MDBox>

        <MDBox style={{ width: '100%', marginTop: '20px' }}>
          <MDTypography variant="h5" component="div">
            Daily Rate
          </MDTypography>
          <FormikInput
            name={'dailyRate'}
            label={'From 2000 To 3000'}
            type={'text'}
            errors={formikSecondStep.errors}
            mb={2}
          />
        </MDBox>
        <MDBox style={{ width: '100%', marginTop: '20px' }}>
          <MDTypography variant="h5" component="div">
            Time Line
          </MDTypography>
          <FormikInput
            name={'timeLine'}
            label={''}
            type={'text'}
            errors={formikSecondStep.errors}
            mb={2}
          />
        </MDBox>

        <MDBox style={{ width: '100%', marginTop: '20px' }}>
          <MDTypography variant="h5" component="div">
            Expected start date
          </MDTypography>
          <FormikInput
            name={'startDate'}
            label={''}
            type={'date'}
            onChange={(value) => {
              formikSecondStep.setFieldValue('startDate', value)
            }}
            errors={formikSecondStep.errors}
            mb={2}
          />
        </MDBox>

        <MDBox style={{ width: '100%', marginTop: '20px' }}>
          <MDTypography variant="h5" component="div">
            Estimated Completion Date
          </MDTypography>
          <FormikInput
            name={'completionDate'}
            label={''}
            type={'date'}
            errors={formikSecondStep.errors}
            mb={2}
          />
        </MDBox>

        <MDBox style={{ width: '100%', marginTop: '20px' }}>
          <MDButton
            variant="outlined"
            sx={{
              borderColor: '#006E90',
              color: '#006E90',
              fontSize: '15px',
              width: '100%',
              padding: '8px',
              position: 'relative',
              '&:hover': {
                backgroundColor: 'transparent',
                borderColor: '#006E90',
                color: '#006E90',
              },
            }}
            onClick={() => document.getElementById('fileInput').click()}
          >
            Add Document
            <input
              id="fileInput"
              type="file"
              name="completionDate"
              onChange={(event) => formikSecondStep.setFieldValue('completionDate', event.currentTarget.files[0])}
              onBlur={formikSecondStep.handleBlur}
              style={{
                display: 'none',
              }}
            />
          </MDButton>
        </MDBox>

        <MDBox sx={{ width: '100%' , marginTop: {md:'160px', xs:'100px'}, display: 'flex', gap: '10px', paddingLeft: {md:'520px', xs:'90px'}}}>
          <MDButton
            variant="outlined"
            sx={{
              borderColor: '#006E90',
              color: '#006E90',
              fontSize: '15px',
              width: '40%',
              '&:hover': {
                backgroundColor: 'transparent',
                borderColor: '#006E90',
                color: '#006E90',
              },
            }}
            type="reset"
          >
            Cancel
          </MDButton>
          <MDButton
            variant="outlined"
            sx={{
              backgroundColor: '#006E90',
              color: 'white',
              fontSize: '15px',
              width: '40%',
              '&:hover': {
                backgroundColor: '#006E90',
                color: 'white',
              },
            }}
            type="submit"
          >
            Publish
          </MDButton>
        </MDBox>
      </Form>
    </FormikProvider>
  );
}

