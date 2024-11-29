// const store = new Vuex.Store({
//     state: {
//         auth_token: null,
//         role: null,
//         loggedIn: false,
//         user_id: null,
//     },
//     mutations: {
//         setUser(state) {
//             try {
//                 if (JSON.parse(localStorage.getItem('user'))) {
//                     const user = JSON.parse(localStorage.getItem('user'));
//                     // state.user = user;
//                     state.auth_token = user.token;
//                     // state.auth_token = JSON.parse(localStorage.getItem('auth_token'));
//                     state.loggedIn = true;
//                     state.role = user.role;
//                     state.user_id = user.id;
//                 }
//             } catch (error) {
//                 console.warning(' not logged in');
//             }
//         },
//         logout(state) {
//             state.auth_token = null;
//             state.role = null;
//             state.loggedIn = false;
//             state.user_id = null;
//             localStorage.removeItem('auth_token');
//             localStorage.removeItem('user');
            
//         },
//     },
//     actions: {
//         //
//     }
// })

// store.commit('setUser');
// export default store;








const USER_STORAGE_KEY = 'user'; // Key for storing user data in localStorage

const store = new Vuex.Store({
    state: {
        auth_token: null, // User's authentication token
        role: null,       // User's role ('admin', 'customer', 'service_provider')
        loggedIn: false,  // Whether the user is logged in
        user_id: null,    // Logged-in user's ID
    },
    mutations: {
        /**
         * Set user data in Vuex store from localStorage.
         */
        setUser(state) {
            try {
                const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
                if (user && user.token && user.role && user.id) {
                    state.auth_token = user.token;
                    state.role = user.role;
                    state.loggedIn = true;
                    state.user_id = user.id;
                } else {
                    throw new Error('Invalid user data');
                }
            } catch (error) {
                console.warn('No valid user found in localStorage:', error.message);
                state.auth_token = null;
                state.role = null;
                state.loggedIn = false;
                state.user_id = null;
            }
        },
        /**
         * Clear user data from Vuex store and localStorage.
         */
        logout(state) {
            state.auth_token = null;
            state.role = null;
            state.loggedIn = false;
            state.user_id = null;
            localStorage.removeItem(USER_STORAGE_KEY);
        },
    },
    getters: {
        /**
         * Return whether the user is logged in.
         */
        isLoggedIn: (state) => state.loggedIn,

        /**
         * Return whether the user is an admin.
         */
        isAdmin: (state) => state.role === 'admin',

        /**
         * Return whether the user is a customer.
         */
        isCustomer: (state) => state.role === 'customer',

        /**
         * Return whether the user is a service provider.
         */
        isServiceProvider: (state) => state.role === 'service_provider',

        /**
         * Get the user's auth token.
         */
        authToken: (state) => state.auth_token,
    },
    actions: {
        // Future async actions can be defined here
    },
});

// Initialize Vuex state by committing `setUser` on load
store.commit('setUser');

export default store;