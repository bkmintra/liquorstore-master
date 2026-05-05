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
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await handleResponse(response);
    
    if (url === '/api/login' && data.token) {
      // 1. เก็บ Token ลงเครื่อง (เพื่อเอาไว้ยืนยันตัวตนตอนซื้อของ)
      localStorage.setItem('authToken', data.token);
      
      // 2. โชว์ข้อความว่าสำเร็จ
      showMessage('Login successful! กำลังพาไปหน้าแรก...', 'success');
      
      // 3. 🚀 เพิ่มโค้ดเปลี่ยนหน้าตรงนี้! 
      // ใช้ setTimeout เพื่อหน่วงเวลา 1 วินาที ให้ลูกค้าอ่านข้อความสำเร็จก่อนเด้งไปหน้าอื่น
      setTimeout(() => {
          window.location.href = 'index.html'; // 📌 เปลี่ยนชื่อไฟล์ให้ตรงกับหน้า Home ของคุณ (เช่น index.html)
      }, 1000); 

    } else {
      showMessage(data.message || successText, 'success');
      
      // ถ้าเป็นการสมัครสมาชิก (Register) สำเร็จ ให้เด้งไปหน้า Login
      if (url === '/api/auth/register') {
          setTimeout(() => {
              window.location.href = 'login.html'; 
          }, 1500);
      }
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

    await submitForm('/api/login', { username: email, password }, 'Login successful');
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
