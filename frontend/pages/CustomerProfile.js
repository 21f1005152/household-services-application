import CustomerCard from '../components/CustomerCard.js';

export default {
    components: {
        CustomerCard, // Reuse the UserCard component
    },
    template: `
    <div class="container mt-5">
        <h2 class="text-center">My Profile</h2>

        <!-- Display User Profile -->
        <div class="row justify-content-center mt-4">
            <div class="col-md-8">
                <CustomerCard :user="user" />
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
                                <label for="address" class="form-label text-secondary">Address</label>
                                <input 
                                    type="text" 
                                    id="address" 
                                    v-model="form.address" 
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
                                    v-model="form.city" 
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
                                    v-model="form.pin_code" 
                                    class="form-control border-secondary" 
                                    placeholder="Enter your pin code" 
                                    required
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
                address: '',
                city: '',
                pin_code: '',
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
                this.user = userData; // Pass data to UserCard
                if (userData.customer_details) {
                    this.form.phone = userData.customer_details.phone || '';
                    this.form.address = userData.customer_details.address || '';
                    this.form.city = userData.customer_details.city || '';
                    this.form.pin_code = userData.customer_details.pin_code || '';
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                alert('An error occurred while fetching your profile.');
            }
        },
        async updateProfile() {
            try {
                const res = await fetch('api/users/update-details', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                    body: JSON.stringify({
                        phone: this.form.phone,
                        address: this.form.address,
                        city: this.form.city,
                        pin_code: this.form.pin_code,
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