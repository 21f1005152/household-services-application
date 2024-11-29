export default {
    template: `
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow-sm border-0" style="background-color: #f8f9fa;">
                    <div class="card-body">
                        <h3 class="card-title text-center mb-4 text-dark">Customer Information</h3>
                        <form @submit.prevent="submitCustomerInfo">
                            <div class="mb-3">
                                <label for="phone" class="form-label text-secondary">Phone</label>
                                <input 
                                    type="text" 
                                    id="phone" 
                                    v-model="phone" 
                                    class="form-control border-secondary" 
                                    placeholder="Enter your phone number" 
                                    required 
                                />
                            </div>
                            <div class="mb-3">
                                <label for="address" class="form-label text-secondary">Address</label>
                                <input 
                                    type="text" 
                                    id="address" 
                                    v-model="address" 
                                    class="form-control border-secondary" 
                                    placeholder="Enter your address" 
                                    required 
                                />
                            </div>
                            <div class="mb-3">
                                <label for="city" class="form-label text-secondary">City</label>
                                <input 
                                    type="text" 
                                    id="city" 
                                    v-model="city" 
                                    class="form-control border-secondary" 
                                    placeholder="Enter your city" 
                                    required 
                                />
                            </div>
                            <div class="mb-3">
                                <label for="pin_code" class="form-label text-secondary">Pin Code</label>
                                <input 
                                    type="text" 
                                    id="pin_code" 
                                    v-model="pin_code" 
                                    class="form-control border-secondary" 
                                    placeholder="Enter your pin code" 
                                    required 
                                />
                            </div>
                            <div class="d-grid">
                                <button class="btn btn-dark" type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            phone: "",
            address: "",
            city: "",
            pin_code: "",
        };
    },
    methods: {
        async submitCustomerInfo() {
            try {
                const res = await fetch(location.origin + '/register/customer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone: this.phone,
                        address: this.address,
                        city: this.city,
                        pin_code: this.pin_code,
                    }),
                });

                if (!res.ok) {
                    const errorDetails = await res.json();
                    console.error('Customer info submission failed:', errorDetails);
                    return;
                }

                const data = await res.json();
                console.log('Customer Info Submitted:', data);
            } catch (error) {
                console.error('Error during customer info submission:', error);
            }
        },
    },
};