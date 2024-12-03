import LoginPage from '../pages/LoginPage.js';
import RegisterPage from '../pages/RegisterPage.js';
import AdminDashboard from '../pages/AdminDashboard.js';
import ManageServices from '../pages/ManageServices.js';
import CustomerDashboard from '../pages/CustomerDashboard.js';
import CustomerProfile from '../pages/CustomerProfile.js';
import ServiceProviderDashboard from '../pages/ServiceProviderDashboard.js';
import ServieProviderProfile from '../pages/ServiceProviderProfile.js';
import CustomerHistory from '../pages/CustomerHistory.js';
import PaymentRequest from '../pages/PaymentRequest.js';
import acceptedsp from '../pages/acceptedsp.js';
import Stats from '../pages/Stats.js';
import ServiceProviderHistory from '../pages/ServiceProviderHistory.js';
import store from './store.js';

const Home = {
    template: `
    <div class="container mt-5 text-center">
        <h1 class="display-4">Welcome to the HOMEFIX</h1>
        <p class="lead">One stop solution your everyday problems!</p>
    </div>
    `
};



const routes = [
    {path: '/', component: Home},
    {path: '/login', component: LoginPage},
    {path: '/register', component: RegisterPage},
    {path: '/admin', component: AdminDashboard, meta: {requiresAuth: true, requiresAdmin: true}},
    {path: '/manageservices', component: ManageServices, meta: {requiresAuth: true, requiresAdmin: true}},
    {path: '/customer-dashboard', component: CustomerDashboard, meta: {requiresAuth: true, requiresCustomer: true}},
    {path: '/customer-profile', component: CustomerProfile, meta: {requiresAuth: true, requiresCustomer: true}},
    {path: '/service-provider-dashboard', component: ServiceProviderDashboard, meta: {requiresAuth: true, requiresServiceProvider: true}},
    {path: '/sp-profile', component: ServieProviderProfile, meta: {requiresAuth: true, requiresServiceProvider: true}},
    {path: '/customer-history', component: CustomerHistory, meta: {requiresAuth: true, requiresCustomer: true}},
    {path: '/payment-request', component: PaymentRequest, meta: {requiresAuth: true, requiresCustomer: true}},
    {path: '/acceptedsp', component: acceptedsp, meta: {requiresAuth: true}},
    {path: '/stats', component: Stats, meta: {requiresAuth: true}},
    {path: '/sp-history', component: ServiceProviderHistory, meta: {requiresAuth: true, requiresServiceProvider: true}}
];




const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    const isLoggedIn = store.state.loggedIn;
    const userRole = store.state.role; 

    const publicRoutes = ['/', '/login', '/register'];

    if (publicRoutes.includes(to.path)) {
        return next();
    }
    if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
        alert('You need to log in to access this page.');
        return next('/login');
    }
    if (to.matched.some((record) => record.meta.requiresAdmin) && userRole !== 'admin') {
        alert('Access restricted to admins only.');
        return next('/');
    }
    if (to.matched.some((record) => record.meta.requiresCustomer) && userRole !== 'customer') {
        alert('Access restricted to customers only.');
        return next('/');
    }
    if (to.matched.some((record) => record.meta.requiresServiceProvider) && userRole !== 'service_provider') {
        alert('Access restricted to service providers only.');
        return next('/');
    }
    next(); 
});

export default router;