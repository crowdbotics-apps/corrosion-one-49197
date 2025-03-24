import AdminLayout from "components/AdminLayout";
import DataTable from "./components"
import React, { useState } from "react"
import { dataTableModel } from "./components/utils"


function HomeOwner() {
  const [datatable, setDatatable] = useState({...dataTableModel});
  return (
    <AdminLayout
      title={'Dashboard'}
      width={'100%'}
    >
         <DataTable
           table={datatable}
         />

    </AdminLayout>
  );
}

export default HomeOwner;
