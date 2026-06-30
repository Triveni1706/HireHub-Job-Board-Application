import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/login-bg1.jpg';
import '../index.css';
import API from '../services/api';
import { Link } from 'react-router-dom';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await API.post('/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);

      const redirect = localStorage.getItem('redirectAfterLogin');

      if (redirect) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirect);
      } else {
        if (res.data.role === 'employer') {
          navigate('/employer');
        } else {
          navigate('/candidate');
        }
      }

    } catch (err) {
      setMessage(
        err.response?.data?.message || 'Login failed'
      );
    }
  };

  return (
    <div
      className="auth-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

          <p style={{ marginTop: '12px', textAlign: 'center' }}>
            <Link to="/">← Back to Home</Link>
          </p>

        {message && <p className="error-message">{message}</p>}
      </form>
    </div>
  );
}
