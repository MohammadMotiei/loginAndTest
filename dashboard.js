document.addEventListener('DOMContentLoaded', function() {
    const loadingState = document.getElementById('loadingState');
    const userProfile = document.getElementById('userProfile');
    const notLoggedIn = document.getElementById('notLoggedIn');
    const logoutBtn = document.getElementById('logoutBtn');

    
    const authManager = window.authManager;

    
    const currentUser = authManager.getCurrentUser();

    
    setTimeout(() => {
        loadingState.classList.add('hidden');
        
        if (currentUser) {
            displayUserProfile(currentUser);
        } else {
            displayNotLoggedIn();
        }
    }, 1000);

    
    logoutBtn.addEventListener('click', function() {
        authManager.logout();
        
        setTimeout(() => {
            window.location.href = 'signin.html';
        }, 100);
    });

    function displayUserProfile(user) {
        
        document.getElementById('welcomeText').textContent = `Welcome, ${user.firstName}!`;
        
        
        document.getElementById('userInitials').textContent = authManager.getUserInitials(user);
        document.getElementById('userFullName').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('userUsername').textContent = `@${user.username}`;
        document.getElementById('userFirstName').textContent = user.firstName;
        document.getElementById('userLastName').textContent = user.lastName;
        document.getElementById('userUsernameDetail').textContent = user.username;
        document.getElementById('userGender').textContent = capitalizeFirst(user.gender);
        document.getElementById('userBirthday').textContent = authManager.formatDate(user.birthday);
        document.getElementById('userMemberSince').textContent = authManager.formatDate(user.createdAt);
        
        
        userProfile.classList.remove('hidden');
        userProfile.classList.add('fade-in');
    }

    function displayNotLoggedIn() {
        notLoggedIn.classList.remove('hidden');
        notLoggedIn.classList.add('fade-in');
    }

    function capitalizeFirst(str) {
        if (str === 'prefer-not-to-say') {
            return 'Prefer not to say';
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});