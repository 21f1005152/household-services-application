// export default {
//     template: `
//     <div class="container mt-3">
//         <nav class="navbar navbar-expand-lg navbar-light bg-light">
//             <!-- Logo -->
//             <a 
//                 v-if="isLoggedIn" 
//                 class="navbar-brand" 
//                 href="#" 
//                 @click="redirectHome"
//                 style="cursor: pointer"
//             >
//                 Dashboard
//             </a>
            
//             <!-- Toggler for small screens -->
//             <button 
//                 class="navbar-toggler" 
//                 type="button" 
//                 data-bs-toggle="collapse" 
//                 data-bs-target="#navbarNav" 
//                 aria-controls="navbarNav" 
//                 aria-expanded="false" 
//                 aria-label="Toggle navigation"
//             >
//                 <span class="navbar-toggler-icon"></span>
//             </button>
            
//             <!-- Navigation links -->
//             <div class="collapse navbar-collapse" id="navbarNav">
//                 <ul class="navbar-nav me-auto mb-2 mb-lg-0">
//                     <!-- Admin Links -->
//                     <template v-if="isAdmin">
//                         <li class="nav-item">
//                             <router-link class="nav-link" to="/manageservices">Manage Services</router-link>
//                         </li>
//                         <li class="nav-item">
//                             <router-link class="nav-link" to="/stats">Stats</router-link>
//                         </li>
//                     </template>

//                     <!-- Customer Links -->
//                     <template v-if="isCustomer">
//                         <li class="nav-item">
//                             <router-link class="nav-link" to="/customer-profile">Profile</router-link>
//                         </li>
//                         <li class="nav-item">
//                             <router-link class="nav-link" to="/customer-history">History</router-link>
//                         </li>
//                     </template>

//                     <!-- Service Provider Links -->
//                     <template v-if="isServiceProvider">
//                         <li class="nav-item">
//                             <router-link class="nav-link" to="/sp-profile">SP Profile</router-link>
//                         </li>
//                         <li class="nav-item">
//                             <router-link class="nav-link" to="/sp-history">SP History</router-link>
//                         </li>
//                     </template>

//                     <!-- Guest Links -->
//                     <template v-if="!isLoggedIn">
//                         <li class="nav-item">
//                             <router-link class="nav-link" to="/">Home</router-link>
//                         </li>
//                         <li class="nav-item">
//                             <router-link class="nav-link" to="/login">Login</router-link>
//                         </li>
//                         <li class="nav-item">
//                             <router-link class="nav-link" to="/register">Register</router-link>
//                         </li>
//                     </template>
//                 </ul>
                
//                 <!-- Download CSV for Admins -->
//                 <template v-if="isAdmin">
//                     <button 
//                         class="btn btn-primary btn-sm me-2" 
//                         @click="create_csv"
//                     >
//                         Download CSV
//                     </button>
//                 </template>

//                 <!-- Logout Button for Logged-In Users -->
//                 <template v-if="isLoggedIn">
//                     <button 
//                         class="btn btn-outline-danger btn-sm ms-auto" 
//                         @click="logout"
//                     >
//                         Logout
//                     </button>
//                 </template>
//             </div>
//         </nav>
//     </div>
//     `,
//     computed: {
//         isAdmin() {
//             // Check if the current user is an admin
//             return this.$store.state.role === 'admin';
//         },
//         isCustomer() {
//             // Check if the current user is a customer
//             return this.$store.state.role === 'customer';
//         },
//         isServiceProvider() {
//             // Check if the current user is a service provider
//             return this.$store.state.role === 'service_provider';
//         },
//         isLoggedIn() {
//             // Check if the user is logged in
//             return this.$store.state.loggedIn;
//         },
//     },
//     methods: {
//         redirectHome() {
//             // Redirect based on user role
//             if (this.isAdmin) {
//                 this.$router.push('/admin');
//             } else if (this.isCustomer) {
//                 this.$router.push('/customer-dashboard');
//             } else if (this.isServiceProvider) {
//                 this.$router.push('/service-provider-dashboard');
//             } else {
//                 this.$router.push('/');
//             }
//         },
//         logout() {
//             // Clear user data and reset Vuex store
//             localStorage.removeItem('user');
//             this.$store.commit('logout'); // Reset Vuex state
//             this.$router.push('/login');
//         },
//         async create_csv(){
//             const res = await fetch(location.origin + '/create-csv' )
//             const task_id = (await res.json()).task_id

//             const interval = setInterval (async() => {
//                 const res = await fetch(`${location.origin}/get-csv/${task_id}`)
//                 if (res.ok){
//                     console. log('data is ready')
//                     window.open(`${location.origin}/get-csv/${task_id}`)
//                     clearInterval(interval)
//                 }
//             }, 100)

//     },
// },
// };




export default {
    template: `
    <div class="container mt-3">
        <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm rounded">
            <!-- Logo -->
            <a 
                v-if="isLoggedIn" 
                class="navbar-brand fw-bold text-primary" 
                href="#" 
                @click="redirectHome"
                style="cursor: pointer; font-size: 1.5rem;"
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
                            <router-link class="nav-link text-dark fw-semibold" to="/manageservices">Manage Services</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link text-dark fw-semibold" to="/stats">Stats</router-link>
                        </li>
                    </template>

                    <!-- Customer Links -->
                    <template v-if="isCustomer">
                        <li class="nav-item">
                            <router-link class="nav-link text-dark fw-semibold" to="/customer-profile">Profile</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link text-dark fw-semibold" to="/customer-history">History</router-link>
                        </li>
                    </template>

                    <!-- Service Provider Links -->
                    <template v-if="isServiceProvider">
                        <li class="nav-item">
                            <router-link class="nav-link text-dark fw-semibold" to="/sp-profile">SP Profile</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link text-dark fw-semibold" to="/sp-history">SP History</router-link>
                        </li>
                    </template>

                    <!-- Guest Links -->
                    <template v-if="!isLoggedIn">
                        <li class="nav-item">
                            <router-link class="nav-link text-dark fw-semibold" to="/">Home</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link text-dark fw-semibold" to="/login">Login</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link text-dark fw-semibold" to="/register">Register</router-link>
                        </li>
                    </template>
                </ul>
                
                <!-- Logout Button and Download CSV for Logged-In Admin -->
                <div v-if="isLoggedIn" class="d-flex align-items-center">
                    <template v-if="isAdmin">
                        <button 
                            class="btn btn-outline-primary btn-sm me-2 shadow-sm rounded-pill" 
                            @click="create_csv"
                        >
                            <i class="fas fa-file-download me-1"></i> Download CSV
                        </button>
                    </template>
                    <button 
                        class="btn btn-outline-danger btn-sm shadow-sm rounded-pill" 
                        @click="logout"
                    >
                        <i class="fas fa-sign-out-alt me-1"></i> Logout
                    </button>
                </div>
            </div>
        </nav>
    </div>
    `,
    computed: {
        isAdmin() {
            return this.$store.state.role === 'admin';
        },
        isCustomer() {
            return this.$store.state.role === 'customer';
        },
        isServiceProvider() {
            return this.$store.state.role === 'service_provider';
        },
        isLoggedIn() {
            return this.$store.state.loggedIn;
        },
    },
    methods: {
        redirectHome() {
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
            localStorage.removeItem('user');
            this.$store.commit('logout');
            this.$router.push('/login');
        },
        async create_csv(){
            const res = await fetch(location.origin + '/create-csv' )
            const task_id = (await res.json()).task_id;

            const interval = setInterval(async () => {
                const res = await fetch(`${location.origin}/get-csv/${task_id}`);
                if (res.ok) {
                    console.log('Data is ready');
                    window.open(`${location.origin}/get-csv/${task_id}`);
                    clearInterval(interval);
                }
            }, 100);
        },
    },
};