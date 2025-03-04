
import Grid from "@mui/material/Grid"
import DataTable from "../../../components/AdminLayout/Messages/dataTable"
import { useState } from "react"
import { chatDataModel } from "../../../components/AdminLayout/Messages/utils"
import AdminLayout from "../../../components/AdminLayout"


function HomeOwnerMessages() {
  const [datatable, setDatatable] = useState({...chatDataModel});
  return (
    <AdminLayout
      title={'Messages'}
      showCard
    >
      <DataTable
        table={datatable}
      />

    </AdminLayout>
  );
}

export default HomeOwnerMessages;
