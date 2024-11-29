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
                if (JSON.parse(localStorage.getItem('user'))) {
                    const user = JSON.parse(localStorage.getItem('user'));
                    // state.user = user;
                    state.auth_token = user.token;
                    // state.auth_token = JSON.parse(localStorage.getItem('auth_token'));
                    state.loggedIn = true;
                    state.role = user.role;
                    state.user_id = user.id;
                }
            } catch (error) {
                console.warning(' not logged in');
            }
        },
        logout(state) {
            state.auth_token = null;
            state.role = null;
            state.loggedIn = false;
            state.user_id = null;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            
        },
    },
    actions: {
        //
    }
})

store.commit('setUser');
export default store;


