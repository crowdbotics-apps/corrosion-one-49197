import AdminLayout from "../../../components/AdminLayout";
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
} from "@stripe/react-connect-js";


import {CardElement, Elements, useElements, useStripe} from "@stripe/react-stripe-js";
import DataTable from "../../../components/DataTable";

const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

function PaymentInner() {
  const loginStore = useLoginStore();
  const api = useApi();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [showStripe, setShowStripe] = useState(false);

  const [accountSecretClient, setAccountSecretClient] = useState(null);
  const [cards, setCards] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [order, setOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [datatable, setDatatable] = useState({...dataTableModel});



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

  const addPaymentMethod =  async () => {
    setLoading(true)
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
      },
    })

    if (error) {
      console.log('error', error)
      setLoading(false)
    }

    if (paymentMethod) {
      api.addCard({payment_method: paymentMethod.id}).handle({
        successMessage: 'Successfully added card',
        onSuccess: (result) => {
          cardElement.clear();
          getCards()
        },
        errorMessage: 'Error adding payment method',
        onFinally: () => setLoading(false)
      })
    }
  }

  const getCards = () => {
    setLoading(true)
    api.getCards().handle({
      onSuccess: (result) => {
        setCards(result.data)
      },
      errorMessage: 'Error getting cards',
      onFinally: () => setLoading(false)
    })
  }

  const setDefaultCard = (cardId) => {
    setLoading(true)
    api.setDefaultCard({card_id: cardId}).handle({
      successMessage: 'Successfully set default card',
      onSuccess: (result) => {
        getCards()
      },
      errorMessage: 'Error setting default card',
      onFinally: () => setLoading(false)
    })
  }

  const getTransactions = (search = '', page = 1, ordering = order, dates = null) => {
    setLoading(true);
    api.getTransactions({search, page, ordering, page_size: 10, dates}).handle({
      onSuccess: (result) => {
        const {count, results} = result.data
        const tmp = {...dataTableModel}
        tmp.rows = results.map(e => renderTableRow(e))
        setDatatable(tmp)
        setNumberOfItems(count)
        setNumberOfItemsPage(results.length)
        setOrder(ordering)
      },
      errorMessage: 'Error getting jobs',
      onFinally: () => setLoading(false)
    })
  }

  const deleteCard = (cardId) => {
    const data = {card_id: cardId}
    setLoading(true)
    api.deleteCard(data).handle({
      successMessage: 'Successfully deleted card',
      onSuccess: (result) => {
        getCards()
      },
      errorMessage: 'Error deleting card',
      onFinally: () => setLoading(false)
    })
  }


  const handleToggle = (cardId) => {
    setDefaultCard(cardId)
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
    if (loginStore.user_type === ROLES.INSPECTOR) {
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
    }
    getUserDetail();
    getCards()
  }, [])


  const handleDateChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  useEffect(() => {
    if (loading) return
    // Set up the timer
    const debounceTimer = setTimeout(() => {
      getTransactions(searchQuery)
    }, 500)


    // Clear the timer if searchQuery changes before the delay is over
    return () => {
      clearTimeout(debounceTimer)
    }
  }, [searchQuery])

  const renderInspectorBody = () => {
    if (accountSecretClient && showStripe) {
      return (
        <>
        <ConnectComponentsProvider connectInstance={stripeRef.current}>
          {loginStore.stripe_account_linked === false && <ConnectAccountOnboarding
            onExit={() => {
              window.location.reload()
            }}
            onLoadError={
              (error) => {
                console.log('error ===> ', error)
              }
            }
          />}
          {loginStore.stripe_account_linked === true && <><
            ConnectBalances/>
            {renderDatatable()}
            <ConnectAccountManagement/>
          </>}
        </ConnectComponentsProvider>
        </>
      )
    }
    if (loginStore.stripe_account_linked === false) {
      return (
        <>
          <MDTypography variant={'h4'}>Set up your payment method</MDTypography>
          <MDTypography variant={'body1'} my={2} sx={{fontFamily: 'Arial'}}>Connect your Stripe account to start
            receiving
            payments securely and quickly.</MDTypography>
          <MDBox>
            <MDButton
              variant={'contained'}
              color={'secondary'}
              disabled={loading}
              onClick={() => createAccountSession({
                "account_onboarding": {
                  "enabled": true,
                  "features": {"external_account_collection": true},
                }
              })}
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
      <>
      <MDBox>
        <Grid container spacing={2} mb={3} mt={0}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ p: 2, borderRadius: '12px'}}>
                <MDTypography variant={'h5'}>Add Payment Method</MDTypography>
              <MDBox my={5}>
                <CardElement/>
              </MDBox>
              <MDButton
                mt={5}
                variant={'contained'}
                color={'secondary'}
                disabled={loading}
                loading={loading}
                onClick={addPaymentMethod}>add card</MDButton>
            </Card>

          </Grid>
          {cards.map((card) => {
            return (
              <Grid item xs={6} sm={3} key={card.id}>
                <PaymentCard
                  cardId={card.id}
                  nameOnCard={loginStore.first_name + ' ' + loginStore.last_name}
                  expireDate={card.exp_month + '/' + card.exp_year}
                  cardNumber={card.last4}
                  cardBrand={card.brand}
                  isActive={card.default}
                  loading={loading}
                  onToggle={handleToggle}
                  deleteCard={deleteCard}
                />
              </Grid>
            )
          })}
        </Grid>
      </MDBox>
        {renderDatatable()}
      </>
    )
  }

  const renderDatatable = () => {
    return (
      <MDBox mt={2}>
        <DataTable
          loading={loading}
          loadingText={'Loading...'}
          table={datatable}
          currentPage={currentPage}
          numberOfItems={numberOfItems}
          numberOfItemsPage={numberOfItemsPage}
          searchFunc={getTransactions}
          searchQuery={searchQuery}
          pageSize={10}
          onPageChange={page => {
            getTransactions(searchQuery, page)
            setCurrentPage(page)
          }}
        />
      </MDBox>
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

export default PaymentInner;
