import UserCard from '../components/CustomerCard.js';

export default {
    components: {
        UserCard,
    },
    template: `
    <div class="container mt-5">
        <h2 class="text-center mb-4">Service Provider Dashboard</h2>

        <!-- Accepted Requests Section -->
        <div class="mt-4">
            <h3 class="text-success text-center">Accepted Requests</h3>
            <div class="row mt-3 g-3">
                <div 
                    v-for="request in acceptedRequests" 
                    :key="request.id" 
                    class="col-md-6"
                >
                    <div 
                        class="card shadow-sm border-0" 
                        style="background-color: #f0fdf4;"
                    >
                        <div class="card-body">
                            <h5 class="card-title">Request ID: {{ request.id }}</h5>
                            <p><strong>Remarks:</strong> {{ request.remarks }}</p>
                            <p><strong>Time of Request:</strong> {{ formatDate(request.time_of_request) }}</p>
                            <p><strong>Status:</strong> {{ request.status }}</p>
                            <div v-if="request.customer">
                                <h6 class="text-secondary mt-4">Customer Details</h6>
                                <UserCard :user="request.customer" />
                            </div>
                            <div v-else>
                                <p class="text-warning">Customer details are unavailable.</p>
                            </div>
                            <div class="d-grid mt-3">
                                <button 
                                    class="btn btn-danger btn-sm"
                                    @click="cancelRequest(request.id)"
                                >
                                    Cancel Service
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p v-if="acceptedRequests.length === 0" class="text-center mt-3">No accepted requests found.</p>
        </div>

        <!-- Pending Requests Section -->
        <div class="mt-5">
            <h3 class="text-primary text-center">Pending Requests</h3>
            <div class="row mt-3 g-3">
                <div 
                    v-for="request in pendingRequests" 
                    :key="request.id" 
                    class="col-md-6"
                >
                    <div 
                        class="card shadow-sm border-0" 
                        style="background-color: #f8f9fa;"
                    >
                        <div class="card-body">
                            <h5 class="card-title">Request ID: {{ request.id }}</h5>
                            <p><strong>Remarks:</strong> {{ request.remarks }}</p>
                            <p><strong>Time of Request:</strong> {{ formatDate(request.time_of_request) }}</p>
                            <p><strong>Status:</strong> {{ request.status }}</p>
                            <div v-if="request.customer">
                                <h6 class="text-secondary mt-4">Customer Details</h6>
                                <UserCard :user="request.customer" />
                            </div>
                            <div v-else>
                                <p class="text-warning">Customer details are unavailable.</p>
                            </div>
                            <div class="d-grid mt-3">
                                <button 
                                    class="btn btn-success btn-sm" 
                                    @click="acceptRequest(request.id)"
                                    :disabled="request.status === 'accepted'"
                                >
                                    Accept Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p v-if="pendingRequests.length === 0" class="text-center mt-3">No pending requests found.</p>
        </div>
    </div>
    `,
    data() {
        return {
            pendingRequests: [],
            acceptedRequests: [],
        };
    },
    methods: {
        async fetchPendingRequests() {
            try {
                const res = await fetch('/api/service-requests/provider', {
                    method: 'GET',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                });
                if (!res.ok) throw new Error('Failed to fetch pending service requests.');
                const requests = await res.json();
                this.pendingRequests = await this.fetchCustomerDetails(requests);
            } catch (error) {
                console.error('Error fetching pending service requests:', error);
                alert('An error occurred while fetching pending service requests.');
            }
        },
        async fetchAcceptedRequests() {
            try {
                const res = await fetch('/api/service-requests/provider/accepted', {
                    method: 'GET',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                });
                if (!res.ok) throw new Error('Failed to fetch accepted service requests.');
                const requests = await res.json();
                this.acceptedRequests = await this.fetchCustomerDetails(requests);
            } catch (error) {
                console.error('Error fetching accepted service requests:', error);
                alert('An error occurred while fetching accepted service requests.');
            }
        },
        async fetchCustomerDetails(requests) {
            return Promise.all(
                requests.map(async (request) => {
                    try {
                        const customerRes = await fetch(`/api/users/${request.customer_id}`, {
                            method: 'GET',
                            headers: {
                                'Authentication-Token': this.$store.state.auth_token,
                            },
                        });
                        if (customerRes.ok) {
                            const customer = await customerRes.json();
                            request.customer = customer;
                        } else {
                            request.customer = null;
                        }
                    } catch (error) {
                        console.error(`Error fetching customer details for ID: ${request.customer_id}`, error);
                        request.customer = null;
                    }
                    return request;
                })
            );
        },
        async acceptRequest(requestId) {
            try {
                const res = await fetch(`/api/service-requests/provider/${requestId}`, {
                    method: 'PUT',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                });
                if (!res.ok) {
                    const error = await res.json();
                    alert(error.message || 'Failed to accept service request.');
                    return;
                }
                alert('Service request accepted successfully.');
                this.fetchPendingRequests();
                this.fetchAcceptedRequests();
            } catch (error) {
                console.error('Error accepting service request:', error);
                alert('An error occurred while accepting the service request.');
            }
        },
        async cancelRequest(requestId) {
            try {
                const res = await fetch(`/api/service-requests/provider/${requestId}/cancel`, {
                    method: 'PUT',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                });
                if (!res.ok) {
                    const error = await res.json();
                    alert(error.message || 'Failed to cancel service request.');
                    return;
                }
                alert('Service request cancelled successfully.');
                this.fetchAcceptedRequests();
            } catch (error) {
                console.error('Error cancelling service request:', error);
                alert('An error occurred while cancelling the service request.');
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString();
        },
    },
    mounted() {
        this.fetchPendingRequests();
        this.fetchAcceptedRequests();
    },
};