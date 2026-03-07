import { useEffect, useState } from 'react';
import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { apiClient } from '../api/client';

export default function Profile({ currentUser }) {
  const [form, setForm] = useState({
    userId: '',
    skillScore: '',
    teamwork: '',
    comms: '',
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser?.id) {
      setForm((prev) => ({ ...prev, userId: currentUser.id }));
    }
  }, [currentUser]);

  const onChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
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

  return (
    <Card>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="h6">Profile</Typography>
          {status ? <Alert severity="success">{status}</Alert> : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
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
  );
}
