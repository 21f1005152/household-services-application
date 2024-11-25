export default{
    template:`
    <div>
        <input placeholder="email" v-model="email" />
        <input placeholder="password" v-model="password" />
        <button class="btn btn-primary" @click.prevent="submitLogin">Login</button>
    </div>
    `,
    data(){
        return{
            email: null,
            password: null,
        }
    },
    methods:{
        async submitLogin(){
            try {
                const res = await fetch(location.origin+'/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.email, password: this.password })
                })
            
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
    }
}




