import React, { useEffect, useRef, useState } from "react"
import MDBox from "../../../../components/MDBox";
import Grid from "@mui/material/Grid"
import MDTypography from "../../../../components/MDTypography"
import MDButton from "../../../../components/MDButton"
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import MDAvatar from "../../../../components/MDAvatar"
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined"
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import MDInput from "../../../../components/MDInput"
import { useLocation } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import FormikInput from "../../../../components/Formik/FormikInput"
import { Form, FormikProvider, useFormik } from "formik"
import * as Yup from "yup"
import { useApi } from "../../../../services/helpers"
import { formatDate, CustomTypography, DocumentList, CredentialsList } from "./utils"

function Details() {
  const { state } = useLocation();
  console.log("State recibido:", state);
  const { jobDetails, isJobActive } = state || {};
  const [loading, setLoading] = useState(false);
  const api = useApi()
  console.log('wiiiiiiiiiiiiiii', jobDetails);
  console.log('HBVDGVF', isJobActive);



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
    <MDBox display="flex" flex={1} style={{ border: "none", backgroundColor: "white" }}>
      <MDBox sx={{ height: {md:"125vh", xs:'295vh'}, display: 'flex', flexDirection: 'column', backgroundColor: 'white', width: { md: '90%', xs: '90%' }, margin: { md: '70px', xs: '20px' }, border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: 5, gap:{md:5, xs:30}, }}>
        <MDBox sx={{ width:{ md:"95%", xs:"85%"}, margin: {md:"33px", xs:"20px"} }}>
          <Grid
            container
            sx={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.9)), url(https://s3-alpha-sig.figma.com/img/0d71/9fb8/195f25bf6bb441f95387e313aeab9dd6?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=QxNZn31fwZQ~q49Uq42it2TG4WBXT9szZ1DxmqooPeZKm4SuFcaTwtPXEMIHaM-JnepzhMsxiAJZf7DOLwxzHVCHAa5Jlklp0vEkqe6fh2pKLHX-sL10e59t8bEeZNYKOFqIf0taYmrbKeaoDOMDT~FRLgZULgdf9dAErVVAzi1CLAGF1tVlo0P-vcYKi--wRXgupCr3c7bAjSnVWY1WyJUwGjSkE01ftZMv6hVxmyt80GrcMTaliBESwNBivKaeqLmDB9ohbmV5hrGUBsb1xEz2QMQQ6ywKFg6vfDT7Htp4Du4QVXvrar4ewPIxRmX3AkBd21r0dnF4F~549nSfsA__)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: {xl:'300px', xs:"450px", md:"450px"},
              borderRadius: 8,
              backgroundRepeat: 'no-repeat',
              width: '100%',
            }}
          >
            <MDBox sx={{
              marginLeft: {md:"20px"},
              marginTop: {xl:"95px", xs:"10px", md:"10px"},
            }}>
              <MDBox sx={{display: {xs:'column', md:'column', lg:'column', xl:'flex'}}}>
              <MDAvatar
                src={"https://media.istockphoto.com/id/1300845620/es/vector/icono-de-usuario-plano-aislado-sobre-fondo-blanco-s%C3%ADmbolo-de-usuario-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=grBa1KTwfoWBOqu1n0ewyRXQnx59bNHtHjvbsFc82gk="}
                variant={"circular"}
                sx={{
                  marginLeft:{xs:'90px', md:'20px'},
                  fontSize: "100px",
                  marginTop: "17px",
                  borderRadius: "50%",
                  width: "90px",
                  height: "90px"
                }}
              />
              <MDTypography sx={{color: '#006E90', fontSize: {md:'32px', xs:'20px'}, fontWeight: 'bold', marginTop: {md:'50px', xs:'10px'}, marginLeft: {md:'10px', xs:`80px`}}}>
                BUILDINGS
              </MDTypography>
              </MDBox>

              <MDBox sx={{
                display: {xs:'column', md:'column', lg:'column', xl:'flex'},
                marginLeft: "20px",
                marginTop: "10px"
              }}>
                <MDBox sx={{display: 'flex'}}>
                  <EmailOutlinedIcon sx={{ color: "#006E90", width: "30px", height: "30px" }} />
                  <MDTypography sx={{fontSize:"14px", marginLeft:"10px"}}>buildings@buildings.com</MDTypography>
                </MDBox>
                <MDBox sx={{display:'flex', marginLeft:{xl:"20px"}}}>
                  <PhoneOutlinedIcon sx={{ color: "#006E90",width: "30px", height: "30px" }} />
                  <MDTypography sx={{fontSize:"14px", marginLeft:"10px"}}>+ 1800 1234 432</MDTypography>
                </MDBox>
              </MDBox>
              <MDBox sx={{
                display: {xs:'column', md:'column', lg:'column', xl:'flex'},
                marginLeft: "20px",
                marginTop: "10px"
              }}>
                <MDBox sx={{display:'flex'}}>
                  < PinDropOutlinedIcon sx={{ color: "#006E90", width: "30px", height: "30px" }} />
                  <MDTypography sx={{fontSize:"14px", marginLeft:"10px"}}>Porto, Portugal</MDTypography>
                </MDBox>
                <MDBox sx={{display:'flex', marginLeft:{xl:"85px"}}}>
                  <InsertLinkOutlinedIcon sx={{ color: "#006E90", width: "30px", height: "30px", marginTop: "-3px" }} />
                  <MDTypography sx={{fontSize:"14px", marginLeft:"10px"}}>www.buildings.com</MDTypography>
                </MDBox>
              </MDBox>

            </MDBox>


            <MDBox sx={{
              position: 'absolute',
              top: { xs:'350px', lg:'250px'},
              right: {lg:170, xs:60},
            }}>
              {isJobActive && (
                <>
                  <MDBox sx={{display: "flex", gap:{xs:2}}}>
                    <MDButton
                      sx={{
                        marginLeft:"5px",
                        display:{xs: 'flex',xxl:'none' },
                        width: {md:'70%',xs:"150px"},
                        marginTop: "20px",
                        border: '2px solid #006E90',
                        backgroundColor: 'white',
                        height:{ md:'60px', xs:'20px'},
                        borderRadius: 5,
                      }}
                    >
                      <MDTypography sx={{color: '#006E90', fontWeight: 'bold', fontSize:{xs:'15px', md:'20px'}}}>Message</MDTypography>
                      <QuestionAnswerOutlinedIcon  sx={{ color: "#006E90", width: "30px", height: "30px", marginLeft:{ md:"10px", xs:"2px"} }} />
                    </MDButton>
                    <MDButton variant="text" sx={{display:{xs: 'none',xxl:'block' },marginTop:{ md:"20px"}, marginRight: "30px"}} >
                      <BookmarkOutlinedIcon  sx={{ color: "#006E90",width: '30px', height: '30px' }} />
                    </MDButton>

                    <MDButton
                      color={'secondary'}
                      sx={{
                        marginLeft:{xl:"50px"},
                        paddingLeft:{xxl: '4%',xs:'10%', sm:"4%"},
                        marginTop: '20px',
                        backgroundColor: '#006E90',
                        color: 'white',
                        height: {md:'60px', xs:'20px'},
                        borderRadius: 5,
                      }}
                    >
                      <MDTypography sx={{color: '#fcfdfd', fontWeight: 'bold', marginLeft:{md:'15px'}, fontSize:{xs:'15px', md:'20px'}}}>Bid</MDTypography>
                    </MDButton>
                  </MDBox>

                  <MDBox sx={{display: "flex",gap:{xs:10, md:1}}}>
                    <MDButton
                      sx={{
                        display:{xs: 'none',xxl:'flex' },
                        width: {md:'70%',xs:"150px"},
                        marginTop: {md:'20px', xs:'10px'},
                        border: '2px solid #006E90',
                        backgroundColor: 'white',
                        height:{ md:'60px', xs:'20px'},
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderRadius: 5,
                      }}
                    >
                      <MDTypography sx={{color: '#006E90', fontWeight: 'bold', fontSize:{xs:'15px', md:'20px'}}}>Message</MDTypography>
                      <QuestionAnswerOutlinedIcon   sx={{ color: "#006E90", width: "30px", height: "30px", marginLeft:{ md:"10px", xs:"2px"} }} />
                    </MDButton>

                    <MDButton
                      sx={{
                        marginLeft:{ md:'5px', xs:'10px'},
                        width: {md:'20%', xs:'10px'} ,
                        marginTop: {md:'20px', xs:'10px'},
                        backgroundColor: '#1F425526',
                        height: {md:'60px', xs:'20px'},
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <MDTypography sx={{ color: '#006E90', fontWeight: 'bold', fontSize: {md:'30px', xs:'20px'} }}>in</MDTypography>
                    </MDButton>
                    <MDButton variant="text" sx={{display:{xs: 'block',xxl:'none' },marginTop:{ md:"20px"}, marginRight: "25px" }} >
                      <BookmarkOutlinedIcon  sx={{ color: "#006E90",width: '30px', height: '30px' }} />
                    </MDButton>
                  </MDBox>
                </>
              )}
            </MDBox>

          </Grid>

          <Grid
            container
            style={{
              display: "flex",
              height: '100%',
              borderRadius: 8,
              backgroundRepeat: 'no-repeat',
              width: '100%',
            }}
          >
            <MDBox sx={{ width: {md:"100%", xs:"100%", sm:"100%",height:'300px', xl:"100%",xxl:"48%"}, borderRight: {xxl:"1px solid #ccc"},marginTop:{md:"40px", xs:"10px"}, marginBottom:"20px"}}>
              <CustomTypography text="Job Description" />
              <MDTypography sx={{fontSize: '14px', marginTop: '20px', marginRight: '20px'}}>
                <div dangerouslySetInnerHTML={{ __html: jobDetails?.description }} />
              </MDTypography>
              {/*<MDTypography sx={{fontSize: '14px', marginTop: '20px', fontWeight: 'bold'}}>*/}
              {/*  Quisque at lacus nec est facilisis faucibus.*/}
              {/*</MDTypography>*/}
              {/*<ul style={{paddingLeft: '30px', fontSize: '14px', marginTop: '10px'}}>*/}
              {/*<li>Duis vitae lectus</li>*/}
              {/*<li>Lectus aliquet convallis</li>*/}
              {/*<li>Cras maximus</li>*/}
              {/*</ul>*/}
              {/*<MDTypography sx={{fontSize: '14px', marginRight: '20px'}}>*/}
              {/*  Duis consequat elementum enim at ullamcorper. Cras maximus.<br/>*/}
              {/*  Lorem  ipsum dolor sit amet, consectetur adipiscing elit, sed diam.*/}
              {/*</MDTypography>*/}

            </MDBox>

            <MDBox sx={{ width: { xs: "100%", md: "100%%" , xxl:"48%"}, marginBottom: "20px", marginLeft: {xxl:"30px", xs:"5px"}, overflow: "hidden", marginTop:'20px' }}>
              <CustomTypography text="Requirement" />

              <DocumentList documents={jobDetails?.document} />

              <CredentialsList documents={jobDetails?.certifications} />

              <CustomTypography text="Payment" />
              <MDBox sx={{display: {xxl:'flex', xs:'column', md:'flex'}}}>
                <MDTypography sx={{ fontSize: '16px', fontWeight: 'bold', marginTop: '20px' }}>
                  Start Date: {formatDate(jobDetails?.start_date)}
                </MDTypography>
                <MDTypography sx={{ fontSize: '16px', fontWeight: 'bold', marginTop: '20px', marginLeft: {xxl:'100px', md:'350px'} }}>
                  End Date: {formatDate(jobDetails?.end_date)}
                </MDTypography>
              </MDBox>
              <MDTypography sx={{ fontSize: '16px', marginTop: '15px'}}>
                Budget: $600 - $800 Per/Month (Terms Are Not Negotiable).
              </MDTypography>

            </MDBox>

          </Grid>

        </MDBox>


        {isJobActive && (
        <MDBox sx={{ width:{ md:"95%", xs:"85%"},height:"50%",borderTop: {xxl:"1px solid #ccc"},marginLeft:{md:"33px", xs:"20px"}, marginRight:{md:"33px", xs:"20px"} }}>
          <FormikProvider value={formik}>
            <Form>
              <MDBox sx={{ position: 'relative' }}>
                <MDTypography sx={{ fontSize: '16px', fontWeight: 'bold', marginTop: '20px' , marginBottom: '10px' }}>
                  Notes for the Owner
                </MDTypography>
                <FormikInput
                  type="textarea"
                  label=""
                  name="Notes"
                  rows={7}
                />


                <MDBox sx={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
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

                <MDButton
                  color={'secondary'}
                  sx={{
                    position: 'absolute',
                    marginTop: '10px',
                    right: '20px',
                    color: 'white',
                    height: { md: '60px', xs: '40px' },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}
                  type="submit"
                >
                  <MDTypography sx={{color: '#fcfdfd', fontWeight: 'bold',  fontSize:{xs:'15px', md:'16px'}}}>Apply For The Job</MDTypography>
                </MDButton>

              </MDBox>
            </Form>
          </FormikProvider>
        </MDBox>
          )}
      </MDBox>
    </MDBox>

  );
}

export default Details;
