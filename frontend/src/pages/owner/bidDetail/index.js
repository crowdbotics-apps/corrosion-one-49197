import AdminLayout from "components/AdminLayout";
import React, {useEffect, useState} from "react"
import {useApi} from "../../../services/helpers";
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


function BidDetail() {
  const api = useApi()
  const {bidId = null} = useParams()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bid, setBid] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [action, setAction] = useState('reject');


  const getBid = () => {
    setLoading(true)
    api.getBid(bidId).handle({
      onSuccess: (result) => {
        console.log(result);
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
      onFinally: () => setLoading(false)
    })
  }

  const handleAction = () => {
    if (action === 'reject') {
      rejectBid()
    } else if (action === 'accept') {
      acceptBid()
    }

  }

  const handleCloseModal = () => {
    setShowActionModal(false);
  }

  useEffect(() => {
    getBid()
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
              <img src={bid?.inspector?.profile_picture} alt="Bidder Avatar"
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
            <MDButton sx={{
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
            </MDButton>
            <MDBox
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
            </MDBox>
          </MDBox>
        </Grid>
        <Grid item xs={12} sm={6}>
          <MDBox display={'flex'} flexDirection={"column"} justifyContent={'space-between'} alignItems={'flex-start'}>
            <MDTypography sx={{fontSize: "14px"}} mb={2}>Languages</MDTypography>
            {bid?.inspector?.languages?.length > 0 ? (
              <MDBox display={'flex'} gap={1}>
                {bid?.inspector?.languages.map((lang, index) => (
                  <MDTypography key={index} sx={{fontSize: "18px", color: '#767977'}}>{lang.name} </MDTypography>
                ))}
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
        <Grid item xs={12}>
          <MDTypography sx={{fontSize: "14px"}} my={2}>Portfolio link</MDTypography>
          <MDTypography
            sx={{fontSize: "18px", color: '#767977', cursor: 'pointer'}}
            onClick={() => window.open(bid?.inspector?.user?.website, '_blank')}
          >{bid?.inspector?.user?.website}</MDTypography>
        </Grid>
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
        <Grid item xs={12}>
          <MDBox borderTop={"1px solid #ccc"}>
            <MDTypography sx={{fontSize: "20px", color: '#006E90'}} my={2}>Note</MDTypography>
            <MDTypography>{bid?.note}</MDTypography>
          </MDBox>
        </Grid>
      </Grid>
      <MDBox borderTop={"1px solid #ccc"} mt={3}>
        <MDBox display={'flex'} justifyContent={'flex-end'} gap={2} marginTop={'20px'} marginBottom={'20px'}>
          {bid?.status === 'pending' && <MDButton
            color={'primary'}
            disabled={loading}
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
        </DialogContent>
        <DialogActions sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Box sx={{display: 'flex', justifyContent: 'flex-start', flexGrow: 1}}>
            <MDButton
              variant="outlined"
              onClick={handleCloseModal}
              color={'secondary'}
            >
              Cancel
            </MDButton>
          </Box>
          <MDButton
            onClick={handleAction}
            color={'error'}
          >
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}

export default BidDetail;
