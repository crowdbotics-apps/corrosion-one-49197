import AdminLayout from "../../../components/AdminLayout"
import DataTable from "../../../components/DataTable";
import React, {useEffect, useState} from "react"
import {dataTableModel, dataTableModelOwner, renderTableRow} from "./utils"
import {useApi, useLoginStore} from "../../../services/helpers";
import {useLocation, useNavigate} from "react-router-dom";
import MDBox from "../../../components/MDBox";
import {Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField} from "@mui/material";
import SearchBar from "../../../components/SearchBar";
import Box from "@mui/material/Box";
import MDButton from "../../../components/MDButton";
import {ROLES, ROUTES} from "../../../services/constants";
import DateBar from "../../../components/DateBar"
import Grid from "@mui/material/Grid"


function JobList() {
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
  const [pageTitle, setPageTitle] = useState("My Active Jobs");

  const getJobs = (search = '', page = 1, ordering = order, dates = null) => {
    setLoading(true)
    let status = null
    if (pathname === ROUTES.MY_JOBS || pathname === ROUTES.FIND_JOBS) {
      status = 'draft,started,pending,finished_by_inspector,awaiting_payment'
    } else if (pathname === ROUTES.HISTORY) {
      status = 'canceled,finished'
    }

    let applied = null
    if (pathname === ROUTES.APPLIED_JOBS) {
      applied = true
    }

    let favorite = null
    if (pathname === ROUTES.FAVORITE){
      favorite = true
    }

    api.getJobs({search, page, ordering, page_size: 10, dates, status, applied, favorite}).handle({
      onSuccess: (result) => {
        const {count, results} = result.data
        const tmp =loginStore.user_type === ROLES.INSPECTOR ? {...dataTableModel} : {...dataTableModelOwner}
        tmp.rows = results.map(e => renderTableRow(e, setSelectedItem, setOpenCancelModal, navigate, loginStore.user_type))
        setDatatable(tmp)
        setNumberOfItems(count)
        setNumberOfItemsPage(results.length)
        setOrder(ordering)
      },
      errorMessage: 'Error getting jobs',
      onFinally: () => setLoading(false)
    })
  }

  const cancelJob = () => {
    setLoading(true)
    api.cancelJob(selectedItem?.id).handle({
        onSuccess: (res) => {
          getJobs()
          setSelectedItem(null)
          setOpenCancelModal(false)
        },
      successMessage: 'Job cancelled successfully',
        errorMessage: 'Error cancelling job',
        onFinally: () => setLoading(false)
      }
    )
  }


  const handleDateChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleCloseModal = () => {
    setOpenCancelModal(false);
    setSelectedItem(null);
  }

  useEffect(() => {
    if (loading) return
    // Set up the timer
    const debounceTimer = setTimeout(() => {
      getJobs(searchQuery)
    }, 500)


    // Clear the timer if searchQuery changes before the delay is over
    return () => {
      clearTimeout(debounceTimer)
    }
  }, [searchQuery])

  useEffect(() => {
    if (startDate && endDate) {
      getJobs(searchQuery, currentPage, order, `${startDate.format('YYYY-MM-DD')},${endDate.format('YYYY-MM-DD')}`)
    } else {
      getJobs(searchQuery )
    }
  }, [startDate, endDate])

  useEffect(() => {
    if (pathname === ROUTES.MY_JOBS) setPageTitle("My Active Jobs")
    if (pathname === ROUTES.HISTORY) setPageTitle("Jobs History")
    if (pathname === ROUTES.FIND_JOBS) setPageTitle("Find Jobs")
    if (pathname === ROUTES.FAVORITE) setPageTitle("Favorite Jobs")
    if (pathname === ROUTES.APPLIED_JOBS) setPageTitle("Applied Jobs")
    getJobs()
  }, [pathname])

  return (
    <AdminLayout
      title={pageTitle}
      showCard
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <SearchBar loading={loading} search={getJobs} setSearchQuery={setSearchQuery}/>
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
        searchFunc={getJobs}
        searchQuery={searchQuery}
        pageSize={10}
        onPageChange={page => {
          getJobs(searchQuery, page)
          setCurrentPage(page)
        }}
      />
      <Dialog open={openCancelModal} onClose={handleCloseModal}>
        <DialogTitle>{selectedItem?.bids === 0 ? 'Delete Job' : 'Cancel Job'}</DialogTitle>
        <DialogContent>
          <p>Do you want to {selectedItem?.bids === 0 ? 'delete' : 'cancel'} this job?</p>
        </DialogContent>
        <DialogActions sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Box sx={{display: 'flex', justifyContent: 'flex-start', flexGrow: 1}}>
            <MDButton
              variant="outlined"
              onClick={handleCloseModal}
              color={'secondary'}
              disabled={loading}
            >
              Cancel
            </MDButton>
          </Box>
          <MDButton
            onClick={cancelJob}
            color={'error'}
            disabled={loading}
            loading={loading}
          >
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>
    </AdminLayout>

  );
}

export default JobList;
