import Messages from "./components/dataMessages"
import AdminLayout from "../../../components/AdminLayout"
import MDBox from "../../../components/MDBox"



function HomeOwnerMessages() {
  return (
    <AdminLayout
      title={'Messages'}
      showCard
    >
      <MDBox sx={{
        display: 'flex',
        height: '100%',
        flexDirection: { xs: 'column', md: 'row' },
        width: "100%",
      }}>
        <Messages />
      </MDBox>


    </AdminLayout>
  );
}

export default HomeOwnerMessages;
