import ServiceProviderCard from "../components/ServiceProviderCard.js";

export default {
    components: {
        ServiceProviderCard,
    },
    template: `
    <div class="container mt-5">
        <h2 class="text-center mb-4">My Profile</h2>

        <!-- Display User Profile -->
        <div class="row justify-content-center mt-4">
            <div class="col-md-8">
                <ServiceProviderCard 
                    :user="{
                        name: user.name,
                        email: user.email,
                        serviceProviderDetails: {
                            phone: form.phone,
                            pinCode: form.pin_code,
                            experienceYears: form.experience_years,
                            docLink: form.doc_link
                        }
                    }" 
                />
            </div>
        </div>

        <!-- Edit Profile Form -->
        <div class="row justify-content-center mt-5">
            <div class="col-md-8">
                <div class="card shadow-sm border-0" style="background-color: #f8f9fa;">
                    <div class="card-body">
                        <h3 class="card-title text-center mb-4 text-dark">Edit Profile</h3>
                        <form @submit.prevent="updateProfile">
                            <div class="mb-3">
                                <label for="phone" class="form-label text-secondary">Phone</label>
                                <input 
                                    type="text" 
                                    id="phone" 
                                    v-model="form.phone" 
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
                                    v-model="form.pin_code" 
                                    class="form-control border-secondary" 
                                    placeholder="Enter your pin code" 
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <label for="experience_years" class="form-label text-secondary">Experience (Years)</label>
                                <input 
                                    type="number" 
                                    id="experience_years" 
                                    v-model="form.experience_years" 
                                    class="form-control border-secondary" 
                                    placeholder="Enter your experience in years" 
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <label for="doc_link" class="form-label text-secondary">Document Link</label>
                                <input 
                                    type="url" 
                                    id="doc_link" 
                                    v-model="form.doc_link" 
                                    class="form-control border-secondary" 
                                    placeholder="Enter document link" 
                                />
                            </div>
                            <div class="d-grid">
                                <button class="btn btn-dark" type="submit">Update Profile</button>
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
            user: {}, // User data
            form: {
                phone: '',
                pin_code: '',
                experience_years: '',
                doc_link: '',
            },
        };
    },
    methods: {
        async fetchUserProfile() {
            try {
                const userId = this.$store.state.user_id; // Get user ID from Vuex store
                const res = await fetch(`/api/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                });
                if (!res.ok) throw new Error('Failed to fetch user profile.');
                const userData = await res.json();
                this.user = userData; // Populate `user` with fetched data

                // Populate the form with service provider details
                const details = userData.service_provider_details || {};
                this.form.phone = details.phone || '';
                this.form.pin_code = details.pin_code || '';
                this.form.experience_years = details.experience_years || '';
                this.form.doc_link = details.doc_link || '';
            } catch (error) {
                console.error('Error fetching user profile:', error);
                alert('An error occurred while fetching your profile.');
            }
        },
        async updateProfile() {
            try {
                const res = await fetch('/api/users/update-details', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                    body: JSON.stringify({
                        phone: this.form.phone,
                        pin_code: this.form.pin_code,
                        experience_years: this.form.experience_years,
                        doc_link: this.form.doc_link,
                    }),
                });
                if (!res.ok) {
                    const error = await res.json();
                    alert(error.message || 'Failed to update profile.');
                    return;
                }
                alert('Profile updated successfully.');
                this.fetchUserProfile(); // Refresh profile data
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('An error occurred while updating your profile.');
            }
        },
    },
    mounted() {
        this.fetchUserProfile();
    },
};