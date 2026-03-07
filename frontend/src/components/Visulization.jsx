import { Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';

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
              <Typography key={`${item.userId}-${index}`}>
                {index + 1}. {item.userId} ({item.totalScore.toFixed(3)})
              </Typography>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
