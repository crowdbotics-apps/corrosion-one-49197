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
    { Header: "Job Title", accessor: "title",width: 120},
    { Header: "Job Owner", accessor: "owner",width: 120},
    { Header: "Bids", accessor: "bids" ,width: 80 },
    { Header: "Views", accessor: "views", width: 80 },
    { Header: "Date Posted", accessor: "created", width: 150 },
    { Header: "Status", accessor: "status",width: 150 },
    { Header: " ",accessor: "actions", disableOrdering: true, width: 280 },
  ],
  rows: [],
};

export const dataTableModelOwner = {
  columns: [
    { Header: "Job Title", accessor: "title",width: 120},
    { Header: "Job Inspector", accessor: "inspector",width: 120},
    { Header: "Bids", accessor: "bids" ,width: 80 },
    { Header: "Views", accessor: "views", width: 80 },
    { Header: "Date Posted", accessor: "created", width: 150 },
    { Header: "Status", accessor: "status",width: 150 },
    { Header: " ",accessor: "actions", disableOrdering: true, width: 300 },
  ],
  rows: [],
};




const renderActions = (item, setSelectedItem, setShowModal, navigate, user_type) => {

  return (
    <MDBox>
      {user_type === ROLES.OWNER && item.raw_status !== 'draft' &&  <MDButton color={'primary'} variant={'outlined'} size={'small'} sx={{ml: 1}} onClick={() => navigate(ROUTES.JOB_BIDS(item.id))}>Bids</MDButton>}
      <MDButton onClick={() => navigate(ROUTES.J0B_DETAIL(item.id))}  color={'secondary'} variant={'outlined'} size={'small'} sx={{ml: 1, mr: 1}}>Detail</MDButton>
      {(item.raw_status === 'pending' || item.raw_status === 'draft') && user_type === ROLES.OWNER && <MDButton color={'secondary'} variant={'outlined'} size={'small'} sx={{ mr: 1}}  onClick={() => navigate(ROUTES.EDIT_JOB(item.id))}>Edit</MDButton>}
      {(item.raw_status === 'pending' || item.raw_status === 'draft') && user_type === ROLES.OWNER &&  <MDButton
        color={'error'}
        variant={'outlined'}
        size={'small'}
        onClick={() => {
          setSelectedItem(item)
          setShowModal(true)
        }}
      >
        {item.bids === 0 ? 'Delete' : 'Cancel'}
        </MDButton>}
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


