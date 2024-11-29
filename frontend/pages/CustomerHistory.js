export default {
    template: `
      <div class="container mt-5">
          <h2 class="text-center mb-4">Customer History</h2>
  
          <div v-if="loading" class="text-center">
              <p>Loading your service history...</p>
          </div>
  
          <div v-if="!loading && paidRequests.length === 0" class="text-center">
              <p>No service history available.</p>
          </div>
  
          <div v-if="!loading && paidRequests.length > 0" class="table-responsive">
              <table class="table table-striped table-bordered">
                  <thead>
                      <tr>
                          <th>Request ID</th>
                          <th>Service Name</th>
                          <th>Remarks</th>
                          <th>Time of Request</th>
                          <th>Service Provider</th>
                          <th>Rating</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="request in paidRequests" :key="request.id">
                          <td>{{ request.id }}</td>
                          <td>{{ request.service_name || 'Unknown Service' }}</td>
                          <td>{{ request.remarks }}</td>
                          <td>{{ formatDate(request.time_of_request) }}</td>
                          <td>
                              <div v-if="request.service_provider">
                                  <p><strong>Name:</strong> {{ request.service_provider.name }}</p>
                                  <p><strong>Phone:</strong> {{ request.service_provider.phone }}</p>
                                  <p><strong>Experience:</strong> {{ request.service_provider.experience_years }} years</p>
                                  <p><a :href="request.service_provider.doc_link" target="_blank">View Document</a></p>
                              </div>
                              <p v-else>No provider assigned</p>
                          </td>
                          <td>
                          <select 
                            class="form-select" 
                            v-model="request.ratings" 
                            @change="submitRating(request)"
                        >
                            <option disabled value="">Rate</option>
                            <option v-for="n in 5" :value="n" :key="n">{{ n }}</option>
                        </select>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
    `,
    data() {
      return {
        serviceRequests: [], // List of all service requests
        loading: true, // Loading state
      };
    },
    computed: {
      paidRequests() {
        // Filter only requests with a 'paid' status
        return this.serviceRequests.filter((request) => request.status === 'paid');
      },
    },
    methods: {
        async fetchServiceRequests() {
            try {
                const res = await fetch('/api/service-requests', {
                    method: 'GET',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                });
                if (!res.ok) throw new Error('Failed to fetch service requests.');
        
                const requests = await res.json();
                this.serviceRequests = await Promise.all(
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
                        } else {
                            request.service_name = 'Unknown';
                        }
        
                        // Assign the ratings value if it exists
                        request.ratings = request.ratings || ''; // Default to an empty string if no rating exists
                        return request;
                    })
                );
            } catch (error) {
                console.error('Error fetching service history:', error);
                alert('An error occurred while fetching your service history.');
            } finally {
                this.loading = false;
            }
        },
      formatDate(datetime) {
        const date = new Date(datetime);
        return date.toLocaleString(); // Example: "11/30/2024, 3:45 PM"
      },
      async submitRating(request) {
        try {
            const res = await fetch(`/api/service-requests/${request.id}/rating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token,
                },
                body: JSON.stringify({ ratings: request.ratings }),
            });
            if (!res.ok) throw new Error('Failed to submit rating.');
            alert('Rating submitted successfully.');
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('An error occurred while submitting your rating.');
        }
    },
    },
    mounted() {
      this.fetchServiceRequests();
    },
  };