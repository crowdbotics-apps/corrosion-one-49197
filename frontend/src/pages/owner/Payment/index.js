import AdminLayout from "../../../components/AdminLayout";
import DataTable from "./component/dataTable"
import React, { useEffect, useState } from "react";
import { dataTableModel } from "./utils"
import { useApi, useLoginStore } from "../../../services/helpers";
import MDBox from "../../../components/MDBox";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Box from "@mui/material/Box";
import MDButton from "../../../components/MDButton";
import { renderTableRow } from "./utils"
import MDAvatar from "../../../components/MDAvatar"
import MDTypography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import Grid from "@mui/material/Grid"
import PaymentCard from "./component/PaymentCard"

function Payment() {
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
  const [activeCard, setActiveCard] = useState(null);

  const cards = [
    { cardId: 1, nameOnCard: "John Doe", expireDate: "12/25", cardNumber: "1234567812345678" },
    { cardId: 2, nameOnCard: "Jane Doe", expireDate: "11/24", cardNumber: "9876543298765432" },
  ];

  const getJobs = (search = '', page = 1, ordering = order, dates = null) => {
    setLoading(true);

    // Datos estáticos simulando la respuesta de la API
    const result = {
      data: {
        count: 25,
        results: [
          {
            name: "#487441",
            status: "$999 USD",
            applicationDate: "9 7, 2019 23:26",
          },
          {
            name: "#487441",
            status: "$999 USD",
            applicationDate: "12 7, 2019 23:26",
          },
          {
            name: "#487441",
            status: "$999 USD",
            applicationDate: "12 7, 2019 23:26",
          },
          {
            name: "#487441",
            status: "$999 USD",
            applicationDate: "12 7, 2019 23:26",
          },
          {
            name: "#487441",
            status: "$999 USD",
            applicationDate: "12 7, 2019 23:26",
          },
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



  const handleToggle = (cardId) => {
    setActiveCard(prevCard => (prevCard === cardId ? null : cardId));
  };
  return (
    <AdminLayout title={'Payment'} width={'100%'}>
      <Grid flex={1} display="flex" direction="column" gap={2} xs={12} sx={{width:'100%',flexDirection: 'column', justifyContent: 'space-between'}}>
        <Grid display="flex" alignItems="center" width={'100%'} gap={2}  sx={{ flexDirection: 'row', overflowX: 'auto', paddingBottom: '10px' }}>
          {cards.map((card) => (
            <PaymentCard
              key={card.cardId}
              cardId={card.cardId}
              nameOnCard={card.nameOnCard}
              expireDate={card.expireDate}
              cardNumber={card.cardNumber}
              isActive={activeCard === card.cardId}
              onToggle={handleToggle}
            />
          ))}
        </Grid>

      <Card>
      <MDBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" ,gap:{xs:'20px'}, flexDirection:{md:'row',xs:'column'}}}>
        <MDTypography sx={{ fontSize: '16px', fontWeight: 'bold', padding:'20px' }}>
          Payment History
      </MDTypography>
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
      </Card>
      </Grid>
    </AdminLayout>
  );
}

export default Payment;
