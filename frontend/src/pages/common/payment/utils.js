import moment from 'moment';
import MDBox from "@mui/material/Box";
import MDButton from "../../../components/MDButton";
import React from "react";
import { useNavigate } from "react-router-dom";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import {capitalize, money_fmt} from "../../../services/helpers"


export const dataTableModel = {
  columns: [
    { Header: "ID", accessor: 'id', width: 30 },
    { Header: "Description", accessor: 'description', width: 200 },
    { Header: "Job", accessor: 'job', width: 120 },
    { Header: "Created", accessor: "created",width: 80},
    { Header: "Amount", accessor: "amount", width: 80 },
    { Header: "Status", accessor: "status", width: 80 },
    { Header: "Type", accessor: "transaction_type", width: 80 },
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
  item.created = moment(item.created).format('MM/DD/YYYY hh:mm A' )
  item.amount = money_fmt(item.amount)
  return item;
};
