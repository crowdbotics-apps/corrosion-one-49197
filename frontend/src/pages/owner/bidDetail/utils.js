import MDBox from "@mui/material/Box";
import MDButton from "@mui/material/Button";
import {checkUrl} from "../../../services/helpers";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MDTypography from "@mui/material/Typography";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import React from "react";


export const CredentialDocumentList = ({documents}) => {
  return (
    <MDBox sx={{display: 'flex', flexWrap: 'wrap', width: '100%', gap: 2}} mt={2}>
      {Array.isArray(documents) && documents.length > 0 ? (
        documents.map((doc) => (
          <MDBox key={'key--C-' + doc.id} display={'flex'} flexDirection={'column'} width={'100%'}>
            <MDTypography sx={{fontSize: "18px"}} mb={1}>{doc.name}</MDTypography>
            <MDButton
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
                <DescriptionOutlinedIcon sx={{color: "#006E90", width: "30px", height: "30px", marginRight: '8px'}}/>
                <MDBox>
                  <MDTypography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '14px',
                      maxWidth: 250,          // or a width value that fits your design
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }} textAlign={'left'}>
                    {doc?.document_name}
                  </MDTypography>
                  <MDTypography
                    sx={{color: 'gray', fontSize: '14px'}}
                    textAlign={'left'}
                  >
                    {doc.size} MB
                  </MDTypography>
                </MDBox>
              </MDBox>

              <FileDownloadOutlinedIcon sx={{color: "#006E90", width: "30px", height: "30px"}}/>
            </MDButton>
          </MDBox>
        ))
      ) : (
        <MDTypography>No documents available</MDTypography>
      )}
    </MDBox>
  );
};

