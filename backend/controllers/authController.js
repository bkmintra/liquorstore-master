const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use environment variable

exports.registerUser = async (req, res) => {
  try {
    const { username, password, first_name } = req.body;

    if (!username || !password || !first_name) {
      return res.status(400).json({ error: 'username, password and first_name are required' });
    }

    const existingUser = await authService.findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const user = await authService.createUser({ username, password, first_name });
    res.status(201).json({ message: 'User registered', user: { username: user.username, first_name: user.first_name, date_of_registration: user.date_of_registration } });
  } catch (error) {
    console.error('AuthController.registerUser error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await authService.findUserByUsername(email);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const passwordMatches = await authService.verifyPassword(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Generate JWT token containing the user's ID (using username as identifier)
    const token = jwt.sign({ id: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('AuthController.loginUser error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};
