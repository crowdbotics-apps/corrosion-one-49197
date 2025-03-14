
// ConfirmationModal.js
import React from 'react';
import MDBox from '../../MDBox';
import MDButton from '../../MDButton';
import MDAvatar from '../../MDAvatar';
import MDTypography from '../../MDTypography';

const ConfirmationModal = ({ open, onClose, onConfirm, bidderName }) => {
  if (!open) return null;

  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 999 }}>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <MDTypography variant="h6">Are you sure you want to reject {bidderName}?</MDTypography>
        <MDBox sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '16px' }}>
          <MDButton variant="outlined" color="secondary" onClick={onClose}>Cancel</MDButton>
          <MDButton variant="outlined" color="error" onClick={onConfirm}>Confirm</MDButton>
        </MDBox>
      </div>
    </div>
  );
};

export default ConfirmationModal;
