
import React, {useEffect, useRef, useState} from "react";
import {loadStripe} from "@stripe/stripe-js";


import {CardElement, Elements, useElements, useStripe} from "@stripe/react-stripe-js";
import PaymentInner from "./paymmentInner";

const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

const stripeInstance = loadStripe(stripePublicKey);

console.log('stripeInstance ', stripeInstance);

function Payment() {
  return (
    <Elements stripe={stripeInstance}>
      <PaymentInner/>
    </Elements>
  );
}

export default Payment;
