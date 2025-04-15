import Card from "@mui/material/Card"
import Grid from "@mui/material/Grid"
import MDBox from "../../../../components/MDBox"
import MDTypography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import AppRegistrationOutlinedIcon from "@mui/icons-material/AppRegistrationOutlined"
import MDAvatar from "../../../../components/MDAvatar"
import React from "react"
import Switch from "@mui/material/Switch"

const PaymentCard = ({ nameOnCard, expireDate, cardNumber, cardId, isActive, loading, onToggle }) => {

  return (
    <Card sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderRadius: '12px'}}>
      <MDBox display="flex" alignItems="center" justifyContent="space-between" marginTop={2} mb={5} width={'100%'}>
        <MDBox display="flex">
          <MDAvatar src={"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png"} variant={"square"} style={{ fontSize: "50px" }} />
          <MDBox marginLeft={2}>
            <MDTypography sx={{ fontSize: '12px', color: '#767F8C' }}>Name on Card</MDTypography>
            <MDTypography sx={{ fontSize: '16px' }}>{nameOnCard}</MDTypography>
          </MDBox>
        </MDBox>
        <MDBox>
            <MDTypography sx={{ fontSize: '12px', color: '#767F8C' }}>Expire Date</MDTypography>
            <MDTypography sx={{ fontSize: '16px' }}>{expireDate}</MDTypography>
        </MDBox>
      </MDBox>

      <MDBox borderTop={"2px solid #E4E5E8"} width={'100%'} display={'flex'} alignItems="center" justifyContent="space-between">
        <MDTypography sx={{ fontSize: '24px', marginTop: '10px' }}>
          **** **** **** {cardNumber}
        </MDTypography>
        <Switch
          checked={isActive}
          disabled={loading}
          onChange={() => onToggle(cardId)}
          color="primary"
          inputProps={{ 'aria-label': 'toggle card visibility' }}
        />
      </MDBox>
    </Card>
  );
};

export default PaymentCard;
