// client/src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../api.js';
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
import { keyframes } from '@emotion/react';

const bubbleFloat = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-120vh) scale(1.2);
    opacity: 0;
  }
`;

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  // bubbles with different positions/sizes/delays
  const bubbles = [
    { left: '10%', size: 18, duration: 9, delay: 0 },
    { left: '25%', size: 26, duration: 11, delay: 2 },
    { left: '40%', size: 14, duration: 8, delay: 1 },
    { left: '55%', size: 22, duration: 10, delay: 3 },
    { left: '70%', size: 16, duration: 7, delay: 0.5 },
    { left: '85%', size: 20, duration: 12, delay: 4 },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        background: 'radial-gradient(circle at top, #fffde7 0%, #ffe082 35%, #ffb300 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Beer bubble background layer */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {bubbles.map((b, idx) => (
          <Box
            key={idx}
            sx={{
              position: 'absolute',
              bottom: -40,
              left: b.left,
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 30% 30%, #fffde7 0%, #ffe082 35%, #ffca28 70%, #ffa000 100%)',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.7)',
              opacity: 0,
              animation: `${bubbleFloat} ${b.duration}s linear ${b.delay}s infinite`,
            }}
          />
        ))}
      </Box>

      {/* Actual login content */}
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={6}
            sx={{
              width: '100%',
              p: 4,
              borderRadius: 3,
              bgcolor: 'rgba(255, 253, 231, 0.96)',
              border: '1px solid rgba(255, 213, 79, 0.7)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Box textAlign="center" mb={3}>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                sx={{ color: '#5d4037' }}
              >
                🍺 nearBeer
              </Typography>
              <Typography
                variant="subtitle1"
                component="h2"
                mt={1}
                sx={{ color: '#6d4c41' }}
              >
                Find your next crawl
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
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                margin="normal"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  mb: 2,
                  bgcolor: '#ffa000',
                  '&:hover': { bgcolor: '#ff8f00' },
                }}
              >
                Log in
              </Button>
            </Box>

            <Typography variant="body2" align="center" sx={{ color: '#6d4c41' }}>
              New here?{' '}
              <MuiLink component={RouterLink} to="/signup" sx={{ fontWeight: 'bold' }}>
                Sign up
              </MuiLink>
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;
