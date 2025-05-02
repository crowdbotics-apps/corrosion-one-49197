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
import {capitalize, checkUrl, date_fmt, money_fmt, showMessage, useApi, useLoginStore} from "../../../services/helpers"
import {CustomTypography, DocumentList, CredentialsList} from "./utils"
import {ROLES, ROUTES} from "../../../services/constants"
import AdminLayout from "../../../components/AdminLayout";
import gradientImage from "../../../assets/images/gradient.png";
import { Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import PaymentModal from "../../../components/CheckoutForm/PaymentModal";

function JobDetail({stripeInstance}) {
  const api = useApi();
  const {jobId = null} = useParams()
  const navigate = useNavigate()
  const loginStore = useLoginStore()
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [action, setAction] = useState('delete');
  const [showMarkAsDoneIM, setShowMarkAsDoneIM] = useState(false);
  const [cards, setCards] = useState([])
  const [payMileageModal, setPayMileageModal] = useState(false);
  const [instantModal, setInstantModal] = useState(false)
  const [clientSecret, setClientSecret] = useState(null);
  const [open, setOpen] = useState(false);

  const getCards = () => {
    api.getCards().handle({
      onSuccess: (result) => {
        setCards(result.data)
      },
    })
  }

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
  const createPaymentIntentLink = () => {
    setLoading(true)
    api.createPaymentIntentHeld({job_id: jobId}).handle({
      onSuccess: (res) => {
        setClientSecret(res.data)
        setTimeout(() => {
          setOpen(true)
        }, 300)
      },
      errorMessage: 'Error accepting bid',
      onFinally: () => setLoading(false)
    })
  }

  const createBid = (values) => {
    const bidData = {
      job: jobId,
      note: values.notes,
    }
    setLoading(true);
    api.createBid(bidData).handle({
      successMessage: 'Bid created successfully',
      onSuccess: (result) => {
        navigate(-1);
      },
      errorMessage: 'Error creating bid',
      onFinally: () => setLoading(false)
    });
  }

  const cancelJob = () => {
    setLoading(true)
    api.cancelJob(jobId).handle({
        onSuccess: (res) => {
          handleCloseModal()
          navigate(-1)
        },
        successMessage: action === 'delete' ? `Job ${jobDetails?.bids === 0 ? 'deleted' : 'canceled'} successfully` : 'Job canceled successfully',
        errorMessage: 'Error cancelling job',
        onFinally: () => setLoading(false)
      }
    )
  }

  const markAsCompleted = (values = null) => {
    const dataToSend = {
      id: jobId,
      mileage: values?.mileage,
    }

    setLoading(true)
    api.markAsCompleted(dataToSend).handle({
        onSuccess: (res) => {
          handleCloseModal()
          getJob()
        },
        successMessage: 'Job mark as done successfully',
        errorMessage: 'Error marking job as done',
        onFinally: () => setLoading(false)
      }
    )
  }

  const payMileage = () => {
    const dataToSend = {
      id: jobId,
    }

    setLoading(true)
    api.payMileage(dataToSend).handle({
        onSuccess: (res) => {
          handleCloseModal()
          setTimeout(() => getJob(), 500)
        },
        successMessage: 'Job mileage paid successfully',
        errorMessage: 'Error paying job mileage',
        onFinally: () => setLoading(false)
      }
    )
  }

  const markAsFavorite = () => {
    setLoading(true)
    api.markAsFavorite(jobId).handle({
        onSuccess: (res) => {
          getJob()
        },
        successMessage: `Job ${jobDetails?.favorite ? 'unmarked' : 'marked'} as favorite successfully`,
        errorMessage: 'Error marking job as favorite',
        onFinally: () => setLoading(false)
      }
    )
  }


  const markAsViewed = () => {
    api.markAsViewed(jobId).handle({});
  }

  const getCreateChat = () => {
    setLoading(true)
    const data = {
      job_id: jobId,
    }
    api.startChat(data).handle({
        onSuccess: (res) => {
          navigate(ROUTES.MESSAGES, { state: { chatId: res?.data?.id } })
        },
        errorMessage: 'Error creating chat',
        onFinally: () => setLoading(false)
      }
    )
  }

  const handleCloseModal = () => {
    setShowActionModal(false)
    setShowMarkAsDoneIM(false)
    setPayMileageModal(false)
  }

  const handleAction = () => {
    if (action === 'delete') {
      cancelJob()
    } else if (action === 'finish') {
      markAsCompleted()
    }
  }

  const initialValues = {
    notes: '',
  };

  const validationSchema = Yup.object().shape({});


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

  const formikModal = useFormik({
    initialValues: {
      mileage: 0,
    },
    validationSchema: Yup.object().shape({
      mileage: Yup.number().required('Mileage is required'),
    }),
    onSubmit: (values) => {
      markAsCompleted(values);
    }
  })

  const handleSelect = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  useEffect(() => {
    if (jobId) getJob();
    markAsViewed()
    getCards()
  }, []);

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
            {loginStore.user_type === ROLES.INSPECTOR &&
              <MDBox display={'flex'} justifyContent={'flex-end'} alignItems={'flex-end'} mb={2}>
                <BookmarkOutlinedIcon
                  sx={{
                    color: jobDetails?.favorite ? "#8EDA4F" : "#006E90",
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer'
                  }}
                  onClick={() => markAsFavorite()}
                />
              </MDBox>}

            {loginStore.user_type === 'INSPECTOR' && <MDBox display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
              <MDButton
                disabled={loading}
                sx={{
                width: '150px',
                border: '2px solid #006E90',
                backgroundColor: 'white',
                height: '20px',
                borderRadius: 5,
              }}
                        onClick={() => {
                          if (loginStore.user_type === ROLES.INSPECTOR) {
                            getCreateChat()
                          } else {
                            navigate(ROUTES.MESSAGES)
                          }
                        }}
              >
                <MDTypography sx={{
                  color: '#006E90',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>Message</MDTypography>
                <QuestionAnswerOutlinedIcon
                  sx={{color: "#006E90", width: "30px", height: "30px", marginLeft: '2px'}}/>
              </MDButton>
              {jobDetails?.created_by?.linkedin && <MDBox
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
              </MDBox>}
            </MDBox>}
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
          <CustomTypography text="Job Industry"/>
          <CredentialsList documents={jobDetails?.industries || []}/>
          <CustomTypography text="Job Address"/>
          <MDBox display={'flex'} justifyContent={'space-between'} flexDirection={'column'}>
            <MDTypography sx={{fontSize: '16px', fontWeight: 'bold', marginTop: '20px'}}>
              {jobDetails?.country?.length === 1 ? "Country" : "Countries" }: {jobDetails?.country?.map((item, index) => `${item.name} ${index !== jobDetails?.country?.length - 1 ? ', ' : ''} ` )}
            </MDTypography>
            <MDTypography sx={{fontSize: '16px', fontWeight: 'bold', marginTop: '20px'}}>
              {jobDetails?.regions?.length === 1 ? "State" : "States" }: {jobDetails?.regions?.map((item, index) => `${item.name} ${index !== jobDetails?.regions?.length - 1 ? ', ' : ''} ` )}
            </MDTypography>
            <MDTypography sx={{fontSize: '16px', fontWeight: 'bold', marginTop: '20px'}}>
              Inspection Address: {jobDetails?.address}
            </MDTypography>
          </MDBox>
          <CustomTypography text="Payment"/>
          <MDBox>
            <MDTypography sx={{fontSize: '16px', marginTop: '15px', marginBottom: '10px'}}>
              Daily Rate: {money_fmt(jobDetails?.daily_rate)}
            </MDTypography>
            {jobDetails?.payment_modes.includes('per_diem') && (
              <MDTypography sx={{fontSize: '16px', marginTop: '15px', marginBottom: '10px'}}>
                Per Diem: {money_fmt(jobDetails?.per_diem_rate)}
              </MDTypography>
            )}
            {jobDetails?.payment_modes.includes('mileage') && (
              <MDTypography sx={{fontSize: '16px', marginTop: '15px', marginBottom: '10px'}}>
                Mileage: {money_fmt(jobDetails?.mileage_rate)}
              </MDTypography>
            )}
            {jobDetails?.payment_modes.includes('misc_other') && (
              <MDTypography sx={{fontSize: '16px', marginTop: '15px', marginBottom: '10px'}}>
                Misc/Other: {money_fmt(jobDetails?.misc_other_rate)}
              </MDTypography>
            )}
            {jobDetails?.total_amount && (
              <MDTypography sx={{fontSize: '16px', marginTop: '15px', marginBottom: '10px'}}>
                Total: {money_fmt(jobDetails?.total_amount)}
              </MDTypography>
            )}
          </MDBox>
          <CustomTypography text="Job Schedule"/>
          <MDBox display={'flex'} justifyContent={'space-between'}>
            <MDTypography sx={{fontSize: '16px', fontWeight: 'bold', marginTop: '20px'}}>
              Start Date: {date_fmt(jobDetails?.start_date, 'MMMM D, YYYY')}
            </MDTypography>
            <MDTypography sx={{fontSize: '16px', fontWeight: 'bold', marginTop: '20px'}}>
              End Date: {date_fmt(jobDetails?.end_date, 'MMMM D, YYYY')}
            </MDTypography>
          </MDBox>
        </Grid>
      </Grid>
      {jobDetails?.bid && <MDBox mt={2} mb={2}>
        <CustomTypography text="My Bid"/>
        <MDTypography sx={{fontSize: '16px', fontWeight: 'bold'}} mt={1}>
          Status: {capitalize(jobDetails?.status)}
        </MDTypography>
        <MDTypography sx={{fontSize: '16px', fontWeight: 'bold'}} mt={1} mb={2}>
          Note: {jobDetails?.bid?.note}
        </MDTypography>
        {jobDetails?.status === "started" && jobDetails?.bid?.status === 'accepted' && <MDButton
          color={'error'}
          loading={loading}
          disabled={loading}
          onClick={() => {
            setShowMarkAsDoneIM(true)
            setAction('finish')
          }}
        >
          Mark as done
        </MDButton>}
      </MDBox>}


      {loginStore.user_type === 'INSPECTOR' && jobDetails?.bid === null && <MDBox borderTop={"1px solid #ccc"}>
        <FormikProvider value={formik}>
          <Form>
            <Grid>
              <MDTypography sx={{fontSize: '16px', fontWeight: 'bold', marginTop: '20px', marginBottom: '10px'}}>
                Notes for the Owner
              </MDTypography>
              <FormikInput
                type="textarea"
                label=""
                name="notes"
                rows={7}
              />
              <MDBox display={'flex'} flexDirection={'column'} gap={2} marginTop={'20px'}>
                <MDBox sx={{display: 'flex', flexWrap: 'wrap', width: '100%', gap: '10px'}}>
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
                        whiteSpace: {xs: 'normal', sm: 'nowrap'},
                        fontWeight: 'bold',
                      }}
                    >
                      <IconButton
                        sx={{
                          width: {md: '30px', xs: '30px'}, height: {md: '30px', xs: '30px'},
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
                          <CheckIcon sx={{
                            color: '#006E90',
                            width: {md: '20px', xs: '30px'},
                            height: {md: '20px', xs: '30px'}
                          }}/>)}
                      </IconButton>
                      <MDTypography sx={{fontSize: '15px', fontWeight: 'bold', padding: '3px'}}>Provide The Owner With
                        The Attached Documents</MDTypography>
                    </MDTypography>
                  </MDBox>
                </MDBox>


                <MDBox sx={{display: 'flex', flexWrap: 'wrap', width: '100%', gap: '10px'}}>
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
                        whiteSpace: {xs: 'normal', sm: 'nowrap'},
                        fontWeight: 'bold',
                      }}
                    >

                      <IconButton
                        sx={{
                          width: {md: '30px', xs: '30px'}, height: {md: '30px', xs: '30px'},
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
                          <CheckIcon sx={{
                            color: '#006E90',
                            width: {md: '20px', xs: '30px'},
                            height: {md: '20px', xs: '30px'}
                          }}/>)}
                      </IconButton>

                      <MDTypography sx={{fontSize: '15px', fontWeight: 'bold', padding: '3px'}}> Confirm That I Meet The
                        Qualification For This Project</MDTypography>

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
                  Place a Bid
                </MDButton>
              </MDBox>

            </Grid>
          </Form>
        </FormikProvider>
      </MDBox>}
      {jobDetails?.transaction_processing && <Card sx={{
        p: 2,
        border: '1px solid #FB8C00',
        display: "flex",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexDirection: {xs: 'column', md: 'row'},
        borderRadius: '12px',
        mt:3
      }}>
        <MDBox>
          <MDTypography sx={{fontSize: '20px', fontWeight: 'bold'}}>
            Transaction in progress
          </MDTypography>
          <MDTypography sx={{fontSize: '14px', color: '#7B809A'}}>
            Please wait for the transaction to be completed. You will receive a notification once the transaction is completed.
          </MDTypography>
        </MDBox>
      </Card>}
      {loginStore.user_type === 'OWNER' && <MDBox borderTop={"1px solid #ccc"}>
        <MDBox display={'flex'} justifyContent={'flex-end'} gap={2} marginTop={'20px'} marginBottom={'20px'}>
          {jobDetails?.status !== "finished_by_inspector" && <MDButton
            color={'primary'}
            onClick={() => navigate(ROUTES.JOB_BIDS(jobId))}
          >
            Bids
          </MDButton>}
          {jobDetails?.status === "finished_by_inspector" && !jobDetails?.mileage_paid && <MDButton
            color={'error'}
            loading={loading}
            disabled={loading || cards.length === 0 || jobDetails?.transaction_processing }
            onClick={() => {
              setPayMileageModal(true)
              setInstantModal(true)
            }}
          >
            Pay mileage with saved card
          </MDButton>}
          {jobDetails?.status === "finished_by_inspector" && !jobDetails?.mileage_paid && <MDButton
            color={'error'}
            loading={loading}
            disabled={loading || jobDetails?.transaction_processing }
            onClick={() => {
              setPayMileageModal(true)
              setInstantModal(false)
            }}
          >
            Pay mileage with other stripe method
          </MDButton>}
          {jobDetails?.status === "finished_by_inspector" && jobDetails?.mileage_paid && <MDButton
            color={'error'}
            loading={loading}
            disabled={loading || jobDetails?.transaction_processing }
            onClick={() => {
              setAction('finish')
              setShowActionModal(true)
            }}
          >
            Mark as done
          </MDButton>}
          {(jobDetails?.status === "pending" || jobDetails?.status === "draft" )&& <MDButton
            color={'secondary'}
            onClick={() => navigate(ROUTES.EDIT_JOB(jobId))}
          >
            Edit
          </MDButton>}
          {jobDetails?.status === "pending" && <MDButton
            color={'error'}
            onClick={() => {
              setAction('delete')
              setShowActionModal(true)
            }}
          >
            {jobDetails?.bids === 0 ? 'Delete' : 'Cancel'}
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
      <Dialog open={showMarkAsDoneIM} onClose={handleCloseModal}>
        <DialogTitle>Mark Job as Done</DialogTitle>
        <DialogContent>
          {jobDetails?.payment_modes.includes('mileage') && <p>Do you want to mark this job as completed? This action will trigger the payment process for the
            owner, please enter the mileage to complete the process.</p>}
          {!jobDetails?.payment_modes.includes('mileage') && <p>Do you want to mark this job as completed? This action will trigger the payment process for the owner.</p>}
        </DialogContent>
        {jobDetails?.payment_modes.includes('mileage') && <FormikProvider value={formikModal}>
          <Form>
            <Grid container spacing={2} sx={{padding: '20px'}}>
              <Grid item xs={12}>
                <FormikInput
                  type="number"
                  label="Mileage"
                  name="mileage"
                />
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>}
        <DialogActions sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Box sx={{display: 'flex', justifyContent: 'flex-start', flexGrow: 1}}>
            <MDButton
              variant="outlined"
              onClick={handleCloseModal}
              color={'secondary'}
              disabled={loading}
            >
              Cancel
            </MDButton>
          </Box>
          {jobDetails?.payment_modes.includes('mileage')}
          <MDButton
            onClick={!jobDetails?.payment_modes.includes('mileage')  ? () => handleAction() : () => formikModal.submitForm()}
            color={'error'}
            disabled={loading}
            loading={loading}
          >
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>
      <Dialog open={showActionModal} onClose={handleCloseModal}>
        <DialogTitle>{action === 'delete' ? `${jobDetails?.bids === 0 ? 'Delete' : 'Cancel'} Job` : 'Mark Job as Done'}</DialogTitle>
        <DialogContent>
          {action === 'delete' && <p>Do you want to {jobDetails?.bids === 0 ? 'delete' : 'cancel'} this job?</p>}
          {action === 'finish' &&
            <p>Do you want to mark this job as completed? This action will trigger the payment process for the
              inspector.</p>}
        </DialogContent>
        <DialogActions sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Box sx={{display: 'flex', justifyContent: 'flex-start', flexGrow: 1}}>
            <MDButton
              variant="outlined"
              onClick={handleCloseModal}
              color={'secondary'}
              disabled={loading}
            >
              Cancel
            </MDButton>
          </Box>
          <MDButton
            onClick={handleAction}
            color={'error'}
            disabled={loading}
            loading={loading}
          >
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>
      <Dialog open={payMileageModal} onClose={() => setPayMileageModal(false)}>
        <DialogTitle>Pay Mileage</DialogTitle>
        <DialogContent>
          <p>Do you want to pay mileage pending for this job? <br/><br/> <h2>{money_fmt(jobDetails?.mileage_amount)}</h2></p>
        </DialogContent>
        <DialogActions sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Box sx={{display: 'flex', justifyContent: 'flex-start', flexGrow: 1}}>
            <MDButton
              variant="outlined"
              onClick={() => setPayMileageModal(false)}
              color={'secondary'}
              disabled={loading}
            >
              Cancel
            </MDButton>
          </Box>
          <MDButton
            onClick={() => instantModal ? payMileage() : createPaymentIntentLink()}
            color={'error'}
            disabled={loading}
            loading={loading}
          >
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>
      <PaymentModal
        stripeInstance={stripeInstance}
        open={open}
        onClose={() => {
          setOpen(false)
          handleCloseModal()
          setTimeout(() => getJob(), 500)
        }}
        clientSecret={clientSecret}
      />
    </AdminLayout>
  );
}

export default JobDetail;
