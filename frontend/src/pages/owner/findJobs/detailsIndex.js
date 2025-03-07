
import AdminLayout from "../../../components/AdminLayout"
import { useState } from "react"
import { dataTableModel } from "../../../components/AdminLayout/utils"
import Messages from "../../../components/AdminLayout/Messages/dataMessages"
import MDBox from "../../../components/MDBox"
import Details from "../../../components/AdminLayout/Find-Details"




function HomeOwnerDetails() {
  return (
    <AdminLayout
      title={'Details'}
      showCard
    >
      <MDBox sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        width: "100%",
      }}>
        <Details />
      </MDBox>
    </AdminLayout>
  );
}

export default HomeOwnerDetails;
