
import DataTable from "../../../components/AdminLayout/Messages/dataTable"
import { useState } from "react"
import { chatDataModel } from "../../../components/AdminLayout/Messages/utils"
import AdminLayout from "../../../components/AdminLayout"
import MDBox from "../../../components/MDBox"



function HomeOwnerMessages() {
  const [responsive, setResponsive] = useState({...chatDataModel});
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
          data={responsive}
        />
      </MDBox>


    </AdminLayout>
  );
}

export default HomeOwnerMessages;
