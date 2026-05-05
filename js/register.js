// js/register.js
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const authMessage = document.getElementById('authMessage'); // The alert div in your HTML

    // Helper function to show alerts
    const showMessage = (message, type = 'success') => {
        if (!authMessage) return;
        authMessage.textContent = message;
        authMessage.className = `alert alert-${type}`;
        authMessage.classList.remove('d-none');
    };

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // 1. Grab inputs
            const firstName = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value;

            // 2. Validate Password via Regex (Front-end check)
            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
            
            if (!passwordRegex.test(password)) {
                showMessage('Password requirements not met (Min 8 chars, 1 Uppercase, 1 Special Char).', 'danger');
                return; // Stop execution
            }

            // 3. Send POST request to Backend
            try {
                // Ensure your API_BASE_URL is correct if you aren't serving frontend from Express directly
                const response = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        first_name: firstName, 
                        username: email, 
                        password: password 
                    })
                });

                const data = await response.json();

                // 4. Handle Backend Responses
                if (response.ok) { // Status 201
                    showMessage(data.message, 'success'); // "Registration successful"
                    
                    // Wait 1.5 seconds, then redirect to login
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);

                } else { // Status 400 (Email exists) or 500
                    showMessage(data.error, 'danger'); 
                }

            } catch (error) {
                console.error('Fetch error:', error);
                showMessage('Network error: Could not connect to the server.', 'danger');
            }
        });
    }
});