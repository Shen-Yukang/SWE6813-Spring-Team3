import { Box, Dialog, DialogContent, DialogTitle, LinearProgress, Stack, Typography } from '@mui/material';

function formatScore(value) {
  return typeof value === 'number' ? value.toFixed(3) : '0.000';
}

export default function Visulization({ open, onClose, matches }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Match Visualization</DialogTitle>
      <DialogContent>
        {!matches.length ? (
          <Typography color="text.secondary">No data</Typography>
        ) : (
          <Stack spacing={1.5}>
            {matches.slice(0, 5).map((item, index) => (
              <Box key={`${item.userId}-${index}`} sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#f6f8fb' }}>
                <Typography sx={{ fontWeight: 700 }}>
                  {index + 1}. {item.username || item.userId}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  total {formatScore(item.totalScore)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.round(item.totalScore * 100)}
                  sx={{ height: 8, borderRadius: 999, mb: 1 }}
                />
                <Typography variant="caption" display="block" color="text.secondary">
                  skill {formatScore(item.breakdown?.skillSimilarity)}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  behavior {formatScore(item.breakdown?.behaviorSimilarity)}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  preference {formatScore(item.breakdown?.preferenceCompatibility)}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
