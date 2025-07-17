import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import api from '../../api/request';
import css from './auth.module.scss';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

    try {
      const { data } = await api.post('/login', { email, password });

      const userRes = await api.get(`/user?emailOrUsername=${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      const user = userRes.data[0];

      dispatch(
        login({
          token: data.token,
          refreshToken: data.refreshToken,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
          },
        })
      );

      navigate('/');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Користувач з таким email або паролем не знайдений';
      setErrorMessage(message);
    }
  };

  return (
    <div className={css['auth-wrap']}>
      <div className={css['auth-container']}>
        <h2 className={css['auth-title']}>Вхід</h2>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="email" className={css['auth-label']}>
            Email
          </label>
          <input
            id="email"
            className={css['auth-input']}
            type="email"
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
            className={css['auth-input']}
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={handlePasswordChange}
            required
          />

          {hasSubmitted && errorMessage && <div className={css['auth-error']}>{errorMessage}</div>}

          <button type="submit" className={`${css['auth-button']} button blue`}>
            Увійти
          </button>
        </form>

        <div className={css['auth-link-row']}>
          Вперше у нас?{' '}
          <Link to="/auth/register" className={css['auth-link']}>
            Зареєструватися
          </Link>
        </div>
      </div>
    </div>
  );
}
