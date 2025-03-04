"use client";

import React, { useState } from 'react';
import styles from './login.module.css';
import useStore from '../../store/useStore';

const Login = () => {
  const { login, loginError } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await login(username, password);
  };

  return (
    <div className={styles.container}>
      <div className={styles['login-box']}>
        <div className={styles['icon-box']}>
          <span className={styles.icon}>🌐</span>
        </div>
        <h2 className={styles.title}>Welcome back</h2>
        <p className={styles.subtitle}>Please enter your details to sign in</p>

        <div className={styles['input-group']}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className={styles['input-group']}>
          <label>Password</label>
          <div className={styles['password-wrapper']}>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className={styles['eye-icon']}>👁️</span>
          </div>
        </div>

        {loginError && <p className={styles.error}>{loginError}</p>}

        <button className={styles['sign-in-btn']} onClick={handleLogin}>
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Login;
