import moment from "moment";
import { capitalize, useApi } from "../../../services/helpers"
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined"
import { ROUTES } from "../../../services/constants"


export const dataTableModel = {
  columns: [
    { Header: "Job Title", accessor: "title",width: 150},
    { Header: "Bids", accessor: "bids" ,width: 100 },
    { Header: "Views", accessor: "views", width: 100 },
    { Header: "Date Posted", accessor: "created", width: 150 },
    { Header: "Status", accessor: "status",width: 150 },
    { Header: " ",accessor: "actions", disableOrdering: true, width: 200 },
  ],
  rows: [],
};




const ActionButtons = ({ item, setSelectedItem, setShowModal }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const api = useApi()

  const handleRejectDetails = () => {
    setLoading(false);

    const jobId = item.id;

    api.getJob(jobId).handle({
      onSuccess: (result) => {
        const jobDetails = result.data;

        navigate(ROUTES.J0B_DETAILS, {
          state: { jobDetails, isJobActive: false }
        });

      },
      errorMessage: 'Error getting job details',
      onFinally: () => setLoading(false)

    });
  };



  return (
    <MDBox>
      <MDButton color={'primary'} variant={'outlined'} size={'small'}>Bids</MDButton>
      {item.raw_status === 'pending' &&<MDButton onClick={handleRejectDetails} color={'secondary'} variant={'outlined'} size={'small'} sx={{ml: 1, mr: 1}}>Edit</MDButton>}
      {item.raw_status === 'pending' && <MDButton
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



export const renderTableRow = (item, setSelectedItem, setShowModal) => {
  item.created = moment(item.created).format('MM/DD/YYYY')
  item.raw_status = item.status
  item.status =capitalize(item.status)
  item.actions = <ActionButtons item={item} setSelectedItem={setSelectedItem} setShowModal={setShowModal} />;
  return item
}


