const AuthManager = {
    _currentUser: {},
    get currentUser() {
        return AuthManager._currentUser;
    },
    set currentUser(user) {
        AuthManager._currentUser = user;
    },
    refreshCurrentUser() {
        return new Promise((resolve) => {
            buildfire.auth.getCurrentUser((err, user) => {
                AuthManager.currentUser = err || !user ? null : user;
                resolve();
            });
        });
    },
};

buildfire.auth.onLogin((user) => {
    AuthManager.currentUser = user;
}, true);
