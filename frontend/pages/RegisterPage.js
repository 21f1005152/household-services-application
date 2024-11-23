export default{
    template:`
    <div>
        <input placeholder="email" v-model="email" />
        <input placeholder="password" v-model="password" />
        <input placeholder="role" v-model="role" />
        <input placeholder="name" v-model="name" />
        <button @click.prevent="submitRegister">Register</button>
    </div>
    `,
    data(){
        return{
            email: null,
            password: null,
            role: null,
            name: null,
        }
    },
    methods:{
        async submitRegister(){
            try {
                const res = await fetch(location.origin+'/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.email, password: this.password, role: this.role, name: this.name })
                })
            
                if (!res.ok) {
                    const errorDetails = await res.json();
                    console.error('Login failed:', errorDetails);
                    return;
                }
            
                const data = await res.json();
                console.log('User Registered.', data);
            } catch (error) {
                console.error('Error during registration:', error);
            }

        },
    }
}




