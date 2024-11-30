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
    const isLoggedIn = store.state.loggedIn; // Check if user is logged in
    const userRole = store.state.role; // Current user's role

    // Define routes that don't require authentication
    const publicRoutes = ['/', '/login', '/register'];

    // Allow access to public routes without checks
    if (publicRoutes.includes(to.path)) {
        return next();
    }

    // Check for authentication requirement
    if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
        alert('You need to log in to access this page.');
        return next('/login'); // Redirect to login if not authenticated
    }

    // Role-based access control
    if (to.matched.some((record) => record.meta.requiresAdmin) && userRole !== 'admin') {
        alert('Access restricted to admins only.');
        return next('/'); // Redirect to home if not an admin
    }

    if (to.matched.some((record) => record.meta.requiresCustomer) && userRole !== 'customer') {
        alert('Access restricted to customers only.');
        return next('/'); // Redirect to home if not a customer
    }

    if (to.matched.some((record) => record.meta.requiresServiceProvider) && userRole !== 'service_provider') {
        alert('Access restricted to service providers only.');
        return next('/'); // Redirect to home if not a service provider
    }

    next(); // Allow navigation
});


// router.beforeEach((to, from, next) => {
//     const isLoggedIn = store.state.loggedIn;
//     const userRole = store.state.role;

//     // Check if the route requires authentication
//     if (to.matched.some(record => record.meta.requiresAuth)) {
//         if (!isLoggedIn) {
//             return next('/login'); // Redirect to login if not authenticated
//         }
//     }

//     // Check for admin-specific routes
//     if (to.matched.some(record => record.meta.requiresAdmin)) {
//         if (userRole !== 'admin') {
//             return next('/unauthorized'); // Redirect to unauthorized page if not an admin
//         }
//     }

//     // Check for customer-specific routes
//     if (to.matched.some(record => record.meta.requiresCustomer)) {
//         if (userRole !== 'customer') {
//             return next('/unauthorized'); // Redirect to unauthorized page if not a customer
//         }
//     }

//     // Check for service provider-specific routes
//     if (to.matched.some(record => record.meta.requiresServiceProvider)) {
//         if (userRole !== 'service_provider') {
//             return next('/unauthorized'); // Redirect to unauthorized page if not a service provider
//         }
//     }

//     // Allow navigation
//     next();
// });



// // Navigation Guard
// router.beforeEach((to, from, next) => {
//     const isLoggedIn = store.state.loggedIn; // Check if user is logged in
//     const isAdmin = store.state.role === 'admin'; // Check if user is an admin

//     // Check for authentication requirement
//     if (to.matched.some(record => record.meta.requiresAuth)) {
//         if (!isLoggedIn) {
//             alert('You need to log in to access this page.');
//             return next('/login'); // Redirect to login if not authenticated
//         }
//     }

//     // Check for admin requirement
//     if (to.matched.some(record => record.meta.requiresAdmin)) {
//         if (!isAdmin) {
//             alert('Admin access only.');
//             return next('/'); // Redirect to home if not an admin
//         }
//     }

//     // Allow navigation
//     next();
// });

export default router;