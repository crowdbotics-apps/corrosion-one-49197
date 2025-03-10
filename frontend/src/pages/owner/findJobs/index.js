
import AdminLayout from "../../../components/AdminLayout"
import DataTable from "../../../components/AdminLayout/dataTable"
import { useState } from "react"
import { dataTableModel } from "../../../components/AdminLayout/utils"
import MDBox from "../../../components/MDBox"
import Details from "../../../components/AdminLayout/Find-Details"



function HomeOwnerDos() {
  const [datatable, setDatatable] = useState({...dataTableModel});
  return (
    // <AdminLayout
    //   title={'Find Jobs'}
    //   showCard
    // >
    //   <DataTable
    //     table={datatable}
    //   />
    // </AdminLayout>
  <AdminLayout
  >
    <MDBox sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      width: "90%",
    }}>
      <Details />
    </MDBox>
  </AdminLayout>
  );
}

export default HomeOwnerDos;
