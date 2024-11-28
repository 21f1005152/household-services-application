export default {
    template: `
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow-sm border-0" style="background-color: #f8f9fa;">
                    <div class="card-body">
                        <h3 class="card-title text-center mb-4 text-dark">User Registration</h3>
                        <form @submit.prevent="submitRegistration">
                            <!-- Common Fields -->
                            <div class="mb-3">
                                <label for="name" class="form-label text-secondary">Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    v-model="name" 
                                    class="form-control border-secondary" 
                                    placeholder="Enter your name" 
                                    required 
                                />
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label text-secondary">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    v-model="email" 
                                    class="form-control border-secondary" 
                                    placeholder="Enter your email" 
                                    required 
                                />
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label text-secondary">Password</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    v-model="password" 
                                    class="form-control border-secondary" 
                                    placeholder="Enter your password" 
                                    required 
                                />
                            </div>
                            <div class="mb-3">
                                <label for="role" class="form-label text-secondary">Role</label>
                                <select 
                                    id="role" 
                                    v-model="role" 
                                    class="form-select border-secondary" 
                                    required>
                                    <option value="" disabled>Select a role</option>
                                    <option value="customer">Customer</option>
                                    <option value="service_provider">Service Provider</option>
                                </select>
                            </div>

                            <!-- Role-Specific Fields -->
                            <div v-if="role === 'customer'">
                                <h5 class="text-secondary mt-4">Customer Details</h5>
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
                            </div>

                            <div v-if="role === 'service_provider'">
                                <h5 class="text-secondary mt-4">Service Provider Details</h5>
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
                                    <label for="experience_years" class="form-label text-secondary">Experience Years</label>
                                    <input 
                                        type="number" 
                                        id="experience_years" 
                                        v-model="experience_years" 
                                        class="form-control border-secondary" 
                                        placeholder="Enter your years of experience" 
                                    />
                                </div>
                                <div class="mb-3">
                                    <label for="service_id" class="form-label text-secondary">Service</label>
                                    <select 
                                        id="service_id" 
                                        v-model="service_id" 
                                        class="form-select border-secondary" 
                                        required>
                                        <option value="" disabled>Select a service</option>
                                        <option v-for="service in services" :key="service.id" :value="service.id">
                                            {{ service.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="doc_link" class="form-label text-secondary">Document Link</label>
                                    <input 
                                        type="url" 
                                        id="doc_link" 
                                        v-model="doc_link" 
                                        class="form-control border-secondary" 
                                        placeholder="Provide a link to your document" 
                                    />
                                </div>
                            </div>

                            <div class="d-grid">
                                <button class="btn btn-dark" type="submit">Register</button>
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
            name: "",
            email: "",
            password: "",
            role: "",
            phone: "",
            address: "",
            city: "",
            pin_code: "",
            experience_years: null,
            service_id: null,
            doc_link: "",
            services: [], // Holds the list of services fetched from the API
        };
    },
    mounted() {
        this.fetchServices();
    },
    methods: {
        async fetchServices() {
            try {
                const res = await fetch('api/services');
                if (!res.ok) {
                    throw new Error('Failed to fetch services');
                }
                const data = await res.json();
                this.services = data; // Assign the list of services
                console.log('Services fetched:', this.services);
            } catch (err) {
                console.error('Error fetching services:', err);
                alert('An unexpected error occurred while fetching services.');
            }
        },
        async submitRegistration() {
            try {
                const res = await fetch('/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: this.name,
                        email: this.email,
                        password: this.password,
                        role: this.role,
                        phone: this.phone,
                        address: this.address,
                        city: this.city,
                        pin_code: this.pin_code,
                        experience_years: this.experience_years,
                        service_id: this.service_id,
                        doc_link: this.doc_link,
                    }),
                });

                const data = await res.json();
                if (!res.ok) {
                    alert(`Error: ${data.message}`);
                    return;
                }

                alert(data.message);
            } catch (err) {
                console.error(err);
                alert('An error occurred while submitting the form.');
            }
        },
    },
};