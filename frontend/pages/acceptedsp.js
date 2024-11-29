export default {
    template: `
    <div class="container mt-5">
        <h2 class="text-center mb-4 text-primary">Service Provider Profile</h2>
        <div v-if="provider" class="card shadow-sm border-0 mx-auto" style="max-width: 600px; background-color: #ffffff; border-radius: 15px;">
            <div class="card-body">
                <div class="text-center mb-4">
                    <img 
                        :src="'https://api.dicebear.com/9.x/big-smile/svg?seed=' + encodeURIComponent(provider.name)" 
                        alt="Provider Profile Picture" 
                        class="rounded-circle border" 
                        style="width: 100px; height: 100px; object-fit: cover;"
                    />
                    <h5 class="mt-3 mb-0 text-dark">{{ provider.name || 'N/A' }}</h5>
                    <p class="text-muted">{{ provider.email || 'N/A' }}</p>
                </div>
                <div class="border-top pt-3">
                    <h6 class="text-primary text-center mb-3">Service Provider Details</h6>
                    <div v-if="provider.service_provider_details">
                        <div class="d-flex justify-content-between mb-2">
                            <span><strong>Phone:</strong></span>
                            <span>{{ provider.service_provider_details.phone || 'N/A' }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span><strong>Experience:</strong></span>
                            <span>{{ provider.service_provider_details.experience_years || 'N/A' }} years</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span><strong>Document:</strong></span>
                            <span>
                                <a :href="provider.service_provider_details.doc_link" target="_blank" class="text-decoration-none text-primary">
                                    View Document
                                </a>
                            </span>
                        </div>
                    </div>
                    <div v-else class="text-center text-danger mt-3">
                        <p>Service provider details are not available.</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-center text-danger">
            <p>Service provider information is not available.</p>
        </div>
    </div>
    `,
    data() {
        return {
            provider: null, // Service provider data
        };
    },
    methods: {
        async fetchProviderDetails() {
            const providerId = this.$route.query.providerId; // Get provider ID from query
            if (!providerId) {
                alert('Provider ID is missing.');
                return;
            }

            try {
                const res = await fetch(`/api/users/${providerId}`, {
                    method: 'GET',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                });
                if (!res.ok) throw new Error('Failed to fetch service provider details.');

                const data = await res.json();
                this.provider = data; // Populate provider data
            } catch (error) {
                console.error('Error fetching service provider details:', error);
                alert('An error occurred while fetching the service provider details.');
            }
        },
    },
    mounted() {
        this.fetchProviderDetails();
    },
};