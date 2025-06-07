document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
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
        const userData = {
            firstName: formData.get('firstName').trim(),
            lastName: formData.get('lastName').trim(),
            username: formData.get('username').trim(),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            birthday: formData.get('birthday'),
            gender: formData.get('gender')
        };

        
        const errors = authManager.validateSignupData(userData);
        
        if (Object.keys(errors).length > 0) {
            displayErrors(errors);
            return;
        }

        
        setLoadingState(true);

        try {
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            
            const newUser = authManager.register(userData);
            
            
            showSuccessMessage();
            
        
            setTimeout(() => {
                window.location.href = 'signin.html';
            }, 2000);
            
        } catch (error) {
            showErrorMessage(error.message);
        } finally {
            setLoadingState(false);
        }
    });

    
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        let error = '';

        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!value || value.length < 2) {
                    error = `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
                }
                break;
            case 'username':
                if (!value || value.length < 3) {
                    error = 'Username must be at least 3 characters';
                } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                    error = 'Username can only contain letters, numbers, and underscores';
                } else {
                    
                    const users = authManager.getUsers();
                    if (users.find(user => user.username === value)) {
                        error = 'Username already exists';
                    }
                }
                break;
            case 'password':
                if (!value || value.length < 6) {
                    error = 'Password must be at least 6 characters';
                }
                break;
            case 'confirmPassword':
                const password = form.querySelector('[name="password"]').value;
                if (value !== password) {
                    error = 'Passwords do not match';
                }
                break;
            case 'birthday':
                if (!value) {
                    error = 'Birthday is required';
                } else {
                    const birthDate = new Date(value);
                    const today = new Date();
                    const age = today.getFullYear() - birthDate.getFullYear();
                    if (age < 13) {
                        error = 'You must be at least 13 years old';
                    }
                }
                break;
            case 'gender':
                if (!value) {
                    error = 'Please select a gender';
                }
                break;
        }

        if (error) {
            showFieldError(field, error);
        } else {
            clearFieldError(field);
            field.classList.add('form-input-success');
        }
    }

    function showFieldError(field, message) {
        field.classList.add('form-input-error');
        field.classList.remove('form-input-success');
        const errorSpan = field.parentNode.querySelector('.error-message');
        errorSpan.textContent = message;
        errorSpan.classList.remove('hidden');
    }

    function clearFieldError(field) {
        field.classList.remove('form-input-error');
        const errorSpan = field.parentNode.querySelector('.error-message');
        errorSpan.classList.add('hidden');
    }

    function displayErrors(errors) {
        Object.keys(errors).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                showFieldError(field, errors[fieldName]);
            }
        });
    }

    function clearErrors() {
        const errorSpans = form.querySelectorAll('.error-message');
        errorSpans.forEach(span => span.classList.add('hidden'));
        
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.classList.remove('form-input-error', 'form-input-success');
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