import { useState } from 'react';
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import axios from '../api/axios'; 

const CARD_ELEMENT_OPTIONS = {  
    style: {
        base: {
            color: '#303238', 
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif', 
            fontSmoothing: 'antialiased',
            '::placeholder': {
                color: '#CFD7DF', 
            },
            padding: '10px 14px', 
            border: '1px solid #ced4da',  
            borderRadius: '4px',          
            boxShadow: '0 0 0 0.5px rgba(50, 50, 93, 0.1),0 2px 5px 0 rgba(50, 50, 93, 0.1), 0 1px 1.5px 0 rgba(0, 0, 0, 0.07)',
        },
        invalid: {
            color: '#E24F5F', 
            ':focus': {
                color: '#303238',
            },
        },
    },
    hidePostalCode: true, 
};

const PaymentForm = ({ amount, carDetails, bookingDetails, uid, sid, onSuccess }) => {
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        try {
            const { data } = await axios.post('/create-payment-intent', {
                amount,
                carDetails,
                bookingDetails,
                uid,
                sid
            });

            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                data.clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: {
                            name: event.target.name.value,
                        },
                    },
                },
            );

            if (stripeError) {
                setError(stripeError.message);
                setProcessing(false)
                console.log(stripeError.message)

                return;

            }

            const metadata = {
                amount,
                carDetails,
                bookingDetails,
                uid,
                sid
            };
            const paymentIntentnew = {
                ...paymentIntent,
                metadata
            };

            onSuccess(paymentIntentnew)  
        } catch (err) {
            setError("Payment failed, Try again");
            console.log(err.message)
            setProcessing(false)
            return;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            <button
                disabled={processing || !stripe || !elements}
                className="pay-button" 
                type="submit"
            >

                {processing ? (<>
                    <div className="inline-block w-4 h-4 border-current border-2 border-t-transparent rounded-full animate-spin" role="status" aria-label="loading">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <span className="ml-2">Processing Payment...</span>

                </>) : (
                    "Pay now"
                )}
            </button>

            {error && (
                <div className="card-error" role="alert">
                    {error}
                </div>
            )}
        </form>
    );
};

export default PaymentForm;