export default {
    template: `
    <div class="container mt-5">
        <h2 class="text-center mb-4">Service Provider History</h2>

        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center">
            <p>Loading your completed service history...</p>
        </div>

        <!-- No Data Message -->
        <div v-if="!loading && completedRequests.length === 0" class="text-center">
            <p>No completed service requests found.</p>
        </div>

        <!-- Completed Requests Table -->
        <div v-if="!loading && completedRequests.length > 0" class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Request ID</th>
                        <th>Time</th>
                        <th>Service Name</th>
                        <th>Remarks</th>
                        <th>User Details</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="request in completedRequests" :key="request.id">
                        <td>{{ request.id }}</td>
                        <td>{{ formatDate(request.time_of_request) }}</td>
                        <td>{{ request.service_name || 'Unknown Service' }}</td>
                        <td>{{ request.remarks }}</td>
                        <td>
                            <div v-if="request.customer">
                                <p><strong>Name:</strong> {{ request.customer.name }}</p>
                                <p><strong>Email:</strong> {{ request.customer.email }}</p>
                                <p><strong>Phone:</strong> {{ request.customer.customer_details?.phone || 'N/A' }}</p>
                            </div>
                            <p v-else>No customer details available</p>
                        </td>
                        <td>{{ request.rating || 'Not Rated' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `,
    data() {
        return {
            completedRequests: [], // Store completed service requests
            loading: true, // Loading indicator
        };
    },
    methods: {
        async fetchCompletedRequests() {
            try {
                const res = await fetch('/api/service-requests/provider/completed', {
                    method: 'GET',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                });
                if (!res.ok) throw new Error('Failed to fetch service requests.');

                const requests = await res.json();

                // Enhance requests with additional details
                this.completedRequests = await Promise.all(
                    requests.map(async (request) => {
                        // Fetch service name
                        const serviceRes = await fetch(`/api/services/${request.service_id}`, {
                            method: 'GET',
                            headers: {
                                'Authentication-Token': this.$store.state.auth_token,
                            },
                        });
                        if (serviceRes.ok) {
                            const service = await serviceRes.json();
                            request.service_name = service.name;
                        }

                        // Fetch customer details
                        const customerRes = await fetch(`/api/users/${request.customer_id}`, {
                            method: 'GET',
                            headers: {
                                'Authentication-Token': this.$store.state.auth_token,
                            },
                        });
                        if (customerRes.ok) {
                            request.customer = await customerRes.json();
                        }

                        return request;
                    })
                );
            } catch (error) {
                console.error('Error fetching service history:', error);
                alert('An error occurred while fetching service history.');
            } finally {
                this.loading = false;
            }
        },
        formatDate(datetime) {
            const date = new Date(datetime);
            return date.toLocaleString(); // Format: "MM/DD/YYYY, HH:MM AM/PM"
        },
    },
    mounted() {
        this.fetchCompletedRequests();
    },
};