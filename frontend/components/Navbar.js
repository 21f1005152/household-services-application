export default {
    template: `
    <div class="container mt-3">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <!-- Logo -->
            <a 
                v-if="isLoggedIn" 
                class="navbar-brand" 
                href="#" 
                @click="redirectHome"
                style="cursor: pointer"
            >
                Dashboard
            </a>
            
            <!-- Toggler for small screens -->
            <button 
                class="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav" 
                aria-controls="navbarNav" 
                aria-expanded="false" 
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <!-- Navigation links -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <!-- Admin Links -->
                    <template v-if="isAdmin">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/manageservices">Manage Services</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/stats">Stats</router-link>
                        </li>
                    </template>

                    <!-- Customer Links -->
                    <template v-if="isCustomer">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/customer-profile">Profile</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/customer-history">History</router-link>
                        </li>
                    </template>

                    <!-- Service Provider Links -->
                    <template v-if="isServiceProvider">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/sp-profile">SP Profile</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/sp-history">SP History</router-link>
                        </li>
                    </template>

                    <!-- Guest Links -->
                    <template v-if="!isLoggedIn">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/">Home</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/login">Login</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/register">Register</router-link>
                        </li>
                    </template>
                </ul>
                
                <!-- Logout Button for Logged-In Users -->
                <template v-if="isLoggedIn">
                    <button 
                        class="btn btn-outline-danger btn-sm ms-auto" 
                        @click="logout"
                    >
                        Logout
                    </button>
                </template>
            </div>
        </nav>
    </div>
    `,
    computed: {
        isAdmin() {
            // Check if the current user is an admin
            return this.$store.state.role === 'admin';
        },
        isCustomer() {
            // Check if the current user is a customer
            return this.$store.state.role === 'customer';
        },
        isServiceProvider() {
            // Check if the current user is a service provider
            return this.$store.state.role === 'service_provider';
        },
        isLoggedIn() {
            // Check if the user is logged in
            return this.$store.state.loggedIn;
        },
    },
    methods: {
        redirectHome() {
            // Redirect based on user role
            if (this.isAdmin) {
                this.$router.push('/admin');
            } else if (this.isCustomer) {
                this.$router.push('/customer-dashboard');
            } else if (this.isServiceProvider) {
                this.$router.push('/service-provider-dashboard');
            } else {
                this.$router.push('/');
            }
        },
        logout() {
            // Clear user data and reset Vuex store
            localStorage.removeItem('user');
            this.$store.commit('logout'); // Reset Vuex state
            this.$router.push('/login');
        },
    },
};