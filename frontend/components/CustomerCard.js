export default {
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    template: `
    <div class="card shadow-sm border-0 my-4 mx-auto" style="max-width: 500px; background-color: #ffffff; border-radius: 15px;">
        <div class="card-body">
            <div class="text-center mb-4">
            <img 
            :src="'https://api.dicebear.com/9.x/big-smile/svg?seed=' + encodeURIComponent(user.name)" 
            alt="Generated Profile Picture" 
            class="rounded-circle border" 
            style="width: 100px; height: 100px; object-fit: cover;"
        />
                <h5 class="mt-3 mb-0">{{ user.name }}</h5>
                <p class="text-muted">{{ user.email }}</p>
            </div>

            <div class="border-top pt-3">
                <h6 class="text-primary text-center">Customer Details</h6>
                <div v-if="user.customer_details" class="mt-3">
                    <div class="d-flex justify-content-between mb-2">
                        <span><strong>Phone:</strong></span>
                        <span>{{ user.customer_details.phone }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span><strong>Address:</strong></span>
                        <span>{{ user.customer_details.address }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span><strong>City:</strong></span>
                        <span>{{ user.customer_details.city }}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span><strong>Pin Code:</strong></span>
                        <span>{{ user.customer_details.pin_code }}</span>
                    </div>
                </div>
                <div v-else class="text-center text-muted mt-3">
                    <p>No additional customer details available.</p>
                </div>
            </div>
        </div>
    </div>
    `,
};