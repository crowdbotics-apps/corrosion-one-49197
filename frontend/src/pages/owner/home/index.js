import AdminLayout from "components/AdminLayout";
import DataTable from "../../../components/AdminLayout/Dashboard/index"
import React, { useState } from "react"
import { dataTableModel } from "../../../components/AdminLayout/Dashboard/utils"
import MDBox from "../../../components/MDBox"
import Card from "@mui/material/Card"
import MDTypography from "@mui/material/Typography"
import MDButton from "../../../components/MDButton"


function HomeOwner() {
  const [datatable, setDatatable] = useState({...dataTableModel});
  return (
    <AdminLayout
      title={'Dashboard'}
    >
         <DataTable
           table={datatable}
         />

    </AdminLayout>
  );
}

export default HomeOwner;
