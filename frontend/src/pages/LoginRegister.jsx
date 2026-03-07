import { useState } from 'react';
import { Alert, Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';
import { apiClient } from '../api/client';

export default function LoginRegister({ onLoginSuccess }) {
  const [registerForm, setRegisterForm] = useState({ username: '', password: '' });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const onRegisterChange = (key) => (event) => {
    setRegisterForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const onLoginChange = (key) => (event) => {
    setLoginForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const register = async () => {
    try {
      setError('');
      const user = await apiClient.register(registerForm);
      setStatus(`register success: ${user.username}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const login = async () => {
    try {
      setError('');
      const result = await apiClient.login(loginForm);
      apiClient.setToken(result.token);
      onLoginSuccess(result);
      setStatus(`login success: ${result.user.username}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Stack spacing={2}>
      {status ? <Alert severity="success">{status}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="h6">Register</Typography>
                <TextField
                  label="Username"
                  value={registerForm.username}
                  onChange={onRegisterChange('username')}
                />
                <TextField
                  label="Password"
                  type="password"
                  value={registerForm.password}
                  onChange={onRegisterChange('password')}
                />
                <Button variant="contained" onClick={register}>
                  Register
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="h6">Login</Typography>
                <TextField label="Username" value={loginForm.username} onChange={onLoginChange('username')} />
                <TextField
                  label="Password"
                  type="password"
                  value={loginForm.password}
                  onChange={onLoginChange('password')}
                />
                <Button variant="outlined" onClick={login}>
                  Login
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
