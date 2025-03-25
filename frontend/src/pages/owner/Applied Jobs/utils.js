import moment from 'moment';
import MDBox from "@mui/material/Box";
import MDButton from "../../../components/MDButton";
import React from "react";
import { useNavigate } from "react-router-dom";

const statusMap = {
  Accepted: { color: '#D0FFE480', label: 'Accepted', labelColor: '#00AD42' },
  Selected: { color: '#FFD7D080', label: 'Not Selected', labelColor: '#FF5F57' },
  Pending: { color: '#FFBD2E33', label: 'Pending', labelColor: '#FFBD2E' },
};

const jobStatusMap = {
  Active: { color: '#D0FFE480', label: 'Active', labelColor: '#00AD42' },
  'Not Available': { color: '#FFD7D080', label: 'Not Available', labelColor: '#FF5F57' },
  Closed: { color: '#FFD7D080', label: 'Closed', labelColor: '#FF5F57' },
};

export const dataTableModel = {
  columns: [
    { Header: " ", accessor: "profile_picture", disableOrdering: true, width: 60 },
    { Header: "Jobs", accessor: 'name', disableOrdering: true, width: 300 },
    { Header: "Aplication Date", accessor: "applicationDate", width: 150 },
    { Header: "Aplication Status", accessor: "status", width: 170 },
    { Header: "Jobs Status", accessor: "jobStatus", width: 120 },
    { Header: " ", accessor: "actions_edit", disableOrdering: true, width: 7 },
    { Header: " ", accessor: "actions", disableOrdering: true, width: 200 },
  ],
  rows: [],
};

const ActionButtons = ({ item, setSelectedItem, setShowModal }) => {
  const navigate = useNavigate();

  const handleRejectDetails = () => {
    const data = { someKey: true };
    navigate("/find-jobs-details", { state: data });
  };

  return (
    <MDBox display={"flex"} alignItems="center" flexDirection={"row"} gap={2}>
      <MDButton
        onClick={handleRejectDetails}
        color={'secondary'}
        variant={'outlined'}
        size={'small'}
      >
        View Details
      </MDButton>
      <MDButton
        color={'error'}
        variant={'outlined'}
        size={'small'}
        onClick={() => {
          setSelectedItem(item);
          setShowModal(true);
        }}
      >
        Rejected
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

  if (jobStatusMap[item.jobStatus]) {
    item.jobStatus = jobStatusMap[item.jobStatus];
  }

  item.status = renderStatusLabel(item.status);
  item.jobStatus = renderStatusLabel(item.jobStatus);

  item.actions = <ActionButtons item={item} setSelectedItem={setSelectedItem} setShowModal={setShowModal} />;

  return item;
};
