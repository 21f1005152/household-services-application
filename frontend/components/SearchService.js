export default {
    template: `
      <div>
        <div class="row mb-4">
          <!-- Search by Name or Description -->
          <div class="col-md-4">
            <input
              type="text"
              class="form-control"
              placeholder="Search for a service by name or description"
              v-model="searchQuery"
              @input="filterServices"
            />
          </div>
  
          <!-- Minimum Price -->
          <div class="col-md-3">
            <input
              type="number"
              class="form-control"
              placeholder="Min Price"
              v-model.number="minPrice"
              @input="filterServices"
            />
          </div>
  
          <!-- Maximum Price -->
          <div class="col-md-3">
            <input
              type="number"
              class="form-control"
              placeholder="Max Price"
              v-model.number="maxPrice"
              @input="filterServices"
            />
          </div>
  
          <!-- Clear Button -->
          <div class="col-md-2">
            <button class="btn btn-secondary w-100" @click="clearSearch">Clear Search</button>
          </div>
        </div>
  
        <div class="row mt-3 g-3">
          <div v-for="service in filteredServices" :key="service.id" class="col-md-4">
            <div class="card shadow-sm border-0">
              <div class="card-body">
                <h5 class="card-title">{{ service.name }}</h5>
                <p>{{ service.description }}</p>
                <p><strong>Price:</strong> {{ service.base_price }}</p>
                <div class="d-grid">
                  <button
                    class="btn btn-primary btn-sm"
                    @click="requestService(service.id)"
                  >
                    Request Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-if="filteredServices.length === 0" class="text-center mt-3">No services found.</p>
      </div>
    `,
    data() {
      return {
        searchQuery: '',
        minPrice: null,
        maxPrice: null,
        services: [],
        filteredServices: [],
      };
    },
    methods: {
      async fetchServices() {
        try {
          const res = await fetch('/api/services', { method: 'GET' });
          if (!res.ok) throw new Error('Failed to fetch services.');
          this.services = await res.json();
          this.filteredServices = this.services; // Initialize filtered list
        } catch (error) {
          console.error('Error fetching services:', error);
          alert('An error occurred while fetching available services.');
        }
      },
      filterServices() {
        const query = this.searchQuery.trim().toLowerCase();
        this.filteredServices = this.services.filter((service) => {
          const matchesQuery =
            service.name.toLowerCase().includes(query) ||
            service.description.toLowerCase().includes(query);
          const matchesMinPrice = this.minPrice === null || service.base_price >= this.minPrice;
          const matchesMaxPrice = this.maxPrice === null || service.base_price <= this.maxPrice;
          return matchesQuery && matchesMinPrice && matchesMaxPrice;
        });
      },
      clearSearch() {
        this.searchQuery = '';
        this.minPrice = null;
        this.maxPrice = null;
        this.filteredServices = this.services;
      },
      requestService(serviceId) {
        this.$emit('request', serviceId);
      },
    },
    mounted() {
      this.fetchServices();
    },
  };