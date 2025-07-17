import { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/request';
import css from './auth.module.scss';

const getPasswordStrength = (password: string): number => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;
  return score;
};

const PASSWORD_STRENGTH_CLASSES = ['', css.weak, css.fair, css.medium, css.good, css.strong];

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasTouchedConfirm, setHasTouchedConfirm] = useState(false);

  const passwordStrength = getPasswordStrength(password);
  const passwordStrengthClass = PASSWORD_STRENGTH_CLASSES[passwordStrength] || '';

  const isPasswordMismatch = hasTouchedConfirm && password !== confirmPassword;

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleConfirmChange = (e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setHasTouchedConfirm(true);
      setErrorMessage('');

      if (password !== confirmPassword) {
        setErrorMessage('Паролі не співпадають!');
        return;
      }

      try {
        await api.post('/user', {
          email,
          password,
          username: email.split('@')[0],
        });
        navigate('/auth/login');
      } catch (err: any) {
        const message = err.response?.data?.message || 'Помилка реєстрації';
        setErrorMessage(message);
      }
    },
    [email, password, confirmPassword, navigate]
  );

  return (
    <div className={css['auth-wrap']}>
      <div className={css['auth-container']}>
        <h2 className={css['auth-title']}>Реєстрація</h2>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="email" className={css['auth-label']}>
            Email
          </label>
          <input
            id="email"
            type="email"
            className={css['auth-input']}
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />

          <label htmlFor="password" className={css['auth-label']}>
            Пароль
          </label>
          <input
            id="password"
            type="password"
            className={css['auth-input']}
            placeholder="Пароль"
            value={password}
            onChange={handlePasswordChange}
            required
          />

          <div className={`${css['auth-password-strength']} ${passwordStrengthClass}`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`${css['auth-password-bar']} ${passwordStrength > i ? css.filled : ''}`} />
            ))}
          </div>

          <label htmlFor="confirm" className={css['auth-label']}>
            Повторіть пароль
          </label>
          <input
            id="confirm"
            type="password"
            className={`${css['auth-input']} ${isPasswordMismatch ? css.error : ''}`}
            placeholder="Підтвердіть пароль"
            value={confirmPassword}
            onChange={handleConfirmChange}
            onBlur={() => setHasTouchedConfirm(true)}
            required
          />

          {isPasswordMismatch && <div className={css['auth-error']}>Паролі не співпадають!</div>}
          {errorMessage && <div className={css['auth-error']}>{errorMessage}</div>}

          <button type="submit" className={`${css['auth-button']} button blue`}>
            Зареєструватися
          </button>
        </form>

        <div className={css['auth-link-row']}>
          Вже є акаунт?{' '}
          <Link to="/auth/login" className={css['auth-link']}>
            Увійти
          </Link>
        </div>
      </div>
    </div>
  );
}
