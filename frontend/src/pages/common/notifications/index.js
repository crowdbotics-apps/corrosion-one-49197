import {useApi, useLoginStore} from "../../../services/helpers";
import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {dataTableModel} from "./utils";
import AdminLayout from "../../../components/AdminLayout";
import Grid from "@mui/material/Grid";
import SearchBar from "../../../components/SearchBar";
import MDBox from "../../../components/MDBox";
import DateBar from "../../../components/DateBar";
import DataTable from "../../../components/DataTable";


function Notifications() {
  const loginStore = useLoginStore();
  const api = useApi()
  const navigate = useNavigate()
  const {pathname} = useLocation();
  const [datatable, setDatatable] = useState({...dataTableModel});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [order, setOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const getNotifications = (search = '', page = 1, ordering = order, dates = null) => {
    // setLoading(true)
  }

  const handleDateChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };


  useEffect(() => {
    getNotifications(searchQuery)
  }, [])

  return (
    <AdminLayout
      title={'Notifications'}
      showCard
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <SearchBar loading={loading} search={getNotifications} setSearchQuery={setSearchQuery}/>
        </Grid>
        <Grid item xs={12} md={6}>
          <MDBox display="flex" justifyContent={{xs: 'flex-start', md: 'flex-end'}}>
            <DateBar
              startDate={startDate}
              endDate={endDate}
              onDateChange={handleDateChange}
            />
          </MDBox>
        </Grid>
      </Grid>
      <DataTable
        loading={loading}
        loadingText={'Loading...'}
        table={datatable}
        currentPage={currentPage}
        numberOfItems={numberOfItems}
        numberOfItemsPage={numberOfItemsPage}
        searchFunc={getNotifications}
        searchQuery={searchQuery}
        pageSize={10}
        onPageChange={page => {
          getNotifications(searchQuery, page)
          setCurrentPage(page)
        }}
      />
    </AdminLayout>
  )
}

export default Notifications;
