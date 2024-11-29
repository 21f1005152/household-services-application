export default {
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    template: `
    <div class="card shadow-sm border-0 my-4 mx-3" :style="{ backgroundColor: user.active ? '#f8f9fa' : '#fdecea' }">
        <div class="card-body">

            <!-- Name and Email in two columns -->
            <div class="row text-center mb-3">
                <div class="col">
                    <p class="card-text"><strong>Name:</strong> {{ user.name }}</p>
                </div>
                <div class="col">
                    <p class="card-text"><strong>Email:</strong> {{ user.email }}</p>
                </div>
            </div>

            <!-- Customer Details -->
            <div v-if="user.roles[0] === 'customer' && user.customer_details">
                <h6 class="text-secondary text-center mt-4 mb-3">Customer Details</h6>
                <div class="row mb-3">
                    <div class="col">
                        <p class="card-text"><strong>Phone:</strong> {{ user.customer_details.phone }}</p>
                        <p class="card-text"><strong>Address:</strong> {{ user.customer_details.address }}</p>
                    </div>
                    <div class="col">
                        <p class="card-text"><strong>City:</strong> {{ user.customer_details.city }}</p>
                        <p class="card-text"><strong>Pin Code:</strong> {{ user.customer_details.pin_code }}</p>
                    </div>
                </div>
            </div>

            <!-- Service Provider Details -->
            <div v-if="user.roles[0] === 'service_provider' && user.service_provider_details">
                <h6 class="text-secondary text-center mt-4 mb-3">Service Provider Details</h6>
                <div class="row">
                    <div class="col">
                        <p class="card-text"><strong>Phone:</strong> {{ user.service_provider_details.phone }}</p>
                        <p class="card-text"><strong>Pin Code:</strong> {{ user.service_provider_details.pin_code }}</p>
                    </div>
                    <div class="col">
                        <p class="card-text"><strong>Experience Years:</strong> {{ user.service_provider_details.experience_years }}</p>
                        <p class="card-text"><strong>Services Provided:</strong> {{ user.service_provider_details.service_number }}</p>
                        <p class="card-text"><strong>Verified:</strong> {{ user.service_provider_details.verified ? 'Yes' : 'No' }}</p>
                        <p class="card-text"><strong>Document Link:</strong> 
                            <a :href="user.service_provider_details.doc_link" target="_blank">View Document</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
};
