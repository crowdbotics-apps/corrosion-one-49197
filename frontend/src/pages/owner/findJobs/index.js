
import AdminLayout from "../../../components/AdminLayout"
import DataTable from "./components/dataTable"
import { useState } from "react"
import { dataTableModel } from "./components/utils"
import MDBox from "../../../components/MDBox"
import Details from "./components/Find-Details"



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
   // <AdminLayout
   //        showCard
   //      >
   //        <MDBox sx={{
   //          display: 'flex',
   //          flexDirection: { xs: 'column', md: 'row' },
   //          width: "100%",
   //        }}>
   //          <Details />
   //        </MDBox>
   //      </AdminLayout>
  );
}

export default HomeOwnerDos;
