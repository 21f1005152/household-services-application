export default {
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    template: `
    <div class="card shadow-sm border-0 mx-auto my-4" style="max-width: 500px; background-color: #ffffff; border-radius: 15px;">
        <div class="card-body">
            <div class="text-center mb-4">
                <img 
                    :src="'https://api.dicebear.com/9.x/big-smile/svg?seed=' + encodeURIComponent(user.name)" 
                    alt="Profile Picture" 
                    class="rounded-circle border" 
                    style="width: 100px; height: 100px; object-fit: cover;"
                />
                <h5 class="mt-3 mb-0 text-dark">{{ user.name || 'N/A' }}</h5>
                <p class="text-muted">{{ user.email || 'N/A' }}</p>
            </div>
            <div class="border-top pt-3">
                <h6 class="text-primary text-center mb-3">Service Provider Details</h6>
                <div v-if="user.serviceProviderDetails">
                    <div class="d-flex justify-content-between mb-2">
                        <span><strong>Phone:</strong></span>
                        <span>{{ user.serviceProviderDetails.phone || 'N/A' }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span><strong>Pin Code:</strong></span>
                        <span>{{ user.serviceProviderDetails.pin_code || 'N/A' }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span><strong>Experience:</strong></span>
                        <span>{{ user.serviceProviderDetails.experience_years || 'N/A' }} years</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span><strong>Document Link:</strong></span>
                        <span>
                            <a :href="user.serviceProviderDetails.docLink" target="_blank" class="text-primary text-decoration-none">
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
    `,
};