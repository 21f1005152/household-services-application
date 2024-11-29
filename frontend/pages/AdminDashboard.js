import UserCard from '../components/UserCard.js'; // Import the reusable UserCard component

export default {
    components: {
        UserCard,
    },
    template: `
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6 text-center">
                <div class="card shadow-sm border-0 mb-4" style="background-color: #f8f9fa;">
                    <div class="card-body">
                        <h1 class="card-title text-dark">Hi Admin!</h1>
                        <p class="text-secondary">Welcome to the admin dashboard.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Manage Users Section -->
        <div class="row">
            <div class="col-12 text-center mb-4">
                <h2>Manage Users</h2>
            </div>
        </div>
        <div class="row">
            <!-- Customers Column -->
            <div class="col-md-6">
                <h3 class="text-center text-primary mb-4">Customers</h3>
                <div v-for="user in customers" :key="user.id" class="mb-3">
                    <UserCard :user="user" />
                    <div class="d-flex justify-content-center gap-2 mt-2">
                        <button
                            class="btn btn-sm"
                            :class="getButtonClass(user)"
                            :disabled="loadingUser === user.id"
                            @click="toggleActiveStatus(user)"
                        >
                            {{ loadingUser === user.id ? 'Processing...' : getButtonText(user) }}
                        </button>
                    </div>
                </div>
            </div>
            <!-- Service Providers Column -->
            <div class="col-md-6">
                <h3 class="text-center text-success mb-4">Service Providers</h3>
                <div v-for="user in serviceProviders" :key="user.id" class="mb-3">
                    <UserCard :user="user" />
                    <div class="d-flex justify-content-center gap-2 mt-2">
                        <button
                            v-if="!user.service_provider_details?.verified"
                            class="btn btn-sm btn-primary"
                            :disabled="loadingUser === user.id"
                            @click="verifyUser(user)"
                        >
                            {{ loadingUser === user.id ? 'Verifying...' : 'Verify' }}
                        </button>
                        <button
                            class="btn btn-sm"
                            :class="getButtonClass(user)"
                            :disabled="loadingUser === user.id"
                            @click="toggleActiveStatus(user)"
                        >
                            {{ loadingUser === user.id ? 'Processing...' : getButtonText(user) }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            users: [],
            loadingUser: null, // Track the user ID currently being processed
            baseURL: '/api/users', // Base URL for all user-related API calls
        };
    },
    computed: {
        customers() {
            return this.users.filter(user => user.roles.includes('customer'));
        },
        serviceProviders() {
            return this.users.filter(user => user.roles.includes('service_provider'));
        },
    },
    mounted() {
        this.checkAdminRole();
        this.fetchUsers();
    },
    methods: {
        checkAdminRole() {
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user || user.role !== 'admin') {
                alert('Access denied. Admins only.');
                this.$router.push('/login');
            }
        },
        async fetchUsers() {
            try {
                const res = await fetch(`${this.baseURL}`); // Use base URL
                if (!res.ok) throw new Error('Failed to fetch users');
                this.users = await res.json();
            } catch (error) {
                console.error('Error fetching users:', error);
                alert('Unable to load users. Please try again later.');
            }
        },
        async verifyUser(user) {
            this.loadingUser = user.id; // Set loading state
            try {
                const endpoint = `${this.baseURL}/${user.id}/verify`;
                const res = await fetch(endpoint, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!res.ok) {
                    const errorDetails = await res.json();
                    console.error('Verification error:', errorDetails);
                    throw new Error(errorDetails.message || 'Failed to verify service provider');
                }

                alert('Service provider has been verified successfully.');
                user.service_provider_details.verified = 1; // Update local state
            } catch (error) {
                console.error('Error verifying service provider:', error);
                alert('An error occurred during verification. Please try again.');
            } finally {
                this.loadingUser = null; // Reset loading state
            }
        },
        async toggleActiveStatus(user) {
            this.loadingUser = user.id; // Set loading state
            try {
                const res = await fetch(`${this.baseURL}/${user.id}/flag-unflag`, {
                    method: 'PUT',
                });
                if (!res.ok) throw new Error('Failed to update user status');
                user.active = !user.active; // Toggle active state locally
                alert(`User has been ${user.active ? 'unflagged' : 'flagged'} successfully.`);
            } catch (error) {
                console.error('Error updating user status:', error);
                alert('An error occurred while updating user status. Please try again.');
            } finally {
                this.loadingUser = null; // Reset loading state
            }
        },
        getButtonClass(user) {
            return user.active ? 'btn-danger' : 'btn-success';
        },
        getButtonText(user) {
            return user.active ? 'Flag' : 'Unflag';
        },
    },
};