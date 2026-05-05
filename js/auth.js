const API_BASE_URL = 'http://localhost:3000';

const authMessage = document.getElementById('authMessage');

const showMessage = (message, type = 'success') => {
  if (!authMessage) return;
  authMessage.textContent = message;
  authMessage.className = `alert alert-${type}`;
  authMessage.classList.remove('d-none');
};

const hideMessage = () => {
  if (!authMessage) return;
  authMessage.classList.add('d-none');
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Server error');
  }
  return data;
};

const submitForm = async (url, payload, successText) => {
  try {
    hideMessage();
    console.log('Sending request to:', url);
    console.log('Payload:', payload);
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.log('Response status:', response.status);
    
    const data = await handleResponse(response);
    console.log('Response data:', data);
    
    if (url === '/api/login' && data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('first_name', data.first_name);
      showMessage('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      showMessage(data.message || successText, 'success');
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage(error.message, 'danger');
  }
};

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    await submitForm('/api/login', { email, password }, 'Login successful');
  });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const firstName = document.getElementById('registerName').value.trim();

    await submitForm('/api/auth/register', { username: email, password, first_name: firstName }, 'Registration successful');
  });
}
