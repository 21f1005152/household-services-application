export default {
    template: `
    <div class="my-4">
        <div class="input-group">
            <input
                type="text"
                class="form-control"
                placeholder="Search by name, email, or phone number"
                v-model="query"
            />
            <button class="btn btn-primary" @click="searchUsers" :disabled="loading">
                {{ loading ? 'Searching...' : 'Search' }}
            </button>
        </div>
        <div class="mt-3" v-if="users.length > 0">
            <h5>Search Results:</h5>
            <ul class="list-group">
                <li class="list-group-item" v-for="user in users" :key="user.id">
                    <strong>{{ user.name }}</strong> - {{ user.email }} 
                    <span v-if="user.customer_details?.phone"> (Phone: {{ user.customer_details.phone }})</span>
                    <span v-else-if="user.service_provider_details?.phone"> (Phone: {{ user.service_provider_details.phone }})</span>
                </li>
            </ul>
        </div>
        <div class="mt-3 text-danger" v-else-if="!loading && query">
            No users found matching "{{ query }}"
        </div>
    </div>
    `,
    data() {
        return {
            query: '',
            users: [],
            loading: false,
        };
    },
    methods: {
        async searchUsers() {
            if (!this.query.trim()) {
                alert('Please enter a search term.');
                return;
            }

            this.loading = true;
            try {
                const res = await fetch(`/api/users/search?query=${encodeURIComponent(this.query.trim())}`, {
                    method: 'GET',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token,
                    },
                });

                if (!res.ok) throw new Error('Failed to search users.');
                this.users = await res.json();
            } catch (error) {
                console.error('Error searching users:', error);
                alert('An error occurred while searching for users.');
            } finally {
                this.loading = false;
            }
        },
    },
};