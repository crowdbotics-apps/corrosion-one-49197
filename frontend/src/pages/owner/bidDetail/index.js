import AdminLayout from "components/AdminLayout";
import React, {useEffect, useState} from "react"
import {useApi, useLoginStore} from "../../../services/helpers";
import {useNavigate, useParams} from "react-router-dom";
import {Dialog, DialogActions, DialogContent, DialogTitle, Grid} from "@mui/material";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import MDTypography from "@mui/material/Typography";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import {DocumentList} from "../../common/jobDetail/utils";
import {CredentialDocumentList} from "./utils";
import Box from "@mui/material/Box";
import PaymentModal from "../../../components/CheckoutForm/PaymentModal";
import avatar from "assets/images/avatar.png";
import {ROLES, ROUTES} from "../../../services/constants";


function BidDetail() {
  const api = useApi()
  const loginStore = useLoginStore()
  const {bidId = null} = useParams()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bid, setBid] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [action, setAction] = useState('reject');
  const [open, setOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [cards, setCards] = useState([])

  const getCards = () => {
    api.getCards().handle({
      onSuccess: (result) => {
        setCards(result.data)
      },
      errorMessage: 'Error getting cards',
    })
  }

  const getCreateChat = () => {
    setLoading(true)
    const data = {
      bid_id: bidId,
    }
    api.startChat(data).handle({
        onSuccess: (res) => {
          navigate(ROUTES.MESSAGES, { state: { chatId: res?.data?.id } })
        },
        errorMessage: 'Error creating chat',
        onFinally: () => setLoading(false)
      }
    )
  }

  const getBid = () => {
    setLoading(true)
    api.getBid(bidId).handle({
      onSuccess: (result) => {
        setBid(result.data)
      },
      errorMessage: 'Error getting bid',
      onFinally: () => setLoading(false)
    })
  }

  const rejectBid = () => {
    setLoading(true)
    api.rejectBid({bid_id: bidId}).handle({
      successMessage: 'Bid rejected successfully',
      onSuccess: () => {
        getBid()
        handleCloseModal()
      },
      errorMessage: 'Error rejecting bid',
      onFinally: () => setLoading(false)
    })
  }

  const acceptBid = () => {
    setLoading(true)
    api.acceptBid({bid_id: bidId}).handle({
      successMessage: 'Bid accepted successfully',
      onSuccess: () => {
        getBid()
        handleCloseModal()
      },
      errorMessage: 'Error accepting bid',
      onError: () => {
        handleCloseModal()
      },
      onFinally: () => setLoading(false)
    })
  }

  const createPaymentIntentHeld = () => {
    setLoading(true)
    api.createPaymentIntentHeld({bid_id: bidId}).handle({
      onSuccess: (res) => {
        setClientSecret(res.data)
        setTimeout(() => {
          setOpen(true)
        }, 300)
      },
      errorMessage: 'Error accepting bid',
      onFinally: () => setLoading(false)
    })
  }

  const handleAction = () => {
    if (action === 'reject') {
      rejectBid()
    } else if (action === 'accept') {
      acceptBid()
    }
    else if (action === 'pay') {
      createPaymentIntentHeld()
    }

  }

  const handleCloseModal = () => {
    setShowActionModal(false);
  }

  useEffect(() => {
    getBid()
    getCards()
  }, []);

  return (
    <AdminLayout
      title={'Application detail - ' + (bid?.job?.title || '')}
      showCard
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5}>
          <Grid container spacing={2}>
            <Grid xs={12} sm={4} p={1}>
              <img src={bid?.inspector?.profile_picture ? bid?.inspector?.profile_picture : avatar} alt="Bidder Avatar"
                   style={{width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover',}}/>
            </Grid>
            <Grid xs={12} sm={8} p={1}>
              <MDTypography
                sx={{fontSize: "38px"}}>{bid?.inspector?.user?.first_name} {bid?.inspector?.user?.last_name}</MDTypography>
              <MDTypography
                sx={{fontSize: "18px", color: "#8C8F8E", fontWeight: 400}}>{bid?.inspector?.user?.email}</MDTypography>
              <MDTypography sx={{
                fontSize: "18px",
                color: "#8C8F8E",
                fontWeight: 400
              }}>{bid?.inspector?.user?.phone_number}</MDTypography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={3} display={{xs: 'none', sm: 'flex'}}></Grid>
        <Grid item xs={12} sm={4}>
          <MDBox display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
            {loginStore.user_type === ROLES.OWNER && <MDButton
              onClick={() => getCreateChat()}
              disabled={loading}
              sx={{
              width: '150px',
              border: '2px solid #006E90',
              backgroundColor: 'white',
              height: '20px',
              borderRadius: 5,
            }}>
              <MDTypography sx={{
                color: '#006E90',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>Message</MDTypography>
              <QuestionAnswerOutlinedIcon
                sx={{color: "#006E90", width: "30px", height: "30px", marginLeft: '2px'}}/>
            </MDButton>}
            {bid?.inspector?.user?.linkedin && <MDBox
              sx={{
                width: '40px',
                height: '40px',
                backgroundColor: '#1F425526',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              onClick={() => window.open(bid?.inspector?.user?.linkedin, '_blank')}
              ml={2}
            >
              <MDTypography sx={{fontWeight: 'bold', color: '#006E90', fontSize: '20px'}}>
                in
              </MDTypography>
            </MDBox>}
          </MDBox>
        </Grid>
        <Grid item xs={12} sm={6}>
          <MDBox display={'flex'} flexDirection={"column"} justifyContent={'space-between'} alignItems={'flex-start'}>
            <MDTypography sx={{fontSize: "14px"}} mb={2}>Languages</MDTypography>
            {bid?.inspector?.languages?.length > 0 ? (
              <MDBox display={'flex'} gap={1}>
                {bid?.inspector?.languages.map((lang, index) => {
                  return (
                    <MDTypography key={index} sx={{fontSize: "14px", color: '#767977'}}>{index !== 0 && bid?.inspector?.languages.length > 1 && ' / '} {lang.name} </MDTypography>
                  )
                })}
              </MDBox>
            ) : "-"}
          </MDBox>
        </Grid>
        <Grid item xs={12} sm={6}>
          <MDTypography sx={{fontSize: "14px"}} mb={2}>Locations</MDTypography>
          <Grid container spacing={2}>
            {bid?.inspector?.regions?.length > 0 ? (
              bid?.inspector?.regions.map((location, index) => (
                <Grid item xs={6} key={index}>
                  <MDBox display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
                    <PinDropOutlinedIcon sx={{color: "#006E90", width: "20px", height: "20px"}}/>
                    <MDTypography sx={{
                      fontSize: "14px",
                      fontWeight: 'regular'
                    }}>{location.name}, {location.country_name}</MDTypography>
                  </MDBox>
                </Grid>
              ))
            ) : (
              <MDTypography sx={{fontSize: "18px", color: '#767977'}}>No locations available</MDTypography>
            )}
          </Grid>
        </Grid>
        {bid?.inspector?.user?.website && <Grid item xs={12}>
          <MDTypography sx={{fontSize: "14px"}} my={2}>Portfolio link</MDTypography>
          <MDTypography
            sx={{fontSize: "18px", color: '#767977', cursor: 'pointer'}}
            onClick={() => window.open(bid?.inspector?.user?.website, '_blank')}
          >{bid?.inspector?.user?.website}</MDTypography>
        </Grid>}
        <Grid item xs={12}>
          <MDBox borderTop={"1px solid #ccc"}>
            <MDTypography sx={{fontSize: "20px", color: '#006E90'}} my={2}>Documents</MDTypography>
            <DocumentList documents={bid?.inspector?.support_documents}/>
          </MDBox>
        </Grid>
        <Grid item xs={12}>
          <MDBox borderTop={"1px solid #ccc"}>
            <MDTypography sx={{fontSize: "20px", color: '#006E90'}} my={2}>Credentials</MDTypography>
            <CredentialDocumentList documents={bid?.inspector?.credentials}/>
          </MDBox>
        </Grid>
        {bid?.note && <Grid item xs={12}>
          <MDBox borderTop={"1px solid #ccc"}>
            <MDTypography sx={{fontSize: "20px", color: '#006E90'}} my={2}>Note</MDTypography>
            <MDTypography>{bid?.note}</MDTypography>
          </MDBox>
        </Grid>}
      </Grid>
      <MDBox borderTop={"1px solid #ccc"} mt={3}>
        <MDBox display={'flex'} justifyContent={'flex-end'} gap={2} marginTop={'20px'} marginBottom={'20px'}>
          {bid?.status === 'pending' && <MDButton
            color={'primary'}
            disabled={loading}
            onClick={
              () => {
                setAction('pay')
                setShowActionModal(true)
              }
            }
          >
            Pay and Approve
          </MDButton>}
          {bid?.status === 'pending' && <MDButton
            color={'primary'}
            disabled={loading || cards.length === 0}
            onClick={
              () => {
                setAction('accept')
                setShowActionModal(true)
              }
            }
          >
            Approve
          </MDButton>}
          {bid?.status === 'pending' && <MDButton
            disabled={loading}
            color={'error'}
            onClick={() => {
              setAction('reject')
              setShowActionModal(true)
            }}
          >
            Reject
          </MDButton>}
          <MDButton
            color={'secondary'}
            variant={'outlined'}
            onClick={() => navigate(-1)}
          >
            Go Back
          </MDButton>
        </MDBox>
      </MDBox>
      <Dialog open={showActionModal} onClose={handleCloseModal}>
        <DialogTitle>{action === 'reject' ? 'Reject Bid' : 'Accept Bid'}</DialogTitle>
        <DialogContent>
          {action === 'reject' && <p>Do you want to reject this bid?</p>}
          {action === 'accept' && <p>Do you want to accept this bid? This action will reject any other bids for this job.</p>}
          {action === 'pay' && <p>Do you want to pay and approve this bid? This action will reject any other bids for this job. Please note that some payment methods may take longer to process than others.</p>}
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
            onClick={handleAction}
            color={'error'}
            disabled={loading}
            loading={loading}
          >
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>
      <PaymentModal
        open={open}
        onClose={() => setOpen(false)}
        clientSecret={clientSecret}
      />
    </AdminLayout>
  );
}

export default BidDetail;
