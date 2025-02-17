import React from 'react';
import { Box, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


export default function AddDocumentBox({ onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: 300,
        height: '100%',
        minHeight: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        border: '2px dashed #ccc',
        borderRadius: 2,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#f9f9f9'
        }
      }}
    >
      <AddCircleOutlineIcon sx={{ mr: 1, color: '#4f8fc5' }} />
      <Typography sx={{ whiteSpace: 'nowrap', fontSize: 13 }}>
        Add Supporting Document
      </Typography>
    </Box>
  );
}
