import AdminLayout from "../../../components/AdminLayout"
import DataTable from "../../../components/AdminLayout/MyJobs/dataTable";
import { useState } from "react"
import { dataTableModel } from "../../../components/AdminLayout/MyJobs/utils"


function HomeOwnerJobs() {
  const [datatable, setDatatable] = useState({...dataTableModel});
  return (
    <AdminLayout
      title={'My Jobs'}
      showCard
    >
      <DataTable
        table={datatable}
      />
    </AdminLayout>

  );
}

export default HomeOwnerJobs;
