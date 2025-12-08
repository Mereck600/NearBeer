// frontend/src/pages/MapPage.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../auth/AuthContext';
import MapView from '../components/MapView';
import PlacesList from '../components/PlacesList';
import PubCrawlForm from '../components/PubCrawlForm';
import SavedCrawlsList from '../components/SavedCrawlsList';
import LocationControls from '../components/LocationControls';
import Header from '../components/Header';

import {
  Typography,
  Box,
  Paper,
  Alert,
  Divider,
  Drawer,
  IconButton,
  
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function MapPage() {
  const { user, logout } = useAuth();

  const [center, setCenter] = useState(null); // [lat, lng]
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [crawls, setCrawls] = useState([]);

  // Location controls
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [cityName, setCityName] = useState('');

  // Drawer for saved crawls
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 🍺 Ale / Stout theme toggle
  const [isStout, setIsStout] = useState(false);

  const stoutTheme = {
  background: 'linear-gradient(180deg, #3e2723 0%, #4e342e 40%, #6d4c41 100%)',
  headerBg: '#ffffff',
  headerText: '#000000',         
  text: '#fff3e0',
  cardBg: 'rgba(62,39,35,0.9)',
  cardBorder: '1px solid rgba(255,255,255,0.18)',
  drawerBg: '#2d1b16',
  drawerText: '#fff3e0',
};

const aleTheme = {
  background: 'linear-gradient(180deg, #fff8e1 0%, #ffe082 40%, #ffca28 100%)',
  headerBg: '#ffffff',
  headerText: '#3e2723',      
  text: '#3e2723',
  cardBg: 'rgba(255,253,231,0.96)',
  cardBorder: '1px solid rgba(255,213,79,0.7)',
  drawerBg: '#3e2723',
  drawerText: '#fff8e1',
};

const theme = isStout ? stoutTheme : aleTheme;


  // ---- location helpers  ----
  const getBrowserLocation = () => {
    if (!navigator.geolocation) {
      setMessage('Geolocation is not supported by your browser.');
      return;
    }

    setMessage('Getting your current location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCenter([lat, lng]);
        setManualLat(lat.toFixed(6));
        setManualLng(lng.toFixed(6));
        setMessage('Location set to your current position.');
      },
      (err) => {
        console.error(err);
        setMessage(
          'Could not get your location. You can enter a city or coordinates manually.'
        );
      }
    );
  };

  const handleSetManualLocation = (e) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setMessage('Please enter valid numeric latitude and longitude.');
      return;
    }

    setCenter([lat, lng]);
    setMessage(`Location set to (${lat.toFixed(4)}, ${lng.toFixed(4)}).`);
  };

  const handleSetCityLocation = async (e) => {
    e.preventDefault();
    if (!cityName.trim()) {
      setMessage('Please enter a city name.');
      return;
    }

    try {
      setMessage(`Looking up "${cityName}"...`);
      const res = await api.get('/places/geocode', {
        params: { city: cityName },
      });

      const { lat, lng, displayName } = res.data;
      setCenter([lat, lng]);
      setManualLat(lat.toFixed(6));
      setManualLng(lng.toFixed(6));
      setMessage(`Location set to: ${displayName}`);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        `Could not find a location for "${cityName}".`;
      setMessage(msg);
    }
  };

  const handleDeleteCrawl = async (crawlId) => {
    try {
      await api.delete(`/crawls/${crawlId}`);
      setCrawls((prev) => prev.filter((c) => c._id !== crawlId));
      setMessage('Crawl deleted.');
    } catch (err) {
      console.error(err);
      setMessage('Failed to delete crawl.');
    }
  };

  useEffect(() => {
    if (!center) {
      getBrowserLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchCrawls = async () => {
      try {
        const res = await api.get('/crawls');
        setCrawls(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCrawls();
  }, []);

  const handleGenerate = async (count) => {
    if (!center) {
      setMessage('Set a location first (current location, city, or manual).');
      return;
    }
    try {
      setLoading(true);
      setMessage('');
      const [lat, lng] = center;
      const res = await api.get('/places/nearby', {
        params: { lat, lng, count },
      });
      const spots = res.data || [];
      setPlaces(spots);

      if (spots.length === 0) {
        setMessage('No walkable beer spots found near this location.');
      } else if (spots.length < count) {
        setMessage(
          `Only found ${spots.length} walkable beer spots near this location.`
        );
      } else {
        setMessage(`Generated a ${spots.length}-stop walking crawl.`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch beer spots.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (name) => {
    if (!places.length) {
      setMessage('Generate a crawl before saving.');
      return;
    }
    try {
      const res = await api.post('/crawls', { name, stops: places });
      setMessage(`Saved crawl "${res.data.name}".`);

      const listRes = await api.get('/crawls');
      setCrawls(listRes.data || []);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save crawl.');
    }
  };

  const handleSelectCrawl = (crawl) => {
    if (!crawl?.stops?.length) {
      setMessage('This saved crawl has no stops.');
      return;
    }

    const sortedStops = [...crawl.stops].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );

    setPlaces(sortedStops);

    const first = sortedStops[0];
    if (first.lat != null && first.lng != null) {
      setCenter([first.lat, first.lng]);
      setManualLat(first.lat.toFixed(6));
      setManualLng(first.lng.toFixed(6));
    }

    setMessage(`Loaded crawl "${crawl.name}" (${sortedStops.length} stops).`);
    setDrawerOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        background: theme.background,
      }}
    >
      <Header
        user={user}
        theme={theme}
        onOpenDrawer={() => setDrawerOpen(true)}
        onLogout={logout}
        isStout={isStout}
        onToggleTheme={() => setIsStout(prev => !prev)}
      />


      {/* Main content area */}
      <Box
        sx={{
          p: 2,
          height: 'calc(100vh - 64px)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
        }}
      >
        {/* Combined Location + Create Crawl card */}
        <Paper
          elevation={4}
          sx={{
            p: 2,
            borderRadius: 3,
            flexShrink: 0,
            width: '100%',
            maxWidth: 1200,
            bgcolor: theme.cardBg,
            border: theme.cardBorder,
            color: theme.text,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              alignItems: 'flex-start',
              mt: 1,
            }}
          >
            {/* Left: Location controls */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <LocationControls
                cityName={cityName}
                manualLat={manualLat}
                manualLng={manualLng}
                onCityChange={setCityName}
                onManualLatChange={setManualLat}
                onManualLngChange={setManualLng}
                onUseCurrentLocation={getBrowserLocation}
                onSubmitCity={handleSetCityLocation}
                onSubmitManual={handleSetManualLocation}
              />
            </Box>

            {/* Right: Pub crawl form */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <PubCrawlForm
                onGenerate={handleGenerate}
                onSave={handleSave}
                loading={loading}
              />
            </Box>
          </Box>
        </Paper>

        {/* Message */}
        {message && (
          <Alert
            severity="info"
            sx={{
              mb: 1,
              width: '100%',
              maxWidth: 1200,
            }}
          >
            {message}
          </Alert>
        )}

        {/* Map + current crawl*/}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            flexGrow: 1,
            minHeight: 0,
            width: '100%',
            maxWidth: 1200,
          }}
        >
          <Paper
            elevation={4}
            sx={{
              flexGrow: 1,
              borderRadius: 3,
              overflow: 'hidden',
              display: 'flex',
              bgcolor: theme.cardBg,
              border: theme.cardBorder,
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <MapView center={center} places={places} />
            </Box>
          </Paper>

          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: theme.text, fontWeight: 'bold' }}
            >
              Current Crawl Stops
            </Typography>
            <Paper
              elevation={3}
              sx={{
                p: 1.5,
                borderRadius: 3,
                bgcolor: theme.cardBg,
                border: theme.cardBorder,
                color: theme.text,
              }}
            >
              <PlacesList places={places} />
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Right drawer for Saved Crawls */}
      <Drawer
        anchor="right"
        variant="persistent"
        open={drawerOpen}
        sx={{
          '& .MuiDrawer-paper': {
            width: 320,
            boxSizing: 'border-box',
            bgcolor: theme.drawerBg,
            color: theme.drawerText,
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography variant="h6">Saved Crawls</Typography>
            <IconButton
              edge="end"
              size="small"
              onClick={() => setDrawerOpen(false)}
              sx={{ color: theme.drawerText }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.25)' }} />

          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <SavedCrawlsList
              crawls={crawls}
              onSelect={handleSelectCrawl}
              onDelete={handleDeleteCrawl}
            />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}

export default MapPage;
