
class AuthManager {
    constructor() {
        this.USERS_KEY = 'auth_app_users';
        this.CURRENT_USER_KEY = 'auth_app_current_user';
    }

    
    getUsers() {
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : [];
    }


    saveUsers(users) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    
    getCurrentUser() {
        const currentUser = localStorage.getItem(this.CURRENT_USER_KEY);
        return currentUser ? JSON.parse(currentUser) : null;
    }


    setCurrentUser(user) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    }

    
    removeCurrentUser() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
    }

    
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }


    register(userData) {
        const users = this.getUsers();
        
    
        if (users.find(user => user.username === userData.username)) {
            throw new Error('Username already exists');
        }


        const newUser = {
            id: Date.now().toString(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
            password: userData.password, 
            birthday: userData.birthday,
            gender: userData.gender,
            createdAt: new Date().toISOString()
        };

        
        users.push(newUser);
        this.saveUsers(users);

        return newUser;
    }

    
    login(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        
        if (!user) {
            throw new Error('Invalid username or password');
        }

        
        this.setCurrentUser(user);
        return user;
    }

    
    logout() {
        this.removeCurrentUser();
    }

    
    validateSignupData(data) {
        const errors = {};

    
        if (!data.firstName || data.firstName.trim().length < 2) {
            errors.firstName = 'First name must be at least 2 characters';
        }

    
        if (!data.lastName || data.lastName.trim().length < 2) {
            errors.lastName = 'Last name must be at least 2 characters';
        }

        
        if (!data.username || data.username.trim().length < 3) {
            errors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
            errors.username = 'Username can only contain letters, numbers, and underscores';
        }

        
        if (!data.password || data.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }


        if (data.password !== data.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }


        if (!data.birthday) {
            errors.birthday = 'Birthday is required';
        } else {
            const birthDate = new Date(data.birthday);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 13) {
                errors.birthday = 'You must be at least 13 years old';
            }
        }


        if (!data.gender) {
            errors.gender = 'Please select a gender';
        }

        return errors;
    }

    
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }


    getUserInitials(user) {
        return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
    }
}


module.exports = { AuthManager };

window.authManager = new AuthManager();