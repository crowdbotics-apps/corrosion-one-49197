import moment from 'moment';
import MDBox from "@mui/material/Box";
import MDButton from "../../../components/MDButton";
import React from "react";
import { useNavigate } from "react-router-dom";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined"
import { ROUTES } from "../../../services/constants"

const statusMap = {
  Active: { color: '#D0FFE480', label: 'Active', labelColor: '#00AD42' },
  Reject: { color: '#FFD7D080', label: 'Reject',  labelColor: '#FF5F57'},
};

export const dataTableModel = {
  columns: [
    { Header: " ", accessor: "profile_picture", disableOrdering: true, width: 60 },
    { Header: "Jobs", accessor: 'name', disableOrdering: true, width: 250 },
    { Header: "Aplication Date", accessor: "applicationDate",width: 200},
    { Header: "Status", accessor: "status", width: 200 },
    { Header: " ",accessor: "actions", disableOrdering: true, width: 50 },
  ],
  rows: [],
};

const ActionButtons = ({ item, setSelectedItem, setShowModal }) => {
  const navigate = useNavigate();

  const handleRejectDetails = () => {
    const data = { someKey: true };
    navigate(ROUTES.J0B_DETAILS, { state: data });
  };

  return (
    <MDBox display={"flex"} alignItems="center" flexDirection={"row"} gap={2}>
      <MDButton variant="text" color={'secondary'}>
        <BookmarkOutlinedIcon />
      </MDButton>
      <MDButton onClick={handleRejectDetails} color={'secondary'} variant={'outlined'} size={'small'}>View Details
      </MDButton>
    </MDBox>
  );
};

const renderStatusLabel = (status) => (
  <MDBox
    style={{
      font: 'Poppins',
      display: 'inline-block',
      borderRadius: '20px',
      backgroundColor: status.color,
      color: status.labelColor,
      textAlign: 'center',
      lineHeight: '40px',
      fontWeight: 'bold',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
      fontSize: '16px',
      whiteSpace: 'nowrap',
      width: '150px',
      height: '40px',
    }}
  >
    {status.label}
  </MDBox>
);

export const renderTableRow = (item, setSelectedItem, setShowModal) => {
  item.applicationDate = moment(item.applicationDate).format('MM/DD/YYYY');
  if (statusMap[item.status]) {
    item.status = statusMap[item.status];
  }
  item.status = renderStatusLabel(item.status);

  item.actions = <ActionButtons item={item} setSelectedItem={setSelectedItem} setShowModal={setShowModal} />;

  return item;
};
