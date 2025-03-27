import AdminLayout from "../../../components/AdminLayout";
import DataTable from "../../../components/DataTable/index";
import React, { useEffect, useState } from "react";
import { dataTableModel } from "./utils";
import { useApi, useLoginStore } from "../../../services/helpers";
import { useNavigate } from "react-router-dom";
import MDBox from "../../../components/MDBox";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import SearchBar from "../../../components/SearchBar";
import Box from "@mui/material/Box";
import MDButton from "../../../components/MDButton";
import DateBar from "../../../components/DateBar";
import { renderTableRow } from "./utils";
import MDAvatar from "../../../components/MDAvatar" // Importar la función que renderiza las filas

function HomeOwnerJobs() {
  const loginStore = useLoginStore();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
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

  const handleDateChange = (newStartDate, newEndDate) => {

    if (newEndDate && newStartDate && newEndDate.isBefore(newStartDate)) {
      setError('End date cannot be before start date');
    } else {
      setError(null);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      if (newStartDate && newEndDate) {
        setOpen(false);
      }
    }
  };

  const getBids = (search = '', page = 1, ordering = order, dates = null) => {
    setLoading(true);
    api.getBids({search, page, ordering, page_size: 10, dates}).handle({
      onSuccess: (result) => {
        const {count, results} = result.data
        const tmp = {...dataTableModel}
        tmp.rows = results.map(e => renderTableRow(e, setSelectedItem, setOpenCancelModal))
        setDatatable(tmp)
        setNumberOfItems(count)
        setNumberOfItemsPage(results.length)
        setOrder(ordering)
      },
      errorMessage: 'Error getting jobs',
      onFinally: () => setLoading(false)
    })
  };

  useEffect(() => {
    getBids(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (startDate && endDate) getBids(searchQuery, 1, order, `${startDate.format('YYYY-MM-DD')},${endDate.format('YYYY-MM-DD')}`);
  }, [startDate, endDate]);

  return (
    <AdminLayout title={'Bids'} showCard>
      <MDBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" ,gap:{xs:'20px'}, flexDirection:{md:'row',xs:'column'}}}>
        <SearchBar loading={loading} search={getBids} setSearchQuery={setSearchQuery} />
        <DateBar startDate={startDate} endDate={endDate} onDateChange={handleDateChange} />
      </MDBox>
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
      <Dialog open={openCancelModal} onClose={() => setOpenCancelModal(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <p>Do you want to cancel this job?</p>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexGrow: 1 }}>
            <MDButton variant="outlined" onClick={() => setOpenCancelModal(false)} color={'secondary'}>
              Cancel
            </MDButton>
          </Box>
          <MDButton onClick={() => {}} color={'error'}>
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}

export default HomeOwnerJobs;
