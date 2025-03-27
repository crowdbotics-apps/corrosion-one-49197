import Card from "@mui/material/Card"
import Grid from "@mui/material/Grid"
import MDBox from "../../../../components/MDBox"
import MDTypography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import AppRegistrationOutlinedIcon from "@mui/icons-material/AppRegistrationOutlined"
import MDAvatar from "../../../../components/MDAvatar"
import React from "react"
import Switch from "@mui/material/Switch"

const PaymentCard = ({ nameOnCard, expireDate, cardNumber, cardId, isActive, onToggle }) => {

  const maskCard = (number) => {
    const first4 = number.slice(0, 4);
    const masked = number.slice(4).replace(/\d/g, '*');

    const blocked = first4 + masked.replace(/(.{4})(?=.)/g, '$1 ');

    return blocked;
  };

  return (
    <Card sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderRadius: '12px', width: '30%' }}>
      <Grid container display="flex" alignItems="center" justifyContent="space-between">
        <MDBox>
          <MDTypography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
            Payment Card
          </MDTypography>
        </MDBox>
        <MDBox>
          <MDTypography sx={{ fontSize: '14px', color: '#767F8C' }}>
            <IconButton>
              <AppRegistrationOutlinedIcon />
            </IconButton>
            Edit Card
          </MDTypography>
        </MDBox>
      </Grid>
      <Grid container display="flex" alignItems="center" justifyContent="space-between" marginTop={2} marginBottom={2}>
        <MDBox display="flex">
          <MDAvatar src={"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png"} variant={"square"} style={{ fontSize: "50px" }} />
          <MDBox marginLeft={2}>
            <MDTypography sx={{ fontSize: '12px', color: '#767F8C' }}>Name on Card</MDTypography>
            <MDTypography sx={{ fontSize: '16px' }}>{nameOnCard}</MDTypography>
          </MDBox>
        </MDBox>
        <MDBox>
          <MDBox marginRight={10}>
            <MDTypography sx={{ fontSize: '12px', color: '#767F8C' }}>Expire Date</MDTypography>
            <MDTypography sx={{ fontSize: '16px' }}>{expireDate}</MDTypography>
          </MDBox>
        </MDBox>
      </Grid>

      <Grid borderTop={"2px solid #E4E5E8"} width={'100%'} display={'flex'} alignItems="center" justifyContent="space-between">
        <MDTypography sx={{ fontSize: '24px', marginTop: '10px' }}>
          {maskCard(cardNumber)}
        </MDTypography>
        <Switch
          checked={isActive}
          onChange={() => onToggle(cardId)}
          color="primary"
          inputProps={{ 'aria-label': 'toggle card visibility' }}
        />
      </Grid>
    </Card>
  );
};

export default PaymentCard;
