// frontend/src/components/SavedCrawlsList.js
import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  IconButton,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function SavedCrawlsList({ crawls, onSelect, onDelete }) {
  if (!crawls.length) {
    return (
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        You don’t have any saved crawls yet.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{ mb: 1, fontWeight: 'bold' }}
      >
        My Saved Routes
      </Typography>

      <List disablePadding>
        {crawls.map((crawl) => (
          <ListItem
            key={crawl._id}
            disablePadding
            sx={{
              mb: 0.5,
              borderRadius: 2,
              overflow: 'hidden',
            }}
            secondaryAction={
              <IconButton
                edge="end"
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // don't trigger onSelect
                  onDelete && onDelete(crawl._id);
                }}
                sx={{
                  color: 'inherit',          
                  opacity: 0.8,
                  '&:hover': { opacity: 1 },
                }}
                aria-label={`Delete crawl ${crawl.name}`}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemButton
              onClick={() => onSelect && onSelect(crawl)}
              sx={{
                borderRadius: 2,
                px: 1.25,
                py: 0.75,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.08)', 
                },
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  {crawl.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', opacity: 0.8 }}
                >
                  {(crawl.stops?.length || 0)} stops •{' '}
                  {new Date(crawl.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default SavedCrawlsList;
