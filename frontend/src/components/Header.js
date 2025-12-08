// frontend/src/components/Header.js
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Stack,
  Button,
  Switch,
  FormControlLabel,
} from '@mui/material';

function Header({
  user,
  theme,
  onOpenDrawer,
  onLogout,
  isStout,
  onToggleTheme,
}) {
  return (
    <AppBar
      position="static"
      elevation={0}
      color="transparent"
      sx={{
        bgcolor: theme.headerBg,
        color: theme.headerText,
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side: title */}
        <Typography variant="h5" fontWeight="bold">
          nearBeer
        </Typography>

        {/* Right side: toggle + user + buttons */}
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Ale / Stout toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={isStout}
                onChange={onToggleTheme}
                color="warning"
              />
            }
            label={isStout ? 'Stout mode' : 'Ale mode'}
            sx={{ color: theme.headerText }}
          />

          {user?.email && (
            <Typography variant="body2" sx={{ maxWidth: 200 }} noWrap>
              {user.email}
            </Typography>
          )}

          <Button
            variant="outlined"
            onClick={onOpenDrawer}
            sx={{
              color: theme.headerText,
              borderColor: theme.headerText,
              '&:hover': {
                borderColor: theme.headerText,
                backgroundColor: 'rgba(255,255,255,0.15)',
              },
            }}
          >
            Saved Crawls
          </Button>

          <Button
            variant="outlined"
            onClick={onLogout}
            sx={{
              color: theme.headerText,
              borderColor: theme.headerText,
              '&:hover': {
                borderColor: theme.headerText,
                backgroundColor: 'rgba(255,255,255,0.15)',
              },
            }}
          >
            Log out
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
