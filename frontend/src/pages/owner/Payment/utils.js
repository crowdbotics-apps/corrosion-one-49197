import moment from 'moment';
import MDBox from "@mui/material/Box";
import MDButton from "../../../components/MDButton";
import React from "react";
import { useNavigate } from "react-router-dom";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { capitalize } from "../../../services/helpers"


export const dataTableModel = {
  columns: [
    { Header: "#ID", accessor: 'name', disableOrdering: true, width: 30 },
    { Header: "DATE", accessor: "applicationDate",disableOrdering: true,width: 80},
    { Header: "AMOUNT", accessor: "status", disableOrdering: true,width: 80 },
    { Header: " ",accessor: "actions", disableOrdering: true, width: 50 },
  ],
  rows: [],
};



const renderActions = (item, setSelectedItem, setShowModal) => {
  return (
    <MDBox display={"flex"} alignItems="center" flexDirection={"row"} gap={2}>
      <MDButton variant="text" >
        <FileDownloadOutlinedIcon  sx={{color:'#9199A3', width:'30px', height:'30px'}}/>
      </MDButton>
    </MDBox>
  );
};


export const renderTableRow = (item, setSelectedItem, setShowModal) => {
  item.status =capitalize(item.status);
  item.actions = renderActions(item, setSelectedItem, setShowModal);
  return item;
};
