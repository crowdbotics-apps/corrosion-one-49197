import { Elements } from '@stripe/react-stripe-js';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckoutForm from "./index";
import {loadStripe} from "@stripe/stripe-js";

export default function PaymentModal({ open, onClose, clientSecret }) {
  if (!clientSecret) return null;                 // still loading

  const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

  const stripeInstance = loadStripe(stripePublicKey);

  const options = { clientSecret };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ pt: 6 }}>
        <Elements stripe={stripeInstance} options={options}>
          <CheckoutForm onPaid={onClose} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}
