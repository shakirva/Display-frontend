import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';
import logo from '../assets/logo-jseven.png'; // Ensure logo path is correct

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      }, { withCredentials: true });

      const { token, user } = res.data;

      // Defensive check: make sure user exists
      if (!user || !user.role) {
        throw new Error('Invalid response from server. User or role missing.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);

      // Redirect all admins
      if (user.role === 'admin') {
        navigate('/Dashboard');
      } else {
        alert('Access denied. Only admin users are allowed.');
      }

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <Card className="p-4 shadow-lg w-100" style={{ maxWidth: '400px' }}>
        <div className="text-center mb-3">
          <img src={logo} alt="Company Logo" width="100" className="mb-2" />
          <h4 className="text-primary">Company Portal Login</h4>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginPage;
