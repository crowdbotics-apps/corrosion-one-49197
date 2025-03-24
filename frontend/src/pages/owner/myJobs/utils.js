import moment from "moment";
import {capitalize} from "../../../services/helpers";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";


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


const renderActions = (item, setSelectedItem, setShowModal) => {

  return (
    <MDBox>
      <MDButton color={'primary'} variant={'outlined'} size={'small'}>Bids</MDButton>
      {item.raw_status === 'pending' &&<MDButton color={'secondary'} variant={'outlined'} size={'small'} sx={{ml: 1, mr: 1}}>Edit</MDButton>}
      {item.raw_status === 'pending' && <MDButton
        color={'error'}
        variant={'outlined'}
        size={'small'}
        onClick={() => {
          setSelectedItem(item)
          setShowModal(true)
        }}
      >
        Cancel
      </MDButton>}
    </MDBox>
  )
}


export const renderTableRow = (item, setSelectedItem, setShowModal) => {
  item.created = moment(item.created).format('MM/DD/YYYY')
  item.raw_status = item.status
  item.status = capitalize(item.status)
  item.actions = (renderActions(item, setSelectedItem, setShowModal))
  return item
}


