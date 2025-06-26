import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/request';
import css from './auth.module.scss';

function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;
  return score;
}

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const navigate = useNavigate();
  const passwordStrength = getPasswordStrength(password);
  const bars = Array.from({ length: 5 }, (_, i) => i);

  const barClass = ['', css.weak, css.fair, css.medium, css.good, css.strong][passwordStrength] || '';

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(true);
      setError('');

      if (password !== confirmPassword) {
        setError('Паролі не співпадають!');
        return;
      }

      try {
        await api.post('/user', { email, password });
        navigate('/auth/login');
      } catch (err: any) {
        const message = err.response?.data?.message || 'Помилка реєстрації';
        setError(message);
      }
    },
    [email, password, confirmPassword, navigate]
  );

  return (
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
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className={`${css['auth-password-strength']} ${barClass}`}>
          {bars.map((i) => (
            <div key={i} className={`${css['auth-password-bar']} ${passwordStrength > i ? css.filled : ''}`} />
          ))}
        </div>

        <label htmlFor="confirm" className={css['auth-label']}>
          Повторіть пароль
        </label>
        <input
          id="confirm"
          type="password"
          placeholder="Підтвердіть пароль"
          className={`${css['auth-input']} ${touched && password !== confirmPassword ? css.error : ''}`}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => setTouched(true)}
          required
        />

        {touched && password !== confirmPassword && <div className={css['auth-error']}>Паролі не співпадають!</div>}

        {error && <div className={css['auth-error']}>{error}</div>}

        <button className={css['auth-button']} type="submit">
          Зареєструватися
        </button>
      </form>

      <div className={css['auth-link-row']}>
        Вже є акаунт?
        <Link className={css['auth-link']} to="/auth/login">
          Увійти
        </Link>
      </div>
    </div>
  );
}
