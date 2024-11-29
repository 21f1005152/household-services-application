export default {
    template: `
    <div class="container mt-5">
        <h2 class="text-center mb-4">Payment Portal</h2>
        <form @submit.prevent="processPayment">
            <div class="mb-3">
                <label for="cardName" class="form-label">Name on Card</label>
                <input 
                    type="text" 
                    class="form-control" 
                    id="cardName" 
                    v-model="paymentForm.cardName" 
                    required
                />
            </div>
            <div class="mb-3">
                <label for="cardNumber" class="form-label">Card Number</label>
                <input 
                    type="text" 
                    class="form-control" 
                    id="cardNumber" 
                    v-model="paymentForm.cardNumber" 
                    required
                    maxlength="16" 
                    minlength="16"
                    pattern="\\d{16}" 
                />
                <small class="form-text text-muted">Card number must be a 16-digit number.</small>
            </div>
            <div class="mb-3">
                <label for="cvv" class="form-label">CVV</label>
                <input 
                    type="text" 
                    class="form-control" 
                    id="cvv" 
                    v-model="paymentForm.cvv" 
                    required
                    maxlength="3" 
                    minlength="3"
                    pattern="\\d{3}"
                />
                <small class="form-text text-muted">CVV must be a 3-digit number.</small>
            </div>
            <div class="d-grid">
                <button type="submit" class="btn btn-success">Pay</button>
            </div>
        </form>
    </div>
    `,
    data() {
        return {
            paymentForm: {
                cardName: '',
                cardNumber: '',
                cvv: '',
            },
        };
    },
    methods: {
        async processPayment() {
            // Frontend Validation
            if (!/^\d{16}$/.test(this.paymentForm.cardNumber)) {
                alert('Card number must be a 16-digit number.');
                return;
            }
            if (!/^\d{3}$/.test(this.paymentForm.cvv)) {
                alert('CVV must be a 3-digit number.');
                return;
            }

            const requestId = this.$route.query.requestId;

            try {
                const res = await fetch(`/api/service-requests/${requestId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                    body: JSON.stringify({ 
                        status: 'paid',
                        cardDetails: this.paymentForm, // Send the card details to the backend for validation
                    }),
                });

                if (!res.ok) throw new Error('Payment processing failed.');
                alert('Payment successful. Request marked as "Paid".');
                this.$router.push('/customer-dashboard'); // Redirect back to dashboard
            } catch (error) {
                console.error('Error processing payment:', error);
                alert('An error occurred while processing the payment.');
            }
        },
    },
};