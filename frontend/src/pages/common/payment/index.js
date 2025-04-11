import AdminLayout from "../../../components/AdminLayout";
import DataTable from "./component/dataTable"
import React, {useEffect, useRef, useState} from "react";
import {dataTableModel, renderTableRow} from "./utils"
import {useApi, useLoginStore} from "../../../services/helpers";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import Grid from "@mui/material/Grid"
import PaymentCard from "./component/PaymentCard"
import {ROLES} from "../../../services/constants";

import {loadConnectAndInitialize} from '@stripe/connect-js';
import {
  ConnectAccountManagement,
  ConnectAccountOnboarding, ConnectBalances,
  ConnectComponentsProvider,
  ConnectDocuments
} from "@stripe/react-connect-js";


function Payment() {
  const loginStore = useLoginStore();
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [showStripe, setShowStripe] = useState(false);

  const [accountSecretClient, setAccountSecretClient] = useState(null);

  const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

  const stripeRef = useRef(null)

  const createAccountSession = (action) => {
    setLoading(true);
    api.createAccountSession({action}).handle({
      onSuccess: (result) => {
        setAccountSecretClient(result.data);
      },
      errorMessage: 'Error getting account link',
      onFinally: () => setLoading(false)
    })
  }

  const getUserDetail = () => {
    api.userDetail().handle({
      onSuccess: (result) => {
        loginStore.setUser(result.response)
      }
    })
  }

  useEffect(() => {
    if (!accountSecretClient) return
    stripeRef.current = loadConnectAndInitialize({
      publishableKey: stripePublicKey,
      fetchClientSecret: async () => {
        setShowStripe(true)
        return accountSecretClient
      },
    })
  }, [accountSecretClient])

  useEffect(() => {
    if (loginStore.stripe_account_linked) {
      createAccountSession({
        "account_management": {
          "enabled": true,
          "features": {"external_account_collection": true},
        },
        "balances": {
          "enabled": true,
          "features": {
            "instant_payouts": true,
            "standard_payouts": true,
            "edit_payout_schedule": true,
          },
        },
      })
    }
    getUserDetail();
  }, [])


  const renderInspectorBody = () => {
    if (accountSecretClient && showStripe) {
      return (
        <ConnectComponentsProvider connectInstance={stripeRef.current}>
          {loginStore.stripe_account_linked === false && <ConnectAccountOnboarding
            onExit={() => {
              getUserDetail()
            }}
          />}
          {loginStore.stripe_account_linked === true && <><ConnectBalances /><ConnectAccountManagement/></>}
        </ConnectComponentsProvider>
      )
    }
    if (loginStore.stripe_account_linked === false) {
      return (
        <>
          <MDTypography variant={'h4'}>Set up your payment method</MDTypography>
          <MDTypography variant={'body1'} my={2} sx={{fontFamily: 'Arial'}}>Connect your Stripe account to start receiving
            payments securely and quickly.</MDTypography>
          <MDBox>
            <MDButton
              variant={'contained'}
              color={'secondary'}
              disabled={loading}
              onClick={() => createAccountSession({"account_onboarding": {
                  "enabled": true,
                  "features": {"external_account_collection": true},
                }})}
            >
              Electronic Payment Setup
            </MDButton>
          </MDBox>
        </>
      )
    }
    return (
      <>

      </>
    )
  }


  const renderOwnerBody = () => {
    return (
      <Grid flex={1} display="flex" direction="column" gap={2} xs={12} sx={{width:'100%',flexDirection: 'column', justifyContent: 'space-between'}}>
      <Grid display="flex" alignItems="center" width={'100%'} gap={2}  sx={{ flexDirection: 'row', overflowX: 'auto', paddingBottom: '10px' }}>
        {/*{cards.map((card) => (*/}
        {/*  <PaymentCard*/}
        {/*    key={card.cardId}*/}
        {/*    cardId={card.cardId}*/}
        {/*    nameOnCard={card.nameOnCard}*/}
        {/*    expireDate={card.expireDate}*/}
        {/*    cardNumber={card.cardNumber}*/}
        {/*    isActive={activeCard === card.cardId}*/}
        {/*    onToggle={handleToggle}*/}
        {/*  />*/}
        {/*))}*/}
      </Grid>
    <Card>
    <MDBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" ,gap:{xs:'20px'}, flexDirection:{md:'row',xs:'column'}}}>
      <MDTypography sx={{ fontSize: '16px', fontWeight: 'bold', padding:'20px' }}>
        Payment History
    </MDTypography>
    </MDBox>
      {/*<DataTable*/}
      {/*  loading={loading}*/}
      {/*  loadingText={'Loading...'}*/}
      {/*  table={datatable}*/}
      {/*  currentPage={currentPage}*/}
      {/*  numberOfItems={numberOfItems}*/}
      {/*  numberOfItemsPage={numberOfItemsPage}*/}
      {/*  searchFunc={getJobs}*/}
      {/*  searchQuery={searchQuery}*/}
      {/*  pageSize={10}*/}
      {/*  onPageChange={page => {*/}
      {/*    getJobs(searchQuery, page);*/}
      {/*    setCurrentPage(page);*/}
      {/*  }}*/}
      {/*/>*/}
    </Card>
    </Grid>
    )
  }


  return (
    <AdminLayout
      title={'Payment'}
      showCard
    >
      {loginStore.user_type === ROLES.INSPECTOR && renderInspectorBody()}
      {loginStore.user_type === ROLES.OWNER && renderOwnerBody()}
    </AdminLayout>
  );
}

export default Payment;
