export default{
    template:`
    <div>
        <input placeholder="email" v-model="email" />
        <input placeholder="password" v-model="password" />
        <button @click="submitLogin">Login</button>
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
            const res = await fetch(location.origin + '/login', {method: 'POST', body : {email: this.email, password : this.password}})
            if (res.ok){
                console.log('we are logged in')
                data = await res.json()
                console.log(data)
                // localStorage.setItem('token', data.token)

            }

        },
    }
}

