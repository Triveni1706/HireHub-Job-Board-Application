import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../index.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await API.post('/auth/register', {
        name,
        email,
        password,
        role
      });

      setMessage(res.data.message || 'Registration successful');

      setTimeout(() => navigate('/login'), 1500);

    } catch (err) {
      setMessage(
        err.response?.data?.message || 'Registration failed'
      );
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          required
        >
          <option value="candidate">Candidate</option>
          <option value="employer">Employer</option>
        </select>

        <button type="submit">Register</button>

        {message && <p className="error-message">{message}</p>}
      </form>
    </div>
  );
}
