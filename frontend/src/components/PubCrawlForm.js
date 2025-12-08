// client/src/components/PubCrawlForm.js
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Paper
} from '@mui/material';

function PubCrawlForm({ onGenerate, onSave, loading }) {
  const [count, setCount] = useState(5);
  const [name, setName] = useState('My Pub Crawl');

  const handleGenerate = (e) => {
    e.preventDefault();
    onGenerate(Number(count));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(name);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Generate Form */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Create a Crawl
        </Typography>

        <Box
          component="form"
          onSubmit={handleGenerate}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            type="number"
            label="Number of beer spots"
            inputProps={{ min: 1, max: 20 }}
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Finding spots…' : 'Generate Crawl'}
          </Button>
        </Box>
      </Paper>

      {/* Save Form */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Save Your Crawl
        </Typography>

        <Box
          component="form"
          onSubmit={handleSave}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Route name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Button
            type="submit"
            variant="outlined"
          >
            Save Crawl
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default PubCrawlForm;
