export default {
    template: `
    <div class="container mt-3">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a 
                class="navbar-brand" 
                href="#" 
                @click="redirectHome"
                style="cursor: pointer"
            >
                MyApp
            </a>
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
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <!-- Dynamic links based on role -->
                    <template v-if="isAdmin">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/manageservices">Manage Services</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/stats">Stats</router-link>
                        </li>
                    </template>
                    <template v-else>
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
                <!-- Logout button for admin -->
                <template v-if="isAdmin">
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
            // Reactive admin check based on Vuex state
            return this.$store.state.role === 'admin';
        },
    },
    methods: {
        redirectHome() {
            if (this.isAdmin) {
                this.$router.push('/admin');
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