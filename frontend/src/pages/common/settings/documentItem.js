import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {InsertDriveFileOutlined} from "@mui/icons-material";
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

export default function DocumentItem({ doc, onOpenDownload, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDownload = () => {
    onOpenDownload?.(doc);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(doc);
    handleMenuClose();
  };

  return (
    <Card
      variant="outlined"
      sx={{
        width: 300,           // approximate width from your screenshot
        borderRadius: 2       // slightly rounded corners
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          backgroundColor: "#F1F2F480",
          '&:last-child': { pb: 2 },
          '&:hover': {
            backgroundColor: '#f5f5f5'
          }
        }}
      >
        {/* File Icon */}
        <InsertDriveFileOutlined sx={{ fontSize: 36, color: '#4f8fc5', mr: 2 }} />

        {/* Document Info */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Typography variant="subtitle2" noWrap>
            {doc.name || doc?.document_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {doc.size} MB
          </Typography>
        </Box>

        {/* Three-Dot Menu */}
        <IconButton onClick={handleMenuOpen} size="small">
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <MenuItem onClick={handleOpenDownload} style={{ color: '#007BFF' }}>
            <LaunchOutlinedIcon sx={{ marginRight: '8px', fontSize: '20px !important' , color: '#007BFF' }} />
            Open / Download
          </MenuItem>


          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteOutlinedIcon sx={{ marginRight: '8px', fontSize: '25px !important' , color: 'error.main' }} />
            Delete
          </MenuItem>
        </Menu>
      </Box>
    </Card>
  );
}
