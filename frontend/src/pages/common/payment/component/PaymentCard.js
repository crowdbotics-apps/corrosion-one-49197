import Card from "@mui/material/Card"
import Grid from "@mui/material/Grid"
import MDBox from "../../../../components/MDBox"
import MDTypography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import AppRegistrationOutlinedIcon from "@mui/icons-material/AppRegistrationOutlined"
import MDAvatar from "../../../../components/MDAvatar"
import React, { useState } from "react"
import Switch from "@mui/material/Switch"
import { Menu, MenuItem } from "@mui/material"
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined"
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"
import MoreVertIcon from "@mui/icons-material/MoreVert"


const PaymentCard = ({ nameOnCard, expireDate, cardNumber, cardId, isActive, loading, onToggle, cardBrand }) => {

  console.log(cardBrand)
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleMenuClose();
  };
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const getLogo = ({card}) => {

    if (cardBrand === 'visa') {

      return "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png";
    } else if (cardBrand === 'mastercard') {

      return "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg";
    } else if (cardBrand === 'discover') {

      return "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Discover.png/640px-Discover.png";
    } else if (cardBrand === 'amex') {

      return "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/640px-American_Express_logo_%282018%29.svg.png";
    }else if (cardBrand === 'jcb') {
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/JCB_logo.svg/640px-JCB_logo.svg.png";
    }
  };

  return (
    <Card sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderRadius: '12px'}}>
      <MDBox display="flex" alignItems="center" justifyContent="space-between" marginTop={2} mb={5} width={'100%'}>
        <MDBox display="flex">
          <MDAvatar src={getLogo(cardBrand)}  variant={"square"} style={{ fontSize: "50px" }} />
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
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteOutlinedIcon sx={{ marginRight: '8px', fontSize: '25px !important' , color: 'error.main' }} />
            Delete
          </MenuItem>
        </Menu>
      </MDBox>
    </Card>
  );
};

export default PaymentCard;
