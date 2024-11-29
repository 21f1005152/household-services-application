import CustomerCard from '../components/CustomerCard.js';
import ServiceProviderCard from '../components/ServiceProviderCard.js';

export default {
    components: {
        CustomerCard,
        ServiceProviderCard,
    },
    template: `
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6 text-center">
                <div class="card shadow-sm border-0 mb-4" style="background-color: #f8f9fa; border-radius: 15px;">
                    <div class="card-body">
                        <h1 class="card-title text-dark">Hi Admin!</h1>
                        <p class="text-secondary">Welcome to the admin dashboard. Manage users efficiently.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Search and User Toggle Section -->
        <div class="text-center mb-4">
            <button 
                class="btn btn-primary me-3" 
                @click="toggleView('customers')"
                :class="{ 'btn-dark': view === 'customers' }"
            >
                Customers
            </button>
            <button 
                class="btn btn-success" 
                @click="toggleView('serviceProviders')"
                :class="{ 'btn-dark': view === 'serviceProviders' }"
            >
                Service Providers
            </button>
        </div>

        <!-- Search Input -->
        <div v-if="view" class="mb-4">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <input 
                        type="text" 
                        class="form-control" 
                        placeholder="Search by name, email, or phone" 
                        v-model="searchQuery" 
                        @input="filterUsers" 
                    />
                </div>
                <div class="col-md-2">
                    <button 
                        class="btn btn-secondary w-100" 
                        @click="clearSearch"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>

        <!-- Display Users -->
        <div v-if="view === 'customers'">
            <h3 class="text-center text-primary mb-4">Customers</h3>
            <div v-for="user in filteredUsers" :key="user.id" class="mb-4">
                <CustomerCard :user="user" />
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

        <div v-else-if="view === 'serviceProviders'">
            <h3 class="text-center text-success mb-4">Service Providers</h3>
            <div v-for="user in filteredUsers" :key="user.id" class="mb-4">
                <ServiceProviderCard 
                    :user="{
                        name: user.name,
                        email: user.email,
                        serviceProviderDetails: user.service_provider_details
                    }" 
                />
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

        <p v-if="filteredUsers.length === 0" class="text-center text-muted">No users found.</p>
    </div>
    `,
    data() {
        return {
            users: [],
            filteredUsers: [], // Users filtered by search or role
            loadingUser: null, // Track the user ID currently being processed
            view: '', // Current view: 'customers' or 'serviceProviders'
            searchQuery: '', // Query for search bar
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
                const res = await fetch(`${this.baseURL}`);
                if (!res.ok) throw new Error('Failed to fetch users');
                this.users = await res.json();
                this.filteredUsers = this.users; // Initialize filteredUsers
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
        toggleView(group) {
            this.view = this.view === group ? '' : group;
            if (this.view) {
                this.filteredUsers = this.view === 'customers' ? this.customers : this.serviceProviders;
                this.searchQuery = ''; // Reset search query
            }
        },
        filterUsers() {
            const query = this.searchQuery.trim().toLowerCase();
            const group = this.view === 'customers' ? this.customers : this.serviceProviders;
            this.filteredUsers = group.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                (user.service_provider_details?.phone || '').toLowerCase().includes(query)
            );
        },
        clearSearch() {
            this.searchQuery = '';
            this.filterUsers();
        },
    },
};