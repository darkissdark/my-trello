import { useState, FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import css from './auth.module.scss';

export default function Login() {
  const { handleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setErrorMessage('');

    const result = await handleLogin({ email, password });

    if (!result.success) {
      setErrorMessage(result.error);
    }
  };

  return (
    <div className={css.authWrap}>
      <div className={css.authContainer}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className={css.authForm}>
          <div className={css.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
              className={css.formInput}
            />
          </div>
          <div className={css.formGroup}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className={css.formInput}
            />
          </div>
          {hasSubmitted && errorMessage && <div className={css.errorMessage}>{errorMessage}</div>}
          <button type="submit" className={css.submitButton}>
            Login
          </button>
        </form>
        <p className={css.authLink}>
          Don't have an account? <Link to="/auth/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
