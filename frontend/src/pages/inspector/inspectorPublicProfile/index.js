import PageLayout from "../../../components/PageLayout";
import Card from "@mui/material/Card";
import MDBox from "@mui/material/Box";
import {checkUrl, useApi} from "../../../services/helpers";
import {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import MDTypography from "../../../components/MDTypography";
import avatar from "assets/images/avatar.png";
import logo from "assets/svgs/logo-text.svg";
import {useParams} from "react-router-dom";


function InspectorPublicProfile() {
  const api = useApi()
  const {inspectorId = null} = useParams();
  const [loading, setLoading] = useState(false)
  const [inspectorData, setInspectorData] = useState(null)


  const getInspectorPublic = () => {
    setLoading(true)
    api.getInspectorPublic(inspectorId).handle({
        onSuccess: (res) => {
          setInspectorData(res.data)
        },
        onFinally: () => setLoading(false)
      }
    )
  }

  useEffect(() => {
    getInspectorPublic()
  }, []);


  return (
    <PageLayout>
      <MDBox maxWidth="md" mx={'auto'}>
        <Card>
          <MDBox mt={5} mb={2} textAlign="center">
            <img src={logo} alt="logo" width={'50%'} />
            <MDTypography variant="h5" fontWeight="bold" textAlign="center" p={2}>
              Inspector Public Profile
            </MDTypography>
          </MDBox>
          <Grid container p={2}>
            <Grid item xs={12} md={6}>
              <MDBox>
                <img
                  src={inspectorData?.profile_picture ? checkUrl(inspectorData?.profile_picture) : avatar}
                  alt=""
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    cursor: 'pointer'
                  }}
                />
                <MDTypography>First Name: {inspectorData?.first_name}</MDTypography>
                <MDTypography>Last Name: {inspectorData?.last_name}</MDTypography>
                <MDTypography>Role: Inspector</MDTypography>
              </MDBox>
            </Grid>

            <Grid item xs={12} md={6}>
              <MDBox>

                <MDTypography>Phone: {inspectorData?.phone_number}</MDTypography>
                <MDTypography>Website: {inspectorData?.website}</MDTypography>
                <MDTypography>Linkedin: {inspectorData?.linkedin}</MDTypography>

              </MDBox>
            </Grid>
          </Grid>
        </Card>
      </MDBox>
    </PageLayout>
  )

}

export default InspectorPublicProfile
