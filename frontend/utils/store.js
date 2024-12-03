const USER_STORAGE_KEY = 'user'; 

const store = new Vuex.Store({
    state: {
        auth_token: null, 
        role: null,       
        loggedIn: false,  
        user_id: null, 
    },
    mutations: {
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
        logout(state) {
            state.auth_token = null;
            state.role = null;
            state.loggedIn = false;
            state.user_id = null;
            localStorage.removeItem(USER_STORAGE_KEY);
        },
    },
    getters: {
        isLoggedIn: (state) => state.loggedIn,
        isAdmin: (state) => state.role === 'admin',
        isCustomer: (state) => state.role === 'customer',
        isServiceProvider: (state) => state.role === 'service_provider',
        authToken: (state) => state.auth_token,
    },
    actions: {
    },
});

store.commit('setUser');

export default store;