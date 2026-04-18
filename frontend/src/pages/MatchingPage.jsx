import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import MatchTable from '../components/MatchTable';
import Visulization from '../components/Visulization';
import { apiClient } from '../api/client';
import { GAME_MODE_OPTIONS, PLAY_STYLE_OPTIONS, REGION_OPTIONS } from '../constants/preferences';

export default function MatchingPage({ currentUser }) {
  const [matches, setMatches] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({
    limit: '5',
    wSkill: '',
    wBehavior: '',
    wPreference: '',
    maxSkillGap: '',
    region: '',
    gameMode: '',
    playStyle: '',
  });

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const getMatchOptions = () => ({
    limit: form.limit,
    wSkill: form.wSkill,
    wBehavior: form.wBehavior,
    wPreference: form.wPreference,
    maxSkillGap: form.maxSkillGap,
    region: form.region,
    gameMode: form.gameMode,
    playStyle: form.playStyle,
  });

  const fetchMatches = async () => {
    try {
      setError('');
      setStatus('');
      const result = await apiClient.getMatches(currentUser.id, getMatchOptions());
      const nextMatches = result.matches || [];
      setMatches(nextMatches);
      setStatus(`received ${nextMatches.length} matches`);
    } catch (err) {
      setMatches([]);
      setError(err.message);
    }
  };

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Matchmaking</Typography>
            {status ? <Alert severity="success">{status}</Alert> : null}
            {error ? <Alert severity="error">{error}</Alert> : null}
            <TextField label="Username" value={currentUser?.username || ''} InputProps={{ readOnly: true }} />
            <Divider />
            <Typography variant="subtitle2" color="text.secondary">
              Ranking controls
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                label="Limit"
                type="number"
                value={form.limit}
                onChange={(event) => updateField('limit', event.target.value)}
                fullWidth
              />
              <TextField
                label="Max Skill Gap"
                type="number"
                value={form.maxSkillGap}
                onChange={(event) => updateField('maxSkillGap', event.target.value)}
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                label="Weight: Skill"
                type="number"
                value={form.wSkill}
                onChange={(event) => updateField('wSkill', event.target.value)}
                fullWidth
              />
              <TextField
                label="Weight: Behavior"
                type="number"
                value={form.wBehavior}
                onChange={(event) => updateField('wBehavior', event.target.value)}
                fullWidth
              />
              <TextField
                label="Weight: Preference"
                type="number"
                value={form.wPreference}
                onChange={(event) => updateField('wPreference', event.target.value)}
                fullWidth
              />
            </Stack>
            <Typography variant="subtitle2" color="text.secondary">
              Filters
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                select
                label="Region"
                value={form.region}
                onChange={(event) => updateField('region', event.target.value)}
                fullWidth
              >
                {REGION_OPTIONS.map((option) => (
                  <MenuItem key={option || 'any-region'} value={option}>
                    {option || 'Any'}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Game Mode"
                value={form.gameMode}
                onChange={(event) => updateField('gameMode', event.target.value)}
                fullWidth
              >
                {GAME_MODE_OPTIONS.map((option) => (
                  <MenuItem key={option || 'any-mode'} value={option}>
                    {option || 'Any'}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Play Style"
                value={form.playStyle}
                onChange={(event) => updateField('playStyle', event.target.value)}
                fullWidth
              >
                {PLAY_STYLE_OPTIONS.map((option) => (
                  <MenuItem key={option || 'any-style'} value={option}>
                    {option || 'Any'}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={fetchMatches}>
                Get Matches
              </Button>
              <Button variant="text" onClick={() => setOpenDialog(true)} disabled={!matches.length}>
                Open Visualization
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Results
          </Typography>
          <MatchTable matches={matches} />
        </CardContent>
      </Card>
      <Visulization open={openDialog} onClose={() => setOpenDialog(false)} matches={matches} />
    </Stack>
  );
}
