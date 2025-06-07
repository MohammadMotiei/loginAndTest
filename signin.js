document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signinForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitText = document.getElementById('submitText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    
    const authManager = window.authManager;

    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        
        clearErrors();
        
        
        const formData = new FormData(form);
        const username = formData.get('username').trim();
        const password = formData.get('password');

    
        if (!username) {
            showFieldError(form.querySelector('[name="username"]'), 'Username is required');
            return;
        }
        
        if (!password) {
            showFieldError(form.querySelector('[name="password"]'), 'Password is required');
            return;
        }

        
        setLoadingState(true);

        try {
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            
            const user = authManager.login(username, password);
            
            
            showSuccessMessage();
            
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            showErrorMessage(error.message);
        } finally {
            setLoadingState(false);
        }
    });


    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearFieldError(this);
            hideMessages();
        });
    });

    function showFieldError(field, message) {
        field.classList.add('form-input-error');
        const errorSpan = field.parentNode.querySelector('.error-message');
        errorSpan.textContent = message;
        errorSpan.classList.remove('hidden');
    }

    function clearFieldError(field) {
        field.classList.remove('form-input-error');
        const errorSpan = field.parentNode.querySelector('.error-message');
        errorSpan.classList.add('hidden');
    }

    function clearErrors() {
        const errorSpans = form.querySelectorAll('.error-message');
        errorSpans.forEach(span => span.classList.add('hidden'));
        
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('form-input-error');
        });
        
        hideMessages();
    }

    function setLoadingState(loading) {
        submitBtn.disabled = loading;
        if (loading) {
            submitText.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');
        } else {
            submitText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
        }
    }

    function showSuccessMessage() {
        hideMessages();
        successMessage.classList.remove('hidden');
        successMessage.classList.add('fade-in');
    }

    function showErrorMessage(message) {
        hideMessages();
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');
        errorMessage.classList.add('fade-in');
    }

    function hideMessages() {
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
    }

    
    if (authManager.isLoggedIn()) {
        window.location.href = 'index.html';
    }
});