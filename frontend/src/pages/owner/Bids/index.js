
import AdminLayout from "../../../components/AdminLayout"
import DataTable from "../../../components/AdminLayout/Bids/dataTable";
import { useState } from "react"
import { dataTableModel } from "../../../components/AdminLayout/Bids/utils"



function HomeOwnerBids() {
  const [datatable, setDatatable] = useState({...dataTableModel});
  return (
    <AdminLayout
      title={'Bids'}
      showCard
    >
      <DataTable
        table={datatable}
      />
    </AdminLayout>

  );
}

export default HomeOwnerBids;
