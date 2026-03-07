import { useState } from 'react';
import { Box, Button, Container, CssBaseline, Stack, ThemeProvider, Typography, createTheme } from '@mui/material';
import LoginRegister from './pages/LoginRegister';
import MatchingPage from './pages/MatchingPage';
import Profile from './pages/Profile';
import { apiClient } from './api/client';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#00796b' },
    secondary: { main: '#ef6c00' },
    background: {
      default: '#f4efe6',
      paper: '#fffdf9',
    },
  },
  typography: {
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
  },
});

function App() {
  const [activePage, setActivePage] = useState('auth');
  const [session, setSession] = useState({ token: '', user: null });

  const onLoginSuccess = (result) => {
    setSession(result);
    setActivePage('profile');
  };

  const logout = () => {
    apiClient.setToken('');
    setSession({ token: '', user: null });
    setActivePage('auth');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          py: 6,
          background: 'radial-gradient(circle at 10% 10%, #d7f4ef 0%, #f4efe6 45%, #e7efe9 100%)',
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Behavior-Aware Matchmaking
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant={activePage === 'auth' ? 'contained' : 'text'} onClick={() => setActivePage('auth')}>
                Auth
              </Button>
              <Button
                variant={activePage === 'profile' ? 'contained' : 'text'}
                onClick={() => setActivePage('profile')}
                disabled={!session.user}
              >
                Profile
              </Button>
              <Button
                variant={activePage === 'matching' ? 'contained' : 'text'}
                onClick={() => setActivePage('matching')}
                disabled={!session.user}
              >
                Matching
              </Button>
              {session.user ? (
                <Button color="secondary" onClick={logout}>
                  Logout
                </Button>
              ) : null}
            </Stack>
            {session.user ? <Typography color="text.secondary">Current user: {session.user.username}</Typography> : null}
          </Stack>

          {activePage === 'auth' ? <LoginRegister onLoginSuccess={onLoginSuccess} /> : null}
          {activePage === 'profile' ? <Profile currentUser={session.user} /> : null}
          {activePage === 'matching' ? <MatchingPage currentUser={session.user} /> : null}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
