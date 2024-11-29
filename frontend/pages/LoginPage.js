export default {
    template: `
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow-sm border-0" style="background-color: #f8f9fa;">
                    <div class="card-body">
                        <h3 class="card-title text-center mb-4 text-dark">Login</h3>
                        <form @submit.prevent="submitLogin">
                            <div class="mb-3">
                                <label for="email" class="form-label text-secondary">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    v-model="email" 
                                    class="form-control border-secondary" 
                                    placeholder="Enter your email" 
                                    style="background-color: #e9ecef;" 
                                    required 
                                />
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label text-secondary">Password</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    v-model="password" 
                                    class="form-control border-secondary" 
                                    placeholder="Enter your password" 
                                    style="background-color: #e9ecef;" 
                                    required 
                                />
                            </div>
                            <div class="d-grid">
                            <button class="btn btn-dark" type="submit" :disabled="loading">
                            <span v-if="loading">Logging in...</span>
                            <span v-else>Login</span>
                        </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            email: null,
            password: null,
            loading: false, 
        };
    },

    methods: {
        async submitLogin() {
            this.loading = true; // Set loading to true
            try {
                const res = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.email, password: this.password }),
                });
        
                const data = await res.json();
                this.loading = false; // Reset loading state
        
                if (!res.ok) {
                    alert(`Login failed: ${data.message}`);
                    return;
                }
        
                // Save user data and commit to store
                localStorage.setItem('user', JSON.stringify({ email: data.email, role: data.role, id: data.id, token: data.token }));
                this.$store.commit('setUser', data);
                alert('Login successful!');
        
                // Redirect based on role
                if (data.role === 'admin') {
                    this.$router.push('/admin');
                } else if (data.role === 'customer') {
                    this.$router.push('/customer-dashboard');
                } else if (data.role === 'service_provider') {
                    this.$router.push('/service-provider-dashboard');
                } else {
                    alert('Invalid user role!');
                    this.$router.push('/login');
                }
            } catch (error) {
                this.loading = false; // Reset loading state
                console.error('Error during login:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        }
    },
};



