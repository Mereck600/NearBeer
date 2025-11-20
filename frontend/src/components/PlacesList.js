// client/src/components/PlacesList.js
import React from 'react';

function PlacesList({ places }) {
  if (!places.length) return <p>No spots yet. Try generating a crawl.</p>;

  return (
    <ol>
      {places.map(p => (
        <li key={p.externalId}>
          <strong>{p.order + 1}. {p.name}</strong>
          <br />
          <small>{p.address}</small>
        </li>
      ))}
    </ol>
  );
}

export default PlacesList;
