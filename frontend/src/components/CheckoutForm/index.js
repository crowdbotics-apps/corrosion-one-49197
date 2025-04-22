// CheckoutForm.jsx
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Manda al usuario a tu página “Gracias” si quieres redirigir
        return_url: window.location.origin + '/payment-success'
      },
      redirect: 'if_required'  // evita redirección en tarjetas/link simples
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Pago completado 🎉');
    } else {
      setMessage('Estado: ' + paymentIntent.status);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 450, margin: '0 auto' }}>
      <PaymentElement />
      <button
        disabled={loading || !stripe || !elements}
        style={{ marginTop: 20, width: '100%', padding: 12 }}
      >
        {loading ? 'Procesando…' : 'Pagar'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
