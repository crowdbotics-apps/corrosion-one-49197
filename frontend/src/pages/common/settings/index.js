import AdminLayout from "components/AdminLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ProductImages from "../../../layouts/ecommerce/products/product-page/components/ProductImages";
import Grid from "@mui/material/Grid";
import ProductInfo from "../../../layouts/ecommerce/products/new-product/components/ProductInfo";
import Card from "@mui/material/Card";
import {useApi, useLoginStore} from "../../../services/helpers";
import Icon from "@mui/material/Icon";
import {useEffect, useState} from "react";
import MDButton from "../../../components/MDButton";
import ProfileInspector from "./profileInspector";
import LocationSettings from "./locationSettings";
import Credentials from "./credentials";
import AccountSettings from "./accountSettings";
import {ROLES} from "../../../services/constants";
import ProfileOwner from "./profileOwner";

const BUTTONS_INSPECTOR = [
  {key: 1, name: "Profile", icon: "account_circle_outlined"},
  {key: 2, name: "Location Preferences", icon: "location_on_outlined"},
  {key: 3, name: "Credentials", icon: "vpn_key_outlined"},
  {key: 4, name: "Account Settings", icon: "manage_accounts_outlined"},
]

const BUTTONS_OWNER = [
  {key: 1, name: "Profile", icon: "account_circle_outlined"},
  {key: 4, name: "Account Settings", icon: "manage_accounts_outlined"},
]


function Settings() {
  const loginStore = useLoginStore();
  const api = useApi()
  const [selectedTab, setSelectedTab] = useState("Profile");
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLanguages = () => {
    setLoading(true)
    api.getLanguages().handle({
      onSuccess: (result) => {
        setLanguages(result?.data?.results)
      },
      onFinally: () => {
        setLoading(false)
      }
    })
  }

  const updateProfile = (data) => {
    console.log('===> ', data)
  }


  useEffect(() => {
    getLanguages()
  }, [])


  const renderButtons = (buttons) => {
    return buttons.map((button, index) => {
      const selected = selectedTab === button.name;
      const selectedColor = selected ? '#3C7092' : '#2F4052';
      return (
        <MDBox
          onClick={() => setSelectedTab(button.name)}
          key={index}
          display="flex"
          alignItems="center"
          p={1}
          px={2}
          sx={{
            borderBottom: `${selected ? "2px" : "1px"} solid ${selected ? '#3C7092' : 'transparent'}`,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          <MDBox mr={1}>
            <Icon fontSize="small" sx={{color: selectedColor}}>{button.icon}</Icon>
          </MDBox>
          <MDTypography fontSize="14px" mb={0.5} sx={{color: selectedColor}}>
            {button.name}
          </MDTypography>
        </MDBox>
      )
    })
  }
  return (
    <AdminLayout
      title={'Settings'}
      showCard
    >
      <MDBox
        display="flex"
        flexDirection="row"
        flexWrap="nowrap"
        sx={{
          borderBottom: `1px solid #E4E5E8`,
          overflowX: 'auto',
        }}
        mb={2}
      >
        {renderButtons(loginStore.user_type === ROLES.INSPECTOR ? BUTTONS_INSPECTOR : BUTTONS_OWNER)}
      </MDBox>
      {selectedTab === "Profile" && loginStore.user_type === ROLES.INSPECTOR && <ProfileInspector updateProfile={updateProfile} languages={languages} loading={loading} />}
      {selectedTab === "Profile" && loginStore.user_type === ROLES.OWNER && <ProfileOwner updateProfile={updateProfile} />}
      {selectedTab === "Location Preferences" && <LocationSettings />}
      {selectedTab === "Credentials" && <Credentials />}
      {selectedTab === "Account Settings" && <AccountSettings />}

    </AdminLayout>
  );
}

export default Settings;
