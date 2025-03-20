import AdminLayout from "components/AdminLayout";
import DataTable from "../../../components/AdminLayout/Dashboard/index"
import { useState } from "react"
import { dataTableModel } from "../../../components/AdminLayout/Dashboard/utils"


function HomeOwner() {
  const [datatable, setDatatable] = useState({...dataTableModel});
  return (
    <AdminLayout
      title={'Dashboard'}
      showCard
    >
      <DataTable
        table={datatable}
      />

    </AdminLayout>
  );
}

export default HomeOwner;
