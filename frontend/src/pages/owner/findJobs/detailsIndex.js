
import AdminLayout from "../../../components/AdminLayout"
import MDBox from "../../../components/MDBox"
import Details from "../jobDetail"





function HomeOwnerDetails() {
  return (
    <AdminLayout
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
