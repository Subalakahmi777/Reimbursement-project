// Login form handling
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const employeeIdInput = document.getElementById('employeeId');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    const signinBtn = document.getElementById('signinBtn');
    const btnText = signinBtn.querySelector('.btn-text');
    const btnLoader = signinBtn.querySelector('.btn-loader');

    // Handle form submission
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Clear previous error
        hideError();

        // Get form values
        const employeeId = employeeIdInput.value.trim();
        const password = passwordInput.value.trim();

        // Client-side validation
        if (!employeeId || !password) {
            showError('Please enter both Employee ID and Password');
            return;
        }

        // Show loading state
        setLoading(true);

        try {
            // Send login request
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeeId: employeeId,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Login successful - redirect to reimbursement form
                window.location.href = data.redirectUrl || '/reimbursement';
            } else {
                // Login failed - show error message
                showError(data.message || 'Invalid Employee ID or Password');
                setLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('An error occurred. Please try again.');
            setLoading(false);
        }
    });

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'flex';
    }

    // Hide error message
    function hideError() {
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
    }

    // Set loading state
    function setLoading(isLoading) {
        if (isLoading) {
            signinBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'block';
        } else {
            signinBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
        }
    }

    // Clear error on input
    employeeIdInput.addEventListener('input', hideError);
    passwordInput.addEventListener('input', hideError);

    // Handle "Forgot Password" link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault();
            alert('Please contact your administrator to reset your password.');
        });
    }
});
