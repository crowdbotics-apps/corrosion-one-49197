
import AdminLayout from "../../../components/AdminLayout"
import DataTable from "../../../components/AdminLayout/dataTable"
import { useState } from "react"
import { dataTableModel } from "../../../components/AdminLayout/utils"



function HomeOwnerDos() {
  const [datatable, setDatatable] = useState({...dataTableModel});
  return (
    <AdminLayout
      title={'Find Jobs'}
      showCard
    >
      <DataTable
        table={datatable}
      />
    </AdminLayout>
  );
}

export default HomeOwnerDos;
