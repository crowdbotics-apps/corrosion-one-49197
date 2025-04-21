import moment from "moment";
import { capitalize, useApi } from "../../../services/helpers"
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import React, { useState } from "react"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom"
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined"
import {ROLES, ROUTES} from "../../../services/constants";


export const dataTableModel = {
  columns: [
    { Header: "Title", accessor: "title",width: 120},
    { Header: "Description", accessor: "description",width: 400},
    { Header: "Date", accessor: "timestamp",width: 150 },
    { Header: "Is Read", accessor: "is_read",width: 150 },
    { Header: "Actions",accessor: "actions", disableOrdering: true, width: 180 },
  ],
  rows: [],
};



const renderActions = (item, markAsRead) => {

  return (
    <MDBox>
      {item.is_read_raw === false && <MDButton onClick={() => markAsRead(item.id)}  color={'secondary'} variant={'outlined'} size={'small'} sx={{ml: 1, mr: 1}}>Mark as read</MDButton>}
    </MDBox>
  )
}



export const renderTableRow = (item, markAsRead) => {
  item.timestamp = moment(item.timestamp).format('MM/DD/YYYY hh:mm A' )
  item.is_read_raw = item.is_read
  item.is_read = item.is_read ? <CheckCircleOutlineIcon color={'primary'} sx={{  width: 20, height: 20 }} /> :''
  item.actions = renderActions(item, markAsRead)
  return item
}


