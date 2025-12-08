// client/src/pages/SignupPage.js
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../auth/AuthContext';

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  Link as MuiLink,
} from '@mui/material';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/signup', { email, password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(circle at top, #ffe082 0, #ffb300 35%, #5d4037 100%)',

        // Bubble keyframes (attached to the page root)
        '@keyframes beerBubble1': {
          '0%': {
            transform: 'translateY(40vh) scale(0.7)',
            opacity: 0,
          },
          '10%': {
            opacity: 0.7,
          },
          '100%': {
            transform: 'translateY(-120vh) scale(1.4)',
            opacity: 0,
          },
        },
        '@keyframes beerBubble2': {
          '0%': {
            transform: 'translateY(50vh) scale(0.5)',
            opacity: 0,
          },
          '15%': {
            opacity: 0.6,
          },
          '100%': {
            transform: 'translateY(-130vh) scale(1.2)',
            opacity: 0,
          },
        },

        // Big amber bubble
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: '-180px',
          left: '12%',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 193, 7, 0.9), rgba(255, 193, 7, 0))',
          opacity: 0.7,
          filter: 'blur(1px)',
          animation: 'beerBubble1 22s linear infinite',
        },

        // Smaller bubble on the right
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-140px',
          right: '10%',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 241, 118, 0.9), rgba(255, 241, 118, 0))',
          opacity: 0.6,
          filter: 'blur(0.5px)',
          animation: 'beerBubble2 26s linear infinite',
        },
      }}
    >
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={6}
          sx={{
            width: '100%',
            p: 4,
            borderRadius: 3,
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              sx={{
                color: '#5d4037',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              nearBeer
            </Typography>
            <Typography
              variant="subtitle1"
              mt={1}
              sx={{ color: '#6d4c41', fontWeight: 500 }}
            >
              Create your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Password (min 6 chars)"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.1,
                fontWeight: 'bold',
                background:
                  'linear-gradient(135deg, #ffca28 0%, #ffb300 40%, #f57c00 100%)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #ffd54f 0%, #ffca28 40%, #fb8c00 100%)',
                },
              }}
            >
              Create Account
            </Button>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Already have an account?{' '}
            <MuiLink
              component={RouterLink}
              to="/login"
              sx={{ fontWeight: 500 }}
            >
              Log in
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default SignupPage;
