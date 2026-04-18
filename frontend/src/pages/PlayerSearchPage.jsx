import { useState } from 'react';
import {
  Box, Button, Chip, Divider, MenuItem, Paper, Select, Slider, Stack, TextField, Typography,
} from '@mui/material';
import { apiClient } from '../api/client';
import { GAME_MODE_OPTIONS, PLAY_STYLE_OPTIONS, REGION_OPTIONS } from '../constants/preferences';

export default function PlayerSearchPage() {
  const [query, setQuery] = useState('');
  const [skillRange, setSkillRange] = useState([0, 100]);
  const [region, setRegion] = useState('');
  const [gameMode, setGameMode] = useState('');
  const [playStyle, setPlayStyle] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');
    try {
      const data = await apiClient.searchPlayers({
        q: query,
        skillMin: skillRange[0],
        skillMax: skillRange[1],
        region: region || undefined,
        gameMode: gameMode || undefined,
        playStyle: playStyle || undefined,
      });
      setResults(data.players);
      setSearched(true);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>Player Search</Typography>

      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Search by username"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            fullWidth
          />

          <Box>
            <Typography variant="body2" gutterBottom>Skill Range: {skillRange[0]} – {skillRange[1]}</Typography>
            <Slider
              value={skillRange}
              onChange={(_, v) => setSkillRange(v)}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
          </Box>

          <Stack direction="row" spacing={2}>
            <Select value={region} onChange={(e) => setRegion(e.target.value)} displayEmpty sx={{ minWidth: 120 }}>
              {REGION_OPTIONS.map((r) => <MenuItem key={r} value={r}>{r || 'Any Region'}</MenuItem>)}
            </Select>
            <Select value={gameMode} onChange={(e) => setGameMode(e.target.value)} displayEmpty sx={{ minWidth: 130 }}>
              {GAME_MODE_OPTIONS.map((m) => <MenuItem key={m} value={m}>{m || 'Any Mode'}</MenuItem>)}
            </Select>
            <Select value={playStyle} onChange={(e) => setPlayStyle(e.target.value)} displayEmpty sx={{ minWidth: 130 }}>
              {PLAY_STYLE_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s || 'Any Style'}</MenuItem>)}
            </Select>
          </Stack>

          <Button variant="contained" onClick={handleSearch}>Search</Button>
          {error && <Typography color="error">{error}</Typography>}
        </Stack>
      </Paper>

      {searched && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {results.length} player{results.length !== 1 ? 's' : ''} found
          </Typography>
          <Divider sx={{ mb: 1 }} />
          {results.length === 0 ? (
            <Typography color="text.secondary">No players match your filters.</Typography>
          ) : (
            <Stack spacing={1}>
              {results.map((p) => (
                <Box key={p.id} sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography fontWeight={600}>{p.username}</Typography>
                    {p.skillScore !== null && (
                      <Chip label={`Skill: ${p.skillScore}`} size="small" color="primary" variant="outlined" />
                    )}
                    {p.preferences.region && <Chip label={p.preferences.region} size="small" />}
                    {p.preferences.gameMode && <Chip label={p.preferences.gameMode} size="small" />}
                    {p.preferences.playStyle && <Chip label={p.preferences.playStyle} size="small" />}
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>
      )}
    </Stack>
  );
}
