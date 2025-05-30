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
import RenderListOption from "../../../components/RenderListOption";
import DocumentItem from "../../common/settings/documentItem";
import AddDocumentBox from "../../common/settings/addDocumentBox";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {ROUTES} from "../../../services/constants";


function PostJob() {
  const api = useApi()
  const {jobId = null} = useParams()
  const location = useLocation()
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const getCredentialOptions = () => {
    api.getCredentialsAvailable().handle({
      onSuccess: (result) => {
        setCredentials(result?.data?.results)
      },
    })
  }

  const getIndustries = () => {
    api.getIndustries().handle({
      onSuccess: (result) => {
        setIndustries(result?.data?.results)
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
    api.getStates({countries: countryIds.toString()}).handle({
      onSuccess: (result) => {
        setStates(result?.data)
      },
    })
  }

  const createJob = (values) => {
    setLoading(true);
    api.createJob(values).handle({
      onSuccess: (result) => {
        navigate(ROUTES.J0B_DETAIL(result?.response?.id))
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
  const editJob = (values) => {
    const dataToSend = {
      ...values,
      id: jobId,
    }
    setLoading(true);
    api.editJob(dataToSend).handle({
      successMessage: 'Job Updated',
      onSuccess: (result) => {
        navigate(ROUTES.J0B_DETAIL(result?.response?.id))
      },
      onError: (error) => {
        formik.setErrors(error?.response?.data)
      },
      errorMessage: 'Error updating job',
      onFinally: () => {
        setLoading(false);
      }
    })
  }

  const getJob = () => {
    setLoading(true);
    api.getJob(jobId).handle({
      onSuccess: (result) => {
        const dataToSet = {
          ...result?.data,
          payment_modes: PaymentOptions.filter((item) => result?.data?.payment_modes?.includes(item.value)),
        }
        setJob(dataToSet)
        formik.setValues(dataToSet)
      },
      errorMessage: 'Error getting job details',
      onFinally: () => setLoading(false)
    });
  };

  const PaymentOptions = [
    {id: 1, name: 'Daily', value: 'daily'},
    {id: 2, name: 'Per Diem', value: 'per_diem'},
    {id: 3, name: 'Mileage', value: 'mileage'},
    {id: 4, name: 'Misc/Other', value: 'misc_other'},
  ];


  const removeCategory = (id) => {
    const currentValues = [...formik.values.industries]
    const newValues = currentValues.filter((item) => item.id !== id)
    formik.setFieldValue('industries', newValues)
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

  const handleRemoveCountry = (id) => {
    const currentCountries = formik.values.country
    const newCountries = currentCountries.filter((item) => item.id !== id)
    const newStates = formik.values.regions.filter((item) => {
      return item.country_id !== id
    })

    formik.setFieldValue('country', newCountries)
    formik.setFieldValue('regions', newStates)
  }

  const handleRemoveState = (id) => {
    const newStates = formik.values.regions.filter((item) => item.id !== id)
    formik.setFieldValue('regions', newStates)
  }


  const initialValues = {
    title: '',
    address: '',
    industries: [],
    description: null,
    certifications: [],
    start_date: null,
    end_date: null,
    daily_rate: 0,
    per_diem_rate: 0,
    mileage_rate: 0,
    misc_other_rate: 0,
    payment_modes: [PaymentOptions[0]],
    documents: [],
    country: [],
    regions: [],
    draft: true
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Job Title is required'),
    country: Yup.array().min(1, 'At least one country is required'),
    regions: Yup.array().min(1, 'At least one state is required'),
    address: Yup.string().required('Address is required'),
    industries: Yup.array().min(1, 'At least one industry is required'),

    description: Yup.string().when('draft', {
      is: (draft) => !draft,
      then: schema => schema.required('Description is required'),
      otherwise: schema => schema.nullable(),
    }),
    certifications: Yup.array().when('draft', {
      is: (draft) => !draft,
      then: schema => schema.min(1,'At least one certification is required'),
      otherwise: schema => schema.nullable(),
    }),
    start_date: Yup.date().when('draft', {
      is: (draft) => !draft,
      then: schema => schema.required('Start date is required'),
      otherwise: schema => schema.nullable(),
    }),
    end_date: Yup.date().when('draft', {
      is: (draft) => !draft,
      then: schema => schema.min(Yup.ref('start_date'), 'Completion date cannot be before the start date').required('Required'),
      otherwise: schema => schema.nullable(),
    }),
    daily_rate: Yup.number().when('draft', {
      is: (draft) => !draft,
      then: schema => schema.required('Daily rate is required').min(1, 'Daily rate must be greater than 0'),
      otherwise: schema => schema.nullable(),
    }),
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
    }),

  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      const dataToSend = {
        ...values,
        industries: values.industries.map((industry) => industry.id),
        certifications: values.certifications.map((certification) => certification.id),
        payment_modes: values.payment_modes.map((payment_mode) => payment_mode.value),
        regions: values.regions.map((region) => region.id),
      }
      if (jobId) {
        editJob(dataToSend);
      } else {
        createJob(dataToSend);
      }
    },
  });

  useEffect(() => {
    getCredentialOptions()
    getCountries()
    getIndustries()
    if (location.pathname !== ROUTES.POST_JOB) {
      if (jobId) {
        getJob()
      }
    } else {
      formik.resetForm()
    }

  }, [location]);

  useEffect(() => {
    getStates(formik.values.country.map((item) => item.id))
  }, [formik.values.country])

  return (
    <AdminLayout title={jobId ? `Edit Job - ${jobId}` : 'Post a Job'}>
      <FormikProvider value={formik}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Card sx={{p: 3, height: '100%'}}>
              {/*{JSON.stringify(formik.errors, null, 2)}*/}
              <FormikInput name="title" label="Job Title" type="text" errors={formik.errors} mb={2}/>
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
                  const currentValues = [...formik.values.country]
                  if (currentValues.find((item) => item.id === value?.[0]?.id)) return
                  currentValues.push(value[0])
                  formik.setFieldValue('country', [value[0]])
                  formik.setFieldValue('regions', [])
                }}
              />
              <MDBox display="flex" flexDirection="row" flexWrap="wrap" gap={1} mb={2}>
                {formik.values.country.map((item) => <RenderListOption key={item.id} item={item} handleRemove={handleRemoveCountry}/>)}
              </MDBox>
              <FormikInput
                type={"autocomplete"}
                value={[]}
                fieldName={"regions"}
                label={"State"}
                options={states}
                accessKey={"name"}
                multiple={true}
                onChange={(value) => {
                  const currentValues = [...formik.values.regions]
                  if (currentValues.find((item) => item.id === value?.[0]?.id)) return
                  formik.setFieldValue('regions', [value[0]])
                }}
              />
              <MDBox display="flex" flexDirection="row" flexWrap="wrap" gap={1} mb={2}>
                {formik.values.regions.map((item) => <RenderListOption key={item.id} item={item} handleRemove={handleRemoveState}/>)}
              </MDBox>
              <FormikInput name="address" label="Inspection Address" type="text" errors={formik.errors} mb={2}/>
              <FormikInput
                type="autocomplete"
                placeholder="Select your industries"
                value={[]}
                fieldName="industries"
                label="Industries"
                options={industries}
                accessKey="name"
                onChange={(value) => {
                  const currentValues = [...formik.values.industries]
                  if (currentValues.find((item) => item.id === value?.[0]?.id)) return
                  currentValues.push(value[0])
                  formik.setFieldValue('industries', currentValues)
                }}
                styleContainer={{mb: 2}}
                multiple
              />
              <MDBox display="flex" flexDirection="row" flexWrap="wrap" gap={1} mb={2}>
                {formik.values.industries.map((item) => <RenderListOption key={item.id} item={item}
                                                                          handleRemove={removeCategory}/>)}
              </MDBox>

              <FormikInput
                type="rich_text"
                label="Job Description"
                name="description"
                setFieldValue={formik.setFieldValue}
                mb={2}
              />
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card sx={{p: 3, height: '100%'}}>
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
                {formik.values.certifications.map((item) => <RenderListOption key={item.id} item={item}
                                                                              handleRemove={removeCertifications}/>)}
              </MDBox>
              <FormikInput
                type="autocomplete"
                placeholder="paymentMethod"
                value={[]}
                fieldName="payment_modes"
                label="Select pay rates"
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
                {formik.values.payment_modes.map((item) => <RenderListOption key={item.id} item={item}
                                                                             handleRemove={removePaymentMethod}/>)}
              </MDBox>

              <FormikInput
                name="daily_rate"
                label="Daily Rate"
                type="number"
                errors={formik.errors}
                setFieldValue={formik.setFieldValue}
                prefix={'USD $'}
                mb={2}
              />
              {formik.values.payment_modes.find((item) => item.value === 'per_diem') && (
                <FormikInput
                  name="per_diem_rate"
                  label="Per Diem Rate"
                  type="number"
                  errors={formik.errors}
                  prefix={'USD $'}
                  mb={2}
                />
              )}
              {formik.values.payment_modes.find((item) => item.value === 'mileage') && (
                <FormikInput
                  name="mileage_rate"
                  label="Mileage Rate"
                  type="number"
                  errors={formik.errors}
                  prefix={'USD $'}
                  mb={2}
                />
              )}
              {formik.values.payment_modes.find((item) => item.value === 'misc_other') && (
                <FormikInput
                  name="misc_other_rate"
                  label="Misc/Other Rate"
                  type="number"
                  errors={formik.errors}
                  prefix={'USD $'}
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
                {jobId && <MDButton
                  color={'secondary'}
                  variant={'outlined'}
                  onClick={() => navigate(-1)}
                  sx={{mr: 2}}
                >
                  Cancel
                </MDButton>}
                {(jobId === null || (job && job.status === 'draft')) && <MDButton
                  color={'primary'}
                  onClick={() => {
                    formik.setFieldValue('draft', true)
                    setTimeout(
                      () => {
                        formik.handleSubmit()
                      }, 100
                    )
                  }}
                  loading={loading}
                  disabled={loading}
                  sx={{mr: 2}}
                >
                  Save as draft
                </MDButton>}
                <MDButton
                  color={'secondary'}
                  onClick={() => {
                    formik.setFieldValue('draft', false)
                    setTimeout(
                      () => {
                        formik.handleSubmit()
                      }, 100
                    )
                  }}
                  loading={loading}
                  disabled={loading}
                >
                  {jobId ? job && job.status === 'draft' ? 'Update and Publish' : 'Update' : 'Publish'}
                </MDButton>

              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </FormikProvider>
    </AdminLayout>
  );
}


export default PostJob;
