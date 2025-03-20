import React, { useEffect, useRef, useState } from "react"
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid"
import MDTypography from "../MDTypography"
import MDButton from "../MDButton"
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import MDAvatar from "../MDAvatar"
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined"
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import MDInput from "../MDInput"
import { useLocation } from 'react-router-dom';

function Details() {
  const location = useLocation();
  const data = location.state;

  // const [fileName, setFileName] = useState('');
  //
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setFileName(file.name);
  //   }
  // };
  //
  // const handleButtonClick = () => {
  //   document.getElementById('fileInput').click();
  // };



  return (
    <MDBox display="flex" flex={1} style={{ border: "none", backgroundColor: "white" }}>
      <MDBox
        sx={{
          backgroundColor: "white",
          width: {md:"90%", xs:"90%"},
          margin:{md:"70px", xs:"20px"},
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: 5,
        }}
      >
        <Grid sx={{ width:{ md:"95%", xs:"85%"},height:"50%", margin: {md:"33px", xs:"20px"} }}>
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
                  <LanguageIcon sx={{ color: "#006E90", width: "30px", height: "30px" }} />
                  <MDTypography sx={{fontSize:"14px", marginLeft:"10px"}}>www.buildings.com</MDTypography>
                </MDBox>
              </MDBox>

            </MDBox>


            <MDBox sx={{
              position: 'absolute',
              top: { xs:'350px', lg:'250px'},
              right: {lg:170, xs:60},
            }}>
              {data && data.someKey && (
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
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderRadius: 5,
                      }}
                    >
                      <MDTypography sx={{color: '#006E90', fontWeight: 'bold', fontSize:{xs:'15px', md:'20px'}}}>Message</MDTypography>
                      <SmsOutlinedIcon  sx={{ color: "#006E90", width: "30px", height: "30px", marginLeft:{ md:"10px", xs:"2px"} }} />
                    </MDButton>
                    <MDButton variant="text" sx={{display:{xs: 'none',xxl:'block' },marginTop:{ md:"20px"}, marginRight: "30px"}} >
                      <BookmarkOutlinedIcon  sx={{ color: "#006E90",width: '30px', height: '30px' }} />
                    </MDButton>

                    <MDButton
                      sx={{
                        marginLeft:{xl:"50px"},
                        paddingLeft:{xxl: '4%',xs:'10%', sm:"4%"},
                        marginTop: '20px',
                        backgroundColor: '#006E90',
                        color: 'white',
                        height: {md:'60px', xs:'20px'},
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderRadius: 5,
                        '&:hover': {
                          backgroundColor: '#006E90',
                        },
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
                      <SmsOutlinedIcon  sx={{ color: "#006E90", width: "30px", height: "30px", marginLeft:{ md:"10px", xs:"2px"} }} />
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
            <Grid sx={{ width: {md:"100%", xs:"100%", sm:"100%", xl:"100%",xxl:"48%"}, borderRight: {xxl:"1px solid #ccc"},marginTop:{md:"40px", xs:"10px"}, marginBottom:"20px"}}>
              <MDTypography sx={{color: '#006E90', fontSize: '20px', fontWeight: 'bold', marginTop: '20px'}}>
                Job Description
              </MDTypography>
              <MDTypography sx={{fontSize: '14px', marginTop: '20px', marginRight: '20px'}}>
                Technology has become an integral part of our daily lives, shaping the way we communicate, work, and entertain ourselves. Advancements in fields like artificial intelligence, automation, and machine learning have brought about both exciting opportunities and challenges. While these innovations increase productivity and connectivity, they also raise important questions about privacy, security, and their impact on society. As we move forward, it is essential to balance progress with responsibility, ensuring that technological growth benefits everyone.
              </MDTypography>
              <MDTypography sx={{fontSize: '14px', marginTop: '20px', fontWeight: 'bold'}}>
                Quisque at lacus nec est facilisis faucibus.
              </MDTypography>
              <ul style={{paddingLeft: '30px', fontSize: '14px', marginTop: '10px'}}>
              <li>Duis vitae lectus</li>
              <li>Lectus aliquet convallis</li>
              <li>Cras maximus</li>
              </ul>
              <MDTypography sx={{fontSize: '14px', marginTop: '20px', marginRight: '20px'}}>
               Duis consequat elementum enim at ullamcorper. Cras maximus.<br/>
                Lorem  ipsum dolor sit amet, consectetur adipiscing elit, sed diam.
              </MDTypography>

            </Grid>


            <Grid sx={{ width: { xs: "100%", md: "100%%" , xxl:"48%"}, marginTop: {md:"40px", xs:"10px"}, marginBottom: "20px", marginLeft: {xxl:"30px", xs:"5px"}, overflow: "hidden" }}>
              <MDTypography sx={{ color: '#006E90', fontSize: '20px', fontWeight: 'bold', marginTop: '20px' , marginBottom: '20px'}}>
                Requirement
              </MDTypography>

              <MDButton
                color={'primary'}
                sx={{
                  width: '100%',
                  marginTop: '20px',
                  backgroundColor: '#6DDA434D',
                  color: 'white',
                  height: '60px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: '#6DDA434D',
                  },
                }}
                // onClick={handleButtonClick}
              >
                <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
                  <DescriptionOutlinedIcon sx={{ color: "#006E90", width: "30px", height: "30px", marginRight: '8px' }} />
                  <MDBox sx={{ marginLeft: {md:'20px', xs:'10px'}, overflow: 'hidden' }}>
                    <MDTypography sx={{ fontWeight: 'bold', fontSize:{md: '14px', xs:'12px'}, marginTop: '2px' }}>
                      Requirement Doc
                      {/*{fileName ? fileName : 'No file selected'}*/}
                    </MDTypography>

                    <MDTypography sx={{ color: 'gray', fontSize: '14px', marginTop: {md:'2px', xs: '-1px'} }}>
                      3.5 MB
                    </MDTypography>
                  </MDBox>
                </MDBox>

                <FileDownloadOutlinedIcon sx={{ color: "#006E90", width: "30px", height: "30px"}} />
              </MDButton>

              <MDButton
                color={'primary'}
                sx={{
                  width: '100%',
                  marginTop: '20px',
                  backgroundColor: '#6DDA434D',
                  color: 'white',
                  height: '60px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: '#6DDA434D',
                  },
                }}
                // onClick={handleButtonClick}
              >
                <MDBox sx={{ display: 'flex', alignItems: 'center' }}>
                  <DescriptionOutlinedIcon sx={{ color: "#006E90", width: "30px", height: "30px", marginRight: '8px' }} />
                  <MDBox sx={{ marginLeft: {md:'20px', xs:'10px'}, overflow: 'hidden' }}>
                    <MDTypography sx={{ fontWeight: 'bold',fontSize:{md: '14px', xs:'12px'}, marginTop: '2px' }}>
                      Requirement Doc
                      {/*{fileName ? fileName : 'No file selected'}*/}
                    </MDTypography>

                    <MDTypography sx={{ color: 'gray', fontSize: '14px', marginTop: '2px' }}>
                      3.5 MB
                    </MDTypography>
                  </MDBox>
                </MDBox>

                <FileDownloadOutlinedIcon sx={{ color: "#006E90", width: "30px", height: "30px"}} />
              </MDButton>

              {/*<MDInput*/}
              {/*  type="file"*/}
              {/*  id="fileInput"*/}
              {/*  style={{ display: 'none' }}*/}
              {/*  onChange={handleFileChange}*/}
              {/*/>*/}

              <MDBox sx={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', width: '100%' , gap: 2}}>
                <MDBox
                  sx={{
                    backgroundColor: "white",
                    border: "1px solid rgba(0, 0, 0, 0.2)",
                    borderRadius: 5,
                    width: 'fit-content',
                    marginBottom: '10px',
                  }}
                >
                  <MDTypography
                    sx={{
                      fontSize: '14px',
                      margin: '7px',
                      whiteSpace: { xs: 'normal', sm: 'nowrap' },
                      fontWeight: 'bold',
                    }}
                  >
                    OSHA Safety Certification
                  </MDTypography>
                </MDBox>

                <MDBox
                  sx={{
                    backgroundColor: "white",
                    border: "1px solid rgba(0, 0, 0, 0.2)",
                    borderRadius: 5,
                    width: 'fit-content',
                    marginBottom: '10px',
                  }}
                >
                  <MDTypography
                    sx={{
                      fontSize: '14px',
                      margin: '7px',
                      whiteSpace: { xs: 'normal', sm: 'nowrap' },
                      fontWeight: 'bold',
                    }}
                  >
                    Roof Inspection Certification
                  </MDTypography>
                </MDBox>

                <MDBox
                  sx={{
                    backgroundColor: "white",
                    border: "1px solid rgba(0, 0, 0, 0.2)",
                    borderRadius: 5,
                    width: 'fit-content',
                    marginBottom: '10px',
                  }}
                >
                  <MDTypography
                    sx={{
                      fontSize: '14px',
                      margin: '7px',
                      whiteSpace: { xs: 'normal', sm: 'nowrap' },
                      fontWeight: 'bold',
                    }}
                  >
                    Building Safety Inspector Certification
                  </MDTypography>
                </MDBox>

              </MDBox>
              <MDTypography sx={{ color: '#006E90', fontSize: '20px', fontWeight: 'bold', marginTop: '20px' }}>
                Payment
              </MDTypography>
              <MDBox sx={{display: {xxl:'flex', xs:'column', md:'flex'}}}>
                <MDTypography sx={{ fontSize: '16px', fontWeight: 'bold', marginTop: '20px' }}>
                  Start Date: January 15, 2025.
                </MDTypography>
                <MDTypography sx={{ fontSize: '16px', fontWeight: 'bold', marginTop: '20px', marginLeft: {xxl:'100px', md:'350px'} }}>
                  End Date: July 20, 2025.
                </MDTypography>
              </MDBox>
              <MDTypography sx={{ fontSize: '16px', marginTop: '15px'}}>
                Budget: $600 - $800 Per/Month (Terms Are Not Negotiable).
              </MDTypography>

            </Grid>

          </Grid>

        </Grid>





      </MDBox>
    </MDBox>

  );
}

export default Details;
