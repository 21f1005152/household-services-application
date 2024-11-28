import LoginPage from '../pages/LoginPage.js';
import RegisterPage from '../pages/RegisterPage.js';

const Home = {
    template: `
    <div class="container mt-5 text-center">
        <h1 class="display-4">Welcome to the Home Page</h1>
        <p class="lead">This is the main landing page of the application. Enjoy your stay!</p>
    </div>
    `
};



const routes = [
    {path: '/', component: Home},
    {path: '/login', component: LoginPage},
    {path: '/register', component: RegisterPage},
]

const router = new VueRouter({
    routes
})

export default router;