import {useApi, useLoginStore} from "../../../services/helpers";
import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {dataTableModel, renderTableRow} from "./utils";
import AdminLayout from "../../../components/AdminLayout";
import Grid from "@mui/material/Grid";
import SearchBar from "../../../components/SearchBar";
import MDBox from "../../../components/MDBox";
import DateBar from "../../../components/DateBar";
import DataTable from "../../../components/DataTable";
import {ROLES} from "../../../services/constants";


function Notifications() {
  const api = useApi()
  const [datatable, setDatatable] = useState({...dataTableModel});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [order, setOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const getNotifications = (search = '', page = 1, ordering = order, dates = null) => {
    setLoading(true);
    api.getNotifications({search, page, ordering, page_size: 10, dates}).handle({
      onSuccess: (result) => {
        const {count, results} = result.data
        const tmp = {...dataTableModel}
        tmp.rows = results.map(e => renderTableRow(e, markAsRead))
        setDatatable(tmp)
        setNumberOfItems(count)
        setNumberOfItemsPage(results.length)
        setOrder(ordering)
      },
      errorMessage: 'Error getting jobs',
      onFinally: () => setLoading(false)
    })
  }

  const markAsRead = (id) => {
    setLoading(true);
    api.markAaRead(id).handle({
      onSuccess: (result) => {
        getNotifications(searchQuery)
      },
      errorMessage: 'Error marking notification as read',
      onFinally: () => setLoading(false)
    })
  }

  const handleDateChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };



  useEffect(() => {
    if (loading) return
    // Set up the timer
    const debounceTimer = setTimeout(() => {
      getNotifications(searchQuery)
    }, 500)


    // Clear the timer if searchQuery changes before the delay is over
    return () => {
      clearTimeout(debounceTimer)
    }
  }, [searchQuery])

  useEffect(() => {
    if (startDate && endDate) {
      getNotifications(searchQuery, currentPage, order, `${startDate.format('YYYY-MM-DD')},${endDate.format('YYYY-MM-DD')}`)
    } else {
      getNotifications(searchQuery )
    }
  }, [startDate, endDate])

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
