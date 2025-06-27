import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import api from '../../api/request';
import css from './auth.module.scss';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError('');
    try {
      const { data } = await api.post('/login', { email, password });
      dispatch(login({ token: data.token, refreshToken: data.refreshToken }));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Користувач з таким email або паролем не знайдений');
    }
  };

  return (
    <div className={css['auth-wrap']}>
      <div className={css['auth-container']}>
        <h2 className={css['auth-title']}>Вхід</h2>
        <form onSubmit={handleSubmit}>
          <label className={css['auth-label']} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className={css['auth-input']}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className={css['auth-label']} htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            className={css['auth-input']}
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && touched && <div className={css['auth-error']}>{error}</div>}
          <button className={`${css['auth-button']} button blue`} type="submit">
            Увійти
          </button>
        </form>
        <div className={css['auth-link-row']}>
          Вперше у нас?
          <Link className={css['auth-link']} to="/auth/register">
            Зареєструватися
          </Link>
        </div>
      </div>
    </div>
  );
}
