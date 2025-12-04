// server/routes/places.js
const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

// --- helpers ---

// Haversine distance (km) between two lat/lng pairs
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius (km)
  const toRad = deg => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Build a walking-style crawl:
 * - Start at the brewery closest to the user.
 * - At each step, pick the nearest remaining brewery.
 * - Enforce a max per-hop distance (km) so hops are "walkable".
 */
function buildWalkingCrawl(candidates, count, maxStepKm = 1.5) {
  if (!candidates.length || count <= 0) return [];

  // Start at the closest to the user (array is already sorted by distance to user)
  const remaining = [...candidates];
  const route = [];

  let current = remaining.shift(); // first element
  route.push(current);

  while (route.length < count && remaining.length) {
    let bestIdx = -1;
    let bestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const p = remaining[i];
      const d = haversineKm(current.lat, current.lng, p.lat, p.lng);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }

    // No remaining candidate is within walking distance
    if (bestIdx === -1 || bestDist > maxStepKm) {
      break;
    }

    current = remaining.splice(bestIdx, 1)[0];
    route.push(current);
  }

  // Set order field
  return route.map((p, idx) => ({ ...p, order: idx }));
}



// GET /api/places/nearby?lat=..&lng=..&count=5
router.get('/nearby', auth, async (req, res) => {
  const { lat, lng, count = 5 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: 'lat and lng are required' });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const desiredCount = Number(count) || 5;

  try {
    // Fetch more candidates than we need so we can form a tighter walking cluster
    const perPage = Math.max(desiredCount * 3, 20);

    const url = `https://api.openbrewerydb.org/v1/breweries?by_dist=${userLat},${userLng}&per_page=${perPage}`;
    const { data } = await axios.get(url);

    // Map into our shape and filter invalid coords
    const candidates = (data || [])
      .map(b => ({
        externalId: b.id,
        name: b.name,
        lat: b.latitude != null ? parseFloat(b.latitude) : NaN,
        lng: b.longitude != null ? parseFloat(b.longitude) : NaN,
        address: `${b.address_1 || ''}, ${b.city || ''}, ${b.state_province || ''} ${
          b.postal_code || ''
        }`.trim(),
      }))
      .filter(p => !Number.isNaN(p.lat) && !Number.isNaN(p.lng));

    // Build a walking-style route
    const walkingRoute = buildWalkingCrawl(candidates, desiredCount, 1.5);

    if (!walkingRoute.length) {
      return res.status(200).json([]);
    }

    res.json(walkingRoute);
  } catch (err) {
    console.error('Error fetching breweries', err.message);
    res.status(500).json({ message: 'Failed to fetch nearby breweries' });
  }
})

// GET /api/places/geocode?city=Atlanta
router.get('/geocode', auth, async (req, res) => {
  const { city } = req.query;

  if (!city || !city.trim()) {
    return res.status(400).json({ message: 'city query parameter is required' });
  }

  try{
    // Nominatim (OpenStreetMap) free geocoding
    const url = 'https://nominatim.openstreetmap.org/search';
    const { data } = await axios.get(url, {
      params: {
        q: city,
        format: 'json',
        limit: 1,
      },
      headers: {
        // Nominatim requires a User-Agent
        'User-Agent': 'nearBeer/1.0 (https://nearBeer.com)',
      },
    });

    if (!data || !data.length) {
      return res.status(404).json({ message: `Could not find a location for "${city}".` });
    }

    const place = data[0];
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(500).json({ message: 'Invalid coordinates returned from geocoder.' });
    }

    res.json({
      lat,
      lng,
      displayName: place.display_name,
    });
  } catch (err) {
    console.error('Geocode error', err.message);
    res.status(500).json({ message: 'Failed to geocode city name.' });
  }
});


module.exports = router;
