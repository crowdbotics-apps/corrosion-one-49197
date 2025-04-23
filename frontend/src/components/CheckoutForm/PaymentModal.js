import {Elements, PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {loadStripe} from "@stripe/stripe-js";
import {useState} from "react";
import {showMessage} from "../../services/helpers";
import MDBox from "@mui/material/Box";

export default function PaymentModal({ open, onClose, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  if (!clientSecret) return null;                 // still loading

  const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

  const stripeInstance = loadStripe(stripePublicKey);

  const options = { clientSecret };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href
      },
      redirect: 'if_required'
    });

    if (error) {
      showMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      showMessage('Payment succeeded!', 'success');
    } else {
      showMessage('Status: ' + paymentIntent.status);
    }
    setLoading(false);
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ pt: 3 }}>
      <MDBox mb={2}>
        <h2>Payment</h2>
        <p>Please choose a payment method to proceed.</p>
      </MDBox>
        <Elements stripe={stripeInstance} options={options}>
          <form onSubmit={handleSubmit} style={{ maxWidth: 450, margin: '0 auto' }}>
            <PaymentElement />
            <button
              disabled={loading || !stripe || !elements}
              style={{ marginTop: 40, width: '100%', padding: 12 }}
            >
              {loading ? 'Processing…' : 'Pay'}
            </button>
          </form>
        </Elements>
      </DialogContent>
    </Dialog>
  );
}
