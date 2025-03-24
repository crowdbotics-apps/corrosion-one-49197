import moment from "moment";
import {capitalize} from "../../../services/helpers";


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

export const renderTableRow = (item) => {
  item.created = moment(item.created).format('MM/DD/YYYY')
  item.status = capitalize(item.status)
  // item.actions = (popOver(item, setAnchorEl, setOpenPopover, setSelectedItem))
  return item
}


