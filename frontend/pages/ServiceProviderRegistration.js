export default {
    template: `
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow-sm border-0" style="background-color: #f8f9fa;">
                    <div class="card-body">
                        <h3 class="card-title text-center mb-4 text-dark">Service Provider Information</h3>
                        <form @submit.prevent="submitServiceProviderInfo">
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
                            <div class="mb-3">
                                <label for="experience_years" class="form-label text-secondary">Years of Experience</label>
                                <input 
                                    type="number" 
                                    id="experience_years" 
                                    v-model="experience_years" 
                                    class="form-control border-secondary" 
                                    placeholder="Enter years of experience" 
                                    required 
                                />
                            </div>
                            <div class="mb-3">
                                <label for="doc_link" class="form-label text-secondary">Document Link</label>
                                <input 
                                    type="url" 
                                    id="doc_link" 
                                    v-model="doc_link" 
                                    class="form-control border-secondary" 
                                    placeholder="Provide a link to your document" 
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
            pin_code: "",
            experience_years: 0,
            doc_link: "",
        };
    },
    methods: {
        async submitServiceProviderInfo() {
            try {
                const res = await fetch(location.origin + '/register/service_provider', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone: this.phone,
                        pin_code: this.pin_code,
                        experience_years: this.experience_years,
                        doc_link: this.doc_link,
                    }),
                });

                if (!res.ok) {
                    const errorDetails = await res.json();
                    console.error('Service provider info submission failed:', errorDetails);
                    return;
                }

                const data = await res.json();
                console.log('Service Provider Info Submitted:', data);
            } catch (error) {
                console.error('Error during service provider info submission:', error);
            }
        },
    },
};