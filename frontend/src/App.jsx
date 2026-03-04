import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import MatchTable from './components/MatchTable';
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
  const [form, setForm] = useState({
    username: '',
    password: '',
    userId: '',
    skillScore: '',
    teamwork: '',
    comms: '',
    matchUserId: '',
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [matches, setMatches] = useState([]);

  const onChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const register = async () => {
    try {
      setError('');
      const user = await apiClient.register({ username: form.username, password: form.password });
      setForm((prev) => ({ ...prev, userId: user.id, matchUserId: user.id }));
      setStatus(`created userId: ${user.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const saveProfile = async () => {
    try {
      setError('');
      await apiClient.upsertProfile(form.userId, {
        skillScore: Number(form.skillScore),
        behaviorMetrics: {
          teamwork: Number(form.teamwork),
          comms: Number(form.comms),
        },
        preferences: {},
      });
      setStatus('profile saved');
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchMatches = async () => {
    try {
      setError('');
      const result = await apiClient.getMatches(form.matchUserId);
      setMatches(result.matches || []);
      setStatus(`received ${result.matches?.length || 0} matches`);
    } catch (err) {
      setError(err.message);
    }
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
        <Container maxWidth="lg">
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Behavior-Aware Matchmaking
            </Typography>
            <Typography color="text.secondary">
              React + Material UI prototype: register, profile, matchmaking.
            </Typography>
            {status ? <Alert severity="success">{status}</Alert> : null}
            {error ? <Alert severity="error">{error}</Alert> : null}
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="h6">Register</Typography>
                    <TextField label="Username" value={form.username} onChange={onChange('username')} />
                    <TextField
                      label="Password"
                      type="password"
                      value={form.password}
                      onChange={onChange('password')}
                    />
                    <Button variant="contained" onClick={register}>
                      Register
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="h6">Profile</Typography>
                    <TextField label="User ID" value={form.userId} onChange={onChange('userId')} />
                    <TextField label="Skill" type="number" value={form.skillScore} onChange={onChange('skillScore')} />
                    <TextField label="Teamwork" type="number" value={form.teamwork} onChange={onChange('teamwork')} />
                    <TextField label="Comms" type="number" value={form.comms} onChange={onChange('comms')} />
                    <Button variant="contained" color="secondary" onClick={saveProfile}>
                      Save Profile
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="h6">Matchmaking</Typography>
                    <TextField
                      label="Match User ID"
                      value={form.matchUserId}
                      onChange={onChange('matchUserId')}
                    />
                    <Button variant="outlined" onClick={fetchMatches}>
                      Get Matches
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Results
              </Typography>
              <MatchTable matches={matches} />
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
