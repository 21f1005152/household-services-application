import SearchService from '../components/SearchService.js';

export default {
  components: {
    SearchService,
  },
  template: `
    <div class="container mt-5">
      <h2 class="text-center mb-4">Customer Dashboard</h2>

      <!-- My Service Requests Section -->
      <div class="mt-4">
        <h3 class="text-primary text-center">My Service Requests</h3>
        <div class="row mt-3 g-3">
          <div 
            v-for="request in filteredServiceRequests" 
            :key="request.id" 
            class="col-md-4"
          >
            <div 
              class="card shadow-sm border-0" 
              :style="{ backgroundColor: request.status === 'accepted' ? 'rgba(255, 255, 0, 0.2)' : '#f8f9fa' }"
            >
              <div class="card-body">
                <h5 class="card-title">Service Request #{{ request.id }}</h5>
                <p><strong>Service:</strong> {{ request.service_name || 'Fetching...' }}</p>
                <p><strong>Status:</strong> {{ request.status }}</p>
                <p><strong>Remarks:</strong> {{ request.remarks }}</p>
                <p><strong>Time of Request:</strong> {{ formatDate(request.time_of_request) }}</p>
                <div class="d-flex justify-content-between mt-3">
                  <button 
                    class="btn btn-sm btn-danger"
                    @click="cancelServiceRequest(request.id)"
                    v-if="request.status === 'pending'"
                  >
                    Cancel Request
                  </button>
                  <button 
                    class="btn btn-sm btn-success"
                    @click="goToPaymentPage(request.id)"
                    v-if="request.status === 'accepted'"
                  >
                    Complete and Pay
                  </button>
                  <button 
                    class="btn btn-sm btn-warning"
                    @click="editServiceRequest(request)"
                    v-if="request.status === 'pending'"
                  >
                    Edit Request
                  </button>
                  <button 
                    class="btn btn-sm btn-info"
                    @click="viewServiceProvider(request)"
                    v-if="request.status === 'accepted'"
                  >
                    View Service Provider
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-if="filteredServiceRequests.length === 0" class="text-center mt-3">No service requests found.</p>
      </div>

      <!-- Available Services Section -->
      <div class="mt-5">
        <h3 class="text-success text-center">Available Services</h3>
        
        <!-- Search Services -->
        <div class="my-3">
          <SearchService @request="createServiceRequest" />
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      serviceRequests: [],
    };
  },
  computed: {
    filteredServiceRequests() {
      return this.serviceRequests.filter(
        (request) => request.status === 'pending' || request.status === 'accepted'
      );
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

        // Fetch service names
        this.serviceRequests = await Promise.all(
          requests.map(async (request) => {
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
            return request;
          })
        );
      } catch (error) {
        console.error('Error fetching service requests:', error);
        alert('An error occurred while fetching your service requests.');
      }
    },
    async createServiceRequest(serviceId) {
      const remarks = prompt('Enter remarks for the service request:');
      if (!remarks) return;

      try {
        const res = await fetch('/api/service-requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.$store.state.auth_token,
          },
          body: JSON.stringify({ service_id: serviceId, remarks }),
        });
        if (!res.ok) {
          const error = await res.json();
          alert(error.message || 'Failed to create service request.');
          return;
        }
        alert('Service request created successfully.');
        this.fetchServiceRequests();
      } catch (error) {
        console.error('Error creating service request:', error);
        alert('An error occurred while creating the service request.');
      }
    },
    formatDate(datetime) {
      const date = new Date(datetime);
      return date.toLocaleString(); // Example: "11/30/2024, 3:45 PM"
    },
    async cancelServiceRequest(requestId) {
      try {
        const res = await fetch(`/api/service-requests/${requestId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.$store.state.auth_token,
          },
          body: JSON.stringify({ status: 'cancelleduser' }),
        });
        if (!res.ok) throw new Error('Failed to cancel service request.');
        alert('Service request canceled successfully.');
        this.fetchServiceRequests();
      } catch (error) {
        console.error('Error canceling service request:', error);
        alert('An error occurred while canceling the service request.');
      }
    },
  },
  mounted() {
    this.fetchServiceRequests();
  },
};