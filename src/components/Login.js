import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom'; // Updated

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Updated

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }))
      .then(() => navigate('/home')) // Updated
      .catch(() => {});
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
