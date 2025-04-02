import AdminLayout from "../../../components/AdminLayout";
import DataTable from "../../../components/DataTable";
import React, { useEffect, useState } from "react";
import { dataTableModel } from "./utils";
import { useApi, useLoginStore } from "../../../services/helpers";
import MDBox from "../../../components/MDBox";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import SearchBar from "../../../components/SearchBar";
import Box from "@mui/material/Box";
import MDButton from "../../../components/MDButton";
import DateBar from "../../../components/DateBar";
import { renderTableRow } from "./utils";
import MDAvatar from "../../../components/MDAvatar"
import MDTypography from "@mui/material/Typography"

function HomeOwnerAppliedJobs() {
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

  const getJobs = (search = '', page = 1, ordering = order, dates = null) => {
    setLoading(true);
    const estilo = {
      title:{
        fontWeight: 'bold'
      },
      font: {
        color: '#7C8493',
      },
      button:{
        paddingTop: '2px',
        paddingBottom: '2px',
        paddingRight: '10px',
        paddingLeft: '10px',
        borderRadius: '12px',
        borderColor: '#006E90',
        color: '#006E90',
        fontSize: '15px',
      },
    };

    // Datos estáticos simulando la respuesta de la API
    const result = {
      data: {
        count: 25,
        results: [
          {
            profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"circulsr"} style={{ fontSize: "50px" }}/>,
            name: (
              <MDBox>
                <MDTypography style={estilo.title}>Operations Manager</MDTypography>
                <MDTypography style={estilo.font}>Optimizing business processes to improve efficiency and profitability.</MDTypography>
              </MDBox>

            ),
            status: "Pending",
            jobStatus: "Active",
            applicationDate: <MDBox>{new Date("2025-02-17").toLocaleDateString()}</MDBox>,
          },
          {
            profile_picture: <MDAvatar src={"https://i.pinimg.com/564x/3f/9f/5b/3f9f5b8c9f31ce16c79d48b9eeda4de0.jpg"} variant={"circular"} style={{ fontSize: "50px" }}/>,
            name: (
              <MDBox>
                <MDTypography style={estilo.title}>SEO Expert</MDTypography>
                <MDTypography style={estilo.font}>Enhancing website visibility and driving traffic through SEO.</MDTypography>
              </MDBox>
            ),
            status: "Pending",
            jobStatus: "Active",
            applicationDate: <MDBox>{new Date("2025-02-15").toLocaleDateString()}</MDBox>,
          },
          {
            profile_picture: <MDAvatar src={"https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"} variant={"circular"} style={{ fontSize: "50px" }}/>,
            name: (
              <MDBox>
                <MDTypography style={estilo.title}>Content Strategist</MDTypography>
                <MDTypography style={estilo.font}>Developing content plans to drive engagement and brand storytelling.</MDTypography>
              </MDBox>
            ),
            status: "Selected",
            jobStatus: "Not Available",
            applicationDate: <MDBox>{new Date("2025-02-16").toLocaleDateString()}</MDBox>,
          }
        ]
      }
    };


    const { count, results } = result.data;
    const tmp = { ...dataTableModel };

    tmp.rows = results.map(e => renderTableRow(e, setSelectedItem, setOpenCancelModal));

    setDatatable(tmp);
    setNumberOfItems(count);
    setNumberOfItemsPage(results.length);
    setLoading(false);
  };

  useEffect(() => {
    getJobs(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (startDate && endDate) getJobs(searchQuery, 1, order, `${startDate.format('YYYY-MM-DD')},${endDate.format('YYYY-MM-DD')}`);
  }, [startDate, endDate]);

  return (
    <AdminLayout title={'Applied Jobs'} showCard>
      <MDBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" ,gap:{xs:'20px'}, flexDirection:{md:'row',xs:'column'}}}>
        <SearchBar loading={loading} search={getJobs} setSearchQuery={setSearchQuery} />
        <DateBar startDate={startDate} endDate={endDate} onDateChange={handleDateChange} />
      </MDBox>
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
          getJobs(searchQuery, page);
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

export default HomeOwnerAppliedJobs;
