// utils.js
import MDBox from "@mui/material/Box";
import MDButton from "@mui/material/Button";
import MDTypography from "@mui/material/Typography";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import React from "react"
import {checkUrl} from "../../../../services/helpers";

export const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : 'N/A';
};

export const CustomTypography = ({ text }) => {
  return (
    <MDTypography sx={{ color: '#006E90', fontSize: '20px', fontWeight: 'bold', marginTop: '20px' }}>
      {text}
    </MDTypography>
  );
};


export const DocumentList = ({ documents }) => {
  return (
    <MDBox sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: 2 }} mt={2}>
      {Array.isArray(documents) && documents.length > 0 ? (
        documents.map((doc) => (
          <MDButton
            key={'key-' + doc.id}
            color={'primary'}
            sx={{
              width: '100%',
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
            onClick={() => window.open(checkUrl(doc.document), '_blank')}
          >
            <MDBox display={'flex'} alignItems={'center'} justifyContent={'flex-start'}>
              <DescriptionOutlinedIcon sx={{ color: "#006E90", width: "30px", height: "30px", marginRight: '8px' }} />
              <MDBox>
                <MDTypography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '14px',
                    maxWidth: 250,          // or a width value that fits your design
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }} textAlign={'left'} >
                  {doc.name || doc?.document_name}
                </MDTypography>
                <MDTypography
                  sx={{ color: 'gray', fontSize: '14px'}}
                  textAlign={'left'}
                >
                  {doc.size} MB
                </MDTypography>
              </MDBox>
            </MDBox>

            <FileDownloadOutlinedIcon sx={{ color: "#006E90", width: "30px", height: "30px" }} />
          </MDButton>
        ))
      ) : (
        <MDTypography>No documents available</MDTypography>
      )}
    </MDBox>
  );
};




export const CredentialsList = ({ documents }) => {
  return (
    <MDBox sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: 2 }} mt={2}>
      {documents.map((cert) => (
        <MDBox
          key={cert.id}
          sx={{
            backgroundColor: 'white',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            borderRadius: 5,
            width: 'fit-content',
          }}
          mb={1}
        >
          <MDTypography
            sx={{
              fontSize: '14px',
              margin: '7px',
              whiteSpace: { xs: 'normal', sm: 'nowrap' },
              fontWeight: 'bold',
            }}
          >
            {cert.name}
          </MDTypography>
        </MDBox>
      ))}

    </MDBox>
  )
}
