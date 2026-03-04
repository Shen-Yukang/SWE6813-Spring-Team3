import { Box, LinearProgress, Stack, Typography } from '@mui/material';

export default function MatchTable({ matches }) {
  if (!matches.length) {
    return <Typography color="text.secondary">No matches yet</Typography>;
  }

  return (
    <Stack spacing={2}>
      {matches.map((match) => (
        <Box
          key={match.userId}
          sx={{
            border: '1px solid #d8dee8',
            borderRadius: 2,
            p: 2,
            backgroundColor: '#fbfdff',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {match.userId}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            total score: {match.totalScore.toFixed(3)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.round(match.totalScore * 100)}
            sx={{ height: 10, borderRadius: 999 }}
          />
        </Box>
      ))}
    </Stack>
  );
}
