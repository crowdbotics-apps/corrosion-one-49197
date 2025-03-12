
import AdminLayout from "../../../components/AdminLayout"
import MDBox from "../../../components/MDBox"
import Card from "@mui/material/Card"
import {PostJob} from "../../../components/AdminLayout/PostJob/dataPostJob"
import PostJobTwo from "../../../components/AdminLayout/PostJob/dataPostJob"
import pxToRem from "assets/theme/functions/pxToRem";



function HomeOwnerPostJob(showCard,contentCentered = false) {
  return (
    <AdminLayout
      title={'Post Jobs'}
    >
      <MDBox
        gap={2}
        display={'flex'}
        flex={1}
        sx={ contentCentered && {justifyContent: 'flex-start', pl: pxToRem(15)}}
      >
        {showCard && (
          <Card sx={{
            width: "49%",
            height: "820px",
            p: 5,
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
          }}>
            <PostJob />
          </Card>
        )}
        {!showCard && <PostJob />}
        {showCard && (
          <Card sx={{
            width: "49%",
            height: "820px",
            p: 5,
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(18,18,18,0.3)",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
          }}><PostJobTwo />

          </Card>
        )}
        {!showCard && ""}



      </MDBox>

    </AdminLayout>
  );
}


export default HomeOwnerPostJob;
