import React, { useState } from "react";
import Card from "@mui/material/Card";
import MDBox from "../../../../components/MDBox";
import MDTypography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { PaymentIcon } from "react-svg-credit-card-payment-icons";
import MDButton from "../../../../components/MDButton";

const PaymentCard = ({
                       nameOnCard,
                       expireDate,
                       cardNumber,
                       cardId,
                       isActive,
                       loading,
                       onToggle,
                       cardBrand,
                       deleteCard
                     }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleMenuClose();
    setOpenDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteCard(cardId);
    setOpenDeleteModal(false);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  return (
    <Card
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        borderRadius: "12px",
      }}
    >
      <MDBox
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginTop={2}
        mb={5}
        width={"100%"}
      >
        <MDBox display="flex">
          <PaymentIcon type={cardBrand} format="flatRounded" width={50} />
          <MDBox marginLeft={2}>
            <MDTypography sx={{ fontSize: "12px", color: "#767F8C" }}>
              Name on Card
            </MDTypography>
            <MDTypography sx={{ fontSize: "16px" }}>
              {nameOnCard}
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox>
          <MDTypography sx={{ fontSize: "12px", color: "#767F8C" }}>
            Expire Date
          </MDTypography>
          <MDTypography sx={{ fontSize: "16px" }}>{expireDate}</MDTypography>
        </MDBox>
      </MDBox>

      <MDBox
        borderTop={"2px solid #E4E5E8"}
        width={"100%"}
        display={"flex"}
        alignItems="center"
        justifyContent="space-between"
      >
        <MDTypography sx={{ fontSize: "24px", marginTop: "10px" }}>
          **** **** **** {cardNumber}
        </MDTypography>
        <MDBox>
          <Switch
            checked={isActive}
            disabled={loading}
            onChange={() => onToggle(cardId)}
            color="primary"
            inputProps={{ "aria-label": "toggle card visibility" }}
          />
          <IconButton onClick={handleDelete} size="medium" color="error">
            <DeleteOutlinedIcon />
          </IconButton>
        </MDBox>
      </MDBox>
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>Delete Card</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this card?</p>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <MDButton
            variant="outlined"
            onClick={handleCloseDeleteModal}
            color="secondary"
          >
            Cancel
          </MDButton>
          <MDButton onClick={confirmDelete} color="error">
            Delete
          </MDButton>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PaymentCard;
