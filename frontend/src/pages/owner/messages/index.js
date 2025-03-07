import Messages from "../../../components/AdminLayout/Messages/dataMessages"
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
        flexDirection: { xs: 'column', md: 'row' },
        width: "100%",
      }}>
        <Messages />
      </MDBox>


    </AdminLayout>
  );
}

export default HomeOwnerMessages;
