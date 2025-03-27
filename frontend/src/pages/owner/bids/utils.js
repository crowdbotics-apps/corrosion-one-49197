import moment from "moment";
import MDBox from "@mui/material/Box";
import MDButton from "../../../components/MDButton";
import { capitalize } from "../../../services/helpers"; // Asegúrate de que este helper esté disponible

export const dataTableModel = {
  columns: [
    { Header: " ", accessor: "profile_picture", disableOrdering: true, width: 60 },
    { Header: "Bidder Name", accessor: 'inspector', disableOrdering: true, width: 150 },
    { Header: "Job", accessor: "job", width: 150 },
    { Header: "Application Date", accessor: "created", width: 150 },
    { Header: "Status", accessor: "status", width: 150 },
    { Header: " ", accessor: "actions", disableOrdering: true, width: 100 },
  ],
  rows: [],
};

const renderActions = (item, setSelectedItem, setShowModal) => {
  return (
    <MDBox display={"flex"} alignItems="center" flexDirection={"row"} gap={2}>
      <MDButton color={'secondary'} variant={'outlined'} size={'small'}>View Details</MDButton>
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

export const renderTableRow = (item, setSelectedItem, setShowModal) => {
  item.created = moment(item.created).format('MM/DD/YYYY');
  item.status = capitalize(item.status);
  item.actions = renderActions(item, setSelectedItem, setShowModal);
  return item;
};
