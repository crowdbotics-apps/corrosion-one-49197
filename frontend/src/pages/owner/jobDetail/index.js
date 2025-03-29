import React, {useEffect, useRef, useState} from "react"
import MDBox from "../../../components/MDBox";
import Grid from "@mui/material/Grid"
import MDTypography from "../../../components/MDTypography"
import MDButton from "../../../components/MDButton"

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined"
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';

import {useLocation, useNavigate, useParams} from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import FormikInput from "../../../components/Formik/FormikInput"
import {Form, FormikProvider, useFormik} from "formik"
import * as Yup from "yup"
import {checkUrl, date_fmt, showMessage, useApi, useLoginStore} from "../../../services/helpers"
import {CustomTypography, DocumentList, CredentialsList} from "./utils"
import {ROUTES} from "../../../services/constants"
import AdminLayout from "../../../components/AdminLayout";
import gradientImage from "../../../assets/images/gradient.png";

function JobDetail() {

  const {jobId = null} = useParams()
  const navigate = useNavigate()
  const loginStore = useLoginStore()
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const api = useApi();

  const getJob = () => {
    setLoading(true);
    api.getJob(jobId).handle({
      onSuccess: (result) => {
        setJobDetails(result.data);
      },
      errorMessage: 'Error getting job details',
      onError: (error) => {
        navigate(-1)
      },
      onFinally: () => setLoading(false)
    });
  };

  const createBid = (values) => {
    const bidData = {
      job: jobId,
      notes: values.notes,
    }
    setLoading(true);
    api.createBid(bidData).handle({
      onSuccess: (result) => {
        showMessage('Bid created successfully', 'success');
        // navigate(ROUTES.OWNER_MY_JOBS);
      },
      errorMessage: 'Error creating bid',
      onFinally: () => setLoading(false)
    });
  }

  const initialValues = {
    notes: '',
  };

  const validationSchema = Yup.object().shape({
    notes: Yup.string().required('Notes is required'),
  });


  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!selectedItems.includes('item1')) {
        showMessage('Please agree that you are providing the owner with the attached documents');
        return;
      }
      if (!selectedItems.includes('item2')) {
        showMessage('Please agree that you meet the qualifications for this project');
        return;
      }
      createBid(values);
    },
  });

  const handleSelect = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  useEffect(() => {
    if (jobId) getJob();
  }, [jobId]);

  return (
    <AdminLayout
      title={`Job Details - ${jobDetails?.title}`}
      showCard
    >
      <MDBox
        display={'flex'}
        sx={{
          background: `
      linear-gradient(
        to bottom,
        rgba(60, 112, 146, 0.2),
        rgba(60, 112, 146, 0.2)
      ), 
      url(${gradientImage}),
            url(${jobDetails?.created_by?.banner})
    `,
          backgroundSize: 'cover, auto',
          backgroundPosition: 'top, bottom',
          backgroundRepeat: 'no-repeat, repeat-x, no-repeat',
          borderRadius: '8px',
          minHeight: '240px',
        }}
        p={2}
      >
        <Grid container>
          <Grid item xs={12} sm={6} mt={"auto"}>
            <MDBox display="flex" flexDirection="row" mb={2}>
              <img
                src={checkUrl(jobDetails?.created_by?.logo)}
                alt="Logo"
                style={{
                  width: "90px",
                  height: "90px",
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
              <MDTypography sx={{color: '#006E90', fontSize: '32px', fontWeight: 'bold'}} mt={'auto'} ml={1}>
                {jobDetails?.created_by?.company_name}
              </MDTypography>
            </MDBox>

            <Grid container>
              <Grid item xs={12} sm={6}>
                <MDBox display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
                  <EmailOutlinedIcon sx={{color: "#006E90", width: "30px", height: "30px"}}/>
                  <MDTypography sx={{fontSize: "14px", marginLeft: "10px"}}>
                    {jobDetails?.created_by?.email}
                  </MDTypography>
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDBox display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
                  <PhoneOutlinedIcon sx={{color: "#006E90", width: "30px", height: "30px"}}/>
                  <MDTypography
                    sx={{fontSize: "14px", marginLeft: "5px"}}>{jobDetails?.created_by?.phone_number}</MDTypography>
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDBox display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
                  < PinDropOutlinedIcon sx={{color: "#006E90", width: "30px", height: "30px"}}/>
                  <MDTypography sx={{
                    fontSize: "14px",
                    marginLeft: "10px"
                  }}>{jobDetails?.created_by?.address}</MDTypography>
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDBox display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
                  <InsertLinkOutlinedIcon
                    sx={{color: "#006E90", width: "30px", height: "30px", marginTop: "-3px"}}/>
                  <MDTypography sx={{
                    fontSize: "14px",
                    marginLeft: "10px"
                  }}>{jobDetails?.created_by?.website}</MDTypography></MDBox>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} mt={"auto"}>
            <MDBox display={'flex'} justifyContent={'flex-end'} alignItems={'center'} mb={1}>
              <MDButton variant="text">
                <BookmarkOutlinedIcon sx={{color: "#006E90", width: '30px', height: '30px'}}/>
              </MDButton>

              <MDButton color={'secondary'}>
                Bid
              </MDButton>
            </MDBox>

            <MDBox display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
              <MDButton sx={{
                width: '150px',
                border: '2px solid #006E90',
                backgroundColor: 'white',
                height: '20px',
                borderRadius: 5,
              }}>
                <MDTypography sx={{
                  color: '#006E90',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>Message</MDTypography>
                <QuestionAnswerOutlinedIcon
                  sx={{color: "#006E90", width: "30px", height: "30px", marginLeft: '2px'}}/>
              </MDButton>
              <MDBox
                sx={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#1F425526',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                onClick={() => window.open(jobDetails?.created_by?.linkedin, '_blank')}
                ml={2}
              >
                <MDTypography sx={{fontWeight: 'bold', color: '#006E90', fontSize: '20px'}}>
                  in
                </MDTypography>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Grid container>
        <Grid item xs={12} md={6} mt={2}>
          <CustomTypography text="Job Description"/>
            <MDBox p={3}>
              <div dangerouslySetInnerHTML={{__html: jobDetails?.description}}/>
            </MDBox>
        </Grid>
        <Grid item xs={12} md={6} mt={2}>
          <CustomTypography text="Requirements"/>
          <DocumentList documents={jobDetails?.documents}/>
          <CredentialsList documents={jobDetails?.certifications || []}/>
          <CustomTypography text="Payment"/>
          <MDBox>
            <MDTypography sx={{fontSize: '16px', marginTop: '15px', marginBottom: '10px'}}>
              Daily Rate: $ {jobDetails?.daily_rate}
            </MDTypography>
            {jobDetails?.payment_modes.includes('per_diem') && (
              <MDTypography sx={{fontSize: '16px', marginTop: '15px', marginBottom: '10px'}}>
                Per Diem: $ {jobDetails?.per_diem_rate}
              </MDTypography>
            )}
            {jobDetails?.payment_modes.includes('mileage') && (
              <MDTypography sx={{fontSize: '16px', marginTop: '15px', marginBottom: '10px'}}>
                Mileage: $ {jobDetails?.mileage_rate}
              </MDTypography>
            )}
            {jobDetails?.payment_modes.includes('misc_other') && (
              <MDTypography sx={{fontSize: '16px', marginTop: '15px', marginBottom: '10px'}}>
                Misc/Other: $ {jobDetails?.misc_other_rate}
              </MDTypography>
            )}
          </MDBox>
          <CustomTypography text="Job Schedule"/>
          <MDBox display={'flex'} justifyContent={'space-between'}>
            <MDTypography sx={{fontSize: '16px', fontWeight: 'bold', marginTop: '20px'}}>
              Start Date: {date_fmt(jobDetails?.start_date, 'MMMM D, YYYY')}
            </MDTypography>
            <MDTypography sx={{fontSize: '16px', fontWeight: 'bold', marginTop: '20px'}}>
              End Date: {date_fmt(jobDetails?.end_date,'MMMM D, YYYY')}
            </MDTypography>
          </MDBox>
        </Grid>
      </Grid>



      {loginStore.user_type === 'INSPECTOR' && <MDBox borderTop={"1px solid #ccc"}>
        <FormikProvider value={formik}>
          <Form>
            <Grid>
              <MDTypography sx={{ fontSize: '16px', fontWeight: 'bold', marginTop: '20px' , marginBottom: '10px' }}>
                Notes for the Owner
              </MDTypography>
              <FormikInput
                type="textarea"
                label=""
                name="notes"
                rows={7}
              />
              <MDBox display={'flex'} flexDirection={'column'} gap={2} marginTop={'20px'} >
                <MDBox sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: '10px' }}>
                  <MDBox
                    sx={{
                      backgroundColor: 'white',
                      border: '1px solid rgba(0, 0, 0, 0.2)',
                      borderRadius: 5,
                      width: 'fit-content',
                      marginBottom: '10px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleSelect('item1')}
                  >
                    <MDTypography
                      sx={{
                        padding: '5px',
                        display: 'flex',
                        fontSize: '14px',
                        margin: '7px',
                        whiteSpace: { xs: 'normal', sm: 'nowrap' },
                        fontWeight: 'bold',
                      }}
                    >
                        <IconButton
                          sx={{
                            width: {md:'30px', xs:'30px'}, height: {md:'30px', xs:'30px'},
                            backgroundColor: 'grey.300',
                            borderRadius: '50%',
                            marginRight: '8px',
                            '&:hover': {
                              backgroundColor: 'grey.400',
                            },
                          }}
                          aria-label="check"
                        >
                          {selectedItems.includes('item1') && (
                          <CheckIcon sx={{ color: '#006E90',  width: {md:'20px', xs:'30px'}, height: {md:'20px', xs:'30px'} }} /> )}
                        </IconButton>
                      <MDTypography sx={{fontSize:'15px',fontWeight: 'bold', padding:'3px' }}>Provide The Owner With The Attached Documents</MDTypography>
                    </MDTypography>
                  </MDBox>
                </MDBox>


                <MDBox sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: '10px' }}>
                  <MDBox
                    sx={{
                      backgroundColor: 'white',
                      border: '1px solid rgba(0, 0, 0, 0.2)',
                      borderRadius: 5,
                      width: 'fit-content',
                      marginBottom: '10px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleSelect('item2')}
                  >
                    <MDTypography
                      sx={{
                        padding: '5px',
                        display: 'flex',
                        fontSize: '14px',
                        margin: '7px',
                        whiteSpace: { xs: 'normal', sm: 'nowrap' },
                        fontWeight: 'bold',
                      }}
                    >

                        <IconButton
                          sx={{
                            width: {md:'30px', xs:'30px'}, height: {md:'30px', xs:'30px'},
                            backgroundColor: 'grey.300',
                            borderRadius: '50%',
                            marginRight: '8px',
                            '&:hover': {
                              backgroundColor: 'grey.400',
                            },
                          }}
                          aria-label="check"
                        >
                          {selectedItems.includes('item2') && (
                          <CheckIcon sx={{ color: '#006E90', width: {md:'20px', xs:'30px'}, height: {md:'20px', xs:'30px'}}} />  )}
                        </IconButton>

                      <MDTypography sx={{fontSize:'15px',fontWeight: 'bold', padding:'3px' }}> Confirm That I Meet The Qualification For This Project</MDTypography>

                    </MDTypography>
                  </MDBox>
                </MDBox>
              </MDBox>
              <MDBox display={'flex'} justifyContent={'flex-end'} gap={2} marginTop={'20px'} marginBottom={'20px'}>
              <MDButton
                color={'secondary'}
                type="submit"
                disabled={loading}
                loading={loading}
              >
                Apply For The Job
              </MDButton>

              {/*<MDButton*/}
              {/*  color={'secondary'}*/}
              {/*  variant={'outlined'}*/}
              {/*  onClick={() => navigate(-1)}*/}
              {/*>*/}
              {/*  Go Back*/}
              {/*</MDButton>*/}
              </MDBox>

            </Grid>
          </Form>
        </FormikProvider>
      </MDBox>}
      {loginStore.user_type === 'OWNER' && <MDBox borderTop={"1px solid #ccc"}>
        <MDBox display={'flex'} justifyContent={'flex-end'} gap={2} marginTop={'20px'} marginBottom={'20px'}>
          <MDButton
            color={'primary'}
            onClick={() => navigate(ROUTES.JOB_BIDS(jobId))}
          >
            Bids
          </MDButton>
          {jobDetails?.status === "pending" &&<MDButton
            color={'secondary'}
            onClick={() => navigate(ROUTES.EDIT_JOB(jobId))}
          >
            Edit
          </MDButton>}
          <MDButton
            color={'secondary'}
            variant={'outlined'}
            onClick={() => navigate(-1)}
          >
            Go Back
          </MDButton>
        </MDBox>
      </MDBox>}
    </AdminLayout>
  );
}

export default JobDetail;
