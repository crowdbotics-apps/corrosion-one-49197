import AdminLayout from "../../../components/AdminLayout";
import DataTable from "../../../components/DataTable/index";
import React, { useEffect, useState } from "react";
import { dataTableModel } from "./utils";
import { useApi, useLoginStore } from "../../../services/helpers";
import {useNavigate, useParams} from "react-router-dom";
import MDBox from "../../../components/MDBox";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import SearchBar from "../../../components/SearchBar";
import Box from "@mui/material/Box";
import MDButton from "../../../components/MDButton";
import DateBar from "../../../components/DateBar";
import { renderTableRow } from "./utils";
import MDAvatar from "../../../components/MDAvatar"
import Grid from "@mui/material/Grid" // Importar la función que renderiza las filas

function Bids() {
  const loginStore = useLoginStore();
  const {jobId = null} = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const [datatable, setDatatable] = useState({ ...dataTableModel });
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

  const rejectBid = () => {
    setLoading(true)
    api.rejectBid({bid_id: selectedItem?.id}).handle({
      successMessage: 'Bid rejected successfully',
      onSuccess: () => {
        getBids()
        handleCloseModal()
      },
      errorMessage: 'Error rejecting bid',
      onFinally: () => setLoading(false)
    })
  }

  const getBids = (search = '', page = 1, ordering = order, dates = null) => {
    setLoading(true);
    api.getBids({search, page, ordering, page_size: 10, dates, job_id: jobId}).handle({
      onSuccess: (result) => {
        const {count, results} = result.data
        const tmp = {...dataTableModel}
        tmp.rows = results.map(e => renderTableRow(e, setSelectedItem, setOpenCancelModal, navigate))
        setDatatable(tmp)
        setNumberOfItems(count)
        setNumberOfItemsPage(results.length)
        setOrder(ordering)
      },
      errorMessage: 'Error getting jobs',
      onFinally: () => setLoading(false)
    })
  };

  const handleCloseModal = () => {
    setOpenCancelModal(false);
    setSelectedItem(null);
  }

  const handleDateChange = (newStartDate, newEndDate) => {

    if (newEndDate && newStartDate && newEndDate.isBefore(newStartDate)) {

    } else {
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    }
  };


  useEffect(() => {
    if (loading) return
    // Set up the timer
    const debounceTimer = setTimeout(() => {
      getBids(searchQuery)
    }, 500)


    // Clear the timer if searchQuery changes before the delay is over
    return () => {
      clearTimeout(debounceTimer)
    }
  }, [searchQuery])

  useEffect(() => {
    if (startDate && endDate) getBids(searchQuery, 1, order, `${startDate.format('YYYY-MM-DD')},${endDate.format('YYYY-MM-DD')}`);
  }, [startDate, endDate]);

  return (
    <AdminLayout title={jobId ? 'Job bids' : 'Bids'} showCard>
      <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
        <SearchBar loading={loading} search={getBids} setSearchQuery={setSearchQuery}/>
        <DateBar startDate={startDate} endDate={endDate} onDateChange={handleDateChange} />
      </Grid>
      <DataTable
        loading={loading}
        loadingText={'Loading...'}
        table={datatable}
        currentPage={currentPage}
        numberOfItems={numberOfItems}
        numberOfItemsPage={numberOfItemsPage}
        searchFunc={getBids}
        searchQuery={searchQuery}
        pageSize={10}
        onPageChange={page => {
          getBids(searchQuery, page);
          setCurrentPage(page);
        }}
      />
      <Dialog open={openCancelModal} onClose={() => handleCloseModal()}>
        <DialogTitle>Reject bid</DialogTitle>
        <DialogContent>
          <p>Do you want to reject this bid?</p>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexGrow: 1 }}>
            <MDButton variant="outlined" onClick={() => handleCloseModal()} color={'secondary'}>
              Cancel
            </MDButton>
          </Box>
          <MDButton onClick={() => rejectBid()} color={'error'}>
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}

export default Bids;
