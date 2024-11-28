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
                                <button class="btn btn-dark" type="submit">Login</button>
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
        };
    },
    methods: {
        async submitLogin() {
            try {
                const res = await fetch(location.origin + '/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.email, password: this.password }),
                });

                if (!res.ok) {
                    const errorDetails = await res.json();
                    console.error('Login failed:', errorDetails);
                    return;
                }

                const data = await res.json();
                console.log('We are logged in:', data);
            } catch (error) {
                console.error('Error during login:', error);
            }
        },
    },
};