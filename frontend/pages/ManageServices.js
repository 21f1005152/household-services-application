export default {
    template: `
    <div class="container mt-5">
        <h2 class="text-center">Manage Services</h2>
        <div class="d-flex justify-content-end mb-3">
            <button class="btn btn-success btn-sm" @click="showAddServiceForm = !showAddServiceForm">
                {{ showAddServiceForm ? 'Close' : 'Add New Service' }}
            </button>
        </div>

        <!-- Add Service Form -->
        <div v-if="showAddServiceForm" class="mb-4">
            <h4>Add Service</h4>
            <form @submit.prevent="addService">
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" v-model="form.name" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <textarea v-model="form.description" class="form-control" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="base_price" class="form-label">Base Price</label>
                    <input type="number" v-model="form.base_price" class="form-control" required min="0" />
                </div>
                <button type="submit" class="btn btn-primary btn-sm">Add Service</button>
            </form>
        </div>

        <!-- Services Table -->
        <div v-if="services.length > 0" class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Base Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="service in services" :key="service.id">
                        <td>{{ service.name }}</td>
                        <td>{{ service.description }}</td>
                        <td>{{ service.base_price }}</td>
                        <td>
                            <button class="btn btn-warning btn-sm me-2" @click="editService(service)">Edit</button>
                            <button class="btn btn-danger btn-sm" @click="deleteService(service.id)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <p class="text-center">No services available. Add some!</p>
        </div>

        <!-- Edit Service Form -->
        <div v-if="showEditForm" class="mt-4">
            <h4>Edit Service</h4>
            <form @submit.prevent="updateService">
                <div class="mb-3">
                    <label for="editName" class="form-label">Name</label>
                    <input type="text" v-model="form.name" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label for="editDescription" class="form-label">Description</label>
                    <textarea v-model="form.description" class="form-control" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="editBasePrice" class="form-label">Base Price</label>
                    <input type="number" v-model="form.base_price" class="form-control" required min="0" />
                </div>
                <button type="submit" class="btn btn-primary btn-sm">Update Service</button>
                <button type="button" class="btn btn-secondary btn-sm" @click="resetForm">Cancel</button>
            </form>
        </div>
    </div>
    `,
    data() {
        return {
            services: [], // List of services
            form: {
                id: null,
                name: '',
                description: '',
                base_price: null,
            }, // Form data for adding or editing services
            showAddServiceForm: false,
            showEditForm: false,
        };
    },
    methods: {
        async fetchServices() {
            try {
                const res = await fetch('api/services', {
                    method: 'GET',
                });
                if (!res.ok) throw new Error('Failed to fetch services.');
                this.services = await res.json();
            } catch (error) {
                console.error('Error fetching services:', error);
                alert('An error occurred while fetching services.');
            }
        },
        async addService() {
            try {
                const token = this.$store.state.auth_token;
                if (!token) {
                    alert('You must be logged in to perform this action.');
                    return;
                }

                const res = await fetch('api/services', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': token,
                    },
                    body: JSON.stringify(this.form),
                });

                if (!res.ok) {
                    const data = await res.json();
                    alert(data.message || 'Failed to add service.');
                    return;
                }

                alert('Service added successfully.');
                this.fetchServices();
                this.resetForm();
                this.showAddServiceForm = false;
            } catch (error) {
                console.error('Error adding service:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        },
        editService(service) {
            this.form = { ...service }; // Populate the form with the selected service details
            this.showEditForm = true;
        },
        async updateService() {
            try {
                const token = this.$store.state.auth_token;
                if (!token) {
                    alert('You must be logged in to perform this action.');
                    return;
                }

                const res = await fetch(`api/services/${this.form.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': token,
                    },
                    body: JSON.stringify(this.form),
                });

                if (!res.ok) {
                    const data = await res.json();
                    alert(data.message || 'Failed to update service.');
                    return;
                }

                alert('Service updated successfully.');
                this.fetchServices();
                this.resetForm();
                this.showEditForm = false;
            } catch (error) {
                console.error('Error updating service:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        },
        async deleteService(serviceId) {
            if (!confirm('Are you sure you want to delete this service?')) return;

            try {
                const token = this.$store.state.auth_token;
                if (!token) {
                    alert('You must be logged in to perform this action.');
                    return;
                }

                const res = await fetch(`api/services/${serviceId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authentication-Token': token,
                    },
                });

                if (!res.ok) {
                    const data = await res.json();
                    alert(data.message || 'Failed to delete service.');
                    return;
                }

                alert('Service deleted successfully.');
                this.fetchServices();
            } catch (error) {
                console.error('Error deleting service:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        },
        resetForm() {
            this.form = { id: null, name: '', description: '', base_price: null };
            this.showEditForm = false;
        },
    },
    mounted() {
        this.fetchServices();
    },
};