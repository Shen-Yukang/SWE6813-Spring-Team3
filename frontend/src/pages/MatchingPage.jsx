import { useEffect, useState } from 'react';
import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import MatchTable from '../components/MatchTable';
import Visulization from '../components/Visulization';
import { apiClient } from '../api/client';

export default function MatchingPage({ currentUser }) {
  const [userId, setUserId] = useState('');
  const [matches, setMatches] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      setUserId(currentUser.id);
    }
  }, [currentUser]);

  const fetchMatches = async () => {
    try {
      setError('');
      const result = await apiClient.getMatches(userId);
      const nextMatches = result.matches || [];
      setMatches(nextMatches);
      setStatus(`received ${nextMatches.length} matches`);
    } catch (err) {
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
            <TextField label="User ID" value={userId} onChange={(event) => setUserId(event.target.value)} />
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
