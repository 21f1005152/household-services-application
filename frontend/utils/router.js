import LoginPage from '../pages/LoginPage.js';
import RegisterPage from '../pages/RegisterPage.js';
import AdminDashboard from '../pages/AdminDashboard.js';
import ManageServices from '../pages/ManageServices.js';

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
    {path: '/admin', component: AdminDashboard, meta: {requiresAuth: true, requiresAdmin: true}},
    {path: '/manageservices', component: ManageServices, meta: {requiresAuth: true, requiresAdmin: true}},
]




const router = new VueRouter({
    routes
})

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