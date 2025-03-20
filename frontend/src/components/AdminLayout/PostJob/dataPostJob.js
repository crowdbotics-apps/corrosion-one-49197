
import React, { useState } from 'react';
import { Formik, Field, Form, useFormik, FormikProvider } from "formik";
import MDButton from "../../MDButton";
import MDBox from "../../MDBox";
import MDTypography from "../../MDTypography";
import { Input, InputAdornment } from "@mui/material"
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined';
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined';
import FormatUnderlinedOutlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined';
import StrikethroughSOutlinedIcon from '@mui/icons-material/StrikethroughSOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import * as Yup from 'yup';
import FormikInput from "../../Formik/FormikInput";
import Card from "@mui/material/Card";
import pxToRem from "../../../assets/theme/functions/pxToRem";

export function PostJob() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCertifications, setSelectedCertifications] = useState([]);
  const [fileName, setFileName] = useState('');


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const CategoryOptions = [
    { id: 1, name: 'Development' },
    { id: 2, name: 'Consulting' },
    { id: 3, name: 'Marketing' },
    { id: 4, name: 'Design' },
    { id: 5, name: 'Sales' },
    { id: 6, name: 'Finance' },
    { id: 7, name: 'HR' },
    { id: 8, name: 'Legal' },
  ];

  const PerMonthOptions = [
    { id: 1, name: 'Daily Rate' },
    { id: 2, name: 'Per Diem' },
    { id: 3, name: 'Mileage' },
    { id: 4, name: 'Misc/Other' },
  ];

  const jobAddressOptions = [
    { id: 10, name: 'One' },
    { id: 20, name: 'Tenn' },
    { id: 30, name: 'Nine' },
  ];

  const CertificationsOptions = [
    { id: 10, name: 'OSHA Safety Certification' },
    { id: 20, name: 'Roof Inspection Certification' },
    { id: 30, name: 'Building Safety Inspector Certification' },
  ];

  const handleCategoryChange = (value) => {
    if (!selectedCategories.some(category => category.id === value.id)) {
      setSelectedCategories([...selectedCategories, value]);
    }
  };
  const handlePerMonthChange = (value) => {
    if (!selectedPaymentMethod.some(paymentMethod => paymentMethod.id === value.id)) {
      setSelectedPaymentMethod([...selectedPaymentMethod, value]);
    }
  };
  const handleCertificationsChange = (value) => {
    if (!selectedCertifications.some(certifications => certifications.id === value.id)) {
      setSelectedCertifications([...selectedCertifications, value]);
    }
  };

  const removeCategory = (category) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
  };
  const removePaymentMethod = (paymentMethod) => {
    setSelectedPaymentMethod(selectedPaymentMethod.filter((cat) => cat !== paymentMethod));
  };
  const removeCertifications = (certifications) => {
    setSelectedCertifications(selectedCertifications.filter((cat) => cat !== certifications));
  };

  const initialValues = {
    jobTitle: '',
    jobAddress: null,
    category: '',
    jobDescription: '',
    certifications: null,
    paymentMethod: { id: 1, name: 'Daily Rate' },
    dailyRate: '',
    PerDiem: '',
    Mileage: '',
    Misc: '',
    timeLine: 'Ends in 6 Months',
    startDate: '',
    completionDate: '',
  };
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState([initialValues.paymentMethod]);

  const validationSchema = Yup.object().shape({
    jobTitle: Yup.string().required('Job Title is required'),

    jobDescription: Yup.string().required('Job Description is required'),

    dailyRate: Yup.number().min(2000).max(3000).required('Required'),
    startDate: Yup.date().required('Required'),
    completionDate: Yup.date()
      .min(Yup.ref('startDate'), 'Completion date cannot be before the start date')
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('Form Values:', values);
    },
  });

  const handleCompletionDateChange = (value) => {
    const startDate = formik.values.startDate;
    const completionDate = value;
    if (startDate && completionDate && new Date(completionDate) < new Date(startDate)) {
      formik.setFieldValue('completionDate', '');
      formik.setFieldError('completionDate', 'Completion date cannot be before the start date');
    } else {
      formik.setFieldValue('completionDate', completionDate);
      formik.setFieldError('completionDate', '');
    }
  };

  return (
    <MDBox gap={2} display={'flex'} flex={5} sx={{ justifyContent: 'flex-start', pl: { xs: 0, sm: pxToRem(15) }, flexDirection: { xs: 'column', md: 'row' }, width: '100%', maxWidth: '100%', height: { md: '90px', xs: 'auto' } }}>

      <Card sx={{ width: { md: "49%", xs: "100%" }, height: "auto", minHeight: "820px", p: 5, overflow: "auto", "&::-webkit-scrollbar": { width: "8px" }, "&::-webkit-scrollbar-thumb": { backgroundColor: "rgba(0, 0, 0, 0.3)", borderRadius: "10px" }, "&::-webkit-scrollbar-track": { background: "transparent" } }}>
        <FormikProvider value={formik}>
          <Form>
            <MDBox display="flex" flex={1} style={{ border: 'none', backgroundColor: 'white' }}>
              <MDBox sx={{ width: '100%', height: '100%', display: 'flex' }}>
                <MDBox sx={{ width: '100%' }}>

                  <MDBox style={{ width: '100%' }}>
                    <MDTypography variant="h5" component="div">Job Title</MDTypography>
                    <FormikInput name="jobTitle" label="Job Title" type="text" errors={formik.errors} mb={2} />
                  </MDBox>

                  <MDBox sx={{ width: '100%', height: '100px', marginTop: '20px' }}>
                    <MDTypography variant="h5" component="div">Job Address</MDTypography>
                    <MDBox mb={2}>
                      <FormikInput
                        type="autocomplete"
                        placeholder="Job Address"
                        value={formik.values.jobAddress}
                        fieldName="jobAddress"
                        label="Job Address"
                        options={jobAddressOptions}
                        accessKey="name"
                        onChange={(value) => formik.setFieldValue('jobAddress', value)}
                        disableClearable
                        styleContainer={{ mb: 2 }}
                      />
                    </MDBox>
                  </MDBox>

                  <MDBox sx={{ width: '100%', height: '100px' }}>
                    <MDTypography variant="h5" component="div">Category</MDTypography>
                    <MDBox mb={2}>
                      <FormikInput
                        type="autocomplete"
                        placeholder="Category"
                        value={formik.values.category}
                        fieldName="category"
                        label="Select your category"
                        options={CategoryOptions}
                        accessKey="name"
                        onChange={(value) => {
                          formik.setFieldValue('category', value);
                          handleCategoryChange(value);
                        }}
                        disableClearable
                        styleContainer={{ mb: 2 }}
                      />
                    </MDBox>

                  </MDBox>

                  <MDBox sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <MDBox sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: '10px' }}>
                      {selectedCategories.map((category, index) => (
                        <MDBox key={index} sx={{ backgroundColor: 'white', border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: 5, width: 'fit-content', marginBottom: '10px' }}>
                          <MDTypography sx={{ padding: '2px', display: 'flex', fontSize: '14px', margin: '7px', whiteSpace: { xs: 'normal', sm: 'nowrap' }, fontWeight: 'bold' }}>
                            <CancelOutlinedIcon sx={{ marginTop: '2px', width: '20px', height: '20px', color: 'red', marginRight: '2px', cursor: 'pointer' }} onClick={() => removeCategory(category)} />
                            {category.name}
                          </MDTypography>
                        </MDBox>
                      ))}
                    </MDBox>
                  </MDBox>

                  <MDBox>
                    <MDTypography variant="h5" component="div">Job Description</MDTypography>

                    <FormikInput
                      type="textarea"
                      label=""
                      name="jobDescription"
                      rows={5}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10 }}>
                            <MDBox sx={{ marginTop: '190px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '8px', zIndex: 1 }}>
                              <FormatBoldOutlinedIcon sx={{ marginRight: '10px', width: '20px', height: '20px', color: '#1F4255' }} />
                              <FormatItalicOutlinedIcon sx={{ marginRight: '10px', width: '20px', height: '20px', color: '#1F4255' }} />
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
                        value={formik.values.certifications}
                        fieldName={"certifications"}
                        label={"Select your certifications"}
                        options={CertificationsOptions}
                        accessKey={"name"}
                        onChange={(value) => {
                          formik.setFieldValue('certifications', value);
                          handleCertificationsChange(value);
                        }}
                        disableClearable
                        styleContainer={{ mb: 2 }}
                      />
                    </MDBox>
                  </MDBox>

                  <MDBox sx={{ marginTop: '-10px', display: 'flex', flexWrap: 'wrap', width: '100%', gap: '10px' }}>
                    {selectedCertifications.map((certifications, index) => (
                      <MDBox
                        key={index}
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
                            onClick={() => removeCertifications(certifications)}
                          />
                          {certifications.name}
                        </MDTypography>
                      </MDBox>
                    ))}
                  </MDBox>
                </MDBox>
              </MDBox>
            </MDBox>
          </Form>
        </FormikProvider>
      </Card>

      <Card sx={{ width: { md: "49%", xs: "100%" }, height: "auto", minHeight: "820px", p: 5, overflow: "auto", "&::-webkit-scrollbar": { width: "8px" }, "&::-webkit-scrollbar-thumb": { backgroundColor: "rgba(0, 0, 0, 0.3)", borderRadius: "10px" }, "&::-webkit-scrollbar-track": { background: "transparent" } }}>
        <FormikProvider value={formik}>
          <Form>
            <MDBox sx={{ width: '100%', height: '100px' }}>
              <MDTypography variant="h5" component="div">How you Pay?</MDTypography>
              <MDBox mb={2}>
                <FormikInput
                  type="autocomplete"
                  placeholder="paymentMethod"
                  value={formik.values.paymentMethod}
                  fieldName="paymentMethod"
                  label="Per Month"
                  options={PerMonthOptions}
                  accessKey="name"
                  onChange={(value) => {
                    formik.setFieldValue('paymentMethod', value);
                    handlePerMonthChange(value);
                  }}
                  disableClearable
                  styleContainer={{ mb: 2 }}
                />
              </MDBox>
            </MDBox>

            <MDBox sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <MDBox sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: '10px' }}>
                {selectedPaymentMethod.map((paymentMethod, index) => (
                  <MDBox key={index} sx={{ backgroundColor: 'white', border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: 5, width: 'fit-content', marginBottom: '10px' }}>
                    <MDTypography sx={{ padding: '2px', display: 'flex', fontSize: '14px', margin: '7px', whiteSpace: { xs: 'normal', sm: 'nowrap' }, fontWeight: 'bold' }}>
                      {paymentMethod.name !== 'Daily Rate' && (
                        <CancelOutlinedIcon
                          sx={{ marginTop: '2px', width: '20px', height: '20px', color: 'red', marginRight: '2px', cursor: 'pointer' }}
                          onClick={() => removePaymentMethod(paymentMethod)}
                        />
                      )}
                      {paymentMethod.name === 'Daily Rate' && (
                        <CancelOutlinedIcon
                          sx={{ marginTop: '2px', width: '20px', height: '20px', color: 'gray', marginRight: '2px', cursor: 'not-allowed' }}
                          onClick={() => alert('This payment method is required and cannot be removed.')} />
                      )}
                      {paymentMethod.name}
                    </MDTypography>
                  </MDBox>
                ))}
              </MDBox>
            </MDBox>

            {selectedPaymentMethod.some(paymentMethod => paymentMethod.name === 'Daily Rate') && (
            <MDBox sx={{ marginTop: '20px' }}>
              <MDTypography variant="h5" component="div">Daily Rate</MDTypography>
              <FormikInput name="dailyRate" label="From 2000 To 3000" type="text" errors={formik.errors} mb={2} />
            </MDBox>)}

            {selectedPaymentMethod.some(paymentMethod => paymentMethod.name === 'Per Diem') && (
            <MDBox sx={{ marginTop: '20px' }}>
              <MDTypography variant="h5" component="div">Per Diem</MDTypography>
              <FormikInput name="PerDiem" label="From 2000 To 3000" type="text" errors={formik.errors} mb={2} />
            </MDBox>)}

            {selectedPaymentMethod.some(paymentMethod => paymentMethod.name === 'Mileage') && (
            <MDBox sx={{ marginTop: '20px' }}>
              <MDTypography variant="h5" component="div">Mileage</MDTypography>
              <FormikInput name="Mileage" label="From 2000 To 3000" type="text" errors={formik.errors} mb={2} />
            </MDBox>)}

            {selectedPaymentMethod.some(paymentMethod => paymentMethod.name === 'Misc/Other') && (
            <MDBox sx={{ marginTop: '20px' }}>
              <MDTypography variant="h5" component="div">Misc/Other</MDTypography>
              <FormikInput name="Misc" label="From 2000 To 3000" type="text" errors={formik.errors} mb={2} />
            </MDBox>)}



            <MDBox sx={{ marginTop: '20px' }}>
              <MDTypography variant="h5" component="div">Expected start date</MDTypography>
              <FormikInput
                type="date"
                name="startDate"
                label=""
                onChange={(value) => formik.setFieldValue('startDate', value)}
                errors={formik.errors}
                touched={formik.touched}
                setFieldValue={formik.setFieldValue}
                containerStyle={{ mb: 2 }}
              />
            </MDBox>

            <MDBox sx={{ marginTop: '20px' }}>
              <MDTypography variant="h5" component="div">Estimated Completion Date</MDTypography>
              <FormikInput
                type="date"
                name="completionDate"
                label=""
                onChange={(e) => handleCompletionDateChange(e.target.value)}
                errors={formik.errors}
                touched={formik.touched}
                setFieldValue={formik.setFieldValue}
                containerStyle={{ mb: 2 }}
              />
            </MDBox>

            <MDBox sx={{ marginTop: '20px' }}>
              <MDButton
                variant="outlined"
                sx={{
                  borderColor: '#006E90',
                  color: '#006E90',
                  fontSize: '15px',
                  width: '100%',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    borderColor: '#006E90',
                    color: '#006E90',
                  },
                }}
                component="label"
              >
                Add Document

                <input
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </MDButton>

              {fileName && (
                <Input
                  label="Selected Document"
                  variant="outlined"
                  value={fileName}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ marginTop: '10px', width: '100%' }}
                />
              )}
            </MDBox>

            <MDBox sx={{ width: '100%', marginTop: '180px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <MDButton
                variant="outlined"
                sx={{
                  borderColor: '#006E90',
                  color: '#006E90',
                  fontSize: '15px',
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
                color={'secondary'}
                sx={{
                  backgroundColor: '#006E90',
                  color: 'white',
                  '&:hover': { backgroundColor: '#006E90' },
                }}
                type="submit"
              >
                Publish
              </MDButton>
            </MDBox>

          </Form>
        </FormikProvider>
      </Card>
    </MDBox>
  );
}
