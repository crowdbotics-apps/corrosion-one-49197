import React, { useEffect, useRef, useState } from "react"
import MDBox from "../../../components/MDBox";
import Grid from "@mui/material/Grid"
import MDTypography from "../../../components/MDTypography"
import MDButton from "../../../components/MDButton"
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import MDAvatar from "../../../components/MDAvatar"
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined"
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import MDInput from "../../../components/MDInput"
import {useLocation, useParams} from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import FormikInput from "../../../components/Formik/FormikInput"
import { Form, FormikProvider, useFormik } from "formik"
import * as Yup from "yup"
import { useApi } from "../../../services/helpers"
import { formatDate, CustomTypography, DocumentList, CredentialsList } from "../findJobs/components/utils"
import { ROUTES } from "../../../services/constants"

function JobDetail() {
  const { state } = useLocation();
  const { jobId } = useParams()
  const [loading, setLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  const api = useApi();

  useEffect(() => {
    if (jobId) {
      getJob();
    }
  }, [jobId]);

  const getJob = () => {
    setLoading(true);

    api.getJob(jobId).handle({
      onSuccess: (result) => {
        setJobDetails(result.data);
      },
      errorMessage: 'Error getting job details',
      onFinally: () => setLoading(false)
    });
  };

  console.log('datos',jobDetails);



  const initialValues = {
    Notes: '',
    selectedItems: []
  };

  const validationSchema = Yup.object().shape({
    Notes: Yup.string().required('Notes is required'),
  });


  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('Form Values:', values);
    },
  });

  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelect = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <Grid display="flex" flex={1} sx={{padding:{md:'70px', xs:'10px'}}}>
      <Grid width={'100%'} alignItems={'center'} border={'1px solid rgba(0, 0, 0, 0.1)'} borderRadius={5} gap={5} padding={'33px'}>
        <Grid width={'100%'}>
          <Grid container display={'flex'} height={'auto'} justifyContent={'space-between'} alignItems={'center'}
            sx={{
              background: `linear-gradient(to bottom, rgba(60, 112, 146, 0.13), rgba(60, 112, 146, 0.13)), url(${jobDetails?.created_by?.banner})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 8,
              paddingTop:{md:'100px', xs:'20px'}
            }}
          >
            <Grid>
              <Grid display={'flex'} alignItems={'center'} gap={2} sx={{flexDirection:{md:'row', xs:'column'}, paddingLeft:{md:'20px'}}}>
                <MDAvatar
                  src={jobDetails?.created_by?.logo}
                  variant={"circular"}
                  sx={{
                    width: "90px",
                    height: "90px"
                  }}
                />
                <MDTypography sx={{color: '#006E90', fontSize: {md:'32px', xs:'20px'}, fontWeight: 'bold'}}>
                  BUILDINGS
                </MDTypography>
              </Grid>
              <Grid display={'flex'} flexDirection={'column'} alignItems={'center'} padding={'20px'} >
                <Grid display={'flex'} width={'100%'} gap={2}  justifyContent={'space-between'} sx={{flexDirection:{md:'row', xs:'column'}}}>
                  <MDBox display={'flex'} justifyContent={'space-between'} >
                  <EmailOutlinedIcon sx={{ color: "#006E90", width: "30px", height: "30px" }} />
                  <MDTypography sx={{ fontSize: "14px", marginLeft: "10px" }}>
                    {jobDetails?.created_by?.email}
                  </MDTypography>
                  </MDBox>
                  <MDBox display={'flex'} justifyContent={'space-between'}>
                  <PhoneOutlinedIcon sx={{ color: "#006E90",width: "30px", height: "30px" }} />
                  <MDTypography sx={{fontSize:"14px", marginLeft:"5px"}}>{jobDetails?.created_by?.phone_number}</MDTypography>
                  </MDBox>
                </Grid>
                <Grid display={'flex'} width={'100%'} gap={2} justifyContent={'space-between'} sx={{flexDirection:{md:'row', xs:'column'}}}>
                  <MDBox display={'flex'} justifyContent={'space-between'} >
                    < PinDropOutlinedIcon sx={{ color: "#006E90", width: "30px", height: "30px" }} />
                    <MDTypography sx={{fontSize:"14px", marginLeft:"10px"}}>{jobDetails?.created_by?.address}</MDTypography></MDBox>
                  <MDBox display={'flex'} justifyContent={'space-between'}>
                    <InsertLinkOutlinedIcon sx={{ color: "#006E90", width: "30px", height: "30px", marginTop: "-3px" }} />
                    <MDTypography sx={{fontSize:"14px", marginLeft:"10px"}}>{jobDetails?.created_by?.website}</MDTypography></MDBox>
                </Grid>
              </Grid>
            </Grid>


            {/*{isJobActive && (*/}
            <Grid marginRight={'10px'}>
                <>
                  <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={2}>
                    <MDButton sx={{ display:{xs: 'flex',md:'none' }, width:'150px', marginTop: "20px", border: '2px solid #006E90', backgroundColor: 'white', height:'20px', borderRadius: 5, }}>
                      <MDTypography sx={{color: '#006E90', fontWeight: 'bold', fontSize:{xs:'15px', md:'20px'}}}>Message</MDTypography>
                      <QuestionAnswerOutlinedIcon  sx={{ color: "#006E90", width: "30px", height: "30px", marginLeft:{ md:"10px", xs:"2px"} }} />
                    </MDButton>
                    <MDButton variant="text" sx={{display:{xs: 'none',md:'block' },marginTop:"20px", marginRight: "30px"}} >
                      <BookmarkOutlinedIcon  sx={{ color: "#006E90",width: '30px', height: '30px' }} />
                    </MDButton>

                    <MDButton color={'secondary'} sx={{ marginLeft:{xl:"50px"}, marginTop: '20px', height: {md:'60px', xs:'20px'}, borderRadius: 5, fontSize: { md: '18px', xs: '14px' } }}>
                      Bid
                    </MDButton>
                  </Grid>

                  <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={2}>
                    <MDButton sx={{ display:{xs: 'none',xxl:'flex' }, width: '70%', marginTop: '20px', border: '2px solid #006E90', backgroundColor: 'white', height:'60px', borderRadius: 5, gap:2, }}>
                      <MDTypography sx={{color: '#006E90', fontWeight: 'bold', fontSize:"20px"}}>Message</MDTypography>
                      <QuestionAnswerOutlinedIcon   sx={{ color: "#006E90", width: "30px", height: "30px" }} />
                    </MDButton>

                    <MDButton sx={{ width: { md: '20%', xs: '10px' }, marginTop: { md: '20px', xs: '10px' }, marginLeft: { xs: '30px' }, backgroundColor: '#1F425526', height: { md: '60px', xs: '20px' }, display: 'flex' }}
                      component="a"
                      href={jobDetails?.created_by?.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MDTypography sx={{ fontWeight: 'bold',  color: '#006E90',fontSize: { md: '30px', xs: '20px' } }}>
                        in
                      </MDTypography>
                    </MDButton>


                    <MDButton variant="text" sx={{display:{xs: 'block',md:'none' }, marginRight: "25px" }} >
                      <BookmarkOutlinedIcon  sx={{ color: "#006E90",width: '30px', height: '30px' }} />
                    </MDButton>
                  </Grid>
                </>

            </Grid>
            {/*)}*/}
          </Grid>

          <Grid container display={'flex'}>
            <Grid sx={{ width: {md:"100%", xs:"100%", sm:"100%", xl:"100%",xxl:"48%"},marginTop:{md:"40px", xs:"10px"}, marginBottom:"20px"}}>
              <CustomTypography text="Job Description" />
              <MDTypography sx={{fontSize: '14px', marginTop: '20px', marginRight: '20px'}}>
                <div dangerouslySetInnerHTML={{ __html: jobDetails?.description }} />
              </MDTypography>
            </Grid>

            <MDBox sx={{ marginTop: '20px', marginBottom: '20px', height: 'auto', borderLeft: '1px solid #ccc', marginLeft: '20px' }} />

            <Grid sx={{ width: { xs: "100%", md: "100%%" , xxl:"48%"}, marginBottom: "20px", marginLeft: {xxl:"30px", xs:"5px"}, overflow: "hidden", marginTop:'20px' }}>
              <CustomTypography text="Requirement" />

              <DocumentList documents={jobDetails?.documents} />

              <CredentialsList documents={jobDetails?.certifications || []} />

              <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                <MDTypography sx={{ fontSize: '16px', fontWeight: 'bold', marginTop: '20px' }}>
                  Start Date: {formatDate(jobDetails?.start_date)}
                </MDTypography>
                <MDTypography sx={{ fontSize: '16px', fontWeight: 'bold', marginTop: '20px', marginLeft: {xxl:'100px', md:'350px'} }}>
                  End Date: {formatDate(jobDetails?.end_date)}
                </MDTypography>
              </Grid>

              <CustomTypography text="Payment" />

              <MDTypography sx={{ fontSize: '16px', marginTop: '15px' ,marginBottom:'10px'}}>
                Daily Rate: $ {jobDetails?.daily_rate}
              </MDTypography>

              {jobDetails?.per_diem_rate !== '0.00' && (
                <MDTypography sx={{ fontSize: '16px', marginTop: '15px', marginBottom: '10px' }}>
                  Per Diem: $ {jobDetails?.per_diem_rate}
                </MDTypography>
              )}

              {jobDetails?.mileage_rate !== '0.00' && (
              <MDTypography sx={{ fontSize: '16px', marginTop: '15px' ,marginBottom:'10px'}}>
                Mileage: $ {jobDetails?.mileage_rate}
              </MDTypography>
              )}

              {jobDetails?.misc_other_rate !== '0.00' && (
              <MDTypography sx={{ fontSize: '16px', marginTop: '15px' ,marginBottom:'10px'}}>
                Misc/Other: $ {jobDetails?.misc_other_rate}
              </MDTypography>
              )}
            </Grid>
          </Grid>
        </Grid>


        {/*{isJobActive && (*/}
        {/*<Grid borderTop={"1px solid #ccc"}>*/}
        {/*  <FormikProvider value={formik}>*/}
        {/*    <Form>*/}
        {/*      <Grid>*/}
        {/*        <MDTypography sx={{ fontSize: '16px', fontWeight: 'bold', marginTop: '20px' , marginBottom: '10px' }}>*/}
        {/*          Notes for the Owner*/}
        {/*        </MDTypography>*/}
        {/*        <FormikInput*/}
        {/*          type="textarea"*/}
        {/*          label=""*/}
        {/*          name="Notes"*/}
        {/*          rows={7}*/}
        {/*        />*/}
        {/*        <Grid display={'flex'} flexDirection={'column'} gap={2} marginTop={'20px'} >*/}
        {/*          <MDBox sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: '10px' }}>*/}
        {/*            <MDBox*/}
        {/*              sx={{*/}
        {/*                backgroundColor: 'white',*/}
        {/*                border: '1px solid rgba(0, 0, 0, 0.2)',*/}
        {/*                borderRadius: 5,*/}
        {/*                width: 'fit-content',*/}
        {/*                marginBottom: '10px',*/}
        {/*                cursor: 'pointer',*/}
        {/*              }}*/}
        {/*              onClick={() => handleSelect('item1')}*/}
        {/*            >*/}
        {/*              <MDTypography*/}
        {/*                sx={{*/}
        {/*                  padding: '5px',*/}
        {/*                  display: 'flex',*/}
        {/*                  fontSize: '14px',*/}
        {/*                  margin: '7px',*/}
        {/*                  whiteSpace: { xs: 'normal', sm: 'nowrap' },*/}
        {/*                  fontWeight: 'bold',*/}
        {/*                }}*/}
        {/*              >*/}
        {/*                  <IconButton*/}
        {/*                    sx={{*/}
        {/*                      width: {md:'30px', xs:'30px'}, height: {md:'30px', xs:'30px'},*/}
        {/*                      backgroundColor: 'grey.300',*/}
        {/*                      borderRadius: '50%',*/}
        {/*                      marginRight: '8px',*/}
        {/*                      '&:hover': {*/}
        {/*                        backgroundColor: 'grey.400',*/}
        {/*                      },*/}
        {/*                    }}*/}
        {/*                    aria-label="check"*/}
        {/*                  >*/}
        {/*                    {selectedItems.includes('item1') && (*/}
        {/*                    <CheckIcon sx={{ color: '#006E90',  width: {md:'20px', xs:'30px'}, height: {md:'20px', xs:'30px'} }} /> )}*/}
        {/*                  </IconButton>*/}
        {/*                <MDTypography sx={{fontSize:'15px',fontWeight: 'bold', padding:'3px' }}>Provide The Owner With The Attached Documents</MDTypography>*/}
        {/*              </MDTypography>*/}
        {/*            </MDBox>*/}
        {/*          </MDBox>*/}


        {/*          <MDBox sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: '10px' }}>*/}
        {/*            <MDBox*/}
        {/*              sx={{*/}
        {/*                backgroundColor: 'white',*/}
        {/*                border: '1px solid rgba(0, 0, 0, 0.2)',*/}
        {/*                borderRadius: 5,*/}
        {/*                width: 'fit-content',*/}
        {/*                marginBottom: '10px',*/}
        {/*                cursor: 'pointer',*/}
        {/*              }}*/}
        {/*              onClick={() => handleSelect('item2')}*/}
        {/*            >*/}
        {/*              <MDTypography*/}
        {/*                sx={{*/}
        {/*                  padding: '5px',*/}
        {/*                  display: 'flex',*/}
        {/*                  fontSize: '14px',*/}
        {/*                  margin: '7px',*/}
        {/*                  whiteSpace: { xs: 'normal', sm: 'nowrap' },*/}
        {/*                  fontWeight: 'bold',*/}
        {/*                }}*/}
        {/*              >*/}

        {/*                  <IconButton*/}
        {/*                    sx={{*/}
        {/*                      width: {md:'30px', xs:'30px'}, height: {md:'30px', xs:'30px'},*/}
        {/*                      backgroundColor: 'grey.300',*/}
        {/*                      borderRadius: '50%',*/}
        {/*                      marginRight: '8px',*/}
        {/*                      '&:hover': {*/}
        {/*                        backgroundColor: 'grey.400',*/}
        {/*                      },*/}
        {/*                    }}*/}
        {/*                    aria-label="check"*/}
        {/*                  >*/}
        {/*                    {selectedItems.includes('item2') && (*/}
        {/*                    <CheckIcon sx={{ color: '#006E90', width: {md:'20px', xs:'30px'}, height: {md:'20px', xs:'30px'}}} />  )}*/}
        {/*                  </IconButton>*/}

        {/*                <MDTypography sx={{fontSize:'15px',fontWeight: 'bold', padding:'3px' }}> Confirm That I Meet The Qualification For This Project</MDTypography>*/}

        {/*              </MDTypography>*/}
        {/*            </MDBox>*/}
        {/*          </MDBox>*/}
        {/*        </Grid>*/}

        {/*        <MDButton color={'secondary'} sx={{ marginLeft: 'auto', height: { md: '60px', xs: '40px' }, fontSize: { md: '18px', xs: '14px' } ,display: 'flex', borderRadius: 5, }} type="submit">*/}
        {/*          Apply For The Job*/}
        {/*        </MDButton>*/}

        {/*      </Grid>*/}
        {/*    </Form>*/}
        {/*  </FormikProvider>*/}
        {/*</Grid>*/}
        {/*)}*/}

      </Grid>
    </Grid>

  );
}

export default JobDetail;
