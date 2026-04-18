import { Box, Chip, LinearProgress, Stack, Typography } from '@mui/material';

function formatScore(value) {
  return typeof value === 'number' ? value.toFixed(3) : '0.000';
}

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
            {match.username || match.userId}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            total score: {formatScore(match.totalScore)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.round(match.totalScore * 100)}
            sx={{ height: 10, borderRadius: 999 }}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', rowGap: 1 }}>
            <Chip
              size="small"
              label={`skill ${formatScore(match.breakdown?.skillSimilarity)}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              size="small"
              label={`behavior ${formatScore(match.breakdown?.behaviorSimilarity)}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              size="small"
              label={`preference ${formatScore(match.breakdown?.preferenceCompatibility)}`}
              color="secondary"
              variant="outlined"
            />
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
