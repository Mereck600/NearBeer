// frontend/src/components/LocationControls.js
import React from 'react';
import { Box, Button, TextField, Typography,Paper } from '@mui/material';

function LocationControls({
  cityName,
  manualLat,
  manualLng,
  onCityChange,
  onManualLatChange,
  onManualLngChange,
  onUseCurrentLocation,
  onSubmitCity,
  onSubmitManual,
}) {
  return (
    <Box
      sx={{
        mt: { xs: 1, md: 2 }, 
      }}
    >
    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
    <Typography variant="h6" gutterBottom >
                Location & Crawl Setup
              </Typography>
      <Button
        variant="contained"
        onClick={onUseCurrentLocation}
        sx={{ mb: 2 }}
      >
        Use My Current Location
      </Button>

      {/* City name input */}
      <Box
        component="form"
        onSubmit={onSubmitCity}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          alignItems: 'center',
          mb: 1.5,
        }}
      >
        <TextField
          label="City"
          value={cityName}
          onChange={(e) => onCityChange(e.target.value)}
          placeholder="e.g. Atlanta, GA"
          size="small"
          sx={{ minWidth: 220 }}
        />
        <Button type="submit" variant="outlined">
          Set City
        </Button>
      </Box>

      {/* Manual lat/lng */}
      {/* <Box
        component="form"
        onSubmit={onSubmitManual}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          alignItems: 'center',
          mb: 1.5,
        }}
      >
        <TextField
          label="Lat"
          value={manualLat}
          onChange={(e) => onManualLatChange(e.target.value)}
          size="small"
          sx={{ width: 130 }}
        />
        <TextField
          label="Lng"
          value={manualLng}
          onChange={(e) => onManualLngChange(e.target.value)}
          size="small"
          sx={{ width: 130 }}
        />
        <Button type="submit" variant="outlined">
          Set Location
        </Button>
      </Box> */}

      <Typography variant="caption" color="text.secondary"> 
        Tip: Try <code>Los Angeles</code>, <code>New York</code>,
       
      </Typography> {/*  coords like <code>34.0522</code>, <code>-118.2437</code>.*/}
      </Paper>
    </Box>
  );
}

export default LocationControls;
