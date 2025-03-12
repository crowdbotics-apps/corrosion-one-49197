import React, { useEffect, useRef, useState } from "react"
import MDBox from "components/MDBox";
import MDTypography from "../../MDTypography";
import { InputAdornment, Select, TextField } from "@mui/material"
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import MDButton from "../../MDButton"
import { MenuItem, FormControl, InputLabel } from '@mui/material';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined';
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined';
import FormatUnderlinedOutlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined';
import StrikethroughSOutlinedIcon from '@mui/icons-material/StrikethroughSOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';


export function PostJob() {

  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };


  return (
    <MDBox display="flex" flex={1} style={{ border: "none", backgroundColor: "white"}}>
      <MDBox sx={{  width: "100%", height: "100%", display: "flex" }}>
        <MDBox sx={{ with:'100%'}}>
          <MDBox style={{ width: '100%' }}>
            <MDTypography variant="h5" component="div">Job Title</MDTypography>
            <TextField
              id="outlined-basic"
              label="Job title"
              variant="outlined"
              sx={{
                padding: '0px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </MDBox>

          <MDBox sx={{ with: "120px" , height: "100px" , marginTop: "20px" }}>
            <MDTypography variant="h5" component="div">Job Address</MDTypography>
            <FormControl fullWidth sx={{ width: '100%'}}>
              <InputLabel id="demo-simple-select-label" sx={{padding:"1px"}}>Select Your Category</InputLabel>

              <Select
                variant='outlined'
                sx={{
                  padding: { md: '0px', xs: '10px' },
                  width: '100%',
                  boxSizing: 'border-box',
                  height:'45px',
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Select Your Category"
                onChange={handleChange}
              >
                <MenuItem value={10}>Tenn</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>

          </MDBox>

          <MDBox sx={{ with: "120px" , height: "100px"  }}>
            <MDTypography variant="h5" component="div">Category</MDTypography>
            <FormControl fullWidth sx={{ width: '100%'}}>
              <InputLabel id="demo-simple-select-label" sx={{padding:"1px"}}>Select Your Category</InputLabel>

              <Select
                variant='outlined'
                sx={{
                  padding: { md: '0px', xs: '10px' },
                  width: '100%',
                  boxSizing: 'border-box',
                  height:'45px',
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Select Your Category"
                onChange={handleChange}
              >
                <MenuItem value={10}>Tenn</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>

          </MDBox>
          <MDBox sx={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', width: '100%' , gap: '10px' }}>
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
                  padding: '2px',
                  display: "flex",
                  fontSize: '14px',
                  margin: '7px',
                  whiteSpace: { xs: 'normal', sm: 'nowrap' },
                  fontWeight: 'bold',
                }}
              >
                <CancelOutlinedIcon sx={{margin: '2px', width: '20px', height: '20px', color: 'red', marginRight: '2px'}} />
                Development
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
                  padding: '2px',
                  display: "flex",
                  fontSize: '14px',
                  margin: '7px',
                  whiteSpace: { xs: 'normal', sm: 'nowrap' },
                  fontWeight: 'bold',
                }}
              >
                <CancelOutlinedIcon sx={{marginTop: '2px', width: '20px', height: '20px', color: 'red', marginRight: '2px'}} />
                Consulting
              </MDTypography>
            </MDBox>

          </MDBox>

          <MDBox sx={{ marginTop: '20px' }}>
            <MDTypography variant="h5" component="div">Job Description</MDTypography>
            <TextField
              id="outlined-basic"
              label=""
              variant="outlined"
              multiline
              rows={6}
              sx={{
                padding: { md: '0px', xs: '10px' },
                width: '100%',
                boxSizing: 'border-box',
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MDBox sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
                      <FormatBoldOutlinedIcon sx={{ marginTop: '100px', marginRight: '10px', width: '20px', height: '20px', color:'#1F4255' }} />
                      <FormatItalicOutlinedIcon sx={{ marginTop: '100px', marginRight: '10px', width: '20px', height: '20px', color:'#1F4255' }} />
                      <FormatUnderlinedOutlinedIcon sx={{ marginTop: '100px', marginRight: '10px', width: '20px', height: '20px', color:'#1F4255' }} />
                      <StrikethroughSOutlinedIcon sx={{ marginTop: '100px', marginRight: '10px', width: '30px', height: '30px', color:'#1F4255', borderRight: "1px solid #ccc", paddingRight: '10px' }} />
                      <InsertLinkOutlinedIcon sx={{ marginTop: '100px', marginRight: '10px', width: '20px', height: '20px', color:'#1F4255' }} />
                      <ListOutlinedIcon sx={{ marginTop: '100px', marginRight: '10px', width: '30px', height: '30px', color: '#1F4255', borderLeft: '1px solid #ccc', paddingLeft: '10px' }} />
                      <FormatListNumberedOutlinedIcon sx={{ marginTop: '100px', width: '20px', height: '20px', marginRight: '10px', color:'#1F4255' }} />
                    </MDBox>
                  </InputAdornment>
                ),
              }}
            />


          </MDBox>

          <MDBox sx={{ with: "120px" , height: "100px" , marginTop: '20px' }}>
            <MDTypography variant="h5" component="div">Certifications Required</MDTypography>
            <FormControl fullWidth sx={{ width: '100%'}}>
              <InputLabel id="demo-simple-select-label">Select An Option</InputLabel>
              <Select
                sx={{
                  padding: { md: '0px', xs: '10px' },
                  width: '100%',
                  boxSizing: 'border-box',
                  height:'45px'
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </MDBox>

          <MDBox sx={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', width: '100%' , gap: '10px' }}>
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
                  padding: '2px',
                  display: "flex",
                  fontSize: '14px',
                  margin: '7px',
                  whiteSpace: { xs: 'normal', sm: 'nowrap' },
                  fontWeight: 'bold',
                }}
              >
                <CancelOutlinedIcon sx={{margin: '2px', width: '20px', height: '20px', color: 'red', marginRight: '2px'}} />
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
                  padding: '2px',
                  display: "flex",
                  fontSize: '14px',
                  margin: '7px',
                  whiteSpace: { xs: 'normal', sm: 'nowrap' },
                  fontWeight: 'bold',
                }}
              >
                <CancelOutlinedIcon sx={{marginTop: '2px', width: '20px', height: '20px', color: 'red', marginRight: '2px'}} />
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
                  padding: '2px',
                  display: "flex",
                  fontSize: '14px',
                  margin: '7px',
                  whiteSpace: { xs: 'normal', sm: 'nowrap' },
                  fontWeight: 'bold',
                }}
              >
                <CancelOutlinedIcon sx={{marginTop: '2px', width: '20px', height: '20px', color: 'red', marginRight: '2px'}} />
                Building Safety Inspector Certification
              </MDTypography>
            </MDBox>

          </MDBox>

        </MDBox>

      </MDBox>
    </MDBox>
  );
}


export default function PostJobTwo() {

  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };


  return (
    <MDBox display="flex" flex={1} style={{ border: "none", backgroundColor: "white"}}>
      <MDBox sx={{  width: "100%", height: "100%", display: "flex" }}>
        <MDBox sx={{ with:'100%'}}>
          <MDBox sx={{ with: "100%" }}>
            <MDTypography variant="h5" component="div">How you Pay?</MDTypography>
            <FormControl fullWidth sx={{ width: '100%'}}>
              <InputLabel id="demo-simple-select-label" sx={{padding:"1px"}}>Age</InputLabel>
              <Select
                sx={{
                  padding: { md: '0px', xs: '10px' },
                  width: '100%',
                  boxSizing: 'border-box',
                  height:'45px'
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value={10}>Tenn</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>

          </MDBox>

          <MDBox style={{ width: '100%', marginTop: '20px' }}>
            <MDTypography variant="h5" component="div">Daily Rate</MDTypography>
            <TextField
              id="outlined-basic"
              label="From 2000 to 3000"
              variant="outlined"
              sx={{
                padding: '0px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </MDBox>

          <MDBox style={{ width: '100%' , marginTop: '20px' }}>
            <MDTypography variant="h5" component="div">Time Line</MDTypography>
            <TextField id="outlined-basic" label="From 2000 to 3000" variant="outlined" sx={{ padding:'0px', width: '100%', boxSizing: 'border-box', height:'45px' }}/>
          </MDBox>

          <MDBox style={{ width: '100%' , marginTop: '20px' }}>
            <MDTypography variant="h5" component="div">Expected start date</MDTypography>
            <TextField
              id="outlined-basic"
              variant="outlined"
              sx={{ width: '100%' }}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}

            />
          </MDBox>


          <MDBox style={{ width: '100%' , marginTop: '20px' }}>
            <MDTypography variant="h5" component="div">Estimated Completion Date</MDTypography>
            <TextField
              id="outlined-basic"
              variant="outlined"
              sx={{ width: '100%' }}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </MDBox>

          <MDBox style={{  width: '100%' , marginTop: '20px' }}>
            <MDButton
              variant="outlined"
              sx={{
                borderColor: '#006E90',
                color: '#006E90',
                fontSize: '15px',
                width: '100%',
              }}

            >
              Add Document
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
              }}
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
              }}

            >
              Publish
            </MDButton>

          </MDBox>



        </MDBox>


      </MDBox>
    </MDBox>
  );
}

