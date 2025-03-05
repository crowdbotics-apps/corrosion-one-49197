
import DataTable from "../../../components/AdminLayout/Messages/dataTable"
import { useState } from "react"
import { chatDataModel } from "../../../components/AdminLayout/Messages/utils"
import AdminLayout from "../../../components/AdminLayout"
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"


function HomeOwnerMessages() {
  const [datatable, setDatatable] = useState({...chatDataModel});
  return (
    <AdminLayout
      title={'Messages'}
      showCard
    >
      <MDBox sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        width: "100%",
      }}>
        <DataTable
          table={datatable}
        />
      </MDBox>


    </AdminLayout>
  );
}

export default HomeOwnerMessages;
