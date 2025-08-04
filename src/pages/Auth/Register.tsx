import { useState, FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import css from './auth.module.scss';

export default function Register() {
  const { handleRegister } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Паролі не співпадають');
      return;
    }

    const result = await handleRegister({ email, username, password });
    
    if (!result.success) {
      setErrorMessage(result.error);
    }
  };

  return (
    <div className={css.authWrap}>
      <div className={css.authContainer}>
        <h1>Реєстрація</h1>
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
            <label htmlFor="username">Ім'я користувача:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              required
              className={css.formInput}
            />
          </div>
          <div className={css.formGroup}>
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className={css.formInput}
            />
          </div>
          <div className={css.formGroup}>
            <label htmlFor="confirmPassword">Підтвердіть пароль:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              className={css.formInput}
            />
          </div>
          {hasSubmitted && errorMessage && <div className={css.errorMessage}>{errorMessage}</div>}
          <button type="submit" className={css.submitButton}>
            Зареєструватися
          </button>
        </form>
        <p className={css.authLink}>
          Вже є акаунт? <Link to="/auth/login">Увійти</Link>
        </p>
      </div>
    </div>
  );
}
