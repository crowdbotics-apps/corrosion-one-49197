
import AdminLayout from "../../../components/AdminLayout"
import MDBox from "../../../components/MDBox"
import Card from "@mui/material/Card"
import { PostJob } from "../../../components/AdminLayout/PostJob/dataPostJob"
import pxToRem from "assets/theme/functions/pxToRem";



function HomeOwnerPostJob(showCard,contentCentered = false) {
  return (
    <AdminLayout
      title={'Post Jobs'}
    >
      <PostJob/>
    </AdminLayout>
  );
}


export default HomeOwnerPostJob;
