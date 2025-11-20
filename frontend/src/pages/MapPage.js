// client/src/pages/MapPage.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../auth/AuthContext';
import MapView from '../components/MapView';
import PlacesList from '../components/PlacesList';
import PubCrawlForm from '../components/PubCrawlForm';
import SavedCrawlsList from '../components/SavedCrawlsList';

function MapPage() {
  const { user, logout } = useAuth();

  const [center, setCenter] = useState(null);    // [lat, lng]
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [crawls, setCrawls] = useState([]);

  // Location controls
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [cityName, setCityName] = useState('');

  // ---- location helpers (NOT hooks) ----
  const getBrowserLocation = () => {
    if (!navigator.geolocation) {
      setMessage('Geolocation is not supported by your browser.');
      return;
    }

    setMessage('Getting your current location...');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCenter([lat, lng]);
        setManualLat(lat.toFixed(6));
        setManualLng(lng.toFixed(6));
        setMessage('Location set to your current position.');
      },
      err => {
        console.error(err);
        setMessage('Could not get your location. You can enter a city or coordinates manually.');
      }
    );
  };

  const handleSetManualLocation = e => {
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

  const handleSetCityLocation = async e => {
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

  const handleDeleteCrawl = async crawlId => {
  try {
    await api.delete(`/crawls/${crawlId}`);

    // Remove from local state
    setCrawls(prev => prev.filter(c => c._id !== crawlId));

    // If the currently shown crawl was deleted, you could optionally clear it:
    // setPlaces([]);
    setMessage('Crawl deleted.');
  } catch (err) {
    console.error(err);
    setMessage('Failed to delete crawl.');
  }
};


  // Get browser location once on first load (if center is not already set)
  useEffect(() => {
    if (!center) {
      getBrowserLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load saved crawls on mount
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

  // ---- crawl generation / saving ----
  const handleGenerate = async count => {
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
        setMessage(`Only found ${spots.length} walkable beer spots near this location.`);
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

  const handleSave = async name => {
    if (!places.length) {
      setMessage('Generate a crawl before saving.');
      return;
    }
    try {
      const res = await api.post('/crawls', { name, stops: places });
      setMessage(`Saved crawl "${res.data.name}".`);

      // Refresh saved crawls list
      const listRes = await api.get('/crawls');
      setCrawls(listRes.data || []);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save crawl.');
    }
  };

  const handleSelectCrawl = crawl => {
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
  };

  return (
    <div className="map-page">
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>nearBeer</h1>
        <div>
          <span>{user?.email}</span>
          <button onClick={logout} style={{ marginLeft: '1rem' }}>
            Log out
          </button>
        </div>
      </header>

      <main style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        {/* Left side: location controls + map + current crawl */}
        <div style={{ flex: 2 }}>
          {/* Location controls */}
          <section
            style={{
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            <h3>Location</h3>

            <button type="button" onClick={getBrowserLocation}>
              Use My Current Location
            </button>

            {/* City name input */}
            <form
              onSubmit={handleSetCityLocation}
              style={{
                marginTop: '0.5rem',
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              <label>
                City:
                <input
                  type="text"
                  value={cityName}
                  onChange={e => setCityName(e.target.value)}
                  placeholder="e.g. Atlanta, GA"
                  style={{ marginLeft: '0.25rem', minWidth: '12rem' }}
                />
              </label>
              <button type="submit">Set City</button>
            </form>

            {/* Manual lat/lng */}
            <form
              onSubmit={handleSetManualLocation}
              style={{
                marginTop: '0.5rem',
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              <label>
                Lat:
                <input
                  type="text"
                  value={manualLat}
                  onChange={e => setManualLat(e.target.value)}
                  style={{ marginLeft: '0.25rem', width: '8rem' }}
                />
              </label>
              <label>
                Lng:
                <input
                  type="text"
                  value={manualLng}
                  onChange={e => setManualLng(e.target.value)}
                  style={{ marginLeft: '0.25rem', width: '8rem' }}
                />
              </label>
              <button type="submit">Set Location</button>
            </form>

            <small>
              Tip: Try <code>Los Angeles</code>, <code>New York</code>, or manual coords like{' '}
              <code>34.0522</code>, <code>-118.2437</code>.
            </small>
          </section>

          <PubCrawlForm
            onGenerate={handleGenerate}
            onSave={handleSave}
            loading={loading}
          />

          {message && <p>{message}</p>}

          <MapView center={center} places={places} />

          <h3 style={{ marginTop: '1rem' }}>Current Crawl Stops</h3>
          <PlacesList places={places} />
        </div>

        {/* Right side: saved routes */}
        <aside style={{ flex: 1, maxWidth: '320px' }}>
          <SavedCrawlsList
            crawls={crawls}
            onSelect={handleSelectCrawl}
            onDelete={handleDeleteCrawl}
          />

        </aside>
      </main>
    </div>
  );
}

export default MapPage;
