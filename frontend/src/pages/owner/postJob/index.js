import AdminLayout from "../../../components/AdminLayout"
import MDBox from "../../../components/MDBox"
import Card from "@mui/material/Card"
import {Form, FormikProvider, useFormik} from "formik";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React, {useEffect, useState} from "react";
import * as Yup from "yup";
import FormikInput from "../../../components/Formik/FormikInput";
import MDButton from "../../../components/MDButton";
import Grid from "@mui/material/Grid";
import {checkUrl, showMessage, truncateFilename, useApi, useLoginStore} from "../../../services/helpers";
import RenderWorkArea from "../../../components/RenderListOption";
import DocumentItem from "../../common/settings/documentItem";
import AddDocumentBox from "../../common/settings/addDocumentBox";


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
        formik.resetForm()
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

  const PaymentOptions = [
    {id: 1, name: 'Daily', value: 'daily'},
    {id: 2, name: 'Per Diem', value: 'per_diem'},
    {id: 3, name: 'Mileage', value: 'mileage'},
    {id: 4, name: 'Misc/Other', value: 'misc_other'},
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

  const removePaymentMethod = (id) => {
    if (id === 1) {
      showMessage('Daily is required and cannot be removed.')
      return
    }
    const currentValues = [...formik.values.payment_modes]
    const newValues = currentValues.filter((item) => item.id !== id)
    formik.setFieldValue('payment_modes', newValues)
  }

  const handleOpenDownload = (doc) => {
    window.open(checkUrl(doc.document), '_blank');
  };

  const handleDelete = (item) => {
    formik.setFieldValue('documents', formik.values.documents.filter((doc) => doc.id !== item.id))
  };

  const handleAddDocument = (e) => {
    const file = e.target.files[0];
    const filename = truncateFilename(file.name);
    const newFile = new File([file], filename, {type: file.type});
    formik.setFieldValue('documents', [...formik.values.documents, {id: Math.random(), name: filename, file: newFile}])
  };


  const initialValues = {
    title: '',
    address: '',
    categories: [],
    description: null,
    certifications: [],
    start_date: '',
    end_date: '',
    daily_rate: 0,
    per_diem_rate: 0,
    mileage_rate: 0,
    misc_other_rate: 0,
    payment_modes: [PaymentOptions[0]],
    documents: [],
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
    daily_rate: Yup.number().required('Daily rate is required').min(1, 'Daily rate must be greater than 0'),
    per_diem_rate: Yup.number().when('payment_modes', {
      is: (value) => value.find((item) => item.value === 'per_diem'),
      then: schema => schema.required('Per Diem rate is required').min(1, 'Per Diem rate must be greater than 0'),
      otherwise: schema => schema.nullable(),
    }),
    mileage_rate: Yup.number().when('payment_modes', {
      is: (value) => value.find((item) => item.value === 'mileage'),
      then: schema => schema.required('Mileage rate is required').min(1, 'Mileage rate must be greater than 0'),
      otherwise: schema => schema.nullable(),
    }),
    misc_other_rate: Yup.number().when('payment_modes', {
      is: (value) => value.find((item) => item.value === 'misc_other'),
      then: schema => schema.required('Misc/Other rate is required').min(1, 'Misc/Other rate must be greater than 0'),
      otherwise: schema => schema.nullable(),
    })
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      const dataToSend = {
        ...values,
        categories: values.categories.map((category) => category.id),
        certifications: values.certifications.map((certification) => certification.id),
        payment_modes: values.payment_modes.map((payment_mode) => payment_mode.value),
      }
      // console.log('data to send', dataToSend)
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
            <Card sx={{p: 3, height: '100%'}}>
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
                {formik.values.categories.map((item) => <RenderWorkArea key={item.id} item={item}
                                                                        handleRemove={removeCategory}/>)}
              </MDBox>

              <FormikInput
                type="rich_text"
                label="Job Description"
                name="description"
                setFieldValue={formik.setFieldValue}
                mb={2}
              />

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
                {formik.values.certifications.map((item) => <RenderWorkArea key={item.id} item={item}
                                                                            handleRemove={removeCertifications}/>)}
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card sx={{p: 3, height: '100%'}}>
              <FormikInput
                type="autocomplete"
                placeholder="paymentMethod"
                value={[]}
                fieldName="payment_modes"
                label="How do you want to pay?"
                options={PaymentOptions}
                accessKey="name"
                multiple
                onChange={(value) => {
                  const currentValues = [...formik.values.payment_modes]
                  if (currentValues.find((item) => item.id === value?.[0]?.id)) return
                  currentValues.push(value[0])
                  formik.setFieldValue('payment_modes', currentValues)
                }}
                styleContainer={{mb: 2}}
              />
              <MDBox display="flex" flexDirection="row" flexWrap="wrap" gap={1} mb={2}>
                {formik.values.payment_modes.map((item) => <RenderWorkArea key={item.id} item={item}
                                                                           handleRemove={removePaymentMethod}/>)}
              </MDBox>

              <FormikInput
                name="daily_rate"
                label="Daily Rate"
                type="number"
                errors={formik.errors}
                mb={2}
              />
              {formik.values.payment_modes.find((item) => item.value === 'per_diem') && (
                <FormikInput
                  name="per_diem_rate"
                  label="Per Diem Rate"
                  type="number"
                  errors={formik.errors}
                  mb={2}
                />
              )}
              {formik.values.payment_modes.find((item) => item.value === 'mileage') && (
                <FormikInput
                  name="mileage_rate"
                  label="Mileage Rate"
                  type="number"
                  errors={formik.errors}
                  mb={2}
                />
              )}
              {formik.values.payment_modes.find((item) => item.value === 'misc_other') && (
                <FormikInput
                  name="misc_other_rate"
                  label="Misc/Other Rate"
                  type="number"
                  errors={formik.errors}
                  mb={2}
                />
              )}
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
                  onClick={() => document.getElementById('input_file').click()}
                >
                  Add Document
                </MDButton>
                <input
                  id={'input_file'}
                  hidden
                  accept="*"
                  type="file"
                  onChange={handleAddDocument}
                />
              </MDBox>
              <Grid container spacing={2} mb={1}>
                {formik.values.documents.map((doc) => (
                  <Grid item key={doc.id}>
                    <DocumentItem
                      key={doc.id}
                      doc={doc}
                      onOpenDownload={handleOpenDownload}
                      onDelete={handleDelete}
                    />
                  </Grid>
                ))}
              </Grid>
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
