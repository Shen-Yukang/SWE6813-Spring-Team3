import { useEffect, useState } from 'react';
import { Alert, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { apiClient } from '../api/client';
import { GAME_MODE_OPTIONS, PLAY_STYLE_OPTIONS, REGION_OPTIONS } from '../constants/preferences';

export default function Profile({ currentUser }) {
  const [form, setForm] = useState({
    skillScore: '',
    teamwork: '',
    comms: '',
    region: '',
    gameMode: '',
    playStyle: '',
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const emptyForm = {
      skillScore: '',
      teamwork: '',
      comms: '',
      region: '',
      gameMode: '',
      playStyle: '',
    };

    async function loadProfile() {
      if (!currentUser?.id) {
        setForm(emptyForm);
        setLoadingProfile(false);
        return;
      }

      setLoadingProfile(true);
      setError('');
      setStatus('');

      try {
        const profile = await apiClient.getProfile(currentUser.id);
        if (cancelled) {
          return;
        }

        setForm({
          skillScore: profile.skillScore ?? '',
          teamwork: profile.behaviorMetrics?.teamwork ?? '',
          comms: profile.behaviorMetrics?.comms ?? '',
          region: profile.preferences?.region ?? '',
          gameMode: profile.preferences?.gameMode ?? '',
          playStyle: profile.preferences?.playStyle ?? '',
        });
      } catch (err) {
        if (cancelled) {
          return;
        }

        if (err.statusCode === 404) {
          setForm(emptyForm);
          return;
        }

        setError(err.message);
      } finally {
        if (!cancelled) {
          setLoadingProfile(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const onChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const saveProfile = async () => {
    try {
      setError('');
      setStatus('');
      await apiClient.upsertProfile(currentUser.id, {
        skillScore: Number(form.skillScore),
        behaviorMetrics: {
          teamwork: Number(form.teamwork),
          comms: Number(form.comms),
        },
        preferences: {
          region: form.region || undefined,
          gameMode: form.gameMode || undefined,
          playStyle: form.playStyle || undefined,
        },
      });
      setStatus('profile saved');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="h6">Profile</Typography>
          {status ? <Alert severity="success">{status}</Alert> : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField
            label="Username"
            value={currentUser?.username || ''}
            helperText="Account identity. Displayed here, not edited in Profile."
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Skill"
            type="number"
            value={form.skillScore}
            onChange={onChange('skillScore')}
            helperText="Overall player skill score from 0 to 100."
          />
          <TextField
            label="Teamwork"
            type="number"
            value={form.teamwork}
            onChange={onChange('teamwork')}
            helperText="Behavior metric for cooperation and team play."
          />
          <TextField
            label="Comms"
            type="number"
            value={form.comms}
            onChange={onChange('comms')}
            helperText="Behavior metric for communication style and responsiveness."
          />
          <TextField
            select
            label="Region"
            value={form.region}
            onChange={onChange('region')}
            helperText="Stored in your profile preferences and used for filtering and preference matching."
          >
            {REGION_OPTIONS.map((option) => (
              <MenuItem key={option || 'any-region'} value={option}>
                {option || 'Not set'}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Game Mode"
            value={form.gameMode}
            onChange={onChange('gameMode')}
            helperText="Preferred mode used in matching and search filters."
          >
            {GAME_MODE_OPTIONS.map((option) => (
              <MenuItem key={option || 'any-mode'} value={option}>
                {option || 'Not set'}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Play Style"
            value={form.playStyle}
            onChange={onChange('playStyle')}
            helperText="Preferred play style used in matching and search filters."
          >
            {PLAY_STYLE_OPTIONS.map((option) => (
              <MenuItem key={option || 'any-style'} value={option}>
                {option || 'Not set'}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" color="secondary" onClick={saveProfile} disabled={loadingProfile || !currentUser?.id}>
            Save Profile
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
