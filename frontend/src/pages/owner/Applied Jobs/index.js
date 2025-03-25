
import AdminLayout from "../../../components/AdminLayout"
import DataTable from "./components/dataTable"
import { useState } from "react"
import { dataTableModel } from "./components/utils"



function HomeOwnerAppliedJobs() {
  const [datatable, setDatatable] = useState({...dataTableModel});
  return (
    <AdminLayout
      title={'Applied Jobs'}
      showCard
    >
      <DataTable
        table={datatable}
      />
    </AdminLayout>
  );
}

export default HomeOwnerAppliedJobs;
