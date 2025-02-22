import React from 'react';
import {Modal} from "@mui/material";
import MDButton from "../MDButton";
import {ModalDeleteDialog, ModalDeleteProjectBox, ModalDeleteTitle} from "./styles";
import MDTypography from "../MDTypography";
import MDBox from "../MDBox";
import pxToRem from "../../assets/theme/functions/pxToRem";


const ConfirmDialogModal = (
  {
    title,
    description,
    cancelText,
    confirmText,
    open,
    handleClose,
    handleConfirm,
    loading
  }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <MDBox sx={ModalDeleteProjectBox}>
        <MDTypography sx={ModalDeleteTitle}>{title}</MDTypography>
        <MDTypography sx={ModalDeleteDialog}>{description}</MDTypography>
        <MDBox display='flex' flexDirection='column' gap={pxToRem(20)} mx={pxToRem(98)} mt={pxToRem(41)}>
          <MDButton variant='contained' loading={loading} disabled={loading} color='error' onClick={handleConfirm}>
            {confirmText}
          </MDButton>
          <MDButton color='secondary' onClick={handleClose}>
            {cancelText}
          </MDButton>
        </MDBox>
      </MDBox>
    </Modal>
  )
};

export default ConfirmDialogModal;
