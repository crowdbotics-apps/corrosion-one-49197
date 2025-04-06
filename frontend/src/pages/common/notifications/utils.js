import moment from "moment";
import { capitalize, useApi } from "../../../services/helpers"
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined"
import {ROLES, ROUTES} from "../../../services/constants";


export const dataTableModel = {
  columns: [
    { Header: "Title", accessor: "title",width: 120},
    { Header: "Description", accessor: "description",width: 400},
    { Header: "Date", accessor: "timestamp",width: 150 },
    { Header: "Read", accessor: "is_read",width: 150 },
    { Header: "Actions",accessor: "actions", disableOrdering: true, width: 280 },
  ],
  rows: [],
};



const renderActions = (item, setSelectedItem, setShowModal, navigate, user_type) => {

  return (
    <MDBox>
      <MDButton onClick={() => navigate(ROUTES.J0B_DETAIL(item.id))}  color={'secondary'} variant={'outlined'} size={'small'} sx={{ml: 1, mr: 1}}>Detail</MDButton>
    </MDBox>
  )
}



export const renderTableRow = (item, setSelectedItem, setShowModal, navigate, user_type) => {
  item.created = moment(item.created).format('MM/DD/YYYY')
  item.raw_status = item.status
  item.status = capitalize(item.status)
  item.actions = renderActions(item, setSelectedItem, setShowModal, navigate, user_type)
  return item
}


